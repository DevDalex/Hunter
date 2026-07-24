import { successionArchiveData as assignmentFoundationData } from './entitiesAssignmentFoundation.js';
import { relationshipFoundationExpansion } from './relationshipFoundationExpansion.js';

const ARCHIVE_DATE = '2026-07-24';
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

const relationshipEnrichment = Object.freeze({
  'relationship:kurapika-oito': Object.freeze({
    basis: 'Oito’s bodyguard contract and their shared command of Room 1014’s survival strategy.',
    operationalState: 'Active employer, strategist, and political-partner relationship.',
    strength: 'command-critical',
    certainty: 'confirmed',
    relatedEventIds: Object.freeze(['event:room-1014-opening-crisis', 'event:oito-little-eye-reconnaissance', 'event:lower-prince-alliance-formation']),
    evidenceNotes: Object.freeze(['Professional duty develops into strategic cooperation without erasing Oito’s authority as employer and queen.']),
  }),
  'relationship:kurapika-woble': Object.freeze({
    basis: 'Kurapika’s contracted bodyguard duty and explicit commitment to the infant prince’s survival.',
    operationalState: 'Active protection, deterrence, diplomacy, and Nen-instruction strategy.',
    strength: 'existential',
    certainty: 'confirmed',
    relatedEventIds: Object.freeze(['event:room-1014-opening-crisis', 'event:vincent-room-1014-attack', 'event:lower-prince-alliance-formation']),
    evidenceNotes: Object.freeze([]),
  }),
  'relationship:morena-heil-ly': Object.freeze({
    basis: 'Morena’s leadership of the Contagion community and breakaway Heil-Ly campaign.',
    operationalState: 'Active command, recruitment, leveling, and ideological control.',
    strength: 'institutional',
    certainty: 'confirmed',
    relatedEventIds: Object.freeze(['event:heil-ly-contagion-activation', 'event:borksen-recruitment-game']),
    evidenceNotes: Object.freeze([]),
  }),
});

const normalizeRelationship = (relationship) => {
  const enrichment = relationshipEnrichment[relationship.id] || {};
  return Object.freeze({
    ...relationship,
    status: relationship.status || 'active',
    basis: relationship.basis || enrichment.basis || relationship.summary,
    operationalState: relationship.operationalState || enrichment.operationalState || 'Published relationship state remains active within its chapter range.',
    strength: relationship.strength || enrichment.strength || 'material',
    certainty: relationship.certainty || enrichment.certainty || 'confirmed',
    relatedEventIds: Object.freeze([...(relationship.relatedEventIds || enrichment.relatedEventIds || [])]),
    evidenceNotes: Object.freeze([...(relationship.evidenceNotes || enrichment.evidenceNotes || [])]),
    updatedAt: ARCHIVE_DATE,
  });
};

const relationships = Object.freeze(uniqueById([
  ...assignmentFoundationData.relationships,
  ...relationshipFoundationExpansion,
]).map(normalizeRelationship));

export const successionArchiveData = Object.freeze({
  ...assignmentFoundationData,
  relationships,
});
