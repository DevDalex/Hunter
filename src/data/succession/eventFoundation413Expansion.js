import { succession413TimelineEvents } from '../succession413Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-413';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const ship = 'location:black-whale';
const tier1 = `${ship}:tier-1`;

const locationIds = (record) => {
  const value = String(record.location || '');
  const ids = [ship];
  if (/Tier 1|Room 10\d\d|Nasubi|Burial Chamber|upper-tier/i.test(value)) ids.push(tier1);
  if (/Burial Chamber/i.test(value)) ids.push(`${tier1}:burial-chamber`);
  if (/Nasubi quarters/i.test(value)) ids.push(`${tier1}:nasubi-quarters`);
  if (/Room 1009/i.test(value)) ids.push(`${tier1}:room-1009`);
  if (/Room 1001/i.test(value)) ids.push(`${tier1}:room-1001`);
  return freeze([...new Set(ids)]);
};

const abilityIds = (record) => {
  const value = `${record.id || ''} ${record.title || ''} ${record.detail || ''}`;
  const ids = [];
  if (/combo.?master/i.test(value)) ids.push('ability:combo-master');
  if (/secret.?window/i.test(value)) ids.push('ability:secret-window');
  return freeze(ids);
};

const criticalTracks = new Set(['succession-ritual', 'soul', 'tsk17', 'beyond', 'curse', 'special-martial-law', 'combo-master', 'secret-window']);

export const eventFoundation413Expansion = freeze(succession413TimelineEvents.map((record, index) => {
  const slug = `chapter413-${record.id.replace(/^413-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-413',
    importance: (record.tracks || []).some((track) => criticalTracks.has(track)) ? 'critical' : 'major',
    chapterRange: freeze({ start: 413, end: 413 }),
    chronology: freeze({ sequence: index + 1, day: 'Voyage Day 12', timeOfDay: record.time || null, storyPeriod: 'Voyage Day 12 · pre-declaration Chapter 413 sequence', certainty: 'chapter-presentation-order-confirmed' }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: freeze([]),
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
