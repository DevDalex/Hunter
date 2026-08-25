import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getSuccessionExplorerProfile,
  isSuccessionExplorerDepth,
} from '../../data/succession/explorerCapabilities';

const STORAGE_KEY = 'hxh:succession-explorer:v1';
const MIN_CHAPTER = 340;
const MAX_HISTORY = 80;
const MAX_COMPARE = 5;

const DEFAULT_FILTERS = Object.freeze({
  query: '',
  entityType: 'all',
  organization: '',
  location: '',
  certainty: 'all',
  nenOnly: false,
  activeOnly: false,
});

const defaultState = (chapter) => ({
  version: 1,
  chapter,
  depth: 'recap',
  perspective: 'reader',
  selectedIds: [],
  compareIds: [],
  filters: { ...DEFAULT_FILTERS },
  routeViews: {},
  routeLenses: {},
  cameras: {},
  history: [],
  bookmarks: [],
  collections: { Watchlist: [] },
  notes: {},
  playback: { playing: false, speed: 1 },
});

const safeRead = (chapter) => {
  if (typeof window === 'undefined') return defaultState(chapter);
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || parsed.version !== 1) return defaultState(chapter);
    return {
      ...defaultState(chapter),
      ...parsed,
      filters: { ...DEFAULT_FILTERS, ...(parsed.filters || {}) },
      playback: { playing: false, speed: 1, ...(parsed.playback || {}), playing: false },
    };
  } catch {
    return defaultState(chapter);
  }
};

const safeWrite = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Explorer persistence is an enhancement. Storage failure must never block the archive.
  }
};

const clampChapter = (value, spoilerLimit) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return spoilerLimit;
  return Math.min(spoilerLimit, Math.max(MIN_CHAPTER, Math.round(parsed)));
};

const unique = (values) => [...new Set((values || []).filter(Boolean))];

const SuccessionExplorerContext = createContext(null);

