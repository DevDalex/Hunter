const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_386';

export const succession386SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 386 synopsis',
  titleMetadata: 'The supplied material does not include an English, Japanese, or romanized chapter title. No title is invented.',
  chronologyNote: 'Chapter 386 explicitly takes place on Voyage Day 9. The supplied synopsis provides no exact clock times, so the archive does not invent them.',
  thetaBoundary: 'Salkov reports that luminol testing found no blood where Theta remembers seeing Tserriednich’s corpse. This strengthens the conclusion that the apparent death scene did not leave an ordinary physical blood trace, but Chapter 386 still does not reveal the complete mechanism of Tserriednich’s temporal ability or prove that every part of Theta’s experience was an illusion.',
  justiceBoundary: 'Melody is questioned in the Tier 2 Justice Bureau. Keeney’s suicide note claims he acted alone, while Fugetsu and the Kacho-form Guardian Spirit Beast tell investigators that Keeney forced them onto the lifeboat. These are statements and cover accounts under investigation, not independent proof of what happened. Biological Kacho remains dead from Chapter 383.',
  halkenburgBoundary: 'Halkenburg’s group treats Sumidori as the consciousness controlling Shikaku’s body after the Chapter 382 arrow. They explicitly list four possibilities for Shikaku’s original consciousness. After the Shikaku body commits suicide, Sumidori’s original body wakes and Halkenburg immediately begins an identity check. The supplied synopsis ends before that check is answered, so the archive does not yet state as confirmed that Sumidori’s consciousness returned to his own body or that Shikaku’s consciousness is dead.',
  emissionBoundary: 'Kurapika infers from the abrupt disappearance of the distant aura rumbling that an Emitter attack may have occurred, but he does not know the attacker or target. The archive does not use this inference to reclassify Halkenburg’s collective arrow as confirmed Emission.',
  beastBoundary: 'Babimyna reports that Tubeppa’s Guardian Spirit Beast is refusing to show itself and that Woble’s has not appeared. His suggestions that Woble may be too young or may possess a counterattacking beast remain hypotheses, not confirmed mechanics.',
  tserriednichBoundary: 'Tserriednich says he is training to shorten the response time of his Zetsu and intends to spar with Salkov once he can enter it in less than one second. This is a training target, not proof that he has already achieved sub-second Zetsu or a newly revealed rule for Parallel Future.',
  excluded: freeze([
    'Outside story claims',
    'Unsupplied Chapter 387+ mechanics',
    'A confirmed ten-second Parallel Future model at the Chapter 386 boundary',
    'A claim that all of Theta’s Chapter 385 experience was merely an illusion',
    'A confirmed death of Shikaku’s consciousness',
    'A confirmed return of Sumidori’s consciousness to his original body before the identity check is completed',
    'A confirmed Emission classification for Halkenburg’s collective arrow based on Kurapika’s remote inference',
    'A confirmed counterattacking classification for Woble’s Guardian Spirit Beast',
    'An invented exact time of day for any Chapter 386 scene',
  ]),
});

const event = ({ id, title, detail, tracks, location, confidence = 'confirmed' }) => freeze({
  id,
  time: 'Voyage Day 9',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 386,
  confidence,
  source,
});

