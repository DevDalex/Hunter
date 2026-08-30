import {
  canonicalSuccessionRoutes,
  legacyRouteRedirects,
  releasedSuccessionRoutes,
  resolveSuccessionRoute,
} from '../src/data/routeRegistry.js';

const failures = [];
const fail = (message) => failures.push(message);

if (!Array.isArray(canonicalSuccessionRoutes) || canonicalSuccessionRoutes.length === 0) {
  fail('canonical route registry must contain at least one route');
}

const ids = canonicalSuccessionRoutes.map((route) => route?.id);
const paths = canonicalSuccessionRoutes.map((route) => route?.path);

if (new Set(ids).size !== ids.length) fail('canonical route IDs must be unique');
if (new Set(paths).size !== paths.length) fail('canonical route paths must be unique');

for (const route of canonicalSuccessionRoutes) {
  if (!route?.id || typeof route.id !== 'string') fail('every canonical route needs a non-empty string ID');
  if (typeof route?.path !== 'string') fail(`${route?.id || 'unknown route'} needs a string path`);
  if (route?.canonicalTarget && !ids.includes(route.canonicalTarget)) {
    fail(`${route.id} points to missing canonical target ${route.canonicalTarget}`);
  }
}

for (const [alias, target] of Object.entries(legacyRouteRedirects || {})) {
  if (!target || !ids.includes(target)) {
    fail(`legacy alias ${alias} points to missing route ${target}`);
    continue;
  }
  const resolved = resolveSuccessionRoute(alias);
  if (!resolved || !ids.includes(resolved.id)) fail(`legacy alias ${alias} does not resolve to a canonical route`);
}

for (const route of releasedSuccessionRoutes || []) {
  if (!route?.id || !ids.includes(route.id)) fail(`released route ${route?.id || 'unknown'} is not canonical`);
}

if (failures.length) {
  for (const message of failures) console.error(`Route integrity audit failed: ${message}`);
  process.exitCode = 1;
} else {
  console.log(`Route integrity audit passed: ${canonicalSuccessionRoutes.length} canonical routes and ${Object.keys(legacyRouteRedirects || {}).length} aliases are structurally valid.`);
}
