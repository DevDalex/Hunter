const freeze = (value) => Object.freeze(value);
const source397 = 'https://hunterxhunter.fandom.com/wiki/Chapter_397';
const flashbackTime = 'Voyage Day 10 narrative · continuation of the undated pre-voyage Meteor City origin flashback';

export const succession397SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'User-supplied Hunterpedia Chapter 397 synopsis text',
  chapterUrl: source397,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 397 continues the undated Meteor City origin flashback and closes with an explicitly years-later Spider-birth coda. No exact flashback year, exact clock time, exact current age, or present-day Black Whale scene is invented.',
  sarasaBoundary: 'Sarasa is confirmed dead in Chapter 397 after being missing since the previous day. The exact abduction sequence, killer identities, and note contents remain unseen or unsupplied.',
  noteBoundary: 'Chrollo reads the killers’ note and refuses to reveal what it says. The archive does not invent, reconstruct, summarize, quote, or infer the note text.',
  sheilaBoundary: 'Sheila is shown downcast and walking away while the others commit to Chrollo’s plan. The supplied synopsis does not give Sheila dialogue explaining her motive, so an editorial claim that she rejects “darkness” is not promoted into confirmed character intent.',
  nenBoundary: 'Renko explicitly calls her embalming technique a special ability, and Machi perceives aura around Sarasa’s restored body. Renko’s Nen category and full mechanics remain unknown, and Machi’s aura perception is not expanded into an invented type, Hatsu, teacher, or mastery profile.',
  foundingBoundary: 'Chapter 397 crosses the Chapter 396 theater-only boundary: Chrollo explicitly vows killing, life as a villain, self-sacrifice, and a system designed to draw criminals into Meteor City. Uvogin and the others nominate Chrollo as head, and a years-later coda establishes the Spider’s birth. The exact spoken mechanism by which the complete group name is coined is not reproduced by the supplied synopsis.',
  excluded: freeze([
    'Inventing the text or meaning of the killers’ note beyond Chrollo’s refusal to disclose it',
    'Naming Sarasa’s killers or reconstructing an unseen capture/abduction sequence',
    'Treating Chrollo’s cigarette-butt/video theory as independently proven fact rather than his inference',
    'Treating Chrollo’s planned communication-based criminal haven as already built in Chapter 397',
    'Assigning Sheila an explicit motive for walking away when the supplied synopsis gives no explanatory dialogue',
    'Assigning Renko a Nen category or universal embalming mechanics not supplied by the chapter',
    'Inferring Machi’s Nen category, complete training history, Hatsu, or teacher solely from her aura perception',
    'Deriving an exact current age or birthday for Chrollo from the three-year / before-fourteen statements',
    'Importing Chapter 398+ consequences or later retrospective explanations',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Meteor City', time = flashbackTime, confidence = 'Confirmed in the user-supplied Hunterpedia Chapter 397 synopsis' }) => freeze({
  id,
  day: 10,
  time,
  chronology: time,
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 397,
  confidence,
  source: source397,
});