export const succession386TimelineEvents = freeze([
  event({
    id: '386-theta-luminol-no-blood',
    title: 'Luminol testing finds no blood where Theta saw Tserriednich’s corpse',
    detail: 'Salkov tells Theta that he tested the location where she remembers Tserriednich’s body lying and found no blood with luminol. Theta becomes less certain about which parts of the apparent assassination scene were physically real and decides to reconsider her next move carefully.',
    tracks: ['theta', 'salkov', 'tserriednich', 'parallel-future', 'forensic-check', 'temporal-anomaly'],
    location: 'Black Whale · Tier 1 · Tserriednich quarters',
  }),
  event({
    id: '386-melody-justice-questioning',
    title: 'Melody remains under Justice questioning while royal invitations accumulate',
    detail: 'On Voyage Day 9, Melody is held in the Tier 2 Justice Bureau. Kaiser tells her that Keeney left a suicide note claiming sole responsibility for the twins’ escape attempt and that several princes have invited Melody to their suites after her banquet performance. Melody concludes that the prolonged questioning is also shielding her from dangerous royal approaches.',
    tracks: ['melody', 'kaiser', 'justice-bureau', 'keeney', 'royal-invitations', 'protective-custody'],
    location: 'Black Whale · Tier 2 · Justice Bureau',
    confidence: 'Keeney’s note and the invitations are explicit; the protective purpose is Melody’s interpretation of the situation.',
  }),
  event({
    id: '386-twin-cover-statements',
    title: 'Fugetsu and the Kacho-form continuation say Keeney forced them onto the lifeboat',
    detail: 'Kaiser tells Melody that the two girls under Justice questioning say Keeney forced them onto the lifeboat. He says he has no evidence proving or disproving whether they were forced or whether the escape was their own plan, so questioning will continue. The Kacho present after Chapter 383 is Without You in Kacho’s form, not the deceased biological Kacho.',
    tracks: ['fugetsu', 'kacho-form-without-you', 'kaiser', 'keeney', 'justice-bureau', 'cover-story'],
    location: 'Black Whale · Tier 2 · Justice Bureau',
    confidence: 'Their statement and Kaiser’s evidentiary uncertainty are explicit; the archive preserves the Kacho ontology established in Chapter 383.',
  }),
  event({
    id: '386-halkenburg-four-consciousness-options',
    title: 'Halkenburg formalizes four possibilities for Shikaku’s displaced consciousness',
    detail: 'With Sumidori’s original body sleeping under brain-wave monitoring and the active consciousness in Shikaku’s body treated by the group as Sumidori, Halkenburg lists four possibilities for Shikaku’s consciousness: gone/dead, transferred into Sumidori’s body, coexisting inside Shikaku’s body, or located somewhere else. He wants expert Nen advice because he does not yet know which model is correct.',
    tracks: ['halkenburg', 'sumidori', 'shikaku', 'consciousness-transfer', 'halkenburg-arrow', 'hypotheses'],
    location: 'Black Whale · Tier 1 · Halkenburg quarters',
  }),
  event({
    id: '386-halkenburg-resolve-awakening-claim',
    title: 'Halkenburg links his resolve to win with the awakening of his ability',
    detail: 'Halkenburg tells his followers that after speaking with Nasubi he gained the resolve to win the Succession Contest and that his ability awakened. He then shares an additional hypothesis whose dialogue is not supplied and explicitly admits that he is unsure whether it is possible because he lacks complete Nen knowledge.',
    tracks: ['halkenburg', 'nasubi', 'resolve', 'ability-awakening', 'hypothesis'],
    location: 'Black Whale · Tier 1 · Halkenburg quarters',
    confidence: 'The resolve-and-awakening link is Halkenburg’s own retrospective account; the additional hypothesis remains unspecified in the supplied synopsis.',
  }),
  event({
    id: '386-shikaku-body-suicide-test',
    title: 'The Sumidori-controlled Shikaku body is used in a lethal consciousness-transfer test',
    detail: 'After another powerful aura rumbling from Halkenburg’s room, the consciousness operating Shikaku’s body arrives outside Luzurus’s quarters, shouts loyalty to Benjamin, and shoots the Shikaku body through the head. Basho feels the rumbling stop. Balsamilco and Benjamin interpret the suicide as likely caused by Halkenburg’s ability and elevate Halkenburg to their greatest threat.',
    tracks: ['halkenburg', 'sumidori', 'shikaku', 'luzurus', 'basho', 'benjamin', 'balsamilco', 'consciousness-test'],
    location: 'Black Whale · Tier 1 · outside Luzurus quarters',
    confidence: 'The body suicide and aura timing are observed; Benjamin’s side attributes the cause to Halkenburg’s ability as an assessment.',
  }),
  event({
    id: '386-sumidori-body-wakes-identity-check',
    title: 'Sumidori’s original body wakes after the Shikaku body dies and Halkenburg begins identity verification',
    detail: 'Back in Halkenburg’s room, Sumidori’s original body wakes while restrained. Halkenburg immediately asks for his post and service number to determine which consciousness has awakened in the body. The supplied synopsis ends before the answer, so the identity result remains unresolved at the Chapter 386 boundary.',
    tracks: ['halkenburg', 'sumidori', 'shikaku', 'identity-check', 'consciousness-transfer'],
    location: 'Black Whale · Tier 1 · Halkenburg quarters',
  }),
  event({
    id: '386-kurapika-water-divination-class',
    title: 'Kurapika introduces Water Divination and reveals his Specialist result to the class',
    detail: 'After Kurapika and Bill feel the distant aura rumbling, Kurapika introduces Water Divination as the next class step. His demonstration changes the water’s color and spins the leaf, which he identifies to the students as a Specialist result. He selects Ladiolus to demonstrate that Nen aptitude is not determined by sex or physical strength and plans private testing with only himself and Bill present.',
    tracks: ['kurapika', 'bill', 'ladiolus', 'water-divination', 'specialization', 'nen-class'],
    location: 'Black Whale · Tier 1 · Room 1014',
  }),
  event({
    id: '386-kurapika-class-information-payment',
    title: 'Kurapika defines Nen-type disclosure as the price and strategic purpose of the class',
    detail: 'When Satobi objects to private Water Divination with Kurapika and Bill, Kurapika explains that their assistance is needed to meet the two-week deadline and that access to each student’s Nen type is payment for the class and compensation for his risk. He states that his strategic objective is to empower the bodyguards enough to prolong the stalemate among the princes and invites unconvinced students to quit.',
    tracks: ['kurapika', 'satobi', 'bill', 'nen-class', 'stalemate-strategy', 'information-payment'],
    location: 'Black Whale · Tier 1 · Room 1014',
  }),
  event({
    id: '386-benjamin-observers-beast-status',
    title: 'Benjamin’s observers compare Tubeppa and Woble Guardian Spirit Beast visibility',
    detail: 'Furykov asks Babimyna about Rihan and Woble. Babimyna says Rihan is concentrating on Tubeppa’s Guardian Spirit Beast after destroying Salé-salé’s, but Tubeppa’s beast is refusing to show itself. Woble’s beast also has not appeared. Babimyna wonders whether Woble is too young or whether the beast may be a counterattacking type, but neither explanation is confirmed.',
    tracks: ['furykov', 'babimyna', 'rihan', 'tubeppa', 'woble', 'guardian-spirit-beast', 'observation'],
    location: 'Black Whale · Tier 1 · Room 1014',
    confidence: 'Nonappearance is reported; Babimyna’s explanations for Woble remain hypotheses.',
  }),
  event({
    id: '386-tserriednich-zetsu-response-training',
    title: 'Tserriednich trains to shorten his Zetsu response toward a sub-second target',
    detail: 'Salkov is alarmed that Tserriednich is already working through the Four Major Principles. Tserriednich says he is now shortening the response time of his Zetsu and intends to spar with Salkov after he can enter Zetsu in less than one second. He also remarks that he has had a change of heart and now finds two-faced women cute.',
    tracks: ['tserriednich', 'salkov', 'zetsu', 'nen-training', 'sparring'],
    location: 'Black Whale · Tier 1 · Tserriednich quarters',
    confidence: 'The sub-second figure is Tserriednich’s training goal, not an achieved result at this chapter boundary.',
  }),
]);

