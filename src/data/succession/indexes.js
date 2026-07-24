const append = (map, key, value) => {
  if (!key) return;
  const current = map.get(key);
  if (current) current.push(value);
  else map.set(key, [value]);
};

const appendUnique = (map, key, value) => {
  if (!key || !value) return;
  const current = map.get(key);
  if (current) {
    if (!current.includes(value)) current.push(value);
  } else map.set(key, [value]);
};

const freezeMapValues = (map) => {
  for (const [key, values] of map) map.set(key, Object.freeze([...values]));
  return map;
};

export const buildSuccessionIndexes = (data) => {
  const entities = Object.values(data).filter(Array.isArray).flat();
  const byId = new Map();
  const byType = new Map();
  const bySlug = new Map();
  const chaptersByNumber = new Map();
  const chaptersByAbility = new Map();
  const eventsByChapter = new Map();
  const eventsByCharacter = new Map();
  const eventsByLocation = new Map();
  const eventsByAbility = new Map();
  const eventsByOrganization = new Map();
  const locationsByAbility = new Map();
  const appearancesByCharacter = new Map();
  const membersByOrganization = new Map();
  const childrenByLocation = new Map();
  const relationshipsByEntity = new Map();
  const abilitiesByOwner = new Map();
  const assignmentsByPerson = new Map();
  const assignmentsBySubject = new Map();
  const assignmentsByPrincipal = new Map();
  const assignmentsByLocation = new Map();
  const locationHistoryByLocation = new Map();
  const locationHistoryByCharacter = new Map();

  for (const entity of entities) {
    byId.set(entity.id, entity);
    append(byType, entity.entityType, entity.id);
    if (entity.slug) bySlug.set(`${entity.entityType}:${entity.slug}`, entity.id);
  }

  for (const chapter of data.chapters) {
    chaptersByNumber.set(chapter.number, chapter.id);
    for (const abilityId of chapter.abilityIds || []) append(chaptersByAbility, abilityId, chapter.id);
    for (const appearance of chapter.appearanceRecords || []) {
      append(appearancesByCharacter, appearance.characterId, Object.freeze({
        chapterId: chapter.id,
        chapter: chapter.number,
        role: appearance.role,
      }));
    }
  }

  for (const event of data.events) {
    const end = event.chapterRange.end ?? event.chapterRange.start;
    for (let chapter = event.chapterRange.start; chapter <= end; chapter += 1) {
      append(eventsByChapter, chapter, event.id);
    }
    for (const characterId of event.participantIds || []) append(eventsByCharacter, characterId, event.id);
    for (const locationId of event.locationIds || []) append(eventsByLocation, locationId, event.id);
    for (const organizationId of event.organizationIds || []) append(eventsByOrganization, organizationId, event.id);
    for (const abilityId of event.abilityIds || []) {
      append(eventsByAbility, abilityId, event.id);
      for (const locationId of event.locationIds || []) appendUnique(locationsByAbility, abilityId, locationId);
    }
  }

  for (const character of data.characters) {
    for (const affiliation of character.affiliations || []) {
      append(membersByOrganization, affiliation.organizationId, Object.freeze({
        characterId: character.id,
        role: affiliation.role,
        status: affiliation.status,
      }));
    }
  }

  for (const organization of data.organizations) {
    for (const characterId of organization.leaderIds || []) {
      const existing = membersByOrganization.get(organization.id) || [];
      if (!existing.some((membership) => membership.characterId === characterId)) {
        append(membersByOrganization, organization.id, Object.freeze({
          characterId,
          role: 'Leader',
          status: 'active',
        }));
      }
    }
  }

  for (const location of data.locations) {
    if (location.parentId) append(childrenByLocation, location.parentId, location.id);
  }

  for (const relationship of data.relationships) {
    append(relationshipsByEntity, relationship.sourceEntityId, relationship.id);
    append(relationshipsByEntity, relationship.targetEntityId, relationship.id);
  }

  for (const ability of data.abilities) {
    for (const ownerId of ability.ownerIds || []) append(abilitiesByOwner, ownerId, ability.id);
  }

  for (const assignment of data.assignments || []) {
    append(assignmentsByPerson, assignment.personId, assignment.id);
    append(assignmentsBySubject, assignment.subjectEntityId, assignment.id);
    append(assignmentsByPrincipal, assignment.principalEntityId, assignment.id);
    append(assignmentsByLocation, assignment.locationId, assignment.id);
  }

  for (const record of data.locationHistory) {
    append(locationHistoryByLocation, record.locationId, record.id);
    append(locationHistoryByCharacter, record.characterId, record.id);
  }

  const searchDocuments = Object.freeze(entities
    .filter((entity) => entity.slug && entity.publicationStatus !== 'hidden')
    .map((entity) => Object.freeze({
      id: entity.id,
      type: entity.entityType,
      slug: entity.slug,
      name: entity.name,
      aliases: Object.freeze([...(entity.aliases || [])]),
      summary: entity.summary || '',
      text: [
        entity.name,
        ...(entity.aliases || []),
        entity.summary || '',
        ...(entity.tags || []),
        entity.assignmentType || '',
        entity.subtype || '',
        entity.category || '',
        ...(entity.causes || []),
        ...(entity.outcomes || []),
        ...(entity.stateChanges || []),
        ...(entity.openQuestions || []),
      ].join(' ').toLocaleLowerCase(),
    })));

  return Object.freeze({
    byId,
    byType: freezeMapValues(byType),
    bySlug,
    chaptersByNumber,
    chaptersByAbility: freezeMapValues(chaptersByAbility),
    eventsByChapter: freezeMapValues(eventsByChapter),
    eventsByCharacter: freezeMapValues(eventsByCharacter),
    eventsByLocation: freezeMapValues(eventsByLocation),
    eventsByAbility: freezeMapValues(eventsByAbility),
    eventsByOrganization: freezeMapValues(eventsByOrganization),
    locationsByAbility: freezeMapValues(locationsByAbility),
    appearancesByCharacter: freezeMapValues(appearancesByCharacter),
    membersByOrganization: freezeMapValues(membersByOrganization),
    childrenByLocation: freezeMapValues(childrenByLocation),
    relationshipsByEntity: freezeMapValues(relationshipsByEntity),
    abilitiesByOwner: freezeMapValues(abilitiesByOwner),
    assignmentsByPerson: freezeMapValues(assignmentsByPerson),
    assignmentsBySubject: freezeMapValues(assignmentsBySubject),
    assignmentsByPrincipal: freezeMapValues(assignmentsByPrincipal),
    assignmentsByLocation: freezeMapValues(assignmentsByLocation),
    locationHistoryByLocation: freezeMapValues(locationHistoryByLocation),
    locationHistoryByCharacter: freezeMapValues(locationHistoryByCharacter),
    searchDocuments,
  });
};
