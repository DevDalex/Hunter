import {
  phase4Documents,
  phase4EditorialChangeLog,
  phase4EvidenceItems,
  phase4KnowledgeRecords,
  phase4Objects,
  phase4PredecessorData,
  phase4ProtocolRecords,
} from './highValueIntelligenceFoundation.js';

/* A consumed or deployed artifact remains part of the chapter-bounded archive
   after its physical state changes. The Guardian Spirit Beast eggs manifest by
   Chapter 359, but their historical record and custody chain remain queryable. */
const objects = Object.freeze(phase4Objects.map((record) => record.id === 'object:guardian-spirit-beast-eggs'
  ? Object.freeze({
    ...record,
    chapterRange: Object.freeze({ start: record.chapterRange.start, end: null }),
  })
  : record));

/* Phase 4 promotes previously scattered intelligence into the canonical graph
   without replacing Phase 3's normalized people and state contracts. */
export const successionArchiveData = Object.freeze({
  ...phase4PredecessorData,
  knowledgeRecords: phase4KnowledgeRecords,
  protocolRecords: phase4ProtocolRecords,
  objects,
  documents: phase4Documents,
  evidenceItems: phase4EvidenceItems,
  editorialChangeLog: phase4EditorialChangeLog,
  highValueIntelligenceVersion: 'phase-4-v1',
});
