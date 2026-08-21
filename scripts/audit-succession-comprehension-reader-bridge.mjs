import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession archive/Reader bridge audit failed: ${message}`);
};

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const reader = await vite.ssrLoadModule('/src/components/succession-reader/readerState.js');
  let state = reader.defaultReaderState;
  state = reader.withReaderProgress(state, {
    chapter: 417,
    page: 12,
    pageCount: 20,
    mode: 'page',
    fit: 'width',
    direction: 'rtl',
    theme: 'black',
    zoom: 100,
  });
  assert(state.lastChapter === 417 && state.lastPage === 12, 'Reader reducer did not retain the last chapter/page');
  assert(reader.chapterProgressFor(state, 417).page === 12 && reader.chapterProgressFor(state, 417).percent === 60, 'per-chapter Reader progress did not retain the saved page');

  const [bar, readerUi] = await Promise.all([
    readFile(path.join(root, 'src/components/succession/SuccessionComprehensionBar.jsx'), 'utf8'),
    readFile(path.join(root, 'src/components/SuccessionChapterReader.jsx'), 'utf8'),
  ]);

  for (const token of ['readSuccessionReaderState', 'chapterProgressFor', 'SUCCESSION_READER_STATE_KEY', 'Read Ch. {chapter}', 'Resume reader · Ch. {readerState.lastChapter} p.{readerState.lastPage}']) assert(bar.includes(token), `archive chapter bar is missing ${token}`);
  assert(bar.includes("onNavigate('reader', { chapter, page: currentReaderPage })"), 'current chapter does not hand its saved page to the Reader route');
  assert(bar.includes("onNavigate('reader', { chapter: readerState.lastChapter, page: readerState.lastPage })"), 'Resume Reader does not hand the last saved position to the Reader route');
  assert(bar.includes("window.addEventListener('storage', refreshReader)") && bar.includes("window.addEventListener('focus', refreshReader)"), 'archive bar does not refresh Reader progress after storage/focus changes');

  assert(readerUi.includes('readSuccessionReaderState()'), 'Reader no longer initializes from the shared persisted Reader state');
  assert(readerUi.includes('requestedChapter') && readerUi.includes('requestedPage'), 'Reader no longer accepts explicit archive chapter/page handoff');
  assert(readerUi.includes('withReaderProgress') && readerUi.includes('writeSuccessionReaderState'), 'Reader no longer persists its own authoritative page progress');

  console.log('Succession archive/Reader bridge audit passed: Reader remains authoritative for page progress while global archive controls can read/resume current and last saved positions.');
} finally {
  await vite.close();
}
