import {
  successionDays as legacySuccessionDays,
  successionPrelude as legacySuccessionPrelude,
  timelineSources as legacyTimelineSources,
  timelineTracks as legacyTimelineTracks,
} from './successionTimelineLegacy.js';
import { maintainedSuccessionChapterResearch } from './successionMaintainedChapterResearch.js';

const freeze = (value) => Object.freeze(value);
const unique = (values) => [...new Set(values.filter(Boolean))];
const parseVoyageDay = (value) => {
  const match = String(value || '').match(/(?:voyage\s*)?day\s*(\d+)/i);
  return match ? Number(match[1]) : null;
};
const chapterNumbersFromSpec = (value) => {
  const values = String(value || '').match(/\d{3}/g)?.map(Number) || [];
  if (!values.length) return [];
  const [start, end = start] = values;
  return Array.from({ length: Math.max(0, end - start) + 1 }, (_, index) => start + index);
};
const researchIsMaintained = (research) => Boolean(
  research
  && !String(research.status || '').toLowerCase().includes('pending'),
);
const researchEvents = (research) => research?.events?.length ? research.events : research?.timelineEvents || [];
const chronologyResearch = maintainedSuccessionChapterResearch.filter((research) => researchIsMaintained(research)
  && (research.coverage?.chronology || research.timelineEvents?.length)
  && researchEvents(research).length);

const normalizeResearchEvent = (research, event, index) => freeze({
  id: event.id || `maintained-${research.number}-${index + 1}`,
  day: Number.isFinite(event.day) ? event.day : null,
  time: event.time || research.voyageDay || 'Story-order placement',
  title: event.title || `Chapter ${research.number} event ${index + 1}`,
  detail: event.detail || research.focus,
  tier: event.tier || event.location || 'Location not assigned',
  location: event.location || 'Location not assigned',
  tracks: freeze([...(event.tracks || [])]),
  chapter: research.number,
  confidence: event.confidence || research.confidence?.[0] || 'Maintained chapter research',
  source: event.source || research.source,
  maintainedResearch: true,
});

const maintainedEventsByChapter = new Map(chronologyResearch.map((research) => [
  research.number,
  freeze(researchEvents(research).map((event, index) => normalizeResearchEvent(research, event, index))),
]));

const replaceChapterEvents = (events, chapter, replacements) => {
  const insertionIndex = events.findIndex((event) => event.chapter === chapter);
  const filtered = events.filter((event) => event.chapter !== chapter);
  if (insertionIndex < 0) return freeze([...filtered, ...replacements]);
  return freeze([
    ...filtered.slice(0, insertionIndex),
    ...replacements,
    ...filtered.slice(insertionIndex),
  ]);
};

const maintainedTrackIds = unique(chronologyResearch.flatMap((research) => researchEvents(research).flatMap((event) => event.tracks || [])));
const legacyTrackById = new Map(legacyTimelineTracks.map((track) => [track.id, track]));
const labelizeTrack = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
export const timelineTracks = freeze([
  legacyTrackById.get('all') || { id: 'all', label: 'All threads' },
  ...legacyTimelineTracks.filter((track) => track.id !== 'all'),
  ...maintainedTrackIds
    .filter((id) => id !== 'all' && !legacyTrackById.has(id))
    .map((id) => freeze({ id, label: labelizeTrack(id) })),
]);

export const timelineSources = freeze({
  ...legacyTimelineSources,
  ...Object.fromEntries(chronologyResearch.map((research) => [`chapter${research.number}`, research.source])),
});

const hasExplicitEventDay = (research) => researchEvents(research).some((event) => Number.isFinite(event.day));
const maintainedPreVoyage = chronologyResearch.filter((research) => parseVoyageDay(research.voyageDay) === null && !hasExplicitEventDay(research));
const maintainedPreVoyageNumbers = new Set(maintainedPreVoyage.map((research) => research.number));
const legacyPreludeForChapter = (chapter) => legacySuccessionPrelude.find((period) => chapterNumbersFromSpec(period.chapters).includes(chapter));
const maintainedPrelude = maintainedPreVoyage.map((research) => {
  const legacy = legacyPreludeForChapter(research.number);
  const eventIds = (maintainedEventsByChapter.get(research.number) || []).map((event) => event.id);
  return freeze({
    id: `maintained-prelude-${research.number}`,
    date: legacy?.date || research.voyageDay || 'Pre-voyage',
    chapters: String(research.number),
    confidence: legacy?.confidence || research.confidence?.[0] || 'Maintained chapter research',
    title: research.title ? `Chapter ${research.number} · ${research.title}` : `Chapter ${research.number}`,
    detail: research.focus,
    points: freeze((maintainedEventsByChapter.get(research.number) || []).map((event) => event.title)),
    source: research.source,
    eventIds: freeze(eventIds),
    maintainedResearch: true,
  });
});
const uncoveredLegacyPrelude = legacySuccessionPrelude.filter((period) => !chapterNumbersFromSpec(period.chapters)
  .some((chapter) => maintainedPreVoyageNumbers.has(chapter)));
