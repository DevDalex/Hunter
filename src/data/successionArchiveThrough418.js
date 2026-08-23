import * as base from './successionArchiveThrough417.js';

export * from './successionArchiveThrough417.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary418 = freeze({
  chapter:418,
  day:'Voyage Day 12 · non-linear Room 1004 reveal and escape setup',
  time:'Begins shortly before Benjamin’s Room 1004 assault, overlaps the Chapter 417 apparent execution, and continues through the post-inspection escape setup. The only explicit future schedule is the coffin remaining until 6 a.m. on Voyage Day 13.',
  nonLinear:true,
  boundaryStatus:'current publication ceiling',
  summary:'Tserriednich experimentally extends Parallel Future beyond its original ten-second playback by remaining in Zetsu, maps person/object perception limits, theorizes a spherical range and finite aura battery, survives Benjamin’s apparent execution while affected observers perceive the staged future, builds a no-viewing gun-filled coffin deception, waits through Room 1004 military inspection, chooses the royalty-reserved Route A as his preferred escape path, briefly questions whether Theta can see him, and leaves the room under the still-active concealment effect.',
  ability:freeze({
    confirmed:'Activation requires Zetsu with closed eyes; the ten-second future is experienced extratemporally; Tserriednich can change himself and objects but not directly rewrite another person’s physical state; remaining in Zetsu keeps affected observers following the predicted state after the original playback; the Special Martial Law alarm does not break his Zetsu.',
    hypotheses:'The activation-point antenna, spherical radius, static-as-range signal, boundary collapse, unaffected outside observers, result-only vision rule, and one-eleventh stored-aura duration model remain Tserriednich’s own working theories or estimates.',
    experiment:'The water-bottle experiment and later three shots at Vantine show affected observers continuing predicted interactions despite Tserriednich altering the real object/action sequence.',
  }),
  room1004:freeze({
    deathResolution:'Tserriednich is alive and physically elsewhere while Benjamin attacks the Tserriednich that affected observers perceive. The Chapter 417 apparent-fatal-trauma uncertainty is resolved at the reader level.',
    salkov:'Salkov’s doubts about weight, smell, blood, and the reality of the corpse are preserved as his limited perspective; Chapter 418 does not imply that he fully understands Parallel Future.',
    surrender:'Tserriednich orders nonresistance, weapon surrender, and exact witness reporting before Benjamin enters.',
    coffin:'Tserriednich writes a no-viewing last will, changes clothes, and fills the coffin with surrendered guns to maintain plausible weight.',
    inspection:'Military personnel finish the room inspection, return Theta and another guard, verify the roster, and allow movement inside Room 1004 subject to announced-exit restrictions.',
  }),
  funeral:freeze({
    schedule:'The remains are to stay in Room 1004 until 6 a.m. on Voyage Day 13; the wake doubles as the funeral and Salkov alone is scheduled to transport the coffin afterward.',
    boundary:'The transport has not yet occurred by the Chapter 418 endpoint.',
  }),
  escape:freeze({
    identityRisk:'Tserriednich intends to hide his face and avoid people who know he should be dead and can identify him.',
    routes:'Route A is the royalty-reserved starboard route, Route B is associated with Mafia/soldier activity at the stern, and Route C is the general-use portside route.',
    plan:'Expecting Benjamin to use Route C toward Justice and Route B to remain active, Tserriednich selects Route A.',
    theta:'Theta’s gaze briefly alarms Tserriednich, but she passes him without confirmed recognition.',
    stoppingPoint:'Tserriednich leaves Room 1004 to begin his escape. No successful Route A traversal is shown.',
  }),
  publicationCeiling:freeze([
    'Chapter 418 is the latest published chapter in the maintained set.',
    'Do not invent Chapter 419+ events.',
    'Do not invent the exact Parallel Future radius, outside-observer behavior, or final aura duration.',
    'Do not claim Theta definitely saw Tserriednich.',
    'Do not claim Tserriednich successfully reached Route A or left Tier 1.',
    'Do not invent the 6 a.m. coffin transport outcome.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character:'Tserriednich',chapter:418,from:'Chapter 417 apparent fatal trauma / true condition unresolved because Salkov could not determine whether the Room 1004 scene was real.',to:'Confirmed alive and mobile outside the future-state perceived by affected observers; sustains Zetsu, engineers a staged-death coffin, arms and changes clothes, selects Route A, and leaves Room 1004.',status:'alive / concealed by sustained Parallel Future perception / armed / escaping' }),
  freeze({ character:'Salkov',chapter:418,from:'Reality test incomplete and ordered toward Justice detention at the Chapter 417 boundary.',to:'Revealed as an unwitting subject of Tserriednich’s perception experiment and staged-death witness; questions the sensory realism of the corpse, reads the last will, and is scheduled as sole coffin transporter at 6 a.m. Voyage Day 13.',status:'alive / asymmetric knowledge / staged-death witness / future coffin duty' }),
  freeze({ character:'Theta',chapter:418,from:'Potential reality-check subject in Salkov’s Chapter 417 reasoning.',to:'Returned to Room 1004 after military inspection; briefly appears to look toward concealed Tserriednich but walks past without confirmed recognition.',status:'alive / perception of Tserriednich ambiguous / no confirmed detection' }),
  freeze({ character:'Vantine',chapter:418,from:'Tserriednich household guard under Special Martial Law pressure.',to:'Reports Benjamin-side forced-entry threat, later argues with Salkov and continues reacting to the predicted future while three real bullets from concealed Tserriednich crumple at his forehead.',status:'alive / affected observer inside sustained perception effect' }),
  freeze({ character:'Benjamin',chapter:418,from:'Chapter 417 believes he has killed Tserriednich and continues Special Martial Law operations.',to:'Chapter 418 reveals his Room 1004 execution was performed against the Tserriednich he perceived while the real prince remained alive nearby; Benjamin is not shown learning of the deception.',status:'alive / operational / misinformed that Tserriednich is dead' }),
]);
