import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';

const roots = ['public', 'src/assets'].filter(existsSync);
const supported = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg']);
const files = [];
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (supported.has(extname(path).toLowerCase())) files.push(path);
  }
};
for (const root of roots) walk(root);

const manifest = files.map((path) => {
  const bytes = readFileSync(path);
  const source = relative(process.cwd(), path).replaceAll('\\', '/');
  const extension = extname(path).slice(1).toLowerCase();
  const stem = source.slice(0, -extname(source).length);
  const derivatives = ['avif', 'webp'].filter((format) => format !== extension).map((format) => `${stem}.${format}`);
  return {
    source,
    bytes: bytes.length,
    hash: createHash('sha256').update(bytes).digest('hex').slice(0, 20),
    format: extension,
    derivatives,
    hasModernSource: extension === 'avif' || extension === 'webp',
  };
}).sort((left, right) => left.source.localeCompare(right.source));

const output = 'src/data/generated/mediaManifest.generated.json';
mkdirSync(dirname(output), { recursive: true });
const content = `${JSON.stringify({ generatedAt: new Date().toISOString(), roots, total: manifest.length, assets: manifest }, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (!existsSync(output)) throw new Error(`Missing generated media manifest: ${output}`);
  const current = JSON.parse(readFileSync(output, 'utf8'));
  const comparable = { ...JSON.parse(content), generatedAt: current.generatedAt };
  if (JSON.stringify(current) !== JSON.stringify(comparable)) throw new Error('Media manifest is stale. Run npm run media:manifest.');
  console.log(`Media manifest is current with ${manifest.length} assets.`);
} else {
  writeFileSync(output, content);
  console.log(`Generated ${output} with ${manifest.length} assets.`);
}
