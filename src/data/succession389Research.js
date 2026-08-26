const freeze = (value) => Object.freeze(value);
const source389 = 'https://hunterxhunter.fandom.com/wiki/Chapter_389';

export const succession389SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 389 synopsis text',
  chapterUrl: source389,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Preserve the explicit Voyage Day 9 10:00 a.m. flashback and the explicit Voyage Day 10 11:30 a.m. return to the present. Do not assign exact clock times to later Chapter 389 scenes where none are supplied.',
  excluded: freeze([
    'All outside story claims',
    'Later-chapter outcomes or mechanics not contained in the supplied Chapter 389 synopsis',
    'Treating character deductions as confirmed Nen mechanics',
    'Treating Giuliano’s emotional response to Tyson or the Book of Tyson as proof of Nen manipulation',
  ]),
});

const event = ({ id, day, time = null, chronology = null, label, detail, people = [], tracks = [], confidence = 'Confirmed in the supplied Hunterpedia Chapter 389 synopsis' }) => freeze({
  id,
  day,
  time,
  chronology,
  label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  chapter: 389,
  confidence,
  source: source389,
});

export const succession389TimelineEvents = freeze([
  event({
    id: '389-day9-kanjidol-balsamilco-shikaku-review',
    day: 9,
    time: '10:00 a.m.',
    chronology: 'flashback',
    label: 'Kanjidol reports the Room 1007 Shikaku incident to Benjamin and Balsamilco',
    detail: 'Kanjidol recounts Shikaku shouting support for Benjamin before shooting himself and the aura rumbling stopping. He proposes that an ability associated with Halkenburg directly caused the suicide. Balsamilco agrees that Halkenburg is the central threat but challenges the proposed route, motive, prince-killing assumptions, and suicide explanation.',
    people: ['Kanjidol', 'Benjamin Hui Guo Rou', 'Balsamilco Might', 'Shikaku', 'Halkenburg Hui Guo Rou', 'Luzurus Hui Guo Rou'],
    tracks: ['halkenburg', 'shikaku', 'benjamin', 'threat-analysis', 'flashback'],
  }),
  event({
    id: '389-day10-fourth-rumbling-vict-radio',
    day: 10,
    time: '11:30 a.m.',
    chronology: 'present',
    label: 'Benjamin and Balsamilco feel the fourth rumbling and receive Vict’s broken radio report',
    detail: 'At the same explicit Voyage Day 10 11:30 a.m. point as the fourth rumbling, Benjamin and Balsamilco hear a fragmented transmission from Vict mentioning Halkenburg, a bow, failure, and apparent invincibility before a scream. Benjamin identifies the speaker as Vict and says Tackle Shield did not keep Halkenburg in check.',
    people: ['Benjamin Hui Guo Rou', 'Balsamilco Might', 'Vict', 'Halkenburg Hui Guo Rou'],
    tracks: ['halkenburg', 'vict', 'tackle-shield', 'fourth-aura-rumbling'],
  }),
  event({
    id: '389-halkenburg-arrest-plan',
    day: 10,
    chronology: 'present-after-11:30-no-exact-time',
    label: 'Balsamilco designs a legal-custody operation against Halkenburg',
    detail: 'Balsamilco argues that soldier redeployments, lower-tier killings, and anomalies affecting Benjamin’s men provide evidence and motive to arrest Halkenburg on suspicion of premeditated murder. The operational goal is to separate Halkenburg from his followers and exploit the later trial as the moment for Benjamin’s side to act.',
    people: ['Balsamilco Might', 'Benjamin Hui Guo Rou', 'Halkenburg Hui Guo Rou'],
    tracks: ['halkenburg', 'custody', 'trial', 'benjamin'],
  }),
  event({
    id: '389-halkenburg-taken-into-custody',
    day: 10,
    chronology: 'present-after-11:30-no-exact-time',
    label: 'Restricted Voyage Permit Agency task force takes Halkenburg into custody',
    detail: 'Five members of the agency special task force, including Steiner and Peuckert, take Halkenburg into custody. Balsamilco says Halkenburg cannot contact his men until after trial, while also expecting insufficient evidence may eventually lead to release under surveillance.',
    people: ['Halkenburg Hui Guo Rou', 'Steiner', 'Peuckert', 'Balsamilco Might', 'Benjamin Hui Guo Rou'],
    tracks: ['halkenburg', 'custody', 'restricted-voyage-permit-agency', 'trial'],
  }),
  event({
    id: '389-giuliano-tyson-book-birthday',
    day: 10,
    chronology: 'present-no-exact-time',
    label: 'Giuliano grows emotionally attached to Tyson’s household and receives an early birthday celebration',
    detail: 'Giuliano tells Izunavi that he misjudged Tyson and reads the Book of Tyson as a possible parting message. Tyson and the household then surprise him with a birthday celebration despite it not being his birthday, explaining that they expect to part in two months. Giuliano cries.',
    people: ['Giuliano', 'Izunavi', 'Tyson Hui Guo Rou'],
    tracks: ['tyson', 'book-of-tyson', 'giuliano', 'household'],
  }),
  event({
    id: '389-kanjidol-basho-room1007-investigation',
    day: 10,
    chronology: 'present-no-exact-time',
    label: 'Kanjidol investigates Room 1007 while Basho feeds him a false theory',
    detail: 'Kanjidol develops multiple hypotheses involving Duazul’s guards and possible manipulation around Shikaku’s death. Basho outwardly encourages suspicion of Duazul’s men, but privately believes Benjamin’s side staged the suicide as a red herring and considers post-mortem Nen. Neither man’s theory is confirmed by Chapter 389.',
    people: ['Kanjidol', 'Basho', 'Luzurus Hui Guo Rou', 'Duazul Hui Guo Rou', 'Odessa', 'Gadeau', 'Scairt', 'Macne', 'Shikaku', 'Halkenburg Hui Guo Rou'],
    tracks: ['luzurus', 'shikaku', 'post-mortem-nen', 'counterintelligence'],
  }),
  event({
    id: '389-have-not-curse-network-disclosure',
    day: 10,
    chronology: 'present-no-exact-time',
    label: 'Camilla’s Have-Not curse-assassination network is explained',
    detail: 'Chapter 389 explains the old Kakin afterlife-companion tradition, the continuing Have-Not caste, Camilla’s elevation of Have-Nots into her personal army, and the conversion of that tradition plus Nen into assigned post-mortem curse assassins targeting the remaining princes.',
    people: ['Camilla Hui Guo Rou', 'Moswana', 'Sarahell', 'Fukataki'],
    tracks: ['camilla', 'have-nots', 'curse', 'post-mortem-nen'],
  }),
  event({
    id: '389-have-not-curse-ritual-and-targeting',
    day: 10,
    chronology: 'present-no-exact-time',
    label: 'The Have-Not curse ritual and current target assignments are detailed',
    detail: 'The curse bearers repeatedly curse an assigned prince while carrying a target-linked object, eventually burn the object, drink an infusion of its ashes, and die by dagger. Stronger preparation and closer death proximity strengthen the curse; at maximum power the target can be deprived of aura, forced into Zetsu, and die after several hours. Sarahell plans to approach Woble through Kurapika’s next class, while Taler is redirected toward Marayam.',
    people: ['Sarahell', 'Fukataki', 'Taler', 'Woble Hui Guo Rou', 'Marayam Hui Guo Rou', 'Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Momoze Hui Guo Rou', 'Salé-salé Hui Guo Rou'],
    tracks: ['have-not-curse', 'woble', 'marayam', 'nen-exorcism', 'room-1014-threat'],
  }),
  event({
    id: '389-zhang-lei-tenftory-coventoba-coins',
    day: 10,
    chronology: 'present-no-exact-time',
    label: 'Tenftory receives a Zhang Lei coin while Coventoba observes his own coin has changed from 1 to 10',
    detail: 'Tenftory reports successful Nen training and says he can now see Zhang Lei’s Guardian Spirit Beast. Zhang Lei openly rewards him with a coin and calls him the first recipient, while Coventoba privately knows he secretly picked one up earlier and observes that the number on his coin has changed from 1 to 10.',
    people: ['Zhang Lei Hui Guo Rou', 'Tenftory', 'Coventoba'],
    tracks: ['zhang-lei', 'guardian-spirit-beast', 'coins', 'nen-class'],
  }),
]);

