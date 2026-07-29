import {
  successionDays as legacySuccessionDays,
  successionPrelude,
  timelineSources as legacyTimelineSources,
  timelineTracks,
} from './successionTimelineLegacy.js';
import { succession414415TimelineEvents } from './succession414415Research.js';

export { successionPrelude, timelineTracks };

export const timelineSources = Object.freeze({
  ...legacyTimelineSources,
  chapter414: 'https://hunterxhunter.fandom.com/wiki/Chapter_414',
  chapter415: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
  viz414: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
  viz415: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
});

export const successionDays = Object.freeze(legacySuccessionDays.map((day) => {
  if (day.day !== 12) return day;
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
}));

export const timelineEventCount = successionDays.reduce((total, day) => total + day.events.length, 0);
