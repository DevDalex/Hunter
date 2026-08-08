import * as base from './successionDossierBase.js';
import {
  succession370BodyStates,
  succession370ChapterFocus,
  succession370ChapterResearch,
  succession370Counterintelligence,
  succession370FurykovMethod,
  succession370Mysteries,
  succession370RelationshipRecords,
  succession370SilentMajorityMechanics,
  succession370SourcePolicy,
} from './succession370Research.js';
import {
  succession371ChapterFocus,
  succession371ChapterResearch,
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
  succession372ChapterFocus,
  succession372ChapterResearch,
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

export * from './successionDossierBase.js';

const source370 = 'https://hunterxhunter.fandom.com/wiki/Chapter_370';
const source371 = 'https://hunterxhunter.fandom.com/wiki/Chapter_371';
const source372 = 'https://hunterxhunter.fandom.com/wiki/Chapter_372';
const freeze = (value) => Object.freeze(value);

export const chapterFocus = freeze({
  ...base.chapterFocus,
  ...succession370ChapterFocus,
  ...succession371ChapterFocus,
  ...succession372ChapterFocus,
});

export const successionChapterResearch = freeze([
  ...base.successionChapterResearch.filter((record) => ![370, 371, 372].includes(record.number)),
  ...succession370ChapterResearch,
  ...succession371ChapterResearch,
  ...succession372ChapterResearch,
].sort((left, right) => left.number - right.number));

const silentMajority370Ability = freeze({
  ability: 'Silent Majority',
  owner: 'Unknown',
  category: 'Possession-assisted curse / blood-draining attack',
  knownAtChapterBoundary: 'The user operates a marionette visible only to the user and its possessed person; Loberry is possessed during the class. The marionette has ten people within its selectable possession range, and failure to kill before deactivation rebounds the curse onto the user.',
  mechanics: 'Four snake-like curse entities can attack together and drain a victim’s blood; the user states that all four can exsanguinate a body in eleven seconds.',
  target: 'Barrigen is the confirmed Chapter 370 victim.',
  confidence: 'Chapter 370 confirms the visibility rule, ten-person selection window, rebound condition, four snakes, Barrigen’s death, and the eleven-second four-snake drain. Chapter 371 detains Loberry as a suspect but does not identify the actual user.',
  chapter: 370,
  source: source370,
});

const hanzoSkill4372Ability = freeze({
  ability: 'Hanzo Skill 4',
  owner: 'Hanzo',
  category: 'Projected-double infiltration / investigation',
  knownAtChapterBoundary: 'Hanzo uses a projected double during his investigation of Momoze’s murder and the Room 1013 situation.',
  mechanics: 'The supplied Chapter 372 text confirms the projected-double use but does not fully enumerate activation, range, duration, or interruption mechanics.',
  target: 'Hanzo’s own projected investigative double',
  confidence: 'Ability name and observed use confirmed in Chapter 372; detailed mechanics remain partial.',
  chapter: 372,
  source: source372,
});

const theTouch372Ability = freeze({
  ability: 'The Touch',
  owner: 'Tuffdy',
  category: 'Assassination ability',
  knownAtChapterBoundary: 'The chapter notes identify The Touch as Tuffdy’s ability and state that he used it to assassinate Momoze.',
  mechanics: 'Complete activation conditions and mechanics are not supplied in the current Chapter 372 text.',
  target: 'Momoze Hui Guo Rou',
  confidence: 'Name, owner, and use in Momoze’s murder are confirmed; mechanics remain unresolved.',
  chapter: 372,
  source: source372,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !(
    (record.ability === 'Silent Majority' && record.chapter === 369)
    || record.ability === 'Hanzo Skill 4'
    || record.ability === 'The Touch'
  )),
  silentMajority370Ability,
  hanzoSkill4372Ability,
  theTouch372Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession370RelationshipRecords,
  ...succession371RelationshipRecords,
  ...succession372RelationshipRecords,
]);

export const bodyStateLedger = freeze([
  ...base.bodyStateLedger.filter((record) => record.person !== 'Tuffdy'),
  ...succession370BodyStates,
  ...succession372BodyStates,
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
]);

