import { lazy, Suspense } from 'react';
import '../../styles/succession-archive.css';
import './SuccessionArchiveContrast.css';
import './SuccessionArchiveLayoutFixes.css';
import './SuccessionArchiveCatalog.css';
import './SuccessionBlackWhaleTheme.css';
import './SuccessionCommandHome.css';
import './SuccessionOperationalWorkspaces.css';
import './SuccessionRoyalRegistry.css';
import './SuccessionVesselAtlas.css';
import './SuccessionNenContainment.css';
import './SuccessionIntelligenceOperations.css';
import './SuccessionTimelineCommand.css';
import './SuccessionResearchLibrary.css';
import './SuccessionReaderCommand.css';
import './SuccessionAccessibilityClosure.css';
import './SuccessionBrowserQaClosure.css';
import './SuccessionBrowserQaClosureFinal.css';
import './SuccessionExactContrastClosure.css';
import './SuccessionPhase2DesignSystem.css';
import './SuccessionArchitectureCenteringFix.css';
import './SuccessionArchitectureViewportRuntime.js';
import './SuccessionArchitectureVisualRevision.css';
import './SuccessionPhase2PresentationConsistency.css';
import './SuccessionFinalReleasePatch.css';
import './SuccessionFinalContrastClosure.css';
import SuccessionCommandHome from './SuccessionCommandHome';
import SuccessionContextualCompletion from './SuccessionContextualCompletion';
import SuccessionContextualReferenceExpansion from './SuccessionContextualReferenceExpansion';

const SuccessionArchiveApp = lazy(() => import('./SuccessionArchiveApp'));
const SuccessionArchiveReaderRoute = lazy(() => import('./SuccessionArchiveReaderRoute'));
const SuccessionArchiveLightRoute = lazy(() => import('./SuccessionArchiveLightRoute'));

function ArchiveRouteLoading() {
  return <div className="route-loading succession-route-loading" role="status" aria-live="polite">Opening Succession workspace…</div>;
}

export default function SuccessionArchiveEntry(props) {
  const isCommandHome = props.routeTarget === 'archive'
    || (props.routeTarget === 'story' && Object.keys(props.routeParams || {}).length === 0);
  const isReader = props.routeTarget === 'reader';
  const isLightRoute = props.routeTarget === 'black-whale' || props.routeTarget === 'princes';
  const entityChapter = Number(String(props.routeParams?.entity || '').match(/^chapter:(\d+)$/)?.[1]);
  const contextualRouteParams = props.routeTarget === 'chapters' && !props.routeParams?.chapter && entityChapter
    ? { ...props.routeParams, chapter: entityChapter }
    : props.routeParams;

  if (isCommandHome) {
    return <SuccessionCommandHome
      spoilerLimit={props.spoilerLimit}
      onNavigate={props.onNavigate}
      onOpenSearch={props.onOpenSearch}
    />;
  }

  return <Suspense fallback={<ArchiveRouteLoading />}>
    <>
      {isReader
        ? <SuccessionArchiveReaderRoute {...props} />
        : isLightRoute
          ? <SuccessionArchiveLightRoute {...props} />
          : <SuccessionArchiveApp {...props} />}
      <SuccessionContextualCompletion
        routeTarget={props.routeTarget}
        routeParams={contextualRouteParams}
        spoilerLimit={props.spoilerLimit}
        onNavigate={props.onNavigate}
      />
      <SuccessionContextualReferenceExpansion
        routeTarget={props.routeTarget}
        routeParams={contextualRouteParams}
        spoilerLimit={props.spoilerLimit}
      />
    </>
  </Suspense>;
}
