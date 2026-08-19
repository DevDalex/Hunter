import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  HelpCircle,
  Link2,
  MapPin,
  ShieldQuestion,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { getEntitiesByType } from '../data/succession/successionData';
import {
  evidenceConfidenceForEvent,
  peopleForTimelineEvent,
  timelineCausalityForEvent,
  timelineDayChanges,
  timelineDeadlines,
  timelineImportance,
  timelineNenDevelopments,
  timelinePreludeRecords,
  timelinePrinceProfiles,
  timelineQuestions,
  timelineVoyageDays,
  timingConfidenceForEvent,
} from '../data/successionTimelineIntelligence';
import { strictTimelineNenForEvent } from '../data/successionTimelineIntelligenceView';
import './TimelineIntelligencePanels.css';

const archiveRoot = '/story/succession-contest';
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const chapterHref = (chapter) => `${archiveRoot}/chapter-records?chapter=${encodeURIComponent(chapter)}&entity=${encodeURIComponent(`chapter:${chapter}`)}`;
const nenHref = `${archiveRoot}/nen`;
const eventsHref = `${archiveRoot}/events`;
const relationshipsHref = `${archiveRoot}/relationships`;

const includeForDepth = (importance, depth) => {
  if (depth === 'complete') return true;
  if (depth === 'standard') return importance !== 'complete';
  return importance === 'major';
};

const confidenceTone = (label) => {
  const value = normalize(label);
  if (value.includes('exact') || value.includes('confirmed')) return 'firm';
  if (value.includes('unresolved') || value.includes('hypothesis') || value.includes('inference')) return 'open';
  return 'bounded';
};

const chapterWithinBoundary = (chapter, spoilerLimit) => Number(chapter || 0) <= spoilerLimit;

