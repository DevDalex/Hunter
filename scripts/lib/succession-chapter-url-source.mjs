import { lookup } from 'node:dns/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

const USER_AGENT = 'Hunter-Archive-Chapter-Importer/1.0 (+local maintainer tool)';
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_BYTES = 40 * 1024 * 1024;
const MAX_CANDIDATES = 120;

const decodeHtml = (value = '') => value
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/\\\//g, '/');

const isPrivateIpv4 = (address) => {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;
  return a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 0)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
    || a >= 224;
};

const isPrivateIpv6 = (address) => {
  const normalized = address.toLowerCase().split('%')[0];
  if (normalized === '::1' || normalized === '::' || normalized.startsWith('fe80:')) return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  const mapped = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  return mapped ? isPrivateIpv4(mapped) : false;
};

export async function assertPublicHttpUrl(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error(`Invalid URL: ${input}`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS source URLs are supported.');
  const hostname = url.hostname.toLowerCase();
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error('Local and private-network source URLs are not allowed.');
  }
  if (net.isIP(hostname)) {
    if ((net.isIP(hostname) === 4 && isPrivateIpv4(hostname)) || (net.isIP(hostname) === 6 && isPrivateIpv6(hostname))) {
      throw new Error('Private-network source URLs are not allowed.');
    }
    return url;
  }
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error(`Could not resolve ${hostname}.`);
  if (addresses.some(({ address, family }) => family === 4 ? isPrivateIpv4(address) : isPrivateIpv6(address))) {
    throw new Error('The source host resolves to a private or reserved network address.');
  }
  return url;
}

const readLimitedBody = async (response, limit, label) => {
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new Error(`${label} exceeds the ${Math.round(limit / 1024 / 1024)} MB safety limit.`);
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
};

