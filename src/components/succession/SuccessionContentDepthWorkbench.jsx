import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Building2,
  CircleAlert,
  Crown,
  Eye,
  FileWarning,
  GitBranch,
  HeartPulse,
  Network,
  Scale,
  Search,
  ShieldAlert,
  Swords,
  Users,
  Workflow,
} from 'lucide-react';
import {
  getAbilityTransferInheritanceLedger,
  getActiveCountdowns,
  getAllianceBetrayalLedger,
  getBodyIdentityConsciousnessExplorer,
  getChapterWhatChanged,
  getCharacterCampaignDossier,
  getConsequenceChains,
  getContentDepthSummary,
  getCurseRegistry,
  getDeceptionLedger,
  getEntityById,
  getFactionResourceBoard,
  getHeilLyContagionDashboard,
  getKnowledgeWarfareMatrix,
  getKurapikaMissionLedger,
  getLeverageBoard,
  getLifeStatusLedger,
  getMafiaWarCommandCenter,
  getMartialLawCommandBoard,
  getNenTrainingTracker,
  getOrdersSurveillanceCustodyLedger,
  getPrinceCampaignBoard,
  getQueenIntelligenceBoard,
  getReaderVsInUniverseKnowledge,
  getRoyalHouseholdMatrix,
  getSuccessionRulesEngine,
  getThreatAssassinationMatrix,
  getTroupeHisokaTracker,
  getUnresolvedLedgers,
} from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionContentDepthWorkbench.css';

const views = Object.freeze([
  ['overview', 'Overview', Network],
  ['princes', '14 Princes', Crown],
  ['queens', '8 Queens', Users],
  ['knowledge', 'Knowledge War', BrainCircuit],
  ['threats', 'Threats', ShieldAlert],
  ['bodies', 'Body / Identity', HeartPulse],
  ['command', 'Martial Law', Scale],
  ['heil-ly', 'Heil-Ly', Activity],
  ['households', 'Households', Building2],
  ['rules', 'Rules Engine', BookOpenCheck],
  ['nen', 'Nen Trackers', GitBranch],
  ['factions', 'Factions', Swords],
  ['campaigns', 'Campaigns', Workflow],
  ['chapter', 'What Changed?', FileWarning],
  ['analysis', 'Deep Analysis', Eye],
]);
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const join = (values = []) => values.filter(Boolean).join(' · ') || 'None published';

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unknown'}</span>;
  return <button type="button" className="succession-depth-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={11} aria-hidden="true" /></button>;
}

