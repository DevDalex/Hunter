const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_383';

export const succession383SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 383 synopsis and chapter notes',
  titleMetadata: 'The supplied material says Chapter 383 shares a title with Chapter 279 but does not supply the title itself. No English, Japanese, or romanized title is invented.',
  chronologyNote: 'Chapter 382 explicitly opens the Sunday banquet at 8:00 p.m. on Voyage Day 8. Chapter 383 continues that same banquet and escape operation after the opening; no exact later clock time is invented from the ninety-minute planning reference.',
  identityBoundary: 'Kacho Hui Guo Rou dies during the failed escape. The Kacho who subsequently returns to Fugetsu is Kacho’s Guardian Spirit Beast acting through Without You, not the living human Kacho.',
  escapeBoundary: 'A mass of hands attacks the twins as their lifeboat approaches open water. Kacho interprets this as the succession ritual preventing a prince from escaping, but the supplied material does not fully identify the hands’ exact Nen source, range, or universal enforcement rules.',
  hunterCodeBoundary: 'Chapter 383 reveals the Hunter Code rule and retrospectively decodes Mizaistom’s Chapter 381 call. The decode is stored as Chapter 383 knowledge and linked backward without rewriting it as explicit Chapter 381 character knowledge.',
  excluded: freeze([
    'Outside story claims',
    'Unsupplied Chapter 384+ mechanics',
    'A claim that the Kacho-form Guardian Spirit Beast contains Kacho’s confirmed human consciousness',
    'A complete universal rule for the succession ritual escape barrier beyond the observed Chapter 383 incident',
    'An invented exact clock time for Melody’s performance or the lifeboat escape',
  ]),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1', time = 'Voyage Day 8 · after 8:00 p.m.', confidence = 'confirmed' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 383,
  confidence,
  source,
});

