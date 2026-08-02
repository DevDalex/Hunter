import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 6 consolidation audit failed: ${message}`);
};

const [
  entrySource,
  lightRouteSource,
  releaseCss,
  phase3Css,
  phase4Css,
  phase5Css,
  dataSource,
  productReleaseSource,
  productCompatibilitySource,
  workspaceCompatibilitySource,
  manifestSource,
] = await Promise.all([
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionArchiveLightRoute.jsx'),
  read('src/components/succession/SuccessionReleaseDesktop.css'),
  read('src/components/succession/SuccessionInformationConsistencyPanel.css'),
  read('src/components/succession/SuccessionPhase4DesktopOnly.css'),
  read('src/components/succession/SuccessionWorkspaceRefinementDeck.css'),
  read('src/data/succession/successionData.js'),
  read('src/data/succession/productClosureSelectorsRelease.js'),
  read('src/data/succession/productClosureSelectorsPhase4.js'),
  read('src/data/succession/workspaceRefinementRuntime.js'),
  read('src/data/succession/releaseManifest.js'),
]);

assert(!entrySource.includes("import './SuccessionReleaseDesktop.css'"), 'the route entry must not force desktop release styles onto lightweight routes');
assert(!entrySource.includes("import './SuccessionPhase4DesktopOnly.css'"), 'the archive entry must not load the retired Phase 4 stylesheet');
assert(lightRouteSource.includes("lazy(() => import('./SuccessionWorkspaceRefinementDeck'))"), 'the lightweight route must split the desktop refinement surface');
assert(lightRouteSource.includes("window.matchMedia('(min-width: 1024px)')"), 'the lightweight route must load desktop refinements only at their presentation boundary');
assert(phase5Css.includes("@import './SuccessionReleaseDesktop.css'"), 'the refinement surface must load the consolidated release sheet with its route chunk');
assert(releaseCss.includes('.succession-information-consistency')
  && releaseCss.includes('.succession-intelligence-workbench')
  && releaseCss.includes('.succession-workspace-refinement'), 'the release sheet must own Phase 3, Phase 4, and Phase 5 surfaces');
assert(releaseCss.includes('@media (min-width: 1024px)'), 'the final desktop boundary is missing');
assert(!releaseCss.includes('@media (max-width:'), 'Phase 6 must not add tablet or mobile presentation rules');
assert(!releaseCss.includes('!important'), 'the consolidated release sheet must not introduce important overrides');
for (const [name, source] of [['Phase 3', phase3Css], ['Phase 4', phase4Css], ['Phase 5', phase5Css]]) {
  assert(source.includes('Compatibility stylesheet'), `${name} stylesheet must remain an explicit compatibility entrypoint`);
  assert(!source.includes('{\n  display:'), `${name} stylesheet still contains active implementation rules`);
}

assert(dataSource.includes("from './productClosureSelectorsRelease.js'"), 'successionData must use the stable product release module');
assert(dataSource.includes("from './workspaceRefinementSelectors.js'"), 'successionData must compose workspace refinements directly');
assert(dataSource.includes('successionWorkspaceRefinements = createWorkspaceRefinementSelectors'), 'workspace refinements must be created inside the canonical runtime');
assert(dataSource.includes('successionReleaseManifest = createSuccessionReleaseManifest'), 'the canonical runtime must publish the Phase 6 release manifest');
assert(productReleaseSource.includes('createCanonicalProductClosureSelectors'), 'the stable product release module must preserve the canonical product selector base');
assert(productCompatibilitySource.includes("from './productClosureSelectorsRelease.js'"), 'the Phase 4 product path must be a release re-export');
assert(!productCompatibilitySource.includes('normalizeArchiveSearchText'), 'the Phase 4 compatibility path must contain no search implementation');
assert(workspaceCompatibilitySource.includes("from './successionData.js'"), 'the Phase 5 runtime path must re-export the canonical runtime');
assert(!workspaceCompatibilitySource.includes('createWorkspaceRefinementSelectors'), 'the Phase 5 compatibility path must contain no selector composition');
assert(manifestSource.includes("SUCCESSION_RELEASE_VERSION = 'phase-6-release-v1'"), 'the Phase 6 release version is missing');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const compatibility = await vite.ssrLoadModule('/src/data/succession/workspaceRefinementRuntime.js');
  const productRelease = await vite.ssrLoadModule('/src/data/succession/productClosureSelectorsRelease.js');
  const productCompatibility = await vite.ssrLoadModule('/src/data/succession/productClosureSelectorsPhase4.js');

  const manifest = archive.getSuccessionReleaseManifest();
  assert(manifest.version === 'phase-6-release-v1', 'the runtime release manifest has the wrong version');
  assert(manifest.architecture.routes === 19, 'all 19 maintained routes must remain registered');
  assert(manifest.architecture.hubs === 7, 'the four operational hubs and three independent library tools must remain registered');
  assert(manifest.data.valid, 'the canonical archive must remain valid');
  assert(manifest.runtime.selectorFamilies.length === 13, 'the final selector-family inventory is incomplete');
  assert(manifest.runtime.consolidatedModules.includes('SuccessionReleaseDesktop.css'), 'the release stylesheet is missing from the manifest');
  assert(manifest.runtime.compatibilityEntrypoints.length === 5, 'the compatibility-entrypoint inventory is incomplete');

  assert(compatibility.getChapterDeltaBrief === archive.getChapterDeltaBrief, 'the Phase 5 compatibility export must resolve to the canonical selector');
  assert(compatibility.getAbilityInteractionMatrix === archive.getAbilityInteractionMatrix, 'the Nen refinement compatibility export must resolve to the canonical selector');
  assert(productCompatibility.createProductClosureSelectors === productRelease.createProductClosureSelectors, 'the Phase 4 product compatibility export must resolve to the release selector');

  const latest = archive.successionArchiveData.chapters.at(-1)?.number || 414;
  const delta = archive.getChapterDeltaBrief(latest);
  const refinement = archive.getWorkspaceRefinementSummary(latest);
  const search = archive.searchArchiveProduct('Seed Urn', { chapter: latest, limit: 20 });
  assert(delta.chapter === latest, 'chapter refinement selectors do not respect the latest boundary');
  assert(refinement.chapter === latest, 'workspace refinement summary does not respect the latest boundary');
  assert(search.some((result) => result.id === 'object:seed-urn' && result.route === 'research'), 'release product search lost high-value intelligence routing');

  console.log(`Succession Phase 6 consolidation audit passed: ${manifest.architecture.routes} routes, ${manifest.architecture.hubs} registered hub/tool entries, ${manifest.runtime.selectorFamilies.length} selector families, one deferred desktop release sheet, and ${manifest.runtime.compatibilityEntrypoints.length} zero-logic compatibility entrypoints verified.`);
} finally {
  await vite.close();
}
