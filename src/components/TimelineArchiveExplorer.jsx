import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crosshair,
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
  mediaForTimelinePhase,
  successionTimelinePhases,
  timelinePhaseForChapter,
} from '../data/successionTimelinePresentation';
import SafeImage from './SafeImage';
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
const formatCount = (value) => Number(value || 0).toLocaleString();
const asNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : null;

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
      {phases.map((phase, index) => {
        const phaseStats = stats.get(phase.id) || { count: 0, major: 0 };
        const active = activePhase === phase.id;
        return (
          <button
            type="button"
            className={active ? 'is-active' : ''}
            aria-pressed={active}
            title={`${phase.title} · Chapters ${phase.startChapter}–${phase.endChapter}`}
            onClick={() => onSelect(active ? '' : phase.id)}
            key={phase.id}
          >
            <small>Era {index + 1}</small>
            <strong>{phase.shortTitle}</strong>
            <span>{formatCount(phaseStats.count)} events</span>
          </button>
        );
      })}
    </div>
  );
}

function PhaseFocus({ phase, spoilerLimit }) {
  if (!phase) return null;
  const visual = mediaForTimelinePhase(phase, spoilerLimit);
  return (
    <section className="tae-phase-focus" aria-label={`${phase.shortTitle} phase context`}>
      <figure>
        {visual && <SafeImage src={visual.src} alt={`Chapter ${visual.chapter} visual landmark for ${phase.shortTitle}`} style={{ objectPosition: visual.position }} />}
        <figcaption>Ch. {phase.startChapter}–{Math.min(phase.endChapter, spoilerLimit)}</figcaption>
      </figure>
      <div className="tae-phase-focus__copy">
        <span>{phase.label}</span>
        <h3>{phase.title}</h3>
        <p>{phase.summary}</p>
        <div>
          <section><small>Before</small><p>{phase.before}</p></section>
          <section><small>After</small><p>{phase.after}</p></section>
        </div>
      </div>
    </section>
  );
}

function DensityGraph({ buckets, maximum, activeFrom, activeTo, onSelect }) {
  return (
    <div className="tae-density-graph" aria-label="Event density across the available chronology">
      {buckets.map((bucket, index) => {
        const active = activeFrom === bucket.from && activeTo === bucket.to;
        return (
          <button
            type="button"
            className={active ? 'is-active' : ''}
            key={index}
            style={{ height: `${Math.max(8, Math.round((bucket.count / Math.max(1, maximum)) * 100))}%` }}
            title={`Ch. ${bucket.from}–${bucket.to}: ${bucket.count} event${bucket.count === 1 ? '' : 's'}. Select to isolate this chapter window.`}
            aria-label={`Chapters ${bucket.from} through ${bucket.to}, ${bucket.count} events`}
            aria-pressed={active}
            onClick={() => onSelect(bucket, active)}
          />
        );
      })}
    </div>
  );
}

function TimelineEventRow({ event, selected, onSelect }) {
  return (
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
          <i>{event.phase.shortTitle}</i>
          {event.location && <i><MapPin size={11} aria-hidden="true" /> {event.location}</i>}
          {!!event.people?.length && <i><Users size={11} aria-hidden="true" /> {event.people.slice(0, 2).join(', ')}{event.people.length > 2 ? ` +${event.people.length - 2}` : ''}</i>}
        </span>
      </span>
      <ChevronRight className="tae-event__chevron" size={16} aria-hidden="true" />
    </button>
  );
}

function sequenceGroups(events) {
  const groups = [];
  for (const event of events) {
    const key = `${event.day ?? 'prelude'}:${event.chapter}:${event.dayHeadline || ''}`;
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = {
        key,
        day: event.day,
        chapter: event.chapter,
        title: event.dayHeadline || event.phase.shortTitle,
        phase: event.phase,
        events: [],
      };
      groups.push(group);
    }
    group.events.push(event);
  }
  return groups;
}

function relatedEventsFor(event, events) {
  if (!event) return [];
  const people = new Set((event.people || []).map(normalize));
  const tracks = new Set(event.tracks || []);
  return events
    .filter((candidate) => candidate.id !== event.id)
    .map((candidate) => {
      const sharedPeople = (candidate.people || []).filter((person) => people.has(normalize(person))).length;
      const sharedTracks = (candidate.tracks || []).filter((track) => tracks.has(track)).length;
      const sameLocation = event.location && candidate.location === event.location ? 1 : 0;
      const samePhase = candidate.phase?.id === event.phase?.id ? 1 : 0;
      const distance = Math.abs(Number(candidate.chapter) - Number(event.chapter));
      const score = sharedPeople * 5 + sharedTracks * 4 + sameLocation * 3 + samePhase + (distance <= 1 ? 2 : distance <= 3 ? 1 : 0);
      return { candidate, score };
    })
    .filter((row) => row.score >= 4)
    .sort((left, right) => right.score - left.score || Math.abs(left.candidate.chapter - event.chapter) - Math.abs(right.candidate.chapter - event.chapter))
    .slice(0, 4)
    .map((row) => row.candidate);
}

