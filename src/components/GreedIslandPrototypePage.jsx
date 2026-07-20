import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import { characters } from '../data/characters';
import {
  greedIslandCardGroups,
  greedIslandCards,
  greedIslandCardStats,
  greedIslandPrototype,
} from '../data/greedIslandPrototype';
import './GreedIslandPrototypePage.css';

const characterByName = new Map(characters.map((character) => [character.name, character]));
const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const wiki = (name) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`;

function portraitRecord(name) {
  return characterByName.get(name) || { id: name, name, source: wiki(name) };
}

function Portrait({ name, eager = false }) {
  const item = portraitRecord(name);
  if (!item.image) {
    return <span className="gi-portrait-token" aria-label={`No stored Hunterpedia portrait available for ${name}`}><b>{initialsFor(name)}</b></span>;
  }
  return <SourcePortrait item={item} eager={eager} alt={`${name} portrait from Hunterpedia`} />;
}

function SectionHeader({ id, eyebrow, title, children }) {
  return <header className="gi-section-header" id={id}>
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </header>;
}

function GreedIslandHero({ onNavigate }) {
  const arc = greedIslandPrototype;
  return <section className="gi-hero" aria-labelledby="greed-island-prototype-title">
    <div className="gi-hero__copy">
      <span className="gi-eyebrow">{arc.eyebrow}</span>
      <h1 id="greed-island-prototype-title">{arc.title}</h1>
      <p>{arc.deck}</p>
      <div className="gi-hero__actions">
        <a href="#gi-cards">Open card catalogue <ArrowRight size={15} /></a>
        <a href="#gi-spells">Open spell board <ArrowRight size={15} /></a>
        <button type="button" onClick={() => onNavigate('series', 'chimera-ant')}>Continue to Chimera Ant <ArrowRight size={15} /></button>
      </div>
    </div>
    <div className="gi-hero__portraits" aria-label="Greed Island visual leads">
      {arc.heroPeople.map((name, index) => <figure key={name} className={index === 0 ? 'is-primary' : ''}>
        <Portrait name={name} eager={index === 0} />
        <figcaption>{name}</figcaption>
      </figure>)}
    </div>
    <dl className="gi-hero__facts">
      {arc.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  </section>;
}

function LocalNav() {
  return <nav className="gi-local-nav" aria-label="Greed Island prototype sections">
    {greedIslandPrototype.sections.map(([id, label], index) => <a href={`#gi-${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></a>)}
  </nav>;
}

function Overview() {
  return <section className="gi-paper-section" aria-labelledby="gi-overview-title">
    <SectionHeader id="gi-overview" eyebrow="Game manual overview" title="Greed Island as a playable-system archive">
      The page treats the arc as a living rulebook: the story advances through collection requirements, card scarcity, spell pressure, training, player alliances, and completion routing.
    </SectionHeader>
    <div className="gi-overview-grid">
      {greedIslandPrototype.overview.map(([title, detail], index) => <article key={title}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <h3>{title}</h3>
        <p>{detail}</p>
      </article>)}
    </div>
  </section>;
}

function Chronology() {
  return <section className="gi-dark-section" aria-labelledby="gi-chronology-title">
    <SectionHeader id="gi-chronology" eyebrow="Route ledger" title="From cartridge entry to three-card exit">
      Greed Island is tracked as a game route: tutorial, card economy, training, Razor, Bomber, final quiz, and the exit choice.
    </SectionHeader>
    <ol className="gi-chronology">
      {greedIslandPrototype.chronology.map((event) => <li key={event.code}>
        <i>{event.code}</i>
        <div><span>{event.phase}</span><h3>{event.title}</h3><p>{event.detail}</p></div>
      </li>)}
    </ol>
  </section>;
}

function RuleBoard() {
  return <section className="gi-paper-section" aria-labelledby="gi-rules-title">
    <SectionHeader id="gi-rules" eyebrow="Game rules" title="How the game controls bodies, cards, spells and completion" />
    <div className="gi-rule-grid">
      {greedIslandPrototype.rules.map(([name, detail]) => <article key={name}><span>Rule</span><h3>{name}</h3><p>{detail}</p></article>)}
    </div>
  </section>;
}

function LocationBoard() {
  return <section className="gi-paper-section" aria-labelledby="gi-locations-title">
    <SectionHeader id="gi-locations" eyebrow="Island atlas" title="Locations as game functions" />
    <div className="gi-location-grid">
      {greedIslandPrototype.locations.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}
    </div>
  </section>;
}

