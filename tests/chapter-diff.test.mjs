import test from 'node:test';
import assert from 'node:assert/strict';
import { diffChapterRecords, diffRecordFields } from '../src/lib/succession/chapterDiff.js';

test('classifies state, assignment, location, relationship, evidence, and question changes', () => {
  const fields = diffRecordFields(
    { status: 'alive', assignments: ['guard'], currentLocation: '1014', relationships: ['a'], confidence: 'likely', openQuestions: ['who'] },
    { status: 'missing', assignments: ['guard', 'report'], currentLocation: '1004', relationships: ['a', 'b'], confidence: 'confirmed', openQuestions: ['who', 'why'] },
  );
  assert.deepEqual(new Set(fields.map((field) => field.kind)), new Set([
    'state-change', 'assignment-change', 'location-change', 'relationship-change', 'evidence-revised', 'question-opened',
  ]));
});

test('reports added, removed, changed, and unchanged records', () => {
  const result = diffChapterRecords({
    before: [{ id: 'a', status: 'alive' }, { id: 'b', status: 'alive' }, { id: 'same', status: 'alive' }],
    after: [{ id: 'a', status: 'dead' }, { id: 'c', status: 'alive' }, { id: 'same', status: 'alive' }],
  });
  assert.equal(result.added[0].record.id, 'c');
  assert.equal(result.removed[0].record.id, 'b');
  assert.equal(result.changed[0].id, 'a');
  assert.equal(result.changed[0].fields[0].kind, 'state-change');
  assert.equal(result.unchanged[0].id, 'same');
});
