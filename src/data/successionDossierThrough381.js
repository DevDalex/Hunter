import * as base from './successionDossierThrough380.js';
import {
  succession381FugetsuCustodyResearch,
  succession381HunterCodeRetrospective,
  succession381MelodySupervisorResearch,
  succession381Mysteries,
  succession381PredatorResolutionResearch,
  succession381RelationshipRecords,
  succession381SecurityResolutionResearch,
  succession381SourcePolicy,
  succession381StingerBallResearch,
} from './succession381Research.js';

export * from './successionDossierThrough380.js';

const freeze = (value) => Object.freeze(value);
const source381 = 'https://hunterxhunter.fandom.com/wiki/Chapter_381';

const predator381Ability = freeze({
  ability: 'Predator',
  user: 'Rihan',
  owner: 'Rihan',
  type: 'Analysis-dependent counter ability',
  category: 'Analysis-dependent counter ability',
  chapters: '374, 381',
  chapter: 381,
  conditions: 'Rihan develops a counter from his own analysis of a selected target ability; effectiveness depends on the accuracy of that analysis and outside analytical assistance is prohibited.',
  mechanics: 'In Chapter 381 Predator consumes Koroabde’s clone, breaking the induced affection, and then consumes Salé-salé’s Guardian Spirit Beast. The successful mission leaves Rihan unable to use Nen for 48 hours.',
  knownAtChapterBoundary: 'Successful anti-Guardian-Spirit-Beast use and the 48-hour post-success Nen lockout are confirmed.',
  target: 'Selected Nen ability / Nen construct; Chapter 381 target is Salé-salé’s Guardian Spirit Beast.',
  confidence: 'Core use and post-use cost confirmed; complete generic failure/range rules remain open.',
  source: source381,
});

const stingerBall381Ability = freeze({
  ability: 'Stinger Ball',
  user: 'Yushohi',
  owner: 'Yushohi',
  type: 'Attachment-based assassination ability / mechanics unresolved',
  category: 'Attachment-based assassination ability / mechanics unresolved',
  chapters: '381',
  chapter: 381,
  conditions: 'Yushohi has successfully attached Stinger Ball to Fugetsu; Chapter 381 does not reveal the complete attachment or activation conditions.',
  mechanics: 'The target carries the attached ability, but its trigger, effect, removal method, range, duration, and Nen category remain unsupplied at this chapter boundary.',
  knownAtChapterBoundary: 'Ability name, user, target, and successful attachment are confirmed.',
  target: 'Fugetsu Hui Guo Rou',
  confidence: 'Attachment confirmed / mechanics unresolved.',
  source: source381,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !['Predator', 'Stinger Ball'].includes(record.ability)),
  predator381Ability,
  stingerBall381Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession381RelationshipRecords,
]);

const superseded381Mystery = (record) => {
  const question = String(record.question || '');
  return (question.includes('Fugetsu') && (question.includes('lower') || question.includes('route') || question.includes('reach')))
    || (question.includes('Salé-salé') && question.includes('Predator'))
    || question.includes('Stinger Ball');
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded381Mystery(record)),
  ...succession381Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter381: source381,
  sourcePolicy381: succession381SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 381 twin surveillance, Predator resolution, and assassination handoff',
    description: 'Fugetsu moves from lower-tier custody to monitored Tier 1 release, Predator removes Salé-salé’s Guardian Spirit Beast and locks Rihan out of Nen for 48 hours, and Yushohi reveals Stinger Ball is already attached to Fugetsu.',
    records: freeze([
      freeze({ subject: 'Fugetsu monitored release', people: 'Fugetsu Hui Guo Rou, Mizaistom, Melody, Keeney', notes: 'Fugetsu is returned to Tier 1 instead of confinement but placed under seventy-two-hour surveillance. Ordinary corridor footage does not explain her lower-tier movement.', status: 'monitored release active / teleportation route still incomplete', source: source381 }),
      freeze({ subject: 'Hunter Code call', people: 'Melody, Keeney, Mizaistom side', notes: 'The spoken call outwardly orders an anti-escape mission. The supplied notes retrospectively decode the hidden Chapter 383 Hunter Code message as “Assist Princes escape fully”; this decode is not treated as explicit Chapter 381 character knowledge.', status: 'covert message preserved as retrospective annotation', source: source381 }),
      freeze({ subject: 'Predator mission', people: 'Rihan, Salé-salé Hui Guo Rou, Koroabde', notes: 'Predator consumes Koroabde’s clone and Salé-salé’s Guardian Spirit Beast. Rihan then enters a forty-eight-hour Nen lockout.', status: 'Guardian Spirit Beast neutralized / Rihan temporarily Nen-disabled', source: source381 }),
      freeze({ subject: 'Yushohi assassination threat', people: 'Yushohi, Fugetsu Hui Guo Rou, Rihan', notes: 'Yushohi confirms Stinger Ball is attached to Fugetsu and receives the order to replace Rihan after the Predator mission.', status: 'Stinger Ball attached / assassination handoff active', source: source381 }),
      freeze({ subject: 'Lower-tier lockdown', people: 'Black Whale security', notes: 'At 8:00 p.m. on Voyage Day 5, a shipwide announcement says the stowaway has been captured and the lockdown is lifted.', status: 'lockdown ended / announced stowaway identity not supplied', source: source381 }),
    ]),
  }),
]);

export const fugetsuChapter381CustodyResearch = succession381FugetsuCustodyResearch;
export const hunterCodeChapter381Retrospective = succession381HunterCodeRetrospective;
export const melodyChapter381SupervisorResearch = succession381MelodySupervisorResearch;
export const predatorChapter381ResolutionResearch = succession381PredatorResolutionResearch;
export const stingerBallChapter381Research = succession381StingerBallResearch;
export const securityChapter381ResolutionResearch = succession381SecurityResolutionResearch;
