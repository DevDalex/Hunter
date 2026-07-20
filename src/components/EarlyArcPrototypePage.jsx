import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import { characters } from '../data/characters';
import { earlyArcPrototypeById } from '../data/earlyArcPrototypes';
import './EarlyArcPrototypePage.css';

const characterByName = new Map(characters.map((character) => [character.name, character]));
const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const wiki = (name) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`;

function portraitRecord(name) {
  return characterByName.get(name) || { id: name, name, source: wiki(name) };
}

function Portrait({ name, eager = false }) {
  const item = portraitRecord(name);
  if (!item.image) {
    return <span className="ea-portrait-token" aria-label={`No stored Hunterpedia portrait available for ${name}`}><b>{initialsFor(name)}</b></span>;
  }
  return <SourcePortrait item={item} eager={eager} alt={`${name} portrait from Hunterpedia`} />;
}

function SectionHeader({ id, eyebrow, title, children }) {
  return <header className="ea-section-header" id={id}>
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </header>;
}

function EarlyArcHero({ arc, onNavigate }) {
  const nextTarget = arc.id === 'hunter-exam' ? 'zoldyck-family' : arc.id === 'zoldyck-family' ? 'heavens-arena' : 'yorknew-city';
  const nextLabel = arc.id === 'hunter-exam' ? 'Zoldyck Family' : arc.id === 'zoldyck-family' ? 'Heaven’s Arena' : 'Yorknew City';
  return <section className="ea-hero" aria-labelledby={`${arc.id}-prototype-title`} style={{ '--ea-primary': arc.palette.primary, '--ea-accent': arc.palette.accent, '--ea-secondary': arc.palette.secondary }}>
    <div className="ea-hero__copy">
      <span className="ea-eyebrow">{arc.eyebrow}</span>
      <h1 id={`${arc.id}-prototype-title`}>{arc.title}</h1>
      <p>{arc.deck}</p>
      <div className="ea-hero__actions">
        <a href="#ea-chronology">Open route ledger <ArrowRight size={15} /></a>
        <a href="#ea-mechanics">Inspect systems <ArrowRight size={15} /></a>
        <button type="button" onClick={() => onNavigate('series', nextTarget)}>Continue to {nextLabel} <ArrowRight size={15} /></button>
      </div>
    </div>
    <div className="ea-hero__portraits" aria-label={`${arc.title} visual leads`}>
      {arc.heroPeople.map((name, index) => <figure key={name} className={index === 0 ? 'is-primary' : ''}>
        <Portrait name={name} eager={index === 0} />
        <figcaption>{name}</figcaption>
      </figure>)}
    </div>
    <dl className="ea-hero__facts">
      {arc.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  </section>;
}

function LocalNav({ arc }) {
  return <nav className="ea-local-nav" aria-label={`${arc.title} page sections`}>
    {arc.sections.map(([id, label], index) => <a href={`#ea-${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></a>)}
  </nav>;
}

function Overview({ arc }) {
  return <section className="ea-paper-section" aria-labelledby="ea-overview-title">
    <SectionHeader id="ea-overview" eyebrow="Page overview" title={`${arc.title} as an independent Story page`}>
      {arc.tone}
    </SectionHeader>
    <div className="ea-overview-grid">
      {arc.overview.map(([title, detail], index) => <article key={title}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <h3>{title}</h3>
        <p>{detail}</p>
      </article>)}
    </div>
  </section>;
}

function Chronology({ arc }) {
  return <section className="ea-dark-section" aria-labelledby="ea-chronology-title">
    <SectionHeader id="ea-chronology" eyebrow="Chronology ledger" title={`${arc.title} as a controlled route`}>
      The early arc pages use the Yorknew prototype’s event-ledger idea, but adapt it to exams, estate access, and tower progression.
    </SectionHeader>
    <ol className="ea-chronology">
      {arc.chronology.map((event) => <li key={event.code}>
        <i>{event.code}</i>
        <div><span>{event.phase}</span><h3>{event.title}</h3><p>{event.detail}</p></div>
      </li>)}
    </ol>
  </section>;
}

function Systems({ arc }) {
  return <section className="ea-paper-section" aria-labelledby="ea-systems-title">
    <SectionHeader id="ea-systems" eyebrow="System board" title="Rules, institutions, and route logic">
      This section explains the environment that controls the arc before individual character choices are layered on top.
    </SectionHeader>
    <div className="ea-system-grid">
      {arc.systems.map(([name, detail]) => <article key={name}><span>System</span><h3>{name}</h3><p>{detail}</p></article>)}
    </div>
  </section>;
}

