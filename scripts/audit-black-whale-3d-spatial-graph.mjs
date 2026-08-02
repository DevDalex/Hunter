import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const graph = await readJson('public/phase7/black-whale-3d-spatial-graph.json');
const normalization = await readJson('public/phase7/black-whale-3d-spatial-normalization.json');
const registry = await readJson('public/phase7/black-whale-3d-location-registry-342-415.json');
const tracker = await readJson('public/phase7/black-whale-3d-full-page-review-342-415.json');

assert(graph.schemaVersion === '7.2.0', 'Unexpected spatial graph schema version.');
assert(graph.phase === '7.2' && graph.status === 'active', 'Phase 7.2 must be active.');
assert(normalization.schemaVersion === '7.2.0' && normalization.phase === '7.2', 'Unexpected normalization contract.');
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

const directMap = normalization.directTierMap;
for (const containers of Object.values(directMap)) {
  for (const container of containers) assert(containerIds.has(container), `Normalization uses unknown container ${container}.`);
}
for (const rule of normalization.compositeRules) {
  if (rule.containers) for (const container of rule.containers) assert(containerIds.has(container), `Composite rule uses unknown container ${container}.`);
}
for (const rule of normalization.uncertaintyRules) {
  for (const container of rule.containers) assert(containerIds.has(container), `Uncertainty rule uses unknown container ${container}.`);
}
for (const exception of normalization.identityExceptions) {
  for (const container of exception.containers) assert(containerIds.has(container), `Identity exception uses unknown container ${container}.`);
}

const exceptionMap = new Map(normalization.identityExceptions.map((item) => [item.recordId, item]));
const tierContainer = (tier) => `bw3d.container.tier-${tier}`;
const inclusiveRange = (start, end) => {
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  return Array.from({ length: high - low + 1 }, (_, index) => tierContainer(low + index));
};

const normalizeRecord = (record) => {
  const exception = exceptionMap.get(record.id);
  if (exception) return { containers: exception.containers, mode: 'identity-exception', certainty: record.evidenceState };

  if (directMap[record.tier]) return { containers: directMap[record.tier], mode: 'direct', certainty: record.evidenceState };

  let match = record.tier.match(/^tiers-([1-5])-([1-5])$/);
  if (match) return { containers: inclusiveRange(Number(match[1]), Number(match[2])), mode: 'inclusive-tier-range', certainty: 'confirmed-with-open-questions' };

  match = record.tier.match(/^tier-([1-5])-to-tier-([1-5])$/);
  if (match) return { containers: [tierContainer(match[1]), tierContainer(match[2])], mode: 'endpoint-scope-only', certainty: 'confirmed-with-open-questions' };

  match = record.tier.match(/^hull\/tier-([1-5])$/);
  if (match) return { containers: ['bw3d.container.hull', tierContainer(match[1])], mode: 'hull-and-tier-scope', certainty: 'confirmed-with-open-questions' };

  match = record.tier.match(/^tier-([1-5])\/.+$/);
  if (match) return { containers: [tierContainer(match[1])], mode: 'tier-plus-nonspatial-qualifier', certainty: 'confirmed-with-open-questions' };

  match = record.tier.match(/^likely-tier-([1-5])$/);
  if (match) return { containers: ['bw3d.container.unresolved-tier'], candidateContainers: [tierContainer(match[1])], mode: 'uncertain-candidate', certainty: 'unresolved' };

  if (record.tier === 'hull/exterior') return { containers: ['bw3d.container.hull', 'bw3d.container.exterior'], mode: 'boundary-scope', certainty: 'confirmed-with-open-questions' };
  if (record.tier === 'nen-space') return { containers: ['bw3d.container.ship-wide'], mode: 'non-coordinate-overlay', certainty: 'confirmed-with-open-questions' };

  return { containers: normalization.fallbackRule.containers, mode: 'fallback-unresolved', certainty: 'unknown' };
};

const normalized = registry.map((record) => ({ record, assignment: normalizeRecord(record) }));
for (const { record, assignment } of normalized) {
  assert(assignment.containers.length > 0, `${record.id} has no normalized container.`);
  for (const container of assignment.containers) assert(containerIds.has(container), `${record.id} normalized to unknown container ${container}.`);
  if (record.recordType === 'route') {
    assert(record.traversalPolicy !== 'traversable', `${record.id} cannot become traversable from registry scope alone.`);
  }
}

const normalizedIds = new Set(normalized.map(({ record }) => record.id));
assert(normalizedIds.size === registry.length, 'Registry IDs are duplicated or normalization lost records.');
const fallbackRecords = normalized.filter(({ assignment }) => assignment.mode === 'fallback-unresolved');
const routeRecords = normalized.filter(({ record }) => record.recordType === 'route');
const compositeRecords = normalized.filter(({ assignment }) => ['inclusive-tier-range','endpoint-scope-only','hull-and-tier-scope','boundary-scope','tier-plus-nonspatial-qualifier'].includes(assignment.mode));
const quarantinedRecords = normalized.filter(({ assignment }) => assignment.containers.includes('bw3d.container.unresolved-tier'));

assert(normalization.completionPolicy.allRegistryRecordsMustNormalize === true, 'Normalization completeness policy is missing.');
assert(normalization.completionPolicy.routeScopeDoesNotAuthorizeTraversal === true, 'Route traversal safeguard is missing.');
assert(normalization.completionPolicy.unknownSpaceMayNotBeFilled === true, 'Unknown-space safeguard is missing.');

console.log(`Black Whale Phase 7.2 audit passed: ${graph.containers.length} containers, ${graph.edgeClasses.length} edge classes, ${graph.macroRelations.length} non-traversable macro relations, ${registry.length} registry records normalized, ${routeRecords.length} route scopes retained as non-authorizing, ${compositeRecords.length} composite scopes preserved, ${quarantinedRecords.length} unresolved-container assignments, ${fallbackRecords.length} fallback assignments.`);
