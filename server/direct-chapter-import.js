import { handleHostedChapterAdmin } from './chapter-admin.js';

const ADMIN_PAGE_PATHS = new Set(['/admin/chapters', '/admin/chapters/']);
const LOGIN_PATHS = new Set([
  '/api/admin/chapter/login',
  '/api/admin/chapter/session',
  '/api/admin/chapter/logout',
]);
const API_PREFIX = '/api/admin/chapter/';
const IMPORT_PATH = '/api/admin/chapter/import';
const TEMPORARY_PREVIEW_KEY = 'hunter-temporary-chapter-preview-v1';
const encoder = new TextEncoder();

const bytesToBase64Url = (bytes) => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const signSession = async (payload, secret) => {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  return `${body}.${bytesToBase64Url(signature)}`;
};

const previewRequest = async (request, env) => {
  const now = Math.floor(Date.now() / 1000);
  const csrf = crypto.randomUUID();
  const token = await signSession({
    purpose: 'admin-session',
    sub: 'temporary-import-preview',
    csrf,
    iat: now,
    exp: now + (10 * 60),
  }, TEMPORARY_PREVIEW_KEY);

  const headers = new Headers(request.headers);
  headers.set('cookie', `hxh_admin_session=${encodeURIComponent(token)}`);
  if (!['GET', 'HEAD'].includes(request.method)) headers.set('x-csrf-token', csrf);

  return handleHostedChapterAdmin(new Request(request, { headers }), {
    ...env,
    ADMIN_SESSION_SECRET: TEMPORARY_PREVIEW_KEY,
  });
};

const routeDirectPage = async (request, env) => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = '/admin/chapters/direct.html';
  const response = await env.ASSETS.fetch(new Request(assetUrl, request));
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store');
  headers.set('content-security-policy', "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
  headers.set('referrer-policy', 'no-referrer');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

const json = (status, error) => new Response(JSON.stringify({ error }), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export const isDirectChapterImportRequest = (url) => ADMIN_PAGE_PATHS.has(url.pathname)
  || url.pathname.startsWith(API_PREFIX);

export async function handleDirectChapterImport(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET' && ADMIN_PAGE_PATHS.has(url.pathname)) return routeDirectPage(request, env);
  if (LOGIN_PATHS.has(url.pathname)) return json(404, 'This temporary importer does not use account login.');
  if (url.pathname === IMPORT_PATH) return json(410, 'Direct Worker publishing was removed. Submit the generated GitHub import request instead.');
  if (url.pathname.startsWith(API_PREFIX)) return previewRequest(request, env);

  return json(404, 'Unknown chapter import endpoint.');
}
