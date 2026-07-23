import { readStoredJson, removeStoredValue, writeStoredJson } from '../../lib/browserStorage.js';

export const SUCCESSION_READER_STATE_KEY = 'hxh-succession-reader-state-v2';
export const SUCCESSION_READER_LEGACY_KEY = 'hxh-succession-reader-progress';

export const normalizeReaderMode = (value) => {
  if (value === 'continuous') return 'scroll';
  if (value === 'single') return 'page';
  return ['page', 'spread', 'scroll'].includes(value) ? value : 'page';
};

export const normalizeReaderFit = (value) => ['width', 'height', 'original'].includes(value) ? value : 'width';
export const normalizeReaderDirection = (value) => value === 'ltr' ? 'ltr' : 'rtl';
export const normalizeReaderTheme = (value) => ['black', 'charcoal', 'gray', 'paper'].includes(value) ? value : 'black';

export const defaultReaderState = Object.freeze({
  version: 2,
  lastChapter: null,
  lastPage: 1,
  mode: 'page',
  fit: 'width',
  direction: 'rtl',
  theme: 'black',
  zoom: 100,
  chapters: {},
  bookmarks: [],
});

export function readSuccessionReaderState() {
  const saved = readStoredJson(SUCCESSION_READER_STATE_KEY, null);
  const legacy = readStoredJson(SUCCESSION_READER_LEGACY_KEY, null);
  const source = saved && typeof saved === 'object' ? saved : {};
  return {
    ...defaultReaderState,
    ...source,
    lastChapter: source.lastChapter || legacy?.chapter || null,
    lastPage: Number(source.lastPage || legacy?.page || 1),
    mode: normalizeReaderMode(source.mode || legacy?.mode),
    fit: normalizeReaderFit(source.fit),
    direction: normalizeReaderDirection(source.direction),
    theme: normalizeReaderTheme(source.theme),
    zoom: Math.min(400, Math.max(50, Number(source.zoom || 100))),
    chapters: source.chapters && typeof source.chapters === 'object' ? source.chapters : {},
    bookmarks: Array.isArray(source.bookmarks) ? source.bookmarks : [],
  };
}

export function writeSuccessionReaderState(state) {
  return writeStoredJson(SUCCESSION_READER_STATE_KEY, { ...state, version: 2 });
}

export function clearSuccessionReaderState() {
  removeStoredValue(SUCCESSION_READER_STATE_KEY);
  removeStoredValue(SUCCESSION_READER_LEGACY_KEY);
}

export const chapterProgressFor = (state, chapter) => state.chapters?.[chapter] || { page: 1, percent: 0, completed: false, updatedAt: null };

export function withReaderProgress(state, { chapter, page, pageCount, mode, fit, direction, theme, zoom }) {
  const safeCount = Math.max(0, Number(pageCount || 0));
  const safePage = Math.max(1, Number(page || 1));
  const percent = safeCount ? Math.min(100, Math.round((safePage / safeCount) * 100)) : 0;
  const previous = chapterProgressFor(state, chapter);
  const completed = previous.completed || (safeCount > 0 && safePage >= safeCount);
  return {
    ...state,
    lastChapter: chapter,
    lastPage: safePage,
    mode: normalizeReaderMode(mode),
    fit: normalizeReaderFit(fit),
    direction: normalizeReaderDirection(direction),
    theme: normalizeReaderTheme(theme),
    zoom: Math.min(400, Math.max(50, Number(zoom || 100))),
    chapters: {
      ...state.chapters,
      [chapter]: {
        ...previous,
        page: safePage,
        percent,
        completed,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

export function toggleReaderBookmark(state, chapter, page, note = '') {
  const existing = state.bookmarks.find((bookmark) => bookmark.chapter === chapter && bookmark.page === page);
  if (existing) return { ...state, bookmarks: state.bookmarks.filter((bookmark) => bookmark !== existing) };
  return {
    ...state,
    bookmarks: [...state.bookmarks, {
      id: `${chapter}:${page}`,
      chapter,
      page,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    }],
  };
}

export function updateReaderBookmarkNote(state, chapter, page, note) {
  return {
    ...state,
    bookmarks: state.bookmarks.map((bookmark) => bookmark.chapter === chapter && bookmark.page === page
      ? { ...bookmark, note: note.trim() }
      : bookmark),
  };
}
