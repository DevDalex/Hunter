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
  getEntitiesByType,
  getEntityById,
  getEventsForAbility,
  getEventsForOrganization,
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
const LENS_OPTIONS = Object.freeze([
  { id: 'story', label: 'Story', note: 'Story currents and long-running threads.' },
  { id: 'characters', label: 'Characters', note: 'The same chronology rearranged by participating people.' },
  { id: 'locations', label: 'Locations', note: 'Events grouped by their published location.' },
  { id: 'organizations', label: 'Organizations', note: 'Only canonical event-to-organization links are used.' },
  { id: 'nen', label: 'Nen', note: 'Only canonical event-to-ability links and explicitly Nen-tagged events are used.' },
  { id: 'knowledge', label: 'Knowledge', note: 'Published knowledge records plotted at their first documented chapter.' },
]);
const LENS_IDS = new Set(LENS_OPTIONS.map((item) => item.id));
const MAX_LANES = 14;
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(value, maximum));
const finiteNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const laneKey = (prefix, value) => `${prefix}:${normalize(value).replace(/[^a-z0-9]+/g, '-')}`;

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

const buildAliasLookup = (entities) => {
  const lookup = new Map();
  for (const entity of entities) {
    for (const label of [entity.name, ...(entity.aliases || [])]) {
      const key = normalize(label);
      if (key && !lookup.has(key)) lookup.set(key, entity);
    }
  }
  return lookup;
};

const buildEventEntityMap = (entities, getEvents) => {
  const map = new Map();
  for (const entity of entities) {
    for (const event of getEvents(entity.id) || []) {
      const current = map.get(event.id) || [];
      current.push(entity);
      map.set(event.id, current);
    }
  }
  return map;
};

