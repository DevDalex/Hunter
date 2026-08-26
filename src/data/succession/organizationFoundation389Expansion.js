const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const organizationFoundation389Expansion = freeze([
  freeze({
    id: 'organization:restricted-voyage-permit-agency',
    entityType: 'organization',
    slug: 'restricted-voyage-permit-agency',
    name: 'Restricted Voyage Permit Agency',
    aliases: freeze([]),
    summary: 'A voyage-related agency whose special task force takes Halkenburg into custody in Chapter 389. The supplied synopsis identifies Steiner and Peuckert among the five task-force members involved.',
    sourceIds: freeze([chapterSourceId(389)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-09',
    updatedAt: '2026-08-09',
    organizationType: 'government-agency',
    status: 'active',
    objectives: freeze(['Carry out the Chapter 389 custody operation against Halkenburg under the voyage legal process.']),
    leaderIds: freeze([]),
    parentOrganizationId: null,
  }),
]);