function StatStrip({ items }) {
  return <dl className="succession-depth-stats">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function Overview({ chapter, onSelect }) {
  const summary = getContentDepthSummary(chapter);
  const cards = [
    ['princes', 'Royal campaign board', 'All fourteen princes with body, identity, location, Nen, assignments, threats, knowledge and active threads.', `${summary.princes} princes`, Crown],
    ['knowledge', 'Knowledge warfare', 'Track who knows a claim, who is protected from it, and where misinformation remains operational.', `${summary.knowledgeClaims} claims`, BrainCircuit],
    ['threats', 'Threat & assassination matrix', 'Hostile relationships and operational assignments collapsed into target → attacker → method state.', `${summary.threats} signals`, ShieldAlert],
    ['bodies', 'Body / identity / consciousness', 'Expose possession, post-mortem continuation, apparent death and displaced-consciousness cases without flattening them.', `${summary.exceptionalBodyStates} exceptional`, HeartPulse],
    ['analysis', 'Deep analytical ledgers', 'Countdowns, deception, orders, alliances, leverage, unresolved identities/abilities/locations, knowledge asymmetry and consequence chains.', `${summary.countdownSignals} deadline signals`, Eye],
  ];
  return <section className="succession-depth-overview"><header><span>One graph, many lenses</span><h3>Strategic intelligence through Chapter {chapter}</h3><p>These views derive from the canonical archive. They do not duplicate lore or manufacture facts between chapters.</p></header><div>{cards.map(([id, title, description, meta, Icon]) => <article key={id}><Icon size={21} aria-hidden="true" /><span>{meta}</span><h4>{title}</h4><p>{description}</p><button type="button" onClick={() => onSelect(id)}>Open view <ArrowRight size={13} /></button></article>)}</div></section>;
}

function Princes({ chapter, onNavigate }) {
  const rows = getPrinceCampaignBoard(chapter);
  return <section><header className="succession-depth-section-head"><span>Royal campaign board</span><h3>All fourteen princes</h3><p>Current state is chapter-bounded. Threat count means active hostile/targeting graph edges, not predicted deaths.</p></header><div className="succession-depth-table-wrap"><table><thead><tr><th>Prince</th><th>Life</th><th>Body</th><th>Identity</th><th>Location</th><th>Beast</th><th>Nen</th><th>Guards / ops</th><th>Threats</th><th>Threads</th><th>Latest</th></tr></thead><tbody>{rows.map((row) => <tr key={row.character.id}><td><EntityButton id={row.character.id} onNavigate={onNavigate} /></td><td>{labelize(row.life)}</td><td>{labelize(row.body)}</td><td>{labelize(row.identity)}</td><td>{row.locationId ? <EntityButton id={row.locationId} onNavigate={onNavigate} /> : 'Unknown'}</td><td>{row.guardianBeastId ? <EntityButton id={row.guardianBeastId} onNavigate={onNavigate} /> : 'Unrevealed / none'}</td><td>{row.abilityIds.length}</td><td>{row.assignmentIds.length}</td><td>{row.threatIds.length}</td><td>{row.storyThreadIds.length}</td><td>{row.latestAppearance ? `Ch. ${row.latestAppearance}` : '—'}</td></tr>)}</tbody></table></div></section>;
}

function Queens({ chapter, onNavigate }) {
  const rows = getQueenIntelligenceBoard(chapter);
  return <section><header className="succession-depth-section-head"><span>Eight Queens intelligence</span><h3>Maternal branches and active pressure</h3><p>Children, assignments, relationships and story threads remain linked to the same canonical people graph.</p></header><div className="succession-depth-card-grid">{rows.map((row) => <article key={row.character.id}><span>{row.rank || 'Queen'}</span><h4><EntityButton id={row.character.id} onNavigate={onNavigate} /></h4><dl><div><dt>Life</dt><dd>{labelize(row.life)}</dd></div><div><dt>Children</dt><dd>{row.childIds.length}</dd></div><div><dt>Assignments</dt><dd>{row.assignmentIds.length}</dd></div><div><dt>Threats</dt><dd>{row.threatIds.length}</dd></div><div><dt>Threads</dt><dd>{row.storyThreadIds.length}</dd></div><div><dt>Latest</dt><dd>{row.latestAppearance ? `Ch. ${row.latestAppearance}` : '—'}</dd></div></dl><div className="succession-depth-links">{row.childIds.map((id) => <EntityButton id={id} onNavigate={onNavigate} key={id} />)}</div></article>)}</div></section>;
}

function Knowledge({ chapter }) {
  const rows = getKnowledgeWarfareMatrix(chapter);
  return <section><header className="succession-depth-section-head"><span>Information asymmetry</span><h3>Reader truth is not character knowledge</h3><p>Every claim separates its subject, knowers, protected/misinformed parties and disclosure state.</p></header><div className="succession-depth-card-grid">{rows.map((row) => <article key={row.id}><span>{labelize(row.state)} · {labelize(row.secrecy)}</span><h4>{row.name}</h4><dl><div><dt>Known by</dt><dd>{join(row.knowerLabels)}</dd></div><div><dt>Hidden / misinformed</dt><dd>{join(row.misinformedLabels)}</dd></div><div><dt>Acquired</dt><dd>{row.acquisition || 'Not specified'}</dd></div></dl></article>)}</div></section>;
}

function Threats({ chapter, onNavigate }) {
  const rows = getThreatAssassinationMatrix(chapter);
  return <section><header className="succession-depth-section-head"><span>Threat / assassination matrix</span><h3>Who is targeting whom?</h3><p>Includes hostile relationships and operational assignments involving attack, curse, poisoning, infection, coercion, infiltration, surveillance or elimination.</p></header><div className="succession-depth-table-wrap"><table><thead><tr><th>Source</th><th>Target</th><th>Method</th><th>Status</th><th>Basis</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.source ? <EntityButton id={row.source.id} onNavigate={onNavigate} /> : 'Unknown'}</td><td>{row.target ? <EntityButton id={row.target.id} onNavigate={onNavigate} /> : 'Unknown'}</td><td>{labelize(row.method)}</td><td>{labelize(row.status)}</td><td>{labelize(row.sourceType)}</td></tr>)}</tbody></table></div></section>;
}

