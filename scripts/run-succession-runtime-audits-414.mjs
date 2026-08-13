import './run-succession-runtime-audits-413.mjs';
import './audit-succession-chapter-414-strict.mjs';

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 414.');
} else {
  console.log('\nSuccession runtime audit sweep passed: 71/71 audits.');
}
