import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Eye,
  Filter,
  GitBranch,
  MapPin,
  Search,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  getActiveAssignmentsAtChapter,
  getAssignmentChain,
  getAssignmentSnapshot,
  getEntitiesByType,
  getEntityById,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import {
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveAssignmentWorkspace.css';

const assignments = getEntitiesByType('assignment');
const characters = getEntitiesByType('character');
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const titleCase = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const unique = (values) => [...new Set(values.filter(Boolean))];

const rangeLabel = (range) => {
  if (!range?.start) return 'Unassigned';
  if (range.end === null || range.end === undefined) return `${range.start}–current`;
  return range.start === range.end ? String(range.start) : `${range.start}–${range.end}`;
};

const assignmentOrder = (left, right) => left.chapterRange.start - right.chapterRange.start
  || String(left.name).localeCompare(String(right.name));

function LinkedEntity({ entity, label, onNavigate }) {
  if (!entity) return null;
  return <button type="button" className={`succession-assignment-linked-entity is-${entity.entityType}`} onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><small>{label || titleCase(entity.entityType)}</small><b>{entity.name}</b></span>
    <ArrowRight size={13} aria-hidden="true" />
  </button>;
}

function AssignmentCard({ assignment, onOpen }) {
  const chain = getAssignmentChain(assignment.id);
  return <button type="button" className={`succession-assignment-card is-${assignment.status} is-${assignment.secrecy}`} onClick={() => onOpen(assignment)}>
    <EntityVisual entity={chain?.person} compact />
    <div><small>{titleCase(assignment.assignmentType)} · Ch. {rangeLabel(assignment.chapterRange)}</small><h3>{assignment.name}</h3><p>{assignment.summary}</p><em>{chain?.subject?.name || chain?.principal?.name || 'No named subject'} · {chain?.location?.name || 'Location unassigned'}</em></div>
    <dl><div><dt>Status</dt><dd>{titleCase(assignment.status)}</dd></div><div><dt>Secrecy</dt><dd>{titleCase(assignment.secrecy)}</dd></div><div><dt>Events</dt><dd>{assignment.relatedEventIds?.length || 0}</dd></div></dl>
  </button>;
}

export default function SuccessionArchiveAssignmentWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const requestedPrince = Number(routeParams.prince || routeParams.room);
  const princeEntity = Number.isFinite(requestedPrince) && requestedPrince
    ? characters.find((character) => character.princeOrder === requestedPrince)
    : null;
  const [query, setQuery] = useState(routeParams.search || '');
  const [type, setType] = useState(routeParams.type || 'all');
  const [status, setStatus] = useState(routeParams.status || 'all');
  const [secrecy, setSecrecy] = useState(routeParams.secrecy || 'all');
  const [focus, setFocus] = useState(routeParams.entity || princeEntity?.id || '');
  const [snapshotChapter, setSnapshotChapter] = useState(Number(routeParams.chapter) || spoilerLimit);

  useEffect(() => {
    setFocus(routeParams.entity || princeEntity?.id || '');
  }, [princeEntity?.id, routeParams.entity]);

  useEffect(() => {
    setSnapshotChapter((current) => Math.min(Number(current) || spoilerLimit, spoilerLimit));
  }, [spoilerLimit]);

  const types = useMemo(() => unique(assignments.map((assignment) => assignment.assignmentType)).sort(), []);
  const statuses = useMemo(() => unique(assignments.map((assignment) => assignment.status)).sort(), []);
  const secrecyLevels = useMemo(() => unique(assignments.map((assignment) => assignment.secrecy)).sort(), []);

  const visible = useMemo(() => [...assignments].sort(assignmentOrder).filter((assignment) => {
    const chain = getAssignmentChain(assignment.id);
    const searchable = normalize([
      assignment.name,
      assignment.summary,
      assignment.objective,
      assignment.authorityBasis,
      ...(assignment.aliases || []),
      ...(assignment.operationalNotes || []),
      chain?.person?.name,
      chain?.principal?.name,
      chain?.subject?.name,
      chain?.allegiance?.name,
      chain?.reporting?.name,
      chain?.location?.name,
    ].join(' '));
    return (type === 'all' || assignment.assignmentType === type)
      && (status === 'all' || assignment.status === status)
      && (secrecy === 'all' || assignment.secrecy === secrecy)
      && (!query.trim() || searchable.includes(normalize(query)));
  }), [query, secrecy, status, type]);

  const selectedEntity = focus ? getEntityById(focus) : null;
  const selectedAssignment = selectedEntity?.entityType === 'assignment' ? selectedEntity : null;
  const selectedCharacter = selectedEntity?.entityType === 'character' ? selectedEntity : null;
  const selectedChain = selectedAssignment ? getAssignmentChain(selectedAssignment.id) : null;
  const selectedSources = selectedAssignment ? getSourcesForEntity(selectedAssignment.id) : [];
  const characterSnapshot = selectedCharacter ? getAssignmentSnapshot(selectedCharacter.id, snapshotChapter) : null;
  const chapterAssignments = getActiveAssignmentsAtChapter(snapshotChapter);

  const openAssignment = (assignment) => {
    setFocus(assignment.id);
    onNavigate('bodyguards', { entity: assignment.id, chapter: snapshotChapter });
  };

  const openCharacterSnapshot = (character) => {
    setFocus(character.id);
    onNavigate('bodyguards', { entity: character.id, chapter: snapshotChapter });
  };

  const closeFocus = () => {
    setFocus('');
    onNavigate('bodyguards', { chapter: snapshotChapter });
  };

  const resetFilters = () => {
    setQuery('');
    setType('all');
    setStatus('all');
    setSecrecy('all');
  };

  const activeFilterCount = [query, type !== 'all', status !== 'all', secrecy !== 'all'].filter(Boolean).length;
  const namedPersonnel = new Set(assignments.map((assignment) => assignment.personId)).size;
  const covertCount = assignments.filter((assignment) => assignment.secrecy === 'covert').length;

  return <div className="succession-canonical-assignments">
    <section className="succession-canonical-assignments__hero">
      <div><span>Canonical assignment graph</span><h2>Protection, surveillance, instruction, custody, infiltration, and assassination</h2><p>Assignments are stored as chapter-bounded operational records. Physical location, formal principal, protected or targeted subject, allegiance, reporting line, secrecy, succession chain, and related events remain separate fields.</p></div>
      <dl><div><dt>Assignments</dt><dd>{assignments.length}</dd></div><div><dt>Personnel</dt><dd>{namedPersonnel}</dd></div><div><dt>Covert records</dt><dd>{covertCount}</dd></div><div><dt>Snapshot</dt><dd>Ch. {snapshotChapter}</dd></div></dl>
    </section>

    <section className="succession-assignment-filter-panel" aria-labelledby="succession-assignment-filter-title">
      <header><Filter size={17} aria-hidden="true" /><div><span>Operational filters</span><h3 id="succession-assignment-filter-title">Filter the assignment graph</h3></div><b>{activeFilterCount} active</b></header>
      <label className="succession-assignment-filter-panel__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search assignments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, prince, room, objective, reporting line…" /></label>
      <div className="succession-assignment-filter-panel__fields">
        <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All assignment types</option>{types.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{statuses.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Secrecy</span><select value={secrecy} onChange={(event) => setSecrecy(event.target.value)}><option value="all">All secrecy levels</option>{secrecyLevels.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Snapshot chapter</span><input type="number" min="340" max={spoilerLimit} value={snapshotChapter} onChange={(event) => setSnapshotChapter(Math.min(spoilerLimit, Math.max(340, Number(event.target.value) || 340)))} /></label>
      </div>
      <footer><span role="status" aria-live="polite">Showing {visible.length} of {assignments.length} records · {chapterAssignments.length} active at Chapter {snapshotChapter}.</span><button type="button" disabled={!activeFilterCount} onClick={resetFilters}>Clear filters</button></footer>
    </section>

    {!selectedAssignment && !selectedCharacter && <section className="succession-assignment-directory" aria-label="Canonical assignment records">
      {visible.map((assignment) => <AssignmentCard assignment={assignment} onOpen={openAssignment} key={assignment.id} />)}
      {!visible.length && <div className="succession-assignment-empty"><Shield size={22} aria-hidden="true" /><h3>No assignments match these filters</h3><p>Clear one or more operational facets to restore the graph.</p><button type="button" onClick={resetFilters}>Reset assignment filters</button></div>}
    </section>}

    {selectedCharacter && characterSnapshot && <article className="succession-assignment-character-snapshot">
      <header><button type="button" onClick={closeFocus}><ArrowLeft size={14} /> Assignment directory</button><EntityVisual entity={selectedCharacter} /><div><span>Chapter {characterSnapshot.chapter} role snapshot</span><h2>{selectedCharacter.name}</h2><p>{selectedCharacter.summary}</p></div><dl><div><dt>All active roles</dt><dd>{characterSnapshot.assignments.length}</dd></div><div><dt>As operative</dt><dd>{characterSnapshot.byRole.person.length}</dd></div><div><dt>As subject</dt><dd>{characterSnapshot.byRole.subject.length}</dd></div><div><dt>Reports received</dt><dd>{characterSnapshot.byRole.reporting.length}</dd></div></dl></header>
      <section><header><Clock3 size={17} /><div><span>Assignment snapshot</span><h3>Operational roles active at Chapter {characterSnapshot.chapter}</h3></div></header>{characterSnapshot.assignments.length ? <div>{characterSnapshot.assignments.map((assignment) => <AssignmentCard assignment={assignment} onOpen={openAssignment} key={assignment.id} />)}</div> : <p>No assignment record connects this character to the selected chapter.</p>}</section>
    </article>}

    {selectedAssignment && selectedChain && <article className="succession-assignment-dossier" aria-labelledby="succession-assignment-dossier-title">
      <header><button type="button" className="succession-assignment-dossier__close" onClick={closeFocus}><ArrowLeft size={14} /> Assignment directory</button><EntityVisual entity={selectedChain.person} /><div><span>{titleCase(selectedAssignment.assignmentType)} · Ch. {rangeLabel(selectedAssignment.chapterRange)}</span><h2 id="succession-assignment-dossier-title">{selectedAssignment.name}</h2><p>{selectedAssignment.summary}</p></div><dl><div><dt>Status</dt><dd>{titleCase(selectedAssignment.status)}</dd></div><div><dt>Secrecy</dt><dd>{titleCase(selectedAssignment.secrecy)}</dd></div><div><dt>Certainty</dt><dd>{titleCase(selectedAssignment.certainty)}</dd></div><div><dt>Canon layer</dt><dd>{titleCase(selectedAssignment.canonLevel)}</dd></div></dl></header>

      <section className="succession-assignment-command-chain"><header><GitBranch size={17} /><div><span>Command and obligation</span><h3>Who acts, for whom, against whom, and where</h3></div></header><div>
        <LinkedEntity entity={selectedChain.person} label="Assigned person" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.principal} label="Principal" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.subject} label="Protected or targeted subject" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.allegiance} label="Allegiance" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.reporting} label="Reports to" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.location} label="Operational location" onNavigate={onNavigate} />
      </div></section>

      <section className="succession-assignment-purpose-grid">
        <article><UserCheck size={17} /><span>Objective</span><p>{selectedAssignment.objective}</p></article>
        <article><Shield size={17} /><span>Authority basis</span><p>{selectedAssignment.authorityBasis}</p></article>
        <article><Eye size={17} /><span>Operational notes</span>{selectedAssignment.operationalNotes?.length ? <ul>{selectedAssignment.operationalNotes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>No additional operational note is published.</p>}</article>
      </section>

      {(selectedChain.predecessor || selectedChain.successor) && <section className="succession-assignment-succession-chain"><header><Activity size={17} /><div><span>Assignment succession</span><h3>Previous and replacement records</h3></div></header><div>{selectedChain.predecessor && <AssignmentCard assignment={selectedChain.predecessor} onOpen={openAssignment} />}{selectedChain.successor && <AssignmentCard assignment={selectedChain.successor} onOpen={openAssignment} />}</div></section>}

      {!!selectedChain.events.length && <section className="succession-assignment-events"><header><Activity size={17} /><div><span>Related operations</span><h3>Events connected to this assignment</h3></div></header><div>{selectedChain.events.map((event) => <LinkedEntity entity={event} label={`Ch. ${rangeLabel(event.chapterRange)}`} onNavigate={onNavigate} key={event.id} />)}</div></section>}

      {!!selectedSources.length && <section className="succession-assignment-sources"><header><BookOpen size={17} /><div><span>Evidence trail</span><h3>Assignment sources</h3></div></header><div>{selectedSources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}
    </article>}

    {!selectedAssignment && !selectedCharacter && <section className="succession-assignment-snapshot-board"><header><Clock3 size={17} /><div><span>Chapter snapshot</span><h3>{chapterAssignments.length} operational records active at Chapter {snapshotChapter}</h3></div></header><div>{chapterAssignments.slice(0, 12).map((assignment) => { const chain = getAssignmentChain(assignment.id); return <button type="button" onClick={() => openAssignment(assignment)} key={assignment.id}><EntityVisual entity={chain?.person} compact /><span><small>{titleCase(assignment.assignmentType)} · {titleCase(assignment.secrecy)}</small><b>{assignment.name}</b><em>{chain?.subject?.name || chain?.principal?.name || 'No named subject'}</em></span><MapPin size={13} /></button>; })}</div>{chapterAssignments.length > 12 && <p>{chapterAssignments.length - 12} additional active assignments remain available through the filters above.</p>}</section>}

    {!selectedAssignment && !selectedCharacter && <section className="succession-assignment-personnel"><header><Users size={17} /><div><span>Personnel index</span><h3>People with canonical operational records</h3></div></header><div>{unique(assignments.map((assignment) => assignment.personId)).map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)).map((person) => <button type="button" onClick={() => openCharacterSnapshot(person)} key={person.id}><EntityVisual entity={person} compact /><span><b>{person.name}</b><small>{getAssignmentSnapshot(person.id, snapshotChapter)?.assignments.length || 0} active at Ch. {snapshotChapter}</small></span></button>)}</div></section>}
  </div>;
}
