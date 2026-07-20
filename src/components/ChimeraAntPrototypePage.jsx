import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import { characters } from '../data/characters';
import {
  chimeraAntCharacterGroups,
  chimeraAntConflictGroups,
  chimeraAntPrototype,
  chimeraAntPrototypeStats,
} from '../data/chimeraAntPrototype';
import './ChimeraAntPrototypePage.css';

const characterByName = new Map(characters.map((character) => [character.name, character]));
const wiki = (name) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`;
const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

function portraitRecord(name) {
  return characterByName.get(name) || { id: name, name, source: wiki(name) };
}

function Portrait({ name, eager = false }) {
  const item = portraitRecord(name);
  if (!item.image) {
    return <span className="ca-portrait-token" aria-label={`No stored Hunterpedia portrait available for ${name}`}><b>{initialsFor(name)}</b></span>;
  }
  return <SourcePortrait item={item} eager={eager} alt={`${name} portrait from Hunterpedia`} />;
}

function SectionHeader({ id, eyebrow, title, children }) {
  return <header className="ca-section-header" id={id}>
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </header>;
}

function ChimeraAntHero({ onNavigate }) {
  const arc = chimeraAntPrototype;
  return <section className="ca-hero" aria-labelledby="chimera-ant-prototype-title">
    <div className="ca-hero__copy">
      <span className="ca-eyebrow">{arc.eyebrow}</span>
      <h1 id="chimera-ant-prototype-title">{arc.title}</h1>
      <p>{arc.deck}</p>
      <div className="ca-hero__actions">
        <a href="#ca-palace-clock">Open Palace clock <ArrowRight size={15} /></a>
        <a href="#ca-characters">Open character arcs <ArrowRight size={15} /></a>
        <a href="#ca-nen">Open Nen systems <ArrowRight size={15} /></a>
        <button type="button" onClick={() => onNavigate('series', 'chairman-election')}>Continue to Election <ArrowRight size={15} /></button>
      </div>
    </div>
    <div className="ca-hero__portraits" aria-label="Chimera Ant visual leads">
      {arc.heroPeople.map((name, index) => <figure key={name} className={index === 0 ? 'is-primary' : index === 3 ? 'is-king' : ''}>
        <Portrait name={name} eager={index === 0} />
        <figcaption>{name}</figcaption>
      </figure>)}
    </div>
    <dl className="ca-hero__facts">
      {arc.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  </section>;
}

function LocalNav() {
  return <nav className="ca-local-nav" aria-label="Chimera Ant prototype sections">
    {chimeraAntPrototype.sections.map(([id, label], index) => <a href={`#ca-${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></a>)}
  </nav>;
}

function Overview() {
  return <section className="ca-paper-section" aria-labelledby="ca-overview-title">
    <SectionHeader id="ca-overview" eyebrow="Arc thesis" title="From field investigation to moral catastrophe">
      The page treats Chimera Ant as a war dossier: every phase records the threat model, tactical collapse, character consequence, Nen escalation, and source boundary instead of flattening the arc into a long summary.
    </SectionHeader>
    <div className="ca-overview-grid">
      {chimeraAntPrototype.overview.map(([title, detail], index) => <article key={title}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <h3>{title}</h3>
        <p>{detail}</p>
      </article>)}
    </div>
  </section>;
}

function ThreatModel() {
  return <section className="ca-dark-section" aria-labelledby="ca-threat-title">
    <SectionHeader id="ca-threat" eyebrow="Threat model" title="How a specimen problem becomes a species-level emergency">
      The escalation ladder explains why the arc cannot be handled as ordinary monster hunting: the danger compounds through human prey, hierarchy, Nen, state capture, and the Rose.
    </SectionHeader>
    <ol className="ca-threat-ladder">
      {chimeraAntPrototype.threatModel.map(([title, detail], index) => <li key={title}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <div><h3>{title}</h3><p>{detail}</p></div>
      </li>)}
    </ol>
  </section>;
}

function Chronology() {
  return <section className="ca-paper-section" aria-labelledby="ca-chronology-title">
    <SectionHeader id="ca-chronology" eyebrow="Master chronology" title="Eighteen-phase spine from Accompany to the Election bridge">
      This keeps the arc readable by separating investigation, Queen colony, NGL collapse, training, state capture, Palace Invasion, final deaths, and aftermath.
    </SectionHeader>
    <ol className="ca-chronology">
      {chimeraAntPrototype.chronology.map((event) => <li key={event.code}>
        <i>{event.code}</i>
        <div><span>{event.phase}</span><h3>{event.title}</h3><p>{event.detail}</p></div>
      </li>)}
    </ol>
  </section>;
}

