import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 Black Whale audit failed: ${message}`);
};

const [guide, styles, workflow, finalQa, docs, routeManifest] = await Promise.all([
  read('src/components/BlackWhaleGuide.jsx'),
  read('src/components/BlackWhaleIntelligenceCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-5.md'),
  read('src/data/routeManifest.js'),
]);

for (const token of [
  'MAP_MODES',
  'snapshotChapter',
  'hotspotIntel',
  'resolveMappedHotspot',
  'movementSegments',
  'arrivalsByHotspot',
  'getMovementHistoryForCharacter',
  'ship-temporal-command',
  'ship-movement-overlay',
  'ship-temporal-ledger',
  'See the ship change by chapter',
  'The map is never the only representation of occupancy or movement',
]) assert(guide.includes(token), `Black Whale guide is missing ${token}`);

for (const selector of [
  '.black-whale-intelligence__hero',
  '.ship-temporal-command',
  '.black-whale-intelligence__atlas',
  '.ship-movement-overlay',
  '.ship-hotspot__count',
  '.ship-location-inspector__snapshot',
  '.ship-location-inspector__occupants',
  '.ship-location-inspector__movements',
  '.ship-temporal-ledger',
]) assert(styles.includes(selector), `Black Whale visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1180px)', '@media (max-width: 900px)', '@media (max-width: 720px)', '@media (max-width: 560px)']) {
  assert(styles.includes(breakpoint), `Black Whale CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'Black Whale touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Black Whale reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'Black Whale controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'Black Whale CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'Black Whale CSS must not depend on !important');
assert(routeManifest.includes("'black-whale'"), 'release visual manifest must include the Black Whale route');
assert(workflow.includes('node scripts/audit-succession-batch-5-black-whale.mjs'), 'Batch 5 workflow must run the Black Whale audit');
assert(workflow.includes('npm run qa:succession-final-release'), 'Batch 5 workflow must run the complete release matrix');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'complete release matrix must render the curated Succession routes, including Black Whale');
for (const hour of ['Hour 55', 'Hour 56']) assert(docs.includes(hour), `Batch 5 design record must document ${hour}`);

console.log('Succession Batch 5 Black Whale audit passed: temporal atlas modes, chapter snapshots, occupancy signals, mapped movement paths, semantic ledgers, consolidated release QA, responsive behavior, touch targets, and reduced motion are registered.');
