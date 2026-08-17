import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`); };

const [workspace, voyage, styles, workflow, finalQa, router] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/TimelineCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('src/lib/appRouter.js'),
]);

for (const token of ['timeline-command--voyage-only','Succession voyage chronology','The voyage as a chapter-bounded operational ledger','without opening the retired global chronology','SuccessionTimeline','onOpenLocation',"scope: 'events'"]) assert(workspace.includes(token), `voyage-only timeline wrapper is missing ${token}`);
assert(!workspace.includes('Complete series'), 'the retired complete-series timeline control returned');
assert(!workspace.includes('Global chronology command'), 'the retired global chronology identity returned');
assert(!workspace.includes("from '../data/arcs'"), 'the voyage-only wrapper still imports the full-series arc catalogue');
assert(!workspace.includes("from '../data/seriesResearch'"), 'the voyage-only wrapper still imports full-series chronology data');

for (const token of ['confidenceGroup','chapterFrom','chapterTo','locationOptions','activeFilterCount','timeline-command-voyage__hero','timeline-command-voyage__metrics','timeline-command-voyage__controls','timeline-command-voyage__selected']) assert(voyage.includes(token), `voyage timeline workspace is missing ${token}`);
assert(!voyage.includes('timeline-command-voyage__mobile-lanes'), 'duplicate narrow-screen lane renderer returned');
assert(!/\bmobile\b/i.test(voyage), 'device-specific timeline wording returned');

for (const selector of ['.timeline-command__hero','.timeline-command__signal','.timeline-command-voyage__hero','.timeline-command-voyage__filter-grid','.timeline-command-voyage__selected','.timeline-day-rail','.timeline-workbench','.timeline-swimlanes','.timeline-thread-view','.timeline-chapter-view','.timeline-location-view']) assert(styles.includes(selector), `timeline visual system is missing ${selector}`);
assert(!styles.includes('@media (max-width:'), 'desktop-only timeline CSS must not carry narrow-width breakpoint layouts');
assert(!styles.includes('@media (hover: none)'), 'desktop-only timeline CSS must not carry no-hover device behavior');
assert(!styles.includes('(pointer: coarse)'), 'desktop-only timeline CSS must not carry coarse-pointer behavior');
assert(!styles.includes('touch-action:'), 'desktop-only timeline CSS must not carry touch-action rules');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'timeline reduced-motion behavior is required');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'timeline CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'timeline CSS must not depend on !important');

assertReleasedSuccessionRoutes(['timeline'], assert, 'Succession release manifest');
assert(router.includes("candidate === 'timeline'") && router.includes("normalizeDestination('succession', 'timeline'"), 'legacy global Timeline URLs must redirect to the Succession voyage timeline');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must run the timeline audit');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'the release matrix must render the curated Succession routes, including Timeline');
assert(workflow.includes('set -o pipefail'), 'final visual-QA command must propagate failures through tee');
console.log('Succession Batch 5 timeline audit passed: desktop voyage-only chronology, evidence confidence, synchronized views, shared swimlanes, and reduced motion are registered without restoring the retired global timeline or a narrow-screen duplicate.');