function Bodies({ chapter, onNavigate }) {
  const rows = getBodyIdentityConsciousnessExplorer(chapter);
  return <section><header className="succession-depth-section-head"><span>Exceptional state model</span><h3>Body ≠ identity ≠ consciousness</h3><p>Possession and post-mortem cases remain multi-dimensional instead of being crushed into a single “alive/dead” badge.</p></header><div className="succession-depth-table-wrap"><table><thead><tr><th>Character</th><th>Life</th><th>Body</th><th>Identity</th><th>Consciousness</th><th>Location</th></tr></thead><tbody>{rows.map((row) => <tr key={row.character.id}><td><EntityButton id={row.character.id} onNavigate={onNavigate} /></td><td>{labelize(row.life)}</td><td>{labelize(row.body)}</td><td>{labelize(row.identity)}</td><td>{labelize(row.consciousness)}</td><td>{row.locationId ? <EntityButton id={row.locationId} onNavigate={onNavigate} /> : 'Unknown'}</td></tr>)}</tbody></table></div></section>;
}

function Command({ chapter, onNavigate }) {
  const board = getMartialLawCommandBoard(chapter);
  return <section><header className="succession-depth-section-head"><span>Special Martial Law</span><h3>Military / Justice command board</h3><p>The formal declaration boundary is Chapter 415. This view tracks institutional control without pretending emergency authority has unlimited legal scope.</p></header><StatStrip items={[["Protocols", board.protocolIds.length], ["Assignments", board.assignmentIds.length], ["Command / custody edges", board.relationshipIds.length]]} /><div className="succession-depth-links succession-depth-links--large">{board.institutions.map((entity) => <EntityButton id={entity.id} onNavigate={onNavigate} key={entity.id} />)}</div></section>;
}

function HeilLy({ chapter, onNavigate }) {
  const board = getHeilLyContagionDashboard(chapter);
  return <section><header className="succession-depth-section-head"><span>Contagion network</span><h3>Heil-Ly operational dashboard</h3><p>Member state, known Nen, appearances, events and operations derive from canonical organization membership rather than a second roster.</p></header><StatStrip items={[["Members", board.members.length], ["Known abilities", board.abilityIds.length], ["Events", board.eventIds.length], ["Assignments", board.assignmentIds.length]]} /><div className="succession-depth-card-grid">{board.members.map((row) => <article key={row.character.id}><h4><EntityButton id={row.character.id} onNavigate={onNavigate} /></h4><dl><div><dt>Life</dt><dd>{labelize(row.life)}</dd></div><div><dt>Location</dt><dd>{row.locationId ? <EntityButton id={row.locationId} onNavigate={onNavigate} /> : 'Unknown'}</dd></div><div><dt>Nen</dt><dd>{row.abilityIds.length}</dd></div><div><dt>Latest</dt><dd>{row.latestAppearance ? `Ch. ${row.latestAppearance}` : '—'}</dd></div></dl></article>)}</div></section>;
}

function Households({ chapter, onNavigate }) {
  const rows = getRoyalHouseholdMatrix(chapter);
  return <section><header className="succession-depth-section-head"><span>Royal personnel matrix</span><h3>Protection, surveillance and reporting chains</h3></header><div className="succession-depth-card-grid">{rows.map((row) => <article key={row.character.id}><h4><EntityButton id={row.character.id} onNavigate={onNavigate} /></h4><dl><div><dt>Personnel</dt><dd>{row.personnelIds.length}</dd></div><div><dt>Active assignments</dt><dd>{row.householdAssignmentIds.length}</dd></div><div><dt>Threat edges</dt><dd>{row.threatIds.length}</dd></div></dl><div className="succession-depth-links">{row.personnelIds.slice(0, 12).map((id) => <EntityButton id={id} onNavigate={onNavigate} key={id} />)}</div></article>)}</div></section>;
}

