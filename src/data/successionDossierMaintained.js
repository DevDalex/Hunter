import * as base from './successionDossierBase.js';
import { maintainedSuccessionChapterResearch, maintainedSuccessionChapterNumbers } from './successionMaintainedChapterResearch.js';
import {
  succession370BodyStates,
  succession370Counterintelligence,
  succession370FurykovMethod,
  succession370Mysteries,
  succession370RelationshipRecords,
  succession370SilentMajorityMechanics,
  succession370SourcePolicy,
} from './succession370Research.js';
import {
  succession371CustodyRecords,
  succession371GuardianBeastTheory,
  succession371LegalInvestigation,
  succession371MafiaPrinceLinks,
  succession371Mysteries,
  succession371NenClassStructure,
  succession371RelationshipRecords,
  succession371RitualCapsuleResearch,
  succession371SourcePolicy,
  succession371TroupeSearchResearch,
} from './succession371Research.js';
import {
  succession372BodyStates,
  succession372HalkenburgGuardianBeastResearch,
  succession372HiddenNenUserResearch,
  succession372MarayamRoomResearch,
  succession372MomozeMurderResolution,
  succession372Mysteries,
  succession372NenClassResearch,
  succession372RelationshipRecords,
  succession372SourcePolicy,
  succession372TysonBeastResearch,
} from './succession372Research.js';
import {
  succession373AirBlowCorrection,
  succession373BenjaminBatonResearch,
  succession373BodyStates,
  succession373CamillaAbilityResearch,
  succession373MarayamSpatialResearch,
  succession373Mysteries,
  succession373RelationshipRecords,
  succession373SecretWindowResearch,
  succession373SecurityRules,
  succession373SourcePolicy,
} from './succession373Research.js';

export * from './successionDossierBase.js';

const freeze = (value) => Object.freeze(value);
const source370 = 'https://hunterxhunter.fandom.com/wiki/Chapter_370';
const source371 = 'https://hunterxhunter.fandom.com/wiki/Chapter_371';
const source372 = 'https://hunterxhunter.fandom.com/wiki/Chapter_372';
const source373 = 'https://hunterxhunter.fandom.com/wiki/Chapter_373';
const maintainedNumbers = new Set(maintainedSuccessionChapterNumbers);

export const chapterFocus = freeze({
  ...base.chapterFocus,
  ...Object.fromEntries(maintainedSuccessionChapterResearch.map((record) => [record.number, record.focus])),
});

export const successionChapterResearch = freeze([
  ...base.successionChapterResearch.filter((record) => !maintainedNumbers.has(record.number)),
  ...maintainedSuccessionChapterResearch,
].sort((left, right) => left.number - right.number));

const silentMajority370Ability = freeze({
  ability: 'Silent Majority',
  owner: 'Unknown',
  category: 'Possession-assisted curse / blood-draining attack',
  knownAtChapterBoundary: 'The user operates a marionette visible only to the user and its possessed person; Loberry is possessed during the class. The marionette has ten people within its selectable possession range, and failure to kill before deactivation rebounds the curse onto the user.',
  mechanics: 'Four snake-like curse entities can attack together and drain a victim’s blood; all four can exsanguinate a body in eleven seconds.',
  target: 'Barrigen is the confirmed Chapter 370 victim.',
  confidence: 'User identity and complete rules remain unresolved.',
  chapter: 370,
  source: source370,
});

const hanzoSkill4372Ability = freeze({
  ability: 'Hanzo Skill 4',
  owner: 'Hanzo',
  category: 'Projected-double infiltration / investigation',
  knownAtChapterBoundary: 'Hanzo uses a projected double during his investigation of Momoze’s murder and the Room 1013 situation.',
  mechanics: 'Chapter 372 confirms projected-double use but does not fully enumerate activation, range, duration, or interruption mechanics.',
  target: 'Hanzo’s projected investigative double',
  confidence: 'Ability name and observed use confirmed; detailed mechanics remain partial.',
  chapter: 372,
  source: source372,
});

