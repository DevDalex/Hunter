import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession search comprehension audit failed: ${message}`);
};
const normalize = (value) => String(value || '').toLocaleLowerCase();

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [ui, archive, mysteries, memory] = await Promise.all([
    vite.ssrLoadModule('/src/components/succession/SuccessionSearchComprehensionPanel.jsx'),
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/successionMysteryCases.js'),
    vite.ssrLoadModule('/src/data/succession/archiveMemory.js'),
  ]);
  const parse = ui.parseSuccessionSearchIntent;
  assert(parse('who is targeting Woble')?.type === 'targeting', 'targeting intent parser is missing');
  assert(parse('who knows about TSK-17')?.type === 'knowledge', 'knowledge intent parser is missing');
  assert(parse('what changed in chapter 417')?.chapter === 417, 'chapter-change intent parser is missing');
  assert(parse('where is Kurapika')?.type === 'location', 'location intent parser is missing');
  assert(parse('unresolved Tserriednich')?.type === 'unresolved', 'unresolved-case intent parser is missing');
  assert(parse('ordinary keyword search') === null, 'ordinary keyword search must remain outside the structured parser');

  const saved = memory.withSavedArchiveSearch(memory.defaultSuccessionArchiveMemory, 'who knows about TSK-17', 416, new Date('2026-08-21T00:00:00Z'));
  assert(saved.savedSearches.length === 1, 'saved-search reducer did not persist a query');
  assert(saved.savedSearches[0].chapter === 416, 'saved-search reducer did not preserve its chapter boundary');
  assert(saved.savedSearches[0].query === 'who knows about TSK-17', 'saved-search reducer altered the query text');

  const chapter = 417;
  const wobleThreats = archive.getThreatAssassinationMatrix(chapter).filter((row) => normalize(row.target?.name).includes('woble'));
  assert(wobleThreats.length > 0, 'Chapter 417 Woble targeting direct answer has no maintained threat records');
  const tskKnowledge = archive.getKnowledgeWarfareMatrix(chapter).filter((row) => normalize(`${row.name} ${row.acquisition || ''}`).includes('tsk-17'));
  assert(tskKnowledge.length > 0, 'Chapter 417 TSK-17 knowledge direct answer has no maintained knowledge records');
  const kurapika = archive.getEntitiesByType('character').find((record) => normalize(record.name).includes('kurapika'));
  const kurapikaState = kurapika ? archive.getCharacterStateAtChapter(kurapika.id, chapter) : null;
  assert(kurapika && kurapikaState, 'Kurapika chapter-bounded state is unavailable for location search');
  const change = archive.getChapterWhatChanged(chapter);
  assert(change && change.records.length > 0, 'Chapter 417 What Changed direct answer is empty');
  const tserriednichCases = mysteries.getSuccessionMysteryCasesAtChapter(chapter).filter((record) => record.status !== 'resolved' && normalize(`${record.title} ${record.question}`).includes('tserriednich'));
  assert(tserriednichCases.length > 0, 'Tserriednich unresolved-case direct answer is empty');

  const [app, panel, intentCss, searchCss] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSearchComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSearchComprehensionPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveSearch.css'), 'utf8'),
  ]);
  assert(app.includes('SuccessionSearchComprehensionPanel') && app.includes('parseSuccessionSearchIntent'), 'structured search is not mounted in the canonical Search workspace');
  assert(app.includes("intent?.type === 'changes' ? String(intent.chapter) : intent?.term || query"), 'structured questions do not feed a simplified term into canonical search');
  assert(app.includes('!visibleResults.length && !intent'), 'facet-aware search no-results handling is missing');
  for (const token of ['who is targeting Woble', 'who knows about TSK-17', 'what changed in chapter 417', 'where is Kurapika', 'unresolved Tserriednich']) assert(panel.includes(token), `search examples are missing ${token}`);
  assert(panel.includes('getCharacterStateAtChapter') && panel.includes('getThreatAssassinationMatrix') && panel.includes('getKnowledgeWarfareMatrix') && panel.includes('getChapterWhatChanged'), 'structured answers are not derived from canonical chapter-bounded selectors');
  assert(panel.includes('getSuccessionMysteryCasesAtChapter'), 'unresolved-case search is not bounded to published mystery cases');
  assert(panel.includes('saveSuccessionArchiveSearch(cleanQuery, chapter)'), 'Search does not persist the current query and chapter to Research Memory');
  assert(panel.includes("route?.target === 'search' ? route.params?.query : ''"), 'saved searches cannot rehydrate the Search query from route state');
  assert(panel.includes("if (!intent) return <SaveSearchControl"), 'ordinary keyword searches cannot be saved');
  assert(intentCss.includes('.succession-search-intent__save'), 'saved-search action has no presentation contract');

  for (const token of ['Result facets', 'Filter this result set by canonical domain', 'Search to analysis', 'Build event timeline', 'Inspect latest chapter delta', 'Open Research desk']) assert(app.includes(token), `Search workspace is missing ${token}`);
  assert(app.includes("const [facet, setFacet] = useState('all')") && app.includes("facet === 'all' ? results : results.filter"), 'domain facets do not filter the visible result set');
  assert(app.includes('visibleResults.length') && app.includes('results.length'), 'Search does not disclose visible versus total result counts');
  assert(app.includes("mode: 'compare'") && app.includes("view: 'differences'"), 'Search does not hand compatible matching records to difference-first Compare');
  assert(app.includes("onNavigate('timeline', { scope: 'events', search: canonicalQuery })"), 'Search does not hand the query to Timeline analysis');
  assert(searchCss.includes('.succession-search-complete__facets') && searchCss.includes('.succession-search-complete__analysis'), 'Search facet / analysis controls have no presentation contract');

  for (const css of [intentCss, searchCss]) {
    const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `search comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'structured search must not introduce mobile/tablet breakpoints');
    assert(css.includes('prefers-reduced-motion'), 'structured search must preserve reduced-motion handling');
  }

  console.log(`Succession search comprehension audit passed: saved-search round trips, domain facets, search-to-analysis handoffs, plus ${wobleThreats.length} Woble threat signals, ${tskKnowledge.length} TSK-17 knowledge records, ${change.records.length} Chapter 417 deltas, and ${tserriednichCases.length} Tserriednich open cases support direct answers.`);
} finally {
  await vite.close();
}
