import * as base from './successionDossierThrough388.js';
import {
  succession389ChapterResearch,
  succession389HaveNotCurseResearch,
  succession389HalkenburgCustodyResearch,
  succession389KanjidolBalsamilcoResearch,
  succession389LuzurusInvestigationResearch,
  succession389Mysteries,
  succession389ObserverHypotheses,
  succession389RelationshipRecords,
  succession389ResolvedQuestions,
  succession389SourcePolicy,
  succession389TysonGiulianoResearch,
  succession389ZhangLeiCoinResearch,
} from './succession389Research.js';

export * from './successionDossierThrough388.js';

const freeze = (value) => Object.freeze(value);
const source389 = 'https://hunterxhunter.fandom.com/wiki/Chapter_389';

const tackleShield389Ability = freeze({
  ability: 'Tackle Shield', user: 'Vict', owner: 'Vict', type: 'Nen type unknown · named ability', category: 'Mechanics unrevealed', chapters: '389', chapter: 389,
  conditions: 'Chapter 389 supplies no activation condition.',
  mechanics: 'Benjamin identifies Tackle Shield as Vict’s ability and says he had hoped it would keep Halkenburg in check. No complete shielding, tackling, range, cost, or defensive rule is supplied.',
  knownAtChapterBoundary: 'Official ability name and owner are confirmed; exact mechanics and Nen type remain unknown.',
  target: 'Unresolved.', confidence: 'Existence confirmed / mechanics unrevealed.', source: source389,
});
const haveNot389Ability = freeze({
  ability: 'Have-Not Curse', user: 'Camilla’s Have-Not curse bearers', owner: 'Sarahell / Moswana / Taler and other assigned Have-Nots', type: 'Post-mortem curse · Nen type unknown', category: 'Assigned death-powered curse', chapters: '389', chapter: 389,
  conditions: 'Assigned target; repeated cursing while carrying a target-linked object; object is burned, ashes are consumed as an infusion, and the bearer dies by dagger. Longer preparation and closer death proximity strengthen the curse.',
  mechanics: 'After the bearer’s death the target is deprived of aura. At the strongest described level, the target is forced into Zetsu and dies after several hours.',
  knownAtChapterBoundary: 'Core ritual, suicide cost, proximity scaling, strongest described target effect, and exorcism concerns are explicit. Sarahell only plans to enter the next Nen class here; later entry is withheld.',
  target: 'One assigned rival prince per curse bearer.', confidence: 'Core Chapter 389 ritual confirmed / target-specific success unresolved.', source: source389,
});
const zhangCoins389Ability = freeze({
  ability: 'Zhang Lei’s Guardian Coins', user: 'Zhang Lei’s Guardian Spirit Beast', owner: 'Zhang Lei’s Guardian Spirit Beast', type: 'Guardian Spirit Beast token system', category: 'Numbered coin progression', chapters: '362, 376, 389', chapter: 389,
  conditions: 'The beast produces numbered coins that can be held and distributed. Chapter 389 directly shows a held coin changing from 1 to 10.',
  mechanics: 'Tenftory receives a coin openly after successful Nen training. Coventoba privately knows he acquired one earlier and observes its number has changed from 1 to 10.',
  knownAtChapterBoundary: 'The 1-to-10 change is confirmed. Its meaning, trigger, threshold, and eventual holder effect remain unresolved.',
  target: 'Coin holders; eventual effect unknown.', confidence: 'Number progression directly observed / effect unresolved.', source: source389,
});

const abilityNamesReplacedAt389 = new Set(['Have-Not Curse', 'Zhang Lei’s Guardian Coins', 'Tackle Shield']);
export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !abilityNamesReplacedAt389.has(record.ability)),
  tackleShield389Ability,
  haveNot389Ability,
  zhangCoins389Ability,
]);

export const successionMysteries = freeze([...base.successionMysteries, ...succession389Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession389ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter389: source389, sourcePolicy389: succession389SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 389 Halkenburg containment, Camilla curse network, and Zhang Lei coin progression',
    description: 'Chapter 389 opens with a Day 9 10:00 a.m. flashback, returns to the fourth aura rumbling at Day 10 11:30 a.m., moves Halkenburg into custody, fully explains Camilla’s Have-Not curse-assassination structure, and closes with Coventoba’s coin changing from 1 to 10.',
    records: freeze([
      freeze({ subject: 'Shikaku / Halkenburg analysis', people: 'Kanjidol, Benjamin, Balsamilco', notes: 'Competing route, manipulation, sacrifice, and prince-killing theories remain analysis rather than confirmed mechanics.', status: 'threat analysis active / causal mechanism unresolved', source: source389 }),
      freeze({ subject: 'Vict and fourth aura rumbling', people: 'Vict, Benjamin, Balsamilco', notes: 'Vict’s broken radio report mentions Halkenburg and a bow; Tackle Shield is named, Vict is still judged alive, and the exact attack topology remains unresolved.', status: 'Vict alive by Benjamin’s assessment / whereabouts unknown', source: source389 }),
      freeze({ subject: 'Halkenburg custody', people: 'Halkenburg, Steiner, Peuckert', notes: 'A five-person Restricted Voyage Permit Agency task force takes Halkenburg into custody pending trial.', status: 'alive and in custody / trial outcome unresolved', source: source389 }),
      freeze({ subject: 'Have-Not curse network', people: 'Camilla, Moswana, Sarahell, Fukataki, Taler', notes: 'Assigned post-mortem curse ritual, target-linked object preparation, suicide cost, strongest enforced-Zetsu effect, exorcism concerns, and current target assignments are disclosed.', status: 'network and ritual confirmed / individual curse outcomes unresolved', source: source389 }),
      freeze({ subject: 'Sarahell → Woble', people: 'Sarahell, Woble', notes: 'Sarahell plans to approach Woble through Kurapika’s next Nen class.', status: 'targeting and plan confirmed / no Chapter 389 class entry', source: source389 }),
      freeze({ subject: 'Zhang Lei coin progression', people: 'Zhang Lei, Tenftory, Coventoba', notes: 'Tenftory receives a coin openly; Coventoba observes his secretly acquired coin change from 1 to 10.', status: '1→10 change confirmed / meaning unresolved', source: source389 }),
      freeze({ subject: 'Tyson household', people: 'Giuliano, Izunavi, Tyson', notes: 'Giuliano’s attachment deepens and he cries at an early birthday celebration.', status: 'emotional attachment explicit / Nen causation not established', source: source389 }),
    ]),
  }),
]);

export const kanjidolBalsamilcoChapter389Research = succession389KanjidolBalsamilcoResearch;
export const halkenburgCustodyChapter389Research = succession389HalkenburgCustodyResearch;
export const tysonGiulianoChapter389Research = succession389TysonGiulianoResearch;
export const luzurusInvestigationChapter389Research = succession389LuzurusInvestigationResearch;
export const haveNotCurseChapter389Research = succession389HaveNotCurseResearch;
export const zhangLeiCoinsChapter389Research = succession389ZhangLeiCoinResearch;
export const observerHypothesesChapter389Research = succession389ObserverHypotheses;
export const relationshipsChapter389Research = succession389RelationshipRecords;
export const chapter389Research = succession389ChapterResearch;
