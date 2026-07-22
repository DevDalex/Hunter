import { execFile } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { readWebpDimensions, stableHunterpediaImageUrl } from './lib/mediaPipeline.mjs';
import { cardLibraryRemoteMedia } from '../src/data/greed-island/cardLibraryMedia.js';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outputDirectory = path.join(root, 'public/media/greed-island/library-cards');
const manifestPath = path.join(root, 'src/data/greed-island/cardLibraryLocalMedia.generated.js');
const verifyOnly = process.argv.includes('--verify-only');
const reviewed = '2026-07-22';
const concurrency = 5;
const expectedCount = 62;

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const localStem = (cardId) => cardId.startsWith('-') ? `gm${cardId}` : cardId;

const fetchImage = async (source, label) => {
  let lastError = null;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(stableHunterpediaImageUrl(source), {
        redirect: 'follow',
        headers: {
          Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
          'User-Agent': 'Hunter-x-Hunter-Archive/Greed-Island-Library-Media',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) throw new Error(contentType || 'non-image response');
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < 4) await sleep(700 * attempt);
    }
  }
  throw new Error(`${label} could not be downloaded: ${lastError?.message || 'unknown error'}`);
};

const parseManifest = async () => {
  const source = await readFile(manifestPath, 'utf8');
  const matches = [...source.matchAll(/\{ cardId: ("(?:[^"\\]|\\.)*"), src: ("(?:[^"\\]|\\.)*"), width: (\d+), height: (\d+), filePage: ("(?:[^"\\]|\\.)*"), imageSource: ("(?:[^"\\]|\\.)*"), sourcePage: ("(?:[^"\\]|\\.)*"), storage: 'local', reviewed: ("(?:[^"\\]|\\.)*") \}/g)];
  return matches.map((match) => ({
    cardId: JSON.parse(match[1]),
    src: JSON.parse(match[2]),
    width: Number(match[3]),
    height: Number(match[4]),
    filePage: JSON.parse(match[5]),
    imageSource: JSON.parse(match[6]),
    sourcePage: JSON.parse(match[7]),
    storage: 'local',
    reviewed: JSON.parse(match[8]),
  }));
};

const verify = async (records) => {
  const failures = [];
  if (cardLibraryRemoteMedia.length !== expectedCount) failures.push(`remote registry has ${cardLibraryRemoteMedia.length} records`);
  if (records.length !== expectedCount) failures.push(`local manifest has ${records.length} records`);
  if (new Set(records.map((record) => record.cardId)).size !== records.length) failures.push('local manifest ids are not unique');

  const recordById = new Map(records.map((record) => [record.cardId, record]));
  for (const source of cardLibraryRemoteMedia) {
    const record = recordById.get(source.cardId);
    if (!record) {
      failures.push(`${source.cardId}: local media record missing`);
      continue;
    }
    if (record.filePage !== source.filePage || record.imageSource !== source.remote || record.sourcePage !== source.sourcePage) {
      failures.push(`${source.cardId}: provenance drifted from exact Hunterpedia table media`);
    }
    const expectedPath = `/media/greed-island/library-cards/${localStem(source.cardId)}.webp`;
    if (record.src !== expectedPath) failures.push(`${source.cardId}: invalid local path ${record.src}`);
    try {
      const dimensions = await readWebpDimensions(path.join(root, 'public', record.src.slice(1)));
      if (dimensions.width !== record.width || dimensions.height !== record.height) failures.push(`${source.cardId}: manifest dimensions do not match file`);
      if (dimensions.width < 120 || dimensions.height < 120) failures.push(`${source.cardId}: stabilized image is unexpectedly small (${dimensions.width}x${dimensions.height})`);
    } catch (error) {
      failures.push(`${source.cardId}: ${error.message}`);
    }
  }

  if (failures.length) throw new Error(`Greed Island library-media verification failed:\n${failures.join('\n')}`);
  return records.length;
};

if (verifyOnly) {
  const records = await parseManifest();
  const count = await verify(records);
  console.log(`Greed Island card library media verified: ${count}/${expectedCount} local WebPs match the exact Hunterpedia table imagery.`);
  process.exit(0);
}

await mkdir(outputDirectory, { recursive: true });
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'hxh-greed-island-library-media-'));
const results = new Array(cardLibraryRemoteMedia.length);
const failures = [];
let cursor = 0;

const processRecord = async (source, index) => {
  const stem = localStem(source.cardId);
  const output = path.join(outputDirectory, `${stem}.webp`);
  const temporaryFile = path.join(temporaryDirectory, `${stem}.download`);
  try {
    await access(output);
  } catch {
    await writeFile(temporaryFile, await fetchImage(source.remote, source.cardId));
    await execFileAsync('convert', [
      temporaryFile,
      '-auto-orient',
      '-resize', '520x760>',
      '-strip',
      '-quality', '84',
      output,
    ]);
  }
  const dimensions = await readWebpDimensions(output);
  results[index] = {
    cardId: source.cardId,
    src: `/media/greed-island/library-cards/${stem}.webp`,
    width: dimensions.width,
    height: dimensions.height,
    filePage: source.filePage,
    imageSource: source.remote,
    sourcePage: source.sourcePage,
    storage: 'local',
    reviewed,
  };
};

const workers = Array.from({ length: concurrency }, async () => {
  while (cursor < cardLibraryRemoteMedia.length) {
    const index = cursor;
    cursor += 1;
    try {
      await processRecord(cardLibraryRemoteMedia[index], index);
      process.stdout.write(`✓ ${cardLibraryRemoteMedia[index].cardId}\n`);
    } catch (error) {
      failures.push(`${cardLibraryRemoteMedia[index].cardId}: ${error.message}`);
      process.stdout.write(`✗ ${cardLibraryRemoteMedia[index].cardId} · ${error.message}\n`);
    }
  }
});

try {
  await Promise.all(workers);
  if (failures.length) throw new Error(`Could not stabilize ${failures.length} library card images:\n${failures.join('\n')}`);
  const stableResults = results.filter(Boolean);
  await verify(stableResults);
  const lines = stableResults.map((record) => `  { cardId: ${JSON.stringify(record.cardId)}, src: ${JSON.stringify(record.src)}, width: ${record.width}, height: ${record.height}, filePage: ${JSON.stringify(record.filePage)}, imageSource: ${JSON.stringify(record.imageSource)}, sourcePage: ${JSON.stringify(record.sourcePage)}, storage: 'local', reviewed: ${JSON.stringify(record.reviewed)} },`);
  const manifest = `// Generated by scripts/stabilize-greed-island-library-media.mjs. Do not edit entries by hand.\nexport const cardLibraryLocalMedia = Object.freeze([\n${lines.join('\n')}\n]);\nexport const cardLibraryLocalMediaById = new Map(cardLibraryLocalMedia.map((record) => [record.cardId, record]));\n`;
  await writeFile(manifestPath, manifest);
  console.log(`Greed Island card library media stabilized: ${stableResults.length}/${expectedCount} verified WebPs written to public/media/greed-island/library-cards/.`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
