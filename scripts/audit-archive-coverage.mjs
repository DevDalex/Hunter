import { archiveCoverage, archiveCoverageList, domainCoverage } from '../src/data/archiveCoverage.js';

for (const item of archiveCoverageList) {
  if (!Number.isInteger(item.chapter) || item.chapter <= 0) {
    throw new Error(`${item.id} coverage must have a positive integer chapter.`);
  }
  if (!item.label || !item.description) {
    throw new Error(`${item.id} coverage needs user-facing label and description.`);
  }
}

if (archiveCoverage.reader.chapter > archiveCoverage.publication.chapter) {
  throw new Error('Readable chapter coverage cannot exceed verified publication coverage.');
}

if (archiveCoverage.research.chapter > archiveCoverage.publication.chapter) {
  throw new Error('Fully indexed research coverage cannot exceed verified publication coverage.');
}

for (const [domain, coverage] of Object.entries(domainCoverage)) {
  if (!coverage.label || !coverage.status) throw new Error(`${domain} coverage is incomplete.`);
  if (!Number.isInteger(coverage.chapter) || coverage.chapter <= 0) {
    throw new Error(`${domain} coverage needs a positive chapter boundary.`);
  }
  if (coverage.chapter > archiveCoverage.publication.chapter) {
    throw new Error(`${domain} coverage exceeds the publication boundary.`);
  }
}

console.log(`Archive coverage audit passed: ${Object.keys(domainCoverage).length} domains.`);
