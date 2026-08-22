import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession story comprehension audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const dossiers = [414, 415, 416, 417].map((chapter) => archive.getChapterStoryDossier(chapter));
  const knowledge = archive.getKnowledgeWarfareMatrix(417);
  const published = knowledge.filter((record) => Number.isFinite(Number(record.publicAtChapter)) && Number(record.publicAtChapter) <= 417);

  for (const dossier of dossiers) {
    assert(dossier?.chapter?.number, 'chapter dossier is unavailable');
    assert(Array.isArray(dossier.laneDossiers) && dossier.laneDossiers.length > 0, `Chapter ${dossier.chapter.number} has no lane dossiers`);
    assert(Array.isArray(dossier.events), `Chapter ${dossier.chapter.number} has no event collection`);
    assert(Array.isArray(dossier.openThreads) && Array.isArray(dossier.resolvedThreads), `Chapter ${dossier.chapter.number} thread state is unavailable`);
    assert(Array.isArray(dossier.incomingCausalLinks) && Array.isArray(dossier.outgoingCausalLinks), `Chapter ${dossier.chapter.number} causal links are unavailable`);
  }
  assert(Array.isArray(knowledge) && knowledge.length > 0, 'knowledge records are unavailable for disclosure timing');
  assert(published.every((record) => Number(record.publicAtChapter) <= 417), 'disclosure timeline includes a future public chapter');

  const [panel, panelCss, disclosureCss, now] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionStoryComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionStoryComprehensionPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionDisclosureTimeline.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNowDashboard.jsx'), 'utf8'),
  ]);

  for (const token of [
    'Story-lane matrix',
    'Chapter intelligence card',
    'Cause → event → consequence',
    'Open-thread pressure board',
    'Disclosure timeline',
    'Why this boundary matters',
    'Time-bound signal',
  ]) assert(panel.includes(token), `visual story layer is missing ${token}`);

  assert(panel.includes('eventTouchesChapter'), 'lane activity is not chapter-bounded');
  assert(panel.includes('dossier.laneDossiers') && panel.includes('openThreads'), 'lane matrix is not derived from canonical Story Intelligence dossiers');
  assert(panel.includes('causalityClass') && panel.includes('evidenceState'), 'causal presentation is not preserving causal/evidence classes');
  assert(panel.includes('Showing {visible.length} of {unique.length} causal links'), 'causal top-N subset is not disclosed');
  assert(panel.includes('Showing {visible.length} of {rows.length} open threads'), 'open-thread top-N subset is not disclosed');
  assert(panel.includes('getKnowledgeWarfareMatrix') && panel.includes('Number.isFinite(Number(record.publicAtChapter))'), 'disclosure timeline is not bounded to explicit public chapters');
  assert(panel.includes('Secret or otherwise non-public knowledge stays off the timeline rather than receiving an inferred reveal date.'), 'disclosure timeline lacks its no-inferred-date contract');
  assert(panel.includes('A character learning something privately is not treated as public disclosure.'), 'private knowledge is not explicitly separated from public disclosure');
  assert(panel.includes('Showing the latest {visible.length} of {published.length} explicit public-disclosure records.'), 'disclosure top-N subset is not disclosed');
  assert(now.includes('SuccessionStoryComprehensionPanel'), 'Story comprehension is not mounted beneath the NOW briefing');

  assert(panelCss.includes('position: sticky') && panelCss.includes('thead th') && panelCss.includes('tbody th'), 'story-lane matrix does not preserve sticky scan anchors');
  assert(panelCss.includes('is-enabling-condition') && panelCss.includes('is-contextual') && panelCss.includes('is-sequence-only'), 'causal classes are not visually distinguishable');
  for (const css of [panelCss, disclosureCss]) {
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'story comprehension must not introduce mobile/tablet breakpoints');
    assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'story comprehension must preserve reduced-motion handling');
    const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert(fontSizes.every((size) => size >= 11), `story comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  }

  console.log(`Succession story comprehension audit passed: Chapters ${dossiers.map((dossier) => dossier.chapter.number).join(', ')} expose lane, causal, thread, chapter-briefing, and ${published.length} explicit public-disclosure records to the visual layer.`);
} finally {
  await vite.close();
}
