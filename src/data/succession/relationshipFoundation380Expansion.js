const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const relationshipFoundation380Expansion = freeze([
  freeze({
    id: 'relationship:cha-r-phantom-troupe-operational-hunt-deal',
    entityType: 'relationship',
    slug: 'cha-r-phantom-troupe-operational-hunt-deal',
    name: 'Cha-R and Phantom Troupe Operational Hunt Deal',
    aliases: freeze([]),
    summary: 'Ken’i Wang converts the prior tactical proposal into a concrete exchange: Cha-R grants Nobunaga, Phinks, and Feitan access through an adjacent controlled door in return for hunting the killer of Cha-R members, with Tsudonke’s squad attached to the operation.',
    sourceIds: freeze([chapterSourceId(380)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-09',
    updatedAt: '2026-08-09',
    sourceEntityId: 'organization:cha-r',
    targetEntityId: 'organization:phantom-troupe',
    relationshipType: 'alliance',
    subtype: 'operational-access-for-hunt-exchange-under-concealed-hostility',
    direction: 'bidirectional',
    sentiment: 'mixed',
    status: 'active',
    chapterRange: freeze({ start: 380, end: 380 }),
    basis: 'Mutual short-term utility: Cha-R needs help finding the killer and the Troupe trio needs access through Cha-R-controlled lower-tier routes.',
    operationalState: 'The deal is active in Chapter 380. Chapter 379’s evidence that Wang privately wants the Troupe crushed remains part of the relationship context and is not treated as resolved.',
    strength: 'tactical',
    certainty: 'confirmed',
    relatedEventIds: freeze(['event:cha-r-troupe-operational-hunt-deal']),
    evidenceNotes: freeze(['Operational cooperation is confirmed, but stable trust, friendship, or long-term alliance is not.']),
    legacyIds: freeze([]),
  }),
]);
