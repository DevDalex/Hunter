const freeze = (value) => Object.freeze(value);
const source396 = 'https://hunterxhunter.fandom.com/wiki/Chapter_396';
const flashbackTime = 'Voyage Day 10 narrative · continuation of the undated pre-voyage Meteor City childhood flashback';

export const succession396SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'User-supplied Hunterpedia Chapter 396 synopsis text',
  chapterUrl: source396,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 396 continues the undated Meteor City childhood flashback opened in Chapter 395. It supplies no exact flashback year, ages, or present-day Black Whale scene. Publication order, current publication-boundary state, and historical story-time remain separate.',
  troupeNamingBoundary: 'The children discuss becoming a theater company or traveling performers, Pakunoda suggests a troupe, and the group accepts “troupe” while still searching for another word to place in front of it. Chapter 396 does not yet establish the later formal Phantom Troupe name, criminal program, leadership structure, Spider numbering system, or founding vow.',
  sarasaBoundary: 'Sarasa is alive throughout Chapter 396 and leaves alone to search for Power Cleaners tapes near Uga Forest. The chapter ends with kidnappers discussing taking one more child, but it does not depict Sarasa being contacted, captured, harmed, killed, or identified as their next victim.',
  performanceBoundary: 'Chrollo’s heroes, monsters, and villain voices are stage performances. Uvogin’s desire to tour with Chrollo and become the world’s greatest villain is framed as a performance aspiration in this chapter and is not promoted into a criminal objective.',
  excluded: freeze([
    'Importing Sarasa’s Chapter 397 abduction, death, remains, message, funeral, or the group’s reaction',
    'Treating the kidnappers’ “one more” remark as a completed abduction or as explicit Chapter 396 identification of Sarasa as the intended target',
    'Calling the childhood theater group the formal Phantom Troupe before the chapter supplies that name or founding decision',
    'Treating Sheila or Sarasa’s participation in the performance troupe as proof of later Phantom Troupe membership',
    'Treating Chrollo’s villain acting or Uvogin’s stage-villain aspiration as proof that the children have already adopted the later Troupe’s criminal ideology',
    'Inventing an exact year, exact ages, exact distance from the church to Uga Forest, or exact identity of the three children already held in the van',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Meteor City', confidence = 'Confirmed in the user-supplied Hunterpedia Chapter 396 synopsis' }) => freeze({
  id,
  day: 10,
  time: flashbackTime,
  chronology: flashbackTime,
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 396,
  confidence,
  source: source396,
});

