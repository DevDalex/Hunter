import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  GitCompareArrows,
  Layers3,
  ListFilter,
  Map,
  Network,
  NotebookPen,
  Pause,
  Play,
  Search,
  Star,
  X,
} from 'lucide-react';
import { routeToHref } from '../../lib/appRouter';
import {
  getAssignmentSnapshot,
  getChapterStateDiff,
  getChapterWhatChanged,
  getCharacterDossier,
  getEntitiesByType,
  getEntityById,
  getGuardianBeastDossier,
  getKnowledgeMatrix,
  getLocationSnapshot,
  getNenSystemDossier,
  getOrganizationDossier,
  getRelationshipNeighborhood,
} from '../../data/succession/successionData';
import {
  getSuccessionExplorerProfile,
  successionExplorerDepthLevels,
} from '../../data/succession/explorerCapabilities';
import { buildSuccessionExplorerModel } from '../../data/succession/explorerModel';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import SuccessionExplorerCanvas from './SuccessionExplorerCanvas';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerSurface.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const compactText = (value, max = 160) => {
  const string = String(value || '');
  return string.length > max ? `${string.slice(0, max - 1)}…` : string;
};
const safe = (factory, fallback = null) => {
  try { return factory(); } catch { return fallback; }
};
const entityLabel = (entity) => entity?.name || entity?.title || entity?.term || entity?.id || 'Unknown record';
const arrays = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
const renderValue = (value) => {
  if (Array.isArray(value)) return value.map((item) => typeof item === 'object' ? entityLabel(item) : String(item)).join(' · ') || 'None';
  if (value && typeof value === 'object') return Object.entries(value).slice(0, 5).map(([key, item]) => `${labelize(key)}: ${typeof item === 'object' ? 'record' : String(item)}`).join(' · ');
  return String(value ?? 'Unknown');
};

