import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Gamepad2,
  LockKeyhole,
  MousePointer2,
  ShieldCheck,
} from 'lucide-react';
import { GREED_ISLAND_CARD_SOURCE, specifiedCards } from '../data/greed-island/specifiedCards';
import { GREED_ISLAND_RULE_SOURCES } from '../data/greed-island/tutorialRules';
import EtaTutorial from './greed-island/EtaTutorial';
import GreedIslandBinder from './greed-island/GreedIslandBinder';
import './GreedIslandPage.css';
import './GreedIslandPageResponsive.css';
import './greed-island/GreedIslandBook.css';
import './greed-island/EtaTutorialReadability.css';

const nextStages = [
  ['Card archive', 'Descriptions, acquisition quests, story uses, chapter and episode mappings, and local media stabilization.'],
  ['Spell and Free Slot libraries', 'Complete verified records for all Spell Cards, documented Free Slot cards, and Game Master-only cards.'],
  ['Island systems', 'Map, locations, quests, players, travel paths, and the Game Master control room.'],
  ['Tactical records', 'Biscuit training, Razor dodgeball, the Bomber system, final battles, quiz, and reward sequence.'],
];

function GreedIslandHero({ onNavigate, mode, setMode, summoned, setSummoned }) {
  return <header className="gi-hero" id="entry">
    <nav className="gi-route-nav" aria-label="Greed Island story navigation">
      <button type="button" onClick={() => onNavigate('series', 'yorknew-city')}><ArrowLeft size={15} /> Yorknew City</button>
      <button type="button" onClick={() => onNavigate('series')}>All arcs</button>
      <button type="button" onClick={() => onNavigate('series', 'chimera-ant')}>Chimera Ant <ArrowRight size={15} /></button>
    </nav>

    <div className="gi-hero__world" aria-hidden="true">
      <div className="gi-hero__sky"><i /><i /><i /></div>
      <div className="gi-hero__island"><span /><span /><span /><span /></div>
      <div className="gi-hero__starting-point">
        <div className="gi-hero__ring"><i /></div>
        <div className="gi-hero__eta"><i /><span>E</span><i /></div>
        <div className={`gi-hero__binder${summoned ? ' is-summoned' : ''}`}><span>G</span><b>GREED ISLAND</b><span>I</span></div>
      </div>
    </div>

    <div className="gi-hero__copy">
      <span>Story 05 · Chapters 120–185</span>
      <h1>Enter<br />Greed Island</h1>
      <p>Learn the rules from Eta. Summon your Book. Examine, hold, insert, and organize the complete Specified Slot collection.</p>
      <dl>
        <div><dt>Specified Slots</dt><dd>{specifiedCards.length}</dd></div>
        <div><dt>Free Slots</dt><dd>45</dd></div>
        <div><dt>Card ranks</dt><dd>H–SS</dd></div>
        <div><dt>Eta lessons</dt><dd>12</dd></div>
      </dl>
      <div className="gi-mode-switch" aria-label="Greed Island entry mode">
        <button type="button" className={mode === 'story' ? 'is-active' : ''} onClick={() => setMode('story')} aria-pressed={mode === 'story'}><BookOpen size={16} /> Story Mode</button>
        <button type="button" className={mode === 'free' ? 'is-active' : ''} onClick={() => { setMode('free'); setSummoned(true); }} aria-pressed={mode === 'free'}><Gamepad2 size={16} /> Free Exploration</button>
      </div>
      <button type="button" className="gi-book-command" onClick={() => setSummoned((value) => !value)} aria-pressed={summoned}>
        <span>{summoned ? 'Dismiss Book' : 'Book'}</span>
        <small>{summoned ? 'Return to the Starting Point' : 'Summon the Binder'}</small>
      </button>
    </div>
  </header>;
}

