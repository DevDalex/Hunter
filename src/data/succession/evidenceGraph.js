const CORE_ENTITY_TYPES = Object.freeze([
  'character',
  'organization',
  'ability',
  'guardian-beast',
  'location',
  'event',
  'assignment',
  'relationship',
  'chapter',
]);

const unique = (values) => [...new Set(values.filter(Boolean))];
const includesChapter = (range, chapter) => {
  if (!range || !Number.isFinite(Number(chapter))) return false;
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return Number(chapter) >= range.start && Number(chapter) <= end;
};
const freezeList = (values) => Object.freeze([...values]);
const certaintyOf = (entity) => entity?.certainty
  || entity?.classification?.certainty
  || entity?.chronology?.certainty
  || entity?.status?.certainty
  || 'confirmed';
const gradeFor = (score) => score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

const collectionEntities = (data) => Object.values(data).filter(Array.isArray).flat();

export const createSuccessionEvidenceGraph = (data) => {
  const entities = collectionEntities(data);
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const sources = data.sources || [];
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const latestChapter = data.chapters.at(-1)?.number || 418;
  const chapterNumbersByEntity = new Map();
  const sourceLinkedByChapterAndType = new Map();

  for (const entity of entities) {
    for (const sourceId of entity.sourceIds || []) {
      const source = sourceById.get(sourceId);
      if (source?.sourceType !== 'chapter' || !Number.isFinite(Number(source.chapter))) continue;
      const key = `${Number(source.chapter)}:${entity.entityType}`;
      const current = sourceLinkedByChapterAndType.get(key) || [];
      if (!current.includes(entity.id)) current.push(entity.id);
      sourceLinkedByChapterAndType.set(key, current);
    }
  }

  const sourceLinkedIds = (chapter, entityType) => sourceLinkedByChapterAndType.get(`${Number(chapter)}:${entityType}`) || [];
  const resolveMany = (ids) => unique(ids).map((id) => byId.get(id)).filter(Boolean);
  const appendChapterLink = (entityId, chapter) => {
    if (!entityId) return;
    const current = chapterNumbersByEntity.get(entityId) || [];
    if (!current.includes(chapter)) current.push(chapter);
    chapterNumbersByEntity.set(entityId, current);
  };

  const chapterProfiles = Object.freeze((data.chapters || []).map((chapter) => {
    const events = (data.events || []).filter((event) => (chapter.eventIds || []).includes(event.id) || includesChapter(event.chapterRange, chapter.number));
    const assignments = (data.assignments || []).filter((assignment) => includesChapter(assignment.chapterRange, chapter.number));
    const relationships = (data.relationships || []).filter((relationship) => includesChapter(relationship.chapterRange, chapter.number));

    const eventIds = unique([...(chapter.eventIds || []), ...events.map((event) => event.id), ...sourceLinkedIds(chapter.number, 'event')]);
    const assignmentIds = unique([...assignments.map((assignment) => assignment.id), ...sourceLinkedIds(chapter.number, 'assignment')]);
    const relationshipIds = unique([...relationships.map((relationship) => relationship.id), ...sourceLinkedIds(chapter.number, 'relationship')]);
    const abilityIds = unique([
      ...(chapter.abilityIds || []),
      ...events.flatMap((event) => event.abilityIds || []),
      ...sourceLinkedIds(chapter.number, 'ability'),
    ]);
    const guardianBeastIds = unique([
      ...(chapter.guardianBeastIds || []),
      ...events.flatMap((event) => event.guardianBeastIds || []),
      ...sourceLinkedIds(chapter.number, 'guardian-beast'),
    ]);
    const locationIds = unique([
      ...(chapter.locationIds || []),
      ...events.flatMap((event) => event.locationIds || []),
      ...assignments.map((assignment) => assignment.locationId),
      ...sourceLinkedIds(chapter.number, 'location'),
    ]);
    const organizationIds = unique([
      ...(chapter.organizationIds || []),
      ...events.flatMap((event) => event.organizationIds || []),
      ...assignments.flatMap((assignment) => [assignment.allegianceEntityId, assignment.principalEntityId, assignment.reportingEntityId])
        .filter((id) => byId.get(id)?.entityType === 'organization'),
      ...relationships.flatMap((relationship) => [relationship.sourceEntityId, relationship.targetEntityId])
        .filter((id) => byId.get(id)?.entityType === 'organization'),
      ...sourceLinkedIds(chapter.number, 'organization'),
    ]);
    const characterIds = unique([
      ...(chapter.appearanceRecords || []).map((appearance) => appearance.characterId),
      ...events.flatMap((event) => event.participantIds || []),
      ...assignments.flatMap((assignment) => [
        assignment.personId,
        assignment.principalEntityId,
        assignment.subjectEntityId,
        assignment.allegianceEntityId,
        assignment.reportingEntityId,
      ]).filter((id) => byId.get(id)?.entityType === 'character'),
      ...relationships.flatMap((relationship) => [relationship.sourceEntityId, relationship.targetEntityId])
        .filter((id) => byId.get(id)?.entityType === 'character'),
      ...sourceLinkedIds(chapter.number, 'character'),
    ]);

    const linkedEntityIds = unique([
      chapter.id,
      ...characterIds,
      ...organizationIds,
      ...abilityIds,
      ...guardianBeastIds,
      ...locationIds,
      ...eventIds,
      ...assignmentIds,
      ...relationshipIds,
    ]);
    const linkedEntities = resolveMany(linkedEntityIds);
    for (const entityId of linkedEntityIds) appendChapterLink(entityId, chapter.number);

    const sourceIds = unique([
      ...(chapter.sourceIds || []),
      ...linkedEntities.flatMap((entity) => entity.sourceIds || []),
    ]);
    const resolvedSources = sourceIds.map((sourceId) => sourceById.get(sourceId)).filter(Boolean);
    const invalidSourceIds = sourceIds.filter((sourceId) => !sourceById.has(sourceId));
    const primarySourceIds = resolvedSources
      .filter((source) => source.sourceType === 'chapter' && source.chapter === chapter.number)
      .map((source) => source.id);
    const unsourcedEntityIds = linkedEntities
      .filter((entity) => entity.entityType !== 'source' && (!Array.isArray(entity.sourceIds) || entity.sourceIds.length === 0))
      .map((entity) => entity.id);
    const uncertainEntityIds = linkedEntities
      .filter((entity) => entity.canonLevel !== 'canon' || !['confirmed', 'approximate'].includes(certaintyOf(entity)))
      .map((entity) => entity.id);
    const openQuestions = unique(events.flatMap((event) => event.openQuestions || []));

    const hasPrimarySource = primarySourceIds.length > 0;
    const hasReaderBridge = Boolean(chapter.reader?.manifestChapter);
    const hasStructuredLinks = linkedEntityIds.length > 1;
    const sourceIntegrity = linkedEntities.length
      ? (linkedEntities.length - unsourcedEntityIds.length) / linkedEntities.length
      : 1;
    const score = Math.round(
      (hasPrimarySource ? 40 : 0)
      + (hasReaderBridge ? 20 : 0)
      + (hasStructuredLinks ? 15 : 0)
      + (sourceIntegrity * 20)
      + (invalidSourceIds.length === 0 ? 5 : 0),
    );
    const gaps = unique([
      !hasPrimarySource && 'missing-primary-chapter-source',
      !hasReaderBridge && 'missing-reader-bridge',
      !hasStructuredLinks && 'no-structured-graph-links',
      invalidSourceIds.length > 0 && 'broken-source-reference',
      unsourcedEntityIds.length > 0 && 'unsourced-linked-entity',
    ]);

    return Object.freeze({
      chapter,
      chapterNumber: chapter.number,
      eventIds: freezeList(eventIds),
      assignmentIds: freezeList(assignmentIds),
      relationshipIds: freezeList(relationshipIds),
      abilityIds: freezeList(abilityIds),
      guardianBeastIds: freezeList(guardianBeastIds),
      locationIds: freezeList(locationIds),
      organizationIds: freezeList(organizationIds),
      characterIds: freezeList(characterIds),
      linkedEntityIds: freezeList(linkedEntityIds),
      sourceIds: freezeList(sourceIds),
      primarySourceIds: freezeList(primarySourceIds),
      invalidSourceIds: freezeList(invalidSourceIds),
      unsourcedEntityIds: freezeList(unsourcedEntityIds),
      uncertainEntityIds: freezeList(uncertainEntityIds),
      openQuestions: freezeList(openQuestions),
      coverage: Object.freeze({
        characters: characterIds.length,
        organizations: organizationIds.length,
        abilities: abilityIds.length,
        guardianBeasts: guardianBeastIds.length,
        locations: locationIds.length,
        events: eventIds.length,
        assignments: assignmentIds.length,
        relationships: relationshipIds.length,
        sources: sourceIds.length,
      }),
      provenance: Object.freeze({
        score,
        grade: gradeFor(score),
        hasPrimarySource,
        hasReaderBridge,
        hasStructuredLinks,
        sourceIntegrity: Math.round(sourceIntegrity * 100),
        gaps: freezeList(gaps),
      }),
    });
  }));

  for (const [entityId, chapters] of chapterNumbersByEntity) {
    chapterNumbersByEntity.set(entityId, Object.freeze([...chapters].sort((left, right) => left - right)));
  }

  const chapterProfileByNumber = new Map(chapterProfiles.map((profile) => [profile.chapterNumber, profile]));

  const getChapterEvidenceProfile = (chapterNumber) => chapterProfileByNumber.get(Number(chapterNumber)) || null;

  const getEntityEvidenceProfile = (entityId) => {
    const entity = byId.get(entityId);
    if (!entity) return null;
    const sourceIds = unique(entity.sourceIds || []);
    const resolvedSources = sourceIds.map((sourceId) => sourceById.get(sourceId)).filter(Boolean);
    const invalidSourceIds = sourceIds.filter((sourceId) => !sourceById.has(sourceId));
    const chapterNumbers = chapterNumbersByEntity.get(entityId) || Object.freeze([]);
    const primaryChapterSources = resolvedSources.filter((source) => source.sourceType === 'chapter');
    const sourceIntegrity = sourceIds.length ? (sourceIds.length - invalidSourceIds.length) / sourceIds.length : 0;
    const score = Math.round(
      (sourceIds.length ? 45 : 0)
      + (chapterNumbers.length ? 25 : 0)
      + (primaryChapterSources.length ? 20 : 0)
      + (sourceIntegrity * 10),
    );
    const gaps = unique([
      entity.entityType !== 'source' && sourceIds.length === 0 && 'missing-source-reference',
      invalidSourceIds.length > 0 && 'broken-source-reference',
      CORE_ENTITY_TYPES.includes(entity.entityType) && entity.entityType !== 'chapter' && chapterNumbers.length === 0 && 'not-linked-to-chapter-evidence',
    ]);
    return Object.freeze({
      entity,
      sourceIds: freezeList(sourceIds),
      sources: freezeList(resolvedSources),
      invalidSourceIds: freezeList(invalidSourceIds),
      chapterNumbers: freezeList(chapterNumbers),
      score,
      grade: gradeFor(score),
      gaps: freezeList(gaps),
    });
  };

  const publishedCoreEntities = entities.filter((entity) => CORE_ENTITY_TYPES.includes(entity.entityType) && entity.publicationStatus === 'published');
  const missingSourceEntities = publishedCoreEntities
    .filter((entity) => entity.entityType !== 'chapter' && (!Array.isArray(entity.sourceIds) || entity.sourceIds.length === 0));
  const brokenSourceEntities = publishedCoreEntities
    .filter((entity) => (entity.sourceIds || []).some((sourceId) => !sourceById.has(sourceId)));
  const orphanedEntities = publishedCoreEntities
    .filter((entity) => !['chapter'].includes(entity.entityType) && !(chapterNumbersByEntity.get(entity.id)?.length));
  const chaptersMissingPrimarySource = chapterProfiles.filter((profile) => !profile.provenance.hasPrimarySource);
  const chaptersMissingReaderBridge = chapterProfiles.filter((profile) => !profile.provenance.hasReaderBridge);
  const chaptersWithoutStructuredLinks = chapterProfiles.filter((profile) => !profile.provenance.hasStructuredLinks);
  const averageChapterScore = chapterProfiles.length
    ? Math.round(chapterProfiles.reduce((total, profile) => total + profile.provenance.score, 0) / chapterProfiles.length)
    : 0;
  const domainCounts = Object.freeze(Object.fromEntries(CORE_ENTITY_TYPES.map((entityType) => [
    entityType,
    publishedCoreEntities.filter((entity) => entity.entityType === entityType).length,
  ])));
  const criticalGapCount = missingSourceEntities.length
    + brokenSourceEntities.length
    + chaptersMissingPrimarySource.length
    + chaptersMissingReaderBridge.length;

  const closureReport = Object.freeze({
    asOfChapter: latestChapter,
    readyForBatch2: criticalGapCount === 0,
    averageChapterScore,
    averageChapterGrade: gradeFor(averageChapterScore),
    chapterCount: chapterProfiles.length,
    domainCounts,
    missingSourceEntityIds: freezeList(missingSourceEntities.map((entity) => entity.id)),
    brokenSourceEntityIds: freezeList(brokenSourceEntities.map((entity) => entity.id)),
    orphanedEntityIds: freezeList(orphanedEntities.map((entity) => entity.id)),
    chaptersMissingPrimarySource: freezeList(chaptersMissingPrimarySource.map((profile) => profile.chapterNumber)),
    chaptersMissingReaderBridge: freezeList(chaptersMissingReaderBridge.map((profile) => profile.chapterNumber)),
    chaptersWithoutStructuredLinks: freezeList(chaptersWithoutStructuredLinks.map((profile) => profile.chapterNumber)),
    criticalGapCount,
  });

  const getFoundationClosureReport = () => closureReport;
  const getEvidenceEntities = (ids) => freezeList(resolveMany(ids));

  return Object.freeze({
    chapterProfiles,
    getChapterEvidenceProfile,
    getEntityEvidenceProfile,
    getFoundationClosureReport,
    getEvidenceEntities,
  });
};
