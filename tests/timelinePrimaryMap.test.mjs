import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const shell = readFileSync(new URL('../src/components/succession/SuccessionArchiveShell.jsx', import.meta.url), 'utf8');
const workspace = readFileSync(new URL('../src/components/TimelineWorkspace.jsx', import.meta.url), 'utf8');
const explorer = readFileSync(new URL('../src/components/TimelineArchiveExplorer.jsx', import.meta.url), 'utf8');
const explorerCss = readFileSync(new URL('../src/components/TimelineArchiveExplorer.css', import.meta.url), 'utf8');

test('Timeline route remains an immersive surface rather than a generic Explorer dashboard', () => {
  assert.match(shell, /const immersiveTimeline = route\.id === 'timeline'/);
  assert.match(shell, /!immersiveTimeline && <Suspense[\s\S]*?<SuccessionExplorerSurface/);
  assert.match(shell, /immersiveTimeline && <h1 className="sr-only">Voyage Timeline<\/h1>/);
  assert.match(shell, /succession-archive--timeline-map/);
});

test('Timeline workspace mounts the scalable archive explorer as its primary presentation', () => {
  assert.match(workspace, /import TimelineArchiveExplorer from '\.\/TimelineArchiveExplorer'/);
  assert.match(workspace, /timeline-workspace timeline-workspace--archive-explorer/);
  assert.match(workspace, /<TimelineArchiveExplorer/);
  assert.doesNotMatch(workspace, /<TimelineStoryField/);
  assert.doesNotMatch(workspace, /<TimelineContextNavigator/);
});

test('semantic density keeps recap, story, and complete chronology in one data surface', () => {
  for (const mode of ['recap', 'story', 'full']) {
    assert.match(explorer, new RegExp(`id: '${mode}'`), `missing ${mode} density mode`);
  }
  assert.match(explorer, /if \(density === 'recap'\) return event\.importance === 'major'/);
  assert.match(explorer, /if \(density === 'story'\) return importanceRank\(event\.importance\) >= 2/);
  assert.match(explorer, /return true;/);
});

test('story minimap is generated from maintained Succession phases and real event counts', () => {
  assert.match(explorer, /successionTimelinePhases/);
  assert.match(explorer, /timelinePhaseForChapter/);
  assert.match(explorer, /function PhaseStrip/);
  assert.match(explorer, /function DensityGraph/);
  assert.match(explorer, /phaseStats/);
  assert.match(explorer, /activePhase/);
});

test('event rows preserve the research payload rather than compressing the source data', () => {
  assert.match(explorer, /peopleForTimelineEvent/);
  assert.match(explorer, /timelineCausalityForEvent/);
  assert.match(explorer, /timingConfidenceForEvent/);
  assert.match(explorer, /evidenceConfidenceForEvent/);
  assert.match(explorer, /event\.detail/);
  assert.match(explorer, /event\.source/);
  assert.match(explorer, /event\.tracks/);
});

test('large result sets stay bounded in the DOM without deleting archive events', () => {
  assert.match(explorer, /const DISPLAY_BATCH = 120/);
  assert.match(explorer, /const renderedEvents = filteredEvents\.slice\(0, displayLimit\)/);
  assert.match(explorer, /setDisplayLimit\(\(current\) => current \+ DISPLAY_BATCH\)/);
  assert.match(explorer, /still hidden from the DOM, not from the archive/);
});

test('timeline supports search, phase isolation, story-thread filters, and major-only scanning', () => {
  assert.match(explorer, /Search people, places, events, evidence/);
  assert.match(explorer, /All story threads/);
  assert.match(explorer, /activePhase && event\.phase\.id !== activePhase/);
  assert.match(explorer, /activeTrack && !\(event\.tracks \|\| \[\]\)\.includes\(activeTrack\)/);
  assert.match(explorer, /majorOnly && event\.importance !== 'major'/);
});

test('event inspector stays beside the chronology and preserves deep links', () => {
  assert.match(explorer, /function EventInspector/);
  assert.match(explorer, /Cause and consequence/);
  assert.match(explorer, /className="tae-inspector"/);
  assert.match(explorer, /chapter: event\.chapter/);
  assert.match(explorer, /event: event\.id/);
});

test('archive explorer owns a bounded two-pane desktop workspace', () => {
  assert.match(explorerCss, /\.timeline-workspace--archive-explorer[\s\S]*height: 100vh/);
  assert.match(explorerCss, /\.timeline-archive-explorer[\s\S]*grid-template-rows: auto auto auto minmax\(0, 1fr\)/);
  assert.match(explorerCss, /\.timeline-archive-explorer[\s\S]*width: min\(100% - 32px, 1180px\)/);
  assert.match(explorerCss, /\.tae-body[\s\S]*grid-template-columns: minmax\(0, 1\.68fr\) minmax\(320px, \.95fr\)/);
  assert.match(explorerCss, /\.tae-stream,[\s\S]*\.tae-inspector[\s\S]*overflow-y: auto/);
  assert.match(explorerCss, /\.tae-phase-strip[\s\S]*grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(explorerCss, /\.tae-density-graph[\s\S]*background: var\(--tae-orange\)/);
});
