import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession final product closure audit failed: ${message}`);
};

const [
  app,
  glossaryWorkspace,
  mediaWorkspace,
  productStyles,
  productLinkStyles,
  searchStyles,
  browserQa,
  dataEntry,
  productFoundation,
  productSelectors,
  finalSearchAdapter,
  schemaAdapter,
  productInventorySource,
  finalReleaseSource,
  packageText,
] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveGlossaryWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveMediaWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveProductLibrary.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveProductLibraryLinks.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveSearch.css', import.meta.url), 'utf8'),
  readFile(new URL('./succession-final-product-qa.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/entitiesProductClosureFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/productClosureSelectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/productClosureSelectorsFinal.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/schemasFinal.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/productInventory.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/finalReleaseClosure.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
]);
const packageJson = JSON.parse(packageText);

assert(sourceImportsDefault(app, 'GlossaryWorkspace', './SuccessionArchiveGlossaryWorkspace'), 'Glossary must use the canonical dedicated module');
assert(sourceRendersRouteWith(app, 'glossary', 'GlossaryWorkspace'), 'glossary route must render the canonical workspace');
assert(sourceImportsDefault(app, 'OrganizationsWorkspace', './SuccessionArchiveOrganizationWorkspace'), 'Organizations must use the canonical institution module');
assert(sourceRendersRouteWith(app, 'organizations', 'OrganizationsWorkspace'), 'Organizations must render the consolidated power workspace');
assert(sourceImportsDefault(app, 'CharactersWorkspace', './SuccessionArchiveCharacterWorkspace'), 'Characters must use the canonical character module');
assert(sourceRendersRouteWith(app, 'characters', 'CharactersWorkspace'), 'Characters must render the authoritative people workspace');
assert(app.includes('searchArchiveProduct') && app.includes('matchReason') && app.includes('succession-search-complete__groups'), 'global search must use grouped explained product results');
for (const removedComponent of ['HuntersWorkspace', 'MafiaWorkspace', 'MilitaryWorkspace', 'PoliticsWorkspace', 'BodyStatesWorkspace', 'MediaWorkspace']) {
  assert(!app.includes(removedComponent), `${removedComponent} must not remain imported or rendered by the active application`);
}

assert(glossaryWorkspace.includes('getGlossaryEntriesAtChapter') && glossaryWorkspace.includes('getGlossaryEntryAtChapter'), 'Glossary workspace must use chapter-bounded canonical selectors');
assert(glossaryWorkspace.includes('SourceReference') && glossaryWorkspace.includes('EntityLink') && glossaryWorkspace.includes('relatedRecords'), 'Glossary dossiers must expose evidence and graph connections');
assert(mediaWorkspace.includes('getMediaRecordsAtChapter') && mediaWorkspace.includes('getMediaRecord'), 'maintained media selectors must remain available even without a standalone public route');
assert(mediaWorkspace.includes('record.alt') && mediaWorkspace.includes('provenanceUrl'), 'maintained media records must retain alt text and provenance');
assert(productStyles.includes('@media(max-width:520px)') && productStyles.includes('@media(prefers-reduced-motion:reduce)'), 'product workspaces must include mobile and reduced-motion handling');
assert(productLinkStyles.includes('.succession-product-links > button') && productLinkStyles.includes('font-size: 11px'), 'extended graph links must have mobile-safe styles');
assert(searchStyles.includes('@media(max-width:620px)') && searchStyles.includes('font-size: 11px'), 'grouped search must include mobile handling and the readability floor');
assert(browserQa.includes('Grouped search explains glossary and media matches'), 'browser QA must retain grouped search and media-result coverage');
assert(browserQa.includes('Retired Succession routes resolve to maintained workspaces'), 'browser QA must verify every retired route reaches a maintained destination');
assert(!browserQa.includes('Media library exposes alt text provenance and canonical subjects'), 'browser QA must not reopen the removed standalone Media page');

assert(dataEntry.includes("from './entitiesProductClosureCorrections.js'"), 'public data must activate the corrected Batch 5 foundation');
assert(dataEntry.includes("from './indexesFinal.js'"), 'product records must remain outside canonical entity indexes');
assert(dataEntry.includes("from './schemasFinal.js'"), 'product records must remain outside canonical entity validation');
assert(dataEntry.includes("from './productClosureSelectorsFinal.js'"), 'public search must use the final Story adapter');
assert(dataEntry.includes('getFinalReleaseClosureReport'), 'public data must expose the definitive release report');
assert(schemaAdapter.includes('glossaryEntries: Object.freeze({})') && schemaAdapter.includes('mediaRecords: Object.freeze({})'), 'schema adapter must validate only canonical entity collections');
assert(productFoundation.includes('successionGlossaryEntries') && productFoundation.includes('successionMediaRecords'), 'Batch 5 foundation must publish glossary and media records');
assert(productFoundation.includes('consolidatedMedia'), 'duplicate media sources must be consolidated in the foundation');
assert(productSelectors.includes('normalizeArchiveSearchText') && productSelectors.includes('matchReason') && productSelectors.includes('royal order'), 'product selectors must normalize, explain, and index royal-order searches');
assert(productSelectors.includes('label: names.length === 1') && productSelectors.includes('alt: names.length === 1'), 'media labels and alt text must be rebuilt from chapter-visible subjects');
assert(finalSearchAdapter.includes('unavailableAbilities') && finalSearchAdapter.includes('later ability details remain hidden'), 'Story search must suppress future ability language');
assert(finalSearchAdapter.includes('relatedRecords') && finalSearchAdapter.includes("domain: 'media'"), 'final adapter must connect glossary systems and index media results');
assert(finalSearchAdapter.includes("route: 'research'"), 'media search results must resolve through the maintained Research workspace');
assert(productInventorySource.includes('authoritativeWorkspaces') && productInventorySource.includes('preservedVisualTools') && productInventorySource.includes('legacyAliases'), 'Batch 5 must publish the maintained product inventory and redirects');
assert(productInventorySource.includes('successionArchiveLegacyTargets'), 'product inventory aliases must derive from the canonical route registry');
assert(finalReleaseSource.includes("status: closureReady ? 'release-candidate' : 'open'"), 'final report must distinguish release candidate from deployed closure');
assert(finalReleaseSource.includes('successionArchiveRoutes.every') && finalReleaseSource.includes('inventoryReady'), 'final report must derive inventory completeness from the route registry');
assert(finalReleaseSource.includes('performanceBuild') && finalReleaseSource.includes('browserInteractionQa') && finalReleaseSource.includes('cloudflareDeployment'), 'final report must preserve external build, browser, and deployment gates');
assert(packageJson.scripts?.['audit:succession-product-inventory'] === 'node scripts/audit-succession-product-inventory.mjs', 'package scripts must expose the inventory audit');
assert(packageJson.scripts?.['audit:succession-final-product'] === 'node scripts/audit-succession-final-product-closure.mjs', 'package scripts must expose the final product audit');
assert(packageJson.scripts?.['qa:succession-final-product'] === 'node scripts/succession-final-product-qa.mjs', 'package scripts must expose browser QA');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const routes = await vite.ssrLoadModule('/src/data/succession/archiveRoutes.js');
  const latestChapter = archive.getEntitiesByType('chapter').at(-1)?.number;
  assert(Number.isFinite(latestChapter), 'latest chapter must remain available');
  assert(archive.successionArchiveValidation.valid, 'canonical data must validate after route consolidation');

  const routeIds = new Set(routes.successionArchiveRoutes.map((route) => route.id));
  for (const [retired, destination] of Object.entries(routes.successionArchiveRetiredTargets)) {
    assert(!routeIds.has(retired), `${retired} must not remain a primary route`);
    assert(routes.successionArchiveLegacyTargets[retired] === destination, `${retired} must redirect to ${destination}`);
    assert(routes.successionArchivePathToTarget.get(retired) === destination, `${retired} clean path must redirect to ${destination}`);
  }

  const product = archive.getProductClosureReport();
  assert(product?.closureReady && product.status === 'release-candidate', 'product library must reach release-candidate state');
  assert(product.glossary.total >= 24 && product.glossary.referenceIssues.length === 0, 'glossary must contain at least twenty-four fully resolved records');
  assert(product.media.total > 0 && product.media.issues.length === 0, 'underlying media records must remain valid after removing the standalone page');
  assert(product.search.explainsMatches && product.search.chapterBounded, 'search closure must explain matches and preserve the reading boundary');

  const finalReport = archive.getFinalReleaseClosureReport();
  assert(finalReport?.closureReady && finalReport.status === 'release-candidate', 'all Batch 1–5 static and runtime gates must form a release candidate');
  assert(Number.isInteger(finalReport.productInventory?.version) && finalReport.productInventory.version > 0, 'final report must expose a versioned maintained inventory');
  assert(finalReport.productInventory?.counts.authoritativeWorkspaces === finalReport.productInventory.authoritativeWorkspaces.length, 'authoritative workspace count must be derived from the inventory');
  assert(finalReport.productInventory?.counts.authoritativeWorkspaces === routes.successionArchiveRoutes.length - finalReport.productInventory.preservedVisualTools.length, 'inventory and route registry must describe the same active surface');
  assert(finalReport.productInventory?.counts.preservedVisualTools === finalReport.productInventory.preservedVisualTools.length, 'final report must expose all preserved tools');
  assert(finalReport.productInventory?.counts.releaseGates === finalReport.productInventory.releaseGates.length, 'final report must expose all release gates');
  assert(finalReport.deploymentRequiredForClosedStatus, 'only the external deployment may promote release-candidate to closed');

  const glossary = archive.getGlossaryEntriesAtChapter(latestChapter);
  assert(glossary.length >= 24, 'latest glossary must expose the complete maintained vocabulary');
  assert(archive.getGlossaryEntryAtChapter('glossary:parallel-future', 384) === null, 'Parallel Future glossary definition must remain hidden before Chapter 385');
  assert(archive.getGlossaryEntryAtChapter('glossary:parallel-future', 385)?.term === 'Parallel Future', 'Parallel Future glossary definition must appear at Chapter 385');
  const media = archive.getMediaRecordsAtChapter(latestChapter);
  assert(media.length === product.media.total, 'all latest media records must resolve through the public selector');
  assert(media.every((record) => record.src && record.alt && record.provenanceUrl && record.subjects.length > 0), 'every media record must have source, alt, provenance, and canonical subjects');
  assert(new Set(media.map((record) => record.src)).size === media.length, 'media sources must be consolidated without duplicate URLs');

  const search = (query, chapter = latestChapter, options = {}) => archive.searchArchiveProduct(query, { chapter, limit: 100, ...options });
  assert(search('Borksen autonomy', 410).some((result) => result.id === 'story-thread:borksen-autonomy'), 'Borksen thread search must remain available');
  assert(!search('Borksen autonomy', 409).some((result) => result.id === 'story-thread:borksen-autonomy'), 'Borksen autonomy must remain hidden before Chapter 410');
  assert(search('GSB', 349).some((result) => result.id === 'glossary:guardian-spirit-beast'), 'glossary synonyms must participate in global search');
  const mediaSearchResult = search('Kurapika portrait').find((result) => result.domain === 'media');
  assert(mediaSearchResult?.route === 'research' && mediaSearchResult.params?.media, 'media search must resolve through Research while preserving the selected media record');
  assert(search('Guardian Spirit Beast').every((result) => typeof result.matchReason === 'string' && result.matchReason.length > 0), 'every result must explain why it matched');

  console.log(`Succession final product closure audit passed: ${routes.successionArchiveRoutes.length} consolidated routes, ${finalReport.productInventory.counts.authoritativeWorkspaces} authoritative workspaces, three preserved tools, ${glossary.length} glossary records, ${media.length} maintained media records, registry-derived inventory closure, and legacy redirects verified.`);
} finally {
  await vite.close();
}
