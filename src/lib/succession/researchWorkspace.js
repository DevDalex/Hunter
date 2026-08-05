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
    : [...workspace.bookmarks, { ...bookmark, tags: bookmark.tags || [], folder: bookmark.folder || '', savedAt: new Date().toISOString() }];
  return saveResearchWorkspace({ ...workspace, bookmarks }, storage);
};

export const updateBookmark = (domain, id, patch, storage) => {
  const workspace = loadResearchWorkspace(storage);
  const bookmarks = workspace.bookmarks.map((item) => item.domain === domain && item.id === id ? { ...item, ...patch } : item);
  return saveResearchWorkspace({ ...workspace, bookmarks }, storage);
};

export const removeBookmark = (domain, id, storage) => {
  const workspace = loadResearchWorkspace(storage);
  return saveResearchWorkspace({ ...workspace, bookmarks: workspace.bookmarks.filter((item) => !(item.domain === domain && item.id === id)) }, storage);
};

export const saveInvestigation = (investigation, storage) => {
  if (!investigation?.id || !investigation?.title) throw new Error('Investigations require id and title.');
  const workspace = loadResearchWorkspace(storage);
  const previous = workspace.investigations.find((item) => item.id === investigation.id);
  const next = {
    notes: '',
    status: 'open',
    records: [],
    evidenceFor: [],
    evidenceAgainst: [],
    ...previous,
    ...investigation,
    updatedAt: new Date().toISOString(),
  };
  const investigations = [...workspace.investigations.filter((item) => item.id !== next.id), next];
  return saveResearchWorkspace({ ...workspace, investigations }, storage);
};

export const deleteInvestigation = (id, storage) => {
  const workspace = loadResearchWorkspace(storage);
  return saveResearchWorkspace({ ...workspace, investigations: workspace.investigations.filter((item) => item.id !== id) }, storage);
};

export const addRecordToInvestigation = (id, record, storage) => {
  const workspace = loadResearchWorkspace(storage);
  const investigation = workspace.investigations.find((item) => item.id === id);
  if (!investigation) throw new Error(`Unknown investigation: ${id}`);
  const records = [...(investigation.records || []).filter((item) => !(item.domain === record.domain && item.id === record.id)), record];
  return saveInvestigation({ ...investigation, records }, storage);
};

export const reorderInvestigationRecords = (id, orderedIds, storage) => {
  const workspace = loadResearchWorkspace(storage);
  const investigation = workspace.investigations.find((item) => item.id === id);
  if (!investigation) throw new Error(`Unknown investigation: ${id}`);
  const order = new Map(orderedIds.map((value, index) => [value, index]));
  const records = [...(investigation.records || [])].sort((left, right) => (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER));
  return saveInvestigation({ ...investigation, records }, storage);
};

export const exportResearchWorkspace = (storage) => JSON.stringify(loadResearchWorkspace(storage), null, 2);
