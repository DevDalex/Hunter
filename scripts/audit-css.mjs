import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const entryPath = 'src/styles.css';
const layerPaths = [
  'src/styles/base.css',
  'src/styles/editorial.css',
  'src/styles/experiences.css',
];
const expectedImports = layerPaths.map((value) => `./${value.replace(/^src\//, '')}`);

const assert = (condition, message) => {
  if (!condition) throw new Error(`CSS ownership audit failed: ${message}`);
};

const normalize = (value) => value
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const collectRules = (css, source) => {
  const rules = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = pattern.exec(css))) {
    const prelude = normalize(match[1]);
    const body = normalize(match[2]);
    if (!prelude || !body || prelude.startsWith('@')) continue;
    if (/^(from|to|\d+(?:\.\d+)?%)$/.test(prelude)) continue;
    for (const selector of prelude.split(',').map(normalize).filter(Boolean)) {
      rules.push({ selector, body, source });
    }
  }
  return rules;
};

await access(path.resolve(entryPath));
for (const file of layerPaths) await access(path.resolve(file));

const entry = await readFile(path.resolve(entryPath), 'utf8');
const imports = [...entry.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)].map((match) => match[1]);
assert(JSON.stringify(imports) === JSON.stringify(expectedImports), `global imports must be ${expectedImports.join(' → ')}`);

const main = await readFile(path.resolve('src/main.jsx'), 'utf8');
const cssImports = [...main.matchAll(/import\s+['"](\.\/[^'"]+\.css)['"]\s*;/g)].map((match) => match[1]);
assert(JSON.stringify(cssImports) === JSON.stringify(['./styles.css', './nen.css']), 'src/main.jsx must import only styles.css followed by nen.css');

for (const obsolete of ['src/redesign.css', 'src/v3.css']) {
  let exists = true;
  try { await access(path.resolve(obsolete)); } catch { exists = false; }
  assert(!exists, `${obsolete} must not remain as a second global entry point`);
}

const rules = [];
for (const file of layerPaths) {
  const content = await readFile(path.resolve(file), 'utf8');
  assert(content.trim().length > 500, `${file} is unexpectedly empty`);
  rules.push(...collectRules(content, file));
}

const selectorCounts = new Map();
const exactCounts = new Map();
for (const rule of rules) {
  selectorCounts.set(rule.selector, (selectorCounts.get(rule.selector) || 0) + 1);
  const exactKey = `${rule.selector}\n${rule.body}`;
  exactCounts.set(exactKey, (exactCounts.get(exactKey) || 0) + 1);
}

const repeatedSelectors = [...selectorCounts.values()].filter((count) => count > 1).length;
const exactDuplicateRules = [...exactCounts.values()].reduce((total, count) => total + Math.max(0, count - 1), 0);

console.log(`CSS ownership audit passed: ${layerPaths.length} ordered layers; ${rules.length} selector rules; ${repeatedSelectors} intentional override selectors; ${exactDuplicateRules} exact duplicate rule occurrence(s) reported for future cleanup.`);
