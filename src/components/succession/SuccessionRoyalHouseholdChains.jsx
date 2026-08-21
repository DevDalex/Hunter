import { useMemo, useState } from 'react';
import { ArrowRight, Building2, Network } from 'lucide-react';
import { getEntityById, getRoyalHouseholdMatrix } from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionRoyalHouseholdChains.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unresolved'}</span>;
  return <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={10} aria-hidden="true" /></button>;
}

const assignmentTarget = (assignment) => assignment?.principalEntityId || assignment?.subjectEntityId || null;

export default function SuccessionRoyalHouseholdChains({ chapter = 417, onNavigate }) {
  const rows = getRoyalHouseholdMatrix(chapter);
  const [selectedId, setSelectedId] = useState(() => rows[0]?.character.id || '');
  const selected = rows.find((row) => row.character.id === selectedId) || rows[0] || null;
  const assignments = useMemo(() => (selected?.householdAssignmentIds || []).map(getEntityById).filter(Boolean), [selected]);

  if (!selected) return null;
  return <section className="succession-household-chains" aria-labelledby="succession-household-chains-title">
    <header><span><Building2 size={14} aria-hidden="true" /> Royal household / reporting chains</span><h3 id="succession-household-chains-title">Explicit assignment chains around each prince</h3><p>The arrows below represent maintained assignment fields only. “Reports to” is shown only when a reportingEntityId exists; this view does not infer command hierarchy from proximity or affiliation.</p></header>
    <nav aria-label="Prince household to inspect">{rows.map((row) => <button type="button" className={row.character.id === selected.character.id ? 'is-active' : ''} aria-pressed={row.character.id === selected.character.id} onClick={() => setSelectedId(row.character.id)} key={row.character.id}>{row.order || '—'} · {row.character.name.replace(/ Hui Guo Rou$/i, '')}</button>)}</nav>
    <div className="succession-household-chains__summary"><strong>{selected.personnelIds.length}</strong><span>linked personnel</span><strong>{assignments.length}</strong><span>active household assignments</span></div>
    <ol>{assignments.map((assignment) => {
      const targetId = assignmentTarget(assignment);
      return <li key={assignment.id}>
        <div><small>Actor</small><EntityButton id={assignment.personId} onNavigate={onNavigate} /></div>
        <i aria-hidden="true">→</i>
        <div className="is-role"><small>Assignment</small><b>{labelize(assignment.assignmentType)}</b><span>{labelize(assignment.status)}{assignment.secrecy ? ` · ${labelize(assignment.secrecy)}` : ''}</span></div>
        <i aria-hidden="true">→</i>
        <div><small>{assignment.principalEntityId ? 'Principal' : 'Subject'}</small>{targetId ? <EntityButton id={targetId} onNavigate={onNavigate} /> : <span>Unresolved</span>}</div>
        <div className="is-report"><small><Network size={10} aria-hidden="true" /> Reports to</small>{assignment.reportingEntityId ? <EntityButton id={assignment.reportingEntityId} onNavigate={onNavigate} /> : <span>No explicit reporting target</span>}</div>
        <div className="is-allegiance"><small>Allegiance</small>{assignment.allegianceEntityId ? <EntityButton id={assignment.allegianceEntityId} onNavigate={onNavigate} /> : <span>No explicit allegiance field</span>}</div>
      </li>;
    })}</ol>
    {!assignments.length && <p className="succession-household-chains__empty">No active household assignment record is maintained for this prince at Chapter {chapter}.</p>}
  </section>;
}
