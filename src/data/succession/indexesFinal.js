import { buildSuccessionIndexes as buildBaseSuccessionIndexes } from './indexes.js';

export const buildSuccessionIndexes = (data) => buildBaseSuccessionIndexes(Object.freeze({
  ...data,
  glossaryEntries: Object.freeze({}),
  mediaRecords: Object.freeze({}),
}));
