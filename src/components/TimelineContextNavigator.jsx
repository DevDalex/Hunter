import { useMemo, useState } from 'react';
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
  const [windowSize, setWindowSize] = useState(() => Math.min(chapterSpan, 18));

  const chapters = useMemo(() => {
    const counts = new Map();
    for (const event of events) counts.set(event.chapter, (counts.get(event.chapter) || 0) + 1);
    return Array.from({ length: chapterSpan }, (_, index) => {
      const chapter = chapterMinimum + index;
      return { chapter, count: counts.get(chapter) || 0 };
    });
  }, [chapterMinimum, chapterSpan, events]);

  const maximumDensity = Math.max(1, ...chapters.map((row) => row.count));
  const boundedWindowSize = clamp(windowSize, 5, chapterSpan);
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

  const navigateToChapter = (chapter, overrides = {}) => {
    const nextChapter = clamp(chapter, chapterMinimum, chapterMaximum);
    const { event: _event, ...preservedState } = requestedState;
    onNavigate?.({
      ...preservedState,
      scope: 'events',
      chapter: nextChapter,
      ...overrides,
    });
  };

  const zoomIn = () => setWindowSize((current) => Math.max(5, Math.round(current / 1.55)));
  const zoomOut = () => setWindowSize((current) => Math.min(chapterSpan, Math.max(6, Math.round(current * 1.55))));
  const fitAll = () => setWindowSize(chapterSpan);
  const recenter = () => setWindowSize(Math.min(chapterSpan, 18));

  return (
    <section className="timeline-context-navigator" aria-label="Persistent story timeline navigator">
      <header className="tcn-head">
        <div className="tcn-head__identity">
          <span>STORY CONTEXT</span>
          <strong>Ch. {chapterMinimum}–{chapterMaximum}</strong>
          <small>{events.length.toLocaleString()} indexed records</small>
        </div>
        <div className="tcn-head__clock" aria-live="polite">
          <Crosshair size={14} aria-hidden="true" />
          <span>ACTIVE CHAPTER</span>
          <strong>{contextChapter}</strong>
          <small>window {windowFrom}–{windowTo}</small>
        </div>
        <div className="tcn-head__actions">
          <button type="button" onClick={() => navigateToChapter(contextChapter - 1)} disabled={contextChapter <= chapterMinimum} aria-label="Previous chapter"><ChevronLeft size={16} aria-hidden="true" /></button>
          <button type="button" onClick={() => navigateToChapter(contextChapter + 1)} disabled={contextChapter >= chapterMaximum} aria-label="Next chapter"><ChevronRight size={16} aria-hidden="true" /></button>
          <button type="button" className="tcn-spatial" onClick={() => navigateToChapter(contextChapter, { view: 'ship' })}><ShipWheel size={14} aria-hidden="true" /><span>Spatial intelligence</span></button>
        </div>
      </header>

      <div className="tcn-field" style={{ '--tcn-chapter-count': chapters.length }}>
        <div
          className="tcn-viewport"
          style={{ left: `${viewportLeft}%`, width: `${viewportWidth}%` }}
          aria-hidden="true"
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
        <div className="tcn-controls__legend"><span><i /> current context</span><span><b /> visible context window</span><span>Height = event density</span></div>
        <div className="tcn-controls__zoom" aria-label="Timeline context zoom">
          <button type="button" onClick={zoomOut} disabled={boundedWindowSize >= chapterSpan} aria-label="Zoom context out"><Minus size={14} aria-hidden="true" /></button>
          <button type="button" onClick={recenter}><Crosshair size={13} aria-hidden="true" /> 18-chapter window</button>
          <button type="button" onClick={fitAll}><Maximize2 size={13} aria-hidden="true" /> Full arc</button>
          <button type="button" onClick={zoomIn} disabled={boundedWindowSize <= 5} aria-label="Zoom context in"><Plus size={14} aria-hidden="true" /></button>
        </div>
      </footer>
    </section>
  );
}