export const succession383TimelineEvents = freeze([
  event({
    id: '383-banquet-program-adjustment',
    title: 'The banquet announces Salé-salé’s absence as illness while the concert order remains intact',
    detail: 'As Kakin elites take their seats, the royal concert is announced and Salé-salé is said to be unable to perform because of illness. Kacho and Fugetsu are informed that the program has changed but that their relative position in the performance order remains usable for the escape plan.',
    tracks: ['sunday-banquet', 'sale-sale', 'kacho', 'fugetsu', 'cover-story'],
    location: 'Black Whale · Tier 1 · Sunday banquet hall',
    confidence: 'The banquet announcement explicitly gives illness as the public explanation; Chapter 382 has already established Salé-salé’s death in the maintained chronology.',
  }),
  event({
    id: '383-marayam-space-reentry-rule',
    title: 'Room 1013 learns that servants who leave the Nen space cannot return',
    detail: 'A Hunter in Marayam’s guard detail tells Vergei and Biscuit that the servants who left the isolated Room 1013 space to perform at the banquet will not be able to re-enter it. Vergei accepts the loss as safer than a suspicious last-minute withdrawal from the banquet.',
    tracks: ['marayam', 'room-1013', 'vergei', 'biscuit', 'guardian-spirit-beast', 'spatial-isolation'],
    location: 'Black Whale · Tier 1 · Room 1013 isolated Nen space',
  }),
  event({
    id: '383-room1013-hunter-redeployment-plan',
    title: 'Biscuit proposes moving Hunters into the real Room 1013 while she remains with Marayam',
    detail: 'Biscuit suggests placing Hunters in the real room to make the household appear more natural and reduce pressure on the servants. She chooses to remain inside the Nen space with Marayam and Vergei.',
    tracks: ['marayam', 'biscuit', 'vergei', 'hunters', 'protection-plan'],
    location: 'Black Whale · Tier 1 · Room 1013 isolated Nen space',
  }),
  event({
    id: '383-keeney-piano-solo',
    title: 'Keeney performs immediately before Melody’s escape window',
    detail: 'Keeney performs his scheduled piano solo while Melody, Kacho, and Fugetsu prepare for the next phase of the plan. Kacho tells Fugetsu she will not consider failure.',
    tracks: ['keeney', 'melody', 'kacho', 'fugetsu', 'sunday-banquet'],
    location: 'Black Whale · Tier 1 · Sunday banquet hall',
  }),
  event({
    id: '383-melody-three-minute-entrancement',
    title: 'Melody’s flute performance entrances everyone who can hear it for three minutes',
    detail: 'Melody begins her flute solo and states that a sincere performance can entrance everyone who hears it for three minutes. Listeners experience an expansive vision of mountains, flowers, and butterflies, and the effect reaches absent princes through the banquet loudspeakers.',
    tracks: ['melody', 'nen', 'music', 'mass-entrancement', 'sunday-banquet'],
    location: 'Black Whale · Tier 1 · Sunday banquet hall and loudspeaker reach',
  }),
  event({
    id: '383-keeney-leads-twins-to-lifeboat',
    title: 'Keeney leads Kacho and Fugetsu through the incapacitated security line to a lifeboat',
    detail: 'While Melody keeps the listeners entranced, Keeney leads the twins past incapacitated soldiers to the lifeboats. He instructs them to use their transportation ability only as a last resort and to return to their room if the escape door fails to appear.',
    tracks: ['keeney', 'kacho', 'fugetsu', 'melody', 'escape-plan', 'lifeboat'],
    location: 'Black Whale · Tier 1 · banquet-to-lifeboat route',
  }),
  event({
    id: '383-keeney-suicide',
    title: 'Keeney kills himself after launching the twins’ escape',
    detail: 'After the lifeboat departs, Keeney shoots himself. A flashback establishes that his wife and daughter died two years earlier, that he had been looking for a place to die, and that he intended his death to protect the Hunter Association and other accomplices from exposure while helping save the twins.',
    tracks: ['keeney', 'melody', 'hunter-association', 'escape-plan', 'death'],
    location: 'Black Whale · Tier 1 · lifeboat area',
    confidence: 'Keeney’s stated motive and Melody’s inability to dissuade him are explicit in the supplied Chapter 383 synopsis.',
  }),
  event({
    id: '383-escape-boundary-hands',
    title: 'A mass of hands attacks the twins as their lifeboat approaches open water',
    detail: 'As the lifeboat nears the tunnel exit and open water, a horde of hands surrounds Kacho and Fugetsu. Kacho concludes that a prince who tries to escape the ship is driven toward death and orders Fugetsu to open a return door.',
    tracks: ['kacho', 'fugetsu', 'succession-ritual', 'escape-boundary', 'lifeboat'],
    location: 'Black Whale · lifeboat escape tunnel',
    confidence: 'The attack is observed. Kacho’s interpretation links it to leaving the succession boundary, but the supplied synopsis does not fully identify the hands’ exact Nen source or universal rule set.',
  }),
  event({
    id: '383-kacho-fugetsu-separated',
    title: 'Fugetsu escapes through a return door while Kacho is left behind',
    detail: 'Fugetsu creates a door back toward the ship as the hands close in. The door shuts with Fugetsu alone inside the tunnel while Kacho remains outside the safe route.',
    tracks: ['kacho', 'fugetsu', 'magical-worm', 'separation', 'escape-plan'],
    location: 'Black Whale · lifeboat escape tunnel / Magical Worm route',
  }),
  event({
    id: '383-kacho-death',
    title: 'Kacho dies on the drifting lifeboat',
    detail: 'The chapter later reveals Kacho’s original body dead on the lifeboat as it drifts away at sea. The living human Kacho does not return to the ship.',
    tracks: ['kacho', 'death', 'lifeboat', 'succession-ritual'],
    location: 'Outside Black Whale · drifting lifeboat',
  }),
  event({
    id: '383-without-you-manifests-kacho',
    title: 'Without You takes Kacho’s form and returns to Fugetsu',
    detail: 'After Fugetsu cries out for her sister, a door opens and an apparent Kacho rejoins her. The chapter reveals that this Kacho is the formless Guardian Spirit Beast ability Without You, which assumes a twin’s form after one sister dies and remains beside the survivor as protection.',
    tracks: ['kacho', 'fugetsu', 'without-you', 'guardian-spirit-beast', 'post-death-protection'],
    location: 'Black Whale · Magical Worm route / twin bedroom',
  }),
  event({
    id: '383-twin-beast-cooperation-revealed',
    title: 'Magical Worm and Without You are revealed as cooperative twin Guardian Spirit Beast abilities',
    detail: 'Fugetsu’s Guardian Spirit Beast is identified as the translocation tunnel ability Magical Worm, with Fugetsu controlling the outward journey and Kacho associated with the return journey. Kacho’s formless Guardian Spirit Beast is identified as Without You, a death-triggered protective continuation that takes a twin’s form and stays with the surviving sister.',
    tracks: ['magical-worm', 'without-you', 'fugetsu', 'kacho', 'guardian-spirit-beast', 'cooperation'],
    location: 'Black Whale · twin route / bedroom',
  }),
]);

