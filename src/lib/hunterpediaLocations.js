import { readStoredJson, writeStoredJson } from './browserStorage';

const CACHE_KEY = 'hxh-hunterpedia-location-directory-v1';
const CACHE_TTL = 24 * 60 * 60 * 1000;

const sourceFor = (title) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(title).replaceAll('%20', '_').replaceAll('%3A', ':')}`;

const readCache = () => {
  const cached = readStoredJson(CACHE_KEY, null);
  if (!cached?.savedAt || !Array.isArray(cached.records) || Date.now() - cached.savedAt > CACHE_TTL) return null;
  return cached.records;
};

const writeCache = (records) => {
  writeStoredJson(CACHE_KEY, { savedAt: Date.now(), records });
};

export const cachedHunterpediaLocations = () => readCache();

export const fetchHunterpediaLocations = async ({ signal } = {}) => {
  const cached = readCache();
  if (cached) return cached;

  const query = new URLSearchParams({
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Locations',
    cmtype: 'page|subcat',
    cmlimit: '500',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(`https://hunterxhunter.fandom.com/api.php?${query}`, { signal });
  if (!response.ok) throw new Error(`Hunterpedia returned ${response.status}`);
  const data = await response.json();
  const records = (data?.query?.categorymembers || [])
    .map((record) => ({
      id: String(record.pageid || record.title),
      name: record.title.replace(/^Category:/, ''),
      kind: record.ns === 14 ? 'Location subcategory' : 'Location page',
      source: sourceFor(record.title),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  writeCache(records);
  return records;
};
