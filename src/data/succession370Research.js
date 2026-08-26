const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_370';

export const succession370SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 370 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1 · Room 1014', confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 2 · first Nen class',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 370,
  confidence,
  source,
});

export const succession370TimelineEvents = freeze([
  event({ id: '370-class-security-line', title: 'Kurapika establishes a lethal-force boundary for the Nen class', detail: 'Kurapika conducts the lesson beside the master bedroom protecting Oito and Woble and lays white tape across the floor. He warns that crossing it can result in expulsion or lethal force without further warning.', tracks: ['kurapika', 'nen-class', 'security', 'woble', 'oito'] }),
  event({ id: '370-myuhan-provocation', title: 'Myuhan deliberately crosses Kurapika’s boundary', detail: 'Myuhan steps over the tape to provoke Kurapika. Danjin makes him identify himself as a Fourth Prince guard, and Kurapika calmly issues one final warning before drawing his gun when Myuhan starts forward again.', tracks: ['myuhan', 'danjin', 'kurapika', 'tserriednich', 'provocation'] }),
  event({ id: '370-kurapika-two-week-reaffirmed', title: 'Kurapika publicly reaffirms the two-week training promise', detail: 'After Myuhan challenges him, Kurapika assures the class he will honor the promised two-week timetable and turns Myuhan’s hostility into a controlled lesson in waiting until someone finishes speaking.', tracks: ['kurapika', 'myuhan', 'nen-training'] }),
  event({ id: '370-silent-majority-visibility', title: 'Silent Majority’s marionette visibility rule becomes clear', detail: 'The Silent Majority user states that only the user and the person currently possessed by the marionette can see it. Loberry is the possessed person during this class.', tracks: ['silent-majority', 'loberry', 'ability-mechanics'] }),
  event({ id: '370-silent-majority-ten-range', title: 'Silent Majority reveals a ten-person possession-selection range', detail: 'The user notes that Myuhan is not one of the ten people within the marionette’s range for choosing its possessed target, establishing a ten-person selection window without defining the physical distance or selection method.', tracks: ['silent-majority', 'myuhan', 'ability-mechanics'] }),
  event({ id: '370-silent-majority-rebound', title: 'Silent Majority carries a lethal-use rebound condition', detail: 'The user states that if the marionette is deactivated without killing anyone, the curse rebounds onto the user, motivating an early attack despite the unfavorable situation.', tracks: ['silent-majority', 'curse', 'condition'] }),
  event({ id: '370-furykov-kurapika-analysis', title: 'Furykov identifies Kurapika as a Conjurer through aura observation', detail: 'Furykov studies Kurapika’s handedness, Ten distribution, and aura texture and correctly concludes that Kurapika is a Conjurer who uses his right hand to activate an ability. His broader category-reading explanations remain Furykov’s observational framework rather than universal narrator rules.', tracks: ['furykov', 'kurapika', 'conjuration', 'nen-analysis'], confidence: 'Kurapika’s Conjurer identification is correct; Furykov’s detailed visual heuristics are his stated analysis method' }),
  event({ id: '370-oito-training-begins', title: 'Bill begins Oito’s first practical Nen training', detail: 'With Babimyna no longer using En, Bill helps Oito practice sensing and controlling aura. She reports only a slight pressure between her fingers, and Bill judges her initial pace as ordinary and likely gradual.', tracks: ['oito', 'bill', 'nen-training'] }),
  event({ id: '370-babimyna-assessment', title: 'Babimyna concludes Kurapika has multiple hidden abilities', detail: 'Babimyna tells Furykov that Kurapika is the central figure, is likely a Manipulator or Conjurer, and possesses multiple abilities beyond the fabricated confession ability used to mislead Benjamin’s camp.', tracks: ['babimyna', 'furykov', 'kurapika', 'counterintelligence'] }),
  event({ id: '370-bill-cover-broken', title: 'Babimyna determines the cockroach ability was not Bill’s', detail: 'Babimyna has concluded that the animal-capture ability demonstrated in Chapter 367 did not belong to Bill. Chapter 370 does not establish that he has identified Oito as the actual temporary user.', tracks: ['babimyna', 'bill', 'oito', 'little-eye', 'counterintelligence'] }),
  event({ id: '370-babimyna-timeline', title: 'Babimyna delays countermeasures until after the next banquet', detail: 'Babimyna says he is not ready to act because Woble’s Guardian Spirit Beast remains unseen and Bill’s actual ability remains unknown. He gives the period after the next banquet as his current countermeasure horizon.', tracks: ['babimyna', 'woble', 'bill', 'guardian-spirit-beast'] }),
  event({ id: '370-existing-users-raise-hands', title: 'Furykov and Belerainte openly declare prior Nen knowledge', detail: 'When Kurapika asks existing Nen users to raise their hands, Furykov and Belerainte do so. Kurapika positions them as observers who can judge and supplement his instruction.', tracks: ['furykov', 'belerainte', 'kurapika', 'nen-class'] }),
  event({ id: '370-four-hidden-users-remain', title: 'Furykov believes four other attendees continue hiding Nen ability', detail: 'Furykov concludes that the four concealed Nen users he detected earlier intend to maintain their pretense rather than identify themselves publicly.', tracks: ['furykov', 'hidden-nen-users', 'nen-class'], confidence: 'Furykov’s assessment; the four identities are not established by the supplied Chapter 370 text' }),
  event({ id: '370-loberry-draws-attention', title: 'Possessed Loberry draws the room’s attention to the invisible marionette', detail: 'Loberry sees the Silent Majority marionette, asks Yuri about the strange woman, and finally shouts and points toward it when Yuri cannot see anything. The mass shift of attention creates the opening the user was waiting for.', tracks: ['loberry', 'yuri', 'silent-majority', 'possession'] }),
  event({ id: '370-barrigen-attack', title: 'Silent Majority attacks Barrigen with four curse snakes', detail: 'Barrigen collapses while appearing to be strangled. Four snakes wrap around his neck and arms and drain his blood through numerous small mouths.', tracks: ['barrigen', 'silent-majority', 'curse-snakes', 'attack'] }),
  event({ id: '370-eleven-second-drain', title: 'Four Silent Majority snakes can exsanguinate a victim in eleven seconds', detail: 'The user explains that Silent Majority has four snakes and that when all four attack together they can drain a body of blood in eleven seconds.', tracks: ['silent-majority', 'ability-mechanics', 'exsanguination'] }),
  event({ id: '370-sakata-shoots-snakes', title: 'Sakata fires on the snakes after Barrigen collapses', detail: 'Sakata shoots at the visible white snakes and warns the others to stay back in case additional threats are inside Barrigen. Belerainte later says he wanted to check the body and claims Sakata killed Barrigen, while Sakata insists Barrigen was already dead from the snakes.', tracks: ['sakata', 'belerainte', 'barrigen', 'silent-majority'] }),
  event({ id: '370-barrigen-death', title: 'Barrigen dies from Silent Majority’s blood drain', detail: 'Barrigen is confirmed dead after the four snakes drain his blood. The chapter notes explicitly connect the manner of death to the five blood-drained royal guards from Chapter 359.', tracks: ['barrigen', 'death', 'silent-majority', 'chapter-359'] }),
  event({ id: '370-woble-beast-theory-rejected', title: 'Barrigen’s death disproves the theory that Woble’s Guardian Beast caused the Chapter 359 blood-draining deaths', detail: 'Because Silent Majority demonstrates a separate blood-draining Nen mechanism matching the earlier death pattern, the supplied chapter notes state that the theory blaming Woble’s Guardian Spirit Beast is disproved. The chapter does not independently identify the Chapter 359 killer as Silent Majority’s user.', tracks: ['woble', 'guardian-spirit-beast', 'chapter-359', 'silent-majority'], confidence: 'Woble-beast theory is rejected by the supplied notes; same-user attribution for the Chapter 359 murders remains unconfirmed' }),
  event({ id: '370-kurapika-9mm-assessment', title: 'Kurapika judges Gyo insufficient protection against Zhang Lei guard handguns', detail: 'Kurapika reasons that Gyo alone would not leave a person unharmed by the 9mm Luger-class handguns carried by Zhang Lei’s guards.', tracks: ['kurapika', 'gyo', 'firearms', 'sakata'], confidence: 'Kurapika’s stated combat assessment' }),
  event({ id: '370-assassin-among-class', title: 'Kurapika realizes the class contains a hidden assassin', detail: 'As the room reacts to Barrigen’s death, Kurapika concludes that an assassin is concealed among the group and begins analyzing the attack separately from the princes’ Guardian Spirit Beasts.', tracks: ['kurapika', 'silent-majority', 'assassin', 'nen-class'] }),
]);

