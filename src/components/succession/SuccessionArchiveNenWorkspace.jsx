import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CircleHelp,
  FlaskConical,
  Search,
  ShieldAlert,
  Sparkles,
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

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const idForSystem = (id) => id.replace('nen-system:', '');

function MechanicList({ title, values, empty = 'None documented.' }) {
  return <section className="succession-nen-mechanic-list"><h4>{title}</h4>{values?.length ? <ul>{values.map((value) => <li key={value}>{value}</li>)}</ul> : <p>{empty}</p>}</section>;
}

function AbilityDossier({ dossier, onBack, onNavigate }) {
  if (!dossier?.known) return <ArchiveState kind="empty" title="Ability not yet revealed" description={`This ability has no published knowledge at Chapter ${dossier?.chapter || '?'}.`} action={<button type="button" onClick={onBack}>Back to abilities</button>} />;
  const { ability, mechanics } = dossier;
  return <article className="succession-nen-dossier">
    <button type="button" className="succession-nen-back" onClick={onBack}><ArrowLeft size={15} /> All abilities</button>
    <header className="succession-nen-dossier__hero">
      <div><span>{labelize(ability.category)} · {dossier.knowledgeState}</span><h2>{ability.name}</h2><p>{ability.summary}</p></div>
      <dl><div><dt>Nen type</dt><dd>{(ability.classification?.nenTypes || ['unknown']).map(labelize).join(' · ')}</dd></div><div><dt>Certainty</dt><dd>{labelize(dossier.certainty)}</dd></div><div><dt>First known</dt><dd>{dossier.firstKnownChapter ? `Chapter ${dossier.firstKnownChapter}` : 'Reference record'}</dd></div></dl>
    </header>
    <div className="succession-nen-dossier__mechanics">
      <section><h3>Activation</h3><p>{mechanics.activation}</p><dl><div><dt>Range</dt><dd>{mechanics.range}</dd></div><div><dt>Duration</dt><dd>{mechanics.duration}</dd></div></dl></section>
      <MechanicList title="Conditions" values={mechanics.conditions} />
      <MechanicList title="Limitations" values={mechanics.limitations} />
      <MechanicList title="Costs" values={mechanics.costs} />
      <MechanicList title="Known uses" values={mechanics.knownUses} />
      <MechanicList title="Targets" values={mechanics.targets} />
    </div>
    {!!dossier.owners.length && <section className="succession-nen-linked"><header><BrainCircuit size={18} /><div><span>Ownership</span><h3>Users and autonomous owners</h3></div></header><div>{dossier.owners.map((owner) => <EntityLink key={owner.id} entity={owner} onNavigate={onNavigate} />)}</div></section>}
    {!!dossier.systems.length && <section className="succession-nen-system-links"><header><Sparkles size={18} /><div><span>System membership</span><h3>Mechanic families</h3></div></header><div>{dossier.systems.map((system) => <article key={system.id}><span>{labelize(system.category)}</span><h4>{system.name}</h4><p>{system.summary}</p></article>)}</div></section>}
    {!!dossier.events.length && <section className="succession-nen-linked"><header><Activity size={18} /><div><span>Operational record</span><h3>Linked events</h3></div></header><div>{dossier.events.map((event) => <EntityLink key={event.id} entity={event} onNavigate={onNavigate} />)}</div></section>}
    <section className="succession-nen-sources"><header><BookOpen size={18} /><div><span>Evidence</span><h3>Chapter-bounded sources</h3></div></header><div>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

function SystemDossier({ dossier, onBack, onNavigate }) {
  if (!dossier) return <ArchiveState kind="empty" title="System unavailable" description="This Nen or ritual system is not available at the selected chapter." action={<button type="button" onClick={onBack}>Back to systems</button>} />;
  const { profile } = dossier;
  return <article className="succession-nen-dossier">
    <button type="button" className="succession-nen-back" onClick={onBack}><ArrowLeft size={15} /> All systems</button>
    <header className="succession-nen-dossier__hero is-system"><div><span>{labelize(profile.category)} · From Chapter {profile.chapterRange.start}</span><h2>{profile.name}</h2><p>{profile.summary}</p></div><dl><div><dt>Rules</dt><dd>{profile.rules.length}</dd></div><div><dt>Linked abilities</dt><dd>{dossier.abilities.length}</dd></div><div><dt>Open questions</dt><dd>{profile.openQuestions.length}</dd></div></dl></header>
    <div className="succession-nen-dossier__mechanics">
      <MechanicList title="Known rules" values={profile.rules} />
      <MechanicList title="Costs" values={profile.costs} />
      <MechanicList title="Risks" values={profile.risks} />
      <MechanicList title="Unresolved questions" values={profile.openQuestions} />
    </div>
    {!!dossier.abilities.length && <section className="succession-nen-system-links"><header><FlaskConical size={18} /><div><span>Mechanics</span><h3>Abilities inside this system</h3></div></header><div>{dossier.abilities.map(({ ability, knowledgeState }) => <article key={ability.id}><span>{knowledgeState}</span><h4>{ability.name}</h4><p>{ability.summary}</p><button type="button" onClick={() => onNavigate('nen', { entity: ability.id })}>Open ability</button></article>)}</div></section>}
    {!!dossier.guardianBeasts.length && <section className="succession-nen-linked"><header><Sparkles size={18} /><div><span>Royal parasitic Nen</span><h3>Guardian Spirit Beasts</h3></div></header><div>{dossier.guardianBeasts.map(({ beast }) => <EntityLink key={beast.id} entity={beast} onNavigate={onNavigate} />)}</div></section>}
    {!!dossier.characters.length && <section className="succession-nen-linked"><header><BrainCircuit size={18} /><div><span>Actors</span><h3>Characters connected to the system</h3></div></header><div>{dossier.characters.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div></section>}
    <section className="succession-nen-sources"><header><BookOpen size={18} /><div><span>Evidence</span><h3>Chapter-bounded sources</h3></div></header><div>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</div></section>
  </article>;
}

export default function SuccessionArchiveNenWorkspace({ routeParams = {}, spoilerLimit = 413, onNavigate }) {
  const requestedAbility = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const [mode, setMode] = useState(requestedAbility?.entityType === 'ability' ? 'abilities' : routeParams.view === 'abilities' ? 'abilities' : 'systems');
  const [query, setQuery] = useState(routeParams.search || '');
  const [category, setCategory] = useState('all');
  const [nenType, setNenType] = useState('all');
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

  const abilityRecords = useMemo(() => getAbilitiesKnownAtChapter(spoilerLimit), [spoilerLimit]);
  const systems = useMemo(() => getNenSystemsAtChapter(spoilerLimit), [spoilerLimit]);
  const abilityCategories = useMemo(() => [...new Set(abilityRecords.map(({ ability }) => ability.category).filter(Boolean))].sort(), [abilityRecords]);
  const nenTypes = useMemo(() => [...new Set(abilityRecords.flatMap(({ ability }) => ability.classification?.nenTypes || []).filter(Boolean))].sort(), [abilityRecords]);

  const visibleAbilities = useMemo(() => abilityRecords.filter(({ ability, knowledgeState }) => {
    const text = normalize([ability.name, ability.summary, ability.category, knowledgeState, ability.activation, ...(ability.conditions || []), ...(ability.limitations || []), ...(ability.costs || []), ...(ability.knownUses || [])].join(' '));
    return (category === 'all' || ability.category === category)
      && (nenType === 'all' || ability.classification?.nenTypes?.includes(nenType))
      && (!query.trim() || text.includes(normalize(query)));
  }), [abilityRecords, category, nenType, query]);

  const visibleSystems = useMemo(() => {
    if (!query.trim()) return category === 'all' ? systems : systems.filter((profile) => profile.category === category);
    const matchedIds = new Set(searchNenSystems(query, { limit: 100 }).map(({ profile }) => profile.id));
    return systems.filter((profile) => matchedIds.has(profile.id) && (category === 'all' || profile.category === category));
  }, [category, query, systems]);

  const systemCategories = useMemo(() => [...new Set(systems.map((profile) => profile.category))].sort(), [systems]);
  const selectedAbility = selectedAbilityId ? getAbilityDossier(selectedAbilityId, spoilerLimit) : null;
  const selectedSystem = selectedSystemId ? getNenSystemDossier(selectedSystemId, spoilerLimit) : null;

  if (selectedAbilityId) return <AbilityDossier dossier={selectedAbility} onBack={() => { setSelectedAbilityId(null); onNavigate('nen', { view: 'abilities' }); }} onNavigate={onNavigate} />;
  if (selectedSystemId) return <SystemDossier dossier={selectedSystem} onBack={() => { setSelectedSystemId(null); onNavigate('nen'); }} onNavigate={onNavigate} />;

  const activeCategories = mode === 'systems' ? systemCategories : abilityCategories;
  return <div className="succession-nen-workspace">
    <ArchivePageHeader
      kicker="Batch 3 · Nen and ritual systems"
      title="Abilities, contracts, curses, possession, instruction, and royal ritual"
      description="The Nen archive separates demonstrated mechanics from partial models and unresolved rules, while the chapter boundary controls when each ability or system becomes available."
      meta={[
        { label: `Visible at Ch. ${spoilerLimit}`, value: mode === 'systems' ? systems.length : abilityRecords.length },
        { label: 'Mode', value: labelize(mode) },
        { label: 'Unrevealed mechanics', value: abilityRecords.filter((record) => record.knowledgeState.includes('unrevealed')).length },
      ]}
    />
    <div className="succession-nen-mode" role="tablist" aria-label="Nen archive mode"><button type="button" role="tab" aria-selected={mode === 'systems'} className={mode === 'systems' ? 'is-active' : ''} onClick={() => { setMode('systems'); setCategory('all'); setNenType('all'); onNavigate('nen'); }}><Sparkles size={16} /> Systems</button><button type="button" role="tab" aria-selected={mode === 'abilities'} className={mode === 'abilities' ? 'is-active' : ''} onClick={() => { setMode('abilities'); setCategory('all'); onNavigate('nen', { view: 'abilities' }); }}><FlaskConical size={16} /> Abilities</button><button type="button" onClick={() => onNavigate('guardian-spirit-beasts')}><BrainCircuit size={16} /> Guardian Beasts</button></div>
    <div className="succession-nen-tools"><label><Search size={16} /><span className="sr-only">Search Nen systems</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ability, trigger, vow, cost, curse, possession…" /></label><div>{['all', ...activeCategories].map((value) => <button type="button" className={category === value ? 'is-active' : ''} onClick={() => setCategory(value)} key={value}>{value === 'all' ? 'All categories' : labelize(value)}</button>)}</div>{mode === 'abilities' && <div>{['all', ...nenTypes].map((value) => <button type="button" className={nenType === value ? 'is-active' : ''} onClick={() => setNenType(value)} key={value}>{value === 'all' ? 'All Nen types' : labelize(value)}</button>)}</div>}</div>
    {mode === 'systems' ? <section className="succession-nen-system-grid" aria-label="Nen and ritual systems">{visibleSystems.map((profile) => <button type="button" key={profile.id} onClick={() => { setSelectedSystemId(profile.id); onNavigate('nen', { system: idForSystem(profile.id) }); }}><span>{labelize(profile.category)} · Ch. {profile.chapterRange.start}+</span><h2>{profile.name}</h2><p>{profile.summary}</p><dl><div><dt>Rules</dt><dd>{profile.rules.length}</dd></div><div><dt>Abilities</dt><dd>{profile.abilityIds.length}</dd></div><div><dt>Unknowns</dt><dd>{profile.openQuestions.length}</dd></div></dl><footer>Open system dossier</footer></button>)}</section> : <section className="succession-nen-ability-grid" aria-label="Nen ability records">{visibleAbilities.map(({ ability, knowledgeState, firstKnownChapter }) => <button type="button" key={ability.id} onClick={() => { setSelectedAbilityId(ability.id); onNavigate('nen', { entity: ability.id }); }}><EntityVisual entity={(ability.ownerIds || []).map(getEntityById).find(Boolean)} compact /><div><span>{labelize(ability.category)} · {knowledgeState}</span><h2>{ability.name}</h2><p>{ability.summary}</p><small>{(ability.classification?.nenTypes || ['unknown']).map(labelize).join(' · ')} · {firstKnownChapter ? `Ch. ${firstKnownChapter}` : 'Reference record'}</small></div></button>)}</section>}
    {((mode === 'systems' && !visibleSystems.length) || (mode === 'abilities' && !visibleAbilities.length)) && <ArchiveState kind="empty" title="No matching Nen records" description="Change the search or filter while keeping the selected chapter boundary." />}
    <section className="succession-nen-interpretation"><ShieldAlert size={20} /><div><h3>Interpretive boundary</h3><p>“Probable,” “suspected,” and “unrevealed” are preserved as separate knowledge states. The archive does not convert an observer’s model into a demonstrated rule.</p></div><CircleHelp size={18} /></section>
  </div>;
}
