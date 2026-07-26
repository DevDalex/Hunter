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

const cleanStoryTargets = new Set([
  'volume-0', 'hunter-exam', 'zoldyck-family', 'heavens-arena', 'yorknew-city',
  'greed-island', 'chimera-ant', 'chairman-election', 'succession-contest',
]);
const storyUtilityTargets = new Set(['chronology', 'chapters', 'adaptation']);
const greedIslandSubviews = Object.freeze({
  eta: new Set(), binder: new Set(),
  cards: new Set(['specified', 'spells', 'free-slot', 'game-master']),
  island: new Set(['map', 'locations', 'quests', 'players', 'game-masters']),
  tactics: new Set(['training', 'razor', 'bombers', 'final-battles']),
  completion: new Set(['quiz', 'rewards', 'route', 'adaptation']),
  sources: new Set(),
});
const legacySuccessionPathToTarget = new Map([
  ['royal-family', 'princes'], ['cast', 'characters'], ['nen-and-beasts', 'guardian-spirit-beasts'],
  ['power-blocs', 'organizations'], ['records', 'chapters'],
]);
const referenceTargetToPath = new Map([
  ['encyclopedia', 'characters'], ['atlas', 'world'], ['nen', 'nen'], ['systems', 'organizations'], ['conflicts', 'fights'],
]);
const cleanReferencePaths = new Map([
  ['characters', { target: 'encyclopedia', params: { category: 'characters' } }],
  ['world', { target: 'atlas' }], ['nen', { target: 'nen' }],
  ['organizations', { target: 'systems', params: { view: 'overview' } }], ['fights', { target: 'conflicts' }],
]);
const stringifyQuery = (params = {}) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  return query.toString();
};
const readQuery = (queryString = '') => Object.fromEntries(new URLSearchParams(queryString.replace(/^\?/, '')));
const cleanPath = (pathname = '/') => pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
const cleanUrl = (pathname, params = {}, hash = '') => {
  const query = stringifyQuery(params);
  return `${pathname}${query ? `?${query}` : ''}${hash && !hash.startsWith('#/') ? hash : ''}`;
};
const normalizeGreedIslandParams = (params = {}) => {
  const module = String(params.module || '');
  const subview = String(params.subview || '');
  const { module: _module, subview: _subview, ...rest } = params;
  if (!module) return { ...rest };
  if (!Object.hasOwn(greedIslandSubviews, module)) return null;
  if (subview && !greedIslandSubviews[module].has(subview)) return null;
  return { ...rest, module, ...(subview ? { subview } : {}) };
};
const legacySuccessionTarget = (target, params = {}) => {
  if (target === 'overview' || !target) return { target: 'archive', params };
  if (target === 'family-tree') return { target: 'princes', params };
  if (target === 'succession-roster') {
    if (params.panel === 'assignments') return { target: 'bodyguards', params };
    if (params.panel === 'relationships') return { target: 'relationships', params };
    return { target: 'characters', params };
  }
  if (target === 'succession-timeline') return { target: 'timeline', params };
  if (target === 'beasts') {
    if (['abilities', 'classes', 'rules'].includes(params.panel)) return { target: 'nen', params };
    return { target: 'guardian-spirit-beasts', params };
  }
  if (target === 'mafia') {
    if (params.panel === 'relationships') return { target: 'relationships', params };
    return { target: 'organizations', params };
  }
  if (target === 'chapters') {
    if (params.panel === 'reader') return { target: 'reader', params };
    if (params.panel === 'deaths') return { target: 'characters', params };
    return { target: 'chapters', params };
  }
  return { target, params };
};

