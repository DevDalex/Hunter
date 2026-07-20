import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { referencePages, routeManifest, routeManifestStats, successionPages } from '../src/data/routeManifest.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Layout audit failed: ${message}`); };

const [app, css, worldAtlas, familyTree, blackWhale, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/styles.css'),
  read('src/components/WorldAtlas.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('package.json'),
]);

assert(routeManifest.length === 26 && routeManifestStats.screens === 26, 'the redesigned reader-facing route matrix must contain 26 purposeful screens');
assert(successionPages.length === 8 && referencePages.length === 5, 'the grouped workspaces must remain eight Succession and five encyclopedia screens after Notebook removal');
assert(!referencePages.some((page) => page.id === 'notebook'), 'the Notebook navigation button returned');
assert(!routeManifest.some((route) => /source/i.test(`${route.target} ${route.label}`)), 'a dedicated Sources screen returned to the public route matrix');
assert(!app.includes('StudyNotebook') && !app.includes("import SourceRegistry"), 'a removed Notebook or Sources section is still mounted by the application');
assert(css.includes('--content: 1240px') && css.includes('--wide: 1540px'), 'editorial content and visual-wide measures are missing');
assert(css.includes('.ship-manifest__table-wrap, .assignment-table-wrap { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto;'), 'wide tables must remain inside named scroll frames');
assert(css.includes('.royal-tree__branches::before') && css.includes('.tree-trunk') && css.includes('.branch-stem') && css.includes('.royal-branch__children::before'), 'the royal family tree must retain a continuous trunk, queen bus, branch stems, and child lines');
assert(familyTree.includes('royal-tree__graphic') && familyTree.includes('branch-stem'), 'the connected family-tree graphic is missing');
assert(css.includes('.interactive-ship-map__canvas { position: relative; min-height: 470px; }') && blackWhale.includes('ship-hotspot-layer'), 'the dominant clickable Black Whale canvas is missing');
assert(css.includes('.entity-record-image img { width: 100%; height: 100%; max-height: 620px; object-fit: contain;') && css.includes('.room-card > figure img { width: 100%; height: 100%; object-fit: contain;'), 'portrait and room media must use uncropped contain framing');
assert(css.includes('@media (max-width: 900px)') && css.includes('@media (max-width: 640px)') && css.includes('@media (max-width: 420px)'), 'tablet and phone layout boundaries are required');
assert(worldAtlas.includes('Map as MapIcon') && worldAtlas.includes('new Map('), 'the World Atlas constructor guard is missing');
assert(packageJson.includes('"qa:visual"'), 'the repeatable browser matrix command is missing');

console.log(`Layout audit passed: ${routeManifest.length} purposeful routes; ${referencePages.length} Reference screens; Notebook absent; connected family tree; contained media and tables; dominant ship atlas; responsive editorial shell.`);
