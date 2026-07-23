import { handleHostedChapterAdmin } from './chapter-admin.js';

const ADMIN_PAGE_PATHS = new Set(['/admin/chapters', '/admin/chapters/']);
const LOGIN_PATHS = new Set([
  '/api/admin/chapter/login',
  '/api/admin/chapter/session',
  '/api/admin/chapter/logout',
]);
const API_PREFIX = '/api/admin/chapter/';
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

const directAdminRequest = async (request, env) => {
  const secret = String(env.GITHUB_ADMIN_TOKEN || '').trim();
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Chapter importing is not configured. Missing GITHUB_ADMIN_TOKEN.' }), {
      status: 503,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const csrf = crypto.randomUUID();
  const token = await signSession({
    purpose: 'admin-session',
    sub: 'private-importer',
    csrf,
    iat: now,
    exp: now + (10 * 60),
  }, secret);

  const headers = new Headers(request.headers);
  headers.set('cookie', `hxh_admin_session=${encodeURIComponent(token)}`);
  if (!['GET', 'HEAD'].includes(request.method)) headers.set('x-csrf-token', csrf);

  const authenticated = new Request(request, { headers });
  return handleHostedChapterAdmin(authenticated, {
    ...env,
    ADMIN_SESSION_SECRET: secret,
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

export const isDirectChapterImportRequest = (url) => ADMIN_PAGE_PATHS.has(url.pathname)
  || url.pathname.startsWith(API_PREFIX);

export async function handleDirectChapterImport(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET' && ADMIN_PAGE_PATHS.has(url.pathname)) return routeDirectPage(request, env);
  if (LOGIN_PATHS.has(url.pathname)) {
    return new Response(JSON.stringify({ error: 'This private importer does not use account login.' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  if (url.pathname.startsWith(API_PREFIX)) return directAdminRequest(request, env);

  return new Response(JSON.stringify({ error: 'Unknown chapter import endpoint.' }), {
    status: 404,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