export const succession389KanjidolBalsamilcoResearch = freeze({
  flashback: 'Voyage Day 9 at exactly 10:00 a.m.',
  reportedObservation: 'Shikaku shouted “Long live Prince Benjamin” before shooting himself, and the aura rumbling stopped afterward.',
  kanjidolTheory: 'Kanjidol theorizes that an ability associated with Halkenburg directly caused Shikaku’s suicide and may have been intended to protect Benjamin from an emitted attack.',
  balsamilcoObjections: freeze([
    'A direct line from Halkenburg toward Benjamin would pass through lower-prince rooms, which Balsamilco considers inconsistent with Halkenburg immediately choosing a plan that could sacrifice lower princes.',
    'If Shikaku could be controlled and ordered, Balsamilco questions why the controller would not use him to assassinate another prince.',
    'Balsamilco and Benjamin theorize that Guardian Spirit Beasts may be restricted from directly killing princes or one another, but Chapter 389 presents this as their reasoning rather than a newly proven universal law.',
  ]),
  manipulatorQuestion: 'Balsamilco notes that Shikaku was himself a Manipulator and reasons that self-manipulation should have been a defensive option, leaving the suicide unexplained.',
  assignment: 'Kanjidol is ordered to reconstruct anything else he remembers and monitor everyone in Room 1007.',
  boundary: 'Kanjidol and Balsamilco are performing threat analysis. Their proposed route, motive, prince-killing restriction, manipulation scenario, and reason for Shikaku’s suicide are not promoted to confirmed mechanics.',
  source: source389,
});