export const succession386ThetaForensicsResearch = freeze({
  subjects: freeze(['Theta', 'Salkov', 'Tserriednich Hui Guo Rou']),
  test: 'Salkov uses luminol on the location where Theta remembers Tserriednich’s body lying after the Chapter 385 headshot.',
  result: 'No blood is detected.',
  thetaResponse: 'Theta questions how much of what she saw was illusory or otherwise non-physical and decides to reconsider her next action carefully.',
  boundary: 'The absence of blood is new evidence against an ordinary physical death scene. It does not yet supply Parallel Future’s complete mechanism.',
  source,
});

export const succession386JusticeResearch = freeze({
  day: 'Voyage Day 9',
  location: 'Tier 2 Justice Bureau',
  melodyState: 'Melody remains under questioning and uses the protected delay to plan her next move.',
  keeneyNote: 'Keeney left a suicide note claiming that he acted alone in the twins’ escape attempt.',
  princeInvitations: 'Several princes were impressed by Melody’s performance and invited her to their suites; the supplied synopsis does not name all of them.',
  melodyInference: 'Melody concludes that the prolonged questioning also keeps her away from dangerous princes.',
  twinStatement: 'Fugetsu and the Kacho-form continuation say Keeney forced them onto the lifeboat.',
  investigatorPosition: 'Kaiser says he lacks evidence proving or disproving whether they were forced or acted voluntarily, so questioning will continue.',
  ontologyBoundary: 'Biological Kacho died in Chapter 383. The Kacho present in Justice is Without You in Kacho’s form.',
  source,
});

