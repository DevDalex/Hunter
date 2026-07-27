import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Crown, Link2, Maximize2, RotateCcw, Shield, Users, ZoomIn, ZoomOut } from 'lucide-react';
import { princeDossiers } from '../../data/successionDossier';
import { biologicalRoyalFamilyTree, legalRoyalFamilyTree } from '../../data/successionRoster';
import { getOrganizationMembers } from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import {
  abilityLabelFor,
  beastForHost,
  buildProtectionNodes,
  cleanBranchName,
  dossierByOrder,
  dossierByShort,
  entityForName,
  mafiaConnections,
  normalizeLookup,
  organizationForName,
  personSummary,
  queenDossierByShort,
  statusLabel,
} from './RoyalFamilyBoardModel';
import {
  ForceRail,
  KingMapNode,
  MapInspector,
  PrinceMapNode,
  QueenMapNode,
} from './RoyalFamilyBoardNodes';
import './RoyalFamilyGuardTree.css';
import './RoyalFamilyGuardTreeFixes.css';
import './RoyalFamilyBoardInteractionFixes.css';

const MAP_WIDTH = 1800;
const MAP_HEIGHT = 1050;
const PRINCE_WIDTH = 350;
const PRINCE_HEIGHT = 154;
const QUEEN_WIDTH = 104;
const QUEEN_HEIGHT = 50;
const MIN_SCALE = 0.42;
const MAX_SCALE = 1.8;
const VIEW_MARGIN = 42;
const PAN_STEP = 72;

const PRINCE_LAYOUT = Object.freeze({
  1: { x: 360, y: 155 }, 2: { x: 360, y: 335 }, 5: { x: 360, y: 515 }, 9: { x: 360, y: 695 }, 12: { x: 360, y: 875 },
  3: { x: 820, y: 155 }, 4: { x: 820, y: 335 }, 7: { x: 820, y: 515 }, 10: { x: 820, y: 695 }, 13: { x: 820, y: 875 },
  6: { x: 1280, y: 155 }, 8: { x: 1280, y: 335 }, 11: { x: 1280, y: 515 }, 14: { x: 1280, y: 695 },
});

const QUEEN_LAYOUT = Object.freeze({
  Unma: { x: 255, y: 225 },
  Duazul: { x: 255, y: 520 },
  'Tang Zhao Li': { x: 710, y: 180 },
  Katrono: { x: 1170, y: 180 },
  'Swinko-swinko': { x: 1690, y: 360 },
  Seiko: { x: 1170, y: 620 },
  Sevanti: { x: 710, y: 900 },
  Oito: { x: 1690, y: 730 },
});

const FORCE_LAYOUT = Object.freeze({
  allies: { x: 20, y: 74 },
  'xi-yu': { x: 20, y: 210 },
  'heil-ly': { x: 20, y: 346 },
  'cha-r': { x: 20, y: 482 },
});

const recordKey = (record) => record?.key || '';
const sameRecord = (a, b) => recordKey(a) === recordKey(b);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pointDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const pointCenter = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const princeAnchor = (order) => ({
  x: PRINCE_LAYOUT[order].x + PRINCE_WIDTH / 2,
  y: PRINCE_LAYOUT[order].y + PRINCE_HEIGHT / 2,
});

const personRecord = ({ key, kind, name, entity, eyebrow, summary, ability, beast, facts = [], princeOrder = null, linkedOrders = [], openTarget = null }) => ({
  key, kind, name, entity, eyebrow, summary, ability, beast, facts, princeOrder, linkedOrders, openTarget,
});

