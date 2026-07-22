import { handleHostedChapterAdmin, isHostedChapterAdminRequest } from './chapter-admin.js';

// Static-site worker used by the private host. Vite's built assets are exposed
// through the ASSETS binding; unknown client-side routes fall back to index.html.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/admin/chapters/index.html') {
      url.pathname = '/admin/chapters';
      return Response.redirect(url, 302);
    }

    // Some hosting/proxy layers reject the inspector POST before it reaches the
    // Worker. Inspection is read-only, so the admin page may retry it as GET.
    // Normalize that request back into the existing authenticated JSON handler.
    if (url.pathname === '/api/admin/chapter/inspect' && request.method === 'GET') {
      const headers = new Headers(request.headers);
      headers.set('content-type', 'application/json');
      const body = JSON.stringify({
        sourceUrl: url.searchParams.get('sourceUrl') || '',
        chapter: url.searchParams.get('chapter') || null,
      });
      const normalized = new Request(request.url, {
        method: 'POST',
        headers,
        body,
      });
      return handleHostedChapterAdmin(normalized, env);
    }

    if (isHostedChapterAdminRequest(url)) {
      return handleHostedChapterAdmin(request, env);
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