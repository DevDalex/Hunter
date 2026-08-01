import {
  validateSuccessionArchiveData as validateBaseSuccessionArchiveData,
} from './schemas.js';
import { validateInformationConsistencyData } from './informationConsistency.js';

const canonicalDataOnly = (data) => Object.freeze({
  ...data,
  glossaryEntries: Object.freeze({}),
  mediaRecords: Object.freeze({}),
});

export const validateSuccessionArchiveData = (data) => {
  const base = validateBaseSuccessionArchiveData(canonicalDataOnly(data));
  const information = validateInformationConsistencyData(data);
  const errors = Object.freeze([...base.errors, ...information.errors]);
  const warnings = Object.freeze([...base.warnings, ...information.warnings]);
  return Object.freeze({
    valid: errors.length === 0,
    errors,
    warnings,
    stats: Object.freeze({
      ...base.stats,
      informationConsistencyVersion: data.informationConsistencyVersion || 'unversioned',
      structuredStateCharacters: information.stats.explicitStateCharacters,
      aliasKeys: information.stats.aliasKeys,
      aliasCollisionCount: information.stats.aliasCollisionCount,
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
