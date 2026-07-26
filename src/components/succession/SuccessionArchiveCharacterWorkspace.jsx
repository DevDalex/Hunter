import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Clock3,
  Crown,
  LayoutGrid,
  List,
  MapPin,
  Network,
  Search,
  Shield,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  getCharacterCurrentState,
  getCharacterDossier,
  getCharacterRoleProfile,
  getCharacterStateCoverageReport,
  getEntitiesByType,
  getEntityById,
} from '../../data/succession/successionData';
import {
  ArchiveState,
  EntityBadge,
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveCharacterWorkspace.css';
import './SuccessionArchiveCharacterWorkspaceExpansion.css';
import './SuccessionArchiveCharacterCommand.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const roleLabel = (value) => String(value || '').replaceAll('-', ' ');
const rangeLabel = (range) => `Ch. ${range.start}${range.end === null || range.end === undefined ? '–current' : range.end === range.start ? '' : `–${range.end}`}`;
const timelineKinds = ['all', 'state', 'movement', 'assignment', 'relationship', 'event', 'appearance'];
const timelineNav = [
  ['character-overview', 'Overview'],
  ['character-state', 'State'],
  ['character-operations', 'Operations'],
  ['character-chronology', 'Chronology'],
  ['character-evidence', 'Evidence'],
];

const stateClass = (state = {}) => {
  const text = normalize(`${state.life} ${state.bodyState} ${state.consciousnessState}`);
  if (/dead|deceased/.test(text)) return 'dead';
  if (/unknown|possess|occupied|displaced|continuation|exceptional/.test(text)) return 'exceptional';
  return state.life ? roleLabel(state.life) : 'active';
};

const intersectsChapter = (range = {}, chapter) => {
  const start = Number(range.start || 0);
  const end = range.end === null || range.end === undefined ? Number.POSITIVE_INFINITY : Number(range.end);
  return chapter >= start && chapter <= end;
};

const StateFact = ({ label, children }) => {
  if (children === null || children === undefined || children === '') return null;
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
};

const EntityButton = ({ entity, onNavigate, note }) => {
  if (!entity) return null;
  return <button type="button" className="succession-character-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><b>{entity.name}</b><small>{note || roleLabel(entity.entityType)}</small></span>
  </button>;
};

const TimelineLink = ({ entry, onNavigate }) => {
  const linkedEntity = entry.entityId ? getEntityById(entry.entityId) : null;
  const location = entry.locationId ? getEntityById(entry.locationId) : null;
  const targetEntity = linkedEntity?.entityType === 'location-history' ? location : linkedEntity || location;
  if (!targetEntity) return null;
  return <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(targetEntity), { entity: targetEntity.id, chapter: entry.chapterRange.start })}>Open linked record <ArrowRight size={12} /></button>;
};

