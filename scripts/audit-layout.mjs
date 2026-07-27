import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { transformWithOxc } from 'vite';
import {
  referencePages,
  routeManifest,
  routeManifestStats,
  successionPages,
  successionReleaseRoutes,
} from '../src/data/routeManifest.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Layout audit failed: ${message}`); };

const [app, css, worldAtlas, familyTree, royalTree, royalTreeNodes, royalTreeModel, royalTreeBaseCss, royalTreeModuleCss, royalTreeInteractionCss, blackWhale, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/styles.css'),
  read('src/components/WorldAtlas.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.jsx'),
  read('src/components/succession/RoyalFamilyBoardNodes.jsx'),
  read('src/components/succession/RoyalFamilyBoardModel.js'),
  read('src/components/succession/RoyalFamilyGuardTree.css'),
  read('src/components/succession/RoyalFamilyGuardTreeFixes.css'),
  read('src/components/succession/RoyalFamilyBoardInteractionFixes.css'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('package.json'),
]);

const royalTreeSource = `${royalTree}\n${royalTreeNodes}\n${royalTreeModel}`;
const royalTreeCss = `${royalTreeBaseCss}\n${royalTreeModuleCss}\n${royalTreeInteractionCss}`;

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
assert(new Set(routeKeys).size === routeKeys.length, 'the redesigned reader-facing route matrix must not contain duplicate destinations');
assert(routeManifest.length >= 35, 'the expanded curated route matrix must retain all redesigned release screens');
assert(routeManifestStats.successionReleaseScreens === successionReleaseRoutes.length + 1, 'Succession release-screen statistics must include archive home plus every curated route');
assert(successionReleaseRoutes.length >= 15 && successionReleaseRoutes.every(Boolean), 'the curated Succession release matrix is incomplete');
assert(successionPages.length === 7 && referencePages.length === 5 && routeManifestStats.timeline === 1, 'the grouped legacy workspaces must retain seven Succession screens, five encyclopedia screens, and one global Timeline');
assert(!referencePages.some((page) => page.id === 'notebook'), 'the Notebook navigation button returned');
assert(!routeManifest.some((route) => /source/i.test(`${route.target} ${route.label}`)), 'a dedicated Sources screen returned to the public route matrix');
assert(!app.includes('StudyNotebook') && !app.includes("import SourceRegistry"), 'a removed Notebook or Sources section is still mounted by the application');
assert(css.includes('--content: 1240px') && css.includes('--wide: 1540px'), 'editorial content and visual-wide measures are missing');
assert(css.includes('.ship-manifest__table-wrap, .assignment-table-wrap { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto;'), 'wide tables must remain inside named scroll frames');
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the unified royal family renderer is not mounted');
assert(familyTree.includes('Tap any royal, guard, or mafia portrait to pin its essentials.') && !familyTree.includes('protection circle below'), 'the Family Tree mobile hint must describe the embedded dossier board rather than the retired orbit layout');
for (const token of ['royal-board__king', 'royal-board__mafia-rail', 'royal-board__mafia-members', 'royal-board__branch-grid', 'royal-board__branch-column', 'royal-board__queen-anchor', 'royal-board__prince-card', 'royal-board__guard-grid']) {
  assert(royalTreeSource.includes(token), `the Royal Family dossier board is missing ${token}`);
}
for (const selector of ['.royal-board__canvas', '.royal-board__mafia-card', '.royal-board__mafia-members', '.royal-board__branch-column', '.royal-board__branch', '.royal-board__beast-layer', '.royal-board__guard-tile']) {
  assert(royalTreeCss.includes(selector), `the Royal Family dossier-board CSS is missing ${selector}`);
}
assert(royalTreeSource.includes('guardianBeasts') && royalTreeSource.includes('mafiaConnections') && royalTreeSource.includes('buildProtectionNodes') && royalTreeSource.includes('getOrganizationMembers'), 'the dossier board must combine beasts, mafia members, selective links, and protection circles');
assert(!royalTreeNodes.includes('<span {direct}') && !royalTreeNodes.includes('setHoverdKey'), 'the Royal Family board contains a known JSX corruption or misspelled state setter');
assert(royalTree.includes('const selectedBranchIndex = royalTree.findIndex') && !royalTree.includes('Math.max(0, royalTree.findIndex'), 'an unresolved prince must not silently highlight the first maternal branch');
assert(royalTree.includes("onNavigate?.('princes', { prince: prince.order })") && royalTreeNodes.includes('openPrince(prince)'), 'prince dossier actions must use the dedicated prince route rather than the generic character workspace');
assert(royalTree.includes("import './RoyalFamilyBoardInteractionFixes.css';"), 'the Royal Family interaction repair layer is not loaded');
assert(royalTreeInteractionCss.includes('.royal-board__mafia-card > button:not(:hover):not(:focus-visible):not(.is-locked)') && royalTreeInteractionCss.includes('.royal-board__branch-column:last-child .royal-board__hover-card'), 'mafia tooltip isolation and inward right-column placement are missing');
assert(!royalTree.includes('<main className="royal-board__main">'), 'the embedded Royal Family board must not create a nested main landmark');
assert(css.includes('.interactive-ship-map__canvas { position: relative; min-height: 470px; }') && blackWhale.includes('ship-hotspot-layer'), 'the dominant clickable Black Whale canvas is missing');
assert(css.includes('.entity-record-image img { width: 100%; height: 100%; max-height: 620px; object-fit: contain;') && css.includes('.room-card > figure img { width: 100%; height: 100%; object-fit: contain;'), 'portrait and room media must use uncropped contain framing');
assert(css.includes('@media (max-width: 900px)') && css.includes('@media (max-width: 640px)') && css.includes('@media (max-width: 420px)'), 'tablet and phone layout boundaries are required');
assert(royalTreeCss.includes('@media(max-width:1100px)') && royalTreeCss.includes('@media(max-width:760px)') && royalTreeCss.includes('@media(max-width:430px)'), 'the royal family dossier board needs desktop-collapse, tablet, and phone adaptations');
assert(worldAtlas.includes('Map as MapIcon') && worldAtlas.includes('new Map('), 'the World Atlas constructor guard is missing');
assert(packageJson.includes('"qa:visual"') && packageJson.includes('"qa:architecture"'), 'the repeatable browser and architecture matrix commands are missing');

console.log(`Layout audit passed: ${jsxFiles.length} JSX modules parsed by Vite Oxc; ${routeManifest.length} unique purposeful routes; ${successionReleaseRoutes.length} curated Succession release workspaces; one global Timeline; ${successionPages.length} legacy Succession screens; ${referencePages.length} Reference screens; Notebook absent; repaired Royal Family dossier board with embedded guards, beasts, queen anchors, mafia links, dedicated prince routing, isolated previews, and responsive inward tooltips; contained media and tables; dominant ship atlas; responsive editorial shell.`);
