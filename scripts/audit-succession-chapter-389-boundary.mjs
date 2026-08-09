import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 389 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession389Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index388 = numbers.indexOf(388);
  assert(index388 >= 0 && numbers[index388 + 1] === 389, 'maintained publication chain must place Chapter 389 directly after Chapter 388');
  assert(numbers[numbers.indexOf(389) + 1] === 390, 'Chapter 389 must now lead directly into the maintained Chapter 390 packet');
  assert(numbers[numbers.indexOf(390) + 1] === 391 && numbers[numbers.indexOf(391) + 1] === 400, 'maintained ordering must preserve 390 → 391 before the pre-existing Chapter 400 packet');

  const chapter389 = chapterModule.succession389ChapterResearch?.[0];
  assert(chapter389?.number === 389, 'dedicated Chapter 389 research must load');
  assert(chapter389.title === null && chapter389.titleStatus === 'not-supplied-no-title-invented', 'Chapter 389 title must remain unsupplied');
  assert(chapter389.chronology?.opening?.includes('Day 9') && chapter389.chronology?.opening?.includes('10:00'), 'opening must preserve the exact Day 9 10:00 a.m. flashback');
  assert(chapter389.chronology?.presentReturn?.includes('Day 10') && chapter389.chronology?.exactPresentReturnTime === '11:30 a.m.', 'present return must preserve Day 10 at 11:30 a.m.');
  assert(chapter389.chronology?.overlap?.includes('Chapter 388'), 'Chapter 389 must preserve the Chapter 388 fourth-rumbling overlap');

  const events389 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 389 && event.chapterRange?.end === 389);
  const eventIds = new Set(events389.map((event) => event.id));
  for (const id of [
    'event:kanjidol-balsamilco-shikaku-analysis',
    'event:vict-fourth-rumbling-radio-contact',
    'event:balsamilco-plans-halkenburg-custody-trial-operation',
    'event:restricted-voyage-agency-arrests-halkenburg',
    'event:giuliano-tyson-book-and-early-birthday',
    'event:kanjidol-basho-room1007-countertheories',
    'event:camilla-have-not-curse-network-disclosure',
    'event:have-not-curse-ritual-and-woble-plan',
    'event:zhang-lei-tenftory-coventoba-coin-progression',
  ]) assert(eventIds.has(id), `${id} must be in the Chapter 389 canonical event foundation`);

  const flashbackEvent = archive.getEntityById('event:kanjidol-balsamilco-shikaku-analysis');
  assert(flashbackEvent?.chronology?.day === 9 && flashbackEvent?.chronology?.timeOfDay === '10:00', 'Shikaku analysis must remain a Day 9 10:00 flashback');
  const victEvent = archive.getEntityById('event:vict-fourth-rumbling-radio-contact');
  assert(victEvent?.chronology?.day === 10 && victEvent?.chronology?.timeOfDay === '11:30', 'Vict radio event must remain at Day 10 11:30');

  const tackle = archive.getEntityById('ability:tackle-shield');
  assert(tackle?.firstChapter === 389 && tackle?.latestChapter === 389, 'Tackle Shield must enter at Chapter 389');
  assert(tackle?.classification?.nenTypes?.includes('unknown'), 'Tackle Shield Nen type must remain unknown');
  assert(/mechanics unrevealed|not supplied/i.test(text(tackle)), 'Tackle Shield must preserve its mechanics-unrevealed boundary');

  const haveNot = archive.getAbilityKnowledgeAtChapter('ability:have-not-curse', 389);
  assert(haveNot?.known, 'Have-Not Curse must be known at Chapter 389');
  const haveNotText = text(haveNot);
  assert(/ashes/i.test(haveNotText) && /dagger/i.test(haveNotText) && /Zetsu/i.test(haveNotText), 'Have-Not Chapter 389 knowledge must preserve the terminal ritual and strongest Zetsu effect');
  assert(!/enters the expanded Room 1014|inside the expanded Room 1014/i.test(haveNotText), 'later Sarahell class entry must not leak into Chapter 389 ability knowledge');
  assert(/plans to seek access|plans to attend|plans to approach/i.test(haveNotText), 'Sarahell must remain at the planning stage at Chapter 389');

  const sarahell389Room1014Event = events389.find((event) => event.participantIds?.includes('character:sarahell') && event.locationIds?.includes('location:black-whale:tier-1:room-1014'));
  assert(!sarahell389Room1014Event, 'Sarahell must not be recorded as physically present in Room 1014 in Chapter 389');

  const unsupportedBenjaminAbility = archive.getEntityById('ability:benjamin-guardian-curse-dispersal');
  assert(!unsupportedBenjaminAbility, 'unsupported Benjamin Guardian Curse Dispersal ability must not remain in the maintained graph');
  const benjaminBeastState = archive.getGuardianBeastStateAtChapter('guardian-beast:benjamin', 389);
  assert(!text(benjaminBeastState).includes('curse-dispersal') && !/dispersed low-level curse/i.test(text(benjaminBeastState)), 'Benjamin Guardian Spirit Beast must remain mechanically unresolved at the supplied Chapter 389 boundary');

  const coin = archive.getAbilityKnowledgeAtChapter('ability:zhang-lei-coins', 389);
  assert(coin?.known && /1 to 10/i.test(text(coin)), 'Zhang Lei coin knowledge must preserve the observed 1-to-10 change');
  assert(/meaning.*unknown|meaning.*unresolved/i.test(text(coin)), 'Chapter 389 coin-number meaning must remain unresolved');
  assert(!/same aura/i.test(text(coin)), 'Chapter 390 same-aura observation must not leak backward into Chapter 389');
  const zhangState = archive.getGuardianBeastStateAtChapter('guardian-beast:zhang-lei', 389);
  assert(/1 to 10/i.test(text(zhangState)), 'Zhang Lei Guardian Spirit Beast state must expose the Chapter 389 1-to-10 observation');
  assert(!/same aura/i.test(text(zhangState)), 'Chapter 390 same-aura beast-state observation must not leak backward into Chapter 389');

  const halkenburg = archive.getAbilityKnowledgeAtChapter('ability:halkenburg-possession-arrow', 389);
  assert(halkenburg?.known && /unresolved/i.test(halkenburg.summary), 'Halkenburg bow mechanics must remain partial at Chapter 389');
  assert(!halkenburg.mechanics?.knownUses?.some((value) => /Balsamilco/i.test(value)), 'later Balsamilco possession outcome must not leak into Chapter 389 known uses');
  assert(!/one-sacrifice-per-attack rule is confirmed/i.test(text(halkenburg)), 'Chapter 389 must not positively confirm a one-sacrifice-per-attack rule');

  const hypotheses = text(chapterModule.succession389ObserverHypotheses);
  assert(/Hypothesis only|Character theory|Threat assessment|Private suspicion/i.test(hypotheses), 'Kanjidol, Balsamilco, Benjamin, and Basho theories must remain explicitly epistemic');

  const tysonEvent = archive.getEntityById('event:giuliano-tyson-book-and-early-birthday');
  assert(/does not establish.*Nen/i.test(text(tysonEvent)), 'Giuliano attachment event must explicitly reject unsupported Nen causation');

  const custody = archive.getEntityById('event:restricted-voyage-agency-arrests-halkenburg');
  assert(/alive and in custody/i.test(text(custody)), 'Halkenburg must remain alive in custody rather than entering a death state');
  const rvpa = archive.getEntityById('organization:restricted-voyage-permit-agency');
  assert(rvpa?.entityType === 'organization', 'Restricted Voyage Permit Agency must exist as a canonical organization entity');

  const camillaStates = archive.successionArchiveData?.organizationStateProfiles?.['organization:camilla-private-guard'] || [];
  const camilla388 = camillaStates.find((record) => record.chapterRange.start <= 388 && (record.chapterRange.end ?? Infinity) >= 388);
  const camilla389 = camillaStates.find((record) => record.chapterRange.start <= 389 && (record.chapterRange.end ?? Infinity) >= 389);
  const camilla411 = camillaStates.find((record) => record.chapterRange.start <= 411 && (record.chapterRange.end ?? Infinity) >= 411);
  assert(camilla388 && !/Have-Not curse|curse-assassination/i.test(text(camilla388)), 'Camilla organization state before 389 must not reveal the Have-Not curse network');
  assert(camilla389 && /Have-Not curse-assassination/i.test(text(camilla389)), 'Camilla organization state at 389 must reveal the Have-Not curse network');
  assert(camilla389 && /only planned|only.*plan|planned/i.test(text(camilla389)), 'Camilla 389 state must preserve Sarahell as planning rather than already infiltrating');
  assert(camilla411 && /Room 1014/i.test(text(camilla411)), 'later Camilla organization state must preserve later Room 1014 progression');

  const dossierNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  assert(dossierNames.has('Tackle Shield') && dossierNames.has('Have-Not Curse') && dossierNames.has('Zhang Lei’s Guardian Coins'), 'active dossier must retain the three Chapter 389 ability records after the later chapter overlays');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 389')), 'active dossier must retain the Chapter 389 operational group after later chapter overlays');

  const note = fs.readFileSync('docs/source-notes/chapter-389.md', 'utf8');
  assert(/10:00 a\.m\. on Voyage Day 9/i.test(note) && /11:30 a\.m\. on Voyage Day 10/i.test(note), 'source note must preserve both exact chronology anchors');
  assert(/does not establish that his feelings were caused by Nen/i.test(note), 'source note must protect the Giuliano/Tyson non-causation boundary');

  console.log(`Chapter 389 boundary audit passed: ${events389.length} canonical events preserve the Day 9 flashback, Day 10 11:30 Vict confrontation, Halkenburg custody, Have-Not curse ritual, Sarahell planning boundary, and Zhang Lei coin 1→10 observation before Chapter 390 adds same-aura continuity.`);
} finally {
  await vite.close();
}
