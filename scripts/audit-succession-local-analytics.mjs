import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession local analytics audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const analytics = await vite.ssrLoadModule('/src/data/succession/localAnalytics.js');
  const normalized = analytics.normalizeSuccessionLocalAnalytics({
    enabled: true,
    totalViews: 999,
    routeViews: { story: 3, research: 2, 'not-a-route': 50 },
    firstSeenAt: '2026-08-21T10:00:00Z',
    lastSeenAt: '2026-08-21T11:00:00Z',
    query: 'must not survive',
    entityId: 'character:secret',
  });
  assert(normalized.totalViews === 5, 'total views must derive from accepted route counters, not caller input');
  assert(normalized.routeViews.story === 3 && normalized.routeViews.research === 2, 'valid route counters were not retained');
  assert(!('not-a-route' in normalized.routeViews), 'unknown route IDs were retained');
  assert(!('query' in normalized) && !('entityId' in normalized), 'sensitive caller payload survived analytics normalization');
  assert(Object.keys(normalized).sort().join('|') === 'enabled|firstSeenAt|lastSeenAt|routeViews|totalViews|version', 'analytics state gained an unapproved field');

  const [store, panel, css, shell] = await Promise.all([
    readFile(path.join(root, 'src/data/succession/localAnalytics.js'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionLocalAnalyticsPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionLocalAnalyticsPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
  ]);

  for (const forbidden of ['fetch(', 'sendBeacon', 'XMLHttpRequest', 'navigator.', 'queryText', 'searchQuery', 'entityId:', 'pageNumber']) {
    assert(!store.includes(forbidden), `analytics store contains forbidden collection/transport primitive ${forbidden}`);
  }
  assert(store.includes('routeViews') && store.includes('firstSeenAt') && store.includes('lastSeenAt'), 'analytics store lacks approved aggregate fields');
  assert(panel.includes('Search text, entity IDs, notes, Reader pages') && panel.includes('never recorded here or sent to a server'), 'privacy boundary is not disclosed in the dashboard');
  assert(panel.includes('Pause counters') && panel.includes('Resume counters') && panel.includes('Reset local analytics'), 'analytics user controls are incomplete');
  assert(shell.includes('recordSuccessionLocalRouteView(route.id)') && shell.includes('showLocalAnalytics && <SuccessionLocalAnalyticsPanel />'), 'analytics is not instrumented/mounted through the archive shell');
  assert(shell.includes("route.id === 'research' && (!routeParams?.mode || routeParams.mode === 'overview')"), 'analytics dashboard is not constrained to the Research overview');
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'analytics panel introduced a mobile/tablet breakpoint');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'analytics panel lacks reduced-motion handling');
  const sizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(sizes.every((size) => size >= 11), `analytics panel introduced text below 11px: ${sizes.filter((size) => size < 11).join(', ')}`);

  console.log('Succession local analytics audit passed: aggregate route-only storage, no network transport, pause/resume/reset controls, and Research dashboard mount are enforced.');
} finally {
  await vite.close();
}
