import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { performanceBudgets, formatPerformanceBudget } from '../src/data/performanceBudgets.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Performance audit failed: ${message}`);
};

const [manifestText, app, routePreload, safeImage] = await Promise.all([
  read('dist/client/.vite/manifest.json'),
  read('src/App.jsx'),
  read('src/lib/routePreload.js'),
  read('src/components/SafeImage.jsx'),
]);

const manifest = JSON.parse(manifestText);
const budgets = performanceBudgets;
const manifestEntries = Object.entries(manifest);
const assets = manifestEntries.map(([, entry]) => entry);
const fileSize = async (file) => (await stat(path.join(root, 'dist/client', file))).size;
const javascriptAssets = manifestEntries.filter(([, entry]) => entry.file?.endsWith('.js'));
const javascriptSizes = await Promise.all(javascriptAssets.map(async ([key, entry]) => ({
  key,
  file: entry.file,
  bytes: await fileSize(entry.file),
  entry,
})));
const entryRecord = javascriptSizes.find((record) => record.entry.isEntry);
assert(entryRecord, 'the production manifest must expose a startup entry');

// Only static imports reachable from the startup entry belong to startup cost.
// Dynamic imports and their CSS remain route-level costs and must not be summed here.
const collectStaticReachableKeys = (startKey) => {
  const reachable = new Set();
  const visit = (key) => {
    if (!key || reachable.has(key)) return;
    const entry = manifest[key];
    if (!entry) return;
    reachable.add(key);
    for (const importedKey of entry.imports || []) visit(importedKey);
  };
  visit(startKey);
  return reachable;
};

const startupKeys = collectStaticReachableKeys(entryRecord.key);
const startupRecords = javascriptSizes.filter((record) => startupKeys.has(record.key));
const startupCssFiles = [...new Set([...startupKeys].flatMap((key) => manifest[key]?.css || []))];
const startupCssRecords = await Promise.all(startupCssFiles.map(async (file) => ({ file, bytes: await fileSize(file) })));
const entryJs = entryRecord.bytes;
const startupJs = startupRecords.reduce((total, record) => total + record.bytes, 0);
const startupCss = startupCssRecords.reduce((total, record) => total + record.bytes, 0);
const largestJavascript = javascriptSizes.slice().sort((a, b) => b.bytes - a.bytes)[0];

assert(entryJs <= budgets.entryJs, `entry JS is ${entryJs}; budget is ${formatPerformanceBudget(budgets.entryJs)}`);
assert(startupJs <= budgets.startupJs, `startup JS is ${startupJs}; budget is ${formatPerformanceBudget(budgets.startupJs)}`);
assert(startupCss <= budgets.startupCss, `startup CSS is ${startupCss}; budget is ${formatPerformanceBudget(budgets.startupCss)}`);
assert(largestJavascript.bytes <= budgets.javascriptChunk, `${largestJavascript.file} is ${largestJavascript.bytes}; chunk budget is ${formatPerformanceBudget(budgets.javascriptChunk)}`);

const routeLoaderMatch = routePreload.match(/export const routeModuleLoaders\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\);/);
assert(routeLoaderMatch, 'routeModuleLoaders must remain statically auditable');
const routeLoaderKeys = [...routeLoaderMatch[1].matchAll(/^\s*([a-zA-Z0-9]+):/gm)].map((match) => match[1]);
const expectedRouteLoaderKeys = ['successionArchive', 'nen', 'worldAtlas'];
const dynamicEntries = assets.filter((entry) => entry.isDynamicEntry);
const successionControllerBoundaryKeys = [
  'src/components/succession/SuccessionArchiveEntry.jsx',
  'src/components/succession/SuccessionArchiveReaderRoute.jsx',
  'src/components/succession/SuccessionArchiveLightRoute.jsx',
  'src/components/succession/SuccessionArchiveApp.jsx',
  'src/components/succession/SuccessionArchiveWorkspaces.jsx',
  'src/components/succession/SuccessionWorkspaceRefinementDeck.jsx',
];
const retiredBoundaryKeys = [
  'src/components/SiteHome.jsx',
  'src/components/SeriesWorkspace.jsx',
  'src/components/ArchiveSearch.jsx',
  'src/components/EntityEncyclopedia.jsx',
  'src/components/OrganizationWorkspace.jsx',
  'src/components/ConflictArchive.jsx',
  'src/components/HisokaChrolloDossier.jsx',
];

