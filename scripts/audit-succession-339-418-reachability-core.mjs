import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const sourcePath = path.join(root,'scripts','audit-succession-339-417-reachability-core.mjs');
const generatedPath = path.join(root,'scripts','.audit-succession-339-418-reachability.generated.mjs');
let source = await readFile(sourcePath,'utf8');
source = source
  .replace(".succession-339-417-visibility-audit", ".succession-339-418-visibility-audit")
  .replace('const END = 417;', 'const END = 418;')
  .replaceAll('successionArchiveThrough417.js','successionArchiveThrough418.js')
  .replaceAll('successionDossierThrough417.js','successionDossierThrough418.js')
  .replaceAll('Through417','Through418')
  .replaceAll('through417','through418');
await mkdir(path.dirname(generatedPath),{ recursive:true });
await writeFile(generatedPath,source,'utf8');
try {
  await import(`${pathToFileURL(generatedPath).href}?v=${Date.now()}`);
} finally {
  await rm(generatedPath,{ force:true });
}
