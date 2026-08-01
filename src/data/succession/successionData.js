import { successionArchiveData } from './entitiesHighValueIntelligence.js';
import { successionArchiveData as productClosureLineage } from './entitiesProductClosureCorrections.js';
import { successionArchiveData as storyFoundationLineage } from './entitiesStoryIntelligenceFoundation.js';
// Active predecessor chain: entitiesHighValueIntelligence.js -> entitiesInformationConsistency.js -> entitiesProductClosureCorrections.js -> entitiesProductClosureFoundation.js -> entitiesStoryIntelligenceFoundation.js -> entitiesNenSystemFoundation.js -> entitiesOrganizationFoundation.js.
import { createSuccessionEvidenceGraph } from './evidenceGraph.js';
import { createEventKnowledgeSelectors } from './eventKnowledgeSelectors.js';
import { createHighValueIntelligenceSelectors } from './highValueIntelligenceSelectors.js';
import { buildSuccessionIndexes } from './indexesFinal.js';
import { createSuccessionSelectors } from './selectors.js';
import { createCharacterStateSelectors } from './characterStateSelectors.js';
import { createInformationConsistencySelectors } from './informationConsistency.js';
import { createOrganizationStateSelectors } from './organizationStateSelectors.js';
import { createPeopleInstitutionClosure } from './peopleInstitutionClosure.js';
import { createNenSystemSelectors } from './nenSystemSelectors.js';
import { createStoryIntelligenceSelectors } from './storyIntelligenceSelectors.js';
import { createProductClosureSelectors as createFinalProductClosureSelectors } from './productClosureSelectorsFinal.js';
import { createProductClosureSelectors } from './productClosureSelectorsPhase4.js';
import { createFinalReleaseClosure } from './finalReleaseClosure.js';
import { assertValidSuccessionArchiveData } from './schemasFinal.js';

const informationConsistencyLineage = Object.freeze({
  correctedProductChapterCount: productClosureLineage.chapters.length,
  storyPhaseCount: Object.keys(storyFoundationLineage.storyPhaseProfiles || {}).length,
  highValueIntelligenceVersion: successionArchiveData.highValueIntelligenceVersion,
  finalStorySearchAdapterAvailable: typeof createFinalProductClosureSelectors === 'function',
});
if (informationConsistencyLineage.correctedProductChapterCount !== successionArchiveData.chapters.length
  || informationConsistencyLineage.storyPhaseCount === 0
  || informationConsistencyLineage.highValueIntelligenceVersion !== 'phase-4-v1'
  || !informationConsistencyLineage.finalStorySearchAdapterAvailable) {
  throw new Error('Succession high-value intelligence predecessor chain is incomplete.');
}

export const successionArchiveValidation = assertValidSuccessionArchiveData(successionArchiveData);
export const successionArchiveIndexes = buildSuccessionIndexes(successionArchiveData);
export const successionArchive = createSuccessionSelectors(successionArchiveData, successionArchiveIndexes);
export const successionCharacterStates = createCharacterStateSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionInformationConsistency = createInformationConsistencySelectors({ data: successionArchiveData, archive: successionArchive, characterStates: successionCharacterStates });
export const successionOrganizationStates = createOrganizationStateSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionPeopleInstitutionClosure = createPeopleInstitutionClosure({ data: successionArchiveData, archive: successionArchive, characterStates: successionCharacterStates, organizationStates: successionOrganizationStates });
export const successionNenSystems = createNenSystemSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionEventKnowledge = createEventKnowledgeSelectors({ data: successionArchiveData, archive: successionArchive });
export const successionStoryIntelligence = createStoryIntelligenceSelectors({ data: successionArchiveData, archive: successionArchive, eventKnowledge: successionEventKnowledge });
export const successionHighValueIntelligence = createHighValueIntelligenceSelectors({
  data: successionArchiveData,
  archive: successionArchive,
  characterStates: successionCharacterStates,
  organizationStates: successionOrganizationStates,
  nenSystems: successionNenSystems,
  eventKnowledge: successionEventKnowledge,
  informationConsistency: successionInformationConsistency,
});
export const successionProductClosure = createProductClosureSelectors({ data: successionArchiveData, archive: successionArchive, characterStates: successionCharacterStates, organizationStates: successionOrganizationStates, nenSystems: successionNenSystems, storyIntelligence: successionStoryIntelligence });
export const successionEvidenceGraph = createSuccessionEvidenceGraph(successionArchiveData);
export const successionFinalReleaseClosure = createFinalReleaseClosure({ data: successionArchiveData, validation: successionArchiveValidation, evidenceGraph: successionEvidenceGraph, peopleClosure: successionPeopleInstitutionClosure, nenSystems: successionNenSystems, storyIntelligence: successionStoryIntelligence, productClosure: successionProductClosure });

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
  getCanonicalCharacterState,
  getCharacterAuthorityProfile,
  getCharacterLoyaltyProfile,
  getRoyalDossierConsistencyProfile,
  getAliasResolution,
  getInformationConsistencyReport,
} = successionInformationConsistency;

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

