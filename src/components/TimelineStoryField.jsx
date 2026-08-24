import { useMemo, useState } from 'react';
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
const importanceRank = { major: 3, standard: 2, complete: 1 };

const labelForTrack = (id) => timelineTracks.find((track) => track.id === id)?.label
  || String(id || 'other').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function StoryFieldNode({ event, left, laneIndex, selected, muted, onOpen }) {
  const elevation = event.importance === 'major' ? 64 : event.importance === 'standard' ? 34 : 16;
  const scale = event.importance === 'major' ? 1.2 : event.importance === 'standard' ? 1 : .76;
  return <button
    type="button"
    className={`tsf-node is-${event.importance}${selected ? ' is-selected' : ''}${muted ? ' is-muted' : ''}`}
    style={{ '--node-left': `${left}%`, '--node-elevation': `${elevation}px`, '--node-scale': scale, '--lane-index': laneIndex }}
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
  const [camera, setCamera] = useState('field');
  const [hoveredLane, setHoveredLane] = useState('');

  const events = useMemo(() => {
    const prelude = successionPreludeEvents
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: null }));
    const voyage = successionDays.flatMap((day) => day.events
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: day.day, date: day.date })));
    const seen = new Set();
    return [...prelude, ...voyage].filter((event) => {
      if (!event?.id || seen.has(event.id)) return false;
      seen.add(event.id);
      return true;
    }).map((event, archiveIndex) => ({
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
  const depth = DEPTH_ORDER.includes(requestedState.depth) ? requestedState.depth : 'complete';
  const activeTrack = requestedState.thread || '';
  const activeCharacter = requestedState.character ? getEntityById(requestedState.character) : null;
  const activeCharacterTerms = activeCharacter
    ? [activeCharacter.name, ...(activeCharacter.aliases || [])].map(normalize).filter(Boolean)
    : [];

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
    const primaryTrack = [...availableTracks].sort((left, right) => (laneRank.get(left) ?? 999) - (laneRank.get(right) ?? 999))[0] || 'other';
    return { ...event, primaryTrack };
  }), [events, laneIds, laneRank]);

  const visibleEvents = useMemo(() => assignedEvents.filter((event) => {
    if (depth === 'pulse' || depth === 'recap') return event.importance === 'major';
    if (depth === 'study') return event.importance !== 'complete';
    return true;
  }), [assignedEvents, depth]);

  const chapterBuckets = useMemo(() => {
    const map = new Map();
    for (const event of visibleEvents) {
      const key = `${event.primaryTrack}:${event.chapter}`;
      const current = map.get(key) || [];
      current.push(event);
      map.set(key, current);
    }
    for (const rows of map.values()) rows.sort((left, right) => left.archiveIndex - right.archiveIndex);
    return map;
  }, [visibleEvents]);

  const plottedEvents = useMemo(() => visibleEvents.map((event) => {
    const bucket = chapterBuckets.get(`${event.primaryTrack}:${event.chapter}`) || [event];
    const within = Math.max(0, bucket.findIndex((candidate) => candidate.id === event.id));
    const fractional = bucket.length === 1 ? .5 : .16 + (within / Math.max(1, bucket.length - 1)) * .68;
    const left = ((event.chapter - chapterMinimum + fractional) / chapterSpan) * 100;
    const characterMatch = !activeCharacterTerms.length || event.people.some((person) => {
      const normalized = normalize(person);
      return activeCharacterTerms.some((term) => normalized.includes(term) || term.includes(normalized));
    });
    return { ...event, plotLeft: left, characterMatch };
  }), [activeCharacterTerms, chapterBuckets, chapterMinimum, chapterSpan, visibleEvents]);

  const rails = useMemo(() => {
    const threads = getStoryThreadsAtChapter(chapterMaximum) || [];
    const eventMap = new Map(assignedEvents.map((event) => [event.id, event]));
    return threads.flatMap((thread, index) => {
      const profile = thread?.profile || thread;
      const start = Number(profile?.chapterRange?.start);
      const end = Number(profile?.chapterRange?.end ?? chapterMaximum);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 2) return [];
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
        start: clamp(start, chapterMinimum, chapterMaximum),
        end: clamp(end, chapterMinimum, chapterMaximum),
      }];
    }).sort((left, right) => (right.end - right.start) - (left.end - left.start)).slice(0, 20);
  }, [assignedEvents, chapterMaximum, chapterMinimum, laneRank, lanes.length]);

  const sceneWidth = clamp(chapterSpan * (camera === 'flat' ? 34 : 44), 1500, 4300);
  const focusLane = activeTrack && laneIds.has(activeTrack) ? activeTrack : hoveredLane;
  const contextLeft = ((contextChapter - chapterMinimum + .5) / chapterSpan) * 100;

  const commit = (overrides = {}, remove = []) => {
    const preserved = { ...requestedState };
    for (const key of remove) delete preserved[key];
    onNavigate?.({ ...preserved, scope: 'events', ...overrides });
  };
  const selectLane = (laneId) => {
    if (laneId === 'other') return;
    if (activeTrack === laneId) commit({}, ['thread']);
    else commit({ thread: laneId, view: 'threads' });
  };
  const openEvent = (event) => commit({
    event: event.id,
    chapter: event.chapter,
    depth: 'complete',
  });
  const jumpContext = (chapter) => commit({ chapter: clamp(chapter, chapterMinimum, chapterMaximum) }, ['event']);
  const setDepth = (nextDepth) => commit({ depth: nextDepth });

  return <section className={`timeline-story-field is-camera-${camera}${focusLane ? ' has-focus' : ''}`} aria-labelledby="tsf-title">
    <header className="tsf-head">
      <div>
        <span><Rotate3d size={14} aria-hidden="true" /> STORY FIELD · TIME × THREAD × IMPORTANCE</span>
        <h2 id="tsf-title">The chronology has depth now.</h2>
        <p>Every visible node is still a real timeline record. Elevation means narrative importance, horizontal position means chapter, lanes mean story threads, and long rails represent maintained multi-chapter threads.</p>
      </div>
      <div className="tsf-camera" aria-label="Story field camera">
        <span>CAMERA</span>
        <button type="button" className={camera === 'field' ? 'is-active' : ''} aria-pressed={camera === 'field'} onClick={() => setCamera('field')}><Rotate3d size={13} aria-hidden="true" /> Field</button>
        <button type="button" className={camera === 'flat' ? 'is-active' : ''} aria-pressed={camera === 'flat'} onClick={() => setCamera('flat')}><Rows3 size={13} aria-hidden="true" /> Flat</button>
      </div>
    </header>

    <section className="tsf-toolbar" aria-label="Story field controls">
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
      <aside className="tsf-lanes" aria-label="Story field lanes">
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
          <span><strong>{lane.label}</strong><small>{lane.count || plottedEvents.filter((event) => event.primaryTrack === lane.id).length} records</small></span>
          {lane.major > 0 && <b>{lane.major}</b>}
        </button>)}
      </aside>

      <div className="tsf-viewport" role="region" aria-label="Scrollable 2.5D story field" tabIndex="0">
        <div className="tsf-horizon"><span>CHAPTER {chapterMinimum}</span><strong>{camera === 'field' ? 'PERSPECTIVE STORY FIELD' : 'ORTHOGRAPHIC STORY FIELD'}</strong><span>CHAPTER {chapterMaximum}</span></div>
        <div className="tsf-scene" style={{ '--scene-width': `${sceneWidth}px`, '--lane-count': lanes.length }}>
          <div className="tsf-stage">
            <div className="tsf-chapter-grid" aria-hidden="true">
              {Array.from({ length: chapterSpan }, (_, index) => chapterMinimum + index).map((chapter) => <i className={chapter % 5 === 0 ? 'is-major-tick' : ''} style={{ '--chapter-left': `${((chapter - chapterMinimum + .5) / chapterSpan) * 100}%` }} key={chapter}><span>{chapter % 5 === 0 ? chapter : ''}</span></i>)}
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
              const left = ((rail.start - chapterMinimum) / chapterSpan) * 100;
              const width = Math.max(.7, ((rail.end - rail.start + 1) / chapterSpan) * 100);
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
                onOpen={openEvent}
                key={event.id}
              />;
            })}
          </div>
        </div>
      </div>
    </div>

    <footer className="tsf-footer">
      <div><Eye size={13} aria-hidden="true" /><span>{plottedEvents.length.toLocaleString()} visible nodes</span><small>{events.length.toLocaleString()} total records remain in the archive below.</small></div>
      <div><Maximize2 size={13} aria-hidden="true" /><span>{rails.length} duration rails</span><small>Only maintained multi-chapter threads are drawn as spans.</small></div>
      {activeCharacter && <div><Crosshair size={13} aria-hidden="true" /><span>Following {activeCharacter.name}</span><small>Unrelated nodes recede instead of disappearing.</small></div>}
    </footer>
  </section>;
}
