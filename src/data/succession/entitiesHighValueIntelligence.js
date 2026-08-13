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

/* A consumed or deployed artifact remains part of the chapter-bounded archive
   after its physical state changes. The Guardian Spirit Beast eggs manifest by
   Chapter 359, but their historical record and custody chain remain queryable. */
const objects = Object.freeze(phase4Objects.map((record) => record.id === 'object:guardian-spirit-beast-eggs'
  ? Object.freeze({
    ...record,
    chapterRange: Object.freeze({ start: record.chapterRange.start, end: null }),
  })
  : record));

const protocolRecords = Object.freeze([
  ...phase4ProtocolRecords.filter((record) => !highValueIntelligence384Protocols.some((addition) => addition.id === record.id)),
  ...highValueIntelligence384Protocols,
]);

/* Keep the canonical ability entity singular while allowing its latest metadata
   to point readers toward the chapter-bounded knowledge layer. */
const abilities = Object.freeze((phase4PredecessorData.abilities || []).map((record) => record.id === 'ability:secret-window'
  ? Object.freeze({
    ...record,
    latestChapter: Math.max(Number(record.latestChapter || 0), 413),
    latestKnowledgeNote: 'Chapter 413 adds pre-death visual knowledge through the dedicated ability-knowledge history.',
    updatedAt: '2026-08-13',
  })
  : record));

/* Phase 4 promotes previously scattered intelligence into the canonical graph
   without replacing Phase 3's normalized people and state contracts. */
export const successionArchiveData = Object.freeze({
  ...phase4PredecessorData,
  abilities,
  knowledgeRecords: phase4KnowledgeRecords,
  protocolRecords,
  objects,
  documents: phase4Documents,
  evidenceItems: phase4EvidenceItems,
  editorialChangeLog: phase4EditorialChangeLog,
  highValueIntelligenceVersion: 'phase-4-v1',
});
