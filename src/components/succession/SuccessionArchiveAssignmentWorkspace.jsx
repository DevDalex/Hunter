import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Clock3,
  Eye,
  Filter,
  GitBranch,
  LayoutGrid,
  List,
  LockKeyhole,
  MapPin,
  Network,
  RotateCcw,
  Search,
  Shield,
  SlidersHorizontal,
  Table2,
  Target,
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
const RESULT_BATCH = 18;

const rangeLabel = (range) => {
  if (!range?.start) return 'Unassigned';
  if (range.end === null || range.end === undefined) return `${range.start}–current`;
  return range.start === range.end ? String(range.start) : `${range.start}–${range.end}`;
};

const assignmentIsActiveAt = (assignment, chapter) => assignment.chapterRange.start <= chapter
  && (assignment.chapterRange.end === null || assignment.chapterRange.end === undefined || assignment.chapterRange.end >= chapter);

const assignmentOrder = (left, right) => left.chapterRange.start - right.chapterRange.start
  || String(left.name).localeCompare(String(right.name));

const sortAssignments = (records, sortBy) => [...records].sort((left, right) => {
  const leftChain = getAssignmentChain(left.id);
  const rightChain = getAssignmentChain(right.id);
  if (sortBy === 'chapter-desc') return right.chapterRange.start - left.chapterRange.start || String(left.name).localeCompare(String(right.name));
  if (sortBy === 'name') return String(left.name).localeCompare(String(right.name));
  if (sortBy === 'type') return String(left.assignmentType).localeCompare(String(right.assignmentType)) || assignmentOrder(left, right);
  if (sortBy === 'personnel') return String(leftChain?.person?.name || '').localeCompare(String(rightChain?.person?.name || '')) || assignmentOrder(left, right);
  return assignmentOrder(left, right);
});

function LinkedEntity({ entity, label, onNavigate }) {
  if (!entity) return null;
  return <button type="button" className={`succession-assignment-linked-entity is-${entity.entityType}`} onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><small>{label || titleCase(entity.entityType)}</small><b>{entity.name}</b></span>
    <ArrowRight size={13} aria-hidden="true" />
  </button>;
}

function AssignmentCard({ assignment, snapshotChapter, onOpen }) {
  const chain = getAssignmentChain(assignment.id);
  const active = assignmentIsActiveAt(assignment, snapshotChapter);
  return <button type="button" className={`succession-assignment-card is-${assignment.status} is-${assignment.secrecy}${active ? ' is-active-at-snapshot' : ''}`} onClick={() => onOpen(assignment)}>
    <div className="succession-assignment-card__visual"><EntityVisual entity={chain?.person} compact /><span>{active ? 'Live' : 'Archive'}</span></div>
    <div className="succession-assignment-card__copy"><small>{titleCase(assignment.assignmentType)} · Ch. {rangeLabel(assignment.chapterRange)}</small><h3>{assignment.name}</h3><p>{assignment.summary}</p><em>{chain?.subject?.name || chain?.principal?.name || 'No named subject'} · {chain?.location?.name || 'Location unassigned'}</em></div>
    <dl><div><dt>Status</dt><dd>{titleCase(assignment.status)}</dd></div><div><dt>Secrecy</dt><dd>{titleCase(assignment.secrecy)}</dd></div><div><dt>Events</dt><dd>{assignment.relatedEventIds?.length || 0}</dd></div></dl>
    <span className="succession-assignment-card__action">Open operational record <ArrowRight size={13} aria-hidden="true" /></span>
  </button>;
}

