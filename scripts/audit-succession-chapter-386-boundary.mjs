import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 386 boundary audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession386Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index385 = numbers.indexOf(385);
  assert(index385 >= 0 && numbers[index385 + 1] === 386, 'maintained publication chain must place Chapter 386 directly after Chapter 385');

  const chapter386 = chapterModule.succession386ChapterResearch?.[0];
  assert(chapter386?.number === 386, 'dedicated Chapter 386 research must load');
  assert(chapter386.voyageDay === 'Voyage Day 9', 'Chapter 386 must remain explicitly on Voyage Day 9');
  assert(chapter386.events?.every((event) => event.time === 'Voyage Day 9'), 'Chapter 386 maintained events must not invent exact clock times');

  const parallel = archive.getAbilityDossier('ability:parallel-future', 386);
  assert(parallel?.known, 'Parallel Future must be available as an observed phenomenon at Chapter 386');
  const parallelText = JSON.stringify(parallel);
  assert(!parallelText.includes('ten-second') && !parallelText.includes('ten second') && !parallelText.includes('10-second'), 'Chapter 386 Parallel Future dossier must not leak the later ten-second rule');
  assert(parallelText.includes('luminol') || parallelText.includes('no blood'), 'Chapter 386 Parallel Future dossier must include the new forensic no-blood evidence');
  assert(parallel.knowledgeState === 'partially documented', 'Parallel Future must remain partially documented at the Chapter 386 boundary');

  const halkenburgArrow = archive.getAbilityDossier('ability:halkenburg-possession-arrow', 386);
  assert(halkenburgArrow?.known, 'Halkenburg possession-arrow dossier must be available at Chapter 386');
  assert(halkenburgArrow.ability.classification?.nenTypes?.length === 1 && halkenburgArrow.ability.classification.nenTypes[0] === 'unknown', 'Kurapika’s remote inference must not reclassify Halkenburg’s arrow as confirmed Emission');
  const halkenburgText = JSON.stringify(halkenburgArrow);
  assert(halkenburgText.includes('Sumidori') && halkenburgText.includes('Shikaku'), 'Chapter 386 arrow dossier must include the Sumidori/Shikaku experiment');
  assert(halkenburgText.includes('unresolved'), 'Chapter 386 arrow dossier must preserve unresolved consciousness topology');

  const tier2Justice = archive.getEntityById('location:black-whale:tier-2:justice-bureau');
  assert(tier2Justice?.entityType === 'location' && tier2Justice.deck === 2, 'canonical Justice Bureau must resolve to Tier 2 from Chapter 386 evidence');
  assert(!archive.getEntityById('location:black-whale:tier-1:justice-bureau'), 'legacy Tier 1 Justice Bureau record must not remain canonical');

  const events386 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 386 && event.chapterRange?.end === 386);
  const eventIds = new Set(events386.map((event) => event.id));
  for (const id of [
    'event:theta-luminol-bloodless-corpse-check',
    'event:melody-day9-justice-questioning',
    'event:halkenburg-four-consciousness-models',
    'event:shikaku-body-suicide-consciousness-test',
    'event:sumidori-body-wakes-identity-check',
    'event:kurapika-water-divination-class',
    'event:woble-tubeppa-beast-nonappearance',
    'event:tserriednich-subsecond-zetsu-target',
  ]) assert(eventIds.has(id), `${id} must be in the Chapter 386 canonical event foundation`);

  const justiceEvent = archive.getEntityById('event:melody-day9-justice-questioning');
  assert(justiceEvent?.locationIds?.includes('location:black-whale:tier-2:justice-bureau'), 'Melody’s Chapter 386 Justice event must use the corrected Tier 2 facility');
  assert(justiceEvent?.stateChanges?.some((value) => value.includes('Without You')), 'post-383 Kacho ontology must remain explicit in the Chapter 386 Justice event');

  const shikakuBodyState = chapterModule.succession386BodyStates.find((record) => record.subject === 'Shikaku');
  const sumidoriBodyState = chapterModule.succession386BodyStates.find((record) => record.subject === 'Sumidori');
  assert(shikakuBodyState?.state.includes('dead') && shikakuBodyState?.consciousness.includes('unresolved'), 'Shikaku body death must remain separate from unresolved consciousness state');
  assert(sumidoriBodyState?.state.includes('wakes') && sumidoriBodyState?.consciousness.includes('not') && sumidoriBodyState?.consciousness.includes('confirmed'), 'Sumidori original body may wake without the archive pre-answering the identity check');

  const halkenburgResearch = chapterModule.succession386HalkenburgArrowResearch;
  assert(halkenburgResearch?.shikakuConsciousnessOptions?.length === 4, 'all four Chapter 386 Shikaku consciousness models must be preserved');
  assert(halkenburgResearch?.unresolved?.some((value) => value.includes('identity-check answer')), 'identity-check answer must remain unresolved at Chapter 386');

  const beastResearch = chapterModule.succession386GuardianBeastObservationResearch;
  assert(beastResearch?.boundary?.includes('Neither explanation') && beastResearch.boundary.includes('confirmed'), 'Woble age/counterattack explanations must remain hypotheses');

  const tserriednichTraining = chapterModule.succession386TserriednichTrainingResearch;
  assert(tserriednichTraining?.target?.includes('Less than one second') && tserriednichTraining.achievedAtBoundary === false, 'sub-second Zetsu must remain a training target rather than an achieved Chapter 386 feat');

  const bodyLedgerText = JSON.stringify(dossier.bodyStateLedger || []);
  assert(bodyLedgerText.includes('Shikaku') && bodyLedgerText.includes('identity verification'), 'canonical dossier must carry the Chapter 386 body/consciousness split');

  const relationships = archive.getEntitiesByType('relationship');
  assert(relationships.some((record) => record.id === 'relationship:benjamin-halkenburg-ch386-highest-threat'), 'Benjamin’s Chapter 386 highest-threat reprioritization must be represented');
  assert(relationships.some((record) => record.id === 'relationship:halkenburg-sumidori-ch386-lethal-experiment'), 'Halkenburg/Sumidori voluntary experiment relationship must be represented');

  console.log(`Chapter 386 boundary audit passed: ${events386.length} Chapter 386 canonical events preserve Day 9 chronology, Tier 2 Justice, bloodless temporal forensics, unresolved Halkenburg consciousness topology, and bounded Nen knowledge.`);
} finally {
  await vite.close();
}
