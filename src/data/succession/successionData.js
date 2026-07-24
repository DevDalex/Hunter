import { successionArchiveData } from './entitiesNenSystemFoundation.js';
// Active predecessor chain: entitiesNenSystemFoundation imports from './entitiesOrganizationFoundation.js', preserving every Batch 2 character and institution record before Batch 3 systems are added.
import { createSuccessionEvidenceGraph } from './evidenceGraph.js';
import { buildSuccessionIndexes } from './indexes.js';
import { createSuccessionSelectors } from './selectors.js';
import { createCharacterStateSelectors } from './characterStateSelectors.js';
import { createOrganizationStateSelectors } from './organizationStateSelectors.js';
import { createPeopleInstitutionClosure } from './peopleInstitutionClosure.js';
import { createNenSystemSelectors } from './nenSystemSelectors.js';
import { assertValidSuccessionArchiveData } from './schemas.js';

export const successionArchiveValidation = assertValidSuccessionArchiveData(successionArchiveData);
export const successionArchiveIndexes = buildSuccessionIndexes(successionArchiveData);
export const successionArchive = createSuccessionSelectors(successionArchiveData, successionArchiveIndexes);
export const successionCharacterStates = createCharacterStateSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionOrganizationStates = createOrganizationStateSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionPeopleInstitutionClosure = createPeopleInstitutionClosure({
  data: successionArchiveData,
  archive: successionArchive,
  characterStates: successionCharacterStates,
  organizationStates: successionOrganizationStates,
});
export const successionNenSystems = createNenSystemSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionEvidenceGraph = createSuccessionEvidenceGraph(successionArchiveData);

export { successionArchiveData };

export const {
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
} = successionArchive;

export const {
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
} = successionCharacterStates;

export const {
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
} = successionOrganizationStates;

export const {
  getCanonicalPeopleInstitutionRoute,
  getPeopleInstitutionRecord,
  getPeopleInstitutionCoverageGaps,
  getPeopleInstitutionClosureReport,
} = successionPeopleInstitutionClosure;

export const {
  getAbilityKnowledgeAtChapter,
  getAbilitiesKnownAtChapter,
  getAbilityDossier,
  getNenSystemProfile,
  getNenSystemsAtChapter,
  getNenSystemDossier,
  getGuardianBeastStateTimeline,
  getGuardianBeastStateAtChapter,
  getGuardianBeastDossier,
  getNenSystemClosureReport,
  searchNenSystems,
} = successionNenSystems;

const earliestChapter = (values) => {
  const chapters = values.filter(Number.isFinite);
  return chapters.length ? Math.min(...chapters) : null;
};

export const isSuccessionEntityAvailableAtChapter = (entityOrId, chapter) => {
  const entity = typeof entityOrId === 'string' ? getEntityById(entityOrId) : entityOrId;
  const parsedChapter = Number(chapter);
  if (!entity || !Number.isFinite(parsedChapter)) return Boolean(entity);
  if (entity.entityType === 'ability') return Boolean(getAbilityKnowledgeAtChapter(entity.id, parsedChapter)?.known);
  if (entity.entityType === 'guardian-beast') return Boolean(getGuardianBeastDossier(entity.id, parsedChapter));
  if (entity.entityType === 'chapter') return entity.number <= parsedChapter;
  if (entity.entityType === 'source' && Number.isFinite(entity.chapter)) return entity.chapter <= parsedChapter;
  if (entity.chapterRange?.start) return entity.chapterRange.start <= parsedChapter;

  const sourceChapters = (entity.sourceIds || [])
    .map((sourceId) => getEntityById(sourceId)?.chapter)
    .filter(Number.isFinite);
  const contextualChapters = [];
  if (entity.entityType === 'character') contextualChapters.push(...getAppearancesForCharacter(entity.id).map((record) => record.chapter));
  if (entity.entityType === 'organization') contextualChapters.push(...getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
  if (entity.entityType === 'location') contextualChapters.push(...getEventsAtLocation(entity.id).map((event) => event.chapterRange.start));
  const firstChapter = earliestChapter([...sourceChapters, ...contextualChapters]);
  return firstChapter === null || firstChapter <= parsedChapter;
};

export const searchSuccessionArchive = (query, options = {}) => {
  const limit = Number(options.limit) || 20;
  const chapter = Number(options.chapter);
  const baseResults = successionArchive.search(query, { ...options, limit: Math.max(limit, 100) });
  const allowCharacters = !options.types || options.types.includes('character');
  const allowOrganizations = !options.types || options.types.includes('organization');
  const stateResults = allowCharacters ? searchCharactersByState(query, { limit: Math.max(limit, 100) }) : [];
  const organizationResults = allowOrganizations ? searchOrganizationsByState(query, { limit: Math.max(limit, 100) }) : [];
  const merged = new Map();
  for (const result of [...baseResults, ...stateResults, ...organizationResults]) {
    if (Number.isFinite(chapter) && !isSuccessionEntityAvailableAtChapter(result.entity, chapter)) continue;
    const current = merged.get(result.entity.id);
    if (!current || result.score > current.score) merged.set(result.entity.id, result);
  }
  return [...merged.values()]
    .sort((left, right) => right.score - left.score || left.entity.name.localeCompare(right.entity.name))
    .slice(0, limit);
};

export const {
  chapterProfiles: successionChapterEvidenceProfiles,
  getChapterEvidenceProfile,
  getEntityEvidenceProfile,
  getFoundationClosureReport,
  getEvidenceEntities,
} = successionEvidenceGraph;
