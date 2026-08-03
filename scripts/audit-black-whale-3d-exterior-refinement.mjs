import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contractPath = 'public/phase7/black-whale-3d-exterior-refinement.json';
const profilePath = 'public/phase7/black-whale-3d-exterior-refinement-profile.json';
const performancePath = 'public/phase7/black-whale-3d-exterior-refinement-performance.json';
const runtimePath = 'public/succession/black-whale-3d/exterior-blockout.js';
const stylePath = 'public/succession/black-whale-3d/exterior-blockout.css';
const bootstrapPath = 'public/succession/black-whale-3d/visual-bootstrap.js';

const [contract, profile, performance, runtime, styles, bootstrap] = await Promise.all([
  readJson(contractPath),
  readJson(profilePath),
  readJson(performancePath),
  readText(runtimePath),
  readText(stylePath),
  readText(bootstrapPath),
]);

const runtimeBytes = (await stat(path.join(root, runtimePath))).size;
const styleBytes = (await stat(path.join(root, stylePath))).size;

assert(contract.phase === '7.3R', 'Exterior correction contract must remain Phase 7.3R.');
assert(['in-progress', 'release-candidate', 'complete'].includes(contract.status), 'Unexpected Phase 7.3R status.');
assert(contract.purpose.includes('reference-matched Black Whale front identity'), 'Contract must require the defining Black Whale face.');
assert(contract.roadmapBoundary.includes('may not start Phase 7.5'), 'Phase 7.5 must remain blocked.');
assert(contract.roadmapBoundary.includes('Phase 7.6'), 'Phase 7.6 must remain blocked.');
assert(contract.evidenceBoundary.approvedExternalDomains.length === 1 && contract.evidenceBoundary.approvedExternalDomains[0] === 'hunterxhunter.fandom.com', 'Approved external lore boundary changed.');
assert(contract.evidenceBoundary.authorizedClaims.some((claim) => claim.includes('ringed eyes')), 'Ring-eye identity claim is missing.');
assert(contract.evidenceBoundary.authorizedClaims.some((claim) => claim.includes('segmented mouth')), 'Segmented-mouth identity claim is missing.');
assert(contract.evidenceBoundary.quarantinedClaims.some((claim) => claim.includes('unseen side and rear topology')), 'Unseen topology quarantine is missing.');
for (const source of contract.evidenceBoundary.repositorySources) {
  assert(source.startsWith('/'), `Repository source must be root-relative: ${source}.`);
  await access(path.join(root, 'public', source.replace(/^\//, '')));
}

const targets = new Map(contract.refinementTargets.map((target) => [target.id, target]));
for (const id of ['whale-head-mass', 'head-identity-cues', 'back-and-belly-contours', 'rear-taper', 'tier-1-integration', 'analytical-surface-language']) {
  assert(targets.has(id), `Missing refinement target ${id}.`);
  assert(targets.get(id).permission, `${id} lacks modeling permission.`);
  assert(Array.isArray(targets.get(id).prohibitions) && targets.get(id).prohibitions.length > 0, `${id} lacks prohibitions.`);
}

assert(profile.phase === '7.3R', 'Stored exterior profile targets the wrong phase.');
assert(profile.status === 'reference-matched-reconstruction', 'Profile must identify itself as a reference-matched reconstruction.');
assert(profile.canonicalMetricStatus === 'not-established', 'Profile must not claim canonical measurements.');
assert(profile.axisConvention.rule.includes('cannot be cited as canonical measurements'), 'Profile lacks its metric boundary.');
const stationCount = profile.hullStations.length;
assert(stationCount >= 12, `Reference-matched hull has only ${stationCount} stations.`);
assert(stationCount <= performance.budgets.maximumHullStations, `Hull station count ${stationCount} exceeds budget.`);
assert(new Set(profile.hullStations.map((station) => station.id)).size === stationCount, 'Hull station IDs must be unique.');
const allowedAuthorities = new Set(['working-silhouette', 'reconstructed-closure', 'reference-matched-silhouette', 'reference-matched-closure']);
for (let index = 0; index < stationCount; index += 1) {
  const station = profile.hullStations[index];
  for (const field of ['z', 'radiusX', 'radiusY', 'centerY', 'topScale', 'bottomScale']) {
    assert(Number.isFinite(station[field]), `${station.id} has invalid ${field}.`);
  }
  assert(station.radiusX > 0 && station.radiusY > 0, `${station.id} has a nonpositive radius.`);
  assert(allowedAuthorities.has(station.authority), `${station.id} has an invalid authority.`);
  if (index > 0) assert(profile.hullStations[index - 1].z < station.z, 'Hull stations must be strictly ordered along +Z.');
}
assert(profile.hullStations.at(-1).id === 'head-face', 'Final station must be the explicit head face.');
assert(profile.hullStations.at(-1).radiusX >= 3.2, 'Head face must remain broad rather than cylindrical or pointed.');
assert(profile.ringSegments === performance.budgets.maximumRingSegments, 'Ring segment count must match the performance budget.');

const identity = profile.faceIdentity;
assert(identity.authority === 'reference-matched-front-identity', 'Face identity authority is missing.');
assert(Number.isFinite(identity.facePlaneZ), 'Face plane is invalid.');
assert(identity.upperFaceColor === '#111416', 'Upper face must retain the near-black canonical read.');
assert(identity.mouthPanel.length >= 18, 'Filled pale mouth panel is incomplete.');
assert(identity.mouthTopCurve.length >= 8, 'Curved mouth boundary is incomplete.');
assert(identity.mouthRibs.length === contract.implementation.mouthRibs, 'Mouth-rib count changed.');
assert(identity.eyes.length === contract.implementation.pairedRingEyes, 'Paired ring-eye count changed.');
for (const eye of identity.eyes) {
  assert(eye.outerRadiusX > eye.innerRadiusX && eye.outerRadiusY > eye.innerRadiusY, 'Eye ring must surround a smaller dark center.');
}
assert(profile.sideFins.length === contract.implementation.sideFins, 'Side-fin silhouette count changed.');
assert(profile.tierOneWorkingMasses.length === 5, 'Compact upper-vessel mass registry changed.');
assert(profile.analyticalWaterPlane.canonicalWaterline === false, 'Water plane must remain analytical.');
assert(profile.prohibitions.some((rule) => rule.includes('supplied canonical exterior view')), 'Profile lacks its front-reference statement.');
assert(profile.prohibitions.some((rule) => rule.includes('mouth ribs')), 'Mouth-rib interpretation boundary is missing.');

assert(contract.implementation.hullStations === stationCount, 'Contract hull-station count does not match profile.');
assert(contract.implementation.ringSegments === profile.ringSegments, 'Contract ring-segment count does not match profile.');
assert(contract.implementation.closedEndCaps === true, 'Closed-end requirement is missing.');
assert(contract.implementation.referenceMatchedFace === true, 'Reference-matched face gate is missing.');

for (const marker of [
  '/phase7/black-whale-3d-exterior-refinement-profile.json',
  'Phase 7.3R · Canonical face correction',
  'Reference-matched Black Whale exterior',
  'profile.faceIdentity',
  'identity.mouthPanel',
  'identity.mouthRibs',
  'ellipseOnFace',
  'drawFaceIdentity',
  'drawFins',
  "front: [0, -0.02, 1.08]",
  "side: [-Math.PI / 2, 0, 0.92]",
]) {
  assert(runtime.includes(marker), `Runtime is missing ${marker}.`);
}
assert(runtime.includes('profile.hullStations.map'), 'Runtime does not materialize stored hull stations.');
assert(runtime.includes('profile.ringSegments'), 'Runtime does not use the stored segment count.');
assert(runtime.includes('faces.sort'), 'Hull faces are not depth sorted.');
assert(runtime.includes('requestAnimationFrame') === false, 'Runtime must remain render-on-demand.');
assert(runtime.toLowerCase().includes('three.js') === false && runtime.toLowerCase().includes('babylon') === false, 'Unapproved external 3D runtime detected.');
assert(runtime.includes('cutaway-toggle') && runtime.includes('tiers-toggle') && runtime.includes('unknown-toggle'), 'Analytical controls are missing.');
assert(runtime.includes('ArrowLeft') && runtime.includes("event.key.toLowerCase() === 'c'"), 'Keyboard controls are incomplete.');
assert(styles.includes('.exterior-refinement-note') && styles.includes('.exterior-stage') && styles.includes('.exterior-controls'), 'Exterior styling regressed.');
assert(bootstrap.includes("import('/succession/black-whale-3d/exterior-blockout.js')"), 'Visual bootstrap no longer loads the exterior runtime.');
assert(bootstrap.includes("waitForSelector('#exterior-blockout'"), 'Bootstrap does not wait for exterior mount.');

assert(performance.phase === '7.3R', 'Performance budget targets the wrong phase.');
assert(performance.budgets.externalRuntimeDependencies === 0, 'External dependency budget changed.');
assert(performance.budgets.networkModelAssets === 0, 'Network model asset budget changed.');
assert(performance.desktopAcceptance.noContinuousAnimationLoop === true, 'Render-on-demand requirement is missing.');
assert(runtimeBytes <= performance.budgets.javascriptSourceBytesWarning, `Runtime ${runtimeBytes} bytes exceeds budget.`);
assert(styleBytes <= performance.budgets.cssSourceBytesWarning, `CSS ${styleBytes} bytes exceeds budget.`);

const gates = contract.completionGates;
for (const gate of ['exteriorEvidenceRefrozen', 'refinedWhaleEnvelopeImplemented', 'referenceMatchedFaceImplemented', 'tier1IntegrationRefined', 'analyticalShadingAndWaterContextRefined', 'uncertaintyAndProhibitionsVisible', 'dedicatedAuditImplemented']) {
  assert(gates[gate] === true, `Implementation gate ${gate} is not complete.`);
}
if (contract.status === 'complete') {
  assert(gates.desktopBrowserBuildChecksPassed === true, 'Completed phase lacks browser/build verification.');
  assert(gates.mergedDeployedAndLiveVerified === true, 'Completed phase lacks live verification.');
  assert(contract.release?.mergeCommit, 'Completed phase lacks merge metadata.');
  assert(contract.release?.deploymentStatus === 'success', 'Completed phase lacks successful deployment metadata.');
  assert(contract.release?.liveRoute === '/succession/black-whale-3d', 'Completed phase live route changed.');
} else {
  assert(gates.mergedDeployedAndLiveVerified === false, 'Pre-release phase must not claim live completion.');
}

console.log(`Black Whale Phase 7.3R face audit passed: ${stationCount} hull stations, broad dome, near-black face, filled pale segmented mouth, ${identity.eyes.length} ring eyes, ${profile.sideFins.length} side fins, compact upper vessel, corrected cameras, ${runtimeBytes} JS bytes and zero external model assets.`);
