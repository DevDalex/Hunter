import { useMemo } from 'react';
import { GitBranch, Orbit } from 'lucide-react';
import {
  getAbilityInteractionMatrix,
  getEntityById,
  getStoryCausalGraphAtChapter,
} from '../../data/succession/successionData';
import SuccessionExplorerCanvas from './SuccessionExplorerCanvas';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerGraphInstruments.css';

const safe = (factory, fallback) => {
  try { return factory(); } catch { return fallback; }
};
const label = (entity) => entity?.name || entity?.title || entity?.label || entity?.id || 'Unknown';
const hash = (value) => {
  let result = 2166136261;
  for (const character of String(value || '')) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};
const chapterOf = (entity) => Number(entity?.chapterRange?.start || entity?.chapter || entity?.firstChapter || 340) || 340;

function GraphFrame({ eyebrow, title, description, icon: Icon, stats, children }) {
  return <section className="succession-explorer-graph-instrument">
    <header><div><span>{eyebrow}</span><h3><Icon size={18} /> {title}</h3><p>{description}</p></div><dl>{stats.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></header>
    {children}
  </section>;
}

export function TimelineCausalityGraphInstrument({ chapter }) {
  const explorer = useSuccessionExplorer();
  const graph = useMemo(() => safe(() => getStoryCausalGraphAtChapter(chapter), { nodes: [], edges: [] }) || { nodes: [], edges: [] }, [chapter]);
  const model = useMemo(() => {
    const records = graph.nodes || [];
    const minChapter = Math.min(340, ...records.map(chapterOf));
    const span = Math.max(1, chapter - minChapter);
    const nodes = records.map((record, index) => {
      const entity = getEntityById(record.id) || record;
      const currentChapter = chapterOf(entity);
      const lane = hash(entity.id) % 7;
      return {
        id: entity.id,
        entityId: entity.id,
        label: label(entity),
        subtitle: entity.summary || '',
        kind: 'event',
        group: `Causal lane ${lane + 1}`,
        chapter: currentChapter,
        x: 150 + ((currentChapter - minChapter) / span) * 2050,
        y: 140 + lane * 145 + ((index % 3) - 1) * 20,
        importance: 2.1,
        searchText: `${label(entity)} ${entity.summary || ''}`.toLowerCase(),
        meta: { chapter: currentChapter },
      };
    });
    const visible = new Set(nodes.map((node) => node.id));
    const edges = (graph.edges || []).filter((link) => visible.has(link.sourceEventId) && visible.has(link.targetEventId)).map((link) => ({
      id: link.id,
      source: link.sourceEventId,
      target: link.targetEventId,
      kind: 'causes',
      label: link.causalType || link.linkType || link.relationshipType || 'causal link',
      directed: true,
      strength: /direct/i.test(String(link.causalType || link.linkType || '')) ? 2 : 1.2,
      meta: { certainty: link.certainty || link.evidenceState || 'confirmed' },
    }));
    return { nodes, edges, groups: [], world: { width: 2400, height: 1200 }, stats: { visible: nodes.length, total: nodes.length, label: 'causal events' } };
  }, [chapter, graph]);
  const cameraKey = 'timeline-causality';
  const selected = explorer.selectedIds[0] || null;
  return <GraphFrame eyebrow="Causal topology" title="Free-moving consequence graph" description="Only canonical story-causal links are edges here. Horizontal position follows chapter order; vertical separation exists for legibility and does not imply an invented category." icon={GitBranch} stats={[["Events", model.nodes.length], ["Causal links", model.edges.length], ["Boundary", `Ch. ${chapter}`]]}>
    <div className="succession-explorer-graph-instrument__canvas">
      <SuccessionExplorerCanvas
        model={model}
        selectedId={selected}
        onSelect={(node) => node.entityId && explorer.selectEntity(node.entityId, { routeId: 'timeline', chapter, label: node.label })}
        initialCamera={explorer.cameras[cameraKey] || null}
        onCameraChange={(camera) => explorer.setCamera(cameraKey, camera)}
      />
    </div>
  </GraphFrame>;
}

export function NenInteractionGraphInstrument({ chapter }) {
  const explorer = useSuccessionExplorer();
  const selectedId = explorer.selectedIds.find((id) => getEntityById(id)?.entityType === 'ability') || null;
  const matrix = useMemo(() => safe(() => getAbilityInteractionMatrix(chapter, { ...(selectedId ? { entityId: selectedId } : {}), limit: 90 }), { records: [] }), [chapter, selectedId]);
  const pairs = matrix.records || matrix.pairs || matrix.interactions || matrix.rows || [];
  const model = useMemo(() => {
    const abilityMap = new Map();
    for (const pair of pairs) for (const compact of [pair.left, pair.right]) {
      const ability = getEntityById(compact?.id) || compact;
      if (ability?.id) abilityMap.set(ability.id, ability);
    }
    const records = [...abilityMap.values()];
    const centerX = 1000;
    const centerY = 620;
    const nodes = records.map((ability, index) => {
      const focused = ability.id === selectedId;
      const angle = (index / Math.max(1, records.length)) * Math.PI * 2 - Math.PI / 2;
      const radius = focused ? 0 : 300 + (index % 4) * 78;
      return {
        id: ability.id,
        entityId: ability.id,
        label: label(ability),
        subtitle: ability.summary || ability.category || '',
        kind: 'ability',
        group: ability.category || ability.classification?.nenTypes?.[0] || 'unknown',
        chapter: chapterOf(ability),
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        importance: focused ? 4 : pairImportance(ability.id, pairs),
        searchText: `${label(ability)} ${ability.summary || ''} ${ability.category || ''}`.toLowerCase(),
        meta: { category: ability.category, certainty: ability.classification?.certainty },
      };
    });
    const edges = pairs.map((pair) => ({
      id: pair.id,
      source: pair.left.id,
      target: pair.right.id,
      kind: pair.directInteractionClaimed ? 'causes' : 'supports',
      label: pair.directInteractionClaimed ? 'documented same-event context' : pair.basis,
      directed: false,
      strength: pair.directInteractionClaimed ? 2.4 : pair.sharedEvents?.length ? 1.8 : 1,
      meta: { directInteractionClaimed: pair.directInteractionClaimed, evidenceStrength: pair.evidenceStrength },
    }));
    return { nodes, edges, groups: [], world: { width: 2000, height: 1250 }, stats: { visible: nodes.length, total: nodes.length, label: 'Nen abilities' } };
  }, [pairs, selectedId]);
  const direct = pairs.filter((pair) => pair.directInteractionClaimed).length;
  const cameraKey = 'nen-interactions';
  return <GraphFrame eyebrow="Nen topology" title={selectedId ? `${label(getEntityById(selectedId))} interaction graph` : 'Ability interaction context graph'} description="Gold-strength edges are selector-confirmed same-event contexts. Muted edges are structural overlap only. The graph never converts co-location or shared mechanics into proof that two abilities directly interacted." icon={Orbit} stats={[["Abilities", model.nodes.length], ["Contexts", model.edges.length], ["Direct", direct]]}>
    <div className="succession-explorer-graph-instrument__canvas">
      <SuccessionExplorerCanvas
        model={model}
        selectedId={selectedId}
        onSelect={(node) => node.entityId && explorer.selectEntity(node.entityId, { routeId: 'nen', chapter, label: node.label })}
        initialCamera={explorer.cameras[cameraKey] || null}
        onCameraChange={(camera) => explorer.setCamera(cameraKey, camera)}
      />
    </div>
  </GraphFrame>;
}

function pairImportance(id, pairs) {
  const connections = pairs.filter((pair) => pair.left?.id === id || pair.right?.id === id);
  const direct = connections.filter((pair) => pair.directInteractionClaimed).length;
  return Math.min(3.2, 1.2 + direct * .45 + connections.length * .08);
}
