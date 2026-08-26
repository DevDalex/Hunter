import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession reader audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });

try {
  const availability = await vite.ssrLoadModule('/src/data/successionChapterAvailability.generated.js');
  const latest = await vite.ssrLoadModule('/src/data/latestChapterMetadata.js');
  const manifest = await vite.ssrLoadModule('/src/data/successionChapterReader.js');
  const catalogue = await vite.ssrLoadModule('/src/data/successionReaderCatalog.js');
  const routes = await vite.ssrLoadModule('/src/data/succession/archiveRoutes.js');

  const expectedTotal = manifest.SUCCESSION_READER_END - manifest.SUCCESSION_READER_START + 1;
  assert(manifest.SUCCESSION_READER_START === 338, 'reader chapter start must remain Chapter 338');
  assert(
    manifest.SUCCESSION_READER_END === Math.max(414, latest.LATEST_PUBLISHED_CHAPTER, availability.LATEST_AUTHORIZED_SUCCESSION_CHAPTER),
    'reader end must follow the latest published chapter while preserving the separate local-media authorization boundary',
  );
  assert(manifest.successionChapterReaderRecords.length === expectedTotal, 'reader manifest must remain sequential and complete');
  assert(catalogue.successionReaderCatalog.length === expectedTotal, 'enriched reader catalogue must cover the manifest');
  assert(catalogue.successionReaderPhaseGroups.length >= 10, 'reader requires comprehensive phase grouping');
  assert(catalogue.successionReaderCatalog.every((record, index) => record.chapter === manifest.SUCCESSION_READER_START + index), 'reader catalogue must remain sequential');
  assert(routes.successionArchiveRouteById.get('reader')?.path === 'reader', 'Reader must remain a canonical Succession route');

  const latestRecord = manifest.successionChapterReaderByNumber.get(latest.LATEST_PUBLISHED_CHAPTER);
  assert(latestRecord?.chapter === latest.LATEST_PUBLISHED_CHAPTER, 'latest published chapter must have a reader record even before local page media is imported');
  if (latest.LATEST_PUBLISHED_CHAPTER > availability.LATEST_AUTHORIZED_SUCCESSION_CHAPTER) {
    assert(latestRecord.pageCount === 0 && latestRecord.mediaStatus === 'awaiting-local-media', 'published chapters beyond the media authorization boundary must be represented honestly as awaiting local media');
  }

  const [reader, storage, panel, enhancements, readerRoute, entry, router, css, polishCss, routeCss, qa] = await Promise.all([
    read('src/components/SuccessionChapterReader.jsx'),
    read('src/components/succession-reader/readerState.js'),
    read('src/components/succession-reader/ReaderPanel.jsx'),
    read('src/components/succession-reader/ReaderPanelEnhancements.jsx'),
    read('src/components/succession/SuccessionArchiveReaderRoute.jsx'),
    read('src/components/succession/SuccessionArchiveEntry.jsx'),
    read('src/lib/appRouter.js'),
    read('src/components/SuccessionChapterReader.css'),
    read('src/components/SuccessionChapterReaderPolish.css'),
    read('src/components/succession/SuccessionReaderCommand.css'),
    read('scripts/succession-reader-qa.mjs'),
  ]);

  for (const mode of ['page', 'spread', 'scroll']) {
    assert(reader.includes(`value="${mode}"`) || reader.includes(`'${mode}'`), `missing ${mode} reading mode`);
  }
  for (const feature of [
    'succession-reader__topbar',
    'succession-reader__bottombar',
    'succession-reader__canvas',
    'succession-reader__chapter-groups',
    'succession-reader__thumbnails',
    'succession-reader__settings',
    'succession-reader__bookmark-list',
    'succession-reader__command-list',
    'succession-reader__shortcuts',
  ]) assert(reader.includes(feature), `missing reader feature ${feature}`);

  for (const state of [
    'requestedChapter',
    'requestedPage',
    'requestedMode',
    'requestedFit',
    'requestedDirection',
    'requestedPanel',
  ]) assert(reader.includes(state) && readerRoute.includes(state), `route state ${state} is not wired end to end`);

  assert(
    reader.includes('onOpenChapterRecord')
      && readerRoute.includes('entity: `chapter:${chapter}`')
      && readerRoute.includes("onNavigate('chapters'"),
    'reader must bridge into canonical Succession Chapter Records',
  );
  assert(entry.includes("props.routeTarget === 'reader'") && entry.includes('SuccessionArchiveReaderRoute'), 'the focused archive entry must route Reader independently');
  assert(readerRoute.includes('SuccessionArchiveShell') && readerRoute.includes('SuccessionChapterReader'), 'Reader must remain inside the Succession shell');
  assert(router.includes("['chapters', 'reader']"), 'the former /chapters reader URL must remain a compatibility redirect');

  assert(reader.includes('requestFullscreen') && reader.includes('IntersectionObserver') && reader.includes('navigator.clipboard'), 'fullscreen, tracking, and share behavior are required');
  assert(reader.includes('toggleReaderBookmark') && reader.includes('chapterProgressFor'), 'bookmarks and progress must use reader state');
  assert(!reader.includes('public/media/succession-contest/chapters'), 'public reader must not expose internal media paths');
  assert(storage.includes('hxh-succession-reader-state-v2') && storage.includes('bookmarks: []'), 'reader storage must remain versioned');
  assert(storage.includes('setChapterCompleted') && storage.includes('clearReaderBookmarks'), 'completion and bookmark reset helpers are required');
  assert(panel.includes('aria-modal="true"') && panel.includes("event.key === 'Escape'") && panel.includes('focusableSelector'), 'reader panels need modal semantics, focus containment, and Escape');
  assert(panel.includes('ReaderPanelEnhancements'), 'reader panels must mount enhancements');
  assert(enhancements.includes('400:7') && enhancements.includes("normalized === 'latest'"), 'direct commands must support chapter:page and latest');

  assert(routeCss.includes('.succession-reader-command') && routeCss.includes('width: 100%'), 'reader shell must remain full width');
  for (const selector of [
    '.succession-reader__topbar',
    '.succession-reader__bottombar',
    '.succession-reader__canvas',
    '.succession-reader-panel',
    '.succession-reader__pages.is-spread',
    '.succession-reader__chapter-groups',
  ]) assert(css.includes(selector), `reader design is missing ${selector}`);
  assert(!/@media\s*\([^)]*max-width:/i.test(css) && css.includes('@media (prefers-reduced-motion: reduce)'), 'reader requires desktop-only and reduced-motion layers');
  assert(polishCss.includes('.succession-reader__panel-enhancement') && polishCss.includes('.succession-reader__command-syntax'), 'reader enhancements require route-owned styling');

  for (const check of [
    'standalone and reading-first',
    'complete grouped catalogue',
    'modes fit direction',
    'Bookmarks persist',
    'Keyboard chapter navigation',
  ]) assert(qa.includes(check), `browser QA is missing ${check}`);

  console.log(`Succession reader audit passed: ${catalogue.successionReaderCatalog.length} chapter records through published Chapter ${manifest.SUCCESSION_READER_END}, local media through Chapter ${availability.LATEST_AUTHORIZED_SUCCESSION_CHAPTER}, canonical focused routing, three reading modes, progress, bookmarks, direct commands, chapter-record bridging, and desktop design verified.`);
} finally {
  await vite.close();
}