const theTouch372Ability = freeze({
  ability: 'The Touch',
  owner: 'Tuffdy',
  category: 'Assassination ability',
  knownAtChapterBoundary: 'The chapter notes identify The Touch as Tuffdy’s ability and state that he used it to assassinate Momoze.',
  mechanics: 'Complete activation conditions and mechanics are not supplied in Chapter 372.',
  target: 'Momoze Hui Guo Rou',
  confidence: 'Name, owner, and use confirmed; mechanics unresolved.',
  chapter: 372,
  source: source372,
});

const airBlow373Ability = freeze({
  ability: 'Air Blow',
  owner: 'Vincent',
  category: 'Nen ability / mechanics unresolved',
  knownAtChapterBoundary: 'Chapter 373 explicitly identifies Air Blow as Vincent’s ability because Benjamin has inherited it through Benjamin Baton.',
  mechanics: 'Not established by the supplied Chapter 373 text.',
  target: 'Unknown',
  confidence: 'Name and owner confirmed; former Chapter 361 maintained attribution removed.',
  chapter: 373,
  source: source373,
});

const secretWindow373Ability = freeze({
  ability: 'Secret Window',
  owner: 'Musse',
  category: 'Surveillance / information acquisition',
  knownAtChapterBoundary: 'Chapter 366 names the evidence-gathering ability; Chapter 373 states that touching Camilla completed a condition and gave Musse telepathic knowledge of her actions. Benjamin inherits the ability after Musse dies.',
  mechanics: 'Condition and information-acquisition function are partially established; complete range, persistence, and agent rules remain incomplete.',
  target: 'Camilla Hui Guo Rou',
  confidence: 'Partial mechanics; inheritance confirmed.',
  chapter: 373,
  source: source373,
});

const catsName373Ability = freeze({
  ability: "Cat's Name",
  owner: 'Camilla Hui Guo Rou',
  category: 'Counteractive post-death revival',
  knownAtChapterBoundary: 'When Musse kills Camilla, a cat-like Nen construct kills Musse and uses his life to revive Camilla.',
  mechanics: 'Camilla’s observed death triggers a life-for-life counterattack and revival.',
  target: 'Attacker who killed Camilla',
  confidence: 'Core exchange confirmed; edge conditions unresolved.',
  chapter: 373,
  source: source373,
});

const benjaminBaton373Ability = freeze({
  ability: 'Benjamin Baton',
  owner: 'Benjamin Hui Guo Rou',
  category: 'Loyal-soldier ability inheritance',
  knownAtChapterBoundary: 'Benjamin can inherit Nen abilities from loyal soldiers under conditions not fully enumerated in Chapter 373.',
  mechanics: 'Air Blow from Vincent and Secret Window from Musse are confirmed inherited abilities; a third star indicates another unidentified ability.',
  target: 'Qualifying loyal soldiers’ Nen abilities',
  confidence: 'Core inheritance function confirmed; complete conditions and third ability unresolved.',
  chapter: 373,
  source: source373,
});

const supersededAbilityNames = new Set([
  'Hanzo Skill 4',
  'The Touch',
  'Air Blow',
  'Secret Window',
  "Cat's Name",
  'Benjamin Baton',
]);

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !(
    (record.ability === 'Silent Majority' && record.chapter === 369)
    || supersededAbilityNames.has(record.ability)
  )),
  silentMajority370Ability,
  hanzoSkill4372Ability,
  theTouch372Ability,
  airBlow373Ability,
  secretWindow373Ability,
  catsName373Ability,
  benjaminBaton373Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession370RelationshipRecords,
  ...succession371RelationshipRecords,
  ...succession372RelationshipRecords,
  ...succession373RelationshipRecords,
]);

const supersededBodyPeople = new Set(['Tuffdy', 'Musse', 'Wolfe', 'Camilla Hui Guo Rou']);
export const bodyStateLedger = freeze([
  ...base.bodyStateLedger.filter((record) => !supersededBodyPeople.has(record.person)),
  ...succession370BodyStates,
  ...succession372BodyStates,
  ...succession373BodyStates,
]);

const supersededMysteryQuestions = new Set([
  'Who or what killed Woody and the four other Oito guards by draining their blood?',
  'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
  'Who is using Silent Majority inside Room 1014, and what does the ability do?',
  'Who are the four concealed Nen users Furykov believes are pretending to be beginners?',
  'What caused all eleven of Halkenburg’s bodyguards to lose consciousness?',
  'Who killed Momoze, and what Nen method allowed the killer to bypass the protection detail?',
  'What causes Marayam’s Guardian Spirit Beast to grow, and what does that growth enable?',
  'What exactly does Salé-salé intend to do at the next banquet?',
  'What mechanism creates the incompatible occupied and empty states of Room 1013?',
]);

