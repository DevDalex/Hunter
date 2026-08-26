const freeze = (value) => Object.freeze(value);
const source391 = 'https://hunterxhunter.fandom.com/wiki/Chapter_391';

export const succession391SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 391 synopsis text',
  chapterUrl: source391,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 391 opens directly on the Tier 3 aftermath of Hinrigh killing the two soldiers at the end of Chapter 390. Voyage Day 10 continuity is retained from that immediate handoff, but no exact clock time is supplied or invented.',
  excluded: freeze([
    'All outside story claims',
    'Later-chapter outcomes or mechanics not contained in the supplied Chapter 391 synopsis',
    'Treating Hinrigh’s rebellion/training theory about Heil-Ly as confirmed motive',
    'Treating Quorolle’s belief that Morena can probably monitor members at all times as a confirmed Contagion surveillance mechanic',
    'Inventing additional Biohazard transformation rules beyond the camcorder-cat and handcuff-pigeon demonstrations',
    'Inventing additional Fistful of Weapons forms beyond the hammer, drill, and axe shown here',
    'Inferring Misha Hao’s exact role or ability from Hinrigh saying he is counting on her',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Tier 3', confidence = 'Confirmed in the supplied Hunterpedia Chapter 391 synopsis' }) => freeze({
  id,
  day: 10,
  time: 'Voyage Day 10 · direct Chapter 390 continuation · exact clock time unsupplied',
  chronology: 'direct continuation of the Chapter 390 Tier 3 soldier-killing aftermath; exact clock time unsupplied',
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 391,
  confidence,
  source: source391,
});

