import { handleHostedChapterAdmin, isHostedChapterAdminRequest } from './chapter-admin.js';

const INSPECT_PATH = '/api/admin/chapter/inspect';
const ADMIN_PATHS = new Set(['/admin/chapters', '/admin/chapters/']);
const INSPECTION_CONTRACT_PATH = '/admin/chapters/inspect-contract.js';

const jsonError = (status, message) => new Response(JSON.stringify({ error: message }), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  },
});

// Some chapter-admin route branches return async handlers directly from their
// own try/catch. Await them at the Worker boundary so rejected handler promises
// are still normalized into JSON instead of escaping as an unhandled exception.
const runHostedChapterAdmin = async (request, env) => {
  try {
    return await handleHostedChapterAdmin(request, env);
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 500;
    console.error('Hosted chapter administration boundary error', error);
    return jsonError(status, status >= 500 ? (error?.message || 'Chapter administration failed.') : error.message);
  }
};

const validateInspectionResponse = async (response) => {
  if (!response.ok) return response;

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
  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
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

  return validateInspectionResponse(await runHostedChapterAdmin(normalized, env));
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

    const looksLikeHtml = /^\\s*</.test(text);
    const message = payload?.error
      || (looksLikeHtml
        ? 'The inspection request was rewritten to a webpage instead of reaching the chapter-admin API.'
        : 'The chapter-admin API returned an invalid inspection response without a pages list.');

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
  if (!response.ok || !String(response.headers.get('content-type') || '').includes('text/html')) return response;

  const html = await response.text();
  const externalScript = `<script src="${INSPECTION_CONTRACT_PATH}"></script>`;
  const scripts = `${inlineInspectionContract}${externalScript}`;
  const patched = html.includes('data-inspection-contract="inline"')
    ? html
    : html.replace('</body>', `${scripts}</body>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  const contentSecurityPolicy = headers.get('content-security-policy');
  if (contentSecurityPolicy && !contentSecurityPolicy.includes("script-src 'self'")) {
    headers.set(
      'content-security-policy',
      contentSecurityPolicy.replace("script-src 'unsafe-inline'", "script-src 'self' 'unsafe-inline'"),
    );
  }

  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

// Full-stack Cloudflare Worker. Vite's built assets are exposed through the ASSETS
// binding; all chapter-admin routes execute before any client-side SPA fallback.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/admin/chapters/index.html') {
      url.pathname = '/admin/chapters';
      return Response.redirect(url, 302);
    }

    // Inspection is read-only. Some hosting/proxy layers reject its JSON POST,
    // so the admin page retries it as GET. Normalize both possible GET paths
    // into the same authenticated JSON handler, then validate its response.
    if (request.method === 'GET' && (url.pathname === INSPECT_PATH || url.pathname === '/admin/chapters/inspect')) {
      return normalizeInspectionGet(request, env);
    }

    if (request.method === 'GET' && ADMIN_PATHS.has(url.pathname)) {
      return injectInspectionContract(await runHostedChapterAdmin(request, env));
    }

    if (isHostedChapterAdminRequest(url)) {
      const response = await runHostedChapterAdmin(request, env);
      return url.pathname === INSPECT_PATH ? validateInspectionResponse(response) : response;
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) return response;

    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (!acceptsHtml) return response;

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
