import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`);
};

const [workspace, timeline, shellStyles, commandStyles, routeManifest, workflow, docs] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/TimelineWorkspace.css'),
  read('src/components/SuccessionTimelineCommand.css'),
  read('src/data/routeManifest.js'),
  read('.github/workflows/succession-visual-redesign-batch-5-timeline.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-5.md'),
]);

for (const token of [
  'timeline-command',
  'timeline-workspace__command-state',
  'timeline-workspace__status-strip',
  'Global chronology command',
  'Time confidence retained',
  'Concurrent lanes preserved',
  'onOpenChapter',
]) assert(workspace.includes(token), `global timeline workspace is missing ${token}`);

for (const token of [
  "const [activeDay",
  "const [activeConfidence",
  "const [activeLocation",
  'timeline-command-hero',
  'timeline-command-axis',
  'timeline-command-metrics',
  'timeline-filter-deck',
  'timeline-filter-grid',
  'timeline-active-filters',
  'timeline-empty-state',
  "['chronology', 'Chronology'",
  "['swimlanes', 'Concurrent lanes'",
  "['threads', 'Story threads'",
  "['chapters', 'Chapter order'",
  "['locations', 'Locations'",
  'Reset timeline filters',
  'Open chapter dossier',
]) assert(timeline.includes(token), `detailed timeline contract is missing ${token}`);

for (const selector of [
  '.timeline-workspace__hero',
  '.timeline-workspace__command-state',
  '.timeline-workspace__status-strip',
  '.timeline-workspace__arc-rail',
  '.timeline-workspace__controls',
  '.timeline-workspace__overview',
  '.timeline-workspace__ledger',
]) assert(shellStyles.includes(selector), `global timeline shell is missing ${selector}`);

for (const selector of [
  '.timeline-command-hero',
  '.timeline-command-metrics',
  '.timeline-command-axis',
  '.timeline-filter-deck',
  '.timeline-filter-grid',
  '.timeline-track-filter',
  '.timeline-active-filters',
  '.timeline-workbench',
  '.timeline-inspector',
  '.timeline-swimlanes__grid',
  '.timeline-thread-view',
  '.timeline-chapter-view',
  '.timeline-location-view',
]) assert(commandStyles.includes(selector), `timeline intelligence styles are missing ${selector}`);

for (const styles of [shellStyles, commandStyles]) {
  assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'Batch 5 timeline CSS must not introduce raw hex colors');
  assert(!styles.includes('!important'), 'Batch 5 timeline CSS must not depend on !important');
  assert(styles.includes('min-height: 44px'), 'timeline controls must retain 44px touch targets');
  assert(styles.includes('@media (hover: none)'), 'timeline CSS must define touch behavior');
  assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline CSS must define reduced-motion behavior');
}

for (const breakpoint of ['@media (max-width: 1100px)', '@media (max-width: 780px)', '@media (max-width: 560px)']) {
  assert(shellStyles.includes(breakpoint), `global timeline shell is missing ${breakpoint}`);
}
for (const breakpoint of ['@media (max-width: 1180px)', '@media (max-width: 900px)', '@media (max-width: 680px)', '@media (max-width: 480px)']) {
  assert(commandStyles.includes(breakpoint), `timeline intelligence CSS is missing ${breakpoint}`);
}

assert(routeManifest.includes("'timeline'"), 'release visual manifest must retain the Timeline route');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must run the timeline audit');
assert(workflow.includes('succession/timeline'), 'Batch 5 workflow must render the Succession Timeline route');
for (const hour of ['Hour 51', 'Hour 52']) assert(docs.includes(hour), `Batch 5 design record must document ${hour}`);

console.log('Succession Batch 5 timeline audit passed: global command, voyage axis, five maintained views, compound filters, event inspector, semantic fallbacks, responsive layouts, touch targets, and reduced motion are registered.');