function ExplorerStat({ label, value }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

function PerspectiveControl({ value, onChange, chapter }) {
  const characters = useMemo(() => getEntitiesByType('character')
    .filter((character) => !character.firstChapter || character.firstChapter <= chapter)
    .sort((left, right) => entityLabel(left).localeCompare(entityLabel(right))), [chapter]);
  return <label className="succession-explorer-control succession-explorer-control--perspective">
    <span><Eye size={13} aria-hidden="true" /> Perspective</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="reader">Reader / full chapter-safe archive</option>
      {characters.map((character) => <option value={character.id} key={character.id}>{entityLabel(character)}</option>)}
    </select>
  </label>;
}

function SelectedInspector({ node, chapter, onNavigate, onCompare, onWatch, note, onNote }) {
  if (!node) return <aside className="succession-explorer-inspector is-empty">
    <span>Selection inspector</span>
    <h3>Select a point in the world</h3>
    <p>Click a node to pin its record here. Double-click a point to focus the camera around it.</p>
  </aside>;

  const entity = node.entityId ? getEntityById(node.entityId) : null;
  const route = entity ? entityWorkspaceTarget(entity) : null;
  let dossier = null;
  if (entity?.entityType === 'character') dossier = safe(() => getCharacterDossier(entity.id, chapter));
  else if (entity?.entityType === 'organization') dossier = safe(() => getOrganizationDossier(entity.id, chapter));
  else if (entity?.entityType === 'location') dossier = safe(() => getLocationSnapshot(entity.id, chapter));
  else if (entity?.entityType === 'ability') dossier = safe(() => getNenSystemDossier(entity.id, chapter)) || safe(() => getNenSystemDossier(entity.category, chapter));
  else if (entity?.entityType === 'guardian-beast') dossier = safe(() => getGuardianBeastDossier(entity.id, chapter));
  else if (entity?.entityType === 'relationship') dossier = safe(() => getRelationshipNeighborhood(entity.sourceEntityId, chapter));
  else if (entity?.entityType === 'assignment') dossier = safe(() => getAssignmentSnapshot(entity.personId || entity.subjectEntityId || entity.principalEntityId, chapter));
  else if (entity?.entityType === 'chapter') dossier = safe(() => getChapterWhatChanged(entity.number || chapter));

  const facts = [];
  if (entity?.entityType === 'ability') {
    facts.push(['Category', entity.category || 'Unknown']);
    facts.push(['Nen type', entity.classification?.nenTypes || ['Unknown']]);
    facts.push(['Activation', entity.activation || 'Unresolved']);
    facts.push(['Conditions', entity.conditions || []]);
    facts.push(['Limits', entity.limitations || []]);
    facts.push(['Cost', entity.costs || []]);
  } else if (entity?.entityType === 'character') {
    facts.push(['Roles', entity.roles || []]);
    facts.push(['Life state', dossier?.currentState?.life || dossier?.state?.life || entity.status?.life || 'Unknown']);
    facts.push(['Location', getEntityById(dossier?.currentState?.locationId || dossier?.state?.locationId)?.name || 'Unknown']);
    facts.push(['Affiliations', (entity.affiliationIds || []).map((id) => entityLabel(getEntityById(id)))]);
  } else if (entity?.entityType === 'location') {
    facts.push(['Occupants', dossier?.occupants?.map((entry) => entityLabel(entry.entity)) || []]);
    facts.push(['Events', dossier?.events?.length || 0]);
    facts.push(['Assignments', dossier?.assignments?.length || 0]);
    facts.push(['Nen systems', dossier?.abilities?.map(entityLabel) || []]);
  } else if (entity?.entityType === 'organization') {
    facts.push(['Type', entity.organizationType || 'Unknown']);
    facts.push(['Personnel', dossier?.members?.length || dossier?.personnel?.length || 0]);
    facts.push(['Objectives', dossier?.objectives || entity.objectives || []]);
  } else if (entity?.entityType === 'chapter') {
    facts.push(['Chapter', entity.number]);
    facts.push(['Events', dossier?.eventIds?.length || entity.eventIds?.length || 0]);
    facts.push(['People', dossier?.participantIds?.length || 0]);
    facts.push(['Nen', dossier?.abilityIds?.length || entity.abilityIds?.length || 0]);
  }

  return <aside className="succession-explorer-inspector">
    <header>
      <div><span>{entity ? labelize(entity.entityType) : `Chapter ${node.chapter}`}</span><h3>{entityLabel(entity) || node.label}</h3></div>
      <small>Ch. {node.chapter || chapter}</small>
    </header>
    <p>{compactText(entity?.summary || node.subtitle || 'Archive point selected.', 280)}</p>
    {!!facts.length && <dl>{facts.slice(0, 6).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{renderValue(value)}</dd></div>)}</dl>}
    {!entity && Object.keys(node.meta || {}).length > 0 && <dl>{Object.entries(node.meta).slice(0, 6).map(([key, value]) => <div key={key}><dt>{labelize(key)}</dt><dd>{renderValue(value)}</dd></div>)}</dl>}
    <div className="succession-explorer-inspector__actions">
      {entity && <button type="button" onClick={() => onNavigate(route, { entity: entity.id, chapter })}>Open full record</button>}
      {entity && <button type="button" onClick={() => onCompare(entity.id)}><GitCompareArrows size={13} /> Compare</button>}
      {entity && <button type="button" onClick={() => onWatch(entity.id)}><Star size={13} /> Watch</button>}
    </div>
    <label className="succession-explorer-note"><NotebookPen size={13} /><span>Research note</span><textarea value={note || ''} onChange={(event) => onNote(event.target.value)} placeholder="Your local note for this record…" /></label>
  </aside>;
}

function CompareTray({ ids, onRemove, onClear, onNavigate }) {
  if (!ids.length) return null;
  const entities = ids.map(getEntityById).filter(Boolean);
  return <section className="succession-explorer-compare" aria-label="Comparison tray">
    <header><span>Compare tray</span><strong>{entities.length} / 5</strong><button type="button" onClick={onClear}>Clear</button></header>
    <div>{entities.map((entity) => <article key={entity.id}>
      <button type="button" className="succession-explorer-compare__record" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}><span>{labelize(entity.entityType)}</span><strong>{entityLabel(entity)}</strong></button>
      <button type="button" className="succession-explorer-compare__remove" onClick={() => onRemove(entity.id)} aria-label={`Remove ${entityLabel(entity)} from comparison`}><X size={12} /></button>
    </article>)}</div>
  </section>;
}