export const succession397TimelineEvents = freeze([
  timelineEvent({
    id: '397-sarasa-missing-before-second-screening',
    label: 'Sarasa’s absence turns the next Power Cleaners screening into a missing-child search',
    detail: 'With another special screening fifteen minutes away, Shalnark notes that three members are absent. Sheila says Franklin and Nobunaga are habitually barely late but Sarasa is not. Chrollo and Sheila check with Sarasa’s caretakers and learn that she has not been seen since the previous day; Phinks later confirms she never returned to her hamlet.',
    people: ['Chrollo Lucilfer', 'Sheila', 'Sarasa', 'Shalnark', 'Uvogin', 'Franklin Bordeau', 'Nobunaga Hazama', 'Phinks Magcub', 'Pakunoda'],
    tracks: ['meteor-city', 'childhood', 'sarasa', 'child-abductions', 'troupe-origin'],
    location: 'Meteor City · All-Faiths Church and Sarasa’s community',
  }),
  timelineEvent({
    id: '397-chrollo-cancels-screening-community-search',
    label: 'Chrollo cancels the performance and Meteor City children mobilize to search for Sarasa',
    detail: 'Chrollo tells the waiting audience that Sarasa has been missing since the previous day, connects the danger to the recent child abductions, blames himself for letting her leave alone, and cancels the show. Children volunteer to help. Uvogin organizes them by hamlet, caretakers, factory manager, and adult help; Phinks gives Uvogin his bike keys and insists that they will find Orange.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Phinks Magcub', 'Sarasa'],
    tracks: ['meteor-city', 'childhood', 'sarasa', 'community-search', 'child-abductions'],
    location: 'Meteor City · All-Faiths Church auditorium',
  }),
  timelineEvent({
    id: '397-chrollo-finds-pouch-tracks-uga-forest-lead',
    label: 'Sarasa’s pouch, tire tracks, and footprints point Chrollo toward Uga Forest',
    detail: 'While the group searches fields and trash piles, Chrollo finds Sarasa’s heart-shaped pouch on the ground and notices tire tracks and footprints. Looking toward Uga Forest, he says she could be there. The physical signs support the search direction but do not identify the perpetrators, vehicle, or exact unseen sequence.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Sarasa'],
    tracks: ['meteor-city', 'sarasa', 'uga-forest', 'evidence', 'child-abductions'],
    location: 'Meteor City · route toward Uga Forest',
  }),
  timelineEvent({
    id: '397-sarasa-body-recovered-uga-forest-note-withheld',
    label: 'The group finds Sarasa’s body in Uga Forest while Chrollo withholds the killers’ note',
    detail: 'The group finds a garbage bag hanging from a tree with a note attached nearby. Uvogin cuts the bag down and Chrollo opens it, discovering Sarasa’s dismembered body with another note covering her face. Uvogin repeatedly demands to know what the note says, but Chrollo refuses and tells him to learn to read it himself. Sarasa’s death is confirmed; the note text and killer identities remain unknown.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Nobunaga Hazama', 'Phinks Magcub', 'Shalnark', 'Sarasa'],
    tracks: ['meteor-city', 'sarasa', 'uga-forest', 'murder', 'evidence', 'troupe-origin'],
    location: 'Meteor City · Uga Forest',
  }),
  timelineEvent({
    id: '397-machi-insists-sarasa-return-home',
    label: 'Machi stops Uvogin from leaving and insists that Sarasa be taken home',
    detail: 'After Chrollo refuses to disclose the note, Uvogin throws him down and starts to leave. Machi challenges him over leaving Sarasa behind, holds the bag, apologizes to Sarasa, and insists they take her home. Pakunoda and Sheila cry while Sheila embraces her friend. Their words about Sarasa’s fear and pain remain grief expressions rather than a reconstructed unseen assault sequence.',
    people: ['Machi Komacine', 'Uvogin', 'Chrollo Lucilfer', 'Pakunoda', 'Sheila', 'Sarasa', 'Shalnark'],
    tracks: ['meteor-city', 'sarasa', 'grief', 'childhood-relationships'],
    location: 'Meteor City · Uga Forest',
  }),
  timelineEvent({
    id: '397-renko-embalms-sarasa-farewell',
    label: 'Renko restores Sarasa’s appearance for the group’s farewell',
    detail: 'Sarasa is later displayed in a casket at the church. Lisores explains embalming and says her restoration is remarkable given the condition in which she was found, identifying Ms. Renko as the embalmer. The children place flowers in the casket, Chrollo returns Sarasa’s heart-shaped pouch, and Uvogin leaves her one of the tapes because the group has memorized it.',
    people: ['Sarasa', 'Lisores', 'Renko', 'Chrollo Lucilfer', 'Uvogin', 'Machi Komacine', 'Pakunoda', 'Sheila'],
    tracks: ['meteor-city', 'sarasa', 'funeral', 'renko', 'troupe-origin'],
    location: 'Meteor City · All-Faiths Church',
  }),
  timelineEvent({
    id: '397-machi-perceives-aura-renko-invitation',
    label: 'Machi perceives aura around Renko’s special embalming technique and receives an invitation to Kirimori Valley',
    detail: 'Machi asks Renko whether she can learn to embalm the same way. Renko says her technique is a special ability. Machi connects the technique to the strong glow around Sarasa’s body, prompting Renko to ask whether Machi can see aura. Renko gives Machi a marked paper and says she can visit with caretaker permission by taking the last bus, asking for Kirimori Valley, and showing the paper for free passage.',
    people: ['Machi Komacine', 'Renko', 'Sarasa'],
    tracks: ['meteor-city', 'nen', 'aura', 'machi', 'renko', 'kirimori-valley'],
    location: 'Meteor City · All-Faiths Church',
  }),
  timelineEvent({
    id: '397-chrollo-asks-uvogin-three-years',
    label: 'After Sarasa’s burial, Chrollo asks Uvogin to wait three years',
    detail: 'After Sarasa is laid to rest, Chrollo asks Uvogin to wait three years and says he will prepare his own power and a system for Meteor City before he turns fourteen. Uvogin initially says he is leaving to avenge Sarasa immediately. Chrollo argues that an immediate search would be like finding a needle in a haystack and says three years will change their chances.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Sarasa'],
    tracks: ['meteor-city', 'sarasa', 'revenge-plan', 'chrollo', 'uvogin', 'troupe-origin'],
    location: 'Meteor City · cemetery near the All-Faiths Church',
  }),
  timelineEvent({
    id: '397-chrollo-communication-criminal-haven-plan',
    label: 'Chrollo proposes a future communication network that will lure criminals into Meteor City’s void',
    detail: 'Chrollo predicts an approaching communication revolution and reasons that Sarasa’s crime scene was staged to attract attention. He points to cigarette butts as support for his suspicion that someone recorded the scene and predicts that perpetrators like these will want to display their work. His strategy is to exploit Meteor City’s legal/social void to create a criminal haven using the new technology and identify the culprits among the people it attracts. Shalnark arrives and summarizes the plan. The recording and criminal-behavior theory remain Chrollo’s inference, and the network is not yet built.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Shalnark', 'Sarasa'],
    tracks: ['meteor-city', 'communication-revolution', 'criminal-network', 'revenge-plan', 'troupe-origin'],
    location: 'Meteor City · cemetery / nearby forest',
  }),
  timelineEvent({
    id: '397-group-commits-sheila-walks-away',
    label: 'The childhood group commits to Chrollo’s preparation plan while Sheila walks away',
    detail: 'Shalnark says the group will help and that the next three years require knowledge, access, strength, and skills. The others emerge and join the discussion. Sheila is shown downcast and walking away through the forest. The supplied synopsis gives no Sheila dialogue explaining her departure, so her precise motive or explicit rejection of the plan remains unresolved.',
    people: ['Chrollo Lucilfer', 'Shalnark', 'Uvogin', 'Phinks Magcub', 'Feitan Portor', 'Franklin Bordeau', 'Nobunaga Hazama', 'Machi Komacine', 'Pakunoda', 'Sheila'],
    tracks: ['meteor-city', 'troupe-origin', 'revenge-plan', 'sheila'],
    location: 'Meteor City · forest near the cemetery',
  }),
  timelineEvent({
    id: '397-chrollo-vows-killing-lifelong-villain-role',
    label: 'Chrollo explicitly adopts a lifelong villain identity and a lethal deterrence program',
    detail: 'Chrollo says the group must be ready to sacrifice their lives to prevent more victims like Sarasa. He says that in three years he will kill many people, acknowledges that Sarasa would not have wanted that, and says he will apologize if they ever meet again. He then declares that he will live the rest of his life as a villain, make the world shudder at him, and design both Meteor City and himself so predators will stay away. This is the point where the Chapter 396 theater-only villain boundary ends.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Shalnark', 'Phinks Magcub', 'Feitan Portor', 'Franklin Bordeau', 'Nobunaga Hazama', 'Machi Komacine', 'Pakunoda', 'Sarasa'],
    tracks: ['meteor-city', 'troupe-origin', 'criminal-program', 'chrollo', 'sarasa'],
    location: 'Meteor City · cemetery / nearby forest',
  }),
  timelineEvent({
    id: '397-uvogin-nominates-chrollo-spider-born',
    label: 'Uvogin nominates Chrollo as head and the years-later coda establishes the Spider’s birth',
    detail: 'Chrollo asks Uvogin to help and offers him the Troupe leadership. Uvogin refuses the role, says Chrollo is the head, promises to follow him until he dies, and points to Chrollo. The other seven shown members agree to nominate Chrollo. The synopsis then moves years later and describes Chrollo addressing members as the Spider is born. The criminal Phantom Troupe/Spider organization is established historically here, while the exact spoken wording of the complete group-name coinage is not reproduced by the supplied synopsis.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Shalnark', 'Phinks Magcub', 'Feitan Portor', 'Franklin Bordeau', 'Nobunaga Hazama', 'Machi Komacine', 'Pakunoda'],
    tracks: ['meteor-city', 'troupe-origin', 'phantom-troupe', 'spider', 'leadership'],
    location: 'Meteor City',
    time: 'Years-later coda within the Chapter 397 Meteor City origin flashback',
  }),
]);

