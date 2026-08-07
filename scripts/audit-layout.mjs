import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { transformWithOxc } from 'vite';
import {
  referencePages,
  routeManifest,
  routeManifestStats,
  successionReleaseRoutes,
} from '../src/data/routeManifest.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Layout audit failed: ${message}`);
};

const [app, css, router, header, integratedReferences, worldAtlas, familyTree, blackWhale, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/styles.css'),
  read('src/lib/appRouter.js'),
  read('src/components/Header.jsx'),
  read('src/components/succession/SuccessionIntegratedReferences.jsx'),
  read('src/components/WorldAtlas.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('package.json'),
]);

const collectJsxFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectJsxFiles(absolute));
    else if (/\.[jt]sx$/.test(entry.name)) files.push(absolute);
  }
  return files;
};

const jsxFiles = await collectJsxFiles(path.join(root, 'src'));
const jsxSyntaxFailures = [];
for (const filename of jsxFiles) {
  try {
    await transformWithOxc(await readFile(filename, 'utf8'), filename);
  } catch (error) {
    jsxSyntaxFailures.push(`${path.relative(root, filename)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
assert(!jsxSyntaxFailures.length, `Oxc rejected ${jsxSyntaxFailures.length} JSX source file(s): ${jsxSyntaxFailures.join(' | ')}`);

const routeKeys = routeManifest.map((route) => `${route.view}/${route.target}`);
assert(routeManifest.length === routeManifestStats.screens, 'route manifest statistics must match the rendered route matrix');
assert(new Set(routeKeys).size === routeKeys.length, 'the focused route matrix must not contain duplicate destinations');
assert(referencePages.map((page) => page.id).join(',') === 'nen,atlas', 'only the general Nen Encyclopedia and World Atlas may remain as general reference pages');
assert(routeManifestStats.reference === 2, 'the focused site must expose exactly two general reference screens');
assert(routeManifestStats.successionReleaseScreens === successionReleaseRoutes.length + 1, 'Succession release-screen statistics must include archive home plus every curated route');
assert(successionReleaseRoutes.length >= 15 && successionReleaseRoutes.every(Boolean), 'the curated Succession release matrix is incomplete');
assert(routeManifest.every((route) => route.view === 'succession' || route.view === 'reference'), 'a retired top-level view returned to the public route matrix');
assert(!routeManifest.some((route) => route.view === 'timeline' || route.view === 'series' || route.view === 'home'), 'Home, Story, or global Timeline returned to the route matrix');

for (const retired of [
  'SiteHome',
  'SeriesWorkspace',
  'EntityEncyclopedia',
  'OrganizationWorkspace',
  'ConflictArchive',
  'HisokaChrolloDossier',
  'ArchiveSearch',
]) assert(!app.includes(retired), `the retired ${retired} module is still mounted by the application`);

assert(app.includes('SuccessionArchiveApp'), 'the Succession archive is not mounted');
assert(app.includes('SuccessionIntegratedReferences'), 'the retained integrated reference host is not mounted');
assert(integratedReferences.includes('NenEncyclopedia'), 'the retained general Nen Encyclopedia is not mounted by the integrated reference host');
assert(integratedReferences.includes('WorldAtlas'), 'the retained general World Atlas is not mounted by the integrated reference host');
assert(router.includes("if (!parts.length || pathnameClean === '/index.html')"), 'the root route guard is missing');
assert(router.includes("view: 'succession', target: 'archive'"), 'the root route must resolve to the Succession archive');
assert(router.includes("['nen', { target: 'nen' }]") && router.includes("['world', { target: 'atlas' }]") , 'the retained /nen and /world routes are missing');
assert(header.includes("label: 'Succession'") && header.includes("label: 'Nen'") && header.includes("label: 'World'"), 'the focused primary navigation is incomplete');
assert(!header.includes("label: 'Characters'") && !header.includes("label: 'Fights'") && !header.includes("label: 'Story'"), 'retired navigation returned');

assert(css.includes('--content: 1240px') && css.includes('--wide: 1540px'), 'editorial content and visual-wide measures are missing');
assert(css.includes('@media (max-width: 900px)') && css.includes('@media (max-width: 640px)'), 'tablet and phone boundaries are required');
assert(worldAtlas.includes('InteractiveWorldMap'), 'the retained World Atlas lost its interactive map');
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the Succession royal family visualization is not mounted');
assert(blackWhale.includes('Black Whale passenger manifest'), 'the Succession Black Whale workspace lost its manifest');
assert(packageJson.includes('"build"') && packageJson.includes('"audit:succession-runtime"'), 'the focused build contract is incomplete');

console.log(`Layout audit passed: ${routeManifest.length} focused routes, ${successionReleaseRoutes.length} curated Succession screens, two retained integrated references, valid JSX, responsive containment, and no retired public workspaces.`);
