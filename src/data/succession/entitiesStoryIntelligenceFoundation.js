import { successionArchiveData as nenFoundationData } from './entitiesNenSystemFoundation.js';
import {
  correctedStoryLaneProfiles as storyLaneProfiles,
  correctedStoryPhaseProfiles as baseStoryPhaseProfiles,
  correctedStoryThreadProfiles as baseStoryThreadProfiles,
  storyCausalLinks,
} from './storyIntelligenceCorrections.js';
import { successionChapterResearchByNumber } from './successionResearch.js';

const ARCHIVE_DATE = '2026-07-25';
const PENDING_PHASE_ID = 'story-phase:pending-current-release';
const BORKSEN_AUTONOMY_THREAD_ID = 'story-thread:borksen-autonomy';
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);
const unique = (values) => [...new Set(values.filter(Boolean))];

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

const chapters = Object.freeze(nenFoundationData.chapters.map((chapter) => {
  const phases = phaseValues.filter((profile) => includesChapter(profile.chapterRange, chapter.number));
  const phaseLaneIds = unique(phases.flatMap((profile) => profile.laneIds));
  const lanes = laneValues.filter((profile) => phaseLaneIds.includes(profile.id) && includesChapter(profile.chapterRange, chapter.number));
  const laneIds = lanes.map((profile) => profile.id);
  const phaseThreadIds = unique(phases.flatMap((profile) => profile.threadIds));
  const threads = threadValues.filter((profile) => {
    if (profile.chapterRange.start > chapter.number) return false;
    if (profile.resolutionChapter !== null && chapter.number > profile.resolutionChapter) return false;
    return phaseThreadIds.includes(profile.id) || profile.laneIds.some((laneId) => laneIds.includes(laneId));
  });
  const exactEventIds = new Set(chapter.eventIds || []);
  const incomingCausalLinkIds = causalLinkValues
    .filter((link) => exactEventIds.has(link.targetEventId))
    .map((link) => link.id);
  const outgoingCausalLinkIds = causalLinkValues
    .filter((link) => exactEventIds.has(link.sourceEventId))
    .map((link) => link.id);
  const research = successionChapterResearchByNumber.get(chapter.number);
  return Object.freeze({
    ...chapter,
    storyPhaseIds: Object.freeze(phases.map((profile) => profile.id)),
    storyLaneIds: Object.freeze(laneIds),
    storyThreadIds: Object.freeze(threads.map((profile) => profile.id)),
    incomingCausalLinkIds: Object.freeze(incomingCausalLinkIds),
    outgoingCausalLinkIds: Object.freeze(outgoingCausalLinkIds),
    storyIntelligenceStatus: research?.status || phases[0]?.status || 'pending-maintained-research',
    storyCoverage: Object.freeze({
      summary: Boolean(research?.coverage?.summary),
      chronology: Boolean(research?.coverage?.chronology),
      locations: Boolean(research?.coverage?.locations),
      source: Boolean(research?.coverage?.source),
      phase: phases.length === 1,
      lanes: lanes.length > 0 || phases.some((profile) => profile.status === 'pending-maintained-research'),
      threads: threads.length > 0 || phases.some((profile) => profile.status === 'pending-maintained-research'),
    }),
    updatedAt: ARCHIVE_DATE,
  });
}));

export const successionArchiveData = Object.freeze({
  ...nenFoundationData,
  chapters,
  storyPhaseProfiles,
  storyLaneProfiles,
  storyThreadProfiles,
  storyCausalLinksById: Object.freeze(Object.fromEntries(causalLinkValues.map((link) => [link.id, link]))),
});
