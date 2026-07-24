const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SESSION_COOKIE = 'hxh_admin_session';
const SESSION_TTL_SECONDS = 2 * 60 * 60;
const INSPECTION_TTL_SECONDS = 30 * 60;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 80 * 1024 * 1024;
const MAX_CANDIDATES = 120;
const READER_START = 338;
const READER_END = 9999;
const GITHUB_API_VERSION = '2022-11-28';
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map();

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const jsonResponse = (status, payload, headers = {}) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...headers,
  },
});

const securityHeaders = (headers = new Headers()) => {
  headers.set('cache-control', 'no-store');
  headers.set('content-security-policy', "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
  headers.set('referrer-policy', 'no-referrer');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
  return headers;
};

const chunkedBinary = (bytes) => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return binary;
};

const bytesToBase64 = (bytes) => btoa(chunkedBinary(bytes));
const bytesToBase64Url = (bytes) => bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
const textToBase64Url = (value) => bytesToBase64Url(encoder.encode(value));
const base64UrlToBytes = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};
const base64ToText = (value) => decoder.decode(Uint8Array.from(atob(value.replace(/\s/g, '')), (character) => character.charCodeAt(0)));

const randomToken = (bytes = 24) => {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return bytesToBase64Url(value);
};

const importHmacKey = (secret) => crypto.subtle.importKey(
  'raw',
  encoder.encode(secret),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify'],
);

const signToken = async (payload, secret) => {
  const body = textToBase64Url(JSON.stringify(payload));
  const key = await importHmacKey(secret);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  return `${body}.${bytesToBase64Url(signature)}`;
};

const verifyToken = async (token, secret, purpose) => {
  const [body, signatureText, extra] = String(token || '').split('.');
  if (!body || !signatureText || extra) throw new HttpError(401, 'Invalid or expired administrator token.');
  const key = await importHmacKey(secret);
  const signature = base64UrlToBytes(signatureText);
  const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(body));
  if (!valid) throw new HttpError(401, 'Invalid or expired administrator token.');
  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64UrlToBytes(body)));
  } catch {
    throw new HttpError(401, 'Invalid or expired administrator token.');
  }
  if (payload.purpose !== purpose || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new HttpError(401, 'Invalid or expired administrator token.');
  }
  return payload;
};

const hashText = async (value) => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value))));
const secureTextEqual = async (left, right) => {
  const [leftHash, rightHash] = await Promise.all([hashText(left), hashText(right)]);
  let difference = 0;
  for (let index = 0; index < leftHash.length; index += 1) difference |= leftHash[index] ^ rightHash[index];
  return difference === 0;
};

const parseCookies = (request) => Object.fromEntries(
  String(request.headers.get('cookie') || '')
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const index = entry.indexOf('=');
      return index < 0 ? [entry, ''] : [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))];
    }),
);

