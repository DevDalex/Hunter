import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { formatPerformanceBudget, performanceBudgets as budgets } from '../src/data/performanceBudgets.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const manifestPath = path.join(dist, '.vite/manifest.json');
const assert = (condition, message) => { if (!condition) throw new Error(`Performance audit failed: ${message}`); };

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
const dynamicBoundaryGroups = Object.freeze({
  directRouteAndSearchUi: [
    'src/components/ArchiveSearch.jsx',
    'src/components/SeriesWorkspace.jsx',
    'src/components/TimelineWorkspace.jsx',
    'src/components/succession/SuccessionArchiveEntry.jsx',
    'src/components/FamilyTree.jsx',
    'src/components/SuccessionRoster.jsx',
    'src/components/SuccessionTimeline.jsx',
    'src/components/SuccessionChapterReader.jsx',
    'src/components/SuccessionConnectionBoard.jsx',
    'src/components/BlackWhaleGuide.jsx',
    'src/components/SuccessionDossier.jsx',
    'src/components/EntityEncyclopedia.jsx',
    'src/components/NenEncyclopedia.jsx',
    'src/components/HisokaChrolloDossier.jsx',
    'src/components/WorldAtlas.jsx',
    'src/components/OrganizationWorkspace.jsx',
    'src/components/ConflictArchive.jsx',
  ],
  storyExperiences: [
    'src/components/StoryHub.jsx',
    'src/components/ArcPage.jsx',
    'src/components/VolumeZeroPage.jsx',
    'src/components/HunterExamPage.jsx',
    'src/components/GreedIslandPage.jsx',
    'src/components/ChimeraAntPage.jsx',
  ],
  greedIslandModules: [
    'src/components/greed-island/GreedIslandHub.jsx',
    'src/components/greed-island/EtaTutorial.jsx',
    'src/components/greed-island/GreedIslandBinder.jsx',
    'src/components/greed-island/SpecifiedCardArchive.jsx',
    'src/components/greed-island/GreedIslandCardLibraries.jsx',
    'src/components/greed-island/GreedIslandSystems.jsx',
    'src/components/greed-island/GreedIslandTacticalRecords.jsx',
    'src/components/greed-island/GreedIslandCompletionArchive.jsx',
  ],
  searchDataShards: [
    'src/data/archiveSearch.series.js',
    'src/data/archiveSearch.succession.js',
    'src/data/archiveSearch.reference.js',
  ],
});
const directBoundaryKeys = dynamicBoundaryGroups.directRouteAndSearchUi;
const storyDetailBoundaryKeys = dynamicBoundaryGroups.storyExperiences;
const greedIslandModuleBoundaryKeys = dynamicBoundaryGroups.greedIslandModules;
const searchShardKeys = dynamicBoundaryGroups.searchDataShards;
const expectedDynamicBoundaryKeys = Object.values(dynamicBoundaryGroups).flat();
const expectedDynamicBoundarySet = new Set(expectedDynamicBoundaryKeys);
const actualDynamicBoundaryKeys = dynamicEntries.map(([key]) => key);
const missingDynamicBoundaryKeys = expectedDynamicBoundaryKeys.filter((key) => !manifest[key]?.isDynamicEntry);
const unexpectedDynamicBoundaryKeys = actualDynamicBoundaryKeys.filter((key) => !expectedDynamicBoundarySet.has(key));
const javascriptFiles = Object.values(manifest).map((record) => record.file).filter((file) => file?.endsWith('.js'));
const javascriptSizes = await Promise.all(javascriptFiles.map(async (file) => ({ file, bytes: await sizeOf(file) })));
const largestJavascript = javascriptSizes.sort((a, b) => b.bytes - a.bytes)[0];

assert(entryJs <= budgets.entryJs, `startup application chunk is ${entryJs} bytes; budget is ${formatPerformanceBudget(budgets.entryJs)}`);
assert(startupJs <= budgets.startupJs, `startup JavaScript closure is ${startupJs} bytes; budget is ${formatPerformanceBudget(budgets.startupJs)}`);
assert(startupCss <= budgets.startupCss, `startup stylesheet is ${startupCss} bytes; budget is ${formatPerformanceBudget(budgets.startupCss)}`);
assert(largestJavascript.bytes <= budgets.javascriptChunk, `${largestJavascript.file} is ${largestJavascript.bytes} bytes; per-chunk budget is ${formatPerformanceBudget(budgets.javascriptChunk)}`);
assert(expectedDynamicBoundarySet.size === expectedDynamicBoundaryKeys.length, 'the registered dynamic-boundary inventory contains duplicate keys');
assert(missingDynamicBoundaryKeys.length === 0, `registered dynamic boundaries are missing from the production manifest: ${missingDynamicBoundaryKeys.join(', ')}`);
assert(unexpectedDynamicBoundaryKeys.length === 0, `unregistered dynamic entries were found; register intentional boundaries or remove accidental imports: ${unexpectedDynamicBoundaryKeys.join(', ')}`);
assert(directBoundaryKeys.every((key) => manifest[key]?.isDynamicEntry), `all ${directBoundaryKeys.length} route/search UI boundaries must remain dynamic entries`);
assert(storyDetailBoundaryKeys.every((key) => manifest[key]?.isDynamicEntry), 'the Story directory, standard arc renderer, Volume 0, Hunter Exam, complete Greed Island shell, and Chimera Ant archive must remain separate on-demand chunks');
assert(greedIslandModuleBoundaryKeys.every((key) => manifest[key]?.isDynamicEntry), `all ${greedIslandModuleBoundaryKeys.length} Greed Island modules must remain separate on-demand chunks`);
assert(searchShardKeys.every((key) => manifest[key]?.isDynamicEntry), 'the story, Succession, and reference search indexes must remain separate dynamic entries');

