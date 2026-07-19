import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('.gap-report');
await build({
  configFile: false,
  logLevel: 'silent',
  build: {
    ssr: path.resolve('scripts/gap-report-entry.mjs'),
    outDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'report.mjs' } },
  },
});

try {
  const { gapReport } = await import(`${pathToFileURL(path.join(outDir, 'report.mjs')).href}?${Date.now()}`);
  const report = gapReport();
  const textOnlyByCategory = Object.fromEntries(report.media.coverage.map((record) => [record.label, record.textOnly]));
  console.log(JSON.stringify({
    chapterSpecific: report.chapters.chapterSpecific.length,
    phaseContext: report.chapters.phaseContext.length,
    mediaCoverage: report.media.coverage,
    textOnlyByCategory,
    textOnlyRecords: report.media.textOnly,
    verifiedRemoteRecords: report.media.verifiedRemote,
  }, null, 2));
} finally {
  await rm(outDir, { recursive: true, force: true });
}