export const succession396TimelineEvents = freeze([
  timelineEvent({
    id: '396-church-screening-preparation-and-phinks-snacks',
    label: 'The All-Faiths Church fills for Chrollo’s special screening',
    detail: 'Lisores welcomes children to the special screening with snacks while Chrollo helps distribute them. Uvogin warns Chrollo that he expects to settle the stolen-tape matter afterward. Sarasa pressures a reluctant Phinks into helping with the snacks, and Pakunoda tells Chrollo that his habit of bringing flowers to the children’s graves is part of why she likes him as he is. Sheila and Pakunoda continue the affectionate “little brother” teasing without establishing biological kinship.',
    people: ['Lisores', 'Chrollo Lucilfer', 'Uvogin', 'Phinks Magcub', 'Feitan Portor', 'Sarasa', 'Sheila', 'Pakunoda'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'troupe-origin', 'child-abduction-context'],
    location: 'Meteor City · All-Faiths Church auditorium',
  }),
  timelineEvent({
    id: '396-power-cleaners-dub-screening-begins',
    label: 'The dubbed Power Cleaners screening becomes an immediate hit',
    detail: 'The audience cheers for Mighty Sweepin’ Power Cleaners and quickly realizes that the voices have been redone. Shalnark recognizes Chrollo and Pakunoda, Franklin says he knew they were planning something, and backstage Chrollo praises Pakunoda, Sheila, and Sarasa while Pakunoda praises Chrollo for voicing every male role with distinct voices.',
    people: ['Chrollo Lucilfer', 'Pakunoda', 'Sheila', 'Sarasa', 'Shalnark', 'Franklin Bordeau', 'Lisores'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'performance'],
    location: 'Meteor City · All-Faiths Church auditorium',
  }),
  timelineEvent({
    id: '396-chrollo-improvises-after-tape-failure',
    label: 'Chrollo turns the tangled sound tape into a live performance',
    detail: 'When the sound tape tangles and the video stops, Lisores explains that a repair would take time. Chrollo asks for the microphone, jokes with the audience, and demonstrates that he voiced the Yellow, Blue, Red, and Green Cleaners as well as the monsters. He leads a three-count and synchronizes the restart so he, Pakunoda, Sheila, and Sarasa can perform the voices live.',
    people: ['Chrollo Lucilfer', 'Lisores', 'Pakunoda', 'Sheila', 'Sarasa', 'Uvogin', 'Machi Komacine'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'performance', 'chrollo'],
    location: 'Meteor City · All-Faiths Church auditorium',
  }),
  timelineEvent({
    id: '396-live-graffino-clean-sweep-performance',
    label: 'Chrollo’s Graffino performance frightens and impresses the audience before the Clean Sweep finale',
    detail: 'Chrollo performs Graffino with a frightening villain voice, then switches seamlessly back to calmer heroic roles as the four children continue live dubbing. The Power Cleaners combine their powers for Clean Sweep, the audience cheers, children imitate the poses, and Lisores congratulates Chrollo. The villain work is acting within the Power Cleaners performance, not a criminal declaration.',
    people: ['Chrollo Lucilfer', 'Pakunoda', 'Sheila', 'Sarasa', 'Lisores'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'performance', 'chrollo'],
    location: 'Meteor City · All-Faiths Church auditorium',
  }),
  timelineEvent({
    id: '396-sarasa-dubs-uvogin-and-defuses-confrontation',
    label: 'Sarasa “dubs” Uvogin and turns the expected confrontation into praise',
    detail: 'After the screening, the group praises Chrollo while Uvogin, Machi, Phinks, and Feitan wait nearby. Chrollo prepares to face Uvogin because he accepts responsibility for taking the tape, but Sarasa walks up to Uvogin and performs an approving line as if she were dubbing him, then reveals the joke. The gag defuses the mood and leaves the group smiling.',
    people: ['Chrollo Lucilfer', 'Sarasa', 'Uvogin', 'Machi Komacine', 'Phinks Magcub', 'Feitan Portor', 'Franklin Bordeau'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'friendship', 'troupe-origin'],
    location: 'Meteor City · forest near the All-Faiths Church',
  }),
  timelineEvent({
    id: '396-uvogin-handshake-expanded-cast',
    label: 'Uvogin joins Chrollo’s performances and the childhood cast rapidly expands',
    detail: 'Uvogin asks whether more episodes remain, requests the next monster role, and tells Chrollo that his performance hit harder than any punch before shaking his hand. Nobunaga asks for Green, Feitan for Yellow, Phinks for Blue, Shalnark chooses the genius scientist, Franklin takes Disgust-King, and Machi refuses a good-princess role but says she will join as a villain. The group rehearses, writes scripts, and makes props together.',
    people: ['Chrollo Lucilfer', 'Uvogin', 'Nobunaga Hazama', 'Feitan Portor', 'Phinks Magcub', 'Shalnark', 'Franklin Bordeau', 'Machi Komacine', 'Pakunoda', 'Sheila', 'Sarasa'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'performance', 'troupe-origin'],
    location: 'Meteor City · All-Faiths Church',
  }),
  timelineEvent({
    id: '396-children-adopt-troupe-performance-label',
    label: 'The childhood performers settle on “troupe” while leaving the group’s full name unresolved',
    detail: 'Shalnark raises recruiting more people, Franklin asks whether that makes them an official group, Uvogin calls them a theater company, and Nobunaga prefers traveling performers. Pakunoda suggests a troupe. Chrollo objects that a troupe is supposed to have a thousand members, but Uvogin says each of them is worth a hundred. The group accepts “troupe” and says they still need another word in front of it. Chapter 396 does not supply the formal “Phantom Troupe” name or the later Spider structure.',
    people: ['Chrollo Lucilfer', 'Shalnark', 'Franklin Bordeau', 'Uvogin', 'Nobunaga Hazama', 'Pakunoda', 'Phinks Magcub', 'Feitan Portor', 'Machi Komacine', 'Sheila', 'Sarasa'],
    tracks: ['meteor-city', 'childhood', 'performance', 'troupe-origin', 'naming'],
    location: 'Meteor City · All-Faiths Church',
  }),
  timelineEvent({
    id: '396-original-play-discussion-uvogin-world-tour-goal',
    label: 'The group considers original theater as Uvogin declares a world-tour villain goal',
    detail: 'Nobunaga suggests Chrollo write an original play because the audience now watches the performers more than the screen. Chrollo says a video-free production would demand too much time, costumes, and fight choreography while three Power Cleaners episodes remain. Uvogin says the project has given him a goal: he wants to tour the world with Chrollo and become the world’s greatest villain. At the Chapter 396 boundary this remains a theatrical aspiration inside their performance project.',
    people: ['Chrollo Lucilfer', 'Nobunaga Hazama', 'Sheila', 'Uvogin', 'Sarasa'],
    tracks: ['meteor-city', 'childhood', 'performance', 'troupe-origin', 'uvogin'],
    location: 'Meteor City · All-Faiths Church',
  }),
  timelineEvent({
    id: '396-sarasa-leaves-alone-for-uga-forest-tapes',
    label: 'Sarasa leaves alone hoping to surprise the group with more Power Cleaners tapes',
    detail: 'When Chrollo asks where Sarasa is, Phinks says she left for sorting duty and Shalnark reassures him that her community is nearby. Sarasa walks alone through the trash piles, thinking about a corporate dump near Uga Forest where she knows there are many tapes. Because she memorized how “Power Cleaners” is written in the official language, she believes she can identify the title herself.',
    people: ['Sarasa', 'Chrollo Lucilfer', 'Phinks Magcub', 'Shalnark'],
    tracks: ['meteor-city', 'childhood', 'power-cleaners', 'sarasa', 'child-abduction-threat'],
    location: 'Meteor City · route toward the corporate dump near Uga Forest',
  }),
  timelineEvent({
    id: '396-kidnappers-consider-one-more-child',
    label: 'The kidnappers consider taking one more child as Sarasa walks alone',
    detail: 'Inside the van that still contains the three previously shown child hostages, one kidnapper says Meteor City residents are becoming more vigilant and suggests ending the hunt because their quota has been met. He then says that if they find one more child they can have fun. Chapter 396 ends on this threat without showing Sarasa being encountered, selected by name, captured, harmed, or killed.',
    people: ['Sarasa'],
    tracks: ['meteor-city', 'child-abductions', 'sarasa', 'cliffhanger'],
    location: 'Meteor City · outskirts / Uga Forest approach',
  }),
]);

