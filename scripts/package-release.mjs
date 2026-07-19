import { build as viteBuild } from 'vite';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  CURRENT_RELEASE_DATE,
  CURRENT_RELEASE_VERSION,
  RELEASE_MANIFEST_PATH,
  SITES_SOURCE_PACKAGE_PATH,
  STANDALONE_PACKAGE_PATH,
  releaseGates,
  releaseStats,
} from '../src/data/releaseReadiness.js';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sitesOutput = path.join(publicDir, SITES_SOURCE_PACKAGE_PATH.slice(1));
const standaloneOutput = path.join(publicDir, STANDALONE_PACKAGE_PATH.slice(1));
const manifestPath = path.join(publicDir, RELEASE_MANIFEST_PATH.slice(1));
const standaloneBuild = path.join(root, '.standalone-build');
const standaloneStage = path.join(root, '.standalone-stage');
const fixedDate = new Date('2026-07-16T12:00:00Z');

const sourceRoots = [
  'src', 'scripts', 'server', 'public', '.openai/hosting.json', 'README.md',
  'index.html', 'package.json', 'package-lock.json', 'vite.config.js',
  'vite.standalone.config.js',
];

const isDownloadArchive = (relative) => /^public\/hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(relative.replaceAll(path.sep, '/'));

const walk = async (base, relative, shouldIgnore = () => false) => {
  const normalized = relative.replaceAll(path.sep, '/');
  if (shouldIgnore(normalized)) return [];
  const absolute = path.join(base, relative);
  const record = await stat(absolute);
  if (record.isFile()) return [normalized];
  const entries = await readdir(absolute);
  return (await Promise.all(entries.sort().map((entry) => walk(base, path.join(relative, entry), shouldIgnore)))).flat();
};

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let current = value;
  for (let bit = 0; bit < 8; bit += 1) current = (current & 1) ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
  return current >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const dosDateTime = (date) => ({
  time: (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2),
  date: ((date.getUTCFullYear() - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate(),
});

const buildZip = async (base, files) => {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const stamp = dosDateTime(fixedDate);

  for (const relative of files) {
    const name = Buffer.from(relative, 'utf8');
    const data = await readFile(path.join(base, relative));
    const checksum = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(stamp.time, 10);
    local.writeUInt16LE(stamp.date, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(stamp.time, 12);
    central.writeUInt16LE(stamp.date, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
};

const relativeAssetPath = (value) => value.replace(/^\.\//, '');
const escapeClosingTag = (value, tag) => value.replace(new RegExp(`</${tag}`, 'gi'), `<\\/${tag}`);

const makeStandaloneHtml = async () => {
  await viteBuild({ configFile: path.join(root, 'vite.standalone.config.js') });
  let html = await readFile(path.join(standaloneBuild, 'index.html'), 'utf8');
  const scriptTag = html.match(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*><\/script>/i);
  const styleTag = html.match(/<link\b[^>]*\bhref="([^"]+\.css)"[^>]*>/i);
  if (!scriptTag || !styleTag) throw new Error('Standalone build did not expose one script and one stylesheet to inline.');

  let javascript = await readFile(path.join(standaloneBuild, relativeAssetPath(scriptTag[1])), 'utf8');
  let stylesheet = await readFile(path.join(standaloneBuild, relativeAssetPath(styleTag[1])), 'utf8');
  const publicRoots = ['/media/', '/black-whale-cutaway.png', '/world-map-reference.png', '/implementation-notes.md', '/release-manifest.json'];
  for (const publicPath of publicRoots) {
    const relativePath = `./${publicPath.slice(1)}`;
    javascript = javascript
      .replaceAll(`"${publicPath}`, `"${relativePath}`)
      .replaceAll(`'${publicPath}`, `'${relativePath}`)
      .replaceAll(`\`${publicPath}`, `\`${relativePath}`);
    stylesheet = stylesheet.replaceAll(`url(${publicPath}`, `url(${relativePath}`);
  }

  const inlineScript = `<script>window.__HXH_STANDALONE_BUILD__=true;</script>\n    <script type="module">${escapeClosingTag(javascript, 'script')}</script>`;
  const inlineStyle = `<style>${escapeClosingTag(stylesheet, 'style')}</style>`;
  html = html
    // Function replacements are required here: compiled JavaScript contains
    // `$&` sequences that String.replace would otherwise expand back into the
    // removed chunk tag, producing a subtly corrupted direct-open file.
    .replace(scriptTag[0], () => inlineScript)
    .replace(styleTag[0], () => inlineStyle)
    .replace('<title>Hunter × Hunter — Archive</title>', '<title>Hunter × Hunter — Archive · Standalone</title>')
    .replace('</head>', '    <meta name="hxh-edition" content="standalone-direct-open" />\n  </head>');
  return html;
};

const stageStandalone = async () => {
  await rm(standaloneStage, { recursive: true, force: true });
  await mkdir(standaloneStage, { recursive: true });
  await writeFile(path.join(standaloneStage, 'Open-HxH-Archive.html'), await makeStandaloneHtml());
  await cp(path.join(publicDir, 'media'), path.join(standaloneStage, 'media'), { recursive: true });
  for (const file of ['black-whale-cutaway.png', 'world-map-reference.png', 'implementation-notes.md', RELEASE_MANIFEST_PATH.slice(1)]) {
    await cp(path.join(publicDir, file), path.join(standaloneStage, file));
  }
  const instructions = `HUNTER × HUNTER ARCHIVE — STANDALONE EDITION\n\n1. Unzip the complete folder.\n2. Keep the media folder beside Open-HxH-Archive.html.\n3. Double-click Open-HxH-Archive.html.\n\nNo command file, local server, Node, Vite, or ChatGPT Sites connection is required.\nThis edition never loads the original hosted website. Local portraits and the Black Whale cutaway are included. External Hunterpedia links and any remote Hunterpedia images still require internet access.\n\nPersonal notes, bookmarks, spoiler settings, and progress are not bundled. New study data is stored only in the browser profile used to open this copy.\n`;
  await writeFile(path.join(standaloneStage, 'README-FIRST.txt'), instructions);
  return (await walk(standaloneStage, '.')).map((file) => file.replace(/^\.\//, '')).sort();
};

await mkdir(publicDir, { recursive: true });
const releaseManifest = {
  name: 'Hunter × Hunter Archive',
  release: CURRENT_RELEASE_VERSION,
  released: CURRENT_RELEASE_DATE,
  chapterBoundary: releaseStats.chapterBoundary,
  sourcePolicy: 'Hunterpedia/Fandom only',
  readerFacingRoutes: releaseStats.routes,
  automatedReleaseGates: releaseGates.length,
  packages: {
    sitesReady: {
      file: path.basename(sitesOutput),
      purpose: 'Maintain, edit, and redeploy the existing ChatGPT Sites project',
      includesHostingIdentity: true,
      excludes: ['node_modules', 'dist', '.git', 'credentials', 'browser-local study data'],
    },
    standalone: {
      file: path.basename(standaloneOutput),
      purpose: 'Unzip and directly open the website without ChatGPT Sites, Node, or Vite',
      startFile: 'Open-HxH-Archive.html',
      includesHostingIdentity: false,
      excludes: ['source toolchain', 'credentials', 'repository history', 'browser-local study data'],
    },
  },
};
await writeFile(manifestPath, `${JSON.stringify(releaseManifest, null, 2)}\n`);

try {
  const standaloneFiles = await stageStandalone();
  const standaloneArchive = await buildZip(standaloneStage, standaloneFiles);
  await writeFile(standaloneOutput, standaloneArchive);

  const sourceFiles = (await Promise.all(sourceRoots.map((entry) => walk(root, entry, isDownloadArchive)))).flat().sort();
  const sitesArchive = await buildZip(root, sourceFiles);
  await writeFile(sitesOutput, sitesArchive);

  console.log(`Sites-ready package created: ${sourceFiles.length} files, ${sitesArchive.length} bytes.`);
  console.log(`Standalone package created: ${standaloneFiles.length} files, ${standaloneArchive.length} bytes.`);
} finally {
  await rm(standaloneBuild, { recursive: true, force: true });
  await rm(standaloneStage, { recursive: true, force: true });
}