export const succession397SarasaResearch = freeze({
  missing: 'Sarasa has not been seen since the previous day and never returned to her hamlet after leaving the group in Chapter 396.',
  evidenceTrail: 'Chrollo finds her heart-shaped pouch plus tire tracks and footprints, then identifies Uga Forest as the next search area.',
  death: 'Sarasa’s dismembered body is recovered from a bag hanging in Uga Forest. Her death is confirmed at the Chapter 397 publication boundary.',
  noteBoundary: 'Chrollo reads a killers’ note but refuses to reveal the contents. No note text or exact perpetrator motive is supplied.',
  farewell: 'Renko embalms Sarasa, the group places flowers and personal items in the casket, and Sarasa is buried in a nearby cemetery.',
  unresolved: freeze(['Exact killer identities', 'Exact unseen abduction/capture sequence', 'Killers’ note contents', 'Fate/identity of the three previously shown child hostages']),
  source: source397,
});

export const succession397RenkoMachiResearch = freeze({
  ability: 'Renko says her exceptional embalming technique is a special ability; Machi notices a strong glow around Sarasa and is asked whether she can see aura.',
  machiBoundary: 'Machi’s aura perception is confirmed in the scene. Her Nen category, complete training history, Hatsu, teacher, and mastery level are not supplied.',
  renkoBoundary: 'Renko’s official ability name, Nen category, activation, range, duration, cost, and general target rules are not supplied. Sarasa is the demonstrated target.',
  invitation: 'Renko gives Machi marked paper and directions to take the last bus, ask for Kirimori Valley, and use the paper for free passage if her caretakers permit the visit.',
  source: source397,
});

