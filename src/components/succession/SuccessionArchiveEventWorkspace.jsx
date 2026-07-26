import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleDot,
  Clock3,
  Filter,
  GitBranch,
  LayoutGrid,
  List,
  MapPin,
  Network,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  getEntityById,
  getStoryEventsKnownAtChapter,
} from '../../data/succession/successionData';
import {
  ArchiveState,
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveEventWorkspace.css';
import './SuccessionArchiveEventCommand.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const unique = (values) => [...new Set(values.filter(Boolean))];
const rangeEnd = (event) => event.chapterRange?.end ?? event.chapterRange?.start ?? 0;
const chapterLabel = (event) => {
  const start = event.chapterRange?.start;
  const end = rangeEnd(event);
  if (!start) return 'Unassigned';
  return start === end ? String(start) : `${start}–${end}`;
};
const includesCanonicalChapter = (event, chapter) => chapter >= event.canonicalChapterRange.start && chapter <= (event.canonicalChapterRange.end ?? event.canonicalChapterRange.start);
const titleCase = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const resolveEntities = (ids) => (ids || []).map(getEntityById).filter(Boolean);
const eventStateClass = (event) => {
  const value = normalize(`${event.status} ${event.canonicalEvent?.status}`);
  if (/completed|resolved|concluded|ended/.test(value)) return 'resolved';
  if (/active|ongoing|selected/.test(value)) return 'active';
  if ((event.openQuestions || []).length || !event.mature) return 'unresolved';
  return 'recorded';
};
const relatedNames = (event) => [
  ...resolveEntities(event.participantIds),
  ...resolveEntities(event.organizationIds),
  ...resolveEntities(event.locationIds),
  ...resolveEntities(event.abilityIds),
].map((entity) => entity.name).join(' ');

function EntityChip({ entity, onNavigate }) {
  if (!entity) return null;
  return <button
    type="button"
    className={`succession-event-entity-chip is-${entity.entityType}`}
    onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}
  >
    <EntityVisual entity={entity} compact />
    <span><small>{entity.entityType.replaceAll('-', ' ')}</small><b>{entity.name}</b></span>
    <ArrowRight size={13} aria-hidden="true" />
  </button>;
}

function EntityGroup({ icon: Icon, title, entities, onNavigate }) {
  if (!entities.length) return null;
  return <section className="succession-event-entity-group">
    <header><Icon size={16} aria-hidden="true" /><h4>{title}</h4><span>{entities.length}</span></header>
    <div>{entities.map((entity) => <EntityChip entity={entity} onNavigate={onNavigate} key={entity.id} />)}</div>
  </section>;
}

function EventJump({ event, direction, onOpen }) {
  if (!event) return null;
  return <button type="button" className="succession-event-jump" onClick={() => onOpen(event)}>
    {direction === 'previous' && <ArrowLeft size={14} aria-hidden="true" />}
    <span><small>{direction}</small><b>{event.name}</b><em>Ch. {chapterLabel(event)}</em></span>
    {direction === 'next' && <ArrowRight size={14} aria-hidden="true" />}
  </button>;
}

function EventDirectoryCard({ event, selected, onOpen }) {
  const participants = resolveEntities(event.participantIds).slice(0, 4);
  const locations = resolveEntities(event.locationIds);
  const classification = eventStateClass(event);
  return <button type="button" className={`succession-event-command-card is-${classification}${selected ? ' is-selected' : ''}`} aria-current={selected ? 'page' : undefined} onClick={() => onOpen(event)}>
    <header>
      <span>{chapterLabel(event)}</span>
      <div><small>{titleCase(event.category)} · {titleCase(event.status)}</small><h3>{event.name}</h3></div>
      <em>{titleCase(classification)}</em>
    </header>
    <p>{event.summary}</p>
    <div className="succession-event-command-card__actors">{participants.map((entity) => <EntityVisual entity={entity} compact key={entity.id} />)}{event.participantIds.length > 4 && <span>+{event.participantIds.length - 4}</span>}</div>
    <dl>
      <div><dt>Participants</dt><dd>{event.participantIds.length}</dd></div>
      <div><dt>Locations</dt><dd>{event.locationIds.length}</dd></div>
      <div><dt>Abilities</dt><dd>{event.abilityIds.length}</dd></div>
      <div><dt>Consequences</dt><dd>{event.consequenceEventIds.length}</dd></div>
    </dl>
    <footer><span><MapPin size={12} aria-hidden="true" /> {locations.map((item) => item.name).slice(0, 2).join(' · ') || 'Location unresolved'}</span><b>Open dossier <ArrowRight size={13} aria-hidden="true" /></b></footer>
  </button>;
}

