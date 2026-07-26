import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  CalendarDays,
  Clock3,
  ExternalLink,
  Filter,
  Layers3,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Split,
  UsersRound,
} from 'lucide-react';
import { successionDays, successionPrelude, timelineEventCount, timelineSources, timelineTracks } from '../data/successionTimeline';
import HorizontalScrollHint from './HorizontalScrollHint';

const chapterUrl = (chapter) => `https://hunterxhunter.fandom.com/wiki/Chapter_${chapter}`;
const rangeStart = (range) => Number(range.split('–')[0]);
const chaptersInRange = (range) => {
  const [start, end = start] = range.split('–').map(Number);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};
const modeOptions = [
  ['chronology', 'Chronology', CalendarDays],
  ['swimlanes', 'Concurrent lanes', Layers3],
  ['threads', 'Story threads', Split],
  ['chapters', 'Chapter order', BookOpen],
  ['locations', 'Locations', MapPin],
];
const confidenceClass = (value) => value.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const shortLocation = (value) => value.replace(/^Tier \d+ ·\s*/, '');

export default function SuccessionTimeline({
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  initialQuery = '',
  onOpenLocation,
  onOpenChapter,
}) {
  const [mode, setMode] = useState('chronology');
  const [activeTrack, setActiveTrack] = useState('all');
  const [activeDay, setActiveDay] = useState('all');
  const [activeConfidence, setActiveConfidence] = useState('all');
  const [activeLocation, setActiveLocation] = useState('all');
  const [density, setDensity] = useState('standard');
  const [query, setQuery] = useState(initialQuery);
  const [selectedEventId, setSelectedEventId] = useState('day-12-26');

  const boundaryDays = useMemo(() => successionDays.filter((day) => rangeStart(day.chapterRange) <= spoilerLimit), [spoilerLimit]);
  const allVisibleEvents = useMemo(() => boundaryDays
    .flatMap((day) => day.events.map((event) => ({ ...event, day: day.day, date: day.date, dayHeadline: day.headline })))
    .filter((event) => event.chapter <= spoilerLimit), [boundaryDays, spoilerLimit]);
  const confidenceOptions = useMemo(() => [...new Set(allVisibleEvents.map((event) => event.confidence))].sort(), [allVisibleEvents]);
  const locationOptions = useMemo(() => [...new Set(allVisibleEvents.map((event) => event.location))].sort(), [allVisibleEvents]);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allVisibleEvents.filter((event) => {
      const trackMatch = activeTrack === 'all' || event.tracks.includes(activeTrack);
      const dayMatch = activeDay === 'all' || event.day === Number(activeDay);
      const confidenceMatch = activeConfidence === 'all' || event.confidence === activeConfidence;
      const locationMatch = activeLocation === 'all' || event.location === activeLocation;
      const text = `${event.time} ${event.title} ${event.detail} ${event.location} ${event.chapter} ${event.confidence} ${event.tracks.join(' ')}`.toLowerCase();
      return trackMatch && dayMatch && confidenceMatch && locationMatch && (!normalized || text.includes(normalized));
    });
  }, [activeConfidence, activeDay, activeLocation, activeTrack, allVisibleEvents, query]);

  const filteredIds = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);
  const selectedEvent = filteredEvents.find((event) => event.id === selectedEventId) || filteredEvents[0] || allVisibleEvents.find((event) => event.id === selectedEventId) || allVisibleEvents[0];
  const visibleDayCount = useMemo(() => new Set(filteredEvents.map((event) => event.day)).size, [filteredEvents]);
  const visibleLocationCount = useMemo(() => new Set(filteredEvents.map((event) => event.location)).size, [filteredEvents]);
  const visibleTrackCount = useMemo(() => new Set(filteredEvents.flatMap((event) => event.tracks)).size, [filteredEvents]);
  const activeFilterCount = [query, activeTrack !== 'all', activeDay !== 'all', activeConfidence !== 'all', activeLocation !== 'all'].filter(Boolean).length;

  const chapterGroups = useMemo(() => {
    const map = new Map();
    boundaryDays.forEach((day) => chaptersInRange(day.chapterRange).filter((chapter) => chapter <= spoilerLimit).forEach((chapter) => {
      if (!map.has(chapter)) map.set(chapter, { chapter, day: day.day, events: [] });
    }));
    filteredEvents.forEach((event) => map.get(event.chapter)?.events.push(event));
    return [...map.values()];
  }, [boundaryDays, filteredEvents, spoilerLimit]);

  const locationGroups = useMemo(() => Object.entries(filteredEvents.reduce((groups, event) => {
    groups[event.location] = [...(groups[event.location] || []), event];
    return groups;
  }, {})).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])), [filteredEvents]);

  useEffect(() => {
    if (!filteredEvents.length || filteredIds.has(selectedEventId)) return;
    setSelectedEventId(filteredEvents[0].id);
  }, [filteredEvents, filteredIds, selectedEventId]);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const jumpToDay = (day) => {
    setMode('chronology');
    setActiveDay(String(day));
    requestAnimationFrame(() => document.getElementById(`voyage-day-${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const resetFilters = () => {
    setQuery('');
    setActiveTrack('all');
    setActiveDay('all');
    setActiveConfidence('all');
    setActiveLocation('all');
  };
  const eventButton = (event, compact = false) => (
    <button
      type="button"
      className={`timeline-record timeline-record--${density}${selectedEvent?.id === event.id ? ' is-selected' : ''}${compact ? ' is-compact' : ''}`}
      aria-pressed={selectedEvent?.id === event.id}
      onClick={() => setSelectedEventId(event.id)}
      key={event.id}
    >
      <span className="timeline-record__time">{event.time}</span>
      <span className="timeline-record__body">
        <strong>{event.title}</strong>
        {!compact && <small>{event.detail}</small>}
        <em><MapPin size={11} aria-hidden="true" />{event.location}</em>
      </span>
      <span className="timeline-record__source">Ch. {event.chapter}<small>{event.confidence}</small></span>
    </button>
  );

  return (
    <section className="timeline-section timeline-section--expanded timeline-intelligence-command" id="succession-timeline">
      <header className="timeline-command-hero">
        <div>
          <span><Clock3 size={15} aria-hidden="true" /> Voyage chronology intelligence</span>
          <h2>The Black Whale, event by event and lane by lane</h2>
          <p>Search the documented voyage, isolate one story pressure, compare concurrent operations, or reconstruct a chapter and location sequence. Exact, approximate, ranged, and story-order records remain visibly distinct.</p>
        </div>
        <div className="timeline-command-hero__signal" aria-hidden="true">
          <i /><i /><i /><i />
          <strong>{filteredEvents.length}</strong>
          <span>visible events</span>
        </div>
      </header>

      <dl className="timeline-command-metrics" aria-label="Filtered timeline coverage">
        <div><dt>Visible events</dt><dd>{filteredEvents.length}</dd><span>of {timelineEventCount}</span></div>
        <div><dt>Voyage days</dt><dd>{visibleDayCount}</dd><span>of {boundaryDays.length}</span></div>
        <div><dt>Story lanes</dt><dd>{visibleTrackCount}</dd><span>active records</span></div>
        <div><dt>Locations</dt><dd>{visibleLocationCount}</dd><span>represented</span></div>
        <div><dt>Boundary</dt><dd>{Math.min(spoilerLimit, 413)}</dd><span>latest chapter</span></div>
      </dl>

      <section className="timeline-command-axis" aria-labelledby="timeline-command-axis-title">
        <header><div><span>Voyage-day axis</span><h3 id="timeline-command-axis-title">Twelve days of concurrent pressure</h3></div><p>Select a day to isolate it immediately. Clear the day filter to restore the complete voyage.</p></header>
        <div role="list">
          {boundaryDays.map((day) => {
            const count = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id)).length;
            return <button type="button" role="listitem" className={activeDay === String(day.day) ? 'is-active' : ''} aria-pressed={activeDay === String(day.day)} onClick={() => jumpToDay(day.day)} key={day.day}><small>{day.date.replace(', 2001', '')}</small><strong>{String(day.day).padStart(2, '0')}</strong><span>Ch. {day.chapterRange}</span><em>{count}</em></button>;
          })}
        </div>
      </section>

      <div className="timeline-source-note">
        <div><strong>Research precision remains visible</strong><p>The manga frequently reveals scenes out of order. Exact times, approximate times, broad ranges, and story-order placements are not collapsed into false certainty.</p></div>
        <div className="timeline-confidence-legend" aria-label="Time confidence legend"><span className="is-exact">Exact</span><span className="is-range">Range</span><span className="is-approximate">Approximate</span><span className="is-sequence">Story order</span></div>
        <div className="timeline-source-note__links"><a href={timelineSources.timeline} target="_blank" rel="noreferrer">Hunterpedia timeline <ExternalLink size={12} aria-hidden="true" /></a><a href={timelineSources.contest} target="_blank" rel="noreferrer">Contest source <ExternalLink size={12} aria-hidden="true" /></a></div>
      </div>

      <section className="timeline-prelude timeline-prelude--expanded">
        <div className="timeline-prelude__heading"><span>Before Day 1</span><h3>From expedition announcement to boarding</h3><p>The voyage timeline begins one year before departure, not at the horn.</p></div>
        <div className="timeline-prelude__steps">
          {successionPrelude.filter((period) => Number(period.chapters.match(/\d{3}/)?.[0] || 0) <= spoilerLimit).map((period, index) => (
            <details key={period.id} open={index === successionPrelude.length - 1}>
              <summary><i>{String(index + 1).padStart(2, '0')}</i><span>{period.date}<small>{period.confidence} · Ch. {period.chapters}</small></span><strong>{period.title}</strong></summary>
              <div><p>{period.detail}</p><ul>{period.points.map((point) => <li key={point}>{point}</li>)}</ul><a href={period.source} target="_blank" rel="noreferrer">Open timeline source <ExternalLink size={11} aria-hidden="true" /></a></div>
            </details>
          ))}
        </div>
      </section>

      <section className="timeline-filter-deck" aria-labelledby="timeline-filter-deck-title">
        <header><div><span><SlidersHorizontal size={13} aria-hidden="true" /> Analyst controls</span><h3 id="timeline-filter-deck-title">Reconstruct one slice of the voyage</h3></div><button type="button" onClick={resetFilters} disabled={!activeFilterCount}><RotateCcw size={13} aria-hidden="true" /> Reset {activeFilterCount ? `(${activeFilterCount})` : ''}</button></header>
        <div className="timeline-toolbar">
          <div className="timeline-view-switcher" aria-label="Timeline view">
            {modeOptions.map(([id, label, Icon]) => <button type="button" className={mode === id ? 'is-active' : ''} aria-pressed={mode === id} onClick={() => setMode(id)} key={id}><Icon size={14} aria-hidden="true" />{label}</button>)}
          </div>
          <div className="timeline-density" aria-label="Timeline detail density">
            <span>Detail</span>{['overview', 'standard', 'complete'].map((item) => <button type="button" className={density === item ? 'is-active' : ''} aria-pressed={density === item} onClick={() => setDensity(item)} key={item}>{item}</button>)}
          </div>
        </div>
        <div className="timeline-filter-grid">
          <label className="timeline-search"><Search size={14} aria-hidden="true" /><span className="sr-only">Search voyage timeline</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, room, operation, chapter…" /></label>
          <label><span>Day</span><select value={activeDay} onChange={(event) => setActiveDay(event.target.value)}><option value="all">All voyage days</option>{boundaryDays.map((day) => <option value={day.day} key={day.day}>Day {day.day} · {day.date}</option>)}</select></label>
          <label><span>Confidence</span><select value={activeConfidence} onChange={(event) => setActiveConfidence(event.target.value)}><option value="all">All precision states</option>{confidenceOptions.map((confidence) => <option value={confidence} key={confidence}>{confidence}</option>)}</select></label>
          <label><span>Location</span><select value={activeLocation} onChange={(event) => setActiveLocation(event.target.value)}><option value="all">All ship locations</option>{locationOptions.map((location) => <option value={location} key={location}>{shortLocation(location)}</option>)}</select></label>
        </div>
        <div className="timeline-track-filter" aria-label="Filter by story thread">
          <span><Filter size={13} aria-hidden="true" /> Story lane</span>
          <div>{timelineTracks.map((track) => <button type="button" className={activeTrack === track.id ? 'is-active' : ''} aria-pressed={activeTrack === track.id} onClick={() => setActiveTrack(track.id)} key={track.id}>{track.label}</button>)}</div>
        </div>
        {!!activeFilterCount && <div className="timeline-active-filters" aria-label="Active timeline filters">
          <span>{filteredEvents.length} matching events</span>
          {query && <button type="button" onClick={() => setQuery('')}>Search: {query}</button>}
          {activeDay !== 'all' && <button type="button" onClick={() => setActiveDay('all')}>Day {activeDay}</button>}
          {activeTrack !== 'all' && <button type="button" onClick={() => setActiveTrack('all')}>{timelineTracks.find((track) => track.id === activeTrack)?.label}</button>}
          {activeConfidence !== 'all' && <button type="button" onClick={() => setActiveConfidence('all')}>{activeConfidence}</button>}
          {activeLocation !== 'all' && <button type="button" onClick={() => setActiveLocation('all')}>{shortLocation(activeLocation)}</button>}
        </div>}
      </section>

      <p className="sr-only" aria-live="polite">{filteredEvents.length} timeline events shown.</p>
      <HorizontalScrollHint>The concurrent-lane, chapter, and location views preserve their structure on smaller screens. Swipe the view, then select any event for its complete record.</HorizontalScrollHint>

      {!filteredEvents.length && <section className="timeline-empty-state" aria-live="polite"><Activity size={24} aria-hidden="true" /><h3>No events match this reconstruction.</h3><p>Clear one or more filters to restore documented voyage records.</p><button type="button" onClick={resetFilters}>Reset timeline filters</button></section>}

      {!!filteredEvents.length && mode === 'chronology' && <>
        <nav className="timeline-day-rail" aria-label="Jump to a voyage day">
          {boundaryDays.map((day) => {
            const count = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id)).length;
            return <button type="button" disabled={!count} className={activeDay === String(day.day) ? 'is-active' : ''} onClick={() => jumpToDay(day.day)} key={day.day}><small>Day</small><strong>{day.day}</strong><span>{day.date.replace(', 2001', '')}</span><em>{count}</em></button>;
          })}
        </nav>
        <div className="timeline-workbench">
          <div className="timeline-days timeline-days--ledger">
            {boundaryDays.map((day) => {
              const events = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id));
              if (!events.length) return null;
              return <article className="timeline-day" id={`voyage-day-${day.day}`} key={day.day}>
                <header><div className="timeline-day__number"><span>Day</span><b>{String(day.day).padStart(2, '0')}</b></div><div><span>{day.date} · Chapters {day.chapterRange}</span><h3>{day.headline}</h3><p>{day.summary}</p></div><em>{events.length} events</em></header>
                <div className="timeline-event-ledger">{events.map((event) => eventButton(event, density === 'overview'))}</div>
              </article>;
            })}
          </div>
          <aside className="timeline-inspector" aria-label="Selected timeline event">
            {selectedEvent && <>
              <span>Day {selectedEvent.day} · {selectedEvent.date}</span>
              <h3>{selectedEvent.title}</h3>
              <p>{selectedEvent.detail}</p>
              <dl><div><dt>Time</dt><dd>{selectedEvent.time}</dd></div><div><dt>Confidence</dt><dd><span className={`confidence-pill confidence-pill--${confidenceClass(selectedEvent.confidence)}`}>{selectedEvent.confidence}</span></dd></div><div><dt>Location</dt><dd>{selectedEvent.location}</dd></div><div><dt>Chapter</dt><dd>{selectedEvent.chapter}</dd></div><div><dt>Threads</dt><dd>{selectedEvent.tracks.map((track) => timelineTracks.find((item) => item.id === track)?.label || track).join(' · ')}</dd></div></dl>
              <div className="timeline-inspector__actions"><a href={selectedEvent.source} target="_blank" rel="noreferrer">Source chapter <ExternalLink size={12} aria-hidden="true" /></a>{onOpenChapter && <button type="button" onClick={() => onOpenChapter(selectedEvent.chapter)}><BookOpen size={12} aria-hidden="true" /> Open chapter dossier</button>}{onOpenLocation && <button type="button" onClick={() => onOpenLocation(selectedEvent.location)}><MapPin size={12} aria-hidden="true" /> Show on ship atlas</button>}</div>
            </>}
          </aside>
        </div>
      </>}

      {!!filteredEvents.length && mode === 'swimlanes' && <div className="timeline-swimlanes" role="region" aria-label="Concurrent story lanes by voyage day" tabIndex="0">
        <div className="timeline-swimlanes__grid" style={{ '--timeline-days': boundaryDays.length }}>
          <div className="timeline-swimlanes__corner"><b>Story lane</b><span>Voyage day →</span></div>
          {boundaryDays.map((day) => <header key={`head-${day.day}`}><small>{day.date.replace(', 2001', '')}</small><b>Day {day.day}</b><span>Ch. {day.chapterRange}</span></header>)}
          {timelineTracks.filter((track) => track.id !== 'all' && (activeTrack === 'all' || activeTrack === track.id)).map((track) => <section className="timeline-swimlane" key={track.id}>
            <div className="timeline-swimlane__label"><Split size={14} aria-hidden="true" /><b>{track.label}</b></div>
            {boundaryDays.map((day) => {
              const events = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id) && event.tracks.includes(track.id));
              return <div className={`timeline-swimlane__cell${events.length ? ' has-events' : ''}`} key={`${track.id}-${day.day}`}>{events.map((event) => eventButton(event, density !== 'complete'))}</div>;
            })}
          </section>)}
        </div>
        {selectedEvent && <aside className="timeline-inline-inspector"><span>Day {selectedEvent.day} · Ch. {selectedEvent.chapter} · {selectedEvent.time}</span><h3>{selectedEvent.title}</h3><p>{selectedEvent.detail}</p><div><b>{selectedEvent.location}</b><a href={selectedEvent.source} target="_blank" rel="noreferrer">Source <ExternalLink size={11} aria-hidden="true" /></a>{onOpenChapter && <button type="button" onClick={() => onOpenChapter(selectedEvent.chapter)}>Open chapter dossier</button>}{onOpenLocation && <button type="button" onClick={() => onOpenLocation(selectedEvent.location)}>Open ship location</button>}</div></aside>}
      </div>}

      {!!filteredEvents.length && mode === 'threads' && <div className="timeline-thread-view">
        {timelineTracks.filter((track) => track.id !== 'all' && (activeTrack === 'all' || activeTrack === track.id)).map((track) => {
          const events = filteredEvents.filter((event) => event.tracks.includes(track.id));
          if (!events.length) return null;
          return <article key={track.id}><header><UsersRound size={16} aria-hidden="true" /><div><span>{events.length} linked events</span><h3>{track.label}</h3></div></header><div>{events.map((event) => eventButton(event, true))}</div></article>;
        })}
      </div>}

      {!!filteredEvents.length && mode === 'chapters' && <div className="timeline-chapter-view">
        {chapterGroups.map((group) => <article className={group.events.length ? 'has-events' : ''} key={group.chapter}><header><span>Day {group.day}</span><h3>Chapter {group.chapter}</h3>{onOpenChapter ? <button type="button" onClick={() => onOpenChapter(group.chapter)} aria-label={`Open Chapter ${group.chapter} dossier`}><BookOpen size={12} aria-hidden="true" /></button> : <a href={chapterUrl(group.chapter)} target="_blank" rel="noreferrer" aria-label={`Open Hunterpedia Chapter ${group.chapter}`}><ExternalLink size={12} aria-hidden="true" /></a>}</header>{group.events.length ? <div>{group.events.map((event) => eventButton(event, true))}</div> : <p>No separate timestamped event. The chapter remains assigned to its voyage day.</p>}</article>)}
      </div>}

      {!!filteredEvents.length && mode === 'locations' && <div className="timeline-location-view">
        {locationGroups.map(([location, events]) => <article key={location}><header><MapPin size={16} aria-hidden="true" /><div><span>{events.length} events · {new Set(events.map((event) => event.chapter)).size} chapters</span><h3>{location}</h3></div>{onOpenLocation && <button type="button" onClick={() => onOpenLocation(location)}>Open atlas</button>}</header><div>{events.map((event) => eventButton(event, true))}</div></article>)}
      </div>}

      <details className="timeline-analysis">
        <summary><ShieldCheck size={14} aria-hidden="true" /> Show the optional narrative-pressure reading</summary>
        <div><p>Bar height is this project’s analysis, not a source statistic. It remains separate from factual chronology.</p><div>{boundaryDays.map((day) => <span style={{ '--pressure': `${day.intensity * 10}%` }} key={day.day}><i /><b>Day {day.day}</b></span>)}</div></div>
      </details>
    </section>
  );
}
