import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession comparison comprehension audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const chapter = 417;
  const characters = archive.getEntitiesByType('character').filter((record) => !record.chapterRange?.start || record.chapterRange.start <= chapter);
  assert(characters.length >= 2, 'fewer than two Chapter 417 character records are available for comparison');
  const result = archive.compareSameTypeRecords(characters.slice(0, 2).map((record) => record.id), chapter);
  assert(result.valid, 'canonical same-type comparison is invalid');
  assert(Array.isArray(result.rows) && result.rows.length > 0, 'comparison engine returned no compatible fields');
  assert(Number.isFinite(result.differenceCount) && Number.isFinite(result.sharedCount), 'comparison summary counts are unavailable');
  assert(result.differenceCount + result.sharedCount === result.rows.length, 'shared/difference counts do not reconcile with compatible fields');

  const [workbench, css] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionIntelligenceWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionIntelligenceCompareComprehension.css'), 'utf8'),
  ]);

  assert(workbench.includes("const comparisonFieldViews = Object.freeze(['differences', 'all', 'shared'])"), 'comparison field views are not explicitly bounded');
  assert(workbench.includes("routeParams.fields) ? routeParams.fields : 'differences'"), 'comparison does not default to differences first');
  assert(workbench.includes("fieldView === 'all' || (fieldView === 'differences' ? !row.allSame : row.allSame)"), 'comparison rows are not filtered by shared/difference state');
  assert(workbench.includes("fields: fieldView"), 'field-view selection is not preserved in the shareable comparison URL');
  assert(workbench.includes('Differences only') && workbench.includes('All compatible fields') && workbench.includes('Shared only'), 'comparison filter choices are incomplete');
  assert(workbench.includes('Showing {visibleRows.length} of {result.rows.length} compatible fields'), 'comparison subset size is not disclosed');
  assert(workbench.includes('tabIndex="0" role="region"'), 'scrollable comparison matrix is not keyboard-focusable');
  assert(workbench.includes("import './SuccessionIntelligenceCompareComprehension.css';"), 'comparison scanability stylesheet is not mounted');

  assert(css.includes('position: sticky'), 'comparison matrix lacks sticky scan anchors');
  assert(css.includes('thead th:first-child') && css.includes('tbody th'), 'comparison does not freeze the field identity column');
  assert(css.includes(':focus-visible'), 'comparison matrix has no visible keyboard focus state');
  const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `comparison comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'comparison comprehension must not introduce mobile/tablet breakpoints');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'comparison comprehension must preserve reduced-motion handling');

  console.log(`Succession comparison comprehension audit passed: ${result.rows.length} compatible fields split into ${result.differenceCount} differences and ${result.sharedCount} shared fields, with difference-first filtering and keyboard scanability.`);
} finally {
  await vite.close();
}
