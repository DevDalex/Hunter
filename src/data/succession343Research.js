const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_343';

export const succession343SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 343',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location,
  tracks,
  confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes',
}) => freeze({
  id,
  time: 'Pre-voyage · expedition recruitment phase',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 343,
  confidence,
  source,
});

export const succession343TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-343-cheadle-invites-leorio',
    title: 'Cheadle invites Leorio to join the Zodiacs',
    detail: 'Cheadle contacts Leorio and offers him one of the vacant Zodiac seats. She ties the invitation to the reputation he built inside the Hunter Association and offers him continued medical study during the Dark Continent expedition under her own medical leadership.',
    location: 'Remote call · Hunter Association recruitment',
    tracks: ['zodiacs', 'leorio', 'expedition', 'hunter-association'],
  }),
  timelineEvent({
    id: 'pre-voyage-343-leorio-recommends-kurapika',
    title: 'Leorio accepts and recommends Kurapika for the second vacancy',
    detail: 'Leorio accepts Cheadle’s offer and asks whether another Zodiac seat remains open. He recommends Kurapika for the second vacancy, directly connecting Kurapika’s return to Hunter Association politics with the Dark Continent expedition.',
    location: 'Remote call · Hunter Association recruitment',
    tracks: ['zodiacs', 'leorio', 'kurapika', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-343-pariston-hunter-exam-plan',
    title: 'Pariston anticipates Cheadle using the Hunter Exam to recruit expedition personnel',
    detail: 'Inside Beyond’s expedition team, Pariston predicts that Cheadle will use the upcoming Hunter Exam to recruit the personnel needed for the Hunter Association to operate independently during the voyage. He also notes that his own subordinates could pass the Exam and enter the Association.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['pariston', 'ging', 'hunter-association', 'hunter-exam', 'expedition'],
    confidence: 'Pariston’s prediction about Cheadle’s recruitment strategy and his subordinates entering through the Hunter Exam is preserved as his stated expectation',
  }),
  timelineEvent({
    id: 'pre-voyage-343-ging-pariston-motive-analysis',
    title: 'Ging analyzes Pariston’s destructive attachment to the Association',
    detail: 'Ging argues that Pariston seeks stimulation by creating new routes to conflict: opening formerly illegal access to the Dark Continent, potentially scattering Chimera Ants, and introducing his own people into the Hunter Association. Pariston concedes that Ging has correctly identified his underlying psychology and admits that he feels happiness when hated and wants to hurt things he loves.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'hunter-association', 'chimera-ants', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-343-ging-team-rank-challenge',
    title: 'Ging challenges Beyond’s team hierarchy',
    detail: 'After Usamen threatens him, Ging physically controls the confrontation before it becomes a fight. He asks whether Marione is the highest-ranked member because he judges her to be the strongest, then learns that team rank is not determined by combat strength. Pariston identifies himself as the current No. 2, after which Ging declares himself the new No. 2 and challenges anyone who objects.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'beyond', 'expedition'],
    confidence: 'Pariston’s No. 2 position is stated in the supplied chapter notes; Marione being strongest is Ging’s assessment, and Ging becoming No. 2 is presented as his declaration rather than independently confirmed formal rank assignment',
  }),
  timelineEvent({
    id: 'pre-voyage-343-mizaistom-cross-game',
    title: 'Mizaistom restrains attackers with Cross Game',
    detail: 'While searching for Kurapika, Mizaistom is blocked by three men. He displays a warning card forbidding violence; when they attack, he uses his card-based ability to restrain their movement. The supplied chapter notes identify the ability as Cross Game.',
    location: 'Kurapika’s current base · public room',
    tracks: ['mizaistom', 'kurapika', 'nen', 'zodiacs'],
    confidence: 'The chapter notes identify Cross Game and its movement-restraint effect; the supplied text does not fully define its card rules, activation conditions, or Nen category',
  }),
  timelineEvent({
    id: 'pre-voyage-343-mizaistom-invites-kurapika',
    title: 'Mizaistom invites Kurapika to join the Zodiacs',
    detail: 'Mizaistom meets Kurapika on Leorio’s recommendation and invites him to fill the remaining Zodiac vacancy. Kurapika initially refuses because he is occupied with his own work.',
    location: 'Kurapika’s current base · meeting area',
    tracks: ['mizaistom', 'kurapika', 'leorio', 'zodiacs'],
  }),
  timelineEvent({
    id: 'pre-voyage-343-tserriednich-scarlet-eyes',
    title: 'Tserriednich is identified as the holder of multiple Scarlet Eyes',
    detail: 'Mizaistom reveals that Hunter Association intelligence has identified the owner of a large collection of Scarlet Eyes that Kurapika had been unable to trace. He shows Kurapika the target: Tserriednich Hui Guo Rou, Fourth Prince of the Kakin Empire.',
    location: 'Kurapika’s current base · meeting area',
    tracks: ['kurapika', 'tserriednich', 'scarlet-eyes', 'kakin', 'zodiacs'],
  }),
  timelineEvent({
    id: 'pre-voyage-343-kurapika-joins-zodiacs',
    title: 'Kurapika joins the Zodiacs',
    detail: 'The revelation that Tserriednich possesses multiple Scarlet Eyes changes Kurapika’s decision. He accepts the route offered through the Hunter Association and joins the Zodiacs, aligning his personal recovery objective with the Dark Continent expedition.',
    location: 'Kurapika’s current base · meeting area',
    tracks: ['kurapika', 'tserriednich', 'zodiacs', 'expedition', 'scarlet-eyes'],
  }),
]);

