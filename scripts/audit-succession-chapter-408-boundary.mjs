import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 408 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-408.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession408Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen407Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough407.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen407Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough407.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index406 = numbers.indexOf(406);
  assert(index406 >= 0 && numbers[index406 + 1] === 407 && numbers[index406 + 2] === 408 && numbers[index406 + 3] === 409, 'maintained publication chain must be 406 → 407 → 408 → 409');

  const chapter408 = chapterModule.succession408ChapterResearch?.[0];
  assert(chapter408?.number === 408, 'Chapter 408 maintained research must load');
  assert(chapter408.title === 'Negotiation: Part 2' && chapter408.japaneseTitle === '交渉②', 'Chapter 408 must preserve the previously maintained user-supplied title metadata');
  assert(chapter408.chronology?.presentDay === true && chapter408.chronology?.spansDays?.[0] === 12, 'Chapter 408 must remain on Voyage Day 12 as the immediate Chapter 407 continuation');
  assert(chapter408.chronology?.exactClockTime === null, 'Chapter 408 must not invent a new exact clock time');
  assert(/Special Martial Law/i.test(chapter408.chronology?.stoppingPoint || ''), 'Chapter 408 chronology must stop at the Special Martial Law declaration');
  assert(chapterModule.succession408TimelineEvents.length === 36, 'maintained research must preserve all 36 Chapter 408 beats');

  const events408 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 408 && event.chapterRange?.end === 408);
  const projected408 = events408.filter((event) => event.maintainedResearch === true);
  const dedicated408 = events408.filter((event) => String(event.id || '').startsWith('event:chapter408-') && !event.maintainedResearch);
  assert(projected408.length === 36, 'story intelligence must project all 36 maintained Chapter 408 beats');
  assert(dedicated408.length === 36, 'Chapter 408 must expose 36 dedicated canonical events');

  assert(!frozen407Archive.publicationBoundary408, 'frozen Through407 archive must remain unaware of the Chapter 408 publication boundary');
  assert(activeArchive.publicationBoundary408?.chapter === 408, 'active archive must advance to Through408');
  assert(/No and Return/i.test(text(activeArchive.publicationBoundary408)) && /Special Martial Law/i.test(text(activeArchive.publicationBoundary408)), 'active Chapter 408 publication boundary must preserve the interrupted two-card state');

  const aim = archive.getEntityById('event:chapter408-morena-states-kakin-humanity-destruction-goals');
  const identity = archive.getEntityById('event:chapter408-morena-not-original-carnival-orphan');
  const carnival = archive.getEntityById('event:chapter408-carne-levare-lese-majeste-framework');
  assert(/destroy.*Kakin/i.test(text(aim)) && /humanity/i.test(text(aim)), 'Aim must preserve Morena’s Kakin and humanity destruction goals');
  assert(/not the original|true royal|Carnival Orphan/i.test(text(identity)), 'Morena identity event must preserve the non-original-Morena / Carnival Orphan disclosure');
  assert(/Carne Levare/i.test(text(carnival)) && /Entertainers/i.test(text(carnival)) && /lèse-majesté|lese-majeste/i.test(text(carnival)), 'Carne Levare event must preserve the narrated royal-system framework');

  const contagion = archive.getEntityById('event:chapter408-contagion-mother-twenty-two-children');
  const specialist = archive.getEntityById('event:chapter408-borksen-specialist-unnamed-enhancer-detector');
  const rarity = archive.getEntityById('event:chapter408-specialist-rarity-fifty-sixty-floor-master');
  const desired = archive.getEntityById('event:chapter408-morena-specialist-desired-borksen-ability-withheld');
  assert(/twenty-two|22/i.test(text(contagion)) && /mother|dealer/i.test(text(contagion)), 'Contagion event must preserve Morena’s up-to-22 child mother/dealer model');
  assert(/Specialist/i.test(text(specialist)) && /unnamed/i.test(text(specialist)) && /Enhancer/i.test(text(specialist)) && /smell/i.test(text(specialist)), 'Borksen Specialist event must preserve the unnamed Enhancer detection boundary');
  assert(/one person in three thousand|1.*3000|three thousand/i.test(text(rarity)) && /fifty to sixty|50.*60/i.test(text(rarity)) && /unnamed/i.test(text(rarity)), 'Specialist rarity event must preserve Morena’s approximate estimate and unnamed Floor Master boundary');
  assert(/withhold|undisclosed|remains undisclosed/i.test(text(desired)) && /Yes\?/i.test(text(desired)), 'desired Borksen ability must remain withheld for Yes?');

  const borksen408 = archive.getCharacterStateAtChapter('character:borksen', 408);
  const morena408 = archive.getCharacterStateAtChapter('character:morena-prudo', 408);
  const orarge408 = archive.getCharacterStateAtChapter('character:orarge', 408);
  assert(/Tier 2/i.test(text(borksen408)) && /No and Return/i.test(text(borksen408)), 'Borksen state must correct the stale Tier 3 legacy location and preserve No/Return as the remaining cards');
  assert(/rejects murder|reject.*destruction|has not accepted|no Heil-Ly alliance/i.test(text(borksen408)), 'Borksen state must preserve ideological rejection and no accepted Heil-Ly alliance');
  assert(/unawakened Specialist|does not awaken|not.*awaken/i.test(text(borksen408)), 'Borksen must not be promoted to an awakened Nen user in Chapter 408');
  assert(/Carnival Orphan/i.test(text(morena408)) && /Specialist/i.test(text(morena408)) && /withhold/i.test(text(morena408)), 'Morena state must preserve identity, Specialist, and withheld-role boundaries');
  assert(/shuffle|Hindu/i.test(text(orarge408)) && /card/i.test(text(orarge408)), 'Orarge state must preserve his procedural shuffling role');

  const heilLy408 = (archive.successionArchiveData?.organizationStateProfiles?.['organization:heil-ly'] || []).find((record) => record.chapterRange?.start === 408)
    || archive.getOrganizationStateAtChapter?.('organization:heil-ly', 408);
  assert(/Specialist/i.test(text(heilLy408)) && /No and Return/i.test(text(heilLy408)) && /martial/i.test(text(heilLy408)), 'Heil-Ly Chapter 408 state must preserve Specialist recruitment, card state, and martial-law interruption');

  const game = chapterModule.succession408NegotiationGameProgress;
  assert(text(game.parentCardSequence) === text(['Aim', 'Power / Ability', 'No?']), 'parent-card sequence must be Aim → Power / Ability → No?');
  assert(text(game.childRevealSequence) === text(['Joker', 'Yes', 'X']), 'child-card reveal sequence must be Joker → Yes → X');
  assert(text(game.childCardsRemainingAtStop) === text(['No', 'Return']), 'No and Return must remain at the stopping point');
  assert(/same parent-card slot|alias|same.*slot/i.test(game.aliasBoundary || ''), 'Power / Ability must remain a translation-label alias rather than an eighth card');
  assert(/inference/i.test(game.antiCheatingBoundary || '') && /not proof|No physical|not.*physical|not.*Nen/i.test(game.antiCheatingBoundary || ''), 'anti-cheating conclusion must remain Borksen’s bounded inference');
  assert(/Special Martial Law/i.test(game.stoppingPoint || '') && /before.*final|final response.*not|final response.*determin/i.test(game.stoppingPoint || ''), 'game model must stop at martial law before the final response');

  const contagionKnowledge = archive.getAbilityKnowledgeAtChapter('ability:contagion', 408);
  assert(/twenty-two|22/i.test(text(contagionKnowledge)) && /uninitiated|does not show Borksen|not.*initiated|does not initiate/i.test(text(contagionKnowledge)), 'Contagion knowledge must include the 22-child model without initiating Borksen');
  assert(!/Dogman/i.test(text(contagionKnowledge)), 'Chapter 408 Nen knowledge must not identify the unnamed category detector as Dogman');

  const eventText = text(chapterModule.succession408TimelineEvents);
  assert(!/prolonged mouth-to-mouth|three conditions for joining|twenty-one members|five doors|between Tiers 2 and 3|exchanges Return for Yes|recovers X/i.test(eventText), 'Chapter 408 events must not import known Chapter 409 game, hideout, or membership revelations');

  const publicTimeline408 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 408 && event.maintainedResearch);
  assert(publicTimeline408.length === 36, 'public timeline must expose all 36 maintained Chapter 408 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 408/.test(group.group || '')), 'active dossier must include the Chapter 408 group');
  assert(!(frozen407Dossier.guardAssignmentGroups || []).some((group) => /Chapter 408 Morena identity/.test(group.group || '')), 'frozen Through407 dossier must remain unaware of the modern Chapter 408 group');
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession408Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every modern Chapter 408 mystery');
  assert(dossier.negotiationGameChapter408Research?.stoppingPoint === game.stoppingPoint, 'active dossier must expose the Chapter 408 negotiation-game progress model');
  assert(/Carne Levare/i.test(text(dossier.carneLevareChapter408Research)), 'active dossier must expose the Chapter 408 Carne Levare framework');
  assert(/Specialist/i.test(text(dossier.nenChapter408Research)), 'active dossier must expose the Chapter 408 Nen findings');

  const relationshipIds = new Set(archive.getEntitiesByType('relationship').filter((record) => record.chapterRange?.start === 408).map((record) => record.id));
  assert(relationshipIds.has('relationship:morena-borksen-ch408-specialist-recruitment-disclosure'), 'canonical relationship graph must expose Morena → Borksen Specialist recruitment disclosure');
  assert(relationshipIds.has('relationship:borksen-morena-ch408-informed-ideological-rejection'), 'canonical relationship graph must expose Borksen → Morena informed ideological rejection');

  assert(/sole substantive.*story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the current supplied synopsis as sole substantive story source');
  assert(/Power \/ Ability/i.test(sourceNote) && /eighth parent card/i.test(sourceNote), 'source note must preserve the Power / Ability alias boundary');
  assert(/does not.*Dogman|does not equate.*Dogman/i.test(sourceNote), 'source note must refuse to identify the unnamed Enhancer as Dogman');
  assert(/Floor Master.*unnamed|unnamed.*Floor Master/i.test(sourceNote), 'source note must keep the Heavens Arena Floor Master unnamed');
  assert(/Borksen has not awakened Nen/i.test(sourceNote), 'source note must keep Borksen unawakened at the Chapter 408 boundary');
  assert(/no Chapter 409\+|Chapter 409\+.*not imported|409\+.*not.*imported/i.test(sourceNote), 'source note must quarantine Chapter 409+ outcomes');

  console.log(`Chapter 408 boundary audit passed: ${dedicated408.length} dedicated events plus ${projected408.length} maintained projections preserve Morena’s Carnival Orphan disclosure, Contagion and Specialist knowledge boundaries, Joker → Yes → X card progression, No/X vow logic, No + Return stopping state, Special Martial Law endpoint, and Chapter 409+ spoiler firewall.`);
} finally {
  await vite.close();
}
