import * as base from './successionArchiveThrough414.js';

export * from './successionArchiveThrough414.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary415 = freeze({
  chapter: 415,
  day: 'Voyage Day 12 · Special Martial Law declaration and immediate enforcement',
  time: '13:50 is explicit for the Room 1014 postcard scene; Room 1013 is explicitly fifteen minutes before the declaration and the final Room 1014 scene is twenty minutes after it. No exact declaration clock minute is derived.',
  nonLinear: true,
  summary: 'Chapter 415 opens two months before departure with Furykov using Combo Master to discover Beyond’s long-prepared curse, then returns to Voyage Day 12 as Oito’s eight coded postcards enter the dealer network, Special Martial Law is formally declared, royal households face relocation and restriction, Luzurus and Rice are found missing, Marayam’s group elects to hold its isolated Nen space, and Oito is confined while Kurapika infers an additional unidentified motive behind the emergency.',
  furykovBeyond: freeze({
    comboMaster: 'Combo Master is demonstrated as a conjured laptop/interface that warns Furykov of an attack, identifies a curse, shows another affected person only as a silhouette, supports investigation, and returns 365-day deciphering plus approximately 700-day antidote-development estimates specific to this curse.',
    curse: 'Beyond says Furykov’s death would trigger Post-Mortem Nen against a prince and that the curse has accumulated Furykov’s aura since shortly after birth. Furykov remains distrustful and intends to verify Beyond’s account.',
    target: 'Furykov narrows the target to the first eight princes and briefly considers Camilla. No target is confirmed.',
  }),
  room1014PreDeclaration: freeze({
    postcards: 'Oito and Kurapika encode the Yamato-script contingency; eight postcards are given to Babimyna and then taken by a dealer deliveryman.',
    distribution: 'Babimyna says military inspection has stopped, while Kurapika notes that the military still controls the distribution network.',
    identity: 'The real Woble remains Oito’s daughter at an unknown location; the aboard stand-in child remains the unnamed nephew. They are not the same person.',
  }),
  martialLaw: freeze({
    declaration: 'Special Martial Law is formally declared shipwide and soldiers begin controlling passenger movement.',
    room1005: 'Rihan orders Tubeppa toward Room 1001, restricts her escort to Royal Army guards, imposes a temporary ceasefire, and presents a national-security rationale that remains his stated assessment.',
    room1007: 'Luzurus and Rice are missing. Ridge reports that Kanjidol killed the break-room guards before the declaration; Kanjidol is shown bound and bruised.',
    room1011: 'Seiko is escorted away while absent-prince rooms are to be sealed; she orders that Fugetsu remain inside the Ministry of Justice.',
    room1013: 'Fifteen minutes before the declaration, Biscuit anticipates martial law and decides Marayam’s group cannot risk leaving the isolated Nen space; reset/dormancy/disappearance consequences remain hypotheses.',
  }),
  room1014AfterDeclaration: freeze({
    standIn: 'Benjamin drops charges against the stand-in child because the child cannot be legally responsible.',
    oito: 'Oito’s indictment is deferred while the real Woble remains missing, but Oito is confined to the master bedroom and warned that leaving would count as fleeing custody.',
    kurapika: 'Kurapika concludes the Woble development alone does not explain the speed of the declaration and infers another unidentified motive.',
  }),
  quarantined: freeze([
    'Any Chapter 416+ armed assault by Benjamin on another prince or royal residence.',
    'Any Moswana curse activation or later curse effect on Benjamin.',
    'Any TSK-17 infection or later disease consequence.',
    'Any Room 1004 breach, Tserriednich shooting, staged-death result, or later Salkov deduction.',
    'Any later result of Tubeppa’s relocation, Luzurus/Rice disappearance, Marayam’s hold position, Oito’s confinement, or the coded postcards.',
    'Any final identification of Furykov’s curse target or full verification of Beyond’s claims.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character:'Furykov',chapter:415,from:'Combo Master named but mechanics unresolved at the Chapter 413 boundary.',to:'Pre-voyage curse investigator who demonstrates Combo Master’s interface, detects Beyond’s curse network, receives curse-specific time estimates, and keeps the royal target unresolved.',status:'alive / cursed / investigating Beyond' }),
  freeze({ character:'Tubeppa',chapter:415,from:'Operating from Room 1005 under conditional lower-prince strategy.',to:'Ordered toward Room 1001 under Special Martial Law with escort restricted to Royal Army guards; later arrival unresolved.',status:'alive / relocation ordered / private escort restricted' }),
  freeze({ character:'Luzurus',chapter:415,from:'Room 1007 prince preparing nonresistance measures before the declaration.',to:'Missing from Room 1007 after the declaration; Satobi’s Brocco Li theory remains unconfirmed.',status:'alive unless otherwise established / missing' }),
  freeze({ character:'Kanjidol',chapter:415,from:'Unresolved aura confrontation with Ridge at the Chapter 414 boundary.',to:'Reported to have killed Luzurus’s break-room guards before martial law and now shown bound and bruised.',status:'alive / restrained / legal outcome unresolved' }),
  freeze({ character:'Oito',chapter:415,from:'Planning an off-record Yamato coded-letter contingency in Room 1014.',to:'Eight postcards enter the dealer network; after the declaration her indictment is deferred but she is confined to the master bedroom.',status:'alive / confined / indictment deferred' }),
  freeze({ character:'Biscuit',chapter:415,from:'Protecting Marayam inside the isolated Room 1013 Nen space.',to:'Anticipates martial law, rejects leaving the isolated space, and coordinates with Vergei to hold position.',status:'alive / holding isolated Nen space' }),
  freeze({ character:'Marayam',chapter:415,from:'Protected inside the isolated Room 1013 Nen space.',to:'Remains inside as the household decides leaving is too risky to test.',status:'alive / protected / space persistence unresolved' }),
]);
