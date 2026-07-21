import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Gamepad2,
  LockKeyhole,
  Map,
  MousePointer2,
  ShieldCheck,
} from 'lucide-react';
import { GREED_ISLAND_CARD_SOURCE, specifiedCards } from '../data/greed-island/specifiedCards';
import { GREED_ISLAND_RULE_SOURCES } from '../data/greed-island/tutorialRules';
import { documentedFreeSlotCards, gameMasterCards, GREED_ISLAND_LIBRARY_SOURCE, spellCards } from '../data/greed-island/cardLibraries.js';
import { GREED_ISLAND_SYSTEM_SOURCES, greedIslandSystemStats } from '../data/greed-island/islandSystems.js';
import { GREED_ISLAND_TACTICAL_SOURCES, greedIslandTacticalStats } from '../data/greed-island/tacticalRecords.js';
import { GREED_ISLAND_COMPLETION_SOURCES, greedIslandCompletionStats } from '../data/greed-island/completionArchive.js';
import EtaTutorial from './greed-island/EtaTutorial';
import GreedIslandBinder from './greed-island/GreedIslandBinder';
import SpecifiedCardArchive from './greed-island/SpecifiedCardArchive';
import GreedIslandCardLibraries from './greed-island/GreedIslandCardLibraries';
import GreedIslandSystems from './greed-island/GreedIslandSystems';
import GreedIslandTacticalRecords from './greed-island/GreedIslandTacticalRecords';
import GreedIslandCompletionArchive from './greed-island/GreedIslandCompletionArchive';
import './GreedIslandPage.css';
import './GreedIslandPageResponsive.css';
import './greed-island/GreedIslandBook.css';
import './greed-island/EtaTutorialReadability.css';

const nextStages = [
  ['Final merge gate', 'Keep the PR draft until explicit review, merge, and deployment instructions are given.'],
];

function GreedIslandHero({ onNavigate, mode, setMode, summoned, setSummoned }) {
  const tacticalTotal = greedIslandTacticalStats.trainingModules + greedIslandTacticalStats.dodgeballPhases + greedIslandTacticalStats.bomberMechanics + greedIslandTacticalStats.finalBattles;
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
      <p>Learn the rules from Eta. Summon your Book. Examine cards, locations, quests, player targeting, Game Master systems, tactical records, and the source-bound completion archive.</p>
      <dl>
        <div><dt>Specified Slots</dt><dd>{specifiedCards.length}</dd></div>
        <div><dt>Spell Cards</dt><dd>{spellCards.length}</dd></div>
        <div><dt>Tactics</dt><dd>{tacticalTotal}</dd></div>
        <div><dt>Completion</dt><dd>{greedIslandCompletionStats.completionRecords}</dd></div>
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
  const completionTotal = greedIslandCompletionStats.completionRecords;
  return <section className="gi-foundation" id="foundation" aria-labelledby="gi-foundation-title">
    <header className="gi-section-heading">
      <span>Verified implementation boundary</span>
      <h2 id="gi-foundation-title">Cards, systems, tactics, and completion records now close the Greed Island route.</h2>
      <p>The Specified archive, verified scans, reconstructed Book, Eta course, card libraries, island map, quest directory, player targeting, Game Master room, tactical records, and completion archive are connected without pretending to reproduce a live game state or a public deployment.</p>
    </header>
    <div className="gi-foundation__grid">
      <article><ShieldCheck size={23} /><span>Completed now</span><h3>Completion archive</h3><p>{completionTotal} completion records document the quiz boundary, reward sequence, route fork, adaptation archive, and final release checks.</p></article>
      <article><MousePointer2 size={23} /><span>Usable now</span><h3>Route-fork simulator</h3><p>Magnetic Force and Accompany are separated so Ging’s one-on-one route and Kite’s group route remain clear and source-linked.</p></article>
      <article><LockKeyhole size={23} /><span>Clearly labelled</span><h3>Release gate</h3><p>The PR can pass QA without claiming a live Workers deployment; public deployment still requires independent verification.</p></article>
    </div>
    <div className="gi-stage-list">
      <h3>Remaining gate</h3>
      <ol>{nextStages.map(([title, note], index) => <li key={title}><i>{String(index + 10).padStart(2, '0')}</i><div><strong>{title}</strong><p>{note}</p></div></li>)}</ol>
    </div>
  </section>;
}

