const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_385';

export const succession385SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 385 synopsis',
  titleMetadata: 'The supplied material does not include an English, Japanese, or romanized chapter title. No title is invented.',
  chronologyNote: 'Chapter 385 is published after Chapter 384 but returns to the night of the Sunday banquet on Voyage Day 8. The assassination attempt overlaps Melody’s flute performance already recorded in Chapter 383. No exact clock time beyond banquet-night / after 8:00 p.m. is invented.',
  temporalBoundary: 'Chapter 385 shows an extraordinary Zetsu-linked temporal or causal anomaly during Theta’s attempted assassination: Theta perceives a lethal headshot and corpse, the corpse then vanishes, Tserriednich is alive, and a guard describes the interval as time having skipped. The chapter material supplied here does not establish the later complete mechanics, exact duration, perception rules, or divergence rules of the phenomenon.',
  guardianBeastBoundary: 'Tserriednich’s Guardian Spirit Beast gradually disappears while he sustains Zetsu and returns after Zetsu ends. It explicitly warns Theta that another deception will cause her to cease being human. Salkov’s explanation of the escalating marks and his fear that the beast may turn Theta into Tserriednich’s pawn are stored separately: the warning and observed marks are evidence; pawn conversion is Salkov’s hypothesis.',
  thetaBoundary: 'Chapter 385 resolves the unspecified next-day action Theta contemplated in Chapter 384 as an assassination attempt. This is a Chapter 385 retrospective resolution and does not rewrite Chapter 384 as if the planned action had already been named there.',
  melodyBoundary: 'Tserriednich learns that the banquet performer is the Hunter Melody and orders a formal invitation. The guard notes that an invitation can be declined. The supplied synopsis says Tserriednich allows the guards to “deduce Melody” whether she declines or not; that wording is preserved without silently substituting a different verb or motive.',
  excluded: freeze([
    'Outside story claims',
    'Unsupplied Chapter 386+ mechanics for Tserriednich’s temporal ability',
    'A ten-second duration or complete precognition/divergence rule inferred from later chapters',
    'A claim that Theta actually killed Tserriednich',
    'A confirmed pawn-conversion mechanic based only on Salkov’s concern',
    'A confirmed third-deception punishment beyond the warnings and interpretations supplied here',
    'An invented exact clock time for the Chapter 385 training sequence',
  ]),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1 · Tserriednich quarters', time = 'Voyage Day 8 · banquet night · after 8:00 p.m.', confidence = 'confirmed' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 385,
  confidence,
  source,
});

export const succession385TimelineEvents = freeze([
  event({
    id: '385-tserriednich-zetsu-refinement',
    title: 'Tserriednich refines sustained Zetsu while his Guardian Spirit Beast fades',
    detail: 'Theta instructs Tserriednich to close his eyes, ignore external commotion, and eliminate every trace of aura. After correcting a sliver of aura at his left shoulder and deliberately resetting the exercise with a dropped mug and guard interruption, she watches him maintain concentration as his Guardian Spirit Beast gradually disappears.',
    tracks: ['tserriednich', 'theta', 'zetsu', 'guardian-spirit-beast', 'nen-training'],
  }),
  event({
    id: '385-theta-assassination-attempt',
    title: 'Theta attempts to assassinate Tserriednich during sustained Zetsu',
    detail: 'Theta first sends a small aura bubble toward Tserriednich without breaking his concentration. She then draws a gun and shoots him through the head while believing the prince is defenseless in Zetsu. She expects the act to cost her own life as well.',
    tracks: ['theta', 'tserriednich', 'assassination-attempt', 'zetsu'],
  }),
  event({
    id: '385-zetsu-temporal-anomaly',
    title: 'The apparent headshot death collapses into an unresolved time-skip anomaly',
    detail: 'Theta sees Tserriednich fall dead, but as Melody’s flute performance reaches the room the apparent corpse is no longer present. Guards enter, Tserriednich appears alive behind Theta, and he says he did not flinch from the gunshot. A guard later describes the interval during Melody’s performance as time having skipped. Chapter 385 confirms the anomaly but not its complete mechanism.',
    tracks: ['tserriednich', 'theta', 'melody', 'zetsu', 'temporal-anomaly', 'time-skip'],
    confidence: 'Observed sequence and guard report confirmed; exact Nen mechanism unresolved at the Chapter 385 boundary.',
  }),
  event({
    id: '385-guardian-beast-second-deception-warning',
    title: 'Tserriednich’s Guardian Spirit Beast escalates its warning against Theta',
    detail: 'After Tserriednich leaves Zetsu, his Guardian Spirit Beast returns and warns Theta that if she deceives Tserriednich once more she will cease to be human. Theta then loses consciousness.',
    tracks: ['tserriednich-guardian-spirit-beast', 'theta', 'deception', 'marking', 'coercion-risk'],
  }),
  event({
    id: '385-tserriednich-melody-invitation',
    title: 'Tserriednich orders a formal invitation for Melody',
    detail: 'After a guard explains that the beautiful landscape and lost interval accompanied a Hunter’s banquet performance, Tserriednich orders Melody to be invited formally. The guard reminds him that an invitation can be declined; the supplied synopsis records Tserriednich as allowing the guards to “deduce Melody” whether she accepts or refuses.',
    tracks: ['tserriednich', 'melody', 'hunter-association', 'invitation', 'banquet'],
    confidence: 'Invitation order and ability to decline are explicit; the supplied “deduce Melody” wording is preserved without reinterpretation.',
  }),
  event({
    id: '385-theta-salkov-post-collapse',
    title: 'Theta wakes after fifteen minutes and Salkov assesses the Guardian Spirit Beast’s escalating marks',
    detail: 'Theta wakes from a nightmare fifteen minutes after collapsing. Salkov shows her the facial damage and explains his reading of the beast’s escalating warnings: the first lie caused a nick, the second produced a brand, and a further violation may bring something worse than death. He worries that the beast may be trying to turn Theta into Tserriednich’s pawn and urges her to rest while they rethink their plan.',
    tracks: ['theta', 'salkov', 'guardian-spirit-beast', 'deception-marks', 'assassination-planning'],
    confidence: 'The marks and Salkov’s stated interpretation are explicit; pawn conversion remains Salkov’s hypothesis.',
  }),
]);

