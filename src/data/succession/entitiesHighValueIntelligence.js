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
import { abilityKnowledge414Overrides } from './nenSystemFoundation414Corrections.js';

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
const characterStateProfiles = mergeRecordMap(phase4PredecessorData.characterStateProfiles, normalizedState414);
const abilityKnowledgeOverrides = mergeRecordMap(phase4PredecessorData.abilityKnowledgeOverrides, abilityKnowledge414Overrides);

const relationship414Ids = new Set([
  'relationship:luzurus-ridge-ch414-delay-kanjidol',
  'relationship:ridge-kanjidol-ch414-unresolved-confrontation',
  'relationship:chiyamasi-yushohi-ch414-muteking-support',
  'relationship:bill-kurapika-ch414-beyond-planning',
  'relationship:oito-kurapika-ch414-yamato-trust',
]);
const relationship414Shape = Object.freeze({
  'relationship:luzurus-ridge-ch414-delay-kanjidol': ['professional', 'protective-command-delay', 'allied', 'active-cooperation'],
  'relationship:ridge-kanjidol-ch414-unresolved-confrontation': ['hostile', 'unresolved-confrontation', 'hostile', 'unresolved'],
  'relationship:chiyamasi-yushohi-ch414-muteking-support': ['professional', 'operational-support', 'allied', 'active-cooperation'],
  'relationship:bill-kurapika-ch414-beyond-planning': ['professional', 'strategic-planning', 'allied', 'active-cooperation'],
  'relationship:oito-kurapika-ch414-yamato-trust': ['professional', 'trust-and-contingency-cooperation', 'allied', 'active-cooperation'],
});
const relationships = freeze((phase4PredecessorData.relationships || []).map((record) => {
  if (!relationship414Ids.has(record.id)) return record;
  const [relationshipType, subtype, sentiment, status] = relationship414Shape[record.id];
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
