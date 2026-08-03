import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contractPath = 'public/phase7/black-whale-3d-exterior-refinement.json';
const performancePath = 'public/phase7/black-whale-3d-exterior-refinement-performance.json';
const runtimePath = 'public/succession/black-whale-3d/exterior-blockout.js';
const stylePath = 'public/succession/black-whale-3d/exterior-blockout.css';
const bootstrapPath = 'public/succession/black-whale-3d/visual-bootstrap.js';

const [contract, performance, runtime, styles, bootstrap] = await Promise.all([
  readJson(contractPath),
  readJson(performancePath),
  readText(runtimePath),
  readText(stylePath),
  readText(bootstrapPath),
]);

const runtimeBytes = (await stat(path.join(root, runtimePath))).size;
const styleBytes = (await stat(path.join(root, stylePath))).size;

assert(contract.phase === '7.3R', 'Exterior refinement contract must remain Phase 7.3R.');
assert(['in-progress', 'release-candidate', 'complete'].includes(contract.status), 'Unexpected Phase 7.3R status.');
assert(contract.purpose.includes('recognizably whale-like'), 'Phase 7.3R purpose must require a recognizable whale silhouette.');
assert(contract.roadmapBoundary.includes('may not start Phase 7.5'), 'Phase 7.5 route work must remain blocked.');
assert(contract.roadmapBoundary.includes('Phase 7.6'), 'Phase 7.6 room production must remain blocked.');
assert(contract.evidenceBoundary.approvedExternalDomains.length === 1 && contract.evidenceBoundary.approvedExternalDomains[0] === 'hunterxhunter.fandom.com', 'External lore boundary changed.');
assert(contract.evidenceBoundary.quarantinedClaims.some((claim) => claim.includes('Exact length')), 'Canonical dimensions must remain quarantined.');
assert(contract.evidenceBoundary.quarantinedClaims.some((claim) => claim.includes('mouth, eye, fin')), 'Detailed whale anatomy must remain quarantined.');

const targets = new Map(contract.refinementTargets.map((target) => [target.id, target]));
for (const id of ['whale-head-mass', 'back-and-belly-contours', 'rear-taper', 'tier-1-integration', 'analytical-surface-language']) {
  assert(targets.has(id), `Missing refinement target ${id}.`);
  assert(targets.get(id).permission, `${id} lacks modeling permission.`);
  assert(Array.isArray(targets.get(id).prohibitions) && targets.get(id).prohibitions.length > 0, `${id} lacks prohibitions.`);
}

assert(runtime.includes('/phase7/black-whale-3d-exterior-refinement.json'), 'Runtime does not load the Phase 7.3R contract.');
assert(runtime.includes('Phase 7.3R · Exterior refinement'), 'Refinement phase label is not visible.');
assert(runtime.includes('Recognizable whale silhouette, still noncanonical'), 'Refinement uncertainty heading is missing.');
assert(runtime.includes('const hullStations = ['), 'Refined hull station registry is missing.');
const stationCount = (runtime.match(/\{ z: /g) || []).length;
assert(stationCount >= 12, `Refined hull has only ${stationCount} longitudinal stations.`);
assert(stationCount <= performance.budgets.maximumHullStations, `Refined hull has ${stationCount} stations and exceeds budget.`);
assert(runtime.includes('const segments = 24;'), 'Refined hull must use the audited 24-segment ring budget.');
assert(runtime.includes('station.top') && runtime.includes('station.bottom'), 'Asymmetric back and belly contours are missing.');
assert(runtime.includes('drawWater'), 'Analytical water context is missing.');
assert(runtime.includes('seamY'), 'Head-side silhouette seam aid is missing.');
assert(runtime.includes('drawTierOne'), 'Refined Tier 1 integration is missing.');
assert(runtime.includes('drawTierEnvelope'), 'Five-tier analytical context was removed.');
assert(runtime.includes('cutaway-toggle') && runtime.includes('tiers-toggle') && runtime.includes('unknown-toggle'), 'Required analytical toggles are missing.');
assert(runtime.includes('ArrowLeft') && runtime.includes("event.key.toLowerCase() === 'c'"), 'Keyboard rotation or cutaway control is missing.');
assert(runtime.includes('requestAnimationFrame') === false, 'Refinement runtime must remain render-on-demand.');
assert(runtime.includes('three') === false && runtime.includes('babylon') === false, 'Unapproved external 3D runtime detected.');
assert(styles.includes('.exterior-refinement-note'), 'Refinement status styling is missing.');
assert(styles.includes('.exterior-stage') && styles.includes('.exterior-controls'), 'Exterior layout styling regressed.');
assert(bootstrap.includes("import('/succession/black-whale-3d/exterior-blockout.js')"), 'Visual bootstrap no longer loads the refined exterior runtime.');

assert(performance.phase === '7.3R', 'Refinement performance budget targets the wrong phase.');
assert(performance.budgets.externalRuntimeDependencies === 0, 'External runtime dependency budget changed.');
assert(performance.budgets.networkModelAssets === 0, 'Network model asset budget changed.');
assert(performance.budgets.maximumRingSegments === 24, 'Ring segment budget changed.');
assert(performance.desktopAcceptance.noContinuousAnimationLoop === true, 'Render-on-demand requirement is missing.');
assert(runtimeBytes <= performance.budgets.javascriptSourceBytesWarning, `Refinement JavaScript ${runtimeBytes} bytes exceeds budget.`);
assert(styleBytes <= performance.budgets.cssSourceBytesWarning, `Refinement CSS ${styleBytes} bytes exceeds budget.`);

const gates = contract.completionGates;
for (const gate of ['exteriorEvidenceRefrozen', 'refinedWhaleEnvelopeImplemented', 'tier1IntegrationRefined', 'analyticalShadingAndWaterContextRefined', 'uncertaintyAndProhibitionsVisible', 'dedicatedAuditImplemented']) {
  assert(gates[gate] === true, `Implementation gate ${gate} is not complete.`);
}
if (contract.status === 'complete') {
  assert(gates.desktopBrowserBuildChecksPassed === true, 'Completed Phase 7.3R lacks browser/build verification.');
  assert(gates.mergedDeployedAndLiveVerified === true, 'Completed Phase 7.3R lacks merged deployment verification.');
  assert(contract.release?.mergeCommit, 'Completed Phase 7.3R lacks merge metadata.');
  assert(contract.release?.deploymentStatus === 'success', 'Completed Phase 7.3R lacks successful deployment metadata.');
  assert(contract.release?.liveRoute === '/succession/black-whale-3d', 'Completed Phase 7.3R live route is missing.');
} else {
  assert(gates.mergedDeployedAndLiveVerified === false, 'Pre-release Phase 7.3R must not claim live completion.');
}

console.log(`Black Whale Phase 7.3R audit passed: ${stationCount} hull stations, 24 ring segments, refined head/back/belly/rear macro form, Tier 1 integration, analytical water context, ${runtimeBytes} JS bytes, ${styleBytes} CSS bytes, zero external runtime dependencies and zero network model assets.`);
