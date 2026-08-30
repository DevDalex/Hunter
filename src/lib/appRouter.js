import {
  successionAliases,
  successionArchivePathToTarget,
  successionArchiveRetiredTargets,
  successionArchiveRouteIds,
} from '../data/routeManifest.js';

const topLevelPathByTarget = new Map([
  ['archive', '/'],
  ['timeline', '/timeline'],
  ['characters', '/characters'],
  ['nen', '/nen'],
]);

const stringifyQuery = (params = {}) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  }
  return query.toString();
};

const readQuery = (queryString = '') => Object.fromEntries(
  new URLSearchParams(String(queryString || '').replace(/^\?/, '')),
);

const cleanPath = (pathname = '/') => pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
const cleanUrl = (pathname, params = {}, hash = '') => {
  const query = stringifyQuery(params);
  return `${pathname}${query ? `?${query}` : ''}${hash && !hash.startsWith('#/') ? hash : ''}`;
};
const attempted = (path) => ({ view: 'not-found', target: '', params: { attemptedPath: path || '/' } });

const resolveSuccessionTarget = (target = '', params = {}) => {
  let nextTarget = target || 'archive';
  const nextParams = { ...(params || {}) };
  const visited = new Set();

  for (let step = 0; step < 12; step += 1) {
    if (visited.has(nextTarget) || successionArchiveRouteIds.has(nextTarget)) break;
    visited.add(nextTarget);
    const alias = successionAliases[nextTarget]?.target;
    const retired = successionArchiveRetiredTargets[nextTarget];
    if (!alias && !retired) break;
    if (nextTarget !== (alias || retired)) nextParams.consolidatedFrom ||= nextTarget;
    nextTarget = alias || retired;
  }

  return { target: nextTarget, params: nextParams };
};

export const routeIsLegacyHash = (hash = '') => String(hash || '').startsWith('#/');

export function normalizeDestination(view, target = '', params = {}) {
  if (view === 'home' && !target) return { view: 'succession', target: 'archive', params: {} };
  if (view !== 'succession') return attempted(`/${view || target || ''}`);
  const resolved = resolveSuccessionTarget(target, params);
  if (!successionArchiveRouteIds.has(resolved.target)) {
    return attempted(`/story/succession-contest/${resolved.target}`);
  }
  return { view: 'succession', target: resolved.target, params: resolved.params };
}

export function routeToLegacyHash(view, target = '', params = {}) {
  const normalized = normalizeDestination(view, target, params);
  const query = stringifyQuery(normalized.params);
  return `#/${normalized.view}${normalized.target ? `/${normalized.target}` : ''}${query ? `?${query}` : ''}`;
}

export function routeToCleanPath(view, target = '', params = {}, hash = '') {
  const normalized = normalizeDestination(view, target, params);
  if (normalized.view !== 'succession') {
    return cleanUrl('/not-found', { path: normalized.params?.attemptedPath || normalized.target || normalized.view }, hash);
  }
  const pathname = topLevelPathByTarget.get(normalized.target) || '/';
  return cleanUrl(pathname, normalized.params, hash);
}

export function routeToHref(view, target = '', params = {}, options = {}) {
  return routeToCleanPath(view, target, params, options.hash || '');
}

export function parseLegacyHashRoute(hash = '') {
  if (!routeIsLegacyHash(hash)) return null;
  const [path, queryString = ''] = hash.replace(/^#\/?/, '').split('?');
  const [candidate = '', target = ''] = path.split('/');
  const params = readQuery(queryString);
  if (candidate === 'timeline') return normalizeDestination('succession', 'timeline', params);
  if (candidate === 'succession') return normalizeDestination('succession', target || 'archive', params);
  if (candidate === 'series' && target === 'succession-contest') return normalizeDestination('succession', 'archive', params);
  return attempted(`#/${path}`);
}

export function parseCleanRoute(pathname = '/', search = '') {
  const params = readQuery(search);
  const pathnameClean = cleanPath(pathname);
  const parts = pathnameClean.split('/').filter(Boolean);

  if (!parts.length || pathnameClean === '/index.html') return { view: 'succession', target: 'archive', params };
  if (parts.length === 1 && ['timeline', 'characters', 'nen'].includes(parts[0])) {
    return normalizeDestination('succession', parts[0], params);
  }

  if (parts[0] === 'story' && parts[1] === 'succession-contest') {
    if (parts.length === 2) return normalizeDestination('succession', 'archive', params);
    if (parts.length !== 3) return attempted(pathnameClean);
    const pathPart = parts[2];
    const target = successionArchivePathToTarget.get(pathPart) || pathPart;
    return normalizeDestination('succession', target, {
      ...params,
      ...(target !== pathPart ? { consolidatedFrom: params.consolidatedFrom || pathPart } : {}),
    });
  }

  if (parts[0] === 'succession' && parts.length <= 2) {
    return normalizeDestination('succession', parts[1] || 'archive', params);
  }

  if (parts[0] === 'not-found') return attempted(params.path || pathnameClean);
  return attempted(pathnameClean);
}

export function readBrowserRoute() {
  if (typeof window === 'undefined') return { view: 'succession', target: 'archive', params: {} };

  const legacyRoute = parseLegacyHashRoute(window.location.hash);
  if (legacyRoute) {
    const clean = routeToCleanPath(legacyRoute.view, legacyRoute.target, legacyRoute.params);
    if (clean !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState({ hxhRoute: clean }, '', clean);
    }
    return legacyRoute;
  }

  const cleanRoute = parseCleanRoute(window.location.pathname, window.location.search);
  const normalized = normalizeDestination(cleanRoute.view, cleanRoute.target, cleanRoute.params);
  const canonical = routeToCleanPath(normalized.view, normalized.target, normalized.params);
  if (normalized.view !== 'not-found' && canonical !== `${window.location.pathname}${window.location.search}`) {
    window.history.replaceState({ hxhRoute: canonical }, '', canonical);
  }
  return normalized;
}
