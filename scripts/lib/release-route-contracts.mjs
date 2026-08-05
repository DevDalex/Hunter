import {
  canonicalSuccessionRouteById,
  releasedSuccessionRoutes,
} from '../../src/data/routeRegistry.js';

export const releasedSuccessionRouteIds = Object.freeze(
  releasedSuccessionRoutes.map((route) => route.id),
);

const releasedRouteIdSet = new Set(releasedSuccessionRouteIds);

export const hasReleasedSuccessionRoute = (routeId) => releasedRouteIdSet.has(routeId);

export const canonicalTargetForSuccessionRoute = (routeId) => (
  canonicalSuccessionRouteById.get(routeId)?.canonicalTarget || null
);

export const assertReleasedSuccessionRoutes = (routeIds, assert, label = 'release route') => {
  for (const routeId of routeIds) {
    assert(hasReleasedSuccessionRoute(routeId), `${label} is missing ${routeId}`);
  }
};
