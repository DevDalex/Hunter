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
import { successionArchiveData as chapter414CharacterData } from './entitiesCharacter414Bridge.js';
import { characterState414CorrectionProfiles } from './characterState414Corrections.js';
import { characterState415CorrectionProfiles } from './characterState415Corrections.js';
import { abilityKnowledge414Overrides } from './nenSystemFoundation414Corrections.js';
import { abilityKnowledge415Overrides } from './nenSystemFoundation415Corrections.js';

const freeze = (value) => Object.freeze(value);
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const mergeRecordMap = (baseMap = {}, additionMap = {}) => freeze(Object.fromEntries(
  [...new Set([...Object.keys(baseMap), ...Object.keys(additionMap)])].map((key) => {
    const records = new Map((baseMap[key] || []).map((record) => [record.id, record]));
    for (const addition of additionMap[key] || []) records.set(addition.id, addition);
    return [key, freeze([...records.values()].sort((left, right) => (left.chapterRange?.start || 0) - (right.chapterRange?.start || 0) || left.id.localeCompare(right.id)))];
  }),
));

const objects = freeze(phase4Objects.map((record) => record.id === 'object:guardian-spirit-beast-eggs'
  ? freeze({ ...record, chapterRange: freeze({ start: record.chapterRange.start, end: null }) })
  : record));

const protocolRecords = freeze([
  ...phase4ProtocolRecords.filter((record) => !highValueIntelligence384Protocols.some((addition) => addition.id === record.id)),
  ...highValueIntelligence384Protocols,
]);

const abilities = freeze((phase4PredecessorData.abilities || []).map((record) => {
  if (record.id === 'ability:secret-window') return freeze({
    ...record,
    latestChapter: Math.max(Number(record.latestChapter || 0), 413),
    latestKnowledgeNote: 'Chapter 413 adds pre-death visual knowledge through the dedicated ability-knowledge history.',
    updatedAt: '2026-08-13',
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
  return record;
}));

const chiyamasi = chapter414CharacterData.characters.find((record) => record.id === 'character:chiyamasi');
const characters = freeze(uniqueById([
  ...(phase4PredecessorData.characters || []),
  ...(chiyamasi ? [chiyamasi] : []),
]));

const normalizedState414 = freeze(Object.fromEntries(Object.entries(characterState414CorrectionProfiles).map(([characterId, records]) => [
  characterId,
  freeze(records.map((record) => freeze({ ...record, loyaltyStateCode: record.loyaltyStateCode || 'operative' }))),
])));
const normalizedState415 = freeze(Object.fromEntries(Object.entries(characterState415CorrectionProfiles).map(([characterId, records]) => [
  characterId,
  freeze(records.map((record) => freeze({ ...record, loyaltyStateCode: record.loyaltyStateCode || 'operative' }))),
])));
const characterStateProfiles414 = mergeRecordMap(phase4PredecessorData.characterStateProfiles, normalizedState414);
const characterStateProfiles = mergeRecordMap(characterStateProfiles414, normalizedState415);
const abilityKnowledgeOverrides414 = mergeRecordMap(phase4PredecessorData.abilityKnowledgeOverrides, abilityKnowledge414Overrides);
const abilityKnowledgeOverrides = mergeRecordMap(abilityKnowledgeOverrides414, abilityKnowledge415Overrides);

const relationshipShape = Object.freeze({
  'relationship:luzurus-ridge-ch414-delay-kanjidol': ['professional', 'protective-command-delay', 'allied', 'active-cooperation'],
  'relationship:ridge-kanjidol-ch414-unresolved-confrontation': ['hostile', 'unresolved-confrontation', 'hostile', 'unresolved'],
  'relationship:chiyamasi-yushohi-ch414-muteking-support': ['professional', 'operational-support', 'allied', 'active-cooperation'],
  'relationship:bill-kurapika-ch414-beyond-planning': ['professional', 'strategic-planning', 'allied', 'active-cooperation'],
  'relationship:oito-kurapika-ch414-yamato-trust': ['professional', 'trust-and-contingency-cooperation', 'allied', 'active-cooperation'],
  'relationship:furykov-beyond-ch415-curse-interrogation': ['hostile', 'curse-interrogation', 'hostile', 'unresolved'],
  'relationship:oito-kurapika-ch415-coded-contact': ['professional', 'coded-contact-operation', 'allied', 'active-cooperation'],
  'relationship:kurapika-babimyna-ch415-postcard-handoff': ['professional', 'controlled-mail-handoff', 'neutral', 'active-cooperation'],
  'relationship:rihan-tubeppa-ch415-relocation-order': ['authority', 'coercive-relocation-order', 'hostile', 'active'],
  'relationship:ridge-kanjidol-ch415-custody-state': ['hostile', 'post-confrontation-custody', 'hostile', 'unresolved'],
  'relationship:seiko-fugetsu-ch415-protective-order': ['family', 'protective-confinement-instruction', 'allied', 'active'],
  'relationship:biscuit-vergei-ch415-hold-space': ['professional', 'defensive-coordination', 'allied', 'active-cooperation'],
  'relationship:babimyna-oito-ch415-confinement': ['authority', 'legal-custody-notice', 'neutral', 'active'],
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