export const successionPrelude = freeze([
  ...maintainedPrelude,
  ...uncoveredLegacyPrelude,
].sort((left, right) => (chapterNumbersFromSpec(left.chapters)[0] || 0) - (chapterNumbersFromSpec(right.chapters)[0] || 0)));

const maintainedPreludeByChapter = new Map(maintainedPrelude.map((period) => [Number(period.chapters), period]));
export const successionPreludeEvents = freeze(maintainedPreVoyage.flatMap((research) => {
  const period = maintainedPreludeByChapter.get(research.number);
  return (maintainedEventsByChapter.get(research.number) || []).map((event) => freeze({
    ...event,
    day: null,
    date: period?.date || research.voyageDay || 'Pre-voyage',
    preludeId: period?.id || `maintained-prelude-${research.number}`,
    periodTitle: period?.title || research.title || `Chapter ${research.number}`,
  }));
}));

const dayByNumber = new Map(legacySuccessionDays.map((day) => [day.day, {
  ...day,
  events: [...day.events],
}]));
for (const research of chronologyResearch) {
  const defaultDayNumber = parseVoyageDay(research.voyageDay);
  const replacements = maintainedEventsByChapter.get(research.number) || [];
  const replacementsHaveExplicitDay = replacements.some((event) => Number.isFinite(event.day));
  if (defaultDayNumber === null && !replacementsHaveExplicitDay) continue;

  for (const day of dayByNumber.values()) {
    day.events = day.events.filter((event) => event.chapter !== research.number);
  }

  const replacementsByDay = new Map();
  for (const event of replacements) {
    const eventDayNumber = Number.isFinite(event.day) ? event.day : (parseVoyageDay(event.time) ?? defaultDayNumber);
    if (!Number.isFinite(eventDayNumber)) continue;
    const current = replacementsByDay.get(eventDayNumber) || [];
    current.push(event);
    replacementsByDay.set(eventDayNumber, current);
  }

  for (const [dayNumber, dayReplacements] of replacementsByDay.entries()) {
    const current = dayByNumber.get(dayNumber) || {
      day: dayNumber,
      date: `Voyage Day ${dayNumber}`,
      chapterRange: String(research.number),
      intensity: 5,
      deaths: 0,
      headline: research.title ? `Chapter ${research.number} · ${research.title}` : `Maintained voyage research · Chapter ${research.number}`,
      summary: research.focus,
      events: [],
    };
    current.events = [...replaceChapterEvents(current.events, research.number, dayReplacements)];
    if (!dayByNumber.has(dayNumber)) dayByNumber.set(dayNumber, current);
  }
}

export const successionDays = freeze([...dayByNumber.values()]
  .sort((left, right) => left.day - right.day)
  .map((day) => {
    const chapters = day.events.map((event) => event.chapter).filter(Number.isFinite);
    const start = chapters.length ? Math.min(...chapters) : chapterNumbersFromSpec(day.chapterRange)[0];
    const end = chapters.length ? Math.max(...chapters) : chapterNumbersFromSpec(day.chapterRange).at(-1);
    return freeze({
      ...day,
      chapterRange: start === end ? String(start) : `${start}–${end}`,
      events: freeze([...day.events].sort((left, right) => left.chapter - right.chapter)),
    });
  }));

const visibleMaintainedEventIds = new Set([
  ...successionPrelude.flatMap((period) => period.eventIds || []),
  ...successionDays.flatMap((day) => day.events.filter((event) => event.maintainedResearch).map((event) => event.id)),
]);
for (const research of chronologyResearch) {
  const missing = (maintainedEventsByChapter.get(research.number) || []).filter((event) => !visibleMaintainedEventIds.has(event.id));
  if (missing.length) {
    throw new Error(`Maintained Chapter ${research.number} chronology is missing from the public timeline surface: ${missing.map((event) => event.id).join(', ')}`);
  }
}

export const timelineEventCount = successionDays.reduce((total, day) => total + day.events.length, 0)
  + successionPreludeEvents.length;