export const succession370SilentMajorityMechanics = freeze({
  ability: 'Silent Majority',
  user: 'Unknown at the Chapter 370 boundary',
  marionetteVisibility: 'Visible only to the user and the person possessed by the marionette',
  possessedPersonInChapter: 'Loberry',
  possessionSelectionWindow: 'Ten people are within the marionette’s selectable range; exact physical range and selection method remain unknown',
  reboundCondition: 'If the marionette deactivates without killing anyone, the curse rebounds to the user',
  attackUnits: 4,
  attackForm: 'Four snake-like curse entities wrap around the victim and drain blood through multiple small mouths',
  fourSnakeKillTime: 'Eleven seconds to drain a body of blood when all four attack together',
  confirmedVictim: 'Barrigen',
  unresolved: freeze(['user identity', 'Nen category', 'full possession rules', 'physical range', 'target-selection method', 'whether the Chapter 359 murders were committed by the same user']),
  source,
});

export const succession370FurykovMethod = freeze({
  analyst: 'Furykov',
  confirmedConclusion: 'Correctly identifies Kurapika as a Conjurer and reads the right hand as the key ability-activation hand',
  statedIndicators: freeze([
    'Weapon held in the left hand while the dominant right hand remains free',
    'Strong Ten around Kurapika’s right hand',
    'Smooth overall aura used to support a Conjurer reading',
    'Furykov describes different aura-density patterns for other Nen categories',
  ]),
  archiveCaution: 'The category-specific visual heuristics are Furykov’s expert observational framework, not stored as universal Nen laws.',
  source,
});

