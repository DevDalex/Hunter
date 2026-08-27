import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Filter,
  Layers3,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
  timelineEventCount,
  timelineTracks,
} from '../data/successionTimeline';
import {
  evidenceConfidenceForEvent,
  peopleForTimelineEvent,
  timelineCausalityForEvent,
  timelineImportance,
  timingConfidenceForEvent,
} from '../data/successionTimelineIntelligence';
import {
  successionTimelinePhases,
  timelinePhaseForChapter,
} from '../data/successionTimelinePresentation';
import './TimelineArchiveExplorer.css';

const DENSITY_MODES = Object.freeze([
  { id: 'recap', label: 'Recap', note: 'Story-defining events only' },
  { id: 'story', label: 'Story', note: 'Major and standard beats' },
  { id: 'full', label: 'Full', note: 'Complete chronology' },
]);
const DENSITY_IDS = new Set(DENSITY_MODES.map((mode) => mode.id));
const DISPLAY_BATCH = 120;
const DENSITY_BUCKETS = 48;
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const trackLabel = (trackId) => timelineTracks.find((track) => track.id === trackId)?.label || trackId;

const importanceRank = (importance) => {
  if (importance === 'major') return 3;
  if (importance === 'standard') return 2;
  return 1;
};

const importanceLabel = (importance) => {
  if (importance === 'major') return 'Story defining';
  if (importance === 'standard') return 'Important';
  return 'Supporting';
};

const eventMatchesDensity = (event, density) => {
  if (density === 'recap') return event.importance === 'major';
  if (density === 'story') return importanceRank(event.importance) >= 2;
  return true;
};

const buildSearchText = (event) => normalize([
  event.time,
  event.title,
  event.detail,
  event.location,
  event.chapter,
  event.date,
  event.dayHeadline,
  event.phase?.title,
  event.phase?.shortTitle,
  event.timing,
  event.evidence,
  ...(event.tracks || []),
  ...(event.tracks || []).map(trackLabel),
  ...(event.people || []),
  event.causality?.cause,
  event.causality?.consequence,
  event.causality?.leadsTo,
].filter(Boolean).join(' '));

function prepareTimelineEvents(spoilerLimit) {
  const prelude = successionPreludeEvents
    .filter((event) => event.chapter <= spoilerLimit)
    .map((event) => ({
      ...event,
      day: null,
      date: event.date || 'Pre-voyage',
      dayHeadline: event.periodTitle || 'Before departure',
    }));
  const voyage = successionDays.flatMap((day) => day.events
    .filter((event) => event.chapter <= spoilerLimit)
    .map((event) => ({
      ...event,
      day: day.day,
      date: day.date,
      dayHeadline: day.headline,
    })));
  const seen = new Set();
  return [...prelude, ...voyage]
    .filter((event) => {
      if (!event?.id || seen.has(event.id)) return false;
      seen.add(event.id);
      return true;
    })
    .map((event, index) => {
      const prepared = {
        ...event,
        archiveIndex: index + 1,
        phase: timelinePhaseForChapter(event.chapter),
        importance: timelineImportance(event),
        people: peopleForTimelineEvent(event),
        timing: timingConfidenceForEvent(event),
        evidence: evidenceConfidenceForEvent(event),
        causality: timelineCausalityForEvent(event),
      };
      return { ...prepared, searchText: buildSearchText(prepared) };
    });
}

function PhaseStrip({ phases, stats, activePhase, onSelect }) {
  return (
    <div className="tae-phase-strip" aria-label="Timeline story phases">
      {phases.map((phase) => {
        const phaseStats = stats.get(phase.id) || { count: 0, major: 0 };
        const span = Math.max(1, phase.endChapter - phase.startChapter + 1);
        const active = activePhase === phase.id;
        return (
          <button
            type="button"
            className={active ? 'is-active' : ''}
            style={{ flexGrow: span }}
            aria-pressed={active}
            onClick={() => onSelect(active ? '' : phase.id)}
            key={phase.id}
          >
            <small>{phase.ordinal} · Ch. {phase.startChapter}–{phase.endChapter}</small>
            <strong>{phase.shortTitle}</strong>
            <span>{phaseStats.count} events · {phaseStats.major} major</span>
          </button>
        );
      })}
    </div>
  );
}

