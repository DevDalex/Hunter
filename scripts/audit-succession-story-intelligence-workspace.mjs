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
assert(dataEntry.includes('createStoryIntelligenceSelectors'), 'public data entry must construct story selectors');
for (const selector of [
  'getStoryPhaseAtChapter', 'getStoryPhaseDossier', 'getStoryLanesAtChapter', 'getStoryLaneDossier',
  'getStoryThreadDossier', 'getStoryThreadsAtChapter', 'getStoryCausalGraphAtChapter',
  'getChapterStoryDossier', 'getStorySnapshotAtChapter', 'searchStoryIntelligence',
  'getStoryIntelligenceClosureReport',
]) assert(dataEntry.includes(selector), `public data entry must expose ${selector}`);
assert(entityLayer.includes('storyPhaseIds') && entityLayer.includes('storyLaneIds') && entityLayer.includes('storyThreadIds'), 'every chapter must receive story projections');
assert(entityLayer.includes('incomingCausalLinkIds') && entityLayer.includes('outgoingCausalLinkIds'), 'chapters must receive causal projections');
assert(foundation.includes('story-lane:expedition-frame') && foundation.includes('story-lane:justice-military'), 'all narrative edges must be represented as lanes');
assert(foundation.includes('story-phase:pending-current-release'), 'pending imported releases must have an explicit non-claim phase');
assert(foundation.includes('story-thread:succession-completion-condition') && foundation.includes('story-thread:sarahell-curse-operation'), 'major unresolved threads must be explicit');
assert(foundation.includes('story-cause:seed-urn-to-departure') && foundation.includes('story-cause:balsamilco-to-funeral'), 'major causal transitions must be explicit');
assert(selectors.includes('phaseCoverageIssues') && selectors.includes('phaseContinuityIssues'), 'closure must reject phase gaps and overlaps');
assert(selectors.includes('pending-maintained-research') || entityLayer.includes('pending-maintained-research'), 'pending research must remain explicit');

