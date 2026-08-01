import {
  validateSuccessionArchiveData as validateBaseSuccessionArchiveData,
} from './schemas.js';
import { validateHighValueIntelligenceData } from './highValueIntelligenceSchemas.js';
import { validateInformationConsistencyData } from './informationConsistency.js';

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
  const errors = Object.freeze([...base.errors, ...information.errors, ...intelligence.errors]);
  const warnings = Object.freeze([...base.warnings, ...information.warnings, ...intelligence.warnings]);
  return Object.freeze({
    valid: errors.length === 0,
    errors,
    warnings,
    stats: Object.freeze({
      ...base.stats,
      informationConsistencyVersion: data.informationConsistencyVersion || 'unversioned',
      highValueIntelligenceVersion: data.highValueIntelligenceVersion || 'unversioned',
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
