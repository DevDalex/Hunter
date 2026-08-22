import {
  validateSuccessionArchiveData as validateBaseSuccessionArchiveData,
} from './schemas.js';
import { validateHighValueIntelligenceData } from './highValueIntelligenceSchemas.js';
import { validateInformationConsistencyData } from './informationConsistency.js';
import { getSuccessionRuntimeSchemaCoverage } from './runtimeSchemaCoverage.js';

const canonicalDataOnly = (data) => Object.freeze({
  ...data,
  glossaryEntries: Object.freeze({}),
  mediaRecords: Object.freeze({}),
  knowledgeRecords: Object.freeze([]),
  protocolRecords: Object.freeze([]),
  objects: Object.freeze([]),
  documents: Object.freeze([]),
  evidenceItems: Object.freeze([]),
});

export const validateSuccessionArchiveData = (data) => {
  const base = validateBaseSuccessionArchiveData(canonicalDataOnly(data));
  const information = validateInformationConsistencyData(data);
  const intelligence = validateHighValueIntelligenceData(data);
  const runtimeSchemaCoverage = getSuccessionRuntimeSchemaCoverage(data);
  const intelligenceEntityCount = intelligence.stats.knowledgeRecords
    + intelligence.stats.protocols
    + intelligence.stats.objects
    + intelligence.stats.documents
    + intelligence.stats.evidenceItems;
  const schemaCoverageErrors = runtimeSchemaCoverage.valid ? [] : [
    `runtime schema coverage drifted: ${[
      runtimeSchemaCoverage.missingRegisteredTypes.length ? `registered/uncovered ${runtimeSchemaCoverage.missingRegisteredTypes.join(', ')}` : null,
      runtimeSchemaCoverage.unknownCoveredTypes.length ? `covered/unregistered ${runtimeSchemaCoverage.unknownCoveredTypes.join(', ')}` : null,
      runtimeSchemaCoverage.uncoveredDataTypes.length ? `data/uncovered ${runtimeSchemaCoverage.uncoveredDataTypes.join(', ')}` : null,
      runtimeSchemaCoverage.unknownDataTypes.length ? `data/unregistered ${runtimeSchemaCoverage.unknownDataTypes.join(', ')}` : null,
    ].filter(Boolean).join('; ')}`,
  ];
  const errors = Object.freeze([...base.errors, ...information.errors, ...intelligence.errors, ...schemaCoverageErrors]);
  const warnings = Object.freeze([...base.warnings, ...information.warnings, ...intelligence.warnings]);
  return Object.freeze({
    valid: errors.length === 0,
    errors,
    warnings,
    runtimeSchemaCoverage,
    stats: Object.freeze({
      ...base.stats,
      entities: base.stats.entities + intelligenceEntityCount,
      informationConsistencyVersion: data.informationConsistencyVersion || 'unversioned',
      highValueIntelligenceVersion: data.highValueIntelligenceVersion || 'unversioned',
      runtimeSchemaVersion: runtimeSchemaCoverage.version,
      runtimeSchemaTypes: runtimeSchemaCoverage.coveredTypes.length,
      structuredStateCharacters: information.stats.explicitStateCharacters,
      aliasKeys: information.stats.aliasKeys,
      aliasCollisionCount: information.stats.aliasCollisionCount,
      knowledgeRecords: intelligence.stats.knowledgeRecords,
      protocols: intelligence.stats.protocols,
      objects: intelligence.stats.objects,
      documents: intelligence.stats.documents,
      evidenceItems: intelligence.stats.evidenceItems,
      editorialChanges: intelligence.stats.editorialChanges,
    }),
  });
};

export const assertValidSuccessionArchiveData = (data) => {
  const result = validateSuccessionArchiveData(data);
  if (!result.valid) {
    throw new Error(`Succession Archive data validation failed:\n- ${result.errors.join('\n- ')}`);
  }
  return result;
};
