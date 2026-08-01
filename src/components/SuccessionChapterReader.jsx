import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Command,
  FileText,
  Grid2X2,
  ImageOff,
  Images,
  Info,
  List,
  Maximize2,
  Menu,
  Minus,
  Moon,
  MoreHorizontal,
  RotateCcw,
  Search,
  Settings,
  Sun,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  SUCCESSION_READER_END,
  SUCCESSION_READER_START,
  SUCCESSION_READER_TOTAL,
} from '../data/successionChapterReader.js';
import {
  SUCCESSION_READER_AVAILABLE_TOTAL,
  successionReaderCatalog,
  successionReaderCatalogByNumber,
  successionReaderPhaseGroups,
} from '../data/successionReaderCatalog.js';
import ReaderPanel from './succession-reader/ReaderPanel.jsx';
import {
  chapterProgressFor,
  clearSuccessionReaderState,
  defaultReaderState,
  normalizeReaderDirection,
  normalizeReaderFit,
  normalizeReaderMode,
  normalizeReaderTheme,
  readSuccessionReaderState,
  toggleReaderBookmark,
  updateReaderBookmarkNote,
  withReaderProgress,
  writeSuccessionReaderState,
} from './succession-reader/readerState.js';
import './SuccessionChapterReader.css';
import './SuccessionChapterReaderPolish.css';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const numeric = (value, fallback = null) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const allowedPanels = new Set(['chapters', 'info', 'settings', 'thumbnails', 'bookmarks', 'shortcuts', 'commands']);
const modeLabels = { page: 'Page', spread: 'Spread', scroll: 'Scroll' };
const fitLabels = { width: 'Fit width', height: 'Fit height', original: 'Original size' };
const statusLabels = { available: 'Available', partial: 'Partial media', indexed: 'Indexed' };
const progressLabel = (page, count) => count ? `${Math.round((page / count) * 100)}%` : 'Indexed';

function ReaderPage({ chapter, page, index, priority = false, fit, zoom }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [page?.src]);

  const style = fit === 'original'
    ? { '--reader-page-width': `${Math.max(320, Math.round((page.width || 1120) * (zoom / 100)))}px` }
    : { '--reader-page-width': `${zoom}%` };

  return <figure
    className={`succession-reader__page is-fit-${fit}${failed ? ' is-failed' : ''}${loaded ? ' is-loaded' : ' is-loading'}`}
    data-reader-page={index + 1}
    style={style}
  >
    {!failed ? <>
      <span className="succession-reader__page-skeleton" aria-hidden="true" />
      <img
        src={page.src}
        alt={`Hunter × Hunter chapter ${chapter}, page ${index + 1}`}
        width={page.width}
        height={page.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </> : <div className="succession-reader__page-error" role="img" aria-label={`Chapter ${chapter} page ${index + 1} could not be loaded`}>
      <ImageOff aria-hidden="true" />
      <strong>Page {index + 1} could not be loaded.</strong>
      <span>Your reading position has been preserved.</span>
      <button type="button" onClick={() => setFailed(false)}><RotateCcw size={15} aria-hidden="true" /> Retry page</button>
    </div>}
    <figcaption>Page {index + 1}</figcaption>
  </figure>;
}

function ReaderEmptyState({ record, onChooseChapter, onOpenRecord }) {
  return <div className="succession-reader__empty" role="note">
    <BookOpen aria-hidden="true" />
    <span>{record.phase}</span>
    <h2>Chapter {record.chapter}</h2>
    <p>Pages are not available in the public reader yet. The chapter remains indexed and your place can still be saved.</p>
    <div>
      <button type="button" onClick={onChooseChapter}><Menu size={16} aria-hidden="true" /> Choose another chapter</button>
      {record.chapterRecordId && <button type="button" onClick={onOpenRecord}><FileText size={16} aria-hidden="true" /> Open chapter record</button>}
    </div>
  </div>;
}

