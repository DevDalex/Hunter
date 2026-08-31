import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import SuccessionCommandHome from './components/succession/SuccessionCommandHome';
import { ARCHIVE_BOUNDARY } from './data/archiveMeta';

const loadTimelineWorkspace = () => import('./components/TimelineWorkspace');
const loadSuccessionPillarWorkspace = () => import('./components/succession/SuccessionPillarWorkspace');

const TimelineWorkspace = lazy(loadTimelineWorkspace);
const SuccessionPillarWorkspace = lazy(loadSuccessionPillarWorkspace);
const SuccessionArtDirectionLab = import.meta.env.DEV
  ? lazy(() => import('./components/succession/art-direction/SuccessionArtDirectionLab'))
  : null;

const CONTENT_ROUTES = new Set(['/timeline', '/characters', '/nen']);
const CHARACTER_LEGACY = new Set(['characters', 'princes', 'queens', 'bodyguards', 'organizations', 'relationships']);
const NEN_LEGACY = new Set(['nen', 'guardian-spirit-beasts']);

const preloadRoute = (route) => {
  if (route === '/timeline') return loadTimelineWorkspace();
  if (route === '/characters' || route === '/nen') return loadSuccessionPillarWorkspace();
  return Promise.resolve();
};

function RouteLoadingFallback({ section }) {
  return (
    <main className="route-loading-shell" aria-busy="true" aria-live="polite">
      <div className="route-loading-shell__heading">
        <span className="route-loading-shell__kicker">Succession Contest</span>
        <strong>{section}</strong>
      </div>
      <div className="route-loading-shell__rule" />
      <div className="route-loading-shell__line route-loading-shell__line--wide" />
      <div className="route-loading-shell__line" />
      <div className="route-loading-shell__cards" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="sr-only">Loading {section}</span>
    </main>
  );
}

const isDesignLabPath = () => import.meta.env.DEV
  && typeof window !== 'undefined'
  && window.location.pathname.startsWith('/__design-lab');

const normalizePathname = (pathname = '/') => {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return CONTENT_ROUTES.has(clean) ? clean : '/';
};

