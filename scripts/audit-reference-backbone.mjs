import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';
import {
  referenceBackboneDomains,
  referenceBackbonePrototype,
  referenceBackboneSourceHosts,
  referenceBackboneStats,
} from '../src/data/referenceBackbonePrototype.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Reference backbone audit failed: ${message}`);
};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const unique = (values) => new Set(values).size === values.length;

const expectedDomains = ['nen', 'world', 'organizations', 'conflicts'];

assert(referenceBackbonePrototype.batch === 'Batch 8', 'reference backbone must remain Batch 8');
assert(referenceBackbonePrototype.title === 'Reference backbone', 'reference backbone title changed');
assert(same(referenceBackboneDomains.map((domain) => domain.id), expectedDomains), 'reference backbone domains must remain Nen, World, Organizations, and Conflicts in order');
assert(referenceBackboneStats.domains === 4, 'Batch 8 must cover four reference domains');
assert(referenceBackboneStats.lanes >= 16, 'each reference domain needs structured lanes');
assert(referenceBackboneStats.records >= 20, 'reference backbone needs enough prototype records');
assert(referenceBackboneStats.chimeraBridgeItems >= 20, 'Chimera Ant must remain the stress-test bridge across domains');
assert(referenceBackboneStats.sources >= 20, 'reference backbone source coverage is too shallow');
assert(unique(referenceBackboneDomains.flatMap((domain) => domain.records.map((record) => `${domain.id}:${record.name}`))), 'reference prototype records must be unique inside their domains');
assert(referenceBackboneSourceHosts.every(isApprovedSourceUrl), 'reference backbone sources must follow the approved Hunterpedia/Fandom policy');

for (const domain of referenceBackboneDomains) {
  assert(domain.eyebrow && domain.title && domain.deck && domain.accent, `${domain.id} needs complete identity metadata`);
  assert(domain.metrics.length >= 4, `${domain.id} needs at least four visible metrics`);
  assert(domain.lanes.length >= 4, `${domain.id} needs at least four structural lanes`);
  assert(domain.records.length >= 5, `${domain.id} needs at least five prototype records`);
  assert(domain.chimeraBridge.length >= 5, `${domain.id} needs a Chimera Ant bridge list`);
  assert(domain.nextActions.length >= 3, `${domain.id} needs next-action maintenance notes`);
  assert(domain.sources.length >= 5, `${domain.id} needs enough source links`);
}

const app = await readFile(path.resolve('src/App.jsx'), 'utf8');
const nen = await readFile(path.resolve('src/components/NenEncyclopedia.jsx'), 'utf8');
const atlas = await readFile(path.resolve('src/components/WorldAtlas.jsx'), 'utf8');
const organizations = await readFile(path.resolve('src/components/OrganizationArchive.jsx'), 'utf8');
const conflicts = await readFile(path.resolve('src/components/ConflictArchive.jsx'), 'utf8');
const panel = await readFile(path.resolve('src/components/ReferenceBackbonePanel.jsx'), 'utf8');

assert(app.includes('ReferenceBackbonePanel') && app.includes('domain="nen"'), 'Nen route must surface the reference backbone before the visual workbench');
assert(nen.includes('NenPrincipleMap') && nen.includes('nenRecords'), 'Nen workbench and record directory must remain intact after Batch 8');
assert(atlas.includes('ReferenceBackbonePanel') && atlas.includes('domain="world"'), 'World Atlas must surface the reference backbone');
assert(organizations.includes('ReferenceBackbonePanel') && organizations.includes('domain="organizations"'), 'Organization archive must surface the reference backbone');
assert(conflicts.includes('ReferenceBackbonePanel') && conflicts.includes('domain="conflicts"'), 'Conflict archive must surface the reference backbone');
assert(panel.includes('referenceBackbonePrototype') && panel.includes('reference-backbone__records') && panel.includes('reference-backbone__sources'), 'ReferenceBackbonePanel must render records and sources from canonical data');

await access(path.resolve('src/components/ReferenceBackbonePanel.css'));
await access(path.resolve('src/data/referenceBackbonePrototype.js'));
await access(path.resolve('docs/REFERENCE-BACKBONE.md'));

console.log(`Reference backbone audit passed: ${referenceBackboneStats.domains} domains, ${referenceBackboneStats.lanes} lanes, ${referenceBackboneStats.records} records, ${referenceBackboneStats.chimeraBridgeItems} Chimera bridge items, ${referenceBackboneStats.sources} approved sources.`);
