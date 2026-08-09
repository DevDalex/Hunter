import * as base from './successionDossierThrough386.js';
import {
  succession387AssassinationPerspectiveResearch,
  succession387ChapterResearch,
  succession387MelodyOverlapResearch,
  succession387Mysteries,
  succession387ParallelFutureResearch,
  succession387ResolvedQuestions,
  succession387SourcePolicy,
  succession387TrainingResearch,
} from './succession387Research.js';

export * from './successionDossierThrough386.js';

const freeze = (value) => Object.freeze(value);
const source387 = 'https://hunterxhunter.fandom.com/wiki/Chapter_387';

const parallelFuture387Ability = freeze({
  ability: 'Parallel Future', user: 'Tserriednich Hui Guo Rou', owner: 'Tserriednich Hui Guo Rou',
  type: 'Specialization · ten-second future perception and demonstrated forecast divergence', category: 'Future perception / divergence', chapters: '385, 386, 387', chapter: 387,
  conditions: 'In the demonstrated Chapter 387 sequence Tserriednich closes his eyes and fully enters Zetsu. Static precedes a vision ten seconds ahead. Maintaining the eyes-closed Zetsu state allows the future view to continue beyond the initial ten-second preview.',
  mechanics: 'Real time continues while Tserriednich watches the future sequence. He can register present sensory information while visually observing events ten seconds ahead. During the demonstrated Theta interaction he can change his actual actions relative to the forecast, while Theta continues perceiving and acting against the forecast version of him. He uses this offset to evade her gunshot.',
  knownAtChapterBoundary: 'The ten-second forecast lead, continuing future view under maintained Zetsu, simultaneous present sensory awareness, and demonstrated forecast-versus-actual divergence are explicit. Maximum sustainable duration and broader multi-observer/Nen-interaction rules remain unresolved.',
  target: 'Self perception and the future sequence involving surrounding events; separate target/range limits are not quantified.',
  confidence: 'Core Chapter 387 mechanics confirmed / ultimate duration and broader interaction cases unresolved.', source: source387,
});

const isOlderTserriednichTemporalRecord = (record) => {
  const ability = String(record.ability || '');
  return ability === 'Parallel Future' || ability === 'Tserriednich’s Zetsu-linked temporal anomaly';
};
export const successionAbilities = freeze([...base.successionAbilities.filter((record) => !isOlderTserriednichTemporalRecord(record)), parallelFuture387Ability]);
const superseded387Mystery = (record) => {
  const question = String(record.question || '').toLowerCase();
  return (question.includes('theta') && question.includes('bloodless') && question.includes('mechanism')) || (question.includes('theta') && question.includes('apparent assassination') && question.includes('mechanism')) || (question.includes('sub-second') && question.includes('tserriednich'));
};
export const successionMysteries = freeze([...base.successionMysteries.filter((record) => !superseded387Mystery(record)), ...succession387Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession387ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter387: source387, sourcePolicy387: succession387SourcePolicy });
export const guardAssignmentGroups = freeze([...base.guardAssignmentGroups, freeze({
  group: 'Chapter 387 Parallel Future mechanics reveal and Day 8 flashback reconstruction',
  description: 'Chapter 387 rewinds to 25 minutes before the Sunday banquet and explains Tserriednich’s survival of Theta’s assassination attempt from his own perspective. The chapter establishes the ten-second forecast lead, continuing future view, and demonstrated observer-divergence behavior while preserving the earlier 385 and 386 knowledge boundaries. Its final scene returns to Voyage Day 9 for Tserriednich’s refined sub-second eye-cycle training target.',
  records: freeze([
    freeze({ subject: 'First ten-second future vision', people: 'Tserriednich Hui Guo Rou, Theta', notes: 'After fully entering eyes-closed Zetsu, Tserriednich sees a future scene and identifies its ten-second lead when Theta repeats the forecast dialogue.', status: 'ten-second lead explicitly revealed at Chapter 387 boundary', source: source387 }),
    freeze({ subject: 'Continuous future viewing', people: 'Tserriednich Hui Guo Rou, Theta', notes: 'Tserriednich maintains Zetsu beyond the first ten seconds. The future view continues while real time advances, and he can feel present Theta while visually seeing the Theta ten seconds ahead.', status: 'continuous viewing demonstrated / maximum duration unresolved', source: source387 }),
    freeze({ subject: 'Forecast divergence and observer perception', people: 'Tserriednich Hui Guo Rou, Theta', notes: 'The coffee-cup experiment shows Tserriednich changing his actual behavior while Theta continues reacting to the version of him contained in the forecast sequence.', status: 'demonstrated Theta interaction confirmed / broader observer configurations unresolved', source: source387 }),
    freeze({ subject: 'Theta assassination dodge', people: 'Tserriednich Hui Guo Rou, Theta', notes: 'Tserriednich sees the gun draw in the future, moves his actual body away from the predicted position, and survives while Theta fires at the forecast version she perceives.', status: 'Chapter 385 apparent-death mechanism retrospectively explained', source: source387 }),
    freeze({ subject: 'Melody landscape overlap', people: 'Tserriednich Hui Guo Rou, Melody', notes: 'The beautiful landscape is recognized by Tserriednich as someone else’s Nen and is linked to Melody’s already established concert effect rather than to Parallel Future.', status: 'external Nen effect separated from Parallel Future', source: source387 }),
    freeze({ subject: 'Day 9 Zetsu eye-cycle target', people: 'Tserriednich Hui Guo Rou, Salkov', notes: 'The next day Tserriednich says sparring will begin once he can close and reopen his eyes in less than one second.', status: 'refined sub-second target stated / not achieved at Chapter 387 boundary', source: source387 }),
  ]),
})]);

export const parallelFutureChapter387Research = succession387ParallelFutureResearch;
export const assassinationPerspectiveChapter387Research = succession387AssassinationPerspectiveResearch;
export const melodyOverlapChapter387Research = succession387MelodyOverlapResearch;
export const tserriednichTrainingChapter387Research = succession387TrainingResearch;
export const chapter387Research = succession387ChapterResearch;
