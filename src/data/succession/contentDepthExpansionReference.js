const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const record = (value) => Object.freeze(value);

export const CHAPTER_FORENSIC_FIELDS = freeze([
  'official title', 'Japanese title', 'alternate English renderings', 'official release date', 'volume placement',
  'story day / voyage chronology', 'chronology certainty', 'opening location', 'closing location', 'scene locations',
  'scene participants', 'first Succession appearances', 'latest appearances', 'new abilities', 'newly explained abilities',
  'Guardian Spirit Beasts shown or discussed', 'new Nen rules', 'political revelations', 'succession-rule revelations',
  'mafia developments', 'Phantom Troupe developments', 'Hisoka developments', 'Beyond developments',
  'Dark Continent expedition developments', 'objects introduced', 'object possession changes', 'messages / calls / letters',
  'orders issued', 'alliances formed', 'alliances weakened or broken', 'deaths', 'suspected deaths', 'injuries',
  'disappearances', 'body / identity / consciousness changes', 'curses applied or removed', 'lies and deception',
  'withheld information', 'false beliefs', 'reader-only knowledge', 'faction-exclusive knowledge', 'new questions',
  'resolved questions', 'older mysteries affected', 'immediate consequences', 'delayed consequences',
  'what changed since previous chapter', 'why the chapter matters', 'translation notes', 'confirmed vs inferred interpretation',
  'character cross-links', 'faction cross-links', 'Nen cross-links', 'mystery cross-links', 'scene-to-scene continuity',
]);

export const PRINCE_DOSSIER_FIELDS = freeze([
  'current life status', 'body state', 'identity state', 'consciousness state', 'current location', 'last confirmed appearance',
  'current objective', 'publicly stated objective', 'probable private objective', 'known allies', 'suspected allies',
  'political allies', 'Nen allies', 'military support', 'queen / household backing', 'enemies', 'active threats',
  'who is targeting the prince', 'who the prince believes is targeting them', 'information possessed', 'missing information',
  'false beliefs', 'Nen knowledge', 'personal abilities', 'aura / training state', 'Guardian Spirit Beast', 'beast behavior',
  'beast conditions', 'beast triggers', 'beast targets', 'beast effects', 'beast limitations', 'beast range',
  'host awareness of beast', 'unresolved beast mechanics', 'personal guards', 'queen guards', 'Hunter guards',
  'temporary guards', 'secretly hostile personnel', 'secretly allied personnel', 'dead guards', 'transferred personnel',
  'room / security configuration', 'access restrictions', 'communications access', 'ritual implications', 'curse exposure',
  'assassination attempts suffered', 'assassination attempts initiated', 'political leverage', 'negotiating leverage',
  'largest vulnerability', 'largest unknown', 'chapter-by-chapter status history',
]);

