import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Grid3X3,
  ImageOff,
  List,
  Search,
} from 'lucide-react';
import {
  SUCCESSION_READER_END,
  SUCCESSION_READER_START,
  SUCCESSION_READER_TOTAL,
  successionChapterReaderByNumber,
  successionChapterReaderRecords,
} from '../data/successionChapterReader.js';
import './SuccessionChapterReader.css';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const numeric = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function ReaderPage({ chapter, page, index }) {
  const [failed, setFailed] = useState(false);
  return <figure className={`succession-reader__page${failed ? ' is-failed' : ''}`} data-reader-page={index + 1}>
    {!failed ? <img
      src={page.src}
      alt={`Hunter × Hunter chapter ${chapter}, page ${index + 1}`}
      width={page.width}
      height={page.height}
      loading={index < 2 ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    /> : <div role="img" aria-label={`Chapter ${chapter} page ${index + 1} could not be loaded`}><ImageOff aria-hidden="true" /><strong>Page unavailable</strong></div>}
    <figcaption>Chapter {chapter} · Page {index + 1}</figcaption>
  </figure>;
}

export default function SuccessionChapterReader({ requestedChapter, requestedPage, requestedMode, onNavigate }) {
  const initialChapter = clamp(numeric(requestedChapter, SUCCESSION_READER_START), SUCCESSION_READER_START, SUCCESSION_READER_END);
  const [chapter, setChapter] = useState(initialChapter);
  const [pageIndex, setPageIndex] = useState(Math.max(0, numeric(requestedPage, 1) - 1));
  const [mode, setMode] = useState(requestedMode === 'single' ? 'single' : 'continuous');
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState(`Chapter ${initialChapter} opened.`);

  const record = successionChapterReaderByNumber.get(chapter) || successionChapterReaderRecords[0];
  const pageCount = record.pages.length;
  const safePageIndex = pageCount ? clamp(pageIndex, 0, pageCount - 1) : 0;

  useEffect(() => {
    const nextChapter = clamp(numeric(requestedChapter, chapter), SUCCESSION_READER_START, SUCCESSION_READER_END);
    const nextPage = Math.max(0, numeric(requestedPage, 1) - 1);
    setChapter(nextChapter);
    setPageIndex(nextPage);
    if (requestedMode === 'single' || requestedMode === 'continuous') setMode(requestedMode);
  }, [requestedChapter, requestedMode, requestedPage]);

  useEffect(() => {
    try {
      window.localStorage.setItem('hxh-succession-reader-progress', JSON.stringify({ chapter, page: safePageIndex + 1, mode }));
    } catch {
      // Reader progress remains optional when storage is unavailable.
    }
  }, [chapter, mode, safePageIndex]);

  const filteredChapters = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return successionChapterReaderRecords;
    return successionChapterReaderRecords.filter((item) => String(item.chapter).includes(normalized));
  }, [query]);

  const navigateRoute = (nextChapter, nextPage, nextMode = mode) => {
    onNavigate?.(nextChapter, nextPage, nextMode);
  };

  const openChapter = (nextChapter, source = 'Opened') => {
    const bounded = clamp(nextChapter, SUCCESSION_READER_START, SUCCESSION_READER_END);
    setChapter(bounded);
    setPageIndex(0);
    setAnnouncement(`${source} chapter ${bounded}.`);
    navigateRoute(bounded, 1);
  };

  const openPage = (nextIndex) => {
    if (!pageCount) return;
    const bounded = clamp(nextIndex, 0, pageCount - 1);
    setPageIndex(bounded);
    setAnnouncement(`Chapter ${chapter}, page ${bounded + 1} of ${pageCount}.`);
    navigateRoute(chapter, bounded + 1);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setAnnouncement(`${nextMode === 'continuous' ? 'Continuous' : 'Single-page'} reading mode selected.`);
    navigateRoute(chapter, safePageIndex + 1, nextMode);
  };

  const handleKeys = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (pageCount && safePageIndex > 0) openPage(safePageIndex - 1);
      else openChapter(chapter - 1, 'Moved to');
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (pageCount && safePageIndex < pageCount - 1) openPage(safePageIndex + 1);
      else openChapter(chapter + 1, 'Moved to');
    }
    if (event.key === 'PageUp') {
      event.preventDefault();
      openChapter(chapter - 1, 'Moved to');
    }
    if (event.key === 'PageDown') {
      event.preventDefault();
      openChapter(chapter + 1, 'Moved to');
    }
  };

  return <section className="succession-reader" aria-labelledby="succession-reader-title">
    <header className="succession-reader__heading">
      <div>
        <span>Succession Contest · chapter reader framework</span>
        <h2 id="succession-reader-title">Chapters {SUCCESSION_READER_START}–{SUCCESSION_READER_END}</h2>
        <p>{SUCCESSION_READER_TOTAL} chapters are indexed in reading order. Approved local chapter pages appear automatically from beginning to end when they are added to the reader manifest.</p>
      </div>
      <dl>
        <div><dt>Indexed chapters</dt><dd>{SUCCESSION_READER_TOTAL}</dd></div>
        <div><dt>Selected</dt><dd>{chapter}</dd></div>
        <div><dt>Reader pages</dt><dd>{pageCount}</dd></div>
      </dl>
    </header>

    <p className="succession-reader__status" role="status" aria-live="polite">{announcement}</p>

    <div className="succession-reader__workspace">
      <aside className="succession-reader__directory" aria-label="Chapter directory">
        <label className="succession-reader__search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search chapter number</span><input value={query} onChange={(event) => setQuery(event.target.value)} inputMode="numeric" placeholder="Find chapter…" /></label>
        <div className="succession-reader__chapter-grid">
          {filteredChapters.map((item) => <button
            type="button"
            key={item.chapter}
            className={item.chapter === chapter ? 'is-active' : ''}
            aria-current={item.chapter === chapter ? 'page' : undefined}
            onClick={() => openChapter(item.chapter)}
          >
            <b>{item.chapter}</b>
            <small>{item.pageCount ? `${item.pageCount} pages` : 'Indexed'}</small>
          </button>)}
        </div>
      </aside>

      <div
        className="succession-reader__reader"
        tabIndex={0}
        onKeyDown={handleKeys}
        aria-label={`Chapter ${chapter} reader. Use Left and Right arrows for pages or adjacent chapters, and Page Up or Page Down for chapters.`}
        data-reader-chapter={chapter}
        data-reader-mode={mode}
        data-reader-page-count={pageCount}
      >
        <header className="succession-reader__toolbar">
          <div><span>Chapter</span><strong>{chapter}</strong><small>{pageCount ? `${safePageIndex + 1} / ${pageCount}` : 'Awaiting approved pages'}</small></div>
          <div className="succession-reader__mode" role="group" aria-label="Reading mode">
            <button type="button" className={mode === 'continuous' ? 'is-active' : ''} aria-pressed={mode === 'continuous'} onClick={() => changeMode('continuous')}><List size={16} /> Continuous</button>
            <button type="button" className={mode === 'single' ? 'is-active' : ''} aria-pressed={mode === 'single'} onClick={() => changeMode('single')}><Grid3X3 size={16} /> Single page</button>
          </div>
        </header>

        {pageCount ? <div className={`succession-reader__pages is-${mode}`}>
          {mode === 'continuous'
            ? record.pages.map((page, index) => <ReaderPage key={`${chapter}-${page.page}`} chapter={chapter} page={page} index={index} />)
            : <ReaderPage chapter={chapter} page={record.pages[safePageIndex]} index={safePageIndex} />}
        </div> : <div className="succession-reader__empty" role="note">
          <BookOpen aria-hidden="true" />
          <h3>Chapter {chapter} is indexed.</h3>
          <p>No authorized local page images have been added for this chapter. The reader will preserve the supplied page order automatically when approved media is available.</p>
          <code>public/media/succession-contest/chapters/{chapter}/001.webp</code>
        </div>}

        <nav className="succession-reader__controls" aria-label="Chapter and page controls">
          <button type="button" onClick={() => pageCount && safePageIndex > 0 ? openPage(safePageIndex - 1) : openChapter(chapter - 1)} disabled={chapter === SUCCESSION_READER_START && (!pageCount || safePageIndex === 0)}><ArrowLeft size={17} /> {pageCount && safePageIndex > 0 ? 'Previous page' : 'Previous chapter'}</button>
          <span>Chapter {chapter}{pageCount ? ` · Page ${safePageIndex + 1} of ${pageCount}` : ''}</span>
          <button type="button" onClick={() => pageCount && safePageIndex < pageCount - 1 ? openPage(safePageIndex + 1) : openChapter(chapter + 1)} disabled={chapter === SUCCESSION_READER_END && (!pageCount || safePageIndex === pageCount - 1)}>{pageCount && safePageIndex < pageCount - 1 ? 'Next page' : 'Next chapter'} <ArrowRight size={17} /></button>
        </nav>
      </div>
    </div>
  </section>;
}