function DiffPanel({ chapter, spoilerLimit, onNavigate }) {
  const [from, setFrom] = useState(Math.max(340, chapter - 1));
  const [to, setTo] = useState(chapter);
  useEffect(() => { setTo(chapter); setFrom((current) => Math.min(current, chapter - 1) || Math.max(340, chapter - 1)); }, [chapter]);
  const result = useMemo(() => safe(() => getChapterStateDiff(from, to), null), [from, to]);
  if (!result) return null;
  return <section className="succession-explorer-analysis-panel succession-explorer-diff">
    <header><div><span>State difference engine</span><h3>Only show what changed</h3></div><div><label>From<input type="number" min="340" max={spoilerLimit} value={from} onChange={(event) => setFrom(Number(event.target.value))} /></label><label>To<input type="number" min="340" max={spoilerLimit} value={to} onChange={(event) => setTo(Number(event.target.value))} /></label></div></header>
    <dl><ExplorerStat label="Added" value={result.summary?.added ?? 0} /><ExplorerStat label="Removed" value={result.summary?.removed ?? 0} /><ExplorerStat label="Changed" value={result.summary?.changed ?? 0} /></dl>
    <div className="succession-explorer-diff__records">{(result.records || []).slice(0, 18).map((record) => <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(record.entity), { entity: record.entity.id, chapter: to })} key={record.entity.id}><span>{labelize(record.status)}</span><strong>{entityLabel(record.entity)}</strong><small>{labelize(record.entity.entityType)}</small></button>)}</div>
  </section>;
}

function KnowledgePanel({ chapter, perspective }) {
  const matrix = useMemo(() => safe(() => getKnowledgeMatrix(chapter), null), [chapter]);
  if (!matrix) return null;
  const records = (matrix.records || []).filter((record) => perspective === 'reader' || (record.knowerEntityIds || []).includes(perspective) || (record.misinformedEntityIds || []).includes(perspective));
  const perspectiveEntity = perspective === 'reader' ? null : getEntityById(perspective);
  return <section className="succession-explorer-analysis-panel succession-explorer-knowledge">
    <header><div><span>Knowledge warfare</span><h3>{perspectiveEntity ? `${entityLabel(perspectiveEntity)}’s information state` : 'Reader-visible information state'}</h3></div><strong>{records.length} records</strong></header>
    <div>{records.slice(0, 24).map((record) => {
      const knows = perspective === 'reader' || (record.knowerEntityIds || []).includes(perspective);
      const misinformed = perspective !== 'reader' && (record.misinformedEntityIds || []).includes(perspective);
      return <article className={misinformed ? 'is-misinformed' : knows ? 'is-known' : 'is-hidden'} key={record.id}><span>{misinformed ? 'Misinformed / protected' : labelize(record.currentKnowledgeState || record.knowledgeState)}</span><strong>{record.name}</strong><p>{compactText(record.summary, 180)}</p></article>;
    })}</div>
  </section>;
}

function PathPanel({ model, compareIds }) {
  const [sourceId, targetId] = compareIds;
  const path = useMemo(() => {
    if (!sourceId || !targetId) return [];
    const byEntity = new Map(model.nodes.filter((item) => item.entityId).map((item) => [item.entityId, item.id]));
    const source = byEntity.get(sourceId) || sourceId;
    const target = byEntity.get(targetId) || targetId;
    const graph = new Map();
    for (const edge of model.edges) {
      const left = graph.get(edge.source) || [];
      left.push(edge.target);
      graph.set(edge.source, left);
      const right = graph.get(edge.target) || [];
      right.push(edge.source);
      graph.set(edge.target, right);
    }
    const queue = [[source]];
    const seen = new Set([source]);
    while (queue.length) {
      const current = queue.shift();
      const tail = current.at(-1);
      if (tail === target) return current;
      for (const next of graph.get(tail) || []) if (!seen.has(next)) { seen.add(next); queue.push([...current, next]); }
    }
    return [];
  }, [compareIds, model.edges, model.nodes, sourceId, targetId]);
  if (!sourceId || !targetId) return <section className="succession-explorer-analysis-panel"><span>Connection path</span><h3>Add two records to Compare</h3><p>The graph will search the currently visible canonical edges for a documented route between them.</p></section>;
  return <section className="succession-explorer-analysis-panel succession-explorer-path"><span>Connection path</span><h3>{path.length ? `${path.length - 1} edge${path.length === 2 ? '' : 's'}` : 'No visible path'}</h3>{path.length ? <ol>{path.map((id) => { const node = model.nodes.find((item) => item.id === id); const entity = node?.entityId ? getEntityById(node.entityId) : null; return <li key={id}><span>{node?.kind || 'record'}</span><strong>{entityLabel(entity) || node?.label || id}</strong></li>; })}</ol> : <p>Try another lens, chapter, or a broader research depth. A missing path here does not prove the entities are unrelated.</p>}</section>;
}

function CapabilityDeck({ profile }) {
  return <details className="succession-explorer-capabilities">
    <summary><Layers3 size={14} /><span>Capabilities in this instrument</span><strong>{profile.capabilities.length}</strong></summary>
    <div>{profile.capabilities.map((item) => <article key={item.id}><span>{item.label}</span><p>{item.description}</p></article>)}</div>
  </details>;
}

