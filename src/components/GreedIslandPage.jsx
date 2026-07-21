import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Gamepad2,
  LockKeyhole,
  MousePointer2,
  ShieldCheck,
} from 'lucide-react';
import { GREED_ISLAND_CARD_SOURCE, specifiedCards } from '../data/greed-island/specifiedCards';
import GreedIslandBinder from './greed-island/GreedIslandBinder';
import './GreedIslandPage.css';
import './GreedIslandPageResponsive.css';
import './greed-island/GreedIslandBook.css';

const GREED_ISLAND_BOOK_SOURCE = Object.freeze({
  label: 'Greed Island — Ring, Binder, and Cards',
  href: 'https://hunterxhunter.fandom.com/wiki/Greed_Island#Ring,_Binder,_and_Cards',
  verifiedAt: '2026-07-21',
});

const tutorialSteps = [
  ['01', 'The Ring', 'Every player receives the ring that connects them to the game system.'],
  ['02', '“Book”', 'The command summons the Binder used to store cards and access player information.'],
  ['03', 'The Binder', 'Specified Slot cards belong in numbered slots. Free Slots support additional inventory.'],
  ['04', 'Card anatomy', 'Number, name, rank, conversion limit, illustration, and effect form the card record.'],
];

const nextStages = [
  ['Eta tutorial', 'Progressive lessons for the Ring, Book, Binder, ranks, limits, Gain, spells, protection, and completion.'],
  ['Card systems', 'Card anatomy viewer, rank ladder, conversion-limit simulation, Gain, and field-by-field record enrichment.'],
  ['Card archive', 'Descriptions, quests, story uses, chapter and episode mappings, and local media stabilization.'],
  ['Island systems', 'Map, locations, quests, players, spells, and the Game Master control room.'],
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
        <div><dt>2011 anime</dt><dd>Episodes 59–75</dd></div>
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

function EtaFoundation({ mode, summoned, setSummoned }) {
  const [step, setStep] = useState(0);
  const active = tutorialSteps[step];

  return <section className="gi-tutorial" id="tutorial" aria-labelledby="gi-tutorial-title">
    <header className="gi-section-heading">
      <span>Starting Point tutorial</span>
      <h2 id="gi-tutorial-title">Eta teaches one rule at a time.</h2>
      <p>{mode === 'story' ? 'Story Mode follows the intended entry sequence before opening the wider archive.' : 'Free Exploration keeps the tutorial available without blocking the Binder.'}</p>
    </header>
    <div className="gi-tutorial__layout">
      <div className="gi-eta-machine" aria-hidden="true"><i /><span>ETA</span><i /><b /></div>
      <div className="gi-dialogue">
        <span>Lesson {active[0]} / {String(tutorialSteps.length).padStart(2, '0')}</span>
        <h3>{active[1]}</h3>
        <p>{active[2]}</p>
        <div>
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft size={15} /> Previous</button>
          <button type="button" onClick={() => setStep((value) => Math.min(tutorialSteps.length - 1, value + 1))} disabled={step === tutorialSteps.length - 1}>Continue <ArrowRight size={15} /></button>
          {!summoned && <button type="button" className="is-command" onClick={() => setSummoned(true)}>Try “Book”</button>}
        </div>
      </div>
      <ol className="gi-tutorial__steps" aria-label="Foundation tutorial chapters">
        {tutorialSteps.map(([number, title], index) => <li key={number}>
          <button type="button" className={step === index ? 'is-active' : ''} onClick={() => setStep(index)} aria-current={step === index ? 'step' : undefined}>
            <i>{number}</i><span>{title}</span>{index < step && <CheckCircle2 size={14} />}
          </button>
        </li>)}
      </ol>
    </div>
  </section>;
}

function FoundationNotes() {
  return <section className="gi-foundation" id="foundation" aria-labelledby="gi-foundation-title">
    <header className="gi-section-heading">
      <span>Verified implementation boundary</span>
      <h2 id="gi-foundation-title">Built in stages, not filled with guesses.</h2>
      <p>The card records, verified scans, and interactive Binder now share a canon-closer Book reconstructed from Hunterpedia’s G.I. Book and G.I. Book Slots references.</p>
    </header>
    <div className="gi-foundation__grid">
      <article><ShieldCheck size={23} /><span>Reconstructed now</span><h3>The Book finally resembles the Book</h3><p>The route now uses the violet-black cover, metallic frame, circular mechanism, pale rigid pages, central spine, and dark card pockets visible in the reference images.</p></article>
      <article><MousePointer2 size={23} /><span>Usable now</span><h3>Specified and Free Slot pages</h3><p>All ten Specified Slot pages and five Free Slot pages can be opened and turned by pointer, touch, keyboard activation, or focused arrow-key controls.</p></article>
      <article><LockKeyhole size={23} /><span>Clearly deferred</span><h3>No fabricated secondary systems</h3><p>Player List and Map tabs are visible as Binder functions but disabled until their verified records are built. Analysis remains explicitly labelled as an archive reconstruction.</p></article>
    </div>
    <div className="gi-stage-list">
      <h3>Next verified stages</h3>
      <ol>{nextStages.map(([title, note], index) => <li key={title}><i>{String(index + 4).padStart(2, '0')}</i><div><strong>{title}</strong><p>{note}</p></div></li>)}</ol>
    </div>
  </section>;
}

export default function GreedIslandPage({ onNavigate }) {
  const [mode, setMode] = useState('story');
  const [summoned, setSummoned] = useState(false);

  return <article className="greed-island-page">
    <GreedIslandHero onNavigate={onNavigate} mode={mode} setMode={setMode} summoned={summoned} setSummoned={setSummoned} />
    <nav className="gi-local-nav" aria-label="Greed Island page sections">
      <div><a href="#entry">Entry</a><a href="#tutorial">Eta tutorial</a><a href="#binder">Binder</a><a href="#foundation">Build stages</a><a href="#sources">Sources</a></div>
    </nav>
    <main className="gi-canvas">
      <EtaFoundation mode={mode} summoned={summoned} setSummoned={setSummoned} />
      {summoned ? <GreedIslandBinder /> : <section className="gi-book-gate" aria-labelledby="gi-book-gate-title">
        <div aria-hidden="true"><span>G</span><b>GREED ISLAND</b><span>I</span></div>
        <span>Book not summoned</span>
        <h2 id="gi-book-gate-title">Say “Book” to begin the card tutorial.</h2>
        <p>The Book remains absent in the entry sequence until the player invokes the command. Free Exploration can summon it immediately.</p>
        <button type="button" onClick={() => setSummoned(true)}>Book</button>
      </section>}
      <FoundationNotes />
      <section className="gi-sources" id="sources" aria-labelledby="gi-sources-title">
        <header className="gi-section-heading"><span>Primary research sources</span><h2 id="gi-sources-title">Hunterpedia / Hunter × Hunter Fandom</h2><p>Card images, filenames, Book references, and data retain explicit sources and verification states.</p></header>
        <a href={GREED_ISLAND_CARD_SOURCE.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{GREED_ISLAND_CARD_SOURCE.label}</strong><small>Specified Slot registry and card images · verified {GREED_ISLAND_CARD_SOURCE.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={GREED_ISLAND_BOOK_SOURCE.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{GREED_ISLAND_BOOK_SOURCE.label}</strong><small>G.I. Book, G.I. Book Slots, and Binder rules · verified {GREED_ISLAND_BOOK_SOURCE.verifiedAt}</small></span><ExternalLink size={14} /></a>
      </section>
    </main>
    <footer className="gi-next-page"><div><span>Story 06</span><h2>Chimera Ant</h2><p>The card selected to find Ging instead redirects Gon and Killua toward Kite.</p></div><button type="button" onClick={() => onNavigate('series', 'chimera-ant')}>Continue <ArrowRight size={18} /></button></footer>
  </article>;
}
