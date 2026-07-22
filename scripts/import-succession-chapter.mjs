#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const READER_START = 339;
const READER_END = 414;
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ROOT = process.cwd();
const MEDIA_ROOT = path.join(ROOT, 'public', 'media', 'succession-contest', 'chapters');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'successionChapterMedia.generated.js');
const HISTORY_PATH = path.join(ROOT, 'src', 'data', 'successionChapterImportHistory.generated.js');

const usage = () => {
  console.log(`Usage:
  npm run import:succession-chapter -- <chapter> <source-directory> [--replace] [--dry-run]

Example:
  npm run import:succession-chapter -- 414 ./incoming/chapter-414 --replace

The source directory must contain the chapter page images in reading order.
Files are naturally sorted, renamed 001.ext, 002.ext, and copied into:
  public/media/succession-contest/chapters/<chapter>/`);
};

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) { usage(); process.exit(0); }
const replace = args.includes('--replace');
const dryRun = args.includes('--dry-run');
const sourceUrl = String(process.env.SUCCESSION_CHAPTER_SOURCE_URL || '').trim() || null;
const unknownFlags = args.filter((arg) => arg.startsWith('--') && !['--replace', '--dry-run'].includes(arg));
const positional = args.filter((arg) => !arg.startsWith('--'));
if (unknownFlags.length) throw new Error(`Unknown option: ${unknownFlags.join(', ')}`);
if (positional.length !== 2) { usage(); process.exit(1); }

const chapter = Number.parseInt(positional[0], 10);
const sourceDirectory = path.resolve(ROOT, positional[1]);
if (!Number.isInteger(chapter) || chapter < READER_START || chapter > READER_END) throw new Error(`Chapter must be an integer from ${READER_START} through ${READER_END}.`);
const sourceStats = await stat(sourceDirectory).catch(() => null);
if (!sourceStats?.isDirectory()) throw new Error(`Source directory does not exist: ${sourceDirectory}`);

const naturalSort = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const sourceFiles = (await readdir(sourceDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort((left, right) => naturalSort.compare(left, right));
if (!sourceFiles.length) throw new Error('No JPG, PNG, or WebP chapter pages were found in the source directory.');

const readUInt24LE = (buffer, offset) => buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
const pngDimensions = (buffer) => buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG' ? { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) } : null;
const jpegDimensions = (buffer) => {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  const markers = new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
  let offset = 2;
  while (offset + 3 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset]; offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (marker === 0xda || offset + 1 >= buffer.length) break;
    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break;
    if (markers.has(marker)) return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    offset += segmentLength;
  }
  return null;
};
const webpDimensions = (buffer) => {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString('ascii', offset, offset + 4); const chunkSize = buffer.readUInt32LE(offset + 4); const dataOffset = offset + 8;
    if (chunkType === 'VP8X' && dataOffset + 10 <= buffer.length) return { width: readUInt24LE(buffer, dataOffset + 4) + 1, height: readUInt24LE(buffer, dataOffset + 7) + 1 };
    if (chunkType === 'VP8L' && dataOffset + 5 <= buffer.length && buffer[dataOffset] === 0x2f) {
      const b1=buffer[dataOffset+1],b2=buffer[dataOffset+2],b3=buffer[dataOffset+3],b4=buffer[dataOffset+4];
      return { width: 1 + (((b2 & 0x3f) << 8) | b1), height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)) };
    }
    if (chunkType === 'VP8 ' && dataOffset + 10 <= buffer.length && buffer[dataOffset + 3] === 0x9d && buffer[dataOffset + 4] === 0x01 && buffer[dataOffset + 5] === 0x2a) return { width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff, height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff };
    offset = dataOffset + chunkSize + (chunkSize % 2);
  }
  return null;
};
const imageDimensions = (buffer, extension) => extension === '.png' ? pngDimensions(buffer) : (extension === '.jpg' || extension === '.jpeg') ? jpegDimensions(buffer) : extension === '.webp' ? webpDimensions(buffer) : null;
const normalizeExtension = (extension) => extension === '.jpeg' ? '.jpg' : extension;
const importedAt = new Date().toISOString();
const pageRecords = [];

