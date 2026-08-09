const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const LEGACY_TIER1_JUSTICE_BUREAU_ID = 'location:black-whale:tier-1:justice-bureau';
export const TIER2_JUSTICE_BUREAU_ID = 'location:black-whale:tier-2:justice-bureau';

export const locationFoundation386Corrections = freeze([
  freeze({
    id: TIER2_JUSTICE_BUREAU_ID,
    entityType: 'location',
    slug: 'black-whale-tier-2-justice-bureau',
    name: 'Kakin Justice Bureau',
    aliases: freeze(['Justice Bureau']),
    summary: 'Tier 2 investigative and protective-custody facility used during the royal voyage. Chapter 386 explicitly places Melody in the Justice Bureau on Tier 2.',
    sourceIds: freeze([chapterSourceId(386)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-09',
    updatedAt: '2026-08-09',
    locationType: 'facility',
    parentId: 'location:black-whale:tier-2',
    ancestorIds: freeze(['location:black-whale', 'location:black-whale:tier-2']),
    deck: 2,
    accessLevel: 'controlled',
  }),
]);

export const remapJusticeLocation386 = (record) => record?.locationId === LEGACY_TIER1_JUSTICE_BUREAU_ID
  ? freeze({
      ...record,
      locationId: TIER2_JUSTICE_BUREAU_ID,
      updatedAt: '2026-08-09',
      correctionSourceIds: freeze([chapterSourceId(386)]),
    })
  : record;
