const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_375';

export const succession375SourcePolicy = freeze({
  reviewedAt: '2026-08-08',
  soleStorySource: 'User-supplied Hunterpedia Chapter 375 synopsis and chapter notes',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
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
  chapter: 375,
  confidence,
  source,
});

export const succession375TimelineEvents = freeze([
  event({ id: '375-tyson-meeting', title: 'Tyson leads a Book of Tyson meeting while eye-wogs remain attached to readers', detail: 'Tyson preaches about love and the Book of Tyson to her guards. Izunavi and Giuliano continue observing the small creatures resting on readers while Tyson’s larger Guardian Spirit Beast hovers above her.', tracks: ['tyson', 'book-of-tyson', 'eye-wogs', 'guardian-spirit-beast'], location: 'Black Whale · Tier 1 · Room 1006' }),
  event({ id: '375-tyson-beast-mechanics', title: 'Tyson’s Guardian Spirit Beast is revealed as an Emitter diffusive-levy system', detail: 'The beast creates eye-wogs that attach to people who receive the Book of Tyson. They collect aura from hosts in exchange for happiness, with the amount collected depending on how thoroughly the person has read the book. Breaking the book’s sole taboo brings severe punishment.', tracks: ['tyson', 'eye-wogs', 'emission', 'diffusive-levy', 'aura-collection'], location: 'Black Whale · Tier 1 · Room 1006' }),
  event({ id: '375-camilla-beast-mechanics', title: 'Camilla’s Guardian Spirit Beast is described as a coercive Manipulator', detail: 'Camilla’s Guardian Spirit Beast is identified as a Manipulator using a coercive-type effect capable of controlling a person once its conditions are fulfilled. The supplied Chapter 375 text does not enumerate those conditions.', tracks: ['camilla', 'guardian-spirit-beast', 'manipulation', 'coercion'], location: 'Black Whale · Tier 1', confidence: 'classification and broad function confirmed; trigger conditions unresolved' }),
  event({ id: '375-tubeppa-beast-mechanics', title: 'Tubeppa’s Guardian Spirit Beast is described as a collaborative Transmuter', detail: 'Tubeppa’s Guardian Spirit Beast can produce different drugs within its body, but activation requires a research partner.', tracks: ['tubeppa', 'guardian-spirit-beast', 'transmutation', 'collaborative', 'drug-synthesis'], location: 'Black Whale · Tier 1', confidence: 'core function confirmed; exact drug catalogue and partner rules unresolved' }),
  event({ id: '375-luzurus-beast-mechanics', title: 'Luzurus’s Guardian Spirit Beast is described as a desire-based trap Conjurer', detail: 'Luzurus’s Guardian Spirit Beast uses a pseudo-coercive manipulative trap: it conjures something desired by the target and activates its effect when the target takes the bait.', tracks: ['luzurus', 'guardian-spirit-beast', 'conjuration', 'desire-trap'], location: 'Black Whale · Tier 1', confidence: 'core trap structure confirmed; full target and effect rules unresolved' }),
  event({ id: '375-halkenburg-memorial-aura', title: 'Halkenburg’s marked fellowship produces a frightening surge of aura', detail: 'Halkenburg and his guards hold a moment of silence for Momoze. Shikaku, observing for Benjamin, becomes frightened by the rise in collective aura around the prince.', tracks: ['halkenburg', 'shikaku', 'momoze', 'feather-marks', 'collective-aura'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '375-halkenburg-beast-mechanics', title: 'Halkenburg’s Guardian Spirit Beast is revealed as an Enhancer symbiotic fellowship system', detail: 'The more feather-marked people gather around Halkenburg, the greater the group’s aura and potential become. The supplied text describes the activated ability as reaching an exceptionally high level among Nen abilities.', tracks: ['halkenburg', 'guardian-spirit-beast', 'enhancement', 'symbiotic', 'feather-marks'], location: 'Black Whale · Tier 1 · Room 1009' }),
  event({ id: '375-shikaku-delays-attack', title: 'Shikaku delays attacking Halkenburg and develops a memory-revision hypothesis', detail: 'Shikaku considers killing Halkenburg immediately but fears a Guardian Spirit Beast counterattack. He separately guesses that the beast may use soliciting-type Manipulation to revise or overwrite memories and decides to wait for backup.', tracks: ['shikaku', 'halkenburg', 'benjamin', 'memory-revision', 'threat-assessment'], location: 'Black Whale · Tier 1 · Room 1009', confidence: 'Shikaku hypothesis; it does not replace the chapter’s revealed Enhancer/symbiotic classification' }),
  event({ id: '375-shikaku-requests-backup', title: 'Shikaku reports to Benjamin and requests one or two additional personnel', detail: 'Shikaku tells Benjamin that Halkenburg requires careful preparation and asks for one or two more Benjamin-aligned people so his observations can be verified if the beast affects him.', tracks: ['shikaku', 'benjamin', 'backup', 'counterintelligence'], location: 'Black Whale · Tier 1 · Room 1009 / Benjamin communications' }),
  event({ id: '375-benjamin-threat-triage', title: 'Benjamin weighs three major threats while Balsamilco recommends waiting', detail: 'Benjamin considers whether to prioritize the assassin operating around Woble, Halkenburg’s collective power, or Tserriednich. Balsamilco cites the Camilla incident and advises Benjamin to wait and observe how the situation develops.', tracks: ['benjamin', 'balsamilco', 'woble', 'halkenburg', 'tserriednich', 'threat-triage'], location: 'Black Whale · Tier 1 · Benjamin command' }),
  event({ id: '375-halkenburg-second-appeal', title: 'Halkenburg leaves with five guards to appeal to Nasubi again', detail: 'Halkenburg says he cannot accept another victim and leaves his quarters with five personal guards to make another appeal to Nasubi to stop the succession battle, despite being reminded that meetings with the king outside banquets are forbidden.', tracks: ['halkenburg', 'nasubi', 'succession-contest', 'appeal'], location: 'Black Whale · Tier 1 · from Room 1009' }),
  event({ id: '375-fugetsu-door-fails', title: 'Fugetsu cannot make the Nen door appear again', detail: 'Back in her quarters after the first translocation, Fugetsu tries to reproduce the state in which the door appeared but nothing manifests.', tracks: ['fugetsu', 'nen-door', 'translocation', 'limitation'], location: 'Black Whale · Tier 1 · Room 1011', confidence: 'repeat attempt failure confirmed; no cooldown or one-use rule established' }),
  event({ id: '375-biscuit-wakes-hanzo', title: 'Biscuit wakes Hanzo and receives his murder and Room 1013 report', detail: 'Biscuit wakes Hanzo, returning him from his projected/ethereal state to his physical body. Hanzo tells her that he killed Tuffdy and briefs her on Marayam’s Guardian Spirit Beast and the empty Room 1013 state.', tracks: ['biscuit', 'hanzo', 'tuffdy', 'room-1013'], location: 'Black Whale · Tier 1 · hidden Room 1013 state' }),
  event({ id: '375-vergei-blocks-belerainte', title: 'Vergei initially refuses to send Belerainte back to Kurapika’s class', detail: 'Vergei cites Barrigen’s death, the uncaught assassin, and his disbelief in supernatural Nen claims as reasons not to let Belerainte return to Room 1014.', tracks: ['vergei', 'belerainte', 'kurapika', 'barrigen', 'nen-class'], location: 'Black Whale · Tier 1 · hidden Room 1013 state' }),
  event({ id: '375-biscuit-true-form', title: 'Biscuit reveals her original body to demonstrate the scope of Nen', detail: 'To overcome Vergei’s disbelief, Biscuit returns to her original muscular form and says that even she cannot fully explain the transformation, using it as an example of how broad Nen can be.', tracks: ['biscuit', 'vergei', 'nen-demonstration'], location: 'Black Whale · Tier 1 · hidden Room 1013 state' }),
  event({ id: '375-vergei-accepts-training', title: 'Vergei asks Biscuit to train him and permits Belerainte to return to class', detail: 'Biscuit says that with enough aptitude she can train someone for a month and roughly double their physical abilities. Convinced by her demonstration, Vergei selects himself as her trainee and agrees to send Belerainte back to Kurapika’s Nen class.', tracks: ['vergei', 'biscuit', 'belerainte', 'nen-training'], location: 'Black Whale · Tier 1 · hidden Room 1013 state', confidence: 'Biscuit training claim preserved as her stated expectation for someone with sufficient aptitude' }),
  event({ id: '375-boundary-types', title: 'Biscuit explains three broad Nen-space boundary types', detail: 'During the Room 1013 test, Biscuit describes Nen-space boundaries as impermeable, permeable, or one-way.', tracks: ['biscuit', 'room-1013', 'nen-space', 'boundary'], location: 'Black Whale · Tier 1 · hidden Room 1013 state' }),
  event({ id: '375-belerainte-exits', title: 'Belerainte successfully exits the hidden Room 1013 state', detail: 'Belerainte opens the door and initially sees an ordinary hallway. He steps completely outside; Vergei confirms from inside that the household can still observe him during the test.', tracks: ['belerainte', 'vergei', 'room-1013', 'boundary-test'], location: 'Black Whale · Tier 1 · Room 1013 doorway' }),
  event({ id: '375-belerainte-cannot-return', title: 'Belerainte discovers that the Room 1013 boundary is one-way', detail: 'When Belerainte tries to reenter, his arm disappears across the threshold from Vergei’s perspective. From Belerainte’s outside perspective, the hidden occupants have disappeared and the Room 1013 he sees is not the space they occupy. The chapter notes state that people who exit cannot return or see anyone inside.', tracks: ['belerainte', 'vergei', 'room-1013', 'one-way-boundary'], location: 'Black Whale · Tier 1 · Room 1013 doorway / ordinary corridor' }),
  event({ id: '375-marayam-space-confirmed-one-way', title: 'Biscuit identifies the hidden Room 1013 state as a one-way Nen space', detail: 'Biscuit concludes from Belerainte’s test that the boundary is one-way and considers Marayam’s Guardian Spirit Beast the likely creator of the hidden space.', tracks: ['biscuit', 'marayam', 'guardian-spirit-beast', 'room-1013', 'one-way-boundary'], location: 'Black Whale · Tier 1 · hidden Room 1013 state', confidence: 'one-way boundary confirmed by test; Guardian Spirit Beast authorship remains Biscuit’s likely explanation' }),
  event({ id: '375-biscuit-trains-room1013', title: 'Biscuit begins Nen instruction for the hidden Room 1013 staff', detail: 'With Vergei convinced, Biscuit begins training the staff who remain inside the hidden one-way Room 1013 space.', tracks: ['biscuit', 'vergei', 'marayam', 'nen-training'], location: 'Black Whale · Tier 1 · hidden Room 1013 state' }),
]);

export const succession375GuardianBeastResearch = freeze({
  tyson: freeze({ host: 'Tyson Hui Guo Rou', nenType: 'Emitter', subtype: 'diffusive levy', mechanics: freeze(['Creates eye-wogs that attach to recipients of the Book of Tyson.', 'Eye-wogs collect aura from their hosts in exchange for happiness.', 'Aura collected depends on how thoroughly the host has read the book.', 'Breaking the book’s sole taboo brings severe punishment.']), unresolved: freeze(['content of the taboo', 'exact punishment', 'all attachment/removal conditions']), source }),
  camilla: freeze({ host: 'Camilla Hui Guo Rou', nenType: 'Manipulator', subtype: 'coercive', mechanics: freeze(['Can control a person after conditions are fulfilled.']), unresolved: freeze(['activation conditions', 'duration', 'range', 'degree of control']), source }),
  tubeppa: freeze({ host: 'Tubeppa Hui Guo Rou', nenType: 'Transmuter', subtype: 'collaborative', mechanics: freeze(['Can produce various drugs within its body.', 'Requires a research partner to activate.']), unresolved: freeze(['eligible research partner', 'drug catalogue', 'production costs', 'delivery method']), source }),
  luzurus: freeze({ host: 'Luzurus Hui Guo Rou', nenType: 'Conjurer', subtype: 'pseudo-coercive manipulation', mechanics: freeze(['Creates a trap shaped around something the target desires.', 'The effect activates when the target takes the bait.']), unresolved: freeze(['target selection', 'exact conjured bait rules', 'result after activation']), source }),
  halkenburg: freeze({ host: 'Halkenburg Hui Guo Rou', nenType: 'Enhancer', subtype: 'symbiotic fellowship', mechanics: freeze(['Feather-marked people gathering around Halkenburg increase the group’s aura and potential.', 'More marked participants produce a stronger collective state.', 'The supplied text describes the activated ability as reaching an exceptionally high level among Nen abilities.']), unresolved: freeze(['complete activation trigger', 'relationship between collective enhancement and the memory-loss/mark phenomenon', 'maximum group size']), source }),
});

export const succession375ShikakuAssessment = freeze({
  observer: 'Shikaku',
  target: 'Halkenburg’s Guardian Spirit Beast',
  hypothesis: 'Shikaku believes the beast may use soliciting-type Manipulation to revise or overwrite memories and worries that an attack could compromise his own observations.',
  operationalResponse: 'He delays an immediate attack and requests one or two additional Benjamin-aligned people for verification/backup.',
  confidenceBoundary: 'This is Shikaku’s working analysis and does not replace the chapter’s explicit Enhancer/symbiotic classification of Halkenburg’s Guardian Spirit Beast.',
  source,
});

export const succession375FugetsuDoorResearch = freeze({
  observed: 'Fugetsu attempts to summon the Nen door again after returning to her own bedroom, but it does not appear.',
  establishedLimitation: 'The Chapter 374 manifestation is not freely repeatable on demand under the same consciously reproduced attempt.',
  notEstablished: freeze(['once-per-day limit', 'cooldown duration', 'emotional trigger', 'directionality rule', 'automatic destination rule']),
  source,
});

export const succession375Room1013BoundaryResearch = freeze({
  classification: 'one-way Nen space boundary',
  boundaryFramework: freeze(['impermeable', 'permeable', 'one-way']),
  observedRules: freeze([
    'A person inside the hidden Room 1013 state can leave through the doorway.',
    'After fully leaving, that person cannot see the occupants remaining inside.',
    'The room visible from outside is not the hidden space occupied by Marayam’s household.',
    'The supplied notes state that a person who exits cannot return through the boundary.',
  ]),
  testSubject: 'Belerainte',
  likelyCreator: 'Biscuit considers Marayam’s Guardian Spirit Beast the likely source.',
  confidenceBoundary: 'One-way behavior is established by direct testing. Guardian Spirit Beast authorship remains a strong in-story surmise at Chapter 375.',
  source,
});

export const succession375BiscuitTrainingResearch = freeze({
  instructor: 'Biscuit Krueger',
  trainee: 'Vergei',
  demonstration: 'Biscuit returns to her original muscular form to demonstrate the range of Nen phenomena.',
  claim: 'For someone with sufficient aptitude, Biscuit says one month of her instruction can roughly double physical abilities.',
  consequence: 'Vergei asks Biscuit to train him, permits Belerainte to resume Kurapika’s class, and Biscuit begins training the remaining hidden Room 1013 staff.',
  source,
});

export const succession375HalkenburgOperation = freeze({
  collectiveState: 'Feather-marked followers around Halkenburg produce a dramatic collective aura rise through the Guardian Spirit Beast’s symbiotic enhancement.',
  benjaminResponse: 'Shikaku delays attacking, requests backup, and warns Benjamin. Benjamin weighs the Woble assassin, Halkenburg’s united power, and Tserriednich as competing threats; Balsamilco recommends waiting.',
  halkenburgAction: 'Halkenburg leaves with five personal guards to appeal to Nasubi again and ask that the succession battle be stopped.',
  source,
});

export const succession375RelationshipRecords = freeze([
  freeze({ from: 'Biscuit Krueger', to: 'Vergei', type: 'Nen instructor / newly convinced trainee', note: 'Biscuit’s true-form demonstration convinces Vergei that Nen is real; he asks her to train him and allows Belerainte to return to Kurapika’s class.', phase: 'Active contest and voyage', chapters: '375', state: 'training begins / trust in Nen established', source }),
  freeze({ from: 'Belerainte', to: 'Marayam household', type: 'One-way boundary separation', note: 'Belerainte exits the hidden Room 1013 state and can no longer see or return to the household inside, while continuing toward Kurapika’s class.', phase: 'Active contest and voyage', chapters: '375', state: 'outside hidden space / return blocked', source }),
  freeze({ from: 'Shikaku', to: 'Halkenburg Hui Guo Rou', type: 'Benjamin observer / escalating threat assessment', note: 'Shikaku sees Halkenburg’s collective aura rise, delays assassination, and requests backup while forming a memory-revision hypothesis.', phase: 'Active contest and voyage', chapters: '375', state: 'surveillance continues / attack delayed', source }),
]);

export const succession375Mysteries = freeze([
  freeze({ question: 'What exact conditions control Fugetsu’s Nen door after its first manifestation?', evidence: 'Fugetsu tries to reproduce the Chapter 374 manifestation but cannot make the door appear again.', status: 'open / repeatability limitation demonstrated', lastChapter: '375', source }),
  freeze({ question: 'Is Marayam’s Guardian Spirit Beast definitively the creator of the hidden one-way Room 1013 space?', evidence: 'Belerainte’s test confirms a one-way boundary. Biscuit considers Marayam’s beast the likely source, but the supplied Chapter 375 text does not present authorship as an omniscient confirmation.', status: 'one-way mechanics resolved / authorship strongly suspected', lastChapter: '375', source }),
  freeze({ question: 'What is the sole taboo in the Book of Tyson and what punishment follows a violation?', evidence: 'Tyson’s eye-wog system is revealed to punish readers severely if they break the book’s single taboo, but neither the taboo nor punishment is specified.', status: 'open', lastChapter: '375', source }),
  freeze({ question: 'What are the activation conditions for Camilla, Tubeppa, and Luzurus’s Guardian Spirit Beast abilities?', evidence: 'Chapter 375 reveals their broad mechanics but leaves critical trigger, target, and effect details incomplete.', status: 'open mechanics boundary', lastChapter: '375', source }),
]);

const focus = 'Chapter 375 reveals major Guardian Spirit Beast mechanics for Tyson, Camilla, Tubeppa, Luzurus, and Halkenburg; Shikaku escalates Benjamin’s threat assessment of Halkenburg; Fugetsu fails to reproduce her door on demand; and Belerainte’s live test finally establishes Room 1013 as a one-way Nen space, after which Biscuit begins training Vergei and the hidden household while attributing the space to Marayam’s beast only as a likely explanation.';

export const succession375ChapterResearch = freeze([
  freeze({
    number: 375,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze(['Guardian Spirit Beast mechanics', 'Halkenburg collective aura', 'Fugetsu door limitation', 'Room 1013 one-way boundary', 'Biscuit Nen training']),
    focus,
    events: succession375TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Tyson Hui Guo Rou', 'Izunavi', 'Giuliano', 'Camilla Hui Guo Rou', 'Tubeppa Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Halkenburg Hui Guo Rou', 'Shikaku', 'Benjamin Hui Guo Rou', 'Balsamilco Might', 'Nasubi Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Biscuit Krueger', 'Hanzo', 'Vergei', 'Belerainte', 'Marayam Hui Guo Rou', 'Sevanti Hui Guo Rou']),
    appearances: freeze(['Tyson Hui Guo Rou', 'Izunavi', 'Giuliano', 'Camilla Hui Guo Rou', 'Tubeppa Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Halkenburg Hui Guo Rou', 'Shikaku', 'Benjamin Hui Guo Rou', 'Balsamilco Might', 'Nasubi Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Biscuit Krueger', 'Hanzo', 'Vergei', 'Belerainte', 'Marayam Hui Guo Rou', 'Sevanti Hui Guo Rou']),
    relationships: succession375RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession375Mysteries,
    abilities: freeze([succession375GuardianBeastResearch, succession375FugetsuDoorResearch, succession375Room1013BoundaryResearch]),
    locations: freeze(['Black Whale · Tier 1 · Room 1006', 'Black Whale · Tier 1 · Room 1009', 'Black Whale · Tier 1 · Room 1011', 'Black Whale · Tier 1 · hidden Room 1013 state', 'Black Whale · Tier 1 · Room 1013 doorway']),
    objects: freeze(['Book of Tyson', 'feather marks']),
    organizations: freeze(['Hunter Association']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, guardianBeasts: true, abilities: true, mysteries: true, locations: true, nenSpace: true }),
    confidence: freeze([
      'Tyson, Camilla, Tubeppa, Luzurus, and Halkenburg Guardian Spirit Beast classifications/functions are preserved as Chapter 375 mechanics reveals.',
      'Shikaku’s soliciting-Manipulator/memory-revision model remains his inference and is not used to overwrite Halkenburg’s revealed Enhancer/symbiotic classification.',
      'Fugetsu’s failed repeat attempt establishes lack of free on-demand repeatability, not a specific cooldown.',
      'Room 1013’s one-way boundary is confirmed by Belerainte’s test; Marayam Guardian Spirit Beast authorship remains Biscuit’s likely explanation.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession375SourcePolicy,
  }),
]);

export const succession375ChapterFocus = freeze({ 375: focus });
