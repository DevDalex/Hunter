import { lazy, Suspense } from 'react';
import SuccessionArchiveShell from './SuccessionArchiveShell';

const SuccessionChapterReader = lazy(() => import('../SuccessionChapterReader'));

function ReaderLoadingState() {
  return <div className="succession-reader-command__loading" role="status" aria-live="polite">
    <span>Reader module</span>
    <strong>Opening chapter workspace…</strong>
  </div>;
}

export default function SuccessionArchiveReaderRoute({
  routeParams = {},
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
  onExitArchive,
  onOpenSearch,
  onIntent,
}) {
  const navigateReader = (patch = {}) => onNavigate('reader', patch);

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
    <section className="succession-reader-command" aria-label="Succession Contest manga reader">
      <h1 className="sr-only">Succession Contest manga reader</h1>
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
