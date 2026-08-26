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
import {
  namedAbilityProfiles,
  nenCategoryOrder,
  nenExpansionCompletion,
  primaryCategoryUsers,
  secondaryPureUsers,
  spectrumPlacements,
} from '../src/data/nenSpectrumExpansion.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Reference backbone audit failed: ${message}`);
};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const unique = (values) => new Set(values).size === values.length;

const expectedDomains = ['nen', 'world', 'organizations', 'conflicts'];

assert(referenceBackbonePrototype.batch === 'Batch 8', 'reference backbone must remain Batch 8');
assert(referenceBackbonePrototype.title === 'Reference backbone', 'reference backbone title changed');
assert(same(referenceBackboneDomains.map((domain) => domain.id), expectedDomains), 'reference backbone data domains must remain Nen, World, Organizations, and Conflicts in order');
assert(referenceBackboneStats.domains === 4, 'Batch 8 must cover four reference data domains');
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

const categoryKeys = new Set(nenCategoryOrder);
const primaryUsers = Object.values(primaryCategoryUsers).flat();
const secondaryUsers = Object.values(secondaryPureUsers).flat();
const revealedUsers = [...primaryUsers, ...secondaryUsers];
const abilityIds = namedAbilityProfiles.map((profile) => profile.id);
const abilityUsers = new Set(namedAbilityProfiles.map((profile) => profile.user));
const abilityByUserAndName = new Set(namedAbilityProfiles.map((profile) => `${profile.user}::${profile.name}`));
const abilityKinds = new Set(['named', 'system', 'aptitude']);
const categoryUseStates = new Set(['confirmed', 'natural-type-only', 'partly-inferred', 'community-attributed']);

assert(nenExpansionCompletion.categories === 6, 'Nen completion must preserve all six categories');
assert(nenExpansionCompletion.primaryUsers === primaryUsers.length && primaryUsers.length >= 8, 'Nen completion primary-user count is stale');
assert(nenExpansionCompletion.secondaryUsers === secondaryUsers.length && secondaryUsers.length === 18, 'every category must expose exactly three secondary pure-type users');
assert(nenExpansionCompletion.placements === spectrumPlacements.length && spectrumPlacements.length >= 18, 'spectrum placement coverage is incomplete');
assert(nenExpansionCompletion.abilityProfiles === namedAbilityProfiles.length && namedAbilityProfiles.length >= 39, 'final Nen ability coverage is incomplete');
assert(unique(abilityIds), 'named ability profile IDs must be unique');
assert(unique(nenCategoryOrder), 'Nen category keys must be unique');

for (const categoryKey of nenCategoryOrder) {
  assert(primaryCategoryUsers[categoryKey]?.length, `${categoryKey} needs at least one idle example`);
  assert(secondaryPureUsers[categoryKey]?.length === 3, `${categoryKey} needs exactly three secondary pure-type examples`);
}

for (const user of revealedUsers) {
  assert(user.name && user.ability, 'every revealed user needs a name and representative ability or aptitude');
  assert(abilityUsers.has(user.name), `${user.name} is revealed without a maintained ability profile`);
}

for (const placement of spectrumPlacements) {
  assert(categoryKeys.has(placement.from) && categoryKeys.has(placement.to), `${placement.name} references an unknown spectrum endpoint`);
  assert(placement.from !== placement.to, `${placement.name} cannot connect a category to itself`);
  assert(Number.isFinite(placement.t) && placement.t > 0 && placement.t < 1, `${placement.name} needs a valid between-category ratio`);
  if (placement.ability) {
    assert(abilityByUserAndName.has(`${placement.name}::${placement.ability}`), `${placement.name}'s visible placement ability lacks a maintained profile`);
  }
}

for (const profile of namedAbilityProfiles) {
  assert(profile.id && profile.user && profile.name, 'ability profiles need stable identity fields');
  assert(categoryKeys.has(profile.naturalCategory), `${profile.name} has an unknown natural category`);
  assert(Array.isArray(profile.supportingCategories), `${profile.name} needs a supporting-category array`);
  assert(unique(profile.supportingCategories), `${profile.name} repeats a supporting category`);
  assert(!profile.supportingCategories.includes(profile.naturalCategory), `${profile.name} repeats its natural category as supporting`);
  assert(profile.supportingCategories.every((key) => categoryKeys.has(key)), `${profile.name} references an unknown supporting category`);
  assert(profile.activation && profile.cost && profile.effect, `${profile.name} needs activation, cost, and effect`);
  assert(abilityKinds.has(profile.abilityKind), `${profile.name} has an unsupported ability kind`);
  assert(categoryUseStates.has(profile.categoryUse), `${profile.name} has an unsupported category-use status`);
}

