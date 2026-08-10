const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-401';

const location = ({ id, slug, name, summary, locationType, parentId, ancestorIds, deck = 1, accessLevel, zoneRole, certainty = 'confirmed' }) => freeze({
  id,
  entityType: 'location',
  slug,
  name,
  aliases: freeze([]),
  summary,
  sourceIds: freeze([sourceId]),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-10',
  updatedAt: '2026-08-10',
  locationType,
  parentId,
  ancestorIds: freeze(ancestorIds),
  deck,
  accessLevel,
  zoneRole,
  certainty,
});

export const locationFoundation401Expansion = freeze([
  location({
    id: 'location:black-whale:tier-1:room-1014:master-bedroom',
    slug: 'room-1014-master-bedroom',
    name: 'Room 1014 Master Bedroom',
    summary: 'The closed private room Kurapika and Bill use for the controlled Nen-awakening procedure. At 11:45 a.m. on Voyage Day 10, Longhi uses this privacy to reveal Moonlight Act, Beyond’s curse-child program, and the real Tubeppa–Woble treaty terms while outside observers are kept in the living area.',
    locationType: 'room',
    parentId: 'location:black-whale:tier-1:room-1014',
    ancestorIds: ['location:black-whale', 'location:black-whale:tier-1', 'location:black-whale:tier-1:room-1014'],
    accessLevel: 'Woble-household controlled / closed-door',
    zoneRole: 'private-nen-awakening-and-treaty-negotiation',
  }),
  location({
    id: 'location:black-whale:tier-1:beyond-detention-cell',
    slug: 'tier-1-beyond-detention-cell',
    name: 'Beyond Netero Detention Cell',
    summary: 'The Tier 1 confinement cell where Beyond remains under Zodiac custody. At 2:00 p.m. in Chapter 401 he reads, jokes with Kanzai about security restrictions, and asks Kanzai to arrange a meeting with an unnamed person.',
    locationType: 'detention',
    parentId: 'location:black-whale:tier-1',
    ancestorIds: ['location:black-whale', 'location:black-whale:tier-1'],
    accessLevel: 'Zodiac-controlled detention',
    zoneRole: 'Beyond-custody',
  }),
]);
