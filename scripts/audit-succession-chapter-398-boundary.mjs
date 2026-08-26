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
  assert(chapter398.voyageDay === 'Voyage Day 10', 'Chapter 398 must return to Voyage Day 10 present-day action');
  assert(chapter398.chronology?.exactClockTime === null, 'Chapter 398 must not invent an exact clock time');
  assert(chapter398.chronology?.presentDay === true && chapter398.chronology?.flashback === false, 'Chapter 398 must be present-day Tier 3 action rather than a continuation of the Meteor City flashback');
  assert(chapterModule.succession398TimelineEvents.length === 13, 'dedicated research must preserve all 13 maintained Chapter 398 beats');

  const events398 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 398 && event.chapterRange?.end === 398);
  const eventIds = new Set(events398.map((event) => event.id));
  const dedicatedEventIds = [
    'event:troupe-debates-gateaume-teleport-mechanism',
    'event:bathroom-bypass-front-door-test',
    'event:first-hostage-front-door-reentry-teleports',
    'event:barrier-land-mine-nen-exposition',
    'event:second-hostage-confirms-continuous-teleport',
    'event:keni-hinrigh-offer-anti-heilly-cooperation',
    'event:hinrigh-transmitter-oyster-biohazard',
    'event:hinrigh-explains-receiver-and-enters-trap',
    'event:receiver-distance-band-troupe-triangulation',
    'event:hinrigh-arrives-heilly-hideout',
    'event:nobunaga-follows-hinrigh-coop',
    'event:nobunaga-tests-self-restoring-hideout-wall',
    'event:hinrigh-nobunaga-sweep-to-laundry',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 398 canonical boundary`);
  const projected398 = events398.filter((event) => event.maintainedResearch === true);
  assert(projected398.length === 13, 'story intelligence must project all 13 maintained Chapter 398 research beats');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 398 events must remain distinct from maintained-research projections');
  for (const id of dedicatedEventIds) assert(archive.getEntityById(id)?.chronology?.day === 10, `${id} must remain present-day Voyage Day 10 action`);

  const bypass = archive.getEntityById('event:bathroom-bypass-front-door-test');
  const firstTrigger = archive.getEntityById('event:first-hostage-front-door-reentry-teleports');
  const secondTrigger = archive.getEntityById('event:second-hostage-confirms-continuous-teleport');
  assert(/without disappearing|does not trigger|does not activate/i.test(text(bypass)), 'bathroom-side entry must remain a demonstrated non-trigger');
  assert(/exit|walks out/i.test(text(firstTrigger)) && /re-enter|reentry|re-entry/i.test(text(firstTrigger)) && /disappear|teleport/i.test(text(firstTrigger)), 'first-hostage event must preserve safe exit followed by teleport on inward re-entry');
  assert(/Gateaume.*not visibly present|not visibly present.*Gateaume/i.test(text(firstTrigger)), 'front-door activation must preserve Gateaume-double absence without overclaiming ownership');
  assert(/second/i.test(text(secondTrigger)) && /repeat|continu/i.test(text(secondTrigger)), 'second-hostage test must preserve repeated activation');

  const trap = archive.getEntityById('ability:heil-ly-front-door-teleport-trap');
  assert(trap?.firstChapter === 398 && trap?.latestChapter >= 398, 'descriptive front-door trap ability must enter at Chapter 398 even when later chapters extend the live entity');
  assert(trap.classification?.nenTypes?.includes('unknown'), 'front-door trap Nen category must remain unknown');
  assert((trap.ownerIds || []).length === 0, 'front-door trap must not invent an owner');
  assert(/descriptive archive label|official ability name.*unsupplied/i.test(text(trap)), 'front-door trap name must remain descriptive');
  assert(/land-mine.*inference|land-mine.*not confirmed|classification.*inference/i.test(text(trap)), 'front-door trap must not canonize Nobunaga’s land-mine classification');
  assert(/Gateaume.*not.*confirm|Gateaume.*not.*user|relationship to Gateaume.*unresolved/i.test(text(trap)), 'front-door trap must not assign ownership to Gateaume');

  const preparedSystem397 = archive.getNenSystemDossier('nen-system:prepared-spatial-traps', 397);
  const preparedSystem398 = archive.getNenSystemDossier('nen-system:prepared-spatial-traps', 398);
  assert(!preparedSystem397 && preparedSystem398, 'barrier/land-mine prepared-trap system must become available at Chapter 398, not earlier');
  assert(/rope|talismans/i.test(text(preparedSystem398)) && /two or three|2.*3/i.test(text(preparedSystem398)), 'prepared-trap system must preserve barrier support objects and land-mine two/three-location limit');
  assert(/inference|hypothesis|unconfirmed/i.test(text(preparedSystem398)), 'specific Heil-Ly land-mine classification must remain uncertain inside system dossier');

  const gateaume398 = archive.getAbilityKnowledgeAtChapter('ability:gateaume-decoy-body', 398);
  assert(gateaume398?.known, 'Gateaume decoy-body knowledge must remain available at Chapter 398');
  assert(gateaume398.ability.classification?.nenTypes?.includes('unknown'), 'Gateaume decoy-body category must remain unknown after Chapter 398 debate');
  assert(/theor|unresolved|unconfirmed/i.test(text(gateaume398)), 'Chapter 398 Gateaume knowledge must preserve theory boundaries');
  assert(!/confirmed teleport(?:ation)? trap user|Gateaume is the teleport/i.test(text(gateaume398)), 'Gateaume must not become confirmed teleport-trap user');

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
  const wallEvent = archive.getEntityById('event:nobunaga-tests-self-restoring-hideout-wall');
  assert(wall?.firstChapter === 398 && wall.classification?.nenTypes?.includes('unknown') && (wall.ownerIds || []).length === 0, 'self-restoring stage must enter at 398 with unknown category and owner');
  assert(/rapidly disappears|damage rapidly disappears|restore/i.test(text(wallEvent)), 'wall event must preserve directly observed restoration');
  assert(/Conjuration/i.test(text(wallEvent)) && /Transmutation/i.test(text(wallEvent)) && /Specialization/i.test(text(wallEvent)), 'wall event must preserve Nobunaga’s three category possibilities');
  assert(/theor|hypoth|unresolved|not.*confirmed/i.test(text(wallEvent)), 'wall category/operator/proximity analysis must remain uncertain');
  assert(!((wall.ownerIds || []).includes('character:morena-prudo')), 'Morena must not be assigned as self-restoring-stage owner');
  assert(/Morena.*does not prove|Morena.*not.*prove|Morena.*not.*operator/i.test(text(wallEvent)), 'Morena smile juxtaposition must not become proof of wall control');

  const entryRoom = archive.getEntityById('location:black-whale:tier-3:heil-ly-hideout:entry-room');
  const laundryRoom = archive.getEntityById('location:black-whale:tier-3:heil-ly-hideout:laundry-room');
  assert(entryRoom && laundryRoom, 'Chapter 398 entry and laundry locations must exist');
  assert(entryRoom.parentId === 'location:black-whale:tier-3:heil-ly-hideout' && laundryRoom.parentId === 'location:black-whale:tier-3:heil-ly-hideout', 'new Chapter 398 rooms must remain children of the existing Heil-Ly hideout location');
  assert(/complete.*topology|full.*topology|does not.*complete/i.test(text(entryRoom) + text(laundryRoom)), 'new hideout locations must not pretend the complete topology is solved');

  const sweep = archive.getEntityById('event:hinrigh-nobunaga-sweep-to-laundry');
  assert(/shower/i.test(text(sweep)) && /bathroom/i.test(text(sweep)) && /three toilets/i.test(text(sweep)) && /laundry/i.test(text(sweep)), 'hideout sweep must preserve shower, bathroom, three toilets, and laundry endpoint');
  assert(/not.*solv|unresolved|without solving/i.test(text(sweep)), 'hideout sweep must preserve topology uncertainty');

  const hinrighState = archive.getCharacterStateAtChapter('character:hinrigh-biganduffno', 398);
  const nobunagaState = archive.getCharacterStateAtChapter('character:nobunaga-hazama', 398);
  assert(hinrighState?.life === 'alive' && nobunagaState?.life === 'alive', 'Hinrigh and Nobunaga must both remain alive at Chapter 398 endpoint');
  assert(hinrighState?.locationId === 'location:black-whale:tier-3:heil-ly-hideout:laundry-room', 'Hinrigh must end Chapter 398 at the laundry-room boundary');
  assert(nobunagaState?.locationId === 'location:black-whale:tier-3:heil-ly-hideout:laundry-room', 'Nobunaga must end Chapter 398 at the laundry-room boundary');

  const fieldPair = archive.getEntityById('relationship:hinrigh-nobunaga-ch398-hideout-cooperation');
  const orgPair = archive.getEntityById('relationship:xi-yu-phantom-troupe-ch398-anti-heilly-cooperation');
  assert(fieldPair && orgPair, 'Chapter 398 tactical cooperation relationships must exist');
  assert(/temporary/i.test(text(fieldPair)) && /not.*permanent|does not establish permanent/i.test(text(fieldPair)), 'Hinrigh/Nobunaga cooperation must remain temporary');
  assert(/institutionally separate|no permanent alliance|not.*permanent/i.test(text(orgPair)), 'Xi-Yu/Troupe cooperation must not become a permanent merger');

  const publicTimeline398 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 398);
  assert(publicTimeline398.length === chapterModule.succession398TimelineEvents.length, 'public timeline must expose all maintained Chapter 398 beats');
  assert(publicTimeline398.some((event) => event.id === '398-hinrigh-transmitter-oyster-biohazard'), 'public timeline must include Biohazard transmitter-oyster use');
  assert(publicTimeline398.some((event) => event.id === '398-nobunaga-tests-self-restoring-wall'), 'public timeline must include self-restoring wall test');
  assert(publicTimeline398.some((event) => event.id === '398-hinrigh-nobunaga-sweep-to-laundry'), 'public timeline must stop at the laundry-room sweep');

  const activeAbilityNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  const frozenAbilityNames = new Set((frozen397.successionAbilities || []).map((record) => record.ability));
  assert(activeAbilityNames.has('Heil-Ly Front-Door Teleport Trap') && activeAbilityNames.has('Heil-Ly Self-Restoring Hideout Stage'), 'active dossier must expose the two descriptive Chapter 398 Nen phenomena');
  assert(!frozenAbilityNames.has('Heil-Ly Front-Door Teleport Trap') && !frozenAbilityNames.has('Heil-Ly Self-Restoring Hideout Stage'), 'frozen through-397 dossier must remain unaware of Chapter 398 Nen phenomena');
  const frozenBio = (frozen397.successionAbilities || []).find((record) => record.ability === 'Biohazard');
  assert(frozenBio && !/oyster|two hours|1 kilometer|one kilometer/i.test(text(frozenBio)), 'frozen through-397 dossier must preserve pre-398 Biohazard knowledge');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 398')), 'active dossier must include the Chapter 398 evidence group');
  assert(!(frozen397.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 398')), 'frozen through-397 dossier must remain unaware of Chapter 398');

  const note = fs.readFileSync('docs/source-notes/chapter-398.md', 'utf8');
  assert(/No Chapter 399\+ backfill/i.test(note), 'source note must quarantine Chapter 399+ knowledge');
  assert(/character-level Nen analysis|character.*analysis/i.test(note) && /does \*\*not\*\* canonically classify|does not canonically classify/i.test(note), 'source note must separate Gateaume/trap theories from confirmed classification');
  assert(/Barrier type/i.test(note) && /Land-mine type/i.test(note) && /two or three locations/i.test(note), 'source note must preserve general prepared-trap exposition');
  assert(/roughly \*\*two hours\*\*|roughly two hours/i.test(note) && /one kilometer/i.test(note) && /does \*\*not\*\* account for altitude|does not account for altitude/i.test(note), 'source note must preserve Biohazard tracking specifics');
  assert(/does not prove Morena personally operates|does not.*Morena.*personally operates/i.test(note.replaceAll('**', '')), 'source note must preserve Morena-operator uncertainty');
  assert(/endpoint.*laundry|Chapter 398 endpoint.*laundry/i.test(note), 'source note must stop at the laundry-filled room');

  console.log(`Chapter 398 boundary audit passed: ${dedicatedEventIds.length} dedicated canonical events plus ${projected398.length} maintained-research projections preserve the tested front-door teleport trigger, barrier/land-mine theory boundary, Biohazard transmitter mechanics, temporary Hinrigh–Nobunaga cooperation, self-restoring hideout uncertainty, and laundry-room endpoint.`);
} finally {
  await vite.close();
}
