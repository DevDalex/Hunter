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
   record into a deceased body. */
const characters = Object.freeze((predecessorData.characters || []).map(normalizeCharacterEntity));
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
