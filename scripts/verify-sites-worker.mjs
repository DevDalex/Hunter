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

const verifyJsonApiResponse = async (pathname) => {
  const beforeAssets = assetFetches;
  const response = await worker.fetch(
    new Request(`https://hunter.example${pathname}`, {
      method: 'GET',
      headers: { accept: 'text/html,application/xhtml+xml' },
    }),
    env,
  );
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();

  assert.match(contentType, /^application\/json\b/i, `${pathname} must return JSON, received ${contentType || 'no content type'} with HTTP ${response.status}.`);
  assert.doesNotMatch(body, /<!doctype|<html/i, `${pathname} must never return index.html.`);
  assert.equal(assetFetches, beforeAssets, `${pathname} must be handled before the ASSETS binding.`);
  assert.doesNotThrow(() => JSON.parse(body), `${pathname} must contain valid JSON.`);
  return { response, payload: JSON.parse(body) };
};

const session = await verifyJsonApiResponse('/api/admin/chapter/session');
assert.equal(typeof session.payload.error, 'string', 'The unauthenticated session response must include an error message.');

const unknown = await verifyJsonApiResponse('/api/admin/chapter/unknown');
assert.equal(unknown.response.status, 404, 'Unknown chapter-admin endpoints must return HTTP 404.');

console.log(`Sites Worker verification passed: /api/admin/chapter/session returned HTTP ${session.response.status} JSON and the complete chapter-admin route family bypassed SPA fallback.`);
