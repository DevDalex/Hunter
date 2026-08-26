const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_400';

export const succession400SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'Current user-supplied Hunterpedia Chapter 400 synopsis',
  retainedMetadata: freeze({
    title: 'Secrecy',
    japaneseTitle: '秘匿',
    basis: 'Retained from the pre-existing maintained Chapter 400 packet, which already marked the title metadata as verified from earlier user-supplied Hunterpedia material.',
  }),
  chronologyNote: 'Chapter 400 is present-day Voyage Day 10 material spanning the Troupe search on Tiers 3–4, Tyson’s Room 1006, Seiko outside Room 1010, Justice Bureau scenes, and the Room 1014 Longhi/Kurapika endpoint. No exact clock time is supplied.',
  tier2HideoutBoundary: 'Phinks and Feitan use the receiver and intentionally move toward Tier 4. The weakening signal confirms their tracked transmitter is above them, supporting Tier 2 as the broad physical level of the hidden Heil-Ly base. This is Chapter 400 knowledge and is not backfilled into Chapters 398–399. Exact room coordinates and the full route remain unresolved.',
  morenaBoundary: 'Nobunaga says their boss created the space with Nen and infers the boss is in the upper tiers. Those are Nobunaga’s conclusions. Chapter 400 does not independently assign creation of the hideout space, Room 3101 route, or self-restoring stage to Morena personally.',
  phinksEnBoundary: 'Phinks describes his own En limitations: voices, movement, and his own movement interrupt his concentration, and he regards crowd use as strategically dangerous. These are Phinks-specific capability statements, not universal rules for every En user.',
  tysonBoundary: 'Madwig, Himoncé, Anzel, Hyuga, and the self-described Moony prince perform personas matching Tyson’s favorite roles. Their role-play statements are not treated as literal biographies, siblinghood, celebrity status, tutoring credentials, alien origin, or royal identity. Izunavi’s link between Giuliano’s calmness and Tyson’s Guardian Spirit Beast is an inference, and influencing Nasubi remains a proposal.',
  kachoBoundary: 'Human Kacho remains dead from Chapter 383. The Kacho-form actor in Chapter 400 is Without You. Its self-explanations about being resurrected as a guardian spirit, Fugetsu seeing it, and Fugetsu possibly supplying aura to maintain the form are the Kacho-form beast’s reasoning, not settled metaphysical or cost mechanics. Human-consciousness persistence remains unresolved.',
  melodyBoundary: 'Melody explicitly says her performance is intended to heal, that loss of consciousness is a side effect, and that covering the ears prevents the demonstrated entrancement. Kaiser’s assassination proposal and love declaration are confirmed statements; Melody’s theory that Kaiser is a Manipulator or self-manipulated agent remains her suspicion.',
  fugetsuBoundary: 'Fugetsu reports that Magical Worm can now be used multiple times and that a return door appears even while she is alone, limited to returning where she was. Her worsening physical/aura condition and surrounding hostile spirits are observed in the same chapter, but the chapter does not prove that repeated Magical Worm use caused the deterioration or that the ability itself is naturally strengthening with every use.',
  martialLawBoundary: 'Kaiser explains a future Special Martial Law contingency and the danger of military takeover of the Justice Bureau. Chapter 400 does not show Special Martial Law being declared or activated. The earlier emergency broadcast is not assigned unsupplied content.',
  longhiBoundary: 'Kurapika agrees to Longhi’s contract and to collaborate with Tubeppa after hearing her explanation, but the supplied Chapter 400 synopsis does not reproduce the contract terms. Moonlight Act mechanics and Chapter 401+ alliance details are not imported backward.',
  excluded: freeze([
    'Outside story claims or web cross-checks',
    'Chapter 401+ Moonlight Act terms',
    'A claim that Morena is confirmed as the creator/operator of the hideout spatial systems',
    'A universal En limitation derived from Phinks’s personal limitations',
    'Literalizing Tyson’s attendants’ performed personas',
    'Resurrecting the human Kacho',
    'Treating Kacho-form aura-cost theories as confirmed mechanics',
    'Assigning a Nen type or controller to Kaiser from Melody’s suspicion',
    'Claiming repeated Magical Worm use caused Fugetsu’s curse-like deterioration',
    'Declaring Special Martial Law active in Chapter 400',
    'Identifying the user or exact mechanism behind Fugetsu’s hostile-spirit condition',
  ]),
});

