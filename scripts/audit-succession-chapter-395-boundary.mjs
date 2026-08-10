import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 395 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession395Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen394 = await vite.ssrLoadModule('/src/data/successionDossierThrough394.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index394 = numbers.indexOf(394);
  assert(index394 >= 0 && numbers[index394 + 1] === 395, 'maintained publication chain must place Chapter 395 directly after Chapter 394');
  assert(numbers[numbers.indexOf(395) + 1] === 396 && numbers[numbers.indexOf(396) + 1] === 400, 'Chapter 395 must lead into maintained Chapter 396 before the pre-existing Chapter 400 maintained packet');

  const chapter395 = chapterModule.succession395ChapterResearch?.[0];
  assert(chapter395?.number === 395, 'dedicated Chapter 395 research must load');
  assert(chapter395.title === null && chapter395.titleStatus === 'not-supplied-no-title-invented', 'Chapter 395 title must remain unsupplied');
  assert(chapter395.voyageDay === 'Voyage Day 10', 'Chapter 395 current-day opening must retain Voyage Day 10 continuity');
  assert(chapter395.chronology?.exactClockTime === null, 'Chapter 395 must not invent an exact clock time');
  assert(/undated.*Meteor City|exact year.*not supplied|flashback/i.test(text(chapter395.chronology)), 'Chapter 395 chronology must explicitly separate the undated Meteor City flashback');
  assert(chapterModule.succession395TimelineEvents.length === 11, 'dedicated research must preserve all 11 maintained Chapter 395 timeline beats');

  const events395 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 395 && event.chapterRange?.end === 395);
  const eventIds = new Set(events395.map((event) => event.id));
  const dedicatedEventIds = [
    'event:hinrigh-footage-confirms-heilly-spatial-access',
    'event:mafia-military-heilly-pursuit-briefing',
    'event:troupe-breaches-room3102-wall',
    'event:troupe-finds-recently-used-heilly-hidden-room',
    'event:meteor-city-childhood-tape-chase',
    'event:childhood-phinks-feitan-chrollo-tape-swap',
    'event:chrollo-all-faiths-church-abduction-context',
    'event:chrollo-pakunoda-discovers-power-cleaners',
    'event:lisores-elder-discuss-chrollo-potential',
    'event:chrollo-pakunoda-power-cleaners-dubbing-plan',
    'event:sheila-sarasa-join-dubbing-unidentified-children-abducted',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 395 canonical event boundary`);
  const projected395 = events395.filter((event) => event.maintainedResearch === true);
  assert(projected395.length === 11, 'story-intelligence must project all 11 maintained Chapter 395 research beats alongside the dedicated canonical event foundation');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 395 event IDs must remain distinct from the maintained-research projection layer');

  const footage = archive.getEntityById('event:hinrigh-footage-confirms-heilly-spatial-access');
  assert(/Nen/i.test(text(footage)) && /spatial|teleport/i.test(text(footage)), 'Hinrigh footage event must preserve the Nen-mediated spatial-access conclusion');
  assert(/responsible user|specific user|user.*unresolved|mechanism.*unresolved|remain unresolved/i.test(text(footage)), 'Hinrigh footage event must preserve unresolved ownership/mechanics');
  assert(!/(Voconte|Luini|Gateaume).{0,80}(causes|caused|operates|activates|teleports|transports)/i.test(text(footage)), 'Chapter 395 footage must not assign the observed access to Voconte, Luini, or Gateaume');

  const hinrigh395 = archive.getCharacterStateAtChapter('character:hinrigh-biganduffno', 395);
  assert(/teleport|spatial access/i.test(text(hinrigh395)) && /Nen/i.test(text(hinrigh395)), 'Hinrigh state must include his Chapter 395 spatial-access conclusion');
  assert(/does not identify|user.*unresolved|which Heil-Ly user|mechanics.*unresolved/i.test(text(hinrigh395)), 'Hinrigh state must not know the spatial operator or full mechanics');

  const briefing = archive.getEntityById('event:mafia-military-heilly-pursuit-briefing');
  assert(/sealed/i.test(text(briefing)) && /empty/i.test(text(briefing)), 'joint briefing must preserve the sealed and empty registered Heil-Ly office');
  assert(/alive|capture/i.test(text(briefing)) && /Borksen/i.test(text(briefing)), 'joint briefing must preserve live-capture intent and Borksen’s participation');

  const room3102 = archive.getEntityById('location:black-whale:tier-3:room-3102');
  const hiddenRoom = archive.getEntityById('location:black-whale:tier-3:heilly-hidden-room');
  const meteorCity = archive.getEntityById('location:meteor-city');
  const church = archive.getEntityById('location:meteor-city:all-faiths-church');
  const videoRoom = archive.getEntityById('location:meteor-city:all-faiths-church:video-room');
  const outskirts = archive.getEntityById('location:meteor-city:outskirts');
  assert(room3102 && hiddenRoom && meteorCity && church && videoRoom && outskirts, 'Chapter 395 spatial and Meteor City locations must all exist');

  const breach = archive.getEntityById('event:troupe-breaches-room3102-wall');
  assert(breach?.locationIds?.includes('location:black-whale:tier-3:room-3102'), 'Troupe breach must be attached to Room 3102');
  assert(breach?.locationIds?.includes('location:black-whale:tier-3:heilly-hidden-room'), 'Troupe breach must reach the hidden room');
  assert(/physical|cuts?|katana|wall/i.test(text(breach)), 'Room 3102 breach must remain a physical wall cut');
  assert(!/Nobunaga.{0,100}(teleport|spatial ability)|teleport.{0,100}Nobunaga/i.test(text(breach)), 'Nobunaga’s wall cut must not be rewritten as teleportation');

  const hidden = archive.getEntityById('event:troupe-finds-recently-used-heilly-hidden-room');
  assert(/food|drinks|recent/i.test(text(hidden)), 'hidden-room event must preserve evidence of recent occupancy');
  assert(/scapegoat|hypothes|suggest/i.test(text(hidden)), 'Luini scapegoat interpretation must remain framed as Nobunaga’s suggestion');

  const flashbackIds = [
    'event:meteor-city-childhood-tape-chase',
    'event:childhood-phinks-feitan-chrollo-tape-swap',
    'event:chrollo-all-faiths-church-abduction-context',
    'event:chrollo-pakunoda-discovers-power-cleaners',
    'event:lisores-elder-discuss-chrollo-potential',
    'event:chrollo-pakunoda-power-cleaners-dubbing-plan',
    'event:sheila-sarasa-join-dubbing-unidentified-children-abducted',
  ];
  for (const id of flashbackIds) {
    const event = archive.getEntityById(id);
    assert(event?.chronology?.day === null, `${id} must not be placed on Voyage Day 10 as historical story-time`);
    assert(/flashback|pre-voyage|Meteor City childhood/i.test(text(event.chronology)), `${id} must be explicitly marked as historical flashback story-time`);
  }

  for (const id of ['character:uvogin', 'character:pakunoda', 'character:shalnark']) {
    const current = archive.getCharacterStateAtChapter(id, 395);
    assert(current?.life === 'dead', `${id} must remain dead at the Chapter 395 publication-state boundary despite appearing alive in the childhood flashback`);
    const explicit395 = archive.getCharacterStateTimeline(id).find((record) => record.chapterRange?.start === 395);
    assert(!explicit395, `${id} must not receive a present-day Chapter 395 resurrection state`);
  }
  const sarasa395 = archive.getCharacterStateAtChapter('character:sarasa', 395);
  assert(sarasa395?.life !== 'dead', 'Sarasa’s Chapter 397 death must not leak backward into the Chapter 395 publication-state selector');
  assert(!archive.getCharacterStateTimeline('character:sarasa').some((record) => record.chapterRange?.start === 395), 'Sarasa must not receive an invented present-day Chapter 395 state');

  const chrolloPakunoda = archive.getEntityById('relationship:chrollo-pakunoda-ch395-childhood-friendship');
  assert(chrolloPakunoda && /friendship/i.test(text(chrolloPakunoda)), 'Chrollo/Pakunoda childhood friendship relationship must exist');
  assert(/not.*biological|no biological|teasing/i.test(text(chrolloPakunoda)), 'Pakunoda’s little-brother wording must not become biological kinship');

  const endEvent = archive.getEntityById('event:sheila-sarasa-join-dubbing-unidentified-children-abducted');
  assert(/three unidentified|three unnamed|unidentified children/i.test(text(endEvent)), 'Chapter 395 ending must keep the van captives unidentified');
  assert(!/(Sarasa|Sheila|Pakunoda).{0,60}(abducted|kidnapped|bound in.*van|hooded)/i.test(String(endEvent.summary || '')), 'Chapter 395 must not identify a named child as one of the van captives');
  assert(/wants to become a Hunter|aspiration to become a Hunter/i.test(text(endEvent)), 'Sheila’s childhood Hunter aspiration must be preserved');

  const churchContext = archive.getEntityById('event:chrollo-all-faiths-church-abduction-context');
  assert(/70%|under fifteen|under 15/i.test(text(churchContext)), 'Meteor City context must preserve the narrated child-casualty statistic');
  assert(/formal Phantom Troupe founding.*not|founding.*not depicted|does not.*formal/i.test(text(churchContext)), 'Meteor City context must stop before the formal Troupe founding');

  const orgTroupe395 = archive.getOrganizationStateAtChapter('organization:phantom-troupe', 395);
  assert(/Nobunaga/i.test(text(orgTroupe395)) && /Phinks/i.test(text(orgTroupe395)) && /Feitan/i.test(text(orgTroupe395)), 'Troupe organization state must preserve the three-member hidden-room team');
  assert(/formal founding|without showing|does not.*founding/i.test(text(orgTroupe395)), 'Troupe organization state must keep the formal founding outside Chapter 395');

  const orgHeilLy395 = archive.getOrganizationStateAtChapter('organization:heil-ly', 395);
  assert(/spatial|teleport/i.test(text(orgHeilLy395)) && /hidden room/i.test(text(orgHeilLy395)), 'Heil-Ly organization state must expose the footage and hidden-room pressure');

  const publicTimeline395 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 395);
  assert(publicTimeline395.length === chapterModule.succession395TimelineEvents.length, 'public timeline must expose all maintained Chapter 395 narrative beats');
  assert(publicTimeline395.some((event) => event.id === '395-hinrigh-footage-teleportation-conclusion'), 'public timeline must contain Hinrigh’s footage conclusion');
  assert(publicTimeline395.some((event) => event.id === '395-sheila-sarasa-join-dubbing-recording-begins'), 'public timeline must contain the dubbing/abduction parallel ending');

  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 395')), 'active dossier must include the Chapter 395 operational/history group');
  assert(!(frozen394.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 395')), 'frozen through-394 dossier must remain unaware of Chapter 395');
  assert((dossier.successionResolvedQuestions || []).some((record) => record.chapter === 395 && /camcorder footage/i.test(String(record.question || ''))), 'active dossier must publish the Chapter 395 camcorder resolution');

  const note = fs.readFileSync('docs/source-notes/chapter-395.md', 'utf8');
  assert(/specific Heil-Ly member|not.*assigned.*Voconte|not.*assigned automatically/i.test(note), 'source note must preserve unresolved teleportation ownership');
  assert(/physical wall breach/i.test(note) && /Room 3102/i.test(note), 'source note must preserve the physical Room 3102 breach');
  assert(/does \*\*not\*\* resurrect|does not.*resurrect/i.test(note), 'source note must preserve flashback/current-state separation');
  assert(/not.*biological sibling|does \*\*not\*\* create a biological sibling/i.test(note), 'source note must preserve the little-brother non-kinship boundary');
  assert(/three unidentified abducted children|does not identify these captives/i.test(note), 'source note must keep the three van children unidentified');
  assert(/No Chapter 396\+|No Chapter 396\+ knowledge|Chapter 396\+.*not imported/i.test(note), 'source note must quarantine Chapter 396+ knowledge');

  console.log(`Chapter 395 boundary audit passed: ${dedicatedEventIds.length} dedicated canonical events plus ${projected395.length} maintained-research projections preserve Hinrigh’s Nen-spatial conclusion without invented ownership, the Room 3102 physical breach, the undated Meteor City childhood layer, present-state death boundaries, and the unidentified-captive / no-396+ quarantine.`);
} finally {
  await vite.close();
}