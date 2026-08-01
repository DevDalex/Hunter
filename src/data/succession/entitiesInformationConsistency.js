import { successionArchiveData as predecessorData } from './entitiesProductClosureCorrections.js';
import {
  normalizeCharacterEntity,
  normalizeCharacterStateRecord,
} from './informationConsistency.js';

/* Phase 3 is a compatibility-preserving data layer. It keeps every canonical
   entity, stable ID, chapter boundary, and legacy display sentence while adding
   structured state codes, normalized aliases, canonical role tokens, and an
   explicit version marker for downstream validation.

   Historical state records must use their chapter-local life value. A current
   character summary such as "dead" cannot retroactively turn an earlier living
   record into a deceased body.

   Halkenburg's legacy mother field combines two different relationships. The
   normalized entity records Unma as biological mother, Duazul as the queen who
   raised him, and retains the original composite wording for display/audit use. */
const normalizeRoyalLineage = (character) => {
  const normalized = normalizeCharacterEntity(character);
  if (normalized.id !== 'character:halkenburg-hui-guo-rou') return normalized;
  return Object.freeze({
    ...normalized,
    royalMotherDisplay: normalized.royalMother,
    royalMother: 'Unma Hui Guo Rou',
    royalRaisedBy: 'Duazul Hui Guo Rou',
    royalLineage: Object.freeze([
      Object.freeze({ relationship: 'biological-mother', characterId: 'character:unma-hui-guo-rou' }),
      Object.freeze({ relationship: 'raised-by', characterId: 'character:duazul-hui-guo-rou' }),
    ]),
  });
};

const characters = Object.freeze((predecessorData.characters || []).map(normalizeRoyalLineage));
const characterById = new Map(characters.map((character) => [character.id, character]));
const characterStateProfiles = Object.freeze(Object.fromEntries(
  Object.entries(predecessorData.characterStateProfiles || {}).map(([characterId, records]) => {
    const character = characterById.get(characterId);
    return [characterId, Object.freeze((records || []).map((record) => {
      const boundaryCharacter = character
        ? Object.freeze({
          ...character,
          status: Object.freeze({
            ...(character.status || {}),
            life: record.life || character.status?.life || 'unknown',
          }),
        })
        : character;
      return normalizeCharacterStateRecord(record, boundaryCharacter);
    }))];
  }),
));

export const successionArchiveData = Object.freeze({
  ...predecessorData,
  characters,
  characterStateProfiles,
  informationConsistencyVersion: 'phase-3-v1',
});
