import { successionArchiveData as relationshipFoundationData } from './entitiesRelationshipFoundation.js';
import { characterStateProfiles } from './characterStateFoundation.js';
import { characterStateExpansionProfiles } from './characterStateExpansion.js';
import { characterStateRoyalExpansionProfiles } from './characterStateRoyalExpansion.js';
import { characterStateInstitutionExpansionProfiles } from './characterStateInstitutionExpansion.js';
import { characterStatusKnowledge } from './characterStatusKnowledge.js';

const characterIds = new Set([
  ...Object.keys(characterStateProfiles),
  ...Object.keys(characterStateExpansionProfiles),
  ...Object.keys(characterStateRoyalExpansionProfiles),
  ...Object.keys(characterStateInstitutionExpansionProfiles),
]);

const mergedCharacterStateProfiles = Object.freeze(Object.fromEntries(
  [...characterIds].map((characterId) => [
    characterId,
    Object.freeze([
      ...(characterStateProfiles[characterId] || []),
      ...(characterStateExpansionProfiles[characterId] || []),
      ...(characterStateRoyalExpansionProfiles[characterId] || []),
      ...(characterStateInstitutionExpansionProfiles[characterId] || []),
    ].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id))),
  ]),
));

export const successionArchiveData = Object.freeze({
  ...relationshipFoundationData,
  characterStateProfiles: mergedCharacterStateProfiles,
  characterStatusKnowledge,
});
