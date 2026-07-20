import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import ReferenceBackbonePanel from './components/ReferenceBackbonePanel';
import SiteHome from './components/SiteHome';
import PageIntro from './components/PageIntro';
import WorkspaceNav from './components/WorkspaceNav';
import SectionTabs from './components/SectionTabs';
import SpoilerControl from './components/SpoilerControl';
import ArchiveDownloadDialog from './components/ArchiveDownloadDialog';
import { ARCHIVE_BOUNDARY, SITE_STATS } from './data/archiveMeta';
import { homeHighlights } from './data/homeHighlights';
import {
  dossierTabRoutes,
  referencePages,
  referencePrimary,
  seriesRoutes,
  successionPages,
  successionPrimary,
} from './data/routeManifest';
import { readStoredNumber, writeStoredString } from './lib/browserStorage';
import { normalizeDestination, readBrowserRoute, routeIsLegacyHash, routeToHref } from './lib/appRouter';
import { preloadArchiveSearch, preloadRoute, routeModuleLoaders } from './lib/routePreload';

const ArchiveSearch = lazy(routeModuleLoaders.archiveSearch);
const SeriesWorkspace = lazy(routeModuleLoaders.series);
const SuccessionOverview = lazy(routeModuleLoaders.successionOverview);
const FamilyTree = lazy(routeModuleLoaders.familyTree);
const SuccessionRoster = lazy(routeModuleLoaders.successionRoster);
const SuccessionTimeline = lazy(routeModuleLoaders.successionTimeline);
const SuccessionConnectionBoard = lazy(routeModuleLoaders.successionConnections);
const BlackWhaleGuide = lazy(routeModuleLoaders.blackWhale);
const SuccessionDossier = lazy(routeModuleLoaders.successionDossier);
const EntityEncyclopedia = lazy(routeModuleLoaders.encyclopedia);
const NenEncyclopedia = lazy(routeModuleLoaders.nen);
const HisokaChrolloDossier = lazy(routeModuleLoaders.hisokaChrollo);
const WorldAtlas = lazy(routeModuleLoaders.worldAtlas);
const SystemsDesk = lazy(routeModuleLoaders.systems);
const OrganizationArchive = lazy(routeModuleLoaders.organizations);
const ConflictArchive = lazy(routeModuleLoaders.conflictArchive);
const StudyNotebook = lazy(routeModuleLoaders.notebook);

const successionPanels = {
  'family-tree': [
    { id: 'tree', label: 'Family tree', note: 'Bloodline graphic' },
    { id: 'princes', label: 'Prince dossiers', note: 'Fourteen profiles' },
  ],
  'succession-roster': [
    { id: 'roster', label: 'Character archive', note: 'Filterable cast' },
    { id: 'assignments', label: 'Guard assignments', note: 'Rooms and loyalties' },
    { id: 'relationships', label: 'Relationship map', note: 'Focused connections' },
  ],
  beasts: [
    { id: 'beasts', label: 'Spirit Beasts', note: 'Hosts and mechanics' },
    { id: 'abilities', label: 'Abilities', note: 'Conditions and costs' },
    { id: 'classes', label: 'Nen classes', note: 'Students and results' },
    { id: 'rules', label: 'Contest rules', note: 'Ritual and law' },
  ],
  mafia: [
    { id: 'mafia', label: 'Mafia families', note: 'Xi-Yu, Cha-R, Heil-Ly' },
    { id: 'justice', label: 'Justice & military', note: 'Authority and custody' },
    { id: 'operations', label: 'Operations', note: 'Plans and confrontations' },
    { id: 'relationships', label: 'Political links', note: 'Typed relationships' },
  ],
  chapters: [
    { id: 'chapters', label: 'Chapter ledger', note: `Ch. 340–${ARCHIVE_BOUNDARY}` },
    { id: 'deaths', label: 'Deaths & body states', note: 'Confirmed and exceptional' },
    { id: 'objects', label: 'Objects & evidence', note: 'Custody and effects' },
    { id: 'mysteries', label: 'Open mysteries', note: 'Evidence boundaries' },
  ],
};

