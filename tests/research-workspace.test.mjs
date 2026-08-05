import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addRecordToInvestigation,
  deleteInvestigation,
  loadResearchWorkspace,
  removeBookmark,
  saveInvestigation,
  toggleBookmark,
  updateBookmark,
} from '../src/lib/succession/researchWorkspace.js';

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
};

test('supports bookmark metadata and removal', () => {
  const storage = memoryStorage();
  toggleBookmark({ domain: 'characters', id: 'kurapika', label: 'Kurapika' }, storage);
  updateBookmark('characters', 'kurapika', { folder: 'Woble', tags: ['guard', 'nen'] }, storage);
  let workspace = loadResearchWorkspace(storage);
  assert.equal(workspace.bookmarks[0].folder, 'Woble');
  assert.deepEqual(workspace.bookmarks[0].tags, ['guard', 'nen']);
  removeBookmark('characters', 'kurapika', storage);
  workspace = loadResearchWorkspace(storage);
  assert.equal(workspace.bookmarks.length, 0);
});

test('supports editable investigations and record management', () => {
  const storage = memoryStorage();
  saveInvestigation({ id: 'silent-majority', title: 'Silent Majority', chapter: 378 }, storage);
  addRecordToInvestigation('silent-majority', { domain: 'ability', id: 'silent-majority', label: 'Silent Majority' }, storage);
  saveInvestigation({ id: 'silent-majority', title: 'Silent Majority user', notes: 'Review room access.', status: 'working' }, storage);
  let workspace = loadResearchWorkspace(storage);
  assert.equal(workspace.investigations[0].records.length, 1);
  assert.equal(workspace.investigations[0].notes, 'Review room access.');
  deleteInvestigation('silent-majority', storage);
  workspace = loadResearchWorkspace(storage);
  assert.equal(workspace.investigations.length, 0);
});
