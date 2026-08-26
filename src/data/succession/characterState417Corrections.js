const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-417']);

const state = ({ characterId, life='alive', bodyState='living body', consciousnessState='active in own body', bodyStateCode='living', consciousnessStateCode='active', operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId=null, openQuestions=[], certainty='confirmed', loyaltyStateCode='operative' }) => freeze({
  id:`character-state:${characterId.replace('character:','')}:417`, characterId,
  chapterRange:freeze({ start:417,end:417 }), life, bodyState, consciousnessState,
  operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId,
  openQuestions:freeze(openQuestions), certainty, sourceIds, bodyStateCode,
  identityStateCode:'self', consciousnessStateCode, loyaltyStateCode,
});

export const characterState417CorrectionProfiles = freeze({
  'character:benjamin-hui-guo-rou': freeze([state({
    characterId:'character:benjamin-hui-guo-rou',
    operationalState:'Continues personally directing Special Martial Law after the Room 1004 assault; expands military headquarters into Justice, exposes Tubeppa and Tyson to TSK-17, re-arms Balsamilco and Coventoba, assigns investigations, reviews prince-by-prince elimination options, and ends by deciding to confront Unma over Furykov, Beyond, and Halkenburg.',
    protectionState:'Still protected by his military and Nen; carries active/visible curse burden and TSK-17 infection while remaining operational.',
    threatLevel:'critical / cursed / TSK-17 infected / active emergency ruler',
    nenKnowledge:'Uses inherited Secret Window in Chapter 417; reveals Gypsy Life: Bohemian Rhapsody mechanics; tells Balsamilco and Coventoba he may also be the target of Beyond’s curse attached to Furykov.',
    allegianceState:'First Prince / First Unit command / pursuing a lethal Special Martial Law endgame.',
    locationId:'location:black-whale:tier-1',
    openQuestions:['What happens when Benjamin’s stated half-day TSK-17 window expires?','What final effect will the Have-Not curse have?','Will the possible Beyond curse also target him?','What happens when he confronts Unma?']
  })]),
  'character:tserriednich-hui-guo-rou': freeze([state({
    characterId:'character:tserriednich-hui-guo-rou', life:'unknown', bodyState:'apparent body shot through the abdomen, stomped, and face crushed; scene reality disputed by Salkov', consciousnessState:'unknown', bodyStateCode:'unknown', consciousnessStateCode:'unknown',
    operationalState:'Benjamin treats Tserriednich as dead after shooting, stomping, and crushing the apparent body. Salkov, however, is actively testing whether the body and surrounding scene are an illusion.',
    protectionState:'Any protection from Tserriednich’s Zetsu-linked technique remains unresolved at the current publication ceiling.',
    threatLevel:'apparent fatal trauma / reality unresolved',
    nenKnowledge:'No new omniscient mechanic is confirmed. Salkov continues evaluating the hidden Zetsu-linked ability and plans to use Theta’s Nen-visible scar as a reality check.',
    allegianceState:'Fourth Prince household / apparent defeat under Benjamin assault.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['Is the battered body real?','Is Tserriednich actually dead?','What is Salkov currently seeing?','Does the staged-death plan continue?'], certainty:'unknown'
  })]),
  'character:salkov': freeze([state({
    characterId:'character:salkov',
    operationalState:'Remains kneeling through Benjamin’s attack, analyzes whether the body or Benjamin is illusory, plans to use Theta’s scar as a reality check, then is ordered detained with Danjin at the Central Justice Bureau.',
    protectionState:'Compliant and unarmed under Benjamin’s armed control; slated for Justice custody.',
    threatLevel:'high / detention / reality-analysis burden',
    nenKnowledge:'Treats Theta’s Nen-visible scar as a possible external reality check; no final answer is reached before the detention order.',
    allegianceState:'Tserriednich guard / secret keeper under Benjamin custody order.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['Can Salkov complete the Theta-scar test?','What exactly is real in Room 1004?']
  })]),
  'character:danjin': freeze([state({
    characterId:'character:danjin',
    operationalState:'Benjamin extends the Justice detention order to Danjin alongside Salkov.',
    protectionState:'Under Benjamin-side custody and escort control.',
    threatLevel:'detained / intelligence target',
    nenKnowledge:'No new personal ability use is shown in Chapter 417.',
    allegianceState:'Tserriednich household / Room 1014 Nen-class participant under detention order.',
    locationId:'location:black-whale:tier-1:room-1004',
    openQuestions:['What happens during Justice detention and questioning?']
  })]),
  'character:tubeppa-hui-guo-rou': freeze([state({
    characterId:'character:tubeppa-hui-guo-rou',
    operationalState:'Meets Benjamin in Room 1001, is covertly exposed to TSK-17, receives movement restrictions and inspection notice, and privately suspects both an inspection attack and a hidden motive behind Special Martial Law.',
    protectionState:'Restricted to living quarters/VVIP movement; allowed to accompany the requested inspection.',
    threatLevel:'critical / TSK-17 infected / Benjamin inspection risk',
    nenKnowledge:'No new personal ability is demonstrated; evaluates Benjamin’s Kurapika-hypothesis framing skeptically.',
    allegianceState:'Fifth Prince / distrustful of Benjamin and Camilla.',
    locationId:'location:black-whale:tier-1:room-1001',
    openQuestions:['How will TSK-17 progress?','What will happen during the inspections?']
  })]),
  'character:tyson-hui-guo-rou': freeze([state({
    characterId:'character:tyson-hui-guo-rou',
    operationalState:'Meets Benjamin in Room 1001, is covertly exposed to TSK-17, and is placed under the same movement restriction and inspection regime as Tubeppa.',
    protectionState:'Restricted to living quarters/VVIP movement and facing Benjamin’s inspection operation.',
    threatLevel:'critical / TSK-17 infected',
    nenKnowledge:'No new personal Nen mechanic is demonstrated in Chapter 417.',
    allegianceState:'Sixth Prince household under Benjamin’s emergency control.',
    locationId:'location:black-whale:tier-1:room-1001',
    openQuestions:['How will TSK-17 progress?','What happens during the inspection operation?']
  })]),
  'character:camilla-hui-guo-rou': freeze([state({
    characterId:'character:camilla-hui-guo-rou',
    operationalState:'Remains alive after the Chapter 416 confrontation and contacts the medical department; Benjamin observes this through Secret Window while planning to frame her as the aggressor.',
    protectionState:'Still possesses Cat’s Name as a direct-kill deterrent but remains TSK-17 infected.',
    threatLevel:'critical / TSK-17 infected / under Benjamin surveillance',
    nenKnowledge:'Benjamin actively surveils her via inherited Secret Window. Cat’s Name disease interaction remains unresolved.',
    allegianceState:'Second Prince / Camilla faction.',
    openQuestions:['What treatment does she seek?','How does TSK-17 interact with Cat’s Name?'], certainty:'confirmed'
  })]),
  'character:coventoba': freeze([state({
    characterId:'character:coventoba',
    operationalState:'Requests monitoring after reporting Zhang Lei coin manipulation, later meets Benjamin with Balsamilco and Chiyamasi, uses Gyo to inspect Benjamin, explains the coin at value 10, and takes up arms after Benjamin orders him to continue carrying it.',
    protectionState:'Back inside Benjamin’s command structure but openly concerned about lingering manipulation.',
    threatLevel:'high / possible residual manipulation / active armed duty',
    nenKnowledge:'Uses Gyo; reports knowledge of Zhang Lei coin behavior at displayed value 10.',
    allegianceState:'Benjamin soldier reactivated under direct command.',
    locationId:'location:black-whale:tier-1',
    openQuestions:['Are any manipulation effects still active?','Is Benjamin correct that the coin will not change further?']
  })]),
  'character:balsamilco-might': freeze([state({
    characterId:'character:balsamilco-might',
    operationalState:'Found unconscious in Room 1009, secured, regains consciousness, has identity verified, requests detention, later meets Benjamin, uses Gyo, raises residual-control concerns, re-arms, and takes responsibility for investigating Halkenburg through feather-mark evidence.',
    protectionState:'Operating with Benjamin’s First Unit after identity verification, while he and Coventoba remain concerned about lingering attack effects.',
    threatLevel:'high / recent identity-control incident / active investigation duty',
    nenKnowledge:'Uses Gyo and proposes identifying possible Halkenburg mind-swap participants via a feather on the back of their hands.',
    allegianceState:'Benjamin’s senior loyalist / First Unit command.',
    locationId:'location:black-whale:tier-1',
    openQuestions:['Are there lingering effects on Balsamilco?','Who carries the feather marker?','Where did Halkenburg’s consciousness go?']
  })]),
  'character:chiyamasi': freeze([state({
    characterId:'character:chiyamasi',
    operationalState:'Waits with Balsamilco, Coventoba, and other soldiers near Justice, then updates Benjamin on Zhang Lei’s reported movements during the securing operation.',
    protectionState:'Embedded in Benjamin’s Special Martial Law force.',
    threatLevel:'active military operation',
    nenKnowledge:'No new Muteking use is shown in Chapter 417.',
    allegianceState:'Benjamin-aligned soldier / active Justice operation.',
    locationId:'location:black-whale:tier-1',
    openQuestions:[]
  })]),
  'character:zhang-lei-hui-guo-rou': freeze([state({
    characterId:'character:zhang-lei-hui-guo-rou',
    operationalState:'Reported to have fled before Special Martial Law was declared; Benjamin receives movement updates and continues efforts to secure or eliminate/infect him.',
    protectionState:'Outside Benjamin’s Room 1001 consolidation; exact hiding location unresolved.',
    threatLevel:'fugitive prince / active Benjamin target',
    nenKnowledge:'Coventoba reports capabilities of Zhang Lei’s Guardian Spirit Beast coin at value 10.',
    allegianceState:'Third Prince faction / evading Benjamin control.',
    openQuestions:['Where is Zhang Lei?','What are the full consequences of the value-10 coin state?']
  })]),
  'character:luzurus-hui-guo-rou': freeze([state({
    characterId:'character:luzurus-hui-guo-rou',
    operationalState:'Reported to have fled before the Special Martial Law declaration with Ridge implicated in aiding the escape; Benjamin targets him for recovery and later elimination/infection.',
    protectionState:'Outside Benjamin’s direct custody; exact location unresolved.',
    threatLevel:'fugitive prince / active Benjamin target',
    nenKnowledge:'No new personal Nen mechanic is shown in Chapter 417.',
    allegianceState:'Seventh Prince faction / fugitive from Benjamin emergency control.',
    openQuestions:['Where is Luzurus?','How much did Ridge actually do to facilitate the escape?']
  })]),
  'character:unma-hui-guo-rou': freeze([state({
    characterId:'character:unma-hui-guo-rou',
    operationalState:'Not directly shown in Chapter 417, but becomes Benjamin’s intended confrontation target after he concludes she exploited Furykov’s uncertainty around Beyond’s curse to provoke Special Martial Law.',
    protectionState:'First Queen status; immediate location and protection detail are not supplied in the Chapter 417 synopsis.',
    threatLevel:'critical dynastic confrontation target',
    nenKnowledge:'No personal Nen ability is revealed.',
    allegianceState:'First Queen / Benjamin believes she acted to protect or advance Halkenburg.',
    openQuestions:['Is Benjamin’s interpretation of Unma’s role correct?','How will Unma respond to Benjamin’s threatened choice?'], certainty:'speaker-bounded-inference'
  })]),
});
