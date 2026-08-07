const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_346';
const referenceImage = '/media/succession-contest/chapters/346/zodiac-roles-reference.svg';

export const succession346SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleTextSource: freeze({
    label: 'Hunterpedia Chapter 346',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  userMedia: freeze({
    label: "Overview of the Zodiacs' Roles on the Dark Continent Expedition",
    path: referenceImage,
    basis: 'User-supplied reference image; recreated as an in-repo SVG and transcribed into structured assignment records',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location,
  tracks,
  time = 'Pre-voyage · Zodiac expedition organization',
  confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes',
}) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 346,
  confidence,
  source,
});

export const succession346TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-346-kurapika-leorio-zodiac-arrival',
    title: 'Kurapika enters the Zodiac meeting as the Rat while Leorio becomes the Boar',
    detail: 'Kurapika and Mizaistom arrive at the Hunter Association office and are greeted by Leorio and Cheadle before joining the full Zodiac meeting. The supplied chapter notes identify Kurapika’s Zodiac codename as Rat and Leorio’s as Boar.',
    location: 'Hunter Association · Zodiac meeting area',
    tracks: ['kurapika', 'leorio', 'zodiacs', 'hunter-association'],
  }),
  timelineEvent({
    id: 'pre-voyage-346-v5-becomes-v6',
    title: 'Kakin formally joins the V5 framework as the sixth member',
    detail: 'Cheadle tells the Zodiacs that the previous V5 has become the V6, with the Kakin Empire admitted as the sixth member in response to the Dark Continent expedition crisis.',
    location: 'Hunter Association · Zodiac meeting area',
    tracks: ['v6', 'kakin', 'zodiacs', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-346-five-threat-ranks',
    title: 'The Five Threats are ranked above the Chimera Ants',
    detail: 'Cheadle reviews the Five Threats and the failure of previous expeditions. The supplied chapter notes place the Five Threats between B+ and A danger rank, all above the Chimera Ants at rank B.',
    location: 'Hunter Association · Zodiac meeting area',
    tracks: ['five-threats', 'chimera-ants', 'zodiacs', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-346-zodiac-mission-objective',
    title: 'Cheadle defines the expedition objective around survival, a captured threat, and Beyond',
    detail: 'Cheadle states that the Zodiacs must reach the Dark Continent, capture at least one of the Five Threats, survive the return trip, and deal with Beyond Netero during the operation.',
    location: 'Hunter Association · Zodiac meeting area',
    tracks: ['zodiacs', 'five-threats', 'beyond', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-346-kurapika-beyond-allies',
    title: 'Kurapika argues that Beyond prepared allies inside the Hunter Association',
    detail: 'Kurapika reasons that Beyond expected Isaac Netero’s death and therefore had time to prepare support within the Hunter Association. He identifies Pariston and Temp Hunters as known parts of Beyond’s network and raises the possibility of further internal collaborators.',
    location: 'Hunter Association · Zodiac meeting area',
    tracks: ['kurapika', 'beyond', 'pariston', 'temp-hunters', 'hunter-association'],
    confidence: 'Kurapika’s conclusion about deeper Association infiltration is his analysis; Pariston and Temp Hunter involvement are treated as the concrete supporting examples supplied in the chapter',
  }),
  timelineEvent({
    id: 'pre-voyage-346-mizaistom-zodiac-mole-warning',
    title: 'Mizaistom privately confirms that he and Cheadle suspect a mole among the Zodiacs',
    detail: 'Mizaistom takes Kurapika aside and says that he and Cheadle reached the same conclusion about internal infiltration. He asks Kurapika not to mention a Zodiac mole in the meeting again because doing so could alert the spy. Kurapika agrees to keep the suspicion concealed.',
    location: 'Hunter Association · outside Zodiac meeting room',
    tracks: ['mizaistom', 'cheadle', 'kurapika', 'zodiacs', 'counterintelligence'],
    confidence: 'The suspicion is confirmed as Mizaistom and Cheadle’s internal assessment; the identity and existence of a specific mole are not independently resolved in this chapter',
  }),
  timelineEvent({
    id: 'pre-voyage-346-zodiac-team-assignments',
    title: 'The Zodiacs divide into Science, Intelligence, Defense, and Flora/Fauna teams',
    detail: 'The Zodiacs assign expedition responsibilities across four functional teams. The user-supplied role table preserves each member’s task, including medical preparation, candidate screening, passenger-list analysis, Beyond supervision, post-landing defense, and flora/fauna work.',
    location: 'Hunter Association · Zodiac meeting area',
    tracks: ['zodiacs', 'science-team', 'intelligence-team', 'defense-team', 'flora-fauna-team'],
  }),
  timelineEvent({
    id: 'pre-voyage-346-knov-morel-support-route',
    title: 'Knov and Morel define the expedition support handoff beyond the fake New Continent',
    detail: 'Knov says the pretend New Continent will be the limit of how far he can accompany the expedition. Morel and his team are assigned the ocean traversal between the New Continent and the Gate.',
    location: 'Dark Continent route planning · New Continent to Gate',
    tracks: ['knov', 'morel', 'expedition', 'gate', 'new-continent'],
  }),
  timelineEvent({
    id: 'pre-voyage-346-ging-pip-play-curly',
    title: 'One month later, Ging demonstrates Pip-Play and wins Curly over',
    detail: 'One month after the Zodiac meeting, Ging demonstrates a Nen-based trick identified as Pip-Play to Beyond’s expedition members. Curly then challenges Ging to an Ancient Kappe vocabulary contest, loses, and accepts both Ging’s money and his No. 2 position.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'curly', 'nen', 'ancient-kappe', 'expedition'],
    time: 'One month after the Zodiac meeting',
  }),
  timelineEvent({
    id: 'pre-voyage-346-hunter-exam-assassins-fail',
    title: 'The 289th Hunter Exam ends with Beyond’s assassins rejected by Kurapika',
    detail: 'Pariston reports that all assassins sent into the 289th Hunter Exam failed. The supplied notes say Kurapika eliminated them through a lie-detecting test. Muherr and two other participants arrive early, and Muherr says he did not need to wait for the official result to know he had failed. A rumor circulates that Kurapika can read minds.',
    location: 'Beyond Netero expedition team · base / 289th Hunter Exam aftermath',
    tracks: ['kurapika', 'hunter-exam', 'pariston', 'muherr', 'temp-hunters'],
    time: 'One month after the Zodiac meeting · 289th Hunter Exam aftermath',
    confidence: 'Kurapika failing the assassins through lie detection is supplied as chapter fact; the claim that he can read minds is stored only as a rumor repeated by exam participants',
  }),
  timelineEvent({
    id: 'pre-voyage-346-pariston-beyond-escape-expectation',
    title: 'Pariston says Beyond has no planned extraction and expects him to escape on his own',
    detail: 'Pariston says he does not currently have an escape plan for Beyond. He expects Beyond to break free by himself after reaching the pretend New Continent and then rendezvous with the expedition team.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['pariston', 'beyond', 'new-continent', 'expedition'],
    time: 'One month after the Zodiac meeting',
  }),
  timelineEvent({
    id: 'pre-voyage-346-ging-freedom-alignment',
    title: 'Ging says he supports Beyond’s freedom while opposing Pariston',
    detail: 'When challenged over his allegiance, Ging says he is closer to Beyond than to the Hunter Association when it comes to freedom on the Dark Continent. He defines his position as helping Beyond while stopping Pariston.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'beyond', 'pariston', 'hunter-association'],
    time: 'One month after the Zodiac meeting',
  }),
  timelineEvent({
    id: 'pre-voyage-346-four-option-standoff',
    title: 'Muherr’s group forces a Ging-versus-Pariston choice and receives two counter-options',
    detail: 'Temp Hunter participants aligned with Muherr present two options: Pariston leaves the expedition team or Ging leaves. Neither accepts. Ging proposes a third option, that the assassins leave, while Pariston proposes a fourth, that the assassins die.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'muherr', 'temp-hunters', 'expedition'],
    time: 'One month after the Zodiac meeting',
  }),
]);

export const succession346ReferenceImages = freeze([
  freeze({
    src: referenceImage,
    alt: "Overview of the Zodiacs' roles on the Dark Continent expedition, listing each member, team, and task",
    caption: "User-supplied Zodiac expedition-role table, preserved as an in-repo visual and transcribed into structured Chapter 346 assignment data.",
    provenance: 'User-supplied reference image',
  }),
]);

export const succession346ZodiacRoles = freeze([
  freeze({ name: 'Cheadle Yorkshire', team: 'Science', tasks: freeze(['Organize a top medical team', 'Recruit talented people for the trip through the Hunter Exam']), source, visualSource: referenceImage }),
  freeze({ name: 'Gel', team: 'Science', tasks: freeze(['Write disease control procedures with Sanbica']), source, visualSource: referenceImage }),
  freeze({ name: 'Leorio Paradinight', team: 'Science', tasks: freeze(["Support Cheadle's medical team"]), source, visualSource: referenceImage }),
  freeze({ name: 'Mizaistom Nana', team: 'Intelligence', tasks: freeze(['Perform background checks of candidates', 'Negotiate to obtain the passenger list of the Black Whale No. 1']), source, visualSource: referenceImage }),
  freeze({ name: 'Pyon', team: 'Intelligence', tasks: freeze(['Program a language analysis software', 'Prioritize confirming and reorganizing the passenger-list data once obtained']), source, visualSource: referenceImage }),
  freeze({ name: 'Saccho Kobayakawa', team: 'Intelligence', tasks: freeze(['Perform background checks of candidates']), source, visualSource: referenceImage }),
  freeze({ name: 'Kurapika', team: 'Intelligence', tasks: freeze(['Offer confidential information about Beyond and Kakin']), source, visualSource: referenceImage }),
  freeze({ name: 'Botobai Gigante', team: 'Defense', tasks: freeze(['Negotiate to obtain the passenger list of the Black Whale No. 1', "Secretly cooperate with the Intelligence Team to create a post-landing defense strategy and a plan to prevent Beyond's escape"]), source, visualSource: referenceImage }),
  freeze({ name: 'Saiyu', team: 'Defense', tasks: freeze(['Supervise Beyond']), source, visualSource: referenceImage }),
  freeze({ name: 'Kanzai', team: 'Defense', tasks: freeze(['Get rid of anything that may attack the expedition on the Dark Continent']), source, visualSource: referenceImage }),
  freeze({ name: 'Cluck', team: 'Flora/Fauna', tasks: freeze(['Gather intelligence and plants after landing']), source, visualSource: referenceImage }),
  freeze({ name: 'Ginta', team: 'Flora/Fauna', tasks: freeze(['Find someone with abilities similar to Knov']), source, visualSource: referenceImage }),
]);

export const succession346ZodiacTeams = freeze([
  freeze({ team: 'Science', members: freeze(['Cheadle Yorkshire', 'Gel', 'Leorio Paradinight']) }),
  freeze({ team: 'Intelligence', members: freeze(['Mizaistom Nana', 'Pyon', 'Saccho Kobayakawa', 'Kurapika']) }),
  freeze({ team: 'Defense', members: freeze(['Botobai Gigante', 'Saiyu', 'Kanzai']) }),
  freeze({ team: 'Flora/Fauna', members: freeze(['Cluck', 'Ginta']) }),
]);

export const succession346ZodiacCodenames = freeze([
  freeze({ person: 'Kurapika', codename: 'Rat', chapter: 346, source }),
  freeze({ person: 'Leorio Paradinight', codename: 'Boar', chapter: 346, source }),
]);

export const succession346ThreatRanking = freeze({
  fiveThreats: 'B+ to A',
  chimeraAnts: 'B',
  comparison: 'All Five Threats are ranked above the Chimera Ants in the supplied chapter notes',
  source,
});

export const succession346TravelSupport = freeze([
  freeze({ person: 'Knov', assignment: 'Accompany the expedition only as far as the pretend New Continent', source }),
  freeze({ person: 'Morel Mackernasey and team', assignment: 'Handle the ocean traversal between the New Continent and the Gate', source }),
]);

export const succession346HunterExamRecord = freeze({
  exam: '289th Hunter Exam',
  status: 'ended',
  beyondAssassins: 'All failed',
  filter: 'Kurapika’s lie-detecting test',
  rumor: 'Exam participants say Kurapika is rumored to read minds; stored as rumor rather than confirmed ability description',
  source,
});

export const succession346AbilityRecords = freeze([
  freeze({
    user: 'Ging Freecss',
    ability: 'Pip-Play',
    type: 'Nen-based aura trick / technique; exact category not supplied',
    mechanics: 'Ging demonstrates a Nen-based trick called Pip-Play to Beyond’s expedition team, and other members attempt to master it.',
    chapters: '346',
    conditions: 'The supplied text does not establish the full rules, Nen category, combat application, or whether Pip-Play is a formal Hatsu rather than an aura-control exercise.',
    source,
  }),
]);

export const succession346RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Mizaistom Nana & Cheadle Yorkshire',
    type: 'Covert counterintelligence cooperation',
    note: 'Kurapika independently reaches the same concern about Beyond-linked infiltration; Mizaistom says he and Cheadle also suspect a Zodiac mole and asks Kurapika to keep the suspicion concealed.',
    phase: 'Pre-voyage expedition organization',
    chapters: '346–current',
    state: 'covert',
    source,
  }),
  freeze({
    from: 'Ging Freecss',
    to: 'Beyond Netero',
    type: 'Conditional ideological alignment',
    note: 'Ging says his desire for freedom on the Dark Continent puts him closer to Beyond than to the Hunter Association, while still defining Pariston as the person he intends to stop.',
    phase: 'Pre-voyage expedition preparation',
    chapters: '346–current',
    state: 'conditional',
    source,
  }),
]);

