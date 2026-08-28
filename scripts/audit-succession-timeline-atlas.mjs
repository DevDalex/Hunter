import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { timelineEventCount } from '../src/data/successionTimeline.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Timeline System audit failed: ${message}`);
};

const [explorer, explorerStyles, completeStyles, workspace, switcher, app, packageJson] = await Promise.all([
  read('src/components/TimelineArchiveExplorer.jsx'),
  read('src/components/TimelineArchiveExplorer.css'),
  read('src/components/TimelineCompleteSystem.css'),
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/TimelineWorkspaceSwitcher.jsx'),
  read('src/App.jsx'),
  read('package.json'),
]);

assert(timelineEventCount === 1555, `the unabridged chronology must contain 1,555 records; found ${timelineEventCount}`);

for (const token of [
  'Semantic chronology',
  'Story minimap',
  'Search people, places, events, evidence',
  'All story threads',
  'Major only',
  'Complete event record',
  'Cause and consequence',
  'Related chronology',
  'Open full dossier',
  'still hidden from the DOM, not from the archive',
]) assert(explorer.includes(token), `Archive explorer is missing ${token}`);

for (const density of ['recap', 'story', 'full']) {
  assert(explorer.includes(`id: '${density}'`), `semantic density is missing ${density}`);
}

for (const helper of [
  'successionPreludeEvents',
  'successionDays',
  'timelineEventCount',
  'timelinePhaseForChapter',
  'successionTimelinePhases',
  'mediaForTimelinePhase',
  'peopleForTimelineEvent',
  'timelineCausalityForEvent',
  'timelineImportance',
  'timingConfidenceForEvent',
  'evidenceConfidenceForEvent',
]) assert(explorer.includes(helper), `canonical timeline integration is missing ${helper}`);

for (const feature of [
  'function PhaseStrip',
  'function PhaseFocus',
  'function DensityGraph',
  'function TimelineEventRow',
  'function EventInspector',
  'function sequenceGroups',
  'function relatedEventsFor',
  'const DISPLAY_BATCH = 120',
  'filteredEvents.slice(0, displayLimit)',
  'setDisplayLimit((current) => current + DISPLAY_BATCH)',
  'activePhase && event.phase.id !== activePhase',
  'activeTrack && !(event.tracks || []).includes(activeTrack)',
  "majorOnly && event.importance !== 'major'",
  'activeFrom !== null && event.chapter < activeFrom',
  'activeTo !== null && event.chapter > activeTo',
]) assert(explorer.includes(feature), `large-timeline presentation is missing ${feature}`);

for (const mode of ['archive', 'story', 'compare', 'atlas', 'space']) {
  assert(switcher.includes(`id: '${mode}'`), `workspace switcher is missing ${mode}`);
}
assert(switcher.includes("return 'archive';"), 'Archive is not the default Timeline lens');

for (const integration of [
  'TimelineArchiveExplorer',
  'TimelineContextNavigator',
  'TimelineStoryField',
  'TimelineStoryTopography',
  'TimelineSemanticLandmarks',
  'TimelineComparisonBuilder',
  'TimelineIntelligencePanels',
  'TimelineSpatialIntelligence',
  'TimelineCharacterSpatialFollower',
  'TimelineEventFocus',
  'TimelineCausalityGraphInstrument',
  'NenInteractionGraphInstrument',
]) assert(workspace.includes(integration), `TimelineWorkspace does not integrate ${integration}`);

assert(workspace.includes("focus === 'dossier'"), 'full event dossier is not addressable from Timeline state');
assert(workspace.includes('timeline-workspace--complete-system'), 'unified dark Timeline shell class is missing');
assert(app.includes('const readTimelineState'), 'production App does not parse Timeline state from the URL');
assert(app.includes('const commitTimelineState'), 'production App does not serialize Timeline state back to the URL');
assert(app.includes('requestedState={timelineState}'), 'production Timeline does not hydrate URL state');
assert(app.includes('onNavigate={commitTimelineState}'), 'production Timeline navigation is still a no-op');

for (const selector of [
  '.timeline-workspace--complete-system',
  '.tae-density-graph > button',
  '.tae-phase-focus',
  '.tae-sequence',
  '.tae-inspector__visual',
  '.timeline-system-event-drawer',
]) assert(completeStyles.includes(selector), `unified timeline styling is missing ${selector}`);

assert(explorerStyles.includes('grid-template-columns: minmax(0, 1.68fr) minmax(320px, .95fr)'), 'desktop chronology and inspector do not match the approved dashboard proportions');
assert(explorerStyles.includes('overflow-y: auto'), 'large event collections are not contained in local scroll regions');
assert(completeStyles.includes('content-visibility: auto'), 'offscreen archive clusters are not browser-contained');
assert(packageJson.includes('audit:succession-timeline-atlas'), 'package scripts must retain the timeline audit command');

console.log('Succession Timeline System audit passed: 1,555 canonical records power a URL-addressable dark Archive plus semantic Map, Compare, Research, Space, causal graphs, image landmarks, clustered sequences, and full event dossiers.');
