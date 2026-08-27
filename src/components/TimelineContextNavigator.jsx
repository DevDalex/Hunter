import { useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Maximize2,
  Minus,
  Plus,
  ShipWheel,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
} from '../data/successionTimeline';
import './TimelineContextNavigator.css';

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(value, maximum));
const finiteNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : null;

export default function TimelineContextNavigator({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const dragRef = useRef(null);
  const events = useMemo(() => {
    const prelude = successionPreludeEvents.filter((event) => event.chapter <= spoilerLimit);
    const voyage = successionDays.flatMap((day) => day.events.filter((event) => event.chapter <= spoilerLimit));
    return [...prelude, ...voyage];
  }, [spoilerLimit]);

  const chapterMinimum = events.length ? Math.min(...events.map((event) => event.chapter)) : 340;
  const chapterMaximum = events.length ? Math.max(...events.map((event) => event.chapter)) : chapterMinimum;
  const chapterSpan = Math.max(1, chapterMaximum - chapterMinimum + 1);
  const requestedChapter = finiteNumber(requestedState.chapter);
  const contextChapter = clamp(requestedChapter ?? chapterMaximum, chapterMinimum, chapterMaximum);
  const requestedWindow = finiteNumber(requestedState.window);
  const boundedWindowSize = clamp(requestedWindow ?? Math.min(chapterSpan, 18), 5, chapterSpan);
  const spatialActive = requestedState.view === 'intelligence' && requestedState.intel === 'space';

  const chapters = useMemo(() => {
    const counts = new Map();
    for (const event of events) counts.set(event.chapter, (counts.get(event.chapter) || 0) + 1);
    return Array.from({ length: chapterSpan }, (_, index) => {
      const chapter = chapterMinimum + index;
      return { chapter, count: counts.get(chapter) || 0 };
    });
  }, [chapterMinimum, chapterSpan, events]);

  const maximumDensity = Math.max(1, ...chapters.map((row) => row.count));
  let windowFrom = contextChapter - Math.floor((boundedWindowSize - 1) / 2);
  let windowTo = windowFrom + boundedWindowSize - 1;
  if (windowFrom < chapterMinimum) {
    windowTo += chapterMinimum - windowFrom;
    windowFrom = chapterMinimum;
  }
  if (windowTo > chapterMaximum) {
    windowFrom -= windowTo - chapterMaximum;
    windowTo = chapterMaximum;
  }
  windowFrom = clamp(windowFrom, chapterMinimum, chapterMaximum);
  windowTo = clamp(windowTo, chapterMinimum, chapterMaximum);

  const viewportLeft = ((windowFrom - chapterMinimum) / chapterSpan) * 100;
  const viewportWidth = ((windowTo - windowFrom + 1) / chapterSpan) * 100;
  const markerLeft = (((contextChapter - chapterMinimum) + 0.5) / chapterSpan) * 100;

  const commitContext = (chapter, windowSize = boundedWindowSize, overrides = {}, remove = []) => {
    const nextChapter = clamp(chapter, chapterMinimum, chapterMaximum);
    const preservedState = { ...requestedState };
    delete preservedState.event;
    for (const key of remove) delete preservedState[key];
    onNavigate?.({
      ...preservedState,
      scope: 'events',
      chapter: nextChapter,
      window: clamp(windowSize, 5, chapterSpan),
      ...overrides,
    });
  };

  const navigateToChapter = (chapter, overrides = {}) => commitContext(chapter, boundedWindowSize, overrides);
  const setWindowSize = (nextSize) => commitContext(contextChapter, nextSize, { mode: requestedState.mode || 'story' }, ['depth']);
  const zoomIn = () => setWindowSize(Math.max(5, Math.round(boundedWindowSize / 1.55)));
  const zoomOut = () => setWindowSize(Math.min(chapterSpan, Math.max(6, Math.round(boundedWindowSize * 1.55))));
  const fitAll = () => setWindowSize(chapterSpan);
  const recenter = () => setWindowSize(Math.min(chapterSpan, 18));

  const startViewportDrag = (event) => {
    if (event.button !== 0) return;
    const field = event.currentTarget.parentElement;
    const bounds = field?.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      width: field?.clientWidth || 1,
      fieldLeft: bounds?.left || 0,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.classList.add('is-dragging');
  };

  const finishViewportDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    dragRef.current = null;
    event.currentTarget.classList.remove('is-dragging');
    if (Math.abs(deltaX) < 5) {
      const fraction = clamp((event.clientX - drag.fieldLeft) / Math.max(1, drag.width), 0, .999);
      navigateToChapter(chapterMinimum + Math.floor(fraction * chapterSpan));
      return;
    }
    const chapterDelta = Math.round((deltaX / Math.max(1, drag.width)) * chapterSpan);
    if (chapterDelta) navigateToChapter(contextChapter + chapterDelta);
  };

  const handleViewportKey = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigateToChapter(contextChapter - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); navigateToChapter(contextChapter + 1); }
    if (event.key === 'PageUp') { event.preventDefault(); navigateToChapter(contextChapter - Math.max(1, Math.floor(boundedWindowSize / 2))); }
    if (event.key === 'PageDown') { event.preventDefault(); navigateToChapter(contextChapter + Math.max(1, Math.floor(boundedWindowSize / 2))); }
    if (event.key === 'Home') { event.preventDefault(); navigateToChapter(chapterMinimum); }
    if (event.key === 'End') { event.preventDefault(); navigateToChapter(chapterMaximum); }
  };

  const handleNavigatorWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    if (event.deltaY < 0) zoomIn();
    else if (event.deltaY > 0) zoomOut();
  };

  return (
    <section className="timeline-context-navigator" aria-label="Persistent story timeline navigator">
      <header className="tcn-head">
        <div className="tcn-head__identity">
          <span>FULL ARC</span>
          <strong>Ch. {chapterMinimum}–{chapterMaximum}</strong>
          <small>{events.length.toLocaleString()} indexed records</small>
        </div>
        <div className="tcn-head__clock" aria-live="polite">
          <Crosshair size={14} aria-hidden="true" />
          <span>ACTIVE CHAPTER</span>
          <strong>{contextChapter}</strong>
          <small>visible {windowFrom}–{windowTo}</small>
        </div>
        <div className="tcn-head__actions">
          <button type="button" onClick={() => navigateToChapter(contextChapter - 1)} disabled={contextChapter <= chapterMinimum} aria-label="Previous chapter"><ChevronLeft size={16} aria-hidden="true" /></button>
          <button type="button" onClick={() => navigateToChapter(contextChapter + 1)} disabled={contextChapter >= chapterMaximum} aria-label="Next chapter"><ChevronRight size={16} aria-hidden="true" /></button>
          <button type="button" className={`tcn-spatial${spatialActive ? ' is-active' : ''}`} aria-pressed={spatialActive} onClick={() => navigateToChapter(contextChapter, { view: 'intelligence', intel: 'space' })}><ShipWheel size={14} aria-hidden="true" /><span>Ship map</span></button>
        </div>
      </header>

      <div className="tcn-field" style={{ '--tcn-chapter-count': chapters.length }} onWheel={handleNavigatorWheel}>
        <div
          className="tcn-viewport"
          style={{ left: `${viewportLeft}%`, width: `${viewportWidth}%` }}
          role="slider"
          tabIndex="0"
          aria-label={`Visible Timeline window, Chapters ${windowFrom} through ${windowTo}. Drag to pan.`}
          aria-valuemin={chapterMinimum}
          aria-valuemax={chapterMaximum}
          aria-valuenow={contextChapter}
          aria-valuetext={`Active Chapter ${contextChapter}; visible Chapters ${windowFrom} through ${windowTo}`}
          title="Drag to pan the visible chapter window. Click inside it to jump. Ctrl/Command + wheel to zoom."
          onPointerDown={startViewportDrag}
          onPointerUp={finishViewportDrag}
          onPointerCancel={finishViewportDrag}
          onKeyDown={handleViewportKey}
        />
        <div className="tcn-marker" style={{ left: `${markerLeft}%` }} aria-hidden="true"><i /></div>
        <div className="tcn-bars" role="group" aria-label="Chapter density. Select a chapter to move the shared story context.">
          {chapters.map((row) => (
            <button
              type="button"
              className={`tcn-bar${row.chapter === contextChapter ? ' is-current' : ''}`}
              title={`Chapter ${row.chapter}: ${row.count} timeline records`}
              aria-label={`Chapter ${row.chapter}, ${row.count} timeline records`}
              aria-current={row.chapter === contextChapter ? 'step' : undefined}
              onClick={() => navigateToChapter(row.chapter)}
              key={row.chapter}
            >
              <i style={{ '--tcn-density': `${Math.max(5, Math.round((row.count / maximumDensity) * 100))}%` }} />
              <span>{row.chapter % 5 === 0 || row.chapter === chapterMinimum || row.chapter === chapterMaximum ? row.chapter : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="tcn-controls">
        <div className="tcn-controls__legend"><span><i /> active chapter</span><span><b /> visible map window</span><span>Drag window to pan · Ctrl/⌘ + wheel to zoom</span></div>
        <div className="tcn-controls__zoom" aria-label="Timeline map zoom">
          <button type="button" onClick={zoomOut} disabled={boundedWindowSize >= chapterSpan} aria-label="Zoom Timeline out"><Minus size={14} aria-hidden="true" /></button>
          <button type="button" onClick={recenter}><Crosshair size={13} aria-hidden="true" /> 18 chapters</button>
          <button type="button" onClick={fitAll}><Maximize2 size={13} aria-hidden="true" /> Full arc</button>
          <button type="button" onClick={zoomIn} disabled={boundedWindowSize <= 5} aria-label="Zoom Timeline in"><Plus size={14} aria-hidden="true" /></button>
        </div>
      </footer>
    </section>
  );
}
