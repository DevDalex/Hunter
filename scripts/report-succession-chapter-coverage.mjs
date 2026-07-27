import { getArchiveCoverageReport } from '../src/data/succession/successionData.js';
import { successionResearchCoverage } from '../src/data/succession/successionResearch.js';

const report = getArchiveCoverageReport();
const payload = Object.freeze({
  generatedAt: report.generatedAt,
  readingBoundary: report.readingBoundary,
  archiveMaximum: report.archiveMaximum,
  detailedResearchThrough: successionResearchCoverage.detailedThrough,
  pendingChapterNumbers: successionResearchCoverage.pendingChapters,
  recordsBehindBoundary: report.recordsBehindBoundary,
  recordsPendingReview: report.recordsPendingReview,
  domains: report.domains,
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log('# Succession chapter coverage');
  console.log('');
  console.log(`- Reading boundary: Chapter ${payload.readingBoundary}`);
  console.log(`- Detailed research verified through: Chapter ${payload.detailedResearchThrough}`);
  console.log(`- Pending chapter research: ${payload.pendingChapterNumbers.length ? payload.pendingChapterNumbers.join(', ') : 'none'}`);
  console.log(`- Active records behind boundary: ${payload.recordsBehindBoundary}`);
  console.log(`- Records explicitly pending review: ${payload.recordsPendingReview}`);
  console.log('');
  console.log('| Domain | Total | Current | Behind | Pending | Historical | No evidence | Latest evidence |');
  console.log('|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const domain of payload.domains) {
    console.log(`| ${domain.domain} | ${domain.total} | ${domain.current || 0} | ${domain.behind || 0} | ${domain.pending || 0} | ${domain.historical || 0} | ${domain.noEvidence || 0} | ${domain.latestVerifiedChapter || '—'} |`);
  }
}
