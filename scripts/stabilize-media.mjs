import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outputDirectory = path.join(root, 'public/media/portraits');
const manifestPath = path.join(root, 'src/data/priorityMedia.generated.js');
const verifyOnly = process.argv.includes('--verify-only');
const reviewed = 'July 15, 2026';
const concurrency = 6;

const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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

const dimensionsOf = async (file) => {
  const bytes = await readFile(file);
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') throw new Error(`Not a WebP file: ${file}`);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = bytes.subarray(offset, offset + 4).toString('ascii');
    const size = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X' && data + 10 <= bytes.length) {
      return { width: bytes.readUIntLE(data + 4, 3) + 1, height: bytes.readUIntLE(data + 7, 3) + 1 };
    }
    if (type === 'VP8L' && data + 5 <= bytes.length && bytes[data] === 0x2f) {
      const width = 1 + bytes[data + 1] + ((bytes[data + 2] & 0x3f) << 8);
      const height = 1 + ((bytes[data + 2] & 0xc0) >> 6) + (bytes[data + 3] << 2) + ((bytes[data + 4] & 0x0f) << 10);
      return { width, height };
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

const existingManifest = async () => {
  const source = await readFile(manifestPath, 'utf8');
  const entries = [...source.matchAll(/\{ name: ("(?:[^"\\]|\\.)*"), src: ("(?:[^"\\]|\\.)*"), width: (\d+), height: (\d+), focal: ("(?:[^"\\]|\\.)*"), articleSource: ("(?:[^"\\]|\\.)*"), imageSource: ("(?:[^"\\]|\\.)*"), storage: 'local', reviewed: ("(?:[^"\\]|\\.)*") \}/g)];
  return entries.map((match) => ({ name: JSON.parse(match[1]), src: JSON.parse(match[2]), width: Number(match[3]), height: Number(match[4]), focal: JSON.parse(match[5]), articleSource: JSON.parse(match[6]), imageSource: JSON.parse(match[7]), storage: 'local', reviewed: JSON.parse(match[8]) }));
};

const verify = async (records) => {
  const failures = [];
  for (const record of records) {
    const file = path.join(root, 'public', record.src.slice(1));
    try {
      const dimensions = await dimensionsOf(file);
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
  const records = await existingManifest();
  const count = await verify(records);
  console.log(`Priority media verified: ${count} local portraits with matching dimensions and focal points.`);
  process.exit(0);
}

const sources = await loadPortraitSources();
await mkdir(outputDirectory, { recursive: true });
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'hxh-priority-media-'));
const results = new Array(sources.length);
const failures = [];
let cursor = 0;

const processRecord = async (record, index) => {
  if (!record.imageSource) throw new Error(`${record.name} has no verified image source`);
  const temporaryFile = path.join(temporaryDirectory, `${String(index).padStart(3, '0')}.download`);
  const filename = `${slugify(record.name)}.webp`;
  const output = path.join(outputDirectory, filename);
  try {
    await access(output);
  } catch {
    const response = await fetch(stableImageRequestUrl(record.imageSource), { redirect: 'follow', headers: { Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8', 'User-Agent': 'Hunter-x-Hunter-Archive/7B' } });
    if (!response.ok) throw new Error(`${record.name} returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`${record.name} returned ${contentType || 'non-image content'}`);
    await writeFile(temporaryFile, Buffer.from(await response.arrayBuffer()));
    await execFileAsync('convert', [temporaryFile, '-auto-orient', '-resize', '900x900>', '-strip', '-quality', '84', output]);
  }
  const { width, height } = await dimensionsOf(output);
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
  await verify(stableResults);
  const lines = stableResults.map((record) => `  { name: ${JSON.stringify(record.name)}, src: ${JSON.stringify(record.src)}, width: ${record.width}, height: ${record.height}, focal: ${JSON.stringify(record.focal)}, articleSource: ${JSON.stringify(record.articleSource)}, imageSource: ${JSON.stringify(record.imageSource)}, storage: 'local', reviewed: ${JSON.stringify(record.reviewed)} },`);
  const manifest = `// Generated by scripts/stabilize-media.mjs. Do not edit individual entries by hand.\nexport const priorityPortraits = [\n${lines.join('\n')}\n];\nexport const priorityPortraitByName = new Map(priorityPortraits.map((record) => [record.name, record]));\n`;
  await writeFile(manifestPath, manifest);
  console.log(`Priority media stabilized: ${stableResults.length} verified portraits written to public/media/portraits/.`);
  if (failures.length) throw new Error(`Could not stabilize ${failures.length} portraits:\n${failures.join('\n')}`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