export async function safeFetchBuffer(input, {
  accept = '*/*',
  referer = '',
  maxBytes = MAX_IMAGE_BYTES,
  label = 'Remote response',
} = {}) {
  let current = await assertPublicHttpUrl(input);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    let response;
    try {
      response = await fetch(current, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          accept,
          'accept-language': 'en-US,en;q=0.8',
          'user-agent': USER_AGENT,
          ...(referer ? { referer } : {}),
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw new Error(`Redirect from ${current.href} did not include a destination.`);
      current = await assertPublicHttpUrl(new URL(location, current).href);
      continue;
    }
    if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}: ${current.href}`);
    const buffer = await readLimitedBody(response, maxBytes, label);
    return {
      buffer,
      contentType: response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() || '',
      finalUrl: current.href,
    };
  }
  throw new Error(`Too many redirects while fetching ${input}.`);
}

const parseAttributes = (tag) => {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  }
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

export function inferChapterNumber(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    const segments = url.pathname.split('/').filter(Boolean).reverse();
    for (const segment of segments) {
      const exact = segment.match(/^(?:chapter[-_ ]?)?(\d{3,4})$/i);
      if (exact) return Number(exact[1]);
    }
  } catch {
    return null;
  }
  return null;
}

export function extractChapterImageUrls(html, pageUrl) {
  const base = new URL(pageUrl);
  const discovered = [];
  let order = 0;

  const add = (rawValue, context = '') => {
    const value = decodeHtml(String(rawValue || '').trim());
    if (!value || value.startsWith('data:') || value.startsWith('blob:') || value === '#') return;
    let url;
    try {
      url = new URL(value, base);
    } catch {
      return;
    }
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const score = candidateScore(url, context);
    if (score < 20) return;
    discovered.push({ url: url.href, score, order: order += 1, directory: new URL('.', url).href });
  };

  for (const match of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const tag = match[0];
    const attrs = parseAttributes(tag);
    const context = `${attrs.class || ''} ${attrs.id || ''} ${attrs.alt || ''}`;
    for (const name of ['data-src', 'data-lazy-src', 'data-original', 'data-url', 'data-cfsrc', 'src']) add(attrs[name], context);
    for (const srcsetName of ['data-srcset', 'srcset']) {
      for (const entry of String(attrs[srcsetName] || '').split(',')) add(entry.trim().split(/\s+/)[0], context);
    }
  }

  for (const match of html.matchAll(/(?:https?:)?\\?\/\\?\/[^
\r"'<>\s]+?\.(?:jpe?g|png|webp)(?:\?[^"'<>\s]*)?/gi)) {
    add(match[0].replace(/\\\//g, '/'), 'embedded image URL');
  }

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

  const hasNumericOrder = selected.length > 1 && selected.every((item) => numericPage(new URL(item.url)) !== null);
  selected.sort((left, right) => hasNumericOrder
    ? numericPage(new URL(left.url)) - numericPage(new URL(right.url)) || left.order - right.order
    : left.order - right.order);

  return selected.slice(0, MAX_CANDIDATES).map((item) => item.url);
}

const titleFromHtml = (html) => decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

export async function inspectChapterSource(sourceUrl) {
  const result = await safeFetchBuffer(sourceUrl, {
    accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
    maxBytes: MAX_HTML_BYTES,
    label: 'Chapter page',
  });
  const html = result.buffer.toString('utf8');
  const imageUrls = extractChapterImageUrls(html, result.finalUrl);
  if (!imageUrls.length) throw new Error('No likely chapter-page images were detected on the supplied URL.');
  return {
    sourceUrl: result.finalUrl,
    title: titleFromHtml(html),
    inferredChapter: inferChapterNumber(result.finalUrl),
    imageUrls,
  };
}

export function detectImageType(buffer, contentType = '', sourceUrl = '') {
  if (buffer.length >= 12 && buffer[0] === 0xff && buffer[1] === 0xd8) return { extension: '.jpg', contentType: 'image/jpeg' };
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') return { extension: '.png', contentType: 'image/png' };
  if (buffer.length >= 16 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return { extension: '.webp', contentType: 'image/webp' };
  if (contentType === 'image/jpeg') return { extension: '.jpg', contentType };
  if (contentType === 'image/png') return { extension: '.png', contentType };
  if (contentType === 'image/webp') return { extension: '.webp', contentType };
  const extension = path.extname(new URL(sourceUrl).pathname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) return { extension: extension === '.jpeg' ? '.jpg' : extension, contentType: contentType || `image/${extension.slice(1)}` };
  throw new Error(`Downloaded content is not a supported JPG, PNG, or WebP image: ${sourceUrl}`);
}

export async function fetchChapterImage(imageUrl, sourceUrl) {
  const response = await safeFetchBuffer(imageUrl, {
    accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    referer: sourceUrl,
    maxBytes: MAX_IMAGE_BYTES,
    label: 'Chapter image',
  });
  const type = detectImageType(response.buffer, response.contentType, response.finalUrl);
  return { ...response, ...type };
}

export async function downloadChapterImages({ imageUrls, sourceUrl, destinationDirectory, onProgress }) {
  if (!Array.isArray(imageUrls) || !imageUrls.length) throw new Error('No chapter image URLs were supplied.');
  if (imageUrls.length > MAX_CANDIDATES) throw new Error(`A chapter may contain at most ${MAX_CANDIDATES} detected pages.`);
  await mkdir(destinationDirectory, { recursive: true });
  const files = [];
  for (const [index, imageUrl] of imageUrls.entries()) {
    const image = await fetchChapterImage(imageUrl, sourceUrl);
    const filename = `${String(index + 1).padStart(3, '0')}${image.extension}`;
    await writeFile(path.join(destinationDirectory, filename), image.buffer);
    const record = { page: index + 1, filename, sourceUrl: image.finalUrl, bytes: image.buffer.length, contentType: image.contentType };
    files.push(record);
    onProgress?.(record, imageUrls.length);
  }
  return files;
}