export const succession370Counterintelligence = freeze({
  babimynaConclusions: freeze([
    'Kurapika is the central figure in Room 1014',
    'Kurapika is probably a Manipulator or Conjurer',
    'Kurapika has multiple abilities beyond the fake confession claim',
    'The Chapter 367 cockroach-control ability was not Bill’s actual ability',
  ]),
  stillUnknownToBabimyna: freeze(['Woble’s Guardian Spirit Beast', 'Bill’s actual Nen ability', 'Oito is not explicitly identified by Chapter 370 as the real Chapter 367 Little Eye user']),
  countermeasureHorizon: 'After the next banquet',
  source,
});

export const succession370BodyStates = freeze([
  freeze({ person: 'Barrigen', state: 'deceased', detail: 'Killed by Silent Majority after four snakes drain his blood.', chapter: 370, source }),
  freeze({ person: 'Oito Hui Guo Rou', state: 'alive / Nen-awakened / training begun', detail: 'Begins practical Nen exercises with Bill after her forced awakening in Chapter 369.', chapter: 370, source }),
]);

export const succession370RelationshipRecords = freeze([
  freeze({ from: 'Bill', to: 'Oito Hui Guo Rou', type: 'Nen instruction', note: 'Bill begins Oito’s practical post-awakening Nen training while Kurapika conducts the public class.', phase: 'Active contest and voyage', chapters: '370–current', state: 'active', source }),
  freeze({ from: 'Babimyna', to: 'Kurapika / Bill / Room 1014', type: 'Counterintelligence assessment', note: 'Babimyna concludes Kurapika has multiple hidden abilities and that the cockroach-control demonstration was not Bill’s real ability; he postpones countermeasures while Woble’s beast and Bill’s ability remain unknown.', phase: 'Active contest and voyage', chapters: '367–370', state: 'active', source }),
  freeze({ from: 'Silent Majority user', to: 'Room 1014 Nen class', type: 'Hidden hostile infiltration', note: 'An unidentified user operates through possessed Loberry and kills Barrigen during the first public Nen lesson.', phase: 'Active contest and voyage', chapters: '369–370', state: 'active / unidentified', source }),
]);

