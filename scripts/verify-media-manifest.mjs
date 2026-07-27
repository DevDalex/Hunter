import { access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { mediaManifest } from '../src/media/mediaManifest.js';

const root = process.cwd();
const failures = [];
const expectedSharpFormat = new Map([
  ['avif', 'heif'],
  ['jpeg', 'jpeg'],
  ['png', 'png'],
  ['webp', 'webp'],
]);

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
      continue;
    }

    const outputPath = path.resolve(root, variant.outputPath);
    try {
      await access(outputPath);
      const metadata = await sharp(outputPath).metadata();
      if (metadata.width !== variant.width || metadata.height !== variant.height) {
        failures.push(
          `${record.id}:${variantName}: expected ${variant.width}×${variant.height}, received ${metadata.width}×${metadata.height}.`,
        );
      }
      const expectedFormat = expectedSharpFormat.get(variant.format);
      if (expectedFormat && metadata.format !== expectedFormat) {
        failures.push(`${record.id}:${variantName}: expected ${variant.format}, received ${metadata.format || 'unknown'}.`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${record.id}:${variantName}: cannot read generated output ${variant.outputPath} (${message}).`);
    }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`Media manifest verification failed with ${failures.length} issue(s).`);
}

const variantCount = mediaManifest.records.reduce((total, record) => total + Object.keys(record.variants).length, 0);
console.log(
  `Media manifest verified: ${mediaManifest.records.length} record(s), ${variantCount} generated variant(s), no invalid sources or outputs.`,
);
