import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSuccessionArchiveHub,
  getSuccessionArchiveRoute,
  successionArchiveHubs,
  successionArchiveRouteIds,
  successionArchiveRoutes,
} from '../src/data/succession/archiveRoutes.js';
import { normalizeSuccessionSemanticState } from '../src/data/succession/comprehensionDesignSystem.js';
import {
  SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT,
  SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT,
  SUCCESSION_ARCHIVE_COMPARE_LIMIT,
  SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT,
  defaultSuccessionArchiveMemory,
  withCreatedWatchlist,
  withRenamedWatchlist,
  withToggledArchiveBookmark,
  withToggledCompareItem,
  withUpdatedArchiveBookmarkMetadata,
  withUpdatedWatchlistMetadata,
} from '../src/data/succession/archiveMemory.js';

const item = (index) => ({ route: 'characters', entityId: `character:test-${index}`, label: `Test ${index}`, params: { entity: `character:test-${index}` } });

test('Succession routes and hubs stay unique and resolvable', () => {
  assert.equal(successionArchiveRouteIds.size, successionArchiveRoutes.length);
  assert.equal(new Set(successionArchiveHubs.map((hub) => hub.id)).size, successionArchiveHubs.length);
  for (const route of successionArchiveRoutes) assert.equal(getSuccessionArchiveRoute(route.id)?.id, route.id);
  for (const hub of successionArchiveHubs) assert.equal(getSuccessionArchiveHub(hub.target)?.id, hub.id);
});

test('semantic aliases preserve distinct evidence states', () => {
  assert.equal(normalizeSuccessionSemanticState('confirmed'), 'canon');
  assert.equal(normalizeSuccessionSemanticState('inferred'), 'inference');
  assert.equal(normalizeSuccessionSemanticState('translation-note'), 'translation');
  assert.equal(normalizeSuccessionSemanticState('theory'), 'theory');
  assert.equal(normalizeSuccessionSemanticState('disputed'), 'unresolved');
});

test('archive bookmarks enforce their declared metadata limits', () => {
  let state = withToggledArchiveBookmark(defaultSuccessionArchiveMemory, item(1), new Date('2026-08-22T00:00:00Z'));
  state = withUpdatedArchiveBookmarkMetadata(state, item(1), {
    folder: 'x'.repeat(SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT + 20),
    tags: Array.from({ length: SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT + 5 }, (_, index) => `tag-${index}`),
  });
  assert.equal(state.bookmarks.length, 1);
  assert.equal(state.bookmarks[0].folder.length, SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT);
  assert.equal(state.bookmarks[0].tags.length, SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT);
});

test('watchlist updates preserve identity and declared tag limits', () => {
  let state = withCreatedWatchlist(defaultSuccessionArchiveMemory, 'Original name', new Date('2026-08-22T00:00:00Z'));
  const id = state.watchlists[0].id;
  state = withRenamedWatchlist(state, id, 'Renamed investigation', new Date('2026-08-22T00:01:00Z'));
  state = withUpdatedWatchlistMetadata(state, id, {
    status: 'paused',
    tags: Array.from({ length: SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT + 3 }, (_, index) => `tag-${index}`),
  });
  assert.equal(state.watchlists[0].id, id);
  assert.equal(state.watchlists[0].name, 'Renamed investigation');
  assert.equal(state.watchlists[0].status, 'paused');
  assert.equal(state.watchlists[0].tags.length, SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT);
});

test('compare tray enforces its declared capacity', () => {
  const state = Array.from({ length: SUCCESSION_ARCHIVE_COMPARE_LIMIT + 4 }, (_, index) => item(index))
    .reduce((current, record) => withToggledCompareItem(current, record), defaultSuccessionArchiveMemory);
  assert.equal(state.compare.length, SUCCESSION_ARCHIVE_COMPARE_LIMIT);
});
