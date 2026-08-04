const chapterFields = Object.freeze([
  'chapter',
  'introducedAtChapter',
  'revealedAtChapter',
  'confirmedAtChapter',
  'validFromChapter',
]);

const getIntroductionChapter = (record) => {
  for (const field of chapterFields) {
    const value = Number(record?.[field]);
    if (Number.isFinite(value)) return value;
  }
  return null;
};

export const isRecordVisibleAtChapter = (record, boundary) => {
  if (!record || typeof record !== 'object') return true;
  const selectedBoundary = Number(boundary);
  if (!Number.isFinite(selectedBoundary)) return true;

  const introducedAt = getIntroductionChapter(record);
  if (introducedAt !== null && introducedAt > selectedBoundary) return false;

  const validTo = Number(record.validToChapter ?? record.resolvedAtChapter ?? record.endedAtChapter);
  if (Number.isFinite(validTo) && validTo < selectedBoundary && record.hideAfterValidity === true) return false;

  return true;
};

export const filterRecordsAtChapter = (records = [], boundary) => (
  records.filter((record) => isRecordVisibleAtChapter(record, boundary))
);

export const assertNoFutureRecords = (records = [], boundary, context = 'records') => {
  const leaked = records.filter((record) => !isRecordVisibleAtChapter(record, boundary));
  if (leaked.length > 0) {
    const identities = leaked.slice(0, 10).map((record) => record.id || record.slug || record.name || 'unknown');
    throw new Error(`${context} contains ${leaked.length} future record(s) at Chapter ${boundary}: ${identities.join(', ')}`);
  }
  return true;
};
