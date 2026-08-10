import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 396 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession396Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen395 = await vite.ssrLoadModule('/src/data/successionDossierThrough395.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index395 = numbers.indexOf(395);
  assert(index395 >= 0 && numbers[index395 + 1] === 396, 'maintained publication chain must place Chapter 396 directly after Chapter 395');
  assert(numbers[numbers.indexOf(396) + 1] === 400, 'Chapter 396 must remain before the pre-existing Chapter 400 maintained packet');

  const chapter396 = chapterModule.succession396ChapterResearch?.[0];
  assert(chapter396?.number === 396, 'dedicated Chapter 396 research must load');
  assert(chapter396.title === null && chapter396.titleStatus === 'not-supplied-no-title-invented', 'Chapter 396 title must remain unsupplied');
  assert(chapter396.voyageDay === 'Voyage Day 10', 'Chapter 396 must retain the Voyage Day 10 framing narrative');
  assert(chapter396.chronology?.exactClockTime === null, 'Chapter 396 must not invent an exact clock time');
  assert(/entire.*flashback|every.*scene.*flashback|Meteor City childhood/i.test(text(chapter396.chronology)), 'Chapter 396 chronology must explicitly remain in the Meteor City childhood flashback');
  assert(/no present-day Black Whale|no present-day.*state|historical.*separate/i.test(text(chapter396.chronology)), 'Chapter 396 chronology must not manufacture a present-day Black Whale update');
  assert(chapterModule.succession396TimelineEvents.length === 10, 'dedicated research must preserve all 10 maintained Chapter 396 timeline beats');

  const events396 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 396 && event.chapterRange?.end === 396);
  const eventIds = new Set(events396.map((event) => event.id));
  const dedicatedEventIds = [
    'event:meteor-city-church-screening-preparation',
    'event:power-cleaners-dub-screening-success',
    'event:chrollo-live-dub-after-tape-failure',
    'event:chrollo-graffino-clean-sweep-performance',
    'event:sarasa-dubs-uvogin-defuses-confrontation',
    'event:uvogin-handshake-performance-cast-expands',
    'event:childhood-performers-adopt-troupe-label',
    'event:uvogin-world-tour-villain-performance-goal',
    'event:sarasa-leaves-for-uga-forest-tape-search',
    'event:meteor-city-kidnappers-consider-one-more-victim',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 396 canonical event boundary`);
  const projected396 = events396.filter((event) => event.maintainedResearch === true);
  assert(projected396.length === 10, 'story-intelligence must project all 10 maintained Chapter 396 research beats alongside the dedicated canonical event foundation');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 396 event IDs must remain distinct from the maintained-research projection layer');

  for (const id of dedicatedEventIds) {
    const event = archive.getEntityById(id);
    assert(event?.chronology?.day === null, `${id} must remain historical flashback story-time rather than a literal Voyage Day 10 event`);
    assert(/Meteor City childhood|pre-voyage|flashback/i.test(text(event.chronology)), `${id} must explicitly preserve the historical flashback layer`);
  }

  const auditorium = archive.getEntityById('location:meteor-city:all-faiths-church:auditorium');
  const ugaForest = archive.getEntityById('location:meteor-city:uga-forest');
  const corporateDump = archive.getEntityById('location:meteor-city:corporate-dump-near-uga-forest');
  assert(auditorium && ugaForest && corporateDump, 'Chapter 396 auditorium, Uga Forest, and corporate-dump locations must all exist');
  assert(auditorium.parentId === 'location:meteor-city:all-faiths-church', 'screening auditorium must remain under the All-Faiths Church');
  assert(/exact boundaries|distance|route/i.test(text(ugaForest)) || /does not provide/i.test(text(ugaForest)), 'Uga Forest record must not invent precise geography');
  assert(/intends|intended|does not depict.*arriv/i.test(text(corporateDump)), 'corporate-dump location must remain Sarasa’s intended destination rather than a confirmed arrival point');

  const prep = archive.getEntityById('event:meteor-city-church-screening-preparation');
  assert(/flowers/i.test(text(prep)) && /graves/i.test(text(prep)), 'screening preparation must preserve Chrollo’s daily grave-flower behavior');
  assert(/little brother|little-brother/i.test(text(prep)) && /not.*biological|rather than biological/i.test(text(prep)), 'screening preparation must preserve the non-biological little-brother boundary');
  assert(/Phinks/i.test(text(prep)) && /snacks/i.test(text(prep)), 'screening preparation must preserve Sarasa getting Phinks to help with snacks');

  const liveDub = archive.getEntityById('event:chrollo-live-dub-after-tape-failure');
  assert(/tangled|tape/i.test(text(liveDub)) && /microphone|three-count|count/i.test(text(liveDub)), 'live-dub event must preserve the tape failure and Chrollo’s synchronized restart');
  assert((liveDub?.abilityIds || []).length === 0, 'Chrollo’s voice performance must not be encoded as a Nen ability');

  const graffino = archive.getEntityById('event:chrollo-graffino-clean-sweep-performance');
  assert(/Graffino/i.test(text(graffino)) && /Clean Sweep/i.test(text(graffino)), 'performance event must preserve Graffino and the Clean Sweep finale');
  assert(/acting|not a criminal declaration|stage/i.test(text(graffino)), 'Chrollo’s frightening villain performance must remain acting rather than criminal ideology');

  const uvogin = archive.getEntityById('event:uvogin-handshake-performance-cast-expands');
  assert(/harder than any punch|shake|hand/i.test(text(uvogin)), 'Uvogin event must preserve his praise and handshake with Chrollo');
  assert(/Nobunaga/i.test(text(uvogin)) && /Feitan/i.test(text(uvogin)) && /Phinks/i.test(text(uvogin)) && /Shalnark/i.test(text(uvogin)) && /Franklin/i.test(text(uvogin)) && /Machi/i.test(text(uvogin)), 'expanded-cast event must preserve the wider childhood performers');
  assert((uvogin?.organizationIds || []).length === 0, 'childhood casting must not automatically create formal Phantom Troupe organization membership');

  const naming = archive.getEntityById('event:childhood-performers-adopt-troupe-label');
  assert(/troupe/i.test(text(naming)) && /another word|complete group name remains unresolved|full.*name.*unresolved/i.test(text(naming)), 'naming event must preserve the incomplete “troupe” label');
  assert(/formal Phantom Troupe name.*not|not.*formal Phantom Troupe|not yet established/i.test(text(naming)), 'naming event must stop before the formal Phantom Troupe name');
  assert((naming?.organizationIds || []).length === 0, 'incomplete childhood troupe naming must not be attached to the formal Phantom Troupe organization entity');
  assert(/Sheila/i.test(text(naming)) && /Sarasa/i.test(text(naming)), 'performance-troupe scene must preserve Sheila and Sarasa as participants without later membership inference');

  const villainGoal = archive.getEntityById('event:uvogin-world-tour-villain-performance-goal');
  assert(/world’s greatest villain|world's greatest villain/i.test(text(villainGoal)) && /tour.*world|world.*tour/i.test(text(villainGoal)), 'Uvogin event must preserve his world-tour/world-greatest-villain goal');
  assert(/acting|stage|performance|theatrical/i.test(text(villainGoal)) && /not.*criminal|rather than a criminal/i.test(text(villainGoal)), 'Uvogin’s villain goal must remain theatrical rather than a criminal vow');

  const sarasaDeparture = archive.getEntityById('event:sarasa-leaves-for-uga-forest-tape-search');
  assert(/Uga Forest/i.test(text(sarasaDeparture)) && /Power Cleaners/i.test(text(sarasaDeparture)), 'Sarasa departure must preserve the Uga Forest tape-search motive');
  assert(/official language|title/i.test(text(sarasaDeparture)), 'Sarasa departure must preserve her memorization of the Power Cleaners title');
  assert(/alive|unharmed/i.test(text(sarasaDeparture)), 'Sarasa must remain alive and unharmed in the Chapter 396 depicted events');

  const cliffhanger = archive.getEntityById('event:meteor-city-kidnappers-consider-one-more-victim');
  assert(/three.*hostages|three.*children/i.test(text(cliffhanger)) && /unidentified/i.test(text(cliffhanger)), 'kidnapper ending must keep the three existing child hostages unidentified');
  assert(/quota/i.test(text(cliffhanger)) && /one more/i.test(text(cliffhanger)), 'kidnapper ending must preserve the quota discussion and one-more threat');
  assert(/without depicting|no Chapter 397|no.*encounter|no.*capture|selection by name/i.test(text(cliffhanger)), 'kidnapper ending must remain a threat/cliffhanger rather than a completed Sarasa abduction');

  const sarasa396 = archive.getCharacterStateAtChapter('character:sarasa', 396);
  const sarasa397 = archive.getCharacterStateAtChapter('character:sarasa', 397);
  assert(sarasa396?.life !== 'dead', 'Sarasa’s Chapter 397 death must not leak backward into the Chapter 396 publication-state selector');
  assert(sarasa396?.statusKnowledgeFromChapter === null || sarasa396?.statusKnowledgeFromChapter === undefined, 'Sarasa death knowledge must not activate at Chapter 396');
  assert(sarasa397?.life === 'dead' && sarasa397?.statusKnowledgeFromChapter === 397, 'existing Sarasa death knowledge must remain correctly gated to Chapter 397');
  assert(!archive.getCharacterStateTimeline('character:sarasa').some((record) => record.chapterRange?.start === 396), 'Sarasa’s historical flashback activity must not create an invented present-day Chapter 396 state');
  assert(!archive.getMovementHistoryForCharacter('character:sarasa').some((record) => record.chapterRange?.start === 396), 'Sarasa’s flashback walk to Uga Forest must not overwrite current-arc location history');

  for (const id of ['character:uvogin', 'character:pakunoda', 'character:shalnark']) {
    const current = archive.getCharacterStateAtChapter(id, 396);
    assert(current?.life === 'dead', `${id} must remain dead at the Chapter 396 publication-state boundary despite appearing alive in the childhood flashback`);
    assert(!archive.getCharacterStateTimeline(id).some((record) => record.chapterRange?.start === 396), `${id} must not receive a present-day Chapter 396 resurrection state`);
  }

  const chrolloUvogin = archive.getEntityById('relationship:chrollo-uvogin-ch396-performance-partnership');
  const chrolloPakunoda = archive.getEntityById('relationship:chrollo-pakunoda-ch396-childhood-support');
  const chrolloSarasa = archive.getEntityById('relationship:chrollo-sarasa-ch396-childhood-support');
  const nobunagaChrollo = archive.getEntityById('relationship:chrollo-nobunaga-ch396-creative-collaboration');
  assert(chrolloUvogin && chrolloPakunoda && chrolloSarasa && nobunagaChrollo, 'Chapter 396 childhood relationship foundation must expose all four dedicated relationships');
  assert(/not.*formal Phantom Troupe|does not yet establish/i.test(text(chrolloUvogin)), 'Chrollo/Uvogin relationship must not backfill later Troupe command structure');
  assert(/not biological|rather than biological/i.test(text(chrolloPakunoda)), 'Chrollo/Pakunoda relationship must preserve the non-kinship boundary');
  assert(/Chapter 397.*not imported|no Chapter 397/i.test(text(chrolloSarasa)), 'Chrollo/Sarasa relationship must quarantine the later outcome');

  const publicTimeline396 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 396);
  assert(publicTimeline396.length === chapterModule.succession396TimelineEvents.length, 'public timeline must expose all maintained Chapter 396 narrative beats');
  assert(publicTimeline396.some((event) => event.id === '396-chrollo-improvises-after-tape-failure'), 'public timeline must contain the live-dub recovery');
  assert(publicTimeline396.some((event) => event.id === '396-children-adopt-troupe-performance-label'), 'public timeline must contain the incomplete troupe naming');
  assert(publicTimeline396.some((event) => event.id === '396-kidnappers-consider-one-more-child'), 'public timeline must contain the kidnapper cliffhanger');

  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 396')), 'active dossier must include the Chapter 396 historical group');
  assert(!(frozen395.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 396')), 'frozen through-395 dossier must remain unaware of Chapter 396');
  assert((dossier.successionResolvedQuestions || []).some((record) => record.chapter === 396 && /group label|label.*children|What group label/i.test(String(record.question || ''))), 'active dossier must publish the Chapter 396 incomplete troupe-label resolution');
  assert((dossier.successionMysteries || []).some((record) => record.chapter === 396 && /Sarasa.*kidnappers|kidnappers.*Sarasa/i.test(String(record.question || ''))), 'active dossier must preserve the unresolved Sarasa/kidnapper cliffhanger');

  const note = fs.readFileSync('docs/source-notes/chapter-396.md', 'utf8');
  assert(/incomplete performance-group label/i.test(note) && /full formal naming/i.test(note), 'source note must preserve the incomplete troupe-name boundary');
  assert(/villain performance is acting|frightening villain performance is acting/i.test(note), 'source note must preserve Chrollo’s acting boundary');
  assert(/theatrical aspiration/i.test(note) && /criminal vow/i.test(note), 'source note must preserve Uvogin’s theatrical-villain boundary');
  assert(/does not depict the kidnappers encountering Sarasa|does not depict.*captur|Chapter 396 does not depict/i.test(note), 'source note must stop before Sarasa’s later abduction');
  assert(/death knowledge.*Chapter 397|death.*not available until Chapter 397|Chapter 397.*death/i.test(note), 'source note must quarantine Sarasa death knowledge to Chapter 397');
  assert(/No Chapter 397\+|No Chapter 397\+ Sarasa outcome|Chapter 397\+.*not backfilled/i.test(note), 'source note must explicitly quarantine Chapter 397+ knowledge');

  console.log(`Chapter 396 boundary audit passed: ${dedicatedEventIds.length} dedicated canonical events plus ${projected396.length} maintained-research projections preserve the live Power Cleaners performance, incomplete childhood “troupe” naming, theatrical villain language, flashback/current-state separation, and Sarasa’s pre-397 cliffhanger boundary.`);
} finally {
  await vite.close();
}
