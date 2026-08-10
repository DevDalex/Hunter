import { abilityFoundation383Expansion } from './abilityFoundation383Expansion.js';

const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;
const priorMelody = abilityFoundation383Expansion.find((ability) => ability.id === 'ability:melody-aura-performance');
const priorMagicalWorm = abilityFoundation383Expansion.find((ability) => ability.id === 'ability:magical-worm');
const priorWithoutYou = abilityFoundation383Expansion.find((ability) => ability.id === 'ability:without-you');

export const abilityFoundation400Expansion = freeze([
  freeze({
    ...priorMelody,
    summary: 'Melody’s sincere musical performance can entrance people who hear it. Chapter 383 demonstrates a three-minute flute performance that suspends ordinary action during the twin escape attempt. Chapter 400 adds Melody’s own explanation that the music is intended to heal, loss of consciousness is a side effect, and covering the ears prevents the demonstrated entrancement.',
    sourceIds: freeze([chapterSourceId(383), chapterSourceId(400)]),
    updatedAt: '2026-08-10',
    conditions: freeze([
      ...(priorMelody?.conditions || []),
      'Chapter 400: Melody states that covering the ears prevents the demonstrated entrancement, reinforcing hearing the performance as a required condition in the demonstrated use.',
      'Chapter 400: Melody describes healing as the intended purpose of her music and loss of consciousness as a side effect.',
    ]),
    limitations: freeze([
      ...(priorMelody?.limitations || []),
      'Chapter 400 does not establish that every piece Melody performs causes unconsciousness or that every musical effect has identical duration.',
      'The chapter does not establish a Nen-type classification, universal immunity rule, or maximum unamplified range.',
    ]),
    knownUses: freeze([
      ...(priorMelody?.knownUses || []),
      'Chapter 400: Melody explains that listeners can avoid the demonstrated entrancement by covering their ears and that unconsciousness is a side effect of music intended to heal.',
    ]),
    latestChapter: 400,
    sourceChapterNumbers: freeze([383, 400]),
    researchStatus: 'Chapter 383 mass-auditory demonstration plus Chapter 400 hearing/side-effect explanation documented / Nen type and broader musical-effect limits unresolved',
  }),
  freeze({
    ...priorMagicalWorm,
    summary: 'Fugetsu’s Guardian Spirit Beast translocation tunnel/door system. Chapter 383 establishes the cooperative twin-route structure used during the failed escape. Chapter 400 shows a major operational change reported and demonstrated by Fugetsu: she can use the route multiple times rather than once per day, and a return door now appears while she is alone, although solo return is limited to the place she departed from.',
    sourceIds: freeze([chapterSourceId(383), chapterSourceId(400)]),
    updatedAt: '2026-08-10',
    conditions: freeze([
      ...(priorMagicalWorm?.conditions || []),
      'Chapter 400: Fugetsu can activate Magical Worm multiple times within the current day rather than being limited to the previously understood once-per-day use.',
      'Chapter 400: while Fugetsu is alone, the return door appears and can return her to the point she left.',
    ]),
    limitations: freeze([
      ...(priorMagicalWorm?.limitations || []),
      'The cause of the Chapter 400 expansion is unknown.',
      'Fugetsu’s solo return is described as returning only to where she was; Chapter 400 does not establish arbitrary destination selection while alone.',
      'Fugetsu is pale, exhausted, and later surrounded by hostile spirits, but Chapter 400 does not prove repeated Magical Worm use causes the deterioration or that the route grows stronger with every use.',
      'The complete post-Kacho cooperative rules, aura cost, range, and reset mechanics remain unresolved.',
    ]),
    knownUses: freeze([
      ...(priorMagicalWorm?.knownUses || []),
      'Chapter 400: Fugetsu repeatedly explores through Magical Worm while alone and returns through a door that appears without the Kacho-form counterpart physically accompanying her.',
    ]),
    latestChapter: 400,
    sourceChapterNumbers: freeze([383, 400]),
    status: 'active with Chapter 400 repeated-use and solo-return behavior; cause and cost of the change unresolved',
    researchStatus: 'official name, twin-route foundation, repeated-use breakthrough, and solo-return behavior documented / cause, cost, complete topology, and relation to Fugetsu deterioration unresolved',
  }),
  freeze({
    ...priorWithoutYou,
    summary: 'Kacho’s death-triggered Guardian Spirit Beast remains beside Fugetsu in Kacho’s form after human Kacho’s death. Chapter 400 shows the Kacho-form actor independently strategizing to protect Fugetsu, moving through solid furniture/walls inside the Justice Bureau, and reasoning about its own post-death state. Its speculation that Fugetsu may be supplying aura to maintain the form is not promoted to confirmed mechanics.',
    sourceIds: freeze([chapterSourceId(383), chapterSourceId(400)]),
    updatedAt: '2026-08-10',
    conditions: freeze([
      ...(priorWithoutYou?.conditions || []),
      'Chapter 400: the Kacho-form Guardian Spirit Beast remains active while human Kacho is dead and continues the twin-protection mission around Fugetsu.',
      'Chapter 400 directly shows the Kacho-form actor moving through a bookcase/solid barrier while Kaiser must use the ordinary doorway.',
    ]),
    limitations: freeze([
      ...(priorWithoutYou?.limitations || []),
      'The Kacho-form actor speculates that Fugetsu seeing it means Kacho is out of the contest and that Fugetsu may be supplying aura to maintain the form. These statements are not independently confirmed mechanics.',
      'Chapter 400 still does not establish that Kacho’s human consciousness literally survives inside Without You.',
      'Whether telling Fugetsu the truth would reduce any aura burden remains a Kacho-form hypothesis.',
    ]),
    knownUses: freeze([
      ...(priorWithoutYou?.knownUses || []),
      'Chapter 400: the Kacho-form actor coordinates with Melody and Kaiser, conceals the truth of Kacho’s death from Fugetsu, and moves through solid furniture/walls in the Justice Bureau.',
    ]),
    latestChapter: 400,
    sourceChapterNumbers: freeze([383, 400]),
    status: 'active in Kacho’s form beside Fugetsu; human Kacho remains dead',
    researchStatus: 'death trigger, Kacho-form protective continuation, and Chapter 400 incorporeal traversal documented / human-consciousness persistence and proposed Fugetsu aura burden unresolved',
  }),
  freeze({
    id: 'ability:fugetsu-unidentified-hostile-spirit-affliction',
    entityType: 'ability',
    slug: 'fugetsu-unidentified-hostile-spirit-affliction',
    name: 'Fugetsu Unidentified Hostile-Spirit Affliction',
    aliases: freeze([]),
    summary: 'A descriptive archive label for the unresolved hostile Nen condition Melody detects around Fugetsu in Chapter 400. Melody senses Fugetsu’s aura weakened to a Zetsu-like level, an unstable heartbeat, and many evil spirits clustered around her. No responsible user, official ability name, Nen category, activation route, or visible ability body is identified.',
    sourceIds: freeze([chapterSourceId(400)]),
    publicationStatus: 'published',
    canonLevel: 'inferred',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    ownerIds: freeze([]),
    classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'unknown' }),
    category: 'unidentified hostile Nen / spirit affliction',
    activation: 'Unknown. Melody detects the condition after Fugetsu’s health and aura deteriorate rapidly.',
    conditions: freeze([
      'Fugetsu is the observed affected person in Chapter 400.',
      'Melody detects numerous hostile/evil spirits around Fugetsu together with Zetsu-like aura weakness and an unstable heartbeat.',
    ]),
    limitations: freeze([
      'The ability user or curse source is unidentified.',
      'Official name, Nen type, activation route, target-selection rule, range, duration, removal condition, and exact effect of each visible spirit are unknown.',
      'Melody notes that she cannot find the obvious trace/body she would expect from such a powerful effect.',
      'Melody considers a hostage-negotiation theory, but that motive/mechanism remains investigative speculation.',
      'The chapter does not establish that Magical Worm use causes or strengthens the affliction.',
    ]),
    costs: freeze([]),
    targets: freeze(['Fugetsu Hui Guo Rou in the demonstrated Chapter 400 condition']),
    range: 'unknown',
    duration: 'ongoing at the Chapter 400 endpoint; total duration unknown',
    status: 'active unresolved hostile condition at Chapter 400 boundary',
    knownUses: freeze(['Chapter 400: Melody observes Fugetsu’s Zetsu-like aura weakness, unstable heartbeat, and many hostile spirits and concludes that an exorcist is urgently needed.']),
    firstChapter: 400,
    latestChapter: 400,
    sourceChapterNumbers: freeze([400]),
    researchStatus: 'hostile-spirit manifestation and Fugetsu condition documented / user, name, type, trigger, motive, body, and removal mechanics unresolved',
  }),
]);
