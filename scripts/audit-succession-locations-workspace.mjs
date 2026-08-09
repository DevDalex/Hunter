import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession location workspace audit failed: ${message}`);
};

const [workspace, styles, app, expansion, selectors] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveLocationWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveLocationWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/locationFoundationExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/selectors.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'LocationsWorkspace', './SuccessionArchiveLocationWorkspace'), 'app must load the dedicated canonical location workspace');
assert(!app.includes('  LocationsWorkspace,\n  MediaWorkspace,'), 'app must not import the legacy location workspace from extended workspaces');
assert(sourceRendersRouteWith(app, 'locations', 'LocationsWorkspace'), 'locations route must render the dedicated dossier workspace');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'locations'), 'location entity routes must remain inside the dedicated dossier workspace');
assert(expansion.includes('locationFoundationExpansion'), 'location expansion records must be published');
assert(expansion.includes('locationHistoryExpansion'), 'chapter-bounded occupancy records must be published');
assert(expansion.includes('room-1013-isolated-space'), 'Room 1013 isolated-space state must remain distinct from the physical room');
assert(expansion.includes('justice-bureau-medical-wing'), 'Justice medical protection space must remain indexed');
assert(expansion.includes('black-whale-ritual-boundary'), 'the succession ritual boundary must remain explicit');
assert(selectors.includes('getLocationSnapshot'), 'selectors must expose chapter-specific location snapshots');
assert(selectors.includes('getMovementHistoryForCharacter'), 'selectors must expose character movement history');
assert(selectors.includes('getCurrentLocationRecordForCharacter'), 'selectors must expose current location state');
assert(selectors.includes('getLocationOccupancyTimeline'), 'selectors must expose occupancy timelines');
assert(workspace.includes("getEntitiesByType('location')"), 'workspace must read canonical location entities');
assert(workspace.includes('getLocationSnapshot'), 'workspace must render canonical snapshots');
assert(workspace.includes('Snapshot chapter'), 'workspace must provide chapter snapshot control');
assert(workspace.includes('Movement and residence records'), 'workspace must present temporal occupancy');
assert(workspace.includes('Protection, surveillance, and operations'), 'workspace must present location assignments');
assert(workspace.includes('Abilities active through linked events'), 'workspace must present location-linked Nen systems');
assert(workspace.includes('SourceReference'), 'workspace must display location evidence');
assert(styles.includes('.succession-location-breadcrumbs'), 'styles must own location hierarchy breadcrumbs');
assert(styles.includes('.succession-location-history'), 'styles must own occupancy history presentation');
assert(styles.includes('@media (max-width: 900px)'), 'workspace must include responsive layout handling');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'workspace must include reduced-motion handling');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getChapter,
    getCurrentLocationRecordForCharacter,
    getEntitiesByType,
    getLocationBreadcrumbs,
    getLocationSnapshot,
    getMovementHistoryForCharacter,
    searchSuccessionArchive,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'expanded location graph must pass canonical schema validation');
  const locations = getEntitiesByType('location');
  const histories = getEntitiesByType('location-history');
  assert(locations.length >= 42, `expanded location foundation must retain at least 42 locations, found ${locations.length}`);
  assert(histories.length >= 40, `expanded movement foundation must retain at least 40 history records, found ${histories.length}`);

  const isolatedId = 'location:black-whale:tier-1:room-1013:isolated-space';
  const isolatedSnapshot = getLocationSnapshot(isolatedId, 372);
  const isolatedOccupants = new Set(isolatedSnapshot?.occupants.map(({ entity }) => entity.id));
  assert(isolatedOccupants.has('character:marayam-hui-guo-rou'), 'Chapter 372 isolated-room snapshot must contain Marayam');
  assert(isolatedOccupants.has('character:biscuit-krueger'), 'Chapter 372 isolated-room snapshot must contain Biscuit');
  assert(isolatedOccupants.has('character:hanzo'), 'Chapter 372 isolated-room snapshot must contain Hanzo');

  const isolatedBreadcrumbs = getLocationBreadcrumbs(isolatedId).map((location) => location.id).join('>');
  assert(
    isolatedBreadcrumbs === 'location:black-whale>location:black-whale:tier-1>location:black-whale:tier-1:room-1013>location:black-whale:tier-1:room-1013:isolated-space',
    'isolated Room 1013 breadcrumbs must preserve physical and Nen-space hierarchy',
  );

  const justiceMedicalSnapshot = getLocationSnapshot('location:black-whale:tier-2:justice-bureau:medical-wing', 402);
  assert(justiceMedicalSnapshot?.occupants.some(({ entity }) => entity.id === 'character:fugetsu-hui-guo-rou'), 'Chapter 402 Justice medical snapshot must contain Fugetsu under the corrected Tier 2 Justice hierarchy');

  const morenaAt410 = getCurrentLocationRecordForCharacter('character:morena-prudo', 410);
  assert(morenaAt410?.locationId === 'location:black-whale:tier-3:heil-ly-hideout', 'Morena’s Chapter 410 location must resolve to the Heil-Ly hidden band');

  const camillaMovement = getMovementHistoryForCharacter('character:camilla-hui-guo-rou');
  assert(camillaMovement.some((record) => record.locationId === 'location:black-whale:tier-1:room-1002'), 'Camilla movement history must retain Room 1002');
  assert(camillaMovement.some((record) => record.locationId === 'location:black-whale:tier-2:justice-bureau:detention-wing'), 'Camilla movement history must retain confinement under the corrected Tier 2 Justice hierarchy');

  const chapter405 = getChapter(405);
  assert(chapter405?.locationIds?.includes('location:black-whale:tier-1:casino'), 'Chapter 405 must inherit Hisoka’s casino sighting location');
  assert(searchSuccessionArchive('succession ritual boundary').some(({ entity }) => entity.id === 'location:black-whale:ritual-boundary'), 'global search must resolve the ritual boundary');

  console.log(`Succession location workspace audit passed: ${locations.length} locations and ${histories.length} movement records support hierarchy, snapshots, occupancy, assignments, events, abilities, evidence, and responsive presentation.`);
} finally {
  await vite.close();
}