export const succession391TimelineEvents = freeze([
  timelineEvent({
    id: '391-xiyu-splits-hisoka-heilly-search',
    label: 'Hinrigh splits the Xi-Yu field search between Hisoka and Heil-Ly',
    detail: 'With passengers fleeing from the two dead soldiers, Zakuro and Lynch continue the Hisoka search. Hinrigh orders them to contact him before acting if they find Hisoka, while he separately plans to track a Heil-Ly member and identify more of the group.',
    people: ['Hinrigh Biganduffno', 'Zakuro Custard', 'Lynch Fullbokko', 'Hisoka Morow'],
    tracks: ['xi-yu', 'hisoka', 'heil-ly', 'tier-3'],
  }),
  timelineEvent({
    id: '391-bloody-mary-search-drops-duration',
    label: 'Bloody Mary deploys searching blood drops with a 30–40 minute Nen lifetime',
    detail: 'Zakuro sends numerous drops of blood moving along the corridor wall to search for Hisoka. He tells Lynch that the drops will run out of Nen in roughly 30 to 40 minutes and then return to ordinary blood. Lynch plans to use Body and Soul on suspicious people the drops locate, but no new Body and Soul activation occurs in this scene.',
    people: ['Zakuro Custard', 'Lynch Fullbokko'],
    tracks: ['xi-yu', 'bloody-mary', 'body-and-soul', 'hisoka', 'nen'],
    location: 'Tier 3 · empty corridor',
  }),
  timelineEvent({
    id: '391-hinrigh-identifies-standard-cabin-watch-route',
    label: 'Hinrigh identifies the standard-cabin hallway as a Heil-Ly watch route',
    detail: 'Hinrigh surveys a crowded Tier 3 area, works with a soldier to obtain civilian camera footage of the female Heil-Ly member, and concludes that Heil-Ly is watching the hallway leading to the standard cabins because it is an access route. He states that the group knows Morena’s face, can distinguish members by aura, and wants to identify all 23 as quickly as possible.',
    people: ['Hinrigh Biganduffno', 'Morena Prudo'],
    tracks: ['xi-yu', 'heil-ly', 'surveillance', 'tier-3'],
    location: 'Tier 3 · crowded public area / standard-cabin access hallway',
  }),
  timelineEvent({
    id: '391-biohazard-camcorder-cat-surveillance',
    label: 'Biohazard turns a recording camcorder into a surveillance cat',
    detail: 'After compensating a couple and confiscating their camcorder as evidence, Hinrigh activates Biohazard and transforms the recording camcorder into a small cat. The transformed cat climbs onto a fountain and watches the standard-cabin hallway while the camcorder remains set to record.',
    people: ['Hinrigh Biganduffno'],
    tracks: ['xi-yu', 'biohazard', 'surveillance', 'nen'],
    location: 'Tier 3 · public fountain area',
  }),
  timelineEvent({
    id: '391-hinrigh-heilly-rebellion-training-hypothesis',
    label: 'Hinrigh theorizes about Heil-Ly rebellion and killing as training',
    detail: 'While watching the corridor, Hinrigh considers what Heil-Ly may do after Tserriednich cut ties with them. He wonders whether the Second-Track Fakers are preparing a rebellion after years of oppression and guesses that the recent killing spree may be training for a larger move. These are Hinrigh’s hypotheses, not confirmed Heil-Ly motives.',
    people: ['Hinrigh Biganduffno', 'Tserriednich Hui Guo Rou', 'Morena Prudo'],
    tracks: ['xi-yu', 'heil-ly', 'tserriednich', 'hypothesis'],
  }),
  timelineEvent({
    id: '391-heilly-trio-levels-types-and-contagion-kill-value',
    label: 'Tevelares, Quorolle, and Padaille reveal levels, Nen types, jobs, and the Nen-user kill value',
    detail: 'Tevelares, Quorolle, and Padaille identify Hinrigh and debate attacking him. Tevelares is an Enhancer civil engineer at level 24, Quorolle an Emitter repairman at level 22, and Padaille a Conjurer demolition worker at level 29. Their discussion explicitly treats killing a Nen user as worth ten levels. They disagree over how the reward should be divided and expect Morena to decide; Quorolle’s belief that she can probably tell what members are doing at all times remains his inference.',
    people: ['Tevelares', 'Quorolle', 'Padaille', 'Hinrigh Biganduffno', 'Morena Prudo'],
    tracks: ['heil-ly', 'contagion', 'nen', 'leveling'],
  }),
  timelineEvent({
    id: '391-padaille-fistful-of-weapons-first-demonstration',
    label: 'Padaille activates Fistful of Weapons and turns his right hand into a hammer',
    detail: 'Padaille charges Hinrigh and activates Fistful of Weapons, transforming his right hand into a hammer. His internal monologue frames Morena’s power as allowing his desire to become a weapon to come true, but the archive records only the demonstrated weapon transformations rather than a literal rebirth mechanic.',
    people: ['Padaille', 'Hinrigh Biganduffno', 'Morena Prudo'],
    tracks: ['heil-ly', 'fistful-of-weapons', 'nen', 'combat'],
  }),
  timelineEvent({
    id: '391-biohazard-handcuff-pigeons-restrain-padaille',
    label: 'Biohazard handcuff-pigeons restrain Padaille and resist standard gunfire',
    detail: 'A pigeon formed from a handcuff catches Padaille’s wrist; another reaches his opposite wrist and turns back into the second cuff, restraining his hands behind him. Tevelares and Quorolle fire at Hinrigh and the pigeons, but Hinrigh explains that the pigeons originate from ordinary handcuffs reinforced with aura and that standard bullets are insufficient.',
    people: ['Hinrigh Biganduffno', 'Padaille', 'Tevelares', 'Quorolle'],
    tracks: ['xi-yu', 'heil-ly', 'biohazard', 'nen', 'combat'],
  }),
  timelineEvent({
    id: '391-padaille-drill-escape-and-second-restraint',
    label: 'Padaille uses a drill form to escape before Biohazard restrains him again',
    detail: 'Padaille changes his right hand into a drill to slip the handcuff, lunges at Hinrigh, and pierces Hinrigh’s left hand when Hinrigh catches the drill. Hinrigh kicks him back, then another pigeon returns to handcuff form and links Padaille’s left ankle to the cuff hanging from his left wrist.',
    people: ['Hinrigh Biganduffno', 'Padaille'],
    tracks: ['xi-yu', 'heil-ly', 'biohazard', 'fistful-of-weapons', 'combat'],
  }),
  timelineEvent({
    id: '391-hinrigh-kills-padaille-with-axe-form',
    label: 'Hinrigh kills Padaille with Padaille’s own axe-form weapon',
    detail: 'Padaille changes his hand into an axe to cut himself free. Hinrigh stops him and forces the axe into the back of Padaille’s head, killing him. Tevelares and Quorolle escape while a crowd gathers. Hinrigh regrets the public setting, says he cannot afford to be delayed, and says he is now counting on Misha without explaining her exact task in the supplied synopsis.',
    people: ['Hinrigh Biganduffno', 'Padaille', 'Tevelares', 'Quorolle', 'Misha Hao'],
    tracks: ['xi-yu', 'heil-ly', 'biohazard', 'fistful-of-weapons', 'combat'],
  }),
  timelineEvent({
    id: '391-tevelares-quorolle-retreat-for-morena-instructions',
    label: 'Tevelares and Quorolle retreat and decide to seek Morena’s instructions',
    detail: 'After Padaille’s death, Tevelares and Quorolle flee. Quorolle worries about the Biohazard pigeons; Tevelares rejects risking capture and torture over the hideout location and proposes asking Morena what to do next.',
    people: ['Tevelares', 'Quorolle', 'Morena Prudo'],
    tracks: ['heil-ly', 'morena', 'retreat', 'tier-3'],
  }),
]);

