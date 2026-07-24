import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const audits = Object.freeze([
  ['contract', 'scripts/audit-succession-runtime-contract.mjs'],
  ['shell', 'scripts/audit-succession-archive-shell.mjs'],
  ['events', 'scripts/audit-succession-events-workspace.mjs'],
  ['locations', 'scripts/audit-succession-locations-workspace.mjs'],
  ['black-whale', 'scripts/audit-succession-black-whale-bridge.mjs'],
  ['assignments', 'scripts/audit-succession-assignments-workspace.mjs'],
  ['relationships', 'scripts/audit-succession-relationships-workspace.mjs'],
  ['foundation', 'scripts/audit-succession-foundation-closure.mjs'],
  ['reader', 'scripts/audit-succession-reader.mjs'],
]);

const failures = [];

for (const [name, relativePath] of audits) {
  console.log(`\n=== Succession runtime audit: ${name} ===`);
  const result = spawnSync(process.execPath, [path.join(root, relativePath)], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error || result.status !== 0) {
    failures.push({
      name,
      status: result.status ?? 1,
      error: result.error?.message || null,
    });
  }
}

if (failures.length) {
  console.error(`\nSuccession runtime audit sweep failed in ${failures.length}/${audits.length} audit(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.name}: exit code ${failure.status}${failure.error ? ` · ${failure.error}` : ''}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\nSuccession runtime audit sweep passed: ${audits.length}/${audits.length} audits.`);
}
