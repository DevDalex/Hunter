const PEOPLE_ROUTE = 'characters';
const INSTITUTION_ROUTE = 'organizations';
const LEADERSHIP_PATTERN = /leader|chair|boss|king|commander|chief adviser|justice bureau official/i;

const unique = (values) => [...new Set(values.filter(Boolean))];
const sourceInsideBoundary = (source, chapter) => source?.entityType === 'source' && (!source.chapter || source.chapter <= chapter);
const rangeEnd = (range) => range.end ?? Number.POSITIVE_INFINITY;

const inspectStateMapIntegrity = (profiles, entityType) => {
  const issues = [];
  for (const [entityId, records] of Object.entries(profiles || {})) {
    const ids = new Set();
    const sorted = [...(records || [])].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id));
    for (let index = 0; index < sorted.length; index += 1) {
      const record = sorted[index];
      if (ids.has(record.id)) issues.push(Object.freeze({ entityId, entityType, recordId: record.id, issue: 'duplicate-state-id' }));
      ids.add(record.id);
      const previous = sorted[index - 1];
      if (previous && rangeEnd(previous.chapterRange) >= record.chapterRange.start) {
        issues.push(Object.freeze({
          entityId,
          entityType,
          recordId: record.id,
          previousRecordId: previous.id,
          issue: 'overlapping-state-range',
        }));
      }
    }
  }
  return Object.freeze(issues);
};

