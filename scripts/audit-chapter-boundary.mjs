import {
  assertNoFutureRecords,
  filterRecordsAtChapter,
  isRecordVisibleAtChapter,
} from '../src/lib/chapterBoundary.js';

const fixtures = [
  { id: 'known-at-378', introducedAtChapter: 378 },
  { id: 'known-before-378', introducedAtChapter: 370 },
  { id: 'future-at-379', introducedAtChapter: 379 },
  { id: 'revealed-at-380', revealedAtChapter: 380 },
  { id: 'unbounded-record' },
];

const boundary = 378;
const visible = filterRecordsAtChapter(fixtures, boundary).map((record) => record.id);
const expected = ['known-at-378', 'known-before-378', 'unbounded-record'];

if (JSON.stringify(visible) !== JSON.stringify(expected)) {
  throw new Error(`Chapter boundary filter regression: expected ${expected.join(', ')}, received ${visible.join(', ')}`);
}

if (isRecordVisibleAtChapter({ confirmedAtChapter: 379 }, boundary)) {
  throw new Error('Future confirmation leaked through the selected chapter boundary.');
}

assertNoFutureRecords(filterRecordsAtChapter(fixtures, boundary), boundary, 'filtered fixtures');

let leakDetected = false;
try {
  assertNoFutureRecords(fixtures, boundary, 'unfiltered fixtures');
} catch (error) {
  leakDetected = /future record/.test(error.message);
}

if (!leakDetected) throw new Error('The spoiler leak assertion failed to detect future records.');

console.log('Chapter boundary regression audit passed.');
