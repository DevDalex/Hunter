import { ArrowRight, GitBranch, Map, Scale, ScrollText, Telescope, Users } from 'lucide-react';
import {
  getAnalyticalFinishingSummary,
  getExplicitLeverageViews,
  getFactionRecentChangeSummaries,
  getForeshadowingTracker,
  getPromisesContractsTracker,
  getSetupPayoffIndex,
  getSpatialEvidenceIntelligence,
} from '../../data/succession/contentDepthFinishingSelectors';
import { getEntityById } from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unknown'}</span>;
  return <button type="button" className="succession-depth-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={11} aria-hidden="true" /></button>;
}

function StatStrip({ items }) {
  return <dl className="succession-depth-stats">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function SetupPayoffTimeline({ records, onNavigate }) {
  const visible = records.slice(0, 12);
  const maxGap = Math.max(1, ...visible.map((row) => Number(row.chapterGap) || 0));
  return <>
    <div className="succession-depth-setup-timeline" aria-label="Setup and payoff mini timelines">{visible.map((row) => <article key={row.id}>
      <div className="succession-depth-setup-node is-setup"><span>Setup · Ch. {row.setupChapter}</span><EntityButton id={row.setup.id} onNavigate={onNavigate} /></div>
      <div className="succession-depth-setup-gap"><span>{row.chapterGap} chapter{row.chapterGap === 1 ? '' : 's'}</span><i aria-hidden="true"><b style={{ '--setup-gap-width': `${Math.max(5, Math.round((Number(row.chapterGap || 0) / maxGap) * 100))}%` }} /></i><small>{labelize(row.causalType)} · {labelize(row.evidenceState)}</small></div>
      <div className="succession-depth-setup-node is-payoff"><span>Consequence / payoff · Ch. {row.payoffChapter}</span><EntityButton id={row.payoff.id} onNavigate={onNavigate} /></div>
    </article>)}</div>
    {records.length > visible.length && <small className="succession-depth-shown">Showing {visible.length} of {records.length} explicit cross-chapter causal links. The detailed table below retains the full research view.</small>}
  </>;
}

export default function SuccessionAnalyticalFinishingPanel({ chapter = 417, onNavigate }) {
  const setup = getSetupPayoffIndex(chapter);
  const foreshadowing = getForeshadowingTracker(chapter);
  const commitments = getPromisesContractsTracker(chapter);
  const spatial = getSpatialEvidenceIntelligence(chapter);
  const factions = getFactionRecentChangeSummaries(chapter);
  const leverage = getExplicitLeverageViews(chapter);
  const summary = getAnalyticalFinishingSummary(chapter);
  const changedFactions = factions.filter((row) => row.changed).slice(0, 12);
  const commitmentRows = [...commitments.protocols, ...commitments.relationships, ...commitments.assignments].slice(0, 24);

  return <section className="succession-depth-workbench succession-depth-finishing" aria-labelledby="succession-depth-finishing-title">
    <header className="succession-depth-hero"><div><span><Telescope size={14} aria-hidden="true" /> Content Depth · Analytical finishing layer</span><h2 id="succession-depth-finishing-title">Signals, commitments, spatial evidence, and retrospective structure</h2><p>Every section is derived through Chapter {chapter}. Setup/payoff and foreshadowing are structural evidence views, not claims about authorial intent or unpublished outcomes.</p></div></header>
    <div className="succession-depth-body">
      <StatStrip items={[["Cross-chapter causal setups", summary.setupPayoff], ["Structural story signals", summary.foreshadowingSignals], ["Promises / contracts", summary.commitments], ["Ship systems", summary.spatialSystems], ["Changed factions", summary.changedFactions], ["Leverage dossiers", summary.leverageRows]]} />

      <section><header className="succession-depth-section-head"><span><GitBranch size={14} aria-hidden="true" /> Setup / payoff index</span><h3>Explicit causal links as chapter-gap timelines</h3><p>Only maintained causal links qualify. A long gap is not itself treated as proof of deliberate setup; the visual bar represents elapsed chapter distance only.</p></header><SetupPayoffTimeline records={setup.records} onNavigate={onNavigate} />{!setup.records.length && <p>No explicit cross-chapter causal setup/payoff candidates are published inside this boundary.</p>}{!!setup.records.length && <details className="succession-depth-research-detail"><summary>Detailed setup / payoff research table · {setup.records.length} records</summary><div className="succession-depth-table-wrap"><table><thead><tr><th>Setup</th><th>Payoff</th><th>Gap</th><th>Link type</th><th>Evidence</th></tr></thead><tbody>{setup.records.map((row) => <tr key={row.id}><td><EntityButton id={row.setup.id} onNavigate={onNavigate} /> <small>Ch. {row.setupChapter}</small></td><td><EntityButton id={row.payoff.id} onNavigate={onNavigate} /> <small>Ch. {row.payoffChapter}</small></td><td>{row.chapterGap} ch.</td><td>{labelize(row.causalType)}</td><td>{labelize(row.evidenceState)}</td></tr>)}</tbody></table></div></details>}</section>

      <section><header className="succession-depth-section-head"><span><Telescope size={14} aria-hidden="true" /> Foreshadowing tracker</span><h3>Retrospective structural signals versus still-open setup</h3><p>Resolved entries connect an earlier maintained story thread to its published resolution. Open entries remain unresolved and are never promoted into predicted payoffs.</p></header><div className="succession-depth-card-grid">{foreshadowing.signals.slice(0, 30).map((row) => <article key={row.id}><span>{labelize(row.status)}</span><h4>{row.name}</h4><p>{row.question || row.evidenceState || 'Maintained story signal.'}</p><small>Opened Ch. {row.openedChapter}{row.resolutionChapter ? ` · resolved Ch. ${row.resolutionChapter}` : ' · unresolved at boundary'}</small></article>)}</div>{foreshadowing.signals.length > 30 && <small className="succession-depth-shown">Showing 30 of {foreshadowing.signals.length} structural story signals.</small>}</section>

      <section><header className="succession-depth-section-head"><span><ScrollText size={14} aria-hidden="true" /> Promises / contracts tracker</span><h3>Published deals, treaties, vows, agreements, and binding terms</h3><p>Records remain typed as protocol, relationship, or assignment so legal/Nen/operational commitments are not collapsed into one generic promise.</p></header><div className="succession-depth-card-grid">{commitmentRows.map((row) => <article key={`${row.sourceType}:${row.id}`}><span>{labelize(row.sourceType)} · {labelize(row.status)}</span><h4>{row.name}</h4><p>{row.terms}</p><div className="succession-depth-links">{row.parties.slice(0, 8).map((id) => <EntityButton id={id} onNavigate={onNavigate} key={id} />)}</div></article>)}</div>{commitments.protocols.length + commitments.relationships.length + commitments.assignments.length > commitmentRows.length && <small className="succession-depth-shown">Showing {commitmentRows.length} of {commitments.protocols.length + commitments.relationships.length + commitments.assignments.length} maintained commitments.</small>}</section>

      <section><header className="succession-depth-section-head"><span><Map size={14} aria-hidden="true" /> Black Whale evidence-led spatial intelligence</span><h3>Operational hotspots and Chapter {spatial.previousChapter} → {spatial.chapter} movement/change evidence</h3><p>The 2D/2.5D atlas remains the presentation layer; this intelligence view adds system classification, occupancy/event/assignment load, movement deltas, and provenance coverage.</p></header><StatStrip items={[["Systems", spatial.summary.systems], ["Locations", spatial.summary.locations], ["Changed locations", spatial.summary.changedLocations], ["Character movements", spatial.summary.movements], ["Fully evidenced hotspots", spatial.summary.evidenceBackedHotspots]]} /><div className="succession-depth-table-wrap"><table><thead><tr><th>Hotspot</th><th>System</th><th>Operational load</th><th>Evidence</th><th>Unsupported claims</th></tr></thead><tbody>{spatial.hotspots.map((row) => <tr key={row.location.id}><td><EntityButton id={row.location.id} onNavigate={onNavigate} /></td><td>{labelize(row.system)}</td><td>{row.operationalLoad}</td><td>{row.provenanceCoverage}% · {row.sourceCount} sources</td><td>{row.unsupportedClaims}</td></tr>)}</tbody></table></div></section>

      <section><header className="succession-depth-section-head"><span><Users size={14} aria-hidden="true" /> Faction recent-change summaries</span><h3>Resource snapshots with chapter-over-chapter deltas</h3><p>Static membership is not mistaken for a new event; deltas expose newly available abilities/events and other maintained resource changes.</p></header><div className="succession-depth-card-grid">{changedFactions.map((row) => <article key={row.organization.id}><h4><EntityButton id={row.organization.id} onNavigate={onNavigate} /></h4><p>Since Ch. {row.previousChapter}: members {row.changes.members >= 0 ? '+' : ''}{row.changes.members} · abilities {row.changes.abilities >= 0 ? '+' : ''}{row.changes.abilities} · events {row.changes.events >= 0 ? '+' : ''}{row.changes.events}</p></article>)}</div>{!changedFactions.length && <p>No faction resource deltas are recorded from the previous maintained chapter.</p>}{factions.filter((row) => row.changed).length > changedFactions.length && <small className="succession-depth-shown">Showing {changedFactions.length} of {factions.filter((row) => row.changed).length} changed factions.</small>}</section>

      <section><header className="succession-depth-section-head"><span><Scale size={14} aria-hidden="true" /> Political / Nen / legal / information leverage</span><h3>Four explicit signal dimensions, not a power-ranking score</h3><p>Political signals derive from maintained relationships and authority; legal signals from law, Justice, martial-law and custody records. Nen and information remain separate counts.</p></header><div className="succession-depth-table-wrap"><table><thead><tr><th>Character</th><th>Political</th><th>Nen</th><th>Legal</th><th>Information</th><th>Authority</th></tr></thead><tbody>{[...leverage.rows].sort((a, b) => (b.political + b.nen + b.legal + b.information) - (a.political + a.nen + a.legal + a.information)).slice(0, 24).map((row) => <tr key={row.character.id}><td><EntityButton id={row.character.id} onNavigate={onNavigate} /></td><td>{row.political}</td><td>{row.nen}</td><td>{row.legal}</td><td>{row.information}</td><td>{labelize(row.authority)}</td></tr>)}</tbody></table></div>{leverage.rows.length > 24 && <small className="succession-depth-shown">Showing 24 of {leverage.rows.length} leverage dossiers.</small>}</section>
    </div>
  </section>;
}
