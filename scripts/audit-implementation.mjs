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

assert(IMPLEMENTATION_NOTES_VERSION.includes('Phase 6F'), 'version label must identify Phase 6F');
assert(implementationSections.length === 8 && unique(implementationSections.map((item) => item.id)), 'eight unique implementation sections are required');
assert(implementationSections.every((item) => item.title && item.summary && item.owner && item.files.length >= 3 && item.decisions.length >= 3 && item.checks.length >= 3), 'every section needs a complete owner, decision, file, and verification contract');
assert(maintenanceMatrix.length >= 12 && unique(maintenanceMatrix.map((item) => item.id)), 'twelve unique maintenance runbooks are required');
assert(releaseChecklist.length >= 5 && releaseChecklist.every((group) => group.items.length >= 3), 'the release checklist must cover five areas with at least three checks each');
assert(completionCriteria.length >= 8, 'the completion contract must keep eight criteria');

for (const item of maintenanceMatrix) await access(path.resolve(item.canonical));

const handbook = await readFile(path.resolve('public/implementation-notes.md'), 'utf8');
for (const heading of ['Architecture', 'Content schema', 'Source and evidence contract', 'Media and status rules', 'Accessibility and responsive behavior', 'Performance boundaries', 'Update runbooks', 'Release checklist', 'Completion criteria']) {
  assert(handbook.includes(heading), `handbook is missing “${heading}”`);
}
for (const item of maintenanceMatrix) assert(handbook.includes(item.canonical), `handbook is missing canonical path ${item.canonical}`);

console.log(`Implementation notes audit passed: ${implementationSections.length} system sections; ${maintenanceMatrix.length} runbooks; ${releaseChecklist.reduce((total, group) => total + group.items.length, 0)} release checks; ${completionCriteria.length} completion criteria.`);