const timelineEvent = ({ id, title, detail, location, tracks, confidence = 'Confirmed in the supplied Chapter 400 synopsis' }) => freeze({
  id,
  time: 'Voyage Day 10 · story order',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 400,
  confidence,
  source,
});

export const succession400TimelineEvents = freeze([
  timelineEvent({
    id: '400-receiver-vertical-search-phinks-en-limits',
    title: 'Feitan and Phinks narrow the transmitter vertically while Phinks explains his En limits',
    detail: 'On Tier 3, the receiver places the transmitter roughly 100–200 meters away with unstable direction, which Feitan recalls means directly above or below. Feitan suggests En, but Phinks says voices, movement, and his own movement interrupt his concentration; controlled warehouse searching is about his reliable limit, and exposing En to a crowd of unknown Nen users is strategically reckless.',
    location: 'Black Whale · Tier 3 public corridor',
    tracks: ['troupe', 'heil-ly', 'nen', 'tracking'],
    confidence: 'Receiver behavior is observed; the En limitations are Phinks’s self-description and are not universalized.',
  }),
  timelineEvent({
    id: '400-nobunaga-rejoins-ten-minutes-cha-r-route',
    title: 'Nobunaga rejoins after roughly ten minutes and the Troupe prepares to use Cha-R’s route',
    detail: 'Nobunaga rejoins Phinks and Feitan, surprised that only about ten minutes have passed since he left Hinrigh. He asks whether the receiver works, tells a soldier to inform Hinrigh that the Troupe is heading toward Cha-R’s hideout, and remains uneasy about the Tier 2 implications. When asked for the hideout’s exact position, he says he cannot locate it because the space is Nen-created.',
    location: 'Black Whale · Tier 3 transit route',
    tracks: ['troupe', 'xi-yu', 'cha-r', 'heil-ly', 'nen'],
    confidence: 'The elapsed-time estimate and route plan are explicit; Nobunaga’s attribution of the Nen-created space to the enemy boss remains his conclusion.',
  }),
  timelineEvent({
    id: '400-tier2-hideout-confirmed-mafia-custom-theories',
    title: 'The weakening signal confirms Tier 2 and the Troupe questions the mafia war',
    detail: 'Descending toward Tier 4 makes the receiver signal weaker, confirming to Phinks, Feitan, and Nobunaga that the tracked hideout is on Tier 2. Nobunaga infers that Heil-Ly’s boss is therefore in the upper tiers and questions how the other families justify the war. Phinks and Feitan discuss possible exploitation of an ancient mafia custom. These custom/boss-operating explanations remain Troupe analysis rather than narrator-confirmed motives.',
    location: 'Black Whale · Tiers 3 → 4 transit',
    tracks: ['troupe', 'mafia', 'heil-ly', 'tracking'],
  }),
  timelineEvent({
    id: '400-franklin-reinforcement-hisoka-primary-objective',
    title: 'Nobunaga asks for Franklin while Hisoka remains the Troupe’s primary objective',
    detail: 'Nobunaga wants Franklin added because Heil-Ly’s abilities are more refined than expected and their numbers remain uncertain. Phinks reminds him that the mafia conflict is a sideshow until they find Hisoka. Nobunaga argues that securing an upper-tier route helps the Hisoka search and admits one Heil-Ly member interested him; Feitan teases him for liking the enemy too much.',
    location: 'Black Whale · transit toward Cha-R territory',
    tracks: ['troupe', 'hisoka', 'heil-ly', 'mafia'],
    confidence: 'Hisoka remains the stated primary objective; Nobunaga’s interest is tactical/personal curiosity, not friendship or allegiance.',
  }),
  timelineEvent({
    id: '400-emergency-broadcast-begins',
    title: 'An emergency broadcast interrupts the Troupe discussion',
    detail: 'An emergency broadcast asks everyone to pay attention to sad and unfortunate news. The supplied synopsis does not reproduce the broadcast’s substantive announcement, so the archive does not assign unsupplied content to it.',
    location: 'Black Whale · shipwide broadcast',
    tracks: ['ship', 'broadcast'],
    confidence: 'Broadcast opening confirmed; substantive content deliberately left unsupplied.',
  }),
  timelineEvent({
    id: '400-tyson-reborn-roleplay-giuliano',
    title: 'Tyson presents her attendants through favorite-role personas and assigns Giuliano a part',
    detail: 'In Room 1006, Madwig, Himoncé, Anzel, Hyuga, and another attendant perform identities matching Tyson’s favorite roles: an amnesiac handsome hitman, world-famous star, secret little brother, legendary tutor, and a prince from planet Moony. Giuliano recognizes the role-play. Tyson says they have been reborn and assigns Giuliano a flirtatious-looking but pure-hearted bodyguard role, which he plays along with.',
    location: 'Tier 1 · Room 1006',
    tracks: ['tyson', 'royal-household'],
    confidence: 'The personas are performed roles and are not recorded as literal biographies or kinship.',
  }),
  timelineEvent({
    id: '400-izunavi-tyson-book-king-plan',
    title: 'Izunavi explores using Tyson’s book to influence the King and end the contest',
    detail: 'Izunavi observes that Giuliano becomes unusually calm while reading Tyson’s book and suspects a connection to Tyson’s Guardian Spirit Beast. Tyson says she distributed copies to lower princes and their mothers and had asked her own mother to give one to the King. She explains that she nearly declined the contest, that her mother wanted revenge for being pitied by other queens, and that Tyson intends to fight through love. Izunavi asks her to seek a next-banquet reading by Nasubi; Tyson agrees to negotiate with her mother.',
    location: 'Tier 1 · Room 1006',
    tracks: ['tyson', 'izunavi', 'guardian-spirit-beast', 'succession-contest'],
    confidence: 'Giuliano’s calmness is observed; the Guardian Spirit Beast link and ability to influence Nasubi/end the contest are hypotheses and plans.',
  }),
  timelineEvent({
    id: '400-seiko-conceals-kacho-death-fugetsu-shield',
    title: 'Seiko delays restrictions and resolves to preserve the belief that Kacho is alive',
    detail: 'Outside Room 1010, Seiko challenges restrictions on access to Fugetsu and insists contact must go through her. Privately she decides others should continue believing Kacho is alive as long as possible. She regards Kacho’s early loss as a major strategic setback and as a lost shield for Fugetsu, whom she views as easier to control but too weak to survive alone, and hopes Justice Bureau protection can continue.',
    location: 'Tier 1 · outside Room 1010',
    tracks: ['seiko', 'kacho', 'fugetsu', 'justice', 'succession-contest'],
  }),
  timelineEvent({
    id: '400-kacho-form-state-melody-regret-fugetsu-king-plan',
    title: 'Without You reasons about its Kacho-form state and commits to making Fugetsu King',
    detail: 'At the Justice Bureau, the Kacho-form Guardian Spirit Beast speculates that it may have been resurrected as a guardian spirit, reasons that Fugetsu seeing it indicates Kacho is out of the contest, and wonders whether Fugetsu’s aura maintains the form and burdens her. Melody blames herself for Kacho’s death, but the Kacho-form actor says the escape was what Kacho wanted, rejects regret, commits to making Fugetsu King, and says the public belief that Kacho died can be exploited while the actual truth must remain hidden from Fugetsu.',
    location: 'Justice Bureau · interrogation office',
    tracks: ['kacho', 'fugetsu', 'melody', 'without-you', 'justice'],
    confidence: 'Human Kacho remains dead. The Kacho-form actor is Without You; its resurrection/aura-maintenance explanations are its own reasoning, not settled mechanics.',
  }),
  timelineEvent({
    id: '400-five-princes-request-melody-performance',
    title: 'Five princes seek Melody’s performance and turn it into political leverage',
    detail: 'Kaiser says Zhang Lei and Tserriednich request private meetings and an in-person performance, while Benjamin, Tubeppa, and Luzurus offer a pardon and request an encore. He explains that the princes increasingly understand Nen and can use Melody’s suspected role in the escape attempt as leverage. Melody states that her music is intended to heal, that loss of consciousness is a side effect, and that covering the ears prevents the demonstrated entrancement.',
    location: 'Justice Bureau · interrogation office',
    tracks: ['melody', 'kaiser', 'princes', 'nen', 'justice'],
  }),
  timelineEvent({
    id: '400-kaiser-mass-assassination-love-declaration',
    title: 'Kaiser proposes poisoning unconscious princes and declares love for Melody',
    detail: 'Kaiser proposes deceiving the interested princes, using Melody’s performance to render them unconscious, and administering slow-acting poison. Asked why he would risk himself, he says he is in love with Melody and prioritizes her completely. Melody notes that his heartbeat is unnaturally precise, agrees outwardly, and privately suspects that Kaiser may be a Manipulator or self-manipulated agent serving a hidden purpose.',
    location: 'Justice Bureau · interrogation office',
    tracks: ['melody', 'kaiser', 'assassination-plan', 'nen', 'justice'],
    confidence: 'The plan and declaration are Kaiser’s explicit statements; Kaiser’s Nen type, genuine motive, controller, and self-manipulation remain Melody’s suspicions.',
  }),
  timelineEvent({
    id: '400-kaiser-martial-law-contingency-steiner-device',
    title: 'Kaiser warns Steiner about a future Special Martial Law takeover contingency',
    detail: 'Kaiser gives Steiner a device to activate if Benjamin’s men or the Royal Army arrive. He explains that the Justice Bureau is presently the ship’s most neutral institution but could become a military command base if Special Martial Law is declared, with a worst-case rapid insurgency process after soldiers enter. Steiner realizes his survival matters to the official record and privately feels marked for death.',
    location: 'Justice Bureau · witness-protection area',
    tracks: ['kaiser', 'steiner', 'justice', 'military', 'martial-law'],
    confidence: 'This is contingency planning and legal explanation; Special Martial Law is not active in Chapter 400.',
  }),
  timelineEvent({
    id: '400-fugetsu-magical-worm-multiple-use-solo-return',
    title: 'Fugetsu reveals repeated Magical Worm use and a solo return door before collapsing',
    detail: 'Kacho-form Without You finds Fugetsu after she has been using Magical Worm alone. Fugetsu says the route can now be used multiple times rather than once per day and that the return door appears even without Kacho, although she can only return to where she was. She feels happy and empowered by using it, but appears pale with heavy bags under her eyes and later passes out.',
    location: 'Justice Bureau · protected quarters',
    tracks: ['fugetsu', 'kacho', 'magical-worm', 'nen', 'justice'],
    confidence: 'Repeated use and solo return are Fugetsu’s demonstrated/reported Chapter 400 state. A causal link between repeated use and her deterioration is not established.',
  }),
  timelineEvent({
    id: '400-melody-detects-fugetsu-evil-spirits',
    title: 'Melody detects Fugetsu’s Zetsu-like weakness and a mass of hostile spirits',
    detail: 'During a deliberately arranged hallway crossing, Melody senses Fugetsu’s aura weakened to a Zetsu-like level, an unstable heartbeat, and many evil spirits around her. Melody judges an exorcist urgently necessary. She cannot find the obvious body or trace she would expect from such a powerful hostile effect and begins considering a hostage-negotiation theory, but the attacker, ability, activation route, and exact cause remain unknown.',
    location: 'Justice Bureau · hallway',
    tracks: ['melody', 'fugetsu', 'nen', 'hostile-spirits', 'justice'],
    confidence: 'Fugetsu’s condition and Melody’s sensory observations are confirmed; the cause/user and negotiation theory remain unresolved.',
  }),
  timelineEvent({
    id: '400-zhang-lei-coin-vantine-negotiation-probe',
    title: 'Melody receives Zhang Lei’s coin and tests Vantine with the word “negotiations”',
    detail: 'Zhang Lei meets Melody personally, praises her banquet performance, requests another performance, and gives her a coin marked “1”. Vantine then appears on Tserriednich’s behalf and invites Melody to the Fourth Prince’s quarters. Melody deliberately introduces the word “negotiate”; Vantine’s heartbeat shows confusion and doubt. Melody treats the responses as evidence against the Third and Fourth Princes being the visible source of her hostage-negotiation theory, while acknowledging that the true mastermind remains unresolved.',
    location: 'Justice Bureau · controlled interview room',
    tracks: ['melody', 'zhang-lei', 'tserriednich', 'vantine', 'investigation', 'nen'],
    confidence: 'The meetings, coin, and heartbeat responses are observed; Melody’s suspect elimination remains her inference.',
  }),
  timelineEvent({
    id: '400-melody-pauses-assassination-asks-kaiser-kurapika',
    title: 'Melody pauses the assassination proposal and asks Kaiser to tell Kurapika everything',
    detail: 'Melody tells Kaiser not to execute the banquet assassination plan until Fugetsu’s condition is understood. Kaiser explains that relaxing Melody’s confinement would expose her to prince subpoenas and that Benjamin’s men are waiting outside the Justice Bureau. Melody asks Kaiser to go to Kurapika in Room 1014 and tell him everything because Kurapika is the only person she trusts to respond quickly.',
    location: 'Justice Bureau',
    tracks: ['melody', 'kaiser', 'fugetsu', 'kurapika', 'justice'],
  }),
  timelineEvent({
    id: '400-longhi-contract-kurapika-tubeppa-collaboration',
    title: 'Kurapika accepts Longhi’s contract and agrees to collaborate with Tubeppa',
    detail: 'In Room 1014, Longhi says Water Divination is unnecessary because she can already use Nen and asks whether Kurapika will agree to the contract after hearing what she had to say. With Bill present, Kurapika agrees and says he will collaborate with Prince Tubeppa. The supplied Chapter 400 synopsis does not reproduce the contract terms, so no Chapter 401+ Moonlight Act mechanics are imported.',
    location: 'Tier 1 · Room 1014',
    tracks: ['kurapika', 'longhi', 'tubeppa', 'bill', 'nen', 'diplomacy'],
    confidence: 'Agreement/collaboration confirmed; exact contract terms are unsupplied at the Chapter 400 boundary.',
  }),
]);