export const succession397ChrolloPlanResearch = freeze({
  preparationWindow: 'Chrollo asks Uvogin to wait three years and says he will prepare his power and a system for Meteor City before turning fourteen.',
  communicationPrediction: 'Chrollo predicts near-instant global information sharing and a future communication infrastructure that criminals will exploit.',
  evidenceTheory: 'Chrollo interprets the staged scene and cigarette butts as evidence supporting a possible recording and predicts that the perpetrators will want to display their work. These remain his deductions, not independently confirmed facts.',
  trapPlan: 'Chrollo proposes using Meteor City’s legal/social void to build a criminal haven through the new technology so offenders come to them and the group can locate Sarasa’s killers.',
  planBoundary: 'The criminal haven/network is a future plan in Chapter 397. The archive does not treat it as already constructed or assign it a later technical name not supplied here.',
  source: source397,
});

export const succession397TroupeFoundingResearch = freeze({
  transition: 'After Sarasa’s death, Chrollo explicitly moves beyond the Chapter 396 stage-villain framing: he vows killing, self-sacrifice, lifelong villainy, fear-based deterrence, and structural change to Meteor City.',
  leadership: 'Chrollo offers Uvogin the leadership role. Uvogin refuses, declares Chrollo the head, promises to follow him until death, and the other seven shown members agree to nominate Chrollo.',
  spider: 'A years-later coda establishes the Spider’s birth and permits the canonical Phantom Troupe organization to be linked to this historical founding sequence.',
  namingBoundary: 'The supplied synopsis does not reproduce the exact spoken wording or mechanism by which the complete group name is coined, so the organization identity is confirmed without inventing a missing naming utterance.',
  sheilaBoundary: 'Sheila is shown downcast and walking away during the planning scene. Her precise motive and later decision are not established by dialogue in the supplied synopsis.',
  source: source397,
});

