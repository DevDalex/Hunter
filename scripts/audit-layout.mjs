import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { transformWithOxc } from 'vite';
import {
  referencePages,
  routeManifest,
  routeManifestStats,
  seriesRoutes,
  successionReleaseRoutes,
} from '../src/data/routeManifest.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Layout audit failed: ${message}`);
};

const [app, css, router, header, integratedReferences, familyTree, blackWhale, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/styles.css'),
  read('src/lib/appRouter.js'),
  read('src/components/Header.jsx'),
  read('src/components/succession/SuccessionIntegratedReferences.jsx'),
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
const seriesManifestRoutes = routeManifest.filter((route) => route.view === 'series');
assert(routeManifest.length === routeManifestStats.screens, 'route manifest statistics must match the rendered route matrix');
assert(new Set(routeKeys).size === routeKeys.length, 'the focused route matrix must not contain duplicate destinations');
assert(referencePages.map((page) => page.id).join(',') === 'nen', 'only the general Nen Encyclopedia may remain as a general reference page');
assert(routeManifestStats.reference === 1, 'the focused site must expose exactly one general reference screen');
assert(routeManifestStats.successionReleaseScreens === successionReleaseRoutes.length + 1, 'Succession release-screen statistics must include archive home plus every curated route');
assert(successionReleaseRoutes.length >= 15 && successionReleaseRoutes.every(Boolean), 'the curated Succession release matrix is incomplete');
assert(routeManifest.every((route) => route.view === 'succession' || route.view === 'reference' || route.view === 'series'), 'an unsupported top-level view returned to the public route matrix');
assert(seriesRoutes.length === 1 && seriesRoutes[0] === 'chapters', 'the only permitted restored Series route is the read-only chapters bridge');
assert(seriesManifestRoutes.length === 1 && seriesManifestRoutes[0].target === 'chapters', 'the public route matrix must expose exactly one read-only Series chapter bridge');
assert(!routeManifest.some((route) => route.view === 'timeline' || route.view === 'home'), 'Home or global Timeline returned to the route matrix');

for (const retired of [
  'SiteHome',
  'SeriesWorkspace',
  'EntityEncyclopedia',
  'OrganizationWorkspace',
  'ConflictArchive',
  'HisokaChrolloDossier',
  'ArchiveSearch',
  'WorldAtlas',
]) assert(!app.includes(retired), `the retired ${retired} module is still mounted by the application`);

assert(app.includes('SuccessionArchiveApp'), 'the Succession archive is not mounted');
assert(app.includes('SuccessionIntegratedReferences'), 'the retained integrated reference host is not mounted');
assert(app.includes('PreSuccessionChapterRecord'), 'the read-only pre-Succession chapter bridge is not mounted');
assert(integratedReferences.includes('NenEncyclopedia'), 'the retained general Nen Encyclopedia is not mounted by the integrated reference host');
assert(!integratedReferences.includes('WorldAtlas'), 'the retired World Atlas returned to the integrated reference host');
assert(router.includes("if (!parts.length || pathnameClean === '/index.html')"), 'the root route guard is missing');
assert(router.includes("view: 'succession', target: 'archive'"), 'the root route must resolve to the Succession archive');
assert(router.includes("if (view === 'series')"), 'the read-only pre-Succession series route guard is missing');
assert(router.includes("return cleanUrl(`/series/${normalized.target || 'chapters'}`"), 'the pre-Succession chapter bridge clean URL is missing');
assert(router.includes("['nen', { target: 'nen' }]") && !router.includes("['world', { target: 'atlas' }]") , 'the retained /nen route or retired /world boundary is incorrect');
assert(
  header.includes("label: 'Succession Archive'")
    && header.includes("label: 'Nen Library'")
    && !header.includes("label: 'World Atlas'"),
  'the focused primary navigation is incomplete or the retired World Atlas returned',
);
assert(!header.includes("label: 'Characters'") && !header.includes("label: 'Fights'") && !header.includes("label: 'Story'"), 'retired navigation returned');

assert(css.includes('--content: 1240px') && css.includes('--wide: 1540px'), 'editorial content and visual-wide measures are missing');
assert(css.includes('@media (max-width: 900px)') && css.includes('@media (max-width: 640px)'), 'tablet and phone boundaries are required');
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the Succession royal family visualization is not mounted');
assert(blackWhale.includes('Black Whale passenger manifest'), 'the Succession Black Whale workspace lost its manifest');
assert(packageJson.includes('"build"') && packageJson.includes('"audit:succession-runtime"'), 'the focused build contract is incomplete');

console.log(`Layout audit passed: ${routeManifest.length} focused routes, ${successionReleaseRoutes.length} curated Succession screens, one retained integrated reference, one read-only pre-Succession chapter bridge, valid JSX, responsive containment, and no retired public workspaces.`);