const buildForceGroups = () => {
  const alliedNames = ['Kurapika', 'Bill', 'Biscuit Krueger', 'Melody'];
  const allies = {
    key: 'allies',
    label: 'Allied placements',
    relation: 'Hunters and allied specialists placed across lower-prince households.',
    linkedOrders: [5, 11, 13, 14],
    members: alliedNames.map((name) => ({ name, entity: entityForName(name) })).filter(({ entity }) => entity),
  };

  const mafia = mafiaConnections.map((connection) => {
    const organization = organizationForName(connection.name);
    const leader = entityForName(connection.leader);
    const excluded = new Set([normalizeLookup(connection.leader), normalizeLookup(dossierByOrder.get(connection.princeOrder)?.name)]);
    const members = organization
      ? getOrganizationMembers(organization.id)
        .map(({ character }) => character)
        .filter((character) => character && !excluded.has(normalizeLookup(character.name)))
        .slice(0, 4)
        .map((entity) => ({ name: entity.name, entity }))
      : [];
    return {
      key: connection.key,
      label: connection.name,
      leader: connection.leader,
      leaderEntity: leader,
      organization,
      relation: connection.relation,
      linkedOrders: [connection.princeOrder],
      members,
    };
  });

  return [allies, ...mafia];
};

function orthogonalPath(source, target, bendX = null) {
  const middleX = bendX ?? Math.round((source.x + target.x) / 2);
  return `M ${source.x} ${source.y} H ${middleX} V ${target.y} H ${target.x}`;
}

function RoyalMapConnectors({ branches, forceGroups, activePrinceOrders, activeForceKey, activeQueenKey }) {
  const kingSource = { x: MAP_WIDTH / 2, y: 126 };
  return <svg className="royal-map__connectors" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} fill="none" aria-hidden="true">
    <g className="royal-map__royal-lines">
      {princeDossiers.map((prince) => {
        const target = { x: princeAnchor(prince.order).x, y: PRINCE_LAYOUT[prince.order].y };
        return <path
          key={`royal-${prince.order}`}
          className={activePrinceOrders.has(prince.order) ? 'is-active' : ''}
          d={`M ${kingSource.x} ${kingSource.y} V 142 H ${target.x} V ${target.y}`}
        />;
      })}
    </g>

    <g className="royal-map__maternal-lines">
      {branches.flatMap((branch) => {
        const queenPosition = QUEEN_LAYOUT[branch.short];
        if (!queenPosition) return [];
        const source = { x: queenPosition.x + QUEEN_WIDTH / 2, y: queenPosition.y + QUEEN_HEIGHT / 2 };
        const queenActive = activeQueenKey === branch.record.key;
        return branch.princes.map((prince) => {
          const layout = PRINCE_LAYOUT[prince.order];
          const target = queenPosition.x < layout.x
            ? { x: layout.x, y: layout.y + 38 }
            : { x: layout.x + PRINCE_WIDTH, y: layout.y + 38 };
          return <path
            key={`maternal-${branch.short}-${prince.order}`}
            className={`${queenActive ? 'is-queen-active ' : ''}${activePrinceOrders.has(prince.order) ? 'is-active' : ''}`.trim()}
            d={orthogonalPath(source, target)}
          />;
        });
      })}
    </g>

    <g className="royal-map__force-lines">
      {forceGroups.flatMap((group) => {
        const position = FORCE_LAYOUT[group.key];
        if (!position) return [];
        const source = { x: 236, y: position.y + 54 };
        return group.linkedOrders.map((order) => {
          const target = { x: PRINCE_LAYOUT[order].x, y: PRINCE_LAYOUT[order].y + 112 };
          return <path
            key={`force-${group.key}-${order}`}
            className={`is-${group.key}${activeForceKey === group.key || activePrinceOrders.has(order) ? ' is-active' : ''}`}
            d={orthogonalPath(source, target, 300 + (order % 3) * 14)}
          />;
        });
      })}
    </g>
  </svg>;
}

function viewBounds(scale, viewport) {
  const scaledWidth = MAP_WIDTH * scale;
  const scaledHeight = MAP_HEIGHT * scale;
  const minX = scaledWidth <= viewport.width
    ? (viewport.width - scaledWidth) / 2
    : viewport.width - scaledWidth - VIEW_MARGIN;
  const maxX = scaledWidth <= viewport.width ? minX : VIEW_MARGIN;
  const minY = scaledHeight <= viewport.height
    ? (viewport.height - scaledHeight) / 2
    : viewport.height - scaledHeight - VIEW_MARGIN;
  const maxY = scaledHeight <= viewport.height ? minY : VIEW_MARGIN;
  return { minX, maxX, minY, maxY };
}

