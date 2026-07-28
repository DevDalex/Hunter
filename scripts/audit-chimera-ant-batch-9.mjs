import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  chimeraAntSupportingArchive,
  chimeraAntSupportingArchiveCounts,
} from '../src/data/chimeraAntSupportingArchive.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chimera Ant Batch 9 audit failed: ${message}`);
};

const readProjectFile = (relativePath) => readFileSync(
  fileURLToPath(new URL(`../${relativePath}`, import.meta.url)),
  'utf8',
);

const hunterpediaSource = (href) => href?.startsWith('https://hunterxhunter.fandom.com/wiki/');
const unique = (values, label) => {
  assert(new Set(values).size === values.length, `${label} must be unique`);
};
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

const expectedCounts = {
  characters: 8,
  factions: 5,
  locations: 6,
  nen: 8,
  conflicts: 7,
  objects: 6,
};

assert(Object.keys(chimeraAntSupportingArchive).join(',') === Object.keys(expectedCounts).join(','), 'archive collection order or ids drifted');

for (const [collection, expected] of Object.entries(expectedCounts)) {
  const records = chimeraAntSupportingArchive[collection];
  assert(Array.isArray(records), `${collection} must be an array`);
  assert(records.length === expected, `${collection} expected ${expected} records, found ${records.length}`);
  assert(chimeraAntSupportingArchiveCounts[collection] === expected, `${collection} count export drifted`);
  unique(records.map((record) => record.id), `${collection} ids`);
  for (const record of records) {
    assert(hunterpediaSource(record.sourceHref), `${collection}/${record.id} has unsupported source ${record.sourceHref}`);
  }
}

for (const character of chimeraAntSupportingArchive.characters) {
  for (const field of ['name', 'role', 'episodeRange', 'allegiance', 'objective', 'tacticalFunction', 'outcome']) {
    assert(nonEmpty(character[field]), `character ${character.id} is missing ${field}`);
  }
  assert(character.phases.length > 0, `character ${character.id} has no phase coverage`);
  assert(character.image === null || character.image.startsWith('/media/portraits/'), `character ${character.id} has unsupported image path`);
}
assert(chimeraAntSupportingArchive.characters.filter((record) => record.image).length === 7, 'expected seven local character portraits and one dossier token');

const supportedAlignments = new Set(['human', 'ant', 'hybrid', 'occupied']);
for (const faction of chimeraAntSupportingArchive.factions) {
  assert(supportedAlignments.has(faction.alignment), `faction ${faction.id} has unsupported alignment ${faction.alignment}`);
  for (const field of ['name', 'objective', 'leadership', 'method', 'fracture', 'outcome']) {
    assert(nonEmpty(faction[field]), `faction ${faction.id} is missing ${field}`);
  }
}

assert(chimeraAntSupportingArchive.locations.map((record) => record.order).join(',') === '01,02,03,04,05,06', 'location route order drifted');
for (const location of chimeraAntSupportingArchive.locations) {
  for (const field of ['name', 'episodes', 'role', 'movement', 'tacticalImpact', 'outcome']) {
    assert(nonEmpty(location[field]), `location ${location.id} is missing ${field}`);
  }
}

for (const ability of chimeraAntSupportingArchive.nen) {
  for (const field of ['ability', 'users', 'category', 'tacticalFunction', 'constraint', 'consequence']) {
    assert(nonEmpty(ability[field]), `Nen record ${ability.id} is missing ${field}`);
  }
  assert(ability.phases.length > 0, `Nen record ${ability.id} has no phase coverage`);
}

for (const conflict of chimeraAntSupportingArchive.conflicts) {
  for (const field of ['phase', 'episodes', 'title', 'participants', 'objective', 'disruption', 'cost', 'outcome']) {
    assert(nonEmpty(conflict[field]), `conflict ${conflict.id} is missing ${field}`);
  }
}

assert(chimeraAntSupportingArchive.objects.map((record) => record.number).join(',') === '01,02,03,04,05,06', 'object cabinet numbering drifted');
for (const object of chimeraAntSupportingArchive.objects) {
  for (const field of ['name', 'custodian', 'function', 'symbolicReading', 'consequence']) {
    assert(nonEmpty(object[field]), `object ${object.id} is missing ${field}`);
  }
  assert(object.phases.length > 0, `object ${object.id} has no phase coverage`);
}

const archiveSource = readProjectFile('src/components/ChimeraAntPhaseArchive.jsx');
const portalSource = readProjectFile('src/components/ChimeraAntSupportingArchivePortals.jsx');
const cssSource = readProjectFile('src/components/ChimeraAntSupportingArchive.css');
const packageSource = readProjectFile('package.json');

assert(archiveSource.includes("import ChimeraAntSupportingArchivePortals from './ChimeraAntSupportingArchivePortals';"), 'phase archive does not import the Batch 9 portal system');
assert(archiveSource.includes('<ChimeraAntSupportingArchivePortals />'), 'phase archive does not render the Batch 9 portal system');
assert(portalSource.includes("import { createPortal } from 'react-dom';"), 'supporting archives do not use React portals');
assert(portalSource.includes("'characters'\n  ,'factions'") === false, 'unexpected malformed target list');
for (const target of Object.keys(expectedCounts)) {
  assert(portalSource.includes(`'${target}'`), `portal target ${target} is missing`);
  assert(portalSource.includes(`data-supporting-archive=\"${target}\"`), `rendered archive marker ${target} is missing`);
}
assert(portalSource.includes('role="table"'), 'Nen tactical matrix table semantics are missing');
assert(portalSource.includes('Conflict and operation ledger'), 'conflict operation ledger is missing');
assert(portalSource.includes('Object and evidence cabinet'), 'object evidence cabinet is missing');

for (const legacySelector of [
  '[data-section-id="characters"] > .chimera-ant-character-ledger',
  '[data-section-id="factions"] > .chimera-ant-record-grid',
  '[data-section-id="locations"] > .chimera-ant-record-grid',
  '[data-section-id="nen"] > .chimera-ant-nen-ledger',
  '[data-section-id="conflicts"] > .chimera-ant-conflict-ledger',
  '[data-section-id="objects"] > .chimera-ant-record-grid',
]) {
  assert(cssSource.includes(legacySelector), `legacy replacement selector missing: ${legacySelector}`);
}

assert(cssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'two-column character command grid is missing');
assert(cssSource.includes('grid-template-columns: repeat(6, minmax(0, 1fr))'), 'six-stop location route is missing');
assert(cssSource.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'), 'four-stage conflict sequence is missing');
assert(cssSource.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'three-column object cabinet is missing');

const mediaQueries = [...cssSource.matchAll(/@media\s*\(([^)]+)\)/g)].map((match) => match[1]);
assert(mediaQueries.every((query) => query.includes('prefers-reduced-motion')), `unexpected responsive media query found: ${mediaQueries.join(', ')}`);
assert(packageSource.includes('"audit:chimera-ant-batch-9": "node scripts/audit-chimera-ant-batch-9.mjs"'), 'package audit command is missing');

console.log('Chimera Ant Batch 9 audit passed: 8 character dossiers, 5 factions, 6 locations, 8 Nen systems, 7 conflicts, and 6 objects.');
