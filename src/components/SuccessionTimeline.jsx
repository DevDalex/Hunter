import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CalendarDays, ExternalLink, Filter, Layers3, MapPin, Search, Split, UsersRound } from 'lucide-react';
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

export default function SuccessionTimeline({ spoilerLimit = Number.MAX_SAFE_INTEGER, initialQuery = '', onOpenLocation }) {
  const [mode, setMode] = useState('chronology');
  const [activeTrack, setActiveTrack] = useState('all');
  const [density, setDensity] = useState('standard');
  const [query, setQuery] = useState(initialQuery);
  const [selectedEventId, setSelectedEventId] = useState('day-12-26');

  const boundaryDays = useMemo(() => successionDays.filter((day) => rangeStart(day.chapterRange) <= spoilerLimit), [spoilerLimit]);
  const allVisibleEvents = useMemo(() => boundaryDays.flatMap((day) => day.events.map((event) => ({ ...event, day: day.day, date: day.date, dayHeadline: day.headline }))).filter((event) => event.chapter <= spoilerLimit), [boundaryDays, spoilerLimit]);
  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allVisibleEvents.filter((event) => {
      const trackMatch = activeTrack === 'all' || event.tracks.includes(activeTrack);
      const text = `${event.time} ${event.title} ${event.detail} ${event.location} ${event.chapter} ${event.tracks.join(' ')}`.toLowerCase();
      return trackMatch && (!normalized || text.includes(normalized));
    });
  }, [activeTrack, allVisibleEvents, query]);
  const filteredIds = useMemo(() => new Set(filteredEvents.map((event) => event.id)), [filteredEvents]);
  const selectedEvent = allVisibleEvents.find((event) => event.id === selectedEventId) || filteredEvents[0];

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

  const jumpToDay = (day) => document.getElementById(`voyage-day-${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const eventButton = (event, compact = false) => (
    <button className={`timeline-record timeline-record--${density}${selectedEvent?.id === event.id ? ' is-selected' : ''}${compact ? ' is-compact' : ''}`} onClick={() => setSelectedEventId(event.id)} key={event.id}>
      <span className="timeline-record__time">{event.time}</span>
      <span className="timeline-record__body"><strong>{event.title}</strong>{!compact && <small>{event.detail}</small>}<em><MapPin size={11} />{event.location}</em></span>
      <span className="timeline-record__source">Ch. {event.chapter}</span>
    </button>
  );

  return (
    <section className="timeline-section timeline-section--expanded" id="succession-timeline">
      <div className="section-heading timeline-heading">
        <div><span className="section-kicker">Succession Contest chronology</span><h2>The voyage, event by event</h2></div>
        <p>Hunterpedia’s dated and relative sequence reorganized into a searchable research ledger. Switch between chronological time, plot threads, chapter order, and ship locations.</p>
      </div>

      <div className="timeline-summary-strip" aria-label="Timeline coverage">
        <div><strong>{timelineEventCount}</strong><span>indexed voyage events</span></div>
        <div><strong>12</strong><span>voyage days</span></div>
        <div><strong>6</strong><span>pre-voyage periods</span></div>
        <div><strong>Ch. 413</strong><span>current boundary</span></div>
      </div>

      <div className="timeline-source-note">
        <div><strong>How to read the chronology</strong><p>The manga frequently reveals scenes out of order. Exact times, approximate times, broad ranges, and story-order placements remain visibly distinct; uncertainty is never silently converted into precision.</p></div>
        <div className="timeline-confidence-legend" aria-label="Time confidence legend"><span className="is-exact">Exact</span><span className="is-range">Range</span><span className="is-approximate">Approximate</span><span className="is-sequence">Story order</span></div>
        <div className="timeline-source-note__links"><a href={timelineSources.timeline} target="_blank" rel="noreferrer">Hunterpedia timeline <ExternalLink size={12} /></a><a href={timelineSources.contest} target="_blank" rel="noreferrer">Contest source <ExternalLink size={12} /></a></div>
      </div>

      <section className="timeline-prelude timeline-prelude--expanded">
        <div className="timeline-prelude__heading"><span>Before Day 1</span><h3>From expedition announcement to boarding</h3><p>The voyage timeline begins one year before departure, not at the horn.</p></div>
        <div className="timeline-prelude__steps">
          {successionPrelude.filter((period) => Number(period.chapters.match(/\d{3}/)?.[0] || 0) <= spoilerLimit).map((period, index) => (
            <details key={period.id} open={index === successionPrelude.length - 1}>
              <summary><i>{String(index + 1).padStart(2, '0')}</i><span>{period.date}<small>{period.confidence} · Ch. {period.chapters}</small></span><strong>{period.title}</strong></summary>
              <div><p>{period.detail}</p><ul>{period.points.map((point) => <li key={point}>{point}</li>)}</ul><a href={period.source} target="_blank" rel="noreferrer">Open timeline source <ExternalLink size={11} /></a></div>
            </details>
          ))}
        </div>
      </section>

      <div className="timeline-toolbar">
        <div className="timeline-view-switcher" aria-label="Timeline view">
          {modeOptions.map(([id, label, Icon]) => <button className={mode === id ? 'is-active' : ''} onClick={() => setMode(id)} key={id}><Icon size={14} />{label}</button>)}
        </div>
        <div className="timeline-density" aria-label="Timeline detail density">
          <span>Detail</span>{['overview', 'standard', 'complete'].map((item) => <button className={density === item ? 'is-active' : ''} onClick={() => setDensity(item)} key={item}>{item}</button>)}
        </div>
        <label className="timeline-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a person, room, event…" /></label>
      </div>

      <div className="timeline-track-filter" aria-label="Filter by story thread">
        <span><Filter size={13} /> Thread</span>
        <div>{timelineTracks.map((track) => <button className={activeTrack === track.id ? 'is-active' : ''} onClick={() => setActiveTrack(track.id)} key={track.id}>{track.label}</button>)}</div>
      </div>
      <p className="sr-only" aria-live="polite">{filteredEvents.length} timeline events shown.</p>

      <HorizontalScrollHint>The concurrent-lane, chapter, and location views preserve their structure on smaller screens. Swipe the view, then select any event for its complete record.</HorizontalScrollHint>

      {mode === 'chronology' && <>
        <nav className="timeline-day-rail" aria-label="Jump to a voyage day">
          {boundaryDays.map((day) => {
            const count = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id)).length;
            return <button disabled={!count} onClick={() => jumpToDay(day.day)} key={day.day}><small>Day</small><strong>{day.day}</strong><span>{day.date.replace(', 2001', '')}</span><em>{count}</em></button>;
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
              <div className="timeline-inspector__actions"><a href={selectedEvent.source} target="_blank" rel="noreferrer">Open Chapter {selectedEvent.chapter} <ExternalLink size={12} /></a>{onOpenLocation && <button onClick={() => onOpenLocation(selectedEvent.location)}><MapPin size={12} /> Show on ship atlas</button>}</div>
            </>}
          </aside>
        </div>
      </>}

      {mode === 'swimlanes' && <div className="timeline-swimlanes" role="region" aria-label="Concurrent story lanes by voyage day" tabIndex="0">
        <div className="timeline-swimlanes__grid" style={{ '--timeline-days': boundaryDays.length }}>
          <div className="timeline-swimlanes__corner"><b>Story lane</b><span>Voyage day →</span></div>
          {boundaryDays.map((day) => <header key={`head-${day.day}`}><small>{day.date.replace(', 2001', '')}</small><b>Day {day.day}</b><span>Ch. {day.chapterRange}</span></header>)}
          {timelineTracks.filter((track) => track.id !== 'all' && (activeTrack === 'all' || activeTrack === track.id)).map((track) => <section className="timeline-swimlane" key={track.id}>
            <div className="timeline-swimlane__label"><Split size={14} /><b>{track.label}</b></div>
            {boundaryDays.map((day) => {
              const events = day.events.filter((event) => event.chapter <= spoilerLimit && filteredIds.has(event.id) && event.tracks.includes(track.id));
              return <div className={`timeline-swimlane__cell${events.length ? ' has-events' : ''}`} key={`${track.id}-${day.day}`}>{events.map((event) => eventButton(event, density !== 'complete'))}</div>;
            })}
          </section>)}
        </div>
        {selectedEvent && <aside className="timeline-inline-inspector"><span>Day {selectedEvent.day} · Ch. {selectedEvent.chapter} · {selectedEvent.time}</span><h3>{selectedEvent.title}</h3><p>{selectedEvent.detail}</p><div><b>{selectedEvent.location}</b><a href={selectedEvent.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a>{onOpenLocation && <button onClick={() => onOpenLocation(selectedEvent.location)}>Open ship location</button>}</div></aside>}
      </div>}

      {mode === 'threads' && <div className="timeline-thread-view">
        {timelineTracks.filter((track) => track.id !== 'all' && (activeTrack === 'all' || activeTrack === track.id)).map((track) => {
          const events = filteredEvents.filter((event) => event.tracks.includes(track.id));
          if (!events.length) return null;
          return <article key={track.id}><header><UsersRound size={16} /><div><span>{events.length} linked events</span><h3>{track.label}</h3></div></header><div>{events.map((event) => eventButton(event, true))}</div></article>;
        })}
      </div>}

      {mode === 'chapters' && <div className="timeline-chapter-view">
        {chapterGroups.map((group) => <article className={group.events.length ? 'has-events' : ''} key={group.chapter}><header><span>Day {group.day}</span><h3>Chapter {group.chapter}</h3><a href={chapterUrl(group.chapter)} target="_blank" rel="noreferrer" aria-label={`Open Hunterpedia Chapter ${group.chapter}`}><ExternalLink size={12} /></a></header>{group.events.length ? <div>{group.events.map((event) => eventButton(event, true))}</div> : <p>No separate timestamped event. The chapter remains assigned to its voyage day.</p>}</article>)}
      </div>}

      {mode === 'locations' && <div className="timeline-location-view">
        {locationGroups.map(([location, events]) => <article key={location}><header><MapPin size={16} /><div><span>{events.length} events · {new Set(events.map((event) => event.chapter)).size} chapters</span><h3>{location}</h3></div>{onOpenLocation && <button onClick={() => onOpenLocation(location)}>Open atlas</button>}</header><div>{events.map((event) => eventButton(event, true))}</div></article>)}
      </div>}

      <details className="timeline-analysis">
        <summary>Show the optional narrative-pressure reading</summary>
        <div><p>Bar height is this project’s analysis, not a Hunterpedia statistic. It is kept separate from factual chronology.</p><div>{boundaryDays.map((day) => <span style={{ '--pressure': `${day.intensity * 10}%` }} key={day.day}><i /><b>Day {day.day}</b></span>)}</div></div>
      </details>
    </section>
  );
}