export const succession400TroupeResearch = freeze({
  receiver: '100–200 meters away at the opening; unstable direction indicates directly above or below according to the receiver behavior already explained in Chapter 398.',
  tierConclusion: 'Moving down toward Tier 4 makes the signal weaker, confirming Tier 2 as the broad level of the tracked transmitter/hideout.',
  phinksEn: freeze({
    personalLimitations: freeze(['voices interrupt concentration', 'movement in the field interrupts concentration', 'Phinks’s own movement interrupts concentration', 'controlled warehouse searching is about his stated reliable use']),
    strategicView: 'Using En around a crowd of unknown Nen users would expose him dangerously.',
    boundary: 'Phinks-specific self-assessment, not a universal En rule.',
  }),
  nobunaga: 'Rejoins roughly ten minutes after leaving Hinrigh; remains preoccupied by the Tier 2 result; wants Franklin as reinforcement; acknowledges interest in one Heil-Ly member.',
  objectivePriority: 'Phinks explicitly keeps Hisoka as the Troupe’s primary objective and treats the mafia conflict as secondary except where it affects access to the upper tiers.',
  source,
});

export const succession400TysonResearch = freeze({
  roleplayBoundary: 'Madwig, Himoncé, Anzel, Hyuga, and the Moony-prince attendant perform Tyson-favored personas. Their statements are not literalized into biography or kinship.',
  giulianoObservation: 'Giuliano becomes unusually calm while reading Tyson’s book.',
  izunaviInference: 'Izunavi suspects the calmness is linked to Tyson’s Guardian Spirit Beast and explores whether the book might influence Nasubi enough to stop the succession contest.',
  distribution: 'Tyson says she gave copies to lower princes and their mothers and previously asked her mother to give one to Nasubi.',
  tysonMotivation: 'Tyson says she nearly declined the contest; her mother wanted revenge for the pity of other queens, while Tyson says she fights through love.',
  boundary: 'No Chapter 400 evidence confirms that Nasubi has read the book, that the Guardian Spirit Beast caused Giuliano’s calmness, or that reading the book can end the contest.',
  source,
});

