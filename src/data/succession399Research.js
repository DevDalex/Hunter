const freeze = (value) => Object.freeze(value);
const source399 = 'https://hunterxhunter.fandom.com/wiki/Chapter_399';
const presentTime = 'Voyage Day 10 · Tier 3 Heil-Ly hideout confrontation / Room 3101 return · exact clock time unsupplied';

export const succession399SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'User-supplied Hunterpedia Chapter 399 synopsis text',
  chapterUrl: source399,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 399 directly continues the Chapter 398 present-day Tier 3 Heil-Ly hideout infiltration on Voyage Day 10. The supplied synopsis gives no exact clock time, so none is invented.',
  laundryBoundary: 'Nobunaga and Hinrigh offer competing explanations for the recently vacated laundry area and neighboring civilians. Complicity, restraint, evacuation rules, and oblivious-neighbor alarms remain hypotheses rather than established history.',
  terebellumBoundary: 'Damage: "Sweet Home" and Terebellum’s Emitter classification are explicitly revealed. The archive preserves the right-hand intake, left-hand transfer, moment-of-damage contact condition, and demonstrated attacking-object displacement without inventing additional range, capacity, healing, or delayed-transfer rules.',
  yokotaniBoundary: 'A Battle of Wits: "LSDF" and its Conjuration classification are explicitly revealed. It is usable only at the hideout where Morena is located, activates after Yokotani identifies himself to a law-breaking intruder, and creates defensive guards whose level scales with crime severity. The archive does not infer that every part of the hideout is LSDF-created or that Yokotani’s guards themselves own the pre-existing teleport route.',
  routeBoundary: 'Nobunaga and Hinrigh both return from the hideout to Room 3101, establishing the hideout-to-Room-3101 exit result alongside Chapter 398’s Room-3101-side entry-to-hideout result. Nobunaga’s further claim that there must be a member-only jump point remains a deduction, not a demonstrated route.',
  morenaBoundary: 'LSDF is stated to function only at the hideout where Morena is located, so Morena’s presence somewhere within this Heil-Ly hideout/complex is now supported. Her exact room, personal role in the teleport trap, and personal role in the self-restoring stage remain unresolved.',
  biohazardBoundary: 'Hinrigh hides the transmitter while it is still an oyster and later says he cannot use his ability again that day. This is preserved as his Chapter 399 rest-of-day operational limit, not converted into a universal fixed daily-use count, reset equation, or exact aura-cost formula.',
  kikanBoundary: 'Perigord is explicitly reminded that he has already been selected as the “organ” (kikan) and was told by Morena to keep his head down. The exact operational meaning of that role remains unresolved at this boundary.',
  excluded: freeze([
    'Treating Nobunaga’s neighbor-complicity theory or Hinrigh’s civilian-restraint / evacuation-rule alternatives as confirmed history',
    'Inventing identities for the three unnamed members among the nine Heil-Ly members visible in the gathering room',
    'Giving Perigord a revealed personal ability merely because he considers using it',
    'Treating Orarge blocking a knife with Weekly Shonen Jump as a new Nen ability',
    'Generalizing Sweet Home beyond its explicit right-hand intake / left-hand transfer / moment-of-damage contact rules',
    'Claiming LSDF guards can directly injure criminals when the supplied explanation says they cannot harm them',
    'Claiming the existing Room 3101 teleport is intrinsically part of LSDF rather than a route used during expulsion',
    'Treating Nobunaga’s proposed Heil-Ly-member-only jump point as demonstrated',
    'Turning Hinrigh’s rest-of-day inability to use Biohazard into a universal daily activation count or exact reset rule',
    'Locating Morena in a specific room within the hideout or assigning her ownership of the teleport/restoration mechanisms',
    'Resolving the meaning of “organ” (kikan) beyond the role label supplied in this chapter',
    'Importing Chapter 400+ outcomes, identities, mechanics, or later reinterpretations',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Black Whale · Tier 3', confidence = 'Confirmed in the user-supplied Hunterpedia Chapter 399 synopsis' }) => freeze({
  id,
  day: 10,
  time: presentTime,
  chronology: presentTime,
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 399,
  confidence,
  source: source399,
});