export const succession396PerformanceResearch = freeze({
  screening: 'The Power Cleaners dub succeeds with the audience, and a tangled sound tape forces Chrollo, Pakunoda, Sheila, and Sarasa to switch from prerecorded dubbing to live synchronized performance.',
  chrolloRange: 'Chrollo demonstrates that he voiced several Cleaners and monsters with distinct voices, leads the restart countdown, and performs both heroic and frightening villain roles.',
  boundary: 'Chrollo’s Graffino performance is stage acting. The archive does not treat his villain voice as evidence that he has already adopted the later Phantom Troupe’s criminal identity.',
  expansion: 'Uvogin, Nobunaga, Feitan, Phinks, Shalnark, Franklin, and conditionally Machi choose roles and join the performance project, while the children work on scripts and props.',
  source: source396,
});

export const succession396TroupeOriginResearch = freeze({
  naming: 'The group debates theater company, traveling performers, and troupe. Pakunoda proposes “troupe,” and the children accept it while still needing another word in front of it.',
  namingBoundary: 'The full “Phantom Troupe” name, Spider numbering, later criminal program, and formal founding vow are not supplied in Chapter 396 and are not backfilled.',
  membershipBoundary: 'Participation in this childhood performance troupe is not automatically converted into later Phantom Troupe membership. This is especially important for Sheila and Sarasa.',
  originalWork: 'Nobunaga suggests Chrollo write an original play. Chrollo says a video-free production would require too many costumes, resources, and choreographed fights for the moment.',
  uvoginGoal: 'Uvogin says the project has given him a goal: travel the world with Chrollo and become the world’s greatest villain. In Chapter 396 this is expressed through their acting project, so the archive does not turn it into a criminal vow.',
  source: source396,
});

