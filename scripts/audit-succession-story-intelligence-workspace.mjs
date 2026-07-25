import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession story intelligence audit failed: ${message}`);
};

const [
  app,
  storyWorkspace,
  storyStyles,
  chapterWorkspace,
  chapterStyles,
  dataEntry,
  entityLayer,
  foundation,
  corrections,
  selectors,
  routes,
] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveChapterStoryWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveChapterStoryWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/entitiesStoryIntelligenceFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/storyIntelligenceFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/storyIntelligenceCorrections.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/storyIntelligenceSelectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/archiveRoutes.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'StoryIntelligenceWorkspace', './SuccessionArchiveStoryIntelligenceWorkspace'), 'app must import the dedicated Story Intelligence workspace');
assert(sourceImportsDefault(app, 'ChapterStoryWorkspace', './SuccessionArchiveChapterStoryWorkspace'), 'app must import the dedicated Chapter Story workspace');
assert(sourceRendersRouteWith(app, 'story', 'StoryIntelligenceWorkspace'), 'story route must render StoryIntelligenceWorkspace');
assert(sourceRendersRouteWith(app, 'chapters', 'ChapterStoryWorkspace'), 'chapters route must render ChapterStoryWorkspace');
assert(declarationIncludesLiteral(app, 'dedicated', 'story'), 'story must remain a dedicated route');
assert(declarationIncludesLiteral(app, 'dedicated', 'chapters'), 'chapters must remain a dedicated route');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'chapters'), 'chapter deep links must remain inside the canonical chapter dossier');
assert(!app.includes('SuccessionStoryWorkspace'), 'legacy Story workspace must not remain active');
assert(!app.includes('ChapterRecordsWorkspaceV2'), 'legacy ChapterRecordsWorkspaceV2 must not remain active');

assert(dataEntry.includes("from './entitiesStoryIntelligenceFoundation.js'"), 'public data entry must activate the Batch 4 foundation');
assert(dataEntry.includes('createEventKnowledgeSelectors'), 'public data entry must construct chapter-bounded event knowledge');
assert(dataEntry.includes('createStoryIntelligenceSelectors'), 'public data entry must construct story selectors');
for (const selector of [
  'getStoryEventKnowledgeAtChapter', 'getStoryEventsKnownAtChapter',
  'getStoryPhaseAtChapter', 'getStoryPhaseDossier', 'getStoryLanesAtChapter', 'getStoryLaneDossier',
  'getStoryThreadDossier', 'getStoryThreadsAtChapter', 'getStoryCausalGraphAtChapter',
  'getChapterStoryDossier', 'getStorySnapshotAtChapter', 'searchStoryIntelligence',
  'getStoryIntelligenceClosureReport',
]) assert(dataEntry.includes(selector), `public data entry must expose ${selector}`);

assert(entityLayer.includes('lastDocumentedChapter') && entityLayer.includes('pendingChapters'), 'pending story phases must be generated from imported chapter data');
assert(entityLayer.includes('storyPhaseIds') && entityLayer.includes('storyLaneIds') && entityLayer.includes('storyThreadIds'), 'every chapter must receive story projections');
assert(entityLayer.includes('incomingCausalLinkIds') && entityLayer.includes('outgoingCausalLinkIds'), 'chapters must receive causal projections');
assert(foundation.includes('story-lane:expedition-frame') && foundation.includes('story-lane:justice-military'), 'all narrative edges must be represented as lanes');
assert(foundation.includes('story-phase:pending-current-release'), 'the foundation must retain a pending-phase template');
assert(foundation.includes('story-thread:succession-completion-condition') && foundation.includes('story-thread:sarahell-curse-operation'), 'major unresolved threads must be explicit');
assert(foundation.includes('story-cause:seed-urn-to-departure') && foundation.includes('story-cause:balsamilco-to-funeral'), 'major causal transitions must be explicit');
assert(corrections.includes('story-thread:hisoka-chrollo-deathmatch-outcome'), 'Heavens Arena chapters must retain a bounded outcome thread');
assert(selectors.includes('phaseCoverageIssues') && selectors.includes('phaseContinuityIssues'), 'closure must reject phase gaps and overlaps');
assert(selectors.includes('phasePresentationAtChapter') && selectors.includes('lanePresentationAtChapter'), 'phase and lane copy must be chapter-bounded');
assert(selectors.includes('eventAtChapter') && selectors.includes('eventProjectionIssues'), 'all story composition must use bounded event projections');

assert(storyWorkspace.includes('The arc as phases, parallel plotlines, causal turns, and unresolved questions'), 'Story workspace must expose the Batch 4 model');
assert(storyWorkspace.includes('phasePresentation') && storyWorkspace.includes('laneDossiers'), 'Story workspace must render bounded phase and lane copy');
assert(chapterWorkspace.includes('Every chapter placed inside phase, plotline, causality, and unresolved-story context'), 'Chapter workspace must expose canonical chapter dossiers');
assert(chapterWorkspace.includes('requestedAllowed') && chapterWorkspace.includes('boundedSelectedNumber'), 'chapter deep links must clamp to the spoiler boundary');
assert(storyStyles.includes('@media(max-width:720px)') && chapterStyles.includes('@media(max-width:720px)'), 'both Batch 4 workspaces must include mobile layouts');
assert(storyStyles.includes('@media(prefers-reduced-motion:reduce)') && chapterStyles.includes('@media(prefers-reduced-motion:reduce)'), 'both Batch 4 workspaces must honor reduced motion');
assert(routes.includes('latest imported reader release'), 'route registry must follow imported chapter availability');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getChapterStoryDossier,
    getEntitiesByType,
    getEntityById,
    getStoryCausalGraphAtChapter,
    getStoryEventKnowledgeAtChapter,
    getStoryIntelligenceClosureReport,
    getStoryLaneDossier,
    getStoryPhaseAtChapter,
    getStoryPhaseDossier,
    getStorySnapshotAtChapter,
    getStoryThreadDossier,
    getStoryThreadsAtChapter,
    searchStoryIntelligence,
    successionArchiveData,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'canonical archive schema must remain valid');
  const chapters = getEntitiesByType('chapter');
  const firstChapter = chapters[0]?.number;
  const latestChapter = chapters.at(-1)?.number;
  assert(Number.isFinite(firstChapter) && Number.isFinite(latestChapter), 'chapter catalogue must expose numeric boundaries');
  assert(chapters.length === latestChapter - firstChapter + 1, `chapter records must be contiguous from ${firstChapter} through ${latestChapter}`);
  assert(Object.keys(successionArchiveData.storyPhaseProfiles || {}).length >= 11, 'Batch 4 must retain documented phases plus any generated pending phase');
  assert(Object.keys(successionArchiveData.storyLaneProfiles || {}).length === 7, 'Batch 4 must retain seven parallel story lanes');
  assert(Object.keys(successionArchiveData.storyThreadProfiles || {}).length >= 20, 'Batch 4 must retain at least twenty explicit story threads');
  assert(Object.keys(successionArchiveData.storyCausalLinksById || {}).length >= 17, 'Batch 4 must retain at least seventeen causal links');

  const closure = getStoryIntelligenceClosureReport();
  assert(closure?.closureReady && closure.status === 'closed', 'Batch 4 story intelligence closure must be closed');
  assert(closure.counts.chapters === chapters.length, 'closure chapter count must follow the canonical chapter catalogue');
  assert(closure.chapterRange.start === firstChapter && closure.chapterRange.end === latestChapter, 'closure range must follow canonical chapter boundaries');
  assert(closure.phaseCoverageIssues.length === 0, 'every chapter must resolve exactly one story phase');
  assert(closure.phaseContinuityIssues.length === 0, 'story phases must be contiguous');
  assert(closure.missingReferences.length === 0, 'all story graph references must resolve');
  assert(closure.chapterProjectionIssues.length === 0, 'all chapters must retain valid phase projections');
  assert(closure.eventProjectionIssues.length === 0, 'every canonical event must resolve bounded opening and mature projections');

  const phases = Object.values(successionArchiveData.storyPhaseProfiles);
  const documentedEnd = Math.max(...phases.filter((phase) => phase.status !== 'pending-maintained-research').map((phase) => phase.chapterRange.end ?? phase.chapterRange.start));
  const expectedPendingIds = chapters.filter((chapter) => chapter.number > documentedEnd).map((chapter) => chapter.id);
  assert(JSON.stringify(closure.pendingChapterIds) === JSON.stringify(expectedPendingIds), 'pending story records must exactly match imported chapters after the last documented phase');
  const pendingPhase = phases.find((phase) => phase.status === 'pending-maintained-research');
  if (expectedPendingIds.length) {
    assert(pendingPhase, 'imported chapters after documented research must generate a pending phase');
    assert(pendingPhase.chapterRange.start === documentedEnd + 1 && pendingPhase.chapterRange.end === latestChapter, 'pending phase must span every unannotated imported chapter');
  }

  for (const chapter of chapters) {
    assert(chapter.storyPhaseIds?.length === 1, `${chapter.id} must resolve exactly one phase`);
    assert(chapter.storyCoverage?.phase, `${chapter.id} must report phase coverage`);
    assert(Array.isArray(chapter.storyLaneIds) && Array.isArray(chapter.storyThreadIds), `${chapter.id} must publish lane and thread projections`);
    assert(Array.isArray(chapter.incomingCausalLinkIds) && Array.isArray(chapter.outgoingCausalLinkIds), `${chapter.id} must publish causal projections`);
  }

  const historicalPhaseExpectations = new Map([
    [340, 'story-phase:expedition-setup'],
    [349, 'story-phase:succession-preparation'],
    [351, 'story-phase:heavens-arena-consequence'],
    [358, 'story-phase:boarding-and-opening-crisis'],
    [368, 'story-phase:murders-classes-and-countermoves'],
    [377, 'story-phase:lower-tier-and-royal-escalation'],
    [383, 'story-phase:escape-failure-and-hidden-systems'],
    [391, 'story-phase:heil-ly-hunt-and-troupe-origin'],
    [401, 'story-phase:treaties-possession-and-convergence'],
    [407, 'story-phase:martial-law-funeral-and-recruitment'],
  ]);
  for (const [chapter, phaseId] of historicalPhaseExpectations) assert(getStoryPhaseAtChapter(chapter)?.id === phaseId, `Chapter ${chapter} must resolve ${phaseId}`);
  for (const chapterId of expectedPendingIds) {
    const chapterNumber = Number(chapterId.split(':').at(-1));
    const dossier = getChapterStoryDossier(chapterNumber);
    assert(dossier?.phase.status === 'pending-maintained-research', `${chapterId} must resolve the generated pending phase`);
    assert(dossier.lanes.length === 0 && dossier.events.length === 0 && dossier.threads.length === 0, `${chapterId} must not manufacture story claims`);
  }

  const chapter351 = getChapterStoryDossier(351);
  assert(chapter351?.threads.some(({ profile, status }) => profile.id === 'story-thread:hisoka-chrollo-deathmatch-outcome' && status === 'open'), 'Chapter 351 must open the Hisoka–Chrollo outcome thread');
  assert(!getStoryThreadDossier('story-thread:hisoka-chrollo-deathmatch-outcome', 351)?.evidenceState.toLocaleLowerCase().includes('revives'), 'Chapter 351 must not reveal the death-match resolution');
  assert(getStoryThreadDossier('story-thread:hisoka-chrollo-deathmatch-outcome', 357)?.status === 'resolved', 'Chapter 357 must resolve the Hisoka–Chrollo outcome thread');

  const chapter394 = getChapterStoryDossier(394);
  const breach394 = chapter394.events.find((event) => event.id === 'event:room-3101-breach');
  assert(breach394 && !breach394.mature && !breach394.summary.toLocaleLowerCase().includes('transmitter'), 'Chapter 394 dossier must hide the later Room 3101 transmitter outcome');
  const breach400 = getChapterStoryDossier(400).events.find((event) => event.id === 'event:room-3101-breach');
  assert(breach400?.mature && breach400.summary.toLocaleLowerCase().includes('transmitter'), 'Chapter 400 dossier must expose the mature Room 3101 record');

  const chapter401 = getChapterStoryDossier(401);
  assert(!chapter401.phasePresentation.summary.toLocaleLowerCase().includes('hisoka'), 'Chapter 401 phase copy must not preview the later Hisoka sighting');
  assert(!chapter401.phasePresentation.summary.toLocaleLowerCase().includes('balsamilco'), 'Chapter 401 phase copy must not preview the later Balsamilco operation');
  assert(getStoryLaneDossier('story-lane:mafia-war', 377) === null, 'mafia-war lane must remain unavailable before Chapter 378');
  assert(getStoryThreadDossier('story-thread:borksen-autonomy', 409) === null, 'Borksen autonomy must remain hidden before Chapter 410');
  assert(getStoryThreadDossier('story-thread:borksen-autonomy', 410)?.status === 'open', 'Borksen autonomy must open at Chapter 410');

  const snapshot413 = getStorySnapshotAtChapter(413);
  assert(snapshot413.openThreads.some(({ profile }) => profile.id === 'story-thread:sarahell-curse-operation'), 'Chapter 413 must retain Sarahell’s active curse thread');
  const causal413 = getStoryCausalGraphAtChapter(413);
  assert(causal413.edges.some((link) => link.id === 'story-cause:balsamilco-to-funeral'), 'causal graph must connect possession to the funeral route');
  assert(causal413.nodes.every((event) => event.chapterRange.end <= 413), 'causal graph nodes must be bounded event projections');

  assert(!searchStoryIntelligence('Predator destroying the beast', { chapter: 380 }).some((result) => result.id === 'story-thread:sale-sale-beast-threat'), 'story search must hide unresolved answers');
  assert(searchStoryIntelligence('Predator destroying the beast', { chapter: 381 }).some((result) => result.id === 'story-thread:sale-sale-beast-threat'), 'story search must reveal resolved answers at the resolution chapter');
  assert(searchStoryIntelligence(String(latestChapter), { chapter: latestChapter, kind: 'chapter' }).some((result) => result.id === `chapter:${latestChapter}`), 'story search must resolve the latest imported chapter without adding claims');

  const directBreach394 = getStoryEventKnowledgeAtChapter('event:room-3101-breach', 394);
  assert(directBreach394 && directBreach394.canonicalChapterRange.end === 394, 'direct event compatibility metadata must stop at Chapter 394');
  assert(directBreach394.matureChapter === null, 'an immature event must not reveal its maturity chapter');

  for (const phase of phases) {
    const boundary = Math.min(latestChapter, phase.chapterRange.end ?? latestChapter);
    const dossier = getStoryPhaseDossier(phase.id, boundary);
    assert(dossier?.profile.id === phase.id, `${phase.id} must resolve a phase dossier`);
    for (const sourceId of phase.sourceIds) assert(getEntityById(sourceId)?.entityType === 'source', `${phase.id} references missing source ${sourceId}`);
  }
  for (const thread of getStoryThreadsAtChapter(Math.min(413, latestChapter))) assert(thread.sources.length > 0, `${thread.profile.id} must retain chapter-bounded evidence`);

  console.log(`Succession Batch 4 story intelligence audit passed: ${closure.counts.chapters} contiguous chapter dossiers through ${latestChapter}, ${closure.counts.phases} phases, ${closure.counts.lanes} parallel lanes, ${closure.counts.threads} story threads, ${closure.counts.causalLinks} causal links, ${closure.counts.events} bounded events, ${closure.counts.pendingChapters} generated pending releases, and chapter-safe narrative text, search, opening, resolution, and causality.`);
} finally {
  await vite.close();
}
