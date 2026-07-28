import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import './verify-archive-records.mjs';
import { mediaManifest } from '../src/media/mediaManifest.js';
import { mediaManifestSchema } from '../src/schemas/archiveSchemas.js';

const root = process.cwd();
const validatedManifest = mediaManifestSchema.parse(mediaManifest);
const requestedConcurrency = Number.parseInt(process.env.MEDIA_BUILD_CONCURRENCY || '4', 10);
const workerCount = Math.max(1, Math.min(4, Number.isFinite(requestedConcurrency) ? requestedConcurrency : 4));

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

/**
 * @typedef {{
 *   key: string;
 *   recordId: string;
 *   variantName: string;
 *   sourcePath: string;
 *   outputPath: string;
 *   outputRelative: string;
 *   source: { width: number; height: number };
 *   focalPoint: { x: number; y: number };
 *   variant: { width: number; height: number; format: 'avif' | 'webp' | 'jpeg' | 'png'; quality: number };
 * }} MediaTask
 */

/** @type {MediaTask[]} */
const tasks = [];

for (const record of validatedManifest.records) {
  if (!record.sourcePath) continue;

  const sourcePath = path.resolve(root, record.sourcePath);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read dimensions for ${record.id}: ${record.sourcePath}`);
  }

  for (const [variantName, variant] of Object.entries(record.variants)) {
    tasks.push({
      key: `${record.id}:${variantName}`,
      recordId: record.id,
      variantName,
      sourcePath,
      outputPath: path.resolve(root, variant.outputPath),
      outputRelative: variant.outputPath,
      source: { width: metadata.width, height: metadata.height },
      focalPoint: record.focalPoint,
      variant,
    });
  }
}

/** @type {string[]} */
const completed = [];
let taskIndex = 0;

async function runWorker() {
  while (taskIndex < tasks.length) {
    const currentIndex = taskIndex;
    taskIndex += 1;
    const task = tasks[currentIndex];
    await mkdir(path.dirname(task.outputPath), { recursive: true });

    const crop = focalCrop(
      task.source,
      { width: task.variant.width, height: task.variant.height },
      task.focalPoint,
    );

    const pipeline = sharp(task.sourcePath)
      .extract(crop)
      .resize(task.variant.width, task.variant.height, { fit: 'fill' })
      .withMetadata({ orientation: undefined });

    await applyFormat(pipeline, task.variant.format, task.variant.quality).toFile(task.outputPath);
    completed.push(`Generated ${task.key} -> ${task.outputRelative}`);
  }
}

await Promise.all(Array.from({ length: Math.min(workerCount, tasks.length) }, () => runWorker()));
for (const message of completed.sort()) console.log(message);
console.log(`Media pipeline complete: ${completed.length} variants generated with ${workerCount} worker${workerCount === 1 ? '' : 's'}.`);
