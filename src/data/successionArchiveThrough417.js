import * as base from './successionArchiveThrough416.js';

export * from './successionArchiveThrough416.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary417 = freeze({
  chapter:417,
  day:'Voyage Day 12 · Special Martial Law endgame operations',
  time:'No exact Chapter 417 clock time is supplied. Scene order continues directly from the Chapter 416 Room 1004 shooting.',
  nonLinear:false,
  boundaryStatus:'current publication ceiling',
  summary:'Benjamin brutalizes the apparent Tserriednich body while Salkov questions whether the scene is real, expands military headquarters into Justice, orders Salkov and Danjin detained, covertly exposes Tubeppa and Tyson to TSK-17 in Room 1001, reactivates Balsamilco and Coventoba after Gyo inspection of his own afflicted state, distributes Halkenburg/Zhang Lei investigations, reviews prince-by-prince elimination plans, reveals Gypsy Life: Bohemian Rhapsody, and ends by deciding to confront Unma and force a choice between her life and Halkenburg’s.',
  room1004:freeze({
    apparentOutcome:'Benjamin shoots, stomps, and crushes the apparent Tserriednich body and internally treats him as dead.',
    salkovBoundary:'Salkov questions whether the body, Benjamin, and surrounding scene are genuine and plans to use Theta’s Nen-visible scar as a reality check. The maintained state therefore remains unresolved rather than omnisciently dead.',
    custody:'Benjamin orders Salkov and Danjin detained at the Central Justice Bureau and directs the military to establish headquarters on the Ministry of Justice’s seventh floor.',
  }),
  room1001:freeze({
    present:'Tubeppa and Tyson are the only princes reported in Room 1001; Zhang Lei and Luzurus are reported to have fled before the declaration.',
    coverStory:'Benjamin gives the princes his stolen-weapon/traitor explanation and raises Kurapika’s monarchy-collapse hypothesis as a discussion possibility. His explanation remains his stated account.',
    tsk17:'Benjamin covertly disperses the second TSK-17 dose into the air while speaking with Tubeppa and Tyson, then restricts their movement and requests inspections.',
    tubeppa:'Tubeppa suspects the inspections may conceal an attack and believes Benjamin is hiding another reason for Special Martial Law.',
  }),
  justice:freeze({
    firstUnit:'Balsamilco and Coventoba voice concerns about lingering manipulation. Benjamin orders Gyo, discloses his Have-Not curse, TSK-17 infection and possible Beyond-curse targeting, then returns them to armed First Unit duty.',
    halkenburg:'Balsamilco takes responsibility for investigating possible Halkenburg mind-swap participants through feather marks.',
    zhangLei:'Coventoba explains Zhang Lei’s coin at value 10 and is ordered to keep holding it; Chiyamasi reports Zhang Lei movement information.',
  }),
  strategicReview:freeze({
    rule:'Benjamin’s prince-by-prince death windows, cover stories and elimination plans are his internal strategic projections, not post-Chapter-417 outcomes.',
    camilla:'Benjamin observes Camilla contacting the medical department through Secret Window and estimates a roughly 13–19 hour TSK-17 death window.',
    tserriednich:'Benjamin internally records Tserriednich as dead, while the separate Salkov reality boundary remains unresolved.',
    tubeppaTyson:'Benjamin treats Tubeppa and Tyson as infected and projects a similar death window.',
    others:'Fugetsu, Woble/Oito, Halkenburg, Luzurus, Zhang Lei and Marayam are assigned elimination/infection scenarios in Benjamin’s planning only.',
  }),
  gypsyLife:freeze({
    name:'Gypsy Life: Bohemian Rhapsody',
    mechanics:'After Benjamin dies, his Guardian Spirit Beast fuses with Benjamin Baton and becomes the Guardian Spirit Beast of one of his blood relatives. The first future-host selection right is determined between Benjamin and the beast, then selection authority alternates for each later host.',
    translation:'The supplied synopsis/translation note controls the alternating-selector mechanic rather than the noted Viz rendering.',
    activation:'No actual death, fusion or transfer occurs in Chapter 417.',
  }),
  endpoint:freeze({
    unma:'Benjamin believes Unma exploited Furykov’s loyalty and uncertainty around Beyond’s curse to provoke Special Martial Law.',
    stoppingPoint:'Benjamin decides to confront Unma and force her to choose between her own life and that of his “Brother,” Halkenburg.',
  }),
  publicationCeiling:freeze([
    'Chapter 417 is the latest published chapter in the supplied maintained set.',
    'Do not invent Benjamin’s confrontation with Unma or her answer.',
    'Do not invent Benjamin’s death, survival, TSK-17 resolution, Hell Fruit resolution, or Beyond-curse result.',
    'Do not invent Tserriednich’s true post-attack condition or the result of Salkov’s reality test.',
    'Do not invent Tubeppa/Tyson/Camilla TSK-17 outcomes.',
    'Do not invent a Gypsy Life fusion, host selection, or transfer.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({ character:'Benjamin',chapter:417,from:'Cursed and operational after shooting Tserriednich at the Chapter 416 boundary.',to:'Expands Justice control, deploys a second TSK-17 dose, reactivates First Unit officers, discloses layered curse/infection threats, reveals Gypsy Life mechanics, and plans to confront Unma.',status:'alive / cursed / TSK-17 infected / operational / publication-ceiling outcome unresolved' }),
  freeze({ character:'Tserriednich',chapter:417,from:'Shot and blasted across Room 1004; immediate condition unresolved.',to:'Apparent body is further crushed by Benjamin, who believes him dead, while Salkov questions whether the entire scene is real.',status:'apparent fatal trauma / true condition unresolved' }),
  freeze({ character:'Salkov',chapter:417,from:'Observing Benjamin’s assault under staged-death secrecy instructions.',to:'Attempts to reason through possible illusion boundaries, plans a Theta-scar reality check, and is ordered into Central Justice Bureau detention.',status:'alive / detained by order / reality test incomplete' }),
  freeze({ character:'Tubeppa',chapter:417,from:'Relocation ordered under Special Martial Law.',to:'Meets Benjamin in Room 1001, is exposed to TSK-17, restricted to VVIP movement, and distrusts the planned inspections.',status:'alive / TSK-17 infected / movement restricted' }),
  freeze({ character:'Tyson',chapter:417,from:'Escorted under Special Martial Law.',to:'Meets Benjamin in Room 1001, is exposed to TSK-17, and placed under the same movement/inspection regime.',status:'alive / TSK-17 infected / movement restricted' }),
  freeze({ character:'Balsamilco',chapter:417,from:'Recovered from Room 1009 after prior identity-control crisis.',to:'Identity verified, uses Gyo on Benjamin, returns to armed First Unit duty, and takes the Halkenburg feather investigation.',status:'alive / active duty / lingering effects unresolved' }),
  freeze({ character:'Coventoba',chapter:417,from:'Reports manipulation by Zhang Lei’s coin and requests detention.',to:'Detention rejected, uses Gyo on Benjamin, returns to armed duty, explains the value-10 coin and is ordered to keep holding it.',status:'alive / active duty / possible lingering manipulation unresolved' }),
  freeze({ character:'Unma',chapter:417,from:'First Queen with previously established Halkenburg maternity.',to:'Becomes Benjamin’s intended confrontation target after he blames her for exploiting Furykov’s curse uncertainty.',status:'not directly shown / Benjamin confrontation target' }),
]);
