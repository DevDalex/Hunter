import { useMemo } from 'react';
import { buildSuccessionExplorerModel } from '../../data/succession/explorerModel';
import SuccessionExplorerRoutePanels from './SuccessionExplorerRoutePanels';
import { useSuccessionExplorer } from './SuccessionExplorerState';

export default function SuccessionExplorerRoutePanelHost({ routeId, spoilerLimit, onNavigate }) {
  const explorer = useSuccessionExplorer();
  const view = explorer.getRouteView(routeId);
  const lens = explorer.getRouteLens(routeId);
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

  return <SuccessionExplorerRoutePanels
    routeId={routeId}
    view={view}
    model={model}
    selectedNode={selectedNode}
    chapter={explorer.chapter}
    spoilerLimit={spoilerLimit}
    compareIds={explorer.compareIds}
    explorer={explorer}
    onNavigate={onNavigate}
  />;
}
