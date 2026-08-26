import {
  ARTIFACT_STATES,
  KNOWLEDGE_STATE_VALUES,
  PROTOCOL_DOMAIN_VALUES,
  PROTOCOL_STATUSES,
} from './registries.js';

const freeze = (values = []) => Object.freeze([...values]);
const isString = (value) => typeof value === 'string' && value.trim().length > 0;
const isInteger = (value) => Number.isInteger(value);
const isArray = Array.isArray;
const INTELLIGENCE_TYPES = Object.freeze(['knowledge-record', 'protocol', 'object', 'document', 'evidence-item']);
const ID_PATTERNS = Object.freeze({
  'knowledge-record': /^knowledge-record:[a-z0-9][a-z0-9:-]*$/,
  protocol: /^protocol:[a-z0-9][a-z0-9:-]*$/,
  object: /^object:[a-z0-9][a-z0-9:-]*$/,
  document: /^document:[a-z0-9][a-z0-9:-]*$/,
  'evidence-item': /^evidence-item:[a-z0-9][a-z0-9:-]*$/,
});

const validateBase = (record, knownIds, errors) => {
  const label = record?.id || 'unknown Phase 4 record';
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    errors.push('every Phase 4 record must be an object');
    return;
  }
  if (!INTELLIGENCE_TYPES.includes(record.entityType)) errors.push(`${label}.entityType is not a Phase 4 intelligence type`);
  if (!ID_PATTERNS[record.entityType]?.test(record.id || '')) errors.push(`${label}.id does not match ${record.entityType}`);
  if (!isString(record.slug)) errors.push(`${label}.slug is required`);
  if (!isString(record.name)) errors.push(`${label}.name is required`);
  if (!isString(record.summary)) errors.push(`${label}.summary is required`);
  if (record.publicationStatus !== 'published') errors.push(`${label}.publicationStatus must be published`);
  if (!['canon', 'inference', 'theory'].includes(record.canonLevel)) errors.push(`${label}.canonLevel is invalid`);
  if (!isArray(record.aliases)) errors.push(`${label}.aliases must be an array`);
  if (!isArray(record.sourceIds) || record.sourceIds.length === 0) errors.push(`${label}.sourceIds must contain at least one chapter source`);
  for (const sourceId of record.sourceIds || []) {
    if (!knownIds.has(sourceId)) errors.push(`${label}.sourceIds references missing ${sourceId}`);
  }
  if (!record.chapterRange || !isInteger(record.chapterRange.start)) errors.push(`${label}.chapterRange.start is required`);
  if (record.chapterRange?.end != null && (!isInteger(record.chapterRange.end) || record.chapterRange.end < record.chapterRange.start)) {
    errors.push(`${label}.chapterRange.end is invalid`);
  }
};

const validateIdArray = (record, key, knownIds, errors, allowFutureArtifacts = false) => {
  if (!isArray(record[key])) {
    errors.push(`${record.id}.${key} must be an array`);
    return;
  }
  for (const id of record[key]) {
    if (!knownIds.has(id) && !(allowFutureArtifacts && /^(object|document|evidence-item):/.test(id))) {
      errors.push(`${record.id}.${key} references missing ${id}`);
    }
  }
};

const validateKnowledge = (record, knownIds, errors) => {
  if (!KNOWLEDGE_STATE_VALUES.includes(record.knowledgeState)) errors.push(`${record.id}.knowledgeState is invalid`);
  if (!isString(record.secrecy)) errors.push(`${record.id}.secrecy is required`);
  if (!isArray(record.subjectLabels) || record.subjectLabels.length === 0) errors.push(`${record.id}.subjectLabels must not be empty`);
  if (!isArray(record.knowerLabels) || record.knowerLabels.length === 0) errors.push(`${record.id}.knowerLabels must not be empty`);
  validateIdArray(record, 'subjectEntityIds', knownIds, errors);
  validateIdArray(record, 'knowerEntityIds', knownIds, errors);
  validateIdArray(record, 'misinformedEntityIds', knownIds, errors);
  if (!isString(record.acquisition)) errors.push(`${record.id}.acquisition is required`);
  if (record.publicAtChapter != null && (!isInteger(record.publicAtChapter) || record.publicAtChapter < record.chapterRange.start)) {
    errors.push(`${record.id}.publicAtChapter cannot precede the record`);
  }
};

