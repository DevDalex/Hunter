import { authorizedSuccessionChapterMedia } from './successionChapterMedia.generated.js';
import { successionChapterImportHistory } from './successionChapterImportHistory.generated.js';

export const SUCCESSION_BANK_START = 339;
export const SUCCESSION_BANK_END = 414;
export const SUCCESSION_BANK_TOTAL = SUCCESSION_BANK_END - SUCCESSION_BANK_START + 1;

export const SUCCESSION_BANK_STATUSES = Object.freeze({
  EMPTY: 'empty',
  INSPECTING: 'inspecting',
  READY: 'ready-for-review',
  IMPORTED: 'imported',
  PARTIAL: 'partially-imported',
  REPAIR: 'needs-repair',
  PUBLISHED: 'published',
});

const formatFromPath = (src = '') => {
  const match = String(src).toLowerCase().match(/\.([a-z0-9]+)(?:$|[?#])/);
  return match?.[1] === 'jpeg' ? 'jpg' : (match?.[1] || null);
};

const filenameFromPath = (src = '') => String(src).split('/').pop() || null;

export const normalizeSuccessionBankPage = (chapter, page, index = 0) => {
  const pageNumber = Number.isInteger(page?.page) ? page.page : index + 1;
  const filename = page?.filename || filenameFromPath(page?.src);
  const format = page?.format || formatFromPath(page?.src);

  return Object.freeze({
    id: page?.id || `chapter-${chapter}-p${String(pageNumber).padStart(3, '0')}`,
    chapter,
    page: pageNumber,
    label: page?.label || `p.${pageNumber}`,
    filename,
    src: page?.src || null,
    localPath: page?.localPath || page?.src || null,
    sourceUrl: page?.sourceUrl || null,
    width: Number.isInteger(page?.width) ? page.width : null,
    height: Number.isInteger(page?.height) ? page.height : null,
    format,
    byteSize: Number.isInteger(page?.byteSize) ? page.byteSize : null,
    checksum: page?.checksum || null,
    status: page?.status || 'published',
    importedAt: page?.importedAt || null,
  });
};

export const buildSuccessionChapterBankRecord = (chapter) => {
  const pages = Object.freeze([...(authorizedSuccessionChapterMedia[chapter] || [])]
    .sort((left, right) => left.page - right.page)
    .map((page, index) => normalizeSuccessionBankPage(chapter, page, index)));
  const latestHistory = successionChapterImportHistory
    .filter((entry) => entry.chapter === chapter)
    .sort((left, right) => String(right.timestamp || '').localeCompare(String(left.timestamp || '')))[0] || null;

  return Object.freeze({
    chapter,
    id: `chapter-${chapter}`,
    label: `Chapter ${chapter}`,
    pageCount: pages.length,
    storedPageCount: pages.length,
    expectedPageCount: latestHistory?.expectedPageCount || pages.length || null,
    missingPages: Object.freeze([...(latestHistory?.missingPages || [])]),
    status: pages.length ? (latestHistory?.status || SUCCESSION_BANK_STATUSES.PUBLISHED) : SUCCESSION_BANK_STATUSES.EMPTY,
    storage: pages.length ? 'local' : 'empty',
    pages,
    sourceUrl: latestHistory?.sourceUrl || pages.find((page) => page.sourceUrl)?.sourceUrl || null,
    lastUpdated: latestHistory?.timestamp || pages.find((page) => page.importedAt)?.importedAt || null,
    latestCommitSha: latestHistory?.commitSha || null,
  });
};

export const successionChapterBankRecords = Object.freeze(
  Array.from({ length: SUCCESSION_BANK_TOTAL }, (_, offset) => buildSuccessionChapterBankRecord(SUCCESSION_BANK_START + offset)),
);

export const successionChapterBankByNumber = new Map(
  successionChapterBankRecords.map((record) => [record.chapter, record]),
);

export const successionChapterBankSummary = Object.freeze({
  chapters: SUCCESSION_BANK_TOTAL,
  storedChapters: successionChapterBankRecords.filter((record) => record.pageCount > 0).length,
  emptyChapters: successionChapterBankRecords.filter((record) => record.pageCount === 0).length,
  pages: successionChapterBankRecords.reduce((total, record) => total + record.pageCount, 0),
  needsRepair: successionChapterBankRecords.filter((record) => record.status === SUCCESSION_BANK_STATUSES.REPAIR).length,
});
