import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const tasks = Object.freeze([
  ['Generated docs', ['run', 'docs:check']],
  ['Unit tests', ['run', 'test:unit']],
  ['Spoiler boundary', ['run', 'audit:spoilers']],
  ['Runtime schemas', ['run', 'audit:schema']],
  ['CSS ownership', ['run', 'audit:css']],
]);

const failures = [];
for (const [label, args] of tasks) {
  process.stdout.write(`\n[doctor] ${label}\n`);
  const result = spawnSync(npm, args, { stdio: 'inherit', env: process.env });
  if (result.status !== 0) failures.push(label);
}

if (failures.length) {
  console.error(`\nRepository doctor failed: ${failures.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`\nRepository doctor passed: ${tasks.length}/${tasks.length} checks green.`);
}
