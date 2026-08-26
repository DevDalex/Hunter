const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-396';
const meteorCity = 'location:meteor-city';
const church = 'location:meteor-city:all-faiths-church';

const location = ({ id, slug, name, summary, locationType, parentId = null, ancestorIds = [], accessLevel = 'community', zoneRole = 'flashback-origin-setting', certainty = 'confirmed' }) => freeze({
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
  deck: null,
  accessLevel,
  zoneRole,
  certainty,
});

export const locationFoundation396Expansion = freeze([
  location({
    id: `${church}:auditorium`,
    slug: 'meteor-city-all-faiths-church-auditorium',
    name: 'All-Faiths Church Auditorium',
    summary: 'The church screening space where Lisores gathers Meteor City children for the dubbed Mighty Sweepin’ Power Cleaners presentation. When the sound tape tangles, Chrollo, Pakunoda, Sheila, and Sarasa continue by performing the voices live.',
    locationType: 'room',
    parentId: church,
    ancestorIds: [meteorCity, church],
    accessLevel: 'community',
    zoneRole: 'childhood-screening-and-live-performance-space',
  }),
  location({
    id: `${meteorCity}:uga-forest`,
    slug: 'meteor-city-uga-forest',
    name: 'Uga Forest',
    summary: 'The named forest area referenced by Sarasa when she says a corporate dump near it contains a pile of videotapes. Chapter 396 does not provide exact boundaries, distance, or a route map.',
    locationType: 'district',
    parentId: meteorCity,
    ancestorIds: [meteorCity],
    accessLevel: 'uncontrolled',
    zoneRole: 'named-flashback-landmark-and-abduction-risk-area',
  }),
  location({
    id: `${meteorCity}:corporate-dump-near-uga-forest`,
    slug: 'meteor-city-corporate-dump-near-uga-forest',
    name: 'Corporate Dump near Uga Forest',
    summary: 'The dump Sarasa intends to search for additional Power Cleaners tapes after memorizing the title in the official language. The chapter shows her traveling alone toward the area but does not depict her arriving at the dump.',
    locationType: 'district',
    parentId: meteorCity,
    ancestorIds: [meteorCity],
    accessLevel: 'uncontrolled',
    zoneRole: 'tape-search-destination-and-child-abduction-risk-zone',
  }),
]);
