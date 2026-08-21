import { readStoredJson, writeStoredJson } from '../../lib/browserStorage.js';
import { successionArchiveRouteIds } from './archiveRoutes.js';

export const SUCCESSION_LOCAL_ANALYTICS_KEY = 'hxh-succession-local-analytics-v1';
export const SUCCESSION_LOCAL_ANALYTICS_EVENT = 'hxh-succession-local-analytics';
export const SUCCESSION_LOCAL_ANALYTICS_VERSION = 1;

export const defaultSuccessionLocalAnalytics = Object.freeze({
  version: SUCCESSION_LOCAL_ANALYTICS_VERSION,
  enabled: true,
  totalViews: 0,
  routeViews: Object.freeze({}),
  firstSeenAt: null,
  lastSeenAt: null,
});

const timestamp = (value) => {
  const parsed = Date.parse(String(value || ''));
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
};
const safeCount = (value) => Math.max(0, Math.floor(Number(value) || 0));

export function normalizeSuccessionLocalAnalytics(value = {}) {
  const routeViews = Object.freeze(Object.fromEntries(Object.entries(value.routeViews || {}).flatMap(([route, count]) => (
    successionArchiveRouteIds.has(route) ? [[route, safeCount(count)]] : []
  ))));
  const countedTotal = Object.values(routeViews).reduce((sum, count) => sum + count, 0);
  return Object.freeze({
    version: SUCCESSION_LOCAL_ANALYTICS_VERSION,
    enabled: value.enabled !== false,
    totalViews: countedTotal,
    routeViews,
    firstSeenAt: timestamp(value.firstSeenAt),
    lastSeenAt: timestamp(value.lastSeenAt),
  });
}

export const readSuccessionLocalAnalytics = () => normalizeSuccessionLocalAnalytics(readStoredJson(SUCCESSION_LOCAL_ANALYTICS_KEY, defaultSuccessionLocalAnalytics));

const emitChange = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SUCCESSION_LOCAL_ANALYTICS_EVENT));
};

export function writeSuccessionLocalAnalytics(value) {
  const normalized = normalizeSuccessionLocalAnalytics(value);
  if (writeStoredJson(SUCCESSION_LOCAL_ANALYTICS_KEY, normalized)) emitChange();
  return normalized;
}

export function recordSuccessionLocalRouteView(routeId, now = new Date()) {
  const current = readSuccessionLocalAnalytics();
  if (!current.enabled || !successionArchiveRouteIds.has(routeId)) return current;
  const stamp = new Date(now).toISOString();
  return writeSuccessionLocalAnalytics({
    ...current,
    routeViews: { ...current.routeViews, [routeId]: safeCount(current.routeViews[routeId]) + 1 },
    firstSeenAt: current.firstSeenAt || stamp,
    lastSeenAt: stamp,
  });
}

export function setSuccessionLocalAnalyticsEnabled(enabled) {
  const current = readSuccessionLocalAnalytics();
  return writeSuccessionLocalAnalytics({ ...current, enabled: Boolean(enabled) });
}

export function resetSuccessionLocalAnalytics() {
  const current = readSuccessionLocalAnalytics();
  return writeSuccessionLocalAnalytics({ ...defaultSuccessionLocalAnalytics, enabled: current.enabled });
}
