import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  MapPin,
  Network,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getCharacterCurrentState,
  getCharacterDossier,
  getCharacterStateTimeline,
  getEntitiesByType,
  getEntityById,
} from '../../data/succession/successionData';
import {
  ArchiveState,
  EntityBadge,
  EntityLink,
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveCharacterWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const roleLabel = (value) => String(value || '').replaceAll('-', ' ');
const rangeLabel = (range) => `Ch. ${range.start}${range.end === null || range.end === undefined ? '–current' : range.end === range.start ? '' : `–${range.end}`}`;

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

function CharacterDirectory({ characters, onNavigate }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const roles = useMemo(() => ['all', ...new Set(characters.flatMap((character) => character.roles || []))], [characters]);
  const visible = useMemo(() => characters.filter((character) => {
    const state = getCharacterCurrentState(character.id);
    const roleMatch = role === 'all' || (character.roles || []).includes(role);
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
    ].join(' '));
    return roleMatch && (!query.trim() || text.includes(normalize(query)));
  }), [characters, query, role]);
  const explicitProfiles = characters.filter((character) => getCharacterStateTimeline(character.id).length > 0).length;

  return <div className="succession-character-workspace">
    <section className="succession-character-hero">
      <div><span><Users size={16} /> Batch 2 · People state graph</span><h2>Characters as chapter-bounded operational records</h2><p>Search the cast by identity, role, body state, threat, protection, allegiance, and current operation. Explicit state timelines remain separate from graph-derived fallback summaries.</p></div>
      <dl><div><dt>Characters</dt><dd>{characters.length}</dd></div><div><dt>Explicit state profiles</dt><dd>{explicitProfiles}</dd></div><div><dt>Visible</dt><dd>{visible.length}</dd></div></dl>
    </section>

    <section className="succession-character-filters" aria-label="Character filters">
      <label><Search size={16} /><span className="sr-only">Search characters</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, role, state, threat, allegiance…" /></label>
      <label><span>Role</span><select value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((item) => <option value={item} key={item}>{item === 'all' ? 'All roles' : roleLabel(item)}</option>)}</select></label>
    </section>

    <section className="succession-character-grid" aria-label="Canonical character directory">
      {visible.map((character) => {
        const state = getCharacterCurrentState(character.id);
        return <article key={character.id}>
          <EntityVisual entity={character} />
          <div className="succession-character-grid__meta"><EntityBadge entity={character} compact /><span>{state?.life || character.status?.life || 'unknown'}</span></div>
          <h3>{character.name}</h3>
          <p>{state?.operationalState || character.summary}</p>
          <dl><StateFact label="Body">{state?.bodyState}</StateFact><StateFact label="Threat">{state?.threatLevel}</StateFact></dl>
          <button type="button" onClick={() => onNavigate('characters', { entity: character.id })}>Open dossier <ArrowRight size={14} /></button>
        </article>;
      })}
    </section>
    {!visible.length && <ArchiveState kind="empty" title="No matching characters" description="Clear the state search or choose a different role." />}
  </div>;
}

