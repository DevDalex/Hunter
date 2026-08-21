import { readStoredJson, removeStoredValue, writeStoredJson } from '../../lib/browserStorage.js';

export const SUCCESSION_ARCHIVE_MEMORY_KEY = 'hxh-succession-archive-memory-v1';
export const SUCCESSION_ARCHIVE_MEMORY_EVENT = 'hxh-succession-archive-memory';
export const SUCCESSION_ARCHIVE_MEMORY_VERSION = 1;
export const SUCCESSION_ARCHIVE_RECENT_LIMIT = 30;
export const SUCCESSION_ARCHIVE_BOOKMARK_LIMIT = 100;
export const SUCCESSION_ARCHIVE_COMPARE_LIMIT = 4;
export const SUCCESSION_ARCHIVE_SEARCH_LIMIT = 20;
export const SUCCESSION_ARCHIVE_WATCHLIST_LIMIT = 12;
export const SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT = 4000;
export const SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT = 12;
export const SUCCESSION_ARCHIVE_WATCHLIST_CITATION_LIMIT = 100;
export const SUCCESSION_ARCHIVE_WATCHLIST_STATUSES = Object.freeze(['active', 'paused', 'resolved']);

export const defaultSuccessionArchiveMemory = Object.freeze({
  version: SUCCESSION_ARCHIVE_MEMORY_VERSION,
  recent: Object.freeze([]),
  bookmarks: Object.freeze([]),
  compare: Object.freeze([]),
  savedSearches: Object.freeze([]),
  watchlists: Object.freeze([]),
});

const text = (value, maximum = 240) => String(value ?? '').trim().slice(0, maximum);
const timestamp = (value) => {
  const parsed = Date.parse(String(value || ''));
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
};
const scalarParams = (params = {}) => Object.fromEntries(Object.entries(params || {}).flatMap(([key, value]) => {
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(key)) return [];
  if (!['string', 'number', 'boolean'].includes(typeof value)) return [];
  const safe = text(value, 300);
  return safe ? [[key, safe]] : [];
}));
const itemKey = (item) => `${item.route}|${item.entityId || ''}|${JSON.stringify(item.params || {})}`;
const dedupe = (records, keyFor = itemKey) => [...new Map(records.map((record) => [keyFor(record), record])).values()];
const normalizeTags = (tags) => Object.freeze([...new Set((Array.isArray(tags) ? tags : String(tags || '').split(',')).map((tag) => text(tag, 40)).filter(Boolean))].slice(0, SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT));
const normalizeCitationIds = (ids) => Object.freeze([...new Set((Array.isArray(ids) ? ids : []).map((id) => text(id, 180)).filter(Boolean))].slice(0, SUCCESSION_ARCHIVE_WATCHLIST_CITATION_LIMIT));
const normalizeWatchlistStatus = (status) => SUCCESSION_ARCHIVE_WATCHLIST_STATUSES.includes(status) ? status : 'active';

export const normalizeArchiveMemoryItem = (value = {}) => {
  const route = text(value.route, 60);
  if (!route) return null;
  const params = scalarParams(value.params);
  const entityId = text(value.entityId || params.entity, 180) || null;
  return Object.freeze({
    route,
    params: Object.freeze(params),
    entityId,
    label: text(value.label || entityId || route, 180) || route,
    context: text(value.context, 180) || null,
    savedAt: timestamp(value.savedAt) || null,
    visitedAt: timestamp(value.visitedAt) || null,
  });
};

const normalizeSearch = (value = {}) => {
  const query = text(value.query, 300);
  if (!query) return null;
  const chapter = Number(value.chapter);
  return Object.freeze({
    id: text(value.id, 120) || query.toLocaleLowerCase(),
    query,
    chapter: Number.isFinite(chapter) ? Math.max(340, Math.min(417, chapter)) : 417,
    savedAt: timestamp(value.savedAt) || null,
  });
};

const normalizeWatchlist = (value = {}) => {
  const id = text(value.id, 120);
  const name = text(value.name, 120);
  if (!id || !name) return null;
  return Object.freeze({
    id,
    name,
    note: text(value.note, SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT),
    status: normalizeWatchlistStatus(value.status),
    tags: normalizeTags(value.tags),
    citationIds: normalizeCitationIds(value.citationIds),
    createdAt: timestamp(value.createdAt) || null,
    updatedAt: timestamp(value.updatedAt) || null,
    items: Object.freeze(dedupe((Array.isArray(value.items) ? value.items : []).map(normalizeArchiveMemoryItem).filter(Boolean)).slice(0, SUCCESSION_ARCHIVE_BOOKMARK_LIMIT)),
  });
};

