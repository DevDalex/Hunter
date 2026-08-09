import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 393 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession393Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen392 = await vite.ssrLoadModule('/src/data/successionDossierThrough392.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index392 = numbers.indexOf(392);
  assert(index392 >= 0 && numbers[index392 + 1] === 393, 'maintained publication chain must place Chapter 393 directly after Chapter 392');
  assert(numbers[numbers.indexOf(393) + 1] === 400, 'Chapter 393 must remain before the pre-existing Chapter 400 maintained packet');

  const chapter393 = chapterModule.succession393ChapterResearch?.[0];
  assert(chapter393?.number === 393, 'dedicated Chapter 393 research must load');
  assert(chapter393.title === null && chapter393.titleStatus === 'not-supplied-no-title-invented', 'Chapter 393 title must remain unsupplied');
  assert(chapter393.voyageDay === 'Voyage Day 10', 'Chapter 393 must retain Voyage Day 10 continuity');
  assert(chapter393.chronology?.exactClockTime === null, 'Chapter 393 must not invent an exact clock time');
  assert(chapterModule.succession393TimelineEvents.length === 15, 'dedicated research must preserve all 15 maintained Chapter 393 timeline beats');

  const events393 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 393 && event.chapterRange?.end === 393);
  const eventIds = new Set(events393.map((event) => event.id));
  for (const id of [
    'event:luini-troupe-confrontation',
    'event:troupe-declares-heilly-destruction-priority',
    'event:heilly-reassesses-after-luini-death',
    'event:morena-counter-ability-design-coaching',
    'event:lynch-zakuro-recover-after-apparent-hisoka',
    'event:hinrigh-apparent-hisoka-vvip-negotiation',
    'event:keni-maizan-matched-intelligence-deal',
    'event:room3101-mafia-wall-verification',
    'event:room3101-maizan-disappearance-test',
  ]) assert(eventIds.has(id), `${id} must exist at the Chapter 393 canonical event boundary`);

  const luiniEvent = archive.getEntityById('event:luini-troupe-confrontation');
  assert(luiniEvent?.locationIds?.includes('location:black-whale:tier-5'), 'corrected Luini confrontation must be attached to Tier 5');
  assert(!luiniEvent?.locationIds?.includes('location:black-whale:tier-3'), 'old coarse Tier 3 Luini confrontation location must be retired');
  assert(/kills Luini|definitively killed|Luini is definitively killed/i.test(text(luiniEvent)), 'Luini confrontation must preserve Luini’s death');
  const luini392 = archive.getCharacterStateAtChapter('character:luini', 392);
  const luini393 = archive.getCharacterStateAtChapter('character:luini', 393);
  assert(luini392?.life === 'alive', 'Luini must remain alive at the Chapter 392 boundary');
  assert(luini393?.life === 'dead' && /Nobunaga|katana|deceased/i.test(text(luini393)), 'Luini must become dead in Chapter 393');

  const luiniAbility = archive.getAbilityKnowledgeAtChapter('ability:luini-transportation', 393);
  assert(luiniAbility?.known && /dead|killed/i.test(text(luiniAbility)), 'Luini spatial ability knowledge must reflect the living user’s Chapter 393 death');
  assert(luiniAbility.ability?.classification?.nenTypes?.includes('unknown'), 'Luini Nen type must remain unknown');
  assert(/Perigord/i.test(text(luiniAbility)) && /inference|judgment|not upgraded|not.*confirm/i.test(text(luiniAbility)), 'Perigord’s Emitter assessment must remain non-canonical inference');
  assert(/post-mortem/i.test(text(luiniAbility)) && /not established|no post-mortem/i.test(text(luiniAbility)), 'Luini ability must not invent post-mortem continuation');

  const contagion = archive.getAbilityKnowledgeAtChapter('ability:contagion', 393);
  assert(contagion?.known && /level 21/i.test(text(contagion)), 'Contagion Chapter 393 knowledge must preserve the level-21 ability-development discussion');
  assert(/innate Nen type|innate.*type/i.test(text(contagion)), 'Contagion Chapter 393 knowledge must preserve the innate-type constraint');
  assert(/hypothetical|design advice|not an actual ability/i.test(text(contagion)), 'Morena’s hit-count example must remain hypothetical coaching');
  const abilities393 = archive.getEntitiesByType('ability').filter((ability) => ability.firstChapter === 393 || ability.sourceChapterNumbers?.includes(393));
  assert(!abilities393.some((ability) => /how many hits|number of hits.*defeat/i.test(`${ability.name} ${ability.summary}`)), 'Morena’s hypothetical hit-count example must not become an ability entity');

  const voconte = archive.getEntityById('ability:voconte-door-ability');
  const voconteKnowledge = archive.getAbilityKnowledgeAtChapter('ability:voconte-door-ability', 393);
  assert(voconte?.firstChapter === 393 && voconteKnowledge?.known, 'Voconte descriptive door ability must enter at Chapter 393');
  assert(voconte.classification?.nenTypes?.includes('unknown'), 'Voconte door technique’s own Nen category must remain unknown');
  assert(/owner.*Emitter|Voconte.*Emitter/i.test(text(voconteKnowledge)), 'Voconte’s confirmed natural Emitter type must remain distinguishable from the ability category');
  assert(/not.*infer|not automatically|does not infer/i.test(text(voconteKnowledge)), 'archive must reject owner-type-to-ability-category overreach');

  const apparentDeal = archive.getEntityById('event:hinrigh-apparent-hisoka-vvip-negotiation');
  assert(apparentDeal && apparentDeal.participantIds?.includes('character:hinrigh-biganduffno'), 'cinema negotiation must retain Hinrigh as participant');
  assert(!apparentDeal.participantIds?.includes('character:hisoka-morow'), 'Chapter 393 cinema event must not objectively tag Hisoka');
  assert(!apparentDeal.participantIds?.includes('character:bonolenov-ndongo'), 'Chapter 405 Bonolenov identity must not be backfilled into Chapter 393');
  assert(!/Metamorphorsen/i.test(text(apparentDeal)), 'Metamorphorsen must not leak into Chapter 393 event mechanics');
  assert(/VVIP|Tier 1/i.test(text(apparentDeal)) && /attacked first|attacks first|initiat/i.test(text(apparentDeal)), 'cinema event must preserve the temporary non-initiation terms');

  const lynch393 = archive.getCharacterStateAtChapter('character:lynch-fullbokko', 393);
  const zakuro393 = archive.getCharacterStateAtChapter('character:zakuro-custard', 393);
  assert(lynch393?.life === 'alive' && zakuro393?.life === 'alive', 'Lynch and Zakuro must both remain alive after recovery');

  const maizan393 = archive.getCharacterStateAtChapter('character:maizan', 393);
  assert(maizan393 && maizan393.life !== 'dead', 'Maizan must not be marked dead after the Room 3101 disappearance');
  assert(/unknown|unresolved|unobservable/i.test(text(maizan393)), 'Maizan body/consciousness state must remain unresolved after disappearance');
  const roomEvent = archive.getEntityById('event:room3101-maizan-disappearance-test');
  assert(roomEvent?.locationIds?.includes('location:black-whale:tier-3:room-3101'), 'Room 3101 disappearance must use the canonical Room 3101 location');
  assert(/knife/i.test(text(roomEvent)) && /does not disappear|does not.*disappear/i.test(text(roomEvent)), 'Room 3101 event must preserve the non-disappearing knife observation');
  assert(/no destination|destination.*unresolved|trigger.*unresolved|no.*transport rule|does not infer/i.test(text(roomEvent)), 'Room 3101 event must not invent the disappearance mechanism');
  assert(!/teleport(?:ed|ation)? Maizan|Maizan was teleported/i.test(text(roomEvent)), 'Room 3101 event must not positively label Maizan’s disappearance as teleportation');

  const roomLead = archive.getEntityById('event:room3101-mafia-wall-verification');
  assert(/Room 3101/i.test(text(roomLead)) && /wall/i.test(text(roomLead)) && /plumbing/i.test(text(roomLead)), 'Room 3101 lead must preserve the wall/plumbing evidence');
  assert(/Heil-Ly ownership remains unconfirmed|not automatically.*Heil-Ly|not.*confirm/i.test(text(roomLead)), 'Room 3101 must not yet be declared confirmed Heil-Ly territory');

  const keniDeal = archive.getEntityById('event:keni-maizan-matched-intelligence-deal');
  assert(/fifty-million|50-million|50 million/i.test(text(keniDeal)) && /five-million|5-million|5 million/i.test(text(keniDeal)), 'Ken’i deal must preserve both the 50M match and 5M identification incentive');
  assert(/Fourth Prince approval.*statement|statement.*Fourth Prince approval|preserved as.*statement/i.test(text(keniDeal)), 'Fourth Prince approval must remain Ken’i’s statement rather than independent confirmation');
  const keniState = archive.getCharacterStateAtChapter('character:ken-i-wang', 393);
  assert(!/smile.*ability|Nen.*smile|curse.*smile/i.test(text(keniState)), 'Ken’i smile rumor must not become a Nen/curse mechanic');

  const heilLyState = archive.getOrganizationStateAtChapter('organization:heil-ly', 393);
  const troupeState = archive.getOrganizationStateAtChapter('organization:phantom-troupe', 393);
  const xiYuState = archive.getOrganizationStateAtChapter('organization:xi-yu', 393);
  const chaRState = archive.getOrganizationStateAtChapter('organization:cha-r', 393);
  assert(/Luini.*dead|Luini has been killed/i.test(text(heilLyState)) && /level 21|ability development/i.test(text(heilLyState)), 'Heil-Ly state must preserve Luini loss and ability-development pressure');
  assert(/destroy Heil-Ly|Heil-Ly.*destruction/i.test(text(troupeState)) && /Hisoka/i.test(text(troupeState)), 'Troupe state must preserve both Heil-Ly destruction priority and continuing Hisoka hunt');
  assert(/Room 3101/i.test(text(xiYuState)) && /Room 3101/i.test(text(chaRState)), 'Xi-Yu and Cha-R must both expose the joint Room 3101 operation');

  const publicTimeline393 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 393);
  assert(publicTimeline393.length === chapterModule.succession393TimelineEvents.length, 'public timeline must replace legacy Chapter 393 chronology with all maintained beats');
  assert(publicTimeline393.some((event) => event.id === '393-nobunaga-kills-luini'), 'public timeline must contain Luini’s death');
  assert(publicTimeline393.some((event) => event.id === '393-maizan-disappears-inside-room3101'), 'public timeline must contain Maizan’s Room 3101 disappearance');
  assert(!publicTimeline393.some((event) => /Bonolenov|Metamorphorsen/i.test(text(event))), 'public Chapter 393 timeline must not leak Chapter 405 identity knowledge');

  const activeAbilityNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  assert(activeAbilityNames.has('Luini transportation ability') && activeAbilityNames.has('Contagion') && activeAbilityNames.has('Voconte’s Door Ability'), 'active dossier must include the three Chapter 393 ability/system records');
  assert(!new Set((frozen392.successionAbilities || []).map((record) => record.ability)).has('Voconte’s Door Ability'), 'frozen through-392 dossier must not know Voconte’s Chapter 393 door ability');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 393')), 'active dossier must include the Chapter 393 operational group');

  const note = fs.readFileSync('docs/source-notes/chapter-393.md', 'utf8');
  assert(/Tier 5 Cha-R office/i.test(note) && /Luini.*dead|dead at Chapter 393/i.test(note), 'source note must preserve Luini location and death boundary');
  assert(/Perigord.*Emitter/i.test(note) && /character judgment|not.*confirmed/i.test(note), 'source note must preserve the Luini-type inference boundary');
  assert(/Chapter 405/i.test(note) && /not backfilled/i.test(note), 'source note must quarantine the retrospective identity reveal');
  assert(/Maizan.*not marked dead|not.*dead/i.test(note) && /knife.*does not.*disappear/i.test(note), 'source note must preserve Room 3101 uncertainty and the knife observation');

  console.log(`Chapter 393 boundary audit passed: ${events393.length} canonical Chapter 393 events preserve Luini’s death, Heil-Ly ability-development adaptation, the apparent-Hisoka identity quarantine, Ken’i/Maizan intelligence terms, and the unresolved Room 3101 disappearance.`);
} finally {
  await vite.close();
}
