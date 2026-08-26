import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSuccessionArchiveHub,
  getSuccessionArchiveRoute,
  successionArchiveHubs,
  successionArchiveRouteIds,
  successionArchiveRoutes,
} from '../src/data/succession/archiveRoutes.js';
import {
  normalizeSuccessionSemanticState,
  successionInformationHierarchy,
  successionSemanticStates,
} from '../src/data/succession/comprehensionDesignSystem.js';
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
import {
  chapterProgressFor,
  defaultReaderState,
  withReaderProgress,
} from '../src/components/succession-reader/readerState.js';

const item = (index) => ({
  route: 'characters',
  entityId: `character:test-${index}`,
  label: `Test ${index}`,
  params: { entity: `character:test-${index}` },
});

test('Succession routes and hubs remain unique and resolvable', () => {
  assert.equal(successionArchiveRoutes.length, 19);
  assert.equal(successionArchiveRouteIds.size, successionArchiveRoutes.length);
  assert.equal(successionArchiveHubs.length, 7);
  for (const route of successionArchiveRoutes) assert.equal(getSuccessionArchiveRoute(route.id).id, route.id);
  for (const hub of successionArchiveHubs) assert.equal(getSuccessionArchiveHub(hub.target).id, hub.id);
});

test('semantic vocabulary normalizes aliases without collapsing theory or translation', () => {
  assert.equal(successionSemanticStates.length, 7);
  assert.deepEqual(successionInformationHierarchy.map((row) => row.id), ['briefing', 'intelligence', 'research']);
  assert.equal(normalizeSuccessionSemanticState('confirmed'), 'canon');
  assert.equal(normalizeSuccessionSemanticState('inferred'), 'inference');
  assert.equal(normalizeSuccessionSemanticState('translation-note'), 'translation');
  assert.equal(normalizeSuccessionSemanticState('theory'), 'theory');
  assert.equal(normalizeSuccessionSemanticState('disputed'), 'unresolved');
});

test('archive bookmarks retain bounded folder and tag metadata', () => {
  let state = withToggledArchiveBookmark(defaultSuccessionArchiveMemory, item(1), new Date('2026-08-22T00:00:00Z'));
  state = withUpdatedArchiveBookmarkMetadata(state, item(1), {
    folder: 'x'.repeat(SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT + 20),
    tags: Array.from({ length: SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT + 5 }, (_, index) => `tag-${index}`),
  });
  assert.equal(state.bookmarks.length, 1);
  assert.equal(state.bookmarks[0].folder.length, SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT);
  assert.equal(state.bookmarks[0].tags.length, SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT);
});

test('investigation rename preserves stable identity and bounded tags', () => {
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

test('compare tray enforces its four-record boundary', () => {
  const state = Array.from({ length: 8 }, (_, index) => item(index))
    .reduce((current, record) => withToggledCompareItem(current, record), defaultSuccessionArchiveMemory);
  assert.equal(state.compare.length, SUCCESSION_ARCHIVE_COMPARE_LIMIT);
  assert.deepEqual(state.compare.map((record) => record.entityId), ['character:test-4', 'character:test-5', 'character:test-6', 'character:test-7']);
});

test('Reader progress remains authoritative for chapter/page resume', () => {
  const state = withReaderProgress(defaultReaderState, {
    chapter: 417,
    page: 15,
    pageCount: 20,
    mode: 'page',
    fit: 'width',
    direction: 'rtl',
    theme: 'black',
    zoom: 100,
  });
  assert.equal(state.lastChapter, 417);
  assert.equal(state.lastPage, 15);
  assert.equal(chapterProgressFor(state, 417).page, 15);
  assert.equal(chapterProgressFor(state, 417).percent, 75);
});
