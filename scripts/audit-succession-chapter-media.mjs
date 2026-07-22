import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { authorizedSuccessionChapterMedia } from '../src/data/successionChapterMedia.generated.js';

const root = process.cwd();
const mediaRoot = path.join(root, 'public', 'media', 'succession-contest', 'chapters');
const supportedExtensions = new Set(['.jpg', '.png', '.webp']);
const errors = [];
const seenSources = new Set();
const seenIds = new Set();
const seenChecksums = new Map();
const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
const manifestEntries = Object.entries(authorizedSuccessionChapterMedia);

for (const [chapterKey, pages] of manifestEntries) {
  const chapter = Number.parseInt(chapterKey, 10);
  if (!Number.isInteger(chapter) || String(chapter) !== chapterKey || chapter < 339 || chapter > 414) {
    errors.push(`Invalid Chapter Bank key: ${chapterKey}`);
    continue;
  }
  if (!Array.isArray(pages) || !pages.length) {
    errors.push(`Chapter ${chapter} must contain at least one page record when present in the manifest.`);
    continue;
  }

  for (const [index, page] of pages.entries()) {
    const expectedPage = index + 1;
    const padded = String(expectedPage).padStart(3, '0');
    const extension = path.extname(page.src || '').toLowerCase();
    const expectedPrefix = `/media/succession-contest/chapters/${chapter}/${padded}`;
    const expectedId = `chapter-${chapter}-p${padded}`;

    if (page.page !== expectedPage) errors.push(`Chapter ${chapter} p.${expectedPage} has page=${page.page}.`);
    if (!page.src?.startsWith(expectedPrefix)) errors.push(`Chapter ${chapter} p.${expectedPage} has an unexpected src: ${page.src}`);
    if (!supportedExtensions.has(extension)) errors.push(`Chapter ${chapter} p.${expectedPage} uses unsupported media: ${extension || '(none)'}`);
    if (!isPositiveInteger(page.width) || !isPositiveInteger(page.height)) errors.push(`Chapter ${chapter} p.${expectedPage} must have positive integer dimensions.`);
    if (seenSources.has(page.src)) errors.push(`Duplicate chapter page src: ${page.src}`);
    seenSources.add(page.src);

    if (page.id !== undefined && page.id !== expectedId) errors.push(`Chapter ${chapter} p.${expectedPage} has unstable ID ${page.id}.`);
    if (page.label !== undefined && page.label !== `p.${expectedPage}`) errors.push(`Chapter ${chapter} p.${expectedPage} has invalid label ${page.label}.`);
    if (page.filename !== undefined && !page.filename.startsWith(padded)) errors.push(`Chapter ${chapter} p.${expectedPage} filename is not zero-padded.`);
    if (page.localPath !== undefined && page.localPath !== page.src) errors.push(`Chapter ${chapter} p.${expectedPage} localPath must equal src.`);
    if (page.byteSize !== undefined && !isPositiveInteger(page.byteSize)) errors.push(`Chapter ${chapter} p.${expectedPage} has invalid byteSize.`);
    if (page.checksum !== undefined && !/^sha256-[a-f0-9]{64}$/.test(page.checksum)) errors.push(`Chapter ${chapter} p.${expectedPage} has invalid checksum.`);
    if (page.status !== undefined && page.status !== 'published') errors.push(`Chapter ${chapter} p.${expectedPage} has unsupported status ${page.status}.`);
    if (page.id) {
      if (seenIds.has(page.id)) errors.push(`Duplicate Chapter Bank page ID: ${page.id}`);
      seenIds.add(page.id);
    }
    if (page.checksum) {
      const existing = seenChecksums.get(page.checksum);
      if (existing) errors.push(`Duplicate page checksum: ${existing} and ${page.id || page.src}`);
      seenChecksums.set(page.checksum, page.id || page.src);
    }

    const localPath = path.join(root, 'public', page.src.replace(/^\//, ''));
    const localStats = await stat(localPath).catch(() => null);
    if (!localStats?.isFile()) errors.push(`Missing local chapter page: ${path.relative(root, localPath)}`);
    else if (page.byteSize !== undefined && localStats.size !== page.byteSize) errors.push(`Chapter ${chapter} p.${expectedPage} byteSize does not match the stored file.`);
  }
}

const mediaRootStats = await stat(mediaRoot).catch(() => null);
if (mediaRootStats?.isDirectory()) {
  const chapterDirectories = (await readdir(mediaRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name));
  for (const directory of chapterDirectories) {
    if (!authorizedSuccessionChapterMedia[Number(directory.name)]) errors.push(`Unregistered chapter media directory: ${path.relative(root, path.join(mediaRoot, directory.name))}`);
  }
}

if (errors.length) {
  console.error(`Succession chapter media audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const pageTotal = manifestEntries.reduce((total, [, pages]) => total + pages.length, 0);
  console.log(`Succession chapter media audit passed: ${manifestEntries.length} stored chapter(s), ${pageTotal} page(s), enriched Chapter Bank records supported.`);
}
