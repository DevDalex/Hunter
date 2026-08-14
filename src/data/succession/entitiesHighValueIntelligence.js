import {
  phase4Documents,
  phase4EditorialChangeLog,
  phase4EvidenceItems,
  phase4KnowledgeRecords,
  phase4Objects,
  phase4PredecessorData,
  phase4ProtocolRecords,
} from './highValueIntelligenceFoundation.js';
import { highValueIntelligence384Protocols } from './highValueIntelligence384Expansion.js';
import { successionArchiveData as chapter416CharacterData } from './entitiesCharacter416Bridge.js';
import { abilityFoundation417Expansion } from './abilityFoundation417Expansion.js';
import { characterState414CorrectionProfiles } from './characterState414Corrections.js';
import { characterState415CorrectionProfiles } from './characterState415Corrections.js';
import { characterState416CorrectionProfiles } from './characterState416Corrections.js';
import { characterState417CorrectionProfiles } from './characterState417Corrections.js';
import { abilityKnowledge414Overrides } from './nenSystemFoundation414Corrections.js';
import { abilityKnowledge415Overrides } from './nenSystemFoundation415Corrections.js';
import { abilityKnowledge416Overrides } from './nenSystemFoundation416Corrections.js';
import { abilityKnowledge417Overrides } from './nenSystemFoundation417Corrections.js';

const freeze = (value) => Object.freeze(value);
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const mergeRecordMap = (baseMap = {}, additionMap = {}) => freeze(Object.fromEntries(
  [...new Set([...Object.keys(baseMap), ...Object.keys(additionMap)])].map((key) => {
    const records = new Map((baseMap[key] || []).map((record) => [record.id, record]));
    for (const addition of additionMap[key] || []) records.set(addition.id, addition);
    return [key, freeze([...records.values()].sort((left, right) => (left.chapterRange?.start || 0) - (right.chapterRange?.start || 0) || left.id.localeCompare(right.id)))];
  }),
));
const closeSupersededStateRanges = (baseMap = {}, additionMap = {}, nextChapter) => freeze(Object.fromEntries(
  Object.entries(baseMap).map(([characterId, records]) => {
    if (!(additionMap[characterId] || []).length) return [characterId, records];
    return [characterId, freeze(records.map((record) => {
      const start = Number(record.chapterRange?.start || 0);
      const end = record.chapterRange?.end;
      if (start < nextChapter && (end === null || end === undefined || Number(end) >= nextChapter)) {
        return freeze({ ...record, chapterRange: freeze({ ...record.chapterRange, end: nextChapter - 1 }) });
      }
      return record;
    }))];
  }),
));

const objects = freeze(phase4Objects.map((record) => record.id === 'object:guardian-spirit-beast-eggs'
  ? freeze({ ...record, chapterRange: freeze({ start: record.chapterRange.start, end: null }) })
  : record));

const protocolRecords = freeze([
  ...phase4ProtocolRecords.filter((record) => !highValueIntelligence384Protocols.some((addition) => addition.id === record.id)),
  ...highValueIntelligence384Protocols,
]);

const hellFruit = abilityFoundation417Expansion.find((record) => record.id === 'ability:dust-in-the-wind-hell-fruit');
const gypsyLife = abilityFoundation417Expansion.find((record) => record.id === 'ability:gypsy-life-bohemian-rhapsody');
const abilities = freeze(uniqueById([
  ...(phase4PredecessorData.abilities || []).map((record) => {
    if (record.id === 'ability:secret-window') return freeze({
      ...record,
      latestChapter: 417,
      latestKnowledgeNote: 'Chapter 417 confirms Benjamin actively uses inherited Secret Window to observe Camilla contacting the medical department.',
      updatedAt: '2026-08-14',
    });
    if (record.id === 'ability:muteking') return freeze({
      ...record,
      classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'confirmed' }),
      firstChapter: 414,
      latestChapter: 414,
      status: 'introduced',
      researchStatus: 'activation and accumulating protection confirmed / complete mechanics unresolved',
      updatedAt: '2026-08-13',
    });
    if (record.id === 'ability:combo-master') return freeze({
      ...record,
      latestChapter: 415,
      status: 'demonstrated',
      researchStatus: 'Chapter 415 conjured interface and curse-analysis functions demonstrated / complete mechanics unresolved',
      latestKnowledgeNote: 'Chapter 415 demonstrates curse detection, linked-cursee silhouette, investigation functions, and curse-specific 365-day deciphering plus approximately 700-day antidote-development estimates.',
      updatedAt: '2026-08-14',
    });
    if (record.id === 'ability:cats-name') return freeze({
      ...record,
      latestChapter: 416,
      researchStatus: 'core counteractive revival mechanics confirmed / disease and indirect-killer edge conditions unresolved through Chapter 417 publication ceiling',
      latestKnowledgeNote: 'Chapter 417 does not resolve Cat’s Name versus TSK-17; Camilla remains alive and contacts the medical department while Benjamin surveils her.',
      updatedAt: '2026-08-14',
    });
    if (record.id === 'ability:benjamin-baton') return freeze({
      ...record,
      latestChapter: 417,
      researchStatus: 'core loyal-soldier inheritance confirmed / Gypsy Life post-death fusion interaction revealed / future transfer unobserved',
      latestKnowledgeNote: 'Chapter 417 reveals that Gypsy Life fuses with Benjamin Baton after Benjamin’s death before Guardian Spirit Beast transfer to a blood relative.',
      updatedAt: '2026-08-14',
    });
    return record;
  }),
  ...(hellFruit ? [hellFruit] : []),
  ...(gypsyLife ? [gypsyLife] : []),
]));