export const succession400TwinJusticeResearch = freeze({
  seiko: 'Seiko actively preserves the belief that Kacho is alive, sees Kacho’s loss as the loss of a shield for Fugetsu, and wants Justice protection maintained.',
  kachoForm: 'Without You in Kacho’s form remains the active post-death protector. Human Kacho remains dead.',
  kachoFormHypotheses: freeze(['it may have been resurrected as a guardian spirit', 'Fugetsu seeing it may indicate Kacho is outside the contest', 'Fugetsu may be supplying aura to maintain the Kacho-form appearance', 'telling Fugetsu the truth might reduce that burden']),
  confirmedBehavior: freeze(['Kacho-form Without You can pass through solid furniture/walls in the demonstrated Justice Bureau movement', 'it remains committed to protecting Fugetsu and concealing the actual death from her']),
  boundary: 'The Kacho-form hypotheses do not settle consciousness persistence, aura cost, or contest-status mechanics.',
  source,
});

export const succession400FugetsuResearch = freeze({
  magicalWormUpdate: freeze(['Fugetsu reports multiple uses rather than the prior once-per-day limit', 'a return door appears while she is alone', 'solo return is limited to returning where she was']),
  physicalState: freeze(['pale appearance', 'heavy bags under eyes', 'eventual collapse']),
  melodyObservation: freeze(['aura as weak as Zetsu', 'unstable heartbeat', 'many hostile/evil spirits around Fugetsu']),
  unresolved: freeze(['who caused the hostile condition', 'what ability or curse system is responsible', 'activation route', 'whether the responsible body/user is nearby', 'whether repeated Magical Worm use is a cause, symptom, or unrelated concurrent development']),
  source,
});

