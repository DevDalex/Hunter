import { lazy, Suspense, useEffect, useState } from 'react';
import SuccessionCommandHome from './components/succession/SuccessionCommandHome';
import { ARCHIVE_BOUNDARY } from './data/archiveMeta';

const SuccessionTimelineMangaWall = lazy(() => import('./components/succession/SuccessionTimelineMangaWall'));
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

export default function App() {
  const designLab = isDesignLabPath();
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    if (designLab) return undefined;

    const syncRoute = () => setRoute(currentRoute());
    const normalized = normalizePathname(window.location.pathname);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const canonical = normalized;

    if (current !== canonical) {
      window.history.replaceState({ hxhRoute: normalized }, '', canonical);
    }

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [designLab]);

  useEffect(() => {
    if (designLab) return;
    document.title = route === '/timeline'
      ? 'Timeline · Hunter × Hunter Archive'
      : 'Hunter × Hunter Archive';
  }, [designLab, route]);

  const navigate = (destination, { replace = false } = {}) => {
    const next = normalizePathname(destination);
    if (replace) window.history.replaceState({ hxhRoute: next }, '', next);
    else window.history.pushState({ hxhRoute: next }, '', next);
    setRoute(next);
    window.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  };

  const keepInternalNavigationInApp = (event) => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor || anchor.target === '_blank') return;

    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(destination.pathname);
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
          <SuccessionTimelineMangaWall
            spoilerLimit={ARCHIVE_BOUNDARY}
            onBack={() => navigate('/')}
          />
        </Suspense>
      ) : (
        <SuccessionCommandHome onNavigate={navigate} />
      )}
    </div>
  );
}
