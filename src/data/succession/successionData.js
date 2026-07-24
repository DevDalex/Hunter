import { successionArchiveData } from './entitiesCharacterFoundation.js';
import { createSuccessionEvidenceGraph } from './evidenceGraph.js';
import { buildSuccessionIndexes } from './indexes.js';
import { createSuccessionSelectors } from './selectors.js';
import { createCharacterStateSelectors } from './characterStateSelectors.js';
import { assertValidSuccessionArchiveData } from './schemas.js';

export const successionArchiveValidation = assertValidSuccessionArchiveData(successionArchiveData);
export const successionArchiveIndexes = buildSuccessionIndexes(successionArchiveData);
export const successionArchive = createSuccessionSelectors(successionArchiveData, successionArchiveIndexes);
export const successionCharacterStates = createCharacterStateSelectors({
  data: successionArchiveData,
  archive: successionArchive,
});
export const successionEvidenceGraph = createSuccessionEvidenceGraph(successionArchiveData);

export {
  successionArchiveData,
};

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
  getCharacterRoleProfile,
  getCharacterLifetimeTimeline,
  getCharacterDossier,
  getCharactersWithStateProfiles,
  getCharacterStateCoverageReport,
  searchCharactersByState,
} = successionCharacterStates;

export const searchSuccessionArchive = (query, options = {}) => {
  const limit = Number(options.limit) || 20;
  const baseResults = successionArchive.search(query, { ...options, limit });
  const allowCharacters = !options.types || options.types.includes('character');
  const stateResults = allowCharacters ? searchCharactersByState(query, { limit }) : [];
  const merged = new Map();
  for (const result of [...baseResults, ...stateResults]) {
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
