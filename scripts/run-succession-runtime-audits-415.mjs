import './run-succession-runtime-audits-414.mjs';
// Chapter 415 adds the strict 60-beat boundary audit as the 72nd runtime gate.
import './audit-succession-chapter-415-boundary.mjs';

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 415.');
} else {
  console.log('\nSuccession runtime audit sweep passed through Chapter 415.');
}
