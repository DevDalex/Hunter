import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession strategic content depth audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const chapter = 417;
  const princes = archive.getPrinceCampaignBoard(chapter);
  const queens = archive.getQueenIntelligenceBoard(chapter);
  const knowledge = archive.getKnowledgeWarfareMatrix(chapter);
  const curses = archive.getCurseRegistry(chapter);
  const bodies = archive.getBodyIdentityConsciousnessExplorer(chapter);
  const threats = archive.getThreatAssassinationMatrix(chapter);
  const command = archive.getMartialLawCommandBoard(chapter);
  const heilLy = archive.getHeilLyContagionDashboard(chapter);
  const households = archive.getRoyalHouseholdMatrix(chapter);
  const rules = archive.getSuccessionRulesEngine(chapter);
  const training = archive.getNenTrainingTracker(chapter);
  const transfers = archive.getAbilityTransferInheritanceLedger(chapter);
  const mafia = archive.getMafiaWarCommandCenter(chapter);
  const troupe = archive.getTroupeHisokaTracker(chapter);
  const kurapika = archive.getKurapikaMissionLedger(chapter);
  const life = archive.getLifeStatusLedger(chapter);
  const deception = archive.getDeceptionLedger(chapter);
  const operations = archive.getOrdersSurveillanceCustodyLedger(chapter);
  const alliances = archive.getAllianceBetrayalLedger(chapter);
  const countdowns = archive.getActiveCountdowns(chapter);
  const unresolved = archive.getUnresolvedLedgers(chapter);
  const leverage = archive.getLeverageBoard(chapter);
  const factions = archive.getFactionResourceBoard(chapter);
  const readerKnowledge = archive.getReaderVsInUniverseKnowledge(chapter);
  const consequences = archive.getConsequenceChains(chapter);
  const summary = archive.getContentDepthSummary(chapter);
  const chapterChange = archive.getChapterWhatChanged(chapter);

  assert(princes.length === 14, `expected 14 princes, found ${princes.length}`);
  assert(new Set(princes.map((row) => row.character.id)).size === 14, 'prince campaign board contains duplicate princes');
  assert(princes.every((row) => row.life && row.body && row.identity && row.consciousness), 'prince campaign rows must expose multi-dimensional state');
  assert(queens.length === 8, `expected 8 queens, found ${queens.length}`);
  assert(knowledge.length >= 8, 'knowledge warfare matrix is unexpectedly shallow at Chapter 417');
  assert(knowledge.some((row) => row.id === 'knowledge-record:benjamin-layered-affliction'), 'current Benjamin knowledge record is missing from warfare matrix');
  assert(curses.abilities.length > 0 && curses.protocols.length > 0, 'curse registry must expose both abilities and protocols');
  assert(Array.isArray(bodies), 'body/identity/consciousness explorer did not return rows');
  assert(threats.length > 0, 'threat/assassination matrix is empty');
  assert(command.institutions.length >= 2, 'martial-law board must expose military/Justice institutions');
  assert(command.protocolIds.includes('protocol:special-martial-law-order'), 'martial-law board is missing the formal Chapter 415 protocol');
  assert(heilLy.organization?.id === 'organization:heil-ly', 'Heil-Ly dashboard lost canonical organization ownership');
  assert(households.length === 14, 'royal household matrix must align with all fourteen princes');
  assert(rules.records.length >= 10 && rules.domains.length >= 5, 'rules engine is missing canonical protocol breadth');
  assert(Array.isArray(training.eventIds) && Array.isArray(training.participants), 'Nen training tracker shape is invalid');
  assert(transfers.length > 0, 'ability transfer/inheritance ledger is empty');
  assert(mafia.length === 3, 'mafia command center must expose Xi-Yu, Cha-R, and Heil-Ly');
  assert(troupe.organization?.id === 'organization:phantom-troupe', 'Troupe tracker lost Phantom Troupe ownership');
  assert(kurapika.dossier?.character?.id === 'character:kurapika', 'Kurapika mission ledger lost its campaign dossier');
  assert(kurapika.missions.length === 6, 'Kurapika mission ledger must retain six explicit mission dimensions');
  assert(life.length > 100, 'life-state ledger must cover the broad character catalogue');
  assert(Array.isArray(deception), 'deception ledger shape is invalid');
  assert(Array.isArray(operations.assignmentIds) && Array.isArray(operations.relationshipIds), 'orders/surveillance/custody ledger shape is invalid');
  assert(Array.isArray(alliances), 'alliance/betrayal ledger shape is invalid');
  assert(countdowns.threadIds.includes('story-thread:benjamin-layered-countdown'), 'active countdowns must include Benjamin’s current-release deadline thread');
  assert(unresolved.identities.length > 0 && unresolved.abilities.length > 0, 'unresolved intelligence ledgers are empty');
  assert(leverage.length > 0, 'leverage board is empty');
  assert(factions.length > 0, 'faction resource board is empty');
  assert(readerKnowledge.length === knowledge.length, 'reader-vs-in-universe knowledge must cover the warfare matrix one-for-one');
  assert(Array.isArray(consequences.nodes) && Array.isArray(consequences.links), 'consequence-chain graph shape is invalid');
  assert(summary.princes === 14 && summary.queens === 8 && summary.mysteries >= 19, 'content-depth summary lost core coverage');
  assert(chapterChange.chapter === 417 && chapterChange.previousChapter === 416, 'Chapter 417 “What Changed?” comparison boundary is incorrect');

  const [componentSource, cssSource, bridgeSource, dataSource] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionContentDepthWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionContentDepthWorkbench.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/data/succession/successionData.js'), 'utf8'),
  ]);
  for (const token of ['14 Princes', '8 Queens', 'Knowledge War', 'Threats', 'Body / Identity', 'Martial Law', 'Heil-Ly', 'Households', 'Rules Engine', 'Nen Trackers', 'Factions', 'Campaigns', 'What Changed?', 'Deep Analysis']) {
    assert(componentSource.includes(token), `strategic workbench is missing ${token}`);
  }
  assert(!cssSource.includes('@media (max-width:'), 'strategic workbench must not introduce mobile/tablet breakpoints');
  assert(cssSource.includes('@media (prefers-reduced-motion: reduce)'), 'desktop reduced-motion support must remain explicit');
  assert(bridgeSource.includes("workspace === 'depth'"), 'Research bridge does not isolate full strategic mode from the legacy Phase 4 sibling');
  assert(dataSource.includes('createContentDepthStrategicSelectors'), 'public Succession data entry does not instantiate strategic selectors');
  assert(dataSource.includes('getPrinceCampaignBoard') && dataSource.includes('getConsequenceChains'), 'public Succession data entry does not export the strategic selector family');

  console.log(`Succession strategic content depth audit passed: 14 princes, 8 queens, ${knowledge.length} knowledge claims, ${threats.length} threat signals, ${rules.records.length} rules, ${transfers.length} transfer/inheritance abilities, ${factions.length} faction snapshots, and ${summary.mysteries} mystery cases through Chapter 417.`);
} finally {
  await vite.close();
}
