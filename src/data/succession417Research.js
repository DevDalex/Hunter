import { succession417TimelineEvents } from './succession417EventPacket.js';

const freeze = (value) => Object.freeze(value);
const source417 = 'https://hunterxhunter.fandom.com/wiki/Chapter_417';

export { succession417TimelineEvents };

export const succession417SourcePolicy = freeze({
  reviewedAt: '2026-08-14',
  soleSubstantiveSource: freeze({
    label: 'User-supplied Chapter 417 synopsis',
    basis: 'The synopsis supplied directly in chat is the sole substantive Chapter 417 story source for this modernization.',
    referenceUrl: source417,
  }),
  titleRule: 'The user did not supply Chapter 417’s official title or Japanese title. Do not invent them; use generic Chapter 417 labelling until verified metadata is supplied.',
  publicationCeiling: 'Chapter 417 is the latest published chapter at this integration boundary.',
  chronologyRule: 'Continue Voyage Day 12 directly from Chapter 416. Preserve scene order and relative movement without inventing clock times.',
  inferenceRule: 'Salkov’s illusion analysis, Benjamin’s prince-by-prince death projections, Benjamin’s interpretation of Halkenburg/Balsamilco, Benjamin’s theory about Unma, and all cover-story plans remain speaker-bounded plans or inferences rather than omniscient outcomes.',
  abilityRule: 'Gypsy Life: Bohemian Rhapsody is recorded exactly as supplied. The host-selection alternation rule follows the supplied synopsis/translation note rather than the noted Viz rendering.',
  stoppingPoint: 'Benjamin decides to confront Unma and force her to choose between her own life and that of his “Brother,” Halkenburg.',
  futureRule: 'No Chapter 418+ outcome exists in the supplied publication set. Do not extrapolate what happens after Benjamin’s stated plan at the Chapter 417 endpoint.',
});

const focus = 'Special Martial Law becomes Benjamin’s consolidated endgame: he brutalizes the apparently defeated Tserriednich while Salkov tests reality, expands military control over Justice, covertly infects Tubeppa and Tyson with TSK-17, discloses his own layered curse/infection state to Balsamilco and Coventoba, distributes investigations across his first unit, reveals the mechanics of Gypsy Life: Bohemian Rhapsody, and ends by resolving to confront Unma over Furykov, Beyond, and Halkenburg.';

export const succession417ChapterResearch = freeze([freeze({
  number: 417,
  title: 'Chapter 417',
  japaneseTitle: null,
  phase: 'Current releases',
  voyageDay: 'Voyage Day 12',
  lanes: freeze([
    'Royal contest',
    'Benjamin emergency campaign',
    'Justice and military control',
    'TSK-17 operations',
    'Halkenburg / Balsamilco identity conflict',
    'Guardian Spirit Beast mechanics',
    'Unma / Furykov / Beyond strategy',
  ]),
  focus,
  events: succession417TimelineEvents,
  prelude: freeze([]),
  locations: freeze([
    'Black Whale · Tier 1 · Room 1004',
    'Black Whale · Tier 1 · Room 1001',
    'Black Whale · Tier 1 · Ministry of Justice / Central Justice Bureau',
    'Black Whale · Tier 1 · VVIP corridors',
  ]),
  characters: freeze([
    'Benjamin Hui Guo Rou','Tserriednich Hui Guo Rou','Salkov','Theta','Danjin',
    'Tubeppa Hui Guo Rou','Tyson Hui Guo Rou','Zhang Lei Hui Guo Rou','Luzurus Hui Guo Rou',
    'Ridge','Kanjidol','Coventoba','Balsamilco Might','Halkenburg Hui Guo Rou','Camilla Hui Guo Rou',
    'Kurapika','Chiyamasi','Fugetsu Hui Guo Rou','Woble Hui Guo Rou','Oito Hui Guo Rou',
    'Marayam Hui Guo Rou','Furykov','Beyond Netero','Unma Hui Guo Rou',
  ]),
  threadLabels: freeze(['Benjamin','Tserriednich','Salkov','Tubeppa','Tyson','Balsamilco','Coventoba','Halkenburg','Unma','Nen development','Justice & military']),
  confidence: freeze([
    '74 chapter-bounded canonical beats are taken only from the supplied Chapter 417 synopsis.',
    'Tserriednich’s apparent death is preserved as Benjamin’s observed/assessed state while Salkov continues to question whether the scene is an illusion; no beyond-endpoint confirmation is invented.',
    'Tubeppa and Tyson are directly exposed to TSK-17 in Room 1001; Benjamin’s later death-window estimates remain his strategic projections.',
    'Benjamin’s approximately half-day self-prognosis is his own disclosed assessment.',
    'Gypsy Life: Bohemian Rhapsody is recorded with the supplied alternating future-host selection rule and the translation discrepancy is documented.',
    'Chapter 417 is the current publication ceiling; no Chapter 418+ consequence is invented.',
  ]),
  status: 'Strict maintained Chapter 417 packet: 74 chapter-bounded beats, Room 1004 aftermath, Justice takeover, Room 1001 TSK-17 operation, Balsamilco/Coventoba reintegration, Gypsy Life reveal, Unma/Halkenburg endpoint, and current-publication-ceiling firewall',
  coverage: freeze({ identity:true, publication:true, summary:true, sceneSummary:true, chronology:true, appearances:true, locations:true, relationships:true, assignments:true, nen:true, source:true }),
  lastReviewed: 'August 14, 2026',
  releaseDate: null,
  titleStatus: 'official-title-not-supplied',
  officialReaderUrl: null,
  source: source417,
  crossChecks: freeze([succession417SourcePolicy.soleSubstantiveSource]),
})]);

