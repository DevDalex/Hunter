const freeze = (value) => Object.freeze(value);
const source390 = 'https://hunterxhunter.fandom.com/wiki/Chapter_390';

export const succession390SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 390 synopsis text',
  chapterUrl: source390,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Treat the opening Coventoba coin scene as a direct continuation of the Chapter 389 present-day Zhang Lei scene. Voyage Day 10 continuity is retained from that immediate handoff, but Chapter 390 supplies no exact clock time and none is invented.',
  excluded: freeze([
    'All outside story claims',
    'Later-chapter outcomes or mechanics not contained in the supplied Chapter 390 synopsis',
    'Treating Zhang Lei or Coventoba speculation about the coin as confirmed mechanics',
    'Inventing a formal name or Nen category for Hinrigh’s object-to-animal transformation ability',
    'Expanding Bloody Mary or Body and Soul beyond the effects directly demonstrated in the supplied synopsis',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = null, confidence = 'Confirmed in the supplied Hunterpedia Chapter 390 synopsis' }) => freeze({
  id,
  day: 10,
  time: 'Voyage Day 10 · exact clock time unsupplied',
  chronology: 'direct Chapter 389 present-day continuation; exact clock time unsupplied',
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 390,
  confidence,
  source: source390,
});

export const succession390TimelineEvents = freeze([
  timelineEvent({
    id: '390-coventoba-coin-aura-continuity',
    label: 'Coventoba confirms the changed 10 coin still carries the original aura signature',
    detail: 'Coventoba is startled that his Zhang Lei coin now displays 10 instead of 1. He briefly wonders whether it could be a different coin, but recognizes the same aura he felt from the original. He considers placing it into the Guardian Spirit Beast’s mouth and rejects the experiment as too risky. Tenftory’s separately received coin still displays 1.',
    people: ['Coventoba', 'Tenftory', 'Zhang Lei Hui Guo Rou'],
    tracks: ['zhang-lei', 'guardian-spirit-beast', 'coins', 'nen'],
    location: 'Tier 1 · Room 1003',
  }),
  timelineEvent({
    id: '390-zhang-lei-consults-onior',
    label: 'Zhang Lei consults Onior about Nen and Guardian Spirit Beasts',
    detail: 'Zhang Lei visits Xi-Yu boss Onior, says three siblings have already died in the succession battle, and asks whether Onior knows anything about Guardian Spirit Beasts or Nen. Onior says he knows nothing about Guardian Spirit Beasts and, as a Second-Track Faker, has no personal Nen expertise, but knows younger members of his organization who know about Nen and promises to ask them.',
    people: ['Zhang Lei Hui Guo Rou', 'Onior Longbao'],
    tracks: ['zhang-lei', 'xi-yu', 'nen', 'succession'],
    location: 'Tier 3 · Xi-Yu boss room',
  }),
  timelineEvent({
    id: '390-onior-orders-hinrigh-hisoka-morena-operation',
    label: 'Onior orders Hinrigh to find Hisoka and kill Morena while managing the Phantom Troupe',
    detail: 'Onior calls Hinrigh while Hinrigh is returning toward the Heil-Ly base on Tier 4. Hinrigh favors crushing Morena first. Onior orders Xi-Yu to search for Hisoka on Tier 3, permit the Phantom Troupe to search Tier 4, and kill Morena during the operation, hoping the controlled access will help constrain the Troupe’s movements.',
    people: ['Onior Longbao', 'Hinrigh Biganduffno', 'Morena Prudo', 'Hisoka Morow'],
    tracks: ['xi-yu', 'heil-ly', 'troupe', 'hisoka', 'mafia'],
    location: 'Tier 4 · telephone coordination',
  }),
  timelineEvent({
    id: '390-hinrigh-lynch-zakuro-enter-tier3',
    label: 'Hinrigh brings Lynch and Zakuro onto Tier 3 for the expanded manhunt',
    detail: 'Hinrigh recruits Lynch Fullbokko and Zakuro Custard for the new task. The three enter Tier 3 and notice two Heil-Ly members at a burger restaurant. The male sends his female companion to notify Morena; Hinrigh follows her while Lynch and Zakuro confront the man.',
    people: ['Hinrigh Biganduffno', 'Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'heil-ly', 'tier-3', 'manhunt'],
    location: 'Tier 3 · burger restaurant area',
  }),
  timelineEvent({
    id: '390-tier3-heilly-fight-bloody-mary-body-and-soul',
    label: 'The Tier 3 confrontation reveals Bloody Mary and Body and Soul',
    detail: 'A third Heil-Ly member slashes Zakuro deeply across the neck while the first opponent kicks Lynch. Zakuro then subdues his attacker with Bloody Mary and explicitly thanks him for drawing blood that Zakuro says he could not draw from himself. Lynch strikes her opponent and uses Body and Soul while questioning him, learning basic information about Heil-Ly’s goal and Morena’s ability.',
    people: ['Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'heil-ly', 'nen', 'bloody-mary', 'body-and-soul'],
    location: 'Tier 3 · burger restaurant area',
  }),
  timelineEvent({
    id: '390-heilly-civilian-registration-warning',
    label: 'Hinrigh learns that the encountered Heil-Ly members are registered as civilians',
    detail: 'The female Heil-Ly member tells Hinrigh that the group is registered on the Black Whale as civilians rather than Mafia members. Hinrigh recognizes that an open Mafia-versus-civilian fight would create serious consequences and returns to stop Lynch and Zakuro.',
    people: ['Hinrigh Biganduffno', 'Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'heil-ly', 'legal-cover', 'ship-security'],
    location: 'Tier 3',
  }),
  timelineEvent({
    id: '390-hinrigh-gun-snake-soldier-kill',
    label: 'Hinrigh covertly transforms soldiers’ guns into live snakes and kills them',
    detail: 'Two soldiers agree to let Hinrigh’s group leave if they do not return to Tier 3. Hinrigh appears to accept, offers bribe money, and touches their guns. Afterward, the gun barrels become live snakes whose mouths fire gunshots, killing both soldiers. Hinrigh mockingly apologizes for breaking his promise.',
    people: ['Hinrigh Biganduffno', 'Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'nen', 'ship-security', 'tier-3'],
    location: 'Tier 3 · exit route',
  }),
]);

export const succession390ZhangLeiCoinResearch = freeze({
  openingContinuity: 'The chapter opens immediately on Coventoba reacting to the 1-to-10 change established at the end of Chapter 389.',
  auraObservation: 'Coventoba briefly questions whether the object might be a different coin but recognizes the same aura as the first coin. This is strong in-story evidence of continuity, but the archive does not invent a separate identity-verification mechanic beyond his aura recognition.',
  tenftoryComparison: 'Tenftory possesses a separate coin that still displays 1 while Coventoba’s displays 10.',
  rejectedExperiment: 'Coventoba considers putting his coin into the Guardian Spirit Beast’s mouth and decides the experiment is too risky. No result exists because he does not perform it.',
  zhangLeiTheory: 'Zhang Lei thinks the coins may eventually be distributed to the population once he becomes King.',
  boundary: 'Chapter 390 confirms same-aura continuity and a simultaneous 10-versus-1 comparison between two holders. It does not explain the trigger, timing rule, number meaning, future distribution mechanics, threshold, or eventual holder effect.',
  source: source390,
});

export const succession390ZhangLeiOniorResearch = freeze({
  visit: 'Zhang Lei leaves his room and visits Onior Longbao in the Xi-Yu boss’s room.',
  successionStatement: 'Zhang Lei tells Onior that three of his siblings have already died in the succession battle. The supplied synopsis does not identify those three in this conversation, so this packet does not infer an unstated list.',
  knowledgeBoundary: 'Onior says he knows nothing about Guardian Spirit Beasts. As a Second-Track Faker he is not presented here as personally knowledgeable about Nen, although he knows younger Xi-Yu members who do know about it.',
  assistance: 'Onior promises to ask those younger members about Nen for Zhang Lei.',
  familyState: 'The supplied synopsis explicitly describes Zhang Lei as entrusting the matter to his father, Onior. The archive records that parent-child relationship without expanding it into unsupported succession eligibility or inheritance claims.',
  source: source390,
});

export const succession390XiYuOperationResearch = freeze({
  command: 'Onior directs Hinrigh to search Tier 3 for Hisoka, permit the Phantom Troupe to search Tier 4, and kill Morena while the operation unfolds.',
  controlLogic: 'Onior hopes controlled Tier 4 access will let Xi-Yu influence or constrain the Phantom Troupe’s movement rather than granting the Troupe unrestricted freedom.',
  hinrighPriority: 'Hinrigh argues Morena should be crushed first.',
  fieldTeam: 'Hinrigh recruits Lynch and Zakuro for the expanded manhunt and moves the team onto Tier 3.',
  encounteredCover: 'The Heil-Ly members encountered on Tier 3 are registered in ship records as civilians rather than Mafia members, creating a legal/political risk if Xi-Yu openly fights them.',
  boundary: 'The civilian-registration fact is confirmed for the encountered group in the supplied synopsis. It is not generalized into a claim that every Heil-Ly member uses identical paperwork.',
  source: source390,
});

export const succession390NenAbilityResearch = freeze({
  bloodyMary: freeze({
    user: 'Zakuro Custard',
    officialName: 'Bloody Mary',
    demonstratedEffect: 'After receiving a deep neck cut, Zakuro uses Bloody Mary to subdue the attacker.',
    bloodConditionEvidence: 'Zakuro says he needed more blood and thanks the attacker for cutting him because he could not do so himself. The chapter therefore directly links available blood from the wound to the demonstrated use.',
    unknowns: freeze(['Nen category', 'Exact manipulation method', 'Range', 'Maximum blood volume', 'Duration', 'Whether every use requires an enemy-inflicted wound']),
  }),
  bodyAndSoul: freeze({
    user: 'Lynch Fullbokko',
    officialName: 'Body and Soul',
    demonstratedEffect: 'Lynch attacks an opponent, asks questions through the ability, and learns basic information about Heil-Ly’s goal and Morena’s ability.',
    boundary: 'The supplied synopsis confirms successful interrogation/information acquisition but does not establish a universal truth-compulsion rule, exact wording requirements, range, duration, or Nen category.',
  }),
  hinrighTransformation: freeze({
    user: 'Hinrigh Biganduffno',
    officialName: null,
    nameStatus: 'No formal ability name is supplied in the Chapter 390 synopsis.',
    demonstratedEffect: 'After touching two soldiers’ guns, Hinrigh causes the barrels to become live snakes. The snake mouths then fire gunshots and kill the soldiers.',
    boundary: 'The transformation and retained gunfire function are directly demonstrated. The archive does not invent a formal ability name, Nen type, maximum duration, transformation limit, range, or target-count rule from this chapter alone.',
  }),
  source: source390,
});

export const succession390RelationshipRecords = freeze([
  freeze({
    id: 'relationship:zhang-lei-onior-ch390-father-son',
    from: 'Zhang Lei Hui Guo Rou',
    to: 'Onior Longbao',
    type: 'family',
    chapter: 390,
    state: 'Zhang Lei seeks Onior’s advice and assistance on Nen and Guardian Spirit Beasts, and the supplied synopsis explicitly identifies Onior as his father.',
    boundary: 'Parentage and consultation are recorded; no further biological, legal, or ritual implication is inferred.',
    source: source390,
  }),
  freeze({
    id: 'relationship:onior-hinrigh-ch390-command',
    from: 'Onior Longbao',
    to: 'Hinrigh Biganduffno',
    type: 'command',
    chapter: 390,
    state: 'Onior gives Hinrigh the Tier 3 Hisoka search, Tier 4 Troupe-access, and Morena-elimination orders.',
    boundary: 'The command is explicit; success of the objectives is not established in Chapter 390.',
    source: source390,
  }),
  freeze({
    id: 'relationship:xi-yu-phantom-troupe-ch390-controlled-access',
    from: 'Xi-Yu Family',
    to: 'Phantom Troupe',
    type: 'alliance',
    chapter: 390,
    state: 'Xi-Yu plans to permit the Phantom Troupe to search Tier 4 while attempting to control the Troupe’s movements through that access arrangement.',
    boundary: 'This is tactical accommodation, not trust, permanent alliance, or Xi-Yu command over the Troupe.',
    source: source390,
  }),
]);

export const succession390ResolvedQuestions = freeze([
  freeze({
    question: 'Does Coventoba’s 10 coin still carry the aura he associated with the original 1 coin?',
    chapter: 390,
    resolution: 'Yes. Coventoba recognizes the same aura despite the changed number, strengthening continuity of the object while leaving the number-change mechanism unresolved.',
    source: source390,
  }),
  freeze({
    question: 'Which Xi-Yu field abilities are directly demonstrated during the Tier 3 confrontation?',
    chapter: 390,
    resolution: 'Zakuro demonstrates Bloody Mary, Lynch demonstrates Body and Soul, and Hinrigh demonstrates an unnamed object-to-animal transformation effect by turning soldiers’ gun barrels into live snakes that still fire.',
    source: source390,
  }),
]);

export const succession390Mysteries = freeze([
  freeze({ question: 'What causes Zhang Lei’s coins to change number, and what does the number represent?', chapter: 390, status: 'open; Chapter 390 adds same-aura continuity and a 10-versus-1 holder comparison but no causal rule', source: source390 }),
  freeze({ question: 'What eventual effect will Zhang Lei’s coins have on their holders?', chapter: 390, status: 'open', source: source390 }),
  freeze({ question: 'What are the complete mechanics and Nen category of Bloody Mary?', chapter: 390, status: 'open; blood-linked use is demonstrated but the full rule set is not supplied', source: source390 }),
  freeze({ question: 'What are the complete mechanics and Nen category of Body and Soul?', chapter: 390, status: 'open; successful interrogation is demonstrated but the full information-extraction rule is not supplied', source: source390 }),
  freeze({ question: 'What is the formal name, Nen category, and complete rule set of Hinrigh’s object-to-animal transformation ability?', chapter: 390, status: 'open; gun-to-snake transformation and retained firing are demonstrated', source: source390 }),
  freeze({ question: 'Can Xi-Yu contain Heil-Ly and use controlled Troupe access without losing control of the lower-tier conflict?', chapter: 390, status: 'open', source: source390 }),
]);

export const succession390ChapterResearch = freeze([
  freeze({
    number: 390,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 10',
    source: source390,
    sourcePolicy: succession390SourcePolicy,
    chronology: freeze({
      voyageDay: 'Voyage Day 10 continuation inherited from the immediate Chapter 389 present-day handoff',
      exactClockTime: null,
      opening: 'Direct continuation of Coventoba observing his coin change from 1 to 10 at the end of Chapter 389.',
      boundary: 'No exact Chapter 390 clock time is supplied; none is invented.',
    }),
    focus: 'Coventoba’s coin observation gains same-aura continuity while Zhang Lei turns to Onior for Nen advice; Xi-Yu then expands its Hisoka/Morena operation onto Tier 3, where Zakuro’s Bloody Mary, Lynch’s Body and Soul, Heil-Ly’s civilian paperwork cover, and Hinrigh’s gun-to-snake transformation are directly demonstrated.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Zhang Lei coins', 'Xi-Yu Family', 'Heil-Ly', 'Phantom Troupe / Hisoka search', 'Nen ability demonstrations', 'Tier 3 security']),
    events: succession390TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Coventoba', 'Tenftory', 'Zhang Lei Hui Guo Rou', 'Onior Longbao', 'Hinrigh Biganduffno', 'Lynch Fullbokko', 'Zakuro Custard', 'Morena Prudo', 'Hisoka Morow']),
    locations: freeze(['Tier 1 · Room 1003', 'Tier 3 · Xi-Yu boss room', 'Tier 4', 'Tier 3 · burger restaurant area', 'Tier 3 · exit route']),
    threadLabels: freeze(['Zhang Lei', 'Mafia families', 'Heil-Ly', 'Troupe & Hisoka', 'Nen development', 'Ship operations']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 390 synopsis.',
      'Voyage Day 10 is retained from the immediate Chapter 389 present-day handoff; no Chapter 390 clock time is invented.',
      'Coin-number cause and effect remain unresolved.',
      'Hinrigh’s formal ability name and Nen category are not supplied.',
      'Bloody Mary and Body and Soul are not expanded beyond the demonstrated effects.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, source: true }),
    keyResearch: freeze({
      zhangLeiCoins: succession390ZhangLeiCoinResearch,
      zhangLeiOnior: succession390ZhangLeiOniorResearch,
      xiYuOperation: succession390XiYuOperationResearch,
      nenAbilities: succession390NenAbilityResearch,
    }),
    relationships: succession390RelationshipRecords,
    resolvedQuestions: succession390ResolvedQuestions,
    mysteries: succession390Mysteries,
  }),
]);

export const succession390ChapterFocus = succession390ChapterResearch[0].focus;
