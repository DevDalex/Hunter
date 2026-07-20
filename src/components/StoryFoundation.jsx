import { ArrowRight, BookOpen, ChevronRight, CircleDot, Layers3, ShieldCheck } from 'lucide-react';
import {
  storyDesignDirection,
  storyEntries,
} from '../../architecture/storyArchitecture.mjs';
import { routeToHref } from '../lib/appRouter';
import './StoryFoundation.css';
import './StoryFoundationLayout.css';

const entryById = new Map(storyEntries.map((entry) => [entry.id, entry]));
const utilityLabels = new Map([
  ['arcs', 'Story hub'],
  ['chronology', 'Pre-Succession chronology'],
  ['chapters', 'Chapter references'],
  ['adaptation', '2011 adaptation desk'],
]);

const destinationForEntry = (entry) => (
  entry.id === 'succession-contest'
    ? { view: 'succession', target: 'overview', params: {} }
    : { view: 'series', target: entry.id, params: {} }
);

const entryHref = (entry) => {
  const destination = destinationForEntry(entry);
  return routeToHref(destination.view, destination.target, destination.params);
};

const formatRange = (range, prefix) => {
  if (!Array.isArray(range)) return 'Supplemental';
  return `${prefix} ${range[0]}–${range[1]}`;
};

function navigateToEntry(event, entry, onNavigate) {
  event.preventDefault();
  const destination = destinationForEntry(entry);
  onNavigate(destination.view, destination.target, destination.params);
}

function StoryBreadcrumbs({ activeEntry, activeId, onNavigate }) {
  const label = activeEntry?.shortTitle || utilityLabels.get(activeId) || 'Story';
  return <nav className="story-breadcrumbs" aria-label="Story breadcrumbs">
    <button type="button" onClick={() => onNavigate('home')}>Home</button>
    <ChevronRight size={14} aria-hidden="true" />
    <button type="button" onClick={() => onNavigate('series')}>Story</button>
    {label !== 'Story hub' && <><ChevronRight size={14} aria-hidden="true" /><span>{label}</span></>}
  </nav>;
}

function StoryRouteStrip({ activeId, onNavigate, onPrefetch }) {
  const activeEntry = entryById.get(activeId);
  return <nav className="story-route-strip" aria-label="Chronological Story routes">
    <header>
      <span>Chronological routes</span>
      <strong>{activeEntry?.shortTitle || utilityLabels.get(activeId) || 'Story hub'}</strong>
    </header>
    <div className="story-route-strip__scroller">
      {storyEntries.map((entry) => {
        const active = entry.id === activeId;
        return <a
          href={entryHref(entry)}
          className={active ? 'is-active' : ''}
          aria-current={active ? 'page' : undefined}
          onPointerEnter={() => onPrefetch?.(entry.id === 'succession-contest' ? 'succession' : 'series', entry.id === 'succession-contest' ? 'overview' : entry.id)}
          onFocus={() => onPrefetch?.(entry.id === 'succession-contest' ? 'succession' : 'series', entry.id === 'succession-contest' ? 'overview' : entry.id)}
          onClick={(event) => navigateToEntry(event, entry, onNavigate)}
          key={entry.id}
        >
          <i>{String(entry.order).padStart(2, '0')}</i>
          <span>{entry.shortTitle}</span>
        </a>;
      })}
    </div>
  </nav>;
}

export function StoryArcFoundation({ activeId, onNavigate }) {
  const entry = entryById.get(activeId);
  if (!entry) return null;
  const previous = entry.previousId ? entryById.get(entry.previousId) : null;
  const next = entry.nextId ? entryById.get(entry.nextId) : null;
  return <section className="story-arc-foundation" aria-label={`${entry.shortTitle} Story foundation`}>
    <div className="story-arc-foundation__top">
      <div>
        <span className="section-kicker">{entry.type.replaceAll('-', ' ')}</span>
        <h2>{entry.title}</h2>
        <p>{entry.architectureNote}</p>
      </div>
      <div className="story-arc-foundation__actions">
        {previous && <a href={entryHref(previous)} onClick={(event) => navigateToEntry(event, previous, onNavigate)}>Previous <ArrowRight size={14} /></a>}
        {next && <a href={entryHref(next)} onClick={(event) => navigateToEntry(event, next, onNavigate)}>Next <ArrowRight size={14} /></a>}
      </div>
    </div>
    <dl className="story-arc-foundation__facts">
      <div><dt>Manga</dt><dd>{formatRange(entry.manga?.pageRange, 'Ch.')}</dd></div>
      <div><dt>2011 anime</dt><dd>{entry.anime2011 ? formatRange(entry.anime2011.pageRange, 'Ep.') : 'Unadapted'}</dd></div>
      <div><dt>Depth rule</dt><dd>{entry.pageDepth}</dd></div>
      <div><dt>Accent</dt><dd>{entry.accent.name}</dd></div>
    </dl>
  </section>;
}

