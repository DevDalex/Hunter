import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contract = await readJson('public/phase7/black-whale-3d-tier-blockout.json');
const performance = await readJson('public/phase7/black-whale-3d-tier-performance.json');
const scriptPath = 'public/succession/black-whale-3d/tier-blockout.js';
const stylePath = 'public/succession/black-whale-3d/tier-blockout.css';
const indexPath = 'public/succession/black-whale-3d/index.html';
const script = await readText(scriptPath);
const styles = await readText(stylePath);
const index = await readText(indexPath);
const scriptBytes = (await stat(path.join(root, scriptPath))).size;
const styleBytes = (await stat(path.join(root, stylePath))).size;

assert(contract.phase === '7.4', 'Tier contract must remain Phase 7.4.');
assert(['in-progress','release-candidate','complete'].includes(contract.status), 'Unexpected Phase 7.4 status.');
assert(contract.dependsOn.phase73CompletionCommit, 'Phase 7.3 completion dependency is missing.');
assert(contract.roadmapBoundary.includes('Phase 7.5'), 'Phase 7.5 boundary is missing.');
assert(contract.tierVolumes.length === 5, 'Exactly five tier macro-volumes are required.');
assert(new Set(contract.tierVolumes.map((tier) => tier.id)).size === 5, 'Tier IDs must be unique.');
for (const [index, tier] of contract.tierVolumes.entries()) {
  assert(tier.id === `bw3d.tier.${index + 1}`, `Tier ${index + 1} identity changed.`);
  assert(tier.graphContainer === `bw3d.container.tier-${index + 1}`, `${tier.id} graph container changed.`);
  assert(tier.evidenceAuthority, `${tier.id} lacks evidence authority.`);
  assert(Array.isArray(tier.prohibitions) && tier.prohibitions.length >= 3, `${tier.id} lacks modeling prohibitions.`);
}
assert(contract.interstitialPolicy.status === 'required', 'Interstitial-space policy must remain required.');
assert(contract.unknownVolumePolicy.status === 'required', 'Unknown-volume policy must remain required.');
assert(contract.futureRoomModuleDirection.status === 'recorded-not-implemented', 'Future diorama direction must remain recorded but unimplemented.');
assert(contract.futureRoomModuleDirection.description.includes('cutaway diorama'), 'Future cutaway-diorama direction is missing.');

const requiredViews = new Set(contract.requiredViews);
for (const view of ['five-tier-section','single-tier-isolation','tier-exploded-diagram','tier-envelope-within-hull','interstitial-unknown-view']) {
  assert(requiredViews.has(view), `Missing required Phase 7.4 view ${view}.`);
}
for (const marker of ['tier-canvas','tier-select','tier-interstitial-toggle','tier-hull-toggle','data-tier-view="section"','data-tier-view="exploded"','data-tier-view="hull"','data-tier-view="unknown"']) {
  assert(script.includes(marker), `Tier runtime is missing ${marker}.`);
}
assert(script.includes("getContext('2d')") || script.includes('getContext("2d")'), 'Tier runtime must initialize Canvas 2D.');
assert(!script.includes('requestAnimationFrame'), 'Phase 7.4 runtime must remain render-on-demand.');
assert(script.includes('ArrowLeft') && script.includes("event.key.toLowerCase() === 'e'") && script.includes("event.key.toLowerCase() === 'i'"), 'Tier keyboard controls are incomplete.');
assert(script.includes('No rooms') || contract.charter.some((rule) => rule.includes('No room')), 'Room-geometry prohibition is missing.');
assert(index.includes('/succession/black-whale-3d/tier-blockout.js'), 'Tier runtime is not mounted.');
assert(index.includes('/succession/black-whale-3d/tier-blockout.css'), 'Tier styles are not mounted.');
assert(styles.includes('.tier-layout') && styles.includes('.tier-stage') && styles.includes('.tier-controls'), 'Tier layout styles are incomplete.');

assert(performance.phase === '7.4', 'Performance budget must target Phase 7.4.');
assert(performance.budgets.externalRuntimeDependencies === 0, 'External runtime dependencies must remain zero.');
assert(performance.budgets.networkModelAssets === 0, 'Network model assets must remain zero.');
assert(performance.budgets.maximumTierVolumes === 5, 'Tier volume budget changed.');
assert(performance.budgets.maximumInterstitialBands === 4, 'Interstitial band budget changed.');
assert(performance.desktopAcceptance.noContinuousAnimationLoop === true, 'Render-on-demand policy is missing.');
assert(scriptBytes <= performance.budgets.javascriptSourceBytesWarning, `Tier JavaScript ${scriptBytes} bytes exceeds warning budget.`);
assert(styleBytes <= performance.budgets.cssSourceBytesWarning, `Tier CSS ${styleBytes} bytes exceeds warning budget.`);

const gates = contract.completionGates;
for (const gate of ['tierEvidenceContractFrozen','fiveMacroVolumesImplemented','interstitialBandsImplemented','unknownVolumeTreatmentImplemented','tierSelectionAndAnalyticalViewsImplemented','objectRegistryAndEvidenceUiImplemented']) {
  assert(gates[gate] === true, `Completion gate ${gate} is not true.`);
}
if (contract.status === 'release-candidate' || contract.status === 'complete') {
  for (const gate of ['performanceAndAccessibilityValidated','desktopBrowserBuildChecksPassed']) {
    assert(gates[gate] === true, `Release gate ${gate} is not true.`);
  }
}
if (contract.status === 'complete') {
  assert(gates.mergedDeployedAndLiveVerified === true, 'Completed Phase 7.4 must record merged deployment and live verification.');
  assert(contract.release?.mergeCommit, 'Completed Phase 7.4 lacks merge commit metadata.');
  assert(contract.release?.deploymentStatus === 'success', 'Completed Phase 7.4 lacks successful deployment metadata.');
  assert(contract.release?.liveRoute === '/succession/black-whale-3d', 'Completed Phase 7.4 live route is missing or changed.');
} else {
  assert(gates.mergedDeployedAndLiveVerified === false, 'Pre-release Phase 7.4 must not claim merged/live verification.');
}

console.log(`Black Whale Phase 7.4 tier audit passed: ${contract.tierVolumes.length} tier volumes, 4 interstitial bands, ${contract.requiredViews.length} analytical views, JavaScript ${scriptBytes} bytes, CSS ${styleBytes} bytes, zero external dependencies, room and route geometry prohibited, Phase 7.5 blocked.`);
