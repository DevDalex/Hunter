import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleHelp,
  FileSearch,
  GitBranch,
  Layers3,
  MapPin,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getChapterStoryDossier,
  getEntitiesByType,
  getEntityById,
  getStoryPhaseDossier,
} from '../../data/succession/successionData';
import {
  ArchivePageHeader,
  ArchiveState,
  EntityLink,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveChapterStoryWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const shortId = (value) => String(value || '').split(':').at(-1);
const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function EventCard({ event, mode, onNavigate }) {
  return <article><span>{mode} · Ch. {event.chapterRange.start}{event.chapterRange.end !== event.chapterRange.start ? `–${event.chapterRange.end}` : ''}</span><h4>{event.name}</h4><p>{event.summary}</p><button type="button" onClick={() => onNavigate('events', { entity: event.id })}>Open event</button></article>;
}

function CausalCard({ link, direction, onNavigate }) {
  const source = getEntityById(link.sourceEventId);
  const target = getEntityById(link.targetEventId);
  return <article><span>{direction} · {labelize(link.relation)}</span><div><button type="button" onClick={() => onNavigate('events', { entity: source?.id })}>{source?.name}</button><ArrowRight size={13} /><button type="button" onClick={() => onNavigate('events', { entity: target?.id })}>{target?.name}</button></div><p>{link.summary}</p></article>;
}

export default function SuccessionArchiveChapterStoryWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedNumber = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
  const chapters = useMemo(() => getEntitiesByType('chapter').filter((chapter) => chapter.number <= spoilerLimit).sort((left, right) => left.number - right.number), [spoilerLimit]);
  const fallbackNumber = chapters.at(-1)?.number || 340;
  const requestedAllowed = Number.isFinite(requestedNumber) && chapters.some((chapter) => chapter.number === requestedNumber);
  const [selectedNumber, setSelectedNumber] = useState(requestedAllowed ? requestedNumber : fallbackNumber);
  const [query, setQuery] = useState('');
  const [phaseId, setPhaseId] = useState('all');

  useEffect(() => {
    const next = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
    if (Number.isFinite(next) && chapters.some((chapter) => chapter.number === next)) {
      setSelectedNumber(next);
      return;
    }
    setSelectedNumber((current) => chapters.some((chapter) => chapter.number === current) ? current : fallbackNumber);
  }, [chapters, fallbackNumber, requestedEntity?.number, routeParams.chapter, routeParams.focus]);

  const phaseOptions = useMemo(() => [...new Set(chapters.flatMap((chapter) => chapter.storyPhaseIds || []))]
    .map((id) => getStoryPhaseDossier(id, spoilerLimit))
    .filter(Boolean), [chapters, spoilerLimit]);
  const visible = useMemo(() => chapters.filter((chapter) => {
    const phaseDossier = chapter.storyPhaseIds?.[0] ? getStoryPhaseDossier(chapter.storyPhaseIds[0], chapter.number) : null;
    const text = normalize([chapter.number, chapter.name, chapter.summary, chapter.voyageDay, phaseDossier?.presentation.name, phaseDossier?.presentation.summary, ...(chapter.lanes || []), ...(chapter.storyLaneIds || []), ...(chapter.storyThreadIds || [])].join(' '));
    return (phaseId === 'all' || chapter.storyPhaseIds?.includes(phaseId)) && (!query.trim() || text.includes(normalize(query)));
  }), [chapters, phaseId, query]);

  const boundedSelectedNumber = chapters.some((chapter) => chapter.number === selectedNumber) ? selectedNumber : fallbackNumber;
  const dossier = useMemo(() => getChapterStoryDossier(boundedSelectedNumber), [boundedSelectedNumber]);
  const selectedIndex = chapters.findIndex((chapter) => chapter.number === boundedSelectedNumber);
  const previous = chapters[selectedIndex - 1];
  const next = chapters[selectedIndex + 1];
  const openChapter = (number) => {
    if (!chapters.some((chapter) => chapter.number === number)) return;
    setSelectedNumber(number);
    onNavigate('chapters', { chapter: number });
  };

  if (!dossier) return <ArchiveState kind="empty" title="Chapter dossier unavailable" description="No canonical chapter record exists inside this spoiler boundary." />;
  const pending = dossier.chapter.storyIntelligenceStatus === 'Reader media indexed; detailed research pending verified chapter documentation';

  return <div className="succession-chapter-intel">
    <ArchivePageHeader
      kicker="Batch 4 · Canonical chapter dossiers"
      title="Every chapter placed inside phase, plotline, causality, and unresolved-story context"
      description="The chapter workspace is separate from the image reader. It explains what changes in the story while preserving pending research gaps and the selected spoiler boundary."
      meta={[
        { label: 'Visible chapters', value: chapters.length },
        { label: 'Phases', value: phaseOptions.length },
        { label: 'Selected', value: `Chapter ${dossier.chapter.number}` },
        { label: 'Open threads', value: dossier.openThreads.length },
      ]}
      actions={<button type="button" onClick={() => onNavigate('story')}><Layers3 size={15} /> Story intelligence</button>}
    />

    <div className="succession-chapter-intel__layout">
      <aside className="succession-chapter-intel__index">
        <label><Search size={16} /><span className="sr-only">Search chapter dossiers</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chapter, event, lane, question…" /></label>
        <select value={phaseId} onChange={(event) => setPhaseId(event.target.value)} aria-label="Filter chapter phase"><option value="all">All story phases</option>{phaseOptions.map((phaseDossier) => <option value={phaseDossier.profile.id} key={phaseDossier.profile.id}>{phaseDossier.presentation.name}</option>)}</select>
        <div>{visible.map((chapter) => { const phaseDossier = chapter.storyPhaseIds?.[0] ? getStoryPhaseDossier(chapter.storyPhaseIds[0], chapter.number) : null; return <button type="button" className={chapter.number === dossier.chapter.number ? 'is-active' : ''} onClick={() => openChapter(chapter.number)} key={chapter.id}><b>{chapter.number}</b><span><strong>{chapter.name.replace(/^Chapter \d+ ·?\s*/, '')}</strong><small>{phaseDossier?.presentation.name || 'Pending phase'} · {chapter.voyageDay}</small></span><ArrowRight size={13} /></button>; })}</div>
      </aside>

      <article className="succession-chapter-intel__dossier">
        <header><div><span>{dossier.phasePresentation?.name || 'Pending annotation'} · {dossier.chapter.voyageDay}</span><h2>{dossier.chapter.name}</h2><p>{dossier.research?.focus || dossier.chapter.summary}</p></div><button type="button" onClick={() => onNavigate('reader', { chapter: dossier.chapter.number })}>Read chapter <BookOpen size={14} /></button></header>

        {pending && <section className="succession-chapter-intel__pending"><ShieldAlert size={20} /><div><h3>Reader media imported; maintained scene research pending</h3><p>This chapter remains accessible in the reader, but Batch 4 does not infer events, locations, or story outcomes before verified annotation is added.</p></div></section>}

        {!!dossier.laneDossiers.length && <section><div className="succession-chapter-intel__section-title"><Layers3 size={18} /><div><span>Parallel narrative</span><h3>Story lanes active in this phase</h3></div></div><div className="succession-chapter-intel__lanes">{dossier.laneDossiers.map((laneDossier) => <button type="button" key={laneDossier.profile.id} onClick={() => onNavigate('story', { lane: shortId(laneDossier.profile.id) })}><b>{laneDossier.presentation.name}</b><span>{laneDossier.presentation.objective}</span></button>)}</div></section>}

        <div className="succession-chapter-intel__event-columns">
          <section><div className="succession-chapter-intel__section-title"><Activity size={18} /><div><span>Begins here</span><h3>New events and operations</h3></div></div><div className="succession-chapter-intel__events">{dossier.startingEvents.map((event) => <EventCard key={event.id} event={event} mode="Starts" onNavigate={onNavigate} />)}{!dossier.startingEvents.length && <p>No maintained event begins in this chapter.</p>}</div></section>
          <section><div className="succession-chapter-intel__section-title"><GitBranch size={18} /><div><span>Already moving</span><h3>Continuing operations</h3></div></div><div className="succession-chapter-intel__events">{dossier.continuingEvents.map((event) => <EventCard key={event.id} event={event} mode="Continues" onNavigate={onNavigate} />)}{!dossier.continuingEvents.length && <p>No multi-chapter operation is active here.</p>}</div></section>
        </div>

        {!!dossier.changes.length && <section><div className="succession-chapter-intel__section-title"><Sparkles size={18} /><div><span>State change</span><h3>What this chapter changes</h3></div></div><ul className="succession-chapter-intel__changes">{dossier.changes.map((change) => <li key={change}>{change}</li>)}</ul></section>}

        <section><div className="succession-chapter-intel__section-title"><CircleHelp size={18} /><div><span>Story pressure</span><h3>Questions open at Chapter {dossier.chapter.number}</h3></div></div><div className="succession-chapter-intel__threads">{dossier.threads.map(({ profile, status }) => <button type="button" className={status === 'resolved' ? 'is-resolved' : ''} key={profile.id} onClick={() => onNavigate('story', { thread: shortId(profile.id) })}><span>{labelize(status)} · {labelize(profile.category)}</span><b>{profile.name}</b><p>{profile.question}</p></button>)}{!dossier.threads.length && <p>No maintained thread projection is attached.</p>}</div></section>

        {(dossier.incomingCausalLinks.length > 0 || dossier.outgoingCausalLinks.length > 0) && <section><div className="succession-chapter-intel__section-title"><GitBranch size={18} /><div><span>Causal position</span><h3>What leads into and out of this chapter</h3></div></div><div className="succession-chapter-intel__causal">{dossier.incomingCausalLinks.map((link) => <CausalCard key={link.id} link={link} direction="Incoming" onNavigate={onNavigate} />)}{dossier.outgoingCausalLinks.map((link) => <CausalCard key={link.id} link={link} direction="Outgoing" onNavigate={onNavigate} />)}</div></section>}

        <div className="succession-chapter-intel__entity-columns">
          <section><div className="succession-chapter-intel__section-title"><Users size={18} /><div><span>Cast</span><h3>Structured appearances</h3></div></div><div>{dossier.appearances.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}{!dossier.appearances.length && <p>No structured appearance row is maintained.</p>}</div></section>
          <section><div className="succession-chapter-intel__section-title"><MapPin size={18} /><div><span>World state</span><h3>Locations and institutions</h3></div></div><div>{[...dossier.locations, ...dossier.organizations].map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}{!dossier.locations.length && !dossier.organizations.length && <p>No structured world-state row is maintained.</p>}</div></section>
        </div>

        {!!dossier.abilities.length && <section><div className="succession-chapter-intel__section-title"><Sparkles size={18} /><div><span>Nen knowledge</span><h3>Abilities linked at this chapter</h3></div></div><div className="succession-chapter-intel__entities">{dossier.abilities.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}

        <section><div className="succession-chapter-intel__section-title"><FileSearch size={18} /><div><span>Evidence</span><h3>Chapter-bounded sources</h3></div></div><div className="succession-chapter-intel__sources">{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>

        <footer><button type="button" disabled={!previous} onClick={() => previous && openChapter(previous.number)}><ArrowLeft size={14} /> {previous ? `Chapter ${previous.number}` : 'First record'}</button><button type="button" onClick={() => onNavigate('reader', { chapter: dossier.chapter.number })}>Reader bridge <BookOpen size={14} /></button><button type="button" disabled={!next} onClick={() => next && openChapter(next.number)}>{next ? `Chapter ${next.number}` : 'Latest record'} <ArrowRight size={14} /></button></footer>
      </article>
    </div>
  </div>;
}
