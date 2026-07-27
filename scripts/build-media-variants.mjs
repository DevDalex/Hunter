import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import './verify-archive-records.mjs';
import { mediaManifest } from '../src/media/mediaManifest.js';
import { mediaManifestSchema } from '../src/schemas/archiveSchemas.js';

const root = process.cwd();
const validatedManifest = mediaManifestSchema.parse(mediaManifest);

/** @param {number} value @param {number} minimum @param {number} maximum */
const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

/**
 * @param {{ width: number; height: number }} source
 * @param {{ width: number; height: number }} target
 * @param {{ x: number; y: number }} focalPoint
 */
function focalCrop(source, target, focalPoint) {
  const sourceAspect = source.width / source.height;
  const targetAspect = target.width / target.height;

  if (sourceAspect > targetAspect) {
    const width = Math.max(1, Math.round(source.height * targetAspect));
    return {
      left: Math.round(clamp(focalPoint.x * source.width - width / 2, 0, source.width - width)),
      top: 0,
      width,
      height: source.height,
    };
  }

  const height = Math.max(1, Math.round(source.width / targetAspect));
  return {
    left: 0,
    top: Math.round(clamp(focalPoint.y * source.height - height / 2, 0, source.height - height)),
    width: source.width,
    height,
  };
}

/**
 * @param {import('sharp').Sharp} pipeline
 * @param {'avif' | 'webp' | 'jpeg' | 'png'} format
 * @param {number} quality
 */
function applyFormat(pipeline, format, quality) {
  if (format === 'avif') return pipeline.avif({ quality });
  if (format === 'webp') return pipeline.webp({ quality });
  if (format === 'jpeg') return pipeline.jpeg({ quality, mozjpeg: true });
  return pipeline.png({ quality, compressionLevel: 9 });
}

let generated = 0;

for (const record of validatedManifest.records) {
  if (!record.sourcePath) continue;

  const sourcePath = path.resolve(root, record.sourcePath);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read dimensions for ${record.id}: ${record.sourcePath}`);
  }

  for (const [variantName, variant] of Object.entries(record.variants)) {
    const outputPath = path.resolve(root, variant.outputPath);
    await mkdir(path.dirname(outputPath), { recursive: true });

    const crop = focalCrop(
      { width: metadata.width, height: metadata.height },
      { width: variant.width, height: variant.height },
      record.focalPoint,
    );

    const pipeline = sharp(sourcePath)
      .extract(crop)
      .resize(variant.width, variant.height, { fit: 'fill' })
      .withMetadata({ orientation: undefined });

    await applyFormat(pipeline, variant.format, variant.quality).toFile(outputPath);
    generated += 1;
    console.log(`Generated ${record.id}:${variantName} -> ${variant.outputPath}`);
  }
}

console.log(`Media pipeline complete: ${generated} variant${generated === 1 ? '' : 's'} generated.`);
