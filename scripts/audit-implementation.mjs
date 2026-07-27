import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  IMPLEMENTATION_NOTES_VERSION,
  completionCriteria,
  implementationSections,
  maintenanceMatrix,
  releaseChecklist,
} from '../src/data/implementationNotes.js';
import { archiveDesignSystemStats } from '../src/data/archiveDesignSystem.js';
import { formatPerformanceBudget, performanceBudgets } from '../src/data/performanceBudgets.js';

const assert = (condition, message) => { if (!condition) throw new Error(`Implementation notes audit failed: ${message}`); };
const unique = (values) => new Set(values).size === values.length;
const exactVersion = (value) => /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(String(value || ''));

assert(IMPLEMENTATION_NOTES_VERSION.includes('Cloudflare') && IMPLEMENTATION_NOTES_VERSION.includes('Batch 12') && IMPLEMENTATION_NOTES_VERSION.includes('July 23, 2026'), 'version label must identify the current Cloudflare and Batch 12 maintenance contract');
assert(implementationSections.length >= 9 && unique(implementationSections.map((item) => item.id)), 'nine unique implementation sections are required after Batch 12');
assert(implementationSections.every((item) => item.title && item.summary && item.owner && item.files.length >= 3 && item.decisions.length >= 3 && item.checks.length >= 3), 'every section needs a complete owner, decision, file, and verification contract');
assert(maintenanceMatrix.length >= 13 && unique(maintenanceMatrix.map((item) => item.id)), 'thirteen unique maintenance runbooks are required after Batch 12');
assert(releaseChecklist.length >= 5 && releaseChecklist.every((group) => group.items.length >= 3), 'the release checklist must cover five areas with at least three checks each');
assert(completionCriteria.length >= 8, 'the completion contract must keep eight criteria');

const architecture = implementationSections.find((item) => item.id === 'architecture');
const designSystem = implementationSections.find((item) => item.id === 'design-system');
const performance = implementationSections.find((item) => item.id === 'performance');
const release = implementationSections.find((item) => item.id === 'release');
const runbooks = implementationSections.find((item) => item.id === 'runbooks');
const performanceCopy = performance?.checks.join(' ') || '';
const designCopy = designSystem?.checks.join(' ') || '';
const documentedCodeBudgets = [
  performanceBudgets.entryJs,
  performanceBudgets.startupJs,
  performanceBudgets.startupCss,
  performanceBudgets.javascriptChunk,
];

assert(architecture?.decisions.some(([name]) => name === 'Clean history routes'), 'architecture notes must describe the clean-history route model');
assert(designSystem?.files.includes('src/components/ArchiveUI.jsx') && designSystem.files.includes('src/styles/archive-system.css'), 'design-system notes must name the canonical component and CSS owners');
assert(designCopy.includes(`${archiveDesignSystemStats.primitives} primitives`) && designCopy.includes(`${archiveDesignSystemStats.semanticTones} tones`), 'design-system notes must match the canonical primitive and tone counts');
assert(documentedCodeBudgets.every((value) => performanceCopy.includes(`${formatPerformanceBudget(value)} bytes`)), 'visible performance notes must match the canonical executable budgets');
assert(performanceCopy.includes('Twenty-one dynamic entries'), 'performance notes must match the current 21-entry dynamic split');
assert(release?.checks.join(' ').includes('All fifteen independent pre-build audits pass'), 'release notes must match the current 15-audit preflight');
assert(runbooks?.decisions.some(([name]) => name === 'Aggregate preflight'), 'runbook notes must document aggregate build preflight');

for (const item of maintenanceMatrix) await access(path.resolve(item.canonical));

const [handbook, readme, preflightDoc, preflight, packageText, designDoc] = await Promise.all([
  readFile(path.resolve('public/implementation-notes.md'), 'utf8'),
  readFile(path.resolve('README.md'), 'utf8'),
  readFile(path.resolve('docs/BUILD-PREFLIGHT.md'), 'utf8'),
  readFile(path.resolve('scripts/run-build-preflight.mjs'), 'utf8'),
  readFile(path.resolve('package.json'), 'utf8'),
  readFile(path.resolve('docs/DESIGN-SYSTEM.md'), 'utf8'),
]);
const packageJson = JSON.parse(packageText);

for (const heading of ['Architecture', 'Content schema', 'Source and evidence contract', 'Batch 12 design system', 'Media and status rules', 'Accessibility and responsive behavior', 'Performance boundaries', 'Aggregate build preflight', 'Update runbooks', 'Release checklist', 'Completion criteria']) {
  assert(handbook.includes(`## ${heading}`), `handbook is missing “${heading}”`);
}
for (const item of maintenanceMatrix) assert(handbook.includes(item.canonical), `handbook is missing canonical path ${item.canonical}`);