export default function SuccessionArchiveEventWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [query, setQuery] = useState(routeParams.search || '');
  const [status, setStatus] = useState(routeParams.status || 'all');
  const [category, setCategory] = useState(routeParams.category || 'all');
  const [organization, setOrganization] = useState(routeParams.organization || 'all');
  const [location, setLocation] = useState(routeParams.location || 'all');
  const [ability, setAbility] = useState(routeParams.ability || 'all');
  const [chapter, setChapter] = useState(routeParams.chapter || '');
  const [focus, setFocus] = useState(routeParams.focus || routeParams.entity || '');
  const [view, setView] = useState(['timeline', 'grid', 'index'].includes(routeParams.view) ? routeParams.view : 'timeline');

  useEffect(() => {
    setFocus(routeParams.focus || routeParams.entity || '');
  }, [routeParams.entity, routeParams.focus]);

  const parsedChapter = Number(chapter);
  const filteredChapter = chapter && Number.isFinite(parsedChapter) && parsedChapter >= 340 && parsedChapter <= spoilerLimit ? parsedChapter : null;
  const knowledgeBoundary = filteredChapter ?? spoilerLimit;
  const eligible = useMemo(() => getStoryEventsKnownAtChapter(knowledgeBoundary)
    .filter((event) => filteredChapter === null || includesCanonicalChapter(event, filteredChapter)), [filteredChapter, knowledgeBoundary]);

  const categories = useMemo(() => unique(eligible.map((event) => event.category)).sort(), [eligible]);
  const statuses = useMemo(() => unique(eligible.map((event) => event.status)).sort(), [eligible]);
  const organizations = useMemo(() => unique(eligible.flatMap((event) => event.organizationIds || []))
    .map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [eligible]);
  const locations = useMemo(() => unique(eligible.flatMap((event) => event.locationIds || []))
    .map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [eligible]);
  const abilities = useMemo(() => unique(eligible.flatMap((event) => event.abilityIds || []))
    .map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [eligible]);

  const visible = useMemo(() => eligible.filter((event) => {
    const searchable = normalize([
      event.name,
      event.summary,
      event.category,
      event.status,
      event.knowledgeState,
      ...(event.aliases || []),
      ...(event.causes || []),
      ...(event.outcomes || []),
      ...(event.stateChanges || []),
      ...(event.openQuestions || []),
      relatedNames(event),
    ].join(' '));
    return (status === 'all' || event.status === status)
      && (category === 'all' || event.category === category)
      && (organization === 'all' || event.organizationIds?.includes(organization))
      && (location === 'all' || event.locationIds?.includes(location))
      && (ability === 'all' || event.abilityIds?.includes(ability))
      && (!query.trim() || searchable.includes(normalize(query)));
  }), [ability, category, eligible, location, organization, query, status]);

  const selected = useMemo(() => eligible.find((event) => event.id === focus || event.slug === focus) || null, [eligible, focus]);
  const selectedIndex = selected ? eligible.findIndex((event) => event.id === selected.id) : -1;
  const previousEvent = selectedIndex > 0 ? eligible[selectedIndex - 1] : null;
  const nextEvent = selectedIndex >= 0 && selectedIndex < eligible.length - 1 ? eligible[selectedIndex + 1] : null;

  const openEvent = (event) => {
    setFocus(event.slug);
    onNavigate('events', { focus: event.slug, ...(filteredChapter === null ? {} : { chapter: filteredChapter }) });
  };

  const closeEvent = () => {
    setFocus('');
    onNavigate('events', filteredChapter === null ? {} : { chapter: filteredChapter });
  };

  const resetFilters = () => {
    setQuery('');
    setStatus('all');
    setCategory('all');
    setOrganization('all');
    setLocation('all');
    setAbility('all');
    setChapter('');
  };

  const activeFilters = [
    query && { id: 'query', label: `Search: ${query}`, clear: () => setQuery('') },
    chapter && { id: 'chapter', label: `Chapter: ${chapter}`, clear: () => setChapter('') },
    status !== 'all' && { id: 'status', label: `Status: ${titleCase(status)}`, clear: () => setStatus('all') },
    category !== 'all' && { id: 'category', label: `Category: ${titleCase(category)}`, clear: () => setCategory('all') },
    organization !== 'all' && { id: 'organization', label: `Faction: ${getEntityById(organization)?.name || organization}`, clear: () => setOrganization('all') },
    location !== 'all' && { id: 'location', label: `Location: ${getEntityById(location)?.name || location}`, clear: () => setLocation('all') },
    ability !== 'all' && { id: 'ability', label: `Ability: ${getEntityById(ability)?.name || ability}`, clear: () => setAbility('all') },
  ].filter(Boolean);
  const activeFilterCount = activeFilters.length;
  const ongoingCount = eligible.filter((event) => eventStateClass(event) === 'active').length;
  const resolvedCount = eligible.filter((event) => eventStateClass(event) === 'resolved').length;
  const unresolvedCount = eligible.filter((event) => eventStateClass(event) === 'unresolved').length;
  const causalCount = eligible.reduce((total, event) => total + event.predecessorEventIds.length + event.consequenceEventIds.length, 0);

  const dossier = selected ? {
    participants: resolveEntities(selected.participantIds),
    organizations: resolveEntities(selected.organizationIds),
    locations: resolveEntities(selected.locationIds),
    abilities: resolveEntities(selected.abilityIds),
    predecessors: resolveEntities(selected.predecessorEventIds).filter((entity) => entity.entityType === 'event'),
    consequences: resolveEntities(selected.consequenceEventIds).filter((entity) => entity.entityType === 'event'),
    sources: resolveEntities(selected.sourceIds).filter((entity) => entity.entityType === 'source'),
  } : null;

  return <div className="succession-canonical-events succession-event-command">
    <section className="succession-event-command__hero">
      <div><span><Network size={16} aria-hidden="true" /> Canonical event command</span><h2>Cause, action, consequence, and unresolved state</h2><p>Every event is projected through the active chapter boundary. Multi-chapter operations hide later outcomes, participants, abilities, sources, and consequence links until their supporting chapters become available.</p></div>
      <div className="succession-event-command__network" aria-hidden="true"><strong>{eligible.length}</strong><span>visible operations</span><i /><i /><i /><i /></div>
    </section>

    <dl className="succession-event-command__metrics">
      <div><dt>Visible events</dt><dd>{eligible.length}</dd></div>
      <div><dt>Active</dt><dd>{ongoingCount}</dd></div>
      <div><dt>Resolved</dt><dd>{resolvedCount}</dd></div>
      <div><dt>Unresolved</dt><dd>{unresolvedCount}</dd></div>
      <div><dt>Causal edges</dt><dd>{causalCount}</dd></div>
    </dl>

    <section className="succession-event-filter-panel succession-event-command__filters" aria-labelledby="succession-event-filter-title">
      <header><div><Filter size={17} aria-hidden="true" /><div><span>Faceted event search</span><h3 id="succession-event-filter-title">Filter the operational record</h3></div></div><div role="group" aria-label="Event directory view">{[['timeline', 'Timeline', GitBranch], ['grid', 'Grid', LayoutGrid], ['index', 'Index', List]].map(([id, label, Icon]) => <button type="button" className={view === id ? 'is-active' : ''} aria-pressed={view === id} onClick={() => setView(id)} key={id}><Icon size={14} aria-hidden="true" /> {label}</button>)}</div></header>
      <label className="succession-event-filter-panel__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search canonical events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Event, participant, cause, available outcome, question…" /></label>
      <div className="succession-event-filter-panel__fields">
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{statuses.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Faction</span><select value={organization} onChange={(event) => setOrganization(event.target.value)}><option value="all">All factions</option>{organizations.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>
        <label><span>Location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option>{locations.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>
        <label><span>Ability</span><select value={ability} onChange={(event) => setAbility(event.target.value)}><option value="all">All abilities</option>{abilities.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>
        <label><span>Chapter knowledge</span><input type="number" min="340" max={spoilerLimit} value={chapter} onChange={(event) => setChapter(event.target.value)} placeholder={`Through ${spoilerLimit}`} /></label>
      </div>
      <div className="succession-event-command__active-filters">{!activeFilters.length && <span>No filters applied. Showing the complete event graph inside Chapter {knowledgeBoundary}.</span>}{activeFilters.map((item) => <button type="button" onClick={item.clear} key={item.id}>{item.label} <X size={12} aria-hidden="true" /></button>)}{!!activeFilters.length && <button type="button" className="is-reset" onClick={resetFilters}>Reset all</button>}</div>
      <footer><span role="status" aria-live="polite">Showing {visible.length} of {eligible.length} events through Chapter {knowledgeBoundary}.</span><strong>{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}</strong></footer>
    </section>

    {view === 'timeline' && <section className="succession-canonical-event-timeline succession-event-command__timeline" aria-label="Canonical succession event timeline">
      {visible.map((event, index) => {
        const eventLocations = resolveEntities(event.locationIds);
        const participants = resolveEntities(event.participantIds).slice(0, 4);
        return <button type="button" className={`${selected?.id === event.id ? 'is-selected' : ''} is-${eventStateClass(event)}`} onClick={() => openEvent(event)} key={event.id}>
          <span className="succession-canonical-event-timeline__index">{String(index + 1).padStart(2, '0')}</span>
          <div className="succession-canonical-event-timeline__body">
            <div className="succession-canonical-event-timeline__meta"><span>Ch. {chapterLabel(event)}</span><b>{titleCase(event.category)}</b>{event.chronology?.day && <em>Day {event.chronology.day}</em>}</div>
            <h3>{event.name}</h3><p>{event.summary}</p>
            <footer><span><MapPin size={12} aria-hidden="true" /> {eventLocations.map((item) => item.name).slice(0, 2).join(' · ') || 'Location unresolved'}</span><span><GitBranch size={12} aria-hidden="true" /> {event.consequenceEventIds.length} available consequence link{event.consequenceEventIds.length === 1 ? '' : 's'}</span></footer>
          </div>
          <div className="succession-canonical-event-timeline__actors">{participants.map((entity) => <EntityVisual entity={entity} compact key={entity.id} />)}{event.participantIds.length > 4 && <span>+{event.participantIds.length - 4}</span>}</div>
          <strong>{titleCase(eventStateClass(event))}</strong>
        </button>;
      })}
    </section>}

    {view === 'grid' && <section className="succession-event-command__grid" aria-label="Canonical event intelligence grid">{visible.map((event) => <EventDirectoryCard event={event} selected={selected?.id === event.id} onOpen={openEvent} key={event.id} />)}</section>}

    {view === 'index' && <section className="succession-event-command__index" aria-label="Compact canonical event index"><div className="succession-event-command__index-head"><span>Span</span><span>Event</span><span>Category</span><span>State</span><span>People</span><span>Links</span></div>{visible.map((event) => <button type="button" className={selected?.id === event.id ? 'is-selected' : ''} onClick={() => openEvent(event)} key={event.id}><b>{chapterLabel(event)}</b><span><strong>{event.name}</strong><small>{event.summary}</small></span><em>{titleCase(event.category)}</em><em>{titleCase(eventStateClass(event))}</em><i>{event.participantIds.length}</i><i>{event.consequenceEventIds.length}</i></button>)}</section>}

    {!visible.length && <ArchiveState kind="empty" title="No events match these filters" description="Clear one or more facets or move the chapter boundary forward." action={<button type="button" onClick={resetFilters}>Reset event filters</button>} />}

    {selected && dossier && <article className="succession-canonical-event-dossier succession-event-command-dossier" aria-labelledby="succession-event-dossier-title">
      <button type="button" className="succession-canonical-event-dossier__close" onClick={closeEvent}><ArrowLeft size={14} aria-hidden="true" /> Event directory</button>
      <header className="succession-event-command-dossier__hero">
        <div className="succession-event-command-dossier__range" aria-hidden="true"><span>{selected.chapterRange.start}</span>{rangeEnd(selected) !== selected.chapterRange.start && <><i>→</i><span>{rangeEnd(selected)}</span></>}</div>
        <div><span>{titleCase(selected.category)} · {titleCase(eventStateClass(selected))} · {selected.knowledgeState}</span><h2 id="succession-event-dossier-title">{selected.name}</h2><p>{selected.summary}</p><div><button type="button" onClick={() => onNavigate('chapters', { chapter: selected.canonicalChapterRange.start })}>Open chapter dossier <BookOpen size={13} aria-hidden="true" /></button><button type="button" onClick={() => onNavigate('story')}>Story intelligence <Network size={13} aria-hidden="true" /></button></div></div>
        <dl><div><dt>Visible span</dt><dd>{chapterLabel(selected)}</dd></div><div><dt>Importance</dt><dd>{titleCase(selected.importance)}</dd></div><div><dt>Voyage day</dt><dd>{selected.chronology?.day || 'Unassigned'}</dd></div><div><dt>Evidence</dt><dd>{dossier.sources.length} source{dossier.sources.length === 1 ? '' : 's'}</dd></div></dl>
      </header>

      <section className="succession-event-command-dossier__boundary"><ShieldAlert size={19} aria-hidden="true" /><div><span>Knowledge projection</span><h3>This dossier is limited to Chapter {knowledgeBoundary}</h3><p>Later outcomes, actors, Nen mechanics, evidence, and consequence nodes remain excluded until their supporting chapters become authorized.</p></div></section>

      <section className="succession-event-causality succession-event-command-dossier__causality" aria-labelledby="succession-event-causality-title">
        <header><Network size={17} aria-hidden="true" /><div><span>Causal record</span><h3 id="succession-event-causality-title">Cause → action → available outcome</h3></div></header>
        <div><section><span>01 · Causes</span><ol>{selected.causes.map((item) => <li key={item}>{item}</li>)}</ol>{!selected.causes.length && <p>No canonical cause is recorded yet.</p>}</section><section className="is-action"><span>02 · Event action</span><p>{selected.summary}</p></section><section><span>03 · Available outcomes</span><ol>{selected.outcomes.map((item) => <li key={item}>{item}</li>)}</ol>{!selected.outcomes.length && <p>Later outcomes remain hidden or undocumented at Chapter {knowledgeBoundary}.</p>}</section></div>
      </section>

      <div className="succession-event-command-dossier__state-grid">
        <section className="succession-event-state-changes"><header><CircleDot size={16} aria-hidden="true" /><div><span>Temporal model</span><h3>Available state changes</h3></div></header>{selected.stateChanges.length ? <ol>{selected.stateChanges.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No explicit state-change record is available.</p>}</section>
        <section className="succession-event-open-questions"><header><AlertTriangle size={16} aria-hidden="true" /><div><span>Research queue</span><h3>Unresolved questions</h3></div></header>{selected.openQuestions.length ? <ol>{selected.openQuestions.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No unresolved question is attached at this boundary.</p>}</section>
      </div>

      <section className="succession-event-linked-entities" aria-labelledby="succession-event-linked-title"><header><Sparkles size={17} aria-hidden="true" /><div><span>Canonical cross-links</span><h3 id="succession-event-linked-title">People, factions, places, and Nen available here</h3></div></header><div><EntityGroup icon={Users} title="Participants" entities={dossier.participants} onNavigate={onNavigate} /><EntityGroup icon={Network} title="Organizations" entities={dossier.organizations} onNavigate={onNavigate} /><EntityGroup icon={MapPin} title="Locations" entities={dossier.locations} onNavigate={onNavigate} /><EntityGroup icon={Sparkles} title="Abilities" entities={dossier.abilities} onNavigate={onNavigate} /></div></section>

      <section className="succession-event-chain succession-event-command-dossier__chain" aria-labelledby="succession-event-chain-title"><header><GitBranch size={17} aria-hidden="true" /><div><span>Event graph</span><h3 id="succession-event-chain-title">Available predecessors and consequences</h3></div></header><div><section><span>Leads into this event</span>{dossier.predecessors.length ? dossier.predecessors.map((event) => <button type="button" onClick={() => openEvent(eligible.find((candidate) => candidate.id === event.id) || event)} key={event.id}><small>Ch. {event.chapterRange?.start}</small><b>{event.name}</b><ArrowRight size={13} aria-hidden="true" /></button>) : <p>No predecessor is available at this boundary.</p>}</section><section><span>This event leads to</span>{dossier.consequences.length ? dossier.consequences.map((event) => <button type="button" onClick={() => openEvent(eligible.find((candidate) => candidate.id === event.id) || event)} key={event.id}><small>Ch. {event.chapterRange?.start}</small><b>{event.name}</b><ArrowRight size={13} aria-hidden="true" /></button>) : <p>No consequence event is available at this boundary.</p>}</section></div></section>

      <section className="succession-event-sources succession-event-command-dossier__sources" aria-labelledby="succession-event-sources-title"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence trail</span><h3 id="succession-event-sources-title">Chapter sources through {knowledgeBoundary}</h3></div></header>{dossier.sources.length ? <div>{dossier.sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div> : <ArchiveState kind="empty" title="No linked evidence source" description="This event remains in the canonical graph, but no source entity is exposed at the selected boundary." />}</section>

      <footer className="succession-canonical-event-dossier__footer"><EventJump event={previousEvent} direction="previous" onOpen={openEvent} /><button type="button" className="succession-event-reader-link" onClick={() => onNavigate('reader', { chapter: selected.canonicalChapterRange.start })}>Read from Chapter {selected.canonicalChapterRange.start}<BookOpen size={14} aria-hidden="true" /></button><EventJump event={nextEvent} direction="next" onOpen={openEvent} /></footer>
    </article>}
  </div>;
}
