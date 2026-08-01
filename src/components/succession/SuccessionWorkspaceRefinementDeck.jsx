import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  Boxes,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  GitCompareArrows,
  Network,
  Route,
  SearchCheck,
  Ship,
  Waypoints,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
} from '../../data/succession/successionData';
import {
  getAbilityInteractionMatrix,
  getBlackWhaleSnapshotComparison,
  getChapterDeltaBrief,
  getClaimProvenanceProfile,
  getFocusedRelationshipView,
  getGlossaryEnforcementReport,
  getProvenanceCoverageReport,
} from '../../data/succession/workspaceRefinementRuntime';
import { EntityLink, entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionWorkspaceRefinementDeck.css';

const supportedRoutes = new Set(['story', 'chapters', 'relationships', 'black-whale', 'nen', 'research']);
const labelize = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());
const asText = (value) => Array.isArray(value)
  ? value.join(' · ') || 'None'
  : value && typeof value === 'object'
    ? Object.values(value).join(' · ') || 'None'
    : String(value ?? 'None');
const clamp = (value, maximum) => Math.min(Number(maximum) || 414, Math.max(338, Number(value) || Number(maximum) || 414));

function MetricStrip({ records }) {
  return <dl className="succession-refinement-metrics">{records.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function DeckHeader({ icon: Icon, kicker, title, description }) {
  return <header className="succession-refinement-header"><Icon size={22} aria-hidden="true" /><div><span>{kicker}</span><h2>{title}</h2><p>{description}</p></div></header>;
}

function StoryRefinement({ routeId, routeParams, spoilerLimit, onNavigate }) {
  const initial = clamp(routeParams.chapter || spoilerLimit, spoilerLimit);
  const [chapter, setChapter] = useState(initial);
  const brief = useMemo(() => getChapterDeltaBrief(chapter), [chapter]);
  const highlighted = [...brief.recordsByStatus.added, ...brief.recordsByStatus.changed, ...brief.recordsByStatus.removed].slice(0, 10);
  return <section className="succession-refinement-panel is-story" aria-labelledby="succession-phase-5-story-title">
    <DeckHeader icon={GitCompareArrows} kicker="Phase 5 · Story refinement" title="Chapter delta with explicit causality classes" description="State changes, direct causes, enabling conditions, constraints, contextual links, and sequence-only adjacency are no longer blended into one narrative bucket." />
    <div className="succession-refinement-controls"><label>Chapter boundary<input type="number" min="338" max={spoilerLimit} value={chapter} onChange={(event) => setChapter(clamp(event.target.value, spoilerLimit))} /></label><button type="button" onClick={() => onNavigate(routeId === 'chapters' ? 'chapters' : 'story', { chapter })}>Open Chapter {chapter}</button><button type="button" onClick={() => onNavigate('research', { mode: 'diff', from: brief.previousChapter, to: brief.chapter })}>Full archive diff <ArrowRight size={13} /></button></div>
    <MetricStrip records={[
      ['Added', brief.summary.additions],
      ['Modified', brief.summary.modifications],
      ['Removed', brief.summary.removals],
      ['Direct causes', brief.summary.directCauses],
      ['Enabling', brief.summary.enablingConditions],
      ['Context only', brief.summary.contextualLinks + brief.summary.sequenceOnly],
    ]} />
    <div className="succession-refinement-columns">
      <section><header><span>State delta</span><h3>What materially changed?</h3></header><ol className="succession-refinement-ledger">{highlighted.map((record) => <li key={record.entity.id}><span className={`is-${record.status}`}>{labelize(record.status)}</span><div><strong>{record.entity.name}</strong><small>{labelize(record.entity.entityType)}</small>{record.deltas?.[0] && <p>{record.deltas[0].label}: {asText(record.deltas[0].before)} → {asText(record.deltas[0].after)}</p>}</div><button type="button" onClick={() => { const entity = getEntityById(record.entity.id); if (entity) onNavigate(entityWorkspaceTarget(entity), { entity: entity.id }); }}>Open</button></li>)}</ol>{!highlighted.length && <p className="succession-refinement-empty">No material state changes were generated for this boundary.</p>}</section>
      <section><header><span>Causal ledger</span><h3>Cause is not the same as chronology</h3></header><ol className="succession-refinement-ledger">{brief.causalLinks.slice(0, 10).map((link) => <li key={link.id}><span className={`is-${link.evidenceState}`}>{labelize(link.causalityClass)}</span><div><strong>{link.source?.name || 'Unknown source'} → {link.target?.name || 'Unknown target'}</strong><small>{labelize(link.evidenceState)}</small><p>{link.summary || link.explanation || 'The maintained story graph links these events at this chapter boundary.'}</p></div>{link.target && <button type="button" onClick={() => onNavigate('events', { entity: link.target.id })}>Event</button>}</li>)}</ol>{!brief.causalLinks.length && <p className="succession-refinement-empty">No maintained causal links touch this chapter.</p>}</section>
    </div>
  </section>;
}

function RelationshipRefinement({ routeParams, spoilerLimit, onNavigate }) {
  const candidates = useMemo(() => [...getEntitiesByType('character'), ...getEntitiesByType('organization')]
    .sort((left, right) => left.name.localeCompare(right.name)), []);
  const initialFocus = routeParams.focus || (routeParams.entity && getEntityById(routeParams.entity)?.entityType !== 'relationship' ? routeParams.entity : '') || candidates.find((entity) => entity.id === 'character:kurapika')?.id || candidates[0]?.id || '';
  const [focus, setFocus] = useState(initialFocus);
  const [depth, setDepth] = useState(Number(routeParams.depth) === 2 ? 2 : 1);
  const view = focus ? getFocusedRelationshipView(focus, spoilerLimit, { depth }) : null;
  return <section className="succession-refinement-panel is-relationships" aria-labelledby="succession-phase-5-relationships-title">
    <DeckHeader icon={Network} kicker="Phase 5 · Relationship refinement" title="Focused neighborhoods with direction and evidence" description="A selected person or institution now gets a bounded one-hop or two-hop view, with inbound, outbound, mutual, adjacent, hostile, allied, and inferred edges counted separately." />
    <div className="succession-refinement-controls"><label>Focus record<select value={focus} onChange={(event) => setFocus(event.target.value)}>{candidates.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label><label>Neighborhood depth<select value={depth} onChange={(event) => setDepth(Number(event.target.value))}><option value="1">One hop</option><option value="2">Two hops</option></select></label><button type="button" onClick={() => onNavigate('relationships', { focus, view: 'graph', chapter: spoilerLimit, depth })}>Apply to relationship workspace</button></div>
    {view && <><MetricStrip records={[
      ['Nodes', view.summary.nodes],
      ['Edges', view.summary.edges],
      ['Inbound', view.summary.inbound],
      ['Outbound', view.summary.outbound],
      ['Mutual', view.summary.mutual],
      ['Inferred', view.summary.inferred],
    ]} /><div className="succession-refinement-columns"><section><header><span>Neighborhood nodes</span><h3>Highest-connectivity records around {view.focus.name}</h3></header><div className="succession-refinement-chip-grid">{view.nodes.slice(0, 16).map((record) => <button type="button" onClick={() => setFocus(record.entity.id)} key={record.entity.id}><span>{record.edgeCount} edges</span><strong>{record.entity.name}</strong><small>{record.inbound} in · {record.outbound} out · {record.hostile} hostile</small></button>)}</div></section><section><header><span>Edge evidence</span><h3>Direction survives the graph layout</h3></header><ol className="succession-refinement-ledger">{view.edges.slice(0, 12).map((edge) => <li key={edge.id}><span className={`is-${edge.sentiment}`}>{labelize(edge.direction)}</span><div><strong>{edge.source?.name} → {edge.target?.name}</strong><small>{labelize(edge.relationshipType)} · {edge.sources.length} source{edge.sources.length === 1 ? '' : 's'}</small><p>{edge.summary}</p></div><button type="button" onClick={() => onNavigate('relationships', { entity: edge.id, chapter: spoilerLimit })}>Edge</button></li>)}</ol></section></div></>}
  </section>;
}

function BlackWhaleRefinement({ routeParams, spoilerLimit, onNavigate }) {
  const initialTo = clamp(routeParams.to || routeParams.chapter || spoilerLimit, spoilerLimit);
  const [from, setFrom] = useState(clamp(routeParams.from || initialTo - 1, spoilerLimit));
  const [to, setTo] = useState(initialTo);
  const comparison = useMemo(() => getBlackWhaleSnapshotComparison(from, to), [from, to]);
  const systems = Object.values(comparison.infrastructure.systems);
  return <section className="succession-refinement-panel is-black-whale" aria-labelledby="succession-phase-5-black-whale-title">
    <DeckHeader icon={Ship} kicker="Phase 5 · Black Whale refinement" title="Ship-state comparison and infrastructure systems" description="The atlas now has a generated operational layer for changed locations, character movement, access pressure, active assignments, and the systems that keep the vessel functioning." />
    <div className="succession-refinement-controls"><label>From chapter<input type="number" min="338" max={spoilerLimit} value={from} onChange={(event) => setFrom(clamp(event.target.value, spoilerLimit))} /></label><label>To chapter<input type="number" min="338" max={spoilerLimit} value={to} onChange={(event) => setTo(clamp(event.target.value, spoilerLimit))} /></label><button type="button" onClick={() => onNavigate('research', { mode: 'diff', from, to, type: 'location' })}>Open full spatial diff</button></div>
    <MetricStrip records={[
      ['Changed locations', comparison.summary.changedLocations],
      ['Tracked movements', comparison.summary.movements],
      ['Ship systems', comparison.summary.systems],
      ['Active locations', comparison.summary.activeLocations],
    ]} />
    <div className="succession-refinement-columns"><section><header><span>Snapshot delta</span><h3>Location changes and movement</h3></header><ol className="succession-refinement-ledger">{comparison.locationChanges.slice(0, 8).map((record) => <li key={record.location.id}><span>{labelize(record.system)}</span><div><strong>{record.location.name}</strong><small>{record.deltas.map((delta) => delta.label).join(' · ')}</small><p>{record.deltas[0] ? `${asText(record.deltas[0].before)} → ${asText(record.deltas[0].after)}` : 'State changed.'}</p></div><button type="button" onClick={() => onNavigate('locations', { entity: record.location.id, chapter: to })}>Location</button></li>)}{comparison.movements.slice(0, 6).map((movement) => <li key={`${movement.character.id}:${movement.from?.id}:${movement.to?.id}`}><span>Movement</span><div><strong>{movement.character.name}</strong><small>{movement.from?.name} → {movement.to?.name}</small></div><button type="button" onClick={() => onNavigate('characters', { entity: movement.character.id, chapter: to })}>Person</button></li>)}</ol>{!comparison.locationChanges.length && !comparison.movements.length && <p className="succession-refinement-empty">No spatial changes are documented between these boundaries.</p>}</section><section><header><span>Infrastructure index</span><h3>Ship systems, not decorative rooms</h3></header><div className="succession-refinement-system-grid">{systems.map((system) => <article key={system.id}><Building2 size={17} aria-hidden="true" /><span>{system.locationCount} locations</span><h4>{system.label}</h4><p>{system.activeEvents} active events · {system.activeAssignments} assignments · {system.occupants} occupants</p><button type="button" onClick={() => { const first = system.locations[0]?.location; if (first) onNavigate('locations', { entity: first.id, chapter: to }); }}>Open first location</button></article>)}</div></section></div>
  </section>;
}

function NenRefinement({ routeParams, spoilerLimit, onNavigate }) {
  const abilities = useMemo(() => getEntitiesByType('ability').sort((left, right) => left.name.localeCompare(right.name)), []);
  const [focus, setFocus] = useState(routeParams.entity && getEntityById(routeParams.entity)?.entityType === 'ability' ? routeParams.entity : '');
  const matrix = useMemo(() => getAbilityInteractionMatrix(spoilerLimit, { entityId: focus || null, limit: 80 }), [focus, spoilerLimit]);
  return <section className="succession-refinement-panel is-nen" aria-labelledby="succession-phase-5-nen-title">
    <DeckHeader icon={BrainCircuit} kicker="Phase 5 · Nen refinement" title="Ability interaction matrix without invented matchups" description="Shared events, owners, locations, and mechanics are separated. A direct interaction is claimed only when both abilities share a maintained event record." />
    <div className="succession-refinement-controls"><label>Focus ability<select value={focus} onChange={(event) => setFocus(event.target.value)}><option value="">All documented abilities</option>{abilities.map((ability) => <option value={ability.id} key={ability.id}>{ability.name}</option>)}</select></label>{focus && <button type="button" onClick={() => onNavigate('nen', { entity: focus })}>Open ability dossier</button>}</div>
    <MetricStrip records={[
      ['Known abilities', matrix.summary.abilities],
      ['Matrix links', matrix.summary.interactions],
      ['Documented contexts', matrix.summary.documentedContexts],
      ['Same-owner systems', matrix.summary.sameOwnerSystems],
      ['Spatial context', matrix.summary.spatialContexts],
      ['Comparative only', matrix.summary.comparativeOverlaps],
    ]} />
    <ol className="succession-refinement-interaction-grid">{matrix.interactions.slice(0, 24).map((interaction) => <li key={interaction.id}><header><span className={interaction.directInteractionClaimed ? 'is-confirmed' : 'is-contextual'}>{labelize(interaction.basis)}</span><small>{labelize(interaction.evidenceStrength)}</small></header><h3>{interaction.left.name} × {interaction.right.name}</h3><p>{interaction.directInteractionClaimed ? 'Both abilities are attached to the same maintained event record.' : 'This is a comparison context. No direct clash or compatibility claim is inferred.'}</p><dl><div><dt>Shared events</dt><dd>{interaction.sharedEvents.map((record) => record.name).join(' · ') || 'None'}</dd></div><div><dt>Shared locations</dt><dd>{interaction.sharedLocations.map((record) => record.name).join(' · ') || 'None'}</dd></div><div><dt>Shared mechanics</dt><dd>{interaction.sharedMechanics.join(' · ') || 'None'}</dd></div></dl><footer><button type="button" onClick={() => onNavigate('nen', { entity: interaction.left.id })}>Open {interaction.left.name}</button><button type="button" onClick={() => onNavigate('nen', { entity: interaction.right.id })}>Open {interaction.right.name}</button></footer></li>)}</ol>
    {!matrix.interactions.length && <p className="succession-refinement-empty">No documented or structurally comparable ability pair matches this focus.</p>}
  </section>;
}

function ResearchRefinement({ routeParams, spoilerLimit, onNavigate }) {
  const candidates = useMemo(() => [
    ...getEntitiesByType('protocol'),
    ...getEntitiesByType('knowledge-record'),
    ...getEntitiesByType('object'),
    ...getEntitiesByType('document'),
    ...getEntitiesByType('evidence-item'),
    ...getEntitiesByType('ability'),
    ...getEntitiesByType('event'),
  ].sort((left, right) => left.name.localeCompare(right.name)), []);
  const requested = routeParams.entity && getEntityById(routeParams.entity) ? routeParams.entity : '';
  const defaultId = requested || candidates.find((entity) => /seed urn/i.test(entity.name))?.id || candidates[0]?.id || '';
  const [entityId, setEntityId] = useState(defaultId);
  const provenance = entityId ? getClaimProvenanceProfile(entityId, spoilerLimit) : null;
  const coverage = useMemo(() => getProvenanceCoverageReport(spoilerLimit), [spoilerLimit]);
  const glossary = useMemo(() => getGlossaryEnforcementReport(spoilerLimit), [spoilerLimit]);
  return <section className="succession-refinement-panel is-research" aria-labelledby="succession-phase-5-research-title">
    <DeckHeader icon={FileCheck2} kicker="Phase 5 · Research refinement" title="Claim-level provenance and glossary enforcement" description="Generated claims identify whether they use explicit claim sources, inherit an entity source chain, or have no source. Terminology checks separately flag alias-only usage, unlinked mentions, and broken glossary references." />
    <div className="succession-refinement-controls"><label>Inspect record<select value={entityId} onChange={(event) => setEntityId(event.target.value)}>{candidates.map((entity) => <option value={entity.id} key={entity.id}>{entity.name} · {labelize(entity.entityType)}</option>)}</select></label>{provenance && <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(getEntityById(provenance.entity.id)), { entity: provenance.entity.id })}>Open canonical record</button>}</div>
    <MetricStrip records={[
      ['Claims scanned', coverage.claims],
      ['Provenance coverage', `${coverage.coverage}%`],
      ['Unsupported claims', coverage.unsupported],
      ['Glossary terms', glossary.summary.glossaryTerms],
      ['Alias-only mentions', glossary.summary.aliasOnly],
      ['Broken references', glossary.summary.unresolvedReferences],
    ]} />
    <div className="succession-refinement-columns"><section><header><span>Claim provenance</span><h3>{provenance?.entity.name || 'Select a record'}</h3><p>{provenance?.note}</p></header>{provenance && <ol className="succession-refinement-ledger">{provenance.claims.slice(0, 14).map((claim) => <li key={claim.id}><span className={claim.provenanceState === 'source-missing' ? 'is-warning' : 'is-confirmed'}>{claim.inheritedSourceChain ? 'Inherited' : 'Explicit'}</span><div><strong>{claim.label}</strong><small>{labelize(claim.canonLevel)} · {labelize(claim.certainty)} · {claim.sources.length} source{claim.sources.length === 1 ? '' : 's'}</small><p>{claim.displayValue}</p></div></li>)}</ol>}</section><section><header><span>Terminology enforcement</span><h3>Canonical terms and unresolved references</h3></header><ol className="succession-refinement-ledger">{glossary.aliasOnly.slice(0, 6).map((record, index) => <li key={`${record.entity.id}:${record.glossaryId}:${index}`}><span className="is-warning">Alias only</span><div><strong>{record.term}</strong><small>{record.entity.name}</small><p>Used as {record.aliasUsed.join(' · ')} without the canonical term.</p></div><button type="button" onClick={() => onNavigate(entityWorkspaceTarget(getEntityById(record.entity.id)), { entity: record.entity.id })}>Record</button></li>)}{glossary.unresolvedReferences.slice(0, 6).map((record) => <li key={`${record.entity.id}:${record.glossaryId}`}><span className="is-warning">Broken link</span><div><strong>{record.glossaryId}</strong><small>{record.entity.name}</small><p>The record points to a glossary identifier that is not published.</p></div></li>)}</ol>{!glossary.aliasOnly.length && !glossary.unresolvedReferences.length && <p className="succession-refinement-empty"><CheckCircle2 size={16} /> No alias-only or broken glossary references were detected at this boundary.</p>}</section></div>
  </section>;
}

export default function SuccessionWorkspaceRefinementDeck({ routeId, routeParams = {}, spoilerLimit = 414, onNavigate }) {
  if (!supportedRoutes.has(routeId)) return null;
  return <aside className="succession-workspace-refinement" data-refinement-route={routeId} aria-label="Phase 5 workspace refinements">
    {['story', 'chapters'].includes(routeId) && <StoryRefinement routeId={routeId} routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
    {routeId === 'relationships' && <RelationshipRefinement routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
    {routeId === 'black-whale' && <BlackWhaleRefinement routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
    {routeId === 'nen' && <NenRefinement routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
    {routeId === 'research' && <ResearchRefinement routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
  </aside>;
}
