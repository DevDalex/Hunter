import { execFile } from 'node:child_process';
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';
import { readWebpDimensions, slugifyMediaKey, stableHunterpediaImageUrl } from './lib/mediaPipeline.mjs';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outputDirectory = path.join(root, 'public/media/portraits');
const manifestPath = path.join(root, 'src/data/priorityMedia.generated.js');
const verifyOnly = process.argv.includes('--verify-only');
const reviewed = 'July 15, 2026';
const concurrency = 6;

const focalOverrides = new Map([
  ['Razor', [50, 24]], ['Beyond Netero', [49, 28]], ['Nasubi Hui Guo Rou', [50, 38]],
  ['Woble Hui Guo Rou', [50, 45]], ['Tyson Hui Guo Rou', [50, 40]], ['Marayam Hui Guo Rou', [50, 42]],
  ['Neon Nostrade', [50, 30]], ['Knov', [50, 25]], ['Alluka Zoldyck', [50, 34]],
  ['Morena Prudo', [50, 35]], ['Borksen', [50, 34]], ['Oito Hui Guo Rou', [50, 36]],
]);

const loadPortraitSources = async () => {
  const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' });
  try {
    const module = await server.ssrLoadModule('/src/data/characters.js');
    return module.characterPortraitSources;
  } finally {
    await server.close();
  }
};

const existingManifest = async () => {
  const source = await readFile(manifestPath, 'utf8');
  const entries = [...source.matchAll(/\{ name: ("(?:[^"\\]|\\.)*"), src: ("(?:[^"\\]|\\.)*"), width: (\d+), height: (\d+), focal: ("(?:[^"\\]|\\.)*"), articleSource: ("(?:[^"\\]|\\.)*"), imageSource: ("(?:[^"\\]|\\.)*"), storage: 'local', reviewed: ("(?:[^"\\]|\\.)*") \}/g)];
  return entries.map((match) => ({ name: JSON.parse(match[1]), src: JSON.parse(match[2]), width: Number(match[3]), height: Number(match[4]), focal: JSON.parse(match[5]), articleSource: JSON.parse(match[6]), imageSource: JSON.parse(match[7]), storage: 'local', reviewed: JSON.parse(match[8]) }));
};

const verify = async (records, sources) => {
  const failures = [];
  const sourceByName = new Map(sources.map((record) => [record.name, record]));
  if (sourceByName.size !== sources.length) failures.push('canonical portrait names are not unique');
  if (records.length !== sources.length) failures.push(`manifest has ${records.length} records for ${sources.length} canonical portrait sources`);
  for (const source of sources) {
    if (!isApprovedSourceUrl(source.articleSource) || !isApprovedSourceUrl(source.imageSource)) failures.push(`${source.name}: canonical source is outside the approved Hunterpedia hosts`);
  }
  for (const record of records) {
    const canonical = sourceByName.get(record.name);
    if (!canonical) failures.push(`${record.name}: manifest record has no canonical source record`);
    else if (record.articleSource !== canonical.articleSource || record.imageSource !== canonical.imageSource) failures.push(`${record.name}: generated provenance drifted from characters.js`);
    const file = path.join(root, 'public', record.src.slice(1));
    try {
      const dimensions = await readWebpDimensions(file);
      if (dimensions.width !== record.width || dimensions.height !== record.height) failures.push(`${record.name}: manifest dimensions do not match the file`);
      if (!/^\d+% \d+%$/.test(record.focal)) failures.push(`${record.name}: invalid focal point`);
    } catch (error) {
      failures.push(`${record.name}: ${error.message}`);
    }
  }
  if (failures.length) throw new Error(`Priority-media verification failed:\n${failures.join('\n')}`);
  return records.length;
};

if (verifyOnly) {
  const [records, sources] = await Promise.all([existingManifest(), loadPortraitSources()]);
  const count = await verify(records, sources);
  console.log(`Priority media verified: ${count} local portraits match canonical character sources, dimensions, and focal points.`);
  process.exit(0);
}

const sources = await loadPortraitSources();
await mkdir(outputDirectory, { recursive: true });
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'hxh-priority-media-'));
const results = new Array(sources.length);
const failures = [];
let cursor = 0;

const processRecord = async (record, index) => {
  if (!isApprovedSourceUrl(record.articleSource) || !isApprovedSourceUrl(record.imageSource)) throw new Error(`${record.name} has an unapproved source URL`);
  const temporaryFile = path.join(temporaryDirectory, `${String(index).padStart(3, '0')}.download`);
  const filename = `${slugifyMediaKey(record.name)}.webp`;
  const output = path.join(outputDirectory, filename);
  try {
    await access(output);
  } catch {
    const response = await fetch(stableHunterpediaImageUrl(record.imageSource), { redirect: 'follow', headers: { Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8', 'User-Agent': 'Hunter-x-Hunter-Archive/7B' } });
    if (!response.ok) throw new Error(`${record.name} returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`${record.name} returned ${contentType || 'non-image content'}`);
    await writeFile(temporaryFile, Buffer.from(await response.arrayBuffer()));
    await execFileAsync('convert', [temporaryFile, '-auto-orient', '-resize', '900x900>', '-strip', '-quality', '84', output]);
  }
  const { width, height } = await readWebpDimensions(output);
  const [x, y] = focalOverrides.get(record.name) || [50, height > width * 1.25 ? 28 : 34];
  results[index] = {
    name: record.name,
    src: `/media/portraits/${filename}`,
    width,
    height,
    focal: `${x}% ${y}%`,
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
      failures.push(`${sources[index].name}: ${error.message}`);
    }
  }
});

try {
  await Promise.all(workers);
  const stableResults = results.filter(Boolean);
  await verify(stableResults, sources);
  const lines = stableResults.map((record) => `  { name: ${JSON.stringify(record.name)}, src: ${JSON.stringify(record.src)}, width: ${record.width}, height: ${record.height}, focal: ${JSON.stringify(record.focal)}, articleSource: ${JSON.stringify(record.articleSource)}, imageSource: ${JSON.stringify(record.imageSource)}, storage: 'local', reviewed: ${JSON.stringify(record.reviewed)} },`);
  const manifest = `// Generated by scripts/stabilize-media.mjs from src/data/characters.js. Do not edit individual entries by hand.\nexport const priorityPortraits = [\n${lines.join('\n')}\n];\nexport const priorityPortraitByName = new Map(priorityPortraits.map((record) => [record.name, record]));\n`;
  await writeFile(manifestPath, manifest);
  console.log(`Priority media stabilized: ${stableResults.length} verified portraits written to public/media/portraits/.`);
  if (failures.length) throw new Error(`Could not stabilize ${failures.length} portraits:\n${failures.join('\n')}`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
