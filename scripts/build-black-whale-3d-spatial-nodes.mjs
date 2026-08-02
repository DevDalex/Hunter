import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));

const registryPath = 'public/phase7/black-whale-3d-location-registry-342-415.json';
const normalizationPath = 'public/phase7/black-whale-3d-spatial-normalization.json';
const outputPath = 'public/phase7/black-whale-3d-spatial-nodes.generated.json';

const registry = await readJson(registryPath);
const normalization = await readJson(normalizationPath);

const exceptionMap = new Map(normalization.identityExceptions.map((entry) => [entry.recordId, entry]));

const inclusiveTierRange = (start, end) => {
  const low = Math.min(Number(start), Number(end));
  const high = Math.max(Number(start), Number(end));
  return Array.from({ length: high - low + 1 }, (_, index) => `bw3d.container.tier-${low + index}`);
};

const normalizeRecord = (record) => {
  const exception = exceptionMap.get(record.id);
  if (exception) {
    return {
      containers: exception.containers,
      candidateContainers: [],
      certainty: record.evidenceState,
      traversalPolicy: record.recordType === 'route' ? 'prohibited-until-edge-authoring' : 'not-applicable',
      spatialMeaning: record.recordType === 'route' ? 'scope-only' : 'containment-only',
      normalizationBasis: 'identity-exception',
      note: exception.reason,
    };
  }

  const direct = normalization.directTierMap[record.tier];
  if (direct) {
    return {
      containers: direct,
      candidateContainers: [],
      certainty: record.evidenceState,
      traversalPolicy: record.recordType === 'route' ? 'prohibited-until-edge-authoring' : 'not-applicable',
      spatialMeaning: record.recordType === 'route' ? 'scope-only' : 'containment-only',
      normalizationBasis: 'direct-tier-map',
    };
  }

  for (const rule of normalization.uncertaintyRules) {
    const match = record.tier.match(new RegExp(rule.pattern));
    if (!match) continue;
    const candidateContainers = rule.candidateContainerTemplate
      ? [rule.candidateContainerTemplate.replace('$1', match[1])]
      : [];
    return {
      containers: rule.containers,
      candidateContainers,
      certainty: rule.certainty,
      traversalPolicy: rule.traversal,
      spatialMeaning: rule.spatialMeaning ?? 'unresolved-placement',
      normalizationBasis: 'uncertainty-rule',
    };
  }

  for (const rule of normalization.compositeRules) {
    const match = record.tier.match(new RegExp(rule.pattern));
    if (!match) continue;

    let containers = rule.containers ?? [];
    if (rule.mode === 'inclusive-tier-range') {
      containers = inclusiveTierRange(match[1], match[2]);
    } else if (rule.mode === 'endpoint-scope-only') {
      containers = [`bw3d.container.tier-${match[1]}`, `bw3d.container.tier-${match[2]}`];
    } else if (rule.mode === 'hull-and-tier-scope') {
      containers = ['bw3d.container.hull', `bw3d.container.tier-${match[1]}`];
    } else if (rule.mode === 'tier-plus-nonspatial-qualifier') {
      containers = [`bw3d.container.tier-${match[1]}`];
    }

    return {
      containers,
      candidateContainers: [],
      certainty: rule.certainty,
      traversalPolicy: rule.traversal,
      spatialMeaning: 'composite-scope-only',
      normalizationBasis: 'composite-rule',
    };
  }

  return {
    containers: normalization.fallbackRule.containers,
    candidateContainers: [],
    certainty: normalization.fallbackRule.certainty,
    traversalPolicy: normalization.fallbackRule.traversal,
    spatialMeaning: 'unrecognized-scope-quarantine',
    normalizationBasis: 'fallback-rule',
    note: normalization.fallbackRule.reason,
  };
};

const records = registry
  .map((record) => {
    const normalized = normalizeRecord(record);
    return {
      id: record.id,
      label: record.label,
      recordType: record.recordType,
      sourceTierScope: record.tier,
      evidenceState: record.evidenceState,
      evidenceAtomIds: record.atomIds,
      evidenceAtomCount: record.atomCount,
      containers: normalized.containers,
      candidateContainers: normalized.candidateContainers,
      certainty: normalized.certainty,
      spatialMeaning: normalized.spatialMeaning,
      normalizationBasis: normalized.normalizationBasis,
      traversalPolicy: normalized.traversalPolicy,
      traversalAuthorized: false,
      geometryAuthorized: false,
      note: normalized.note ?? null,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const countBy = (items, key) => items.reduce((counts, item) => {
  const value = item[key];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

const output = {
  schemaVersion: '7.2.0',
  phase: '7.2',
  status: 'active',
  generatedFrom: {
    registry: `/${registryPath.replace(/^public\//, '')}`,
    normalizationContract: `/${normalizationPath.replace(/^public\//, '')}`,
  },
  rules: {
    sharedContainerDoesNotImplyAdjacency: true,
    routeScopeDoesNotAuthorizeTraversal: true,
    containmentDoesNotAuthorizeGeometry: true,
    unresolvedCandidatesRemainNonNavigable: true,
  },
  summary: {
    records: records.length,
    nodes: records.filter((record) => record.recordType === 'node').length,
    routes: records.filter((record) => record.recordType === 'route').length,
    unresolvedContainerAssignments: records.filter((record) => record.containers.includes('bw3d.container.unresolved-tier')).length,
    fallbackAssignments: records.filter((record) => record.normalizationBasis === 'fallback-rule').length,
    byRecordType: countBy(records, 'recordType'),
    byNormalizationBasis: countBy(records, 'normalizationBasis'),
  },
  records,
};

const json = `${JSON.stringify(output, null, 2)}\n`;
const shouldWrite = process.argv.includes('--write');
const shouldCheck = process.argv.includes('--check') || !shouldWrite;

if (shouldWrite) {
  await writeFile(path.join(root, outputPath), json, 'utf8');
  console.log(`Wrote ${outputPath}: ${output.summary.records} records.`);
}

if (shouldCheck) {
  if (output.summary.records !== registry.length) throw new Error('Materialized record count differs from registry.');
  if (output.summary.fallbackAssignments !== 0) throw new Error('Fallback assignments remain in the materialized node set.');
  if (records.some((record) => record.containers.length === 0)) throw new Error('A materialized record has no graph container.');
  if (records.some((record) => record.traversalAuthorized || record.geometryAuthorized)) {
    throw new Error('Node materialization cannot authorize traversal or geometry.');
  }
  console.log(`Black Whale Phase 7.2 node materialization passed: ${output.summary.records} records, ${output.summary.nodes} nodes, ${output.summary.routes} route scopes, ${output.summary.unresolvedContainerAssignments} unresolved-container assignments, zero geometry or traversal authorization.`);
}
