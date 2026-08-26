import * as base from './successionDossierThrough396.js';
import {
  succession397ChapterResearch,
  succession397ChrolloPlanResearch,
  succession397Mysteries,
  succession397RelationshipRecords,
  succession397RenkoMachiResearch,
  succession397ResolvedQuestions,
  succession397SarasaResearch,
  succession397SourcePolicy,
  succession397TroupeFoundingResearch,
} from './succession397Research.js';

export * from './successionDossierThrough396.js';

const freeze = (value) => Object.freeze(value);
const source397 = 'https://hunterxhunter.fandom.com/wiki/Chapter_397';

const renko397Ability = freeze({
  ability: 'Renko’s Embalming Ability', user: 'Renko', owner: 'Renko', type: 'Nen type unknown · descriptive archive label', category: 'Embalming / bodily restoration-preservation', chapters: '397', chapter: 397,
  conditions: 'Renko restores Sarasa’s severely damaged deceased body sufficiently for a funeral presentation close to her living appearance. Renko calls the method a special ability, and Machi perceives aura around the restored body.',
  mechanics: 'Chapter 397 establishes only the demonstrated restoration/preservation and its status as a special ability. It does not supply an official name, Nen category, activation process, range, duration, aura cost, general target rules, or whether ordinary embalming procedures are also required.',
  knownAtChapterBoundary: 'Sarasa is the demonstrated target. The restored appearance is not resurrection, healing back to life, or consciousness continuation. Broader applications and all major mechanical limits remain unresolved.',
  target: 'Sarasa’s deceased body in the demonstrated use; broader valid targets unknown', confidence: 'Special ability and demonstrated restoration confirmed / official name, Nen type, activation, and complete mechanics unresolved.', source: source397,
});

export const successionAbilities = freeze([
  ...base.successionAbilities,
  renko397Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession397RelationshipRecords,
]);

const superseded396Mystery = (record) => {
  const question = String(record?.question || '');
  return /Will Sarasa encounter the kidnappers while searching near Uga Forest/i.test(question)
    || /What word will the children eventually place in front of “?troupe”?/i.test(question);
};
export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded396Mystery(record)),
  ...succession397Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession397ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter397: source397,
  sourcePolicy397: succession397SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 397 Sarasa murder / Renko aura reveal / three-year plan / Spider founding',
    description: 'Chapter 397 remains historical Meteor City origin material. Sarasa’s Chapter 396 cliffhanger resolves into confirmed murder; Renko’s restoration is revealed as a special ability and Machi perceives aura; Chrollo proposes a three-year communication-based criminal-attraction system, explicitly adopts lifelong villainy and lethal deterrence, and is nominated as head before a years-later coda establishes the Spider’s birth.',
    records: freeze([
      freeze({ subject: 'Sarasa missing-person search and Uga Forest recovery', people: 'Sarasa, Chrollo, Uvogin, Sheila, Shalnark, Phinks, Pakunoda, Machi, Franklin, Nobunaga, Feitan', notes: 'The next screening is canceled, the community searches, Chrollo finds Sarasa’s pouch plus tire tracks and footprints, and the group recovers her murdered body in Uga Forest.', status: 'Sarasa dead from Chapter 397 boundary / exact killers and unseen abduction sequence unresolved', source: source397 }),
      freeze({ subject: 'Killers’ note', people: 'Chrollo, Uvogin', notes: 'Chrollo can read the note left with Sarasa but refuses to disclose its contents even under Uvogin’s demand.', status: 'note existence and Chrollo reading confirmed / text and exact meaning not supplied or reconstructed', source: source397 }),
      freeze({ subject: 'Renko embalming / Machi aura perception', people: 'Renko, Machi, Sarasa, Lisores', notes: 'Renko’s extraordinary restoration is identified as a special ability. Machi sees aura around Sarasa’s restored body, and Renko invites her to visit via Kirimori Valley.', status: 'Renko ability existence and Machi aura perception confirmed / Nen type, full mechanics, and later training unresolved', source: source397 }),
      freeze({ subject: 'Three-year Meteor City strategy', people: 'Chrollo, Uvogin, Shalnark', notes: 'Chrollo asks for three years, says he will prepare his power and a system before turning fourteen, predicts a communication revolution, and proposes a criminal haven/trap that will draw offenders into Meteor City.', status: 'future strategy confirmed / recording theory remains inference / network not yet built / exact birthday chronology not inferred', source: source397 }),
      freeze({ subject: 'Sheila departure', people: 'Sheila, childhood group', notes: 'Sheila is shown downcast and walking away while the others commit to Chrollo’s preparation plan.', status: 'observable departure confirmed / exact motive or explicit rejection of plan unresolved', source: source397 }),
      freeze({ subject: 'Chrollo villain transition', people: 'Chrollo, Sarasa, childhood group', notes: 'Chrollo says the group must be ready to sacrifice their lives, says he will kill many people, and declares he will live as a villain and make the world fear him to deter predators from Meteor City.', status: 'explicit criminal/villain program confirmed / Chapter 396 theater-only boundary no longer applies after this declaration', source: source397 }),
      freeze({ subject: 'Leadership nomination and Spider birth', people: 'Chrollo, Uvogin, Shalnark, Phinks, Feitan, Franklin, Nobunaga, Machi, Pakunoda', notes: 'Chrollo offers Uvogin leadership; Uvogin refuses, calls Chrollo the head, and the other seven shown members agree. A years-later coda establishes the Spider’s birth.', status: 'Chrollo historical head and Phantom Troupe/Spider founding confirmed / exact spoken full-name coinage not reconstructed', source: source397 }),
    ]),
  }),
]);

export const sarasaChapter397Research = succession397SarasaResearch;
export const renkoMachiChapter397Research = succession397RenkoMachiResearch;
export const chrolloPlanChapter397Research = succession397ChrolloPlanResearch;
export const troupeFoundingChapter397Research = succession397TroupeFoundingResearch;
export const relationshipsChapter397Research = succession397RelationshipRecords;
export const chapter397Research = succession397ChapterResearch;