export default function SuccessionChapterReader({
  requestedChapter,
  requestedPage,
  requestedMode,
  requestedFit,
  requestedDirection,
  requestedPanel,
  onNavigate,
  onExitArchive,
  onOpenChapterRecord,
}) {
  const savedInitial = useRef(readSuccessionReaderState());
  const explicitChapter = numeric(requestedChapter);
  const initialChapter = clamp(explicitChapter || savedInitial.current.lastChapter || SUCCESSION_READER_START, SUCCESSION_READER_START, SUCCESSION_READER_END);
  const initialPage = Math.max(1, numeric(requestedPage, explicitChapter ? 1 : savedInitial.current.lastPage || 1));
  const [readerState, setReaderState] = useState(savedInitial.current);
  const [chapter, setChapter] = useState(initialChapter);
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [mode, setMode] = useState(normalizeReaderMode(requestedMode || savedInitial.current.mode));
  const [fit, setFit] = useState(normalizeReaderFit(requestedFit || savedInitial.current.fit));
  const [direction, setDirection] = useState(normalizeReaderDirection(requestedDirection || savedInitial.current.direction));
  const [theme, setTheme] = useState(normalizeReaderTheme(savedInitial.current.theme));
  const [zoom, setZoom] = useState(savedInitial.current.zoom || 100);
  const [panel, setPanel] = useState(allowedPanels.has(requestedPanel) ? requestedPanel : (!explicitChapter && savedInitial.current.lastChapter ? 'resume' : null));
  const [chapterQuery, setChapterQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [commandQuery, setCommandQuery] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [announcement, setAnnouncement] = useState(`Chapter ${initialChapter} opened.`);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const readerRootRef = useRef(null);
  const panelReturnFocusRef = useRef(null);
  const scrollRouteTimerRef = useRef(null);
  const persistTimerRef = useRef(null);

  const record = successionReaderCatalogByNumber.get(chapter) || successionReaderCatalog[0];
  const pageCount = record.pages.length;
  const safePageIndex = pageCount ? clamp(pageIndex, 0, pageCount - 1) : 0;
  const currentPage = safePageIndex + 1;
  const completion = pageCount ? Math.round((currentPage / pageCount) * 100) : 0;
  const currentBookmark = readerState.bookmarks.find((bookmark) => bookmark.chapter === chapter && bookmark.page === currentPage) || null;

  const navigateRoute = useCallback((patch = {}) => {
    onNavigate?.({
      chapter: patch.chapter ?? chapter,
      page: patch.page ?? currentPage,
      mode: patch.mode ?? mode,
      fit: patch.fit ?? fit,
      direction: patch.direction ?? direction,
      panel: patch.panel,
    });
  }, [chapter, currentPage, direction, fit, mode, onNavigate]);

  const openPanel = useCallback((name, trigger = null) => {
    panelReturnFocusRef.current = trigger || document.activeElement;
    setPanel(name);
    setChromeVisible(true);
    if (allowedPanels.has(name)) navigateRoute({ panel: name });
  }, [navigateRoute]);

  const closePanel = useCallback(() => {
    setPanel(null);
    setCommandQuery('');
    navigateRoute({ panel: undefined });
  }, [navigateRoute]);

  const scrollToPage = useCallback((pageNumber, behavior = 'smooth') => {
    window.setTimeout(() => {
      canvasRef.current?.querySelector(`[data-reader-page="${pageNumber}"]`)?.scrollIntoView({ behavior, block: 'start' });
    }, 20);
  }, []);

  const openPage = useCallback((nextIndex, options = {}) => {
    if (!pageCount) return;
    const bounded = clamp(nextIndex, 0, pageCount - 1);
    setPageIndex(bounded);
    setAnnouncement(`Chapter ${chapter}, page ${bounded + 1} of ${pageCount}.`);
    navigateRoute({ page: bounded + 1 });
    if (mode === 'scroll' && options.scroll !== false) scrollToPage(bounded + 1);
  }, [chapter, mode, navigateRoute, pageCount, scrollToPage]);

  const openChapter = useCallback((nextChapter, { resume = true, source = 'Opened' } = {}) => {
    const bounded = clamp(nextChapter, SUCCESSION_READER_START, SUCCESSION_READER_END);
    const nextRecord = successionReaderCatalogByNumber.get(bounded);
    const remembered = resume ? chapterProgressFor(readerState, bounded).page : 1;
    const nextPage = nextRecord?.pageCount ? clamp(remembered || 1, 1, nextRecord.pageCount) : 1;
    setChapter(bounded);
    setPageIndex(nextPage - 1);
    setAnnouncement(`${source} chapter ${bounded}${nextPage > 1 ? ` at page ${nextPage}` : ''}.`);
    setPanel(null);
    navigateRoute({ chapter: bounded, page: nextPage, panel: undefined });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [navigateRoute, readerState]);

  const moveByPage = useCallback((directionAmount) => {
    const step = mode === 'spread' ? 2 : 1;
    const nextIndex = safePageIndex + (directionAmount * step);
    if (pageCount && nextIndex >= 0 && nextIndex < pageCount) {
      openPage(nextIndex);
      return;
    }
    const nextChapter = chapter + directionAmount;
    if (nextChapter >= SUCCESSION_READER_START && nextChapter <= SUCCESSION_READER_END) openChapter(nextChapter, { resume: directionAmount < 0, source: 'Moved to' });
  }, [chapter, mode, openChapter, openPage, pageCount, safePageIndex]);

  const changeMode = useCallback((nextMode) => {
    const normalized = normalizeReaderMode(nextMode);
    setMode(normalized);
    setAnnouncement(`${modeLabels[normalized]} reading mode selected.`);
    navigateRoute({ mode: normalized });
    if (normalized === 'scroll') scrollToPage(currentPage, 'auto');
  }, [currentPage, navigateRoute, scrollToPage]);

  const changeFit = useCallback((nextFit) => {
    const normalized = normalizeReaderFit(nextFit);
    setFit(normalized);
    setAnnouncement(`${fitLabels[normalized]} selected.`);
    navigateRoute({ fit: normalized });
  }, [navigateRoute]);

  const changeDirection = useCallback((nextDirection) => {
    const normalized = normalizeReaderDirection(nextDirection);
    setDirection(normalized);
    setAnnouncement(`${normalized === 'rtl' ? 'Right-to-left' : 'Left-to-right'} reading direction selected.`);
    navigateRoute({ direction: normalized });
  }, [navigateRoute]);

  const changeZoom = useCallback((nextZoom) => {
    const bounded = clamp(Math.round(nextZoom / 10) * 10, 50, 400);
    setZoom(bounded);
    setAnnouncement(`Zoom ${bounded} percent.`);
  }, []);

  const toggleBookmark = useCallback(() => {
    setReaderState((current) => {
      const next = toggleReaderBookmark(current, chapter, currentPage, bookmarkNote);
      writeSuccessionReaderState(next);
      return next;
    });
    setAnnouncement(currentBookmark ? `Bookmark removed from chapter ${chapter}, page ${currentPage}.` : `Bookmarked chapter ${chapter}, page ${currentPage}.`);
    setBookmarkNote('');
  }, [bookmarkNote, chapter, currentBookmark, currentPage]);

  const saveBookmarkNote = useCallback((bookmark, note) => {
    setReaderState((current) => {
      const next = updateReaderBookmarkNote(current, bookmark.chapter, bookmark.page, note);
      writeSuccessionReaderState(next);
      return next;
    });
    setAnnouncement('Bookmark note saved.');
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await readerRootRef.current?.requestFullscreen?.();
    } catch {
      setAnnouncement('Fullscreen is not available in this browser.');
    }
  }, []);

  const copyPageLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setAnnouncement('Current page link copied.');
    } catch {
      setAnnouncement('The page link could not be copied automatically.');
    }
  }, []);

  useEffect(() => {
    const nextChapter = clamp(numeric(requestedChapter, chapter), SUCCESSION_READER_START, SUCCESSION_READER_END);
    const nextRecord = successionReaderCatalogByNumber.get(nextChapter);
    const nextPage = Math.max(1, numeric(requestedPage, 1));
    setChapter(nextChapter);
    setPageIndex(nextRecord?.pageCount ? clamp(nextPage, 1, nextRecord.pageCount) - 1 : 0);
    if (requestedMode) setMode(normalizeReaderMode(requestedMode));
    if (requestedFit) setFit(normalizeReaderFit(requestedFit));
    if (requestedDirection) setDirection(normalizeReaderDirection(requestedDirection));
    if (allowedPanels.has(requestedPanel)) setPanel(requestedPanel);
  }, [requestedChapter, requestedDirection, requestedFit, requestedMode, requestedPage, requestedPanel]);

  useEffect(() => {
    window.clearTimeout(persistTimerRef.current);
    persistTimerRef.current = window.setTimeout(() => {
      setReaderState((current) => {
        const next = withReaderProgress(current, {
          chapter,
          page: currentPage,
          pageCount,
          mode,
          fit,
          direction,
          theme,
          zoom,
        });
        writeSuccessionReaderState(next);
        return next;
      });
    }, 140);
    return () => window.clearTimeout(persistTimerRef.current);
  }, [chapter, currentPage, direction, fit, mode, pageCount, theme, zoom]);

  useEffect(() => {
    if (!pageCount) return undefined;
    const candidates = [safePageIndex - 1, safePageIndex + 1, safePageIndex + 2]
      .filter((index) => index >= 0 && index < pageCount);
    const images = candidates.map((index) => {
      const image = new Image();
      image.src = record.pages[index].src;
      return image;
    });
    return () => images.forEach((image) => { image.src = ''; });
  }, [pageCount, record.pages, safePageIndex]);

  useEffect(() => {
    if (mode !== 'scroll' || !pageCount || !canvasRef.current) return undefined;
    const pages = [...canvasRef.current.querySelectorAll('[data-reader-page]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      const nextPage = Number(visible.target.dataset.readerPage || 1);
      if (nextPage === currentPage) return;
      setPageIndex(nextPage - 1);
      window.clearTimeout(scrollRouteTimerRef.current);
      scrollRouteTimerRef.current = window.setTimeout(() => navigateRoute({ page: nextPage }), 260);
    }, { threshold: [0.35, 0.55, 0.75] });
    pages.forEach((page) => observer.observe(page));
    return () => {
      observer.disconnect();
      window.clearTimeout(scrollRouteTimerRef.current);
    };
  }, [currentPage, mode, navigateRoute, pageCount]);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  useEffect(() => {
    if (panel || !chromeVisible) return undefined;
    const timer = window.setTimeout(() => setChromeVisible(false), mode === 'scroll' ? 5000 : 3500);
    return () => window.clearTimeout(timer);
  }, [chromeVisible, mode, panel]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const typing = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openPanel('commands');
        return;
      }
      if (typing || panel) return;
      const key = event.key.toLowerCase();
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        direction === 'rtl' ? moveByPage(1) : moveByPage(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        direction === 'rtl' ? moveByPage(-1) : moveByPage(1);
      } else if (event.key === 'PageUp') {
        event.preventDefault();
        openChapter(chapter - 1, { source: 'Moved to' });
      } else if (event.key === 'PageDown') {
        event.preventDefault();
        openChapter(chapter + 1, { resume: false, source: 'Moved to' });
      } else if (event.key === ' ' && !event.shiftKey) {
        event.preventDefault();
        moveByPage(1);
      } else if (event.key === ' ' && event.shiftKey) {
        event.preventDefault();
        moveByPage(-1);
      } else if (key === 'c') openPanel('chapters');
      else if (key === 't') openPanel('thumbnails');
      else if (key === 'i') openPanel('info');
      else if (key === 's') openPanel('settings');
      else if (key === 'b') toggleBookmark();
      else if (key === 'm') changeMode(mode === 'page' ? 'spread' : mode === 'spread' ? 'scroll' : 'page');
      else if (key === 'f') toggleFullscreen();
      else if (key === '?') openPanel('shortcuts');
      else if (key === '+' || key === '=') changeZoom(zoom + 10);
      else if (key === '-') changeZoom(zoom - 10);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [changeMode, changeZoom, chapter, direction, mode, moveByPage, openChapter, openPanel, panel, toggleBookmark, toggleFullscreen, zoom]);

  const visibleChapterGroups = useMemo(() => {
    const normalized = chapterQuery.trim().toLocaleLowerCase();
    const bookmarkedChapters = new Set(readerState.bookmarks.map((bookmark) => bookmark.chapter));
    return successionReaderPhaseGroups.map((group) => ({
      ...group,
      chapters: group.chapters.filter((item) => {
        const progress = chapterProgressFor(readerState, item.chapter);
        const matchesQuery = !normalized || `${item.chapter} ${item.title} ${item.phase} ${item.focus} ${item.lanes.join(' ')}`.toLocaleLowerCase().includes(normalized);
        const matchesFilter = chapterFilter === 'all'
          || (chapterFilter === 'available' && item.pageCount)
          || (chapterFilter === 'unread' && !progress.percent)
          || (chapterFilter === 'progress' && progress.percent > 0 && !progress.completed)
          || (chapterFilter === 'completed' && progress.completed)
          || (chapterFilter === 'bookmarked' && bookmarkedChapters.has(item.chapter));
        return matchesQuery && matchesFilter;
      }),
    })).filter((group) => group.chapters.length);
  }, [chapterFilter, chapterQuery, readerState]);

  const commands = useMemo(() => [
    { label: 'Open chapter drawer', keywords: 'chapters choose search', action: () => openPanel('chapters') },
    { label: 'Open page thumbnails', keywords: 'pages thumbnails', action: () => openPanel('thumbnails') },
    { label: 'Open chapter information', keywords: 'info research record', action: () => openPanel('info') },
    { label: 'Open bookmarks', keywords: 'saved pages notes', action: () => openPanel('bookmarks') },
    { label: `Switch to ${mode === 'page' ? 'spread' : mode === 'spread' ? 'scroll' : 'page'} mode`, keywords: 'mode layout', action: () => changeMode(mode === 'page' ? 'spread' : mode === 'spread' ? 'scroll' : 'page') },
    { label: 'Fit page width', keywords: 'fit width', action: () => changeFit('width') },
    { label: 'Fit page height', keywords: 'fit height', action: () => changeFit('height') },
    { label: 'Toggle fullscreen', keywords: 'fullscreen immersive', action: toggleFullscreen },
    { label: currentBookmark ? 'Remove current bookmark' : 'Bookmark current page', keywords: 'bookmark save', action: toggleBookmark },
    { label: 'Copy current page link', keywords: 'share copy url', action: copyPageLink },
    { label: 'Return to Succession Archive', keywords: 'archive back exit', action: onExitArchive },
  ], [changeFit, changeMode, copyPageLink, currentBookmark, mode, onExitArchive, openPanel, toggleBookmark, toggleFullscreen]);

  const filteredCommands = commands.filter((command) => `${command.label} ${command.keywords}`.toLocaleLowerCase().includes(commandQuery.trim().toLocaleLowerCase()));

  const spreadStart = safePageIndex === 0 ? 0 : safePageIndex % 2 === 1 ? safePageIndex : safePageIndex - 1;
  const spreadEntries = pageCount ? record.pages.slice(spreadStart, spreadStart + 2).map((page, offset) => ({ page, index: spreadStart + offset })) : [];
  const orderedSpreadEntries = direction === 'rtl' ? [...spreadEntries].reverse() : spreadEntries;
  const leftTapAction = direction === 'rtl' ? () => moveByPage(1) : () => moveByPage(-1);
  const rightTapAction = direction === 'rtl' ? () => moveByPage(-1) : () => moveByPage(1);
  const leftTapLabel = direction === 'rtl' ? 'Next page' : 'Previous page';
  const rightTapLabel = direction === 'rtl' ? 'Previous page' : 'Next page';

  const resetProgress = () => {
    if (!window.confirm('Reset all Succession reader progress, preferences, and bookmarks?')) return;
    clearSuccessionReaderState();
    setReaderState({ ...defaultReaderState, chapters: {}, bookmarks: [] });
    setChapter(SUCCESSION_READER_START);
    setPageIndex(0);
    setMode('page');
    setFit('width');
    setDirection('rtl');
    setTheme('black');
    setZoom(100);
    closePanel();
    navigateRoute({ chapter: SUCCESSION_READER_START, page: 1, mode: 'page', fit: 'width', direction: 'rtl' });
    setAnnouncement('Reader progress and preferences reset.');
  };

  return <section
    ref={readerRootRef}
    className={`succession-reader is-theme-${theme}${chromeVisible || panel ? ' is-chrome-visible' : ' is-chrome-hidden'}${fullscreen ? ' is-fullscreen' : ''}`}
    data-reader-chapter={chapter}
    data-reader-mode={mode}
    data-reader-fit={fit}
    data-reader-direction={direction}
    onPointerMove={() => setChromeVisible(true)}
  >
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

    <header className="succession-reader__topbar">
      <div className="succession-reader__topbar-start">
        <button type="button" className="succession-reader__icon-button" onClick={onExitArchive} aria-label="Return to Succession Archive"><ArrowLeft aria-hidden="true" /></button>
        <button type="button" className="succession-reader__chapter-trigger" onClick={(event) => openPanel('chapters', event.currentTarget)}><Menu size={17} aria-hidden="true" /><span>Chapters</span></button>
        <div className="succession-reader__identity"><span>Succession Contest</span><strong>Chapter {chapter}</strong><small>{record.title}</small></div>
      </div>

      <div className="succession-reader__topbar-progress" aria-label={`Page ${currentPage} of ${pageCount || 0}, ${completion} percent`}>
        <span>{pageCount ? `Page ${currentPage} of ${pageCount}` : statusLabels[record.mediaStatus]}</span>
        <div><i style={{ width: `${completion}%` }} /></div>
        <b>{pageCount ? `${completion}%` : '—'}</b>
      </div>

      <div className="succession-reader__topbar-actions">
        <label className="succession-reader__select"><span className="sr-only">Reading mode</span><select value={mode} onChange={(event) => changeMode(event.target.value)}><option value="page">Page</option><option value="spread">Spread</option><option value="scroll">Scroll</option></select></label>
        <label className="succession-reader__select"><span className="sr-only">Page fit</span><select value={fit} onChange={(event) => changeFit(event.target.value)}><option value="width">Fit width</option><option value="height">Fit height</option><option value="original">Original</option></select></label>
        <div className="succession-reader__zoom" role="group" aria-label="Zoom controls"><button type="button" onClick={() => changeZoom(zoom - 10)} aria-label="Zoom out"><Minus size={15} /></button><span>{zoom}%</span><button type="button" onClick={() => changeZoom(zoom + 10)} aria-label="Zoom in"><ZoomIn size={15} /></button></div>
        <button type="button" className="succession-reader__icon-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}><Maximize2 aria-hidden="true" /></button>
        <button type="button" className="succession-reader__icon-button" onClick={(event) => openPanel('settings', event.currentTarget)} aria-label="Reader settings"><MoreHorizontal aria-hidden="true" /></button>
      </div>
    </header>

    {record.mediaStatus === 'partial' && <div className="succession-reader__media-notice" role="status">{record.pageCount} of {record.expectedPageCount} expected pages are currently available.</div>}

    <main
      ref={canvasRef}
      className={`succession-reader__canvas is-${mode} is-fit-${fit}`}
      tabIndex={0}
      aria-label={`Chapter ${chapter} manga reader in ${modeLabels[mode].toLowerCase()} mode`}
      onClick={(event) => {
        if (event.target === event.currentTarget) setChromeVisible((visible) => !visible);
      }}
    >
      {pageCount ? <>
        {mode === 'scroll' && <div className="succession-reader__pages is-scroll">{record.pages.map((page, index) => <ReaderPage key={`${chapter}-${page.page}`} chapter={chapter} page={page} index={index} priority={index < 2} fit={fit} zoom={zoom} />)}</div>}
        {mode === 'page' && <div className="succession-reader__pages is-page"><ReaderPage chapter={chapter} page={record.pages[safePageIndex]} index={safePageIndex} priority fit={fit} zoom={zoom} /></div>}
        {mode === 'spread' && <div className={`succession-reader__pages is-spread is-${direction}`}>{orderedSpreadEntries.map(({ page, index }) => <ReaderPage key={`${chapter}-${page.page}`} chapter={chapter} page={page} index={index} priority fit={fit} zoom={zoom} />)}</div>}
        {mode !== 'scroll' && <div className="succession-reader__tap-zones" aria-hidden="false"><button type="button" onClick={leftTapAction} aria-label={leftTapLabel} /><button type="button" onClick={() => setChromeVisible((visible) => !visible)} aria-label="Show or hide reader controls" /><button type="button" onClick={rightTapAction} aria-label={rightTapLabel} /></div>}
      </> : <ReaderEmptyState record={record} onChooseChapter={() => openPanel('chapters')} onOpenRecord={() => onOpenChapterRecord?.(chapter)} />}
    </main>

    <footer className="succession-reader__bottombar">
      <button type="button" onClick={() => moveByPage(-1)} disabled={chapter === SUCCESSION_READER_START && (!pageCount || safePageIndex === 0)}><ArrowLeft size={17} aria-hidden="true" /><span>{safePageIndex > 0 ? 'Previous page' : 'Previous chapter'}</span></button>
      <div className="succession-reader__page-jump">
        <button type="button" onClick={(event) => openPanel('thumbnails', event.currentTarget)} disabled={!pageCount}><Images size={16} aria-hidden="true" /><span>{pageCount ? `${currentPage} / ${pageCount}` : 'No pages'}</span></button>
        <input aria-label="Jump to page" type="range" min="1" max={Math.max(1, pageCount)} value={currentPage} disabled={!pageCount} onChange={(event) => openPage(Number(event.target.value) - 1)} />
        <span>{progressLabel(currentPage, pageCount)}</span>
      </div>
      <div className="succession-reader__bottom-actions">
        <button type="button" className={currentBookmark ? 'is-active' : ''} onClick={toggleBookmark} aria-pressed={Boolean(currentBookmark)} aria-label={currentBookmark ? 'Remove bookmark from current page' : 'Bookmark current page'}><Bookmark size={17} aria-hidden="true" /></button>
        <button type="button" onClick={() => moveByPage(1)} disabled={chapter === SUCCESSION_READER_END && (!pageCount || safePageIndex >= pageCount - 1)}><span>{pageCount && safePageIndex < pageCount - 1 ? 'Next page' : 'Next chapter'}</span><ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </footer>

    <ReaderPanel open={panel === 'resume'} title="Resume reading" side="center" onClose={() => setPanel(null)} returnFocusRef={panelReturnFocusRef} className="succession-reader-panel--resume">
      <div className="succession-reader__resume-card">
        <BookOpen aria-hidden="true" />
        <span>Saved on this browser</span>
        <h3>Chapter {savedInitial.current.lastChapter} · Page {savedInitial.current.lastPage}</h3>
        <p>Continue from your most recent local reading position, start over, or choose another chapter.</p>
        <div><button type="button" className="is-primary" onClick={() => { setPanel(null); openChapter(savedInitial.current.lastChapter, { resume: true, source: 'Resumed' }); }}>Resume</button><button type="button" onClick={() => openChapter(SUCCESSION_READER_START, { resume: false, source: 'Started' })}>Start at {SUCCESSION_READER_START}</button><button type="button" onClick={() => openPanel('chapters')}>Choose chapter</button></div>
      </div>
    </ReaderPanel>

    <ReaderPanel open={panel === 'chapters'} title="Chapter drawer" onClose={closePanel} returnFocusRef={panelReturnFocusRef}>
      <div className="succession-reader__chapter-tools">
        <label><Search size={17} aria-hidden="true" /><span className="sr-only">Search chapters</span><input data-reader-autofocus value={chapterQuery} onChange={(event) => setChapterQuery(event.target.value)} placeholder="Chapter, title, phase, character…" /></label>
        <div role="group" aria-label="Chapter filters">{[
          ['all', 'All'], ['available', 'Available'], ['unread', 'Unread'], ['progress', 'In progress'], ['completed', 'Completed'], ['bookmarked', 'Bookmarked'],
        ].map(([id, label]) => <button type="button" key={id} className={chapterFilter === id ? 'is-active' : ''} aria-pressed={chapterFilter === id} onClick={() => setChapterFilter(id)}>{label}</button>)}</div>
      </div>
      <div className="succession-reader__chapter-summary"><span>{SUCCESSION_READER_TOTAL} indexed</span><span>{SUCCESSION_READER_AVAILABLE_TOTAL} with pages</span><span>{readerState.bookmarks.length} bookmarks</span></div>
      <div className="succession-reader__chapter-groups">
        {visibleChapterGroups.map((group) => <section key={group.id}><header><div><span>{group.range[0]}–{group.range[1]}</span><h3>{group.label}</h3></div><p>{group.description}</p></header><div>{group.chapters.map((item) => {
          const progress = chapterProgressFor(readerState, item.chapter);
          const bookmarked = readerState.bookmarks.some((bookmark) => bookmark.chapter === item.chapter);
          return <button type="button" key={item.chapter} className={item.chapter === chapter ? 'is-active' : ''} aria-current={item.chapter === chapter ? 'page' : undefined} onClick={() => openChapter(item.chapter)}>
            <span className="succession-reader__chapter-number">{item.chapter}</span>
            <span className="succession-reader__chapter-copy"><b>{item.title}</b><small>{item.voyageDay} · {statusLabels[item.mediaStatus]}{item.pageCount ? ` · ${item.pageCount} pages` : ''}</small><i><em style={{ width: `${progress.percent || 0}%` }} /></i></span>
            <span className="succession-reader__chapter-state">{bookmarked && <Bookmark size={13} aria-label="Bookmarked" />}{progress.completed && <Check size={14} aria-label="Completed" />}{progress.percent > 0 && !progress.completed && <small>{progress.percent}%</small>}</span>
          </button>;
        })}</div></section>)}
        {!visibleChapterGroups.length && <div className="succession-reader__panel-empty"><Search aria-hidden="true" /><h3>No matching chapters</h3><p>Clear the search or change the selected filter.</p></div>}
      </div>
    </ReaderPanel>

    <ReaderPanel open={panel === 'thumbnails'} title={`Chapter ${chapter} pages`} side="bottom" onClose={closePanel} returnFocusRef={panelReturnFocusRef}>
      {pageCount ? <div className="succession-reader__thumbnails">{record.pages.map((page, index) => <button type="button" key={page.page} className={index === safePageIndex ? 'is-active' : ''} aria-current={index === safePageIndex ? 'page' : undefined} onClick={() => { closePanel(); openPage(index); }}><img src={page.src} alt="" loading="lazy" /><span>Page {index + 1}</span>{readerState.bookmarks.some((bookmark) => bookmark.chapter === chapter && bookmark.page === index + 1) && <Bookmark size={13} aria-label="Bookmarked" />}</button>)}</div> : <div className="succession-reader__panel-empty"><ImageOff aria-hidden="true" /><h3>No page thumbnails</h3><p>This chapter does not yet have public reader pages.</p></div>}
    </ReaderPanel>

    <ReaderPanel open={panel === 'info'} title={`Chapter ${chapter} information`} side="right" onClose={closePanel} returnFocusRef={panelReturnFocusRef}>
      <article className="succession-reader__chapter-info"><span>{record.phase}</span><h3>{record.title}</h3><p>{record.focus || 'A chapter record is indexed, but a local study summary is not currently available.'}</p><dl><div><dt>Chapter</dt><dd>{chapter}</dd></div><div><dt>Voyage day</dt><dd>{record.voyageDay}</dd></div><div><dt>Media</dt><dd>{statusLabels[record.mediaStatus]}</dd></div><div><dt>Pages</dt><dd>{record.pageCount || 'Not available'}</dd></div><div><dt>Events linked</dt><dd>{record.eventCount}</dd></div><div><dt>Locations linked</dt><dd>{record.locationCount}</dd></div></dl>{!!record.lanes.length && <section><h4>Story lanes</h4><div>{record.lanes.map((lane) => <span key={lane}>{lane}</span>)}</div></section>}<div className="succession-reader__chapter-info-actions">{record.chapterRecordId && <button type="button" className="is-primary" onClick={() => onOpenChapterRecord?.(chapter)}><FileText size={16} aria-hidden="true" /> Open Chapter Record</button>}<button type="button" onClick={copyPageLink}>Copy page link</button></div></article>
    </ReaderPanel>

    <ReaderPanel open={panel === 'settings'} title="Reader settings" side="right" onClose={closePanel} returnFocusRef={panelReturnFocusRef}>
      <div className="succession-reader__settings">
        <fieldset><legend>Reading mode</legend><div className="succession-reader__setting-grid">{[['page', <BookOpen key="page" />], ['spread', <Grid2X2 key="spread" />], ['scroll', <List key="scroll" />]].map(([id, icon]) => <button type="button" key={id} className={mode === id ? 'is-active' : ''} onClick={() => changeMode(id)}>{icon}<span>{modeLabels[id]}</span></button>)}</div></fieldset>
        <fieldset><legend>Page fitting</legend><div className="succession-reader__setting-grid">{Object.entries(fitLabels).map(([id, label]) => <button type="button" key={id} className={fit === id ? 'is-active' : ''} onClick={() => changeFit(id)}><span>{label}</span></button>)}</div></fieldset>
        <fieldset><legend>Reading direction</legend><div className="succession-reader__setting-grid is-two"><button type="button" className={direction === 'rtl' ? 'is-active' : ''} onClick={() => changeDirection('rtl')}>Right to left</button><button type="button" className={direction === 'ltr' ? 'is-active' : ''} onClick={() => changeDirection('ltr')}>Left to right</button></div></fieldset>
        <fieldset><legend>Reader environment</legend><div className="succession-reader__setting-grid is-four">{[['black', 'Black', <Moon key="black" />], ['charcoal', 'Charcoal', <Moon key="charcoal" />], ['gray', 'Gray', <Sun key="gray" />], ['paper', 'Paper', <Sun key="paper" />]].map(([id, label, icon]) => <button type="button" key={id} className={theme === id ? 'is-active' : ''} onClick={() => setTheme(id)}>{icon}<span>{label}</span></button>)}</div></fieldset>
        <fieldset><legend>Zoom</legend><div className="succession-reader__zoom-setting"><button type="button" onClick={() => changeZoom(zoom - 10)} aria-label="Zoom out"><ZoomOut /></button><input type="range" min="50" max="400" step="10" value={zoom} onChange={(event) => changeZoom(Number(event.target.value))} /><output>{zoom}%</output><button type="button" onClick={() => changeZoom(zoom + 10)} aria-label="Zoom in"><ZoomIn /></button></div></fieldset>
        <fieldset><legend>Reader data</legend><div className="succession-reader__danger-zone"><button type="button" onClick={() => openPanel('bookmarks')}>Manage {readerState.bookmarks.length} bookmark{readerState.bookmarks.length === 1 ? '' : 's'}</button><button type="button" onClick={resetProgress}>Reset reader progress</button></div></fieldset>
        <button type="button" className="succession-reader__shortcut-link" onClick={() => openPanel('shortcuts')}><Command size={16} /> View keyboard shortcuts</button>
      </div>
    </ReaderPanel>

    <ReaderPanel open={panel === 'bookmarks'} title="Bookmarks" side="right" onClose={closePanel} returnFocusRef={panelReturnFocusRef}>
      <div className="succession-reader__bookmark-current"><span>Current page</span><strong>Chapter {chapter} · Page {currentPage}</strong>{currentBookmark ? <><textarea value={currentBookmark.note} onChange={(event) => saveBookmarkNote(currentBookmark, event.target.value)} placeholder="Add a note to this bookmark…" /><button type="button" onClick={toggleBookmark}>Remove current bookmark</button></> : <><textarea value={bookmarkNote} onChange={(event) => setBookmarkNote(event.target.value)} placeholder="Optional bookmark note…" /><button type="button" className="is-primary" onClick={toggleBookmark}><Bookmark size={15} /> Bookmark current page</button></>}</div>
      <div className="succession-reader__bookmark-list">{[...readerState.bookmarks].sort((left, right) => right.chapter - left.chapter || right.page - left.page).map((bookmark) => <article key={bookmark.id}><div><Bookmark size={15} aria-hidden="true" /><span>Chapter {bookmark.chapter}</span><b>Page {bookmark.page}</b></div>{bookmark.note && <p>{bookmark.note}</p>}<footer><button type="button" onClick={() => { closePanel(); setChapter(bookmark.chapter); setPageIndex(bookmark.page - 1); navigateRoute({ chapter: bookmark.chapter, page: bookmark.page, panel: undefined }); }}>Open</button><button type="button" onClick={() => { setReaderState((current) => { const next = toggleReaderBookmark(current, bookmark.chapter, bookmark.page); writeSuccessionReaderState(next); return next; }); }}>Remove</button></footer></article>)}{!readerState.bookmarks.length && <div className="succession-reader__panel-empty"><Bookmark aria-hidden="true" /><h3>No bookmarks yet</h3><p>Press B or use the bottom bookmark button to save a page.</p></div>}</div>
    </ReaderPanel>

    <ReaderPanel open={panel === 'shortcuts'} title="Keyboard shortcuts" side="center" onClose={closePanel} returnFocusRef={panelReturnFocusRef}>
      <div className="succession-reader__shortcuts">{[
        ['← / →', 'Previous or next page in the selected reading direction'], ['Page Up / Page Down', 'Previous or next chapter'], ['Space / Shift + Space', 'Next or previous page'], ['C', 'Open chapter drawer'], ['T', 'Open page thumbnails'], ['I', 'Open chapter information'], ['B', 'Toggle current bookmark'], ['M', 'Cycle reading mode'], ['F', 'Toggle fullscreen'], ['+ / −', 'Zoom in or out'], ['Ctrl / Cmd + K', 'Open reader command palette'], ['?', 'Open this shortcut guide'], ['Escape', 'Close the active panel'],
      ].map(([keys, action]) => <div key={keys}><kbd>{keys}</kbd><span>{action}</span></div>)}</div>
    </ReaderPanel>

    <ReaderPanel open={panel === 'commands'} title="Reader commands" side="center" onClose={closePanel} returnFocusRef={panelReturnFocusRef} className="succession-reader-panel--commands">
      <label className="succession-reader__command-search"><Command size={18} aria-hidden="true" /><span className="sr-only">Search reader commands</span><input data-reader-autofocus value={commandQuery} onChange={(event) => setCommandQuery(event.target.value)} placeholder="Go to chapter, change mode, open bookmarks…" /></label>
      <div className="succession-reader__command-list">{filteredCommands.map((command) => <button type="button" key={command.label} onClick={() => { closePanel(); command.action?.(); }}>{command.label}<ArrowRight size={14} aria-hidden="true" /></button>)}{!filteredCommands.length && <p>No matching reader command.</p>}</div>
    </ReaderPanel>
  </section>;
}
