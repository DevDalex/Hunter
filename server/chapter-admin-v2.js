import {
  detectImage,
  extractChapterImageUrls,
  inferChapterNumber,
  parseGeneratedManifest,
  serializeGeneratedManifest,
} from './chapter-admin.js';
import {
  CHAPTER_BANK_END,
  CHAPTER_BANK_START,
  CHAPTER_HISTORY_PATH,
  buildChapterBank,
  createChapterPageRecord,
  createImportHistoryRecord,
  parseGeneratedHistory,
  serializeGeneratedHistory,
  validateBankChapter,
} from './chapter-bank.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SESSION_COOKIE = 'hxh_admin_session';
const SESSION_TTL_SECONDS = 2 * 60 * 60;
const INSPECTION_TTL_SECONDS = 30 * 60;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 80 * 1024 * 1024;
const GITHUB_API_VERSION = '2022-11-28';
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map();

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const json = (status, payload, headers = {}) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
});

const securityHeaders = (headers = new Headers()) => {
  headers.set('cache-control', 'no-store');
  headers.set('content-security-policy', "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
  headers.set('referrer-policy', 'no-referrer');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
  return headers;
};

const bytesToBase64 = (bytes) => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return btoa(binary);
};
const bytesToBase64Url = (bytes) => bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
const base64UrlToBytes = (value) => {
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};
const base64ToText = (value) => decoder.decode(Uint8Array.from(atob(String(value).replace(/\s/g, '')), (character) => character.charCodeAt(0)));
const randomToken = (size = 24) => { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytesToBase64Url(bytes); };
const hmacKey = (secret) => crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
const signToken = async (payload, secret) => {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(body)));
  return `${body}.${bytesToBase64Url(signature)}`;
};
const verifyToken = async (token, secret, purpose) => {
  const [body, signatureText, extra] = String(token || '').split('.');
  if (!body || !signatureText || extra) throw new HttpError(401, 'Invalid or expired administrator token.');
  const valid = await crypto.subtle.verify('HMAC', await hmacKey(secret), base64UrlToBytes(signatureText), encoder.encode(body));
  if (!valid) throw new HttpError(401, 'Invalid or expired administrator token.');
  let payload;
  try { payload = JSON.parse(decoder.decode(base64UrlToBytes(body))); } catch { throw new HttpError(401, 'Invalid or expired administrator token.'); }
  if (payload.purpose !== purpose || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) throw new HttpError(401, 'Invalid or expired administrator token.');
  return payload;
};
const hashText = async (value) => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value))));
const secureTextEqual = async (left, right) => {
  const [a, b] = await Promise.all([hashText(left), hashText(right)]);
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
};

