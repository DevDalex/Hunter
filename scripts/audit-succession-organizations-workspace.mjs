import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession organization workspace audit failed: ${message}`);
};

const [workspace, styles, app, primitives, dataEntry, foundation, selectorSource] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveOrganizationWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveOrganizationWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchivePrimitives.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/organizationStateFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/organizationStateSelectors.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'OrganizationsWorkspace', './SuccessionArchiveOrganizationWorkspace'), 'app must import the dedicated organization workspace');
assert(sourceRendersRouteWith(app, 'organizations', 'OrganizationsWorkspace'), 'organizations route must render the dedicated workspace');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'organizations'), 'organization entity routes must remain specialized');
assert(app.includes("linkedEntity?.entityType === 'organization'"), 'role-route organization links must normalize to the organization workspace');
assert(app.includes('showOrganizationDossier') && app.includes("selectedEntity?.entityType === 'organization'"), 'legacy role-route organization URLs must render the dedicated dossier');
assert(primitives.includes("if (entity.entityType === 'organization') return 'organizations'"), 'shared entity links must route every organization to its dedicated dossier');
assert(dataEntry.includes("from './entitiesOrganizationFoundation.js'"), 'public data entry must activate the organization foundation');
assert(dataEntry.includes('getOrganizationDossier'), 'public data entry must expose organization dossiers');
assert(dataEntry.includes('searchOrganizationsByState'), 'organization state language must participate in global search');
assert(foundation.includes('organizationStateProfiles'), 'foundation must publish chapter-bounded organization states');
assert(foundation.includes('organizationPersonnelHistory'), 'foundation must publish personnel transitions separately');
assert(foundation.includes("organizationId: 'organization:heil-ly'"), 'Heil-Ly state history must be explicit');
assert(foundation.includes("organizationId: 'organization:kakin-justice-bureau'"), 'Justice state history must be explicit');
assert(foundation.includes("organizationId: 'organization:benjamin-private-army'"), 'Benjamin command crisis must be explicit');
assert(selectorSource.includes('getOrganizationStateAtChapter'), 'selectors must resolve chapter-bounded organization state');
assert(selectorSource.includes('getOrganizationPersonnelAtChapter'), 'selectors must resolve chapter-bounded personnel state');
assert(selectorSource.includes('getOrganizationHierarchy'), 'selectors must compose parent and child organizations');
assert(selectorSource.includes('getOrganizationDossier'), 'selectors must compose full institutional dossiers');
assert(selectorSource.includes('getOrganizationStateCoverageReport'), 'selectors must report organization coverage');
assert(workspace.includes('Organizations as chapter-bounded systems of authority'), 'workspace must identify the institutional state model');
assert(workspace.includes('Institutional hierarchy'), 'workspace must render parent and subordinate organizations');
assert(workspace.includes('Personnel history'), 'workspace must render leadership and membership transitions');
assert(workspace.includes('Current institutional priorities'), 'workspace must render chapter-specific objectives');
assert(workspace.includes('Operational risks and unresolved constraints'), 'workspace must expose institutional pressure');
assert(workspace.includes('SourceReference'), 'workspace must render evidence sources');
assert(styles.includes('.succession-organization-state-board'), 'styles must own the organization state board');
assert(styles.includes('.succession-organization-personnel-history'), 'styles must own personnel history');
assert(styles.includes('@media (max-width: 620px)'), 'workspace must include mobile handling');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'workspace must include reduced-motion handling');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getEntitiesByType,
    getEntityById,
    getOrganizationDossier,
    getOrganizationHierarchy,
    getOrganizationPersonnelAtChapter,
    getOrganizationPersonnelTimeline,
    getOrganizationStateAtChapter,
    getOrganizationStateCoverageReport,
    getOrganizationStateTimeline,
    getOrganizationsWithStateProfiles,
    searchSuccessionArchive,
    successionArchiveData,
    successionArchiveValidation,
  } = archive;

  assert(successionArchiveValidation.valid, 'organization foundation must preserve canonical schema validity');
  const organizations = getEntitiesByType('organization');
  assert(organizations.length >= 11, 'canonical organization roster must retain at least eleven institutions');
  assert(getOrganizationsWithStateProfiles().length === organizations.length, 'every canonical organization must have an explicit state profile');

  const coverage = getOrganizationStateCoverageReport();
  assert(coverage.explicitOrganizations === organizations.length, 'coverage report must show complete organization coverage');
  assert(coverage.coveragePercent === 100, 'organization state coverage must reach one hundred percent');

  for (const [organizationId, records] of Object.entries(successionArchiveData.organizationStateProfiles || {})) {
    assert(getEntityById(organizationId)?.entityType === 'organization', `${organizationId} profile must reference a canonical organization`);
    assert(records.length > 0, `${organizationId} must publish at least one state period`);
    for (const record of records) {
      for (const locationId of record.territoryIds || []) assert(getEntityById(locationId)?.entityType === 'location', `${record.id} references missing territory ${locationId}`);
      for (const eventId of record.relatedEventIds || []) assert(getEntityById(eventId)?.entityType === 'event', `${record.id} references missing event ${eventId}`);
      for (const sourceId of record.sourceIds || []) assert(getEntityById(sourceId)?.entityType === 'source', `${record.id} references missing source ${sourceId}`);
    }
  }

  for (const [organizationId, records] of Object.entries(successionArchiveData.organizationPersonnelHistory || {})) {
    assert(getEntityById(organizationId)?.entityType === 'organization', `${organizationId} personnel history must reference a canonical organization`);
    for (const record of records) {
      assert(getEntityById(record.characterId)?.entityType === 'character', `${record.id} references missing character ${record.characterId}`);
      for (const sourceId of record.sourceIds || []) assert(getEntityById(sourceId)?.entityType === 'source', `${record.id} references missing source ${sourceId}`);
    }
  }

  const benjaminHierarchy = getOrganizationHierarchy('organization:benjamin-private-army');
  assert(benjaminHierarchy?.parent?.id === 'organization:kakin-military', 'Benjamin’s Private Army must remain subordinate to the Kakin Military in the canonical hierarchy');
  const hunterHierarchy = getOrganizationHierarchy('organization:hunter-association');
  assert(hunterHierarchy?.children.some((organization) => organization.id === 'organization:zodiacs'), 'Hunter Association hierarchy must include the Zodiacs');

  const military410 = getOrganizationStateAtChapter('organization:kakin-military', 410);
  assert(military410?.operationalState.includes('martial-law'), 'Kakin Military Chapter 410 state must expose special martial-law expansion');
  assert(military410?.territoryIds.includes('location:black-whale:tier-3:security-checkpoint'), 'martial-law state must include the Tier 3 checkpoint');

  const benjamin403 = getOrganizationStateAtChapter('organization:benjamin-private-army', 403);
  assert(benjamin403?.operationalState.includes('identity and continuity crisis'), 'Benjamin army Chapter 403 state must expose the command identity crisis');
  assert(benjamin403?.certainty === 'probable', 'Benjamin command crisis must preserve interpretation certainty');

  const heilLy399 = getOrganizationStateAtChapter('organization:heil-ly', 399);
  assert(heilLy399?.territoryIds.includes('location:black-whale:tier-3:room-3101'), 'Heil-Ly Chapter 399 state must include Room 3101');
  assert(heilLy399?.objectiveStates.some((objective) => objective.includes('Recruit')), 'Heil-Ly current state must include recruitment objectives');

  const borksenPersonnel = getOrganizationPersonnelTimeline('organization:heil-ly').find((record) => record.characterId === 'character:borksen');
  assert(borksenPersonnel?.transitionType === 'recruitment', 'Borksen must be tracked as recruitment rather than assumed membership');
  assert(borksenPersonnel?.status === 'unresolved', 'Borksen’s allegiance must remain unresolved');
  assert(!getOrganizationPersonnelAtChapter('organization:heil-ly', 406).some((record) => record.characterId === 'character:borksen'), 'Borksen must not appear in Heil-Ly personnel before recruitment begins');

  const xiYu399 = getOrganizationDossier('organization:xi-yu', 399);
  assert(xiYu399?.territories.some((location) => location.id === 'location:black-whale:tier-3:room-3101'), 'Xi-Yu dossier must include Room 3101 territory at Chapter 399');
  assert(xiYu399?.activePersonnel.some((record) => record.character.id === 'character:hinrigh-biganduffno'), 'Xi-Yu dossier must include Hinrigh’s field command');
  assert(xiYu399?.eventHistory.some((event) => event.id === 'event:tier-3-padaille-battle'), 'Xi-Yu dossier must retain its Tier 3 battle history');

  const justice402 = getOrganizationDossier('organization:kakin-justice-bureau', 402);
  assert(justice402?.territories.some((location) => location.id === 'location:black-whale:tier-1:justice-bureau:medical-wing'), 'Justice dossier must include the protected medical wing');
  assert(justice402?.leaders.some((character) => character.id === 'character:kaiser'), 'Justice dossier must resolve Kaiser through active personnel history');

  assert(searchSuccessionArchive('identity and continuity crisis').some(({ entity }) => entity.id === 'organization:benjamin-private-army'), 'global search must resolve organization state language');
  assert(searchSuccessionArchive('rule-bound recruitment').some(({ entity }) => entity.id === 'organization:heil-ly'), 'global search must resolve organization operational language');

  console.log(`Succession organization workspace audit passed: ${organizations.length} organizations, ${coverage.coveragePercent}% explicit state coverage, hierarchy, territory, personnel transitions, assignments, relationships, events, evidence, search, routing, and responsive presentation are wired.`);
} finally {
  await vite.close();
}
