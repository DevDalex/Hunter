const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const relationshipFoundation388Expansion = freeze([
  freeze({
    id: 'relationship:tubeppa-woble-ch388-alliance-negotiation',
    entityType: 'relationship',
    slug: 'tubeppa-woble-ch388-alliance-negotiation',
    name: 'Tubeppa Authorizes Alliance Negotiations with Woble’s Camp',
    aliases: freeze([]),
    summary: 'After Maor and Longhi confirm that Kurapika’s Nen training works and report Woble’s strong alignment with Zhang Lei, Tubeppa authorizes continued alliance negotiations and allows more of her guards to attend future Nen classes.',
    sourceIds: freeze([chapterSourceId(388)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-09',
    updatedAt: '2026-08-09',
    sourceEntityId: 'character:tubeppa-hui-guo-rou',
    targetEntityId: 'character:woble-hui-guo-rou',
    relationshipType: 'alliance',
    subtype: 'alliance-negotiation',
    direction: 'directed',
    sentiment: 'cooperative',
    status: 'active',
    chapterRange: freeze({ start: 388, end: 400 }),
    basis: 'Tubeppa’s explicit instruction to continue negotiations after receiving the successful Nen-class report.',
    operationalState: 'Negotiations are authorized and Tubeppa’s camp is willing to deepen Nen-training participation, but later formal terms are not backdated to Chapter 388.',
    strength: 'developing',
    certainty: 'confirmed',
    relatedEventIds: freeze(['event:tubeppa-authorizes-woble-alliance-negotiation']),
    evidenceNotes: freeze(['Chapter 388 establishes negotiation posture, not the later formal alliance agreement.', 'Woble’s strongest existing alliance is reported as Zhang Lei by Maor and Longhi.']),
    legacyIds: freeze([]),
  }),
]);
