import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import { characters } from '../data/characters';
import { yorknewPrototype } from '../data/yorknewPrototype';
import './YorknewPrototypePage.css';
import './YorknewPrototypeMedia.css';

const wiki = (name) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`;
const characterByName = new Map(characters.map((character) => [character.name, character]));
const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

function portraitRecord(name) {
  return characterByName.get(name) || { id: name, name, source: wiki(name) };
}

function Portrait({ name, eager = false }) {
  const item = portraitRecord(name);
  if (!item.image) {
    return <span className="yn-portrait-token" aria-label={`No stored Hunterpedia portrait available for ${name}`}><b>{initialsFor(name)}</b></span>;
  }
  return <SourcePortrait item={item} eager={eager} alt={`${name} portrait from Hunterpedia`} />;
}

function SectionHeader({ id, eyebrow, title, children }) {
  return <header className="yn-section-header" id={id}>
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </header>;
}

function YorknewHero({ onNavigate }) {
  return <section className="yn-hero" aria-labelledby="yorknew-prototype-title">
    <div className="yn-hero__copy">
      <span className="yn-eyebrow">{yorknewPrototype.eyebrow}</span>
      <h1 id="yorknew-prototype-title">{yorknewPrototype.title}</h1>
      <p>{yorknewPrototype.deck}</p>
      <div className="yn-hero__actions">
        <a href="#yn-chronology">Open chronology <ArrowRight size={15} /></a>
        <a href="#yn-chains">Inspect Kurapika’s chains <ArrowRight size={15} /></a>
        <button type="button" onClick={() => onNavigate('series', 'greed-island')}>Continue to Greed Island <ArrowRight size={15} /></button>
      </div>
    </div>
    <div className="yn-hero__portraits" aria-label="Yorknew visual leads">
      {yorknewPrototype.heroPeople.map((name, index) => <figure key={name} className={index === 0 ? 'is-primary' : ''}>
        <Portrait name={name} eager={index === 0} />
        <figcaption>{name}</figcaption>
      </figure>)}
    </div>
    <dl className="yn-hero__facts">
      {yorknewPrototype.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  </section>;
}

function LocalNav() {
  return <nav className="yn-local-nav" aria-label="Yorknew prototype sections">
    {yorknewPrototype.sections.map(([id, label], index) => <a href={`#yn-${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></a>)}
  </nav>;
}

function Overview() {
  return <section className="yn-paper-section" aria-labelledby="yn-overview-title">
    <SectionHeader id="yn-overview" eyebrow="Prototype overview" title="What Yorknew has to prove as the first full arc page">
      Yorknew is the test case because it contains nearly every content type the redesigned Story system needs: chronology, factions, character roles, Nen conditions, objects, battles, negotiations, and aftermath.
    </SectionHeader>
    <div className="yn-overview-grid">
      {yorknewPrototype.overview.map(([title, detail], index) => <article key={title}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <h3>{title}</h3>
        <p>{detail}</p>
      </article>)}
    </div>
  </section>;
}

function Chronology() {
  return <section className="yn-dark-section" aria-labelledby="yn-chronology-title">
    <SectionHeader id="yn-chronology" eyebrow="Chronology ledger" title="Auction week as a controlled sequence">
      The prototype treats the arc as a calendar and information-flow problem, not just a sequence of fights.
    </SectionHeader>
    <ol className="yn-chronology">
      {yorknewPrototype.chronology.map((event) => <li key={event.code}>
        <i>{event.code}</i>
        <div><span>{event.date} · {event.faction}</span><h3>{event.title}</h3><p>{event.detail}</p></div>
      </li>)}
    </ol>
  </section>;
}

function Factions() {
  return <section className="yn-paper-section" aria-labelledby="yn-factions-title">
    <SectionHeader id="yn-factions" eyebrow="Faction board" title="Who wants what in Yorknew">
      The page separates employers, thieves, Mafia authority, independent protagonists, assassins, and opportunists so the arc’s power map stays readable.
    </SectionHeader>
    <div className="yn-faction-grid">
      {yorknewPrototype.factions.map((faction) => <article key={faction.name}>
        <header><span>{faction.type}</span><h3>{faction.name}</h3></header>
        <p>{faction.goal}</p>
        <div className="yn-mini-cast">{faction.people.slice(0, 5).map((name) => <Portrait name={name} key={name} />)}</div>
        <footer>{faction.result}</footer>
      </article>)}
    </div>
  </section>;
}

function TroupeBoard() {
  return <section className="yn-dark-section" aria-labelledby="yn-troupe-title">
    <SectionHeader id="yn-troupe" eyebrow="Phantom Troupe board" title="The Spider as an organization under pressure">
      Yorknew works because the Troupe is not a single villain. Members carry different functions, loyalties, grief, information, and risks.
    </SectionHeader>
    <div className="yn-troupe-board">
      {yorknewPrototype.troupeBoard.map(([name, role, detail]) => <article key={name}>
        <Portrait name={name} />
        <div><span>{role}</span><h3>{name}</h3><p>{detail}</p></div>
      </article>)}
    </div>
  </section>;
}

