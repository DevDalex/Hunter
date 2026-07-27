import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession production surface audit failed: ${message}`);
};

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};
const allowedProductionDependencies = new Set(['lucide-react', 'react', 'react-dom', 'zod']);
const unexpectedDependencies = Object.keys(dependencies).filter((name) => !allowedProductionDependencies.has(name));
assert(unexpectedDependencies.length === 0, `unexpected production dependencies: ${unexpectedDependencies.join(', ')}`);
assert(
  Object.keys(dependencies).length === allowedProductionDependencies.size,
  'production dependency surface must remain limited to React, React DOM, Lucide, and the canonical Zod schema runtime',
);
assert(!dependencies.sharp, 'Sharp must remain build-only and must not enter the production runtime surface');
assert(devDependencies.sharp, 'Sharp must remain available as the pinned media-build dependency');
for (const [name, version] of Object.entries(dependencies)) {
  assert(/^\d+\.\d+\.\d+$/.test(version), `${name} must use an exact pinned production version`);
}

const collectFiles = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
    else if (/\.(?:js|jsx|mjs)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
};

const sourceFiles = await collectFiles(path.join(root, 'src/components/succession'));
const violations = [];
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  if (/dangerouslySetInnerHTML/.test(source)) violations.push(`${relative}: dangerouslySetInnerHTML`);
  if (/\beval\s*\(|new\s+Function\s*\(/.test(source)) violations.push(`${relative}: dynamic code execution`);
  for (const tag of source.match(/<a\b[^>]*target=["']_blank["'][^>]*>/g) || []) {
    const rel = tag.match(/rel=["']([^"']+)["']/)?.[1] || '';
    if (!rel.split(/\s+/).includes('noopener') || !rel.split(/\s+/).includes('noreferrer')) {
      violations.push(`${relative}: external target lacks noopener+noreferrer`);
    }
  }
}
assert(violations.length === 0, violations.join(' | '));

const routeSource = await readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8');
assert(!/process\.env|import\.meta\.env/.test(routeSource), 'client archive router must not read secrets or deployment credentials');

console.log(`Succession production surface audit passed: ${Object.keys(dependencies).length} pinned production dependencies including the Zod schema runtime; Sharp remains build-only; ${sourceFiles.length} Succession source modules; safe external links; no dynamic HTML injection; no eval-style execution; and no client credential reads.`);
