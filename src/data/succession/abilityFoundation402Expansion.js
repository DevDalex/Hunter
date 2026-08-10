import { abilityFoundation400Expansion } from './abilityFoundation400Expansion.js';

const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;
const priorMelody = abilityFoundation400Expansion.find((ability) => ability.id === 'ability:melody-aura-performance');
const priorMagicalWorm = abilityFoundation400Expansion.find((ability) => ability.id === 'ability:magical-worm');
const priorAffliction = abilityFoundation400Expansion.find((ability) => ability.id === 'ability:fugetsu-unidentified-hostile-spirit-affliction');

export const abilityFoundation402Expansion = freeze([
  freeze({
    ...priorMelody,
    summary: 'Melody’s sincere musical performance can entrance listeners who hear it. Chapter 383 demonstrates the three-minute mass entrancement used during the twin escape attempt, Chapter 400 clarifies hearing as a demonstrated condition and unconsciousness as a side effect of music intended to heal, and Chapter 402 adds Melody’s operational statement that while she is using the performance ability she cannot simultaneously perform the physical tasks required by the Luzurus-removal plan.',
    sourceIds: freeze([chapterSourceId(383), chapterSourceId(400), chapterSourceId(402)]),
    updatedAt: '2026-08-10',
    limitations: freeze([
      ...(priorMelody?.limitations || []),
      'Chapter 402: Melody states that while using the planned ocarina performance she cannot perform the other physical tasks needed by the operation; this is preserved as an operational concurrency limit rather than a claim that she is literally motionless under every possible musical use.',
    ]),
    knownUses: freeze([
      ...(priorMelody?.knownUses || []),
      'Chapter 402: Melody plans to use the ocarina to incapacitate Luzurus while another participant handles the physical transport step.',
    ]),
    latestChapter: 402,
    sourceChapterNumbers: freeze([383, 400, 402]),
    researchStatus: 'Chapter 383 mass-auditory demonstration, Chapter 400 hearing/side-effect explanation, and Chapter 402 operational concurrency limit documented / Nen type and broader musical-effect limits unresolved',
  }),
  freeze({
    ...priorMagicalWorm,
    summary: 'Fugetsu’s Guardian Spirit Beast translocation tunnel/door system. Chapter 383 establishes the cooperative twin-route structure; Chapter 400 shows repeated daily use and a solo return door; Chapter 402 adds destination testing in which a desired location outside the Black Whale cannot be reached while the emergency lifeboat area and first lifeboat can be reached, and the Justice plan treats prior physical visitation of a destination such as Luzurus’s master bedroom as necessary before Fugetsu can route there.',
    sourceIds: freeze([chapterSourceId(383), chapterSourceId(400), chapterSourceId(402)]),
    updatedAt: '2026-08-10',
    conditions: freeze([
      ...(priorMagicalWorm?.conditions || []),
      'Chapter 402: Kacho-form reports that a desired destination outside the ship does not produce a door, while the emergency lifeboat area and the inside of the first lifeboat are reachable.',
      'Chapter 402: the Luzurus operation is blocked until Fugetsu can personally visit the intended destination, establishing prior visitation as an operationally required destination condition in the group’s current understanding.',
      'Chapter 402: Kacho-form reports that the Outgoing Door closes when Fugetsu enters the tunnel and the Door of Return closes when Kacho-form enters on the return journey.',
    ]),
    limitations: freeze([
      ...(priorMagicalWorm?.limitations || []),
      'Chapter 402 does not establish that the system can reach locations outside the Black Whale; the attempted outside-ship destination fails.',
      'Kacho-form proposes that third parties may be able to pass while Fugetsu and Kacho-form are not already inside, but Chapter 402 does not complete that test and therefore does not confirm general third-party access.',
      'The chapter does not prove that the new shoulder mark, hostile spirits, addiction-like behavior, or Fugetsu’s deteriorating aura are caused by Magical Worm itself or by repeated legitimate uses of Magical Worm.',
    ]),
    knownUses: freeze([
      ...(priorMagicalWorm?.knownUses || []),
      'Chapter 402: destination testing fails for a desired place outside the ship but succeeds for the lifeboat emergency area and the interior of the first lifeboat.',
      'Chapter 402: the protection team plans to use previously visited prince rooms as future route endpoints, with Luzurus’s master bedroom identified as a required pre-visit before the proposed operation.',
    ]),
    latestChapter: 402,
    sourceChapterNumbers: freeze([383, 400, 402]),
    status: 'active with repeated-use, solo-return, ship-bounded destination testing, and prior-visit routing knowledge; cause/cost of the Chapter 400 expansion and third-party access remain unresolved',
    researchStatus: 'official name, twin-route foundation, repeated-use/solo-return behavior, Chapter 402 lifeboat reachability, and prior-visit routing condition documented / outside-ship reach, third-party access, cost, and relation to Fugetsu’s affliction unresolved',
  }),
  freeze({
    ...priorAffliction,
    summary: 'Descriptive archive label for the unresolved hostile Nen/spirit condition affecting Fugetsu. Chapter 402 adds a newly observed mark on her right shoulder blade, Melody’s theory that the condition may be a multistep marked trap with addiction-like behavior, the temporary dispersal of the spirits when Benjamin’s Guardian Spirit Beast screeches, and Basho’s later haiku charm after which he expects low-level spirits to avoid Fugetsu for a while. No responsible user, official ability name, Nen category, activation route, or culprit is confirmed.',
    sourceIds: freeze([chapterSourceId(400), chapterSourceId(402)]),
    updatedAt: '2026-08-10',
    conditions: freeze([
      ...(priorAffliction?.conditions || []),
      'Chapter 402: a mark is directly observed on Fugetsu’s right shoulder blade that Kacho-form says was absent before the escape attempt.',
      'Chapter 402: Benjamin can perceive the spirits and his Guardian Spirit Beast’s screech directly disperses them during Fugetsu’s audience.',
      'Chapter 402: after the Luzurus visit the spirits subside again around the time Basho gives Fugetsu a haiku good-luck charm; Basho internally expects low-level spirits to keep away for a while while she carries it.',
    ]),
    limitations: freeze([
      ...(priorAffliction?.limitations || []),
      'Melody’s multistep marked-trap, fake/additional-door, addiction-like, continued-use weakening, and indiscriminate-attack models remain investigative hypotheses rather than confirmed mechanics.',
      'Kacho-form’s accusation of Luzurus and theory that his Guardian Spirit Beast caused the condition are unconfirmed. The Chapter 402 plan explicitly allows for Luzurus not being the culprit.',
      'Benjamin’s classification of the manifestations as low-level evil spirits attracted to weakened people and his grief-based explanation are his assessment, not a confirmed source attribution.',
      'Basho’s charm is not assigned an invented official ability name, Nen category, exact duration, or universal spirit-repulsion rule from the supplied Chapter 402 synopsis.',
      'Chapter 402 does not establish that Magical Worm itself created the shoulder mark or that legitimate Magical Worm uses are the direct cause of Fugetsu’s deterioration.',
    ]),
    knownUses: freeze([
      ...(priorAffliction?.knownUses || []),
      'Chapter 402: the new shoulder-blade mark is photographed and investigated as a possible Nen marker.',
      'Chapter 402: Benjamin’s Guardian Spirit Beast screeches and the spirits around Fugetsu visibly disappear during the audience.',
      'Chapter 402: the spirits later subside around the time Basho gives Fugetsu a haiku charm, which Basho expects to keep low-level spirits away temporarily.',
    ]),
    latestChapter: 402,
    sourceChapterNumbers: freeze([400, 402]),
    status: 'active unresolved hostile condition in Chapter 402; temporarily suppressible manifestations observed, culprit and core mechanics unknown',
    researchStatus: 'Chapter 400 hostile-spirit manifestation plus Chapter 402 shoulder mark and temporary spirit-dispersal observations documented / user, name, type, trigger, Luzurus culpability, relation to Magical Worm, and removal mechanics unresolved',
  }),
]);
