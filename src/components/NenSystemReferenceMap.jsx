import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import SourcePortrait from './SourcePortrait';

const MAP_WIDTH = 1800;
const MAP_HEIGHT = 1080;
const MIN_SCALE = 0.42;
const MAX_SCALE = 1.9;
const VIEW_MARGIN = 8;
const PAN_STEP = 72;

const categories = [
  { key: 'category:enhancement', name: 'Enhancement', code: 'En', mark: '強', cx: 820, cy: 165, water: 'Water volume changes', summary: 'Strengthen the body, aura, objects, or an existing quality.', users: [['Gon Freecss', 'Jajanken', 675, 22], ['Uvogin', 'Big Bang Impact', 875, 22]] },
  { key: 'category:transmutation', name: 'Transmutation', code: 'Tr', mark: '変', cx: 1100, cy: 330, water: 'Water taste changes', summary: 'Give aura the properties of another substance or phenomenon.', users: [['Killua Zoldyck', 'Godspeed', 1235, 245], ['Hisoka Morow', 'Bungee Gum', 1235, 355]] },
  { key: 'category:conjuration', name: 'Conjuration', code: 'Co', mark: '具', cx: 1100, cy: 660, water: 'Impurities appear', summary: 'Materialize an object, structure, creature, or rule-bearing construct.', users: [['Kurapika', 'Conjured chains', 1235, 620], ['Shizuku Murasaki', 'Blinky', 1235, 730]] },
  { key: 'category:specialization', name: 'Specialization', code: 'Sp', mark: '特', cx: 820, cy: 825, water: 'A unique change occurs', summary: 'Produce an exceptional effect outside the regular five categories.', users: [['Chrollo Lucilfer', 'Skill Hunter', 675, 925], ['Neon Nostrade', 'Lovely Ghostwriter', 875, 925]] },
  { key: 'category:manipulation', name: 'Manipulation', code: 'Ma', mark: '操', cx: 540, cy: 660, water: 'The leaf moves', summary: 'Control a person, object, creature, substance, or process.', users: [['Illumi Zoldyck', 'Needle People', 335, 620], ['Shalnark', 'Black Voice', 335, 730]] },
  { key: 'category:emission', name: 'Emission', code: 'Em', mark: '放', cx: 540, cy: 330, water: 'Water color changes', summary: 'Separate aura from the body while retaining its force or function.', users: [['Leorio Paradinight', 'Remote Punch', 335, 245], ['Razor', '14 Devils', 335, 355]] },
];

const categoryNodes = categories.flatMap((category) => [
  { ...category, kind: 'category', x: category.cx - 74, y: category.cy - 74, w: 148, h: 148 },
  ...category.users.map(([name, ability, x, y]) => ({ key: `user:${name}`, parent: category.key, kind: 'user', name, ability, category: category.name, x, y, w: 176, h: 82, portraitName: name })),
]);

const topicNodes = [
  { key: 'concept:ten', kind: 'topic', group: 'practice', name: 'Ten', mark: '纏', x: 42, y: 240, w: 218, h: 58, summary: 'Keep aura around the body to reduce leakage and create a stable defensive layer.' },
  { key: 'concept:zetsu', kind: 'topic', group: 'practice', name: 'Zetsu', mark: '絶', x: 42, y: 310, w: 218, h: 58, summary: 'Close aura nodes and suppress outward aura, trading defense for concealment and recovery.' },
  { key: 'concept:ren', kind: 'topic', group: 'practice', name: 'Ren', mark: '練', x: 42, y: 380, w: 218, h: 58, summary: 'Produce and maintain a larger quantity of aura.' },
  { key: 'concept:hatsu', kind: 'topic', group: 'practice', name: 'Hatsu', mark: '発', x: 42, y: 450, w: 218, h: 58, summary: 'Express aura through an individual style, category training, or developed ability.' },
  ...['Gyo', 'In', 'En', 'Shu', 'Ko', 'Ken', 'Ryu'].map((name, index) => ({ key: `concept:${name.toLowerCase()}`, kind: 'mini', group: 'practice', name, x: 42 + (index % 2) * 112, y: 620 + Math.floor(index / 2) * 62, w: 106, h: 50 })),
  { key: 'concept:conditions-and-limitations', kind: 'topic', group: 'rules', name: 'Conditions & limitations', mark: '鎖', x: 1488, y: 560, w: 270, h: 58 },
  { key: 'concept:vows', kind: 'topic', group: 'rules', name: 'Vows', mark: '誓', x: 1488, y: 630, w: 270, h: 58 },
  { key: 'concept:post-mortem-nen', kind: 'topic', group: 'rules', name: 'Post-mortem Nen', mark: '死', x: 1488, y: 700, w: 270, h: 58 },
  { key: 'concept:nen-curses-and-exorcism', kind: 'topic', group: 'rules', name: 'Curses & exorcism', mark: '呪', x: 1488, y: 770, w: 270, h: 58 },
  { key: 'concept:nen-beasts', kind: 'topic', group: 'rules', name: 'Nen beasts', mark: '獣', x: 1488, y: 840, w: 270, h: 58 },
  { key: 'concept:parasitic-nen', kind: 'topic', group: 'rules', name: 'Parasitic Nen', mark: '寄', x: 1488, y: 910, w: 270, h: 58 },
];