function CharacterDirectory({ characters, onNavigate }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [layer, setLayer] = useState('all');
  const [life, setLife] = useState('all');
  const [threat, setThreat] = useState('all');
  const [view, setView] = useState('grid');
  const coverage = getCharacterStateCoverageReport();
  const roles = useMemo(() => ['all', ...new Set(characters.flatMap((character) => character.roles || []))], [characters]);
  const layers = useMemo(() => [...new Map(characters.map((character) => {
    const profile = getCharacterRoleProfile(character.id);
    return profile ? [profile.id, profile] : null;
  }).filter(Boolean)).values()], [characters]);
  const lifeStates = useMemo(() => ['all', ...new Set(characters.map((character) => getCharacterCurrentState(character.id)?.life || character.status?.life || 'unknown'))], [characters]);
  const threatStates = useMemo(() => ['all', ...new Set(characters.map((character) => getCharacterCurrentState(character.id)?.threatLevel).filter(Boolean))], [characters]);

  const visible = useMemo(() => characters.filter((character) => {
    const state = getCharacterCurrentState(character.id);
    const roleProfile = getCharacterRoleProfile(character.id);
    const roleMatch = role === 'all' || (character.roles || []).includes(role);
    const layerMatch = layer === 'all' || roleProfile?.id === layer;
    const lifeValue = state?.life || character.status?.life || 'unknown';
    const lifeMatch = life === 'all' || lifeValue === life;
    const threatMatch = threat === 'all' || state?.threatLevel === threat;
    const text = normalize([
      character.name,
      character.id,
      ...(character.aliases || []),
      ...(character.roles || []),
      character.summary,
      state?.operationalState,
      state?.bodyState,
      state?.consciousnessState,
      state?.threatLevel,
      state?.protectionState,
      roleProfile?.label,
      roleProfile?.mandate,
    ].join(' '));
    return roleMatch && layerMatch && lifeMatch && threatMatch && (!query.trim() || text.includes(normalize(query)));
  }), [characters, layer, life, query, role, threat]);

  const directoryCounts = useMemo(() => characters.reduce((counts, character) => {
    const classification = stateClass(getCharacterCurrentState(character.id) || character.status || {});
    if (classification === 'dead') counts.deceased += 1;
    else if (classification === 'exceptional') counts.exceptional += 1;
    else counts.active += 1;
    return counts;
  }, { active: 0, deceased: 0, exceptional: 0 }), [characters]);

  const activeFilters = [
    query && { id: 'query', label: `Search: ${query}`, clear: () => setQuery('') },
    role !== 'all' && { id: 'role', label: `Role: ${roleLabel(role)}`, clear: () => setRole('all') },
    layer !== 'all' && { id: 'layer', label: `Layer: ${layers.find((item) => item.id === layer)?.label || roleLabel(layer)}`, clear: () => setLayer('all') },
    life !== 'all' && { id: 'life', label: `Life: ${roleLabel(life)}`, clear: () => setLife('all') },
    threat !== 'all' && { id: 'threat', label: `Threat: ${roleLabel(threat)}`, clear: () => setThreat('all') },
  ].filter(Boolean);

  const resetFilters = () => {
    setQuery('');
    setRole('all');
    setLayer('all');
    setLife('all');
    setThreat('all');
  };

  return <div className="succession-character-workspace">
    <section className="succession-character-command-hero" aria-labelledby="succession-character-command-title">
      <div className="succession-character-command-hero__copy">
        <span className="succession-character-command-hero__eyebrow"><Users size={16} aria-hidden="true" /> Personnel intelligence command</span>
        <h2 id="succession-character-command-title">Every actor as a live, chapter-bounded operational record.</h2>
        <p>Scan identity, role, body and consciousness state, threat, protection, allegiance, and operational layer without collapsing explicit records into graph-derived fallback summaries.</p>
      </div>
      <div className="succession-character-command-hero__intelligence">
        <div className="succession-character-coverage-ring" aria-label={`${coverage.coveragePercent}% of characters have explicit state profiles`}>
          <svg viewBox="0 0 42 42" role="img" aria-hidden="true">
            <circle cx="21" cy="21" r="15.9155" pathLength="100" />
            <circle cx="21" cy="21" r="15.9155" pathLength="100" strokeDasharray={`${coverage.coveragePercent} ${100 - coverage.coveragePercent}`} />
          </svg>
          <div className="succession-character-coverage-ring__copy"><strong>{coverage.coveragePercent}%</strong><span>explicit state coverage</span><small>{coverage.explicitCharacters} maintained profiles</small></div>
        </div>
        <dl className="succession-character-command-metrics">
          <div><dt>Active</dt><dd>{directoryCounts.active}</dd></div>
          <div><dt>Deceased</dt><dd>{directoryCounts.deceased}</dd></div>
          <div><dt>Exceptional</dt><dd>{directoryCounts.exceptional}</dd></div>
          <div><dt>All records</dt><dd>{characters.length}</dd></div>
          <div><dt>Visible</dt><dd>{visible.length}</dd></div>
          <div><dt>Layers</dt><dd>{coverage.roleLayers.length}</dd></div>
        </dl>
      </div>
    </section>

    <section className="succession-character-command-bar" aria-label="Character intelligence controls">
      <header className="succession-character-command-bar__heading">
        <div><span>Personnel query</span><strong>{visible.length} matching record{visible.length === 1 ? '' : 's'}</strong></div>
        <div className="succession-character-view-toggle" aria-label="Directory view">
          <button type="button" className={view === 'grid' ? 'is-active' : ''} aria-pressed={view === 'grid'} aria-label="Intelligence grid" onClick={() => setView('grid')}><LayoutGrid size={17} aria-hidden="true" /></button>
          <button type="button" className={view === 'index' ? 'is-active' : ''} aria-pressed={view === 'index'} aria-label="Compact index" onClick={() => setView('index')}><List size={18} aria-hidden="true" /></button>
        </div>
      </header>
      <div className="succession-character-filters succession-character-command-filters">
        <label><Search size={17} aria-hidden="true" /><span className="sr-only">Search characters</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, role, state, threat, allegiance…" /></label>
        <label><span>Role</span><select value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((item) => <option value={item} key={item}>{item === 'all' ? 'All roles' : roleLabel(item)}</option>)}</select></label>
        <label><span>Operational layer</span><select value={layer} onChange={(event) => setLayer(event.target.value)}><option value="all">All layers</option>{layers.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label><span>Life state</span><select value={life} onChange={(event) => setLife(event.target.value)}>{lifeStates.map((item) => <option value={item} key={item}>{item === 'all' ? 'All life states' : roleLabel(item)}</option>)}</select></label>
        <label><span>Threat level</span><select value={threat} onChange={(event) => setThreat(event.target.value)}>{threatStates.map((item) => <option value={item} key={item}>{item === 'all' ? 'All threat levels' : roleLabel(item)}</option>)}</select></label>
      </div>
      <div className="succession-character-active-filters" aria-label="Active filters">
        {!activeFilters.length && <span>No filters applied. Showing the complete canonical personnel archive.</span>}
        {activeFilters.map((item) => <button type="button" key={item.id} onClick={item.clear}>{item.label} <X size={12} aria-hidden="true" /></button>)}
        {!!activeFilters.length && <button type="button" className="is-reset" onClick={resetFilters}>Reset all</button>}
      </div>
    </section>

    <section className="succession-character-coverage" aria-label="Character state coverage by operational layer">
      {coverage.roleLayers.map((item) => <article key={item.id}><span>{item.label}</span><b>{item.explicit} / {item.total}</b><small>explicit profiles</small></article>)}
    </section>

    <section className="succession-character-grid" data-view={view} aria-label="Canonical character directory">
      {visible.map((character) => {
        const state = getCharacterCurrentState(character.id);
        const roleProfile = getCharacterRoleProfile(character.id);
        const classification = stateClass(state || character.status || {});
        return <article className={`succession-character-card is-${classification}`} key={character.id}>
          <div className="succession-character-card__visual">
            <EntityVisual entity={character} />
            <span className="succession-character-card__state"><Activity size={12} aria-hidden="true" /> {state?.life || character.status?.life || 'unknown state'}</span>
          </div>
          <div className="succession-character-card__classification"><EntityBadge entity={character} compact /><small className="succession-character-layer-label">{roleProfile?.label || 'Unclassified layer'}</small></div>
          <h3>{character.name}</h3>
          <p className="succession-character-card__summary">{state?.operationalState || character.summary}</p>
          <dl className="succession-character-card__facts">
            <StateFact label="Body">{state?.bodyState || 'No explicit state'}</StateFact>
            <StateFact label="Threat">{state?.threatLevel || 'Unrated'}</StateFact>
            <StateFact label="Protection">{state?.protectionState || 'Unresolved'}</StateFact>
            <StateFact label="Roles">{(character.roles || []).length}</StateFact>
          </dl>
          <button type="button" className="succession-character-card__action" onClick={() => onNavigate('characters', { entity: character.id })}>Open intelligence dossier <ArrowRight size={14} aria-hidden="true" /></button>
        </article>;
      })}
    </section>
    {!visible.length && <ArchiveState kind="empty" title="No matching characters" description="Clear the intelligence query or choose different role, layer, life-state, and threat filters." action={<button type="button" className="succession-button" onClick={resetFilters}>Reset personnel query</button>} />}
  </div>;
}

