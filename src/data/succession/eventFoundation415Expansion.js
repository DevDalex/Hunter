import { succession415TimelineEvents } from '../succession415Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-415';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterAliases = freeze({ Shimanu: 'character:shimano' });
const characterId = (name) => characterAliases[name] || `character:${slugify(name)}`;
const ship = 'location:black-whale';
const tier1 = `${ship}:tier-1`;

const locationIds = (record) => {
  const value = String(record.location || '');
  if (!/Black Whale/i.test(value)) return freeze([]);
  const ids = [ship];
  if (/Tier 1|Room 10\d\d/i.test(value)) ids.push(tier1);
  const room = value.match(/Room (10\d\d)/i)?.[1];
  if (room) ids.push(`${tier1}:room-${room}`);
  return freeze([...new Set(ids)]);
};

const abilityIds = (record) => {
  const value = `${record.id || ''} ${record.title || ''} ${record.detail || ''}`;
  const ids = [];
  if (/combo master/i.test(value)) ids.push('ability:combo-master');
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => {
  const value = `${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/military|Royal Army|Special Martial Law/i.test(value)) ids.push('organization:kakin-military');
  if (/Benjamin/i.test(value)) ids.push('organization:benjamin-private-army');
  return freeze([...new Set(ids)]);
};

const criticalTracks = new Set(['combo-master','curse','post-mortem-nen','special-martial-law','missing','detention','confinement','guardian-spirit-beast','nen-space']);

export const eventFoundation415Expansion = freeze(succession415TimelineEvents.map((record, index) => {
  const slug = `chapter415-${record.id.replace(/^415-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-415',
    importance: (record.tracks || []).some((track) => criticalTracks.has(track)) ? 'critical' : 'major',
    chapterRange: freeze({ start: 415, end: 415 }),
    chronology: freeze({ sequence: index + 1, day: record.time?.includes('Two months before departure') ? 'Pre-voyage flashback' : 'Voyage Day 12', timeOfDay: record.time || null, storyPeriod: 'Chapter 415 non-linear presentation', certainty: 'chapter-presentation-order-confirmed' }),
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