export const succession389HalkenburgCustodyResearch = freeze({
  presentAnchor: 'Voyage Day 10 at exactly 11:30 a.m. begins the present sequence, matching the fourth aura-rumbling endpoint of Chapter 388.',
  victTransmission: 'Vict’s radio transmission is fragmented. It establishes that he is confronting the Halkenburg threat and mentions failure, Halkenburg, a bow, and apparent invincibility, but does not provide a complete mechanical explanation.',
  tackleShield: freeze({
    owner: 'Vict',
    officialName: 'Tackle Shield',
    confirmedHere: 'Benjamin explicitly identifies Tackle Shield as Vict’s ability and says he had hoped it would keep Halkenburg in check.',
    unknown: 'Nen type, activation method, exact defensive effect, costs, range, and the precise reason it fails are not supplied.',
  }),
  benjaminObservation: 'Benjamin looks at four star marks on his hand, concludes Shikaku is dead, and says Vict is still alive. Chapter 389 does not add a complete new visual-indicator rule beyond that observation.',
  benjaminBalsamilcoHypotheses: freeze([
    'Benjamin assumes Halkenburg’s power likely involves his whole team.',
    'Balsamilco proposes that one ally may need to be sacrificed for each attack.',
    'Neither proposition is confirmed as the complete Halkenburg ability rule in Chapter 389.',
  ]),
  musseDecision: 'Balsamilco advises leaving Musse’s surveillance owl on Camilla instead of moving it to a Halkenburg guard because Camilla’s ability remains poorly understood.',
  arrestPlan: 'Balsamilco uses killings, military redeployment, and anomalies affecting Benjamin’s soldiers as the basis for arresting Halkenburg on suspicion of premeditated murder, separating him from his followers, and planning an attack around the trial.',
  custody: 'Five Restricted Voyage Permit Agency special-task-force members, including Steiner and Peuckert, take Halkenburg into custody. Balsamilco says he cannot contact his men until after trial and expects possible release under surveillance if evidence is insufficient.',
  boundary: 'Chapter 389 confirms custody and Benjamin’s operational response. It does not resolve Vict’s location, the exact arrow transfer topology, a one-sacrifice-per-shot rule, or the outcome of the planned trial operation.',
  source: source389,
});