function CharacterDossier({ character, chapter, spoilerLimit, onChapterChange, onNavigate, characters }) {
  const dossier = getCharacterDossier(character.id, chapter);
  if (!dossier) return <ArchiveState kind="empty" title="Character dossier unavailable" description="The canonical character record could not be resolved." />;

  const index = characters.findIndex((item) => item.id === character.id);
  const previous = characters[index - 1];
  const next = characters[index + 1];
  const assignments = dossier.assignments?.assignments || [];
  const relationships = dossier.relationships?.relationships || [];
  const latestAppearance = dossier.appearances.at(-1)?.chapter;

  return <article className="succession-character-dossier">
    <header className="succession-character-dossier__header">
      <button type="button" className="succession-character-back" onClick={() => onNavigate('characters')}><ArrowLeft size={15} /> Character directory</button>
      <div className="succession-character-dossier__identity">
        <EntityVisual entity={character} />
        <div><EntityBadge entity={character} /><span>{(character.roles || []).slice(0, 4).map(roleLabel).join(' · ')}</span><h2>{character.name}</h2><p>{character.summary}</p></div>
      </div>
      <label className="succession-character-chapter"><span>State at chapter</span><input type="number" min="338" max={spoilerLimit} value={chapter} onChange={(event) => onChapterChange(Math.min(spoilerLimit, Math.max(338, Number(event.target.value) || spoilerLimit)))} /></label>
    </header>

    <section className="succession-character-state-board">
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

    <div className="succession-character-dossier__columns">
      <section><header><Shield size={17} /><div><span>Assignments</span><h3>Operative, principal, subject, allegiance, and reporting roles</h3></div></header>{assignments.length ? <div>{assignments.map((assignment) => <EntityButton key={assignment.id} entity={assignment} onNavigate={onNavigate} note={`${roleLabel(assignment.assignmentType)} · ${assignment.status}`} />)}</div> : <p>No active assignment intersects Chapter {chapter}.</p>}</section>
      <section><header><Network size={17} /><div><span>Relationships</span><h3>Active directed and reciprocal edges</h3></div></header>{relationships.length ? <div>{relationships.map((relationship) => {
        const otherId = relationship.sourceEntityId === character.id ? relationship.targetEntityId : relationship.sourceEntityId;
        return <EntityButton key={relationship.id} entity={getEntityById(otherId)} onNavigate={onNavigate} note={`${roleLabel(relationship.relationshipType)} · ${relationship.sentiment}`} />;
      })}</div> : <p>No active relationship edge intersects Chapter {chapter}.</p>}</section>
      <section><header><Sparkles size={17} /><div><span>Nen</span><h3>Known abilities and conscious knowledge</h3></div></header>{dossier.abilities.length ? <div>{dossier.abilities.map((ability) => <EntityButton key={ability.id} entity={ability} onNavigate={onNavigate} note={ability.category || ability.classification?.nenTypes?.join(' · ')} />)}</div> : <p>No canonical ability is linked to this character.</p>}</section>
      <section><header><Activity size={17} /><div><span>Events</span><h3>Operations active at the selected chapter</h3></div></header>{dossier.events.length ? <div>{dossier.events.map((event) => <EntityButton key={event.id} entity={event} onNavigate={onNavigate} note={rangeLabel(event.chapterRange)} />)}</div> : <p>No event range intersects Chapter {chapter}.</p>}</section>
      <section><header><Building2 size={17} /><div><span>Affiliations</span><h3>Published institutional roles</h3></div></header>{dossier.affiliations.length ? <div>{dossier.affiliations.map((affiliation) => <EntityButton key={`${affiliation.organizationId}-${affiliation.role}`} entity={getEntityById(affiliation.organizationId)} onNavigate={onNavigate} note={`${affiliation.role} · ${affiliation.status}`} />)}</div> : <p>No structured affiliation is published.</p>}</section>
      <section><header><MapPin size={17} /><div><span>Protection and threats</span><h3>Assignments targeting this character</h3></div></header><dl><StateFact label="Protective assignments">{dossier.protectionAssignments.map((item) => item.name).join(' · ') || 'None active'}</StateFact><StateFact label="Threat assignments">{dossier.threatAssignments.map((item) => item.name).join(' · ') || 'None active'}</StateFact></dl></section>
    </div>

    <section className="succession-character-timeline"><header><BookOpen size={17} /><div><span>State history</span><h3>Explicit chapter-bounded records</h3></div></header>{dossier.timeline.length ? <div>{dossier.timeline.map((record) => <article className={record.id === dossier.state.id ? 'is-active' : ''} key={record.id}><span>{rangeLabel(record.chapterRange)} · {record.certainty}</span><h4>{record.operationalState}</h4><p>{record.bodyState} · {record.consciousnessState}</p>{record.openQuestions.length > 0 && <ul>{record.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul>}</article>)}</div> : <p>This character currently uses the graph-derived fallback state.</p>}</section>

    {!!dossier.sources.length && <section className="succession-character-sources"><header><BookOpen size={17} /><div><span>Evidence</span><h3>Character and state sources</h3></div></header>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</section>}

    <footer className="succession-character-dossier__footer">
      {previous ? <button type="button" onClick={() => onNavigate('characters', { entity: previous.id, chapter })}><ArrowLeft size={14} /><span><small>Previous</small>{previous.name}</span></button> : <span />}
      {next && <button type="button" onClick={() => onNavigate('characters', { entity: next.id, chapter })}><span><small>Next</small>{next.name}</span><ArrowRight size={14} /></button>}
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
