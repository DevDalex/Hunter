import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const successionRoot = path.join(root, 'src/components/succession');

const walk = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
};

const relative = (absolute) => path.relative(root, absolute).replaceAll('\\', '/');
const countMatches = (source, pattern) => [...source.matchAll(pattern)].length;
const uniqueMatches = (source, pattern, group = 1) => [...new Set([...source.matchAll(pattern)].map((match) => match[group]))];

const files = await walk(successionRoot);
const cssFiles = files.filter((file) => file.endsWith('.css'));
const jsxFiles = files.filter((file) => file.endsWith('.jsx'));

const cssRecords = [];
for (const file of cssFiles) {
  const source = await readFile(file, 'utf8');
  cssRecords.push({
    file: relative(file),
    lines: source.split(/\r?\n/).length,
    important: countMatches(source, /!important\b/g),
    rawHexColors: uniqueMatches(source, /#([0-9a-fA-F]{3,8})\b/g, 0).length,
    rgbaColors: uniqueMatches(source, /rgba?\([^)]*\)/g, 0).length,
    gradients: countMatches(source, /(?:linear|radial|conic)-gradient\(/g),
    shadows: countMatches(source, /(?:box|text)-shadow\s*:/g),
    mediaQueries: countMatches(source, /@media\b/g),
    reducedMotion: source.includes('prefers-reduced-motion'),
    tinyTextDeclarations: countMatches(source, /font-size\s*:\s*(?:[0-9](?:\.[0-9]+)?|10(?:\.[0-9]+)?)px\b/g),
    customProperties: uniqueMatches(source, /(--[a-zA-Z0-9-_]+)\s*:/g),
  });
}

const jsxRecords = [];
for (const file of jsxFiles) {
  const source = await readFile(file, 'utf8');
  jsxRecords.push({
    file: relative(file),
    lines: source.split(/\r?\n/).length,
    cssImports: uniqueMatches(source, /import\s+['"](\.\/[^'"]+\.css)['"]/g),
    classNames: uniqueMatches(source, /className=(?:"([^"]+)"|'([^']+)'|\{[^}]*['"]([^'"]+)['"][^}]*\})/g)
      .flatMap((value) => String(value || '').split(/\s+/))
      .filter((value) => value.startsWith('succession-')),
    inlineStyleUses: countMatches(source, /style=\{/g),
    buttons: countMatches(source, /<button\b/g),
    links: countMatches(source, /<a\b/g),
  });
}

const totals = {
  cssFiles: cssRecords.length,
  jsxFiles: jsxRecords.length,
  cssLines: cssRecords.reduce((sum, record) => sum + record.lines, 0),
  jsxLines: jsxRecords.reduce((sum, record) => sum + record.lines, 0),
  importantDeclarations: cssRecords.reduce((sum, record) => sum + record.important, 0),
  rawHexColors: cssRecords.reduce((sum, record) => sum + record.rawHexColors, 0),
  gradients: cssRecords.reduce((sum, record) => sum + record.gradients, 0),
  shadows: cssRecords.reduce((sum, record) => sum + record.shadows, 0),
  tinyTextDeclarations: cssRecords.reduce((sum, record) => sum + record.tinyTextDeclarations, 0),
  inlineStyleUses: jsxRecords.reduce((sum, record) => sum + record.inlineStyleUses, 0),
};

const highest = (field, limit = 12) => [...cssRecords]
  .filter((record) => record[field] > 0)
  .sort((left, right) => right[field] - left[field])
  .slice(0, limit);

console.log('# Succession visual inventory');
console.log('');
console.log(`Generated from \`${relative(successionRoot)}\`.`);
console.log('');
console.log('## Totals');
console.log('');
for (const [label, value] of Object.entries(totals)) console.log(`- **${label}:** ${value}`);

console.log('');
console.log('## Highest !important ownership');
console.log('');
for (const record of highest('important')) console.log(`- \`${record.file}\`: ${record.important}`);

console.log('');
console.log('## Highest raw color ownership');
console.log('');
for (const record of highest('rawHexColors')) console.log(`- \`${record.file}\`: ${record.rawHexColors} unique hex values`);

console.log('');
console.log('## Legacy tiny-text declarations');
console.log('');
for (const record of highest('tinyTextDeclarations')) console.log(`- \`${record.file}\`: ${record.tinyTextDeclarations}`);

console.log('');
console.log('## CSS import ownership');
console.log('');
for (const record of jsxRecords.filter((record) => record.cssImports.length)) {
  console.log(`- \`${record.file}\`: ${record.cssImports.map((item) => `\`${item}\``).join(', ')}`);
}

console.log('');
console.log('## Migration guidance');
console.log('');
console.log('- Treat high `!important` counts as compatibility debt, not as an invitation to add stronger selectors.');
console.log('- Replace repeated raw colors with the scoped `--succession-*` semantic token families during the assigned workspace batch.');
console.log('- Do not delete a compatibility stylesheet until its owning workspace passes desktop, mobile, accessibility, and runtime regression checks.');
console.log('- Keep the foundation preview hidden from public routing until the redesign is ready for final closure.');
