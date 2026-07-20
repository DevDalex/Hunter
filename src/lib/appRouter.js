import {
  referenceAliases,
  referencePrimary,
  successionAliases,
  views,
} from '../data/routeManifest.js';

const cleanStoryTargets = new Set([
  'volume-0',
  'hunter-exam',
  'zoldyck-family',
  'heavens-arena',
  'yorknew-city',
  'greed-island',
  'chimera-ant',
  'chairman-election',
]);

const storyUtilityTargets = new Set(['chronology', 'chapters', 'adaptation']);

const successionPathToTarget = {
  'succession-contest': { target: 'overview' },
  'royal-family': { target: 'family-tree' },
  cast: { target: 'succession-roster' },
  timeline: { target: 'succession-timeline' },
  'black-whale': { target: 'black-whale' },
  'nen-and-beasts': { target: 'beasts' },
  'power-blocs': { target: 'mafia' },
  records: { target: 'chapters' },
};

const targetToSuccessionPath = new Map([
  ['overview', 'succession-contest'],
  ['family-tree', 'succession-contest/royal-family'],
  ['succession-roster', 'succession-contest/cast'],
  ['succession-timeline', 'succession-contest/timeline'],
  ['black-whale', 'succession-contest/black-whale'],
  ['beasts', 'succession-contest/nen-and-beasts'],
  ['mafia', 'succession-contest/power-blocs'],
  ['chapters', 'succession-contest/records'],
]);

const referenceTargetToPath = new Map([
  ['encyclopedia', 'characters'],
  ['atlas', 'world'],
  ['nen', 'nen'],
  ['systems', 'organizations'],
  ['conflicts', 'fights'],
]);

const cleanReferencePaths = new Map([
  ['characters', { target: 'encyclopedia', params: { category: 'characters' } }],
  ['world', { target: 'atlas' }],
  ['nen', { target: 'nen' }],
  ['organizations', { target: 'systems', params: { view: 'mafia' } }],
  ['fights', { target: 'conflicts' }],
]);

const stringifyQuery = (params = {}) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  }
  return query.toString();
};

const readQuery = (queryString = '') => Object.fromEntries(new URLSearchParams(queryString.replace(/^\?/, '')));

const cleanPath = (pathname = '/') => {
  const normalized = pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  return normalized || '/';
};

const cleanUrl = (pathname, params = {}, hash = '') => {
  const query = stringifyQuery(params);
  return `${pathname}${query ? `?${query}` : ''}${hash && !hash.startsWith('#/') ? hash : ''}`;
};

export const routeIsLegacyHash = (hash = '') => String(hash || '').startsWith('#/');

export function normalizeDestination(view, target = '', params = {}) {
  if (view === 'series' && target === 'research') return { view, target: 'chapters', params };
  if (view === 'succession' && successionAliases[target]) {
    const alias = successionAliases[target];
    return { view, target: alias.target, params: { ...params, ...(alias.panel ? { panel: alias.panel } : {}) } };
  }
  if (view === 'reference' && referenceAliases[target]) {
    const alias = referenceAliases[target];
    return {
      view,
      target: alias.target,
      params: { ...params, ...(alias.category ? { category: alias.category } : {}), ...(alias.view ? { view: alias.view } : {}), ...(alias.case ? { case: alias.case } : {}) },
    };
  }
  if (view === 'reference' && !referencePrimary.includes(target || 'encyclopedia')) {
    return { view: 'not-found', target: '', params: { attemptedPath: `/reference/${target}` } };
  }
  return { view, target, params };
}

export function routeToLegacyHash(view, target = '', params = {}) {
  const normalized = normalizeDestination(view, target, params);
  const query = stringifyQuery(normalized.params);
  return `#/${normalized.view}${normalized.target ? `/${normalized.target}` : ''}${query ? `?${query}` : ''}`;
}

