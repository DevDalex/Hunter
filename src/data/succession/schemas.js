import {
  CANON_LEVEL_VALUES,
  CERTAINTY_LEVELS,
  ENTITY_TYPE_VALUES,
  EVENT_STATUSES,
  LIFE_STATUSES,
  LOCATION_TYPES,
  NEN_TYPES,
  ORGANIZATION_STATUSES,
  PUBLICATION_STATUSES,
  RELATIONSHIP_DIRECTIONS,
  RELATIONSHIP_SENTIMENTS,
  RELATIONSHIP_TYPES,
  SOURCE_TYPES,
  SUCCESSION_CHAPTER_RANGE,
} from './registries.js';

const ID_PATTERN = /^(character|organization|ability|guardian-beast|location|location-history|event|chapter|relationship|source):[a-z0-9][a-z0-9:-]*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isString = (value) => typeof value === 'string' && value.trim().length > 0;
const isInteger = (value) => Number.isInteger(value);
const inEnum = (value, values) => values.includes(value);

const validateChapterNumber = (value, label, errors) => {
  if (!isInteger(value) || value < SUCCESSION_CHAPTER_RANGE.start || value > SUCCESSION_CHAPTER_RANGE.end) {
    errors.push(`${label} must be an integer from ${SUCCESSION_CHAPTER_RANGE.start} through ${SUCCESSION_CHAPTER_RANGE.end}`);
  }
};

const validateChapterRange = (range, label, errors) => {
  if (!isObject(range)) {
    errors.push(`${label} must be an object`);
    return;
  }

  validateChapterNumber(range.start, `${label}.start`, errors);
  if (range.end !== null && range.end !== undefined) {
    validateChapterNumber(range.end, `${label}.end`, errors);
    if (isInteger(range.start) && isInteger(range.end) && range.end < range.start) {
      errors.push(`${label}.end cannot precede ${label}.start`);
    }
  }
};

const validateIdList = (values, label, knownIds, errors) => {
  if (!Array.isArray(values)) {
    errors.push(`${label} must be an array`);
    return;
  }

  for (const value of values) {
    if (!knownIds.has(value)) errors.push(`${label} references missing entity ${value}`);
  }
};

const validateBaseEntity = (entity, knownIds, errors) => {
  const label = entity?.id || 'unknown entity';

  if (!isObject(entity)) {
    errors.push('every entity must be an object');
    return;
  }
  if (!isString(entity.id) || !ID_PATTERN.test(entity.id)) errors.push(`${label}.id is invalid`);
  if (!inEnum(entity.entityType, ENTITY_TYPE_VALUES)) errors.push(`${label}.entityType is not registered`);
  if (isString(entity.id) && isString(entity.entityType) && !entity.id.startsWith(`${entity.entityType}:`)) {
    errors.push(`${label}.id namespace must match entityType ${entity.entityType}`);
  }
  if (!inEnum(entity.publicationStatus, PUBLICATION_STATUSES)) errors.push(`${label}.publicationStatus is invalid`);
  if (!inEnum(entity.canonLevel, CANON_LEVEL_VALUES)) errors.push(`${label}.canonLevel is invalid`);

  if (!['source', 'location-history'].includes(entity.entityType)) {
    if (!isString(entity.slug) || !SLUG_PATTERN.test(entity.slug)) errors.push(`${label}.slug is invalid`);
    if (!isString(entity.name)) errors.push(`${label}.name is required`);
  }

  if (!Array.isArray(entity.aliases)) errors.push(`${label}.aliases must be an array`);
  if (entity.publicationStatus === 'published' && entity.entityType !== 'source' && !isString(entity.summary)) {
    errors.push(`${label}.summary is required for published entities`);
  }

  if (entity.entityType !== 'source') {
    if (!Array.isArray(entity.sourceIds) || entity.sourceIds.length === 0) {
      errors.push(`${label}.sourceIds must contain at least one source`);
    } else {
      validateIdList(entity.sourceIds, `${label}.sourceIds`, knownIds, errors);
    }
  }
};

