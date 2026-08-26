import './run-succession-runtime-audits-416.mjs';
import './audit-succession-chapter-417-strict.mjs';
import './audit-succession-chapter-418-strict.mjs';
import './audit-succession-chapter-418-boundary.mjs';

// Run the heavier Vite-backed completeness audit only after the static
// Chapter 417/418 audit modules have fully settled. Keeping it out of the
// static import graph prevents overlapping top-level-await Vite SSR runners
// from contending for the module transport / HMR socket.
await import('./audit-succession-nen-content-completeness.mjs');

if (process.exitCode) {
  console.error('\nSuccession runtime audit sweep failed including Chapter 418.');
} else {
  console.log('\nSuccession runtime audit sweep passed through Chapter 418.');
}
