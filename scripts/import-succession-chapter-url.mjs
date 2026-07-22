#!/usr/bin/env node

import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  downloadChapterImages,
  inferChapterNumber,
  inspectChapterSource,
} from './lib/succession-chapter-url-source.mjs';

const READER_START = 339;
const READER_END = 414;
const ROOT = process.cwd();

const usage = () => console.log(`Usage:
  npm run import:succession-chapter:url -- <chapter-url> [chapter] [--replace] [--dry-run] [--confirm]

Examples:
  npm run import:succession-chapter:url -- https://3asq.online/manga/hunter-x-hunter/414/
  npm run import:succession-chapter:url -- https://3asq.online/manga/hunter-x-hunter/414/ 414 --replace --confirm

The command inspects the supplied chapter page, previews every detected image URL, asks for confirmation,
downloads the pages into a temporary directory, and runs the Chapter Bank importer.`);

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) { usage(); process.exit(0); }
const supportedFlags = new Set(['--replace', '--dry-run', '--confirm']);
const unknownFlags = args.filter((arg) => arg.startsWith('--') && !supportedFlags.has(arg));
if (unknownFlags.length) throw new Error(`Unknown option: ${unknownFlags.join(', ')}`);
const positional = args.filter((arg) => !arg.startsWith('--'));
if (positional.length < 1 || positional.length > 2) { usage(); process.exit(1); }

const sourceUrl = positional[0];
const replace = args.includes('--replace');
const dryRun = args.includes('--dry-run');
const confirmedByFlag = args.includes('--confirm');

console.log(`Inspecting ${sourceUrl} ...`);
const inspection = await inspectChapterSource(sourceUrl);
const chapter = Number.parseInt(positional[1] || inspection.inferredChapter || inferChapterNumber(sourceUrl), 10);
if (!Number.isInteger(chapter) || chapter < READER_START || chapter > READER_END) throw new Error(`Could not infer a valid Chapter Bank number. Supply a chapter from ${READER_START} through ${READER_END} as the second argument.`);

console.log(`\n${inspection.title || `Chapter ${chapter}`}`);
console.log(`Detected ${inspection.imageUrls.length} candidate page${inspection.imageUrls.length === 1 ? '' : 's'}:`);
inspection.imageUrls.forEach((url, index) => console.log(`  p.${index + 1}  ${url}`));
if (dryRun) { console.log('\nDry run complete. No images were downloaded and no repository files were changed.'); process.exit(0); }

let confirmed = confirmedByFlag;
if (!confirmed && process.stdin.isTTY) {
  const prompt = createInterface({ input, output });
  const answer = await prompt.question(`\nImport these ${inspection.imageUrls.length} pages as Chapter ${chapter}${replace ? ' and replace the existing chapter' : ''}? [y/N] `);
  prompt.close();
  confirmed = /^y(?:es)?$/i.test(answer.trim());
}
if (!confirmed) throw new Error('Import cancelled. Re-run interactively or pass --confirm after reviewing the detected page list.');

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), `hunter-chapter-${chapter}-`));
try {
  console.log(`\nDownloading Chapter ${chapter} pages ...`);
  await downloadChapterImages({
    imageUrls: inspection.imageUrls,
    sourceUrl: inspection.sourceUrl,
    destinationDirectory: temporaryDirectory,
    onProgress: (record, total) => console.log(`  p.${record.page}/${total}  ${record.filename}  ${Math.round(record.bytes / 1024)} KB`),
  });

  const importer = path.join(ROOT, 'scripts', 'import-succession-chapter.mjs');
  const importerArgs = [importer, String(chapter), temporaryDirectory, ...(replace ? ['--replace'] : [])];
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, importerArgs, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, SUCCESSION_CHAPTER_SOURCE_URL: inspection.sourceUrl } });
    child.once('error', reject);
    child.once('exit', (code) => resolve(code ?? 1));
  });
  if (exitCode !== 0) throw new Error(`The Chapter Bank importer exited with code ${exitCode}.`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log(`\nChapter ${chapter} is ready in the repository. Review the generated folder, bank manifest, and history before committing.`);