export const succession396SarasaResearch = freeze({
  statusInStoryTime: 'Sarasa is alive throughout the chapter, participates in the successful screening, jokes with Uvogin, and later leaves alone for sorting duty and tape hunting.',
  route: 'Sarasa says she knows of a pile of tapes at a corporate dump near Uga Forest and has memorized the official-language spelling of Power Cleaners so she can search by title.',
  groupKnowledge: 'Chrollo worries that Sarasa went alone, but Phinks and Shalnark say she has sorting duty, her community is nearby, and her current Orange Cleaner role requires little rehearsal.',
  threat: 'The kidnappers still have three child hostages and discuss stopping because the city is more vigilant and their quota is met, before one suggests taking one more child.',
  boundary: 'Chapter 396 does not show Sarasa meeting the kidnappers, being captured, being harmed, dying, or being explicitly identified by the kidnappers as the next target. Those outcomes remain outside this chapter.',
  source: source396,
});

export const succession396RelationshipRecords = freeze([
  freeze({ id: 'relationship:chrollo-uvogin-ch396-performance-partnership', from: 'Chrollo Lucilfer', to: 'Uvogin', type: 'friendship', chapter: 396, state: 'Uvogin moves from threatening to confront Chrollo over the tape to praising his performance, joining the cast, shaking his hand, and saying he wants to tour the world with him.', boundary: 'This is childhood performance partnership and mutual respect, not yet a formal Phantom Troupe command relationship.', source: source396 }),
  freeze({ id: 'relationship:chrollo-pakunoda-ch396-childhood-support', from: 'Chrollo Lucilfer', to: 'Pakunoda', type: 'friendship', chapter: 396, state: 'Pakunoda praises Chrollo’s voice work, tells him she likes him as he is, and points to his daily flowers for the graves while continuing the Power Cleaners collaboration.', boundary: 'Warm childhood friendship is confirmed; the “little brother” language remains teasing rather than biological kinship.', source: source396 }),
  freeze({ id: 'relationship:chrollo-sarasa-ch396-childhood-support', from: 'Chrollo Lucilfer', to: 'Sarasa', type: 'friendship', chapter: 396, state: 'Sarasa protects Chrollo socially, defuses the Uvogin confrontation through her dubbing joke, performs with the group, and later tries to surprise everyone by finding more tapes.', boundary: 'The relationship is historical childhood friendship; no Chapter 397 outcome is imported.', source: source396 }),
  freeze({ id: 'relationship:childhood-performance-troupe-ch396-collaboration', from: 'Childhood Meteor City performers', to: 'Power Cleaners project', type: 'collaboration', chapter: 396, state: 'The children expand the Power Cleaners cast, rehearse, make props, and decide to describe themselves as a troupe while the full group name remains unresolved.', boundary: 'The descriptive performance group is not equated with the later fully constituted Phantom Troupe.', source: source396 }),
]);

export const succession396ResolvedQuestions = freeze([
  freeze({ question: 'Does the Power Cleaners screening succeed after the sound tape fails?', chapter: 396, resolution: 'Yes. Chrollo turns the breakdown into a live synchronized performance with Pakunoda, Sheila, and Sarasa, and the audience enthusiastically applauds the finale.', source: source396 }),
  freeze({ question: 'How does Uvogin respond to Chrollo after the screening?', chapter: 396, resolution: 'He praises Chrollo’s performance, joins the cast, shakes his hand, and later says he wants to tour the world with Chrollo and become the world’s greatest villain as a performer.', source: source396 }),
  freeze({ question: 'What group label do the children choose in Chapter 396?', chapter: 396, resolution: 'They settle on “troupe” for their performance group but explicitly still need another word in front of it; the full later name is not established here.', source: source396 }),
  freeze({ question: 'Why does Sarasa leave the group alone near the end of Chapter 396?', chapter: 396, resolution: 'She has sorting duty and also hopes to find more Power Cleaners tapes at a corporate dump near Uga Forest so she can surprise the others.', source: source396 }),
]);

