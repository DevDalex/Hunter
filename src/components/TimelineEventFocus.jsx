import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Copy,
  ExternalLink,
  GitBranch,
  MapPin,
  ShieldQuestion,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
  timelineTracks,
} from '../data/successionTimeline';
import {
  evidenceConfidenceForEvent,
  peopleForTimelineEvent,
  timelineCausalityForEvent,
  timelineImportance,
  timingConfidenceForEvent,
} from '../data/successionTimelineIntelligence';
import { strictTimelineNenForEvent } from '../data/successionTimelineIntelligenceView';
import { classifyTimelineEvent } from '../data/successionTimelineResearch';
import {
  successionTimelinePhases,
  timelinePhaseForChapter,
} from '../data/successionTimelinePresentation';
import { getEntitiesByType } from '../data/succession/successionData';
import SafeImage from './SafeImage';
import './TimelineEventFocus.css';

const archiveRoot = '/story/succession-contest';
const chapterRecordHref = (chapter) => `${archiveRoot}/chapter-records?chapter=${encodeURIComponent(chapter)}&entity=${encodeURIComponent(`chapter:${chapter}`)}`;
const normalize = (value) => String(value || '').trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const trackLabel = (id) => timelineTracks.find((track) => track.id === id)?.label || labelize(id);

const visualForEvent = (event, phase) => {
  if (!phase?.media?.length) return null;
  return phase.media.filter((item) => item.chapter <= event.chapter).at(-1) || phase.media[0];
};

const resolveNamedEntity = (name, entities) => {
  const token = normalize(name);
  if (!token) return null;
  const exact = entities.find((entity) => [entity.name, ...(entity.aliases || [])].some((value) => normalize(value) === token));
  if (exact) return exact;
  return entities.find((entity) => [entity.name, ...(entity.aliases || [])].some((value) => {
    const candidate = normalize(value);
    return candidate.length >= 4 && (token.includes(candidate) || candidate.includes(token));
  })) || null;
};

