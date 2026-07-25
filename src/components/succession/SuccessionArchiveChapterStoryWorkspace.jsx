import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleHelp,
  Clock3,
  Eye,
  FileSearch,
  Filter,
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
import './SuccessionArchiveChapterCommand.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const shortId = (value) => String(value || '').split(':').at(-1);
const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const chapterResearchState = (chapter) => {
  const value = normalize(chapter.storyIntelligenceStatus);
  if (value.includes('pending')) return 'pending';
  if (value.includes('partial') || value.includes('limited')) return 'partial';
  return 'documented';
};
const chapterRangeLabel = (range) => {
  if (!range?.start) return 'Unassigned';
  const end = range.end ?? range.start;
  return range.start === end ? `Ch. ${range.start}` : `Ch. ${range.start}–${end}`;
};

function EventCard({ event, mode, onNavigate }) {
  const participantCount = event.participantIds?.length || 0;
  const consequenceCount = event.consequenceEventIds?.length || 0;
  const locationCount = event.locationIds?.length || 0;
  return <article className={`succession-chapter-sequence-card is-${normalize(mode).replaceAll(' ', '-')}`}>
    <div className="succession-chapter-sequence-card__topline">
      <span>{mode}</span>
      <em>{chapterRangeLabel(event.chapterRange)}</em>
    </div>
    <h4>{event.name}</h4>
    <p>{event.summary}</p>
    <dl>
      <div><dt>Category</dt><dd>{labelize(event.category || 'event')}</dd></div>
      <div><dt>Participants</dt><dd>{participantCount}</dd></div>
      <div><dt>Locations</dt><dd>{locationCount}</dd></div>
      <div><dt>Consequences</dt><dd>{consequenceCount}</dd></div>
    </dl>
    <button type="button" onClick={() => onNavigate('events', { entity: event.id })}>Open event intelligence <ArrowRight size={13} aria-hidden="true" /></button>
  </article>;
}

function CausalCard({ link, direction, onNavigate }) {
  const source = getEntityById(link.sourceEventId);
  const target = getEntityById(link.targetEventId);
  return <article>
    <span>{direction} · {labelize(link.relation)}</span>
    <div>
      <button type="button" onClick={() => source && onNavigate('events', { entity: source.id })}>{source?.name || 'Unresolved source event'}</button>
      <ArrowRight size={13} aria-hidden="true" />
      <button type="button" onClick={() => target && onNavigate('events', { entity: target.id })}>{target?.name || 'Unresolved target event'}</button>
    </div>
    <p>{link.summary}</p>
  </article>;
}

function ChapterDirectoryCard({ record, selected, onOpen }) {
  const { chapter, phaseDossier, dossier, researchState } = record;
  const eventCount = (dossier?.startingEvents?.length || 0) + (dossier?.continuingEvents?.length || 0);
  const threadCount = dossier?.openThreads?.length || dossier?.threads?.filter((thread) => thread.status !== 'resolved').length || 0;
  return <button
    type="button"
    className={`succession-chapter-command__card is-${researchState}${selected ? ' is-selected' : ''}`}
    aria-current={selected ? 'page' : undefined}
    onClick={() => onOpen(chapter.number)}
  >
    <span className="succession-chapter-command__number">{chapter.number}</span>
    <div>
      <span>{phaseDossier?.presentation.name || 'Pending phase'} · {chapter.voyageDay || 'Voyage day unresolved'}</span>
      <h3>{chapter.name.replace(/^Chapter \d+ ·?\s*/, '') || chapter.name}</h3>
      <p>{chapter.summary}</p>
      <dl>
        <div><dt>Events</dt><dd>{eventCount}</dd></div>
        <div><dt>Cast</dt><dd>{dossier?.appearances?.length || 0}</dd></div>
        <div><dt>Threads</dt><dd>{threadCount}</dd></div>
      </dl>
    </div>
    <em>{labelize(researchState)}</em>
  </button>;
}

export default function SuccessionArchiveChapterStoryWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedNumber = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
  const chapters = useMemo(() => getEntitiesByType('chapter')
    .filter((chapter) => chapter.number <= spoilerLimit)
    .sort((left, right) => left.number - right.number), [spoilerLimit]);
  const fallbackNumber = chapters.at(-1)?.number || 340;
  const requestedAllowed = Number.isFinite(requestedNumber) && chapters.some((chapter) => chapter.number === requestedNumber);
  const [selectedNumber, setSelectedNumber] = useState(requestedAllowed ? requestedNumber : fallbackNumber);
  const [query, setQuery] = useState('');
  const [phaseId, setPhaseId] = useState('all');
  const [researchState, setResearchState] = useState('all');
  const [directoryMode, setDirectoryMode] = useState('cards');

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

  const records = useMemo(() => chapters.map((chapter) => {
    const phaseDossier = chapter.storyPhaseIds?.[0] ? getStoryPhaseDossier(chapter.storyPhaseIds[0], chapter.number) : null;
    return {
      chapter,
      phaseDossier,
      dossier: getChapterStoryDossier(chapter.number),
      researchState: chapterResearchState(chapter),
    };
  }), [chapters]);

  const visible = useMemo(() => records.filter(({ chapter, phaseDossier, dossier, researchState: recordState }) => {
    const text = normalize([
      chapter.number,
      chapter.name,
      chapter.summary,
      chapter.voyageDay,
      chapter.storyIntelligenceStatus,
      phaseDossier?.presentation.name,
      phaseDossier?.presentation.summary,
      ...(chapter.lanes || []),
      ...(chapter.storyLaneIds || []),
      ...(chapter.storyThreadIds || []),
      ...(dossier?.changes || []),
      ...(dossier?.startingEvents || []).map((event) => event.name),
      ...(dossier?.continuingEvents || []).map((event) => event.name),
    ].join(' '));
    return (phaseId === 'all' || chapter.storyPhaseIds?.includes(phaseId))
      && (researchState === 'all' || recordState === researchState)
      && (!query.trim() || text.includes(normalize(query)));
  }), [phaseId, query, records, researchState]);

  const metrics = useMemo(() => ({
    documented: records.filter((record) => record.researchState === 'documented').length,
    partial: records.filter((record) => record.researchState === 'partial').length,
    pending: records.filter((record) => record.researchState === 'pending').length,
    lanes: new Set(chapters.flatMap((chapter) => chapter.storyLaneIds || [])).size,
  }), [chapters, records]);

  const boundedSelectedNumber = chapters.some((chapter) => chapter.number === selectedNumber) ? selectedNumber : fallbackNumber;
  const dossier = useMemo(() => getChapterStoryDossier(boundedSelectedNumber), [boundedSelectedNumber]);
  const selectedRecord = records.find((record) => record.chapter.number === boundedSelectedNumber);
  const selectedIndex = chapters.findIndex((chapter) => chapter.number === boundedSelectedNumber);
  const previous = chapters[selectedIndex - 1];
  const next = chapters[selectedIndex + 1];

  const openChapter = (number) => {
    if (!chapters.some((chapter) => chapter.number === number)) return;
    setSelectedNumber(number);
    onNavigate('chapters', { chapter: number });
  };

  const resetDirectory = () => {
    setQuery('');
    setPhaseId('all');
    setResearchState('all');
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!dossier) return <ArchiveState kind="empty" title="Chapter dossier unavailable" description="No canonical chapter record exists inside this spoiler boundary." />;

  const pending = dossier.chapter.storyIntelligenceStatus === 'Reader media indexed; detailed research pending verified chapter documentation';
  const phaseStart = selectedRecord?.phaseDossier?.profile.chapterRange.start || dossier.chapter.number;
  const phaseEnd = selectedRecord?.phaseDossier?.presentation.visibleChapterRange.end || dossier.chapter.number;
  const phaseSpan = Math.max(1, phaseEnd - phaseStart + 1);
  const phasePosition = Math.min(phaseSpan, Math.max(1, dossier.chapter.number - phaseStart + 1));
  const phaseProgress = Math.round(phasePosition / phaseSpan * 100);
  const eventCount = dossier.startingEvents.length + dossier.continuingEvents.length;
  const unresolvedThreadCount = dossier.threads.filter(({ status }) => status !== 'resolved').length;
  const activeFilterCount = [query, phaseId !== 'all', researchState !== 'all'].filter(Boolean).length;

  return <div className="succession-chapter-intel succession-chapter-command">
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
      actions={<button type="button" onClick={() => onNavigate('story')}><Layers3 size={15} aria-hidden="true" /> Story intelligence</button>}
    />

    <section className="succession-chapter-command__hero">
      <div>
        <span><FileSearch size={16} aria-hidden="true" /> Chapter intelligence command</span>
        <h2>Read the arc as a verified sequence of phases, operations, consequences, and unanswered pressure</h2>
        <p>Directory state, chapter research, event movement, Story lanes, and source evidence remain synchronized to the authorized Chapter {spoilerLimit} boundary.</p>
      </div>
      <div className="succession-chapter-command__radar" aria-hidden="true">
        <strong>{dossier.chapter.number}</strong>
        <span>selected record</span>
        <i /><i /><i />
      </div>
    </section>

    <dl className="succession-chapter-command__status">
      <div><dt>Imported records</dt><dd>{records.length}</dd></div>
      <div><dt>Documented</dt><dd>{metrics.documented}</dd></div>
      <div><dt>Partial</dt><dd>{metrics.partial}</dd></div>
      <div><dt>Research pending</dt><dd>{metrics.pending}</dd></div>
      <div><dt>Story lanes</dt><dd>{metrics.lanes}</dd></div>
    </dl>

    <section className="succession-chapter-command__controls" aria-labelledby="succession-chapter-directory-title">
      <header>
        <div><span><Filter size={15} aria-hidden="true" /> Chapter directory</span><h2 id="succession-chapter-directory-title">{visible.length} of {records.length} records visible</h2></div>
        <div role="group" aria-label="Chapter directory layout">
          <button type="button" className={directoryMode === 'cards' ? 'is-active' : ''} aria-pressed={directoryMode === 'cards'} onClick={() => setDirectoryMode('cards')}><Layers3 size={14} aria-hidden="true" /> Intelligence cards</button>
          <button type="button" className={directoryMode === 'index' ? 'is-active' : ''} aria-pressed={directoryMode === 'index'} onClick={() => setDirectoryMode('index')}><FileSearch size={14} aria-hidden="true" /> Compact index</button>
        </div>
      </header>
      <div className="succession-chapter-command__filters">
        <label><Search size={16} aria-hidden="true" /><span className="sr-only">Search chapter dossiers</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chapter, event, lane, character, question…" /></label>
        <label><span>Story phase</span><select value={phaseId} onChange={(event) => setPhaseId(event.target.value)}><option value="all">All story phases</option>{phaseOptions.map((phaseDossier) => <option value={phaseDossier.profile.id} key={phaseDossier.profile.id}>{phaseDossier.presentation.name}</option>)}</select></label>
        <label><span>Research state</span><select value={researchState} onChange={(event) => setResearchState(event.target.value)}><option value="all">All research states</option><option value="documented">Documented</option><option value="partial">Partial</option><option value="pending">Research pending</option></select></label>
      </div>
      <footer>
        <span role="status" aria-live="polite">{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'} · Chapter boundary {spoilerLimit}</span>
        <button type="button" disabled={!activeFilterCount} onClick={resetDirectory}>Reset directory</button>
      </footer>
    </section>

    {directoryMode === 'cards'
      ? <section className="succession-chapter-command__grid" aria-label="Canonical chapter intelligence directory">
        {visible.map((record) => <ChapterDirectoryCard record={record} selected={record.chapter.number === dossier.chapter.number} onOpen={openChapter} key={record.chapter.id} />)}
      </section>
      : <section className="succession-chapter-command__index" aria-label="Compact chapter intelligence index">
        <div className="succession-chapter-command__index-head"><span>Chapter</span><span>Phase and title</span><span>Research</span><span>Events</span><span>Threads</span></div>
        {visible.map((record) => <button type="button" className={record.chapter.number === dossier.chapter.number ? 'is-active' : ''} onClick={() => openChapter(record.chapter.number)} key={record.chapter.id}>
          <b>{record.chapter.number}</b>
          <span><strong>{record.chapter.name.replace(/^Chapter \d+ ·?\s*/, '')}</strong><small>{record.phaseDossier?.presentation.name || 'Pending phase'} · {record.chapter.voyageDay}</small></span>
          <em>{labelize(record.researchState)}</em>
          <i>{(record.dossier?.startingEvents?.length || 0) + (record.dossier?.continuingEvents?.length || 0)}</i>
          <i>{record.dossier?.openThreads?.length || 0}</i>
        </button>)}
      </section>}

    {!visible.length && <ArchiveState kind="empty" title="No chapter records match these filters" description="Clear the chapter query or broaden the phase and research-state filters." action={<button type="button" onClick={resetDirectory}>Reset chapter directory</button>} />}

    <div className="succession-chapter-intel__layout">
      <aside className="succession-chapter-intel__index succession-chapter-command__rail">
        <div className="succession-chapter-command__rail-header">
          <span>Selected record</span>
          <b>Chapter {dossier.chapter.number}</b>
          <small>{dossier.phasePresentation?.name || 'Pending phase'} · {dossier.chapter.voyageDay}</small>
        </div>
        <nav aria-label="Chapter dossier sections">
          <button type="button" onClick={() => scrollToSection('chapter-dossier-overview')}><Eye size={15} aria-hidden="true" /> Overview</button>
          <button type="button" onClick={() => scrollToSection('chapter-dossier-sequence')}><Activity size={15} aria-hidden="true" /> Event sequence</button>
          <button type="button" onClick={() => scrollToSection('chapter-dossier-pressure')}><CircleHelp size={15} aria-hidden="true" /> Story pressure</button>
          <button type="button" onClick={() => scrollToSection('chapter-dossier-evidence')}><FileSearch size={15} aria-hidden="true" /> Evidence</button>
        </nav>
        <dl>
          <div><dt>Events</dt><dd>{eventCount}</dd></div>
          <div><dt>State changes</dt><dd>{dossier.changes.length}</dd></div>
          <div><dt>Named cast</dt><dd>{dossier.appearances.length}</dd></div>
          <div><dt>Sources</dt><dd>{dossier.sources.length}</dd></div>
        </dl>
        <button type="button" onClick={() => onNavigate('reader', { chapter: dossier.chapter.number })}><BookOpen size={15} aria-hidden="true" /> Open reader</button>
      </aside>

      <article className="succession-chapter-intel__dossier">
        <header id="chapter-dossier-overview" className="succession-chapter-dossier__hero">
          <div className="succession-chapter-dossier__identity">
            <strong aria-hidden="true">{dossier.chapter.number}</strong>
            <div>
              <span>{dossier.phasePresentation?.name || 'Pending annotation'} · {dossier.chapter.voyageDay}</span>
              <h2>{dossier.chapter.name}</h2>
              <p>{dossier.research?.focus || dossier.chapter.summary}</p>
              <div className="succession-chapter-dossier__actions">
                <button type="button" onClick={() => onNavigate('reader', { chapter: dossier.chapter.number })}>Read chapter <BookOpen size={14} aria-hidden="true" /></button>
                <button type="button" onClick={() => onNavigate('story', { phase: shortId(selectedRecord?.phaseDossier?.profile.id) })}>Open phase <Layers3 size={14} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
          <dl>
            <div><dt>Research state</dt><dd>{labelize(selectedRecord?.researchState || 'pending')}</dd></div>
            <div><dt>Events visible</dt><dd>{eventCount}</dd></div>
            <div><dt>Open pressure</dt><dd>{unresolvedThreadCount}</dd></div>
            <div><dt>Evidence</dt><dd>{dossier.sources.length} sources</dd></div>
          </dl>
        </header>

        <section className="succession-chapter-dossier__phase" aria-label="Chapter position inside current Story phase">
          <div><span><Clock3 size={15} aria-hidden="true" /> Phase position</span><b>{dossier.phasePresentation?.name || 'Pending phase'}</b><small>Chapter {phasePosition} of {phaseSpan} inside the visible phase boundary</small></div>
          <div className="succession-chapter-dossier__phase-meter" role="progressbar" aria-label="Progress through current Story phase" aria-valuemin="0" aria-valuemax="100" aria-valuenow={phaseProgress}><i style={{ '--phase-progress': `${phaseProgress}%` }} /></div>
          <strong>{phaseProgress}%</strong>
        </section>

        {pending && <section className="succession-chapter-intel__pending"><ShieldAlert size={20} aria-hidden="true" /><div><h3>Reader media imported; maintained scene research pending</h3><p>This chapter remains accessible in the reader, but Batch 4 does not infer events, locations, or story outcomes before verified annotation is added.</p></div></section>}

        <section className="succession-chapter-dossier__boundary">
          <ShieldAlert size={19} aria-hidden="true" />
          <div><span>Authorized knowledge boundary</span><h3>Every claim on this page stops at Chapter {spoilerLimit}</h3><p>Future participants, outcomes, mechanics, sources, and causal consequences remain excluded until the selected boundary permits them.</p></div>
        </section>

        {!!dossier.laneDossiers.length && <section>
          <div className="succession-chapter-intel__section-title"><Layers3 size={18} aria-hidden="true" /><div><span>Parallel narrative</span><h3>Story lanes active in this phase</h3></div></div>
          <div className="succession-chapter-intel__lanes">{dossier.laneDossiers.map((laneDossier) => <button type="button" key={laneDossier.profile.id} onClick={() => onNavigate('story', { lane: shortId(laneDossier.profile.id) })}><b>{laneDossier.presentation.name}</b><span>{laneDossier.presentation.objective}</span></button>)}</div>
        </section>}

        <section id="chapter-dossier-sequence" className="succession-chapter-dossier__sequence">
          <div className="succession-chapter-intel__section-title"><Activity size={18} aria-hidden="true" /><div><span>Operational sequence</span><h3>What begins, continues, and changes here</h3></div></div>
          <div className="succession-chapter-dossier__sequence-grid">
            <section>
              <header><span>01</span><div><b>Begins here</b><small>New operations and incidents</small></div></header>
              <div className="succession-chapter-intel__events">{dossier.startingEvents.map((event) => <EventCard key={event.id} event={event} mode="Starts" onNavigate={onNavigate} />)}{!dossier.startingEvents.length && <p>No maintained event begins in this chapter.</p>}</div>
            </section>
            <section>
              <header><span>02</span><div><b>Already moving</b><small>Continuing multi-chapter operations</small></div></header>
              <div className="succession-chapter-intel__events">{dossier.continuingEvents.map((event) => <EventCard key={event.id} event={event} mode="Continues" onNavigate={onNavigate} />)}{!dossier.continuingEvents.length && <p>No multi-chapter operation is active here.</p>}</div>
            </section>
            <section>
              <header><span>03</span><div><b>State change</b><small>What the chapter alters</small></div></header>
              {dossier.changes.length ? <ol className="succession-chapter-intel__changes">{dossier.changes.map((change, index) => <li key={change}><span>{String(index + 1).padStart(2, '0')}</span><p>{change}</p></li>)}</ol> : <p>No maintained state-change summary is attached.</p>}
            </section>
          </div>
        </section>

        <section id="chapter-dossier-pressure">
          <div className="succession-chapter-intel__section-title"><CircleHelp size={18} aria-hidden="true" /><div><span>Story pressure</span><h3>Questions open at Chapter {dossier.chapter.number}</h3></div></div>
          <div className="succession-chapter-intel__threads">{dossier.threads.map(({ profile, status }) => <button type="button" className={status === 'resolved' ? 'is-resolved' : ''} key={profile.id} onClick={() => onNavigate('story', { thread: shortId(profile.id) })}><span>{labelize(status)} · {labelize(profile.category)}</span><b>{profile.name}</b><p>{profile.question}</p></button>)}{!dossier.threads.length && <p>No maintained thread projection is attached.</p>}</div>
        </section>

        {(dossier.incomingCausalLinks.length > 0 || dossier.outgoingCausalLinks.length > 0) && <section>
          <div className="succession-chapter-intel__section-title"><GitBranch size={18} aria-hidden="true" /><div><span>Causal position</span><h3>What leads into and out of this chapter</h3></div></div>
          <div className="succession-chapter-intel__causal">{dossier.incomingCausalLinks.map((link) => <CausalCard key={link.id} link={link} direction="Incoming" onNavigate={onNavigate} />)}{dossier.outgoingCausalLinks.map((link) => <CausalCard key={link.id} link={link} direction="Outgoing" onNavigate={onNavigate} />)}</div>
        </section>}

        <div className="succession-chapter-intel__entity-columns">
          <section><div className="succession-chapter-intel__section-title"><Users size={18} aria-hidden="true" /><div><span>Cast</span><h3>Structured appearances</h3></div></div><div>{dossier.appearances.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}{!dossier.appearances.length && <p>No structured appearance row is maintained.</p>}</div></section>
          <section><div className="succession-chapter-intel__section-title"><MapPin size={18} aria-hidden="true" /><div><span>World state</span><h3>Locations and institutions</h3></div></div><div>{[...dossier.locations, ...dossier.organizations].map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}{!dossier.locations.length && !dossier.organizations.length && <p>No structured world-state row is maintained.</p>}</div></section>
        </div>

        {!!dossier.abilities.length && <section>
          <div className="succession-chapter-intel__section-title"><Sparkles size={18} aria-hidden="true" /><div><span>Nen knowledge</span><h3>Abilities linked at this chapter</h3></div></div>
          <div className="succession-chapter-intel__entities">{dossier.abilities.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div>
        </section>}

        <section id="chapter-dossier-evidence" className="succession-chapter-dossier__evidence">
          <div className="succession-chapter-intel__section-title"><FileSearch size={18} aria-hidden="true" /><div><span>Evidence and uncertainty</span><h3>Chapter-bounded sources and research state</h3></div></div>
          <dl className="succession-chapter-dossier__evidence-board">
            <div><dt>Direct sources</dt><dd>{dossier.sources.length}</dd><span>Available at or before the selected boundary</span></div>
            <div><dt>Research state</dt><dd>{labelize(selectedRecord?.researchState || 'pending')}</dd><span>{dossier.chapter.storyIntelligenceStatus}</span></div>
            <div><dt>Unresolved threads</dt><dd>{unresolvedThreadCount}</dd><span>Questions remain explicit rather than converted into conclusions</span></div>
            <div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd><span>Later evidence and outcomes remain hidden</span></div>
          </dl>
          <div className="succession-chapter-dossier__evidence-note"><ShieldAlert size={18} aria-hidden="true" /><p>Canonical fact, maintained interpretation, unresolved question, and documentation gap remain visually distinct. Missing research is never replaced with an inferred scene summary.</p></div>
          <div className="succession-chapter-intel__sources">{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div>
        </section>

        <footer>
          <button type="button" disabled={!previous} onClick={() => previous && openChapter(previous.number)}><ArrowLeft size={14} aria-hidden="true" /> {previous ? `Chapter ${previous.number}` : 'First record'}</button>
          <button type="button" onClick={() => onNavigate('reader', { chapter: dossier.chapter.number })}>Reader bridge <BookOpen size={14} aria-hidden="true" /></button>
          <button type="button" disabled={!next} onClick={() => next && openChapter(next.number)}>{next ? `Chapter ${next.number}` : 'Latest record'} <ArrowRight size={14} aria-hidden="true" /></button>
        </footer>
      </article>
    </div>
  </div>;
}