const resolveSuccessionTarget = (target = '', params = {}) => {
  let nextTarget = target || 'archive';
  let nextParams = { ...(params || {}) };
  const visited = new Set();

  for (let step = 0; step < 12; step += 1) {
    if (visited.has(nextTarget)) break;
    visited.add(nextTarget);

    const legacy = legacySuccessionTarget(nextTarget, nextParams);
    if (legacy.target !== nextTarget) {
      nextTarget = legacy.target;
      nextParams = legacy.params;
      continue;
    }

    if (successionArchiveRouteIds.has(nextTarget)) break;

    const alias = successionAliases[nextTarget];
    if (alias) {
      nextTarget = alias.target;
      nextParams = { ...nextParams, ...(alias.panel ? { panel: alias.panel } : {}) };
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
  if (view === 'series' && target === 'research') return { view, target: 'chapters', params };
  if (view === 'series' && target === 'greed-island') {
    const normalizedParams = normalizeGreedIslandParams(params);
    if (!normalizedParams) return { view: 'not-found', target: '', params: { attemptedPath: '/story/greed-island' } };
    return { view, target, params: normalizedParams };
  }
  if (view === 'series' && target === 'chronology') {
    const { arc, ...rest } = params || {};
    return { view: 'timeline', target: '', params: { ...(arc ? { arc, scope: 'arc' } : { scope: 'overview' }), ...rest } };
  }
  if (view === 'series' && target === 'succession-contest') {
    if (params?.section === 'chapters') return { view, target, params };
    return { view: 'succession', target: 'archive', params };
  }
  if (view === 'succession') {
    const resolved = resolveSuccessionTarget(target, params);
    const nextTarget = resolved.target;
    const nextParams = resolved.params;
    if (nextTarget === 'reader') {
      const { panel: _panel, ...readerParams } = nextParams;
      return { view: 'series', target: 'succession-contest', params: { section: 'chapters', ...readerParams } };
    }
    if (!successionArchiveRouteIds.has(nextTarget)) return { view: 'not-found', target: '', params: { attemptedPath: `/story/succession-contest/${nextTarget}` } };
    const { panel: _panel, ...archiveParams } = nextParams;
    return { view: 'succession', target: nextTarget, params: archiveParams };
  }
  if (view === 'reference' && referenceAliases[target]) {
    const alias = referenceAliases[target];
    return normalizeDestination(view, alias.target, {
      ...params,
      ...(alias.category ? { category: alias.category } : {}),
      ...(alias.view ? { view: alias.view } : {}),
      ...(alias.case ? { case: alias.case } : {}),
    });
  }
  if (view === 'reference' && target === 'systems' && params.view === 'conflicts') {
    const { view: _view, ...rest } = params;
    return { view: 'reference', target: 'conflicts', params: rest };
  }
  if (view === 'reference' && target === 'systems' && params.view === 'objects') {
    const { view: _view, ...rest } = params;
    return { view: 'reference', target: 'encyclopedia', params: { category: 'objects', ...rest } };
  }
  if (view === 'reference' && !referencePrimary.includes(target || 'encyclopedia')) return { view: 'not-found', target: '', params: { attemptedPath: `/reference/${target}` } };
  if (view === 'timeline') return { view: 'timeline', target: '', params };
  return { view, target, params };
}

export function routeToLegacyHash(view, target = '', params = {}) {
  const normalized = normalizeDestination(view, target, params);
  if (normalized.view === 'series' && normalized.target === 'greed-island') {
    const { module, subview, ...rest } = normalized.params;
    const path = `#/series/greed-island${module ? `/${module}` : ''}${subview ? `/${subview}` : ''}`;
    const query = stringifyQuery(rest);
    return `${path}${query ? `?${query}` : ''}`;
  }
  const query = stringifyQuery(normalized.params);
  return `#/${normalized.view}${normalized.target ? `/${normalized.target}` : ''}${query ? `?${query}` : ''}`;
}

export function routeToCleanPath(view, target = '', params = {}, hash = '') {
  const normalized = normalizeDestination(view, target, params);
  if (normalized.view === 'home') return cleanUrl('/', {}, hash);
  if (normalized.view === 'timeline') return cleanUrl('/timeline', normalized.params, hash);
  if (normalized.view === 'series') {
    if (!normalized.target) return cleanUrl('/story', normalized.params, hash);
    if (storyUtilityTargets.has(normalized.target)) {
      const { view: _view, ...rest } = normalized.params || {};
      return cleanUrl('/story', { view: normalized.target, ...rest }, hash);
    }
    if (normalized.target === 'greed-island') {
      const { module, subview, ...rest } = normalized.params || {};
      return cleanUrl(`/story/greed-island${module ? `/${module}` : ''}${subview ? `/${subview}` : ''}`, rest, hash);
    }
    if (normalized.target === 'succession-contest' && normalized.params?.section === 'chapters') {
      const { section: _section, ...readerParams } = normalized.params;
      return cleanUrl('/story/succession-contest/chapters', readerParams, hash);
    }
    if (cleanStoryTargets.has(normalized.target)) return cleanUrl(`/story/${normalized.target}`, normalized.params, hash);
    return cleanUrl('/story', { view: normalized.target, ...(normalized.params || {}) }, hash);
  }
  if (normalized.view === 'succession') {
    const successionPath = successionArchiveTargetToPath.get(normalized.target) || '';
    return cleanUrl(`/story/succession-contest${successionPath ? `/${successionPath}` : ''}`, normalized.params, hash);
  }
  if (normalized.view === 'reference') {
    const referencePath = referenceTargetToPath.get(normalized.target || 'encyclopedia');
    if (referencePath) return cleanUrl(`/${referencePath}`, normalized.params, hash);
    return cleanUrl(`/reference/${normalized.target || 'encyclopedia'}`, normalized.params, hash);
  }
  return cleanUrl('/not-found', { path: normalized.params?.attemptedPath || normalized.target || normalized.view }, hash);
}

export function routeToHref(view, target = '', params = {}, options = {}) { return routeToCleanPath(view, target, params, options.hash || ''); }

export function parseLegacyHashRoute(hash = '') {
  if (!routeIsLegacyHash(hash)) return null;
  const [path, queryString = ''] = hash.replace(/^#\/?/, '').split('?');
  const [candidate = 'home', target = '', module = '', subview = ''] = path.split('/');
  const view = views.has(candidate) ? candidate : 'home';
  const params = readQuery(queryString);
  if (view === 'series' && target === 'greed-island') return normalizeDestination(view, target, { ...params, ...(module ? { module } : {}), ...(subview ? { subview } : {}) });
  return normalizeDestination(view, target, params);
}

export function parseCleanRoute(pathname = '/', search = '') {
  const params = readQuery(search);
  const pathnameClean = cleanPath(pathname);
  const parts = pathnameClean.split('/').filter(Boolean);
  if (!parts.length || pathnameClean === '/index.html') return { view: 'home', target: '', params: {} };
  if (parts[0] === 'timeline' && parts.length === 1) return normalizeDestination('timeline', '', params);
  if (parts[0] === 'story') {
    if (parts.length === 1) {
      const utility = params.view;
      if (storyUtilityTargets.has(utility)) {
        const { view: _view, ...rest } = params;
        return normalizeDestination('series', utility, rest);
      }
      return normalizeDestination('series', '', params);
    }
    if (parts[1] === 'greed-island') {
      if (parts.length > 4) return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
      return normalizeDestination('series', 'greed-island', { ...params, ...(parts[2] ? { module: parts[2] } : {}), ...(parts[3] ? { subview: parts[3] } : {}) });
    }
    if (parts[1] === 'succession-contest') {
      if (parts.length === 2) return { view: 'series', target: 'succession-contest', params };
      if (parts.length !== 3) return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
      if (parts[2] === 'chapters') return normalizeDestination('series', 'succession-contest', { section: 'chapters', ...params });
      const target = successionArchivePathToTarget.get(parts[2]) || legacySuccessionPathToTarget.get(parts[2]);
      if (!target) return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
      return normalizeDestination('succession', target, params);
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
  if (parts[0] === 'succession') return normalizeDestination('succession', parts[1] || 'archive', params);
  return { view: 'not-found', target: '', params: { attemptedPath: pathnameClean } };
}

export function readBrowserRoute() {
  if (typeof window === 'undefined') return { view: 'home', target: '', params: {} };
  const legacyRoute = parseLegacyHashRoute(window.location.hash);
  if (legacyRoute) {
    const clean = routeToCleanPath(legacyRoute.view, legacyRoute.target, legacyRoute.params);
    if (clean !== `${window.location.pathname}${window.location.search}`) window.history.replaceState({ hxhRoute: clean }, '', clean);
    return legacyRoute;
  }
  const cleanRoute = parseCleanRoute(window.location.pathname, window.location.search);
  return normalizeDestination(cleanRoute.view, cleanRoute.target, cleanRoute.params);
}