export function routeToCleanPath(view, target = '', params = {}, hash = '') {
  const normalized = normalizeDestination(view, target, params);

  if (normalized.view === 'home') return cleanUrl('/', {}, hash);

  if (normalized.view === 'series') {
    if (!normalized.target) return cleanUrl('/story', normalized.params, hash);
    if (storyUtilityTargets.has(normalized.target)) {
      const { view: _view, ...rest } = normalized.params || {};
      return cleanUrl('/story', { view: normalized.target, ...rest }, hash);
    }
    if (cleanStoryTargets.has(normalized.target)) return cleanUrl(`/story/${normalized.target}`, normalized.params, hash);
    return cleanUrl('/story', { view: normalized.target, ...(normalized.params || {}) }, hash);
  }

  if (normalized.view === 'succession') {
    const successionPath = targetToSuccessionPath.get(normalized.target || 'overview') || 'succession-contest';
    return cleanUrl(`/story/${successionPath}`, normalized.params, hash);
  }

  if (normalized.view === 'reference') {
    const referencePath = referenceTargetToPath.get(normalized.target || 'encyclopedia');
    if (referencePath) return cleanUrl(`/${referencePath}`, normalized.params, hash);
    return cleanUrl(`/reference/${normalized.target || 'encyclopedia'}`, normalized.params, hash);
  }

  return cleanUrl('/not-found', { path: normalized.params?.attemptedPath || normalized.target || normalized.view }, hash);
}

export function routeToHref(view, target = '', params = {}, options = {}) {
  if (options.preferHash) return routeToLegacyHash(view, target, params);
  if (typeof window !== 'undefined' && window.__HXH_STANDALONE_BUILD__ === true) return routeToLegacyHash(view, target, params);
  return routeToCleanPath(view, target, params, options.hash || '');
}

export function parseLegacyHashRoute(hash = '') {
  if (!routeIsLegacyHash(hash)) return null;
  const [path, queryString = ''] = hash.replace(/^#\/?/, '').split('?');
  const [candidate = 'home', target = ''] = path.split('/');
  const view = views.has(candidate) ? candidate : 'home';
  return normalizeDestination(view, target, readQuery(queryString));
}

export function parseCleanRoute(pathname = '/', search = '') {
  const params = readQuery(search);
  const pathnameClean = cleanPath(pathname);
  const parts = pathnameClean.split('/').filter(Boolean);

  if (!parts.length || pathnameClean === '/index.html') return { view: 'home', target: '', params: {} };

  if (parts[0] === 'story') {
    if (parts.length === 1) {
      const utility = params.view;
      if (storyUtilityTargets.has(utility)) {
        const { view: _view, ...rest } = params;
        return normalizeDestination('series', utility, rest);
      }
      return normalizeDestination('series', '', params);
    }

    if (parts[1] === 'succession-contest') {
      const successionSubpath = parts[2] || 'succession-contest';
      const destination = successionPathToTarget[successionSubpath];
      if (!destination || parts.length > 3) return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
      return normalizeDestination('succession', destination.target, params);
    }

    const storyTarget = parts[1];
    if (cleanStoryTargets.has(storyTarget) && parts.length === 2) return normalizeDestination('series', storyTarget, params);
    return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
  }

  if (cleanReferencePaths.has(parts[0]) && parts.length === 1) {
    const destination = cleanReferencePaths.get(parts[0]);
    return normalizeDestination('reference', destination.target, { ...(destination.params || {}), ...params });
  }

  if (parts[0] === 'reference') {
    const referenceTarget = parts[1] || 'encyclopedia';
    if (parts.length <= 2) return normalizeDestination('reference', referenceTarget, params);
  }

  if (parts[0] === 'succession') {
    const target = parts[1] || 'overview';
    return normalizeDestination('succession', target, params);
  }

  return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
}

export function readBrowserRoute() {
  if (typeof window === 'undefined') return { view: 'home', target: '', params: {} };

  const legacyRoute = parseLegacyHashRoute(window.location.hash);
  if (legacyRoute) {
    const clean = routeToCleanPath(legacyRoute.view, legacyRoute.target, legacyRoute.params);
    if (window.__HXH_STANDALONE_BUILD__ !== true && clean !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState({ hxhRoute: clean }, '', clean);
    }
    return legacyRoute;
  }

  return parseCleanRoute(window.location.pathname, window.location.search);
}
