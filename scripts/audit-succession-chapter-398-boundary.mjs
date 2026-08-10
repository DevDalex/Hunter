import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 398 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession398Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen397 = await vite.ssrLoadModule('/src/data/successionDossierThrough397.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index397 = numbers.indexOf(397);
  assert(index397 >= 0 && numbers[index397 + 1] === 398 && numbers[index397 + 2] === 399 && numbers[index397 + 3] === 400, 'maintained publication chain must place Chapter 398 before Chapter 399 and the pre-existing Chapter 400 packet');

  const chapter398 = chapterModule.succession398ChapterResearch?.[0];
  assert(chapter398?.number === 398, 'dedicated Chapter 398 research must load');
  assert(chapter398.title === null && chapter398.titleStatus === 'not-supplied-no-title-invented', 'Chapter 398 title must remain unsupplied');
  assert(chapter398.voyageDay === 'Voyage Day 10', 'Chapter 398 must remain Voyage Day 10 present-day action');
  assert(chapter398.chronology?.exactClockTime === null, 'Chapter 398 must not invent an exact clock time');
  assert(chapter398.chronology?.presentDay === true && chapter398.chronology?.flashback === false, 'Chapter 398 must return to present-day action rather than extend the Meteor City flashback');
  assert(chapterModule.succession398TimelineEvents.length === 13, 'dedicated research must preserve all 13 maintained Chapter 398 beats');

  const events398 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 398 && event.chapterRange?.end === 398);
  const eventIds = new Set(events398.map((event) => event.id));
  const dedicatedEventIds = [
    'event:room3101-first-hostage-front-door-test',
    'event:room3101-second-hostage-teleport-repeat',
    'event:troupe-debates-barrier-land-mine-trap',
    'event:hinrigh-prepares-transmitter-oyster',
    'event:hinrigh-enters-heilly-teleport-trap',
    'event:receiver-distance-band-troupe-triangulation',
    'event:hinrigh-arrives-heilly-hideout-blood-sounds',
    'event:nobunaga-follows-hinrigh-coop',
    'event:nobunaga-tests-self-restoring-hideout-wall',
    'event:hinrigh-nobunaga-sweep-shower-bathroom',
    'event:hinrigh-nobunaga-find-three-toilets',
    'event:hinrigh-nobunaga-open-laundry-room',
    'event:morena-smiles-during-hideout-intrusion',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 398 canonical boundary`);
  const projected398 = events398.filter((event) => event.maintainedResearch === true);
  assert(projected398.length === 13, 'story intelligence must project all 13 maintained Chapter 398 research beats');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 398 events must remain distinct from maintained-research projections');
  for (const id of dedicatedEventIds) assert(archive.getEntityById(id)?.chronology?.day === 10, `${id} must remain Voyage Day 10`);

  const firstTest = archive.getEntityById('event:room3101-first-hostage-front-door-test');
  const secondTest = archive.getEntityById('event:room3101-second-hostage-teleport-repeat');
  assert(/bathroom|bypass/i.test(text(firstTest)) && /does not teleport|no teleport/i.test(text(firstTest)), 'first hostage must preserve the bathroom-side non-trigger');
  assert(/front door|front-door/i.test(text(firstTest)) && /re-enter|reenter|enter.*front/i.test(text(firstTest)) && /disappear|teleport/i.test(text(firstTest)), 'first hostage must preserve front-door inward activation');
  assert(/second/i.test(text(secondTest)) && /disappear|teleport/i.test(text(secondTest)), 'second hostage must establish repeated activation');
  assert(!/unlimited|infinite/i.test(text(firstTest) + text(secondTest)), 'repeated activation must not become unlimited-use canon');

  const trap = archive.getEntityById('ability:heil-ly-front-door-teleport-trap');
  assert(trap?.firstChapter === 398 && trap?.latestChapter >= 398, 'descriptive front-door trap ability must enter at Chapter 398 even when later chapters extend the live entity');
  assert(trap.classification?.nenTypes?.includes('unknown'), 'front-door trap category must remain unknown');
  assert((trap.ownerIds || []).length === 0, 'front-door trap user must remain unassigned');
  assert(/Gateaume/i.test(text(trap)) && /not.*prove|does not.*prove|unresolved|not.*assign/i.test(text(trap)), 'Gateaume relationship to the trap must remain unresolved');
  assert(/exact trigger|switch geometry|boundary/i.test(text(trap)) && /unresolved|unknown|does not prove/i.test(text(trap)), 'exact trigger geometry must remain unresolved');

  const trapTheory = archive.getEntityById('event:troupe-debates-barrier-land-mine-trap');
  assert(/barrier/i.test(text(trapTheory)) && /land-mine|land mine/i.test(text(trapTheory)), 'barrier/land-mine system exposition must be preserved');
  assert(/two or three|2 or 3|2–3/i.test(text(trapTheory)), 'land-mine exposition must preserve the rough two-or-three-location limit');
  assert(/infer|deduc|theor|guess|not.*confirm/i.test(text(trapTheory)), 'application of land-mine theory to this trap must remain character analysis');

  const bio397 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 397);
  const bio398 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 398);
  assert(bio397?.known && bio398?.known, 'Biohazard must be known at both Chapter 397 and Chapter 398 boundaries');
  assert(!/oyster|two hours|2 hours|one kilometer|1 kilometer|aura depletion|depends on object size/i.test(text({ summary: bio397.summary, mechanics: bio397.mechanics })), 'Chapter 398 Biohazard transmitter mechanics must not leak backward into Chapter 397');
  assert(/oyster/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })) && /aura depletion|aura.*deplet/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })), 'Chapter 398 Biohazard knowledge must preserve transmitter-oyster and aura-depletion reversion');
  assert(/two hours|2 hours/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })) && /size/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })), 'Chapter 398 Biohazard knowledge must preserve size-dependent duration and the roughly two-hour use-specific estimate');
  assert(/one kilometer|1 kilometer/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })) && /altitude/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })), 'Chapter 398 Biohazard tracking knowledge must preserve receiver radius and altitude limitation');
  assert(/not a universal|not.*universal|no.*universal/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })), 'Biohazard knowledge must not universalize the oyster duration estimate');
  const bioEntity = archive.getEntityById('ability:hinrigh-object-animal-transformation');
  assert(bioEntity?.latestChapter >= 398, 'current Biohazard entity must include Chapter 398 even when later chapters extend the live entity');

  const receiver = archive.getEntityById('event:receiver-distance-band-troupe-triangulation');
  assert(/500.*1,000|500.*1000/i.test(text(receiver)), 'receiver event must preserve the broad 500–1,000 meter band');
  assert(/not.*precise|does not.*precise|exact.*unresolved/i.test(text(receiver)), 'receiver reading must not become an exact coordinate');

  const wall = archive.getEntityById('ability:heil-ly-self-restoring-hideout-stage');
  assert(wall?.firstChapter === 398, 'self-restoring hideout stage must enter at Chapter 398');
  assert(wall.classification?.nenTypes?.includes('unknown') && (wall.ownerIds || []).length === 0, 'self-restoring stage must retain unknown category and owner');
  assert(/Conjuration|Transmutation|Specialization/i.test(text(wall)) && /Nobunaga|analysis|possible|could/i.test(text(wall)), 'candidate categories must remain Nobunaga analysis');
  assert(/Morena/i.test(text(wall)) && /does not prove|not.*prove|unresolved|not.*assign/i.test(text(wall)), 'Morena smile must not assign stage ownership');

  const hideoutArrival = archive.getEntityById('event:hinrigh-arrives-heilly-hideout-blood-sounds');
  assert(/fresh blood/i.test(text(hideoutArrival)) && /sound/i.test(text(hideoutArrival)), 'Hinrigh hideout arrival must preserve fresh blood and nearby sounds');
  const coop = archive.getEntityById('relationship:hinrigh-nobunaga-ch398-hideout-cooperation');
  assert(coop && /temporary/i.test(text(coop)), 'Hinrigh/Nobunaga hideout relationship must remain temporary cooperation');
  assert(/not.*permanent|not.*friend|does not.*permanent|institution/i.test(text(coop)), 'temporary cooperation must not become permanent alliance or membership');

  const laundry = archive.getEntityById('event:hinrigh-nobunaga-open-laundry-room');
  assert(/laundry/i.test(text(laundry)), 'Chapter 398 endpoint must remain the laundry-filled room');
  assert(/endpoint|end of.*chapter|chapter endpoint|stops/i.test(text(laundry)), 'laundry event must preserve the Chapter 398 stopping point');
  assert(!/Sweet Home|LSDF|Yokotani|Terebellum.*ability/i.test(text(laundry)), 'Chapter 399 hideout-defense reveals must not leak into the Chapter 398 endpoint event');

  const publicTimeline398 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 398);
  assert(publicTimeline398.length === chapterModule.succession398TimelineEvents.length, 'public timeline must expose all maintained Chapter 398 beats');
  assert(publicTimeline398.some((event) => event.id === '398-hinrigh-prepares-transmitter-oyster'), 'public timeline must include transmitter-oyster preparation');
  assert(publicTimeline398.some((event) => event.id === '398-hinrigh-nobunaga-open-laundry-room'), 'public timeline must include laundry-room endpoint');

  const activeAbilityNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  const frozenAbilityNames = new Set((frozen397.successionAbilities || []).map((record) => record.ability));
  assert(activeAbilityNames.has('Heil-Ly Front-Door Teleport Trap') && activeAbilityNames.has('Heil-Ly Self-Restoring Hideout Stage'), 'active dossier must expose the descriptive Chapter 398 ability records');
  assert(!frozenAbilityNames.has('Heil-Ly Front-Door Teleport Trap') && !frozenAbilityNames.has('Heil-Ly Self-Restoring Hideout Stage'), 'frozen through-397 dossier must remain unaware of Chapter 398 descriptive abilities');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 398')), 'active dossier must include Chapter 398 evidence group');
  assert(!(frozen397.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 398')), 'frozen through-397 dossier must remain unaware of Chapter 398');

  const note = fs.readFileSync('docs/source-notes/chapter-398.md', 'utf8');
  assert(/No Chapter 399\+ backfill/i.test(note), 'source note must quarantine Chapter 399+ knowledge');
  assert(/does not.*prove.*unlimited|does not.*prove.*unlimited use/i.test(note), 'source note must preserve repeated-use boundary');
  assert(/does not.*canonically classify Gateaume|does not.*classify Gateaume/i.test(note), 'source note must preserve Gateaume category uncertainty');
  assert(/roughly.*two or three|roughly.*2.*3/i.test(note), 'source note must preserve land-mine location exposition');
  assert(/does not upgrade.*deduction|remain.*deduction|not.*absolute/i.test(note), 'source note must preserve Troupe trap deductions as deductions');
  assert(/roughly.*two hours|roughly.*2 hours/i.test(note) && /one kilometer|1 kilometer/i.test(note), 'source note must preserve transmitter duration and receiver range');
  assert(/does not prove Morena personally operates|does not.*Morena.*personally operates/i.test(note.replaceAll('**', '')), 'source note must preserve Morena-operator uncertainty');
  assert(/laundry-filled room/i.test(note) && /endpoint/i.test(note), 'source note must stop at the laundry-room endpoint');

  console.log(`Chapter 398 boundary audit passed: ${events398.length} canonical Chapter 398 events preserve the tested front-door teleport trigger, barrier/land-mine theory boundary, Biohazard transmitter mechanics, temporary Hinrigh–Nobunaga cooperation, self-restoring hideout uncertainty, and laundry-room endpoint.`);
} finally {
  await vite.close();
}
