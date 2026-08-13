import './run-succession-runtime-audits-413.mjs';
// Chapter 414 adds the corrected 55-beat boundary audit as the 71st runtime gate.
import './audit-succession-chapter-414-boundary.mjs';

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 414.');
} else {
  console.log('\nSuccession runtime audit sweep passed: 71/71 audits.');
}
