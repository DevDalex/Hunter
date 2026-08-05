import {
  successionDays as legacySuccessionDays,
  successionPrelude,
  timelineSources as legacyTimelineSources,
  timelineTracks,
} from './successionTimelineLegacy.js';
import { succession400TimelineEvents } from './succession400Research.js';
import { succession414415TimelineEvents } from './succession414415Research.js';

export { successionPrelude, timelineTracks };

const replaceChapterEvents = (events, chapter, replacements) => {
  const insertionIndex = events.findIndex((event) => event.chapter === chapter);
  const filtered = events.filter((event) => event.chapter !== chapter);
  if (insertionIndex < 0) return Object.freeze([...filtered, ...replacements]);
  return Object.freeze([
    ...filtered.slice(0, insertionIndex),
    ...replacements,
    ...filtered.slice(insertionIndex),
  ]);
};

export const timelineSources = Object.freeze({
  ...legacyTimelineSources,
  chapter400: 'https://hunterxhunter.fandom.com/wiki/Chapter_400',
  chapter414: 'https://hunterxhunter.fandom.com/wiki/Chapter_414',
  chapter415: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
  viz414: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
  viz415: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
});

export const successionDays = Object.freeze(legacySuccessionDays.map((day) => {
  if (day.day === 10) {
    return Object.freeze({
      ...day,
      events: replaceChapterEvents(day.events, 400, succession400TimelineEvents),
    });
  }
  if (day.day === 12) {
    return Object.freeze({
      ...day,
      chapterRange: '405–415',
      intensity: 10,
      headline: 'Martial law closes around the royal rooms',
      summary: 'The funeral and ritual deadline give way to the actual-Woble search, coded outside contact, Beyond’s curse mechanics, forced royal relocations, disappearances, and conditional confinement under special martial law.',
      events: Object.freeze([
        ...day.events,
        ...succession414415TimelineEvents,
      ]),
    });
  }
  return day;
}));

export const timelineEventCount = successionDays.reduce((total, day) => total + day.events.length, 0);
