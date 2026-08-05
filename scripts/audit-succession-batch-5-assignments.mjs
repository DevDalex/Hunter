import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 assignment audit failed: ${message}`);
};

const [workspace, styles, compatibilityStyles, searchStyles, workflow, finalQa, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveAssignmentWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveAssignmentCommand.css'),
  read('src/components/succession/SuccessionArchiveAssignmentWorkspace.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-5.md'),
]);

for (const token of [
  'succession-assignment-command',
  'succession-assignment-command__metrics',
  'succession-assignment-type-board',
  'succession-assignment-result-command',
  'succession-assignment-active-filters',
  'AssignmentTable',
  'AssignmentLedgerRow',
  "const [scope",
  "const [sortBy",
  "const [viewMode",
  'Complete archive',
  'Active at Chapter',
  'Show all active records',
  'Command and obligation',
  'Evidence record',
]) assert(workspace.includes(token), `assignment workspace is missing ${token}`);

for (const selector of [
  '.succession-assignment-command',
  '.succession-assignment-command__signal',
  '.succession-assignment-command__metrics',
  '.succession-assignment-type-board',
  '.succession-assignment-filter-panel',
  '.succession-assignment-result-command',
  '.succession-assignment-directory',
  '.succession-assignment-table-wrap',
  '.succession-assignment-table',
  '.succession-assignment-ledger',
  '.succession-assignment-dossier',
  '.succession-assignment-snapshot-board',
  '.succession-assignment-personnel',
]) assert(styles.includes(selector), `assignment visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1180px)', '@media (max-width: 900px)', '@media (max-width: 680px)', '@media (max-width: 480px)']) {
  assert(styles.includes(breakpoint), `assignment CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'assignment CSS must define touch behavior');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'assignment CSS must define reduced-motion behavior');
assert(styles.includes('min-height: 44px'), 'assignment controls must retain 44px touch targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'assignment command CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'assignment command CSS must not depend on !important');
assert(compatibilityStyles.trim().endsWith("@import './SuccessionArchiveAssignmentCommand.css';"), 'legacy Assignment CSS must remain an import-only compatibility shim');
assert(!compatibilityStyles.includes('.succession-canonical-assignments {'), 'legacy Assignment declarations must be removed');
assert(!searchStyles.includes("@import './SuccessionArchiveAssignmentCommand.css';"), 'Assignment command must not be loaded twice through the shared search stylesheet');
assert(searchStyles.includes("@import './SuccessionArchiveFinalPolish.css';"), 'the final shared interaction layer must load last');
assertReleasedSuccessionRoutes(['bodyguards'], assert, 'release visual manifest');
assert(workflow.includes('node scripts/audit-succession-batch-5-assignments.mjs'), 'Batch 5 workflow must run the assignment audit');
assert(workflow.includes('npm run qa:succession-final-release'), 'Batch 5 workflow must run the complete release matrix');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'complete release matrix must render the curated Succession routes, including Assignments');
for (const hour of ['Hour 57', 'Hour 58']) assert(docs.includes(hour), `Batch 5 design record must document ${hour}`);

console.log('Succession Batch 5 assignment audit passed: operational command, snapshot scope, compound filters, sorting, cards, advanced table, compact ledger, pagination, personnel snapshots, dossiers, legacy cleanup, consolidated release QA, responsive behavior, touch targets, and reduced motion are registered.');