function EventInspector({ event, events, related, onClose, onSelect, onOpenDossier, totalEvents }) {
  if (!event) {
    return (
      <div className="tae-inspector__empty">
        <span>Event inspector</span>
        <h2>Select an event</h2>
        <p>The chronology stays in place while the full record opens here. Long descriptions, sources, images, consequences, and connected events stay attached to the selected moment.</p>
        <div className="tae-inspector__scale-note">
          <strong>Why this scales</strong>
          <p>The archive contains {formatCount(totalEvents)} entries, while semantic density, chapter windows, clustered sequences, bounded batches, and browser content-visibility keep the working view small.</p>
        </div>
      </div>
    );
  }

  const previous = events[event.archiveIndex - 2] || null;
  const next = events[event.archiveIndex] || null;
  const visual = mediaForTimelinePhase(event.phase, event.chapter);

  return (
    <div className="tae-inspector__record">
      <header>
        <div>
          <span>Event #{String(event.archiveIndex).padStart(4, '0')}</span>
          <small>{importanceLabel(event.importance)}</small>
        </div>
        <button type="button" onClick={onClose} aria-label="Close event inspector"><X size={17} aria-hidden="true" /></button>
      </header>

      {visual && <figure className="tae-inspector__visual">
        <SafeImage src={visual.src} alt={`Chapter ${visual.chapter} visual context for ${event.title}`} style={{ objectPosition: visual.position }} />
        <figcaption>{event.phase.shortTitle} · visual landmark Ch. {visual.chapter}</figcaption>
      </figure>}

      <section className="tae-inspector__title">
        <span>{event.phase.shortTitle}</span>
        <h2>{event.title}</h2>
        <p>{event.day ? `Voyage Day ${event.day}` : 'Pre-voyage'} · {event.time || 'Time not fixed'} · Chapter {event.chapter}</p>
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

      {!!related.length && <section className="tae-inspector__related">
        <h3>Related chronology</h3>
        <p>Structural neighbors sharing people, threads, place, phase, or nearby chapters.</p>
        <div>{related.map((candidate) => <button type="button" onClick={() => onSelect(candidate)} key={candidate.id}><small>Ch. {candidate.chapter}</small><strong>{candidate.title}</strong><ChevronRight size={12} aria-hidden="true" /></button>)}</div>
      </section>}

      <nav className="tae-inspector__sequence" aria-label="Previous and next archive records">
        <button type="button" disabled={!previous} onClick={() => previous && onSelect(previous)}><ChevronLeft size={13} aria-hidden="true" /><span><small>Previous</small><strong>{previous?.title || 'Start'}</strong></span></button>
        <button type="button" disabled={!next} onClick={() => next && onSelect(next)}><span><small>Next</small><strong>{next?.title || 'End'}</strong></span><ChevronRight size={13} aria-hidden="true" /></button>
      </nav>

      <footer className="tae-inspector__actions">
        {event.source && <a href={event.source} target="_blank" rel="noreferrer"><BookOpen size={13} aria-hidden="true" /> Source note</a>}
        <button type="button" onClick={() => onOpenDossier(event)}><Star size={13} aria-hidden="true" /> Open full dossier</button>
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
  const [majorOnly, setMajorOnly] = useState(requestedState.major === '1' || requestedState.major === true);
  const [displayLimit, setDisplayLimit] = useState(DISPLAY_BATCH);
  const [selectedId, setSelectedId] = useState(requestedState.event || '');

  useEffect(() => setDensity(DENSITY_IDS.has(requestedState.density) ? requestedState.density : 'recap'), [requestedState.density]);
  useEffect(() => setQuery(requestedState.search || ''), [requestedState.search]);
  useEffect(() => setActivePhase(requestedState.phase || ''), [requestedState.phase]);
  useEffect(() => setActiveTrack(requestedState.thread || ''), [requestedState.thread]);
  useEffect(() => setMajorOnly(requestedState.major === '1' || requestedState.major === true), [requestedState.major]);
  useEffect(() => setSelectedId(requestedState.event || ''), [requestedState.event]);

  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedId) || null, [events, selectedId]);
  const related = useMemo(() => relatedEventsFor(selectedEvent, events), [events, selectedEvent]);
  const activeFrom = asNumber(requestedState.from);
  const activeTo = asNumber(requestedState.to);

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
    if (!events.length) return Array.from({ length: DENSITY_BUCKETS }, () => ({ count: 0, from: 0, to: 0 }));
    const minimum = Math.min(...events.map((event) => event.chapter));
    const maximum = Math.max(...events.map((event) => event.chapter));
    const span = Math.max(1, maximum - minimum + 1);
    const buckets = Array.from({ length: DENSITY_BUCKETS }, (_, index) => ({
      count: 0,
      from: minimum + Math.floor((index / DENSITY_BUCKETS) * span),
      to: Math.min(maximum, minimum + Math.max(0, Math.floor(((index + 1) / DENSITY_BUCKETS) * span - 0.0001))),
    }));
    for (const event of events) {
      const position = Math.min(DENSITY_BUCKETS - 1, Math.floor(((event.chapter - minimum) / span) * DENSITY_BUCKETS));
      buckets[position].count += 1;
    }
    return buckets;
  }, [events]);
  const densityMaximum = Math.max(1, ...densityBuckets.map((bucket) => bucket.count));

  const filteredEvents = useMemo(() => {
    const normalizedQuery = normalize(query);
    return events.filter((event) => {
      if (!eventMatchesDensity(event, density)) return false;
      if (majorOnly && event.importance !== 'major') return false;
      if (activePhase && event.phase.id !== activePhase) return false;
      if (activeTrack && !(event.tracks || []).includes(activeTrack)) return false;
      if (activeFrom !== null && event.chapter < activeFrom) return false;
      if (activeTo !== null && event.chapter > activeTo) return false;
      if (normalizedQuery && !event.searchText.includes(normalizedQuery)) return false;
      return true;
    });
  }, [activeFrom, activePhase, activeTo, activeTrack, density, events, majorOnly, query]);

  const renderedEvents = filteredEvents.slice(0, displayLimit);
  const renderedGroups = useMemo(() => sequenceGroups(renderedEvents), [renderedEvents]);
  const densityMode = DENSITY_MODES.find((mode) => mode.id === density) || DENSITY_MODES[0];
  const activePhaseRecord = successionTimelinePhases.find((phase) => phase.id === activePhase) || null;
  const streamTitle = density === 'recap' ? 'Key turning points' : density === 'story' ? 'Story chronology' : 'Full chronology';

  useEffect(() => setDisplayLimit(DISPLAY_BATCH), [activeFrom, activePhase, activeTo, activeTrack, density, majorOnly, query]);

  const commit = (overrides = {}, remove = []) => {
    const next = {
      ...requestedState,
      mode: 'archive',
      density,
      ...(query ? { search: query } : {}),
      ...(activePhase ? { phase: activePhase } : {}),
      ...(activeTrack ? { thread: activeTrack } : {}),
      ...(majorOnly ? { major: '1' } : {}),
      ...overrides,
    };
    for (const key of remove) delete next[key];
    for (const [key, value] of Object.entries(next)) {
      if (value === '' || value === undefined || value === null || value === false) delete next[key];
    }
    onNavigate?.({ scope: 'events', ...next });
  };

  const chooseDensity = (nextDensity) => {
    setDensity(nextDensity);
    commit({ density: nextDensity }, ['event', 'focus']);
  };

  const choosePhase = (phase) => {
    setActivePhase(phase);
    commit(phase ? { phase } : {}, ['phase', 'from', 'to', 'event', 'focus']);
  };

  const chooseTrack = (track) => {
    setActiveTrack(track);
    commit(track ? { thread: track } : {}, ['thread', 'event', 'focus']);
  };

  const toggleMajor = () => {
    const nextMajor = !majorOnly;
    setMajorOnly(nextMajor);
    commit(nextMajor ? { major: '1' } : {}, ['major', 'event', 'focus']);
  };

  const selectWindow = (bucket, active) => {
    if (active) commit({}, ['from', 'to', 'event', 'focus']);
    else commit({ from: bucket.from, to: bucket.to, chapter: Math.round((bucket.from + bucket.to) / 2) }, ['phase', 'event', 'focus']);
  };

  const selectEvent = (event) => {
    setSelectedId(event.id);
    commit({ chapter: event.chapter, event: event.id }, ['focus']);
  };

  const openDossier = (event) => commit({ chapter: event.chapter, event: event.id, focus: 'dossier' });

  const closeInspector = () => {
    setSelectedId('');
    commit({}, ['event', 'focus']);
  };

  const reset = () => {
    setDensity('recap');
    setQuery('');
    setActivePhase('');
    setActiveTrack('');
    setMajorOnly(false);
    setDisplayLimit(DISPLAY_BATCH);
    setSelectedId('');
    onNavigate?.({ scope: 'events', mode: 'archive', density: 'recap' });
  };

  const commitSearch = () => commit(query ? { search: query } : {}, query ? ['event', 'focus'] : ['search', 'event', 'focus']);

  return (
    <div className="timeline-archive-explorer" aria-label={`Succession Timeline, ${formatCount(events.length)} events`}>
      <header className="tae-header">
        <div className="tae-header__identity">
          <span>Semantic chronology</span>
          <div className="tae-header__countline">
            <h1>{formatCount(events.length)} events</h1>
            <p>showing {formatCount(filteredEvents.length)} of {formatCount(events.length)} events</p>
          </div>
        </div>
        <nav className="tae-density-modes" aria-label="Timeline information density">
          {DENSITY_MODES.map((mode) => (
            <button
              type="button"
              className={density === mode.id ? 'is-active' : ''}
              aria-pressed={density === mode.id}
              onClick={() => chooseDensity(mode.id)}
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
          <span>Story minimap</span>
          <p>{activePhaseRecord ? activePhaseRecord.shortTitle : activeFrom !== null ? `Ch. ${activeFrom}–${activeTo ?? activeFrom}` : 'All eras'}</p>
        </div>
        <PhaseStrip phases={successionTimelinePhases} stats={phaseStats} activePhase={activePhase} onSelect={choosePhase} />
        <DensityGraph buckets={densityBuckets} maximum={densityMaximum} activeFrom={activeFrom} activeTo={activeTo} onSelect={selectWindow} />
        {activeFrom !== null && <button type="button" className="tae-window-chip" onClick={() => commit({}, ['from', 'to', 'event', 'focus'])}><Crosshair size={12} aria-hidden="true" /> Ch. {activeFrom}–{activeTo ?? activeFrom} window <X size={11} aria-hidden="true" /></button>}
        <PhaseFocus phase={activePhaseRecord} spoilerLimit={spoilerLimit} />
      </section>

      <section className="tae-toolbar" aria-label="Timeline filters">
        <label className="tae-search" title="Search people, places, events, evidence">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search timeline</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={commitSearch}
            onKeyDown={(event) => { if (event.key === 'Enter') commitSearch(); }}
            placeholder="Search event, character, faction, location…"
          />
          {query && <button type="button" onClick={() => { setQuery(''); commit({}, ['search', 'event', 'focus']); }} aria-label="Clear timeline search"><X size={14} aria-hidden="true" /></button>}
        </label>
        <label className="tae-track-filter">
          <Layers3 size={15} aria-hidden="true" />
          <span className="sr-only">All story threads</span>
          <select aria-label="All story threads" value={activeTrack} onChange={(event) => chooseTrack(event.target.value)}>
            <option value="">All lanes</option>
            {availableTracks.map((track) => <option value={track.id} key={track.id}>{track.label} · {track.count}</option>)}
          </select>
        </label>
        <button type="button" className={majorOnly ? 'tae-filter-button is-active' : 'tae-filter-button'} aria-pressed={majorOnly} onClick={toggleMajor}>
          <Filter size={14} aria-hidden="true" /> Major only
        </button>
        <button type="button" className="tae-filter-button" onClick={reset}>Reset</button>
      </section>

      <div className="tae-body">
        <main className="tae-stream" aria-label="Timeline event stream">
          <header className="tae-stream__head">
            <div>
              <h2>{streamTitle}</h2>
              <p>{densityMode.note}{activePhaseRecord ? ` · ${activePhaseRecord.shortTitle}` : ''} · {renderedGroups.length} visible sequences</p>
            </div>
            <span>click any event →</span>
          </header>

          <div className="tae-stream__events">
            {renderedGroups.map((group) => (
              <section className="tae-sequence" key={group.key}>
                <header>
                  <div><small>{group.day ? `Voyage Day ${group.day}` : 'Pre-voyage'} · Chapter {group.chapter}</small><strong>{group.title}</strong></div>
                  <span>{group.events.length} event{group.events.length === 1 ? '' : 's'}</span>
                </header>
                <div>{group.events.map((event) => <TimelineEventRow event={event} selected={event.id === selectedId} onSelect={selectEvent} key={event.id} />)}</div>
              </section>
            ))}
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
          <EventInspector
            event={selectedEvent}
            events={events}
            related={related}
            onClose={closeInspector}
            onSelect={selectEvent}
            onOpenDossier={openDossier}
            totalEvents={events.length || timelineEventCount}
          />
        </aside>
      </div>
    </div>
  );
}