export default function TimelineStoryField({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const [camera, setCamera] = useState('flat');
  const [hoveredLane, setHoveredLane] = useState('');
  const panRef = useRef(null);

  const characters = useMemo(() => getEntitiesByType('character'), []);
  const organizations = useMemo(() => getEntitiesByType('organization'), []);
  const abilities = useMemo(() => getEntitiesByType('ability'), []);
  const locations = useMemo(() => getEntitiesByType('location'), []);
  const knowledgeRecords = useMemo(() => getEntitiesByType('knowledge-record'), []);
  const characterLookup = useMemo(() => buildAliasLookup(characters), [characters]);
  const locationLookup = useMemo(() => buildAliasLookup(locations), [locations]);
  const organizationEventMap = useMemo(() => buildEventEntityMap(organizations, getEventsForOrganization), [organizations]);
  const abilityEventMap = useMemo(() => buildEventEntityMap(abilities, getEventsForAbility), [abilities]);

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
      .map((event, archiveIndex) => {
        const canonicalEvent = getEntityById(event.id);
        const people = peopleForTimelineEvent(event);
        const participantEntities = (canonicalEvent?.participantIds || []).map(getEntityById).filter(Boolean);
        const resolvedPeople = participantEntities.length
          ? participantEntities
          : people.map((person) => characterLookup.get(normalize(person))).filter(Boolean);
        const resolvedLocation = (canonicalEvent?.locationIds || []).map(getEntityById).find(Boolean)
          || locationLookup.get(normalize(event.location));
        const linkedOrganizations = (canonicalEvent?.organizationIds || []).map(getEntityById).filter(Boolean);
        const linkedAbilities = (canonicalEvent?.abilityIds || []).map(getEntityById).filter(Boolean);
        return {
          ...event,
          archiveIndex,
          people,
          resolvedPeople,
          resolvedLocation,
          linkedOrganizations: linkedOrganizations.length ? linkedOrganizations : (organizationEventMap.get(event.id) || []),
          linkedAbilities: linkedAbilities.length ? linkedAbilities : (abilityEventMap.get(event.id) || []),
          importance: timelineImportance(event),
        };
      });
  }, [abilityEventMap, characterLookup, locationLookup, organizationEventMap, spoilerLimit]);

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
  const lens = LENS_IDS.has(requestedState.lens) ? requestedState.lens : 'story';
  const activeTrack = requestedState.thread || '';
  const activeMapLane = requestedState.mapLane || '';
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

  const lensModel = useMemo(() => {
    if (lens === 'knowledge') {
      const stateOrder = ['public', 'shared', 'limited', 'secret', 'unknown'];
      const rawRecords = knowledgeRecords
        .filter((record) => Number(record.chapterRange?.start) <= spoilerLimit)
        .map((record, index) => {
          const state = normalize(record.knowledgeState || record.currentKnowledgeState || 'unknown');
          const laneId = `knowledge:${state || 'unknown'}`;
          const chapter = Number(record.chapterRange?.start) || chapterMinimum;
          return {
            id: record.id,
            plotKey: `${record.id}:knowledge`,
            sourceEventId: null,
            syntheticType: 'knowledge',
            chapter,
            day: null,
            title: record.name,
            detail: record.summary,
            location: record.secrecy ? `Knowledge · ${record.secrecy}` : 'Knowledge state',
            tracks: [],
            people: record.knowerLabels || [],
            importance: state === 'public' || Number(record.publicAtChapter) === chapter ? 'major' : 'standard',
            primaryTrack: laneId,
            archiveIndex: events.length + index,
          };
        });
      const counts = new Map();
      for (const record of rawRecords) counts.set(record.primaryTrack, (counts.get(record.primaryTrack) || 0) + 1);
      const lanes = [...counts.entries()]
        .map(([id, count]) => ({ id, label: id.split(':')[1].replace(/\b\w/g, (letter) => letter.toUpperCase()), count, major: 0 }))
        .sort((left, right) => {
          const a = stateOrder.indexOf(left.id.split(':')[1]);
          const b = stateOrder.indexOf(right.id.split(':')[1]);
          return (a < 0 ? 99 : a) - (b < 0 ? 99 : b) || right.count - left.count;
        });
      return { lanes, records: rawRecords };
    }

    if (lens === 'story') {
      const trackStats = new Map();
      for (const event of events) for (const track of event.tracks || []) {
        const current = trackStats.get(track) || { count: 0, major: 0 };
        current.count += 1;
        if (event.importance === 'major') current.major += 1;
        trackStats.set(track, current);
      }
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
      const lanes = available.slice(0, MAX_LANES).map((track) => ({
        ...track,
        count: trackStats.get(track.id)?.count || 0,
        major: trackStats.get(track.id)?.major || 0,
      }));
      const laneIds = new Set(lanes.map((lane) => lane.id));
      const laneRank = new Map(lanes.map((lane, index) => [lane.id, index]));
      const records = events.map((event) => {
        const availableTracks = (event.tracks || []).filter((track) => laneIds.has(track));
        const primaryTrack = [...availableTracks]
          .sort((left, right) => (laneRank.get(left) ?? 999) - (laneRank.get(right) ?? 999))[0] || 'other';
        return { ...event, primaryTrack, plotKey: `${event.id}:${primaryTrack}`, sourceEventId: event.id };
      });
      const otherCount = records.filter((event) => event.primaryTrack === 'other').length;
      return { lanes: [...lanes, { id: 'other', label: 'Other story motion', count: otherCount, major: 0 }], records };
    }

    const laneStats = new Map();
    const records = [];
    const register = (event, laneId, label) => {
      const current = laneStats.get(laneId) || { id: laneId, label, count: 0, major: 0 };
      current.count += 1;
      if (event.importance === 'major') current.major += 1;
      laneStats.set(laneId, current);
      records.push({ ...event, primaryTrack: laneId, plotKey: `${event.id}:${laneId}`, sourceEventId: event.id });
    };

    for (const event of events) {
      if (lens === 'characters') {
        const resolved = event.resolvedPeople.length
          ? event.resolvedPeople.map((person) => ({ id: `character:${person.id}`, label: person.name }))
          : event.people.map((person) => ({ id: laneKey('character', person), label: person }));
        for (const person of resolved) register(event, person.id, person.label);
      } else if (lens === 'locations') {
        const location = event.resolvedLocation
          ? { id: `location:${event.resolvedLocation.id}`, label: event.resolvedLocation.name }
          : { id: laneKey('location', event.location || 'Unresolved location'), label: event.location || 'Unresolved location' };
        register(event, location.id, location.label);
      } else if (lens === 'organizations') {
        for (const organization of event.linkedOrganizations) register(event, `organization:${organization.id}`, organization.name);
      } else if (lens === 'nen') {
        for (const ability of event.linkedAbilities) register(event, `ability:${ability.id}`, ability.name);
        if (!event.linkedAbilities.length && (event.tracks || []).some((track) => /nen|ritual|beast|curse/i.test(track))) {
          register(event, 'ability:other-nen', 'Other Nen / ritual activity');
        }
      }
    }

    const ranked = [...laneStats.values()].sort((left, right) => right.count - left.count || right.major - left.major || left.label.localeCompare(right.label));
    const lanes = ranked.slice(0, MAX_LANES);
    const allowed = new Set(lanes.map((lane) => lane.id));
    const visibleRecords = records.filter((record) => allowed.has(record.primaryTrack));
    const omitted = records.length - visibleRecords.length;
    if (omitted > 0) {
      lanes.push({ id: 'other', label: `Other ${LENS_OPTIONS.find((item) => item.id === lens)?.label || 'activity'}`, count: omitted, major: 0 });
      for (const record of records.filter((item) => !allowed.has(item.primaryTrack))) visibleRecords.push({ ...record, primaryTrack: 'other', plotKey: `${record.id}:other` });
    }
    return { lanes, records: visibleRecords };
  }, [chapterMinimum, events, knowledgeRecords, lens, spoilerLimit]);

  const lanes = lensModel.lanes;
  const laneIds = useMemo(() => new Set(lanes.map((lane) => lane.id)), [lanes]);
  const laneRank = useMemo(() => new Map(lanes.map((lane, index) => [lane.id, index])), [lanes]);
  const mappedRecords = lensModel.records;

  const depthEvents = useMemo(() => mappedRecords.filter((event) => {
    if (depth === 'pulse' || depth === 'recap') return event.importance === 'major';
    if (depth === 'study') return event.importance !== 'complete';
    return true;
  }), [depth, mappedRecords]);

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
    const within = Math.max(0, bucket.findIndex((candidate) => candidate.plotKey === event.plotKey));
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
    return new Set([...bestByLane.values()].map((event) => event.plotKey));
  }, [contextChapter, depth, plottedEvents]);

  const rails = useMemo(() => {
    if (lens !== 'story') return [];
    const threads = getStoryThreadsAtChapter(contextChapter) || [];
    const eventMap = new Map(events.map((event) => [event.id, event]));
    return threads.flatMap((thread, index) => {
      const profile = thread?.profile || thread;
      const start = Number(profile?.chapterRange?.start);
      const end = Number(profile?.chapterRange?.end ?? contextChapter);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 2) return [];
      if (end < windowFrom || start > windowTo) return [];

      const eventIds = profile?.eventIds || (thread?.events || []).map((event) => event.id).filter(Boolean);
      const laneCounts = new Map();
      for (const id of eventIds) {
        const event = eventMap.get(id);
        for (const track of event?.tracks || []) if (laneIds.has(track)) laneCounts.set(track, (laneCounts.get(track) || 0) + 1);
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
  }, [contextChapter, events, laneIds, laneRank, lanes.length, lens, windowFrom, windowTo]);

  const sceneWidth = clamp(windowSpan * (camera === 'flat' ? 92 : 100), 1100, 4800);
  const requestedLane = lens === 'story' ? activeTrack : activeMapLane;
  const focusLane = requestedLane && laneIds.has(requestedLane) ? requestedLane : hoveredLane;
  const contextLeft = ((contextChapter - windowFrom + .5) / windowSpan) * 100;
  const activeLens = LENS_OPTIONS.find((item) => item.id === lens) || LENS_OPTIONS[0];

  const commit = (overrides = {}, remove = []) => {
    const preserved = { ...requestedState };
    for (const key of remove) delete preserved[key];
    onNavigate?.({ ...preserved, scope: 'events', ...overrides });
  };
  const setLens = (nextLens) => commit({ lens: nextLens, mode: 'story' }, ['thread', 'mapLane', 'view', 'intel', 'event']);
  const selectLane = (laneId) => {
    if (laneId === 'other') return;
    if (lens === 'story') {
      if (activeTrack === laneId) commit({ mode: 'story' }, ['thread', 'view', 'intel']);
      else commit({ thread: laneId, mode: 'story' }, ['mapLane', 'view', 'intel']);
      return;
    }
    if (activeMapLane === laneId) commit({ mode: 'story' }, ['mapLane', 'view', 'intel']);
    else commit({ mapLane: laneId, mode: 'story' }, ['thread', 'view', 'intel']);
  };
  const openRecord = (event) => {
    if (event.syntheticType === 'knowledge') {
      commit({ mode: 'atlas', view: 'intelligence', intel: 'knowledge', chapter: event.chapter }, ['event']);
      return;
    }
    commit({ event: event.sourceEventId || event.id, chapter: event.chapter, depth: 'complete' });
  };
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

  return <section className={`timeline-story-field is-camera-${camera} is-depth-${depth} is-lens-${lens}${focusLane ? ' has-focus' : ''}`} aria-labelledby="tsf-title">
    <header className="tsf-head">
      <div>
        <span><Rotate3d size={14} aria-hidden="true" /> TIMELINE MAP · CHAPTER × {activeLens.label.toUpperCase()}</span>
        <h2 id="tsf-title">Succession Timeline Map</h2>
        <p>Drag the map to pan through chapters. Ctrl/Command + wheel or the full-arc navigator changes semantic zoom.</p>
      </div>
      <div className="tsf-camera" aria-label="Timeline map projection">
        <span>PROJECTION</span>
        <button type="button" className={camera === 'flat' ? 'is-active' : ''} aria-pressed={camera === 'flat'} onClick={() => setCamera('flat')}><Rows3 size={13} aria-hidden="true" /> Flat</button>
        <button type="button" className={camera === 'field' ? 'is-active' : ''} aria-pressed={camera === 'field'} onClick={() => setCamera('field')}><Rotate3d size={13} aria-hidden="true" /> Depth</button>
      </div>
    </header>

    <nav className="tsf-lensbar" aria-label="Arrange Timeline map by">
      <span>ARRANGE BY</span>
      {LENS_OPTIONS.map((item) => <button
        type="button"
        className={lens === item.id ? 'is-active' : ''}
        aria-pressed={lens === item.id}
        onClick={() => setLens(item.id)}
        key={item.id}
      >{item.label}</button>)}
      <small>{activeLens.note}</small>
    </nav>

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
      <div className="tsf-legend"><span><i className="is-major" /> defining turn</span><span><i className="is-standard" /> supporting event</span><span><i className="is-complete" /> archive event</span>{lens === 'story' && <span><b /> active span</span>}</div>
    </section>

    <div className="tsf-shell">
      <aside className="tsf-lanes" aria-label={`Timeline ${activeLens.label} lanes`}>
        <header><Layers3 size={14} aria-hidden="true" /><span>{activeLens.label.toUpperCase()} LANES</span></header>
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
        aria-label={`Timeline ${activeLens.label} map, Chapters ${windowFrom} through ${windowTo}. Drag empty map space to pan.`}
        tabIndex="0"
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={finishPan}
        onPointerCancel={finishPan}
        onWheel={handleMapWheel}
        onDoubleClick={handleMapDoubleClick}
      >
        <div className="tsf-horizon"><span>CHAPTER {windowFrom}</span><strong>{windowSpan} CHAPTERS · {activeLens.label.toUpperCase()} · {depth.toUpperCase()}</strong><span>CHAPTER {windowTo}</span></div>
        <div className="tsf-scene" style={{ '--scene-width': `${sceneWidth}px`, '--lane-count': Math.max(1, lanes.length) }}>
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
              const selected = requestedState.event === (event.sourceEventId || event.id);
              const laneMuted = Boolean(focusLane && focusLane !== event.primaryTrack);
              const characterMuted = Boolean(activeCharacterTerms.length && !event.characterMatch);
              return <StoryFieldNode
                event={event}
                left={event.plotLeft}
                laneIndex={Math.max(0, laneIndexValue)}
                selected={selected}
                muted={laneMuted || characterMuted}
                featured={persistentLabelIds.has(event.plotKey)}
                onOpen={openRecord}
                key={event.plotKey || event.id}
              />;
            })}
          </div>
        </div>
      </div>
    </div>

    <footer className="tsf-footer">
      <div><Eye size={13} aria-hidden="true" /><span>{plottedEvents.length.toLocaleString()} visible marks</span><small>{lens === 'knowledge' ? `${knowledgeRecords.length} published knowledge records indexed.` : `${events.length.toLocaleString()} total chronology records stay indexed.`}</small></div>
      <div><Maximize2 size={13} aria-hidden="true" /><span>{lanes.length} {activeLens.label.toLowerCase()} lanes</span><small>Ch. {windowFrom}–{windowTo}; zoom automatically changes detail unless manually pinned.</small></div>
      {activeCharacter && <div><Crosshair size={13} aria-hidden="true" /><span>Following {activeCharacter.name}</span><small>Unrelated marks recede instead of disappearing.</small></div>}
    </footer>
  </section>;
}
