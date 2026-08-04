const STORAGE_KEY = 'hunter:succession:research-workspace:v1';

const emptyWorkspace = () => ({ version: 1, readingBoundary: null, bookmarks: [], investigations: [] });

export const loadResearchWorkspace = (storage = globalThis.localStorage) => {
  if (!storage) return emptyWorkspace();
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    return parsed?.version === 1 ? parsed : emptyWorkspace();
  } catch {
    return emptyWorkspace();
  }
};

export const saveResearchWorkspace = (workspace, storage = globalThis.localStorage) => {
  if (!storage) return workspace;
  const next = { ...workspace, version: 1 };
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  if (typeof globalThis.dispatchEvent === 'function' && typeof Event === 'function') {
    globalThis.dispatchEvent(new Event('hunter:research-updated'));
  }
  return next;
};

export const setSavedReadingBoundary = (chapter, storage) => {
  const workspace = loadResearchWorkspace(storage);
  return saveResearchWorkspace({ ...workspace, readingBoundary: Number(chapter) }, storage);
};

export const toggleBookmark = (bookmark, storage) => {
  const workspace = loadResearchWorkspace(storage);
  const exists = workspace.bookmarks.some((item) => item.domain === bookmark.domain && item.id === bookmark.id);
  const bookmarks = exists
    ? workspace.bookmarks.filter((item) => !(item.domain === bookmark.domain && item.id === bookmark.id))
    : [...workspace.bookmarks, { ...bookmark, savedAt: new Date().toISOString() }];
  return saveResearchWorkspace({ ...workspace, bookmarks }, storage);
};

export const saveInvestigation = (investigation, storage) => {
  if (!investigation?.id || !investigation?.title) throw new Error('Investigations require id and title.');
  const workspace = loadResearchWorkspace(storage);
  const next = { ...investigation, updatedAt: new Date().toISOString() };
  const investigations = [...workspace.investigations.filter((item) => item.id !== next.id), next];
  return saveResearchWorkspace({ ...workspace, investigations }, storage);
};
