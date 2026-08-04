import { archiveCoverage, archiveCoverageList, domainCoverage } from '../src/data/archiveCoverage.js';

for (const item of archiveCoverageList) {
  if (!Number.isInteger(item.chapter) || item.chapter <= 0) {
    throw new Error(`${item.id} coverage must have a positive integer chapter.`);
  }
  if (!item.label || !item.description) {
    throw new Error(`${item.id} coverage needs user-facing label and description.`);
  }
}

// Publication metadata and authorized reader media are maintained by different
// pipelines. Reader authorization may temporarily lead the hand-reviewed
// publication catalogue, so neither is treated as a strict parent boundary.
const availableChapterBoundary = Math.max(
  archiveCoverage.publication.chapter,
  archiveCoverage.reader.chapter,
);

if (archiveCoverage.research.chapter > availableChapterBoundary) {
  throw new Error('Fully indexed research coverage cannot exceed available chapter coverage.');
}

for (const [domain, coverage] of Object.entries(domainCoverage)) {
  if (!coverage.label || !coverage.status) throw new Error(`${domain} coverage is incomplete.`);
  if (!Number.isInteger(coverage.chapter) || coverage.chapter <= 0) {
    throw new Error(`${domain} coverage needs a positive chapter boundary.`);
  }
  if (coverage.chapter > availableChapterBoundary) {
    throw new Error(`${domain} coverage exceeds the available chapter boundary.`);
  }
}

console.log(`Archive coverage audit passed: ${Object.keys(domainCoverage).length} domains.`);