function constrainedView(next, viewport) {
  if (!viewport.width || !viewport.height) return next;
  const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
  const bounds = viewBounds(scale, viewport);
  return {
    scale,
    x: clamp(next.x, bounds.minX, bounds.maxX),
    y: clamp(next.y, bounds.minY, bounds.maxY),
  };
}

function fittedView(viewport) {
  if (!viewport.width || !viewport.height) return { x: 0, y: 0, scale: 1 };
  const scale = clamp(Math.min(
    (viewport.width - VIEW_MARGIN * 2) / MAP_WIDTH,
    (viewport.height - VIEW_MARGIN * 2) / MAP_HEIGHT,
  ), MIN_SCALE, 1);
  return constrainedView({
    scale,
    x: (viewport.width - MAP_WIDTH * scale) / 2,
    y: (viewport.height - MAP_HEIGHT * scale) / 2,
  }, viewport);
}

export default function RoyalFamilyGuardTree({ onNavigate, spoilerLimit = Number.MAX_SAFE_INTEGER, initialPrince = 14 }) {
  const royalTree = spoilerLimit >= 401 ? biologicalRoyalFamilyTree : legalRoyalFamilyTree;
  const initialOrder = PRINCE_LAYOUT[initialPrince] ? initialPrince : 14;
  const [selectedOrder, setSelectedOrder] = useState(initialOrder);
  const [hoveredRecord, setHoveredRecord] = useState(null);
  const [pinnedRecord, setPinnedRecord] = useState(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const viewRef = useRef(view);
  const initializedViewRef = useRef(false);
  const gestureRef = useRef({ pointers: new Map(), mode: null, startView: null, startPoint: null, startDistance: 0, startCenter: null, moved: false });
  const suppressClickUntilRef = useRef(0);
  const hoverClearTimerRef = useRef(null);

  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => () => window.clearTimeout(hoverClearTimerRef.current), []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const updateSize = () => {
      const rect = viewport.getBoundingClientRect();
      setViewportSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!viewportSize.width || !viewportSize.height) return;
    if (!initializedViewRef.current) {
      initializedViewRef.current = true;
      setView(fittedView(viewportSize));
      return;
    }
    setView((current) => constrainedView(current, viewportSize));
  }, [viewportSize]);

  const updateView = useCallback((updater) => {
    setView((current) => constrainedView(typeof updater === 'function' ? updater(current) : updater, viewportSize));
  }, [viewportSize]);

  const zoomAt = useCallback((nextScale, point = { x: viewportSize.width / 2, y: viewportSize.height / 2 }) => {
    updateView((current) => {
      const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      const mapX = (point.x - current.x) / current.scale;
      const mapY = (point.y - current.y) / current.scale;
      return {
        scale,
        x: point.x - mapX * scale,
        y: point.y - mapY * scale,
      };
    });
  }, [updateView, viewportSize]);

  const fitAll = useCallback(() => setView(fittedView(viewportSize)), [viewportSize]);
  const resetView = useCallback(() => {
    const scale = 1;
    setView(constrainedView({
      scale,
      x: (viewportSize.width - MAP_WIDTH) / 2,
      y: VIEW_MARGIN,
    }, viewportSize));
  }, [viewportSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const onWheel = (event) => {
      if (event.target.closest?.('.royal-map__inspector')) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomAt(viewRef.current.scale * factor, point);
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const pointerPoint = (event) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return { x: event.clientX - (rect?.left || 0), y: event.clientY - (rect?.top || 0) };
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = pointerPoint(event);
    const interactive = Boolean(event.target.closest?.('button, a, input, select, textarea, .royal-map__inspector, .royal-map__controls'));
    const gesture = gestureRef.current;
    gesture.pointers.set(event.pointerId, { point, interactive });

    if (gesture.pointers.size === 1 && !interactive) {
      gesture.mode = 'pan';
      gesture.startPoint = point;
      gesture.startView = viewRef.current;
      gesture.moved = false;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } else if (gesture.pointers.size === 2) {
      const [first, second] = [...gesture.pointers.values()].map((entry) => entry.point);
      gesture.mode = 'pinch';
      gesture.startDistance = Math.max(1, pointDistance(first, second));
      gesture.startCenter = pointCenter(first, second);
      gesture.startView = viewRef.current;
      gesture.moved = false;
      for (const pointerId of gesture.pointers.keys()) {
        try { event.currentTarget.setPointerCapture?.(pointerId); } catch { /* pointer may already be captured by its control */ }
      }
    }
  };

  const handlePointerMove = (event) => {
    const gesture = gestureRef.current;
    const pointer = gesture.pointers.get(event.pointerId);
    if (!pointer) return;
    const point = pointerPoint(event);
    gesture.pointers.set(event.pointerId, { ...pointer, point });

    if (gesture.mode === 'pinch' && gesture.pointers.size >= 2) {
      const [first, second] = [...gesture.pointers.values()].slice(0, 2).map((entry) => entry.point);
      const center = pointCenter(first, second);
      const scale = clamp(gesture.startView.scale * (pointDistance(first, second) / gesture.startDistance), MIN_SCALE, MAX_SCALE);
      const mapX = (gesture.startCenter.x - gesture.startView.x) / gesture.startView.scale;
      const mapY = (gesture.startCenter.y - gesture.startView.y) / gesture.startView.scale;
      gesture.moved = true;
      setDragging(true);
      setView(constrainedView({
        scale,
        x: center.x - mapX * scale,
        y: center.y - mapY * scale,
      }, viewportSize));
      event.preventDefault();
      return;
    }

    if (gesture.mode === 'pan' && gesture.startPoint && gesture.startView) {
      const dx = point.x - gesture.startPoint.x;
      const dy = point.y - gesture.startPoint.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        gesture.moved = true;
        setDragging(true);
      }
      setView(constrainedView({
        ...gesture.startView,
        x: gesture.startView.x + dx,
        y: gesture.startView.y + dy,
      }, viewportSize));
      event.preventDefault();
    }
  };

  const handlePointerEnd = (event) => {
    const gesture = gestureRef.current;
    const moved = gesture.moved;
    gesture.pointers.delete(event.pointerId);
    if (gesture.pointers.size === 1) {
      const [remaining] = gesture.pointers.values();
      if (!remaining.interactive) {
        gesture.mode = 'pan';
        gesture.startPoint = remaining.point;
        gesture.startView = viewRef.current;
        gesture.moved = false;
      } else {
        gesture.mode = null;
      }
    } else if (!gesture.pointers.size) {
      gesture.mode = null;
      gesture.startPoint = null;
      gesture.startView = null;
      gesture.moved = false;
      setDragging(false);
      if (moved) suppressClickUntilRef.current = performance.now() + 160;
    }
    try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* already released */ }
  };

  const handleViewportKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') updateView((current) => ({ ...current, x: current.x + PAN_STEP }));
    else if (event.key === 'ArrowRight') updateView((current) => ({ ...current, x: current.x - PAN_STEP }));
    else if (event.key === 'ArrowUp') updateView((current) => ({ ...current, y: current.y + PAN_STEP }));
    else if (event.key === 'ArrowDown') updateView((current) => ({ ...current, y: current.y - PAN_STEP }));
    else if (event.key === '+' || event.key === '=') zoomAt(viewRef.current.scale * 1.18);
    else if (event.key === '-') zoomAt(viewRef.current.scale / 1.18);
    else if (event.key === '0') fitAll();
    else if (event.key.toLowerCase() === 'r') resetView();
    else return;
    event.preventDefault();
  };

  const protectionByPrince = useMemo(() => new Map(princeDossiers.map((prince) => [prince.order, buildProtectionNodes(prince)])), []);
  const forceGroups = useMemo(buildForceGroups, []);

  const princeRecords = useMemo(() => new Map(princeDossiers.map((prince) => {
    const entity = entityForName(prince.name);
    const beast = beastForHost(prince.short);
    const guards = protectionByPrince.get(prince.order) || [];
    const direct = guards.filter((guard) => guard.kind === 'protection' && !guard.isGroup).length;
    const placed = guards.filter((guard) => ['kurapika-placement', 'ally'].includes(guard.kind)).length;
    const intelligence = guards.filter((guard) => ['observer', 'spy', 'hostile'].includes(guard.kind)).length;
    return [prince.order, personRecord({
      key: `prince:${prince.order}`,
      kind: 'prince',
      name: prince.name,
      entity,
      eyebrow: `${prince.order}${prince.order === 1 ? 'st' : prince.order === 2 ? 'nd' : prince.order === 3 ? 'rd' : 'th'} Prince · ${statusLabel(prince.status)}`,
      summary: prince.strategy,
      ability: prince.nen,
      beast: beast?.ability || prince.beast,
      facts: [
        ['Mother', `Queen ${prince.mother}`],
        ['Room', prince.room],
        ['Bodyguards', String(guards.length)],
        ['Direct / placed / intel', `${direct} / ${placed} / ${intelligence}`],
      ],
      princeOrder: prince.order,
      linkedOrders: [prince.order],
      openTarget: { type: 'prince', order: prince.order },
    })];
  })), [protectionByPrince]);

  const branches = useMemo(() => royalTree.map((branch, index) => {
    const short = branch.queen.replace(' Hui Guo Rou', '');
    const entity = entityForName(branch.queen);
    const dossier = queenDossierByShort.get(short);
    const princes = branch.children.map((child) => dossierByShort.get(cleanBranchName(child))).filter(Boolean);
    return {
      ...branch,
      short,
      princes,
      record: personRecord({
        key: `queen:${index + 1}`,
        kind: 'queen',
        name: branch.queen,
        entity,
        eyebrow: branch.order,
        summary: dossier?.role || branch.note || 'Kakin maternal household branch.',
        ability: abilityLabelFor(entity),
        facts: [['Children', princes.map((prince) => prince.short).join(', ')], ['Branch', branch.note || 'Royal household']],
        princeOrder: princes[0]?.order || null,
        linkedOrders: princes.map((prince) => prince.order),
        openTarget: entity ? { type: 'entity', entity } : null,
      }),
    };
  }), [royalTree]);

  const kingEntity = entityForName('Nasubi Hui Guo Rou');
  const kingBeast = beastForHost('Nasubi');
  const kingRecord = personRecord({
    key: 'king:nasubi',
    kind: 'king',
    name: 'Nasubi Hui Guo Rou',
    entity: kingEntity,
    eyebrow: 'King of Kakin',
    summary: personSummary(kingEntity, 'The reigning Kakin king and sponsor of the current succession ritual.'),
    ability: abilityLabelFor(kingEntity),
    beast: kingBeast?.ability,
    facts: [['Role', 'Father of the fourteen legitimate princes'], ['Contest', 'Previous-generation survivor']],
    linkedOrders: princeDossiers.map((prince) => prince.order),
    openTarget: kingEntity ? { type: 'entity', entity: kingEntity } : null,
  });

  const forceRecords = useMemo(() => new Map(forceGroups.map((group) => {
    const linked = group.linkedOrders.map((order) => princeRecords.get(order)?.name).filter(Boolean).join(', ');
    const entity = group.leaderEntity || group.organization || group.members[0]?.entity || null;
    return [group.key, personRecord({
      key: `force:${group.key}`,
      kind: group.key === 'allies' ? 'alliance' : 'mafia',
      name: group.label,
      entity,
      eyebrow: group.key === 'allies' ? 'Outside force' : 'Mafia / external tie',
      summary: group.relation,
      ability: group.leaderEntity ? abilityLabelFor(group.leaderEntity) : 'Mixed documented abilities',
      facts: [['Linked princes', linked], ['Members shown', String(group.members.length)]],
      princeOrder: group.linkedOrders[0] || null,
      linkedOrders: group.linkedOrders,
      openTarget: group.organization ? { type: 'entity', entity: group.organization } : null,
    })];
  })), [forceGroups, princeRecords]);

  const activeRecord = hoveredRecord || pinnedRecord;
  const activeKey = recordKey(activeRecord);
  const activeQueenKey = activeRecord?.kind === 'queen' ? activeRecord.key : null;
  const activePrinceOrders = new Set(
    activeRecord?.kind === 'queen'
      ? []
      : activeRecord?.linkedOrders?.length
        ? activeRecord.linkedOrders
        : [selectedOrder],
  );
  const activeForceKey = activeRecord?.kind === 'mafia' || activeRecord?.kind === 'alliance'
    ? activeRecord.key.replace('force:', '')
    : null;

  const holdPreview = useCallback(() => {
    window.clearTimeout(hoverClearTimerRef.current);
    hoverClearTimerRef.current = null;
  }, []);
  const preview = useCallback((record) => {
    holdPreview();
    setHoveredRecord(record);
  }, [holdPreview]);
  const clearPreview = useCallback(() => {
    holdPreview();
    hoverClearTimerRef.current = window.setTimeout(() => setHoveredRecord(null), 120);
  }, [holdPreview]);
  const pin = (record) => {
    if (['prince', 'guard', 'force-member'].includes(record.kind) && record.princeOrder) setSelectedOrder(record.princeOrder);
    setPinnedRecord((current) => sameRecord(current, record) ? null : record);
  };
  const openRecord = (record) => {
    if (record?.openTarget?.type === 'prince') {
      onNavigate?.('princes', { prince: record.openTarget.order });
      return;
    }
    if (record?.openTarget?.entity) {
      const entity = record.openTarget.entity;
      onNavigate?.(entityWorkspaceTarget(entity), { entity: entity.id });
    }
  };

  const guardRecordFor = (guard, prince) => personRecord({
    key: `guard:${prince.order}:${guard.id}`,
    kind: 'guard',
    name: guard.name,
    entity: guard.entity,
    eyebrow: guard.eyebrow,
    summary: guard.description,
    ability: abilityLabelFor(guard.entity),
    facts: [['Assigned to', prince.name], ['Category', guard.kind], ['Record', guard.isGroup ? 'Group-level complement' : 'Named person']],
    princeOrder: prince.order,
    linkedOrders: [prince.order],
    openTarget: guard.entity ? { type: 'entity', entity: guard.entity } : null,
  });

  const forceMemberRecordFor = (member, group) => personRecord({
    key: `force-member:${group.key}:${member.entity?.id || normalizeLookup(member.name)}`,
    kind: 'force-member',
    name: member.name,
    entity: member.entity,
    eyebrow: group.label,
    summary: personSummary(member.entity, `Documented member of ${group.label}.`),
    ability: abilityLabelFor(member.entity),
    facts: [['Linked princes', group.linkedOrders.join(', ')], ['Relationship', group.relation]],
    princeOrder: group.linkedOrders[0] || null,
    linkedOrders: group.linkedOrders,
    openTarget: member.entity ? { type: 'entity', entity: member.entity } : null,
  });

  return <section
    className="royal-map"
    aria-labelledby="royal-map-title"
    onKeyDown={(event) => {
      if (event.key === 'Escape') {
        setPinnedRecord(null);
        setHoveredRecord(null);
      }
    }}
  >
    <header className="royal-map__toolbar">
      <div>
        <span><Crown size={14} aria-hidden="true" /> Royal relationship map</span>
        <h2 id="royal-map-title">Kakin Royal Family</h2>
        <p>King · queens · fourteen princes · Guardian Spirit Beasts · complete protection circles · mafia ties · Chapter {spoilerLimit}</p>
      </div>
      <div className="royal-map__legend" aria-label="Relationship legend">
        <span><i className="is-royal" /> Royal line</span>
        <span><i className="is-maternal" /> Maternal branch</span>
        <span><i className="is-protection" /> Protection / ally</span>
        <span><i className="is-mafia" /> Mafia / external tie</span>
      </div>
    </header>

    <div
      ref={viewportRef}
      className={`royal-map__viewport${dragging ? ' is-dragging' : ''}`}
      tabIndex="0"
      aria-label="Pan and zoom the Kakin royal relationship map. Use arrow keys to pan, plus and minus to zoom, zero to fit all, and R to reset."
      onKeyDown={handleViewportKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={(event) => {
        if (performance.now() < suppressClickUntilRef.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <div
        className="royal-map__canvas"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
        }}
      >
        <RoyalMapConnectors
          branches={branches}
          forceGroups={forceGroups}
          activePrinceOrders={activePrinceOrders}
          activeForceKey={activeForceKey}
          activeQueenKey={activeQueenKey}
        />

        <ForceRail
          groups={forceGroups}
          forceRecords={forceRecords}
          activeKey={activeKey}
          pinnedKey={recordKey(pinnedRecord)}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
          memberRecordFor={forceMemberRecordFor}
          layout={FORCE_LAYOUT}
        />

        <KingMapNode
          record={kingRecord}
          beast={kingBeast}
          active={activeKey === kingRecord.key}
          pinned={recordKey(pinnedRecord) === kingRecord.key}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
        />

        {branches.map((branch) => <QueenMapNode
          key={branch.short}
          branch={branch}
          position={QUEEN_LAYOUT[branch.short]}
          active={activeKey === branch.record.key}
          pinned={recordKey(pinnedRecord) === branch.record.key}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
        />)}

        {princeDossiers.map((prince) => <PrinceMapNode
          key={prince.order}
          prince={prince}
          record={princeRecords.get(prince.order)}
          guards={protectionByPrince.get(prince.order) || []}
          position={PRINCE_LAYOUT[prince.order]}
          selected={selectedOrder === prince.order}
          active={activePrinceOrders.has(prince.order)}
          activeKey={activeKey}
          pinnedKey={recordKey(pinnedRecord)}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
          guardRecordFor={guardRecordFor}
        />)}
      </div>

      <div className="royal-map__controls" role="group" aria-label="Map view controls">
        <button type="button" onClick={() => zoomAt(viewRef.current.scale * 1.2)} aria-label="Zoom in"><ZoomIn size={18} aria-hidden="true" /></button>
        <button type="button" onClick={() => zoomAt(viewRef.current.scale / 1.2)} aria-label="Zoom out"><ZoomOut size={18} aria-hidden="true" /></button>
        <button type="button" onClick={fitAll} aria-label="Fit entire relationship map"><Maximize2 size={18} aria-hidden="true" /></button>
        <button type="button" onClick={resetView} aria-label="Reset map to one hundred percent"><RotateCcw size={18} aria-hidden="true" /></button>
        <output aria-live="polite" aria-label="Current zoom level">{Math.round(view.scale * 100)}%</output>
      </div>

      <MapInspector
        record={activeRecord}
        pinned={sameRecord(pinnedRecord, activeRecord)}
        onOpen={openRecord}
        onUnpin={() => setPinnedRecord(null)}
        onPreviewHold={holdPreview}
        onPreviewRelease={clearPreview}
      />
    </div>

    <footer className="royal-map__footer">
      <Shield size={14} aria-hidden="true" />
      <span>Drag the board to pan. Scroll or pinch to zoom. Every documented guard is shown. Hover, focus, or tap a portrait to inspect.</span>
      <Users size={14} aria-hidden="true" />
      <Link2 size={14} aria-hidden="true" />
    </footer>
  </section>;
}
