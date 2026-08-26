const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-418']);

const state = ({ characterId, life='alive', bodyState='living body', consciousnessState='active in own body', bodyStateCode='living', consciousnessStateCode='active', operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId=null, openQuestions=[], certainty='confirmed', loyaltyStateCode='operative' }) => freeze({
  id:`character-state:${characterId.replace('character:','')}:418`, characterId,
  chapterRange:freeze({ start:418,end:418 }), life, bodyState, consciousnessState,
  operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId,
  openQuestions:freeze(openQuestions), certainty, sourceIds, bodyStateCode,
  identityStateCode:'self', consciousnessStateCode, loyaltyStateCode,
});

export const characterState418CorrectionProfiles = freeze({
  'character:tserriednich-hui-guo-rou': freeze([state({
    characterId:'character:tserriednich-hui-guo-rou',
    operationalState:'Confirmed alive during the Room 1004 execution sequence. Uses sustained Zetsu to keep affected observers following the predicted future, converts Benjamin’s apparent killing into a staged-death cover, writes a no-viewing will, changes clothes, arms himself, chooses Route A, and leaves Room 1004.',
    protectionState:'Protected by the still-active perception effect while inside its demonstrated Room 1004 influence; exact radius, outside-observer behavior, and remaining duration are unresolved.',
    threatLevel:'critical / concealed / armed / escape in progress',
    nenKnowledge:'Chapter 418 materially expands Parallel Future: ten-second extratemporal vision, object/person interaction limits, sustained-Zetsu continuation beyond ten seconds, alarm-resistant Zetsu, and Tserriednich’s unverified range/battery hypotheses.',
    allegianceState:'Fourth Prince / self-directed escape under Special Martial Law.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['What is the exact area of effect?','What happens when he crosses the boundary?','Can outside observers see him?','Did Theta perceive him?','Will he successfully reach Route A?']
  })]),
  'character:salkov': freeze([state({
    characterId:'character:salkov',
    operationalState:'Acts as Tserriednich’s unwitting timing/perception test subject, receives the gun/testimony instruction, watches the apparent execution, questions the sensory realism of the corpse, reads the last will, and is designated the sole coffin transporter for 6 a.m. Voyage Day 13.',
    protectionState:'Inside Room 1004 under military movement restrictions and asymmetric knowledge about Tserriednich’s ability.',
    threatLevel:'high / staged-death witness / future coffin duty',
    nenKnowledge:'Directly experiences the effects of Tserriednich’s sustained-Zetsu perception field but does not receive a complete explanation of its mechanics.',
    allegianceState:'Tserriednich guard / executing the prince’s apparent final instructions.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['How much does Salkov infer after the corpse and coffin anomalies?','Will the 6 a.m. transport occur as planned?']
  })]),
  'character:theta': freeze([state({
    characterId:'character:theta',
    operationalState:'Returned to Room 1004 after military inspection. Salkov warns her not to open the coffin; her gaze briefly makes concealed Tserriednich wonder whether she can see him, but she passes without confirmed recognition.',
    protectionState:'Inside the inspected Room 1004 household under Special Martial Law movement rules.',
    threatLevel:'high / ambiguous contact with concealed Tserriednich',
    nenKnowledge:'No new ability use is shown. Her possible perception of Tserriednich remains deliberately unresolved.',
    allegianceState:'Tserriednich personal guard / prior assassination conflict unresolved.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['Did Theta actually see Tserriednich?','Will she open or investigate the coffin later?'], certainty:'ambiguous'
  })]),
  'character:vantine': freeze([state({
    characterId:'character:vantine',
    operationalState:'Reports Benjamin-side forced-entry demands, later blames Salkov for the apparent death, and continues arguing while three real bullets fired by concealed Tserriednich crumple at his forehead without altering his perceived sequence.',
    protectionState:'Inside Room 1004 and demonstrably affected by Tserriednich’s sustained perception effect.',
    threatLevel:'high / armed-military environment / ability effect subject',
    nenKnowledge:'No personal ability is shown; his behavior supplies evidence about the object/person interaction limit of Parallel Future.',
    allegianceState:'Tserriednich household guard.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['What physical state do the crumpled bullets ultimately occupy after the effect collapses?']
  })]),
  'character:danjin': freeze([state({
    characterId:'character:danjin',
    operationalState:'Enters behind Vantine while covering his back during the forced-entry warning. Remains part of the Room 1004 household under Special Martial Law inspection and movement control.',
    protectionState:'Inside Room 1004 under royal army restrictions.',
    threatLevel:'high / martial-law custody pressure',
    nenKnowledge:'No new personal ability use is shown in Chapter 418.',
    allegianceState:'Tserriednich household guard.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['How does Chapter 417’s detention order reconcile with the non-linear Chapter 418 presentation after the Room 1004 inspection?']
  })]),
  'character:benjamin-hui-guo-rou': freeze([state({
    characterId:'character:benjamin-hui-guo-rou',
    operationalState:'Chapter 418 recontextualizes his Room 1004 assault: Benjamin believes he shoots and crushes Tserriednich, but the actual Fourth Prince remains alive nearby under sustained Parallel Future concealment. Benjamin leaves the room without being shown discovering the deception.',
    protectionState:'Continues under his military/Nen protection and active afflictions established in Chapter 417; Chapter 418 does not resolve those countdowns.',
    threatLevel:'critical / active emergency ruler / misinformed about Tserriednich death',
    nenKnowledge:'No new Benjamin ability is added. He remains unaware, within the supplied chapter, of the demonstrated sustained-Zetsu extension of Parallel Future.',
    allegianceState:'First Prince / Special Martial Law command.',
    locationId:'location:black-whale:tier-1',
    openQuestions:['When will Benjamin discover Tserriednich survived?','How does that discovery affect his martial-law strategy?']
  })]),
});