function CardCatalogue() {
  const [activeType, setActiveType] = useState('all');
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const filteredCards = useMemo(() => greedIslandCards.filter((card) => {
    const matchesType = activeType === 'all' || card.type === activeType;
    const searchable = `${card.number} ${card.name} ${card.group} ${card.type}`.toLowerCase();
    return matchesType && (!normalized || searchable.includes(normalized));
  }), [activeType, normalized]);

  return <section className="gi-dark-section" aria-labelledby="gi-cards-title">
    <SectionHeader id="gi-cards" eyebrow="Binder catalogue" title="Full card-list structure without turning the page into a wiki wall">
      The catalogue keeps all 100 specified cards and all 40 spell cards searchable, with free-slot and Game Master records beside them.
    </SectionHeader>
    <div className="gi-card-stats">
      <div><b>{greedIslandCardStats.specified}</b><span>specified slots</span></div>
      <div><b>{greedIslandCardStats.spell}</b><span>spell cards</span></div>
      <div><b>{greedIslandCardStats.free}</b><span>free-slot records</span></div>
      <div><b>{greedIslandCardStats.gameMaster}</b><span>Game Master cards</span></div>
    </div>
    <div className="gi-card-toolbar">
      <div className="gi-card-tabs" role="tablist" aria-label="Greed Island card groups">
        {greedIslandCardGroups.map(([value, label]) => <button key={value} role="tab" aria-selected={activeType === value} className={activeType === value ? 'is-active' : ''} onClick={() => setActiveType(value)} type="button">{label}</button>)}
      </div>
      <label className="gi-card-search"><Search size={15} /><span className="sr-only">Search Greed Island cards</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search card number, name, group…" /></label>
    </div>
    <div className="gi-card-grid" role="list">
      {filteredCards.map((card) => <article role="listitem" key={`${card.type}-${card.number}`} className={`gi-card gi-card--${card.type}`}>
        <span>{card.number}</span><h3>{card.name}</h3><p>{card.group}</p><a href={card.source} target="_blank" rel="noreferrer">Hunterpedia card list <ExternalLink size={12} /></a>
      </article>)}
    </div>
  </section>;
}

function SpellStrategy() {
  return <section className="gi-paper-section" aria-labelledby="gi-spells-title">
    <SectionHeader id="gi-spells" eyebrow="Spell strategy" title="Spell cards by tactical use" />
    <div className="gi-spell-grid">
      {greedIslandPrototype.spellStrategy.map(([name, detail]) => <article key={name}><span>Spell lane</span><h3>{name}</h3><p>{detail}</p></article>)}
    </div>
  </section>;
}

function TeamBoard() {
  return <section className="gi-paper-section" aria-labelledby="gi-teams-title">
    <SectionHeader id="gi-teams" eyebrow="Player teams" title="Multiplayer goals, resources and outcomes" />
    <div className="gi-team-grid">
      {greedIslandPrototype.teams.map((team) => <article key={team.name}><header><span>{team.role}</span><h3>{team.name}</h3></header><p>{team.goal}</p><footer>{team.outcome}</footer></article>)}
    </div>
  </section>;
}

function Training() {
  return <section className="gi-paper-section" aria-labelledby="gi-training-title">
    <SectionHeader id="gi-training" eyebrow="Biscuit training" title="Applied Nen under game pressure" />
    <div className="gi-state-list">{greedIslandPrototype.training.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
  </section>;
}

function ConflictLedger() {
  return <section className="gi-dark-section" aria-labelledby="gi-conflicts-title">
    <SectionHeader id="gi-conflicts" eyebrow="Conflict ledger" title="Quests, matches, betrayal and trap fights" />
    <div className="gi-conflict-ledger">
      {greedIslandPrototype.conflicts.map((conflict, index) => <article key={conflict.name}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <div><span>{conflict.type}</span><h3>{conflict.name}</h3><p>{conflict.participants}</p><dl><div><dt>Result</dt><dd>{conflict.result}</dd></div><div><dt>Consequence</dt><dd>{conflict.consequence}</dd></div></dl></div>
      </article>)}
    </div>
  </section>;
}

function DodgeballAndBomber() {
  return <section className="gi-paper-section gi-two-column" aria-label="Razor dodgeball and Bomber conflict">
    <div><SectionHeader id="gi-dodgeball" eyebrow="Razor / dodgeball" title="A tactical game inside the game" /><div className="gi-state-list">{greedIslandPrototype.dodgeball.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div></div>
    <div><SectionHeader id="gi-bomber" eyebrow="Genthru / Bomber" title="Exploiting the card economy" /><div className="gi-state-list">{greedIslandPrototype.bomber.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div></div>
  </section>;
}

function CompletionRoute() {
  return <section className="gi-dark-section" aria-labelledby="gi-completion-title">
    <SectionHeader id="gi-completion" eyebrow="Completion route" title="From specified slots to the Chimera Ant doorway" />
    <ol className="gi-completion-route">
      {greedIslandPrototype.completion.map(([name, detail], index) => <li key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}
    </ol>
  </section>;
}

function AftermathAndAdaptation() {
  return <section className="gi-paper-section gi-two-column" aria-label="Greed Island aftermath and adaptation">
    <div><SectionHeader id="gi-aftermath" eyebrow="Aftermath" title="What changes after Greed Island" /><div className="gi-state-list">{greedIslandPrototype.aftermath.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div></div>
    <div><SectionHeader id="gi-adaptation" eyebrow="2011 anime layer" title="Episode map inside the manga spine" /><div className="gi-state-list">{greedIslandPrototype.adaptation.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div></div>
  </section>;
}

function Sources() {
  return <section className="gi-dark-section" aria-labelledby="gi-sources-title">
    <SectionHeader id="gi-sources" eyebrow="Source boundary" title="Hunterpedia-backed Greed Island sources" />
    <div className="gi-source-grid">{greedIslandPrototype.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<ExternalLink size={13} /></a>)}</div>
  </section>;
}

export default function GreedIslandPrototypePage({ onNavigate }) {
  return <article className="greed-island-prototype" aria-labelledby="greed-island-prototype-title">
    <GreedIslandHero onNavigate={onNavigate} />
    <LocalNav />
    <Overview />
    <Chronology />
    <RuleBoard />
    <LocationBoard />
    <CardCatalogue />
    <SpellStrategy />
    <TeamBoard />
    <Training />
    <ConflictLedger />
    <DodgeballAndBomber />
    <CompletionRoute />
    <AftermathAndAdaptation />
    <Sources />
  </article>;
}
