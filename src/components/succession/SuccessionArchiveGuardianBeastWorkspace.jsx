import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CircleHelp,
  Eye,
  GitBranch,
  Network,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
  getGuardianBeastDossier,
} from '../../data/succession/successionData';
import {
  ArchivePageHeader,
  ArchiveState,
  EntityLink,
  EntityVisual,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveGuardianBeastWorkspace.css';
import './SuccessionArchiveGuardianBeastCommand.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const orderValue = (beast) => beast.hostCharacterId === 'character:nasubi-hui-guo-rou' ? 0 : getEntityById(beast.hostCharacterId)?.princeOrder || 99;
const knowledgeClass = (state) => {
  const value = normalize(`${state?.knowledge} ${state?.operationalState}`);
  if (/destroyed|inactive|ended/.test(value)) return 'inactive';
  if (/demonstrated|confirmed|known/.test(value)) return 'known';
  if (/suspected|probable|partial|inferred/.test(value)) return 'suspected';
  return 'unresolved';
};
const hostStateClass = (state) => {
  const value = normalize(state?.hostState);
  if (/deceased|dead/.test(value)) return 'deceased';
  if (/body|conscious|possession|transferred|exception/.test(value)) return 'exceptional';
  return 'active';
};

function BeastOrbit({ records, selectedId, onSelect }) {
  return <section className="succession-gsb-command-orbit" aria-labelledby="succession-gsb-orbit-title">
    <header><Network size={18} aria-hidden="true" /><div><span>Royal Nen constellation</span><h3 id="succession-gsb-orbit-title">Fifteen host-linked ritual records</h3></div></header>
    <div className="succession-gsb-command-orbit__stage" aria-hidden="true">
      <div className="succession-gsb-command-orbit__core"><Sparkles size={30} /><span>Seed Urn</span><small>ritual system</small></div>
      {records.map(({ beast, host, state }, index) => {
        const angle = (360 / records.length) * index - 90;
        const radius = 41;
        const x = 50 + radius * Math.cos(angle * Math.PI / 180);
        const y = 50 + radius * Math.sin(angle * Math.PI / 180);
        return <i className={`is-${knowledgeClass(state)}${selectedId === beast.id ? ' is-selected' : ''}`} style={{ '--orbit-x': `${x}%`, '--orbit-y': `${y}%` }} key={beast.id}><span>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span></i>;
      })}
    </div>
    <div className="succession-gsb-command-orbit__index" aria-label="Guardian Spirit Beast host index">{records.map(({ beast, host, state }) => <button type="button" className={`is-${knowledgeClass(state)}${selectedId === beast.id ? ' is-selected' : ''}`} aria-pressed={selectedId === beast.id} onClick={() => onSelect(beast.id)} key={beast.id}><span>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span><div><b>{host?.name || beast.name}</b><small>{state.knowledge}</small></div><ArrowRight size={13} aria-hidden="true" /></button>)}</div>
  </section>;
}

function BeastCard({ record, mode, onOpen }) {
  const { beast, host, state } = record;
  const classification = knowledgeClass(state);
  const hostClass = hostStateClass(state);
  return <button type="button" className={`succession-gsb-command-card is-${classification} is-host-${hostClass}`} onClick={() => onOpen(beast.id)}>
    <div className="succession-gsb-command-card__visual"><EntityVisual entity={mode === 'host' ? host : beast} /><span style={{ color: 'var(--succession-text-on-paper)' }}>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span></div>
    <div><span>{state.knowledge} · {labelize(classification)}</span><h3>{mode === 'host' ? host?.name || beast.name : beast.name}</h3><p>{state.operationalState}</p><small>{mode === 'host' ? beast.name : `Host: ${host?.name || 'Unresolved'}`}</small></div>
    <dl><div><dt>Known</dt><dd>{state.knownAbilityIds.length}</dd></div><div><dt>Suspected</dt><dd>{state.suspectedAbilityIds.length}</dd></div><div><dt>Unknowns</dt><dd>{state.unresolved.length}</dd></div><div><dt>Host state</dt><dd>{labelize(hostClass)}</dd></div></dl>
    <footer><span>{labelize(state.visibility)}</span><b>Open ritual dossier <ArrowRight size={13} aria-hidden="true" /></b></footer>
  </button>;
}

function BeastDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Guardian Spirit Beast unavailable" description="No Guardian Spirit Beast record has been revealed at this chapter boundary." action={<button type="button" onClick={onBack}>Back to all beasts</button>} />;
  const { beast, host, state } = dossier;
  const classification = knowledgeClass(state);
  return <article className="succession-gsb-dossier succession-gsb-command-dossier">
    <button type="button" className="succession-gsb-back" onClick={onBack}><ArrowLeft size={15} aria-hidden="true" /> All Guardian Spirit Beasts</button>

    <header className="succession-gsb-command-dossier__hero">
      <div className="succession-gsb-command-dossier__visual"><EntityVisual entity={beast} eager /><span>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span></div>
      <div><span>{state.knowledge} · Chapter {dossier.chapter}</span><h2>{beast.name}</h2><p>{state.operationalState}</p><div><EntityLink entity={host} onNavigate={onNavigate}>Open host dossier</EntityLink></div></div>
      <dl><div><dt>Host state</dt><dd>{state.hostState}</dd></div><div><dt>Visibility</dt><dd>{state.visibility}</dd></div><div><dt>Certainty</dt><dd>{labelize(state.certainty)}</dd></div><div><dt>Knowledge</dt><dd>{labelize(classification)}</dd></div></dl>
    </header>

    <section className="succession-gsb-command-separation" aria-labelledby="succession-gsb-separation-title"><header><BrainCircuit size={18} aria-hidden="true" /><div><span>State separation</span><h3 id="succession-gsb-separation-title">Host body, host consciousness, beast activity, and Nen continuation</h3></div></header><div><article><span>01</span><b>Host body</b><p>{state.hostState}</p></article><article><span>02</span><b>Visibility</b><p>{state.visibility}</p></article><article><span>03</span><b>Beast activity</b><p>{state.operationalState}</p></article><article><span>04</span><b>Evidence certainty</b><p>{labelize(state.certainty)}</p></article></div></section>

    <div className="succession-gsb-command-dossier__columns">
      <section><header><Sparkles size={18} aria-hidden="true" /><div><span>Mechanics</span><h3>Known and suspected abilities</h3></div></header>{dossier.abilities.length ? <div>{dossier.abilities.map(({ ability, knowledgeState }) => <button type="button" className={`is-${normalize(knowledgeState).includes('suspect') ? 'suspected' : 'known'}`} key={ability.id} onClick={() => onNavigate('nen', { entity: ability.id })}><span>{knowledgeState}</span><h4>{ability.name}</h4><p>{ability.summary}</p><footer>Open ability model <ArrowRight size={13} aria-hidden="true" /></footer></button>)}</div> : <p>No ability mechanism is available at the selected chapter.</p>}</section>
      <section><header><CircleHelp size={18} aria-hidden="true" /><div><span>Unknowns</span><h3>Questions preserved as unresolved</h3></div></header>{state.unresolved.length ? <ol>{state.unresolved.map((question, index) => <li key={question}><span>{String(index + 1).padStart(2, '0')}</span><p>{question}</p></li>)}</ol> : <p>No additional unresolved fields are maintained for this state.</p>}</section>
    </div>

    <section className="succession-gsb-timeline succession-gsb-command-timeline"><header><Eye size={18} aria-hidden="true" /><div><span>Knowledge history</span><h3>Chapter-bounded state changes</h3></div></header><div>{dossier.timeline.map((record, index) => <article key={record.id} className={record.id === state.id ? 'is-current' : ''}><span>{String(index + 1).padStart(2, '0')}</span><div><small>Ch. {record.chapterRange.start}{record.chapterRange.end && record.chapterRange.end !== record.chapterRange.start ? `–${record.chapterRange.end}` : record.chapterRange.end === null ? '+' : ''}</small><h4>{record.knowledge}</h4><p>{record.operationalState}</p><em>{record.hostState}</em></div></article>)}</div></section>

    <section className="succession-gsb-systems succession-gsb-command-systems"><header><GitBranch size={18} aria-hidden="true" /><div><span>Ritual architecture</span><h3>Connected Nen systems</h3></div></header><div>{dossier.systems.map((system, index) => <button type="button" key={system.id} onClick={() => onNavigate('nen', { system: system.id.replace('nen-system:', '') })}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{labelize(system.category)}</small><h4>{system.name}</h4><p>{system.summary}</p></div><ArrowRight size={14} aria-hidden="true" /></button>)}</div></section>

    <section className="succession-gsb-sources succession-gsb-command-sources"><header><BookOpen size={18} aria-hidden="true" /><div><span>Evidence</span><h3>Available sources at Chapter {dossier.chapter}</h3></div></header><div>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

export default function SuccessionArchiveGuardianBeastWorkspace({ routeParams = {}, spoilerLimit = 413, onNavigate }) {
  const requested = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const [query, setQuery] = useState(routeParams.search || '');
  const [knowledge, setKnowledge] = useState('all');
  const [hostState, setHostState] = useState('all');
  const [mode, setMode] = useState(routeParams.view === 'beasts' ? 'beast' : 'host');
  const [selectedId, setSelectedId] = useState(requested?.entityType === 'guardian-beast' ? requested.id : routeParams.focus ? `guardian-beast:${routeParams.focus}` : null);

  useEffect(() => {
    const entity = routeParams.entity ? getEntityById(routeParams.entity) : null;
    setSelectedId(entity?.entityType === 'guardian-beast' ? entity.id : routeParams.focus ? `guardian-beast:${routeParams.focus}` : null);
  }, [routeParams.entity, routeParams.focus]);

  const records = useMemo(() => getEntitiesByType('guardian-beast')
    .map((beast) => getGuardianBeastDossier(beast.id, spoilerLimit))
    .filter(Boolean)
    .map((dossier) => ({ beast: dossier.beast, host: dossier.host, state: dossier.state }))
    .sort((left, right) => orderValue(left.beast) - orderValue(right.beast)), [spoilerLimit]);
  const knowledgeGroups = useMemo(() => [...new Set(records.map((record) => knowledgeClass(record.state)))].sort(), [records]);
  const hostStateGroups = useMemo(() => [...new Set(records.map((record) => hostStateClass(record.state)))].sort(), [records]);
  const visible = useMemo(() => records.filter(({ beast, host, state }) => {
    const text = normalize([beast.name, host?.name, state.knowledge, state.operationalState, state.hostState, state.visibility, ...state.unresolved].join(' '));
    return (knowledge === 'all' || knowledgeClass(state) === knowledge)
      && (hostState === 'all' || hostStateClass(state) === hostState)
      && (!query.trim() || text.includes(normalize(query)));
  }), [hostState, knowledge, query, records]);
  const selected = selectedId ? getGuardianBeastDossier(selectedId, spoilerLimit) : null;

  if (selectedId) return <BeastDossier dossier={selected} onBack={() => { setSelectedId(null); onNavigate('guardian-spirit-beasts'); }} onNavigate={onNavigate} />;

  const knownCount = records.filter((record) => record.state.knownAbilityIds.length).length;
  const suspectedCount = records.filter((record) => record.state.suspectedAbilityIds.length).length;
  const exceptionalCount = records.filter((record) => hostStateClass(record.state) !== 'active').length;
  const unresolvedCount = records.reduce((total, record) => total + record.state.unresolved.length, 0);
  const activeFilters = [
    query && { id: 'query', label: `Search: ${query}`, clear: () => setQuery('') },
    knowledge !== 'all' && { id: 'knowledge', label: `Knowledge: ${labelize(knowledge)}`, clear: () => setKnowledge('all') },
    hostState !== 'all' && { id: 'host', label: `Host: ${labelize(hostState)}`, clear: () => setHostState('all') },
  ].filter(Boolean);
  const resetFilters = () => { setQuery(''); setKnowledge('all'); setHostState('all'); };

  return <div className="succession-gsb-workspace succession-gsb-command">
    <ArchivePageHeader
      kicker="Batch 4 · Royal parasitic Nen"
      title="Fifteen Guardian Spirit Beasts as changing ritual records"
      description="Each beast is tracked through what is visible, what observers infer, what ability has been demonstrated, the host’s body state, and which questions remain unresolved at the selected chapter."
      meta={[
        { label: `Visible at Ch. ${spoilerLimit}`, value: records.length },
        { label: 'Known mechanics', value: knownCount },
        { label: 'Suspected mechanics', value: suspectedCount },
      ]}
      actions={<button type="button" onClick={() => onNavigate('nen')}><Sparkles size={15} aria-hidden="true" /> Open Nen systems</button>}
    />

    <section className="succession-gsb-command__hero"><div><span><BrainCircuit size={16} aria-hidden="true" /> Royal beast intelligence command</span><h2>Track host state, beast activity, visibility, certainty, and ritual mechanics separately</h2><p>The presentation never treats a host’s body, consciousness, Guardian Spirit Beast, and continuing Nen as one interchangeable state.</p></div><div className="succession-gsb-command__core" aria-hidden="true"><Sparkles size={38} /><strong>{records.length}</strong><span>ritual records</span><i /><i /><i /><i /></div></section>

    <dl className="succession-gsb-command__metrics"><div><dt>Beasts</dt><dd>{records.length}</dd></div><div><dt>Known mechanics</dt><dd>{knownCount}</dd></div><div><dt>Suspected</dt><dd>{suspectedCount}</dd></div><div><dt>Exceptional hosts</dt><dd>{exceptionalCount}</dd></div><div><dt>Open questions</dt><dd>{unresolvedCount}</dd></div></dl>

    <BeastOrbit records={records} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); onNavigate('guardian-spirit-beasts', { entity: id }); }} />

    <section className="succession-gsb-command__controls" aria-label="Guardian Spirit Beast controls"><header><div><button type="button" className={mode === 'host' ? 'is-active' : ''} aria-pressed={mode === 'host'} onClick={() => setMode('host')}><Users size={15} aria-hidden="true" /> Host first</button><button type="button" className={mode === 'beast' ? 'is-active' : ''} aria-pressed={mode === 'beast'} onClick={() => setMode('beast')}><Sparkles size={15} aria-hidden="true" /> Beast first</button></div><strong>{visible.length} of {records.length} visible</strong></header><div><label className="is-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search Guardian Spirit Beasts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Host, mechanic, state, visibility, uncertainty…" /></label><label><span>Knowledge</span><select value={knowledge} onChange={(event) => setKnowledge(event.target.value)}><option value="all">All knowledge states</option>{knowledgeGroups.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label><label><span>Host state</span><select value={hostState} onChange={(event) => setHostState(event.target.value)}><option value="all">All host states</option>{hostStateGroups.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label></div><footer>{!activeFilters.length && <span>No filters applied. Showing every beast revealed through Chapter {spoilerLimit}.</span>}{activeFilters.map((item) => <button type="button" onClick={item.clear} key={item.id}>{item.label} <X size={12} aria-hidden="true" /></button>)}{!!activeFilters.length && <button type="button" className="is-reset" onClick={resetFilters}>Reset all</button>}</footer></section>

    <section className="succession-gsb-grid succession-gsb-command__grid" aria-label="Guardian Spirit Beast records">{visible.map((record) => <BeastCard record={record} mode={mode} onOpen={(id) => { setSelectedId(id); onNavigate('guardian-spirit-beasts', { entity: id }); }} key={record.beast.id} />)}</section>
    {!visible.length && <ArchiveState kind="empty" title="No Guardian Spirit Beast records match" description="Change the knowledge, host-state, or text filters while keeping the selected chapter boundary." action={<button type="button" onClick={resetFilters}>Reset beast filters</button>} />}

    <section className="succession-gsb-boundary succession-gsb-command__boundary"><ShieldAlert size={20} aria-hidden="true" /><div><h3>Host, body, consciousness, and Nen continuation remain separate</h3><p>Kacho’s human-form continuation does not automatically prove her original consciousness survives, while Halkenburg’s original body state does not determine where his consciousness is operating.</p></div><CircleHelp size={18} aria-hidden="true" /></section>
  </div>;
}