export const succession385ZetsuTrainingResearch = freeze({
  student: 'Tserriednich Hui Guo Rou',
  instructor: 'Theta',
  demonstratedInstruction: freeze([
    'Tserriednich closes his eyes and maintains concentration despite surrounding noise and commotion.',
    'Theta detects and corrects a remaining sliver of aura at his left shoulder.',
    'Theta deliberately creates distractions and restarts the exercise after the guards enter.',
    'A small aura bubble sent toward Tserriednich does not break his concentration.',
  ]),
  thetaPlan: 'Theta decides to keep Tserriednich in Zetsu for roughly forty minutes as part of the assassination setup.',
  guardianBeastObservation: 'Tserriednich’s Guardian Spirit Beast gradually disappears while he maintains Zetsu and returns after Zetsu ends.',
  boundary: 'Chapter 385 establishes the observed training behavior and beast disappearance/return. It does not by itself establish every universal interaction between Zetsu and Guardian Spirit Beasts.',
  source,
});

export const succession385TemporalAnomalyResearch = freeze({
  subject: 'Tserriednich Hui Guo Rou',
  context: 'Theta’s assassination attempt during sustained Zetsu on the night of the Sunday banquet.',
  observedSequence: freeze([
    'Theta shoots Tserriednich through the head and perceives him as dead.',
    'Melody’s flute performance reaches the room at approximately the same narrative moment.',
    'The apparent corpse is no longer present when Theta looks again.',
    'Tserriednich is alive and appears behind Theta.',
    'Tserriednich says he did not flinch from the gunshot.',
    'A bodyguard describes the interval during Melody’s performance as “time skipped.”',
  ]),
  confirmedAtBoundary: 'A Nen-linked anomaly associated with Tserriednich’s Zetsu training prevents Theta’s perceived lethal outcome from becoming his actual death.',
  unresolvedAtBoundary: freeze([
    'Exact activation trigger beyond the observed Zetsu context',
    'Whether Theta witnessed a prediction, alternate sequence, altered perception, or another mechanism',
    'Exact duration',
    'What Tserriednich consciously perceived during the interval',
    'How other observers experience the altered interval',
    'How Melody’s simultaneous entrancement interacts with the anomaly, if at all',
  ]),
  laterMechanicsExcluded: true,
  source,
});

export const succession385GuardianBeastWarningResearch = freeze({
  beast: 'Tserriednich Guardian Spirit Beast',
  observedDuringZetsu: 'The beast gradually disappears while Tserriednich sustains Zetsu.',
  observedAfterZetsu: 'The beast returns once Zetsu is undone.',
  directWarning: 'The beast tells Theta that if she deceives Tserriednich once more she will cease to be human.',
  salkovInterpretation: freeze([
    'The first nick on Theta’s cheek was a warning for a prior lie.',
    'The second lie results in a more severe brand on her face.',
    'Salkov fears a further punishment could be worse than death.',
    'Salkov worries the beast may intend to turn Theta into Tserriednich’s pawn.',
  ]),
  boundary: 'The direct warning and observed marks are recorded as chapter evidence. The precise terminal punishment and pawn-conversion theory remain unresolved.',
  source,
});