export const normalizeSuccessionArchiveMemory = (value = {}) => Object.freeze({
  version: SUCCESSION_ARCHIVE_MEMORY_VERSION,
  recent: Object.freeze(dedupe((Array.isArray(value.recent) ? value.recent : []).map(normalizeArchiveMemoryItem).filter(Boolean)).slice(0, SUCCESSION_ARCHIVE_RECENT_LIMIT)),
  bookmarks: Object.freeze(dedupe((Array.isArray(value.bookmarks) ? value.bookmarks : []).map(normalizeArchiveMemoryItem).filter(Boolean)).slice(0, SUCCESSION_ARCHIVE_BOOKMARK_LIMIT)),
  compare: Object.freeze(dedupe((Array.isArray(value.compare) ? value.compare : []).map(normalizeArchiveMemoryItem).filter(Boolean), (item) => item.entityId || itemKey(item)).filter((item) => item.entityId).slice(0, SUCCESSION_ARCHIVE_COMPARE_LIMIT)),
  savedSearches: Object.freeze(dedupe((Array.isArray(value.savedSearches) ? value.savedSearches : []).map(normalizeSearch).filter(Boolean), (record) => record.id).slice(0, SUCCESSION_ARCHIVE_SEARCH_LIMIT)),
  watchlists: Object.freeze((Array.isArray(value.watchlists) ? value.watchlists : []).map(normalizeWatchlist).filter(Boolean).slice(0, SUCCESSION_ARCHIVE_WATCHLIST_LIMIT)),
});

const nowIso = (now = new Date()) => new Date(now).toISOString();

export function withArchiveVisit(state, item, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const normalized = normalizeArchiveMemoryItem({ ...item, visitedAt: nowIso(now) });
  if (!normalized || normalized.route === 'search') return current;
  return normalizeSuccessionArchiveMemory({
    ...current,
    recent: [normalized, ...current.recent.filter((record) => itemKey(record) !== itemKey(normalized))],
  });
}

export function withToggledArchiveBookmark(state, item, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const normalized = normalizeArchiveMemoryItem({ ...item, savedAt: nowIso(now) });
  if (!normalized) return current;
  const exists = current.bookmarks.some((record) => itemKey(record) === itemKey(normalized));
  return normalizeSuccessionArchiveMemory({
    ...current,
    bookmarks: exists
      ? current.bookmarks.filter((record) => itemKey(record) !== itemKey(normalized))
      : [normalized, ...current.bookmarks],
  });
}

export function withSavedArchiveSearch(state, query, chapter = 417, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const normalized = normalizeSearch({ query, chapter, savedAt: nowIso(now) });
  if (!normalized) return current;
  return normalizeSuccessionArchiveMemory({
    ...current,
    savedSearches: [normalized, ...current.savedSearches.filter((record) => record.id !== normalized.id)],
  });
}

export function withoutSavedArchiveSearch(state, id) {
  const current = normalizeSuccessionArchiveMemory(state);
  return normalizeSuccessionArchiveMemory({ ...current, savedSearches: current.savedSearches.filter((record) => record.id !== id) });
}

export function withToggledCompareItem(state, item) {
  const current = normalizeSuccessionArchiveMemory(state);
  const normalized = normalizeArchiveMemoryItem(item);
  if (!normalized?.entityId) return current;
  const exists = current.compare.some((record) => record.entityId === normalized.entityId);
  return normalizeSuccessionArchiveMemory({
    ...current,
    compare: exists
      ? current.compare.filter((record) => record.entityId !== normalized.entityId)
      : [...current.compare, normalized].slice(-SUCCESSION_ARCHIVE_COMPARE_LIMIT),
  });
}

export function withCreatedWatchlist(state, name, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const safeName = text(name, 120);
  if (!safeName || current.watchlists.length >= SUCCESSION_ARCHIVE_WATCHLIST_LIMIT) return current;
  const stamp = nowIso(now);
  const id = `watchlist:${safeName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'research'}:${Date.parse(stamp)}`;
  return normalizeSuccessionArchiveMemory({
    ...current,
    watchlists: [...current.watchlists, { id, name: safeName, note: '', status: 'active', tags: [], citationIds: [], createdAt: stamp, updatedAt: stamp, items: [] }],
  });
}

export function withoutWatchlist(state, id) {
  const current = normalizeSuccessionArchiveMemory(state);
  return normalizeSuccessionArchiveMemory({ ...current, watchlists: current.watchlists.filter((record) => record.id !== id) });
}

export function withUpdatedWatchlistNote(state, watchlistId, note, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const safeNote = text(note, SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT);
  return normalizeSuccessionArchiveMemory({
    ...current,
    watchlists: current.watchlists.map((watchlist) => watchlist.id === watchlistId
      ? { ...watchlist, note: safeNote, updatedAt: nowIso(now) }
      : watchlist),
  });
}

export function withUpdatedWatchlistMetadata(state, watchlistId, metadata = {}, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  return normalizeSuccessionArchiveMemory({
    ...current,
    watchlists: current.watchlists.map((watchlist) => watchlist.id === watchlistId
      ? {
        ...watchlist,
        status: metadata.status === undefined ? watchlist.status : normalizeWatchlistStatus(metadata.status),
        tags: metadata.tags === undefined ? watchlist.tags : normalizeTags(metadata.tags),
        updatedAt: nowIso(now),
      }
      : watchlist),
  });
}

