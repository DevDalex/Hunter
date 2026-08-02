import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contract = await readJson('public/phase7/black-whale-3d-exterior-blockout.json');
const performance = await readJson('public/phase7/black-whale-3d-exterior-performance.json');
const scriptPath = 'public/succession/black-whale-3d/exterior-blockout.js';
const stylePath = 'public/succession/black-whale-3d/exterior-blockout.css';
const scaleScriptPath = 'public/succession/black-whale-3d/exterior-scale-reference.js';
const scaleStylePath = 'public/succession/black-whale-3d/exterior-scale-reference.css';
const indexPath = 'public/succession/black-whale-3d/index.html';
const script = await readText(scriptPath);
const styles = await readText(stylePath);
const scaleScript = await readText(scaleScriptPath);
const scaleStyles = await readText(scaleStylePath);
const index = await readText(indexPath);
const scriptBytes = (await stat(path.join(root, scriptPath))).size + (await stat(path.join(root, scaleScriptPath))).size;
const styleBytes = (await stat(path.join(root, stylePath))).size + (await stat(path.join(root, scaleStylePath))).size;

assert(contract.phase === '7.3', 'Exterior contract must remain Phase 7.3.');
assert(['in-progress','release-candidate','complete'].includes(contract.status), 'Unexpected Phase 7.3 status.');
assert(contract.coordinateConvention.canonicalMetricStatus === 'not-established', 'Working units must not become canonical metric claims.');
assert(contract.coordinateConvention.shipBowMapping === 'unresolved', 'Bow mapping must remain unresolved.');
assert(contract.roadmapBoundary.includes('Phase 7.4'), 'Phase 7.4 boundary is missing.');
assert(contract.plannedObjects.length >= 5, 'Exterior object registry is incomplete.');
assert(new Set(contract.plannedObjects.map((item) => item.id)).size === contract.plannedObjects.length, 'Exterior object IDs must be unique.');
for (const object of contract.plannedObjects) {
  assert(object.modelingPermission, `${object.id} lacks modeling permission.`);
  assert(Array.isArray(object.prohibitions) && object.prohibitions.length > 0, `${object.id} lacks prohibitions.`);
}

const requiredViews = new Set(contract.requiredViews);
for (const view of ['full-exterior','side-analytical','front-analytical','rear-review','cross-section','transparent-tier-envelope','human-scale-reference']) {
  assert(requiredViews.has(view), `Missing required view ${view}.`);
}

for (const marker of ['cutaway-toggle','tiers-toggle','unknown-toggle','exterior-object-select','data-view="hero"','data-view="side"','data-view="front"','data-view="rear"']) {
  assert(script.includes(marker), `Exterior runtime is missing ${marker}.`);
}
assert(script.includes('getContext(\'2d\')') || script.includes('getContext("2d")'), 'Exterior runtime must initialize Canvas 2D.');
assert(script.includes('requestAnimationFrame') === false, 'Phase 7.3 runtime must remain render-on-demand without a continuous animation loop.');
assert(script.includes('ArrowLeft') && script.includes("e.key.toLowerCase()==='c'"), 'Keyboard controls are incomplete.');
assert(scaleScript.includes('data-view = \'scale\'') || scaleScript.includes("dataset.view = 'scale'"), 'Human-scale reference button is missing.');
assert(scaleScript.includes('1.7 m working human proxy'), 'Human-scale proxy disclaimer is missing.');
assert(scaleScript.includes('not a canonical exterior access point'), 'Human-scale placement prohibition is missing.');
assert(index.includes('/succession/black-whale-3d/exterior-blockout.js'), 'Exterior runtime is not mounted by the dashboard.');
assert(index.includes('/succession/black-whale-3d/exterior-blockout.css'), 'Exterior styles are not mounted by the dashboard.');
assert(index.includes('/succession/black-whale-3d/exterior-scale-reference.js'), 'Human-scale runtime is not mounted by the dashboard.');
assert(index.includes('/succession/black-whale-3d/exterior-scale-reference.css'), 'Human-scale styles are not mounted by the dashboard.');
assert(styles.includes('.exterior-stage') && styles.includes('.exterior-controls'), 'Exterior layout styles are incomplete.');
assert(scaleStyles.includes('.exterior-scale-reference') && scaleStyles.includes('.scale-person'), 'Human-scale view styles are incomplete.');

assert(performance.phase === '7.3', 'Performance budget must target Phase 7.3.');
assert(performance.budgets.externalRuntimeDependencies === 0, 'External runtime dependency budget changed.');
assert(performance.budgets.networkModelAssets === 0, 'Network model assets must remain zero for this blockout.');
assert(performance.desktopAcceptance.noContinuousAnimationLoop === true, 'Render-on-demand policy is missing.');
assert(scriptBytes <= performance.budgets.javascriptSourceBytesWarning, `Exterior JavaScript ${scriptBytes} bytes exceeds warning budget.`);
assert(styleBytes <= performance.budgets.cssSourceBytesWarning, `Exterior CSS ${styleBytes} bytes exceeds warning budget.`);

const gates = contract.completionGates;
for (const gate of ['coordinateAndWorkingScaleDefined','hullBlockoutImplemented','tier1MassImplemented','fiveTierEnvelopeImplemented','cutawayAndCameraSystemImplemented','objectRegistryAndEvidenceUiImplemented','performanceAndAccessibilityValidated','desktopBrowserBuildChecksPassed']) {
  assert(gates[gate] === true, `Completion gate ${gate} is not true.`);
}
if (contract.status === 'complete') {
  assert(gates.mergedDeployedAndLiveVerified === true, 'Completed Phase 7.3 must record merged deployment and live verification.');
  assert(contract.release?.mergeCommit, 'Completed Phase 7.3 lacks merge commit metadata.');
  assert(contract.release?.deploymentStatus === 'success', 'Completed Phase 7.3 lacks successful deployment metadata.');
  assert(contract.release?.liveRoute === '/succession/black-whale-3d', 'Completed Phase 7.3 live route is missing or changed.');
} else {
  assert(gates.mergedDeployedAndLiveVerified === false, 'Pre-release contract must not claim merged/live verification.');
}

console.log(`Black Whale Phase 7.3 exterior audit passed: ${contract.plannedObjects.length} evidence-labeled objects, ${contract.requiredViews.length} required views including human scale, runtime JavaScript ${scriptBytes} bytes, CSS ${styleBytes} bytes, zero external runtime dependencies, zero network model assets, working metrics noncanonical, Phase 7.4 blocked.`);
