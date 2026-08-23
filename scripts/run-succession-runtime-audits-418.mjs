import './run-succession-runtime-audits-416.mjs';
import './audit-succession-chapter-417-strict.mjs';
import './audit-succession-chapter-418-strict.mjs';
import './audit-succession-chapter-418-boundary.mjs';

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 418.');
} else {
  console.log('\nSuccession runtime audit sweep passed through Chapter 418.');
}