export const succession400MelodyKaiserResearch = freeze({
  fivePrinceRequests: freeze({ third: 'Zhang Lei requests an in-person meeting/performance', fourth: 'Tserriednich requests an in-person meeting/performance', first: 'Benjamin offers a pardon and requests an encore', fifth: 'Tubeppa offers a pardon and requests an encore', seventh: 'Luzurus offers a pardon and requests an encore' }),
  melodyMechanics: freeze({ purpose: 'healing', unconsciousness: 'side effect', earCovering: 'covering the ears prevents the demonstrated entrancement' }),
  kaiserProposal: 'Use Melody’s performance to incapacitate higher-ranking princes and administer slow-acting poison.',
  kaiserDeclaration: 'Kaiser says he is in love with Melody and completely prioritizes her.',
  melodySuspicion: 'Melody hears a heartbeat as precise as an atomic clock and suspects Kaiser may be a Manipulator or self-manipulated agent serving a hidden objective.',
  boundary: 'Kaiser’s proposal and declaration are statements; Melody’s Nen-type/controller theory is not confirmed.',
  martialLaw: 'Kaiser explains a future Special Martial Law contingency and gives Steiner an emergency device. No declaration occurs in Chapter 400.',
  source,
});

export const succession400KurapikaLonghiResearch = freeze({
  longhiState: 'Longhi states that Water Divination is unnecessary because she already uses Nen.',
  contract: 'Kurapika agrees to the contract after hearing Longhi’s explanation.',
  politicalOutcome: 'Kurapika agrees to collaborate with Tubeppa.',
  boundary: 'The supplied Chapter 400 synopsis does not reproduce the contract terms. Moonlight Act mechanics and Chapter 401+ treaty specifics remain quarantined.',
  source,
});

