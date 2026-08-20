import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 4 high-value intelligence audit failed: ${message}`);
};

const [appSource, primitivesSource, workbenchSource, workbenchCss, dataSource, foundationSource] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/components/succession/SuccessionIntelligenceWorkbench.jsx'),
  read('src/components/succession/SuccessionIntelligenceWorkbench.css'),
  read('src/data/succession/successionData.js'),
  read('src/data/succession/highValueIntelligenceFoundation.js'),
]);

assert(dataSource.includes("from './entitiesHighValueIntelligence.js'"), 'the public data entry must activate the Phase 4 data layer');
assert(dataSource.includes('createHighValueIntelligenceSelectors'), 'the public data entry must create Phase 4 selectors');
assert(appSource.includes("EvidenceWorkspace from './SuccessionArchiveEvidenceWorkspace'"), 'Research must preserve the canonical evidence workspace');
assert(appSource.includes("SuccessionIntelligenceWorkbench from './SuccessionIntelligenceWorkbench'"), 'Research must import the Phase 4 workbench');
assert(appSource.includes('<SuccessionIntelligenceWorkbench') && appSource.includes('<EvidenceWorkspace'), 'Research must preserve both the workbench and evidence desk');
assert(primitivesSource.includes("['knowledge-record', 'protocol', 'object', 'document', 'evidence-item'].includes(entity.entityType)) return 'research'"), 'shared graph links must route every Phase 4 entity type into Research');
for (const mode of ['overview', 'diff', 'knowledge', 'protocols', 'artifacts', 'compare', 'changes']) {
  assert(workbenchSource.includes(`'${mode}'`), `the ${mode} workbench mode is missing`);
}
assert(workbenchSource.includes('getChapterStateDiff'), 'the workbench must expose chapter-to-chapter state comparison');
assert(workbenchSource.includes('getKnowledgeMatrix'), 'the workbench must expose Knowledge & Secrecy');
assert(workbenchSource.includes('getProtocolRecordsAtChapter'), 'the workbench must expose Rules, Law & Ritual Protocol');
assert(workbenchSource.includes('getArtifactsAtChapter'), 'the workbench must expose Objects, Documents & Evidence');
assert(workbenchSource.includes('compareSameTypeRecords'), 'the workbench must expose same-type record comparison');
assert(workbenchSource.includes('getEditorialChangeLog'), 'the workbench must expose editorial history');
assert(!workbenchCss.includes('@media (max-width:'), 'Phase 4 must not add mobile or tablet presentation rules');
assert(foundationSource.includes('Kacho’s letters') && foundationSource.includes('TSK-17') && foundationSource.includes('Morena’s negotiation cards'), 'the promoted legacy object and evidence records are incomplete');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    compareSameTypeRecords,
    getArtifactRecord,
    getArtifactsAtChapter,
    getChapterStateDiff,
    getEditorialChangeLog,
    getEntitiesByType,
    getEvidenceForArtifact,
    getIntelligenceWorkbenchSummary,
    getKnowledgeMatrix,
    getKnowledgeRecordsAtChapter,
    getProtocolRecordsAtChapter,
    searchArchiveProduct,
    successionArchiveData,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveData.highValueIntelligenceVersion === 'phase-4-v1', 'the active data layer must retain the Phase 4 compatibility identifier');
  assert(successionArchiveValidation.valid, `canonical validation failed: ${successionArchiveValidation.errors.join(' · ')}`);
  assert(successionArchiveValidation.stats.knowledgeRecords >= 8, 'the original eight knowledge records must not be lost');
  assert(successionArchiveValidation.stats.protocols >= 10, 'the original ten protocol records must not be lost');
  assert(successionArchiveValidation.stats.objects >= 10, 'the original ten first-class objects must not be lost');
  assert(successionArchiveValidation.stats.documents >= 3, 'the original three first-class documents must not be lost');
  assert(successionArchiveValidation.stats.evidenceItems >= 6, 'the original six first-class evidence items must not be lost');
  assert(successionArchiveValidation.stats.editorialChanges >= 4, 'the original four editorial entries must not be lost');

  for (const type of ['knowledge-record', 'protocol', 'object', 'document', 'evidence-item']) {
    const records = getEntitiesByType(type);
    assert(records.length > 0, `${type} records are not indexed`);
    for (const record of records) {
      assert(record.sourceIds.length > 0, `${record.id} has no chapter source`);
      assert(record.sourceIds.every((id) => archive.getEntityById(id)?.entityType === 'source'), `${record.id} contains a broken source link`);
    }
  }

  const diff = getChapterStateDiff(403, 404);
  assert(diff.fromChapter === 403 && diff.toChapter === 404, 'chapter diff boundaries are incorrect');
  assert(diff.summary.changed + diff.summary.added + diff.summary.removed > 0, 'Chapter 403 to 404 must produce a non-empty state delta');
  assert(diff.records.some((record) => record.entity.id === 'character:halkenburg-hui-guo-rou'), 'the Chapter 403 to 404 diff must include Halkenburg');

  const knowledge410 = getKnowledgeMatrix(410);
  assert(knowledge410.records.length === 7, 'the corrected Chapter 410 knowledge snapshot must expose seven pre-declaration records');
  assert(!knowledge410.records.some((record) => record.id === 'knowledge-record:special-martial-law'), 'formal Special Martial Law must not leak before its corrected Chapter 415 declaration boundary');
  const knowledge415 = getKnowledgeMatrix(415);
  assert(knowledge415.records.some((record) => record.id === 'knowledge-record:special-martial-law' && record.currentKnowledgeState === 'public'), 'formal Special Martial Law must become public at Chapter 415');
  assert(getKnowledgeRecordsAtChapter(400).every((record) => record.chapterRange.start <= 400), 'knowledge records must respect the chapter boundary');

  const protocols410 = getProtocolRecordsAtChapter(410);
  assert(protocols410.length === 9, 'the corrected Chapter 410 protocol snapshot must exclude the not-yet-declared Special Martial Law order');
  assert(new Set(protocols410.map((record) => record.domain)).size >= 5, 'protocol records must preserve distinct legal, ritual, military, judicial, Nen, and operational domains');
  assert(protocols410.some((record) => record.id === 'protocol:succession-withdrawal-and-survivor-rule' && record.protocolStatus === 'disputed'), 'the withdrawal rule must remain explicitly disputed');
  assert(protocols410.some((record) => record.id === 'protocol:kakin-mafia-hit-raid-settlement' && record.domain === 'operational-rule'), 'the Chapter 384 Kakin mafia settlement procedure must remain indexed as an operational protocol');
  assert(getProtocolRecordsAtChapter(415).some((record) => record.id === 'protocol:special-martial-law-order'), 'the Special Martial Law protocol must activate at Chapter 415');

  const artifacts = getArtifactsAtChapter(410);
  assert(artifacts.length === 19, 'all original Phase 4 objects, documents, and evidence must remain available by Chapter 410');
  assert(getArtifactRecord('object:seed-urn')?.name === 'Seed Urn', 'Seed Urn object lookup failed');
  assert(getEvidenceForArtifact('object:tsk-17', 410).some((record) => record.id === 'evidence-item:tsk-17-operation-chain'), 'TSK-17 evidence chain is disconnected');

  const objectComparison = compareSameTypeRecords(['object:seed-urn', 'object:zhang-lei-coins'], 410);
  assert(objectComparison.valid && objectComparison.entityType === 'object', 'same-type object comparison failed');
  assert(objectComparison.differenceCount > 0, 'object comparison must expose differences');
  const invalidComparison = compareSameTypeRecords(['object:seed-urn', 'document:kacho-letters'], 410);
  assert(!invalidComparison.valid, 'mixed entity types must not compare');

  const changes = getEditorialChangeLog();
  const originalChangeIds = new Set(['change:portal-rollback', 'change:phase-1-visual-repair', 'change:phase-2-presentation', 'change:phase-3-information']);
  const originalChanges = changes.entries.filter((entry) => originalChangeIds.has(entry.id));
  assert(originalChanges.length === 4, 'the original Phase 4 editorial history is incomplete');
  assert(originalChanges.every((entry) => entry.commit && entry.status === 'merged'), 'original published editorial entries must still point to merged commits');

  const summary = getIntelligenceWorkbenchSummary(410);
  assert(summary.knowledgeRecords === 7 && summary.protocolRecords === 9, 'the corrected Chapter 410 workbench snapshot counts are incorrect');
  assert(summary.editorialEntries === changes.entries.length, 'the workbench editorial count must track the expandable editorial ledger');

  const seedSearch = searchArchiveProduct('Seed Urn', { chapter: 410, limit: 20 });
  assert(seedSearch.some((result) => result.id === 'object:seed-urn' && result.route === 'research' && result.params.mode === 'artifacts'), 'global search must route the Seed Urn object into the Research artifact view');
  const knowledgeSearch = searchArchiveProduct('curse child network', { chapter: 410, limit: 20 });
  assert(knowledgeSearch.some((result) => result.id === 'knowledge-record:beyond-curse-child-network'), 'global search must index Knowledge & Secrecy records');

  console.log('Succession Phase 4 high-value intelligence audit passed: expandable intelligence preserves the original chapter-diff, Knowledge & Secrecy, protocol, artifact/evidence, comparison, editorial-history, search-routing, and shared-graph contracts while respecting the corrected Chapter 415 Special Martial Law boundary.');
} finally {
  await vite.close();
}
