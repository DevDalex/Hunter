const requiredString = (record, field, type) => {
  if (typeof record?.[field] !== 'string' || !record[field].trim()) throw new TypeError(`${type}.${field} must be a non-empty string.`);
};
const optionalChapter = (record, field, type) => {
  const value = record?.[field];
  if (value !== undefined && value !== null && (!Number.isInteger(Number(value)) || Number(value) < 1)) throw new TypeError(`${type}.${field} must be a positive chapter number.`);
};

export const archiveSchemas = Object.freeze({
  route(record) {
    requiredString(record, 'id', 'route');
    requiredString(record, 'title', 'route');
    if (typeof record.path !== 'string') throw new TypeError('route.path must be a string.');
    return record;
  },
  entity(record) {
    requiredString(record, 'id', 'entity');
    requiredString(record, 'entityType', 'entity');
    optionalChapter(record, 'introducedAtChapter', 'entity');
    optionalChapter(record, 'validFromChapter', 'entity');
    return record;
  },
  evidence(record) {
    requiredString(record, 'id', 'evidence');
    requiredString(record, 'text', 'evidence');
    if (!record.kind || !record.certainty) throw new TypeError('evidence requires kind and certainty.');
    return record;
  },
  investigation(record) {
    requiredString(record, 'id', 'investigation');
    requiredString(record, 'title', 'investigation');
    optionalChapter(record, 'chapter', 'investigation');
    if (record.records && !Array.isArray(record.records)) throw new TypeError('investigation.records must be an array.');
    return record;
  },
});

export const validateArchiveRecord = (schema, record) => {
  const validator = archiveSchemas[schema];
  if (!validator) throw new Error(`Unknown archive schema: ${schema}`);
  return validator(record);
};