export const succession391BloodyMaryResearch = freeze({
  newMechanic: 'Zakuro can deploy numerous blood drops that move through the environment to search for Hisoka.',
  duration: 'Zakuro states that the searching drops will run out of Nen in approximately 30 to 40 minutes and then return to ordinary blood.',
  behaviorBoundary: 'Zakuro anthropomorphizes the drops as each doing its best to find Hisoka. The archive records demonstrated search behavior but does not invent independent intelligence, sensory range, communication rules, or a universal target-lock mechanic.',
  bodyAndSoulBoundary: 'Lynch says she will punch suspicious people found by the drops and use her interrogation role, but Chapter 391 does not add a new Body and Soul activation or new confirmed mechanic.',
  source: source391,
});

export const succession391BiohazardResearch = freeze({
  formalName: 'Biohazard',
  namingResolution: 'Chapter 391 supplies the formal name for the transformation ability that Chapter 390 could only label descriptively.',
  camcorderCat: 'Hinrigh transforms a camcorder that is set to record into a small cat and positions it to watch the standard-cabin access hallway. The demonstrated transformation preserves the recording function in this use.',
  handcuffPigeons: 'Hinrigh has multiple pigeons made from ordinary handcuffs. A pigeon can reach a target and revert into the handcuff to fasten onto the target; paired cuffs can thereby restrain different limbs.',
  auraReinforcement: 'Hinrigh states that the handcuff-pigeons are reinforced with aura, making standard handgun bullets ineffective in the demonstrated exchange.',
  demonstratedFunctionContinuity: 'Across Chapters 390–391, transformed guns retain firing function, the transformed camcorder retains recording function, and transformed handcuffs can return to handcuff form for restraint.',
  boundary: 'The supplied synopsis does not give Hinrigh’s Nen category, maximum object size, transformation duration, total number of transformations, selection rules, full command range, or a universal rule that every transformed object preserves every original function.',
  source: source391,
});

export const succession391ContagionResearch = freeze({
  nenUserKillValue: 'Tevelares, Quorolle, and Padaille explicitly discuss killing a Nen user as giving ten levels.',
  rewardAllocationBoundary: 'The three disagree about whether all ten levels should go to the killing blow or be shared. Their disagreement means Chapter 391 does not establish the exact multi-attacker reward-allocation rule.',
  morenaAdjudication: 'They expect Morena, as the user and “game master,” to decide the details.',
  surveillanceHypothesis: 'Quorolle thinks Morena is most likely able to tell what they are doing at all times. This is recorded as Quorolle’s inference, not confirmed as a demonstrated Contagion surveillance feature.',
  memberProfiles: freeze([
    freeze({ name: 'Tevelares', level: 24, nenType: 'Enhancement', occupation: 'civil engineer' }),
    freeze({ name: 'Quorolle', level: 22, nenType: 'Emission', occupation: 'repairman' }),
    freeze({ name: 'Padaille', level: 29, nenType: 'Conjuration', occupation: 'demolition worker' }),
  ]),
  source: source391,
});

