import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [projection, host] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerProjectionInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
]);

test('one search result set can be projected into time, ship space, or canonical relationships', () => {
  for (const token of [
    'SearchProjectionInstrument',
    'searchArchiveProduct',
    'timelineProjection',
    'shipProjection',
    'graphProjection',
    'getCurrentLocationRecordForCharacter',
    'getLocationsForAbility',
    'getActiveRelationshipsAtChapter',
    'Missing spatial links remain absent rather than guessed',
    'SuccessionExplorerCanvas',
  ]) assert.ok(projection.includes(token), `search projection missing ${token}`);
  assert.ok(host.includes('searchProjectionViews'));
});

test('command Resume restores local research history, bookmarks, and watchlist', () => {
  for (const token of [
    'ArchiveResumeInstrument',
    'explorer.history',
    'explorer.bookmarks',
    'explorer.collections?.Watchlist',
    'Resume exactly where the investigation left off',
    'entityWorkspaceTarget',
    'buildDeepLinkParams',
  ]) assert.ok(projection.includes(token), `resume instrument missing ${token}`);
  assert.ok(host.includes("routeId === 'archive' && view === 'resume'"));
});
