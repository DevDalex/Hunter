import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession 100% content-completion audit failed: ${message}`);
};

const allowed = new Set(['known', 'none-known', 'canon-unknown', 'not-applicable']);
const assertStatuses = (rows, label) => {
  assert(Array.isArray(rows), `${label} is not an array`);
  rows.forEach((row, index) => assert(allowed.has(row?.status || row?.completionState), `${label}[${index}] has an unclassified status`));
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [completion, reference] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/contentCompletion.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthExpansionReference.js'),
  ]);
  const chapter = 417;
  const report = completion.getCompletionReport(chapter);

  assert(report.completeness === 100, `overall completion is ${report.completeness}% instead of 100%`);
  assert(report.missing.length === 0, `${report.missing.length} requested slots remain unclassified`);
  assert(report.cells > 0, 'completion report contains no audited cells');

  const chapters = completion.getAllChapterCompletionDossiers(chapter);
  assert(chapters.length === 79, `expected Chapter 339–417 coverage (79 dossiers), found ${chapters.length}`);
  assert(chapters[0]?.chapter === 339 && chapters.at(-1)?.chapter === 417, 'chapter completion boundary is not 339–417');
  assert(chapters[0]?.scope === 'pre-succession-bridge', 'Chapter 339 must remain the pre-Succession Series bridge');
  for (const dossier of chapters) {
    assert(dossier.completeness === 100, `Chapter ${dossier.chapter} dossier is not complete`);
    assert(dossier.fields.length === reference.CHAPTER_FORENSIC_FIELDS.length, `Chapter ${dossier.chapter} has ${dossier.fields.length}/${reference.CHAPTER_FORENSIC_FIELDS.length} forensic fields`);
    assertStatuses(dossier.fields, `Chapter ${dossier.chapter} fields`);
  }

  const princes = completion.getPrinceCompletionDossiers(chapter);
  assert(princes.length === 14, `expected 14 prince dossiers, found ${princes.length}`);
  for (const dossier of princes) {
    assert(dossier.completeness === 100, `${dossier.prince?.name || dossier.prince?.id} dossier is not complete`);
    assert(dossier.fields.length === reference.PRINCE_DOSSIER_FIELDS.length, `${dossier.prince?.name || dossier.prince?.id} has ${dossier.fields.length}/${reference.PRINCE_DOSSIER_FIELDS.length} prince fields`);
    assertStatuses(dossier.fields, `${dossier.prince?.name || dossier.prince?.id} fields`);
  }

  const trackers = reference.SPECIAL_PRINCE_TRACKERS.map((tracker) => completion.getSpecialTrackerCompletion(tracker.id, chapter));
  assert(trackers.length === reference.SPECIAL_PRINCE_TRACKERS.length && trackers.every(Boolean), 'one or more prince-specific trackers are unavailable');
  trackers.forEach((tracker, index) => {
    assert(tracker.completeness === 100, `${tracker.label} tracker is not complete`);
    assert(tracker.focusRows.length === reference.SPECIAL_PRINCE_TRACKERS[index].focus.length, `${tracker.label} lost requested tracker facets`);
    assertStatuses(tracker.focusRows, `${tracker.label} tracker`);
  });

  const investigations = completion.getInvestigationCompletion(chapter);
  assert(investigations.length === reference.INVESTIGATION_DOSSIERS.length, `expected ${reference.INVESTIGATION_DOSSIERS.length} investigation families, found ${investigations.length}`);
  investigations.forEach((investigation) => {
    const definition = reference.INVESTIGATION_DOSSIERS.find((row) => row.id === investigation.id);
    assert(investigation.completeness === 100, `${investigation.label} investigation is not complete`);
    assert(investigation.facets.length === definition.facets.length, `${investigation.label} lost requested facets`);
    assertStatuses(investigation.facets, `${investigation.label} facets`);
  });

  const kakin = completion.getKakinCompletion(chapter);
  assert(kakin.completeness === 100 && kakin.reference.length === reference.KAKIN_ROYAL_REFERENCE.length, 'Kakin royal-system reference is incomplete');
  assertStatuses(kakin.reference, 'Kakin reference');

  const knowledge = completion.getKnowledgeCompletion(chapter);
  assert(knowledge.completeness === 100 && knowledge.topics.length === reference.INFORMATION_WAR_TOPICS.length, 'information-war topic matrix is incomplete');
  assertStatuses(knowledge.topics, 'Information-war topics');

  const nen = completion.getNenCompletion();
  assert(nen.completeness === 100 && nen.count > 0, 'general Nen completion is unavailable');
  assertStatuses(nen.records, 'Nen records');

  const mysteries = completion.getMysteryCompletion(chapter);
  assert(mysteries.length > 0 && mysteries.every((row) => row.completeness === 100), 'mystery dossiers are incomplete');
  assertStatuses(mysteries, 'Mystery dossiers');

  const glossary = completion.getGlossaryCompletion(chapter);
  assert(glossary.completeness === 100 && glossary.count > 0, 'glossary completion is unavailable');
  assertStatuses(glossary.records, 'Glossary records');

  const crossLinks = completion.getCrossLinkCoverage(chapter);
  assert(crossLinks.completeness === 100 && crossLinks.count > 0, 'cross-link coverage is unavailable');
  assertStatuses(crossLinks.records, 'Cross-linked entities');

  const ledgers = completion.getLedgerCompletion(chapter);
  assert(ledgers.length === reference.LEDGER_DEFINITIONS.length, `expected ${reference.LEDGER_DEFINITIONS.length} ledgers, found ${ledgers.length}`);
  assert(ledgers.every((row) => row.completeness === 100), 'one or more operational ledgers are incomplete');
  assertStatuses(ledgers, 'Operational ledgers');
  const orders = ledgers.find((row) => row.id === 'orders');
  assert(orders?.count > 0, 'orders/surveillance/custody ledger still resolves to a false zero at Chapter 417');

  const orientation = completion.getOrientationCompletion(chapter);
  assert(orientation.completeness === 100 && orientation.checkpoints.length === reference.READER_ORIENTATION_CHECKPOINTS.length, 'reader-orientation checkpoints are incomplete');

  const evidence = completion.getEvidenceCompletion(chapter);
  assert(evidence.completeness === 100 && evidence.ruleRows.length === reference.EVIDENCE_QUALITY_RULES.length, 'evidence/provenance rules are incomplete');
  assertStatuses(evidence.ruleRows, 'Evidence rules');

  const appendices = completion.getAppendixCompletion(chapter);
  assert(appendices.completeness === 100 && appendices.families.length === reference.REFERENCE_APPENDICES.length, 'reference appendix families are incomplete');
  assertStatuses(appendices.families, 'Appendix families');

  const [ui, bridge] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionContentCompletionWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
  ]);
  for (const token of ['Coverage', 'Chapters', 'Princes', 'Prince trackers', 'Investigations', 'Kakin', 'Information war', 'Nen', 'Mysteries', 'Glossary', 'Cross-links', 'Ledgers', 'Evidence', 'Appendices']) {
    assert(ui.includes(token), `released completion UI is missing ${token}`);
  }
  assert(bridge.includes('SuccessionContentCompletionWorkbench'), 'Research Depth does not expose the content-completion workbench');

  console.log(`Succession 100% content-completion audit passed: ${report.cells} requested slots, ${chapters.length} chapter dossiers, ${princes.length} prince dossiers, ${trackers.length} special trackers, ${investigations.length} investigation families, ${nen.count} Nen records, ${glossary.count} glossary terms, ${crossLinks.count} cross-linked entities, ${ledgers.length} operational ledgers, ${appendices.families.length} appendix families, and 0 unclassified slots.`);
} finally {
  await vite.close();
}