function CharacterDossier({ character, chapter, spoilerLimit, onChapterChange, onNavigate, characters }) {
  const [timelineKind, setTimelineKind] = useState('all');
  const dossier = getCharacterDossier(character.id, chapter);
  if (!dossier) return <ArchiveState kind="empty" title="Character dossier unavailable" description="The canonical character record could not be resolved." />;

  const index = characters.findIndex((item) => item.id === character.id);
  const previous = characters[index - 1];
  const next = characters[index + 1];
  const assignments = dossier.assignments?.assignments || [];
  const relationships = dossier.relationships?.relationships || [];
  const latestAppearance = dossier.appearances.at(-1)?.chapter;
  const roleProfile = dossier.roleProfile || {
    label: 'Unclassified operational role',
    mandate: 'No explicit mandate is published at this chapter.',
    authority: 'Authority remains unresolved.',
    assignmentRoles: [],
    relationshipCount: 0,
    responsibilities: [],
    vulnerabilities: [],
  };
  const visibleTimeline = timelineKind === 'all' ? dossier.lifetimeTimeline : dossier.lifetimeTimeline.filter((entry) => entry.kind === timelineKind);
  const timelineCounts = Object.fromEntries(timelineKinds.slice(1).map((kind) => [kind, dossier.lifetimeTimeline.filter((entry) => entry.kind === kind).length]));
  const checkpoints = [...new Set((dossier.timeline || []).map((record) => Number(record.chapterRange?.start)).filter((value) => Number.isFinite(value) && value <= spoilerLimit))].sort((left, right) => left - right);
  const previousCheckpoint = [...checkpoints].reverse().find((value) => value < chapter) || Math.max(338, chapter - 1);
  const nextCheckpoint = checkpoints.find((value) => value > chapter) || Math.min(spoilerLimit, chapter + 1);
  const setChapter = (value) => onChapterChange(Math.min(spoilerLimit, Math.max(338, Number(value) || spoilerLimit)));

  return <article className="succession-character-dossier">
    <header className="succession-character-dossier__header succession-character-command-profile" id="character-overview">
      <div className="succession-character-command-profile__topline">
        <button type="button" className="succession-character-back" onClick={() => onNavigate('characters')}><ArrowLeft size={15} aria-hidden="true" /> Character command</button>
        <span className="succession-character-command-profile__record">Personnel record · {character.id}</span>
      </div>
      <div className="succession-character-dossier__identity succession-character-command-identity">
        <div className="succession-character-command-identity__visual"><EntityVisual entity={character} /></div>
        <div className="succession-character-command-identity__copy">
          <div className="succession-character-command-identity__badges">
            <EntityBadge entity={character} />
            <span>{roleProfile.label}</span>
            <span>{dossier.state.life || 'unknown life state'}</span>
            <span>Ch. {chapter} intelligence</span>
          </div>
          <span className="succession-character-command-label">{(character.roles || []).slice(0, 6).map(roleLabel).join(' · ') || 'Role unresolved'}</span>
          <h2>{character.name}</h2>
          <p>{character.summary}</p>
          {!!(character.aliases || []).length && <div className="succession-character-command-identity__badges"><span>Aliases</span>{character.aliases.slice(0, 5).map((alias) => <span key={alias}>{alias}</span>)}</div>}
        </div>
      </div>
      <div className="succession-character-chapter succession-character-command-chapter">
        <div className="succession-character-command-chapter__copy"><span>State reconstruction boundary</span><strong>Chapter {chapter} of authorized Chapter {spoilerLimit}</strong></div>
        <div className="succession-character-command-chapter__controls">
          <button type="button" aria-label={`Previous state checkpoint, Chapter ${previousCheckpoint}`} onClick={() => setChapter(previousCheckpoint)} disabled={chapter <= 338}><ArrowLeft size={15} aria-hidden="true" /></button>
          <input aria-label="Character state chapter" type="number" min="338" max={spoilerLimit} value={chapter} onChange={(event) => setChapter(event.target.value)} />
          <button type="button" aria-label={`Next state checkpoint, Chapter ${nextCheckpoint}`} onClick={() => setChapter(nextCheckpoint)} disabled={chapter >= spoilerLimit}><ArrowRight size={15} aria-hidden="true" /></button>
          <button type="button" onClick={() => setChapter(spoilerLimit)} disabled={chapter === spoilerLimit}>Latest</button>
        </div>
      </div>
    </header>

    <nav className="succession-character-dossier-nav" aria-label="Character dossier sections">
      {timelineNav.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
    </nav>

    <section className="succession-character-state-board" id="character-state">
      <div><span>Operational state</span><h3>{dossier.state.operationalState}</h3><p>{dossier.state.allegianceState}</p></div>
      <dl>
        <StateFact label="Life">{dossier.state.life}</StateFact>
        <StateFact label="Body">{dossier.state.bodyState}</StateFact>
        <StateFact label="Consciousness">{dossier.state.consciousnessState}</StateFact>
        <StateFact label="Protection">{dossier.state.protectionState}</StateFact>
        <StateFact label="Threat">{dossier.state.threatLevel}</StateFact>
        <StateFact label="Nen knowledge">{dossier.state.nenKnowledge}</StateFact>
        <StateFact label="Location">{dossier.location?.name || 'No chapter-specific location resolved'}</StateFact>
        <StateFact label="Latest appearance">{latestAppearance ? `Chapter ${latestAppearance}` : 'No structured appearance row'}</StateFact>
      </dl>
    </section>

    <section className="succession-character-role-board">
      <header><Crown size={18} aria-hidden="true" /><div><span>Role-specific operations</span><h3>{roleProfile.label}</h3></div></header>
      <div className="succession-character-role-board__grid">
        <article><span>Mandate</span><p>{roleProfile.mandate}</p></article>
        <article><span>Authority</span><p>{roleProfile.authority}</p></article>
        <article><span>Active graph roles</span><p>{roleProfile.assignmentRoles.map(roleLabel).join(' · ') || 'No active assignment role at this chapter.'}</p></article>
        <article><span>Relationship reach</span><p>{roleProfile.relationshipCount} active relationship edge{roleProfile.relationshipCount === 1 ? '' : 's'} at Chapter {chapter}.</p></article>
      </div>
      <div className="succession-character-role-board__lists">
        <section><h4>Responsibilities</h4>{roleProfile.responsibilities.length ? <ul>{roleProfile.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No direct assignment objective is active at this chapter.</p>}</section>
        <section><h4>Vulnerabilities and unresolved pressure</h4>{roleProfile.vulnerabilities.length ? <ul>{roleProfile.vulnerabilities.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No structured vulnerability is published at this chapter.</p>}</section>
      </div>
    </section>

    <section className="succession-character-history-summary" aria-label="Character operational history totals">
      <article><Clock3 size={17} aria-hidden="true" /><span><b>{dossier.eventHistory.length}</b><small>events through chapter</small></span></article>
      <article><MapPin size={17} aria-hidden="true" /><span><b>{dossier.movementHistory.length}</b><small>movement records</small></span></article>
      <article><Shield size={17} aria-hidden="true" /><span><b>{dossier.assignmentHistory.length}</b><small>assignment records</small></span></article>
      <article><Network size={17} aria-hidden="true" /><span><b>{dossier.relationshipHistory.length}</b><small>relationship records</small></span></article>
    </section>

    <div className="succession-character-dossier__columns" id="character-operations">
      <section><header><Shield size={17} aria-hidden="true" /><div><span>Assignments</span><h3>Active operative, principal, subject, allegiance, and reporting roles</h3></div></header>{assignments.length ? <div>{assignments.map((assignment) => <EntityButton key={assignment.id} entity={assignment} onNavigate={onNavigate} note={`${roleLabel(assignment.assignmentType)} · ${assignment.status}`} />)}</div> : <p>No active assignment intersects Chapter {chapter}.</p>}</section>
      <section><header><Network size={17} aria-hidden="true" /><div><span>Relationships</span><h3>Active directed and reciprocal edges</h3></div></header>{relationships.length ? <div>{relationships.map((relationship) => {
        const otherId = relationship.sourceEntityId === character.id ? relationship.targetEntityId : relationship.sourceEntityId;
        return <EntityButton key={relationship.id} entity={getEntityById(otherId)} onNavigate={onNavigate} note={`${roleLabel(relationship.relationshipType)} · ${relationship.sentiment}`} />;
      })}</div> : <p>No active relationship edge intersects Chapter {chapter}.</p>}</section>
      <section><header><Sparkles size={17} aria-hidden="true" /><div><span>Nen</span><h3>Known abilities and conscious knowledge</h3></div></header>{dossier.abilities.length ? <div>{dossier.abilities.map((ability) => <EntityButton key={ability.id} entity={ability} onNavigate={onNavigate} note={ability.category || ability.classification?.nenTypes?.join(' · ')} />)}</div> : <p>No canonical ability is linked to this character.</p>}</section>
      <section><header><Activity size={17} aria-hidden="true" /><div><span>Active events</span><h3>Operations intersecting the selected chapter</h3></div></header>{dossier.events.length ? <div>{dossier.events.map((event) => <EntityButton key={event.id} entity={event} onNavigate={onNavigate} note={rangeLabel(event.chapterRange)} />)}</div> : <p>No event range intersects Chapter {chapter}.</p>}</section>
      <section><header><Building2 size={17} aria-hidden="true" /><div><span>Affiliations</span><h3>Published institutional roles</h3></div></header>{dossier.affiliations.length ? <div>{dossier.affiliations.map((affiliation) => <EntityButton key={`${affiliation.organizationId}-${affiliation.role}`} entity={getEntityById(affiliation.organizationId)} onNavigate={onNavigate} note={`${affiliation.role} · ${affiliation.status}`} />)}</div> : <p>No structured affiliation is published.</p>}</section>
      <section><header><MapPin size={17} aria-hidden="true" /><div><span>Protection and threats</span><h3>Assignments targeting this character</h3></div></header><dl><StateFact label="Protective assignments">{dossier.protectionAssignments.map((item) => item.name).join(' · ') || 'None active'}</StateFact><StateFact label="Threat assignments">{dossier.threatAssignments.map((item) => item.name).join(' · ') || 'None active'}</StateFact></dl></section>
    </div>

    <section className="succession-character-lifetime" id="character-chronology">
      <header><BookOpen size={17} aria-hidden="true" /><div><span>Lifetime chronology</span><h3>State, movement, assignments, relationships, events, and appearances</h3></div></header>
      <nav aria-label="Filter character lifetime chronology">{timelineKinds.map((kind) => <button type="button" className={timelineKind === kind ? 'is-active' : ''} aria-pressed={timelineKind === kind} onClick={() => setTimelineKind(kind)} key={kind}>{kind === 'all' ? `All ${dossier.lifetimeTimeline.length}` : `${roleLabel(kind)} ${timelineCounts[kind]}`}</button>)}</nav>
      {visibleTimeline.length ? <div className="succession-character-lifetime__lanes">{visibleTimeline.map((entry) => <article data-kind={entry.kind} className={intersectsChapter(entry.chapterRange, chapter) ? 'is-current' : ''} key={entry.id}>
        <span>{entry.kind} · {rangeLabel(entry.chapterRange)} · {entry.certainty}</span>
        <h4>{entry.label}</h4>
        <p>{entry.summary}</p>
        {entry.locationId && <small>{getEntityById(entry.locationId)?.name || entry.locationId}</small>}
        <TimelineLink entry={entry} onNavigate={onNavigate} />
      </article>)}</div> : <p>No {timelineKind === 'all' ? '' : `${timelineKind} `}records are available through Chapter {chapter}.</p>}
    </section>

    <section className="succession-character-timeline"><header><BookOpen size={17} aria-hidden="true" /><div><span>State history</span><h3>Explicit chapter-bounded state transitions</h3></div></header>{dossier.timeline.length ? <div>{dossier.timeline.map((record) => <article className={record.id === dossier.state.id ? 'is-active' : ''} aria-current={record.id === dossier.state.id ? 'true' : undefined} key={record.id}><span>{rangeLabel(record.chapterRange)} · {record.certainty}</span><h4>{record.operationalState}</h4><p>{record.bodyState} · {record.consciousnessState}</p>{record.openQuestions.length > 0 && <ul>{record.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul>}</article>)}</div> : <p>This character currently uses the graph-derived fallback state.</p>}</section>

    {!!dossier.sources.length && <section className="succession-character-sources" id="character-evidence"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence</span><h3>Character, state, movement, assignment, relationship, and event sources</h3></div></header>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</section>}

    <footer className="succession-character-dossier__footer">
      {previous ? <button type="button" onClick={() => onNavigate('characters', { entity: previous.id, chapter })}><ArrowLeft size={14} aria-hidden="true" /><span><small>Previous personnel record</small>{previous.name}</span></button> : <span />}
      {next && <button type="button" onClick={() => onNavigate('characters', { entity: next.id, chapter })}><span><small>Next personnel record</small>{next.name}</span><ArrowRight size={14} aria-hidden="true" /></button>}
    </footer>
  </article>;
}

export default function CharactersWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const characters = useMemo(() => [...getEntitiesByType('character')].sort((left, right) => left.name.localeCompare(right.name)), []);
  const selected = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedChapter = Number(routeParams.chapter);
  const [chapter, setChapter] = useState(requestedChapter || spoilerLimit);

  useEffect(() => {
    setChapter(requestedChapter || spoilerLimit);
  }, [requestedChapter, spoilerLimit, selected?.id]);

  if (selected?.entityType === 'character') {
    return <CharacterDossier character={selected} chapter={chapter} spoilerLimit={spoilerLimit} onChapterChange={(value) => { setChapter(value); onNavigate('characters', { entity: selected.id, chapter: value }); }} onNavigate={onNavigate} characters={characters} />;
  }

  return <CharacterDirectory characters={characters} onNavigate={onNavigate} />;
}