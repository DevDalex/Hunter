import { lazy, Suspense, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import ReferenceBackbonePanel from './components/ReferenceBackbonePanel';
import SiteHome from './components/SiteHome';
import PageIntro from './components/PageIntro';
import WorkspaceNav from './components/WorkspaceNav';
import SpoilerControl from './components/SpoilerControl';
import { ARCHIVE_BOUNDARY, SITE_STATS } from './data/archiveMeta';
import { homeHighlights } from './data/homeHighlights';
import {
  referencePages,
  referencePrimary,
  seriesRoutes,
} from './data/routeManifest';
import { getSuccessionArchiveRoute } from './data/succession/archiveRoutes';
import { readStoredNumber, writeStoredString } from './lib/browserStorage';
import { normalizeDestination, readBrowserRoute, routeIsLegacyHash, routeToHref } from './lib/appRouter';
import { preloadArchiveSearch, preloadRoute, routeModuleLoaders } from './lib/routePreload';

const ArchiveSearch = lazy(routeModuleLoaders.archiveSearch);
const SeriesWorkspace = lazy(routeModuleLoaders.series);
const TimelineWorkspace = lazy(routeModuleLoaders.timeline);
const SuccessionArchiveApp = lazy(routeModuleLoaders.successionArchive);
const EntityEncyclopedia = lazy(routeModuleLoaders.encyclopedia);
const NenEncyclopedia = lazy(routeModuleLoaders.nen);
const HisokaChrolloDossier = lazy(routeModuleLoaders.hisokaChrollo);
const WorldAtlas = lazy(routeModuleLoaders.worldAtlas);
const OrganizationWorkspace = lazy(routeModuleLoaders.organizationWorkspace);
const ConflictArchive = lazy(routeModuleLoaders.conflictArchive);

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
  const [activeView, setActiveView] = useState(initialRoute.view);
  const [routeTarget, setRouteTarget] = useState(initialRoute.target);
  const [routeParams, setRouteParams] = useState(initialRoute.params);
  const [searchOpen, setSearchOpen] = useState(false);
  const [spoilerLimit, setSpoilerLimit] = useState(readSpoilerLimit);

  const successionPage = getSuccessionArchiveRoute(routeTarget);
  const referencePage = referencePages.find((page) => page.id === routeTarget) || referencePages[0];
  const seriesPage = seriesRoutes.find((page) => page.target === routeTarget) || seriesRoutes[0];
  const seriesTitle = routeTarget === 'zoldyck-family' ? 'Zoldyck Family' : seriesPage.label;
  const routeTitle = activeView === 'home'
    ? 'Archive'
    : activeView === 'series'
      ? seriesTitle
      : activeView === 'succession'
        ? successionPage.title
        : activeView === 'timeline'
          ? 'Timeline'
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
    const nextHref = routeToHref(normalized.view, normalized.target, normalized.params);
    const samePath = `${window.location.pathname}${window.location.search}` === nextHref;
    if (samePath) {
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
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const changeSpoilerLimit = (number) => {
    setSpoilerLimit(number);
    writeStoredString('hxh-spoiler-limit', String(number));
  };

  const openSearchResult = (result) => {
    setSearchOpen(false);
    if (result.route) navigate(result.route.view, result.route.target, result.route.params);
    else if (result.source) window.open(result.source, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="top" className={`app-shell view-${activeView}`}>
      <button type="button" className="skip-link" onClick={() => { const main = document.getElementById('main-content'); main?.focus(); main?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' }); }}>Skip to content</button>
      <Header activeView={activeView} routeTarget={routeTarget} onNavigate={navigate} onOpenSearch={() => setSearchOpen(true)} onPrefetch={preloadRoute} onPrefetchSearch={preloadArchiveSearch} />

      <main id="main-content" tabIndex="-1">
        <p className="sr-only" role="status" aria-live="polite">Opened {routeTitle}</p>

        {activeView === 'home' && <SiteHome onNavigate={navigate} onPrefetch={preloadRoute} latestChapter={ARCHIVE_BOUNDARY} stats={SITE_STATS} heroCharacters={homeHighlights} />}

        {activeView === 'series' && <Suspense fallback={<RouteLoading label="story library" />}><SeriesWorkspace routeTarget={routeTarget} routeParams={routeParams} spoilerLimit={spoilerLimit} onSpoilerChange={changeSpoilerLimit} onNavigate={navigate} onPrefetch={preloadRoute} /></Suspense>}

        {activeView === 'timeline' && <Suspense fallback={<RouteLoading label="global timeline" />}><TimelineWorkspace requestedArc={routeParams.arc || 'all'} requestedScope={routeParams.scope || 'overview'} requestedSearch={routeParams.search || ''} spoilerLimit={spoilerLimit} onNavigate={(params) => navigate('timeline', '', params)} onOpenLocation={(room) => navigate('succession', 'black-whale', { room })} /></Suspense>}

        {activeView === 'succession' && <Suspense fallback={<RouteLoading label="Succession Contest Archive" />}>
          <SuccessionArchiveApp
            routeTarget={routeTarget}
            routeParams={routeParams}
            spoilerLimit={spoilerLimit}
            onSpoilerChange={changeSpoilerLimit}
            onNavigate={(target, params) => navigate('succession', target, params)}
            onExitArchive={() => navigate('series')}
            onOpenSearch={() => setSearchOpen(true)}
            onIntent={(target) => preloadRoute('succession', target)}
          />
        </Suspense>}

        {activeView === 'reference' && referencePage.id === 'systems' && <Suspense fallback={<RouteLoading label="organizations" />}><OrganizationWorkspace requestedView={routeParams.view || 'overview'} requestedFamily={routeParams.family || 'all'} requestedSearch={routeParams.search || ''} onNavigate={(params) => navigate('reference', 'systems', params)} onOpenRecord={(category, record, search) => navigate('reference', 'encyclopedia', { category, record, search })} onOpenSuccession={() => navigate('succession', 'mafia')} onOpenBlackWhale={() => navigate('succession', 'black-whale')} onOpenNen={(search) => navigate('reference', 'nen', search ? { search } : {})} onOpenFights={() => navigate('reference', 'conflicts')} onOpenObjects={() => navigate('reference', 'encyclopedia', { category: 'objects' })} /></Suspense>}

        {activeView === 'reference' && referencePage.id !== 'systems' && <>
          <PageIntro kicker={referencePage.kicker} title={referencePage.title} description={referencePage.description}>
            <dl className="page-intro__facts"><div><dt>Connected records</dt><dd>{SITE_STATS.records}</dd></div><div><dt>Characters</dt><dd>{SITE_STATS.characters}</dd></div><div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl>
          </PageIntro>
          <WorkspaceNav items={referencePages} activeId={referencePage.id} onSelect={(id) => navigate('reference', id)} onIntent={(id) => preloadRoute('reference', id)} primaryIds={referencePrimary} label="Encyclopedia sections" />
          <SpoilerSettings value={spoilerLimit} onChange={changeSpoilerLimit} />
          {referencePage.id === 'nen' && <ReferenceBackbonePanel domain="nen" onSearch={(search) => navigate('reference', 'nen', { search })} />}

          <Suspense fallback={<RouteLoading label={referencePage.label.toLowerCase()} />}>
            {referencePage.id === 'encyclopedia' && <EntityEncyclopedia key={`encyclopedia-${routeParams.category || ''}-${routeParams.search || ''}-${routeParams.record || ''}`} initialCategory={routeParams.category || 'characters'} initialQuery={routeParams.search || ''} initialRecord={routeParams.record || ''} spoilerLimit={spoilerLimit} />}
            {referencePage.id === 'nen' && <NenEncyclopedia initialQuery={routeParams.search || ''} spoilerLimit={spoilerLimit} />}
            {referencePage.id === 'atlas' && <WorldAtlas initialLocation={routeParams.location || routeParams.search || ''} initialMode={routeParams.mode || 'explore'} initialRoute={routeParams.route || ''} onOpenBlackWhale={() => navigate('succession', 'black-whale')} onOpenEncyclopedia={(search) => navigate('reference', 'encyclopedia', { category: 'locations', search })} onOpenTimeline={(search) => navigate('succession', 'timeline', { search })} />}
            {referencePage.id === 'conflicts' && (routeParams.case === 'hisoka-chrollo' ? <HisokaChrolloDossier initialChapter={routeParams.chapter} initialAbility={routeParams.ability} /> : <ConflictArchive initialQuery={routeParams.search || ''} onOpenEntity={(search) => navigate('reference', 'encyclopedia', { search })} onOpenHisokaDossier={() => navigate('reference', 'conflicts', { case: 'hisoka-chrollo' })} />)}
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
        <nav aria-label="Footer links"><button onClick={() => navigate('series')}>Story</button><button onClick={() => navigate('timeline')}>Timeline</button><button onClick={() => navigate('reference', 'encyclopedia')}>Encyclopedia</button><button onClick={() => navigate('succession', 'archive')}>Succession</button></nav>
        <a href="https://hunterxhunter.fandom.com/" target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a>
      </footer>

      {searchOpen && <Suspense fallback={<RouteLoading label="archive search" />}><ArchiveSearch open spoilerLimit={spoilerLimit} onClose={() => setSearchOpen(false)} onSelect={openSearchResult} /></Suspense>}
    </div>
  );
}
