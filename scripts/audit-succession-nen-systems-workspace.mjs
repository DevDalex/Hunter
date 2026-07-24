import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Nen systems audit failed: ${message}`);
};

const [
  app,
  primitives,
  deepWorkspaces,
  nenWorkspace,
  nenStyles,
  beastWorkspace,
  beastStyles,
  dataEntry,
  systemFoundation,
  systemSelectors,
  systemEntityLayer,
  indexes,
  routes,
] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchivePrimitives.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveDeepWorkspaces.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveNenWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveNenWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveGuardianBeastWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveGuardianBeastWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/nenSystemFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/nenSystemSelectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/entitiesNenSystemFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/indexes.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/archiveRoutes.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'NenWorkspace', './SuccessionArchiveNenWorkspace'), 'app must import the dedicated Nen systems workspace');
assert(sourceImportsDefault(app, 'GuardianBeastsWorkspace', './SuccessionArchiveGuardianBeastWorkspace'), 'app must import the dedicated Guardian Beast workspace');
assert(sourceRendersRouteWith(app, 'nen', 'NenWorkspace'), 'Nen route must render the dedicated systems workspace');
assert(sourceRendersRouteWith(app, 'guardian-spirit-beasts', 'GuardianBeastsWorkspace'), 'Guardian Beast route must render the dedicated workspace');
assert(declarationIncludesLiteral(app, 'dedicated', 'nen'), 'Nen must be a dedicated route');
assert(declarationIncludesLiteral(app, 'dedicated', 'guardian-spirit-beasts'), 'Guardian Beasts must be a dedicated route');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'nen'), 'ability records must remain inside the Nen dossier');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'guardian-spirit-beasts'), 'beast records must remain inside the Guardian Beast dossier');
assert(!declarationIncludesLiteral(app, 'preserved', 'nen'), 'Nen must not remain a preserved legacy route');
assert(!app.includes("lazy(() => import('../SuccessionDossier'))"), 'legacy SuccessionDossier must not power the active Nen route');
assert(!/import\s*\{[^}]*GuardianBeastsWorkspace[^}]*\}\s*from\s*['"]\.\/SuccessionArchiveDeepWorkspaces['"]/.test(app), 'legacy GuardianBeastsWorkspace must not be imported by the active app');
assert(deepWorkspaces.includes('export function GuardianBeastsWorkspace'), 'legacy beast workspace may remain only as inactive migration code');
assert(app.includes("linkedEntity?.entityType === 'ability'") && app.includes("? 'nen'"), 'ability links must normalize to Nen');
assert(app.includes("linkedEntity?.entityType === 'guardian-beast'") && app.includes("? 'guardian-spirit-beasts'"), 'beast links must normalize to Guardian Beasts');
assert(app.includes('showAbilityDossier') && app.includes('showGuardianBeastDossier'), 'legacy URLs must bypass generic entity detail for Nen records');
assert(app.includes('chapter: spoilerLimit') && app.includes('SearchWorkspace onNavigate={navigate} spoilerLimit={spoilerLimit}'), 'global archive search must receive and apply the selected chapter boundary');
assert(primitives.includes("if (entity.entityType === 'ability') return 'nen'"), 'shared links must route abilities canonically');
assert(primitives.includes("if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts'"), 'shared links must route beasts canonically');

assert(dataEntry.includes("from './entitiesNenSystemFoundation.js'"), 'public data entry must activate the Nen system layer');
for (const selector of [
  'getAbilityKnowledgeAtChapter',
  'getAbilitiesKnownAtChapter',
  'getAbilityDossier',
  'getNenSystemDossier',
  'getGuardianBeastStateAtChapter',
  'getGuardianBeastDossier',
  'getNenSystemClosureReport',
  'isSuccessionEntityAvailableAtChapter',
  'searchNenSystems',
]) assert(dataEntry.includes(selector), `public data entry must expose ${selector}`);
assert(dataEntry.includes('searchCharacterStatesAtChapter') && dataEntry.includes('searchOrganizationStatesAtChapter'), 'global search must use chapter-bounded people and institution state text');
assert(systemEntityLayer.includes('nenSystemProfiles') && systemEntityLayer.includes('guardianBeastStateProfiles'), 'active entity layer must expose systems and beast timelines');
assert(systemEntityLayer.includes('ability:benjamin-guardian-curse-dispersal'), 'Benjamin curse-dispersal ability must be linked into the active graph');
assert(indexes.includes('entity.activation') && indexes.includes('entity.limitations') && indexes.includes('entity.knownUses'), 'global search must index Nen mechanics');

for (const id of [
  'nen-system:seed-urn-succession-ritual',
  'nen-system:guardian-spirit-beast-contract',
  'nen-system:room-1014-instruction',
  'nen-system:post-mortem-nen',
  'nen-system:curse-networks',
  'nen-system:contracts-vows-and-conditions',
  'nen-system:possession-and-consciousness-transfer',
  'nen-system:contagion-progression',
]) assert(systemFoundation.includes(id), `system foundation must include ${id}`);
for (const beastId of [
  'guardian-beast:nasubi', 'guardian-beast:benjamin', 'guardian-beast:camilla', 'guardian-beast:zhang-lei',
  'guardian-beast:tserriednich', 'guardian-beast:tubeppa', 'guardian-beast:tyson', 'guardian-beast:luzurus',
  'guardian-beast:sale-sale', 'guardian-beast:halkenburg', 'guardian-beast:kacho', 'guardian-beast:fugetsu',
  'guardian-beast:momoze', 'guardian-beast:marayam', 'guardian-beast:woble',
]) assert(systemFoundation.includes(`'${beastId}'`), `beast state foundation must include ${beastId}`);
assert(systemSelectors.includes('firstKnownChapter'), 'ability revelation must use source-backed first knowledge');
assert(systemSelectors.includes('data.characterStateProfiles') && systemSelectors.includes('data.organizationStateProfiles'), 'linked system actors must use canonical state timelines for revelation');
assert(systemSelectors.includes('parsedChapter < firstChapter) return null'), 'direct beast dossiers must remain hidden before ritual revelation');
assert(systemSelectors.includes('stateIntegrityIssues'), 'closure must reject overlapping beast state records');
assert(nenWorkspace.includes('Abilities, contracts, curses, possession, instruction, and royal ritual'), 'Nen workspace must expose the systems model');
assert(nenWorkspace.includes('Interpretive boundary'), 'Nen workspace must preserve uncertainty');
assert(beastWorkspace.includes('Fifteen Guardian Spirit Beasts as changing ritual records'), 'beast workspace must expose chapter-state model');
assert(beastWorkspace.includes('Host, body, consciousness, and Nen continuation remain separate'), 'beast workspace must preserve body-state distinctions');
assert(nenStyles.includes('@media(max-width:720px)') && beastStyles.includes('@media(max-width:720px)'), 'both workspaces must include mobile layouts');
assert(nenStyles.includes('@media(prefers-reduced-motion:reduce)') && beastStyles.includes('@media(prefers-reduced-motion:reduce)'), 'both workspaces must honor reduced motion');
assert(routes.includes('The authoritative systems route') && routes.includes('All fifteen royal beasts tracked'), 'route registry must describe the canonical Batch 3 architecture');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getAbilitiesKnownAtChapter,
    getAbilityDossier,
    getAbilityKnowledgeAtChapter,
    getEntitiesByType,
    getEntityById,
    getGuardianBeastDossier,
    getGuardianBeastStateAtChapter,
    getGuardianBeastStateTimeline,
    getNenSystemClosureReport,
    getNenSystemDossier,
    getNenSystemsAtChapter,
    isSuccessionEntityAvailableAtChapter,
    searchNenSystems,
    searchSuccessionArchive,
    successionArchiveData,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'canonical archive schema must remain valid');
  const abilities = getEntitiesByType('ability');
  const beasts = getEntitiesByType('guardian-beast');
  assert(abilities.length >= 30, `ability catalogue must retain at least thirty records, found ${abilities.length}`);
  assert(beasts.length === 15, `royal beast catalogue must contain exactly fifteen records, found ${beasts.length}`);
  assert(getNenSystemsAtChapter(413).length === 8, 'all eight system profiles must be active by Chapter 413');

  const closure = getNenSystemClosureReport(413);
  assert(closure?.closureReady && closure.status === 'closed', 'Batch 3 system closure must be closed');
  assert(closure.abilities.validDossiers === closure.abilities.total, 'every known ability must resolve a valid dossier');
  assert(closure.guardianBeasts.validDossiers === 15, 'every beast must resolve a valid dossier');
  assert(closure.guardianBeasts.explicitStateProfiles === 15, 'every beast must retain an explicit state timeline');
  assert(closure.stateIntegrityIssues.length === 0, 'beast state timelines must not overlap or duplicate');
  assert(closure.missingSystemReferences.length === 0, 'every system graph reference must resolve');

  for (const ability of abilities) {
    const dossier = getAbilityDossier(ability.id, 413);
    assert(dossier && dossier.ability.id === ability.id, `${ability.id} must resolve an ability dossier`);
    if (dossier.known) {
      assert(dossier.sources.length > 0, `${ability.id} must retain bounded sources`);
      assert(dossier.mechanics, `${ability.id} must retain mechanics`);
    }
  }

  for (const beast of beasts) {
    const timeline = getGuardianBeastStateTimeline(beast.id);
    assert(timeline.length > 0, `${beast.id} must have an explicit timeline`);
    const dossier = getGuardianBeastDossier(beast.id, 413);
    assert(dossier?.beast.id === beast.id, `${beast.id} must resolve a dossier`);
    assert(dossier.host?.entityType === 'character', `${beast.id} must resolve its host`);
    assert(dossier.state && dossier.sources.length > 0, `${beast.id} must retain state and evidence`);
    for (const record of timeline) {
      for (const sourceId of record.sourceIds) assert(getEntityById(sourceId)?.entityType === 'source', `${record.id} references missing source ${sourceId}`);
      for (const abilityId of [...record.knownAbilityIds, ...record.suspectedAbilityIds]) assert(getEntityById(abilityId)?.entityType === 'ability', `${record.id} references missing ability ${abilityId}`);
    }
  }

  for (const profile of Object.values(successionArchiveData.nenSystemProfiles || {})) {
    const dossier = getNenSystemDossier(profile.id, 413);
    assert(dossier?.profile.id === profile.id, `${profile.id} must resolve a system dossier`);
    assert(dossier.sources.length > 0, `${profile.id} must retain chapter-bounded evidence`);
    for (const id of [...profile.abilityIds, ...profile.guardianBeastIds, ...profile.characterIds, ...profile.organizationIds, ...profile.locationIds, ...profile.sourceIds]) {
      assert(getEntityById(id), `${profile.id} references missing ${id}`);
    }
  }

  assert(!getAbilityKnowledgeAtChapter('ability:parallel-future', 384)?.known, 'Parallel Future must remain hidden before Chapter 385');
  assert(getAbilityKnowledgeAtChapter('ability:parallel-future', 385)?.known, 'Parallel Future must appear at Chapter 385');
  assert(!getAbilityKnowledgeAtChapter('ability:without-you', 382)?.known, 'Without You must remain hidden before Chapter 383');
  assert(getAbilityKnowledgeAtChapter('ability:without-you', 383)?.known, 'Without You must appear at Chapter 383');
  assert(!getAbilityKnowledgeAtChapter('ability:benjamin-guardian-curse-dispersal', 388)?.known, 'Benjamin curse dispersal must remain hidden before Chapter 389');
  assert(getAbilityKnowledgeAtChapter('ability:benjamin-guardian-curse-dispersal', 389)?.known, 'Benjamin curse dispersal must appear at Chapter 389');
  const wobleMystery = getAbilityKnowledgeAtChapter('ability:woble-guardian-beast-unrevealed', 413);
  assert(wobleMystery?.known && wobleMystery.knowledgeState === 'existence known; mechanics unrevealed', 'Woble beast mechanics must remain explicitly unrevealed');
  assert(getGuardianBeastDossier('guardian-beast:woble', 348) === null, 'direct beast dossiers must remain unavailable before the Seed Urn revelation');
  assert(!isSuccessionEntityAvailableAtChapter('ability:parallel-future', 384), 'public availability selector must hide Parallel Future before Chapter 385');
  assert(isSuccessionEntityAvailableAtChapter('ability:parallel-future', 385), 'public availability selector must expose Parallel Future at Chapter 385');

  const stealth361 = getAbilityDossier('ability:stealth-dolphin', 361);
  assert(stealth361?.systems.length === 0, 'an early Stealth Dolphin dossier must not expose systems first documented in Chapter 369');
  assert(stealth361?.locations.every((location) => location.id === 'location:black-whale:tier-1:room-1014'), 'early ability locations must derive only from events already available');

  assert(getGuardianBeastStateAtChapter('guardian-beast:sale-sale', 380)?.knowledge === 'diffusive influence system known', 'Sale-sale beast must remain active at Chapter 380');
  assert(getGuardianBeastStateAtChapter('guardian-beast:sale-sale', 381)?.knowledge === 'destroyed', 'Sale-sale beast must be destroyed at Chapter 381');
  assert(getGuardianBeastStateAtChapter('guardian-beast:sale-sale', 382)?.hostState === 'host deceased', 'Sale-sale beast must be inactive after host death');
  assert(getGuardianBeastStateAtChapter('guardian-beast:kacho', 382)?.knowledge === 'ability unrevealed', 'Kacho beast must remain unrevealed through Chapter 382');
  assert(getGuardianBeastStateAtChapter('guardian-beast:kacho', 383)?.knowledge === 'Without You active', 'Kacho beast must become Without You at Chapter 383');
  assert(getGuardianBeastStateAtChapter('guardian-beast:fugetsu', 374)?.knowledge === 'Magical Worm route active', 'Fugetsu route must appear at Chapter 374');
  assert(getGuardianBeastStateAtChapter('guardian-beast:fugetsu', 383)?.knowledge === 'route behavior changed after Kacho death', 'Fugetsu route state must transform at Chapter 383');
  assert(getGuardianBeastStateAtChapter('guardian-beast:momoze', 367)?.knowledge === 'coercive body control observed', 'Momoze beast must remain active at Chapter 367');
  assert(getGuardianBeastStateAtChapter('guardian-beast:momoze', 368)?.knowledge === 'inactive after host death', 'Momoze beast must become inactive at Chapter 368');
  assert(getGuardianBeastStateAtChapter('guardian-beast:marayam', 370)?.knowledge === 'dragon-like form observed', 'Marayam beast must remain observational at Chapter 370');
  assert(getGuardianBeastStateAtChapter('guardian-beast:marayam', 371)?.knowledge === 'spatial isolation strongly suspected', 'Marayam isolation must appear at Chapter 371');

  const systems349 = getNenSystemsAtChapter(349).map((profile) => profile.id);
  assert(systems349.includes('nen-system:seed-urn-succession-ritual') && systems349.includes('nen-system:guardian-spirit-beast-contract'), 'Chapter 349 must expose ritual and beast systems');
  assert(!systems349.includes('nen-system:contagion-progression'), 'Contagion system must remain hidden before Chapter 378');
  assert(getNenSystemsAtChapter(378).some((profile) => profile.id === 'nen-system:contagion-progression'), 'Contagion system must appear at Chapter 378');
  assert(getAbilitiesKnownAtChapter(384).every((record) => record.ability.id !== 'ability:parallel-future'), 'ability directory must honor revelation boundaries');

  const contagion378 = getNenSystemDossier('nen-system:contagion-progression', 378);
  const contagion410 = getNenSystemDossier('nen-system:contagion-progression', 410);
  assert(contagion378?.characters.some((character) => character.id === 'character:morena-prudo'), 'Contagion must include Morena when the system appears');
  assert(!contagion378?.characters.some((character) => character.id === 'character:borksen'), 'Contagion must not expose Borksen before her Chapter 408 state');
  assert(contagion410?.characters.some((character) => character.id === 'character:borksen'), 'Contagion must include Borksen after the recruitment outcome');

  assert(!searchSuccessionArchive('Parallel Future', { types: ['ability'], chapter: 384 }).some(({ entity }) => entity.id === 'ability:parallel-future'), 'global search must hide Parallel Future at Chapter 384');
  assert(searchSuccessionArchive('Parallel Future', { types: ['ability'], chapter: 385 }).some(({ entity }) => entity.id === 'ability:parallel-future'), 'global search must expose Parallel Future at Chapter 385');
  assert(!searchSuccessionArchive('reached Yes', { chapter: 409 }).some(({ entity }) => ['character:borksen', 'organization:heil-ly'].includes(entity.id)), 'global state search must hide the Borksen outcome at Chapter 409');
  assert(searchSuccessionArchive('reached Yes', { chapter: 410 }).some(({ entity }) => ['character:borksen', 'organization:heil-ly'].includes(entity.id)), 'global state search must expose the Borksen outcome at Chapter 410');
  assert(searchSuccessionArchive('curse bearer’s death').some(({ entity }) => entity.id === 'ability:have-not-curse'), 'global search must resolve death-powered curse conditions');
  assert(searchSuccessionArchive('ten-second precognitive vision').some(({ entity }) => entity.id === 'ability:parallel-future'), 'global search must resolve ability mechanics');
  assert(searchNenSystems('body death, consciousness continuation').some(({ profile }) => profile.id === 'nen-system:post-mortem-nen'), 'system search must resolve body and consciousness distinctions');
  assert(searchNenSystems('murder points').some(({ profile }) => profile.id === 'nen-system:contagion-progression'), 'system search must resolve Contagion progression');

  console.log(`Succession Nen systems audit passed: ${abilities.length} ability dossiers, 15 chapter-bounded Guardian Spirit Beasts, 8 ritual and mechanic systems, canonical routes, linked-actor timing, global search boundaries, uncertainty, sources, and closure integrity are wired.`);
} finally {
  await vite.close();
}
