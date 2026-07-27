import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  chimeraAntEndgameSystems,
  chimeraAntEndgameSystemById,
} from '../src/data/chimeraAntEndgameSystems.js';
import { chimeraAntPhaseScaffoldById } from '../src/data/chimeraAntPhaseScaffold.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chimera Ant Batch 8 audit failed: ${message}`);
};

const readProjectFile = (relativePath) => readFileSync(
  fileURLToPath(new URL(`../${relativePath}`, import.meta.url)),
  'utf8',
);

const hunterpediaSource = (href) => href?.startsWith('https://hunterxhunter.fandom.com/wiki/');
const unique = (values, label) => {
  assert(new Set(values).size === values.length, `${label} values must be unique`);
};

assert(Object.keys(chimeraAntEndgameSystems).join(',') === 'two-endgames,poison-memory-homecoming', 'system order or ids drifted');
assert(chimeraAntEndgameSystemById.size === 2, `expected 2 endgame systems, found ${chimeraAntEndgameSystemById.size}`);

const mirrored = chimeraAntEndgameSystemById.get('two-endgames');
assert(mirrored.endgames.length === 2, `expected 2 mirrored endgames, found ${mirrored.endgames.length}`);
assert(mirrored.endgames.map((record) => record.id).join(',') === 'netero-meruem,gon-pitou', 'mirrored endgame ids or order drifted');
assert(mirrored.endgames.map((record) => record.episodes).join(',') === '122–126,127–131', 'mirrored endgame episode boundaries drifted');
assert(mirrored.comparisonRows.length === 6, `expected 6 comparison rows, found ${mirrored.comparisonRows.length}`);
unique(mirrored.comparisonRows.map((row) => row.label), 'comparison labels');

for (const endgame of mirrored.endgames) {
  assert(endgame.sequence.length === 4, `${endgame.id} must contain 4 sequence records`);
  assert(endgame.portraits.length === 2, `${endgame.id} must contain 2 portrait records`);
  assert(Object.keys(endgame.dossier).join(',') === 'objective,weapon,decision,cost,result,aftermath', `${endgame.id} dossier contract drifted`);
  unique(endgame.sequence.map((record) => record.index), `${endgame.id} sequence indexes`);
  for (const record of endgame.sequence) assert(hunterpediaSource(record.sourceHref), `${endgame.id}/${record.index} has an unsupported source`);
  for (const portrait of endgame.portraits) {
    assert(portrait.image.startsWith('/media/portraits/'), `${endgame.id}/${portrait.name} must use a local portrait`);
    assert(hunterpediaSource(portrait.sourceHref), `${endgame.id}/${portrait.name} portrait source is unsupported`);
  }
}

const aftermath = chimeraAntEndgameSystemById.get('poison-memory-homecoming');
assert(aftermath.progression.length === 4, `expected 4 poison/memory records, found ${aftermath.progression.length}`);
assert(aftermath.progression.map((record) => record.episodes).join(',') === '132,133,134,135', 'poison/memory episode order drifted');
assert(aftermath.finalGame.beats.length === 4, `expected 4 final Gungi beats, found ${aftermath.finalGame.beats.length}`);
assert(aftermath.survivorRoutes.length === 4, `expected 4 survivor routes, found ${aftermath.survivorRoutes.length}`);
unique(aftermath.survivorRoutes.map((route) => route.id), 'survivor route ids');

for (const record of aftermath.progression) assert(hunterpediaSource(record.sourceHref), `progression ${record.index} has an unsupported source`);
for (const route of aftermath.survivorRoutes) assert(hunterpediaSource(route.sourceHref), `route ${route.id} has an unsupported source`);
assert(hunterpediaSource(aftermath.finalGame.sourceHref), 'final Gungi source is unsupported');
assert(aftermath.finalGame.note.includes('not a reconstruction'), 'abstract Gungi provenance boundary is missing');

for (const phaseId of ['two-endgames', 'poison-memory-homecoming']) {
  const phase = chimeraAntPhaseScaffoldById.get(phaseId);
  assert(phase, `${phaseId} scaffold is missing`);
  assert(phase.media.image.startsWith('/media/portraits/'), `${phaseId} scaffold must use a local image`);
  assert(hunterpediaSource(phase.media.sourceHref), `${phaseId} scaffold source is unsupported`);
}

const archiveSource = readProjectFile('src/components/ChimeraAntPhaseArchive.jsx');
const componentSource = readProjectFile('src/components/ChimeraAntEndgameSystems.jsx');
const cssSource = readProjectFile('src/components/ChimeraAntEndgameSystems.css');

assert(archiveSource.includes("import ChimeraAntEndgameSystems from './ChimeraAntEndgameSystems';"), 'phase archive does not import Batch 8 systems');
assert(archiveSource.includes('<ChimeraAntEndgameSystems phaseId={phase.id} fallbackArtwork={fallbackArtwork} />'), 'phase archive does not render Batch 8 systems');
assert(archiveSource.includes("'two-endgames'"), 'Phase VI is not marked complete');
assert(archiveSource.includes("'poison-memory-homecoming'"), 'Phase VII is not marked complete');
assert(componentSource.includes('Array.from({ length: 81 }'), 'abstract 9×9 Gungi motif is missing');
assert(componentSource.includes('role="table"'), 'mirrored comparison table semantics are missing');
assert(componentSource.includes('Survivor destinations'), 'survivor destination system is missing');

const mediaQueries = [...cssSource.matchAll(/@media\s*\(([^)]+)\)/g)].map((match) => match[1]);
assert(mediaQueries.every((query) => query.includes('prefers-reduced-motion')), `unexpected responsive media query found: ${mediaQueries.join(', ')}`);
assert(!/@media\s*\(\s*(?:max|min)-width/i.test(cssSource), 'Batch 8 stylesheet contains a mobile-specific width media query');
assert(cssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'mirrored two-column desktop field is missing');
assert(cssSource.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'), 'four-route desktop field is missing');

console.log('Chimera Ant Batch 8 audit passed: 2 mirrored endgames, 8 endgame sequence records, 6 comparison rows, 4 poison/memory records, 4 final Gungi beats, and 4 survivor routes.');
