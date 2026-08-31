// Succession-only Cloudflare Worker.
// Static assets are served from the ASSETS binding with SPA fallback routing.

const HUNTERPEDIA_API = 'https://hunterxhunter.fandom.com/api.php';
const HUNTERPEDIA_CDN = 'https://static.wikia.nocookie.net/hunterxhunter/images';
const PORTRAIT_PATH = '/__hunterpedia/portrait';

function md5Hex(input) {
  const bytes = new TextEncoder().encode(String(input));
  const originalLength = bytes.length;
  const bitLength = originalLength * 8;
  const paddedLength = (((originalLength + 8) >> 6) + 1) * 64;
  const data = new Uint8Array(paddedLength);
  data.set(bytes);
  data[originalLength] = 0x80;
  const view = new DataView(data.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constants = Array.from({ length: 64 }, (_, index) => (
    Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0
  ));
  const leftRotate = (value, count) => ((value << count) | (value >>> (32 - count))) >>> 0;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) => view.getUint32(offset + index * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f;
      let g;
      if (index < 16) {
        f = (b & c) | ((~b) & d);
        g = index;
      } else if (index < 32) {
        f = (d & b) | ((~d) & c);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        g = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | (~d));
        g = (7 * index) % 16;
      }

      f = (f + a + constants[index] + words[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + leftRotate(f, shifts[index])) >>> 0;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const output = new DataView(new ArrayBuffer(16));
  output.setUint32(0, a0, true);
  output.setUint32(4, b0, true);
  output.setUint32(8, c0, true);
  output.setUint32(12, d0, true);
  return [...new Uint8Array(output.buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hunterpediaStaticFileUrl(file) {
  const normalizedFile = String(file || '').trim().replaceAll(' ', '_');
  if (!normalizedFile) return '';
  const hash = md5Hex(normalizedFile);
  const encodedFile = encodeURIComponent(normalizedFile).replaceAll('%2F', '/');
  return `${HUNTERPEDIA_CDN}/${hash[0]}/${hash.slice(0, 2)}/${encodedFile}/revision/latest?format=original`;
}

function inferredTitleFromFile(file) {
  return String(file || '')
    .replace(/\.(?:png|jpe?g|webp|gif)$/i, '')
    .replace(/\s+(?:SC|YC|HCE|CA|HA|GI|HE|ZF|V\d+)\s+Portrait$/i, '')
    .replace(/\s+Portrait$/i, '')
    .trim();
}

function staticFileCandidates(file, title) {
  const candidates = [String(file || '').trim()];
  const articleTitle = String(title || inferredTitleFromFile(file)).trim();
  if (articleTitle) {
    candidates.push(`${articleTitle} 2011 Design.png`);
    const firstName = articleTitle.split(/\s+/)[0];
    if (firstName && firstName !== articleTitle) {
      candidates.push(`${firstName} 2011 Design.png`);
      candidates.push(`${firstName} Chimera Ant Arc 2011 Design.png`);
    }
  }
  return [...new Set(candidates.filter(Boolean))];
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

async function resolveHunterpediaApiFallback(file, title) {
  const fileQuery = new URL(HUNTERPEDIA_API);
  fileQuery.searchParams.set('action', 'query');
  fileQuery.searchParams.set('format', 'json');
  fileQuery.searchParams.set('formatversion', '2');
  fileQuery.searchParams.set('prop', 'imageinfo');
  fileQuery.searchParams.set('iiprop', 'url|mime');
  fileQuery.searchParams.set('titles', `File:${file}`);

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

  const pageData = await fetchJson(pageQuery);
  const page = pageData?.query?.pages?.[0];
  return page?.original?.source || page?.thumbnail?.source || '';
}

async function fetchPortraitUpstream(imageUrl) {
  if (!imageUrl) return null;
  const response = await fetch(imageUrl, {
    redirect: 'follow',
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'user-agent': 'HunterArchive/1.0 portrait proxy',
    },
  });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return null;
  return response;
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

  let upstream = null;
  let source = '';
  for (const candidate of staticFileCandidates(file, title)) {
    upstream = await fetchPortraitUpstream(hunterpediaStaticFileUrl(candidate));
    if (upstream) {
      source = `static-cdn:${candidate}`;
      break;
    }
  }

  if (!upstream) {
    source = 'mediawiki-api';
    const fallbackUrl = await resolveHunterpediaApiFallback(file, title);
    upstream = await fetchPortraitUpstream(fallbackUrl);
  }
  if (!upstream) return new Response('Portrait not found', { status: 404 });

  const headers = new Headers(upstream.headers);
  headers.set('cache-control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-hunter-portrait-source', source);
  headers.delete('set-cookie');
  headers.delete('content-security-policy');

  const response = new Response(upstream.body, {
    status: 200,
    headers,
  });
  ctx?.waitUntil(cache.put(request, response.clone()));
  return response;
}

export { md5Hex, hunterpediaStaticFileUrl, staticFileCandidates };

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
