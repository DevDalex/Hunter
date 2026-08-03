import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  formatPerformanceBudget,
  performanceBudgets as budgets,
} from '../src/data/performanceBudgets.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const manifestPath = path.join(dist, '.vite/manifest.json');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Performance audit failed: ${message}`);
};

await access(manifestPath);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entry = manifest['index.html'];
assert(entry?.isEntry, 'the production manifest has no index.html entry');

const imported = new Set();
const collectImports = (key) => {
  if (!key || imported.has(key)) return;
  imported.add(key);
  for (const dependency of manifest[key]?.imports || []) collectImports(dependency);
};
collectImports('index.html');

const sizeOf = async (file) => (await stat(path.join(dist, file))).size;
const startupFiles = [...imported].map((key) => manifest[key]?.file).filter(Boolean);
const startupJs = (await Promise.all(startupFiles.map(sizeOf))).reduce((total, bytes) => total + bytes, 0);
const entryJs = await sizeOf(entry.file);
const startupCss = (await Promise.all((entry.css || []).map(sizeOf))).reduce((total, bytes) => total + bytes, 0);
const dynamicEntries = Object.entries(manifest).filter(([, record]) => record.isDynamicEntry);

const [app, routePreload, safeImage, packageText] = await Promise.all([
  readFile(path.join(root, 'src/App.jsx'), 'utf8'),
  readFile(path.join(root, 'src/lib/routePreload.js'), 'utf8'),
  readFile(path.join(root, 'src/components/SafeImage.jsx'), 'utf8'),
  readFile(path.join(root, 'package.json'), 'utf8'),
]);

const loaderImports = [...routePreload.matchAll(/import\(['"]\.\.\/components\/([^'"]+)['"]\)/g)]
  .map((match) => `src/components/${match[1]}${path.extname(match[1]) ? '' : '.jsx'}`);
const routeLoaderKeys = [...new Set(loaderImports)];

const expectedRouteLoaderKeys = [
  'src/components/succession/SuccessionArchiveEntry.jsx',
  'src/components/FamilyTree.jsx',
  'src/components/SuccessionRoster.jsx',
  'src/components/SuccessionTimeline.jsx',
  'src/components/SuccessionChapterReader.jsx',
  'src/components/SuccessionConnectionBoard.jsx',
  'src/components/BlackWhaleGuide.jsx',
  'src/components/SuccessionDossier.jsx',
  'src/components/NenEncyclopedia.jsx',
  'src/components/WorldAtlas.jsx',
];

const successionControllerBoundaryKeys = [
  'src/components/succession/SuccessionArchiveApp.jsx',
  'src/components/succession/SuccessionArchiveReaderRoute.jsx',
  'src/components/succession/SuccessionArchiveLightRoute.jsx',
  'src/components/succession/SuccessionArchiveWorkspaces.jsx',
  'src/components/succession/SuccessionWorkspaceRefinementDeck.jsx',
];

const retiredBoundaryKeys = [
  'src/components/ArchiveSearch.jsx',
  'src/components/SeriesWorkspace.jsx',
  'src/components/SiteHome.jsx',
  'src/components/StoryHub.jsx',
  'src/components/ArcPage.jsx',
  'src/components/VolumeZeroPage.jsx',
  'src/components/HunterExamPage.jsx',
  'src/components/GreedIslandPage.jsx',
  'src/components/TimelineWorkspace.jsx',
  'src/components/EntityEncyclopedia.jsx',
  'src/components/OrganizationWorkspace.jsx',
  'src/components/ConflictArchive.jsx',
  'src/components/HisokaChrolloDossier.jsx',
  'src/components/greed-island/GreedIslandHub.jsx',
  'src/components/greed-island/EtaTutorial.jsx',
  'src/components/greed-island/GreedIslandBinder.jsx',
  'src/components/greed-island/SpecifiedCardArchive.jsx',
  'src/components/greed-island/GreedIslandCardLibraries.jsx',
  'src/components/greed-island/GreedIslandSystems.jsx',
  'src/components/greed-island/GreedIslandTacticalRecords.jsx',
  'src/components/greed-island/GreedIslandCompletionArchive.jsx',
  'src/data/archiveSearch.series.js',
  'src/data/archiveSearch.reference.js',
];

const javascriptFiles = Object.values(manifest)
  .map((record) => record.file)
  .filter((file) => file?.endsWith('.js'));
const javascriptSizes = await Promise.all(
  javascriptFiles.map(async (file) => ({ file, bytes: await sizeOf(file) })),
);
const largestJavascript = javascriptSizes.sort((a, b) => b.bytes - a.bytes)[0];

