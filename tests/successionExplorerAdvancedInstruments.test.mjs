import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [advanced, host, css, timelineWorkspace, main, entry] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerAdvancedInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
  read('../src/components/succession/SuccessionExplorerAdvancedInstruments.css'),
  read('../src/components/TimelineWorkspace.jsx'),
  read('../src/main.jsx'),
  read('../src/components/succession/SuccessionArchiveEntry.jsx'),
]);

test('Timeline cartography is an actual chapter by lane instrument with canonical duration ranges', () => {
  for (const token of [
    'TimelineCartographyInstrument',
    'successionPreludeEvents',
    'successionDays',
    'timelineTracks',
    'Chapter × lane atlas',
    'Canonical duration ribbons',
    "getEntitiesByType('assignment')",
    "getEntitiesByType('relationship')",
    'explorer.setChapter(value)',
    'not guessed continuous activity',
  ]) assert.ok(advanced.includes(token), `Timeline cartography is missing ${token}`);
  assert.ok(host.includes("routeId === 'timeline'"));
  assert.ok(host.includes('timelineCartographyViews'));
});

test('Black Whale instrument is a five-tier operational deck using canonical infrastructure state', () => {
  for (const token of [
    'BlackWhaleDeckInstrument',
    'getShipInfrastructureIndex',
    'getLocationBreadcrumbs',
    '[1, 2, 3, 4, 5]',
    'operationalLoad',
    "getEntitiesByType('location-history')",
    'Recent indexed location-state records',
  ]) assert.ok(advanced.includes(token), `Black Whale deck is missing ${token}`);
  assert.ok(host.includes("routeId === 'black-whale'"));
});

test('Nen laboratory never promotes structural overlap into a direct interaction claim', () => {
  for (const token of [
    'NenInteractionInstrument',
    'getAbilityInteractionMatrix',
    'directInteractionClaimed',
    'Documented same-event interaction',
    'structural context rather than being promoted into an interaction claim',
    'sharedEvents',
    'sharedLocations',
    'sharedOwners',
    'sharedMechanics',
    'getAbilityTransferInheritanceLedger',
  ]) assert.ok(advanced.includes(token), `Nen interaction laboratory is missing ${token}`);
  assert.ok(host.includes('nenLaboratoryViews'));
});

test('perspective knowledge map distinguishes explicit knowledge, misinformation, and unclassified space', () => {
  for (const token of [
    'PerspectiveKnowledgeMapInstrument',
    'getKnowledgeMatrix',
    'knowerEntityIds',
    'misinformedEntityIds',
    'Acquisition channels',
    'Everything else remains unclassified',
    'publicAtChapter',
  ]) assert.ok(advanced.includes(token), `Perspective map is missing ${token}`);
  assert.ok(host.includes("explorer.perspective !== 'reader'"));
});

test('advanced instruments retain interaction sizes, reduced motion, and scoped visual reboot ownership', () => {
  assert.ok(css.includes('min-height: 44px'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(!main.includes("import './styles/visual-reboot.css';"), 'visual reboot must not become a second global CSS entry point');
  assert.ok(entry.includes("import '../../styles/visual-reboot.css';"), 'Succession entry owns the visual reboot layer');
  assert.ok(timelineWorkspace.includes('Research annex'), 'legacy Timeline release contract must retain the Research annex label');
});