const superseded370MysteryQuestions = new Set([
  'Who is the Silent Majority user inside or connected to the Room 1014 class?',
  'Which four attendees is Furykov identifying as concealed Nen users?',
]);

const superseded372MysteryQuestions = new Set([
  'What mechanism creates the empty Room 1013 state encountered by Hanzo?',
]);

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !supersededMysteryQuestions.has(record.question)),
  freeze({
    question: 'Who or what killed Woody and the four other Oito guards by draining their blood?',
    evidence: 'Chapter 370 shows Silent Majority killing Barrigen with an explicitly similar blood-draining mechanism, disproving the Woble Guardian Beast theory. Chapters 370–373 still do not explicitly identify the Chapter 359 killer as the same user.',
    status: 'Woble Guardian Beast theory disproved / killer identity still open',
    lastChapter: '373',
    source: source373,
  }),
  freeze({
    question: 'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
    evidence: 'Babimyna has rejected the Bill cover but Chapters 371–373 do not establish that he has identified Oito as the actual temporary user.',
    status: 'cover broken / Oito attribution not yet confirmed',
    lastChapter: '373',
    source: source373,
  }),
  freeze({
    question: 'Who killed Momoze, and what Nen method allowed the killer to bypass the protection detail?',
    evidence: 'Chapter 372 identifies Tuffdy as the killer and The Touch as the ability used. Complete mechanics remain unspecified by the supplied text.',
    status: 'killer resolved: Tuffdy / ability name resolved: The Touch / detailed mechanics open',
    lastChapter: '372',
    source: source372,
  }),
  freeze({
    question: 'What caused all eleven of Halkenburg’s bodyguards to lose consciousness?',
    evidence: 'Chapter 372 connects the blackout to feather marks, half-awakened Nen use, and Guardian Spirit Beast-linked soliciting-type Manipulation hallmarks. Exact trigger and conditions remain unknown.',
    status: 'partially resolved / exact trigger and conditions open',
    lastChapter: '372',
    source: source372,
  }),
  freeze({
    question: 'What causes Marayam’s Guardian Spirit Beast to grow, and what does that growth enable?',
    evidence: 'Chapter 372 confirms growth and a defensive shift. Chapter 373 proves the household still occupies a functioning Room 1013 state even while Hanzo cannot access or appear within it.',
    status: 'open / growth now linked to a strongly confirmed spatial anomaly',
    lastChapter: '373',
    source: source373,
  }),
  ...succession370Mysteries.filter((record) => !superseded370MysteryQuestions.has(record.question)),
  ...succession371Mysteries,
  ...succession372Mysteries.filter((record) => !superseded372MysteryQuestions.has(record.question)),
  ...succession373Mysteries,
]);

