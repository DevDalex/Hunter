import * as base from './successionArchiveThrough410.js';

export * from './successionArchiveThrough410.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary411 = freeze({
  chapter: 411,
  day: 'Voyage Day 12 · opens at 8:00 a.m.',
  time: '8:00 a.m. opening; chapter presentation is non-linear relative to later Special Martial Law material already shown in Chapter 410',
  nonLinear: true,
  summary: 'Halkenburg acts through Balsamilco’s body and impersonates him during an 8:00 a.m. call to Benjamin; Kaiser, Melody and Kacho’s post-death construct monitor sleeping Fugetsu; Sarahell disguises herself and infiltrates the expanded Room 1014 Nen lesson while preserving a conditional curse plan against Woble; Kurapika divides eighteen participants into introductory and beginner tracks, then presents a vows-and-limitations theory of Kakin’s succession ritual and ends by declaring Woble ineligible to participate.',
  quarantined: freeze([
    'Any Chapter 412+ explanation, confirmation, reversal, or consequence of Kurapika declaring Woble ineligible.',
    'Kurapika’s four-stage ritual model, voyage-deadline claim, dynastic-fall prediction, or multiple-survivor limitation argument as narrator-certified fact.',
    'Kurapika’s Halkenburg-assassination suspicion as proven attribution; he explicitly lacks proof.',
    'Human Kacho as revived; the active Kacho-form is the post-death Nen construct.',
    'Halkenburg as restored to his original body; Chapter 411 shows him active through Balsamilco’s body.',
    'Sarahell as having already cursed or killed Woble.',
    'An exorcist as confirmed present or absent.',
    'Any later result of Slakka’s information pressure, Gadeau’s private intent, Silent Majority risk, or the second Nen lesson.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character: 'Halkenburg Hui Guo Rou', chapter: 411, from: 'Original body dead with consciousness continuing through Balsamilco’s body.', to: 'At 8:00 a.m. actively impersonates Balsamilco during a call with Benjamin and advances the funeral/guard-reassignment operation.', status: 'original body deceased / transferred consciousness active in Balsamilco body / impersonation ongoing' }),
  freeze({ character: 'Fugetsu Hui Guo Rou', chapter: 411, from: 'Alive but weak under Justice-side protection.', to: 'Sleeping soundly while Melody and Kacho’s post-death construct monitor her recovery.', status: 'alive / recovering / dependent on allied protection' }),
  freeze({ character: 'Sarahell', chapter: 411, from: 'Camilla-aligned curse operative expected around Room 1014.', to: 'Disguised as a maid, actively infiltrating the second Nen lesson and evaluating exorcist/access-dependent curse routes against Woble.', status: 'active covert infiltrator / curse not completed' }),
  freeze({ character: 'Kurapika', chapter: 411, from: 'Room 1014 protector preparing the second Nen class.', to: 'Runs the expanded eighteen-person lesson, monitors faction and Silent Majority risks, presents an explicitly analytical succession-ritual model, and declares Woble ineligible at the stopping point.', status: 'active instructor and Woble strategist / theory and endpoint declaration preserved without Chapter 412+ explanation' }),
  freeze({ character: 'Oito Hui Guo Rou', chapter: 411, from: 'Protected with Woble inside Room 1014.', to: 'Revealed awake and shaken when Kurapika declares Woble ineligible.', status: 'alive / Room 1014 / response beyond chapter endpoint unresolved' }),
]);

export const wobleCoreTimeline = base.wobleCoreTimeline;
