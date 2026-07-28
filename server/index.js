import { handleDirectChapterImport, isDirectChapterImportRequest } from './direct-chapter-import.js';

const INSPECT_PATH = '/api/admin/chapter/inspect';
const ADMIN_PATHS = new Set(['/admin/chapters', '/admin/chapters/']);
const INSPECTION_CONTRACT_PATH = '/admin/chapters/inspect-contract.js';

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://hunterxhunter.fandom.com https://static.wikia.nocookie.net",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = Object.freeze({
  'content-security-policy': CONTENT_SECURITY_POLICY,
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
});

/** @param {Response} response */
const withSecurityHeaders = (response) => {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  headers.delete('server');
  headers.delete('x-powered-by');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const jsonError = (status, message) => withSecurityHeaders(new Response(JSON.stringify({ error: message }), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
}));

// Await importer handlers at the Worker boundary so rejected promises are
// normalized into JSON instead of escaping as unhandled exceptions.
const runDirectChapterImport = async (request, env) => {
  try {
    return await handleDirectChapterImport(request, env);
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 500;
    console.error('Direct chapter importer boundary error', error);
    return jsonError(status, status >= 500 ? (error?.message || 'Chapter importing failed.') : error.message);
  }
};

const validateInspectionResponse = async (response) => {
  if (!response.ok) return withSecurityHeaders(response);

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    return jsonError(502, 'The inspection handler returned a non-JSON response.');
  }

  if (!payload || !Array.isArray(payload.pages)) {
    return jsonError(502, payload?.error || 'The inspection handler returned an invalid response without a pages list.');
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return withSecurityHeaders(new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  }));
};

const normalizeInspectionGet = async (request, env) => {
  const source = new URL(request.url);
  const target = new URL(request.url);
  target.pathname = INSPECT_PATH;
  target.search = '';

  const headers = new Headers(request.headers);
  headers.set('content-type', 'application/json');
  headers.delete('content-length');
  headers.delete('transfer-encoding');

  const normalized = new Request(target, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sourceUrl: source.searchParams.get('sourceUrl') || '',
      chapter: source.searchParams.get('chapter') || null,
    }),
  });

  return validateInspectionResponse(await runDirectChapterImport(normalized, env));
};

const inlineInspectionContract = `<script data-inspection-contract="inline">
(() => {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const response = await nativeFetch(input, init);
    let requestUrl;
    try {
      requestUrl = new URL(typeof input === 'string' ? input : input.url, window.location.href);
    } catch {
      return response;
    }

    if (requestUrl.pathname !== '${INSPECT_PATH}' || !response.ok) return response;

    const text = await response.clone().text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {}

    if (payload && Array.isArray(payload.pages)) return response;

    const looksLikeHtml = /^\s*</.test(text);
    const message = payload?.error
      || (looksLikeHtml
        ? 'The inspection request was rewritten to a webpage instead of reaching the chapter-import API.'
        : 'The chapter-import API returned an invalid inspection response without a pages list.');

    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  };
})();
</script>`;

const injectInspectionContract = async (response) => {
  if (!response.ok || !String(response.headers.get('content-type') || '').includes('text/html')) return withSecurityHeaders(response);

  const html = await response.text();
  const externalScript = `<script src="${INSPECTION_CONTRACT_PATH}"></script>`;
  const scripts = `${inlineInspectionContract}${externalScript}`;
  const patched = html.includes('data-inspection-contract="inline"')
    ? html
    : html.replace('</body>', `${scripts}</body>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return withSecurityHeaders(new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers,
  }));
};

// Full-stack Cloudflare Worker. Vite's built assets are exposed through the ASSETS
// binding; all private chapter-import routes execute before the client-side fallback.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/admin/chapters/index.html' || url.pathname === '/admin/chapters/direct.html') {
      url.pathname = '/admin/chapters';
      return withSecurityHeaders(Response.redirect(url, 302));
    }

    // Inspection is read-only. Some hosting/proxy layers reject its JSON POST,
    // so the import page retries it as GET. Normalize both possible GET paths
    // into the same direct JSON handler, then validate its response.
    if (request.method === 'GET' && (url.pathname === INSPECT_PATH || url.pathname === '/admin/chapters/inspect')) {
      return normalizeInspectionGet(request, env);
    }

    if (request.method === 'GET' && ADMIN_PATHS.has(url.pathname)) {
      return injectInspectionContract(await runDirectChapterImport(request, env));
    }

    if (isDirectChapterImportRequest(url)) {
      const response = await runDirectChapterImport(request, env);
      return url.pathname === INSPECT_PATH ? validateInspectionResponse(response) : withSecurityHeaders(response);
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) return withSecurityHeaders(response);

    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (!acceptsHtml) return withSecurityHeaders(response);

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = '/index.html';
    return withSecurityHeaders(await env.ASSETS.fetch(new Request(fallbackUrl, request)));
  },
};
