import { contentDepthStoryThreads418 } from './contentDepthStory418.js';

const freeze = (value = []) => Object.freeze([...value]);
const resolveThread = (thread, { end=419, resolutionChapter=419, evidenceState, sourceIds=[] }) => Object.freeze({
  ...thread,
  chapterRange:Object.freeze({ start:thread.chapterRange.start,end }),
  resolutionChapter,
  status:'resolved',
  sourceIds:Object.freeze([...new Set([...(thread.sourceIds || []), ...sourceIds])]),
  evidenceState,
});
const openThread = ({id,name,question,category,start,laneIds=[],entityIds=[],eventIds=[],abilityIds=[],locationIds=[],sources=[],evidenceState='unresolved'}) => Object.freeze({
  id,name,question,category,chapterRange:Object.freeze({start,end:null}),resolutionChapter:null,status:'open',laneIds:freeze(laneIds),entityIds:freeze(entityIds),eventIds:freeze(eventIds),abilityIds:freeze(abilityIds),locationIds:freeze(locationIds),sourceIds:freeze(sources.map((chapter)=>`source:chapter-${chapter}`)),evidenceState,
});

const resolvedRange = resolveThread(contentDepthStoryThreads418['story-thread:tserriednich-parallel-future-range'],{
  evidenceState:'Chapter 419 establishes an approximately thirty-six-meter practical boundary from the Room 1004/Room 1006 observer split, demonstrates boundary-forced deactivation while Zetsu remains active, and confirms that observers outside the field at activation remain unaffected after entering it later. Exact geometry and other membership edge cases remain open in separate threads.',
  sourceIds:['source:chapter-419'],
});
const resolvedRouteA = resolveThread(contentDepthStoryThreads418['story-thread:tserriednich-route-a-escape'],{
  evidenceState:'Chapter 419 shows that the original Route A plan is not completed. Tserriednich instead exploits the VVIP disturbance and seeks a lower-tier route through the entertainment-area connecting passage, ending the chapter at the casino.',
  sourceIds:['source:chapter-419'],
});

const chapter419Threads = Object.freeze({
  'story-thread:tserriednich-field-membership-edge-cases':openThread({
    id:'story-thread:tserriednich-field-membership-edge-cases',name:'Parallel Future field-membership edge cases',
    question:'Beyond the demonstrated outsider-entry case, how are observers assigned to or removed from a sustained Parallel Future influence set when they leave, re-enter, or when Tserriednich retriggers the ability?',
    category:'reality-and-future-sight',start:419,laneIds:['story-lane:royal-succession','story-lane:nen-information-war'],entityIds:['character:tserriednich-hui-guo-rou'],abilityIds:['ability:parallel-future'],locationIds:['location:black-whale:tier-1'],sources:[419],
    evidenceState:'Chapter 419 confirms that a person outside at activation stays unaffected after entering later, but does not exhaustively test leave/re-entry, repeated activation membership, or full field geometry.',
  }),
  'story-thread:tserriednich-tier2-casino-route':openThread({
    id:'story-thread:tserriednich-tier2-casino-route',name:'Tserriednich casino and Tier 2 escape route',
    question:'What happens after Tserriednich reaches the Tier 1 casino, and can he use the entertainment-area passage to descend to Tier 2 during the Royal Army sweep?',
    category:'escape-and-deception',start:419,laneIds:['story-lane:royal-succession','story-lane:justice-military','story-lane:nen-information-war'],entityIds:['character:tserriednich-hui-guo-rou'],abilityIds:['ability:parallel-future'],locationIds:['location:black-whale:tier-1:casino','location:black-whale:tier-1'],sources:[419],
    evidenceState:'Tserriednich changes plans under the VVIP lockdown and reaches the casino, but the chapter ends before any casino encounter or Tier 2 descent.',
  }),
  'story-thread:royal-army-tserriednich-countermeasure':openThread({
    id:'story-thread:royal-army-tserriednich-countermeasure',name:'Royal Army response to impossible VVIP perceptions',
    question:'Will the Royal Army identify the VVIP anomaly as Nen, and can its thermal-scope/gas-mask countermeasures meaningfully track Tserriednich?',
    category:'military-countermeasure',start:419,laneIds:['story-lane:justice-military','story-lane:nen-information-war'],entityIds:['character:tserriednich-hui-guo-rou'],abilityIds:['ability:parallel-future'],locationIds:['location:black-whale:tier-1'],sources:[419],
    evidenceState:'Soldiers compare matching impossible combat scenes, initially suspect advanced technology, and request gas masks and thermal scopes. No successful identification or countermeasure is shown.',
  }),
});

export const contentDepthStoryThreads419 = Object.freeze({
  ...contentDepthStoryThreads418,
  'story-thread:tserriednich-parallel-future-range':resolvedRange,
  'story-thread:tserriednich-route-a-escape':resolvedRouteA,
  ...chapter419Threads,
});

export const contentDepthCurrentPhaseThreadIds419 = freeze(Object.keys(contentDepthStoryThreads419));