export const SPECIAL_PRINCE_TRACKERS = freeze([
  record({
    id: 'benjamin', entityId: 'character:benjamin-hui-guo-rou', label: 'Benjamin',
    focus: freeze(['Benjamin Baton inheritance ledger', 'private-army roster and deployment', 'Special Martial Law authority', 'information network', 'rival-prince assessments', 'order chronology']),
    canonicalFrame: 'Separate Benjamin’s personal Nen, inherited abilities, formal royal authority, military command, emergency powers, and private-army operations. An inherited ability must never be treated as available unless the archive records the qualifying death and Baton state.',
    questions: freeze(['Which inherited abilities remain usable at the selected chapter?', 'Which soldiers are deployed against which royal households?', 'Where does emergency authority end and contested institutional power begin?']),
  }),
  record({
    id: 'camilla', entityId: 'character:camilla-hui-guo-rou', label: 'Camilla',
    focus: freeze(['Have-Not curse network', 'curse target map', 'curse readiness', 'sacrifice conditions', 'Cat’s Name kept separate from Have-Not operations', 'faction organization']),
    canonicalFrame: 'Camilla’s personal post-mortem counter ability and her household’s Have-Not curse program are different Nen systems. Track users, targets, preparation, trigger state, death state, and countermeasures independently.',
    questions: freeze(['Which Have-Nots remain operational?', 'Which target assignments are confirmed rather than inferred?', 'Which curse conditions are still satisfiable?']),
  }),
  record({
    id: 'zhang-lei', entityId: 'character:zhang-lei-hui-guo-rou', label: 'Zhang Lei',
    focus: freeze(['coin distribution ledger', 'recipient chronology', 'coin value / state changes', 'observed effects', 'hypotheses separated from facts', 'Guardian Beast involvement']),
    canonicalFrame: 'Every coin observation should preserve recipient, chapter, visible state, and observed consequence. Unpublished final effects remain hypotheses even when Zhang Lei or other characters speculate about them.',
    questions: freeze(['What changes are directly observed?', 'What is only Zhang Lei’s interpretation?', 'What remains unknown about the Guardian Spirit Beast’s long-term economic or coercive effect?']),
  }),
  record({
    id: 'tserriednich', entityId: 'character:tserriednich-hui-guo-rou', label: 'Tserriednich',
    focus: freeze(['Nen-training timeline', 'Theta lesson chronology', 'Salkov involvement', 'Ten / Zetsu progress', 'learning-speed comparisons', 'Parallel Future mechanics', 'personal beast vs Guardian Beast separation', 'Room 1004 reality state']),
    canonicalFrame: 'Treat Tserriednich’s personal future-sight ability, his independent Nen beast, and the Seed Urn Guardian Spirit Beast as separate systems. Training progress is chapter-bounded and should not be generalized beyond demonstrated exercises.',
    questions: freeze(['What are the exact activation and perception rules of Parallel Future?', 'Which Room 1004 observations are objectively resolved?', 'Which Guardian Beast mechanics remain unpublished?', 'What does Theta’s scar verify or fail to verify?']),
  }),
  record({
    id: 'tubeppa', entityId: 'character:tubeppa-hui-guo-rou', label: 'Tubeppa',
    focus: freeze(['Kurapika partnership', 'political terms', 'scientific / medical personnel', 'Nen knowledge growth', 'Guardian Beast information']),
    canonicalFrame: 'Separate the political usefulness of Kurapika’s alliance from Tubeppa’s still-limited direct knowledge of Nen and her Guardian Spirit Beast.',
    questions: freeze(['What does Tubeppa personally know at the selected chapter?', 'Which mechanics are known only to Kurapika or her guards?', 'What political leverage does the alliance actually create?']),
  }),
  record({
    id: 'tyson', entityId: 'character:tyson-hui-guo-rou', label: 'Tyson',
    focus: freeze(['Book of Tyson distribution', 'known readers / followers', 'missionary activity', 'taboo / penalty mechanics', 'belief-level uncertainty', 'Guardian Beast effects']),
    canonicalFrame: 'Reader status, follower behavior, Guardian Beast influence, and the book’s taboo / punishment system are separate observations. Do not infer degree of belief from possession of the book alone.',
    questions: freeze(['Which readers are confirmed?', 'What behavior is attributable to belief versus Nen?', 'What exact taboo triggers punishment?']),
  }),
  record({
    id: 'luzurus', entityId: 'character:luzurus-hui-guo-rou', label: 'Luzurus',
    focus: freeze(['Fugetsu trap theory evidence file', 'supporting evidence', 'contradictory evidence', 'alternative suspects', 'Melody / Kaiser / Fugetsu knowledge states']),
    canonicalFrame: 'The theory connecting Luzurus to Fugetsu’s deterioration must remain an investigated hypothesis until the ability source and causal chain are confirmed.',
    questions: freeze(['What evidence actually points to Luzurus?', 'What evidence points elsewhere?', 'Which characters currently act as though the theory is true?']),
  }),
  record({
    id: 'halkenburg', entityId: 'character:halkenburg-hui-guo-rou', label: 'Halkenburg',
    focus: freeze(['body / identity chronology', 'original body', 'current consciousness', 'occupied body', 'who knows / suspects', 'possession-arrow sequence', 'supporter marks', 'supporter roster', 'political objective']),
    canonicalFrame: 'Halkenburg requires a multi-state model. Public death, original-body state, active identity, displaced consciousness, funeral procedure, and operational control cannot be compressed into one alive/dead label.',
    questions: freeze(['Where is Halkenburg’s consciousness at this chapter?', 'What is Balsamilco’s consciousness state?', 'Who has enough information to detect the possession operation?']),
  }),
  record({
    id: 'fugetsu-kacho', entityId: 'character:fugetsu-hui-guo-rou', label: 'Fugetsu / Kacho',
    focus: freeze(['Fugetsu deterioration chronology', 'symptoms', 'curse-source candidates', 'rescue / exorcism attempts', 'Magical Worm mechanics', 'Kacho post-mortem continuation', 'who knows Kacho died', 'escape-plan consequences']),
    canonicalFrame: 'Kacho’s original death and the continuing Kacho-form Nen entity must be tracked separately. Fugetsu’s illness likewise stays multi-causal until a source is canonically identified.',
    questions: freeze(['What is damaging Fugetsu?', 'Can it be removed or stabilized?', 'What exactly persists as Kacho?', 'Who understands the post-mortem continuation?']),
  }),
  record({
    id: 'marayam', entityId: 'character:marayam-hui-guo-rou', label: 'Marayam',
    focus: freeze(['isolated-space room mechanics', 'original vs separated room', 'occupants', 'entry / exit conditions', 'Guardian Beast involvement', 'outside perceptions']),
    canonicalFrame: 'Track physical Room 1013 and the Nen-separated space as distinct location states. Entry, exit, visibility, occupancy, and outside assumptions should remain chapter-bounded.',
    questions: freeze(['Who can enter or leave?', 'What triggers the separation?', 'What does the Guardian Spirit Beast directly control?']),
  }),
  record({
    id: 'woble-oito', entityId: 'character:woble-hui-guo-rou', label: 'Woble / Oito',
    focus: freeze(['Room 1014 incident chronology', 'guard rotations', 'departures and deaths', 'Silent Majority incidents', 'Nen students', 'awakened participants', 'Kurapika security choices', 'Oito training', 'Woble Guardian Beast evidence']),
    canonicalFrame: 'Room 1014 is both a Nen classroom and an assassination-security environment. Record personnel changes, unexplained attacks, training progress, and Guardian Beast evidence without assigning every anomaly to Woble.',
    questions: freeze(['Which threat remains inside the class?', 'Who has awakened Nen?', 'What evidence exists for Woble’s still-unrevealed Guardian Spirit Beast?']),
  }),
]);

