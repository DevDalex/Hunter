import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('dist/client');
const pagesBase = '/Hunter';
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.txt', '.webmanifest', '.xml']);
const publicRoots = [
  '/media/',
  '/black-whale-cutaway.png',
  '/world-map-clean.webp',
  '/world-map-preview.webp',
  '/world-map-reference.png',
  '/implementation-notes.md',
  '/release-manifest.json',
  '/hxh-archive-phase-',
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }))).flat();
};

for (const file of await walk(outputDir)) {
  if (!textExtensions.has(path.extname(file))) continue;

  let content = await readFile(file, 'utf8');
  for (const root of publicRoots) {
    const pattern = new RegExp(`(["'(=,:\\s])${escapeRegExp(root)}`, 'g');
    content = content.replace(pattern, `$1${pagesBase}${root}`);
  }

  if (path.basename(file) === 'index.html') {
    content = content.replace(
      '</head>',
      '    <meta name="robots" content="noindex,nofollow,noarchive" />\n    <style id="personal-deploy-controls">.header-download-button{display:none!important}.site-footer nav button:last-child{display:none!important}</style>\n  </head>',
    );
  }

  await writeFile(file, content);
}

await writeFile(path.join(outputDir, '.nojekyll'), '');
await copyFile(path.join(outputDir, 'index.html'), path.join(outputDir, '404.html'));
console.log(`Prepared GitHub Pages output for ${pagesBase}/.`);