const validateCharacter = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!isObject(entity.status) || !inEnum(entity.status.life, LIFE_STATUSES)) errors.push(`${label}.status.life is invalid`);
  if (entity.status?.certainty && !inEnum(entity.status.certainty, CERTAINTY_LEVELS)) errors.push(`${label}.status.certainty is invalid`);
  if (entity.status?.asOfChapter !== undefined) validateChapterNumber(entity.status.asOfChapter, `${label}.status.asOfChapter`, errors);
  if (!Array.isArray(entity.roles)) errors.push(`${label}.roles must be an array`);
  if (!Array.isArray(entity.affiliations)) errors.push(`${label}.affiliations must be an array`);
  for (const affiliation of entity.affiliations || []) {
    if (!knownIds.has(affiliation.organizationId)) errors.push(`${label} references missing organization ${affiliation.organizationId}`);
    if (!isString(affiliation.role)) errors.push(`${label} affiliation role is required`);
  }
  if (entity.nen) {
    if (!inEnum(entity.nen.naturalType, NEN_TYPES)) errors.push(`${label}.nen.naturalType is invalid`);
    validateIdList(entity.nen.abilityIds || [], `${label}.nen.abilityIds`, knownIds, errors);
  }
  if (entity.locationState) {
    if (!knownIds.has(entity.locationState.locationId)) errors.push(`${label} references missing location ${entity.locationState.locationId}`);
    validateChapterNumber(entity.locationState.asOfChapter, `${label}.locationState.asOfChapter`, errors);
    if (!inEnum(entity.locationState.certainty, CERTAINTY_LEVELS)) errors.push(`${label}.locationState.certainty is invalid`);
  }
};

const validateOrganization = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!inEnum(entity.status, ORGANIZATION_STATUSES)) errors.push(`${label}.status is invalid`);
  validateIdList(entity.leaderIds || [], `${label}.leaderIds`, knownIds, errors);
  if (entity.parentOrganizationId && !knownIds.has(entity.parentOrganizationId)) {
    errors.push(`${label} references missing parent organization ${entity.parentOrganizationId}`);
  }
};

const validateAbility = (entity, knownIds, errors) => {
  const label = entity.id;
  validateIdList(entity.ownerIds || [], `${label}.ownerIds`, knownIds, errors);
  if (!isObject(entity.classification) || !Array.isArray(entity.classification.nenTypes)) {
    errors.push(`${label}.classification.nenTypes must be an array`);
  } else if (entity.classification.nenTypes.some((type) => !inEnum(type, NEN_TYPES))) {
    errors.push(`${label}.classification.nenTypes contains an invalid Nen type`);
  }
  if (entity.classification?.certainty && !inEnum(entity.classification.certainty, CERTAINTY_LEVELS)) {
    errors.push(`${label}.classification.certainty is invalid`);
  }
};

const validateGuardianBeast = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!knownIds.has(entity.hostCharacterId)) errors.push(`${label} references missing host ${entity.hostCharacterId}`);
  validateIdList(entity.knownAbilityIds || [], `${label}.knownAbilityIds`, knownIds, errors);
  validateIdList(entity.suspectedAbilityIds || [], `${label}.suspectedAbilityIds`, knownIds, errors);
};

const validateLocation = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!inEnum(entity.locationType, LOCATION_TYPES)) errors.push(`${label}.locationType is invalid`);
  if (entity.parentId && !knownIds.has(entity.parentId)) errors.push(`${label} references missing parent location ${entity.parentId}`);
  validateIdList(entity.ancestorIds || [], `${label}.ancestorIds`, knownIds, errors);
};

const validateLocationHistory = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!knownIds.has(entity.characterId)) errors.push(`${label} references missing character ${entity.characterId}`);
  if (!knownIds.has(entity.locationId)) errors.push(`${label} references missing location ${entity.locationId}`);
  validateChapterRange(entity.chapterRange, `${label}.chapterRange`, errors);
  if (!inEnum(entity.certainty, CERTAINTY_LEVELS)) errors.push(`${label}.certainty is invalid`);
};

const validateEvent = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!inEnum(entity.status, EVENT_STATUSES)) errors.push(`${label}.status is invalid`);
  validateChapterRange(entity.chapterRange, `${label}.chapterRange`, errors);
  validateIdList(entity.participantIds || [], `${label}.participantIds`, knownIds, errors);
  validateIdList(entity.organizationIds || [], `${label}.organizationIds`, knownIds, errors);
  validateIdList(entity.locationIds || [], `${label}.locationIds`, knownIds, errors);
  validateIdList(entity.abilityIds || [], `${label}.abilityIds`, knownIds, errors);
  validateIdList(entity.consequenceEventIds || [], `${label}.consequenceEventIds`, knownIds, errors);
};