export const INVESTIGATION_DOSSIERS = freeze([
  record({
    id: 'silent-majority', label: 'Silent Majority',
    relatedIds: freeze(['ability:silent-majority', 'character:kurapika']),
    facets: freeze(['incident-by-incident victim ledger', 'location and witness table', 'host / snake / doll mechanics', 'range constraints', 'target selection', 'candidate opportunity', 'candidate motive', 'known-Nen contradictions', 'chronology eliminations', 'Kurapika deductions', 'Furykov deductions', 'Babimyna observations', 'fact vs inference mechanics', 'editorial suspect ranking']),
    rule: 'A suspect ranking is editorial analysis only. Opportunity, motive, ability compatibility, and chronology must be displayed separately so a high-ranked suspect is never presented as confirmed identity.',
  }),
  record({
    id: 'beyond-network', label: 'Beyond Netero hidden network',
    relatedIds: freeze(['character:beyond-netero', 'character:longhi', 'character:kurapika', 'ability:beyond-curse-child-network']),
    facets: freeze(['confirmed children', 'possible children', 'mothers / lineage information', 'birth-planning scheme', 'curse mechanics', 'royal target map', 'Longhi disclosure', 'independent corroboration', 'Kurapika acceptance / doubt', 'shipboard faction', 'expedition-team links', 'confinement / communications', 'Nasubi overlap', 'lineage diagram', 'revelation timeline']),
    rule: 'Facts disclosed by Longhi must remain attributed to Longhi until independently corroborated. The target map may contain confirmed, inferred, and unknown cells simultaneously.',
  }),
  record({
    id: 'troupe-hisoka', label: 'Phantom Troupe / Hisoka hunt',
    relatedIds: freeze(['character:hisoka-morow', 'character:chrollo-lucilfer', 'organization:phantom-troupe']),
    facets: freeze(['Spider current / last location', 'current partner group', 'objective', 'information possessed', 'Hisoka sightings', 'false sightings', 'Bonolenov disguise chronology', 'Chrollo resource requirements', 'Kakin treasure objective', 'mafia encounters', 'member-by-member movement', 'Illumi stated vs uncertain motive', 'current collision risk']),
    rule: 'Real Hisoka, transformed actors, rumors, and mistaken identification are distinct evidence states. Location claims must carry a chapter boundary.',
  }),
  record({
    id: 'mafia-war', label: 'Kakin mafia war',
    relatedIds: freeze(['organization:heil-ly', 'organization:xi-yu', 'organization:cha-r', 'character:morena-prudo']),
    facets: freeze(['Heil-Ly member roster', 'levels', 'abilities', 'last seen', 'status', 'kills / points', 'Contagion thresholds', 'Morena objective', 'hideout rooms and portals', 'Xi-Yu hierarchy', 'Cha-R hierarchy', 'Troupe cooperation', 'Hisoka knowledge', 'territory and sponsor map', 'balance of power']),
    rule: 'Exact point totals must be distinguished from estimates. Territory control and alliances should be represented as current operational state, not permanent faction identity.',
  }),
]);

