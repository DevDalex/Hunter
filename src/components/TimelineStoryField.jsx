import { useMemo, useRef, useState } from 'react';
import {
  Crosshair,
  Eye,
  Layers3,
  Maximize2,
  Rotate3d,
  Rows3,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
  timelineTracks,
} from '../data/successionTimeline';
import {
  peopleForTimelineEvent,
  timelineImportance,
} from '../data/successionTimelineIntelligence';
import {
  getEntityById,
  getStoryThreadsAtChapter,
} from '../data/succession/successionData';
import './TimelineStoryField.css';

const CORE_LANES = [
  'kurapika',
  'ritual',
  'benjamin',
  'tserriednich',
  'halkenburg',
  'mafia',
  'troupe',
  'nen',
  'justice',
  'ship',
  'beyond',
  'expedition',
];
const DEPTH_ORDER = ['pulse', 'recap', 'study', 'research', 'complete'];
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(value, maximum));
const finiteNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : null;

function StoryFieldNode({ event, left, laneIndex, selected, muted, featured, onOpen }) {
  const elevation = event.importance === 'major' ? 38 : event.importance === 'standard' ? 22 : 10;
  const scale = event.importance === 'major' ? 1.08 : event.importance === 'standard' ? .94 : .72;
  const flipLabel = left > 78;

  return <button
    type="button"
    className={`tsf-node is-${event.importance}${selected ? ' is-selected' : ''}${muted ? ' is-muted' : ''}${featured ? ' is-featured' : ''}${flipLabel ? ' label-left' : ''}`}
    style={{
      '--node-left': `${left}%`,
      '--node-elevation': `${elevation}px`,
      '--node-scale': scale,
      '--lane-index': laneIndex,
    }}
    aria-label={`Chapter ${event.chapter}. ${event.title}. ${event.location || 'Location not assigned'}.`}
    title={`Ch. ${event.chapter} · ${event.title}`}
    onClick={() => onOpen(event)}
  >
    <span className="tsf-node__stem" aria-hidden="true" />
    <span className="tsf-node__cap" aria-hidden="true" />
    <span className="tsf-node__label">
      <small>CH. {event.chapter}{event.day ? ` · D${event.day}` : ''}</small>
      <strong>{event.title}</strong>
      <em>{event.location || 'Location unresolved'}</em>
    </span>
  </button>;
}

