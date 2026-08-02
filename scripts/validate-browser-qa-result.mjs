import { readFile } from 'node:fs/promises';
import path from 'node:path';

const reportPath = path.resolve(process.cwd(), process.env.PERFORMANCE_QA_OUTPUT || '.performance-qa', 'report.json');

let report;
try {
  report = JSON.parse(await readFile(reportPath, 'utf8'));
} catch (error) {
  console.error(`Browser QA failed and the performance report could not be read: ${error.message}`);
  process.exit(1);
}

const records = Array.isArray(report.results) ? report.results : [];
const failing = records.filter((record) => Array.isArray(record.defects) && record.defects.length > 0);
const isNonBlockingConstrainedTiming = (record) =>
  record.profile === 'constrained-mobile' &&
  record.defects.length > 0 &&
  record.defects.every((defect) => /^route ready time \d+ms exceeds 13,000ms$/.test(defect));

const nonBlocking = failing.filter(isNonBlockingConstrainedTiming);
const blocking = failing.filter((record) => !isNonBlockingConstrainedTiming(record));

if (blocking.length > 0) {
  console.error('Browser QA contains desktop, core, runtime, accessibility, layout, or non-timing performance failures:');
  for (const record of blocking) {
    console.error(`- ${record.profile}/${record.route}: ${record.defects.join('; ')}`);
  }
  process.exit(1);
}

if (nonBlocking.length === 0) {
  console.error('Browser QA failed for an unrecognized reason; no explicitly permitted constrained-mobile timing debt was found.');
  process.exit(1);
}

console.warn('Browser QA reported constrained-mobile timing debt only; release remains eligible because desktop and core functionality passed:');
for (const record of nonBlocking) {
  console.warn(`- ${record.profile}/${record.route}: ${record.defects.join('; ')}`);
}
