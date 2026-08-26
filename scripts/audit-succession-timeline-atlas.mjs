import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { timelineEventCount } from '../src/data/successionTimeline.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Timeline Atlas audit failed: ${message}`);
};

const [atlas, atlasStyles, timeline, workspace, app, research, packageJson] = await Promise.all([
  read('src/components/SuccessionTimelineAtlas.jsx'),
  read('src/components/SuccessionTimelineAtlas.css'),
  read('src/components/SuccessionTimeline.jsx'),
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/data/successionTimelineResearch.js'),
  read('package.json'),
]);

assert(timelineEventCount === 1555, `the unabridged chronology must contain 1,555 records; found ${timelineEventCount}`);

for (const token of [
  'STATE OF THE VOYAGE',
  'Semantic zoom',
  'Chapter density navigator',
  'Voyage day navigator',
  'Previously in the Succession Contest',
  'Thread braid',
  'Canonical thread ledger',
  'Character lenses',
  'Royal status board',
  'Political comparison',
  'Black Whale location sync',
  'Ship-state comparison',
  'Knowledge warfare',
  'Operations tracker',
  'Deadline and countdown ledger',
  'Nen development history',
  'Mystery ledger',
  'Decision tracker',
  'Causal trails',
  'Evidence and uncertainty',
  'Chapter state diff',
  'Research memory',
  'COLLECTIONS / WATCHLISTS',
]) assert(atlas.includes(token), `atlas is missing ${token}`);

for (const depth of ['pulse', 'recap', 'study', 'research', 'complete']) {
  assert(atlas.includes(`id: '${depth}'`), `five-level semantic zoom is missing ${depth}`);
}
for (const view of ['overview', 'threads', 'people', 'ship', 'intelligence', 'research']) {
  assert(atlas.includes(`['${view}'`), `atlas navigation is missing ${view}`);
}
for (const view of ['knowledge', 'operations', 'deadlines', 'nen', 'mysteries', 'decisions', 'causality', 'evidence']) {
  assert(atlas.includes(`['${view}'`), `intelligence navigation is missing ${view}`);
}

for (const selector of [
  '.sta-state',
  '.sta-density',
  '.sta-days',
  '.sta-view-nav',
  '.sta-previously',
  '.sta-braid',
  '.sta-people__layout',
  '.sta-princes',
  '.sta-politics',
  '.sta-ship-index',
  '.sta-intel-nav',
  '.sta-decision-ledger',
  '.sta-causal-links',
  '.sta-diff',
  '.sta-memory',
  '.st-record__research-note',
]) assert(atlasStyles.includes(selector), `desktop editorial system is missing ${selector}`);

for (const token of [
  'SuccessionTimelineAtlas',
  'classifyTimelineEvent',
  'archiveItemForTimelineEvent',
  'readSuccessionArchiveMemory',
  'toggleSuccessionArchiveBookmark',
  'toggleSuccessionCompareItem',
  'toggleSuccessionWatchlistItem',
  'writeSuccessionTimelineNote',
  'data-reading-depth',
  'PAGE_SIZE',
  'visibleLimit',
  'Show all {filteredEvents.length}',
  'Copy deep link',
]) assert(timeline.includes(token), `timeline integration is missing ${token}`);

for (const arrangement of ['day', 'movement', 'thread', 'character', 'location', 'evidence']) {
  assert(timeline.includes(`['${arrangement}'`), `complete archive arrangement is missing ${arrangement}`);
}

for (const token of ['requestedState', 'onStateCommit']) assert(workspace.includes(token), `workspace deep-link bridge is missing ${token}`);
assert(app.includes('requestedState={routeParams}'), 'route parameters do not hydrate the timeline atlas');
for (const token of ['SUCCESSION_TIMELINE_NOTES_KEY', 'classifyTimelineEvent', 'archiveItemForTimelineEvent', 'writeSuccessionTimelineNote']) {
  assert(research.includes(token), `timeline research persistence is missing ${token}`);
}

assert(!atlas.includes('<svg'), 'analytical views must not use hand-authored SVG');
assert(!atlasStyles.includes('!important'), 'atlas CSS must not depend on important overrides');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(atlasStyles), 'atlas CSS must use archive design tokens instead of raw hex colors');
assert(!atlasStyles.includes('@media (max-width:'), 'this delivery explicitly excludes new mobile layout work');
assert(!atlasStyles.includes('backdrop-filter'), 'editorial surfaces must remain flat and authored');
assert(packageJson.includes('audit:succession-timeline-atlas'), 'package scripts must register the Atlas audit');

console.log('Succession Timeline Atlas audit passed: 1,555 records, five semantic depths, voyage state, chapter/day navigation, recap, threads, people, princes, politics, ship, intelligence, causality, evidence, dossiers, research memory, and permanent links are registered without a new mobile layer.');
