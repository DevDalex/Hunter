import * as base from './successionDossierThrough389.js';
import {
  succession390ChapterResearch,
  succession390Mysteries,
  succession390NenAbilityResearch,
  succession390RelationshipRecords,
  succession390ResolvedQuestions,
  succession390SourcePolicy,
  succession390XiYuOperationResearch,
  succession390ZhangLeiCoinResearch,
  succession390ZhangLeiOniorResearch,
} from './succession390Research.js';

export * from './successionDossierThrough389.js';

const freeze = (value) => Object.freeze(value);
const source390 = 'https://hunterxhunter.fandom.com/wiki/Chapter_390';

const zhangCoins390Ability = freeze({
  ability: 'Zhang Lei’s Guardian Coins', user: 'Zhang Lei’s Guardian Spirit Beast', owner: 'Zhang Lei’s Guardian Spirit Beast', type: 'Guardian Spirit Beast token system', category: 'Numbered coin progression', chapters: '362, 376, 389, 390', chapter: 390,
  conditions: 'The beast produces numbered coins that can be held and distributed. Chapter 389 showed Coventoba’s coin change from 1 to 10; Chapter 390 shows Coventoba recognizing the same aura on that changed coin while Tenftory’s separate coin still displays 1.',
  mechanics: 'Coventoba briefly considers whether his 10 coin could be a different object, but recognizes the same aura as before. Tenftory provides a simultaneous comparison coin at 1. Coventoba considers putting his coin in the Guardian Spirit Beast’s mouth but rejects the experiment as too risky, so no result exists.',
  knownAtChapterBoundary: 'Same-aura continuity of Coventoba’s changed coin and a simultaneous 10-versus-1 holder comparison are established. Number meaning, causal trigger, threshold, and eventual holder effect remain unresolved.',
  target: 'Coin holders; eventual effect unknown.', confidence: 'Same-aura continuity and number comparison observed / causal mechanics unresolved.', source: source390,
});
const bloodyMary390Ability = freeze({
  ability: 'Bloody Mary', user: 'Zakuro Custard', owner: 'Zakuro Custard', type: 'Nen type unknown · blood-linked named ability', category: 'Blood-linked subdual', chapters: '390', chapter: 390,
  conditions: 'The demonstrated use occurs after Zakuro receives a deep neck cut. He says he needed more blood and thanks the attacker because he could not cut himself.',
  mechanics: 'Zakuro uses Bloody Mary to subdue the opponent after blood is available from the wound. The supplied synopsis does not describe the exact blood-control action.',
  knownAtChapterBoundary: 'Official ability name, user, blood-linked demonstration, and successful subdual are confirmed. Exact Nen type, range, blood-control method, and repeat-use rules remain unknown.',
  target: 'Heil-Ly opponent in the demonstrated use.', confidence: 'Demonstrated effect confirmed / complete mechanics unresolved.', source: source390,
});
const bodyAndSoul390Ability = freeze({
  ability: 'Body and Soul', user: 'Lynch Fullbokko', owner: 'Lynch Fullbokko', type: 'Nen type unknown · interrogation ability', category: 'Information acquisition', chapters: '390', chapter: 390,
  conditions: 'The demonstrated sequence combines Lynch physically attacking an opponent with asking questions through the ability.',
  mechanics: 'Lynch uses Body and Soul while questioning the opponent and obtains basic information about Heil-Ly’s objective and Morena’s ability.',
  knownAtChapterBoundary: 'Official ability name and successful interrogation are confirmed. Chapter 390 does not establish a universal truth-compulsion rule or complete conditions.',
  target: 'Questioned opponent.', confidence: 'Successful interrogation confirmed / complete mechanics unresolved.', source: source390,
});
const hinrigh390Ability = freeze({
  ability: 'Hinrigh object-to-animal transformation', user: 'Hinrigh Biganduffno', owner: 'Hinrigh Biganduffno', type: 'Nen type unknown · descriptive archive label', category: 'Object-to-living-animal transformation', chapters: '390', chapter: 390,
  conditions: 'Hinrigh touches the soldiers’ guns before the transformation occurs.',
  mechanics: 'The gun barrels become live snakes whose mouths retain the guns’ firing function and kill the two soldiers.',
  knownAtChapterBoundary: 'Touch-triggered gun-to-snake transformation and retained firing are demonstrated. The supplied synopsis gives no formal ability name, Nen type, maximum duration, target limit, or transformation rules.',
  target: 'Two soldiers’ guns in the demonstrated use.', confidence: 'Demonstrated transformation confirmed / formal name and full mechanics unresolved.', source: source390,
});

