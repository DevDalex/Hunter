import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 3 closure audit failed: ${message}`);
};

const [app, shell, queens, organizations, royalCss, institutionCss, searchCss, routeManifest, packageJson, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveDeepWorkspaces.jsx'),
  read('src/components/succession/SuccessionArchiveOrganizationWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveRoyalFamilyRedesign.css'),
  read('src/components/succession/SuccessionArchiveInstitutionCommand.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('src/data/routeManifest.js'),
  read('package.json'),
  read('.github/workflows/succession-visual-redesign.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-3.md'),
]);

for (const token of [
  'preserveRoyalTarget',
  "!royalCharacterRoute",
  'succession-royal-hierarchy-workspace',
  '<h1 className="sr-only">Kakin Royal Family</h1>',
  '<FamilyTree spoilerLimit={spoilerLimit}',
  "onNavigate('princes', entity ? { entity: entity.id } : {})",
]) assert(app.includes(token), `dedicated royal routing or direct hierarchy contract is missing ${token}`);

assert(!app.includes('succession-royal-hierarchy-intro'), 'retired Royal Family intro chrome must remain absent');

for (const token of [
  "const hidePageHeader = route.id === 'princes' && routeParams?.view === 'tree';",
  '{!hidePageHeader && <ArchivePageHeader',
]) assert(shell.includes(token), `Royal Family tree header suppression contract is missing ${token}`);

for (const token of [
  'succession-queen-command',
  'succession-queen-status-strip',
  'succession-queen-command__filters',
  'succession-queen-command__grid',
  'succession-queen-intelligence-hero',
  'succession-queen-command-metrics',
  'succession-queen-dossier-nav',
  'succession-queen-authority-board',
  'succession-queen-network',
  'succession-queen-evidence',
  "onNavigate('queens', { entity: queen.id })",
]) assert(queens.includes(token), `queen command contract is missing ${token}`);

for (const token of [
  'InstitutionComparison',
  'succession-institution-command',
  'succession-institution-status-strip',
  'succession-institution-control-deck',
  'succession-institution-grid',
  'succession-institution-hierarchy',
  'succession-institution-comparison',
  'succession-institution-dossier',
  'succession-institution-dossier-nav',
  'succession-institution-chain',
  'succession-institution-operation-grid',
]) assert(organizations.includes(token), `institution command contract is missing ${token}`);

for (const [css, name, selectors] of [
  [royalCss, 'royal family', ['.succession-queen-command__hero', '.succession-queen-card', '.succession-queen-intelligence-hero', '.succession-queen-dossier-nav', '.succession-royal-hierarchy-workspace']],
  [institutionCss, 'institution', ['.succession-institution-command__hero', '.succession-institution-control-deck', '.succession-institution-grid', '.succession-institution-comparison', '.succession-institution-dossier__hero']],
]) {
  for (const selector of selectors) assert(css.includes(selector), `${name} CSS is missing ${selector}`);
  for (const breakpoint of ['@media (max-width: 1100px)', '@media (max-width: 760px)', '@media (max-width: 560px)']) assert(css.includes(breakpoint), `${name} CSS is missing ${breakpoint}`);
  assert(css.includes('@media (hover: none)'), `${name} touch behavior is required`);
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), `${name} reduced-motion behavior is required`);
  assert(css.includes('min-height: 44px'), `${name} controls must retain 44px targets`);
  assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(css), `${name} CSS must not introduce raw hex colors`);
  assert(!css.includes('!important'), `${name} CSS must not depend on !important`);
}

assert(searchCss.includes("@import './SuccessionArchiveRoyalFamilyRedesign.css';"), 'royal family CSS must load through the archive visual chain');
for (const route of ["'princes'", "'queens'", "'organizations'"]) assert(routeManifest.includes(route), `release visual manifest must include ${route}`);
assert(packageJson.includes('"audit:succession-batch-3"'), 'package.json must expose the Batch 3 closure audit');
assert(workflow.includes('audit:succession-batch-3'), 'visual workflow must run the Batch 3 closure audit');
for (const route of ['succession/princes', 'succession/organizations']) assert(workflow.includes(route), `visual workflow must render ${route}`);
for (const hour of ['Hour 32', 'Hour 33', 'Hour 34', 'Hour 35', 'Hour 36']) assert(docs.includes(hour), `design record must document ${hour}`);

console.log('Succession Batch 3 closure audit passed: queen households, dedicated royal routes, direct Royal Family hierarchy, suppressed tree-view intro chrome, institution directory, comparison matrix, dossiers, responsive behavior, touch targets, and reduced motion are registered.');