export const succession389TysonGiulianoResearch = freeze({
  bookObservation: 'Giuliano is still reading the Book of Tyson and says its classic-song-lyric content makes it hard to put down.',
  emotionalChange: 'He says he was wrong about Tyson, would like her to be King despite that conflicting with her principles, and reads the book as a possible parting message.',
  izunaviWarning: 'Izunavi warns Giuliano not to become too emotionally attached and reminds him their mission is protection through arrival at the New Continent, where their real assignment begins.',
  celebration: 'Tyson and the household give Giuliano an early birthday celebration even though it is not his birthday, explaining that they expect to say goodbye in two months. Giuliano cries.',
  boundary: 'The chapter shows genuine emotional attachment but does not establish that the Book of Tyson or Tyson’s Guardian Spirit Beast caused Giuliano’s feelings through Nen.',
  source: source389,
});

export const succession389LuzurusInvestigationResearch = freeze({
  kanjidolHypotheses: freeze([
    'Shikaku may have died in front of Room 1007 to create a diversion.',
    'The diversion may have involved Queen Duazul’s guards and possibly Macne or Scairt.',
    'Kanjidol wonders whether Macne was being prepared to assassinate Luzurus.',
    'He is not certain whether Duazul’s men know Nen and explicitly rates Furykov as the better judge.',
  ]),
  bashoPublicPosition: 'Basho tells Kanjidol that Duazul’s men may be plotting something, that Macne and Scairt deserve observation, and that they may be hiding Nen ability.',
  bashoPrivatePosition: 'Basho reveals internally that his public position was a feint. He instead suspects Benjamin’s men, a death-triggered ability connected to Shikaku’s suicide, a Room 1007 red herring, and an attempt to blame Halkenburg.',
  postMortemNenConcern: 'Basho explicitly considers Nen after death as a threat category he must watch alongside Guardian Spirit Beasts.',
  boundary: 'Neither Kanjidol’s nor Basho’s explanation of Shikaku’s suicide is confirmed in Chapter 389.',
  source: source389,
});

export const succession389HaveNotCurseResearch = freeze({
  historicalContext: freeze({
    afterlifeCompanions: 'Ancient Kakin practiced sacrificial burial of afterlife companions, who were believed to supervise princes who failed to become King and prevent them from returning as ghosts that cursed the ruler or Kakin.',
    caste: 'The companions were selected from the lowest caste, the Have-Nots. The sacrificial custom ended, but the caste system continued and Have-Nots remained barred from public office and the military.',
    camillaChange: 'Camilla admitted Have-Nots to her personal army, gave them housing, and granted them military-equivalent status and rights. Her Have-Not supporters called for restoration of the afterlife-companion tradition.',
  }),
  network: 'The revived tradition combined with Nen and became an organized curse-assassination network, with one curse bearer assigned to each of the other eleven remaining princes.',
  preparation: freeze([
    'A curse bearer carries something connected to the assigned target, such as a name, photograph, or piece of clothing.',
    'The bearer curses the target repeatedly over time.',
    'Longer preparation and a death closer to the target make the curse stronger.',
  ]),
  terminalRitual: freeze([
    'After the preparation period, the bearer burns the carried target-linked object.',
    'The bearer drinks an infusion made from the ashes.',
    'The bearer then uses a dagger to commit suicide.',
  ]),
  targetEffect: 'After the bearer’s death, the target is deprived of aura. At the strongest described level, the target suffers under enforced Zetsu and dies after a few hours.',
  exorcism: 'Camilla’s side has a Nen exorcist on standby in case Camilla herself is cursed. The Have-Nots also investigate whether enemy princes or the Hunter Association have exorcists.',
  currentAssignments: freeze([
    'Moswana is assigned to Benjamin and says she curses him every day.',
    'Sarahell is assigned to Woble and plans to use Kurapika’s next round of classes to approach the prince.',
    'Taler is sent after Marayam after Kacho and Fugetsu’s custody makes those targets impractical on the desired timetable.',
    'The Have-Nots formerly assigned to Momoze and Salé-salé are redirected toward investigating enemy exorcists.',
  ]),
  kachoFugetsuEstimate: 'Fukataki says that because Kacho and Fugetsu are in custody, the curses aimed at them would now take six months to take effect. This six-month estimate is specific to that presented situation and is not stored as a universal curse formula.',
  spiritBeastAssessment: 'Fukataki judges the princes’ Guardian Spirit Beasts to be a major barrier and says the viable approach is death directly in front of a prince while making eye contact. The archive records this as Fukataki’s operational assessment, not as a guaranteed universal metaphysical rule.',
  sarahellBoundary: 'Sarahell only plans to attend Kurapika’s next class in Chapter 389. She has not yet entered Room 1014 at this chapter boundary.',
  source: source389,
});

