import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession analytical finishing audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, finishing] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthFinishingSelectors.js'),
  ]);
  const chapter = 417;
  const setup = finishing.getSetupPayoffIndex(chapter);
  const foreshadowing = finishing.getForeshadowingTracker(chapter);
  const commitments = finishing.getPromisesContractsTracker(chapter);
  const spatial = finishing.getSpatialEvidenceIntelligence(chapter);
  const factions = finishing.getFactionRecentChangeSummaries(chapter);
  const leverage = finishing.getExplicitLeverageViews(chapter);
  const summary = finishing.getAnalyticalFinishingSummary(chapter);

  assert(setup.chapter === chapter && Array.isArray(setup.records), 'setup/payoff index shape is invalid');
  assert(setup.records.length > 0, 'setup/payoff index found no explicit cross-chapter causal links');
  assert(setup.records.every((row) => row.payoffChapter > row.setupChapter && row.payoffChapter <= chapter), 'setup/payoff index leaked an invalid or future payoff');
  assert(setup.records.every((row) => /authorial intent is not inferred/i.test(row.note)), 'setup/payoff rows lost their interpretation boundary');

  assert(foreshadowing.chapter === chapter && foreshadowing.signals.length > 0, 'foreshadowing tracker is empty');
  assert(foreshadowing.signals.every((row) => row.openedChapter < chapter), 'foreshadowing tracker contains a non-earlier signal');
  assert(foreshadowing.open.every((row) => row.resolutionChapter === null), 'open foreshadowing signals must not invent a resolution');
  assert(foreshadowing.resolved.every((row) => row.resolutionChapter <= chapter), 'resolved foreshadowing signal crosses the publication boundary');

  assert(commitments.total > 0, 'promises/contracts tracker is empty');
  assert(commitments.protocols.length + commitments.relationships.length + commitments.assignments.length === commitments.total, 'commitment tracker total is inconsistent');
  assert([...commitments.protocols, ...commitments.relationships, ...commitments.assignments].every((row) => row.sourceType && row.id), 'commitment tracker lost canonical record identity');

  assert(spatial.chapter === chapter && spatial.previousChapter === 416, 'spatial comparison must use 416 → 417 at the current boundary');
  assert(spatial.summary.systems >= 7, `Black Whale spatial intelligence exposes only ${spatial.summary.systems} systems`);
  assert(spatial.summary.locations > 0 && spatial.hotspots.length > 0, 'spatial evidence intelligence has no maintained locations/hotspots');
  assert(spatial.hotspots.every((row) => Number.isFinite(row.provenanceCoverage) && row.provenanceCoverage >= 0 && row.provenanceCoverage <= 100), 'spatial hotspot provenance coverage is invalid');

  assert(factions.length > 0, 'faction recent-change summaries are empty');
  assert(factions.every((row) => row.organization?.id && row.previousChapter === 416 && typeof row.changed === 'boolean'), 'faction recent-change row shape is invalid');

  assert(leverage.chapter === chapter && leverage.rows.length > 0, 'explicit leverage view is empty');
  assert(leverage.dimensions.join('|') === 'political|nen|legal|information', 'leverage view does not expose the four requested dimensions');
  assert(leverage.rows.every((row) => ['political', 'nen', 'legal', 'information'].every((key) => Number.isFinite(row[key]))), 'leverage dimensions must remain transparent numeric signal counts');

  const chapterChanges = [];
  for (let maintained = 340; maintained <= 417; maintained += 1) {
    const change = archive.getChapterWhatChanged(maintained);
    assert(change?.chapter === maintained, `What Changed? is missing Chapter ${maintained}`);
    assert(change.summary && Array.isArray(change.records), `What Changed? Chapter ${maintained} has an invalid diff shape`);
    assert(change.previousChapter === maintained - 1, `What Changed? Chapter ${maintained} has the wrong comparison boundary`);
    chapterChanges.push(change);
  }
  assert(chapterChanges.length === 78, `expected 78 maintained Chapter 340–417 change briefs, found ${chapterChanges.length}`);

  assert(summary.setupPayoff === setup.records.length, 'finishing summary lost setup/payoff count');
  assert(summary.foreshadowingSignals === foreshadowing.signals.length, 'finishing summary lost structural signal count');
  assert(summary.commitments === commitments.total, 'finishing summary lost commitment count');
  assert(summary.spatialSystems === spatial.summary.systems, 'finishing summary lost spatial-system count');

  const [panelSource, bridgeSource] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionAnalyticalFinishingPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
  ]);
  for (const token of ['Setup / payoff index', 'Foreshadowing tracker', 'Promises / contracts tracker', 'Black Whale evidence-led spatial intelligence', 'Faction recent-change summaries', 'Political / Nen / legal / information leverage']) {
    assert(panelSource.includes(token), `released analytical panel is missing ${token}`);
  }
  assert(panelSource.includes('authorial intent') && panelSource.includes('never promoted into predicted payoffs'), 'analytical panel lost inference/foreshadowing safety language');
  assert(bridgeSource.includes('SuccessionAnalyticalFinishingPanel') && bridgeSource.includes('depthActive'), 'Research depth bridge does not mount the analytical finishing layer');

  console.log(`Succession analytical finishing audit passed: ${setup.records.length} cross-chapter setup/payoff links, ${foreshadowing.signals.length} structural story signals, ${commitments.total} commitment records, ${spatial.summary.systems} Black Whale systems, ${factions.length} faction summaries, ${leverage.rows.length} leverage dossiers, and 78/78 maintained What Changed? briefs through Chapter 417.`);
} finally {
  await vite.close();
}
