import { successionArchiveData as nenFoundationData } from './entitiesNenSystemFoundation.js';
import {
  correctedStoryLaneProfiles as storyLaneProfiles,
  correctedStoryPhaseProfiles as baseStoryPhaseProfiles,
  correctedStoryThreadProfiles as baseStoryThreadProfiles,
  storyCausalLinks,
} from './storyIntelligenceCorrections.js';
import {
  successionChapterResearch,
  successionChapterResearchByNumber,
} from './successionResearch.js';

const ARCHIVE_DATE = '2026-08-07';
const PENDING_PHASE_ID = 'story-phase:pending-current-release';
const PENDING_STORY_STATUS = 'Reader media indexed; detailed research pending verified chapter documentation';
const BORKSEN_AUTONOMY_THREAD_ID = 'story-thread:borksen-autonomy';
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);
const unique = (values) => [...new Set(values.filter(Boolean))];
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const basePhaseValues = Object.values(baseStoryPhaseProfiles);
const documentedPhaseValues = basePhaseValues.filter((profile) => profile.id !== PENDING_PHASE_ID && profile.status !== 'pending-maintained-research');
const lastDocumentedChapter = Math.max(...documentedPhaseValues.map((profile) => profile.chapterRange.end ?? profile.chapterRange.start));
const pendingChapters = nenFoundationData.chapters.filter((chapter) => chapter.number > lastDocumentedChapter);
const pendingTemplate = baseStoryPhaseProfiles[PENDING_PHASE_ID];
const generatedPendingPhase = pendingChapters.length
  ? Object.freeze({
    ...pendingTemplate,
    name: pendingChapters.length === 1 ? 'Current imported release pending annotation' : 'Imported releases pending annotation',
    summary: pendingChapters.length === 1
      ? 'The reader contains the current imported chapter, but detailed story claims remain pending maintained research review.'
      : `The reader contains Chapters ${pendingChapters[0].number}–${pendingChapters.at(-1).number}, but detailed story claims remain pending maintained research review.`,
    chapterRange: Object.freeze({ start: pendingChapters[0].number, end: pendingChapters.at(-1).number }),
    sourceIds: Object.freeze(unique(pendingChapters.flatMap((chapter) => chapter.sourceIds || []))),
    status: 'pending-maintained-research',
  })
  : null;

const storyPhaseProfiles = Object.freeze({
  ...Object.fromEntries(Object.entries(baseStoryPhaseProfiles).filter(([id]) => id !== PENDING_PHASE_ID)),
  ...(generatedPendingPhase ? { [PENDING_PHASE_ID]: generatedPendingPhase } : {}),
});

const storyThreadProfiles = Object.freeze({
  ...baseStoryThreadProfiles,
  [BORKSEN_AUTONOMY_THREAD_ID]: Object.freeze({
    ...baseStoryThreadProfiles[BORKSEN_AUTONOMY_THREAD_ID],
    name: 'Borksen autonomy inside Heil-Ly',
  }),
});

const phaseValues = Object.values(storyPhaseProfiles);
const laneValues = Object.values(storyLaneProfiles);
const threadValues = Object.values(storyThreadProfiles);
const causalLinkValues = [...storyCausalLinks];

const lookupAliases = (entity) => unique([entity.name, ...(entity.aliases || [])])
  .map(normalize)
  .filter((value) => value.length >= 3);
const characterLookup = nenFoundationData.characters.map((entity) => [entity, lookupAliases(entity)]);
const organizationLookup = nenFoundationData.organizations.map((entity) => [entity, lookupAliases(entity)]);
const locationLookup = nenFoundationData.locations.map((entity) => [entity, lookupAliases(entity)]);
const abilityLookup = nenFoundationData.abilities.map((entity) => [entity, lookupAliases(entity)]);
const mentionedIds = (text, lookup) => {
  const haystack = normalize(text);
  return unique(lookup
    .filter(([, aliases]) => aliases.some((alias) => haystack.includes(alias)))
    .map(([entity]) => entity.id));
};
const parseVoyageDay = (value) => {
  const match = String(value || '').match(/(?:voyage\s*)?day\s*(\d+)/i);
  return match ? Number(match[1]) : null;
};
const researchEventId = (chapter, event, index) => `event:research-${chapter}-${slugify(event.id || event.title || `signal-${index + 1}`)}`;
const chapterSourceId = (chapter) => `source:chapter-${chapter}`;

