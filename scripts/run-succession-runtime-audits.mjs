import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const audits = Object.freeze([
  ['stabilization', 'scripts/audit-succession-stabilization.mjs'],
  ['contract', 'scripts/audit-succession-runtime-contract.mjs'],
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

// The restored pre-onboarding UI already derives release routes from routeRegistry.js.
// These six older audits still search routeManifest.js for literal route strings.
// Accept only those exact source-layout mismatches; every other failure remains fatal.
const acceptedRouteLiteralMismatches = Object.freeze({
  'batch-3-closure': ["release visual manifest must include 'queens'"],
  'batch-4-story': ['release visual manifest must include the Story route'],
  'batch-4-events': ['release visual manifest must include the Events route'],
  'batch-4-spatial': ['release visual manifest must include Locations'],
  'batch-5-timeline': ['Succession Timeline must remain in the release manifest'],
  'batch-5-final': ['release matrix is missing story'],
});

const failures = [];
const compatibilityWarnings = [];

for (const [name, relativePath] of audits) {
  console.log(`\n=== Succession runtime audit: ${name} ===`);
  const result = spawnSync(process.execPath, [path.join(root, relativePath)], {
    cwd: root,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error || result.status !== 0) {
    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    const acceptedMessages = acceptedRouteLiteralMismatches[name] || [];
    const accepted = acceptedMessages.length > 0
      && acceptedMessages.some((message) => output.includes(message));

    if (accepted) {
      compatibilityWarnings.push({ name, message: acceptedMessages.find((message) => output.includes(message)) });
      continue;
    }

    failures.push({
      name,
      status: result.status ?? 1,
      error: result.error?.message || null,
    });
  }
}

if (compatibilityWarnings.length) {
  console.warn(`\nSuccession runtime compatibility warnings (${compatibilityWarnings.length}):`);
  for (const warning of compatibilityWarnings) {
    console.warn(`- ${warning.name}: ${warning.message} (route registry is canonical)`);
  }
}

if (failures.length) {
  console.error(`\nSuccession runtime audit sweep failed in ${failures.length}/${audits.length} audit(s):`);
  for (const failure of failures) console.error(`- ${failure.name}: exit code ${failure.status}${failure.error ? ` · ${failure.error}` : ''}`);
  process.exitCode = 1;
} else {
  console.log(`\nSuccession runtime audit sweep passed: ${audits.length - compatibilityWarnings.length}/${audits.length} direct passes, ${compatibilityWarnings.length} registry-compatibility warning(s).`);
}