export const succession389ZhangLeiCoinResearch = freeze({
  tenftory: 'Tenftory reports that the Nen training succeeded, says he can now see Zhang Lei’s Guardian Spirit Beast, and receives a coin directly from Zhang Lei.',
  publicFirstRecipientClaim: 'Zhang Lei tells Tenftory he is the first person to receive a coin from him.',
  coventobaCounterexample: 'Coventoba privately knows he was actually the first recipient because he had secretly picked up a coin earlier.',
  numberChange: 'Coventoba observes that the number on his coin has changed from 1 to 10.',
  boundary: 'Chapter 389 directly confirms the 1-to-10 number change but does not explain what the number means, what threshold triggers an effect, whether transfer caused the change, or what ability a holder may eventually receive.',
  source: source389,
});

export const succession389ObserverHypotheses = freeze([
  freeze({ observer: 'Kanjidol', hypothesis: 'Halkenburg’s ability may have directly forced Shikaku’s suicide, possibly to stop an emitted attack against Benjamin.', status: 'Hypothesis only; route, motive, and exact suicide mechanic are unresolved.' }),
  freeze({ observer: 'Balsamilco / Benjamin', hypothesis: 'Guardian Spirit Beasts may be constrained from directly killing another prince or beast because otherwise the contest would already have ended.', status: 'Character theory in this chapter, not promoted here as a new universal rule.' }),
  freeze({ observer: 'Benjamin', hypothesis: 'Halkenburg’s overwhelming power probably depends on his entire team.', status: 'Threat assessment only; exact group condition remains unresolved at the Chapter 389 boundary.' }),
  freeze({ observer: 'Balsamilco', hypothesis: 'Halkenburg’s attack may require sacrificing one ally for every shot.', status: 'Hypothesis only; Chapter 389 does not confirm a one-sacrifice-per-attack rule.' }),
  freeze({ observer: 'Kanjidol', hypothesis: 'Shikaku’s Room 1007 suicide may have been a diversion enabling manipulation or action through Duazul’s guards.', status: 'Hypothesis only.' }),
  freeze({ observer: 'Basho', hypothesis: 'Benjamin’s side may have staged Shikaku’s suicide as a post-mortem-Nen red herring to blame Halkenburg while targeting a higher prince.', status: 'Private suspicion only; no causal confirmation in Chapter 389.' }),
]);

export const succession389RelationshipRecords = freeze([
  freeze({
    id: 'relationship:benjamin-halkenburg-ch389-custody-operation',
    from: 'Benjamin Hui Guo Rou / Balsamilco Might',
    to: 'Halkenburg Hui Guo Rou',
    type: 'hostile-containment',
    chapter: 389,
    state: 'Benjamin and Balsamilco shift from observation and threat analysis to a legal-custody strategy intended to separate Halkenburg from his supporters and create an opening at trial.',
    boundary: 'The arrest and trial plan are confirmed; the planned attack outcome is not.',
    source: source389,
  }),
  freeze({
    id: 'relationship:sarahell-woble-ch389-curse-targeting',
    from: 'Sarahell',
    to: 'Woble Hui Guo Rou',
    type: 'curse-assassination-targeting',
    chapter: 389,
    state: 'Sarahell is assigned to Woble and plans to approach through Kurapika’s next Nen class.',
    boundary: 'Planning and target assignment only; Chapter 389 does not place Sarahell inside Room 1014.',
    source: source389,
  }),
  freeze({
    id: 'relationship:moswana-benjamin-ch389-curse-targeting',
    from: 'Moswana',
    to: 'Benjamin Hui Guo Rou',
    type: 'curse-assassination-targeting',
    chapter: 389,
    state: 'Moswana carries Benjamin’s picture and says she curses him every day for Camilla’s succession cause.',
    boundary: 'The ongoing curse preparation is explicit; successful terminal activation is not shown.',
    source: source389,
  }),
  freeze({
    id: 'relationship:taler-marayam-ch389-curse-targeting',
    from: 'Taler',
    to: 'Marayam Hui Guo Rou',
    type: 'curse-assassination-targeting',
    chapter: 389,
    state: 'After Kacho and Fugetsu become impractical curse targets on the desired timetable, Taler is assigned to Marayam.',
    boundary: 'Assignment only; no successful curse activation is shown in Chapter 389.',
    source: source389,
  }),
]);

