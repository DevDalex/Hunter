import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 403 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-403.md', 'utf8').replace(/\*\*/g, '');
const royalFamilyTreeSource = fs.readFileSync('src/components/succession/RoyalFamilyGuardTree.jsx', 'utf8');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession403Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen402 = await vite.ssrLoadModule('/src/data/successionDossierThrough402.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index400 = numbers.indexOf(400);
  assert(index400 >= 0 && numbers[index400 + 1] === 401 && numbers[index400 + 2] === 402 && numbers[index400 + 3] === 403 && numbers[index400 + 4] === 406, 'maintained publication chain must be 400 → 401 → 402 → 403 → 406');

  const chapter403 = chapterModule.succession403ChapterResearch?.[0];
  assert(chapter403?.number === 403, 'Chapter 403 research must load');
  assert(chapter403.title === null && /not-supplied/i.test(chapter403.titleStatus), 'Chapter 403 must not backfill or invent a title from the legacy catalog');
  assert(chapter403.voyageDay === 'Voyage Day 11' && chapter403.chronology?.presentDay === true, 'Chapter 403 must preserve the Voyage Day 11 present-day frame');
  assert(/6:45/.test(chapter403.chronology?.exactClockTime || '') && /7:50/.test(chapter403.chronology?.exactClockTime || ''), 'both supplied clock anchors must be preserved');
  assert(chapterModule.succession403TimelineEvents.length === 22, 'maintained research must preserve all 22 Chapter 403 beats');

  const events403 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 403 && event.chapterRange?.end === 403);
  const projected403 = events403.filter((event) => event.maintainedResearch === true);
  const dedicated403 = events403.filter((event) => String(event.id || '').startsWith('event:chapter403-') && !event.maintainedResearch);
  assert(projected403.length === 22, 'story intelligence must project all 22 maintained Chapter 403 beats');
  assert(dedicated403.length === 22, 'Chapter 403 must expose 22 dedicated canonical events distinct from maintained projections');
  assert(dedicated403.every((event) => event.chronology?.day === 11), 'all dedicated Chapter 403 events must remain on Voyage Day 11');
  assert(archive.getEntityById('event:chapter403-0645-balsamilco-arrives-justice-courthouse')?.chronology?.timeOfDay === '6:45 a.m.', 'Balsamilco courthouse arrival must preserve 6:45 a.m.');
  assert(archive.getEntityById('event:chapter403-0750-benjamin-butch-red-alert')?.chronology?.timeOfDay === '7:50 a.m.', 'Benjamin red alert must preserve 7:50 a.m.');

  const balsamilco402 = archive.getCharacterStateAtChapter('character:balsamilco-might', 402);
  const balsamilco403 = archive.getCharacterStateAtChapter('character:balsamilco-might', 403);
  assert(/prepared|shoe|pathological|vial/i.test(text(balsamilco402)), 'Chapter 402 Balsamilco must remain at prepared-weapon state');
  assert(!/Halkenburg.*inside|occupied by Halkenburg|transferred consciousness/i.test(text(balsamilco402)), 'Chapter 402 Balsamilco must not know the Chapter 403 possession result');
  assert(/occupied by Halkenburg|Halkenburg.*body|controlled by Halkenburg/i.test(text(balsamilco403)), 'Chapter 403 Balsamilco state must record the successful Halkenburg occupation');
  assert(/unresolved|displaced/i.test(text(balsamilco403?.consciousnessState)) && balsamilco403?.life === 'unknown', 'Balsamilco’s own consciousness/life status must remain unresolved rather than being declared dead');

  const halkenburg403 = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 403);
  assert(halkenburg403?.life === 'alive', 'Halkenburg must remain alive at the Chapter 403 boundary');
  assert(/original body.*unconscious/i.test(text(halkenburg403)) && /Balsamilco/i.test(text(halkenburg403?.consciousnessState)), 'Halkenburg state must separate unconscious original body from consciousness active in Balsamilco');
  assert(!/funeral|original body.*dead/i.test(text(halkenburg403)), 'Chapter 403 Halkenburg state must not import Chapter 404+ death/funeral consequences');

  const arrow402 = archive.getAbilityKnowledgeAtChapter('ability:halkenburg-possession-arrow', 402);
  const arrow403 = archive.getAbilityKnowledgeAtChapter('ability:halkenburg-possession-arrow', 403);
  assert(!/Balsamilco|Grimmel the Dissonance|twelve civilian/i.test(text(arrow402)), 'Chapter 402 arrow knowledge must not leak Chapter 403 target/name/civilian details');
  assert(/Grimmel the Dissonance/i.test(text(arrow403)) && /twelve civilian/i.test(text(arrow403)) && /Balsamilco/i.test(text(arrow403)), 'Chapter 403 arrow knowledge must preserve official name, twelve civilians, and Balsamilco target');
  assert(/formal Nen category|classification.*unresolved|not.*confirmed.*formal/i.test(text(arrow403)), 'formal Nen classification must remain unresolved');
  assert(/displaced consciousness|location.*not revealed|Balsamilco.*unresolved/i.test(text(arrow403)), 'Balsamilco consciousness destination must remain unresolved');

  const benjamin403 = archive.getCharacterStateAtChapter('character:benjamin-hui-guo-rou', 403);
  assert(/red alert/i.test(text(benjamin403)), 'Benjamin state must preserve the red-alert escalation');
  assert(/potentially compromised|suspect|suspicious|compromised/i.test(text(benjamin403)), 'Benjamin must remain suspicious of the Balsamilco body without reader-knowledge omniscience');
  const military403 = archive.getOrganizationStateAtChapter('organization:kakin-military', 403);
  assert(/red-alert|red alert/i.test(text(military403)), 'Kakin military state must preserve red alert');
  assert(/not yet.*Special Martial Law|does not show.*Special Martial Law|without treating martial law as already active/i.test(text(military403)), 'Special Martial Law must remain inactive in Chapter 403');

  const unma = archive.getCharacterStateAtChapter('character:unma-hui-guo-rou', 403);
  const unmaRelationship = archive.getEntityById('relationship:unma-halkenburg-ch403-biological-mother-son');
  assert(/biological maternity|addresses.*son|mother/i.test(text(unma)) && /biological mother/i.test(text(unmaRelationship)), 'Unma maternity must be confirmed');
  assert(/unresolved|online theory|not.*confirmed|rumor/i.test(text(unmaRelationship)), 'the Duazul transfer motive must remain unresolved');
  assert(/spoilerLimit\s*>=\s*403\s*\?\s*biologicalRoyalFamilyTree\s*:\s*legalRoyalFamilyTree/.test(royalFamilyTreeSource), 'royal-family UI must reveal Halkenburg’s biological maternity at Chapter 403, not earlier');
  assert(!/spoilerLimit\s*>=\s*40[12]\s*\?\s*biologicalRoyalFamilyTree/.test(royalFamilyTreeSource), 'royal-family UI must not leak the Unma–Halkenburg reveal into Chapters 401–402');

  const coin402 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 402);
  const coin403 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 403);
  assert(!/seven retained|ten produced|six.*1.*one.*10/i.test(text(coin402)), 'Chapter 402 coin knowledge must not leak the Chapter 403 inventory');
  assert(/seven retained|three.*distributed|six.*1|one.*10/i.test(text(coin403)), 'Chapter 403 coin knowledge must preserve the seven-retained/three-distributed 1→10 observation');
  assert(/hypoth|unresolved|speculation/i.test(text(coin403)), 'ten-day and holder-effect explanations must remain hypotheses');
  assert(!(coin403?.sourceIds || []).includes('source:chapter-404'), 'Chapter 403 coin knowledge must not cite Chapter 404 as evidence');
  const beast403 = archive.getGuardianBeastStateAtChapter('guardian-beast:zhang-lei', 403);
  assert(/one marked 10|1-to-10|1.*10/i.test(text(beast403)) && /unresolved/i.test(text(beast403)), 'Zhang Lei Guardian Beast state must carry the observed number change without a solved rule');

  const worio = archive.getCharacterStateAtChapter('character:worio-bay', 403);
  assert(/pinion|feather/i.test(text(worio)) && /die soon/i.test(text(worio)), 'Worio state must preserve the mark and Halkenburg death warning');
  assert(!/Halkenburg.*already dead|funeral/i.test(text(worio)), 'Worio’s warning must not become an already-completed death');

  const fugetsu = archive.getCharacterStateAtChapter('character:fugetsu-hui-guo-rou', 403);
  const affliction403 = archive.getAbilityKnowledgeAtChapter('ability:fugetsu-unidentified-hostile-spirit-affliction', 403);
  assert(fugetsu?.life === 'alive' && /rests|sleep/i.test(text(fugetsu)), 'Fugetsu must remain alive and resting');
  assert(/Basho/i.test(text(affliction403)) && /unresolved|unidentified|unknown/i.test(text(affliction403)), 'Basho suppression must be carried forward without resolving the attacker');
  assert(/Luzurus.*unconfirmed|Luzurus.*suspect|Luzurus remains only/i.test(text({ fugetsu, affliction403 })), 'Luzurus must remain an unconfirmed suspect');

  const kurapika = archive.getCharacterStateAtChapter('character:kurapika', 403);
  assert(/Black Whale.*urn|worm toxin/i.test(text(kurapika)), 'Kurapika state must preserve the Black Whale/urn interpretation');
  assert(/letter.*public|publication/i.test(text(kurapika)) && /Nen class/i.test(text(kurapika)), 'Kurapika state must preserve the public-letter Nen-class strategy');
  assert(/contents/i.test(text(kurapika?.openQuestions)), 'Oito letter contents must remain unresolved');

  const courthouse = archive.getEntityById('location:black-whale:tier-2:justice-bureau:prosecution-courthouse');
  const corridor = archive.getEntityById('location:black-whale:tier-2:justice-bureau:prosecution-courthouse:corridor');
  const roomE6 = archive.getEntityById('location:black-whale:tier-2:justice-bureau:room-e-6');
  assert(courthouse?.parentId === 'location:black-whale:tier-2:justice-bureau', 'courthouse area must be a Tier 2 Justice child');
  assert(corridor?.parentId === courthouse.id, 'courthouse corridor must nest under the courthouse area');
  assert(roomE6?.parentId === 'location:black-whale:tier-2:justice-bureau', 'Room E-6 must be a Justice Bureau child');

  const publicTimeline403 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 403);
  assert(publicTimeline403.length === 22, 'public timeline must expose all 22 maintained Chapter 403 beats');
  assert(publicTimeline403.some((event) => event.id === '403-0645-balsamilco-arrives-justice-courthouse'), 'public timeline must include the 6:45 a.m. courthouse beat');
  assert(publicTimeline403.some((event) => event.id === '403-0750-benjamin-butch-red-alert'), 'public timeline must include the 7:50 a.m. red-alert beat');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 403/.test(group.group || '')), 'active dossier must include the Chapter 403 modernization group');
  assert(!(frozen402.guardAssignmentGroups || []).some((group) => /Chapter 403/.test(group.group || '')), 'frozen through-402 dossier must remain unaware of Chapter 403');
  const frozen402MysteryIds = new Set((frozen402.successionMysteries || []).map((record) => record.id).filter(Boolean));
  const active403MysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession403Mysteries.every((record) => !frozen402MysteryIds.has(record.id)), 'frozen through-402 dossier must not contain Chapter 403 mystery records');
  assert(chapterModule.succession403Mysteries.every((record) => active403MysteryIds.has(record.id)), 'active through-403 dossier must expose every Chapter 403 mystery record');
  assert(activeArchive.publicationBoundary403?.chapter === 403, 'active archive must advance to a frozen Through403 boundary');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must preserve the supplied synopsis as sole substantive story source');
  assert(/no.*title.*supplied|title.*not supplied|does not.*backfill.*title/i.test(sourceNote), 'source note must explain the unsupplied-title boundary');
  assert(/6:45 a\.m\./i.test(sourceNote) && /7:50 a\.m\./i.test(sourceNote), 'source note must preserve both exact clock anchors');
  assert(/Balsamilco.*consciousness.*unresolved|displaced.*consciousness.*unresolved/i.test(sourceNote), 'source note must preserve the Balsamilco-consciousness boundary');
  assert(/martial law.*not.*declared|not.*active/i.test(sourceNote), 'source note must keep Special Martial Law inactive');
  assert(/ten-day.*hypoth|coin.*hypoth|1.*10/i.test(sourceNote), 'source note must separate the coin observation from progression theory');
  assert(/No Chapter 404\+|no Chapter 404\+|Chapter 404\+.*excluded/i.test(sourceNote), 'source note must forbid Chapter 404+ backfill');

  console.log(`Chapter 403 boundary audit passed: ${dedicated403.length} dedicated canonical events plus ${projected403.length} maintained-research projections preserve Day 11 chronology, Halkenburg-in-Balsamilco identity separation, red-alert-but-no-martial-law status, Unma maternity, unresolved coin mechanics, and the Chapter 404+ spoiler firewall.`);
} finally {
  await vite.close();
}
