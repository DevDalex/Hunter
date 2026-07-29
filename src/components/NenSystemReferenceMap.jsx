import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import SourcePortrait from './SourcePortrait';

const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1160;
const MIN_SCALE = 0.38;
const MAX_SCALE = 1.85;
const VIEW_MARGIN = 12;
const PAN_STEP = 72;

const categories = [
  { key: 'category:enhancement', name: 'Enhancement', code: 'En', mark: '強', x: 860, y: 165, water: 'Water volume changes', summary: 'Strengthen the body, aura, objects, or an existing quality.', users: [['Gon Freecss', 'Jajanken', 730, 42], ['Uvogin', 'Big Bang Impact', 1040, 42]] },
  { key: 'category:transmutation', name: 'Transmutation', code: 'Tr', mark: '変', x: 1165, y: 315, water: 'Water taste changes', summary: 'Give aura the properties of another substance or phenomenon.', users: [['Killua Zoldyck', 'Godspeed', 1375, 255], ['Hisoka Morow', 'Bungee Gum', 1375, 365]] },
  { key: 'category:conjuration', name: 'Conjuration', code: 'Co', mark: '具', x: 1165, y: 650, water: 'Impurities appear', summary: 'Materialize an object, structure, creature, or rule-bearing construct.', users: [['Kurapika', 'Conjured chains', 1375, 605], ['Shizuku Murasaki', 'Blinky', 1375, 715]] },
  { key: 'category:specialization', name: 'Specialization', code: 'Sp', mark: '特', x: 860, y: 840, water: 'A unique change occurs', summary: 'Produce an exceptional effect outside the regular five categories.', users: [['Chrollo Lucilfer', 'Skill Hunter', 730, 990], ['Neon Nostrade', 'Lovely Ghostwriter', 1040, 990]] },
  { key: 'category:manipulation', name: 'Manipulation', code: 'Ma', mark: '操', x: 555, y: 650, water: 'The leaf moves', summary: 'Control a person, object, creature, substance, or process.', users: [['Illumi Zoldyck', 'Needle People', 345, 605], ['Shalnark', 'Black Voice', 345, 715]] },
  { key: 'category:emission', name: 'Emission', code: 'Em', mark: '放', x: 555, y: 315, water: 'Water color changes', summary: 'Separate aura from the body while retaining its force or function.', users: [['Leorio Paradinight', 'Remote Punch', 345, 255], ['Razor', '14 Devils', 345, 365]] },
];

