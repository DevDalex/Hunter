import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleHelp,
  GitBranch,
  Layers3,
  Network,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
  Waypoints,
} from 'lucide-react';
import {
  getStoryCausalGraphAtChapter,
  getStoryIntelligenceClosureReport,
  getStoryLaneDossier,
  getStoryPhaseDossier,
  getStorySnapshotAtChapter,
  getStoryThreadDossier,
  searchStoryIntelligence,
  successionArchiveData,
} from '../../data/succession/successionData';
import {
  ArchivePageHeader,
  ArchiveState,
  EntityLink,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveStoryIntelligenceWorkspace.css';
import './SuccessionArchiveStoryCommand.css';

const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const shortId = (value) => String(value || '').split(':').at(-1);
const rangeLabel = (range, boundary) => {
  if (!range?.start) return 'Unassigned';
  const end = Math.min(range.end ?? boundary ?? range.start, boundary ?? range.end ?? range.start);
  return range.start === end ? `Ch. ${range.start}` : `Ch. ${range.start}–${end}`;
};
const statusClass = (value) => String(value || 'unknown').toLowerCase().replaceAll(' ', '-');
const eventPosition = (event, boundary) => {
  const start = 340;
  const span = Math.max(1, boundary - start);
  return Math.min(100, Math.max(0, ((event.chapterRange.start - start) / span) * 100));
};

function StoryBack({ onBack }) {
  return <button type="button" className="succession-story-intel__back" onClick={onBack}><ArrowLeft size={15} aria-hidden="true" /> Story overview</button>;
}

function StoryEventCard({ event, boundary, onNavigate }) {
  return <article className="succession-story-command-event">
    <span>{rangeLabel(event.chapterRange, boundary)} · {labelize(event.category || 'event')}</span>
    <h4>{event.name}</h4>
    <p>{event.summary}</p>
    <dl>
      <div><dt>Participants</dt><dd>{event.participantIds?.length || 0}</dd></div>
      <div><dt>Locations</dt><dd>{event.locationIds?.length || 0}</dd></div>
      <div><dt>Consequences</dt><dd>{event.consequenceEventIds?.length || 0}</dd></div>
    </dl>
    <button type="button" onClick={() => onNavigate('events', { entity: event.id })}>Open event intelligence <ArrowRight size={13} aria-hidden="true" /></button>
  </article>;
}

function ThreadCard({ record, onNavigate }) {
  const { profile, status } = record;
  return <button type="button" className={`succession-story-command-thread is-${statusClass(status)}`} onClick={() => onNavigate('story', { thread: shortId(profile.id) })}>
    <span>{labelize(status)} · {labelize(profile.category)} · Ch. {profile.chapterRange.start}+</span>
    <h4>{profile.name}</h4>
    <p>{profile.question}</p>
    <footer><span>Open evidence record</span><ArrowRight size={13} aria-hidden="true" /></footer>
  </button>;
}

function PhaseDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Phase unavailable" description="This phase has not begun at the selected chapter boundary." action={<button type="button" onClick={onBack}>Back</button>} />;
  const visibleEnd = dossier.presentation.visibleChapterRange.end;
  const span = Math.max(1, visibleEnd - dossier.profile.chapterRange.start + 1);
  return <article className="succession-story-intel__dossier succession-story-command-dossier is-phase">
    <StoryBack onBack={onBack} />
    <header className="succession-story-command-dossier__hero">
      <div className="succession-story-command-dossier__range" aria-hidden="true"><span>{dossier.profile.chapterRange.start}</span><i>→</i><span>{visibleEnd}</span></div>
      <div><span>Story phase · {span} visible chapter{span === 1 ? '' : 's'}</span><h2>{dossier.presentation.name}</h2><p>{dossier.presentation.summary}</p></div>
      <dl><div><dt>Visible chapters</dt><dd>{dossier.chapters.length}</dd></div><div><dt>Events</dt><dd>{dossier.events.length}</dd></div><div><dt>Parallel lanes</dt><dd>{dossier.laneDossiers.length}</dd></div><div><dt>Threads</dt><dd>{dossier.threads.length}</dd></div></dl>
    </header>

    <section><div className="succession-story-intel__section-title"><Layers3 size={18} aria-hidden="true" /><div><span>Parallel structure</span><h3>Lanes active in this phase</h3></div></div><div className="succession-story-command-dossier__lanes">{dossier.laneDossiers.map((laneDossier, index) => <button type="button" key={laneDossier.profile.id} onClick={() => onNavigate('story', { lane: shortId(laneDossier.profile.id) })}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{laneDossier.presentation.name}</b><p>{laneDossier.presentation.objective}</p></div><ArrowRight size={14} aria-hidden="true" /></button>)}</div></section>

    <section><div className="succession-story-intel__section-title"><Activity size={18} aria-hidden="true" /><div><span>Chronology</span><h3>Events available inside this phase</h3></div></div><div className="succession-story-command-dossier__events">{dossier.events.map((event) => <StoryEventCard event={event} boundary={dossier.chapter} onNavigate={onNavigate} key={event.id} />)}</div></section>

    {!!dossier.threads.length && <section><div className="succession-story-intel__section-title"><CircleHelp size={18} aria-hidden="true" /><div><span>Questions</span><h3>Threads introduced or emphasized here</h3></div></div><div className="succession-story-command__thread-grid">{dossier.threads.map((record) => <ThreadCard record={record} onNavigate={onNavigate} key={record.profile.id} />)}</div></section>}

    <section><div className="succession-story-intel__section-title"><BookOpen size={18} aria-hidden="true" /><div><span>Evidence</span><h3>Phase sources available at Chapter {dossier.chapter}</h3></div></div><div className="succession-story-intel__sources">{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

function LaneDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Story lane unavailable" description="This plotline has not begun at the selected chapter boundary." action={<button type="button" onClick={onBack}>Back</button>} />;
  return <article className="succession-story-intel__dossier succession-story-command-dossier is-lane">
    <StoryBack onBack={onBack} />
    <header className="succession-story-command-dossier__hero">
      <div className="succession-story-command-dossier__sigil" aria-hidden="true"><Waypoints size={46} /><span>{dossier.events.length}</span><small>events</small></div>
      <div><span>Parallel story lane · From Chapter {dossier.profile.chapterRange.start}</span><h2>{dossier.presentation.name}</h2><p>{dossier.presentation.summary}</p><blockquote>{dossier.presentation.objective}</blockquote></div>
      <dl><div><dt>Phases</dt><dd>{dossier.phases.length}</dd></div><div><dt>Events</dt><dd>{dossier.events.length}</dd></div><div><dt>Actors</dt><dd>{dossier.entities.length}</dd></div><div><dt>Threads</dt><dd>{dossier.threads.length}</dd></div></dl>
    </header>

    <section><div className="succession-story-intel__section-title"><Layers3 size={18} aria-hidden="true" /><div><span>Arc movement</span><h3>Phase history</h3></div></div><div className="succession-story-command-dossier__phase-strip">{dossier.phases.map((phase, index) => { const phaseDossier = getStoryPhaseDossier(phase.id, dossier.chapter); return <button type="button" key={phase.id} onClick={() => onNavigate('story', { phase: shortId(phase.id) })}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{rangeLabel(phase.chapterRange, dossier.chapter)}</small><b>{phaseDossier?.presentation.name || 'Current phase'}</b></div><ArrowRight size={13} aria-hidden="true" /></button>; })}</div></section>

    <section><div className="succession-story-intel__section-title"><Activity size={18} aria-hidden="true" /><div><span>Operational chronology</span><h3>Lane events through Chapter {dossier.chapter}</h3></div></div><div className="succession-story-command-dossier__events">{dossier.events.map((event) => <StoryEventCard event={event} boundary={dossier.chapter} onNavigate={onNavigate} key={event.id} />)}</div></section>

    {!!dossier.entities.length && <section><div className="succession-story-intel__section-title"><Waypoints size={18} aria-hidden="true" /><div><span>Actors</span><h3>People visible in this lane</h3></div></div><div className="succession-story-intel__entities">{dossier.entities.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}

    <section><div className="succession-story-intel__section-title"><CircleHelp size={18} aria-hidden="true" /><div><span>Unresolved pressure</span><h3>Open and resolved threads</h3></div></div><div className="succession-story-command__thread-grid">{dossier.threads.map((record) => <ThreadCard record={record} onNavigate={onNavigate} key={record.profile.id} />)}</div></section>
  </article>;
}

function ThreadDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Story thread unavailable" description="This question has not opened at the selected chapter boundary." action={<button type="button" onClick={onBack}>Back</button>} />;
  const { profile } = dossier;
  return <article className="succession-story-intel__dossier succession-story-command-dossier is-thread">
    <StoryBack onBack={onBack} />
    <header className="succession-story-command-dossier__hero">
      <div className={`succession-story-command-dossier__thread-state is-${statusClass(dossier.status)}`}><CircleHelp size={42} aria-hidden="true" /><b>{labelize(dossier.status)}</b><small>{labelize(profile.category)}</small></div>
      <div><span>Story intelligence question · From Chapter {profile.chapterRange.start}</span><h2>{profile.name}</h2><p>{profile.question}</p><blockquote>{dossier.evidenceState}</blockquote></div>
      <dl><div><dt>Plotlines</dt><dd>{dossier.lanes.length}</dd></div><div><dt>Evidence events</dt><dd>{dossier.events.length}</dd></div><div><dt>Subjects</dt><dd>{dossier.entities.length}</dd></div><div><dt>Sources</dt><dd>{dossier.sources.length}</dd></div></dl>
    </header>

    {!!dossier.lanes.length && <section><div className="succession-story-intel__section-title"><Layers3 size={18} aria-hidden="true" /><div><span>Story placement</span><h3>Connected plotlines</h3></div></div><div className="succession-story-command-dossier__lanes">{dossier.lanes.map((lane, index) => { const laneDossier = getStoryLaneDossier(lane.id, dossier.chapter); return <button type="button" key={lane.id} onClick={() => onNavigate('story', { lane: shortId(lane.id) })}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{laneDossier?.presentation.name || lane.name}</b><p>{laneDossier?.presentation.summary || 'Plotline available at this chapter.'}</p></div><ArrowRight size={14} aria-hidden="true" /></button>; })}</div></section>}

    {!!dossier.events.length && <section><div className="succession-story-intel__section-title"><Activity size={18} aria-hidden="true" /><div><span>Evidence progression</span><h3>Events that define the question</h3></div></div><div className="succession-story-command-dossier__events">{dossier.events.map((event) => <StoryEventCard event={event} boundary={dossier.chapter} onNavigate={onNavigate} key={event.id} />)}</div></section>}

    {!!dossier.entities.length && <section><div className="succession-story-intel__section-title"><Waypoints size={18} aria-hidden="true" /><div><span>Subjects</span><h3>People and institutions</h3></div></div><div className="succession-story-intel__entities">{dossier.entities.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}

    <section><div className="succession-story-intel__section-title"><BookOpen size={18} aria-hidden="true" /><div><span>Evidence</span><h3>Available source boundary</h3></div></div><div className="succession-story-intel__sources">{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

export default function SuccessionArchiveStoryIntelligenceWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [query, setQuery] = useState(routeParams.search || '');
  const [laneFocus, setLaneFocus] = useState('all');
  const requestedPhase = routeParams.phase ? `story-phase:${routeParams.phase}` : null;
  const requestedLane = routeParams.lane ? `story-lane:${routeParams.lane}` : null;
  const requestedThread = routeParams.thread ? `story-thread:${routeParams.thread}` : null;
  const snapshot = useMemo(() => getStorySnapshotAtChapter(spoilerLimit), [spoilerLimit]);
  const closure = useMemo(() => getStoryIntelligenceClosureReport(), []);
  const phaseDossier = requestedPhase ? getStoryPhaseDossier(requestedPhase, spoilerLimit) : null;
  const laneDossier = requestedLane ? getStoryLaneDossier(requestedLane, spoilerLimit) : null;
  const threadDossier = requestedThread ? getStoryThreadDossier(requestedThread, spoilerLimit) : null;
  const causalGraph = useMemo(() => getStoryCausalGraphAtChapter(spoilerLimit), [spoilerLimit]);
  const searchResults = useMemo(() => query.trim() ? searchStoryIntelligence(query, { chapter: spoilerLimit, limit: 24 }) : [], [query, spoilerLimit]);
  const phaseDossiers = useMemo(() => Object.values(successionArchiveData.storyPhaseProfiles || {})
    .filter((phase) => phase.chapterRange.start <= spoilerLimit)
    .map((phase) => getStoryPhaseDossier(phase.id, spoilerLimit))
    .filter(Boolean), [spoilerLimit]);
  const openThreadPreview = snapshot?.openThreads.slice(-10).reverse() || [];
  const visibleLaneDossiers = useMemo(() => laneFocus === 'all'
    ? snapshot?.laneDossiers || []
    : (snapshot?.laneDossiers || []).filter((dossier) => dossier.profile.id === laneFocus), [laneFocus, snapshot?.laneDossiers]);
  const causalEdges = causalGraph?.edges.slice(-12).reverse() || [];
  const back = () => onNavigate('story');

  if (requestedPhase) return <PhaseDossier dossier={phaseDossier} onBack={back} onNavigate={onNavigate} />;
  if (requestedLane) return <LaneDossier dossier={laneDossier} onBack={back} onNavigate={onNavigate} />;
  if (requestedThread) return <ThreadDossier dossier={threadDossier} onBack={back} onNavigate={onNavigate} />;
  if (!snapshot) return <ArchiveState kind="empty" title="Story intelligence unavailable" description="No chapter snapshot exists inside this spoiler boundary." />;

  const openSearchResult = (result) => {
    if (result.kind === 'chapter') onNavigate('chapters', { chapter: result.record.number });
    else onNavigate('story', { [result.kind]: shortId(result.id) });
  };

  return <div className="succession-story-intel succession-story-command">
    <ArchivePageHeader
      kicker="Batch 4 · Chapter and story intelligence"
      title="The arc as phases, parallel plotlines, causal turns, and unresolved questions"
      description="The selected chapter controls which phases, abilities, actors, outcomes, and story questions are available. Pending imported chapters remain visibly unannotated rather than receiving invented summaries."
      meta={[
        { label: 'Snapshot', value: `Chapter ${snapshot.chapter}` },
        { label: 'Active lanes', value: snapshot.counts.lanes },
        { label: 'Open threads', value: snapshot.counts.openThreads },
        { label: 'Closure', value: closure.status },
      ]}
      actions={<button type="button" onClick={() => onNavigate('chapters', { chapter: snapshot.chapter })}><BookOpen size={15} aria-hidden="true" /> Open chapter dossier</button>}
    />

    <section className="succession-story-command__hero">
      <div><span><Radar size={16} aria-hidden="true" /> Narrative intelligence command</span><h2>{snapshot.phasePresentation?.name || 'Pending phase'}</h2><p>{snapshot.phasePresentation?.summary || 'Detailed maintained story annotation is pending.'}</p><div><button type="button" onClick={() => snapshot.phase?.id && onNavigate('story', { phase: shortId(snapshot.phase.id) })}>Open current phase <ArrowRight size={13} aria-hidden="true" /></button><button type="button" onClick={() => onNavigate('chapters', { chapter: snapshot.chapter })}>Chapter {snapshot.chapter} dossier <BookOpen size={13} aria-hidden="true" /></button></div></div>
      <div className="succession-story-command__signal" aria-hidden="true"><span>{snapshot.chapter}</span><small>authorized snapshot</small><i /><i /><i /><i /></div>
    </section>

    <dl className="succession-story-command__metrics">
      <div><dt>Story phases</dt><dd>{phaseDossiers.length}</dd></div>
      <div><dt>Active lanes</dt><dd>{snapshot.counts.lanes}</dd></div>
      <div><dt>Visible events</dt><dd>{snapshot.counts.events}</dd></div>
      <div><dt>Open threads</dt><dd>{snapshot.counts.openThreads}</dd></div>
      <div><dt>Causal links</dt><dd>{causalGraph?.edges.length || 0}</dd></div>
    </dl>

    <section className="succession-story-command__search" aria-label="Search Story intelligence">
      <label><Search size={17} aria-hidden="true" /><span className="sr-only">Search story intelligence</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Phase, plotline, question, event, chapter focus…" /></label>
      <div><span>Search boundary</span><b>Chapter {spoilerLimit}</b><small>Future records remain excluded.</small></div>
      {query && <div className="succession-story-command__search-results">{searchResults.map((result) => <button type="button" key={`${result.kind}:${result.id}`} onClick={() => openSearchResult(result)}><span>{result.kind}</span><b>{result.displayName}</b><small>{result.displaySummary}</small><ArrowRight size={13} aria-hidden="true" /></button>)}{!searchResults.length && <p>No Story record is available inside Chapter {spoilerLimit}.</p>}</div>}
    </section>

    <section className="succession-story-command__phases">
      <div className="succession-story-intel__section-title"><Layers3 size={19} aria-hidden="true" /><div><span>Chronological architecture</span><h3>Contiguous phases from Chapter 340 to the current imported release</h3></div></div>
      <div className="succession-story-command__phase-axis" aria-hidden="true"><span>340</span><i /><span>{snapshot.chapter}</span></div>
      <div className="succession-story-command__phase-grid">{phaseDossiers.map((dossier, index) => {
        const current = snapshot.phase?.id === dossier.profile.id;
        const span = Math.max(1, dossier.presentation.visibleChapterRange.end - dossier.profile.chapterRange.start + 1);
        return <button type="button" className={current ? 'is-current' : ''} key={dossier.profile.id} onClick={() => onNavigate('story', { phase: shortId(dossier.profile.id) })}>
          <span className="succession-story-command__phase-number">{String(index + 1).padStart(2, '0')}</span>
          <div><span>{dossier.profile.chapterRange.start}–{dossier.presentation.visibleChapterRange.end} · {span} chapters</span><h4>{dossier.presentation.name}</h4><p>{dossier.presentation.summary}</p></div>
          <dl><div><dt>Lanes</dt><dd>{dossier.laneDossiers.length}</dd></div><div><dt>Events</dt><dd>{dossier.events.length}</dd></div><div><dt>Threads</dt><dd>{dossier.threads.length}</dd></div></dl>
          <footer>{current ? 'Current phase' : 'Open phase dossier'} <ArrowRight size={13} aria-hidden="true" /></footer>
        </button>;
      })}</div>
    </section>

    <section className="succession-story-command__lanes">
      <header><div className="succession-story-intel__section-title"><Waypoints size={19} aria-hidden="true" /><div><span>Parallel narrative</span><h3>{snapshot.laneDossiers.length} synchronized plotlines at Chapter {snapshot.chapter}</h3></div></div><label><span>Focus lane</span><select value={laneFocus} onChange={(event) => setLaneFocus(event.target.value)}><option value="all">All active lanes</option>{snapshot.laneDossiers.map((dossier) => <option value={dossier.profile.id} key={dossier.profile.id}>{dossier.presentation.name}</option>)}</select></label></header>
      <div className="succession-story-command__lane-axis" aria-hidden="true"><span>Chapter 340</span><i /><span>Chapter {snapshot.chapter}</span></div>
      <div className="succession-story-command__swimlanes">{visibleLaneDossiers.map((dossier, laneIndex) => <article key={dossier.profile.id}>
        <button type="button" className="succession-story-command__lane-label" onClick={() => onNavigate('story', { lane: shortId(dossier.profile.id) })}><span>{String(laneIndex + 1).padStart(2, '0')}</span><div><h4>{dossier.presentation.name}</h4><p>{dossier.presentation.objective}</p></div><ArrowRight size={14} aria-hidden="true" /></button>
        <div className="succession-story-command__lane-track" aria-label={`${dossier.presentation.name} event timeline`}>{dossier.events.map((event) => <button type="button" style={{ '--story-event-position': `${eventPosition(event, snapshot.chapter)}%` }} title={`${event.name} · ${rangeLabel(event.chapterRange, snapshot.chapter)}`} aria-label={`${event.name}, ${rangeLabel(event.chapterRange, snapshot.chapter)}`} onClick={() => onNavigate('events', { entity: event.id })} key={event.id}><i /><span>{event.name}</span></button>)}{!dossier.events.length && <p>No maintained events in this lane at the selected chapter.</p>}</div>
      </article>)}</div>
    </section>

    <section className="succession-story-command__threads">
      <div className="succession-story-intel__section-title"><CircleHelp size={19} aria-hidden="true" /><div><span>Open questions</span><h3>Current unresolved Story pressure</h3></div></div>
      <div className="succession-story-command__thread-grid">{openThreadPreview.map((record) => <ThreadCard record={record} onNavigate={onNavigate} key={record.profile.id} />)}</div>
    </section>

    <section className="succession-story-command__causal">
      <div className="succession-story-intel__section-title"><GitBranch size={19} aria-hidden="true" /><div><span>Causal graph</span><h3>{causalGraph?.edges.length || 0} maintained event relationships</h3></div></div>
      <div className="succession-story-command__causal-river">{causalEdges.map((edge, index) => {
        const source = causalGraph.nodes.find((node) => node.id === edge.sourceEventId);
        const target = causalGraph.nodes.find((node) => node.id === edge.targetEventId);
        return <article key={edge.id}>
          <span className="succession-story-command__causal-index">{String(index + 1).padStart(2, '0')}</span>
          <button type="button" onClick={() => source && onNavigate('events', { entity: source.id })}>{source?.name || 'Unresolved source'}</button>
          <div><span>{labelize(edge.relation)}</span><i /><ArrowRight size={16} aria-hidden="true" /></div>
          <button type="button" onClick={() => target && onNavigate('events', { entity: target.id })}>{target?.name || 'Unresolved consequence'}</button>
          <p>{edge.summary}</p>
        </article>;
      })}</div>
      {!causalEdges.length && <ArchiveState kind="empty" title="No causal links inside this boundary" description="Maintained cause-and-consequence relationships will appear when their supporting events are available." />}
    </section>

    {closure.pendingChapterIds.length > 0 && <section className="succession-story-intel__boundary succession-story-command__boundary"><ShieldAlert size={20} aria-hidden="true" /><div><h3>Imported media and maintained Story research remain separate</h3><p>{closure.pendingChapterIds.join(', ')} is available in the Reader but still awaits verified scene annotation. Batch 4 preserves that gap instead of inferring events from an unreviewed release.</p></div></section>}
  </div>;
}