function ChainInspector() {
  const [selectedName, setSelectedName] = useState(yorknewPrototype.chains[0].name);
  const selected = useMemo(() => yorknewPrototype.chains.find((chain) => chain.name === selectedName) || yorknewPrototype.chains[0], [selectedName]);
  return <section className="yn-paper-section yn-chain-section" aria-labelledby="yn-chains-title">
    <SectionHeader id="yn-chains" eyebrow="Kurapika / Nen inspector" title="Conditions turn emotion into enforceable mechanics">
      This module becomes the reusable model for later Nen-heavy arc pages.
    </SectionHeader>
    <div className="yn-chain-inspector">
      <div className="yn-chain-inspector__menu" role="listbox" aria-label="Choose Kurapika chain concept">
        {yorknewPrototype.chains.map((chain, index) => <button key={chain.name} role="option" className={chain.name === selected.name ? 'is-active' : ''} aria-selected={chain.name === selected.name} onClick={() => setSelectedName(chain.name)}>
          <i>{String(index + 1).padStart(2, '0')}</i><span>{chain.name}</span>
        </button>)}
      </div>
      <article className="yn-chain-inspector__detail">
        <span>{selected.category}</span>
        <h3>{selected.name}</h3>
        <dl><div><dt>Rule / condition</dt><dd>{selected.rule}</dd></div><div><dt>Yorknew use</dt><dd>{selected.use}</dd></div></dl>
      </article>
    </div>
  </section>;
}

function ConflictLedger() {
  return <section className="yn-paper-section" aria-labelledby="yn-conflicts-title">
    <SectionHeader id="yn-conflicts" eyebrow="Conflict sequence" title="Battles, raids, contracts, captures, and negotiations">
      Yorknew’s conflict model covers more than one-on-one fights. The same component pattern can later feed the Fights archive.
    </SectionHeader>
    <div className="yn-conflict-ledger">
      {yorknewPrototype.conflicts.map((conflict, index) => <article key={conflict.name}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <div><span>{conflict.type}</span><h3>{conflict.name}</h3><p>{conflict.participants}</p><dl><div><dt>Result</dt><dd>{conflict.result}</dd></div><div><dt>Consequence</dt><dd>{conflict.consequence}</dd></div></dl></div>
      </article>)}
    </div>
  </section>;
}

function FortuneMatrix() {
  return <section className="yn-dark-section" aria-labelledby="yn-fortunes-title">
    <SectionHeader id="yn-fortunes" eyebrow="Fortune matrix" title="Lovely Ghostwriter as tactical information">
      The fortunes are handled as operational data: who reads them, who manipulates them, and how they change the Troupe’s choices.
    </SectionHeader>
    <div className="yn-fortune-matrix">
      {yorknewPrototype.fortunes.map(([name, reading, effect]) => <article key={name}>
        <Portrait name={name} />
        <div><h3>{name}</h3><p>{reading}</p><small>{effect}</small></div>
      </article>)}
    </div>
  </section>;
}

function ObjectLedger() {
  return <section className="yn-paper-section" aria-labelledby="yn-objects-title">
    <SectionHeader id="yn-objects" eyebrow="Objects and evidence" title="What people want, steal, copy, restrict, or carry">
      The object ledger makes the auction economy, Nen evidence, and next-arc transition visible in one place.
    </SectionHeader>
    <div className="yn-object-ledger">
      {yorknewPrototype.objects.map(([name, role, detail]) => <article key={name}><span>{role}</span><h3>{name}</h3><p>{detail}</p></article>)}
    </div>
  </section>;
}

function AftermathAndAdaptation() {
  return <section className="yn-paper-section yn-two-column" aria-label="Yorknew aftermath and adaptation">
    <div>
      <SectionHeader id="yn-aftermath" eyebrow="Aftermath" title="What actually changes after Yorknew" />
      <div className="yn-state-list">{yorknewPrototype.aftermath.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
    <div>
      <SectionHeader id="yn-adaptation" eyebrow="2011 anime layer" title="Episode map without replacing the manga spine" />
      <div className="yn-state-list">{yorknewPrototype.adaptation.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
    </div>
  </section>;
}

function Sources() {
  return <section className="yn-dark-section" aria-labelledby="yn-sources-title">
    <SectionHeader id="yn-sources" eyebrow="Source boundary" title="Hunterpedia-backed prototype sources">
      These links define the factual source perimeter for Batch 4. Analysis and page structure remain editorial layers inside the archive.
    </SectionHeader>
    <div className="yn-source-grid">
      {yorknewPrototype.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<ExternalLink size={13} /></a>)}
    </div>
  </section>;
}

export default function YorknewPrototypePage({ onNavigate }) {
  return <article className="yorknew-prototype" aria-labelledby="yorknew-prototype-title">
    <YorknewHero onNavigate={onNavigate} />
    <LocalNav />
    <Overview />
    <Chronology />
    <Factions />
    <TroupeBoard />
    <ChainInspector />
    <ConflictLedger />
    <FortuneMatrix />
    <ObjectLedger />
    <AftermathAndAdaptation />
    <Sources />
  </article>;
}
