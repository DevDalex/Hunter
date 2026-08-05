import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 4 event audit failed: ${message}`);
};

const [workspace, styles, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveEventWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveEventCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-4.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-4.md'),
]);

for (const token of [
  'eventStateClass',
  'EventDirectoryCard',
  'succession-event-command__hero',
  'succession-event-command__metrics',
  'succession-event-command__filters',
  'succession-event-command__timeline',
  'succession-event-command__grid',
  'succession-event-command__index',
  'succession-event-command-dossier',
  'succession-event-command-dossier__hero',
  'succession-event-command-dossier__boundary',
  'succession-event-command-dossier__causality',
  'succession-event-command-dossier__chain',
  'Cause → action → available outcome',
  'Later outcomes, actors, Nen mechanics, evidence, and consequence nodes remain excluded',
]) assert(workspace.includes(token), `event workspace contract is missing ${token}`);

for (const selector of [
  '.succession-event-command__hero',
  '.succession-event-command__metrics',
  '.succession-event-command__filters',
  '.succession-event-command-card',
  '.succession-event-command__index',
  '.succession-event-command-dossier__hero',
  '.succession-event-command-dossier__boundary',
  '.succession-event-command-dossier__causality',
  '.succession-event-command-dossier__state-grid',
]) assert(styles.includes(selector), `event visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1120px)', '@media (max-width: 780px)', '@media (max-width: 560px)']) {
  assert(styles.includes(breakpoint), `event CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'event touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'event reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'event controls must retain 44px touch targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'event CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'event CSS must not depend on !important');
assertReleasedSuccessionRoutes(['events'], assert, 'release visual manifest');
assert(workflow.includes('node scripts/audit-succession-batch-4-events.mjs'), 'Batch 4 workflow must run the event audit');
assert(workflow.includes('succession/events'), 'Batch 4 workflow must render the Events workspace');
for (const hour of ['Hour 45', 'Hour 46']) assert(docs.includes(hour), `Batch 4 design record must document ${hour}`);

console.log('Succession Batch 4 event audit passed: timeline, grid, index, chapter-bounded filters, dedicated dossiers, causal pipeline, entity cross-links, event-chain navigation, responsive behavior, touch targets, and reduced motion are registered.');
