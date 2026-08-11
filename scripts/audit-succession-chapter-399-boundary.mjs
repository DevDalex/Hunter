import fs from 'node:fs';
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
  const frozen398 = await vite.ssrLoadModule('/src/data/successionDossierThrough398.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index398 = numbers.indexOf(398);
  assert(index398 >= 0 && numbers[index398 + 1] === 399 && numbers[index398 + 2] === 400, 'maintained publication chain must place Chapter 399 between 398 and the pre-existing Chapter 400 packet');

  const chapter399 = chapterModule.succession399ChapterResearch?.[0];
  assert(chapter399?.number === 399, 'dedicated Chapter 399 research must load');
  assert(chapter399.title === null && chapter399.titleStatus === 'not-supplied-no-title-invented', 'Chapter 399 title must remain unsupplied');
  assert(chapter399.voyageDay === 'Voyage Day 10', 'Chapter 399 must remain Voyage Day 10 present-day action');
  assert(chapter399.chronology?.exactClockTime === null, 'Chapter 399 must not invent an exact clock time');
  assert(chapter399.chronology?.presentDay === true && chapter399.chronology?.flashback === false, 'Chapter 399 must remain present-day rather than flashback');
  assert(chapterModule.succession399TimelineEvents.length === 12, 'dedicated research must preserve all 12 maintained Chapter 399 beats');

  const events399 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 399 && event.chapterRange?.end === 399);
  const eventIds = new Set(events399.map((event) => event.id));
  const dedicatedEventIds = [
    'event:laundry-room-complicity-evacuation-theories',
    'event:main-door-reveals-nine-heilly-members',
    'event:terebellum-first-knife-damage-transfer',
    'event:orarge-blocks-knife-perigord-organ-reminder',
    'event:terebellum-protects-yokotani-sweet-home-revealed',
    'event:yokotani-activates-lsdf-seven-guards-alert4',
    'event:lsdf-max-alert-restrains-expels-nobunaga',
    'event:hinrigh-hides-oyster-transmitter-in-laundry',
    'event:nobunaga-room3101-two-way-route-analysis',
    'event:hinrigh-returns-biohazard-unavailable-knives-spent',
    'event:xiyu-troupe-divide-heilly-search-work',
    'event:oyster-beeps-final-morena-kikan-caution',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 399 canonical boundary`);
  const projected399 = events399.filter((event) => event.maintainedResearch === true);
  assert(projected399.length === 12, 'story intelligence must project all 12 maintained Chapter 399 research beats');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 399 events must remain distinct from maintained-research projections');
  for (const id of dedicatedEventIds) assert(archive.getEntityById(id)?.chronology?.day === 10, `${id} must remain Voyage Day 10`);

  const laundryTheory = archive.getEntityById('event:laundry-room-complicity-evacuation-theories');
  assert(/hypoth|unconfirmed|alternative/i.test(text(laundryTheory)), 'laundry/neighborhood explanations must remain hypotheses');
  assert(/cooperat/i.test(text(laundryTheory)) && /restrain/i.test(text(laundryTheory)) && /evacuat/i.test(text(laundryTheory)), 'laundry analysis must preserve the major competing explanations');

  const gathering = archive.getEntityById('event:main-door-reveals-nine-heilly-members');
  assert(/nine/i.test(text(gathering)), 'main-room contact must preserve the nine-member count');
  for (const id of ['character:gelato', 'character:souffle', 'character:terebellum']) assert((gathering.participantIds || []).includes(id), `${id} must be included where explicitly named`);
  assert(/does not identify all nine|not identify all nine|does not invent/i.test(text(gathering)), 'the remaining unnamed members must not receive invented identities');

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

  const morena399 = archive.getCharacterStateAtChapter('character:morena-prudo', 399);
  assert(morena399?.life === 'alive', 'Morena must remain alive at Chapter 399');
  assert(morena399?.locationId === 'location:black-whale:tier-3:heil-ly-hideout', 'LSDF location condition must advance Morena to the hideout root without inventing an exact room');
  assert(/exact room.*unresolved|exact room.*unknown|somewhere/i.test(text(morena399)), 'Morena’s exact room must remain unresolved');
  assert(/does not make her the owner.*Room 3101 teleport route.*self-restoring stage/i.test(text(morena399)), 'Morena state must explicitly preserve non-ownership of the spatial/restorative mechanisms');

  const organEvent = archive.getEntityById('event:orarge-blocks-knife-perigord-organ-reminder');
  assert(/organ|kikan/i.test(text(organEvent)) && /Morena/i.test(text(organEvent)), 'Perigord organ selection and Morena instruction must be preserved');
  assert(/unresolved|unrevealed|not.*demonstrated/i.test(text(organEvent)), 'organ meaning and Perigord ability must remain unresolved');
  const perigord399 = archive.getCharacterStateAtChapter('character:perigord', 399);
  assert(perigord399?.life === 'alive', 'Perigord must remain alive');
  assert(/No personal Nen ability|no personal.*ability|does not establish/i.test(text(perigord399)), 'Perigord must not receive an invented Chapter 399 ability');

  const trap399 = archive.getEntityById('ability:heil-ly-front-door-teleport-trap');
  assert(trap399?.latestChapter === 399, 'front-door teleport route entity must advance through Chapter 399');
  assert(trap399.classification?.nenTypes?.includes('unknown') && (trap399.ownerIds || []).length === 0, 'Room 3101 route must retain unknown category and owner');
  assert(/Room 3101/i.test(text(trap399)) && /hideout/i.test(text(trap399)) && /return/i.test(text(trap399)), 'route entity must preserve the hideout-to-Room-3101 return result');
  assert(/member-only.*hypoth|member-only.*not.*demonstrat|member-only.*unresolved/i.test(text(trap399)), 'member-only jump point must remain Nobunaga’s hypothesis');
  assert(/Gateaume|Voconte/i.test(text(trap399)) && /unresolved|not.*assign|does not identify/i.test(text(trap399)), 'route must remain unassigned to Gateaume/Voconte');

  const trap398Knowledge = archive.getAbilityKnowledgeAtChapter('ability:heil-ly-front-door-teleport-trap', 398);
  const trap399Knowledge = archive.getAbilityKnowledgeAtChapter('ability:heil-ly-front-door-teleport-trap', 399);
  assert(trap398Knowledge?.known && trap399Knowledge?.known, 'route knowledge must exist at both 398 and 399 boundaries');
  assert(!/member-only|returns? from the hideout|hideout.*Room 3101 return/i.test(text({ summary: trap398Knowledge.summary, mechanics: trap398Knowledge.mechanics })), 'Chapter 399 outbound/member-only vocabulary must not leak into Chapter 398 route knowledge');
  assert(/return/i.test(text({ summary: trap399Knowledge.summary, mechanics: trap399Knowledge.mechanics })) && /member-only/i.test(text({ summary: trap399Knowledge.summary, mechanics: trap399Knowledge.mechanics })), 'Chapter 399 route knowledge must include return result and bounded member-only hypothesis');

  const bio398 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 398);
  const bio399 = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 399);
  assert(bio398?.known && bio399?.known, 'Biohazard must remain known at both 398 and 399 boundaries');
  assert(!/cannot use.*again|remainder of.*day|rest of.*day|under.*cabinet/i.test(text({ summary: bio398.summary, mechanics: bio398.mechanics })), 'Chapter 399 Biohazard outcome/resource vocabulary must not leak into Chapter 398');
  assert(/under.*cabinet|beneath.*cabinet/i.test(text({ summary: bio399.summary, mechanics: bio399.mechanics })) && /remainder of.*day|rest of.*day|cannot use/i.test(text({ summary: bio399.summary, mechanics: bio399.mechanics })), 'Chapter 399 Biohazard knowledge must preserve transmitter concealment and rest-of-day unavailability');
  assert(/does not establish.*fixed|not.*fixed|no.*fixed/i.test(text({ summary: bio399.summary, mechanics: bio399.mechanics })), 'Biohazard rest-of-day limit must not become a universal fixed quota');

  const hinrigh399 = archive.getCharacterStateAtChapter('character:hinrigh-biganduffno', 399);
  const nobunaga399 = archive.getCharacterStateAtChapter('character:nobunaga-hazama', 399);
  assert(hinrigh399?.life === 'alive' && nobunaga399?.life === 'alive', 'Hinrigh and Nobunaga must both remain alive at Chapter 399 endpoint');
  assert(hinrigh399?.locationId === 'location:black-whale:tier-3:room-3101' && nobunaga399?.locationId === 'location:black-whale:tier-3:room-3101', 'Hinrigh and Nobunaga must both end Chapter 399 in Room 3101');
  assert(/cannot use.*rest|unavailable.*rest|remainder.*day/i.test(text(hinrigh399)), 'Hinrigh state must preserve rest-of-day Biohazard unavailability');
  assert(/all.*kniv|knife.*exhaust|exhaust.*knif/i.test(text(hinrigh399)), 'Hinrigh state must preserve knife exhaustion separately');

  const terebellum399 = archive.getCharacterStateAtChapter('character:terebellum', 399);
  const yokotani399 = archive.getCharacterStateAtChapter('character:yokotani', 399);
  assert(terebellum399?.life === 'alive' && yokotani399?.life === 'alive', 'Terebellum and Yokotani must remain alive at Chapter 399');
  assert(terebellum399.locationId === 'location:black-whale:tier-3:heil-ly-hideout:gathering-defense-room' && yokotani399.locationId === 'location:black-whale:tier-3:heil-ly-hideout:gathering-defense-room', 'Terebellum and Yokotani must remain in the defended gathering room');

  const gatheringRoom = archive.getEntityById('location:black-whale:tier-3:heil-ly-hideout:gathering-defense-room');
  const laundryRoom = archive.getEntityById('location:black-whale:tier-3:heil-ly-hideout:laundry-room');
  assert(gatheringRoom && laundryRoom, 'Chapter 399 gathering and laundry locations must exist');
  assert(gatheringRoom.parentId === 'location:black-whale:tier-3:heil-ly-hideout', 'gathering room must remain inside the existing hideout root');
  assert(/nine/i.test(text(gatheringRoom)) && /Sweet Home/i.test(text(gatheringRoom)) && /LSDF/i.test(text(gatheringRoom)), 'gathering room must preserve the Chapter 399 contact and ability reveals');
  assert(/under.*cabinet|beneath.*cabinet/i.test(text(laundryRoom)) && /oyster/i.test(text(laundryRoom)), 'laundry location must preserve the hidden oyster endpoint');
  assert(/complete.*topology|full.*topology|does not establish/i.test(text(gatheringRoom) + text(laundryRoom)), 'Chapter 399 locations must not pretend the full hideout topology is solved');

  const searchPlan = archive.getEntityById('event:xiyu-troupe-divide-heilly-search-work');
  assert(/plan|will|responsibility/i.test(text(searchPlan)), 'follow-up Xi-Yu/Troupe search work must remain a plan');
  assert(!/successfully located the hideout|found the transmitter at|completed the search/i.test(text(searchPlan)), 'Chapter 399 must not import later search results');

  const fieldPair = archive.getEntityById('relationship:hinrigh-nobunaga-ch399-search-cooperation');
  const orgPair = archive.getEntityById('relationship:xi-yu-phantom-troupe-ch399-search-division');
  assert(fieldPair && orgPair, 'Chapter 399 tactical cooperation relationships must exist');
  assert(/temporary/i.test(text(fieldPair)) && /not establish permanent|does not establish permanent/i.test(text(fieldPair)), 'Hinrigh/Nobunaga cooperation must remain temporary');
  assert(/temporary/i.test(text(orgPair)) && /no merged command|not.*permanent|separate institutional/i.test(text(orgPair)), 'Xi-Yu/Troupe task division must not become merged command');

  const publicTimeline399 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 399);
  assert(publicTimeline399.length === chapterModule.succession399TimelineEvents.length, 'public timeline must expose all maintained Chapter 399 beats');
  assert(publicTimeline399.some((event) => event.id === '399-terebellum-protects-yokotani-sweet-home-revealed'), 'public timeline must include Sweet Home reveal');
  assert(publicTimeline399.some((event) => event.id === '399-yokotani-activates-lsdf-level4-guards'), 'public timeline must include LSDF reveal');
  assert(publicTimeline399.some((event) => event.id === '399-oyster-beeps-final-morena-kikan-caution'), 'public timeline must end with the hidden oyster / caution beat');

  const activeAbilityNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  const frozenAbilityNames = new Set((frozen398.successionAbilities || []).map((record) => record.ability));
  assert(activeAbilityNames.has('Damage: “Sweet Home”') && activeAbilityNames.has('A Battle of Wits: “LSDF”'), 'active dossier must expose both Chapter 399 abilities');
  assert(!frozenAbilityNames.has('Damage: “Sweet Home”') && !frozenAbilityNames.has('A Battle of Wits: “LSDF”'), 'frozen through-398 dossier must remain unaware of Chapter 399 abilities');
  const frozenBio = (frozen398.successionAbilities || []).find((record) => record.ability === 'Biohazard');
  assert(frozenBio && !/cannot use.*day|remainder.*day|under.*cabinet/i.test(text(frozenBio)), 'frozen through-398 dossier must preserve pre-399 Biohazard knowledge');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 399')), 'active dossier must include Chapter 399 evidence group');
  assert(!(frozen398.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 399')), 'frozen through-398 dossier must remain unaware of Chapter 399');

  const note = fs.readFileSync('docs/source-notes/chapter-399.md', 'utf8');
  assert(/No Chapter 400\+ backfill/i.test(note), 'source note must quarantine Chapter 400+ knowledge');
  assert(/speaker-level hypotheses/i.test(note) && /does not establish which explanation/i.test(note), 'source note must preserve laundry hypothesis boundary');
  assert(/right hand/i.test(note) && /left hand/i.test(note) && /moment the damage is received/i.test(note), 'source note must preserve Sweet Home contact mechanics');
  assert(/cannot harm the criminal/i.test(note) && /attacks are ineffective/i.test(note), 'source note must preserve LSDF defensive rule');
  assert(/does not.*LSDF.*creates? or owns|does not.*conclude.*LSDF/i.test(note.replaceAll('**', '')), 'source note must preserve LSDF/teleport ownership separation');
  assert(/member-only jump point.*hypothesis|member-only.*not directly demonstrated/i.test(note), 'source note must preserve member-only route uncertainty');
  assert(/rest-of-day availability limit/i.test(note) && /does not infer/i.test(note), 'source note must preserve bounded Biohazard resource limit');
  assert(/does not establish:.*Morena’s exact room.*Morena personally operates the Room 3101 teleport route.*Morena personally operates the self-restoring wall\/stage/i.test(note.replaceAll('**', '').replace(/\s+/g, ' ')), 'source note must preserve Morena exact-room/operator uncertainty');
  assert(/reference metadata/i.test(note) && /does not change story mechanics/i.test(note), 'trivia must remain reference-only metadata');

  console.log(`Chapter 399 boundary audit passed: ${events399.length} canonical Chapter 399 events preserve the nine-member hideout contact, Sweet Home and LSDF reveals, Room 3101 return route, hidden transmitter, Hinrigh’s rest-of-day Biohazard limit, and unresolved member-only/kikan/Morena boundaries.`);
} finally {
  await vite.close();
}
