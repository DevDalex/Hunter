import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';
import { referenceAliases, referencePages } from '../src/data/routeManifest.js';
import { parseCleanRoute } from '../src/lib/appRouter.js';
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
const nenMap = await readFile(path.resolve('src/components/NenSystemExpansionMap.jsx'), 'utf8');
const nenExpansionData = await readFile(path.resolve('src/data/nenSpectrumExpansion.js'), 'utf8');
const nenExpansionCss = await readFile(path.resolve('src/nen-spectrum-expansion.css'), 'utf8');
const nenShell = await readFile(path.resolve('src/nen-map-shell.css'), 'utf8');
const atlas = await readFile(path.resolve('src/components/WorldAtlas.jsx'), 'utf8');
const organizations = await readFile(path.resolve('src/components/OrganizationArchive.jsx'), 'utf8');
const conflicts = await readFile(path.resolve('src/components/ConflictArchive.jsx'), 'utf8');
const panel = await readFile(path.resolve('src/components/ReferenceBackbonePanel.jsx'), 'utf8');

assert(nen.includes('NenSystemExpansionMap') && nen.includes('nenRecords'), 'Nen route must retain canonical records while rendering the expanded system map');
assert(!nen.includes('NenPrincipleMap') && !nen.includes('nen-browser'), 'retired Nen workbench and directory must not return');
assert(nenMap.includes('nen-pipe-connectors') && nenMap.includes('nen-pipe-inspector') && nenMap.includes('zoomAt') && nenMap.includes('fitAll'), 'Nen system map must preserve pipes, inspector, pan, and zoom interaction');
assert(nenMap.includes('expandedCategoryKey') && nenMap.includes('PlacementMarker') && nenMap.includes('named-ability'), 'Nen map must preserve category focus, exact placement markers, and named-ability expansion');
assert(nenMap.includes('data-qa-pan-zoom-canvas="true"') && nenMap.includes('data-qa-scaled-canvas="true"'), 'Nen map must declare its intentional scaled-canvas QA contract');
assert(nenExpansionData.includes('spectrumPlacements') && nenExpansionData.includes('namedAbilityProfiles') && nenExpansionData.includes('supportingCategories'), 'Nen expansion data must retain placements and ability-category metadata');
assert(nenExpansionCss.includes('clip-path: polygon') && nenExpansionCss.includes('.nen-placement-marker') && nenExpansionCss.includes('.is-named-ability'), 'Nen expansion styling must preserve hexagonal categories, placement markers, and named-ability cards');
assert(nenShell.includes('.page-intro') && nenShell.includes('.workspace-nav') && nenShell.includes('.reference-backbone') && nenShell.includes('display:none'), 'Nen map-only shell must remove the legacy reference wrappers');
assert(atlas.includes('ReferenceBackbonePanel') && atlas.includes('domain="world"'), 'World Atlas must surface the reference backbone');
assert(organizations.includes('ReferenceBackbonePanel') && organizations.includes('domain="organizations"'), 'Organization archive must surface the reference backbone');
assert(conflicts.includes('ReferenceBackbonePanel') && conflicts.includes('domain="conflicts"'), 'Conflict archive must surface the reference backbone');
assert(panel.includes('referenceBackbonePrototype') && panel.includes('reference-backbone__records') && panel.includes('reference-backbone__sources'), 'ReferenceBackbonePanel must render records and sources from canonical data');

assert(!referencePages.some((page) => page.id === 'notebook'), 'the Notebook navigation button must remain removed from the Reference workspace');
assert(!Object.values(referenceAliases).some((alias) => alias.target === 'notebook'), 'no legacy Reference alias may reopen Notebook');
const retiredNotebook = parseCleanRoute('/notebook', '');
assert(retiredNotebook.view === 'not-found' && retiredNotebook.params.attemptedPath === '/notebook', 'the retired /notebook URL must resolve to the not-found route');
assert(!app.includes('StudyNotebook') && !app.includes("referencePage.id === 'notebook'"), 'the application shell must not render the retired Notebook component');
let notebookComponentExists = true;
try { await access(path.resolve('src/components/StudyNotebook.jsx')); } catch { notebookComponentExists = false; }
assert(!notebookComponentExists, 'src/components/StudyNotebook.jsx must remain deleted');

await access(path.resolve('src/components/ReferenceBackbonePanel.css'));
await access(path.resolve('src/data/referenceBackbonePrototype.js'));
await access(path.resolve('docs/REFERENCE-BACKBONE.md'));

console.log(`Reference backbone audit passed: ${referenceBackboneStats.domains} domains, ${referenceBackboneStats.lanes} lanes, ${referenceBackboneStats.records} records, ${referenceBackboneStats.chimeraBridgeItems} Chimera bridge items, ${referenceBackboneStats.sources} approved sources, the expanded full-page Nen pipe map is enforced, and the retired /notebook route remains absent.`);
