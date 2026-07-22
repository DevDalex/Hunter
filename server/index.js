import { handleHostedChapterAdmin, isHostedChapterAdminRequest } from './chapter-admin.js';

const INSPECT_PATH = '/api/admin/chapter/inspect';
const ADMIN_PATHS = new Set(['/admin/chapters', '/admin/chapters/']);

const jsonError = (status, message) => new Response(JSON.stringify({ error: message }), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  },
});

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

  return validateInspectionResponse(await handleHostedChapterAdmin(normalized, env));
};

const injectInspectionContract = async (response) => {
  if (!response.ok || !String(response.headers.get('content-type') || '').includes('text/html')) return response;

  const html = await response.text();
  const script = '<script src="/admin/chapters/inspect-contract.js"></script>';
  const patched = html.includes(script)
    ? html
    : html.replace('</body>', `${script}</body>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

// Static-site worker used by the private host. Vite's built assets are exposed
// through the ASSETS binding; unknown client-side routes fall back to index.html.
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
      return injectInspectionContract(await handleHostedChapterAdmin(request, env));
    }

    if (isHostedChapterAdminRequest(url)) {
      const response = await handleHostedChapterAdmin(request, env);
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
