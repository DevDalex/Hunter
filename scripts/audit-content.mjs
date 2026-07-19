import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('.content-audit');
await build({
  configFile: false,
  logLevel: 'silent',
  build: {
    ssr: path.resolve('scripts/content-audit-entry.mjs'),
    outDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'audit.mjs' } },
  },
});

try {
  const { runAudit } = await import(`${pathToFileURL(path.join(outDir, 'audit.mjs')).href}?${Date.now()}`);
  const summary = runAudit();
  console.log(`Content audit passed: ${summary.passed}/${summary.total} checks; ${summary.locallyStructuredChapters}/${summary.chapterCatalogue} chapters locally structured; ${summary.detailedChapters} chapter-specific accounts; ${summary.phaseContextChapters} phase-context records; ${summary.localEntityMedia} local and ${summary.verifiedRemoteEntityMedia} verified-remote entity images.`);
} finally {
  await rm(outDir, { recursive: true, force: true });
}
