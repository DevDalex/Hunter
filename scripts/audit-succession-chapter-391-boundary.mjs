import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 391 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession391Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index390 = numbers.indexOf(390);
  assert(index390 >= 0 && numbers[index390 + 1] === 391, 'maintained publication chain must place Chapter 391 directly after Chapter 390');
  assert(numbers[numbers.indexOf(391) + 1] === 392 && numbers[numbers.indexOf(392) + 1] === 393 && numbers[numbers.indexOf(393) + 1] === 394 && numbers[numbers.indexOf(394) + 1] === 395 && numbers[numbers.indexOf(395) + 1] === 400, 'Chapter 391 must lead through maintained Chapters 392, 393, 394, and 395 before the pre-existing Chapter 400 packet');

  const chapter391 = chapterModule.succession391ChapterResearch?.[0];
  assert(chapter391?.number === 391, 'dedicated Chapter 391 research must load');
  assert(chapter391.title === null && chapter391.titleStatus === 'not-supplied-no-title-invented', 'Chapter 391 title must remain unsupplied');
  assert(chapter391.voyageDay === 'Voyage Day 10', 'Chapter 391 must retain Voyage Day 10 continuity from Chapter 390');
  assert(chapter391.chronology?.exactClockTime === null, 'Chapter 391 must not invent an exact clock time');
  assert(chapter391.coverage?.chronology === true, 'Chapter 391 maintained chronology must replace legacy-only chronology');
  assert(chapterModule.succession391TimelineEvents.length === 11, 'dedicated research must preserve all 11 maintained Chapter 391 timeline beats');

  const events391 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 391 && event.chapterRange?.end === 391);
  const eventIds = new Set(events391.map((event) => event.id));
  for (const id of [
    'event:xiyu-splits-hisoka-and-heilly-search',
    'event:bloody-mary-search-drops-thirty-forty-minutes',
    'event:hinrigh-identifies-standard-cabin-watch-route',
    'event:biohazard-camcorder-cat-surveillance',
    'event:hinrigh-heilly-rebellion-training-hypothesis',
    'event:heilly-trio-levels-types-and-nen-user-kill-value',
    'event:padaille-activates-fistful-of-weapons',
    'event:biohazard-handcuff-pigeons-restrain-padaille',
    'event:padaille-drill-escape-and-second-restraint',
    'event:hinrigh-kills-padaille-with-axe-form',
    'event:tier-3-padaille-battle',
  ]) assert(eventIds.has(id), `${id} must exist at the Chapter 391 canonical event boundary`);

  const legacyPadaille = archive.getEntityById('event:tier-3-padaille-battle');
  assert(legacyPadaille?.chapterRange?.start === 391 && legacyPadaille?.chapterRange?.end === 391, 'legacy Padaille composite must be corrected to Chapter 391 only');
  assert(/killed|kills/i.test(text(legacyPadaille)) && /Tevelares/i.test(text(legacyPadaille)) && /Quorolle/i.test(text(legacyPadaille)), 'corrected Padaille composite must preserve the death and surviving attackers');
  assert(!/Zakuro|Lynch|Room 3101|route-testing|testing routes/i.test(text(legacyPadaille)), 'legacy Padaille composite must not retain incorrect participants or Chapter 392+ route material');

  const bloody390 = archive.getAbilityKnowledgeAtChapter('ability:bloody-mary', 390);
  const bloody391 = archive.getAbilityKnowledgeAtChapter('ability:bloody-mary', 391);
  assert(bloody390?.known && !/30 to 40|30–40|search drops/i.test(text(bloody390)), 'Bloody Mary search duration must not leak into Chapter 390');
  assert(bloody391?.known && /search/i.test(text(bloody391)) && /30 to 40|30–40/i.test(text(bloody391)), 'Chapter 391 Bloody Mary knowledge must include mobile search drops and the 30–40 minute lifetime');
  assert(/ordinary blood|normal blood/i.test(text(bloody391)), 'Chapter 391 Bloody Mary knowledge must preserve reversion to ordinary blood');
  assert(!/independent intelligence|sentient|conscious/i.test(text(bloody391.summary)), 'Bloody Mary summary must not promote Zakuro’s personification into sentience');

  const body391 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 391);
  assert(body391?.known && /no new activation|does not activate/i.test(text(body391)), 'Body and Soul must explicitly remain a planned use rather than a new Chapter 391 activation');

  const hinrigh390 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 390);
  const hinrigh391 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 391);
  assert(hinrigh390?.ability?.name === 'Hinrigh Object-to-Animal Transformation', 'Chapter 390 must retain the descriptive pre-name label');
  assert(!/Biohazard|camcorder|handcuff-pigeon|handcuff pigeon/i.test(text(hinrigh390)), 'Biohazard formal name and Chapter 391 applications must not leak backward into Chapter 390');
  assert(hinrigh391?.known && hinrigh391.ability?.name === 'Biohazard', 'Chapter 391 must resolve Hinrigh’s formal ability name to Biohazard');
  assert(/camcorder/i.test(text(hinrigh391)) && /pigeon/i.test(text(hinrigh391)) && /handcuff/i.test(text(hinrigh391)), 'Biohazard Chapter 391 knowledge must preserve surveillance and restraint applications');
  assert(/aura-reinforced|reinforced with aura/i.test(text(hinrigh391)) && /standard handgun|standard bullet/i.test(text(hinrigh391)), 'Biohazard must preserve the demonstrated aura reinforcement and ordinary-bullet resistance');
  assert(/not generalized|not universal|remain unresolved/i.test(text(hinrigh391.mechanics?.limitations)), 'Biohazard must not universalize function retention or bullet resistance');

  const fist390 = archive.getAbilityKnowledgeAtChapter('ability:fistful-of-weapons', 390);
  const fist391 = archive.getAbilityKnowledgeAtChapter('ability:fistful-of-weapons', 391);
  assert(!fist390?.known, 'Fistful of Weapons must not be known before Chapter 391');
  assert(fist391?.known && /hammer/i.test(text(fist391)) && /drill/i.test(text(fist391)) && /axe/i.test(text(fist391)), 'Fistful of Weapons must preserve hammer, drill, and axe forms');
  assert(fist391.ability?.classification?.nenTypes?.includes('conjuration'), 'Fistful of Weapons must preserve Padaille’s confirmed Conjuration classification');
  assert(/not treated as a literal reincarnation|not.*literal reincarnation/i.test(text(fist391)), 'Padaille’s rebirth language must not become a literal reincarnation mechanic');

  const contagion391 = archive.getAbilityKnowledgeAtChapter('ability:contagion', 391);
  assert(contagion391?.known && /ten levels|10 levels|\+10/i.test(text(contagion391)), 'Contagion Chapter 391 knowledge must include the Nen-user +10 value');
  assert(/allocation.*unresolved|reward-allocation.*unresolved|disagree/i.test(text(contagion391)), 'Contagion multi-attacker reward allocation must remain unresolved');
  assert(/inference|not a demonstrated surveillance mechanic/i.test(text(contagion391)), 'Morena continuous monitoring must remain Quorolle’s inference');

  const padailleState = archive.getCharacterStateAtChapter('character:padaille', 391);
  const tevelaresState = archive.getCharacterStateAtChapter('character:tevelares', 391);
  const quorolleState = archive.getCharacterStateAtChapter('character:quorolle', 391);
  const hinrighState = archive.getCharacterStateAtChapter('character:hinrigh-biganduffno', 391);
  assert(padailleState?.life === 'dead' && /axe/i.test(text(padailleState)), 'Padaille character state must confirm death by his axe-form weapon');
  assert(/level 24/i.test(text(tevelaresState)) && /Enhancer/i.test(text(tevelaresState)) && /civil engineer/i.test(text(tevelaresState)), 'Tevelares state must preserve level, type, and occupation');
  assert(/level 22/i.test(text(quorolleState)) && /Emitter/i.test(text(quorolleState)) && /repairman/i.test(text(quorolleState)), 'Quorolle state must preserve level, type, and occupation');
  assert(/left hand pierced/i.test(text(hinrighState)) && /Biohazard/i.test(text(hinrighState)), 'Hinrigh state must preserve his drill injury and Biohazard operation');

  const xiYu391 = archive.getOrganizationStateAtChapter('organization:xi-yu', 391);
  const xiYu392 = archive.getOrganizationStateAtChapter('organization:xi-yu', 392);
  const heilLy391 = archive.getOrganizationStateAtChapter('organization:heil-ly', 391);
  assert(/contact/i.test(text(xiYu391)) && /Hisoka/i.test(text(xiYu391)) && /Padaille/i.test(text(xiYu391)), 'Xi-Yu Chapter 391 state must preserve the split Hisoka/Heil-Ly field operation');
  assert(/Misha|Maizan|Hisoka/i.test(text(xiYu392)) && !/Room 3101/i.test(text(xiYu392)), 'Chapter 392 Xi-Yu state must advance to Misha/Maizan/apparent-Hisoka material without leaking later Room 3101 reconnaissance');
  assert(/level 24/i.test(text(heilLy391)) && /level 22/i.test(text(heilLy391)) && /level 29/i.test(text(heilLy391)), 'Heil-Ly Chapter 391 state must preserve all three disclosed levels');
  assert(!/Room 3101|Luini/i.test(text(heilLy391)), 'Chapter 392+ Heil-Ly route and Luini developments must not leak into 391');

  const publicTimeline391 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 391);
  assert(publicTimeline391.length === chapterModule.succession391TimelineEvents.length, 'public timeline must replace legacy Chapter 391 chronology with the maintained packet');
  assert(publicTimeline391.some((event) => event.id === '391-biohazard-camcorder-cat-surveillance'), 'public timeline must include the Biohazard camcorder-cat event');
  assert(publicTimeline391.some((event) => event.id === '391-hinrigh-kills-padaille-with-axe-form'), 'public timeline must include Padaille’s death');
  assert(!publicTimeline391.some((event) => /Room 3101|Luini/i.test(text(event))), 'later lower-tier route material must not leak into the Chapter 391 public timeline');

  const dossierNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  for (const abilityName of ['Bloody Mary', 'Body and Soul', 'Biohazard', 'Contagion', 'Fistful of Weapons']) assert(dossierNames.has(abilityName), `active dossier must contain ${abilityName}`);
  assert(!dossierNames.has('Hinrigh object-to-animal transformation'), 'active dossier must retire the descriptive Hinrigh ability label after Biohazard is named');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 391')), 'active dossier must include the Chapter 391 operational group');

  const note = fs.readFileSync('docs/source-notes/chapter-391.md', 'utf8');
  assert(/Hinrigh’s hypotheses/i.test(note) || /Hinrigh.*hypotheses/i.test(note), 'source note must preserve the rebellion/training hypothesis boundary');
  assert(/Quorolle’s inference/i.test(note), 'source note must preserve the Morena-monitoring inference boundary');
  assert(/counting on Misha/i.test(note) && /does not explain|does not specify/i.test(note), 'source note must preserve Misha’s unresolved role');
  assert(/30 to 40 minutes/i.test(note), 'source note must preserve Bloody Mary’s stated search lifetime');

  console.log(`Chapter 391 boundary audit passed: ${events391.length} canonical Chapter 391 events preserve Bloody Mary’s timed search, Biohazard’s formal reveal, Heil-Ly level/type profiles, the Nen-user +10 rule, Fistful of Weapons, Padaille’s death, and hypothesis/inference boundaries.`);
} finally {
  await vite.close();
}