export const normalizeArchiveSearch = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const searchFocusId = (value) => normalizeArchiveSearch(value).replace(/\s+/g, '-');
export const firstArchiveChapter = (value) => Number(String(value || '').match(/\d{3}/)?.[0] || 0);

export const archiveSearchRecord = (type, title, subtitle, keywords, route, source, chapter = 0) => ({
  id: `${type}:${searchFocusId(title)}`,
  type,
  title,
  titleText: normalizeArchiveSearch(title),
  subtitle,
  searchText: normalizeArchiveSearch(`${title} ${subtitle} ${keywords || ''} ${type}`),
  route,
  source,
  chapter,
});

export const dedupeArchiveSearchRecords = (groups) => {
  const byId = new Map();
  for (const group of groups) {
    for (const item of group) {
      const key = `${item.type}:${normalizeArchiveSearch(item.title)}`;
      if (!byId.has(key)) byId.set(key, item);
    }
  }
  return [...byId.values()];
};
