import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Database,
  ExternalLink,
  Layers3,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { arcs } from '../data/arcs';
import { seriesChronology, seriesResearchStats } from '../data/seriesResearch';
import { timelineEventCount } from '../data/successionTimeline';
import SuccessionTimeline from './SuccessionTimeline';
import './TimelineWorkspace.css';

const scopeOptions = [
  ['overview', 'Series overview'],
  ['arc', 'Arc chronology'],
  ['events', 'Voyage intelligence'],
];

const arcIds = new Set(arcs.map((arc) => arc.id));
const normalizeArc = (value) => value === 'all' || arcIds.has(value) ? value : 'all';
const normalizeScope = (value, arc) => {
  if (value === 'events' && arc !== 'succession-contest') return 'arc';
  return scopeOptions.some(([id]) => id === value) ? value : 'overview';
};

export default function TimelineWorkspace({
  requestedArc = 'all',
  requestedScope = 'overview',
  requestedSearch = '',
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  embedded = false,
  onNavigate,
  onOpenLocation,
}) {
  const arc = normalizeArc(requestedArc);
  const scope = normalizeScope(requestedScope, arc);
  const [query, setQuery] = useState(requestedSearch);
  const HeroHeading = embedded ? 'h2' : 'h1';

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
  const visibleArcCount = arcs.filter((item) => item.chapters[0] <= spoilerLimit).length;
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
    <header className="timeline-workspace__hero timeline-command__hero">
      <div className="timeline-command__hero-copy">
        <span><Compass size={15} aria-hidden="true" /> Global chronology command</span>
        <HeroHeading>Every arc, phase, voyage day, and consequence on one navigable axis.</HeroHeading>
        <p>Move from broad series structure to the chapter-bounded Succession voyage ledger without losing chronology, source precision, concurrent story pressure, or the selected reading boundary.</p>
        <div className="timeline-command__hero-actions" aria-label="Timeline destinations">
          <button type="button" onClick={() => chooseArc('all')}><Database size={15} aria-hidden="true" /> Complete series</button>
          <button type="button" onClick={() => { chooseArc('succession-contest'); navigate({ arc: 'succession-contest', scope: 'events', search: undefined }); }}><Layers3 size={15} aria-hidden="true" /> Voyage intelligence</button>
        </div>
      </div>
      <div className="timeline-command__signal" aria-label="Timeline release signal">
        <span>Authorized chronology</span>
        <strong>Ch. {spoilerLimit}</strong>
        <p>The interface never converts uncertain sequencing into an exact timestamp.</p>
        <ShieldCheck size={22} aria-hidden="true" />
      </div>
      <dl className="timeline-command__metrics">
        <div><dt>Visible arcs</dt><dd>{visibleArcCount}</dd></div>
        <div><dt>Structural blocks</dt><dd>{seriesResearchStats.chronologyBlocks}</dd></div>
        <div><dt>Voyage events</dt><dd>{timelineEventCount}</dd></div>
        <div><dt>Current scope</dt><dd>{scope === 'events' ? 'Voyage' : scope === 'arc' ? 'Arc' : 'Series'}</dd></div>
      </dl>
    </header>

    <section className="timeline-command__navigation" aria-labelledby="timeline-command-navigation-title">
      <header>
        <div><span>Chronology scale</span><h2 id="timeline-command-navigation-title">Choose the narrative horizon</h2></div>
        <p>{selectedArc ? `${selectedArc.title} is selected.` : 'The complete series architecture is selected.'}</p>
      </header>
      <nav className="timeline-workspace__arc-rail" aria-label="Timeline arc scope">
        <button type="button" className={arc === 'all' ? 'is-active' : ''} onClick={() => chooseArc('all')}><small>00</small><strong>Complete series</strong><span>{visibleArcCount} visible arcs</span></button>
        {arcs.map((item) => <button type="button" className={arc === item.id ? 'is-active' : ''} onClick={() => chooseArc(item.id)} key={item.id}><small>{String(item.order).padStart(2, '0')}</small><strong>{item.short}</strong><span>Ch. {item.chapters[0]}–{Math.min(item.chapters[1], spoilerLimit)}</span></button>)}
      </nav>
    </section>

    <div className="timeline-workspace__controls timeline-command__scope-deck">
      <nav aria-label="Timeline depth">
        {scopeOptions.map(([id, label]) => <button type="button" className={scope === id ? 'is-active' : ''} disabled={id === 'events' && arc !== 'succession-contest'} onClick={() => navigate({ scope: id })} key={id}>{id === 'events' ? <Layers3 size={14} aria-hidden="true" /> : <CalendarDays size={14} aria-hidden="true" />}{label}</button>)}
      </nav>
      {scope !== 'overview' && <label><Search size={15} aria-hidden="true" /><span className="sr-only">Search chronology</span><input value={query} onChange={(event) => setQuery(event.target.value)} onBlur={() => navigate({ search: query || undefined })} placeholder="Event, phase, place, person…" />{query && <button type="button" onClick={() => { setQuery(''); navigate({ search: undefined }); }}>Clear</button>}</label>}
    </div>

    {scope === 'overview' && <div className="timeline-workspace__overview timeline-command__arc-grid">
      {arcs.map((item) => {
        const blocks = seriesChronology.filter((record) => record.arcId === item.id && record.range[0] <= spoilerLimit);
        const available = item.chapters[0] <= spoilerLimit;
        return <article className={available ? '' : 'is-beyond-boundary'} key={item.id}>
          <header><span>Story {String(item.order).padStart(2, '0')}</span><h2>{item.title}</h2><p>{item.premise}</p></header>
          <dl><div><dt>Chapter span</dt><dd>{item.chapters[0]}–{Math.min(item.chapters[1], spoilerLimit)}</dd></div><div><dt>Timeline depth</dt><dd>{item.id === 'succession-contest' ? `${timelineEventCount} detailed events` : `${blocks.length} structural blocks`}</dd></div></dl>
          <button type="button" disabled={!available} onClick={() => chooseArc(item.id)}>Open {item.short} chronology <ArrowRight size={14} aria-hidden="true" /></button>
        </article>;
      })}
    </div>}

    {scope === 'arc' && <section className="timeline-workspace__ledger timeline-command__ledger" aria-labelledby="timeline-ledger-title">
      <header><div><span>{selectedArc ? `${selectedArc.title} · Chapters ${selectedArc.chapters[0]}–${Math.min(selectedArc.chapters[1], spoilerLimit)}` : 'Complete series sequence'}</span><h2 id="timeline-ledger-title">{selectedArc ? `${selectedArc.title} chronology` : 'Arc-by-arc chronology'}</h2></div><p>{selectedArc?.id === 'succession-contest' ? 'This structural view summarizes the current arc. Open Voyage intelligence for day, chapter, thread, place, and confidence filtering.' : 'These records preserve broad phase precision rather than inventing exact timestamps for earlier material.'}</p></header>
      <ol>{visibleBlocks.map((item) => <li key={item.id}><i>{String(item.order).padStart(2, '0')}</i><article><header><div><span>{item.arcTitle} · {item.chapters}</span><h3>{item.title}</h3></div><a href={item.source} target="_blank" rel="noreferrer">Source <ExternalLink size={11} aria-hidden="true" /></a></header><p>{item.summary}</p><dl><div><dt>Precision</dt><dd>{item.precision}</dd></div><div><dt>Anchor</dt><dd>{item.anchor}</dd></div><div><dt>Route</dt><dd>{item.route}</dd></div><div><dt>Consequence</dt><dd>{item.consequence}</dd></div></dl></article></li>)}</ol>
      {!visibleBlocks.length && <div className="timeline-workspace__empty"><h3>No chronology block matches.</h3><p>Clear the search or choose another arc.</p></div>}
      {arc === 'succession-contest' && <button className="timeline-workspace__detail-cta" type="button" onClick={() => navigate({ scope: 'events' })}>Open voyage intelligence <ArrowRight size={14} aria-hidden="true" /></button>}
    </section>}

    {scope === 'events' && arc === 'succession-contest' && <div className="timeline-workspace__events">
      <SuccessionTimeline spoilerLimit={spoilerLimit} initialQuery={requestedSearch} onOpenLocation={onOpenLocation} />
    </div>}
  </section>;
}