const sessionCookie = (token, maxAge = SESSION_TTL_SECONDS) => `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

const requireConfig = (env, names) => {
  const missing = names.filter((name) => !String(env[name] || '').trim());
  if (missing.length) throw new HttpError(503, `Hosted chapter administration is not configured. Missing server secrets: ${missing.join(', ')}.`);
};

const requireSameOrigin = (request) => {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new HttpError(403, 'Cross-origin administrator requests are not allowed.');
};

const readJson = async (request, limit = 32 * 1024) => {
  if (!String(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Administrator requests must use application/json.');
  }
  const reader = request.body?.getReader();
  if (!reader) return {};
  const chunks = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) throw new HttpError(413, 'Administrator request body is too large.');
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(decoder.decode(bytes));
  } catch {
    throw new HttpError(400, 'Administrator request body must be valid JSON.');
  }
};

const clientKey = (request) => request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
const checkLoginRate = (request) => {
  const key = clientKey(request);
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (!current || now - current.startedAt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { startedAt: now, attempts: 1 });
    return;
  }
  current.attempts += 1;
  if (current.attempts > LOGIN_MAX_ATTEMPTS) throw new HttpError(429, 'Too many login attempts. Wait fifteen minutes and try again.');
};
const clearLoginRate = (request) => loginAttempts.delete(clientKey(request));

const createSession = async (username, secret) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    purpose: 'admin-session',
    sub: username,
    csrf: randomToken(24),
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  return { payload, token: await signToken(payload, secret) };
};

const requireSession = async (request, env, { csrf = false } = {}) => {
  requireConfig(env, ['ADMIN_SESSION_SECRET']);
  const token = parseCookies(request)[SESSION_COOKIE];
  const payload = await verifyToken(token, env.ADMIN_SESSION_SECRET, 'admin-session');
  if (csrf && request.headers.get('x-csrf-token') !== payload.csrf) throw new HttpError(403, 'Invalid administrator CSRF token.');
  return payload;
};

const parseHostList = (value, fallback = '') => new Set(
  String(value || fallback)
    .split(',')
    .map((item) => item.trim().toLowerCase().replace(/^\.+/, ''))
    .filter(Boolean),
);

const hostAllowed = (hostname, allowedHosts) => {
  const normalized = hostname.toLowerCase();
  for (const allowed of allowedHosts) {
    if (normalized === allowed || normalized.endsWith(`.${allowed}`)) return true;
  }
  return false;
};

const assertAllowedUrl = (input, allowedHosts, label) => {
  let url;
  try {
    url = new URL(input);
  } catch {
    throw new HttpError(400, `Invalid ${label} URL.`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new HttpError(400, `${label} must use HTTP or HTTPS.`);
  if (!hostAllowed(url.hostname, allowedHosts)) throw new HttpError(400, `${label} host is not on the configured allowlist: ${url.hostname}`);
  if (url.username || url.password) throw new HttpError(400, `${label} URLs may not contain embedded credentials.`);
  return url;
};

const readLimitedResponse = async (response, limit, label) => {
  const declared = Number.parseInt(response.headers.get('content-length') || '0', 10);
  if (declared && declared > limit) throw new HttpError(413, `${label} exceeds the configured size limit.`);
  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new HttpError(413, `${label} exceeds the configured size limit.`);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
};

const fetchAllowed = async (input, {
  allowedHosts,
  label,
  accept,
  referer = '',
  maxBytes,
}) => {
  let current = assertAllowedUrl(input, allowedHosts, label);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(current, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          accept,
          'accept-language': 'en-US,en;q=0.8',
          'user-agent': 'Hunter-Archive-Chapter-Importer/2.0',
          ...(referer ? { referer } : {}),
        },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) throw new HttpError(502, `${label} redirect did not include a destination.`);
        current = assertAllowedUrl(new URL(location, current).href, allowedHosts, label);
        continue;
      }
      if (!response.ok) throw new HttpError(502, `${label} returned HTTP ${response.status}.`);
      return {
        bytes: await readLimitedResponse(response, maxBytes, label),
        contentType: String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase(),
        finalUrl: current.href,
      };
    } catch (error) {
      if (error?.name === 'AbortError') throw new HttpError(504, `${label} timed out.`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new HttpError(502, `${label} followed too many redirects.`);
};

const decodeHtml = (value = '') => value
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/\\\//g, '/');

const parseAttributes = (tag) => {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of tag.matchAll(pattern)) attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  return attributes;
};

const candidateScore = (url, context = '') => {
  const haystack = `${url.pathname} ${url.search} ${context}`.toLowerCase();
  const basename = decodeURIComponent(url.pathname.split('/').pop() || '');
  let score = 0;
  if (/wp-manga-chapter-img|reading-content|chapter[-_ ]?(?:image|page)|manga[-_ ]?page/.test(context.toLowerCase())) score += 120;
  if (/\.(?:jpe?g|png|webp)(?:$|[?#])/i.test(url.href)) score += 30;
  if (/\/wp-content\/uploads\/wp-manga\/data\//i.test(url.pathname)) score += 65;
  if (/\/(?:manga|chapter|chapters|reader|pages?)\//i.test(url.pathname)) score += 30;
  if (/^\d{1,4}(?:[-_.]\d+)?\.(?:jpe?g|png|webp)$/i.test(basename)) score += 45;
  if (/logo|avatar|gravatar|emoji|icon|comment|rating|spinner|placeholder|advert|banner|social|profile/i.test(haystack)) score -= 150;
  return score;
};

const numericPage = (url) => {
  const basename = decodeURIComponent(url.pathname.split('/').pop() || '');
  const match = basename.match(/^(\d{1,4})(?:[-_.]|\.)/);
  return match ? Number(match[1]) : null;
};

export const inferChapterNumber = (sourceUrl) => {
  try {
    const url = new URL(sourceUrl);
    for (const segment of url.pathname.split('/').filter(Boolean).reverse()) {
      const match = segment.match(/^(?:chapter[-_ ]?)?(\d{3,4})$/i);
      if (match) return Number(match[1]);
    }
  } catch {}
  return null;
};

export const extractChapterImageUrls = (html, pageUrl) => {
  const base = new URL(pageUrl);
  const discovered = [];
  let order = 0;
  const add = (rawValue, context = '') => {
    const value = decodeHtml(String(rawValue || '').trim());
    if (!value || value.startsWith('data:') || value.startsWith('blob:') || value === '#') return;
    let url;
    try { url = new URL(value, base); } catch { return; }
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const score = candidateScore(url, context);
    if (score < 20) return;
    discovered.push({ url: url.href, score, order: order += 1, directory: new URL('.', url).href });
  };
  for (const match of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    const context = `${attrs.class || ''} ${attrs.id || ''} ${attrs.alt || ''}`;
    for (const name of ['data-src', 'data-lazy-src', 'data-original', 'data-url', 'data-cfsrc', 'src']) add(attrs[name], context);
    for (const name of ['data-srcset', 'srcset']) {
      for (const entry of String(attrs[name] || '').split(',')) add(entry.trim().split(/\s+/)[0], context);
    }
  }
  const normalizedHtml = html.replace(/\\\//g, '/');
  for (const match of normalizedHtml.matchAll(/(?:https?:)?\/\/[^\s"'<>]+?\.(?:jpe?g|png|webp)(?:\?[^\s"'<>]*)?/gi)) add(match[0], 'embedded image URL');
  const byUrl = new Map();
  for (const item of discovered) {
    const existing = byUrl.get(item.url);
    if (!existing || item.score > existing.score) byUrl.set(item.url, item);
  }
  const unique = [...byUrl.values()];
  const explicit = unique.filter((item) => item.score >= 100);
  let selected = explicit;
  if (!selected.length) {
    const groups = new Map();
    for (const item of unique) {
      const group = groups.get(item.directory) || [];
      group.push(item);
      groups.set(item.directory, group);
    }
    selected = [...groups.values()]
      .filter((group) => group.length >= 2)
      .sort((left, right) => right.length - left.length || Math.max(...right.map((item) => item.score)) - Math.max(...left.map((item) => item.score)))[0]
      || unique.filter((item) => item.score >= 50);
  }
  const numeric = selected.length > 1 && selected.every((item) => numericPage(new URL(item.url)) !== null);
  selected.sort((left, right) => numeric
    ? numericPage(new URL(left.url)) - numericPage(new URL(right.url)) || left.order - right.order
    : left.order - right.order);
  return selected.slice(0, MAX_CANDIDATES).map((item) => item.url);
};

const titleFromHtml = (html) => decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const readUInt24LE = (view, offset) => view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16);

export const detectImage = (bytes, contentType = '', sourceUrl = '') => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length >= 24 && bytes[0] === 0x89 && decoder.decode(bytes.subarray(1, 4)) === 'PNG') {
    return { extension: '.png', contentType: 'image/png', width: view.getUint32(16, false), height: view.getUint32(20, false) };
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    const frames = new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      while (bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      offset += 1;
      if (marker === 0xd8 || marker === 0xd9) continue;
      if (marker === 0xda || offset + 1 >= bytes.length) break;
      const length = view.getUint16(offset, false);
      if (length < 2 || offset + length > bytes.length) break;
      if (frames.has(marker)) {
        return { extension: '.jpg', contentType: 'image/jpeg', height: view.getUint16(offset + 3, false), width: view.getUint16(offset + 5, false) };
      }
      offset += length;
    }
  }
  if (bytes.length >= 30 && decoder.decode(bytes.subarray(0, 4)) === 'RIFF' && decoder.decode(bytes.subarray(8, 12)) === 'WEBP') {
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const type = decoder.decode(bytes.subarray(offset, offset + 4));
      const size = view.getUint32(offset + 4, true);
      const data = offset + 8;
      if (type === 'VP8X' && data + 10 <= bytes.length) return { extension: '.webp', contentType: 'image/webp', width: readUInt24LE(view, data + 4) + 1, height: readUInt24LE(view, data + 7) + 1 };
      if (type === 'VP8L' && data + 5 <= bytes.length && bytes[data] === 0x2f) {
        const b1=bytes[data+1], b2=bytes[data+2], b3=bytes[data+3], b4=bytes[data+4];
        return { extension: '.webp', contentType: 'image/webp', width: 1 + (((b2 & 0x3f) << 8) | b1), height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)) };
      }
      if (type === 'VP8 ' && data + 10 <= bytes.length && bytes[data+3] === 0x9d && bytes[data+4] === 0x01 && bytes[data+5] === 0x2a) {
        return { extension: '.webp', contentType: 'image/webp', width: view.getUint16(data + 6, true) & 0x3fff, height: view.getUint16(data + 8, true) & 0x3fff };
      }
      offset = data + size + (size % 2);
    }
  }
  throw new HttpError(415, `Downloaded content is not a supported JPG, PNG, or WebP image${sourceUrl ? `: ${sourceUrl}` : ''}.`);
};

const inspectSource = async (sourceUrl, env) => {
  const sourceHosts = parseHostList(env.CHAPTER_SOURCE_HOSTS, '3asq.online');
  const result = await fetchAllowed(sourceUrl, {
    allowedHosts: sourceHosts,
    label: 'Chapter page',
    accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
    maxBytes: MAX_HTML_BYTES,
  });
  const html = decoder.decode(result.bytes);
  const imageUrls = extractChapterImageUrls(html, result.finalUrl);
  if (!imageUrls.length) throw new HttpError(422, 'No likely chapter-page images were detected on the supplied URL.');
  const imageHosts = parseHostList(env.CHAPTER_IMAGE_HOSTS);
  imageHosts.add(new URL(result.finalUrl).hostname.toLowerCase());
  for (const imageUrl of imageUrls) assertAllowedUrl(imageUrl, imageHosts, 'Chapter image');
  return { sourceUrl: result.finalUrl, title: titleFromHtml(html), inferredChapter: inferChapterNumber(result.finalUrl), imageUrls };
};

const fetchImage = async (imageUrl, sourceUrl, env) => {
  const imageHosts = parseHostList(env.CHAPTER_IMAGE_HOSTS);
  imageHosts.add(new URL(sourceUrl).hostname.toLowerCase());
  const result = await fetchAllowed(imageUrl, {
    allowedHosts: imageHosts,
    label: 'Chapter image',
    accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    referer: sourceUrl,
    maxBytes: MAX_IMAGE_BYTES,
  });
  return { ...result, ...detectImage(result.bytes, result.contentType, result.finalUrl) };
};

const githubRequest = async (env, path, options = {}) => {
  requireConfig(env, ['GITHUB_ADMIN_TOKEN']);
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${env.GITHUB_ADMIN_TOKEN}`,
      'x-github-api-version': GITHUB_API_VERSION,
      'user-agent': 'Hunter-Archive-Chapter-Admin',
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = { message: text }; }
  if (!response.ok) throw new HttpError(response.status === 409 || response.status === 422 ? 409 : 502, `GitHub rejected the chapter update: ${payload?.message || `HTTP ${response.status}`}`);
  return payload;
};

