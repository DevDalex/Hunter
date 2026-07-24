#!/usr/bin/env node

import { readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { parseGeneratedManifest } from '../server/chapter-admin.js';

const QUEUE_PATH = '.github/chapter-import-batch.json';
const MANIFEST_PATH = 'src/data/successionChapterMedia.generated.js';
const AVAILABILITY_PATH = 'src/data/successionChapterAvailability.generated.js';
const CHAPTER_ROOT = 'public/media/succession-contest/chapters';
const MIN_CHAPTER = 338;
const MAX_CHAPTER = 9999;
const MIN_PAGES = 8;
const MAX_PAGES = 40;

const writeOutput = (name, value) => {
  if (!process.env.GITHUB_OUTPUT) return;
  const line = `${name}=${String(value).replace(/\r?\n/g, ' ')}\n`;
  return import('node:fs').then(({ appendFileSync }) => appendFileSync(process.env.GITHUB_OUTPUT, line));
};

const uniqueChapters = (values) => [...new Set((Array.isArray(values) ? values : [])
  .map((value) => Number.parseInt(value, 10))
  .filter((value) => Number.isInteger(value) && value >= MIN_CHAPTER && value <= MAX_CHAPTER))];

const compactError = (result) => {
  const text = `${result.stderr || ''}\n${result.stdout || ''}`.trim();
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.slice(-4).join(' | ').slice(0, 1000) || `Importer exited with code ${result.status ?? 'unknown'}.`;
};

const queue = JSON.parse(await readFile(QUEUE_PATH, 'utf8'));
if (queue.version !== 1) throw new Error(`Unsupported chapter batch queue version: ${queue.version}`);
if (!String(queue.sourceTemplate || '').includes('{chapter}')) throw new Error('Queue sourceTemplate must include {chapter}.');

const manifestText = await readFile(MANIFEST_PATH, 'utf8');
const manifest = parseGeneratedManifest(manifestText);
const existing = new Set(Object.keys(manifest).map(Number));
const completed = new Set([...uniqueChapters(queue.completed), ...existing]);
const failed = queue.failed && typeof queue.failed === 'object' ? { ...queue.failed } : {};
const attempts = queue.attempts && typeof queue.attempts === 'object' ? { ...queue.attempts } : {};
let pending = uniqueChapters(queue.pending).filter((chapter) => !completed.has(chapter) && !failed[String(chapter)]);

const batchSize = Math.min(5, Math.max(1, Number.parseInt(queue.batchSize, 10) || 2));
const maxAttempts = Math.min(5, Math.max(1, Number.parseInt(queue.maxAttempts, 10) || 3));
const selected = pending.splice(0, batchSize);
const succeeded = [];
const retried = [];
const newlyFailed = [];

for (const chapter of selected) {
  const sourceUrl = String(queue.sourceTemplate).replaceAll('{chapter}', String(chapter));
  const [beforeManifest, beforeAvailability] = await Promise.all([
    readFile(MANIFEST_PATH, 'utf8'),
    readFile(AVAILABILITY_PATH, 'utf8'),
  ]);
  const chapterDirectory = `${CHAPTER_ROOT}/${chapter}`;
  console.log(`\n=== Automatic import: Chapter ${chapter} ===`);

  const result = spawnSync(process.execPath, [
    'scripts/import-succession-chapter-url.mjs',
    sourceUrl,
    String(chapter),
    '--confirm',
  ], {
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  let error = '';
  if (result.status === 0) {
    try {
      const updatedManifest = parseGeneratedManifest(await readFile(MANIFEST_PATH, 'utf8'));
      const pageCount = updatedManifest[String(chapter)]?.length || updatedManifest[chapter]?.length || 0;
      if (pageCount < MIN_PAGES || pageCount > MAX_PAGES) {
        throw new Error(`Detected ${pageCount} pages; automatic imports require ${MIN_PAGES}-${MAX_PAGES} pages.`);
      }
      succeeded.push(chapter);
      completed.add(chapter);
      delete attempts[String(chapter)];
      delete failed[String(chapter)];
      console.log(`Chapter ${chapter} accepted with ${pageCount} pages.`);
      continue;
    } catch (validationError) {
      error = validationError.message;
    }
  } else {
    error = compactError(result);
  }

  await Promise.all([
    writeFile(MANIFEST_PATH, beforeManifest),
    writeFile(AVAILABILITY_PATH, beforeAvailability),
    rm(chapterDirectory, { recursive: true, force: true }),
  ]);

  const key = String(chapter);
  const nextAttempt = (Number.parseInt(attempts[key], 10) || 0) + 1;
  attempts[key] = nextAttempt;
  if (nextAttempt < maxAttempts) {
    pending.push(chapter);
    retried.push(chapter);
    console.error(`Chapter ${chapter} will retry (${nextAttempt}/${maxAttempts}): ${error}`);
  } else {
    failed[key] = {
      attempts: nextAttempt,
      error,
      failedAt: new Date().toISOString(),
      sourceUrl,
    };
    newlyFailed.push(chapter);
    console.error(`Chapter ${chapter} moved to manual review after ${nextAttempt} attempts: ${error}`);
  }
}

queue.pending = uniqueChapters(pending).filter((chapter) => !completed.has(chapter) && !failed[String(chapter)]);
queue.completed = [...completed].sort((a, b) => a - b);
queue.attempts = attempts;
queue.failed = failed;
queue.lastRun = {
  at: new Date().toISOString(),
  selected,
  succeeded,
  retried,
  failed: newlyFailed,
};
queue.status = queue.pending.length ? 'running' : Object.keys(failed).length ? 'completed-with-failures' : 'completed';

await writeFile(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
await writeOutput('selected', selected.join(','));
await writeOutput('succeeded', succeeded.join(','));
await writeOutput('retried', retried.join(','));
await writeOutput('newly_failed', newlyFailed.join(','));
await writeOutput('remaining', queue.pending.length);
await writeOutput('failed_total', Object.keys(failed).length);
await writeOutput('continue', queue.pending.length > 0 ? 'true' : 'false');

console.log(`\nBatch finished. ${succeeded.length} succeeded, ${retried.length} queued for retry, ${newlyFailed.length} moved to manual review, ${queue.pending.length} pending.`);
