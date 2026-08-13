import * as base from './successionArchiveThrough411.js';

export * from './successionArchiveThrough411.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary412 = freeze({
  chapter: 412,
  day: 'Voyage Day 12 · present-day scenes five hours before Special Martial Law, with a forty-eight-hour flashback',
  time: 'Non-linear: five hours before Special Martial Law → forty-eight hours before Special Martial Law → Voyage Day 12 10:00 a.m. → Beyond detention coda',
  nonLinear: true,
  summary: 'Slakka challenges Kurapika’s Woble-ineligibility claim, prompting Kurapika to separate verified facts from deductions and delay class to 10:00 a.m. A forty-eight-hour flashback reveals Bill’s pronunciation clue and Kurapika’s calibrated chain test of Oito: Oito says the infant aboard is her younger sister’s son, while her daughter Woble is with that younger sister somewhere unknown to Oito; Oito says the two children split the Seed Urn and departure ceremonies and therefore neither is eligible. Back on Day 12 Slakka alone does not return, Kurapika recommits to Nen development and considers Beyond as a curse-information route, while Cleapatro visits Beyond with records from 1,047 dismissed lawsuits.',
  quarantined: freeze([
    'Any Chapter 413+ explanation, consequence, confirmation, reversal, or new location concerning Oito’s daughter Woble or the unnamed nephew.',
    'A proper name or canonical character identity invented for Oito’s younger sister’s son.',
    'Kurapika meeting Beyond in Chapter 412; he only considers the possibility.',
    'Dowsing Chain promoted to omniscience or a universal linguistic lie detector.',
    'Oito knowing where her younger sister and daughter are; she explicitly says she does not know.',
    'Slakka’s non-return promoted into hostility or a later fate.',
    'Beyond’s 1,047 lawsuits treated as successful; Cleapatro says all were thrown out.',
    'Any later result of the document screening in Beyond’s cell.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character: 'Kurapika', chapter: 412, from: 'Publicly declares Woble ineligible at the Chapter 411 stopping point.', to: 'Explains fact-vs-deduction boundaries, reveals the chain-verified identity basis in flashback, resumes the 10:00 a.m. class without Slakka, recommits to Nen development, and considers Beyond as a curse-information route.', status: 'active Room 1014 strategist / Woble identity basis known / no Beyond meeting yet' }),
  freeze({ character: 'Oito Hui Guo Rou', chapter: 412, from: 'Apparent mother of the infant aboard identified publicly as Woble.', to: 'Reveals under calibrated chain testing that the infant aboard is her younger sister’s son and that her daughter Woble is elsewhere with that sister; says she does not know their location.', status: 'alive / Room 1014 / child-swap secret disclosed and verified' }),
  freeze({ character: 'Woble Hui Guo Rou', chapter: 412, from: 'Archive and onboard factions had treated the infant in Room 1014 as Woble.', to: 'Oito identifies her daughter Woble as a different child currently with Oito’s younger sister at an unknown location; higher princes are still said to believe the real Woble could be aboard.', status: 'alive per Oito testimony / current location unknown / not the cradle infant aboard' }),
  freeze({ character: 'Slakka', chapter: 412, from: 'Attends the second Nen lesson and pressures Kurapika’s information position.', to: 'Challenges Kurapika’s truthfulness and becomes the only participant who does not return for the 10:00 a.m. class.', status: 'alive / non-return confirmed / motive and later activity unresolved' }),
  freeze({ character: 'Beyond Netero', chapter: 412, from: 'Detained on Tier 1 under Zodiac guard.', to: 'Receives Cleapatro and Justice Bureau records concerning 1,047 lawsuits, all reported dismissed, while Kanzai and Saiyu screen the material.', status: 'detained / legal-document exchange active / later outcome unresolved' }),
]);

export const wobleCoreTimeline = freeze([
  ...(base.wobleCoreTimeline || []),
  freeze({ chapter: 412, phase: 'identity correction and eligibility basis', event: 'Oito reveals under Kurapika’s calibrated chain test that the infant aboard is her younger sister’s son, while her daughter Woble is with that sister at an unknown location. Oito says Woble attended the Seed Urn ceremony and the nephew appeared at departure, so neither child qualifies under the participation combination she describes.', status: 'Oito testimony verified by Kurapika’s chain / later ritual and legal consequences quarantined' }),
]);
