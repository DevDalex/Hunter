import {
  referenceAliases,
  referencePrimary,
  successionAliases,
  successionArchivePathToTarget,
  successionArchiveRetiredTargets,
  successionArchiveRouteIds,
  successionArchiveTargetToPath,
  views,
} from '../data/routeManifest.js';

const legacySuccessionPathToTarget = new Map([
  ['royal-family', 'princes'],
  ['cast', 'characters'],
  ['nen-and-beasts', 'guardian-spirit-beasts'],
  ['power-blocs', 'organizations'],
  ['records', 'chapters'],
  ['chapters', 'reader'],
]);

const referenceTargetToPath = new Map([
  ['nen', 'nen'],
  ['atlas', 'world'],
]);

const cleanReferencePaths = new Map([
  ['nen', { target: 'nen' }],
  ['world', { target: 'atlas' }],
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

const attempted = (path) => ({
  view: 'not-found',
  target: '',
  params: { attemptedPath: path || '/' },
});

const resolveSuccessionTarget = (target = '', params = {}) => {
  let nextTarget = target || 'archive';
  let nextParams = { ...(params || {}) };
  const visited = new Set();

  for (let step = 0; step < 12; step += 1) {
    if (visited.has(nextTarget)) break;
    visited.add(nextTarget);

    if (successionArchiveRouteIds.has(nextTarget)) break;

    const alias = successionAliases[nextTarget];
    if (alias) {
      nextTarget = alias.target;
      nextParams = {
        ...nextParams,
        ...(alias.panel ? { panel: alias.panel } : {}),
      };
      continue;
    }

    const retiredTarget = successionArchiveRetiredTargets[nextTarget];
    if (retiredTarget) {
      nextTarget = retiredTarget;
      continue;
    }

    break;
  }

  return { target: nextTarget, params: nextParams };
};

export const routeIsLegacyHash = (hash = '') => String(hash || '').startsWith('#/');

export function normalizeDestination(view, target = '', params = {}) {
  if (view === 'succession') {
    const resolved = resolveSuccessionTarget(target, params);
    if (!successionArchiveRouteIds.has(resolved.target)) {
      return attempted(`/story/succession-contest/${resolved.target}`);
    }
    const { panel, ...archiveParams } = resolved.params;
    return {
      view: 'succession',
      target: resolved.target,
      params: resolved.target === 'reader' && panel ? { ...archiveParams, panel } : archiveParams,
    };
  }

  if (view === 'reference') {
    const alias = referenceAliases[target];
    const nextTarget = alias?.target || target;
    const nextParams = {
      ...(params || {}),
      ...(alias?.category ? { category: alias.category } : {}),
      ...(alias?.view ? { view: alias.view } : {}),
    };
    if (!referencePrimary.includes(nextTarget)) return attempted(`/reference/${nextTarget || ''}`);

    if (nextTarget === 'nen') {
      return normalizeDestination('succession', 'nen', {
        ...nextParams,
        scope: 'encyclopedia',
      });
    }

    return normalizeDestination('succession', 'locations', {
      ...nextParams,
      scope: 'world',
    });
  }

  if (view === 'home' && !target) return { view: 'succession', target: 'archive', params: {} };
  if (!views.has(view)) return attempted(`/${view || target || ''}`);
  return { view, target, params: { ...(params || {}) } };
}

export function routeToLegacyHash(view, target = '', params = {}) {
  const normalized = normalizeDestination(view, target, params);
  const query = stringifyQuery(normalized.params);
  return `#/${normalized.view}${normalized.target ? `/${normalized.target}` : ''}${query ? `?${query}` : ''}`;
}

export function routeToCleanPath(view, target = '', params = {}, hash = '') {
  const normalized = normalizeDestination(view, target, params);

  if (normalized.view === 'succession') {
    if (normalized.target === 'archive') return cleanUrl('/', normalized.params, hash);
    const successionPath = successionArchiveTargetToPath.get(normalized.target) || normalized.target;
    return cleanUrl(`/story/succession-contest/${successionPath}`, normalized.params, hash);
  }

  if (normalized.view === 'reference') {
    const referencePath = referenceTargetToPath.get(normalized.target);
    if (referencePath) return cleanUrl(`/${referencePath}`, normalized.params, hash);
  }

  return cleanUrl('/not-found', {
    path: normalized.params?.attemptedPath || normalized.target || normalized.view,
  }, hash);
}

export function routeToHref(view, target = '', params = {}, options = {}) {
  return routeToCleanPath(view, target, params, options.hash || '');
}

export function parseLegacyHashRoute(hash = '') {
  if (!routeIsLegacyHash(hash)) return null;

  const [path, queryString = ''] = hash.replace(/^#\/?/, '').split('?');
  const [candidate = '', target = ''] = path.split('/');
  const params = readQuery(queryString);

  if (candidate === 'succession') return normalizeDestination('succession', target || 'archive', params);
  if (candidate === 'reference') return normalizeDestination('reference', target, params);
  if (candidate === 'timeline') return normalizeDestination('succession', 'timeline', params);

  if (candidate === 'series' && target === 'succession-contest') {
    return normalizeDestination('succession', 'archive', params);
  }

  return attempted(`#/${path}`);
}

export function parseCleanRoute(pathname = '/', search = '') {
  const params = readQuery(search);
  const pathnameClean = cleanPath(pathname);
  const parts = pathnameClean.split('/').filter(Boolean);

  if (!parts.length || pathnameClean === '/index.html') {
    return { view: 'succession', target: 'archive', params };
  }

  if (parts[0] === 'timeline' && parts.length === 1) {
    return normalizeDestination('succession', 'timeline', params);
  }

  if (cleanReferencePaths.has(parts[0]) && parts.length === 1) {
    const destination = cleanReferencePaths.get(parts[0]);
    return normalizeDestination('reference', destination.target, params);
  }

  if (parts[0] === 'reference' && parts.length <= 2) {
    return normalizeDestination('reference', parts[1] || '', params);
  }

  if (parts[0] === 'story' && parts[1] === 'succession-contest') {
    if (parts.length === 2) return normalizeDestination('succession', 'archive', params);
    if (parts.length !== 3) return attempted(pathnameClean);

    const target = successionArchivePathToTarget.get(parts[2])
      || legacySuccessionPathToTarget.get(parts[2]);

    return target
      ? normalizeDestination('succession', target, params)
      : attempted(pathnameClean);
  }

  if (parts[0] === 'succession' && parts.length <= 2) {
    return normalizeDestination('succession', parts[1] || 'archive', params);
  }

  if (parts[0] === 'not-found') {
    return attempted(params.path || pathnameClean);
  }

  return attempted(pathnameClean);
}

export function readBrowserRoute() {
  if (typeof window === 'undefined') {
    return { view: 'succession', target: 'archive', params: {} };
  }

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