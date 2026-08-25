import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { successionArchiveRoutes } from '../src/data/succession/archiveRoutes.js';
import {
  getSuccessionExplorerProfile,
  successionExplorerDepthLevels,
  successionExplorerRouteIds,
  successionExplorerSharedCapabilities,
} from '../src/data/succession/explorerCapabilities.js';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [stateSource, canvasSource, surfaceSource, entrySource, shellSource, modelSource] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerState.jsx'),
  read('../src/components/succession/SuccessionExplorerCanvas.jsx'),
  read('../src/components/succession/SuccessionExplorerSurface.jsx'),
  read('../src/components/succession/SuccessionArchiveEntry.jsx'),
  read('../src/components/succession/SuccessionArchiveShell.jsx'),
  read('../src/data/succession/explorerModel.js'),
]);

const ids = (items) => items.map((item) => item.id);

const routeExpectations = Object.freeze({
  archive: ['command', 'world', 'resume'],
  story: ['braid', 'phases', 'guided', 'pressure', 'causality'],
  timeline: ['atlas', 'braid', 'matrix', 'causality', 'heatmap', 'playback', 'diff', 'trails'],
  reader: ['sync', 'context', 'annotations', 'research'],
  search: ['spotlight', 'timeline', 'ship', 'graph', 'matrix'],
  characters: ['atlas', 'activity', 'relationships', 'knowledge', 'compare', 'timeline'],
  princes: ['board', 'dynasty', 'protection', 'pressure', 'compare', 'timeline'],
  queens: ['dynasty', 'influence', 'guards', 'timeline', 'compare'],
  bodyguards: ['command', 'assignments', 'reporting', 'targets', 'timeline', 'matrix'],
  organizations: ['power', 'hierarchy', 'territory', 'objectives', 'dependencies', 'compare', 'timeline'],
  'black-whale': ['atlas', 'occupancy', 'events', 'paths', 'heatmap', 'control', 'playback'],
  locations: ['tree', 'history', 'occupancy', 'routes', 'events', 'abilities'],
  nen: ['systems', 'mechanics', 'taxonomy', 'conditions', 'interactions', 'timeline', 'threat', 'compare', 'hypotheses'],
  'guardian-spirit-beasts': ['ecology', 'hosts', 'ritual', 'mechanics', 'compare', 'timeline'],
  events: ['constellation', 'anatomy', 'operations', 'causality', 'compare', 'density'],
  relationships: ['graph', 'temporal', 'neighborhood', 'path', 'compare', 'timeline'],
  chapters: ['matrix', 'dossier', 'diff', 'previously', 'impact', 'density'],
  research: ['evidence', 'claims', 'certainty', 'contradictions', 'coverage', 'gaps'],
  glossary: ['concepts', 'graph', 'context', 'examples', 'evidence'],
});

test('every maintained Succession route is a first-class Explorer instrument', () => {
  assert.deepEqual([...successionExplorerRouteIds].sort(), successionArchiveRoutes.map((route) => route.id).sort());
  for (const route of successionArchiveRoutes) {
    const profile = getSuccessionExplorerProfile(route.id);
    assert.equal(profile.defaultView, profile.views[0]?.id, `${route.id} default view must lead its view set`);
    assert.ok(profile.lenses.some((item) => item.id === profile.defaultLens), `${route.id} default lens must exist`);
    for (const expectedView of routeExpectations[route.id]) {
      assert.ok(ids(profile.views).includes(expectedView), `${route.id} is missing ${expectedView}`);
    }
  }
});

test('semantic zoom and global research state are universal rather than route-specific patches', () => {
  assert.deepEqual(ids(successionExplorerDepthLevels), ['pulse', 'recap', 'study', 'research', 'complete']);
  for (const capabilityId of ['chapter-state', 'perspective', 'comparison', 'watchlist', 'history', 'deep-link', 'cross-route']) {
    assert.ok(ids(successionExplorerSharedCapabilities).includes(capabilityId), `missing shared ${capabilityId} capability`);
  }
  for (const token of [
    "const STORAGE_KEY = 'hxh:succession-explorer:v1'",
    'chapter,',
    "perspective: 'reader'",
    'selectedIds: []',
    'compareIds: []',
    'routeViews: {}',
    'routeLenses: {}',
    'cameras: {}',
    'history: []',
    'bookmarks: []',
    'collections: { Watchlist: [] }',
    'notes: {}',
    'buildDeepLinkParams',
  ]) assert.ok(stateSource.includes(token), `persistent Explorer state is missing ${token}`);
});

test('atlas renderer implements camera navigation, semantic visibility, clustering, minimap, and keyboard access', () => {
  for (const token of [
    'semanticNodeVisible',
    'clusterNodes',
    'onPointerDown',
    'onPointerMove',
    'onPointerUp',
    'onWheel',
    'onDoubleClick',
    'onKeyDown',
    'onMinimapPointerDown',
    "event.key === 'ArrowLeft'",
    "event.key.toLowerCase() === 'f'",
    "event.key === '0'",
    'fit(selectedNode || null)',
    'ResizeObserver',
  ]) assert.ok(canvasSource.includes(token), `Explorer canvas is missing ${token}`);
  assert.ok(!canvasSource.includes('<svg'), 'heavy Explorer worlds must not be hand-authored SVG diagrams');
});

test('the unified surface exposes time, perspective, playback, comparison, notes, diff, knowledge, and path analysis', () => {
  for (const token of [
    'Time machine',
    'PerspectiveControl',
    'succession-explorer-playback',
    'CompareTray',
    'Research note',
    'DiffPanel',
    'KnowledgePanel',
    'PathPanel',
    'CapabilityDeck',
    'Save / copy view',
    'Open synchronized Timeline',
  ]) assert.ok(surfaceSource.includes(token), `Explorer surface is missing ${token}`);
});

test('live archive models exist for every major information grammar', () => {
  for (const builder of [
    'buildTimeline',
    'buildCharacters',
    'buildRoyal',
    'buildAssignments',
    'buildOrganizations',
    'buildLocations',
    'buildNen',
    'buildEvents',
    'buildRelationships',
    'buildChapters',
    'buildResearch',
    'buildGlossary',
    'buildSearch',
    'buildStory',
  ]) assert.ok(modelSource.includes(`const ${builder}`), `missing ${builder}`);
  for (const dataToken of [
    'successionPreludeEvents',
    'successionDays',
    'getActiveAssignmentsAtChapter',
    'getActiveRelationshipsAtChapter',
    'getLocationChildren',
    'getKnowledgeMatrix',
  ]) assert.ok(modelSource.includes(dataToken), `model layer does not consume ${dataToken}`);
});

test('the Explorer provider wraps every route and the surface mounts inside the shared archive shell', () => {
  assert.ok(entrySource.includes('<SuccessionExplorerProvider spoilerLimit={props.spoilerLimit}>'));
  assert.ok(entrySource.includes('routeId="archive"'));
  assert.ok(shellSource.includes('<SuccessionExplorerSurface'));
  assert.ok(shellSource.includes('routeId={route.id}'));
  assert.ok(shellSource.includes('getRoutePresentationProfile(route.id, { spoilerLimit })'));
});
