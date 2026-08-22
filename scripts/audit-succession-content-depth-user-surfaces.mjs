import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession user-surface completion audit failed: ${message}`);
};

const [surfaceSource, referenceSource, entrySource, nenSource] = await Promise.all([
  readFile(path.join(root, 'src/components/succession/SuccessionContextualCompletion.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionContextualReferenceExpansion.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveEntry.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/NenEncyclopedia.jsx'), 'utf8'),
]);

assert(entrySource.includes("import SuccessionContextualCompletion from './SuccessionContextualCompletion'"), 'normal Succession route shell does not import the contextual completion surface');
assert(entrySource.includes('<SuccessionContextualCompletion'), 'normal Succession route shell does not render the contextual completion surface');
assert(entrySource.includes("import SuccessionContextualReferenceExpansion from './SuccessionContextualReferenceExpansion'"), 'normal Succession route shell does not import the full reference expansion');
assert(entrySource.includes('<SuccessionContextualReferenceExpansion'), 'normal Succession route shell does not render the full reference expansion');
assert(nenSource.includes("import SuccessionContextualCompletion from './succession/SuccessionContextualCompletion'"), 'general Nen encyclopedia does not import the contextual completion surface');
assert(nenSource.includes('<SuccessionContextualCompletion spoilerLimit={spoilerLimit} encyclopedia />'), 'general Nen encyclopedia does not expose the normalized completion records');

for (const target of ['chapters', 'princes', 'research', 'organizations', 'nen', 'guardian-spirit-beasts', 'glossary', 'events', 'relationships', 'story', 'timeline']) {
  assert(surfaceSource.includes(`routeTarget === '${target}'`), `normal ${target} route is not mapped to completion content`);
}

for (const required of [
  'getChapterCompletionDossier',
  'getPrinceCompletionDossiers',
  'getSpecialTrackerCompletion',
  'getInvestigationCompletion',
  'getKakinCompletion',
  'getKnowledgeCompletion',
  'getMysteryCompletion',
  'getEvidenceCompletion',
  'getNenCompletion',
  'getGlossaryCompletion',
  'getLedgerCompletion',
  'getCrossLinkCoverage',
  'getOrientationCompletion',
  'getAppendixCompletion',
]) {
  assert(surfaceSource.includes(required), `contextual surface does not consume ${required}`);
}

for (const required of ['getKakinCompletion', 'getKnowledgeCompletion', 'getLedgerCompletion', 'getCrossLinkCoverage']) {
  assert(referenceSource.includes(required), `full route-native reference expansion does not consume ${required}`);
}
assert(referenceSource.includes("routeTarget === 'princes'"), 'full Kakin reference is not attached to Royal Family');
assert(referenceSource.includes("routeTarget === 'research'"), 'full information-war matrix is not attached to Research');
assert(referenceSource.includes("routeTarget === 'events' || routeTarget === 'relationships'"), 'full ledgers and graph health are not attached to normal record routes');

assert(!surfaceSource.includes("routeTarget === 'black-whale'"), 'excluded Black Whale physical/spatial expansion was accidentally added to the contextual completion layer');
assert(!referenceSource.includes("routeTarget === 'black-whale'"), 'excluded Black Whale physical/spatial expansion was accidentally added to the reference expansion');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  await vite.ssrLoadModule('/src/components/succession/SuccessionContextualCompletion.jsx');
  await vite.ssrLoadModule('/src/components/succession/SuccessionContextualReferenceExpansion.jsx');
  await vite.ssrLoadModule('/src/components/NenEncyclopedia.jsx');
  const completion = await vite.ssrLoadModule('/src/data/succession/contentCompletion.js');

  const chapter = completion.getChapterCompletionDossier(417);
  assert(chapter?.completeness === 100 && chapter.fields.length > 40, 'Chapter 417 forensic dossier is not available to the normal chapter surface');

  const princes = completion.getPrinceCompletionDossiers(417);
  assert(princes.length === 14 && princes.every((row) => row.completeness === 100), 'all fourteen prince dossiers are not available to the Royal Family surface');

  const investigations = completion.getInvestigationCompletion(417);
  for (const id of ['silent-majority', 'beyond-network', 'troupe-hisoka', 'mafia-war']) {
    assert(investigations.some((row) => row.id === id && row.completeness === 100), `${id} is not available to normal investigation surfaces`);
  }

  const kakin = completion.getKakinCompletion(417);
  assert(kakin.completeness === 100 && kakin.reference.length > 0, 'full Kakin reference is not available to the Royal Family surface');

  const knowledge = completion.getKnowledgeCompletion(417);
  assert(knowledge.completeness === 100 && knowledge.topics.length > 0, 'full information-war matrix is not available to the Research surface');

  const nen = completion.getNenCompletion();
  assert(nen.completeness === 100 && nen.count > 0, 'general Nen records are not available to the encyclopedia surface');

  const glossary = completion.getGlossaryCompletion(417);
  assert(glossary.completeness === 100 && glossary.count > 0, 'glossary records are not available to the normal glossary surface');

  const ledgers = completion.getLedgerCompletion(417);
  assert(ledgers.length > 0 && ledgers.every((row) => row.completeness === 100), 'operational ledgers are not available to normal record surfaces');

  const crossLinks = completion.getCrossLinkCoverage(417);
  assert(crossLinks.completeness === 100 && crossLinks.count > 0, 'cross-link health is not available to normal record surfaces');

  console.log(`Succession user-surface completion audit passed: ${chapter.fields.length} Chapter 417 fields, ${princes.length} prince dossiers, ${investigations.length} investigation families, ${kakin.reference.length} Kakin reference families, ${knowledge.topics.length} information-war topics, ${nen.count} Nen records, ${glossary.count} glossary terms, ${ledgers.length} operational ledgers, and ${crossLinks.count} graph-checked entities are wired to normal site routes.`);
} finally {
  await vite.close();
}
