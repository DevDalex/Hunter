import { successionArchiveData as relationshipFoundationData } from './entitiesRelationshipFoundation.js';
import { characterStateProfiles } from './characterStateFoundation.js';

export const successionArchiveData = Object.freeze({
  ...relationshipFoundationData,
  characterStateProfiles,
});
