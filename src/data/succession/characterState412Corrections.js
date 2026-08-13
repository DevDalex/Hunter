import { characterState412CorrectionProfilesBase } from './characterState412CorrectionsBase.js';
import { characterState413CorrectionProfiles } from './characterState413Corrections.js';

const keys = new Set([
  ...Object.keys(characterState412CorrectionProfilesBase),
  ...Object.keys(characterState413CorrectionProfiles),
]);

export const characterState412CorrectionProfiles = Object.freeze(Object.fromEntries(
  [...keys].map((characterId) => [characterId, Object.freeze([
    ...(characterState412CorrectionProfilesBase[characterId] || []),
    ...(characterState413CorrectionProfiles[characterId] || []),
  ])]),
));
