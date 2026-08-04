const STORAGE_KEY = 'hunter:analytics:v1';
const allowedEvents = new Set(['route-opened', 'search-empty', 'reader-research-bridge', 'export-used', 'bookmark-toggled', 'investigation-created']);

export const recordProductEvent = (name, details = {}, storage = globalThis.localStorage) => {
  if (!allowedEvents.has(name) || !storage) return false;
  const current = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
  const safeDetails = Object.fromEntries(Object.entries(details).filter(([key]) => !['query', 'notes', 'email', 'name', 'token'].includes(key)));
  const next = [...current.slice(-199), { name, details: safeDetails, at: new Date().toISOString() }];
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return true;
};

export const summarizeProductEvents = (storage = globalThis.localStorage) => {
  if (!storage) return {};
  const events = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
  return events.reduce((summary, event) => ({ ...summary, [event.name]: (summary[event.name] || 0) + 1 }), {});
};

export const clearProductEvents = (storage = globalThis.localStorage) => storage?.removeItem(STORAGE_KEY);
export const analyticsPrivacyPolicy = Object.freeze({ localOnly: true, storesSearchQueries: false, storesPersonalNotes: false, maximumEvents: 200 });
