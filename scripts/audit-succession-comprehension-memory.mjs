import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Research Memory audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const memory = await vite.ssrLoadModule('/src/data/succession/archiveMemory.js');
  const now = new Date('2026-08-21T12:00:00Z');
  const item = { route: 'characters', params: { entity: 'character:kurapika' }, entityId: 'character:kurapika', label: 'Kurapika', context: 'Chapter 417' };
  const secondItem = { route: 'characters', params: { entity: 'character:oito' }, entityId: 'character:oito', label: 'Oito', context: 'Chapter 417' };

  let state = memory.defaultSuccessionArchiveMemory;
  state = memory.withArchiveVisit(state, item, now);
  assert(state.recent.length === 1 && state.recent[0].entityId === 'character:kurapika', 'recent research visit was not retained');
  state = memory.withToggledArchiveBookmark(state, item, now);
  assert(state.bookmarks.length === 1, 'archive bookmark was not retained');
  state = memory.withToggledCompareItem(state, item);
  assert(state.compare.length === 1, 'compare tray item was not retained');
  state = memory.withSavedArchiveSearch(state, 'where is Kurapika', 417, now);
  assert(state.savedSearches.length === 1 && state.savedSearches[0].chapter === 417, 'saved search was not retained at its chapter boundary');
  state = memory.withCreatedWatchlist(state, 'Kurapika investigation', now);
  assert(state.watchlists.length === 1, 'research collection was not created');
  const watchlistId = state.watchlists[0].id;

  state = memory.withUpdatedWatchlistNote(state, watchlistId, 'Working thesis: verify Room 1014 pressure and evidence.', now);
  assert(state.watchlists[0].note.includes('Working thesis'), 'research collection note was not retained');
  state = memory.withUpdatedWatchlistMetadata(state, watchlistId, { status: 'paused', tags: 'kurapika, room-1014, evidence-gap' }, now);
  assert(state.watchlists[0].status === 'paused', 'investigation status was not retained');
  assert(state.watchlists[0].tags.join('|') === 'kurapika|room-1014|evidence-gap', 'investigation tags were not normalized and retained');
  state = memory.withToggledWatchlistCitation(state, watchlistId, 'source:chapter-417', now);
  assert(state.watchlists[0].citationIds.includes('source:chapter-417'), 'investigation citation selection was not retained');

  state = memory.withToggledWatchlistItem(state, watchlistId, item, now);
  state = memory.withToggledWatchlistItem(state, watchlistId, secondItem, now);
  assert(state.watchlists[0].items.length === 2, 'research collection items were not retained');
  const beforeMove = state.watchlists[0].items.map((record) => record.entityId).join('|');
  state = memory.withMovedWatchlistItem(state, watchlistId, 0, 'down', now);
  const afterMove = state.watchlists[0].items.map((record) => record.entityId).join('|');
  assert(beforeMove !== afterMove && state.watchlists[0].items[1].entityId === secondItem.entityId, 'investigation item ordering reducer did not move the selected record');

  const cappedNote = memory.withUpdatedWatchlistNote(state, watchlistId, 'x'.repeat(memory.SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT + 500), now);
  assert(cappedNote.watchlists[0].note.length === memory.SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT, 'research note exceeded the local text boundary');
  const cappedTags = memory.withUpdatedWatchlistMetadata(state, watchlistId, { tags: Array.from({ length: 20 }, (_, index) => `tag-${index}`) }, now);
  assert(cappedTags.watchlists[0].tags.length === memory.SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT, 'investigation tags exceeded the local tag boundary');
  assert(memory.SUCCESSION_ARCHIVE_WATCHLIST_STATUSES.join('|') === 'active|paused|resolved', 'published investigation statuses drifted');

  const overflowCompare = Array.from({ length: 6 }, (_, index) => ({ route: 'characters', entityId: `character:test-${index}`, params: { entity: `character:test-${index}` }, label: `Test ${index}` }))
    .reduce((current, record) => memory.withToggledCompareItem(current, record), memory.defaultSuccessionArchiveMemory);
  assert(overflowCompare.compare.length === memory.SUCCESSION_ARCHIVE_COMPARE_LIMIT, `compare tray exceeded ${memory.SUCCESSION_ARCHIVE_COMPARE_LIMIT} records`);
  assert(memory.SUCCESSION_ARCHIVE_RECENT_LIMIT === 30 && memory.SUCCESSION_ARCHIVE_BOOKMARK_LIMIT === 100 && memory.SUCCESSION_ARCHIVE_SEARCH_LIMIT === 20 && memory.SUCCESSION_ARCHIVE_WATCHLIST_LIMIT === 12 && memory.SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT === 4000 && memory.SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT === 12 && memory.SUCCESSION_ARCHIVE_WATCHLIST_CITATION_LIMIT === 100, 'Research Memory limits drifted from the published local-only contract');

  const [workbench, panel, css, contextBar] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionIntelligenceWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionResearchMemoryPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionResearchMemoryPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.jsx'), 'utf8'),
  ]);

  assert(workbench.includes('SuccessionResearchMemoryPanel') && workbench.includes("mode === 'overview' && <OverviewMode"), 'Research Memory is not mounted through the Research overview mode');
  assert(workbench.includes('<SuccessionResearchMemoryPanel spoilerLimit={spoilerLimit} onNavigate={onNavigate} />'), 'Research Memory panel is not rendered inside the overview');
  for (const token of ['Continue researching', 'Archive bookmarks', 'Compare tray', 'Saved searches', 'Research collections', 'Investigation note / working thesis', 'Ordered evidence / record stack', 'Citations', 'Dossier .md', 'Print', 'local only']) assert(panel.includes(token), `Research Memory panel is missing ${token}`);
  assert(panel.includes("mode: 'compare'") && panel.includes("compare: compareRows.map") && panel.includes("fields: 'differences'"), 'compare tray does not hand same-type records to the difference-first comparison engine');
  assert(panel.includes("onNavigate('search', { query: record.query })"), 'saved-search Run action does not return to canonical Search');
  assert(panel.includes('Saved at Ch. {record.chapter} · reruns at current Ch. {spoilerLimit}'), 'saved-search boundary behavior is not disclosed honestly');
  assert(panel.includes('updateSuccessionWatchlistNote') && panel.includes('SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT'), 'research note editor is not wired to bounded local persistence');
  assert(panel.includes('updateSuccessionWatchlistMetadata') && panel.includes('moveSuccessionWatchlistItem') && panel.includes('toggleSuccessionWatchlistCitation'), 'status/tags/ordering/citations are not wired to local persistence reducers');
  assert(panel.includes('citationCandidatesForWatchlist') && panel.includes('getSourcesForEntity'), 'citation editor is not derived from canonical source links');
  assert(panel.includes('markdownForWatchlist') && panel.includes('citationBundleForWatchlist') && panel.includes('downloadTextFile'), 'Markdown/citation export helpers are incomplete');
  assert(panel.includes('printWatchlist') && panel.includes('window.print()'), 'printable investigation export is missing');
  assert(panel.includes('personal research material, never canonical archive data'), 'personal research material is not separated from canonical archive data');
  assert(contextBar.includes('Save current') && contextBar.includes('Compare current') && contextBar.includes('recordSuccessionArchiveVisit'), 'global memory actions are not wired into the chapter context bar');

  const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `Research Memory introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  assert(css.includes('textarea') && css.includes('resize: vertical'), 'research note editor lacks a usable desktop text area');
  assert(css.includes('@media print') && css.includes('.is-print-target'), 'collection-only print stylesheet is missing');
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'Research Memory must not introduce mobile/tablet breakpoints');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'Research Memory must preserve reduced-motion handling');

  console.log(`Succession Research Memory audit passed: local recent/bookmark/search/compare/collection reducers, notes/status/tags/ordering/citations, Markdown/citation/print exports, overview mount, and comparison/search handoffs are wired.`);
} finally {
  await vite.close();
}
