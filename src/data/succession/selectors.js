const resolveMany = (ids, indexes) => (ids || [])
  .map((id) => indexes.byId.get(id))
  .filter(Boolean);

const includesChapter = (range, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
};

const ordinalSearchAliases = Object.freeze([
  ['first', '1st'], ['second', '2nd'], ['third', '3rd'], ['fourth', '4th'], ['fifth', '5th'],
  ['sixth', '6th'], ['seventh', '7th'], ['eighth', '8th'], ['ninth', '9th'], ['tenth', '10th'],
  ['eleventh', '11th'], ['twelfth', '12th'], ['thirteenth', '13th'], ['fourteenth', '14th'],
]);

const normalizeSearchText = (value) => {
  let normalized = String(value || '').trim().toLocaleLowerCase();
  for (const [word, numeric] of ordinalSearchAliases) normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), numeric);
  return normalized;
};

export const createSuccessionSelectors = (data, indexes) => {
  const getEntityById = (id) => indexes.byId.get(id) || null;

  const getEntitiesByType = (entityType) => resolveMany(indexes.byType.get(entityType), indexes);

  const getEntityBySlug = (entityType, slug) => {
    const id = indexes.bySlug.get(`${entityType}:${slug}`);
    return id ? getEntityById(id) : null;
  };

  const getCharacter = (idOrSlug) => getEntityById(idOrSlug)
    || getEntityBySlug('character', idOrSlug);

  const getChapter = (number) => {
    const parsed = Number(number);
    const id = indexes.chaptersByNumber.get(parsed);
    return id ? getEntityById(id) : null;
  };

  const getEventsForChapter = (number) => resolveMany(indexes.eventsByChapter.get(Number(number)), indexes);

  const getEventsForCharacter = (characterId) => resolveMany(indexes.eventsByCharacter.get(characterId), indexes);

  const getEventsAtLocation = (locationId) => resolveMany(indexes.eventsByLocation.get(locationId), indexes);

  const getAppearancesForCharacter = (characterId) => indexes.appearancesByCharacter.get(characterId) || Object.freeze([]);

  const getOrganizationMembers = (organizationId) => (indexes.membersByOrganization.get(organizationId) || [])
    .map((membership) => Object.freeze({
      ...membership,
      character: getEntityById(membership.characterId),
    }))
    .filter((membership) => membership.character);

  const getLocationChildren = (locationId) => resolveMany(indexes.childrenByLocation.get(locationId), indexes);

  const getLocationBreadcrumbs = (locationId) => {
    const location = getEntityById(locationId);
    if (!location || location.entityType !== 'location') return [];
    return resolveMany([...(location.ancestorIds || []), location.id], indexes);
  };

  const getRelationshipsForEntity = (entityId) => resolveMany(indexes.relationshipsByEntity.get(entityId), indexes);

  const getAbilitiesForOwner = (entityId) => resolveMany(indexes.abilitiesByOwner.get(entityId), indexes);

  const getAssignmentsForPerson = (entityId) => resolveMany(indexes.assignmentsByPerson.get(entityId), indexes);

  const getAssignmentsForSubject = (entityId) => resolveMany(indexes.assignmentsBySubject.get(entityId), indexes);

  const getAssignmentsForPrincipal = (entityId) => resolveMany(indexes.assignmentsByPrincipal.get(entityId), indexes);

  const getAssignmentsAtLocation = (locationId) => resolveMany(indexes.assignmentsByLocation.get(locationId), indexes);

  const getActiveAssignmentsForSubject = (entityId, chapter = null) => getAssignmentsForSubject(entityId)
    .filter((assignment) => chapter === null
      ? assignment.status === 'active'
      : includesChapter(assignment.chapterRange, Number(chapter)));

  const getLocationHistoryForCharacter = (characterId) => resolveMany(indexes.locationHistoryByCharacter.get(characterId), indexes);

  const getLocationHistoryForLocation = (locationId) => resolveMany(indexes.locationHistoryByLocation.get(locationId), indexes);

  const getEntitiesAtLocation = (locationId, chapter = null) => {
    const records = getLocationHistoryForLocation(locationId)
      .filter((record) => chapter === null || includesChapter(record.chapterRange, Number(chapter)));

    return records
      .map((record) => Object.freeze({
        record,
        entity: getEntityById(record.characterId),
      }))
      .filter((entry) => entry.entity);
  };

  const getSourcesForEntity = (entityId) => {
    const entity = getEntityById(entityId);
    return entity ? resolveMany(entity.sourceIds, indexes) : [];
  };

  const getRelatedEntities = (entityId) => {
    const entity = getEntityById(entityId);
    if (!entity) return [];

    const relatedIds = new Set();
    for (const relationship of getRelationshipsForEntity(entityId)) {
      relatedIds.add(relationship.sourceEntityId);
      relatedIds.add(relationship.targetEntityId);
    }

    if (entity.entityType === 'character') {
      for (const affiliation of entity.affiliations || []) relatedIds.add(affiliation.organizationId);
      for (const ability of getAbilitiesForOwner(entity.id)) relatedIds.add(ability.id);
      for (const event of getEventsForCharacter(entity.id)) relatedIds.add(event.id);
      for (const appearance of getAppearancesForCharacter(entity.id)) relatedIds.add(appearance.chapterId);
      for (const locationRecord of getLocationHistoryForCharacter(entity.id)) relatedIds.add(locationRecord.locationId);
      for (const assignment of [
        ...getAssignmentsForPerson(entity.id),
        ...getAssignmentsForSubject(entity.id),
        ...getAssignmentsForPrincipal(entity.id),
      ]) relatedIds.add(assignment.id);
    }

    if (entity.entityType === 'event') {
      for (const id of [
        ...(entity.participantIds || []),
        ...(entity.organizationIds || []),
        ...(entity.locationIds || []),
        ...(entity.abilityIds || []),
        ...(entity.consequenceEventIds || []),
      ]) relatedIds.add(id);
    }

    if (entity.entityType === 'assignment') {
      for (const id of [
        entity.personId,
        entity.principalEntityId,
        entity.subjectEntityId,
        entity.locationId,
        entity.allegianceEntityId,
        entity.reportingEntityId,
      ]) if (id) relatedIds.add(id);
    }

    if (entity.entityType === 'location') {
      for (const assignment of getAssignmentsAtLocation(entity.id)) relatedIds.add(assignment.id);
      for (const event of getEventsAtLocation(entity.id)) relatedIds.add(event.id);
      for (const child of getLocationChildren(entity.id)) relatedIds.add(child.id);
    }

    if (entity.entityType === 'guardian-beast') {
      relatedIds.add(entity.hostCharacterId);
      for (const abilityId of [...(entity.knownAbilityIds || []), ...(entity.suspectedAbilityIds || [])]) relatedIds.add(abilityId);
    }

    if (entity.entityType === 'ability') {
      for (const ownerId of entity.ownerIds || []) relatedIds.add(ownerId);
    }

    if (entity.entityType === 'chapter') {
      for (const id of [
        ...(entity.appearanceRecords || []).map((appearance) => appearance.characterId),
        ...(entity.eventIds || []),
        ...(entity.locationIds || []),
        ...(entity.abilityIds || []),
        ...(entity.organizationIds || []),
      ]) relatedIds.add(id);
    }

    relatedIds.delete(entityId);
    return resolveMany([...relatedIds], indexes);
  };

  const search = (query, { types = null, limit = 20 } = {}) => {
    const normalized = normalizeSearchText(query);
    if (!normalized) return [];
    const allowedTypes = types ? new Set(types) : null;

    return indexes.searchDocuments
      .filter((document) => !allowedTypes || allowedTypes.has(document.type))
      .map((document) => {
        const name = normalizeSearchText(document.name);
        const aliases = document.aliases.map(normalizeSearchText);
        const text = normalizeSearchText(document.text);
        let score = 0;
        if (name === normalized) score += 100;
        else if (name.startsWith(normalized)) score += 60;
        else if (name.includes(normalized)) score += 35;
        if (aliases.some((alias) => alias === normalized)) score += 80;
        else if (aliases.some((alias) => alias.includes(normalized))) score += 30;
        if (text.includes(normalized)) score += 10;
        return { document, score };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score || left.document.name.localeCompare(right.document.name))
      .slice(0, limit)
      .map(({ document, score }) => Object.freeze({
        score,
        entity: getEntityById(document.id),
      }));
  };

  return Object.freeze({
    getEntityById,
    getEntitiesByType,
    getEntityBySlug,
    getCharacter,
    getChapter,
    getEventsForChapter,
    getEventsForCharacter,
    getEventsAtLocation,
    getAppearancesForCharacter,
    getOrganizationMembers,
    getLocationChildren,
    getLocationBreadcrumbs,
    getRelationshipsForEntity,
    getAbilitiesForOwner,
    getAssignmentsForPerson,
    getAssignmentsForSubject,
    getAssignmentsForPrincipal,
    getAssignmentsAtLocation,
    getActiveAssignmentsForSubject,
    getLocationHistoryForCharacter,
    getLocationHistoryForLocation,
    getEntitiesAtLocation,
    getSourcesForEntity,
    getRelatedEntities,
    search,
  });
};
