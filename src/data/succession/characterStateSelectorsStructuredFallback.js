import { createCharacterStateSelectors as createBaseCharacterStateSelectors } from './characterStateSelectors.js';

const freeze = (value) => Object.freeze(value);
const normalize = (value) => String(value || '').toLowerCase();

const deriveBodyCode = (record) => {
  const body = normalize(record.bodyState);
  if (/occup|possess|inhabit|host body/.test(body)) return 'occupied';
  if (/displac|body transfer|separated from/.test(body)) return 'displaced';
  if (/preserv|suspend|sealed body/.test(body)) return 'preserved';
  if (/no body|body absent|bodiless/.test(body)) return 'absent';
  if (/dead|deceased|corpse/.test(body) || record.life === 'dead') return 'deceased';
  if (/living body|alive/.test(body) || record.life === 'alive') return 'living';
  return 'unknown';
};

const deriveIdentityCode = (record, bodyStateCode) => {
  const consciousness = normalize(record.consciousnessState);
  const body = normalize(record.bodyState);
  if (/composite|merged identit|multiple identit|shared identit/.test(`${body} ${consciousness}`)) return 'composite';
  if (/possess|occupying|inhabit|taking over/.test(consciousness)) return 'possessing';
  if (/transfer|another body|other body|displac|migrat|reborn/.test(consciousness)) return 'transferred';
  if (bodyStateCode === 'living' && /own body|active/.test(consciousness)) return 'self';
  return 'unresolved';
};

const deriveConsciousnessCode = (record) => {
  const consciousness = normalize(record.consciousnessState);
  if (/suppress|submerged|overridden/.test(consciousness)) return 'suppressed';
  if (/unconscious|comatose|coma|asleep/.test(consciousness)) return 'unconscious';
  if (/displac|transfer|migrat/.test(consciousness)) return 'displaced';
  if (/active|conscious|own body|awake|another body|other body/.test(consciousness)) return 'active';
  if (/absent|no consciousness|ended/.test(consciousness) || record.life === 'dead') return 'absent';
  return 'unknown';
};

const structureDerivedState = (record) => {
  if (!record?.derived) return record;
  const bodyStateCode = deriveBodyCode(record);
  const identityStateCode = deriveIdentityCode(record, bodyStateCode);
  const consciousnessStateCode = deriveConsciousnessCode(record);
  return freeze({
    ...record,
    bodyStateCode,
    identityStateCode,
    consciousnessStateCode,
  });
};

export const createCharacterStateSelectors = (options) => {
  const base = createBaseCharacterStateSelectors(options);
  const getCharacterStateAtChapter = (characterId, chapter = null) => structureDerivedState(base.getCharacterStateAtChapter(characterId, chapter));
  const getCharacterCurrentState = (characterId) => structureDerivedState(base.getCharacterCurrentState(characterId));

  return freeze({
    ...base,
    getCharacterStateAtChapter,
    getCharacterCurrentState,
  });
};
