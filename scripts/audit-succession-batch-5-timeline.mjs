import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`);
};

const [workspace, voyage, styles, workflow, finalQa, router] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/TimelineCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('src/lib/appRouter.js'),
]);

for (const token of [
  'timeline-command--voyage-only',
  'Succession voyage chronology',
  'The voyage as a chapter-bounded operational ledger',
  'without opening the retired global chronology',
  'SuccessionTimeline',
  'onOpenLocation',
  "scope: 'events'",
]) assert(workspace.includes(token), `voyage-only timeline wrapper is missing ${token}`);

assert(!workspace.includes('Complete series'), 'the retired complete-series timeline control returned');
assert(!workspace.includes('Global chronology command'), 'the retired global chronology identity returned');
assert(!workspace.includes("from '../data/arcs'"), 'the voyage-only wrapper still imports the full-series arc catalogue');
assert(!workspace.includes("from '../data/seriesResearch'"), 'the voyage-only wrapper still imports full-series chronology data');

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
  'A complete lane-by-lane mobile list',
]) assert(voyage.includes(token), `voyage timeline workspace is missing ${token}`);

for (const selector of [
  '.timeline-command__hero',
  '.timeline-command__signal',
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

for (const breakpoint of [
  '@media (max-width: 1180px)',
  '@media (max-width: 900px)',
  '@media (max-width: 720px)',
  '@media (max-width: 560px)',
]) assert(styles.includes(breakpoint), `timeline CSS is missing ${breakpoint}`);

assert(styles.includes('@media (hover: none)'), 'timeline touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'timeline controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'timeline CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'timeline CSS must not depend on !important');

assertReleasedSuccessionRoutes(['timeline'], assert, 'Succession release manifest');
assert(router.includes("candidate === 'timeline'") && router.includes("normalizeDestination('succession', 'timeline'"), 'legacy global Timeline URLs must redirect to the Succession voyage timeline');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must run the timeline audit');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'the release matrix must render the curated Succession routes, including Timeline');
assert(workflow.includes('set -o pipefail'), 'final visual-QA command must propagate failures through tee');

console.log('Succession Batch 5 timeline audit passed: the voyage-only chronology, evidence confidence, synchronized views, mobile lanes, touch targets, responsive behavior, and reduced motion are registered without restoring the retired global timeline.');