function DensityGraph({ buckets, maximum }) {
  return (
    <div className="tae-density-graph" aria-label="Event density across the available chronology">
      {buckets.map((count, index) => (
        <span
          key={index}
          style={{ height: `${Math.max(8, Math.round((count / Math.max(1, maximum)) * 100))}%` }}
          title={`${count} event${count === 1 ? '' : 's'} in this chapter window`}
        />
      ))}
    </div>
  );
}

function TimelineEventRow({ event, selected, showPhase, onSelect }) {
  return (
    <>
      {showPhase && (
        <header className="tae-phase-break">
          <span>{event.phase.ordinal}</span>
          <div>
            <small>{event.phase.label}</small>
            <strong>{event.phase.shortTitle}</strong>
          </div>
          <em>Ch. {event.phase.startChapter}–{event.phase.endChapter}</em>
        </header>
      )}
      <button
        type="button"
        className={`tae-event tae-event--${event.importance}${selected ? ' is-selected' : ''}`}
        aria-pressed={selected}
        onClick={() => onSelect(event)}
      >
        <span className="tae-event__time">
          <small>{event.day ? `Day ${event.day}` : 'Prelude'}</small>
          <strong>{event.time || `Ch. ${event.chapter}`}</strong>
          <em>Ch. {event.chapter}</em>
        </span>
        <span className="tae-event__rail" aria-hidden="true">
          <i>{event.importance === 'major' ? '★' : event.importance === 'standard' ? '●' : '·'}</i>
        </span>
        <span className="tae-event__content">
          <span className="tae-event__heading">
            <strong>{event.title}</strong>
            <small>{importanceLabel(event.importance)}</small>
          </span>
          <span className="tae-event__detail">{event.detail}</span>
          <span className="tae-event__meta">
            {event.location && <i><MapPin size={11} aria-hidden="true" /> {event.location}</i>}
            {!!event.people?.length && <i><Users size={11} aria-hidden="true" /> {event.people.slice(0, 2).join(', ')}{event.people.length > 2 ? ` +${event.people.length - 2}` : ''}</i>}
            {!!event.tracks?.length && <i><Layers3 size={11} aria-hidden="true" /> {event.tracks.slice(0, 2).map(trackLabel).join(' · ')}</i>}
          </span>
        </span>
        <ChevronRight className="tae-event__chevron" size={16} aria-hidden="true" />
      </button>
    </>
  );
}

function EventInspector({ event, onClose, onNavigate }) {
  if (!event) {
    return (
      <div className="tae-inspector__empty">
        <span>Event inspector</span>
        <h2>Select an event without leaving the chronology.</h2>
        <p>Full descriptions, timing confidence, evidence state, people, threads, cause, consequence, and source material stay attached to the selected record.</p>
      </div>
    );
  }

  return (
    <div className="tae-inspector__record">
      <header>
        <div>
          <span>Event #{String(event.archiveIndex).padStart(4, '0')}</span>
          <small>{importanceLabel(event.importance)}</small>
        </div>
        <button type="button" onClick={onClose} aria-label="Close event inspector"><X size={17} aria-hidden="true" /></button>
      </header>

      <section className="tae-inspector__title">
        <span>{event.phase.shortTitle}</span>
        <h2>{event.title}</h2>
        <p>{event.day ? `Voyage Day ${event.day}` : 'Pre-voyage'} · {event.time} · Chapter {event.chapter}</p>
      </section>

      <section className="tae-inspector__description">
        <h3>Complete event record</h3>
        <p>{event.detail}</p>
      </section>

      <dl className="tae-inspector__facts">
        <div><dt>Location</dt><dd>{event.location || 'Not assigned'}</dd></div>
        <div><dt>Timing</dt><dd>{event.timing}</dd></div>
        <div><dt>Evidence</dt><dd>{event.evidence}</dd></div>
        <div><dt>Chapter</dt><dd>{event.chapter}</dd></div>
      </dl>

      {!!event.people?.length && (
        <section className="tae-inspector__group">
          <h3><Users size={13} aria-hidden="true" /> People</h3>
          <div>{event.people.map((person) => <span key={person}>{person}</span>)}</div>
        </section>
      )}

      {!!event.tracks?.length && (
        <section className="tae-inspector__group">
          <h3><Layers3 size={13} aria-hidden="true" /> Story threads</h3>
          <div>{event.tracks.map((track) => <span key={track}>{trackLabel(track)}</span>)}</div>
        </section>
      )}

      {event.causality && (
        <section className="tae-inspector__causality">
          <h3>Cause and consequence</h3>
          <div><span>Setup</span><p>{event.causality.cause}</p></div>
          <div><span>Immediate</span><p>{event.causality.consequence}</p></div>
          <div><span>Carried forward</span><p>{event.causality.leadsTo}</p></div>
        </section>
      )}

      <footer className="tae-inspector__actions">
        {event.source && <a href={event.source} target="_blank" rel="noreferrer"><BookOpen size={13} aria-hidden="true" /> Source note</a>}
        <button type="button" onClick={() => onNavigate?.({ scope: 'events', chapter: event.chapter, event: event.id })}>
          <Star size={13} aria-hidden="true" /> Keep deep link
        </button>
      </footer>
    </div>
  );
}

