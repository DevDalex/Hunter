import { handleHostedChapterAdmin, isHostedChapterAdminRequest } from './chapter-admin.js';

// Static-site worker used by the private host. Vite's built assets are exposed
// through the ASSETS binding; unknown client-side routes fall back to index.html.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