export default function TimelineStoryField({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const [camera, setCamera] = useState('flat');
  const [hoveredLane, setHoveredLane] = useState('');
  const panRef = useRef(null);

  const events = useMemo(() => {
    const prelude = successionPreludeEvents
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: null }));
    const voyage = successionDays.flatMap((day) => day.events
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: day.day, date: day.date })));
    const seen = new Set();

    return [...prelude, ...voyage]
      .filter((event) => {
        if (!event?.id || seen.has(event.id)) return false;
        seen.add(event.id);
        return true;
      })
      .map((event, archiveIndex) => ({
        ...event,
        archiveIndex,
        people: peopleForTimelineEvent(event),
        importance: timelineImportance(event),
      }));
  }, [spoilerLimit]);

  const chapterMinimum = events.length ? Math.min(...events.map((event) => event.chapter)) : 340;
  const chapterMaximum = events.length ? Math.max(...events.map((event) => event.chapter)) : chapterMinimum;
  const chapterSpan = Math.max(1, chapterMaximum - chapterMinimum + 1);
  const contextChapter = clamp(Number(requestedState.chapter) || chapterMaximum, chapterMinimum, chapterMaximum);
  const requestedWindow = finiteNumber(requestedState.window);
  const boundedWindow = clamp(requestedWindow ?? Math.min(chapterSpan, 18), 5, chapterSpan);
  const automaticDepth = boundedWindow >= 56
    ? 'pulse'
    : boundedWindow >= 32
      ? 'recap'
      : boundedWindow >= 18
        ? 'study'
        : boundedWindow >= 9
          ? 'research'
          : 'complete';
  const depth = DEPTH_ORDER.includes(requestedState.depth) ? requestedState.depth : automaticDepth;
  const activeTrack = requestedState.thread || '';
  const activeCharacter = requestedState.character ? getEntityById(requestedState.character) : null;
  const activeCharacterTerms = activeCharacter
    ? [activeCharacter.name, ...(activeCharacter.aliases || [])].map(normalize).filter(Boolean)
    : [];

  let windowFrom = contextChapter - Math.floor((boundedWindow - 1) / 2);
  let windowTo = windowFrom + boundedWindow - 1;
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
  const windowSpan = Math.max(1, windowTo - windowFrom + 1);

  const trackStats = useMemo(() => {
    const stats = new Map();
    for (const event of events) for (const track of event.tracks || []) {
      const current = stats.get(track) || { count: 0, major: 0 };
      current.count += 1;
      if (event.importance === 'major') current.major += 1;
      stats.set(track, current);
    }
    return stats;
  }, [events]);

  const lanes = useMemo(() => {
    const available = timelineTracks
      .filter((track) => track.id !== 'all' && (trackStats.get(track.id)?.count || 0) > 0)
      .sort((left, right) => {
        const leftCore = CORE_LANES.indexOf(left.id);
        const rightCore = CORE_LANES.indexOf(right.id);
        if (leftCore !== -1 || rightCore !== -1) {
          if (leftCore === -1) return 1;
          if (rightCore === -1) return -1;
          return leftCore - rightCore;
        }
        return (trackStats.get(right.id)?.count || 0) - (trackStats.get(left.id)?.count || 0)
          || left.label.localeCompare(right.label);
      });

    const selected = available.slice(0, 14).map((track) => ({
      ...track,
      count: trackStats.get(track.id)?.count || 0,
      major: trackStats.get(track.id)?.major || 0,
    }));
    return [...selected, { id: 'other', label: 'Other story motion', count: 0, major: 0 }];
  }, [trackStats]);

  const laneIds = useMemo(() => new Set(lanes.map((lane) => lane.id)), [lanes]);
  const laneRank = useMemo(() => new Map(lanes.map((lane, index) => [lane.id, index])), [lanes]);

  const assignedEvents = useMemo(() => events.map((event) => {
    const availableTracks = (event.tracks || []).filter((track) => laneIds.has(track) && track !== 'other');
    const primaryTrack = [...availableTracks]
      .sort((left, right) => (laneRank.get(left) ?? 999) - (laneRank.get(right) ?? 999))[0] || 'other';
    return { ...event, primaryTrack };
  }), [events, laneIds, laneRank]);

  const depthEvents = useMemo(() => assignedEvents.filter((event) => {
    if (depth === 'pulse' || depth === 'recap') return event.importance === 'major';
    if (depth === 'study') return event.importance !== 'complete';
    return true;
  }), [assignedEvents, depth]);

  const windowEvents = useMemo(() => depthEvents.filter((event) => (
    event.chapter >= windowFrom && event.chapter <= windowTo
  )), [depthEvents, windowFrom, windowTo]);

  const chapterBuckets = useMemo(() => {
    const map = new Map();
    for (const event of windowEvents) {
      const key = `${event.primaryTrack}:${event.chapter}`;
      const current = map.get(key) || [];
      current.push(event);
      map.set(key, current);
    }
    for (const rows of map.values()) rows.sort((left, right) => left.archiveIndex - right.archiveIndex);
    return map;
  }, [windowEvents]);

  const plottedEvents = useMemo(() => windowEvents.map((event) => {
    const bucket = chapterBuckets.get(`${event.primaryTrack}:${event.chapter}`) || [event];
    const within = Math.max(0, bucket.findIndex((candidate) => candidate.id === event.id));
    const fractional = bucket.length === 1 ? .5 : .12 + (within / Math.max(1, bucket.length - 1)) * .76;
    const left = ((event.chapter - windowFrom + fractional) / windowSpan) * 100;
    const characterMatch = !activeCharacterTerms.length || event.people.some((person) => {
      const normalized = normalize(person);
      return activeCharacterTerms.some((term) => normalized.includes(term) || term.includes(normalized));
    });
    return { ...event, plotLeft: left, characterMatch };
  }), [activeCharacterTerms, chapterBuckets, windowEvents, windowFrom, windowSpan]);

  const persistentLabelIds = useMemo(() => {
    if (depth !== 'pulse' && depth !== 'recap') return new Set();
    const bestByLane = new Map();
    for (const event of plottedEvents) {
      if (event.importance !== 'major') continue;
      const current = bestByLane.get(event.primaryTrack);
      if (!current || Math.abs(event.chapter - contextChapter) < Math.abs(current.chapter - contextChapter)) {
        bestByLane.set(event.primaryTrack, event);
      }
    }
    return new Set([...bestByLane.values()].map((event) => event.id));
  }, [contextChapter, depth, plottedEvents]);

  const rails = useMemo(() => {
    const threads = getStoryThreadsAtChapter(contextChapter) || [];
    const eventMap = new Map(assignedEvents.map((event) => [event.id, event]));
    return threads.flatMap((thread, index) => {
      const profile = thread?.profile || thread;
      const start = Number(profile?.chapterRange?.start);
      const end = Number(profile?.chapterRange?.end ?? contextChapter);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 2) return [];
      if (end < windowFrom || start > windowTo) return [];

      const eventIds = profile?.eventIds || (thread?.events || []).map((event) => event.id).filter(Boolean);
      const laneCounts = new Map();
      for (const id of eventIds) {
        const lane = eventMap.get(id)?.primaryTrack;
        if (lane) laneCounts.set(lane, (laneCounts.get(lane) || 0) + 1);
      }
      const laneId = [...laneCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || 'other';
      const laneIndex = laneRank.get(laneId) ?? lanes.length - 1;
      return [{
        id: profile.id || `thread-${index}`,
        label: profile.name || profile.question || 'Ongoing thread',
        laneId,
        laneIndex,
        start: clamp(start, windowFrom, windowTo),
        end: clamp(end, windowFrom, windowTo),
      }];
    }).sort((left, right) => (right.end - right.start) - (left.end - left.start)).slice(0, 12);
  }, [assignedEvents, contextChapter, laneRank, lanes.length, windowFrom, windowTo]);

  const sceneWidth = clamp(windowSpan * (camera === 'flat' ? 92 : 100), 1100, 4800);
  const focusLane = activeTrack && laneIds.has(activeTrack) ? activeTrack : hoveredLane;
  const contextLeft = ((contextChapter - windowFrom + .5) / windowSpan) * 100;

  const commit = (overrides = {}, remove = []) => {
    const preserved = { ...requestedState };
    for (const key of remove) delete preserved[key];
    onNavigate?.({ ...preserved, scope: 'events', ...overrides });
  };
  const selectLane = (laneId) => {
    if (laneId === 'other') return;
    if (activeTrack === laneId) commit({ mode: 'story' }, ['thread', 'view', 'intel']);
    else commit({ thread: laneId, mode: 'story' }, ['view', 'intel']);
  };
  const openEvent = (event) => commit({ event: event.id, chapter: event.chapter, depth: 'complete' });
  const jumpContext = (chapter) => commit({ chapter: clamp(chapter, chapterMinimum, chapterMaximum), window: boundedWindow, mode: 'story' }, ['event', 'view', 'intel']);
  const setDepth = (nextDepth) => commit({ depth: nextDepth, mode: 'story' }, ['view', 'intel']);
  const setWindow = (nextWindow, chapter = contextChapter) => commit({
    chapter: clamp(chapter, chapterMinimum, chapterMaximum),
    window: clamp(nextWindow, 5, chapterSpan),
    mode: 'story',
  }, ['depth', 'view', 'intel', 'event']);

  const startPan = (event) => {
    if (event.button !== 0 || event.target.closest('button')) return;
    panRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      width: event.currentTarget.clientWidth || 1,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.classList.add('is-panning');
  };

  const movePan = (event) => {
    const pan = panRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pan.startX;
    event.currentTarget.scrollLeft = pan.scrollLeft - deltaX;
  };

  const finishPan = (event) => {
    const pan = panRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pan.startX;
    panRef.current = null;
    event.currentTarget.classList.remove('is-panning');
    if (Math.abs(deltaX) < 48) return;
    const chapterDelta = Math.round((-deltaX / Math.max(1, pan.width)) * Math.max(2, windowSpan * .72));
    if (chapterDelta) jumpContext(contextChapter + chapterDelta);
  };

  const handleMapWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    if (event.deltaY < 0) setWindow(Math.max(5, Math.round(boundedWindow / 1.55)));
    else if (event.deltaY > 0) setWindow(Math.min(chapterSpan, Math.max(6, Math.round(boundedWindow * 1.55))));
  };

  const handleMapDoubleClick = (event) => {
    if (event.target.closest('button')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const fraction = clamp((event.clientX - bounds.left + event.currentTarget.scrollLeft) / Math.max(1, event.currentTarget.scrollWidth), 0, .999);
    const targetChapter = clamp(windowFrom + Math.floor(fraction * windowSpan), chapterMinimum, chapterMaximum);
    setWindow(Math.max(5, Math.round(boundedWindow / 1.65)), targetChapter);
  };

  return <section className={`timeline-story-field is-camera-${camera} is-depth-${depth}${focusLane ? ' has-focus' : ''}`} aria-labelledby="tsf-title">
    <header className="tsf-head">
      <div>
        <span><Rotate3d size={14} aria-hidden="true" /> TIMELINE MAP · CHAPTER × STORY LANE</span>
        <h2 id="tsf-title">Succession Timeline Map</h2>
        <p>Drag the map to pan through chapters. Ctrl/Command + wheel or the full-arc navigator changes semantic zoom.</p>
      </div>
      <div className="tsf-camera" aria-label="Timeline map projection">
        <span>PROJECTION</span>
        <button type="button" className={camera === 'flat' ? 'is-active' : ''} aria-pressed={camera === 'flat'} onClick={() => setCamera('flat')}><Rows3 size={13} aria-hidden="true" /> Flat</button>
        <button type="button" className={camera === 'field' ? 'is-active' : ''} aria-pressed={camera === 'field'} onClick={() => setCamera('field')}><Rotate3d size={13} aria-hidden="true" /> Depth</button>
      </div>
    </header>

    <section className="tsf-toolbar" aria-label="Timeline map controls">
      <div className="tsf-depth">
        <span>SEMANTIC DEPTH</span>
        {DEPTH_ORDER.map((id) => <button type="button" className={depth === id ? 'is-active' : ''} aria-pressed={depth === id} onClick={() => setDepth(id)} key={id}>{id}</button>)}
      </div>
      <div className="tsf-context">
        <Crosshair size={13} aria-hidden="true" />
        <span>ACTIVE CHAPTER</span>
        <button type="button" onClick={() => jumpContext(contextChapter - 1)} disabled={contextChapter <= chapterMinimum}>−</button>
        <strong>{contextChapter}</strong>
        <button type="button" onClick={() => jumpContext(contextChapter + 1)} disabled={contextChapter >= chapterMaximum}>+</button>
      </div>
      <div className="tsf-legend"><span><i className="is-major" /> defining turn</span><span><i className="is-standard" /> supporting event</span><span><i className="is-complete" /> archive event</span><span><b /> active span</span></div>
    </section>

    <div className="tsf-shell">
      <aside className="tsf-lanes" aria-label="Timeline story lanes">
        <header><Layers3 size={14} aria-hidden="true" /><span>STORY LANES</span></header>
        {lanes.map((lane, index) => <button
          type="button"
          className={`${focusLane === lane.id ? 'is-active' : ''}${lane.id === 'other' ? ' is-other' : ''}`}
          onMouseEnter={() => setHoveredLane(lane.id)}
          onMouseLeave={() => setHoveredLane('')}
          onFocus={() => setHoveredLane(lane.id)}
          onBlur={() => setHoveredLane('')}
          onClick={() => selectLane(lane.id)}
          key={lane.id}
        >
          <i>{String(index + 1).padStart(2, '0')}</i>
          <span><strong>{lane.label}</strong><small>{lane.count || 0} records</small></span>
          {lane.major > 0 && <b>{lane.major}</b>}
        </button>)}
      </aside>

      <div
        className="tsf-viewport"
        role="region"
        aria-label={`Timeline map, Chapters ${windowFrom} through ${windowTo}. Drag empty map space to pan.`}
        tabIndex="0"
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={finishPan}
        onPointerCancel={finishPan}
        onWheel={handleMapWheel}
        onDoubleClick={handleMapDoubleClick}
      >
        <div className="tsf-horizon"><span>CHAPTER {windowFrom}</span><strong>{windowSpan} CHAPTERS · {depth.toUpperCase()} DEPTH</strong><span>CHAPTER {windowTo}</span></div>
        <div className="tsf-scene" style={{ '--scene-width': `${sceneWidth}px`, '--lane-count': lanes.length }}>
          <div className="tsf-stage">
            <div className="tsf-chapter-grid" aria-hidden="true">
              {Array.from({ length: windowSpan }, (_, index) => windowFrom + index).map((chapter) => <i
                className={chapter % 5 === 0 ? 'is-major-tick' : ''}
                style={{ '--chapter-left': `${((chapter - windowFrom + .5) / windowSpan) * 100}%` }}
                key={chapter}
              ><span>{chapter}</span></i>)}
            </div>
            <div className="tsf-context-line" style={{ '--context-left': `${contextLeft}%` }} aria-hidden="true"><span>CH. {contextChapter}</span></div>

            {lanes.map((lane, laneIndexValue) => <div
              className={`tsf-lane-deck${focusLane === lane.id ? ' is-focused' : ''}${focusLane && focusLane !== lane.id ? ' is-receded' : ''}`}
              style={{ '--lane-index': laneIndexValue }}
              onMouseEnter={() => setHoveredLane(lane.id)}
              onMouseLeave={() => setHoveredLane('')}
              key={lane.id}
            ><span>{lane.label}</span></div>)}

            {rails.map((rail) => {
              const left = ((rail.start - windowFrom) / windowSpan) * 100;
              const width = Math.max(.7, ((rail.end - rail.start + 1) / windowSpan) * 100);
              const muted = Boolean(focusLane && focusLane !== rail.laneId);
              return <button
                type="button"
                className={`tsf-duration${muted ? ' is-muted' : ''}`}
                style={{ '--rail-left': `${left}%`, '--rail-width': `${width}%`, '--lane-index': rail.laneIndex }}
                title={`${rail.label} · Ch. ${rail.start}–${rail.end}`}
                onClick={() => rail.laneId !== 'other' && selectLane(rail.laneId)}
                key={rail.id}
              ><span>{rail.label}</span></button>;
            })}

            {plottedEvents.map((event) => {
              const laneIndexValue = laneRank.get(event.primaryTrack) ?? lanes.length - 1;
              const selected = requestedState.event === event.id;
              const laneMuted = Boolean(focusLane && focusLane !== event.primaryTrack);
              const characterMuted = Boolean(activeCharacterTerms.length && !event.characterMatch);
              return <StoryFieldNode
                event={event}
                left={event.plotLeft}
                laneIndex={laneIndexValue}
                selected={selected}
                muted={laneMuted || characterMuted}
                featured={persistentLabelIds.has(event.id)}
                onOpen={openEvent}
                key={event.id}
              />;
            })}
          </div>
        </div>
      </div>
    </div>

    <footer className="tsf-footer">
      <div><Eye size={13} aria-hidden="true" /><span>{plottedEvents.length.toLocaleString()} visible events</span><small>{events.length.toLocaleString()} total archive records stay indexed.</small></div>
      <div><Maximize2 size={13} aria-hidden="true" /><span>{rails.length} active story spans</span><small>Ch. {windowFrom}–{windowTo}; zoom automatically changes detail unless manually pinned.</small></div>
      {activeCharacter && <div><Crosshair size={13} aria-hidden="true" /><span>Following {activeCharacter.name}</span><small>Unrelated nodes recede instead of disappearing.</small></div>}
    </footer>
  </section>;
}
