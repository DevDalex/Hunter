import { succession416TimelineEvents } from '../succession416Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-416';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
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
  const value = `${record.id || ''} ${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/Hell Fruit|hell-fruit|Dust in the Wind/i.test(value)) ids.push('ability:dust-in-the-wind-hell-fruit');
  if (/counteractive|resurrection ability/i.test(value)) ids.push('ability:cat-s-name');
  if (/Parallel Future|parallel-future/i.test(value)) ids.push('ability:parallel-future');
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => {
  const value = `${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/military|Special Martial Law|Ministry of Justice/i.test(value)) ids.push('organization:kakin-military');
  if (/Benjamin/i.test(value)) ids.push('organization:benjamin-private-army');
  return freeze([...new Set(ids)]);
};

const criticalTracks = new Set(['special-martial-law','curse','hell-fruit','post-mortem-nen','tsk-17','death','unresolved','counteractive-ability','zetsu']);

export const eventFoundation416Expansion = freeze(succession416TimelineEvents.map((record, index) => {
  const slug = `chapter416-${record.id.replace(/^416-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-416',
    importance: (record.tracks || []).some((track) => criticalTracks.has(track)) ? 'critical' : 'major',
    chapterRange: freeze({ start: 416, end: 416 }),
    chronology: freeze({ sequence: index + 1, day: 'Voyage Day 12', timeOfDay: record.time || null, storyPeriod: 'Chapter 416 presentation order with embedded shortly-earlier Room 1004 recall', certainty: 'chapter-presentation-order-confirmed' }),
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
