import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession stabilization audit failed: ${message}`);
};

const normalize = (value) => String(value || '')
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const normalizeSelector = (value) => normalize(value)
  .replace(/\s*([>+~])\s*/g, '$1')
  .replace(/\s*([|^$*~]?=)\s*/g, '$1');

const collectRules = (css) => {
  const rules = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = pattern.exec(css))) {
    const prelude = normalize(match[1]);
    const body = normalize(match[2]);
    if (!prelude || !body || prelude.startsWith('@')) continue;
    if (/^(from|to|\d+(?:\.\d+)?%)$/.test(prelude)) continue;
    for (const selector of prelude.split(',').map(normalizeSelector).filter(Boolean)) rules.push({ selector, body });
  }
  return rules;
};

const fontSizesFor = (body) => [...body.matchAll(/font-size:\s*([0-9.]+)px\b/g)].map((match) => Number(match[1]));

const [app, entry, contrast, chapterCss, storyCss, cssAudit] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionArchiveContrast.css'),
  read('src/components/succession/SuccessionArchiveChapterStoryWorkspace.css'),
  read('src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.css'),
  read('scripts/audit-css.mjs'),
]);

let temporaryWrapperExists = true;
try { await access(path.join(root, 'src/components/succession/SuccessionArchiveApp.js')); } catch { temporaryWrapperExists = false; }
assert(!temporaryWrapperExists, 'temporary SuccessionArchiveApp.js wrapper must not coexist with the canonical JSX module');
const canonicalReexport = entry.includes("export { default } from './SuccessionArchiveApp'");
const canonicalExplicitResolver = entry.includes("import SuccessionArchiveApp from './SuccessionArchiveApp';")
  && entry.includes('return <SuccessionArchiveApp {...props} />;');
assert(canonicalReexport || canonicalExplicitResolver, 'archive entry must resolve and render the canonical app module');
assert(app.includes('princes.find((record) => record.princeOrder === Number(order))'), 'family-tree navigation must compare the candidate record');
assert(!app.includes('princes.find((record) => entity.princeOrder'), 'family-tree callback must not reference its result variable during initialization');

const componentFiles = await readdir(path.join(root, 'src/components/succession'));
const moduleVariants = new Map();
for (const file of componentFiles.filter((name) => /\.(?:js|jsx)$/.test(name))) {
  const basename = file.replace(/\.(?:js|jsx)$/, '');
  const variants = moduleVariants.get(basename) || [];
  variants.push(file);
  moduleVariants.set(basename, variants);
}
const ambiguousModules = [...moduleVariants.entries()].filter(([, variants]) => variants.length > 1);
assert(!ambiguousModules.length, `extensionless module resolution is ambiguous for: ${ambiguousModules.map(([name, variants]) => `${name} (${variants.join(', ')})`).join('; ')}`);

assert(cssAudit.includes('const normalizeSelector'), 'CSS ownership audit must canonicalize equivalent selectors');
assert(cssAudit.includes('combinator whitespace as equivalent'), 'CSS ownership audit must self-test combinator normalization');
assert(normalizeSelector('.x article > span') === normalizeSelector('.x article>span'), 'stabilization selector normalization must ignore combinator spacing');

const readabilityOverrides = new Set(
  collectRules(contrast)
    .filter((rule) => rule.body.includes('!important') && fontSizesFor(rule.body).some((size) => size >= 11))
    .map((rule) => rule.selector),
);
const batch4TinyRules = [
  ...collectRules(chapterCss).map((rule) => ({ ...rule, source: 'SuccessionArchiveChapterStoryWorkspace.css' })),
  ...collectRules(storyCss).map((rule) => ({ ...rule, source: 'SuccessionArchiveStoryIntelligenceWorkspace.css' })),
].filter((rule) => fontSizesFor(rule.body).some((size) => size > 0 && size < 11));
const missingOverrides = batch4TinyRules.filter((rule) => !readabilityOverrides.has(rule.selector));
assert(!missingOverrides.length, `Batch 4 sub-11px selectors lack equivalent route-owned overrides: ${missingOverrides.map((rule) => `${rule.source} · ${rule.selector}`).join('; ')}`);

console.log(`Succession stabilization audit passed: canonical app module is unambiguous, family-tree navigation is self-reference-free, CSS selector matching is whitespace-insensitive, and ${batch4TinyRules.length} Batch 4 readability exceptions have equivalent route-owned overrides.`);
