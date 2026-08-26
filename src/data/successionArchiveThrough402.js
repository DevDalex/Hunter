import * as base from './successionArchiveThrough401.js';

export * from './successionArchiveThrough401.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary402 = Object.freeze({
  chapter: 402,
  day: 'Voyage Days 10–11',
  presentDay: true,
  exactTimes: Object.freeze(['Day 10 · 1:30 p.m.', 'Day 11 · 6:00 a.m.', 'Day 11 · 8:00 a.m.', 'Day 11 · 8:50 a.m.']),
  presentationOrderNonLinear: true,
  boundary: 'Chapter 402 expands lower-prince diplomacy, reveals Balsamilco’s prepared pathological-weapon plan, sets Tserriednich’s 9.67-second Zetsu checkpoint, and turns Fugetsu’s affliction into a Justice-led counter-operation while preserving Luzurus culpability, the hostile ability user, Halkenburg illness causation, Kaiser’s hidden status, Tubeppa’s beast trigger, and Special Martial Law as unresolved or inactive.',
  quarantined: Object.freeze([
    'Chapter 403+ outcome of Balsamilco’s Halkenburg operation',
    'Chapter 403+ confirmation or rejection of Luzurus as Fugetsu’s attacker',
    'Chapter 403+ resolution of Fugetsu’s mark, hostile spirits, or Magical Worm anomaly',
    'Chapter 403+ result of the Luzurus removal operation',
    'Chapter 403+ martial-law declaration, crisis escalation, or Benjamin action',
    'Chapter 403+ response to the Halkenburg or Kurapika letters',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10 · 1:30 p.m.', chapters: '402', subject: 'Zhang Lei / Tubeppa / Woble / Tenftory',
    route: 'Room 1003 conditional endgame compact → Room 1005 alliance report → second Tenftory coin → Tubeppa Guardian Spirit Beast appearance',
    change: 'The lower-prince network expands: Tenftory reports a conditional written commitment that Tubeppa and Woble would renounce in Zhang Lei’s favor if those three remain, while Tubeppa welcomes Kurapika/Woble/Oito coordination and Zhang Lei information sharing. Zhang Lei gives Tenftory a second coin. Rihan sees Tubeppa’s beast appear but cannot prove the alliance triggered it.',
    state: 'lower-prince coordination expanded / surrender legality unresolved / second Tenftory coin confirmed / Tubeppa GSB trigger unresolved', source: wiki('Chapter_402'),
  },
  {
    day: 'Voyage Day 10 · exact time unsupplied', chapters: '402', subject: 'Balsamilco / Halkenburg',
    route: 'shoe delivery test → pathological-weapon box → one vial loaded → anti-Halkenburg intent',
    change: 'Balsamilco prepares a covert Kakin-developed pathological weapon and explicitly targets Halkenburg. The chapter establishes preparation, not exposure; Halkenburg’s later illness is not assigned to the weapon at this boundary.',
    state: 'attack prepared / Halkenburg exposure, infection, and outcome unresolved', source: wiki('Chapter_402'),
  },
  {
    day: 'Voyage Day 11 · 8:00 a.m.', chapters: '402', subject: 'Tserriednich / Salkov / Vantine / Melody',
    route: 'Room 1004 → 9.67-second Zetsu → Salkov competing theories → Vantine Melody update → Tserriednich recruitment order',
    change: 'Tserriednich breaks the ten-second Zetsu threshold and maintains Zetsu while multitasking. Salkov cannot resolve whether the anomaly involves a Zetsu-linked ability, the jester-like beast, aura storage, or Theta manipulation. Tserriednich keeps Melody as a recruitment target.',
    state: '9.67-second Zetsu confirmed / mechanism unresolved / Melody recruitment effort active', source: wiki('Chapter_402'),
  },
  {
    day: 'Voyage Day 11 · 6:00 a.m. onward', chapters: '402', subject: 'Fugetsu / Kacho-form / Melody / Kaiser / Luzurus',
    route: 'new shoulder mark → marked-trap/addiction theory → Luzurus suspect theory → lifeboat Magical Worm tests → proposed removal operation → prince-letter access plan',
    change: 'Fugetsu’s protection team identifies a new physical mark and develops multiple enemy-ability hypotheses. Kacho-form targets Luzurus as a suspect, but the team later explicitly acknowledges he may be innocent. Magical Worm is reported able to reach the lifeboat area/first lifeboat but not the attempted outside-ship destination, and prior destination visitation becomes the key operational constraint.',
    state: 'Fugetsu alive but critically weakened / hostile user unknown / Luzurus unconfirmed suspect / route knowledge expanded / operation still planned', source: wiki('Chapter_402'),
  },
  {
    day: 'Voyage Day 11 · morning to 8:50 a.m.', chapters: '402', subject: 'Fugetsu / Benjamin / Basho / Kaiser / prince-letter operation',
    route: 'personal Benjamin delivery → Benjamin GSB disperses spirits → martial-law threshold statement → Tubeppa/Tyson/Luzurus visits → Basho haiku charm → 8:50 Justice debrief',
    change: 'Benjamin directly states the current crisis does not meet the martial-law threshold while his Guardian Spirit Beast visibly disperses Fugetsu’s surrounding spirits. Kaiser interprets Benjamin’s broader intent but that remains inference. Basho later gives Fugetsu a haiku charm that he expects to keep low-level spirits away temporarily. The letter operation reaches multiple princes and ends with the Luzurus plan still contingent on an unproven culprit theory.',
    state: 'martial law inactive / temporary spirit suppression observed / letter operation active / Fugetsu culprit and cure unresolved', source: wiki('Chapter_402'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
