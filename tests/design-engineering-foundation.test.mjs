import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSuccessionPresentationRecord,
  safeParseSuccessionPresentationRecord,
} from '../src/data/succession/presentationSchema.js';
import {
  createArchiveSearchIndex,
  searchArchive,
} from '../src/lib/search/createArchiveSearchIndex.js';
import {
  createSuccessionRelationshipGraph,
  relationshipNeighborhood,
} from '../src/lib/graph/createSuccessionRelationshipGraph.js';

test('presentation records enforce spoiler and temporal boundaries', () => {
  const record = parseSuccessionPresentationRecord({
    id: 'presentation:test',
    entityId: 'character:kurapika',
    spoilerFrom: 401,
    validFrom: 401,
    validThrough: 405,
    importance: 'major',
    composition: {
      treatment: 'portrait-crop',
      focal: '50% 28%',
      emphasis: 'primary',
      density: 'editorial',
    },
  });

  assert.equal(record.composition.treatment, 'portrait-crop');
  assert.equal(record.importance, 'major');

  const invalid = safeParseSuccessionPresentationRecord({
    id: 'presentation:bad',
    spoilerFrom: 405,
    validFrom: 401,
  });
  assert.equal(invalid.success, false);
});

test('archive search indexes cross-entity records with fuzzy prefix search', () => {
  const index = createArchiveSearchIndex([
    { id: 'character:kurapika', name: 'Kurapika', entityType: 'character', summary: 'Protects Prince Woble in Room 1014.' },
    { id: 'thread:silent-majority', name: 'Silent Majority', entityType: 'story-thread', summary: 'An unresolved Nen threat.' },
  ]);

  const results = searchArchive(index, 'kura');
  assert.equal(results[0].id, 'character:kurapika');
});

test('relationship graph exposes bounded multi-hop neighborhoods', () => {
  const graph = createSuccessionRelationshipGraph([
    {
      id: 'relationship:a-b',
      sourceEntityId: 'character:a',
      targetEntityId: 'character:b',
      direction: 'bidirectional',
      relationshipType: 'alliance',
      certainty: 'confirmed',
    },
    {
      id: 'relationship:b-c',
      sourceEntityId: 'character:b',
      targetEntityId: 'character:c',
      direction: 'directed',
      relationshipType: 'command',
      certainty: 'confirmed',
    },
  ]);

  assert.deepEqual([...relationshipNeighborhood(graph, 'character:a', 1)], ['character:b']);
  assert.deepEqual(new Set(relationshipNeighborhood(graph, 'character:a', 2)), new Set(['character:b', 'character:c']));
});
