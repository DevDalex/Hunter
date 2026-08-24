import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock3,
  ExternalLink,
  Filter,
  Layers3,
  MapPin,
  Search,
  ShieldQuestion,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
  timelineEventCount,
  timelineSources,
  timelineTracks,
} from '../data/successionTimeline';
import {
  evidenceConfidenceForEvent,
  peopleForTimelineEvent,
  timelineCausalityForEvent,
  timelineDayChanges,
  timelineImportance,
  timingConfidenceForEvent,
} from '../data/successionTimelineIntelligence';
import { strictTimelineNenForEvent } from '../data/successionTimelineIntelligenceView';
import {
  mediaForTimelinePhase,
  successionTimelinePhases,
  timelinePhaseForChapter,
} from '../data/successionTimelinePresentation';

const PAGE_SIZE = 36;
const archiveRoot = '/story/succession-contest';
const chapterRecordHref = (chapter) => `${archiveRoot}/chapter-records?chapter=${encodeURIComponent(chapter)}&entity=${encodeURIComponent(`chapter:${chapter}`)}`;
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const confidenceClass = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const confidenceGroup = (value = '') => {
  const normalized = normalize(value);
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
const arrangementOptions = [
  ['story', 'Story order'],
  ['chapter', 'Chapters'],
  ['thread', 'Threads'],
  ['location', 'Locations'],
];
const trackName = (id) => timelineTracks.find((track) => track.id === id)?.label || id;

const searchTextForEvent = (event) => {
  const causality = timelineCausalityForEvent(event);
  const people = peopleForTimelineEvent(event);
  const nen = strictTimelineNenForEvent(event);
  return normalize([
    event.time,
    event.title,
    event.detail,
    event.location,
    event.chapter,
    event.date,
    event.dayHeadline,
    event.phaseTitle,
    event.confidence,
    ...(event.tracks || []),
    ...(event.tracks || []).map(trackName),
    ...people,
    causality?.cause,
    causality?.consequence,
    causality?.leadsTo,
    ...nen.flatMap((item) => [item.title, item.detail, item.status]),
  ].filter(Boolean).join(' '));
};

const uniqueEvents = (events) => {
  const seen = new Set();
  return events.filter((event) => {
    if (!event || seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  });
};

const groupEvents = (events, arrangement) => {
  const groups = new Map();
  const add = (key, meta, event) => {
    const current = groups.get(key) || { key, ...meta, events: [] };
    current.events.push(event);
    groups.set(key, current);
  };

  for (const event of events) {
    if (arrangement === 'chapter') {
      add(`chapter-${event.chapter}`, { eyebrow: event.day ? `Voyage Day ${event.day}` : 'Pre-voyage', title: `Chapter ${event.chapter}`, subtitle: event.phaseTitle }, event);
      continue;
    }
    if (arrangement === 'thread') {
      const primaryTrack = event.tracks?.[0] || 'unassigned';
      add(`thread-${primaryTrack}`, { eyebrow: 'Primary story thread', title: trackName(primaryTrack), subtitle: 'Filter by a thread to include every linked record.' }, event);
      continue;
    }
    if (arrangement === 'location') {
      const place = event.location || 'Location not assigned';
      add(`location-${place}`, { eyebrow: 'Operational location', title: place, subtitle: 'Records currently visible in this place.' }, event);
      continue;
    }
    if (!event.day) {
      add('pre-voyage', { eyebrow: 'Chapters 340–358', title: 'Before Voyage Day 1', subtitle: 'Expedition, ritual, contracts, recruitment, and boarding.' }, event);
      continue;
    }
    add(`day-${event.day}`, { eyebrow: `${event.date} · Chapters in current result`, title: `Voyage Day ${event.day}`, subtitle: event.dayHeadline }, event);
  }

  const result = [...groups.values()];
  if (arrangement === 'location') result.sort((left, right) => right.events.length - left.events.length || left.title.localeCompare(right.title));
  if (arrangement === 'thread') result.sort((left, right) => {
    const leftId = left.key.replace('thread-', '');
    const rightId = right.key.replace('thread-', '');
    return timelineTracks.findIndex((track) => track.id === leftId) - timelineTracks.findIndex((track) => track.id === rightId);
  });
  return result;
};

function TimelineEventRecord({ event, expanded, onToggle, onOpenLocation }) {
  const causality = timelineCausalityForEvent(event);
  const people = peopleForTimelineEvent(event);
  const nen = strictTimelineNenForEvent(event);
  const timing = timingConfidenceForEvent(event);
  const evidence = evidenceConfidenceForEvent(event);
  const importance = timelineImportance(event);

  return (
    <details className={`st-record st-record--${importance}`} id={event.domId} open={expanded}>
      <summary onClick={(clickEvent) => { clickEvent.preventDefault(); onToggle(event.id); }}>
        <span className="st-record__index">#{String(event.archiveIndex).padStart(4, '0')}</span>
        <span className="st-record__headline">
          <small>{event.time} · Ch. {event.chapter}</small>
          <strong>{event.title}</strong>
          <span>{event.detail}</span>
        </span>
        <span className="st-record__context">
          <small>{event.location}</small>
          <em className={`st-confidence st-confidence--${confidenceClass(timing)}`}>{timing}</em>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>

      <div className="st-record__full">
        <div className="st-record__lead">
          <span>Complete event record</span>
          <p>{event.detail}</p>
        </div>

        {causality && (
          <section className="st-record__causality" aria-label="Cause and consequence">
            <div><span>Cause / setup</span><p>{causality.cause}</p></div>
            <ArrowRight size={15} aria-hidden="true" />
            <div><span>Immediate consequence</span><p>{causality.consequence}</p></div>
            <ArrowRight size={15} aria-hidden="true" />
            <div><span>Carried forward</span><p>{causality.leadsTo}</p></div>
          </section>
        )}

        <dl className="st-record__metadata">
          <div><dt><Clock3 size={12} aria-hidden="true" /> Placement</dt><dd>{event.time}</dd></div>
          <div><dt><ShieldQuestion size={12} aria-hidden="true" /> Timing confidence</dt><dd>{timing}</dd></div>
          <div><dt><ShieldQuestion size={12} aria-hidden="true" /> Evidence state</dt><dd>{evidence}</dd></div>
          <div><dt><MapPin size={12} aria-hidden="true" /> Location</dt><dd>{event.location}</dd></div>
          <div><dt><Layers3 size={12} aria-hidden="true" /> Movement</dt><dd>{event.phaseTitle}</dd></div>
          <div><dt><BookOpen size={12} aria-hidden="true" /> Chapter</dt><dd>{event.chapter}</dd></div>
        </dl>

        {!!people.length && (
          <section className="st-record__people" aria-label="People involved">
            <span><UsersRound size={13} aria-hidden="true" /> People involved</span>
            <div>{people.map((person) => <span key={person}>{person}</span>)}</div>
          </section>
        )}

        {!!event.tracks?.length && (
          <section className="st-record__threads" aria-label="Story threads">
            <span><Layers3 size={13} aria-hidden="true" /> Connected threads</span>
            <div>{event.tracks.map((track) => <span key={track}>{trackName(track)}</span>)}</div>
          </section>
        )}

        {!!nen.length && (
          <section className="st-record__nen" aria-label="Nen developments">
            <span><Sparkles size={13} aria-hidden="true" /> Nen development</span>
            {nen.map((item) => <p key={`${item.chapter}-${item.title}`}><strong>{item.title}</strong><br />{item.detail}<br /><em>{item.status}</em></p>)}
          </section>
        )}

        <footer className="st-record__actions">
          <a href={chapterRecordHref(event.chapter)}><BookOpen size={13} aria-hidden="true" /> Internal chapter record</a>
          <a href={event.source} target="_blank" rel="noreferrer">Source note <ExternalLink size={12} aria-hidden="true" /></a>
          {onOpenLocation && event.location && <button type="button" onClick={() => onOpenLocation(event.location)}><MapPin size={12} aria-hidden="true" /> Open ship location</button>}
        </footer>
      </div>
    </details>
  );
}

export default function SuccessionTimeline({
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  initialQuery = '',
  onOpenLocation,
  onSearchCommit,
}) {
  const boundaryDays = useMemo(() => successionDays.filter((day) => day.events.some((event) => event.chapter <= spoilerLimit)), [spoilerLimit]);
  const allVisibleEvents = useMemo(() => {
    const prelude = successionPreludeEvents
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: null, dayHeadline: event.periodTitle }));
    const voyage = boundaryDays.flatMap((day) => day.events
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: day.day, date: day.date, dayHeadline: day.headline })));
    return [...prelude, ...voyage].map((event, index) => {
      const phase = timelinePhaseForChapter(event.chapter);
      const preparedEvent = {
        ...event,
        phaseId: phase.id,
        phaseTitle: phase.shortTitle,
        archiveIndex: index + 1,
        domId: `st-event-${index + 1}`,
      };
      return { ...preparedEvent, searchText: searchTextForEvent(preparedEvent) };
    });
  }, [boundaryDays, spoilerLimit]);

  const visiblePhases = useMemo(() => successionTimelinePhases.filter((phase) => phase.startChapter <= spoilerLimit), [spoilerLimit]);
  const [activePhaseId, setActivePhaseId] = useState('foundation');
  const activePhase = visiblePhases.find((phase) => phase.id === activePhaseId) || visiblePhases.at(-1) || successionTimelinePhases[0];
  const [scope, setScope] = useState(initialQuery.trim() ? 'all' : 'phase');
  const [arrangement, setArrangement] = useState('story');
  const [activeTrack, setActiveTrack] = useState('all');
  const [confidence, setConfidence] = useState('all');
  const [location, setLocation] = useState('all');
  const [query, setQuery] = useState(initialQuery);
  const [expandedEventId, setExpandedEventId] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);
  const spotlightFocusRef = useRef(false);
  const chapterMinimum = allVisibleEvents.length ? Math.min(...allVisibleEvents.map((event) => event.chapter)) : 340;
  const chapterMaximum = allVisibleEvents.length ? Math.max(...allVisibleEvents.map((event) => event.chapter)) : spoilerLimit;
  const [chapterFrom, setChapterFrom] = useState(chapterMinimum);
  const [chapterTo, setChapterTo] = useState(chapterMaximum);

  useEffect(() => {
    if (!visiblePhases.some((phase) => phase.id === activePhaseId)) setActivePhaseId(visiblePhases.at(-1)?.id || 'foundation');
  }, [activePhaseId, visiblePhases]);

  useEffect(() => {
    setChapterFrom((current) => Math.max(chapterMinimum, Math.min(current, chapterMaximum)));
    setChapterTo((current) => Math.max(chapterMinimum, Math.min(current, chapterMaximum)));
  }, [chapterMaximum, chapterMinimum]);

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.trim()) setScope('all');
  }, [initialQuery]);

  const activePhaseEvents = useMemo(() => allVisibleEvents.filter((event) => event.phaseId === activePhase.id), [activePhase.id, allVisibleEvents]);
  const locationOptions = useMemo(() => [...new Set(allVisibleEvents.map((event) => event.location).filter(Boolean))].sort(), [allVisibleEvents]);
  const baseEvents = scope === 'phase' ? activePhaseEvents : allVisibleEvents;
  const filteredEvents = useMemo(() => {
    const normalizedQuery = normalize(query);
    const start = Math.min(chapterFrom, chapterTo);
    const end = Math.max(chapterFrom, chapterTo);
    return baseEvents.filter((event) => {
      const trackMatch = activeTrack === 'all' || event.tracks?.includes(activeTrack);
      const confidenceMatch = confidence === 'all' || confidenceGroup(timingConfidenceForEvent(event)) === confidence;
      const locationMatch = location === 'all' || event.location === location;
      const chapterMatch = event.chapter >= start && event.chapter <= end;
      return trackMatch && confidenceMatch && locationMatch && chapterMatch && (!normalizedQuery || event.searchText.includes(normalizedQuery));
    });
  }, [activeTrack, baseEvents, chapterFrom, chapterTo, confidence, location, query]);

  useEffect(() => {
    if (spotlightFocusRef.current) {
      spotlightFocusRef.current = false;
      return;
    }
    setVisibleLimit(PAGE_SIZE);
    setExpandedEventId('');
  }, [activePhase.id, activeTrack, arrangement, chapterFrom, chapterTo, confidence, location, query, scope]);

  const activeFilterCount = [
    query.trim(),
    activeTrack !== 'all',
    confidence !== 'all',
    location !== 'all',
    chapterFrom !== chapterMinimum,
    chapterTo !== chapterMaximum,
  ].filter(Boolean).length;
  const batchEvents = filteredEvents.slice(0, visibleLimit);
  const groupedEvents = useMemo(() => groupEvents(batchEvents, arrangement), [arrangement, batchEvents]);
  const activeMedia = mediaForTimelinePhase(activePhase, spoilerLimit);
  const phaseComplete = spoilerLimit >= activePhase.endChapter;
  const phaseDayCount = new Set(activePhaseEvents.map((event) => event.day).filter(Boolean)).size;
  const phaseChapterCount = new Set(activePhaseEvents.map((event) => event.chapter)).size;
  const phaseCounts = useMemo(() => Object.fromEntries(visiblePhases.map((phase) => [phase.id, allVisibleEvents.filter((event) => event.phaseId === phase.id).length])), [allVisibleEvents, visiblePhases]);
  const spotlights = useMemo(() => {
    const selected = activePhase.spotlightTerms.map((term) => activePhaseEvents.find((event) => normalize(`${event.title} ${event.detail}`).includes(normalize(term))));
    const major = activePhaseEvents.filter((event) => timelineImportance(event) === 'major');
    const standard = activePhaseEvents.filter((event) => timelineImportance(event) === 'standard');
    return uniqueEvents([...selected, ...major, ...standard]).slice(0, 5);
  }, [activePhase, activePhaseEvents]);

  const clearFilters = () => {
    setQuery('');
    setActiveTrack('all');
    setConfidence('all');
    setLocation('all');
    setChapterFrom(chapterMinimum);
    setChapterTo(chapterMaximum);
    onSearchCommit?.('');
  };

  const selectPhase = (phaseId) => {
    setActivePhaseId(phaseId);
    setScope('phase');
  };

  const openEvent = (event) => {
    const phaseIndex = activePhaseEvents.findIndex((candidate) => candidate.id === event.id);
    spotlightFocusRef.current = true;
    setScope('phase');
    setQuery('');
    setActiveTrack('all');
    setConfidence('all');
    setLocation('all');
    setChapterFrom(chapterMinimum);
    setChapterTo(chapterMaximum);
    setVisibleLimit(Math.max(PAGE_SIZE, phaseIndex + 1));
    setExpandedEventId(event.id);
    globalThis.requestAnimationFrame?.(() => globalThis.requestAnimationFrame?.(() => {
      const reduceMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(event.domId)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      spotlightFocusRef.current = false;
    }));
  };

  const dayChangeForGroup = (group) => {
    if (!group.key.startsWith('day-')) return null;
    return timelineDayChanges.find((item) => item.day === Number(group.key.replace('day-', ''))) || null;
  };

  return (
    <section className="st-editorial" id="succession-timeline" aria-labelledby="st-editorial-title">
      <header className="st-editorial__masthead">
        <div>
          <span>Succession Contest / complete chronology</span>
          <h2 id="st-editorial-title">The story in seven movements. The record in full.</h2>
          <p>Start with the turns that changed the voyage. When you need the receipts, the complete chronology is below—searchable, filterable, and unabridged.</p>
        </div>
        <dl aria-label="Timeline coverage">
          <div><dt>Movements</dt><dd>{visiblePhases.length}</dd></div>
          <div><dt>Visible records</dt><dd>{allVisibleEvents.length}</dd></div>
          <div><dt>Indexed total</dt><dd>{timelineEventCount}</dd></div>
          <div><dt>Boundary</dt><dd>Ch. {chapterMaximum}</dd></div>
        </dl>
      </header>

      <nav className="st-phase-rail" aria-label="Timeline movements">
        {visiblePhases.map((phase) => (
          <button type="button" className={phase.id === activePhase.id ? 'is-active' : ''} aria-current={phase.id === activePhase.id ? 'step' : undefined} onClick={() => selectPhase(phase.id)} key={phase.id}>
            <span>{phase.ordinal}</span>
            <small>Ch. {phase.startChapter}–{Math.min(phase.endChapter, spoilerLimit)}</small>
            <strong>{phase.shortTitle}</strong>
            <em>{phaseCounts[phase.id] || 0} records</em>
          </button>
        ))}
      </nav>

      <section className="st-phase-spread" data-phase={activePhase.id} aria-labelledby="st-active-phase-title">
        <figure className="st-phase-spread__art">
          <div>
            <img src={activeMedia.src} alt={`Manga page excerpt accompanying ${activePhase.shortTitle}`} style={{ objectPosition: activeMedia.position }} />
          </div>
          <figcaption><span>CHAPTER {activeMedia.chapter} · PAGE {activeMedia.page}</span><span>FROM THE CHAPTER ARCHIVE</span></figcaption>
        </figure>

        <div className="st-phase-spread__copy">
          <header>
            <span>Movement {activePhase.ordinal} · {activePhase.label}</span>
            <h3 id="st-active-phase-title">{activePhase.title}</h3>
            <p>{phaseComplete ? activePhase.summary : `This movement is visible only through Chapter ${spoilerLimit}. Its later consequences remain hidden by your reading boundary.`}</p>
          </header>

          <section className="st-phase-change" aria-label="What changed in this movement">
            <h4>What changed</h4>
            <div>
              <section><span>Before</span><p>{activePhase.before}</p></section>
              <ArrowRight size={18} aria-hidden="true" />
              <section><span>After</span><p>{phaseComplete ? activePhase.after : `The complete outcome remains beyond Chapter ${spoilerLimit}.`}</p></section>
            </div>
          </section>

          <div className="st-phase-threads" aria-label="Dominant story threads">
            {activePhase.focusTracks.map((track) => {
              const count = activePhaseEvents.filter((event) => event.tracks?.includes(track)).length;
              return <div key={track}><span>{trackName(track)}</span><strong>{count}</strong><small>linked records</small></div>;
            })}
          </div>

          <footer className="st-phase-spread__facts">
            <span>{activePhaseEvents.length} complete records</span>
            <span>{phaseChapterCount} chapters</span>
            <span>{phaseDayCount || 'Pre-voyage'} {phaseDayCount ? 'voyage days' : 'period'}</span>
          </footer>
        </div>
      </section>

      {!!spotlights.length && (
        <section className="st-spotlight" aria-labelledby="st-spotlight-title">
          <header><span>Movement spine</span><h3 id="st-spotlight-title">Five turns that define this movement</h3><p>Select any turn to jump straight to its complete record.</p></header>
          <ol>{spotlights.map((event, index) => (
            <li key={event.id}>
              <button type="button" onClick={() => openEvent(event)}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                <span>Ch. {event.chapter} · {event.time}</span>
                <strong>{event.title}</strong>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </li>
          ))}</ol>
        </section>
      )}

      <section className="st-archive" id="st-complete-record" aria-labelledby="st-archive-title">
        <header className="st-archive__heading">
          <div><span>Full chronology</span><h3 id="st-archive-title">Every event, in order.</h3><p>Search or rearrange the archive, then open any entry for its evidence, causality, participants, Nen context, location, chapter, and sources.</p></div>
          <div><strong>{filteredEvents.length}</strong><span>matching records</span><small>Showing {Math.min(batchEvents.length, filteredEvents.length)}</small></div>
        </header>

        <section className="st-archive-controls" aria-label="Timeline archive controls">
          <div className="st-archive-controls__primary">
            <div className="st-scope-switch" aria-label="Archive scope">
              <button type="button" className={scope === 'phase' ? 'is-active' : ''} aria-pressed={scope === 'phase'} onClick={() => setScope('phase')}>Movement {activePhase.ordinal}</button>
              <button type="button" className={scope === 'all' ? 'is-active' : ''} aria-pressed={scope === 'all'} onClick={() => setScope('all')}>Entire archive</button>
            </div>
            <div className="st-search">
              <Search size={15} aria-hidden="true" />
              <label className="sr-only" htmlFor="st-timeline-search">Search every timeline record</label>
              <input id="st-timeline-search" value={query} onChange={(event) => setQuery(event.target.value)} onBlur={() => onSearchCommit?.(query)} onKeyDown={(event) => { if (event.key === 'Enter') onSearchCommit?.(query); }} placeholder="Search person, event, room, ability, chapter…" />
              {query && <button type="button" aria-label="Clear timeline search" onClick={() => { setQuery(''); onSearchCommit?.(''); }}><X size={14} aria-hidden="true" /></button>}
            </div>
            <details className="st-filter-drawer">
              <summary><SlidersHorizontal size={14} aria-hidden="true" /> Filters <span>{activeFilterCount}</span></summary>
              <div>
                <label><span>Story thread</span><select value={activeTrack} onChange={(event) => setActiveTrack(event.target.value)}>{timelineTracks.map((track) => <option value={track.id} key={track.id}>{track.label}</option>)}</select></label>
                <label><span>Time confidence</span><select value={confidence} onChange={(event) => setConfidence(event.target.value)}><option value="all">All confidence states</option>{Object.entries(confidenceLabels).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
                <label><span>Location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option>{locationOptions.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
                <label><span>From chapter</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={chapterFrom} onChange={(event) => setChapterFrom(Number(event.target.value) || chapterMinimum)} /></label>
                <label><span>To chapter</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={chapterTo} onChange={(event) => setChapterTo(Number(event.target.value) || chapterMaximum)} /></label>
                <button type="button" className="st-clear-filters" disabled={!activeFilterCount} onClick={clearFilters}><X size={13} aria-hidden="true" /> Clear filters</button>
              </div>
            </details>
          </div>

          <div className="st-arrangement" aria-label="Arrange timeline records">
            <span>Arrange by</span>
            {arrangementOptions.map(([id, label]) => <button type="button" className={arrangement === id ? 'is-active' : ''} aria-pressed={arrangement === id} onClick={() => setArrangement(id)} key={id}>{label}</button>)}
          </div>
        </section>

        <p className="sr-only" aria-live="polite">{filteredEvents.length} timeline records match the current view.</p>

        <div className="st-groups">
          {groupedEvents.map((group) => {
            const dayChange = dayChangeForGroup(group);
            return <section className="st-group" key={group.key}>
              <header>
                <div><span>{group.eyebrow}</span><h4>{group.title}</h4><p>{group.subtitle}</p></div>
                <strong>{group.events.length}</strong>
              </header>
              {dayChange && arrangement === 'story' && <aside className="st-group__synthesis"><span>End-of-day synthesis</span><p>{dayChange.headline}</p><div><small>{dayChange.developments[0]}</small><small>{dayChange.nen[0]}</small><small>{dayChange.carry[0]}</small></div></aside>}
              <div className="st-group__records">
                {group.events.map((event) => <TimelineEventRecord event={event} expanded={expandedEventId === event.id} onToggle={(id) => setExpandedEventId((current) => current === id ? '' : id)} onOpenLocation={onOpenLocation} key={event.id} />)}
              </div>
            </section>;
          })}

          {!filteredEvents.length && <div className="st-archive__empty"><Filter size={22} aria-hidden="true" /><h4>No records match this view.</h4><p>Clear a filter or switch from the selected movement to the entire archive.</p><button type="button" onClick={clearFilters}>Reset filters</button></div>}
        </div>

        {batchEvents.length < filteredEvents.length && (
          <footer className="st-archive__pagination">
            <p>Showing {batchEvents.length} of {filteredEvents.length}. Every remaining record is still available.</p>
            <div><button type="button" onClick={() => setVisibleLimit((current) => current + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, filteredEvents.length - batchEvents.length)} more</button><button type="button" onClick={() => setVisibleLimit(filteredEvents.length)}>Show all {filteredEvents.length}</button></div>
          </footer>
        )}

        <footer className="st-archive__method">
          <div><strong>Chronology method</strong><p>Exact time, explicit range, approximate placement, and story order remain separate evidence states.</p></div>
          <div><span>Exact</span><span>Range</span><span>Approximate</span><span>Story order</span></div>
          <nav><a href={timelineSources.timeline} target="_blank" rel="noreferrer">Timeline source <ExternalLink size={12} aria-hidden="true" /></a><a href={timelineSources.contest} target="_blank" rel="noreferrer">Contest source <ExternalLink size={12} aria-hidden="true" /></a></nav>
        </footer>
      </section>
    </section>
  );
}
