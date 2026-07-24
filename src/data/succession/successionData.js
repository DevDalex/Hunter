import { successionArchiveData } from './entitiesRelationshipFoundation.js';
import { createSuccessionEvidenceGraph } from './evidenceGraph.js';
import { buildSuccessionIndexes } from './indexes.js';
import { createSuccessionSelectors } from './selectors.js';
import { assertValidSuccessionArchiveData } from './schemas.js';

export const successionArchiveValidation = assertValidSuccessionArchiveData(successionArchiveData);
export const successionArchiveIndexes = buildSuccessionIndexes(successionArchiveData);
export const successionArchive = createSuccessionSelectors(successionArchiveData, successionArchiveIndexes);
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
  search: searchSuccessionArchive,
} = successionArchive;

export const {
  chapterProfiles: successionChapterEvidenceProfiles,
  getChapterEvidenceProfile,
  getEntityEvidenceProfile,
  getFoundationClosureReport,
  getEvidenceEntities,
} = successionEvidenceGraph;
