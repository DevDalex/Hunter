import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  ExternalLink,
  Layers3,
  Radar,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { arcs } from '../data/arcs';
import { seriesChronology, seriesResearchStats } from '../data/seriesResearch';
import { timelineEventCount } from '../data/successionTimeline';
import SuccessionTimeline from './SuccessionTimeline';
import './TimelineWorkspace.css';
import './SuccessionTimelineCommand.css';

const scopeOptions = [
  ['overview', 'Series overview'],
  ['arc', 'Arc chronology'],
  ['events', 'Detailed events'],
];

const arcIds = new Set(arcs.map((arc) => arc.id));
const normalizeArc = (value) => value === 'all' || arcIds.has(value) ? value : 'all';
const normalizeScope = (value, arc) => {
  if (value === 'events' && arc !== 'succession-contest') return 'arc';
  return scopeOptions.some(([id]) => id === value) ? value : 'overview';
};
const boundedChapter = (value) => Number.isFinite(value) && value < Number.MAX_SAFE_INTEGER ? value : 413;

export default function TimelineWorkspace({
  requestedArc = 'all',
  requestedScope = 'overview',
  requestedSearch = '',
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
  onOpenChapter,
}) {
  const arc = normalizeArc(requestedArc);
  const scope = normalizeScope(requestedScope, arc);
  const [query, setQuery] = useState(requestedSearch);

  useEffect(() => setQuery(requestedSearch), [requestedSearch]);

  const visibleBlocks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return seriesChronology.filter((item) => {
      const inArc = arc === 'all' || item.arcId === arc;
      const withinBoundary = item.range[0] <= spoilerLimit;
      const searchable = `${item.arcTitle} ${item.title} ${item.chapters} ${item.summary} ${item.anchor} ${item.route} ${item.people.join(' ')} ${item.factions.join(' ')} ${item.places.join(' ')}`.toLowerCase();
      return inArc && withinBoundary && (!needle || searchable.includes(needle));
    });
  }, [arc, query, spoilerLimit]);

  const selectedArc = arcs.find((item) => item.id === arc) || null;
  const activeScopeLabel = scopeOptions.find(([id]) => id === scope)?.[1] || 'Series overview';
  const currentBoundary = boundedChapter(spoilerLimit);
  const visibleArcCount = arc === 'all' ? arcs.length : 1;
  const navigate = (changes = {}) => onNavigate?.({
    arc,
    scope,
    ...(query ? { search: query } : {}),
    ...changes,
  });

  const chooseArc = (nextArc) => {
    const nextScope = nextArc === 'all' ? 'overview' : (nextArc === 'succession-contest' && scope === 'events' ? 'events' : 'arc');
    navigate({ arc: nextArc, scope: nextScope, search: undefined });
  };

  return <section className="timeline-workspace timeline-command" id="timeline-workspace">
    <header className="timeline-workspace__hero">
      <div className="timeline-workspace__hero-copy">
        <span><Radar size={15} aria-hidden="true" /> Global chronology command</span>
        <h1>Every arc in sequence. Every voyage move in context.</h1>
        <p>Move from broad series structure to the chapter-bounded Black Whale event ledger without leaving the Timeline command. Precision, uncertainty, concurrent lanes, locations, and source boundaries remain explicit.</p>
        <div className="timeline-workspace__hero-badges" aria-label="Timeline guarantees">
          <span><ShieldCheck size={13} aria-hidden="true" /> Chapter-safe through {currentBoundary}</span>
          <span><Clock3 size={13} aria-hidden="true" /> Time confidence retained</span>
          <span><Layers3 size={13} aria-hidden="true" /> Concurrent lanes preserved</span>
        </div>
      </div>
      <div className="timeline-workspace__command-state">
        <div className="timeline-workspace__radar" aria-hidden="true">
          <i /><i /><i /><i />
          <strong>{scope === 'events' ? timelineEventCount : visibleBlocks.length}</strong>
          <span>{scope === 'events' ? 'voyage records' : 'visible blocks'}</span>
        </div>
        <dl>
          <div><dt>Current scope</dt><dd>{activeScopeLabel}</dd></div>
          <div><dt>Arc focus</dt><dd>{selectedArc?.short || 'Complete series'}</dd></div>
          <div><dt>Boundary</dt><dd>Chapter {currentBoundary}</dd></div>
          <div><dt>Visible arcs</dt><dd>{visibleArcCount}</dd></div>
        </dl>
      </div>
    </header>

    <section className="timeline-workspace__status-strip" aria-label="Timeline archive coverage">
      <div><Activity size={16} aria-hidden="true" /><span>Story arcs</span><strong>{arcs.length}</strong></div>
      <div><BookOpen size={16} aria-hidden="true" /><span>Structural blocks</span><strong>{seriesResearchStats.chronologyBlocks}</strong></div>
      <div><CalendarDays size={16} aria-hidden="true" /><span>Voyage events</span><strong>{timelineEventCount}</strong></div>
      <div><ShieldCheck size={16} aria-hidden="true" /><span>Authorized boundary</span><strong>Ch. {currentBoundary}</strong></div>
    </section>

    <nav className="timeline-workspace__arc-rail" aria-label="Timeline arc scope">
      <button type="button" className={arc === 'all' ? 'is-active' : ''} aria-current={arc === 'all' ? 'page' : undefined} onClick={() => chooseArc('all')}><small>All</small><strong>Series</strong><span>Complete structure</span></button>
      {arcs.map((item) => <button type="button" className={arc === item.id ? 'is-active' : ''} aria-current={arc === item.id ? 'page' : undefined} onClick={() => chooseArc(item.id)} key={item.id}><small>{String(item.order).padStart(2, '0')}</small><strong>{item.short}</strong><span>Ch. {item.chapters[0]}–{item.chapters[1]}</span></button>)}
    </nav>

    <div className="timeline-workspace__controls">
      <nav aria-label="Timeline depth">
        {scopeOptions.map(([id, label]) => <button type="button" className={scope === id ? 'is-active' : ''} aria-pressed={scope === id} disabled={id === 'events' && arc !== 'succession-contest'} onClick={() => navigate({ scope: id })} key={id}>{id === 'events' ? <Layers3 size={14} aria-hidden="true" /> : <CalendarDays size={14} aria-hidden="true" />}{label}</button>)}
      </nav>
      {scope !== 'overview' && <label><Search size={15} aria-hidden="true" /><span className="sr-only">Search the selected chronology</span><input value={query} onChange={(event) => setQuery(event.target.value)} onBlur={() => navigate({ search: query || undefined })} placeholder="Event, phase, place, person…" />{query && <button type="button" onClick={() => { setQuery(''); navigate({ search: undefined }); }}>Clear</button>}</label>}
    </div>

    {scope === 'overview' && <div className="timeline-workspace__overview">
      {arcs.map((item) => {
        const blocks = seriesChronology.filter((record) => record.arcId === item.id && record.range[0] <= spoilerLimit);
        return <article key={item.id}>
          <header><span>Story {String(item.order).padStart(2, '0')}</span><h2>{item.title}</h2><p>{item.premise}</p></header>
          <dl><div><dt>Chapters</dt><dd>{item.chapters[0]}–{item.chapters[1]}</dd></div><div><dt>Timeline depth</dt><dd>{item.id === 'succession-contest' ? `${timelineEventCount} detailed events` : `${blocks.length} structural blocks`}</dd></div></dl>
          <button type="button" onClick={() => chooseArc(item.id)}>Open {item.short} chronology <ArrowRight size={14} aria-hidden="true" /></button>
        </article>;
      })}
    </div>}

    {scope === 'arc' && <section className="timeline-workspace__ledger" aria-labelledby="timeline-ledger-title">
      <header><div><span>{selectedArc ? `${selectedArc.title} · Chapters ${selectedArc.chapters[0]}–${selectedArc.chapters[1]}` : 'Complete series sequence'}</span><h2 id="timeline-ledger-title">{selectedArc ? `${selectedArc.title} chronology` : 'Arc-by-arc chronology'}</h2></div><p>{selectedArc?.id === 'succession-contest' ? 'This structural view summarizes the current arc. Open Detailed events for the day-by-day Black Whale chronology.' : 'These records preserve broad phase precision rather than inventing exact timestamps for early material.'}</p></header>
      <ol>{visibleBlocks.map((item) => <li key={item.id}><i>{String(item.order).padStart(2, '0')}</i><article><header><div><span>{item.arcTitle} · {item.chapters}</span><h3>{item.title}</h3></div><a href={item.source} target="_blank" rel="noreferrer">Source <ExternalLink size={11} aria-hidden="true" /></a></header><p>{item.summary}</p><dl><div><dt>Precision</dt><dd>{item.precision}</dd></div><div><dt>Anchor</dt><dd>{item.anchor}</dd></div><div><dt>Route</dt><dd>{item.route}</dd></div><div><dt>Consequence</dt><dd>{item.consequence}</dd></div></dl></article></li>)}</ol>
      {!visibleBlocks.length && <div className="timeline-workspace__empty"><h3>No chronology block matches.</h3><p>Clear the search or choose another arc.</p></div>}
      {arc === 'succession-contest' && <button className="timeline-workspace__detail-cta" type="button" onClick={() => navigate({ scope: 'events' })}>Open the detailed voyage timeline <ArrowRight size={14} aria-hidden="true" /></button>}
    </section>}

    {scope === 'events' && arc === 'succession-contest' && <div className="timeline-workspace__events">
      <SuccessionTimeline spoilerLimit={spoilerLimit} initialQuery={requestedSearch} onOpenLocation={onOpenLocation} onOpenChapter={onOpenChapter} />
    </div>}
  </section>;
}
