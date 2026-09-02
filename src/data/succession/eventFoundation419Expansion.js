import { succession419TimelineEvents } from '../succession419Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-419';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const ship = 'location:black-whale';
const tier1 = `${ship}:tier-1`;
const locationIds = (record) => {
  const value = String(record.location || '');
  if (!/Black Whale/i.test(value)) return freeze([]);
  const ids = [ship,tier1];
  const room = value.match(/Room (10\d\d)/i)?.[1];
  if (room) ids.push(`${tier1}:room-${room}`);
  if (/casino/i.test(value)) ids.push(`${tier1}:casino`);
  return freeze([...new Set(ids)]);
};
const abilityIds = (record) => /Parallel Future|parallel-future|Laplace|Ephemeral Ten Seconds|future-sight|perception/i.test(`${record.title} ${record.detail} ${(record.tracks||[]).join(' ')}`) ? freeze(['ability:parallel-future']) : freeze([]);
const organizationIds = (record) => /military|Royal Army|martial-law/i.test(`${record.title} ${record.detail} ${(record.tracks||[]).join(' ')}`) ? freeze(['organization:kakin-military']) : freeze([]);
const criticalTracks = new Set(['parallel-future','ability-rule','combat','firearms','escape','chapter-endpoint','martial-law','boundary']);

export const eventFoundation419Expansion = freeze(succession419TimelineEvents.map((record,index)=>{
  const slug=`chapter419-${record.id.replace(/^419-/,'')}`;
  return freeze({
    id:`event:${slug}`,entityType:'event',slug,name:record.title,aliases:freeze([]),summary:record.detail,
    sourceIds:freeze([sourceId]),publicationStatus:'published',
    canonLevel:record.confidence?.includes('speculation') || record.confidence?.includes('inference') ? 'inference' : 'canon',
    createdAt:'2026-09-02',updatedAt:'2026-09-02',category:record.tracks?.[0]||'chapter-419',
    importance:(record.tracks||[]).some((track)=>criticalTracks.has(track))?'critical':'major',
    chapterRange:freeze({start:419,end:419}),
    chronology:freeze({sequence:index+1,day:'Voyage Day 12',timeOfDay:record.time||null,storyPeriod:'Chapter 419 continuation',certainty:'chapter-presentation-order-confirmed'}),
    participantIds:freeze((record.people||[]).map(characterId)),organizationIds:organizationIds(record),locationIds:locationIds(record),abilityIds:abilityIds(record),
    causes:freeze([]),outcomes:freeze([record.confidence||'Chapter-bounded event recorded from the supplied synopsis.']),consequenceEventIds:freeze([]),status:'completed',stateChanges:freeze([]),openQuestions:freeze([]),
  });
}));