export default function GreedIslandPage({ onNavigate }) {
  const [mode, setMode] = useState('story');
  const [summoned, setSummoned] = useState(false);
  const overviewSource = GREED_ISLAND_RULE_SOURCES.overview;
  const etaSource = GREED_ISLAND_RULE_SOURCES.eta;
  const systemSource = GREED_ISLAND_SYSTEM_SOURCES.overview;
  const locationSource = GREED_ISLAND_SYSTEM_SOURCES.locations;
  const gmSource = GREED_ISLAND_SYSTEM_SOURCES.gameMasters;
  const tacticalSource = GREED_ISLAND_TACTICAL_SOURCES.badlands;
  const razorSource = GREED_ISLAND_TACTICAL_SOURCES.razor;
  const bomberSource = GREED_ISLAND_TACTICAL_SOURCES.bomber;
  const completionSource = GREED_ISLAND_COMPLETION_SOURCES.arc;
  const completionQuizSource = GREED_ISLAND_COMPLETION_SOURCES.eta;
  const completionRouteSource = GREED_ISLAND_COMPLETION_SOURCES.chapter185;

  return <article className="greed-island-page">
    <GreedIslandHero onNavigate={onNavigate} mode={mode} setMode={setMode} summoned={summoned} setSummoned={setSummoned} />
    <nav className="gi-local-nav" aria-label="Greed Island page sections">
      <div><a href="#entry">Entry</a><a href="#tutorial">Eta tutorial</a><a href="#binder">Binder</a><a href="#card-archive">Specified archive</a><a href="#card-libraries">Card libraries</a><a href="#island-systems">Island systems</a><a href="#tactical-records">Tactical records</a><a href="#completion-archive">Completion archive</a><a href="#foundation">Build stages</a><a href="#sources">Sources</a></div>
    </nav>
    <main className="gi-canvas">
      <EtaTutorial mode={mode} summoned={summoned} setSummoned={setSummoned} />
      {summoned ? <GreedIslandBinder /> : <section className="gi-book-gate" aria-labelledby="gi-book-gate-title">
        <div aria-hidden="true"><span>G</span><b>GREED ISLAND</b><span>I</span></div>
        <span>Book not summoned</span>
        <h2 id="gi-book-gate-title">Say “Book” to open the working Binder.</h2>
        <p>The complete Eta tutorial, card archives, island systems, tactical records, and completion archive remain available. Story Mode leaves the Book absent until the player invokes the command; Free Exploration summons it immediately.</p>
        <button type="button" onClick={() => setSummoned(true)}>Book</button>
      </section>}
      <SpecifiedCardArchive />
      <GreedIslandCardLibraries />
      <GreedIslandSystems />
      <GreedIslandTacticalRecords />
      <GreedIslandCompletionArchive />
      <FoundationNotes />
      <section className="gi-sources" id="sources" aria-labelledby="gi-sources-title">
        <header className="gi-section-heading"><span>Primary research sources</span><h2 id="gi-sources-title">Hunterpedia / Hunter × Hunter Fandom</h2><p>Card images, effects, Book references, tutorial rules, acquisition records, story mappings, card libraries, locations, quests, island systems, tactical records, and completion records retain explicit sources and verification states.</p></header>
        <a href={GREED_ISLAND_CARD_SOURCE.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{GREED_ISLAND_CARD_SOURCE.label}</strong><small>Specified Slot registry, descriptions, ranks, limits, Spell rules, and card images · verified {GREED_ISLAND_CARD_SOURCE.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={GREED_ISLAND_LIBRARY_SOURCE.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{GREED_ISLAND_LIBRARY_SOURCE.label}</strong><small>Spell Cards, documented Free Slot cards, and Game Master-only cards · verified {GREED_ISLAND_LIBRARY_SOURCE.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={systemSource.href} target="_blank" rel="noreferrer noopener"><Map size={18} /><span><strong>{systemSource.label}</strong><small>Ring, Book, Gain, Binder, card classes, player list, port, and overview systems · verified {systemSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={locationSource.href} target="_blank" rel="noreferrer noopener"><Map size={18} /><span><strong>{locationSource.label}</strong><small>Starting Point, Masadora, Soufrabi, Aiai, Limeiro, port, and location pages · verified {locationSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={gmSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{gmSource.label}</strong><small>Game Master roles, restricted controls, and GM-only card boundary · verified {gmSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={tacticalSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{tacticalSource.label}</strong><small>Biscuit training, Shu/Ken/Ryu work, aura-type drills, and Little Flower counter-reading · verified {tacticalSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={razorSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{razorSource.label}</strong><small>Razor, 14 Devils, dodgeball phases, Plot of Beach, and Eliminate context · verified {razorSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={bomberSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{bomberSource.label}</strong><small>Countdown, Little Flower, disarm condition, Release ritual, and final Bomber split · verified {bomberSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={completionSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{completionSource.label}</strong><small>Three-slot holder, reward sequence, post-completion card handling, and arc endpoint · verified {completionSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={completionQuizSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{completionQuizSource.label}</strong><small>100-question quiz, Gon’s 87/100 result, and Ruler’s Blessing award · verified {completionQuizSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={completionRouteSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{completionRouteSource.label}</strong><small>Ging and Elena’s Magnetic Force / Accompany route fork · verified {completionRouteSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={overviewSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{overviewSource.label}</strong><small>Ring, Book, Gain, Binder, slots, and one-minute card rule · verified {overviewSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
        <a href={etaSource.href} target="_blank" rel="noreferrer noopener"><BookOpen size={18} /><span><strong>{etaSource.label}</strong><small>Cards 001–099, 100-question quiz, and card 000 award · verified {etaSource.verifiedAt}</small></span><ExternalLink size={14} /></a>
      </section>
    </main>
    <footer className="gi-next-page"><div><span>Story 06</span><h2>Chimera Ant</h2><p>The card selected to find Ging instead redirects Gon and Killua toward Kite.</p></div><button type="button" onClick={() => onNavigate('series', 'chimera-ant')}>Continue <ArrowRight size={18} /></button></footer>
  </article>;
}
