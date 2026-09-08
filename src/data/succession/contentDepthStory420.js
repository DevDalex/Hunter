import { contentDepthStoryThreads419 } from './contentDepthStory419.js';

const freeze = (value = []) => Object.freeze([...value]);
const resolveThread = (thread, { end=420, resolutionChapter=420, evidenceState, sourceIds=[] }) => Object.freeze({
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

const resolvedCasino = resolveThread(contentDepthStoryThreads419['story-thread:tserriednich-tier2-casino-route'],{
  evidenceState:'Chapter 420 resolves the immediate casino question by revealing a direct Hisoka encounter and a trail of throat-slit Royal Army corpses. The broader Tier 2 escape question remains open in a replacement thread because Tserriednich exits to the exterior Tier 1 area, finds the bridges gone, and must choose another strategy.',
  sourceIds:['source:chapter-420'],
});

const chapter420Threads = Object.freeze({
  'story-thread:tserriednich-hisoka-perception-anomaly':openThread({
    id:'story-thread:tserriednich-hisoka-perception-anomaly',name:'Hisoka detection of Tserriednich’s altered future state',
    question:'What exactly does Hisoka perceive when he notices something wrong during Tserriednich’s imposed future, checks the expected Guardian Spirit Beast position, and looks toward the real Tserriednich?',
    category:'reality-and-future-sight',start:420,laneIds:['story-lane:royal-succession','story-lane:nen-information-war','story-lane:troupe-hisoka'],entityIds:['character:tserriednich-hui-guo-rou','character:hisoka-morow'],abilityIds:['ability:parallel-future'],locationIds:['location:black-whale:tier-1:casino'],sources:[420],
    evidenceState:'Hisoka visibly reacts to an anomaly, but Chapter 420 does not establish whether he sees the Guardian Spirit Beast, the real Tserriednich, aura displacement, or only a general inconsistency, nor does it identify a named perception technique.',
  }),
  'story-thread:tserriednich-exterior-tier1-escape':openThread({
    id:'story-thread:tserriednich-exterior-tier1-escape',name:'Tserriednich exterior Tier 1 escape decision',
    question:'After finding the connecting bridges gone and the exterior route saturated with Royal Army soldiers, which option will Tserriednich choose and can he still reach Tier 2?',
    category:'escape-and-deception',start:420,laneIds:['story-lane:royal-succession','story-lane:justice-military','story-lane:nen-information-war'],entityIds:['character:tserriednich-hui-guo-rou'],abilityIds:['ability:parallel-future'],locationIds:['location:black-whale:tier-1'],sources:[420],
    evidenceState:'Chapter 420 ends with Tserriednich weighing a return, concealment until recharge, or dropping Zetsu to open two unrevealed options. No route is selected at the publication ceiling.',
  }),
  'story-thread:tserriednich-ability-duration-recharge':openThread({
    id:'story-thread:tserriednich-ability-duration-recharge',name:'Parallel Future duration and recharge pressure',
    question:'What is the exact usable duration, stored-aura depletion model, and recharge behavior of Tserriednich’s sustained future ability?',
    category:'nen-mechanics',start:420,laneIds:['story-lane:royal-succession','story-lane:nen-information-war'],entityIds:['character:tserriednich-hui-guo-rou'],abilityIds:['ability:parallel-future'],locationIds:['location:black-whale:tier-1'],sources:[419,420],
    evidenceState:'Chapter 420 makes duration pressure operationally important because Tserriednich judges his remaining time close to depletion and considers waiting for recharge or dropping Zetsu, but no exact numeric model is supplied.',
  }),
  'story-thread:hisoka-royal-army-corpse-trail':openThread({
    id:'story-thread:hisoka-royal-army-corpse-trail',name:'Hisoka and the Royal Army corpse trail',
    question:'Did Hisoka personally kill every throat-slit Royal Army soldier found across the casino and emergency-exit route?',
    category:'combat-attribution',start:420,laneIds:['story-lane:troupe-hisoka','story-lane:justice-military'],entityIds:['character:hisoka-morow','character:tserriednich-hui-guo-rou'],locationIds:['location:black-whale:tier-1:casino','location:black-whale:tier-1'],sources:[420],
    evidenceState:'The wounds are consistent and Tserriednich becomes confident that Hisoka caused the trail, but Chapter 420 does not directly depict every killing. Preserve this as strong in-universe attribution rather than omniscient confirmation.',
  }),
});

export const contentDepthStoryThreads420 = Object.freeze({
  ...contentDepthStoryThreads419,
  'story-thread:tserriednich-tier2-casino-route':resolvedCasino,
  ...chapter420Threads,
});

export const contentDepthCurrentPhaseThreadIds420 = freeze(Object.keys(contentDepthStoryThreads420));
