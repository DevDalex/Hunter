import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Grid3X3,
  ImageOff,
  List,
  Search,
  ShieldAlert,
} from 'lucide-react';
import {
  SUCCESSION_READER_END,
  SUCCESSION_READER_START,
  SUCCESSION_READER_TOTAL,
  successionChapterReaderByNumber,
  successionChapterReaderRecords,
} from '../data/successionChapterReader.js';
import { writeStoredJson } from '../lib/browserStorage.js';
import './SuccessionChapterReader.css';
import './SuccessionChapterReaderPolish.css';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const numeric = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function ReaderPage({ chapter, page, index }) {
  const [failed, setFailed] = useState(false);
  const pageNumber = page.page || index + 1;
  const label = page.label || `p.${pageNumber}`;
  return <figure className={`succession-reader__page${failed ? ' is-failed' : ''}`} data-reader-page={pageNumber} data-page-id={page.id}>
    {!failed ? <img
      src={page.src}
      alt={`Hunter × Hunter Chapter ${chapter}, ${label}`}
      width={page.width}
      height={page.height}
      loading={index < 2 ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    /> : <div role="img" aria-label={`Chapter ${chapter} ${label} could not be loaded`}><ImageOff aria-hidden="true" /><strong>{label} unavailable</strong></div>}
    <figcaption>Chapter {chapter} · {label}</figcaption>
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
    writeStoredJson('hxh-succession-reader-progress', { chapter, page: safePageIndex + 1, mode });
  }, [chapter, mode, safePageIndex]);

  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return successionChapterReaderRecords;
    return successionChapterReaderRecords.filter((item) => `${item.chapter} ${item.bankStatus} ${item.pages.map((page) => page.label).join(' ')}`.toLowerCase().includes(normalized));
  }, [query]);

  const navigateRoute = (nextChapter, nextPage, nextMode = mode) => onNavigate?.(nextChapter, nextPage, nextMode);

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
    setAnnouncement(`Chapter ${chapter}, p.${bounded + 1} of ${pageCount}.`);
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
    if (event.key === 'PageUp') { event.preventDefault(); openChapter(chapter - 1, 'Moved to'); }
    if (event.key === 'PageDown') { event.preventDefault(); openChapter(chapter + 1, 'Moved to'); }
  };

  return <section className="succession-reader" aria-labelledby="succession-reader-title">
    <header className="succession-reader__heading">
      <div>
        <span>Succession Contest · Chapter Bank reader</span>
        <h2 id="succession-reader-title">Chapters {SUCCESSION_READER_START}–{SUCCESSION_READER_END}</h2>
        <p>{SUCCESSION_READER_TOTAL} permanent chapter records are indexed. Approved bank pages appear in stored order with stable <code>p.N</code> identities.</p>
      </div>
      <dl>
        <div><dt>Bank chapters</dt><dd>{SUCCESSION_READER_TOTAL}</dd></div>
        <div><dt>Selected</dt><dd>{chapter}</dd></div>
        <div><dt>Stored pages</dt><dd>{pageCount}</dd></div>
      </dl>
    </header>

    <p className="succession-reader__status" role="status" aria-live="polite">{announcement}</p>

    <div className="succession-reader__workspace">
      <aside className="succession-reader__directory" aria-label="Chapter Bank directory">
        <label className="succession-reader__search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search chapter, status, or page</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find chapter or p.7…" /></label>
        <div className="succession-reader__chapter-grid">
          {filteredChapters.map((item) => <button
            type="button"
            key={item.chapter}
            className={item.chapter === chapter ? 'is-active' : ''}
            aria-current={item.chapter === chapter ? 'page' : undefined}
            onClick={() => openChapter(item.chapter)}
          >
            <b>{item.chapter}</b>
            <small>{item.pageCount ? `${item.pageCount} pages` : item.bankStatus === 'needs-repair' ? 'Needs repair' : 'Empty bank'}</small>
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
        data-bank-status={record.bankStatus}
      >
        <header className="succession-reader__toolbar">
          <div><span>Chapter</span><strong>{chapter}</strong><small>{pageCount ? `${record.pages[safePageIndex]?.label || `p.${safePageIndex + 1}`} / ${pageCount}` : 'Empty bank record'}</small></div>
          <div className="succession-reader__mode" role="group" aria-label="Reading mode">
            <button type="button" className={mode === 'continuous' ? 'is-active' : ''} aria-pressed={mode === 'continuous'} onClick={() => changeMode('continuous')}><List size={16} /> Continuous</button>
            <button type="button" className={mode === 'single' ? 'is-active' : ''} aria-pressed={mode === 'single'} onClick={() => changeMode('single')}><Grid3X3 size={16} /> Single page</button>
          </div>
        </header>

        {record.missingPages?.length ? <div className="succession-reader__empty" role="alert"><ShieldAlert aria-hidden="true" /><h3>Chapter {chapter} needs repair.</h3><p>Missing bank pages: {record.missingPages.map((page) => `p.${page}`).join(', ')}. Stored page identities remain fixed until the missing files are repaired or the chapter is intentionally renumbered.</p></div> : null}

        {pageCount ? <div className={`succession-reader__pages is-${mode}`}>
          {mode === 'continuous'
            ? record.pages.map((page, index) => <ReaderPage key={page.id || `${chapter}-${page.page}`} chapter={chapter} page={page} index={index} />)
            : <ReaderPage chapter={chapter} page={record.pages[safePageIndex]} index={safePageIndex} />}
        </div> : <div className="succession-reader__empty" role="note">
          <BookOpen aria-hidden="true" />
          <h3>Chapter {chapter} has an empty bank record.</h3>
          <p>No authorized page files are stored yet. When imported, p.1 begins at the sequential path below.</p>
          <code>public/media/succession-contest/chapters/{chapter}/001.webp</code>
        </div>}

        <nav className="succession-reader__controls" aria-label="Chapter and page controls">
          <button type="button" onClick={() => pageCount && safePageIndex > 0 ? openPage(safePageIndex - 1) : openChapter(chapter - 1)} disabled={chapter === SUCCESSION_READER_START && (!pageCount || safePageIndex === 0)}><ArrowLeft size={17} /> {pageCount && safePageIndex > 0 ? 'Previous page' : 'Previous chapter'}</button>
          <span>Chapter {chapter}{pageCount ? ` · ${record.pages[safePageIndex]?.label || `p.${safePageIndex + 1}`} of ${pageCount}` : ''}</span>
          <button type="button" onClick={() => pageCount && safePageIndex < pageCount - 1 ? openPage(safePageIndex + 1) : openChapter(chapter + 1)} disabled={chapter === SUCCESSION_READER_END && (!pageCount || safePageIndex === pageCount - 1)}>{pageCount && safePageIndex < pageCount - 1 ? 'Next page' : 'Next chapter'} <ArrowRight size={17} /></button>
        </nav>
      </div>
    </div>
  </section>;
}
