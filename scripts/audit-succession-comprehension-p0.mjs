import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession comprehension P0 audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, finishing] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthFinishingSelectors.js'),
  ]);

  const chapter = 417;
  const change = archive.getChapterWhatChanged(chapter);
  const dossier = archive.getChapterStoryDossier(chapter);
  const countdowns = archive.getActiveCountdowns(chapter);
  const threats = archive.getThreatAssassinationMatrix(chapter);
  const knowledge = archive.getKnowledgeWarfareMatrix(chapter);
  const factions = finishing.getFactionRecentChangeSummaries(chapter).filter((record) => record.changed);
  const spatial = finishing.getSpatialEvidenceIntelligence(chapter);

  assert(change?.chapter === 417 && change?.previousChapter === 416, 'NOW state must use the canonical 416 → 417 chapter transition');
  assert(Array.isArray(change?.records), 'chapter delta records are unavailable');
  assert(Array.isArray(dossier?.openThreads), 'open Story Intelligence threads are unavailable');
  assert(Array.isArray(countdowns?.threadIds) && Array.isArray(countdowns?.mysteryCaseIds), 'countdown signals are unavailable');
  assert(Array.isArray(threats) && Array.isArray(knowledge), 'threat/knowledge intelligence is unavailable');
  assert(Array.isArray(factions), 'faction change summaries are unavailable');
  assert(Array.isArray(spatial?.hotspots) && Number.isFinite(Number(spatial?.summary?.changedLocations)), 'spatial-state intelligence is unavailable');

  const [shell, dashboard, dashboardCss, contextBar, contextCss] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNowDashboard.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNowDashboard.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.css'), 'utf8'),
  ]);

  for (const token of ['SuccessionComprehensionBar', 'SuccessionNowDashboard']) assert(shell.includes(token), `archive shell is not mounting ${token}`);
  assert(shell.includes("const showNow = route.id === 'story';"), 'NOW dashboard is not anchored to the canonical Story workspace');
  assert(contextCss.includes('.succession-archive__sidebar-context { display: none; }'), 'duplicate sidebar Desk / Boundary context has not been suppressed');

  for (const token of [
    'Current-state briefing',
    'What changed?',
    'Unresolved story threads',
    'Who actually changed?',
    'Operational hotspots',
    'Countdown signals',
    'Knowledge claims',
    '60-second chapter',
    'Deep analysis',
  ]) assert(dashboard.includes(token), `NOW dashboard is missing ${token}`);

  assert(dashboard.includes('Showing {visibleChanges.length} of {changedRecords.length}'), 'changed-record truncation is not disclosed');
  assert(dashboard.includes('Showing {visibleThreads.length} of {openThreads.length}'), 'open-thread truncation is not disclosed');
  assert(dashboard.includes('Showing {visibleFactions.length} of {factions.length}'), 'faction truncation is not disclosed');
  assert(dashboard.includes('Showing {visibleHotspots.length} of {spatial.hotspots.length}'), 'hotspot truncation is not disclosed');

  for (const token of ['Viewing state', '60-second brief', 'State transition', 'Compare {previous} → {chapter}', 'Meaning']) assert(contextBar.includes(token), `global chapter context is missing ${token}`);
  for (const token of ['Canon', 'Inference', 'Theory', 'Editorial', 'Translation', 'Changed', 'Unresolved']) assert(contextBar.includes(token), `semantic legend is missing ${token}`);
  assert(contextCss.includes('.is-editorial'), 'Editorial semantic state has no distinct presentation treatment');
  assert(contextBar.includes('ARCHIVE_BOUNDARY') && contextBar.includes('onSpoilerChange(previous)') && contextBar.includes('onSpoilerChange(next)'), 'chapter scrub controls are not bound to the archive boundary');

  for (const css of [dashboardCss, contextCss]) {
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'comprehension layer must not introduce mobile/tablet breakpoints');
    assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'comprehension layer must retain reduced-motion handling');
  }

  console.log(`Succession comprehension P0 audit passed: Ch. ${chapter} NOW dashboard, complete semantic chapter controls, ${change.records.length} delta records, ${dossier.openThreads.length} open threads, ${threats.length} threat signals, ${knowledge.length} knowledge claims, and ${spatial.hotspots.length} spatial hotspots are wired.`);
} finally {
  await vite.close();
}
