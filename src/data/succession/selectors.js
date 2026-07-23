const resolveMany = (ids, indexes) => (ids || [])
  .map((id) => indexes.byId.get(id))
  .filter(Boolean);

const includesChapter = (range, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
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
    const normalized = String(query || '').trim().toLocaleLowerCase();
    if (!normalized) return [];
    const allowedTypes = types ? new Set(types) : null;

    return indexes.searchDocuments
      .filter((document) => !allowedTypes || allowedTypes.has(document.type))
      .map((document) => {
        const name = document.name.toLocaleLowerCase();
        const aliases = document.aliases.map((alias) => alias.toLocaleLowerCase());
        let score = 0;
        if (name === normalized) score += 100;
        else if (name.startsWith(normalized)) score += 60;
        else if (name.includes(normalized)) score += 35;
        if (aliases.some((alias) => alias === normalized)) score += 80;
        else if (aliases.some((alias) => alias.includes(normalized))) score += 30;
        if (document.text.includes(normalized)) score += 10;
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
    getLocationHistoryForCharacter,
    getLocationHistoryForLocation,
    getEntitiesAtLocation,
    getSourcesForEntity,
    getRelatedEntities,
    search,
  });
};
