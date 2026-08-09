import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 387 boundary audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession387Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index386 = numbers.indexOf(386);
  assert(index386 >= 0 && numbers[index386 + 1] === 387, 'maintained publication chain must place Chapter 387 directly after Chapter 386');

  const chapter387 = chapterModule.succession387ChapterResearch?.[0];
  assert(chapter387?.number === 387, 'dedicated Chapter 387 research must load');
  assert(chapter387.title === null && chapter387.titleStatus === 'not-supplied-no-title-invented', 'Chapter 387 title must remain unsupplied rather than invented');
  assert(chapter387.chronology?.primary?.includes('25 minutes before Sunday banquet'), 'Chapter 387 must preserve the explicit relative Day 8 flashback anchor');
  assert(chapter387.chronology?.coda?.includes('Voyage Day 9'), 'Chapter 387 must preserve the next-day Day 9 coda');
  assert(chapter387.chronology?.absoluteClockTime === null, 'the 25-minute relative anchor must not be converted into an invented absolute clock time');
  assert(chapter387.events?.some((event) => event.day === 8) && chapter387.events?.some((event) => event.day === 9), 'Chapter 387 maintained events must preserve both Day 8 flashback and Day 9 coda');

  const parallel385 = archive.getAbilityDossier('ability:parallel-future', 385);
  const parallel386 = archive.getAbilityDossier('ability:parallel-future', 386);
  const parallel387 = archive.getAbilityDossier('ability:parallel-future', 387);
  assert(parallel385?.known && parallel386?.known && parallel387?.known, 'Parallel Future must remain queryable across 385–387');
  const text385 = JSON.stringify(parallel385);
  const text386 = JSON.stringify(parallel386);
  const text387 = JSON.stringify(parallel387);
  const tenSecondPattern = /ten-second|ten second|10-second|10 second/i;
  assert(!tenSecondPattern.test(text385), 'Chapter 385 must not receive the Chapter 387 ten-second reveal retroactively');
  assert(!tenSecondPattern.test(text386), 'Chapter 386 must not receive the Chapter 387 ten-second reveal retroactively');
  assert(tenSecondPattern.test(text387), 'Chapter 387 Parallel Future dossier must expose the ten-second forecast lead');
  assert(text387.includes('continue') && text387.includes('diverg'), 'Chapter 387 Parallel Future dossier must expose continuing vision and demonstrated divergence');
  assert(parallel385.knowledgeState === 'partially documented' && parallel386.knowledgeState === 'partially documented', '385 and 386 must remain partially documented');
  assert(parallel387.knowledgeState === 'documented', 'Chapter 387 must become the first documented core-mechanics boundary');

  const ability = archive.getEntityById('ability:parallel-future');
  assert(ability?.latestChapter === 387 && ability?.sourceChapterNumbers?.includes(387), 'global Parallel Future entity must extend through Chapter 387');
  assert(ability?.classification?.nenTypes?.includes('specialization'), 'Parallel Future must retain the existing confirmed Specialization classification');
  assert(!String(ability?.limitations || []).includes('must remain defenseless for ten seconds'), 'Tserriednich’s superseded initial worry must not become the final global limitation');

  const events387 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 387 && event.chapterRange?.end === 387);
  const eventIds = new Set(events387.map((event) => event.id));
  for (const id of [
    'event:tserriednich-first-ten-second-future-vision',
    'event:tserriednich-continuous-future-divergence-test',
    'event:tserriednich-theta-assassination-divergence-dodge',
    'event:tserriednich-melody-landscape-external-nen',
    'event:tserriednich-parallel-future-self-analysis',
    'event:tserriednich-day9-subsecond-eye-cycle-target',
  ]) assert(eventIds.has(id), `${id} must be in the Chapter 387 canonical event foundation`);

  const day8Events = events387.filter((event) => event.chronology?.day === 8);
  const day9Events = events387.filter((event) => event.chronology?.day === 9);
  assert(day8Events.length >= 5 && day9Events.length >= 1, 'canonical event chronology must keep the flashback on Day 8 and the training coda on Day 9');
  assert(events387.every((event) => event.chronology?.timeOfDay === null), 'Chapter 387 canonical events must not invent absolute clock times');

  const dodge = archive.getEntityById('event:tserriednich-theta-assassination-divergence-dodge');
  assert(dodge?.abilityIds?.includes('ability:parallel-future'), 'Theta assassination dodge must link to Parallel Future');
  assert(dodge?.outcomes?.some((value) => value.includes('forecast')), 'assassination event must preserve forecast-versus-actual perception mechanics');

  const melody = archive.getEntityById('event:tserriednich-melody-landscape-external-nen');
  assert(melody?.abilityIds?.includes('ability:melody-aura-performance'), 'concert landscape must link to Melody’s established performance ability');
  assert(melody?.abilityIds?.includes('ability:parallel-future'), 'concert overlap event may also link the active Parallel Future scene without merging the abilities');
  assert(melody?.outcomes?.some((value) => value.includes('separated from Parallel Future')), 'Melody landscape must remain mechanically separate from Parallel Future');

  const research = chapterModule.succession387ParallelFutureResearch;
  assert(research?.forecastLead?.includes('ten seconds'), 'dedicated mechanics research must preserve the ten-second forecast lead');
  assert(research?.continuedVision?.includes('beyond the initial ten-second'), 'dedicated mechanics research must preserve continuing future viewing');
  assert(research?.initialMisunderstanding?.includes('not retained as the final rule'), 'initial defenselessness concern must be explicitly superseded');
  assert(research?.unresolved?.some((value) => value.includes('maximum duration')), 'ultimate continuous-view duration must remain unresolved');

  const training = chapterModule.succession387TrainingResearch;
  assert(training?.sparringThreshold?.includes('Close and then open') && training.achievedAtBoundary === false, 'sub-second close/open eye cycle must remain an unachieved Chapter 387 training target');

  const dossierParallel = (dossier.successionAbilities || []).find((record) => record.ability === 'Parallel Future');
  assert(dossierParallel?.chapter === 387 && dossierParallel?.mechanics?.includes('ten seconds ahead'), 'active canonical dossier must layer the Chapter 387 mechanics over the frozen Through386 snapshot');
  assert((dossier.successionResolvedQuestions || []).some((record) => String(record.question).includes('physically survived')), 'active dossier must record the Chapter 387 retrospective resolution of the assassination divergence mechanism');

  console.log(`Chapter 387 boundary audit passed: ${events387.length} canonical events preserve the Day 8 flashback/Day 9 coda, ten-second Parallel Future reveal, continuing-view divergence, Melody separation, and frozen 385–386 knowledge boundaries.`);
} finally {
  await vite.close();
}
