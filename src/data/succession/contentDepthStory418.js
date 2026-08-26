import { contentDepthStoryThreads417 } from './contentDepthStory417.js';

const freeze = (value = []) => Object.freeze([...value]);
const openThread = ({ id,name,question,category,start,laneIds=[],entityIds=[],eventIds=[],abilityIds=[],locationIds=[],sources=[],evidenceState='unresolved' }) => Object.freeze({
  id,name,question,category,
  chapterRange:Object.freeze({ start,end:null }),
  resolutionChapter:null,
  status:'open',
  laneIds:freeze(laneIds), entityIds:freeze(entityIds), eventIds:freeze(eventIds), abilityIds:freeze(abilityIds), locationIds:freeze(locationIds),
  sourceIds:freeze(sources.map((chapter)=>`source:chapter-${chapter}`)), evidenceState,
});

const resolvedRoom1004Reality = Object.freeze({
  ...contentDepthStoryThreads417['story-thread:tserriednich-room1004-reality'],
  question:'Was the battered Tserriednich body real, and what did Salkov’s Room 1004 uncertainty actually represent?',
  chapterRange:Object.freeze({ start:416,end:418 }),
  resolutionChapter:418,
  status:'resolved',
  sourceIds:Object.freeze(['source:chapter-416','source:chapter-417','source:chapter-418']),
  evidenceState:'Resolved in Chapter 418: Tserriednich is alive and mobile while Benjamin and other affected observers perceive the predicted/staged version of his execution. Salkov’s reality doubts were directionally correct, though his complete understanding remains unconfirmed.',
});

const chapter418Threads = Object.freeze({
  'story-thread:tserriednich-parallel-future-range': openThread({
    id:'story-thread:tserriednich-parallel-future-range',
    name:'Parallel Future range and collapse boundary',
    question:'What is the exact radius of Tserriednich’s sustained perception effect, what does the increasing static measure, and what happens when he or an outside observer crosses the boundary?',
    category:'reality-and-future-sight',
    start:418,
    laneIds:['story-lane:royal-succession','story-lane:nen-information-war'],
    entityIds:['character:tserriednich-hui-guo-rou'],
    abilityIds:['ability:parallel-future'],
    locationIds:['location:black-whale:tier-1:room-1004','location:black-whale:tier-1'],
    sources:[418],
    evidenceState:'Tserriednich observes stronger static with distance and proposes an antenna/sphere/boundary model, but the chapter ends before a controlled boundary or outside-observer test resolves it.',
  }),
  'story-thread:tserriednich-aura-battery': openThread({
    id:'story-thread:tserriednich-aura-battery',
    name:'Parallel Future stored-aura duration',
    question:'Is Tserriednich’s one-eleventh charge-to-operation estimate accurate, and how long can sustained post-future concealment actually last?',
    category:'nen-resource-countdown',
    start:418,
    laneIds:['story-lane:royal-succession','story-lane:nen-information-war'],
    entityIds:['character:tserriednich-hui-guo-rou'],
    abilityIds:['ability:parallel-future'],
    sources:[418],
    evidenceState:'Tserriednich estimates just under four hours remaining from his own one-eleventh model. No final drain point is observed.',
  }),
  'story-thread:tserriednich-route-a-escape': openThread({
    id:'story-thread:tserriednich-route-a-escape',
    name:'Tserriednich Route A escape',
    question:'Can Tserriednich leave Room 1004, remain concealed across the effect boundary, and successfully reach the royalty-reserved Route A without being identified?',
    category:'escape-and-deception',
    start:418,
    laneIds:['story-lane:royal-succession','story-lane:justice-military','story-lane:nen-information-war'],
    entityIds:['character:tserriednich-hui-guo-rou','character:benjamin-hui-guo-rou'],
    abilityIds:['ability:parallel-future'],
    locationIds:['location:black-whale:tier-1:room-1004','location:black-whale:tier-1'],
    sources:[418],
    evidenceState:'Tserriednich selects Route A after comparing Routes A, B, and C and leaves Room 1004, but the chapter ends before a successful route traversal or boundary crossing is shown.',
  }),
  'story-thread:theta-tserriednich-detection': openThread({
    id:'story-thread:theta-tserriednich-detection',
    name:'Theta perception of concealed Tserriednich',
    question:'Did Theta actually perceive Tserriednich at the Chapter 418 endpoint, or did her gaze only appear to meet him while she remained inside the sustained future effect?',
    category:'knowledge-and-perception',
    start:418,
    laneIds:['story-lane:royal-succession','story-lane:nen-information-war'],
    entityIds:['character:tserriednich-hui-guo-rou','character:theta'],
    abilityIds:['ability:parallel-future'],
    locationIds:['location:black-whale:tier-1:room-1004'],
    sources:[418],
    evidenceState:'Theta appears to look toward him, but walks directly past without reacting. Detection remains intentionally ambiguous.',
  }),
  'story-thread:tserriednich-coffin-deception': openThread({
    id:'story-thread:tserriednich-coffin-deception',
    name:'Tserriednich coffin deception',
    question:'How long can the no-viewing last will, gun-filled coffin, and 6 a.m. Voyage Day 13 transport plan keep Tserriednich’s survival hidden?',
    category:'deception-and-information-control',
    start:418,
    laneIds:['story-lane:royal-succession','story-lane:justice-military'],
    entityIds:['character:tserriednich-hui-guo-rou','character:salkov','character:nasubi-hui-guo-rou'],
    locationIds:['location:black-whale:tier-1:room-1004'],
    sources:[418],
    evidenceState:'The will is read, guns are used as coffin filler, and Salkov is assigned future transport. The chapter ends before the coffin reaches Nasubi or anyone verifies the body.',
  }),
});

export const contentDepthStoryThreads418 = Object.freeze({
  ...contentDepthStoryThreads417,
  'story-thread:tserriednich-room1004-reality':resolvedRoom1004Reality,
  ...chapter418Threads,
});

export const contentDepthCurrentPhaseThreadIds418 = freeze(Object.keys(contentDepthStoryThreads418));
