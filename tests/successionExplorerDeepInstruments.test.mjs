import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [deep, host, css, schemas, selectors] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerDeepInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
  read('../src/components/succession/SuccessionExplorerDeepInstruments.css'),
  read('../src/data/succession/schemas.js'),
  read('../src/data/succession/selectors.js'),
]);

test('Black Whale hierarchy uses canonical location parents and snapshots instead of inferred coordinates', () => {
  for (const token of [
    'BlackWhaleHierarchyInstrument',
    "getEntityById('location:black-whale')",
    'getLocationBreadcrumbs',
    'getLocationChildren',
    'getLocationSnapshot',
    'canonical parent/child location tree',
    'vessel → tier → zone → room',
  ]) assert.ok(deep.includes(token), `nested ship hierarchy is missing ${token}`);
  assert.ok(schemas.includes('entity.parentId'));
  assert.ok(selectors.includes('getLocationChildren'));
  assert.ok(host.includes('shipHierarchyViews'));
});

test('relationship biographies preserve stored ranges and canonical linked events', () => {
  for (const token of [
    'RelationshipEdgeBiographyInstrument',
    'getRelationshipsForEntity',
    'getRelationshipDetail',
    'relationship.chapterRange',
    'related canonical events',
    'documentary anchors, not inferred emotional beats',
  ]) assert.ok(deep.includes(token), `relationship edge biography is missing ${token}`);
  assert.ok(host.includes("routeId === 'relationships'"));
});

test('Nen mechanic circuitry is built from documented ability fields and exposes unknown stages', () => {
  for (const token of [
    'NenMechanicsCircuitInstrument',
    'ability.ownerIds',
    'ability.activation',
    'ability.conditions',
    'ability.classification?.nenTypes',
    'ability.knownUses',
    'ability.costs',
    'ability.limitations',
    'Activation not documented',
    'No explicit condition is documented',
    'rather than being completed by inference',
  ]) assert.ok(deep.includes(token), `Nen mechanics circuit is missing ${token}`);
  assert.ok(host.includes('nenCircuitViews'));
});

test('perspective acquisition trail never infers person-to-person propagation', () => {
  for (const token of [
    'KnowledgePropagationTrailInstrument',
    'getKnowledgeMatrix',
    'knowerEntityIds',
    'misinformedEntityIds',
    'record.acquisition',
    'record.publicAtChapter',
    'Co-knowers on record',
    'never invents who told whom',
  ]) assert.ok(deep.includes(token), `knowledge acquisition trail is missing ${token}`);
  assert.ok(!deep.includes('inferredSourceEntityId'));
  assert.ok(!deep.includes('guessedKnower'));
  assert.ok(host.includes('knowledgeTrailRoutes'));
});

test('deep instruments preserve desktop readability and reduced motion', () => {
  assert.ok(css.includes('font: 800 11px'));
  assert.ok(css.includes('font-size: 11px'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(css.includes('button:focus-visible'));
});
