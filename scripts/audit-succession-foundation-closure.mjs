import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession foundation closure audit failed: ${message}`);
};

const [graph, workspace, styles, app, dataEntry, packageJson] = await Promise.all([
  readFile(new URL('../src/data/succession/evidenceGraph.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveEvidenceWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveEvidenceWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
]);

assert(graph.includes('createSuccessionEvidenceGraph'), 'evidence graph factory must exist');
assert(graph.includes('getChapterEvidenceProfile'), 'chapter evidence profiles must be exposed');
assert(graph.includes('getEntityEvidenceProfile'), 'entity provenance profiles must be exposed');
assert(graph.includes('getFoundationClosureReport'), 'foundation closure report must be exposed');
assert(graph.includes('missing-primary-chapter-source'), 'chapter source gaps must remain explicit');
assert(graph.includes('not-linked-to-chapter-evidence'), 'orphaned entity gaps must remain explicit');
assert(dataEntry.includes("from './evidenceGraph.js'"), 'canonical data entry must activate the evidence graph');
assert(dataEntry.includes('successionChapterEvidenceProfiles'), 'chapter evidence profiles must be public');
assert(app.includes("import EvidenceWorkspace from './SuccessionArchiveEvidenceWorkspace';"), 'app must load the dedicated evidence workspace');
assert(app.includes("route.id === 'research' && <EvidenceWorkspace"), 'research route must render the evidence workspace');
assert(workspace.includes('Batch 1.6 · Evidence Graph and Foundation Closure'), 'workspace must identify the closure batch');
assert(workspace.includes('Chapter evidence snapshot'), 'workspace must render chapter evidence profiles');
assert(workspace.includes('Inspect non-critical coverage debt'), 'workspace must render the gap ledger');
assert(workspace.includes('Search maintained chapter and reference records'), 'workspace must retain source navigation');
assert(styles.includes('.succession-foundation-closure'), 'styles must own foundation closure presentation');
assert(styles.includes('@media (max-width:720px)'), 'workspace must include responsive handling');
assert(styles.includes('@media (prefers-reduced-motion:reduce)'), 'workspace must include reduced-motion handling');
assert(packageJson.includes('audit:succession-foundation'), 'package scripts must expose the closure audit');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const archiveModule = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getChapterEvidenceProfile,
    getEntitiesByType,
    getEntityEvidenceProfile,
    getFoundationClosureReport,
    successionArchiveValidation,
    successionChapterEvidenceProfiles,
  } = archiveModule;

  assert(successionArchiveValidation.valid, 'canonical data must pass schema validation');
  assert(successionChapterEvidenceProfiles.length >= 75, `expected at least 75 chapter evidence profiles, found ${successionChapterEvidenceProfiles.length}`);
  assert(successionChapterEvidenceProfiles.every((profile) => profile.provenance.hasPrimarySource), 'every indexed chapter must retain its primary chapter source');
  assert(successionChapterEvidenceProfiles.every((profile) => profile.provenance.hasReaderBridge), 'every indexed chapter must retain a reader bridge');
  assert(successionChapterEvidenceProfiles.every((profile) => profile.invalidSourceIds.length === 0), 'chapter profiles must not contain broken source references');

  const chapter411 = getChapterEvidenceProfile(411);
  assert(chapter411?.eventIds.includes('event:second-room-1014-nen-class'), 'Chapter 411 must link the second Room 1014 Nen class');
  assert(chapter411?.assignmentIds.includes('assignment:sarahell-infiltrates-woble'), 'Chapter 411 must link Sarahell’s infiltration assignment');
  assert(chapter411?.relationshipIds.includes('relationship:oito-woble-mother-and-protector'), 'Chapter 411 must preserve Oito and Woble’s active relationship');
  assert(chapter411?.primarySourceIds.includes('source:chapter-411'), 'Chapter 411 must resolve its primary source');

  const chapter403 = getChapterEvidenceProfile(403);
  assert(chapter403?.eventIds.includes('event:balsamilco-poisoning-operation'), 'Chapter 403 must link the Balsamilco poisoning operation');
  assert(chapter403?.relationshipIds.includes('relationship:benjamin-balsamilco-command'), 'Chapter 403 must link Benjamin’s command edge');
  assert(chapter403?.locationIds.includes('location:black-whale:tier-2:courthouse'), 'Chapter 403 must link the Tier 2 courthouse');

  const wobleEvidence = getEntityEvidenceProfile('character:woble-hui-guo-rou');
  assert(wobleEvidence?.sourceIds.length > 0, 'Woble must retain direct source references');
  assert(wobleEvidence?.chapterNumbers.includes(411), 'Woble must be linked into Chapter 411 evidence');

  const closure = getFoundationClosureReport();
  assert(closure.domainCounts.character > 0, 'closure report must count characters');
  assert(closure.domainCounts.organization > 0, 'closure report must count organizations');
  assert(closure.domainCounts['guardian-beast'] >= 14, 'closure report must retain all fourteen Guardian Spirit Beasts');
  assert(closure.missingSourceEntityIds.length === 0, 'published core records must not be missing source arrays');
  assert(closure.brokenSourceEntityIds.length === 0, 'published core records must not reference missing sources');
  assert(closure.chaptersMissingPrimarySource.length === 0, 'all chapters must have primary sources');
  assert(closure.chaptersMissingReaderBridge.length === 0, 'all chapters must have reader bridges');
  assert(closure.readyForBatch2, 'critical evidence gates must be clear before Batch 1 closes');

  const operationalTypes = ['event', 'assignment', 'relationship'];
  for (const entityType of operationalTypes) {
    for (const entity of getEntitiesByType(entityType)) {
      const profile = getEntityEvidenceProfile(entity.id);
      assert(profile?.chapterNumbers.length > 0, `${entity.id} must participate in at least one chapter evidence profile`);
    }
  }

  console.log(`Succession Batch 1 closure audit passed: ${closure.chapterCount} chapter profiles, ${closure.averageChapterScore}% average provenance, ${closure.criticalGapCount} critical gaps, complete operational chapter links, source integrity, reader bridges, and explicit non-critical debt reporting.`);
} finally {
  await vite.close();
}
