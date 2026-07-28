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

const verifySecurityHeaders = (response, label) => {
  const policy = response.headers.get('content-security-policy') || '';
  const headers = {
    contentSecurityPolicy: policy,
    contentTypeOptions: response.headers.get('x-content-type-options') || '',
    frameOptions: response.headers.get('x-frame-options') || '',
    referrerPolicy: response.headers.get('referrer-policy') || '',
    permissionsPolicy: response.headers.get('permissions-policy') || '',
    openerPolicy: response.headers.get('cross-origin-opener-policy') || '',
    resourcePolicy: response.headers.get('cross-origin-resource-policy') || '',
  };
  record('security-headers', { label, ...headers });

  assert.match(policy, /default-src 'self'/, `${label} must define a self-only default CSP source.`);
  assert.match(policy, /object-src 'none'/, `${label} must block plugin content.`);
  assert.match(policy, /frame-ancestors 'none'/, `${label} must block framing through CSP.`);
  assert.equal(headers.contentTypeOptions, 'nosniff', `${label} must prevent MIME sniffing.`);
  assert.equal(headers.frameOptions, 'DENY', `${label} must deny legacy framing.`);
  assert.equal(headers.referrerPolicy, 'strict-origin-when-cross-origin', `${label} must define the referrer boundary.`);
  assert.match(headers.permissionsPolicy, /camera=\(\)/, `${label} must disable unneeded browser permissions.`);
  assert.equal(headers.openerPolicy, 'same-origin', `${label} must isolate its browsing context.`);
  assert.equal(headers.resourcePolicy, 'same-origin', `${label} must define a same-origin resource policy.`);
};

try {
  const { default: worker } = await import('../dist/server/index.js');
  record('worker-import', { passed: Boolean(worker?.fetch), type: typeof worker?.fetch });
  assert.equal(typeof worker?.fetch, 'function', 'The built Worker must export a fetch handler.');

  const env = {
    GITHUB_ADMIN_TOKEN: 'worker-build-verification-token',
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

    verifySecurityHeaders(response, pathname);
    assert.match(contentType, /^application\/json\b/i, `${pathname} must return JSON, received ${contentType || 'no content type'} with HTTP ${response.status}.`);
    assert.doesNotMatch(body, /<!doctype|<html/i, `${pathname} must never return index.html.`);
    assert.equal(diagnostic.assetFetches, beforeAssets, `${pathname} must be handled before the ASSETS binding.`);
    assert.doesNotThrow(() => JSON.parse(body), `${pathname} must contain valid JSON.`);
    return { response, payload: JSON.parse(body) };
  };

  const login = await verifyJsonApiResponse('/api/admin/chapter/login');
  assert.equal(login.response.status, 404, 'The removed login endpoint must return HTTP 404.');
  assert.match(login.payload.error || '', /does not use account login/i, 'The removed login endpoint must explain that login is disabled.');

  const publish = await verifyJsonApiResponse('/api/admin/chapter/import', {
    method: 'POST',
    body: JSON.stringify({ authorized: true }),
  });
  assert.notEqual(publish.response.status, 410, 'Website chapter submission must remain enabled.');
  assert.match(publish.payload.error || '', /inspection expired|inspect the chapter again/i, 'The active submit endpoint must validate an inspection token before dispatching work.');

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
  verifySecurityHeaders(page, 'chapter importer page');
  assert.match(page.headers.get('content-security-policy') || '', /script-src 'self' 'unsafe-inline'/, 'The importer CSP must permit its owned inline inspection contract.');
  assert.equal(page.status, 200, 'The temporary chapter importer page must load.');
  assert.match(pageBody, /Temporary chapter importer/i, 'The temporary importer asset must be served instead of the login page.');
  assert.equal(diagnostic.assetFetches, assetsBeforePage + 1, 'The importer page must use exactly one ASSETS fetch.');

  const fallback = await worker.fetch(new Request('https://hunter.example/deep/link', { headers: { accept: 'text/html' } }), env);
  verifySecurityHeaders(fallback, 'SPA fallback');
  assert.equal(fallback.status, 200, 'SPA deep links must retain the index fallback.');

  diagnostic.passed = true;
  await writeFile(diagnosticPath, `${JSON.stringify(diagnostic, null, 2)}\n`, 'utf8');
  console.log('Cloudflare Worker verification passed: login is disabled, submission validates inspected pages, chapter APIs bypass the SPA fallback, application routes retain fallback behavior, and every response carries the security policy.');
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
