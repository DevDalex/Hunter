import { successionArchiveData } from './entities.js';
import { buildSuccessionIndexes } from './indexes.js';
import { createSuccessionSelectors } from './selectors.js';
import { assertValidSuccessionArchiveData } from './schemas.js';

export const successionArchiveValidation = assertValidSuccessionArchiveData(successionArchiveData);
export const successionArchiveIndexes = buildSuccessionIndexes(successionArchiveData);
export const successionArchive = createSuccessionSelectors(successionArchiveData, successionArchiveIndexes);

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
  getAppearancesForCharacter,
  getOrganizationMembers,
  getLocationChildren,
  getLocationBreadcrumbs,
  getRelationshipsForEntity,
  getAbilitiesForOwner,
  getLocationHistoryForCharacter,
  getLocationHistoryForLocation,
  getEntitiesAtLocation,
  getSourcesForEntity,
  getRelatedEntities,
  search: searchSuccessionArchive,
} = successionArchive;
