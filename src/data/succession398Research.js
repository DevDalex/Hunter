const freeze = (value) => Object.freeze(value);
const source398 = 'https://hunterxhunter.fandom.com/wiki/Chapter_398';
const presentTime = 'Voyage Day 10 · Tier 3 Heil-Ly hidden-route investigation · exact clock time unsupplied';

export const succession398SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'User-supplied Hunterpedia Chapter 398 synopsis text',
  chapterUrl: source398,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 398 returns from the Meteor City flashback to the present Tier 3 Heil-Ly investigation on Voyage Day 10. The synopsis supplies no exact clock time, so none is invented.',
  teleportBoundary: 'The room trap is repeatedly demonstrated, but Phinks and Nobunaga are theorizing about Gateaume, Emission, Conjuration, Specialization, land-mine placement, user proximity, and the likely destination. Observed activation is separated from their explanatory hypotheses.',
  nenSystemBoundary: 'The chapter exposition distinguishes barrier-type and land-mine-type prepared Nen traps. Those general descriptions are preserved separately from the Troupe’s unconfirmed application of the land-mine model to this specific Heil-Ly trap.',
  biohazardBoundary: 'Hinrigh explicitly explains the transmitter-to-oyster use of Biohazard, estimated roughly two-hour duration for that transformed object, reversion after aura depletion, and receiver behavior. Those statements expand Biohazard only to the demonstrated/explained transmitter use and do not create a universal lifetime formula for every transformed object.',
  hideoutBoundary: 'The self-restoring wall is directly observed after Nobunaga cuts it. Nen protection is strongly indicated in-scene, while Conjuration/Transmutation/Specialization, user proximity, and the claim that the user is inside remain Nobunaga’s analysis rather than confirmed classification.',
  morenaBoundary: 'Morena is shown smiling elsewhere while the hideout is investigated. The scene does not establish that she personally operates the room trap, restorative wall, or every component of the hidden stage.',
  excluded: freeze([
    'Assigning Gateaume’s decoy-body phenomenon or the front-door teleport trap a confirmed Nen category from Phinks/Nobunaga speculation',
    'Treating Gateaume as the confirmed teleport operator or confirmed trap user',
    'Treating the trap as conclusively land-mine type merely because Nobunaga infers that model',
    'Treating Phinks’s user-near-destination or hideout-location deduction as independently confirmed fact',
    'Generalizing the oyster’s roughly two-hour estimate into a universal Biohazard duration or mass-to-aura equation',
    'Claiming the receiver measures altitude when Hinrigh explicitly says it does not',
    'Assigning the self-restoring hideout wall to Morena or a specific Nen category without confirmation',
    'Converting the observed shower, bathroom, toilets, and laundry room into a complete solved hideout floor plan',
    'Importing Chapter 399+ outcomes, identities, mechanics, or later reinterpretations',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Black Whale · Tier 3', confidence = 'Confirmed in the user-supplied Hunterpedia Chapter 398 synopsis' }) => freeze({
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
  chapter: 398,
  confidence,
  source: source398,
});

