import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 388 boundary audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession388Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index387 = numbers.indexOf(387);
  assert(index387 >= 0 && numbers[index387 + 1] === 388, 'maintained publication chain must place Chapter 388 directly after Chapter 387');

  const chapter388 = chapterModule.succession388ChapterResearch?.[0];
  assert(chapter388?.number === 388, 'dedicated Chapter 388 research must load');
  assert(chapter388.title === null && chapter388.titleStatus === 'not-supplied-no-title-invented', 'Chapter 388 title must remain unsupplied rather than invented');
  assert(chapter388.chronology?.opening?.includes('Voyage Day 9'), 'Chapter 388 must continue the Room 1014 class on Day 9');
  assert(chapter388.chronology?.endpoint?.includes('Voyage Day 10') && chapter388.chronology?.exactEndpointTime === '11:30 a.m.', 'Chapter 388 must preserve the exact Day 10 11:30 a.m. endpoint');

  const classResearch = chapterModule.succession388NenClassResearch;
  assert(JSON.stringify(classResearch.awakenedThatDay) === JSON.stringify(['Ladiolus', 'Maor', 'Yuri', 'Satobi']), 'the supplied note must preserve all four students awakened that day');
  assert(classResearch.ladiolus?.resultDisclosure?.includes('not supplied'), 'Ladiolus Nen type must not be invented');

  const bill = archive.getEntityById('ability:bill-growth-ability');
  assert(bill?.classification?.nenTypes?.includes('enhancement'), 'Bill’s directly stated Enhancement classification must enter the ability foundation');
  assert(bill?.firstChapter === 388 && bill?.latestChapter === 388, 'Bill growth ability must first enter the maintained ability foundation at Chapter 388');
  const billText = JSON.stringify(bill);
  assert(/seed/i.test(billText) && /growth/i.test(billText), 'Bill ability must preserve the demonstrated seed-growth effect');
  const billPositiveClaimText = JSON.stringify({ summary: bill?.summary, activation: bill?.activation, targets: bill?.targets, knownUses: bill?.knownUses });
  assert(!/regeneration|aging/i.test(billPositiveClaimText), 'Bill ability must not positively claim regeneration or aging mechanics');
  assert((bill?.limitations || []).some((value) => /does not by itself establish/i.test(value) && /regeneration/i.test(value) && /aging/i.test(value)), 'Bill ability must explicitly preserve the regeneration/aging non-inference boundary');

  const dolphin = archive.getEntityById('ability:stealth-dolphin');
  assert(dolphin?.latestChapter === 388 && dolphin?.sourceChapterNumbers?.includes(388), 'Stealth Dolphin must extend through its explicit Chapter 388 use');
  const dolphinText = JSON.stringify(dolphin);
  assert(/Yuri/.test(dolphinText) && /borrowed/i.test(dolphinText), 'Stealth Dolphin must preserve Yuri’s borrowed-ability loan and ownership boundary');

  const events388 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 388 && event.chapterRange?.end === 388);
  const eventIds = new Set(events388.map((event) => event.id));
  for (const id of [
    'event:room-1014-awakened-students-and-gag-order',
    'event:bill-growth-ability-demonstration',
    'event:stealth-dolphin-growth-loan-awakening',
    'event:bill-woble-assignment-resolve-reveal',
    'event:tubeppa-authorizes-woble-alliance-negotiation',
    'event:rihan-reassesses-tubeppa-halkenburg-kurapika',
    'event:fourth-halkenburg-thread-aura-rumbling',
  ]) assert(eventIds.has(id), `${id} must be in the Chapter 388 canonical event foundation`);

  const pulse = archive.getEntityById('event:fourth-halkenburg-thread-aura-rumbling');
  assert(pulse?.chronology?.day === 10 && pulse?.chronology?.timeOfDay === '11:30', 'fourth aura rumbling must preserve Day 10 at 11:30');
  assert(pulse?.outcomes?.some((value) => /four/i.test(value)) && pulse?.outcomes?.some((value) => /shorten/i.test(value)), 'fourth pulse must preserve count and shortening intervals');

  const relationship = archive.getEntityById('relationship:tubeppa-woble-ch388-alliance-negotiation');
  assert(relationship?.subtype === 'alliance-negotiation' && relationship?.chapterRange?.start === 388, 'Tubeppa/Woble relation must begin as negotiation in Chapter 388');
  assert(relationship?.chapterRange?.end === 400, 'Chapter 388 negotiation state must stop before later Chapter 401 formal alliance state');

  const hypothesisText = JSON.stringify(chapterModule.succession388ObserverHypotheses);
  assert(/hypothesis only|risk assessment only|Rejected speculation/i.test(hypothesisText), 'Babimyna, Rihan, and Balsamilco theories must remain explicitly epistemic rather than canonical mechanics');
  const globalAbilityText = JSON.stringify(archive.getEntitiesByType('ability'));
  assert(!/one ability per.*right-hand finger/i.test(globalAbilityText), 'Babimyna’s one-ability-per-finger theory must not become a global ability fact');

  const tubeppa = chapterModule.succession388TubeppaResearch;
  assert(tubeppa.heisenExperiment?.boundary?.includes('hypothesis'), 'Tubeppa’s Heisen development idea must remain a hypothesis');
  assert(tubeppa.saleSaleAssessment?.status?.includes('deductions'), 'Tubeppa’s Salé-salé and Benjamin conclusions must remain her deductions');

  const aura = chapterModule.succession388AuraRumblingResearch;
  assert(aura.occurrence === 4 && aura.time === '11:30 a.m.', 'dedicated aura research must preserve fourth occurrence and exact endpoint time');
  assert(aura.attributionBoundary?.includes('does not itself supply a new attacker, target'), 'Chapter 388 must not invent the fourth pulse attacker or target');

  const dossierBill = (dossier.successionAbilities || []).find((record) => record.ability === 'Bill’s Growth Ability');
  assert(dossierBill?.chapter === 388 && dossierBill?.type?.includes('Enhancement'), 'active canonical dossier must layer Bill’s Chapter 388 growth ability over the frozen Through387 snapshot');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 388')), 'active dossier must include the Chapter 388 operational group');

  console.log(`Chapter 388 boundary audit passed: ${events388.length} canonical events preserve the Room 1014 awakening procedure, Bill growth ability, Stealth Dolphin loan, Tubeppa negotiation state, character-hypothesis boundaries, and Day 10 11:30 fourth aura pulse.`);
} finally {
  await vite.close();
}