const chiyamasi = chapter416CharacterData.characters.find((record) => record.id === 'character:chiyamasi');
const saquelle = chapter416CharacterData.characters.find((record) => record.id === 'character:saquelle');
const mozbe = chapter416CharacterData.characters.find((record) => record.id === 'character:mozbe');
const characters = freeze(uniqueById([
  ...(phase4PredecessorData.characters || []),
  ...(chiyamasi ? [chiyamasi] : []),
  ...(saquelle ? [saquelle] : []),
  ...(mozbe ? [mozbe] : []),
]));

const normalizeStates = (profiles) => freeze(Object.fromEntries(Object.entries(profiles).map(([characterId, records]) => [
  characterId,
  freeze(records.map((record) => freeze({ ...record, loyaltyStateCode: record.loyaltyStateCode || 'operative' }))),
])));
const normalizedState414 = normalizeStates(characterState414CorrectionProfiles);
const normalizedState415 = normalizeStates(characterState415CorrectionProfiles);
const normalizedState416 = normalizeStates(characterState416CorrectionProfiles);
const normalizedState417 = normalizeStates(characterState417CorrectionProfiles);
const characterStateProfiles414 = mergeRecordMap(phase4PredecessorData.characterStateProfiles, normalizedState414);
const characterStateProfiles414Closed = closeSupersededStateRanges(characterStateProfiles414, normalizedState415, 415);
const characterStateProfiles415 = mergeRecordMap(characterStateProfiles414Closed, normalizedState415);
const characterStateProfiles415Closed = closeSupersededStateRanges(characterStateProfiles415, normalizedState416, 416);
const characterStateProfiles416 = mergeRecordMap(characterStateProfiles415Closed, normalizedState416);
const characterStateProfiles416Closed = closeSupersededStateRanges(characterStateProfiles416, normalizedState417, 417);
const characterStateProfiles = mergeRecordMap(characterStateProfiles416Closed, normalizedState417);
const abilityKnowledgeOverrides414 = mergeRecordMap(phase4PredecessorData.abilityKnowledgeOverrides, abilityKnowledge414Overrides);
const abilityKnowledgeOverrides415 = mergeRecordMap(abilityKnowledgeOverrides414, abilityKnowledge415Overrides);
const abilityKnowledgeOverrides416 = mergeRecordMap(abilityKnowledgeOverrides415, abilityKnowledge416Overrides);
const abilityKnowledgeOverrides = mergeRecordMap(abilityKnowledgeOverrides416, abilityKnowledge417Overrides);