export const succession399TimelineEvents = freeze([
  timelineEvent({
    id: '399-laundry-room-complicity-evacuation-theories',
    label: 'Nobunaga and Hinrigh debate why the laundry area was vacated',
    detail: 'Nobunaga realizes that if Heil-Ly expected wall breaches, neighboring rooms may have been cooperating and may have warned the hideout after the Troupe used them to test traps. Hinrigh offers alternatives: civilians could have been restrained and removed, Heil-Ly may evacuate when a neighbor is teleported into the hideout, or oblivious neighbors may simply function as cheap alarms. None of these explanations is confirmed, and Hinrigh tells Nobunaga to stop chasing an answer they cannot obtain and focus on the doors.',
    people: ['Nobunaga Hazama', 'Hinrigh Biganduffno'],
    tracks: ['heil-ly', 'hideout', 'civilian-neighbors', 'hypothesis-boundary'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · laundry-filled room',
    confidence: 'Dialogue-confirmed competing hypotheses; actual civilian/neighborhood arrangement remains unresolved',
  }),
  timelineEvent({
    id: '399-main-door-reveals-nine-heilly-members',
    label: 'The main door opens onto nine relaxed Heil-Ly members',
    detail: 'Hinrigh opens the unlocked main door with his knife while Nobunaga prepares for danger. They find nine Heil-Ly members seated and talking. Gelato, Soufflé, and Terebellum are specifically shown conversing; Hinrigh loudly asks them to confirm that this is the Heil-Ly hideout and that they are members. Soufflé and Terebellum continue talking after briefly pretending to be frightened. The synopsis does not identify all nine people by name.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama', 'Gelato', 'Soufflé', 'Terebellum'],
    tracks: ['heil-ly', 'hideout', 'direct-contact', 'main-room'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · gathering/defense room',
  }),
  timelineEvent({
    id: '399-terebellum-first-knife-damage-transfer',
    label: 'Terebellum survives Hinrigh’s head strike by displacing the knife damage',
    detail: 'Hinrigh throws a knife into Terebellum’s head. Terebellum calmly pulls it out and crushes the handle while the blade tip is found embedded in the drink can he was holding. Hinrigh recognizes that the ability involves transferring matter/damage, while Nobunaga treats Terebellum as a difficult matchup because the exact conditions are not yet narrowed down at that instant.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama', 'Terebellum', 'Soufflé'],
    tracks: ['heil-ly', 'tere-bellum', 'sweet-home', 'nen-reveal'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · gathering/defense room',
  }),
  timelineEvent({
    id: '399-second-knife-orarge-perigord-organ',
    label: 'Orarge blocks the second knife and Perigord is reminded of his “organ” assignment',
    detail: 'After Soufflé touches Terebellum’s left arm and is warned not to interfere, Hinrigh throws a second knife. Terebellum dodges and moves Soufflé aside; Perigord prepares to accept the injury while wondering how long it would take to heal, but Orarge blocks the knife with an issue of Weekly Shōnen Jump. Orarge reminds Perigord that he has already been chosen as the “organ” (kikan) and that Morena told him to keep his head down. Soufflé leaves after reiterating that they were told not to fight there. No Perigord ability is demonstrated and the meaning of “organ” remains unresolved.',
    people: ['Hinrigh Biganduffno', 'Terebellum', 'Soufflé', 'Perigord', 'Orarge', 'Morena Prudo'],
    tracks: ['heil-ly', 'organ-role', 'morena-orders', 'ability-boundary'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · gathering/defense room',
  }),
  timelineEvent({
    id: '399-terebellum-protects-yokotani-sweet-home-revealed',
    label: 'Terebellum protects Yokotani and Damage: “Sweet Home” is fully explained',
    detail: 'Yokotani identifies himself as Heil-Ly’s lawyer and recognizes Nobunaga as Phantom Troupe. Nobunaga extends his chained katana and stabs Yokotani in the head, but Terebellum has his right hand on Yokotani’s shoulder. The katana tip disappears and blood appears on Terebellum’s left arm. The chapter then identifies Terebellum as an Emitter and reveals Damage: “Sweet Home”: damage to something Terebellum is touching with his right hand at the moment of impact is taken into Terebellum, and he can transfer it to something touched with his left hand; attacking material can be displaced with the damage. If he does not transfer received damage onward, he bears it himself.',
    people: ['Nobunaga Hazama', 'Terebellum', 'Yokotani', 'Hinrigh Biganduffno'],
    tracks: ['tere-bellum', 'sweet-home', 'emission', 'yokotani', 'nen-mechanics'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · gathering/defense room',
  }),
  timelineEvent({
    id: '399-yokotani-activates-lsdf-level4-guards',
    label: 'Yokotani activates A Battle of Wits: “LSDF” and conjures seven guards',
    detail: 'After identifying himself to the intruders and invoking their crimes, Yokotani activates the Conjuration ability A Battle of Wits: “LSDF”. The chapter explains that it can only be used at the hideout where Morena is located and activates when Yokotani identifies himself to an intruder who has broken the law. Its conjured guards cannot harm the criminal, while the criminal’s attacks are ineffective against them; more serious crimes allow higher-level guards. Seven guards appear, identify Hinrigh and Nobunaga as criminals, charge them with trespassing and attempted murder, and enter alert level 4.',
    people: ['Yokotani', 'Nobunaga Hazama', 'Hinrigh Biganduffno', 'Terebellum', 'Morena Prudo'],
    tracks: ['yokotani', 'lsdf', 'conjuration', 'hideout-defense', 'morena-location'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · gathering/defense room',
  }),
  timelineEvent({
    id: '399-lsdf-max-alert-restrains-expels-nobunaga',
    label: 'LSDF reaches maximum alert, restrains Nobunaga, and expels him',
    detail: 'Nobunaga attacks one of the conjured guards, which takes no damage and rises from alert level 4 to maximum alert as its aura increases. Nobunaga concludes that the guards are effectively invincible to them because the conditions are already met. The guards swarm and restrain him, confiscate his katana, and carry him out until he is teleported away. Nobunaga warns Hinrigh that the guards are on autopilot and will continue until they remove him too. Yokotani confirms Nobunaga’s expulsion. The chapter does not establish that LSDF itself owns the pre-existing teleport route used by the expulsion process.',
    people: ['Nobunaga Hazama', 'Yokotani', 'Hinrigh Biganduffno'],
    tracks: ['lsdf', 'hideout-defense', 'expulsion', 'autopilot', 'teleport-route'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · gathering/defense room',
    confidence: 'Guard behavior and expulsion confirmed; ownership relationship between LSDF and the existing spatial route remains unresolved',
  }),
  timelineEvent({
    id: '399-hinrigh-hides-oyster-transmitter',
    label: 'Hinrigh retreats to the laundry room and hides the still-transformed transmitter',
    detail: 'Hinrigh judges that the teleportation traps and highly defensive ability users make this the Heil-Ly main base. He retreats into the laundry room and shuts the door while the guards pound on it. Relying on the guards being automatic and on his belief that Yokotani cannot see through them, Hinrigh induces himself to vomit the transmitter-oyster and hides it under a cabinet. The transmitter remains in oyster form at this point.',
    people: ['Hinrigh Biganduffno', 'Yokotani'],
    tracks: ['hinrigh', 'biohazard', 'transmitter', 'lsdf', 'main-base-assessment'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout · laundry-filled room',
    confidence: 'Transmitter concealment directly shown; Hinrigh’s claim about Yokotani lacking visual access through the automatic guards remains tactical inference',
  }),
  timelineEvent({
    id: '399-nobunaga-room3101-two-way-route-analysis',
    label: 'Nobunaga returns to Room 3101 and identifies the two-way trap/passage result',
    detail: 'Back in Room 3101, Nobunaga concludes that entering from the room-side front door sends a target into the hideout, while exiting through the hideout-side door sends a target to Room 3101. He describes the arrangement as both a trap and a secret passage. He further reasons that Heil-Ly must have a jump point that members alone can use somewhere in the room, but that member-only route remains his deduction rather than a demonstrated mechanism.',
    people: ['Nobunaga Hazama'],
    tracks: ['room-3101', 'heil-ly', 'teleportation', 'route-topology', 'hypothesis-boundary'],
    location: 'Black Whale · Tier 3 · Room 3101',
  }),
  timelineEvent({
    id: '399-hinrigh-returns-ability-unavailable-knives-spent',
    label: 'Hinrigh returns to Room 3101 with Biohazard unavailable for the rest of the day',
    detail: 'Hinrigh is expelled/returns to Room 3101 after hiding the transmitter and tells Nobunaga that the enemy probably will not notice it. Hinrigh says he will support Nobunaga because he cannot use his ability anymore that day and has used all of his knives. This is a Chapter 399 rest-of-day operational/resource statement, not a universal fixed daily-use count or exact aura-reset rule.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama'],
    tracks: ['hinrigh', 'biohazard', 'resource-limit', 'room-3101'],
    location: 'Black Whale · Tier 3 · Room 3101',
  }),
  timelineEvent({
    id: '399-xiyu-troupe-divide-search-work',
    label: 'Hinrigh and Nobunaga divide the next Heil-Ly search tasks',
    detail: 'Hinrigh plans to estimate the hideout’s location on the ship floor plan, create descriptions of the members, find witnesses, narrow their activity area, and gather Xi-Yu personnel for information. Nobunaga says the Phantom Troupe will handle searching for the transmitter. These are active next-step plans, not completed results at the Chapter 399 boundary.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama'],
    tracks: ['xi-yu', 'phantom-troupe', 'tracking', 'heil-ly-search', 'operational-planning'],
    location: 'Black Whale · Tier 3 · Room 3101',
  }),
  timelineEvent({
    id: '399-oyster-beeps-final-morena-kikan-caution',
    label: 'The hidden oyster continues beeping as the pair warn against underestimating Heil-Ly',
    detail: 'Inside the hideout laundry room, the transmitter is still visibly an oyster under the cabinet and beeps twice. Hinrigh tells Nobunaga that although the Heil-Ly members looked amateurish, they must remain cautious because Morena’s capabilities and the meaning of “kikan” are unknown. Nobunaga agrees and says whoever is moving the pieces is not stupid. The remark is an assessment of enemy coordination, not identification of a new mastermind.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama', 'Morena Prudo'],
    tracks: ['biohazard', 'transmitter', 'morena', 'organ-role', 'enemy-assessment'],
    location: 'Black Whale · Tier 3 · Room 3101 / Heil-Ly hideout laundry room',
    confidence: 'Transmitter state confirmed; Morena capability, kikan meaning, and coordinating intelligence remain unresolved',
  }),
]);

export const succession399TerebellumResearch = freeze({
  ability: 'Damage: "Sweet Home"',
  user: 'Terebellum',
  nenType: 'Emitter',
  rightHand: 'If Terebellum is touching something with his right hand at the moment it receives damage, that damage is taken into Terebellum instead.',
  leftHand: 'Received damage can be transferred onward to something Terebellum touches with his left hand.',
  timing: 'The protected target must be touched at the moment the damage is received.',
  attackingObject: 'The demonstrated knife and katana damage includes displacement of attacking material/tips together with the transferred damage.',
  selfCost: 'If received damage is not transferred onward, Terebellum bears it himself.',
  unresolved: freeze(['Maximum range between right-hand protected target and left-hand transfer target', 'Whether damage can be held for any delay before transfer', 'Maximum damage/capacity', 'Aura cost', 'Complete rules for self-targeted damage']),
  source: source399,
});

export const succession399YokotaniResearch = freeze({
  ability: 'A Battle of Wits: "LSDF"',
  user: 'Yokotani',
  nenType: 'Conjurer / Conjuration ability',
  locationCondition: 'Can only be used at the hideout where Morena is located.',
  activation: 'Yokotani identifies himself to an intruder who has broken the law.',
  defenseRule: 'The conjured guards cannot harm the criminal, and attacks by the criminal are ineffective against the guards once the ability conditions apply.',
  scaling: 'More serious crimes allow higher-level guards.',
  demonstrated: freeze(['Seven guards are conjured.', 'Trespassing and attempted murder produce alert level 4.', 'Nobunaga attacking a guard raises it to maximum alert and increases its aura.', 'The guards restrain Nobunaga, confiscate his katana, and carry him out for expulsion.']),
  automationBoundary: 'Nobunaga calls the guards autopilot. Hinrigh additionally infers that Yokotani cannot see through them; that visual-link conclusion is not independently narrated as a mechanic.',
  teleportBoundary: 'Nobunaga is eventually teleported to Room 3101 during expulsion, but Chapter 399 does not establish that the Room 3101 teleport route is intrinsically produced by LSDF rather than used by it.',
  source: source399,
});

export const succession399RouteResearch = freeze({
  inboundObserved: 'Chapter 398 establishes that inward crossing of the tested Room 3101-side/front-door entry sends nonmembers into the Heil-Ly hideout.',
  outboundObserved: 'Chapter 399 returns both Nobunaga and Hinrigh from the hideout to Room 3101 during expulsion/exit.',
  operationalConclusion: 'The route functions both as a hostile entry trap and as a concealed passage between Room 3101-side access and the Heil-Ly hideout.',
  memberOnlyBoundary: 'Nobunaga reasons that there must be a separate jump point usable by Heil-Ly members, but no such member-only point is directly demonstrated in the supplied Chapter 399 synopsis.',
  ownerBoundary: 'The route’s official ability name, operator, ability-specific Nen category, exact relation to Gateaume, and exact relation to Voconte remain unresolved.',
  source: source399,
});

export const succession399OperationalResearch = freeze({
  hinrighResources: freeze({
    biohazard: 'Hinrigh says he cannot use his ability anymore that day after returning to Room 3101.',
    knives: 'Hinrigh says he has used all of his knives.',
    boundary: 'The statement is preserved as rest-of-day availability, without inventing a fixed number of Biohazard activations, a universal daily quota, or an exact reset/aura formula.',
  }),
  nextSteps: freeze([
    'Hinrigh will estimate the hideout location on the ship floor plan.',
    'Hinrigh will create descriptions of the Heil-Ly members seen inside.',
    'Hinrigh will seek witnesses and narrow the group’s area of activity.',
    'Hinrigh will gather Xi-Yu members to consolidate information.',
    'The Phantom Troupe will search for the hidden transmitter.',
  ]),
  endpoint: 'The transmitter remains under a cabinet inside the hideout laundry room in oyster form and beeps twice.',
  source: source399,
});

export const succession399RelationshipRecords = freeze([
  freeze({
    id: '399-hinrigh-nobunaga-field-cooperation',
    chapter: 399,
    people: freeze(['Hinrigh Biganduffno', 'Nobunaga Hazama']),
    relationship: 'Temporary anti-Heil-Ly field partnership continues',
    status: 'They jointly confront the nine-member Heil-Ly room, test Terebellum and Yokotani’s defenses, communicate during LSDF expulsion, then reunite in Room 3101 and divide the next search responsibilities.',
    boundary: 'The pair’s growing tactical trust and task division do not establish permanent alliance, friendship, Xi-Yu membership for Nobunaga, or Phantom Troupe membership for Hinrigh.',
    source: source399,
  }),
  freeze({
    id: '399-xiyu-troupe-search-division',
    chapter: 399,
    people: freeze(['Hinrigh Biganduffno', 'Nobunaga Hazama']),
    relationship: 'Xi-Yu / Phantom Troupe anti-Heil-Ly task division',
    status: 'Hinrigh takes floor-plan mapping, member descriptions, witnesses, activity-area narrowing, and Xi-Yu information gathering; Nobunaga assigns the Troupe to the transmitter search.',
    boundary: 'This is a temporary operational division against a shared target, not merged command or permanent institutional alliance.',
    source: source399,
  }),
]);

export const succession399ResolvedQuestions = freeze([
  freeze({ question: 'What is Terebellum’s personal Nen ability?', chapter: 399, answer: 'Damage: “Sweet Home”, an Emission ability that receives damage through a right-hand contact at the moment of impact and can transfer it onward through left-hand contact.', source: source399 }),
  freeze({ question: 'What is Yokotani’s personal Nen ability?', chapter: 399, answer: 'A Battle of Wits: “LSDF”, a Conjuration defense ability restricted to the hideout where Morena is located and activated by Yokotani identifying himself to a law-breaking intruder.', source: source399 }),
  freeze({ question: 'Does the Heil-Ly hideout route return intruders to Room 3101?', chapter: 399, answer: 'Yes in the demonstrated Chapter 399 result: Nobunaga and Hinrigh both return from the hideout to Room 3101.', source: source399 }),
  freeze({ question: 'Is Morena somewhere within the hideout/complex being infiltrated?', chapter: 399, answer: 'LSDF is explicitly stated to work only at the hideout where Morena is located and is activated there. Her exact room remains unknown.', source: source399 }),
  freeze({ question: 'Does Hinrigh preserve the tracking transmitter inside the hideout?', chapter: 399, answer: 'Yes. He vomits the still-transformed oyster and hides it beneath a cabinet in the laundry room, where it remains at the chapter endpoint.', source: source399 }),
]);

export const succession399Mysteries = freeze([
  freeze({ question: 'Who owns and sustains the Room 3101 ↔ hideout teleport route?', chapter: 399, status: 'still open; two-way operational results are clearer, but official ability name, operator, category, and relation to Gateaume/Voconte remain unresolved', source: source399 }),
  freeze({ question: 'Where is the Heil-Ly member-only jump point proposed by Nobunaga?', chapter: 399, status: 'unconfirmed hypothesis; no member-only jump point is directly demonstrated in the supplied chapter', source: source399 }),
  freeze({ question: 'What exactly does the Heil-Ly “organ” (kikan) role mean?', chapter: 399, status: 'open; Perigord is confirmed selected and ordered to keep his head down, but the function is not explained', source: source399 }),
  freeze({ question: 'What are Hinrigh’s exact Biohazard resource/reset rules?', chapter: 399, status: 'open; he says he cannot use the ability again that day, but fixed use counts, exact aura expenditure, and reset mechanics are not supplied', source: source399 }),
  freeze({ question: 'Who coordinates Heil-Ly’s defensive planning and how much is Morena personally controlling?', chapter: 399, status: 'open; Nobunaga judges that whoever is moving the pieces is not stupid, but this does not identify a separate mastermind or define Morena’s direct control of every mechanism', source: source399 }),
]);

export const succession399IntertextualityResearch = freeze({
  status: 'Trivia/reference metadata only; not used to infer story mechanics.',
  notes: freeze([
    'The supplied trivia says the Hunter × Hunter letters on Yokotani’s book refer to the Six Codes legal-code tradition.',
    'The supplied trivia links Sweet Home to the 1989 Japanese horror film and its game adaptation, which later influenced Resident Evil.',
    'The supplied trivia links the Japanese name Bokkō associated with Yokotani’s ability to Ken’ichi Sakemi’s 1991 historical novel about Mohist non-war / universal-love ideas.',
  ]),
  source: source399,
});

export const succession399ChapterResearch = freeze([
  freeze({
    number: 399,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Heil-Ly main-base confrontation / defensive ability reveal / Room 3101 return',
    voyageDay: 'Voyage Day 10',
    chronology: freeze({ frame: presentTime, exactClockTime: null, presentDay: true, flashback: false }),
    lanes: freeze(['Hinrigh / Nobunaga', 'Heil-Ly', 'Terebellum / Sweet Home', 'Yokotani / LSDF', 'Room 3101 route', 'Xi-Yu / Phantom Troupe search']),
    focus: 'Hinrigh and Nobunaga reach a room containing nine Heil-Ly members, reveal Terebellum’s Damage: “Sweet Home” and Yokotani’s A Battle of Wits: “LSDF”, are expelled back toward Room 3101, preserve the transmitter inside the hideout, and divide the next Xi-Yu/Troupe search tasks while the exact route operator, kikan role, and Morena’s complete capabilities remain unresolved.',
    events: succession399TimelineEvents,
    prelude: freeze([]),
    locations: freeze(['Heil-Ly hideout laundry-filled room', 'Heil-Ly hideout gathering/defense room', 'Room 3101', 'Tier 3 search area']),
    threadLabels: freeze(['Heil-Ly', 'Phantom Troupe', 'Xi-Yu', 'Biohazard', 'Sweet Home', 'LSDF', 'Hidden routes']),
    confidence: freeze(['user-supplied Hunterpedia synopsis is sole story source', 'laundry/neighborhood explanations preserved as competing hypotheses', 'Sweet Home and LSDF mechanics limited to explicit Chapter 399 explanation/demonstration', 'member-only jump point remains Nobunaga inference', 'Hinrigh rest-of-day ability limit not generalized into a universal quota', 'no Chapter 400+ backfill']),
    status: 'Maintained chapter summary + chronology + Nen abilities + route boundary + character/resource states + operational consequences linked',
    coverage: freeze({ identity: true, publication: true, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true }),
    lastReviewed: 'August 10, 2026',
    releaseDate: null,
    officialReaderUrl: null,
    source: source399,
  }),
]);