export const succession397RelationshipRecords = freeze([
  freeze({ id: 'relationship:chrollo-sarasa-ch397-loss-and-motive', from: 'Chrollo Lucilfer', to: 'Sarasa', type: 'friendship', chapter: 397, state: 'Chrollo leads the search, discovers Sarasa’s body, returns her pouch at the funeral, and makes preventing similar victimization central to his three-year plan.', boundary: 'Sarasa’s death is confirmed, but the archive does not make Chrollo objectively responsible for it merely because he blames himself.', source: source397 }),
  freeze({ id: 'relationship:uvogin-chrollo-ch397-leadership-vow', from: 'Uvogin', to: 'Chrollo Lucilfer', type: 'leadership-allegiance', chapter: 397, state: 'Uvogin rejects Chrollo’s offer to lead, declares Chrollo the head, promises to follow him until death, and prompts the others to nominate Chrollo.', boundary: 'Uvogin is not stored as the Troupe leader; the chapter explicitly assigns the head role to Chrollo.', source: source397 }),
  freeze({ id: 'relationship:renko-machi-ch397-nen-invitation', from: 'Renko', to: 'Machi Komacine', type: 'potential-mentorship', chapter: 397, state: 'After learning that Machi can perceive aura, Renko gives her marked paper and invites her to visit via Kirimori Valley with caretaker permission.', boundary: 'The invitation does not prove that training occurs in Chapter 397 or establish Machi’s complete Nen education.', source: source397 }),
  freeze({ id: 'relationship:chrollo-phantom-troupe-ch397-leadership-origin', from: 'Chrollo Lucilfer', to: 'Phantom Troupe', type: 'leadership', chapter: 397, state: 'Uvogin and the other seven shown members nominate Chrollo as head, and a years-later coda establishes the Spider’s birth.', boundary: 'Historical leadership origin is confirmed; the exact spoken full-name coinage is not reconstructed beyond the supplied synopsis.', source: source397 }),
]);

export const succession397ResolvedQuestions = freeze([
  freeze({ question: 'What becomes of Sarasa after the Chapter 396 Uga Forest cliffhanger?', chapter: 397, resolution: 'She is confirmed murdered. Chrollo follows her pouch, tire tracks, and footprints toward Uga Forest, where the group recovers her body.', source: source397 }),
  freeze({ question: 'Does Chapter 397 reveal what the killers wrote?', chapter: 397, resolution: 'No. Chrollo can read the note but refuses to tell Uvogin what it says, so the text remains undisclosed.', source: source397 }),
  freeze({ question: 'Is Renko’s extraordinary embalming explicitly supernatural/Nen-related?', chapter: 397, resolution: 'Yes. Renko calls her technique a special ability, and the scene directly connects it with aura visible to Machi; the ability’s category and full mechanics remain unknown.', source: source397 }),
  freeze({ question: 'Does Chrollo’s villain language remain purely theatrical after Sarasa’s death?', chapter: 397, resolution: 'No. Chrollo explicitly commits to killing, lifelong villainy, self-sacrifice, fear-based deterrence, and a criminal-attraction system for Meteor City.', source: source397 }),
  freeze({ question: 'Who is nominated as the Troupe’s head in Chapter 397?', chapter: 397, resolution: 'Chrollo. Uvogin rejects the offered leadership role, declares Chrollo the head, promises to follow him until death, and the other seven shown members agree.', source: source397 }),
  freeze({ question: 'Does Chapter 397 establish the Spider’s historical birth?', chapter: 397, resolution: 'Yes. The synopsis closes with a years-later scene describing the Spider as born, linking the childhood origin sequence to the criminal Phantom Troupe organization.', source: source397 }),
]);

export const succession397Mysteries = freeze([
  freeze({ question: 'What exactly is written on the note left with Sarasa?', chapter: 397, status: 'unresolved; Chrollo reads it but refuses to disclose the contents, and the supplied synopsis does not reproduce the text', source: source397 }),
  freeze({ question: 'Who exactly abducted and murdered Sarasa, and what was the unseen sequence?', chapter: 397, status: 'unresolved; the body, tracks, and murder outcome are known, but the perpetrators and exact encounter/capture sequence are not shown in the supplied synopsis', source: source397 }),
  freeze({ question: 'What are the complete mechanics and Nen category of Renko’s embalming ability?', chapter: 397, status: 'unresolved; the technique is explicitly a special ability and aura is visible, but its name, category, activation, limits, and broader target rules are unsupplied', source: source397 }),
  freeze({ question: 'Why exactly does Sheila walk away from the group during Chrollo’s plan?', chapter: 397, status: 'unresolved; she appears downcast and leaves, but the supplied synopsis gives no explanatory dialogue from Sheila', source: source397 }),
  freeze({ question: 'How will Chrollo’s planned communication-based criminal haven actually be built and operated?', chapter: 397, status: 'open; Chapter 397 supplies the strategic concept and three-year preparation window but not a completed technical implementation', source: source397 }),
  freeze({ question: 'What exact spoken naming step produces the complete Phantom Troupe name?', chapter: 397, status: 'the Spider/Phantom Troupe organization identity is established by the years-later coda, but the supplied synopsis does not reproduce the precise naming utterance or mechanism', source: source397 }),
  freeze({ question: 'Who are the three children previously shown in the kidnappers’ van?', chapter: 397, status: 'still unresolved in the supplied Chapter 397 synopsis', source: source397 }),
]);

