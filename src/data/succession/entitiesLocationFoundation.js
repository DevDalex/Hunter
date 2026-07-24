import { successionArchiveData as foundationData } from './entitiesEventFoundation.js';
import {
  locationFoundationExpansion,
  locationHistoryExpansion,
} from './locationFoundationExpansion.js';

const ARCHIVE_DATE = '2026-07-24';
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);

const locations = Object.freeze(uniqueById([
  ...foundationData.locations,
  ...locationFoundationExpansion,
]));

const locationHistory = Object.freeze(uniqueById([
  ...foundationData.locationHistory,
  ...locationHistoryExpansion,
]));

const chapters = foundationData.chapters;
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
  chapters,
});