export function StoryHubFoundation({ spoilerLimit, onNavigate }) {
  return <section className="story-hub-foundation" aria-labelledby="story-foundation-title">
    <div className="story-hub-foundation__hero">
      <div>
        <span className="section-kicker">The Black Archive · Story foundation</span>
        <h1 id="story-foundation-title">Story hub</h1>
        <p>Clean route-level Story pages are now organized as a chronological archive: prologue, completed pre-Succession arcs, and the ongoing Succession Contest archive. This foundation gives each destination room to become its own page without cutting off the existing research views.</p>
      </div>
      <aside aria-label="Story hub facts">
        <dl>
          <div><dt>Story destinations</dt><dd>{storyEntries.length}</dd></div>
          <div><dt>Prototype</dt><dd>Yorknew City</dd></div>
          <div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd></div>
        </dl>
      </aside>
    </div>

    <div className="story-hub-foundation__timeline" aria-label="Open a Story destination">
      {storyEntries.map((entry) => <a
        className={`story-hub-card${entry.id === storyDesignDirection.prototypeArcId ? ' is-prototype' : ''}${entry.id === 'succession-contest' ? ' is-archive' : ''}`}
        href={entryHref(entry)}
        onClick={(event) => navigateToEntry(event, entry, onNavigate)}
        key={entry.id}
      >
        <i>{String(entry.order).padStart(2, '0')}</i>
        <span>{entry.type.replaceAll('-', ' ')}</span>
        <h2>{entry.shortTitle}</h2>
        <p>{entry.architectureNote}</p>
        <footer>Open route <ArrowRight size={15} /></footer>
      </a>)}
    </div>

    <div className="story-foundation-note" aria-label="Story foundation rules">
      <article><span><BookOpen size={14} /> Manga-first</span><h3>Facts stay manga-led.</h3><p>The 2011 anime remains an adaptation layer, not a replacement for canonical ordering.</p></article>
      <article><span><Layers3 size={14} /> Page shell</span><h3>Shared structure first.</h3><p>Every arc receives context, chronology, characters, conflicts, Nen, aftermath, adaptation, and sources.</p></article>
      <article><span><ShieldCheck size={14} /> Scope guard</span><h3>Desktop foundation only.</h3><p>Mobile implementation stays deferred while the route and page foundations are stabilized.</p></article>
    </div>
  </section>;
}

export function ZoldyckStoryBridge({ onNavigate }) {
  const hunterExam = entryById.get('hunter-exam');
  return <section className="zoldyck-bridge" aria-labelledby="zoldyck-bridge-title">
    <div>
      <span>Editorial Story page · official Hunter Exam boundary</span>
      <h2 id="zoldyck-bridge-title">Zoldyck Family route established.</h2>
      <p>This destination now participates in the same Story foundation as every other route. Its dedicated rescue-mission page lands during the Early Arcs batch; until then, the maintained Hunter Exam material remains the source-backed coverage for Chapters 1–43.</p>
      <button type="button" onClick={() => onNavigate('series', 'hunter-exam')}>Open Hunter Exam <ArrowRight size={15} /></button>
    </div>
    <aside>
      <span>What this future page owns</span>
      <ul>
        <li>Kukuroo Mountain and the Testing Gate.</li>
        <li>Killua’s confinement and rescue route.</li>
        <li>Canary, Gotoh, the butlers, and family authority.</li>
        <li>The transition into Heavens Arena.</li>
      </ul>
      {hunterExam && <a href={entryHref(hunterExam)} onClick={(event) => navigateToEntry(event, hunterExam, onNavigate)}>Current official parent <CircleDot size={14} /></a>}
    </aside>
  </section>;
}

export default function StoryFoundationLayout({ activeId = 'arcs', onNavigate, onPrefetch, children }) {
  const activeEntry = entryById.get(activeId);
  return <section className="story-foundation story-foundation--wide" aria-label="Story archive layout">
    <StoryBreadcrumbs activeEntry={activeEntry} activeId={activeId} onNavigate={onNavigate} />
    <StoryRouteStrip activeId={activeId} onNavigate={onNavigate} onPrefetch={onPrefetch} />
    <div className="story-foundation__main">{children}</div>
  </section>;
}
