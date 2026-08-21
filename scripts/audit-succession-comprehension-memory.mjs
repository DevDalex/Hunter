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
  assert(state.watchlists.length === 1, 'watchlist was not created');
  state = memory.withToggledWatchlistItem(state, state.watchlists[0].id, item, now);
  assert(state.watchlists[0].items.length === 1, 'watchlist item was not retained');

  const overflowCompare = Array.from({ length: 6 }, (_, index) => ({ route: 'characters', entityId: `character:test-${index}`, params: { entity: `character:test-${index}` }, label: `Test ${index}` }))
    .reduce((current, record) => memory.withToggledCompareItem(current, record), memory.defaultSuccessionArchiveMemory);
  assert(overflowCompare.compare.length === memory.SUCCESSION_ARCHIVE_COMPARE_LIMIT, `compare tray exceeded ${memory.SUCCESSION_ARCHIVE_COMPARE_LIMIT} records`);
  assert(memory.SUCCESSION_ARCHIVE_RECENT_LIMIT === 30 && memory.SUCCESSION_ARCHIVE_BOOKMARK_LIMIT === 100 && memory.SUCCESSION_ARCHIVE_SEARCH_LIMIT === 20 && memory.SUCCESSION_ARCHIVE_WATCHLIST_LIMIT === 12, 'Research Memory limits drifted from the published local-only contract');

  const [workbench, panel, css, contextBar] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionIntelligenceWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionResearchMemoryPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionResearchMemoryPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.jsx'), 'utf8'),
  ]);

  assert(workbench.includes('SuccessionResearchMemoryPanel') && workbench.includes("mode === 'overview' && <OverviewMode"), 'Research Memory is not mounted through the Research overview mode');
  assert(workbench.includes('<SuccessionResearchMemoryPanel spoilerLimit={spoilerLimit} onNavigate={onNavigate} />'), 'Research Memory panel is not rendered inside the overview');
  for (const token of ['Continue researching', 'Archive bookmarks', 'Compare tray', 'Saved searches', 'Watchlists', 'local only']) assert(panel.includes(token), `Research Memory panel is missing ${token}`);
  assert(panel.includes("mode: 'compare'") && panel.includes("compare: compareRows.map"), 'compare tray does not hand same-type records to the existing comparison engine');
  assert(panel.includes("onNavigate('search', { query: record.query"), 'saved-search Run action does not return to canonical Search');
  assert(contextBar.includes('Save current') && contextBar.includes('Compare current') && contextBar.includes('recordSuccessionArchiveVisit'), 'global memory actions are not wired into the chapter context bar');

  const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `Research Memory introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'Research Memory must not introduce mobile/tablet breakpoints');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'Research Memory must preserve reduced-motion handling');

  console.log(`Succession Research Memory audit passed: local recent/bookmark/search/compare/watchlist reducers, overview mount, and comparison/search handoffs are wired.`);
} finally {
  await vite.close();
}