function Rules({ chapter }) {
  const engine = getSuccessionRulesEngine(chapter);
  return <section><header className="succession-depth-section-head"><span>Succession Rules Engine</span><h3>Ritual, Nen, legal, military and operational rules stay separate</h3></header><StatStrip items={[["Rules", engine.records.length], ["Domains", engine.domains.length], ["Disputed / partial", engine.disputedIds.length]]} /><div className="succession-depth-card-grid">{engine.records.map((row) => <article key={row.id}><span>{labelize(row.domain)} · {labelize(row.protocolStatus)}</span><h4>{row.name}</h4><p>{row.ruleStatement}</p><dl><div><dt>Authority</dt><dd>{row.authority}</dd></div><div><dt>Trigger</dt><dd>{row.trigger}</dd></div><div><dt>Open limits</dt><dd>{join(row.openQuestions)}</dd></div></dl></article>)}</div></section>;
}

function Nen({ chapter, onNavigate }) {
  const training = getNenTrainingTracker(chapter);
  const transfers = getAbilityTransferInheritanceLedger(chapter);
  const curses = getCurseRegistry(chapter);
  return <section><header className="succession-depth-section-head"><span>Nen development</span><h3>Training, curses and transfer / inheritance</h3></header><StatStrip items={[["Training events", training.eventIds.length], ["Tracked participants", training.participants.length], ["Transfer abilities", transfers.length], ["Curse abilities", curses.abilities.length]]} /><h4 className="succession-depth-subhead">Transfer / inheritance ledger</h4><div className="succession-depth-card-grid">{transfers.map((row) => <article key={row.ability.id}><h4><EntityButton id={row.ability.id} onNavigate={onNavigate} /></h4><dl><div><dt>Owners</dt><dd>{row.ownerIds.length}</dd></div><div><dt>Activation</dt><dd>{row.activation || 'Unknown'}</dd></div><div><dt>Status</dt><dd>{row.researchStatus || 'Maintained'}</dd></div></dl></article>)}</div></section>;
}

function Factions({ chapter, onNavigate }) {
  const mafia = getMafiaWarCommandCenter(chapter);
  const troupe = getTroupeHisokaTracker(chapter);
  const resources = getFactionResourceBoard(chapter).sort((a, b) => b.memberIds.length - a.memberIds.length).slice(0, 16);
  return <section><header className="succession-depth-section-head"><span>Faction command center</span><h3>Mafia, Phantom Troupe and organization resources</h3></header><h4 className="succession-depth-subhead">Kakin mafia</h4><div className="succession-depth-card-grid">{mafia.map((row) => <article key={row.organization.id}><h4><EntityButton id={row.organization.id} onNavigate={onNavigate} /></h4><dl><div><dt>Members</dt><dd>{row.memberIds.length}</dd></div><div><dt>Known Nen</dt><dd>{row.abilityIds.length}</dd></div><div><dt>Events</dt><dd>{row.eventIds.length}</dd></div></dl></article>)}</div><h4 className="succession-depth-subhead">Troupe / Hisoka</h4><p>{troupe.hisoka ? <><EntityButton id={troupe.hisoka.id} onNavigate={onNavigate} /> · location {troupe.hisokaLocationId ? <EntityButton id={troupe.hisokaLocationId} onNavigate={onNavigate} /> : 'unknown'} · {troupe.threadIds.length} active story threads</> : 'Hisoka record unavailable.'}</p><h4 className="succession-depth-subhead">Resource snapshot</h4><div className="succession-depth-card-grid">{resources.map((row) => <article key={row.organization.id}><h4><EntityButton id={row.organization.id} onNavigate={onNavigate} /></h4><p>{row.memberIds.length} members · {row.abilityIds.length} known abilities · {row.eventIds.length} bounded events</p></article>)}</div></section>;
}

