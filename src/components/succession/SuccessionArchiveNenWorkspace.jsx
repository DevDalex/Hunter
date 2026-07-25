import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CircleHelp,
  Eye,
  FlaskConical,
  Gauge,
  KeyRound,
  Network,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import {
  getAbilitiesKnownAtChapter,
  getAbilityDossier,
  getEntityById,
  getNenSystemDossier,
  getNenSystemsAtChapter,
  searchNenSystems,
} from '../../data/succession/successionData';
import {
  ArchivePageHeader,
  ArchiveState,
  EntityLink,
  EntityVisual,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveNenWorkspace.css';
import './SuccessionArchiveNenCommand.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const idForSystem = (id) => id.replace('nen-system:', '');
const unique = (values) => [...new Set(values.filter(Boolean))];
const knowledgeClass = (value) => {
  const normalized = normalize(value);
  if (/unrevealed|unknown|not revealed/.test(normalized)) return 'unrevealed';
  if (/probable|suspected|partial|inferred/.test(normalized)) return 'partial';
  if (/demonstrated|confirmed|known|revealed/.test(normalized)) return 'demonstrated';
  return 'recorded';
};

function MechanicList({ title, values, icon: Icon = CircleHelp, empty = 'None documented.' }) {
  return <section className="succession-nen-mechanic-list succession-nen-command-mechanic-list">
    <header><Icon size={17} aria-hidden="true" /><h4>{title}</h4><span>{values?.length || 0}</span></header>
    {values?.length ? <ul>{values.map((value) => <li key={value}>{value}</li>)}</ul> : <p>{empty}</p>}
  </section>;
}

function AbilityMechanicPipeline({ mechanics }) {
  const steps = [
    { id: 'trigger', label: 'Trigger', icon: KeyRound, value: mechanics.activation || 'Activation remains undocumented.' },
    { id: 'range', label: 'Range', icon: Gauge, value: mechanics.range || 'Range remains undocumented.' },
    { id: 'targets', label: 'Targets', icon: Target, value: mechanics.targets?.length ? mechanics.targets.join(' · ') : 'No target model is documented.' },
    { id: 'duration', label: 'Duration', icon: Timer, value: mechanics.duration || 'Duration remains undocumented.' },
    { id: 'cost', label: 'Cost', icon: Zap, value: mechanics.costs?.length ? mechanics.costs.join(' · ') : 'No explicit cost is documented.' },
    { id: 'limit', label: 'Limit', icon: ShieldAlert, value: mechanics.limitations?.length ? mechanics.limitations.join(' · ') : 'No explicit limitation is documented.' },
  ];
  return <section className="succession-nen-command-pipeline" aria-labelledby="succession-nen-pipeline-title">
    <header><Network size={18} aria-hidden="true" /><div><span>Mechanic model</span><h3 id="succession-nen-pipeline-title">Trigger → range → target → duration → cost → limitation</h3></div></header>
    <ol>{steps.map(({ id, label, icon: Icon, value }, index) => <li key={id}><span>{String(index + 1).padStart(2, '0')}</span><Icon size={18} aria-hidden="true" /><div><b>{label}</b><p>{value}</p></div>{index < steps.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</li>)}</ol>
  </section>;
}

function AbilityDossier({ dossier, onBack, onNavigate }) {
  if (!dossier?.known) return <ArchiveState kind="empty" title="Ability not yet revealed" description={`This ability has no published knowledge at Chapter ${dossier?.chapter || '?'}.`} action={<button type="button" onClick={onBack}>Back to abilities</button>} />;
  const { ability, mechanics } = dossier;
  const owner = dossier.owners[0] || null;
  const state = knowledgeClass(dossier.knowledgeState);
  return <article className="succession-nen-dossier succession-nen-command-dossier is-ability">
    <button type="button" className="succession-nen-back" onClick={onBack}><ArrowLeft size={15} aria-hidden="true" /> All abilities</button>

    <header className="succession-nen-command-dossier__hero">
      <div className="succession-nen-command-dossier__visual"><EntityVisual entity={owner || ability} eager /><span>{(ability.classification?.nenTypes || ['?']).map((value) => value.charAt(0).toUpperCase()).join('')}</span></div>
      <div><span>{labelize(ability.category)} · {dossier.knowledgeState}</span><h2>{ability.name}</h2><p>{ability.summary}</p><div>{dossier.owners.map((record) => <EntityLink key={record.id} entity={record} onNavigate={onNavigate} />)}</div></div>
      <dl>
        <div><dt>Knowledge</dt><dd>{labelize(state)}</dd></div>
        <div><dt>Nen type</dt><dd>{(ability.classification?.nenTypes || ['unknown']).map(labelize).join(' · ')}</dd></div>
        <div><dt>Certainty</dt><dd>{labelize(dossier.certainty)}</dd></div>
        <div><dt>First known</dt><dd>{dossier.firstKnownChapter ? `Chapter ${dossier.firstKnownChapter}` : 'Reference record'}</dd></div>
      </dl>
    </header>

    <section className={`succession-nen-command-boundary is-${state}`}><Eye size={19} aria-hidden="true" /><div><span>Knowledge boundary · Chapter {dossier.chapter}</span><h3>{state === 'demonstrated' ? 'Demonstrated mechanics are separated from unresolved details' : state === 'partial' ? 'This model includes probable or suspected mechanics' : 'The mechanic remains unrevealed at this boundary'}</h3><p>The archive preserves observed effects, reported explanations, and unresolved rules as different evidence states.</p></div></section>

    <AbilityMechanicPipeline mechanics={mechanics} />

    <div className="succession-nen-command-mechanic-grid">
      <MechanicList title="Conditions" values={mechanics.conditions} icon={KeyRound} />
      <MechanicList title="Limitations" values={mechanics.limitations} icon={ShieldAlert} />
      <MechanicList title="Costs" values={mechanics.costs} icon={Zap} />
      <MechanicList title="Known uses" values={mechanics.knownUses} icon={Activity} />
      <MechanicList title="Targets" values={mechanics.targets} icon={Target} />
    </div>

    {!!dossier.systems.length && <section className="succession-nen-system-links succession-nen-command-section"><header><Sparkles size={18} aria-hidden="true" /><div><span>System membership</span><h3>Mechanic families</h3></div></header><div>{dossier.systems.map((system) => <button type="button" key={system.id} onClick={() => onNavigate('nen', { system: idForSystem(system.id) })}><span>{labelize(system.category)}</span><h4>{system.name}</h4><p>{system.summary}</p><footer>Open system dossier <ArrowRight size={13} aria-hidden="true" /></footer></button>)}</div></section>}

    {!!dossier.events.length && <section className="succession-nen-linked succession-nen-command-section"><header><Activity size={18} aria-hidden="true" /><div><span>Operational record</span><h3>Linked events</h3></div></header><div>{dossier.events.map((event) => <EntityLink key={event.id} entity={event} onNavigate={onNavigate} />)}</div></section>}

    <section className="succession-nen-sources succession-nen-command-section"><header><BookOpen size={18} aria-hidden="true" /><div><span>Evidence</span><h3>Chapter-bounded sources</h3></div></header><div>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

function SystemDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="System unavailable" description="This Nen or ritual system is not available at the selected chapter." action={<button type="button" onClick={onBack}>Back to systems</button>} />;
  const { profile } = dossier;
  return <article className="succession-nen-dossier succession-nen-command-dossier is-system">
    <button type="button" className="succession-nen-back" onClick={onBack}><ArrowLeft size={15} aria-hidden="true" /> All systems</button>

    <header className="succession-nen-command-dossier__hero">
      <div className="succession-nen-command-dossier__system-sigil" aria-hidden="true"><Sparkles size={46} /><span>{profile.rules.length}</span><small>known rules</small></div>
      <div><span>{labelize(profile.category)} · From Chapter {profile.chapterRange.start}</span><h2>{profile.name}</h2><p>{profile.summary}</p></div>
      <dl>
        <div><dt>Rules</dt><dd>{profile.rules.length}</dd></div>
        <div><dt>Linked abilities</dt><dd>{dossier.abilities.length}</dd></div>
        <div><dt>Actors</dt><dd>{dossier.characters.length}</dd></div>
        <div><dt>Open questions</dt><dd>{profile.openQuestions.length}</dd></div>
      </dl>
    </header>

    <section className="succession-nen-command-system-architecture"><header><Network size={18} aria-hidden="true" /><div><span>System architecture</span><h3>Rules, costs, risks, and unresolved limits</h3></div></header><div>
      <MechanicList title="Known rules" values={profile.rules} icon={KeyRound} />
      <MechanicList title="Costs" values={profile.costs} icon={Zap} />
      <MechanicList title="Risks" values={profile.risks} icon={ShieldAlert} />
      <MechanicList title="Unresolved questions" values={profile.openQuestions} icon={CircleHelp} />
    </div></section>

    {!!dossier.abilities.length && <section className="succession-nen-system-links succession-nen-command-section"><header><FlaskConical size={18} aria-hidden="true" /><div><span>Mechanics</span><h3>Abilities inside this system</h3></div></header><div>{dossier.abilities.map(({ ability, knowledgeState }) => <button type="button" key={ability.id} className={`is-${knowledgeClass(knowledgeState)}`} onClick={() => onNavigate('nen', { entity: ability.id })}><span>{knowledgeState}</span><h4>{ability.name}</h4><p>{ability.summary}</p><footer>Open ability model <ArrowRight size={13} aria-hidden="true" /></footer></button>)}</div></section>}

    {!!dossier.guardianBeasts.length && <section className="succession-nen-linked succession-nen-command-section"><header><Sparkles size={18} aria-hidden="true" /><div><span>Royal parasitic Nen</span><h3>Guardian Spirit Beasts</h3></div></header><div>{dossier.guardianBeasts.map(({ beast }) => <EntityLink key={beast.id} entity={beast} onNavigate={onNavigate} />)}</div></section>}

    {!!dossier.characters.length && <section className="succession-nen-linked succession-nen-command-section"><header><BrainCircuit size={18} aria-hidden="true" /><div><span>Actors</span><h3>Characters connected to the system</h3></div></header><div>{dossier.characters.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}

    <section className="succession-nen-sources succession-nen-command-section"><header><BookOpen size={18} aria-hidden="true" /><div><span>Evidence</span><h3>Chapter-bounded sources</h3></div></header><div>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

function AbilityCard({ record, onOpen }) {
  const { ability, knowledgeState, firstKnownChapter, dossier } = record;
  const owner = dossier?.owners?.[0] || (ability.ownerIds || []).map(getEntityById).find(Boolean);
  const state = knowledgeClass(knowledgeState);
  const mechanicCount = (ability.conditions?.length || 0) + (ability.limitations?.length || 0) + (ability.costs?.length || 0);
  return <button type="button" className={`succession-nen-command-ability is-${state}`} onClick={() => onOpen(ability.id)}>
    <div className="succession-nen-command-ability__visual"><EntityVisual entity={owner || ability} /><span>{(ability.classification?.nenTypes || ['?']).map((value) => value.charAt(0).toUpperCase()).join('')}</span></div>
    <div><span>{labelize(ability.category)} · {knowledgeState}</span><h3>{ability.name}</h3><p>{ability.summary}</p><small>{owner?.name || 'Autonomous or unresolved owner'} · {firstKnownChapter ? `Ch. ${firstKnownChapter}` : 'Reference record'}</small></div>
    <dl><div><dt>Types</dt><dd>{ability.classification?.nenTypes?.length || 0}</dd></div><div><dt>Mechanics</dt><dd>{mechanicCount}</dd></div><div><dt>Events</dt><dd>{dossier?.events?.length || 0}</dd></div><div><dt>Sources</dt><dd>{dossier?.sources?.length || 0}</dd></div></dl>
    <footer><span>{labelize(state)}</span><b>Open mechanic model <ArrowRight size={13} aria-hidden="true" /></b></footer>
  </button>;
}

function SystemCard({ profile, dossier, onOpen }) {
  return <button type="button" className="succession-nen-command-system" onClick={() => onOpen(profile.id)}>
    <span>{labelize(profile.category)} · Ch. {profile.chapterRange.start}+</span>
    <h3>{profile.name}</h3>
    <p>{profile.summary}</p>
    <dl><div><dt>Rules</dt><dd>{profile.rules.length}</dd></div><div><dt>Abilities</dt><dd>{profile.abilityIds.length}</dd></div><div><dt>Risks</dt><dd>{profile.risks.length}</dd></div><div><dt>Unknowns</dt><dd>{profile.openQuestions.length}</dd></div></dl>
    <div className="succession-nen-command-system__nodes" aria-hidden="true">{Array.from({ length: Math.min(6, Math.max(2, dossier?.abilities?.length || 2)) }, (_, index) => <i key={index} />)}</div>
    <footer>Open system architecture <ArrowRight size={13} aria-hidden="true" /></footer>
  </button>;
}

export default function SuccessionArchiveNenWorkspace({ routeParams = {}, spoilerLimit = 413, onNavigate }) {
  const requestedAbility = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const [mode, setMode] = useState(requestedAbility?.entityType === 'ability' ? 'abilities' : routeParams.view === 'abilities' ? 'abilities' : 'systems');
  const [query, setQuery] = useState(routeParams.search || '');
  const [category, setCategory] = useState('all');
  const [nenType, setNenType] = useState('all');
  const [knowledge, setKnowledge] = useState('all');
  const [owner, setOwner] = useState('all');
  const [system, setSystem] = useState('all');
  const [selectedAbilityId, setSelectedAbilityId] = useState(requestedAbility?.entityType === 'ability' ? requestedAbility.id : null);
  const [selectedSystemId, setSelectedSystemId] = useState(routeParams.system ? `nen-system:${routeParams.system}` : null);

  useEffect(() => {
    const entity = routeParams.entity ? getEntityById(routeParams.entity) : null;
    if (entity?.entityType === 'ability') {
      setMode('abilities');
      setSelectedAbilityId(entity.id);
      setSelectedSystemId(null);
    }
  }, [routeParams.entity]);

  const abilityRecords = useMemo(() => getAbilitiesKnownAtChapter(spoilerLimit).map((record) => ({ ...record, dossier: getAbilityDossier(record.ability.id, spoilerLimit) })), [spoilerLimit]);
  const systems = useMemo(() => getNenSystemsAtChapter(spoilerLimit), [spoilerLimit]);
  const systemRecords = useMemo(() => systems.map((profile) => ({ profile, dossier: getNenSystemDossier(profile.id, spoilerLimit) })), [spoilerLimit, systems]);
  const abilityCategories = useMemo(() => unique(abilityRecords.map(({ ability }) => ability.category)).sort(), [abilityRecords]);
  const nenTypes = useMemo(() => unique(abilityRecords.flatMap(({ ability }) => ability.classification?.nenTypes || [])).sort(), [abilityRecords]);
  const knowledgeStates = useMemo(() => unique(abilityRecords.map(({ knowledgeState }) => knowledgeClass(knowledgeState))).sort(), [abilityRecords]);
  const ownerOptions = useMemo(() => unique(abilityRecords.flatMap(({ dossier, ability }) => (dossier?.owners || (ability.ownerIds || []).map(getEntityById).filter(Boolean)).map((entity) => entity.id))).map(getEntityById).filter(Boolean).sort((left, right) => left.name.localeCompare(right.name)), [abilityRecords]);

  const visibleAbilities = useMemo(() => abilityRecords.filter(({ ability, knowledgeState, dossier }) => {
    const ownerIds = (dossier?.owners || []).map((entity) => entity.id);
    const systemIds = (dossier?.systems || []).map((record) => record.id);
    const text = normalize([ability.name, ability.summary, ability.category, knowledgeState, ability.activation, ...(ability.conditions || []), ...(ability.limitations || []), ...(ability.costs || []), ...(ability.knownUses || []), ...(dossier?.owners || []).map((entity) => entity.name), ...(dossier?.systems || []).map((record) => record.name)].join(' '));
    return (category === 'all' || ability.category === category)
      && (nenType === 'all' || ability.classification?.nenTypes?.includes(nenType))
      && (knowledge === 'all' || knowledgeClass(knowledgeState) === knowledge)
      && (owner === 'all' || ownerIds.includes(owner))
      && (system === 'all' || systemIds.includes(system))
      && (!query.trim() || text.includes(normalize(query)));
  }), [abilityRecords, category, knowledge, nenType, owner, query, system]);

  const visibleSystems = useMemo(() => {
    if (!query.trim()) return category === 'all' ? systemRecords : systemRecords.filter(({ profile }) => profile.category === category);
    const matchedIds = new Set(searchNenSystems(query, { limit: 100 }).map(({ profile }) => profile.id));
    return systemRecords.filter(({ profile }) => matchedIds.has(profile.id) && (category === 'all' || profile.category === category));
  }, [category, query, systemRecords]);

  const systemCategories = useMemo(() => unique(systems.map((profile) => profile.category)).sort(), [systems]);
  const selectedAbility = selectedAbilityId ? getAbilityDossier(selectedAbilityId, spoilerLimit) : null;
  const selectedSystem = selectedSystemId ? getNenSystemDossier(selectedSystemId, spoilerLimit) : null;

  if (selectedAbilityId) return <AbilityDossier dossier={selectedAbility} onBack={() => { setSelectedAbilityId(null); onNavigate('nen', { view: 'abilities' }); }} onNavigate={onNavigate} />;
  if (selectedSystemId) return <SystemDossier dossier={selectedSystem} onBack={() => { setSelectedSystemId(null); onNavigate('nen'); }} onNavigate={onNavigate} />;

  const activeCategories = mode === 'systems' ? systemCategories : abilityCategories;
  const demonstratedCount = abilityRecords.filter((record) => knowledgeClass(record.knowledgeState) === 'demonstrated').length;
  const partialCount = abilityRecords.filter((record) => knowledgeClass(record.knowledgeState) === 'partial').length;
  const unrevealedCount = abilityRecords.filter((record) => knowledgeClass(record.knowledgeState) === 'unrevealed').length;
  const activeFilters = [
    query && { id: 'query', label: `Search: ${query}`, clear: () => setQuery('') },
    category !== 'all' && { id: 'category', label: `Category: ${labelize(category)}`, clear: () => setCategory('all') },
    nenType !== 'all' && { id: 'type', label: `Nen type: ${labelize(nenType)}`, clear: () => setNenType('all') },
    knowledge !== 'all' && { id: 'knowledge', label: `Knowledge: ${labelize(knowledge)}`, clear: () => setKnowledge('all') },
    owner !== 'all' && { id: 'owner', label: `Owner: ${getEntityById(owner)?.name || owner}`, clear: () => setOwner('all') },
    system !== 'all' && { id: 'system', label: `System: ${systems.find((record) => record.id === system)?.name || system}`, clear: () => setSystem('all') },
  ].filter(Boolean);
  const resetFilters = () => { setQuery(''); setCategory('all'); setNenType('all'); setKnowledge('all'); setOwner('all'); setSystem('all'); };

  return <div className="succession-nen-workspace succession-nen-command">
    <ArchivePageHeader
      kicker="Batch 4 · Nen and ritual systems"
      title="Abilities, contracts, curses, possession, instruction, and royal ritual"
      description="The Nen archive separates demonstrated mechanics from partial models and unresolved rules, while the chapter boundary controls when each ability or system becomes available."
      meta={[
        { label: `Visible at Ch. ${spoilerLimit}`, value: mode === 'systems' ? systems.length : abilityRecords.length },
        { label: 'Mode', value: labelize(mode) },
        { label: 'Unrevealed mechanics', value: unrevealedCount },
      ]}
    />

    <section className="succession-nen-command__hero">
      <div><span><FlaskConical size={16} aria-hidden="true" /> Nen mechanics laboratory</span><h2>Model every ability as evidence, trigger, effect, cost, and unresolved rule</h2><p>Systems and abilities remain chapter-bounded. Demonstrated mechanics, probable explanations, suspected behavior, and unrevealed details are never flattened into one certainty level.</p></div>
      <div className="succession-nen-command__core" aria-hidden="true"><Sparkles size={42} /><strong>{abilityRecords.length}</strong><span>ability records</span><i /><i /><i /><i /><i /><i /></div>
    </section>

    <dl className="succession-nen-command__metrics"><div><dt>Systems</dt><dd>{systems.length}</dd></div><div><dt>Abilities</dt><dd>{abilityRecords.length}</dd></div><div><dt>Demonstrated</dt><dd>{demonstratedCount}</dd></div><div><dt>Partial models</dt><dd>{partialCount}</dd></div><div><dt>Unrevealed</dt><dd>{unrevealedCount}</dd></div></dl>

    <section className="succession-nen-command__control-deck" aria-label="Nen mechanics controls">
      <header><div role="tablist" aria-label="Nen archive mode"><button type="button" role="tab" aria-selected={mode === 'systems'} className={mode === 'systems' ? 'is-active' : ''} onClick={() => { setMode('systems'); resetFilters(); onNavigate('nen'); }}><Sparkles size={16} aria-hidden="true" /> Systems</button><button type="button" role="tab" aria-selected={mode === 'abilities'} className={mode === 'abilities' ? 'is-active' : ''} onClick={() => { setMode('abilities'); resetFilters(); onNavigate('nen', { view: 'abilities' }); }}><FlaskConical size={16} aria-hidden="true" /> Abilities</button><button type="button" onClick={() => onNavigate('guardian-spirit-beasts')}><BrainCircuit size={16} aria-hidden="true" /> Guardian Beasts</button></div><strong>{mode === 'systems' ? visibleSystems.length : visibleAbilities.length} visible records</strong></header>
      <div className="succession-nen-command__filters">
        <label className="is-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search Nen systems and abilities</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ability, trigger, vow, cost, curse, possession…" /></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{activeCategories.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label>
        {mode === 'abilities' && <><label><span>Nen type</span><select value={nenType} onChange={(event) => setNenType(event.target.value)}><option value="all">All Nen types</option>{nenTypes.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label><label><span>Knowledge</span><select value={knowledge} onChange={(event) => setKnowledge(event.target.value)}><option value="all">All knowledge states</option>{knowledgeStates.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label><label><span>Owner</span><select value={owner} onChange={(event) => setOwner(event.target.value)}><option value="all">All owners</option>{ownerOptions.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label><label><span>System</span><select value={system} onChange={(event) => setSystem(event.target.value)}><option value="all">All systems</option>{systems.map((profile) => <option value={profile.id} key={profile.id}>{profile.name}</option>)}</select></label></>}
      </div>
      <div className="succession-nen-command__active-filters">{!activeFilters.length && <span>No filters applied. Showing every {mode === 'systems' ? 'system' : 'ability'} available through Chapter {spoilerLimit}.</span>}{activeFilters.map((item) => <button type="button" onClick={item.clear} key={item.id}>{item.label} <X size={12} aria-hidden="true" /></button>)}{!!activeFilters.length && <button type="button" className="is-reset" onClick={resetFilters}>Reset all</button>}</div>
    </section>

    {mode === 'systems' ? <section className="succession-nen-system-grid succession-nen-command__system-grid" aria-label="Nen and ritual systems">{visibleSystems.map(({ profile, dossier }) => <SystemCard profile={profile} dossier={dossier} onOpen={(id) => { setSelectedSystemId(id); onNavigate('nen', { system: idForSystem(id) }); }} key={profile.id} />)}</section> : <section className="succession-nen-ability-grid succession-nen-command__ability-grid" aria-label="Nen ability records">{visibleAbilities.map((record) => <AbilityCard record={record} onOpen={(id) => { setSelectedAbilityId(id); onNavigate('nen', { entity: id }); }} key={record.ability.id} />)}</section>}

    {((mode === 'systems' && !visibleSystems.length) || (mode === 'abilities' && !visibleAbilities.length)) && <ArchiveState kind="empty" title="No matching Nen records" description="Change the search or filters while keeping the selected chapter boundary." action={<button type="button" onClick={resetFilters}>Reset Nen filters</button>} />}

    <section className="succession-nen-interpretation succession-nen-command__interpretation"><ShieldAlert size={20} aria-hidden="true" /><div><h3>Interpretive boundary</h3><p>“Probable,” “suspected,” and “unrevealed” are preserved as separate knowledge states. The archive does not convert an observer’s model into a demonstrated rule.</p></div><CircleHelp size={18} aria-hidden="true" /></section>
  </div>;
}
