import { lazy, Suspense, useEffect, useRef } from 'react';
import SuccessionArchiveShell from './SuccessionArchiveShell';

const SuccessionChapterReader = lazy(() => import('../SuccessionChapterReader'));

function ReaderLoadingState() {
  return <div className="succession-reader-command__loading" role="status" aria-live="polite">
    <span>Reader module</span>
    <strong>Opening chapter workspace…</strong>
  </div>;
}

const applyReaderControlNames = (root) => {
  if (!root) return;
  const chapterTrigger = root.querySelector('.succession-reader__chapter-trigger');
  if (chapterTrigger) chapterTrigger.setAttribute('aria-label', 'Open chapter drawer');

  const previous = root.querySelector('.succession-reader__bottombar > button[type="button"]');
  if (previous) previous.setAttribute('aria-label', previous.textContent?.trim() || 'Previous page or chapter');

  const next = root.querySelector('.succession-reader__bottom-actions > button[type="button"]:last-child');
  if (next) next.setAttribute('aria-label', next.textContent?.trim() || 'Next page or chapter');
};

export default function SuccessionArchiveReaderRoute({
  routeParams = {},
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
  onExitArchive,
  onOpenSearch,
  onIntent,
}) {
  const readerRootRef = useRef(null);
  const navigateReader = (patch = {}) => onNavigate('reader', patch);

  useEffect(() => {
    const root = readerRootRef.current;
    if (!root) return undefined;
    applyReaderControlNames(root);
    const observer = new MutationObserver(() => applyReaderControlNames(root));
    observer.observe(root, { childList: true, subtree: true, characterData: true });
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
    <section ref={readerRootRef} className="succession-reader-command" aria-label="Succession Contest manga reader">
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
