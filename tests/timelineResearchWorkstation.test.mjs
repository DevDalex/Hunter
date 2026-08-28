import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [workspace, workstation, memory, styles] = await Promise.all([
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/TimelineResearchWorkstation.jsx'),
  read('src/data/timelineResearchMemory.js'),
  read('src/components/TimelineResearchWorkstation.css'),
]);

test('Timeline mounts one persistent research workstation above every active chronology lens', () => {
  assert.match(workspace, /import TimelineResearchWorkstation from '\.\/TimelineResearchWorkstation';/);
  assert.match(workspace, /<TimelineResearchWorkstation[\s\S]*requestedState=\{modeState\}[\s\S]*onNavigate=\{navigateTimelineState\}/);
  assert.match(workspace, /TimelineArchiveExplorer/);
  assert.match(workspace, /TimelineComparisonBuilder/);
  assert.match(workspace, /TimelineIntelligencePanels/);
  assert.match(workspace, /TimelineSpatialIntelligence/);
  assert.doesNotMatch(workspace, /TimelineStoryField/);
});

test('research workstation exposes the complete investigation workflow', () => {
  for (const token of [
    'RESEARCH WORKSTATION',
    'COMMAND / STRUCTURED SEARCH',
    'structuredTimelineQuery',
    'EVIDENCE-FIRST INSPECTOR',
    'DISCREPANCY CHECK',
    'BREADCRUMBS',
    'PINNED RESEARCH',
    'trw-multipane',
    'HYPOTHESIS TRACKER',
    'QUESTION LEDGER',
    'CHAPTER RANGE DIFF',
    'TRACE MODE',
    'SYNCHRONIZED SOURCE',
    'SOURCE COVERAGE HEATMAP',
    'SAVED FILTERS',
    'KEYBOARD RESEARCH',
    'Event adjacency shortcuts',
    'ANNOTATIONS',
    'RESEARCH INBOX',
    'RESEARCH TRAIL',
    'EXPORT RESEARCH BUNDLE',
    'Markdown',
    'JSON',
  ]) assert.ok(workstation.includes(token), `missing research capability token: ${token}`);
});

test('local research memory keeps personal material separate from canonical chronology', () => {
  for (const token of [
    'TIMELINE_RESEARCH_MEMORY_KEY',
    'sessions',
    'activeSessionId',
    'pins',
    'inbox',
    'annotations',
    'hypotheses',
    'questions',
    'savedFilters',
    'trail',
    'createTimelineResearchSession',
    'toggleTimelineResearchPin',
    'addTimelineResearchInboxItem',
    'addTimelineResearchAnnotation',
    'addTimelineResearchHypothesis',
    'addTimelineResearchHypothesisEvidence',
    'addTimelineResearchQuestion',
    'saveTimelineResearchFilter',
    'recordTimelineResearchTrail',
  ]) assert.ok(memory.includes(token), `missing local research memory contract: ${token}`);
  assert.doesNotMatch(memory, /successionDays|successionPreludeEvents|writeSuccession/);
});

test('research workstation remains visually scoped and responsive without replacing the dark archive', () => {
  for (const selector of [
    '.timeline-research-dock',
    '.timeline-research-workstation',
    '.timeline-command-palette',
    '.trw-session-grid',
    '.trw-evidence-grid',
    '.trw-coverage-map',
    '.trw-question-columns',
    '.trw-full-trail',
  ]) assert.ok(styles.includes(selector), `missing research workstation selector: ${selector}`);
  assert.ok(styles.includes('@media (prefers-reduced-motion: reduce)'), 'research workstation must preserve reduced-motion handling');
});
