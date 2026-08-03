import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const contractPath = 'public/phase7/black-whale-3d-operational-deck.json';
const scriptPath = 'public/succession/black-whale-3d/operations-deck.js';
const stylePath = 'public/succession/black-whale-3d/operations-deck.css';
const indexPath = 'public/succession/black-whale-3d/index.html';
const bootstrapPath = 'public/succession/black-whale-3d/visual-bootstrap.js';
const [contract, script, styles, index, bootstrap] = await Promise.all([
  readJson(contractPath), readText(scriptPath), readText(stylePath), readText(indexPath), readText(bootstrapPath),
]);
const scriptBytes = (await stat(path.join(root, scriptPath))).size;
const styleBytes = (await stat(path.join(root, stylePath))).size;

assert(contract.schemaVersion === '7.5-7.7.0', 'Combined phase schema changed.');
assert(contract.status === 'implemented-release-candidate' || contract.status === 'complete', 'Combined phase must be implemented or complete.');
assert(JSON.stringify(contract.phases) === JSON.stringify(['7.5', '7.6', '7.7']), 'Combined phase membership changed.');
assert(contract.deferred['phase7.8'] && contract.deferred['phase7.9'], 'Explicit 7.8 and 7.9 deferral is required.');

const routes = contract.routeProgramme.routes;
assert(routes.length === 8, 'Exactly eight physical or scope-only routes must be exposed.');
assert(routes.filter((route) => route.status.startsWith('authorized')).length === 3, 'Exactly three supported physical connections are required.');
assert(routes.filter((route) => route.status === 'quarantined-scope-only').length === 5, 'Exactly five quarantined route scopes are required.');
assert(contract.routeProgramme.deferredNonphysicalRoutes.length === 2, 'The two nonphysical Nen routes must remain deferred.');
for (const route of routes) {
  assert(route.id.startsWith('bw3d.route.'), `Invalid route identity ${route.id}.`);
  assert(Array.isArray(route.evidenceAtomIds) && route.evidenceAtomIds.length, `${route.id} lacks evidence atoms.`);
  assert(Array.isArray(route.limitations) && route.limitations.length, `${route.id} lacks limitations.`);
  assert(route.diagram?.from?.length === 2 && route.diagram?.to?.length === 2, `${route.id} lacks diagram endpoints.`);
  assert(Array.isArray(route.archiveLinks) && route.archiveLinks.length, `${route.id} lacks archive links.`);
  for (const link of route.archiveLinks) assert(link.href.startsWith('/story/succession-contest/'), `${route.id} uses an unmaintained archive route.`);
}

assert(contract.heroRooms.length === 6, 'Exactly six hero rooms are required for the combined release.');
for (const room of contract.heroRooms) {
  assert(room.id.startsWith('bw3d.hero.'), `Invalid hero-room identity ${room.id}.`);
  assert(room.primaryChapter >= 342 && room.primaryChapter <= 415, `${room.id} has an invalid primary chapter.`);
  assert(room.summary && room.certainty && room.palette, `${room.id} lacks room evidence metadata.`);
  assert(Array.isArray(room.confirmedFeatures) && room.confirmedFeatures.length >= 4, `${room.id} lacks confirmed features.`);
  assert(Array.isArray(room.unknowns) && room.unknowns.length >= 3, `${room.id} hides unknown geometry.`);
  assert(Array.isArray(room.archiveLinks) && room.archiveLinks.length >= 2, `${room.id} lacks archive bridge depth.`);
  for (const link of room.archiveLinks) assert(link.href.startsWith('/story/succession-contest/'), `${room.id} uses an unmaintained archive route.`);
}

for (const marker of ['operations-deck', 'ops-route-canvas', 'ops-room-canvas', 'ops-route-select', 'ops-room-tabs', 'startRouteBoard', 'startRoomDiorama', 'OPEN / UNSHOWN ENCLOSURE']) {
  assert(script.includes(marker), `Operational runtime is missing ${marker}.`);
}
assert(script.includes("getContext('2d')"), 'Operational runtime must initialize Canvas 2D.');
assert(!script.includes('requestAnimationFrame'), 'Operational deck must remain render-on-demand.');
assert(script.includes('ArrowLeft') && script.includes('ArrowRight'), 'Keyboard selection controls are incomplete.');
assert(!script.includes('chapter playback') && !script.includes('movement trail'), 'Temporal simulation leaked into Phase 7.5–7.7.');
assert(styles.includes('.ops-workbench') && styles.includes('.ops-room-stage') && styles.includes('.ops-links'), 'Operational layout styles are incomplete.');
assert(index.includes('/succession/black-whale-3d/operations-deck.css'), 'Operational styles are not mounted.');
assert(bootstrap.includes("import('/succession/black-whale-3d/operations-deck.js')"), 'Operational runtime is not deferred through the visual bootstrap.');
assert(bootstrap.includes("'#operations-deck'"), 'Persistent visual mount does not retain the operational deck.');
assert(scriptBytes <= 42000, `Operational JavaScript ${scriptBytes} bytes exceeds the 42 KB source ceiling.`);
assert(styleBytes <= 14000, `Operational CSS ${styleBytes} bytes exceeds the 14 KB source ceiling.`);

assert(contract.acceptance.routeReviewImported === true, 'Route review import gate is false.');
assert(contract.acceptance.heroRoomDioramasImplemented === 6, 'Hero-room implementation gate changed.');
assert(contract.acceptance.openWallTreatment === true, 'Open-wall treatment gate is false.');
assert(contract.acceptance.archiveLinksImplemented === true, 'Archive bridge gate is false.');
assert(contract.acceptance.temporalSimulationExcluded === true, 'Phase 7.8 exclusion gate is false.');
assert(contract.acceptance.nenOverlaysExcluded === true, 'Phase 7.9 exclusion gate is false.');

console.log(`Black Whale combined Phase 7.5–7.7 audit passed: ${routes.length} route records, 3 supported connections, 5 quarantined scopes, ${contract.heroRooms.length} hero rooms, archive bridge active, JavaScript ${scriptBytes} bytes, CSS ${styleBytes} bytes, Phases 7.8 and 7.9 deferred.`);
