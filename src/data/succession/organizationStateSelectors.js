const includesChapter = (range, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
};

const byRangeStart = (left, right) => left.chapterRange.start - right.chapterRange.start
  || (left.chapterRange.end ?? Number.POSITIVE_INFINITY) - (right.chapterRange.end ?? Number.POSITIVE_INFINITY)
  || left.id.localeCompare(right.id);

const uniqueEntities = (values) => [...new Map(values.filter(Boolean).map((value) => [value.id, value])).values()];

export const createOrganizationStateSelectors = ({ data, archive }) => {
  const profiles = data.organizationStateProfiles || Object.freeze({});
  const personnelProfiles = data.organizationPersonnelHistory || Object.freeze({});
  const latestChapter = data.chapters.at(-1)?.number || 414;

  const getOrganizationStateTimeline = (organizationId) => Object.freeze([
    ...(profiles[organizationId] || []),
  ].sort(byRangeStart));

  const getOrganizationStateAtChapter = (organizationId, chapter = null) => {
    const organization = archive.getEntityById(organizationId);
    if (!organization || organization.entityType !== 'organization') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const explicit = getOrganizationStateTimeline(organizationId)
      .filter((record) => includesChapter(record.chapterRange, parsedChapter))
      .sort((left, right) => right.chapterRange.start - left.chapterRange.start)[0];
    if (explicit) return explicit;
    return Object.freeze({
      id: `organization-state:derived:${organizationId.replace('organization:', '')}:${parsedChapter}`,
      organizationId,
      chapterRange: Object.freeze({ start: parsedChapter, end: parsedChapter }),
      status: organization.status || 'unknown',
      operationalState: organization.summary || 'No chapter-specific operational state is published.',
      authority: 'Derived from the canonical organization type and hierarchy.',
      territoryIds: Object.freeze([]),
      objectiveStates: Object.freeze([...(organization.objectives || [])]),
      pressure: Object.freeze([]),
      relatedEventIds: Object.freeze([]),
      certainty: 'confirmed',
      sourceIds: Object.freeze([...(organization.sourceIds || [])]),
      derived: true,
    });
  };

  const getOrganizationCurrentState = (organizationId) => getOrganizationStateAtChapter(organizationId, latestChapter);

  const getOrganizationPersonnelTimeline = (organizationId) => Object.freeze([
    ...(personnelProfiles[organizationId] || []),
  ].sort(byRangeStart));

  const getOrganizationPersonnelAtChapter = (organizationId, chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return Object.freeze([]);
    return Object.freeze(getOrganizationPersonnelTimeline(organizationId)
      .filter((record) => includesChapter(record.chapterRange, parsedChapter))
      .map((record) => Object.freeze({
        ...record,
        character: archive.getEntityById(record.characterId),
      }))
      .filter((record) => record.character));
  };

  const getOrganizationHierarchy = (organizationId) => {
    const organization = archive.getEntityById(organizationId);
    if (!organization || organization.entityType !== 'organization') return null;
    const parent = organization.parentOrganizationId ? archive.getEntityById(organization.parentOrganizationId) : null;
    const children = data.organizations.filter((candidate) => candidate.parentOrganizationId === organizationId);
    const ancestors = [];
    const seen = new Set([organizationId]);
    let current = parent;
    while (current?.entityType === 'organization' && !seen.has(current.id)) {
      ancestors.unshift(current);
      seen.add(current.id);
      current = current.parentOrganizationId ? archive.getEntityById(current.parentOrganizationId) : null;
    }
    return Object.freeze({
      organization,
      parent: parent?.entityType === 'organization' ? parent : null,
      children: Object.freeze(children),
      ancestors: Object.freeze(ancestors),
    });
  };

  const getOrganizationDossier = (organizationId, chapter = null) => {
    const organization = archive.getEntityById(organizationId);
    if (!organization || organization.entityType !== 'organization') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const state = getOrganizationStateAtChapter(organizationId, parsedChapter);
    const hierarchy = getOrganizationHierarchy(organizationId);
    const canonicalMembers = archive.getOrganizationMembers(organizationId);
    const personnelHistory = Object.freeze(getOrganizationPersonnelTimeline(organizationId)
      .filter((record) => record.chapterRange.start <= parsedChapter));
    const activePersonnel = getOrganizationPersonnelAtChapter(organizationId, parsedChapter);
    const leaders = uniqueEntities([
      ...(organization.leaderIds || []).map((id) => archive.getEntityById(id)),
      ...activePersonnel.filter((record) => /leader|chair|boss|king|commander/i.test(record.role)).map((record) => record.character),
    ]);
    const territories = uniqueEntities((state?.territoryIds || []).map((id) => archive.getEntityById(id))
      .filter((entity) => entity?.entityType === 'location'));
    const eventHistory = archive.getEventsForOrganization(organizationId)
      .filter((event) => event.chapterRange.start <= parsedChapter)
      .sort(byRangeStart);
    const activeEvents = eventHistory.filter((event) => includesChapter(event.chapterRange, parsedChapter));
    const relationshipSnapshot = archive.getRelationshipSnapshot(organizationId, parsedChapter);
    const assignmentSnapshot = archive.getAssignmentSnapshot(organizationId, parsedChapter);
    const sourceIds = [...new Set([
      ...(organization.sourceIds || []),
      ...(state?.sourceIds || []),
      ...personnelHistory.flatMap((record) => record.sourceIds || []),
      ...eventHistory.flatMap((event) => event.sourceIds || []),
      ...(relationshipSnapshot?.relationships || []).flatMap((relationship) => relationship.sourceIds || []),
      ...(assignmentSnapshot?.assignments || []).flatMap((assignment) => assignment.sourceIds || []),
    ])];
    return Object.freeze({
      organization,
      chapter: parsedChapter,
      state,
      hierarchy,
      leaders: Object.freeze(leaders),
      canonicalMembers: Object.freeze(canonicalMembers),
      activePersonnel,
      personnelHistory,
      territories: Object.freeze(territories),
      objectives: Object.freeze([...(state?.objectiveStates?.length ? state.objectiveStates : organization.objectives || [])]),
      pressure: Object.freeze([...(state?.pressure || [])]),
      assignments: assignmentSnapshot,
      relationships: relationshipSnapshot,
      activeEvents: Object.freeze(activeEvents),
      eventHistory: Object.freeze(eventHistory),
      relatedEvents: Object.freeze((state?.relatedEventIds || []).map((id) => archive.getEntityById(id)).filter((event) => event?.entityType === 'event')),
      sources: Object.freeze(sourceIds.map((id) => archive.getEntityById(id)).filter((source) => source?.entityType === 'source')),
    });
  };

  const getOrganizationsWithStateProfiles = () => Object.freeze(uniqueEntities(
    Object.keys(profiles).map((organizationId) => archive.getEntityById(organizationId)),
  ));

  const getOrganizationStateCoverageReport = () => {
    const organizations = archive.getEntitiesByType('organization');
    const explicitIds = new Set(Object.keys(profiles));
    const byType = new Map();
    for (const organization of organizations) {
      const type = organization.organizationType || 'unknown';
      const current = byType.get(type) || { id: type, label: type.replaceAll('-', ' '), total: 0, explicit: 0 };
      current.total += 1;
      if (explicitIds.has(organization.id)) current.explicit += 1;
      byType.set(type, current);
    }
    return Object.freeze({
      totalOrganizations: organizations.length,
      explicitOrganizations: explicitIds.size,
      derivedOrganizations: organizations.length - explicitIds.size,
      coveragePercent: organizations.length ? Math.round((explicitIds.size / organizations.length) * 100) : 0,
      organizationTypes: Object.freeze([...byType.values()].map((record) => Object.freeze({ ...record }))),
    });
  };

  const searchOrganizationsByState = (query, { limit = 20 } = {}) => {
    const normalized = String(query || '').trim().toLocaleLowerCase();
    if (!normalized) return [];
    const matches = [];
    for (const organization of archive.getEntitiesByType('organization')) {
      const timeline = profiles[organization.id] || [];
      const personnel = personnelProfiles[organization.id] || [];
      const text = [
        organization.name,
        organization.organizationType,
        organization.summary,
        ...(organization.objectives || []),
        ...timeline.flatMap((record) => [
          record.status,
          record.operationalState,
          record.authority,
          ...(record.objectiveStates || []),
          ...(record.pressure || []),
        ]),
        ...personnel.flatMap((record) => [record.role, record.status, record.transitionType, record.note]),
      ].join(' ').toLocaleLowerCase();
      if (!text.includes(normalized)) continue;
      const exact = timeline.some((record) => [record.status, record.authority]
        .some((value) => String(value || '').toLocaleLowerCase() === normalized));
      matches.push(Object.freeze({ entity: organization, score: exact ? 55 : 27 }));
    }
    return matches.sort((left, right) => right.score - left.score || left.entity.name.localeCompare(right.entity.name)).slice(0, limit);
  };

  return Object.freeze({
    getOrganizationStateTimeline,
    getOrganizationStateAtChapter,
    getOrganizationCurrentState,
    getOrganizationPersonnelTimeline,
    getOrganizationPersonnelAtChapter,
    getOrganizationHierarchy,
    getOrganizationDossier,
    getOrganizationsWithStateProfiles,
    getOrganizationStateCoverageReport,
    searchOrganizationsByState,
  });
};
