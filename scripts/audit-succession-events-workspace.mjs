import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession event workspace audit failed: ${message}`);
};

const [workspace, styles, app, dataEntry, selectors] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveEventWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveEventWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/eventKnowledgeSelectors.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'EventsWorkspace', './SuccessionArchiveEventWorkspace'), 'app must load the dedicated canonical event workspace');
assert(!app.includes('  EventsWorkspace,\n  GuardianBeastsWorkspace,'), 'app must not import the legacy event workspace from deep workspaces');
assert(sourceRendersRouteWith(app, 'events', 'EventsWorkspace'), 'events route must render the dedicated canonical workspace');
assert(workspace.includes('getStoryEventsKnownAtChapter'), 'workspace must consume chapter-bounded event projections');
assert(!workspace.includes("getEntitiesByType('event')"), 'workspace must not render raw event entities directly');
assert(workspace.includes('event.consequenceEventIds'), 'workspace must render available event consequence links');
assert(workspace.includes('event.causes'), 'workspace must expose canonical causes');
assert(workspace.includes('event.outcomes'), 'workspace must expose only available outcomes');
assert(workspace.includes('selected.stateChanges'), 'workspace must expose bounded temporal state changes');
assert(workspace.includes('selected.openQuestions'), 'workspace must expose bounded research questions');
assert(workspace.includes('participantIds'), 'workspace must link visible event participants');
assert(workspace.includes('organizationIds'), 'workspace must link visible event organizations');
assert(workspace.includes('locationIds'), 'workspace must link visible event locations');
assert(workspace.includes('abilityIds'), 'workspace must link visible event abilities');
assert(workspace.includes('SourceReference'), 'workspace must display chapter-bounded evidence');
assert(workspace.includes('knowledgeBoundary'), 'workspace must distinguish the filter chapter from the global spoiler limit');
assert(workspace.includes('type="number"'), 'workspace must provide chapter filtering');
assert(workspace.includes('All factions'), 'workspace must provide faction filtering');
assert(workspace.includes('All locations'), 'workspace must provide location filtering');
assert(workspace.includes('All abilities'), 'workspace must provide ability filtering');
assert(dataEntry.includes('createEventKnowledgeSelectors') && dataEntry.includes('getStoryEventKnowledgeAtChapter'), 'public data entry must expose canonical event knowledge');
assert(selectors.includes('Later operational details and outcomes remain hidden'), 'in-progress event summaries must hide later details');
assert(selectors.includes('outcomes: mature ?') && selectors.includes('stateChanges: mature ?'), 'outcomes and state changes must be gated by event maturity');
assert(selectors.includes('consequenceEventIds') && selectors.includes('predecessorEventIds'), 'event graph links must be chapter-bounded');
assert(styles.includes('.succession-event-causality'), 'styles must own the causal presentation');
assert(styles.includes('.succession-event-chain'), 'styles must own predecessor and consequence navigation');
assert(styles.includes('@media (max-width: 820px)'), 'workspace must include responsive layout handling');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'workspace must include reduced-motion handling');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getEntitiesByType,
    getStoryEventKnowledgeAtChapter,
    getStoryEventsKnownAtChapter,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'canonical archive schema must remain valid');
  const events = getEntitiesByType('event');
  assert(events.length >= 29, `event runtime layer must retain at least 29 records, found ${events.length}`);
  assert(typeof getStoryEventKnowledgeAtChapter === 'function', 'single-event knowledge selector must remain public');
  assert(typeof getStoryEventsKnownAtChapter === 'function', 'event directory knowledge selector must remain public');

  for (const event of events) {
    assert(getStoryEventKnowledgeAtChapter(event.id, event.chapterRange.start)?.id === event.id, `${event.id} must appear at its opening chapter`);
    assert(getStoryEventKnowledgeAtChapter(event.id, event.chapterRange.start - 1) === null, `${event.id} must remain hidden before its opening chapter`);
  }

  const breach394 = getStoryEventKnowledgeAtChapter('event:room-3101-breach', 394);
  assert(breach394 && !breach394.mature, 'Room 3101 must remain in progress at Chapter 394');
  assert(!breach394.summary.toLocaleLowerCase().includes('transmitter'), 'Chapter 394 summary must hide the later transmitter placement');
  assert(breach394.outcomes.length === 0 && breach394.stateChanges.length === 0, 'Chapter 394 must hide later Room 3101 outcomes and state changes');
  assert(!breach394.sourceIds.includes('source:chapter-400'), 'Chapter 394 must hide the Chapter 400 source');

  const breach400 = getStoryEventKnowledgeAtChapter('event:room-3101-breach', 400);
  assert(breach400?.mature, 'Room 3101 must become fully documented by Chapter 400');
  assert(breach400.summary.toLocaleLowerCase().includes('transmitter'), 'Chapter 400 summary must reveal the transmitter investigation');
  assert(breach400.sourceIds.includes('source:chapter-400'), 'Chapter 400 evidence must include its source');

  const secondClass411 = getStoryEventKnowledgeAtChapter('event:second-room-1014-nen-class', 411);
  assert(secondClass411 && !secondClass411.mature, 'the second Room 1014 class must remain in progress at Chapter 411');
  assert(secondClass411.outcomes.length === 0, 'Chapter 411 must hide later class outcomes');
  const secondClass413 = getStoryEventKnowledgeAtChapter('event:second-room-1014-nen-class', 413);
  assert(secondClass413?.mature, 'the second Room 1014 class must mature at Chapter 413');
  assert(secondClass413.outcomes.length > 0 || secondClass413.stateChanges.length > 0, 'Chapter 413 must expose the maintained class result');

  const events394 = getStoryEventsKnownAtChapter(394);
  assert(events394.some((event) => event.id === 'event:room-3101-breach' && !event.mature), 'Chapter 394 directory must use the bounded Room 3101 projection');
  assert(!events394.some((event) => event.canonicalChapterRange.start > 394), 'event directory must not include future events');

  console.log(`Succession event workspace audit passed: ${events.length} canonical events, chapter-bounded summaries, outcomes, state changes, linked entities, evidence, causality, filters, and responsive presentation are wired.`);
} finally {
  await vite.close();
}