export const succession391FistfulOfWeaponsResearch = freeze({
  user: 'Padaille',
  officialName: 'Fistful of Weapons',
  userNenType: 'Conjurer',
  demonstratedForms: freeze(['right-hand hammer', 'right-hand drill', 'right-hand axe']),
  combatUse: 'Padaille attacks Hinrigh with a hammer form, uses a drill form to slip a handcuff and attack again, then creates an axe form in an attempt to free himself.',
  death: 'Hinrigh forces Padaille’s own axe-form hand into the back of his head, killing him.',
  boundary: 'The chapter does not establish an exhaustive weapon list, maximum transformation duration, whether forms are restricted to the right hand, aura cost, durability rules, or any literal reincarnation mechanic.',
  source: source391,
});

export const succession391HinrighOperationalResearch = freeze({
  hisokaProtocol: 'Hinrigh tells Lynch and Zakuro to contact him before taking action if they find Hisoka.',
  heilLyIdentification: 'Hinrigh seeks to identify all 23 Heil-Ly members quickly, says Morena’s face is known, and says members can be distinguished by aura.',
  corridorInference: 'Using civilian footage, Hinrigh concludes that Heil-Ly is monitoring the standard-cabin hallway because it functions as an access route.',
  rebellionHypothesis: 'Hinrigh wonders whether Second-Track Fakers are preparing a rebellion after years of oppression and whether recent killings are training. These are his hypotheses.',
  mishaBoundary: 'After killing Padaille, Hinrigh says he is counting on Misha. The supplied synopsis does not specify what task, ability, or contingency he expects from her, so none is invented.',
  source: source391,
});

export const succession391RelationshipRecords = freeze([
  freeze({
    id: 'relationship:hinrigh-lynch-zakuro-ch391-search-command',
    from: 'Hinrigh Biganduffno',
    to: 'Lynch Fullbokko / Zakuro Custard',
    type: 'command',
    chapter: 391,
    state: 'Hinrigh delegates the continued Hisoka search to Lynch and Zakuro but requires them to contact him before acting if they locate Hisoka.',
    boundary: 'This records field command and coordination, not a new permanent rank structure.',
    source: source391,
  }),
  freeze({
    id: 'relationship:padaille-morena-ch391-devotion',
    from: 'Padaille',
    to: 'Morena Prudo',
    type: 'allegiance',
    chapter: 391,
    state: 'Padaille says Morena made his weapon wish possible and that he will kill for both her sake and his own.',
    boundary: 'Padaille’s stated devotion is recorded without generalizing identical motives to Tevelares, Quorolle, or all Heil-Ly members.',
    source: source391,
  }),
]);

export const succession391ResolvedQuestions = freeze([
  freeze({ question: 'What is the formal name of Hinrigh’s transformation ability?', chapter: 391, resolution: 'Biohazard. Chapter 391 names the ability and expands its demonstrated applications to a recording camcorder-cat and aura-reinforced handcuff-pigeons.', source: source391 }),
  freeze({ question: 'How long do Zakuro’s searching blood drops remain active in the Chapter 391 use?', chapter: 391, resolution: 'Zakuro states approximately 30 to 40 minutes before they run out of Nen and return to ordinary blood.', source: source391 }),
  freeze({ question: 'What weapon forms does Padaille directly demonstrate?', chapter: 391, resolution: 'Fistful of Weapons directly shows a hammer, drill, and axe formed from Padaille’s right hand.', source: source391 }),
]);

