import './run-succession-runtime-audits-415.mjs';
// Chapter 416 adds the strict 60-beat boundary audit as the 73rd runtime gate.
import './audit-succession-chapter-416-boundary.mjs';

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 416.');
} else {
  console.log('\nSuccession runtime audit sweep passed: 73/73 audits.');
}
