const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_374';

export const succession374SourcePolicy = freeze({
  reviewedAt: '2026-08-08',
  soleStorySource: 'User-supplied Hunterpedia Chapter 374 synopsis, chapter notes, and drawing-error notes',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  missingPanelData: 'The supplied text says Chapter 374 presents a large prince/queen/guard intelligence layout, but does not include the actual counts or full table. The archive records the panel’s existence without reconstructing missing values.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1', confidence = 'confirmed' }) => freeze({
  id,
  time: 'Voyage Day 2',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 374,
  confidence,
  source,
});

export const succession374TimelineEvents = freeze([
  event({ id: '374-vergei-refuses-room-check', title: 'Vergei rejects Kurapika’s request to test Room 1013 from outside', detail: 'Vergei insists that his household is still in Room 1013 and angrily takes control of the phone exchange. Kurapika proposes having a Hunter from Marayam’s camp step outside to test the apparent spatial separation, but Vergei immediately refuses.', tracks: ['room-1013', 'vergei', 'kurapika', 'marayam', 'spatial-anomaly'], location: 'Black Whale · Tier 1 · Room 1013 / Room 1014 call' }),
  event({ id: '374-kurapika-transport-theory', title: 'Kurapika theorizes that Room 1013 has been transported or spatially displaced by Nen', detail: 'With Hanzo still confirming an empty Room 1013 state, Kurapika argues that a Nen ability is the likely cause and proposes that the occupied quarters have been transported somewhere else. This is Kurapika’s explanation, not a confirmed mechanism.', tracks: ['kurapika', 'hanzo', 'room-1013', 'nen-theory'], location: 'Black Whale · Tier 1 · Room 1014', confidence: 'Kurapika theory; spatial-state mismatch is confirmed, transport mechanism is not' }),
  event({ id: '374-vergei-momoze-suspects', title: 'Vergei redirects the call toward Momoze’s murder suspects', detail: 'Vergei asks about the six suspects tied to Momoze’s assassination and explains that both his client and Kurapika’s client are blocked from obtaining information on suspects belonging to higher-ranked queens.', tracks: ['vergei', 'momoze', 'investigation', 'queen-rank'], location: 'Black Whale · Tier 1 · Room 1013 / Room 1014 call' }),
  event({ id: '374-vergei-hunter-offer', title: 'Vergei offers Momoze’s former professional Hunters in exchange for investigative help', detail: 'Vergei believes Kurapika has a better chance of approaching the higher queens because he is not directly tied to Momoze’s murder case. He offers Hanzo and four other professional Hunters previously assigned to Momoze, but Kurapika refuses because he wants cooperation through a coalition of the younger princes rather than a personnel trade.', tracks: ['vergei', 'kurapika', 'hanzo', 'coalition', 'hunters'], location: 'Black Whale · Tier 1 · Room 1013 / Room 1014 call' }),
  event({ id: '374-kurapika-reveals-tuffdy', title: 'Kurapika tells Vergei that Tuffdy murdered Momoze', detail: 'Kurapika discloses that Tuffdy was Momoze’s killer, including that Tuffdy died in an apparent suicide after somehow committing the murder while still seemingly in bed.', tracks: ['kurapika', 'vergei', 'tuffdy', 'momoze', 'investigation'], location: 'Black Whale · Tier 1 · Room 1013 / Room 1014 call' }),
  event({ id: '374-vergei-conspiracy-suspicion', title: 'Vergei accuses Kurapika and the Association of potentially exploiting the succession ritual', detail: 'Vergei continues to distrust Kurapika, raises the possibility that Kurapika caused deaths around Woble, and speculates that the Hunter Association could be using the Seed Urn Ceremony to destroy Kakin from within.', tracks: ['vergei', 'kurapika', 'hunter-association', 'seed-urn', 'distrust'], location: 'Black Whale · Tier 1 · Room 1013 / Room 1014 call', confidence: 'Vergei suspicion and conspiracy theory; not established fact' }),
  event({ id: '374-hanzo-stays-ethereal', title: 'Hanzo remains in the empty Room 1013 state to watch for changes', detail: 'After the call, Kurapika asks Hanzo to remain in Room 1013 and observe whether anything changes. Hanzo agrees to continue investigating with his ethereal/projected body until the break ends and he must return to his physical body.', tracks: ['hanzo', 'kurapika', 'room-1013', 'hanzo-skill-4'], location: 'Black Whale · Tier 1 · empty Room 1013 state' }),
  event({ id: '374-sakata-briefed', title: 'Kurapika briefs Sakata on the Room 1013 anomaly with Babimyna’s permission', detail: 'Sakata asks Kurapika about Room 1013. Kurapika checks with Babimyna before disclosing the situation, and Babimyna permits the conversation.', tracks: ['kurapika', 'sakata', 'babimyna', 'room-1013', 'information-sharing'], location: 'Black Whale · Tier 1 · Room 1014' }),
  event({ id: '374-marayam-defense-theory', title: 'Kurapika suspects Marayam’s Guardian Spirit Beast created a defensive spatial mechanism', detail: 'Kurapika tells Sakata that the Room 1013 phenomenon may be a defensive effect produced by Marayam’s Guardian Spirit Beast. The responsible ability and exact spatial rules remain unconfirmed.', tracks: ['kurapika', 'sakata', 'marayam', 'guardian-spirit-beast', 'spatial-anomaly'], location: 'Black Whale · Tier 1 · Room 1014', confidence: 'Kurapika hypothesis; beast responsibility not yet confirmed' }),
  event({ id: '374-voyage-37h30', title: 'Voyage time reaches 37 hours 30 minutes after departure', detail: 'The chapter explicitly timestamps the Black Whale at 37 hours and 30 minutes after departure, placing these events on Voyage Day 2.', tracks: ['voyage-time', 'black-whale'], location: 'Black Whale' }),
  event({ id: '374-prince-intel-layout', title: 'Chapter presents a broad prince, queen, guard, servant, and Hunter intelligence layout', detail: 'A large reader-facing layout summarizes royal households and Hunter Association guards. The supplied text does not reproduce the actual numerical table, so no missing counts are reconstructed in the maintained record.', tracks: ['royal-intelligence', 'guards', 'servants', 'hunters'], location: 'Black Whale · reader-facing intelligence panel', confidence: 'Panel existence confirmed; omitted numerical contents intentionally not reconstructed' }),
  event({ id: '374-fugetsu-door-manifests', title: 'A Nen door manifests for Fugetsu and opens a childhood-style tunnel', detail: 'While Fugetsu lies awake looking at a photo of herself and Kacho, a strange door appears on her wall. She recognizes it as resembling the tunnel playset the twins used as children and enters it.', tracks: ['fugetsu', 'kacho', 'guardian-spirit-beast', 'translocation', 'nen-door'], location: 'Black Whale · Tier 1 · Room 1011' }),
  event({ id: '374-fugetsu-reaches-kacho', title: 'Fugetsu’s tunnel exits directly at Kacho’s bed', detail: 'Fugetsu travels through the manifested tunnel and emerges from the top of Kacho’s bed, demonstrating a translocation connection between the twins’ quarters. Kacho immediately motions for her to stay quiet and return.', tracks: ['fugetsu', 'kacho', 'translocation', 'twin-princes'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '374-melody-hears-kacho', title: 'Melody detects Kacho’s rising heartbeat and decides to tell her about Nen', detail: 'Melody hears Kacho’s heartbeat spike when Fugetsu appears. Keeney also senses something and they investigate. Melody recognizes Kacho’s resolve under pressure and decides to explain Nen to her.', tracks: ['melody', 'kacho', 'keeney', 'nen-disclosure'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '374-rihan-analyzes-sale-sale-beast', title: 'Rihan begins a no-assistance analysis of Salé-salé’s Guardian Spirit Beast', detail: 'Rihan avoids the beast’s smoke and analyzes it as a Manipulator of the diffusive-induction type. He believes inhalation gradually creates goodwill toward Salé-salé and, after enough exposure, causes a small clone to appear above a person’s head and spread more smoke.', tracks: ['rihan', 'sale-sale', 'guardian-spirit-beast', 'manipulation', 'predator'], location: 'Black Whale · Tier 1 · Room 1008', confidence: 'Rihan’s analysis/surmise; not omniscient confirmation of every beast mechanic' }),
  event({ id: '374-rihan-koroabde-test', title: 'Rihan uses Koroabde as a timing reference for his analysis', detail: 'Rihan chooses Koroabde, a guard with no loyalty to Salé-salé, as an observation subject so he can estimate how long exposure takes to produce a clone and improve the accuracy of his target analysis.', tracks: ['rihan', 'koroabde', 'sale-sale', 'predator', 'analysis'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '374-predator-revealed', title: 'Predator is revealed as Rihan’s ability-countering Nen ability', detail: 'Once Rihan chooses a target and activates Predator, a predator begins growing inside him. Its effectiveness and superiority over the target depend on how accurately he understands the target ability from a state of ignorance and without assistance from others. The supplied notes state that Predator is ineffective against simple Enhancer and Emitter attacks.', tracks: ['rihan', 'predator', 'nen-ability', 'countermeasure'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '374-predator-target-sale-sale-beast', title: 'Rihan designates Salé-salé’s Guardian Spirit Beast as Predator’s target', detail: 'Rihan makes Salé-salé’s Guardian Spirit Beast the target of Predator while continuing to gather enough information to improve the predator he will produce against it.', tracks: ['rihan', 'sale-sale', 'predator', 'guardian-spirit-beast'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '374-zhang-lei-second-coin', title: 'Zhang Lei’s Guardian Spirit Beast produces a second “1” coin', detail: 'During breakfast, another coin marked with a floral design and the number 1 drops from Zhang Lei’s Guardian Spirit Beast. Zhang Lei notices the coin but does not see its origin.', tracks: ['zhang-lei', 'guardian-spirit-beast', 'coin'], location: 'Black Whale · Tier 1 · Room 1003' }),
  event({ id: '374-coventoba-hides-coin-origin', title: 'Coventoba conceals that the coin came from Zhang Lei’s beast', detail: 'Coventoba picks up the second coin and hands it to Zhang Lei while hiding that it came from the Guardian Spirit Beast. He is also the only person identified in the supplied notes as knowing about the first coin that appeared the previous day.', tracks: ['coventoba', 'zhang-lei', 'coin', 'counterintelligence'], location: 'Black Whale · Tier 1 · Room 1003' }),
]);

export const succession374Room1013Research = freeze({
  observed: freeze([
    'Hanzo still experiences Room 1013 as empty.',
    'Vergei insists that Marayam’s household remains inside Room 1013 and continues to communicate outward.',
    'Vergei refuses Kurapika’s proposed outside-room test.',
  ]),
  kurapikaTheory: 'A Nen ability has spatially displaced or transported the occupied quarters; Kurapika later suspects a defensive mechanism from Marayam’s Guardian Spirit Beast.',
  confidenceBoundary: 'The occupied/empty state split is confirmed. Transport, displacement, Guardian Spirit Beast authorship, and exact access rules remain hypotheses at Chapter 374.',
  source,
});

export const succession374CoalitionResearch = freeze({
  kurapikaGoal: 'Build a defensive coalition among the younger/lower-ranked princes rather than simply acquire additional personnel.',
  vergeiPosition: 'Distrustful. He feigns cooperation but repeatedly suspects Kurapika and the Hunter Association.',
  vergeiOffer: 'Hanzo plus four other professional Hunters formerly assigned to Momoze, in exchange for Kurapika helping obtain information on the higher-queen suspects.',
  kurapikaResponse: 'Refuses the personnel exchange and continues to seek prince-level coalition cooperation.',
  source,
});

export const succession374FugetsuDoorResearch = freeze({
  userOrHost: 'Fugetsu Hui Guo Rou',
  observedManifestation: 'A Nen door resembling the twins’ childhood tunnel playset appears in Fugetsu’s room.',
  observedRoute: 'Fugetsu enters the tunnel from her room and emerges directly at Kacho’s bed.',
  emotionalContext: 'Fugetsu is awake and tearful while looking at a photograph of herself and Kacho immediately before the door appears.',
  unresolved: freeze(['official ability name is not supplied in the Chapter 374 text', 'full activation conditions', 'directionality', 'range', 'frequency', 'whether destination choice is conscious or constrained']),
  source,
});

export const succession374PredatorResearch = freeze({
  ability: 'Predator',
  owner: 'Rihan',
  category: 'Ability-countering analysis-dependent Nen ability',
  activation: 'Rihan chooses a target and activates Nen; a predator begins growing inside him.',
  scalingRule: 'The predator’s strength and superiority over the target ability depend on how accurately Rihan analyzes and understands that ability.',
  informationRestriction: 'The analysis must be built from a state of complete ignorance and without assistance from others.',
  poorMatchups: 'The supplied notes state that Predator is powerless against simple Enhancer and Emitter attacks.',
  chapter374Target: 'Salé-salé’s Guardian Spirit Beast',
  source,
});

export const succession374SaleSaleBeastResearch = freeze({
  observer: 'Rihan',
  analysis: 'Rihan identifies the beast as a Manipulator using a diffusive-induction style effect.',
  proposedMechanism: freeze([
    'The beast emits white smoke.',
    'Breathing the smoke progressively creates goodwill toward Salé-salé.',
    'After sufficient exposure, a small clone appears above the affected person.',
    'The clone also emits smoke, allowing the influence pattern to propagate further.',
  ]),
  testSubject: 'Koroabde',
  confidence: 'These mechanics are presented through Rihan’s active analysis/surmise in Chapter 374. The archive does not convert every inference into omniscient confirmation at this boundary.',
  source,
});

export const succession374ZhangLeiCoinResearch = freeze({
  confirmedCoinsByBoundary: 2,
  secondCoin: freeze({ inscription: '1', design: 'floral', origin: 'ejected from Zhang Lei’s Guardian Spirit Beast', observedBy: 'Coventoba', seenAfterDropBy: 'Zhang Lei and guards present' }),
  firstCoinKnowledge: 'Coventoba is the only person identified by the supplied Chapter 374 notes as knowing about the first coin from the previous day.',
  zhangLeiKnowledge: 'Zhang Lei sees the second coin but Coventoba conceals that it came from the Guardian Spirit Beast.',
  unresolved: freeze(['purpose', 'recipient rules', 'value progression', 'activation conditions', 'effect of holding or spending a coin']),
  source,
});

export const succession374DrawingErrors = freeze([
  freeze({ page: 10, issue: 'Fugetsu door handle drawn on the right in an earlier version.', correction: 'Corrected to the left side in the full release.', archivalRule: 'Use corrected full-release door orientation.', source }),
  freeze({ page: 14, issue: 'Yushohi and Ryoji are drawn guarding Kacho despite being assigned to Fugetsu.', correction: 'Not corrected in the later volume release.', archivalRule: 'Do not treat the panel placement as an assignment change; retain Yushohi and Ryoji with Fugetsu.', source }),
]);

export const succession374RelationshipRecords = freeze([
  freeze({ from: 'Kurapika', to: 'Vergei', type: 'Negotiation under severe distrust', note: 'Kurapika trades Momoze-case information for trust and coalition support; Vergei offers personnel but continues to suspect Kurapika and the Hunter Association.', phase: 'Active contest and voyage', chapters: '374', state: 'communication open / coalition not secured', source }),
  freeze({ from: 'Fugetsu Hui Guo Rou', to: 'Kacho Hui Guo Rou', type: 'Nen-enabled direct access between twin quarters', note: 'Fugetsu’s manifested tunnel takes her from Room 1011 directly to Kacho’s bed in Room 1010.', phase: 'Active contest and voyage', chapters: '374', state: 'first observed translocation connection', source }),
  freeze({ from: 'Rihan', to: 'Salé-salé Hui Guo Rou / Guardian Spirit Beast', type: 'Counter-ability analysis', note: 'Rihan designates Salé-salé’s beast as Predator’s target and begins building an unaided analysis of its smoke-based influence system.', phase: 'Active contest and voyage', chapters: '374', state: 'target analysis in progress', source }),
]);

export const succession374Mysteries = freeze([
  freeze({ question: 'What exact Nen mechanism creates the occupied and empty Room 1013 states?', evidence: 'Hanzo still sees the room as empty while Vergei insists the household remains inside. Kurapika proposes spatial transport/displacement and later suspects Marayam’s Guardian Spirit Beast, but Vergei refuses the proposed outside-room test.', status: 'open / transport and beast authorship remain hypotheses', lastChapter: '374', source }),
  freeze({ question: 'What are the full conditions and limits of Fugetsu’s manifested door-and-tunnel translocation?', evidence: 'A door appears in Fugetsu’s room and a tunnel takes her directly to Kacho’s bed. Chapter 374 does not supply the official ability name or full conditions.', status: 'open mechanics', lastChapter: '374', source }),
  freeze({ question: 'What do Zhang Lei’s Guardian Spirit Beast coins do?', evidence: 'A second coin marked 1 is produced in Chapter 374; Coventoba knows about both observed coins while Zhang Lei is not told their source.', status: 'open / two coins confirmed', lastChapter: '374', source }),
  freeze({ question: 'How accurate is Rihan’s Chapter 374 model of Salé-salé’s Guardian Spirit Beast?', evidence: 'Rihan believes the smoke creates goodwill and reproducing clones after enough exposure, and he is deliberately gathering timing data before using Predator.', status: 'developing analysis / awaiting operational confirmation', lastChapter: '374', source }),
]);

const focus = 'Kurapika and Vergei clash over the unresolved Room 1013 spatial anomaly and a younger-prince coalition; at 37.5 hours into the voyage Fugetsu’s first observed Nen door carries her directly to Kacho, Melody decides to disclose Nen to Kacho, Rihan reveals Predator while analyzing Salé-salé’s smoke-based Guardian Spirit Beast, and Zhang Lei’s beast produces a second coin marked “1.”';

export const succession374ChapterResearch = freeze([
  freeze({
    number: 374,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze(['Room 1013 anomaly', 'Lower-prince coalition', 'Fugetsu and Kacho', 'Rihan / Predator', 'Salé-salé Guardian Spirit Beast', 'Zhang Lei coins']),
    focus,
    events: succession374TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Kurapika', 'Vergei', 'Hanzo', 'Sakata', 'Babimyna', 'Marayam Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Kacho Hui Guo Rou', 'Melody', 'Keeney', 'Rihan', 'Salé-salé Hui Guo Rou', 'Koroabde', 'Zhang Lei Hui Guo Rou', 'Coventoba']),
    appearances: freeze(['Kurapika', 'Vergei', 'Hanzo', 'Sakata', 'Babimyna', 'Marayam Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Kacho Hui Guo Rou', 'Melody', 'Keeney', 'Rihan', 'Salé-salé Hui Guo Rou', 'Koroabde', 'Zhang Lei Hui Guo Rou', 'Coventoba']),
    relationships: succession374RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession374Mysteries,
    abilities: freeze([succession374PredatorResearch]),
    guardianBeasts: freeze([succession374SaleSaleBeastResearch, succession374FugetsuDoorResearch, succession374ZhangLeiCoinResearch]),
    locations: freeze(['Black Whale · Tier 1 · Room 1014', 'Black Whale · Tier 1 · Room 1013', 'Black Whale · Tier 1 · Room 1011', 'Black Whale · Tier 1 · Room 1010', 'Black Whale · Tier 1 · Room 1008', 'Black Whale · Tier 1 · Room 1003']),
    objects: freeze(['Fugetsu manifested door', 'Zhang Lei coin marked 1']),
    organizations: freeze(['Hunter Association']),
    drawingErrors: succession374DrawingErrors,
    coverage: freeze({ chronology: true, appearances: true, relationships: true, bodyStates: false, abilities: true, guardianBeasts: true, mysteries: true, locations: true, drawingErrors: true }),
    confidence: freeze([
      'Kurapika’s transport/displacement explanation for Room 1013 is a theory, not a confirmed Nen mechanism.',
      'Rihan’s classification and smoke model for Salé-salé’s beast are preserved as his analysis.',
      'Fugetsu’s official ability name is not supplied and is not invented in this chapter record.',
      'The royal-intelligence layout is acknowledged but its omitted numerical contents are not reconstructed.',
      'The page-14 Yushohi/Ryoji panel error does not override their actual assignment to Fugetsu.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession374SourcePolicy,
  }),
]);

export const succession374ChapterFocus = freeze({ 374: focus });