export const succession385MelodyInvitationResearch = freeze({
  initiator: 'Tserriednich Hui Guo Rou',
  target: 'Melody',
  trigger: 'A guard reports the beautiful landscape and skipped interval during Melody’s banquet performance and identifies the performer as a Hunter.',
  order: 'Tserriednich orders a formal invitation to Melody.',
  refusalRule: 'The guard explicitly notes that an invitation, unlike a summons, may be declined.',
  suppliedFollowupWording: 'The supplied synopsis says Tserriednich allows the guards to “deduce Melody” whether she declines or not.',
  wordingBoundary: 'The archive preserves that supplied wording without replacing it with an unsupplied verb or assigning a more specific motive.',
  source,
});

export const succession385ThetaSalkovResearch = freeze({
  thetaState: 'Theta collapses after the Guardian Spirit Beast warning and wakes fifteen minutes later from a nightmare.',
  salkovRole: 'Salkov watches over Theta, shows her the facial damage with a mirror, interprets the escalation of the Guardian Spirit Beast’s marks, and urges her to rest and rethink the operation.',
  thetaPosition: 'Theta rejects simply abandoning the situation and remains committed to stopping Tserriednich.',
  salkovConcern: 'Salkov fears the Guardian Spirit Beast may be trying to turn Theta into Tserriednich’s pawn.',
  boundary: 'Salkov’s concern is stored as his strategic hypothesis, not as a confirmed ability mechanic.',
  source,
});

export const succession385RelationshipRecords = freeze([
  freeze({
    from: 'Theta',
    to: 'Tserriednich Hui Guo Rou',
    type: 'conflicted-instructor / active assassination hostility',
    status: 'Theta continues genuine Nen instruction while carrying out a direct assassination attempt during Tserriednich’s Zetsu practice.',
    evidence: 'Theta trains Tserriednich, deliberately creates a Zetsu window, and shoots him through the head believing the attack lethal.',
    source,
  }),
  freeze({
    from: 'Salkov',
    to: 'Theta',
    type: 'covert ally / protective collaborator',
    status: 'Salkov monitors Theta after her collapse, interprets the beast’s marks, urges caution, and remains involved in planning how to handle Tserriednich.',
    evidence: 'Salkov watches over Theta for the fifteen minutes she is unconscious and discusses the next plan with her after she wakes.',
    source,
  }),
  freeze({
    from: 'Tserriednich Hui Guo Rou',
    to: 'Melody',
    type: 'formal-contact interest',
    status: 'Tserriednich orders a formal invitation after hearing about the Hunter whose banquet performance accompanied the perceived time skip.',
    evidence: 'A guard identifies Melody’s performance and Tserriednich orders her invited while acknowledging that a formal invitation can be refused.',
    source,
  }),
]);

export const succession385ResolvedQuestions = freeze([
  freeze({
    question: 'What did Theta mean in Chapter 384 when she thought she could do “it” tomorrow?',
    resolution: 'Chapter 385 shows Theta deliberately using Tserriednich’s sustained Zetsu as an opportunity to shoot him through the head. The Chapter 384 unspecified intention is therefore resolved in Chapter 385 as an assassination attempt.',
    boundary: 'This resolution belongs to Chapter 385 and is not backdated into Chapter 384 as explicit knowledge.',
    source,
  }),
]);

export const succession385Mysteries = freeze([
  freeze({
    question: 'What exactly happened when Theta saw Tserriednich die and the guards experienced a skipped interval?',
    evidence: 'Theta perceives a lethal headshot and corpse, the corpse disappears, Tserriednich is alive, and a guard says time skipped during Melody’s performance.',
    status: 'temporal / causal anomaly demonstrated; complete mechanics unresolved',
    lastChapter: '385',
    source,
  }),
  freeze({
    question: 'What is the final punishment for further deception of Tserriednich’s Guardian Spirit Beast?',
    evidence: 'The beast warns Theta that another deception will make her cease to be human. Salkov interprets the facial marks as escalating warnings and fears something worse than death.',
    status: 'escalation and direct warning confirmed / terminal mechanism unresolved',
    lastChapter: '385',
    source,
  }),
  freeze({
    question: 'Is Salkov correct that the Guardian Spirit Beast may turn Theta into Tserriednich’s pawn?',
    evidence: 'Salkov raises pawn conversion as a concern while assessing the escalating marks.',
    status: 'Salkov hypothesis / not confirmed',
    lastChapter: '385',
    source,
  }),
  freeze({
    question: 'Why does Tserriednich want contact with Melody and what will follow if she accepts or refuses?',
    evidence: 'After learning a Hunter’s performance accompanied the time-skip experience, Tserriednich orders a formal invitation to Melody. The invitation may be declined.',
    status: 'contact order active / precise objective and outcome unresolved',
    lastChapter: '385',
    source,
  }),
]);