export const succession400RelationshipRecords = freeze([
  freeze({ from: 'Melody', to: 'Kacho Hui Guo Rou / Without You', type: 'protective alliance under grief', status: 'Melody accepts the Kacho-form protector’s demand to keep working toward Fugetsu’s survival despite blaming herself for the failed escape.', source }),
  freeze({ from: 'Melody', to: 'Kaiser', type: 'tactical cooperation / profound distrust', status: 'Melody outwardly cooperates with Kaiser’s planning while privately suspecting manipulation or a hidden controller.', source }),
  freeze({ from: 'Kacho Hui Guo Rou / Without You', to: 'Fugetsu Hui Guo Rou', type: 'post-mortem protective twin continuation', status: 'Without You remains in Kacho’s form, conceals Kacho’s actual death from Fugetsu, and prioritizes making Fugetsu survive and become King.', source }),
  freeze({ from: 'Melody', to: 'Kurapika', type: 'trusted emergency contact', status: 'Melody identifies Kurapika as the only person she trusts with the complete Fugetsu crisis and asks Kaiser to tell him everything.', source }),
  freeze({ from: 'Kurapika', to: 'Longhi', type: 'contractual cooperation', status: 'Kurapika accepts Longhi’s contract at the Chapter 400 endpoint; terms are not supplied in this chapter synopsis.', source }),
  freeze({ from: 'Kurapika', to: 'Tubeppa Hui Guo Rou', type: 'political collaboration', status: 'Kurapika explicitly agrees to collaborate with Tubeppa, without importing Chapter 401+ treaty details.', source }),
]);

