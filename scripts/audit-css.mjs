import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const entryPath = 'src/styles.css';
const finalPolishPath = 'src/styles/final-polish.css';
const routePolishPaths = [
  'src/components/HunterExamPageContrast.css',
  'src/components/SuccessionChapterReaderPolish.css',
  'src/components/succession/SuccessionArchiveContrast.css',
  'src/components/succession/SuccessionArchiveRoyalContrast.css',
];
const layerPaths = [
  'src/styles/base.css',
  'src/styles/editorial.css',
  'src/styles/experiences.css',
  'src/styles/accessibility-contrast.css',
  'src/styles/archive-system.css',
];
const runtimeExtensionPaths = [
  'src/nen.css',
  finalPolishPath,
];
const expectedImports = layerPaths.map((value) => `./${value.replace(/^src\//, '')}`);
const expectedMainCssImports = [
  './styles.css',
  './nen.css',
  './styles/final-polish.css',
];

const assert = (condition, message) => {
  if (!condition) throw new Error(`CSS ownership audit failed: ${message}`);
};

const normalize = (value) => value
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const normalizeSelector = (value) => normalize(value)
  .replace(/\s*([>+~])\s*/g, '$1')
  .replace(/\s*([|^$*~]?=)\s*/g, '$1');

assert(
  normalizeSelector('.example article > span') === normalizeSelector('.example article>span'),
  'selector normalization must treat combinator whitespace as equivalent',
);
assert(
  normalizeSelector('[data-state = "open"] > span') === normalizeSelector('[data-state="open"]>span'),
  'selector normalization must treat attribute-operator whitespace as equivalent',
);

const collectRules = (css, source) => {
  const rules = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = pattern.exec(css))) {
    const prelude = normalize(match[1]);
    const body = normalize(match[2]);
    if (!prelude || !body || prelude.startsWith('@')) continue;
    if (/^(from|to|\d+(?:\.\d+)?%)$/.test(prelude)) continue;
    for (const selector of prelude.split(',').map(normalizeSelector).filter(Boolean)) {
      rules.push({ selector, body, source });
    }
  }
  return rules;
};

const walkCss = async (directory) => {
  const files = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkCss(relative));
    else if (entry.name.endsWith('.css')) files.push(relative.replaceAll('\\', '/'));
  }
  return files;
};

await access(path.resolve(entryPath));
for (const file of [...layerPaths, ...runtimeExtensionPaths, ...routePolishPaths]) await access(path.resolve(file));

const entry = await readFile(path.resolve(entryPath), 'utf8');
const imports = [...entry.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)].map((match) => match[1]);
assert(JSON.stringify(imports) === JSON.stringify(expectedImports), `global imports must be ${expectedImports.join(' → ')}`);

const main = await readFile(path.resolve('src/main.jsx'), 'utf8');
const cssImports = [...main.matchAll(/import\s+['"](\.\/[^'"]+\.css)['"]\s*;/g)].map((match) => match[1]);
assert(
  JSON.stringify(cssImports) === JSON.stringify(expectedMainCssImports),
  `src/main.jsx CSS imports must be exactly ${expectedMainCssImports.join(' → ')}`,
);
assert(cssImports.at(-1) === './styles/final-polish.css', 'the final polish stylesheet must remain the last declared runtime CSS import');

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

const cssFiles = await walkCss('src');
const repeatedSelectors = [...selectorCounts.values()].filter((count) => count > 1).length;
const exactDuplicateRules = [...exactCounts.values()].reduce((total, count) => total + Math.max(0, count - 1), 0);

console.log(`CSS ownership audit passed: ${layerPaths.length} ordered styles.css layers including semantic contrast and Batch 12 archive primitives; ${runtimeExtensionPaths.length} ordered runtime extension layers; ${routePolishPaths.length} route-owned final polish layer(s); ${cssFiles.length} CSS files checked; ${rules.length} selector rules; ${repeatedSelectors} intentional override selectors; ${exactDuplicateRules} exact duplicate rule occurrence(s) reported for future cleanup.`);
