import { successionArchiveData as foundationData } from './entitiesAbilityFoundation.js';
import { eventFoundationExpansion } from './eventFoundationExpansion.js';
import { eventFoundation370Expansion } from './eventFoundation370Expansion.js';
import { eventFoundation371Expansion } from './eventFoundation371Expansion.js';
import { eventFoundation372Expansion } from './eventFoundation372Expansion.js';
import { eventFoundation373Expansion } from './eventFoundation373Expansion.js';
import { eventFoundation374Expansion } from './eventFoundation374Expansion.js';
import { eventFoundation375Expansion } from './eventFoundation375Expansion.js';
import { eventFoundation376Expansion } from './eventFoundation376Expansion.js';
import { eventFoundation377Expansion } from './eventFoundation377Expansion.js';
import { eventFoundation378Expansion } from './eventFoundation378Expansion.js';
import { eventFoundation379Expansion } from './eventFoundation379Expansion.js';
import { eventFoundation380Expansion } from './eventFoundation380Expansion.js';
import { eventFoundation381Expansion } from './eventFoundation381Expansion.js';
import { eventFoundation382Expansion } from './eventFoundation382Expansion.js';
import { eventFoundation383Expansion } from './eventFoundation383Expansion.js';
import { eventFoundation384Expansion } from './eventFoundation384Expansion.js';
import { eventFoundation385Expansion } from './eventFoundation385Expansion.js';
import { eventFoundation386Expansion } from './eventFoundation386Expansion.js';
import { eventFoundation387Expansion } from './eventFoundation387Expansion.js';
import { eventFoundation388Expansion } from './eventFoundation388Expansion.js';
import { eventFoundation389Expansion } from './eventFoundation389Expansion.js';
import { eventFoundation390Expansion } from './eventFoundation390Expansion.js';
import { eventFoundation391Expansion } from './eventFoundation391Expansion.js';
import { eventFoundation391Corrections } from './eventFoundation391Corrections.js';
import { eventFoundation392Expansion } from './eventFoundation392Expansion.js';
import { eventFoundation393Expansion } from './eventFoundation393Expansion.js';
import { eventFoundation394Expansion } from './eventFoundation394Expansion.js';
import { eventFoundation395Expansion } from './eventFoundation395Expansion.js';

const ARCHIVE_DATE = '2026-08-10';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? range.start);
const eventExpansions = Object.freeze([
  ...eventFoundationExpansion,
  ...eventFoundation370Expansion,
  ...eventFoundation371Expansion,
  ...eventFoundation372Expansion,
  ...eventFoundation373Expansion,
  ...eventFoundation374Expansion,
  ...eventFoundation375Expansion,
  ...eventFoundation376Expansion,
  ...eventFoundation377Expansion,
  ...eventFoundation378Expansion,
  ...eventFoundation379Expansion,
  ...eventFoundation380Expansion,
  ...eventFoundation381Expansion,
  ...eventFoundation382Expansion,
  ...eventFoundation383Expansion,
  ...eventFoundation384Expansion,
  ...eventFoundation385Expansion,
  ...eventFoundation386Expansion,
  ...eventFoundation387Expansion,
  ...eventFoundation388Expansion,
  ...eventFoundation389Expansion,
  ...eventFoundation390Expansion,
  ...eventFoundation391Expansion,
  ...eventFoundation391Corrections,
  ...eventFoundation392Expansion,
  ...eventFoundation393Expansion,
  ...eventFoundation394Expansion,
  ...eventFoundation395Expansion,
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