export const silentMajorityChapter370Research = succession370SilentMajorityMechanics;
export const furykovChapter370MethodResearch = succession370FurykovMethod;
export const room1014Chapter370CounterintelligenceResearch = succession370Counterintelligence;
export const chapter371LegalInvestigationResearch = succession371LegalInvestigation;
export const chapter371NenClassStructureResearch = succession371NenClassStructure;
export const guardianBeastWithdrawalTheoryResearch = succession371GuardianBeastTheory;
export const mafiaPrinceChapter371Research = succession371MafiaPrinceLinks;
export const troupeChapter371SearchResearch = succession371TroupeSearchResearch;
export const successionRitualCapsuleResearch = succession371RitualCapsuleResearch;
export const chapter371CustodyResearch = succession371CustodyRecords;
export const hiddenNenUsersChapter372Research = succession372HiddenNenUserResearch;
export const halkenburgGuardianBeastChapter372Research = succession372HalkenburgGuardianBeastResearch;
export const momozeMurderChapter372Resolution = succession372MomozeMurderResolution;
export const marayamRoomChapter372Research = succession372MarayamRoomResearch;
export const tysonBeastChapter372Research = succession372TysonBeastResearch;
export const nenClassChapter372Research = succession372NenClassResearch;
export const catsNameChapter373Research = succession373CamillaAbilityResearch;
export const benjaminBatonChapter373Research = succession373BenjaminBatonResearch;
export const airBlowChapter373Correction = succession373AirBlowCorrection;
export const secretWindowChapter373Research = succession373SecretWindowResearch;
export const marayamSpatialChapter373Research = succession373MarayamSpatialResearch;
export const chapter373SecurityRules = succession373SecurityRules;

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter370: source370,
  sourcePolicy370: succession370SourcePolicy,
  chapter371: source371,
  sourcePolicy371: succession371SourcePolicy,
  chapter372: source372,
  sourcePolicy372: succession372SourcePolicy,
  chapter373: source373,
  sourcePolicy373: succession373SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 370 Nen class incident state',
    description: 'The first public Nen lesson becomes an active murder investigation after Silent Majority kills Barrigen.',
    records: freeze([
      freeze({ subject: 'Room 1014 Nen class', people: 'Barrigen', notes: 'Killed by Silent Majority during the first public Nen lesson.', status: 'deceased / class casualty', source: source370 }),
      freeze({ subject: 'Oito / Woble household', people: 'Oito Hui Guo Rou, Bill', notes: 'Bill begins Oito’s practical Nen training.', status: 'active Nen instruction', source: source370 }),
    ]),
  }),
  freeze({
    group: 'Chapter 371 class and judicial aftermath',
    description: 'Barrigen’s murder produces a custody case and judicial observation while Kurapika reorganizes the surviving students.',
    records: freeze([
      freeze({ subject: 'Silent Majority investigation', people: 'Loberry', notes: 'Royal Army custody as a murder suspect; willing complicity unproven.', status: 'detained / guilt unresolved', source: source371 }),
      freeze({ subject: 'Seiko household investigation', people: 'Kaiser, Seiko Hui Guo Rou', notes: 'Seventy-two-hour observation ordered.', status: 'active judicial observation', source: source371 }),
      freeze({ subject: 'Nen class assistants', people: 'Furykov, Belerainte', notes: 'Assist with checking aura flow.', status: 'active class assignment', source: source371 }),
    ]),
  }),
  freeze({
    group: 'Chapter 372 half-awakening and coalition state',
    description: 'The first class ends while Halkenburg’s half-awakened guards and the Momoze murder resolution reshape the investigation.',
    records: freeze([
      freeze({ subject: 'Halkenburg camp', people: 'Shedule, Yuhirai', notes: 'Limited involuntary Nen use after Guardian Spirit Beast manipulation.', status: 'half-awakened / active intelligence subjects', source: source372 }),
      freeze({ subject: 'Momoze murder case', people: 'Tuffdy', notes: 'Identified as Momoze’s killer and killed by Hanzo.', status: 'deceased / killer identified', source: source372 }),
      freeze({ subject: 'Lower-prince coordination', people: 'Kurapika, Sakata, Yuhirai', notes: 'Defensive coalition proposal develops.', status: 'coalition proposal developing', source: source372 }),
    ]),
  }),
  freeze({
    group: 'Chapter 373 Camilla custody and Marayam anomaly state',
    description: 'Camilla’s counteractive revival attack ends in detention while Room 1013 is proven to have incompatible occupied and inaccessible states.',
    records: freeze([
      freeze({ subject: 'Camilla custody', people: 'Camilla Hui Guo Rou, Balsamilco Might, Furykov', notes: 'Camilla is alive after Cat’s Name revival but confined after attacking Benjamin.', status: 'solitary confinement / active prince', source: source373 }),
      freeze({ subject: 'Benjamin losses and inheritance', people: 'Musse, Wolfe, Benjamin Hui Guo Rou', notes: 'Musse and Wolfe die; Benjamin inherits Secret Window from Musse and is confirmed to already possess Air Blow from Vincent.', status: 'Musse/Wolfe deceased / inherited abilities active', source: source373 }),
      freeze({ subject: 'Marayam household', people: 'Vergei, Marayam Hui Guo Rou, Sevanti Hui Guo Rou, Hanzo', notes: 'Vergei, Marayam, and Sevanti occupy a functioning room state while Hanzo cannot appear in or access that same state.', status: 'occupied / spatial anomaly unresolved', source: source373 }),
    ]),
  }),
]);
