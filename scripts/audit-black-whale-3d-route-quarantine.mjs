import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const registry = await readJson('public/phase7/black-whale-3d-location-registry-342-415.json');
const graph = await readJson('public/phase7/black-whale-3d-spatial-graph.json');
const routeReview = await readJson('public/phase7/black-whale-3d-route-review.json');
const migration = await readJson('public/phase7/black-whale-3d-quarantine-migration.json');

const registryIds = new Set(registry.map((record) => record.id));
const routeRecords = registry.filter((record) => record.recordType === 'route');
const routeIds = new Set(routeRecords.map((record) => record.id));
const graphEndpointIds = new Set([
  ...registry.filter((record) => record.recordType === 'node').map((record) => record.id),
  ...graph.containers.map((container) => container.id),
]);

assert(routeReview.status === 'complete', 'Route review must be complete.');
assert(routeReview.routes.length === routeRecords.length, 'Every registered route must have exactly one review record.');
assert(new Set(routeReview.routes.map((route) => route.routeId)).size === routeReview.routes.length, 'Route review IDs must be unique.');
for (const route of routeReview.routes) {
  assert(routeIds.has(route.routeId), `Unknown route review record ${route.routeId}.`);
  assert(Array.isArray(route.evidenceAtomIds) && route.evidenceAtomIds.length > 0, `${route.routeId} lacks evidence references.`);
  assert(route.geometryAuthorized === false, `${route.routeId} cannot authorize geometry in Phase 7.2.`);
  if (route.outcome === 'authorized-physical-connection') {
    assert(route.traversalAuthorized === true, `${route.routeId} must explicitly authorize traversal.`);
    assert(graphEndpointIds.has(route.from), `${route.routeId} has unknown source endpoint ${route.from}.`);
    assert(graphEndpointIds.has(route.to), `${route.routeId} has unknown target endpoint ${route.to}.`);
    assert(route.from !== route.to, `${route.routeId} cannot connect an endpoint to itself.`);
  } else {
    assert(route.traversalAuthorized === false, `${route.routeId} must not authorize traversal.`);
    assert(!route.from && !route.to, `${route.routeId} must not invent endpoints for a non-authorized route.`);
  }
}
assert(routeReview.routes.filter((route) => route.outcome === 'authorized-physical-connection').length === 3, 'Expected exactly three evidence-authorized physical routes.');
assert(routeReview.routes.filter((route) => route.outcome === 'nonphysical-overlay').length === 2, 'Expected exactly two nonphysical overlays.');
assert(routeReview.routes.filter((route) => route.outcome === 'quarantined-scope-only').length === 5, 'Expected exactly five quarantined route scopes.');

const reviewDirectory = path.join(root, 'public/phase7/full-page-review');
const filenames = (await readdir(reviewDirectory)).filter((name) => /^chapter-\d+\.json$/.test(name));
const sourceQuarantines = [];
for (const filename of filenames) {
  const record = await readJson(`public/phase7/full-page-review/${filename}`);
  for (const quarantine of record.contradictionsAndQuarantines ?? []) {
    sourceQuarantines.push({ ...quarantine, chapter: record.chapter });
  }
}
const quarantineIds = sourceQuarantines.map((record) => record.id);
assert(sourceQuarantines.length === migration.expectedSourceRecords, `Expected ${migration.expectedSourceRecords} source quarantines, found ${sourceQuarantines.length}.`);
assert(new Set(quarantineIds).size === quarantineIds.length, 'Source quarantine IDs must be unique.');
assert(migration.migrationMode === 'deterministic-one-to-one-carry-forward', 'Quarantine migration mode changed unexpectedly.');
assert(migration.completionGuarantees.everySourceRecordMapsExactlyOnce === true, 'One-to-one quarantine migration guarantee is missing.');
assert(migration.defaultGraphState.edgeAvailability === 'prohibited', 'Open quarantines must prohibit graph edges.');
assert(migration.defaultGraphState.navigationAvailability === 'prohibited', 'Open quarantines must prohibit navigation.');
assert(migration.defaultGraphState.geometryAvailability === 'prohibited', 'Open quarantines must prohibit geometry.');

console.log(`Black Whale Phase 7.2 route/quarantine audit passed: ${routeReview.routes.length} routes reviewed, 3 physical connections authorized without geometry, 2 nonphysical overlays, 5 quarantined route scopes, ${sourceQuarantines.length} quarantines carried forward one-to-one.`);
