const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_372';

export const succession372SourcePolicy = freeze({
  reviewedAt: '2026-08-08',
  soleStorySource: 'User-supplied Hunterpedia Chapter 372 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1', time = 'Voyage Day 2', confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 372,
  confidence,
  source,
});

export const succession372TimelineEvents = freeze([
  event({ id: '372-shedule-yuhirai-aura', title: 'Shedule and Yuhirai display Nen use without understanding it', detail: 'Furykov and Kurapika observe Shedule and Yuhirai using aura at a level inconsistent with complete beginners. Both deny knowing Nen and ask to speak privately with Kurapika.', tracks: ['shedule', 'yuhirai', 'furykov', 'kurapika', 'nen-class'] }),
  event({ id: '372-furykov-forced-awakening', title: 'Furykov recognizes that some concealed users are being made to use Nen unknowingly', detail: 'Furykov realizes Shedule and Yuhirai are not consciously hiding conventional training but are being forced into Nen use without understanding it, sharpening his search for the actual assassin.', tracks: ['furykov', 'shedule', 'yuhirai', 'hidden-nen-users'] }),
  event({ id: '372-seiko-interrogation', title: 'Seiko refuses Kaiser’s questions during the 72-hour investigation', detail: 'Kaiser questions Seiko under Cleapatro’s investigation. Seiko invokes her right to remain silent and refuses to cooperate even after Kaiser says the questioning will not be recorded and offers to arrange necessities during the observation period.', tracks: ['seiko', 'kaiser', 'cleapatro', 'justice'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '372-marayam-beast-growth', title: 'Hanzo and Biscuit see Marayam’s Guardian Spirit Beast becoming larger and more defensive', detail: 'Hanzo and Biscuit observe continued growth and a more defensive appearance. They believe Momoze’s death may have accelerated the change, but Chapter 372 does not confirm that causal theory.', tracks: ['hanzo', 'biscuit', 'marayam', 'guardian-spirit-beast', 'momoze'], location: 'Black Whale · Tier 1 · Room 1013', confidence: 'Growth is observed; Momoze-death causation is Hanzo/Biscuit’s belief' }),
  event({ id: '372-hanzo-skill-4', title: 'Hanzo deploys Hanzo Skill 4 during his off-duty investigation', detail: 'At the 10:00 guard shift change, Hanzo and Biscuit go off duty. Hanzo uses a projected double to investigate Momoze’s murder while attempting to avoid provoking Marayam’s increasingly defensive Guardian Spirit Beast.', tracks: ['hanzo', 'hanzo-skill-4', 'momoze', 'investigation'], location: 'Black Whale · Tier 1 · Room 1013 / investigation route', time: 'Voyage Day 2 · after 10:00' }),
  event({ id: '372-tuffdy-trap', title: 'Hanzo tricks Tuffdy with a fabricated Benjamin recruitment story', detail: 'Hanzo wakes Tuffdy and claims Benjamin wants to hire him and frame Nagmum for Momoze’s murder. The story is a deliberate interrogation trap.', tracks: ['hanzo', 'tuffdy', 'nagmum', 'benjamin', 'investigation'], location: 'Black Whale · Tier 1 · detention/rest area', time: 'Voyage Day 2 · after 10:00' }),
  event({ id: '372-tuffdy-confession', title: 'Tuffdy inadvertently identifies himself as Momoze’s killer', detail: 'Tuffdy asks how Hanzo knew it was him, effectively confessing. Hanzo reveals that he had narrowed the likely culprits to Tuffdy and Nagmum before setting the trap.', tracks: ['hanzo', 'tuffdy', 'momoze', 'nagmum', 'confession'], location: 'Black Whale · Tier 1 · detention/rest area', time: 'Voyage Day 2 · after 10:00' }),
  event({ id: '372-tuffdy-death', title: 'Hanzo kills Tuffdy and stages the death as suicide', detail: 'The chapter notes state that Hanzo avenges Momoze by killing Tuffdy and staging the scene to resemble suicide.', tracks: ['hanzo', 'tuffdy', 'momoze', 'death', 'revenge'], location: 'Black Whale · Tier 1', time: 'Voyage Day 2 · after 10:00' }),
  event({ id: '372-the-touch-identified', title: 'Tuffdy’s assassination ability is identified as The Touch', detail: 'The chapter notes name Tuffdy’s Nen ability as The Touch and state that he used it to assassinate Momoze. Chapter 372 does not supply enough detail here to define its complete activation conditions or mechanics.', tracks: ['tuffdy', 'the-touch', 'momoze', 'nen-ability'], confidence: 'Ability name and use against Momoze confirmed; full mechanics not supplied' }),
  event({ id: '372-sale-sale-banquet-secret', title: 'Salé-salé still withholds his next-banquet plan', detail: 'When his companions ask how he intends to change things at the coming banquet, Salé-salé refuses to explain his plan.', tracks: ['sale-sale', 'banquet', 'mystery'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '372-tyson-book-talk', title: 'Tyson questions her guards about the Book of Tyson', detail: 'Tyson asks her bodyguards what they think of her book. Izunavi admits he has not read it, while Giuliano falsely claims that he enjoyed it.', tracks: ['tyson', 'izunavi', 'giuliano', 'book-of-tyson'], location: 'Black Whale · Tier 1 · Room 1006' }),
  event({ id: '372-eye-wogs-avoid-orau', title: 'Tyson’s eye-wogs avoid Orau', detail: 'Giuliano notices the small creatures from Tyson’s Guardian Spirit Beast resting on some people but not Benjamin soldier Orau. Izunavi does not currently view the creatures as a threat, while Giuliano infers that some special distinction is being applied.', tracks: ['tyson', 'orau', 'izunavi', 'giuliano', 'guardian-spirit-beast'], location: 'Black Whale · Tier 1 · Room 1006', confidence: 'Avoidance is observed; reason and threat level remain unresolved' }),
  event({ id: '372-first-class-ends', title: 'Kurapika’s first Nen lesson ends at 12:30 p.m.', detail: 'The first training session finishes at 12:30 p.m., two and a half hours after the 10:00-adjusted lesson sequence described in the supplied notes.', tracks: ['kurapika', 'nen-class', 'training'], location: 'Black Whale · Tier 1 · Room 1014', time: 'Voyage Day 2 · 12:30 p.m.' }),
  event({ id: '372-sakata-intelligence-condition', title: 'Sakata makes Zhang Lei’s information interest explicit', detail: 'Sakata insists on remaining for Kurapika’s private talk with Yuhirai and reminds him that Zhang Lei has no reason to lend guards if they are prevented from gathering useful information.', tracks: ['sakata', 'kurapika', 'zhang-lei', 'yuhirai', 'intelligence'], location: 'Black Whale · Tier 1 · Room 1014', time: 'Voyage Day 2 · after 12:30 p.m.' }),
  event({ id: '372-halkenburg-blackout-account', title: 'Yuhirai explains the Halkenburg camp blackout and feather marks', detail: 'Yuhirai says Halkenburg lost consciousness when he saw his guards unconscious. Afterward all the guards had feather marks on their hands, remembered nothing about blacking out, and had not found Halkenburg’s unusual bedtime suspicious.', tracks: ['yuhirai', 'halkenburg', 'guardian-spirit-beast', 'feather-marks', 'memory'], location: 'Black Whale · Tier 1 · Room 1014', time: 'Voyage Day 2 · after 12:30 p.m.' }),
  event({ id: '372-soliciting-manipulation', title: 'Kurapika identifies hallmarks of soliciting-type Manipulation', detail: 'Kurapika says the Halkenburg-guard experience resembles soliciting-type Manipulation, in which a target can be manipulated while retaining freedom of choice. He considers memory revision the likely explanation for their missing recollection.', tracks: ['kurapika', 'yuhirai', 'halkenburg', 'manipulation', 'guardian-spirit-beast'], location: 'Black Whale · Tier 1 · Room 1014', confidence: 'Kurapika’s Nen analysis; memory revision described as likely rather than directly observed' }),
  event({ id: '372-halkenburg-conviction-conflict', title: 'Halkenburg’s interpretation of the feather marks conflicts with his stated goals', detail: 'Yuhirai says Halkenburg interprets the marks as his convictions flowing through his guards. Kurapika and Yuhirai note the tension between that belief and Halkenburg’s anti-monarchy, anti-bloodshed position.', tracks: ['halkenburg', 'yuhirai', 'kurapika', 'feather-marks', 'ideology'], location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '372-yuhirai-half-awakened', title: 'Kurapika confirms Yuhirai can use aura without controlling it', detail: 'Kurapika tests Yuhirai and concludes that he can use Nen but cannot consciously control it. The chapter notes describe Halkenburg’s affected guards as half-awakened: capable of limited Nen use while still unable to see or deliberately command aura.', tracks: ['kurapika', 'yuhirai', 'halkenburg', 'half-awakened', 'nen'], location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '372-halkenburg-mark-risk', title: 'Kurapika warns that Halkenburg is also subject to his beast’s conditions', detail: 'Because Halkenburg also bears a feather mark, Kurapika reasons that the prince is subject to the same risks and conditions connected to the Guardian Spirit Beast. He asks Yuhirai to investigate the ability before those conditions are accidentally broken.', tracks: ['kurapika', 'halkenburg', 'yuhirai', 'guardian-spirit-beast', 'conditions'], location: 'Black Whale · Tier 1 · Room 1014', confidence: 'Kurapika’s risk analysis based on the shared mark' }),
  event({ id: '372-lower-prince-coalition', title: 'Kurapika proposes a lower-prince defensive coalition', detail: 'Kurapika says he will appeal through Hunter Association members for lower-ranked princes to cooperate as the upper princes become more aggressive. Kurapika, Sakata, and Yuhirai agree that prince protection comes first while each privately considers how to gain strategic advantage.', tracks: ['kurapika', 'sakata', 'yuhirai', 'lower-princes', 'alliance', 'hunter-association'], location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '372-room-1013-empty', title: 'Hanzo returns to an empty version of Room 1013', detail: 'Hanzo returns expecting Biscuit and his sleeping physical body but finds both missing and the rest of the room empty. The only familiar presence is Marayam’s Guardian Spirit Beast, now appearing smaller but more menacing.', tracks: ['hanzo', 'biscuit', 'marayam', 'room-1013', 'guardian-spirit-beast', 'spatial-mystery'], location: 'Black Whale · Tier 1 · Room 1013', confidence: 'Empty-room state is observed; its mechanism is not established' }),
  event({ id: '372-hanzo-beast-danger', title: 'Hanzo fears Marayam’s beast will not distinguish friend from foe', detail: 'Faced with the altered room and more threatening beast, Hanzo believes it may attack without distinguishing allies from enemies. Chapter 372 does not confirm that the beast actually follows such a rule.', tracks: ['hanzo', 'marayam', 'guardian-spirit-beast', 'threat'], location: 'Black Whale · Tier 1 · Room 1013', confidence: 'Hanzo’s assessment, not confirmed beast targeting mechanics' }),
  event({ id: '372-camilla-musse-threat', title: 'Camilla tells Musse she is leaving to kill Benjamin', detail: 'Camilla openly announces to Musse that she intends to kill Benjamin, orders him to cooperate, and threatens to kill him if he refuses. Musse initially thinks she cannot be serious.', tracks: ['camilla', 'musse', 'benjamin', 'assassination-plan'], location: 'Black Whale · Tier 1 · Room 1002' }),
]);

export const succession372HiddenNenUserResearch = freeze({
  furykovOriginalClaim: 'Four attendees in the first Room 1014 class were concealing or displaying Nen despite presenting as beginners.',
  identifiedByChapter372: freeze([
    freeze({ person: 'Loberry', state: 'Nen initiation follows manipulation by Silent Majority; not self-aware as a conventional Nen user' }),
    freeze({ person: 'Shedule', state: 'Half-awakened through Halkenburg Guardian Spirit Beast manipulation; limited Nen use without conscious control' }),
    freeze({ person: 'Yuhirai', state: 'Half-awakened through Halkenburg Guardian Spirit Beast manipulation; limited Nen use without conscious control' }),
  ]),
  remainingUnknown: 'One fourth person remains unidentified. The supplied notes say this person is experienced enough to make their aura flow resemble that of an uninitiated person.',
  archiveCaution: 'Do not describe Shedule, Yuhirai, or Loberry as secretly trained Nen users. Their apparent Nen use has different involuntary causes.',
  source,
});

export const succession372HalkenburgGuardianBeastResearch = freeze({
  observedSequence: freeze([
    'Halkenburg sees all guards unconscious and then loses consciousness himself.',
    'Afterward the guards are awake with feather marks on the backs of their hands.',
    'The guards have no memory of their blackout and did not consider Halkenburg’s unusual bedtime strange.',
    'Halkenburg also bears a feather mark.',
    'Shedule and Yuhirai can use aura in a limited way without consciously controlling it or seeing Nen.',
  ]),
  kurapikaClassification: 'Soliciting-type Manipulation hallmarks',
  memoryAssessment: 'Kurapika says memory revision is the most likely explanation for the guards’ missing recollection.',
  halfAwakening: 'The supplied notes describe affected guards as half-awakened: able to use Nen in a limited fashion but unable to control it themselves.',
  halkenburgRisk: 'Kurapika reasons that because Halkenburg bears the same mark, the prince is also exposed to the beast’s conditions and associated risks.',
  unresolved: freeze(['exact activation trigger', 'complete feather-mark function', 'full conditions and penalties', 'whether Halkenburg consciously influences any part of the process']),
  source,
});

export const succession372MomozeMurderResolution = freeze({
  victim: 'Momoze Hui Guo Rou',
  killer: 'Tuffdy',
  identification: 'Tuffdy incriminates himself by asking Hanzo how he knew it was him after Hanzo presents a fabricated framing plan.',
  suspectPoolBeforeTrap: freeze(['Tuffdy', 'Nagmum']),
  killerAbility: 'The Touch',
  abilityEvidence: 'The chapter notes state that Tuffdy used The Touch to assassinate Momoze; complete mechanics are not supplied in the current source text.',
  retaliation: 'Hanzo kills Tuffdy and stages the death to resemble suicide.',
  status: 'Momoze killer identified / Tuffdy deceased',
  source,
});

export const succession372MarayamRoomResearch = freeze({
  earlierObservation: 'Marayam’s Guardian Spirit Beast continues to grow and appears increasingly defensive.',
  causationTheory: 'Hanzo and Biscuit believe Momoze’s death accelerated the beast’s growth; this is not confirmed as the actual cause.',
  laterObservation: 'While operating through Hanzo Skill 4, Hanzo returns and finds Room 1013 empty: Biscuit, his own sleeping body, and the room’s other occupants are absent.',
  beastState: 'A smaller but more sinister-looking version of Marayam’s Guardian Spirit Beast remains visible.',
  hanzoAssessment: 'Hanzo fears the beast will not distinguish friend from foe.',
  archiveCaution: 'Chapter 372 establishes an anomalous/empty Room 1013 state but does not yet explain whether this is a separate space, barrier, duplication, displacement, or another Nen mechanism.',
  source,
});

export const succession372TysonBeastResearch = freeze({
  observedEntities: 'Small Guardian Spirit Beast-derived creatures described in the supplied notes as eye-wogs',
  observedBehavior: 'They avoid Benjamin soldier Orau while appearing on other people in Tyson’s room.',
  izunaviAssessment: 'Izunavi does not presently believe the creatures are a threat.',
  giulianoAssessment: 'Giuliano infers that Orau’s exclusion reflects some special demarcation or selection rule.',
  unresolved: freeze(['selection rule', 'purpose', 'ability effect', 'why Orau is excluded']),
  source,
});

export const succession372NenClassResearch = freeze({
  firstSessionEnd: '12:30 p.m. on Voyage Day 2',
  firstSessionDuration: '2.5 hours',
  hiddenNenProgress: 'Shedule and Yuhirai are recognized as involuntarily half-awakened rather than conventional trained users.',
  zhangLeiInformationCondition: 'Sakata makes explicit that Zhang Lei’s guards must be allowed to gather information or Zhang Lei has no incentive to continue lending them to Woble’s camp.',
  lowerPrinceAppeal: 'Kurapika intends to use Hunter Association connections to appeal for cooperation among lower-ranked princes.',
  source,
});

export const succession372BodyStates = freeze([
  freeze({ person: 'Tuffdy', state: 'deceased', detail: 'Killed by Hanzo after confessing to Momoze’s murder; death staged to resemble suicide.', chapter: 372, source }),
]);

export const succession372RelationshipRecords = freeze([
  freeze({ from: 'Hanzo', to: 'Tuffdy', type: 'Investigation / retribution', note: 'Hanzo traps Tuffdy into self-incrimination, identifies him as Momoze’s murderer, then kills him and stages a suicide.', phase: 'Active contest and voyage', chapters: '368–372', state: 'ended / Tuffdy deceased', source }),
  freeze({ from: 'Kaiser / Cleapatro', to: 'Seiko Hui Guo Rou', type: 'Judicial surveillance and interrogation', note: 'The Chapter 371 seventy-two-hour observation becomes active questioning in Chapter 372; Seiko invokes her right to remain silent.', phase: 'Active contest and voyage', chapters: '371–372', state: 'active investigation / no guilt established', source }),
  freeze({ from: 'Kurapika', to: 'Halkenburg camp / Yuhirai', type: 'Nen intelligence cooperation', note: 'Kurapika analyzes the feather-mark phenomenon and offers to devise countermeasures if Halkenburg’s camp provides enough information.', phase: 'Active contest and voyage', chapters: '372–current', state: 'conditional information cooperation', source }),
  freeze({ from: 'Kurapika / Sakata / Yuhirai', to: 'lower-ranked princes', type: 'Defensive coalition proposal', note: 'The three agree that protecting their princes takes priority while Kurapika proposes broader lower-prince cooperation through Hunter Association links.', phase: 'Active contest and voyage', chapters: '372–current', state: 'proposed / developing', source }),
  freeze({ from: 'Camilla Hui Guo Rou', to: 'Musse', type: 'Coercive command / death threat', note: 'Camilla orders Musse to cooperate with her attempt to kill Benjamin and threatens him with death for refusal.', phase: 'Active contest and voyage', chapters: '372', state: 'active confrontation', source }),
]);

export const succession372Mysteries = freeze([
  freeze({ question: 'Who is the fourth concealed Nen user Furykov identified in the first Room 1014 class?', evidence: 'Chapter 372 identifies Loberry, Shedule, and Yuhirai as three of the four. The fourth is described as experienced enough to disguise aura flow as that of an uninitiated person.', status: 'open / narrowed to one unidentified experienced user', lastChapter: '372', source }),
  freeze({ question: 'What are the complete conditions and purpose of Halkenburg’s Guardian Spirit Beast feather marks?', evidence: 'The marks follow a group blackout, affected guards lose memory and become half-awakened Nen users, and Kurapika identifies soliciting-type Manipulation hallmarks. Halkenburg also carries a mark.', status: 'developing / manipulation and half-awakening established', lastChapter: '372', source }),
  freeze({ question: 'What happened to Room 1013 while Hanzo was using Hanzo Skill 4?', evidence: 'Hanzo returns to find Biscuit, his physical body, and the room’s other occupants absent while a smaller, more menacing Marayam Guardian Spirit Beast remains.', status: 'open / spatial anomaly established', lastChapter: '372', source }),
  freeze({ question: 'Why do Tyson’s eye-wogs avoid Orau?', evidence: 'Giuliano notices the creatures appearing on others but not Benjamin soldier Orau and infers a special distinction, while Izunavi does not yet view them as threatening.', status: 'open', lastChapter: '372', source }),
  freeze({ question: 'What does Salé-salé intend to do at the next banquet?', evidence: 'Salé-salé again refuses to explain the plan he previously claimed would change the world.', status: 'open / plan still concealed', lastChapter: '372', source }),
]);

const focus = 'The first Nen class reveals that Shedule and Yuhirai are involuntarily half-awakened through Halkenburg’s Guardian Spirit Beast; Kurapika links the feather-mark blackout to soliciting-type Manipulation and proposes a lower-prince defensive coalition. Kaiser’s Seiko investigation continues, Hanzo uses Hanzo Skill 4 to expose Tuffdy as Momoze’s killer and kills him, Tyson’s eye-wogs show selective behavior, Room 1013 becomes an unexplained spatial anomaly, and Camilla moves toward a direct attack on Benjamin.';

export const succession372ChapterFocus = freeze({ 372: focus });

export const succession372ChapterResearch = freeze([
  freeze({
    number: 372,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze(['Nen class', 'Halkenburg Guardian Spirit Beast', 'Momoze murder investigation', 'Room 1013 anomaly', 'Judicial investigation', 'lower-prince coalition', 'Camilla operation']),
    focus,
    events: succession372TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Kurapika', 'Furykov', 'Shedule', 'Yuhirai', 'Seiko Hui Guo Rou', 'Kaiser', 'Cleapatro', 'Biscuit Krueger', 'Hanzo', 'Marayam Hui Guo Rou', 'Momoze Hui Guo Rou', 'Tuffdy', 'Nagmum', 'Benjamin Hui Guo Rou', 'Salé-salé Hui Guo Rou', 'Tyson Hui Guo Rou', 'Izunavi', 'Giuliano', 'Orau', 'Sakata', 'Zhang Lei Hui Guo Rou', 'Halkenburg Hui Guo Rou', 'Oito Hui Guo Rou', 'Camilla Hui Guo Rou', 'Musse']),
    relationships: succession372RelationshipRecords,
    assignments: freeze([
      freeze({ subject: 'Room 1014 first Nen class', assignment: 'Furykov and Belerainte continue as experienced assistants while Kurapika handles private intelligence exchanges after the 12:30 session.', state: 'active', source }),
      freeze({ subject: 'Kaiser', assignment: 'Seventy-two-hour judicial observation/interrogation of Seiko’s household.', state: 'active', source }),
      freeze({ subject: 'Halkenburg camp', assignment: 'Yuhirai gathers more information about the feather-mark ability so Kurapika can propose countermeasures.', state: 'active / intelligence task', source }),
    ]),
    abilities: freeze([
      freeze({ ability: 'Hanzo Skill 4', owner: 'Hanzo', knownAtChapterBoundary: 'Hanzo uses a projected double for covert investigation while off duty.', confidence: 'Confirmed ability name/use; only mechanics visible in the supplied Chapter 372 text are attributed here.', source }),
      freeze({ ability: 'The Touch', owner: 'Tuffdy', knownAtChapterBoundary: 'Named in the chapter notes as the ability Tuffdy used to assassinate Momoze.', confidence: 'Name and murder use confirmed; complete mechanics not supplied.', source }),
      freeze({ ability: 'Halkenburg Guardian Spirit Beast manipulation', owner: 'Halkenburg Guardian Spirit Beast', knownAtChapterBoundary: 'Feather-marked guards show soliciting-type Manipulation hallmarks, memory loss, and involuntary half-awakened Nen use.', confidence: 'Kurapika classification plus supplied chapter-note explanation; full conditions remain unknown.', source }),
    ]),
    guardianBeasts: freeze([
      freeze({ host: 'Halkenburg Hui Guo Rou', update: 'Feather-mark phenomenon is linked to soliciting-type Manipulation hallmarks, memory revision is considered likely, and marked guards are half-awakened Nen users.', source }),
      freeze({ host: 'Marayam Hui Guo Rou', update: 'Beast continues to change in size/defensive presentation and remains in an anomalously empty Room 1013 observed by Hanzo.', source }),
      freeze({ host: 'Tyson Hui Guo Rou', update: 'Eye-wog-like offshoots selectively avoid Orau; selection rule and purpose remain unknown.', source }),
    ]),
    bodyStates: succession372BodyStates,
    mysteries: succession372Mysteries,
    sourceTextNotes: freeze([
      'Shedule and Yuhirai should not be labeled secretly trained Nen users: Chapter 372 describes them as half-awakened and unable to control their aura consciously.',
      'Kurapika’s soliciting-type Manipulator classification and likely memory-revision explanation are in-story analysis, not a complete narrated ruleset for Halkenburg’s beast.',
      'Hanzo and Biscuit’s belief that Momoze’s death accelerated Marayam’s beast growth remains their causal theory.',
      'Hanzo’s belief that Marayam’s beast may not distinguish friend from foe is not promoted to a confirmed targeting rule.',
      'The Touch is named as Tuffdy’s murder ability, but this supplied text does not provide enough mechanics to reconstruct how it works.',
    ]),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, princeStates: true, guardianBeasts: true, nen: true }),
    source,
    sourcePolicy: succession372SourcePolicy,
  }),
]);
