import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 390 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession390Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index389 = numbers.indexOf(389);
  assert(index389 >= 0 && numbers[index389 + 1] === 390, 'maintained publication chain must place Chapter 390 directly after Chapter 389');
  assert(numbers[numbers.indexOf(390) + 1] === 400, 'Chapter 390 must remain before the pre-existing Chapter 400 maintained packet');

  const chapter390 = chapterModule.succession390ChapterResearch?.[0];
  assert(chapter390?.number === 390, 'dedicated Chapter 390 research must load');
  assert(chapter390.title === null && chapter390.titleStatus === 'not-supplied-no-title-invented', 'Chapter 390 title must remain unsupplied');
  assert(chapter390.voyageDay === 'Voyage Day 10', 'Chapter 390 must retain Voyage Day 10 continuity from the Chapter 389 handoff');
  assert(chapter390.chronology?.exactClockTime === null, 'Chapter 390 must not invent an exact clock time');
  assert(chapter390.coverage?.chronology === true, 'Chapter 390 maintained chronology must replace the legacy timeline record');

  const events390 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 390 && event.chapterRange?.end === 390);
  const eventIds = new Set(events390.map((event) => event.id));
  for (const id of [
    'event:coventoba-coin-same-aura-comparison',
    'event:zhang-lei-consults-onior-about-nen',
    'event:onior-expands-xiyu-hisoka-morena-operation',
    'event:xiyu-team-confronts-heilly-tier3',
    'event:bloody-mary-body-and-soul-first-ch390-demonstration',
    'event:heilly-tier3-civilian-registration-revealed',
    'event:hinrigh-transforms-soldier-guns-into-snakes',
  ]) assert(eventIds.has(id), `${id} must be in the Chapter 390 canonical event foundation`);

  const coin389 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 389);
  const coin390 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 390);
  assert(coin389?.known && /1 to 10/i.test(text(coin389)), 'Chapter 389 must retain the first 1-to-10 observation');
  assert(!/same aura/i.test(text(coin389)), 'Chapter 390 same-aura observation must not leak backward into Chapter 389');
  assert(coin390?.known && /same aura/i.test(text(coin390)), 'Chapter 390 coin knowledge must include same-aura continuity');
  assert(/separate coin.*1|coin still displays 1/i.test(text(coin390)), 'Chapter 390 coin knowledge must preserve Tenftory’s separate 1 coin comparison');
  assert(/does not|unknown|unresolved/i.test(text(coin390.mechanics?.limitations)), 'Chapter 390 coin causal mechanics must remain unresolved');
  assert(!/ten-day|daily multiplication|activation at 100/i.test(text(coin390)), 'later coin-system hypotheses must not leak into Chapter 390');

  const beast390 = archive.getGuardianBeastStateAtChapter('guardian-beast:zhang-lei', 390);
  assert(/same-aura|same aura/i.test(text(beast390)), 'Zhang Lei Guardian Spirit Beast state must expose same-aura continuity at 390');
  assert(/unresolved/i.test(text(beast390)), 'Zhang Lei Guardian Spirit Beast state must keep the coin effect unresolved');

  const bloody389 = archive.getAbilityKnowledgeAtChapter('ability:bloody-mary', 389);
  const bloody390 = archive.getAbilityKnowledgeAtChapter('ability:bloody-mary', 390);
  assert(!bloody389?.known, 'Bloody Mary must not be available before Chapter 390');
  assert(bloody390?.known && /blood/i.test(text(bloody390)) && /subdu/i.test(text(bloody390)), 'Bloody Mary must preserve the demonstrated blood-linked subdual');
  assert(/unknown|unresolved/i.test(text(bloody390.mechanics?.limitations)), 'Bloody Mary complete mechanics must remain unresolved');

  const body389 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 389);
  const body390 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 390);
  assert(!body389?.known, 'Body and Soul must not be available before Chapter 390');
  assert(body390?.known && /question|interrog/i.test(text(body390)), 'Body and Soul must preserve the demonstrated interrogation effect');
  assert(!/universal truth|always tells the truth|cannot lie/i.test(text(body390.summary)), 'Body and Soul must not be promoted into an unsupported universal truth rule');

  const hinrigh389 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 389);
  const hinrigh390 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 390);
  assert(!hinrigh389?.known, 'Hinrigh transformation ability must not be available before Chapter 390');
  assert(hinrigh390?.known && /snake/i.test(text(hinrigh390)) && /gun/i.test(text(hinrigh390)), 'Hinrigh Chapter 390 knowledge must preserve the gun-to-snake demonstration');
  assert(/formal ability name.*not supplied|formal name.*unsupplied/i.test(text(hinrigh390)), 'Hinrigh formal ability name must remain unsupplied at the Chapter 390 boundary');

  const zhangOnior = archive.getEntityById('relationship:zhang-lei-onior-father-son');
  assert(zhangOnior?.relationshipType === 'family' && /father/i.test(text(zhangOnior)), 'Zhang Lei and Onior father-son relationship must be represented canonically');
  const xiYuTroupe = archive.getEntityById('relationship:xi-yu-phantom-troupe-ch390-controlled-access');
  assert(xiYuTroupe?.relationshipType === 'alliance' && xiYuTroupe?.sentiment === 'mixed', 'Xi-Yu/Troupe access must remain tactical mixed cooperation rather than trust');

  const xiYuStates = archive.successionArchiveData?.organizationStateProfiles?.['organization:xi-yu'] || [];
  const xiYu390 = xiYuStates.find((record) => record.chapterRange.start <= 390 && (record.chapterRange.end ?? Infinity) >= 390);
  assert(xiYu390 && /Hisoka/i.test(text(xiYu390)) && /Morena/i.test(text(xiYu390)) && /Tier 4/i.test(text(xiYu390)), 'Xi-Yu Chapter 390 state must preserve the expanded hunt and controlled Tier 4 access');

  const heilLyStates = archive.successionArchiveData?.organizationStateProfiles?.['organization:heil-ly'] || [];
  const heilLy390 = heilLyStates.find((record) => record.chapterRange.start <= 390 && (record.chapterRange.end ?? Infinity) >= 390);
  assert(heilLy390 && /civilian/i.test(text(heilLy390)), 'Heil-Ly Chapter 390 state must preserve encountered civilian registration');
  assert(!/Padaille|Room 3101|Luini/i.test(text(heilLy390)), 'Chapter 391+ Heil-Ly developments must not leak into the Chapter 390 organization state');

  const publicTimeline390 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 390);
  assert(publicTimeline390.length === chapterModule.succession390TimelineEvents.length, 'public timeline must replace the legacy Chapter 390 events with the maintained chronology');
  assert(publicTimeline390.some((event) => event.id === '390-coventoba-coin-aura-continuity'), 'public timeline must include the maintained Coventoba coin event');
  assert(!publicTimeline390.some((event) => /Four students|Nen class produces newly awakened|Ladiolus|Maor|Yuri|Satobi/i.test(text(event))), 'legacy Chapter 390 Nen-class misattribution must be removed from the public timeline surface');

  const dossierNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  assert(dossierNames.has('Bloody Mary') && dossierNames.has('Body and Soul') && dossierNames.has('Hinrigh object-to-animal transformation') && dossierNames.has('Zhang Lei’s Guardian Coins'), 'active dossier must layer all Chapter 390 ability records');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 390')), 'active dossier must include the Chapter 390 operational group');

  const note = fs.readFileSync('docs/source-notes/chapter-390.md', 'utf8');
  assert(/same aura/i.test(note) && /Tenftory/i.test(note), 'source note must preserve the coin continuity and comparison boundary');
  assert(/formal name of Hinrigh’s ability/i.test(note) && /descriptive label/i.test(note) && /rather than inventing an official ability name/i.test(note), 'source note must preserve Hinrigh’s unnamed-ability boundary');
  assert(/civilians rather than Mafia/i.test(note), 'source note must preserve the Heil-Ly civilian-registration boundary');

  console.log(`Chapter 390 boundary audit passed: ${events390.length} canonical events preserve Zhang Lei coin continuity, Onior/Xi-Yu command, Heil-Ly civilian cover, Bloody Mary, Body and Soul, and Hinrigh’s unnamed gun-to-snake transformation.`);
} finally {
  await vite.close();
}
