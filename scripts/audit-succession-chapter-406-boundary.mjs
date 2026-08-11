import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 406 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-406.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession406Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen405Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough405.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen405Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough405.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index405 = numbers.indexOf(405);
  assert(index405 >= 0 && numbers[index405 + 1] === 406 && numbers[index405 + 2] === 408, 'maintained publication chain must be 405 → 406 → 408 while Chapter 407 remains absent from maintained research');

  const chapter406 = chapterModule.succession406ChapterResearch?.[0];
  assert(chapter406?.number === 406, 'Chapter 406 maintained research must load');
  assert(chapter406.title === null && /not-supplied/i.test(chapter406.titleStatus), 'Chapter 406 must not backfill the legacy title from outside the current packet');
  assert(chapter406.chronology?.presentDay === true && chapter406.chronology?.spansDays?.[0] === 12, 'Chapter 406 must remain on the Day 12 funeral-procession chronology');
  assert(chapterModule.succession406TimelineEvents.length === 32, 'maintained research must preserve all 32 Chapter 406 beats');

  const events406 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 406 && event.chapterRange?.end === 406);
  const projected406 = events406.filter((event) => event.maintainedResearch === true);
  const dedicated406 = events406.filter((event) => String(event.id || '').startsWith('event:chapter406-') && !event.maintainedResearch);
  assert(projected406.length === 32, 'story intelligence must project all 32 maintained Chapter 406 beats');
  assert(dedicated406.length === 32, 'Chapter 406 must expose 32 dedicated canonical events');

  const frozenRoute = frozen405Archive.personnelTransitions?.find((record) => /Tajao \/ Ken|Tajao \/ Nobunaga|Tajao/.test(record.subject || '') && String(record.chapters) === '405');
  const outer = archive.getEntityById('location:black-whale:outermost-pipe-stair-chamber');
  const waste = archive.getEntityById('location:black-whale:intertier-4-5:waste-processing-plant');
  const heillyProcessing = archive.getEntityById('location:black-whale:tier-2:heil-ly-hideout:processing-area');
  assert(outer && /outermost/i.test(text(outer)) && /Tier 2/i.test(text(outer)), 'Chapter 406 must resolve the Chapter 405 door into the outer pipe/stair route toward Tier 2');
  assert(waste && heillyProcessing && waste.id !== heillyProcessing.id, 'waste/sewage plant and Heil-Ly processing area must remain separate canonical locations');
  assert(/between Tiers 4 and 5|intertier/i.test(text(waste)) && /distinct/i.test(text(waste)), 'waste-processing location must preserve its inter-tier and non-Heil-Ly-processing distinction');
  assert(!frozen405Archive.publicationBoundary406, 'frozen Through405 archive must remain unaware of the Chapter 406 publication boundary');
  assert(activeArchive.publicationBoundary406?.chapter === 406, 'active archive must advance to Through406');
  assert(!frozenRoute || /unresolved|unrevealed|threshold/i.test(text(frozenRoute)), 'Through405 route record must remain frozen at the unrevealed-door boundary');

  const contractorTheory = archive.getEntityById('event:chapter406-heilly-waste-contractor-killing-pipeline-theory');
  const heilly406 = archive.getOrganizationStateAtChapter('organization:heil-ly', 406);
  assert(/theory|does not demonstrate|not.*confirmed/i.test(text(contractorTheory)), 'Heil-Ly waste-contractor pipeline must remain a theory');
  assert(/theory/i.test(text(heilly406)) && !/confirmed.*subcontractor|operates.*subcontractor.*confirmed/i.test(text(heilly406)), 'Heil-Ly organization state must not promote the contractor theory to fact');

  const lsdf406 = archive.getAbilityKnowledgeAtChapter('ability:yokotani-battle-of-wits-lsdf', 406);
  assert(/Nobunaga/i.test(text(lsdf406)) && /counteractive|defense/i.test(text(lsdf406)), 'Chapter 406 must retain Nobunaga’s LSDF operational recap');
  assert(/self-defense/i.test(text(lsdf406)) && /untested|not tested/i.test(text(lsdf406)), 'Feitan’s self-defense idea must remain untested');

  const biohazard406 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 406);
  assert(/transmitter/i.test(text(biohazard406)) && /revert/i.test(text(biohazard406)), 'Biohazard knowledge must include the hidden transmitter’s Chapter 406 reversion');
  assert(/exact.*duration.*not|duration.*not supplied|exact elapsed/i.test(text(biohazard406)), 'Biohazard reversion must not invent an exact universal duration');

  const lynch405 = archive.getCharacterStateAtChapter('character:lynch-fullbokko', 405);
  const lynch406 = archive.getCharacterStateAtChapter('character:lynch-fullbokko', 406);
  const hinrigh406 = archive.getCharacterStateAtChapter('character:hinrigh-biganduffno', 406);
  const zakuro406 = archive.getCharacterStateAtChapter('character:zakuro-custard', 406);
  assert(lynch405?.life === 'dead' && /method.*unsupplied|exact killing method/i.test(text(lynch405)), 'Chapter 405 must remain frozen before corpse-recovery method evidence');
  assert(lynch406?.life === 'dead' && /recovered/i.test(text(lynch406)) && /neck/i.test(text(lynch406)) && /Bonolenov/i.test(text(lynch406)), 'global Chapter 406 Lynch state must combine the Chapter 405 killer resolution with the newly recovered body condition');
  assert(/fake|impostor/i.test(text(hinrigh406)) && !/Bonolenov/i.test(text(hinrigh406)), 'Hinrigh must infer a fake-Hisoka culprit without reader-only Bonolenov knowledge');
  assert(/fake|transformation|Manipulation|impostor/i.test(text(zakuro406)) && !/Bonolenov/i.test(text(zakuro406)), 'Zakuro must remain unaware of Bonolenov while reconstructing the deception');

  const loveDial = archive.getEntityById('ability:love-dial-6700-disgusting-telephone');
  const loveDialKnowledge = archive.getAbilityKnowledgeAtChapter('ability:love-dial-6700-disgusting-telephone', 406);
  assert(loveDial?.name === 'Love Dial 6700 - Disgusting Telephone', 'supplied translated phone-ability label must be retained');
  assert(/6.*20 digit|6–20 digit/i.test(text(loveDialKnowledge)), 'Love Dial knowledge must retain the translated 6–20 digit number rule');
  assert(/McGait Narumi/i.test(text(loveDialKnowledge)) && /unresolved|unknown/i.test(text(loveDialKnowledge)), 'McGait Narumi text must remain unresolved rather than becoming an invented original owner');
  assert(/finite|limited/i.test(text(loveDialKnowledge)) && !/exact.*(?:[0-9]+).*calls/i.test(text(loveDialKnowledge)), 'daily calls must be finite without inventing an exact count');

  const chrollo406 = archive.getCharacterStateAtChapter('character:chrollo-lucilfer', 406);
  assert(/Seed Urn/i.test(text(chrollo406)) && /Lotus Anchorite/i.test(text(chrollo406)) && /Sword of Good Omens/i.test(text(chrollo406)), 'Chrollo state must identify all three sacred treasures');
  assert(/national-treasure/i.test(text(chrollo406)) && /prerequisite/i.test(text(chrollo406)) && /unidentified ability|ability.*unidentified/i.test(text(chrollo406)), 'Chrollo state must preserve the Skill Hunter national-treasure prerequisite and unidentified desired ability');
  assert(/theor/i.test(text(chrollo406)) && /Tier 1/i.test(text(chrollo406)), 'Tier 1 regalia storage/system claims must remain Chrollo theories');
  assert(/alternative/i.test(text(chrollo406)) && /Spider/i.test(text(chrollo406)), 'Chrollo state must preserve the unspecified Spider continuity alternative');

  const funeralStart = archive.getEntityById('event:chapter406-halkenburg-funeral-procession-begins');
  const finalCall = archive.getEntityById('event:chapter406-chrollo-final-call-target-above-signal-range');
  assert(/begins|casket/i.test(text(funeralStart)), 'Chapter 406 must advance the funeral from upcoming to underway');
  assert(/above/i.test(text(finalCall)) && /exact tier|identity.*unknown|identity.*remain/i.test(text(finalCall)), 'final call must narrow the target above Tier 3 without inventing identity or exact tier');

  const publicTimeline406 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 406 && event.maintainedResearch);
  assert(publicTimeline406.length === 32, 'public timeline must expose all 32 maintained Chapter 406 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 406/.test(group.group || '')), 'active dossier must include the Chapter 406 modernization group');
  assert(!(frozen405Dossier.guardAssignmentGroups || []).some((group) => /Chapter 406/.test(group.group || '')), 'frozen Through405 dossier must remain unaware of Chapter 406');
  const frozenMysteryIds = new Set((frozen405Dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession406Mysteries.every((record) => !frozenMysteryIds.has(record.id)), 'frozen Through405 dossier must not contain Chapter 406 mysteries');
  assert(chapterModule.succession406Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every Chapter 406 mystery');

  assert(/sole substantive.*story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the current supplied synopsis as sole substantive story source');
  assert(/No Chapter 406 title|no Chapter 406 title/i.test(sourceNote), 'source note must explain the unsupplied-title boundary');
  assert(/distinct from.*Heil-Ly processing area|separate.*Heil-Ly processing area/i.test(sourceNote), 'source note must separate the two processing-area concepts');
  assert(/Hinrigh.*does not know|Hinrigh.*do not know|Hinrigh and Zakuro.*do not/i.test(sourceNote), 'source note must preserve the Lynch-killer knowledge-state split');
  assert(/Chapter 407\+|407\+/.test(sourceNote), 'source note must quarantine Chapter 407+ outcomes');

  console.log(`Chapter 406 boundary audit passed: ${dedicated406.length} dedicated events plus ${projected406.length} maintained projections preserve the outer-route infrastructure, waste-theory boundary, Biohazard/LSDF updates, Lynch reader-vs-character knowledge split, Love Dial/regalia/Skill Hunter rules, funeral start, and Chapter 407+ spoiler firewall.`);
} finally {
  await vite.close();
}
