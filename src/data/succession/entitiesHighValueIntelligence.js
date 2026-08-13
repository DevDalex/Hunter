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

/* A consumed or deployed artifact remains part of the chapter-bounded archive
   after its physical state changes. The Guardian Spirit Beast eggs manifest by
   Chapter 359, but their historical record and custody chain remain queryable. */
const objects = freeze(phase4Objects.map((record) => record.id === 'object:guardian-spirit-beast-eggs'
  ? freeze({
    ...record,
    chapterRange: freeze({ start: record.chapterRange.start, end: null }),
  })
  : record));

const protocolRecords = freeze([
  ...phase4ProtocolRecords.filter((record) => !highValueIntelligence384Protocols.some((addition) => addition.id === record.id)),
  ...highValueIntelligence384Protocols,
]);

/* Keep canonical ability entities singular while allowing their latest metadata
   to point readers toward chapter-bounded knowledge layers. */
const abilities = freeze((phase4PredecessorData.abilities || []).map((record) => record.id === 'ability:secret-window'
  ? freeze({
    ...record,
    latestChapter: Math.max(Number(record.latestChapter || 0), 413),
    latestKnowledgeNote: 'Chapter 413 adds pre-death visual knowledge through the dedicated ability-knowledge history.',
    updatedAt: '2026-08-13',
  })
  : record));

const chiyamasi = chapter414CharacterData.characters.find((record) => record.id === 'character:chiyamasi');
const characters = freeze(uniqueById([
  ...(phase4PredecessorData.characters || []),
  ...(chiyamasi ? [chiyamasi] : []),
]));
const characterStateProfiles = mergeRecordMap(phase4PredecessorData.characterStateProfiles, characterState414CorrectionProfiles);
const abilityKnowledgeOverrides = mergeRecordMap(phase4PredecessorData.abilityKnowledgeOverrides, abilityKnowledge414Overrides);

/* Phase 4 promotes previously scattered intelligence into the canonical graph
   without replacing Phase 3's normalized people and state contracts. Chapter 414
   adds one newly maintained person node plus chapter-specific state/knowledge. */
export const successionArchiveData = freeze({
  ...phase4PredecessorData,
  characters,
  characterStateProfiles,
  abilities,
  abilityKnowledgeOverrides,
  knowledgeRecords: phase4KnowledgeRecords,
  protocolRecords,
  objects,
  documents: phase4Documents,
  evidenceItems: phase4EvidenceItems,
  editorialChangeLog: phase4EditorialChangeLog,
  highValueIntelligenceVersion: 'phase-4-v1',
});
