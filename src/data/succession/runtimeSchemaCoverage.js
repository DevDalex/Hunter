import { ENTITY_TYPE_VALUES } from './registries.js';

export const SUCCESSION_RUNTIME_SCHEMA_VERSION = 'runtime-schema-v1';

export const successionRuntimeSchemaFamilies = Object.freeze({
  base: Object.freeze([
    'character',
    'organization',
    'ability',
    'guardian-beast',
    'location',
    'location-history',
    'event',
    'assignment',
    'chapter',
    'relationship',
    'source',
  ]),
  intelligence: Object.freeze([
    'knowledge-record',
    'protocol',
    'object',
    'document',
    'evidence-item',
  ]),
});

export const successionRuntimeSchemaTypeToFamily = Object.freeze(Object.fromEntries(
  Object.entries(successionRuntimeSchemaFamilies).flatMap(([family, types]) => types.map((type) => [type, family])),
));

const entityRecords = (data = {}) => Object.values(data)
  .filter(Array.isArray)
  .flat()
  .filter((record) => record && typeof record === 'object' && typeof record.id === 'string' && typeof record.entityType === 'string');

export function getSuccessionRuntimeSchemaCoverage(data = {}) {
  const records = entityRecords(data);
  const registered = new Set(ENTITY_TYPE_VALUES);
  const covered = new Set(Object.keys(successionRuntimeSchemaTypeToFamily));
  const dataTypes = new Set(records.map((record) => record.entityType));
  const missingRegisteredTypes = ENTITY_TYPE_VALUES.filter((type) => !covered.has(type));
  const unknownCoveredTypes = [...covered].filter((type) => !registered.has(type));
  const uncoveredDataTypes = [...dataTypes].filter((type) => !covered.has(type));
  const unknownDataTypes = [...dataTypes].filter((type) => !registered.has(type));
  const counts = Object.freeze(Object.fromEntries(ENTITY_TYPE_VALUES.map((type) => [
    type,
    records.filter((record) => record.entityType === type).length,
  ])));

  return Object.freeze({
    version: SUCCESSION_RUNTIME_SCHEMA_VERSION,
    valid: missingRegisteredTypes.length === 0
      && unknownCoveredTypes.length === 0
      && uncoveredDataTypes.length === 0
      && unknownDataTypes.length === 0,
    registeredTypes: Object.freeze([...ENTITY_TYPE_VALUES]),
    coveredTypes: Object.freeze([...covered]),
    dataTypes: Object.freeze([...dataTypes].sort()),
    missingRegisteredTypes: Object.freeze(missingRegisteredTypes),
    unknownCoveredTypes: Object.freeze(unknownCoveredTypes),
    uncoveredDataTypes: Object.freeze(uncoveredDataTypes),
    unknownDataTypes: Object.freeze(unknownDataTypes),
    counts,
  });
}

export function assertSuccessionRuntimeSchemaCoverage(data = {}) {
  const coverage = getSuccessionRuntimeSchemaCoverage(data);
  if (!coverage.valid) {
    const failures = [
      coverage.missingRegisteredTypes.length ? `registered but uncovered: ${coverage.missingRegisteredTypes.join(', ')}` : null,
      coverage.unknownCoveredTypes.length ? `covered but unregistered: ${coverage.unknownCoveredTypes.join(', ')}` : null,
      coverage.uncoveredDataTypes.length ? `runtime data without schema family: ${coverage.uncoveredDataTypes.join(', ')}` : null,
      coverage.unknownDataTypes.length ? `runtime data with unknown entity type: ${coverage.unknownDataTypes.join(', ')}` : null,
    ].filter(Boolean);
    throw new Error(`Succession runtime schema coverage failed: ${failures.join('; ')}`);
  }
  return coverage;
}
