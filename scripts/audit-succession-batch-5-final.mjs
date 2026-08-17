import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  assertReleasedSuccessionRoutes,
  canonicalTargetForSuccessionRoute,
} from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 5 final audit failed: ${message}`);
};

const [
  shell,
  primitives,
  safeImage,
  finalStyles,
  searchStyles,
  assignmentCompatibility,
  assignmentStyles,
  workflow,
  packageJson,
  finalDocs,
  debtDocs,
] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/components/SafeImage.jsx'),
  read('src/components/succession/SuccessionArchiveFinalPolish.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('src/components/succession/SuccessionArchiveAssignmentWorkspace.css'),
  read('src/components/succession/SuccessionArchiveAssignmentCommand.css'),
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
]) assert(shell.includes(token), `archive shell is missing ${token}`);

assert(!shell.includes('succession-archive__mobile-bar'), 'desktop-only archive shell must not restore a narrow-screen command bar');
assert(!shell.includes('succession-drawer'), 'desktop-only archive shell must not restore drawer navigation');
assert(!shell.includes('succession-mobile-navigation'), 'desktop-only archive shell must not restore alternate narrow-screen navigation');

for (const token of [
  'useRef',
  'tabIndex={selected ? 0 : -1}',
  "['ArrowLeft', 'ArrowRight', 'Home', 'End']",
  'aria-controls',
  'requestAnimationFrame',
]) assert(primitives.includes(token), `shared archive tabs are missing ${token}`);

for (const token of [
  "loading = 'lazy'",
  'IntersectionObserver',
  'decoding="async"',
  "priority || (eager ? 'high' : 'auto')",
  'width={media?.width || undefined}',
  'height={media?.height || undefined}',
  'safe-image-placeholder',
]) assert(safeImage.includes(token), `SafeImage stability contract is missing ${token}`);

for (const token of [
  '--succession-motion-instant',
  'content-visibility: auto',
  'contain-intrinsic-size',
  'scrollbar-gutter: stable',
  '@media (hover: hover) and (pointer: fine)',
  '@media (prefers-reduced-motion: reduce)',
  '@media (prefers-contrast: more)',
  '@media (forced-colors: active)',
  '@media print',
]) assert(finalStyles.includes(token), `final desktop interaction layer is missing ${token}`);

assert(!finalStyles.includes('touch-action:'), 'desktop-only interaction layer must not carry touch-action rules');
assert(!finalStyles.includes('-webkit-tap-highlight-color'), 'desktop-only interaction layer must not carry tap-highlight rules');
assert(!finalStyles.includes('(pointer: coarse)'), 'desktop-only interaction layer must not carry coarse-pointer behavior');
assert(!finalStyles.includes('(hover: none)'), 'desktop-only interaction layer must not carry no-hover device behavior');
assert(!finalStyles.includes('@media (max-width:'), 'desktop-only interaction layer must not carry narrow-width responsive branches');
assert(!finalStyles.includes('succession-drawer'), 'desktop-only interaction layer must not carry drawer selectors');
assert(!finalStyles.includes('succession-archive__mobile-bar'), 'desktop-only interaction layer must not carry narrow-screen bar selectors');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(finalStyles), 'final interaction CSS must not introduce raw hex colors');
assert(!finalStyles.includes('!important'), 'final interaction CSS must not depend on !important');
assert(searchStyles.includes("@import './SuccessionArchiveFinalPolish.css';"), 'final interaction layer must load through the Succession style chain');
assert(searchStyles.indexOf("@import './SuccessionArchiveFinalPolish.css';") > searchStyles.indexOf("@import './SuccessionArchiveBlackWhaleCommand.css';"), 'final interaction layer must load after route compatibility layers');
assert(!searchStyles.includes("@import './SuccessionArchiveAssignmentCommand.css';"), 'Assignment command must not load twice');
assert(assignmentCompatibility.trim().endsWith("@import './SuccessionArchiveAssignmentCommand.css';"), 'Assignment compatibility file must import the command layer');
assert(!assignmentCompatibility.includes('.succession-canonical-assignments {'), 'obsolete Assignment declarations must be removed');
assert(assignmentStyles.includes('.succession-assignment-table') && assignmentStyles.includes('.succession-assignment-ledger'), 'advanced Assignment result modes must remain registered');

assertReleasedSuccessionRoutes([
  'story',
  'chapters',
  'events',
  'timeline',
  'characters',
  'princes',
  'bodyguards',
  'organizations',
  'relationships',
  'locations',
  'black-whale',
  'nen',
  'guardian-spirit-beasts',
  'research',
], assert, 'release matrix');
assert(canonicalTargetForSuccessionRoute('queens') === 'princes', 'Queens compatibility route must canonically resolve to Princes');

for (const token of [
  'node scripts/audit-succession-batch-5-final.mjs',
  'npm run audit:layout',
  'npm run audit:performance',
  'npm run qa:succession-final-release',
  'npm run qa:succession-cross-browser',
  'playwright install --with-deps chromium',
  'playwright install --with-deps firefox webkit',
]) assert(workflow.includes(token), `final workflow is missing ${token}`);
assert(!workflow.includes('ACCESSIBILITY_QA_VIEWPORT: mobile'), 'Batch 5 workflow must not restore a phone viewport probe');
assert(!workflow.includes('Probe mobile'), 'Batch 5 workflow must not restore a mobile-only probe');
assert(
  workflow.indexOf('playwright install --with-deps chromium') < workflow.indexOf('npm run qa:succession-final-release')
    && workflow.indexOf('npm run qa:succession-final-release') < workflow.indexOf('playwright install --with-deps firefox webkit')
    && workflow.indexOf('playwright install --with-deps firefox webkit') < workflow.indexOf('npm run qa:succession-cross-browser'),
  'browser installation must fail fast through desktop Chromium before the desktop Firefox/WebKit regression stage',
);

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

console.log('Succession Batch 5 final audit passed: desktop-only interaction states, keyboard tabs, route focus, live announcements, reduced motion, forced colors, containment, image stability, legacy cleanup, canonical release routes, performance, staged desktop cross-browser QA, final audit, and debt documentation are registered.');
