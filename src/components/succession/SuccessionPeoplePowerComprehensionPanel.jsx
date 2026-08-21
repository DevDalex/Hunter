import { useMemo, useState } from 'react';
import { ArrowRight, BrainCircuit, Crown, HeartPulse, Scale, Users } from 'lucide-react';
import {
  getBodyIdentityConsciousnessExplorer,
  getEntitiesByType,
  getEntityById,
  getKnowledgeWarfareMatrix,
  getPrinceCampaignBoard,
} from '../../data/succession/successionData';
import { getExplicitLeverageViews } from '../../data/succession/contentDepthFinishingSelectors';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionPeoplePowerComprehensionPanel.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const compactName = (name) => String(name || '').replace(/ Hui Guo Rou$/i, '');

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unknown'}</span>;
  return <button type="button" className="succession-people-power__entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={10} aria-hidden="true" /></button>;
}

function PrinceCompare({ chapter, onNavigate }) {
  const rows = getPrinceCampaignBoard(chapter);
  const [selectedIds, setSelectedIds] = useState(() => rows.slice(0, 4).map((row) => row.character.id));
  const selected = rows.filter((row) => selectedIds.includes(row.character.id));

  const toggle = (id) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((value) => value !== id)
      : current.length < 4 ? [...current, id] : [...current.slice(1), id]);
  };

  return <section className="succession-people-power__section is-princes">
    <header><span><Crown size={14} aria-hidden="true" /> Prince comparison</span><h3>Compare up to four princes without scanning an 11-column roster</h3><p>Status, location, Nen, assignments, threats and open story pressure remain chapter-bounded.</p></header>
    <div className="succession-people-power__prince-picker" role="group" aria-label="Princes to compare">{rows.map((row) => <button type="button" className={selectedIds.includes(row.character.id) ? 'is-selected' : ''} onClick={() => toggle(row.character.id)} key={row.character.id}><span>{row.order}</span>{compactName(row.character.name)}</button>)}</div>
    <div className="succession-people-power__compare-wrap"><table><thead><tr><th>Dimension</th>{selected.map((row) => <th key={row.character.id}><EntityButton id={row.character.id} onNavigate={onNavigate} /></th>)}</tr></thead><tbody>
      <tr><th>Life / body</th>{selected.map((row) => <td key={row.character.id}>{labelize(row.life)}<small>{labelize(row.body)}</small></td>)}</tr>
      <tr><th>Identity</th>{selected.map((row) => <td key={row.character.id}>{labelize(row.identity)}</td>)}</tr>
      <tr><th>Location</th>{selected.map((row) => <td key={row.character.id}>{row.locationId ? <EntityButton id={row.locationId} onNavigate={onNavigate} /> : 'Unknown'}</td>)}</tr>
      <tr><th>Nen</th>{selected.map((row) => <td key={row.character.id}>{row.abilityIds.length} known</td>)}</tr>
      <tr><th>Assignments</th>{selected.map((row) => <td key={row.character.id}>{row.assignmentIds.length}</td>)}</tr>
      <tr><th>Threat signals</th>{selected.map((row) => <td key={row.character.id}>{row.threatIds.length}</td>)}</tr>
      <tr><th>Open threads</th>{selected.map((row) => <td key={row.character.id}>{row.storyThreadIds.length}</td>)}</tr>
      <tr><th>Latest appearance</th>{selected.map((row) => <td key={row.character.id}>{row.latestAppearance ? `Ch. ${row.latestAppearance}` : '—'}</td>)}</tr>
    </tbody></table></div>
  </section>;
}

function KnowledgeMatrix({ chapter }) {
  const claims = getKnowledgeWarfareMatrix(chapter);
  const characters = getEntitiesByType('character');
  const wanted = ['Benjamin', 'Kurapika', 'Tserriednich', 'Halkenburg', 'Morena'];
  const columns = wanted.map((needle) => characters.find((record) => record.name?.includes(needle))).filter(Boolean);
  const useful = claims.filter((claim) => columns.some((character) => claim.knowerEntityIds.includes(character.id) || claim.misinformedEntityIds.includes(character.id))).slice(0, 12);

  const stateFor = (claim, character) => claim.misinformedEntityIds.includes(character.id)
    ? 'misinformed'
    : claim.knowerEntityIds.includes(character.id)
      ? 'knows'
      : 'unknown';

  return <section className="succession-people-power__section">
    <header><span><BrainCircuit size={14} aria-hidden="true" /> Information war</span><h3>Who knows what?</h3><p>Reader-visible claims are separated from character knowledge. “Unknown” means the archive does not publish that character as a knower at this boundary.</p></header>
    <div className="succession-people-power__knowledge-wrap"><table><thead><tr><th>Claim</th>{columns.map((character) => <th key={character.id}>{compactName(character.name)}</th>)}</tr></thead><tbody>{useful.map((claim) => <tr key={claim.id}><th><span>{claim.name}</span><small>{labelize(claim.secrecy)}</small></th>{columns.map((character) => { const state = stateFor(claim, character); return <td className={`is-${state}`} key={character.id}><span aria-label={`${character.name}: ${state}`}>{state === 'knows' ? '✓' : state === 'misinformed' ? '!' : '—'}</span><small>{labelize(state)}</small></td>; })}</tr>)}</tbody></table></div>
    {claims.length > useful.length && <small className="succession-people-power__shown">Showing {useful.length} matrix-relevant claims from {claims.length} published knowledge records.</small>}
  </section>;
}

