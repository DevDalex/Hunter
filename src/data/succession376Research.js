const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_376';

export const succession376SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 376 synopsis and chapter notes',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, time = 'Voyage Day 3', location = 'Black Whale · Tier 1', confidence = 'confirmed' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 376,
  confidence,
  source,
});

export const succession376TimelineEvents = freeze([
  event({ id: '376-halkenburg-denied-access', title: 'Halkenburg is denied direct access to Nasubi', detail: 'Halkenburg reaches the VVIP gate seeking another audience with Nasubi but is told that princes may only meet the king at the Sunday banquets.', tracks: ['halkenburg', 'nasubi', 'succession-contest', 'royal-protocol'], location: 'Black Whale · Tier 1 · VVIP gate' }),
  event({ id: '376-halkenburg-letter-campaign', title: 'Halkenburg submits a letter and vows to return every day', detail: 'After being denied entry, Halkenburg gives the gate guard a letter for Nasubi and says he will return every day with another letter until he is allowed to speak with his father. Benjamin’s surveillance side is informed of the attempt.', tracks: ['halkenburg', 'nasubi', 'benjamin', 'appeal', 'surveillance'], location: 'Black Whale · Tier 1 · VVIP gate' }),
  event({ id: '376-benjamin-camilla-court', title: 'Benjamin and Camilla present competing self-defense narratives before Cleapatro', detail: 'Camilla’s side argues that Musse attacked first and that her later actions were self-defense, while Balsamilco states that Camilla attacked Benjamin. Both sides request searches of the opposing prince’s room.', tracks: ['benjamin', 'camilla', 'cleapatro', 'court', 'musse', 'wolfe'], location: 'Black Whale · Tier 1 · court' }),
  event({ id: '376-court-surveillance-order', title: 'Cleapatro postpones the case and places both princes under surveillance', detail: 'The trial is postponed. Cleapatro orders Benjamin and Camilla confined and monitored in the VVIP area while the Royal Army searches Rooms 1001 and 1002 and the Musse question remains unresolved.', tracks: ['benjamin', 'camilla', 'cleapatro', 'royal-army', 'court'], location: 'Black Whale · Tier 1 · VVIP area' }),
  event({ id: '376-secret-window-camilla-monitoring', title: 'Benjamin relies on Secret Window to monitor Camilla', detail: 'Balsamilco is frustrated by the court outcome, but Benjamin considers the surveillance situation manageable because he can continue watching Camilla through the inherited Secret Window ability.', tracks: ['benjamin', 'camilla', 'secret-window', 'musse', 'surveillance'], location: 'Black Whale · Tier 1 · Benjamin command' }),
  event({ id: '376-day3-marker', title: 'The voyage reaches 46 hours after departure', detail: 'The supplied chapter notes place this point at Voyage Day 3, 10:05 a.m., forty-six hours after the Black Whale departed.', tracks: ['black-whale', 'voyage-clock'], time: 'Voyage Day 3 · 10:05 a.m. · 46 hours after departure', location: 'Black Whale' }),
  event({ id: '376-myuhan-killed', title: 'Silent Majority kills Myuhan during Kurapika’s Nen course', detail: 'Myuhan becomes the second confirmed class participant killed by Silent Majority after Barrigen. The user remains unidentified.', tracks: ['silent-majority', 'myuhan', 'kurapika', 'nen-class', 'assassination'], time: 'Voyage Day 3 · after 10:05 a.m.', location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '376-course-suspicion-escalates', title: 'Maor and Satobi openly suspect Kurapika’s Nen course is an elimination scheme', detail: 'After Myuhan’s death, Maor and Satobi argue that the class may be a plan to remove other princes’ personnel. Kurapika recognizes that the suspicion is plausible enough that he cannot simply dismiss it.', tracks: ['kurapika', 'maor', 'satobi', 'nen-class', 'distrust'], time: 'Voyage Day 3', location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '376-belerainte-defends-course', title: 'Belerainte defends Kurapika and argues that canceling the class would reward the assassin', detail: 'Belerainte tells the group that the Hunters are doing their jobs and argues that canceling the course would let the hidden assassin escape while causing the protective mission to fail.', tracks: ['belerainte', 'kurapika', 'hunter-association', 'nen-class', 'alliance'], time: 'Voyage Day 3', location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '376-belerainte-room1013-report', title: 'Belerainte uses Bill as a conversational cover to report back toward Room 1013', detail: 'Belerainte asks Bill for ten minutes so he can discuss matters naturally near the door and pass information back toward Hanzo, Vergei, and the hidden Room 1013 group without making the contact look suspicious. He encourages Kurapika to continue the classes and save as many princes as possible.', tracks: ['belerainte', 'bill', 'hanzo', 'vergei', 'room-1013', 'counterintelligence'], time: 'Voyage Day 3', location: 'Black Whale · Tier 1 · Room 1014 / Room 1013 boundary' }),
  event({ id: '376-kacho-melody-mosquitone', title: 'Kacho and Melody establish covert Mosquitone Morse-code communication', detail: 'Kacho disguises the exchange as studying while using a Mosquitone device and Morse code that nearby adults cannot hear. Melody follows Kacho’s directions to the kitchen, finds a second device for herself, and recognizes how seriously Kacho is planning for survival.', tracks: ['kacho', 'melody', 'mosquitone', 'covert-communication'], time: 'Voyage Day 3', location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '376-zhang-lei-third-coin', title: 'Zhang Lei’s Guardian Spirit Beast produces a third coin marked 1', detail: 'Zhang Lei receives another coin and is now aware that his Guardian Spirit Beast is the source. This is the third confirmed coin, and it still bears the number 1.', tracks: ['zhang-lei', 'guardian-spirit-beast', 'coins', 'coventoba'], time: 'Voyage Day 3', location: 'Black Whale · Tier 1 · Room 1003' }),
  event({ id: '376-coventoba-coin-theory', title: 'Coventoba theorizes that coin holders gain abilities after satisfying multiple conditions', detail: 'Coventoba reasons that the coins may grant special abilities to a holder once several conditions are fulfilled, but neither the conditions nor the resulting abilities are established in Chapter 376.', tracks: ['zhang-lei', 'coventoba', 'coins', 'theory'], time: 'Voyage Day 3', location: 'Black Whale · Tier 1 · Room 1003', confidence: 'Coventoba theory; three-coin production is confirmed but effect mechanics remain unconfirmed' }),
  event({ id: '376-day4-begins', title: 'The Black Whale begins its fourth day of travel', detail: 'The chapter advances from the Day 3 material into Voyage Day 4.', tracks: ['black-whale', 'voyage-clock'], time: 'Voyage Day 4', location: 'Black Whale' }),
  event({ id: '376-fugetsu-second-door', title: 'Fugetsu’s Nen door manifests for a second time on Day 4', detail: 'After failing to reproduce the door on demand in Chapter 375, Fugetsu receives a second manifestation on the fourth day of travel.', tracks: ['fugetsu', 'nen-door', 'guardian-spirit-beast', 'translocation'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 · Room 1011' }),
  event({ id: '376-fugetsu-daily-limit-theory', title: 'Fugetsu develops a once-per-day or twenty-four-hour interval theory', detail: 'Fugetsu infers from the second manifestation that the door may only appear once per day or perhaps once every twenty-four hours. She plans to test its properties so she can eventually escape the ship with Kacho.', tracks: ['fugetsu', 'nen-door', 'limitation', 'escape-plan'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 · Room 1011', confidence: 'second activation confirmed; daily/24-hour interval remains Fugetsu’s theory' }),
  event({ id: '376-fugetsu-exit-delay', title: 'Fugetsu learns that choosing a destination does not immediately create the exit', detail: 'During her Day 4 testing, Fugetsu finds that the exit door does not appear immediately after she chooses a destination.', tracks: ['fugetsu', 'nen-door', 'destination', 'activation-delay'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 / Nen tunnel', confidence: 'observed behavior confirmed; cause and timing rule unknown' }),
  event({ id: '376-danjin-continues-class', title: 'Danjin reports Myuhan’s death but chooses to continue Kurapika’s training', detail: 'Danjin tells Tserriednich that Myuhan has been killed. He still considers Kurapika credible, notes the Hunter Association’s protective mission, and intends to keep attending the two-week course.', tracks: ['danjin', 'tserriednich', 'kurapika', 'myuhan', 'nen-class'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 · Room 1004' }),
  event({ id: '376-tserriednich-kurapika-condition-theory', title: 'Tserriednich theorizes that teaching Nen could be a Manipulation activation condition', detail: 'Tserriednich proposes that Kurapika might be a Manipulator who must teach Nen before manipulating trainees. He orders Danjin to bring him a final-day “present” that proves Danjin has not been manipulated.', tracks: ['tserriednich', 'danjin', 'kurapika', 'manipulation', 'theory'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 · Room 1004', confidence: 'Tserriednich hypothesis; no Manipulation condition is established' }),
  event({ id: '376-theta-zetsu-plan', title: 'Theta plans to complete Tserriednich’s Zetsu instruction in eleven more days', detail: 'Theta’s schedule would finish the Zetsu teaching on Day 14. While assessing the prince, she also considers whether the wound from his Guardian Spirit Beast may itself be part of that beast’s activation conditions.', tracks: ['theta', 'tserriednich', 'zetsu', 'guardian-spirit-beast'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 · Room 1004', confidence: 'training schedule confirmed; wound-as-condition remains Theta’s inference' }),
  event({ id: '376-tserriednich-specialist', title: 'Water Divination reveals Tserriednich as a Specialist', detail: 'Tserriednich performs Water Divination. The test identifies him as a Specialist; the water boils, becomes filthy, and releases a putrid odor, horrifying Theta.', tracks: ['tserriednich', 'theta', 'water-divination', 'specialization', 'nen-training'], time: 'Voyage Day 4', location: 'Black Whale · Tier 1 · Room 1004' }),
]);

export const succession376DayMarkers = freeze({
  day3: freeze({ elapsed: '46 hours after departure', time: '10:05 a.m.', voyageDay: 3, source }),
  day4: freeze({ marker: 'The Black Whale begins its fourth day of travel during Chapter 376.', voyageDay: 4, source }),
});

export const succession376HalkenburgAppealResearch = freeze({
  accessRule: 'Princes are not permitted to meet Nasubi outside the Sunday banquets.',
  action: 'Halkenburg is denied entry, hands the gate guard a letter for Nasubi, and says he will return every day with another letter until he receives an audience.',
  surveillance: 'Benjamin’s side is informed of Halkenburg’s activity.',
  source,
});

export const succession376CourtResearch = freeze({
  parties: freeze(['Benjamin Hui Guo Rou', 'Camilla Hui Guo Rou']),
  magistrate: 'Cleapatro',
  competingClaims: freeze([
    'Camilla’s side frames Musse’s attack and the later shootings as self-defense.',
    'Balsamilco states that Camilla attacked Benjamin.',
  ]),
  ruling: 'Proceedings are postponed; both princes are confined and monitored in the VVIP area while the Royal Army searches Rooms 1001 and 1002.',
  benjaminAdvantage: 'Benjamin can continue monitoring Camilla through the inherited Secret Window ability.',
  source,
});

export const succession376SilentMajorityResearch = freeze({
  victim: 'Myuhan',
  state: 'deceased',
  context: 'Killed during Kurapika’s Nen course after Barrigen’s earlier death.',
  confirmedVictimsInClass: freeze(['Barrigen', 'Myuhan']),
  userIdentity: 'unknown',
  strategicEffect: 'The second class death sharply increases suspicion that Kurapika’s course itself is an assassination trap.',
  source,
});

export const succession376BelerainteAllianceResearch = freeze({
  intervention: 'Belerainte publicly defends Kurapika’s side and argues that ending the course would let the assassin escape.',
  covertReporting: 'He asks Bill to act as a natural conversational guise while he passes information toward Hanzo, Vergei, and the hidden Room 1013 group from near the boundary.',
  strategicPosition: 'He encourages Kurapika to continue the classes and protect as many princes as possible.',
  source,
});

export const succession376MosquitoneResearch = freeze({
  participants: freeze(['Kacho Hui Guo Rou', 'Melody']),
  device: 'Mosquitone',
  method: 'High-frequency device plus Morse code used as covert communication while Kacho pretends to study.',
  development: 'Kacho directs Melody to a second device hidden in the kitchen, establishing a private communication channel.',
  source,
});

export const succession376ZhangLeiCoinResearch = freeze({
  confirmedCoinCount: 3,
  inscription: '1',
  sourceAwareness: 'By the third coin, Zhang Lei knows the coins come from his Guardian Spirit Beast.',
  coventobaTheory: 'Coventoba reasons that a coin holder may gain special abilities after satisfying multiple conditions.',
  confidenceBoundary: 'Three produced coins and Zhang Lei’s awareness are confirmed. Ability-granting effects and their conditions remain Coventoba’s theory at Chapter 376.',
  source,
});

export const succession376FugetsuDoorResearch = freeze({
  secondActivation: 'The Nen door manifests again on Voyage Day 4 after failing to reappear on demand in Chapter 375.',
  fugetsuTheory: 'Fugetsu believes the interval may be once per day or once every twenty-four hours.',
  observedNewBehavior: 'Choosing a destination does not cause the exit door to appear immediately.',
  motivation: 'Fugetsu intends to map the ability’s properties so she can use it to escape the Black Whale with Kacho.',
  notEstablished: freeze(['exact reset clock', 'whether the interval is calendar-day or twenty-four-hour based', 'exit-door delay duration', 'destination-selection limits']),
  source,
});

export const succession376TserriednichNenResearch = freeze({
  waterDivination: freeze({ result: 'Specialist', observations: freeze(['water boils', 'water becomes filthy', 'putrid smell is released']), source }),
  thetaPlan: 'Theta intends to complete Tserriednich’s Zetsu instruction in eleven more days, corresponding to Day 14.',
  thetaInference: 'Theta considers the wound inflicted by Tserriednich’s Guardian Spirit Beast as a possible condition for the beast’s ability.',
  tserriednichInference: 'Tserriednich considers whether Kurapika’s public Nen teaching could be a Manipulation activation condition.',
  danjinOrder: 'Tserriednich tells Danjin to bring a final-day “present” proving he has not been manipulated.',
  confidenceBoundary: 'Specialist classification and the training schedule are confirmed. Both proposed activation-condition models remain character hypotheses.',
  source,
});

export const succession376RelationshipRecords = freeze([
  freeze({ from: 'Belerainte', to: 'Kurapika', type: 'Public defender / coalition support', note: 'Belerainte counters suspicion toward Kurapika’s Nen course and urges him to continue protecting the princes.', phase: 'Active contest and voyage', chapters: '376', state: 'working alliance strengthened', source }),
  freeze({ from: 'Kacho Hui Guo Rou', to: 'Melody', type: 'Covert communication partners', note: 'Kacho establishes a private Mosquitone Morse-code channel with Melody.', phase: 'Active contest and voyage', chapters: '376', state: 'secret channel active', source }),
  freeze({ from: 'Danjin', to: 'Kurapika', type: 'Cautious trainee confidence', note: 'Despite Myuhan’s death, Danjin believes Kurapika is speaking truthfully enough to continue the Nen course.', phase: 'Active contest and voyage', chapters: '376', state: 'training continues / manipulation concern monitored', source }),
  freeze({ from: 'Tserriednich Hui Guo Rou', to: 'Theta', type: 'Accelerated Nen student / threatened instructor', note: 'Theta continues Zetsu instruction while Water Divination reveals Tserriednich as a Specialist and deepens her alarm.', phase: 'Active contest and voyage', chapters: '376', state: 'training active / danger escalating', source }),
]);

export const succession376Mysteries = freeze([
  freeze({ question: 'Who is the Silent Majority user and how are targets being selected inside the Nen class?', evidence: 'Myuhan becomes another confirmed Silent Majority victim in Room 1014 after Barrigen, while the user remains unidentified.', status: 'open / second class murder confirmed', lastChapter: '376', source }),
  freeze({ question: 'What conditions and effects govern Zhang Lei’s numbered coins?', evidence: 'A third coin marked 1 is produced. Zhang Lei now knows the source; Coventoba theorizes that holders may gain abilities after meeting multiple conditions.', status: 'production pattern confirmed / effect theory unconfirmed', lastChapter: '376', source }),
  freeze({ question: 'What exact interval and destination rules govern Fugetsu’s Nen door?', evidence: 'The door manifests again on Day 4. Fugetsu proposes once-per-day or twenty-four-hour timing, and observes that choosing a destination does not immediately create the exit.', status: 'repeatability narrowed / exact timing and exit rule open', lastChapter: '376', source }),
  freeze({ question: 'What condition is attached to the wound inflicted on Theta by Tserriednich’s Guardian Spirit Beast?', evidence: 'Theta reasons that the wound may be part of the beast’s activation conditions, but Chapter 376 does not establish the effect.', status: 'open / Theta inference', lastChapter: '376', source }),
]);

const focus = 'Chapter 376 carries the voyage from Day 3 into Day 4: Halkenburg begins a daily letter campaign after being denied access to Nasubi; Benjamin and Camilla enter judicial surveillance; Silent Majority kills Myuhan and destabilizes Kurapika’s Nen class; Belerainte strengthens cooperation with Room 1014 and hidden Room 1013; Kacho and Melody establish Mosquitone Morse communication; Zhang Lei’s beast produces a third coin; Fugetsu receives a second door manifestation and develops a daily-interval theory; and Tserriednich’s Water Divination formally identifies him as a Specialist.';

export const succession376ChapterResearch = freeze([
  freeze({
    number: 376,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 3 → Voyage Day 4',
    lanes: freeze(['Halkenburg appeal', 'Benjamin–Camilla court', 'Silent Majority and Nen class', 'Room 1013 communication', 'Kacho–Melody covert channel', 'Zhang Lei coins', 'Fugetsu door', 'Tserriednich Nen training']),
    focus,
    events: succession376TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Halkenburg Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Benjamin Hui Guo Rou', 'Camilla Hui Guo Rou', 'Balsamilco Might', 'Cleapatro', 'Musse', 'Wolfe', 'Kurapika', 'Sakata', 'Myuhan', 'Maor', 'Satobi', 'Belerainte', 'Bill', 'Hanzo', 'Vergei', 'Kacho Hui Guo Rou', 'Melody', 'Zhang Lei Hui Guo Rou', 'Coventoba', 'Fugetsu Hui Guo Rou', 'Danjin', 'Tserriednich Hui Guo Rou', 'Theta']),
    appearances: freeze(['Halkenburg Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Benjamin Hui Guo Rou', 'Camilla Hui Guo Rou', 'Balsamilco Might', 'Cleapatro', 'Kurapika', 'Sakata', 'Myuhan', 'Maor', 'Satobi', 'Belerainte', 'Bill', 'Kacho Hui Guo Rou', 'Melody', 'Zhang Lei Hui Guo Rou', 'Coventoba', 'Fugetsu Hui Guo Rou', 'Danjin', 'Tserriednich Hui Guo Rou', 'Theta']),
    relationships: succession376RelationshipRecords,
    bodyStates: freeze([freeze({ subject: 'Myuhan', state: 'deceased', cause: 'Killed by Silent Majority during the Room 1014 Nen course.', source })]),
    mysteries: succession376Mysteries,
    abilities: freeze([succession376SilentMajorityResearch, succession376ZhangLeiCoinResearch, succession376FugetsuDoorResearch, succession376TserriednichNenResearch]),
    locations: freeze(['Black Whale · Tier 1 · VVIP gate', 'Black Whale · Tier 1 · court', 'Black Whale · Tier 1 · Room 1014', 'Black Whale · Tier 1 · Room 1013 boundary', 'Black Whale · Tier 1 · Room 1010', 'Black Whale · Tier 1 · Room 1003', 'Black Whale · Tier 1 · Room 1011', 'Black Whale · Tier 1 · Room 1004']),
    objects: freeze(['Halkenburg’s letter to Nasubi', 'Mosquitone', 'Zhang Lei coin marked 1', 'Water Divination glass']),
    organizations: freeze(['Hunter Association', 'Royal Army']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, bodyStates: true, abilities: true, mysteries: true, locations: true, court: true, communications: true }),
    confidence: freeze([
      'Myuhan’s death by Silent Majority, the third Zhang Lei coin, Fugetsu’s second door manifestation, and Tserriednich’s Specialist classification are confirmed Chapter 376 developments.',
      'Coventoba’s coin ability-grant theory remains a theory rather than established coin mechanics.',
      'Fugetsu’s once-per-day or twenty-four-hour model remains her theory despite the second activation materially narrowing the repeatability question.',
      'Tserriednich’s Kurapika-Manipulation model and Theta’s wound-condition model remain character inferences.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession376SourcePolicy,
  }),
]);

export const succession376ChapterFocus = freeze({ 376: focus });