export const succession346StandoffOptions = freeze([
  freeze({ number: 1, proposedBy: 'Muherr-aligned Temp Hunters', option: 'Pariston leaves the expedition team' }),
  freeze({ number: 2, proposedBy: 'Muherr-aligned Temp Hunters', option: 'Ging leaves the expedition team' }),
  freeze({ number: 3, proposedBy: 'Ging Freecss', option: 'The assassins leave' }),
  freeze({ number: 4, proposedBy: 'Pariston Hill', option: 'The assassins die' }),
]);

const focus = 'The reorganized V6 and Zodiacs formalize the Dark Continent mission, rank the Five Threats above the Chimera Ants, divide the Zodiacs into four functional expedition teams, and quietly confront the possibility of a Beyond-linked mole; one month later Ging wins more acceptance inside Beyond’s team, the 289th Hunter Exam blocks Beyond’s assassins through Kurapika’s screening, Pariston expects Beyond to escape by himself at the fake New Continent, and Muherr’s faction triggers a four-option Ging-versus-Pariston standoff.';

export const succession346ChapterResearch = freeze([
  freeze({
    number: 346,
    title: 'Options',
    japaneseTitle: 'せんたく',
    romanizedTitle: 'Sentaku',
    suppliedTitleMarker: '}',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Zodiac organization',
      'V6 / Kakin',
      'Five Threats',
      'Counterintelligence',
      'Dark Continent logistics',
      '289th Hunter Exam',
      'Ging & Pariston',
      'Beyond expedition team',
      'Nen technique',
    ]),
    focus,
    events: succession346TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Mizaistom Nana', 'Leorio Paradinight', 'Cheadle Yorkshire', 'Gel', 'Pyon', 'Saccho Kobayakawa',
      'Botobai Gigante', 'Saiyu', 'Kanzai', 'Cluck', 'Ginta', 'Knov', 'Morel Mackernasey', 'Ging Freecss', 'Pariston Hill',
      'Curly', 'Muherr', 'Usamen', 'Beyond Netero', 'Zodiacs', 'Dark Continent Expedition Team',
    ]),
    locations: freeze([
      'Hunter Association · Zodiac meeting area',
      'Hunter Association · outside Zodiac meeting room',
      'Dark Continent route planning · New Continent to Gate',
      'Beyond Netero expedition team · base',
      '289th Hunter Exam aftermath',
    ]),
    threadLabels: freeze([
      'Zodiacs', 'Kurapika', 'Beyond Netero', 'V6', 'Five Threats', 'Counterintelligence', 'Ging & Pariston',
      'Temp Hunters', 'Hunter Exam', 'Expedition logistics', 'Nen development',
    ]),
    referenceImages: succession346ReferenceImages,
    zodiacRoles: succession346ZodiacRoles,
    zodiacTeams: succession346ZodiacTeams,
    zodiacCodenames: succession346ZodiacCodenames,
    threatRanking: succession346ThreatRanking,
    travelSupport: succession346TravelSupport,
    hunterExam: succession346HunterExamRecord,
    abilities: succession346AbilityRecords,
    relationships: succession346RelationshipRecords,
    standoffOptions: succession346StandoffOptions,
    confidence: freeze([
      'All prose details derive only from the user-supplied Hunterpedia Chapter 346 text',
      'The Zodiac role matrix is transcribed from the user-supplied reference image and preserved as an in-repo visual',
      'The Five Threat danger ranking is stored as B+ to A, with the Chimera Ants at B, following the supplied chapter notes',
      'Kurapika’s belief in deeper Beyond-linked Association allies is stored as his analysis; Mizaistom and Cheadle’s Zodiac-mole concern is stored as a concealed suspicion, not a resolved identity',
      'Ging’s Pip-Play is stored as a Nen-based trick/technique because the supplied text does not establish whether it is a formal Hatsu or its exact category',
      'The rumor that Kurapika can read minds is preserved as rumor; the supplied chapter notes specifically describe the Hunter Exam filter as a lie-detecting test',
      'Pariston explicitly says he has no current escape plan for Beyond and expects Beyond to escape by himself after reaching the pretend New Continent',
      'The four standoff options are preserved by proposer rather than treated as accepted outcomes',
    ]),
    status: 'Maintained chapter summary, chronology, appearances, locations, Zodiac team/codename assignments, role-table visual, Five Threat ranking, counterintelligence suspicion, route-support logistics, 289th Hunter Exam outcome, Pip-Play Nen record, Ging/Pariston alignment, standoff options, and source confidence linked',
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
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
    crossChecks: freeze([succession346SourcePolicy.soleTextSource, succession346SourcePolicy.userMedia]),
  }),
]);

export const succession346ChapterFocus = freeze({ 346: focus });
export const succession346Mysteries = freeze([
  freeze({
    question: 'Beyond-linked mole among the Zodiacs',
    evidence: 'Kurapika raises the possibility of deeper Association allies, and Mizaistom privately says that he and Cheadle also suspect a mole among the Zodiacs but do not want to alert that person.',
    status: 'open',
    lastChapter: '346',
    source,
  }),
  freeze({
    question: 'Beyond’s escape at the pretend New Continent',
    evidence: 'Pariston says he has no extraction plan and expects Beyond to escape by himself after reaching the pretend New Continent, leaving the method and timing unresolved.',
    status: 'developing',
    lastChapter: '346',
    source,
  }),
]);
