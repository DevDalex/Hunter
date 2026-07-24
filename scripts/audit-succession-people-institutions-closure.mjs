import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession people and institutions closure audit failed: ${message}`);
};

const [
  app,
  primitives,
  extendedWorkspaces,
  characterWorkspace,
  organizationWorkspace,
  dataEntry,
  characterSelectors,
  organizationSelectors,
  closureSource,
  institutionExpansion,
  statusKnowledgeSource,
] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchivePrimitives.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveExtendedWorkspaces.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveCharacterWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveOrganizationWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateSelectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/organizationStateSelectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/peopleInstitutionClosure.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStateInstitutionExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/characterStatusKnowledge.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'CharactersWorkspace', './SuccessionArchiveCharacterWorkspace'), 'characters must use the dedicated dossier module');
assert(sourceImportsDefault(app, 'OrganizationsWorkspace', './SuccessionArchiveOrganizationWorkspace'), 'organizations must use the dedicated dossier module');
assert(sourceRendersRouteWith(app, 'characters', 'CharactersWorkspace'), 'characters route must render the dedicated dossier workspace');
assert(sourceRendersRouteWith(app, 'organizations', 'OrganizationsWorkspace'), 'organizations route must render the dedicated dossier workspace');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'characters'), 'characters must remain a specialized record route');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'organizations'), 'organizations must remain a specialized record route');
assert(app.includes("linkedEntity?.entityType === 'character'"), 'role routes must normalize character entities');
assert(app.includes("linkedEntity?.entityType === 'organization'"), 'role routes must normalize organization entities');
assert(app.includes('showCharacterDossier') && app.includes('showOrganizationDossier'), 'legacy role-route URLs must bypass the generic entity detail for people and institutions');
assert(primitives.includes("if (entity.entityType === 'character') return 'characters'"), 'shared links must route characters canonically');
assert(primitives.includes("if (entity.entityType === 'organization') return 'organizations'"), 'shared links must route organizations canonically');
assert(!/import\s*\{[^}]*CharactersWorkspace[^}]*\}\s*from\s*['"]\.\/SuccessionArchiveExtendedWorkspaces['"]/.test(app), 'the obsolete generic character workspace must not be imported');
assert(!/import\s*\{[^}]*OrganizationsWorkspace[^}]*\}\s*from\s*['"]\.\/SuccessionArchiveExtendedWorkspaces['"]/.test(app), 'the obsolete generic organization workspace must not be imported');
assert(extendedWorkspaces.includes('export function CharactersWorkspace'), 'legacy character implementation may remain only as inactive migration code until a later dead-code cleanup');
assert(extendedWorkspaces.includes('export function OrganizationsWorkspace'), 'legacy organization implementation may remain only as inactive migration code until a later dead-code cleanup');

assert(dataEntry.includes('createPeopleInstitutionClosure'), 'public data entry must instantiate the Batch 2 closure contract');
assert(dataEntry.includes('getPeopleInstitutionClosureReport'), 'public data entry must expose the closure report');
assert(dataEntry.includes('getCanonicalPeopleInstitutionRoute'), 'public data entry must expose canonical route resolution');
assert(dataEntry.includes('getCharacterAffiliationsAtChapter'), 'public data entry must expose chapter-bounded affiliations');
assert(characterSelectors.includes('characterStatusKnowledge'), 'character selectors must consume chapter-bounded status knowledge');
assert(characterSelectors.includes('entityAvailableAtChapter'), 'character abilities must be bounded by first supporting chapter');
assert(characterSelectors.includes('getCharacterAffiliationsAtChapter'), 'character affiliations must use institution personnel history');
assert(characterSelectors.includes('sourceAtChapter'), 'character evidence must be bounded by selected chapter');
assert(characterSelectors.includes("latestLife === 'dead' ? 'unknown'"), 'unrevealed derived deaths must remain unknown');
assert(organizationSelectors.includes('source.chapter <= parsedChapter'), 'organization evidence must remain chapter bounded');
assert(closureSource.includes("const PEOPLE_ROUTE = 'characters'"), 'closure contract must own the people route');
assert(closureSource.includes("const INSTITUTION_ROUTE = 'organizations'"), 'closure contract must own the institution route');
assert(closureSource.includes('priorityCharacterGaps'), 'closure contract must report unresolved priority profiles');
assert(closureSource.includes("status: closureReady ? 'closed' : 'open'"), 'closure contract must publish an explicit open or closed state');
assert(statusKnowledgeSource.includes('deathLedger'), 'derived status knowledge must reuse the maintained death ledger');
for (const characterId of [
  'character:cheadle-yorkshire',
  'character:nasubi-hui-guo-rou',
  'character:kaiser',
  'character:onior-longbao',
  'character:brocco-li',
  'character:chrollo-lucilfer',
]) assert(institutionExpansion.includes(characterId), `institution expansion must include ${characterId}`);
assert(institutionExpansion.includes("characterId: 'character:borksen'") && institutionExpansion.includes('start: 410'), 'Borksen must have a post-recruitment character state');
assert(characterWorkspace.includes('Characters as chapter-bounded operational records'), 'character workspace must retain the chapter-state model');
assert(organizationWorkspace.includes('Organizations as chapter-bounded systems of authority'), 'organization workspace must retain the institutional-state model');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getCanonicalPeopleInstitutionRoute,
    getCharacterAffiliationsAtChapter,
    getCharacterDossier,
    getCharacterStateAtChapter,
    getCharacterStateCoverageReport,
    getEntitiesByType,
    getEntityById,
    getOrganizationDossier,
    getOrganizationStateCoverageReport,
    getPeopleInstitutionClosureReport,
    getPeopleInstitutionCoverageGaps,
    getPeopleInstitutionRecord,
    searchSuccessionArchive,
    successionArchiveData,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'canonical schema must remain valid');
  const chapters = getEntitiesByType('chapter');
  const latestChapter = chapters.at(-1)?.number || 414;
  const characters = getEntitiesByType('character');
  const organizations = getEntitiesByType('organization');
  assert(characters.length > 0 && organizations.length >= 11, 'people and institution catalogues must remain populated');

  const closure = getPeopleInstitutionClosureReport(latestChapter);
  assert(closure?.closureReady && closure.status === 'closed', 'latest Batch 2 closure report must be closed');
  assert(closure.characters.dossiers === characters.length, 'every canonical character must resolve a dossier');
  assert(closure.organizations.dossiers === organizations.length, 'every canonical organization must resolve a dossier');
  assert(closure.organizations.explicit === organizations.length, 'every canonical organization must retain explicit state coverage');
  assert(closure.characters.priorityExplicit === closure.characters.priorityTotal, 'every priority character must retain explicit state coverage');
  assert(closure.routes.violations.length === 0, 'people and institutions must have no canonical route violations');
  assert(closure.invalidCharacters.length === 0, 'latest character dossiers must satisfy the closure contract');
  assert(closure.invalidOrganizations.length === 0, 'latest organization dossiers must satisfy the closure contract');

  const characterCoverage = getCharacterStateCoverageReport();
  const organizationCoverage = getOrganizationStateCoverageReport();
  assert(characterCoverage.explicitCharacters >= 42, 'institution leaders must raise explicit character coverage to at least forty-two');
  assert(organizationCoverage.coveragePercent === 100, 'organization coverage must remain complete');
  const gaps = getPeopleInstitutionCoverageGaps();
  assert(gaps.priorityCharacterGaps.length === 0, 'derived character fallbacks may remain only for non-priority supporting records');
  assert(gaps.missingOrganizations.length === 0, 'no organization may rely on a derived fallback at Batch 2 closure');

  for (const character of characters) {
    assert(getCanonicalPeopleInstitutionRoute(character) === 'characters', `${character.id} must resolve the characters route`);
    const record = getPeopleInstitutionRecord(character.id, latestChapter);
    assert(record?.route === 'characters' && record.dossier?.character?.id === character.id, `${character.id} must resolve its canonical dossier`);
  }
  for (const organization of organizations) {
    assert(getCanonicalPeopleInstitutionRoute(organization) === 'organizations', `${organization.id} must resolve the organizations route`);
    const record = getPeopleInstitutionRecord(organization.id, latestChapter);
    assert(record?.route === 'organizations' && record.dossier?.organization?.id === organization.id, `${organization.id} must resolve its canonical dossier`);
  }

  for (const leaderId of closure.institutionLeadershipIds) {
    assert(getEntityById(leaderId)?.entityType === 'character', `${leaderId} must resolve a canonical leader character`);
    assert((successionArchiveData.characterStateProfiles?.[leaderId] || []).length > 0, `${leaderId} must have an explicit character-state profile`);
  }

  for (const [characterId, records] of Object.entries(successionArchiveData.characterStateProfiles || {})) {
    assert(getEntityById(characterId)?.entityType === 'character', `${characterId} profile must reference a canonical character`);
    for (const record of records) {
      if (record.locationId) assert(getEntityById(record.locationId)?.entityType === 'location', `${record.id} references missing location ${record.locationId}`);
      for (const sourceId of record.sourceIds || []) assert(getEntityById(sourceId)?.entityType === 'source', `${record.id} references missing source ${sourceId}`);
    }
  }

  const checkpoints = [340, 349, 358, 376, 383, 399, 406, 407, 409, 410, latestChapter]
    .filter((chapter, index, values) => chapter <= latestChapter && values.indexOf(chapter) === index);
  for (const chapter of checkpoints) {
    for (const character of characters) {
      const dossier = getCharacterDossier(character.id, chapter);
      assert(dossier?.chapter === chapter, `${character.id} dossier must resolve Chapter ${chapter}`);
      assert(dossier.state && dossier.roleProfile, `${character.id} must retain state and role profile at Chapter ${chapter}`);
      assert(!dossier.timeline.some((record) => record.chapterRange.start > chapter), `${character.id} exposes a future state at Chapter ${chapter}`);
      assert(!dossier.lifetimeTimeline.some((record) => record.chapterRange.start > chapter), `${character.id} exposes a future chronology entry at Chapter ${chapter}`);
      assert(!dossier.sources.some((source) => source.chapter && source.chapter > chapter), `${character.id} exposes a future source at Chapter ${chapter}`);
      assert(!dossier.abilities.some((ability) => {
        const sourceChapters = (ability.sourceIds || []).map((sourceId) => getEntityById(sourceId)?.chapter).filter(Boolean);
        return sourceChapters.length > 0 && Math.min(...sourceChapters) > chapter;
      }), `${character.id} exposes a future ability at Chapter ${chapter}`);
      assert(!dossier.affiliations.some((affiliation) => {
        const transition = affiliation.transitionId
          ? Object.values(successionArchiveData.organizationPersonnelHistory || {}).flat().find((record) => record.id === affiliation.transitionId)
          : null;
        return transition && transition.chapterRange.start > chapter;
      }), `${character.id} exposes a future affiliation at Chapter ${chapter}`);
    }
    for (const organization of organizations) {
      const dossier = getOrganizationDossier(organization.id, chapter);
      assert(dossier?.chapter === chapter, `${organization.id} dossier must resolve Chapter ${chapter}`);
      assert(!dossier.personnelHistory.some((record) => record.chapterRange.start > chapter), `${organization.id} exposes future personnel at Chapter ${chapter}`);
      assert(!dossier.sources.some((source) => source.chapter && source.chapter > chapter), `${organization.id} exposes a future source at Chapter ${chapter}`);
    }
  }

  assert(getCharacterStateAtChapter('character:woody', 358)?.life === 'unknown', 'Woody’s death must remain unrevealed before Chapter 359');
  assert(getCharacterStateAtChapter('character:woody', 359)?.life === 'dead', 'Woody’s death must resolve at Chapter 359');
  assert(getCharacterStateAtChapter('character:vincent', 360)?.life === 'unknown', 'Vincent’s death must remain unrevealed before Chapter 361');
  assert(getCharacterStateAtChapter('character:vincent', 361)?.life === 'dead', 'Vincent’s death must resolve at Chapter 361');
  assert(getCharacterStateAtChapter('character:lynch-fullbokko', 404)?.life === 'unknown', 'Lynch’s death must remain unrevealed before Chapter 405');
  assert(getCharacterStateAtChapter('character:lynch-fullbokko', 405)?.life === 'dead', 'Lynch’s death must resolve when revealed in Chapter 405');

  const borksen406 = getCharacterAffiliationsAtChapter('character:borksen', 406);
  const borksen409 = getCharacterAffiliationsAtChapter('character:borksen', 409);
  const borksen410 = getCharacterAffiliationsAtChapter('character:borksen', 410);
  assert(borksen406.some((record) => record.organizationId === 'organization:kakin-military'), 'Borksen must retain military service through Chapter 406');
  assert(!borksen406.some((record) => record.organizationId === 'organization:heil-ly'), 'Borksen must not appear in Heil-Ly before recruitment');
  assert(borksen409.some((record) => record.organizationId === 'organization:heil-ly' && record.status === 'recruiting'), 'Borksen must appear as a recruiting target at Chapter 409');
  assert(borksen410.some((record) => record.organizationId === 'organization:heil-ly' && record.status === 'active'), 'Borksen must appear as an active member at Chapter 410');
  assert(getCharacterStateAtChapter('character:borksen', 409)?.operationalState.includes('recruitment game'), 'Borksen Chapter 409 state must remain inside the unresolved game');
  assert(getCharacterStateAtChapter('character:borksen', 410)?.operationalState.includes('reached Yes'), 'Borksen Chapter 410 state must reflect the confirmed outcome');

  const tserriednich384 = getCharacterDossier('character:tserriednich-hui-guo-rou', 384);
  const tserriednich385 = getCharacterDossier('character:tserriednich-hui-guo-rou', 385);
  assert(!tserriednich384.abilities.some((ability) => ability.id === 'ability:parallel-future'), 'Parallel Future must remain hidden before its Chapter 385 evidence');
  assert(tserriednich385.abilities.some((ability) => ability.id === 'ability:parallel-future'), 'Parallel Future must appear at Chapter 385');

  for (const entity of [...organizations, ...closure.priorityCharacterIds.map((id) => getEntityById(id)).filter(Boolean)]) {
    const results = searchSuccessionArchive(entity.name, { types: [entity.entityType], limit: 50 });
    assert(results.some((result) => result.entity.id === entity.id), `global search must resolve ${entity.id}`);
  }
  assert(searchSuccessionArchive('Hunter Association chair').some((result) => result.entity.id === 'character:cheadle-yorkshire'), 'leader-state search must resolve Cheadle');
  assert(searchSuccessionArchive('mafia cooperation is temporary and non-subordinate').some((result) => result.entity.id === 'character:chrollo-lucilfer'), 'leader-state search must resolve Chrollo');
  assert(searchSuccessionArchive('entered Morena’s community').some((result) => result.entity.id === 'character:borksen' || result.entity.id === 'organization:heil-ly'), 'cross-domain search must resolve the confirmed Borksen transition');

  console.log(`Succession people and institutions closure audit passed: ${characters.length} character dossiers, ${characterCoverage.explicitCharacters} explicit character profiles, ${organizations.length} fully explicit organization dossiers, ${closure.characters.priorityTotal} priority actors, canonical routing, chapter-bounded status, abilities, affiliations, personnel, evidence, and global search close Batch 2.`);
} finally {
  await vite.close();
}
