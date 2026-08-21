import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession systems comprehension audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, finishing, refinement] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthFinishingSelectors.js'),
    vite.ssrLoadModule('/src/data/succession/workspaceRefinementRuntime.js'),
  ]);

  const chapter = 417;
  const princes = archive.getPrinceCampaignBoard(chapter);
  const knowledge = archive.getKnowledgeWarfareMatrix(chapter);
  const readerKnowledge = archive.getReaderVsInUniverseKnowledge(chapter);
  const deception = archive.getDeceptionLedger(chapter);
  const bodyIdentity = archive.getBodyIdentityConsciousnessExplorer(chapter);
  const leverage = finishing.getExplicitLeverageViews(chapter);
  const transfers = archive.getAbilityTransferInheritanceLedger(chapter);
  const training = archive.getNenTrainingTracker(chapter);
  const interactions = refinement.getAbilityInteractionMatrix(chapter, { limit: 80 });
  const comparison = refinement.getBlackWhaleSnapshotComparison(416, 417);
  const infrastructure = refinement.getShipInfrastructureIndex(chapter);
  const spatial = finishing.getSpatialEvidenceIntelligence(chapter);

  assert(princes.length === 14, `prince comparison must retain all 14 princes; found ${princes.length}`);
  assert(knowledge.length > 0, 'knowledge matrix is empty');
  assert(readerKnowledge.length === knowledge.length, 'reader-vs-in-universe knowledge must preserve every maintained knowledge record');
  assert(readerKnowledge.every((record) => record.readerState === 'available-through-selected-boundary'), 'reader visibility boundary state is inconsistent');
  assert(Array.isArray(deception), 'deception ledger is unavailable');
  assert(bodyIdentity.length > 0, 'body / identity / consciousness explorer is empty');
  assert(Array.isArray(leverage.rows) && leverage.rows.length > 0, 'explicit leverage dimensions are unavailable');
  assert(transfers.length > 0, 'transfer / inheritance ledger is empty');
  assert(Array.isArray(training.participants), 'Nen training participants are unavailable');
  assert(Array.isArray(interactions.interactions), 'ability interaction matrix is unavailable');
  assert(Array.isArray(comparison.movements), 'Black Whale movement comparison is unavailable');
  assert(Array.isArray(infrastructure.records) && infrastructure.records.length > 0, 'Black Whale infrastructure index is unavailable');
  assert(infrastructure.records.every((record) => record.state && 'accessLevel' in record.state && 'zoneRole' in record.state && Array.isArray(record.protocolIds)), 'infrastructure rows lost access / zone / protocol fields');
  assert(Array.isArray(spatial.hotspots) && spatial.hotspots.length > 0, 'spatial hotspots are unavailable');

  const [shell, people, peopleCss, informationCss, systems, systemsCss, infrastructureCss] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionPeoplePowerComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionPeoplePowerComprehensionPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionInformationWarComprehension.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNenSpatialComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionNenSpatialComprehensionPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionSpatialInfrastructureComprehension.css'), 'utf8'),
  ]);

  assert(shell.includes("const showPeoplePower = activeHub.id === 'people';"), 'People & Power comprehension is not hub-mounted');
  assert(shell.includes("const showNenSpatial = ['nen', 'black-whale'].includes(activeHub.id);"), 'Nen / Black Whale comprehension is not hub-mounted');
  assert(shell.includes('SuccessionPeoplePowerComprehensionPanel') && shell.includes('SuccessionNenSpatialComprehensionPanel'), 'systems comprehension panels are missing from the archive shell');

  for (const token of ['Prince comparison', 'Who knows what?', 'Disclosure & deception', 'Reader visibility is not the same as in-world knowledge', 'Leverage dimensions', 'Body ≠ identity ≠ consciousness']) assert(people.includes(token), `People & Power layer is missing ${token}`);
  assert(people.includes('current.length < 4'), 'prince comparison does not cap the scan set at four');
  assert(people.includes("state === 'knows' ? '✓' : state === 'misinformed' ? '!' : '—'"), 'knowledge matrix does not distinguish knows/misinformed/unknown states');
  assert(people.includes('getReaderVsInUniverseKnowledge') && people.includes('getDeceptionLedger'), 'information-war depth is not derived from maintained knowledge/deception selectors');
  assert(people.includes('absence from the knower list') && people.includes('does not infer private intent'), 'information-war view lacks its anti-inference boundary');
  assert(people.includes('Showing {shownDeception.length} of {deception.length} maintained deception routes.'), 'deception top-N subset is not disclosed');
  assert(people.includes('not combined into a fictional “power level.”'), 'leverage view does not preserve the no-power-score contract');
  assert(people.includes('Showing {rows.length} of {leverage.rows.length} leverage dossiers.'), 'leverage top-N subset is not disclosed');

  for (const token of ['Nen mechanics flows', 'Ability interaction map', 'Nen training progression', 'Black Whale operational state', 'Access & infrastructure layers']) assert(systems.includes(token), `Nen/spatial layer is missing ${token}`);
  assert(systems.includes('directInteractionClaimed'), 'ability interactions do not preserve documented-vs-contextual distinction');
  assert(systems.includes('Not fully published'), 'Nen mechanics flow does not preserve unknown mechanics');
  assert(systems.includes('getShipInfrastructureIndex') && systems.includes('row.state.accessLevel') && systems.includes('row.state.zoneRole') && systems.includes('row.protocolIds.length'), 'Black Whale access/infrastructure presentation is not wired to maintained fields');
  assert(systems.includes('does not infer territorial control'), 'Black Whale access layer lacks its anti-inference boundary');
  assert(systems.includes('Showing {locationLayers.length} of {infrastructure.records.length} location layers'), 'Black Whale location-layer subset is not disclosed');
  assert(systems.includes('Movement list shows') && systems.includes('Hotspot list shows'), 'spatial top-N subsets are not disclosed');
  for (const layer of ['Movement', 'Hotspots', 'Occupancy', 'Events', 'Assignments', 'Access', 'Protocols']) assert(systems.includes(`'${layer.toLowerCase() === 'occupancy' ? 'occupants' : layer.toLowerCase()}', '${layer}'`), `Black Whale evidence layer toggle is missing ${layer}`);
  assert(systems.includes("aria-label=\"Black Whale evidence layers\"") && systems.includes('aria-pressed={enabled(id)}'), 'Black Whale layer controls are not exposed as accessible toggles');
  assert(systems.includes('--hotspot-width') && systems.includes('maxHotspotLoad'), 'hotspot operational load is not visually encoded proportionally');

  for (const css of [peopleCss, informationCss, systemsCss, infrastructureCss]) {
    assert(!/@media\s*\([^)]*max-width:/i.test(css), 'comprehension systems must not introduce mobile/tablet breakpoints');
    assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'comprehension systems must preserve reduced-motion handling');
    const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert(fontSizes.every((size) => size >= 11), `comprehension systems introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  }
  assert(peopleCss.includes('position: sticky'), 'people comparison matrices do not preserve sticky scan anchors');
  assert(systemsCss.includes('grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);'), 'Nen mechanics flow does not render as a four-stage chain');
  assert(systemsCss.includes('.succession-nen-spatial__layer-controls') && systemsCss.includes('.succession-nen-spatial__hotspots'), 'Black Whale layer-control or hotspot styling is missing');

  console.log(`Succession systems comprehension audit passed: ${princes.length} princes, ${knowledge.length} knowledge records, ${deception.length} deception routes, ${leverage.rows.length} leverage dossiers, ${transfers.length} transfer records, ${interactions.interactions.length} ability contexts, ${infrastructure.records.length} infrastructure locations, and ${spatial.hotspots.length} spatial hotspots are wired.`);
} finally {
  await vite.close();
}
