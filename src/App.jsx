import { useEffect } from 'react';
import SuccessionCommandHome from './components/succession/SuccessionCommandHome';
import { ARCHIVE_BOUNDARY } from './data/archiveMeta';

const resetLocationToHome = () => {
  if (typeof window === 'undefined') return;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current !== '/') window.history.replaceState({ hxhRoute: '/' }, '', '/');
};

export default function App() {
  useEffect(() => {
    document.title = 'Hunter × Hunter Archive';
    resetLocationToHome();
  }, []);

  const stayHome = () => {
    resetLocationToHome();
    window.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  };

  const keepInternalLinksOnHome = (event) => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor || anchor.target === '_blank') return;

    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    event.preventDefault();
    stayHome();
  };

  return (
    <div
      id="top"
      className="app-shell view-succession is-command-home"
      onClickCapture={keepInternalLinksOnHome}
    >
      <SuccessionCommandHome
        spoilerLimit={ARCHIVE_BOUNDARY}
        onNavigate={stayHome}
        onOpenSearch={stayHome}
      />
    </div>
  );
}
