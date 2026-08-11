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
import { characterState400LegacySplits } from './characterState400LegacySplits.js';
import { characterState401CorrectionProfiles } from './characterState401Corrections.js';
import { characterState402LegacySplits } from './characterState402LegacySplits.js';
import { characterState402CorrectionProfiles } from './characterState402Corrections.js';
import { characterState403LegacySplits } from './characterState403LegacySplits.js';
import { characterState403CorrectionProfiles } from './characterState403Corrections.js';
import { characterState404LegacySplits } from './characterState404LegacySplits.js';
import { characterState404CorrectionProfiles } from './characterState404Corrections.js';
import { characterState405CorrectionProfiles } from './characterState405Corrections.js';
import { characterState406CorrectionProfiles } from './characterState406Corrections.js';
import { characterState407CorrectionProfiles } from './characterState407Corrections.js';
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
  ...Object.keys(characterState400LegacySplits),
  ...Object.keys(characterState401CorrectionProfiles),
  ...Object.keys(characterState402LegacySplits),
  ...Object.keys(characterState402CorrectionProfiles),
  ...Object.keys(characterState403LegacySplits),
  ...Object.keys(characterState403CorrectionProfiles),
  ...Object.keys(characterState404LegacySplits),
  ...Object.keys(characterState404CorrectionProfiles),
  ...Object.keys(characterState405CorrectionProfiles),
  ...Object.keys(characterState406CorrectionProfiles),
  ...Object.keys(characterState407CorrectionProfiles),
]);

const retiredStateIds = new Set(['character-state:chrollo-lucilfer:379']);

const normalizeStateRecord = (record) => {
  if (record.id === 'character-state:borksen:408') return Object.freeze({ ...record, chapterRange: Object.freeze({ ...record.chapterRange, end: 409 }) });
  if (record.id === 'character-state:kurapika:358') return Object.freeze({ ...record, chapterRange: Object.freeze({ ...record.chapterRange, end: 399 }), sourceIds: Object.freeze((record.sourceIds || []).filter((sourceId) => sourceId !== 'source:chapter-400')) });
  return record;
};

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
    characterState400LegacySplits,
    characterState401CorrectionProfiles,
    characterState402LegacySplits,
    characterState402CorrectionProfiles,
    characterState403LegacySplits,
    characterState403CorrectionProfiles,
    characterState404LegacySplits,
    characterState404CorrectionProfiles,
    characterState405CorrectionProfiles,
    characterState406CorrectionProfiles,
    characterState407CorrectionProfiles,
  ]) {
    for (const record of layer[characterId] || []) {
      if (retiredStateIds.has(record.id)) continue;
      records.set(record.id, normalizeStateRecord(record));
    }
  }
  return Object.freeze([...records.values()].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id)));
};

const mergedCharacterStateProfiles = Object.freeze(Object.fromEntries([...characterIds].map((characterId) => [characterId, mergeCharacterRecords(characterId)])));

export const successionArchiveData = Object.freeze({ ...relationshipFoundationData, characterStateProfiles: mergedCharacterStateProfiles, characterStatusKnowledge });
