#!/usr/bin/env node

import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const diagnosticPath = 'sites-worker-diagnostic.json';
const diagnostic = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  checks: [],
  assetFetches: 0,
  passed: false,
};

const record = (name, details) => {
  diagnostic.checks.push({ name, ...details });
};

try {
  const { default: worker } = await import('../dist/server/index.js');
  record('worker-import', { passed: Boolean(worker?.fetch), type: typeof worker?.fetch });
  assert.equal(typeof worker?.fetch, 'function', 'The built Worker must export a fetch handler.');

  const env = {
    ADMIN_SESSION_SECRET: 'sites-build-verification-secret',
    ASSETS: {
      async fetch(request) {
        diagnostic.assetFetches += 1;
        const pathname = new URL(request.url).pathname;
        if (pathname === '/index.html') {
          return new Response('<!doctype html><html><body>Hunter Archive</body></html>', {
            status: 200,
            headers: { 'content-type': 'text/html; charset=utf-8' },
          });
        }
        return new Response('Not found', { status: 404 });
      },
    },
  };

  const verifyJsonApiResponse = async (pathname) => {
    const beforeAssets = diagnostic.assetFetches;
    const response = await worker.fetch(
      new Request(`https://hunter.example${pathname}`, {
        method: 'GET',
        headers: { accept: 'text/html,application/xhtml+xml' },
      }),
      env,
    );
    const contentType = response.headers.get('content-type') || '';
    const body = await response.text();
    const details = {
      pathname,
      status: response.status,
      contentType,
      bodyPreview: body.slice(0, 300),
      assetFetchesBefore: beforeAssets,
      assetFetchesAfter: diagnostic.assetFetches,
    };
    record('json-api-response', details);

    assert.match(contentType, /^application\/json\b/i, `${pathname} must return JSON, received ${contentType || 'no content type'} with HTTP ${response.status}.`);
    assert.doesNotMatch(body, /<!doctype|<html/i, `${pathname} must never return index.html.`);
    assert.equal(diagnostic.assetFetches, beforeAssets, `${pathname} must be handled before the ASSETS binding.`);
    assert.doesNotThrow(() => JSON.parse(body), `${pathname} must contain valid JSON.`);
    return { response, payload: JSON.parse(body) };
  };

  const session = await verifyJsonApiResponse('/api/admin/chapter/session');
  assert.equal(typeof session.payload.error, 'string', 'The unauthenticated session response must include an error message.');

  const unknown = await verifyJsonApiResponse('/api/admin/chapter/unknown');
  assert.equal(unknown.response.status, 404, 'Unknown chapter-admin endpoints must return HTTP 404.');

  diagnostic.passed = true;
  await writeFile(diagnosticPath, `${JSON.stringify(diagnostic, null, 2)}\n`, 'utf8');
  console.log(`Sites Worker verification passed: /api/admin/chapter/session returned HTTP ${session.response.status} JSON and the complete chapter-admin route family bypassed SPA fallback.`);
} catch (error) {
  diagnostic.error = {
    name: error?.name || 'Error',
    message: error?.message || String(error),
    stack: error?.stack || null,
  };
  await writeFile(diagnosticPath, `${JSON.stringify(diagnostic, null, 2)}\n`, 'utf8');
  console.error(JSON.stringify(diagnostic, null, 2));
  process.exitCode = 1;
}
