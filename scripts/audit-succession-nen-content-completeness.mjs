import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession 339–418 Nen content audit failed: ${message}`);
};
const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const singular = (value) => normalize(value).replace(/\b([a-z]{4,})s\b/g, '$1');

const [runtime, completion, seriesResearch] = await Promise.all([
  import('../src/data/succession/successionData.js'),
  import('../src/data/succession/contentCompletion.js'),
  import('../src/data/seriesResearch.js'),
]);
const [nenWorkspace, evidenceWorkspace, glossaryWorkspace, completionWorkbench] = await Promise.all([
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveNenWorkspace.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveEvidenceWorkspace.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveGlossaryWorkspace.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionContentCompletionWorkbench.jsx'), 'utf8'),
]);

const latest = runtime.successionArchiveData.chapters.at(-1)?.number;
assert(latest === 418, `runtime chapter ceiling is ${latest}, expected 418`);

const ch339 = seriesResearch.getPreSuccessionResearch(339);
assert(ch339?.chapterSpecific === true, 'Chapter 339 is not marked chapter-specific');
assert(ch339?.title === 'Stillness', 'Chapter 339 title is not maintained as Stillness');
assert(ch339?.japaneseTitle === '静寂', 'Chapter 339 Japanese title is missing');
assert(JSON.stringify(ch339?.expeditionFramework) === JSON.stringify(['Permission', 'Route', 'Qualification', 'Negotiation']), 'Chapter 339 expedition framework is incomplete');
assert(ch339?.nenDelta?.status === 'none-known', 'Chapter 339 Nen delta must explicitly resolve to none-known');
assert((ch339?.nenDelta?.newAbilities || []).length === 0 && (ch339?.nenDelta?.newRules || []).length === 0, 'Chapter 339 must not invent new Nen abilities or rules');

for (let chapter = 339; chapter <= 418; chapter += 1) {
  const dossier = completion.getChapterCompletionDossier(chapter);
  assert(dossier?.chapter === chapter, `Chapter ${chapter} completion dossier is missing`);
  assert(dossier?.nenDelta?.chapter === chapter, `Chapter ${chapter} has no structured Nen Delta`);
  for (const label of ['new abilities', 'newly explained abilities', 'Guardian Spirit Beasts shown or discussed', 'new Nen rules', 'Nen cross-links']) {
    assert(dossier.fields.some((field) => field.label === label), `Chapter ${chapter} is missing ${label}`);
  }
}

const delta417 = completion.getChapterNenDelta(417);
const delta418 = completion.getChapterNenDelta(418);
assert(delta417.newAbilities.some((ability) => ability.id === 'ability:gypsy-life-bohemian-rhapsody'), 'Chapter 417 does not identify Gypsy Life as newly known');
assert(delta418.refinedAbilities.some((ability) => ability.id === 'ability:parallel-future') || delta418.changedAbilities.some((ability) => ability.id === 'ability:parallel-future'), 'Chapter 418 does not identify the Parallel Future mechanics update');
assert(!delta418.newAbilities.some((ability) => ability.id === 'ability:parallel-future'), 'Chapter 418 incorrectly reclassifies Parallel Future as newly introduced');
assert(delta418.hypotheses.some((row) => row.abilityId === 'ability:parallel-future'), 'Chapter 418 does not preserve unresolved Parallel Future hypotheses');

const glossary = runtime.getGlossaryEntriesAtChapter(418);
for (const term of ['Ten', 'Zetsu', 'Ren', 'Hatsu', 'Gyo', 'In', 'En', 'Shu', 'Ko', 'Ken', 'Ryu', 'Enhancement', 'Transmutation', 'Emission', 'Conjuration', 'Manipulation', 'Specialization', 'Conditions and limitations', 'Vows']) {
  assert(glossary.some((entry) => normalize(entry.term) === normalize(term)), `Unified glossary is missing ${term}`);
}
const haveNotRows = glossary.filter((entry) => singular(entry.term) === 'have not' || (entry.synonyms || []).some((alias) => singular(alias) === 'have not'));
assert(haveNotRows.length === 1, `Have-Not/Have-Nots glossary aliases are duplicated (${haveNotRows.length} records)`);
const zetsuSearch = runtime.searchArchiveProduct('Zetsu', { chapter: 418, types: ['glossary'], limit: 20 });
assert(zetsuSearch.some((result) => result.resultType === 'glossary' && normalize(result.label) === 'zetsu'), 'Global archive search cannot find the unified Zetsu glossary record');

const beasts = runtime.getEntitiesByType('guardian-beast').filter((beast) => beast.publicationStatus === 'published');
const beastOrphans = new Set(runtime.getFoundationClosureReport().orphanedEntityIds || []);
for (const beast of beasts) {
  assert(!beastOrphans.has(beast.id), `${beast.id} remains orphaned from chapter evidence`);
  assert((runtime.successionEvidenceGraph.getEntityEvidenceProfile(beast.id)?.chapterNumbers || []).length > 0, `${beast.id} has no chapter evidence links`);
}
assert(Array.isArray(runtime.getChapterEvidenceProfile(418)?.guardianBeastIds), 'Chapter evidence profiles do not expose Guardian Spirit Beast IDs');

const report = completion.getCompletionReport(418);
assert(Number.isFinite(report.structuralCompleteness), 'structural completeness metric is missing');
assert(Number.isFinite(report.canonExtractionCoverage), 'canon extraction coverage metric is missing');
assert(report.structuralCompleteness >= report.canonExtractionCoverage, 'canon extraction coverage cannot exceed structural completeness');
assert(Number.isFinite(report.explicitUnknowns), 'explicit canon-unknown count is missing');

assert(nenWorkspace.includes('LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER'), 'Nen workspace does not use the current research boundary');
assert(!nenWorkspace.includes('spoilerLimit = 413'), 'Nen workspace still defaults to Chapter 413');
assert(evidenceWorkspace.includes('guardianBeastIds') && evidenceWorkspace.includes('guardianBeasts'), 'Research Evidence UI does not expose Guardian Spirit Beast evidence');
assert(!evidenceWorkspace.includes('spoilerLimit = 414'), 'Research Evidence workspace still defaults to Chapter 414');
assert(!glossaryWorkspace.includes('DEEP_GLOSSARY_ENTRIES'), 'Glossary workspace still maintains a second supplemental catalogue');
assert(completionWorkbench.includes('Math.max(339'), 'Completion workbench still prevents Chapter 339 selection');
assert(completionWorkbench.includes('canonExtractionCoverage') && completionWorkbench.includes('Structured Nen Delta'), 'Completion UI does not expose the new metrics and Nen Delta');

console.log(`Succession 339–418 Nen content completeness audit passed: ${glossary.length} unified glossary terms, ${beasts.length} Guardian Spirit Beast evidence profiles, Chapter 339 forensic handoff, and structured Nen deltas through Chapter 418 are verified.`);
