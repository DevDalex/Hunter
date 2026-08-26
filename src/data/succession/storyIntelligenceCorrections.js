import {
  storyCausalLinks,
  storyLaneProfiles,
  storyPhaseProfiles,
  storyThreadProfiles,
} from './storyIntelligenceFoundation.js';
import {
  contentDepthCurrentPhaseThreadIds418,
  contentDepthStoryThreads418,
} from './contentDepthStory418.js';

const threadId = 'story-thread:hisoka-chrollo-deathmatch-outcome';
const legacyJusticeId = 'location:black-whale:tier-1:justice-bureau';
const correctedJusticeId = 'location:black-whale:tier-2:justice-bureau';
const addUnique = (values, value) => Object.freeze([...new Set([...(values || []), value])]);
const addUniqueMany = (values, additions = []) => Object.freeze([...new Set([...(values || []), ...additions])]);
const remapJusticeLocations = (values = []) => Object.freeze(values.map((value) => value === legacyJusticeId ? correctedJusticeId : value));

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

const currentReleasePhase = Object.freeze({
  id: 'story-phase:current-releases-414-418',
  name: 'Current releases under martial law',
  summary: 'Chapters 414–418 move from Room 1014’s Woble crisis and Beyond-curse analysis into active Special Martial Law, Benjamin’s emergency campaign, TSK-17 and Justice consolidation, then Chapter 418’s non-linear reveal that Tserriednich survived the apparent Room 1004 execution through sustained-Zetsu Parallel Future perception and has begun an escape under a staged-death coffin cover.',
  chapterRange: Object.freeze({ start: 414, end: 418 }),
  laneIds: Object.freeze([
    'story-lane:royal-succession',
    'story-lane:woble-defense',
    'story-lane:nen-information-war',
    'story-lane:mafia-war',
    'story-lane:justice-military',
  ]),
  eventIds: Object.freeze([]),
  entityIds: Object.freeze([
    'character:benjamin-hui-guo-rou',
    'character:camilla-hui-guo-rou',
    'character:tserriednich-hui-guo-rou',
    'character:salkov',
    'character:theta',
    'character:oito-hui-guo-rou',
    'character:woble-hui-guo-rou',
    'character:kurapika',
    'character:balsamilco-might',
    'character:unma-hui-guo-rou',
    'character:halkenburg-hui-guo-rou',
  ]),
  organizationIds: Object.freeze([
    'organization:kakin-royal-family',
    'organization:kakin-military',
    'organization:kakin-justice-bureau',
  ]),
  locationIds: Object.freeze([
    'location:black-whale:tier-1',
    'location:black-whale:tier-1:room-1014',
    'location:black-whale:tier-1:room-1001',
    'location:black-whale:tier-1:room-1004',
  ]),
  threadIds: Object.freeze([
    'story-thread:succession-completion-condition',
    'story-thread:woble-guardian-beast',
    'story-thread:tserriednich-future-growth',
    'story-thread:martial-law-end-state',
    'story-thread:sarahell-curse-operation',
    ...contentDepthCurrentPhaseThreadIds418,
  ]),
  sourceIds: Object.freeze([
    'source:chapter-414',
    'source:chapter-415',
    'source:chapter-416',
    'source:chapter-417',
    'source:chapter-418',
  ]),
  status: 'documented',
});

export const correctedStoryThreadProfiles = Object.freeze({
  ...storyThreadProfiles,
  [threadId]: deathmatchOutcomeThread,
  ...contentDepthStoryThreads418,
});

export const correctedStoryLaneProfiles = Object.freeze(Object.fromEntries(
  Object.entries(storyLaneProfiles).map(([id, profile]) => {
    const depthThreadIds = Object.values(contentDepthStoryThreads418)
      .filter((thread) => thread.laneIds.includes(id))
      .map((thread) => thread.id);
    const withDeathmatch = deathmatchOutcomeThread.laneIds.includes(id)
      ? addUnique(profile.threadIds, threadId)
      : profile.threadIds;
    return [id, Object.freeze({
      ...profile,
      locationIds: remapJusticeLocations(profile.locationIds),
      threadIds: addUniqueMany(withDeathmatch, depthThreadIds),
    })];
  }),
));

const correctedBasePhases = Object.fromEntries(
  Object.entries(storyPhaseProfiles)
    .filter(([id]) => id !== 'story-phase:current-releases-414-417')
    .map(([id, profile]) => {
      if (id !== 'story-phase:heavens-arena-consequence') return [id, profile];
      return [id, Object.freeze({ ...profile, threadIds: addUnique(profile.threadIds, threadId) })];
    }),
);

export const correctedStoryPhaseProfiles = Object.freeze({
  ...correctedBasePhases,
  [currentReleasePhase.id]: currentReleasePhase,
});

export { storyCausalLinks };