const app = await readFile(path.resolve('src/App.jsx'), 'utf8');
const nen = await readFile(path.resolve('src/components/NenEncyclopedia.jsx'), 'utf8');
const nenMap = await readFile(path.resolve('src/components/NenSystemExpansionMap.jsx'), 'utf8');
const nenExpansionData = await readFile(path.resolve('src/data/nenSpectrumExpansion.js'), 'utf8');
const nenExpansionCss = await readFile(path.resolve('src/nen-spectrum-expansion.css'), 'utf8');
const nenShell = await readFile(path.resolve('src/nen-map-shell.css'), 'utf8');
const organizations = await readFile(path.resolve('src/components/OrganizationArchive.jsx'), 'utf8');
const conflicts = await readFile(path.resolve('src/components/ConflictArchive.jsx'), 'utf8');
const panel = await readFile(path.resolve('src/components/ReferenceBackbonePanel.jsx'), 'utf8');

assert(nen.includes('NenSystemExpansionMap') && nen.includes('nenRecords'), 'Nen route must retain canonical records while rendering the expanded system map');
assert(!nen.includes('NenPrincipleMap') && !nen.includes('nen-browser'), 'retired Nen workbench and directory must not return');
assert(nenMap.includes('nen-pipe-connectors') && nenMap.includes('nen-pipe-inspector') && nenMap.includes('zoomAt') && nenMap.includes('fitAll'), 'Nen system map must preserve pipes, inspector, pan, and zoom interaction');
assert(nenMap.includes('expandedCategoryKey') && nenMap.includes('PlacementMarker') && nenMap.includes('named-ability'), 'Nen map must preserve category focus, exact placement markers, and named-ability expansion');
assert(nenMap.includes('data-qa-pan-zoom-canvas="true"') && nenMap.includes('data-qa-scaled-canvas="true"'), 'Nen map must declare its intentional scaled-canvas QA contract');
assert(nenExpansionData.includes('nenExpansionCompletion') && nenExpansionData.includes('abilityKind') && nenExpansionData.includes('categoryUse'), 'Nen completion metadata and uncertainty boundaries must remain maintained');
assert(nenExpansionCss.includes('clip-path: polygon') && nenExpansionCss.includes('.nen-placement-marker') && nenExpansionCss.includes('.is-named-ability'), 'Nen expansion styling must preserve hexagonal categories, placement markers, and named-ability cards');
assert(nenShell.includes('.page-intro') && nenShell.includes('.workspace-nav') && nenShell.includes('.reference-backbone') && nenShell.includes('display:none'), 'Nen map-only shell must remove the legacy reference wrappers');
assert(organizations.includes('ReferenceBackbonePanel') && organizations.includes('domain="organizations"'), 'Organization archive must surface the reference backbone');
assert(conflicts.includes('ReferenceBackbonePanel') && conflicts.includes('domain="conflicts"'), 'Conflict archive must surface the reference backbone');
assert(panel.includes('referenceBackbonePrototype') && panel.includes('reference-backbone__records') && panel.includes('reference-backbone__sources'), 'ReferenceBackbonePanel must render records and sources from canonical data');

assert(referencePages.map((page) => page.id).join(',') === 'nen', 'Nen must be the only retained public reference page');
assert(!Object.values(referenceAliases).some((alias) => alias.target === 'atlas' || alias.target === 'world'), 'no public reference alias may reopen the retired World Atlas');
const retiredWorld = parseCleanRoute('/world', '');
assert(retiredWorld.view === 'not-found' && retiredWorld.params.attemptedPath === '/world', 'the retired /world URL must resolve to the not-found route');
let worldAtlasComponentExists = true;
try { await access(path.resolve('src/components/WorldAtlas.jsx')); } catch { worldAtlasComponentExists = false; }
assert(!worldAtlasComponentExists, 'src/components/WorldAtlas.jsx must remain deleted');

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

console.log(`Reference backbone audit passed: public references are Nen-only; ${referenceBackboneStats.domains} maintained data domains, ${referenceBackboneStats.lanes} lanes, ${referenceBackboneStats.records} records, ${referenceBackboneStats.sources} approved sources, and final Nen coverage includes ${nenExpansionCompletion.secondaryUsers} secondary users, ${nenExpansionCompletion.placements} spectrum placements, and ${nenExpansionCompletion.abilityProfiles} maintained ability/system profiles.`);
