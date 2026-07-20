import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  IMPLEMENTATION_NOTES_VERSION,
  completionCriteria,
  implementationSections,
  maintenanceMatrix,
  releaseChecklist,
} from '../src/data/implementationNotes.js';

const assert = (condition, message) => { if (!condition) throw new Error(`Implementation notes audit failed: ${message}`); };
const unique = (values) => new Set(values).size === values.length;

assert(IMPLEMENTATION_NOTES_VERSION.includes('Phase 6F'), 'version label must retain the Phase 6F handoff history');
assert(IMPLEMENTATION_NOTES_VERSION.includes('Batch 11') && IMPLEMENTATION_NOTES_VERSION.includes('July 20, 2026'), 'version label must identify the current Batch 11 maintenance contract');
assert(implementationSections.length === 8 && unique(implementationSections.map((item) => item.id)), 'eight unique implementation sections are required');
assert(implementationSections.every((item) => item.title && item.summary && item.owner && item.files.length >= 3 && item.decisions.length >= 3 && item.checks.length >= 3), 'every section needs a complete owner, decision, file, and verification contract');
assert(maintenanceMatrix.length >= 12 && unique(maintenanceMatrix.map((item) => item.id)), 'twelve unique maintenance runbooks are required');
assert(releaseChecklist.length >= 5 && releaseChecklist.every((group) => group.items.length >= 3), 'the release checklist must cover five areas with at least three checks each');
assert(completionCriteria.length >= 8, 'the completion contract must keep eight criteria');

const architecture = implementationSections.find((item) => item.id === 'architecture');
const performance = implementationSections.find((item) => item.id === 'performance');
const release = implementationSections.find((item) => item.id === 'release');
const runbooks = implementationSections.find((item) => item.id === 'runbooks');
assert(architecture?.decisions.some(([name]) => name === 'Clean history routes'), 'architecture notes must describe the clean-history route model');
assert(performance?.checks.join(' ').includes('150KB') && performance.checks.join(' ').includes('270KB') && performance.checks.join(' ').includes('390KB') && performance.checks.join(' ').includes('220KB'), 'performance notes must match the current executable budgets');
assert(performance?.checks.join(' ').includes('Twenty-two dynamic entries'), 'performance notes must match the current 22-entry dynamic split');
assert(release?.checks.join(' ').includes('26-route × 3-viewport') && release.checks.join(' ').includes('26-route × 2-viewport'), 'release notes must match the current visual and accessibility route matrices');
assert(runbooks?.decisions.some(([name]) => name === 'Aggregate preflight'), 'runbook notes must document aggregate build preflight');

for (const item of maintenanceMatrix) await access(path.resolve(item.canonical));

const [handbook, readme, preflight, packageJson] = await Promise.all([
  readFile(path.resolve('public/implementation-notes.md'), 'utf8'),
  readFile(path.resolve('README.md'), 'utf8'),
  readFile(path.resolve('scripts/run-build-preflight.mjs'), 'utf8'),
  readFile(path.resolve('package.json'), 'utf8'),
]);

for (const heading of ['Architecture', 'Content schema', 'Source and evidence contract', 'Media and status rules', 'Accessibility and responsive behavior', 'Performance boundaries', 'Update runbooks', 'Release checklist', 'Completion criteria']) {
  assert(handbook.includes(`## ${heading}`), `handbook is missing “${heading}”`);
}
for (const item of maintenanceMatrix) assert(handbook.includes(item.canonical), `handbook is missing canonical path ${item.canonical}`);

for (const phrase of [
  '26 reader-facing screens',
  '106 character portraits and 29 Black Whale derivatives',
  '150,000 bytes',
  '22 dynamic entries',
  '14 independent pre-build audits',
  'hxh-archive-phase-8a-sites-source.zip',
  'architecture/',
  'docs/',
  '.github/',
]) {
  assert(handbook.includes(phrase), `handbook is missing current contract phrase “${phrase}”`);
  assert(readme.includes(phrase) || phrase === '106 character portraits and 29 Black Whale derivatives', `README is missing current contract phrase “${phrase}”`);
}

const preflightScripts = [...preflight.matchAll(/^\s*'audit:[^']+',?$/gm)].map((match) => match[0]);
assert(preflightScripts.length === 14, `aggregate preflight must list 14 audits, found ${preflightScripts.length}`);
assert(packageJson.includes('"preflight:build"') && packageJson.includes('npm run generate:build-info && npm run preflight:build'), 'package build must invoke aggregate preflight immediately after build identity generation');

console.log(`Implementation notes audit passed: ${implementationSections.length} system sections; ${maintenanceMatrix.length} runbooks; ${releaseChecklist.reduce((total, group) => total + group.items.length, 0)} release checks; ${completionCriteria.length} completion criteria; 14-audit aggregate preflight; current route, media, performance, and package contracts synchronized.`);
