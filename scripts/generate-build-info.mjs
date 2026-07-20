import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const now = new Date().toISOString();

const readGit = (args, fallback = '') => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
};

const env = process.env;
const commit = readGit(['rev-parse', 'HEAD'], env.CF_PAGES_COMMIT_SHA || env.GITHUB_SHA || env.COMMIT_SHA || 'unknown');
const shortCommit = commit && commit !== 'unknown' ? commit.slice(0, 12) : 'unknown';
const branch = readGit(['rev-parse', '--abbrev-ref', 'HEAD'], env.CF_PAGES_BRANCH || env.GITHUB_REF_NAME || env.BRANCH || 'unknown');

const info = {
  app: 'Hunter × Hunter Archive',
  builtAt: now,
  commit,
  shortCommit,
  branch,
  environment: env.CF_PAGES ? 'cloudflare' : env.CI ? 'ci' : 'local',
  contentBoundary: 413,
  sourcePolicy: 'Hunterpedia/Fandom only',
};

const output = path.join(root, 'public', 'build-info.json');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(info, null, 2)}\n`);
console.log(`Build identity written: ${shortCommit} (${branch})`);
