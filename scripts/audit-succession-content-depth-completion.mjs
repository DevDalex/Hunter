import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession content-depth completion audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, finishing, mysteries, translations] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthFinishingSelectors.js'),
    vite.ssrLoadModule('/src/data/succession/successionMysteryCases.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthTranslationVariants.js'),
  ]);
  const chapter = 417;

  // P0 · Canonical depth closure.
  const knowledge = archive.getKnowledgeRecordsAtChapter(chapter);
  const protocols = archive.getProtocolRecordsAtChapter(chapter);
  const artifacts = archive.getArtifactsAtChapter(chapter);
  const editorial = archive.getEditorialChangeLog();
  const storyThreads = archive.getStoryThreadsAtChapter(chapter);
  const princes = archive.getPrinceCampaignBoard(chapter);
  assert(knowledge.some((row) => row.id === 'knowledge-record:benjamin-layered-affliction'), 'P0 Knowledge & Secrecy is not closed through Chapter 417');
  assert(protocols.some((row) => row.id === 'protocol:gypsy-life-host-transfer') && protocols.some((row) => row.id === 'protocol:special-martial-law-order'), 'P0 Rules / Law / Ritual protocols are not closed through Chapter 417');
  assert(artifacts.some((row) => row.id === 'object:tsk-17') && artifacts.some((row) => row.id === 'document:first-unit-reactivation-order-417') && artifacts.some((row) => row.id === 'evidence-item:unma-halkenburg-publication-endpoint'), 'P0 Objects / Documents / Evidence are not closed through Chapter 417');
  assert(editorial.entries?.some((row) => row.id === 'change:content-depth-417-p0'), 'P0 editorial/revision history lacks the current content-depth entry');
  assert(mysteries.successionMysteryCases.length >= 19 && mysteries.successionMysteryCases.every((row) => Array.isArray(row.candidates) && Array.isArray(row.knownFacts) && Array.isArray(row.unknowns) && Array.isArray(row.resolutionHistory)), 'P0 mystery case-file model is incomplete');
  for (const id of ['story-thread:benjamin-layered-countdown', 'story-thread:tserriednich-room1004-reality', 'story-thread:tubeppa-tyson-tsk17', 'story-thread:gypsy-life-host-transfer', 'story-thread:benjamin-unma-confrontation']) {
    assert(storyThreads.some((row) => (row.profile || row).id === id), `P0 Story Intelligence is missing ${id}`);
  }
  assert(princes.length === 14, 'P0 all-14-princes campaign board is incomplete');

  // P1 · Core strategic intelligence.
  const p1 = {
    knowledge: archive.getKnowledgeWarfareMatrix(chapter),
    heilLy: archive.getHeilLyContagionDashboard(chapter),
    command: archive.getMartialLawCommandBoard(chapter),
    curses: archive.getCurseRegistry(chapter),
    threats: archive.getThreatAssassinationMatrix(chapter),
    bodies: archive.getBodyIdentityConsciousnessExplorer(chapter),
    households: archive.getRoyalHouseholdMatrix(chapter),
    campaign: archive.getCharacterCampaignDossier('character:kurapika', chapter),
    queens: archive.getQueenIntelligenceBoard(chapter),
    rules: archive.getSuccessionRulesEngine(chapter),
    training: archive.getNenTrainingTracker(chapter),
    transfers: archive.getAbilityTransferInheritanceLedger(chapter),
  };
  assert(p1.knowledge.length > 0, 'P1 knowledge warfare matrix is empty');
  assert(p1.heilLy.organization?.id === 'organization:heil-ly', 'P1 Heil-Ly dashboard lost canonical ownership');
  assert(p1.command.protocolIds.includes('protocol:special-martial-law-order'), 'P1 Martial Law / Justice / Military board is incomplete');
  assert(p1.curses.abilities.length > 0 && p1.threats.length > 0, 'P1 curse/threat intelligence is empty');
  assert(Array.isArray(p1.bodies) && p1.bodies.length > 0, 'P1 body/identity/consciousness explorer is empty');
  assert(p1.households.length === 14, 'P1 royal household matrix is incomplete');
  assert(p1.campaign?.character?.id === 'character:kurapika', 'P1 major-character campaign dossier is unavailable');
  assert(p1.queens.length === 8, 'P1 Eight Queens intelligence view is incomplete');
  assert(p1.rules.records.length > 0, 'P1 Succession Rules Engine is empty');
  assert(Array.isArray(p1.training.eventIds) && Array.isArray(p1.training.participants), 'P1 Nen training tracker is unavailable');
  assert(p1.transfers.length > 0, 'P1 ability transfer/inheritance ledger is empty');
  for (let maintained = 340; maintained <= 417; maintained += 1) {
    const change = archive.getChapterWhatChanged(maintained);
    assert(change?.chapter === maintained, `P1 What Changed? is missing Chapter ${maintained}`);
    assert(change.previousChapter === maintained - 1, `P1 What Changed? Chapter ${maintained} is not compared with Chapter ${maintained - 1}`);
  }

  // P2 · Faction, spatial, and evidence depth.
  const spatial = finishing.getSpatialEvidenceIntelligence(chapter);
  const variants = translations.getSuccessionTranslationSummary(chapter);
  const provenance = archive.getProvenanceCoverageReport(chapter);
  const troupe = archive.getTroupeHisokaTracker(chapter);
  assert(archive.getMafiaWarCommandCenter(chapter).length === 3, 'P2 Mafia war command center is incomplete');
  assert(troupe.troupe?.organization?.id === 'organization:phantom-troupe' && troupe.hisoka?.id === 'character:hisoka-morow', 'P2 Phantom Troupe / Hisoka tracker is incomplete');
  assert(spatial.summary.systems >= 7 && spatial.hotspots.length > 0, 'P2 Black Whale evidence-led spatial intelligence is incomplete');
  assert(variants.records >= 4 && variants.mechanicsImpacting >= 1, 'P2 translation-variant mechanics-impact registry is incomplete');
  assert(provenance.claims > 0 && Number.isFinite(provenance.coverage), 'P2 claim-level provenance coverage is unavailable');
  assert(archive.getKurapikaMissionLedger(chapter).missions.length === 6, 'P2 Kurapika mission ledger is incomplete');
  assert(archive.getLifeStatusLedger(chapter).length > 100, 'P2 life-status subview does not cover the maintained character catalogue');

  // P3 · Analytical finishing layer.
  const setup = finishing.getSetupPayoffIndex(chapter);
  const foreshadowing = finishing.getForeshadowingTracker(chapter);
  const deception = archive.getDeceptionLedger(chapter);
  const commitments = finishing.getPromisesContractsTracker(chapter);
  const alliances = archive.getAllianceBetrayalLedger(chapter);
  const operations = archive.getOrdersSurveillanceCustodyLedger(chapter);
  const countdowns = archive.getActiveCountdowns(chapter);
  const unresolved = archive.getUnresolvedLedgers(chapter);
  const leverage = finishing.getExplicitLeverageViews(chapter);
  const factionChanges = finishing.getFactionRecentChangeSummaries(chapter);
  const consequences = archive.getConsequenceChains(chapter);
  const readerKnowledge = archive.getReaderVsInUniverseKnowledge(chapter);
  assert(setup.records.length > 0, 'P3 setup/payoff index is empty');
  assert(foreshadowing.signals.length > 0, 'P3 foreshadowing tracker is empty');
  assert(Array.isArray(deception), 'P3 deception / cover-story ledger is unavailable');
  assert(commitments.total > 0, 'P3 promises/contracts tracker is empty');
  assert(Array.isArray(alliances), 'P3 alliance/betrayal tracker is unavailable');
  assert(Array.isArray(operations.assignmentIds) && Array.isArray(operations.relationshipIds), 'P3 orders/surveillance/custody tracker is unavailable');
  assert(countdowns.threadIds.length + countdowns.mysteryCaseIds.length > 0, 'P3 active countdowns are empty');
  assert(unresolved.identities.length > 0 && unresolved.abilities.length > 0, 'P3 unresolved intelligence ledgers are incomplete');
  assert(leverage.dimensions.join('|') === 'political|nen|legal|information' && leverage.rows.length > 0, 'P3 four-dimensional leverage view is incomplete');
  assert(factionChanges.length > 0 && factionChanges.every((row) => row.changes), 'P3 faction resource/recent-change summaries are incomplete');
  assert(Array.isArray(consequences.nodes) && Array.isArray(consequences.links), 'P3 multi-chapter consequence chains are unavailable');
  assert(readerKnowledge.length === p1.knowledge.length, 'P3 reader vs in-universe knowledge comparison is incomplete');

  // Released-surface closure and depth modes.
  const [strategicUi, finishingUi, evidenceUi, readingUi, bridgeUi] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionContentDepthWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionAnalyticalFinishingPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEvidenceTranslationWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionReadingDepthWorkspace.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
  ]);
  for (const token of ['14 Princes', '8 Queens', 'Knowledge War', 'Martial Law', 'Heil-Ly', 'Rules Engine', 'Nen Trackers', 'Factions', 'Campaigns', 'What Changed?', 'Deep Analysis']) assert(strategicUi.includes(token), `released strategic UI is missing ${token}`);
  for (const token of ['Setup / payoff index', 'Foreshadowing tracker', 'Promises / contracts tracker', 'Black Whale evidence-led spatial intelligence', 'Faction recent-change summaries', 'Political / Nen / legal / information leverage']) assert(finishingUi.includes(token), `released finishing UI is missing ${token}`);
  assert(evidenceUi.includes('Claim-level provenance coverage') && evidenceUi.includes('Translation'), 'released evidence UI is missing provenance/translation closure');
  for (const token of ['60-second', 'Standard', 'Deep analysis', 'Evidence']) assert(readingUi.includes(token), `released depth-mode UI is missing ${token}`);
  assert(bridgeUi.includes('SuccessionAnalyticalFinishingPanel') && bridgeUi.includes("workspace === 'depth'"), 'Research route does not expose the complete depth system');

  console.log(`Succession content-depth completion audit passed: P0–P3 released through Chapter 417 with 14 princes, 8 queens, ${mysteries.successionMysteryCases.length} mystery cases, 78/78 chapter-change briefs, ${setup.records.length} setup/payoff links, ${foreshadowing.signals.length} structural signals, ${commitments.total} commitment records, ${spatial.summary.systems} spatial systems, and four explicit leverage dimensions.`);
} finally {
  await vite.close();
}