export const succession389ResolvedQuestions = freeze([
  freeze({ question: 'What concealed assassination structure supports Camilla’s Have-Not soldiers?', chapter: 389, resolution: 'Chapter 389 explains the assigned post-mortem curse network, its historical afterlife-companion roots, preparation ritual, suicide cost, target-aura deprivation, and exorcism concerns.', source: source389 }),
  freeze({ question: 'Does Zhang Lei’s coin number change while held?', chapter: 389, resolution: 'Yes. Coventoba observes his secretly acquired coin change from 1 to 10, while the meaning of the change remains unknown.', source: source389 }),
]);

export const succession389Mysteries = freeze([
  freeze({ question: 'What exactly happened to Vict during the fourth aura-rumbling confrontation with Halkenburg?', chapter: 389, status: 'open; Vict is still judged alive by Benjamin but his whereabouts and exact condition are unresolved', source: source389 }),
  freeze({ question: 'What are the complete activation, group, sacrifice, and consciousness-transfer rules behind Halkenburg’s bow attack?', chapter: 389, status: 'open; Chapter 389 supplies fragmented evidence and character hypotheses but no full rule set', source: source389 }),
  freeze({ question: 'What does the Zhang Lei coin number changing from 1 to 10 mean?', chapter: 389, status: 'open', source: source389 }),
  freeze({ question: 'Can the Have-Not curses overcome a prince’s Guardian Spirit Beast or be reliably exorcised aboard the Black Whale?', chapter: 389, status: 'open', source: source389 }),
  freeze({ question: 'Who, if anyone, actually caused Shikaku to commit suicide in front of Room 1007 and why?', chapter: 389, status: 'open; multiple competing theories remain unconfirmed', source: source389 }),
]);

export const succession389ChapterResearch = freeze([
  freeze({
    number: 389,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    source: source389,
    sourcePolicy: succession389SourcePolicy,
    chronology: freeze({
      opening: 'Voyage Day 9 · 10:00 a.m. flashback',
      presentReturn: 'Voyage Day 10 · 11:30 a.m.',
      exactPresentReturnTime: '11:30 a.m.',
      overlap: 'The present return is the same fourth-aura-rumbling time anchor that closes Chapter 388.',
      laterScenes: 'Tyson, Luzurus, Camilla, and Zhang Lei scenes occur after the return to the present, but the supplied synopsis does not assign them exact clock times.',
    }),
    focus: 'Competing theories around Shikaku and Halkenburg give way to Halkenburg’s legal detention strategy, while Camilla’s Have-Not death-curse network is fully disclosed and Zhang Lei’s coin system produces its first explicit 1-to-10 number change.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Benjamin / Halkenburg', 'Luzurus investigation', 'Tyson household', 'Camilla curse network', 'Zhang Lei coins']),
    keyResearch: freeze({
      kanjidolBalsamilco: succession389KanjidolBalsamilcoResearch,
      halkenburgCustody: succession389HalkenburgCustodyResearch,
      tysonGiuliano: succession389TysonGiulianoResearch,
      luzurusInvestigation: succession389LuzurusInvestigationResearch,
      haveNotCurse: succession389HaveNotCurseResearch,
      zhangLeiCoins: succession389ZhangLeiCoinResearch,
    }),
    hypotheses: succession389ObserverHypotheses,
    relationships: succession389RelationshipRecords,
    resolvedQuestions: succession389ResolvedQuestions,
    mysteries: succession389Mysteries,
  }),
]);

export const succession389ChapterFocus = succession389ChapterResearch[0].focus;