const conceptNodes = [
  { key: 'branch:foundations', parent: 'nen', kind: 'hub', name: 'Four Major Principles', eyebrow: 'Foundations', x: 42, y: 135, w: 255, h: 82, summary: 'The base controls for retaining, suppressing, producing, and expressing aura.' },
  { key: 'concept:ten', parent: 'branch:foundations', kind: 'concept', name: 'Ten', mark: '纏', x: 42, y: 265, w: 255, h: 78 },
  { key: 'concept:zetsu', parent: 'branch:foundations', kind: 'concept', name: 'Zetsu', mark: '絶', x: 42, y: 365, w: 255, h: 78 },
  { key: 'concept:ren', parent: 'branch:foundations', kind: 'concept', name: 'Ren', mark: '練', x: 42, y: 465, w: 255, h: 78 },
  { key: 'concept:hatsu', parent: 'branch:foundations', kind: 'concept', name: 'Hatsu', mark: '発', x: 42, y: 565, w: 255, h: 78 },
  { key: 'branch:advanced', parent: 'branch:foundations', kind: 'hub', name: 'Advanced Applications', eyebrow: 'Operations', x: 42, y: 705, w: 255, h: 82, summary: 'Operational techniques built from the foundational controls.' },
  ...['Gyo', 'In', 'En', 'Shu', 'Ko', 'Ken', 'Ryu'].map((name, index) => ({ key: `concept:${name.toLowerCase()}`, parent: 'branch:advanced', kind: 'mini', name, x: 42 + (index % 2) * 132, y: 825 + Math.floor(index / 2) * 78, w: 123, h: 62 })),
  { key: 'concept:aura', parent: 'nen', kind: 'concept', name: 'Aura', mark: '気', x: 520, y: 35, w: 185, h: 82 },
  { key: 'concept:aura-nodes', parent: 'concept:aura', kind: 'concept', name: 'Aura nodes', mark: '点', x: 520, y: 135, w: 185, h: 72 },
  { key: 'concept:water-divination', parent: 'nen', kind: 'concept', name: 'Water Divination', mark: '水', x: 1215, y: 35, w: 220, h: 82 },
  { key: 'concept:category-affinity', parent: 'concept:water-divination', kind: 'concept', name: 'Category affinity', mark: '%', x: 1215, y: 135, w: 220, h: 72 },
  { key: 'branch:contracts', parent: 'nen', kind: 'hub', name: 'Contracts & Special States', eyebrow: 'Rules', x: 1620, y: 135, w: 255, h: 82, summary: 'Rules that reshape activation, power, persistence, inheritance, and risk.' },
  { key: 'concept:conditions-and-limitations', parent: 'branch:contracts', kind: 'concept', name: 'Conditions and limitations', mark: '鎖', x: 1620, y: 265, w: 255, h: 78 },
  { key: 'concept:vows', parent: 'branch:contracts', kind: 'concept', name: 'Vows', mark: '誓', x: 1620, y: 365, w: 255, h: 78 },
  { key: 'concept:post-mortem-nen', parent: 'branch:contracts', kind: 'concept', name: 'Post-mortem Nen', mark: '死', x: 1620, y: 465, w: 255, h: 78 },
  { key: 'concept:nen-curses-and-exorcism', parent: 'branch:contracts', kind: 'concept', name: 'Nen curses and exorcism', mark: '呪', x: 1620, y: 565, w: 255, h: 78 },
  { key: 'concept:nen-beasts', parent: 'branch:contracts', kind: 'concept', name: 'Nen beasts', mark: '獣', x: 1620, y: 665, w: 255, h: 78 },
  { key: 'concept:parasitic-nen', parent: 'branch:contracts', kind: 'concept', name: 'Parasitic Nen', mark: '寄', x: 1620, y: 765, w: 255, h: 78 },
  { key: 'concept:collaborative-abilities', parent: 'branch:contracts', kind: 'concept', name: 'Collaborative abilities', mark: '協', x: 1620, y: 865, w: 255, h: 78 },
  { key: 'concept:loaned-stolen-and-inherited-abilities', parent: 'branch:contracts', kind: 'concept', name: 'Loaned, stolen & inherited', mark: '継', x: 1620, y: 965, w: 255, h: 78 },
];

const categoryNodes = categories.flatMap((category) => [
  { ...category, parent: 'nen', kind: 'category', w: 185, h: 112 },
  ...category.users.map(([name, ability, x, y], index) => ({ key: `user:${name}`, parent: category.key, kind: 'user', name, ability, category: category.name, x, y, w: 190, h: 90, portraitName: name, userIndex: index })),
]);
const rawNodes = [{ key: 'nen', kind: 'root', name: 'Nen', eyebrow: 'Complete system', x: 835, y: 475, w: 250, h: 190, summary: 'Life energy controlled through principles, affinity, training, conditions, and individual ability design.' }, ...categoryNodes, ...conceptNodes];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const center = (node) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const fittedView = (viewport) => {
  if (!viewport.width || !viewport.height) return { x: 0, y: 0, scale: 1 };
  const scale = clamp(Math.min((viewport.width - VIEW_MARGIN * 2) / MAP_WIDTH, (viewport.height - VIEW_MARGIN * 2) / MAP_HEIGHT), MIN_SCALE, 1);
  return { scale, x: (viewport.width - MAP_WIDTH * scale) / 2, y: (viewport.height - MAP_HEIGHT * scale) / 2 };
};
const boundedView = (next, viewport) => {
  const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
  const scaledWidth = MAP_WIDTH * scale;
  const scaledHeight = MAP_HEIGHT * scale;
  const fixedX = scaledWidth <= viewport.width ? (viewport.width - scaledWidth) / 2 : clamp(next.x, viewport.width - scaledWidth - VIEW_MARGIN, VIEW_MARGIN);
  const fixedY = scaledHeight <= viewport.height ? (viewport.height - scaledHeight) / 2 : clamp(next.y, viewport.height - scaledHeight - VIEW_MARGIN, VIEW_MARGIN);
  return { scale, x: fixedX, y: fixedY };
};
const pipePath = (source, target) => {
  const a = center(source);
  const b = center(target);
  if (Math.abs(a.x - b.x) > Math.abs(a.y - b.y)) {
    const bend = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} H ${bend} V ${b.y} H ${b.x}`;
  }
  const bend = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} V ${bend} H ${b.x} V ${b.y}`;
};

