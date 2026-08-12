const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-409';

const location = ({ id, slug, name, summary, locationType = 'facility', parentId, ancestorIds, deck = null, accessLevel = 'restricted', zoneRole, certainty = 'confirmed' }) => freeze({
  id,
  entityType: 'location',
  slug,
  name,
  aliases: freeze([]),
  summary,
  sourceIds: freeze([sourceId]),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-12',
  updatedAt: '2026-08-12',
  locationType,
  parentId,
  ancestorIds: freeze(ancestorIds),
  deck,
  accessLevel,
  zoneRole,
  certainty,
});

export const locationFoundation409Expansion = freeze([
  location({
    id: 'location:black-whale:intertier-2-3:heil-ly-hideout',
    slug: 'black-whale-intertier-2-3-heil-ly-hideout',
    name: 'Heil-Ly Inter-Tier Hideout',
    summary: 'The Heil-Ly base where Morena conducts Borksen’s recruitment game. Under Question A, Morena confirms that it is aboard the Black Whale but not on Tiers 1 through 5; a central-gate rumble leads Borksen to ask whether it lies between Tiers 2 and 3, which Morena confirms. Morena also confirms five entrances and answers Yes and No when asked whether Nen made the hideout or whether ordinary people can access an entrance.',
    locationType: 'facility',
    parentId: 'location:black-whale',
    ancestorIds: ['location:black-whale'],
    deck: null,
    accessLevel: 'hidden-heil-ly-controlled',
    zoneRole: 'inter-tier-recruitment-command-and-hideout',
    certainty: 'inter-tier position and five entrances confirmed / exact coordinates, entrance map, and physical-versus-Nen composition unresolved',
  }),
  location({
    id: 'location:black-whale:intertier-2-3:central-gate',
    slug: 'black-whale-intertier-2-3-central-gate',
    name: 'Central Gate Between Tiers 2 and 3',
    summary: 'A central gate connecting the Tier 2 and Tier 3 bands. During Special Martial Law, Borksen hears and feels the gate close completely while inside the Heil-Ly hideout; recognizing the sound allows her to test and confirm the hideout’s inter-tier position. The supplied synopsis does not provide a complete gate mechanism, floor plan, or exact distance from the hideout.',
    locationType: 'facility',
    parentId: 'location:black-whale',
    ancestorIds: ['location:black-whale'],
    deck: null,
    accessLevel: 'military-controlled-bulkhead',
    zoneRole: 'tier-2-tier-3-security-separation',
  }),
]);