const legacyPillarDestination = (url) => {
  const root = '/story/succession-contest';
  if (!url.pathname.startsWith(root)) return '';
  const target = url.pathname.slice(root.length).replace(/^\//, '').replace(/\/$/, '');
  const path = CHARACTER_LEGACY.has(target)
    ? '/characters'
    : NEN_LEGACY.has(target)
      ? '/nen'
      : '/timeline';
  return `${path}${url.search}`;
};

const currentRoute = () => {
  if (typeof window === 'undefined') return '/';
  return normalizePathname(window.location.pathname);
};

const readRouteState = (route = currentRoute()) => {
  if (typeof window === 'undefined' || route === '/') return {};
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
};

const sanitizeState = (state = {}) => Object.fromEntries(Object.entries(state)
  .filter(([key, value]) => key !== 'scope'
    && value !== undefined
    && value !== null
    && value !== ''
    && value !== false)
  .map(([key, value]) => [key, String(value)]));

const routeHref = (route, state = {}) => {
  const params = new URLSearchParams(sanitizeState(state));
  const search = params.toString();
  return `${route}${search ? `?${search}` : ''}`;
};

const meaningfulTimelineNavigation = (current, next) => [
  'mode', 'event', 'focus', 'compare', 'view', 'intel', 'character', 'thread', 'spaceLocation',
].some((key) => String(current?.[key] || '') !== String(next?.[key] || ''));

export default function App() {
  const designLab = isDesignLabPath();
  const [route, setRoute] = useState(currentRoute);
  const [routeState, setRouteState] = useState(() => readRouteState(currentRoute()));

  useEffect(() => {
    if (designLab) return undefined;

    const syncRoute = () => {
      const nextRoute = currentRoute();
      void preloadRoute(nextRoute);
      startTransition(() => {
        setRoute(nextRoute);
        setRouteState(readRouteState(nextRoute));
      });
    };

    const incoming = new URL(window.location.href);
    const legacyDestination = legacyPillarDestination(incoming);
    if (legacyDestination) {
      window.history.replaceState({ hxhRoute: legacyDestination.split('?')[0] }, '', legacyDestination);
    } else {
      const normalized = normalizePathname(window.location.pathname);
      const canonical = normalized === '/' ? '/' : `${normalized}${window.location.search}`;
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== canonical) window.history.replaceState({ hxhRoute: normalized }, '', canonical);
    }

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [designLab]);

  useEffect(() => {
    if (designLab || typeof window === 'undefined') return undefined;

    const preload = () => {
      void Promise.allSettled([
        loadTimelineWorkspace(),
        loadSuccessionPillarWorkspace(),
      ]);
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(preload, 250);
    return () => window.clearTimeout(timeoutId);
  }, [designLab]);

  useEffect(() => {
    if (designLab) return;
    if (route === '/timeline') {
      const lens = routeState.mode || 'archive';
      document.title = `${lens.charAt(0).toUpperCase()}${lens.slice(1)} Timeline · Hunter × Hunter`;
    } else if (route === '/characters') document.title = 'Succession Characters · Hunter × Hunter';
    else if (route === '/nen') document.title = 'Succession Nen · Hunter × Hunter';
    else document.title = 'Hunter × Hunter · Succession Contest';
  }, [designLab, route, routeState.mode]);

  const navigate = (destination, { replace = false, preserveScroll = false } = {}) => {
    const url = new URL(destination, window.location.origin);
    const legacyDestination = legacyPillarDestination(url);
    const resolved = legacyDestination ? new URL(legacyDestination, window.location.origin) : url;
    const nextRoute = normalizePathname(resolved.pathname);
    const href = nextRoute === '/' ? '/' : `${nextRoute}${resolved.search}`;
    const nextState = nextRoute === '/' ? {} : Object.fromEntries(resolved.searchParams.entries());

    void preloadRoute(nextRoute);
    if (replace) window.history.replaceState({ hxhRoute: nextRoute }, '', href);
    else window.history.pushState({ hxhRoute: nextRoute }, '', href);

    startTransition(() => {
      setRoute(nextRoute);
      setRouteState(nextState);
    });
    if (!preserveScroll) window.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  };

  const commitTimelineState = (nextState = {}) => {
    const sanitized = sanitizeState(nextState);
    const href = routeHref('/timeline', sanitized);
    const push = meaningfulTimelineNavigation(routeState, sanitized);
    if (`${window.location.pathname}${window.location.search}` !== href) {
      if (push) window.history.pushState({ hxhRoute: '/timeline' }, '', href);
      else window.history.replaceState({ hxhRoute: '/timeline' }, '', href);
    }
    startTransition(() => {
      setRoute('/timeline');
      setRouteState(sanitized);
    });
  };

  const keepInternalNavigationInApp = (event) => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor || anchor.target === '_blank') return;
    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const legacyDestination = legacyPillarDestination(destination);
    if (legacyDestination) {
      event.preventDefault();
      navigate(legacyDestination);
      return;
    }

    if (!['/', '/timeline', '/timeline/', '/characters', '/characters/', '/nen', '/nen/'].includes(destination.pathname)) return;
    event.preventDefault();
    navigate(`${destination.pathname}${destination.search}`);
  };

  if (designLab && SuccessionArtDirectionLab) {
    return <Suspense fallback={null}><SuccessionArtDirectionLab /></Suspense>;
  }

  const pillar = route === '/characters' ? 'characters' : route === '/nen' ? 'nen' : '';

  return (
    <div
      id="top"
      className={`app-shell ${route === '/timeline' ? 'view-timeline' : pillar ? `view-succession view-${pillar}` : 'view-succession is-command-home'}`}
      onClickCapture={keepInternalNavigationInApp}
    >
      {route === '/timeline' ? (
        <Suspense fallback={<RouteLoadingFallback section="Timeline" />}>
          <TimelineWorkspace
            requestedState={routeState}
            spoilerLimit={ARCHIVE_BOUNDARY}
            onNavigate={commitTimelineState}
          />
        </Suspense>
      ) : pillar ? (
        <Suspense fallback={<RouteLoadingFallback section={pillar === 'characters' ? 'Characters' : 'Nen'} />}>
          <SuccessionPillarWorkspace
            pillar={pillar}
            requestedState={routeState}
            spoilerLimit={ARCHIVE_BOUNDARY}
            onNavigate={navigate}
          />
        </Suspense>
      ) : (
        <SuccessionCommandHome />
      )}
    </div>
  );
}
