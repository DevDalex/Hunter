import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 4 spatial audit failed: ${message}`);
};

const [locations, locationStyles, ship, shipStyles, imports, workflow, docs, routeManifest] = await Promise.all([
  read('src/components/succession/SuccessionArchiveLocationWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveLocationCommand.css'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('src/components/succession/SuccessionArchiveBlackWhaleCommand.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('.github/workflows/succession-visual-redesign-batch-4-closure.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-4-SPATIAL-CLOSURE.md'),
  read('src/data/routeManifest.js'),
]);
const styles = `${locationStyles}\n${shipStyles}`;

for (const token of [
  'getLocationSnapshot',
  'snapshotChapter',
  'succession-canonical-locations__hero',
  'succession-location-filter-panel',
  'succession-location-directory',
  'succession-location-dossier',
  'succession-location-breadcrumbs',
  'succession-location-snapshot',
  'succession-location-occupants',
  'succession-location-activity-grid',
  'succession-location-history',
  'succession-location-sources',
]) assert(locations.includes(token), `location workspace contract is missing ${token}`);

for (const token of [
  'getBlackWhaleCanonicalBridge',
  'getLocationSnapshot',
  'interactive-ship-atlas',
  'ship-location-inspector',
  'ship-hotspot-index',
  'ship-visual-tour',
  'royal-room-plan',
  'ship-movement-map',
  'ship-manifest',
  'room-index',
  'Canonical bridge',
]) assert(ship.includes(token), `Black Whale reference contract is missing ${token}`);

for (const selector of [
  '.succession-canonical-locations__hero',
  '.succession-location-filter-panel',
  '.succession-location-card',
  '.succession-location-dossier',
  '.succession-location-snapshot',
  '.succession-location-history',
  '.black-whale-section--atlas > .section-heading',
  '.interactive-ship-atlas',
  '.interactive-ship-map',
  '.ship-location-inspector',
  '.ship-hotspot-index',
  '.ship-visual-tour',
  '.royal-room-plan--editorial',
  '.ship-movement-map',
  '.ship-manifest',
  '.room-index',
  '.room-card',
]) assert(styles.includes(selector), `spatial visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1120px)', '@media (max-width: 780px)', '@media (max-width: 560px)']) {
  assert(styles.includes(breakpoint), `spatial CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'spatial touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'spatial reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'spatial controls must retain 44px touch targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'new spatial CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'new spatial CSS must not depend on !important');
assert(imports.includes("@import './SuccessionArchiveLocationCommand.css';"), 'location command stylesheet must be loaded');
assert(imports.includes("@import './SuccessionArchiveBlackWhaleCommand.css';"), 'Black Whale command stylesheet must be loaded');
assert(routeManifest.includes("'locations'"), 'release visual manifest must include Locations');
assert(routeManifest.includes("'black-whale'"), 'release visual manifest must include Black Whale');
assert(workflow.includes('node scripts/audit-succession-batch-4-spatial.mjs'), 'closure workflow must run spatial audit');
assert(workflow.includes('succession/locations'), 'closure workflow must render Locations');
assert(workflow.includes('succession/black-whale'), 'closure workflow must render Black Whale');
assert(docs.includes('Hour 50'), 'spatial design record must document Hour 50');

console.log('Succession Batch 4 spatial audit passed: canonical hierarchy, access, snapshot, occupancy, movement, evidence, atlas precision, hotspot index, tier navigation, royal rooms, routes, manifest, room directory, responsive behavior, touch targets, and reduced motion are registered.');
