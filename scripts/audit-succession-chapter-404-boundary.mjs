import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 404 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-404.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession404Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen403 = await vite.ssrLoadModule('/src/data/successionDossierThrough403.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index400 = numbers.indexOf(400);
  assert(index400 >= 0 && numbers[index400 + 1] === 401 && numbers[index400 + 2] === 402 && numbers[index400 + 3] === 403 && numbers[index400 + 4] === 404 && numbers[index400 + 5] === 406, 'maintained publication chain must be 400 → 401 → 402 → 403 → 404 → 406');

  const chapter404 = chapterModule.succession404ChapterResearch?.[0];
  assert(chapter404?.number === 404, 'Chapter 404 research must load');
  assert(chapter404.title === null && /not-supplied/i.test(chapter404.titleStatus), 'Chapter 404 must not invent or backfill a title');
  assert(chapter404.voyageDay === 'Voyage Days 11–12' && chapter404.chronology?.presentDay === true, 'Chapter 404 must span Voyage Days 11–12');
  assert(JSON.stringify(chapter404.chronology?.spansDays) === JSON.stringify([11, 12]), 'chronology must explicitly identify both Day 11 and Day 12');
  assert(/1:00 p\.m\./.test(chapter404.chronology?.exactClockTime || '') && /9:00 a\.m\./.test(chapter404.chronology?.exactClockTime || '') && /12:00 p\.m\./.test(chapter404.chronology?.exactClockTime || ''), 'daily coin, class, and funeral schedule anchors must be preserved');
  assert(chapterModule.succession404TimelineEvents.length === 32, 'maintained research must preserve all 32 Chapter 404 beats');

  const events404 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 404 && event.chapterRange?.end === 404);
  const projected404 = events404.filter((event) => event.maintainedResearch === true);
  const dedicated404 = events404.filter((event) => String(event.id || '').startsWith('event:chapter404-') && !event.maintainedResearch);
  assert(projected404.length === 32, 'story intelligence must project all 32 maintained Chapter 404 beats');
  assert(dedicated404.length === 32, 'Chapter 404 must expose 32 dedicated canonical events');
  assert(dedicated404.filter((event) => event.chronology?.day === 11).length === 27, 'the first 27 dedicated beats must remain on Voyage Day 11');
  assert(dedicated404.filter((event) => event.chronology?.day === 12).length === 5, 'the final five dedicated beats must remain on Voyage Day 12');

  const coin403 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 403);
  const coin404 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 404);
  const coin403BoundaryText = text({ summary: coin403?.summary, knowledgeState: coin403?.knowledgeState, mechanics: coin403?.mechanics });
  assert(/seven retained|three.*distributed|one.*10/i.test(text(coin403)), 'Chapter 403 coin inventory must remain frozen');
  assert(!/Kurapika.*hand|reverse.*revert|number (?:stays|remains) 1/i.test(coin403BoundaryText), 'Chapter 403 coin knowledge must not leak the Chapter 404 holder test');
  assert(/different reverse|holder-linked/i.test(text(coin404)) && /10.*1|value 1/i.test(text(coin404)), 'Chapter 404 coin knowledge must preserve the holder design and 10→1 transfer');
  assert(/number remains 1|number stays 1|remains 1/i.test(text(coin404)), 'returned coin must retain value 1 while its design reverts');
  assert(/hypoth|not confirmed|unconfirmed/i.test(text(coin404)) && /10\^64|pseudo-coercive/i.test(text(coin404)), 'category, threshold, and loyalty ideas must remain hypotheses');
  assert(/Coventoba.*does not produce or test|Coventoba does not produce/i.test(text(coin404)), 'the boundary must explicitly preserve that Coventoba does not produce or test the suspected coin');

  const arrow403 = archive.getAbilityKnowledgeAtChapter('ability:halkenburg-possession-arrow', 403);
  const arrow404 = archive.getAbilityKnowledgeAtChapter('ability:halkenburg-possession-arrow', 404);
  assert(!/randomly selected|one-awake|Vict experiment/i.test(text(arrow403)), 'Chapter 403 must not leak the Chapter 404 topology explanation');
  assert(/randomly selected|selected at random/i.test(text(arrow404)) && /one-awake|one.*awake/i.test(text(arrow404)), 'Grimmel must preserve random contributor selection and one-awake priority');
  assert(/Shikaku|Sumidori/i.test(text(arrow404)) && /Vict/i.test(text(arrow404)), 'both supplied experiment cases must be retained');
  assert(/formal Nen category.*unresolved|No formal Nen category/i.test(text(arrow404)), 'Grimmel’s formal Nen category must remain unresolved');
  assert(/ten hours|ten-hour|about ten/i.test(text(arrow404)) && /plan|not a completed duration|not.*completed/i.test(text(arrow404)), 'the approximate ten-hour window must remain an unfinished plan');

  const halkenburg403 = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 403);
  const halkenburg404 = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 404);
  const balsamilco404 = archive.getCharacterStateAtChapter('character:balsamilco-might', 404);
  assert(halkenburg403?.life === 'alive' && /original body.*unconscious/i.test(text(halkenburg403)), 'Chapter 403 must keep Halkenburg’s original body alive and unconscious');
  assert(halkenburg404?.life === 'dead' && /original body deceased/i.test(text(halkenburg404)), 'Halkenburg’s original-body death must belong to Chapter 404');
  assert(/active inside Balsamilco|active through Balsamilco|remains immediately active/i.test(text(halkenburg404)), 'Halkenburg must remain immediately active through Balsamilco after death');
  assert(halkenburg404?.bodyStateCode === 'deceased' && halkenburg404?.identityStateCode === 'transferred' && halkenburg404?.consciousnessStateCode === 'active', 'Halkenburg’s structured body/identity/consciousness tuple must preserve the post-death transfer');
  assert(balsamilco404?.life === 'alive' && /living body/i.test(text(balsamilco404)), 'Balsamilco’s body must remain alive');
  assert(/not shown awake|not.*awake/i.test(text(balsamilco404)) && !/regains control|back in control/i.test(text(balsamilco404?.operationalState)), 'Balsamilco must not be shown awake or restored to control');
  assert(balsamilco404?.bodyStateCode === 'occupied' && balsamilco404?.identityStateCode === 'composite' && balsamilco404?.consciousnessStateCode === 'unknown', 'Balsamilco’s structured state must preserve the occupied shared body without inventing an awake consciousness');

  const military404 = archive.getOrganizationStateAtChapter('organization:kakin-military', 404);
  assert(/medical teams|medical takeover|take control/i.test(text(military404)), 'Kakin military state must preserve the medical takeover');
  assert(/does not.*Special Martial Law|no declaration|not.*active/i.test(text(military404)), 'Special Martial Law must remain inactive');

  const cheadle404 = archive.getCharacterStateAtChapter('character:cheadle-yorkshire', 404);
  const clinic = archive.getEntityById('location:black-whale:tier-3:central-medical-clinic');
  const square = archive.getEntityById('location:black-whale:tier-3:central-stairwell-square');
  const morgue = archive.getEntityById('location:black-whale:tier-1:morgue');
  assert(/CHEM-7/i.test(text(cheadle404)) && /CT/i.test(text(cheadle404)) && /vomitus/i.test(text(cheadle404)), 'Cheadle’s supplied orders must be retained');
  assert(/no test result|no.*result/i.test(text(cheadle404)), 'medical results must remain unsupplied');
  assert(clinic?.parentId === 'location:black-whale:tier-3' && square?.parentId === 'location:black-whale:tier-3', 'clinic and gathering square must be Tier 3 locations');
  assert(/scheduled destination only/i.test(text(morgue)), 'Tier 1 morgue must remain a planned destination rather than a reached location');

  const tserriednich404 = archive.getCharacterStateAtChapter('character:tserriednich-hui-guo-rou', 404);
  assert(/below 3\.5/i.test(text(tserriednich404)) && !/3\.496/.test(text(tserriednich404)), 'Tserriednich must remain below 3.5 seconds without an invented precise timer');
  assert(/no.*Parallel Future|not a new activation/i.test(text(tserriednich404)), 'the training scene must not become a new Parallel Future activation');

  const fugetsu404 = archive.getCharacterStateAtChapter('character:fugetsu-hui-guo-rou', 404);
  const kacho404 = archive.getCharacterStateAtChapter('character:kacho-hui-guo-rou', 404);
  const withoutYou404 = archive.getAbilityKnowledgeAtChapter('ability:without-you', 404);
  assert(fugetsu404?.life === 'alive' && /weak.*asleep|alive, weak, and asleep/i.test(text(fugetsu404)), 'Fugetsu must remain alive, weak, and asleep');
  assert(/begins.*fade|fading/i.test(text({ kacho404, withoutYou404 })) && /cause.*unresolved|cause.*unknown/i.test(text({ kacho404, withoutYou404 })), 'Kacho-form’s fading must be observed without a resolved cause');
  assert(!/disappears|has disappeared/i.test(text({ kacho404, withoutYou404 })), 'Kacho-form must not be declared gone');
  assert(kacho404?.bodyStateCode === 'deceased' && kacho404?.identityStateCode === 'unresolved' && kacho404?.consciousnessStateCode === 'unknown', 'Kacho’s human state must remain separate from the active but fading Without You form');

  const sarahell404 = archive.getCharacterStateAtChapter('character:sarahell', 404);
  assert(/scheduled|expected attendee/i.test(text(sarahell404)) && /not yet entered|has not.*entered/i.test(text(sarahell404)), 'Sarahell must remain scheduled but not yet inside Room 1014');
  assert(!/activates a curse|curse activated/i.test(text(sarahell404)), 'Sarahell must not activate a curse in Chapter 404');

  const funeralAnnouncement = archive.getEntityById('event:chapter404-tier3-announces-halkenburg-death-and-noon-sendoff');
  const funeralAuthorization = archive.getEntityById('event:chapter404-benjamin-authorizes-noon-funeral-route-and-drops-charges');
  assert(/does not depart|does not.*begin|has not begun/i.test(text({ funeralAnnouncement, funeralAuthorization })), 'funeral must be announced and authorized without beginning');

  const publicTimeline404 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 404 && event.maintainedResearch);
  assert(publicTimeline404.length === 32, 'public timeline must expose all 32 maintained Chapter 404 beats');
  assert(new Set(publicTimeline404.map((event) => event.day)).has(11) && new Set(publicTimeline404.map((event) => event.day)).has(12), 'public timeline must place Chapter 404 beats on both voyage days');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 404/.test(group.group || '')), 'active dossier must include the Chapter 404 modernization group');
  assert((dossier.successionRelationships || []).every((record) => record.from && record.to && record.type && record.chapters && /^https:\/\/hunterxhunter\.fandom\.com\//.test(record.source || '')), 'active dossier relationships must remain compatible with legacy relationship consumers');
  assert((dossier.bodyStateLedger || []).every((record) => record.state && record.examples && record.rule && record.className && record.source), 'active dossier body states must remain compatible with legacy status consumers');
  assert(!(frozen403.guardAssignmentGroups || []).some((group) => /Chapter 404/.test(group.group || '')), 'frozen through-403 dossier must remain unaware of Chapter 404');
  const frozenMysteryIds = new Set((frozen403.successionMysteries || []).map((record) => record.id).filter(Boolean));
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession404Mysteries.every((record) => !frozenMysteryIds.has(record.id)), 'frozen through-403 dossier must not contain Chapter 404 mysteries');
  assert(chapterModule.succession404Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every Chapter 404 mystery');
  assert(activeArchive.publicationBoundary404?.chapter === 404, 'active archive must advance to Through404');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the supplied synopsis as the sole substantive story source');
  assert(/no.*title.*supplied|title.*not supplied/i.test(sourceNote), 'source note must explain the unsupplied-title boundary');
  assert(/Day 11.*Day 12|Wednesday.*Thursday/i.test(sourceNote), 'source note must preserve the two-day chronology');
  assert(/original-body death.*Chapter 404|dies.*Chapter 404/i.test(sourceNote), 'source note must assign the original-body death to Chapter 404');
  assert(/procession.*does not begin|not.*begin.*procession|funeral.*announced.*not/i.test(sourceNote), 'source note must keep the procession outside the boundary');
  assert(/No Chapter 405\+|Chapter 405\+.*excluded|Do not import.*405/i.test(sourceNote), 'source note must forbid Chapter 405+ backfill');

  console.log(`Chapter 404 boundary audit passed: ${dedicated404.length} dedicated events plus ${projected404.length} maintained projections preserve the Day 11→12 split, holder-linked coin observations, random forced-swap priority rules, original-body death with immediate Balsamilco-body continuity, and scheduled-only class/funeral boundaries.`);
} finally {
  await vite.close();
}
