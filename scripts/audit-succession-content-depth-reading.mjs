import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession reading depth audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, translations] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/contentDepthTranslationVariants.js'),
  ]);

  const dossier = archive.getChapterStoryDossier(417);
  const change = archive.getChapterWhatChanged(417);
  const chapter = archive.getEntitiesByType('chapter').find((record) => record.number === 417);
  const provenance = archive.getClaimProvenanceProfile(chapter?.id, 417);
  const translationSummary = translations.getSuccessionTranslationSummary(417);
  const gypsy = translations.getSuccessionTranslationVariant('gypsy-life-host-selection');

  assert(dossier?.chapter?.number === 417, 'Chapter 417 story dossier is unavailable to depth views');
  assert(change.chapter === 417 && change.previousChapter === 416, 'deep-analysis state transition must compare 416 → 417');
  assert(chapter, 'canonical Chapter 417 entity is missing');
  assert(provenance?.entity?.id === chapter.id && provenance.claims.length > 0, 'evidence mode cannot generate chapter-level claim provenance');
  assert(translationSummary.records >= 4, 'translation/naming variant registry is unexpectedly shallow');
  assert(translationSummary.mechanicsImpacting >= 1, 'mechanics-impacting translation discrepancies must be tracked separately');
  assert(gypsy?.mechanicsImpact === 'high', 'Gypsy Life host-selection discrepancy must remain mechanics-impacting');
  assert(gypsy?.exactAlternateArchived === false, 'the unarchived exact alternate Gypsy Life wording must not be fabricated');

  const [app, reading, readingCss, evidence, evidenceCss, caseBridge] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionReadingDepthWorkspace.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionReadingDepthWorkspace.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEvidenceTranslationWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEvidenceTranslationWorkbench.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
  ]);

  for (const label of ['60-second', 'Standard', 'Deep analysis', 'Evidence']) assert(reading.includes(label), `reading-depth UI is missing ${label}`);
  assert(reading.includes("['quick', 'deep', 'evidence']") || reading.includes("['quick', 'deep', 'evidence'].includes"), 'non-standard modes are not explicitly isolated');
  assert(app.includes("const readingDepthActive = ['story', 'chapters'].includes(route.id) && ['quick', 'deep', 'evidence'].includes(routeParams.depth);"), 'App does not distinguish non-standard Story/Chapter modes');
  assert(app.includes("route.id === 'story' && !readingDepthActive"), 'full Story workspace is not suppressed in non-standard modes');
  assert(app.includes("route.id === 'chapters' && !readingDepthActive"), 'full Chapter workspace is not suppressed in non-standard modes');
  assert(app.includes('!readingDepthActive && <SuccessionWorkspaceRefinementDeck'), 'legacy refinement deck is not suppressed when a materially different depth view is selected');
  assert(reading.includes('getThreatAssassinationMatrix') && reading.includes('getKnowledgeWarfareMatrix') && reading.includes('getConsequenceChains'), 'Deep analysis is not materially richer than the standard narrative dossier');
  assert(reading.includes('getClaimProvenanceProfile') && reading.includes('Translation boundaries'), 'Evidence depth does not foreground claims and translation boundaries');
  assert(reading.includes('five signals'), '60-second mode is not presented as a distinct concise briefing');

  assert(evidence.includes('Claim-level provenance coverage'), 'Research evidence workbench does not expose claim-level provenance');
  assert(evidence.includes('Unsupported claims remain visible as debt') || evidence.includes('Unsupported claims remain visible'), 'unsupported provenance debt is not visible');
  assert(evidence.includes('exact wording is not stored') || evidence.includes('missing wording remains explicitly unquoted'), 'translation workbench does not preserve missing-wording boundaries');
  assert(caseBridge.includes("workspace === 'evidence'"), 'Research bridge does not expose the provenance/translation workbench');

  for (const css of [readingCss, evidenceCss]) {
    assert(!css.includes('@media (max-width:'), 'content-depth workbenches must not introduce mobile/tablet CSS');
    assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'desktop reduced-motion contract must remain explicit');
  }

  console.log(`Succession reading depth audit passed: four materially distinct Story/Chapter views, ${provenance.claims.length} Chapter 417 provenance claims, and ${translationSummary.records} bounded translation/naming variants.`);
} finally {
  await vite.close();
}
