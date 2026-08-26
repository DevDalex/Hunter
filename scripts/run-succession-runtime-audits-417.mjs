import './run-succession-runtime-audits-416.mjs';
// Chapter 417 adds the strict 74-beat publication-ceiling boundary audit as the 74th runtime gate.
import './audit-succession-chapter-417-boundary.mjs';

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 417.');
} else {
  console.log('\nSuccession runtime audit sweep passed through Chapter 417.');
}