const superseded370MysteryQuestions = new Set([
  'Who is the Silent Majority user inside or connected to the Room 1014 class?',
  'Which four attendees is Furykov identifying as concealed Nen users?',
]);

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !supersededMysteryQuestions.has(record.question)),
  freeze({
    question: 'Who or what killed Woody and the four other Oito guards by draining their blood?',
    evidence: 'Chapter 370 demonstrates Silent Majority killing Barrigen with four blood-draining snakes in a pattern explicitly compared by the supplied notes to the Chapter 359 deaths. This disproves the theory that Woble’s Guardian Spirit Beast caused those deaths, but Chapters 370–372 still do not identify the earlier killer as the same Silent Majority user.',
    status: 'Woble Guardian Beast theory disproved / killer identity still open',
    lastChapter: '372',
    source: source372,
  }),
  freeze({
    question: 'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
    evidence: 'By Chapter 370 Babimyna has concluded that the cockroach-control ability demonstrated in Chapter 367 was not Bill’s actual ability. Chapters 371–372 do not establish that he has identified Oito as the true temporary user.',
    status: 'cover broken / Oito attribution not yet confirmed',
    lastChapter: '372',
    source: source372,
  }),
  freeze({
    question: 'Who killed Momoze, and what Nen method allowed the killer to bypass the protection detail?',
    evidence: 'Chapter 372 identifies Tuffdy as the killer after Hanzo traps him into self-incrimination. The chapter notes identify Tuffdy’s ability as The Touch and state that it was used to assassinate Momoze, but the supplied text does not provide its complete mechanics.',
    status: 'killer resolved: Tuffdy / ability name resolved: The Touch / detailed mechanics still open',
    lastChapter: '372',
    source: source372,
  }),
  freeze({
    question: 'What caused all eleven of Halkenburg’s bodyguards to lose consciousness?',
    evidence: 'Chapter 372 connects the blackout to a feather-mark phenomenon around Halkenburg’s Guardian Spirit Beast. The guards have no memory of losing consciousness and Shedule/Yuhirai are half-awakened Nen users. Kurapika identifies soliciting-type Manipulation hallmarks and considers memory revision likely.',
    status: 'partially resolved / Guardian Beast manipulation established, exact trigger and conditions open',
    lastChapter: '372',
    source: source372,
  }),
  freeze({
    question: 'What causes Marayam’s Guardian Spirit Beast to grow, and what does that growth enable?',
    evidence: 'Chapter 372 confirms continued growth and a more defensive appearance. Hanzo and Biscuit believe Momoze’s death accelerated it, but that causal link is not confirmed. Hanzo later encounters a smaller, more menacing version in an anomalously empty Room 1013.',
    status: 'open / growth and spatial anomaly now linked as investigation threads',
    lastChapter: '372',
    source: source372,
  }),
  ...succession370Mysteries.filter((record) => !superseded370MysteryQuestions.has(record.question)),
  ...succession371Mysteries,
  ...succession372Mysteries,
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

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter370: source370,
  sourcePolicy370: succession370SourcePolicy,
  chapter371: source371,
  sourcePolicy371: succession371SourcePolicy,
  chapter372: source372,
  sourcePolicy372: succession372SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 370 Nen class incident state',
    description: 'The first public Nen lesson becomes an active murder investigation after Silent Majority kills Barrigen while rival guards continue intelligence and training operations inside Room 1014.',
    records: freeze([
      freeze({ subject: 'Room 1014 Nen class', people: 'Barrigen', notes: 'Marayam representative killed by Silent Majority during the first public Nen lesson.', status: 'deceased / class casualty', source: source370 }),
      freeze({ subject: 'Oito / Woble household', people: 'Oito Hui Guo Rou, Bill', notes: 'Bill begins Oito’s practical Nen training after her forced awakening in Chapter 369.', status: 'active Nen instruction', source: source370 }),
    ]),
  }),
  freeze({
    group: 'Chapter 371 class and judicial aftermath',
    description: 'Barrigen’s murder produces a custody case and judicial observation while Kurapika reorganizes the surviving Nen students into three instructional groups.',
    records: freeze([
      freeze({ subject: 'Silent Majority investigation', people: 'Loberry', notes: 'Royal Army custody as a murder suspect. Possession is established by Chapter 370, but willing complicity is not.', status: 'detained / guilt unresolved', source: source371 }),
      freeze({ subject: 'Seiko household investigation', people: 'Kaiser, Seiko Hui Guo Rou', notes: 'Cleapatro sends Kaiser for a seventy-two-hour observation rather than granting Sakata’s requested immediate case.', status: 'active judicial observation', source: source371 }),
      freeze({ subject: 'Nen class assistants', people: 'Furykov, Belerainte', notes: 'Kurapika divides the class into three groups and appoints the two openly experienced Nen users to help check aura flow.', status: 'active class assignment', source: source371 }),
    ]),
  }),
  freeze({
    group: 'Chapter 372 half-awakening and coalition state',
    description: 'The first class ends at 12:30 while Kurapika’s investigation separates involuntary half-awakened participants from the still-hidden experienced user and converts Halkenburg’s feather-mark problem into a new lower-prince intelligence channel.',
    records: freeze([
      freeze({ subject: 'Halkenburg camp', people: 'Shedule, Yuhirai', notes: 'Both can use Nen in a limited involuntary fashion after Guardian Spirit Beast manipulation but cannot consciously control it.', status: 'half-awakened / active intelligence subjects', source: source372 }),
      freeze({ subject: 'Momoze murder case', people: 'Tuffdy', notes: 'Identified as Momoze’s killer through Hanzo’s trap; killed by Hanzo and staged as suicide.', status: 'deceased / killer identified', source: source372 }),
      freeze({ subject: 'Lower-prince coordination', people: 'Kurapika, Sakata, Yuhirai', notes: 'Agree to prioritize prince protection while Kurapika proposes a broader appeal through Hunter Association connections.', status: 'coalition proposal developing', source: source372 }),
    ]),
  }),
]);
