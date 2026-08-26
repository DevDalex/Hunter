import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 5 relationship audit failed: ${message}`); };

const [workspace, styles, workflow, finalQa, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveRelationshipWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveRelationshipCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-5.md'),
]);

for (const token of ['radialPosition','RelationshipNetworkGraph','AccessibleRelationshipList','globalGraphNodes','focusedGraphNodes','succession-relationship-network__canvas','succession-relationship-accessible','Highest-connectivity network','Every drawn edge as text','Direction and meaning never depend on line position or color']) assert(workspace.includes(token), `relationship workspace is missing ${token}`);
for (const selector of ['.succession-canonical-relationships__hero','.succession-relationship-filter-panel','.succession-relationship-view-switcher','.succession-relationship-connectivity','.succession-relationship-network','.succession-relationship-network__canvas','.succession-relationship-network__node','.succession-relationship-network__legend','.succession-relationship-accessible','.succession-relationship-directory','.succession-relationship-node-snapshot','.succession-relationship-dossier']) assert(styles.includes(selector), `relationship visual system is missing ${selector}`);

assert(!styles.includes('@media (max-width:'), 'desktop-only relationship CSS must not carry narrow-width breakpoint layouts');
assert(!styles.includes('@media (hover: none)'), 'desktop-only relationship CSS must not carry no-hover device behavior');
assert(!styles.includes('(pointer: coarse)'), 'desktop-only relationship CSS must not carry coarse-pointer behavior');
assert(!styles.includes('touch-action:'), 'desktop-only relationship CSS must not carry touch-action rules');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'relationship reduced-motion behavior is required');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'relationship CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'relationship CSS must not depend on !important');
assertReleasedSuccessionRoutes(['relationships'], assert, 'release visual manifest');
assert(workflow.includes('node scripts/audit-succession-batch-5-relationships.mjs'), 'Batch 5 workflow must run the relationship audit');
assert(workflow.includes('npm run qa:succession-final-release'), 'Batch 5 workflow must run the complete release matrix');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'complete release matrix must render the curated Succession routes, including Relationships');
for (const hour of ['Hour 53','Hour 54']) assert(docs.includes(hour), `Batch 5 design record must document ${hour}`);
console.log('Succession Batch 5 relationship audit passed: desktop chapter-sensitive network, directed edge rendering, focused neighborhoods, semantic edge alternatives, dossier views, consolidated release QA, and reduced motion are registered.');
