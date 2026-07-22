import { lazy, Suspense, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Home,
  LibraryBig,
  Map as MapIcon,
  Menu,
  NotebookTabs,
} from 'lucide-react';
import './GreedIslandPage.css';
import './GreedIslandPageResponsive.css';
import './GreedIslandShell.css';
import './greed-island/GreedIslandModulePolish.css';

const GreedIslandHub = lazy(() => import('./greed-island/GreedIslandHub'));
const EtaTutorial = lazy(() => import('./greed-island/EtaTutorial'));
const GreedIslandBinder = lazy(() => import('./greed-island/GreedIslandBinder'));
const SpecifiedCardArchive = lazy(() => import('./greed-island/SpecifiedCardArchive'));
const GreedIslandCardLibraries = lazy(() => import('./greed-island/GreedIslandCardLibraries'));
const GreedIslandSystems = lazy(() => import('./greed-island/GreedIslandSystems'));
const GreedIslandTacticalRecords = lazy(() => import('./greed-island/GreedIslandTacticalRecords'));
const GreedIslandCompletionArchive = lazy(() => import('./greed-island/GreedIslandCompletionArchive'));

const modules = Object.freeze([
  { id: 'home', label: 'Home', note: 'Choose a system', icon: Home },
  { id: 'eta', label: 'Eta', note: 'Tutorial room', icon: GraduationCap },
  { id: 'binder', label: 'Binder', note: 'Working Book', icon: NotebookTabs },
  { id: 'cards', label: 'Cards', note: 'Card archives', icon: LibraryBig },
  { id: 'island', label: 'Island', note: 'Map and systems', icon: MapIcon },
  { id: 'tactics', label: 'Tactics', note: 'Training and battles', icon: Activity },
  { id: 'completion', label: 'Completion', note: 'Endgame records', icon: CheckCircle2 },
]);

const moduleById = new Map(modules.map((item) => [item.id, item]));

const subviews = Object.freeze({
  cards: [
    { id: 'specified', label: 'Specified 000–099' },
    { id: 'spells', label: 'Spell Cards' },
    { id: 'free-slot', label: 'Free Slot' },
    { id: 'game-master', label: 'Game Master' },
  ],
  island: [
    { id: 'map', label: 'Map & locations' },
    { id: 'quests', label: 'Quests' },
    { id: 'players', label: 'Player systems' },
    { id: 'game-masters', label: 'Game Masters' },
  ],
  tactics: [
    { id: 'training', label: 'Training' },
    { id: 'razor', label: 'Razor' },
    { id: 'bombers', label: 'Bombers' },
    { id: 'final-battles', label: 'Final battles' },
  ],
  completion: [
    { id: 'quiz', label: 'Quiz' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'route', label: 'Route fork' },
    { id: 'adaptation', label: 'Adaptation' },
  ],
});

const defaults = Object.freeze({ cards: 'specified', island: 'map', tactics: 'training', completion: 'quiz' });

const moduleDescriptions = Object.freeze({
  home: 'A lightweight directory. No heavy Greed Island system is mounted until you choose it.',
  eta: 'The animated tutorial room, old-game dialogue, twelve lessons, and lesson-specific demonstrations.',
  binder: 'The working Book renders only its current ten-card spread and preserves stored Binder progress.',
  cards: 'Open one card collection at a time instead of mounting every archive and library together.',
  island: 'Map, quests, player systems, and Game Master controls are separated into individual views.',
  tactics: 'Training, Razor, Bombers, and final battles remain isolated tactical views.',
  completion: 'Quiz, rewards, route fork, and adaptation records are separated from the rest of the archive.',
});

function ModuleLoading({ label }) {
  return <section className="gi-app__loading" role="status" aria-live="polite" aria-busy="true"><span /><strong>Opening {label}…</strong></section>;
}