const homeHighlights = await readFile(path.join(root, 'src/data/homeHighlights.js'), 'utf8');
const app = await readFile(path.join(root, 'src/App.jsx'), 'utf8');
const routePreload = await readFile(path.join(root, 'src/lib/routePreload.js'), 'utf8');
const archiveSearch = await readFile(path.join(root, 'src/data/archiveSearch.js'), 'utf8');
const archiveSearchComponent = await readFile(path.join(root, 'src/components/ArchiveSearch.jsx'), 'utf8');
const safeImage = await readFile(path.join(root, 'src/components/SafeImage.jsx'), 'utf8');
const siteHome = await readFile(path.join(root, 'src/components/SiteHome.jsx'), 'utf8');
const seriesWorkspace = await readFile(path.join(root, 'src/components/SeriesWorkspace.jsx'), 'utf8');
const greedIslandPage = await readFile(path.join(root, 'src/components/GreedIslandPage.jsx'), 'utf8');
const packageJson = await readFile(path.join(root, 'package.json'), 'utf8');

assert(!/from ['"]\.\/characters['"]/.test(homeHighlights), 'the homepage must not import the complete character registry');
assert(!/priorityMedia\.generated/.test(homeHighlights), 'the homepage must not import the complete priority-media registry');
assert(!/from ['"].*\/(chapters|encyclopedia|successionDossier|successionRoster|seriesResearch)['"]/.test(app), 'App.jsx imports a heavy research dataset');
assert((routePreload.match(/\(\) => import\(/g) || []).length === directBoundaryKeys.length, `the route loader registry must own ${directBoundaryKeys.length} direct dynamic module boundaries`);
assert(
  seriesWorkspace.includes("lazy(() => import('./StoryHub'))")
    && seriesWorkspace.includes("lazy(() => import('./ArcPage'))")
    && seriesWorkspace.includes("lazy(() => import('./VolumeZeroPage'))")
    && seriesWorkspace.includes("lazy(() => import('./HunterExamPage'))")
    && seriesWorkspace.includes("lazy(() => import('./GreedIslandPage'))")
    && seriesWorkspace.includes("lazy(() => import('./ChimeraAntPage'))"),
  'SeriesWorkspace must keep the Story directory, standard arc renderer, Volume 0, Hunter Exam, complete Greed Island shell, and Chimera Ant archive on demand',
);
assert((greedIslandPage.match(/lazy\(\(\) => import\('\.\/greed-island\//g) || []).length === greedIslandModuleBoundaryKeys.length, `GreedIslandPage must own ${greedIslandModuleBoundaryKeys.length} lazy module boundaries`);
assert((archiveSearch.match(/import\('\.\/archiveSearch\.(?:series|succession|reference)'\)/g) || []).length === searchShardKeys.length, `the archive search loader must own ${searchShardKeys.length} domain data shards`);
assert(!/from ['"]\.\.\/data\/(?:chapters|encyclopedia|successionDossier|successionRoster|worldMap)['"]/.test(archiveSearchComponent), 'ArchiveSearch.jsx statically imports a heavy archive dataset');
assert(archiveSearchComponent.includes('useDeferredValue') && archiveSearchComponent.includes('normalizeQuery'), 'archive search must defer and normalize interactive queries');
assert(safeImage.includes("priority || (eager ? 'high' : 'auto')"), 'SafeImage must support explicit fetch priority');
assert(siteHome.includes("index === 0 ? 'high' : 'auto'"), 'only the first homepage portrait must receive high fetch priority');
assert(!/vite-plugin-pwa|workbox|serviceWorker\.register|manifest\.webmanifest/.test(`${packageJson}\n${app}\n${routePreload}`), 'PWA or service-worker behavior is outside the website scope');

const portraitsDir = path.join(root, 'public/media/portraits');
const portraitFiles = await readdir(portraitsDir);
const portraitSizes = await Promise.all(portraitFiles.map(async (file) => ({ file, bytes: (await stat(path.join(portraitsDir, file))).size })));
const portraitBytes = portraitSizes.reduce((total, record) => total + record.bytes, 0);
const largestPortrait = portraitSizes.sort((a, b) => b.bytes - a.bytes)[0];
assert(largestPortrait.bytes <= budgets.portrait, `${largestPortrait.file} is ${largestPortrait.bytes}; local portrait ceiling is ${formatPerformanceBudget(budgets.portrait)}`);
assert(portraitBytes <= budgets.portraitLibrary, `local portrait library is ${portraitBytes} bytes; budget is ${formatPerformanceBudget(budgets.portraitLibrary)}`);

console.log(`Performance audit passed: entry JS ${entryJs}/${formatPerformanceBudget(budgets.entryJs)} bytes; startup JS ${startupJs}/${formatPerformanceBudget(budgets.startupJs)} bytes; startup CSS ${startupCss}/${formatPerformanceBudget(budgets.startupCss)} bytes; ${directBoundaryKeys.length} route/search UI chunks, ${storyDetailBoundaryKeys.length} Story experience chunks, ${greedIslandModuleBoundaryKeys.length} Greed Island module chunks, ${searchShardKeys.length} search shards; largest JS chunk ${largestJavascript.file} at ${largestJavascript.bytes}/${formatPerformanceBudget(budgets.javascriptChunk)} bytes; local portraits ${portraitBytes} bytes.`);