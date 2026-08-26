import * as base from './successionArchiveThrough404.js';

export * from './successionArchiveThrough404.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary405 = Object.freeze({
  chapter: 405,
  day: 'Voyage Day 12 with retrospective Voyage Day 10 material',
  presentDay: true,
  exactTimes: Object.freeze(['No exact Chapter 405 clock time supplied', 'Halkenburg funeral procession still upcoming before its announced noon movement']),
  presentationOrderNonLinear: true,
  boundary: 'Chapter 405 confirms the real Hisoka in the Tier 1 VIP casino, resolves the earlier apparent-Hisoka encounter as Bonolenov’s decoy operation, expands Metamorphorsen and Body and Soul, confirms Lynch’s death retrospectively, advances the Troupe/established-mafia anti-Heil-Ly operation, and prepares Dogman/Sodom for an unidentified funeral-crowd target without importing the next chapter’s outcome.',
  quarantined: Object.freeze([
    'Any Chapter 406+ identity for Dogman and Sodom’s target or any kidnapping result',
    'Any Chapter 406+ destination or consequence beyond Tajao’s final opened door',
    'Any Chapter 406+ direct Hisoka/Troupe fight or contact',
    'Any Chapter 406+ mafia betrayal, Heil-Ly outcome, funeral-procession result, or martial-law development',
    'Any confirmation that Pakunoda was Spider #9',
    'Any identification or acquisition of the ability Bonolenov says Chrollo is seeking',
    'Any formal Heil-Ly membership or complete double-agent label for Ken’i based only on his Morena/joker thoughts',
    'Any official ability name or Nen category invented for Dogman or Sodom',
    'Any exact Tevelares or Daemon level not supplied by Chapter 405',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 12 · exact time unsupplied', chapters: '405', subject: 'Hisoka / Bonolenov / Chrollo',
    route: 'Tier 1 VIP casino real-Hisoka sighting → Bonolenov abandons false-Hisoka form → Owl transformation → wait-for-Chrollo protocol',
    change: 'The real Hisoka is confirmed on Tier 1. Bonolenov’s mafia-decoy role is revealed and he changes disguises instead of fighting. Chrollo’s predicted prince-sponsored VIP access remains without a named sponsor.',
    state: 'real Hisoka confirmed / false Hisoka resolved as Bonolenov / direct fight not begun', source: wiki('Chapter_405'),
  },
  {
    day: 'Voyage Day 10 retrospective · revealed on Day 12', chapters: '405', subject: 'Bonolenov / Lynch / Zakuro',
    route: 'Body and Soul exposes false Hisoka → Zakuro does not hear inner answer → Zakuro disguise → Lynch confirms impostor → Lynch killed → Lynch disguise misdirects Zakuro',
    change: 'Chapter 405 retrospectively resolves the apparent-Hisoka incident. Lynch’s ability worked against Bonolenov’s disguise and Bonolenov later confirms he killed her. Zakuro survives but was deceived.',
    state: 'Lynch deceased / Zakuro alive / prior apparent-Hisoka identity resolved only at this knowledge boundary', source: wiki('Chapter_405'),
  },
  {
    day: 'Voyage Day 12 · Tier 5', chapters: '405', subject: 'Nobunaga / Phinks / Feitan / Tajao / Ken’i',
    route: 'Cha-R Heil-Ly analysis → total-destruction and vow theories → Tajao declares Cha-R/Xi-Yu support → Troupe enters restricted route',
    change: 'The established mafia opens operational access for the three Troupe members. Speaker theories about Heil-Ly’s total objective and kill-count Nen remain attributed analysis rather than universalized rules.',
    state: 'anti-Heil-Ly cooperation active / final route destination unresolved', source: wiki('Chapter_405'),
  },
  {
    day: 'Voyage Day 12 · after Troupe departure', chapters: '405', subject: 'Ken’i / Morena',
    route: 'Ken’i internally addresses Morena → timetable judged accelerated → possible joker use considered',
    change: 'A concealed operational link and hidden-plan mystery are directly exposed, but Ken’i’s exact role, formal allegiance, communication method, and the joker’s identity remain unresolved.',
    state: 'concealed link confirmed / exact relationship unresolved', source: wiki('Chapter_405'),
  },
  {
    day: 'Voyage Day 12 · before funeral procession', chapters: '405', subject: 'Morena / Dogman / Sodom',
    route: 'Tier 2 hidden base → funeral crowd selected as opportunity → Dogman level-62 scent thresholds → Sodom paired for non-Nen-target kidnapping',
    change: 'Dogman states 5 m Nen-type detection, 2 m learned-Nen detection, and close-head 100% certainty. Sodom states his kidnapping ability requires a target who does not know Nen. Target identity and result remain outside Chapter 405.',
    state: 'search/kidnapping team preparing / target unidentified / funeral still upcoming', source: wiki('Chapter_405'),
  },
  {
    day: 'Voyage Day 12 · Tier 2 hidden base', chapters: '405', subject: 'Tevelares / Daemon / Quorolle',
    route: 'processing area leveling → aura active → mafia-hunt preparation',
    change: 'Quorolle is confirmed at level 51 while Tevelares and Daemon receive no newly supplied exact levels or named abilities.',
    state: 'mafia hunt prepared / new abilities unresolved', source: wiki('Chapter_405'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
