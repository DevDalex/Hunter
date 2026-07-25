import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession final product closure audit failed: ${message}`);
};

const [
  app,
  roleWorkspaces,
  deepWorkspaces,
  extended,
  glossaryWorkspace,
  mediaWorkspace,
  productStyles,
  searchStyles,
  dataEntry,
  productFoundation,
  productSelectors,
  finalSearchAdapter,
  schemaAdapter,
  finalReleaseSource,
  packageText,
] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveWorkspaces.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveDeepWorkspaces.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveExtendedWorkspaces.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveGlossaryWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveMediaWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveProductLibrary.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveSearch.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/entitiesProductClosureFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/productClosureSelectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/productClosureSelectorsFinal.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/schemasFinal.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/finalReleaseClosure.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
]);
const packageJson = JSON.parse(packageText);

assert(sourceImportsDefault(app, 'GlossaryWorkspace', './SuccessionArchiveGlossaryWorkspace'), 'Glossary must use the canonical dedicated module');
assert(sourceImportsDefault(app, 'MediaWorkspace', './SuccessionArchiveMediaWorkspace'), 'Media must use the canonical dedicated module');
assert(sourceRendersRouteWith(app, 'glossary', 'GlossaryWorkspace'), 'glossary route must render the canonical workspace');
assert(sourceRendersRouteWith(app, 'media', 'MediaWorkspace'), 'media route must render the canonical workspace');
assert(declarationIncludesLiteral(app, 'dedicated', 'glossary') && declarationIncludesLiteral(app, 'dedicated', 'media'), 'Glossary and Media must remain dedicated routes');
assert(app.includes('searchArchiveProduct') && app.includes('matchReason') && app.includes('succession-search-complete__groups'), 'global search must use grouped explained product results');
assert(app.includes('routeParams={routeParams} spoilerLimit={spoilerLimit}'), 'Library and role routes must receive deep-link parameters and the chapter boundary');
assert(app.includes("<PrincesWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit}") && app.includes("<MafiaWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit}"), 'Royal Family and Mafia role routes must remain chapter-bounded');
assert(app.includes('<QueensWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit}') && app.includes('<BodyStatesWorkspace spoilerLimit={spoilerLimit}'), 'Queens and body-state role routes must remain chapter-bounded');

for (const removedExport of ['CharactersWorkspace', 'OrganizationsWorkspace', 'LocationsWorkspace', 'ResearchWorkspace', 'GlossaryWorkspace', 'MediaWorkspace']) {
  assert(!extended.includes(`export function ${removedExport}`), `${removedExport} legacy export must be removed from the shared module`);
}
assert(!extended.includes("../../data/successionDossier") && !extended.includes("../../data/successionArchive"), 'active extended role workspaces must not import legacy dossier or archive ledgers');
assert(extended.includes('export function HuntersWorkspace') && extended.includes('export function MilitaryWorkspace') && extended.includes('export function PoliticsWorkspace'), 'the three active extended role views must remain available');

assert(!roleWorkspaces.includes("../../data/successionDossier") && !roleWorkspaces.includes('SuccessionStoryWorkspace'), 'Royal Family and Mafia must not depend on the legacy dossier or static Story workspace');
assert(roleWorkspaces.includes('getCharacterDossier') && roleWorkspaces.includes('getOrganizationDossier'), 'Royal Family and Mafia must use canonical dossiers');
assert(roleWorkspaces.includes('export function PrincesWorkspace') && roleWorkspaces.includes('export function MafiaWorkspace'), 'the two active role workspaces must remain available');
for (const removed of ['SuccessionStoryWorkspace', 'GuardianBeastsWorkspace', 'EventsWorkspace', 'BodyguardsWorkspace', 'RelationshipsWorkspace', 'ChapterRecordsWorkspace']) {
  assert(!deepWorkspaces.includes(`export function ${removed}`) && !roleWorkspaces.includes(`export function ${removed}`), `${removed} inactive implementation must remain removed`);
}
assert(!deepWorkspaces.includes("../../data/successionDossier") && !deepWorkspaces.includes("../../data/successionArchive"), 'Queens and body states must not depend on static legacy ledgers');
assert(deepWorkspaces.includes('getCharacterDossier') && deepWorkspaces.includes('export function QueensWorkspace') && deepWorkspaces.includes('export function BodyStatesWorkspace'), 'Queens and body states must use canonical character dossiers');

assert(glossaryWorkspace.includes('getGlossaryEntriesAtChapter') && glossaryWorkspace.includes('getGlossaryEntryAtChapter'), 'Glossary workspace must use chapter-bounded canonical selectors');
assert(glossaryWorkspace.includes('SourceReference') && glossaryWorkspace.includes('EntityLink'), 'Glossary dossiers must expose evidence and graph connections');
assert(mediaWorkspace.includes('getMediaRecordsAtChapter') && mediaWorkspace.includes('getMediaRecord'), 'Media workspace must use canonical media selectors');
assert(mediaWorkspace.includes('record.alt') && mediaWorkspace.includes('provenanceUrl'), 'Media workspace must expose alt text and provenance');
assert(productStyles.includes('@media(max-width:520px)') && productStyles.includes('@media(prefers-reduced-motion:reduce)'), 'Library workspaces must include mobile and reduced-motion handling');
assert(searchStyles.includes('@media(max-width:620px)') && searchStyles.includes('font-size: 11px'), 'Grouped search must include mobile handling and the readability floor');

assert(dataEntry.includes("from './entitiesProductClosureCorrections.js'"), 'public data must activate the corrected Batch 5 foundation');
assert(dataEntry.includes("from './indexesFinal.js'"), 'product records must remain outside canonical entity indexes');
assert(dataEntry.includes("from './schemasFinal.js'"), 'product records must remain outside canonical entity validation');
assert(dataEntry.includes("from './productClosureSelectorsFinal.js'"), 'public search must use the final Story adapter');
assert(dataEntry.includes('getFinalReleaseClosureReport'), 'public data must expose the definitive release report');
assert(schemaAdapter.includes('glossaryEntries: Object.freeze({})') && schemaAdapter.includes('mediaRecords: Object.freeze({})'), 'schema adapter must validate only canonical entity collections');
assert(productFoundation.includes('successionGlossaryEntries') && productFoundation.includes('successionMediaRecords'), 'Batch 5 foundation must publish glossary and media records');
assert(productFoundation.includes('consolidatedMedia'), 'duplicate media sources must be consolidated in the foundation');
assert(productSelectors.includes('normalizeArchiveSearchText') && productSelectors.includes('matchReason'), 'product selectors must normalize and explain search matches');
assert(finalSearchAdapter.includes('unavailableAbilities') && finalSearchAdapter.includes('later ability details remain hidden'), 'Story search must suppress future ability language');
assert(finalReleaseSource.includes("status: closureReady ? 'release-candidate' : 'open'"), 'final report must distinguish release candidate from deployed closure');
assert(packageJson.scripts?.['audit:succession-final-product'] === 'node scripts/audit-succession-final-product-closure.mjs', 'package scripts must expose the Batch 5 audit');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const latestChapter = archive.getEntitiesByType('chapter').at(-1)?.number;
  assert(Number.isFinite(latestChapter), 'latest chapter must remain available');
  assert(archive.successionArchiveValidation.valid, 'canonical data must validate after Batch 5');

  const product = archive.getProductClosureReport();
  assert(product?.closureReady && product.status === 'release-candidate', 'product library must reach release-candidate state');
  assert(product.glossary.total >= 24 && product.glossary.referenceIssues.length === 0, 'glossary must contain at least twenty-four fully resolved records');
  assert(product.media.total > 0 && product.media.issues.length === 0, 'media library must contain valid consolidated records');
  assert(product.search.explainsMatches && product.search.chapterBounded, 'search closure must explain matches and preserve the reading boundary');

  const finalReport = archive.getFinalReleaseClosureReport();
  assert(finalReport?.closureReady && finalReport.status === 'release-candidate', 'all Batch 1–5 static and runtime gates must form a release candidate');
  assert(finalReport.deploymentRequiredForClosedStatus, 'only the external deployment may promote release-candidate to closed');
  for (const key of ['canonicalData', 'foundationEvidence', 'peopleInstitutions', 'nenSystems', 'storyIntelligence', 'searchGlossaryMedia']) assert(finalReport.releaseGates[key], `${key} final release gate must pass`);

  const glossary = archive.getGlossaryEntriesAtChapter(latestChapter);
  assert(glossary.length >= 24, 'latest glossary must expose the complete maintained vocabulary');
  assert(archive.getGlossaryEntryAtChapter('glossary:parallel-future', 384) === null, 'Parallel Future glossary definition must remain hidden before Chapter 385');
  assert(archive.getGlossaryEntryAtChapter('glossary:parallel-future', 385)?.term === 'Parallel Future', 'Parallel Future glossary definition must appear at Chapter 385');
  assert(archive.getGlossaryEntryAtChapter('glossary:guardian-spirit-beast', 349)?.related.length >= 15, 'Guardian Spirit Beast glossary entry must connect to the ritual and beast graph');
  assert(archive.getEntityById('glossary:parallel-future') === null, 'glossary records must not pollute canonical entity indexes');

  const media = archive.getMediaRecordsAtChapter(latestChapter);
  assert(media.length === product.media.total, 'all latest media records must resolve through the public selector');
  assert(media.every((record) => record.src && record.alt && record.provenanceUrl && record.subjects.length > 0), 'every media record must have source, alt, provenance, and canonical subjects');
  assert(new Set(media.map((record) => record.src)).size === media.length, 'media sources must be consolidated without duplicate URLs');

  const search = (query, chapter = latestChapter, options = {}) => archive.searchArchiveProduct(query, { chapter, limit: 100, ...options });
  const borksenPlain = search('Borksen autonomy', 410);
  const borksenPossessive = search("Borksen's autonomy", 410);
  assert(borksenPlain.some((result) => result.id === 'story-thread:borksen-autonomy'), 'plain possessive-free query must resolve the Borksen thread');
  assert(borksenPossessive.some((result) => result.id === 'story-thread:borksen-autonomy'), 'possessive query must resolve the same Borksen thread');
  assert(!search('Borksen autonomy', 409).some((result) => result.id === 'story-thread:borksen-autonomy'), 'Borksen autonomy must remain hidden before Chapter 410');
  assert(search('Sale sale', latestChapter).some((result) => result.entity?.id === 'character:sale-sale-hui-guo-rou'), 'diacritic-free and hyphen-free search must resolve Salé-salé');
  assert(search('fourteenth prince', latestChapter).some((result) => result.entity?.id === 'character:woble-hui-guo-rou'), 'ordinal normalization must resolve Woble');
  assert(search('GSB', 349).some((result) => result.id === 'glossary:guardian-spirit-beast'), 'glossary synonyms must participate in global search');
  assert(!search('Parallel Future', 384).some((result) => result.entity?.id === 'ability:parallel-future' || result.id === 'glossary:parallel-future' || result.id === 'story-thread:tserriednich-future-growth'), 'future ability names must remain hidden before their evidence chapter');
  assert(search('ten second precognitive vision', 385).some((result) => result.entity?.id === 'ability:parallel-future' || result.id === 'glossary:parallel-future'), 'ability mechanics must resolve when available');
  assert(search('Room 1014').some((result) => result.domain === 'location') && search('Room 1014').some((result) => result.domain === 'glossary'), 'global search must group canonical entity and glossary matches');
  assert(search('Guardian Spirit Beast').every((result) => typeof result.matchReason === 'string' && result.matchReason.length > 0), 'every result must explain why it matched');
  assert(archive.searchSuccessionArchive('Kurapika', { chapter: latestChapter }).some((result) => result.entity.id === 'character:kurapika'), 'legacy entity-search API must remain compatible');

  for (const report of [archive.getPeopleInstitutionClosureReport(), archive.getNenSystemClosureReport(), archive.getStoryIntelligenceClosureReport(), archive.getFoundationClosureReport()]) assert(report?.closureReady, 'all earlier batch closure reports must remain closed');

  console.log(`Succession final product closure audit passed: ${glossary.length} glossary records, ${media.length} consolidated media records, grouped explained chapter-safe search, inactive workspace and legacy-ledger removal, product-safe schema and indexes, responsive and reduced-motion Library presentation, all Batch 1–4 closures, and the definitive release-candidate report are active.`);
} finally {
  await vite.close();
}
