import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { authorizedSuccessionChapterMedia } from '../src/data/successionChapterMedia.generated.js';

const root = process.cwd();
const mediaRoot = path.join(root, 'public', 'media', 'succession-contest', 'chapters');
const supportedExtensions = new Set(['.jpg', '.png', '.webp']);
const errors = [];
const seenSources = new Set();

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
const manifestEntries = Object.entries(authorizedSuccessionChapterMedia);

for (const [chapterKey, pages] of manifestEntries) {
  const chapter = Number.parseInt(chapterKey, 10);
  if (!Number.isInteger(chapter) || String(chapter) !== chapterKey || chapter < 338 || chapter > 414) {
    errors.push(`Invalid Succession reader chapter key: ${chapterKey}`);
    continue;
  }
  if (!Array.isArray(pages) || !pages.length) {
    errors.push(`Chapter ${chapter} must contain at least one page record when present in the manifest.`);
    continue;
  }

  for (const [index, page] of pages.entries()) {
    const expectedPage = index + 1;
    const extension = path.extname(page.src || '').toLowerCase();
    const expectedPrefix = `/media/succession-contest/chapters/${chapter}/${String(expectedPage).padStart(3, '0')}`;

    if (page.page !== expectedPage) errors.push(`Chapter ${chapter} page ${expectedPage} has page=${page.page}.`);
    if (!page.src?.startsWith(expectedPrefix)) errors.push(`Chapter ${chapter} page ${expectedPage} has an unexpected src: ${page.src}`);
    if (!supportedExtensions.has(extension)) errors.push(`Chapter ${chapter} page ${expectedPage} uses unsupported media: ${extension || '(none)'}`);
    if (!isPositiveInteger(page.width) || !isPositiveInteger(page.height)) {
      errors.push(`Chapter ${chapter} page ${expectedPage} must have positive integer dimensions.`);
    }
    if (seenSources.has(page.src)) errors.push(`Duplicate chapter page src: ${page.src}`);
    seenSources.add(page.src);

    const localPath = path.join(root, 'public', page.src.replace(/^\//, ''));
    const localStats = await stat(localPath).catch(() => null);
    if (!localStats?.isFile()) errors.push(`Missing local chapter page: ${path.relative(root, localPath)}`);
  }
}

const mediaRootStats = await stat(mediaRoot).catch(() => null);
if (mediaRootStats?.isDirectory()) {
  const chapterDirectories = (await readdir(mediaRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name));

  for (const directory of chapterDirectories) {
    if (!authorizedSuccessionChapterMedia[Number(directory.name)]) {
      errors.push(`Unregistered chapter media directory: ${path.relative(root, path.join(mediaRoot, directory.name))}`);
    }
  }
}

if (errors.length) {
  console.error(`Succession chapter media audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const pageTotal = manifestEntries.reduce((total, [, pages]) => total + pages.length, 0);
  console.log(`Succession chapter media audit passed: ${manifestEntries.length} chapter(s), ${pageTotal} page(s).`);
}
