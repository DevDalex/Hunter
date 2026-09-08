import { successionArchiveData as baseData } from './entitiesHighValueIntelligence.js';
import { characterState419CorrectionProfiles } from './characterState419Corrections.js';
import { characterState420CorrectionProfiles } from './characterState420Corrections.js';
import { abilityKnowledge419Overrides } from './nenSystemFoundation419Corrections.js';
import { abilityKnowledge420Overrides } from './nenSystemFoundation420Corrections.js';
import { relationshipFoundation420Expansion } from './relationshipFoundation420Expansion.js';

const freeze = (value) => Object.freeze(value);
const uniqueById = (values = []) => [...new Map(values.map((value) => [value.id, value])).values()];
const mergeRecordMap = (baseMap = {}, additionMap = {}) => freeze(Object.fromEntries(
  [...new Set([...Object.keys(baseMap), ...Object.keys(additionMap)])].map((key) => {
    const records = new Map((baseMap[key] || []).map((record) => [record.id, record]));
    for (const addition of additionMap[key] || []) records.set(addition.id, addition);
    return [key, freeze([...records.values()].sort((left, right) => (left.chapterRange?.start || 0) - (right.chapterRange?.start || 0) || left.id.localeCompare(right.id)))];
  }),
));
const normalizeStates = (profiles = {}) => freeze(Object.fromEntries(Object.entries(profiles).map(([characterId, records]) => [
  characterId,
  freeze(records.map((record) => freeze({ ...record, loyaltyStateCode:record.loyaltyStateCode || 'operative' }))),
])));
const closeSupersededStateRanges = (baseMap = {}, additionMap = {}, nextChapter) => freeze(Object.fromEntries(
  Object.entries(baseMap).map(([characterId, records]) => {
    if (!(additionMap[characterId] || []).length) return [characterId, records];
    return [characterId, freeze(records.map((record) => {
      const start = Number(record.chapterRange?.start || 0);
      const end = record.chapterRange?.end;
      if (start < nextChapter && (end === null || end === undefined || Number(end) >= nextChapter)) {
        return freeze({ ...record, chapterRange:freeze({ ...record.chapterRange, end:nextChapter - 1 }) });
      }
      return record;
    }))];
  }),
));

const normalizedState419 = normalizeStates(characterState419CorrectionProfiles);
const normalizedState420 = normalizeStates(characterState420CorrectionProfiles);
const statesClosedFor419 = closeSupersededStateRanges(baseData.characterStateProfiles, normalizedState419, 419);
const statesThrough419 = mergeRecordMap(statesClosedFor419, normalizedState419);
const statesClosedFor420 = closeSupersededStateRanges(statesThrough419, normalizedState420, 420);
const characterStateProfiles = mergeRecordMap(statesClosedFor420, normalizedState420);

const knowledgeThrough419 = mergeRecordMap(baseData.abilityKnowledgeOverrides, abilityKnowledge419Overrides);
const abilityKnowledgeOverrides = mergeRecordMap(knowledgeThrough419, abilityKnowledge420Overrides);

const abilities = freeze((baseData.abilities || []).map((record) => {
  if (record.id !== 'ability:parallel-future') return record;
  return freeze({
    ...record,
    latestChapter:420,
    status:'demonstrated and materially expanded',
    researchStatus:'ten-second future sight plus sustained-Zetsu perception extension demonstrated / approximately 36-meter operating range, outsider-entry behavior, boundary deactivation, lethal-future divergence, and duration pressure documented / exact geometry, maximum duration, recharge formula, and Hisoka anomaly-detection mechanism unresolved',
    latestKnowledgeNote:'Chapter 420 shows Tserriednich applying the Chapter 419 range model to Hisoka, avoiding a predicted throat-slitting death, observing an unresolved Hisoka perception anomaly, setting a sub-one-second Zetsu activation goal, and reaching an exterior Tier 1 decision point under practical duration/recharge pressure.',
    updatedAt:'2026-09-09',
  });
}));

const relationships = freeze(uniqueById([
  ...(baseData.relationships || []),
  ...relationshipFoundation420Expansion,
]));

export const successionArchiveData = freeze({
  ...baseData,
  characterStateProfiles,
  abilityKnowledgeOverrides,
  abilities,
  relationships,
  contentDepthVersion:'content-depth-420-v1',
});
