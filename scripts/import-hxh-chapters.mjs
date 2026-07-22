import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SERIES_SLUG = 'hunter-x-hunter';
const SOURCE_ORIGIN = 'https://3asq.online';
const SOURCE_HOSTS = new Set(['3asq.online', 'www.3asq.online']);
const SOURCE_IMAGE_PATH = '/wp-content/uploads/WP-manga/data/';
const OUTPUT_ROOT = path.resolve('chapters', SERIES_SLUG);
const MANIFEST_PATH = path.join(OUTPUT_ROOT, 'manifest.json');
const REPORT_PATH = path.join(OUTPUT_ROOT, 'import-report.json');
const ATTRIBUTE_PRIORITY = ['data-src', 'data-lazy-src', 'data-original', 'src'];
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const PAGE_TIMEOUT_MS = 30_000;
const IMAGE_TIMEOUT_MS = 45_000;
const MAX_RETRIES = 3;
const IMAGE_CONCURRENCY = 4;

const startChapter = parseChapter(process.env.START_CHAPTER ?? process.argv[2] ?? '339');
const endChapter = parseChapter(process.env.END_CHAPTER ?? process.argv[3] ?? '414');

if (startChapter > endChapter) {
  throw new Error(`START_CHAPTER (${startChapter}) must not exceed END_CHAPTER (${endChapter}).`);
}

await mkdir(OUTPUT_ROOT, { recursive: true });

const previousManifest = await readJson(MANIFEST_PATH, { seriesSlug: SERIES_SLUG, chapters: {} });
const manifest = {
  schemaVersion: 1,
  seriesSlug: SERIES_SLUG,
  sourceDomain: '3asq.online',
  generatedAt: new Date().toISOString(),
  chapterRange: { start: startChapter, end: endChapter },
  chapters: { ...previousManifest.chapters },
};

const report = {
  startedAt: new Date().toISOString(),
  finishedAt: null,
  range: { start: startChapter, end: endChapter },
  importedChapters: 0,
  importedImages: 0,
  skippedChapters: 0,
  failedChapters: 0,
  chapters: [],
};

for (let chapter = startChapter; chapter <= endChapter; chapter += 1) {
  const sourceUrl = `${SOURCE_ORIGIN}/manga/${SERIES_SLUG}/${chapter}/`;
  const chapterResult = {
    chapter,
    sourceUrl,
    status: 'pending',
    imported: 0,
    failed: 0,
    message: '',
  };

  console.log(`\n[chapter ${chapter}] Scanning ${sourceUrl}`);

  try {
    const html = await fetchText(sourceUrl, PAGE_TIMEOUT_MS);
    const imageUrls = extractChapterImageUrls(html, sourceUrl);

    if (imageUrls.length === 0) {
      throw new Error('No chapter page images were found.');
    }

    console.log(`[chapter ${chapter}] Found ${imageUrls.length} candidate images.`);

    const tempDirectory = path.join(OUTPUT_ROOT, `.${chapter}.tmp-${process.pid}-${Date.now()}`);
    await rm(tempDirectory, { recursive: true, force: true });
    await mkdir(tempDirectory, { recursive: true });

    try {
      const pages = await mapWithConcurrency(imageUrls, IMAGE_CONCURRENCY, async (imageUrl, index) => {
        const pageNumber = index + 1;
        const image = await downloadValidatedImage(imageUrl, sourceUrl);
        const filename = `${String(pageNumber).padStart(3, '0')}.${image.extension}`;
        const filePath = path.join(tempDirectory, filename);
        await writeFile(filePath, image.bytes);

        console.log(`[chapter ${chapter}] ${filename} (${formatBytes(image.bytes.length)})`);

        return {
          page: pageNumber,
          filename,
          relativePath: `${chapter}/${filename}`,
          mediaType: image.mediaType,
          byteLength: image.bytes.length,
          sha256: createHash('sha256').update(image.bytes).digest('hex'),
          sourceUrl: imageUrl,
        };
      });

      const chapterDirectory = path.join(OUTPUT_ROOT, String(chapter));
      await rm(chapterDirectory, { recursive: true, force: true });
      await rename(tempDirectory, chapterDirectory);

      manifest.chapters[String(chapter)] = {
        chapterNumber: String(chapter),
        sourceUrl,
        pageCount: pages.length,
        importedAt: new Date().toISOString(),
        pages,
      };

      chapterResult.status = 'imported';
      chapterResult.imported = pages.length;
      chapterResult.message = `Imported ${pages.length} pages.`;
      report.importedChapters += 1;
      report.importedImages += pages.length;
    } catch (error) {
      await rm(tempDirectory, { recursive: true, force: true });
      throw error;
    }
  } catch (error) {
    chapterResult.status = 'failed';
    chapterResult.failed = 1;
    chapterResult.message = error instanceof Error ? error.message : String(error);
    report.failedChapters += 1;
    console.error(`[chapter ${chapter}] FAILED: ${chapterResult.message}`);
  }

  report.chapters.push(chapterResult);
  await writeJson(MANIFEST_PATH, manifest);
  await writeJson(REPORT_PATH, { ...report, finishedAt: new Date().toISOString() });

  await sleep(250);
}

