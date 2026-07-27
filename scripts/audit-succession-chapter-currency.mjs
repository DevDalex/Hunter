import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession chapter-currency audit failed: ${message}`);
};

const [chaptersSource, releasesSource, researchSource, dataSource, primitives, currencyCss, reportSource] = await Promise.all([
  read('src/data/chapters.js'),
  read('src/data/latestChapterReleases.js'),
  read('src/data/succession/successionResearch.js'),
  read('src/data/succession/successionData.js'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/components/succession/SuccessionArchiveCurrency.css'),
  read('scripts/report-succession-chapter-coverage.mjs'),
]);

for (const token of [
  'publishedChapterTitles',
  'getCurrentChapterRelease',
  'publicationStatus',
  'titleStatus',
]) assert(chaptersSource.includes(token), `chapter registry is missing ${token}`);

for (const token of [
  'number: 414',
  'number: 415',
  "titleStatus: 'pending-maintained-source'",
  'Official publication identity verified',
]) assert(`${releasesSource}\n${chaptersSource}`.includes(token), `current-release metadata is missing ${token}`);

for (const token of [
  'researchVerifiedThrough',
  'publicationVerifiedThrough',
  'coverageGap',
  'recentChanges',
  'openQuestions',
  'LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER',
]) assert(researchSource.includes(token), `research currency is missing ${token}`);

for (const token of [
  'createRecordCurrencySelectors',
  'getRecordCurrency',
  'getRecentChangesForRecord',
  'getOpenQuestionsForRecord',
  'getArchiveCoverageReport',
]) assert(dataSource.includes(token), `canonical selector gateway is missing ${token}`);

assert(primitives.includes('RecordCurrencyPanel') && primitives.includes('This record is behind the selected boundary.'), 'entity dossiers must expose verified-through and gap status');
assert(primitives.includes('Recent changes') && primitives.includes('Open questions'), 'entity dossiers must expose recent changes and open questions');
assert(currencyCss.includes('.succession-record-currency__metrics') && currencyCss.includes('@media (max-width: 720px)'), 'record currency UI must retain responsive styling');
assert(reportSource.includes('getArchiveCoverageReport') && reportSource.includes('Pending chapter research'), 'generated coverage report must use canonical selectors');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [chapterModule, archiveModule, researchModule] = await Promise.all([
    vite.ssrLoadModule('/src/data/chapters.js'),
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/successionResearch.js'),
  ]);

  assert(chapterModule.LATEST_CHAPTER === 415, `full-series chapter registry must end at 415, found ${chapterModule.LATEST_CHAPTER}`);
  assert(chapterModule.chapters.length === 415, `expected 415 chapter catalogue records, found ${chapterModule.chapters.length}`);
  for (const number of [414, 415]) {
    const record = chapterModule.chapters[number - 1];
    assert(record?.number === number, `Chapter ${number} must exist in the full-series registry`);
    assert(record?.publicationStatus === 'published', `Chapter ${number} must be marked officially published`);
    assert(record?.researchStatus?.includes('detailed research pending'), `Chapter ${number} must remain visibly pending detailed research`);
    assert(record?.titleStatus === 'pending-maintained-source', `Chapter ${number} title must not be presented as verified prematurely`);
  }

  const chapter415 = archiveModule.getChapter(415);
  assert(chapter415?.reader?.manifestChapter === 415, 'canonical Chapter 415 must bridge to the authorized reader');
  assert(chapter415?.sourceIds?.includes('source:chapter-415'), 'canonical Chapter 415 must retain its source record');

  const researchCoverage = researchModule.successionResearchCoverage;
  assert(researchCoverage.readingBoundary === 415, 'research reading boundary must be 415');
  assert(researchCoverage.detailedThrough === 413, 'detailed research must remain honestly verified through 413');
  assert(researchCoverage.pendingChapters.join(',') === '414,415', `pending detailed research must be 414,415; found ${researchCoverage.pendingChapters.join(',')}`);

  const report = archiveModule.getArchiveCoverageReport(415);
  assert(report.readingBoundary === 415 && report.archiveMaximum === 415, 'coverage report must use the Chapter 415 boundary');
  assert(report.detailedResearchThrough === 413, `coverage report must expose detailed research through 413, found ${report.detailedResearchThrough}`);
  assert(report.domains.some((domain) => domain.domain === 'characters'), 'coverage report must include character records');
  assert(report.domains.some((domain) => domain.domain === 'relationships'), 'coverage report must include relationship records');

  const kurapika = archiveModule.getCharacter('kurapika');
  const currency = archiveModule.getRecordCurrency(kurapika, 415);
  assert(currency?.readingBoundary === 415, 'record currency must preserve the selected reading boundary');
  assert(currency?.coverageGap?.to === 415, 'active records behind the boundary must expose the Chapter 415 gap');
  assert(currency?.openQuestions?.length, 'active records behind the boundary must retain an explicit open question');
} finally {
  await vite.close();
}

console.log('Succession chapter-currency audit passed: official publication identity reaches Chapter 415; detailed research remains honestly bounded at 413; entity dossiers expose verified-through, gaps, recent changes, and open questions; generated domain coverage is registered.');
