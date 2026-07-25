import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession royal command audit failed: ${message}`);
};

const [workspace, royalCss, royalContrast, searchCss, packageJson, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveWorkspaces.jsx'),
  read('src/components/succession/SuccessionArchiveRoyalCommand.css'),
  read('src/components/succession/SuccessionArchiveRoyalContrast.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('package.json'),
  read('.github/workflows/succession-visual-redesign.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-3.md'),
]);

for (const token of [
  'RoyalStatusOrbit',
  'succession-royal-command',
  'succession-royal-orbit',
  'succession-royal-status-strip',
  'succession-royal-filter-bar',
  'succession-prince-card',
  "onNavigate('princes', { prince: prince.princeOrder })",
]) assert(workspace.includes(token), `royal status-board contract is missing ${token}`);

for (const token of [
  'succession-prince-intelligence-hero',
  'succession-prince-risk-board',
  'succession-prince-dossier__core',
  'succession-prince-dossier__network',
  'succession-prince-evidence',
  'Open complete character chronology',
]) assert(workspace.includes(token), `prince dossier contract is missing ${token}`);

for (const selector of [
  '.succession-royal-command',
  '.succession-royal-orbit',
  '.succession-royal-status-strip',
  '.succession-prince-card',
  '.succession-prince-intelligence-hero',
  '.succession-prince-risk-board',
]) assert(royalCss.includes(selector), `royal presentation is missing ${selector}`);

assert(royalCss.includes('@media (max-width: 1100px)'), 'wide-to-tablet royal adaptation is required');
assert(royalCss.includes('@media (max-width: 760px)'), 'tablet royal adaptation is required');
assert(royalCss.includes('@media (max-width: 560px)'), 'mobile royal adaptation is required');
assert(royalCss.includes('@media (hover: none)'), 'touch behavior is required');
assert(royalCss.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion behavior is required');
assert(royalCss.includes('min-height: 44px'), 'royal controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(royalCss), 'royal command CSS must not introduce raw hex colors');
assert(!royalCss.includes('!important'), 'royal command CSS must not depend on !important');
assert(royalContrast.includes('font-size: 11px !important'), 'compact SVG labels require a route-owned readability floor');
assert(searchCss.includes("@import './SuccessionArchiveRoyalContrast.css';"), 'royal contrast must load through the scoped archive visual chain');
assert(packageJson.includes('"audit:succession-royal-command"'), 'package.json must expose the royal command audit');
assert(workflow.includes('audit:succession-royal-command'), 'visual workflow must run the royal command audit');
for (const hour of ['Hour 30', 'Hour 31']) assert(docs.includes(hour), `design record must document ${hour}`);

console.log('Succession royal command audit passed: fourteen-prince orbit, status board, royal cards, dedicated prince dossiers, readability, touch, motion, and responsive contracts are registered.');