export const succession370Mysteries = freeze([
  freeze({ question: 'Who is the Silent Majority user inside or connected to the Room 1014 class?', evidence: 'The user operates a marionette visible only to themselves and possessed Loberry and kills Barrigen with four blood-draining snakes, but Chapter 370 does not reveal the user’s identity.', status: 'open / active murderer', lastChapter: '370', source }),
  freeze({ question: 'Did the Silent Majority user also kill the five blood-drained royal guards in Chapter 359?', evidence: 'Barrigen dies by a strikingly similar blood-draining mechanism, which the supplied notes use to disprove the Woble Guardian Beast theory. The supplied Chapter 370 text does not explicitly identify the earlier killer as the same Silent Majority user.', status: 'open / method strongly parallels earlier deaths', lastChapter: '370', source }),
  freeze({ question: 'Which four attendees is Furykov identifying as concealed Nen users?', evidence: 'Furykov continues to believe four attendees are hiding pre-existing Nen ability, but the supplied Chapter 370 text does not name all four.', status: 'open', lastChapter: '370', source }),
  freeze({ question: 'Can Babimyna identify Oito as the true Little Eye user after rejecting the Bill cover story?', evidence: 'Babimyna has concluded that the cockroach ability was not Bill’s, but Chapter 370 does not establish that he knows Oito was the actual temporary user.', status: 'developing counterintelligence risk', lastChapter: '370', source }),
]);

const focus = 'Kurapika’s first public Nen class becomes an active murder scene: Myuhan tests the room’s security boundary; Furykov correctly reads Kurapika as a Conjurer; Bill begins Oito’s practical Nen training; Babimyna breaks the fake-Bill reconnaissance cover; and Silent Majority reveals its possession, rebound, and four-snake blood-draining mechanics by killing Barrigen, disproving the theory that Woble’s Guardian Spirit Beast caused the earlier blood-drained guard deaths without yet identifying the Chapter 359 killer.';

export const succession370ChapterResearch = freeze([
  freeze({
    number: 370,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze(['Nen class', 'Silent Majority', 'Room 1014 security', 'Oito Nen training', 'Benjamin counterintelligence', 'Chapter 359 murder thread']),
    focus,
    events: succession370TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Kurapika', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Bill', 'Shimanu', 'Myuhan', 'Danjin', 'Furykov', 'Belerainte', 'Babimyna', 'Slakka', 'Loberry', 'Yuri', 'Barrigen', 'Sakata']),
    locations: freeze(['Room 1014 master-bedroom class area', 'Room 1014 bedroom / Oito training area']),
    threadLabels: freeze(['Silent Majority', 'Nen class', 'Oito awakening and training', 'Counterintelligence', 'Blood-draining murders']),
    confidence: freeze(['Story claims restricted to supplied Hunterpedia text', 'Furykov’s broader aura-reading heuristics retained as his framework', 'Chapter 359 same-user attribution remains unresolved']),
    status: 'Maintained dedicated research',
    coverage: freeze({ identity: true, publication: false, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true }),
    lastReviewed: 'August 7, 2026',
    source,
  }),
]);

export const succession370ChapterFocus = freeze({ 370: focus });
