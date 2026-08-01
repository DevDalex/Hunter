import {
  phase4Documents,
  phase4EditorialChangeLog,
  phase4EvidenceItems,
  phase4KnowledgeRecords,
  phase4Objects,
  phase4PredecessorData,
  phase4ProtocolRecords,
} from './highValueIntelligenceFoundation.js';

/* Phase 4 promotes previously scattered intelligence into the canonical graph
   without replacing Phase 3's normalized people and state contracts. */
export const successionArchiveData = Object.freeze({
  ...phase4PredecessorData,
  knowledgeRecords: phase4KnowledgeRecords,
  protocolRecords: phase4ProtocolRecords,
  objects: phase4Objects,
  documents: phase4Documents,
  evidenceItems: phase4EvidenceItems,
  editorialChangeLog: phase4EditorialChangeLog,
  highValueIntelligenceVersion: 'phase-4-v1',
});
