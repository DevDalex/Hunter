import { successionArchiveData as locationFoundationData } from './entitiesLocationFoundation.js';
import { assignmentFoundationExpansion } from './assignmentFoundationExpansion.js';

const ARCHIVE_DATE = '2026-07-24';
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const eventIdAliases = Object.freeze({
  'event:camilla-have-not-network-disclosure': 'event:camilla-curse-network-disclosure',
});

const assignmentEnrichment = Object.freeze({
  'assignment:kurapika-protects-woble': Object.freeze({
    objective: 'Keep Woble and Oito alive while building enough information, alliances, and Nen deterrence to survive the succession contest.',
    authorityBasis: 'Oito’s Hunter bodyguard contract and Kurapika’s role as Room 1014’s strategic coordinator.',
    operationalNotes: Object.freeze(['Protection, diplomacy, investigation, and Nen instruction operate as one assignment rather than separate jobs.']),
    relatedEventIds: Object.freeze(['event:room-1014-opening-crisis', 'event:room-1014-nen-classes', 'event:lower-prince-alliance-formation']),
    certainty: 'confirmed',
  }),
  'assignment:bill-protects-woble': Object.freeze({
    objective: 'Defend Room 1014, support Oito and Woble, and provide the Enhancement ability used in Kurapika’s accelerated Nen-awakening plan.',
    authorityBasis: 'Oito’s Hunter bodyguard contract.',
    operationalNotes: Object.freeze(['Bill’s role combines direct protection with the practical execution of the Nen-class strategy.']),
    relatedEventIds: Object.freeze(['event:room-1014-opening-crisis', 'event:room-1014-nen-classes', 'event:second-room-1014-nen-class']),
    certainty: 'confirmed',
  }),
  'assignment:babimyna-observes-woble': Object.freeze({
    objective: 'Remain inside Room 1014 as Benjamin’s legal observer while reporting threats and waiting for an exploitable opening.',
    authorityBasis: 'Benjamin’s military deployment into rival royal rooms.',
    operationalNotes: Object.freeze(['Babimyna’s continued presence mixes surveillance, deterrence, and possible restraint toward the infant prince.']),
    relatedEventIds: Object.freeze(['event:vincent-room-1014-attack', 'event:room-1014-opening-crisis']),
    certainty: 'confirmed',
  }),
  'assignment:sarahell-infiltrates-woble': Object.freeze({
    objective: 'Approach Woble closely enough to complete Camilla’s death-powered curse assignment.',
    authorityBasis: 'Camilla’s private Have-Not curse system.',
    operationalNotes: Object.freeze(['The public student role conceals a covert assassination objective.', 'The assignment remains active inside the expanded Nen class.']),
    relatedEventIds: Object.freeze(['event:second-room-1014-nen-class', 'event:sarahell-curse-infiltration']),
    certainty: 'confirmed',
  }),
  'assignment:melody-protects-kacho': Object.freeze({
    objective: 'Protect Kacho and assist the twin escape plan under the cover of the royal banquet performance.',
    authorityBasis: 'Kurapika’s Hunter placement and Kacho’s household contract.',
    operationalNotes: Object.freeze(['The assignment ends with Kacho’s death but continues in changed form around Fugetsu.']),
    relatedEventIds: Object.freeze(['event:twin-prince-escape']),
    replacedByAssignmentId: 'assignment:melody-protects-fugetsu',
    certainty: 'confirmed',
  }),
  'assignment:hanzo-protects-momoze': Object.freeze({
    objective: 'Protect Momoze as a contracted Hunter bodyguard before the household’s personnel transfers reduce her effective defense.',
    authorityBasis: 'Kurapika’s Hunter placement and Sevanti’s household arrangement.',
    operationalNotes: Object.freeze(['The assignment ends after Momoze’s murder and Hanzo’s investigation of Tuffdy.']),
    relatedEventIds: Object.freeze(['event:momoze-murder']),
    replacedByAssignmentId: 'assignment:hanzo-transfers-to-marayam',
    certainty: 'confirmed',
  }),
  'assignment:hanzo-transfers-to-marayam': Object.freeze({
    objective: 'Protect Marayam and investigate the separated Room 1013 state after Momoze’s death.',
    authorityBasis: 'Sevanti’s household reassignment following the collapse of Momoze’s room.',
    operationalNotes: Object.freeze(['The transfer links a failed protection assignment to a new protection-and-investigation role.']),
    relatedEventIds: Object.freeze(['event:momoze-murder']),
    supersedesAssignmentId: 'assignment:hanzo-protects-momoze',
    certainty: 'confirmed',
  }),
  'assignment:longhi-serves-tubeppa': Object.freeze({
    objective: 'Protect Tubeppa while managing the concealed Beyond curse-child mission and negotiating a survival arrangement with Kurapika.',
    authorityBasis: 'Tubeppa’s household assignment and Longhi’s hidden birth-network obligation.',
    operationalNotes: Object.freeze(['The assignment contains two overlapping chains of obligation that cannot be flattened into one allegiance.']),
    relatedEventIds: Object.freeze(['event:longhi-kurapika-treaty', 'event:lower-prince-alliance-formation']),
    certainty: 'confirmed',
  }),
  'assignment:coventoba-observes-zhang-lei': Object.freeze({
    objective: 'Monitor Zhang Lei’s room, Guardian Spirit Beast, and coin system for Benjamin’s command.',
    authorityBasis: 'Benjamin’s private military surveillance deployment.',
    operationalNotes: Object.freeze(['The assignment makes Room 1003 both an allied negotiation space and a monitored rival room.']),
    relatedEventIds: Object.freeze([]),
    certainty: 'confirmed',
  }),
  'assignment:musse-observes-camilla': Object.freeze({
    objective: 'Observe Camilla and create a surveillance opening for Benjamin’s command.',
    authorityBasis: 'Benjamin’s private military deployment into Camilla’s area.',
    operationalNotes: Object.freeze(['Musse’s death ends the assignment and transfers his ability into Benjamin Baton.']),
    relatedEventIds: Object.freeze(['event:camilla-attack-and-revival']),
    certainty: 'confirmed',
  }),
});

const normalizeAssignment = (assignment) => {
  const enrichment = assignmentEnrichment[assignment.id] || {};
  const relatedEventIds = (assignment.relatedEventIds || enrichment.relatedEventIds || [])
    .map((eventId) => eventIdAliases[eventId] || eventId);
  return Object.freeze({
    ...assignment,
    objective: assignment.objective || enrichment.objective || assignment.summary,
    authorityBasis: assignment.authorityBasis || enrichment.authorityBasis || 'Household, military, Justice, or contracted authority documented in the voyage record.',
    operationalNotes: Object.freeze([...(assignment.operationalNotes || enrichment.operationalNotes || [])]),
    relatedEventIds: Object.freeze([...new Set(relatedEventIds)]),
    supersedesAssignmentId: assignment.supersedesAssignmentId || enrichment.supersedesAssignmentId || null,
    replacedByAssignmentId: assignment.replacedByAssignmentId || enrichment.replacedByAssignmentId || null,
    certainty: assignment.certainty || enrichment.certainty || 'confirmed',
    updatedAt: ARCHIVE_DATE,
  });
};

const assignments = Object.freeze(uniqueById([
  ...locationFoundationData.assignments,
  ...assignmentFoundationExpansion,
]).map(normalizeAssignment));

export const successionArchiveData = Object.freeze({
  ...locationFoundationData,
  assignments,
});
