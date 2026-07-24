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

const [workspace, styles, app, dataEntry, foundation, selectorSource] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveCharacterWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveCharacterWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateSelectors.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'CharactersWorkspace', './SuccessionArchiveCharacterWorkspace'), 'app must import the dedicated character workspace');
assert(sourceRendersRouteWith(app, 'characters', 'CharactersWorkspace'), 'characters route must render the dedicated workspace');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'characters'), 'character entity routes must stay inside the character dossier');
assert(dataEntry.includes("from './entitiesCharacterFoundation.js'"), 'public data entry must activate the character state foundation');
assert(dataEntry.includes('getCharacterDossier'), 'public data entry must expose character dossiers');
assert(foundation.includes('characterStateProfiles'), 'character state profiles must be published');
assert(foundation.includes("characterId: 'character:kurapika'"), 'Kurapika state history must be explicit');
assert(foundation.includes("characterId: 'character:kacho-hui-guo-rou'"), 'Kacho body-state split must be explicit');
assert(foundation.includes("characterId: 'character:balsamilco-might'"), 'Balsamilco identity crisis must be explicit');
assert(foundation.includes("characterId: 'character:halkenburg-hui-guo-rou'"), 'Halkenburg body-state split must be explicit');
assert(selectorSource.includes('getCharacterStateAtChapter'), 'selectors must expose chapter state resolution');
assert(selectorSource.includes('getCharacterDossier'), 'selectors must compose the complete character graph');
assert(selectorSource.includes('searchCharactersByState'), 'state text must participate in global search');
assert(workspace.includes('Characters as chapter-bounded operational records'), 'workspace must identify the state model');
assert(workspace.includes('State at chapter'), 'workspace must provide chapter snapshots');
assert(workspace.includes('Protection and threats'), 'workspace must expose active protection and threat assignments');
assert(workspace.includes('Explicit chapter-bounded records'), 'workspace must render state history');
assert(workspace.includes('SourceReference'), 'workspace must render evidence sources');
assert(styles.includes('.succession-character-state-board'), 'styles must own the character state board');
assert(styles.includes('@media(max-width:620px)'), 'workspace must include mobile handling');
assert(styles.includes('@media(prefers-reduced-motion:reduce)'), 'workspace must include reduced-motion handling');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getCharacterDossier,
    getCharacterStateAtChapter,
    getCharacterStateTimeline,
    getCharactersWithStateProfiles,
    searchSuccessionArchive,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'character foundation must preserve canonical schema validity');
  assert(getCharactersWithStateProfiles().length >= 10, 'at least ten high-value characters must have explicit state profiles');
  assert(getCharacterStateTimeline('character:kurapika').length >= 2, 'Kurapika must have pre- and post-treaty states');

  const kacho383 = getCharacterStateAtChapter('character:kacho-hui-guo-rou', 383);
  assert(kacho383?.life === 'dead', 'Kacho must remain deceased from Chapter 383 onward');
  assert(kacho383?.consciousnessState.includes('Without You'), 'Kacho state must distinguish the beast continuation from confirmed consciousness');

  const balsamilco403 = getCharacterStateAtChapter('character:balsamilco-might', 403);
  assert(balsamilco403?.bodyState.includes('possession'), 'Balsamilco Chapter 403 state must expose the possession crisis');
  assert(balsamilco403?.life === 'unknown', 'Balsamilco life state must remain unresolved rather than flattened');

  const halkenburg413 = getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 413);
  assert(halkenburg413?.bodyState.includes('original body'), 'Halkenburg state must distinguish original body from transferred consciousness');
  assert(halkenburg413?.certainty === 'probable', 'Halkenburg transfer interpretation must retain its evidence certainty');

  const kurapika411 = getCharacterDossier('character:kurapika', 411);
  assert(kurapika411?.character?.id === 'character:kurapika', 'character dossier must resolve its subject');
  assert(kurapika411?.assignments?.assignments.length > 0, 'Kurapika dossier must include active assignments');
  assert(kurapika411?.relationships?.relationships.length > 0, 'Kurapika dossier must include active relationships');
  assert(kurapika411?.location?.id === 'location:black-whale:tier-1:room-1014', 'Kurapika Chapter 411 dossier must resolve Room 1014');

  assert(searchSuccessionArchive('critical identity compromise').some(({ entity }) => entity.id === 'character:balsamilco-might'), 'global search must resolve character state language');

  console.log(`Succession character workspace audit passed: ${getCharactersWithStateProfiles().length} explicit character profiles, chapter state resolution, body/consciousness separation, graph-composed dossiers, state search, evidence, and responsive presentation are wired.`);
} finally {
  await vite.close();
}