export const succession343AbilityRecords = freeze([
  freeze({
    user: 'Mizaistom Nana',
    ability: 'Cross Game',
    type: 'Nen ability · exact category not supplied',
    mechanics: 'Uses colored or warning cards to impose a movement-restraint effect after targets proceed with prohibited violence.',
    chapters: '343',
    conditions: 'The supplied chapter shows a warning card and subsequent restraint after the men attack; exact card-color meanings, complete activation conditions, range, and Nen category are not established here.',
    source,
  }),
]);

export const succession343RelationshipRecords = freeze([
  freeze({
    from: 'Cheadle Yorkshire',
    to: 'Leorio Paradinight',
    type: 'Zodiac recruitment',
    note: 'Cheadle recruits Leorio into the Zodiacs and offers him continued medical study under her expedition medical team.',
    phase: 'Pre-voyage expedition recruitment',
    chapters: '343',
    state: 'active',
    source,
  }),
  freeze({
    from: 'Leorio Paradinight',
    to: 'Kurapika',
    type: 'Zodiac recommendation',
    note: 'After accepting his own Zodiac seat, Leorio recommends Kurapika for the second vacant position.',
    phase: 'Pre-voyage expedition recruitment',
    chapters: '343',
    state: 'completed',
    source,
  }),
  freeze({
    from: 'Kurapika',
    to: 'Tserriednich Hui Guo Rou',
    type: 'Scarlet Eyes recovery target',
    note: 'Kurapika learns that Fourth Prince Tserriednich possesses a large number of Scarlet Eyes, giving Kurapika a direct personal objective inside the Kakin expedition.',
    phase: 'Pre-voyage expedition recruitment',
    chapters: '343–current',
    state: 'active',
    source,
  }),
]);

export const succession343MembershipChanges = freeze([
  freeze({ person: 'Leorio Paradinight', organization: 'Zodiacs', change: 'joins', basis: 'Cheadle invitation accepted', chapter: 343, source }),
  freeze({ person: 'Kurapika', organization: 'Zodiacs', change: 'joins', basis: 'Leorio recommendation and Mizaistom recruitment after Tserriednich intelligence is revealed', chapter: 343, source }),
]);

export const succession343TeamRankNotes = freeze([
  freeze({ person: 'Pariston Hill', team: 'Beyond Netero expedition team', rank: 'No. 2', status: 'stated current rank', chapter: 343, source }),
  freeze({ person: 'Ging Freecss', team: 'Beyond Netero expedition team', rank: 'No. 2', status: 'self-declared challenge', chapter: 343, source }),
  freeze({ person: 'Marione', team: 'Beyond Netero expedition team', rank: null, status: 'Ging assesses her as the strongest member; not stored as an objective power-ranking fact', chapter: 343, source }),
]);

const focus = 'Cheadle recruits Leorio into the Zodiacs and Leorio recommends Kurapika for the second vacancy; Ging exposes Pariston’s destructive attachment to the Hunter Association and challenges Beyond’s team hierarchy; Mizaistom demonstrates Cross Game while recruiting Kurapika; and Kurapika joins the Zodiacs after learning that Fourth Prince Tserriednich possesses a large collection of Scarlet Eyes.';

export const succession343ChapterResearch = freeze([
  freeze({
    number: 343,
    title: 'Invitation',
    japaneseTitle: 'たんゆう',
    romanizedTitle: "Kan'yu",
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Zodiac recruitment',
      'Kurapika / Scarlet Eyes',
      'Ging & Pariston',
      'Beyond expedition team',
      'Hunter Exam',
      'Nen abilities',
    ]),
    focus,
    events: succession343TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Cheadle Yorkshire',
      'Leorio Paradinight',
      'Kurapika',
      'Mizaistom Nana',
      'Tserriednich Hui Guo Rou',
      'Ging Freecss',
      'Pariston Hill',
      'Curly',
      'Usamen',
      'Marione',
      'Linssen',
      'Beyond Netero',
      'Zodiacs',
      'Dark Continent Expedition Team',
    ]),
    locations: freeze([
      'Remote call · Hunter Association recruitment',
      'Beyond Netero expedition team · base',
      'Kurapika’s current base · public room',
      'Kurapika’s current base · meeting area',
    ]),
    threadLabels: freeze([
      'Kurapika & Scarlet Eyes',
      'Tserriednich',
      'Zodiacs',
      'Leorio',
      'Ging & Pariston',
      'Beyond expedition team',
      'Hunter Association',
      'Nen development',
    ]),
    abilities: succession343AbilityRecords,
    relationships: succession343RelationshipRecords,
    membershipChanges: succession343MembershipChanges,
    teamRankNotes: succession343TeamRankNotes,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 343 text',
      'Cross Game is stored as Mizaistom’s movement-restraint Nen ability because the supplied chapter notes identify it by name; its full rules and Nen category remain unspecified',
      'Marione being the strongest member is stored only as Ging’s assessment',
      'Ging’s No. 2 status is stored as a self-declared challenge, while Pariston is identified as the current No. 2 in the supplied chapter notes',
      'Pariston’s Hunter Exam recruitment scenario is preserved as his prediction rather than a completed Cheadle policy in this chapter',
      'The supplied title text displays the Japanese reading as たんゆう and the romanization as Kan’yu; both are retained without external correction',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, Zodiac membership changes, Scarlet Eyes relationship, Cross Game Nen record, team-rank claims, and source confidence linked',
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
    crossChecks: freeze([succession343SourcePolicy.soleSource]),
  }),
]);

export const succession343ChapterFocus = freeze({ 343: focus });
export const succession343Mysteries = freeze([]);
