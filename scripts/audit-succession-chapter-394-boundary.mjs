import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 394 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession394Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen393 = await vite.ssrLoadModule('/src/data/successionDossierThrough393.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index393 = numbers.indexOf(393);
  assert(index393 >= 0 && numbers[index393 + 1] === 394, 'maintained publication chain must place Chapter 394 directly after Chapter 393');
  assert(numbers[numbers.indexOf(394) + 1] === 395 && numbers[numbers.indexOf(395) + 1] === 400, 'Chapter 394 must lead into maintained Chapter 395 before the pre-existing Chapter 400 maintained packet');

  const chapter394 = chapterModule.succession394ChapterResearch?.[0];
  assert(chapter394?.number === 394, 'dedicated Chapter 394 research must load');
  assert(chapter394.title === null && chapter394.titleStatus === 'not-supplied-no-title-invented', 'Chapter 394 title must remain unsupplied');
  assert(chapter394.voyageDay === 'Voyage Day 10', 'Chapter 394 must retain Voyage Day 10 continuity');
  assert(chapter394.chronology?.exactClockTime === null, 'Chapter 394 must not invent an exact clock time');
  assert(chapterModule.succession394TimelineEvents.length === 15, 'dedicated research must preserve all 15 maintained Chapter 394 timeline beats');

  const events394 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 394 && event.chapterRange?.end === 394);
  const eventIds = new Set(events394.map((event) => event.id));
  for (const id of [
    'event:room3101-gateaume-decoy-exposed',
    'event:room3101-tassi-disappears',
    'event:bille-kills-tassi-reaches-level21',
    'event:heilly-corpse-processing-route-expanded',
    'event:morena-assesses-vvip-liaison-room3101',
    'event:morena-orders-tserriednich-soldier-capture',
    'event:morena-contagion-tracking-door-c-guards',
    'event:room3131-processing-route-briefing',
    'event:dogman-ordered-past-level50',
    'event:hinrigh-recovers-cat-camcorder',
    'event:gipper-raids-heilly-office-cover-story',
    'event:otocin-reveals-nen-borksen-transfer',
    'event:tserriednich-soldiers-model-mafia-war-risk',
    'event:borksen-confirms-tserriednich-nen-training',
    'event:borksen-warns-heilly-knows-soldiers',
  ]) assert(eventIds.has(id), `${id} must exist at the Chapter 394 canonical event boundary`);

  const gateaumeEvent = archive.getEntityById('event:room3101-gateaume-decoy-exposed');
  assert(gateaumeEvent?.locationIds?.includes('location:black-whale:tier-3:room-3101'), 'Gateaume confrontation must remain attached to canonical Room 3101');
  assert(/no blood|bloodless/i.test(text(gateaumeEvent)) && /real body/i.test(text(gateaumeEvent)), 'Gateaume event must preserve the bloodless injury and real-body distinction');
  assert(!/Conjur|Emission|Manipulat|Transmut|Enhanc/i.test(String(gateaumeEvent.summary || '')), 'Gateaume event summary must not invent a Nen category');

  const gateaume = archive.getEntityById('ability:gateaume-decoy-body');
  const gateaumeKnowledge = archive.getAbilityKnowledgeAtChapter('ability:gateaume-decoy-body', 394);
  assert(gateaume?.firstChapter === 394 && gateaumeKnowledge?.known, 'Gateaume descriptive body ability must enter at Chapter 394');
  assert(gateaume.classification?.nenTypes?.includes('unknown'), 'Gateaume ability Nen type must remain unknown');
  assert(/real-body location|real body.*unknown|real-body.*unknown|remain unknown|remain unresolved/i.test(text(gateaumeKnowledge)), 'Gateaume real-body location must remain unresolved');

  const tassi394 = archive.getCharacterStateAtChapter('character:tassi', 394);
  assert(tassi394?.life === 'dead' && /Bille|neck/i.test(text(tassi394)), 'Tassi must be dead after Bille’s Chapter 394 attack');

  const bille394 = archive.getCharacterStateAtChapter('character:bille', 394);
  const matvere394 = archive.getCharacterStateAtChapter('character:matvere', 394);
  assert(/level 21/i.test(text(bille394)) && /Conjurer/i.test(text(bille394)), 'Bille must be level 21 and a confirmed Conjurer');
  assert(/level 21/i.test(text(matvere394)) && /Transmuter/i.test(text(matvere394)), 'Matvere must be level 21 and a confirmed Transmuter');
  const abilities394 = archive.getEntitiesByType('ability').filter((ability) => ability.firstChapter === 394 || ability.sourceChapterNumbers?.includes(394));
  assert(!abilities394.some((ability) => ability.ownerIds?.includes('character:bille') && ability.id !== 'ability:contagion'), 'Chapter 394 must not invent a personal Bille ability');

  const contagion = archive.getAbilityKnowledgeAtChapter('ability:contagion', 394);
  assert(contagion?.known && /level 21/i.test(text(contagion)), 'Contagion knowledge must preserve Bille’s level-21 transition');
  assert(/track.*movement|track his movements|tracking/i.test(text(contagion)), 'Contagion knowledge must preserve Morena’s stated tracking plan');
  assert(/precision|range|duration|limits?.*unresolved|remain unresolved/i.test(text(contagion)), 'Contagion tracking limits must remain unresolved');

  const voconte = archive.getEntityById('ability:voconte-door-ability');
  const voconteKnowledge = archive.getAbilityKnowledgeAtChapter('ability:voconte-door-ability', 394);
  assert(voconte?.latestChapter === 394 && voconteKnowledge?.known, 'Voconte door technique must advance through Chapter 394');
  assert(voconte.classification?.nenTypes?.includes('unknown'), 'Voconte door technique itself must remain unclassified');
  assert(/direct.*connect|connected.*processing/i.test(text(voconteKnowledge)), 'Voconte knowledge must preserve the direct room-to-processing connection report');
  assert(/not every|not.*every|does not.*every|not automatically.*route/i.test(text(voconteKnowledge)), 'Voconte knowledge must not absorb every Heil-Ly route into one inferred topology');

  const roomEvent = archive.getEntityById('event:room3101-tassi-disappears');
  assert(/Luini.*dead|Luini has already been killed|already.*killed/i.test(text(roomEvent)), 'Room 3101 continuation must preserve that Luini is already dead');
  assert(!/Luini.*activat|Luini.*teleport|Luini.*transports Tassi/i.test(text(roomEvent)), 'Room 3101 must not attribute Tassi’s transfer to living Luini');

  const morena394 = archive.getCharacterStateAtChapter('character:morena-prudo', 394);
  assert(/Room 3101.*comprom|abandon.*Room 3101|Door C/i.test(text(morena394)), 'Morena state must preserve the Room 3101-to-Door C shift');
  assert(/track/i.test(text(morena394)) && /Tserriednich/i.test(text(morena394)), 'Morena state must preserve the Tserriednich tracking objective');

  const heilLy394 = archive.getOrganizationStateAtChapter('organization:heil-ly', 394);
  assert(/Room 3101/i.test(text(heilLy394)) && /Door C/i.test(text(heilLy394)), 'Heil-Ly state must expose the compromised Room 3101 and Door C replacement');
  assert(/level 50|past 50|exceed.*50/i.test(text(heilLy394)), 'Heil-Ly state must preserve Dogman’s >50 leveling order');

  const hinrighAbility = archive.getAbilityKnowledgeAtChapter('ability:hinrigh-object-animal-transformation', 394);
  assert(hinrighAbility?.known && /camcorder/i.test(text(hinrighAbility)) && /cat/i.test(text(hinrighAbility)), 'Biohazard knowledge must preserve cat-to-camcorder surveillance recovery');

  const military394 = archive.getOrganizationStateAtChapter('organization:kakin-military', 394);
  assert(/Gipper/i.test(text(military394)) && /Borksen/i.test(text(military394)) && /Nen/i.test(text(military394)), 'Kakin military state must preserve the Gipper/Borksen Nen-information lane');
  assert(/proposed|early-warning|scenario|not confirmed/i.test(text(military394)), 'military state must preserve scenario/contingency boundaries around a wider eradication operation');

  const borksen394 = archive.getCharacterStateAtChapter('character:borksen', 394);
  assert(/Theta/i.test(text(borksen394)) && /Tserriednich/i.test(text(borksen394)), 'Borksen must know that Theta is teaching Tserriednich Nen');
  assert(/does not know|doesn.t know|ignorant.*mechanics|no.*detailed.*mechanics/i.test(text(borksen394)), 'Borksen must not be upgraded to detailed Nen knowledge');
  assert(!/recruitment game|coerced recruitment|Contagion member|Heil-Ly member/i.test(text(borksen394)), 'later Borksen recruitment state must not leak into Chapter 394');

  const chapter394Text = text(events394);
  assert(!/Bonolenov|Metamorphorsen/i.test(chapter394Text), 'Chapter 394 events must not leak later apparent-Hisoka identity knowledge');

  const publicTimeline394 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 394);
  assert(publicTimeline394.length === chapterModule.succession394TimelineEvents.length, 'public timeline must replace legacy Chapter 394 chronology with all maintained beats');
  assert(publicTimeline394.some((event) => event.id === '394-bille-kills-tassi-reaches-level21'), 'public timeline must contain Tassi’s death/Bille level-up');
  assert(publicTimeline394.some((event) => event.id === '394-borksen-confirms-tserriednich-nen-training'), 'public timeline must contain Borksen’s classified Nen briefing');

  const activeAbilityNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  assert(activeAbilityNames.has('Gateaume’s Decoy Body Ability') && activeAbilityNames.has('Contagion') && activeAbilityNames.has('Voconte’s Door Ability'), 'active dossier must include the Chapter 394 ability/system records');
  assert(!new Set((frozen393.successionAbilities || []).map((record) => record.ability)).has('Gateaume’s Decoy Body Ability'), 'frozen through-393 dossier must not know Gateaume’s Chapter 394 body phenomenon');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 394')), 'active dossier must include the Chapter 394 operational group');

  const oldRoomMystery = (dossier.successionMysteries || []).find((record) => /does room 3101 actually belong to or connect to heil-ly/i.test(String(record?.question || '')));
  assert(!oldRoomMystery, 'Chapter 393 uncertainty about whether Room 3101 connects to Heil-Ly must be retired at Chapter 394');
  assert((dossier.successionResolvedQuestions || []).some((record) => /Room 3101 actually connected to Heil-Ly/i.test(String(record?.question || ''))), 'Chapter 394 must resolve the Room 3101 Heil-Ly connection question');

  const note = fs.readFileSync('docs/source-notes/chapter-394.md', 'utf8');
  assert(/no blood/i.test(note) && /real body/i.test(note) && /Gateaume/i.test(note), 'source note must preserve Gateaume’s bloodless real-body boundary');
  assert(/Room 3101.*part of Heil-Ly|confirm.*Room 3101|Room 3101.*usable route/i.test(note), 'source note must record the Chapter 394 Room 3101 confirmation');
  assert(/Bille.*Conjurer/i.test(note) && /Matvere.*Transmuter/i.test(note), 'source note must preserve Bille and Matvere type disclosures');
  assert(/Borksen.*does.*not.*know|does \*\*not\*\* know/i.test(note), 'source note must preserve Borksen’s limited Nen knowledge');
  assert(/No later Borksen capture|No later.*recruitment|No Chapter 395\+/i.test(note), 'source note must quarantine later knowledge');

  console.log(`Chapter 394 boundary audit passed: ${events394.length} canonical Chapter 394 events preserve Gateaume/Room 3101 uncertainty, Tassi’s death and Bille’s level-21 transition, Heil-Ly route/processing expansion, Morena’s Tserriednich tracking plan, and Borksen’s limited Nen-information boundary.`);
} finally {
  await vite.close();
}