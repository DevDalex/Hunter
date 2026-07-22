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

    if (requestUrl.pathname !== '/api/admin/chapter/inspect' || !response.ok) return response;

    const text = await response.clone().text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {}

    if (payload && Array.isArray(payload.pages)) return response;

    const looksLikeHtml = /^\s*</.test(text);
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
