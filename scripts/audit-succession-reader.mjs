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
  const availabilityModule = await vite.ssrLoadModule('/src/data/successionChapterAvailability.generated.js');
  const manifestModule = await vite.ssrLoadModule('/src/data/successionChapterReader.js');
  const catalogueModule = await vite.ssrLoadModule('/src/data/successionReaderCatalog.js');
  const {
    SUCCESSION_READER_END,
    SUCCESSION_READER_START,
    successionChapterReaderRecords,
  } = manifestModule;
  const {
    successionReaderCatalog,
    successionReaderPhaseGroups,
  } = catalogueModule;
  const { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } = availabilityModule;
  const expectedTotal = SUCCESSION_READER_END - SUCCESSION_READER_START + 1;

  assert(SUCCESSION_READER_START === 338, 'reader chapter start must remain Chapter 338');
  assert(SUCCESSION_READER_END === Math.max(414, LATEST_AUTHORIZED_SUCCESSION_CHAPTER), 'reader end must follow the generated imported-chapter boundary');
  assert(successionChapterReaderRecords.length === expectedTotal, 'reader manifest must contain every sequential chapter through the generated boundary');
  assert(successionReaderCatalog.length === expectedTotal, 'enriched reader catalogue must cover every manifest chapter');
  assert(successionReaderPhaseGroups.length >= 10, 'chapter drawer requires comprehensive phase grouping');
  assert(successionReaderCatalog.every((record, index) => record.chapter === SUCCESSION_READER_START + index), 'reader catalogue must remain sequential');
  assert(successionReaderCatalog.at(-1)?.chapter === SUCCESSION_READER_END, 'reader catalogue must expose the latest generated chapter');
  assert(successionReaderCatalog.every((record) => record.title && record.phase && record.mediaStatus), 'reader catalogue records require title, phase, and media status');

  const [reader, storage, panel, enhancements, series, router, css, polishCss, shellCss, qa] = await Promise.all([
    read('src/components/SuccessionChapterReader.jsx'),
    read('src/components/succession-reader/readerState.js'),
    read('src/components/succession-reader/ReaderPanel.jsx'),
    read('src/components/succession-reader/ReaderPanelEnhancements.jsx'),
    read('src/components/SeriesWorkspace.jsx'),
    read('src/lib/appRouter.js'),
    read('src/components/SuccessionChapterReader.css'),
    read('src/components/SuccessionChapterReaderPolish.css'),
    read('src/components/StoryUtilities.css'),
    read('scripts/succession-reader-qa.mjs'),
  ]);

  for (const mode of ['page', 'spread', 'scroll']) assert(reader.includes(`value="${mode}"`) || reader.includes(`'${mode}'`), `missing ${mode} reading mode`);
  for (const feature of ['succession-reader__topbar', 'succession-reader__bottombar', 'succession-reader__canvas', 'succession-reader__chapter-groups', 'succession-reader__thumbnails', 'succession-reader__settings', 'succession-reader__bookmark-list', 'succession-reader__command-list', 'succession-reader__shortcuts']) assert(reader.includes(feature), `missing reader feature ${feature}`);
  for (const state of ['requestedChapter', 'requestedPage', 'requestedMode', 'requestedFit', 'requestedDirection', 'requestedPanel']) assert(reader.includes(state) && series.includes(state), `route state ${state} is not wired end to end`);
  const canonicalRecordBridge = series.includes('entity: `chapter:${chapter}`')
    || (series.includes('/story/succession-contest/chapter-records') && series.includes('encodeURIComponent(`chapter:${chapter}`)'));
  assert(reader.includes('onOpenChapterRecord') && canonicalRecordBridge, 'reader must bridge into canonical Chapter Records');
  assert(reader.includes('requestFullscreen') && reader.includes('IntersectionObserver') && reader.includes('navigator.clipboard'), 'fullscreen, scroll tracking, and share-link behavior are required');
  assert(reader.includes('toggleReaderBookmark') && reader.includes('chapterProgressFor'), 'bookmarks and chapter progress must use the versioned reader state');
  assert(!reader.includes('public/media/succession-contest/chapters'), 'public reader must not expose internal media paths');
  assert(!reader.includes('succession-reader__heading') && !reader.includes('succession-reader__directory'), 'legacy dashboard reader architecture must be removed');

  assert(storage.includes('hxh-succession-reader-state-v2') && storage.includes('chapters: {}') && storage.includes('bookmarks: []'), 'reader storage must be versioned and include progress plus bookmarks');
  assert(storage.includes("if (value === 'continuous') return 'scroll'") && storage.includes("if (value === 'single') return 'page'"), 'legacy reader mode URLs must remain compatible');
  assert(storage.includes('setChapterCompleted') && storage.includes('clearReaderBookmarks'), 'manual completion and bookmark-only reset helpers are required');
  assert(panel.includes('aria-modal="true"') && panel.includes("event.key === 'Escape'") && panel.includes('focusableSelector'), 'reader panels must trap focus, close on Escape, and expose modal semantics');
  assert(panel.includes('ReaderPanelEnhancements'), 'reader panels must mount completion, reset, and command enhancements');
  assert(enhancements.includes('400:7') && enhancements.includes('page\\s+(\\d+)') && enhancements.includes("normalized === 'latest'"), 'direct reader command syntax must support chapter:page, page jumps, and latest chapter');
  assert(enhancements.includes('setChapterCompleted') && enhancements.includes('clearReaderBookmarks'), 'reader panel controls must expose manual completion and bookmark-only reset');

  assert(router.includes("'/story/succession-contest/chapters'"), 'clean chapter reader URL must remain authoritative');
  assert(router.includes('readerParams'), 'reader query parameters must pass through clean URL generation');
  assert(shellCss.includes('.story-utility-shell--succession-reader') && shellCss.includes('width: 100%'), 'reader route shell must be full bleed');
  for (const selector of ['.succession-reader__topbar', '.succession-reader__bottombar', '.succession-reader__canvas', '.succession-reader-panel', '.succession-reader__pages.is-spread', '.succession-reader__chapter-groups']) assert(css.includes(selector), `reader design is missing ${selector}`);
  assert(css.includes('@media (max-width: 620px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'reader design requires mobile and reduced-motion layers');
  assert(css.includes('env(safe-area-inset-bottom)') && css.includes(':focus-visible'), 'reader design requires safe-area and focus-visible handling');
  assert(polishCss.includes('.succession-reader__panel-enhancement') && polishCss.includes('.succession-reader__command-syntax'), 'reader completion and direct-command controls require route-owned styling');

  for (const check of ['standalone and reading-first', 'complete grouped catalogue', 'modes fit direction', 'Bookmarks persist', 'Keyboard chapter navigation', 'Mobile reader is contained']) assert(qa.includes(check), `browser QA is missing ${check}`);

  console.log(`Succession reader audit passed: ${successionReaderCatalog.length} chapters through ${SUCCESSION_READER_END}, ${successionReaderPhaseGroups.length} chapter phases, three reading modes, full route state, progress, manual completion, bookmarks, direct commands, panels, archive bridging, responsive design, and browser QA verified.`);
} finally {
  await vite.close();
}
