import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const sourcePath = path.join(root,'scripts','succession-339-417-visibility-qa.mjs');
const generatedPath = path.join(root,'scripts','.succession-339-418-visibility-qa.generated.mjs');
let source = await readFile(sourcePath,'utf8');
source = source
  .replace(".succession-339-417-visibility-qa", ".succession-339-418-visibility-qa")
  .replace('const END = 417;', 'const END = 418;')
  .replaceAll('340-417','340-418')
  .replaceAll('Chapter 417','Chapter 418')
  .replaceAll('at Chapter 417','at Chapter 418')
  .replaceAll('through Chapter 417','through Chapter 418');
await mkdir(path.dirname(generatedPath),{ recursive:true });
await writeFile(generatedPath,source,'utf8');
try {
  await import(`${pathToFileURL(generatedPath).href}?v=${Date.now()}`);
} finally {
  await rm(generatedPath,{ force:true });
}