export function withToggledWatchlistCitation(state, watchlistId, citationId, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const safeId = text(citationId, 180);
  if (!safeId) return current;
  return normalizeSuccessionArchiveMemory({
    ...current,
    watchlists: current.watchlists.map((watchlist) => {
      if (watchlist.id !== watchlistId) return watchlist;
      const exists = watchlist.citationIds.includes(safeId);
      return {
        ...watchlist,
        citationIds: exists ? watchlist.citationIds.filter((id) => id !== safeId) : [...watchlist.citationIds, safeId],
        updatedAt: nowIso(now),
      };
    }),
  });
}

export function withMovedWatchlistItem(state, watchlistId, itemIndex, direction, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const offset = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
  if (!offset) return current;
  return normalizeSuccessionArchiveMemory({
    ...current,
    watchlists: current.watchlists.map((watchlist) => {
      if (watchlist.id !== watchlistId) return watchlist;
      const from = Math.max(0, Math.min(watchlist.items.length - 1, Number(itemIndex)));
      const to = from + offset;
      if (!Number.isFinite(from) || to < 0 || to >= watchlist.items.length) return watchlist;
      const items = [...watchlist.items];
      [items[from], items[to]] = [items[to], items[from]];
      return { ...watchlist, items, updatedAt: nowIso(now) };
    }),
  });
}

export function withToggledWatchlistItem(state, watchlistId, item, now = new Date()) {
  const current = normalizeSuccessionArchiveMemory(state);
  const normalized = normalizeArchiveMemoryItem({ ...item, savedAt: nowIso(now) });
  if (!normalized) return current;
  return normalizeSuccessionArchiveMemory({
    ...current,
    watchlists: current.watchlists.map((watchlist) => {
      if (watchlist.id !== watchlistId) return watchlist;
      const exists = watchlist.items.some((record) => itemKey(record) === itemKey(normalized));
      return {
        ...watchlist,
        updatedAt: nowIso(now),
        items: exists
          ? watchlist.items.filter((record) => itemKey(record) !== itemKey(normalized))
          : [normalized, ...watchlist.items],
      };
    }),
  });
}

const emitChange = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SUCCESSION_ARCHIVE_MEMORY_EVENT));
};

export const readSuccessionArchiveMemory = () => normalizeSuccessionArchiveMemory(readStoredJson(SUCCESSION_ARCHIVE_MEMORY_KEY, defaultSuccessionArchiveMemory));

export function writeSuccessionArchiveMemory(state) {
  const normalized = normalizeSuccessionArchiveMemory(state);
  const written = writeStoredJson(SUCCESSION_ARCHIVE_MEMORY_KEY, normalized);
  if (written) emitChange();
  return normalized;
}

export function clearSuccessionArchiveMemory() {
  const removed = removeStoredValue(SUCCESSION_ARCHIVE_MEMORY_KEY);
  if (removed) emitChange();
  return removed;
}

export function recordSuccessionArchiveVisit(item) {
  return writeSuccessionArchiveMemory(withArchiveVisit(readSuccessionArchiveMemory(), item));
}

export function toggleSuccessionArchiveBookmark(item) {
  return writeSuccessionArchiveMemory(withToggledArchiveBookmark(readSuccessionArchiveMemory(), item));
}

export function saveSuccessionArchiveSearch(query, chapter) {
  return writeSuccessionArchiveMemory(withSavedArchiveSearch(readSuccessionArchiveMemory(), query, chapter));
}

export function removeSuccessionArchiveSearch(id) {
  return writeSuccessionArchiveMemory(withoutSavedArchiveSearch(readSuccessionArchiveMemory(), id));
}

export function toggleSuccessionCompareItem(item) {
  return writeSuccessionArchiveMemory(withToggledCompareItem(readSuccessionArchiveMemory(), item));
}

export function clearSuccessionCompareTray() {
  const current = readSuccessionArchiveMemory();
  return writeSuccessionArchiveMemory({ ...current, compare: [] });
}

export function createSuccessionWatchlist(name) {
  return writeSuccessionArchiveMemory(withCreatedWatchlist(readSuccessionArchiveMemory(), name));
}

export function deleteSuccessionWatchlist(id) {
  return writeSuccessionArchiveMemory(withoutWatchlist(readSuccessionArchiveMemory(), id));
}

export function updateSuccessionWatchlistNote(id, note) {
  return writeSuccessionArchiveMemory(withUpdatedWatchlistNote(readSuccessionArchiveMemory(), id, note));
}

export function updateSuccessionWatchlistMetadata(id, metadata) {
  return writeSuccessionArchiveMemory(withUpdatedWatchlistMetadata(readSuccessionArchiveMemory(), id, metadata));
}

export function toggleSuccessionWatchlistCitation(watchlistId, citationId) {
  return writeSuccessionArchiveMemory(withToggledWatchlistCitation(readSuccessionArchiveMemory(), watchlistId, citationId));
}

export function moveSuccessionWatchlistItem(watchlistId, itemIndex, direction) {
  return writeSuccessionArchiveMemory(withMovedWatchlistItem(readSuccessionArchiveMemory(), watchlistId, itemIndex, direction));
}

export function toggleSuccessionWatchlistItem(watchlistId, item) {
  return writeSuccessionArchiveMemory(withToggledWatchlistItem(readSuccessionArchiveMemory(), watchlistId, item));
}
