import { lazy, Suspense, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import PageIntro from './components/PageIntro';
import ReferenceBackbonePanel from './components/ReferenceBackbonePanel';
import SpoilerControl from './components/SpoilerControl';
import WorkspaceNav from './components/WorkspaceNav';
import { ARCHIVE_BOUNDARY } from './data/archiveMeta';
import { referencePages, referencePrimary } from './data/routeManifest';
import { getSuccessionArchiveRoute } from './data/succession/archiveRoutes';
import { readStoredNumber, writeStoredString } from './lib/browserStorage';
import {
  normalizeDestination,
  readBrowserRoute,
  routeIsLegacyHash,
  routeToHref,
} from './lib/appRouter';
import { preloadRoute, routeModuleLoaders } from './lib/routePreload';

const SuccessionArchiveApp = lazy(routeModuleLoaders.successionArchive);
const NenEncyclopedia = lazy(routeModuleLoaders.nen);
const WorldAtlas = lazy(routeModuleLoaders.worldAtlas);

function readSpoilerLimit() {
  const stored = readStoredNumber('hxh-spoiler-limit', ARCHIVE_BOUNDARY);
  return stored >= 1 && stored <= ARCHIVE_BOUNDARY ? stored : ARCHIVE_BOUNDARY;
}

const reducedMotion = () => typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const RouteLoading = ({ label = 'section' }) => (
  <section className="route-loading" role="status" aria-live="polite" aria-busy="true">
    <span />
    <strong>Opening {label}…</strong>
  </section>
);

function SpoilerSettings({ value, onChange }) {
  return (
    <details className="spoiler-settings">
      <summary>Reading boundary <b>Chapter {value}</b></summary>
      <SpoilerControl value={value} latestChapter={ARCHIVE_BOUNDARY} onChange={onChange} />
    </details>
  );
}

export default function App() {
  const initialRoute = readBrowserRoute();
  const [activeView, setActiveView] = useState(initialRoute.view);
  const [routeTarget, setRouteTarget] = useState(initialRoute.target);
  const [routeParams, setRouteParams] = useState(initialRoute.params);
  const [spoilerLimit, setSpoilerLimit] = useState(readSpoilerLimit);

  const successionPage = getSuccessionArchiveRoute(routeTarget);
  const referencePage = referencePages.find((page) => page.id === routeTarget) || referencePages[0];

  const routeTitle = activeView === 'succession'
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
      const anchor = window.location.hash && !routeIsLegacyHash(window.location.hash)
        ? decodeURIComponent(window.location.hash.slice(1))
        : '';
      const anchorTarget = anchor ? document.getElementById(anchor) : null;
      if (anchorTarget) {
        anchorTarget.scrollIntoView({
          block: 'start',
          behavior: reducedMotion() ? 'auto' : 'smooth',
        });
      } else {
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    }, 20);

    return () => window.clearTimeout(timer);
  }, [activeView, routeTarget, routeTitle, routeParams]);

  useEffect(() => {
    const handleKey = (event) => {
      const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((event.key === '/' || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))) && !editing) {
        event.preventDefault();
        navigate('succession', 'search');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const changeSpoilerLimit = (number) => {
    setSpoilerLimit(number);
    writeStoredString('hxh-spoiler-limit', String(number));
  };

  return (
    <div id="top" className={`app-shell view-${activeView}`}>
      <button
        type="button"
        className="skip-link"
        onClick={() => {
          const main = document.getElementById('main-content');
          main?.focus();
          main?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
        }}
      >
        Skip to content
      </button>

      <Header
        activeView={activeView}
        routeTarget={routeTarget}
        onNavigate={navigate}
        onOpenSearch={() => navigate('succession', 'search')}
        onPrefetch={preloadRoute}
      />

      <main id="main-content" tabIndex="-1">
        <p className="sr-only" role="status" aria-live="polite">Opened {routeTitle}</p>

        {activeView === 'succession' && (
          <Suspense fallback={<RouteLoading label="Succession Contest Archive" />}>
            <SuccessionArchiveApp
              routeTarget={routeTarget}
              routeParams={routeParams}
              spoilerLimit={spoilerLimit}
              onSpoilerChange={changeSpoilerLimit}
              onNavigate={(target, params) => navigate('succession', target, params)}
              onExitArchive={() => navigate('succession', 'archive')}
              onOpenSearch={() => navigate('succession', 'search')}
              onIntent={(target) => preloadRoute('succession', target)}
            />
          </Suspense>
        )}

        {activeView === 'reference' && (
          <>
            <PageIntro
              kicker={referencePage.kicker}
              title={referencePage.title}
              description={referencePage.description}
            >
              <dl className="page-intro__facts">
                <div><dt>Scope</dt><dd>{referencePage.id === 'nen' ? 'General Nen' : 'Known World'}</dd></div>
                <div><dt>Connected archive</dt><dd>Succession Contest</dd></div>
                <div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div>
              </dl>
            </PageIntro>

            <WorkspaceNav
              items={referencePages}
              activeId={referencePage.id}
              onSelect={(id) => navigate('reference', id)}
              onIntent={(id) => preloadRoute('reference', id)}
              primaryIds={referencePrimary}
              label="Retained reference sections"
            />

            <SpoilerSettings value={spoilerLimit} onChange={changeSpoilerLimit} />

            {referencePage.id === 'nen' && (
              <ReferenceBackbonePanel
                domain="nen"
                onSearch={(search) => navigate('reference', 'nen', { search })}
              />
            )}

            <Suspense fallback={<RouteLoading label={referencePage.label.toLowerCase()} />}>
              {referencePage.id === 'nen' && (
                <NenEncyclopedia
                  initialQuery={routeParams.search || ''}
                  spoilerLimit={spoilerLimit}
                />
              )}

              {referencePage.id === 'atlas' && (
                <WorldAtlas
                  initialLocation={routeParams.location || routeParams.search || ''}
                  initialMode={routeParams.mode || 'explore'}
                  initialRoute={routeParams.route || ''}
                  onOpenBlackWhale={() => navigate('succession', 'black-whale')}
                  onOpenEncyclopedia={(search) => navigate('succession', 'search', { search })}
                  onOpenTimeline={(search) => navigate('succession', 'timeline', { search })}
                />
              )}
            </Suspense>
          </>
        )}

        {activeView === 'not-found' && (
          <>
            <PageIntro
              kicker="404"
              title="Route removed"
              description={`${routeParams.attemptedPath || 'This destination'} is no longer part of the focused archive.`}
            />
            <section className="index-section">
              <div className="index-heading">
                <div>
                  <span className="section-kicker">Available destinations</span>
                  <h2>Choose one of the three maintained sections.</h2>
                  <p>The site now focuses on the Succession Contest, the general Nen encyclopedia, and the World Atlas.</p>
                </div>
              </div>
              <div className="story-grid">
                <article>
                  <span>Primary archive</span>
                  <h3>Succession Contest</h3>
                  <p>Open the chapter-bounded research application.</p>
                  <button onClick={() => navigate('succession', 'archive')}>Open Succession</button>
                </article>
                <article>
                  <span>Power system</span>
                  <h3>General Nen</h3>
                  <p>Browse the retained Nen system encyclopedia.</p>
                  <button onClick={() => navigate('reference', 'nen')}>Open Nen</button>
                </article>
                <article>
                  <span>Story geography</span>
                  <h3>World Atlas</h3>
                  <p>Explore the retained world and location atlas.</p>
                  <button onClick={() => navigate('reference', 'atlas')}>Open World</button>
                </article>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div>
          <b>Hunter × Hunter Archive</b>
          <p>A focused Succession Contest archive with the general Nen encyclopedia and World Atlas retained.</p>
        </div>
        <nav aria-label="Footer links">
          <button onClick={() => navigate('succession', 'archive')}>Succession</button>
          <button onClick={() => navigate('reference', 'nen')}>Nen</button>
          <button onClick={() => navigate('reference', 'atlas')}>World</button>
        </nav>
        <a href="https://hunterxhunter.fandom.com/" target="_blank" rel="noreferrer">
          Hunterpedia <ExternalLink size={11} />
        </a>
      </footer>
    </div>
  );
}