const repositoryConfig = (env) => {
  const repository = String(env.GITHUB_REPOSITORY || 'DevDalex/Hunter');
  const parts = repository.split('/');
  if (parts.length !== 2 || parts.some((part) => !part)) throw new HttpError(503, 'GITHUB_REPOSITORY must use owner/repository format.');
  return { owner: parts[0], repo: parts[1], repository, branch: String(env.GITHUB_BRANCH || 'main') };
};

export const parseGeneratedManifest = (source) => {
  const match = String(source).match(/export const authorizedSuccessionChapterMedia = Object\.freeze\(([\s\S]*?)\);\s*$/);
  if (!match) throw new HttpError(500, 'The generated chapter manifest does not match the expected format.');
  try { return JSON.parse(match[1]); } catch { throw new HttpError(500, 'The generated chapter manifest contains invalid JSON.'); }
};

export const serializeGeneratedManifest = (manifest) => `// Generated by the Succession chapter import tools.\n// Do not edit page records manually; re-run an importer instead.\nexport const authorizedSuccessionChapterMedia = Object.freeze(${JSON.stringify(manifest, null, 2)});\n`;

const publishChapter = async ({ chapter, sourceUrl, imageUrls, replace }, env) => {
  const { owner, repo, repository, branch } = repositoryConfig(env);
  const base = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const refPath = branch.split('/').map(encodeURIComponent).join('/');
  const reference = await githubRequest(env, `${base}/git/ref/heads/${refPath}`);
  const parentSha = reference.object.sha;
  const commit = await githubRequest(env, `${base}/git/commits/${parentSha}`);
  const baseTreeSha = commit.tree.sha;
  const [tree, manifestFile] = await Promise.all([
    githubRequest(env, `${base}/git/trees/${baseTreeSha}?recursive=1`),
    githubRequest(env, `${base}/contents/src/data/successionChapterMedia.generated.js?ref=${encodeURIComponent(branch)}`),
  ]);
  const manifest = parseGeneratedManifest(base64ToText(manifestFile.content));
  const prefix = `public/media/succession-contest/chapters/${chapter}/`;
  const oldPaths = (tree.tree || []).filter((entry) => entry.type === 'blob' && entry.path.startsWith(prefix)).map((entry) => entry.path);
  if (!replace && (manifest[String(chapter)] || oldPaths.length)) throw new HttpError(409, `Chapter ${chapter} already exists. Enable replacement and inspect the source again.`);

  const records = [];
  const treeEntries = [];
  let totalBytes = 0;
  for (const [index, imageUrl] of imageUrls.entries()) {
    const image = await fetchImage(imageUrl, sourceUrl, env);
    totalBytes += image.bytes.byteLength;
    if (totalBytes > MAX_TOTAL_IMAGE_BYTES) throw new HttpError(413, 'The complete chapter exceeds the configured total image limit.');
    const filename = `${String(index + 1).padStart(3, '0')}${image.extension}`;
    const blob = await githubRequest(env, `${base}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: bytesToBase64(image.bytes), encoding: 'base64' }),
    });
    treeEntries.push({ path: `${prefix}${filename}`, mode: '100644', type: 'blob', sha: blob.sha });
    records.push({ page: index + 1, src: `/media/succession-contest/chapters/${chapter}/${filename}`, width: image.width, height: image.height });
  }

  const newPaths = new Set(treeEntries.map((entry) => entry.path));
  if (replace) {
    for (const oldPath of oldPaths) if (!newPaths.has(oldPath)) treeEntries.push({ path: oldPath, mode: '100644', type: 'blob', sha: null });
  }
  const nextManifest = { ...manifest, [chapter]: records };
  const manifestBlob = await githubRequest(env, `${base}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: serializeGeneratedManifest(nextManifest), encoding: 'utf-8' }),
  });
  treeEntries.push({ path: 'src/data/successionChapterMedia.generated.js', mode: '100644', type: 'blob', sha: manifestBlob.sha });
  const nextTree = await githubRequest(env, `${base}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
  });
  const nextCommit = await githubRequest(env, `${base}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message: `Import Succession Chapter ${chapter} pages`, tree: nextTree.sha, parents: [parentSha] }),
  });
  await githubRequest(env, `${base}/git/refs/heads/${refPath}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: nextCommit.sha, force: false }),
  });
  return {
    chapter,
    pageCount: records.length,
    totalBytes,
    commitSha: nextCommit.sha,
    commitUrl: `https://github.com/${repository}/commit/${nextCommit.sha}`,
    branch,
  };
};

