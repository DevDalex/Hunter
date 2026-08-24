import {
  getEntitiesByType,
  successionArchiveValidation,
} from './successionData.js';

const safeCount = (type) => {
  try {
    return getEntitiesByType(type)?.length || 0;
  } catch {
    return 0;
  }
};

const characterCount = (role) => safeCount('character')
  ? getEntitiesByType('character').filter((record) => (record.roles || []).includes(role)).length
  : 0;

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
  story: { kind: 'narrative', complexity: 1.45, count: () => safeCount('event'), floor: 'high' },
  timeline: { kind: 'chronology', complexity: 1.7, count: () => safeCount('event'), floor: 'extreme' },
  reader: { kind: 'reader', complexity: .45, count: () => safeCount('chapter'), floor: 'calm' },
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
  events: { kind: 'chronology', complexity: 1.45, count: () => safeCount('event'), floor: 'extreme' },
  relationships: { kind: 'network', complexity: 1.4, count: () => safeCount('relationship'), floor: 'high' },
  chapters: { kind: 'ledger', complexity: 1.15, count: () => safeCount('chapter'), floor: 'high' },
  research: { kind: 'research', complexity: 1.55, count: researchCount, floor: 'extreme' },
  glossary: { kind: 'reference', complexity: .8, count: () => safeCount('glossary-entry'), floor: 'medium' },
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

export function getRoutePresentationProfile(routeId = 'story') {
  const profile = ROUTE_PROFILE[routeId] || { kind: 'directory', complexity: 1, count: () => 0 };
  const recordCount = Math.max(0, Number(profile.count?.()) || 0);
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