function Campaigns({ chapter, onNavigate }) {
  const ids = ['character:kurapika', 'character:benjamin-hui-guo-rou', 'character:tserriednich-hui-guo-rou', 'character:halkenburg-hui-guo-rou', 'character:morena-prudo', 'character:borksen', 'character:fugetsu-hui-guo-rou', 'character:camilla-hui-guo-rou', 'character:zhang-lei-hui-guo-rou', 'character:chrollo-lucilfer', 'character:hisoka-morow'];
  const rows = ids.map((id) => getCharacterCampaignDossier(id, chapter)).filter(Boolean);
  const kurapika = getKurapikaMissionLedger(chapter);
  return <section><header className="succession-depth-section-head"><span>Character campaign dossiers</span><h3>Objectives, resources, threats and information</h3></header><div className="succession-depth-card-grid">{rows.map((row) => <article key={row.character.id}><h4><EntityButton id={row.character.id} onNavigate={onNavigate} /></h4><dl><div><dt>Life</dt><dd>{labelize(row.life)}</dd></div><div><dt>Nen</dt><dd>{row.abilityIds.length}</dd></div><div><dt>Operations</dt><dd>{row.assignmentIds.length}</dd></div><div><dt>Threats</dt><dd>{row.hostileRelationshipIds.length}</dd></div><div><dt>Knowledge</dt><dd>{row.knowledgeIds.length}</dd></div><div><dt>Threads</dt><dd>{row.storyThreadIds.length}</dd></div></dl><p>{join(row.currentObjectives.slice(0, 3))}</p></article>)}</div><h4 className="succession-depth-subhead">Kurapika mission ledger</h4><div className="succession-depth-links succession-depth-links--large">{kurapika.missions.map((mission) => <span className={mission.active ? 'is-active' : ''} key={mission.id}>{labelize(mission.id.replace('kurapika-mission:', ''))}</span>)}</div></section>;
}

function ChapterChanges({ chapter }) {
  const change = getChapterWhatChanged(chapter);
  const byType = Object.entries(change.summary.byType || {});
  return <section><header className="succession-depth-section-head"><span>Chapter delta</span><h3>What changed in Chapter {change.chapter}?</h3><p>Compared with Chapter {change.previousChapter}. Unchanged records are omitted.</p></header><StatStrip items={[["Added", change.summary.added], ["Changed", change.summary.changed], ["Removed", change.summary.removed], ["New mystery cases", change.openedMysteryCaseIds.length]]} /><div className="succession-depth-card-grid">{byType.map(([type, counts]) => <article key={type}><span>{labelize(type)}</span><h4>{counts.added + counts.changed + counts.removed} changes</h4><p>{counts.added} added · {counts.changed} changed · {counts.removed} removed</p></article>)}</div></section>;
}

function DeepAnalysis({ chapter, onNavigate }) {
  const deception = getDeceptionLedger(chapter);
  const ops = getOrdersSurveillanceCustodyLedger(chapter);
  const alliances = getAllianceBetrayalLedger(chapter);
  const countdowns = getActiveCountdowns(chapter);
  const unresolved = getUnresolvedLedgers(chapter);
  const leverage = getLeverageBoard(chapter).sort((a, b) => (b.nen + b.operational + b.information) - (a.nen + a.operational + a.information)).slice(0, 18);
  const life = getLifeStatusLedger(chapter);
  const reader = getReaderVsInUniverseKnowledge(chapter);
  const chains = getConsequenceChains(chapter);
  return <section><header className="succession-depth-section-head"><span>Analytical finishing layer</span><h3>Deception, control, leverage, unresolved systems and consequences</h3></header><StatStrip items={[["Deception edges", deception.length], ["Orders / custody", ops.assignmentIds.length + ops.relationshipIds.length], ["Alliance / hostile edges", alliances.length], ["Countdown signals", countdowns.threadIds.length + countdowns.mysteryCaseIds.length], ["Life-state rows", life.length], ["Knowledge comparisons", reader.length], ["Causal links", chains.links.length]]} /><h4 className="succession-depth-subhead">Unresolved ledgers</h4><div className="succession-depth-card-grid"><article><h4>Identity / consciousness</h4><p>{unresolved.identities.length} cases</p></article><article><h4>Nen / mechanics</h4><p>{unresolved.abilities.length} cases</p></article><article><h4>Location / route</h4><p>{unresolved.locations.length} cases</p></article></div><h4 className="succession-depth-subhead">Leverage snapshot</h4><div className="succession-depth-table-wrap"><table><thead><tr><th>Character</th><th>Nen</th><th>Operations</th><th>Relationships</th><th>Information</th><th>Authority</th></tr></thead><tbody>{leverage.map((row) => <tr key={row.character.id}><td><EntityButton id={row.character.id} onNavigate={onNavigate} /></td><td>{row.nen}</td><td>{row.operational}</td><td>{row.relational}</td><td>{row.information}</td><td>{labelize(row.authority)}</td></tr>)}</tbody></table></div></section>;
}

