const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-419']);
const state = ({ characterId, operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId=null, openQuestions=[], certainty='confirmed' }) => freeze({
  id:`character-state:${characterId.replace('character:','')}:419`,characterId,chapterRange:freeze({start:419,end:419}),life:'alive',bodyState:'living body',consciousnessState:'active in own body',operationalState,protectionState,threatLevel,nenKnowledge,allegianceState,locationId,openQuestions:freeze(openQuestions),certainty,sourceIds,bodyStateCode:'living',identityStateCode:'self',consciousnessStateCode:'active',loyaltyStateCode:'operative',
});

export const characterState419CorrectionProfiles = freeze({
  'character:tserriednich-hui-guo-rou':freeze([state({
    characterId:'character:tserriednich-hui-guo-rou',
    operationalState:'Leaves Room 1004 under sustained concealment, measures an approximately thirty-six-meter practical field radius, fights through the shared VVIP corridor, tests outsider entry behavior, deliberately forces deactivation by crossing the boundary while maintaining Zetsu, then reroutes toward lower-tier access and reaches the Tier 1 VVIP casino.',
    protectionState:'Highly mobile and difficult to track through repeated Parallel Future use, disguise, perception divergence, and martial-law confusion; no longer continuously protected by the original Room 1004 field once he crosses its boundary.',
    threatLevel:'critical / armed / concealed / actively escaping through Tier 1',
    nenKnowledge:'Chapter 419 confirms a practical approximately thirty-six-meter influence radius, boundary-forced deactivation while Zetsu remains active, and the rule that observers outside the field at activation remain unaffected when entering later.',
    allegianceState:'Fourth Prince / independent escape under Special Martial Law.',
    locationId:'location:black-whale:tier-1:casino',
    openQuestions:['What happens at the casino?','Can he reach Tier 2?','How long can repeated activations continue before aura exhaustion?','Is the approximately thirty-six-meter radius geometrically exact?']
  })]),
  'character:camilla-hui-guo-rou':freeze([state({
    characterId:'character:camilla-hui-guo-rou',
    operationalState:'Not directly seen. Tserriednich speculates that the absence of nearby lookouts may mean she remains confined in the VVIP area or has already been executed by Benjamin.',
    protectionState:'Chapter 419 supplies no direct new observation of Camilla’s actual condition.',
    threatLevel:'critical / status unresolved in Tserriednich viewpoint',
    nenKnowledge:'No new Cat’s Name use or mechanic is shown.',
    allegianceState:'Second Prince / status unchanged except for Tserriednich speculation.',
    openQuestions:['Is Camilla still confined, alive elsewhere, or dead?'],certainty:'ambiguous'
  })]),
  'character:benjamin-hui-guo-rou':freeze([state({
    characterId:'character:benjamin-hui-guo-rou',
    operationalState:'Not directly seen. His Special Martial Law apparatus and Royal Army sweep continue shaping Tier 1 while Tserriednich remains at large despite the staged death.',
    protectionState:'Chapter 419 does not directly update Benjamin’s personal condition or ongoing afflictions.',
    threatLevel:'critical / emergency-command influence persists',
    nenKnowledge:'No new Benjamin ability use is shown; Chapter 419 does not show him learning the mechanics of Tserriednich’s escape.',
    allegianceState:'First Prince / Special Martial Law command.',
    openQuestions:['When does Benjamin learn that Tserriednich survived and escaped?']
  })]),
  'character:nasubi-hui-guo-rou':freeze([state({
    characterId:'character:nasubi-hui-guo-rou',
    operationalState:'Not directly seen. Royal Army personnel prioritize the King’s safety during the VVIP disturbance, creating an opening Tserriednich tries to exploit.',
    protectionState:'Receives priority Royal Army protection under Special Martial Law.',
    threatLevel:'high-value protected principal',
    nenKnowledge:'No new personal Nen information is shown.',
    allegianceState:'King of Kakin / protected royal principal.',
    openQuestions:['How does the VVIP disturbance affect Nasubi’s movement and security?']
  })]),
});
