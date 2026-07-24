import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleDot,
  Filter,
  GitBranch,
  MapPin,
  Network,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import {
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveEventWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const unique = (values) => [...new Set(values.filter(Boolean))];
const eventRecords = getEntitiesByType('event');

const rangeEnd = (event) => event.chapterRange?.end ?? event.chapterRange?.start ?? 0;
const chapterLabel = (event) => {
  const start = event.chapterRange?.start;
  const end = rangeEnd(event);
  if (!start) return 'Unassigned';
  return start === end ? String(start) : `${start}–${end}`;
};
const includesChapter = (event, chapter) => chapter >= event.chapterRange.start && chapter <= rangeEnd(event);
const eventOrder = (left, right) => left.chapterRange.start - right.chapterRange.start
  || (left.chronology?.sequence || 0) - (right.chronology?.sequence || 0)
  || left.name.localeCompare(right.name);
const titleCase = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const resolveEntities = (ids) => (ids || []).map(getEntityById).filter(Boolean);
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

export default function SuccessionArchiveEventWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [query, setQuery] = useState(routeParams.search || '');
  const [status, setStatus] = useState(routeParams.status || 'all');
  const [category, setCategory] = useState(routeParams.category || 'all');
  const [organization, setOrganization] = useState(routeParams.organization || 'all');
  const [location, setLocation] = useState(routeParams.location || 'all');
  const [ability, setAbility] = useState(routeParams.ability || 'all');
  const [chapter, setChapter] = useState(routeParams.chapter || '');
  const [focus, setFocus] = useState(routeParams.focus || '');

  const eligible = useMemo(() => eventRecords
    .filter((event) => event.chapterRange?.start <= spoilerLimit)
    .sort(eventOrder), [spoilerLimit]);

  const categories = useMemo(() => unique(eligible.map((event) => event.category)).sort(), [eligible]);
  const statuses = useMemo(() => unique(eligible.map((event) => event.status)).sort(), [eligible]);
  const organizations = useMemo(() => unique(eligible.flatMap((event) => event.organizationIds || []))
    .map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [eligible]);
  const locations = useMemo(() => unique(eligible.flatMap((event) => event.locationIds || []))
    .map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [eligible]);
  const abilities = useMemo(() => unique(eligible.flatMap((event) => event.abilityIds || []))
    .map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [eligible]);

  useEffect(() => {
    setFocus(routeParams.focus || '');
  }, [routeParams.focus]);

  const visible = useMemo(() => eligible.filter((event) => {
    const parsedChapter = Number(chapter);
    const searchable = normalize([
      event.name,
      event.summary,
      event.category,
      event.status,
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
      && (!chapter || (Number.isFinite(parsedChapter) && includesChapter(event, parsedChapter)))
      && (!query.trim() || searchable.includes(normalize(query)));
  }), [ability, category, chapter, eligible, location, organization, query, status]);

  const selected = useMemo(() => eligible.find((event) => event.id === focus || event.slug === focus) || null, [eligible, focus]);
  const selectedIndex = selected ? eligible.findIndex((event) => event.id === selected.id) : -1;
  const previousEvent = selectedIndex > 0 ? eligible[selectedIndex - 1] : null;
  const nextEvent = selectedIndex >= 0 && selectedIndex < eligible.length - 1 ? eligible[selectedIndex + 1] : null;

  const openEvent = (event) => {
    setFocus(event.slug);
    onNavigate('events', { focus: event.slug });
  };

  const closeEvent = () => {
    setFocus('');
    onNavigate('events');
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

  const activeFilterCount = [query, chapter, status !== 'all', category !== 'all', organization !== 'all', location !== 'all', ability !== 'all']
    .filter(Boolean).length;

  const ongoingCount = eligible.filter((event) => event.status === 'ongoing').length;
  const unresolvedCount = eligible.filter((event) => (event.openQuestions || []).length > 0).length;

  const dossier = selected ? {
    participants: resolveEntities(selected.participantIds),
    organizations: resolveEntities(selected.organizationIds),
    locations: resolveEntities(selected.locationIds),
    abilities: resolveEntities(selected.abilityIds),
    predecessors: eligible.filter((event) => event.consequenceEventIds?.includes(selected.id)),
    consequences: resolveEntities(selected.consequenceEventIds).filter((entity) => entity.entityType === 'event'),
    sources: getSourcesForEntity(selected.id),
  } : null;

  return <div className="succession-canonical-events">
    <section className="succession-canonical-events__hero">
      <div><span>Canonical event graph</span><h2>Cause, action, consequence, and unresolved state</h2><p>The event archive now reads directly from the canonical graph. Every operation can expose its participants, factions, locations, Nen systems, causal predecessors, consequences, state changes, questions, and chapter evidence.</p></div>
      <dl><div><dt>Visible events</dt><dd>{eligible.length}</dd></div><div><dt>Ongoing</dt><dd>{ongoingCount}</dd></div><div><dt>Open-question records</dt><dd>{unresolvedCount}</dd></div><div><dt>Spoiler boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl>
    </section>

    <section className="succession-event-filter-panel" aria-labelledby="succession-event-filter-title">
      <header><Filter size={17} aria-hidden="true" /><div><span>Faceted event search</span><h3 id="succession-event-filter-title">Filter the operational record</h3></div><b>{activeFilterCount} active</b></header>
      <label className="succession-event-filter-panel__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search canonical events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Event, participant, cause, outcome, question…" /></label>
      <div className="succession-event-filter-panel__fields">
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{statuses.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Faction</span><select value={organization} onChange={(event) => setOrganization(event.target.value)}><option value="all">All factions</option>{organizations.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>
        <label><span>Location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option>{locations.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>
        <label><span>Ability</span><select value={ability} onChange={(event) => setAbility(event.target.value)}><option value="all">All abilities</option>{abilities.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>
        <label><span>Chapter</span><input type="number" min="340" max={spoilerLimit} value={chapter} onChange={(event) => setChapter(event.target.value)} placeholder="Any" /></label>
      </div>
      <footer><span role="status" aria-live="polite">Showing {visible.length} of {eligible.length} canonical events.</span><button type="button" disabled={!activeFilterCount} onClick={resetFilters}>Clear filters</button></footer>
    </section>

    <section className="succession-canonical-event-timeline" aria-label="Canonical succession event timeline">
      {visible.map((event, index) => {
        const eventLocations = resolveEntities(event.locationIds);
        const participants = resolveEntities(event.participantIds).slice(0, 4);
        return <button type="button" className={`${selected?.id === event.id ? 'is-selected' : ''} is-${event.status}`} onClick={() => openEvent(event)} key={event.id}>
          <span className="succession-canonical-event-timeline__index">{String(index + 1).padStart(2, '0')}</span>
          <div className="succession-canonical-event-timeline__body">
            <div className="succession-canonical-event-timeline__meta"><span>Ch. {chapterLabel(event)}</span><b>{titleCase(event.category)}</b>{event.chronology?.day && <em>Day {event.chronology.day}</em>}</div>
            <h3>{event.name}</h3><p>{event.summary}</p>
            <footer><span><MapPin size={12} aria-hidden="true" /> {eventLocations.map((item) => item.name).slice(0, 2).join(' · ') || 'Location unresolved'}</span><span><GitBranch size={12} aria-hidden="true" /> {(event.consequenceEventIds || []).length} consequence link{(event.consequenceEventIds || []).length === 1 ? '' : 's'}</span></footer>
          </div>
          <div className="succession-canonical-event-timeline__actors">{participants.map((entity) => <EntityVisual entity={entity} compact key={entity.id} />)}{event.participantIds?.length > 4 && <span>+{event.participantIds.length - 4}</span>}</div>
          <strong>{titleCase(event.status)}</strong>
        </button>;
      })}
      {!visible.length && <div className="succession-canonical-event-timeline__empty"><AlertTriangle size={20} aria-hidden="true" /><h3>No events match these filters</h3><p>Clear one or more facets to restore the chronological record.</p><button type="button" onClick={resetFilters}>Reset event filters</button></div>}
    </section>

    {selected && dossier && <article className="succession-canonical-event-dossier" aria-labelledby="succession-event-dossier-title">
      <header>
        <button type="button" className="succession-canonical-event-dossier__close" onClick={closeEvent}><ArrowLeft size={14} aria-hidden="true" /> Event timeline</button>
        <div><span>{titleCase(selected.category)} · {titleCase(selected.status)}</span><h2 id="succession-event-dossier-title">{selected.name}</h2><p>{selected.summary}</p></div>
        <dl><div><dt>Chapter span</dt><dd>{chapterLabel(selected)}</dd></div><div><dt>Importance</dt><dd>{titleCase(selected.importance)}</dd></div><div><dt>Voyage day</dt><dd>{selected.chronology?.day || 'Unassigned'}</dd></div><div><dt>Evidence</dt><dd>{dossier.sources.length} source{dossier.sources.length === 1 ? '' : 's'}</dd></div></dl>
      </header>

      <section className="succession-event-causality" aria-labelledby="succession-event-causality-title">
        <header><Network size={17} aria-hidden="true" /><div><span>Causal record</span><h3 id="succession-event-causality-title">Why it happened and what changed</h3></div></header>
        <div><section><span>Causes</span><ol>{(selected.causes || []).map((item) => <li key={item}>{item}</li>)}</ol>{!(selected.causes || []).length && <p>No canonical cause is recorded yet.</p>}</section><section className="is-action"><span>Event action</span><p>{selected.summary}</p></section><section><span>Outcomes</span><ol>{(selected.outcomes || []).map((item) => <li key={item}>{item}</li>)}</ol>{!(selected.outcomes || []).length && <p>No canonical outcome is recorded yet.</p>}</section></div>
      </section>

      {!!(selected.stateChanges || []).length && <section className="succession-event-state-changes"><header><CircleDot size={16} aria-hidden="true" /><div><span>Temporal model</span><h3>State changes</h3></div></header><ol>{selected.stateChanges.map((item) => <li key={item}>{item}</li>)}</ol></section>}
      {!!(selected.openQuestions || []).length && <section className="succession-event-open-questions"><header><AlertTriangle size={16} aria-hidden="true" /><div><span>Research queue</span><h3>Unresolved questions</h3></div></header><ol>{selected.openQuestions.map((item) => <li key={item}>{item}</li>)}</ol></section>}

      <section className="succession-event-linked-entities" aria-labelledby="succession-event-linked-title"><header><Sparkles size={17} aria-hidden="true" /><div><span>Canonical cross-links</span><h3 id="succession-event-linked-title">People, factions, places, and Nen</h3></div></header><div><EntityGroup icon={Users} title="Participants" entities={dossier.participants} onNavigate={onNavigate} /><EntityGroup icon={Network} title="Organizations" entities={dossier.organizations} onNavigate={onNavigate} /><EntityGroup icon={MapPin} title="Locations" entities={dossier.locations} onNavigate={onNavigate} /><EntityGroup icon={Sparkles} title="Abilities" entities={dossier.abilities} onNavigate={onNavigate} /></div></section>

      <section className="succession-event-chain" aria-labelledby="succession-event-chain-title"><header><GitBranch size={17} aria-hidden="true" /><div><span>Event graph</span><h3 id="succession-event-chain-title">Predecessors and consequences</h3></div></header><div><section><span>Leads into this event</span>{dossier.predecessors.length ? dossier.predecessors.map((event) => <button type="button" onClick={() => openEvent(event)} key={event.id}><small>Ch. {chapterLabel(event)}</small><b>{event.name}</b><ArrowRight size={13} aria-hidden="true" /></button>) : <p>No explicit predecessor link is recorded.</p>}</section><section><span>This event leads to</span>{dossier.consequences.length ? dossier.consequences.map((event) => <button type="button" onClick={() => openEvent(event)} key={event.id}><small>Ch. {chapterLabel(event)}</small><b>{event.name}</b><ArrowRight size={13} aria-hidden="true" /></button>) : <p>No explicit consequence event is recorded.</p>}</section></div></section>

      {!!dossier.sources.length && <section className="succession-event-sources" aria-labelledby="succession-event-sources-title"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence trail</span><h3 id="succession-event-sources-title">Chapter sources</h3></div></header><div>{dossier.sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}

      <footer className="succession-canonical-event-dossier__footer"><EventJump event={previousEvent} direction="previous" onOpen={openEvent} /><button type="button" className="succession-event-reader-link" onClick={() => onNavigate('reader', { chapter: selected.chapterRange.start })}>Read from Chapter {selected.chapterRange.start}<BookOpen size={14} aria-hidden="true" /></button><EventJump event={nextEvent} direction="next" onOpen={openEvent} /></footer>
    </article>}
  </div>;
}
