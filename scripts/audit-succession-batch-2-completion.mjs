import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 2 completion audit failed: ${message}`);
};

const [shell, primitives, spoiler, app, completionCss, releasePatch, searchCss, packageJson, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/components/SpoilerControl.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveBatch2Completion.css'),
  read('src/components/succession/SuccessionFinalReleasePatch.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('package.json'),
  read('.github/workflows/succession-visual-redesign.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-2-CLOSURE.md'),
]);

for (const token of [
  'successionArchiveHubGroups.map',
  'successionArchiveHubs.filter',
  "aria-current={active ? 'page' : undefined}",
  'succession-desktop-navigation',
  'succession-mobile-navigation',
  'function SuccessionHubTabs',
  'className="succession-hub-tabs"',
  'data-archive-hub={activeHub.id}',
]) assert(shell.includes(token), `consolidated navigation contract is missing ${token}`);

for (const token of [
  'className="succession-tabs"',
  'role="tablist"',
  'role="tab"',
  'aria-selected={selected}',
  'tabIndex={selected ? 0 : -1}',
]) assert(primitives.includes(token), `record-local navigation contract is missing ${token}`);

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
]) assert(app.includes(token), `shared search presentation is missing ${token}`);

for (const selector of [
  '.succession-archive-nav',
  '.succession-tabs',
  '.spoiler-control__navigation',
  '.succession-search-complete > label',
]) assert(completionCss.includes(selector), `completion CSS is missing ${selector}`);

for (const selector of [
  '.succession-hub-tabs',
  '.succession-hub-tabs a',
  '.succession-hub-tabs a.is-active',
]) assert(releasePatch.includes(selector), `consolidated hub CSS is missing ${selector}`);

assert(completionCss.includes('@media (max-width: 1100px)'), 'desktop-to-tablet responsive closure is required');
assert(completionCss.includes('@media (max-width: 860px)'), 'archive shell mobile breakpoint is required');
assert(completionCss.includes('@media (max-width: 620px)'), 'compact mobile breakpoint is required');
assert(completionCss.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion closure is required');
assert(completionCss.includes('min-height: 44px'), 'interactive mobile controls must retain 44px targets');
assert(releasePatch.includes('min-height: 44px'), 'consolidated hub controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(completionCss), 'Batch 2 completion CSS must not introduce raw hex colors');
assert(!completionCss.includes('!important'), 'Batch 2 completion CSS must not depend on !important');

const expectedImport = "@import './SuccessionArchiveBatch2Completion.css';";
assert(searchCss.includes(expectedImport), 'Batch 2 completion CSS must load through the scoped archive entry chain');
assert(packageJson.includes('"audit:succession-batch-2"'), 'package.json must expose the Batch 2 audit');
assert(workflow.includes('audit:succession-batch-2'), 'visual workflow must run the Batch 2 audit');
for (const hour of ['Hour 18', 'Hour 19', 'Hour 20', 'Hour 21', 'Hour 22', 'Hour 23', 'Hour 24']) {
  assert(docs.includes(hour), `design record must document ${hour}`);
}
assert(docs.includes('Batch 2 closure gate'), 'design record must include the Batch 2 closure gate');

console.log('Succession Batch 2 completion audit passed: consolidated hub navigation, keyboard-complete record tabs, chapter controls, search, and responsive closure are registered.');