export const {
  getStoryEventKnowledgeAtChapter,
  getStoryEventsKnownAtChapter,
} = successionEventKnowledge;

export const {
  getStoryPhaseProfile,
  getStoryPhaseAtChapter,
  getStoryPhaseDossier,
  getStoryLaneProfile,
  getStoryLanesAtChapter,
  getStoryLaneDossier,
  getStoryThreadProfile,
  getStoryThreadDossier,
  getStoryThreadsAtChapter,
  getStoryCausalLink,
  getStoryCausalLinksAtChapter,
  getStoryCausalGraphAtChapter,
  getChapterStoryDossier,
  getStorySnapshotAtChapter,
  searchStoryIntelligence,
  getStoryIntelligenceClosureReport,
} = successionStoryIntelligence;

export const {
  getEntityStateAtChapter,
  getChapterStateDiff,
  getKnowledgeRecord,
  getKnowledgeRecordsAtChapter,
  getKnowledgeForEntity,
  getKnowledgeMatrix,
  getProtocolRecord,
  getProtocolRecordsAtChapter,
  getArtifactRecord,
  getArtifactsAtChapter,
  getEvidenceForArtifact,
  compareSameTypeRecords,
  getEditorialChangeLog,
  getIntelligenceWorkbenchSummary,
} = successionHighValueIntelligence;

export const {
  getGlossaryEntry,
  getGlossaryEntryAtChapter,
  getGlossaryEntriesAtChapter,
  getMediaRecord,
  getMediaRecordsAtChapter,
  searchArchiveProduct,
  getProductClosureReport,
} = successionProductClosure;

export const { getFinalReleaseClosureReport } = successionFinalReleaseClosure;

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
  const sourceChapters = (entity.sourceIds || []).map((sourceId) => getEntityById(sourceId)?.chapter).filter(Number.isFinite);
  const contextualChapters = [];
  if (entity.entityType === 'character') {
    contextualChapters.push(...getAppearancesForCharacter(entity.id).map((record) => record.chapter));
    contextualChapters.push(...(successionArchiveData.characterStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
  }
  if (entity.entityType === 'organization') {
    contextualChapters.push(...getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
    contextualChapters.push(...(successionArchiveData.organizationStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
  }
  if (entity.entityType === 'location') contextualChapters.push(...getEventsAtLocation(entity.id).map((event) => event.chapterRange.start));
  const firstChapter = earliestChapter([...sourceChapters, ...contextualChapters]);
  return firstChapter === null || firstChapter <= parsedChapter;
};

export const searchSuccessionArchive = (query, options = {}) => {
  const limit = Number(options.limit) || 20;
  const chapter = Number.isFinite(Number(options.chapter)) ? Number(options.chapter) : successionArchiveData.chapters.at(-1)?.number;
  return searchArchiveProduct(query, { chapter, limit: Math.max(limit, 100), types: options.types || null })
    .filter((result) => result.resultType === 'entity')
    .slice(0, limit)
    .map((result) => Object.freeze({ entity: result.entity, score: result.score, matchReason: result.matchReason }));
};

export const {
  chapterProfiles: successionChapterEvidenceProfiles,
  getChapterEvidenceProfile,
  getEntityEvidenceProfile,
  getFoundationClosureReport,
  getEvidenceEntities,
} = successionEvidenceGraph;