report.finishedAt = new Date().toISOString();
await writeJson(MANIFEST_PATH, manifest);
await writeJson(REPORT_PATH, report);

console.log('\nImport complete.');
console.log(`Chapters imported: ${report.importedChapters}`);
console.log(`Images imported:   ${report.importedImages}`);
console.log(`Chapters failed:   ${report.failedChapters}`);
console.log(`Manifest: ${path.relative(process.cwd(), MANIFEST_PATH)}`);
console.log(`Report:   ${path.relative(process.cwd(), REPORT_PATH)}`);

if (report.importedChapters === 0) {
  process.exitCode = 1;
}

function parseChapter(value) {
  const chapter = Number.parseInt(String(value), 10);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 10_000) {
    throw new Error(`Invalid chapter number: ${value}`);
  }
  return chapter;
}

function decodeHtmlAttribute(value) {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&#038;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .trim();
}

function extractChapterImageUrls(html, sourceUrl) {
  const urls = [];
  const seen = new Set();
  const imageTagPattern = /<img\b[^>]*>/gi;

  for (const match of html.matchAll(imageTagPattern)) {
    const tag = match[0];
    const attributes = new Map();
    const attributePattern = /\b(data-src|data-lazy-src|data-original|src)\s*=\s*(["'])(.*?)\2/gi;

    for (const attributeMatch of tag.matchAll(attributePattern)) {
      attributes.set(attributeMatch[1].toLowerCase(), decodeHtmlAttribute(attributeMatch[3]));
    }

    let candidate = '';
    for (const attribute of ATTRIBUTE_PRIORITY) {
      if (attributes.get(attribute)) {
        candidate = attributes.get(attribute);
        break;
      }
    }

    if (!candidate || candidate.startsWith('data:') || candidate.startsWith('blob:')) continue;

    let absolute;
    try {
      absolute = new URL(candidate, sourceUrl);
    } catch {
      continue;
    }

    if (absolute.protocol !== 'https:') continue;
    if (!SOURCE_HOSTS.has(absolute.hostname.toLowerCase())) continue;
    if (!absolute.pathname.toLowerCase().includes(SOURCE_IMAGE_PATH.toLowerCase())) continue;

    absolute.hash = '';
    const normalized = absolute.toString();
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    urls.push(normalized);
  }

  return urls;
}

async function fetchText(url, timeoutMs) {
  const response = await fetchWithRetries(url, {
    timeoutMs,
    headers: requestHeaders(SOURCE_ORIGIN),
  });

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('text/html')) {
    throw new Error(`Expected HTML from ${url}, received ${contentType || 'unknown content type'}.`);
  }

  return response.text();
}

async function downloadValidatedImage(url, referer) {
  const response = await fetchWithRetries(url, {
    timeoutMs: IMAGE_TIMEOUT_MS,
    headers: requestHeaders(referer),
  });

  const declaredLength = Number(response.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_IMAGE_BYTES) {
    throw new Error(`Image exceeds ${formatBytes(MAX_IMAGE_BYTES)}: ${url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) throw new Error(`Empty image response: ${url}`);
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error(`Image exceeds ${formatBytes(MAX_IMAGE_BYTES)}: ${url}`);

  const detected = detectImageType(bytes);
  if (!detected) {
    const preview = bytes.subarray(0, 80).toString('utf8').replaceAll(/\s+/g, ' ');
    throw new Error(`Response is not a valid JPG, PNG, or WebP image: ${url} (${preview})`);
  }

  return { ...detected, bytes };
}

function detectImageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { extension: 'jpg', mediaType: 'image/jpeg' };
  }

  if (
    bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
  ) {
    return { extension: 'png', mediaType: 'image/png' };
  }

  if (
    bytes.length >= 12
    && bytes.subarray(0, 4).toString('ascii') === 'RIFF'
    && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { extension: 'webp', mediaType: 'image/webp' };
  }

  return null;
}

async function fetchWithRetries(url, { timeoutMs, headers }) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const finalUrl = new URL(response.url);
      if (finalUrl.protocol !== 'https:' || !SOURCE_HOSTS.has(finalUrl.hostname.toLowerCase())) {
        throw new Error(`Blocked redirect to unapproved host: ${response.url}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) await sleep(750 * attempt);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`Request failed after ${MAX_RETRIES} attempts: ${url} (${lastError instanceof Error ? lastError.message : String(lastError)})`);
}

function requestHeaders(referer) {
  return {
    accept: 'text/html,application/xhtml+xml,image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.8,ar;q=0.6',
    referer,
    'user-agent': 'Mozilla/5.0 (compatible; HunterArchiveImporter/1.0; +https://github.com/DevDalex/Hunter)',
  };
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  return results;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
