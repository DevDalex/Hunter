import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 2 completion audit failed: ${message}`);
};

const [shell, primitives, spoiler, app, completionCss, searchCss, packageJson, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/components/SpoilerControl.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveBatch2Completion.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('package.json'),
  read('.github/workflows/succession-visual-redesign.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN.md'),
]);

for (const token of [
  'successionArchiveGroups.map',
  'aria-current={active ? \'page\' : undefined}',
  'succession-desktop-navigation',
  'succession-mobile-navigation',
]) assert(shell.includes(token), `main navigation contract is missing ${token}`);

for (const token of [
  'className="succession-tabs"',
  'role="tablist"',
  'role="tab"',
  'aria-selected={item.id === activeId}',
]) assert(primitives.includes(token), `local navigation contract is missing ${token}`);

for (const token of [
  'data-boundary-state',
  'spoiler-control__fields',
  'spoiler-control__navigation',
  'spoiler-control__release-note',
  'Latest authorized',
]) assert(spoiler.includes(token), `chapter-boundary presentation is missing ${token}`);

for (const token of [
  'succession-search-complete__groups',
  'succession-directory__tools',
  'id="succession-entry-points"',
  'succession-home-grid',
  'succession-data-health',
  'succession-route-matrix',
]) assert(app.includes(token), `shared search or landing presentation is missing ${token}`);

for (const selector of [
  '.succession-archive-nav',
  '.succession-tabs',
  '.spoiler-control__navigation',
  '.succession-search-complete > label',
  '#succession-entry-points',
  '.succession-data-health',
  '.succession-route-matrix',
]) assert(completionCss.includes(selector), `completion CSS is missing ${selector}`);

assert(completionCss.includes('@media (max-width: 1100px)'), 'desktop-to-tablet responsive closure is required');
assert(completionCss.includes('@media (max-width: 860px)'), 'archive shell mobile breakpoint is required');
assert(completionCss.includes('@media (max-width: 620px)'), 'compact mobile breakpoint is required');
assert(completionCss.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion closure is required');
assert(completionCss.includes('min-height: 44px'), 'interactive mobile controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(completionCss), 'Batch 2 completion CSS must not introduce raw hex colors');
assert(!completionCss.includes('!important'), 'Batch 2 completion CSS must not depend on !important');

const expectedImport = "@import './SuccessionArchiveBatch2Completion.css';";
assert(searchCss.includes(expectedImport), 'Batch 2 completion CSS must load through the scoped archive entry chain');
assert(packageJson.includes('"audit:succession-batch-2"'), 'package.json must expose the Batch 2 audit');
assert(workflow.includes('audit:succession-batch-2'), 'visual workflow must run the Batch 2 audit');
for (const hour of ['Hour 18', 'Hour 19', 'Hour 20', 'Hour 21', 'Hour 22', 'Hour 23', 'Hour 24']) {
  assert(docs.includes(hour), `design record must document ${hour}`);
}
assert(docs.includes('Batch 2 closure'), 'design record must include the Batch 2 closure gate');

console.log('Succession Batch 2 completion audit passed: navigation, tabs, chapter controls, search, landing experience, and responsive closure are registered.');
