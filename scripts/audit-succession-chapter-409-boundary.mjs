import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 409 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-409.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession409Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen408Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough408.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen408Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough408.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');
  const map = await vite.ssrLoadModule('/src/data/succession/blackWhaleCanonicalMap.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index407 = numbers.indexOf(407);
  assert(index407 >= 0 && numbers[index407 + 1] === 408 && numbers[index407 + 2] === 409 && numbers[index407 + 3] === 410, 'maintained publication chain must be 407 → 408 → 409 → 410');

  const chapter409 = chapterModule.succession409ChapterResearch?.[0];
  assert(chapter409?.number === 409, 'Chapter 409 maintained research must load');
  assert(chapter409.title === 'Negotiation: Part 3' && chapter409.japaneseTitle === '交渉③', 'Chapter 409 must preserve the previously maintained user-supplied title metadata');
  assert(chapter409.chronology?.presentDay === true && chapter409.chronology?.spansDays?.[0] === 12, 'Chapter 409 must remain on Voyage Day 12 as the immediate Chapter 408 continuation');
  assert(chapter409.chronology?.exactClockTime === null, 'Chapter 409 must not invent a new exact clock time');
  assert(/intentionally.*Yes|Yes.*intentional/i.test(chapter409.chronology?.stoppingPoint || ''), 'Chapter 409 must stop at Borksen’s intentional Yes choice');
  assert(chapterModule.succession409TimelineEvents.length === 38, 'maintained research must preserve all 38 Chapter 409 beats');

  const events409 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 409 && event.chapterRange?.end === 409);
  const projected409 = events409.filter((event) => event.maintainedResearch === true);
  const dedicated409 = events409.filter((event) => String(event.id || '').startsWith('event:chapter409-') && !event.maintainedResearch);
  assert(projected409.length === 38, 'story intelligence must project all 38 maintained Chapter 409 beats');
  assert(dedicated409.length === 38, 'Chapter 409 must expose 38 dedicated canonical events');

  assert(!frozen408Archive.publicationBoundary409, 'frozen Through408 archive must remain unaware of the Chapter 409 publication boundary');
  assert(activeArchive.publicationBoundary409?.chapter === 409, 'active archive must advance to Through409');
  assert(/between Tiers 2 and 3/i.test(text(activeArchive.publicationBoundary409)) && /twenty-one|21/i.test(text(activeArchive.publicationBoundary409)) && /Return/i.test(text(activeArchive.publicationBoundary409)) && /Yes/i.test(text(activeArchive.publicationBoundary409)), 'active Chapter 409 publication boundary must preserve inter-tier location, headcount, Return result, and intentional Yes');

  const tier3Orders = archive.getEntityById('event:chapter409-tier3-kneel-wall-shoot-warning');
  const deal = archive.getEntityById('event:chapter409-three-heilly-joining-conditions');
  const locationReveal = archive.getEntityById('event:chapter409-central-gate-rumble-intertier-location-confirmed');
  const fiveDoors = archive.getEntityById('event:chapter409-five-hideout-doors-confirmed');
  const headcount = archive.getEntityById('event:chapter409-heilly-current-headcount-twenty-one');
  const finalYes = archive.getEntityById('event:chapter409-borksen-intentionally-chooses-yes');
  assert(/kneel/i.test(text(tier3Orders)) && /wall/i.test(text(tier3Orders)) && /shot|gunfire/i.test(text(tier3Orders)), 'Tier 3 martial-law event must preserve kneel/wall/shoot orders');
  assert(/Yes/i.test(text(deal)) && /kiss/i.test(text(deal)) && /murder/i.test(text(deal)) && /three/i.test(text(deal)), 'joining-condition event must preserve Yes, kiss, and murder-presence requirements');
  assert(/between Tiers 2 and 3/i.test(text(locationReveal)) && /central gate/i.test(text(locationReveal)), 'inter-tier reveal must preserve the central-gate cue and confirmed location');
  assert(/five/i.test(text(fiveDoors)) && /door|entrance/i.test(text(fiveDoors)), 'hideout event must preserve five entrances');
  assert(/twenty-one|21/i.test(text(headcount)), 'Heil-Ly headcount event must preserve twenty-one current members');
  assert(/Yes/i.test(text(finalYes)) && /intentional|not a mistake/i.test(text(finalYes)), 'Chapter 409 endpoint must preserve Borksen’s intentional Yes');

  const intertierHideout = archive.getEntityById('location:black-whale:intertier-2-3:heil-ly-hideout');
  const centralGate = archive.getEntityById('location:black-whale:intertier-2-3:central-gate');
  assert(/between Tiers 2 and 3|inter-tier/i.test(text(intertierHideout)) && /five/i.test(text(intertierHideout)), 'canonical location layer must expose the inter-tier five-entrance Heil-Ly hideout');
  assert(/central gate/i.test(text(centralGate)) && /Tier 2|Tiers 2 and 3/i.test(text(centralGate)), 'canonical location layer must expose the Tier 2–3 central gate');
  assert(map.blackWhaleCanonicalHotspotMap?.['heil-ly']?.locationId === 'location:black-whale:intertier-2-3:heil-ly-hideout', 'Black Whale hotspot map must advance Heil-Ly to the Chapter 409 inter-tier location');

  const borksen409 = archive.getCharacterStateAtChapter('character:borksen', 409);
  const morena409 = archive.getCharacterStateAtChapter('character:morena-prudo', 409);
  const orarge409 = archive.getCharacterStateAtChapter('character:orarge', 409);
  assert(/intertier-2-3|inter-tier|between Tiers 2 and 3/i.test(text(borksen409)), 'Borksen Chapter 409 state must use the resolved inter-tier hideout');
  assert(/intentional.*Yes|Yes.*intentional/i.test(text(borksen409)), 'Borksen state must preserve intentional Yes');
  assert(/not.*full|not.*completed|murder-presence.*not shown|membership.*not established/i.test(text(borksen409)), 'Borksen must not be promoted to completed Heil-Ly membership');
  assert(/No Chapter 409 scene gives Borksen a Nen ability|no.*Nen ability|awakening.*not/i.test(text(borksen409)), 'Borksen must not be promoted to a completed Nen awakening in Chapter 409');
  assert(/twenty-one|21/i.test(text(morena409)) && /only Specialist/i.test(text(morena409)) && /at least one Enhancer/i.test(text(morena409)), 'Morena state must preserve the current Heil-Ly headcount and Nen-type breakdown');
  assert(/shuffle/i.test(text(orarge409)) && /No/i.test(text(orarge409)) && /Return/i.test(text(orarge409)), 'Orarge state must preserve the final response-card procedure');

  const heilLy409 = (archive.successionArchiveData?.organizationStateProfiles?.['organization:heil-ly'] || []).find((record) => record.chapterRange?.start === 409)
    || archive.getOrganizationStateAtChapter?.('organization:heil-ly', 409);
  assert(/between Tiers 2 and 3|inter-tier/i.test(text(heilLy409)) && /five/i.test(text(heilLy409)) && /twenty-one|21/i.test(text(heilLy409)), 'Heil-Ly Chapter 409 organization state must preserve inter-tier base, five entrances, and twenty-one members');
  assert(/murder-presence.*not shown|full.*membership.*unresolved|condition.*not shown/i.test(text(heilLy409)), 'Heil-Ly organization state must keep Borksen’s full membership incomplete');

  const game = chapterModule.succession409NegotiationGameProgress;
  assert(text(game.parentCardSequence) === text(['Deal', 'Question A']), 'parent-card sequence must be Deal → Question A');
  assert(text(game.verifiedBeforeShuffle) === text(['No', 'Return']), 'No and Return must be directly verified before the three-card shuffle');
  assert(text(game.shuffledAfterDeal) === text(['X', 'No', 'Return']) && game.redrawnCard === 'X', 'Deal must return X and the next draw must remove X again');
  assert(text(game.finalTwo) === text(['No', 'Return']), 'final response pair must be No and Return');
  assert(game.finalReveal?.morena === 'No' && game.finalReveal?.borksen === 'Return', 'simultaneous final reveal must give No to Morena and Return to Borksen');
  assert(game.restoredFinalResponse === 'Yes' && /not a mistake|intent/i.test(game.restoredFinalResponseIntent || ''), 'Return must be exchanged for an intentional Yes');

  const hideout = chapterModule.succession409HideoutFindings;
  assert(/Between Tiers 2 and 3/i.test(hideout.confirmedLocation || '') && hideout.entranceCount === 5, 'hideout findings must preserve the confirmed inter-tier position and five entrances');
  assert(hideout.nenConstructionAnswer === 'Yes and No' && hideout.ordinaryAccessAnswer === 'Yes and No', 'hideout findings must preserve both qualified Yes-and-No answers');
  assert(/inference/i.test(hideout.borksenInference || ''), 'pre-construction and exact-centrality claims must remain Borksen’s inference');

  const contagionKnowledge = archive.getAbilityKnowledgeAtChapter('ability:contagion', 409);
  assert(/three.*condition|Yes/i.test(text(contagionKnowledge)) && /kiss/i.test(text(contagionKnowledge)) && /murder/i.test(text(contagionKnowledge)), 'Contagion knowledge must expose the three joining conditions');
  assert(/not.*show|not.*establish|unresolved/i.test(text(contagionKnowledge)) && /ability|awakening|membership/i.test(text(contagionKnowledge)), 'Contagion knowledge must refuse to infer completed Borksen initiation');

  const eventText = text(chapterModule.succession409TimelineEvents);
  assert(!/marked-card tactic|tiny indentations|automatic anti-cheating|manipulative component|installed game|Level 0|formally become Level 1|Squad 3|Case S|Room 3101.*vanish|Benjamin.*9\.5/i.test(eventText), 'Chapter 409 events must not import known Chapter 410 game-system, anti-cheating, level, Room 3101, or Benjamin revelations');

  const publicTimeline409 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 409 && event.maintainedResearch);
  assert(publicTimeline409.length === 38, 'public timeline must expose all 38 maintained Chapter 409 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 409/.test(group.group || '')), 'active dossier must include the Chapter 409 modernization group');
  assert(!(frozen408Dossier.guardAssignmentGroups || []).some((group) => /Chapter 409/.test(group.group || '')), 'frozen Through408 dossier must remain unaware of the Chapter 409 group');
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession409Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every modern Chapter 409 mystery');
  assert(dossier.negotiationGameChapter409Research?.stoppingPoint === game.stoppingPoint, 'active dossier must expose the Chapter 409 negotiation-game progress model');
  assert(/Tier 3/i.test(text(dossier.martialLawChapter409Research)) && /gunfire|shot/i.test(text(dossier.martialLawChapter409Research)), 'active dossier must expose Chapter 409 martial-law orders');
  assert(/Between Tiers 2 and 3/i.test(text(dossier.hideoutChapter409Research)) && /five/i.test(text(dossier.hideoutChapter409Research)), 'active dossier must expose Chapter 409 hideout findings');
  assert(/murder/i.test(text(dossier.nenChapter409Research)) && /kiss/i.test(text(dossier.nenChapter409Research)), 'active dossier must expose Chapter 409 Nen joining conditions');

  const relationshipIds = new Set(archive.getEntitiesByType('relationship').filter((record) => record.chapterRange?.start === 409).map((record) => record.id));
  assert(relationshipIds.has('relationship:morena-borksen-ch409-conditional-recruitment-deal'), 'canonical relationship graph must expose Morena → Borksen conditional recruitment');
  assert(relationshipIds.has('relationship:borksen-morena-ch409-trust-test-information-extraction'), 'canonical relationship graph must expose Borksen → Morena trust-test information extraction');

  assert(/sole substantive.*story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the supplied synopsis as the sole substantive story source');
  assert(/between Tiers 2 and 3/i.test(sourceNote) && /five (?:doors|entrances)/i.test(sourceNote), 'source note must preserve inter-tier location and five entrances');
  assert(/twenty-one members total|twenty-one current members/i.test(sourceNote), 'source note must preserve the twenty-one-member headcount');
  assert(/all three conditions are required/i.test(sourceNote) && /murder-presence condition.*not shown|does not show.*murder-presence/i.test(sourceNote), 'source note must preserve incomplete three-condition joining');
  assert(/no Chapter 410\+|Chapter 410\+.*not imported|410\+.*not.*imported/i.test(sourceNote), 'source note must quarantine Chapter 410+ outcomes');

  console.log(`Chapter 409 boundary audit passed: ${dedicated409.length} dedicated events plus ${projected409.length} maintained projections preserve Special Martial Law orders, Deal and three-condition recruitment, inter-tier five-entrance hideout intelligence, twenty-one-member Heil-Ly/Nen boundaries, final No → Return result, intentional Yes stopping point, and Chapter 410+ spoiler firewall.`);
} finally {
  await vite.close();
}
