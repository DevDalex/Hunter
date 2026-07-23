#!/usr/bin/env node

import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const diagnosticPath = 'cloudflare-worker-diagnostic.json';
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
        if (pathname === '/admin/chapters/direct.html') {
          return new Response('<!doctype html><html><body>Temporary chapter importer</body></html>', {
            status: 200,
            headers: { 'content-type': 'text/html; charset=utf-8' },
          });
        }
        return new Response('Not found', { status: 404 });
      },
    },
  };

  const verifyJsonApiResponse = async (pathname, init = {}) => {
    const beforeAssets = diagnostic.assetFetches;
    const response = await worker.fetch(
      new Request(`https://hunter.example${pathname}`, {
        method: init.method || 'GET',
        headers: { accept: 'application/json', ...(init.body ? { 'content-type': 'application/json' } : {}) },
        ...(init.body ? { body: init.body } : {}),
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

  const login = await verifyJsonApiResponse('/api/admin/chapter/login');
  assert.equal(login.response.status, 404, 'The removed login endpoint must return HTTP 404.');
  assert.match(login.payload.error || '', /does not use account login/i, 'The removed login endpoint must explain that login is disabled.');

  const publish = await verifyJsonApiResponse('/api/admin/chapter/import', { method: 'POST', body: '{}' });
  assert.equal(publish.response.status, 410, 'Direct Worker publishing must remain removed.');
  assert.match(publish.payload.error || '', /GitHub import request/i, 'The retired publish endpoint must direct the page to the GitHub request flow.');

  const unknown = await verifyJsonApiResponse('/api/admin/chapter/unknown');
  assert.equal(unknown.response.status, 404, 'Unknown chapter-import endpoints must return HTTP 404.');

  const assetsBeforePage = diagnostic.assetFetches;
  const page = await worker.fetch(new Request('https://hunter.example/admin/chapters', { headers: { accept: 'text/html' } }), env);
  const pageBody = await page.text();
  record('direct-import-page', {
    status: page.status,
    contentType: page.headers.get('content-type') || '',
    bodyPreview: pageBody.slice(0, 300),
    assetFetchesBefore: assetsBeforePage,
    assetFetchesAfter: diagnostic.assetFetches,
  });
  assert.equal(page.status, 200, 'The temporary chapter importer page must load without any configured token.');
  assert.match(pageBody, /Temporary chapter importer/i, 'The temporary importer asset must be served instead of the login page.');
  assert.equal(diagnostic.assetFetches, assetsBeforePage + 1, 'The importer page must use exactly one ASSETS fetch.');

  diagnostic.passed = true;
  await writeFile(diagnosticPath, `${JSON.stringify(diagnostic, null, 2)}\n`, 'utf8');
  console.log('Cloudflare Worker verification passed: no token is configured, login and direct publishing are disabled, the temporary importer page loads, and chapter inspection APIs bypass the SPA fallback.');
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