const maintainedEventIdsByChapter = new Map();
const maintainedEvents = [];
for (const research of successionChapterResearch) {
  if (!research?.coverage?.chronology || !research.events?.length) continue;
  const ids = [];
  research.events.forEach((event, index) => {
    const id = researchEventId(research.number, event, index);
    ids.push(id);
    const searchableText = `${event.title || ''} ${event.detail || ''} ${event.location || ''}`;
    maintainedEvents.push(Object.freeze({
      id,
      entityType: 'event',
      slug: id.replace(/^event:/, '').replaceAll(':', '-'),
      name: event.title || `Chapter ${research.number} maintained event ${index + 1}`,
      aliases: Object.freeze([]),
      summary: event.detail || research.focus,
      sourceIds: Object.freeze([chapterSourceId(research.number)]),
      publicationStatus: 'published',
      canonLevel: 'canon',
      createdAt: ARCHIVE_DATE,
      updatedAt: research.lastReviewed || ARCHIVE_DATE,
      category: event.tracks?.[0] || 'chapter-event',
      importance: 'major',
      chapterRange: Object.freeze({ start: research.number, end: research.number }),
      chronology: Object.freeze({ sequence: index + 1, day: parseVoyageDay(research.voyageDay), timeOfDay: event.time || null, certainty: 'confirmed' }),
      participantIds: Object.freeze(mentionedIds(searchableText, characterLookup)),
      organizationIds: Object.freeze(mentionedIds(searchableText, organizationLookup)),
      locationIds: Object.freeze(mentionedIds(event.location || searchableText, locationLookup)),
      abilityIds: Object.freeze(mentionedIds(searchableText, abilityLookup)),
      causes: Object.freeze([]),
      outcomes: Object.freeze([]),
      stateChanges: Object.freeze([]),
      openQuestions: Object.freeze([]),
      consequenceEventIds: Object.freeze([]),
      status: 'completed',
      maintainedResearch: true,
      maintainedEventId: event.id || null,
      confidence: event.confidence || null,
      researchLocation: event.location || null,
      researchTracks: Object.freeze([...(event.tracks || [])]),
    }));
  });
  maintainedEventIdsByChapter.set(research.number, Object.freeze(ids));
}

const maintainedEventIdSet = new Set(maintainedEvents.map((event) => event.id));
const events = Object.freeze([
  ...nenFoundationData.events.filter((event) => !maintainedEventIdSet.has(event.id)),
  ...maintainedEvents,
]);

const resolveResearchCharacters = (research) => unique((research?.characters || []).flatMap((name) => {
  const needle = normalize(name);
  const exact = characterLookup.find(([, aliases]) => aliases.includes(needle));
  return exact ? [exact[0].id] : [];
}));
const resolveResearchLocations = (research) => unique((research?.locations || []).flatMap((name) => mentionedIds(name, locationLookup)));