function CharacterBoard({ arc }) {
  return <section className="ea-paper-section" aria-labelledby="ea-characters-title">
    <SectionHeader id="ea-characters" eyebrow="Character roles" title="People by function, not just appearance">
      Character cards explain why each person matters to this specific page rather than repeating a full profile.
    </SectionHeader>
    <div className="ea-character-board">
      {arc.characters.map((character) => <article key={character.name}>
        <Portrait name={character.name} />
        <div><span>{character.role}</span><h3>{character.name}</h3><p>{character.detail}</p></div>
      </article>)}
    </div>
  </section>;
}

function ConflictLedger({ arc }) {
  return <section className="ea-dark-section" aria-labelledby="ea-conflicts-title">
    <SectionHeader id="ea-conflicts" eyebrow="Conflict ledger" title="Tests, fights, trials, and negotiations">
      The early arcs prove that a conflict record can cover routes, gates, psychological pressure, and training matches—not only battles.
    </SectionHeader>
    <div className="ea-conflict-ledger">
      {arc.conflicts.map((conflict, index) => <article key={conflict.name}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <div><span>{conflict.type}</span><h3>{conflict.name}</h3><p>{conflict.participants}</p><dl><div><dt>Result</dt><dd>{conflict.result}</dd></div><div><dt>Consequence</dt><dd>{conflict.consequence}</dd></div></dl></div>
      </article>)}
    </div>
  </section>;
}

function Mechanics({ arc }) {
  const [selectedName, setSelectedName] = useState(arc.mechanics[0]?.[0] || '');
  const selected = useMemo(() => arc.mechanics.find(([name]) => name === selectedName) || arc.mechanics[0], [arc, selectedName]);
  return <section className="ea-paper-section ea-mechanics-section" aria-labelledby="ea-mechanics-title">
    <SectionHeader id="ea-mechanics" eyebrow="Mechanics inspector" title="Objects, rules, and power-system lessons">
      This interactive pattern turns early-story concepts into reusable explanatory modules for later arc pages.
    </SectionHeader>
    <div className="ea-mechanics-inspector">
      <div className="ea-mechanics-inspector__menu" aria-label={`Choose ${arc.title} mechanic`}>
        {arc.mechanics.map(([name], index) => <button key={name} className={name === selected[0] ? 'is-active' : ''} aria-pressed={name === selected[0]} onClick={() => setSelectedName(name)}>
          <i>{String(index + 1).padStart(2, '0')}</i><span>{name}</span>
        </button>)}
      </div>
      <article className="ea-mechanics-inspector__detail">
        <span>{arc.title} mechanic</span>
        <h3>{selected[0]}</h3>
        <p>{selected[1]}</p>
      </article>
    </div>
  </section>;
}

function AftermathAndAdaptation({ arc }) {
  return <section className="ea-paper-section ea-two-column" aria-label={`${arc.title} aftermath and adaptation`}>
    <div>
      <SectionHeader id="ea-aftermath" eyebrow="Aftermath" title="What changes after this page" />
      <div className="ea-state-list">{arc.aftermath.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
    <div>
      <SectionHeader id="ea-adaptation" eyebrow="2011 anime layer" title="Adaptation notes inside the manga spine" />
      <div className="ea-state-list">{arc.adaptation.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
  </section>;
}

function Sources({ arc }) {
  return <section className="ea-dark-section" aria-labelledby="ea-sources-title">
    <SectionHeader id="ea-sources" eyebrow="Source boundary" title="Hunterpedia-backed early arc sources">
      These links define the factual source perimeter for the early arc prototype batch. Page structure and interpretation remain editorial layers.
    </SectionHeader>
    <div className="ea-source-grid">
      {arc.sources.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>{item.label}<ExternalLink size={13} /></a>)}
    </div>
  </section>;
}

export default function EarlyArcPrototypePage({ arcId, onNavigate }) {
  const arc = earlyArcPrototypeById.get(arcId);
  if (!arc) return null;
  return <article className="early-arc-prototype" aria-labelledby={`${arc.id}-prototype-title`}>
    <EarlyArcHero arc={arc} onNavigate={onNavigate} />
    <LocalNav arc={arc} />
    <Overview arc={arc} />
    <Chronology arc={arc} />
    <Systems arc={arc} />
    <CharacterBoard arc={arc} />
    <ConflictLedger arc={arc} />
    <Mechanics arc={arc} />
    <AftermathAndAdaptation arc={arc} />
    <Sources arc={arc} />
  </article>;
}