function Portrait({ name, portraitItemFor }) {
  return <SourcePortrait item={portraitItemFor(name)} alt={`${name} portrait from Hunterpedia`} />;
}

function MapNode({ node, record, active, pinned, onPreview, onClear, onPin, portraitItemFor }) {
  const handlers = { onMouseEnter: () => onPreview(record), onMouseLeave: onClear, onFocus: () => onPreview(record), onBlur: onClear, onClick: () => onPin(record) };
  return <button type="button" className={`nen-pipe-node is-${node.kind}${active ? ' is-active' : ''}${pinned ? ' is-pinned' : ''}`} style={{ left: node.x, top: node.y, width: node.w, height: node.h }} aria-pressed={pinned} {...handlers}>
    {node.kind === 'user' && <Portrait name={node.portraitName} portraitItemFor={portraitItemFor} />}
    <span className="nen-pipe-node__copy">
      {node.mark && <i>{node.mark}</i>}
      {node.eyebrow && <small>{node.eyebrow}</small>}
      <strong>{node.name}</strong>
      {node.code && <em>{node.code} · {node.water}</em>}
      {node.ability && <em>{node.ability}</em>}
      {node.kind === 'hub' && <em>{record.childCount} connected records</em>}
    </span>
  </button>;
}

export default function NenSystemReferenceMap({ records = [], spoilerLimit = 415, portraitItemFor }) {
  const recordsByName = useMemo(() => new Map(records.map((record) => [record.name, record])), [records]);
  const nodeByKey = useMemo(() => new Map(rawNodes.map((node) => [node.key, node])), []);
  const childrenByParent = useMemo(() => rawNodes.reduce((map, node) => { if (node.parent) map.set(node.parent, [...(map.get(node.parent) || []), node.key]); return map; }, new Map()), []);
  const enriched = useMemo(() => rawNodes.map((node) => {
    const source = recordsByName.get(node.name);
    return { ...node, record: { ...node, summary: source?.summary || node.summary || `${node.name} is connected to the wider Nen system.`, mechanics: source?.mechanics || [], study: source?.study || '', related: source?.related || [], source: source?.source || (node.portraitName ? portraitItemFor(node.portraitName)?.source : null), childCount: (childrenByParent.get(node.key) || []).length } };
  }), [childrenByParent, portraitItemFor, recordsByName]);
  const enrichedByKey = useMemo(() => new Map(enriched.map((node) => [node.key, node])), [enriched]);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = hovered || pinned;
  const inspected = active || enrichedByKey.get('nen')?.record;
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const viewRef = useRef(view);
  const gestureRef = useRef({ pointers: new Map(), mode: null, startView: null, startPoint: null, startDistance: 0, startCenter: null, moved: false });
  const suppressClickUntilRef = useRef(0);
  const clearTimerRef = useRef(null);

  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => () => window.clearTimeout(clearTimerRef.current), []);
  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return undefined;
    const update = () => { const rect = element.getBoundingClientRect(); setViewportSize({ width: rect.width, height: rect.height }); };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => { if (viewportSize.width && viewportSize.height) setView(fittedView(viewportSize)); }, [viewportSize.width, viewportSize.height]);

  const updateView = useCallback((updater) => setView((current) => boundedView(typeof updater === 'function' ? updater(current) : updater, viewportSize)), [viewportSize]);
  const zoomAt = useCallback((nextScale, point = { x: viewportSize.width / 2, y: viewportSize.height / 2 }) => updateView((current) => {
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const mapX = (point.x - current.x) / current.scale;
    const mapY = (point.y - current.y) / current.scale;
    return { scale, x: point.x - mapX * scale, y: point.y - mapY * scale };
  }), [updateView, viewportSize]);
  const fitAll = useCallback(() => setView(fittedView(viewportSize)), [viewportSize]);
  const resetView = useCallback(() => setView(boundedView({ scale: 1, x: (viewportSize.width - MAP_WIDTH) / 2, y: VIEW_MARGIN }, viewportSize)), [viewportSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const onWheel = (event) => {
      if (event.target.closest?.('.nen-pipe-inspector,.nen-pipe-controls')) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      zoomAt(viewRef.current.scale * Math.exp(-event.deltaY * .0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const pointerPoint = (event) => { const rect = viewportRef.current?.getBoundingClientRect(); return { x: event.clientX - (rect?.left || 0), y: event.clientY - (rect?.top || 0) }; };
  const pointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = pointerPoint(event);
    const interactive = Boolean(event.target.closest?.('button,a,.nen-pipe-inspector,.nen-pipe-controls'));
    const gesture = gestureRef.current;
    gesture.pointers.set(event.pointerId, { point, interactive });
    if (gesture.pointers.size === 1 && !interactive) { gesture.mode = 'pan'; gesture.startPoint = point; gesture.startView = viewRef.current; gesture.moved = false; event.currentTarget.setPointerCapture?.(event.pointerId); }
    else if (gesture.pointers.size === 2) { const [a, b] = [...gesture.pointers.values()].map((entry) => entry.point); gesture.mode = 'pinch'; gesture.startDistance = Math.max(1, distance(a, b)); gesture.startCenter = midpoint(a, b); gesture.startView = viewRef.current; gesture.moved = false; }
  };
  const pointerMove = (event) => {
    const gesture = gestureRef.current;
    const entry = gesture.pointers.get(event.pointerId);
    if (!entry) return;
    const point = pointerPoint(event);
    gesture.pointers.set(event.pointerId, { ...entry, point });
    if (gesture.mode === 'pinch' && gesture.pointers.size >= 2) {
      const [a, b] = [...gesture.pointers.values()].slice(0, 2).map((item) => item.point);
      const nextCenter = midpoint(a, b);
      const scale = clamp(gesture.startView.scale * (distance(a, b) / gesture.startDistance), MIN_SCALE, MAX_SCALE);
      const mapX = (gesture.startCenter.x - gesture.startView.x) / gesture.startView.scale;
      const mapY = (gesture.startCenter.y - gesture.startView.y) / gesture.startView.scale;
      gesture.moved = true; setDragging(true); setView(boundedView({ scale, x: nextCenter.x - mapX * scale, y: nextCenter.y - mapY * scale }, viewportSize)); event.preventDefault();
    } else if (gesture.mode === 'pan') {
      const dx = point.x - gesture.startPoint.x; const dy = point.y - gesture.startPoint.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) { gesture.moved = true; setDragging(true); }
      setView(boundedView({ ...gesture.startView, x: gesture.startView.x + dx, y: gesture.startView.y + dy }, viewportSize)); event.preventDefault();
    }
  };
  const pointerEnd = (event) => {
    const gesture = gestureRef.current; const moved = gesture.moved; gesture.pointers.delete(event.pointerId);
    if (!gesture.pointers.size) { gesture.mode = null; gesture.moved = false; setDragging(false); if (moved) suppressClickUntilRef.current = performance.now() + 160; }
    try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* already released */ }
  };
  const keyDown = (event) => {
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

  const activeKeys = useMemo(() => {
    const set = new Set();
    let key = active?.key;
    while (key) { set.add(key); key = nodeByKey.get(key)?.parent; }
    const addChildren = (parent) => (childrenByParent.get(parent) || []).forEach((child) => { set.add(child); addChildren(child); });
    if (active?.kind === 'hub' || active?.kind === 'category') addChildren(active.key);
    return set;
  }, [active, childrenByParent, nodeByKey]);
  const preview = (record) => { window.clearTimeout(clearTimerRef.current); setHovered(record); };
  const clearPreview = () => { window.clearTimeout(clearTimerRef.current); clearTimerRef.current = window.setTimeout(() => setHovered(null), 100); };
  const pin = (record) => setPinned((current) => current?.key === record.key ? null : record);
  const relatedNodes = (inspected?.related || []).map((name) => enriched.find((node) => node.name === name)).filter(Boolean).slice(0, 5);

  return <section className="nen-pipe-map" aria-label="Interactive Nen system map" onKeyDown={(event) => { if (event.key === 'Escape') { setPinned(null); setHovered(null); } }}>
    <div ref={viewportRef} className={`nen-pipe-viewport${dragging ? ' is-dragging' : ''}`} tabIndex="0" aria-label="Pan and zoom the complete Nen map. Use arrows to pan, plus and minus to zoom, zero to fit, and R to reset." onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onClickCapture={(event) => { if (performance.now() < suppressClickUntilRef.current) { event.preventDefault(); event.stopPropagation(); } }}>
      <div className="nen-pipe-canvas" style={{ width: MAP_WIDTH, height: MAP_HEIGHT, transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})` }}>
        <svg className="nen-pipe-connectors" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} fill="none" aria-hidden="true">{enriched.filter((node) => node.parent).map((node) => { const parent = enrichedByKey.get(node.parent); return <path key={`${node.parent}-${node.key}`} className={`${node.kind === 'user' ? 'is-user' : node.kind === 'category' ? 'is-category' : node.parent === 'branch:contracts' || node.key === 'branch:contracts' ? 'is-rule' : 'is-core'}${activeKeys.has(node.key) && activeKeys.has(node.parent) ? ' is-active' : ''}`} d={pipePath(parent, node)} />; })}</svg>
        {enriched.map((node) => <MapNode key={node.key} node={node} record={node.record} active={activeKeys.has(node.key)} pinned={pinned?.key === node.key} onPreview={preview} onClear={clearPreview} onPin={pin} portraitItemFor={portraitItemFor} />)}
      </div>
      <div className="nen-pipe-controls" role="group" aria-label="Map controls"><button type="button" onClick={() => zoomAt(viewRef.current.scale * 1.2)} aria-label="Zoom in"><ZoomIn size={18} /></button><button type="button" onClick={() => zoomAt(viewRef.current.scale / 1.2)} aria-label="Zoom out"><ZoomOut size={18} /></button><button type="button" onClick={fitAll} aria-label="Fit entire map"><Maximize2 size={18} /></button><button type="button" onClick={resetView} aria-label="Reset to one hundred percent"><RotateCcw size={18} /></button><output aria-live="polite">{Math.round(view.scale * 100)}%</output></div>
      <aside className={`nen-pipe-inspector${pinned?.key === inspected?.key ? ' is-pinned' : ''}`} onMouseEnter={() => window.clearTimeout(clearTimerRef.current)} onMouseLeave={clearPreview} aria-live="polite"><header><span>{inspected?.eyebrow || inspected?.kind?.replaceAll('-', ' ')}</span><h2>{inspected?.name}</h2>{pinned?.key === inspected?.key && <button type="button" onClick={() => setPinned(null)}>Unpin</button>}</header><p>{inspected?.summary}</p>{inspected?.water && <dl><div><dt>Water Divination</dt><dd>{inspected.water}</dd></div><div><dt>Affinity code</dt><dd>{inspected.code}</dd></div></dl>}{inspected?.ability && <dl><div><dt>Ability</dt><dd>{inspected.ability}</dd></div><div><dt>Category</dt><dd>{inspected.category}</dd></div></dl>}{inspected?.mechanics?.length > 0 && <section><h3>Mechanics</h3><ul>{inspected.mechanics.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></section>}{inspected?.study && <section><h3>Reading note</h3><p>{inspected.study}</p></section>}{relatedNodes.length > 0 && <section><h3>Connected records</h3><div>{relatedNodes.map((node) => <button type="button" onClick={() => setPinned(node.record)} key={node.key}>{node.name}</button>)}</div></section>}{inspected?.source && <a href={inspected.source} target="_blank" rel="noreferrer">Open source <ExternalLink size={13} /></a>}<small>Hover or focus to preview. Click a node to pin this explanation.</small></aside>
    </div>
  </section>;
}