function PalaceClock() {
  return <section className="ca-dark-section" aria-labelledby="ca-palace-clock-title">
    <SectionHeader id="ca-palace-clock" eyebrow="Palace Invasion clock" title="Concurrent lanes, broken plans and hidden knowledge">
      The Palace Invasion is the first Chimera module designed to become a future nested page if it grows too dense. For now it lives inside the main arc route as a clocked operation board.
    </SectionHeader>
    <div className="ca-clock-grid">
      {chimeraAntPrototype.palaceClock.map((event) => <article key={`${event.time}-${event.title}`}>
        <span>{event.time}</span>
        <b>{event.lane}</b>
        <h3>{event.title}</h3>
        <p>{event.detail}</p>
      </article>)}
    </div>
  </section>;
}

function CharacterBoard() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const filteredCharacters = useMemo(() => chimeraAntPrototype.characters.filter((character) => {
    const matchesGroup = activeGroup === 'all' || character.group === activeGroup;
    const searchable = `${character.name} ${character.group} ${character.role} ${character.arc} ${character.consequence}`.toLowerCase();
    return matchesGroup && (!normalized || searchable.includes(normalized));
  }), [activeGroup, normalized]);

  return <section className="ca-paper-section" aria-labelledby="ca-characters-title">
    <SectionHeader id="ca-characters" eyebrow="Character arcs" title="Arc-specific roles, not generic biographies">
      The catalogue tracks what each person does inside this arc: guilt, loyalty, transformation, fear, identity, tactics, and aftermath.
    </SectionHeader>
    <div className="ca-toolbar">
      <div className="ca-tabs" role="tablist" aria-label="Chimera Ant character groups">
        {chimeraAntCharacterGroups.map(([value, label]) => <button key={value} role="tab" aria-selected={activeGroup === value} className={activeGroup === value ? 'is-active' : ''} onClick={() => setActiveGroup(value)} type="button">{label}</button>)}
      </div>
      <label className="ca-search"><Search size={15} /><span className="sr-only">Search Chimera Ant characters</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search role, status, theme…" /></label>
    </div>
    <div className="ca-character-grid" role="list">
      {filteredCharacters.map((character) => <article key={character.name} role="listitem">
        <figure><Portrait name={character.name} /><figcaption>{character.group}</figcaption></figure>
        <div><span>{character.role}</span><h3>{character.name}</h3><p>{character.arc}</p><footer>{character.consequence}</footer></div>
      </article>)}
    </div>
  </section>;
}

function AntHierarchy() {
  return <section className="ca-dark-section" aria-labelledby="ca-ants-title">
    <SectionHeader id="ca-ants" eyebrow="Ant hierarchy" title="Ranks, loyalties, survivor states and story functions" />
    <div className="ca-table-wrap" role="region" aria-label="Chimera Ant hierarchy table" tabIndex={0}>
      <table className="ca-data-table">
        <thead><tr><th>Name</th><th>Rank</th><th>Allegiance</th><th>Status</th><th>Function</th></tr></thead>
        <tbody>{chimeraAntPrototype.antHierarchy.map((ant) => <tr key={ant.name}><th>{ant.name}</th><td>{ant.rank}</td><td>{ant.allegiance}</td><td>{ant.status}</td><td>{ant.function}</td></tr>)}</tbody>
      </table>
    </div>
  </section>;
}

function HumanTeam() {
  return <section className="ca-paper-section" aria-labelledby="ca-humans-title">
    <SectionHeader id="ca-humans" eyebrow="Extermination team" title="Assignments, pressure points and mission failures" />
    <div className="ca-record-grid">
      {chimeraAntPrototype.humanTeam.map((team) => <article key={team.name}><span>{team.role}</span><h3>{team.name}</h3><p>{team.assignment}</p><footer>{team.pressure}</footer></article>)}
    </div>
  </section>;
}

