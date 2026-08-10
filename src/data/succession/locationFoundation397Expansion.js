const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-397';
const meteorCity = 'location:meteor-city';
const church = 'location:meteor-city:all-faiths-church';

const location = ({ id, slug, name, summary, locationType, parentId = null, ancestorIds = [], accessLevel = 'unknown', zoneRole = 'flashback-origin-setting', certainty = 'confirmed' }) => freeze({
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

export const locationFoundation397Expansion = freeze([
  location({
    id: `${meteorCity}:cemetery-near-all-faiths-church`,
    slug: 'meteor-city-cemetery-near-all-faiths-church',
    name: 'Cemetery near the All-Faiths Church',
    summary: 'The nearby Meteor City cemetery where Sarasa is laid to rest after Renko restores her body for the funeral. Chapter 397 does not supply a formal cemetery name, exact distance from the church, plot geometry, or precise coordinates.',
    locationType: 'cemetery',
    parentId: meteorCity,
    ancestorIds: [meteorCity],
    accessLevel: 'community',
    zoneRole: 'sarasa-burial-and-post-funeral-troupe-origin-discussion',
  }),
  location({
    id: 'location:kirimori-valley',
    slug: 'kirimori-valley',
    name: 'Kirimori Valley',
    summary: 'The destination Renko tells Machi to request on the last bus after giving her a marked piece of paper that allows free passage if her caretakers permit the visit. Chapter 397 does not establish Kirimori Valley’s exact coordinates, distance from Meteor City, political jurisdiction, route geometry, or Renko’s precise residence within it.',
    locationType: 'region',
    parentId: null,
    ancestorIds: [],
    accessLevel: 'transit-access-by-instruction',
    zoneRole: 'renko-invitation-destination',
  }),
]);
