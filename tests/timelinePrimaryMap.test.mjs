import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const workspace = readFileSync(new URL('../src/components/TimelineWorkspace.jsx', import.meta.url), 'utf8');
const switcher = readFileSync(new URL('../src/components/TimelineWorkspaceSwitcher.jsx', import.meta.url), 'utf8');
const explorer = readFileSync(new URL('../src/components/TimelineArchiveExplorer.jsx', import.meta.url), 'utf8');
const explorerCss = readFileSync(new URL('../src/components/TimelineArchiveExplorer.css', import.meta.url), 'utf8');
const completeCss = readFileSync(new URL('../src/components/TimelineCompleteSystem.css', import.meta.url), 'utf8');
const cleanupCss = readFileSync(new URL('../src/components/TimelineCleanup.css', import.meta.url), 'utf8');

test('production Timeline hydrates and serializes real URL state', () => {
  assert.match(app, /const readTimelineState/);
  assert.match(app, /const timelineHref/);
  assert.match(app, /const commitTimelineState/);
  assert.match(app, /requestedState=\{timelineState\}/);
  assert.match(app, /onNavigate=\{commitTimelineState\}/);
  assert.match(app, /window\.addEventListener\('popstate'/);
  assert.doesNotMatch(app, /requestedState=\{\{\}\}/);
  assert.doesNotMatch(app, /onNavigate=\{\(\) => \{\}\}/);
});

test('Archive remains the default approved dark timeline presentation', () => {
  assert.match(switcher, /return 'archive';/);
  assert.match(workspace, /import TimelineArchiveExplorer from '\.\/TimelineArchiveExplorer'/);
  assert.match(workspace, /archiveActive && <TimelineArchiveExplorer/);
  assert.match(workspace, /timeline-workspace--archive-explorer/);
  assert.match(explorerCss, /\.timeline-workspace--archive-explorer/);
  assert.match(completeCss, /--st-paper: #000000/);
  assert.match(completeCss, /\.timeline-workspace--complete-system \.timeline-workspace-switcher/);
});

test('one chronology exposes Archive, Compare, Research, and Space lenses with Map retired', () => {
  for (const mode of ['archive', 'compare', 'atlas', 'space']) {
    assert.match(switcher, new RegExp(`id: '${mode}'`), `missing workspace mode ${mode}`);
  }
  assert.doesNotMatch(switcher, /id: 'story'/);
  assert.match(switcher, /state\.mode === 'story'\) return 'archive'/);
  for (const component of [
    'TimelineContextNavigator',
    'TimelineComparisonBuilder',
    'TimelineIntelligencePanels',
    'TimelineSpatialIntelligence',
    'TimelineCharacterSpatialFollower',
  ]) assert.match(workspace, new RegExp(component), `workspace no longer integrates ${component}`);
  for (const retired of ['TimelineStoryField', 'TimelineStoryTopography', 'TimelineSemanticLandmarks', 'timeline-system-mode--story']) {
    assert.doesNotMatch(workspace, new RegExp(retired), `retired Map surface remains mounted: ${retired}`);
  }
});

test('research lens restores canonical causal and Nen graph instruments', () => {
  assert.match(workspace, /SuccessionExplorerProvider/);
  assert.match(workspace, /TimelineCausalityGraphInstrument/);
  assert.match(workspace, /NenInteractionGraphInstrument/);
  assert.match(workspace, /See consequence, not just chronology/);
});

test('semantic density keeps recap, story, and complete chronology in one archive surface', () => {
  for (const mode of ['recap', 'story', 'full']) {
    assert.match(explorer, new RegExp(`id: '${mode}'`), `missing ${mode} density mode`);
  }
  assert.match(explorer, /if \(density === 'recap'\) return event\.importance === 'major'/);
  assert.match(explorer, /if \(density === 'story'\) return importanceRank\(event\.importance\) >= 2/);
});

test('archive minimap keeps eras and phase before-after context without the orange graph', () => {
  assert.match(explorer, /function PhaseStrip/);
  assert.match(explorer, /function PhaseFocus/);
  assert.match(explorer, /phase\.before/);
  assert.match(explorer, /phase\.after/);
  assert.match(explorer, /mediaForTimelinePhase/);
  assert.match(explorer, /activeFrom !== null && event\.chapter < activeFrom/);
  assert.match(explorer, /activeTo !== null && event\.chapter > activeTo/);
  assert.match(cleanupCss, /\.tae-density-graph[\s\S]*display: none !important/);
});

test('flat event wall is broken into chapter/day sequence clusters', () => {
  assert.match(explorer, /function sequenceGroups/);
  assert.match(explorer, /className="tae-sequence"/);
  assert.match(explorer, /visible sequences/);
  assert.match(completeCss, /\.tae-sequence/);
  assert.match(completeCss, /content-visibility: auto/);
});

test('event inspector preserves complete research payload and opens a richer dossier', () => {
  for (const helper of [
    'peopleForTimelineEvent',
    'timelineCausalityForEvent',
    'timingConfidenceForEvent',
    'evidenceConfidenceForEvent',
    'relatedEventsFor',
    'mediaForTimelinePhase',
  ]) assert.match(explorer, new RegExp(helper));
  assert.match(explorer, /Related chronology/);
  assert.match(explorer, /Previous/);
  assert.match(explorer, /Next/);
  assert.match(explorer, /Open full dossier/);
  assert.match(workspace, /TimelineEventFocus/);
  assert.match(workspace, /focus === 'dossier'/);
});

test('large result sets remain bounded while offscreen clusters use browser rendering containment', () => {
  assert.match(explorer, /const DISPLAY_BATCH = 120/);
  assert.match(explorer, /filteredEvents\.slice\(0, displayLimit\)/);
  assert.match(explorer, /setDisplayLimit\(\(current\) => current \+ DISPLAY_BATCH\)/);
  assert.match(explorer, /still hidden from the DOM, not from the archive/);
  assert.match(completeCss, /contain-intrinsic-size/);
});

test('timeline keeps the approved two-pane archive proportions and seven-era minimap', () => {
  assert.match(explorerCss, /\.tae-body[\s\S]*grid-template-columns: minmax\(0, 1\.68fr\) minmax\(320px, \.95fr\)/);
  assert.match(explorerCss, /\.tae-phase-strip[\s\S]*grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(cleanupCss, /display: none !important/);
});
