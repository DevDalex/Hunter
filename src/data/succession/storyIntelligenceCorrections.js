import {
  storyCausalLinks,
  storyLaneProfiles,
  storyPhaseProfiles,
  storyThreadProfiles,
} from './storyIntelligenceFoundation.js';

const threadId = 'story-thread:hisoka-chrollo-deathmatch-outcome';
const addUnique = (values, value) => Object.freeze([...new Set([...(values || []), value])]);

const deathmatchOutcomeThread = Object.freeze({
  id: threadId,
  name: 'Hisoka–Chrollo death-match outcome',
  question: 'Which fighter will survive Chrollo’s prepared multi-ability battle plan, and what consequence will the result create for the Phantom Troupe?',
  category: 'combat-outcome',
  chapterRange: Object.freeze({ start: 351, end: 357 }),
  resolutionChapter: 357,
  status: 'resolved',
  laneIds: Object.freeze(['story-lane:troupe-hisoka', 'story-lane:nen-information-war']),
  entityIds: Object.freeze(['character:hisoka-morow', 'character:chrollo-lucilfer']),
  eventIds: Object.freeze([]),
  abilityIds: Object.freeze([]),
  locationIds: Object.freeze([]),
  sourceIds: Object.freeze(['source:chapter-351', 'source:chapter-357']),
  evidenceState: 'Resolved when Hisoka revives after the battle and declares that he will hunt the Phantom Troupe on sight.',
});

export const correctedStoryThreadProfiles = Object.freeze({
  ...storyThreadProfiles,
  [threadId]: deathmatchOutcomeThread,
});

export const correctedStoryLaneProfiles = Object.freeze(Object.fromEntries(
  Object.entries(storyLaneProfiles).map(([id, profile]) => {
    if (!deathmatchOutcomeThread.laneIds.includes(id)) return [id, profile];
    return [id, Object.freeze({ ...profile, threadIds: addUnique(profile.threadIds, threadId) })];
  }),
));

export const correctedStoryPhaseProfiles = Object.freeze(Object.fromEntries(
  Object.entries(storyPhaseProfiles).map(([id, profile]) => {
    if (id !== 'story-phase:heavens-arena-consequence') return [id, profile];
    return [id, Object.freeze({ ...profile, threadIds: addUnique(profile.threadIds, threadId) })];
  }),
));

export { storyCausalLinks };
