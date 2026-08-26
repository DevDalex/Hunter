import { useMemo } from 'react';
import { Clock3, MapPin, Network, Orbit } from 'lucide-react';
import { buildSuccessionExplorerModel } from '../../data/succession/explorerModel';
import SuccessionExplorerCanvas from './SuccessionExplorerCanvas';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerWorkbench.css';

const panes = Object.freeze([
  { routeId: 'timeline', title: 'Time', subtitle: 'Temporal Atlas', icon: Clock3, lens: 'story' },
  { routeId: 'black-whale', title: 'Space', subtitle: 'Living Ship', icon: MapPin, lens: 'tiers' },
  { routeId: 'relationships', title: 'Network', subtitle: 'Living Social Graph', icon: Network, lens: 'type' },
  { routeId: 'nen', title: 'Systems', subtitle: 'Nen Laboratory', icon: Orbit, lens: 'system' },
]);

function WorkbenchPane({ pane, explorer, onNavigate }) {
  const model = useMemo(() => buildSuccessionExplorerModel({
    routeId: pane.routeId,
    chapter: explorer.chapter,
    view: explorer.getRouteView(pane.routeId),
    lens: explorer.getRouteLens(pane.routeId) || pane.lens,
    depth: explorer.depth,
    filters: explorer.filters,
  }), [explorer.chapter, explorer.depth, explorer.filters, explorer.getRouteLens, explorer.getRouteView, pane.lens, pane.routeId]);
  const selectedEntityId = explorer.selectedIds[0] || null;
  const selectedNode = selectedEntityId ? model.nodes.find((item) => item.entityId === selectedEntityId) : null;
  const Icon = pane.icon;
  return <section className="succession-explorer-workbench__pane" data-workbench-route={pane.routeId}>
    <header>
      <div><Icon size={15} aria-hidden="true" /><span>{pane.title}</span><strong>{pane.subtitle}</strong></div>
      <button type="button" onClick={() => onNavigate(pane.routeId, explorer.buildDeepLinkParams(pane.routeId))}>Open</button>
    </header>
    <SuccessionExplorerCanvas
      className="succession-explorer-canvas--workbench"
      model={model}
      selectedId={selectedNode?.id || selectedEntityId}
      initialCamera={explorer.cameras[`workbench:${pane.routeId}`] || null}
      onCameraChange={(camera) => explorer.setCamera(`workbench:${pane.routeId}`, camera)}
      onSelect={(node) => {
        if (node.entityId) explorer.selectEntity(node.entityId, { routeId: pane.routeId, chapter: explorer.chapter, label: node.label });
      }}
    />
  </section>;
}

export default function SuccessionExplorerWorkbench({ onNavigate }) {
  const explorer = useSuccessionExplorer();
  return <section className="succession-explorer-workbench">
    <header className="succession-explorer-workbench__header">
      <div><span>Synchronized multi-view</span><h3>One chapter. Four instruments.</h3><p>Select an entity in any pane and the shared Explorer selection changes everywhere. The time machine, semantic depth, filters, watchlist, and comparison context remain shared.</p></div>
      <dl><div><dt>Chapter</dt><dd>{explorer.chapter}</dd></div><div><dt>Depth</dt><dd>{explorer.depth}</dd></div><div><dt>Perspective</dt><dd>{explorer.perspective === 'reader' ? 'Reader' : 'Character'}</dd></div></dl>
    </header>
    <div className="succession-explorer-workbench__grid">{panes.map((pane) => <WorkbenchPane pane={pane} explorer={explorer} onNavigate={onNavigate} key={pane.routeId} />)}</div>
  </section>;
}