export const succession398TimelineEvents = freeze([
  timelineEvent({
    id: '398-troupe-debates-gateaume-teleport-mechanism',
    label: 'Phinks and Nobunaga debate Gateaume’s role and the teleportation mechanism',
    detail: 'While Feitan keeps a Mafia member hostage, Phinks proposes that Gateaume’s displayed double may act as a lookout/trap trigger that forcibly teleports anyone entering a certain radius. Nobunaga argues that teleportation is associated with Emission, that complex rule-bound rooms fit Conjuration more naturally than sending people elsewhere, and that Gateaume may therefore be only the lookout while another ability supplies the trap. Phinks raises Specialization. These are character analyses, not confirmed ability classifications.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Gateaume'],
    tracks: ['phantom-troupe', 'heil-ly', 'room-trap', 'nen-theory', 'gateaume'],
    location: 'Black Whale · Tier 3 · Room 3101 / adjacent hidden-room access',
    confidence: 'Dialogue-confirmed theories; mechanism and ability ownership remain unresolved',
  }),
  timelineEvent({
    id: '398-bathroom-bypass-front-door-test',
    label: 'The Troupe confirms that the wall/bathroom route bypasses the front-door trigger',
    detail: 'The hostage opens the small bathroom and then the hidden-room door. Nothing happens when he enters the main room through the bathroom-side route. The Troupe reasons that the bathroom arrangement buys time against investigators who recognize the front door as dangerous and instead breach through the neighboring wall.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['phantom-troupe', 'heil-ly', 'room-trap', 'route-testing'],
    location: 'Black Whale · Tier 3 · Heil-Ly hidden room / bathroom access',
  }),
  timelineEvent({
    id: '398-first-hostage-reentry-teleports',
    label: 'The first hostage disappears only after leaving and re-entering through the front door',
    detail: 'The Mafia hostage walks out through the front door without disappearing, attempts to flee, is forced back by Feitan, and vanishes immediately when he re-enters the room through the front. Gateaume’s displayed double is not visibly present during this activation.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['phantom-troupe', 'heil-ly', 'teleportation', 'room-trap', 'observed-trigger'],
    location: 'Black Whale · Tier 3 · Heil-Ly hidden-room front door',
  }),
  timelineEvent({
    id: '398-barrier-land-mine-nen-exposition',
    label: 'Barrier-type and land-mine-type prepared Nen traps are distinguished',
    detail: 'The chapter explains that barrier-type traps distribute multiple activation points across a wider area using Nen-imbued support objects such as ropes or paper talismans, while land-mine-type traps place a Nen activation switch directly at a specific location and are stronger but limited to roughly two or three locations. Nobunaga observes no support objects and therefore guesses the room uses a land-mine-type setup. Phinks further theorizes that a stronger land-mine user must stay closer to the entry or exit and may be near the teleport destination. The general exposition is preserved separately from these case-specific deductions.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['nen-system', 'prepared-traps', 'barrier-type', 'land-mine-type', 'heil-ly'],
    location: 'Black Whale · Tier 3 · Heil-Ly hidden-room front door',
    confidence: 'General trap distinction presented as chapter exposition; classification of this specific trap remains character inference',
  }),
  timelineEvent({
    id: '398-second-hostage-confirms-continuous-activation',
    label: 'A second hostage confirms that the teleport trap can activate continuously',
    detail: 'Feitan takes another nearby Mafia member hostage and forces him into the room. He disappears immediately as well. Nobunaga concludes that the trap is capable of continuous activation rather than a single-use trigger, and Feitan volunteers to enter first.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['phantom-troupe', 'heil-ly', 'teleportation', 'continuous-activation'],
    location: 'Black Whale · Tier 3 · Heil-Ly hidden-room front door',
  }),
  timelineEvent({
    id: '398-keni-hinrigh-propose-cooperation',
    label: 'Ken’i introduces Hinrigh and proposes Mafia-Troupe cooperation against Heil-Ly',
    detail: 'Ken’i interrupts the planned deliberate entry, identifies Hinrigh as the Xi-Yu underboss, and asks the Troupe to hear a proposal before attempting a suicide mission. Ken’i says Cha-R is following two suspected Heil-Ly members, while Hinrigh says the Kakin Mafia values balance and offers help finding the hideout if the Troupe destroys Heil-Ly.',
    people: ["Ken'i Wang", 'Hinrigh Biganduffno', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['cha-r', 'xi-yu', 'phantom-troupe', 'heil-ly', 'mafia-balance', 'cooperation'],
    location: 'Black Whale · Tier 3 · standard-cabin hallway',
  }),
  timelineEvent({
    id: '398-hinrigh-transmitter-oyster-biohazard',
    label: 'Hinrigh turns a transmitter into an oyster and explains the tracking plan',
    detail: 'Hinrigh transforms a transmitter into a raw oyster with Biohazard. He explains that swallowing it whole makes discovery difficult even if a body is stripped and cavity-searched, that the transformed object returns to its original form after its aura is depleted, and that transformed duration depends on object size. He estimates this oyster will last about two hours. The estimate is specific to this use and does not establish a universal duration formula.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['hinrigh', 'biohazard', 'transmitter', 'tracking', 'nen'],
    location: 'Black Whale · Tier 3 · standard-cabin hallway',
  }),
  timelineEvent({
    id: '398-hinrigh-explains-receiver-enters-trap',
    label: 'Hinrigh swallows the oyster, gives Phinks the receiver, and enters the trap himself',
    detail: 'Hinrigh swallows the transformed transmitter, then explains that the receiver reports distance and rough direction: closer range produces shorter, higher-pitched beeps and a redder bar. Its maximum radius is one kilometer and it does not account for altitude, so unclear direction can mean the transmitter is above or below. Hinrigh hands the receiver to Phinks, prioritizes preserving the transmitter if possible, and deliberately enters the teleport trap.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['hinrigh', 'biohazard', 'transmitter', 'tracking', 'teleportation'],
    location: 'Black Whale · Tier 3 · Heil-Ly hidden-room front door',
  }),
  timelineEvent({
    id: '398-receiver-registers-distance-troupe-triangulates',
    label: 'The receiver registers a 500–1,000 meter band and the Troupe considers ship-scale triangulation',
    detail: 'After Hinrigh disappears, Phinks sees the receiver change and estimates the transmitter is between 500 and 1,000 meters away. The group cites the Black Whale as about 1,500 meters long and 800 meters high and wide, then debates moving toward central Tier 3 to see how the signal changes. The receiver gives a range constraint, not a precise hideout coordinate.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Hinrigh Biganduffno'],
    tracks: ['black-whale', 'tracking', 'triangulation', 'phantom-troupe', 'heil-ly'],
    location: 'Black Whale · Tier 3',
    confidence: 'Receiver behavior and character-stated ship dimensions confirmed; exact hideout coordinates remain unresolved',
  }),
  timelineEvent({
    id: '398-hinrigh-arrives-heilly-hideout',
    label: 'Hinrigh arrives in the Heil-Ly hideout and finds fresh signs but no immediate attacker',
    detail: 'Hinrigh arrives crouched and ready to stab, finds nobody directly in front of him, hears sounds from a nearby door, notices fresh blood on the floor, and stays alert because prior victims may have revealed information. He senses a presence behind him and leaps back.',
    people: ['Hinrigh Biganduffno'],
    tracks: ['hinrigh', 'heil-ly', 'hideout', 'teleportation', 'survival'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout',
  }),
  timelineEvent({
    id: '398-nobunaga-follows-hinrigh-coop',
    label: 'Nobunaga follows Hinrigh through the trap and chooses to cooperate inside the hideout',
    detail: 'The sensed presence is Nobunaga, who deliberately followed through the trap. He jokes that they are playing co-op and says Hinrigh has a better survival chance with company. Nobunaga explains that Phinks and Feitan remained skeptical but that he did not believe a deception requiring immediate trust in a stranger was plausible. Hinrigh gives his name again and the two agree to move rather than wait.',
    people: ['Nobunaga Hazama', 'Hinrigh Biganduffno', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['nobunaga', 'hinrigh', 'temporary-alliance', 'heil-ly', 'hideout'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout',
  }),
  timelineEvent({
    id: '398-nobunaga-tests-self-restoring-wall',
    label: 'Nobunaga’s katana cuts vanish as the hideout wall restores itself',
    detail: 'Nobunaga strikes the wall several times with his katana and the damage rapidly disappears. Hinrigh recognizes Nen protection. Nobunaga says Conjuration, Transmutation, or Specialization could be involved and discusses the common logic that a prepared Nen stage becomes stronger when the user is closer, then guesses the user is inside because even his katana cannot cut the wall. Morena is shown smiling elsewhere. The wall restoration is observed; category, operator, proximity rule, and Morena’s personal control remain unconfirmed.',
    people: ['Nobunaga Hazama', 'Hinrigh Biganduffno', 'Morena Prudo'],
    tracks: ['heil-ly', 'hideout', 'nen-stage', 'self-restoring-wall', 'nen-theory'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout',
    confidence: 'Wall restoration directly observed; classification, operator identity, and user-proximity explanation remain analytical hypotheses',
  }),
  timelineEvent({
    id: '398-hinrigh-nobunaga-sweep-to-laundry',
    label: 'Hinrigh and Nobunaga sweep the hideout side rooms and reach a laundry-filled room',
    detail: 'Hinrigh asks Nobunaga to watch for a disappearance trigger while he opens doors one at a time. They observe a shower room, a bathroom, and three toilets. Hinrigh prefers to keep moving and trusts Nobunaga to protect the transmitter if he dies. Nobunaga asks him to drop the honorific. Hinrigh then opens the main door with his knife and the pair find a room filled with laundry. The observations add local facilities without solving the hideout’s full topology or capacity.',
    people: ['Hinrigh Biganduffno', 'Nobunaga Hazama'],
    tracks: ['hinrigh', 'nobunaga', 'heil-ly', 'hideout', 'route-mapping', 'laundry'],
    location: 'Black Whale · Tier 3 · Heil-Ly hideout',
  }),
]);

export const succession398TeleportTrapResearch = freeze({
  observed: freeze([
    'Entering the hidden/main room from the bathroom-side bypass does not trigger the teleport.',
    'The first hostage leaves through the front door and disappears only when forced to re-enter through that front doorway.',
    'A second hostage is also teleported on entry, demonstrating repeat/continuous activation.',
    'Gateaume’s displayed double is not visibly required to be present when these Chapter 398 activations occur.',
    'Nobunaga follows Hinrigh through the same trap and reaches the hideout.',
  ]),
  exposition: freeze({
    barrierType: 'Uses Nen-imbued support objects such as ropes or paper talismans to establish multiple traps over a wider area.',
    landMineType: 'Places the activation switch directly with Nen at a specific location; described as stronger but limited to roughly two or three locations.',
  }),
  deductionsNotConfirmed: freeze([
    'Phinks’s initial theory that entering a radius around Gateaume’s double forces teleportation.',
    'Nobunaga’s theory that Gateaume is merely the lookout and the teleport trap is a different ability.',
    'Nobunaga’s classification of this specific setup as land-mine type because no support objects are visible.',
    'Phinks’s theory that the stronger land-mine user must be near the entry or exit point and is probably close to the teleport destination/hideout.',
    'Any specific Emission, Conjuration, or Specialization classification for the trap or Gateaume’s decoy-body ability.',
  ]),
  unresolved: freeze(['Trap user identity', 'Ability name', 'Ability-specific Nen category', 'Exact activation boundary', 'Entry/exit topology', 'Maximum uses and simultaneous targets', 'Whether every observed route uses the same ability']),
  source: source398,
});

export const succession398BiohazardResearch = freeze({
  demonstratedUse: 'Hinrigh turns a physical transmitter into a raw oyster, swallows it, and deliberately enters the teleport trap while Phinks keeps the paired receiver.',
  reversion: 'Hinrigh says the transformed object will return to its original form after its aura is depleted.',
  duration: 'Hinrigh says transformed duration depends on object size and estimates roughly two hours for this transmitter-oyster. No universal formula is supplied.',
  receiver: freeze({
    readout: 'Distance plus rough direction.',
    approachFeedback: 'Shorter and higher-pitched beeps plus a redder light/bar as the receiver gets closer.',
    maximumRadius: '1 kilometer.',
    altitude: 'Not accounted for; unclear direction may indicate the transmitter is above or below.',
  }),
  unresolved: freeze(['Exact aura cost', 'General size-to-duration relation', 'Whether all transformed objects automatically revert only through aura exhaustion', 'Maximum transformation mass/count/range']),
  source: source398,
});

export const succession398HideoutResearch = freeze({
  entry: 'Hinrigh and then Nobunaga arrive via the tested teleport trap.',
  observedSigns: freeze(['Fresh blood on the floor', 'Sounds from a nearby door', 'No immediate person directly in front of Hinrigh on arrival']),
  wall: 'Nobunaga’s katana leaves cuts that rapidly disappear, providing direct evidence of a self-restoring Nen-protected stage/wall.',
  wallTheoryBoundary: 'Nobunaga names Conjuration, Transmutation, and Specialization as possibilities and guesses the user is nearby/inside; these are analyses, not confirmed classifications or operator identity.',
  observedFacilities: freeze(['shower room', 'bathroom', 'three toilets', 'room filled with laundry']),
  topologyBoundary: 'These local observations do not establish the full hideout dimensions, occupant capacity, complete route graph, or exact position within Tier 3.',
  morenaBoundary: 'Morena is shown smiling elsewhere, but the chapter does not identify her as the personal operator of the wall or teleport trap.',
  source: source398,
});

export const succession398RelationshipRecords = freeze([
  freeze({
    id: '398-hinrigh-nobunaga-field-cooperation',
    chapter: 398,
    people: freeze(['Hinrigh Biganduffno', 'Nobunaga Hazama']),
    relationship: 'Temporary anti-Heil-Ly field partnership',
    status: 'Nobunaga follows Hinrigh through the trap, increases his survival odds, lets Hinrigh choose whether to move, watches for disappearance triggers during the sweep, and asks Hinrigh to drop the honorific.',
    boundary: 'Tactical respect/cooperation does not establish permanent alliance, friendship, Mafia membership, or Troupe membership.',
    source: source398,
  }),
  freeze({
    id: '398-mafia-troupe-anti-heilly-cooperation',
    chapter: 398,
    people: freeze(["Ken'i Wang", 'Hinrigh Biganduffno', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor']),
    relationship: 'Temporary anti-Heil-Ly cooperation',
    status: 'Ken’i and Hinrigh offer tracking support in exchange for the Troupe continuing to eliminate Heil-Ly, while Phinks and Feitan remain more skeptical of immediate trust than Nobunaga.',
    boundary: 'Shared enemy and tactical cooperation do not erase Xi-Yu, Cha-R, or Phantom Troupe institutional interests.',
    source: source398,
  }),
]);

export const succession398ResolvedQuestions = freeze([
  freeze({ question: 'Can the Room 3101/hidden-room teleport trigger activate without Gateaume’s displayed double visibly present?', chapter: 398, answer: 'Yes. Two hostages are teleported while the displayed old-man double is not present in the room.', source: source398 }),
  freeze({ question: 'Can the tested teleport trigger activate more than once in succession?', chapter: 398, answer: 'Yes. A second hostage disappears after the first, and Nobunaga later follows Hinrigh through the trap.', source: source398 }),
  freeze({ question: 'Does Hinrigh personally trust someone else to swallow the transformed transmitter?', chapter: 398, answer: 'No need. He swallows the Biohazard-transformed transmitter himself and enters as the decoy.', source: source398 }),
  freeze({ question: 'Do Hinrigh and Nobunaga reach a concealed Heil-Ly interior space?', chapter: 398, answer: 'Yes. Both arrive through the trap and begin searching a Nen-protected hideout interior.', source: source398 }),
]);

export const succession398Mysteries = freeze([
  freeze({ question: 'Who actually operates the front-door teleport trap, and what is its exact ability/category?', chapter: 398, status: 'open; the Troupe supplies competing theories but no confirmed user or ability-specific Nen category', source: source398 }),
  freeze({ question: 'Is the tested trap truly the land-mine type described by the chapter exposition?', chapter: 398, status: 'open; Nobunaga infers that classification because he sees no support objects', source: source398 }),
  freeze({ question: 'Where exactly inside the Black Whale is the teleport destination/hideout?', chapter: 398, status: 'open; the receiver supplies only a broad 500–1,000 meter distance band and rough direction constraints', source: source398 }),
  freeze({ question: 'Who created or sustains the self-restoring hideout wall/stage?', chapter: 398, status: 'open; Nobunaga offers category and proximity theories but no operator is confirmed', source: source398 }),
  freeze({ question: 'What lies beyond the laundry-filled room and how does the full Heil-Ly hideout route connect?', chapter: 398, status: 'open at the Chapter 398 endpoint', source: source398 }),
]);

export const succession398ChapterResearch = freeze([
  freeze({
    number: 398,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Tier 3 Heil-Ly trap testing / Hinrigh–Nobunaga hideout infiltration',
    voyageDay: 'Voyage Day 10',
    chronology: freeze({ frame: presentTime, exactClockTime: null, presentDay: true, flashback: false }),
    lanes: freeze(['Phantom Troupe', 'Xi-Yu / Cha-R', 'Heil-Ly', 'Nen mechanics', 'Tier 3 hidden-route investigation']),
    focus: 'The Troupe empirically tests the Heil-Ly front-door teleport trap while keeping its user/category unresolved; Hinrigh expands Biohazard with a transmitter-oyster tracking method, enters the trap himself, and is joined by Nobunaga inside a self-restoring Nen-protected hideout that they begin to sweep.',
    events: succession398TimelineEvents,
    prelude: freeze([]),
    locations: freeze(['Tier 3 standard-cabin hallway', 'Room 3101 / adjacent hidden-room access', 'Heil-Ly hidden-room front door', 'Heil-Ly hideout interior', 'Hideout shower/bathroom/toilets', 'Hideout laundry-filled room']),
    threadLabels: freeze(['Phantom Troupe', 'Heil-Ly', 'Mafia', 'Biohazard', 'Nen systems', 'Hidden routes']),
    confidence: freeze(['user-supplied Hunterpedia synopsis is sole story source', 'observed trap behavior separated from Phinks/Nobunaga theory', 'Biohazard transmitter mechanics limited to Hinrigh’s explicit explanation', 'self-restoring wall observation separated from operator/category speculation', 'no Chapter 399+ backfill']),
    status: 'Maintained chapter summary + chronology + Nen-mechanic boundaries + relationships + locations + consequences linked',
    coverage: freeze({ identity: true, publication: true, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true }),
    lastReviewed: 'August 10, 2026',
    releaseDate: null,
    officialReaderUrl: null,
    source: source398,
  }),
]);
