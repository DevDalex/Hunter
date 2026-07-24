const includesChapter = (range, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
};

const sortByRange = (left, right) => left.chapterRange.start - right.chapterRange.start
  || (left.chapterRange.end ?? Number.POSITIVE_INFINITY) - (right.chapterRange.end ?? Number.POSITIVE_INFINITY)
  || left.id.localeCompare(right.id);

const uniqueEntities = (values) => [...new Map(values.filter(Boolean).map((value) => [value.id, value])).values()];
const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const roleLayerDefinitions = Object.freeze([
  Object.freeze({ id: 'royal-sovereign', label: 'Royal sovereign', roles: ['king'], mandate: 'Preserve royal authority and administer the succession system.', authority: 'Highest Kakin royal and institutional authority aboard the voyage.' }),
  Object.freeze({ id: 'royal-candidate', label: 'Royal candidate', roles: ['prince'], mandate: 'Survive the succession ritual while directing a household, alliances, and political strategy.', authority: 'Prince-level household authority constrained by the ritual and shipboard law.' }),
  Object.freeze({ id: 'royal-household', label: 'Royal household authority', roles: ['queen', 'royal-parent'], mandate: 'Protect and direct a prince household through personnel, contracts, and political decisions.', authority: 'Maternal and household authority rather than independent candidacy.' }),
  Object.freeze({ id: 'justice-authority', label: 'Justice authority', roles: ['justice-official'], mandate: 'Investigate crimes, control custody, preserve hearings, and regulate protected access.', authority: 'Justice Bureau procedure and institutional access.' }),
  Object.freeze({ id: 'military-command', label: 'Military command and operations', roles: ['benjamin-soldier', 'military', 'soldier'], mandate: 'Execute security, surveillance, custody, assassination, or martial-law duties.', authority: 'Kakin military hierarchy or a prince-controlled private command.' }),
  Object.freeze({ id: 'mafia-command', label: 'Mafia command', roles: ['mafia-boss', 'mafia-underboss'], mandate: 'Protect territory, command members, and manage the Heil-Ly war and royal sponsorship.', authority: 'Family hierarchy and lower-tier territorial control.' }),
  Object.freeze({ id: 'mafia-operations', label: 'Mafia operations', roles: ['mafia-member', 'mafia-benefactor'], mandate: 'Advance a family’s territorial, political, intelligence, or combat objectives.', authority: 'Delegated mafia role or royal sponsorship.' }),
  Object.freeze({ id: 'phantom-troupe', label: 'Phantom Troupe operations', roles: ['phantom-troupe-member'], mandate: 'Pursue the Troupe’s Hisoka hunt while responding to Heil-Ly and mafia interference.', authority: 'Troupe membership, internal command, and individual combat capacity.' }),
  Object.freeze({ id: 'hunter-operations', label: 'Hunter operations', roles: ['zodiac', 'hunter'], mandate: 'Fulfill Association, expedition, protection, investigation, or Nen-instruction duties.', authority: 'Hunter license, contracts, Zodiac office, and demonstrated Nen capability.' }),
  Object.freeze({ id: 'royal-protection', label: 'Royal protection detail', roles: ['bodyguard'], mandate: 'Protect, observe, instruct, investigate, or infiltrate on behalf of a royal household.', authority: 'Household contract, military placement, or professional guard duty.' }),
  Object.freeze({ id: 'household-support', label: 'Royal household support', roles: ['royal-servant'], mandate: 'Maintain household operations and support the assigned prince or queen.', authority: 'Delegated household service.' }),
  Object.freeze({ id: 'arc-actor', label: 'Current-arc actor', roles: ['arc-character'], mandate: 'Participate in the voyage conflict through a maintained canonical role.', authority: 'No broader authority is inferred beyond published records.' }),
]);

const roleLayerFor = (character) => roleLayerDefinitions.find((definition) => definition.roles.some((role) => (character.roles || []).includes(role)))
  || roleLayerDefinitions.at(-1);

