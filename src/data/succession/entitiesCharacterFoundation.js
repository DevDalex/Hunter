import { successionArchiveData as relationshipFoundationData } from './entitiesRelationshipFoundation.js';
import { characterStateProfiles } from './characterStateFoundation.js';
import { characterStateExpansionProfiles } from './characterStateExpansion.js';
import { characterStateRoyalExpansionProfiles } from './characterStateRoyalExpansion.js';
import { characterStateInstitutionExpansionProfiles } from './characterStateInstitutionExpansion.js';
import { characterStateInstitutionClosureExpansionProfiles } from './characterStateInstitutionClosureExpansion.js';
import { characterState376CorrectionProfiles } from './characterState376Corrections.js';
import { characterState378CorrectionProfiles } from './characterState378Corrections.js';
import { characterState391CorrectionProfiles } from './characterState391Corrections.js';
import { characterState392CorrectionProfiles } from './characterState392Corrections.js';
import { characterState393CorrectionProfiles } from './characterState393Corrections.js';
import { characterState394CorrectionProfiles } from './characterState394Corrections.js';
import { characterState395CorrectionProfiles } from './characterState395Corrections.js';
import { characterState398CorrectionProfiles } from './characterState398Corrections.js';
import { characterState399CorrectionProfiles } from './characterState399Corrections.js';
import { characterState400CorrectionProfiles } from './characterState400Corrections.js';
import { characterStatusKnowledge } from './characterStatusKnowledge.js';

const characterIds = new Set([
  ...Object.keys(characterStateProfiles),
  ...Object.keys(characterStateExpansionProfiles),
  ...Object.keys(characterStateRoyalExpansionProfiles),
  ...Object.keys(characterStateInstitutionExpansionProfiles),
  ...Object.keys(characterStateInstitutionClosureExpansionProfiles),
  ...Object.keys(characterState376CorrectionProfiles),
  ...Object.keys(characterState378CorrectionProfiles),
  ...Object.keys(characterState391CorrectionProfiles),
  ...Object.keys(characterState392CorrectionProfiles),
  ...Object.keys(characterState393CorrectionProfiles),
  ...Object.keys(characterState394CorrectionProfiles),
  ...Object.keys(characterState395CorrectionProfiles),
  ...Object.keys(characterState398CorrectionProfiles),
  ...Object.keys(characterState399CorrectionProfiles),
  ...Object.keys(characterState400CorrectionProfiles),
]);

const retiredStateIds = new Set([
  'character-state:chrollo-lucilfer:379',
]);

const normalizeStateRecord = (record) => record.id === 'character-state:borksen:408'
  ? Object.freeze({
    ...record,
    chapterRange: Object.freeze({ ...record.chapterRange, end: 409 }),
  })
  : record;

const mergeCharacterRecords = (characterId) => {
  const records = new Map();
  for (const layer of [
    characterStateProfiles,
    characterStateExpansionProfiles,
    characterStateRoyalExpansionProfiles,
    characterStateInstitutionExpansionProfiles,
    characterStateInstitutionClosureExpansionProfiles,
    characterState376CorrectionProfiles,
    characterState378CorrectionProfiles,
    characterState391CorrectionProfiles,
    characterState392CorrectionProfiles,
    characterState393CorrectionProfiles,
    characterState394CorrectionProfiles,
    characterState395CorrectionProfiles,
    characterState398CorrectionProfiles,
    characterState399CorrectionProfiles,
    characterState400CorrectionProfiles,
  ]) {
    for (const record of layer[characterId] || []) {
      if (retiredStateIds.has(record.id)) continue;
      records.set(record.id, normalizeStateRecord(record));
    }
  }
  return Object.freeze([...records.values()]
    .sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id)));
};

const mergedCharacterStateProfiles = Object.freeze(Object.fromEntries(
  [...characterIds].map((characterId) => [characterId, mergeCharacterRecords(characterId)]),
));

export const successionArchiveData = Object.freeze({
  ...relationshipFoundationData,
  characterStateProfiles: mergedCharacterStateProfiles,
  characterStatusKnowledge,
});