export const succession396Mysteries = freeze([
  freeze({ question: 'What word will the children eventually place in front of “troupe”?', chapter: 396, status: 'open at the Chapter 396 boundary; the group accepts “troupe” but the full name is not supplied', source: source396 }),
  freeze({ question: 'Will Chrollo eventually write an original production for the group?', chapter: 396, status: 'open; Nobunaga proposes it, but Chrollo postpones the idea because of time, costume, resource, and choreography demands', source: source396 }),
  freeze({ question: 'Will Sarasa encounter the kidnappers while searching near Uga Forest?', chapter: 396, status: 'open; the chapter ends by juxtaposing Sarasa walking alone with kidnappers considering one more victim, but no encounter or capture occurs in the supplied synopsis', source: source396 }),
  freeze({ question: 'Who are the three children already held in the kidnappers’ van?', chapter: 396, status: 'still unresolved; Chapter 396 does not identify the three hostages shown previously', source: source396 }),
]);

export const succession396ChapterResearch = freeze([
  freeze({
    number: 396,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Phantom Troupe origin flashback / childhood performance troupe',
    voyageDay: 'Voyage Day 10',
    source: source396,
    sourcePolicy: succession396SourcePolicy,
    chronology: freeze({
      voyageDay: 'The framing narrative remains on Voyage Day 10, but every supplied Chapter 396 scene continues the undated pre-voyage Meteor City flashback.',
      exactClockTime: null,
      opening: 'Lisores prepares the All-Faiths Church screening while Chrollo’s childhood circle gathers.',
      flashback: 'The entire supplied chapter remains in the Meteor City childhood layer. No exact year or ages are supplied.',
      boundary: 'No present-day Black Whale state change is inferred from a flashback-only chapter. Historical appearances and activities remain separate from current publication-boundary life and organization state.',
    }),
    focus: 'The Power Cleaners dub becomes a successful live performance after a tape failure, Chrollo’s wider childhood circle joins the project, the children begin describing their performance group as a troupe without yet establishing the formal Phantom Troupe name, and Uvogin declares a theatrical world-tour ambition with Chrollo. The chapter ends with Sarasa leaving alone to search for more tapes near Uga Forest while the child kidnappers discuss taking one more victim, without depicting an encounter or importing Chapter 397 consequences.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Meteor City childhood', 'Power Cleaners screening', 'Chrollo performance', 'Childhood troupe naming', 'Uvogin partnership', 'Sarasa tape search', 'Child-abduction threat']),
    events: succession396TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Lisores', 'Chrollo Lucilfer', 'Uvogin', 'Phinks Magcub', 'Feitan Portor', 'Sarasa', 'Sheila', 'Pakunoda', 'Shalnark', 'Franklin Bordeau', 'Machi Komacine', 'Nobunaga Hazama']),
    locations: freeze(['Meteor City', 'Meteor City · All-Faiths Church auditorium', 'Meteor City · forest near the All-Faiths Church', 'Meteor City · corporate dump near Uga Forest', 'Meteor City · outskirts / Uga Forest approach']),
    threadLabels: freeze(['Meteor City', 'Troupe origin', 'Power Cleaners', 'Childhood relationships', 'Child-abduction threat']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 396 synopsis.',
      'No chapter title, exact clock time, flashback year, or character age is invented.',
      'The entire supplied chapter is treated as historical flashback; no present-day Black Whale operational update is manufactured.',
      '“Troupe” is preserved as the children’s performance-group label while the full Phantom Troupe name and later Spider structure remain outside the boundary.',
      'Sheila and Sarasa are not automatically treated as later Phantom Troupe members because they participate in the childhood performance group.',
      'Chrollo’s villain voices and Uvogin’s world-greatest-villain goal remain theatrical context rather than a criminal vow.',
      'Sarasa remains unharmed in Chapter 396 story-time; Chapter 397 outcomes are not imported.',
      'The kidnappers’ final “one more” discussion is a threat/cliffhanger, not a completed or explicitly targeted Sarasa abduction.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, source: true }),
    keyResearch: freeze({ performance: succession396PerformanceResearch, troupeOrigin: succession396TroupeOriginResearch, sarasa: succession396SarasaResearch }),
    relationships: succession396RelationshipRecords,
    resolvedQuestions: succession396ResolvedQuestions,
    mysteries: succession396Mysteries,
  }),
]);

export const succession396ChapterFocus = succession396ChapterResearch[0].focus;
