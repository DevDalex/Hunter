import { execFile } from 'node:child_process';
import { access, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';
import { blackWhaleRoomMedia } from '../src/data/blackWhaleMedia.generated.js';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';
import { readWebpDimensions, slugifyMediaKey, stableHunterpediaImageUrl } from './lib/mediaPipeline.mjs';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outputDirectory = path.join(root, 'public/media/rooms');
const manifestPath = path.join(root, 'src/data/blackWhaleMedia.generated.js');
const verifyOnly = process.argv.includes('--verify-only');
const reviewed = 'July 16, 2026';
const concurrency = 3;

const loadSources = async () => {
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const module = await server.ssrLoadModule('/src/data/blackWhale.js');
    return module.blackWhaleRemoteImageSources;
  } finally {
    await server.close();
  }
};

const verify = async (records, sources) => {
  const failures = [];
  const sourceByKey = new Map(sources.map((record) => [record.key, record]));
  if (sourceByKey.size !== sources.length) failures.push('canonical Black Whale media keys are not unique');
  if (records.length !== sources.length) failures.push(`manifest has ${records.length} records for ${sources.length} canonical Black Whale sources`);
  for (const source of sources) {
    if (!isApprovedSourceUrl(source.articleSource) || !isApprovedSourceUrl(source.imageSource)) failures.push(`${source.key}: canonical source is outside the approved Hunterpedia hosts`);
  }
  for (const record of records) {
    const canonical = sourceByKey.get(record.key);
    if (!canonical) failures.push(`${record.key}: manifest record has no canonical source record`);
    else if (record.articleSource !== canonical.articleSource || record.imageSource !== canonical.imageSource) failures.push(`${record.key}: generated provenance drifted from blackWhale.js`);
    const file = path.join(root, 'public', record.src.slice(1));
    try {
      const dimensions = await readWebpDimensions(file);
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
  console.log(`Black Whale media verified: ${count} local derivatives match canonical room sources.`);
  process.exit(0);
}

const sources = await loadSources();
await mkdir(outputDirectory, { recursive: true });
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'hxh-black-whale-media-'));
const results = new Array(sources.length);
const failures = [];
let cursor = 0;

const processRecord = async (record, index) => {
  if (!isApprovedSourceUrl(record.articleSource) || !isApprovedSourceUrl(record.imageSource)) throw new Error(`${record.key} has an unapproved source URL`);
  const temporaryFile = path.join(temporaryDirectory, `${String(index).padStart(3, '0')}.download`);
  const filename = `black-whale-${slugifyMediaKey(record.key)}.webp`;
  const output = path.join(outputDirectory, filename);
  let existingIsValid = false;
  try {
    await access(output);
    await readWebpDimensions(output);
    existingIsValid = true;
  } catch {
    await rm(output, { force: true });
  }
  if (!existingIsValid) {
    const response = await fetch(stableHunterpediaImageUrl(record.imageSource), {
      redirect: 'follow',
      headers: { Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8', 'User-Agent': 'Hunter-x-Hunter-Archive/Media-Stabilizer' },
    });
    if (!response.ok) throw new Error(`${record.key} returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`${record.key} returned ${contentType || 'non-image content'}`);
    await writeFile(temporaryFile, Buffer.from(await response.arrayBuffer()));
    await execFileAsync('convert', [temporaryFile, '-auto-orient', '-resize', '1400x1400>', '-strip', '-quality', '84', output]);
  }
  const { width, height } = await readWebpDimensions(output);
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
  const manifest = `// Generated by scripts/stabilize-room-media.mjs from src/data/blackWhale.js. Do not edit individual entries by hand.\nexport const blackWhaleRoomMedia = [\n${lines.join('\n')}\n];\nexport const blackWhaleRoomMediaBySource = new Map(blackWhaleRoomMedia.map((record) => [record.imageSource, record]));\nexport const blackWhaleRoomMediaByKey = new Map(blackWhaleRoomMedia.map((record) => [record.key, record]));\n`;
  await writeFile(manifestPath, manifest);
  console.log(`Black Whale media stabilized: ${stableResults.length} verified images written to public/media/rooms/.`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
