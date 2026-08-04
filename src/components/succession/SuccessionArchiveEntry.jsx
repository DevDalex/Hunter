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
import './SuccessionProductExperience.css';
import './SuccessionResearchTools.css';
import SuccessionArchiveContextBar from './SuccessionArchiveContextBar';
import SuccessionArchiveOnboarding from './SuccessionArchiveOnboarding';
import SuccessionIntelligencePanels from './SuccessionIntelligencePanels';
import SuccessionResearchTools from './SuccessionResearchTools';
import SuccessionSavedResearch from './SuccessionSavedResearch';

const SuccessionArchiveApp = lazy(() => import('./SuccessionArchiveApp'));
const SuccessionArchiveReaderRoute = lazy(() => import('./SuccessionArchiveReaderRoute'));
const SuccessionArchiveLightRoute = lazy(() => import('./SuccessionArchiveLightRoute'));

function ArchiveRouteLoading() {
  return <div className="route-loading succession-route-loading" role="status" aria-live="polite">Opening Succession workspace…</div>;
}

export default function SuccessionArchiveEntry(props) {
  const isReader = props.routeTarget === 'reader';
  const isLightRoute = props.routeTarget === 'black-whale' || props.routeTarget === 'princes';
  const isArchiveEntry = props.routeTarget === 'archive';

  if (isArchiveEntry) return <>
    <SuccessionArchiveContextBar
      spoilerLimit={props.spoilerLimit}
      activeDomain="story"
      onSpoilerChange={props.onSpoilerChange}
    />
    <SuccessionArchiveOnboarding
      spoilerLimit={props.spoilerLimit}
      onNavigate={props.onNavigate}
      onOpenSearch={props.onOpenSearch}
    />
  </>;

  return <>
    <SuccessionArchiveContextBar
      spoilerLimit={props.spoilerLimit}
      activeDomain={props.routeTarget}
      onSpoilerChange={props.onSpoilerChange}
    />
    <SuccessionSavedResearch onNavigate={props.onNavigate} />
    <Suspense fallback={<ArchiveRouteLoading />}>
      {isReader
        ? <SuccessionArchiveReaderRoute {...props} />
        : isLightRoute
          ? <SuccessionArchiveLightRoute {...props} />
          : <SuccessionArchiveApp {...props} />}
    </Suspense>
    {!isReader && <>
      <SuccessionIntelligencePanels spoilerLimit={props.spoilerLimit} />
      <SuccessionResearchTools
        routeId={props.routeTarget}
        routeParams={props.routeParams}
        spoilerLimit={props.spoilerLimit}
        onNavigate={props.onNavigate}
      />
    </>}
  </>;
}