const chapters = Object.freeze(nenFoundationData.chapters.map((chapter) => {
  const research = successionChapterResearchByNumber.get(chapter.number);
  const phases = phaseValues.filter((profile) => includesChapter(profile.chapterRange, chapter.number));
  const pendingPhase = phases.some((profile) => profile.status === 'pending-maintained-research');
  const phaseLaneIds = unique(phases.flatMap((profile) => profile.laneIds));
  const lanes = laneValues.filter((profile) => phaseLaneIds.includes(profile.id) && includesChapter(profile.chapterRange, chapter.number));
  const laneIds = lanes.map((profile) => profile.id);
  const phaseThreadIds = unique(phases.flatMap((profile) => profile.threadIds));
  const threads = threadValues.filter((profile) => {
    if (profile.chapterRange.start > chapter.number) return false;
    if (profile.resolutionChapter !== null && chapter.number > profile.resolutionChapter) return false;
    return phaseThreadIds.includes(profile.id) || profile.laneIds.some((laneId) => laneIds.includes(laneId));
  });
  const maintainedEventIds = maintainedEventIdsByChapter.get(chapter.number) || [];
  const exactEventIds = new Set([...(chapter.eventIds || []), ...maintainedEventIds]);
  const incomingCausalLinkIds = causalLinkValues
    .filter((link) => exactEventIds.has(link.targetEventId))
    .map((link) => link.id);
  const outgoingCausalLinkIds = causalLinkValues
    .filter((link) => exactEventIds.has(link.sourceEventId))
    .map((link) => link.id);
  const researchCharacterIds = resolveResearchCharacters(research);
  const appearanceIds = new Set((chapter.appearanceRecords || []).map((record) => record.characterId));
  const researchAppearances = researchCharacterIds
    .filter((id) => !appearanceIds.has(id))
    .map((characterId) => Object.freeze({ characterId, role: 'maintained-chapter-research' }));
  const researchLocationIds = resolveResearchLocations(research);
  const maintainedChapterEvents = maintainedEvents.filter((event) => event.chapterRange.start === chapter.number);
  return Object.freeze({
    ...chapter,
    name: research?.title ? `Chapter ${chapter.number} · ${research.title}` : chapter.name,
    summary: research?.focus || chapter.summary,
    voyageDay: research?.voyageDay || chapter.voyageDay,
    lanes: Object.freeze([...(research?.lanes || chapter.lanes || [])]),
    appearanceRecords: Object.freeze([...(chapter.appearanceRecords || []), ...researchAppearances]),
    eventIds: Object.freeze(unique([...(chapter.eventIds || []), ...maintainedEventIds])),
    locationIds: Object.freeze(unique([
      ...(chapter.locationIds || []),
      ...researchLocationIds,
      ...maintainedChapterEvents.flatMap((event) => event.locationIds || []),
    ])),
    abilityIds: Object.freeze(unique([
      ...(chapter.abilityIds || []),
      ...maintainedChapterEvents.flatMap((event) => event.abilityIds || []),
    ])),
    organizationIds: Object.freeze(unique([
      ...(chapter.organizationIds || []),
      ...maintainedChapterEvents.flatMap((event) => event.organizationIds || []),
    ])),
    storyPhaseIds: Object.freeze(phases.map((profile) => profile.id)),
    storyLaneIds: Object.freeze(laneIds),
    storyThreadIds: Object.freeze(threads.map((profile) => profile.id)),
    incomingCausalLinkIds: Object.freeze(incomingCausalLinkIds),
    outgoingCausalLinkIds: Object.freeze(outgoingCausalLinkIds),
    storyIntelligenceStatus: research?.status || (pendingPhase ? PENDING_STORY_STATUS : phases[0]?.status || PENDING_STORY_STATUS),
    storyCoverage: Object.freeze({
      summary: Boolean(research?.coverage?.summary),
      chronology: Boolean(research?.coverage?.chronology),
      locations: Boolean(research?.coverage?.locations),
      source: Boolean(research?.coverage?.source),
      phase: phases.length === 1,
      lanes: lanes.length > 0 || pendingPhase,
      threads: threads.length > 0 || pendingPhase,
    }),
    updatedAt: research?.lastReviewed || ARCHIVE_DATE,
  });
}));

for (const research of successionChapterResearch) {
  if (!research?.coverage?.chronology || !research.events?.length) continue;
  const chapter = chapters.find((record) => record.number === research.number);
  const expected = maintainedEventIdsByChapter.get(research.number) || [];
  if (!chapter || expected.some((id) => !chapter.eventIds.includes(id))) {
    throw new Error(`Maintained Chapter ${research.number} chronology is not linked to the canonical chapter graph.`);
  }
}

export const successionArchiveData = Object.freeze({
  ...nenFoundationData,
  events,
  chapters,
  storyPhaseProfiles,
  storyLaneProfiles,
  storyThreadProfiles,
  storyCausalLinksById: Object.freeze(Object.fromEntries(causalLinkValues.map((link) => [link.id, link]))),
});