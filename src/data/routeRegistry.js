import {
  successionArchiveHubs,
  successionArchiveRoutes,
  successionArchiveRouteById,
} from './succession/archiveRoutes.js';

const routePolicy = Object.freeze({
  archive: { release: true, searchable: false, sitemap: true },
});

export const legacyRouteRedirects = Object.freeze({
  overview: 'archive',
  story: 'timeline',
  search: 'timeline',
  events: 'timeline',
  chapters: 'timeline',
  reader: 'timeline',
  'black-whale': 'timeline',
  locations: 'timeline',
  research: 'timeline',
  glossary: 'timeline',
  mysteries: 'timeline',
  'succession-sources': 'timeline',
  'succession-timeline': 'timeline',
  princes: 'characters',
  queens: 'characters',
  bodyguards: 'characters',
  organizations: 'characters',
  relationships: 'characters',
  'deep-dossier': 'characters',
  'family-tree': 'characters',
  'royal-family': 'characters',
  'succession-roster': 'characters',
  'connection-board': 'characters',
  hunters: 'characters',
  deaths: 'characters',
  mafia: 'characters',
  military: 'characters',
  politics: 'characters',
  justice: 'characters',
  'power-blocs': 'characters',
  'nen-classes': 'nen',
  beasts: 'nen',
  'guardian-spirit-beasts': 'nen',
  media: 'timeline',
});

const defaultPolicy = Object.freeze({ release: true, searchable: true, sitemap: true });

export const canonicalSuccessionRoutes = Object.freeze(
  successionArchiveRoutes.map((route) => Object.freeze({
    ...route,
    ...defaultPolicy,
    ...(routePolicy[route.id] || {}),
    hub: successionArchiveHubs.find((hub) => (
      hub.target === route.id || hub.tabs.some((tab) => tab.routes.includes(route.id))
    ))?.id || 'timeline',
  })),
);

export const canonicalSuccessionRouteById = new Map(
  canonicalSuccessionRoutes.map((route) => [route.id, route]),
);

export const releasedSuccessionRoutes = Object.freeze(
  canonicalSuccessionRoutes.filter((route) => route.release),
);

export const searchableSuccessionRoutes = Object.freeze(
  canonicalSuccessionRoutes.filter((route) => route.searchable),
);

export const sitemapSuccessionRoutes = Object.freeze(
  canonicalSuccessionRoutes.filter((route) => route.sitemap),
);

export const resolveSuccessionRoute = (target = 'archive') => {
  const redirectedTarget = legacyRouteRedirects[target] || target;
  const route = canonicalSuccessionRouteById.get(redirectedTarget)
    || successionArchiveRouteById.get('archive');
  return route.canonicalTarget
    ? canonicalSuccessionRouteById.get(route.canonicalTarget) || route
    : route;
};
