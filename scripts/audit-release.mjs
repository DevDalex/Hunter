import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  dossierTabRoutes,
  referenceAliases,
  referencePages,
  referencePrimary,
  routeManifest,
  routeManifestStats,
  successionDossierTabs,
  successionPages,
  successionPrimary,
  viewIds,
} from '../src/data/routeManifest.js';
import {
  CURRENT_RELEASE_VERSION,
  PHASE_6G_VERSION,
  PHASE_8A_VERSION,
  RELEASE_MANIFEST_PATH,
  SITES_SOURCE_PACKAGE_PATH,
  STANDALONE_PACKAGE_PATH,
  phaseSixSequence,
  releaseGates,
  releaseStats,
} from '../src/data/releaseReadiness.js';

const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(`Release audit failed: ${message}`); };
const unique = (items) => new Set(items).size === items.length;

const walk = async (relative) => {
  const absolute = path.join(root, relative);
  const record = await stat(absolute);
  if (record.isFile()) return [relative];
  const entries = await readdir(absolute);
  return (await Promise.all(entries.map((entry) => walk(path.join(relative, entry))))).flat();
};

assert(PHASE_6G_VERSION.includes('Phase 6G'), 'release label must identify Phase 6G');
assert(PHASE_8A_VERSION.includes('Phase 8A'), 'release label must identify Phase 8A');
assert(CURRENT_RELEASE_VERSION === PHASE_8A_VERSION, 'current release label must identify Phase 8A');
assert(phaseSixSequence.length === 7 && phaseSixSequence.at(-1)?.[0] === '6G', 'Phase 6 must contain the recorded 6A–6G sequence');
assert(viewIds.length === 4 && unique(viewIds), 'top-level views must be unique');
assert(routeManifest.length === 26 && routeManifestStats.screens === routeManifest.length, 'reader-facing route inventory must contain 26 purposeful screens');
assert(unique(routeManifest.map((route) => `${route.view}/${route.target}`)), 'reader-facing route destinations must be unique');
assert(successionPages.length === 8 && referencePages.length === 6, 'workspace route totals must remain eight Succession and six Reference screens');
assert(!routeManifest.some((route) => /source/i.test(`${route.target} ${route.label}`)), 'the removed Sources section returned to the public route manifest');
assert(successionPrimary.every((id) => successionPages.some((page) => page.id === id)), 'Succession primary navigation contains an unknown page');
assert(referencePrimary.every((id) => referencePages.some((page) => page.id === id)), 'Reference primary navigation contains an unknown page');
assert(Object.values(referenceAliases).every((alias) => referencePages.some((page) => page.id === alias.target)), 'Reference alias resolves to an unknown page');
assert(Object.keys(successionDossierTabs).every((id) => successionPages.some((page) => page.id === id)), 'Dossier tab route is missing from the Succession manifest');
assert(Object.values(dossierTabRoutes).every((id) => successionPages.some((page) => page.id === id)), 'Dossier return route is missing from the Succession manifest');
assert(releaseGates.length === 10 && unique(releaseGates.map((gate) => gate.id)), 'final release must retain ten unique gates');
assert(releaseGates.some((gate) => gate.id === 'performance'), 'the final release must retain the loading-performance gate');
assert(releaseStats.routes === routeManifest.length && releaseStats.chapterBoundary === 413, 'release statistics are stale');
const contentIntegritySource = await readFile(path.join(root, 'src/data/contentIntegrity.js'), 'utf8');
const contentContractCount = [...contentIntegritySource.matchAll(/\bid:\s*'[^']+'/g)].length;
assert(contentContractCount === 38 && contentIntegritySource.includes("id: 'phase6c-interactive-map'") && contentIntegritySource.includes("id: 'phase6g-release-contract'") && contentIntegritySource.includes("id: 'hunter-exam-chapter-depth'"), 'all 38 content contracts, including the interactive-map, Hunter Exam depth, and Phase 6G gates, must remain registered');
const referenceEntitiesSource = await readFile(path.join(root, 'src/data/referenceEntities.js'), 'utf8');
assert(referenceEntitiesSource.includes('Phase 7G final site-wide release audit'), 'the public change log must record the Phase 7G checkpoint');

const sourceFiles = (await walk('src')).filter((file) => /\.(js|jsx)$/.test(file));
const sourceText = await Promise.all(sourceFiles.map(async (file) => [file, await readFile(path.join(root, file), 'utf8')]));
const directStorage = sourceText.filter(([file, text]) => file !== 'src/lib/browserStorage.js' && /\blocalStorage\b|\bsessionStorage\b/.test(text));
assert(!directStorage.length, `browser storage bypasses the safe adapter in ${directStorage.map(([file]) => file).join(', ')}`);

const jsxText = sourceText.filter(([file]) => file.endsWith('.jsx')).map(([, text]) => text).join('\n');
const blankAnchors = [...jsxText.matchAll(/<a\b[\s\S]*?>/g)].map((match) => match[0]).filter((tag) => /target=["']_blank["']/.test(tag));
assert(blankAnchors.every((tag) => /rel=["'][^"']*(noreferrer|noopener)[^"']*["']/.test(tag)), 'every new-tab link must declare noreferrer or noopener');
const imageTags = [...jsxText.matchAll(/<img\b[\s\S]*?>/g)].map((match) => match[0]);
assert(imageTags.every((tag) => /\balt=/.test(tag)), 'every direct image element must provide alt text');
assert(!/image placeholder|placeholder image/i.test(jsxText), 'reader-facing image placeholder copy is forbidden');

const css = await readFile(path.join(root, 'src/styles.css'), 'utf8');
assert(css.includes('prefers-reduced-motion: reduce'), 'reduced-motion styles are required');
assert(/@media\s*\(max-width:\s*640px\)/.test(css), 'small-screen layout boundary is required');
const main = await readFile(path.join(root, 'src/main.jsx'), 'utf8');
assert(main.includes('<SiteErrorBoundary>'), 'the application root must retain runtime recovery');

const staticPaths = [...sourceText.flatMap(([, text]) => [...text.matchAll(/["'](\/[^"']+\.(?:png|jpe?g|webp|gif))["']/gi)].map((match) => match[1]))];
await Promise.all(staticPaths.map((url) => access(path.join(root, 'public', url.slice(1)))));

const packageFile = path.join(root, 'public', SITES_SOURCE_PACKAGE_PATH.slice(1));
const standaloneFile = path.join(root, 'public', STANDALONE_PACKAGE_PATH.slice(1));
const manifestFile = path.join(root, 'public', RELEASE_MANIFEST_PATH.slice(1));
await access(packageFile);
await access(standaloneFile);
await access(manifestFile);
const packageStats = await stat(packageFile);
const standaloneStats = await stat(standaloneFile);
assert(packageStats.size > 100_000, 'Sites-ready source package is unexpectedly small');
assert(standaloneStats.size > 100_000, 'standalone website package is unexpectedly small');
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
assert(manifest.release === CURRENT_RELEASE_VERSION && manifest.readerFacingRoutes === routeManifest.length, 'public release manifest is stale');
assert(manifest.packages?.sitesReady?.file === path.basename(packageFile), 'manifest Sites-ready package filename is stale');
assert(manifest.packages?.standalone?.file === path.basename(standaloneFile), 'manifest standalone package filename is stale');

const readZipEntries = async (file, label) => {
  const archiveBytes = await readFile(file);
  const endOffset = archiveBytes.length - 22;
  assert(archiveBytes.readUInt32LE(endOffset) === 0x06054b50, `${label} has no valid ZIP end record`);
  const archiveEntryCount = archiveBytes.readUInt16LE(endOffset + 10);
  let centralOffset = archiveBytes.readUInt32LE(endOffset + 16);
  const entries = [];
  const records = new Map();
  for (let index = 0; index < archiveEntryCount; index += 1) {
    assert(archiveBytes.readUInt32LE(centralOffset) === 0x02014b50, `${label} has an invalid central directory`);
    const nameLength = archiveBytes.readUInt16LE(centralOffset + 28);
    const extraLength = archiveBytes.readUInt16LE(centralOffset + 30);
    const commentLength = archiveBytes.readUInt16LE(centralOffset + 32);
    const name = archiveBytes.subarray(centralOffset + 46, centralOffset + 46 + nameLength).toString('utf8');
    const method = archiveBytes.readUInt16LE(centralOffset + 10);
    const bytes = archiveBytes.readUInt32LE(centralOffset + 24);
    const localOffset = archiveBytes.readUInt32LE(centralOffset + 42);
    entries.push(name);
    records.set(name, { method, bytes, localOffset });
    centralOffset += 46 + nameLength + extraLength + commentLength;
  }
  return {
    entries,
    read(name) {
      const record = records.get(name);
      assert(record, `${label} is missing ${name}`);
      assert(record.method === 0, `${label} ${name} must use the deterministic stored format`);
      assert(archiveBytes.readUInt32LE(record.localOffset) === 0x04034b50, `${label} ${name} has an invalid local record`);
      const localNameLength = archiveBytes.readUInt16LE(record.localOffset + 26);
      const localExtraLength = archiveBytes.readUInt16LE(record.localOffset + 28);
      const start = record.localOffset + 30 + localNameLength + localExtraLength;
      return archiveBytes.subarray(start, start + record.bytes);
    },
  };
};

const sitesZip = await readZipEntries(packageFile, 'Sites-ready source package');
const archiveEntries = sitesZip.entries;
for (const required of [
  'src/App.jsx',
  'src/data/routeManifest.js',
  'src/lib/browserStorage.js',
  'scripts/run-build-preflight.mjs',
  'architecture/storyArchitecture.mjs',
  'docs/STORY-ARCHITECTURE.md',
  'docs/FINAL-POLISH.md',
  'docs/ARCHIVE-GOVERNANCE.md',
  'server/index.js',
  '.openai/hosting.json',
  'README.md',
  'package.json',
  'vite.standalone.config.js',
]) {
  assert(archiveEntries.includes(required), `Sites-ready source package is missing ${required}`);
}
for (const forbidden of ['node_modules/', 'dist/', '.git/']) {
  assert(!archiveEntries.some((entry) => entry.startsWith(forbidden)), `Sites-ready source package contains forbidden path ${forbidden}`);
}
assert(!archiveEntries.some((entry) => /hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(entry)), 'Sites-ready source package must not contain another release package');

const standaloneZip = await readZipEntries(standaloneFile, 'standalone website package');
const standaloneEntries = standaloneZip.entries;
for (const required of ['Open-HxH-Archive.html', 'README-FIRST.txt', 'black-whale-cutaway.png', 'world-map-reference.png', 'media/portraits/gon-freecss.webp']) {
  assert(standaloneEntries.includes(required), `standalone website package is missing ${required}`);
}
for (const forbidden of ['src/', 'scripts/', 'server/', '.openai/', 'node_modules/', 'dist/']) {
  assert(!standaloneEntries.some((entry) => entry.startsWith(forbidden)), `standalone website package contains forbidden path ${forbidden}`);
}
const standaloneHtml = standaloneZip.read('Open-HxH-Archive.html').toString('utf8');
assert(standaloneHtml.includes('window.__HXH_STANDALONE_BUILD__=true'), 'standalone HTML does not declare its independent edition');
assert(standaloneHtml.includes('<style>') && standaloneHtml.includes('<script type="module">'), 'standalone HTML does not inline its application and stylesheet');
assert(!/src="\.\/assets\/|href="\.\/assets\//i.test(standaloneHtml), 'standalone HTML still depends on external build chunks');
assert(standaloneHtml.includes('./media/portraits/') && standaloneHtml.includes('./black-whale-cutaway.png') && standaloneHtml.includes('./world-map-reference.png'), 'standalone HTML does not use local relative media paths');
assert(standaloneHtml.includes('Hunter × Hunter') && standaloneHtml.includes('Pre-Succession') && standaloneHtml.includes('Succession') && standaloneHtml.includes('You are viewing the standalone edition'), 'standalone HTML is missing the connected archive home and two story entrances');
assert(!standaloneHtml.includes('hxh-archive-412.oa7oa71.chatgpt.site'), 'standalone HTML calls the original hosted website');

console.log(`Release audit passed: ${routeManifest.length} routes; ${contentContractCount} content contracts; ${releaseGates.length} final gates; ${sourceFiles.length} source modules; ${packageStats.size} Sites-ready bytes; ${standaloneStats.size} standalone bytes.`);
