// Succession-only Cloudflare Worker.
// Static assets are served from the ASSETS binding with SPA fallback routing.

const HUNTERPEDIA_API = 'https://hunterxhunter.fandom.com/api.php';
const PORTRAIT_PATH = '/__hunterpedia/portrait';

function inferredTitleFromFile(file) {
  return String(file || '')
    .replace(/\.(?:png|jpe?g|webp|gif)$/i, '')
    .replace(/\s+(?:SC|YC|HCE|CA|HA|GI|HE|ZF|V\d+)\s+Portrait$/i, '')
    .replace(/\s+Portrait$/i, '')
    .trim();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'HunterArchive/1.0 portrait resolver',
    },
  });
  if (!response.ok) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function resolveHunterpediaImage(file, title) {
  const fileQuery = new URL(HUNTERPEDIA_API);
  fileQuery.searchParams.set('action', 'query');
  fileQuery.searchParams.set('format', 'json');
  fileQuery.searchParams.set('formatversion', '2');
  fileQuery.searchParams.set('prop', 'imageinfo');
  fileQuery.searchParams.set('iiprop', 'url|mime');
  fileQuery.searchParams.set('titles', `File:${file}`);
  fileQuery.searchParams.set('origin', '*');

  const fileData = await fetchJson(fileQuery);
  const filePage = fileData?.query?.pages?.[0];
  const directUrl = filePage?.imageinfo?.[0]?.url;
  if (directUrl) return directUrl;

  const articleTitle = String(title || inferredTitleFromFile(file)).trim();
  if (!articleTitle) return '';

  const pageQuery = new URL(HUNTERPEDIA_API);
  pageQuery.searchParams.set('action', 'query');
  pageQuery.searchParams.set('format', 'json');
  pageQuery.searchParams.set('formatversion', '2');
  pageQuery.searchParams.set('prop', 'pageimages');
  pageQuery.searchParams.set('piprop', 'original|thumbnail');
  pageQuery.searchParams.set('pithumbsize', '900');
  pageQuery.searchParams.set('titles', articleTitle);
  pageQuery.searchParams.set('origin', '*');

  const pageData = await fetchJson(pageQuery);
  const page = pageData?.query?.pages?.[0];
  return page?.original?.source || page?.thumbnail?.source || '';
}

async function handlePortrait(request, ctx) {
  const url = new URL(request.url);
  const file = url.searchParams.get('file')?.trim();
  const title = url.searchParams.get('title')?.trim() || '';
  if (!file || file.length > 180 || title.length > 180) {
    return new Response('Invalid portrait request', { status: 400 });
  }

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const imageUrl = await resolveHunterpediaImage(file, title);
  if (!imageUrl) return new Response('Portrait not found', { status: 404 });

  const upstream = await fetch(imageUrl, {
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'user-agent': 'HunterArchive/1.0 portrait proxy',
    },
  });
  if (!upstream.ok || !upstream.headers.get('content-type')?.startsWith('image/')) {
    return new Response('Portrait upstream failed', { status: 502 });
  }

  const headers = new Headers(upstream.headers);
  headers.set('cache-control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');
  headers.set('x-content-type-options', 'nosniff');
  headers.delete('set-cookie');
  headers.delete('content-security-policy');

  const response = new Response(upstream.body, {
    status: 200,
    headers,
  });
  ctx?.waitUntil(cache.put(request, response.clone()));
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === PORTRAIT_PATH) return handlePortrait(request, ctx);

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (!acceptsHtml) return response;

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