const routeAdminAsset = async (request, env) => {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = '/admin/chapters/index.html';
  const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
  const headers = securityHeaders(new Headers(asset.headers));
  return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers });
};

const handleLogin = async (request, env) => {
  requireSameOrigin(request);
  requireConfig(env, ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET']);
  checkLoginRate(request);
  const body = await readJson(request);
  const valid = (await secureTextEqual(body.username || '', env.ADMIN_USERNAME)) && (await secureTextEqual(body.password || '', env.ADMIN_PASSWORD));
  if (!valid) throw new HttpError(401, 'Incorrect administrator username or password.');
  clearLoginRate(request);
  const session = await createSession(env.ADMIN_USERNAME, env.ADMIN_SESSION_SECRET);
  return jsonResponse(200, { authenticated: true, username: env.ADMIN_USERNAME, csrfToken: session.payload.csrf }, { 'set-cookie': sessionCookie(session.token) });
};

const handleSession = async (request, env) => {
  const session = await requireSession(request, env);
  return jsonResponse(200, { authenticated: true, username: session.sub, csrfToken: session.csrf, expiresAt: session.exp });
};

const handleLogout = async (request, env) => {
  requireSameOrigin(request);
  await requireSession(request, env, { csrf: true });
  return jsonResponse(200, { authenticated: false }, { 'set-cookie': clearSessionCookie() });
};

const handleInspect = async (request, env) => {
  requireSameOrigin(request);
  await requireSession(request, env, { csrf: true });
  requireConfig(env, ['ADMIN_SESSION_SECRET']);
  const body = await readJson(request);
  if (!body.sourceUrl) throw new HttpError(400, 'A chapter source URL is required.');
  const inspection = await inspectSource(body.sourceUrl, env);
  const chapter = body.chapter === null || body.chapter === undefined || body.chapter === ''
    ? inspection.inferredChapter
    : Number.parseInt(body.chapter, 10);
  if (!Number.isInteger(chapter) || chapter < READER_START || chapter > READER_END) throw new HttpError(400, `Chapter must be from ${READER_START} through ${READER_END}.`);
  const now = Math.floor(Date.now() / 1000);
  const importToken = await signToken({ purpose: 'chapter-import', chapter, sourceUrl: inspection.sourceUrl, title: inspection.title, imageUrls: inspection.imageUrls, iat: now, exp: now + INSPECTION_TTL_SECONDS }, env.ADMIN_SESSION_SECRET);
  const pages = await Promise.all(inspection.imageUrls.map(async (sourceUrl, index) => {
    const previewToken = await signToken({ purpose: 'chapter-preview', sourceUrl: inspection.sourceUrl, imageUrl: sourceUrl, page: index + 1, iat: now, exp: now + INSPECTION_TTL_SECONDS }, env.ADMIN_SESSION_SECRET);
    return { page: index + 1, sourceUrl, previewUrl: `/api/admin/chapter/preview?token=${encodeURIComponent(previewToken)}` };
  }));
  return jsonResponse(200, { chapter, title: inspection.title, sourceUrl: inspection.sourceUrl, pages, importToken });
};

const handlePreview = async (request, env) => {
  await requireSession(request, env);
  requireConfig(env, ['ADMIN_SESSION_SECRET']);
  const token = new URL(request.url).searchParams.get('token');
  const payload = await verifyToken(token, env.ADMIN_SESSION_SECRET, 'chapter-preview');
  const image = await fetchImage(payload.imageUrl, payload.sourceUrl, env);
  return new Response(image.bytes, {
    status: 200,
    headers: {
      'content-type': image.contentType,
      'content-length': String(image.bytes.byteLength),
      'cache-control': 'private, max-age=300',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'",
    },
  });
};

const handleImport = async (request, env) => {
  requireSameOrigin(request);
  await requireSession(request, env, { csrf: true });
  requireConfig(env, ['ADMIN_SESSION_SECRET', 'GITHUB_ADMIN_TOKEN']);
  const body = await readJson(request);
  if (body.authorized !== true) throw new HttpError(400, 'Authorization confirmation is required before publishing chapter media.');
  const payload = await verifyToken(body.importToken, env.ADMIN_SESSION_SECRET, 'chapter-import');
  const result = await publishChapter({ chapter: payload.chapter, sourceUrl: payload.sourceUrl, imageUrls: payload.imageUrls, replace: body.replace === true }, env);
  return jsonResponse(200, result);
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
    if (request.method === 'POST' && url.pathname === '/api/admin/chapter/import') return handleImport(request, env);
    return jsonResponse(404, { error: 'Unknown chapter administration endpoint.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    console.error('Hosted chapter administration error', error);
    return jsonResponse(status, { error: status >= 500 ? (error?.message || 'Chapter administration failed.') : error.message });
  }
}