const requireConfig = (env, names) => {
  const missing = names.filter((name) => !String(env[name] || '').trim());
  if (missing.length) throw new HttpError(503, `Hosted chapter administration is not configured. Missing server secrets: ${missing.join(', ')}.`);
};
const requireSameOrigin = (request) => {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new HttpError(403, 'Cross-origin administrator requests are not allowed.');
};
const cookies = (request) => Object.fromEntries(String(request.headers.get('cookie') || '').split(';').map((value) => value.trim()).filter(Boolean).map((entry) => {
  const index = entry.indexOf('=');
  return index < 0 ? [entry, ''] : [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))];
}));
const sessionCookie = (token, maxAge = SESSION_TTL_SECONDS) => `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
const createSession = async (username, secret) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = { purpose: 'admin-session', sub: username, csrf: randomToken(), iat: now, exp: now + SESSION_TTL_SECONDS };
  return { payload, token: await signToken(payload, secret) };
};
const requireSession = async (request, env, csrf = false) => {
  requireConfig(env, ['ADMIN_SESSION_SECRET']);
  const payload = await verifyToken(cookies(request)[SESSION_COOKIE], env.ADMIN_SESSION_SECRET, 'admin-session');
  if (csrf && request.headers.get('x-csrf-token') !== payload.csrf) throw new HttpError(403, 'Invalid administrator CSRF token.');
  return payload;
};
const clientKey = (request) => request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
const rateLimitLogin = (request) => {
  const key = clientKey(request); const now = Date.now(); const current = loginAttempts.get(key);
  if (!current || now - current.startedAt > LOGIN_WINDOW_MS) { loginAttempts.set(key, { startedAt: now, attempts: 1 }); return; }
  current.attempts += 1;
  if (current.attempts > LOGIN_MAX_ATTEMPTS) throw new HttpError(429, 'Too many login attempts. Wait fifteen minutes and try again.');
};
const readJson = async (request) => {
  if (!String(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Administrator requests must use application/json.');
  try { return await request.json(); } catch { throw new HttpError(400, 'Administrator request body must be valid JSON.'); }
};

const parseHostList = (value, fallback = '') => new Set(String(value || fallback).split(',').map((item) => item.trim().toLowerCase().replace(/^\.+/, '')).filter(Boolean));
const hostAllowed = (hostname, allowlist) => [...allowlist].some((allowed) => hostname.toLowerCase() === allowed || hostname.toLowerCase().endsWith(`.${allowed}`));
const assertAllowedUrl = (input, allowlist, label) => {
  let url;
  try { url = new URL(input); } catch { throw new HttpError(400, `Invalid ${label} URL.`); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new HttpError(400, `${label} must use HTTP or HTTPS.`);
  if (!hostAllowed(url.hostname, allowlist)) throw new HttpError(400, `${label} host is not on the configured allowlist: ${url.hostname}`);
  if (url.username || url.password) throw new HttpError(400, `${label} URLs may not contain credentials.`);
  return url;
};
const readLimited = async (response, limit, label) => {
  const declared = Number.parseInt(response.headers.get('content-length') || '0', 10);
  if (declared > limit) throw new HttpError(413, `${label} exceeds the configured size limit.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > limit) throw new HttpError(413, `${label} exceeds the configured size limit.`);
  return bytes;
};
const fetchAllowed = async (input, { allowlist, label, accept, referer = '', limit }) => {
  let current = assertAllowedUrl(input, allowlist, label);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(current, {
        redirect: 'manual', signal: controller.signal,
        headers: {
          accept,
          'accept-language': 'en-US,en;q=0.8',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
          'cache-control': 'no-cache', pragma: 'no-cache', ...(referer ? { referer } : {}),
        },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) throw new HttpError(502, `${label} redirect did not include a destination.`);
        current = assertAllowedUrl(new URL(location, current).href, allowlist, label);
        continue;
      }
      if (!response.ok) throw new HttpError(502, `${label} returned HTTP ${response.status}.`);
      return { bytes: await readLimited(response, limit, label), contentType: String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase(), finalUrl: current.href };
    } catch (error) {
      if (error?.name === 'AbortError') throw new HttpError(504, `${label} timed out.`);
      throw error;
    } finally { clearTimeout(timeout); }
  }
  throw new HttpError(502, `${label} followed too many redirects.`);
};
const inspectSource = async (sourceUrl, env) => {
  const sourceHosts = parseHostList(env.CHAPTER_SOURCE_HOSTS, '3asq.online');
  const result = await fetchAllowed(sourceUrl, { allowlist: sourceHosts, label: 'Chapter page', accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1', limit: MAX_HTML_BYTES });
  const html = decoder.decode(result.bytes);
  const imageUrls = extractChapterImageUrls(html, result.finalUrl);
  if (!imageUrls.length) throw new HttpError(422, 'No likely chapter-page images were detected on the supplied URL.');
  const imageHosts = parseHostList(env.CHAPTER_IMAGE_HOSTS);
  imageHosts.add(new URL(result.finalUrl).hostname.toLowerCase());
  for (const imageUrl of imageUrls) assertAllowedUrl(imageUrl, imageHosts, 'Chapter image');
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || '';
  return { sourceUrl: result.finalUrl, title, inferredChapter: inferChapterNumber(result.finalUrl), imageUrls };
};
const fetchImage = async (imageUrl, sourceUrl, env) => {
  const imageHosts = parseHostList(env.CHAPTER_IMAGE_HOSTS);
  imageHosts.add(new URL(sourceUrl).hostname.toLowerCase());
  const result = await fetchAllowed(imageUrl, { allowlist: imageHosts, label: 'Chapter image', accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8', referer: sourceUrl, limit: MAX_IMAGE_BYTES });
  return { ...result, ...detectImage(result.bytes, result.contentType, result.finalUrl) };
};

const repositoryConfig = (env) => {
  const repository = String(env.GITHUB_REPOSITORY || 'DevDalex/Hunter'); const [owner, repo, extra] = repository.split('/');
  if (!owner || !repo || extra) throw new HttpError(503, 'GITHUB_REPOSITORY must use owner/repository format.');
  return { owner, repo, repository, branch: String(env.GITHUB_BRANCH || 'main') };
};
const githubRequest = async (env, path, options = {}, optional = false) => {
  requireConfig(env, ['GITHUB_ADMIN_TOKEN']);
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${env.GITHUB_ADMIN_TOKEN}`, 'x-github-api-version': GITHUB_API_VERSION, 'user-agent': 'Hunter-Archive-Chapter-Bank', ...(options.body ? { 'content-type': 'application/json' } : {}), ...(options.headers || {}) },
  });
  const text = await response.text(); let payload;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = { message: text }; }
  if (optional && response.status === 404) return null;
  if (!response.ok) throw new HttpError(response.status === 409 || response.status === 422 ? 409 : 502, `GitHub rejected the chapter-bank request: ${payload?.message || `HTTP ${response.status}`}`);
  return payload;
};
const repositoryState = async (env) => {
  const config = repositoryConfig(env); const base = `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`; const refPath = config.branch.split('/').map(encodeURIComponent).join('/');
  const reference = await githubRequest(env, `${base}/git/ref/heads/${refPath}`);
  const parentSha = reference.object.sha;
  const commit = await githubRequest(env, `${base}/git/commits/${parentSha}`);
  const baseTreeSha = commit.tree.sha;
  const [tree, manifestFile, historyFile] = await Promise.all([
    githubRequest(env, `${base}/git/trees/${baseTreeSha}?recursive=1`),
    githubRequest(env, `${base}/contents/src/data/successionChapterMedia.generated.js?ref=${encodeURIComponent(config.branch)}`),
    githubRequest(env, `${base}/contents/${CHAPTER_HISTORY_PATH}?ref=${encodeURIComponent(config.branch)}`, {}, true),
  ]);
  const manifest = parseGeneratedManifest(base64ToText(manifestFile.content));
  const history = historyFile ? parseGeneratedHistory(base64ToText(historyFile.content)) : [];
  return { ...config, base, refPath, parentSha, baseTreeSha, tree, manifest, history };
};

const publishChapter = async ({ chapter, sourceUrl, imageUrls, replace }, env) => {
  const state = await repositoryState(env);
  const prefix = `public/media/succession-contest/chapters/${chapter}/`;
  const oldPaths = (state.tree.tree || []).filter((entry) => entry.type === 'blob' && entry.path.startsWith(prefix)).map((entry) => entry.path);
  const previousPageCount = Array.isArray(state.manifest[chapter]) ? state.manifest[chapter].length : 0;
  if (!replace && (previousPageCount || oldPaths.length)) throw new HttpError(409, `Chapter ${chapter} already exists. Enable replacement and inspect the source again.`);

  const importedAt = new Date().toISOString(); const records = []; const treeEntries = []; let totalBytes = 0;
  for (const [index, imageUrl] of imageUrls.entries()) {
    const image = await fetchImage(imageUrl, sourceUrl, env);
    totalBytes += image.bytes.byteLength;
    if (totalBytes > MAX_TOTAL_IMAGE_BYTES) throw new HttpError(413, 'The complete chapter exceeds the configured total image limit.');
    const page = index + 1; const filename = `${String(page).padStart(3, '0')}${image.extension}`; const src = `/media/succession-contest/chapters/${chapter}/${filename}`;
    const blob = await githubRequest(env, `${state.base}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: bytesToBase64(image.bytes), encoding: 'base64' }) });
    treeEntries.push({ path: `${prefix}${filename}`, mode: '100644', type: 'blob', sha: blob.sha });
    records.push(await createChapterPageRecord({ chapter, page, filename, src, sourceUrl: image.finalUrl || imageUrl, width: image.width, height: image.height, bytes: image.bytes, importedAt }));
  }

  const newPaths = new Set(treeEntries.map((entry) => entry.path));
  if (replace) for (const oldPath of oldPaths) if (!newPaths.has(oldPath)) treeEntries.push({ path: oldPath, mode: '100644', type: 'blob', sha: null });
  const nextManifest = { ...state.manifest, [chapter]: records };
  const nextHistory = [...state.history, createImportHistoryRecord({ chapter, previousPageCount, newPageCount: records.length, sourceUrl, timestamp: importedAt })];
  const [manifestBlob, historyBlob] = await Promise.all([
    githubRequest(env, `${state.base}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: serializeGeneratedManifest(nextManifest), encoding: 'utf-8' }) }),
    githubRequest(env, `${state.base}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: serializeGeneratedHistory(nextHistory), encoding: 'utf-8' }) }),
  ]);
  treeEntries.push({ path: 'src/data/successionChapterMedia.generated.js', mode: '100644', type: 'blob', sha: manifestBlob.sha });
  treeEntries.push({ path: CHAPTER_HISTORY_PATH, mode: '100644', type: 'blob', sha: historyBlob.sha });
  const nextTree = await githubRequest(env, `${state.base}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: state.baseTreeSha, tree: treeEntries }) });
  const nextCommit = await githubRequest(env, `${state.base}/git/commits`, { method: 'POST', body: JSON.stringify({ message: `Import Chapter Bank ${chapter} pages`, tree: nextTree.sha, parents: [state.parentSha] }) });
  await githubRequest(env, `${state.base}/git/refs/heads/${state.refPath}`, { method: 'PATCH', body: JSON.stringify({ sha: nextCommit.sha, force: false }) });
  return { chapter, pageCount: records.length, totalBytes, commitSha: nextCommit.sha, commitUrl: `https://github.com/${state.repository}/commit/${nextCommit.sha}`, branch: state.branch, bankStatus: 'published' };
};

