import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Filter,
  Layers3,
  MapPin,
  Search,
  SlidersHorizontal,
  Split,
  UsersRound,
  X,
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
const confidenceGroup = (value = '') => {
  const normalized = value.toLowerCase();
  if (normalized.includes('exact') || normalized === 'dated') return 'exact';
  if (normalized.includes('range')) return 'range';
  if (normalized.includes('approx') || normalized.includes('estimated')) return 'approximate';
  return 'sequence';
};
const confidenceLabels = {
  exact: 'Exact / dated',
  range: 'Explicit range',
  approximate: 'Approximate',
  sequence: 'Story order',
};

export default function SuccessionTimeline({ spoilerLimit = Number.MAX_SAFE_INTEGER, initialQuery = '', onOpenLocation }) {
  const [mode, setMode] = useState('chronology');
  const [activeTrack, setActiveTrack] = useState('all');
  const [density, setDensity] = useState('standard');
  const [query, setQuery] = useState(initialQuery);
  const [confidence, setConfidence] = useState('all');
  const [location, setLocation] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState('day-12-26');

  const boundaryDays = useMemo(() => successionDays.filter((day) => rangeStart(day.chapterRange) <= spoilerLimit), [spoilerLimit]);
  const allVisibleEvents = useMemo(() => boundaryDays.flatMap((day) => day.events.map((event) => ({ ...event, day: day.day, date: day.date, dayHeadline: day.headline }))).filter((event) => event.chapter <= spoilerLimit), [boundaryDays, spoilerLimit]);
  const chapterMinimum = allVisibleEvents.length ? Math.min(...allVisibleEvents.map((event) => event.chapter)) : 340;
  const chapterMaximum = allVisibleEvents.length ? Math.max(...allVisibleEvents.map((event) => event.chapter)) : spoilerLimit;
  const [chapterFrom, setChapterFrom] = useState(chapterMinimum);
  const [chapterTo, setChapterTo] = useState(chapterMaximum);

  useEffect(() => {
    setChapterFrom((current) => Math.max(chapterMinimum, Math.min(current, chapterMaximum)));
    setChapterTo((current) => Math.max(chapterMinimum, Math.min(current, chapterMaximum)));
  }, [chapterMaximum, chapterMinimum]);

  const locationOptions = useMemo(() => [...new Set(allVisibleEvents.map((event) => event.location))].sort(), [allVisibleEvents]);
  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allVisibleEvents.filter((event) => {
      const trackMatch = activeTrack === 'all' || event.tracks.includes(activeTrack);
      const confidenceMatch = confidence === 'all' || confidenceGroup(event.confidence) === confidence;
      const locationMatch = location === 'all' || event.location === location;
      const chapterMatch = event.chapter >= Math.min(chapterFrom, chapterTo) && event.chapter <= Math.max(chapterFrom, chapterTo);
      const text = `${event.time} ${event.title} ${event.detail} ${event.location} ${event.chapter} ${event.confidence} ${event.tracks.join(' ')}`.toLowerCase();
      return trackMatch && confidenceMatch && locationMatch && chapterMatch && (!normalized || text.includes(normalized));
    });
  }, [activeTrack, allVisibleEvents, chapterFrom, chapterTo, confidence, location, query]);
  const filteredIds = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);
  const selectedEvent = allVisibleEvents.find((event) => event.id === selectedEventId) || filteredEvents[0];
  const activeFilterCount = [query.trim(), activeTrack !== 'all', confidence !== 'all', location !== 'all', chapterFrom !== chapterMinimum, chapterTo !== chapterMaximum].filter(Boolean).length;

  const chapterGroups = useMemo(() => {
    const map = new Map();
    boundaryDays.forEach((day) => chaptersInRange(day.chapterRange).filter((chapter) => chapter <= spoilerLimit).forEach((chapter) => {
      if (!map.has(chapter)) map.set(chapter, { chapter, day: day.day, events: [] });
    }));
    filteredEvents.forEach((event) => map.get(event.chapter)?.events.push(event));
    return [...map.values()].filter((group) => group.chapter >= Math.min(chapterFrom, chapterTo) && group.chapter <= Math.max(chapterFrom, chapterTo));
  }, [boundaryDays, chapterFrom, chapterTo, filteredEvents, spoilerLimit]);
  const locationGroups = useMemo(() => Object.entries(filteredEvents.reduce((groups, event) => {
    groups[event.location] = [...(groups[event.location] || []), event];
    return groups;
  }, {})).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])), [filteredEvents]);
  const visibleDays = useMemo(() => boundaryDays.map((day) => ({
    ...day,
    visibleEvents: day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id)),
  })).filter((day) => day.visibleEvents.length), [boundaryDays, filteredIds, spoilerLimit]);

  useEffect(() => {
    if (!filteredEvents.length || filteredIds.has(selectedEventId)) return;
    setSelectedEventId(filteredEvents[0].id);
  }, [filteredEvents, filteredIds, selectedEventId]);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const resetFilters = () => {
    setQuery('');
    setActiveTrack('all');
    setConfidence('all');
    setLocation('all');
    setChapterFrom(chapterMinimum);
    setChapterTo(chapterMaximum);
  };
  const jumpToDay = (day) => document.getElementById(`voyage-day-${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const eventButton = (event, compact = false) => (
    <button type="button" className={`timeline-record timeline-record--${density}${selectedEvent?.id === event.id ? ' is-selected' : ''}${compact ? ' is-compact' : ''}`} aria-pressed={selectedEvent?.id === event.id} onClick={() => setSelectedEventId(event.id)} key={event.id}>
      <span className="timeline-record__time">{event.time}</span>
      <span className="timeline-record__body"><strong>{event.title}</strong>{!compact && density !== 'overview' && <small>{event.detail}</small>}<em><MapPin size={11} aria-hidden="true" />{event.location}</em></span>
      <span className="timeline-record__source">Ch. {event.chapter}</span>
    </button>
  );

  return (
    <section className="timeline-section timeline-section--expanded timeline-command-voyage" id="succession-timeline">
      <header className="timeline-command-voyage__hero">
        <div><span><Activity size={15} aria-hidden="true" /> Succession Contest chronology</span><h2>The voyage as a chapter-bounded operational ledger.</h2><p>Inspect the same maintained records by time, concurrent plotline, chapter, or location. Every placement preserves its published confidence instead of implying false precision.</p></div>
        <div className="timeline-command-voyage__boundary"><small>Knowledge boundary</small><strong>Ch. {spoilerLimit}</strong><span>{boundaryDays.length} voyage days available</span></div>
      </header>

      <dl className="timeline-summary-strip timeline-command-voyage__metrics" aria-label="Timeline coverage">
        <div><dt>Visible events</dt><dd>{filteredEvents.length}</dd></div>
        <div><dt>Voyage days</dt><dd>{visibleDays.length}</dd></div>
        <div><dt>Chapters</dt><dd>{new Set(filteredEvents.map((event) => event.chapter)).size}</dd></div>
        <div><dt>Locations</dt><dd>{new Set(filteredEvents.map((event) => event.location)).size}</dd></div>
        <div><dt>Indexed total</dt><dd>{timelineEventCount}</dd></div>
      </dl>

      <section className="timeline-source-note timeline-command-voyage__method" aria-labelledby="timeline-method-title">
        <div><strong id="timeline-method-title">Chronology method</strong><p>Exact times, explicit ranges, approximate placement, and story-order placement remain separate evidence states.</p></div>
        <div className="timeline-confidence-legend" aria-label="Time confidence legend"><span className="is-exact">Exact</span><span className="is-range">Range</span><span className="is-approximate">Approximate</span><span className="is-sequence">Story order</span></div>
        <div className="timeline-source-note__links"><a href={timelineSources.timeline} target="_blank" rel="noreferrer">Timeline source <ExternalLink size={12} aria-hidden="true" /></a><a href={timelineSources.contest} target="_blank" rel="noreferrer">Contest source <ExternalLink size={12} aria-hidden="true" /></a></div>
      </section>

      <details className="timeline-prelude timeline-prelude--expanded timeline-command-voyage__prelude">
        <summary><span>Before Day 1</span><strong>Expedition announcement → Seed Urn → boarding</strong><em>{successionPrelude.length} periods</em></summary>
        <div className="timeline-prelude__steps">
          {successionPrelude.filter((period) => Number(period.chapters.match(/\d{3}/)?.[0] || 0) <= spoilerLimit).map((period, index) => (
            <details key={period.id} open={index === successionPrelude.length - 1}>
              <summary><i>{String(index + 1).padStart(2, '0')}</i><span>{period.date}<small>{period.confidence} · Ch. {period.chapters}</small></span><strong>{period.title}</strong></summary>
              <div><p>{period.detail}</p><ul>{period.points.map((point) => <li key={point}>{point}</li>)}</ul><a href={period.source} target="_blank" rel="noreferrer">Open source <ExternalLink size={11} aria-hidden="true" /></a></div>
            </details>
          ))}
        </div>
      </details>

      <section className="timeline-command-voyage__controls" aria-labelledby="timeline-controls-title">
        <header><div><SlidersHorizontal size={17} aria-hidden="true" /><span><small>Timeline controls</small><h3 id="timeline-controls-title">View and filter the voyage</h3></span></div><b>{activeFilterCount} active</b></header>
        <div className="timeline-view-switcher" aria-label="Timeline view">
          {modeOptions.map(([id, label, Icon]) => <button type="button" className={mode === id ? 'is-active' : ''} aria-pressed={mode === id} onClick={() => setMode(id)} key={id}><Icon size={14} aria-hidden="true" />{label}</button>)}
        </div>
        <div className="timeline-command-voyage__filter-grid">
          <label className="timeline-search"><Search size={14} aria-hidden="true" /><span className="sr-only">Search voyage timeline</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, room, operation, ability…" /></label>
          <label><span>Story thread</span><select value={activeTrack} onChange={(event) => setActiveTrack(event.target.value)}>{timelineTracks.map((track) => <option value={track.id} key={track.id}>{track.label}</option>)}</select></label>
          <label><span>Time confidence</span><select value={confidence} onChange={(event) => setConfidence(event.target.value)}><option value="all">All confidence states</option>{Object.entries(confidenceLabels).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
          <label><span>Location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option>{locationOptions.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label><span>From chapter</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={chapterFrom} onChange={(event) => setChapterFrom(Number(event.target.value) || chapterMinimum)} /></label>
          <label><span>To chapter</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={chapterTo} onChange={(event) => setChapterTo(Number(event.target.value) || chapterMaximum)} /></label>
        </div>
        <footer><div className="timeline-density" aria-label="Timeline detail density"><span>Detail</span>{['overview', 'standard', 'complete'].map((item) => <button type="button" className={density === item ? 'is-active' : ''} onClick={() => setDensity(item)} key={item}>{item}</button>)}</div><button type="button" className="timeline-command-voyage__reset" disabled={!activeFilterCount} onClick={resetFilters}><X size={13} aria-hidden="true" /> Clear filters</button></footer>
      </section>

      <p className="sr-only" aria-live="polite">{filteredEvents.length} timeline events shown.</p>
      <HorizontalScrollHint>The concurrent-lane view preserves its shared day axis. Scroll the labelled lane region horizontally when the full chronology exceeds the workspace width.</HorizontalScrollHint>

      {selectedEvent && <aside className="timeline-command-voyage__selected" aria-label="Selected timeline signal">
        <div><span>Selected signal · Day {selectedEvent.day} · Ch. {selectedEvent.chapter}</span><h3>{selectedEvent.title}</h3><p>{selectedEvent.detail}</p></div>
        <dl><div><dt>Time</dt><dd>{selectedEvent.time}</dd></div><div><dt>Confidence</dt><dd><span className={`confidence-pill confidence-pill--${confidenceClass(selectedEvent.confidence)}`}>{selectedEvent.confidence}</span></dd></div><div><dt>Location</dt><dd>{selectedEvent.location}</dd></div><div><dt>Threads</dt><dd>{selectedEvent.tracks.map((track) => timelineTracks.find((item) => item.id === track)?.label || track).join(' · ')}</dd></div></dl>
        <div><a href={selectedEvent.source} target="_blank" rel="noreferrer">Open Chapter {selectedEvent.chapter} <ExternalLink size={12} aria-hidden="true" /></a>{onOpenLocation && <button type="button" onClick={() => onOpenLocation(selectedEvent.location)}><MapPin size={12} aria-hidden="true" /> Ship atlas</button>}</div>
      </aside>}

      {mode === 'chronology' && <>
        <nav className="timeline-day-rail" aria-label="Jump to a voyage day">
          {boundaryDays.map((day) => {
            const count = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id)).length;
            return <button type="button" disabled={!count} onClick={() => jumpToDay(day.day)} key={day.day}><small>Day</small><strong>{day.day}</strong><span>{day.date.replace(', 2001', '')}</span><em style={{ color: 'white' }}>{count}</em></button>;
          })}
        </nav>
        <div className="timeline-workbench">
          <div className="timeline-days timeline-days--ledger">
            {visibleDays.map((day) => <article className="timeline-day" id={`voyage-day-${day.day}`} key={day.day}>
              <header><div className="timeline-day__number"><span style={{ color: 'white' }}>Day</span><b>{String(day.day).padStart(2, '0')}</b></div><div><span>{day.date} · Chapters {day.chapterRange}</span><h3>{day.headline}</h3><p>{day.summary}</p></div><em>{day.visibleEvents.length} events</em></header>
              <div className="timeline-event-ledger">{day.visibleEvents.map((event) => eventButton(event, density === 'overview'))}</div>
            </article>)}
            {!visibleDays.length && <div className="timeline-command-voyage__empty"><Filter size={22} aria-hidden="true" /><h3>No voyage events match.</h3><p>Clear one or more filters to restore the maintained chronology.</p><button type="button" onClick={resetFilters}>Reset timeline</button></div>}
          </div>
          <aside className="timeline-inspector" aria-label="Selected timeline event">
            {selectedEvent && <><span>Day {selectedEvent.day} · {selectedEvent.date}</span><h3>{selectedEvent.title}</h3><p>{selectedEvent.detail}</p><dl><div><dt>Time</dt><dd>{selectedEvent.time}</dd></div><div><dt>Confidence</dt><dd>{selectedEvent.confidence}</dd></div><div><dt>Location</dt><dd>{selectedEvent.location}</dd></div><div><dt>Chapter</dt><dd>{selectedEvent.chapter}</dd></div></dl><div className="timeline-inspector__actions"><a href={selectedEvent.source} target="_blank" rel="noreferrer">Chapter source <ExternalLink size={12} aria-hidden="true" /></a>{onOpenLocation && <button type="button" onClick={() => onOpenLocation(selectedEvent.location)}>Open ship location</button>}</div></>}
          </aside>
        </div>
      </>}

      {mode === 'swimlanes' && <>
        <div className="timeline-swimlanes" role="region" aria-label="Concurrent story lanes by voyage day" tabIndex="0">
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
        </div>
      </>}

      {mode === 'threads' && <div className="timeline-thread-view">
        {timelineTracks.filter((track) => track.id !== 'all' && (activeTrack === 'all' || activeTrack === track.id)).map((track) => {
          const events = filteredEvents.filter((event) => event.tracks.includes(track.id));
          if (!events.length) return null;
          return <article key={track.id}><header><UsersRound size={16} aria-hidden="true" /><div><span>{events.length} linked events</span><h3>{track.label}</h3></div></header><div>{events.map((event) => eventButton(event, true))}</div></article>;
        })}
      </div>}

      {mode === 'chapters' && <div className="timeline-chapter-view">
        {chapterGroups.map((group) => <article className={group.events.length ? 'has-events' : ''} key={group.chapter}><header><span>Day {group.day}</span><h3>Chapter {group.chapter}</h3><a href={chapterUrl(group.chapter)} target="_blank" rel="noreferrer" aria-label={`Open Hunterpedia Chapter ${group.chapter}`}><ExternalLink size={12} aria-hidden="true" /></a></header>{group.events.length ? <div>{group.events.map((event) => eventButton(event, true))}</div> : <p>No separate timestamped event is maintained for this chapter under the current filters.</p>}</article>)}
      </div>}

      {mode === 'locations' && <div className="timeline-location-view">
        {locationGroups.map(([place, events]) => <article key={place}><header><MapPin size={16} aria-hidden="true" /><div><span>{events.length} events · {new Set(events.map((event) => event.chapter)).size} chapters</span><h3>{place}</h3></div>{onOpenLocation && <button type="button" onClick={() => onOpenLocation(place)}>Open atlas</button>}</header><div>{events.map((event) => eventButton(event, true))}</div></article>)}
      </div>}

      <details className="timeline-analysis">
        <summary>Show the optional narrative-pressure reading</summary>
        <div><p>Bar height is this project’s analysis, not a Hunterpedia statistic. It remains separate from factual chronology.</p><div>{boundaryDays.map((day) => <span style={{ '--pressure': `${day.intensity * 10}%` }} key={day.day}><i /><b>Day {day.day}</b></span>)}</div></div>
      </details>
    </section>
  );
}