export default function TimelineEventFocus({
  eventId,
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onClose,
  onOpenLocation,
}) {
  const [copyState, setCopyState] = useState('');
  const events = useMemo(() => {
    const prelude = successionPreludeEvents
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: null }));
    const voyage = successionDays.flatMap((day) => day.events
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: day.day, date: day.date, dayHeadline: day.headline })));
    const seen = new Set();
    return [...prelude, ...voyage].filter((event) => {
      if (!event?.id || seen.has(event.id)) return false;
      seen.add(event.id);
      return true;
    }).map((event, index) => ({
      ...event,
      archiveIndex: index,
      people: peopleForTimelineEvent(event),
      importance: timelineImportance(event),
      timing: timingConfidenceForEvent(event),
      evidence: evidenceConfidenceForEvent(event),
      eventType: classifyTimelineEvent(event),
    }));
  }, [spoilerLimit]);

  const event = events.find((candidate) => candidate.id === eventId) || null;
  const phase = event ? timelinePhaseForChapter(event.chapter) : successionTimelinePhases[0];
  const visual = event ? visualForEvent(event, phase) : null;
  const causality = event ? timelineCausalityForEvent(event) : null;
  const nen = event ? strictTimelineNenForEvent(event) : [];
  const characters = useMemo(() => getEntitiesByType('character'), []);
  const organizations = useMemo(() => getEntitiesByType('organization'), []);
  const people = useMemo(() => event
    ? event.people.map((name) => ({ name, entity: resolveNamedEntity(name, characters) }))
    : [], [characters, event]);
  const matchedOrganizations = useMemo(() => {
    if (!event) return [];
    const haystack = normalize(`${event.title} ${event.detail} ${event.location} ${event.people.join(' ')} ${(event.tracks || []).map(trackLabel).join(' ')}`);
    return organizations.filter((organization) => [organization.name, ...(organization.aliases || [])].some((value) => {
      const token = normalize(value);
      return token.length >= 4 && haystack.includes(token);
    })).slice(0, 8);
  }, [event, organizations]);

  const related = useMemo(() => {
    if (!event) return [];
    const peopleSet = new Set(event.people.map(normalize));
    const tracks = new Set(event.tracks || []);
    return events.filter((candidate) => candidate.id !== event.id).map((candidate) => {
      const sharedTracks = (candidate.tracks || []).filter((track) => tracks.has(track)).length;
      const sharedPeople = candidate.people.filter((person) => peopleSet.has(normalize(person))).length;
      const sameLocation = event.location && candidate.location === event.location ? 1 : 0;
      const distance = Math.abs(candidate.chapter - event.chapter);
      const samePhase = timelinePhaseForChapter(candidate.chapter)?.id === phase?.id ? 1 : 0;
      const score = sharedTracks * 4 + sharedPeople * 5 + sameLocation * 3 + samePhase + (distance <= 1 ? 2 : distance <= 3 ? 1 : 0);
      return { candidate, score };
    }).filter((row) => row.score >= 4)
      .sort((left, right) => right.score - left.score || Math.abs(left.candidate.chapter - event.chapter) - Math.abs(right.candidate.chapter - event.chapter) || left.candidate.archiveIndex - right.candidate.archiveIndex)
      .slice(0, 6)
      .map((row) => row.candidate);
  }, [event, events, phase?.id]);

  if (!event) return <section className="timeline-event-focus tef-missing"><strong>That event is outside the current chapter boundary.</strong><button type="button" onClick={onClose}>Return to timeline</button></section>;

  const previous = events[event.archiveIndex - 1] || null;
  const next = events[event.archiveIndex + 1] || null;
  const leaveFocus = (overrides = {}) => {
    const { event: _event, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', ...overrides });
  };
  const openEvent = (nextEvent) => onNavigate?.({
    ...requestedState,
    scope: 'events',
    event: nextEvent.id,
    chapter: nextEvent.chapter,
    depth: 'complete',
  });
  const copyLink = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(globalThis.location?.href || '');
      setCopyState('Copied event link');
    } catch {
      setCopyState('Event is already reflected in the address bar');
    }
    globalThis.setTimeout?.(() => setCopyState(''), 1800);
  };

  return <section className={`timeline-event-focus is-${event.importance}`} aria-labelledby="tef-title">
    <header className="tef-topbar">
      <button type="button" className="tef-back" onClick={onClose}><ArrowLeft size={15} aria-hidden="true" /> Return to timeline</button>
      <div><span>EVENT FOCUS</span><strong>#{String(event.archiveIndex + 1).padStart(4, '0')}</strong></div>
      <button type="button" onClick={copyLink}><Copy size={13} aria-hidden="true" /> Copy deep link</button>
      <button type="button" className="tef-close" onClick={onClose} aria-label="Close event focus"><X size={16} aria-hidden="true" /></button>
    </header>

    <section className="tef-hero">
      <figure>
        {visual && <SafeImage src={visual.src} alt={`Chapter ${visual.chapter} visual context for ${event.title}`} style={{ objectPosition: visual.position }} eager />}
        <figcaption><span>{phase?.ordinal || ''}</span><small>CHAPTER {visual?.chapter || event.chapter} VISUAL CONTEXT</small></figcaption>
      </figure>
      <div className="tef-hero__copy">
        <span>{phase?.shortTitle || 'Succession Contest'} · {labelize(event.eventType)} · {event.importance.toUpperCase()}</span>
        <h2 id="tef-title">{event.title}</h2>
        <p>{event.detail}</p>
        <dl>
          <div><dt><Clock3 size={11} aria-hidden="true" /> Placement</dt><dd>Ch. {event.chapter} · {event.time}</dd></div>
          <div><dt><MapPin size={11} aria-hidden="true" /> Location</dt><dd>{event.location || 'Location unresolved'}</dd></div>
          <div><dt><ShieldQuestion size={11} aria-hidden="true" /> Timing</dt><dd>{event.timing}</dd></div>
          <div><dt><ShieldQuestion size={11} aria-hidden="true" /> Evidence</dt><dd>{event.evidence}</dd></div>
        </dl>
      </div>
    </section>

    <section className="tef-causality" aria-labelledby="tef-causality-title">
      <header><span>CAUSE → EVENT → CONSEQUENCE</span><h3 id="tef-causality-title">Why this moment matters</h3></header>
      <div>
        <article><span>01 · SETUP</span><strong>Cause / pressure</strong><p>{causality?.cause || 'No separate causal setup is maintained for this record.'}</p></article>
        <ArrowRight size={19} aria-hidden="true" />
        <article className="is-event"><span>02 · EVENT</span><strong>{event.title}</strong><p>{event.detail}</p></article>
        <ArrowRight size={19} aria-hidden="true" />
        <article><span>03 · IMMEDIATE</span><strong>Immediate effect</strong><p>{causality?.consequence || 'No separate immediate consequence is maintained for this record.'}</p></article>
        <ArrowRight size={19} aria-hidden="true" />
        <article><span>04 · CARRY</span><strong>Carried forward</strong><p>{causality?.leadsTo || 'No separate long-range consequence is maintained for this record.'}</p></article>
      </div>
    </section>

    <div className="tef-intelligence-grid">
      <section className="tef-people">
        <header><UsersRound size={14} aria-hidden="true" /><span>PEOPLE</span><strong>{people.length}</strong></header>
        <div>{people.map(({ name, entity }) => entity
          ? <button type="button" onClick={() => leaveFocus({ view: 'people', character: entity.id, chapter: event.chapter })} key={name}><SafeImage src={entity.media?.portrait || entity.image || entity.imageSource || ''} fallbackLabel={entity.name} alt={`${entity.name} portrait`} /><span><strong>{entity.name}</strong><small>open person timeline</small></span></button>
          : <span className="tef-person-text" key={name}>{name}</span>)}</div>
        {!people.length && <p>No named participant is attached to this timeline record.</p>}
      </section>

      <section className="tef-threads">
        <header><GitBranch size={14} aria-hidden="true" /><span>THREADS</span><strong>{event.tracks?.length || 0}</strong></header>
        <div>{(event.tracks || []).map((track) => <button type="button" onClick={() => leaveFocus({ view: 'threads', thread: track, chapter: event.chapter })} key={track}>{trackLabel(track)}</button>)}</div>
        {!!matchedOrganizations.length && <><h4>Organizations in this record</h4><div>{matchedOrganizations.map((organization) => <span key={organization.id}>{organization.name}</span>)}</div></>}
      </section>

      <section className="tef-nen">
        <header><Sparkles size={14} aria-hidden="true" /><span>NEN</span><strong>{nen.length}</strong></header>
        {nen.length ? <div>{nen.map((item) => <article key={`${item.chapter}-${item.title}`}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.status}</small></article>)}</div> : <p>No strict maintained Nen development is attached to this exact event.</p>}
      </section>

      <section className="tef-evidence">
        <header><BookOpen size={14} aria-hidden="true" /><span>EVIDENCE</span><strong>2 paths</strong></header>
        <a href={chapterRecordHref(event.chapter)}><BookOpen size={12} aria-hidden="true" /> Internal Chapter {event.chapter} record</a>
        {event.source && <a href={event.source} target="_blank" rel="noreferrer">Source note <ExternalLink size={11} aria-hidden="true" /></a>}
        {event.location && <button type="button" onClick={() => onOpenLocation?.(event.location)}><MapPin size={12} aria-hidden="true" /> Open spatial state at this location</button>}
      </section>
    </div>

    <section className="tef-related" aria-labelledby="tef-related-title">
      <header><span>RELATED CHRONOLOGY</span><h3 id="tef-related-title">Nearby records sharing people, threads, place, or phase</h3><p>These are structural neighbors, not automatically causal claims.</p></header>
      <div>{related.map((candidate) => <button type="button" onClick={() => openEvent(candidate)} key={candidate.id}><small>CH. {candidate.chapter} · {candidate.time}</small><strong>{candidate.title}</strong><span>{candidate.location || trackLabel(candidate.tracks?.[0])}</span><ArrowRight size={13} aria-hidden="true" /></button>)}</div>
    </section>

    <footer className="tef-sequence">
      <button type="button" disabled={!previous} onClick={() => previous && openEvent(previous)}><ArrowLeft size={14} aria-hidden="true" /><span><small>PREVIOUS RECORD</small><strong>{previous?.title || 'Start of archive'}</strong></span></button>
      <div><span>CHAPTER {event.chapter}</span><strong>{event.archiveIndex + 1} / {events.length}</strong><small>{copyState || phase?.label}</small></div>
      <button type="button" disabled={!next} onClick={() => next && openEvent(next)}><span><small>NEXT RECORD</small><strong>{next?.title || 'End of archive'}</strong></span><ArrowRight size={14} aria-hidden="true" /></button>
    </footer>
  </section>;
}
