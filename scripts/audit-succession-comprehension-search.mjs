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
  const [ui, archive, mysteries] = await Promise.all([
    vite.ssrLoadModule('/src/components/succession/SuccessionSearchComprehensionPanel.jsx'),
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/successionMysteryCases.js'),
  ]);
  const parse = ui.parseSuccessionSearchIntent;
  assert(parse('who is targeting Woble')?.type === 'targeting', 'targeting intent parser is missing');
  assert(parse('who knows about TSK-17')?.type === 'knowledge', 'knowledge intent parser is missing');
  assert(parse('what changed in chapter 417')?.chapter === 417, 'chapter-change intent parser is missing');
  assert(parse('where is Kurapika')?.type === 'location', 'location intent parser is missing');
  assert(parse('unresolved Tserriednich')?.type === 'unresolved', 'unresolved-case intent parser is missing');
  assert(parse('ordinary keyword search') === null, 'ordinary keyword search must remain outside the structured parser');

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

  const [app, panel, css] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSearchComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSearchComprehensionPanel.css'), 'utf8'),
  ]);
  assert(app.includes('SuccessionSearchComprehensionPanel') && app.includes('parseSuccessionSearchIntent'), 'structured search is not mounted in the canonical Search workspace');
  assert(app.includes("intent?.type === 'changes' ? String(intent.chapter) : intent?.term || query"), 'structured questions do not feed a simplified term into canonical search');
  assert(app.includes('!results.length && !intent'), 'structured answers still trigger the generic no-results state');
  for (const token of ['who is targeting Woble', 'who knows about TSK-17', 'what changed in chapter 417', 'where is Kurapika', 'unresolved Tserriednich']) assert(panel.includes(token), `search examples are missing ${token}`);
  assert(panel.includes('getCharacterStateAtChapter') && panel.includes('getThreatAssassinationMatrix') && panel.includes('getKnowledgeWarfareMatrix') && panel.includes('getChapterWhatChanged'), 'structured answers are not derived from canonical chapter-bounded selectors');
  assert(panel.includes('getSuccessionMysteryCasesAtChapter'), 'unresolved-case search is not bounded to published mystery cases');

  const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `search comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'structured search must not introduce mobile/tablet breakpoints');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'structured search must preserve reduced-motion handling');

  console.log(`Succession search comprehension audit passed: ${wobleThreats.length} Woble threat signals, ${tskKnowledge.length} TSK-17 knowledge records, ${change.records.length} Chapter 417 deltas, and ${tserriednichCases.length} Tserriednich open cases support direct answers.`);
} finally {
  await vite.close();
}
