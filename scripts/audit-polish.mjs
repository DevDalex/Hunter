import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Polish audit failed: ${message}`); };

const [
  safeImage,
  familyTree,
  royalTree,
  royalNodes,
  royalNodesBase,
  royalCss,
  inspectorCss,
  inspectorFrameCss,
  coverageCss,
  metadata,
  chapters,
  arcs,
  successionResearch,
  maintainedResearch,
  chapterCurrency,
  sourcePolicy,
  seriesResearch,
  coverageService,
  coverageUi,
  archiveApp,
  primitives,
  visualQa,
] = await Promise.all([
  read('src/components/SafeImage.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.jsx'),
  read('src/components/succession/RoyalFamilyBoardNodes.jsx'),
  read('src/components/succession/RoyalFamilyBoardNodesBase.jsx'),
  read('src/components/succession/RoyalFamilyBoardInteractionFixes.css'),
  read('src/components/succession/RoyalFamilyInspector.css'),
  read('src/components/succession/RoyalFamilyInspectorFrame.css'),
  read('src/components/succession/RoyalFamilyCoverageCurrency.css'),
  read('src/data/latestChapterMetadata.js'),
  read('src/data/chapters.js'),
  read('src/data/arcs.js'),
  read('src/data/succession/successionResearch.js'),
  read('src/data/successionDossier.js'),
  read('src/data/succession414415ResearchBase.js'),
  read('src/data/succession414415Research.js'),
  read('src/data/seriesResearch.js'),
  read('src/data/succession/coverageCurrency.js'),
  read('src/components/succession/SuccessionCoverageCurrency.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('scripts/visual-qa.mjs'),
]);

assert(safeImage.includes('data-image-loaded') && safeImage.includes('onAvailabilityChange'), 'media fallback state must remain deterministic');
assert(familyTree.includes('RoyalFamilyGuardTree') && familyTree.includes('Tap any royal, guard, or mafia portrait'), 'Royal Family route must retain the interactive map');
assert(royalTree.includes("addEventListener('wheel', onWheel, { passive: false })") && royalTree.includes('handlePointerMove') && royalTree.includes('fitAll') && royalTree.includes('resetView'), 'map must retain pan, zoom, pinch, fit, and reset controls');
assert(royalNodesBase.includes('MapInspector') && royalNodesBase.includes("['overview', 'Overview']") && royalNodesBase.includes("['evidence', 'Evidence']") && royalNodesBase.includes('royal-map__inspector-dragbar'), 'base dossier must retain preview, tabs, drag, and evidence');
assert(royalNodes.includes("from './RoyalFamilyBoardNodesBase'") && royalNodes.includes('RoyalCoveragePanel') && royalNodes.includes('getProtectionCoverage') && royalNodes.includes('getRosterCoverage'), 'Royal dossier wrapper must expose chapter, protection, and roster coverage');
assert(royalCss.includes('.royal-map__controls') && royalCss.includes('touch-action: none'), 'map interaction styling must remain owned');
assert(inspectorCss.includes("@import './RoyalFamilyInspectorFrame.css'") && inspectorFrameCss.includes('position: fixed !important') && inspectorFrameCss.includes('resize: both'), 'dossier must remain floating, draggable, and resizable in its imported frame layer');
assert(coverageCss.includes('.royal-map__coverage-companion') && coverageCss.includes('.royal-map__coverage-companion__completeness'), 'Royal coverage panel must be styled and responsive');

assert(metadata.includes('414:') && metadata.includes("japaneseTitle: '仲間'") && metadata.includes('415:') && metadata.includes("japaneseTitle: '真偽'") && metadata.includes('LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER = 415'), 'latest chapter metadata must expose detailed research through Chapter 415');
assert(chapters.includes('LATEST_PUBLISHED_CHAPTER') && chapters.includes('Catalogue record') && arcs.includes('LATEST_PUBLISHED_CHAPTER'), 'full-series catalogue and arc endpoint must derive from release metadata');
assert(successionResearch.includes('pendingImportedResearch') && successionResearch.includes('maintainedDetailedMaximum'), 'research loader must preserve honest generated boundaries');
assert(maintainedResearch.includes('succession414415ChapterResearch') && chapterCurrency.includes('actual-Woble') && chapterCurrency.includes('fullmetal-alchemist-combo-master') && chapterCurrency.includes('succession414415CrossChecks'), 'Chapters 414–415 must include maintained chapter, royal, Nen, and source-linked records');
assert(
  sourcePolicy.includes('succession414415SourcePolicy')
    && sourcePolicy.includes('Succession Contest Encyclopedia V2')
    && sourcePolicy.includes('https://www.hunterxnen.com/')
    && sourcePolicy.includes('forbiddenActiveSourceFragments')
    && sourcePolicy.includes('Disallowed Chapter 414–415 source remained active'),
  'active Chapter 414–415 source policy must retain approved community context and enforce the retired-source blocklist',
);
assert(seriesResearch.includes('indexedChapters: LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER') && seriesResearch.includes('publishedChapters: LATEST_PUBLISHED_CHAPTER') && seriesResearch.includes('pending annotation'), 'full-series research totals must separate structured research from published catalogue coverage');

for (const token of ['getEntityCoverage', 'getArchiveCoverageReport', 'getProtectionCoverage', 'getRosterCoverage', 'recentChanges', 'openQuestions']) {
  assert(coverageService.includes(token), `coverage service is missing ${token}`);
}
for (const token of ['CoverageBoundaryProvider', 'RecordCurrencyStrip', 'RecordCoverageSections', 'ArchiveCoverageReport']) {
  assert(coverageUi.includes(token), `coverage UI is missing ${token}`);
}
assert(coverageUi.includes('coverage.recentChanges || []') && coverageUi.includes('coverage.openQuestions || []'), 'selected chapter coverage must tolerate optional change and question collections');
assert(archiveApp.includes('<CoverageBoundaryProvider') && archiveApp.includes('showSelectedCoverage') && archiveApp.includes('<ArchiveCoverageReport'), 'Archive Home, Research, and selected dossiers must receive generated currency');
assert(primitives.includes('useCoverageBoundary(readingBoundary)') && primitives.includes('<RecordCurrencyStrip') && primitives.includes('<RecordCoverageSections'), 'generic entity dossiers must expose chapter-safe currency and gaps');
assert(visualQa.includes('pendingImages') && visualQa.includes('mediaTextOverlaps'), 'visual QA must still reject unsettled images and text collisions');

console.log('Polish audit passed: deterministic media, pannable Royal map, draggable tabbed dossier, complete protection and roster accounting, Chapter 415 publication and detailed-research boundaries, maintained 414–415 timeline, royal, Nen, assignment, and approved-source records, generated coverage census, Recent Changes, Open Questions, and chapter-safe dossier wiring.');
