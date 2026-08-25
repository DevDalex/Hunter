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
import '../../styles/visual-reboot.css';
import './SuccessionVisualRebootLate.css';
import './SuccessionRouteVisualTuning.css';
import './SuccessionChromeFinal.css';
import SuccessionCommandHome from './SuccessionCommandHome';
import { SuccessionExplorerProvider } from './SuccessionExplorerState';

const SuccessionArchiveApp = lazy(() => import('./SuccessionArchiveApp'));
const SuccessionArchiveReaderRoute = lazy(() => import('./SuccessionArchiveReaderRoute'));
const SuccessionArchiveLightRoute = lazy(() => import('./SuccessionArchiveLightRoute'));
const SuccessionExplorerSurface = lazy(() => import('./SuccessionExplorerSurface'));
const SuccessionExplorerRoutePanelHost = lazy(() => import('./SuccessionExplorerRoutePanelHost'));

function ArchiveRouteLoading() {
  return <div className="route-loading succession-route-loading" role="status" aria-live="polite">Opening Succession workspace…</div>;
}

export default function SuccessionArchiveEntry(props) {
  const isCommandHome = props.routeTarget === 'archive'
    || (props.routeTarget === 'story' && Object.keys(props.routeParams || {}).length === 0);
  const isReader = props.routeTarget === 'reader';
  const isLightRoute = props.routeTarget === 'black-whale' || props.routeTarget === 'princes';

  if (isCommandHome) {
    return <SuccessionExplorerProvider spoilerLimit={props.spoilerLimit}>
      <SuccessionCommandHome
        spoilerLimit={props.spoilerLimit}
        onNavigate={props.onNavigate}
        onOpenSearch={props.onOpenSearch}
      />
      <Suspense fallback={null}>
        <div className="succession-command-explorer-wrap">
          <SuccessionExplorerSurface
            routeId="archive"
            routeParams={props.routeParams || {}}
            spoilerLimit={props.spoilerLimit}
            onNavigate={props.onNavigate}
          />
        </div>
        <SuccessionExplorerRoutePanelHost
          routeId="archive"
          spoilerLimit={props.spoilerLimit}
          onNavigate={props.onNavigate}
        />
      </Suspense>
    </SuccessionExplorerProvider>;
  }

  return <SuccessionExplorerProvider spoilerLimit={props.spoilerLimit}>
    <Suspense fallback={<ArchiveRouteLoading />}>
      {isReader
        ? <SuccessionArchiveReaderRoute {...props} />
        : isLightRoute
          ? <SuccessionArchiveLightRoute {...props} />
          : <SuccessionArchiveApp {...props} />}
      <SuccessionExplorerRoutePanelHost
        routeId={props.routeTarget}
        spoilerLimit={props.spoilerLimit}
        onNavigate={props.onNavigate}
      />
    </Suspense>
  </SuccessionExplorerProvider>;
}
