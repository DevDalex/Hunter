import { ArrowRight, Crosshair, GitBranch, Shield, Workflow } from 'lucide-react';
import {
  getAllianceBetrayalLedger,
  getChapterWhatChanged,
  getConsequenceChains,
  getEntityById,
  getOrdersSurveillanceCustodyLedger,
  getThreatAssassinationMatrix,
} from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionOperationsConflictLens.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unresolved'}</span>;
  return <button type="button" className="succession-operations__entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={10} aria-hidden="true" /></button>;
}

const targetForAssignment = (assignment) => assignment?.subjectEntityId || assignment?.principalEntityId || null;

export default function SuccessionOperationsConflictLens({ chapter = 417, onNavigate }) {
  const threats = getThreatAssassinationMatrix(chapter);
  const operational = getOrdersSurveillanceCustodyLedger(chapter);
  const assignments = operational.assignmentIds.map(getEntityById).filter(Boolean);
  const alliances = getAllianceBetrayalLedger(chapter);
  const causal = getConsequenceChains(chapter);
  const change = getChapterWhatChanged(chapter);
  const turningPoints = change.records.filter((record) => ['event', 'assignment', 'relationship', 'organization'].includes(record.entity?.entityType));

  const visibleThreats = threats.slice(0, 12);
  const visibleAssignments = assignments.slice(0, 12);
  const visibleAlliances = alliances.slice(0, 10);
  const visibleTurningPoints = turningPoints.slice(0, 10);

  return <section className="succession-operations" aria-labelledby="succession-operations-title">
    <header className="succession-operations__hero"><span><Crosshair size={14} aria-hidden="true" /> Operations / conflicts lens</span><h3 id="succession-operations-title">Objectives, actors, methods and turning points from maintained operational records</h3><p>This view combines explicit threat, assignment, relationship, chapter-delta and causal-graph records. It does not infer hidden objectives, chain of command, territorial control, or likelihood of success.</p></header>

    <dl className="succession-operations__summary">
      <div><dt>Threat routes</dt><dd>{threats.length}</dd></div>
      <div><dt>Orders / custody</dt><dd>{operational.assignmentIds.length + operational.relationshipIds.length}</dd></div>
      <div><dt>Alliance / hostile edges</dt><dd>{alliances.length}</dd></div>
      <div><dt>Causal links</dt><dd>{causal.links.length}</dd></div>
      <div><dt>Turning points this chapter</dt><dd>{turningPoints.length}</dd></div>
    </dl>

    <div className="succession-operations__grid">
      <section><header><span><Crosshair size={12} aria-hidden="true" /> Active threat routes</span><h4>Source → method → target</h4></header><ol>{visibleThreats.map((row) => <li key={row.id}><div className="succession-operations__route"><EntityButton id={row.source?.id} onNavigate={onNavigate} /><i aria-hidden="true">→</i><b>{labelize(row.method)}</b><i aria-hidden="true">→</i><EntityButton id={row.target?.id} onNavigate={onNavigate} /></div><small>{labelize(row.status)} · {labelize(row.sourceType)}</small></li>)}</ol>{threats.length > visibleThreats.length && <p className="succession-operations__shown">Showing {visibleThreats.length} of {threats.length} maintained threat routes.</p>}</section>

      <section><header><span><Shield size={12} aria-hidden="true" /> Orders / surveillance / custody</span><h4>Actor → assignment → subject or principal</h4></header><ol>{visibleAssignments.map((assignment) => <li key={assignment.id}><div className="succession-operations__route"><EntityButton id={assignment.personId} onNavigate={onNavigate} /><i aria-hidden="true">→</i><b>{labelize(assignment.assignmentType)}</b><i aria-hidden="true">→</i><EntityButton id={targetForAssignment(assignment)} onNavigate={onNavigate} /></div><small>{labelize(assignment.status)}{assignment.reportingEntityId ? ' · explicit reporting target maintained' : ''}</small></li>)}</ol>{assignments.length > visibleAssignments.length && <p className="succession-operations__shown">Showing {visibleAssignments.length} of {assignments.length} operational assignments.</p>}</section>

      <section><header><span><GitBranch size={12} aria-hidden="true" /> Alliance / hostile relations</span><h4>Maintained cooperation and conflict edges</h4></header><ol>{visibleAlliances.map((row) => <li key={row.id}><div className="succession-operations__route"><EntityButton id={row.source?.id} onNavigate={onNavigate} /><i aria-hidden="true">→</i><b>{labelize(row.subtype)}</b><i aria-hidden="true">→</i><EntityButton id={row.target?.id} onNavigate={onNavigate} /></div><small>{labelize(row.sentiment)} · {labelize(row.status)}</small></li>)}</ol>{alliances.length > visibleAlliances.length && <p className="succession-operations__shown">Showing {visibleAlliances.length} of {alliances.length} alliance/hostile edges.</p>}</section>

      <section><header><span><Workflow size={12} aria-hidden="true" /> Chapter turning points</span><h4>Material operational records changed in Chapter {chapter}</h4></header><ol>{visibleTurningPoints.map((row) => <li key={row.entity.id}><div><EntityButton id={row.entity.id} onNavigate={onNavigate} /></div><small>{labelize(row.entity.entityType)} · {labelize(row.status)}</small></li>)}</ol>{!visibleTurningPoints.length && <p className="succession-operations__shown">No maintained event, assignment, relationship or organization delta is recorded at this boundary.</p>}{turningPoints.length > visibleTurningPoints.length && <p className="succession-operations__shown">Showing {visibleTurningPoints.length} of {turningPoints.length} operational turning points.</p>}</section>
    </div>

    <footer className="succession-operations__causal"><div><b>{causal.nodes.length}</b><span>causal nodes</span></div><div><b>{causal.links.length}</b><span>explicit causal links</span></div><div><b>{causal.roots.length}</b><span>maintained roots</span></div><p>The causal graph summarizes documented story structure through Chapter {chapter}; chronology by itself is not promoted into causation.</p></footer>
  </section>;
}
