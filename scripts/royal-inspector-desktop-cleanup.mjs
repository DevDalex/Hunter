import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'src/components/succession');
const aggregatorPath = path.join(dir, 'RoyalFamilyInspector.css');
const desktopPath = path.join(dir, 'RoyalFamilyInspectorDesktop.css');
const legacyNames = [
  'RoyalFamilyInspectorResponsive01.css',
  'RoyalFamilyInspectorResponsive02.css',
  'RoyalFamilyInspectorResponsive03.css',
  'RoyalFamilyInspectorResponsive04.css',
];

let aggregator = await readFile(aggregatorPath, 'utf8');
if (!aggregator.includes("@import './RoyalFamilyInspectorDesktop.css';")) {
  const imports = legacyNames.map((name) => `@import './${name}';`).join('\n');
  if (!aggregator.includes(imports)) throw new Error('Royal inspector responsive import block not found');
  aggregator = aggregator.replace(imports, "@import './RoyalFamilyInspectorDesktop.css';");
  await writeFile(aggregatorPath, aggregator);
}

let desktop = '';
try {
  desktop = await readFile(desktopPath, 'utf8');
} catch {
  const footer = await readFile(path.join(dir, legacyNames[0]), 'utf8');
  const reducedMotion = await readFile(path.join(dir, legacyNames[3]), 'utf8');
  desktop = `${footer.trim()}\n\n${reducedMotion.trim()}\n`
    .replace('font-size: 8px;', 'font-size: 11px;')
    .replace('font-size: 10px;', 'font-size: 11px;');
  await writeFile(desktopPath, desktop);
}

for (const name of legacyNames) await rm(path.join(dir, name), { force: true });
console.log('Royal Family inspector responsive fossils folded into RoyalFamilyInspectorDesktop.css.');