assert(entryJs <= budgets.entryJs, `startup application chunk is ${entryJs} bytes; budget is ${formatPerformanceBudget(budgets.entryJs)}`);
assert(startupJs <= budgets.startupJs, `startup JavaScript closure is ${startupJs} bytes; budget is ${formatPerformanceBudget(budgets.startupJs)}`);
assert(startupCss <= budgets.startupCss, `startup stylesheet is ${startupCss} bytes; budget is ${formatPerformanceBudget(budgets.startupCss)}`);
assert(largestJavascript.bytes <= budgets.javascriptChunk, `${largestJavascript.file} is ${largestJavascript.bytes} bytes; per-chunk budget is ${formatPerformanceBudget(budgets.javascriptChunk)}`);

assert(routeLoaderKeys.length === expectedRouteLoaderKeys.length, `the focused route loader map must expose ${expectedRouteLoaderKeys.length} boundaries, found ${routeLoaderKeys.length}`);
assert(expectedRouteLoaderKeys.every((key) => routeLoaderKeys.includes(key)), 'the route loader map must contain Succession plus the retained general Nen and World boundaries');
assert(routeLoaderKeys.every((key) => manifest[key]?.isDynamicEntry), 'every retained route loader must remain an on-demand production entry');
assert(successionControllerBoundaryKeys.every((key) => manifest[key]?.isDynamicEntry), 'the Succession controller, Reader, light route, workspaces, and refinement deck must remain separate on-demand chunks');
assert(retiredBoundaryKeys.every((key) => !manifest[key]), 'a retired Home, Story, global reference, fight, Greed Island, or search boundary returned to the production manifest');
assert(dynamicEntries.length >= routeLoaderKeys.length + successionControllerBoundaryKeys.length, `the production manifest exposes only ${dynamicEntries.length} dynamic entries for ${routeLoaderKeys.length + successionControllerBoundaryKeys.length} required focused boundaries`);

for (const retiredComponent of [
  'SiteHome',
  'SeriesWorkspace',
  'ArchiveSearch',
  'EntityEncyclopedia',
  'OrganizationWorkspace',
  'ConflictArchive',
  'HisokaChrolloDossier',
]) assert(!app.includes(retiredComponent), `App.jsx still mounts retired ${retiredComponent}`);
assert(app.includes('SuccessionArchiveApp'), 'App.jsx must retain the Succession application boundary');
assert(app.includes('NenEncyclopedia'), 'App.jsx must retain the general Nen Encyclopedia boundary');
assert(app.includes('WorldAtlas'), 'App.jsx must retain the general World Atlas boundary');
assert(!/from ['"].*\/(chapters|encyclopedia|successionDossier|successionRoster|seriesResearch)['"]/.test(app), 'App.jsx imports a heavy research dataset directly');
assert(safeImage.includes("priority || (eager ? 'high' : 'auto')"), 'SafeImage must support explicit fetch priority');
assert(!/vite-plugin-pwa|workbox|serviceWorker\.register|manifest\.webmanifest/.test(`${packageText}\n${app}\n${routePreload}`), 'PWA or service-worker behavior is outside the website scope');

const portraitsDir = path.join(root, 'public/media/portraits');
const portraitFiles = await readdir(portraitsDir);
const portraitSizes = await Promise.all(
  portraitFiles.map(async (file) => ({ file, bytes: (await stat(path.join(portraitsDir, file))).size })),
);
const portraitBytes = portraitSizes.reduce((total, record) => total + record.bytes, 0);
const largestPortrait = portraitSizes.sort((a, b) => b.bytes - a.bytes)[0];
assert(largestPortrait.bytes <= budgets.portrait, `${largestPortrait.file} is ${largestPortrait.bytes}; local portrait ceiling is ${formatPerformanceBudget(budgets.portrait)}`);
assert(portraitBytes <= budgets.portraitLibrary, `local portrait library is ${portraitBytes} bytes; budget is ${formatPerformanceBudget(budgets.portraitLibrary)}`);

console.log(`Performance audit passed: entry JS ${entryJs}/${formatPerformanceBudget(budgets.entryJs)} bytes; startup JS ${startupJs}/${formatPerformanceBudget(budgets.startupJs)} bytes; startup CSS ${startupCss}/${formatPerformanceBudget(budgets.startupCss)} bytes; ${routeLoaderKeys.length} focused route loaders; ${successionControllerBoundaryKeys.length} Succession controller boundaries; ${dynamicEntries.length} total dynamic entries; largest JS chunk ${largestJavascript.file} at ${largestJavascript.bytes}/${formatPerformanceBudget(budgets.javascriptChunk)} bytes; local portraits ${portraitBytes} bytes.`);
