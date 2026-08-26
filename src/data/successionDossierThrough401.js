import * as base from './successionDossierBoundary400.js';
import {
  succession401ChapterResearch,
  succession401Mysteries,
  succession401RelationshipRecords,
  succession401ResolvedQuestions,
  succession401SourcePolicy,
} from './succession401Research.js';

export * from './successionDossierBoundary400.js';

const freeze = (value) => Object.freeze(value);
const source401 = 'https://hunterxhunter.fandom.com/wiki/Chapter_401';

const moonlight401Ability = freeze({
  ability: 'Transparent Words—Moonlight Act',
  user: 'Longhi',
  owner: 'Longhi',
  type: 'Manipulation · confirmed',
  category: 'Conditional limited-term contract / action restriction / ability loan',
  chapters: '401',
  chapter: 401,
  conditions: 'A counterparty must voluntarily sign the limited-term agreement after Longhi provides the truthful advance explanation required by her vow and limitation. The Chapter 401 peace treaty expires at 9:00 a.m. the following Sunday and renews for one week if a Tubeppa messenger is inside Room 1014 at that time.',
  mechanics: 'Moonlight Act can restrict actions under a signed agreement and, under the demonstrated Tubeppa–Woble pact, imposes one week of enforced Zetsu on breach. Longhi also offers Kurapika one use of Moonlight Act as a reward for satisfying the Beyond-child investigation condition, with a separate personal-contract fallback after Tubeppa termination.',
  knownAtChapterBoundary: 'The aura pen/paper interface does not establish Conjuration. The one-week Zetsu penalty, harm standard, weekly renewal, and one-use reward are documented for this Chapter 401 arrangement and are not universalized into every possible Moonlight Act contract. Maximum range, contract capacity, aura cost, and broader reward catalog remain unresolved.',
  target: 'Voluntary contract signatories and actions governed by the signed agreement; Kurapika is the prospective one-use reward recipient.',
  confidence: 'Official name, owner, Manipulation type, voluntary signature, truthful disclosure, weekly treaty structure, one-week Zetsu breach penalty, and one-use reward confirmed.',
  source: source401,
});

const beyondCurse401Ability = freeze({
  ability: 'Beyond’s Curse-Child Network',
  user: 'Beyond Netero · preparation attributed through Longhi’s disclosure',
  owner: 'Beyond Netero · exact individual curse mechanics unresolved',
  type: 'Nen type unknown',
  category: 'Prepared death-released curse-sacrifice network',
  chapters: '401',
  chapter: 401,
  conditions: 'Longhi says the prepared children were awakened from birth and bear a powerful malevolent seal. A renowned Nen user examining the seal concluded that the prepared Nen is unleashed when the bearer dies. Longhi and Makaha are two of ten selected strong curse sacrifices.',
  mechanics: 'The exact individual abilities, targets, target-selection process, range, and activation control beyond death-release remain unknown. Longhi theorizes that the targets are princes; Bill proposes controlled-switch versus automatic activation models. Neither theory is treated as settled mechanics.',
  knownAtChapterBoundary: 'A weaker-sacrifice population is Longhi’s estimate rather than a confirmed census. The examining Nen user says burning or cutting the visible cursed area cannot purge it, but the archive does not infer that every possible Nen exorcism method is impossible.',
  target: 'Unknown at Chapter 401; Longhi speculates that the Kakin princes are the intended targets.',
  confidence: 'Ten strong sacrifices, Longhi/Makaha inclusion, seal, and death-release disclosed / exact ability and target map unresolved.',
  source: source401,
});

