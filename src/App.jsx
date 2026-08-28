import { lazy, Suspense, useEffect, useState } from 'react';
import SuccessionCommandHome from './components/succession/SuccessionCommandHome';
import { ARCHIVE_BOUNDARY } from './data/archiveMeta';

const TimelineWorkspace = lazy(() => import('./components/TimelineWorkspace'));
const SuccessionArtDirectionLab = import.meta.env.DEV
  ? lazy(() => import('./components/succession/art-direction/SuccessionArtDirectionLab'))
  : null;

const isDesignLabPath = () => import.meta.env.DEV
  && typeof window !== 'undefined'
  && window.location.pathname.startsWith('/__design-lab');

const normalizePathname = (pathname = '/') => {
  if (pathname === '/timeline' || pathname === '/timeline/') return '/timeline';
  return '/';
};

const currentRoute = () => {
  if (typeof window === 'undefined') return '/';
  return normalizePathname(window.location.pathname);
};

const readTimelineState = () => {
  if (typeof window === 'undefined' || normalizePathname(window.location.pathname) !== '/timeline') return {};
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
};

const sanitizeTimelineState = (state = {}) => Object.fromEntries(Object.entries(state)
  .filter(([key, value]) => key !== 'scope'
    && value !== undefined
    && value !== null
    && value !== ''
    && value !== false)
  .map(([key, value]) => [key, String(value)]));

const timelineHref = (state = {}) => {
  const params = new URLSearchParams(sanitizeTimelineState(state));
  const search = params.toString();
  return `/timeline${search ? `?${search}` : ''}`;
};

const legacyTimelineDestination = (url) => {
  const root = '/story/succession-contest';
  if (!url.pathname.startsWith(root)) return '';
  const chapter = url.searchParams.get('chapter');
  const state = {};

  if (url.pathname === `${root}/events`) state.mode = 'archive';
  else if (url.pathname === `${root}/chapter-records`) {
    state.mode = 'archive';
    if (chapter) Object.assign(state, { chapter, from: chapter, to: chapter });
  } else if (url.pathname === `${root}/nen`) Object.assign(state, { mode: 'story', lens: 'nen' });
  else if (url.pathname === `${root}/relationships`) state.mode = 'atlas';
  else if (url.pathname === `${root}/characters`) Object.assign(state, { mode: 'atlas', view: 'people' });
  else if (url.pathname === `${root}/locations`) state.mode = 'space';
  else return '';

  return timelineHref(state);
};

const meaningfulTimelineNavigation = (current, next) => [
  'mode',
  'event',
  'focus',
  'compare',
  'view',
  'intel',
  'character',
  'thread',
  'spaceLocation',
].some((key) => String(current?.[key] || '') !== String(next?.[key] || ''));

export default function App() {
  const designLab = isDesignLabPath();
  const [route, setRoute] = useState(currentRoute);
  const [timelineState, setTimelineState] = useState(readTimelineState);

  useEffect(() => {
    if (designLab) return undefined;

    const syncRoute = () => {
      const nextRoute = currentRoute();
      setRoute(nextRoute);
      setTimelineState(nextRoute === '/timeline' ? readTimelineState() : {});
    };

    const normalized = normalizePathname(window.location.pathname);
    const canonical = normalized === '/timeline'
      ? `/timeline${window.location.search}`
      : '/';
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== canonical) window.history.replaceState({ hxhRoute: normalized }, '', canonical);

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [designLab]);

  useEffect(() => {
    if (designLab) return;
    const lens = route === '/timeline' ? timelineState.mode || 'archive' : '';
    document.title = route === '/timeline'
      ? `${lens.charAt(0).toUpperCase()}${lens.slice(1)} Timeline · Hunter × Hunter Archive`
      : 'Hunter × Hunter Archive';
  }, [designLab, route, timelineState.mode]);

  const navigate = (destination, { replace = false } = {}) => {
    const url = new URL(destination, window.location.origin);
    const nextRoute = normalizePathname(url.pathname);
    const href = nextRoute === '/timeline' ? `/timeline${url.search}` : '/';
    if (replace) window.history.replaceState({ hxhRoute: nextRoute }, '', href);
    else window.history.pushState({ hxhRoute: nextRoute }, '', href);
    setRoute(nextRoute);
    setTimelineState(nextRoute === '/timeline' ? Object.fromEntries(url.searchParams.entries()) : {});
    window.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  };

  const commitTimelineState = (nextState = {}) => {
    const sanitized = sanitizeTimelineState(nextState);
    const href = timelineHref(sanitized);
    const push = meaningfulTimelineNavigation(timelineState, sanitized);
    if (`${window.location.pathname}${window.location.search}` !== href) {
      if (push) window.history.pushState({ hxhRoute: '/timeline' }, '', href);
      else window.history.replaceState({ hxhRoute: '/timeline' }, '', href);
    }
    setRoute('/timeline');
    setTimelineState(sanitized);
  };

  const keepInternalNavigationInApp = (event) => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor || anchor.target === '_blank') return;

    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const legacyTimelineHref = legacyTimelineDestination(destination);
    if (legacyTimelineHref) {
      event.preventDefault();
      navigate(legacyTimelineHref);
      return;
    }

    if (!['/', '/timeline', '/timeline/'].includes(destination.pathname)) return;
    event.preventDefault();
    navigate(`${destination.pathname}${destination.search}`);
  };

  if (designLab && SuccessionArtDirectionLab) {
    return <Suspense fallback={null}><SuccessionArtDirectionLab /></Suspense>;
  }

  return (
    <div
      id="top"
      className={`app-shell ${route === '/timeline' ? 'view-timeline' : 'view-succession is-command-home'}`}
      onClickCapture={keepInternalNavigationInApp}
    >
      {route === '/timeline' ? (
        <Suspense fallback={null}>
          <TimelineWorkspace
            requestedState={timelineState}
            spoilerLimit={ARCHIVE_BOUNDARY}
            onNavigate={commitTimelineState}
          />
        </Suspense>
      ) : (
        <SuccessionCommandHome onNavigate={navigate} />
      )}
    </div>
  );
}
