import { succession417TimelineEvents } from '../succession417Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-417';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const ship = 'location:black-whale';
const tier1 = `${ship}:tier-1`;

const locationIds = (record) => {
  const value = String(record.location || '');
  if (!/Black Whale/i.test(value)) return freeze([]);
  const ids = [ship];
  if (/Tier 1|Room 10\d\d|Ministry of Justice|Justice Bureau/i.test(value)) ids.push(tier1);
  const room = value.match(/Room (10\d\d)/i)?.[1];
  if (room) ids.push(`${tier1}:room-${room}`);
  return freeze([...new Set(ids)]);
};

const abilityIds = (record) => {
  const value = `${record.id || ''} ${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/Gypsy Life|Bohemian Rhapsody|gypsy-life/i.test(value)) ids.push('ability:gypsy-life-bohemian-rhapsody');
  if (/Benjamin Baton|benjamin-baton/i.test(value)) ids.push('ability:benjamin-baton');
  if (/Secret Window|secret-window/i.test(value)) ids.push('ability:secret-window');
  if (/Hell Fruit|Have-Not curse|hell-fruit/i.test(value)) ids.push('ability:dust-in-the-wind-hell-fruit');
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => {
  const value = `${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/military|Special Martial Law|Ministry of Justice|Justice Bureau|Royal Army/i.test(value)) ids.push('organization:kakin-military');
  if (/Benjamin|First Unit/i.test(value)) ids.push('organization:benjamin-private-army');
  if (/Hunter Association/i.test(value)) ids.push('organization:hunter-association');
  return freeze([...new Set(ids)]);
};

const criticalTracks = new Set(['tsk-17','curse','death','injury','custody','gypsy-life','guardian-spirit-beast','chapter-endpoint']);

export const eventFoundation417Expansion = freeze(succession417TimelineEvents.map((record, index) => {
  const slug = `chapter417-${record.id.replace(/^417-/, '')}`;
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
    createdAt: '2026-08-14',
    updatedAt: '2026-08-14',
    category: record.tracks?.[0] || 'chapter-417',
    importance: (record.tracks || []).some((track) => criticalTracks.has(track)) ? 'critical' : 'major',
    chapterRange: freeze({ start: 417, end: 417 }),
    chronology: freeze({ sequence: index + 1, day: 'Voyage Day 12', timeOfDay: record.time || null, storyPeriod: 'Chapter 417 presentation order', certainty: 'chapter-presentation-order-confirmed' }),
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