export function SuccessionExplorerProvider({ spoilerLimit, children }) {
  const boundary = Math.max(MIN_CHAPTER, Number(spoilerLimit) || MIN_CHAPTER);
  const [state, setState] = useState(() => safeRead(boundary));
  const hydratedRoutesRef = useRef(new Set());

  useEffect(() => {
    setState((current) => {
      const chapter = clampChapter(current.chapter, boundary);
      return chapter === current.chapter ? current : { ...current, chapter };
    });
  }, [boundary]);

  useEffect(() => {
    const handle = window.setTimeout(() => safeWrite(state), 120);
    return () => window.clearTimeout(handle);
  }, [state]);

  const patch = useCallback((recipe) => {
    setState((current) => typeof recipe === 'function' ? recipe(current) : { ...current, ...recipe });
  }, []);

  const setChapter = useCallback((chapter) => patch((current) => ({
    ...current,
    chapter: clampChapter(chapter, boundary),
  })), [boundary, patch]);

  const setDepth = useCallback((depth) => {
    if (!isSuccessionExplorerDepth(depth)) return;
    patch({ depth });
  }, [patch]);

  const setPerspective = useCallback((perspective = 'reader') => patch({
    perspective: perspective || 'reader',
  }), [patch]);

  const setFilters = useCallback((next) => patch((current) => ({
    ...current,
    filters: {
      ...current.filters,
      ...(typeof next === 'function' ? next(current.filters) : next),
    },
  })), [patch]);

  const clearFilters = useCallback(() => patch((current) => ({
    ...current,
    filters: { ...DEFAULT_FILTERS },
  })), [patch]);

  const setRouteView = useCallback((routeId, viewId) => patch((current) => ({
    ...current,
    routeViews: { ...current.routeViews, [routeId]: viewId },
  })), [patch]);

  const setRouteLens = useCallback((routeId, lensId) => patch((current) => ({
    ...current,
    routeLenses: { ...current.routeLenses, [routeId]: lensId },
  })), [patch]);

  const setCamera = useCallback((routeId, camera) => patch((current) => ({
    ...current,
    cameras: {
      ...current.cameras,
      [routeId]: { ...(current.cameras[routeId] || {}), ...camera },
    },
  })), [patch]);

  const resetCamera = useCallback((routeId) => patch((current) => {
    const cameras = { ...current.cameras };
    delete cameras[routeId];
    return { ...current, cameras };
  }), [patch]);

  const selectEntity = useCallback((entityId, meta = {}) => {
    if (!entityId) return;
    patch((current) => {
      const selectedIds = [entityId, ...current.selectedIds.filter((id) => id !== entityId)].slice(0, 12);
      const history = [{
        id: `${Date.now()}-${entityId}`,
        at: Date.now(),
        kind: 'entity',
        entityId,
        routeId: meta.routeId || null,
        chapter: meta.chapter || current.chapter,
        label: meta.label || entityId,
      }, ...current.history].slice(0, MAX_HISTORY);
      return { ...current, selectedIds, history };
    });
  }, [patch]);

  const clearSelection = useCallback(() => patch({ selectedIds: [] }), [patch]);

  const toggleCompare = useCallback((entityId) => {
    if (!entityId) return;
    patch((current) => {
      const present = current.compareIds.includes(entityId);
      const compareIds = present
        ? current.compareIds.filter((id) => id !== entityId)
        : [...current.compareIds, entityId].slice(-MAX_COMPARE);
      return { ...current, compareIds };
    });
  }, [patch]);

  const clearCompare = useCallback(() => patch({ compareIds: [] }), [patch]);

  const pushHistory = useCallback((entry) => patch((current) => ({
    ...current,
    history: [{
      id: `${Date.now()}-${entry.kind || 'view'}`,
      at: Date.now(),
      chapter: current.chapter,
      ...entry,
    }, ...current.history].slice(0, MAX_HISTORY),
  })), [patch]);

  const addBookmark = useCallback((bookmark) => patch((current) => {
    const next = {
      id: bookmark.id || `bookmark-${Date.now()}`,
      at: Date.now(),
      chapter: current.chapter,
      depth: current.depth,
      perspective: current.perspective,
      selectedIds: current.selectedIds,
      compareIds: current.compareIds,
      ...bookmark,
    };
    return { ...current, bookmarks: [next, ...current.bookmarks].slice(0, 60) };
  }), [patch]);

  const removeBookmark = useCallback((bookmarkId) => patch((current) => ({
    ...current,
    bookmarks: current.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
  })), [patch]);

  const addToCollection = useCallback((collectionName, entityId) => {
    if (!entityId) return;
    const name = String(collectionName || 'Watchlist').trim() || 'Watchlist';
    patch((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [name]: unique([...(current.collections[name] || []), entityId]),
      },
    }));
  }, [patch]);

  const removeFromCollection = useCallback((collectionName, entityId) => patch((current) => ({
    ...current,
    collections: {
      ...current.collections,
      [collectionName]: (current.collections[collectionName] || []).filter((id) => id !== entityId),
    },
  })), [patch]);

  const setNote = useCallback((key, note) => patch((current) => ({
    ...current,
    notes: { ...current.notes, [key]: String(note || '') },
  })), [patch]);

  const setPlayback = useCallback((next) => patch((current) => ({
    ...current,
    playback: { ...current.playback, ...(typeof next === 'function' ? next(current.playback) : next) },
  })), [patch]);

  const getRouteView = useCallback((routeId) => state.routeViews[routeId]
    || getSuccessionExplorerProfile(routeId).defaultView, [state.routeViews]);
  const getRouteLens = useCallback((routeId) => state.routeLenses[routeId]
    || getSuccessionExplorerProfile(routeId).defaultLens, [state.routeLenses]);

  const hydrateFromRouteParams = useCallback((routeId, routeParams = {}) => {
    const hydrationKey = `${routeId}:${JSON.stringify(routeParams)}`;
    if (hydratedRoutesRef.current.has(hydrationKey)) return;
    hydratedRoutesRef.current.add(hydrationKey);
    const profile = getSuccessionExplorerProfile(routeId);
    patch((current) => {
      const chapter = routeParams.chapter ? clampChapter(routeParams.chapter, boundary) : current.chapter;
      const depth = isSuccessionExplorerDepth(routeParams.depth) ? routeParams.depth : current.depth;
      const viewId = profile.views.some((item) => item.id === routeParams.explorerView) ? routeParams.explorerView : null;
      const lensId = profile.lenses.some((item) => item.id === routeParams.lens) ? routeParams.lens : null;
      const compareIds = routeParams.compare
        ? unique(String(routeParams.compare).split(',')).slice(0, MAX_COMPARE)
        : current.compareIds;
      return {
        ...current,
        chapter,
        depth,
        perspective: routeParams.perspective || current.perspective,
        compareIds,
        routeViews: viewId ? { ...current.routeViews, [routeId]: viewId } : current.routeViews,
        routeLenses: lensId ? { ...current.routeLenses, [routeId]: lensId } : current.routeLenses,
      };
    });
  }, [boundary, patch]);

  const buildDeepLinkParams = useCallback((routeId, extra = {}) => ({
    chapter: state.chapter,
    explorerView: getRouteView(routeId),
    lens: getRouteLens(routeId),
    depth: state.depth,
    ...(state.perspective !== 'reader' ? { perspective: state.perspective } : {}),
    ...(state.compareIds.length ? { compare: state.compareIds.join(',') } : {}),
    ...extra,
  }), [getRouteLens, getRouteView, state.chapter, state.compareIds, state.depth, state.perspective]);

  const value = useMemo(() => ({
    ...state,
    spoilerLimit: boundary,
    setChapter,
    setDepth,
    setPerspective,
    setFilters,
    clearFilters,
    setRouteView,
    setRouteLens,
    setCamera,
    resetCamera,
    getRouteView,
    getRouteLens,
    selectEntity,
    clearSelection,
    toggleCompare,
    clearCompare,
    pushHistory,
    addBookmark,
    removeBookmark,
    addToCollection,
    removeFromCollection,
    setNote,
    setPlayback,
    hydrateFromRouteParams,
    buildDeepLinkParams,
  }), [
    state,
    boundary,
    setChapter,
    setDepth,
    setPerspective,
    setFilters,
    clearFilters,
    setRouteView,
    setRouteLens,
    setCamera,
    resetCamera,
    getRouteView,
    getRouteLens,
    selectEntity,
    clearSelection,
    toggleCompare,
    clearCompare,
    pushHistory,
    addBookmark,
    removeBookmark,
    addToCollection,
    removeFromCollection,
    setNote,
    setPlayback,
    hydrateFromRouteParams,
    buildDeepLinkParams,
  ]);

  return <SuccessionExplorerContext.Provider value={value}>{children}</SuccessionExplorerContext.Provider>;
}

export function useSuccessionExplorer() {
  const value = useContext(SuccessionExplorerContext);
  if (!value) throw new Error('useSuccessionExplorer must be used inside SuccessionExplorerProvider');
  return value;
}

export const successionExplorerStorageKey = STORAGE_KEY;