const panelToDossierTab = {
  princes: 'royal', assignments: 'assignments', beasts: 'beasts', abilities: 'abilities', classes: 'abilities', rules: 'rules',
  mafia: 'mafia', justice: 'justice', operations: 'operations', relationships: 'relations', chapters: 'chapters',
  deaths: 'status', objects: 'objects', mysteries: 'mysteries',
};

const dossierPanelForTab = {
  royal: 'princes', assignments: 'assignments', guards: 'assignments', beasts: 'beasts', abilities: 'abilities', rules: 'rules',
  mafia: 'mafia', factions: 'mafia', troupe: 'mafia', institutions: 'justice', justice: 'justice', expedition: 'justice',
  operations: 'operations', relations: 'relationships', relationships: 'relationships', status: 'deaths', objects: 'objects',
  chapters: 'chapters', mysteries: 'mysteries', links: 'mysteries', overview: 'tree', core: 'chapters', routes: 'chapters',
};

function readSpoilerLimit() {
  const stored = readStoredNumber('hxh-spoiler-limit', ARCHIVE_BOUNDARY);
  return stored >= 1 && stored <= ARCHIVE_BOUNDARY ? stored : ARCHIVE_BOUNDARY;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const RouteLoading = ({ label = 'section' }) => <section className="route-loading" role="status" aria-live="polite" aria-busy="true"><span /><strong>Opening {label}…</strong></section>;

function SpoilerSettings({ value, onChange }) {
  return <details className="spoiler-settings"><summary>Reading boundary <b>Chapter {value}</b></summary><SpoilerControl value={value} latestChapter={ARCHIVE_BOUNDARY} onChange={onChange} /></details>;
}

export default function App() {
  const initialRoute = readBrowserRoute();
  const standaloneBuild = typeof window !== 'undefined' && window.__HXH_STANDALONE_BUILD__ === true;
  const [activeView, setActiveView] = useState(initialRoute.view);
  const [routeTarget, setRouteTarget] = useState(initialRoute.target);
  const [routeParams, setRouteParams] = useState(initialRoute.params);
  const [searchOpen, setSearchOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [spoilerLimit, setSpoilerLimit] = useState(readSpoilerLimit);

  const successionPage = successionPages.find((page) => page.id === routeTarget) || successionPages[0];
  const referencePage = referencePages.find((page) => page.id === routeTarget) || referencePages[0];
  const seriesPage = seriesRoutes.find((page) => page.target === routeTarget) || seriesRoutes[0];
  const seriesTitle = routeTarget === 'zoldyck-family' ? 'Zoldyck Family' : seriesPage.label;
  const routeTitle = activeView === 'home'
    ? 'Archive'
    : activeView === 'series'
      ? seriesTitle
      : activeView === 'succession'
        ? successionPage.title
        : activeView === 'reference'
          ? referencePage.title
          : 'Page not found';

  const applyRoute = (next) => {
    setActiveView(next.view);
    setRouteTarget(next.target);
    setRouteParams(next.params || {});
  };

  const navigate = (view, target = '', params = {}) => {
    const normalized = normalizeDestination(view, target, params);
    const nextHref = routeToHref(normalized.view, normalized.target, normalized.params, { preferHash: standaloneBuild });
    const sameHash = nextHref.startsWith('#/') && window.location.hash === nextHref;
    const samePath = !nextHref.startsWith('#/') && `${window.location.pathname}${window.location.search}` === nextHref;
    if (sameHash || samePath) {
      applyRoute(normalized);
      return;
    }
    if (nextHref.startsWith('#/')) {
      window.location.hash = nextHref;
      applyRoute(normalized);
      return;
    }
    window.history.pushState({ hxhRoute: nextHref }, '', nextHref);
    applyRoute(normalized);
  };

  useEffect(() => {
    const handleRoute = () => applyRoute(readBrowserRoute());
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  useEffect(() => {
    document.title = `${routeTitle} · Hunter × Hunter Archive`;
    const timer = window.setTimeout(() => {
      const anchor = window.location.hash && !routeIsLegacyHash(window.location.hash) ? decodeURIComponent(window.location.hash.slice(1)) : '';
      const anchorTarget = anchor ? document.getElementById(anchor) : null;
      if (anchorTarget) anchorTarget.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
      else window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }, 20);
    return () => window.clearTimeout(timer);
  }, [activeView, routeTarget, routeTitle, routeParams]);

  useEffect(() => {
    const handleKey = (event) => {
      const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((event.key === '/' || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))) && !editing) {
        event.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const changeSpoilerLimit = (number) => { setSpoilerLimit(number); writeStoredString('hxh-spoiler-limit', String(number)); };

  const routeDossierTab = (tab = 'overview', prince) => {
    const target = dossierTabRoutes[tab] || 'overview';
    const panel = dossierPanelForTab[tab];
    navigate('succession', target, { panel, prince });
  };

  const openSearchResult = (result) => {
    setSearchOpen(false);
    if (result.route) navigate(result.route.view, result.route.target, result.route.params);
    else if (result.source) window.open(result.source, '_blank', 'noopener,noreferrer');
  };

  const activePanel = useMemo(() => {
    const panels = successionPanels[routeTarget];
    if (!panels) return '';
    return panels.some((item) => item.id === routeParams.panel) ? routeParams.panel : panels[0].id;
  }, [routeParams.panel, routeTarget]);

  const renderEmbeddedDossier = (panel) => (
    <SuccessionDossier
      embedded
      spoilerLimit={spoilerLimit}
      requestedTab={panelToDossierTab[panel] || panel}
      requestedPrince={routeParams.prince}
      requestedFocus={routeParams.focus}
      onNavigate={(target, params) => navigate('succession', target, params)}
      onRouteTab={routeDossierTab}
    />
  );

  return (
    <div id="top" className={`app-shell view-${activeView}`}>
      <button type="button" className="skip-link" onClick={() => { const main = document.getElementById('main-content'); main?.focus(); main?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' }); }}>Skip to content</button>
      <Header activeView={activeView} routeTarget={routeTarget} onNavigate={navigate} onOpenSearch={() => setSearchOpen(true)} onOpenDownloads={() => setDownloadsOpen(true)} onPrefetch={preloadRoute} onPrefetchSearch={preloadArchiveSearch} />
      {standaloneBuild && <aside className="standalone-banner" role="note"><b>You are viewing the standalone edition.</b><span>This copy runs independently of the hosted website; keep its media folder beside the start file.</span></aside>}

      <main id="main-content" tabIndex="-1">
        <p className="sr-only" role="status" aria-live="polite">Opened {routeTitle}</p>

        {activeView === 'home' && <SiteHome onNavigate={navigate} onPrefetch={preloadRoute} onOpenSearch={() => setSearchOpen(true)} onOpenDownloads={() => setDownloadsOpen(true)} latestChapter={ARCHIVE_BOUNDARY} stats={SITE_STATS} heroCharacters={homeHighlights} />}

        {activeView === 'series' && <Suspense fallback={<RouteLoading label="story library" />}><SeriesWorkspace routeTarget={routeTarget} routeParams={routeParams} spoilerLimit={spoilerLimit} onSpoilerChange={changeSpoilerLimit} onNavigate={navigate} onPrefetch={preloadRoute} /></Suspense>}

        {activeView === 'succession' && <>
          <PageIntro kicker={successionPage.kicker} title={successionPage.title} description={successionPage.description}>
            <dl className="page-intro__facts"><div><dt>Arc</dt><dd>Ch. 340–{ARCHIVE_BOUNDARY}</dd></div><div><dt>Contest</dt><dd>Begins Ch. 359</dd></div><div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl>
          </PageIntro>
          <WorkspaceNav items={successionPages} activeId={successionPage.id} onSelect={(id) => navigate('succession', id)} onIntent={(id) => preloadRoute('succession', id)} primaryIds={successionPrimary} label="Succession sections" />
          <SpoilerSettings value={spoilerLimit} onChange={changeSpoilerLimit} />

          {successionPanels[successionPage.id] && <SectionTabs items={successionPanels[successionPage.id]} activeId={activePanel} onSelect={(panel) => navigate('succession', successionPage.id, { panel })} label={`${successionPage.label} views`} />}

          <Suspense fallback={<RouteLoading label={successionPage.label.toLowerCase()} />}>
            {successionPage.id === 'overview' && <SuccessionOverview spoilerLimit={spoilerLimit} onNavigate={(target, params) => navigate('succession', target, params)} onOpenPrince={(prince) => navigate('succession', 'family-tree', { panel: 'princes', prince })} onOpenDossier={routeDossierTab} onOpenWorldMap={() => navigate('reference', 'atlas', { mode: 'succession', location: 'kakin-empire' })} onOpenSearch={() => setSearchOpen(true)} />}
            {successionPage.id === 'family-tree' && activePanel === 'tree' && <FamilyTree spoilerLimit={spoilerLimit} onOpenPrince={(prince) => navigate('succession', 'family-tree', { panel: 'princes', prince })} />}
            {successionPage.id === 'family-tree' && activePanel === 'princes' && renderEmbeddedDossier('princes')}
            {successionPage.id === 'succession-roster' && activePanel === 'roster' && <SuccessionRoster spoilerLimit={spoilerLimit} initialQuery={routeParams.search || ''} />}
            {successionPage.id === 'succession-roster' && activePanel === 'relationships' && <SuccessionConnectionBoard />}
            {successionPage.id === 'succession-roster' && activePanel === 'assignments' && renderEmbeddedDossier('assignments')}
            {successionPage.id === 'succession-timeline' && <SuccessionTimeline spoilerLimit={spoilerLimit} initialQuery={routeParams.search || ''} onOpenLocation={(room) => navigate('succession', 'black-whale', { room })} />}
            {successionPage.id === 'black-whale' && <BlackWhaleGuide initialQuery={routeParams.room || ''} onOpenWorldMap={() => navigate('reference', 'atlas', { mode: 'succession', location: 'black-whale-voyage' })} />}
            {successionPage.id === 'beasts' && renderEmbeddedDossier(activePanel)}
            {successionPage.id === 'mafia' && renderEmbeddedDossier(activePanel)}
            {successionPage.id === 'chapters' && renderEmbeddedDossier(activePanel)}
          </Suspense>
        </>}

        {activeView === 'reference' && <>
          <PageIntro kicker={referencePage.kicker} title={referencePage.title} description={referencePage.description}>
            <dl className="page-intro__facts"><div><dt>Connected records</dt><dd>{SITE_STATS.records}</dd></div><div><dt>Characters</dt><dd>{SITE_STATS.characters}</dd></div><div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl>
          </PageIntro>
          <WorkspaceNav items={referencePages} activeId={referencePage.id} onSelect={(id) => navigate('reference', id)} onIntent={(id) => preloadRoute('reference', id)} primaryIds={referencePrimary} label="Encyclopedia sections" />
          <SpoilerSettings value={spoilerLimit} onChange={changeSpoilerLimit} />
          {referencePage.id === 'nen' && <ReferenceBackbonePanel domain="nen" onSearch={(search) => navigate('reference', 'nen', { search })} />}

          <Suspense fallback={<RouteLoading label={referencePage.label.toLowerCase()} />}>
            {referencePage.id === 'encyclopedia' && <EntityEncyclopedia key={`encyclopedia-${routeParams.category || ''}-${routeParams.search || ''}-${routeParams.record || ''}`} initialCategory={routeParams.category || 'characters'} initialQuery={routeParams.search || ''} initialRecord={routeParams.record || ''} spoilerLimit={spoilerLimit} />}
            {referencePage.id === 'nen' && <NenEncyclopedia initialQuery={routeParams.search || ''} spoilerLimit={spoilerLimit} />}
            {referencePage.id === 'atlas' && <WorldAtlas initialLocation={routeParams.location || routeParams.search || ''} initialMode={routeParams.mode || 'explore'} initialRoute={routeParams.route || ''} onOpenBlackWhale={() => navigate('succession', 'black-whale')} onOpenEncyclopedia={(search) => navigate('reference', 'encyclopedia', { category: 'locations', search })} onOpenTimeline={(search) => navigate('succession', 'succession-timeline', { search })} />}
            {referencePage.id === 'systems' && (routeParams.view === 'institutions' || routeParams.view === 'relations' || routeParams.view === 'objects' || routeParams.view === 'conflicts'
              ? <SystemsDesk initialView={routeParams.view} initialQuery={routeParams.search || ''} onOpenRecord={(category, record, search) => navigate('reference', 'encyclopedia', { category, record, search })} />
              : <OrganizationArchive onOpenRecord={(category, record, search) => navigate('reference', 'encyclopedia', { category, record, search })} onOpenSuccession={() => navigate('succession', 'mafia')} onOpenBlackWhale={() => navigate('succession', 'black-whale')} />)}
            {referencePage.id === 'conflicts' && (routeParams.case === 'hisoka-chrollo' ? <HisokaChrolloDossier initialChapter={routeParams.chapter} initialAbility={routeParams.ability} /> : <>
              <ConflictArchive initialQuery={routeParams.search || ''} onOpenEntity={(search) => navigate('reference', 'encyclopedia', { search })} onOpenHisokaDossier={() => navigate('reference', 'conflicts', { case: 'hisoka-chrollo' })} />
            </>)}
            {referencePage.id === 'notebook' && <StudyNotebook />}
          </Suspense>
        </>}

        {activeView === 'not-found' && <>
          <PageIntro kicker="404" title="Route not found" description={`The route ${routeParams.attemptedPath || 'you opened'} is not part of the archive.`}>
            <dl className="page-intro__facts"><div><dt>Fallback</dt><dd>Available</dd></div><div><dt>Story hub</dt><dd>/story</dd></div><div><dt>Search</dt><dd>Ctrl K</dd></div></dl>
          </PageIntro>
          <section className="index-section">
            <div className="index-heading"><div><span className="section-kicker">Routing guard</span><h2>Use a known archive destination.</h2><p>The clean router falls back to this page for unknown paths instead of silently opening the wrong section.</p></div></div>
            <div className="story-grid"><article><span>Primary route</span><h3>Open the Story hub</h3><p>Return to the Story entry point and choose a known arc or archive section.</p><button onClick={() => navigate('series')}>Open Story</button></article><article><span>Find a record</span><h3>Search the archive</h3><p>Use search to jump to characters, arcs, Nen records, locations, conflicts, and source-backed entries.</p><button onClick={() => setSearchOpen(true)}>Open Search</button></article></div>
          </section>
        </>}
      </main>

      <footer className="site-footer">
        <div><b>Hunter × Hunter Archive</b><p>An independent, non-commercial visual encyclopedia. Manga facts and displayed media are linked to Hunterpedia/Fandom; Hunter × Hunter belongs to Yoshihiro Togashi and its rights holders.</p></div>
        <nav aria-label="Footer links"><button onClick={() => navigate('series')}>Story</button><button onClick={() => navigate('reference', 'encyclopedia')}>Encyclopedia</button><button onClick={() => navigate('succession', 'overview')}>Succession</button><button onClick={() => setDownloadsOpen(true)}>Download website</button></nav>
        <a href="https://hunterxhunter.fandom.com/" target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a>
      </footer>

      <ArchiveDownloadDialog open={downloadsOpen} onClose={() => setDownloadsOpen(false)} />
      {searchOpen && <Suspense fallback={<RouteLoading label="archive search" />}><ArchiveSearch open spoilerLimit={spoilerLimit} onClose={() => setSearchOpen(false)} onSelect={openSearchResult} /></Suspense>}
    </div>
  );
}
