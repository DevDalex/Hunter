import { useMemo } from 'react';
import {
  Crosshair,
  Image as ImageIcon,
  MapPin,
  UserRound,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
} from '../data/successionTimeline';
import { timelineImportance } from '../data/successionTimelineIntelligence';
import {
  mediaForTimelinePhase,
  successionTimelinePhases,
  timelinePhaseForChapter,
} from '../data/successionTimelinePresentation';
import { getEntityById } from '../data/succession/successionData';
import SafeImage from './SafeImage';
import './TimelineSemanticLandmarks.css';

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(value, maximum));
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const DEPTH_BUDGET = Object.freeze({
  pulse: 7,
  recap: 7,
  study: 7,
  research: 5,
  complete: 4,
});

const eventMatchesTerms = (event, terms = []) => {
  const haystack = normalize(`${event.title || ''} ${event.detail || ''} ${event.location || ''}`);
  return terms.some((term) => haystack.includes(normalize(term)));
};

export default function TimelineSemanticLandmarks({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
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
    }).map((event) => ({ ...event, importance: timelineImportance(event) }));
  }, [spoilerLimit]);

  const chapterMinimum = events.length ? Math.min(...events.map((event) => event.chapter)) : 340;
  const chapterMaximum = events.length ? Math.max(...events.map((event) => event.chapter)) : chapterMinimum;
  const chapterSpan = Math.max(1, chapterMaximum - chapterMinimum + 1);
  const contextChapter = clamp(Number(requestedState.chapter) || chapterMaximum, chapterMinimum, chapterMaximum);
  const depth = DEPTH_BUDGET[requestedState.depth] ? requestedState.depth : 'complete';
  const activeCharacter = requestedState.character ? getEntityById(requestedState.character) : null;
  const activeEvent = requestedState.event ? events.find((event) => event.id === requestedState.event) || null : null;

  const allLandmarks = useMemo(() => successionTimelinePhases
    .filter((phase) => phase.startChapter <= chapterMaximum)
    .map((phase) => {
      const phaseEvents = events.filter((event) => event.chapter >= phase.startChapter
        && event.chapter <= Math.min(phase.endChapter, chapterMaximum));
      const spotlight = phaseEvents.find((event) => eventMatchesTerms(event, phase.spotlightTerms));
      const major = phaseEvents.find((event) => event.importance === 'major');
      const anchorEvent = spotlight || major || phaseEvents[0] || null;
      const media = mediaForTimelinePhase(phase, spoilerLimit);
      const chapter = media?.chapter || anchorEvent?.chapter || phase.startChapter;
      return {
        id: phase.id,
        phase,
        media,
        event: anchorEvent,
        chapter,
        distance: Math.abs(contextChapter - chapter),
      };
    })
    .filter((record) => record.media && record.chapter <= chapterMaximum), [chapterMaximum, contextChapter, events, spoilerLimit]);

  const visibleLandmarks = useMemo(() => {
    const budget = DEPTH_BUDGET[depth] || 4;
    if (budget >= allLandmarks.length) return allLandmarks;
    const keep = new Set([...allLandmarks]
      .sort((left, right) => left.distance - right.distance || left.chapter - right.chapter)
      .slice(0, budget)
      .map((record) => record.id));
    return allLandmarks.filter((record) => keep.has(record.id));
  }, [allLandmarks, depth]);

  const commit = (overrides = {}, remove = []) => {
    const preserved = { ...requestedState };
    for (const key of remove) delete preserved[key];
    onNavigate?.({ ...preserved, scope: 'events', ...overrides });
  };

  const openLandmark = (record) => {
    if (record.event) commit({ chapter: record.event.chapter, event: record.event.id, depth: 'complete' });
    else commit({ chapter: record.chapter }, ['event']);
  };

  const activePhase = timelinePhaseForChapter(contextChapter);
  const contextLeft = ((contextChapter - chapterMinimum + .5) / chapterSpan) * 100;
  const eventPhase = activeEvent ? timelinePhaseForChapter(activeEvent.chapter) : null;
  const eventMedia = activeEvent && eventPhase ? mediaForTimelinePhase(eventPhase, spoilerLimit) : null;
  const portrait = activeCharacter?.media?.portrait || activeCharacter?.image || activeCharacter?.imageSource || '';

  return <section className="timeline-semantic-landmarks" aria-labelledby="tsl-title">
    <header className="tsl-head">
      <div>
        <span><ImageIcon size={13} aria-hidden="true" /> SEMANTIC IMAGE LANDMARKS</span>
        <h3 id="tsl-title">Images appear where the story needs a landmark.</h3>
        <p>One curated visual anchor per movement. Research depth reduces the image budget so imagery stays structural instead of becoming a wall of panels.</p>
      </div>
      <div className="tsl-status">
        <span>VISIBLE LANDMARKS</span>
        <strong>{visibleLandmarks.length}</strong>
        <small>{activePhase?.shortTitle || 'Succession Contest'}</small>
      </div>
    </header>

    <div className="tsl-horizon" style={{ '--tsl-columns': chapterSpan }}>
      <div className="tsl-axis" aria-hidden="true">
        {Array.from({ length: chapterSpan }, (_, index) => chapterMinimum + index).map((chapter) => <i
          className={chapter % 5 === 0 ? 'is-major' : ''}
          style={{ '--chapter-left': `${((chapter - chapterMinimum + .5) / chapterSpan) * 100}%` }}
          key={chapter}
        ><span>{chapter % 5 === 0 ? chapter : ''}</span></i>)}
      </div>
      <div className="tsl-context-line" style={{ '--context-left': `${contextLeft}%` }} aria-hidden="true"><span>CH. {contextChapter}</span></div>

      {visibleLandmarks.map((record, index) => {
        const left = ((record.chapter - chapterMinimum + .5) / chapterSpan) * 100;
        const nearContext = Math.abs(record.chapter - contextChapter) <= 3;
        const side = left > 82 ? ' is-edge-right' : left < 12 ? ' is-edge-left' : '';
        return <button
          type="button"
          className={`tsl-landmark${nearContext ? ' is-near-context' : ''}${side}`}
          style={{ '--landmark-left': `${left}%`, '--landmark-rank': index }}
          onClick={() => openLandmark(record)}
          aria-label={`${record.phase.shortTitle}. Visual landmark at Chapter ${record.chapter}.${record.event ? ` Opens ${record.event.title}.` : ''}`}
          key={record.id}
        >
          <figure>
            <SafeImage
              src={record.media.src}
              alt={`Chapter ${record.media.chapter} visual landmark for ${record.phase.shortTitle}`}
              style={{ objectPosition: record.media.position }}
            />
            <figcaption><span>{record.phase.ordinal}</span><small>CH. {record.chapter}</small></figcaption>
          </figure>
          <span className="tsl-landmark__copy">
            <small>{record.phase.label}</small>
            <strong>{record.phase.shortTitle}</strong>
            {record.event && <em>{record.event.title}</em>}
          </span>
        </button>;
      })}

      {activeCharacter && <button
        type="button"
        className="tsl-person-focus"
        style={{ '--person-left': `${contextLeft}%` }}
        onClick={() => commit({ view: 'people', character: activeCharacter.id, chapter: contextChapter }, ['event'])}
        aria-label={`Open ${activeCharacter.name} at Chapter ${contextChapter}`}
      >
        <SafeImage src={portrait} fallbackLabel={activeCharacter.name} alt={`${activeCharacter.name} portrait`} />
        <span><UserRound size={11} aria-hidden="true" /><strong>{activeCharacter.name}</strong><small>followed at Ch. {contextChapter}</small></span>
      </button>}
    </div>

    {activeEvent && <section className="tsl-event-focus" aria-label="Selected event visual context">
      <figure>{eventMedia && <SafeImage src={eventMedia.src} alt={`Chapter ${eventMedia.chapter} visual context for ${activeEvent.title}`} style={{ objectPosition: eventMedia.position }} />}</figure>
      <div><span>SELECTED EVENT LANDMARK · CH. {activeEvent.chapter}</span><strong>{activeEvent.title}</strong><p>{activeEvent.detail}</p><small><MapPin size={11} aria-hidden="true" /> {activeEvent.location || 'Location unresolved'} · {eventPhase?.shortTitle}</small></div>
      <button type="button" onClick={() => commit({ chapter: activeEvent.chapter, event: activeEvent.id, depth: 'complete' })}><Crosshair size={12} aria-hidden="true" /> Open complete event</button>
    </section>}

    <footer className="tsl-method"><span>Far view: movement anchors</span><span>Thread view: landmark nodes</span><span>Person focus: one portrait</span><span>Selected event: one promoted image</span></footer>
  </section>;
}
