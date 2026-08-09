const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_382';

export const succession382SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 382 synopsis',
  titleMetadata: 'The supplied material does not include an English, Japanese, or romanized chapter title. No title is invented.',
  chronologyNote: 'The chapter explicitly reaches 8:00 p.m. on Voyage Day 8 at the opening of the Sunday banquet. Earlier Chapter 382 scenes precede that timestamp; their exact clock times are not supplied.',
  claimBoundary: 'Nasubi says he cannot die until the ritual ends and tells Halkenburg that three shots would be required if he truly intended to kill him. These statements are preserved as Nasubi claims rather than promoted into independently verified universal ritual rules.',
  abilityBoundary: 'The supplied synopsis names Shikaku’s Culdcept but does not give an official name for Halkenburg’s bow-and-arrow attack or identify the specific Nen ability Yushohi uses to assassinate Salé-salé.',
  excluded: freeze(['Outside story claims', 'Unsupplied later mechanics', 'A claim that Stinger Ball killed Salé-salé', 'A claim that Nasubi personally stopped the incoming bullet', 'A universal immortality rule inferred solely from Nasubi’s dialogue']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1', time = 'Voyage Day 8 · before 8:00 p.m.', confidence = 'confirmed' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 382,
  confidence,
  source,
});

export const succession382TimelineEvents = freeze([
  event({ id: '382-halkenburg-approach-king', title: 'Halkenburg approaches Nasubi with five guards', detail: 'Halkenburg and five of his guards approach the King’s chambers after several days of repeated visits that had accustomed the entrance soldiers to his presence.', tracks: ['halkenburg', 'nasubi', 'royal-protocol'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-halkenburg-hostage-turn', title: 'Halkenburg’s group draws weapons on the entrance soldiers', detail: 'Instead of delivering another routine letter, Halkenburg and his five guards draw their weapons and hold the soldiers at gunpoint. Halkenburg says it took four days to make them lower their guard.', tracks: ['halkenburg', 'guards', 'armed-confrontation'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-halkenburg-demands-suspension', title: 'Halkenburg demands that Nasubi suspend the Succession Contest', detail: 'Halkenburg confronts Nasubi at gunpoint, arguing that although he consented to the Seed Urn ritual he was never told the princes would have to kill one another.', tracks: ['halkenburg', 'nasubi', 'succession-ritual'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-nasubi-adaptation-reply', title: 'Nasubi tells Halkenburg the contest can no longer simply be stopped', detail: 'Nasubi stresses adaptation, says the situation is now beyond his unilateral control, tells Halkenburg to act for himself, and condemns hypocrisy.', tracks: ['nasubi', 'halkenburg', 'succession-ritual', 'ideology'], location: 'Black Whale · Tier 1 · King’s chambers', confidence: 'Nasubi’s stated position and interpretation of the ritual.' }),
  event({ id: '382-halkenburg-shoots-nasubi', title: 'Halkenburg fires at Nasubi and the bullet stops short', detail: 'Halkenburg fires one shot toward Nasubi. The bullet appears to stop in midair inches from the King’s face.', tracks: ['halkenburg', 'nasubi', 'ritual-defense'], location: 'Black Whale · Tier 1 · King’s chambers', confidence: 'The stopping of the bullet is observed; the exact mechanism responsible is not identified in the supplied synopsis.' }),
  event({ id: '382-nasubi-ritual-survival-claim', title: 'Nasubi claims he cannot die until the ritual ends', detail: 'Nasubi tells Halkenburg that three shots would be necessary if he truly meant to kill him and says that, because he is now part of the ritual, he cannot die until it ends.', tracks: ['nasubi', 'halkenburg', 'succession-ritual'], location: 'Black Whale · Tier 1 · King’s chambers', confidence: 'Nasubi’s claim; the chapter does not independently demonstrate the full rule or its limits.' }),
  event({ id: '382-nugui-expected-parameters', title: 'Nugui says the armed confrontation falls within expected parameters', detail: 'Nugui appears and tells Halkenburg that neither he nor his guards will be punished because their conduct was within expected parameters.', tracks: ['nugui', 'halkenburg', 'royal-protocol'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-halkenburg-suicide-attempt', title: 'Halkenburg turns the gun on himself', detail: 'Halkenburg attempts to shoot himself in the head after learning that the confrontation will not stop the contest.', tracks: ['halkenburg', 'guardian-spirit-beast', 'self-directed-gunshot'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-halkenburg-gsb-stops-bullet', title: 'Halkenburg’s Guardian Spirit Beast intercepts the self-fired bullet', detail: 'The Guardian Spirit Beast resting on Halkenburg’s shoulders holds the bullet inches from his head, preventing the suicide attempt from succeeding.', tracks: ['halkenburg', 'guardian-spirit-beast', 'defense'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-nasubi-trolley-problem', title: 'Nasubi reframes Halkenburg’s dilemma through the prisoner trolley problem', detail: 'Nasubi challenges Halkenburg with the trolley problem. When Halkenburg interprets it as a choice between Kakin and his siblings, Nasubi rebukes him and insists that the country and its people come first, while emphasizing responsibility for who pulls the lever.', tracks: ['nasubi', 'halkenburg', 'kakin', 'ideology'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-nasubi-kingship-challenge', title: 'Nasubi tells Halkenburg to become king before rejecting kingship', detail: 'Nasubi argues that Halkenburg cannot change Kakin without first becoming king and tells him to declare that a king is unnecessary only after he has become one.', tracks: ['nasubi', 'halkenburg', 'succession', 'politics'], location: 'Black Whale · Tier 1 · King’s chambers' }),
  event({ id: '382-shikaku-wakes', title: 'Shikaku wakes and realizes he lost time while Halkenburg was away', detail: 'Back in Halkenburg’s quarters, Shikaku wakes to Benjamin’s radio call, realizes he had been asleep while Halkenburg was absent, and suspects that Halkenburg’s Guardian Spirit Beast affected him.', tracks: ['shikaku', 'benjamin', 'halkenburg', 'guardian-spirit-beast'], location: 'Black Whale · Tier 1 · Room 1009', confidence: 'Shikaku’s inference regarding the cause of his sleep.' }),
  event({ id: '382-benjamin-orders-halkenburg-killed', title: 'Benjamin orders Shikaku to kill Halkenburg and secure his ability', detail: 'Benjamin informs Shikaku that the King is safe but that Halkenburg has awakened to a more aggressive resolve, then orders Shikaku to kill him and take his ability.', tracks: ['benjamin', 'shikaku', 'halkenburg', 'assassination-order'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '382-shikaku-culdcept', title: 'Shikaku activates Culdcept', detail: 'As Halkenburg and his guards return, Shikaku activates Culdcept and forms a card-like shield to defend himself from the incoming attack.', tracks: ['shikaku', 'culdcept', 'nen'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '382-halkenburg-collective-armor', title: 'Halkenburg converts his followers’ collective aura into armor and ammunition', detail: 'The marked group’s aura becomes a defensive collective armor around Halkenburg while also forming the aura used as an arrow. Halkenburg’s own aura takes the shape of a bow.', tracks: ['halkenburg', 'guards', 'collective-aura', 'nen'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '382-halkenburg-arrow-fired', title: 'Halkenburg fires the collective aura arrow', detail: 'Halkenburg draws the aura bow and fires. The arrow pierces Shikaku’s Culdcept card shield with overwhelming force.', tracks: ['halkenburg', 'shikaku', 'collective-aura', 'culdcept'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '382-arrow-unblockable-rule', title: 'The chapter states that the arrow cannot be intercepted once the bow is drawn', detail: 'The supplied synopsis states that after the bow is drawn the arrow cannot be intercepted or blocked.', tracks: ['halkenburg', 'collective-arrow', 'nen-rule'], location: 'Black Whale · Tier 1 · Room 1009', confidence: 'Mechanic stated by the supplied synopsis; broader edge cases are not supplied.' }),
  event({ id: '382-shikaku-will-exchange', title: 'The arrow suppresses Shikaku’s will while one Halkenburg follower collapses', detail: 'When the attack lands, Shikaku loses his original will while one of Halkenburg’s men falls to the floor. The chapter explains that a successful arrow exchanges this effect for the body of one of Halkenburg’s followers.', tracks: ['halkenburg', 'shikaku', 'guards', 'consciousness-transfer'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '382-shikaku-rises-subordinate', title: 'Shikaku’s body rises and asks Halkenburg for orders', detail: 'Shikaku’s body stands and addresses Halkenburg as a subordinate while a spectral image of the fallen Halkenburg guard appears behind him and that guard’s original body remains on the floor.', tracks: ['shikaku', 'halkenburg', 'guards', 'body-state'], location: 'Black Whale · Tier 1 · Room 1009', confidence: 'The body-control/will-exchange outcome is explicit; the supplied synopsis does not fully define every consciousness-transfer rule.' }),
  event({ id: '382-kurapika-second-aura-rumbling', title: 'Kurapika senses a second large aura rumbling', detail: 'Kurapika feels another large surge or rumbling of aura and notes that this is the second such occurrence. He decides to track the time and location of future occurrences while treating the new phenomenon as an emerging threat.', tracks: ['kurapika', 'aura', 'investigation'], location: 'Black Whale · Tier 1 · Room 1014', confidence: 'Kurapika detects the rumbling; the exact source is not explicitly identified to him in the supplied synopsis.' }),
  event({ id: '382-kurapika-endurance-mindset', title: 'Kurapika consciously reins in his own stress', detail: 'Although relieved that the Room 1014 assassin has not struck recently, Kurapika recognizes the danger of the new aura phenomenon and reminds himself that losing composure is itself a threat in a prolonged contest.', tracks: ['kurapika', 'room-1014', 'strategy'], location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '382-sale-sale-assassination', title: 'Salé-salé is found unresponsive and Yushohi reports a successful assassination', detail: 'Salé-salé lies in bed without apparent breathing while attendants attempt CPR and call for help. Yushohi watches and reports to Benjamin that the assassination was successful.', tracks: ['sale-sale', 'yushohi', 'benjamin', 'assassination'], location: 'Black Whale · Tier 1 · Room 1008', confidence: 'The scene and Yushohi’s report establish the assassination as successful; the specific ability or method used is not named in the supplied synopsis.' }),
  event({ id: '382-sunday-banquet-opening', title: 'The Sunday banquet reaches its 8:00 p.m. opening', detail: 'At 8:00 p.m. on Voyage Day 8, Kacho, Fugetsu, and Melody stand nervously in the large banquet hall immediately before the Sunday banquet begins.', tracks: ['kacho', 'fugetsu', 'melody', 'sunday-banquet'], location: 'Black Whale · Tier 1 · Sunday banquet hall', time: 'Voyage Day 8 · 8:00 p.m.' }),
]);

export const succession382HalkenburgNasubiResearch = freeze({
  participants: freeze(['Halkenburg Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Nugui', 'five unnamed Halkenburg guards']),
  setup: 'Halkenburg exploits four days of repeated visits to lower the entrance soldiers’ guard, then enters the King’s chambers with five armed followers.',
  halkenburgDemand: 'Suspend the Succession Contest; Halkenburg argues he consented to the ritual without being told the princes would kill one another.',
  nasubiPosition: 'Nasubi says the contest is no longer something he can simply suspend and tells Halkenburg that changing Kakin requires acting from the position of king.',
  incomingShot: 'Halkenburg fires once at Nasubi; the bullet stops inches from the King. The responsible mechanism is not identified in the supplied synopsis.',
  nasubiClaim: 'Nasubi says he is part of the ritual and cannot die until it ends, and tells Halkenburg three shots would be necessary if he truly intended to kill him.',
  selfShot: 'Halkenburg then shoots at his own head, but his Guardian Spirit Beast visibly stops the bullet.',
  ruleBoundary: 'Only the Guardian Spirit Beast interception of Halkenburg’s self-shot is directly attributed. Nasubi’s broader ritual-survival statement remains a character claim at this chapter boundary.',
  source,
});

export const succession382HalkenburgArrowResearch = freeze({
  user: 'Halkenburg Hui Guo Rou',
  officialName: null,
  archiveLabel: 'Halkenburg collective possession arrow',
  collectiveArmor: 'Aura from Halkenburg’s followers functions as a powerful protective armor around him.',
  projectileFormation: 'The followers’ aura also becomes the arrow while Halkenburg’s own aura forms the bow.',
  demonstratedDefenseInteraction: 'The arrow pierces Shikaku’s Culdcept card shield.',
  statedInterceptionRule: 'Once the bow is drawn, the arrow cannot be intercepted or blocked according to the supplied synopsis.',
  successfulHitEffect: 'A successful hit robs the target host of its original will while requiring the body of one of Halkenburg’s followers in exchange.',
  observedExchange: 'One Halkenburg follower collapses; Shikaku’s body then rises and asks Halkenburg for orders while a spectral image of the fallen follower appears behind Shikaku.',
  classificationBoundary: 'The chapter does not supply an official ability name or complete Nen-type classification for the bow-and-arrow attack itself.',
  source,
});

export const succession382CuldceptResearch = freeze({
  user: 'Shikaku',
  ability: 'Culdcept',
  observedForm: 'A card-like construct used as a defensive shield.',
  observedUse: 'Shikaku creates the card to defend himself against Halkenburg’s collective aura arrow.',
  result: 'Halkenburg’s arrow pierces the shield.',
  mechanicsBoundary: 'The supplied synopsis does not provide Culdcept’s Nen category, broader card functions, costs, range, or other applications.',
  source,
});

export const succession382SaleSaleAssassinationResearch = freeze({
  prince: 'Salé-salé Hui Guo Rou',
  attacker: 'Yushohi',
  scene: 'Salé-salé is shown unresponsive and apparently not breathing while attendants attempt CPR.',
  confirmation: 'Yushohi reports to Benjamin that the assassination was successful.',
  contestState: 'Salé-salé becomes the second prince death established in the maintained chapter chronology after Momoze.',
  methodBoundary: 'The supplied Chapter 382 synopsis does not identify the ability or exact mechanism Yushohi used. Stinger Ball is therefore not assigned as the murder method.',
  source,
});

export const succession382BanquetResearch = freeze({
  time: 'Voyage Day 8 · 8:00 p.m.',
  event: 'Sunday banquet opening',
  visibleParticipants: freeze(['Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Melody']),
  immediateState: 'Kacho, Fugetsu, and Melody appear nervous immediately before the banquet begins.',
  continuity: 'The banquet is the event toward which the twins and Melody had been preparing their music/escape operation.',
  executionBoundary: 'Chapter 382 reaches the opening but does not yet show the escape operation being executed.',
  source,
});

export const succession382BodyStates = freeze([
  freeze({ character: 'Salé-salé Hui Guo Rou', state: 'deceased', bodyState: 'unresponsive / not breathing; CPR attempted', consciousness: 'absent in the assassination scene', cause: 'successful assassination reported by Yushohi; exact method unnamed', chapter: 382, source }),
  freeze({ character: 'Shikaku', state: 'body remains active under altered will', bodyState: 'standing and responsive after being struck', consciousness: 'original will is stated to be robbed/suppressed; a Halkenburg follower is exchanged into the operation', cause: 'Halkenburg collective aura arrow', chapter: 382, source }),
  freeze({ character: 'Unnamed Halkenburg follower', state: 'body collapsed', bodyState: 'lying on the floor after the successful arrow hit', consciousness: 'exchange with the struck host is indicated, but the synopsis does not fully formalize the consciousness topology', cause: 'cost/exchange attached to Halkenburg’s arrow', chapter: 382, source }),
]);

export const succession382RelationshipRecords = freeze([
  freeze({ from: 'Halkenburg Hui Guo Rou', to: 'Nasubi Hui Guo Rou', type: 'Armed ideological confrontation', note: 'Halkenburg escalates from repeated petitions to an armed demand that Nasubi suspend the contest; Nasubi instead pushes him toward winning the throne and changing Kakin from the top.', phase: 'Active contest and voyage', chapters: '382', state: 'direct confrontation / ideological rupture', source }),
  freeze({ from: 'Benjamin Hui Guo Rou', to: 'Shikaku', type: 'Assassination command', note: 'Benjamin orders Shikaku to kill Halkenburg and secure his ability after learning that Halkenburg has returned with a more aggressive resolve.', phase: 'Active contest and voyage', chapters: '382', state: 'command issued / operation fails', source }),
  freeze({ from: 'Halkenburg Hui Guo Rou', to: 'Shikaku', type: 'Hostile Nen body-will operation', note: 'Halkenburg’s collective arrow defeats Culdcept, suppresses Shikaku’s original will, and leaves Shikaku’s body acting under Halkenburg’s side.', phase: 'Active contest and voyage', chapters: '382', state: 'first successful collective-arrow takeover', source }),
  freeze({ from: 'Yushohi', to: 'Benjamin Hui Guo Rou', type: 'Assassination reporting', note: 'Yushohi reports directly to Benjamin that the assassination of Salé-salé has succeeded.', phase: 'Active contest and voyage', chapters: '382', state: 'mission reported successful', source }),
]);

export const succession382Mysteries = freeze([
  freeze({ question: 'What exactly stops Halkenburg’s bullet before it reaches Nasubi?', evidence: 'The bullet halts inches from Nasubi after Halkenburg fires. The supplied synopsis does not attribute the stop to Nasubi, his Guardian Spirit Beast, or another explicit mechanism.', status: 'open / defensive mechanism unidentified', lastChapter: '382', source }),
  freeze({ question: 'How literal and universal is Nasubi’s claim that he cannot die until the succession ritual ends?', evidence: 'Nasubi states that he is part of the ritual and cannot die until it ends, but the chapter does not independently prove the full scope, exceptions, or enforcement mechanism.', status: 'open / Nasubi claim preserved', lastChapter: '382', source }),
  freeze({ question: 'What are the complete consciousness-transfer rules of Halkenburg’s collective arrow?', evidence: 'The hit robs Shikaku’s will, one follower collapses, and Shikaku’s body behaves as a Halkenburg subordinate while a spectral image of the fallen follower appears.', status: 'first successful exchange observed / full topology unresolved', lastChapter: '382', source }),
  freeze({ question: 'Which specific Halkenburg follower is exchanged in the Shikaku operation?', evidence: 'The synopsis identifies the exchanged participant only as one of Halkenburg’s men.', status: 'identity not supplied', lastChapter: '382', source }),
  freeze({ question: 'What ability or exact method does Yushohi use to assassinate Salé-salé?', evidence: 'Salé-salé is unresponsive and Yushohi reports success, but the supplied synopsis does not name the murder ability or mechanism.', status: 'assassination confirmed / method unresolved', lastChapter: '382', source }),
  freeze({ question: 'What causes the repeated large aura rumblings Kurapika is tracking?', evidence: 'Kurapika senses a second rumbling and decides to record future times and locations, but the source is not explicitly identified to him.', status: 'investigation opened', lastChapter: '382', source }),
]);

const focus = 'Halkenburg’s resistance to the Succession Contest crosses a decisive threshold: after confronting Nasubi at gunpoint and discovering that even his own suicide attempt is blocked by his Guardian Spirit Beast, he returns to Room 1009 and demonstrates an overwhelming collective bow-and-arrow Nen attack against Shikaku. The attack pierces Culdcept and produces the first observed body/will exchange of Halkenburg’s faction. Kurapika detects another massive aura rumbling, Yushohi reports Salé-salé’s assassination as successful, and the chapter reaches 8:00 p.m. on Voyage Day 8 with Kacho, Fugetsu, and Melody awaiting the Sunday banquet.';

export const succession382ChapterResearch = freeze([
  freeze({
    number: 382,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 8',
    voyageDayConfidence: 'The chapter explicitly reaches 8:00 p.m. on Voyage Day 8. Earlier scenes precede that timestamp but are not given exact clock times in the supplied synopsis.',
    lanes: freeze(['Halkenburg and Nasubi confrontation', 'Seed Urn ritual constraints', 'Halkenburg Guardian Spirit Beast defense', 'Halkenburg collective Nen attack', 'Shikaku / Culdcept', 'body and will exchange', 'Kurapika aura-rumbling investigation', 'Salé-salé assassination', 'Sunday banquet opening']),
    focus,
    events: succession382TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Halkenburg Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Nugui', 'Shikaku', 'Benjamin Hui Guo Rou', 'Kurapika', 'Salé-salé Hui Guo Rou', 'Yushohi', 'Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Melody']),
    appearances: freeze(['Halkenburg Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Nugui', 'Shikaku', 'Benjamin Hui Guo Rou', 'Kurapika', 'Salé-salé Hui Guo Rou', 'Yushohi', 'Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Melody']),
    relationships: succession382RelationshipRecords,
    bodyStates: succession382BodyStates,
    mysteries: succession382Mysteries,
    abilities: freeze([succession382HalkenburgArrowResearch, succession382CuldceptResearch]),
    locations: freeze(['Black Whale · Tier 1 · King’s chambers', 'Black Whale · Tier 1 · Room 1009', 'Black Whale · Tier 1 · Room 1014', 'Black Whale · Tier 1 · Room 1008', 'Black Whale · Tier 1 · Sunday banquet hall']),
    objects: freeze(['Halkenburg’s handgun', 'Culdcept card shield', 'collective aura bow and arrow']),
    organizations: freeze(['Kakin royal family', 'Benjamin private army']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, abilities: true, mysteries: true, locations: true, organizations: true, bodyStates: true, investigations: true }),
    confidence: freeze([
      'Nasubi’s ritual-survival statement is preserved as his claim rather than treated as independently verified universal law.',
      'The mechanism that stops Halkenburg’s bullet before Nasubi is not identified in the supplied synopsis.',
      'Halkenburg’s Guardian Spirit Beast directly stops the self-fired bullet aimed at Halkenburg’s own head.',
      'Culdcept is named, but its Nen category and broader mechanics are not supplied.',
      'Halkenburg’s collective bow-and-arrow attack is mechanically demonstrated but no official ability name is supplied.',
      'The arrow’s successful body/will exchange is explicit, while complete consciousness-transfer topology remains unresolved.',
      'Yushohi’s assassination of Salé-salé is confirmed by the scene and his report, but the specific ability/method is not supplied and is not equated with Stinger Ball.',
      'The chapter explicitly reaches Voyage Day 8 at 8:00 p.m. for the Sunday banquet opening.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession382SourcePolicy,
  }),
]);

export const succession382ChapterFocus = freeze({ 382: focus });
