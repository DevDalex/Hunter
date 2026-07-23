#!/usr/bin/env node

import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  downloadChapterImages,
  inferChapterNumber,
  inspectChapterSource,
} from './lib/succession-chapter-url-source.mjs';

const READER_START = 338;
const READER_END = 414;
const ROOT = process.cwd();
const MAX_SELECTED_IMAGES = 120;

const usage = () => console.log(`Usage:
  npm run import:succession-chapter:url -- <chapter-url> [chapter] [--replace] [--dry-run] [--confirm] [--image-list-file <json-file>]

Examples:
  npm run import:succession-chapter:url -- https://example.com/manga/hunter-x-hunter/414/
  npm run import:succession-chapter:url -- https://example.com/chapter/latest 414 --replace --confirm
  npm run import:succession-chapter:url -- https://example.com/chapter/latest 414 --confirm --image-list-file .chapter-import-selected-images.json

Without --image-list-file, the command inspects the source page and detects likely chapter images.
With --image-list-file, it imports exactly the ordered JSON array of image URLs in that file.
It then downloads the pages into a temporary directory and runs the normal local importer.`);

const rawArgs = process.argv.slice(2);
if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
  usage();
  process.exit(0);
}

let imageListFile = '';
const args = [];
for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];
  if (arg === '--image-list-file') {
    const value = rawArgs[index + 1];
    if (!value || value.startsWith('--')) throw new Error('--image-list-file requires a JSON file path.');
    imageListFile = value;
    index += 1;
    continue;
  }
  args.push(arg);
}

const supportedFlags = new Set(['--replace', '--dry-run', '--confirm']);
const unknownFlags = args.filter((arg) => arg.startsWith('--') && !supportedFlags.has(arg));
if (unknownFlags.length) throw new Error(`Unknown option: ${unknownFlags.join(', ')}`);
const positional = args.filter((arg) => !arg.startsWith('--'));
if (positional.length < 1 || positional.length > 2) {
  usage();
  process.exit(1);
}

const sourceUrl = positional[0];
const replace = args.includes('--replace');
const dryRun = args.includes('--dry-run');
const confirmedByFlag = args.includes('--confirm');

const readSelectedImageUrls = async (filePath) => {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(path.resolve(ROOT, filePath), 'utf8'));
  } catch (error) {
    throw new Error(`Could not read selected image URL file ${filePath}: ${error.message}`);
  }
  if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > MAX_SELECTED_IMAGES) {
    throw new Error(`Selected image URL file must contain a JSON array with 1 through ${MAX_SELECTED_IMAGES} entries.`);
  }
  const normalized = parsed.map((value, index) => {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Selected image URL ${index + 1} is empty or invalid.`);
    let url;
    try {
      url = new URL(value.trim());
    } catch {
      throw new Error(`Selected image URL ${index + 1} is invalid.`);
    }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Selected image URL ${index + 1} must use HTTP or HTTPS.`);
    return url.href;
  });
  if (new Set(normalized).size !== normalized.length) throw new Error('Selected image URL list contains duplicate entries.');
  return normalized;
};

let inspection;
if (imageListFile) {
  const imageUrls = await readSelectedImageUrls(imageListFile);
  inspection = {
    sourceUrl,
    title: `Selected chapter pictures from ${new URL(sourceUrl).hostname}`,
    inferredChapter: inferChapterNumber(sourceUrl),
    imageUrls,
  };
  console.log(`Using ${imageUrls.length} manually selected image URL${imageUrls.length === 1 ? '' : 's'} from ${imageListFile}.`);
} else {
  console.log(`Inspecting ${sourceUrl} ...`);
  inspection = await inspectChapterSource(sourceUrl);
}

const chapter = Number.parseInt(positional[1] || inspection.inferredChapter || inferChapterNumber(sourceUrl), 10);
if (!Number.isInteger(chapter) || chapter < READER_START || chapter > READER_END) {
  throw new Error(`Could not infer a valid reader chapter. Supply a chapter from ${READER_START} through ${READER_END} as the second argument.`);
}

console.log(`\n${inspection.title || `Chapter ${chapter}`}`);
console.log(`${imageListFile ? 'Selected' : 'Detected'} ${inspection.imageUrls.length} page${inspection.imageUrls.length === 1 ? '' : 's'} in import order:`);
inspection.imageUrls.forEach((url, index) => console.log(`  ${String(index + 1).padStart(3, '0')}  ${url}`));

if (dryRun) {
  console.log('\nDry run complete. No images were downloaded and no repository files were changed.');
  process.exit(0);
}

let confirmed = confirmedByFlag;
if (!confirmed && process.stdin.isTTY) {
  const prompt = createInterface({ input, output });
  const answer = await prompt.question(`\nImport these ${inspection.imageUrls.length} pages as Chapter ${chapter}${replace ? ' and replace the existing chapter' : ''}? [y/N] `);
  prompt.close();
  confirmed = /^y(?:es)?$/i.test(answer.trim());
}
if (!confirmed) {
  throw new Error('Import cancelled. Re-run interactively or pass --confirm after reviewing the page list.');
}

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), `hunter-chapter-${chapter}-`));
try {
  console.log(`\nDownloading Chapter ${chapter} pages ...`);
  await downloadChapterImages({
    imageUrls: inspection.imageUrls,
    sourceUrl: inspection.sourceUrl,
    destinationDirectory: temporaryDirectory,
    onProgress: (record, total) => console.log(`  ${record.page}/${total}  ${record.filename}  ${Math.round(record.bytes / 1024)} KB`),
  });

  const importer = path.join(ROOT, 'scripts', 'import-succession-chapter.mjs');
  const importerArgs = [importer, String(chapter), temporaryDirectory, ...(replace ? ['--replace'] : [])];
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, importerArgs, { cwd: ROOT, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => resolve(code ?? 1));
  });
  if (exitCode !== 0) throw new Error(`The local chapter importer exited with code ${exitCode}.`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log(`\nChapter ${chapter} is ready in the repository. Review the generated folder and manifest before committing.`);
