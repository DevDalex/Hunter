import { readFile } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession spoiler-surface audit failed: ${message}`);
};
const earliestChapter = (record = {}) => {
  for (const value of [record.chapter, record.number, record.introducedAtChapter, record.revealedAtChapter, record.confirmedAtChapter, record.validFromChapter, record.chapterRange?.start]) {
    const chapter = Number(value);
    if (Number.isFinite(chapter)) return chapter;
  }
  return null;
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [archive, homeSummary, homeModule] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/successionHomeSummary.js'),
    vite.ssrLoadModule('/src/components/succession/SuccessionCommandHome.jsx'),
  ]);

  const boundaries = [340, 360, 400, 416, 417];
  for (const boundary of boundaries) {
    const recent = homeSummary.getSuccessionHomeRecentChapters(boundary, 4);
    assert(recent.every((record) => record.number <= boundary), `home latest-updates helper leaked a chapter above ${boundary}`);
    assert(recent.every((record, index) => index === 0 || record.number < recent[index - 1].number), `home latest-updates order is unstable at ${boundary}`);
  }

  for (const boundary of [360, 400, 416]) {
    const visible = homeSummary.getSuccessionHomeRecentChapters(boundary, 4);
    const future = homeSummary.successionHomeChapterSummaries.filter((record) => record.number > boundary);
    const html = renderToStaticMarkup(React.createElement(homeModule.default, {
      spoilerLimit: boundary,
      onNavigate: () => {},
      onOpenSearch: () => {},
    }));
    for (const record of future.slice(-12)) {
      if (!record.title || /^Chapter \d+$/i.test(record.title)) continue;
      assert(!html.includes(record.title), `rendered command home at Ch. ${boundary} leaked future chapter title ${record.number}: ${record.title}`);
      assert(!html.includes(`entity=chapter%3A${record.number}`) && !html.includes(`entity=chapter:${record.number}`), `rendered command home at Ch. ${boundary} linked future Chapter ${record.number}`);
    }
    for (const record of visible) {
      assert(html.includes(`Chapter ${record.number}`), `rendered command home at Ch. ${boundary} omitted visible update Chapter ${record.number}`);
    }
    assert(html.includes(`<span>${boundary}</span>`), `reader portal did not use the selected boundary ${boundary}`);
  }

  const searchableTypes = ['event', 'assignment', 'relationship', 'knowledge-record', 'protocol', 'object', 'document', 'evidence-item'];
  let probes = 0;
  for (const type of searchableTypes) {
    const candidates = archive.getEntitiesByType(type)
      .map((record) => ({ record, start: earliestChapter(record) }))
      .filter(({ record, start }) => Number.isFinite(start) && start > 340 && record.name)
      .slice(0, 8);
    for (const { record, start } of candidates) {
      const boundary = start - 1;
      const results = archive.searchArchiveProduct(record.name, { chapter: boundary, limit: 80 });
      assert(!results.some((result) => result.entity?.id === record.id), `${record.id} leaked through search at Chapter ${boundary}`);
      probes += 1;
    }
  }
  assert(probes >= 12, `spoiler search probe set is too small (${probes})`);

  const [indexHtml, commandHomeSource, searchSource] = await Promise.all([
    readFile(path.join(root, 'index.html'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionCommandHome.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8'),
  ]);
  assert(!/application\/ld\+json[^<]*(?:chapter\s*41[0-7]|morena|borksen|halkenburg)/i.test(indexHtml), 'static structured data contains current-arc spoiler payload');
  assert(!/<meta[^>]+(?:chapter\s*41[0-7]|morena|borksen|halkenburg)/i.test(indexHtml), 'static document metadata contains current-arc spoiler payload');
  assert(commandHomeSource.includes('getSuccessionHomeRecentChapters(spoilerLimit)'), 'command home is not deriving updates from the selected spoiler boundary');
  assert(commandHomeSource.includes('<span>{spoilerLimit}</span>'), 'reader portal still exposes a hard-coded future endpoint');
  assert(searchSource.includes('searchArchiveProduct(canonicalQuery, { limit: 60, chapter: spoilerLimit })'), 'global search is not explicitly chapter bounded');

  console.log(`Succession spoiler-surface audit passed: ${boundaries.length} home boundaries, 3 rendered DOM/URL checks, ${probes} future-record search probes, alt/text-link rendering, and static metadata/structured-data surfaces are boundary-safe.`);
} finally {
  await vite.close();
}
