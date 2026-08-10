import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 392 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession392Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index391 = numbers.indexOf(391);
  assert(index391 >= 0 && numbers[index391 + 1] === 392, 'maintained publication chain must place Chapter 392 directly after Chapter 391');
  assert(numbers[numbers.indexOf(392) + 1] === 393 && numbers[numbers.indexOf(393) + 1] === 394 && numbers[numbers.indexOf(394) + 1] === 395 && numbers[numbers.indexOf(395) + 1] === 396 && numbers[numbers.indexOf(396) + 1] === 400, 'Chapter 392 must hand through Chapters 393, 394, 395, and 396 before the pre-existing Chapter 400 maintained packet');

  const chapter392 = chapterModule.succession392ChapterResearch?.[0];
  assert(chapter392?.number === 392, 'dedicated Chapter 392 research must load');
  assert(chapter392.title === null && chapter392.titleStatus === 'not-supplied-no-title-invented', 'Chapter 392 title must remain unsupplied');
  assert(chapter392.voyageDay === 'Voyage Day 10', 'Chapter 392 must retain Voyage Day 10 continuity');
  assert(chapter392.chronology?.exactClockTime === null, 'Chapter 392 must not invent an exact clock time');
  assert(chapterModule.succession392TimelineEvents.length === 13, 'dedicated research must preserve all 13 maintained Chapter 392 timeline beats');

  const events392 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 392 && event.chapterRange?.end === 392);
  const eventIds = new Set(events392.map((event) => event.id));
  for (const id of [
    'event:padaille-corpse-public-cover-after-death',
    'event:maizan-sells-unplanned-room-lead',
    'event:misha-post-mortem-padaille-disposal',
    'event:lynch-hanal-body-and-soul-hisoka-check',
    'event:xiyu-finds-man-believed-to-be-hisoka',
    'event:apparent-hisoka-reflex-counter-drops-lynch',
    'event:tsudonke-buys-area-e-gossip',
    'event:tsudonke-autograph-paper-shipment-deadlines',
    'event:keni-expands-cha-r-hisoka-search',
    'event:keni-hisoka-balance-strategy',
    'event:troupe-cha-r-office-two-person-search-plan',
    'event:luini-probes-cha-r-office-through-opening',
    'event:luini-directly-confronts-troupe',
  ]) assert(eventIds.has(id), `${id} must exist at the Chapter 392 canonical event boundary`);

  const apparentFind = archive.getEntityById('event:xiyu-finds-man-believed-to-be-hisoka');
  const apparentCounter = archive.getEntityById('event:apparent-hisoka-reflex-counter-drops-lynch');
  for (const event of [apparentFind, apparentCounter]) {
    assert(event && !event.participantIds?.includes('character:hisoka-morow'), 'apparent-Hisoka events must not objectively tag Hisoka at the Chapter 392 boundary');
    assert(!event.participantIds?.includes('character:bonolenov-ndongo'), 'Chapter 405 Bonolenov identity must not be backfilled into Chapter 392 event participants');
    assert(!/Metamorphorsen/i.test(text(event)), 'Metamorphorsen must not leak into Chapter 392 event mechanics');
  }

  const misha391 = archive.getAbilityKnowledgeAtChapter('ability:misha-post-mortem-disposal', 391);
  const misha392 = archive.getAbilityKnowledgeAtChapter('ability:misha-post-mortem-disposal', 392);
  assert(!misha391?.known, 'Misha’s post-mortem disposal ability must not be known at Chapter 391');
  assert(misha392?.known && /post-mortem/i.test(text(misha392)) && /dispose|disposal/i.test(text(misha392)), 'Chapter 392 must reveal Misha’s post-mortem disposal purpose');
  assert(/official.*name.*unsupplied|descriptive/i.test(text(misha392)), 'Misha ability must preserve the unnamed/descriptive-label boundary');
  assert(/range|visibility/i.test(text(misha392.mechanics?.limitations)) && /unresolved|unknown/i.test(text(misha392.mechanics?.limitations)), 'Misha ability must preserve unresolved range/visibility mechanics');

  const body391 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 391);
  const body392 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 392);
  assert(body391?.known && /no new activation|does not activate/i.test(text(body391)), 'Chapter 391 Body and Soul boundary must remain frozen');
  assert(body392?.known && /Hanal/i.test(text(body392)) && /inner soul/i.test(text(body392)), 'Chapter 392 Body and Soul knowledge must preserve Hanal’s negative identity answer');
  assert(/seemingly fails|seemingly.*fail|counter/i.test(text(body392)) && /unresolved|unknown/i.test(text(body392)), 'apparent-Hisoka Body and Soul failure/counter mechanism must remain unresolved');

  const padaille392 = archive.getCharacterStateAtChapter('character:padaille', 392);
  const mishaState = archive.getCharacterStateAtChapter('character:misha-hao', 392);
  const lynchState = archive.getCharacterStateAtChapter('character:lynch-fullbokko', 392);
  const kenState = archive.getCharacterStateAtChapter('character:ken-i-wang', 392);
  const luiniState = archive.getCharacterStateAtChapter('character:luini', 392);
  assert(padaille392?.life === 'dead' && /corpse|deceased/i.test(text(padaille392)), 'Padaille must remain dead while Misha disposes of his corpse');
  assert(mishaState?.life === 'dead' && /post-mortem/i.test(text(mishaState)), 'Misha must remain deceased with post-mortem operational state');
  assert(lynchState?.life === 'alive' && /groan|alive|incapacitated/i.test(text(lynchState)), 'Lynch must remain alive after the apparent-Hisoka counter');
  assert(/top priority|balance|Hisoka/i.test(text(kenState)), 'Ken’i Chapter 392 state must preserve his Hisoka-first balance strategy');
  assert(luiniState?.life === 'alive' && /confront/i.test(text(luiniState)), 'Luini must remain alive and confronting the Troupe at the Chapter 392 boundary');

  const maizanEvent = archive.getEntityById('event:maizan-sells-unplanned-room-lead');
  assert(/50 million/i.test(text(maizanEvent)) && /30 million/i.test(text(maizanEvent)), 'Maizan intelligence transaction must preserve both stated price points');
  assert(/inference|unverified|guess/i.test(text(maizanEvent)), 'Maizan’s Heil-Ly attribution must remain unverified inference');

  const chaR392 = archive.getOrganizationStateAtChapter('organization:cha-r', 392);
  const xiYu392 = archive.getOrganizationStateAtChapter('organization:xi-yu', 392);
  assert(/Hisoka/i.test(text(chaR392)) && /balance|Troupe|Heil-Ly/i.test(text(chaR392)), 'Cha-R Chapter 392 state must preserve the Hisoka/Troupe/Heil-Ly balancing plan');
  assert(/Maizan|Misha|Hisoka/i.test(text(xiYu392)), 'Xi-Yu Chapter 392 state must preserve Misha cleanup, Maizan lead, and apparent-Hisoka contact');

  const publicTimeline392 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 392);
  assert(publicTimeline392.length === chapterModule.succession392TimelineEvents.length, 'public timeline must replace legacy Chapter 392 chronology with the maintained packet');
  assert(publicTimeline392.some((event) => event.id === '392-misha-postmortem-disposal-reveal'), 'public timeline must include Misha’s post-mortem reveal');
  assert(publicTimeline392.some((event) => event.id === '392-luini-confronts-troupe'), 'public timeline must include Luini’s direct Troupe confrontation');
  assert(!publicTimeline392.some((event) => /Metamorphorsen|Bonolenov/i.test(text(event))), 'public Chapter 392 timeline must not leak the later identity reveal');

  const dossierNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  assert(dossierNames.has('Body and Soul'), 'active dossier must retain Body and Soul');
  assert(dossierNames.has('Misha Hao’s Post-Mortem Disposal Ability'), 'active dossier must include the descriptive Misha post-mortem ability record');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 392')), 'active dossier must retain the Chapter 392 operational group after later overlays');

  const note = fs.readFileSync('docs/source-notes/chapter-392.md', 'utf8');
  assert(/Chapter 405/i.test(note) && /retrospective|later knowledge|not backfilled/i.test(note), 'source note must quarantine the later identity reveal as retrospective knowledge');
  assert(/Padaille.*dead|remains dead/i.test(note), 'source note must preserve Padaille’s death through Misha’s cleanup sequence');
  assert(/30 million/i.test(note) && /50 million/i.test(note), 'source note must preserve the Maizan transaction amounts');
  assert(/Luini.*alive|alive.*Luini/i.test(note), 'source note must preserve Luini alive at the Chapter 392 boundary');

  console.log(`Chapter 392 boundary audit passed: ${events392.length} canonical Chapter 392 events preserve Misha’s post-mortem cleanup, Maizan’s unverified room lead, Body and Soul’s Hanal check, the apparent-Hisoka identity quarantine, Cha-R balance strategy, and Luini’s live Troupe confrontation.`);
} finally {
  await vite.close();
}