import { lazy, Suspense, useEffect, useRef } from 'react';
import SuccessionArchiveShell from './SuccessionArchiveShell';

const SuccessionChapterReader = lazy(() => import('../SuccessionChapterReader'));

function ReaderLoadingState() {
  return <div className="succession-reader-command__loading" role="status" aria-live="polite">
    <span>Reader module</span>
    <strong>Opening chapter workspace…</strong>
  </div>;
}

const readerControlLabels = Object.freeze([
  ['.succession-reader__chapter-trigger', 'Open chapter navigator'],
  ['.succession-reader__bottombar > button[type="button"]', 'Go to previous page or chapter'],
  ['.succession-reader__bottom-actions > button[type="button"]:nth-child(2)', 'Go to next page or chapter'],
]);

export default function SuccessionArchiveReaderRoute({
  routeParams = {},
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
  onExitArchive,
  onOpenSearch,
  onIntent,
}) {
  const readerSectionRef = useRef(null);
  const navigateReader = (patch = {}) => onNavigate('reader', patch);

  useEffect(() => {
    const root = readerSectionRef.current;
    if (!root) return undefined;

    const applyAccessibleNames = () => {
      for (const [selector, label] of readerControlLabels) {
        root.querySelector(selector)?.setAttribute('aria-label', label);
      }
    };

    applyAccessibleNames();
    const observer = new MutationObserver(applyAccessibleNames);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <SuccessionArchiveShell
    activeId="reader"
    routeParams={routeParams}
    spoilerLimit={spoilerLimit}
    onSpoilerChange={onSpoilerChange}
    onNavigate={onNavigate}
    onExitArchive={onExitArchive}
    onOpenSearch={onOpenSearch}
    onIntent={onIntent}
  >
    <section ref={readerSectionRef} className="succession-reader-command" aria-label="Succession Contest manga reader">
      <Suspense fallback={<ReaderLoadingState />}>
        <SuccessionChapterReader
          requestedChapter={routeParams.chapter}
          requestedPage={routeParams.page}
          requestedMode={routeParams.mode}
          requestedFit={routeParams.fit}
          requestedDirection={routeParams.direction}
          requestedPanel={routeParams.panel}
          onNavigate={navigateReader}
          onExitArchive={() => onNavigate('archive')}
          onOpenChapterRecord={(chapter) => onNavigate('chapters', {
            entity: `chapter:${chapter}`,
            chapter,
          })}
        />
      </Suspense>
    </section>
  </SuccessionArchiveShell>;
}