export const succession397ChapterResearch = freeze([
  freeze({
    number: 397,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Phantom Troupe origin flashback / Sarasa murder and Spider founding transition',
    voyageDay: 'Voyage Day 10',
    source: source397,
    sourcePolicy: succession397SourcePolicy,
    chronology: freeze({
      voyageDay: 'The framing narrative remains on Voyage Day 10, but the supplied Chapter 397 material is historical Meteor City origin material rather than present-day Black Whale action.',
      exactClockTime: null,
      opening: 'The next Power Cleaners screening is fifteen minutes away when Sarasa’s abnormal absence triggers a search.',
      flashback: 'The chapter continues the undated Meteor City childhood flashback and later advances to an explicitly years-later coda in which the Spider is born.',
      boundary: 'No present-day resurrection or Black Whale operational state is inferred from historical scenes. The three-year request and before-fourteen target are stored as statements without deriving an exact birthday chronology.',
    }),
    focus: 'Sarasa’s disappearance becomes a citywide search that ends with her murdered body recovered in Uga Forest. The group mourns her, Renko’s special embalming ability exposes Machi’s aura perception, and Chrollo asks for three years to build power and a communication-based system designed to lure criminals into Meteor City. He explicitly adopts lifelong villainy and lethal deterrence, Uvogin and the others nominate him as head, and a years-later coda establishes the Spider’s birth while the killers, note contents, Sheila’s exact motive, and Renko’s full mechanics remain unresolved.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Meteor City childhood', 'Sarasa search and murder', 'Uga Forest evidence', 'Renko and Machi aura', 'Three-year preparation plan', 'Communication/criminal-haven strategy', 'Chrollo villain transition', 'Troupe leadership', 'Spider founding']),
    events: succession397TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Sarasa', 'Chrollo Lucilfer', 'Uvogin', 'Sheila', 'Shalnark', 'Phinks Magcub', 'Pakunoda', 'Machi Komacine', 'Franklin Bordeau', 'Nobunaga Hazama', 'Feitan Portor', 'Lisores', 'Renko']),
    locations: freeze(['Meteor City', 'Meteor City · All-Faiths Church auditorium', 'Meteor City · route toward Uga Forest', 'Meteor City · Uga Forest', 'Meteor City · cemetery near the All-Faiths Church', 'Kirimori Valley']),
    threadLabels: freeze(['Meteor City', 'Troupe origin', 'Sarasa', 'Child abductions', 'Nen awakening context', 'Spider founding']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 397 synopsis.',
      'No chapter title, exact clock time, exact flashback year, exact current age, or exact birthday is invented.',
      'Sarasa’s death is confirmed at Chapter 397, while the exact killers, unseen abduction sequence, and note text remain unresolved.',
      'Chrollo’s cigarette-butt/recording theory and predictions about criminal behavior remain character inference rather than independently established fact.',
      'Renko’s technique is recorded as an unnamed special ability with unknown Nen category and bounded demonstrated use.',
      'Machi’s aura perception is confirmed without inventing a Nen category, Hatsu, teacher, or complete training history.',
      'Sheila’s visible departure is recorded without assigning an unsupported motive.',
      'Chapter 397 explicitly supersedes the Chapter 396 theater-only villain boundary from the point of Chrollo’s post-Sarasa vows onward.',
      'The years-later coda establishes the Spider/Phantom Troupe organization historically while the precise spoken full-name coinage remains unsupplied.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, relationships: true, nen: true, source: true }),
    keyResearch: freeze({ sarasa: succession397SarasaResearch, renkoMachi: succession397RenkoMachiResearch, chrolloPlan: succession397ChrolloPlanResearch, troupeFounding: succession397TroupeFoundingResearch }),
    relationships: succession397RelationshipRecords,
    resolvedQuestions: succession397ResolvedQuestions,
    mysteries: succession397Mysteries,
  }),
]);

export const succession397ChapterFocus = succession397ChapterResearch[0].focus;