const validateProtocol = (record, knownIds, errors) => {
  if (!PROTOCOL_DOMAIN_VALUES.includes(record.domain)) errors.push(`${record.id}.domain is invalid`);
  if (!PROTOCOL_STATUSES.includes(record.protocolStatus)) errors.push(`${record.id}.protocolStatus is invalid`);
  for (const key of ['authority', 'ruleStatement', 'trigger', 'scope', 'enforcement']) {
    if (!isString(record[key])) errors.push(`${record.id}.${key} is required`);
  }
  if (!isArray(record.exceptions)) errors.push(`${record.id}.exceptions must be an array`);
  if (!isArray(record.openQuestions)) errors.push(`${record.id}.openQuestions must be an array`);
  validateIdArray(record, 'linkedEntityIds', knownIds, errors);
};

const validateArtifact = (record, knownIds, errors) => {
  if (!ARTIFACT_STATES.includes(record.artifactState)) errors.push(`${record.id}.artifactState is invalid`);
  const category = record.artifactCategory || record.documentCategory || record.evidenceCategory;
  if (!isString(category)) errors.push(`${record.id} requires an artifact/document/evidence category`);
  const idArrays = [
    'ownerEntityIds', 'holderEntityIds', 'authorEntityIds', 'recipientEntityIds',
    'subjectEntityIds', 'locationEntityIds', 'linkedArtifactIds',
  ];
  for (const key of idArrays) if (record[key] !== undefined) validateIdArray(record, key, knownIds, errors, key === 'linkedArtifactIds');
  if (record.entityType !== 'evidence-item' && !isArray(record.chainOfCustody)) errors.push(`${record.id}.chainOfCustody must be an array`);
  if (record.entityType === 'evidence-item') {
    if (!isString(record.evidentiaryUse)) errors.push(`${record.id}.evidentiaryUse is required`);
    if (!isString(record.custodyStatus)) errors.push(`${record.id}.custodyStatus is required`);
  }
};

export const validateHighValueIntelligenceData = (data) => {
  const errors = [];
  const warnings = [];
  const collections = [
    ...(data.knowledgeRecords || []),
    ...(data.protocolRecords || []),
    ...(data.objects || []),
    ...(data.documents || []),
    ...(data.evidenceItems || []),
  ];
  const canonicalCollections = Object.values(data).filter(Array.isArray).flat().filter((record) => record?.id);
  const knownIds = new Set(canonicalCollections.map((record) => record.id));
  const ids = collections.map((record) => record.id);
  if (new Set(ids).size !== ids.length) errors.push('Phase 4 intelligence IDs must be globally unique');

  for (const record of collections) {
    validateBase(record, knownIds, errors);
    if (record.entityType === 'knowledge-record') validateKnowledge(record, knownIds, errors);
    if (record.entityType === 'protocol') validateProtocol(record, knownIds, errors);
    if (['object', 'document', 'evidence-item'].includes(record.entityType)) validateArtifact(record, knownIds, errors);
    if (record.canonLevel === 'inference' && !(record.openQuestions?.length || /unresolved|inference|unknown/i.test(record.summary))) {
      warnings.push(`${record.id} is inferred but does not expose an uncertainty note`);
    }
  }

  const editorial = data.editorialChangeLog;
  if (!editorial || !isArray(editorial.entries)) errors.push('editorialChangeLog.entries is required');
  const editorialIds = (editorial?.entries || []).map((entry) => entry.id);
  if (new Set(editorialIds).size !== editorialIds.length) errors.push('editorial change IDs must be unique');
  for (const entry of editorial?.entries || []) {
    if (!isString(entry.id) || !entry.id.startsWith('change:')) errors.push('editorial change IDs must use the change namespace');
    if (!isString(entry.date) || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) errors.push(`${entry.id}.date is invalid`);
    if (!isString(entry.summary)) errors.push(`${entry.id}.summary is required`);
    if (!isArray(entry.affectedDomains) || entry.affectedDomains.length === 0) errors.push(`${entry.id}.affectedDomains must not be empty`);
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: freeze(errors),
    warnings: freeze(warnings),
    stats: Object.freeze({
      knowledgeRecords: data.knowledgeRecords?.length || 0,
      protocols: data.protocolRecords?.length || 0,
      objects: data.objects?.length || 0,
      documents: data.documents?.length || 0,
      evidenceItems: data.evidenceItems?.length || 0,
      editorialChanges: editorial?.entries?.length || 0,
    }),
  });
};
