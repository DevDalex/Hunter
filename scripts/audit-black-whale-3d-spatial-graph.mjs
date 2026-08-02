import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const graph = await readJson('public/phase7/black-whale-3d-spatial-graph.json');
const registry = await readJson('public/phase7/black-whale-3d-location-registry-342-415.json');
const tracker = await readJson('public/phase7/black-whale-3d-full-page-review-342-415.json');

assert(graph.schemaVersion === '7.2.0', 'Unexpected spatial graph schema version.');
assert(graph.phase === '7.2' && graph.status === 'active', 'Phase 7.2 must be active.');
assert(tracker.status.phase71C === 'complete', 'Phase 7.1C must be complete before Phase 7.2 starts.');
assert(Array.isArray(registry) && registry.length > 0, 'Location registry is empty.');
assert(graph.progress.phaseComplete === false, 'Phase 7.2 cannot claim completion at contract start.');

const containerIds = new Set(graph.containers.map((container) => container.id));
assert(containerIds.size === graph.containers.length, 'Container IDs are not unique.');
for (const required of ['bw3d.container.tier-1','bw3d.container.tier-2','bw3d.container.tier-3','bw3d.container.tier-4','bw3d.container.tier-5','bw3d.container.unresolved-tier']) {
  assert(containerIds.has(required), `Missing required container ${required}.`);
}

const edgeTypes = new Map(graph.edgeClasses.map((edgeClass) => [edgeClass.id, edgeClass]));
assert(edgeTypes.size === graph.edgeClasses.length, 'Edge-class IDs are not unique.');
const edgeIds = new Set();
for (const edge of graph.macroRelations) {
  assert(!edgeIds.has(edge.id), `Duplicate edge ${edge.id}.`);
  edgeIds.add(edge.id);
  assert(containerIds.has(edge.from), `${edge.id} has unknown source ${edge.from}.`);
  assert(containerIds.has(edge.to), `${edge.id} has unknown target ${edge.to}.`);
  assert(edgeTypes.has(edge.type), `${edge.id} uses unknown edge type ${edge.type}.`);
  assert(edgeTypes.get(edge.type).traversable === false, `${edge.id} cannot be traversable during macro contract initialization.`);
  assert(edge.traversal.startsWith('prohibited'), `${edge.id} must explicitly prohibit traversal.`);
}

const forbidden = new Set(graph.authoringPolicy.forbiddenEdgeSources);
for (const required of ['editorial sequence','shared visual motif','room-number sequence','Nen effect shape']) {
  assert(forbidden.has(required), `Forbidden edge source is missing: ${required}.`);
}
assert(graph.authoringPolicy.unknownSpacePolicy.includes('Do not create filler'), 'Unknown-space protection is missing.');
assert(graph.authoringPolicy.geometryPolicy.startsWith('No coordinates'), 'Geometry prohibition is missing.');
assert(graph.completionGates.length >= 6, 'Phase 7.2 completion gates are incomplete.');

console.log(`Black Whale Phase 7.2 contract audit passed: ${graph.containers.length} containers, ${graph.edgeClasses.length} edge classes, ${graph.macroRelations.length} non-traversable macro relations, ${registry.length} registry records awaiting normalization.`);
