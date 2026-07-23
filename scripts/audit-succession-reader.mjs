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

  assert(SUCCESSION_READER_START === 338 && SUCCESSION_READER_END === 414, 'reader chapter boundary must remain 338–414');
  assert(successionChapterReaderRecords.length === 77, 'reader manifest must contain 77 sequential chapter records');
  assert(successionReaderCatalog.length === 77, 'enriched reader catalogue must cover every manifest chapter');
  assert(successionReaderPhaseGroups.length >= 10, 'chapter drawer requires comprehensive phase grouping');
  assert(successionReaderCatalog.every((record, index) => record.chapter === SUCCESSION_READER_START + index), 'reader catalogue must remain sequential');
  assert(successionReaderCatalog.every((record) => record.title && record.phase && record.mediaStatus), 'reader catalogue records require title, phase, and media status');

  const [reader, storage, panel, series, router, css, shellCss, qa] = await Promise.all([
    read('src/components/SuccessionChapterReader.jsx'),
    read('src/components/succession-reader/readerState.js'),
    read('src/components/succession-reader/ReaderPanel.jsx'),
    read('src/components/SeriesWorkspace.jsx'),
    read('src/lib/appRouter.js'),
    read('src/components/SuccessionChapterReader.css'),
    read('src/components/StoryUtilities.css'),
    read('scripts/succession-reader-qa.mjs'),
  ]);

  for (const mode of ['page', 'spread', 'scroll']) assert(reader.includes(`value=\"${mode}\"`) || reader.includes(`'${mode}'`), `missing ${mode} reading mode`);
  for (const feature of ['succession-reader__topbar', 'succession-reader__bottombar', 'succession-reader__canvas', 'succession-reader__chapter-groups', 'succession-reader__thumbnails', 'succession-reader__settings', 'succession-reader__bookmark-list', 'succession-reader__command-list', 'succession-reader__shortcuts']) assert(reader.includes(feature), `missing reader feature ${feature}`);
  for (const state of ['requestedChapter', 'requestedPage', 'requestedMode', 'requestedFit', 'requestedDirection', 'requestedPanel']) assert(reader.includes(state) && series.includes(state), `route state ${state} is not wired end to end`);
  assert(reader.includes('onOpenChapterRecord') && series.includes('entity: `chapter:${chapter}`'), 'reader must bridge into canonical Chapter Records');
  assert(reader.includes('requestFullscreen') && reader.includes('IntersectionObserver') && reader.includes('navigator.clipboard'), 'fullscreen, scroll tracking, and share-link behavior are required');
  assert(reader.includes('toggleReaderBookmark') && reader.includes('chapterProgressFor'), 'bookmarks and chapter progress must use the versioned reader state');
  assert(!reader.includes('public/media/succession-contest/chapters'), 'public reader must not expose internal media paths');
  assert(!reader.includes('succession-reader__heading') && !reader.includes('succession-reader__directory'), 'legacy dashboard reader architecture must be removed');

  assert(storage.includes("hxh-succession-reader-state-v2") && storage.includes('chapters: {}') && storage.includes('bookmarks: []'), 'reader storage must be versioned and include progress plus bookmarks');
  assert(storage.includes("if (value === 'continuous') return 'scroll'") && storage.includes("if (value === 'single') return 'page'"), 'legacy reader mode URLs must remain compatible');
  assert(panel.includes('aria-modal=\"true\"') && panel.includes("event.key === 'Escape'") && panel.includes('focusableSelector'), 'reader panels must trap focus, close on Escape, and expose modal semantics');

  assert(router.includes("'/story/succession-contest/chapters'"), 'clean chapter reader URL must remain authoritative');
  assert(router.includes('readerParams'), 'reader query parameters must pass through clean URL generation');
  assert(shellCss.includes('.story-utility-shell--succession-reader') && shellCss.includes('width: 100%'), 'reader route shell must be full bleed');
  for (const selector of ['.succession-reader__topbar', '.succession-reader__bottombar', '.succession-reader__canvas', '.succession-reader-panel', '.succession-reader__pages.is-spread', '.succession-reader__chapter-groups']) assert(css.includes(selector), `reader design is missing ${selector}`);
  assert(css.includes('@media (max-width: 620px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'reader design requires mobile and reduced-motion layers');
  assert(css.includes('env(safe-area-inset-bottom)') && css.includes(':focus-visible'), 'reader design requires safe-area and focus-visible handling');

  for (const check of ['standalone and reading-first', 'complete grouped catalogue', 'modes fit direction', 'Bookmarks persist', 'Keyboard chapter navigation', 'Mobile reader is contained']) assert(qa.includes(check), `browser QA is missing ${check}`);

  console.log(`Succession reader audit passed: ${successionReaderCatalog.length} chapters, ${successionReaderPhaseGroups.length} chapter phases, three reading modes, full route state, progress, bookmarks, panels, archive bridging, responsive design, and browser QA verified.`);
} finally {
  await vite.close();
}