export const succession400ResolvedQuestions = freeze([
  freeze({ question: 'Which broad tier contains the transmitter hidden inside the Heil-Ly base?', resolution: 'The receiver weakens as the Troupe descends toward Tier 4, confirming that the transmitter is above Tier 3 on Tier 2.', boundary: 'Tier 2 is confirmed broadly; exact room coordinates and complete access topology remain unresolved.', chapter: 400, source }),
  freeze({ question: 'Can Fugetsu use Magical Worm more than once per day and create a return route while alone?', resolution: 'Fugetsu reports and demonstrates a Chapter 400 breakthrough: repeated use is now possible and a return door appears without Kacho, limited to returning where she was.', boundary: 'The cause of the change and its relationship to Fugetsu’s deterioration remain unresolved.', chapter: 400, source }),
  freeze({ question: 'Does Melody’s entrancement require the target to hear the performance?', resolution: 'Melody states that covering the ears prevents the demonstrated effect and that unconsciousness is a side effect of music intended to heal.', boundary: 'Broader resistance, maximum range, and all musical conditions remain unresolved.', chapter: 400, source }),
  freeze({ question: 'Does Kurapika accept Longhi’s proposed contract and Tubeppa cooperation?', resolution: 'Yes. Kurapika agrees to the contract and to collaborate with Tubeppa at the chapter endpoint.', boundary: 'The contract terms are not supplied in the Chapter 400 synopsis and are not imported from later chapters.', chapter: 400, source }),
]);

export const succession400Mysteries = freeze([
  freeze({ question: 'What is causing Fugetsu’s rapid aura collapse and hostile-spirit infestation?', evidence: 'Fugetsu is pale and collapses; Melody senses Zetsu-like aura, an unstable heartbeat, and numerous hostile spirits but cannot identify an obvious body, user, or activation route.', status: 'open', lastChapter: '400', source }),
  freeze({ question: 'Is Kaiser manipulated, self-manipulated, or acting from another hidden allegiance?', evidence: 'Kaiser proposes mass assassination and declares love for Melody while Melody hears an unnaturally precise heartbeat and suspects manipulation.', status: 'Melody hypothesis / unresolved', lastChapter: '400', source }),
  freeze({ question: 'Can Tyson’s book and Guardian Spirit Beast influence Nasubi or alter the succession contest?', evidence: 'Izunavi links Giuliano’s calmness to the book and proposes a King-facing reading, but the link and effect are untested.', status: 'open hypothesis', lastChapter: '400', source }),
  freeze({ question: 'Who, if anyone, created the Nen space containing the Heil-Ly hideout?', evidence: 'Nobunaga attributes the space to the enemy boss while discussing why exact location is difficult, but the chapter provides no independent owner reveal.', status: 'Nobunaga attribution / owner unresolved', lastChapter: '400', source }),
  freeze({ question: 'What are the exact terms of Longhi’s contract with Kurapika?', evidence: 'Kurapika accepts after hearing Longhi’s explanation, but the supplied synopsis does not reproduce those terms.', status: 'agreement confirmed / terms unavailable at Chapter 400 boundary', lastChapter: '400', source }),
  freeze({ question: 'What did the emergency broadcast actually announce?', evidence: 'The synopsis supplies only the opening request to pay attention to sad and unfortunate news.', status: 'substantive content unsupplied in the Chapter 400 synopsis', lastChapter: '400', source }),
]);