export const succession383BanquetResearch = freeze({
  event: 'First Sunday royal banquet concert',
  publicSaleSaleExplanation: 'The audience is told that Salé-salé cannot perform because of illness. The maintained Chapter 382 chronology already records his assassination; Chapter 383 therefore preserves illness as the public explanation rather than revising his actual status.',
  finalActs: freeze(['Keeney piano solo', 'Melody flute solo', 'Kacho and Fugetsu glass harp performance']),
  absentPrincesObservedByMelody: freeze(['Benjamin Hui Guo Rou', 'Camilla Hui Guo Rou']),
  melodyInference: 'Melody is relieved that Benjamin and Camilla are absent because she considers both likely Nen users. This is Melody’s risk assessment, not a newly proven Nen classification in Chapter 383.',
  planCountdown: 'The supplied synopsis states that roughly ninety minutes remain until the escape operation from the point Kacho and Fugetsu receive the program update; no exact clock time is inferred.',
  source,
});

export const succession383MarayamSpaceResearch = freeze({
  prince: 'Marayam Hui Guo Rou',
  location: 'Room 1013 isolated Nen space',
  confirmedReentryState: 'Servants who leave the Nen space to perform at the banquet will not be able to return to it.',
  vergeiReasoning: 'Vergei accepts the loss because a servant withdrawing from the banquet at the last minute could trigger suspicion and force Marayam and Sevanti back into the real room for questioning.',
  biscuitPlan: 'Biscuit proposes placing Hunters in the real Room 1013 to make the household appear more natural and reduce pressure on servants while she remains inside with Marayam.',
  mechanicsBoundary: 'The supplied synopsis confirms the observed re-entry restriction for the servants who leave, but does not explain the exact Nen mechanism, whether every class of person is affected identically, or whether the restriction can ever be reset.',
  source,
});

export const succession383MelodyPerformanceResearch = freeze({
  user: 'Melody',
  instrument: 'flute',
  activationStatement: 'Melody says that if she plays sincerely, she can entrance everyone who listens for three minutes.',
  demonstratedEffect: 'Listeners become incapacitated in ordinary action while experiencing a shared scenic vision of mountains, flowers, and butterflies.',
  transmission: 'The effect reaches people who hear the performance through the banquet loudspeakers, including absent princes.',
  demonstratedDuration: 'three minutes',
  operationalUse: 'Creates the window in which Keeney escorts Kacho and Fugetsu past soldiers to the lifeboats.',
  classificationBoundary: 'The supplied Chapter 383 material demonstrates the effect, reach through relayed sound, and three-minute duration but does not provide an official Nen-type classification or formal ability name.',
  source,
});

export const succession383KeeneyResearch = freeze({
  person: 'Keeney',
  role: 'Hunter/bodyguard and operational lead for the twins’ physical escape route',
  disclosedHistory: 'Keeney tells Melody that his wife and daughter died in an accident two years earlier and that he has been looking for a place to die since then.',
  operationalReasoning: 'He believes the Hunter Association could be blamed if accomplices are exposed and intends his death to sever the evidentiary trail while helping save the twins.',
  melodyAssessment: 'Melody hears his heartbeat during the earlier conversation and cannot convince him to abandon the plan.',
  finalAction: 'After the lifeboat departs, Keeney shoots himself in the head.',
  bodyState: 'deceased in Chapter 383',
  source,
});