const focus = 'Chapter 385 returns to the Sunday banquet night and pushes Tserriednich’s Zetsu training into a direct assassination crisis. Theta successfully creates what she believes is a defenseless Zetsu window and shoots Tserriednich through the head, but the lethal scene collapses into an unresolved temporal anomaly: the corpse disappears, Tserriednich is alive, and a guard describes the interval during Melody’s performance as time having skipped. Tserriednich’s Guardian Spirit Beast then escalates its threat against Theta, while Salkov treats the facial marks as a worsening coercive danger. The chapter also opens a new Tserriednich–Melody contact thread through a formal invitation.';

export const succession385ChapterResearch = freeze([
  freeze({
    number: 385,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage · Sunday banquet night',
    voyageDay: 'Voyage Day 8',
    voyageDayConfidence: 'The supplied synopsis places the chapter on the night of the banquet and synchronizes the assassination scene with Melody’s flute performance established in Chapter 383. The archive therefore places the events on Voyage Day 8 after the 8:00 p.m. banquet opening without inventing a more precise clock time.',
    lanes: freeze([
      'Tserriednich Nen training',
      'Theta assassination attempt',
      'Zetsu-linked temporal anomaly',
      'Tserriednich Guardian Spirit Beast coercion',
      'Melody banquet-performance overlap',
      'Tserriednich–Melody formal contact',
      'Theta and Salkov counterplanning',
    ]),
    focus,
    events: succession385TimelineEvents,
    prelude: freeze([
      'Chapter 384 left Tserriednich beginning sustained Zetsu training while Theta considered an unspecified action for the following day.',
      'Chapter 383 established Melody’s three-minute banquet performance on Voyage Day 8; Chapter 385 overlaps that same performance from inside Tserriednich’s quarters.',
    ]),
    characters: freeze([
      'Tserriednich Hui Guo Rou',
      'Theta',
      'Salkov',
      'Melody',
      'Kacho Hui Guo Rou',
      'Fugetsu Hui Guo Rou',
      'Tserriednich bodyguards',
    ]),
    appearances: freeze([
      'Tserriednich Hui Guo Rou',
      'Theta',
      'Salkov',
      'Tserriednich bodyguards',
    ]),
    relationships: succession385RelationshipRecords,
    bodyStates: freeze([
      freeze({
        subject: 'Tserriednich Hui Guo Rou',
        state: 'alive',
        detail: 'Theta perceives an apparent lethal headshot and corpse, but Tserriednich is alive afterward. The apparent death is not stored as an actual death state.',
        source,
      }),
      freeze({
        subject: 'Theta',
        state: 'alive / marked / briefly unconscious',
        detail: 'Theta collapses after the Guardian Spirit Beast warning and wakes fifteen minutes later with visible facial damage.',
        source,
      }),
    ]),
    mysteries: succession385Mysteries,
    resolvedQuestions: succession385ResolvedQuestions,
    abilities: freeze([succession385TemporalAnomalyResearch, succession385GuardianBeastWarningResearch]),
    locations: freeze(['Black Whale · Tier 1 · Tserriednich quarters']),
    objects: freeze(['coffee mug', 'Theta’s handgun', 'mirror used by Salkov']),
    organizations: freeze(['Kakin royal family', 'Hunter Association']),
    coverage: freeze({
      chronology: true,
      appearances: true,
      relationships: true,
      abilities: true,
      mysteries: true,
      resolvedQuestions: true,
      locations: true,
      organizations: true,
      bodyStates: true,
      nenTraining: true,
      guardianBeastState: true,
      banquetOverlap: true,
    }),
    confidence: freeze([
      'The chapter occurs on the Sunday banquet night and overlaps Melody’s flute performance, but no more precise clock time is supplied.',
      'Theta’s apparent successful headshot is not an actual Tserriednich death in the maintained body-state ledger.',
      'The observed time-skip / disappearance sequence is recorded without importing later full mechanics or a ten-second rule.',
      'The Guardian Spirit Beast disappears during Tserriednich’s sustained Zetsu and returns afterward in the supplied scene.',
      'The beast’s direct “cease to be human” warning is distinguished from Salkov’s hypothesis about pawn conversion.',
      'Theta’s unspecified Chapter 384 next-day intent is resolved only at the Chapter 385 boundary as an assassination attempt.',
      'The supplied “deduce Melody” wording is preserved without silent correction or reinterpretation.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession385SourcePolicy,
  }),
]);

export const succession385ChapterFocus = freeze({ 385: focus });
