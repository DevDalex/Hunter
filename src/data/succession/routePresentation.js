import {
  getEntitiesByType,
  getGlossaryEntriesAtChapter,
  getStoryEventsKnownAtChapter,
  successionArchiveValidation,
} from './successionData.js';
import {
  successionDays,
  successionPreludeEvents,
} from '../successionTimeline.js';

const safeEntities = (type) => {
  try {
    return getEntitiesByType(type) || [];
  } catch {
    return [];
  }
};

const safeCount = (type) => safeEntities(type).length;

const latestChapter = () => Math.max(
  340,
  ...safeEntities('chapter').map((record) => Number(record.number)).filter(Number.isFinite),
);

const boundaryFor = (context = {}) => {
  const requested = Number(context.spoilerLimit);
  return Number.isFinite(requested) ? requested : latestChapter();
};

const characterCount = (role) => safeEntities('character')
  .filter((record) => (record.roles || []).includes(role)).length;

const chapterCount = (context) => {
  const boundary = boundaryFor(context);
  return safeEntities('chapter').filter((record) => Number(record.number) <= boundary).length;
};

const storyEventCount = (context) => {
  try {
    return getStoryEventsKnownAtChapter(boundaryFor(context))?.length || 0;
  } catch {
    return safeCount('event');
  }
};

const timelineCount = (context) => {
  const boundary = boundaryFor(context);
  const prelude = successionPreludeEvents.filter((event) => Number(event.chapter) <= boundary).length;
  const voyage = successionDays.reduce((total, day) => total
    + day.events.filter((event) => Number(event.chapter) <= boundary).length, 0);
  return prelude + voyage;
};

const glossaryCount = (context) => {
  try {
    return getGlossaryEntriesAtChapter(boundaryFor(context))?.length || 0;
  } catch {
    return 0;
  }
};

const researchCount = () => [
  'source',
  'knowledge-record',
  'protocol',
  'object',
  'document',
  'evidence-item',
].reduce((total, type) => total + safeCount(type), 0);

const searchCount = () => Number(successionArchiveValidation?.stats?.entities) || [
  'character',
  'organization',
  'ability',
  'guardian-beast',
  'location',
  'event',
  'assignment',
  'relationship',
  'chapter',
  'source',
].reduce((total, type) => total + safeCount(type), 0);

const ROUTE_PROFILE = Object.freeze({
  archive: { kind: 'overview', complexity: .7, count: () => 19 },
  story: { kind: 'narrative', complexity: 1.45, count: storyEventCount, floor: 'high' },
  timeline: { kind: 'chronology', complexity: 1.7, count: timelineCount, floor: 'extreme' },
  reader: { kind: 'reader', complexity: .45, count: chapterCount, floor: 'calm' },
  search: { kind: 'search', complexity: 1.3, count: searchCount, floor: 'extreme' },
  characters: { kind: 'directory', complexity: 1.0, count: () => safeCount('character') },
  princes: { kind: 'portrait-directory', complexity: 1.15, count: () => characterCount('prince'), floor: 'calm' },
  queens: { kind: 'portrait-directory', complexity: 1.0, count: () => characterCount('queen'), floor: 'calm' },
  bodyguards: { kind: 'ledger', complexity: 1.3, count: () => safeCount('assignment'), floor: 'high' },
  organizations: { kind: 'matrix', complexity: 1.25, count: () => safeCount('organization') },
  'black-whale': { kind: 'spatial', complexity: 1.4, count: () => safeCount('location') + safeCount('location-history'), floor: 'high' },
  locations: { kind: 'spatial', complexity: 1.35, count: () => safeCount('location') + safeCount('location-history'), floor: 'high' },
  nen: { kind: 'systems', complexity: 1.2, count: () => safeCount('ability'), floor: 'high' },
  'guardian-spirit-beasts': { kind: 'portrait-directory', complexity: 1.1, count: () => safeCount('guardian-beast'), floor: 'calm' },
  events: { kind: 'chronology', complexity: 1.45, count: storyEventCount, floor: 'extreme' },
  relationships: { kind: 'network', complexity: 1.4, count: () => safeCount('relationship'), floor: 'high' },
  chapters: { kind: 'ledger', complexity: 1.15, count: chapterCount, floor: 'high' },
  research: { kind: 'research', complexity: 1.55, count: researchCount, floor: 'extreme' },
  glossary: { kind: 'reference', complexity: .8, count: glossaryCount, floor: 'medium' },
});

export const successionPresentationRouteIds = Object.freeze(Object.keys(ROUTE_PROFILE));

const DENSITY_RANK = Object.freeze({ calm: 0, medium: 1, high: 2, extreme: 3 });

const densityForUnits = (units) => {
  if (units >= 260) return 'extreme';
  if (units >= 120) return 'high';
  if (units >= 40) return 'medium';
  return 'calm';
};

const raiseDensity = (density, floor) => {
  if (!floor) return density;
  return DENSITY_RANK[floor] > DENSITY_RANK[density] ? floor : density;
};

export function getRoutePresentationProfile(routeId = 'story', context = {}) {
  const profile = ROUTE_PROFILE[routeId] || { kind: 'directory', complexity: 1, count: () => 0 };
  const recordCount = Math.max(0, Number(profile.count?.(context)) || 0);
  const informationUnits = Math.max(1, Math.round(recordCount * profile.complexity));
  const density = raiseDensity(densityForUnits(informationUnits), profile.floor);

  return Object.freeze({
    routeId,
    kind: profile.kind,
    recordCount,
    informationUnits,
    density,
  });
}

export const successionPresentationThresholds = Object.freeze({
  calm: '1–39 information units',
  medium: '40–119 information units',
  high: '120–259 information units',
  extreme: '260+ information units',
});