const rawNodes = [
  { key: 'nen', kind: 'root', name: 'Nen', eyebrow: 'Complete system', x: 690, y: 430, w: 260, h: 145, summary: 'Life energy controlled through principles, affinities, training, conditions, and individual ability design.' },
  ...categoryNodes,
  ...topicNodes,
];

const ringPairs = categories.map((category, index) => [category.key, categories[(index + 1) % categories.length].key]);
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
const branchPath = (source, target) => {
  const a = center(source);
  const b = center(target);
  if (Math.abs(a.x - b.x) >= Math.abs(a.y - b.y)) {
    const bend = a.x + (b.x - a.x) * 0.54;
    return `M ${a.x} ${a.y} H ${bend} V ${b.y} H ${b.x}`;
  }
  const bend = a.y + (b.y - a.y) * 0.54;
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
    </span>
  </button>;
}

export default function NenSystemReferenceMap({ records = [], spoilerLimit = 415, portraitItemFor }) {
  const recordsByName = useMemo(() => new Map(records.map((record) => [record.name, record])), [records]);
  const nodeByKey = useMemo(() => new Map(rawNodes.map((node) => [node.key, node])), []);
  const enriched = useMemo(() => rawNodes.map((node) => {
    const source = recordsByName.get(node.name);
    return { ...node, record: { ...node, summary: source?.summary || node.summary || `${node.name} is connected to the wider Nen system.`, mechanics: source?.mechanics || [], study: source?.study || '', related: source?.related || [], source: source?.source || (node.portraitName ? portraitItemFor(node.portraitName)?.source : null) } };
  }), [portraitItemFor, recordsByName]);
  const enrichedByKey = useMemo(() => new Map(enriched.map((node) => [node.key, node])), [enriched]);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = hovered || pinned;
  const inspected = active || enrichedByKey.get('nen')?.record;
  const activeCategoryKey = active?.kind === 'category' ? active.key : active?.kind === 'user' ? active.parent : null;
  const activeKeys = useMemo(() => {
    const keys = new Set();
    if (!active) return keys;
    keys.add(active.key);
    if (active.kind === 'user' && active.parent) keys.add(active.parent);
    if (active.kind === 'category') enriched.filter((node) => node.parent === active.key).forEach((node) => keys.add(node.key));
    return keys;
  }, [active, enriched]);
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

  const preview = (record) => { window.clearTimeout(clearTimerRef.current); setHovered(record); };
  const clearPreview = () => { window.clearTimeout(clearTimerRef.current); clearTimerRef.current = window.setTimeout(() => setHovered(null), 90); };
  const pin = (record) => setPinned((current) => current?.key === record.key ? null : record);
  const relatedNodes = (inspected?.related || []).map((name) => enriched.find((node) => node.name === name)).filter(Boolean).slice(0, 5);

  return <section className="nen-pipe-map" aria-label="Interactive Nen affinity spectrum" onKeyDown={(event) => { if (event.key === 'Escape') { setPinned(null); setHovered(null); } }}>
    <div ref={viewportRef} className={`nen-pipe-viewport${dragging ? ' is-dragging' : ''}`} tabIndex="0" aria-label="Pan and zoom the complete Nen map. Use arrows to pan, plus and minus to zoom, zero to fit, and R to reset." onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onClickCapture={(event) => { if (performance.now() < suppressClickUntilRef.current) { event.preventDefault(); event.stopPropagation(); } }}>
      <div className="nen-pipe-canvas" style={{ width: MAP_WIDTH, height: MAP_HEIGHT, transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})` }}>
        <section className="nen-reference-panel is-practice" aria-hidden="true"><span>Foundations</span><h2>Four major principles</h2><p>Aura control and advanced applications</p></section>
        <section className="nen-reference-panel is-rules" aria-hidden="true"><span>Rules</span><h2>Contracts & special states</h2><p>Risk, persistence, curses, beasts, and transfer</p></section>
        <svg className="nen-pipe-connectors" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} fill="none" aria-hidden="true">
          {ringPairs.map(([fromKey, toKey]) => {
            const from = enrichedByKey.get(fromKey); const to = enrichedByKey.get(toKey);
            const a = center(from); const b = center(to);
            const activeRing = activeCategoryKey && (activeCategoryKey === fromKey || activeCategoryKey === toKey);
            return <g key={`${fromKey}-${toKey}`} className={activeRing ? 'is-active-ring' : ''}>
              <path className="is-ring-under" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              <path className="is-ring" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              {[0.28, 0.5, 0.72].map((ratio, index) => <circle key={ratio} className={index === 1 ? 'is-halfway' : ''} cx={a.x + (b.x - a.x) * ratio} cy={a.y + (b.y - a.y) * ratio} r={index === 1 ? 8 : 6} />)}
            </g>;
          })}
          {enriched.filter((node) => node.kind === 'user').map((node) => {
            const parent = enrichedByKey.get(node.parent);
            const branchActive = activeKeys.has(node.key) || activeKeys.has(node.parent);
            return <path key={`${node.parent}-${node.key}`} className={`is-user-branch${branchActive ? ' is-active' : ''}`} d={branchPath(parent, node)} />;
          })}
        </svg>
        {enriched.map((node) => <MapNode key={node.key} node={node} record={node.record} active={activeKeys.has(node.key)} pinned={pinned?.key === node.key} onPreview={preview} onClear={clearPreview} onPin={pin} portraitItemFor={portraitItemFor} />)}
      </div>
      <div className="nen-pipe-controls" role="group" aria-label="Map controls"><button type="button" onClick={() => zoomAt(viewRef.current.scale * 1.2)} aria-label="Zoom in"><ZoomIn size={18} /></button><button type="button" onClick={() => zoomAt(viewRef.current.scale / 1.2)} aria-label="Zoom out"><ZoomOut size={18} /></button><button type="button" onClick={fitAll} aria-label="Fit entire map"><Maximize2 size={18} /></button><button type="button" onClick={resetView} aria-label="Reset to one hundred percent"><RotateCcw size={18} /></button><output aria-live="polite">{Math.round(view.scale * 100)}%</output></div>
      <aside className={`nen-pipe-inspector${pinned?.key === inspected?.key ? ' is-pinned' : ''}`} onMouseEnter={() => window.clearTimeout(clearTimerRef.current)} onMouseLeave={clearPreview} aria-live="polite"><header><span>{inspected?.eyebrow || inspected?.group || inspected?.kind?.replaceAll('-', ' ')}</span><h2>{inspected?.name}</h2>{pinned?.key === inspected?.key && <button type="button" onClick={() => setPinned(null)}>Unpin</button>}</header><p>{inspected?.summary}</p>{inspected?.water && <dl><div><dt>Water Divination</dt><dd>{inspected.water}</dd></div><div><dt>Affinity code</dt><dd>{inspected.code}</dd></div></dl>}{inspected?.ability && <dl><div><dt>Ability</dt><dd>{inspected.ability}</dd></div><div><dt>Category</dt><dd>{inspected.category}</dd></div></dl>}{inspected?.mechanics?.length > 0 && <section><h3>Mechanics</h3><ul>{inspected.mechanics.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></section>}{inspected?.study && <section><h3>Reading note</h3><p>{inspected.study}</p></section>}{relatedNodes.length > 0 && <section><h3>Connected records</h3><div>{relatedNodes.map((node) => <button type="button" onClick={() => setPinned(node.record)} key={node.key}>{node.name}</button>)}</div></section>}{inspected?.source && <a href={inspected.source} target="_blank" rel="noreferrer">Open source <ExternalLink size={13} /></a>}<small>Chapter boundary {spoilerLimit}. Hover or focus to preview; click to pin.</small></aside>
    </div>
  </section>;
}