export default function GreedIslandPage({ onNavigate, routeParams = {} }) {
  const requestedModule = routeParams.module || 'home';
  const activeModule = moduleById.has(requestedModule) ? requestedModule : 'home';
  const activeMeta = moduleById.get(activeModule);
  const availableSubviews = subviews[activeModule] || [];
  const requestedSubview = routeParams.subview;
  const activeSubview = availableSubviews.some((item) => item.id === requestedSubview)
    ? requestedSubview
    : defaults[activeModule];
  const [menuOpen, setMenuOpen] = useState(false);
  const [summoned, setSummoned] = useState(false);

  const navigateModule = (module, subview) => {
    setMenuOpen(false);
    onNavigate('series', 'greed-island', {
      ...(module && module !== 'home' ? { module } : {}),
      ...(subview ? { subview } : {}),
    });
  };

  const outlet = useMemo(() => {
    if (activeModule === 'home') return <GreedIslandHub onOpen={(module) => navigateModule(module, defaults[module])} />;
    if (activeModule === 'eta') return <EtaTutorial mode="story" summoned={summoned} setSummoned={setSummoned} />;
    if (activeModule === 'binder') return <GreedIslandBinder onOpenArchive={() => navigateModule('cards', 'specified')} />;
    if (activeModule === 'cards') {
      if (activeSubview === 'specified') return <SpecifiedCardArchive />;
      const collection = activeSubview === 'free-slot' ? 'free' : activeSubview === 'game-master' ? 'gm' : 'spell';
      return <GreedIslandCardLibraries requestedCollection={collection} onCollectionChange={(next) => navigateModule('cards', next === 'free' ? 'free-slot' : next === 'gm' ? 'game-master' : 'spells')} />;
    }
    if (activeModule === 'island') return <GreedIslandSystems requestedView={activeSubview} />;
    if (activeModule === 'tactics') {
      const collection = activeSubview === 'bombers' ? 'bomber' : activeSubview === 'final-battles' ? 'battles' : activeSubview;
      return <GreedIslandTacticalRecords requestedCollection={collection} onCollectionChange={(next) => navigateModule('tactics', next === 'bomber' ? 'bombers' : next === 'battles' ? 'final-battles' : next)} />;
    }
    if (activeModule === 'completion') return <GreedIslandCompletionArchive requestedCollection={activeSubview} onCollectionChange={(next) => navigateModule('completion', next)} />;
    return null;
  }, [activeModule, activeSubview, summoned]);

  return <article className="gi-app greed-island-page" data-greed-island-active-module={activeModule} data-greed-island-active-subview={activeSubview || ''}>
    <header className="gi-app__topbar">
      <div>
        <button type="button" className="gi-app__mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="greed-island-module-nav"><Menu size={17} /> Modules</button>
        <div><strong>Greed Island</strong><small>{activeMeta.label}</small></div>
      </div>
      <div>
        <button type="button" onClick={() => onNavigate('series', 'yorknew-city')}><ArrowLeft size={15} /> Yorknew</button>
        <button type="button" onClick={() => onNavigate('series')}>All arcs</button>
        <button type="button" onClick={() => onNavigate('series', 'chimera-ant')}>Chimera Ant <ArrowRight size={15} /></button>
      </div>
    </header>

    <div className="gi-app__layout">
      <nav id="greed-island-module-nav" className={`gi-app__nav${menuOpen ? ' is-open' : ''}`} aria-label="Greed Island modules">
        {modules.map(({ id, label, note, icon: Icon }) => <button type="button" key={id} className={activeModule === id ? 'is-active' : ''} aria-current={activeModule === id ? 'page' : undefined} onClick={() => navigateModule(id, defaults[id])} data-gi-module-nav={id}>
          <Icon size={18} /><span><strong>{label}</strong><small>{note}</small></span>
        </button>)}
      </nav>

      <main className="gi-app__main">
        {activeModule !== 'home' && <header className="gi-app__module-head">
          <div><span>Greed Island module</span><h1>{activeMeta.label}</h1></div>
          <p>{moduleDescriptions[activeModule]}</p>
        </header>}

        {!!availableSubviews.length && <nav className="gi-app__subnav" aria-label={`${activeMeta.label} views`}>
          {availableSubviews.map((item) => <button type="button" key={item.id} className={activeSubview === item.id ? 'is-active' : ''} aria-current={activeSubview === item.id ? 'page' : undefined} onClick={() => navigateModule(activeModule, item.id)}>{item.label}</button>)}
        </nav>}

        <div className="gi-app__outlet" data-greed-island-module-outlet={activeModule}>
          <Suspense fallback={<ModuleLoading label={activeMeta.label} />}>{outlet}</Suspense>
        </div>
      </main>
    </div>
  </article>;
}