export const KAKIN_ROYAL_REFERENCE = freeze([
  record({ term: 'Royal family tree', category: 'dynasty', summary: 'King Nasubi, eight queens, fourteen princes, maternal branches, and chapter-bounded family / household relationships should resolve into one genealogy.' }),
  record({ term: 'Seed Urn Ceremony', category: 'ritual', summary: 'The succession candidates undergo a Kakin royal Nen ceremony that grants parasitic Guardian Spirit Beasts. Ceremony facts, ritual hypotheses, and end-state theories must remain separate.' }),
  record({ term: 'Succession participation', category: 'ritual', summary: 'The archive tracks known participation rules, apparent inability to simply escape the contest, and the still-unpublished exact completion condition.' }),
  record({ term: 'Guardian Spirit Beast shared rules', category: 'nen', summary: 'Shared host / visibility / autonomy constraints belong to the Seed Urn system; each beast’s individual ability must be recorded separately.' }),
  record({ term: 'Royal burial apparatus', category: 'ritual', summary: 'The fourteen candidate-linked caskets and central apparatus are canonical objects whose full Nen purpose remains unresolved.' }),
  record({ term: 'Kakin national treasures', category: 'artifact', summary: 'Royal treasures have ceremonial and current strategic significance. Chrollo’s interest is tracked without assuming an unrevealed mechanic.' }),
  record({ term: 'Special Martial Law', category: 'law', summary: 'Emergency military authority changes confinement, movement, command, and institutional pressure. The archive distinguishes formally established authority from contested reach.' }),
  record({ term: 'Royal household security', category: 'security', summary: 'Personal guards, queen guards, Association personnel, military observers, infiltrators, and transferred assignments create overlapping chains of duty and loyalty.' }),
]);

export const INFORMATION_WAR_TOPICS = freeze([
  'prince Nen capability', 'Guardian Spirit Beast existence', 'Seed Urn rules', 'Succession completion condition', 'Kacho death',
  'Kacho post-mortem continuation', 'Halkenburg body / identity state', 'Silent Majority', 'Heil-Ly Nen network',
  'Morena Contagion rules', 'Hisoka presence', 'Phantom Troupe presence', 'Beyond child network', 'martial-law planning',
  'Fugetsu condition', 'Tserriednich future sight', 'Room 1004 reality state', 'Benjamin health / curse pressure',
]);

