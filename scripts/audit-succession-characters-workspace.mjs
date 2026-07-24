import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession character workspace audit failed: ${message}`);
};

const [workspace, styles, expansionStyles, app, primitives, dataEntry, foundation, expansion, royalExpansion, selectorSource] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveCharacterWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveCharacterWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveCharacterWorkspaceExpansion.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchivePrimitives.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateRoyalExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateSelectors.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'CharactersWorkspace', './SuccessionArchiveCharacterWorkspace'), 'app must import the dedicated character workspace');
assert(sourceRendersRouteWith(app, 'characters', 'CharactersWorkspace'), 'characters route must render the dedicated workspace');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'characters'), 'character entity routes must stay inside the character dossier');
assert(app.includes("linkedEntity?.entityType === 'character' ? 'characters' : target"), 'all role-route character links must be normalized to the character workspace');
assert(app.includes('showCharacterDossier') && app.includes("selectedEntity?.entityType === 'character'"), 'legacy role-route entity URLs must render the dedicated character dossier');
assert(primitives.includes("if (entity.entityType === 'character') return 'characters'"), 'shared entity links must route every character to the dedicated dossier');
assert(dataEntry.includes("from './entitiesCharacterFoundation.js'"), 'public data entry must activate the character state foundation');
assert(dataEntry.includes('getCharacterDossier'), 'public data entry must expose character dossiers');
assert(dataEntry.includes('getCharacterRoleProfile'), 'public data entry must expose role-specific character layers');
assert(dataEntry.includes('getCharacterLifetimeTimeline'), 'public data entry must expose lifetime character timelines');
assert(foundation.includes('characterStateProfiles'), 'character state profiles must be published');
assert(foundation.includes("characterId: 'character:kurapika'"), 'Kurapika state history must be explicit');
assert(foundation.includes("characterId: 'character:kacho-hui-guo-rou'"), 'Kacho body-state split must be explicit');
assert(foundation.includes("characterId: 'character:balsamilco-might'"), 'Balsamilco identity crisis must be explicit');
assert(foundation.includes("characterId: 'character:halkenburg-hui-guo-rou'"), 'Halkenburg body-state split must be explicit');
assert(expansion.includes("characterId: 'character:benjamin-hui-guo-rou'"), 'Benjamin command state must be explicit');
assert(expansion.includes("characterId: 'character:tserriednich-hui-guo-rou'"), 'Tserriednich training state must be explicit');
assert(expansion.includes("characterId: 'character:sale-sale-hui-guo-rou'"), 'Sale-sale death transition must be explicit');
assert(expansion.includes("characterId: 'character:theta'"), 'Theta conflicted-instructor states must be explicit');
assert(expansion.includes("characterId: 'character:hinrigh-biganduffno'"), 'Xi-Yu field command state must be explicit');
assert(royalExpansion.includes("characterId: 'character:tyson-hui-guo-rou'"), 'Tyson state must complete prince coverage');
for (const queenId of [
  'unma-hui-guo-rou',
  'duazul-hui-guo-rou',
  'tang-zhao-li-hui-guo-rou',
  'katrono-hui-guo-rou',
  'swinko-swinko-hui-guo-rou',
  'seiko-hui-guo-rou',
  'sevanti-hui-guo-rou',
]) assert(royalExpansion.includes(`character:${queenId}`), `royal expansion must include ${queenId}`);
assert(selectorSource.includes('getCharacterStateAtChapter'), 'selectors must expose chapter state resolution');
assert(selectorSource.includes('getCharacterRoleProfile'), 'selectors must expose role-specific operational layers');
assert(selectorSource.includes('getCharacterLifetimeTimeline'), 'selectors must compose lifetime chronology');
assert(selectorSource.includes('getCharacterStateCoverageReport'), 'selectors must report explicit-profile coverage');
assert(selectorSource.includes('searchCharactersByState'), 'state and role text must participate in global search');
assert(workspace.includes('Characters as chapter-bounded operational records'), 'workspace must identify the state model');
assert(workspace.includes('Operational layer'), 'workspace must filter by role-specific operational layer');
assert(workspace.includes('Role-specific operations'), 'workspace must render the role-specific dossier board');
assert(workspace.includes('Lifetime chronology'), 'workspace must render combined lifetime chronology');
assert(workspace.includes('Protection and threats'), 'workspace must expose active protection and threat assignments');
assert(workspace.includes('Explicit chapter-bounded state records'), 'workspace must render state history');
assert(workspace.includes('SourceReference'), 'workspace must render evidence sources');
assert(styles.includes('.succession-character-state-board'), 'styles must own the character state board');
assert(expansionStyles.includes('.succession-character-role-board'), 'expanded styles must own role-specific presentation');
assert(expansionStyles.includes('.succession-character-lifetime'), 'expanded styles must own lifetime chronology');
assert(expansionStyles.includes('@media(max-width:620px)'), 'expanded workspace must include mobile handling');
assert(expansionStyles.includes('@media(prefers-reduced-motion:reduce)'), 'expanded workspace must include reduced-motion handling');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getCharacterDossier,
    getCharacterLifetimeTimeline,
    getCharacterRoleProfile,
    getCharacterStateAtChapter,
    getCharacterStateCoverageReport,
    getCharacterStateTimeline,
    getCharactersWithStateProfiles,
    getEntitiesByType,
    searchSuccessionArchive,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'character foundation must preserve canonical schema validity');
  assert(getCharactersWithStateProfiles().length >= 36, 'at least thirty-six major characters must have explicit state profiles after royal completion');
  assert(getCharacterStateTimeline('character:kurapika').length >= 2, 'Kurapika must have pre- and post-treaty states');

  const coverage = getCharacterStateCoverageReport();
  assert(coverage.explicitCharacters >= 36, 'coverage report must count complete royal and operational profiles');
  assert(coverage.roleLayers.some((layer) => layer.id === 'royal-candidate' && layer.explicit === 14), 'all fourteen princes must have explicit state profiles');
  assert(coverage.roleLayers.some((layer) => layer.id === 'royal-household' && layer.explicit === 8), 'all eight queens must have explicit state profiles');

  const princes = getEntitiesByType('character').filter((character) => character.roles?.includes('prince'));
  const queens = getEntitiesByType('character').filter((character) => character.roles?.includes('queen'));
  assert(princes.length === 14 && princes.every((character) => getCharacterStateTimeline(character.id).length > 0), 'every prince must resolve an explicit state timeline');
  assert(queens.length === 8 && queens.every((character) => getCharacterStateTimeline(character.id).length > 0), 'every queen must resolve an explicit state timeline');

  const tyson411 = getCharacterStateAtChapter('character:tyson-hui-guo-rou', 411);
  assert(tyson411?.locationId === 'location:black-whale:tier-1:room-1006', 'Tyson must resolve to Room 1006');
  assert(tyson411?.openQuestions.some((question) => question.includes('taboo')), 'Tyson state must retain the unresolved Guardian Spirit Beast taboo');

  const kacho383 = getCharacterStateAtChapter('character:kacho-hui-guo-rou', 383);
  assert(kacho383?.life === 'dead', 'Kacho must remain deceased from Chapter 383 onward');
  assert(kacho383?.consciousnessState.includes('Without You'), 'Kacho state must distinguish the beast continuation from confirmed consciousness');

  const balsamilco403 = getCharacterStateAtChapter('character:balsamilco-might', 403);
  assert(balsamilco403?.bodyState.includes('possession'), 'Balsamilco Chapter 403 state must expose the possession crisis');
  assert(balsamilco403?.life === 'unknown', 'Balsamilco life state must remain unresolved rather than flattened');

  const halkenburg413 = getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 413);
  assert(halkenburg413?.bodyState.includes('original body'), 'Halkenburg state must distinguish original body from transferred consciousness');
  assert(halkenburg413?.certainty === 'probable', 'Halkenburg transfer interpretation must retain its evidence certainty');

  const saleSale382 = getCharacterStateAtChapter('character:sale-sale-hui-guo-rou', 382);
  assert(saleSale382?.life === 'dead', 'Sale-sale must transition to deceased after the assassination chain');
  assert(saleSale382?.bodyState.includes('assassination'), 'Sale-sale death state must retain the operational cause');

  const swinko382 = getCharacterStateAtChapter('character:swinko-swinko-hui-guo-rou', 382);
  assert(swinko382?.operationalState.includes('lost its candidate'), 'Swinko-swinko must transition after Sale-sale’s death');
  const seiko383 = getCharacterStateAtChapter('character:seiko-hui-guo-rou', 383);
  assert(seiko383?.operationalState.includes('Kacho’s death'), 'Seiko must reflect the transformed twin branch');
  const sevanti372 = getCharacterStateAtChapter('character:sevanti-hui-guo-rou', 372);
  assert(sevanti372?.locationId === 'location:black-whale:tier-1:room-1013:isolated-space', 'Sevanti must resolve inside Marayam’s isolated space');

  const benjamin411 = getCharacterDossier('character:benjamin-hui-guo-rou', 411);
  assert(benjamin411?.roleProfile?.id === 'royal-candidate', 'Benjamin dossier must render the royal-candidate layer');
  assert(benjamin411?.relationshipHistory.length > 0, 'Benjamin dossier must include relationship history');

  const theta386 = getCharacterDossier('character:theta', 386);
  assert(theta386?.state?.threatLevel === 'existential', 'Theta’s post-attempt state must preserve existential danger');
  assert(theta386?.assignmentHistory.some((assignment) => assignment.id === 'assignment:theta-instructs-tserriednich'), 'Theta dossier must retain her conflicted instruction assignment');

  const hinrigh399 = getCharacterLifetimeTimeline('character:hinrigh-biganduffno', 399);
  assert(hinrigh399.some((entry) => entry.kind === 'movement' && entry.locationId === 'location:black-whale:tier-3:room-3101'), 'Hinrigh chronology must include the Room 3101 movement record');
  assert(hinrigh399.some((entry) => entry.kind === 'state'), 'Hinrigh chronology must include explicit state history');

  const melody411 = getCharacterDossier('character:melody', 411);
  assert(melody411?.movementHistory.some((record) => record.locationId === 'location:black-whale:tier-1:justice-bureau'), 'Melody dossier must include her Justice transition');
  assert(melody411?.lifetimeTimeline.some((entry) => entry.kind === 'relationship'), 'Melody lifetime chronology must include relationship records');

  assert(getCharacterRoleProfile('character:tserriednich-hui-guo-rou', 411)?.id === 'royal-candidate', 'Tserriednich must resolve to the prince-specific role layer');
  assert(getCharacterRoleProfile('character:unma-hui-guo-rou', 411)?.id === 'royal-household', 'Unma must resolve to the queen-specific role layer');
  assert(searchSuccessionArchive('critical identity compromise').some(({ entity }) => entity.id === 'character:balsamilco-might'), 'global search must resolve character state language');
  assert(searchSuccessionArchive('Fourth Queen household').some(({ entity }) => entity.id === 'character:katrono-hui-guo-rou'), 'global search must resolve queen state language');

  console.log(`Succession character workspace audit passed: ${getCharactersWithStateProfiles().length} explicit character profiles, all fourteen princes, all eight queens, role-route normalization, chapter states, body/consciousness separation, lifetime chronology, graph-composed dossiers, search, evidence, and responsive presentation are wired.`);
} finally {
  await vite.close();
}
