import * as base from './successionArchiveThrough415.js';

export * from './successionArchiveThrough415.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary416 = freeze({
  chapter:416,
  day:'Voyage Day 12 · after Special Martial Law declaration',
  time:'No exact Chapter 416 clock time is supplied. The Tserriednich/Salkov gun and staged-death instructions are explicitly recalled from shortly earlier and remain an embedded flashback.',
  nonLinear:true,
  summary:'Benjamin personally drives the Tier 1 martial-law assault under a self-stated ten-hour incapacitation deadline. Camilla shoots him but his Ken stops the bullets; Benjamin kills her two servants while avoiding her death-triggered counter. Moswana dies and Dust in the Wind: Hell Fruit visibly curses Benjamin. Benjamin then infects Camilla with TSK-17, proceeds with Furykov and Butch to Room 1004, breaches the locked room, orders Danjin taken for questioning, considers Kurapika as an army instructor, and shoots Tserriednich while the latter remains in Zetsu under a staged-death contingency.',
  camillaResidence:freeze({
    assault:'Benjamin, Furykov and Butch arrive armed. Mozbe and Taler stand down when outmatched. Camilla fires on Benjamin; Ken stops the bullets; Benjamin kills Fukataki and the unnamed second servant.',
    counter:'Benjamin explicitly avoids directly killing Camilla because he knows her counteractive ability activates on death.',
    moswana:'Moswana dies in Benjamin’s presence. Dust in the Wind: Hell Fruit manifests and strikes Benjamin, whose body darkens and whose pupils display face-like marks. The final effect is unresolved.',
    tsk17:'Benjamin probes disease/indirect-killer edge cases for Camilla’s counteractive ability, silently infects her with TSK-17, and leaves. Progression and counter interaction are unresolved.',
  }),
  room1004:freeze({
    approach:'Furykov and Butch report Tserriednich among twenty people who are difficult to distinguish. Benjamin orders lethal protocol for others but reserves Tserriednich for himself.',
    tserriednichPlan:'Tserriednich’s shortly-earlier instructions to Salkov establish a staged-death plan: secure the body unseen, report exactly what he observes, and conceal the ability.',
    salkovInference:'Salkov links Theta’s prior experience to Tserriednich’s Zetsu training and infers that Zetsu activates the ability. This remains Salkov’s inference.',
    breach:'Benjamin kicks in the door. Tserriednich’s personnel kneel facing the walls. Danjin is identified as a Room 1014 student and ordered to the central Ministry of Justice for questioning.',
    cliffEdge:'Benjamin enters the master bedroom, sees Tserriednich in Zetsu, and shoots him before he finishes proposing a spar. Tserriednich is blasted across the room; his immediate condition is unresolved.',
  }),
  quarantined:freeze([
    'Any Chapter 417+ confirmation of Tserriednich’s condition, survival, injury state, staged-death result, or ability outcome after the shot.',
    'Any later progression, symptom, lethality, timing, cure, or counteractive-ability interaction involving Camilla’s TSK-17 infection.',
    'Any final result, timing, or later-stage effect of Dust in the Wind: Hell Fruit on Benjamin.',
    'Any later Benjamin incapacitation/death result or explanation beyond the Chapter 416 ten-hour internal deadline.',
    'Any result of Danjin’s questioning or any actual Kurapika recruitment following Benjamin’s internal consideration.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character:'Benjamin',chapter:416,from:'Special Martial Law declared; Chapter 415 implies another unidentified motive behind the emergency.',to:'Personally leading armed Tier 1 assaults under a ten-hour deadline, visibly cursed by Hell Fruit, still operational after infecting Camilla and shooting Tserriednich.',status:'alive / cursed / operational / ten-hour deadline' }),
  freeze({ character:'Camilla',chapter:416,from:'Inside her residence under Special Martial Law.',to:'Shoots Benjamin, survives because he avoids triggering Cat’s Name, then is silently infected with TSK-17.',status:'alive / TSK-17 infected / counter interaction unresolved' }),
  freeze({ character:'Moswana',chapter:416,from:'Camilla-aligned curse bearer assigned to Benjamin.',to:'Dies in Benjamin’s presence and activates Dust in the Wind: Hell Fruit.',status:'dead / post-mortem curse activated' }),
  freeze({ character:'Fukataki',chapter:416,from:'Camilla household servant/curse-operation figure.',to:'Shot and killed by Benjamin immediately after Camilla opens fire.',status:'dead' }),
  freeze({ character:'Tserriednich',chapter:416,from:'Continuing Zetsu training in Room 1004 during the martial-law announcement.',to:'Implements a staged-death contingency, remains in Zetsu during Benjamin’s breach, and is shot and blasted across the room.',status:'shot / immediate condition unresolved' }),
  freeze({ character:'Salkov',chapter:416,from:'Monitoring Tserriednich’s Zetsu training.',to:'Tasked with staged-death cleanup/secrecy, infers the Zetsu activation link, and witnesses Benjamin’s confrontation from a compliant kneeling position.',status:'alive / observing / secrecy task active' }),
  freeze({ character:'Danjin',chapter:416,from:'Tserriednich guard and Room 1014 Nen-class student.',to:'Identified by Benjamin and ordered to the central Ministry of Justice for questioning under Butch’s escort.',status:'alive / questioning order issued' }),
]);
