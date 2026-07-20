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

assert(IMPLEMENTATION_NOTES_VERSION.includes('Phase 6F'), 'version label must retain the Phase 6F handoff history');
assert(IMPLEMENTATION_NOTES_VERSION.includes('Batch 12') && IMPLEMENTATION_NOTES_VERSION.includes('July 20, 2026'), 'version label must identify the current Batch 12 maintenance contract');
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
assert(performanceCopy.includes('Twenty-two dynamic entries'), 'performance notes must match the current 22-entry dynamic split');
assert(release?.checks.join(' ').includes('All fifteen independent pre-build audits pass'), 'release notes must match the current 15-audit preflight');
assert(runbooks?.decisions.some(([name]) => name === 'Aggregate preflight'), 'runbook notes must document aggregate build preflight');

for (const item of maintenanceMatrix) await access(path.resolve(item.canonical));

const [handbook, readme, preflightDoc, preflight, packageJson, designDoc] = await Promise.all([
  readFile(path.resolve('public/implementation-notes.md'), 'utf8'),
  readFile(path.resolve('README.md'), 'utf8'),
  readFile(path.resolve('docs/BUILD-PREFLIGHT.md'), 'utf8'),
  readFile(path.resolve('scripts/run-build-preflight.mjs'), 'utf8'),
  readFile(path.resolve('package.json'), 'utf8'),
  readFile(path.resolve('docs/DESIGN-SYSTEM.md'), 'utf8'),
]);

for (const heading of ['Architecture', 'Content schema', 'Source and evidence contract', 'Batch 12 design system', 'Media and status rules', 'Accessibility and responsive behavior', 'Performance boundaries', 'Aggregate build preflight', 'Update runbooks', 'Release checklist', 'Completion criteria']) {
  assert(handbook.includes(`## ${heading}`), `handbook is missing “${heading}”`);
}
for (const item of maintenanceMatrix) assert(handbook.includes(item.canonical), `handbook is missing canonical path ${item.canonical}`);

const currentContractPhrases = [
  '26 reader-facing screens',
  '106 character portraits and 29 Black Whale derivatives',
  '22 dynamic entries',
  '15 independent pre-build audits',
  'hxh-archive-phase-8a-sites-source.zip',
  'architecture/',
  'docs/',
  '.github/',
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

for (const phrase of ['15 independent pre-build audits', 'Story → Reference → Characters → Final', 'Final → Governance → Design System → Schema', 'package:release', 'audit:performance']) {
  assert(preflightDoc.includes(phrase), `preflight runbook is missing “${phrase}”`);
}
for (const phrase of ['Batch 12', 'ArchiveSection', 'ArchiveCard', 'EvidenceBadge', 'SourceStack']) {
  assert(designDoc.includes(phrase), `design-system doc is missing “${phrase}”`);
}

const preflightScripts = [...preflight.matchAll(/^\s*'audit:[^']+',?$/gm)].map((match) => match[0]);
assert(preflightScripts.length === 15, `aggregate preflight must list 15 audits, found ${preflightScripts.length}`);
assert(preflight.includes("'audit:design-system'"), 'aggregate preflight must include audit:design-system');
assert(packageJson.includes('"preflight:build"') && packageJson.includes('npm run generate:build-info && npm run preflight:build'), 'package build must invoke aggregate preflight immediately after build identity generation');
assert(packageJson.includes('"audit:design-system"') && packageJson.includes('node scripts/audit-design-system.mjs'), 'package.json must expose audit:design-system');

console.log(`Implementation notes audit passed: ${implementationSections.length} system sections; ${maintenanceMatrix.length} runbooks; ${releaseChecklist.reduce((total, group) => total + group.items.length, 0)} release checks; ${completionCriteria.length} completion criteria; 15-audit aggregate preflight; route, media, design-system, canonical performance-budget, and package contracts synchronized.`);
