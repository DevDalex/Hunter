import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 402 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-402.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession402Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen401 = await vite.ssrLoadModule('/src/data/successionDossierThrough401.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index400 = numbers.indexOf(400);
  assert(index400 >= 0 && numbers[index400 + 1] === 401 && numbers[index400 + 2] === 402 && numbers[index400 + 3] === 403 && numbers[index400 + 4] === 406, 'maintained publication chain must be 400 → 401 → 402 → 403 → 406');

  const chapter402 = chapterModule.succession402ChapterResearch?.[0];
  assert(chapter402?.number === 402, 'Chapter 402 research must load');
  assert(chapter402.title === null && /not-supplied/i.test(chapter402.titleStatus), 'Chapter 402 must not invent a title');
  assert(chapter402.voyageDay === 'Voyage Days 10–11' && chapter402.chronology?.presentDay === true, 'Chapter 402 must preserve the Day 10–11 present-day frame');
  assert(chapter402.chronology?.presentationOrderNonLinear === true, 'Chapter 402 must preserve its non-linear Day 11 presentation order');
  assert(/1:30/.test(chapter402.chronology?.exactClockTime || '') && /6:00/.test(chapter402.chronology?.exactClockTime || '') && /8:00/.test(chapter402.chronology?.exactClockTime || '') && /8:50/.test(chapter402.chronology?.exactClockTime || ''), 'all four supplied clock anchors must be preserved');
  assert(chapterModule.succession402TimelineEvents.length === 24, 'maintained research must preserve all 24 Chapter 402 beats');

  const events402 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 402 && event.chapterRange?.end === 402);
  const projected402 = events402.filter((event) => event.maintainedResearch === true);
  const dedicated402 = events402.filter((event) => String(event.id || '').startsWith('event:chapter402-') && !event.maintainedResearch);
  assert(projected402.length === 24, 'story intelligence must project all 24 maintained Chapter 402 beats');
  assert(dedicated402.length === 24, 'Chapter 402 must expose 24 dedicated canonical events distinct from maintained projections');
  assert(dedicated402.every((event) => event.chronology?.day === 10 || event.chronology?.day === 11), 'dedicated events must stay on supplied Voyage Days 10 or 11');
  assert(archive.getEntityById('event:chapter402-1330-zhang-lei-tenftory-three-prince-surrender-proposal')?.chronology?.timeOfDay === '1:30 p.m.', 'opening diplomacy event must preserve Day 10 1:30 p.m.');
  assert(archive.getEntityById('event:chapter402-day11-0600-kacho-form-shows-fugetsu-shoulder-mark')?.chronology?.timeOfDay === '6:00 a.m.', 'Fugetsu mark scene must preserve Day 11 6:00 a.m.');
  assert(archive.getEntityById('event:chapter402-day11-0800-tserriednich-zetsu-967-seconds')?.chronology?.timeOfDay === '8:00 a.m.', 'Tserriednich training must preserve Day 11 8:00 a.m.');
  assert(archive.getEntityById('event:chapter402-day11-0850-luzurus-operation-debrief-basho-buys-time')?.chronology?.timeOfDay === '8:50 a.m.', 'Justice debrief must preserve Day 11 8:50 a.m.');

  const secondCoin = archive.getEntityById('event:chapter402-zhang-lei-gives-tenftory-second-coin-fortune-holder-hypothesis');
  assert(/second coin/i.test(text(secondCoin)), 'Tenftory must receive a second Guardian Coin');
  assert(/hypoth|considers|privately/i.test(text(secondCoin)), 'holder-dependent coin power must remain Zhang Lei analysis');
  const coin402 = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 402);
  assert(/second coin/i.test(text(coin402)), 'Chapter 402 coin knowledge must preserve the second Tenftory coin');
  assert(/not independently demonstrated|speculation|unresolved/i.test(text(coin402)), 'fortune/holder effect must not become a confirmed coin mechanic');

  const tubeppaBeast = archive.getGuardianBeastStateAtChapter?.('guardian-beast:tubeppa', 402) || archive.getEntityById('guardian-beast:tubeppa');
  assert(/Rihan|croak|fume|conditional/i.test(text(tubeppaBeast)), 'Tubeppa beast state must preserve Rihan’s observed manifestation');
  assert(/unresolved|theor|deduction|not confirm/i.test(text(tubeppaBeast)), 'Rihan’s conditional-trigger interpretation must remain unresolved');

  const balsamilco = archive.getCharacterStateAtChapter('character:balsamilco-might', 402);
  assert(/shoe|pathological|vial/i.test(text(balsamilco)), 'Balsamilco state must preserve weapon preparation');
  assert(/exposure|infection|outcome|Will Halkenburg/i.test(text(balsamilco)), 'Balsamilco state must not claim successful Halkenburg exposure');
  const halkenburgThreat = archive.getEntityById('relationship:balsamilco-halkenburg-ch402-covert-pathogen-assassination');
  assert(/prepared|not.*exposure|not yet.*delivered/i.test(text(halkenburgThreat)), 'Balsamilco–Halkenburg relationship must stop at prepared attack');

  const tserriednich = archive.getCharacterStateAtChapter('character:tserriednich-hui-guo-rou', 402);
  assert(/9\.67/i.test(text(tserriednich)), 'Tserriednich state must preserve 9.67-second Zetsu');
  const future402 = archive.getAbilityKnowledgeAtChapter('ability:parallel-future', 402);
  assert(/9\.67/i.test(text(future402)), 'Parallel Future knowledge must preserve the training benchmark');
  assert(/unconfirmed|cannot resolve|does not.*resolve/i.test(text(future402)), 'Salkov’s jester-beast/Theta theories must remain unresolved');

  const worm401 = archive.getAbilityKnowledgeAtChapter('ability:magical-worm', 401);
  const worm402 = archive.getAbilityKnowledgeAtChapter('ability:magical-worm', 402);
  assert(!/lifeboat emergency|outside-ship|Luzurus.*master bedroom|third part/i.test(text({ summary: worm401?.summary, mechanics: worm401?.mechanics })), 'Chapter 401 Magical Worm knowledge must not leak Chapter 402 route revelations');
  assert(/lifeboat/i.test(text(worm402)) && /outside/i.test(text(worm402)) && /prior|visit/i.test(text(worm402)), 'Chapter 402 Magical Worm knowledge must add lifeboat reach, outside-ship failure, and prior-visit routing');
  assert(/third.*unconfirm|test.*not|not completed/i.test(text(worm402)), 'general third-party Magical Worm access must remain unconfirmed');

  const affliction401 = archive.getAbilityKnowledgeAtChapter('ability:fugetsu-unidentified-hostile-spirit-affliction', 401);
  const affliction402 = archive.getAbilityKnowledgeAtChapter('ability:fugetsu-unidentified-hostile-spirit-affliction', 402);
  assert(!/shoulder|Luzurus|Basho|Benjamin.*screech/i.test(text({ summary: affliction401?.summary, mechanics: affliction401?.mechanics })), 'Chapter 401 affliction knowledge must remain unaware of Chapter 402 mark/suspects/counters');
  assert(/shoulder/i.test(text(affliction402)) && /Benjamin/i.test(text(affliction402)) && /Basho/i.test(text(affliction402)), 'Chapter 402 affliction knowledge must preserve mark and temporary suppression observations');
  assert(/unconfirmed|hypoth|unknown/i.test(text(affliction402)) && /Luzurus/i.test(text(affliction402)), 'Luzurus must remain an unconfirmed suspect');
  assert(/Magical Worm.*not|does not.*Magical Worm|No causal link/i.test(text(affliction402)), 'Magical Worm must not be declared the cause of Fugetsu’s affliction');

  const fugetsu = archive.getCharacterStateAtChapter('character:fugetsu-hui-guo-rou', 402);
  assert(fugetsu?.life === 'alive' && /shoulder/i.test(text(fugetsu)), 'Fugetsu must remain alive with the new shoulder mark');
  assert(/unknown|unresolved|Is Luzurus/i.test(text(fugetsu)), 'Fugetsu state must keep attacker/Luzurus causation unresolved');
  const luzurus = archive.getCharacterStateAtChapter('character:luzurus-hui-guo-rou', 402);
  assert(/unconfirmed|no proof|suspect/i.test(text(luzurus)), 'Luzurus state must not promote suspicion into guilt');

  const kaiser = archive.getCharacterStateAtChapter('character:kaiser', 402);
  assert(/ideological|gentler|Fugetsu/i.test(text(kaiser)), 'Kaiser state must preserve his stated political motive');
  assert(/unresolved|manipulat|actual sincerity/i.test(text(kaiser)), 'Kaiser sincerity/manipulation status must remain unresolved');
  const melodyKaiser = archive.getEntityById('relationship:melody-kaiser-ch402-fugetsu-operation-distrust');
  assert(/unresolved|distrust|manipulat/i.test(text(melodyKaiser)), 'Melody–Kaiser cooperation must preserve distrust');

  const benjamin = archive.getCharacterStateAtChapter('character:benjamin-hui-guo-rou', 402);
  assert(/does not satisfy|does not meet|not.*martial/i.test(text(benjamin)), 'Benjamin state must keep Special Martial Law inactive');
  const martial = archive.getEntityById('event:chapter402-kaiser-leads-benjamin-into-martial-law-threshold-discussion');
  assert(/does not meet/i.test(text(martial)) && /Kaiser.*infer|inference|privately/i.test(text(martial)), 'martial-law event must separate Benjamin’s threshold statement from Kaiser’s intent inference');

  const basho = archive.getEntityById('event:chapter402-basho-haiku-charm-temporarily-repels-low-level-spirits');
  assert(/haiku|good-luck charm/i.test(text(basho)), 'Basho’s charm must be preserved');
  assert(!/Great Haiku|Nen type.*Enhancement|Nen type.*Conjuration/i.test(text(basho)), 'Chapter 402 must not invent an official Basho ability name or Nen type from the charm scene');

  const halkenburg = archive.getEntityById('event:chapter402-melody-halkenburg-rumble-illness-letter-contact-plan');
  assert(/guess|unresolved/i.test(text(halkenburg)), 'Halkenburg rumble ownership must remain Melody inference');
  assert(!/pathogen caused|Balsamilco.*infected|infected.*Balsamilco/i.test(text(halkenburg)), 'Halkenburg illness must not be causally backfilled to Balsamilco’s weapon');

  const melodyCell = archive.getEntityById('location:black-whale:tier-2:justice-bureau:melody-cell');
  const kaiserOffice = archive.getEntityById('location:black-whale:tier-2:justice-bureau:kaiser-office');
  const lifeboat = archive.getEntityById('location:black-whale:lifeboat-area:first-lifeboat');
  assert(melodyCell?.parentId === 'location:black-whale:tier-2:justice-bureau', 'Melody cell must be a Justice Bureau child location');
  assert(kaiserOffice?.parentId === 'location:black-whale:tier-2:justice-bureau', 'Kaiser office must be a Justice Bureau child location');
  assert(lifeboat?.parentId === 'location:black-whale:lifeboat-area', 'first lifeboat must be nested under the emergency lifeboat area');

  const justice402 = archive.getOrganizationStateAtChapter?.('organization:kakin-justice-bureau', 402);
  assert(/Fugetsu|letter|Luzurus/i.test(text(justice402)), 'Justice organization state must preserve the Chapter 402 Fugetsu operation');
  assert(/not.*active|without.*active|No Special/i.test(text(justice402)), 'Justice state must keep Special Martial Law inactive');

  const publicTimeline402 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 402);
  assert(publicTimeline402.length === 24, 'public timeline must expose all 24 maintained Chapter 402 beats');
  assert(publicTimeline402.some((event) => event.id === '402-day11-0800-tserriednich-zetsu-967-seconds'), 'public timeline must include the 8:00 a.m. Tserriednich beat');
  assert(publicTimeline402.some((event) => event.id === '402-day11-0600-kacho-form-shows-fugetsu-shoulder-mark'), 'public timeline must also preserve the later-presented 6:00 a.m. cutback');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 402/.test(group.group || '')), 'active dossier must include the Chapter 402 modernization group');
  assert(!(frozen401.guardAssignmentGroups || []).some((group) => /Chapter 402/.test(group.group || '')), 'frozen through-401 dossier must remain unaware of Chapter 402');
  const frozen401MysteryIds = new Set((frozen401.successionMysteries || []).map((record) => record.id).filter(Boolean));
  const active402MysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession402Mysteries.every((record) => !frozen401MysteryIds.has(record.id)), 'frozen through-401 dossier must not contain Chapter 402 mystery records');
  assert(chapterModule.succession402Mysteries.every((record) => active402MysteryIds.has(record.id)), 'active through-402 dossier must expose every Chapter 402 mystery record');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must preserve the current synopsis as sole substantive story source');
  assert(/no title.*invented|no title.*supplied/i.test(sourceNote), 'source note must explain the unsupplied-title boundary');
  assert(/1:30 p\.m\./i.test(sourceNote) && /6:00 a\.m\./i.test(sourceNote) && /8:00 a\.m\./i.test(sourceNote) && /8:50 a\.m\./i.test(sourceNote), 'source note must preserve all four exact clock anchors');
  assert(/does not.*legally valid|does not.*declare.*surrender/i.test(sourceNote), 'source note must keep surrender legality unresolved');
  assert(/preparation and intent.*not confirmed exposure|preparation.*not.*exposure/i.test(sourceNote), 'source note must block Balsamilco exposure backfill');
  assert(/Luzurus may not be responsible|unconfirmed suspect|does not.*culprit/i.test(sourceNote), 'source note must preserve the Luzurus suspect boundary');
  assert(/not declared or active|not.*active/i.test(sourceNote), 'source note must keep Special Martial Law inactive');
  assert(/No Chapter 403\+|no Chapter 403\+/i.test(sourceNote), 'source note must forbid Chapter 403+ backfill');

  console.log(`Chapter 402 boundary audit passed: ${dedicated402.length} dedicated canonical events plus ${projected402.length} maintained-research projections preserve the non-linear Day 10/11 chronology, lower-prince compact, prepared-but-unexposed Balsamilco weapon, 9.67-second Zetsu checkpoint, Fugetsu mark/route crisis, unconfirmed Luzurus theory, inactive martial law, and Chapter 403+ spoiler firewall.`);
} finally {
  await vite.close();
}