export const succession386HalkenburgArrowResearch = freeze({
  ability: 'Halkenburg collective possession arrow',
  observedController: 'Halkenburg’s group treats Sumidori as the consciousness currently controlling Shikaku’s body.',
  sumidoriOriginalBody: 'Sumidori’s original body remains asleep under brain-wave monitoring before the experiment.',
  shikakuConsciousnessOptions: freeze([
    'Shikaku’s consciousness is gone and Shikaku is dead.',
    'Shikaku’s consciousness moved into Sumidori’s original body.',
    'Shikaku and Sumidori coexist inside Shikaku’s body.',
    'Shikaku’s consciousness is somewhere else or in someone else.',
  ]),
  experiment: 'The Sumidori-controlled Shikaku body deliberately commits suicide outside Luzurus’s quarters as a test vital to understanding the ability.',
  postExperimentObservation: 'After the Shikaku body dies, Sumidori’s original body wakes and Halkenburg immediately asks for his post and service number to identify the consciousness now present.',
  unresolved: freeze([
    'The identity-check answer is not included in the supplied synopsis.',
    'Shikaku’s original consciousness location remains unresolved.',
    'The exact transfer-return rule after death remains unresolved at the Chapter 386 endpoint.',
    'Halkenburg’s additional hypothesis is not supplied in dialogue.',
  ]),
  source,
});

export const succession386NenClassResearch = freeze({
  teacher: 'Kurapika',
  assistant: 'Bill',
  classState: 'One week remains and students are becoming impatient with the pace of awakening.',
  distantAuraAssessment: 'Kurapika infers from the aura rumbling ending instantly that an Emitter attack may have occurred, while Bill guesses the source could be the Ninth, Seventh, or Fifth Prince. Neither knows who is attacking whom.',
  waterDivination: 'Kurapika introduces Water Divination as the method for identifying Nen type and demonstrates a result he identifies as Specialization.',
  ladiolusStrategy: 'Kurapika selects Ladiolus because she has produced enough aura for the test; Babimyna recognizes that choosing her also signals that Nen talent is unrelated to gender or physical strength.',
  privacyRule: 'Kurapika says students should not publicly reveal their Nen type, so testing will occur privately with only Kurapika and Bill present.',
  compensationLogic: 'Kurapika says access to the students’ Nen types is payment for the class and compensation for the personal risk he assumes while empowering rival bodyguards to prolong the succession stalemate.',
  optOut: 'Students who reject those terms may leave the class.',
  source,
});

export const succession386GuardianBeastObservationResearch = freeze({
  tubeppa: 'Rihan is focusing on Tubeppa’s Guardian Spirit Beast after destroying Salé-salé’s, but Furykov says Tubeppa’s beast is refusing to show itself.',
  woble: 'Babimyna says Woble’s Guardian Spirit Beast has not shown itself either.',
  babimynaHypotheses: freeze(['Woble may be too young for the beast to manifest visibly.', 'Woble’s beast may be a counterattacking type.']),
  boundary: 'Only continued nonappearance is observed. Neither explanation for Woble is confirmed.',
  source,
});

export const succession386TserriednichTrainingResearch = freeze({
  student: 'Tserriednich Hui Guo Rou',
  observer: 'Salkov',
  currentFocus: 'Shortening the response time required to enter Zetsu.',
  target: 'Less than one second before beginning sparring with Salkov.',
  achievedAtBoundary: false,
  behavioralNote: 'Tserriednich casually says he has changed his mind and now finds two-faced women cute.',
  interpretationBoundary: 'The remark is recorded as stated behavior and is not converted into proof that he trusts Theta, fully understands her assassination attempt, or has forgiven her.',
  source,
});

export const succession386BodyStates = freeze([
  freeze({
    subject: 'Shikaku',
    body: 'Shikaku’s original body',
    state: 'dead after self-inflicted gunshot while under the consciousness-transfer experiment',
    consciousness: 'Shikaku’s original consciousness remains unresolved; the active controller immediately before body death is treated by Halkenburg’s group as Sumidori.',
    chapter: 386,
    source,
  }),
  freeze({
    subject: 'Sumidori',
    body: 'Sumidori’s original body',
    state: 'wakes after the Shikaku body dies',
    consciousness: 'identity verification begins but the supplied synopsis ends before the result is given',
    chapter: 386,
    source,
  }),
]);