export const succession383TwinEscapeResearch = freeze({
  participants: freeze(['Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Keeney', 'Melody']),
  launch: 'Melody’s three-minute performance incapacitates the listening security environment while Keeney escorts the twins to a lifeboat.',
  contingency: 'Keeney instructs the twins to use their transportation ability only if capture becomes imminent and to return to their room if the intended escape door does not appear.',
  boundaryIncident: 'As the lifeboat approaches open water, a horde of hands attacks the twins. Kacho concludes that leaving the ship as a prince leads to death and orders an immediate return through Fugetsu’s door.',
  separation: 'Fugetsu passes through the return door but Kacho does not. Kacho’s original body is later shown dead on the lifeboat.',
  apparentReunion: 'The Kacho who reunites with Fugetsu is Without You, Kacho’s Guardian Spirit Beast, not the living human Kacho.',
  result: 'Fugetsu survives and returns to the Black Whale; Kacho dies; the escape operation fails to remove the surviving prince from the succession environment.',
  mechanismBoundary: 'The observed hands enforce the failed escape in this scene, but their exact source and the full boundary conditions of the succession ritual remain unresolved.',
  source,
});

export const succession383MagicalWormResearch = freeze({
  owner: 'Fugetsu Hui Guo Rou Guardian Spirit Beast',
  ability: 'Magical Worm',
  category: 'translocation tunnel',
  observedMechanics: 'Magical Worm creates a tunnel/door route used for movement between locations. The chapter describes Fugetsu as controlling the outward journey and Kacho as controlling the return journey.',
  cooperativeSystem: 'Magical Worm operates in cooperation with Kacho’s Guardian Spirit Beast, Without You.',
  chapterUse: 'Fugetsu opens the emergency return door while the lifeboat escape is being attacked and survives by re-entering the route.',
  limits: freeze(['Exact range is not supplied.', 'The full destination-selection rules are not supplied.', 'The supplied synopsis does not further formalize how the return-control role functions after the human Kacho’s death and Without You’s manifestation.']),
  source,
});

export const succession383WithoutYouResearch = freeze({
  owner: 'Kacho Hui Guo Rou Guardian Spirit Beast',
  ability: 'Without You',
  priorForm: 'formless',
  trigger: 'One of the twins dies.',
  demonstratedTransformation: 'After Kacho dies, the Guardian Spirit Beast takes Kacho’s form and returns to Fugetsu.',
  purpose: 'Protect the surviving twin and remain by her side until death.',
  cooperativeSystem: 'Without You cooperates with Fugetsu’s Magical Worm transportation system.',
  identityBoundary: 'The Kacho-form entity is a Guardian Spirit Beast continuation. The supplied synopsis does not establish that Kacho’s human consciousness survives inside it.',
  status: 'active beside Fugetsu at the Chapter 383 boundary',
  source,
});

export const succession383HunterCodeResearch = freeze({
  revealChapter: 383,
  linkedEarlierChapter: 381,
  rule: 'When a number is stated first in a conversation, a Hunter treats it as a signal to use the nth word in each following sentence.',
  vizSignal: '11:55',
  vizDecodedMessage: 'Assist Princes escape fully',
  vizSentenceWords: freeze(['Assist', 'Princes', 'escape', 'fully']),
  japaneseSignal: '13:44',
  japaneseDifference: 'The supplied notes state that the Japanese text selects the corresponding nth clause rather than word/character while conveying the same hidden message.',
  boundary: 'This Chapter 383 reveal retrospectively explains Mizaistom’s Chapter 381 instructions; it is not backdated as explicit Chapter 381 character knowledge.',
  source,
});

export const succession383BodyStates = freeze([
  freeze({
    character: 'Keeney',
    state: 'deceased',
    bodyState: 'fatal self-inflicted gunshot after the lifeboat launch',
    consciousness: 'deceased',
    cause: 'suicide after completing his part of the twin escape operation',
    chapter: 383,
    source,
  }),
  freeze({
    character: 'Kacho Hui Guo Rou',
    state: 'deceased',
    bodyState: 'original human body dead on the drifting lifeboat',
    consciousness: 'human consciousness after death is not established by the supplied material',
    cause: 'death during the succession-boundary escape failure; exact physical mechanism beyond the hand attack is not separately detailed',
    chapter: 383,
    source,
  }),
  freeze({
    character: 'Kacho-form Without You',
    state: 'active Guardian Spirit Beast manifestation',
    bodyState: 'Nen beast taking Kacho’s appearance',
    consciousness: 'Guardian Spirit Beast behavior; Kacho’s human consciousness is not confirmed to persist',
    cause: 'Without You activates after a twin dies',
    chapter: 383,
    source,
  }),
]);

