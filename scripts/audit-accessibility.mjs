import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const walk = async (directory) => {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(target));
    else if (/\.(?:js|jsx|ts|tsx)$/.test(entry.name)) output.push(target);
  }
  return output;
};

const indexHtml = await readFile(path.join(root, 'index.html'), 'utf8');
if (!/<html\b[^>]*\blang\s*=\s*['"][^'"]+['"]/i.test(indexHtml)) {
  failures.push('index.html must declare a document language');
}

const sourceFiles = await walk(path.join(root, 'src'));
for (const filename of sourceFiles) {
  const source = await readFile(filename, 'utf8');
  const relative = path.relative(root, filename).replaceAll('\\', '/');
  if (/\btabIndex\s*=\s*\{\s*[1-9]\d*\s*\}/.test(source) || /\btabindex\s*=\s*['"][1-9]\d*['"]/i.test(source)) {
    failures.push(`${relative} uses a positive tabindex, which overrides natural keyboard order`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`Accessibility audit failed: ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Accessibility audit passed: document language and keyboard tab order checked across ${sourceFiles.length} source files.`);
}