const validateChapter = (entity, knownIds, errors) => {
  const label = entity.id;
  validateChapterNumber(entity.number, `${label}.number`, errors);
  if (entity.id !== `chapter:${entity.number}`) errors.push(`${label}.id must match its chapter number`);
  for (const appearance of entity.appearanceRecords || []) {
    if (!knownIds.has(appearance.characterId)) errors.push(`${label} references missing character ${appearance.characterId}`);
  }
  validateIdList(entity.eventIds || [], `${label}.eventIds`, knownIds, errors);
  validateIdList(entity.locationIds || [], `${label}.locationIds`, knownIds, errors);
  validateIdList(entity.abilityIds || [], `${label}.abilityIds`, knownIds, errors);
  validateIdList(entity.organizationIds || [], `${label}.organizationIds`, knownIds, errors);
};

const validateRelationship = (entity, knownIds, errors) => {
  const label = entity.id;
  if (!knownIds.has(entity.sourceEntityId)) errors.push(`${label} references missing source entity ${entity.sourceEntityId}`);
  if (!knownIds.has(entity.targetEntityId)) errors.push(`${label} references missing target entity ${entity.targetEntityId}`);
  if (entity.sourceEntityId === entity.targetEntityId) errors.push(`${label} cannot connect an entity to itself`);
  if (!inEnum(entity.relationshipType, RELATIONSHIP_TYPES)) errors.push(`${label}.relationshipType is invalid`);
  if (!inEnum(entity.direction, RELATIONSHIP_DIRECTIONS)) errors.push(`${label}.direction is invalid`);
  if (!inEnum(entity.sentiment, RELATIONSHIP_SENTIMENTS)) errors.push(`${label}.sentiment is invalid`);
  validateChapterRange(entity.chapterRange, `${label}.chapterRange`, errors);
};

const validateSource = (entity, errors) => {
  const label = entity.id;
  if (!inEnum(entity.sourceType, SOURCE_TYPES)) errors.push(`${label}.sourceType is invalid`);
  if (entity.sourceType === 'chapter') validateChapterNumber(entity.chapter, `${label}.chapter`, errors);
};

const validateLocationCycles = (locations, errors) => {
  const parentById = new Map(locations.map((location) => [location.id, location.parentId]));
  for (const location of locations) {
    const seen = new Set([location.id]);
    let current = location.parentId;
    while (current) {
      if (seen.has(current)) {
        errors.push(`${location.id} creates a circular location hierarchy`);
        break;
      }
      seen.add(current);
      current = parentById.get(current);
    }
  }
};

export const validateSuccessionArchiveData = (data) => {
  const errors = [];
  const warnings = [];
  const collections = Object.values(data).filter(Array.isArray);
  const entities = collections.flat();
  const ids = entities.map((entity) => entity.id);
  const knownIds = new Set(ids);

  if (knownIds.size !== ids.length) errors.push('entity IDs must be globally unique');

  const slugKeys = entities
    .filter((entity) => entity.slug)
    .map((entity) => `${entity.entityType}:${entity.slug}`);
  if (new Set(slugKeys).size !== slugKeys.length) errors.push('slugs must be unique within each entity type');

  for (const entity of entities) {
    validateBaseEntity(entity, knownIds, errors);
    switch (entity.entityType) {
      case 'character': validateCharacter(entity, knownIds, errors); break;
      case 'organization': validateOrganization(entity, knownIds, errors); break;
      case 'ability': validateAbility(entity, knownIds, errors); break;
      case 'guardian-beast': validateGuardianBeast(entity, knownIds, errors); break;
      case 'location': validateLocation(entity, knownIds, errors); break;
      case 'location-history': validateLocationHistory(entity, knownIds, errors); break;
      case 'event': validateEvent(entity, knownIds, errors); break;
      case 'chapter': validateChapter(entity, knownIds, errors); break;
      case 'relationship': validateRelationship(entity, knownIds, errors); break;
      case 'source': validateSource(entity, errors); break;
      default: break;
    }

    if (entity.entityType === 'character' && !entity.media?.portrait) warnings.push(`${entity.id} has no portrait`);
    if (entity.publicationStatus === 'published' && entity.canonLevel === 'theory') {
      warnings.push(`${entity.id} is a published theory and must remain visually separated from canon`);
    }
  }

  validateLocationCycles(data.locations || [], errors);

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    stats: Object.freeze({
      entities: entities.length,
      sources: data.sources?.length || 0,
      characters: data.characters?.length || 0,
      chapters: data.chapters?.length || 0,
      events: data.events?.length || 0,
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