const focus = 'Chapter 400 confirms the tracked Heil-Ly base broadly on Tier 2 while keeping Hisoka as the Troupe’s primary objective; explores Tyson and Izunavi’s untested plan to use the Book of Tyson against the succession system; preserves human Kacho’s death while Without You organizes Fugetsu’s protection; turns Melody’s performance into prince-level political leverage while leaving Kaiser’s true motive unresolved; reveals Fugetsu’s repeated/solo Magical Worm breakthrough alongside an unidentified hostile-spirit collapse; and ends with Kurapika accepting Longhi’s contract and Tubeppa collaboration without importing the contract terms from Chapter 401+.';

export const succession400ChapterResearch = freeze([
  freeze({
    number: 400,
    title: 'Secrecy',
    japaneseTitle: '秘匿',
    titleStatus: 'retained-from-pre-existing-user-supplied-hunterpedia-verified-metadata',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 10',
    chronology: freeze({ exactClockTime: null, presentDay: true, flashback: false, storyPeriod: 'Voyage Day 10 · active Black Whale succession / mafia conflict', sequenceCertainty: 'chapter story order confirmed; exact clock time unsupplied' }),
    lanes: freeze(['Mafia / Troupe', 'Tyson / Izunavi', 'Kacho & Fugetsu', 'Justice Bureau / Melody & Kaiser', 'Kurapika / Longhi / Tubeppa', 'Nen development']),
    focus,
    events: succession400TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Phinks Magcub', 'Feitan Portor', 'Nobunaga Hazama', 'Franklin Bordeau', 'Hinrigh Biganduffno', 'Hisoka Morow', 'Tyson Hui Guo Rou', 'Izunavi', 'Giuliano', 'Madwig', 'Himoncé', 'Anzel', 'Hyuga', 'Seiko Hui Guo Rou', 'Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Melody', 'Kaiser', 'Steiner', 'Zhang Lei Hui Guo Rou', 'Vantine', 'Tserriednich Hui Guo Rou', 'Benjamin Hui Guo Rou', 'Tubeppa Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Longhi', 'Kurapika', 'Bill']),
    locations: freeze(['Tier 3 public corridors', 'Tier 4 transit route', 'Tier 1 Room 1006', 'Tier 1 Room 1010', 'Tier 2 Justice Bureau', 'Tier 1 Room 1014', 'Tier 2 Heil-Ly hideout broad level']),
    threadLabels: freeze(['Troupe & Hisoka', 'Mafia families', 'Tyson / Book of Tyson', 'Kacho & Fugetsu', 'Justice / military', 'Kurapika / Tubeppa', 'Nen development']),
    confidence: freeze(['All modernized story details derive from the current user-supplied Chapter 400 synopsis; only title metadata is retained from the pre-existing maintained packet.', 'Tier 2 is the broad tracked hideout level, not an exact room fix.', 'Nobunaga’s boss/space attribution remains an inference.', 'Human Kacho remains dead; Without You is the Kacho-form actor.', 'Kaiser Manipulator/self-manipulation remains Melody’s theory.', 'Fugetsu’s repeated Magical Worm use is not established as the cause of the hostile-spirit condition.', 'Longhi contract terms remain unsupplied until later evidence.']),
    status: 'Modernized chapter-bounded research packet with strict Chapter 399 → 400 knowledge transition',
    coverage: freeze({ identity: true, publication: true, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true, knowledgeBoundary: true }),
    lastReviewed: 'August 10, 2026',
    releaseDate: null,
    officialReaderUrl: null,
    source,
    crossChecks: freeze([]),
  }),
]);

export const succession400ChapterFocus = freeze({ 400: focus });
