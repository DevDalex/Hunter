const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-398';
const shipId = 'location:black-whale';
const tier3 = `${shipId}:tier-3`;
const hideout = `${tier3}:heil-ly-hideout`;

const location = ({ id, slug, name, summary, zoneRole }) => freeze({
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
  locationType: 'room',
  parentId: hideout,
  ancestorIds: freeze([shipId, tier3, hideout]),
  deck: 3,
  accessLevel: 'covert',
  zoneRole,
  certainty: 'confirmed',
});

export const locationFoundation398Expansion = freeze([
  location({
    id: `${hideout}:entry-room`,
    slug: 'tier-3-heil-ly-hideout-entry-room',
    name: 'Heil-Ly Hideout Teleport-Arrival / Entry Room',
    summary: 'The concealed interior space where Hinrigh and then Nobunaga arrive after deliberately crossing the tested front-door teleport trap in Chapter 398. Fresh blood and nearby sounds indicate recent activity. Nobunaga’s katana cuts to one wall rapidly disappear, and Hinrigh opens side doors revealing a shower room, bathroom, and three toilets. “Entry room” is a descriptive archive label; the chapter does not provide an official room name, complete dimensions, exact coordinates, or full route topology.',
    zoneRole: 'teleport-arrival-and-infiltration-staging-room',
  }),
  location({
    id: `${hideout}:laundry-room`,
    slug: 'tier-3-heil-ly-hideout-laundry-room',
    name: 'Heil-Ly Hideout Laundry-Filled Room',
    summary: 'The room exposed at Chapter 398’s endpoint when Hinrigh opens the main door with his knife and he and Nobunaga see large amounts of laundry. The observation confirms a laundry-filled internal room but does not establish what lies beyond it, its relation to Chapter 394’s reported disposal/laundry route, or a complete map of the hideout.',
    zoneRole: 'laundry-and-route-investigation-room',
  }),
]);