export const DEEP_GLOSSARY_ENTRIES = freeze([
  record({ id: 'seed-urn-ceremony-deep', term: 'Seed Urn Ceremony', category: 'Ritual', firstChapter: 349, certainty: 'canon', synonyms: freeze(['Seed Urn', 'Succession Ceremony']), definition: 'Kakin royal Nen ceremony used to initiate the current succession contest and grant parasitic Guardian Spirit Beasts to participating princes.', relatedEntityIds: freeze(['character:nasubi-hui-guo-rou']), sourceIds: freeze(['source:chapter-349']) }),
  record({ id: 'guardian-spirit-beast-deep', term: 'Guardian Spirit Beast', category: 'Nen', firstChapter: 349, certainty: 'canon', synonyms: freeze(['GSB', 'guardian beast']), definition: 'Parasitic Nen beast produced by the Seed Urn succession system. Shared ritual rules and each individual beast’s ability are separate layers of the archive.', relatedEntityIds: freeze([]), sourceIds: freeze(['source:chapter-349']) }),
  record({ id: 'have-nots-deep', term: 'Have-Nots', category: 'Royal household', firstChapter: 389, certainty: 'canon', synonyms: freeze(['Untouchables']), definition: 'Camilla-aligned sacrificial curse operatives whose individual target assignments and activation conditions are tracked as a curse network.', relatedEntityIds: freeze(['character:camilla-hui-guo-rou']), sourceIds: freeze(['source:chapter-389']) }),
  record({ id: 'royal-army-deep', term: 'Kakin Royal Army', category: 'Institution', firstChapter: 358, certainty: 'canon', synonyms: freeze(['Kakin military', 'Royal Army']), definition: 'Kakin military institution whose command, prince-linked units, surveillance duties, and Special Martial Law authority intersect the succession conflict.', relatedEntityIds: freeze(['organization:kakin-military']), sourceIds: freeze(['source:chapter-358', 'source:chapter-415']) }),
  record({ id: 'queen-guards-deep', term: 'Queen guards', category: 'Security', firstChapter: 358, certainty: 'canon', synonyms: freeze(['queen household guards']), definition: 'Royal personnel assigned through a queen or maternal household whose formal post may differ from their practical loyalty or reporting chain.', relatedEntityIds: freeze([]), sourceIds: freeze(['source:chapter-358']) }),
  record({ id: 'association-guards-deep', term: 'Hunter Association guards', category: 'Security', firstChapter: 350, certainty: 'canon', synonyms: freeze(['provisional Hunter guards', 'Association bodyguards']), definition: 'Hunters placed into prince-protection assignments for the voyage, including Kurapika’s recruitment network and other contracted personnel.', relatedEntityIds: freeze(['character:kurapika']), sourceIds: freeze(['source:chapter-350']) }),
  record({ id: 'black-whale-tier-system-deep', term: 'Black Whale tier system', category: 'Location', firstChapter: 359, certainty: 'canon', synonyms: freeze(['tiers', 'ship tiers']), definition: 'The Black Whale’s stratified passenger, royal, military, and criminal geography. This glossary entry explains the social / operational meaning, while the ship workspace owns the map.', relatedEntityIds: freeze([]), sourceIds: freeze(['source:chapter-359']) }),
  record({ id: 'justice-bureau-deep', term: 'Justice Bureau', category: 'Institution', firstChapter: 381, certainty: 'canon', synonyms: freeze(['Kakin Justice Bureau']), definition: 'Kakin legal / investigative institution whose custody, inquiry, and institutional independence come under pressure during the succession and martial-law phases.', relatedEntityIds: freeze(['organization:kakin-justice-bureau']), sourceIds: freeze(['source:chapter-381', 'source:chapter-417']) }),
  record({ id: 'special-martial-law-deep', term: 'Special Martial Law', category: 'Law', firstChapter: 415, certainty: 'canon', synonyms: freeze(['martial law']), definition: 'Emergency regime formally activated in the current succession phase, expanding military control over movement, custody, and operations while leaving some institutional limits contested.', relatedEntityIds: freeze(['character:benjamin-hui-guo-rou', 'organization:kakin-military']), sourceIds: freeze(['source:chapter-415', 'source:chapter-417']) }),
  record({ id: 'xi-yu-deep', term: 'Xi-Yu Family', category: 'Mafia', firstChapter: 378, certainty: 'canon', synonyms: freeze(['Xi-Yu']), definition: 'One of Kakin’s major mafia families aboard the Black Whale, tied to a royal sponsor and drawn into the Heil-Ly crisis, Hisoka search, and Troupe negotiations.', relatedEntityIds: freeze(['organization:xi-yu']), sourceIds: freeze(['source:chapter-378']) }),
  record({ id: 'cha-r-deep', term: 'Cha-R Family', category: 'Mafia', firstChapter: 378, certainty: 'canon', synonyms: freeze(['Cha-R']), definition: 'One of Kakin’s major mafia families aboard the Black Whale, maintaining its own hierarchy, territory, and tactical cooperation with the Phantom Troupe against Heil-Ly.', relatedEntityIds: freeze(['organization:cha-r']), sourceIds: freeze(['source:chapter-378']) }),
  record({ id: 'heil-ly-deep', term: 'Heil-Ly Family', category: 'Mafia', firstChapter: 378, certainty: 'canon', synonyms: freeze(['Heil-Ly']), definition: 'Morena Prudo’s reorganized mafia faction operating a Contagion-based leveling network and insurgent campaign against the established ship order.', relatedEntityIds: freeze(['organization:heil-ly', 'character:morena-prudo']), sourceIds: freeze(['source:chapter-378', 'source:chapter-394']) }),
  record({ id: 'contagion-deep', term: 'Contagion', category: 'Nen', firstChapter: 394, certainty: 'canon', synonyms: freeze(['Etude of Love']), definition: 'Morena’s Nen system that recruits members into a level-based killing network and enables ability awakening under published threshold rules.', relatedEntityIds: freeze(['character:morena-prudo']), sourceIds: freeze(['source:chapter-394']) }),
  record({ id: 'benjamin-baton-deep', term: 'Benjamin Baton', category: 'Nen', firstChapter: 363, certainty: 'canon', synonyms: freeze(['Those Who Inherit the Stars']), definition: 'Benjamin’s inheritance ability that can receive qualifying Nen abilities from deceased loyal private soldiers under its own conditions.', relatedEntityIds: freeze(['character:benjamin-hui-guo-rou']), sourceIds: freeze(['source:chapter-363']) }),
  record({ id: 'parallel-future-deep', term: 'Parallel Future', category: 'Nen', firstChapter: 387, certainty: 'canon', synonyms: freeze(['Tserriednich future sight']), definition: 'Tserriednich’s future-perception ability activated through Zetsu, creating a divergence between what he previews and what other observers continue to experience.', relatedEntityIds: freeze(['character:tserriednich-hui-guo-rou']), sourceIds: freeze(['source:chapter-387']) }),
  record({ id: 'magical-worm-deep', term: 'Magical Worm', category: 'Nen', firstChapter: 376, certainty: 'canon', synonyms: freeze(['Fugetsu’s tunnel', 'Fugetsu travel ability']), definition: 'Fugetsu’s Guardian Spirit Beast travel system, whose route use, limitations, and relationship to her deteriorating condition must be tracked separately from unconfirmed curse causes.', relatedEntityIds: freeze(['character:fugetsu-hui-guo-rou']), sourceIds: freeze(['source:chapter-376', 'source:chapter-388']) }),
  record({ id: 'silent-majority-deep', term: 'Silent Majority', category: 'Nen', firstChapter: 369, certainty: 'canon', synonyms: freeze([]), definition: 'Unresolved assassination / surveillance ability operating around Kurapika’s Nen-class environment. The user identity and complete host / range / target rules remain open.', relatedEntityIds: freeze(['character:kurapika']), sourceIds: freeze(['source:chapter-369', 'source:chapter-376']) }),
  record({ id: 'royal-caskets-deep', term: 'Royal casket apparatus', category: 'Ritual', firstChapter: 371, certainty: 'canon', synonyms: freeze(['fourteen caskets', 'burial chamber']), definition: 'Candidate-linked royal burial apparatus associated with deceased succession princes. Its exact Nen function is intentionally unresolved in the published record.', relatedEntityIds: freeze(['character:nasubi-hui-guo-rou']), sourceIds: freeze(['source:chapter-371', 'source:chapter-404']) }),
  record({ id: 'kakin-national-treasures-deep', term: 'Kakin national treasures', category: 'Artifact', firstChapter: 349, certainty: 'canon', synonyms: freeze(['Kakin sacred treasures']), definition: 'Royal artifacts tied to Kakin ceremony and state power. Their full mechanics and the exact object relevant to Chrollo’s current plan remain partly unresolved.', relatedEntityIds: freeze(['character:chrollo-lucilfer']), sourceIds: freeze(['source:chapter-349', 'source:chapter-406']) }),
  record({ id: 'provisional-hunter-deep', term: 'Provisional Hunter', category: 'Institution', firstChapter: 350, certainty: 'canon', synonyms: freeze(['temporary Hunter license']), definition: 'Voyage-era Hunter status used in the recruitment and protection plan around the succession conflict; holders still require chapter-specific role and assignment records.', relatedEntityIds: freeze(['character:kurapika']), sourceIds: freeze(['source:chapter-350']) }),
  record({ id: 'v6-deep', term: 'V6', category: 'Politics', firstChapter: 342, certainty: 'canon', synonyms: freeze([]), definition: 'Political grouping formed when Kakin joins the established international powers around the Dark Continent expedition framework.', relatedEntityIds: freeze([]), sourceIds: freeze(['source:chapter-342']) }),
  record({ id: 'v5-deep', term: 'V5', category: 'Politics', firstChapter: 342, certainty: 'canon', synonyms: freeze([]), definition: 'The preexisting group of major world powers managing Dark Continent policy before Kakin’s expedition reshapes the arrangement.', relatedEntityIds: freeze([]), sourceIds: freeze(['source:chapter-342']) }),
]);

