const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const LEGACY_TIER1_JUSTICE_BUREAU_ID = 'location:black-whale:tier-1:justice-bureau';
export const TIER2_JUSTICE_BUREAU_ID = 'location:black-whale:tier-2:justice-bureau';

const correctedJusticeLocation = ({ suffix = '', slug, name, summary, accessLevel, zoneRole, sourceChapters }) => freeze({
  id: `${TIER2_JUSTICE_BUREAU_ID}${suffix}`,
  entityType: 'location',
  slug,
  name,
  aliases: freeze([]),
  summary,
  sourceIds: freeze(sourceChapters.map(chapterSourceId)),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-09',
  updatedAt: '2026-08-09',
  locationType: 'facility',
  parentId: suffix ? TIER2_JUSTICE_BUREAU_ID : 'location:black-whale:tier-2',
  ancestorIds: freeze(suffix
    ? ['location:black-whale', 'location:black-whale:tier-2', TIER2_JUSTICE_BUREAU_ID]
    : ['location:black-whale', 'location:black-whale:tier-2']),
  deck: 2,
  accessLevel,
  zoneRole,
  certainty: 'confirmed',
});

export const locationFoundation386Corrections = freeze([
  freeze({
    ...correctedJusticeLocation({
      slug: 'black-whale-tier-2-justice-bureau',
      name: 'Kakin Justice Bureau',
      summary: 'Tier 2 investigative and protective-custody facility used during the royal voyage. Chapter 386 explicitly places Melody in the Justice Bureau on Tier 2.',
      accessLevel: 'controlled',
      zoneRole: 'justice-command-and-protection',
      sourceChapters: [386],
    }),
    aliases: freeze(['Justice Bureau']),
  }),
  correctedJusticeLocation({
    suffix: ':detention-wing',
    slug: 'justice-bureau-detention-wing',
    name: 'Justice Bureau Detention Wing',
    summary: 'Justice-controlled confinement and interview spaces maintained inside the Justice Bureau. Chapter 386 corrects the parent bureau hierarchy to Tier 2.',
    accessLevel: 'justice-controlled',
    zoneRole: 'custody-and-interview',
    sourceChapters: [373, 383, 386, 388],
  }),
  correctedJusticeLocation({
    suffix: ':medical-wing',
    slug: 'justice-bureau-medical-wing',
    name: 'Justice Bureau Medical Wing',
    summary: 'Justice-protected treatment and observation space associated with Fugetsu’s declining condition and the twin faction’s protected status, under the Tier 2 Justice Bureau hierarchy established by Chapter 386.',
    accessLevel: 'justice-controlled',
    zoneRole: 'medical-protection',
    sourceChapters: [386, 388, 402],
  }),
]);

export const isLegacyJusticeLocation386 = (locationId) => String(locationId || '').startsWith(LEGACY_TIER1_JUSTICE_BUREAU_ID);

export const remapJusticeLocationId386 = (locationId) => isLegacyJusticeLocation386(locationId)
  ? `${TIER2_JUSTICE_BUREAU_ID}${String(locationId).slice(LEGACY_TIER1_JUSTICE_BUREAU_ID.length)}`
  : locationId;

export const remapJusticeLocation386 = (record) => isLegacyJusticeLocation386(record?.locationId)
  ? freeze({
      ...record,
      locationId: remapJusticeLocationId386(record.locationId),
      updatedAt: '2026-08-09',
      correctionSourceIds: freeze([chapterSourceId(386)]),
    })
  : record;