for (const [index, sourceName] of sourceFiles.entries()) {
  const sourcePath = path.join(sourceDirectory, sourceName); const extension = path.extname(sourceName).toLowerCase(); const buffer = await readFile(sourcePath); const dimensions = imageDimensions(buffer, extension);
  if (!dimensions?.width || !dimensions?.height) throw new Error(`Could not verify image dimensions for ${sourceName}.`);
  const page = index + 1; const outputExtension = normalizeExtension(extension); const outputName = `${String(page).padStart(3, '0')}${outputExtension}`; const src = `/media/succession-contest/chapters/${chapter}/${outputName}`;
  pageRecords.push({ id:`chapter-${chapter}-p${String(page).padStart(3,'0')}`,chapter,page,label:`p.${page}`,filename:outputName,src,localPath:src,sourceUrl,width:dimensions.width,height:dimensions.height,format:outputExtension.slice(1),byteSize:buffer.byteLength,checksum:`sha256-${createHash('sha256').update(buffer).digest('hex')}`,status:'published',importedAt,sourceName,outputName });
}

const manifestModule = await import(`${pathToFileURL(MANIFEST_PATH).href}?import=${Date.now()}`);
const historyModule = await import(`${pathToFileURL(HISTORY_PATH).href}?import=${Date.now()}`);
const existingManifest = manifestModule.authorizedSuccessionChapterMedia || {};
const existingHistory = historyModule.successionChapterImportHistory || [];
const previousPageCount = Array.isArray(existingManifest[chapter]) ? existingManifest[chapter].length : 0;
const storedRecords = pageRecords.map(({ sourceName, outputName, ...record }) => record);
const nextManifest = { ...existingManifest, [chapter]: storedRecords };
const nextHistory = [...existingHistory, { id:`chapter-${chapter}-${Date.now()}`,action:previousPageCount?'replace-chapter':'import-chapter',chapter,previousPageCount,newPageCount:storedRecords.length,expectedPageCount:storedRecords.length,missingPages:[],status:'published',sourceUrl,sourceType:sourceUrl?'remote-url':'local-directory',sourceDirectory:path.relative(ROOT,sourceDirectory),timestamp:importedAt,commitSha:null }];

console.log(`Chapter ${chapter}: ${pageRecords.length} page${pageRecords.length === 1 ? '' : 's'}`);
for (const page of pageRecords) console.log(`  ${page.sourceName} -> ${page.outputName} (${page.width}x${page.height}, ${page.checksum})`);
if (dryRun) { console.log('Dry run complete. No files were changed.'); process.exit(0); }

const destination = path.join(MEDIA_ROOT, String(chapter)); const destinationStats = await stat(destination).catch(() => null);
if (destinationStats && !replace) throw new Error(`Destination already exists: ${destination}. Re-run with --replace to overwrite it.`);
await mkdir(MEDIA_ROOT, { recursive: true });
const temporaryDestination = path.join(MEDIA_ROOT, `.${chapter}-import-${process.pid}-${Date.now()}`); await mkdir(temporaryDestination, { recursive: true });
try {
  for (const page of pageRecords) await copyFile(path.join(sourceDirectory, page.sourceName), path.join(temporaryDestination, page.outputName));
  if (destinationStats) await rm(destination, { recursive: true, force: true });
  await rename(temporaryDestination, destination);
  await writeFile(MANIFEST_PATH, `// Generated by the Succession chapter import tools.\n// Do not edit page records manually; re-run an importer instead.\nexport const authorizedSuccessionChapterMedia = Object.freeze(${JSON.stringify(nextManifest, null, 2)});\n`, 'utf8');
  await writeFile(HISTORY_PATH, `// Generated by Succession chapter import tools.\n// Importers append immutable audit records; do not edit entries by hand.\nexport const successionChapterImportHistory = Object.freeze(${JSON.stringify(nextHistory, null, 2)});\n`, 'utf8');
} catch (error) { await rm(temporaryDestination, { recursive: true, force: true }); throw error; }
console.log(`Imported Chapter ${chapter} into ${path.relative(ROOT, destination)}.`);
console.log(`Updated ${path.relative(ROOT, MANIFEST_PATH)} and ${path.relative(ROOT, HISTORY_PATH)}.`);
