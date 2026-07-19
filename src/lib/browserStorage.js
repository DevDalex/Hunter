const browserStorage = () => {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; }
  catch { return null; }
};

export const readStoredString = (key, fallback = '') => {
  try {
    const value = browserStorage()?.getItem(key);
    return value === null || value === undefined ? fallback : value;
  } catch {
    return fallback;
  }
};

export const readStoredNumber = (key, fallback = 0) => {
  const value = Number(readStoredString(key, ''));
  return Number.isFinite(value) ? value : fallback;
};

export const readStoredJson = (key, fallback) => {
  const value = readStoredString(key, '');
  if (!value) return fallback;
  try { return JSON.parse(value); }
  catch { return fallback; }
};

export const writeStoredString = (key, value) => {
  try {
    const storage = browserStorage();
    if (!storage) return false;
    storage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
};

export const writeStoredJson = (key, value) => {
  try { return writeStoredString(key, JSON.stringify(value)); }
  catch { return false; }
};

export const removeStoredValue = (key) => {
  try {
    const storage = browserStorage();
    if (!storage) return false;
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const notifyStudyDataChanged = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('hxh-study-data'));
};
