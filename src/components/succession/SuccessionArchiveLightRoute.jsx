import { lazy, Suspense, useEffect, useState } from 'react';
import SuccessionArchiveShell from './SuccessionArchiveShell';
import SuccessionWorkspaceRefinementDeck from './SuccessionWorkspaceRefinementDeck';
import './SuccessionArchiveSearch.css';

const PrincesWorkspace = lazy(() => import('./SuccessionArchiveWorkspaces').then((module) => ({ default: module.PrincesWorkspace })));
const FamilyTree = lazy(() => import('../FamilyTreeDeferred'));
const BlackWhaleGuide = lazy(() => import('../BlackWhaleGuideDeferred'));

function LightWorkspaceLoading({ label }) {
  return <div className="route-loading succession-route-loading" role="status" aria-live="polite">Opening {label}…</div>;
}

function useDesktopRefinementSurface() {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined'
    && window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const query = window.matchMedia('(min-width: 1024px)');
    const update = (event) => setMatches(event.matches);
    setMatches(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return matches;
}

export default function SuccessionArchiveLightRoute({
  routeTarget,
  routeParams = {},
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
  onExitArchive,
  onOpenSearch,
  onIntent,
}) {
  const treeView = routeTarget === 'princes' && routeParams.view === 'tree';
  const blackWhale = routeTarget === 'black-whale';
  const desktopRefinementSurface = useDesktopRefinementSurface();

  return <SuccessionArchiveShell
    activeId={routeTarget}
    routeParams={routeParams}
    spoilerLimit={spoilerLimit}
    onSpoilerChange={onSpoilerChange}
    onNavigate={onNavigate}
    onExitArchive={onExitArchive}
    onOpenSearch={onOpenSearch}
    onIntent={onIntent}
  >
    {blackWhale && desktopRefinementSurface && <SuccessionWorkspaceRefinementDeck
      routeId="black-whale"
      routeParams={routeParams}
      spoilerLimit={spoilerLimit}
      onNavigate={onNavigate}
    />}

    {blackWhale && <Suspense fallback={<LightWorkspaceLoading label="Black Whale atlas" />}>
      <BlackWhaleGuide
        initialQuery={routeParams.room || ''}
        initialLocationId={routeParams.entity || ''}
        spoilerLimit={spoilerLimit}
        onOpenWorldMap={(params = {}) => onNavigate('locations', params)}
        onOpenCanonicalLocation={(params) => onNavigate('locations', params)}
      />
    </Suspense>}

    {treeView && <Suspense fallback={<LightWorkspaceLoading label="royal family hierarchy" />}>
      <div className="succession-royal-hierarchy-workspace">
        <h1 className="sr-only">Kakin Royal Family</h1>
        <FamilyTree
          spoilerLimit={spoilerLimit}
          onOpenPrince={(order) => onNavigate('princes', { prince: order })}
        />
      </div>
    </Suspense>}

    {routeTarget === 'princes' && !treeView && <Suspense fallback={<LightWorkspaceLoading label="Royal Family" />}>
      <PrincesWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />
    </Suspense>}
  </SuccessionArchiveShell>;
}
