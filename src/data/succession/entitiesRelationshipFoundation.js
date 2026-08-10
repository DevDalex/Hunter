import { successionArchiveData as assignmentFoundationData } from './entitiesAssignmentFoundation.js';
import { relationshipFoundationExpansion } from './relationshipFoundationExpansion.js';
import { relationshipFoundation379Expansion } from './relationshipFoundation379Expansion.js';
import { relationshipFoundation380Expansion } from './relationshipFoundation380Expansion.js';
import { relationshipFoundation381Expansion } from './relationshipFoundation381Expansion.js';
import { relationshipFoundation383Expansion } from './relationshipFoundation383Expansion.js';
import { relationshipFoundation384Expansion } from './relationshipFoundation384Expansion.js';
import { relationshipFoundation385Expansion } from './relationshipFoundation385Expansion.js';
import { relationshipFoundation386Expansion } from './relationshipFoundation386Expansion.js';
import { relationshipFoundation388Expansion } from './relationshipFoundation388Expansion.js';
import { relationshipFoundation389Expansion } from './relationshipFoundation389Expansion.js';
import { relationshipFoundation390Expansion } from './relationshipFoundation390Expansion.js';
import { relationshipFoundation391Expansion } from './relationshipFoundation391Expansion.js';
import { relationshipFoundation392Expansion } from './relationshipFoundation392Expansion.js';
import { relationshipFoundation393Expansion } from './relationshipFoundation393Expansion.js';
import { relationshipFoundation394Expansion } from './relationshipFoundation394Expansion.js';

const ARCHIVE_DATE = '2026-08-10';
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

const legacyRelationshipAliases = Object.freeze({
  'relationship:kurapika-bill-partnership': 'relationship:kurapika-bill-room-1014-partners',
  'relationship:kurapika-zhang-lei-alliance': 'relationship:kurapika-zhang-lei-lower-prince-alliance',
  'relationship:kurapika-longhi-treaty': 'relationship:longhi-kurapika-moonlight-act-treaty',
  'relationship:benjamin-halkenburg-conflict': 'relationship:benjamin-halkenburg-succession-hostility',
  'relationship:benjamin-camilla-rivalry': 'relationship:camilla-benjamin-hostile-rivalry',
  'relationship:tserriednich-theta-deception': 'relationship:theta-tserriednich-conflicted-instructor',
  'relationship:kacho-fugetsu-twin-protection': 'relationship:kacho-fugetsu-twin-bond',
  'relationship:zhang-lei-xi-yu-sponsorship': 'relationship:zhang-lei-xi-yu-political-sponsorship',
  'relationship:luzurus-cha-r-sponsorship': 'relationship:luzurus-cha-r-political-sponsorship',
  'relationship:morena-borksen-coercive-recruitment': 'relationship:morena-borksen-coerced-recruitment',
});

const legacyIdsByCanonicalId = new Map();
for (const [legacyId, canonicalId] of Object.entries(legacyRelationshipAliases)) {
  const current = legacyIdsByCanonicalId.get(canonicalId) || [];
  current.push(legacyId);
  legacyIdsByCanonicalId.set(canonicalId, current);
}

const relationshipEnrichment = Object.freeze({
  'relationship:kurapika-oito': Object.freeze({
    basis: 'Oito’s bodyguard contract and their shared command of Room 1014’s survival strategy.',
    operationalState: 'Active employer, strategist, and political-partner relationship.',
    strength: 'command-critical', certainty: 'confirmed',
    relatedEventIds: Object.freeze(['event:room-1014-opening-crisis', 'event:oito-little-eye-reconnaissance', 'event:lower-prince-alliance-formation']), evidenceNotes: Object.freeze([]),
  }),
  'relationship:kurapika-woble': Object.freeze({
    basis: 'Kurapika’s contracted bodyguard duty and explicit commitment to the infant prince’s survival.', operationalState: 'Active protection, deterrence, diplomacy, and Nen-instruction strategy.', strength: 'existential', certainty: 'confirmed', relatedEventIds: Object.freeze(['event:room-1014-opening-crisis', 'event:vincent-room-1014-attack', 'event:lower-prince-alliance-formation']), evidenceNotes: Object.freeze([]),
  }),
  'relationship:morena-heil-ly': Object.freeze({
    basis: 'Morena’s leadership of the Contagion community and breakaway Heil-Ly campaign.', operationalState: 'Active command, recruitment, leveling, and ideological control.', strength: 'institutional', certainty: 'confirmed', relatedEventIds: Object.freeze(['event:heil-ly-contagion-activation', 'event:borksen-recruitment-game']), evidenceNotes: Object.freeze([]),
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
    legacyIds: Object.freeze([...(relationship.legacyIds || legacyIdsByCanonicalId.get(relationship.id) || [])]),
    updatedAt: ARCHIVE_DATE,
  });
};

const retainedRelationships = assignmentFoundationData.relationships.filter((relationship) => !legacyRelationshipAliases[relationship.id]);

const relationships = Object.freeze(uniqueById([
  ...retainedRelationships,
  ...relationshipFoundationExpansion,
  ...relationshipFoundation379Expansion,
  ...relationshipFoundation380Expansion,
  ...relationshipFoundation381Expansion,
  ...relationshipFoundation383Expansion,
  ...relationshipFoundation384Expansion,
  ...relationshipFoundation385Expansion,
  ...relationshipFoundation386Expansion,
  ...relationshipFoundation388Expansion,
  ...relationshipFoundation389Expansion,
  ...relationshipFoundation390Expansion,
  ...relationshipFoundation391Expansion,
  ...relationshipFoundation392Expansion,
  ...relationshipFoundation393Expansion,
  ...relationshipFoundation394Expansion,
]).map(normalizeRelationship));

export const successionArchiveData = Object.freeze({ ...assignmentFoundationData, relationships });
