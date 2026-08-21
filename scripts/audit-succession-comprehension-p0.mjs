import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession comprehension P0 audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, finishing, designSystem] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthFinishingSelectors.js'),
    vite.ssrLoadModule('/src/data/succession/comprehensionDesignSystem.js'),
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

  const semanticLabels = designSystem.successionSemanticStates.map((state) => state.label);
  for (const token of ['Canon', 'Inference', 'Theory', 'Editorial', 'Translation', 'Changed', 'Unresolved']) {
    assert(semanticLabels.includes(token), `semantic design system is missing ${token}`);
  }

  const kurapika = archive.getEntitiesByType('character').find((record) => /kurapika/i.test(record.name));
  const kurapikaState = kurapika ? archive.getEntityStateAtChapter(kurapika.id, chapter) : null;
  const kurapikaDiff = kurapika ? archive.getChapterStateDiff(416, 417, { types: ['character'], changedOnly: false }).records.find((record) => record.entity.id === kurapika.id) : null;
  assert(kurapika && kurapikaState && kurapikaDiff, 'universal entity briefing inputs are unavailable for a maintained character');

  const [shell, dashboard, dashboardCss, contextBar, contextCss, quick, quickCss, semanticBadge, semanticCss] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNowDashboard.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNowDashboard.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEntityQuickBriefing.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEntityQuickBriefing.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSemanticStateBadge.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSemanticStateBadge.css'), 'utf8'),
  ]);

  for (const token of ['SuccessionComprehensionBar', 'SuccessionNowDashboard', 'SuccessionEntityQuickBriefing']) assert(shell.includes(token), `archive shell is not mounting ${token}`);
  assert(shell.includes("const showNow = route.id === 'story';"), 'NOW dashboard is not anchored to the canonical Story workspace');
  assert(shell.includes('resolveBriefingEntity') && shell.includes('briefingEntity && <SuccessionEntityQuickBriefing'), 'universal entity briefing is not resolved and mounted through the shell');
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
  assert(contextBar.includes('successionSemanticStates') && contextBar.includes('SuccessionSemanticStateBadge'), 'semantic legend is not rendered from the shared semantic-state source');
  assert(semanticBadge.includes('successionSemanticStateMap') && semanticBadge.includes('data-semantic-state'), 'shared semantic badge is not bound to the semantic-state registry');
  for (const state of ['canon', 'inference', 'theory', 'editorial', 'translation', 'changed', 'unresolved']) assert(semanticCss.includes(`.succession-semantic-state.is-${state}`), `semantic state ${state} has no distinct presentation treatment`);
  assert(contextBar.includes('ARCHIVE_BOUNDARY') && contextBar.includes('onSpoilerChange(previous)') && contextBar.includes('onSpoilerChange(next)'), 'chapter scrub controls are not bound to the archive boundary');

  for (const token of ['Five-second briefing', 'Recent change', 'Evidence', 'Unknown / unresolved', 'Connected state', 'Open canonical dossier', 'Research context', 'Character mini timeline', 'Maintained state changes through Chapter']) assert(quick.includes(token), `universal entity briefing is missing ${token}`);
  assert(quick.includes('getEntityStateAtChapter') && quick.includes('getChapterStateDiff') && quick.includes('getSourcesForEntity'), 'entity briefing is not derived from canonical state/diff/evidence selectors');
  assert(quick.includes('stateSentence') && quick.includes('unresolvedFields'), 'entity briefing lacks its standard current-state sentence or unresolved-state treatment');
  assert(quick.includes('characterStateSignature') && quick.includes('for (let chapter = 340; chapter <= boundary; chapter += 1)') && quick.includes("entity.entityType === 'character' && <CharacterMiniTimeline"), 'universal character mini timeline is not derived and mounted from chapter-bounded character state');
  assert(quick.includes('unchanged chapters are intentionally collapsed') && quick.includes('Showing the latest {visible.length} of {points.length} maintained state-change points.'), 'character mini timeline lacks its no-fake-change boundary or subset disclosure');
  assert(quickCss.includes('.succession-entity-quick__timeline ol') && quickCss.includes('overflow-x: auto') && quickCss.includes('role') === false, 'character mini timeline visual container is missing');

  for (const css of [dashboardCss, contextCss, quickCss, semanticCss]) {
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'comprehension layer must not introduce mobile/tablet breakpoints');
    assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'comprehension layer must retain reduced-motion handling');
    const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert(fontSizes.every((size) => size >= 11), `P0 comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  }

  console.log(`Succession comprehension P0 audit passed: Ch. ${chapter} NOW dashboard, universal entity briefing with character mini timelines, shared seven-state semantic legend, complete semantic chapter controls, ${change.records.length} delta records, ${dossier.openThreads.length} open threads, ${threats.length} threat signals, ${knowledge.length} knowledge claims, and ${spatial.hotspots.length} spatial hotspots are wired.`);
} finally {
  await vite.close();
}
