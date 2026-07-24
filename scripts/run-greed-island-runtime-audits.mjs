import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const audits = Object.freeze([
  ['eta-scene', 'scripts/audit-greed-island-eta-scene.mjs'],
  ['archive', 'scripts/audit-greed-island-archive.mjs'],
  ['libraries', 'scripts/audit-greed-island-libraries.mjs'],
  ['systems', 'scripts/audit-greed-island-systems.mjs'],
  ['tactics', 'scripts/audit-greed-island-tactics.mjs'],
  ['completion', 'scripts/audit-greed-island-completion.mjs'],
  ['route', 'scripts/audit-greed-island-route.mjs'],
]);

const failures = [];

for (const [name, relativePath] of audits) {
  console.log(`\n=== Greed Island runtime audit: ${name} ===`);
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
  console.error(`\nGreed Island runtime audit sweep failed in ${failures.length}/${audits.length} audit(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.name}: exit code ${failure.status}${failure.error ? ` · ${failure.error}` : ''}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\nGreed Island runtime audit sweep passed: ${audits.length}/${audits.length} audits.`);
}
