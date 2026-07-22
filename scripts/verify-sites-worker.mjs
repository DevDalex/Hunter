#!/usr/bin/env node

import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';

let assetFetches = 0;
const env = {
  ADMIN_SESSION_SECRET: 'sites-build-verification-secret',
  ASSETS: {
    async fetch(request) {
      assetFetches += 1;
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

const request = new Request('https://hunter.example/api/admin/chapter/session', {
  method: 'GET',
  headers: { accept: 'text/html,application/xhtml+xml' },
});
const response = await worker.fetch(request, env);
const contentType = response.headers.get('content-type') || '';
const body = await response.text();

assert.equal(response.status, 401, 'Unauthenticated session checks must return HTTP 401.');
assert.match(contentType, /^application\/json\b/i, 'The session route must return JSON.');
assert.doesNotMatch(body, /<!doctype|<html/i, 'The session route must never return index.html.');
assert.equal(assetFetches, 0, 'The session route must be handled before the ASSETS binding.');
assert.equal(typeof JSON.parse(body).error, 'string', 'The JSON response must include an error message.');

const unknownApiResponse = await worker.fetch(
  new Request('https://hunter.example/api/admin/chapter/unknown', { headers: { accept: 'text/html' } }),
  env,
);
const unknownApiBody = await unknownApiResponse.text();
assert.equal(unknownApiResponse.status, 404, 'Unknown chapter-admin endpoints must return HTTP 404.');
assert.match(unknownApiResponse.headers.get('content-type') || '', /^application\/json\b/i);
assert.doesNotMatch(unknownApiBody, /<!doctype|<html/i);
assert.equal(assetFetches, 0, 'All /api/admin/chapter/* routes must bypass static assets.');

console.log('Sites Worker verification passed: /api/admin/chapter/session and the complete chapter-admin route family return JSON before any SPA fallback.');
