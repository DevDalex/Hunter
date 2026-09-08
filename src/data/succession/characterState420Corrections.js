const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-420']);
const state = ({ characterId, life='alive', bodyState='living body', consciousnessState='active in own body', operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId=null, openQuestions=[], certainty='confirmed', loyaltyStateCode='operative' }) => freeze({
  id:`character-state:${characterId.replace('character:','')}:420`, characterId,
  chapterRange:freeze({start:420,end:420}), life, bodyState, consciousnessState,
  operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId,
  openQuestions:freeze(openQuestions), certainty, sourceIds,
  bodyStateCode:life === 'alive' ? 'living' : 'dead', identityStateCode:'self', consciousnessStateCode:life === 'alive' ? 'active' : 'inactive', loyaltyStateCode,
});

export const characterState420CorrectionProfiles = freeze({
  'character:tserriednich-hui-guo-rou':freeze([state({
    characterId:'character:tserriednich-hui-guo-rou',
    operationalState:'Continues his Tier 1 escape in sustained Zetsu, discovers a throat-slit Royal Army corpse trail, directly encounters Hisoka in the VVIP casino, avoids a predicted lethal future, becomes newly motivated to reduce Zetsu activation below one second, then exits through the emergency route to the exterior Tier 1 main deck where missing bridges and dense Royal Army presence force another strategic reassessment.',
    protectionState:'Self-protected through advanced Parallel Future use, concealment, firearms, tactical movement, and rapid future divergence; practical operating time is now treated by Tserriednich as close to depletion under a conservative estimate.',
    threatLevel:'critical / armed / concealed / advanced future-sight user / actively escaping under martial law',
    nenKnowledge:'Chapter 420 demonstrates lethal-future divergence against Hisoka, tactical reuse of the approximately thirty-six-meter operating estimate, continued sustained-Zetsu operation, an explicit sub-one-second Zetsu training target, and a practical recharge/duration pressure. Hisoka’s apparent anomaly detection remains mechanistically unresolved.',
    allegianceState:'Fourth Prince / independent escape and self-directed Nen development under Special Martial Law.',
    locationId:'location:black-whale:tier-1',
    openQuestions:['What are the two options opened by dropping Zetsu?','Can he cross from Tier 1 after finding the bridges gone?','What exactly did Hisoka perceive?','What is the exact remaining-duration/recharge model?']
  })]),
  'character:hisoka-morow':freeze([state({
    characterId:'character:hisoka-morow',
    operationalState:'Confirmed in the Tier 1 VVIP casino during Special Martial Law. He is seen gambling amid a trail of Royal Army corpses, rapidly repositions behind Tserriednich, appears in Tserriednich’s predicted future as killing him, then reacts to an unexplained Nen/perception anomaly before walking away from the real Tserriednich. His exact position after leaving the encounter is not supplied.',
    protectionState:'Self-protected elite Nen combatant moving freely through a militarized Tier 1 environment; no formal allied protection network is shown.',
    threatLevel:'extreme independent combat threat / capable of immediately overwhelming Tserriednich in the predicted line',
    nenKnowledge:'Chapter 420 does not reveal a new named Hisoka ability. His reaction suggests he detects some inconsistency involving Tserriednich’s imposed future and/or Guardian Spirit Beast, but the exact sensory mechanism is unresolved and must not be labelled as a confirmed technique.',
    allegianceState:'Independent / actively seeking Spider-related targets according to his own priorities.',
    locationId:'location:black-whale:tier-1',
    openQuestions:['Did he perceive the Guardian Spirit Beast, the real Tserriednich, or only a general anomaly?','Did he cause the entire throat-slit Royal Army corpse trail?','Why did he walk away after apparently detecting something?']
  })]),
  'character:nasubi-hui-guo-rou':freeze([state({
    characterId:'character:nasubi-hui-guo-rou',
    operationalState:'Not directly seen. Tserriednich speculates that the casino may be empty of soldiers because Royal Army forces have been redirected to protect the King during the Tier 1 emergency.',
    protectionState:'Royal Army protection remains a central martial-law priority, but Chapter 420 does not directly show Nasubi’s exact location or condition.',
    threatLevel:'high-value protected principal',
    nenKnowledge:'No new personal Nen information is shown.',
    allegianceState:'King of Kakin / protected royal principal.',
    openQuestions:['Where is Nasubi during the Tier 1 emergency and how is his protection affecting troop deployment?'],certainty:'ambiguous'
  })]),
});
