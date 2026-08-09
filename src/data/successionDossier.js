import * as base from './successionDossierThrough379.js';
import {
  succession380ChaRTroupeDealResearch,
  succession380FugetsuCustodyResearch,
  succession380Mysteries,
  succession380RelationshipRecords,
  succession380SecurityEscalationResearch,
  succession380SourcePolicy,
  succession380TroupePresenceDisclosureResearch,
} from './succession380Research.js';

export * from './successionDossierThrough379.js';

const freeze = (value) => Object.freeze(value);
const source380 = 'https://hunterxhunter.fandom.com/wiki/Chapter_380';

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession380RelationshipRecords,
]);

const superseded380Mystery = (record) => {
  const question = String(record.question || '');
  return question.includes('Cha-R') && question.includes('Phantom Troupe');
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded380Mystery(record)),
  ...succession380Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter380: source380,
  sourcePolicy380: succession380SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 380 lower-tier security escalation and royal custody',
    description: 'Mizaistom pushes the military toward stronger lower-tier security, Cha-R operationalizes its Troupe deal, Illumi confirms every Spider is aboard, and Fugetsu is secretly found without an ID and placed in custody.',
    records: freeze([
      freeze({ subject: 'Lower-tier military posture', people: 'Mizaistom, Botobai, Kakin military officials', notes: 'Mizaistom argues that deliberate murders could destabilize the Black Whale, proposes redistributing soldiers toward Tier 3 and below, and the lower tiers enter a martially enforced curfew.', status: 'security escalation active / motive model remains Mizaistom analysis', source: source380 }),
      freeze({ subject: 'Cha-R / Phantom Troupe hunt deal', people: 'Ken’i Wang, Nobunaga, Phinks, Feitan, Tsudonke', notes: 'Cha-R grants access through an adjacent controlled door in exchange for the Troupe trio helping hunt the killer of Cha-R members; Tsudonke’s squad is paired with them.', status: 'operational cooperation active / concealed distrust persists', source: source380 }),
      freeze({ subject: 'Full Phantom Troupe presence disclosure', people: 'Mizaistom, Illumi, Kalluto', notes: 'Illumi confirms that every Phantom Troupe member is aboard but refuses further explanation. Mizaistom worries about whether to tell Kurapika.', status: 'full Troupe presence confirmed to Mizaistom / Kurapika disclosure unresolved', source: source380 }),
      freeze({ subject: 'Fugetsu confidential custody', people: 'Mizaistom, Fugetsu', notes: 'A person without an ID is recognized by soldiers. Mizaistom orders a gag order and custody, then discovers the detainee is Fugetsu. Her route to the lower tiers is not explained in Chapter 380.', status: 'Fugetsu identified / confidential custody active / arrival route unresolved', source: source380 }),
    ]),
  }),
]);

export const lowerTierChapter380SecurityResearch = succession380SecurityEscalationResearch;
export const chaRTroupeChapter380DealResearch = succession380ChaRTroupeDealResearch;
export const phantomTroupeChapter380PresenceResearch = succession380TroupePresenceDisclosureResearch;
export const fugetsuChapter380CustodyResearch = succession380FugetsuCustodyResearch;
