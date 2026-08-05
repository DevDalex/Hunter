const requiredString = (record, field, type) => {
  if (typeof record?.[field] !== 'string' || !record[field].trim()) throw new TypeError(`${type}.${field} must be a non-empty string.`);
};
const optionalString = (record, field, type) => {
  const value = record?.[field];
  if (value !== undefined && value !== null && typeof value !== 'string') throw new TypeError(`${type}.${field} must be a string.`);
};
const optionalArray = (record, field, type) => {
  const value = record?.[field];
  if (value !== undefined && value !== null && !Array.isArray(value)) throw new TypeError(`${type}.${field} must be an array.`);
};
const optionalChapter = (record, field, type) => {
  const value = record?.[field];
  if (value !== undefined && value !== null && (!Number.isInteger(Number(value)) || Number(value) < 1)) throw new TypeError(`${type}.${field} must be a positive chapter number.`);
};
const baseEntity = (record, type) => {
  requiredString(record, 'id', type);
  optionalChapter(record, 'introducedAtChapter', type);
  optionalChapter(record, 'validFromChapter', type);
  optionalChapter(record, 'validToChapter', type);
  optionalArray(record, 'sources', type);
  optionalArray(record, 'evidence', type);
  return record;
};
const namedEntity = (record, type) => {
  baseEntity(record, type);
  if (![record?.name, record?.title, record?.label].some((value) => typeof value === 'string' && value.trim())) throw new TypeError(`${type} requires name, title, or label.`);
  return record;
};

export const archiveSchemas = Object.freeze({
  route(record) {
    requiredString(record, 'id', 'route');
    requiredString(record, 'title', 'route');
    if (typeof record.path !== 'string') throw new TypeError('route.path must be a string.');
    return record;
  },
  entity(record) {
    baseEntity(record, 'entity');
    requiredString(record, 'entityType', 'entity');
    return record;
  },
  character(record) {
    namedEntity(record, 'character');
    optionalArray(record, 'affiliations', 'character');
    optionalArray(record, 'roles', 'character');
    optionalString(record, 'lifeStatus', 'character');
    return record;
  },
  organization(record) {
    namedEntity(record, 'organization');
    optionalArray(record, 'members', 'organization');
    optionalArray(record, 'objectives', 'organization');
    return record;
  },
  chapter(record) {
    namedEntity(record, 'chapter');
    const chapter = Number(record.chapter ?? record.number);
    if (!Number.isInteger(chapter) || chapter < 1) throw new TypeError('chapter.chapter must be a positive integer.');
    optionalArray(record, 'events', 'chapter');
    return record;
  },
  event(record) {
    namedEntity(record, 'event');
    optionalChapter(record, 'chapter', 'event');
    optionalArray(record, 'participants', 'event');
    optionalArray(record, 'consequences', 'event');
    return record;
  },
  relationship(record) {
    baseEntity(record, 'relationship');
    requiredString(record, 'type', 'relationship');
    optionalString(record, 'sourceId', 'relationship');
    optionalString(record, 'targetId', 'relationship');
    return record;
  },
  assignment(record) {
    baseEntity(record, 'assignment');
    optionalString(record, 'assigneeId', 'assignment');
    optionalString(record, 'principalId', 'assignment');
    optionalString(record, 'status', 'assignment');
    return record;
  },
  ability(record) {
    namedEntity(record, 'ability');
    optionalArray(record, 'conditions', 'ability');
    optionalArray(record, 'restrictions', 'ability');
    optionalString(record, 'nenType', 'ability');
    return record;
  },
  location(record) {
    namedEntity(record, 'location');
    optionalString(record, 'parentId', 'location');
    optionalArray(record, 'occupants', 'location');
    return record;
  },
  guardianBeast(record) {
    namedEntity(record, 'guardianBeast');
    optionalString(record, 'hostId', 'guardianBeast');
    optionalArray(record, 'abilities', 'guardianBeast');
    return record;
  },
  glossary(record) {
    namedEntity(record, 'glossary');
    optionalArray(record, 'aliases', 'glossary');
    optionalString(record, 'definition', 'glossary');
    return record;
  },
  evidence(record) {
    requiredString(record, 'id', 'evidence');
    requiredString(record, 'text', 'evidence');
    if (!record.kind || !record.certainty) throw new TypeError('evidence requires kind and certainty.');
    optionalChapter(record, 'chapter', 'evidence');
    optionalArray(record, 'contradictions', 'evidence');
    return record;
  },
  investigation(record) {
    requiredString(record, 'id', 'investigation');
    requiredString(record, 'title', 'investigation');
    optionalChapter(record, 'chapter', 'investigation');
    optionalArray(record, 'records', 'investigation');
    optionalArray(record, 'evidenceFor', 'investigation');
    optionalArray(record, 'evidenceAgainst', 'investigation');
    return record;
  },
});

export const validateArchiveRecord = (schema, record) => {
  const validator = archiveSchemas[schema];
  if (!validator) throw new Error(`Unknown archive schema: ${schema}`);
  return validator(record);
};
