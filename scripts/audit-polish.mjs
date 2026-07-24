import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Polish audit failed: ${message}`); };

const [safeImage, blackWhale, worldAtlas, worldMap, encyclopedia, familyTree, royalTree, royalTreeCss, archiveShell, archiveContrast, timeline, successionDossier, css, visualQa] = await Promise.all([
  read('src/components/SafeImage.jsx'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('src/components/WorldAtlas.jsx'),
  read('src/components/InteractiveWorldMap.jsx'),
  read('src/components/EntityEncyclopedia.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.css'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveContrastFixes.css'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/SuccessionDossier.jsx'),
  read('src/styles.css'),
  read('scripts/visual-qa.mjs'),
]);

assert(safeImage.includes("data-image-loaded={loaded ? 'true' : 'false'}"), 'SafeImage must expose a deterministic loaded state');
assert(css.includes(".fandom-image:has(.safe-image[data-image-loaded='false'])") && css.includes(".beast-grid figure:has(.safe-image[data-image-loaded='false'])"), 'unavailable media must collapse instead of leaving blank frames');
assert(blackWhale.includes('const ROOM_BATCH = 12;') && blackWhale.includes('displayedRooms.map((room)') && blackWhale.includes('Show {Math.min(ROOM_BATCH, roomsRemaining)} more spaces'), 'the Black Whale room directory must remain progressive');
assert(blackWhale.includes('routeKind') && blackWhale.includes('ship-hotspot-layer') && blackWhale.includes('ship-location-inspector'), 'the ship atlas must provide route filters, clickable hotspots, and a focused inspector');
assert(timeline.includes("['swimlanes', 'Concurrent lanes'") && timeline.includes('timeline-swimlanes__grid') && timeline.includes("['overview', 'standard', 'complete']"), 'the timeline must provide concurrent lanes and a complete-density view');
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the family-tree route must mount the unified royal visualization');
assert(royalTree.includes('HoverCard') && royalTree.includes('lockedGuard') && royalTree.includes('royal-guard-tree__inspector'), 'the royal visualization must retain smooth previews, locked selections, and a focused detail panel');
assert(royalTreeCss.includes('.royal-guard-tree__king-stem') && royalTreeCss.includes('.royal-guard-tree__branch-stem') && royalTreeCss.includes('.royal-guard-tree__guard-line') && royalTreeCss.includes('@keyframes royal-guard-tree-panel-in'), 'the royal visualization must retain connected lines and animated visual feedback');
assert(archiveShell.includes("import './SuccessionArchiveContrastFixes.css';"), 'the archive shell must load the final shared workspace contrast layer');
assert(archiveContrast.includes('--succession-dark-text: #f5efe6')
  && archiveContrast.includes('.succession-character-ledger > button')
  && archiveContrast.includes('.succession-extended-hero')
  && archiveContrast.includes('.succession-mafia-workspace__hero')
  && archiveContrast.includes('color: var(--succession-dark-text) !important;'), 'Characters, Hunters, Mafia, Military, Organizations, and related dark workspaces must explicitly own readable foreground colors');
assert(encyclopedia.includes('<HorizontalScrollHint>Swipe the category shelf'), 'the encyclopedia category shelf needs a mobile scroll cue');
assert(worldAtlas.includes('worldGalleryIds.length') && !worldAtlas.includes("|| '…'"), 'the World Atlas metric must use an honest settled value');
assert(worldMap.includes('worldMapAssets.clean.src') && worldMap.includes('fitRoute(activeRoute)') && worldMap.includes('worldMapUnplacedLocations'), 'the geographic atlas must keep its sourced canvas, route fitting, and deliberately unpinned records');
assert(successionDossier.includes('assignment-network__flow') && successionDossier.includes('chooseAssignmentHousehold'), 'guard assignments must retain an interactive household-to-room lens above the text ledger');
assert(css.includes('object-fit: contain') && css.includes('object-position: center !important'), 'reference media must favor complete, centered images over aggressive crops');
assert(visualQa.includes('pendingImages') && visualQa.includes('audit.pendingImages.length') && visualQa.includes('mediaTextOverlaps') && visualQa.includes('audit.mediaTextOverlaps.length'), 'visual QA must fail unsettled images and media-copy collisions');

const readerText = [blackWhale, worldAtlas, worldMap, encyclopedia, familyTree, royalTree, timeline].join('\n');
assert(!/image placeholder|placeholder image/i.test(readerText), 'reader-facing placeholder-image copy is forbidden');

console.log('Polish audit passed: deterministic media; progressive rooms; clickable ship hotspots; concurrent timeline lanes; unified animated royal family protection network; readable Succession workspace contrast; contained uncropped imagery.');