assert(routeLoaderKeys.length >= expectedRouteLoaderKeys.length, `the route loader map must expose at least ${expectedRouteLoaderKeys.length} focused boundaries, found ${routeLoaderKeys.length}`);
assert(expectedRouteLoaderKeys.every((key) => routeLoaderKeys.includes(key)), 'the route loader map must contain Succession plus the retained general Nen and World boundaries');
for (const [key, expectedName] of Object.entries({ successionArchive: 'successionarchive', nen: 'nenencyclopedia', worldAtlas: 'worldatlas' })) {
  assert(assets.some((entry) => entry.isDynamicEntry && entry.name?.toLowerCase().includes(expectedName)), `${key} must remain an on-demand production entry`);
}
assert(successionControllerBoundaryKeys.every((key) => manifest[key]?.isDynamicEntry), 'the Succession controller, Reader, light route, workspaces, and refinement deck must remain separate on-demand chunks');
assert(retiredBoundaryKeys.every((key) => !manifest[key]), 'a retired Home, Story, global reference, fight, Greed Island, or search boundary returned to the production manifest');
assert(dynamicEntries.length >= expectedRouteLoaderKeys.length + successionControllerBoundaryKeys.length, `the production manifest exposes only ${dynamicEntries.length} dynamic entries for ${expectedRouteLoaderKeys.length + successionControllerBoundaryKeys.length} required focused boundaries`);

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
assert(app.includes('SuccessionIntegratedReferences'), 'App.jsx must retain the integrated reference boundary');
assert(app.includes("integratedReferenceMode === 'nen'"), 'App.jsx must retain the general Nen Encyclopedia route mode');
assert(app.includes("integratedReferenceMode === 'world'"), 'App.jsx must retain the general World Atlas route mode');
assert(!/from ['"].*\/(chapters|encyclopedia|successionDossier|successionRoster|seriesResearch)['"]/.test(app), 'App.jsx imports a heavy research dataset directly');
assert(safeImage.includes("priority || (eager ? 'high' : 'auto')"), 'SafeImage must support explicit fetch priority');

const portraitsDir = path.join(root, 'public/media/portraits');
const portraitFiles = await readdir(portraitsDir);
const portraitSizes = await Promise.all(
  portraitFiles.map(async (file) => ({ file, bytes: (await stat(path.join(portraitsDir, file))).size })),
);
const portraitBytes = portraitSizes.reduce((total, record) => total + record.bytes, 0);
const largestPortrait = portraitSizes.sort((a, b) => b.bytes - a.bytes)[0];
assert(largestPortrait.bytes <= budgets.portrait, `${largestPortrait.file} is ${largestPortrait.bytes}; local portrait ceiling is ${formatPerformanceBudget(budgets.portrait)}`);
assert(portraitBytes <= budgets.portraitLibrary, `local portrait library is ${portraitBytes} bytes; budget is ${formatPerformanceBudget(budgets.portraitLibrary)}`);

console.log(`Performance audit passed: entry JS ${entryJs}/${formatPerformanceBudget(budgets.entryJs)} bytes; startup JS ${startupJs}/${formatPerformanceBudget(budgets.startupJs)} bytes; startup CSS ${startupCss}/${formatPerformanceBudget(budgets.startupCss)} bytes; ${expectedRouteLoaderKeys.length} focused route loaders; ${successionControllerBoundaryKeys.length} Succession controller boundaries; ${dynamicEntries.length} total dynamic entries; largest JS chunk ${largestJavascript.file} at ${largestJavascript.bytes}/${formatPerformanceBudget(budgets.javascriptChunk)} bytes; local portraits ${portraitBytes} bytes.`);