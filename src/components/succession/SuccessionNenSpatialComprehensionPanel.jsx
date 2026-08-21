import { ArrowRight, GitBranch, MapPinned, MoveRight, Orbit, Route, Ship } from 'lucide-react';
import {
  getAbilityTransferInheritanceLedger,
  getEntityById,
  getNenTrainingTracker,
} from '../../data/succession/successionData';
import { getSpatialEvidenceIntelligence } from '../../data/succession/contentDepthFinishingSelectors';
import {
  getAbilityInteractionMatrix,
  getBlackWhaleSnapshotComparison,
  getShipInfrastructureIndex,
} from '../../data/succession/workspaceRefinementRuntime';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionNenSpatialComprehensionPanel.css';
import './SuccessionSpatialInfrastructureComprehension.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const asList = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unknown'}</span>;
  return <button type="button" className="succession-nen-spatial__entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={10} aria-hidden="true" /></button>;
}

function AbilityFlows({ chapter, onNavigate }) {
  const transferRows = getAbilityTransferInheritanceLedger(chapter);
  const visible = transferRows.slice(0, 8);
  return <section className="succession-nen-spatial__section">
    <header><span><GitBranch size={14} aria-hidden="true" /> Nen mechanics flows</span><h3>Transfer / inheritance / possession without prose overload</h3><p>Each flow keeps trigger, conditions and limitations separate. Missing mechanics remain unknown rather than being inferred.</p></header>
    <div className="succession-nen-spatial__flows">{visible.map((row) => {
      const ability = getEntityById(row.ability.id) || row.ability;
      const owners = (row.ownerIds || []).map(getEntityById).filter(Boolean);
      const conditions = asList(ability.conditions).slice(0, 2);
      const limitations = asList(ability.limitations).slice(0, 2);
      return <article key={row.ability.id}>
        <header><EntityButton id={row.ability.id} onNavigate={onNavigate} /><small>{labelize(row.researchStatus || ability.researchStatus || 'maintained')}</small></header>
        <div className="succession-nen-spatial__flow-line">
          <span><small>Owner / host</small><b>{owners.map((owner) => owner.name).join(' · ') || 'Unresolved'}</b></span><i aria-hidden="true">→</i>
          <span><small>Activation</small><b>{row.activation || ability.activation || 'Unknown'}</b></span><i aria-hidden="true">→</i>
          <span><small>Conditions</small><b>{conditions.join(' · ') || 'Not fully published'}</b></span><i aria-hidden="true">→</i>
          <span><small>Limits</small><b>{limitations.join(' · ') || 'Not fully published'}</b></span>
        </div>
      </article>;
    })}</div>
    {transferRows.length > visible.length && <small className="succession-nen-spatial__shown">Showing {visible.length} of {transferRows.length} transfer/inheritance records.</small>}
  </section>;
}

function AbilityInteractions({ chapter, onNavigate }) {
  const matrix = getAbilityInteractionMatrix(chapter, { limit: 80 });
  const visible = (matrix.interactions || []).slice(0, 10);
  return <section className="succession-nen-spatial__section">
    <header><span><Orbit size={14} aria-hidden="true" /> Ability interaction map</span><h3>Documented interaction versus structural comparison</h3><p>Solid relationships require a shared maintained event. Contextual overlap never becomes an invented matchup.</p></header>
    <ol className="succession-nen-spatial__interactions">{visible.map((row) => <li className={row.directInteractionClaimed ? 'is-documented' : 'is-contextual'} key={row.id}>
      <EntityButton id={row.left.id} onNavigate={onNavigate} />
      <span><b>{row.directInteractionClaimed ? 'Documented interaction' : labelize(row.basis)}</b><i aria-hidden="true">↔</i><small>{labelize(row.evidenceStrength)}</small></span>
      <EntityButton id={row.right.id} onNavigate={onNavigate} />
      <p>{row.sharedEvents?.length ? `${row.sharedEvents.length} shared event${row.sharedEvents.length === 1 ? '' : 's'}` : row.sharedMechanics?.length ? `${row.sharedMechanics.length} shared mechanic${row.sharedMechanics.length === 1 ? '' : 's'}` : 'Comparative context only'}</p>
    </li>)}</ol>
    {(matrix.interactions?.length || 0) > visible.length && <small className="succession-nen-spatial__shown">Showing {visible.length} of {matrix.interactions.length} interaction contexts.</small>}
  </section>;
}

function TrainingSignal({ chapter, onNavigate }) {
  const training = getNenTrainingTracker(chapter);
  const visible = (training.participants || []).slice(0, 12);
  return <section className="succession-nen-spatial__section is-training">
    <header><span><Orbit size={14} aria-hidden="true" /> Nen training progression</span><h3>Who is inside the maintained instruction system?</h3><p>This is participation evidence, not a fabricated mastery level. Detailed technique progress remains inside the Nen and event records.</p></header>
    <dl className="succession-nen-spatial__training-metrics"><div><dt>Training events</dt><dd>{training.eventIds?.length || 0}</dd></div><div><dt>Tracked participants</dt><dd>{training.participants?.length || 0}</dd></div></dl>
    <div className="succession-nen-spatial__participants">{visible.map((record) => <EntityButton id={record.id} onNavigate={onNavigate} key={record.id} />)}</div>
    {(training.participants?.length || 0) > visible.length && <small className="succession-nen-spatial__shown">Showing {visible.length} of {training.participants.length} participants.</small>}
  </section>;
}

