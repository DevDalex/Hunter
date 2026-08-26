import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 410 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-410.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession410Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen409Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough409.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen409Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough409.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index408 = numbers.indexOf(408);
  assert(index408 >= 0 && numbers[index408 + 1] === 409 && numbers[index408 + 2] === 410, 'maintained publication chain must preserve 408 → 409 → 410');

  const chapter410 = chapterModule.succession410ChapterResearch?.[0];
  assert(chapter410?.number === 410, 'Chapter 410 maintained research must load');
  assert(chapter410.title === 'Negotiation: Part 4' && chapter410.japaneseTitle === '交渉④', 'Chapter 410 must preserve previously maintained user-supplied title metadata');
  assert(chapter410.chronology?.presentDay === true && chapter410.chronology?.spansDays?.[0] === 12, 'Chapter 410 must remain on Voyage Day 12');
  assert(chapter410.chronology?.exactClockTime === null, 'Chapter 410 must not invent an absolute clock minute');
  assert(/40 minutes/i.test(chapter410.chronology?.elapsedTimeAtStop || '') && /final stronghold|Chapter 411/i.test(chapter410.chronology?.stoppingPoint || ''), 'Chapter 410 chronology must preserve the forty-minute endpoint and unresolved Justice Bureau stopping point');
  assert(chapterModule.succession410TimelineEvents.length === 46, 'maintained research must preserve all 46 Chapter 410 beats');

  const events410 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 410 && event.chapterRange?.end === 410);
  const projected410 = events410.filter((event) => event.maintainedResearch === true);
  const dedicated410 = events410.filter((event) => String(event.id || '').startsWith('event:chapter410-') && !event.maintainedResearch);
  assert(projected410.length === 46, 'story intelligence must project all 46 maintained Chapter 410 beats');
  assert(dedicated410.length === 46, 'Chapter 410 must expose 46 dedicated canonical events');

  assert(!frozen409Archive.publicationBoundary410, 'frozen Through409 archive must remain unaware of the Chapter 410 publication boundary');
  assert(activeArchive.publicationBoundary410?.chapter === 410, 'active archive must advance to Through410');
  assert(/Level 0/i.test(text(activeArchive.publicationBoundary410)) && /Room 3101/i.test(text(activeArchive.publicationBoundary410)) && /9\.5/i.test(text(activeArchive.publicationBoundary410)) && /40 minutes/i.test(text(activeArchive.publicationBoundary410)), 'active Chapter 410 publication boundary must preserve Level 0, Room 3101, Benjamin clock and forty-minute endpoint');

  const forcedYes = archive.getEntityById('event:chapter410-borksen-internally-resists-outwardly-confirms-yes');
  const antiCheat = archive.getEntityById('event:chapter410-cheating-triggers-automatic-manipulation-yes-no-only');
  const levelZero = archive.getEntityById('event:chapter410-borksen-level-zero-third-condition-incomplete');
  const levelOne = archive.getEntityById('event:chapter410-murder-witness-would-formalize-level-one');
  const telemetry = archive.getEntityById('event:chapter410-installed-game-tracks-level-points-location-status');
  assert(/internally|internal/i.test(text(forcedYes)) && /resist|does not want|doesn.t want/i.test(text(forcedYes)) && /Yes/i.test(text(forcedYes)), 'Borksen event must preserve outward Yes and internal resistance');
  assert(/automatic/i.test(text(antiCheat)) && /Manipulation/i.test(text(antiCheat)) && /Yes/i.test(text(antiCheat)) && /No/i.test(text(antiCheat)), 'anti-cheating event must preserve automatic Manipulation restricting the answer to Yes or No');
  assert(/Level 0/i.test(text(levelZero)) && /not yet|not.*fulfilled|incomplete/i.test(text(levelZero)), 'Borksen must remain Level 0 because joining is incomplete');
  assert(/Level 1/i.test(text(levelOne)) && /witness|present/i.test(text(levelOne)) && /murder/i.test(text(levelOne)), 'formal Level 1 trigger must remain presence at a Heil-Ly murder');
  assert(/level/i.test(text(telemetry)) && /points/i.test(text(telemetry)) && /location/i.test(text(telemetry)) && /status/i.test(text(telemetry)), 'installed-game event must preserve all four confirmed telemetry fields');

  const borksen410 = archive.getCharacterStateAtChapter('character:borksen', 410);
  const morena410 = archive.getCharacterStateAtChapter('character:morena-prudo', 410);
  const benjamin410 = archive.getCharacterStateAtChapter('character:benjamin-hui-guo-rou', 410);
  const mizaistom410 = archive.getCharacterStateAtChapter('character:mizaistom-nana', 410);
  const kaiser410 = archive.getCharacterStateAtChapter('character:kaiser', 410);
  assert(/Level 0/i.test(text(borksen410)) && /internal|resist|coerc/i.test(text(borksen410)), 'Borksen state must preserve Level 0 and underlying resistance');
  assert(/see and hear|audiovisual|assumption/i.test(text(borksen410)) && /not confirm|not.*confirmed|assumption/i.test(text(borksen410)), 'Borksen state must keep full spyware scope as an assumption rather than confirmed mechanic');
  assert(/Manipulation/i.test(text(morena410)) && /level, points, location|level.*points.*location.*status/i.test(text(morena410)), 'Morena state must preserve anti-cheating Manipulation and confirmed installed-game tracking');
  assert(/9\.5/i.test(text(benjamin410)) && /Justice Bureau/i.test(text(benjamin410)) && /consolidat/i.test(text(benjamin410)), 'Benjamin state must preserve his 9.5-hour estimate and Justice Bureau consolidation plan');
  assert(/half-truth|hostage|legal/i.test(text(mizaistom410)), 'Mizaistom state must preserve legal challenge and hostage/half-truth analysis');
  assert(/infect/i.test(text(kaiser410)) && /final stronghold/i.test(text(kaiser410)) && /inference|suspect/i.test(text(kaiser410)), 'Kaiser state must preserve infection inference and unidentified final stronghold');

  const heilLy410 = (archive.successionArchiveData?.organizationStateProfiles?.['organization:heil-ly'] || []).find((record) => record.chapterRange?.start === 410)
    || archive.getOrganizationStateAtChapter?.('organization:heil-ly', 410);
  assert(/Level 0/i.test(text(heilLy410)) && /Manipulation/i.test(text(heilLy410)) && /Room 3101/i.test(text(heilLy410)), 'Heil-Ly Chapter 410 state must preserve Level 0, anti-cheating Manipulation and Room 3101 military pressure');
  assert(/audiovisual|see and hear/i.test(text(heilLy410)) && /assumption|not.*confirmed/i.test(text(heilLy410)), 'Heil-Ly state must not promote full spyware to confirmed capability');

  const contagionKnowledge = archive.getAbilityKnowledgeAtChapter('ability:contagion', 410);
  assert(/Manipulation/i.test(text(contagionKnowledge)) && /Yes or No/i.test(text(contagionKnowledge)), 'Contagion knowledge must expose the anti-cheating Manipulation consequence');
  assert(/Level 0/i.test(text(contagionKnowledge)) && /Level 1/i.test(text(contagionKnowledge)) && /murder/i.test(text(contagionKnowledge)), 'Contagion knowledge must preserve Level 0 and the murder-presence Level 1 trigger');
  assert(/level.*points.*location.*status/i.test(text(contagionKnowledge)), 'Contagion knowledge must preserve confirmed telemetry fields');
  assert(/audiovisual|see or hear|see and hear/i.test(text(contagionKnowledge)) && /assumption|not confirm|does not confirm/i.test(text(contagionKnowledge)), 'Contagion knowledge must quarantine Borksen’s full-spyware assumption');

  const caseS = chapterModule.succession410CaseSFindings;
  assert(caseS.canonicalRoom === 'Room 3101' && caseS.vanishedSoldiers === 3 && /supernatural/i.test(caseS.classification || ''), 'Case S findings must preserve Room 3101, three vanished soldiers and supernatural classification');
  assert(/Room 125/i.test(caseS.correctionBoundary || '') && /correct/i.test(caseS.correctionBoundary || ''), 'Case S findings must preserve the supplied Room 125 → Room 3101 correction boundary');
  assert(/unidentified|not confirmed/i.test(caseS.missingCorporalBoundary || ''), 'missing corporal identity must remain unconfirmed');
  const roomEvent = archive.getEntityById('event:chapter410-room3101-sealed-three-soldiers-vanished');
  assert(/Room 3101/i.test(text(roomEvent)) && /three/i.test(text(roomEvent)) && /vanish/i.test(text(roomEvent)), 'canonical Room 3101 event must preserve three instantaneous disappearances');
  assert(!archive.getEntityById('location:black-whale:tier-3:room-125'), 'the corrected Chapter 410 packet must not create a separate Room 125 canonical location');

  const benjamin = chapterModule.succession410BenjaminEmergencyPlan;
  assert(/9\.5/i.test(benjamin.personalClock || '') && /child/i.test(benjamin.successionObjective || ''), 'Benjamin emergency model must preserve his 9.5-hour calculation and succession-through-child objective');
  assert(/alleges|allegation/i.test(`${benjamin.statedBasis} ${benjamin.allegationBoundary}`) && /not.*proven|not.*independently|half-truth/i.test(benjamin.allegationBoundary || ''), 'Benjamin terrorism case must remain allegation-bounded');
  assert(/still being drafted|still.*written|after signature/i.test(benjamin.authorizationState || ''), 'Nasubi authorization must remain pending at the Chapter 410 boundary');
  assert(/Kaiser/i.test(benjamin.kaiserBoundary || '') && /inference/i.test(benjamin.kaiserBoundary || '') && /final stronghold/i.test(benjamin.kaiserBoundary || ''), 'Kaiser infection estimate and final stronghold must remain inference/unresolved');

  const zhangLei410 = archive.getCharacterStateAtChapter('character:zhang-lei-hui-guo-rou', 410);
  const luzurus410 = archive.getCharacterStateAtChapter('character:luzurus-hui-guo-rou', 410);
  assert(/cross-bridge/i.test(text(zhangLei410)) && /destination.*unresolved|destination.*not confirmed|exact refuge.*not confirmed/i.test(text(zhangLei410)), 'Zhang Lei state must preserve reported cross-bridge movement without inventing destination');
  assert(/unaccounted/i.test(text(luzurus410)) && /location.*not supplied|location.*unresolved/i.test(text(luzurus410)), 'Luzurus must remain unaccounted for without an invented location');

  const negotiation = chapterModule.succession410NegotiationOutcome;
  assert(negotiation.finalResponse === 'Yes' && /internally resists/i.test(negotiation.internalState || ''), 'negotiation outcome must preserve final Yes plus internal resistance');
  assert(/Manipulation/i.test(negotiation.antiCheatingMechanic || '') && /Yes or No/i.test(negotiation.antiCheatingMechanic || ''), 'negotiation outcome must preserve automatic Yes/No restriction');
  assert(/Level 0/i.test(negotiation.stoppingMembershipState || '') && /not formally Level 1/i.test(negotiation.stoppingMembershipState || ''), 'negotiation outcome must stop at Level 0 rather than formal Level 1');

  const eventText = text(chapterModule.succession410TimelineEvents);
  assert(!/Chapter 411|Chapter 412|Chapter 413|Chapter 414|Chapter 415|Chapter 416/i.test(eventText), 'Chapter 410 events must not import later-chapter outcomes');

  const publicTimeline410 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 410 && event.maintainedResearch);
  assert(publicTimeline410.length === 46, 'public timeline must expose all 46 maintained Chapter 410 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 410/.test(group.group || '')), 'active dossier must include the Chapter 410 modernization group');
  assert(!(frozen409Dossier.guardAssignmentGroups || []).some((group) => /Chapter 410 forced Yes/.test(group.group || '')), 'frozen Through409 dossier must remain unaware of the modern Chapter 410 group');
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession410Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every modern Chapter 410 mystery');
  assert(dossier.negotiationOutcomeChapter410Research?.stoppingMembershipState === negotiation.stoppingMembershipState, 'active dossier must expose the Chapter 410 negotiation outcome model');
  assert(dossier.caseSChapter410Research?.canonicalRoom === 'Room 3101', 'active dossier must expose corrected Room 3101 Case S findings');
  assert(/9\.5/i.test(dossier.benjaminEmergencyChapter410Research?.personalClock || ''), 'active dossier must expose Benjamin’s 9.5-hour emergency model');

  const relationshipIds = new Set(archive.getEntitiesByType('relationship').filter((record) => record.chapterRange?.start === 410).map((record) => record.id));
  assert(relationshipIds.has('relationship:morena-borksen-ch410-manipulation-level-zero-recruitment'), 'canonical relationship graph must expose Morena → Borksen Level 0 coercive recruitment');
  assert(relationshipIds.has('relationship:borksen-morena-ch410-coerced-alignment-counterplanning'), 'canonical relationship graph must expose Borksen → Morena counter-planning under coercion');
  assert(relationshipIds.has('relationship:benjamin-justice-officials-ch410-military-consolidation'), 'canonical relationship graph must expose Benjamin’s Justice Bureau consolidation pressure');
  assert(relationshipIds.has('relationship:mizaistom-benjamin-ch410-legal-scrutiny-hostage-reading'), 'canonical relationship graph must expose Mizaistom’s legal/strategic resistance');

  assert(/sole substantive.*story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the supplied synopsis and notes as the sole substantive story source');
  assert(/Level 0/i.test(sourceNote) && /Level 1/i.test(sourceNote) && /murder/i.test(sourceNote), 'source note must preserve the Level 0 → murder-presence → Level 1 boundary');
  assert(/level[\s\S]*points[\s\S]*location[\s\S]*status/i.test(sourceNote) && /audiovisual|sees and hears|see and hear/i.test(sourceNote), 'source note must distinguish confirmed telemetry from broader spyware assumption');
  assert(/Room 125/i.test(sourceNote) && /Room 3101/i.test(sourceNote) && /volume/i.test(sourceNote), 'source note must preserve the room-number correction');
  assert(/allegation/i.test(sourceNote) && /Mizaistom/i.test(sourceNote) && /Kaiser/i.test(sourceNote), 'source note must preserve Benjamin allegation and Mizaistom/Kaiser inference boundaries');
  assert(/forty minutes/i.test(sourceNote) && /no Chapter 411\+|Chapter 411\+.*not imported|411\+.*not.*imported/i.test(sourceNote), 'source note must preserve the forty-minute endpoint and Chapter 411+ spoiler firewall');

  console.log(`Chapter 410 boundary audit passed: ${dedicated410.length} dedicated events plus ${projected410.length} maintained projections preserve forced Yes and anti-cheating Manipulation, Level 0 progression, installed-game telemetry boundaries, corrected Room 3101 Case S, Benjamin’s 9.5-hour Justice Bureau consolidation, forty-minute endpoint, and Chapter 411+ spoiler firewall.`);
} finally {
  await vite.close();
}