const relationshipShape = Object.freeze({
  'relationship:luzurus-ridge-ch414-delay-kanjidol': ['professional', 'protective-command-delay', 'allied', 'active-cooperation'],
  'relationship:ridge-kanjidol-ch414-unresolved-confrontation': ['hostile', 'unresolved-confrontation', 'hostile', 'unresolved'],
  'relationship:chiyamasi-yushohi-ch414-muteking-support': ['professional', 'operational-support', 'allied', 'active-cooperation'],
  'relationship:bill-kurapika-ch414-beyond-planning': ['professional', 'strategic-planning', 'allied', 'active-cooperation'],
  'relationship:oito-kurapika-ch414-yamato-trust': ['professional', 'trust-and-contingency-cooperation', 'allied', 'active-cooperation'],
  'relationship:furykov-beyond-ch415-curse-interrogation': ['hostile', 'curse-interrogation', 'hostile', 'unresolved'],
  'relationship:oito-kurapika-ch415-coded-contact': ['professional', 'coded-contact-operation', 'allied', 'active-cooperation'],
  'relationship:kurapika-babimyna-ch415-postcard-handoff': ['professional', 'controlled-mail-handoff', 'neutral', 'active-cooperation'],
  'relationship:rihan-tubeppa-ch415-relocation-order': ['command', 'coercive-relocation-order', 'hostile', 'active'],
  'relationship:ridge-kanjidol-ch415-custody-state': ['hostile', 'post-confrontation-custody', 'hostile', 'unresolved'],
  'relationship:seiko-fugetsu-ch415-protective-order': ['family', 'protective-confinement-instruction', 'allied', 'active'],
  'relationship:biscuit-vergei-ch415-hold-space': ['professional', 'defensive-coordination', 'allied', 'active-cooperation'],
  'relationship:babimyna-oito-ch415-confinement': ['command', 'legal-custody-notice', 'neutral', 'active'],
  'relationship:benjamin-camilla-ch416-armed-confrontation': ['hostile', 'armed-royal-confrontation', 'hostile', 'active'],
  'relationship:moswana-benjamin-ch416-hell-fruit': ['hostile', 'post-mortem-assassination-curse', 'hostile', 'activated'],
  'relationship:camilla-moswana-ch416-ten-year-plan': ['alliance', 'curse-operation-cooperation', 'allied', 'completed'],
  'relationship:benjamin-furykov-ch416-assault-command': ['command', 'martial-law-assault-command', 'allied', 'active'],
  'relationship:benjamin-butch-ch416-assault-command': ['command', 'martial-law-assault-command', 'allied', 'active'],
  'relationship:tserriednich-salkov-ch416-staged-death': ['command', 'secret-staged-death-contingency', 'allied', 'unresolved'],
  'relationship:benjamin-danjin-ch416-questioning-order': ['command', 'custody-and-questioning-order', 'hostile', 'active'],
  'relationship:benjamin-tserriednich-ch416-shooting': ['hostile', 'room-1004-shooting', 'hostile', 'unresolved'],
  'relationship:benjamin-salkov-ch417-testimony-custody': ['command', 'coercive-testimony-and-custody', 'hostile', 'active'],
  'relationship:benjamin-danjin-ch417-detention': ['command', 'justice-detention', 'hostile', 'active'],
  'relationship:benjamin-tubeppa-ch417-tsk17-control': ['hostile', 'tsk17-and-inspection-control', 'hostile', 'active'],
  'relationship:benjamin-tyson-ch417-tsk17-control': ['hostile', 'tsk17-and-inspection-control', 'hostile', 'active'],
  'relationship:benjamin-balsamilco-ch417-first-unit-reactivation': ['command', 'first-unit-reactivation', 'allied', 'active'],
  'relationship:benjamin-coventoba-ch417-first-unit-reactivation': ['command', 'coin-and-first-unit-command', 'allied', 'active'],
  'relationship:balsamilco-halkenburg-ch417-feather-investigation': ['hostile', 'counterintelligence-investigation', 'hostile', 'active'],
  'relationship:benjamin-camilla-ch417-surveillance-framing': ['hostile', 'surveillance-and-framing-plan', 'hostile', 'active'],
  'relationship:benjamin-unma-ch417-planned-confrontation': ['hostile', 'planned-dynastic-confrontation', 'hostile', 'planned'],
  'relationship:benjamin-halkenburg-ch417-elimination-pressure': ['hostile', 'elimination-pressure', 'hostile', 'active'],
});
const relationshipIds = new Set(Object.keys(relationshipShape));
const relationships = freeze((phase4PredecessorData.relationships || []).map((record) => {
  if (!relationshipIds.has(record.id)) return record;
  const [relationshipType, subtype, sentiment, status] = relationshipShape[record.id];
  return freeze({
    ...record,
    sourceEntityId: record.sourceEntityId || record.fromId,
    targetEntityId: record.targetEntityId || record.toId,
    relationshipType,
    subtype,
    direction: record.direction || 'directed',
    sentiment,
    status,
    basis: record.basis || record.summary,
    operationalState: record.operationalState || record.summary,
    strength: record.strength || 'operational',
    certainty: 'confirmed',
    relatedEventIds: freeze(record.relatedEventIds || []),
    evidenceNotes: freeze(record.evidenceNotes || record.evidence || []),
    legacyIds: freeze(record.legacyIds || []),
  });
}));

export const successionArchiveData = freeze({
  ...phase4PredecessorData,
  characters,
  characterStateProfiles,
  abilities,
  abilityKnowledgeOverrides,
  relationships,
  knowledgeRecords: phase4KnowledgeRecords,
  protocolRecords,
  objects,
  documents: phase4Documents,
  evidenceItems: phase4EvidenceItems,
  editorialChangeLog: phase4EditorialChangeLog,
  highValueIntelligenceVersion: 'phase-4-v1',
});
