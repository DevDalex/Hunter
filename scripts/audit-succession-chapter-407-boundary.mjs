import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 407 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-407.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession407Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen406Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough406.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen406Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough406.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index405 = numbers.indexOf(405);
  assert(index405 >= 0 && numbers[index405 + 1] === 406 && numbers[index405 + 2] === 407 && numbers[index405 + 3] === 408, 'maintained publication chain must be 405 → 406 → 407 → 408');

  const chapter407 = chapterModule.succession407ChapterResearch?.[0];
  assert(chapter407?.number === 407, 'Chapter 407 maintained research must load');
  assert(chapter407.title === null && /not-supplied/i.test(chapter407.titleStatus), 'Chapter 407 must not backfill an unsupplied title');
  assert(chapter407.chronology?.presentDay === true && chapter407.chronology?.spansDays?.[0] === 12, 'Chapter 407 must remain on Voyage Day 12');
  assert(/1:00 p\.m\./i.test(chapter407.chronology?.exactClockTime || ''), 'Chapter 407 chronology must preserve the explicit 1:00 p.m. Tier 3 anchor');
  assert(chapterModule.succession407TimelineEvents.length === 25, 'maintained research must preserve all 25 Chapter 407 beats');

  const events407 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 407 && event.chapterRange?.end === 407);
  const projected407 = events407.filter((event) => event.maintainedResearch === true);
  const dedicated407 = events407.filter((event) => String(event.id || '').startsWith('event:chapter407-') && !event.maintainedResearch);
  assert(projected407.length === 25, 'story intelligence must project all 25 maintained Chapter 407 beats');
  assert(dedicated407.length === 25, 'Chapter 407 must expose 25 dedicated canonical events');

  assert(!frozen406Archive.publicationBoundary407, 'frozen Through406 archive must remain unaware of the Chapter 407 publication boundary');
  assert(activeArchive.publicationBoundary407?.chapter === 407, 'active archive must advance to Through407');
  assert(/1:00 p\.m\./i.test(text(activeArchive.publicationBoundary407)), 'active Chapter 407 publication boundary must preserve the 1:00 p.m. anchor');

  const missing = archive.getEntityById('event:chapter407-borksen-missing-last-contact-thirty-minutes');
  const abduction = archive.getEntityById('event:chapter407-soldiers-infer-abduction-worst-case');
  const nenTheory = archive.getEntityById('event:chapter407-otocin-nen-heilly-assassination-hypothesis');
  assert(/roughly thirty|thirty-minute|30/i.test(text(missing)), 'Borksen missing-person event must preserve the roughly thirty-minute last-contact window');
  assert(/worst-case|worst case|inference|unknown/i.test(text(abduction)), 'soldier abduction conclusion must remain an inference rather than witnessed fact');
  assert(/speculation|hypothesis|not confirmed|not.*fact/i.test(text(nenTheory)), 'Otocin’s Nen/Heil-Ly assassination scenario must remain speculation');

  const wake = archive.getEntityById('event:chapter407-borksen-wakes-tier2-heilly-hideout');
  const memoryGap = archive.getEntityById('event:chapter407-borksen-memory-gap-nen-possibility');
  assert(/Tier 2/i.test(text(wake)) && /Heil-Ly/i.test(text(wake)) && /Morena/i.test(text(wake)), 'Borksen must wake in the Tier 2 Heil-Ly hideout facing Morena');
  assert(/cannot remember|memory/i.test(text(memoryGap)) && /possible|inference|unknown/i.test(text(memoryGap)), 'Borksen memory-gap event must keep Nen as a possibility rather than a confirmed capture mechanism');

  const borksen407 = archive.getCharacterStateAtChapter('character:borksen', 407);
  const morena407 = archive.getCharacterStateAtChapter('character:morena-prudo', 407);
  const otocin407 = archive.getCharacterStateAtChapter('character:otocin', 407);
  const momolly407 = archive.getCharacterStateAtChapter('character:momolly', 407);
  assert(/unrestrained/i.test(text(borksen407)) && /six enemies/i.test(text(borksen407)) && /weapon/i.test(text(borksen407)), 'Borksen state must preserve the unrestrained/disarmed/six-enemy room audit');
  assert(/capture.*unresolved|mechanism.*unresolved|does not identify|unknown power/i.test(text(borksen407)) && !/Sodom.*confirmed|confirmed.*Sodom/i.test(text(borksen407)), 'Borksen state must not identify the abductor or promote earlier Sodom planning to proof');
  assert(/five child|five.*card|all five|Yes|Return|Joker|X/i.test(text(morena407)) || /negotiation game/i.test(text(morena407)), 'Morena state must preserve the Chapter 407 negotiation setup');
  assert(/speculat|no evidence|unknown|does not know/i.test(text(otocin407)), 'Otocin state must preserve his theory-only knowledge boundary');
  assert(/hypothetical|unknown|capture methods/i.test(text(momolly407)), 'Momolly state must keep proposed capture methods hypothetical');

  const game = chapterModule.succession407NegotiationGame;
  const childKeys = Object.keys(game?.childCards || {});
  const parentKeys = Object.keys(game?.parentCards || {});
  assert(childKeys.length === 5 && ['Yes', 'No', 'Return', 'Joker', 'X'].every((key) => childKeys.includes(key)), 'negotiation game must preserve all five child response cards');
  assert(parentKeys.length === 7 && ['Aim', 'Power', 'Question A', 'Question B', 'Yes?', 'No?', 'Deal'].every((key) => parentKeys.includes(key)), 'negotiation game must preserve all seven parent cards');
  assert(/Borksen.*decides|Borksen.*select/i.test(text(game.procedure)), 'game procedure must preserve Borksen’s accepted face-down-card selection condition');
  assert(/game begins|no.*card.*selected|no.*card.*played/i.test(game.stoppingPoint || ''), 'Chapter 407 game must stop before the first Chapter 408 selection');
  assert(/promise.*not to cheat|promises.*not to cheat/i.test(game.antiCheatingBoundary || '') && /No Nen-enforced|no.*Nen-enforced|not.*Nen/i.test(game.antiCheatingBoundary || ''), 'no-cheating promise must not become an invented Nen enforcement rule');

  const eventText = text(chapterModule.succession407TimelineEvents);
  assert(!/Specialist classification|Contagion mechanics|Special Martial Law/i.test(eventText), 'Chapter 407 events must not import Chapter 408 revelations or martial-law interruption');

  const publicTimeline407 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 407 && event.maintainedResearch);
  assert(publicTimeline407.length === 25, 'public timeline must expose all 25 maintained Chapter 407 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 407/.test(group.group || '')), 'active dossier must include the Chapter 407 group');
  assert(!(frozen406Dossier.guardAssignmentGroups || []).some((group) => /Chapter 407/.test(group.group || '')), 'frozen Through406 dossier must remain unaware of Chapter 407');
  const frozenMysteryIds = new Set((frozen406Dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession407Mysteries.every((record) => !frozenMysteryIds.has(record.id)), 'frozen Through406 dossier must not contain Chapter 407 mysteries');
  assert(chapterModule.succession407Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every Chapter 407 mystery');
  assert(dossier.negotiationGameChapter407Research?.stoppingPoint === game.stoppingPoint, 'active dossier must expose the frozen Chapter 407 negotiation-game model');

  const relationshipIds = new Set(archive.getEntitiesByType('relationship').filter((record) => record.chapterRange?.start === 407).map((record) => record.id));
  assert(relationshipIds.has('relationship:morena-borksen-ch407-coercive-recruitment-negotiation'), 'canonical relationship graph must expose Morena → Borksen recruitment negotiation');
  assert(relationshipIds.has('relationship:borksen-morena-ch407-guarded-rule-analysis'), 'canonical relationship graph must expose Borksen → Morena guarded negotiation');

  assert(/sole substantive.*story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the current supplied synopsis as sole substantive story source');
  assert(/No Chapter 407 title|no Chapter 407 title/i.test(sourceNote), 'source note must explain the unsupplied-title boundary');
  assert(/1:00 p\.m\./i.test(sourceNote), 'source note must preserve the exact 1:00 p.m. Tier 3 anchor');
  assert(/does not identify the abductor|does not identify.*capture|capture.*does not identify/i.test(sourceNote), 'source note must preserve the unknown capture-mechanism boundary');
  assert(/game begins.*no.*card|game will begin.*no.*card|no Chapter 408 card selection/i.test(sourceNote), 'source note must stop before Chapter 408 game play');
  assert(/Chapter 408\+|408\+/.test(sourceNote), 'source note must quarantine Chapter 408+ outcomes');

  console.log(`Chapter 407 boundary audit passed: ${dedicated407.length} dedicated events plus ${projected407.length} maintained projections preserve the Day 12 1:00 p.m. missing-person anchor, capture-method uncertainty, Borksen/Morena knowledge states, complete negotiation-game setup, accepted card-selection condition, and Chapter 408+ spoiler firewall.`);
} finally {
  await vite.close();
}
