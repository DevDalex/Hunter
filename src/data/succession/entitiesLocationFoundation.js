import { successionArchiveData as foundationData } from './entitiesEventFoundation.js';
import {
  locationFoundationExpansion,
  locationHistoryExpansion,
} from './locationFoundationExpansion.js';
import {
  isLegacyJusticeLocation386,
  locationFoundation386Corrections,
  remapJusticeLocation386,
  remapJusticeLocationId386,
} from './locationFoundation386Corrections.js';
import { locationFoundation395Expansion } from './locationFoundation395Expansion.js';
import { locationFoundation396Expansion } from './locationFoundation396Expansion.js';
import { locationFoundation397Expansion } from './locationFoundation397Expansion.js';
import { locationFoundation398Expansion } from './locationFoundation398Expansion.js';
import { locationFoundation399Expansion } from './locationFoundation399Expansion.js';
import { locationFoundation400Expansion } from './locationFoundation400Expansion.js';
import { locationFoundation401Expansion } from './locationFoundation401Expansion.js';
import { locationFoundation402Expansion } from './locationFoundation402Expansion.js';

const ARCHIVE_DATE = '2026-08-10';
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);
const remapLocationIds = (values = []) => Object.freeze([...new Set(values.map(remapJusticeLocationId386).filter(Boolean))]);

const locations = Object.freeze(uniqueById([
  ...foundationData.locations.filter((location) => !isLegacyJusticeLocation386(location.id)),
  ...locationFoundationExpansion.filter((location) => !isLegacyJusticeLocation386(location.id)),
  ...locationFoundation386Corrections,
  ...locationFoundation395Expansion,
  ...locationFoundation396Expansion,
  ...locationFoundation397Expansion,
  ...locationFoundation398Expansion,
  ...locationFoundation399Expansion,
  ...locationFoundation400Expansion,
  ...locationFoundation401Expansion,
  ...locationFoundation402Expansion,
]));

const locationHistory = Object.freeze(uniqueById([
  ...foundationData.locationHistory.map(remapJusticeLocation386),
  ...locationHistoryExpansion.map(remapJusticeLocation386),
]));

const events = Object.freeze(foundationData.events.map((event) => Object.freeze({
  ...event,
  locationIds: remapLocationIds(event.locationIds || []),
  updatedAt: (event.locationIds || []).some(isLegacyJusticeLocation386) ? ARCHIVE_DATE : event.updatedAt,
})));

const chapters = Object.freeze(foundationData.chapters.map((chapter) => Object.freeze({
  ...chapter,
  locationIds: remapLocationIds(chapter.locationIds || []),
  updatedAt: (chapter.locationIds || []).some(isLegacyJusticeLocation386) ? ARCHIVE_DATE : chapter.updatedAt,
})));

const latestChapter = chapters.at(-1)?.number || 414;
const historiesByCharacter = new Map();
for (const record of locationHistory) {
  const current = historiesByCharacter.get(record.characterId) || [];
  current.push(record);
  historiesByCharacter.set(record.characterId, current);
}

const characters = Object.freeze(foundationData.characters.map((character) => {
  const activeRecords = (historiesByCharacter.get(character.id) || [])
    .filter((record) => includesChapter(record.chapterRange, latestChapter))
    .sort((left, right) => right.chapterRange.start - left.chapterRange.start);
  const currentRecord = activeRecords[0];
  if (!currentRecord) return character;

  return Object.freeze({
    ...character,
    locationState: Object.freeze({
      locationId: currentRecord.locationId,
      asOfChapter: latestChapter,
      certainty: currentRecord.certainty,
      state: currentRecord.state,
      historyRecordId: currentRecord.id,
    }),
    updatedAt: ARCHIVE_DATE,
  });
}));

export const successionArchiveData = Object.freeze({
  ...foundationData,
  characters,
  locations,
  locationHistory,
  events,
  chapters,
});
