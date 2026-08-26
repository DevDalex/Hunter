const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_368';

export const succession368SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 368 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1 · after Chapter 367',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 368,
  confidence,
  source,
});

export const succession368TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-368-oito-covert-survey',
    title: 'Oito continues Little Eye reconnaissance while shielding her notes from Babimyna',
    detail: 'Oito clandestinely pilots the Little Eye-controlled cockroach through the royal residential area and records reconnaissance information in a way intended to prevent Babimyna from reading it through his En-based surveillance pressure.',
    location: 'Black Whale · Tier 1 · royal residential area / Room 1014 reconnaissance',
    tracks: ['oito', 'little-eye', 'babimyna', 'en', 'reconnaissance', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-emperor-time-near-three-hours',
    title: 'Kurapika recognizes the danger of nearly three continuous hours of Emperor Time',
    detail: 'Emperor Time has remained active for almost three hours. The supplied notes place Sayird’s Little Eye theft less than two hours earlier and Oito’s activation of Little Eye more than one hour earlier. At the established cost of one hour of lifespan per second, the chapter notes approximate Kurapika’s loss at about 450 days.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'emperor-time', 'lifespan-cost', 'little-eye'],
    confidence: 'The near-three-hour duration and approximately 450-day loss are supplied chapter-note figures; the wording is preserved as approximate',
  }),
  timelineEvent({
    id: 'voyage-day1-368-oito-witnesses-momoze-attack',
    title: 'Oito witnesses Momoze being suffocated through Little Eye',
    detail: 'While surveying Momoze’s room, Oito sees an unidentified bodyguard figure suffocating the twelfth prince. She immediately warns Kurapika about the attack.',
    location: 'Black Whale · Tier 1 · Room 1012 / viewed through Little Eye',
    tracks: ['oito', 'momoze', 'little-eye', 'assassination'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-room1014-rescue-call',
    title: 'Kurapika sends Bill and Babimyna to contact Momoze’s operator',
    detail: 'After Oito reports the attack, Kurapika has Bill and Babimyna contact Momoze’s room operator in an attempt to intervene. The warning comes too late.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'bill', 'babimyna', 'momoze', 'rescue-attempt'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-momoze-death',
    title: 'Momoze dies from asphyxiation',
    detail: 'Momoze is confirmed dead after being strangled or suffocated by an unidentified attacker. The supplied chapter notes identify the cause as strangulation; the killer is not identified in Chapter 368.',
    location: 'Black Whale · Tier 1 · Room 1012',
    tracks: ['momoze', 'death', 'assassination', 'succession-contest'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-six-guards-detained',
    title: 'Momoze’s six royal guards are detained for court-martial proceedings',
    detail: 'Vict, Nipaper, Bladge, Laroc, Tuffdy, and Nagmum are detained after the murder. Sevanti advocates their execution because she believes they were complicit. Their detention is confirmed; Chapter 368 does not establish collective guilt.',
    location: 'Black Whale · Tier 1 · Momoze household / Royal Army custody',
    tracks: ['momoze', 'sevanti', 'vict', 'nipaper', 'bladge', 'laroc', 'tuffdy', 'nagmum', 'custody'],
    confidence: 'Detention and intended court-martial are confirmed; Sevanti’s belief that all six are complicit is her accusation, not established guilt',
  }),
  timelineEvent({
    id: 'voyage-day1-368-gsb-fatigue-explanation',
    title: 'Kurapika links Momoze’s vulnerability to Guardian Spirit Beast aura consumption',
    detail: 'When Sakata asks why Momoze’s Guardian Spirit Beast failed to protect her, Kurapika reasons that Momoze retiring early suggests fatigue and that her beast may have consumed a large amount of her aura for some other activity, leaving her vulnerable when the killer struck.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'sakata', 'momoze', 'guardian-spirit-beast', 'aura', 'fatigue'],
    confidence: 'This mechanism is Kurapika’s explanation and inference from Momoze’s fatigue, not omniscient confirmation of the beast’s exact prior activity',
  }),
  timelineEvent({
    id: 'voyage-day1-368-oito-humanity',
    title: 'Oito rejects pure survival logic after trying to save Momoze',
    detail: 'Babimyna challenges Oito for exposing the reconnaissance operation to warn another prince. Oito answers that even in a survival contest she still has the humanity to care about another person’s daughter.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['oito', 'babimyna', 'momoze', 'ethics', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-babimyna-retracts-en',
    title: 'Babimyna leaves Room 1014 and retracts his En',
    detail: 'After confronting Oito about the rescue warning, Babimyna exits the room and stops covering Woble’s quarters with En, temporarily reducing the immediate surveillance pressure on Oito’s Little Eye operation.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['babimyna', 'en', 'oito', 'room-1014', 'surveillance'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-oito-resumes-recon',
    title: 'Oito resumes Little Eye reconnaissance after Babimyna withdraws',
    detail: 'With Babimyna no longer maintaining En inside Room 1014, Oito returns to the reconnaissance operation.',
    location: 'Black Whale · Tier 1 · Room 1014 / air-vent reconnaissance',
    tracks: ['oito', 'little-eye', 'reconnaissance'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-training-responses',
    title: 'Ten other prince camps agree to send guards for Kurapika’s Nen lessons',
    detail: 'Bill reports that Room 1014 will receive representatives from ten other princes. The supplied notes state that all eligible living rival camps agree to send guards except Tyson and Camilla; Momoze is dead and Woble is the host prince. Kurapika expects many of the incoming guards to monitor him and Bill as well as learn Nen.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'bill', 'nen-training', 'all-princes', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-training-scheduled',
    title: 'The first Nen class is scheduled for 9 a.m. the next day',
    detail: 'The Hunters agree to Kurapika’s two-week basic-training timetable. Kurapika schedules the lessons to begin the following day at 9 a.m. and limits participation to two people per prince camp.',
    location: 'Black Whale · Tier 1 · Room 1014 planning',
    tracks: ['kurapika', 'hunters', 'nen-training', 'schedule'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-kurapika-collapse',
    title: 'Kurapika blacks out from accumulated Emperor Time fatigue',
    detail: 'After nearly three hours of Emperor Time and the prolonged Little Eye operation, Kurapika suddenly loses consciousness. The supplied notes attribute the blackout to accumulated fatigue caused by Emperor Time.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'emperor-time', 'fatigue', 'blackout'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-hanzo-grief',
    title: 'Hanzo blames himself for failing to protect Momoze',
    detail: 'Hanzo mourns Momoze and laments his failure to protect her. Biscuit attempts to comfort him.',
    location: 'Black Whale · Tier 1 · Marayam / Momoze guard area',
    tracks: ['hanzo', 'biscuit', 'momoze', 'grief'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-hanzo-clone-theory',
    title: 'Hanzo develops a clone-based murder theory',
    detail: 'Hanzo deduces that the killer may have used a clone to murder Momoze while the guards were outside. He reasons that detaining all six guards could help clear them if another murder occurs while they remain in custody; Biscuit extends the theory by suggesting the controlling user would have needed to be an off-duty guard concentrating on the clone.',
    location: 'Black Whale · Tier 1 · Momoze investigation',
    tracks: ['hanzo', 'biscuit', 'momoze', 'clone-theory', 'investigation'],
    confidence: 'The clone explanation and off-duty-guard conclusion are Hanzo and Biscuit’s deductions, not confirmed murder mechanics in Chapter 368',
  }),
  timelineEvent({
    id: 'voyage-day1-368-hanzo-vow',
    title: 'Hanzo vows to catch Momoze’s killer',
    detail: 'Hanzo resolves to avenge Momoze and personally identify the person responsible for her death.',
    location: 'Black Whale · Tier 1 · Momoze investigation',
    tracks: ['hanzo', 'momoze', 'investigation', 'revenge'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-tserriednich-two-week-question',
    title: 'Tserriednich confronts Theta with Kurapika’s two-week Nen timetable',
    detail: 'Tserriednich tells Theta that he heard a message relayed through Zhang Lei stating that Nen basics can be taught in two weeks. He demands the truth about how quickly Nen can be learned and threatens Theta over any deception.',
    location: 'Black Whale · Tier 1 · Room 1004 / Tserriednich quarters',
    tracks: ['tserriednich', 'theta', 'zhang-lei', 'kurapika', 'nen-training'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-theta-defends-training',
    title: 'Theta admits accelerated Nen training is possible but calls it dangerous',
    detail: 'Theta tells Tserriednich that learning on the accelerated timetable is possible but hazardous and insists her slower method is the safest and best approach for him.',
    location: 'Black Whale · Tier 1 · Room 1004 / Tserriednich quarters',
    tracks: ['theta', 'tserriednich', 'nen-training', 'containment'],
  }),
  timelineEvent({
    id: 'voyage-day1-368-tserriednich-beast-threat',
    title: 'Tserriednich’s Guardian Spirit Beast closes in on Theta as she promises honesty',
    detail: 'As Theta assures Tserriednich that she is telling the truth, his Guardian Spirit Beast moves threateningly close to her. Blood then spatters onto the ground, but the supplied Chapter 368 text does not yet explain the exact mechanism or complete consequence.',
    location: 'Black Whale · Tier 1 · Room 1004 / Tserriednich quarters',
    tracks: ['tserriednich', 'theta', 'guardian-spirit-beast', 'threat'],
  }),
]);

export const succession368EmperorTimeExposure = freeze({
  user: 'Kurapika',
  duration: 'Almost three hours continuously active',
  chapterNoteTiming: freeze([
    'Less than two hours since Little Eye was stolen from Sayird',
    'More than one hour since Oito activated Little Eye',
  ]),
  establishedCostRate: 'One hour of lifespan per one second of Emperor Time',
  suppliedApproximateLoss: 'Approximately 450 days, stated in the supplied notes as about 1 year, 2 months, and 25 days',
  immediatePhysicalConsequence: 'Kurapika blacks out from accumulated fatigue',
  confidence: 'Duration and lifespan loss are preserved as the supplied chapter-note approximation; the blackout cause is explicitly attributed to Emperor Time fatigue in those notes.',
  source,
});

export const succession368MomozeMurder = freeze({
  victim: 'Momoze Hui Guo Rou',
  state: 'deceased',
  cause: 'Asphyxiation / strangulation',
  witnessedThrough: 'Oito’s Little Eye reconnaissance',
  attacker: 'Unidentified figure/bodyguard in the supplied Chapter 368 text',
  immediateSuspectsInCustody: freeze(['Vict', 'Nipaper', 'Bladge', 'Laroc', 'Tuffdy', 'Nagmum']),
  custodyStatus: 'All six royal guards detained and set to be court-martialed',
  guiltStatus: 'Unresolved in Chapter 368',
  investigationTheory: 'Hanzo suspects a clone controlled by an off-duty guard; Biscuit supports the concentration/off-duty logic. This remains theory at the Chapter 368 boundary.',
  source,
});

export const succession368TrainingSchedule = freeze({
  instructorLead: 'Kurapika',
  start: 'Next day at 9:00 a.m.',
  durationPlan: 'Two weeks for basic Nen instruction',
  representationLimit: 'Two people per prince camp',
  incomingPrinceCamps: 10,
  declined: freeze(['Tyson Hui Guo Rou', 'Camilla Hui Guo Rou']),
  unavailableBecauseDeceased: 'Momoze Hui Guo Rou',
  hostCamp: 'Woble Hui Guo Rou / Room 1014',
  strategicConcern: 'Kurapika and Bill expect many attendees to function as observers of Room 1014 as well as students.',
  confidence: 'The 10-camp count follows the supplied synopsis and notes: ten other prince camps send guards; Tyson and Camilla decline, Momoze is dead, and Woble is the host.',
  source,
});

export const succession368CustodyRecords = freeze([
  freeze({ person: 'Vict', household: 'Momoze', state: 'detained / pending court-martial', guilt: 'unresolved', source }),
  freeze({ person: 'Nipaper', household: 'Momoze', state: 'detained / pending court-martial', guilt: 'unresolved', source }),
  freeze({ person: 'Bladge', household: 'Momoze', state: 'detained / pending court-martial', guilt: 'unresolved', source }),
  freeze({ person: 'Laroc', household: 'Momoze', state: 'detained / pending court-martial', guilt: 'unresolved', source }),
  freeze({ person: 'Tuffdy', household: 'Momoze', state: 'detained / pending court-martial', guilt: 'unresolved', source }),
  freeze({ person: 'Nagmum', household: 'Momoze', state: 'detained / pending court-martial', guilt: 'unresolved', source }),
]);

export const succession368BodyStates = freeze([
  freeze({
    character: 'Momoze Hui Guo Rou',
    state: 'deceased',
    detail: 'Killed by asphyxiation/strangulation by an unidentified attacker in her quarters. Oito witnesses the attack remotely through Little Eye, but intervention comes too late.',
    chapter: 368,
    source,
  }),
  freeze({
    character: 'Kurapika',
    state: 'unconscious / blackout',
    detail: 'Collapses after almost three hours of continuous Emperor Time; supplied chapter notes attribute the blackout to accumulated Emperor Time fatigue.',
    chapter: 368,
    source,
  }),
]);

export const succession368RelationshipRecords = freeze([
  freeze({
    from: 'Oito Hui Guo Rou',
    to: 'Momoze Hui Guo Rou',
    type: 'Emergency rescue warning across rival camps',
    note: 'Oito sacrifices some secrecy in the Little Eye operation to warn Room 1014 that Momoze is being attacked, explaining that she cannot abandon her humanity simply because the princes are trapped in a survival contest.',
    phase: 'Active contest and voyage',
    chapters: '368',
    state: 'rescue attempt failed / ethical commitment demonstrated',
    source,
  }),
  freeze({
    from: 'Hanzo',
    to: 'Momoze Hui Guo Rou',
    type: 'Failed protection transformed into personal murder investigation',
    note: 'Hanzo blames himself for Momoze’s death, develops a clone-based theory, and vows to identify and avenge the killer.',
    phase: 'Active contest and voyage',
    chapters: '368–current',
    state: 'active investigation',
    source,
  }),
  freeze({
    from: 'Tserriednich Hui Guo Rou',
    to: 'Theta',
    type: 'Nen-training distrust and coercive pressure',
    note: 'Tserriednich confronts Theta with the public two-week training claim, threatens her over deception, and forces her to defend her slower teaching method while his Guardian Spirit Beast closes in.',
    phase: 'Active contest and voyage',
    chapters: '362–368',
    state: 'containment relationship deteriorating',
    source,
  }),
]);

export const succession368Mysteries = freeze([
  freeze({
    question: 'Who strangled Momoze, and what Nen method was used to bypass her protection detail?',
    evidence: 'Oito witnesses an unidentified figure suffocating Momoze through Little Eye. All six royal guards are detained, while Hanzo theorizes that a clone controlled by an off-duty guard could explain how the murder occurred while the guards were outside.',
    status: 'open murder investigation',
    lastChapter: '368',
    source,
  }),
  freeze({
    question: 'What activity consumed enough of Momoze’s aura to leave her Guardian Spirit Beast unable to protect her?',
    evidence: 'Kurapika infers that Momoze’s unusual fatigue indicates her Guardian Spirit Beast had consumed significant aura for another activity, but Chapter 368 does not establish what that activity was or the exact exhaustion threshold.',
    status: 'open Guardian Spirit Beast mechanics',
    lastChapter: '368',
    source,
  }),
  freeze({
    question: 'What exactly happens when Tserriednich’s Guardian Spirit Beast reacts to Theta’s truthfulness?',
    evidence: 'The beast approaches Theta threateningly while she promises she is telling the truth, followed by blood spatter. The supplied Chapter 368 text does not yet define the beast’s complete trigger, effect, or injury mechanism.',
    status: 'developing',
    lastChapter: '368',
    source,
  }),
]);

const focus = 'Oito’s Little Eye reconnaissance accidentally witnesses Momoze’s murder, making the twelfth prince the first confirmed royal casualty of the active succession voyage; six guards are detained while Hanzo develops an unconfirmed clone theory; Kurapika’s nearly three-hour Emperor Time exposure costs roughly 450 days of lifespan and ends in a blackout; the open Nen class is scheduled for 9 a.m. the next day with ten other prince camps participating; and Tserriednich uses the public two-week timetable to intensify his pressure on Theta.';

export const succession368ChapterResearch = freeze([
  freeze({
    number: 368,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Little Eye reconnaissance',
      'Momoze assassination',
      'Guardian Spirit Beast exhaustion',
      'Emperor Time cost',
      'Nen class scheduling',
      'Royal-guard detention',
      'Hanzo investigation',
      'Tserriednich Nen training',
    ]),
    focus,
    events: succession368TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Oito Hui Guo Rou', 'Bill', 'Babimyna', 'Shimanu', 'Momoze Hui Guo Rou',
      'Sevanti Hui Guo Rou', 'Sakata', 'Hanzo', 'Biscuit Krueger', 'Tserriednich Hui Guo Rou',
      'Theta', 'Zhang Lei Hui Guo Rou', 'Tyson Hui Guo Rou', 'Camilla Hui Guo Rou',
      'Vict', 'Nipaper', 'Bladge', 'Laroc', 'Tuffdy', 'Nagmum',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Tier 1 · Room 1012 / Momoze quarters',
      'Black Whale · Tier 1 · Room 1004 / Tserriednich quarters',
      'Black Whale · Tier 1 · royal residential air-vent reconnaissance route',
    ]),
    threadLabels: freeze([
      'Little Eye', 'Momoze', 'Emperor Time', 'Nen class', 'Hanzo', 'Guardian Spirit Beasts',
      'Tserriednich', 'Theta', 'Babimyna', 'Royal Army custody',
    ]),
    emperorTimeExposure: succession368EmperorTimeExposure,
    momozeMurder: succession368MomozeMurder,
    trainingSchedule: succession368TrainingSchedule,
    custody: succession368CustodyRecords,
    relationships: succession368RelationshipRecords,
    bodyStates: succession368BodyStates,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 368 text',
      'Momoze’s death by asphyxiation/strangulation is confirmed, but the attacker remains unidentified at the Chapter 368 boundary',
      'The six detained royal guards are not treated as collectively guilty merely because Sevanti advocates execution',
      'Hanzo and Biscuit’s clone/off-duty-user explanation remains theory',
      'Kurapika’s explanation for Momoze’s vulnerability is stored as his inference about Guardian Spirit Beast aura consumption',
      'The approximate 450-day Emperor Time loss is preserved from the supplied chapter notes rather than recalculated into false precision',
      'The training response is stored as ten other prince camps participating; Tyson and Camilla decline, Momoze is deceased, and Woble is the host camp',
    ]),
    status: 'Maintained chapter summary, chronology, first prince death, Little Eye reconnaissance, Emperor Time exposure and blackout, Nen-class schedule, custody state, Hanzo murder theory, Tserriednich training pressure, relationships, mysteries, and source confidence linked',
    coverage: freeze({
      identity: true,
      publication: false,
      summary: true,
      sceneSummary: true,
      chronology: true,
      appearances: true,
      locations: true,
      relationships: true,
      assignments: true,
      nen: true,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'not-supplied-no-title-invented',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession368ChapterFocus = freeze({ 368: focus });