export const LEDGER_DEFINITIONS = freeze([
  record({ id: 'death', label: 'Death ledger', basis: 'life-state transitions and explicit event / character records' }),
  record({ id: 'last-seen', label: 'Last-seen ledger', basis: 'character appearance index' }),
  record({ id: 'injury', label: 'Injury ledger', basis: 'event and state text matching injury / poisoning / trauma' }),
  record({ id: 'missing', label: 'Missing / uncertain-status ledger', basis: 'unknown or unresolved state plus story-thread evidence' }),
  record({ id: 'body-identity', label: 'Body / identity / consciousness ledger', basis: 'structured state model' }),
  record({ id: 'curse', label: 'Curse ledger', basis: 'curse abilities, protocols, assignments, and events' }),
  record({ id: 'guardian-beast', label: 'Guardian Beast effect ledger', basis: 'beast dossiers and linked events' }),
  record({ id: 'assassination', label: 'Assassination attempt ledger', basis: 'threat relationships and assignments' }),
  record({ id: 'nen-awakening', label: 'Nen awakening / training ledger', basis: 'training events and ability-knowledge boundary' }),
  record({ id: 'alliance', label: 'Alliance / betrayal ledger', basis: 'relationship-state records' }),
  record({ id: 'contract', label: 'Contract / deal ledger', basis: 'assignments, protocols, relationships, and negotiation events' }),
  record({ id: 'orders', label: 'Order / command / custody ledger', basis: 'military, justice, surveillance, and assignment records' }),
  record({ id: 'communications', label: 'Communication / disclosure ledger', basis: 'knowledge acquisition and disclosure records' }),
  record({ id: 'deception', label: 'Lie / deception ledger', basis: 'deception relationships and false-belief knowledge records' }),
  record({ id: 'objects', label: 'Object possession ledger', basis: 'artifact and object state records' }),
  record({ id: 'coins', label: 'Zhang Lei coin ledger', basis: 'coin-linked events, objects, and prince dossier' }),
  record({ id: 'tyson-book', label: 'Book of Tyson ledger', basis: 'document / object and follower records' }),
  record({ id: 'treasures', label: 'Kakin treasure ledger', basis: 'artifact records and ritual / Chrollo evidence' }),
  record({ id: 'heil-ly-level', label: 'Heil-Ly level ledger', basis: 'member records, Contagion system, and chapter appearances' }),
  record({ id: 'benjamin-baton', label: 'Benjamin Baton inheritance ledger', basis: 'ability ownership and soldier death state' }),
  record({ id: 'have-not', label: 'Have-Not target ledger', basis: 'curse assignments and Camilla household records' }),
  record({ id: 'guards', label: 'Guard assignment ledger', basis: 'active and historical assignment records' }),
]);

