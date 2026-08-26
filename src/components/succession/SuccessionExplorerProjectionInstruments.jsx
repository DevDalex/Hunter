import { useMemo } from 'react';
import {
  Bookmark,
  Clock3,
  History,
  MapPin,
  Network,
  Star,
} from 'lucide-react';
import {
  getActiveRelationshipsAtChapter,
  getCurrentLocationRecordForCharacter,
  getEntityById,
  getEventsForOrganization,
  getLocationsForAbility,
  searchArchiveProduct,
} from '../../data/succession/successionData';
import SuccessionExplorerCanvas from './SuccessionExplorerCanvas';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerProjectionInstruments.css';

const safe = (factory, fallback) => {
  try { return factory(); } catch { return fallback; }
};
const label = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const chapterOf = (entity) => Number(entity?.chapterRange?.start || entity?.firstChapter || entity?.chapter || entity?.number || 340) || 340;
const unique = (values) => [...new Set((values || []).filter(Boolean))];
const hash = (value) => {
  let result = 2166136261;
  for (const character of String(value || '')) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};
const kindFor = (entity) => entity?.entityType || 'record';
const searchText = (entity) => `${label(entity)} ${entity?.summary || ''}`.toLowerCase();

const basicNode = (entity, x, y, group = '') => ({
  id: entity.id,
  entityId: entity.id,
  label: label(entity),
  subtitle: entity.summary || '',
  kind: kindFor(entity),
  group: group || kindFor(entity),
  chapter: chapterOf(entity),
  x,
  y,
  importance: entity.entityType === 'character' || entity.entityType === 'event' ? 1.8 : 1.4,
  searchText: searchText(entity),
  meta: {},
});

function resultEntities(query, chapter) {
  if (!query) return [];
  return safe(() => searchArchiveProduct(query, { chapter, limit: 120 }), [])
    .map((result) => result.entity)
    .filter(Boolean);
}

function timelineProjection(records, chapter) {
  const typeRows = unique(records.map((record) => record.entityType));
  const rowIndex = new Map(typeRows.map((type, index) => [type, index]));
  const span = Math.max(1, chapter - 340);
  const nodes = records.map((entity) => basicNode(
    entity,
    140 + ((Math.min(chapter, chapterOf(entity)) - 340) / span) * 2100,
    130 + (rowIndex.get(entity.entityType) || 0) * 140 + (hash(entity.id) % 45),
    entity.entityType,
  ));
  return { nodes, edges: [], groups: typeRows, world: { width: 2400, height: Math.max(900, 260 + typeRows.length * 150) }, stats: { visible: nodes.length, total: nodes.length, label: 'search results' } };
}

function locationIdsFor(entity, chapter) {
  if (!entity) return [];
  if (entity.entityType === 'location') return [entity.id];
  if (entity.entityType === 'character') {
    const current = safe(() => getCurrentLocationRecordForCharacter(entity.id, chapter), null);
    return current?.locationId ? [current.locationId] : [];
  }
  if (entity.entityType === 'ability') return safe(() => getLocationsForAbility(entity.id), []).map((location) => location.id);
  if (entity.entityType === 'event') return unique([entity.locationId, ...(entity.locationIds || [])]);
  if (entity.entityType === 'organization') return unique(safe(() => getEventsForOrganization(entity.id), []).filter((event) => chapterOf(event) <= chapter).flatMap((event) => [event.locationId, ...(event.locationIds || [])]));
  return [];
}

function shipProjection(records, chapter) {
  const locations = new Map();
  const links = [];
  for (const entity of records) {
    for (const id of locationIdsFor(entity, chapter)) {
      const location = getEntityById(id);
      if (!location) continue;
      locations.set(location.id, location);
      links.push({ entity, location });
    }
  }
  const placeRecords = [...locations.values()];
  const centerX = 1100;
  const centerY = 650;
  const nodes = [];
  for (let index = 0; index < placeRecords.length; index += 1) {
    const location = placeRecords[index];
    const angle = (index / Math.max(1, placeRecords.length)) * Math.PI * 2 - Math.PI / 2;
    const radius = 330 + (index % 3) * 90;
    nodes.push({ ...basicNode(location, centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, 'Ship locations'), importance: 2.4 });
  }
  const byLocation = new Map();
  for (const link of links) {
    const values = byLocation.get(link.location.id) || [];
    values.push(link.entity);
    byLocation.set(link.location.id, values);
  }
  for (const [locationId, entities] of byLocation.entries()) {
    const placeNode = nodes.find((node) => node.id === locationId);
    if (!placeNode) continue;
    entities.slice(0, 18).forEach((entity, index) => {
      const angle = index * 2.399963229728653;
      const radius = 70 + Math.sqrt(index) * 44;
      if (!nodes.some((node) => node.id === entity.id)) nodes.push(basicNode(entity, placeNode.x + Math.cos(angle) * radius, placeNode.y + Math.sin(angle) * radius, label(getEntityById(locationId))));
    });
  }
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = links.filter((link) => nodeIds.has(link.entity.id) && nodeIds.has(link.location.id)).map((link) => ({ id: `projection:${link.entity.id}:${link.location.id}`, source: link.entity.id, target: link.location.id, kind: 'contains', label: 'location context', directed: true, strength: 1, meta: {} }));
  return { nodes, edges, groups: ['Ship locations'], world: { width: 2200, height: 1400 }, stats: { visible: nodes.length, total: records.length, label: 'projected results' } };
}