const dowsing401Ability = freeze({
  ability: 'Dowsing Chain · Chapter 401 truth assessment',
  user: 'Kurapika',
  owner: 'Kurapika',
  type: 'Conjuration / Kurapika chain system',
  category: 'Lie-detection and investigative chain application',
  chapters: '348, 401',
  chapter: 401,
  conditions: 'Kurapika holds Dowsing Chain during Longhi’s disclosure and later observes that it has not moved.',
  mechanics: 'Kurapika interprets the motionless chain as no lie detected in Longhi’s statements. Existing limitations remain relevant: manipulation, altered memories, and sincere false belief can prevent a no-lie reading from being equivalent to objective omniscience.',
  knownAtChapterBoundary: 'Longhi’s explicitly speculative prince-target and Beyond-child theories remain hypotheses even though Kurapika detects no lie in the conversation.',
  target: 'Longhi’s statements during the Room 1014 negotiation.',
  confidence: 'No-lie reading confirmed as Kurapika’s observation / objective truth of Longhi’s hypotheses not established.',
  source: source401,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !/Moonlight Act|Beyond.?s Curse-Child Network|Dowsing Chain · Chapter 401/.test(record.ability || '')),
  moonlight401Ability,
  beyondCurse401Ability,
  dowsing401Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession401RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => record.question !== 'What are the exact terms of Longhi’s contract with Kurapika?'),
  ...succession401Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession401ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter401: source401,
  sourcePolicy401: succession401SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 401 Moonlight Act / Beyond curse-sacrifice network / Tubeppa–Woble treaty',
    description: 'Chapter 401 resolves the contract information deliberately withheld at Chapter 400: Longhi reveals Transparent Words—Moonlight Act, her biological connection to Beyond Netero, and the prepared death-released curse network; Kurapika and Longhi establish the explicit Tubeppa–Woble peace agreement and a Beyond-child investigation reward while keeping the royal-child identity, curse target map, and Beyond meeting target unresolved.',
    records: freeze([
      freeze({ subject: 'Longhi / Silent Majority', people: 'Longhi, Furykov, Kurapika', notes: 'Longhi says the snake ability is not hers. Furykov’s earlier belief that she is the killer remains observer inference.', status: 'Longhi excluded as user by direct denial / actual Silent Majority user unresolved', source: source401 }),
      freeze({ subject: 'Transparent Words—Moonlight Act', people: 'Longhi, Kurapika, Bill', notes: 'Manipulation contract ability; voluntary limited-term signature and truthful advance explanation are required.', status: 'official mechanics partly confirmed / broader range, cost and contract capacity unresolved', source: source401 }),
      freeze({ subject: 'Longhi / Beyond parentage', people: 'Longhi, Beyond Netero', notes: 'Longhi identifies Beyond as her biological father and describes the fake-marriage/Royal Military Academy program.', status: 'Longhi biological parentage confirmed / exact full sibling network unresolved', source: source401 }),
      freeze({ subject: 'Longhi / Makaha curse sacrifice status', people: 'Longhi, Makaha, Beyond Netero', notes: 'Both are Beyond daughters and two of ten strong curse sacrifices. A renowned Nen user says the prepared malevolent Nen is released at death.', status: 'ten strong sacrifices disclosed / individual abilities and target assignments unknown', source: source401 }),
      freeze({ subject: 'Possible prince targets', people: 'Longhi, Bill, Kurapika', notes: 'Longhi thinks princes are the likely targets; Bill and Kurapika discuss competing activation-control models.', status: 'hypotheses only / no target map confirmed', source: source401 }),
      freeze({ subject: 'Possible Beyond-child prince', people: 'Longhi, Oito, Kurapika, Beyond Netero', notes: 'Oito confirms eligibility is based on being a child of Nasubi’s legal wives. Longhi believes one prince is Beyond’s child.', status: 'legal wording confirmed / Beyond-child prince existence and identity unresolved', source: source401 }),
      freeze({ subject: 'Tubeppa–Woble peace treaty', people: 'Tubeppa, Woble, Oito, Longhi, Kurapika', notes: 'Non-interference agreement expires at 9:00 a.m. next Sunday, renews if a Tubeppa messenger is in Room 1014, and imposes one week of Zetsu for breach under the stated harm standard.', status: 'active conditional treaty / later consequences quarantined', source: source401 }),
      freeze({ subject: 'Beyond-child investigation reward', people: 'Longhi, Kurapika', notes: 'Kurapika can earn one use of Moonlight Act by resolving whether a prince is Beyond’s child under the stated deadline/termination conditions.', status: 'reward condition established / reward not yet granted or used', source: source401 }),
      freeze({ subject: 'Longhi true plan', people: 'Longhi, Beyond Netero', notes: 'Longhi says she will kill Beyond’s child herself if that child proves to be one of the participating princes.', status: 'conditional assassination intent confirmed / target unidentified', source: source401 }),
      freeze({ subject: 'Beyond 2:00 p.m. request', people: 'Beyond Netero, Kanzai', notes: 'Beyond asks Kanzai to arrange a meeting with someone while remaining in Tier 1 custody.', status: 'meeting request confirmed / person and outcome unnamed', source: source401 }),
    ]),
  }),
]);

export const chapter401Research = succession401ChapterResearch;
export const relationshipsChapter401Research = succession401RelationshipRecords;
