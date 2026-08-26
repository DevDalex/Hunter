import { succession418TimelineEvents } from '../succession418Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-418';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const ship = 'location:black-whale';
const tier1 = `${ship}:tier-1`;

const locationIds = (record) => {
  const value = String(record.location || '');
  if (!/Black Whale/i.test(value)) return freeze([]);
  const ids = [ship];
  if (/Tier 1|Room 10\d\d|Route [ABC]|Justice/i.test(value)) ids.push(tier1);
  const room = value.match(/Room (10\d\d)/i)?.[1];
  if (room) ids.push(`${tier1}:room-${room}`);
  return freeze([...new Set(ids)]);
};

const abilityIds = (record) => {
  const value = `${record.id || ''} ${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/Parallel Future|parallel-future|future-sight|sustained.*future|perception effect/i.test(value)) ids.push('ability:parallel-future');
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => {
  const value = `${record.title || ''} ${record.detail || ''} ${(record.tracks || []).join(' ')}`;
  const ids = [];
  if (/military|Special Martial Law|royal army|Justice/i.test(value)) ids.push('organization:kakin-military');
  if (/Benjamin/i.test(value)) ids.push('organization:benjamin-private-army');
  return freeze([...new Set(ids)]);
};

const criticalTracks = new Set(['parallel-future','martial-law','staged-death','chapter-endpoint','escape','countdown','firearms','ability-rule']);

export const eventFoundation418Expansion = freeze(succession418TimelineEvents.map((record, index) => {
  const slug = `chapter418-${record.id.replace(/^418-/, '')}`;
  return freeze({
    id:`event:${slug}`,
    entityType:'event',
    slug,
    name:record.title,
    aliases:freeze([]),
    summary:record.detail,
    sourceIds:freeze([sourceId]),
    publicationStatus:'published',
    canonLevel:record.confidence?.includes('hypothesis') || record.confidence?.includes('inference') ? 'inference' : 'canon',
    createdAt:'2026-08-23',
    updatedAt:'2026-08-23',
    category:record.tracks?.[0] || 'chapter-418',
    importance:(record.tracks || []).some((track)=>criticalTracks.has(track)) ? 'critical' : 'major',
    chapterRange:freeze({ start:418,end:418 }),
    chronology:freeze({ sequence:index+1,day:'Voyage Day 12',timeOfDay:record.time || null,storyPeriod:'Chapter 418 non-linear presentation order',certainty:'chapter-presentation-order-confirmed' }),
    participantIds:freeze((record.people || []).map(characterId)),
    organizationIds:organizationIds(record),
    locationIds:locationIds(record),
    abilityIds:abilityIds(record),
    causes:freeze([]),
    outcomes:freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds:freeze([]),
    status:'completed',
    stateChanges:freeze([]),
    openQuestions:freeze([]),
  });
}));
