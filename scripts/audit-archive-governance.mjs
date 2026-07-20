import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { bibliographyCollections, bibliographyRecords, bibliographyStats } from '../src/data/bibliography.js';
import { archiveEntityNamespaces, canonicalEntityIds, entityIdRegex, entityIdStats, isArchiveEntityId } from '../src/data/entityIds.js';
import { evidenceStateGroups, evidenceStateIds, evidenceStates, evidenceStateStats, isEvidenceState } from '../src/data/evidenceStates.js';
import { reviewQueueItems, reviewQueueLanes, reviewQueueStats } from '../src/data/reviewQueue.js';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Archive governance audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

assert(bibliographyStats.records >= 20, 'bibliography registry needs a broad seed set');
assert(bibliographyStats.collections >= 3, 'bibliography needs multiple collections');
assert(bibliographyRecords.length === bibliographyStats.records, 'bibliography statistics must match the registry');
assert(unique(bibliographyRecords.map((record) => record.id)), 'bibliography IDs must be unique');
assert(bibliographyRecords.every((record) => /^src-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)), 'bibliography IDs must use src-* format');
assert(bibliographyRecords.every((record) => isApprovedSourceUrl(record.href)), 'bibliography must keep the approved Hunterpedia/Fandom source policy');
assert(bibliographyRecords.every((record) => record.recordTypes.length >= 1 && record.usedBy.length >= 1 && record.notes.length >= 8), 'bibliography records need record types, used-by targets, and notes');
assert(bibliographyCollections.every((collection) => collection.purpose && collection.records.length >= 5), 'each bibliography collection needs purpose and enough records');

assert(entityIdStats.namespaces >= 10, 'entity ID system needs enough namespaces for future archive systems');
assert(entityIdStats.canonicalIds >= 20, 'canonical entity seed list is too small');
assert(unique(archiveEntityNamespaces.map((namespace) => namespace.prefix)), 'entity namespace prefixes must be unique');
assert(unique(canonicalEntityIds.map((record) => record.id)), 'canonical entity IDs must be unique');
assert(canonicalEntityIds.every((record) => isArchiveEntityId(record.id)), 'canonical entity IDs must match the archive ID pattern');
assert(entityIdRegex.test('arc.chimera-ant') && entityIdRegex.test('char.gon-freecss') && !entityIdRegex.test('bad id'), 'entity ID regex must accept expected IDs and reject bad strings');

assert(evidenceStateStats.groups >= 4, 'evidence states need grouped maintenance categories');
assert(evidenceStateStats.states >= 12, 'evidence state set is too shallow');
assert(unique(evidenceStateIds), 'evidence state IDs must be unique');
assert(evidenceStates.every((state) => state.label && state.summary && state.display && state.allowedOn.length >= 1), 'evidence states need labels, summaries, display rules, and allowed targets');
assert(evidenceStateGroups.every((group) => group.states.every(isEvidenceState)), 'evidence state groups must reference known states');
for (const required of ['confirmed', 'inferred', 'unclear', 'source-index-only', 'not-yet-reviewed', 'deferred', 'manga-only', 'anime-only']) {
  assert(isEvidenceState(required), `evidence states missing ${required}`);
}

assert(reviewQueueStats.lanes >= 5, 'review queue needs enough lanes');
assert(reviewQueueStats.items >= 10, 'review queue seed list is too small');
assert(reviewQueueStats.highPriority >= 3, 'review queue needs high-priority governance work');
assert(unique(reviewQueueLanes.map((lane) => lane.id)), 'review queue lanes must be unique');
assert(unique(reviewQueueItems.map((item) => item.id)), 'review queue item IDs must be unique');
assert(reviewQueueItems.every((item) => reviewQueueLanes.some((lane) => lane.id === item.lane)), 'every review queue item must use a known lane');
assert(reviewQueueItems.every((item) => item.entityId && item.reason && item.nextAction && isEvidenceState(item.evidenceState)), 'review queue items need entity IDs, reasons, next actions, and evidence states');

const schemaFiles = [
  'src/schema/bibliographyRecord.schema.json',
  'src/schema/entityRecord.schema.json',
  'src/schema/chapterRecord.schema.json',
  'src/schema/characterRecord.schema.json',
  'src/schema/conflictRecord.schema.json',
];
for (const file of schemaFiles) {
  const schema = JSON.parse(await read(file));
  assert(schema.$schema && schema.$id && schema.title && schema.required?.length >= 3, `${file} needs JSON schema metadata and required fields`);
}

const packageJson = await read('package.json');
assert(packageJson.includes('audit:governance') && packageJson.includes('node scripts/audit-archive-governance.mjs'), 'package.json must expose audit:governance');
assert(packageJson.includes('npm run audit:final && npm run audit:governance && npm run audit:schema'), 'build chain must run governance after final lock and before schema audit');

for (const docName of ['ARCHIVE-GOVERNANCE.md', 'BIBLIOGRAPHY-SYSTEM.md', 'ENTITY-ID-CONVENTIONS.md', 'REVIEW-QUEUE.md']) {
  await access(path.resolve('docs', docName));
}

const governanceDoc = await read('docs/ARCHIVE-GOVERNANCE.md');
for (const phrase of ['Batch 11', 'bibliography registry', 'stable entity IDs', 'evidence states', 'manual review queue', 'No live UI rewrite']) {
  assert(governanceDoc.includes(phrase), `governance doc missing ${phrase}`);
}

console.log(`Archive governance audit passed: ${bibliographyStats.records} bibliography records, ${entityIdStats.canonicalIds} canonical IDs, ${evidenceStateStats.states} evidence states, ${reviewQueueStats.items} review items, and ${schemaFiles.length} schema contracts.`);
