import { successionArchiveData as nenFoundationData } from './entitiesNenSystemFoundation.js';
import {
  correctedStoryLaneProfiles as storyLaneProfiles,
  correctedStoryPhaseProfiles as storyPhaseProfiles,
  correctedStoryThreadProfiles as storyThreadProfiles,
  storyCausalLinks,
} from './storyIntelligenceCorrections.js';
import { successionChapterResearchByNumber } from './successionResearch.js';

const ARCHIVE_DATE = '2026-07-25';
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);
const unique = (values) => [...new Set(values.filter(Boolean))];

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
