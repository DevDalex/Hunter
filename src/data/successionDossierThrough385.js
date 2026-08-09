import * as base from './successionDossierThrough384.js';
import {
  succession385ChapterResearch,
  succession385GuardianBeastWarningResearch,
  succession385MelodyInvitationResearch,
  succession385Mysteries,
  succession385RelationshipRecords,
  succession385ResolvedQuestions,
  succession385SourcePolicy,
  succession385TemporalAnomalyResearch,
  succession385ThetaSalkovResearch,
  succession385ZetsuTrainingResearch,
} from './succession385Research.js';

export * from './successionDossierThrough384.js';

const freeze = (value) => Object.freeze(value);
const source385 = 'https://hunterxhunter.fandom.com/wiki/Chapter_385';

const temporalAnomaly385Ability = freeze({
  ability: 'Tserriednich’s Zetsu-linked temporal anomaly',
  user: 'Tserriednich Hui Guo Rou',
  owner: 'Tserriednich Hui Guo Rou',
  type: 'Specialist temporal / causal phenomenon; complete mechanics unresolved at Chapter 385 boundary',
  category: 'Zetsu-linked temporal anomaly',
  chapters: '385',
  chapter: 385,
  conditions: 'Observed while Tserriednich sustains Zetsu with his eyes closed during Theta’s attempted assassination. Chapter 385 does not establish the complete activation rule.',
  mechanics: 'Theta perceives a lethal headshot and Tserriednich’s corpse. During the interval in which Melody’s performance reaches the room, the apparent corpse is no longer present, Tserriednich is alive, and a guard describes the experience as time having skipped. No later duration, prediction, or divergence rule is backfilled here.',
  knownAtChapterBoundary: 'A Zetsu-linked anomaly preventing Theta’s perceived lethal result from becoming Tserriednich’s actual death is demonstrated. Exact mechanics, duration, and observer-perception rules remain unresolved.',
  target: 'Unknown at Chapter 385 boundary.',
  confidence: 'Observed phenomenon confirmed / complete ability mechanics intentionally withheld from this boundary.',
  source: source385,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => record.ability !== 'Tserriednich’s Zetsu-linked temporal anomaly'),
  temporalAnomaly385Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession385RelationshipRecords,
]);

const chapter385BodyStates = succession385ChapterResearch[0]?.bodyStates || [];
export const bodyStateLedger = freeze([
  ...(base.bodyStateLedger || []),
  ...chapter385BodyStates,
]);

const resolvedBy385 = (record) => {
  const question = String(record.question || '');
  return question.includes('Theta') && question.includes('tomorrow');
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !resolvedBy385(record)),
  ...succession385Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...succession385ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter385: source385,
  sourcePolicy385: succession385SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 385 Zetsu assassination anomaly and Guardian Spirit Beast escalation',
    description: 'Chapter 385 returns to Voyage Day 8 on the Sunday banquet night. Theta uses Tserriednich’s sustained Zetsu as an assassination window, but the perceived lethal headshot collapses into an unresolved temporal anomaly while Melody’s performance reaches the room. Tserriednich’s Guardian Spirit Beast escalates its warning against Theta, Tserriednich orders a formal invitation to Melody, and Salkov helps Theta reassess the coercive danger after she wakes.',
    records: freeze([
      freeze({ subject: 'Tserriednich sustained Zetsu', people: 'Tserriednich Hui Guo Rou, Theta', notes: 'Theta corrects a remaining aura sliver, tests Tserriednich with distractions, and observes his Guardian Spirit Beast gradually disappear while he sustains Zetsu.', status: 'Zetsu concentration materially advanced / exact duration ceiling unresolved', source: source385 }),
      freeze({ subject: 'Theta assassination attempt', people: 'Theta, Tserriednich Hui Guo Rou', notes: 'Theta uses the Zetsu window to fire a lethal headshot and believes Tserriednich dead. The Chapter 384 unspecified next-day intent is resolved here as an assassination attempt.', status: 'attempt executed / apparent death not actual body death', source: source385 }),
      freeze({ subject: 'Zetsu-linked temporal anomaly', people: 'Tserriednich Hui Guo Rou, Theta, Melody', notes: 'Theta’s perceived corpse disappears, Tserriednich is alive, and a guard describes the interval during Melody’s performance as time having skipped. Chapter 385 does not yet define the later full mechanics.', status: 'phenomenon demonstrated / activation, duration, perception, and divergence rules unresolved', source: source385 }),
      freeze({ subject: 'Guardian Spirit Beast deception escalation', people: 'Tserriednich Hui Guo Rou Guardian Spirit Beast, Theta', notes: 'The beast returns after Zetsu and warns Theta that another deception will cause her to cease being human. Salkov later interprets the worsening facial marks and fears a still more severe punishment.', status: 'escalation confirmed / terminal punishment unresolved', source: source385 }),
      freeze({ subject: 'Tserriednich formal invitation to Melody', people: 'Tserriednich Hui Guo Rou, Melody', notes: 'After learning that the Hunter performer accompanied the skipped interval, Tserriednich orders a formal invitation. The guard states that an invitation can be declined.', status: 'contact request opened / exact objective unresolved', source: source385 }),
      freeze({ subject: 'Theta and Salkov counterplanning', people: 'Theta, Salkov', notes: 'Theta wakes fifteen minutes after collapsing. Salkov shows her the mark, urges rest, and worries the Guardian Spirit Beast may be trying to turn her into Tserriednich’s pawn.', status: 'Theta alive and marked / pawn-conversion remains Salkov hypothesis', source: source385 }),
    ]),
  }),
]);

export const zetsuTrainingChapter385Research = succession385ZetsuTrainingResearch;
export const temporalAnomalyChapter385Research = succession385TemporalAnomalyResearch;
export const guardianBeastWarningChapter385Research = succession385GuardianBeastWarningResearch;
export const melodyInvitationChapter385Research = succession385MelodyInvitationResearch;
export const thetaSalkovChapter385Research = succession385ThetaSalkovResearch;
