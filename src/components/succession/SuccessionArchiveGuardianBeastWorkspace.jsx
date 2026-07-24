import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CircleHelp,
  Eye,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
  getGuardianBeastDossier,
  getGuardianBeastStateAtChapter,
} from '../../data/succession/successionData';
import {
  ArchivePageHeader,
  ArchiveState,
  EntityLink,
  EntityVisual,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveGuardianBeastWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const orderValue = (beast) => beast.hostCharacterId === 'character:nasubi-hui-guo-rou' ? 0 : getEntityById(beast.hostCharacterId)?.princeOrder || 99;

function BeastDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="Guardian Spirit Beast unavailable" description="No canonical beast dossier is available at this chapter boundary." action={<button type="button" onClick={onBack}>Back to all beasts</button>} />;
  const { beast, host, state } = dossier;
  return <article className="succession-gsb-dossier">
    <button type="button" className="succession-gsb-back" onClick={onBack}><ArrowLeft size={15} /> All Guardian Spirit Beasts</button>
    <header className="succession-gsb-dossier__hero">
      <EntityVisual entity={beast} eager />
      <div><span>{state.knowledge} · Chapter {dossier.chapter}</span><h2>{beast.name}</h2><p>{state.operationalState}</p><div className="succession-gsb-dossier__links"><EntityLink entity={host} onNavigate={onNavigate}>Open host dossier</EntityLink></div></div>
      <dl><div><dt>Host state</dt><dd>{state.hostState}</dd></div><div><dt>Visibility</dt><dd>{state.visibility}</dd></div><div><dt>Certainty</dt><dd>{labelize(state.certainty)}</dd></div></dl>
    </header>
    <div className="succession-gsb-dossier__columns">
      <section><header><Sparkles size={18} /><div><span>Mechanics</span><h3>Known and suspected abilities</h3></div></header>{dossier.abilities.length ? <div>{dossier.abilities.map(({ ability, knowledgeState }) => <article key={ability.id}><span>{knowledgeState}</span><h4>{ability.name}</h4><p>{ability.summary}</p><button type="button" onClick={() => onNavigate('nen', { entity: ability.id })}>Open ability</button></article>)}</div> : <p>No ability mechanism is available at the selected chapter.</p>}</section>
      <section><header><CircleHelp size={18} /><div><span>Unknowns</span><h3>Questions preserved as unresolved</h3></div></header>{state.unresolved.length ? <ul>{state.unresolved.map((question) => <li key={question}>{question}</li>)}</ul> : <p>No additional unresolved fields are maintained for this state.</p>}</section>
    </div>
    <section className="succession-gsb-timeline"><header><Eye size={18} /><div><span>Knowledge history</span><h3>Chapter-bounded state changes</h3></div></header><div>{dossier.timeline.map((record) => <article key={record.id} className={record.id === state.id ? 'is-current' : ''}><span>Ch. {record.chapterRange.start}{record.chapterRange.end && record.chapterRange.end !== record.chapterRange.start ? `–${record.chapterRange.end}` : record.chapterRange.end === null ? '+' : ''}</span><h4>{record.knowledge}</h4><p>{record.operationalState}</p><small>{record.hostState}</small></article>)}</div></section>
    <section className="succession-gsb-systems"><header><Sparkles size={18} /><div><span>Ritual architecture</span><h3>Connected Nen systems</h3></div></header><div>{dossier.systems.map((system) => <article key={system.id}><span>{labelize(system.category)}</span><h4>{system.name}</h4><p>{system.summary}</p><button type="button" onClick={() => onNavigate('nen', { system: system.id.replace('nen-system:', '') })}>Open system</button></article>)}</div></section>
    <section className="succession-gsb-sources"><header><BookOpen size={18} /><div><span>Evidence</span><h3>Available sources at Chapter {dossier.chapter}</h3></div></header><div>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

export default function SuccessionArchiveGuardianBeastWorkspace({ routeParams = {}, spoilerLimit = 413, onNavigate }) {
  const requested = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const [query, setQuery] = useState(routeParams.search || '');
  const [knowledge, setKnowledge] = useState('all');
  const [selectedId, setSelectedId] = useState(requested?.entityType === 'guardian-beast' ? requested.id : routeParams.focus ? `guardian-beast:${routeParams.focus}` : null);

  useEffect(() => {
    const entity = routeParams.entity ? getEntityById(routeParams.entity) : null;
    setSelectedId(entity?.entityType === 'guardian-beast' ? entity.id : routeParams.focus ? `guardian-beast:${routeParams.focus}` : null);
  }, [routeParams.entity, routeParams.focus]);

  const records = useMemo(() => getEntitiesByType('guardian-beast')
    .map((beast) => ({ beast, host: getEntityById(beast.hostCharacterId), state: getGuardianBeastStateAtChapter(beast.id, spoilerLimit) }))
    .filter((record) => record.state)
    .sort((left, right) => orderValue(left.beast) - orderValue(right.beast)), [spoilerLimit]);
  const knowledgeGroups = useMemo(() => [...new Set(records.map((record) => record.state.knowledge))].sort(), [records]);
  const visible = useMemo(() => records.filter(({ beast, host, state }) => {
    const text = normalize([beast.name, host?.name, state.knowledge, state.operationalState, state.hostState, ...state.unresolved].join(' '));
    return (knowledge === 'all' || state.knowledge === knowledge) && (!query.trim() || text.includes(normalize(query)));
  }), [knowledge, query, records]);
  const selected = selectedId ? getGuardianBeastDossier(selectedId, spoilerLimit) : null;

  if (selectedId) return <BeastDossier dossier={selected} onBack={() => { setSelectedId(null); onNavigate('guardian-spirit-beasts'); }} onNavigate={onNavigate} />;

  return <div className="succession-gsb-workspace">
    <ArchivePageHeader
      kicker="Batch 3 · Royal parasitic Nen"
      title="Fifteen Guardian Spirit Beasts as changing ritual records"
      description="Each beast is tracked through what is visible, what observers infer, what ability has been demonstrated, the host’s body state, and which questions remain unresolved at the selected chapter."
      meta={[
        { label: `Visible at Ch. ${spoilerLimit}`, value: records.length },
        { label: 'Known mechanics', value: records.filter((record) => record.state.knownAbilityIds.length).length },
        { label: 'Suspected mechanics', value: records.filter((record) => record.state.suspectedAbilityIds.length).length },
      ]}
      actions={<button type="button" onClick={() => onNavigate('nen')}><Sparkles size={15} /> Open Nen systems</button>}
    />
    <div className="succession-gsb-tools"><label><Search size={16} /><span className="sr-only">Search Guardian Spirit Beasts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Host, mechanic, state, uncertainty…" /></label><div><button type="button" className={knowledge === 'all' ? 'is-active' : ''} onClick={() => setKnowledge('all')}>All states</button>{knowledgeGroups.map((value) => <button type="button" className={knowledge === value ? 'is-active' : ''} onClick={() => setKnowledge(value)} key={value}>{value}</button>)}</div></div>
    <section className="succession-gsb-grid" aria-label="Guardian Spirit Beast records">{visible.map(({ beast, host, state }) => <button type="button" key={beast.id} className={state.hostState.includes('deceased') || state.knowledge.includes('destroyed') || state.knowledge.includes('inactive') ? 'is-exceptional' : ''} onClick={() => { setSelectedId(beast.id); onNavigate('guardian-spirit-beasts', { entity: beast.id }); }}><div className="succession-gsb-grid__visual"><EntityVisual entity={beast} /><span>{host?.princeOrder ? String(host.princeOrder).padStart(2, '0') : 'K'}</span></div><div><span>{state.knowledge}</span><h2>{host?.name || beast.name}</h2><p>{state.operationalState}</p><dl><div><dt>Known</dt><dd>{state.knownAbilityIds.length}</dd></div><div><dt>Suspected</dt><dd>{state.suspectedAbilityIds.length}</dd></div><div><dt>Unknowns</dt><dd>{state.unresolved.length}</dd></div></dl><footer>Open beast dossier</footer></div></button>)}</section>
    {!visible.length && <ArchiveState kind="empty" title="No matching Guardian Spirit Beasts" description="Change the search or knowledge-state filter while keeping the chapter boundary." />}
    <section className="succession-gsb-boundary"><ShieldAlert size={20} /><div><h3>Host, body, consciousness, and Nen continuation remain separate</h3><p>Kacho’s human-form continuation does not automatically prove her original consciousness survives, while Halkenburg’s original body state does not determine where his consciousness is operating.</p></div></section>
  </div>;
}