function ShipState({ chapter, onNavigate }) {
  const previous = Math.max(340, chapter - 1);
  const comparison = getBlackWhaleSnapshotComparison(previous, chapter);
  const spatial = getSpatialEvidenceIntelligence(chapter);
  const infrastructure = getShipInfrastructureIndex(chapter);
  const movements = (comparison.movements || []).slice(0, 8);
  const hotspots = (spatial.hotspots || []).slice(0, 8);
  const systems = Object.values(infrastructure.systems || {}).sort((left, right) => right.activeEvents - left.activeEvents || right.activeAssignments - left.activeAssignments || left.label.localeCompare(right.label)).slice(0, 8);
  const locationLayers = [...(infrastructure.records || [])].sort((left, right) => right.operationalLoad - left.operationalLoad || left.location.name.localeCompare(right.location.name)).slice(0, 10);

  return <section className="succession-nen-spatial__section is-ship">
    <header><span><Ship size={14} aria-hidden="true" /> Black Whale operational state</span><h3>Movement and hotspot evidence · Ch. {previous} → {chapter}</h3><p>Movement arrows and hotspot load come from maintained location, event, assignment and provenance records—not a fictional danger score.</p></header>
    <div className="succession-nen-spatial__ship-grid">
      <section><h4><MoveRight size={13} aria-hidden="true" /> Character movement</h4><ol>{movements.map((movement) => <li key={`${movement.character.id}:${movement.from?.id}:${movement.to?.id}`}>
        <EntityButton id={movement.character.id} onNavigate={onNavigate} />
        <span>{movement.from?.name || 'Unknown'} <MoveRight size={11} aria-hidden="true" /> {movement.to?.name || 'Unknown'}</span>
      </li>)}</ol>{!movements.length && <p>No maintained movement delta is published between these boundaries.</p>}</section>
      <section><h4><MapPinned size={13} aria-hidden="true" /> Evidence-led hotspots</h4><ol>{hotspots.map((row) => <li key={row.location.id}>
        <EntityButton id={row.location.id} onNavigate={onNavigate} />
        <span>{row.operationalLoad} load · {row.provenanceCoverage}% evidenced</span>
      </li>)}</ol>{!hotspots.length && <p>No maintained hotspot is published for this boundary.</p>}</section>
    </div>
    <section className="succession-nen-spatial__infrastructure" aria-labelledby="succession-infrastructure-title">
      <header><h4 id="succession-infrastructure-title">Access & infrastructure layers</h4><small>{infrastructure.records?.length || 0} maintained Black Whale locations · {infrastructure.systemCount || systems.length} infrastructure systems</small></header>
      <div className="succession-nen-spatial__infrastructure-systems">{systems.map((system) => <article className="succession-nen-spatial__infrastructure-card" key={system.id}><span>Infrastructure system</span><b>{system.label}</b><dl><div><dt>Locations</dt><dd>{system.locationCount}</dd></div><div><dt>Occupants</dt><dd>{system.occupants}</dd></div><div><dt>Events</dt><dd>{system.activeEvents}</dd></div><div><dt>Assignments</dt><dd>{system.activeAssignments}</dd></div></dl></article>)}</div>
      <div className="succession-nen-spatial__location-layers">{locationLayers.map((row) => <article className="succession-nen-spatial__location-layer" key={row.location.id}><EntityButton id={row.location.id} onNavigate={onNavigate} /><div><span>{labelize(row.system)}</span><span>{labelize(row.state.accessLevel)}</span><span>{labelize(row.state.zoneRole)}</span></div><small>{row.state.events.length} active events · {row.state.assignments.length} assignments · {row.protocolIds.length} attached protocols</small></article>)}</div>
      {(infrastructure.records?.length || 0) > locationLayers.length && <small className="succession-nen-spatial__shown">Showing {locationLayers.length} of {infrastructure.records.length} location layers, ordered by maintained operational load.</small>}
      <p className="succession-information-war__note">Access level, zone role and attached protocols are shown as maintained archive fields. This view does not infer territorial control where the records do not state it.</p>
    </section>
    <footer><button type="button" onClick={() => onNavigate('black-whale', { chapter })}><Route size={12} /> Open ship atlas</button><button type="button" onClick={() => onNavigate('locations', { chapter })}><MapPinned size={12} /> Location archive</button></footer>
    {(comparison.movements?.length || 0) > movements.length && <small className="succession-nen-spatial__shown">Movement list shows {movements.length} of {comparison.movements.length} records.</small>}
    {(spatial.hotspots?.length || 0) > hotspots.length && <small className="succession-nen-spatial__shown">Hotspot list shows {hotspots.length} of {spatial.hotspots.length} locations.</small>}
  </section>;
}

export default function SuccessionNenSpatialComprehensionPanel({ chapter = 417, onNavigate }) {
  return <section className="succession-nen-spatial" aria-labelledby="succession-nen-spatial-title">
    <header className="succession-nen-spatial__hero"><span><Orbit size={15} aria-hidden="true" /> Nen & spatial comprehension</span><h2 id="succession-nen-spatial-title">Mechanics, interactions and ship movement as visual systems</h2><p>These views translate existing canonical Nen and Black Whale intelligence into flows, interaction classes, movement arrows and evidence-led operational load.</p></header>
    <div className="succession-nen-spatial__layout">
      <AbilityFlows chapter={chapter} onNavigate={onNavigate} />
      <AbilityInteractions chapter={chapter} onNavigate={onNavigate} />
      <TrainingSignal chapter={chapter} onNavigate={onNavigate} />
      <ShipState chapter={chapter} onNavigate={onNavigate} />
    </div>
  </section>;
}
