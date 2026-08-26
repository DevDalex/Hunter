import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import { getEntityById, getKnowledgeMatrix } from '../../data/succession/successionData';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionPerspectiveFogOverlay.css';

const DEFAULT_CAMERA = Object.freeze({ x: 0, y: 0, scale: .64 });

const classifyKnowledge = (entityId, records, perspective) => {
  if (!entityId) return 'untracked';
  const relevant = records.filter((record) => (record.subjectEntityIds || []).includes(entityId));
  if (!relevant.length) return 'untracked';
  if (relevant.some((record) => (record.misinformedEntityIds || []).includes(perspective))) return 'misinformed';
  if (relevant.some((record) => (record.knowerEntityIds || []).includes(perspective))) return 'known';
  return 'not-listed';
};

export default function SuccessionPerspectiveFogOverlay({ routeId, model }) {
  const explorer = useSuccessionExplorer();
  const canvasRef = useRef(null);
  const [geometry, setGeometry] = useState(null);
  const perspective = explorer.perspective;
  const camera = explorer.cameras[routeId] || DEFAULT_CAMERA;
  const knowledge = useMemo(() => {
    if (perspective === 'reader') return { records: [], counts: {} };
    try {
      const matrix = getKnowledgeMatrix(explorer.chapter);
      const counts = { known: 0, misinformed: 0, 'not-listed': 0, untracked: 0 };
      const states = new Map();
      for (const node of model.nodes) {
        const state = classifyKnowledge(node.entityId, matrix.records || [], perspective);
        states.set(node.id, state);
        counts[state] += 1;
      }
      return { records: matrix.records || [], states, counts };
    } catch {
      return { records: [], states: new Map(), counts: {} };
    }
  }, [explorer.chapter, model.nodes, perspective]);

  useEffect(() => {
    if (perspective === 'reader') return undefined;
    const surface = document.querySelector(`.succession-explorer-surface[data-explorer-route="${routeId}"]`);
    const baseCanvas = surface?.querySelector('.succession-explorer-canvas__surface');
    if (!surface || !baseCanvas) return undefined;
    const measure = () => {
      const surfaceRect = surface.getBoundingClientRect();
      const rect = baseCanvas.getBoundingClientRect();
      setGeometry({
        left: rect.left - surfaceRect.left,
        top: rect.top - surfaceRect.top,
        width: rect.width,
        height: rect.height,
        dpr: Math.min(2, window.devicePixelRatio || 1),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(baseCanvas);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure);
    };
  }, [perspective, routeId]);

  useEffect(() => {
    const overlay = canvasRef.current;
    if (!overlay || !geometry || perspective === 'reader') return;
    const { width, height, dpr } = geometry;
    overlay.width = Math.round(width * dpr);
    overlay.height = Math.round(height * dpr);
    overlay.style.width = `${width}px`;
    overlay.style.height = `${height}px`;
    const ctx = overlay.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(7, 9, 11, .58)';
    ctx.fillRect(0, 0, width, height);

    const cut = (node, alpha, radius) => {
      const x = (node.x + camera.x) * camera.scale;
      const y = (node.y + camera.y) * camera.scale;
      if (x < -radius || x > width + radius || y < -radius || y > height + radius) return;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(0,0,0,${alpha})`);
      gradient.addColorStop(.62, `rgba(0,0,0,${alpha * .82})`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    ctx.globalCompositeOperation = 'destination-out';
    for (const node of model.nodes) {
      const state = knowledge.states?.get(node.id) || 'untracked';
      const baseRadius = Math.max(18, 26 + node.importance * 9) * Math.max(.7, Math.min(1.45, camera.scale));
      if (state === 'known') cut(node, 1, baseRadius * 1.5);
      else if (state === 'misinformed') cut(node, .78, baseRadius * 1.25);
      else if (state === 'untracked') cut(node, .42, baseRadius);
      else cut(node, .18, baseRadius * .78);
    }
    ctx.globalCompositeOperation = 'source-over';

    for (const node of model.nodes) {
      const state = knowledge.states?.get(node.id);
      if (state !== 'misinformed') continue;
      const x = (node.x + camera.x) * camera.scale;
      const y = (node.y + camera.y) * camera.scale;
      if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;
      ctx.strokeStyle = 'rgba(207, 157, 77, .92)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(x, y, 18 + node.importance * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [camera, geometry, knowledge.states, model.nodes, perspective]);

  if (perspective === 'reader' || !geometry) return null;
  const person = getEntityById(perspective);
  return <>
    <canvas
      ref={canvasRef}
      className="succession-perspective-fog"
      style={{ left: geometry.left, top: geometry.top }}
      aria-hidden="true"
    />
    <aside className="succession-perspective-fog__legend" aria-label="Perspective fog of war status">
      <header><Eye size={13} /><span>Perspective</span><strong>{person?.name || 'Selected character'}</strong></header>
      <div><span><i className="is-known" /><Eye size={11} /> Explicitly known</span><b>{knowledge.counts?.known || 0}</b></div>
      <div><span><i className="is-misinformed" /><HelpCircle size={11} /> Misinformed</span><b>{knowledge.counts?.misinformed || 0}</b></div>
      <div><span><i className="is-hidden" /><EyeOff size={11} /> Not listed as knower</span><b>{knowledge.counts?.['not-listed'] || 0}</b></div>
      <small>Fog uses explicit chapter-bounded knowledge records. Untracked points remain partially visible rather than being falsely classified as unknown.</small>
    </aside>
  </>;
}