export const succession417ChapterFocus = freeze({ 417: focus });

export const succession417NenFindings = freeze([
  freeze({ subject:'Tserriednich · reality/illusion state', finding:'Salkov remains unsure whether the battered body, Benjamin, or the wider scene are genuine and plans to use Theta’s Nen-visible scar as a reality check.', status:'Salkov inference / scene reality unresolved at his observation point', source:source417 }),
  freeze({ subject:'TSK-17 · Benjamin', finding:'Benjamin tells Balsamilco and Coventoba that he is infected with TSK-17 and has roughly half a day to live.', status:'Benjamin self-disclosure / exact outcome beyond endpoint unavailable', source:source417 }),
  freeze({ subject:'TSK-17 · Tubeppa and Tyson', finding:'Benjamin covertly disperses a second TSK-17 dose in Room 1001; his later review treats both princes as infected.', status:'exposure/infection operation confirmed / later death projection remains Benjamin assessment', source:source417 }),
  freeze({ subject:'Secret Window', finding:'Benjamin uses Secret Window to observe Camilla contacting the medical department while planning how to frame the conflict.', status:'remote surveillance use confirmed', source:source417 }),
  freeze({ subject:'Zhang Lei coin', finding:'Coventoba reports the coin’s capabilities at displayed value 10; Benjamin orders him to keep holding it and states it will not change further.', status:'Coventoba report plus Benjamin instruction', source:source417 }),
  freeze({ subject:'Halkenburg transfer marker', finding:'Balsamilco proposes searching for a feather on the back of hands to identify possible mind-swap participants.', status:'investigative method proposed / complete participant set unresolved', source:source417 }),
  freeze({ subject:'Gypsy Life: Bohemian Rhapsody', finding:'After Benjamin’s death, his Guardian Spirit Beast fuses with Benjamin Baton and becomes the Guardian Spirit Beast of a blood relative; future-host selection alternates between Benjamin and the beast after the initial selection right is determined between them.', status:'ability mechanics revealed / future use not shown', source:source417 }),
]);

export const succession417Mysteries = freeze([
  freeze({ question:'Is the battered Tserriednich body real, and what exactly is Salkov experiencing?', evidence:'Salkov questions the body, Benjamin, and the scene and has not yet completed his Theta-scar reality check.', status:'open', lastChapter:'417', source:source417 }),
  freeze({ question:'What happens when Benjamin’s layered curse/infection deadline expires?', evidence:'Benjamin says he is cursed by Camilla’s Have-Nots, infected with TSK-17 with about half a day to live, and may also be Furykov’s Beyond-curse target.', status:'open at publication ceiling', lastChapter:'417', source:source417 }),
  freeze({ question:'What are the full consequences of the Room 1001 TSK-17 exposure?', evidence:'Benjamin later projects Tubeppa and Tyson will die around Camilla’s window, but Chapter 417 provides no later outcome.', status:'open at publication ceiling', lastChapter:'417', source:source417 }),
  freeze({ question:'How will Gypsy Life choose and transfer to its first future host?', evidence:'The mechanics are revealed, but Benjamin remains alive within the chapter and no transfer occurs.', status:'open', lastChapter:'417', source:source417 }),
  freeze({ question:'Will Benjamin confront Unma, and what will she choose?', evidence:'The chapter ends with Benjamin deciding to force a choice between Unma’s life and Halkenburg’s.', status:'open at publication ceiling', lastChapter:'417', source:source417 }),
]);

export const succession417ResolvedQuestions = freeze([
  freeze({ question:'Are Salkov and Danjin ordered into Justice custody?', answer:'Yes. Benjamin orders both escorted to the Central Justice Bureau and detained.', chapter:417, source:source417 }),
  freeze({ question:'Which princes are present in Room 1001?', answer:'Tubeppa and Tyson; Benjamin is told Zhang Lei and Luzurus fled before the declaration.', chapter:417, source:source417 }),
  freeze({ question:'Does Benjamin deploy the second TSK-17 dose?', answer:'Yes. He covertly disperses it into the air while speaking with Tubeppa and Tyson.', chapter:417, source:source417 }),
  freeze({ question:'Does Benjamin disclose his own afflicted state to Balsamilco and Coventoba?', answer:'Yes. After ordering Gyo, he tells them about the Have-Not curse, TSK-17 infection, and possible Beyond curse targeting.', chapter:417, source:source417 }),
  freeze({ question:'Is Benjamin’s Guardian Spirit Beast ability named?', answer:'Yes: Gypsy Life: Bohemian Rhapsody.', chapter:417, source:source417 }),
  freeze({ question:'What is the strict Chapter 417 endpoint?', answer:'Benjamin decides to confront Unma and force her to choose between her own life and Halkenburg’s.', chapter:417, source:source417 }),
]);
