import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Chapter 403 chunk-boundary audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archiveWrapper, archiveBoundary, dossierWrapper, dossierBoundary] = await Promise.all([
    vite.ssrLoadModule('/src/data/successionArchiveThrough403.js'),
    vite.ssrLoadModule('/src/data/successionArchiveBoundary403.js'),
    vite.ssrLoadModule('/src/data/successionDossierThrough403.js'),
    vite.ssrLoadModule('/src/data/successionDossierBoundary403.js'),
  ]);

  assert(Object.keys(archiveWrapper).sort().join('|') === Object.keys(archiveBoundary).sort().join('|'), 'archive compatibility wrapper changed the public export surface');
  assert(Object.keys(dossierWrapper).sort().join('|') === Object.keys(dossierBoundary).sort().join('|'), 'dossier compatibility wrapper changed the public export surface');
  assert(archiveWrapper.publicationBoundary403?.chapter === 403, 'archive wrapper lost the Chapter 403 publication boundary');
  assert(dossierWrapper.chapter403Research === dossierBoundary.chapter403Research, 'dossier wrapper does not expose the boundary payload identity');
  assert(dossierWrapper.successionAbilities.length === dossierBoundary.successionAbilities.length, 'dossier wrapper changed ability records');

  const [archiveWrapperSource, dossierWrapperSource, archive404Source, dossier404Source, viteConfig] = await Promise.all([
    readFile(path.join(root, 'src/data/successionArchiveThrough403.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionDossierThrough403.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionArchiveThrough404.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionDossierThrough404.js'), 'utf8'),
    readFile(path.join(root, 'vite.config.js'), 'utf8'),
  ]);

  assert(archiveWrapperSource.includes("export * from './successionArchiveBoundary403.js'"), 'archive Through403 path is not a thin boundary wrapper');
  assert(dossierWrapperSource.includes("export * from './successionDossierBoundary403.js'"), 'dossier Through403 path is not a thin boundary wrapper');
  assert(!archiveWrapperSource.includes('personnelTransitions =') && !dossierWrapperSource.includes('successionAbilities ='), 'large Chapter 403 payload remains inside the manual-chunk filenames');
  assert(archive404Source.includes("from './successionArchiveBoundary403.js'"), 'active Chapter 404 archive chain still enters through the manual-chunk Through403 wrapper');
  assert(!archive404Source.includes("from './successionArchiveThrough403.js'"), 'active Chapter 404 archive chain still imports the Through403 compatibility wrapper');
  assert(dossier404Source.includes("from './successionDossierBoundary403.js'"), 'active Chapter 404 dossier chain still enters through the manual-chunk Through403 wrapper');
  assert(!dossier404Source.includes("from './successionDossierThrough403.js'"), 'active Chapter 404 dossier chain still imports the Through403 compatibility wrapper');
  assert(viteConfig.includes('succession-chapter-403-halkenburg-possession-red-alert'), 'Chapter 403 manual chunk contract disappeared');
  assert(!viteConfig.includes('successionArchiveBoundary403') && !viteConfig.includes('successionDossierBoundary403'), 'new boundary payload filenames were accidentally added to the manual Chapter 403 chunk');

  console.log(`Succession Chapter 403 chunk-boundary audit passed: Through403 compatibility exports are unchanged, the live 404 chain bypasses those manual-chunk filenames, and ${Object.keys(archiveBoundary).length + Object.keys(dossierBoundary).length} exported bindings resolve through boundary payload modules outside the Chapter-403 matcher.`);
} finally {
  await vite.close();
}
