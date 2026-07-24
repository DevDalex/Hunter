#!/usr/bin/env node

import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {
  downloadChapterImages,
  fetchChapterImage,
  inferChapterNumber,
  inspectChapterSource,
} from './lib/succession-chapter-url-source.mjs';

const ROOT = process.cwd();
const HOST = '127.0.0.1';
const PORT = Number.parseInt(process.env.HXH_CHAPTER_ADMIN_PORT || '4174', 10);
const READER_START = 338;
const MAX_CHAPTER_NUMBER = 9999;
const SESSION_TTL = 30 * 60 * 1000;
const BODY_LIMIT = 24 * 1024;
const ADMIN_HTML = path.join(ROOT, 'admin', 'succession-chapter-import.html');
const IMPORTER = path.join(ROOT, 'scripts', 'import-succession-chapter.mjs');
const token = process.env.HXH_CHAPTER_ADMIN_TOKEN || crypto.randomBytes(24).toString('hex');
const sessions = new Map();

const sendJson = (response, status, payload) => {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(body);
};

const readJson = async (request) => {
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > BODY_LIMIT) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
};

const suppliedToken = (request, url) => request.headers['x-admin-token'] || url.searchParams.get('token') || '';
const requireAuth = (request, response, url) => {
  const candidate = String(suppliedToken(request, url));
  const valid = candidate.length === token.length && crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(token));
  if (!valid) sendJson(response, 401, { error: 'Invalid or missing local admin token.' });
  return valid;
};

const cleanupSessions = () => {
  const now = Date.now();
  for (const [id, session] of sessions) if (now - session.createdAt > SESSION_TTL) sessions.delete(id);
};

const requireSession = (id) => {
  cleanupSessions();
  const session = sessions.get(id);
  if (!session) throw new Error('The inspection session expired. Inspect the source URL again.');
  return session;
};

const runImporter = async ({ chapter, directory, replace }) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [IMPORTER, String(chapter), directory, ...(replace ? ['--replace'] : [])], {
    cwd: ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk.toString(); });
  child.stderr.on('data', (chunk) => { output += chunk.toString(); });
  child.once('error', reject);
  child.once('exit', (code) => {
    if (code === 0) resolve(output.trim());
    else reject(new Error(output.trim() || `Local importer exited with code ${code}.`));
  });
});

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${HOST}:${PORT}`);
  try {
    if (request.method === 'GET' && url.pathname === '/') {
      const sourceHtml = await readFile(ADMIN_HTML, 'utf8');
      const html = Buffer.from(sourceHtml
        .replace(' max="414"', '')
        .replaceAll('/hunter-x-hunter/414/', '/hunter-x-hunter/415/'));
      response.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-length': html.length,
        'cache-control': 'no-store',
        'content-security-policy': "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
        'referrer-policy': 'no-referrer',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      });
      response.end(html);
      return;
    }

    if (!url.pathname.startsWith('/api/') || !requireAuth(request, response, url)) return;

    if (request.method === 'POST' && url.pathname === '/api/inspect') {
      const body = await readJson(request);
      if (!body.sourceUrl) throw new Error('A chapter source URL is required.');
      const inspection = await inspectChapterSource(body.sourceUrl);
      const requestedChapter = body.chapter === null || body.chapter === undefined || body.chapter === ''
        ? inspection.inferredChapter || inferChapterNumber(body.sourceUrl)
        : Number.parseInt(body.chapter, 10);
      if (!Number.isInteger(requestedChapter) || requestedChapter < READER_START || requestedChapter > MAX_CHAPTER_NUMBER) {
        throw new Error(`Chapter must be from ${READER_START} through ${MAX_CHAPTER_NUMBER}.`);
      }
      const sessionId = crypto.randomUUID();
      const session = {
        createdAt: Date.now(),
        chapter: requestedChapter,
        sourceUrl: inspection.sourceUrl,
        title: inspection.title,
        imageUrls: inspection.imageUrls,
        previewCache: new Map(),
      };
      sessions.set(sessionId, session);
      sendJson(response, 200, {
        sessionId,
        chapter: requestedChapter,
        title: inspection.title,
        sourceUrl: inspection.sourceUrl,
        pages: inspection.imageUrls.map((sourceUrl, index) => ({
          page: index + 1,
          sourceUrl,
          previewUrl: `/api/preview/${sessionId}/${index + 1}`,
        })),
      });
      return;
    }

    const previewMatch = request.method === 'GET' && url.pathname.match(/^\/api\/preview\/([0-9a-f-]+)\/(\d+)$/i);
    if (previewMatch) {
      const session = requireSession(previewMatch[1]);
      const page = Number.parseInt(previewMatch[2], 10);
      if (!Number.isInteger(page) || page < 1 || page > session.imageUrls.length) throw new Error('Preview page is outside the detected chapter range.');
      let image = session.previewCache.get(page);
      if (!image) {
        image = await fetchChapterImage(session.imageUrls[page - 1], session.sourceUrl);
        session.previewCache.set(page, image);
      }
      response.writeHead(200, {
        'content-type': image.contentType,
        'content-length': image.buffer.length,
        'cache-control': 'private, max-age=300',
        'x-content-type-options': 'nosniff',
      });
      response.end(image.buffer);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/import') {
      const body = await readJson(request);
      const session = requireSession(body.sessionId);
      const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), `hunter-admin-chapter-${session.chapter}-`));
      try {
        await downloadChapterImages({
          imageUrls: session.imageUrls,
          sourceUrl: session.sourceUrl,
          destinationDirectory: temporaryDirectory,
        });
        const output = await runImporter({ chapter: session.chapter, directory: temporaryDirectory, replace: body.replace === true });
        sessions.delete(body.sessionId);
        sendJson(response, 200, {
          chapter: session.chapter,
          pageCount: session.imageUrls.length,
          output: `${output}\n\nChapter ${session.chapter} was imported. Review and commit the chapter folder, generated media manifest, and generated availability index.`,
        });
      } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
      return;
    }

    sendJson(response, 404, { error: 'Unknown local admin endpoint.' });
  } catch (error) {
    sendJson(response, 400, { error: error?.message || 'Chapter import failed.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log('Hunter Archive chapter importer is running locally.');
  console.log(`Open: http://${HOST}:${PORT}/?token=${token}`);
  console.log('The server only listens on this computer. Press Ctrl+C to stop it.');
});
