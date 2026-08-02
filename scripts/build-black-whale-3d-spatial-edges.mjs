import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));

const nodeBuilderPath = 'scripts/build-black-whale-3d-spatial-nodes.mjs';
const nodesPath = 'public/phase7/black-whale-3d-spatial-nodes.generated.json';
const outputPath = 'public/phase7/black-whale-3d-spatial-edges.generated.json';

const buildNodes = spawnSync(process.execPath, [nodeBuilderPath, '--write'], {
  cwd: root,
  encoding: 'utf8',
});
if (buildNodes.status !== 0) {
  throw new Error(`Node materialization failed before edge authoring:\n${buildNodes.stderr || buildNodes.stdout}`);
}

const nodes = await readJson(nodesPath);
const slug = (value) => value.replace(/^bw3d\./, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

const edges = [];
for (const record of nodes.records) {
  for (const [index, container] of record.containers.entries()) {
    const isRouteScope = record.recordType === 'route';
    edges.push({
      id: `bw3d.edge.${isRouteScope ? 'scope' : 'containment'}.${slug(record.id)}.${index + 1}`,
      from: isRouteScope ? record.id : container,
      to: isRouteScope ? container : record.id,
      type: isRouteScope ? 'associated-with' : 'contains',
      evidenceAtomIds: record.evidenceAtomIds,
      certainty: record.certainty,
      relationMeaning: isRouteScope ? 'documented-route-scope-only' : 'normalized-container-membership-only',
      traversalPolicy: isRouteScope ? 'prohibited-scope-does-not-prove-endpoints' : 'prohibited-containment-does-not-prove-adjacency',
      traversalAuthorized: false,
      geometryAuthorized: false,
      contradictionStatus: container === 'bw3d.container.unresolved-tier' ? 'quarantined-placement' : 'none',
      normalizationBasis: record.normalizationBasis,
    });
  }
}

const routeReviewQueue = nodes.records
  .filter((record) => record.recordType === 'route')
  .map((record) => ({
    routeId: record.id,
    label: record.label,
    evidenceAtomIds: record.evidenceAtomIds,
    scopeContainers: record.containers,
    candidateFrom: null,
    candidateTo: null,
    direction: 'unresolved',
    endpointStatus: 'independent-endpoint-review-required',
    traversalAuthorized: false,
    geometryAuthorized: false,
    note: 'A route label and tier scope are insufficient to create a physical graph connection.',
  }));

const output = {
  schemaVersion: '7.2.0',
  phase: '7.2',
  status: 'active',
  generatedFrom: {
    normalizedNodes: `/${nodesPath.replace(/^public\//, '')}`,
    nodeBuilder: `/${nodeBuilderPath}`,
  },
  rules: {
    containmentIsNonTraversable: true,
    sharedContainerDoesNotImplyAdjacency: true,
    routeScopeIsAssociationOnly: true,
    routeEndpointsRequireIndependentReview: true,
    geometryAuthorizationCountMustRemainZero: true,
  },
  summary: {
    recordsCovered: nodes.records.length,
    edges: edges.length,
    containmentEdges: edges.filter((edge) => edge.type === 'contains').length,
    routeScopeAssociations: edges.filter((edge) => edge.relationMeaning === 'documented-route-scope-only').length,
    routeRecordsAwaitingEndpointReview: routeReviewQueue.length,
    traversableEdges: edges.filter((edge) => edge.traversalAuthorized).length,
    geometryAuthorizedEdges: edges.filter((edge) => edge.geometryAuthorized).length,
    quarantinedPlacementEdges: edges.filter((edge) => edge.contradictionStatus === 'quarantined-placement').length,
  },
  edges,
  routeReviewQueue,
};

const shouldWrite = process.argv.includes('--write');
const shouldCheck = process.argv.includes('--check') || !shouldWrite;
const json = `${JSON.stringify(output, null, 2)}\n`;

if (shouldWrite) {
  await writeFile(path.join(root, outputPath), json, 'utf8');
  console.log(`Wrote ${outputPath}: ${output.summary.edges} edges.`);
}

if (shouldCheck) {
  const covered = new Set(edges.flatMap((edge) => [edge.from, edge.to]).filter((id) => id.startsWith('bw3d.node.') || id.startsWith('bw3d.route.')));
  if (covered.size !== nodes.records.length) throw new Error('Not every normalized record is covered by an authored edge.');
  if (edges.some((edge) => edge.evidenceAtomIds.length === 0)) throw new Error('An edge lacks evidence atom references.');
  if (edges.some((edge) => edge.traversalAuthorized || edge.geometryAuthorized)) throw new Error('Containment/scope edge batch cannot authorize traversal or geometry.');
  if (edges.some((edge) => edge.type === 'contains' && edge.from.startsWith('bw3d.route.'))) throw new Error('A route scope was incorrectly converted into containment.');
  if (routeReviewQueue.length !== nodes.summary.routes) throw new Error('Route endpoint review queue is incomplete.');
  if (routeReviewQueue.some((route) => route.candidateFrom || route.candidateTo || route.traversalAuthorized)) {
    throw new Error('Route endpoint review queue cannot pre-author endpoints or traversal.');
  }
  console.log(`Black Whale Phase 7.2 edge materialization passed: ${output.summary.edges} non-traversable edges cover ${output.summary.recordsCovered} records; ${output.summary.containmentEdges} containment edges, ${output.summary.routeScopeAssociations} route-scope associations, ${output.summary.routeRecordsAwaitingEndpointReview} routes awaiting independent endpoint review, zero geometry authorization.`);
}