export const succession383RelationshipRecords = freeze([
  freeze({
    from: 'Kacho Hui Guo Rou',
    to: 'Fugetsu Hui Guo Rou',
    type: 'Twin protection transformed by death',
    note: 'The sisters’ escape plan ends with Kacho’s death, but Kacho’s Guardian Spirit Beast assumes her form through Without You and continues the protection mission beside Fugetsu.',
    phase: 'Active contest and voyage',
    chapters: '383',
    state: 'living twin relationship ended / Guardian Spirit Beast protection continuation active',
    source,
  }),
  freeze({
    from: 'Melody',
    to: 'Kacho Hui Guo Rou and Fugetsu Hui Guo Rou',
    type: 'Protective escape support',
    note: 'Melody deliberately uses her three-minute performance to create the escape window and hopes the twins reach safety.',
    phase: 'Active contest and voyage',
    chapters: '383',
    state: 'escape support executed / Kacho lost / Fugetsu survives',
    source,
  }),
  freeze({
    from: 'Keeney',
    to: 'Kacho Hui Guo Rou and Fugetsu Hui Guo Rou',
    type: 'Sacrificial escape protection',
    note: 'Keeney escorts the twins to the lifeboat, gives them contingency instructions, and then kills himself in part to shield the Hunter Association and surviving accomplices from exposure.',
    phase: 'Active contest and voyage',
    chapters: '383',
    state: 'mission completed / Keeney deceased',
    source,
  }),
  freeze({
    from: 'Biscuit Krueger',
    to: 'Marayam Hui Guo Rou',
    type: 'Protective guard commitment',
    note: 'Biscuit chooses to remain inside the isolated Nen space with Marayam while proposing that other Hunters shift toward the real Room 1013.',
    phase: 'Active contest and voyage',
    chapters: '383',
    state: 'Biscuit remains inside / outer-room normalization plan proposed',
    source,
  }),
]);

export const succession383Mysteries = freeze([
  freeze({
    question: 'What exact mechanism creates the hands that attack princes trying to leave the Black Whale?',
    evidence: 'The hands appear as Kacho and Fugetsu’s lifeboat approaches open water. Kacho interprets the attack as the succession system making escape fatal.',
    status: 'escape enforcement observed / exact Nen source and universal rules unresolved',
    lastChapter: '383',
    source,
  }),
  freeze({
    question: 'Does Kacho’s human consciousness persist in Without You?',
    evidence: 'Without You takes Kacho’s form and protective role after Kacho’s body dies, but the supplied synopsis identifies the returning Kacho as a Guardian Spirit Beast rather than confirming surviving human consciousness.',
    status: 'open / identity distinction preserved',
    lastChapter: '383',
    source,
  }),
  freeze({
    question: 'How does Magical Worm’s return-control role operate after Kacho’s death?',
    evidence: 'The chapter describes Fugetsu controlling the outward journey and Kacho the return journey, while also revealing that the Kacho beside Fugetsu after the escape is Without You.',
    status: 'cooperative ability confirmed / post-death control topology not fully formalized',
    lastChapter: '383',
    source,
  }),
  freeze({
    question: 'What are the complete re-entry rules of Marayam’s isolated Room 1013 Nen space?',
    evidence: 'The servants who leave for the banquet are stated to be unable to return, but the supplied synopsis does not define whether the rule applies identically to every person, every exit, or every later state of the space.',
    status: 're-entry restriction demonstrated / complete rule unresolved',
    lastChapter: '383',
    source,
  }),
]);

const focus = 'The first Sunday banquet becomes the launch point for Kacho and Fugetsu’s escape. Melody demonstrates a three-minute mass entrancement through her flute performance, Keeney escorts the twins to a lifeboat and then dies by suicide, and the succession boundary violently prevents the twins from leaving the ship. Fugetsu survives by reopening her transportation route, while Kacho dies on the lifeboat. The chapter then reveals the cooperative Guardian Spirit Beast system: Magical Worm handles the twins’ translocation route and Kacho’s formless beast, Without You, takes Kacho’s form after her death to remain beside and protect Fugetsu. The chapter also clarifies the Hunter Code hidden message from Chapter 381 and adds a re-entry restriction to Marayam’s isolated Room 1013 Nen space.';

