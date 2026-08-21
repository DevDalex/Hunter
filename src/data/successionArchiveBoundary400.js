import * as base from './successionArchiveThrough399.js';

export * from './successionArchiveThrough399.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary400 = Object.freeze({
  chapter: 400,
  day: 'Voyage Day 10',
  presentDay: true,
  boundary: 'Chapter 400 is the first publication boundary that confirms the tracked Heil-Ly base broadly on Tier 2, adds Phinks’s self-described En limits, expands Melody/Magical Worm/Without You knowledge, exposes Fugetsu’s unidentified hostile-spirit condition, and records Kurapika accepting Longhi’s contract without the later contract terms.',
  quarantined: Object.freeze(['Chapter 401+ Moonlight Act contract mechanics', 'Chapter 401+ lower-prince treaty consequences', 'later identification or resolution of Fugetsu’s hostile Nen condition', 'later Special Martial Law declaration or enforcement']),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10', chapters: '400', subject: 'Phinks / Feitan / Nobunaga / Heil-Ly tracked base',
    route: 'Tier 3 receiver reading → vertical ambiguity → descend toward Tier 4 → signal weakens → Tier 2 confirmed → Cha-R route / Franklin reinforcement discussion',
    change: 'The transmitter operation advances from Chapters 398–399 access knowledge to a broad physical Tier 2 fix. Phinks also supplies personal En concentration limits, while the Troupe keeps Hisoka as its stated primary objective and treats the Heil-Ly/mafia conflict as a secondary route problem.',
    state: 'Tier 2 broad level confirmed / exact room and space creator unresolved / Franklin proposed but not shown joining', source: wiki('Chapter_400'),
  },
  {
    day: 'Voyage Day 10', chapters: '400', subject: 'Tyson / Izunavi / Book of Tyson / Nasubi plan',
    route: 'Room 1006 role-play → Giuliano calmness observation → Izunavi suspects Guardian Spirit Beast link → Tyson explains distribution and family motive → proposal to get Nasubi to read the book',
    change: 'Tyson agrees to seek a King-facing book-reading opportunity. The attendants’ dramatic identities remain role-play, Giuliano’s calmness is observed, and Izunavi’s Guardian Spirit Beast/control-of-contest theory remains a hypothesis rather than a demonstrated effect.',
    state: 'proposal active / no Nasubi reading or contest-ending effect yet established', source: wiki('Chapter_400'),
  },
  {
    day: 'Voyage Day 10', chapters: '400', subject: 'Human Kacho / Without You / Fugetsu / Melody',
    route: 'Seiko preserves Kacho-alive belief → Kacho-form Without You strategizes → Fugetsu repeated Magical Worm exploration → Fugetsu collapses → Melody hallway assessment → hostile spirits detected',
    change: 'Human Kacho remains dead while Without You continues in Kacho’s form. Magical Worm gains repeated-use and solo-return behavior at this boundary. Melody then detects Zetsu-like aura weakness, an unstable heartbeat, and numerous hostile spirits around Fugetsu; the responsible user/ability and relationship to Magical Worm remain unresolved.',
    state: 'Fugetsu alive but critically weakened / exorcist urgently needed / hostile Nen source unknown / Kacho-form aura-cost theories unconfirmed', source: wiki('Chapter_400'),
  },
  {
    day: 'Voyage Day 10', chapters: '400', subject: 'Melody / Kaiser / Justice Bureau / five prince requests',
    route: 'Five prince requests → Melody explains hearing/side-effect mechanics → Kaiser proposes slow poison → love declaration → Melody suspects manipulation → future martial-law contingency → Zhang Lei and Vantine interviews → Melody asks for Kurapika',
    change: 'Melody’s performance becomes explicit royal leverage while its hearing condition and healing intent are clarified. Kaiser’s assassination proposal and love declaration are direct statements, but Melody’s Manipulator/self-manipulation theory remains suspicion. Special Martial Law remains a future contingency, not active law.',
    state: 'Melody remains Justice-controlled / mass-assassination plan paused / Fugetsu diagnosis prioritized / Kurapika selected as trusted emergency contact', source: wiki('Chapter_400'),
  },
  {
    day: 'Voyage Day 10', chapters: '400', subject: 'Kurapika / Longhi / Tubeppa',
    route: 'Room 1014 → Longhi says Water Divination unnecessary because she already uses Nen → contract acceptance → Kurapika agrees to collaborate with Tubeppa',
    change: 'Kurapika accepts Longhi’s contract and explicit Tubeppa collaboration at Chapter 400. The supplied synopsis does not reproduce the contract terms, so no Moonlight Act mechanics or Chapter 401+ treaty detail is backfilled.',
    state: 'contract/collaboration accepted / exact terms unresolved at Chapter 400 boundary', source: wiki('Chapter_400'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
