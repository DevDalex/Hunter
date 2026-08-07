const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_362';

export const succession362SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 362 synopsis, chapter notes, trivia, and note text',
  titleMetadata: 'English title Resolve retained from the repository Hunterpedia-transcribed chapter-title dataset; Japanese 決意 and romanization Ketsui come from the user-supplied Chapter 362 text.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 362,
  confidence,
  source,
});

export const succession362TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-362-parasite-host-psychology',
    title: 'Bill identifies host psychology as a core problem when countering Nen parasites',
    detail: 'Bill explains that parasitic Nen is strongly shaped by the host’s thoughts and feelings, making the host’s personality and emotional state relevant to understanding how the parasite behaves. Oito responds with her assessment that the first five princes are strongly inclined toward conflict.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['bill', 'oito', 'parasitic-nen', 'guardian-spirit-beast', 'host-psychology'],
    confidence: 'Bill’s parasitic-Nen explanation is chapter exposition; Oito’s characterization of the first five princes is her assessment',
  }),
  timelineEvent({
    id: 'voyage-day1-362-tserriednich-tubeppa-alliance',
    title: 'Tserriednich and Tubeppa form a tactical alliance',
    detail: 'The Fourth and Fifth Princes agree to cooperate. Their rationale is that lower-ranked princes are judged unwilling or unable to fight effectively while the top three princes are viewed as possessing severe character flaws, making temporary cooperation advantageous.',
    location: 'Black Whale · Tier 1 · royal quarters',
    tracks: ['tserriednich', 'tubeppa', 'alliance', 'succession-contest'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-beasts-cannot-kill-each-other',
    title: 'Nasubi states that Guardian Spirit Beasts cannot kill one another',
    detail: 'Nasubi’s monologue establishes a hard restriction in the succession system: Guardian Spirit Beasts may not kill other Guardian Spirit Beasts.',
    location: 'Narration / Nasubi succession-system exposition',
    tracks: ['nasubi', 'guardian-spirit-beast', 'succession-rules'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-beasts-cannot-directly-attack-bearers',
    title: 'Guardian Spirit Beasts cannot directly attack another beast’s bearer',
    detail: 'Nasubi states a second hard restriction: a Guardian Spirit Beast may not directly attack a prince who bears another Guardian Spirit Beast. The chapter does not state that every indirect, coercive, environmental, or proxy effect is forbidden.',
    location: 'Narration / Nasubi succession-system exposition',
    tracks: ['nasubi', 'guardian-spirit-beast', 'succession-rules'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-princes-must-kill-princes',
    title: 'The beasts protect, but the princes must solve the actual killing problem themselves',
    detail: 'Nasubi explains that the Guardian Spirit Beasts exist to protect their hosts rather than directly perform the succession killings for them. Each prince must determine how to eliminate rival siblings while operating around the beasts’ restrictions.',
    location: 'Narration / Nasubi succession-system exposition',
    tracks: ['nasubi', 'princes', 'guardian-spirit-beast', 'succession-contest'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-seed-urn-warring-chiefs-history',
    title: 'Nasubi links the Seed Urn system to Kakin’s Era of Warring Chiefs',
    detail: 'Nasubi describes the Seed Urn as a legacy of an ancestor from the Era of Warring Chiefs. The ancestor’s children helped build the Kakin Empire into its later form, making the ritual a dynastic selection mechanism rather than merely a protective ceremony.',
    location: 'Narration / Kakin royal history',
    tracks: ['nasubi', 'seed-urn', 'kakin-history', 'succession-contest'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-ideal-inheritor-traits',
    title: 'Nasubi describes the qualities the royal legacy is meant to preserve',
    detail: 'Nasubi says the Guardian Spirit Beasts exist to protect the person who can carry the Hui Guo Rou legacy, emphasizing foresight, caution, and strong planning ability as traits suited to rulership.',
    location: 'Narration / Nasubi succession-system exposition',
    tracks: ['nasubi', 'hui-guo-rou', 'succession-contest', 'leadership'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-theta-salkov-containment-plan',
    title: 'Theta and Salkov debate how to contain Tserriednich’s Nen development',
    detail: 'Theta wants Tserriednich kept in his quarters without teaching him the truth of Nen. Salkov suggests controlled disclosure and deliberately inefficient training, such as steering the prince toward a weak Nen category, as a possible way to slow his development.',
    location: 'Black Whale · Tier 1 · Tserriednich household',
    tracks: ['theta', 'salkov', 'tserriednich', 'nen-training', 'containment'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-theta-salkov-only-nen-users',
    title: 'Theta and Salkov are identified as the only Nen-capable bodyguards in Tserriednich’s camp',
    detail: 'The supplied chapter notes state that among Tserriednich’s bodyguards, Theta and Salkov are the only two who can use Nen at this point.',
    location: 'Black Whale · Tier 1 · Tserriednich household',
    tracks: ['theta', 'salkov', 'tserriednich', 'nen-users', 'bodyguards'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-beast-reveals-upper-princes',
    title: 'Eight princes’ Guardian Spirit Beasts are visibly revealed',
    detail: 'The chapter reveals the Guardian Spirit Beasts of Benjamin, Camilla, Zhang Lei, Tserriednich, Tubeppa, Tyson, Luzurus, and Salé-salé.',
    location: 'Black Whale · Tier 1 · multiple royal quarters',
    tracks: ['guardian-spirit-beast', 'benjamin', 'camilla', 'zhang-lei', 'tserriednich', 'tubeppa', 'tyson', 'luzurus', 'sale-sale'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-luzurus-learns-nen-context',
    title: 'Luzurus becomes aware of Nen and the Guardian Spirit Beast situation',
    detail: 'Luzurus learns that Nen and Guardian Spirit Beasts are involved in the succession contest. The chapter notes state that he shows little interest in personally learning Nen because of the time required and plans to target Tubeppa first.',
    location: 'Black Whale · Tier 1 · Luzurus household',
    tracks: ['luzurus', 'nen', 'guardian-spirit-beast', 'tubeppa', 'targeting'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-tyson-learns-nen-context',
    title: 'Tyson becomes aware of Nen and the surrounding Guardian Spirit Beasts',
    detail: 'Tyson is among the princes who become aware that Nen and Guardian Spirit Beasts are active elements of the succession contest.',
    location: 'Black Whale · Tier 1 · Tyson household',
    tracks: ['tyson', 'nen', 'guardian-spirit-beast'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-halkenburg-guards-unconscious',
    title: 'Halkenburg finds all eleven of his bodyguards unconscious',
    detail: 'After seeking withdrawal in Chapter 361, Halkenburg returns to a disturbing scene: all eleven of his bodyguards are unconscious under unexplained circumstances. Chapter 362 does not identify the cause.',
    location: 'Black Whale · Tier 1 · Halkenburg quarters',
    tracks: ['halkenburg', 'bodyguards', 'guardian-spirit-beast', 'mystery'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-tserriednich-confronts-theta',
    title: 'Tserriednich confronts Theta alongside his Guardian Spirit Beast',
    detail: 'Tserriednich’s Guardian Spirit Beast appears as he presses Theta for information about Nen. The strategy of keeping the subject hidden from him begins to collapse under direct scrutiny.',
    location: 'Black Whale · Tier 1 · Tserriednich household',
    tracks: ['tserriednich', 'theta', 'guardian-spirit-beast', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-362-theta-admits-nen',
    title: 'Theta admits that Nen exists and that she can use it',
    detail: 'Under Tserriednich’s questioning, Theta confirms that she knows about Nen and is herself a Nen user, ending the possibility of completely concealing Nen from the prince.',
    location: 'Black Whale · Tier 1 · Tserriednich household',
    tracks: ['theta', 'tserriednich', 'nen-training', 'containment'],
  }),
]);

export const succession362GuardianBeastRules = freeze([
  freeze({
    rule: 'Guardian Spirit Beasts may not kill one another',
    scope: 'Direct beast-versus-beast killing is forbidden by the succession system.',
    implication: 'A prince cannot simply rely on their beast to eliminate a rival prince’s Guardian Spirit Beast.',
    source,
  }),
  freeze({
    rule: 'Guardian Spirit Beasts may not directly attack another beast bearer',
    scope: 'Direct attacks by one Guardian Spirit Beast against a rival prince who bears a Guardian Spirit Beast are forbidden.',
    implication: 'The supplied chapter does not state that indirect manipulation, proxy action, environmental effects, or attacks on non-prince personnel are automatically forbidden.',
    source,
  }),
]);

export const succession362GuardianBeastReveals = freeze([
  freeze({ prince: 'Benjamin Hui Guo Rou', order: 1, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Camilla Hui Guo Rou', order: 2, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Zhang Lei Hui Guo Rou', order: 3, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Tserriednich Hui Guo Rou', order: 4, reveal: 'Guardian Spirit Beast visibly revealed and confronts Theta alongside its host', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Tubeppa Hui Guo Rou', order: 5, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Tyson Hui Guo Rou', order: 6, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Luzurus Hui Guo Rou', order: 7, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
  freeze({ prince: 'Salé-salé Hui Guo Rou', order: 8, reveal: 'Guardian Spirit Beast visibly revealed in Chapter 362', ability: 'Not established in the supplied Chapter 362 text', source }),
]);

export const succession362RelationshipRecords = freeze([
  freeze({
    from: 'Tserriednich Hui Guo Rou',
    to: 'Tubeppa Hui Guo Rou',
    type: 'Succession alliance',
    note: 'The Fourth and Fifth Princes form a tactical alliance based on their assessment of the upper and lower prince blocs.',
    phase: 'Active contest and voyage',
    chapters: '362–current',
    state: 'active',
    source,
  }),
  freeze({
    from: 'Theta',
    to: 'Tserriednich Hui Guo Rou',
    type: 'Containment through controlled Nen instruction',
    note: 'Theta intends to limit the prince’s growth and potential for harm by controlling how Nen is disclosed and taught. By chapter end, she has admitted Nen exists and that she can use it.',
    phase: 'Active contest and voyage',
    chapters: '362–current',
    state: 'containment plan under pressure',
    source,
  }),
  freeze({
    from: 'Luzurus Hui Guo Rou',
    to: 'Tubeppa Hui Guo Rou',
    type: 'Declared first target',
    note: 'The Chapter 362 notes state that Luzurus plans to target Tubeppa first.',
    phase: 'Active contest and voyage',
    chapters: '362–current',
    state: 'hostile intent',
    source,
  }),
]);

export const succession362PersonnelRecords = freeze([
  freeze({ household: 'Tserriednich', person: 'Theta', nenStatus: 'Nen user', role: 'Bodyguard / intended Nen instructor and containment agent', source }),
  freeze({ household: 'Tserriednich', person: 'Salkov', nenStatus: 'Nen user', role: 'Bodyguard / advises controlled inefficient training', source }),
  freeze({ household: 'Tserriednich', person: 'Other bodyguards', nenStatus: 'Not identified as Nen users in supplied Chapter 362 notes', role: 'Household protection', source }),
]);

export const succession362Mysteries = freeze([
  freeze({
    question: 'What caused all eleven of Halkenburg’s bodyguards to lose consciousness?',
    evidence: 'Halkenburg returns to his quarters and finds all eleven guards unconscious. Chapter 362 provides no culprit or complete mechanism.',
    status: 'open',
    lastChapter: '362',
    source,
  }),
  freeze({
    question: 'How far do the Guardian Spirit Beast non-aggression rules extend to indirect attacks?',
    evidence: 'Nasubi explicitly forbids beasts from killing each other and directly attacking rival beast bearers, but Chapter 362 does not define every indirect, proxy, coercive, environmental, or support interaction.',
    status: 'open mechanics boundary',
    lastChapter: '362',
    source,
  }),
  freeze({
    question: 'Can Theta actually slow or contain Tserriednich’s Nen development after admitting Nen exists?',
    evidence: 'Theta’s concealment strategy collapses when Tserriednich confronts her and she admits she can use Nen. The effectiveness of deliberately inefficient instruction remains unresolved.',
    status: 'developing',
    lastChapter: '362',
    source,
  }),
]);

const focus = 'Nasubi establishes two hard Guardian Spirit Beast restrictions: the beasts may not kill one another and may not directly attack rival beast bearers; Tserriednich and Tubeppa form an alliance; eight princes’ Guardian Spirit Beasts are revealed; Theta and Salkov debate how to contain Tserriednich’s Nen growth before Theta is forced to admit she knows and uses Nen; Luzurus targets Tubeppa; and Halkenburg finds all eleven of his bodyguards mysteriously unconscious.';

export const succession362ChapterResearch = freeze([
  freeze({
    number: 362,
    title: 'Resolve',
    japaneseTitle: '決意',
    romanizedTitle: 'Ketsui',
    titleDisambiguation: 'Chapter 362 and Chapter 348 share the maintained English title “Resolve”, but Chapter 362 uses 決意 (Ketsui) while Chapter 348 uses 覚悟 (Kakugo).',
    suppliedNote: 'The supplied chapter note says Tubeppa speaks of “Lazarus”, almost certainly a typo for Luzurus; the archive uses Luzurus for the character identity while preserving this note.',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Guardian Spirit Beast rules',
      'Tserriednich / Tubeppa alliance',
      'Royal beast reveals',
      'Tserriednich Nen containment',
      'Halkenburg household anomaly',
      'Luzurus targeting',
    ]),
    focus,
    events: succession362TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Bill', 'Oito', 'Nasubi Hui Guo Rou', 'Tserriednich Hui Guo Rou', 'Tubeppa Hui Guo Rou',
      'Theta', 'Salkov', 'Benjamin Hui Guo Rou', 'Camilla Hui Guo Rou', 'Zhang Lei Hui Guo Rou',
      'Tyson Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Salé-salé Hui Guo Rou', 'Halkenburg Hui Guo Rou',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Tier 1 · Tserriednich household',
      'Black Whale · Tier 1 · Luzurus household',
      'Black Whale · Tier 1 · Tyson household',
      'Black Whale · Tier 1 · Halkenburg quarters',
      'Narration / Nasubi succession-system exposition',
      'Narration / Kakin royal history',
    ]),
    threadLabels: freeze([
      'Guardian Spirit Beasts',
      'Succession Contest rules',
      'Tserriednich',
      'Tubeppa',
      'Theta',
      'Halkenburg',
      'Luzurus',
      'Parasitic Nen',
    ]),
    guardianBeastRules: succession362GuardianBeastRules,
    guardianBeastReveals: succession362GuardianBeastReveals,
    personnel: succession362PersonnelRecords,
    relationships: succession362RelationshipRecords,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 362 text',
      'Oito’s statement that the first five princes lust for battle is stored as Oito’s assessment rather than objective narration',
      'The two Guardian Spirit Beast restrictions are treated as chapter-established rules exactly at the scope stated: no beast-on-beast killing and no direct attack on rival beast bearers',
      'No extra ban on indirect, proxy, coercive, or environmental effects is invented',
      'Halkenburg’s eleven unconscious guards remain an unresolved event with no attributed cause',
      'Theta and Salkov are stored as the only Nen-capable bodyguards in Tserriednich’s camp according to the supplied Chapter 362 notes',
      'The supplied “Lazarus” wording is preserved as a typo note while the character record uses Luzurus',
    ]),
    status: 'Maintained chapter summary, chronology, Guardian Spirit Beast rules and reveals, alliances, personnel state, Tserriednich Nen-containment plan, Halkenburg anomaly, relationships, mysteries, title disambiguation, and source confidence linked',
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
    titleStatus: 'verified-from-user-supplied-hunterpedia-and-repository-catalogue',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession362ChapterFocus = freeze({ 362: focus });