export default function SuccessionExplorerSurface({ routeId, routeParams = {}, spoilerLimit, onNavigate }) {
  const profile = getSuccessionExplorerProfile(routeId);
  const explorer = useSuccessionExplorer();
  const [expanded, setExpanded] = useState(routeId !== 'reader');
  const [localSelectedNodeId, setLocalSelectedNodeId] = useState(null);
  const view = explorer.getRouteView(routeId);
  const lens = explorer.getRouteLens(routeId);
  const query = explorer.filters.query || '';

  useEffect(() => { explorer.hydrateFromRouteParams(routeId, routeParams); }, [explorer.hydrateFromRouteParams, routeId, routeParams]);
  useEffect(() => { setLocalSelectedNodeId(null); }, [routeId, view, lens]);

  const model = useMemo(() => buildSuccessionExplorerModel({
    routeId,
    chapter: explorer.chapter,
    view,
    lens,
    depth: explorer.depth,
    filters: explorer.filters,
  }), [explorer.chapter, explorer.depth, explorer.filters, lens, routeId, view]);

  const selectedNode = useMemo(() => {
    if (localSelectedNodeId) return model.nodes.find((item) => item.id === localSelectedNodeId) || null;
    const selectedEntityId = explorer.selectedIds[0];
    return selectedEntityId ? model.nodes.find((item) => item.entityId === selectedEntityId) || null : null;
  }, [explorer.selectedIds, localSelectedNodeId, model.nodes]);

  useEffect(() => {
    if (!explorer.playback.playing) return undefined;
    const delay = Math.max(280, 1200 / Math.max(.5, Number(explorer.playback.speed) || 1));
    const handle = window.setInterval(() => {
      if (explorer.chapter >= spoilerLimit) {
        explorer.setPlayback({ playing: false });
        return;
      }
      explorer.setChapter(explorer.chapter + 1);
    }, delay);
    return () => window.clearInterval(handle);
  }, [explorer, spoilerLimit]);

  const selectedNoteKey = selectedNode?.entityId || selectedNode?.id || `${routeId}:${view}`;
  const selectedNote = explorer.notes[selectedNoteKey] || '';
  const onSelect = (node) => {
    setLocalSelectedNodeId(node.id);
    if (node.entityId) explorer.selectEntity(node.entityId, { routeId, chapter: explorer.chapter, label: node.label });
    else explorer.pushHistory({ kind: 'timeline-point', routeId, label: node.label, nodeId: node.id });
  };

  const copyView = async () => {
    const href = routeToHref('succession', routeId, explorer.buildDeepLinkParams(routeId, selectedNode?.entityId ? { entity: selectedNode.entityId } : {}));
    const url = new URL(href, window.location.origin).href;
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard is optional */ }
    explorer.addBookmark({ routeId, view, lens, camera: explorer.cameras[routeId], label: `${profile.title} · Ch. ${explorer.chapter}` });
  };

  const camera = explorer.cameras[routeId] || null;
  const diffView = view === 'diff';
  const knowledgeView = view === 'knowledge' || lens === 'knowledge';
  const pathView = view === 'path' || view === 'causality';
  const canShowCanvas = routeId !== 'reader' || view === 'research';

  return <section className={`succession-explorer-surface${expanded ? ' is-expanded' : ' is-collapsed'}`} data-explorer-route={routeId} data-explorer-view={view}>
    <header className="succession-explorer-surface__header">
      <div className="succession-explorer-surface__identity"><span>Connected explorer</span><h2>{profile.title}</h2><p>{profile.views.find((item) => item.id === view)?.description}</p></div>
      <dl><ExplorerStat label="Chapter" value={explorer.chapter} /><ExplorerStat label="Visible" value={model.stats.visible.toLocaleString()} /><ExplorerStat label="Total" value={model.stats.total.toLocaleString()} /><ExplorerStat label="Depth" value={labelize(explorer.depth)} /></dl>
      <div className="succession-explorer-surface__header-actions">
        <button type="button" onClick={copyView}><Copy size={14} /> Save / copy view</button>
        <button type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />} {expanded ? 'Collapse' : 'Open explorer'}</button>
      </div>
    </header>

    {expanded && <>
      <div className="succession-explorer-toolbar">
        <label className="succession-explorer-search"><Search size={15} /><span className="sr-only">Filter explorer</span><input value={query} onChange={(event) => explorer.setFilters({ query: event.target.value })} placeholder={`Filter ${profile.title.toLowerCase()}…`} />{query && <button type="button" onClick={() => explorer.setFilters({ query: '' })} aria-label="Clear explorer filter"><X size={13} /></button>}</label>
        <label className="succession-explorer-control succession-explorer-control--chapter"><span>Time machine</span><div><input type="range" min="340" max={spoilerLimit} value={explorer.chapter} onChange={(event) => explorer.setChapter(event.target.value)} /><output>Ch. {explorer.chapter}</output></div></label>
        <div className="succession-explorer-playback" aria-label="Chapter playback"><button type="button" onClick={() => explorer.setPlayback({ playing: !explorer.playback.playing })}>{explorer.playback.playing ? <Pause size={14} /> : <Play size={14} />}<span>{explorer.playback.playing ? 'Pause' : 'Play'}</span></button><select value={explorer.playback.speed} onChange={(event) => explorer.setPlayback({ speed: Number(event.target.value) })} aria-label="Playback speed"><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></div>
        <PerspectiveControl value={explorer.perspective} onChange={explorer.setPerspective} chapter={explorer.chapter} />
        <label className="succession-explorer-control"><span><ListFilter size={13} /> Lens</span><select value={lens} onChange={(event) => explorer.setRouteLens(routeId, event.target.value)}>{profile.lenses.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
      </div>

      <nav className="succession-explorer-views" aria-label={`${profile.title} views`}>{profile.views.map((item) => <button type="button" className={view === item.id ? 'is-active' : ''} aria-pressed={view === item.id} onClick={() => { explorer.setRouteView(routeId, item.id); explorer.pushHistory({ kind: 'view', routeId, label: item.label }); }} key={item.id}><Map size={13} aria-hidden="true" /><span>{item.label}</span></button>)}</nav>

      <div className="succession-explorer-depth" aria-label="Semantic reading depth"><span>Semantic depth</span>{successionExplorerDepthLevels.map((item, index) => <button type="button" className={explorer.depth === item.id ? 'is-active' : ''} aria-pressed={explorer.depth === item.id} title={item.description} onClick={() => explorer.setDepth(item.id)} key={item.id}><i>{index + 1}</i>{item.label}</button>)}</div>

      <CompareTray ids={explorer.compareIds} onRemove={explorer.toggleCompare} onClear={explorer.clearCompare} onNavigate={onNavigate} />

      {canShowCanvas && <div className="succession-explorer-layout">
        <SuccessionExplorerCanvas
          model={model}
          selectedId={selectedNode?.id || selectedNode?.entityId || null}
          onSelect={onSelect}
          initialCamera={camera}
          onCameraChange={(next) => explorer.setCamera(routeId, next)}
        />
        <SelectedInspector
          node={selectedNode}
          chapter={explorer.chapter}
          onNavigate={onNavigate}
          onCompare={explorer.toggleCompare}
          onWatch={(id) => explorer.addToCollection('Watchlist', id)}
          note={selectedNote}
          onNote={(value) => explorer.setNote(selectedNoteKey, value)}
        />
      </div>}

      {routeId === 'reader' && !canShowCanvas && <section className="succession-explorer-reader-sync"><div><span>Synchronized reader context</span><h3>Chapter {explorer.chapter} is now the shared analysis time.</h3><p>Open Timeline, Characters, Nen, Black Whale, Relationships, Chapters, or Research and the Explorer keeps this chapter, perspective, comparison tray, and watchlist.</p></div><button type="button" onClick={() => onNavigate('timeline', explorer.buildDeepLinkParams('timeline'))}>Open synchronized Timeline</button></section>}

      {diffView && <DiffPanel chapter={explorer.chapter} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
      {knowledgeView && <KnowledgePanel chapter={explorer.chapter} perspective={explorer.perspective} />}
      {pathView && <PathPanel model={model} compareIds={explorer.compareIds} />}

      <section className="succession-explorer-memory">
        <div><Bookmark size={15} /><span>Bookmarks</span><strong>{explorer.bookmarks.length}</strong></div>
        <div><Star size={15} /><span>Watchlist</span><strong>{explorer.collections.Watchlist?.length || 0}</strong></div>
        <div><Network size={15} /><span>Research trail</span><strong>{explorer.history.length}</strong></div>
        <div><GitCompareArrows size={15} /><span>Compare</span><strong>{explorer.compareIds.length}</strong></div>
      </section>

      <CapabilityDeck profile={profile} />
    </>}
  </section>;
}