const timelineEntry = ({ id, kind, chapterRange, label, summary, locationId = null, certainty = 'confirmed', sourceIds = [], entityId = null }) => Object.freeze({
  id,
  kind,
  chapterRange: Object.freeze({ start: chapterRange.start, end: chapterRange.end ?? chapterRange.start }),
  label,
  summary,
  locationId,
  certainty,
  sourceIds: Object.freeze([...(sourceIds || [])]),
  entityId,
});

export const createCharacterStateSelectors = ({ data, archive }) => {
  const profiles = data.characterStateProfiles || Object.freeze({});
  const organizationPersonnel = data.organizationPersonnelHistory || Object.freeze({});
  const latestChapter = data.chapters.at(-1)?.number || 414;

  const sourceAtChapter = (sourceId, chapter) => {
    const source = archive.getEntityById(sourceId);
    return source?.entityType === 'source' && (!source.chapter || source.chapter <= chapter) ? source : null;
  };

  const entityAvailableAtChapter = (entity, chapter) => {
    const chapterSources = (entity?.sourceIds || [])
      .map((sourceId) => archive.getEntityById(sourceId))
      .filter((source) => source?.entityType === 'source' && source.chapter)
      .map((source) => source.chapter);
    return chapterSources.length === 0 || Math.min(...chapterSources) <= chapter;
  };

  const getCharacterStateTimeline = (characterId) => Object.freeze([
    ...(profiles[characterId] || []),
  ].sort(sortByRange));

  const getCharacterStateAtChapter = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;

    const explicit = getCharacterStateTimeline(characterId)
      .filter((record) => includesChapter(record.chapterRange, parsedChapter))
      .sort((left, right) => right.chapterRange.start - left.chapterRange.start)[0];
    if (explicit) return explicit;

    const locationRecord = archive.getCurrentLocationRecordForCharacter(characterId, parsedChapter);
    return Object.freeze({
      id: `character-state:derived:${characterId.replace('character:', '')}:${parsedChapter}`,
      characterId,
      chapterRange: Object.freeze({ start: parsedChapter, end: parsedChapter }),
      life: character.status?.life || 'unknown',
      bodyState: character.status?.life === 'dead' ? 'deceased body' : 'living body',
      consciousnessState: character.status?.life === 'dead' ? 'unknown or ended' : 'active in own body',
      operationalState: character.summary || 'No chapter-specific operational override is published.',
      protectionState: 'Derived from active assignments and relationships.',
      threatLevel: 'unknown',
      nenKnowledge: character.nen?.naturalType ? `${character.nen.naturalType} user` : 'unknown',
      allegianceState: 'Derived from canonical affiliations.',
      locationId: locationRecord?.locationId || character.locationState?.locationId || null,
      openQuestions: Object.freeze([]),
      certainty: character.status?.certainty || 'confirmed',
      sourceIds: Object.freeze([...(character.sourceIds || [])]),
      derived: true,
    });
  };

  const getCharacterCurrentState = (characterId) => getCharacterStateAtChapter(characterId, latestChapter);

  const getCharacterAffiliationsAtChapter = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return Object.freeze([]);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return Object.freeze([]);

    const personnelRecords = Object.entries(organizationPersonnel).flatMap(([organizationId, records]) => (records || [])
      .filter((record) => record.characterId === characterId)
      .map((record) => ({ ...record, organizationId })));
    const timedOrganizationIds = new Set(personnelRecords.map((record) => record.organizationId));
    const activePersonnel = personnelRecords.filter((record) => includesChapter(record.chapterRange, parsedChapter));
    const affiliations = [];

    for (const affiliation of character.affiliations || []) {
      if (timedOrganizationIds.has(affiliation.organizationId)) continue;
      affiliations.push(Object.freeze({
        ...affiliation,
        certainty: 'confirmed',
        sourceIds: Object.freeze([...(character.sourceIds || [])]),
        derivedFrom: 'canonical-affiliation',
      }));
    }

    for (const record of activePersonnel) {
      affiliations.push(Object.freeze({
        organizationId: record.organizationId,
        role: record.role,
        status: record.status,
        certainty: record.certainty,
        sourceIds: Object.freeze([...(record.sourceIds || [])]),
        transitionId: record.id,
        derivedFrom: 'organization-personnel-history',
      }));
    }

    return Object.freeze([...new Map(affiliations.map((affiliation) => [
      `${affiliation.organizationId}|${affiliation.role}|${affiliation.status}`,
      affiliation,
    ])).values()]);
  };

  const getCharacterRoleProfile = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const layer = roleLayerFor(character);
    const assignmentSnapshot = archive.getAssignmentSnapshot(characterId, parsedChapter);
    const relationshipSnapshot = archive.getRelationshipSnapshot(characterId, parsedChapter);
    const activeRoles = Object.entries(assignmentSnapshot?.byRole || {})
      .filter(([, records]) => records.length > 0)
      .map(([role]) => role);
    const responsibilities = [
      ...(assignmentSnapshot?.byRole.person || []).map((assignment) => assignment.objective || assignment.summary),
      ...(assignmentSnapshot?.byRole.principal || []).map((assignment) => `Direct ${assignment.name}`),
      ...(assignmentSnapshot?.byRole.reporting || []).map((assignment) => `Receive reports for ${assignment.name}`),
    ];
    const vulnerabilities = [
      ...(assignmentSnapshot?.byRole.subject || [])
        .filter((assignment) => ['assassination', 'infiltration', 'surveillance'].includes(assignment.assignmentType))
        .map((assignment) => `${titleCase(assignment.assignmentType)}: ${assignment.name}`),
      ...((getCharacterStateAtChapter(characterId, parsedChapter)?.openQuestions) || []),
    ];
    return Object.freeze({
      id: layer.id,
      label: layer.label,
      primaryRole: (character.roles || []).find((role) => layer.roles.includes(role)) || character.roles?.[0] || 'arc-character',
      roles: Object.freeze([...(character.roles || [])]),
      mandate: layer.mandate,
      authority: layer.authority,
      assignmentRoles: Object.freeze(activeRoles),
      responsibilities: Object.freeze([...new Set(responsibilities.filter(Boolean))]),
      vulnerabilities: Object.freeze([...new Set(vulnerabilities.filter(Boolean))]),
      affiliationIds: Object.freeze(getCharacterAffiliationsAtChapter(characterId, parsedChapter).map((affiliation) => affiliation.organizationId)),
      relationshipCount: relationshipSnapshot?.relationships.length || 0,
      chapter: parsedChapter,
    });
  };

  const getCharacterLifetimeTimeline = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return Object.freeze([]);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return Object.freeze([]);
    const entries = [];

    for (const record of getCharacterStateTimeline(characterId)) {
      if (record.chapterRange.start > parsedChapter) continue;
      entries.push(timelineEntry({
        id: `timeline:${record.id}`,
        kind: 'state',
        chapterRange: record.chapterRange,
        label: 'State change',
        summary: `${record.operationalState} ${record.bodyState}; ${record.consciousnessState}.`,
        locationId: record.locationId,
        certainty: record.certainty,
        sourceIds: record.sourceIds,
      }));
    }

    for (const record of archive.getMovementHistoryForCharacter(characterId)) {
      if (record.chapterRange.start > parsedChapter) continue;
      entries.push(timelineEntry({
        id: `timeline:${record.id}`,
        kind: 'movement',
        chapterRange: record.chapterRange,
        label: record.name || 'Location record',
        summary: record.summary || record.state,
        locationId: record.locationId,
        certainty: record.certainty,
        sourceIds: record.sourceIds,
        entityId: record.id,
      }));
    }

    for (const assignment of archive.getAssignmentTimelineForCharacter(characterId)) {
      if (assignment.chapterRange.start > parsedChapter) continue;
      entries.push(timelineEntry({
        id: `timeline:${assignment.id}`,
        kind: 'assignment',
        chapterRange: assignment.chapterRange,
        label: assignment.name,
        summary: assignment.objective || assignment.summary,
        locationId: assignment.locationId,
        certainty: assignment.certainty,
        sourceIds: assignment.sourceIds,
        entityId: assignment.id,
      }));
    }

    for (const relationship of archive.getRelationshipsForEntity(characterId)) {
      if (relationship.chapterRange.start > parsedChapter) continue;
      entries.push(timelineEntry({
        id: `timeline:${relationship.id}`,
        kind: 'relationship',
        chapterRange: relationship.chapterRange,
        label: relationship.name,
        summary: relationship.operationalState || relationship.summary,
        certainty: relationship.certainty,
        sourceIds: relationship.sourceIds,
        entityId: relationship.id,
      }));
    }

    for (const event of archive.getEventsForCharacter(characterId)) {
      if (event.chapterRange.start > parsedChapter) continue;
      entries.push(timelineEntry({
        id: `timeline:${event.id}`,
        kind: 'event',
        chapterRange: event.chapterRange,
        label: event.name,
        summary: event.summary,
        locationId: event.locationIds?.[0] || null,
        certainty: event.chronology?.certainty || 'confirmed',
        sourceIds: event.sourceIds,
        entityId: event.id,
      }));
    }

    for (const appearance of archive.getAppearancesForCharacter(characterId)) {
      if (appearance.chapter > parsedChapter) continue;
      entries.push(timelineEntry({
        id: `timeline:appearance:${characterId}:${appearance.chapter}:${appearance.role}`,
        kind: 'appearance',
        chapterRange: { start: appearance.chapter, end: appearance.chapter },
        label: `Chapter ${appearance.chapter} appearance`,
        summary: `${titleCase(appearance.role)} appearance in the structured chapter record.`,
        entityId: appearance.chapterId,
      }));
    }

    return Object.freeze(entries.sort((left, right) => left.chapterRange.start - right.chapterRange.start
      || left.kind.localeCompare(right.kind)
      || left.id.localeCompare(right.id)));
  };

  const getCharacterDossier = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;

    const state = getCharacterStateAtChapter(characterId, parsedChapter);
    const locationRecord = archive.getCurrentLocationRecordForCharacter(characterId, parsedChapter);
    const location = archive.getEntityById(state?.locationId || locationRecord?.locationId);
    const assignmentSnapshot = archive.getAssignmentSnapshot(characterId, parsedChapter);
    const relationshipSnapshot = archive.getRelationshipSnapshot(characterId, parsedChapter);
    const events = archive.getEventsForCharacter(characterId)
      .filter((event) => includesChapter(event.chapterRange, parsedChapter));
    const eventHistory = archive.getEventsForCharacter(characterId)
      .filter((event) => event.chapterRange.start <= parsedChapter)
      .sort(sortByRange);
    const movementHistory = archive.getMovementHistoryForCharacter(characterId)
      .filter((record) => record.chapterRange.start <= parsedChapter);
    const assignmentHistory = archive.getAssignmentTimelineForCharacter(characterId)
      .filter((assignment) => assignment.chapterRange.start <= parsedChapter);
    const relationshipHistory = archive.getRelationshipsForEntity(characterId)
      .filter((relationship) => relationship.chapterRange.start <= parsedChapter)
      .sort(sortByRange);
    const abilities = archive.getAbilitiesForOwner(characterId)
      .filter((ability) => entityAvailableAtChapter(ability, parsedChapter));
    const appearances = archive.getAppearancesForCharacter(characterId)
      .filter((appearance) => appearance.chapter <= parsedChapter);
    const threatAssignments = assignmentSnapshot?.byRole.subject.filter((assignment) => [
      'assassination', 'infiltration', 'surveillance',
    ].includes(assignment.assignmentType)) || [];
    const protectionAssignments = assignmentSnapshot?.byRole.subject.filter((assignment) => [
      'protection', 'custody', 'allied-reinforcement', 'transferred-protection',
    ].includes(assignment.assignmentType)) || [];
    const affiliations = getCharacterAffiliationsAtChapter(characterId, parsedChapter);
    const sourceIds = [...new Set([
      ...(character.sourceIds || []),
      ...(state?.sourceIds || []),
      ...eventHistory.flatMap((event) => event.sourceIds || []),
      ...movementHistory.flatMap((record) => record.sourceIds || []),
      ...assignmentHistory.flatMap((assignment) => assignment.sourceIds || []),
      ...relationshipHistory.flatMap((relationship) => relationship.sourceIds || []),
      ...abilities.flatMap((ability) => ability.sourceIds || []),
      ...affiliations.flatMap((affiliation) => affiliation.sourceIds || []),
    ])];
    const sources = sourceIds.map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean);

    return Object.freeze({
      character,
      chapter: parsedChapter,
      state,
      roleProfile: getCharacterRoleProfile(characterId, parsedChapter),
      locationRecord,
      location: location?.entityType === 'location' ? location : null,
      assignments: assignmentSnapshot,
      relationships: relationshipSnapshot,
      abilities: Object.freeze(abilities),
      events: Object.freeze(events),
      eventHistory: Object.freeze(eventHistory),
      movementHistory: Object.freeze(movementHistory),
      assignmentHistory: Object.freeze(assignmentHistory),
      relationshipHistory: Object.freeze(relationshipHistory),
      appearances: Object.freeze(appearances),
      threatAssignments: Object.freeze(threatAssignments),
      protectionAssignments: Object.freeze(protectionAssignments),
      affiliations,
      sources: Object.freeze(sources),
      timeline: Object.freeze(getCharacterStateTimeline(characterId).filter((record) => record.chapterRange.start <= parsedChapter)),
      lifetimeTimeline: getCharacterLifetimeTimeline(characterId, parsedChapter),
    });
  };

  const searchCharactersByState = (query, { limit = 20 } = {}) => {
    const normalized = String(query || '').trim().toLocaleLowerCase();
    if (!normalized) return [];
    const matches = [];
    for (const character of archive.getEntitiesByType('character')) {
      const timeline = profiles[character.id] || [];
      const roleProfile = getCharacterRoleProfile(character.id, latestChapter);
      const text = [
        ...timeline.flatMap((record) => [
          record.bodyState,
          record.consciousnessState,
          record.operationalState,
          record.protectionState,
          record.threatLevel,
          record.nenKnowledge,
          record.allegianceState,
          ...(record.openQuestions || []),
        ]),
        roleProfile?.label,
        roleProfile?.mandate,
        roleProfile?.authority,
      ].join(' ').toLocaleLowerCase();
      if (!text.includes(normalized)) continue;
      const exactState = timeline.some((record) => [record.bodyState, record.consciousnessState, record.threatLevel]
        .some((value) => String(value || '').toLocaleLowerCase() === normalized));
      matches.push(Object.freeze({ entity: character, score: exactState ? 55 : 25 }));
    }
    return matches.sort((left, right) => right.score - left.score || left.entity.name.localeCompare(right.entity.name)).slice(0, limit);
  };

  const getCharactersWithStateProfiles = () => Object.freeze(uniqueEntities(
    Object.keys(profiles).map((characterId) => archive.getEntityById(characterId)),
  ));

  const getCharacterStateCoverageReport = () => {
    const characters = archive.getEntitiesByType('character');
    const explicitIds = new Set(Object.keys(profiles));
    const byRoleLayer = new Map();
    for (const character of characters) {
      const layer = roleLayerFor(character);
      const current = byRoleLayer.get(layer.id) || { id: layer.id, label: layer.label, total: 0, explicit: 0 };
      current.total += 1;
      if (explicitIds.has(character.id)) current.explicit += 1;
      byRoleLayer.set(layer.id, current);
    }
    return Object.freeze({
      totalCharacters: characters.length,
      explicitCharacters: explicitIds.size,
      derivedCharacters: characters.length - explicitIds.size,
      coveragePercent: characters.length ? Math.round((explicitIds.size / characters.length) * 100) : 0,
      roleLayers: Object.freeze([...byRoleLayer.values()].map((record) => Object.freeze({ ...record }))),
    });
  };

  return Object.freeze({
    getCharacterStateTimeline,
    getCharacterStateAtChapter,
    getCharacterCurrentState,
    getCharacterAffiliationsAtChapter,
    getCharacterRoleProfile,
    getCharacterLifetimeTimeline,
    getCharacterDossier,
    getCharactersWithStateProfiles,
    getCharacterStateCoverageReport,
    searchCharactersByState,
  });
};
