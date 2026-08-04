import {
  canonicalSuccessionRoutes,
  legacyRouteRedirects,
  releasedSuccessionRoutes,
  resolveSuccessionRoute,
} from '../src/data/routeRegistry.js';

const fail = (message) => {
  console.error(`Route registry audit failed: ${message}`);
  process.exitCode = 1;
};

const ids = canonicalSuccessionRoutes.map((route) => route.id);
const paths = canonicalSuccessionRoutes.map((route) => route.path);

if (new Set(ids).size !== ids.length) fail('canonical route IDs must be unique');
if (new Set(paths).size !== paths.length) fail('canonical route paths must be unique');

for (const route of canonicalSuccessionRoutes) {
  if (!route.id || typeof route.id !== 'string') fail('every route needs a string ID');
  if (typeof route.path !== 'string') fail(`${route.id} needs a string path`);
  if (!route.title || !route.label) fail(`${route.id} needs title and label metadata`);
  if (!route.hub) fail(`${route.id} is not assigned to a navigation hub`);
  if (route.canonicalTarget && !ids.includes(route.canonicalTarget)) {
    fail(`${route.id} points to missing canonical target ${route.canonicalTarget}`);
  }
}

for (const [alias, target] of Object.entries(legacyRouteRedirects)) {
  if (!target || !ids.includes(target)) fail(`legacy alias ${alias} points to missing route ${target}`);
  const resolved = resolveSuccessionRoute(alias);
  if (!resolved || !ids.includes(resolved.id)) fail(`legacy alias ${alias} does not resolve`);
}

const requiredReleaseRoutes = ['archive', 'reader', 'search', 'glossary'];
for (const id of requiredReleaseRoutes) {
  if (!releasedSuccessionRoutes.some((route) => route.id === id)) {
    fail(`${id} must be included in released routes`);
  }
}

if (!process.exitCode) {
  console.log(`Route registry audit passed: ${canonicalSuccessionRoutes.length} canonical routes, ${releasedSuccessionRoutes.length} released routes, ${Object.keys(legacyRouteRedirects).length} aliases.`);
}
