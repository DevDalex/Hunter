import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';
import { blackWhaleRoomMedia } from '../src/data/blackWhaleMedia.generated.js';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outputDirectory = path.join(root, 'public/media/rooms');
const manifestPath = path.join(root, 'src/data/blackWhaleMedia.generated.js');
const verifyOnly = process.argv.includes('--verify-only');
const reviewed = 'July 16, 2026';
const concurrency = 3;

const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const dimensionsOf = async (file) => {
  const bytes = await readFile(file);
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') throw new Error(`Not a WebP file: ${file}`);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = bytes.subarray(offset, offset + 4).toString('ascii');
    const size = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X' && data + 10 <= bytes.length) return { width: bytes.readUIntLE(data + 4, 3) + 1, height: bytes.readUIntLE(data + 7, 3) + 1 };
    if (type === 'VP8L' && data + 5 <= bytes.length && bytes[data] === 0x2f) {
      return {
        width: 1 + bytes[data + 1] + ((bytes[data + 2] & 0x3f) << 8),
        height: 1 + ((bytes[data + 2] & 0xc0) >> 6) + (bytes[data + 3] << 2) + ((bytes[data + 4] & 0x0f) << 10),
      };
    }
    if (type === 'VP8 ' && data + 10 <= bytes.length && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
      return { width: bytes.readUInt16LE(data + 6) & 0x3fff, height: bytes.readUInt16LE(data + 8) & 0x3fff };
    }
    offset = data + size + (size % 2);
  }
  throw new Error(`Could not read WebP dimensions for ${file}`);
};

const stableImageRequestUrl = (source) => {
  const marker = '/wiki/Special:Redirect/file/';
  if (!source.includes(marker)) return source;
  const filename = decodeURIComponent(source.split(marker)[1] || '').replaceAll(' ', '_');
  const hash = createHash('md5').update(filename).digest('hex');
  return `https://static.wikia.nocookie.net/hunterxhunter/images/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename).replaceAll('%2F', '/')}/revision/latest`;
};

const loadSources = async () => {
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const module = await server.ssrLoadModule('/src/data/blackWhale.js');
    return module.blackWhaleRemoteImageSources;
  } finally {
    await server.close();
  }
};

const verify = async (records, sources = null) => {
  const failures = [];
  if (sources) {
    const expected = new Set(sources.map((record) => record.imageSource));
    const actual = new Set(records.map((record) => record.imageSource));
    if (expected.size !== actual.size || [...expected].some((source) => !actual.has(source))) failures.push('manifest does not cover every remote Black Whale image source');
  }
  for (const record of records) {
    const file = path.join(root, 'public', record.src.slice(1));
    try {
      const dimensions = await dimensionsOf(file);
      if (dimensions.width !== record.width || dimensions.height !== record.height) failures.push(`${record.key}: manifest dimensions do not match the file`);
      if (!/^\d+% \d+%$/.test(record.focal)) failures.push(`${record.key}: invalid focal point`);
    } catch (error) {
      failures.push(`${record.key}: ${error.message}`);
    }
  }
  if (failures.length) throw new Error(`Black Whale media verification failed:\n${failures.join('\n')}`);
  return records.length;
};

if (verifyOnly) {
  const sources = await loadSources();
  const count = await verify(blackWhaleRoomMedia, sources);
  console.log(`Black Whale media verified: ${count} locally stored Hunterpedia images.`);
  process.exit(0);
}

const sources = await loadSources();
await mkdir(outputDirectory, { recursive: true });
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'hxh-black-whale-media-'));
const results = new Array(sources.length);
const failures = [];
let cursor = 0;

const processRecord = async (record, index) => {
  const temporaryFile = path.join(temporaryDirectory, `${String(index).padStart(3, '0')}.download`);
  const filename = `black-whale-${slugify(record.key)}.webp`;
  const output = path.join(outputDirectory, filename);
  let existingIsValid = false;
  try {
    await access(output);
    await dimensionsOf(output);
    existingIsValid = true;
  } catch {
    await rm(output, { force: true });
  }
  if (!existingIsValid) {
    const response = await fetch(stableImageRequestUrl(record.imageSource), {
      redirect: 'follow',
      headers: { Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8', 'User-Agent': 'Hunter-x-Hunter-Archive/Media-Stabilizer' },
    });
    if (!response.ok) throw new Error(`${record.key} returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`${record.key} returned ${contentType || 'non-image content'}`);
    await writeFile(temporaryFile, Buffer.from(await response.arrayBuffer()));
    await execFileAsync('convert', [temporaryFile, '-auto-orient', '-resize', '1400x1400>', '-strip', '-quality', '84', output]);
  }
  const { width, height } = await dimensionsOf(output);
  results[index] = {
    key: record.key,
    src: `/media/rooms/${filename}`,
    width,
    height,
    focal: '50% 50%',
    articleSource: record.articleSource,
    imageSource: record.imageSource,
    storage: 'local',
    reviewed,
  };
};

const workers = Array.from({ length: concurrency }, async () => {
  while (cursor < sources.length) {
    const index = cursor;
    cursor += 1;
    try {
      await processRecord(sources[index], index);
    } catch (error) {
      failures.push(`${sources[index].key}: ${error.message}`);
    }
  }
});

try {
  await Promise.all(workers);
  const stableResults = results.filter(Boolean);
  if (failures.length) throw new Error(`Could not stabilize ${failures.length} Black Whale images:\n${failures.join('\n')}`);
  await verify(stableResults, sources);
  const lines = stableResults.map((record) => `  { key: ${JSON.stringify(record.key)}, src: ${JSON.stringify(record.src)}, width: ${record.width}, height: ${record.height}, focal: ${JSON.stringify(record.focal)}, articleSource: ${JSON.stringify(record.articleSource)}, imageSource: ${JSON.stringify(record.imageSource)}, storage: 'local', reviewed: ${JSON.stringify(record.reviewed)} },`);
  const manifest = `// Generated by scripts/stabilize-room-media.mjs. Do not edit individual entries by hand.\nexport const blackWhaleRoomMedia = [\n${lines.join('\n')}\n];\nexport const blackWhaleRoomMediaBySource = new Map(blackWhaleRoomMedia.map((record) => [record.imageSource, record]));\n`;
  await writeFile(manifestPath, manifest);
  console.log(`Black Whale media stabilized: ${stableResults.length} verified images written to public/media/rooms/.`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