function FactionsAndLocations() {
  return <section className="ca-paper-section ca-two-column" aria-label="Chimera Ant factions and locations">
    <div>
      <SectionHeader id="ca-factions" eyebrow="Factions" title="Institutions and groups under crisis" />
      <div className="ca-state-list">{chimeraAntPrototype.factions.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
    <div>
      <SectionHeader id="ca-locations" eyebrow="Location atlas" title="Where the arc changes shape" />
      <div className="ca-state-list">{chimeraAntPrototype.locations.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
  </section>;
}

function ConflictArchive() {
  const [activeType, setActiveType] = useState('all');
  const filteredConflicts = useMemo(() => chimeraAntPrototype.conflicts.filter((conflict) => activeType === 'all' || conflict.type === activeType), [activeType]);

  return <section className="ca-dark-section" aria-labelledby="ca-conflicts-title">
    <SectionHeader id="ca-conflicts" eyebrow="Conflict archive" title="Fights, games, scouting failures, hostage pressure and ideology clashes" />
    <div className="ca-tabs ca-tabs--dark" role="tablist" aria-label="Chimera Ant conflict types">
      {chimeraAntConflictGroups.map(([value, label]) => <button key={value} role="tab" aria-selected={activeType === value} className={activeType === value ? 'is-active' : ''} onClick={() => setActiveType(value)} type="button">{label}</button>)}
    </div>
    <div className="ca-conflict-ledger">
      {filteredConflicts.map((conflict, index) => <article key={conflict.name}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <div><span>{conflict.type}</span><h3>{conflict.name}</h3><p>{conflict.participants}</p><dl><div><dt>Result</dt><dd>{conflict.result}</dd></div><div><dt>Consequence</dt><dd>{conflict.consequence}</dd></div></dl></div>
      </article>)}
    </div>
  </section>;
}

function NenAndObjects() {
  return <section className="ca-paper-section ca-two-column" aria-label="Chimera Ant Nen systems and objects">
    <div>
      <SectionHeader id="ca-nen" eyebrow="Nen systems" title="Abilities, vows and post-mortem danger" />
      <div className="ca-state-list ca-state-list--numbered">{chimeraAntPrototype.nenSystems.map(([name, detail], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
    <div>
      <SectionHeader id="ca-objects" eyebrow="Objects and evidence" title="Custody trails and story triggers" />
      <div className="ca-state-list ca-state-list--numbered">{chimeraAntPrototype.objects.map(([name, detail], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
  </section>;
}

function ThemeBoard() {
  return <section className="ca-dark-section" aria-labelledby="ca-themes-title">
    <SectionHeader id="ca-themes" eyebrow="Interpretation layer" title="The arc’s recurring arguments and reversals">
      Analysis is kept visibly separate from factual chronology. These are reading lenses, not unsourced canon claims.
    </SectionHeader>
    <div className="ca-theme-grid">
      {chimeraAntPrototype.themes.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}
    </div>
  </section>;
}

function AftermathAndAdaptation() {
  return <section className="ca-paper-section ca-two-column" aria-label="Chimera Ant aftermath and adaptation">
    <div>
      <SectionHeader id="ca-aftermath" eyebrow="Aftermath" title="What the arc leaves behind" />
      <div className="ca-state-list">{chimeraAntPrototype.aftermath.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
    <div>
      <SectionHeader id="ca-adaptation" eyebrow="2011 anime layer" title="Episode range, pacing and narration model" />
      <div className="ca-state-list">{chimeraAntPrototype.adaptation.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
  </section>;
}

function Sources() {
  return <section className="ca-dark-section" aria-labelledby="ca-sources-title">
    <SectionHeader id="ca-sources" eyebrow="Source boundary" title="Hunterpedia-backed Chimera Ant source set">
      The page stores structured names, roles, ranges, and short editorial summaries. Long Hunterpedia descriptions are not copied into the repository.
    </SectionHeader>
    <div className="ca-source-summary">
      <div><b>{chimeraAntPrototypeStats.chronology}</b><span>chronology phases</span></div>
      <div><b>{chimeraAntPrototypeStats.characters}</b><span>character arcs</span></div>
      <div><b>{chimeraAntPrototypeStats.conflicts}</b><span>conflicts</span></div>
      <div><b>{chimeraAntPrototypeStats.sources}</b><span>approved sources</span></div>
    </div>
    <div className="ca-source-grid">{chimeraAntPrototype.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<ExternalLink size={13} /></a>)}</div>
  </section>;
}

export default function ChimeraAntPrototypePage({ onNavigate }) {
  return <article className="chimera-ant-prototype" aria-labelledby="chimera-ant-prototype-title">
    <ChimeraAntHero onNavigate={onNavigate} />
    <LocalNav />
    <Overview />
    <ThreatModel />
    <Chronology />
    <PalaceClock />
    <CharacterBoard />
    <AntHierarchy />
    <HumanTeam />
    <FactionsAndLocations />
    <ConflictArchive />
    <NenAndObjects />
    <ThemeBoard />
    <AftermathAndAdaptation />
    <Sources />
  </article>;
}
