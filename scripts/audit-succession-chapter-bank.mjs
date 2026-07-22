#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  SUCCESSION_BANK_END,
  SUCCESSION_BANK_START,
  SUCCESSION_BANK_TOTAL,
  successionChapterBankRecords,
  successionChapterBankSummary,
} from '../src/data/successionChapterBank.js';
import { successionChapterImportHistory } from '../src/data/successionChapterImportHistory.generated.js';

const root = process.cwd();
const errors = [];
const pageIds = new Set();
const checksums = new Map();
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(SUCCESSION_BANK_START === 339, `Chapter Bank must begin at 339, received ${SUCCESSION_BANK_START}.`);
assert(SUCCESSION_BANK_END === 414, `Chapter Bank must end at 414, received ${SUCCESSION_BANK_END}.`);
assert(SUCCESSION_BANK_TOTAL === 76, `Chapter Bank must contain 76 records, received ${SUCCESSION_BANK_TOTAL}.`);
assert(successionChapterBankRecords.length === SUCCESSION_BANK_TOTAL, 'Chapter Bank record count drifted.');

for (const [index, record] of successionChapterBankRecords.entries()) {
  const expectedChapter = SUCCESSION_BANK_START + index;
  assert(record.chapter === expectedChapter, `Chapter Bank sequence drifted at ${expectedChapter}.`);
  assert(record.id === `chapter-${record.chapter}`, `Chapter ${record.chapter} has unstable bank ID ${record.id}.`);
  assert(record.pageCount === record.pages.length, `Chapter ${record.chapter} page count does not match its page records.`);
  assert(record.storage === (record.pages.length ? 'local' : 'empty'), `Chapter ${record.chapter} storage status is inconsistent.`);

  for (const [pageIndex, page] of record.pages.entries()) {
    const expectedPage = pageIndex + 1;
    const padded = String(expectedPage).padStart(3, '0');
    assert(page.page === expectedPage, `Chapter ${record.chapter} page order drifted at p.${expectedPage}.`);
    assert(page.id === `chapter-${record.chapter}-p${padded}`, `Chapter ${record.chapter} p.${expectedPage} has unstable ID ${page.id}.`);
    assert(page.label === `p.${expectedPage}`, `Chapter ${record.chapter} p.${expectedPage} has incorrect display label ${page.label}.`);
    assert(page.filename?.startsWith(padded), `Chapter ${record.chapter} p.${expectedPage} filename is not zero-padded.`);
    assert(page.src === page.localPath, `Chapter ${record.chapter} p.${expectedPage} localPath must match src.`);
    assert(['jpg', 'png', 'webp'].includes(page.format), `Chapter ${record.chapter} p.${expectedPage} has unsupported format ${page.format}.`);
    if (page.byteSize !== null) assert(Number.isInteger(page.byteSize) && page.byteSize > 0, `Chapter ${record.chapter} p.${expectedPage} has invalid byteSize.`);
    if (page.checksum !== null) assert(/^sha256-[a-f0-9]{64}$/.test(page.checksum), `Chapter ${record.chapter} p.${expectedPage} has invalid checksum.`);
    assert(!pageIds.has(page.id), `Duplicate Chapter Bank page ID: ${page.id}`);
    pageIds.add(page.id);
    if (page.checksum) {
      const existing = checksums.get(page.checksum);
      if (existing) errors.push(`Duplicate page checksum: ${existing} and ${page.id}.`);
      checksums.set(page.checksum, page.id);
    }
  }
}

for (const entry of successionChapterImportHistory) {
  assert(Number.isInteger(entry.chapter) && entry.chapter >= SUCCESSION_BANK_START && entry.chapter <= SUCCESSION_BANK_END, `History entry ${entry.id || '(unknown)'} references an invalid chapter.`);
  assert(['import-chapter', 'replace-chapter', 'replace-page', 'merge-pages', 'reorder-pages', 'repair-chapter'].includes(entry.action), `History entry ${entry.id || '(unknown)'} has unsupported action ${entry.action}.`);
  assert(Boolean(entry.timestamp), `History entry ${entry.id || '(unknown)'} is missing a timestamp.`);
}

assert(successionChapterBankSummary.chapters === SUCCESSION_BANK_TOTAL, 'Bank summary chapter count drifted.');
assert(successionChapterBankSummary.storedChapters + successionChapterBankSummary.emptyChapters === SUCCESSION_BANK_TOTAL, 'Stored and empty chapter totals do not reconcile.');
assert(successionChapterBankSummary.pages === successionChapterBankRecords.reduce((total, record) => total + record.pages.length, 0), 'Bank summary page total drifted.');

const [adminPage, hostedWorker, bankWorker, reader] = await Promise.all([
  readFile(path.join(root, 'public/admin/chapters/index.html'), 'utf8'),
  readFile(path.join(root, 'server/chapter-admin-v2.js'), 'utf8'),
  readFile(path.join(root, 'server/chapter-bank.js'), 'utf8'),
  readFile(path.join(root, 'src/components/SuccessionChapterReader.jsx'), 'utf8'),
]);
assert(adminPage.includes('/api/admin/chapter/bank') && adminPage.includes('Chapter Bank build 2026-07-23.2'), 'Hosted Chapter Bank dashboard or build marker is missing.');
assert(adminPage.includes('p.${page}') || adminPage.includes('page.label'), 'Admin Page Bank must display stable p.N labels.');
assert(hostedWorker.includes('CHAPTER_HISTORY_PATH') && hostedWorker.includes('createChapterPageRecord'), 'Hosted import must write enriched page records and history.');
assert(hostedWorker.includes('force: false'), 'Hosted bank publication must reject non-fast-forward races.');
assert(bankWorker.includes('checksumBytes') && bankWorker.includes('buildChapterBank'), 'Server-side bank checksums or aggregation are missing.');
assert(reader.includes('Chapter Bank reader') && reader.includes('page.label'), 'Public reader is not connected to bank page identities.');

if (errors.length) {
  console.error(`Succession Chapter Bank audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Succession Chapter Bank audit passed: ${SUCCESSION_BANK_TOTAL} chapter records, ${successionChapterBankSummary.pages} stored pages, ${successionChapterImportHistory.length} history entries.`);
}
