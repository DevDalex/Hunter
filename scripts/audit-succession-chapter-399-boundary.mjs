import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 399 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession399Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index398 = numbers.indexOf(398);
  assert(index398 >= 0 && numbers[index398 + 1] === 399, 'maintained publication chain must place Chapter 399 directly after 398');

  const chapter399 = chapterModule.succession399ChapterResearch?.[0];
  assert(chapter399?.number === 399, 'Chapter 399 maintained research must load');
  assert(chapter399.events?.length === 20, 'Chapter 399 maintained research must preserve all 20 chapter beats');
  assert(/Day 10/i.test(text(chapter399)) || /Voyage Day 10/i.test(text(chapter399)), 'Chapter 399 must remain on Voyage Day 10');

  const projected399 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 399 && event.chapterRange?.end === 399 && event.maintainedResearch === true);
  const dedicated399 = archive.getEntitiesByType('event').filter((event) => String(event.id || '').startsWith('event:chapter399-') && !event.maintainedResearch);
  assert(projected399.length === 20, 'story intelligence must project all 20 maintained Chapter 399 beats');
  assert(dedicated399.length === 20, 'Chapter 399 must expose 20 dedicated canonical events');

  const roomA = archive.getEntityById('location:black-whale:tier-2:heil-ly-hideout:room-a');
  const roomB = archive.getEntityById('location:black-whale:tier-2:heil-ly-hideout:room-b');
  const gathering = archive.getEntityById('location:black-whale:tier-2:heil-ly-hideout:gathering-room');
  assert(roomA && roomB && gathering, 'Chapter 399 must expose the hideout gathering-room topology');

  const nobunaga = archive.getCharacterStateAtChapter('character:nobunaga-hazama', 399);
  const hinrigh = archive.getCharacterStateAtChapter('character:hinrigh-biganduffno', 399);
  assert(/Yokotani|guards|LSDF|counter/i.test(text(nobunaga)), 'Nobunaga Chapter 399 state must retain the hideout-defense confrontation');
  assert(/oyster|transmitter|Biohazard/i.test(text(hinrigh)), 'Hinrigh Chapter 399 state must retain the transmitter-oyster operation');

  const sweetHome = archive.getEntityById('ability:terebellum-damage-sweet-home');
  assert(sweetHome?.firstChapter === 399 && sweetHome?.latestChapter === 399, 'Sweet Home must first appear at Chapter 399');
  assert((sweetHome.ownerIds || []).includes('character:terebellum'), 'Sweet Home owner must be Terebellum');
  assert(sweetHome.classification?.nenTypes?.includes('emission'), 'Sweet Home must be classified as Emission');
  assert(/right hand/i.test(text(sweetHome)) && /left hand/i.test(text(sweetHome)), 'Sweet Home must preserve right-hand intake and left-hand transfer');
  assert(/moment/i.test(text(sweetHome)) && /damage/i.test(text(sweetHome)), 'Sweet Home must preserve moment-of-damage contact timing');
  assert(/bears|receives.*himself|himself.*damage/i.test(text(sweetHome)), 'Sweet Home must preserve Terebellum self-cost when damage is not transferred');
  assert(/blade|katana tip|attacking material/i.test(text(sweetHome)), 'Sweet Home must preserve attacking-material displacement');
  assert(/unresolved|unknown/i.test(text(sweetHome)) && !/healing ability|heals damage/i.test(text(sweetHome)), 'Sweet Home must not invent healing or complete limits');

  const sweet398 = archive.getAbilityKnowledgeAtChapter('ability:terebellum-damage-sweet-home', 398);
  const sweet399 = archive.getAbilityKnowledgeAtChapter('ability:terebellum-damage-sweet-home', 399);
  assert(!sweet398?.known && sweet399?.known, 'Sweet Home knowledge must begin at Chapter 399');
  assert(/right hand/i.test(text({ summary: sweet399.summary, mechanics: sweet399.mechanics })) && /left hand/i.test(text({ summary: sweet399.summary, mechanics: sweet399.mechanics })), 'Chapter 399 Sweet Home knowledge must expose the bilateral contact rules');

  const lsdf = archive.getEntityById('ability:yokotani-battle-of-wits-lsdf');
  assert(lsdf?.firstChapter === 399 && lsdf?.latestChapter >= 399, 'LSDF must first appear at Chapter 399 even when later chapters extend its latest-known state');
  assert((lsdf.ownerIds || []).includes('character:yokotani'), 'LSDF owner must be Yokotani');
  assert(lsdf.classification?.nenTypes?.includes('conjuration'), 'LSDF must be classified as Conjuration');
  assert(/only.*hideout.*Morena|hideout where Morena/i.test(text(lsdf)), 'LSDF must preserve the Morena-hideout location condition');
  assert(/identif/i.test(text(lsdf)) && /law|crime/i.test(text(lsdf)), 'LSDF must preserve Yokotani identity/law-breaking activation');
  assert(/seven guards/i.test(text(lsdf)) && /alert level 4|alert.*4/i.test(text(lsdf)) && /maximum alert/i.test(text(lsdf)), 'LSDF must preserve the seven-guard alert 4 to maximum-alert demonstration');
  assert(/cannot harm|cannot.*harm/i.test(text(lsdf)) && /attacks.*ineffective|ineffective.*attacks/i.test(text(lsdf)), 'LSDF must preserve its defensive non-harm / attack-ineffectiveness rule');
  assert(/autopilot/i.test(text(lsdf)), 'LSDF must preserve Nobunaga’s automatic-guard observation');
  assert(/Hinrigh.*infer|visual.*not independently|cannot see.*infer/i.test(text(lsdf)), 'Yokotani visual-access limit must remain Hinrigh inference');
  assert(/does not.*LSDF.*create|not.*LSDF.*route|does not prove.*LSDF/i.test(text(lsdf)), 'LSDF must not be assigned ownership of the pre-existing Room 3101 route');

  const lsdf398 = archive.getAbilityKnowledgeAtChapter('ability:yokotani-battle-of-wits-lsdf', 398);
  const lsdf399 = archive.getAbilityKnowledgeAtChapter('ability:yokotani-battle-of-wits-lsdf', 399);
  assert(!lsdf398?.known && lsdf399?.known, 'LSDF knowledge must begin at Chapter 399');

  const publicTimeline399 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 399 && event.maintainedResearch);
  assert(publicTimeline399.length === 20, 'public timeline must expose all 20 maintained Chapter 399 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 399/.test(group.group || '')), 'active dossier must retain the Chapter 399 modernization group');

  console.log(`Chapter 399 boundary audit passed: ${dedicated399.length} dedicated canonical events plus ${projected399.length} maintained projections preserve Sweet Home, LSDF, hideout topology, Biohazard tracking, and the Chapter 399 knowledge boundary even when later chapters extend those ability records.`);
} finally {
  await vite.close();
}
