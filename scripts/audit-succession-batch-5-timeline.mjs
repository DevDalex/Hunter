import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`);
};

const [workspace, voyage, styles, routeStyles, workflow, finalQa, docs, routeManifest] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/TimelineCommand.css'),
  read('src/components/TimelineWorkspace.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-5.md'),
  read('src/data/routeManifest.js'),
]);

for (const token of [
  'timeline-command__hero',
  'timeline-command__signal',
  'timeline-command__metrics',
  'timeline-command__navigation',
  'timeline-command__scope-deck',
  'timeline-command__arc-grid',
  'timeline-command__ledger',
  'Global chronology command',
  'Every arc, phase, voyage day, and consequence',
]) assert(workspace.includes(token), `global timeline workspace is missing ${token}`);

for (const token of [
  'confidenceGroup',
  'chapterFrom',
  'chapterTo',
  'locationOptions',
  'activeFilterCount',
  'timeline-command-voyage__hero',
  'timeline-command-voyage__metrics',
  'timeline-command-voyage__controls',
  'timeline-command-voyage__selected',
  'timeline-command-voyage__mobile-lanes',
  'The voyage as a chapter-bounded operational ledger',
  'A complete lane-by-lane mobile list',
]) assert(voyage.includes(token), `voyage timeline workspace is missing ${token}`);

for (const selector of [
  '.timeline-command__hero',
  '.timeline-command__signal',
  '.timeline-command__metrics',
  '.timeline-command__navigation',
  '.timeline-command__arc-grid',
  '.timeline-command__ledger',
  '.timeline-command-voyage__hero',
  '.timeline-command-voyage__filter-grid',
  '.timeline-command-voyage__selected',
  '.timeline-day-rail',
  '.timeline-workbench',
  '.timeline-swimlanes',
  '.timeline-command-voyage__mobile-lanes',
  '.timeline-thread-view',
  '.timeline-chapter-view',
  '.timeline-location-view',
]) assert(styles.includes(selector), `timeline visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1180px)', '@media (max-width: 900px)', '@media (max-width: 720px)', '@media (max-width: 560px)']) {
  assert(styles.includes(breakpoint), `timeline CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'timeline touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'timeline controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'timeline CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'timeline CSS must not depend on !important');
assert(routeStyles.includes('grid-template-columns: minmax(0, 1fr)'), 'timeline route CSS must contain the prelude collision repair');
assert(routeStyles.includes('.succession-archive .timeline-command .timeline-command-voyage__hero h2'), 'timeline route CSS must preserve dark-surface hero contrast');
assert(routeManifest.includes("{ view: 'timeline'"), 'global Timeline must remain in the release manifest');
assert(routeManifest.includes("'timeline'"), 'Succession Timeline must remain in the release manifest');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must run the timeline audit');
assert(workflow.includes('npm run qa:succession-final-release'), 'Batch 5 workflow must run the complete release matrix');
assert(finalQa.includes("{ id: 'global-timeline', path: 'timeline/'"), 'complete release matrix must render the global Timeline');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'complete release matrix must render the curated Succession routes, including Timeline');
assert(workflow.includes('set -o pipefail'), 'final visual-QA command must propagate failures through tee');
for (const hour of ['Hour 51', 'Hour 52']) assert(docs.includes(hour), `Batch 5 design record must document ${hour}`);

console.log('Succession Batch 5 timeline audit passed: global chronology command, voyage filters, evidence confidence, five synchronized views, semantic mobile lanes, consolidated truthful visual gate, tablet containment, dark-surface contrast, touch targets, responsive behavior, and reduced motion are registered.');
