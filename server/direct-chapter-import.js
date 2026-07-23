import { handleHostedChapterAdmin } from './chapter-admin.js';

const ADMIN_PAGE_PATHS = new Set(['/admin/chapters', '/admin/chapters/']);
const LOGIN_PATHS = new Set([
  '/api/admin/chapter/login',
  '/api/admin/chapter/session',
  '/api/admin/chapter/logout',
]);
const API_PREFIX = '/api/admin/chapter/';
const IMPORT_PATH = '/api/admin/chapter/import';
const TEMPORARY_SESSION_KEY = 'hunter-temporary-chapter-import-v2';
const MAX_SELECTED_IMAGES = 120;
const MAX_IMPORT_BODY_BYTES = 256 * 1024;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToBase64Url = (bytes) => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlToBytes = (value) => {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const importHmacKey = (secret) => crypto.subtle.importKey(
  'raw',
  encoder.encode(secret),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify'],
);

const signToken = async (payload, secret) => {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  return `${body}.${bytesToBase64Url(signature)}`;
};

const verifyToken = async (token, secret, purpose) => {
  const [body, signatureText, extra] = String(token || '').split('.');
  if (!body || !signatureText || extra) throw new Error('The chapter inspection expired. Inspect the chapter again.');
  const key = await importHmacKey(secret);
  const valid = await crypto.subtle.verify('HMAC', key, base64UrlToBytes(signatureText), encoder.encode(body));
  if (!valid) throw new Error('The chapter inspection expired. Inspect the chapter again.');
  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64UrlToBytes(body)));
  } catch {
    throw new Error('The chapter inspection expired. Inspect the chapter again.');
  }
  if (payload.purpose !== purpose || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('The chapter inspection expired. Inspect the chapter again.');
  }
  return payload;
};

const readImportBody = async (request) => {
  const declared = Number.parseInt(request.headers.get('content-length') || '0', 10);
  if (declared > MAX_IMPORT_BODY_BYTES) throw new Error('The selected-image request is too large.');
  const text = await request.text();
  if (encoder.encode(text).byteLength > MAX_IMPORT_BODY_BYTES) throw new Error('The selected-image request is too large.');
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error('The import request is not valid JSON.');
  }
};

const prepareSelectedImport = async (request) => {
  const body = await readImportBody(request);
  const inspection = await verifyToken(body.importToken, TEMPORARY_SESSION_KEY, 'chapter-import');
  const selected = Array.isArray(body.selectedImageUrls) ? body.selectedImageUrls : inspection.imageUrls;
  if (!Array.isArray(selected) || selected.length < 1 || selected.length > MAX_SELECTED_IMAGES) {
    throw new Error(`Choose between 1 and ${MAX_SELECTED_IMAGES} chapter pictures.`);
  }
  const allowed = new Set(inspection.imageUrls || []);
  const normalized = selected.map((value) => String(value || '').trim());
  if (normalized.some((value) => !allowed.has(value))) throw new Error('One or more selected pictures were not part of the inspected chapter. Inspect it again.');
  if (new Set(normalized).size !== normalized.length) throw new Error('The selected picture list contains duplicates.');

  const nextToken = await signToken({ ...inspection, imageUrls: normalized }, TEMPORARY_SESSION_KEY);
  const headers = new Headers(request.headers);
  headers.set('content-type', 'application/json');
  headers.delete('content-length');
  return new Request(request.url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      importToken: nextToken,
      authorized: body.authorized === true,
      replace: body.replace === true,
    }),
  });
};

const directRequest = async (request, env) => {
  const now = Math.floor(Date.now() / 1000);
  const csrf = crypto.randomUUID();
  const token = await signToken({
    purpose: 'admin-session',
    sub: 'temporary-direct-importer',
    csrf,
    iat: now,
    exp: now + (10 * 60),
  }, TEMPORARY_SESSION_KEY);

  const headers = new Headers(request.headers);
  headers.set('cookie', `hxh_admin_session=${encodeURIComponent(token)}`);
  if (!['GET', 'HEAD'].includes(request.method)) headers.set('x-csrf-token', csrf);

  return handleHostedChapterAdmin(new Request(request, { headers }), {
    ...env,
    ADMIN_SESSION_SECRET: TEMPORARY_SESSION_KEY,
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

  try {
    if (request.method === 'GET' && ADMIN_PAGE_PATHS.has(url.pathname)) return routeDirectPage(request, env);
    if (LOGIN_PATHS.has(url.pathname)) return json(404, 'This temporary importer does not use account login.');
    if (request.method === 'POST' && url.pathname === IMPORT_PATH) {
      return directRequest(await prepareSelectedImport(request), env);
    }
    if (url.pathname.startsWith(API_PREFIX)) return directRequest(request, env);
    return json(404, 'Unknown chapter import endpoint.');
  } catch (error) {
    return json(400, error?.message || 'The chapter import request could not be prepared.');
  }
}
