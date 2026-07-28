import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 final audit failed: ${message}`);
};

const [
  shell,
  primitives,
  finalStyles,
  searchStyles,
  assignmentCompatibility,
  assignmentStyles,
  routeManifest,
  workflow,
  packageJson,
  finalDocs,
  debtDocs,
] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/components/succession/SuccessionArchiveFinalPolish.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('src/components/succession/SuccessionArchiveAssignmentWorkspace.css'),
  read('src/components/succession/SuccessionArchiveAssignmentCommand.css'),
  read('src/data/routeManifest.js'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('package.json'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-FINAL-AUDIT.md'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-NONCRITICAL-DEBT.md'),
]);

for (const token of [
  'contentRef',
  'previousRouteRef',
  'aria-live="polite"',
  'workspace loaded. Reading boundary Chapter',
  'role="region"',
  'aria-label={`${route.label} workspace content`}',
  'focus({ preventScroll: true })',
  'restoreMenuFocus',
]) assert(shell.includes(token), `archive shell is missing ${token}`);

for (const token of [
  'useRef',
  'tabIndex={selected ? 0 : -1}',
  "['ArrowLeft', 'ArrowRight', 'Home', 'End']",
  'aria-controls',
  'requestAnimationFrame',
]) assert(primitives.includes(token), `shared archive tabs are missing ${token}`);

for (const token of [
  '--succession-motion-instant',
  'touch-action: manipulation',
  'content-visibility: auto',
  'contain-intrinsic-size',
  'scrollbar-gutter: stable',
  '@media (hover: hover) and (pointer: fine)',
  '@media (hover: none), (pointer: coarse)',
  '@media (prefers-reduced-motion: reduce)',
  '@media (prefers-contrast: more)',
  '@media (forced-colors: active)',
  '@media print',
]) assert(finalStyles.includes(token), `final interaction layer is missing ${token}`);
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(finalStyles), 'final interaction CSS must not introduce raw hex colors');
assert(!finalStyles.includes('!important'), 'final interaction CSS must not depend on !important');
assert(searchStyles.includes("@import './SuccessionArchiveFinalPolish.css';"), 'final interaction layer must load through the Succession style chain');
assert(searchStyles.indexOf("@import './SuccessionArchiveFinalPolish.css';") > searchStyles.indexOf("@import './SuccessionArchiveBlackWhaleCommand.css';"), 'final interaction layer must load after route compatibility layers');
assert(!searchStyles.includes("@import './SuccessionArchiveAssignmentCommand.css';"), 'Assignment command must not load twice');
assert(assignmentCompatibility.trim().endsWith("@import './SuccessionArchiveAssignmentCommand.css';"), 'Assignment compatibility file must import the command layer');
assert(!assignmentCompatibility.includes('.succession-canonical-assignments {'), 'obsolete Assignment declarations must be removed');
assert(assignmentStyles.includes('.succession-assignment-table') && assignmentStyles.includes('.succession-assignment-ledger'), 'advanced Assignment result modes must remain registered');

for (const route of ['story', 'chapters', 'events', 'timeline', 'characters', 'princes', 'queens', 'bodyguards', 'organizations', 'relationships', 'locations', 'black-whale', 'nen', 'guardian-spirit-beasts', 'research']) {
  assert(routeManifest.includes(`'${route}'`), `release matrix is missing ${route}`);
}
assert(routeManifest.includes('successionReleaseRoutes'), 'release matrix must export the curated Succession routes');

for (const token of [
  'node scripts/audit-succession-batch-5-final.mjs',
  'npm run audit:layout',
  'npm run audit:performance',
  'npm run qa:succession-final-release',
  'npm run qa:succession-cross-browser',
  'playwright install --with-deps chromium firefox webkit',
]) assert(workflow.includes(token), `final workflow is missing ${token}`);

for (const token of [
  'audit:succession-batch-5-final',
  'qa:succession-final-release',
  'qa:succession-cross-browser',
]) assert(packageJson.includes(token), `package scripts are missing ${token}`);

for (const hour of ['Hour 59', 'Hour 60', 'Hour 61', 'Hour 62', 'Hour 63', 'Hour 64']) {
  assert(finalDocs.includes(hour), `final audit record must document ${hour}`);
}
for (const heading of ['Data and evidence boundaries', 'Media constraints', 'Compatibility constraints', 'Integration status', 'Maintenance guidance']) {
  assert(debtDocs.includes(heading), `non-critical debt record is missing ${heading}`);
}

console.log('Succession Batch 5 final audit passed: interaction states, keyboard tabs, route focus, live announcements, reduced motion, forced colors, containment, legacy cleanup, full release routes, performance, cross-browser QA, final audit, and debt documentation are registered. SafeImage behavior is enforced by unit and browser tests rather than source-string matching.');
