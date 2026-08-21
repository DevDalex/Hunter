import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession research comprehension audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [mysteries, archive] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionMysteryCases.js'),
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
  ]);
  const records = mysteries.getSuccessionMysteryCasesAtChapter(417);
  assert(records.length === 19, `expected all 19 maintained mystery cases at Chapter 417; found ${records.length}`);
  assert(records.every((record) => Array.isArray(record.candidates) && record.candidates.length > 0), 'every mystery case must retain candidate explanations');
  assert(records.every((record) => Array.isArray(record.knownFacts) && Array.isArray(record.unknowns)), 'known facts and unknowns must remain explicit arrays');
  assert(records.every((record) => Array.isArray(record.sourceIds) && record.sourceIds.length > 0), 'every mystery case must retain source anchors');
  assert(records.flatMap((record) => record.candidates).every((candidate) => Array.isArray(candidate.evidenceFor) && Array.isArray(candidate.evidenceAgainst)), 'candidate evidence-for / evidence-against arrays are incomplete');

  const explicitConnections = records.flatMap((left, index) => records.slice(index + 1).map((right) => {
    const shared = [
      ...(left.relatedEntityIds || []).filter((id) => (right.relatedEntityIds || []).includes(id)),
      ...(left.relatedAbilityIds || []).filter((id) => (right.relatedAbilityIds || []).includes(id)),
      ...(left.relatedThreadIds || []).filter((id) => (right.relatedThreadIds || []).includes(id)),
    ];
    return shared.length ? { left: left.id, right: right.id, shared } : null;
  }).filter(Boolean));
  assert(explicitConnections.length > 0, 'cross-case graph has no explicit shared canonical IDs');

  const provenance = archive.getProvenanceCoverageReport(417);
  assert(provenance.claims > 0 && provenance.profiles.length > 0, 'provenance report is empty');
  assert(provenance.explicitClaimSources + provenance.inheritedEntitySources + provenance.unsupported === provenance.claims, 'provenance source-mode totals do not reconcile to total claims');
  assert(provenance.weakest.length <= provenance.profiles.length, 'weakest-coverage subset exceeds the full provenance profile set');

  const [workbench, panel, css, evidence, evidenceCss] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryComprehensionPanel.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEvidenceTranslationWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionEvidenceTranslationWorkbench.css'), 'utf8'),
  ]);

  assert(workbench.includes('SuccessionMysteryComprehensionPanel') && workbench.includes('!selected && <SuccessionMysteryComprehensionPanel'), 'mystery comprehension is not mounted above the case directory');
  for (const token of ['New at boundary', 'Touched at boundary', 'Earlier unresolved', 'Resolved', 'Candidate comparison matrix', 'Cross-case graph', 'Later source / review touchpoints']) {
    assert(panel.includes(token), `mystery command center is missing ${token}`);
  }
  assert(panel.includes('source:chapter-') && panel.includes('touchChaptersFor'), 'source/review touchpoints are not derived from explicit source IDs');
  assert(!panel.includes('latest evidence Ch.'), 'latestChapter must not be mislabeled as latest evidence');
  assert(panel.includes('tabIndex="0"') && panel.includes('role="region"'), 'candidate matrix must remain keyboard-focusable when horizontally scrollable');
  assert(panel.includes('Evidence counts describe maintained argument entries, not probability or confidence scores.'), 'candidate evidence counts lack the non-probability disclosure');
  assert(!/\bprobability\s*[:=]/i.test(panel), 'mystery UI must not assign candidate probabilities');
  assert(panel.includes('sharedSignals') && panel.includes('relatedEntityIds') && panel.includes('relatedAbilityIds') && panel.includes('relatedThreadIds'), 'cross-case graph is not bounded to explicit shared canonical IDs');

  for (const token of ['Evidence health', 'Explicit claim source', 'Inherited entity source', 'Unsupported', 'Showing {report.weakest.length} weakest-coverage profiles from {report.profiles.length}', '<details', 'semanticState']) {
    assert(evidence.includes(token), `provenance comprehension is missing ${token}`);
  }
  assert(evidence.includes('claim.inheritedSourceChain') && evidence.includes('claim.sources.length'), 'claim drawers do not preserve explicit/inherited/unsupported provenance modes');
  assert(evidence.includes('report.explicitClaimSources') && evidence.includes('report.inheritedEntitySources') && evidence.includes('report.unsupported'), 'provenance health bar is not derived from report source-mode counts');

  const fontSizes = [...`${css}\n${evidenceCss}`.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `research comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  for (const stylesheet of [css, evidenceCss]) {
    assert(!/@media\s*\([^)]*max-width:/i.test(stylesheet), 'research comprehension must not introduce mobile/tablet breakpoints');
    assert(stylesheet.includes('@media (prefers-reduced-motion: reduce)'), 'research comprehension must preserve reduced-motion handling');
  }
  assert(css.includes('overflow-x: auto') && css.includes('position: sticky'), 'candidate matrix must retain desktop scanability');
  assert(evidenceCss.includes('.succession-provenance-health__bar') && evidenceCss.includes('.succession-provenance-claims details > summary:focus-visible'), 'provenance health or keyboard claim-drawer presentation is missing');

  console.log(`Succession research comprehension audit passed: ${records.length} cases, ${records.flatMap((record) => record.candidates).length} candidate explanations, ${explicitConnections.length} explicit cross-case links, ${provenance.claims} provenance claims, and ${provenance.coverage}% sourced coverage are visually bounded to maintained evidence.`);
} finally {
  await vite.close();
}
