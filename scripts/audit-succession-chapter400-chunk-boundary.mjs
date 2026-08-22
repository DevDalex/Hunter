import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Chapter 400 chunk-boundary audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archiveWrapper, archiveBoundary, dossierWrapper, dossierBoundary] = await Promise.all([
    vite.ssrLoadModule('/src/data/successionArchiveThrough400.js'),
    vite.ssrLoadModule('/src/data/successionArchiveBoundary400.js'),
    vite.ssrLoadModule('/src/data/successionDossierThrough400.js'),
    vite.ssrLoadModule('/src/data/successionDossierBoundary400.js'),
  ]);

  assert(Object.keys(archiveWrapper).sort().join('|') === Object.keys(archiveBoundary).sort().join('|'), 'archive compatibility wrapper changed the public export surface');
  assert(Object.keys(dossierWrapper).sort().join('|') === Object.keys(dossierBoundary).sort().join('|'), 'dossier compatibility wrapper changed the public export surface');
  assert(archiveWrapper.publicationBoundary400?.chapter === 400, 'archive wrapper lost the Chapter 400 publication boundary');
  assert(dossierWrapper.chapter400Research === dossierBoundary.chapter400Research, 'dossier wrapper does not expose the boundary payload identity');
  assert(dossierWrapper.successionAbilities.length === dossierBoundary.successionAbilities.length, 'dossier wrapper changed ability records');

  const [archiveWrapperSource, dossierWrapperSource, archive401Source, dossier401Source, viteConfig] = await Promise.all([
    readFile(path.join(root, 'src/data/successionArchiveThrough400.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionDossierThrough400.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionArchiveThrough401.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionDossierThrough401.js'), 'utf8'),
    readFile(path.join(root, 'vite.config.js'), 'utf8'),
  ]);
  assert(archiveWrapperSource.includes("export * from './successionArchiveBoundary400.js'"), 'archive Through400 path is not a thin boundary wrapper');
  assert(dossierWrapperSource.includes("export * from './successionDossierBoundary400.js'"), 'dossier Through400 path is not a thin boundary wrapper');
  assert(!archiveWrapperSource.includes('personnelTransitions =') && !dossierWrapperSource.includes('successionAbilities ='), 'large Chapter 400 payload remains inside the manual-chunk filenames');
  assert(archive401Source.includes("from './successionArchiveBoundary400.js'"), 'active Chapter 401 archive chain still enters through the manual-chunk Through400 wrapper');
  assert(!archive401Source.includes("from './successionArchiveThrough400.js'"), 'active Chapter 401 archive chain still imports the Through400 compatibility wrapper');
  assert(dossier401Source.includes("from './successionDossierBoundary400.js'"), 'active Chapter 401 dossier chain still enters through the manual-chunk Through400 wrapper');
  assert(!dossier401Source.includes("from './successionDossierThrough400.js'"), 'active Chapter 401 dossier chain still imports the Through400 compatibility wrapper');
  assert(viteConfig.includes("succession-chapter-400-tier2-justice-fugetsu"), 'Chapter 400 manual chunk contract disappeared');
  assert(!viteConfig.includes('successionArchiveBoundary400') && !viteConfig.includes('successionDossierBoundary400'), 'new boundary payload filenames were accidentally added to the manual Chapter 400 chunk');

  console.log(`Succession Chapter 400 chunk-boundary audit passed: Through400 compatibility exports are unchanged, the live 401 chain bypasses those manual-chunk filenames, and ${Object.keys(archiveBoundary).length + Object.keys(dossierBoundary).length} exported bindings resolve through boundary payload modules outside the Chapter-400 matcher.`);
} finally {
  await vite.close();
}
