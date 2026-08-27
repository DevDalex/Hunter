import MiniSearch from 'minisearch';

const text = (value) => Array.isArray(value) ? value.filter(Boolean).join(' ') : (value || '');

export const normalizeArchiveSearchRecord = (record = {}) => ({
  id: String(record.id || record.slug || record.name || ''),
  name: record.name || record.title || '',
  summary: record.summary || record.description || '',
  aliases: text(record.aliases),
  keywords: text(record.keywords || record.tags),
  entityType: record.entityType || record.type || record.category || 'record',
  chapter: Number.isInteger(record.chapter) ? record.chapter : null,
  href: record.href || '',
});

export function createArchiveSearchIndex(records = []) {
  const normalized = records
    .map(normalizeArchiveSearchRecord)
    .filter((record) => record.id && record.name);

  const index = new MiniSearch({
    fields: ['name', 'aliases', 'summary', 'keywords', 'entityType'],
    storeFields: ['id', 'name', 'summary', 'entityType', 'chapter', 'href'],
    searchOptions: {
      boost: { name: 5, aliases: 3, entityType: 1.25 },
      fuzzy: 0.18,
      prefix: true,
    },
  });

  index.addAll(normalized);
  return index;
}

export function searchArchive(index, query, options = {}) {
  const cleanQuery = String(query || '').trim();
  if (!cleanQuery) return [];
  return index.search(cleanQuery, options);
}
