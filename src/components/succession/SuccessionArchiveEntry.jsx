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
import './SuccessionFinalReleasePatch.css';
import './SuccessionExactContrastClosure.css';
import './SuccessionPhase2DesignSystem.css';
import './SuccessionArchitectureCenteringFix.css';
import './SuccessionArchitectureViewportRuntime.js';
import './SuccessionArchitectureVisualRevision.css';
import './SuccessionPhase2PresentationConsistency.css';

const SuccessionArchiveApp = lazy(() => import('./SuccessionArchiveApp'));
const SuccessionArchiveReaderRoute = lazy(() => import('./SuccessionArchiveReaderRoute'));
const SuccessionArchiveLightRoute = lazy(() => import('./SuccessionArchiveLightRoute'));

function ArchiveRouteLoading() {
  return <div className="route-loading succession-route-loading" role="status" aria-live="polite">Opening Succession workspace…</div>;
}

export default function SuccessionArchiveEntry(props) {
  const isReader = props.routeTarget === 'reader';
  const isLightRoute = props.routeTarget === 'black-whale' || props.routeTarget === 'princes';

  return <Suspense fallback={<ArchiveRouteLoading />}>
    {isReader
      ? <SuccessionArchiveReaderRoute {...props} />
      : isLightRoute
        ? <SuccessionArchiveLightRoute {...props} />
        : <SuccessionArchiveApp {...props} />}
  </Suspense>;
}
