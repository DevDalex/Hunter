import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const audits = Object.freeze([
  ['stabilization', 'scripts/audit-succession-stabilization.mjs'],
  ['contract', 'scripts/audit-succession-runtime-contract.mjs'],
  ['chapter-385-boundary', 'scripts/audit-succession-chapter-385-boundary.mjs'],
  ['chapter-386-boundary', 'scripts/audit-succession-chapter-386-boundary.mjs'],
  ['chapter-387-boundary', 'scripts/audit-succession-chapter-387-boundary.mjs'],
  ['chapter-388-boundary', 'scripts/audit-succession-chapter-388-boundary.mjs'],
  ['chapter-389-boundary', 'scripts/audit-succession-chapter-389-boundary.mjs'],
  ['chapter-390-boundary', 'scripts/audit-succession-chapter-390-boundary.mjs'],
  ['chapter-391-boundary', 'scripts/audit-succession-chapter-391-boundary.mjs'],
  ['shell', 'scripts/audit-succession-archive-shell.mjs'],
  ['visual-foundation', 'scripts/audit-succession-visual-foundation.mjs'],
  ['shell-redesign', 'scripts/audit-succession-shell-redesign.mjs'],
  ['phase-1-visual-repair', 'scripts/audit-succession-phase-1-visual-repair.mjs'],
  ['phase-2-presentation-consistency', 'scripts/audit-succession-phase-2-presentation-consistency.mjs'],
  ['phase-3-information-consistency', 'scripts/audit-succession-phase-3-information-consistency.mjs'],
  ['phase-4-high-value-intelligence', 'scripts/audit-succession-phase-4-high-value-intelligence.mjs'],
  ['phase-5-workspace-refinements', 'scripts/audit-succession-phase-5-workspace-refinements.mjs'],
  ['phase-6-consolidation', 'scripts/audit-succession-phase-6-consolidation.mjs'],
  ['phase-2-design-system', 'scripts/audit-succession-phase-2-design-system.mjs'],
  ['phase-2-scope', 'scripts/audit-succession-phase-2-scope.mjs'],
  ['architecture-lock', 'scripts/audit-succession-architecture-lock.mjs'],
  ['black-whale-redesign', 'scripts/audit-succession-black-whale-redesign.mjs'],
  ['page-header-redesign', 'scripts/audit-succession-page-header-redesign.mjs'],
  ['breadcrumb-redesign', 'scripts/audit-succession-breadcrumb-redesign.mjs'],
  ['batch-2-closure', 'scripts/audit-succession-batch-2-completion.mjs'],
  ['batch-3-character-command', 'scripts/audit-succession-character-command.mjs'],
  ['batch-3-royal-command', 'scripts/audit-succession-royal-command.mjs'],
  ['batch-3-closure', 'scripts/audit-succession-batch-3-closure.mjs'],
  ['story-intelligence', 'scripts/audit-succession-story-intelligence-workspace.mjs'],
  ['events', 'scripts/audit-succession-events-workspace.mjs'],
  ['locations', 'scripts/audit-succession-locations-workspace.mjs'],
  ['batch-4-chapters', 'scripts/audit-succession-batch-4-chapters.mjs'],
  ['batch-4-story', 'scripts/audit-succession-batch-4-story.mjs'],
  ['batch-4-events', 'scripts/audit-succession-batch-4-events.mjs'],
  ['batch-4-nen', 'scripts/audit-succession-batch-4-nen-release.mjs'],
  ['batch-4-guardian-beasts', 'scripts/audit-succession-batch-4-guardian-beasts.mjs'],
  ['batch-4-spatial', 'scripts/audit-succession-batch-4-spatial.mjs'],
  ['batch-5-timeline', 'scripts/audit-succession-batch-5-timeline.mjs'],
  ['batch-5-relationships', 'scripts/audit-succession-batch-5-relationships.mjs'],
  ['batch-5-black-whale', 'scripts/audit-succession-batch-5-black-whale.mjs'],
  ['batch-5-assignments', 'scripts/audit-succession-batch-5-assignments.mjs'],
  ['batch-5-final', 'scripts/audit-succession-batch-5-final.mjs'],
  ['foundation', 'scripts/audit-succession-foundation-closure.mjs'],
  ['reader', 'scripts/audit-succession-reader.mjs'],
  ['production-surface', 'scripts/audit-succession-production-surface.mjs'],
  ['product-inventory', 'scripts/audit-succession-product-inventory.mjs'],
  ['final-product', 'scripts/audit-succession-final-product-closure.mjs'],
]);

const failures = [];
for (const [name, relativePath] of audits) {
  console.log(`\n=== Succession runtime audit: ${name} ===`);
  const result = spawnSync(process.execPath, [path.join(root, relativePath)], { cwd: root, env: process.env, stdio: 'inherit' });
  if (result.error || result.status !== 0) failures.push({ name, status: result.status ?? 1, error: result.error?.message || null });
}
if (failures.length) {
  console.error(`\nSuccession runtime audit sweep failed in ${failures.length}/${audits.length} audit(s):`);
  for (const failure of failures) console.error(`- ${failure.name}: exit code ${failure.status}${failure.error ? ` · ${failure.error}` : ''}`);
  process.exitCode = 1;
} else {
  console.log(`\nSuccession runtime audit sweep passed: ${audits.length}/${audits.length} audits.`);
}