function LeverageBoard({ chapter, onNavigate }) {
  const leverage = getExplicitLeverageViews(chapter);
  const rows = [...(leverage.rows || [])]
    .sort((a, b) => (b.political + b.nen + b.legal + b.information) - (a.political + a.nen + a.legal + a.information))
    .slice(0, 12);
  const max = Math.max(1, ...rows.flatMap((row) => [row.political, row.nen, row.legal, row.information]));
  const width = (value) => `${Math.max(3, Math.round((Number(value) / max) * 100))}%`;

  return <section className="succession-people-power__section">
    <header><span><Scale size={14} aria-hidden="true" /> Leverage dimensions</span><h3>Political / Nen / legal / information leverage</h3><p>These are four separate documented signal dimensions. They are deliberately not combined into a fictional “power level.”</p></header>
    <div className="succession-people-power__leverage">{rows.map((row) => <article key={row.character.id}><header><EntityButton id={row.character.id} onNavigate={onNavigate} /><small>{labelize(row.authority)}</small></header><dl>
      <div><dt>Political</dt><dd><span style={{ '--signal-width': width(row.political) }} /><b>{row.political}</b></dd></div>
      <div><dt>Nen</dt><dd><span style={{ '--signal-width': width(row.nen) }} /><b>{row.nen}</b></dd></div>
      <div><dt>Legal</dt><dd><span style={{ '--signal-width': width(row.legal) }} /><b>{row.legal}</b></dd></div>
      <div><dt>Information</dt><dd><span style={{ '--signal-width': width(row.information) }} /><b>{row.information}</b></dd></div>
    </dl></article>)}</div>
    {(leverage.rows?.length || 0) > rows.length && <small className="succession-people-power__shown">Showing {rows.length} of {leverage.rows.length} leverage dossiers.</small>}
  </section>;
}

function BodyIdentity({ chapter, onNavigate }) {
  const rows = getBodyIdentityConsciousnessExplorer(chapter).slice(0, 12);
  return <section className="succession-people-power__section">
    <header><span><HeartPulse size={14} aria-hidden="true" /> Exceptional state model</span><h3>Body ≠ identity ≠ consciousness</h3><p>Possession, transfer, apparent death and post-mortem cases remain multi-dimensional instead of being collapsed into a single alive/dead label.</p></header>
    <div className="succession-people-power__state-grid">{rows.map((row) => <article key={row.character.id}><header><EntityButton id={row.character.id} onNavigate={onNavigate} /></header><div><span>Life<b>{labelize(row.life)}</b></span><i aria-hidden="true">→</i><span>Body<b>{labelize(row.body)}</b></span><i aria-hidden="true">→</i><span>Identity<b>{labelize(row.identity)}</b></span><i aria-hidden="true">→</i><span>Consciousness<b>{labelize(row.consciousness)}</b></span></div></article>)}</div>
  </section>;
}

export default function SuccessionPeoplePowerComprehensionPanel({ chapter = 417, onNavigate }) {
  return <section className="succession-people-power" aria-labelledby="succession-people-power-title">
    <header className="succession-people-power__hero"><span><Users size={15} aria-hidden="true" /> People & Power comprehension</span><h2 id="succession-people-power-title">Compare people, knowledge, leverage and exceptional states before opening the full dossiers</h2><p>The visual layer reads from the same canonical people, relationship, knowledge and chapter-state graph used by the detailed workspaces.</p></header>
    <div className="succession-people-power__layout">
      <PrinceCompare chapter={chapter} onNavigate={onNavigate} />
      <KnowledgeMatrix chapter={chapter} />
      <LeverageBoard chapter={chapter} onNavigate={onNavigate} />
      <BodyIdentity chapter={chapter} onNavigate={onNavigate} />
    </div>
  </section>;
}