assert(storyWorkspace.includes('The arc as phases, parallel plotlines, causal turns, and unresolved questions'), 'Story workspace must expose the Batch 4 model');
assert(storyWorkspace.includes('Imported media and maintained story research remain separate'), 'Story workspace must preserve the research boundary');
assert(chapterWorkspace.includes('Every chapter placed inside phase, plotline, causality, and unresolved-story context'), 'Chapter workspace must expose canonical chapter dossiers');
assert(chapterWorkspace.includes('Reader media imported; maintained scene research pending'), 'Chapter workspace must preserve pending imported chapters');
assert(storyStyles.includes('@media(max-width:720px)') && chapterStyles.includes('@media(max-width:720px)'), 'both Batch 4 workspaces must include mobile layouts');
assert(storyStyles.includes('@media(prefers-reduced-motion:reduce)') && chapterStyles.includes('@media(prefers-reduced-motion:reduce)'), 'both Batch 4 workspaces must honor reduced motion');
assert(routes.includes('The authoritative narrative route') && routes.includes('Every Chapter 340 through the latest imported reader release'), 'route registry must describe canonical story and chapter intelligence');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getChapterStoryDossier,
    getEntitiesByType,
    getEntityById,
    getStoryCausalGraphAtChapter,
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
  assert(chapters.length === 75, `Chapter 340–414 coverage must contain 75 records, found ${chapters.length}`);
  assert(Object.keys(successionArchiveData.storyPhaseProfiles || {}).length === 11, 'Batch 4 must retain eleven contiguous phases');
  assert(Object.keys(successionArchiveData.storyLaneProfiles || {}).length === 7, 'Batch 4 must retain seven parallel story lanes');
  assert(Object.keys(successionArchiveData.storyThreadProfiles || {}).length >= 19, 'Batch 4 must retain at least nineteen explicit story threads');
  assert(Object.keys(successionArchiveData.storyCausalLinksById || {}).length >= 17, 'Batch 4 must retain at least seventeen causal links');

  const closure = getStoryIntelligenceClosureReport();
  assert(closure?.closureReady && closure.status === 'closed', 'Batch 4 story intelligence closure must be closed');
  assert(closure.phaseCoverageIssues.length === 0, 'every chapter must resolve exactly one story phase');
  assert(closure.phaseContinuityIssues.length === 0, 'story phases must be contiguous');
  assert(closure.missingReferences.length === 0, 'all story graph references must resolve');
  assert(closure.chapterProjectionIssues.length === 0, 'all documented chapters must retain phase, lane, and thread projections');
  assert(closure.pendingChapterIds.length === 1 && closure.pendingChapterIds[0] === 'chapter:414', 'only Chapter 414 should remain pending maintained research');

  for (const chapter of chapters) {
    assert(chapter.storyPhaseIds?.length === 1, `${chapter.id} must resolve exactly one phase`);
    assert(chapter.storyCoverage?.phase, `${chapter.id} must report phase coverage`);
    assert(Array.isArray(chapter.storyLaneIds) && Array.isArray(chapter.storyThreadIds), `${chapter.id} must publish lane and thread projections`);
    assert(Array.isArray(chapter.incomingCausalLinkIds) && Array.isArray(chapter.outgoingCausalLinkIds), `${chapter.id} must publish causal projections`);
  }

  const phaseExpectations = new Map([
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
    [414, 'story-phase:pending-current-release'],
  ]);
  for (const [chapter, phaseId] of phaseExpectations) assert(getStoryPhaseAtChapter(chapter)?.id === phaseId, `Chapter ${chapter} must resolve ${phaseId}`);

  const chapter383 = getChapterStoryDossier(383);
  assert(chapter383?.phase.id === 'story-phase:escape-failure-and-hidden-systems', 'Chapter 383 must resolve the escape-failure phase');
  assert(chapter383.startingEvents.some((event) => event.id === 'event:twin-prince-escape'), 'Chapter 383 must begin the twin escape event');
  assert(chapter383.threads.some(({ profile }) => profile.id === 'story-thread:kacho-consciousness'), 'Chapter 383 must open the Kacho identity thread');
  assert(chapter383.lanes.some((lane) => lane.id === 'story-lane:justice-military'), 'Chapter 383 must include the Justice lane');

  const chapter401 = getChapterStoryDossier(401);
  assert(chapter401?.startingEvents.some((event) => event.id === 'event:longhi-kurapika-treaty'), 'Chapter 401 must begin the Longhi treaty event');
  assert(chapter401.threads.some(({ profile }) => profile.id === 'story-thread:beyond-curse-target-map'), 'Chapter 401 must open Beyond’s curse-map thread');

  const chapter410 = getChapterStoryDossier(410);
  assert(chapter410?.continuingEvents.some((event) => event.id === 'event:borksen-recruitment-game'), 'Chapter 410 must continue the Borksen recruitment game');
  assert(chapter410.threads.some(({ profile }) => profile.id === 'story-thread:borksen-autonomy'), 'Chapter 410 must open Borksen’s autonomy thread');

  const chapter414 = getChapterStoryDossier(414);
  assert(chapter414?.phase.status === 'pending-maintained-research', 'Chapter 414 phase must remain pending');
  assert(chapter414.lanes.length === 0 && chapter414.events.length === 0 && chapter414.threads.length === 0, 'Chapter 414 must not manufacture story claims');

  assert(getStoryLaneDossier('story-lane:mafia-war', 377) === null, 'mafia-war lane must remain unavailable before Chapter 378');
  assert(getStoryLaneDossier('story-lane:mafia-war', 378)?.profile.id === 'story-lane:mafia-war', 'mafia-war lane must appear at Chapter 378');
  assert(getStoryThreadDossier('story-thread:borksen-autonomy', 409) === null, 'Borksen autonomy must remain hidden before Chapter 410');
  assert(getStoryThreadDossier('story-thread:borksen-autonomy', 410)?.status === 'open', 'Borksen autonomy must open at Chapter 410');
  assert(getStoryThreadDossier('story-thread:sale-sale-beast-threat', 380)?.status === 'resolved' ? false : true, 'Sale-sale threat must remain unresolved at Chapter 380');
  assert(getStoryThreadDossier('story-thread:sale-sale-beast-threat', 381)?.status === 'resolved', 'Sale-sale threat must resolve at Chapter 381');

  const snapshot384 = getStorySnapshotAtChapter(384);
  assert(!snapshot384.openThreads.some(({ profile }) => profile.id === 'story-thread:beyond-curse-target-map'), 'Chapter 384 must not expose the Chapter 401 curse-map thread');
  const snapshot413 = getStorySnapshotAtChapter(413);
  assert(snapshot413.openThreads.some(({ profile }) => profile.id === 'story-thread:sarahell-curse-operation'), 'Chapter 413 must retain Sarahell’s active curse thread');
  assert(snapshot413.openThreads.some(({ profile }) => profile.id === 'story-thread:martial-law-end-state'), 'Chapter 413 must retain martial-law uncertainty');

  const causal383 = getStoryCausalGraphAtChapter(383);
  assert(causal383.edges.some((link) => link.id === 'story-cause:seed-urn-to-departure'), 'causal graph must retain Seed Urn to departure');
  assert(causal383.edges.some((link) => link.id === 'story-cause:twin-escape-to-kacho-letters') === false, 'future Kacho letter consequence must remain hidden at Chapter 383');
  const causal413 = getStoryCausalGraphAtChapter(413);
  assert(causal413.edges.some((link) => link.id === 'story-cause:halkenburg-first-to-balsamilco'), 'causal graph must connect the two possession operations');
  assert(causal413.edges.some((link) => link.id === 'story-cause:balsamilco-to-funeral'), 'causal graph must connect possession to the funeral route');

  assert(searchStoryIntelligence('Burial chamber', { chapter: 413 }).some((result) => result.id === 'story-thread:burial-chamber-function'), 'story search must resolve the burial chamber thread');
  assert(!searchStoryIntelligence('Borksen autonomy', { chapter: 409 }).some((result) => result.id === 'story-thread:borksen-autonomy'), 'story search must hide future threads');
  assert(searchStoryIntelligence('Borksen autonomy', { chapter: 410 }).some((result) => result.id === 'story-thread:borksen-autonomy'), 'story search must reveal threads at their opening chapter');
  assert(searchStoryIntelligence('414', { chapter: 414, kind: 'chapter' }).some((result) => result.id === 'chapter:414'), 'story search must resolve the pending imported chapter without adding claims');

  for (const phase of Object.values(successionArchiveData.storyPhaseProfiles)) {
    const dossier = getStoryPhaseDossier(phase.id, 414);
    assert(dossier?.profile.id === phase.id, `${phase.id} must resolve a phase dossier`);
    for (const sourceId of phase.sourceIds) assert(getEntityById(sourceId)?.entityType === 'source', `${phase.id} references missing source ${sourceId}`);
  }
  for (const thread of getStoryThreadsAtChapter(413)) assert(thread.sources.length > 0, `${thread.profile.id} must retain chapter-bounded evidence`);

  console.log(`Succession Batch 4 story intelligence audit passed: ${closure.counts.chapters} chapter dossiers, ${closure.counts.phases} contiguous phases, ${closure.counts.lanes} parallel lanes, ${closure.counts.threads} story threads, ${closure.counts.causalLinks} causal links, one explicit pending release, and chapter-bounded search and narrative state.`);
} finally {
  await vite.close();
}
