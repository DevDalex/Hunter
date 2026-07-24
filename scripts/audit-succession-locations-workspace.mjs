import { readFile } from 'node:fs/promises';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession location workspace audit failed: ${message}`);
};

const [workspace, styles, app, dataEntry, expansion, selectors] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveLocationWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveLocationWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/locationFoundationExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/selectors.js', import.meta.url), 'utf8'),
]);

assert(app.includes("import LocationsWorkspace from './SuccessionArchiveLocationWorkspace';"), 'app must load the dedicated canonical location workspace');
assert(!app.includes('  LocationsWorkspace,\n  MediaWorkspace,'), 'app must not import the legacy location workspace from extended workspaces');
assert(app.includes("['princes', 'queens', 'chapters', 'locations']"), 'location entity routes must remain inside the dedicated dossier workspace');
assert(dataEntry.includes("from './entitiesLocationFoundation.js'"), 'canonical data entry must activate the location foundation');
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

console.log('Succession location workspace audit passed: canonical hierarchy, chapter snapshots, occupancy, movement, assignments, events, abilities, evidence, and responsive presentation are wired.');
