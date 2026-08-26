import { spawnSync } from 'node:child_process';

const tasks = Object.freeze([
  ['Phase 2 UX closure', ['scripts/audit-succession-phase2-ux-closure.mjs']],
  ['Runtime schema coverage', ['scripts/audit-succession-runtime-schema-coverage.mjs']],
  ['Spoiler surfaces', ['scripts/audit-succession-spoiler-leak-surfaces.mjs']],
  ['Local analytics privacy', ['scripts/audit-succession-local-analytics.mjs']],
  ['Public coverage roadmap', ['scripts/audit-succession-coverage-roadmap.mjs']],
  ['Architecture decisions', ['scripts/audit-succession-adrs.mjs']],
  ['Historical CSS boundary', ['scripts/audit-succession-css-consolidation.mjs']],
  ['Chapter 400 chunk boundary', ['scripts/audit-succession-chapter400-chunk-boundary.mjs']],
  ['Chapter 403 chunk boundary', ['scripts/audit-succession-chapter403-chunk-boundary.mjs']],
  ['Media derivative manifest/files', ['scripts/generate-media-derivatives.mjs', '--verify-only']],
  ['Media derivative integration', ['scripts/audit-media-derivatives.mjs']],
]);

const failures = [];
for (const [label, args] of tasks) {
  process.stdout.write(`\n[succession-phase5] ${label}\n`);
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env: process.env });
  if (result.status !== 0) failures.push(label);
}

if (failures.length) {
  console.error(`\nSuccession Phase 5 audits failed: ${failures.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`\nSuccession Phase 5 audits passed: ${tasks.length}/${tasks.length} contracts green.`);
}
