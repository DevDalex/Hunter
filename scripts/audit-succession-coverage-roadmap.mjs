import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession coverage roadmap audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [coverage, roadmapModule] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/coverageCurrency.js'),
    vite.ssrLoadModule('/src/data/succession/coverageRoadmap.js'),
  ]);
  const chapter = 417;
  const report = coverage.getArchiveCoverageReport(chapter);
  const roadmap = roadmapModule.getArchiveCoverageRoadmap(chapter);

  assert(roadmap.readingBoundary === report.readingBoundary, 'roadmap reading boundary drifted from coverage census');
  assert(roadmap.domains.length === report.domains.length && roadmap.domains.length === 9, `expected all nine coverage domains, found ${roadmap.domains.length}`);
  assert(new Set(roadmap.domains.map((domain) => domain.id)).size === roadmap.domains.length, 'roadmap domain IDs are not unique');
  assert(roadmap.pendingChapterNumbers.join('|') === report.pendingChapterNumbers.join('|'), 'pending chapter list drifted from coverage census');
  assert(roadmap.summary.missingSources === report.totals.missingSources, 'missing-source total drifted from census');
  assert(roadmap.summary.noChapterEvidence === report.totals.noChapterEvidence, 'no-chapter-evidence total drifted from census');
  assert(roadmap.summary.behindBoundary === report.totals.behindBoundary, 'behind-boundary total drifted from census');
  assert(roadmap.summary.currentDomains + roadmap.summary.attentionDomains === roadmap.summary.domains, 'current/attention domain counts do not partition the roadmap');
  for (const domain of roadmap.domains) {
    const source = report.domains.find((record) => record.id === domain.id);
    assert(source, `${domain.id} has no source census domain`);
    for (const key of ['recordCount', 'missingSources', 'noChapterEvidence', 'behindBoundary']) {
      assert(domain[key] === source[key], `${domain.id}.${key} drifted from coverage census`);
    }
    assert(['needs-sources', 'needs-chapter-evidence', 'behind-boundary', 'current'].includes(domain.status), `${domain.id} has invalid roadmap status ${domain.status}`);
    assert(typeof domain.route === 'string' && domain.route.length > 0, `${domain.id} has no canonical drill-down route`);
    assert(typeof domain.nextAction === 'string' && domain.nextAction.length > 0, `${domain.id} has no next action`);
    if (domain.status === 'current') assert(domain.reasons.length === 0, `${domain.id} is current but still publishes gap reasons`);
  }

  const [ui, css, shell, selector] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionCoverageRoadmap.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionCoverageRoadmap.css'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8'),
    readFile(path.join(root, 'src/data/succession/coverageRoadmap.js'), 'utf8'),
  ]);
  for (const token of ['Public coverage roadmap', 'What is current, what still needs evidence', 'Missing sources', 'No chapter evidence', 'Earlier evidence', 'Priority ordering is transparent']) {
    assert(ui.includes(token), `coverage roadmap UI is missing ${token}`);
  }
  assert(ui.includes('getArchiveCoverageRoadmap') && selector.includes('getArchiveCoverageReport'), 'roadmap is not derived from the canonical coverage census');
  assert(!selector.includes('percentage') && !selector.includes('percentComplete'), 'roadmap introduced a fabricated completion percentage');
  assert(shell.includes('<SuccessionCoverageRoadmap chapter={spoilerLimit} onNavigate={navigate} />'), 'public coverage roadmap is not mounted in Research overview');
  assert(shell.includes("route.id === 'research' && (!routeParams?.mode || routeParams.mode === 'overview')"), 'Research overview metadata gate drifted');
  assert(!/@media\s*\([^)]*max-width:/i.test(css), 'coverage roadmap introduced a mobile/tablet breakpoint');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'coverage roadmap lacks reduced-motion handling');
  const sizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));
  assert(sizes.every((size) => size >= 11), `coverage roadmap introduced text below 11px: ${sizes.filter((size) => size < 11).join(', ')}`);

  console.log(`Succession coverage roadmap audit passed: ${roadmap.domains.length} canonical domains, ${roadmap.summary.attentionDomains} attention domains, and ${roadmap.pendingChapterNumbers.length} pending chapters are transparently derived from the coverage census.`);
} finally {
  await vite.close();
}