export const succession391Mysteries = freeze([
  freeze({ question: 'What are the complete mechanics, range, sensory rules, and blood limits of Bloody Mary?', chapter: 391, status: 'open; Chapter 391 adds searching drops and a 30–40 minute demonstrated Nen lifetime', source: source391 }),
  freeze({ question: 'What are Biohazard’s full object-selection, size, duration, range, and transformation-count limits?', chapter: 391, status: 'open; formal name and several new transformations are demonstrated', source: source391 }),
  freeze({ question: 'How does Contagion assign a ten-level Nen-user kill reward when multiple members participate?', chapter: 391, status: 'open; the three members explicitly disagree about the allocation rule', source: source391 }),
  freeze({ question: 'Can Morena actually monitor Contagion members continuously?', chapter: 391, status: 'open; Quorolle speculates that she probably can, but no such surveillance mechanic is demonstrated', source: source391 }),
  freeze({ question: 'What are the complete rules and possible forms of Fistful of Weapons?', chapter: 391, status: 'open; hammer, drill, and axe are demonstrated', source: source391 }),
  freeze({ question: 'What exactly is Hinrigh relying on Misha to do after Padaille’s death?', chapter: 391, status: 'open; the supplied synopsis names Misha but gives no task or ability', source: source391 }),
  freeze({ question: 'Are Hinrigh’s rebellion and killing-as-training theories about Heil-Ly correct?', chapter: 391, status: 'open; explicitly preserved as Hinrigh hypotheses', source: source391 }),
]);

export const succession391ChapterResearch = freeze([
  freeze({
    number: 391,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 10',
    source: source391,
    sourcePolicy: succession391SourcePolicy,
    chronology: freeze({
      voyageDay: 'Voyage Day 10 continuation inherited from the immediate Chapter 390 Tier 3 aftermath',
      exactClockTime: null,
      opening: 'Direct continuation of the two soldiers being killed by Hinrigh’s transformed guns at the end of Chapter 390.',
      boundary: 'No exact Chapter 391 clock time is supplied; none is invented.',
    }),
    focus: 'Xi-Yu continues the Hisoka and Heil-Ly hunt on Tier 3. Zakuro expands Bloody Mary into a timed blood-drop search, Hinrigh’s transformation ability is formally named Biohazard and used for surveillance and restraint, Heil-Ly’s Tevelares/Quorolle/Padaille trio exposes levels and Nen types plus the Nen-user +10 leveling value, and Hinrigh kills Padaille after a multi-stage Fistful of Weapons fight.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Xi-Yu Family', 'Heil-Ly', 'Hisoka search', 'Biohazard', 'Bloody Mary', 'Contagion leveling', 'Padaille / Fistful of Weapons', 'Tier 3 security']),
    events: succession391TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Hinrigh Biganduffno', 'Zakuro Custard', 'Lynch Fullbokko', 'Hisoka Morow', 'Morena Prudo', 'Tserriednich Hui Guo Rou', 'Tevelares', 'Quorolle', 'Padaille', 'Misha Hao']),
    locations: freeze(['Tier 3', 'Tier 3 · empty corridor', 'Tier 3 · crowded public area / standard-cabin access hallway', 'Tier 3 · public fountain area']),
    threadLabels: freeze(['Mafia families', 'Heil-Ly', 'Troupe & Hisoka', 'Nen development', 'Ship operations']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 391 synopsis.',
      'Voyage Day 10 is retained from the immediate Chapter 390 handoff; no Chapter 391 clock time is invented.',
      'Hinrigh’s rebellion/training model is preserved as hypothesis rather than fact.',
      'Quorolle’s Morena-surveillance idea is preserved as character inference rather than a confirmed Contagion mechanic.',
      'Misha’s exact role in Hinrigh’s plan remains unspecified.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, source: true }),
    keyResearch: freeze({
      bloodyMary: succession391BloodyMaryResearch,
      biohazard: succession391BiohazardResearch,
      contagion: succession391ContagionResearch,
      fistfulOfWeapons: succession391FistfulOfWeaponsResearch,
      hinrighOperation: succession391HinrighOperationalResearch,
    }),
    relationships: succession391RelationshipRecords,
    resolvedQuestions: succession391ResolvedQuestions,
    mysteries: succession391Mysteries,
  }),
]);

export const succession391ChapterFocus = succession391ChapterResearch[0].focus;