export const succession386RelationshipRecords = freeze([
  freeze({
    from: 'Halkenburg Hui Guo Rou',
    to: 'Sumidori',
    type: 'prince-follower / voluntary lethal experiment',
    status: 'Sumidori willingly participates in a dangerous test designed to clarify Halkenburg’s consciousness-transfer ability.',
    evidence: 'When Halkenburg asks him to perform a vital experiment, the consciousness operating Shikaku’s body agrees without hesitation and carries out the suicide test.',
    source,
  }),
  freeze({
    from: 'Benjamin Hui Guo Rou',
    to: 'Halkenburg Hui Guo Rou',
    type: 'succession hostility / highest-threat prioritization',
    status: 'Benjamin and Balsamilco elevate Halkenburg to their greatest immediate threat after Shikaku’s body suicide is attributed to his ability.',
    evidence: 'Balsamilco reports Shikaku’s suicide and Benjamin orders Kanjidol summoned from Luzurus’s quarters to reconstruct the incident in detail.',
    source,
  }),
  freeze({
    from: 'Kaiser',
    to: 'Melody',
    type: 'Justice questioning / protective containment',
    status: 'Melody remains under Justice questioning while interpreting the delay as protection from dangerous royal invitations.',
    evidence: 'Kaiser continues the interview, briefs Melody on Keeney and the twins, and she concludes that being held there also keeps her away from princes seeking private meetings.',
    source,
  }),
]);

export const succession386ResolvedQuestions = freeze([
  freeze({
    question: 'Did Theta’s apparent Chapter 385 headshot leave ordinary physical blood evidence where she saw the corpse?',
    resolution: 'Salkov reports that luminol testing found no blood at that location.',
    boundary: 'This resolves the forensic blood question only; it does not yet explain Parallel Future’s complete mechanism.',
    source,
  }),
]);

export const succession386Mysteries = freeze([
  freeze({
    question: 'Which consciousness wakes in Sumidori’s original body after the Shikaku body dies?',
    evidence: 'The body wakes and Halkenburg immediately asks for Sumidori’s post and service number as an identity test, but the supplied synopsis ends before the response.',
    status: 'identity test begun / result unresolved',
    lastChapter: '386',
    source,
  }),
  freeze({
    question: 'Where is Shikaku’s original consciousness after Halkenburg’s arrow?',
    evidence: 'Halkenburg explicitly lists death, transfer into Sumidori, coexistence inside Shikaku, and an elsewhere state as possibilities.',
    status: 'four candidate models articulated / none confirmed',
    lastChapter: '386',
    source,
  }),
  freeze({
    question: 'What additional hypothesis does Halkenburg propose about his ability?',
    evidence: 'The synopsis says Halkenburg shares a hypothesis but provides no dialogue, and Halkenburg himself says he needs a Nen expert to know whether it is possible.',
    status: 'hypothesis exists / content unsupplied',
    lastChapter: '386',
    source,
  }),
  freeze({
    question: 'What exactly is the mechanism behind Theta’s bloodless apparent assassination scene?',
    evidence: 'No blood is found where Theta saw the corpse, but the chapter still does not reveal the full temporal or perceptual mechanism.',
    status: 'forensic evidence advanced / mechanism unresolved',
    lastChapter: '386',
    source,
  }),
  freeze({
    question: 'Why has Woble’s Guardian Spirit Beast still not shown itself?',
    evidence: 'Babimyna suggests Woble’s age or a counterattacking ability as possibilities, but neither is confirmed.',
    status: 'continued nonappearance / cause unresolved',
    lastChapter: '386',
    source,
  }),
]);

const focus = 'Chapter 386 moves to Voyage Day 9 and converts several earlier mysteries into testable evidence without fully resolving them. Salkov’s luminol test finds no blood where Theta saw Tserriednich’s corpse, strengthening the non-physical interpretation of the Chapter 385 apparent death while leaving Parallel Future’s full mechanics hidden. Melody remains under Justice questioning as Keeney’s sole-responsibility note and the twins’ forced-escape story are examined. Halkenburg then performs a deliberate consciousness-transfer experiment: the Sumidori-controlled Shikaku body commits suicide, Sumidori’s original body wakes, and an identity test begins, while Shikaku’s consciousness remains unresolved. Kurapika advances the Nen class into Water Divination and privately priced Nen-type disclosure, Benjamin elevates Halkenburg to his greatest threat, and Tserriednich begins training toward a sub-second Zetsu response.';