function FoundationNotes() {
  return <section className="gi-foundation" id="foundation" aria-labelledby="gi-foundation-title">
    <header className="gi-section-heading">
      <span>Verified implementation boundary</span>
      <h2 id="gi-foundation-title">Rules are interactive without being invented.</h2>
      <p>The verified card registry, card scans, reconstructed Book, and twelve-part Eta course now share one rule model sourced to Hunterpedia.</p>
    </header>
    <div className="gi-foundation__grid">
      <article><ShieldCheck size={23} /><span>Completed now</span><h3>Twelve connected lessons</h3><p>The Ring, Book, Binder, card anatomy, slot types, ranks, limits, Gain, spell targeting, protection, completion, and review are all taught through usable controls.</p></article>
      <article><MousePointer2 size={23} /><span>Measured from data</span><h3>Registry-driven card systems</h3><p>Rank counts, example cards, observed conversion-limit ranges, card selections, and completion examples come directly from the verified 000–099 registry.</p></article>
      <article><LockKeyhole size={23} /><span>Clearly labelled</span><h3>Simulation is not canon fabrication</h3><p>Gain, availability, spell, protection, and quiz controls identify themselves as archive demonstrations and preserve the documented rules around them.</p></article>
    </div>
    <div className="gi-stage-list">
      <h3>Next verified stages</h3>
      <ol>{nextStages.map(([title, note], index) => <li key={title}><i>{String(index + 5).padStart(2, '0')}</i><div><strong>{title}</strong><p>{note}</p></div></li>)}</ol>
    </div>
  </section>;
}

export default function GreedIslandPage({ onNavigate }) {
  const [mode, setMode] = useState('story');
  const [summoned, setSummoned] = useState(false);
  const overviewSource = GREED_ISLAND_RULE_SOURCES.overview;
  const etaSource = GREED_ISLAND_RULE_SOURCES.eta;

  return <article className="greed-island-page">
    <GreedIslandHero onNavigate={onNavigate} mode={mode} setMode={setMode} summoned={summoned} setSummoned={setSummoned} />
    <nav className="gi-local-nav" aria-label="Greed Island page sections">
      <div><a href="#entry">Entry</a><a href="#tutorial">Eta tutorial</a><a href="#binder">Binder</a><a href="#foundation">Build stages</a><a href="#sources">Sources</a></div>
    </nav>
    <main className="gi-canvas">
      <EtaTutorial mode={mode} summoned={summoned} setSummoned={setSummoned} />
      {summoned ? <GreedIslandBinder /> : <section className="gi-book-gate" aria-labelledby="gi-book-gate-title">
        <div aria-hidden="true"><span>G</span><b>GREED ISLAND</b><span>I</span></div>
        <span>Book not summoned</span>
        <h2 id="gi-book-gate-title">Say “Book” to open the working Binder.</h2>
        <p>The complete Eta tutorial remains available above. Story Mode leaves the Book absent until the player invokes the command; Free Exploration summons it immediately.</p>
        <button type="button" onClick={() => setSummoned(true)}>Book</button>
      </section>}
      <FoundationNotes />
      <section className="gi-sources" id="sources" aria-labelledby="gi-sources-title">
        <header className="gi-section-heading"><span>Primary research sources</span><h2 id="gi-sources-title">Hunterpedia / Hunter × Hunter Fandom</h2><p>Card images, filenames, Book references, tutorial rules, Spell examples, and completion behavior retain explicit sources and verification states.</p></header>
        <a href={GREED_ISLAND_CARD_SOURCE.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{GREED_ISLAND_CARD_SOURCE.label}</strong><small>Specified Slot registry, card anatomy, ranks, limits, Spell rules, and card images · verified {GREED_ISLAND_CARD_SOURCE.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={overviewSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{overviewSource.label}</strong><small>Ring, Book, Gain, Binder, slots, and one-minute card rule · verified {overviewSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={etaSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{etaSource.label}</strong><small>Cards 001–099, 100-question quiz, and card 000 award · verified {etaSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
      </section>
    </main>
    <footer className="gi-next-page"><div><span>Story 06</span><h2>Chimera Ant</h2><p>The card selected to find Ging instead redirects Gon and Killua toward Kite.</p></div><button type="button" onClick={() => onNavigate('series', 'chimera-ant')}>Continue <ArrowRight size={18} /></button></footer>
  </article>;
}
