import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'src/data/routeRegistry.js',
  'src/data/archiveCoverage.js',
  'src/data/schemas/archiveSchemas.js',
  'src/lib/succession/chapterDiff.js',
  'src/lib/succession/researchWorkspace.js',
  'src/components/succession/SuccessionResearchTools.jsx',
  'scripts/audit-product-phases.mjs',
  'docs/PHASES-2-5.md',
];

const failures = [];
for (const file of requiredFiles) {
  try { await access(file); } catch { failures.push(`Missing required file: ${file}`); }
}

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
for (const script of ['check', 'build', 'audit:product-phases', 'test:unit', 'docs:check']) {
  if (!packageJson.scripts?.[script]) failures.push(`Missing npm script: ${script}`);
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor < 20) failures.push(`Node ${process.versions.node} is unsupported; use Node 20.19+ or 22.12+.`);

if (failures.length) {
  console.error(`Hunter doctor found ${failures.length} problem(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Hunter doctor passed on Node ${process.versions.node}: ${requiredFiles.length} required files and core scripts are present.`);
