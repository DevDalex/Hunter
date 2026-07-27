import { access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { mediaManifest } from '../src/media/mediaManifest.js';

const root = process.cwd();
const failures = [];

for (const record of mediaManifest.records) {
  if (!record.sourcePath) continue;

  const sourcePath = path.resolve(root, record.sourcePath);
  try {
    await access(sourcePath);
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      failures.push(`${record.id}: source dimensions are unavailable.`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${record.id}: cannot read ${record.sourcePath} (${message}).`);
  }

  for (const [variantName, variant] of Object.entries(record.variants)) {
    if (!variant.outputPath.startsWith('public/media/generated/')) {
      failures.push(`${record.id}:${variantName}: generated output must stay under public/media/generated/.`);
    }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`Media manifest verification failed with ${failures.length} issue(s).`);
}

console.log(`Media manifest verified: ${mediaManifest.records.length} record(s), no invalid local sources or outputs.`);