export const READER_ORIENTATION_CHECKPOINTS = freeze([390, 400, 410, 415, 417]);

export const EVIDENCE_QUALITY_RULES = freeze([
  record({ id: 'source-every-claim', label: 'Source factual assertions', rule: 'A published factual record should resolve to chapter, volume, author comment, or maintained reference evidence.' }),
  record({ id: 'canon-inference-theory', label: 'Separate canon / inference / theory', rule: 'Interpretive confidence is explicit and never inferred from confident prose.' }),
  record({ id: 'unknown-explicit', label: 'Represent unknowns explicitly', rule: 'Unknown fields stay unknown instead of disappearing from the dossier.' }),
  record({ id: 'translation-layer', label: 'Preserve translation layer', rule: 'Official English wording, Japanese wording, and community alternatives can coexist when interpretation depends on terminology.' }),
  record({ id: 'review-boundary', label: 'Record review boundary', rule: 'Every dossier should expose the latest chapter its state is valid through.' }),
  record({ id: 'last-evidence', label: 'Track latest evidence', rule: 'The newest supporting chapter is distinct from the date the record was edited.' }),
  record({ id: 'supersession', label: 'Preserve superseded interpretations', rule: 'When later chapters invalidate a theory, the archive should retain the correction trail instead of silently rewriting history.' }),
  record({ id: 'confidence', label: 'Evidence confidence', rule: 'Confidence reflects the evidence state, not popularity of a theory.' }),
]);

