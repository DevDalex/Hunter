import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildSuccessionExplorerModel } from '../../data/succession/explorerModel';
import {
  BlackWhaleDeckInstrument,
  NenInteractionInstrument,
  PerspectiveKnowledgeMapInstrument,
  TimelineCartographyInstrument,
} from './SuccessionExplorerAdvancedInstruments';
import {
  NenInteractionGraphInstrument,
  TimelineCausalityGraphInstrument,
} from './SuccessionExplorerGraphInstruments';
import SuccessionExplorerGuidedTour from './SuccessionExplorerGuidedTour';
import SuccessionExplorerRoutePanels from './SuccessionExplorerRoutePanels';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import SuccessionExplorerWorkbench from './SuccessionExplorerWorkbench';
import SuccessionPerspectiveFogOverlay from './SuccessionPerspectiveFogOverlay';

const timelineCartographyViews = new Set(['atlas', 'braid', 'matrix', 'heatmap', 'playback']);
const nenLaboratoryViews = new Set(['interactions', 'conditions', 'threat', 'hypotheses']);

export default function SuccessionExplorerRoutePanelHost({ routeId, spoilerLimit, onNavigate }) {
  const explorer = useSuccessionExplorer();
  const [portalTarget, setPortalTarget] = useState(null);
  const view = explorer.getRouteView(routeId);
  const lens = explorer.getRouteLens(routeId);

  useEffect(() => {
    let frame = null;
    let attempts = 0;
    const resolve = () => {
      const target = document.querySelector(`.succession-explorer-surface[data-explorer-route="${routeId}"]`);
      if (target) {
        setPortalTarget(target);
        return;
      }
      attempts += 1;
      if (attempts < 20) frame = window.requestAnimationFrame(resolve);
    };
    resolve();
    return () => { if (frame) window.cancelAnimationFrame(frame); };
  }, [routeId]);

  const model = useMemo(() => buildSuccessionExplorerModel({
    routeId,
    chapter: explorer.chapter,
    view,
    lens,
    depth: explorer.depth,
    filters: explorer.filters,
  }), [explorer.chapter, explorer.depth, explorer.filters, lens, routeId, view]);
  const selectedNode = useMemo(() => {
    const selectedEntityId = explorer.selectedIds[0];
    return selectedEntityId ? model.nodes.find((item) => item.entityId === selectedEntityId) || null : null;
  }, [explorer.selectedIds, model.nodes]);

  if (!portalTarget) return null;
  return createPortal(<>
    <SuccessionPerspectiveFogOverlay routeId={routeId} model={model} />
    {explorer.perspective !== 'reader' && <PerspectiveKnowledgeMapInstrument chapter={explorer.chapter} />}
    {routeId === 'archive' && view === 'world' && <SuccessionExplorerWorkbench onNavigate={onNavigate} />}
    {routeId === 'story' && view === 'guided' && <SuccessionExplorerGuidedTour routeId={routeId} model={model} />}
    {routeId === 'story' && view === 'causality' && <TimelineCausalityGraphInstrument chapter={explorer.chapter} />}
    {routeId === 'timeline' && timelineCartographyViews.has(view) && <TimelineCartographyInstrument chapter={explorer.chapter} view={view} />}
    {routeId === 'timeline' && view === 'causality' && <TimelineCausalityGraphInstrument chapter={explorer.chapter} />}
    {routeId === 'black-whale' && <BlackWhaleDeckInstrument chapter={explorer.chapter} view={view} onNavigate={onNavigate} />}
    {routeId === 'nen' && view === 'interactions' && <NenInteractionGraphInstrument chapter={explorer.chapter} />}
    {routeId === 'nen' && nenLaboratoryViews.has(view) && <NenInteractionInstrument chapter={explorer.chapter} view={view} onNavigate={onNavigate} />}
    <SuccessionExplorerRoutePanels
      routeId={routeId}
      view={view}
      model={model}
      selectedNode={selectedNode}
      chapter={explorer.chapter}
      spoilerLimit={spoilerLimit}
      compareIds={explorer.compareIds}
      explorer={explorer}
      onNavigate={onNavigate}
    />
  </>, portalTarget);
}
