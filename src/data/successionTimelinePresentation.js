const freeze = (value) => Object.freeze(value);

const media = (chapter, page, extension, position = '50% 12%') => freeze({
  chapter,
  page,
  src: `/media/succession-contest/chapters/${chapter}/${String(page).padStart(3, '0')}.${extension}`,
  position,
});

export const successionTimelinePhases = freeze([
  freeze({
    id: 'foundation',
    ordinal: 'I',
    shortTitle: 'The ritual is built',
    title: 'The contest is engineered before the ship moves',
    startChapter: 340,
    endChapter: 358,
    label: 'Pre-voyage foundation',
    summary: 'The Dark Continent expedition, the Seed Urn ceremony, royal contracts, bodyguard recruitment, and the boarding operation quietly turn a national voyage into a closed succession battlefield.',
    before: 'The expedition is presented as a public national project.',
    after: 'Fourteen prince households board inside a hidden survival ritual.',
    focusTracks: freeze(['ritual', 'expedition', 'kurapika']),
    spotlightTerms: freeze(['expedition becomes public', 'kurapika', 'seed urn', 'boards']),
    media: freeze([
      media(340, 1, 'jpg', '50% 6%'),
      media(358, 4, 'jpg', '50% 18%'),
    ]),
  }),
  freeze({
    id: 'sealed-room',
    ordinal: 'II',
    shortTitle: 'Room 1014 breaks',
    title: 'The first sealed room forces Nen into public view',
    startChapter: 359,
    endChapter: 368,
    label: 'Voyage Day 1',
    summary: 'The departure horn starts the contest. Room 1014 loses most of its defense, Benjamin inserts soldiers into rival households, and Kurapika answers a private Nen crisis with a public deterrence strategy.',
    before: 'Prince factions enter the voyage behind guarded doors.',
    after: 'Room 1014 survives by making the hidden power system visible.',
    focusTracks: freeze(['kurapika', 'benjamin', 'nen']),
    spotlightTerms: freeze(['departure', 'woody', 'guardian spirit', 'nen lessons', 'momoze']),
    media: freeze([
      media(359, 1, 'png', '50% 8%'),
    ]),
  }),
  freeze({
    id: 'public-nen',
    ordinal: 'III',
    shortTitle: 'Nen becomes common ground',
    title: 'Education, assassination, and spirit beasts share one room',
    startChapter: 369,
    endChapter: 376,
    label: 'Voyage Days 2–3',
    summary: 'Kurapika’s first classes create a fragile shared language for defense while Silent Majority, Camilla’s counter ability, Fugetsu’s route, Zhang Lei’s coins, and Halkenburg’s collective aura reveal competing rule systems.',
    before: 'Nen knowledge is concentrated among a few guards and hunters.',
    after: 'Learning Nen becomes both protection and an assassination surface.',
    focusTracks: freeze(['kurapika', 'nen', 'halkenburg']),
    spotlightTerms: freeze(['public nen lesson', 'silent majority', 'camilla', 'magical worm', 'halkenburg']),
    media: freeze([
      media(369, 1, 'png', '50% 7%'),
      media(373, 7, 'png', '50% 7%'),
    ]),
  }),
  freeze({
    id: 'lower-decks',
    ordinal: 'IV',
    shortTitle: 'The lower decks ignite',
    title: 'A second war opens beneath the princes',
    startChapter: 377,
    endChapter: 384,
    label: 'Voyage Days 4–7',
    summary: 'Heil-Ly, the established mafia families, the Phantom Troupe, Hisoka, and the Royal Army begin competing for the same passages while the upper-tier households prepare for the Sunday banquet.',
    before: 'The succession struggle is concentrated around Tier 1 households.',
    after: 'The ship’s corridors become territory in a separate, connected war.',
    focusTracks: freeze(['mafia', 'troupe', 'justice']),
    spotlightTerms: freeze(['morena', 'luini', 'troupe', 'salé-salé', 'sale-sale']),
    media: freeze([
      media(377, 1, 'png', '50% 6%'),
      media(383, 15, 'png', '50% 14%'),
    ]),
  }),
  freeze({
    id: 'failed-escape',
    ordinal: 'V',
    shortTitle: 'Escape fails',
    title: 'The ritual closes the exit and time stops behaving normally',
    startChapter: 385,
    endChapter: 389,
    label: 'Voyage Days 8–9',
    summary: 'The banquet performance creates an opening, but the escape operation collides with the ritual boundary. At the same time, Tserriednich’s Zetsu training produces a temporal anomaly that destabilizes ordinary cause and effect.',
    before: 'A legal and physical escape still appears possible.',
    after: 'Kacho’s fate exposes the ritual boundary while time itself becomes suspect.',
    focusTracks: freeze(['twins', 'tserriednich', 'nen']),
    spotlightTerms: freeze(['tserriednich', 'kacho dies', 'without you', 'escape', 'halkenburg']),
    media: freeze([
      media(385, 1, 'png', '50% 8%'),
      media(387, 14, 'jpg', '50% 16%'),
    ]),
  }),
  freeze({
    id: 'convergence',
    ordinal: 'VI',
    shortTitle: 'Every war converges',
    title: 'Possession, curses, letters, and hidden rooms lock together',
    startChapter: 390,
    endChapter: 408,
    label: 'Voyage Days 10–12',
    summary: 'Royal strategy, Beyond’s hidden operation, Halkenburg’s body-transfer plan, Fugetsu’s legal route, Heil-Ly’s spatial network, and the funeral procession stop functioning as separate stories.',
    before: 'Royal and lower-tier operations can still be read in parallel.',
    after: 'Movement, identity, evidence, and succession strategy become interdependent.',
    focusTracks: freeze(['halkenburg', 'mafia', 'justice']),
    spotlightTerms: freeze(['moonlight act', 'curse children', 'balsamilco', 'borksen disappears', 'funeral']),
    media: freeze([
      media(390, 1, 'png', '50% 8%'),
      media(401, 10, 'jpg', '50% 12%'),
    ]),
  }),
  freeze({
    id: 'martial-law',
    ordinal: 'VII',
    shortTitle: 'Special Martial Law',
    title: 'Emergency authority becomes a succession weapon',
    startChapter: 409,
    endChapter: 418,
    label: 'Voyage Day 12 · Current pressure',
    summary: 'Special Martial Law compresses movement, military command, disease, post-mortem curses, direct royal violence, and multiple unresolved deadlines into the same operating condition.',
    before: 'The contest advances through compartmentalized covert operations.',
    after: 'Benjamin’s authority, health, targets, and deadlines occupy one violent clock.',
    focusTracks: freeze(['benjamin', 'tserriednich', 'justice']),
    spotlightTerms: freeze(['special martial law', 'borksen selects yes', 'hell fruit', 'infects camilla', 'shoots tserriednich', 'gypsy life']),
    media: freeze([
      media(409, 1, 'png', '50% 8%'),
      media(416, 19, 'jpg', '50% 7%'),
    ]),
  }),
]);

export const timelinePhaseForChapter = (chapter) => successionTimelinePhases.find((phase) => (
  Number(chapter) >= phase.startChapter && Number(chapter) <= phase.endChapter
)) || successionTimelinePhases.at(-1);

export const mediaForTimelinePhase = (phase, spoilerLimit) => phase.media
  .filter((item) => item.chapter <= spoilerLimit)
  .at(-1) || phase.media[0];
