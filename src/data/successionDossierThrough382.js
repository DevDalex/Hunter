import * as base from './successionDossierThrough381.js';
import {
  succession382BanquetResearch,
  succession382BodyStates,
  succession382CuldceptResearch,
  succession382HalkenburgArrowResearch,
  succession382HalkenburgNasubiResearch,
  succession382Mysteries,
  succession382RelationshipRecords,
  succession382SaleSaleAssassinationResearch,
  succession382SourcePolicy,
} from './succession382Research.js';

export * from './successionDossierThrough381.js';

const freeze = (value) => Object.freeze(value);
const source382 = 'https://hunterxhunter.fandom.com/wiki/Chapter_382';

const halkenburgArrow382Ability = freeze({
  ability: 'Halkenburg collective possession arrow',
  user: 'Halkenburg Hui Guo Rou',
  owner: 'Halkenburg Hui Guo Rou',
  type: 'Collective symbiotic body-will transfer attack',
  category: 'Collective symbiotic body-will transfer attack',
  chapters: '375, 382',
  chapter: 382,
  conditions: 'The attack draws on Halkenburg’s collective fellowship aura. A successful hit suppresses the target host’s will in exchange for the body of one of Halkenburg’s followers.',
  mechanics: 'Followers’ aura forms both overwhelming protection and the projectile while Halkenburg’s own aura forms the bow. The supplied synopsis states that once the bow is drawn the arrow cannot be intercepted or blocked. Against Shikaku it pierces Culdcept, one follower collapses, and Shikaku’s body rises acting under Halkenburg’s side.',
  knownAtChapterBoundary: 'First successful body/will exchange is observed. Official ability name and complete consciousness-transfer topology remain unresolved.',
  target: 'Shikaku in the Chapter 382 demonstration.',
  confidence: 'Core first-use mechanics confirmed / official name and full transfer rules unresolved.',
  source: source382,
});

const culdcept382Ability = freeze({
  ability: 'Culdcept',
  user: 'Shikaku',
  owner: 'Shikaku',
  type: 'Card-based defensive Nen ability / broader mechanics unresolved',
  category: 'Card-based defensive Nen ability / broader mechanics unresolved',
  chapters: '382',
  chapter: 382,
  conditions: 'Shikaku activates the ability and forms a card-like construct as a shield.',
  mechanics: 'The demonstrated card is used defensively against Halkenburg’s collective arrow and is pierced by it.',
  knownAtChapterBoundary: 'Ability name and defensive card manifestation are confirmed.',
  target: 'Self / incoming attack.',
  confidence: 'Observed use confirmed; Nen category and broader card mechanics unsupplied.',
  source: source382,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !['Halkenburg collective possession arrow', 'Culdcept'].includes(record.ability)),
  halkenburgArrow382Ability,
  culdcept382Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession382RelationshipRecords,
]);

export const bodyStateLedger = freeze([
  ...(base.bodyStateLedger || []),
  ...succession382BodyStates,
]);

const superseded382Mystery = (record) => {
  const question = String(record.question || '');
  return question.includes('Salé-salé') && question.includes('protection') && question.includes('Predator');
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded382Mystery(record)),
  ...succession382Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter382: source382,
  sourcePolicy382: succession382SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 382 Halkenburg escalation, possession-arrow breakthrough, and Salé-salé elimination',
    description: 'Halkenburg turns four days of failed petitions into an armed confrontation with Nasubi, survives a self-directed gunshot because his Guardian Spirit Beast stops the bullet, then returns to Room 1009 and defeats Shikaku with the first observed collective body/will exchange. Yushohi separately reports Salé-salé’s assassination as successful before the Sunday banquet opens.',
    records: freeze([
      freeze({ subject: 'Halkenburg / Nasubi confrontation', people: 'Halkenburg Hui Guo Rou, Nasubi Hui Guo Rou, Nugui', notes: 'Halkenburg holds the entrance soldiers at gunpoint and demands suspension of the contest. A shot toward Nasubi stops by an unidentified mechanism. Nasubi’s claim that he cannot die until the ritual ends remains a character claim, not a universally verified rule.', status: 'armed confrontation completed / ritual-survival mechanism unresolved', source: source382 }),
      freeze({ subject: 'Halkenburg self-directed gunshot', people: 'Halkenburg Hui Guo Rou, Halkenburg Guardian Spirit Beast', notes: 'Halkenburg shoots at his own head and his Guardian Spirit Beast visibly stops the bullet inches away.', status: 'direct Guardian Spirit Beast interception confirmed', source: source382 }),
      freeze({ subject: 'Shikaku defensive operation', people: 'Shikaku, Benjamin Hui Guo Rou, Halkenburg Hui Guo Rou', notes: 'Benjamin orders Shikaku to kill Halkenburg and take his ability. Shikaku activates Culdcept, but Halkenburg’s collective arrow pierces the card shield.', status: 'Benjamin order failed / Culdcept defeated', source: source382 }),
      freeze({ subject: 'First collective-arrow exchange', people: 'Halkenburg Hui Guo Rou, Shikaku, one unnamed Halkenburg follower', notes: 'The successful arrow suppresses Shikaku’s original will while one Halkenburg follower collapses; Shikaku’s body rises and asks Halkenburg for orders. Complete consciousness-transfer topology remains unresolved.', status: 'first successful exchange observed', source: source382 }),
      freeze({ subject: 'Salé-salé assassination', people: 'Salé-salé Hui Guo Rou, Yushohi, Benjamin Hui Guo Rou', notes: 'Salé-salé is unresponsive and not breathing while CPR is attempted. Yushohi reports the assassination as successful. The specific ability or method is not supplied and is not equated with Stinger Ball.', status: 'Salé-salé deceased / murder method unresolved', source: source382 }),
      freeze({ subject: 'Sunday banquet', people: 'Kacho Hui Guo Rou, Fugetsu Hui Guo Rou, Melody', notes: 'At 8:00 p.m. on Voyage Day 8 the trio waits nervously immediately before the Sunday banquet begins.', status: 'banquet opening reached / escape execution pending', source: source382 }),
    ]),
  }),
]);

export const halkenburgNasubiChapter382Research = succession382HalkenburgNasubiResearch;
export const halkenburgArrowChapter382Research = succession382HalkenburgArrowResearch;
export const culdceptChapter382Research = succession382CuldceptResearch;
export const saleSaleChapter382AssassinationResearch = succession382SaleSaleAssassinationResearch;
export const sundayBanquetChapter382Research = succession382BanquetResearch;
