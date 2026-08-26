import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Focus, LocateFixed, Minus, Plus, RotateCcw } from 'lucide-react';

const DEFAULT_CAMERA = Object.freeze({ x: 0, y: 0, scale: .64 });
const MIN_SCALE = .18;
const MAX_SCALE = 3.5;
const GRID = 80;

const palette = Object.freeze({
  character: '#d8c7b2',
  prince: '#c7a65b',
  queen: '#b4828d',
  organization: '#a9916b',
  location: '#6f92a4',
  ability: '#806d9c',
  'guardian-beast': '#8c7654',
  event: '#a94854',
  relationship: '#8c969f',
  assignment: '#927b62',
  chapter: '#b8aa93',
  glossary: '#8d9b82',
  source: '#989b9e',
  'knowledge-record': '#788d8c',
  'evidence-item': '#9b816e',
  record: '#9aa3ab',
});

const edgePalette = Object.freeze({
  causes: '#b34b55',
  contains: '#6e8d9d',
  supports: '#8c806b',
  owns: '#806d9c',
  protects: '#738e77',
  surveillance: '#a27d4f',
  hostile: '#a94854',
  relationship: '#68727c',
  link: '#68727c',
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const colorFor = (kind) => palette[kind] || palette.record;
const edgeColorFor = (kind) => edgePalette[kind] || edgePalette.relationship;

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const cameraEqual = (a, b) => Math.abs(a.x - b.x) < .5 && Math.abs(a.y - b.y) < .5 && Math.abs(a.scale - b.scale) < .002;

function semanticNodeVisible(node, scale) {
  if (scale >= .95) return true;
  if (scale >= .55) return node.importance >= .9;
  if (scale >= .35) return node.importance >= 1.6;
  return node.importance >= 2.35;
}

function labelVisible(node, scale, selected) {
  if (selected) return true;
  if (scale >= 1.35) return true;
  if (scale >= .85) return node.importance >= 1.4;
  if (scale >= .48) return node.importance >= 2.25;
  return false;
}

function clusterNodes(nodes, scale) {
  if (scale >= .52) return { nodes, clusters: [] };
  const cellSize = scale < .3 ? 190 : 130;
  const cells = new Map();
  const singles = [];
  for (const current of nodes) {
    if (current.importance >= 2.6) {
      singles.push(current);
      continue;
    }
    const key = `${Math.floor(current.x / cellSize)}:${Math.floor(current.y / cellSize)}`;
    const bucket = cells.get(key) || [];
    bucket.push(current);
    cells.set(key, bucket);
  }
  const clusters = [];
  for (const [key, bucket] of cells.entries()) {
    if (bucket.length < 3) singles.push(...bucket);
    else {
      const x = bucket.reduce((sum, item) => sum + item.x, 0) / bucket.length;
      const y = bucket.reduce((sum, item) => sum + item.y, 0) / bucket.length;
      clusters.push({ id: `cluster:${key}`, x, y, count: bucket.length, nodes: bucket });
    }
  }
  return { nodes: singles, clusters };
}

export default function SuccessionExplorerCanvas({
  model,
  selectedId = null,
  onSelect,
  initialCamera = null,
  onCameraChange,
  className = '',
}) {
  const canvasRef = useRef(null);
  const minimapRef = useRef(null);
  const shellRef = useRef(null);
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const lastPersistedRef = useRef(initialCamera || DEFAULT_CAMERA);
  const [camera, setCameraState] = useState(() => ({ ...DEFAULT_CAMERA, ...(initialCamera || {}) }));
  const [size, setSize] = useState({ width: 1200, height: 620, dpr: 1 });
  const [hoveredId, setHoveredId] = useState(null);

  const nodeById = useMemo(() => new Map(model.nodes.map((item) => [item.id, item])), [model.nodes]);
  const selectedNode = selectedId ? nodeById.get(selectedId) || model.nodes.find((item) => item.entityId === selectedId) : null;
  const visibleBase = useMemo(() => model.nodes.filter((item) => semanticNodeVisible(item, camera.scale)), [camera.scale, model.nodes]);
  const semantic = useMemo(() => clusterNodes(visibleBase, camera.scale), [camera.scale, visibleBase]);
  const visibleNodeIds = useMemo(() => new Set(semantic.nodes.map((item) => item.id)), [semantic.nodes]);

  const setCamera = useCallback((next) => {
    setCameraState((current) => {
      const value = typeof next === 'function' ? next(current) : next;
      const normalized = {
        x: Number.isFinite(value.x) ? value.x : current.x,
        y: Number.isFinite(value.y) ? value.y : current.y,
        scale: clamp(Number.isFinite(value.scale) ? value.scale : current.scale, MIN_SCALE, MAX_SCALE),
      };
      return cameraEqual(current, normalized) ? current : normalized;
    });
  }, []);

  useEffect(() => {
    if (!initialCamera) return;
    setCamera((current) => cameraEqual(current, initialCamera) ? current : ({ ...current, ...initialCamera }));
  }, [initialCamera, setCamera]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      setSize({ width: Math.max(320, rect.width), height: Math.max(360, rect.height), dpr });
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onCameraChange) return undefined;
    const handle = window.setTimeout(() => {
      if (!cameraEqual(lastPersistedRef.current, camera)) {
        lastPersistedRef.current = camera;
        onCameraChange(camera);
      }
    }, 160);
    return () => window.clearTimeout(handle);
  }, [camera, onCameraChange]);

  const worldToScreen = useCallback((x, y) => ({
    x: (x + camera.x) * camera.scale,
    y: (y + camera.y) * camera.scale,
  }), [camera]);

  const screenToWorld = useCallback((x, y) => ({
    x: x / camera.scale - camera.x,
    y: y / camera.scale - camera.y,
  }), [camera]);

  const fit = useCallback((targetNode = null) => {
    if (targetNode) {
      const scale = Math.max(.95, camera.scale);
      setCamera({
        scale,
        x: size.width / (2 * scale) - targetNode.x,
        y: size.height / (2 * scale) - targetNode.y,
      });
      return;
    }
    const margin = 70;
    const sx = (size.width - margin * 2) / Math.max(1, model.world.width);
    const sy = (size.height - margin * 2) / Math.max(1, model.world.height);
    const scale = clamp(Math.min(sx, sy), MIN_SCALE, 1.1);
    setCamera({
      scale,
      x: (size.width / scale - model.world.width) / 2,
      y: (size.height / scale - model.world.height) / 2,
    });
  }, [camera.scale, model.world.height, model.world.width, setCamera, size.height, size.width]);

  const zoomAt = useCallback((screenX, screenY, multiplier) => {
    setCamera((current) => {
      const oldScale = current.scale;
      const nextScale = clamp(oldScale * multiplier, MIN_SCALE, MAX_SCALE);
      const worldX = screenX / oldScale - current.x;
      const worldY = screenY / oldScale - current.y;
      return {
        scale: nextScale,
        x: screenX / nextScale - worldX,
        y: screenY / nextScale - worldY,
      };
    });
  }, [setCamera]);

  const hitTest = useCallback((screenX, screenY) => {
    const world = screenToWorld(screenX, screenY);
    let nearest = null;
    let nearestDistance = Infinity;
    for (const current of semantic.nodes) {
      const radius = 10 + current.importance * 3 + 8 / camera.scale;
      const distance = Math.hypot(current.x - world.x, current.y - world.y);
      if (distance <= radius && distance < nearestDistance) {
        nearest = current;
        nearestDistance = distance;
      }
    }
    if (nearest) return { type: 'node', value: nearest };
    for (const cluster of semantic.clusters) {
      const radius = 26 / camera.scale;
      const distance = Math.hypot(cluster.x - world.x, cluster.y - world.y);
      if (distance <= radius) return { type: 'cluster', value: cluster };
    }
    return null;
  }, [camera.scale, screenToWorld, semantic.clusters, semantic.nodes]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height, dpr } = size;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0e1114';
    ctx.fillRect(0, 0, width, height);

    const gridStep = GRID * camera.scale;
    if (gridStep >= 18) {
      ctx.strokeStyle = camera.scale > .7 ? 'rgba(230,225,215,.055)' : 'rgba(230,225,215,.035)';
      ctx.lineWidth = 1;
      const offsetX = ((camera.x * camera.scale) % gridStep + gridStep) % gridStep;
      const offsetY = ((camera.y * camera.scale) % gridStep + gridStep) % gridStep;
      ctx.beginPath();
      for (let x = offsetX; x <= width; x += gridStep) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = offsetY; y <= height; y += gridStep) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();
    }

    const nodePositions = new Map(semantic.nodes.map((item) => [item.id, worldToScreen(item.x, item.y)]));
    for (const current of model.edges) {
      if (!visibleNodeIds.has(current.source) || !visibleNodeIds.has(current.target)) continue;
      const source = nodePositions.get(current.source);
      const target = nodePositions.get(current.target);
      if (!source || !target) continue;
      const outside = Math.max(source.x, target.x) < -30 || Math.min(source.x, target.x) > width + 30 || Math.max(source.y, target.y) < -30 || Math.min(source.y, target.y) > height + 30;
      if (outside) continue;
      ctx.strokeStyle = `${edgeColorFor(current.kind)}${camera.scale > .8 ? '82' : '50'}`;
      ctx.lineWidth = Math.max(.55, current.strength * Math.min(1.8, camera.scale));
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      const curve = Math.min(36, Math.abs(target.x - source.x) * .08);
      ctx.bezierCurveTo(source.x + curve, source.y, target.x - curve, target.y, target.x, target.y);
      ctx.stroke();
      if (current.directed && camera.scale > .55) {
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrow = 5 + Math.min(4, current.strength);
        ctx.fillStyle = edgeColorFor(current.kind);
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(target.x - Math.cos(angle - .5) * arrow, target.y - Math.sin(angle - .5) * arrow);
        ctx.lineTo(target.x - Math.cos(angle + .5) * arrow, target.y - Math.sin(angle + .5) * arrow);
        ctx.closePath();
        ctx.fill();
      }
    }

    for (const cluster of semantic.clusters) {
      const p = worldToScreen(cluster.x, cluster.y);
      if (p.x < -60 || p.x > width + 60 || p.y < -60 || p.y > height + 60) continue;
      const radius = 18 + Math.min(15, Math.log2(cluster.count + 1) * 3);
      ctx.fillStyle = '#1f252b';
      ctx.strokeStyle = '#70675a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f1ece3';
      ctx.font = '700 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(cluster.count), p.x, p.y);
    }

    for (const current of semantic.nodes) {
      const p = nodePositions.get(current.id);
      if (!p || p.x < -220 || p.x > width + 220 || p.y < -80 || p.y > height + 80) continue;
      const selected = selectedId === current.id || selectedId === current.entityId;
      const hovered = hoveredId === current.id;
      const radius = 5.5 + current.importance * 2.4 + (selected ? 3 : 0);
      ctx.fillStyle = colorFor(current.kind);
      ctx.strokeStyle = selected ? '#f6e5b2' : hovered ? '#f2eee6' : '#111417';
      ctx.lineWidth = selected ? 3 : hovered ? 2 : 1.5;
      ctx.beginPath();
      if (current.kind === 'chapter') {
        ctx.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
      } else if (current.kind === 'location' || current.kind === 'organization') {
        ctx.moveTo(p.x, p.y - radius);
        ctx.lineTo(p.x + radius, p.y);
        ctx.lineTo(p.x, p.y + radius);
        ctx.lineTo(p.x - radius, p.y);
        ctx.closePath();
      } else {
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();

      if (labelVisible(current, camera.scale, selected || hovered)) {
        const label = current.label.length > 34 ? `${current.label.slice(0, 32)}…` : current.label;
        ctx.font = `${selected ? 700 : 600} ${selected ? 12 : 10.5}px Inter, sans-serif`;
        const textWidth = ctx.measureText(label).width;
        const boxWidth = textWidth + 14;
        const boxHeight = selected ? 24 : 21;
        const boxX = p.x + radius + 7;
        const boxY = p.y - boxHeight / 2;
        drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 4);
        ctx.fillStyle = selected ? 'rgba(244,238,226,.98)' : 'rgba(20,24,28,.91)';
        ctx.fill();
        ctx.strokeStyle = selected ? '#a98b55' : 'rgba(214,207,194,.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = selected ? '#17191c' : '#e6e1d8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, boxX + 7, p.y + .5);
      }
    }

    const mini = minimapRef.current;
    if (mini) {
      const miniWidth = 220;
      const miniHeight = 110;
      mini.width = Math.round(miniWidth * dpr);
      mini.height = Math.round(miniHeight * dpr);
      mini.style.width = `${miniWidth}px`;
      mini.style.height = `${miniHeight}px`;
      const mctx = mini.getContext('2d');
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.clearRect(0, 0, miniWidth, miniHeight);
      mctx.fillStyle = '#111519';
      mctx.fillRect(0, 0, miniWidth, miniHeight);
      const sx = miniWidth / Math.max(1, model.world.width);
      const sy = miniHeight / Math.max(1, model.world.height);
      const ms = Math.min(sx, sy);
      const ox = (miniWidth - model.world.width * ms) / 2;
      const oy = (miniHeight - model.world.height * ms) / 2;
      for (const current of model.nodes) {
        mctx.fillStyle = colorFor(current.kind);
        mctx.globalAlpha = current.importance >= 2 ? .9 : .45;
        mctx.fillRect(ox + current.x * ms, oy + current.y * ms, current.importance >= 2 ? 2.5 : 1.5, current.importance >= 2 ? 2.5 : 1.5);
      }
      mctx.globalAlpha = 1;
      const worldLeft = -camera.x;
      const worldTop = -camera.y;
      const worldWidth = width / camera.scale;
      const worldHeight = height / camera.scale;
      mctx.strokeStyle = '#c9a86a';
      mctx.lineWidth = 1.3;
      mctx.strokeRect(ox + worldLeft * ms, oy + worldTop * ms, worldWidth * ms, worldHeight * ms);
    }
  }, [camera, hoveredId, model.edges, model.nodes, model.world.height, model.world.width, selectedId, semantic.clusters, semantic.nodes, size, visibleNodeIds, worldToScreen]);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(render);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [render]);

  const pointerCoordinates = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event) => {
    const point = pointerCoordinates(event);
    const hit = hitTest(point.x, point.y);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
      moved: false,
      hit,
    };
    canvasRef.current.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (drag?.pointerId === event.pointerId) {
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.hypot(dx, dy) > 3) drag.moved = true;
      if (drag.moved) setCamera((current) => ({
        ...current,
        x: drag.cameraX + dx / current.scale,
        y: drag.cameraY + dy / current.scale,
      }));
      return;
    }
    const point = pointerCoordinates(event);
    const hit = hitTest(point.x, point.y);
    setHoveredId(hit?.type === 'node' ? hit.value.id : null);
  };

  const onPointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && drag.hit) {
      if (drag.hit.type === 'node') onSelect?.(drag.hit.value);
      if (drag.hit.type === 'cluster') {
        const point = worldToScreen(drag.hit.value.x, drag.hit.value.y);
        zoomAt(point.x, point.y, 1.8);
      }
    }
    dragRef.current = null;
    try { canvasRef.current.releasePointerCapture(event.pointerId); } catch { /* no-op */ }
  };

  const onWheel = (event) => {
    event.preventDefault();
    const point = pointerCoordinates(event);
    zoomAt(point.x, point.y, event.deltaY < 0 ? 1.14 : .88);
  };

  const onDoubleClick = (event) => {
    const point = pointerCoordinates(event);
    const hit = hitTest(point.x, point.y);
    if (hit?.type === 'node') fit(hit.value);
    else zoomAt(point.x, point.y, 1.45);
  };

  const onKeyDown = (event) => {
    const pan = 90 / camera.scale;
    if (event.key === 'ArrowLeft') { event.preventDefault(); setCamera((current) => ({ ...current, x: current.x + pan })); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); setCamera((current) => ({ ...current, x: current.x - pan })); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setCamera((current) => ({ ...current, y: current.y + pan })); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); setCamera((current) => ({ ...current, y: current.y - pan })); }
    else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAt(size.width / 2, size.height / 2, 1.18); }
    else if (event.key === '-') { event.preventDefault(); zoomAt(size.width / 2, size.height / 2, .84); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); fit(selectedNode || null); }
    else if (event.key === '0') { event.preventDefault(); fit(); }
  };

  const onMinimapPointerDown = (event) => {
    const rect = minimapRef.current.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const sx = rect.width / Math.max(1, model.world.width);
    const sy = rect.height / Math.max(1, model.world.height);
    const ms = Math.min(sx, sy);
    const ox = (rect.width - model.world.width * ms) / 2;
    const oy = (rect.height - model.world.height * ms) / 2;
    const worldX = clamp((px - ox) / ms, 0, model.world.width);
    const worldY = clamp((py - oy) / ms, 0, model.world.height);
    setCamera((current) => ({
      ...current,
      x: size.width / (2 * current.scale) - worldX,
      y: size.height / (2 * current.scale) - worldY,
    }));
  };

  return <div ref={shellRef} className={`succession-explorer-canvas ${className}`.trim()}>
    <canvas
      ref={canvasRef}
      className="succession-explorer-canvas__surface"
      tabIndex="0"
      role="application"
      aria-label={`Interactive ${model.routeId} explorer. Drag to pan, use the mouse wheel or plus and minus keys to zoom, arrow keys to move, F to focus selection, and 0 to fit all.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { dragRef.current = null; }}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    />
    <div className="succession-explorer-canvas__tools" aria-label="Atlas camera controls">
      <button type="button" onClick={() => zoomAt(size.width / 2, size.height / 2, 1.18)} aria-label="Zoom in"><Plus size={15} /></button>
      <button type="button" onClick={() => zoomAt(size.width / 2, size.height / 2, .84)} aria-label="Zoom out"><Minus size={15} /></button>
      <button type="button" onClick={() => fit(selectedNode || null)} aria-label="Focus selected record"><Focus size={15} /></button>
      <button type="button" onClick={() => fit()} aria-label="Fit all records"><LocateFixed size={15} /></button>
      <button type="button" onClick={() => setCamera({ ...DEFAULT_CAMERA })} aria-label="Reset camera"><RotateCcw size={15} /></button>
      <span>{Math.round(camera.scale * 100)}%</span>
    </div>
    <button type="button" className="succession-explorer-canvas__minimap" onPointerDown={onMinimapPointerDown} aria-label="Move camera using minimap">
      <canvas ref={minimapRef} aria-hidden="true" />
    </button>
    <div className="succession-explorer-canvas__status" aria-hidden="true">
      <span>{model.stats.visible.toLocaleString()} / {model.stats.total.toLocaleString()}</span>
      <small>{model.stats.label}</small>
    </div>
  </div>;
}
