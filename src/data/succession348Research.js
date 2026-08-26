const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_348';

export const succession348SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 348',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location, tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Pre-voyage · 289th Hunter Exam / Zodiac counterintelligence',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 348,
  confidence,
  source,
});

export const succession348TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-348-final-exam-questions',
    title: 'Cheadle runs the final 289th Hunter Exam information test',
    detail: 'Applicants are questioned about whether they knew of Beyond Netero’s Dark Continent expedition, how and when they learned of it, how they would explain the information to an uninformed person, and what advantage they gained from knowing early.',
    location: '289th Hunter Exam · final testing area',
    tracks: ['hunter-exam', 'cheadle', 'beyond', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-dowsing-screening',
    title: 'Kurapika screens examinees with Dowsing Chain',
    detail: 'From a separate room, Kurapika uses Dowsing Chain to evaluate applicant statements while Mizaistom observes. Kurapika judges the first examinee as uninformed, Muherr as mixing truth and lies, and a third examinee as concealing extremely important information.',
    location: '289th Hunter Exam · monitoring room',
    tracks: ['kurapika', 'mizaistom', 'dowsing-chain', 'muherr', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-dowsing-memory-limit',
    title: 'Kurapika identifies a possible memory-manipulation blind spot',
    detail: 'Kurapika explains Dowsing Chain’s lie-detection use and worries that it may fail if a target’s memories have been erased or altered, because the person might no longer consciously possess the hidden truth being tested.',
    location: '289th Hunter Exam · monitoring room',
    tracks: ['kurapika', 'dowsing-chain', 'memory-manipulation', 'counterintelligence'],
    confidence: 'Kurapika presents this as a possible limitation of his chain, not a demonstrated bypass shown in the chapter',
  }),
  timelineEvent({
    id: 'pre-voyage-348-succession-announcement',
    title: 'Benjamin tells Tserriednich that the voyage will decide the next king',
    detail: 'Benjamin calls Tserriednich and says Nasubi has decided that the succession will be settled during the expedition, with the surviving prince becoming the next king. Tserriednich answers that he intends to be that king.',
    location: 'Kakin royal communications · pre-voyage',
    tracks: ['benjamin', 'tserriednich', 'nasubi', 'succession-contest'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-tserriednich-staff-results',
    title: 'Theta reports the prince-bodyguard Hunter Exam results',
    detail: 'Theta tells Tserriednich that all five of his staff members passed as Provisional Hunters. Benjamin’s and Tyson’s bodyguards did not participate, while all of Luzurus’s bodyguards failed. Tserriednich orders his staff back to defensive duties and tells them to learn the Black Whale layout.',
    location: 'Tserriednich household · pre-voyage planning',
    tracks: ['tserriednich', 'theta', 'hunter-exam', 'black-whale', 'royal-households'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-fifteen-employee-limit',
    title: 'Prince households face a fifteen-employee ship limit',
    detail: 'The Hunter Association restricts each Kakin prince to fifteen employees aboard the Black Whale, making Hunter Exam success and household staffing choices part of the royal logistical competition.',
    location: 'Black Whale staffing rules · pre-voyage',
    tracks: ['hunter-association', 'kakin', 'black-whale', 'royal-households'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-old-zodiac-factions',
    title: 'Mizaistom explains the Zodiacs’ previous political factions',
    detail: 'Before the expedition-team reorganization, the Zodiacs were divided by political outlook into Hawks, Moderate Conservatives, and Liberal/Apolitical members, while Ging and Pariston stood outside those groupings. Mizaistom says members generally knew the Nen abilities only of people inside their own faction.',
    location: '289th Hunter Exam · monitoring room',
    tracks: ['zodiacs', 'mizaistom', 'political-factions', 'nen-information'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-zodiac-ability-sharing',
    title: 'The expedition reorganization triggers Zodiac ability sharing',
    detail: 'Because the Zodiacs are now regrouped by Science, Intelligence, Defense, and Flora/Fauna expertise, they agree to disclose their abilities to one another to improve cooperation and demonstrate innocence. Mizaistom says Kurapika’s ability will remain undisclosed to the others and that Kurapika will not be told every Zodiac ability either.',
    location: 'Hunter Association · Zodiac counterintelligence planning',
    tracks: ['zodiacs', 'kurapika', 'mizaistom', 'nen-information', 'expedition-teams'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-decoy-suspicion',
    title: 'Kurapika and Mizaistom suspect Juhnde and Muherr may be decoys',
    detail: 'The pair question whether Juhnde and Muherr were deliberately placed in the Hunter Exam as visible infiltrators so that a more important Beyond-linked spy could remain hidden.',
    location: '289th Hunter Exam · counterintelligence discussion',
    tracks: ['kurapika', 'mizaistom', 'juhnde', 'muherr', 'beyond', 'counterintelligence'],
    confidence: 'This is Kurapika and Mizaistom’s suspicion about the applicants’ role, not a confirmed operational fact in this chapter',
  }),
  timelineEvent({
    id: 'pre-voyage-348-zodiac-mole-test',
    title: 'Mizaistom stages a disclosure test to expose the Zodiac mole',
    detail: 'Mizaistom confronts the Zodiacs about the possibility of an internal spy and reveals information about his own ability while Kurapika watches the meeting through a hidden camera from another room, using Dowsing Chain to evaluate the reactions.',
    location: 'Hunter Association · Zodiac meeting / hidden monitoring room',
    tracks: ['mizaistom', 'kurapika', 'zodiacs', 'counterintelligence', 'dowsing-chain'],
  }),
  timelineEvent({
    id: 'pre-voyage-348-saiyu-identified',
    title: 'Kurapika identifies Saiyu as Beyond’s informant inside the Zodiacs',
    detail: 'Kurapika’s Dowsing Chain identifies Saiyu as the informant among the Zodiacs, resolving the immediate question of which Zodiac is leaking information to Beyond’s side while leaving the full scope of Saiyu’s role and communications unresolved.',
    location: 'Hunter Association · hidden monitoring room',
    tracks: ['kurapika', 'saiyu', 'beyond', 'zodiacs', 'counterintelligence'],
  }),
]);

export const succession348OldZodiacFactions = freeze([
  freeze({ faction: 'Hawks', outlook: 'Proponent for reform', members: freeze(['Cluck', 'Saiyu', 'Pyon']), source }),
  freeze({ faction: 'Moderate Conservative', outlook: 'Prioritize balance', members: freeze(['Botobai Gigante', 'Mizaistom Nana', 'Cheadle Yorkshire', 'Ginta']), source }),
  freeze({ faction: 'Liberal/Apolitical', outlook: 'Liberal / apolitical grouping', members: freeze(['Saccho Kobayakawa', 'Kanzai', 'Gel']), source }),
  freeze({ faction: 'Exceptions', outlook: 'Outside the three normal political factions', members: freeze(['Pariston Hill', 'Ging Freecss']), source }),
]);

export const succession348PrinceStaffExamMatrix = freeze([
  freeze({ prince: 'Tserriednich Hui Guo Rou', order: 4, result: 'All five bodyguards passed as Provisional Hunters', source }),
  freeze({ prince: 'Benjamin Hui Guo Rou', order: 1, result: 'Bodyguards did not participate in the Hunter Exam', source }),
  freeze({ prince: 'Tyson Hui Guo Rou', order: 6, result: 'Bodyguards did not participate in the Hunter Exam', source }),
  freeze({ prince: 'Luzurus Hui Guo Rou', order: 7, result: 'All bodyguards failed the Hunter Exam', source }),
]);

export const succession348RelationshipRecords = freeze([
  freeze({
    from: 'Saiyu',
    to: 'Beyond Netero',
    type: 'Covert informant link',
    note: 'Kurapika’s Dowsing Chain identifies Saiyu as the informant among the Zodiacs working for Beyond’s side. The chapter does not yet define the complete scope or duration of the information channel.',
    phase: 'Pre-voyage counterintelligence',
    chapters: '348–current',
    state: 'exposed to Kurapika/Mizaistom',
    source,
  }),
  freeze({
    from: 'Kurapika',
    to: 'Mizaistom Nana',
    type: 'Counterintelligence partnership',
    note: 'The two coordinate applicant screening, theory-testing, and a hidden-camera trap that identifies Saiyu as the Zodiac informant.',
    phase: 'Pre-voyage counterintelligence',
    chapters: '348',
    state: 'active',
    source,
  }),
]);

export const succession348Mysteries = freeze([
  freeze({
    question: 'Can altered or erased memory bypass Dowsing Chain?',
    evidence: 'Kurapika believes his lie-detection chain may fail if a target’s memories have been changed or erased, but Chapter 348 does not demonstrate the interaction directly.',
    status: 'open',
    lastChapter: '348',
    source,
  }),
  freeze({
    question: 'What is the full scope of Saiyu’s role in Beyond’s network?',
    evidence: 'Chapter 348 identifies Saiyu as the Zodiac informant, but does not yet establish every message he sent, how long he has been cooperating, or the complete operational purpose of his position.',
    status: 'developing',
    lastChapter: '348',
    source,
  }),
]);

const focus = 'Kurapika uses Dowsing Chain to screen the final 289th Hunter Exam applicants and identifies memory manipulation as a possible blind spot; Benjamin tells Tserriednich that the voyage will determine the next king while Theta reports the bodyguard exam results and the fifteen-employee limit; Mizaistom explains the Zodiacs’ old political factions and new ability-sharing rules; Kurapika and Mizaistom test the Zodiac mole theory through a hidden-camera setup, and Dowsing Chain identifies Saiyu as Beyond’s informant.';

export const succession348ChapterResearch = freeze([
  freeze({
    number: 348,
    title: 'Resolve',
    japaneseTitle: 'かく.ご',
    romanizedTitle: 'Kakugo',
    suppliedTitleMarker: 'M5',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      '289th Hunter Exam',
      'Kurapika / Dowsing Chain',
      'Zodiac counterintelligence',
      'Saiyu / Beyond',
      'Zodiac political factions',
      'Zodiac ability sharing',
      'Kakin succession contest',
      'Prince staffing / Provisional Hunters',
    ]),
    focus,
    events: succession348TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Mizaistom Nana', 'Cheadle Yorkshire', 'Muherr', 'Juhnde', 'Beyond Netero',
      'Tserriednich Hui Guo Rou', 'Benjamin Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Theta',
      'Tyson Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Saiyu', 'Cluck', 'Pyon', 'Botobai Gigante',
      'Ginta', 'Saccho Kobayakawa', 'Kanzai', 'Gel', 'Pariston Hill', 'Ging Freecss',
    ]),
    locations: freeze([
      '289th Hunter Exam · final testing area',
      '289th Hunter Exam · monitoring room',
      'Hunter Association · Zodiac meeting area',
      'Hunter Association · hidden monitoring room',
      'Kakin royal communications · pre-voyage',
      'Tserriednich household · pre-voyage planning',
      'Black Whale staffing rules · pre-voyage',
    ]),
    threadLabels: freeze([
      'Kurapika', 'Dowsing Chain', 'Hunter Exam', 'Zodiacs', 'Beyond Netero', 'Saiyu',
      'Counterintelligence', 'Tserriednich', 'Benjamin', 'Succession Contest', 'Black Whale staffing',
    ]),
    oldZodiacFactions: succession348OldZodiacFactions,
    princeStaffExamMatrix: succession348PrinceStaffExamMatrix,
    relationships: succession348RelationshipRecords,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 348 text',
      'The memory-manipulation bypass is Kurapika’s concern rather than a demonstrated limitation',
      'The old Zodiac factions are political alignments and are stored separately from the expedition’s functional Science / Intelligence / Defense / Flora-Fauna teams',
      'Saiyu being Beyond’s informant is treated as confirmed by Kurapika’s Dowsing Chain in the supplied chapter notes',
      'Juhnde and Muherr being deliberate decoys is retained only as Kurapika and Mizaistom’s suspicion',
      'The succession rule is stored as the Chapter 348 statement that the surviving prince becomes king, without using later material to rewrite this chapter-level reveal',
    ]),
    status: 'Maintained chapter summary, chronology, appearances, locations, Hunter Exam screening, Dowsing Chain limits, old Zodiac political factions, new ability-sharing structure, prince staffing results, succession reveal, Saiyu informant identification, relationships, mysteries, and source confidence linked',
    coverage: freeze({
      identity: true,
      publication: false,
      summary: true,
      sceneSummary: true,
      chronology: true,
      appearances: true,
      locations: true,
      relationships: true,
      assignments: true,
      nen: true,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession348ChapterFocus = freeze({ 348: focus });