const currentContractPhrases = [
  '26 reader-facing screens',
  '106 character portraits and 29 Black Whale derivatives',
  '21 dynamic entries',
  '15 independent pre-build audits',
  'Cloudflare Worker',
  'dist/server/index.js',
  'dist/client/',
  'src/data/performanceBudgets.js',
  'src/data/archiveDesignSystem.js',
  'src/components/ArchiveUI.jsx',
  'src/styles/archive-system.css',
];
for (const phrase of currentContractPhrases) {
  assert(handbook.includes(phrase), `handbook is missing current contract phrase “${phrase}”`);
  assert(readme.includes(phrase) || phrase === '106 character portraits and 29 Black Whale derivatives', `README is missing current contract phrase “${phrase}”`);
}
for (const value of documentedCodeBudgets) {
  const phrase = `${formatPerformanceBudget(value)} bytes`;
  assert(handbook.includes(phrase), `handbook is missing canonical performance budget ${phrase}`);
  assert(readme.includes(phrase), `README is missing canonical performance budget ${phrase}`);
}

for (const phrase of ['15 independent pre-build audits', 'Story → Reference → Characters → Final', 'Final → Governance → Design System → Schema', 'Cloudflare release audit', 'audit:performance']) {
  assert(preflightDoc.includes(phrase), `preflight runbook is missing “${phrase}”`);
}
for (const phrase of ['Batch 12', 'ArchiveSection', 'ArchiveCard', 'EvidenceBadge', 'SourceStack']) {
  assert(designDoc.includes(phrase), `design-system doc is missing “${phrase}”`);
}

const preflightScripts = [...preflight.matchAll(/^\s*'audit:[^']+',?$/gm)].map((match) => match[0]);
assert(preflightScripts.length === 15, `aggregate preflight must list 15 audits, found ${preflightScripts.length}`);
assert(preflight.includes("'audit:design-system'"), 'aggregate preflight must include audit:design-system');
assert(packageJson.scripts?.check === 'npm run foundation:check && npm run generate:build-info && npm run preflight:build', 'check must run the foundation gate, generate build identity, and run aggregate preflight');
assert(packageJson.scripts?.['foundation:check'] === 'npm run quality:foundation && npm run typecheck && npm run test:unit && npm run media:verify', 'foundation:check must compose formatting, typing, unit tests, and media validation');
assert(packageJson.scripts?.['build:runtime']?.includes('vite build') && packageJson.scripts['build:runtime'].includes('audit:release'), 'build:runtime must build and audit the Cloudflare artifact');
assert(packageJson.scripts?.['build:runtime']?.includes('media:build') && packageJson.scripts['build:runtime'].includes('media:verify'), 'build:runtime must generate and verify canonical media variants');
assert(packageJson.scripts?.build === 'npm run check && npm run build:runtime', 'build must compose check and build:runtime');
assert(packageJson.scripts?.['qa:browser:ci'] === 'npm run generate:build-info && npm run build:runtime && npm run qa:browser:verify', 'browser CI must build the runtime without duplicating aggregate preflight');
assert(packageJson.scripts?.['qa:browser'] === 'npm run build && npm run qa:browser:verify', 'local browser QA must retain the full build gate');
assert(packageJson.scripts?.deploy === 'npm run build && wrangler deploy', 'deploy must use the repository-pinned Wrangler command');
assert(packageJson.scripts?.['audit:design-system'] === 'node scripts/audit-design-system.mjs', 'package.json must expose audit:design-system');

for (const [name, version] of Object.entries({ ...packageJson.dependencies, ...packageJson.devDependencies })) {
  assert(exactVersion(version), `${name} must use an exact pinned version rather than ${version}`);
}
for (const requiredTool of ['@biomejs/biome', '@playwright/test', '@testing-library/react', '@testing-library/user-event', '@vitejs/plugin-react', 'typescript', 'vite', 'vitest', 'playwright', 'axe-core', 'knip', 'sharp', 'wrangler']) {
  assert(exactVersion(packageJson.devDependencies?.[requiredTool]), `${requiredTool} must be an exact devDependency`);
}
assert(exactVersion(packageJson.dependencies?.zod), 'zod must be an exact runtime dependency');
assert(!packageJson.dependencies?.sharp, 'sharp must remain build-only and outside the production dependency surface');

console.log(`Implementation notes audit passed: ${implementationSections.length} system sections; ${maintenanceMatrix.length} runbooks; ${releaseChecklist.reduce((total, group) => total + group.items.length, 0)} release checks; ${completionCriteria.length} completion criteria; foundation quality gate; 15-audit aggregate preflight; split runtime/browser CI; pinned toolchain; build-only Sharp media processing; route, media, design-system, performance-budget, and Cloudflare contracts synchronized.`);
