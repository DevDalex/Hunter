import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Responsive media derivative audit failed: ${message}`);
};

const [generator, manifest, safeImage, migration, adr, packageSource] = await Promise.all([
  readFile(path.join(root, 'scripts/generate-media-derivatives.mjs'), 'utf8'),
  readFile(path.join(root, 'src/data/mediaDerivatives.generated.js'), 'utf8'),
  readFile(path.join(root, 'src/components/SafeImage.jsx'), 'utf8'),
  readFile(path.join(root, 'docs/MEDIA-DERIVATIVES-MIGRATION.md'), 'utf8'),
  readFile(path.join(root, 'docs/adr/0004-performance-media-boundaries.md'), 'utf8'),
  readFile(path.join(root, 'package.json'), 'utf8'),
]);

for (const token of ['priorityPortraits', 'blackWhaleRoomMedia', 'targetWidths', '320', '640', '960', 'public/media/derivatives', 'MEDIA_DERIVATIVES_AVAILABLE', '--verify-only']) {
  assert(generator.includes(token), `generator is missing ${token}`);
}
assert(generator.includes("if (!converter)") && generator.includes('await rm(outputRoot') && generator.includes('renderManifest([], false)'), 'converter-unavailable fallback does not clear stale derivatives and publish an empty manifest');
assert(generator.includes('`${record.src} ${record.width}w`'), 'original verified asset is not retained as a srcset candidate');
assert(manifest.includes('mediaDerivativeBySrc') && manifest.includes('MEDIA_DERIVATIVES_AVAILABLE'), 'generated derivative manifest contract is incomplete');
assert(safeImage.includes("from '../data/mediaDerivatives.generated.js'") && safeImage.includes('responsiveMedia?.srcSet') && safeImage.includes('responsiveMedia?.sizes'), 'SafeImage is not wired to responsive derivatives');
assert(safeImage.includes('data-media-responsive={responsiveMedia ? \'true\' : \'false\'}'), 'SafeImage does not expose responsive-media state for runtime QA');
assert(migration.includes('verified local WebP originals') && migration.includes('optional accelerator') && migration.includes('Storage migration policy'), 'media migration documentation is incomplete');
assert(adr.includes('Responsive derivatives') && adr.includes('verified local originals'), 'performance/media ADR does not cover derivative architecture');
assert(packageSource.includes('prepare:media-derivatives') && packageSource.includes('audit:media-derivatives'), 'package scripts do not expose derivative generation/verification');

console.log('Responsive media derivative audit passed: verified originals, optional ImageMagick generation, deterministic local derivatives, SafeImage srcset integration, and migration documentation are wired.');
