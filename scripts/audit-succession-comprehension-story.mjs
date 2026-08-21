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

  for (const dossier of dossiers) {
    assert(dossier?.chapter?.number, 'chapter dossier is unavailable');
    assert(Array.isArray(dossier.laneDossiers) && dossier.laneDossiers.length > 0, `Chapter ${dossier.chapter.number} has no lane dossiers`);
    assert(Array.isArray(dossier.events), `Chapter ${dossier.chapter.number} has no event collection`);
    assert(Array.isArray(dossier.openThreads) && Array.isArray(dossier.resolvedThreads), `Chapter ${dossier.chapter.number} thread state is unavailable`);
    assert(Array.isArray(dossier.incomingCausalLinks) && Array.isArray(dossier.outgoingCausalLinks), `Chapter ${dossier.chapter.number} causal links are unavailable`);
  }

  const [panel, panelCss, now] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionStoryComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionStoryComprehensionPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNowDashboard.jsx'), 'utf8'),
  ]);

  for (const token of [
    'Story-lane matrix',
    'Chapter intelligence card',
    'Cause → event → consequence',
    'Open-thread pressure board',
    'Why this boundary matters',
    'Time-bound signal',
  ]) assert(panel.includes(token), `visual story layer is missing ${token}`);

  assert(panel.includes('eventTouchesChapter'), 'lane activity is not chapter-bounded');
  assert(panel.includes("dossier.laneDossiers") && panel.includes("openThreads"), 'lane matrix is not derived from canonical Story Intelligence dossiers');
  assert(panel.includes('causalityClass') && panel.includes('evidenceState'), 'causal presentation is not preserving causal/evidence classes');
  assert(panel.includes('Showing {visible.length} of {unique.length} causal links'), 'causal top-N subset is not disclosed');
  assert(panel.includes('Showing {visible.length} of {rows.length} open threads'), 'open-thread top-N subset is not disclosed');
  assert(now.includes('SuccessionStoryComprehensionPanel'), 'Story comprehension is not mounted beneath the NOW briefing');

  assert(panelCss.includes('position: sticky') && panelCss.includes('thead th') && panelCss.includes('tbody th'), 'story-lane matrix does not preserve sticky scan anchors');
  assert(panelCss.includes('is-enabling-condition') && panelCss.includes('is-contextual') && panelCss.includes('is-sequence-only'), 'causal classes are not visually distinguishable');
  assert(!/@media\s*\([^)]*max-width:/i.test(panelCss), 'story comprehension must not introduce mobile/tablet breakpoints');
  assert(panelCss.includes('@media (prefers-reduced-motion: reduce)'), 'story comprehension must preserve reduced-motion handling');

  console.log(`Succession story comprehension audit passed: Chapters ${dossiers.map((dossier) => dossier.chapter.number).join(', ')} expose lane, causal, thread, and chapter-briefing data to the visual layer.`);
} finally {
  await vite.close();
}
