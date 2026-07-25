import { chapterTitles } from '../chapterTitles.js';
import { successionArchiveData as maintainedData } from './entities.js';
import {
  batch1Abilities,
  batch1Assignments,
  batch1Events,
  batch1GuardianBeastAbilityLinks,
  batch1Locations,
  batch1Relationships,
} from './foundationBatch1.js';
import {
  LATEST_SUCCESSION_RESEARCH_CHAPTER,
  successionChapterResearch,
} from './successionResearch.js';

const ARCHIVE_DATE = '2026-07-24';
const latestChapter = LATEST_SUCCESSION_RESEARCH_CHAPTER;
const maintainedSourceIds = new Set(maintainedData.sources.map((source) => source.id));
const maintainedChapterIds = new Set(maintainedData.chapters.map((chapter) => chapter.id));
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

const createSource = (research) => Object.freeze({
  id: `source:chapter-${research.number}`,
  entityType: 'source',
  slug: null,
  name: `Chapter ${research.number}`,
  aliases: [],
  summary: research.focus || `Primary manga reference for Chapter ${research.number}.`,
  sourceIds: [],
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: ARCHIVE_DATE,
  updatedAt: ARCHIVE_DATE,
  sourceType: 'chapter',
  chapter: research.number,
  pages: [],
  url: research.source || `https://hunterxhunter.fandom.com/wiki/Chapter_${research.number}`,
  note: research.status || 'Latest indexed chapter source.',
});

const createChapter = (research) => Object.freeze({
  id: `chapter:${research.number}`,
  entityType: 'chapter',
  slug: String(research.number),
  name: `Chapter ${research.number} · ${research.title || chapterTitles[research.number - 1] || research.number}`,
  aliases: [],
  summary: research.focus || `Research record for Chapter ${research.number}.`,
  sourceIds: [`source:chapter-${research.number}`],
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: ARCHIVE_DATE,
  updatedAt: ARCHIVE_DATE,
  number: research.number,
  storyPhaseIds: ['active-contest-and-voyage'],
  appearanceRecords: [],
  eventIds: [],
  locationIds: research.number >= 358 ? ['location:black-whale'] : [],
  abilityIds: [],
  organizationIds: [],
  reader: { manifestChapter: research.number },
  voyageDay: research.voyageDay || 'Unassigned',
  lanes: research.lanes || [],
  referenceUrl: research.source || `https://hunterxhunter.fandom.com/wiki/Chapter_${research.number}`,
});

const additionalSources = successionChapterResearch
  .filter((research) => !maintainedSourceIds.has(`source:chapter-${research.number}`))
  .map(createSource);

const additionalChapters = successionChapterResearch
  .filter((research) => !maintainedChapterIds.has(`chapter:${research.number}`))
  .map(createChapter);

const updateRangeEnd = (range) => range?.end === 413 ? { ...range, end: latestChapter } : range;
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? range.start);

const abilities = Object.freeze(uniqueById([
  ...maintainedData.abilities,
  ...batch1Abilities,
]));

const locations = Object.freeze(uniqueById([
  ...maintainedData.locations,
  ...batch1Locations,
]));

const events = Object.freeze(uniqueById([
  ...maintainedData.events,
  ...batch1Events,
]).map((event) => Object.freeze({
  ...event,
  chapterRange: Object.freeze({ ...event.chapterRange }),
  updatedAt: ARCHIVE_DATE,
})));

const assignments = Object.freeze(batch1Assignments.map((assignment) => Object.freeze({
  ...assignment,
  chapterRange: Object.freeze(updateRangeEnd(assignment.chapterRange)),
  updatedAt: ARCHIVE_DATE,
})));

const relationships = Object.freeze(uniqueById([
  ...maintainedData.relationships,
  ...batch1Relationships,
]).map((relationship) => Object.freeze({
  ...relationship,
  chapterRange: Object.freeze(updateRangeEnd(relationship.chapterRange)),
  updatedAt: ARCHIVE_DATE,
})));

const guardianBeasts = Object.freeze(maintainedData.guardianBeasts.map((beast) => Object.freeze({
  ...beast,
  knownAbilityIds: Object.freeze(unique([
    ...(beast.knownAbilityIds || []),
    ...(batch1GuardianBeastAbilityLinks[beast.id] || []),
  ])),
  updatedAt: ARCHIVE_DATE,
})));

const maintainedLocationPairs = new Set(maintainedData.locationHistory.map((record) => `${record.characterId}|${record.locationId}`));
const assignmentLocationHistory = assignments
  .filter((assignment) => assignment.locationId && !maintainedLocationPairs.has(`${assignment.personId}|${assignment.locationId}`))
  .map((assignment) => Object.freeze({
    id: `location-history:${assignment.slug}`,
    entityType: 'location-history',
    slug: null,
    name: assignment.name,
    aliases: [],
    summary: `${assignment.name} is linked to ${assignment.locationId.replaceAll(':', ' ')} through the canonical assignment record.`,
    sourceIds: assignment.sourceIds,
    publicationStatus: 'published',
    canonLevel: assignment.canonLevel,
    createdAt: ARCHIVE_DATE,
    updatedAt: ARCHIVE_DATE,
    characterId: assignment.personId,
    locationId: assignment.locationId,
    chapterRange: assignment.chapterRange,
    state: assignment.status === 'active' ? 'assigned' : assignment.status,
    certainty: 'confirmed',
  }));

const locationHistory = Object.freeze(uniqueById([
  ...maintainedData.locationHistory.map((record) => Object.freeze({
    ...record,
    chapterRange: Object.freeze(updateRangeEnd(record.chapterRange)),
    updatedAt: ARCHIVE_DATE,
  })),
  ...assignmentLocationHistory,
]));

const chapters = Object.freeze([
  ...maintainedData.chapters,
  ...additionalChapters,
]
  .sort((left, right) => left.number - right.number)
  .map((chapter) => {
    const linkedEvents = events.filter((event) => includesChapter(event.chapterRange, chapter.number));
    const existingAppearances = new Map((chapter.appearanceRecords || []).map((appearance) => [appearance.characterId, appearance]));
    for (const participantId of linkedEvents.flatMap((event) => event.participantIds || [])) {
      if (!existingAppearances.has(participantId)) existingAppearances.set(participantId, Object.freeze({ characterId: participantId, role: 'event participant' }));
    }
    return Object.freeze({
      ...chapter,
      appearanceRecords: Object.freeze([...existingAppearances.values()]),
      eventIds: Object.freeze(unique([...(chapter.eventIds || []), ...linkedEvents.map((event) => event.id)])),
      locationIds: Object.freeze(unique([...(chapter.locationIds || []), ...linkedEvents.flatMap((event) => event.locationIds || [])])),
      abilityIds: Object.freeze(unique([...(chapter.abilityIds || []), ...linkedEvents.flatMap((event) => event.abilityIds || [])])),
      organizationIds: Object.freeze(unique([...(chapter.organizationIds || []), ...linkedEvents.flatMap((event) => event.organizationIds || [])])),
      updatedAt: ARCHIVE_DATE,
    });
  }));

export const successionArchiveData = Object.freeze({
  ...maintainedData,
  sources: Object.freeze([
    ...maintainedData.sources,
    ...additionalSources,
  ]),
  characters: Object.freeze(maintainedData.characters.map((character) => Object.freeze({
    ...character,
    status: character.status ? Object.freeze({ ...character.status, asOfChapter: latestChapter }) : character.status,
    updatedAt: ARCHIVE_DATE,
  }))),
  abilities,
  guardianBeasts,
  locations,
  locationHistory,
  events,
  assignments,
  chapters,
  relationships,
});