export const REFERENCE_APPENDICES = freeze([
  'Succession dramatis personae', 'character pronunciation / romanization guide', 'Japanese-name index', 'alias index',
  'royal genealogy', 'mafia hierarchy', 'Benjamin private-army hierarchy', 'Hunter assignment chart', 'queen / guard assignment chart',
  'prince security comparison', 'prince Nen-knowledge comparison', 'Guardian Spirit Beast comparison', 'prince survival comparison',
  'editorial prince-threat comparison', 'known Nen users aboard ship', 'suspected Nen users', 'plot-significant non-users',
  'ability interaction / counter index', 'unexplained abilities', 'abilities of deceased owners', 'post-mortem abilities',
  'unavailable abilities', 'transferred / inherited abilities', 'group-dependent abilities', 'curse / exorcism reference',
  'communication network', 'who-can-contact-whom matrix', 'major-object index', 'important weapons', 'important documents',
  'important devices', 'Kakin institutions', 'military / security branches', 'invoked laws', 'succession rules vs ordinary law',
  'martial-law consequences', 'arrests / detention', 'interrogations', 'investigations', 'surveillance', 'information leaks',
  'informants', 'double agents', 'false identities', 'disguises', 'secret affiliations', 'plan outcome index', 'failed plans',
  'ongoing plans', 'abandoned plans', 'chapter cliffhangers', 'major reveals', 'foreshadowing / reference-back index with explicit uncertainty',
]);
