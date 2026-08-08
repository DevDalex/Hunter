import { successionArchiveData as foundationData } from './entitiesAbilityFoundation.js';
import { eventFoundationExpansion } from './eventFoundationExpansion.js';
import { eventFoundation370Expansion } from './eventFoundation370Expansion.js';
import { eventFoundation371Expansion } from './eventFoundation371Expansion.js';

const ARCHIVE_DATE = '2026-08-08';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? range.start);
const eventExpansions = Object.freeze([
  ...eventFoundationExpansion,
  ...eventFoundation370Expansion,
  ...eventFoundation371Expansion,
]);

const events = Object.freeze(uniqueById([
  ...foundationData.events,
  ...eventExpansions,
]));

const expandedEventIds = new Set(eventExpansions.map((event) => event.id));

const chapters = Object.freeze(foundationData.chapters.map((chapter) => {
  const linkedEvents = events.filter((event) => expandedEventIds.has(event.id) && includesChapter(event.chapterRange, chapter.number));
  if (linkedEvents.length === 0) return chapter;

  const appearanceRecords = new Map((chapter.appearanceRecords || []).map((appearance) => [appearance.characterId, appearance]));
  for (const participantId of linkedEvents.flatMap((event) => event.participantIds || [])) {
    if (!appearanceRecords.has(participantId)) {
      appearanceRecords.set(participantId, Object.freeze({ characterId: participantId, role: 'event participant' }));
    }
  }

  return Object.freeze({
    ...chapter,
    appearanceRecords: Object.freeze([...appearanceRecords.values()]),
    eventIds: Object.freeze(unique([
      ...(chapter.eventIds || []),
      ...linkedEvents.map((event) => event.id),
    ])),
    locationIds: Object.freeze(unique([
      ...(chapter.locationIds || []),
      ...linkedEvents.flatMap((event) => event.locationIds || []),
    ])),
    abilityIds: Object.freeze(unique([
      ...(chapter.abilityIds || []),
      ...linkedEvents.flatMap((event) => event.abilityIds || []),
    ])),
    organizationIds: Object.freeze(unique([
      ...(chapter.organizationIds || []),
      ...linkedEvents.flatMap((event) => event.organizationIds || []),
    ])),
    updatedAt: ARCHIVE_DATE,
  });
}));

export const successionArchiveData = Object.freeze({
  ...foundationData,
  events,
  chapters,
});
