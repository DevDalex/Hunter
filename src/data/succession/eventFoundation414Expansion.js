import { succession414TimelineEvents } from '../succession414Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-414';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const ship = 'location:black-whale';
const tier1 = `${ship}:tier-1`;

const locationIds = (record) => {
  const value = String(record.location || '');
  const ids = [ship];
  if (/Tier 1|Room 10\d\d/i.test(value)) ids.push(tier1);
  if (/Room 1009/i.test(value)) ids.push(`${tier1}:room-1009`);
  return freeze([...new Set(ids)]);
};

const abilityIds = (record) => {
  const value = `${record.id || ''} ${record.title || ''} ${record.detail || ''}`;
  const ids = [];
  if (/muteking/i.test(value)) ids.push('ability:muteking');
  if (/stand by me|stinger.?ball/i.test(value)) ids.push('ability:stinger-ball');
  if (/stealth dolphin/i.test(value)) ids.push('ability:stealth-dolphin');
  if (/moonlight act/i.test(value)) ids.push('ability:moonlight-act');
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => {
  const value = `${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/Hunter Association/i.test(value)) ids.push('organization:hunter-association');
  if (/Royal Army|military/i.test(value)) ids.push('organization:kakin-military');
  if (/Benjamin/i.test(value)) ids.push('organization:benjamin-private-army');
  return freeze([...new Set(ids)]);
};

const criticalTracks = new Set(['special-martial-law', 'muteking', 'stand-by-me', 'beyond-curse', 'woble-identity', 'woble-location', 'trusted-friends', 'yamato']);

export const eventFoundation414Expansion = freeze(succession414TimelineEvents.map((record, index) => {
  const slug = `chapter414-${record.id.replace(/^414-/, '')}`;
  return freeze({
    id: `event:${slug}`,
    entityType: 'event',
    slug,
    name: record.title,
    aliases: freeze([]),
    summary: record.detail,
    sourceIds: freeze([sourceId]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-13',
    updatedAt: '2026-08-13',
    category: record.tracks?.[0] || 'chapter-414',
    importance: (record.tracks || []).some((track) => criticalTracks.has(track)) ? 'critical' : 'major',
    chapterRange: freeze({ start: 414, end: 414 }),
    chronology: freeze({ sequence: index + 1, day: 'Voyage Day 12', timeOfDay: record.time || null, storyPeriod: 'Voyage Day 12 · pre-declaration Chapter 414 sequence', certainty: 'chapter-presentation-order-confirmed' }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: organizationIds(record),
    locationIds: locationIds(record),
    abilityIds: abilityIds(record),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze([]),
  });
}));