const routeAdminAsset = async (request, env) => {
  const url = new URL(request.url); url.pathname = '/admin/chapters/index.html';
  const asset = await env.ASSETS.fetch(new Request(url, request));
  return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers: securityHeaders(new Headers(asset.headers)) });
};
const handleLogin = async (request, env) => {
  requireSameOrigin(request); requireConfig(env, ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET']); rateLimitLogin(request);
  const body = await readJson(request);
  if (!(await secureTextEqual(body.username || '', env.ADMIN_USERNAME)) || !(await secureTextEqual(body.password || '', env.ADMIN_PASSWORD))) throw new HttpError(401, 'Incorrect administrator username or password.');
  loginAttempts.delete(clientKey(request)); const session = await createSession(env.ADMIN_USERNAME, env.ADMIN_SESSION_SECRET);
  return json(200, { authenticated: true, username: env.ADMIN_USERNAME, csrfToken: session.payload.csrf }, { 'set-cookie': sessionCookie(session.token) });
};
const handleSession = async (request, env) => { const session = await requireSession(request, env); return json(200, { authenticated: true, username: session.sub, csrfToken: session.csrf, expiresAt: session.exp }); };
const handleLogout = async (request, env) => { requireSameOrigin(request); await requireSession(request, env, true); return json(200, { authenticated: false }, { 'set-cookie': clearSessionCookie() }); };
const handleInspect = async (request, env) => {
  requireSameOrigin(request); await requireSession(request, env, true); requireConfig(env, ['ADMIN_SESSION_SECRET']);
  const body = await readJson(request); if (!body.sourceUrl) throw new HttpError(400, 'A chapter source URL is required.');
  const inspection = await inspectSource(body.sourceUrl, env);
  const chapter = body.chapter === null || body.chapter === undefined || body.chapter === '' ? inspection.inferredChapter : Number.parseInt(body.chapter, 10);
  if (!validateBankChapter(chapter)) throw new HttpError(400, `Chapter must be from ${CHAPTER_BANK_START} through ${CHAPTER_BANK_END}.`);
  const now = Math.floor(Date.now() / 1000);
  const importToken = await signToken({ purpose: 'chapter-import', chapter, sourceUrl: inspection.sourceUrl, title: inspection.title, imageUrls: inspection.imageUrls, iat: now, exp: now + INSPECTION_TTL_SECONDS }, env.ADMIN_SESSION_SECRET);
  const pages = await Promise.all(inspection.imageUrls.map(async (sourceUrl, index) => {
    const page = index + 1; const previewToken = await signToken({ purpose: 'chapter-preview', sourceUrl: inspection.sourceUrl, imageUrl: sourceUrl, page, iat: now, exp: now + INSPECTION_TTL_SECONDS }, env.ADMIN_SESSION_SECRET);
    return { id: `chapter-${chapter}-p${String(page).padStart(3, '0')}`, page, label: `p.${page}`, sourceUrl, previewUrl: `/api/admin/chapter/preview?token=${encodeURIComponent(previewToken)}` };
  }));
  return json(200, { chapter, title: inspection.title, sourceUrl: inspection.sourceUrl, pageCount: pages.length, pages, importToken });
};
const handlePreview = async (request, env) => {
  await requireSession(request, env); requireConfig(env, ['ADMIN_SESSION_SECRET']);
  const payload = await verifyToken(new URL(request.url).searchParams.get('token'), env.ADMIN_SESSION_SECRET, 'chapter-preview');
  const image = await fetchImage(payload.imageUrl, payload.sourceUrl, env);
  return new Response(image.bytes, { status: 200, headers: { 'content-type': image.contentType, 'content-length': String(image.bytes.byteLength), 'cache-control': 'private, max-age=300', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'" } });
};
const handleBank = async (request, env) => {
  await requireSession(request, env); requireConfig(env, ['GITHUB_ADMIN_TOKEN']);
  const state = await repositoryState(env); const bank = buildChapterBank(state.manifest, state.history);
  const match = new URL(request.url).pathname.match(/^\/api\/admin\/chapter\/bank\/(\d+)$/);
  if (!match) return json(200, bank);
  const chapter = Number(match[1]); if (!validateBankChapter(chapter)) throw new HttpError(404, 'Chapter bank record was not found.');
  return json(200, { ...bank.chapters.find((record) => record.chapter === chapter), history: bank.history.filter((entry) => Number(entry.chapter) === chapter) });
};
const handleImport = async (request, env) => {
  requireSameOrigin(request); await requireSession(request, env, true); requireConfig(env, ['ADMIN_SESSION_SECRET', 'GITHUB_ADMIN_TOKEN']);
  const body = await readJson(request); if (body.authorized !== true) throw new HttpError(400, 'Authorization confirmation is required before publishing chapter media.');
  const payload = await verifyToken(body.importToken, env.ADMIN_SESSION_SECRET, 'chapter-import');
  return json(200, await publishChapter({ chapter: payload.chapter, sourceUrl: payload.sourceUrl, imageUrls: payload.imageUrls, replace: body.replace === true }, env));
};

export const isHostedChapterAdminRequest = (url) => url.pathname === '/admin/chapters'
  || url.pathname === '/admin/chapters/'
  || url.pathname.startsWith('/api/admin/chapter/');

export async function handleHostedChapterAdmin(request, env) {
  const url = new URL(request.url);
  try {
    if (request.method === 'GET' && (url.pathname === '/admin/chapters' || url.pathname === '/admin/chapters/')) return routeAdminAsset(request, env);
    if (request.method === 'POST' && url.pathname === '/api/admin/chapter/login') return handleLogin(request, env);
    if (request.method === 'GET' && url.pathname === '/api/admin/chapter/session') return handleSession(request, env);
    if (request.method === 'POST' && url.pathname === '/api/admin/chapter/logout') return handleLogout(request, env);
    if (request.method === 'POST' && url.pathname === '/api/admin/chapter/inspect') return handleInspect(request, env);
    if (request.method === 'GET' && url.pathname === '/api/admin/chapter/preview') return handlePreview(request, env);
    if (request.method === 'GET' && (url.pathname === '/api/admin/chapter/bank' || /^\/api\/admin\/chapter\/bank\/\d+$/.test(url.pathname))) return handleBank(request, env);
    if (request.method === 'POST' && url.pathname === '/api/admin/chapter/import') return handleImport(request, env);
    return json(404, { error: 'Unknown chapter administration endpoint.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    console.error('Hosted chapter bank administration error', error);
    return json(status, { error: status >= 500 ? (error?.message || 'Chapter administration failed.') : error.message });
  }
}
