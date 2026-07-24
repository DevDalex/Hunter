import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { referencePages, routeManifest, routeManifestStats, successionPages } from '../src/data/routeManifest.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Layout audit failed: ${message}`); };

const [app, css, worldAtlas, familyTree, royalTree, royalTreeCss, blackWhale, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/styles.css'),
  read('src/components/WorldAtlas.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.css'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('package.json'),
]);

assert(routeManifest.length === 26 && routeManifestStats.screens === 26, 'the redesigned reader-facing route matrix must contain 26 purposeful screens');
assert(successionPages.length === 7 && referencePages.length === 5 && routeManifestStats.timeline === 1, 'the grouped workspaces must retain seven Succession screens, five encyclopedia screens, and one global Timeline');
assert(!referencePages.some((page) => page.id === 'notebook'), 'the Notebook navigation button returned');
assert(!routeManifest.some((route) => /source/i.test(`${route.target} ${route.label}`)), 'a dedicated Sources screen returned to the public route matrix');
assert(!app.includes('StudyNotebook') && !app.includes("import SourceRegistry"), 'a removed Notebook or Sources section is still mounted by the application');
assert(css.includes('--content: 1240px') && css.includes('--wide: 1540px'), 'editorial content and visual-wide measures are missing');
assert(css.includes('.ship-manifest__table-wrap, .assignment-table-wrap { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto;'), 'wide tables must remain inside named scroll frames');
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the unified royal family renderer is not mounted');
assert(royalTree.includes('royal-guard-tree__king') && royalTree.includes('royal-guard-tree__queen-grid') && royalTree.includes('royal-guard-tree__center-prince') && royalTree.includes('royal-guard-tree__guard-slot'), 'the royal visualization must contain the king, queens, selected prince, and guard orbit');
assert(royalTreeCss.includes('.royal-guard-tree__king-stem') && royalTreeCss.includes('.royal-guard-tree__queen-line') && royalTreeCss.includes('.royal-guard-tree__branch-stem') && royalTreeCss.includes('.royal-guard-tree__guard-line'), 'the unified royal visualization must retain connected lineage and protection lines');
assert(css.includes('.interactive-ship-map__canvas { position: relative; min-height: 470px; }') && blackWhale.includes('ship-hotspot-layer'), 'the dominant clickable Black Whale canvas is missing');
assert(css.includes('.entity-record-image img { width: 100%; height: 100%; max-height: 620px; object-fit: contain;') && css.includes('.room-card > figure img { width: 100%; height: 100%; object-fit: contain;'), 'portrait and room media must use uncropped contain framing');
assert(css.includes('@media (max-width: 900px)') && css.includes('@media (max-width: 640px)') && css.includes('@media (max-width: 420px)'), 'tablet and phone layout boundaries are required');
assert(royalTreeCss.includes('@media (max-width: 1100px)') && royalTreeCss.includes('@media (max-width: 760px)') && royalTreeCss.includes('@media (max-width: 430px)'), 'the royal family visualization needs desktop-collapse, tablet, and phone adaptations');
assert(worldAtlas.includes('Map as MapIcon') && worldAtlas.includes('new Map('), 'the World Atlas constructor guard is missing');
assert(packageJson.includes('"qa:visual"') && packageJson.includes('"qa:architecture"'), 'the repeatable browser and architecture matrix commands are missing');

console.log(`Layout audit passed: ${routeManifest.length} purposeful routes; one global Timeline; ${successionPages.length} Succession screens; ${referencePages.length} Reference screens; Notebook absent; unified royal family and guard network; contained media and tables; dominant ship atlas; responsive editorial shell.`);