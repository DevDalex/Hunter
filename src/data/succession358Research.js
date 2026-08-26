const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_358';

export const succession358SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 358 synopsis and chapter-note text',
  titleMetadata: 'English title Eve retained from the repository chapterTitles dataset, itself transcribed from Hunterpedia; Japanese title was not supplied in the current text and is left unset.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location, tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Pre-voyage · boarding / departure ceremony',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 358,
  confidence,
  source,
});

export const succession358TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-358-eve-festival',
    title: 'The eve festival concludes and departure day arrives',
    detail: 'The festival on the eve of departure runs its course. The following day thousands gather at the port beside the Black Whale for the formal departure ceremony and boarding.',
    location: 'Kakin port · Black Whale departure site',
    tracks: ['black-whale', 'kakin', 'departure-ceremony'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-nasubi-rally',
    title: 'Nasubi publicly frames the New Continent voyage as Kakin’s historic triumph',
    detail: 'Gantai and Tamazo introduce Nasubi, who addresses the crowd from a raised platform and declares confidence that the New Continent is within Kakin’s grasp. Beyond and the royal family are then presented to the public.',
    location: 'Kakin port · departure ceremony',
    tracks: ['nasubi', 'beyond', 'kakin', 'new-continent', 'royal-family'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-prince-ambitions',
    title: 'Senior princes privately anticipate becoming the next king',
    detail: 'During the public presentation, the first six princes other than Camilla are shown thinking that they will become the next king, reinforcing that the voyage is already being read through succession ambitions even before formal departure.',
    location: 'Kakin port · royal presentation',
    tracks: ['princes', 'succession-contest', 'camilla'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-boarding-by-class',
    title: 'Royalty, VIPs, and civilians board through different transport channels',
    detail: 'Nasubi, the princes, and other VIPs travel to the Black Whale by airship, while ferries carry general passengers. The boarding process physically separates elite and public access before the voyage begins.',
    location: 'Kakin port → Black Whale',
    tracks: ['black-whale', 'boarding', 'airships', 'ferries', 'passenger-classes'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-five-tier-structure',
    title: 'The Black Whale’s five-tier social structure is established',
    detail: 'Tier 1 houses the Kakin royal family, V6 politicians, and industry dignitaries; Tier 2 houses celebrities and the wealthy; Tiers 3 through 5 house general passengers. Royal Army checkpoints control passage between tiers.',
    location: 'Black Whale · five-tier structure',
    tracks: ['black-whale', 'tiers', 'royal-army', 'class-structure'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-martial-law-access',
    title: 'Martial law places communications and inter-tier movement under military control',
    detail: 'The Black Whale is under martial law. The Royal Army guards through-ways, controls phone lines, monitors halls, and tracks activity. Lower-ranking queens cannot directly contact higher-ranking queens.',
    location: 'Black Whale · shipwide security system',
    tracks: ['martial-law', 'royal-army', 'communications', 'queens', 'surveillance'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-tier-two-three-bulkhead',
    title: 'The Tier 2–3 bulkhead creates the boundary of the succession hunting zone',
    detail: 'A thick metal bulkhead separates Tiers 2 and 3 and can be opened only from the Tier 2 side during emergencies. The supplied notes therefore describe only Tiers 1 and 2 as the succession battle’s “hunting grounds.”',
    location: 'Black Whale · Tier 2 / Tier 3 boundary',
    tracks: ['black-whale', 'tier-2', 'tier-3', 'bulkhead', 'succession-contest'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-benjamin-guard-doctrine',
    title: 'Balsamilco orders Benjamin’s soldiers to act as guards rather than soldiers aboard ship',
    detail: 'Balsamilco tells Benjamin’s personal soldiers to exercise restraint while aboard the Black Whale. Until disembarkation roughly two months later, they are to behave as guards, not battlefield soldiers, unless Benjamin authorizes a situation requiring Operation Assault.',
    location: 'Black Whale · Benjamin security briefing',
    tracks: ['benjamin', 'balsamilco', 'operation-assault', 'guards', 'military'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-sunday-banquet-schedule',
    title: 'Weekly royal banquets create controlled but limited contact windows',
    detail: 'Every Sunday all princes attend formal dinner parties with dignitaries, but each prince enters and leaves at prescribed separate times so princes do not pass one another in transit. Balsamilco notes that this may leave very few direct opportunities during the voyage.',
    location: 'Black Whale · Tier 1 royal banquet system',
    tracks: ['princes', 'sunday-banquet', 'tier-1', 'security'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-kurapika-defers-contest',
    title: 'Kurapika prioritizes avoiding the succession battle while mapping Oito and Woble’s options',
    detail: 'Kurapika reassures Oito that he intends to avoid direct participation in the succession battle for the time being and begins assessing communications, guard strength, possible Nen users, and evacuation opportunities.',
    location: 'Black Whale · Room 1014 / Woble household',
    tracks: ['kurapika', 'oito', 'woble', 'succession-contest', 'room-1014'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-provisional-hunter-risk',
    title: 'Kurapika identifies approximately 150 Provisional Hunters on Tier 1 as an unknown security variable',
    detail: 'Kurapika reasons that the Provisional Hunters hired through Kakin may have been kept ignorant of their real assignments, which could explain why they passed his Dowsing Chain screening. He worries that roughly 150 may now be moving around Tier 1 under undisclosed missions.',
    location: 'Black Whale · Tier 1',
    tracks: ['kurapika', 'provisional-hunters', 'dowsing-chain', 'tier-1', 'security'],
    confidence: 'The approximately 150 figure and hidden-mission concern are Kurapika’s assessment in the supplied text, not a complete confirmed roster of hostile agents',
  }),
  timelineEvent({
    id: 'pre-voyage-358-lower-tier-crime-medical-crisis',
    title: 'Mizaistom reports lower-tier crime and medical capacity far worse than planned',
    detail: 'Mizaistom tells Kurapika that crime on Tiers 3 and 4 is rising through fights, suspected ticket fraud, theft, and related disorder. He and Botobai are assisting military/private-security command. The bottom three tiers have only five clinics, Tier 5 has no dedicated doctor, and only a fraction of the expected doctors boarded, forcing Cheadle to reorganize staffing.',
    location: 'Black Whale · Tiers 3–5',
    tracks: ['mizaistom', 'botobai', 'cheadle', 'crime', 'medical-capacity', 'lower-tiers'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-emergency-escape-route',
    title: 'Kurapika identifies the Tier 2–3 emergency bulkhead as a possible escape route',
    detail: 'Kurapika proposes that a fire, riot, or comparable emergency could force the Tier 2–3 bulkhead open. Oito and Woble might then slip through the checkpoint and blend into the general passenger population on the lower tiers.',
    location: 'Black Whale · proposed Tier 2→3 evacuation route',
    tracks: ['kurapika', 'oito', 'woble', 'bulkhead', 'escape-plan', 'lower-tiers'],
    confidence: 'This is Kurapika’s contingency proposal, not a tested or guaranteed escape route',
  }),
  timelineEvent({
    id: 'pre-voyage-358-oito-renews-hope',
    title: 'Oito shifts from expecting death to recognizing a possible survival route',
    detail: 'Oito becomes emotionally overwhelmed because she had prepared herself to die during the voyage and had not seriously imagined survival. Kurapika tells her to rest and says he will handle the planning.',
    location: 'Black Whale · Room 1014 / Woble household',
    tracks: ['oito', 'kurapika', 'woble', 'survival'],
  }),
  timelineEvent({
    id: 'pre-voyage-358-woble-cradle-aura',
    title: 'Kurapika senses unexplained aura rising from Woble’s cradle',
    detail: 'As Oito and Woble are taken toward their sleeping quarters, Kurapika suddenly senses aura emanating from Woble’s cradle. He turns but sees nothing visibly abnormal and does not identify the source in Chapter 358.',
    location: 'Black Whale · Room 1014 / Woble cradle',
    tracks: ['kurapika', 'woble', 'aura', 'nen', 'mystery'],
    confidence: 'The chapter confirms the sensed aura only; its source, user, type, and relationship to Woble are left unresolved',
  }),
]);

export const succession358TierRecords = freeze([
  freeze({ tier: 1, population: 'Kakin royal family, V6 politicians, industry dignitaries', successionZone: true, access: 'Royal Army controlled', notes: 'Royal residences and Sunday banquet activity are concentrated here.', source }),
  freeze({ tier: 2, population: 'Celebrities and wealthy passengers', successionZone: true, access: 'Royal Army controlled', notes: 'Controls the emergency-open side of the Tier 2–3 bulkhead.', source }),
  freeze({ tier: 3, population: 'General passengers', successionZone: false, access: 'Separated from Tier 2 by emergency bulkhead', notes: 'Crime already higher than anticipated before departure.', source }),
  freeze({ tier: 4, population: 'General passengers', successionZone: false, access: 'Royal Army / ship security', notes: 'Crime already higher than anticipated before departure.', source }),
  freeze({ tier: 5, population: 'General passengers', successionZone: false, access: 'Royal Army / ship security', notes: 'No dedicated doctor according to Mizaistom’s report.', source }),
]);

export const succession358SecurityAssignments = freeze([
  freeze({ subject: 'Benjamin personal soldiers', people: 'Balsamilco and Benjamin’s guard force', assignment: 'Operate as guards aboard ship; reserve military posture until disembarkation unless Operation Assault is authorized', status: 'active at boarding', source }),
  freeze({ subject: 'Lower-tier security response', people: 'Mizaistom Nana and Botobai Gigante', assignment: 'Assist the military by taking command responsibilities within the ship’s private-security response as disorder rises', status: 'active at boarding', source }),
  freeze({ subject: 'Medical reorganization', people: 'Cheadle Yorkshire and newly hired medical staff', assignment: 'Reorganize medical coverage after severe staffing and clinic shortfalls become apparent', status: 'active at boarding', source }),
]);

export const succession358RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Queen Oito & Woble',
    type: 'Protection / emergency evacuation planning',
    note: 'Kurapika expands the Chapter 350 protection contract into a concrete contingency: exploit a genuine emergency to cross the Tier 2–3 bulkhead and blend Oito and Woble into the general passenger population.',
    phase: 'Boarding',
    chapters: '350–current',
    state: 'active contingency',
    source,
  }),
  freeze({
    from: 'Balsamilco Might',
    to: 'Benjamin’s personal soldiers',
    type: 'Operational command doctrine',
    note: 'Balsamilco orders the soldiers to function as restrained guards on the ship and keeps Operation Assault as a conditional escalation option.',
    phase: 'Boarding',
    chapters: '358–current',
    state: 'active',
    source,
  }),
]);

export const succession358ObjectRecords = freeze([
  freeze({
    name: 'Tier 2–3 emergency bulkhead',
    note: 'Thick barrier separating the elite upper tiers from general-passenger Tier 3. It can be opened only from the Tier 2 side during emergencies and becomes the physical basis of Kurapika’s proposed Oito/Woble evacuation route.',
    source,
  }),
]);

export const succession358Mysteries = freeze([
  freeze({
    question: 'What is the aura Kurapika senses from Woble’s cradle?',
    evidence: 'Chapter 358 ends with Kurapika sensing aura rising from Woble’s cradle while seeing nothing visibly abnormal. The chapter does not identify its source, owner, type, or purpose.',
    status: 'open',
    lastChapter: '358',
    source,
  }),
  freeze({
    question: 'Can Kurapika actually move Oito and Woble through the Tier 2–3 bulkhead?',
    evidence: 'Kurapika identifies a fire, riot, or other emergency as a possible trigger that would open the barrier and create cover, but the route is only a contingency and has not been tested.',
    status: 'developing',
    lastChapter: '358',
    source,
  }),
  freeze({
    question: 'What missions are the roughly 150 Provisional Hunters on Tier 1 actually carrying out?',
    evidence: 'Kurapika worries that about 150 Provisional Hunters may be moving through Tier 1 under undisclosed assignments and that ignorance of their real missions may have allowed them to pass his screening.',
    status: 'open',
    lastChapter: '358',
    source,
  }),
]);

const focus = 'Departure day turns the Black Whale into a controlled five-tier society under martial law: Tiers 1–2 form the succession hunting zone, a one-way emergency bulkhead isolates Tier 3, Balsamilco orders Benjamin’s soldiers to act as guards, Kurapika maps the unknown Provisional Hunter presence and proposes using an emergency opening to move Oito and Woble into the general population, and the chapter closes when he senses unexplained aura rising from Woble’s cradle.';

export const succession358ChapterResearch = freeze([
  freeze({
    number: 358,
    title: 'Eve',
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Boarding',
    voyageDay: 'Pre-voyage / departure ceremony',
    lanes: freeze([
      'Black Whale boarding',
      'Five-tier structure',
      'Martial law',
      'Benjamin security doctrine',
      'Kurapika / Oito / Woble',
      'Lower-tier disorder',
      'Provisional Hunters',
      'Unexplained aura',
    ]),
    focus,
    events: succession358TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Gantai', 'Tamazo', 'Nasubi Hui Guo Rou', 'Beyond Netero', 'Kakin Royal Family',
      'Benjamin Hui Guo Rou', 'Balsamilco Might', 'Kurapika', 'Queen Oito Hui Guo Rou', 'Woble Hui Guo Rou',
      'Mizaistom Nana', 'Botobai Gigante', 'Cheadle Yorkshire', 'Tserriednich Hui Guo Rou',
      'Kakin Royal Army', 'Provisional Hunters',
    ]),
    locations: freeze([
      'Kakin port · Black Whale departure site',
      'Black Whale · Tier 1',
      'Black Whale · Tier 2',
      'Black Whale · Tier 2 / Tier 3 bulkhead',
      'Black Whale · Tiers 3–5',
      'Black Whale · Room 1014 / Woble household',
    ]),
    threadLabels: freeze([
      'Black Whale', 'Boarding', 'Martial law', 'Tier structure', 'Succession hunting grounds',
      'Benjamin', 'Operation Assault', 'Kurapika', 'Oito', 'Woble', 'Escape route',
      'Provisional Hunters', 'Lower-tier disorder', 'Woble aura',
    ]),
    tiers: succession358TierRecords,
    securityAssignments: succession358SecurityAssignments,
    relationships: succession358RelationshipRecords,
    objects: succession358ObjectRecords,
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 358 text',
      'The English title Eve is retained from the repository chapterTitles dataset already transcribed from Hunterpedia; Japanese/romanized title data were not supplied in the current message and are left unset',
      'Only Tiers 1 and 2 are stored as succession “hunting grounds” because that is how the supplied chapter notes define the bulkhead boundary',
      'The approximately 150 Provisional Hunters and their possible secret missions are Kurapika’s risk assessment, not a confirmed roster of hostile actors',
      'Kurapika’s Tier 2→3 evacuation route is a contingency, not an established escape path',
      'The aura from Woble’s cradle is not labeled as Woble’s Guardian Spirit Beast or any specific ability because Chapter 358 does not identify it',
    ]),
    status: 'Maintained chapter summary, chronology, Black Whale tier structure, martial-law controls, security assignments, Sunday banquet schedule, Oito/Woble evacuation contingency, Provisional Hunter risk, unexplained aura mystery, relationships, objects, and source confidence linked',
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
    titleStatus: 'maintained-project-metadata-plus-user-supplied-hunterpedia-story-text',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession358ChapterFocus = freeze({ 358: focus });
