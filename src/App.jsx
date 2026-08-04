import { lazy, Suspense, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import PageIntro from './components/PageIntro';
import SuccessionIntegratedReferences from './components/succession/SuccessionIntegratedReferences';
import { ARCHIVE_BOUNDARY } from './data/archiveMeta';
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

export default function App() {
  const initialRoute = readBrowserRoute();
  const [activeView, setActiveView] = useState(initialRoute.view);
  const [routeTarget, setRouteTarget] = useState(initialRoute.target);
  const [routeParams, setRouteParams] = useState(initialRoute.params);
  const [spoilerLimit, setSpoilerLimit] = useState(readSpoilerLimit);

  const successionPage = getSuccessionArchiveRoute(routeTarget);
  const integratedReferenceMode = activeView === 'succession'
    && routeTarget === 'nen'
    && routeParams.scope === 'encyclopedia'
    ? 'nen'
    : activeView === 'succession'
      && routeTarget === 'locations'
      && routeParams.scope === 'world'
      ? 'world'
      : '';

  const routeTitle = activeView === 'succession'
    ? integratedReferenceMode === 'nen'
      ? 'Nen and ability encyclopedia'
      : integratedReferenceMode === 'world'
        ? 'World and location atlas'
        : successionPage.title
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
          integratedReferenceMode ? (
            <SuccessionIntegratedReferences
              mode={integratedReferenceMode}
              routeParams={routeParams}
              spoilerLimit={spoilerLimit}
              onSpoilerChange={changeSpoilerLimit}
              onNavigate={(target, params) => navigate('succession', target, params)}
            />
          ) : (
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
          )
        )}

        {activeView === 'not-found' && (
          <>
            <PageIntro
              kicker="404"
              title="Route removed"
              description={`${routeParams.attemptedPath || 'This destination'} is no longer part of the unified Succession Contest archive.`}
            />
            <section className="index-section">
              <div className="index-heading">
                <div>
                  <span className="section-kicker">Unified archive</span>
                  <h2>Everything now lives inside the Succession Contest application.</h2>
                  <p>The general Nen encyclopedia and World Atlas are retained as internal Succession reference modules.</p>
                </div>
              </div>
              <div className="story-grid">
                <article>
                  <span>Primary archive</span>
                  <h3>Succession Contest</h3>
                  <p>Open the chapter-bounded research application.</p>
                  <button onClick={() => navigate('succession', 'archive')}>Open archive</button>
                </article>
                <article>
                  <span>Internal module</span>
                  <h3>Nen Encyclopedia</h3>
                  <p>Browse the general power-system library from inside Succession.</p>
                  <button onClick={() => navigate('succession', 'nen', { scope: 'encyclopedia' })}>Open Nen</button>
                </article>
                <article>
                  <span>Internal module</span>
                  <h3>World Atlas</h3>
                  <p>Explore world geography without leaving the Succession archive.</p>
                  <button onClick={() => navigate('succession', 'locations', { scope: 'world' })}>Open World</button>
                </article>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div>
          <b>Hunter × Hunter Succession Archive</b>
          <p>One unified Succession Contest application with Nen and World reference modules built inside it.</p>
        </div>
        <nav aria-label="Footer links">
          <button onClick={() => navigate('succession', 'archive')}>Archive</button>
          <button onClick={() => navigate('succession', 'nen', { scope: 'encyclopedia' })}>Nen Library</button>
          <button onClick={() => navigate('succession', 'locations', { scope: 'world' })}>World Atlas</button>
        </nav>
        <a href="https://hunterxhunter.fandom.com/" target="_blank" rel="noreferrer">
          Hunterpedia <ExternalLink size={11} />
        </a>
      </footer>
    </div>
  );
}
