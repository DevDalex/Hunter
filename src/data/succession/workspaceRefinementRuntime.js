import {
  successionArchiveData,
  getEntityById,
  getEntitiesByType,
  getLocationBreadcrumbs,
  getActiveRelationshipsAtChapter,
  getSourcesForEntity,
  getLocationSnapshot,
  getEventsAtLocation,
  getAssignmentsAtLocation,
  getCurrentLocationRecordForCharacter,
  getEventsForAbility,
  getLocationsForAbility,
  getChapterStoryDossier,
  getChapterStateDiff,
  getAbilityKnowledgeAtChapter,
} from './successionData.js';
import { createWorkspaceRefinementSelectors } from './workspaceRefinementSelectors.js';

const archiveAdapter = Object.freeze({
  getEntityById,
  getEntitiesByType,
  getLocationBreadcrumbs,
  getActiveRelationshipsAtChapter,
  getSourcesForEntity,
  getLocationSnapshot,
  getEventsAtLocation,
  getAssignmentsAtLocation,
  getCurrentLocationRecordForCharacter,
  getEventsForAbility,
  getLocationsForAbility,
});

const storyAdapter = Object.freeze({ getChapterStoryDossier });
const highValueAdapter = Object.freeze({ getChapterStateDiff });
const nenAdapter = Object.freeze({ getAbilityKnowledgeAtChapter });

export const successionWorkspaceRefinements = createWorkspaceRefinementSelectors({
  data: successionArchiveData,
  archive: archiveAdapter,
  storyIntelligence: storyAdapter,
  highValueIntelligence: highValueAdapter,
  nenSystems: nenAdapter,
});

export const {
  getChapterDeltaBrief,
  getFocusedRelationshipView,
  getBlackWhaleSnapshotComparison,
  getShipInfrastructureIndex,
  getAbilityInteractionMatrix,
  getClaimProvenanceProfile,
  getProvenanceCoverageReport,
  getGlossaryEnforcementReport,
  getWorkspaceRefinementSummary,
} = successionWorkspaceRefinements;