export default function TimelineIntelligencePanels({ spoilerLimit = Number.MAX_SAFE_INTEGER, onOpenLocation }) {
  const [depth, setDepth] = useState('major');
  const [questionScope, setQuestionScope] = useState('open');
  const characters = useMemo(() => getEntitiesByType('character'), []);
  const characterLookup = useMemo(() => {
    const map = new Map();
    for (const entity of characters) {
      map.set(normalize(entity.name), entity);
      for (const alias of entity.aliases || []) map.set(normalize(alias), entity);
    }
    return map;
  }, [characters]);

  const characterHref = (name) => {
    const entity = characterLookup.get(normalize(name));
    return entity ? `${archiveRoot}/characters?entity=${encodeURIComponent(entity.id)}` : null;
  };

  const visiblePrelude = useMemo(() => timelinePreludeRecords
    .filter((period) => chapterWithinBoundary(period.chapter, spoilerLimit))
    .filter((period) => includeForDepth(period.importance, depth)), [depth, spoilerLimit]);

  const visibleDays = useMemo(() => timelineVoyageDays
    .map((day) => ({
      ...day,
      events: day.events
        .filter((event) => chapterWithinBoundary(event.chapter, spoilerLimit))
        .map((event) => ({ ...event, importance: timelineImportance(event) }))
        .filter((event) => includeForDepth(event.importance, depth)),
    }))
    .filter((day) => day.events.length), [depth, spoilerLimit]);

  const allVisibleEvents = useMemo(() => timelineVoyageDays.flatMap((day) => day.events
    .filter((event) => chapterWithinBoundary(event.chapter, spoilerLimit))
    .map((event) => ({ ...event, day: day.day, date: day.date, importance: timelineImportance(event) }))), [spoilerLimit]);

  const princeRows = useMemo(() => timelinePrinceProfiles.map((prince) => {
    const matches = allVisibleEvents.filter((event) => {
      const text = normalize(`${event.title} ${event.detail} ${(event.people || []).join(' ')} ${(event.tracks || []).join(' ')}`);
      return prince.terms.some((term) => text.includes(normalize(term)));
    });
    const filtered = matches.filter((event) => includeForDepth(event.importance, depth));
    return { ...prince, events: filtered.length ? filtered : matches.slice(0, depth === 'major' ? 3 : depth === 'standard' ? 7 : matches.length) };
  }), [allVisibleEvents, depth]);

  const questions = useMemo(() => {
    const open = timelineQuestions.open.map((item) => ({ ...item, questionState: 'open' }));
    const resolved = timelineQuestions.resolved.map((item) => ({ ...item, questionState: 'resolved' }));
    const source = questionScope === 'all' ? [...open, ...resolved] : questionScope === 'resolved' ? resolved : open;
    return source
      .filter((item) => chapterWithinBoundary(item.chapter, spoilerLimit))
      .sort((left, right) => Number(left.chapter) - Number(right.chapter));
  }, [questionScope, spoilerLimit]);

  const visibleNen = useMemo(() => timelineNenDevelopments.filter((item) => chapterWithinBoundary(item.chapter, spoilerLimit)), [spoilerLimit]);
  const visibleDeadlines = useMemo(() => timelineDeadlines.filter((item) => chapterWithinBoundary(item.chapter, spoilerLimit)), [spoilerLimit]);

  const renderPeople = (event) => {
    const people = peopleForTimelineEvent(event);
    if (!people.length) return null;
    return <div className="timeline-intelligence__people" aria-label="People involved">
      <span><UsersRound size={13} aria-hidden="true" /> People</span>
      <div>{people.map((person) => {
        const href = characterHref(person);
        return href
          ? <a href={href} key={person}>{person}</a>
          : <span key={person}>{person}</span>;
      })}</div>
    </div>;
  };

  const renderEvent = (event, key) => {
    const causality = timelineCausalityForEvent(event);
    const nen = strictTimelineNenForEvent(event);
    const timing = timingConfidenceForEvent(event);
    const evidence = evidenceConfidenceForEvent(event);
    return <article className={`timeline-intelligence-event timeline-intelligence-event--${event.importance || 'standard'}`} key={key || event.id}>
      <header>
        <div>
          <span>{event.time || `Chapter ${event.chapter}`}</span>
          <h4>{event.title}</h4>
        </div>
        <a href={chapterHref(event.chapter)}>Ch. {event.chapter} <BookOpen size={12} aria-hidden="true" /></a>
      </header>
      <p>{event.detail}</p>
      <div className="timeline-intelligence__certainty" aria-label="Chronology and evidence certainty">
        <span data-tone={confidenceTone(timing)}><Clock3 size={12} aria-hidden="true" /> Timing: {timing}</span>
        <span data-tone={confidenceTone(evidence)}><ShieldQuestion size={12} aria-hidden="true" /> Evidence: {evidence}</span>
      </div>
      {renderPeople(event)}
      {causality && <section className="timeline-intelligence__causality" aria-label="Cause and consequence">
        <div><span>Cause / setup</span><p>{causality.cause}</p></div>
        <ArrowRight size={16} aria-hidden="true" />
        <div><span>Immediate consequence</span><p>{causality.consequence}</p></div>
        <ArrowRight size={16} aria-hidden="true" />
        <div><span>Leads to</span><p>{causality.leadsTo}</p></div>
      </section>}
      {!!nen.length && <div className="timeline-intelligence__nen-inline">
        <span><Sparkles size={13} aria-hidden="true" /> Nen development</span>
        {nen.map((item) => <p key={`${item.chapter}-${item.title}`}><strong>{item.title}</strong> · {item.status}</p>)}
      </div>}
      <footer>
        {onOpenLocation && event.location && <button type="button" onClick={() => onOpenLocation(event.location)}><MapPin size={12} aria-hidden="true" /> {event.location}</button>}
        <a href={eventsHref}><Activity size={12} aria-hidden="true" /> Events archive</a>
        {(event.tracks || []).some((track) => normalize(track).includes('nen') || normalize(track).includes('ritual')) && <a href={nenHref}><Sparkles size={12} aria-hidden="true" /> Nen archive</a>}
      </footer>
    </article>;
  };

  return <section className="timeline-intelligence" aria-labelledby="timeline-intelligence-title">
    <header className="timeline-intelligence__header">
      <div>
        <span><BrainCircuit size={15} aria-hidden="true" /> Timeline intelligence layer</span>
        <h2 id="timeline-intelligence-title">What happened, why it mattered, and what it changed.</h2>
        <p>The chronology now connects causes, consequences, people, Nen discoveries, open questions, prince progression, deadlines, and internal archive records without collapsing uncertain evidence into fact.</p>
      </div>
      <div className="timeline-intelligence__depth" aria-label="Timeline content depth">
        <span>Content depth</span>
        {['major', 'standard', 'complete'].map((item) => <button type="button" key={item} className={depth === item ? 'is-active' : ''} aria-pressed={depth === item} onClick={() => setDepth(item)}>{item}</button>)}
        <p>{depth === 'major' ? 'Arc-defining events only.' : depth === 'standard' ? 'Major and meaningful secondary events.' : 'Every maintained chronological beat.'}</p>
      </div>
    </header>

    <details className="timeline-intelligence__section" open>
      <summary><span>Integrated chronology</span><strong>Chapter 340 → Ch. {spoilerLimit}</strong></summary>
      <div className="timeline-intelligence__section-body">
        {!!visiblePrelude.length && <section className="timeline-intelligence__prelude">
          <header><span>Pre-voyage · Chapters 340–358</span><h3>The Succession Contest before Voyage Day 1</h3></header>
          <div>{visiblePrelude.map((period) => <article key={period.id}>
            <span>{period.date} · Ch. {period.chapters}</span>
            <h4>{period.title}</h4>
            <p>{period.detail}</p>
            <ul>{period.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <footer><a href={chapterHref(period.chapter)}>Open internal chapter record <ArrowRight size={12} aria-hidden="true" /></a><a href={period.source} target="_blank" rel="noreferrer">Source</a></footer>
          </article>)}</div>
        </section>}

        <div className="timeline-intelligence__days">
          {visibleDays.map((day) => {
            const changes = timelineDayChanges.find((item) => item.day === day.day);
            return <section className="timeline-intelligence-day" key={day.day}>
              <header><div><span>{day.date} · Chapters {day.chapterRange}</span><h3>Voyage Day {day.day}: {day.headline}</h3><p>{day.summary}</p></div><strong>{day.events.length} {depth} events</strong></header>
              <div className="timeline-intelligence-day__events">{day.events.map((event) => renderEvent(event, `${day.day}-${event.id}`))}</div>
              {changes && <aside className="timeline-intelligence__day-change" aria-label={`What changed on Voyage Day ${day.day}`}>
                <header><span>End-of-day synthesis</span><h4>What changed?</h4><p>{changes.headline}</p></header>
                <div><section><h5>Major developments</h5><ul>{changes.developments.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h5>Nen / mechanics</h5><ul>{changes.nen.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h5>Carried forward</h5><ul>{changes.carry.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
              </aside>}
            </section>;
          })}
        </div>
      </div>
    </details>

    <details className="timeline-intelligence__section" open>
      <summary><span>All fourteen princes</span><strong>Contestant progression</strong></summary>
      <div className="timeline-intelligence__section-body timeline-intelligence__princes">
        {princeRows.map((prince) => {
          const href = characterHref(prince.name);
          const statusVisible = spoilerLimit >= prince.statusChapter;
          return <article key={prince.order}>
            <header><span>Prince {prince.order}</span><h3>{prince.shortName}</h3>{href && <a href={href}>Dossier <ArrowRight size={12} aria-hidden="true" /></a>}</header>
            <p className="timeline-intelligence__prince-status">{statusVisible ? prince.status : `Latest status after Chapter ${spoilerLimit} is hidden by the reading boundary.`}</p>
            <div>{prince.events.length ? prince.events.map((event) => <a href={chapterHref(event.chapter)} key={`${prince.order}-${event.id}`}><span>Ch. {event.chapter}{event.day ? ` · Day ${event.day}` : ''}</span><strong>{event.title}</strong></a>) : <p>No matching maintained event is visible at this depth/boundary.</p>}</div>
          </article>;
        })}
      </div>
    </details>

    <details className="timeline-intelligence__section" open>
      <summary><span>Questions</span><strong>Open ↔ resolved ↔ all</strong></summary>
      <div className="timeline-intelligence__section-body">
        <div className="timeline-intelligence__question-switch" aria-label="Question status">
          {['open', 'resolved', 'all'].map((item) => <button type="button" key={item} className={questionScope === item ? 'is-active' : ''} aria-pressed={questionScope === item} onClick={() => setQuestionScope(item)}>{item}</button>)}
          <span>{questions.length} visible through Ch. {spoilerLimit}</span>
        </div>
        <div className="timeline-intelligence__questions">{questions.map((item, index) => {
          const state = item.questionState || questionScope;
          return <article key={`${state}-${item.chapter}-${index}`}>
            <header><HelpCircle size={15} aria-hidden="true" /><span>{state === 'resolved' ? 'Resolved' : 'Open'} · Ch. {item.chapter}</span></header>
            <h3>{item.question}</h3>
            <p>{state === 'resolved' ? item.answer : item.evidence}</p>
            <footer><a href={chapterHref(item.chapter)}>Chapter record</a><a href={item.source} target="_blank" rel="noreferrer">Source</a></footer>
          </article>;
        })}</div>
      </div>
    </details>

    <details className="timeline-intelligence__section" open>
      <summary><span>Nen developments</span><strong>{visibleNen.length} maintained signals</strong></summary>
      <div className="timeline-intelligence__section-body timeline-intelligence__nen-grid">
        {visibleNen.map((item) => <article key={`${item.chapter}-${item.title}`}>
          <header><Sparkles size={15} aria-hidden="true" /><span>Ch. {item.chapter} · {item.kind}</span></header>
          <h3>{item.title}</h3><p>{item.detail}</p><strong>{item.status}</strong>
          <footer><a href={chapterHref(item.chapter)}>Chapter</a><a href={nenHref}>Nen archive</a></footer>
        </article>)}
      </div>
    </details>

    <details className="timeline-intelligence__section" open>
      <summary><span>Active deadlines & countdowns</span><strong>{visibleDeadlines.length} tracked</strong></summary>
      <div className="timeline-intelligence__section-body timeline-intelligence__deadlines">
        {visibleDeadlines.map((item) => <article key={item.id}>
          <header><Clock3 size={15} aria-hidden="true" /><span>Ch. {item.chapter}</span><strong>{item.status}</strong></header>
          <h3>{item.label}</h3><p className="timeline-intelligence__deadline-time">{item.timing}</p><p>{item.detail}</p><small>{item.evidence}</small>
          <footer><a href={chapterHref(item.chapter)}>Chapter record</a><a href={item.source} target="_blank" rel="noreferrer">Source</a></footer>
        </article>)}
      </div>
    </details>

    <nav className="timeline-intelligence__archive-links" aria-label="Connected Succession Archive workspaces">
      <span><Link2 size={14} aria-hidden="true" /> Continue through the archive</span>
      <a href={eventsHref}>Events</a><a href={nenHref}>Nen</a><a href={relationshipsHref}>Relationships</a><a href={`${archiveRoot}/characters`}>Characters</a><a href={`${archiveRoot}/locations`}>Locations</a><a href={`${archiveRoot}/chapter-records`}>Chapters</a>
    </nav>
  </section>;
}
