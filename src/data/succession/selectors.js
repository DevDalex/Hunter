const resolveMany = (ids, indexes) => (ids || [])
  .map((id) => indexes.byId.get(id))
  .filter(Boolean);

const includesChapter = (range, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
};

const byRangeStart = (left, right) => left.chapterRange.start - right.chapterRange.start
  || (left.chapterRange.end ?? Number.POSITIVE_INFINITY) - (right.chapterRange.end ?? Number.POSITIVE_INFINITY)
  || left.id.localeCompare(right.id);

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

  const getEventsForAbility = (abilityId) => resolveMany(indexes.eventsByAbility.get(abilityId), indexes);

  const getEventsForOrganization = (organizationId) => resolveMany(indexes.eventsByOrganization.get(organizationId), indexes);

  const getChaptersForAbility = (abilityId) => resolveMany(indexes.chaptersByAbility.get(abilityId), indexes);

  const getLocationsForAbility = (abilityId) => resolveMany(indexes.locationsByAbility.get(abilityId), indexes);

  const getAbilitiesAtLocation = (locationId) => {
    const abilityIds = new Set(getEventsAtLocation(locationId).flatMap((event) => event.abilityIds || []));
    return resolveMany([...abilityIds], indexes);
  };

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

  const getOutgoingRelationships = (entityId) => resolveMany(indexes.relationshipsBySource.get(entityId), indexes);

  const getIncomingRelationships = (entityId) => resolveMany(indexes.relationshipsByTarget.get(entityId), indexes);

  const getRelationshipsForType = (relationshipType) => resolveMany(indexes.relationshipsByType.get(relationshipType), indexes);

  const getRelationshipsForSentiment = (sentiment) => resolveMany(indexes.relationshipsBySentiment.get(sentiment), indexes);

  const getRelationshipsForEvent = (eventId) => resolveMany(indexes.relationshipsByEvent.get(eventId), indexes);

  const getRelationshipsForChapter = (chapter) => resolveMany(indexes.relationshipsByChapter.get(Number(chapter)), indexes);

  const getActiveRelationshipsAtChapter = (chapter, {
    entityId = null,
    sourceEntityId = null,
    targetEntityId = null,
    relationshipType = null,
    sentiment = null,
    status = null,
  } = {}) => getRelationshipsForChapter(chapter).filter((relationship) => (
    (!entityId || relationship.sourceEntityId === entityId || relationship.targetEntityId === entityId)
    && (!sourceEntityId || relationship.sourceEntityId === sourceEntityId)
    && (!targetEntityId || relationship.targetEntityId === targetEntityId)
    && (!relationshipType || relationship.relationshipType === relationshipType)
    && (!sentiment || relationship.sentiment === sentiment)
    && (!status || relationship.status === status)
  ));

  const getRelationshipDetail = (relationshipId) => {
    const relationship = getEntityById(relationshipId);
    if (!relationship || relationship.entityType !== 'relationship') return null;
    return Object.freeze({
      relationship,
      source: getEntityById(relationship.sourceEntityId),
      target: getEntityById(relationship.targetEntityId),
      events: Object.freeze(resolveMany(relationship.relatedEventIds, indexes)),
    });
  };

  const getRelationshipSnapshot = (entityId, chapter = null) => {
    const entity = getEntityById(entityId);
    if (!entity) return null;
    const parsedChapter = chapter === null ? data.chapters.at(-1)?.number : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const outgoing = getOutgoingRelationships(entityId).filter((relationship) => includesChapter(relationship.chapterRange, parsedChapter));
    const incoming = getIncomingRelationships(entityId).filter((relationship) => includesChapter(relationship.chapterRange, parsedChapter));
    const relationships = [...new Map([...outgoing, ...incoming].map((relationship) => [relationship.id, relationship])).values()]
      .sort(byRangeStart);
    const nodeIds = new Set();
    for (const relationship of relationships) {
      nodeIds.add(relationship.sourceEntityId);
      nodeIds.add(relationship.targetEntityId);
    }
    nodeIds.delete(entityId);
    return Object.freeze({
      entity,
      chapter: parsedChapter,
      relationships: Object.freeze(relationships),
      outgoing: Object.freeze(outgoing),
      incoming: Object.freeze(incoming),
      neighbors: Object.freeze(resolveMany([...nodeIds], indexes)),
    });
  };

  const getRelationshipNeighborhood = (entityId, chapter = null) => {
    const snapshot = getRelationshipSnapshot(entityId, chapter);
    if (!snapshot) return null;
    return Object.freeze({
      center: snapshot.entity,
      chapter: snapshot.chapter,
      nodes: Object.freeze([snapshot.entity, ...snapshot.neighbors]),
      edges: snapshot.relationships,
    });
  };

  const getAbilitiesForOwner = (entityId) => resolveMany(indexes.abilitiesByOwner.get(entityId), indexes);

  const getAssignmentsForPerson = (entityId) => resolveMany(indexes.assignmentsByPerson.get(entityId), indexes);

  const getAssignmentsForSubject = (entityId) => resolveMany(indexes.assignmentsBySubject.get(entityId), indexes);

  const getAssignmentsForPrincipal = (entityId) => resolveMany(indexes.assignmentsByPrincipal.get(entityId), indexes);

  const getAssignmentsAtLocation = (locationId) => resolveMany(indexes.assignmentsByLocation.get(locationId), indexes);

  const getAssignmentsForAllegiance = (entityId) => resolveMany(indexes.assignmentsByAllegiance.get(entityId), indexes);

  const getAssignmentsReportingTo = (entityId) => resolveMany(indexes.assignmentsByReporting.get(entityId), indexes);

  const getAssignmentsForEvent = (eventId) => resolveMany(indexes.assignmentsByEvent.get(eventId), indexes);

  const getAssignmentsForChapter = (chapter) => resolveMany(indexes.assignmentsByChapter.get(Number(chapter)), indexes);

  const getActiveAssignmentsForSubject = (entityId, chapter = null) => getAssignmentsForSubject(entityId)
    .filter((assignment) => chapter === null
      ? assignment.status === 'active'
      : includesChapter(assignment.chapterRange, Number(chapter)));

  const getActiveAssignmentsAtChapter = (chapter, {
    personId = null,
    principalEntityId = null,
    subjectEntityId = null,
    locationId = null,
    allegianceEntityId = null,
    reportingEntityId = null,
    assignmentType = null,
    status = null,
    secrecy = null,
  } = {}) => getAssignmentsForChapter(chapter).filter((assignment) => (
    (!personId || assignment.personId === personId)
    && (!principalEntityId || assignment.principalEntityId === principalEntityId)
    && (!subjectEntityId || assignment.subjectEntityId === subjectEntityId)
    && (!locationId || assignment.locationId === locationId)
    && (!allegianceEntityId || assignment.allegianceEntityId === allegianceEntityId)
    && (!reportingEntityId || assignment.reportingEntityId === reportingEntityId)
    && (!assignmentType || assignment.assignmentType === assignmentType)
    && (!status || assignment.status === status)
    && (!secrecy || assignment.secrecy === secrecy)
  ));

  const getAssignmentTimelineForCharacter = (characterId) => {
    const ids = new Set([
      ...(indexes.assignmentsByPerson.get(characterId) || []),
      ...(indexes.assignmentsByPrincipal.get(characterId) || []),
      ...(indexes.assignmentsBySubject.get(characterId) || []),
      ...(indexes.assignmentsByAllegiance.get(characterId) || []),
      ...(indexes.assignmentsByReporting.get(characterId) || []),
    ]);
    return resolveMany([...ids], indexes).sort(byRangeStart);
  };

  const getAssignmentChain = (assignmentId) => {
    const assignment = getEntityById(assignmentId);
    if (!assignment || assignment.entityType !== 'assignment') return null;
    const predecessor = assignment.supersedesAssignmentId ? getEntityById(assignment.supersedesAssignmentId) : null;
    const successor = assignment.replacedByAssignmentId ? getEntityById(assignment.replacedByAssignmentId) : null;
    return Object.freeze({
      assignment,
      predecessor: predecessor?.entityType === 'assignment' ? predecessor : null,
      successor: successor?.entityType === 'assignment' ? successor : null,
      person: getEntityById(assignment.personId),
      principal: getEntityById(assignment.principalEntityId),
      subject: getEntityById(assignment.subjectEntityId),
      location: getEntityById(assignment.locationId),
      allegiance: getEntityById(assignment.allegianceEntityId),
      reporting: getEntityById(assignment.reportingEntityId),
      events: Object.freeze(resolveMany(assignment.relatedEventIds, indexes)),
    });
  };

  const getAssignmentSnapshot = (entityId, chapter = null) => {
    const entity = getEntityById(entityId);
    if (!entity) return null;
    const parsedChapter = chapter === null ? data.chapters.at(-1)?.number : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const byRole = Object.freeze({
      person: Object.freeze(getAssignmentsForPerson(entityId).filter((assignment) => includesChapter(assignment.chapterRange, parsedChapter))),
      principal: Object.freeze(getAssignmentsForPrincipal(entityId).filter((assignment) => includesChapter(assignment.chapterRange, parsedChapter))),
      subject: Object.freeze(getAssignmentsForSubject(entityId).filter((assignment) => includesChapter(assignment.chapterRange, parsedChapter))),
      allegiance: Object.freeze(getAssignmentsForAllegiance(entityId).filter((assignment) => includesChapter(assignment.chapterRange, parsedChapter))),
      reporting: Object.freeze(getAssignmentsReportingTo(entityId).filter((assignment) => includesChapter(assignment.chapterRange, parsedChapter))),
    });
    const assignments = [...new Map(Object.values(byRole).flat().map((assignment) => [assignment.id, assignment])).values()]
      .sort(byRangeStart);
    return Object.freeze({ entity, chapter: parsedChapter, assignments: Object.freeze(assignments), byRole });
  };

  const getLocationHistoryForCharacter = (characterId) => resolveMany(indexes.locationHistoryByCharacter.get(characterId), indexes);

  const getLocationHistoryForLocation = (locationId) => resolveMany(indexes.locationHistoryByLocation.get(locationId), indexes);

  const getMovementHistoryForCharacter = (characterId) => [...getLocationHistoryForCharacter(characterId)].sort(byRangeStart);

  const getCurrentLocationRecordForCharacter = (characterId, chapter = null) => {
    const parsedChapter = chapter === null ? data.chapters.at(-1)?.number : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    return getMovementHistoryForCharacter(characterId)
      .filter((record) => includesChapter(record.chapterRange, parsedChapter))
      .sort((left, right) => right.chapterRange.start - left.chapterRange.start)[0] || null;
  };

  const getLocationsForCharacter = (characterId) => {
    const ids = [...new Set(getMovementHistoryForCharacter(characterId).map((record) => record.locationId))];
    return resolveMany(ids, indexes);
  };

  const getLocationOccupancyTimeline = (locationId) => [...getLocationHistoryForLocation(locationId)].sort(byRangeStart);

  const getEntitiesAtLocation = (locationId, chapter = null) => {
    const records = getLocationHistoryForLocation(locationId)
      .filter((record) => chapter === null || includesChapter(record.chapterRange, Number(chapter)))
      .sort(byRangeStart);

    const byCharacter = new Map();
    for (const record of records) {
      const entity = getEntityById(record.characterId);
      if (!entity) continue;
      const current = byCharacter.get(entity.id);
      if (!current) {
        byCharacter.set(entity.id, { entity, record, records: [record] });
      } else {
        current.records.push(record);
        if (record.chapterRange.start >= current.record.chapterRange.start) current.record = record;
      }
    }

    return [...byCharacter.values()].map((entry) => Object.freeze({
      entity: entry.entity,
      record: entry.record,
      records: Object.freeze([...entry.records]),
    }));
  };

  const getLocationSnapshot = (locationId, chapter = null) => {
    const location = getEntityById(locationId);
    if (!location || location.entityType !== 'location') return null;
    const parsedChapter = chapter === null ? data.chapters.at(-1)?.number : Number(chapter);
    const hasChapter = Number.isFinite(parsedChapter);
    const events = getEventsAtLocation(locationId)
      .filter((event) => !hasChapter || includesChapter(event.chapterRange, parsedChapter));
    const assignments = getAssignmentsAtLocation(locationId)
      .filter((assignment) => !hasChapter || includesChapter(assignment.chapterRange, parsedChapter));
    const abilityIds = [...new Set(events.flatMap((event) => event.abilityIds || []))];

    return Object.freeze({
      location,
      chapter: hasChapter ? parsedChapter : null,
      breadcrumbs: Object.freeze(getLocationBreadcrumbs(locationId)),
      children: Object.freeze(getLocationChildren(locationId)),
      occupants: Object.freeze(getEntitiesAtLocation(locationId, hasChapter ? parsedChapter : null)),
      assignments: Object.freeze(assignments),
      events: Object.freeze(events),
      abilities: Object.freeze(resolveMany(abilityIds, indexes)),
      history: Object.freeze(getLocationOccupancyTimeline(locationId)),
    });
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
      for (const assignment of getAssignmentTimelineForCharacter(entity.id)) relatedIds.add(assignment.id);
    }

    if (entity.entityType === 'organization') {
      for (const membership of getOrganizationMembers(entity.id)) relatedIds.add(membership.character.id);
      for (const event of getEventsForOrganization(entity.id)) relatedIds.add(event.id);
      if (entity.parentOrganizationId) relatedIds.add(entity.parentOrganizationId);
      for (const leaderId of entity.leaderIds || []) relatedIds.add(leaderId);
    }

    if (entity.entityType === 'event') {
      for (const id of [
        ...(entity.participantIds || []),
        ...(entity.organizationIds || []),
        ...(entity.locationIds || []),
        ...(entity.abilityIds || []),
        ...(entity.consequenceEventIds || []),
      ]) relatedIds.add(id);
      for (const assignment of getAssignmentsForEvent(entity.id)) relatedIds.add(assignment.id);
      for (const relationship of getRelationshipsForEvent(entity.id)) relatedIds.add(relationship.id);
    }

    if (entity.entityType === 'assignment') {
      for (const id of [
        entity.personId,
        entity.principalEntityId,
        entity.subjectEntityId,
        entity.locationId,
        entity.allegianceEntityId,
        entity.reportingEntityId,
        entity.supersedesAssignmentId,
        entity.replacedByAssignmentId,
        ...(entity.relatedEventIds || []),
      ]) if (id) relatedIds.add(id);
    }

    if (entity.entityType === 'relationship') {
      for (const id of [
        entity.sourceEntityId,
        entity.targetEntityId,
        ...(entity.relatedEventIds || []),
      ]) if (id) relatedIds.add(id);
    }

    if (entity.entityType === 'location') {
      for (const assignment of getAssignmentsAtLocation(entity.id)) relatedIds.add(assignment.id);
      for (const event of getEventsAtLocation(entity.id)) relatedIds.add(event.id);
      for (const ability of getAbilitiesAtLocation(entity.id)) relatedIds.add(ability.id);
      for (const child of getLocationChildren(entity.id)) relatedIds.add(child.id);
      for (const record of getLocationHistoryForLocation(entity.id)) relatedIds.add(record.characterId);
    }

    if (entity.entityType === 'guardian-beast') {
      relatedIds.add(entity.hostCharacterId);
      for (const abilityId of [...(entity.knownAbilityIds || []), ...(entity.suspectedAbilityIds || [])]) relatedIds.add(abilityId);
    }

    if (entity.entityType === 'ability') {
      for (const ownerId of entity.ownerIds || []) relatedIds.add(ownerId);
      for (const event of getEventsForAbility(entity.id)) relatedIds.add(event.id);
      for (const chapter of getChaptersForAbility(entity.id)) relatedIds.add(chapter.id);
      for (const location of getLocationsForAbility(entity.id)) relatedIds.add(location.id);
    }

    if (entity.entityType === 'chapter') {
      for (const id of [
        ...(entity.appearanceRecords || []).map((appearance) => appearance.characterId),
        ...(entity.eventIds || []),
        ...(entity.locationIds || []),
        ...(entity.abilityIds || []),
        ...(entity.organizationIds || []),
      ]) relatedIds.add(id);
      for (const assignment of getAssignmentsForChapter(entity.number)) relatedIds.add(assignment.id);
      for (const relationship of getRelationshipsForChapter(entity.number)) relatedIds.add(relationship.id);
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
    getEventsForAbility,
    getEventsForOrganization,
    getChaptersForAbility,
    getLocationsForAbility,
    getAbilitiesAtLocation,
    getAppearancesForCharacter,
    getOrganizationMembers,
    getLocationChildren,
    getLocationBreadcrumbs,
    getRelationshipsForEntity,
    getOutgoingRelationships,
    getIncomingRelationships,
    getRelationshipsForType,
    getRelationshipsForSentiment,
    getRelationshipsForEvent,
    getRelationshipsForChapter,
    getActiveRelationshipsAtChapter,
    getRelationshipDetail,
    getRelationshipSnapshot,
    getRelationshipNeighborhood,
    getAbilitiesForOwner,
    getAssignmentsForPerson,
    getAssignmentsForSubject,
    getAssignmentsForPrincipal,
    getAssignmentsAtLocation,
    getAssignmentsForAllegiance,
    getAssignmentsReportingTo,
    getAssignmentsForEvent,
    getAssignmentsForChapter,
    getActiveAssignmentsForSubject,
    getActiveAssignmentsAtChapter,
    getAssignmentTimelineForCharacter,
    getAssignmentChain,
    getAssignmentSnapshot,
    getLocationHistoryForCharacter,
    getLocationHistoryForLocation,
    getMovementHistoryForCharacter,
    getCurrentLocationRecordForCharacter,
    getLocationsForCharacter,
    getLocationOccupancyTimeline,
    getEntitiesAtLocation,
    getLocationSnapshot,
    getSourcesForEntity,
    getRelatedEntities,
    search,
  });
};