export default function TimelineArchiveExplorer({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const events = useMemo(() => prepareTimelineEvents(spoilerLimit), [spoilerLimit]);
  const initialDensity = DENSITY_IDS.has(requestedState.density) ? requestedState.density : 'recap';
  const [density, setDensity] = useState(initialDensity);
  const [query, setQuery] = useState(requestedState.search || '');
  const [activePhase, setActivePhase] = useState(requestedState.phase || '');
  const [activeTrack, setActiveTrack] = useState(requestedState.thread || '');
  const [majorOnly, setMajorOnly] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(DISPLAY_BATCH);
  const [selectedId, setSelectedId] = useState(requestedState.event || '');

  useEffect(() => setQuery(requestedState.search || ''), [requestedState.search]);
  useEffect(() => setSelectedId(requestedState.event || ''), [requestedState.event]);

  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedId) || null, [events, selectedId]);

  const phaseStats = useMemo(() => {
    const stats = new Map(successionTimelinePhases.map((phase) => [phase.id, { count: 0, major: 0 }]));
    for (const event of events) {
      const current = stats.get(event.phase.id) || { count: 0, major: 0 };
      current.count += 1;
      if (event.importance === 'major') current.major += 1;
      stats.set(event.phase.id, current);
    }
    return stats;
  }, [events]);

  const availableTracks = useMemo(() => {
    const counts = new Map();
    for (const event of events) for (const track of event.tracks || []) counts.set(track, (counts.get(track) || 0) + 1);
    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || trackLabel(left[0]).localeCompare(trackLabel(right[0])))
      .map(([id, count]) => ({ id, count, label: trackLabel(id) }));
  }, [events]);

  const densityBuckets = useMemo(() => {
    if (!events.length) return Array.from({ length: DENSITY_BUCKETS }, () => 0);
    const minimum = Math.min(...events.map((event) => event.chapter));
    const maximum = Math.max(...events.map((event) => event.chapter));
    const span = Math.max(1, maximum - minimum + 1);
    const buckets = Array.from({ length: DENSITY_BUCKETS }, () => 0);
    for (const event of events) {
      const position = Math.min(DENSITY_BUCKETS - 1, Math.floor(((event.chapter - minimum) / span) * DENSITY_BUCKETS));
      buckets[position] += 1;
    }
    return buckets;
  }, [events]);
  const densityMaximum = Math.max(1, ...densityBuckets);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = normalize(query);
    return events.filter((event) => {
      if (!eventMatchesDensity(event, density)) return false;
      if (majorOnly && event.importance !== 'major') return false;
      if (activePhase && event.phase.id !== activePhase) return false;
      if (activeTrack && !(event.tracks || []).includes(activeTrack)) return false;
      if (normalizedQuery && !event.searchText.includes(normalizedQuery)) return false;
      return true;
    });
  }, [activePhase, activeTrack, density, events, majorOnly, query]);

  const renderedEvents = filteredEvents.slice(0, displayLimit);
  const densityMode = DENSITY_MODES.find((mode) => mode.id === density) || DENSITY_MODES[0];
  const activePhaseRecord = successionTimelinePhases.find((phase) => phase.id === activePhase) || null;

  useEffect(() => setDisplayLimit(DISPLAY_BATCH), [activePhase, activeTrack, density, majorOnly, query]);

  const selectEvent = (event) => {
    setSelectedId(event.id);
    onNavigate?.({
      scope: 'events',
      density,
      ...(query ? { search: query } : {}),
      ...(activePhase ? { phase: activePhase } : {}),
      ...(activeTrack ? { thread: activeTrack } : {}),
      chapter: event.chapter,
      event: event.id,
    });
  };

  const closeInspector = () => {
    setSelectedId('');
    onNavigate?.({
      scope: 'events',
      density,
      ...(query ? { search: query } : {}),
      ...(activePhase ? { phase: activePhase } : {}),
      ...(activeTrack ? { thread: activeTrack } : {}),
    });
  };

  const reset = () => {
    setDensity('recap');
    setQuery('');
    setActivePhase('');
    setActiveTrack('');
    setMajorOnly(false);
    setDisplayLimit(DISPLAY_BATCH);
    setSelectedId('');
    onNavigate?.({ scope: 'events', density: 'recap' });
  };

  return (
    <div className="timeline-archive-explorer">
      <header className="tae-header">
        <div className="tae-header__identity">
          <span>Semantic chronology</span>
          <h1>Succession Timeline</h1>
          <p>{events.length} events available through Chapter {spoilerLimit}{timelineEventCount !== events.length ? ` · ${timelineEventCount} in the complete maintained archive` : ''}</p>
        </div>
        <nav className="tae-density-modes" aria-label="Timeline information density">
          {DENSITY_MODES.map((mode) => (
            <button
              type="button"
              className={density === mode.id ? 'is-active' : ''}
              aria-pressed={density === mode.id}
              onClick={() => setDensity(mode.id)}
              key={mode.id}
            >
              <strong>{mode.label}</strong>
              <small>{mode.note}</small>
            </button>
          ))}
        </nav>
      </header>

      <section className="tae-overview" aria-label="Timeline overview">
        <div className="tae-overview__head">
          <div>
            <span>Story minimap</span>
            <strong>{activePhaseRecord ? activePhaseRecord.title : 'Entire Succession Contest chronology'}</strong>
          </div>
          <p>{densityMode.note} · {filteredEvents.length} matching events</p>
        </div>
        <PhaseStrip phases={successionTimelinePhases} stats={phaseStats} activePhase={activePhase} onSelect={setActivePhase} />
        <DensityGraph buckets={densityBuckets} maximum={densityMaximum} />
      </section>

      <section className="tae-toolbar" aria-label="Timeline filters">
        <label className="tae-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search timeline</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, places, events, evidence…" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear timeline search"><X size={14} aria-hidden="true" /></button>}
        </label>
        <label className="tae-track-filter">
          <Layers3 size={15} aria-hidden="true" />
          <span className="sr-only">Filter timeline by story thread</span>
          <select value={activeTrack} onChange={(event) => setActiveTrack(event.target.value)}>
            <option value="">All story threads</option>
            {availableTracks.map((track) => <option value={track.id} key={track.id}>{track.label} · {track.count}</option>)}
          </select>
        </label>
        <button type="button" className={majorOnly ? 'tae-filter-button is-active' : 'tae-filter-button'} aria-pressed={majorOnly} onClick={() => setMajorOnly((current) => !current)}>
          <Filter size={14} aria-hidden="true" /> Major only
        </button>
        <button type="button" className="tae-filter-button" onClick={reset}>Reset</button>
      </section>

      <div className="tae-body">
        <main className="tae-stream" aria-label="Timeline event stream">
          <header className="tae-stream__head">
            <div>
              <span>{densityMode.label} view</span>
              <h2>{activePhaseRecord?.shortTitle || 'Complete story map'}</h2>
            </div>
            <p><strong>{filteredEvents.length}</strong> matching · rendering {Math.min(displayLimit, filteredEvents.length)}</p>
          </header>

          <div className="tae-stream__events">
            {renderedEvents.map((event, index) => {
              const previous = renderedEvents[index - 1];
              const showPhase = !previous || previous.phase.id !== event.phase.id;
              return <TimelineEventRow event={event} selected={event.id === selectedId} showPhase={showPhase} onSelect={selectEvent} key={event.id} />;
            })}
            {!renderedEvents.length && (
              <div className="tae-empty">
                <Search size={20} aria-hidden="true" />
                <h3>No events match this view.</h3>
                <p>Clear a filter or increase the information density.</p>
              </div>
            )}
          </div>

          {filteredEvents.length > renderedEvents.length && (
            <button type="button" className="tae-load-more" onClick={() => setDisplayLimit((current) => current + DISPLAY_BATCH)}>
              Load {Math.min(DISPLAY_BATCH, filteredEvents.length - renderedEvents.length)} more events
              <span>{filteredEvents.length - renderedEvents.length} still hidden from the DOM, not from the archive</span>
            </button>
          )}
        </main>

        <aside className="tae-inspector" aria-label="Selected timeline event">
          <EventInspector event={selectedEvent} onClose={closeInspector} onNavigate={onNavigate} />
        </aside>
      </div>
    </div>
  );
}
