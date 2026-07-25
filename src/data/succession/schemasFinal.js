import {
  assertValidSuccessionArchiveData as assertBaseSuccessionArchiveData,
  validateSuccessionArchiveData as validateBaseSuccessionArchiveData,
} from './schemas.js';

const canonicalDataOnly = (data) => Object.freeze({
  ...data,
  glossaryEntries: Object.freeze({}),
  mediaRecords: Object.freeze({}),
});

export const validateSuccessionArchiveData = (data) => validateBaseSuccessionArchiveData(canonicalDataOnly(data));
export const assertValidSuccessionArchiveData = (data) => assertBaseSuccessionArchiveData(canonicalDataOnly(data));
