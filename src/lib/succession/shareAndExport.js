const safeValue = (value) => value === undefined || value === null ? '' : String(value);

export const buildResearchSnapshotUrl = ({ origin = globalThis.location?.origin || '', route, chapter, tab, filters = {}, focus }) => {
  const url = new URL(route, origin || 'https://hunter.invalid');
  if (chapter) url.searchParams.set('chapter', chapter);
  if (tab) url.searchParams.set('tab', tab);
  if (focus) url.searchParams.set('focus', focus);
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) value.forEach((item) => url.searchParams.append(key, safeValue(item)));
    else if (value !== '' && value !== undefined && value !== null) url.searchParams.set(key, safeValue(value));
  }
  return origin ? url.toString() : `${url.pathname}${url.search}`;
};

export const exportRecordsAsJson = (records, metadata = {}) => JSON.stringify({ metadata, records }, null, 2);

export const exportRecordsAsCsv = (records = [], fields = []) => {
  const selectedFields = fields.length ? fields : [...new Set(records.flatMap((record) => Object.keys(record)))];
  const escape = (value) => `"${safeValue(typeof value === 'object' ? JSON.stringify(value) : value).replaceAll('"', '""')}"`;
  return [selectedFields.map(escape).join(','), ...records.map((record) => selectedFields.map((field) => escape(record[field])).join(','))].join('\n');
};

export const researchCitation = ({ title, chapter, reviewedAt, route }) =>
  `Hunter × Hunter Archive, “${title},” state through Chapter ${chapter}, reviewed ${reviewedAt}${route ? `, ${route}` : ''}.`;

export const publicExportPolicy = Object.freeze({
  allowed: ['metadata', 'summaries', 'entity-records', 'evidence-citations', 'user-notes'],
  excluded: ['chapter-image-binaries', 'protected-admin-data', 'worker-secrets', 'authorization-tokens'],
});