export const succession383ChapterResearch = freeze([
  freeze({
    number: 383,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'same-as-chapter-279-title-not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 8',
    voyageDayConfidence: 'Chapter 383 continues the Sunday banquet that Chapter 382 explicitly opened at 8:00 p.m. on Voyage Day 8. Exact later clock times are not supplied and are not inferred from the ninety-minute countdown.',
    lanes: freeze([
      'Sunday banquet concert',
      'Melody mass entrancement',
      'Kacho and Fugetsu escape attempt',
      'Keeney suicide',
      'succession escape boundary',
      'Kacho death',
      'Magical Worm',
      'Without You',
      'Hunter Code retrospective',
      'Marayam Room 1013 isolated-space re-entry rule',
    ]),
    focus,
    events: succession383TimelineEvents,
    prelude: freeze([
      'Chapter 382 ended at the Sunday banquet opening with Kacho, Fugetsu, and Melody waiting to execute the escape plan.',
      'Chapter 381’s apparently anti-escape call from Mizaistom is retrospectively decoded in Chapter 383 as a Hunter Code instruction to assist the princes’ escape.',
    ]),
    characters: freeze([
      'Kacho Hui Guo Rou',
      'Fugetsu Hui Guo Rou',
      'Melody',
      'Keeney',
      'Marayam Hui Guo Rou',
      'Vergei',
      'Biscuit Krueger',
      'Nasubi Hui Guo Rou',
      'Benjamin Hui Guo Rou',
      'Camilla Hui Guo Rou',
      'Salé-salé Hui Guo Rou',
      'Sevanti Hui Guo Rou',
    ]),
    appearances: freeze([
      'Kacho Hui Guo Rou',
      'Fugetsu Hui Guo Rou',
      'Melody',
      'Keeney',
      'Marayam Hui Guo Rou',
      'Vergei',
      'Biscuit Krueger',
      'Nasubi Hui Guo Rou',
    ]),
    relationships: succession383RelationshipRecords,
    bodyStates: succession383BodyStates,
    mysteries: succession383Mysteries,
    abilities: freeze([
      succession383MelodyPerformanceResearch,
      succession383MagicalWormResearch,
      succession383WithoutYouResearch,
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Sunday banquet hall',
      'Black Whale · Tier 1 · Room 1013 isolated Nen space',
      'Black Whale · Tier 1 · banquet-to-lifeboat route',
      'Black Whale · lifeboat escape tunnel',
      'Outside Black Whale · drifting lifeboat',
      'Black Whale · twin bedroom',
    ]),
    objects: freeze(['banquet program', 'earbuds', 'Keeney handgun', 'lifeboat', 'Magical Worm doors/tunnel']),
    organizations: freeze(['Kakin royal family', 'Hunter Association', 'Marayam protection detail']),
    coverage: freeze({
      chronology: true,
      appearances: true,
      relationships: true,
      abilities: true,
      mysteries: true,
      locations: true,
      organizations: true,
      bodyStates: true,
      deaths: true,
      retrospectiveCodes: true,
      spatialRules: true,
    }),
    confidence: freeze([
      'Salé-salé’s illness is the banquet’s public explanation; his actual death remains established by Chapter 382.',
      'Melody’s three-minute entrancement, scenic sensory experience, and loudspeaker transmission are directly demonstrated.',
      'Keeney’s suicide and stated personal/operational motives are explicit in the supplied synopsis.',
      'The hands attacking the lifeboat are directly observed, while the complete ritual-enforcement mechanism remains unresolved.',
      'Kacho’s human body is dead on the lifeboat; the Kacho who returns to Fugetsu is Without You.',
      'Without You’s protective form does not by itself prove survival of Kacho’s human consciousness.',
      'Magical Worm and Without You are explicitly revealed as cooperative Guardian Spirit Beast abilities.',
      'The Hunter Code decode belongs to Chapter 383 as a retrospective explanation of Chapter 381.',
      'The Room 1013 servant re-entry restriction is confirmed for the servants who leave, but complete spatial rules remain open.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession383SourcePolicy,
  }),
]);

export const succession383ChapterFocus = freeze({ 383: focus });