function AssignmentLedgerRow({ assignment, snapshotChapter, onOpen }) {
  const chain = getAssignmentChain(assignment.id);
  const active = assignmentIsActiveAt(assignment, snapshotChapter);
  return <button type="button" className={`succession-assignment-ledger-row${active ? ' is-active' : ''}`} onClick={() => onOpen(assignment)}>
    <EntityVisual entity={chain?.person} compact />
    <span><small>{chain?.person?.name || 'Unnamed operative'}</small><b>{assignment.name}</b></span>
    <span><small>Subject / principal</small><b>{chain?.subject?.name || chain?.principal?.name || 'Unspecified'}</b></span>
    <span><small>Type</small><b>{titleCase(assignment.assignmentType)}</b></span>
    <span><small>Window</small><b>Ch. {rangeLabel(assignment.chapterRange)}</b></span>
    <span className={`is-${assignment.secrecy}`}><LockKeyhole size={12} aria-hidden="true" /> {titleCase(assignment.secrecy)}</span>
    <ArrowRight size={14} aria-hidden="true" />
  </button>;
}

function AssignmentTable({ records, snapshotChapter, onOpen, onOpenCharacter }) {
  return <div className="succession-assignment-table-wrap" role="region" aria-label="Assignment operations table" tabIndex="0">
    <table className="succession-assignment-table">
      <thead><tr><th>Operative</th><th>Assignment</th><th>Type</th><th>Subject / principal</th><th>Location</th><th>Chapter window</th><th>Status</th><th>Secrecy</th><th><span className="sr-only">Open record</span></th></tr></thead>
      <tbody>{records.map((assignment) => {
        const chain = getAssignmentChain(assignment.id);
        const active = assignmentIsActiveAt(assignment, snapshotChapter);
        return <tr className={active ? 'is-active' : ''} key={assignment.id}>
          <td><button type="button" className="succession-assignment-table__person" onClick={() => chain?.person && onOpenCharacter(chain.person)}><EntityVisual entity={chain?.person} compact /><span><b>{chain?.person?.name || 'Unknown'}</b><small>{active ? `Active at Ch. ${snapshotChapter}` : 'Outside snapshot'}</small></span></button></td>
          <th scope="row"><span>{assignment.name}</span><small>{assignment.summary}</small></th>
          <td>{titleCase(assignment.assignmentType)}</td>
          <td>{chain?.subject?.name || chain?.principal?.name || 'Unspecified'}</td>
          <td>{chain?.location?.name || 'Unassigned'}</td>
          <td>Ch. {rangeLabel(assignment.chapterRange)}</td>
          <td><span className={`succession-assignment-state is-${assignment.status}`}>{titleCase(assignment.status)}</span></td>
          <td><span className={`succession-assignment-state is-${assignment.secrecy}`}>{titleCase(assignment.secrecy)}</span></td>
          <td><button type="button" className="succession-assignment-table__open" onClick={() => onOpen(assignment)}>Open <ArrowRight size={12} aria-hidden="true" /></button></td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
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
  const [scope, setScope] = useState(routeParams.scope || 'all');
  const [sortBy, setSortBy] = useState(routeParams.sort || 'chapter-asc');
  const [viewMode, setViewMode] = useState(routeParams.view || 'cards');
  const [focus, setFocus] = useState(routeParams.entity || princeEntity?.id || '');
  const [snapshotChapter, setSnapshotChapter] = useState(Number(routeParams.chapter) || spoilerLimit);
  const [resultLimit, setResultLimit] = useState(RESULT_BATCH);

  useEffect(() => {
    setFocus(routeParams.entity || princeEntity?.id || '');
  }, [princeEntity?.id, routeParams.entity]);

  useEffect(() => {
    setSnapshotChapter((current) => Math.min(Number(current) || spoilerLimit, spoilerLimit));
  }, [spoilerLimit]);

  const types = useMemo(() => unique(assignments.map((assignment) => assignment.assignmentType)).sort(), []);
  const statuses = useMemo(() => unique(assignments.map((assignment) => assignment.status)).sort(), []);
  const secrecyLevels = useMemo(() => unique(assignments.map((assignment) => assignment.secrecy)).sort(), []);
  const chapterAssignments = useMemo(() => getActiveAssignmentsAtChapter(snapshotChapter), [snapshotChapter]);
  const chapterAssignmentIds = useMemo(() => new Set(chapterAssignments.map((assignment) => assignment.id)), [chapterAssignments]);

  const visible = useMemo(() => sortAssignments(assignments.filter((assignment) => {
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
    return (scope === 'all' || chapterAssignmentIds.has(assignment.id))
      && (type === 'all' || assignment.assignmentType === type)
      && (status === 'all' || assignment.status === status)
      && (secrecy === 'all' || assignment.secrecy === secrecy)
      && (!query.trim() || searchable.includes(normalize(query)));
  }), sortBy), [chapterAssignmentIds, query, scope, secrecy, sortBy, status, type]);

  useEffect(() => setResultLimit(RESULT_BATCH), [query, scope, secrecy, sortBy, status, type, viewMode]);

  const selectedEntity = focus ? getEntityById(focus) : null;
  const selectedAssignment = selectedEntity?.entityType === 'assignment' ? selectedEntity : null;
  const selectedCharacter = selectedEntity?.entityType === 'character' ? selectedEntity : null;
  const selectedChain = selectedAssignment ? getAssignmentChain(selectedAssignment.id) : null;
  const selectedSources = selectedAssignment ? getSourcesForEntity(selectedAssignment.id) : [];
  const characterSnapshot = selectedCharacter ? getAssignmentSnapshot(selectedCharacter.id, snapshotChapter) : null;
  const displayed = visible.slice(0, resultLimit);
  const remaining = Math.max(0, visible.length - displayed.length);

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
    setScope('all');
  };

  const activeFilterCount = [query, type !== 'all', status !== 'all', secrecy !== 'all', scope !== 'all'].filter(Boolean).length;
  const namedPersonnel = new Set(assignments.map((assignment) => assignment.personId)).size;
  const covertCount = assignments.filter((assignment) => assignment.secrecy === 'covert').length;
  const endedCount = assignments.filter((assignment) => assignment.status === 'ended').length;
  const typeSummary = types.map((assignmentType) => {
    const records = assignments.filter((assignment) => assignment.assignmentType === assignmentType);
    return {
      type: assignmentType,
      total: records.length,
      active: records.filter((assignment) => chapterAssignmentIds.has(assignment.id)).length,
      covert: records.filter((assignment) => assignment.secrecy === 'covert').length,
    };
  }).sort((left, right) => right.total - left.total || left.type.localeCompare(right.type));

  return <div className="succession-canonical-assignments succession-assignment-command">
    <section className="succession-canonical-assignments__hero">
      <div className="succession-assignment-command__hero-copy"><span><Network size={15} aria-hidden="true" /> Canonical operations command</span><h2>Who protects, watches, teaches, reports, infiltrates, and targets whom</h2><p>Assignments remain chapter-bounded operational records. Operative, principal, subject, allegiance, reporting line, physical location, secrecy, succession chain, and related events are kept distinct so the interface never turns proximity into loyalty.</p><div><span><Shield size={13} aria-hidden="true" /> Chapter-safe snapshot</span><span><GitBranch size={13} aria-hidden="true" /> Command chains preserved</span><span><LockKeyhole size={13} aria-hidden="true" /> Secrecy remains explicit</span></div></div>
      <div className="succession-assignment-command__signal" aria-hidden="true"><i /><i /><i /><i /><strong>{chapterAssignments.length}</strong><span>active at Ch. {snapshotChapter}</span></div>
    </section>

    <div className="succession-assignment-command__metrics" role="group" aria-label="Assignment archive metrics"><div><span className="succession-assignment-command__metric-label">Total records</span><strong>{assignments.length}</strong><span>published assignments</span></div><div><span className="succession-assignment-command__metric-label">Active snapshot</span><strong>{chapterAssignments.length}</strong><span>Chapter {snapshotChapter}</span></div><div><span className="succession-assignment-command__metric-label">Personnel</span><strong>{namedPersonnel}</strong><span>named operatives</span></div><div><span className="succession-assignment-command__metric-label">Covert</span><strong>{covertCount}</strong><span>restricted records</span></div><div><span className="succession-assignment-command__metric-label">Ended</span><strong>{endedCount}</strong><span>historical operations</span></div></div>

    {!selectedAssignment && !selectedCharacter && <section className="succession-assignment-type-board" aria-labelledby="succession-assignment-type-board-title"><header><div><span>Operational architecture</span><h3 id="succession-assignment-type-board-title">Assignment families at Chapter {snapshotChapter}</h3></div><p>Select a family to isolate it in every result mode.</p></header><div>{typeSummary.map((record, index) => <button type="button" className={type === record.type ? 'is-active' : ''} aria-pressed={type === record.type} onClick={() => setType(type === record.type ? 'all' : record.type)} key={record.type}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{record.active} active · {record.covert} covert</small><b>{titleCase(record.type)}</b></span><strong>{record.total}</strong></button>)}</div></section>}

    <section className="succession-assignment-filter-panel" aria-labelledby="succession-assignment-filter-title">
      <header><SlidersHorizontal size={17} aria-hidden="true" /><div><span>Operational reconstruction</span><h3 id="succession-assignment-filter-title">Filter, sort, and change result form</h3></div><button type="button" disabled={!activeFilterCount} onClick={resetFilters}><RotateCcw size={13} aria-hidden="true" /> Reset {activeFilterCount ? `(${activeFilterCount})` : ''}</button></header>
      <label className="succession-assignment-filter-panel__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search assignments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, prince, room, objective, reporting line…" /></label>
      <div className="succession-assignment-filter-panel__fields">
        <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All assignment types</option>{types.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{statuses.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Secrecy</span><select value={secrecy} onChange={(event) => setSecrecy(event.target.value)}><option value="all">All secrecy levels</option>{secrecyLevels.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Snapshot chapter</span><input type="number" min="340" max={spoilerLimit} value={snapshotChapter} onChange={(event) => setSnapshotChapter(Math.min(spoilerLimit, Math.max(340, Number(event.target.value) || 340)))} /></label>
      </div>
      <div className="succession-assignment-result-command"><nav aria-label="Assignment scope"><button type="button" className={scope === 'all' ? 'is-active' : ''} aria-pressed={scope === 'all'} onClick={() => setScope('all')}>Complete archive</button><button type="button" className={scope === 'snapshot' ? 'is-active' : ''} aria-pressed={scope === 'snapshot'} onClick={() => setScope('snapshot')}>Active at Chapter {snapshotChapter}</button></nav><label><ArrowUpDown size={13} aria-hidden="true" /><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="chapter-asc">Chapter: earliest first</option><option value="chapter-desc">Chapter: latest first</option><option value="name">Assignment name</option><option value="type">Assignment type</option><option value="personnel">Operative name</option></select></label><nav aria-label="Assignment result view"><button type="button" className={viewMode === 'cards' ? 'is-active' : ''} aria-pressed={viewMode === 'cards'} onClick={() => setViewMode('cards')}><LayoutGrid size={14} aria-hidden="true" /> Cards</button><button type="button" className={viewMode === 'table' ? 'is-active' : ''} aria-pressed={viewMode === 'table'} onClick={() => setViewMode('table')}><Table2 size={14} aria-hidden="true" /> Table</button><button type="button" className={viewMode === 'ledger' ? 'is-active' : ''} aria-pressed={viewMode === 'ledger'} onClick={() => setViewMode('ledger')}><List size={14} aria-hidden="true" /> Ledger</button></nav></div>
      {!!activeFilterCount && <div className="succession-assignment-active-filters"><span>{visible.length} matching records</span>{query && <button type="button" onClick={() => setQuery('')}>Search: {query}</button>}{scope !== 'all' && <button type="button" onClick={() => setScope('all')}>Active at Ch. {snapshotChapter}</button>}{type !== 'all' && <button type="button" onClick={() => setType('all')}>{titleCase(type)}</button>}{status !== 'all' && <button type="button" onClick={() => setStatus('all')}>{titleCase(status)}</button>}{secrecy !== 'all' && <button type="button" onClick={() => setSecrecy('all')}>{titleCase(secrecy)}</button>}</div>}
      <footer><span role="status" aria-live="polite">Showing {displayed.length} of {visible.length} matching records · {chapterAssignments.length} active at Chapter {snapshotChapter}.</span><b>{viewMode === 'table' ? 'Sortable operational table' : viewMode === 'ledger' ? 'Compact semantic ledger' : 'Intelligence cards'}</b></footer>
    </section>

    {!selectedAssignment && !selectedCharacter && viewMode === 'cards' && <section className="succession-assignment-directory" aria-label="Canonical assignment cards">{displayed.map((assignment) => <AssignmentCard assignment={assignment} snapshotChapter={snapshotChapter} onOpen={openAssignment} key={assignment.id} />)}</section>}
    {!selectedAssignment && !selectedCharacter && viewMode === 'table' && <AssignmentTable records={displayed} snapshotChapter={snapshotChapter} onOpen={openAssignment} onOpenCharacter={openCharacterSnapshot} />}
    {!selectedAssignment && !selectedCharacter && viewMode === 'ledger' && <section className="succession-assignment-ledger" aria-label="Compact assignment operations ledger">{displayed.map((assignment) => <AssignmentLedgerRow assignment={assignment} snapshotChapter={snapshotChapter} onOpen={openAssignment} key={assignment.id} />)}</section>}

    {!selectedAssignment && !selectedCharacter && !visible.length && <div className="succession-assignment-empty"><Shield size={22} aria-hidden="true" /><h3>No assignments match this reconstruction</h3><p>Clear one or more operational facets to restore maintained records.</p><button type="button" onClick={resetFilters}>Reset assignment filters</button></div>}
    {!selectedAssignment && !selectedCharacter && remaining > 0 && <button type="button" className="succession-assignment-load-more" onClick={() => setResultLimit((current) => current + RESULT_BATCH)}>Show {Math.min(RESULT_BATCH, remaining)} more records <span>{remaining} remaining</span></button>}

    {selectedCharacter && characterSnapshot && <article className="succession-assignment-character-snapshot">
      <header><button type="button" onClick={closeFocus}><ArrowLeft size={14} aria-hidden="true" /> Assignment directory</button><EntityVisual entity={selectedCharacter} /><div><span>Chapter {characterSnapshot.chapter} role snapshot</span><h2>{selectedCharacter.name}</h2><p>{selectedCharacter.summary}</p></div><dl><div><dt>All active roles</dt><dd>{characterSnapshot.assignments.length}</dd></div><div><dt>As operative</dt><dd>{characterSnapshot.byRole.person.length}</dd></div><div><dt>As subject</dt><dd>{characterSnapshot.byRole.subject.length}</dd></div><div><dt>Reports received</dt><dd>{characterSnapshot.byRole.reporting.length}</dd></div></dl></header>
      <section><header><Clock3 size={17} aria-hidden="true" /><div><span>Assignment snapshot</span><h3>Operational roles active at Chapter {characterSnapshot.chapter}</h3></div></header>{characterSnapshot.assignments.length ? <div>{characterSnapshot.assignments.map((assignment) => <AssignmentCard assignment={assignment} snapshotChapter={snapshotChapter} onOpen={openAssignment} key={assignment.id} />)}</div> : <p>No assignment record connects this character to the selected chapter.</p>}</section>
    </article>}

    {selectedAssignment && selectedChain && <article className="succession-assignment-dossier" aria-labelledby="succession-assignment-dossier-title">
      <header><button type="button" className="succession-assignment-dossier__close" onClick={closeFocus}><ArrowLeft size={14} aria-hidden="true" /> Assignment directory</button><EntityVisual entity={selectedChain.person} /><div><span>{titleCase(selectedAssignment.assignmentType)} · Ch. {rangeLabel(selectedAssignment.chapterRange)}</span><h2 id="succession-assignment-dossier-title">{selectedAssignment.name}</h2><p>{selectedAssignment.summary}</p></div><dl><div><dt>Status</dt><dd>{titleCase(selectedAssignment.status)}</dd></div><div><dt>Secrecy</dt><dd>{titleCase(selectedAssignment.secrecy)}</dd></div><div><dt>Certainty</dt><dd>{titleCase(selectedAssignment.certainty)}</dd></div><div><dt>Canon layer</dt><dd>{titleCase(selectedAssignment.canonLevel)}</dd></div></dl></header>

      <section className="succession-assignment-command-chain"><header><GitBranch size={17} aria-hidden="true" /><div><span>Command and obligation</span><h3>Who acts, for whom, against whom, and where</h3></div></header><div>
        <LinkedEntity entity={selectedChain.person} label="Assigned person" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.principal} label="Principal" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.subject} label="Protected or targeted subject" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.allegiance} label="Allegiance" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.reporting} label="Reports to" onNavigate={onNavigate} />
        <LinkedEntity entity={selectedChain.location} label="Operational location" onNavigate={onNavigate} />
      </div></section>

      <section className="succession-assignment-purpose-grid">
        <article><Target size={17} aria-hidden="true" /><span>Objective</span><p>{selectedAssignment.objective}</p></article>
        <article><Shield size={17} aria-hidden="true" /><span>Authority basis</span><p>{selectedAssignment.authorityBasis}</p></article>
        <article><Eye size={17} aria-hidden="true" /><span>Operational notes</span>{selectedAssignment.operationalNotes?.length ? <ul>{selectedAssignment.operationalNotes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>No additional operational note is published.</p>}</article>
      </section>

      {(selectedChain.predecessor || selectedChain.successor) && <section className="succession-assignment-succession-chain"><header><Activity size={17} aria-hidden="true" /><div><span>Assignment succession</span><h3>Previous and replacement records</h3></div></header><div>{selectedChain.predecessor && <AssignmentCard assignment={selectedChain.predecessor} snapshotChapter={snapshotChapter} onOpen={openAssignment} />}{selectedChain.successor && <AssignmentCard assignment={selectedChain.successor} snapshotChapter={snapshotChapter} onOpen={openAssignment} />}</div></section>}

      {!!selectedChain.events.length && <section className="succession-assignment-events"><header><Activity size={17} aria-hidden="true" /><div><span>Related operations</span><h3>Events connected to this assignment</h3></div></header><div>{selectedChain.events.map((event) => <LinkedEntity entity={event} label={`Ch. ${rangeLabel(event.chapterRange)}`} onNavigate={onNavigate} key={event.id} />)}</div></section>}

      {!!selectedSources.length && <section className="succession-assignment-sources"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence record</span><h3>Sources supporting this assignment</h3></div></header><div>{selectedSources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}
    </article>}

    {!selectedAssignment && !selectedCharacter && <section className="succession-assignment-snapshot-board"><header><Clock3 size={17} aria-hidden="true" /><div><span>Chapter snapshot</span><h3>{chapterAssignments.length} operational records active at Chapter {snapshotChapter}</h3></div><button type="button" onClick={() => setScope('snapshot')}>Show all active records</button></header><div>{chapterAssignments.slice(0, 12).map((assignment) => { const chain = getAssignmentChain(assignment.id); return <button type="button" onClick={() => openAssignment(assignment)} key={assignment.id}><EntityVisual entity={chain?.person} compact /><span><small>{titleCase(assignment.assignmentType)} · {titleCase(assignment.secrecy)}</small><b>{assignment.name}</b><em>{chain?.subject?.name || chain?.principal?.name || 'No named subject'}</em></span><MapPin size={13} aria-hidden="true" /></button>; })}</div>{chapterAssignments.length > 12 && <p>{chapterAssignments.length - 12} additional active assignments remain available through the snapshot scope above.</p>}</section>}

    {!selectedAssignment && !selectedCharacter && <section className="succession-assignment-personnel"><header><Users size={17} aria-hidden="true" /><div><span>Personnel index</span><h3>People with canonical operational records</h3></div></header><div>{unique(assignments.map((assignment) => assignment.personId)).map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)).map((person) => <button type="button" onClick={() => openCharacterSnapshot(person)} key={person.id}><EntityVisual entity={person} compact /><span><b>{person.name}</b><small>{getAssignmentSnapshot(person.id, snapshotChapter)?.assignments.length || 0} active at Ch. {snapshotChapter}</small></span></button>)}</div></section>}
  </div>;
}
