import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Polish audit failed: ${message}`); };

const [safeImage, blackWhale, worldAtlas, worldMap, encyclopedia, familyTree, royalTree, royalTreeNodes, royalTreeModel, royalTreeBaseCss, royalTreeModuleCss, royalTreeInteractionCss, royalNetworks, archiveShell, archiveContrast, deepContrast, nenFixes, timeline, successionDossier, css, visualQa] = await Promise.all([
  read('src/components/SafeImage.jsx'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('src/components/WorldAtlas.jsx'),
  read('src/components/InteractiveWorldMap.jsx'),
  read('src/components/EntityEncyclopedia.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.jsx'),
  read('src/components/succession/RoyalFamilyBoardNodes.jsx'),
  read('src/components/succession/RoyalFamilyBoardModel.js'),
  read('src/components/succession/RoyalFamilyGuardTree.css'),
  read('src/components/succession/RoyalFamilyGuardTreeFixes.css'),
  read('src/components/succession/RoyalFamilyBoardInteractionFixes.css'),
  read('src/data/successionProtectionNetworks.js'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveContrastFixes.css'),
  read('src/components/succession/SuccessionArchiveDeepContrastFixes.css'),
  read('src/components/succession/SuccessionArchiveNenFixes.css'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/SuccessionDossier.jsx'),
  read('src/styles.css'),
  read('scripts/visual-qa.mjs'),
]);

const royalTreeSource = `${royalTree}\n${royalTreeNodes}\n${royalTreeModel}`;
const royalTreeCss = `${royalTreeBaseCss}\n${royalTreeModuleCss}\n${royalTreeInteractionCss}`;

assert(safeImage.includes("data-image-loaded={loaded ? 'true' : 'false'}"), 'SafeImage must expose a deterministic loaded state');
assert(css.includes(".fandom-image:has(.safe-image[data-image-loaded='false'])") && css.includes(".beast-grid figure:has(.safe-image[data-image-loaded='false'])"), 'unavailable media must collapse instead of leaving blank frames');
assert(blackWhale.includes('const ROOM_BATCH = 12;') && blackWhale.includes('displayedRooms.map((room)') && blackWhale.includes('Show {Math.min(ROOM_BATCH, roomsRemaining)} more spaces'), 'the Black Whale room directory must remain progressive');
assert(blackWhale.includes('routeKind') && blackWhale.includes('ship-hotspot-layer') && blackWhale.includes('ship-location-inspector'), 'the ship atlas must provide route filters, clickable hotspots, and a focused inspector');
assert(timeline.includes("['swimlanes', 'Concurrent lanes'") && timeline.includes('timeline-swimlanes__grid') && timeline.includes("['overview', 'standard', 'complete']"), 'the timeline must provide concurrent lanes and a complete-density view');
assert(familyTree.includes('RoyalFamilyGuardTree') && familyTree.includes('Tap any royal, guard, or mafia portrait to pin its essentials.'), 'the family-tree route must mount and accurately describe the unified royal visualization');
assert(royalTreeSource.includes('HoverCard') && royalTreeSource.includes('lockedKey') && royalTreeSource.includes('royal-board__hover-card'), 'the royal dossier board must retain hover previews and pin-able selections without a permanent inspector');
assert(royalTreeSource.includes('networkKindLabel') && royalTreeSource.includes('is-${guard.kind}') && royalTreeSource.includes('buildProtectionNodes'), 'the royal dossier board must distinguish protection, placements, intelligence, and group records');
assert(royalTreeSource.includes('guardianBeasts') && royalTreeSource.includes('BeastLayer') && royalTreeSource.includes('mafiaConnections') && royalTreeSource.includes('getOrganizationMembers'), 'the royal dossier board must integrate Guardian Spirit Beasts, selective mafia relationships, and member portraits');
assert(royalTreeNodes.includes('onAvailabilityChange={setAvailable}') && royalTreeNodes.includes("image ? 'Beast image unavailable' : 'Beast unrevealed'"), 'failed Guardian Spirit Beast media must fall back to an explicit visual state');
assert(royalTreeNodes.includes('.filter(({ character }) => character && !excludedNames.has(normalizeLookup(character.name)))') && royalTreeModel.includes('dossierByOrder'), 'mafia previews must exclude duplicate leaders and connected royal sponsors');
assert(royalTree.includes("onNavigate?.('princes', { prince: prince.order })") && royalTreeNodes.includes('openPrince(prince)'), 'Open dossier must enter the dedicated prince workspace');
assert(royalTreeInteractionCss.includes('button:not(:hover):not(:focus-visible):not(.is-locked) > .royal-board__hover-card') && royalTreeInteractionCss.includes('@media (min-width: 761px)') && royalTreeInteractionCss.includes('.royal-board__branch-column:last-child .royal-board__hover-card'), 'only the active mafia tooltip may open, and right-column previews must open inward');
assert(royalTreeSource.includes('abilityLabelFor') && royalTreeSource.includes('royal-board__mafia-members'), 'hover previews must surface abilities and essentials for guards and mafia members');
assert(royalNetworks.includes('categorizedActorsByPrince') && royalNetworks.includes("actor('Izunavi', 'kurapika-placement'") && !royalNetworks.includes('roomText:'), 'royal networks must use explicit assignments instead of prose-based team inference');
assert(royalTreeCss.includes('.royal-board__branch:before') && royalTreeCss.includes('.royal-board__beast-layer') && royalTreeCss.includes('.royal-board__guard-tile') && royalTreeCss.includes('@media(prefers-reduced-motion:reduce)'), 'the royal dossier board must retain local relationship cues, beast layers, embedded guards, and restrained reduced-motion feedback');
assert(archiveShell.includes("import './SuccessionArchiveContrastFixes.css';") && archiveShell.includes("import './SuccessionArchiveDeepContrastFixes.css';") && archiveShell.includes("import './SuccessionArchiveNenFixes.css';"), 'the archive shell must load shared, deep, and Nen-specific workspace repair layers');
assert(archiveContrast.includes('--succession-dark-text: #f5efe6')
  && archiveContrast.includes('.succession-character-ledger > button')
  && archiveContrast.includes('.succession-extended-hero')
  && archiveContrast.includes('.succession-mafia-workspace__hero')
  && archiveContrast.includes('color: var(--succession-dark-text) !important;'), 'Characters, Hunters, Mafia, Military, Organizations, and related dark workspaces must explicitly own readable foreground colors');
assert(deepContrast.includes('.deep-dossier--embedded') && deepContrast.includes('.succession-beast-grid > button') && deepContrast.includes('.succession-event-timeline > button'), 'Nen, Guardian Beast, and event cards must own dark-panel contrast');
assert(deepContrast.includes('.succession-body-state-ledger') && deepContrast.includes('.succession-relationship-ledger > article') && deepContrast.includes('.succession-chapter-record') && deepContrast.includes('.succession-glossary-list > article'), 'death, relationship, chapter, and glossary routes must own dark-panel contrast');
assert(nenFixes.includes('.ability-ledger > a') && nenFixes.includes('text-decoration: none !important;') && nenFixes.includes('grid-template-columns: repeat(3, minmax(0, 1fr));'), 'embedded Nen ability cards must reset full-card link decoration and retain an owned responsive grid');
assert(nenFixes.includes('.lesson-ledger > article > div') && nenFixes.includes('flex-wrap: wrap;') && nenFixes.includes('.lesson-ledger > article > div > small'), 'Nen lesson participants must remain separated, wrapping identity chips');
assert(encyclopedia.includes('<HorizontalScrollHint>Swipe the category shelf'), 'the encyclopedia category shelf needs a mobile scroll cue');
assert(worldAtlas.includes('worldGalleryIds.length') && !worldAtlas.includes("|| '…'"), 'the World Atlas metric must use an honest settled value');
assert(worldMap.includes('worldMapAssets.clean.src') && worldMap.includes('fitRoute(activeRoute)') && worldMap.includes('worldMapUnplacedLocations'), 'the geographic atlas must keep its sourced canvas, route fitting, and deliberately unpinned records');
assert(successionDossier.includes('assignment-network__flow') && successionDossier.includes('chooseAssignmentHousehold'), 'guard assignments must retain an interactive household-to-room lens above the text ledger');
assert(css.includes('object-fit: contain') && css.includes('object-position: center !important'), 'reference media must favor complete, centered images over aggressive crops');
assert(visualQa.includes('pendingImages') && visualQa.includes('audit.pendingImages.length') && visualQa.includes('mediaTextOverlaps') && visualQa.includes('audit.mediaTextOverlaps.length'), 'visual QA must fail unsettled images and media-copy collisions');

const readerText = [blackWhale, worldAtlas, worldMap, encyclopedia, familyTree, royalTreeSource, timeline].join('\n');
assert(!/image placeholder|placeholder image/i.test(readerText), 'reader-facing placeholder-image copy is forbidden');

console.log('Polish audit passed: deterministic media; progressive rooms; clickable ship hotspots; concurrent timeline lanes; repaired Royal Family dossier board with dedicated prince routing, filtered mafia members, explicit beast fallbacks, isolated compact previews, and inward right-column tooltips; complete Succession contrast ownership; repaired Nen card layout; contained uncropped imagery.');
