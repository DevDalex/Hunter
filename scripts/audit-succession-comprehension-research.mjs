import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession research comprehension audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const mysteries = await vite.ssrLoadModule('/src/data/succession/successionMysteryCases.js');
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

  const [workbench, panel, css] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryCaseWorkbench.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryComprehensionPanel.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionMysteryComprehensionPanel.css'), 'utf8'),
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

  const fontSizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(fontSizes.length > 0 && fontSizes.every((size) => size >= 11), `research comprehension introduced text below the 11px floor: ${fontSizes.filter((size) => size < 11).join(', ')}`);
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'research comprehension must not introduce mobile/tablet breakpoints');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'research comprehension must preserve reduced-motion handling');
  assert(css.includes('overflow-x: auto') && css.includes('position: sticky'), 'candidate matrix must retain desktop scanability');

  console.log(`Succession research comprehension audit passed: ${records.length} cases, ${records.flatMap((record) => record.candidates).length} candidate explanations, and ${explicitConnections.length} explicit cross-case links are visually bounded to maintained evidence.`);
} finally {
  await vite.close();
}