export default function SuccessionContentDepthWorkbench({ routeParams = {}, spoilerLimit = 417, onNavigate }) {
  const active = routeParams.mode === 'depth';
  const selectedView = views.some(([id]) => id === routeParams.view) ? routeParams.view : 'overview';
  const [query, setQuery] = useState('');
  const chapter = Math.min(spoilerLimit, Math.max(340, Number(routeParams.chapter) || spoilerLimit));
  const selectedMeta = views.find(([id]) => id === selectedView) || views[0];
  const select = (view) => onNavigate('research', { mode: 'depth', view, ...(chapter !== spoilerLimit ? { chapter } : {}) });
  const result = useMemo(() => ({ query }), [query]);

  if (!active) return <section className="succession-depth-entry"><Network size={21} aria-hidden="true" /><div><span>Content Depth · Strategic intelligence</span><h3>The board behind the story.</h3><p>Royal campaigns, information asymmetry, threats, exceptional body states, martial law, Heil-Ly, households, rules, Nen, factions and analytical ledgers share one chapter-bounded engine.</p></div><button type="button" onClick={() => select('overview')}>Open strategic workbench <ArrowRight size={13} /></button></section>;

  return <section className="succession-depth-workbench" aria-labelledby="succession-depth-title">
    <header className="succession-depth-hero"><div><span><Network size={14} aria-hidden="true" /> Content Depth · {selectedMeta[1]}</span><h2 id="succession-depth-title">Succession strategic intelligence</h2><p>Derived from the canonical archive through Chapter {chapter}. No Chapter {chapter + 1}+ outcome is inferred.</p></div><label><Search size={15} aria-hidden="true" /><span className="sr-only">Local workbench filter</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter support coming per view…" /></label></header>
    <nav className="succession-depth-tabs" aria-label="Strategic content depth views">{views.map(([id, label, Icon]) => <button type="button" className={selectedView === id ? 'is-active' : ''} aria-current={selectedView === id ? 'page' : undefined} onClick={() => select(id)} key={id}><Icon size={14} aria-hidden="true" /><span>{label}</span></button>)}</nav>
    <div className="succession-depth-body" data-query={result.query}>
      {selectedView === 'overview' && <Overview chapter={chapter} onSelect={select} />}
      {selectedView === 'princes' && <Princes chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'queens' && <Queens chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'knowledge' && <Knowledge chapter={chapter} />}
      {selectedView === 'threats' && <Threats chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'bodies' && <Bodies chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'command' && <Command chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'heil-ly' && <HeilLy chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'households' && <Households chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'rules' && <Rules chapter={chapter} />}
      {selectedView === 'nen' && <Nen chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'factions' && <Factions chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'campaigns' && <Campaigns chapter={chapter} onNavigate={onNavigate} />}
      {selectedView === 'chapter' && <ChapterChanges chapter={chapter} />}
      {selectedView === 'analysis' && <DeepAnalysis chapter={chapter} onNavigate={onNavigate} />}
    </div>
  </section>;
}