export const succession386ChapterResearch = freeze([
  freeze({
    number: 386,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage · Day 9',
    voyageDay: 'Voyage Day 9',
    voyageDayConfidence: 'The supplied synopsis explicitly states that it is the ninth day of the voyage.',
    lanes: freeze([
      'Theta / Tserriednich temporal-anomaly forensics',
      'Melody and Justice Bureau protection/questioning',
      'Keeney escape cover story',
      'Halkenburg consciousness-transfer experiment',
      'Benjamin threat reprioritization',
      'Room 1014 Nen class',
      'Water Divination and Nen-type information strategy',
      'Tubeppa and Woble Guardian Spirit Beast observation',
      'Tserriednich Zetsu response training',
    ]),
    focus,
    events: succession386TimelineEvents,
    prelude: freeze([
      'Chapter 385 ended with Theta surviving the failed assassination, Tserriednich alive, and the apparent death/time-skip mechanism unresolved.',
      'Chapter 382 established the first Halkenburg arrow exchange with Shikaku; Chapter 386 directly tests what that exchange did to the participants’ consciousnesses.',
      'Chapter 383 established that biological Kacho died and Without You continues in Kacho’s form; all Chapter 386 Justice references to “Kacho” remain ontology-tagged accordingly.',
    ]),
    characters: freeze([
      'Theta', 'Salkov', 'Tserriednich Hui Guo Rou', 'Melody', 'Kaiser', 'Keeney', 'Fugetsu Hui Guo Rou',
      'Kacho Hui Guo Rou', 'Halkenburg Hui Guo Rou', 'Sumidori', 'Shikaku', 'Nasubi Hui Guo Rou', 'Luzurus Hui Guo Rou',
      'Basho', 'Balsamilco Might', 'Benjamin Hui Guo Rou', 'Kanjidol', 'Kurapika', 'Bill', 'Sakata', 'Ladiolus',
      'Babimyna', 'Satobi', 'Furykov', 'Rihan', 'Tubeppa Hui Guo Rou', 'Woble Hui Guo Rou',
    ]),
    appearances: freeze([
      'Theta', 'Salkov', 'Tserriednich Hui Guo Rou', 'Melody', 'Kaiser', 'Halkenburg Hui Guo Rou', 'Sumidori', 'Shikaku',
      'Basho', 'Balsamilco Might', 'Benjamin Hui Guo Rou', 'Kurapika', 'Bill', 'Sakata', 'Ladiolus', 'Babimyna', 'Satobi', 'Furykov',
    ]),
    relationships: succession386RelationshipRecords,
    bodyStates: succession386BodyStates,
    mysteries: succession386Mysteries,
    resolvedQuestions: succession386ResolvedQuestions,
    abilities: freeze([succession386HalkenburgArrowResearch, succession386TserriednichTrainingResearch]),
    locations: freeze([
      'Black Whale · Tier 1 · Tserriednich quarters',
      'Black Whale · Tier 2 · Justice Bureau',
      'Black Whale · Tier 1 · Halkenburg quarters',
      'Black Whale · Tier 1 · outside Luzurus quarters',
      'Black Whale · Tier 1 · Room 1014',
    ]),
    objects: freeze(['luminol test', 'brain-wave monitor', 'handgun', 'Water Divination glass and leaf']),
    organizations: freeze(['Kakin royal family', 'Justice Bureau', 'Benjamin Private Army', 'Hunter Association']),
    coverage: freeze({
      chronology: true,
      appearances: true,
      relationships: true,
      abilities: true,
      mysteries: true,
      resolvedQuestions: true,
      locations: true,
      organizations: true,
      bodyStates: true,
      justiceInvestigation: true,
      nenClass: true,
      guardianBeastObservation: true,
    }),
    confidence: freeze([
      'Voyage Day 9 is explicit; no exact clock time is supplied.',
      'No blood is found at Theta’s remembered corpse location, but the complete temporal mechanism remains unresolved.',
      'Keeney’s sole-responsibility note and the twins’ forced-escape account are statements under investigation, not independent proof.',
      'The Kacho present in Justice is the Without You continuation, not biological Kacho.',
      'Halkenburg’s group treats Sumidori as controlling Shikaku’s body, but the fate of Shikaku’s own consciousness remains unresolved.',
      'The original Sumidori body wakes after the Shikaku body dies, but the identity test is not completed in the supplied synopsis.',
      'Kurapika’s remote Emission inference does not confirm Halkenburg’s Nen category.',
      'Woble counterattacking-beast theory remains Babimyna’s hypothesis.',
      'Tserriednich’s sub-second Zetsu is a target, not an achieved feat in Chapter 386.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession386SourcePolicy,
  }),
]);

export const succession386ChapterFocus = freeze({ 386: focus });
