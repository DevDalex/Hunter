import * as base from './successionArchiveThrough413.js';

export * from './successionArchiveThrough413.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary414 = freeze({
  chapter: 414,
  day: 'Voyage Day 12 · pre-declaration Special Martial Law operation',
  time: 'No new exact clock minute supplied in Chapter 414.',
  nonLinear: false,
  summary: 'Chapter 414 follows Benjamin’s pre-declaration operation through Room 1007 and Room 1009 while Room 1014 preserves the daughter-Woble versus aboard-nephew identity split, maps unresolved Beyond-curse activation routes, and ends with Oito revealing an off-record Yamato coded-letter relay.',
  room1007: freeze({
    kanjidol: 'Kanjidol attacks two sleeping Luzurus bodyguards; the lower-bunk guard later raises an arm, leaving condition and consequence unresolved.',
    luzurus: 'Luzurus anticipates Special Martial Law and orders nonresistance, weapon consolidation, Kanjidol delay, and destruction of drugs/plants. His terrorism/radio/shoot-first reasoning remains speaker-bound.',
    ridge: 'Ridge confronts Kanjidol, both use aura, and they leap toward one another. The result is outside Chapter 414.',
  }),
  room1009: freeze({
    yushohi: 'Yushohi reassesses En/Gyo risk and Stand By Me viability, detects one person inside Room 1009, and remains poised for a later move.',
    chiyamasi: 'Chiyamasi activates Muteking on Yushohi and begins accumulating invincibility time before the planned operation.',
    unresolved: 'No breach, occupant-resolution result, protection expiry, injury, death, or detention is shown.',
  }),
  room1014: freeze({
    identity: 'Oito’s daughter Woble remains at an unknown location; the infant aboard is Oito’s unnamed nephew, a boy.',
    curse: 'Beyond-curse activation remains unresolved; Kurapika’s split-second Nen surge near the aboard infant remains unidentified.',
    search: 'Pyon has found no official match for daughter Woble.',
    planning: 'Moonlight Act is proposed as a possible Beyond counter-trap; Stealth Dolphin curse verification is rejected as too dangerous.',
    endpoint: 'Kurapika invokes trusted friends and Oito reveals the maternal-side Yamato postal relay. No outside contact is completed.',
  }),
  quarantined: freeze([
    'Any formal Special Martial Law declaration or enforcement consequence after Chapter 414.',
    'Any result of the Ridge–Kanjidol confrontation or the lower-bunk guard cliff edge.',
    'Any Room 1009 breach or Muteking-expiry consequence.',
    'Any confirmation of daughter Woble’s location or Beyond-curse target status.',
    'Any Gon/Killua contact, mission acceptance, or arrival.',
    'Any later postcard dispatch, returned address, royal relocation, confinement, disappearance, or other Chapter 415+ consequence.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character: 'Kanjidol', chapter: 414, from: 'Benjamin soldier entering the pre-declaration operation.', to: 'Active inside Room 1007 and locked in an unresolved confrontation with Ridge.', status: 'active / confrontation unresolved' }),
  freeze({ character: 'Yushohi', chapter: 414, from: 'Benjamin-aligned Nen operative with Stand By Me.', to: 'Reassesses En/Gyo and Stand By Me risk, detects one person inside Room 1009, and receives Muteking before the planned movement.', status: 'active / Muteking protection accumulating / Room 1009 result unresolved' }),
  freeze({ character: 'Chiyamasi', chapter: 414, from: 'Named Benjamin-side operative newly maintained in the canonical graph.', to: 'Paired with Yushohi outside Room 1009 and confirmed as Muteking’s user.', status: 'active / planned Room 1009 operation unresolved' }),
  freeze({ character: 'Bill', chapter: 414, from: 'Room 1014 Hunter and former Beyond-aligned expedition participant.', to: 'States his priority has shifted to protecting Oito and the prince and proposes using Moonlight Act in a possible Beyond counter-trap.', status: 'active / protective loyalty stated / political proposals unexecuted' }),
]);
