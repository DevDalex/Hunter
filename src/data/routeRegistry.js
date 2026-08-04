import {
  successionArchiveHubs,
  successionArchiveRoutes,
  successionArchiveRouteById,
} from './succession/archiveRoutes.js';

const routePolicy = Object.freeze({
  archive: { release: true, searchable: false, sitemap: true },
  reader: { release: true, searchable: false, sitemap: true },
  search: { release: true, searchable: false, sitemap: true },
  glossary: { release: true, searchable: true, sitemap: true },
  queens: { release: false, searchable: false, sitemap: false, canonicalTarget: 'princes' },
});

export const legacyRouteRedirects = Object.freeze({
  overview: 'archive',
  'deep-dossier': 'princes',
  'family-tree': 'princes',
  'royal-family': 'princes',
  'succession-roster': 'characters',
  'succession-timeline': 'timeline',
  'connection-board': 'relationships',
  'nen-classes': 'nen',
  beasts: 'guardian-spirit-beasts',
  hunters: 'characters',
  deaths: 'characters',
  mafia: 'organizations',
  military: 'organizations',
  politics: 'organizations',
  justice: 'organizations',
  'power-blocs': 'organizations',
  media: 'research',
  mysteries: 'chapters',
  'succession-sources': 'research',
});

const defaultPolicy = Object.freeze({ release: true, searchable: true, sitemap: true });

export const canonicalSuccessionRoutes = Object.freeze(
  successionArchiveRoutes.map((route) => Object.freeze({
    ...route,
    ...defaultPolicy,
    ...(routePolicy[route.id] || {}),
    hub: successionArchiveHubs.find((hub) => (
      hub.target === route.id || hub.tabs.some((tab) => tab.routes.includes(route.id))
    ))?.id || 'story',
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
