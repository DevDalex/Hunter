import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleHelp,
  GitBranch,
  Layers3,
  Search,
  ShieldAlert,
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

const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const shortId = (value) => String(value || '').split(':').at(-1);

function StoryBack({ onBack }) {
  return <button type="button" className="succession-story-intel__back" onClick={onBack}><ArrowLeft size={15} /> Story overview</button>;
}

function PhaseDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Phase unavailable" description="This phase has not begun at the selected chapter boundary." action={<button type="button" onClick={onBack}>Back</button>} />;
  return <article className="succession-story-intel__dossier">
    <StoryBack onBack={onBack} />
    <header><span>Story phase · Chapters {dossier.profile.chapterRange.start}–{dossier.presentation.visibleChapterRange.end}</span><h2>{dossier.presentation.name}</h2><p>{dossier.presentation.summary}</p><dl><div><dt>Visible chapters</dt><dd>{dossier.chapters.length}</dd></div><div><dt>Events</dt><dd>{dossier.events.length}</dd></div><div><dt>Threads</dt><dd>{dossier.threads.length}</dd></div></dl></header>
    <section><div className="succession-story-intel__section-title"><Layers3 size={18} /><div><span>Parallel structure</span><h3>Lanes active in this phase</h3></div></div><div className="succession-story-intel__link-grid">{dossier.laneDossiers.map((laneDossier) => <button type="button" key={laneDossier.profile.id} onClick={() => onNavigate('story', { lane: shortId(laneDossier.profile.id) })}><b>{laneDossier.presentation.name}</b><span>{laneDossier.presentation.objective}</span></button>)}</div></section>
    <section><div className="succession-story-intel__section-title"><Activity size={18} /><div><span>Chronology</span><h3>Events available inside this phase</h3></div></div><div className="succession-story-intel__event-list">{dossier.events.map((event) => <article key={event.id}><span>Ch. {event.chapterRange.start}{event.chapterRange.end !== event.chapterRange.start ? `–${Math.min(event.chapterRange.end, dossier.chapter)}` : ''}</span><h4>{event.name}</h4><p>{event.summary}</p><button type="button" onClick={() => onNavigate('events', { entity: event.id })}>Open event</button></article>)}</div></section>
    {!!dossier.threads.length && <section><div className="succession-story-intel__section-title"><CircleHelp size={18} /><div><span>Questions</span><h3>Threads introduced or emphasized here</h3></div></div><div className="succession-story-intel__thread-list">{dossier.threads.map(({ profile, status }) => <button type="button" key={profile.id} onClick={() => onNavigate('story', { thread: shortId(profile.id) })}><span>{labelize(status)} · {labelize(profile.category)}</span><b>{profile.name}</b><p>{profile.question}</p></button>)}</div></section>}
    <section><div className="succession-story-intel__section-title"><BookOpen size={18} /><div><span>Evidence</span><h3>Phase sources available at Chapter {dossier.chapter}</h3></div></div><div className="succession-story-intel__sources">{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

function LaneDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Story lane unavailable" description="This plotline has not begun at the selected chapter boundary." action={<button type="button" onClick={onBack}>Back</button>} />;
  return <article className="succession-story-intel__dossier">
    <StoryBack onBack={onBack} />
    <header><span>Parallel story lane · From Chapter {dossier.profile.chapterRange.start}</span><h2>{dossier.presentation.name}</h2><p>{dossier.presentation.summary}</p><blockquote>{dossier.presentation.objective}</blockquote><dl><div><dt>Phases</dt><dd>{dossier.phases.length}</dd></div><div><dt>Events</dt><dd>{dossier.events.length}</dd></div><div><dt>Threads</dt><dd>{dossier.threads.length}</dd></div></dl></header>
    <section><div className="succession-story-intel__section-title"><Layers3 size={18} /><div><span>Arc movement</span><h3>Phase history</h3></div></div><div className="succession-story-intel__phase-strip">{dossier.phases.map((phase) => { const phaseDossier = getStoryPhaseDossier(phase.id, dossier.chapter); return <button type="button" key={phase.id} onClick={() => onNavigate('story', { phase: shortId(phase.id) })}><span>{phase.chapterRange.start}–{Math.min(phase.chapterRange.end, dossier.chapter)}</span><b>{phaseDossier?.presentation.name || 'Current phase'}</b></button>; })}</div></section>
    <section><div className="succession-story-intel__section-title"><Activity size={18} /><div><span>Operational chronology</span><h3>Lane events through Chapter {dossier.chapter}</h3></div></div><div className="succession-story-intel__event-list">{dossier.events.map((event) => <article key={event.id}><span>Ch. {event.chapterRange.start}</span><h4>{event.name}</h4><p>{event.summary}</p><button type="button" onClick={() => onNavigate('events', { entity: event.id })}>Open event</button></article>)}</div></section>
    {!!dossier.entities.length && <section><div className="succession-story-intel__section-title"><Waypoints size={18} /><div><span>Actors</span><h3>People visible in this lane</h3></div></div><div className="succession-story-intel__entities">{dossier.entities.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}
    <section><div className="succession-story-intel__section-title"><CircleHelp size={18} /><div><span>Unresolved pressure</span><h3>Open and resolved threads</h3></div></div><div className="succession-story-intel__thread-list">{dossier.threads.map(({ profile, status }) => <button type="button" key={profile.id} onClick={() => onNavigate('story', { thread: shortId(profile.id) })}><span>{labelize(status)} · Ch. {profile.chapterRange.start}+</span><b>{profile.name}</b><p>{profile.question}</p></button>)}</div></section>
  </article>;
}

function ThreadDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Story thread unavailable" description="This question has not opened at the selected chapter boundary." action={<button type="button" onClick={onBack}>Back</button>} />;
  const { profile } = dossier;
  return <article className="succession-story-intel__dossier is-thread">
    <StoryBack onBack={onBack} />
    <header><span>{labelize(dossier.status)} · {labelize(profile.category)} · From Chapter {profile.chapterRange.start}</span><h2>{profile.name}</h2><p>{profile.question}</p><blockquote>{dossier.evidenceState}</blockquote></header>
    {!!dossier.lanes.length && <section><div className="succession-story-intel__section-title"><Layers3 size={18} /><div><span>Story placement</span><h3>Connected plotlines</h3></div></div><div className="succession-story-intel__link-grid">{dossier.lanes.map((lane) => { const laneDossier = getStoryLaneDossier(lane.id, dossier.chapter); return <button type="button" key={lane.id} onClick={() => onNavigate('story', { lane: shortId(lane.id) })}><b>{laneDossier?.presentation.name || lane.name}</b><span>{laneDossier?.presentation.summary || 'Plotline available at this chapter.'}</span></button>; })}</div></section>}
    {!!dossier.events.length && <section><div className="succession-story-intel__section-title"><Activity size={18} /><div><span>Evidence events</span><h3>Events that define the question</h3></div></div><div className="succession-story-intel__event-list">{dossier.events.map((event) => <article key={event.id}><span>Ch. {event.chapterRange.start}</span><h4>{event.name}</h4><p>{event.summary}</p><button type="button" onClick={() => onNavigate('events', { entity: event.id })}>Open event</button></article>)}</div></section>}
    {!!dossier.entities.length && <section><div className="succession-story-intel__section-title"><Waypoints size={18} /><div><span>Subjects</span><h3>People and institutions</h3></div></div><div className="succession-story-intel__entities">{dossier.entities.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}
    <section><div className="succession-story-intel__section-title"><BookOpen size={18} /><div><span>Evidence</span><h3>Available source boundary</h3></div></div><div className="succession-story-intel__sources">{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

export default function SuccessionArchiveStoryIntelligenceWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [query, setQuery] = useState(routeParams.search || '');
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
  const openThreadPreview = snapshot?.openThreads.slice(-8).reverse() || [];
  const back = () => onNavigate('story');

  if (requestedPhase) return <PhaseDossier dossier={phaseDossier} onBack={back} onNavigate={onNavigate} />;
  if (requestedLane) return <LaneDossier dossier={laneDossier} onBack={back} onNavigate={onNavigate} />;
  if (requestedThread) return <ThreadDossier dossier={threadDossier} onBack={back} onNavigate={onNavigate} />;
  if (!snapshot) return <ArchiveState kind="empty" title="Story intelligence unavailable" description="No chapter snapshot exists inside this spoiler boundary." />;

  const openSearchResult = (result) => {
    if (result.kind === 'chapter') onNavigate('chapters', { chapter: result.record.number });
    else onNavigate('story', { [result.kind]: shortId(result.id) });
  };

  return <div className="succession-story-intel">
    <ArchivePageHeader
      kicker="Batch 4 · Chapter and story intelligence"
      title="The arc as phases, parallel plotlines, causal turns, and unresolved questions"
      description="The selected chapter controls which phases, abilities, actors, outcomes, and story questions are available. Pending imported chapters remain visibly unannotated rather than receiving invented summaries."
      meta={[
        { label: `Snapshot`, value: `Chapter ${snapshot.chapter}` },
        { label: 'Active lanes', value: snapshot.counts.lanes },
        { label: 'Open threads', value: snapshot.counts.openThreads },
        { label: 'Closure', value: closure.status },
      ]}
      actions={<button type="button" onClick={() => onNavigate('chapters', { chapter: snapshot.chapter })}><BookOpen size={15} /> Open chapter dossier</button>}
    />

    <section className="succession-story-intel__current"><div><span>{snapshot.phasePresentation?.name || 'Pending phase'} · Chapter {snapshot.chapter}</span><h2>{snapshot.phasePresentation?.summary || 'Detailed maintained story annotation is pending.'}</h2></div><dl><div><dt>Events visible</dt><dd>{snapshot.counts.events}</dd></div><div><dt>New here</dt><dd>{snapshot.counts.startingEvents}</dd></div><div><dt>Named appearances</dt><dd>{snapshot.counts.appearances}</dd></div></dl></section>

    <div className="succession-story-intel__search"><label><Search size={16} /><span className="sr-only">Search story intelligence</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Phase, plotline, question, chapter focus…" /></label>{query && <div>{searchResults.map((result) => <button type="button" key={`${result.kind}:${result.id}`} onClick={() => openSearchResult(result)}><span>{result.kind}</span><b>{result.displayName}</b><small>{result.displaySummary}</small></button>)}{!searchResults.length && <p>No story record is available inside Chapter {spoilerLimit}.</p>}</div>}</div>

    <section className="succession-story-intel__phases"><div className="succession-story-intel__section-title"><Layers3 size={19} /><div><span>Chronological architecture</span><h3>Contiguous phases from Chapter 340 to the current imported release</h3></div></div><div>{phaseDossiers.map((dossier) => <button type="button" className={snapshot.phase?.id === dossier.profile.id ? 'is-current' : ''} key={dossier.profile.id} onClick={() => onNavigate('story', { phase: shortId(dossier.profile.id) })}><span>{dossier.profile.chapterRange.start}–{dossier.presentation.visibleChapterRange.end}</span><h4>{dossier.presentation.name}</h4><p>{dossier.presentation.summary}</p><footer>{dossier.laneDossiers.length} lanes · {dossier.threads.length} visible threads <ArrowRight size={13} /></footer></button>)}</div></section>

    <section className="succession-story-intel__lanes"><div className="succession-story-intel__section-title"><Waypoints size={19} /><div><span>Parallel narrative</span><h3>{snapshot.laneDossiers.length} plotlines active at Chapter {snapshot.chapter}</h3></div></div><div>{snapshot.laneDossiers.map((dossier) => <button type="button" key={dossier.profile.id} onClick={() => onNavigate('story', { lane: shortId(dossier.profile.id) })}><span>From Ch. {dossier.profile.chapterRange.start}</span><h4>{dossier.presentation.name}</h4><p>{dossier.presentation.summary}</p><b>{dossier.presentation.objective}</b></button>)}</div></section>

    <div className="succession-story-intel__lower">
      <section><div className="succession-story-intel__section-title"><CircleHelp size={19} /><div><span>Open questions</span><h3>Current unresolved threads</h3></div></div><div className="succession-story-intel__thread-list">{openThreadPreview.map(({ profile, status }) => <button type="button" key={profile.id} onClick={() => onNavigate('story', { thread: shortId(profile.id) })}><span>{labelize(status)} · Ch. {profile.chapterRange.start}+</span><b>{profile.name}</b><p>{profile.question}</p></button>)}</div></section>
      <section><div className="succession-story-intel__section-title"><GitBranch size={19} /><div><span>Causal graph</span><h3>{causalGraph?.edges.length || 0} maintained event links</h3></div></div><div className="succession-story-intel__causal">{causalGraph?.edges.slice(-8).reverse().map((edge) => { const source = causalGraph.nodes.find((node) => node.id === edge.sourceEventId); const target = causalGraph.nodes.find((node) => node.id === edge.targetEventId); return <article key={edge.id}><span>{labelize(edge.relation)}</span><b>{source?.name}</b><ArrowRight size={14} /><b>{target?.name}</b><p>{edge.summary}</p></article>; })}</div></section>
    </div>

    {closure.pendingChapterIds.length > 0 && <section className="succession-story-intel__boundary"><ShieldAlert size={20} /><div><h3>Imported media and maintained story research remain separate</h3><p>{closure.pendingChapterIds.join(', ')} is available in the reader but still awaits verified scene annotation. Batch 4 preserves that gap instead of inferring events from an unreviewed release.</p></div></section>}
  </div>;
}
