import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { timelineEventCount } from '../src/data/successionTimeline.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Timeline Explorer audit failed: ${message}`);
};

const [explorer, explorerStyles, workspace, app, packageJson] = await Promise.all([
  read('src/components/TimelineArchiveExplorer.jsx'),
  read('src/components/TimelineArchiveExplorer.css'),
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('package.json'),
]);

assert(timelineEventCount === 1555, `the unabridged chronology must contain 1,555 records; found ${timelineEventCount}`);

for (const token of [
  'Semantic chronology',
  'Succession Timeline',
  'Story minimap',
  'Search people, places, events, evidence',
  'All story threads',
  'Major only',
  'Complete event record',
  'Cause and consequence',
  'still hidden from the DOM, not from the archive',
]) assert(explorer.includes(token), `explorer is missing ${token}`);

for (const density of ['recap', 'story', 'full']) {
  assert(explorer.includes(`id: '${density}'`), `semantic density is missing ${density}`);
}

for (const helper of [
  'successionPreludeEvents',
  'successionDays',
  'timelineEventCount',
  'timelinePhaseForChapter',
  'successionTimelinePhases',
  'peopleForTimelineEvent',
  'timelineCausalityForEvent',
  'timelineImportance',
  'timingConfidenceForEvent',
  'evidenceConfidenceForEvent',
]) assert(explorer.includes(helper), `canonical timeline integration is missing ${helper}`);

for (const feature of [
  'function PhaseStrip',
  'function DensityGraph',
  'function TimelineEventRow',
  'function EventInspector',
  'const DISPLAY_BATCH = 120',
  'filteredEvents.slice(0, displayLimit)',
  'setDisplayLimit((current) => current + DISPLAY_BATCH)',
  'activePhase && event.phase.id !== activePhase',
  'activeTrack && !(event.tracks || []).includes(activeTrack)',
  "majorOnly && event.importance !== 'major'",
]) assert(explorer.includes(feature), `large-timeline presentation is missing ${feature}`);

for (const selector of [
  '.timeline-workspace--archive-explorer',
  '.timeline-archive-explorer',
  '.tae-density-modes',
  '.tae-phase-strip',
  '.tae-density-graph',
  '.tae-toolbar',
  '.tae-body',
  '.tae-stream',
  '.tae-event',
  '.tae-inspector',
]) assert(explorerStyles.includes(selector), `explorer styling is missing ${selector}`);

assert(workspace.includes("import TimelineArchiveExplorer from './TimelineArchiveExplorer'"), 'TimelineWorkspace does not mount TimelineArchiveExplorer');
assert(workspace.includes('timeline-workspace--archive-explorer'), 'TimelineWorkspace does not expose the archive-explorer layout class');
assert(!workspace.includes('<TimelineStoryField'), 'legacy TimelineStoryField is still mounted by TimelineWorkspace');
assert(!workspace.includes('<TimelineContextNavigator'), 'legacy TimelineContextNavigator is still mounted by TimelineWorkspace');
assert(app.includes('requestedState={routeParams}'), 'route parameters do not hydrate the Timeline workspace');
assert(explorer.includes('requestedState.search'), 'route search is not hydrated into the explorer');
assert(explorer.includes('requestedState.event'), 'event deep links are not hydrated into the inspector');
assert(explorer.includes('chapter: event.chapter') && explorer.includes('event: event.id'), 'selected events do not preserve deep links');
assert(explorerStyles.includes('grid-template-columns: minmax(0, 1fr) minmax(300px, 31vw)'), 'desktop chronology and inspector are not presented as a two-pane workspace');
assert(explorerStyles.includes('overflow-y: auto'), 'large event collections are not contained in local scroll regions');
assert(packageJson.includes('audit:succession-timeline-atlas'), 'package scripts must retain the timeline audit command');

console.log('Succession Timeline Explorer audit passed: 1,555 records remain canonical, with recap/story/full density, seven-phase minimap navigation, bounded DOM rendering, search and thread filtering, and a persistent event inspector.');