function graphProjection(records, chapter) {
  const centerX = 1000;
  const centerY = 620;
  const nodes = records.map((entity, index) => {
    const angle = (index / Math.max(1, records.length)) * Math.PI * 2 - Math.PI / 2;
    const radius = 330 + (index % 5) * 72;
    return basicNode(entity, centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, entity.entityType);
  });
  const ids = new Set(nodes.map((node) => node.id));
  const edges = safe(() => getActiveRelationshipsAtChapter(chapter), [])
    .filter((relationship) => ids.has(relationship.sourceEntityId) && ids.has(relationship.targetEntityId))
    .map((relationship) => ({
      id: relationship.id,
      source: relationship.sourceEntityId,
      target: relationship.targetEntityId,
      kind: relationship.sentiment === 'hostile' ? 'hostile' : 'relationship',
      label: relationship.relationshipType || relationship.sentiment || 'relationship',
      directed: relationship.direction !== 'mutual' && relationship.direction !== 'bidirectional',
      strength: 1.4,
      meta: { sentiment: relationship.sentiment },
    }));
  return { nodes, edges, groups: [], world: { width: 2000, height: 1250 }, stats: { visible: nodes.length, total: nodes.length, label: 'search results' } };
}

export function SearchProjectionInstrument({ chapter, view }) {
  const explorer = useSuccessionExplorer();
  const query = explorer.filters.query || '';
  const records = useMemo(() => resultEntities(query, chapter), [chapter, query]);
  const model = useMemo(() => view === 'timeline'
    ? timelineProjection(records, chapter)
    : view === 'ship'
      ? shipProjection(records, chapter)
      : graphProjection(records, chapter), [chapter, records, view]);
  if (!query || !['timeline', 'ship', 'graph'].includes(view)) return null;
  const cameraKey = `search-${view}`;
  const description = view === 'timeline'
    ? 'The same canonical search result set is positioned by first-known chapter and entity domain.'
    : view === 'ship'
      ? 'The same result set is re-projected through documented current or event-linked Black Whale locations. Missing spatial links remain absent rather than guessed.'
      : 'The same result set becomes a relationship graph using active canonical relationship edges at the selected chapter.';
  return <section className="succession-explorer-projection">
    <header><div><span>Result projection</span><h3>{view === 'timeline' ? <Clock3 /> : view === 'ship' ? <MapPin /> : <Network />} {view === 'timeline' ? 'Search results in time' : view === 'ship' ? 'Search results on ship context' : 'Search results as relationship graph'}</h3><p>{description}</p></div><strong>{records.length} canonical result{records.length === 1 ? '' : 's'}</strong></header>
    <div className="succession-explorer-projection__canvas">
      <SuccessionExplorerCanvas
        model={model}
        selectedId={explorer.selectedIds[0] || null}
        onSelect={(node) => node.entityId && explorer.selectEntity(node.entityId, { routeId: 'search', chapter, label: node.label })}
        initialCamera={explorer.cameras[cameraKey] || null}
        onCameraChange={(camera) => explorer.setCamera(cameraKey, camera)}
      />
    </div>
  </section>;
}

export function ArchiveResumeInstrument({ onNavigate }) {
  const explorer = useSuccessionExplorer();
  const history = explorer.history.slice(0, 18);
  const bookmarks = explorer.bookmarks.slice(0, 12);
  const watchlist = (explorer.collections?.Watchlist || []).map(getEntityById).filter(Boolean).slice(0, 18);
  const openEntity = (entity, chapter = explorer.chapter) => onNavigate?.(entityWorkspaceTarget(entity), explorer.buildDeepLinkParams(entityWorkspaceTarget(entity), { entity: entity.id, chapter }));
  return <section className="succession-explorer-resume">
    <header><div><span>Research continuity</span><h3><History size={18} /> Resume exactly where the investigation left off</h3><p>History, bookmarks and watchlist are local research state. Nothing here changes canon or archive evidence.</p></div><dl><div><dt>History</dt><dd>{explorer.history.length}</dd></div><div><dt>Bookmarks</dt><dd>{explorer.bookmarks.length}</dd></div><div><dt>Watchlist</dt><dd>{explorer.collections?.Watchlist?.length || 0}</dd></div></dl></header>
    <div className="succession-explorer-resume__columns">
      <section><header><History /><strong>Recent path</strong></header><div>{history.map((item) => { const entity = item.entityId ? getEntityById(item.entityId) : null; return <button type="button" onClick={() => entity ? openEntity(entity, item.chapter) : item.routeId && onNavigate?.(item.routeId, explorer.buildDeepLinkParams(item.routeId, { chapter: item.chapter }))} key={item.id}><span>CH. {item.chapter || explorer.chapter}</span><strong>{entity ? label(entity) : item.label || item.routeId || 'Saved view'}</strong><small>{item.routeId || item.kind}</small></button>; })}</div></section>
      <section><header><Bookmark /><strong>Bookmarks</strong></header><div>{bookmarks.map((item) => { const entity = item.entityId ? getEntityById(item.entityId) : null; return <button type="button" onClick={() => entity ? openEntity(entity, item.chapter) : item.routeId && onNavigate?.(item.routeId, { ...(item.params || {}), chapter: item.chapter })} key={item.id}><span>CH. {item.chapter}</span><strong>{item.label || (entity && label(entity)) || item.routeId || 'Saved Explorer view'}</strong><small>{item.depth || 'saved'}</small></button>; })}</div></section>
      <section><header><Star /><strong>Watchlist</strong></header><div>{watchlist.map((entity) => <button type="button" onClick={() => openEntity(entity)} key={entity.id}><span>{entity.entityType}</span><strong>{label(entity)}</strong><small>Open with current Ch. {explorer.chapter} state</small></button>)}</div></section>
    </div>
  </section>;
}