const abilityNamesReplacedAt390 = new Set(['Zhang Lei’s Guardian Coins']);
export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !abilityNamesReplacedAt390.has(record.ability)),
  zhangCoins390Ability,
  bloodyMary390Ability,
  bodyAndSoul390Ability,
  hinrigh390Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession390RelationshipRecords,
]);
export const successionMysteries = freeze([...base.successionMysteries, ...succession390Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession390ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter390: source390, sourcePolicy390: succession390SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 390 Zhang Lei coin continuity and Xi-Yu Tier 3 operation',
    description: 'Chapter 390 directly continues Coventoba’s coin observation, adds Zhang Lei’s consultation with Onior, then shifts to Xi-Yu’s expanded Hisoka/Morena operation and three Nen demonstrations on Tier 3.',
    records: freeze([
      freeze({ subject: 'Coventoba coin continuity', people: 'Coventoba, Tenftory, Zhang Lei', notes: 'Coventoba recognizes the same aura on his changed 10 coin while Tenftory’s separate coin remains at 1. The beast-mouth experiment is considered and rejected.', status: 'same-aura continuity confirmed / trigger and effect unresolved', source: source390 }),
      freeze({ subject: 'Zhang Lei → Onior consultation', people: 'Zhang Lei, Onior', notes: 'Zhang Lei asks his father for information on Nen and Guardian Spirit Beasts. Onior lacks Guardian Spirit Beast knowledge and promises to consult younger Xi-Yu members who know Nen.', status: 'family/mafia information channel activated', source: source390 }),
      freeze({ subject: 'Xi-Yu expanded hunt', people: 'Onior, Hinrigh, Lynch, Zakuro, Hisoka, Morena', notes: 'Onior orders a Tier 3 Hisoka search, Tier 4 controlled Troupe access, and Morena’s elimination. Hinrigh forms the field team.', status: 'operation active / objectives unresolved', source: source390 }),
      freeze({ subject: 'Bloody Mary', people: 'Zakuro', notes: 'Zakuro subdues an opponent after a deep neck cut supplies blood. Exact blood mechanics and Nen category remain unspecified.', status: 'named ability demonstrated / complete mechanics unresolved', source: source390 }),
      freeze({ subject: 'Body and Soul', people: 'Lynch', notes: 'Lynch attacks and questions an opponent, obtaining basic Heil-Ly and Morena information.', status: 'named interrogation ability demonstrated / truth and range rules unresolved', source: source390 }),
      freeze({ subject: 'Heil-Ly civilian registration', people: 'Hinrigh, Lynch, Zakuro', notes: 'The encountered Heil-Ly members are officially registered as civilians, making open mafia violence politically and legally dangerous.', status: 'encounter-specific registration confirmed / not generalized to every Heil-Ly member', source: source390 }),
      freeze({ subject: 'Hinrigh gun-to-snake transformation', people: 'Hinrigh', notes: 'After touching two soldiers’ guns, Hinrigh transforms the barrels into live snakes whose mouths fire and kill the soldiers.', status: 'effect demonstrated / formal ability name and full rules unresolved', source: source390 }),
    ]),
  }),
]);

export const zhangLeiCoinsChapter390Research = succession390ZhangLeiCoinResearch;
export const zhangLeiOniorChapter390Research = succession390ZhangLeiOniorResearch;
export const xiYuOperationChapter390Research = succession390XiYuOperationResearch;
export const nenAbilitiesChapter390Research = succession390NenAbilityResearch;
export const relationshipsChapter390Research = succession390RelationshipRecords;
export const chapter390Research = succession390ChapterResearch;