export const createPeopleInstitutionClosure = ({ data, archive, characterStates, organizationStates }) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const characters = archive.getEntitiesByType('character');
  const organizations = archive.getEntitiesByType('organization');
  const explicitCharacterIds = new Set(Object.keys(data.characterStateProfiles || {}));
  const explicitOrganizationIds = new Set(Object.keys(data.organizationStateProfiles || {}));

  const institutionLeadershipIds = new Set(organizations.flatMap((organization) => organization.leaderIds || []));
  for (const records of Object.values(data.organizationPersonnelHistory || {})) {
    for (const record of records || []) {
      if (LEADERSHIP_PATTERN.test(record.role || '')) institutionLeadershipIds.add(record.characterId);
    }
  }

  const priorityCharacterIds = new Set(characters
    .filter((character) => (character.roles || []).some((role) => ['king', 'prince', 'queen'].includes(role)))
    .map((character) => character.id));
  for (const characterId of institutionLeadershipIds) priorityCharacterIds.add(characterId);
  for (const character of characters) {
    if (character.status?.certainty && character.status.certainty !== 'confirmed') priorityCharacterIds.add(character.id);
  }

  const getCanonicalPeopleInstitutionRoute = (entityOrId) => {
    const entity = typeof entityOrId === 'string' ? archive.getEntityById(entityOrId) : entityOrId;
    if (entity?.entityType === 'character') return PEOPLE_ROUTE;
    if (entity?.entityType === 'organization') return INSTITUTION_ROUTE;
    return null;
  };

  const getPeopleInstitutionRecord = (entityId, chapter = null) => {
    const entity = archive.getEntityById(entityId);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!entity || !Number.isFinite(parsedChapter)) return null;
    if (entity.entityType === 'character') {
      return Object.freeze({
        entity,
        route: PEOPLE_ROUTE,
        chapter: parsedChapter,
        explicit: explicitCharacterIds.has(entity.id),
        dossier: characterStates.getCharacterDossier(entity.id, parsedChapter),
      });
    }
    if (entity.entityType === 'organization') {
      return Object.freeze({
        entity,
        route: INSTITUTION_ROUTE,
        chapter: parsedChapter,
        explicit: explicitOrganizationIds.has(entity.id),
        dossier: organizationStates.getOrganizationDossier(entity.id, parsedChapter),
      });
    }
    return null;
  };

  const getPeopleInstitutionCoverageGaps = () => {
    const derivedCharacters = characters
      .filter((character) => !explicitCharacterIds.has(character.id))
      .map((character) => Object.freeze({
        entity: character,
        route: PEOPLE_ROUTE,
        roleLayer: characterStates.getCharacterRoleProfile(character.id, latestChapter)?.id || 'arc-actor',
        priority: priorityCharacterIds.has(character.id),
        fallback: 'graph-derived-character-state',
      }));
    const missingOrganizations = organizations
      .filter((organization) => !explicitOrganizationIds.has(organization.id))
      .map((organization) => Object.freeze({
        entity: organization,
        route: INSTITUTION_ROUTE,
        priority: true,
        fallback: 'derived-organization-state',
      }));
    return Object.freeze({
      derivedCharacters: Object.freeze(derivedCharacters),
      missingOrganizations: Object.freeze(missingOrganizations),
      priorityCharacterGaps: Object.freeze(derivedCharacters.filter((record) => record.priority)),
    });
  };

  const inspectCharacter = (character, chapter) => {
    const dossier = characterStates.getCharacterDossier(character.id, chapter);
    const issues = [];
    if (!dossier) issues.push('missing-dossier');
    if (!dossier?.state) issues.push('missing-state');
    if (!dossier?.roleProfile) issues.push('missing-role-profile');
    if (dossier?.chapter !== chapter) issues.push('chapter-mismatch');
    if ((dossier?.timeline || []).some((record) => record.chapterRange.start > chapter)) issues.push('future-state-record');
    if ((dossier?.personnelHistory || []).some((record) => record.chapterRange.start > chapter)) issues.push('future-personnel-record');
    if ((dossier?.sources || []).some((source) => !sourceInsideBoundary(source, chapter))) issues.push('future-source');
    if ((dossier?.abilities || []).some((ability) => {
      const sourceChapters = (ability.sourceIds || [])
        .map((sourceId) => archive.getEntityById(sourceId)?.chapter)
        .filter(Boolean);
      return sourceChapters.length > 0 && Math.min(...sourceChapters) > chapter;
    })) issues.push('future-ability');
    return Object.freeze({ entity: character, route: PEOPLE_ROUTE, chapter, issues: Object.freeze(issues) });
  };

  const inspectOrganization = (organization, chapter) => {
    const dossier = organizationStates.getOrganizationDossier(organization.id, chapter);
    const issues = [];
    if (!dossier) issues.push('missing-dossier');
    if (!dossier?.state) issues.push('missing-state');
    if (!dossier?.hierarchy) issues.push('missing-hierarchy');
    if (dossier?.chapter !== chapter) issues.push('chapter-mismatch');
    if ((dossier?.personnelHistory || []).some((record) => record.chapterRange.start > chapter)) issues.push('future-personnel-record');
    if ((dossier?.sources || []).some((source) => !sourceInsideBoundary(source, chapter))) issues.push('future-source');
    return Object.freeze({ entity: organization, route: INSTITUTION_ROUTE, chapter, issues: Object.freeze(issues) });
  };

  const getPeopleInstitutionClosureReport = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const characterInspections = characters.map((character) => inspectCharacter(character, parsedChapter));
    const organizationInspections = organizations.map((organization) => inspectOrganization(organization, parsedChapter));
    const characterStateIntegrityIssues = inspectStateMapIntegrity(data.characterStateProfiles, 'character');
    const organizationStateIntegrityIssues = inspectStateMapIntegrity(data.organizationStateProfiles, 'organization');
    const stateIntegrityIssues = Object.freeze([...characterStateIntegrityIssues, ...organizationStateIntegrityIssues]);
    const gaps = getPeopleInstitutionCoverageGaps();
    const routeViolations = [
      ...characters.filter((character) => getCanonicalPeopleInstitutionRoute(character) !== PEOPLE_ROUTE),
      ...organizations.filter((organization) => getCanonicalPeopleInstitutionRoute(organization) !== INSTITUTION_ROUTE),
    ];
    const invalidCharacters = characterInspections.filter((record) => record.issues.length > 0);
    const invalidOrganizations = organizationInspections.filter((record) => record.issues.length > 0);
    const explicitPriorityCharacters = [...priorityCharacterIds].filter((characterId) => explicitCharacterIds.has(characterId));
    const closureReady = invalidCharacters.length === 0
      && invalidOrganizations.length === 0
      && stateIntegrityIssues.length === 0
      && routeViolations.length === 0
      && gaps.priorityCharacterGaps.length === 0
      && explicitOrganizationIds.size === organizations.length;

    return Object.freeze({
      chapter: parsedChapter,
      status: closureReady ? 'closed' : 'open',
      closureReady,
      characters: Object.freeze({
        total: characters.length,
        dossiers: characters.length - invalidCharacters.filter((record) => record.issues.includes('missing-dossier')).length,
        explicit: explicitCharacterIds.size,
        derived: characters.length - explicitCharacterIds.size,
        priorityTotal: priorityCharacterIds.size,
        priorityExplicit: explicitPriorityCharacters.length,
      }),
      organizations: Object.freeze({
        total: organizations.length,
        dossiers: organizations.length - invalidOrganizations.filter((record) => record.issues.includes('missing-dossier')).length,
        explicit: explicitOrganizationIds.size,
        derived: organizations.length - explicitOrganizationIds.size,
      }),
      routes: Object.freeze({
        people: PEOPLE_ROUTE,
        institutions: INSTITUTION_ROUTE,
        violations: Object.freeze(routeViolations),
      }),
      institutionLeadershipIds: Object.freeze(unique([...institutionLeadershipIds])),
      priorityCharacterIds: Object.freeze(unique([...priorityCharacterIds])),
      gaps,
      stateIntegrityIssues,
      invalidCharacters: Object.freeze(invalidCharacters),
      invalidOrganizations: Object.freeze(invalidOrganizations),
    });
  };

  return Object.freeze({
    getCanonicalPeopleInstitutionRoute,
    getPeopleInstitutionRecord,
    getPeopleInstitutionCoverageGaps,
    getPeopleInstitutionClosureReport,
  });
};
