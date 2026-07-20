import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// These audits do not depend on release ZIP generation or the final Vite output.
// Run every one, even after an earlier failure, so CI reports the full repair list
// instead of revealing one stale contract per deployment.
export const preflightAuditScripts = Object.freeze([
  'audit:content',
  'audit:implementation',
  'audit:story',
  'audit:reference',
  'audit:characters',
  'audit:final',
  'audit:governance',
  'audit:schema',
  'audit:css',
  'audit:readability',
  'audit:layout',
  'audit:accessibility',
  'audit:media',
  'audit:polish',
]);

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const missingScripts = preflightAuditScripts.filter((name) => !packageJson.scripts?.[name]);
if (missingScripts.length) {
  throw new Error(`Build preflight references missing package scripts: ${missingScripts.join(', ')}`);
}

const runScript = (name) => new Promise((resolve) => {
  const child = spawn(npmCommand, ['run', name], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  child.once('error', (error) => resolve({ name, code: 1, error: error.message }));
  child.once('close', (code, signal) => resolve({
    name,
    code: typeof code === 'number' ? code : 1,
    error: signal ? `terminated by ${signal}` : null,
  }));
});

const failures = [];
for (const name of preflightAuditScripts) {
  console.log(`\n=== Build preflight: ${name} ===`);
  const result = await runScript(name);
  if (result.code !== 0) failures.push(result);
}

if (failures.length) {
  console.error(`\nBuild preflight failed in ${failures.length}/${preflightAuditScripts.length} audit(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.name}${failure.error ? `: ${failure.error}` : `: exit code ${failure.code}`}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\nBuild preflight passed: ${preflightAuditScripts.length}/${preflightAuditScripts.length} audits.`);
}
