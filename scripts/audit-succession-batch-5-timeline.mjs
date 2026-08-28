import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';
import { timelineEventCount } from '../src/data/successionTimeline.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 5 timeline audit failed: ${message}`); };

const [workspace, explorer, switcher, completeStyles, phaseData, timelineData, intelligence, intelligenceData, intelligenceView, questionLedger, workflow, finalQa, app] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/TimelineArchiveExplorer.jsx'),
  read('src/components/TimelineWorkspaceSwitcher.jsx'),
  read('src/components/TimelineCompleteSystem.css'),
  read('src/data/successionTimelinePresentation.js'),
  read('src/data/successionTimeline.js'),
  read('src/components/TimelineIntelligencePanels.jsx'),
  read('src/data/successionTimelineIntelligence.js'),
  read('src/data/successionTimelineIntelligenceView.js'),
  read('src/data/successionTimelineQuestions.js'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
  read('scripts/succession-final-release-qa.mjs'),
  read('src/App.jsx'),
]);

assert(timelineEventCount === 1555, `complete chronology must remain 1,555 records; found ${timelineEventCount}`);

for (const token of [
  'TimelineArchiveExplorer',
  'TimelineContextNavigator',
  'TimelineStoryField',
  'TimelineStoryTopography',
  'TimelineSemanticLandmarks',
  'TimelineComparisonBuilder',
  'TimelineIntelligencePanels',
  'TimelineSpatialIntelligence',
  'TimelineEventFocus',
  'TimelineCausalityGraphInstrument',
  'NenInteractionGraphInstrument',
]) assert(workspace.includes(token), `unified Timeline workspace is missing ${token}`);

for (const mode of ['archive', 'story', 'compare', 'atlas', 'space']) {
  assert(switcher.includes(`id: '${mode}'`), `five-lens Timeline is missing ${mode}`);
}
assert(switcher.includes("return 'archive';"), 'approved dark Archive must remain the default lens');

for (const token of [
  'Semantic chronology',
  'Story minimap',
  "id: 'recap'",
  "id: 'story'",
  "id: 'full'",
  'function PhaseFocus',
  'function DensityGraph',
  'function sequenceGroups',
  'function relatedEventsFor',
  'const DISPLAY_BATCH = 120',
  'Open full dossier',
  'Related chronology',
]) assert(explorer.includes(token), `dark Archive explorer is missing ${token}`);

for (const id of ['foundation', 'sealed-room', 'public-nen', 'lower-decks', 'failed-escape', 'convergence', 'martial-law']) {
  assert(phaseData.includes(`id: '${id}'`), `seven-movement presentation model is missing ${id}`);
}
for (const token of ['startChapter', 'endChapter', 'focusTracks', 'spotlightTerms', 'before:', 'after:', 'mediaForTimelinePhase', '/media/succession-contest/chapters/']) {
  assert(phaseData.includes(token), `timeline presentation data is missing ${token}`);
}
assert((phaseData.match(/id: '/g) || []).length === 7, 'timeline presentation must contain exactly seven maintained movements');
for (const token of ['export const successionPreludeEvents', 'maintainedPreludeByChapter', 'periodTitle', '+ successionPreludeEvents.length']) {
  assert(timelineData.includes(token), `complete pre-voyage event exposure is missing ${token}`);
}

for (const token of [
  'What happened, why it mattered, and what it changed.',
  'Integrated chronology',
  'All fourteen princes',
  'Open ↔ resolved ↔ all',
  'Nen developments',
  'Active deadlines & countdowns',
  'End-of-day synthesis',
  'What changed?',
  'timelineQuestionLedger',
  'strictTimelineNenForEvent',
]) assert(intelligence.includes(token), `research Timeline is missing ${token}`);

for (const token of [
  'timelinePrinceProfiles',
  'timelineCausality',
  'timelineDayChanges',
  'timelineDeadlines',
  'timelineNenDevelopments',
  'timelineImportance',
  'timingConfidenceForEvent',
  'evidenceConfidenceForEvent',
  'peopleForTimelineEvent',
]) assert(intelligenceData.includes(token), `timeline intelligence data is missing ${token}`);

assert((intelligenceData.match(/order:\s*\d+,\s*name:/g) || []).length === 14, 'Timeline intelligence must retain all fourteen princes');
for (let day = 1; day <= 12; day += 1) assert(intelligenceData.includes(`day: ${day},`), `end-of-day synthesis is missing Voyage Day ${day}`);
for (const token of ['strictTimelineNenForEvent', 'developmentMatchers']) assert(intelligenceView.includes(token), `strict Nen matching is missing ${token}`);
for (const token of ['timelineQuestionLedger', 'open:', 'resolved:']) assert(questionLedger.includes(token), `Timeline question ledger is missing ${token}`);

for (const selector of [
  '.timeline-workspace--complete-system',
  '.tae-density-graph > button',
  '.tae-phase-focus',
  '.tae-sequence',
  '.timeline-system-event-drawer',
]) assert(completeStyles.includes(selector), `complete Timeline styling is missing ${selector}`);

for (const token of ['const readTimelineState', 'const commitTimelineState', 'legacyTimelineDestination', 'requestedState={timelineState}', 'onNavigate={commitTimelineState}']) {
  assert(app.includes(token), `production URL integration is missing ${token}`);
}

assertReleasedSuccessionRoutes(['timeline'], assert, 'Succession release manifest');
assert(workflow.includes('node scripts/audit-succession-batch-5-timeline.mjs'), 'Batch 5 workflow must retain this timeline audit');
assert(finalQa.includes('...successionReleaseRoutes.map'), 'release matrix must retain Timeline rendering coverage');
assert(workflow.includes('set -o pipefail'), 'final visual-QA command must propagate failures through tee');

console.log('Succession Batch 5 timeline audit passed: the original seven-movement research contracts now feed the unified dark 1,555-record Archive, semantic Map, Compare, Research, Space, and full event dossier system.');
