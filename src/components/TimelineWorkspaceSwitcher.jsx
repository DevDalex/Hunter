import {
  BookOpen,
  BrainCircuit,
  Layers3,
  Rotate3d,
  ShipWheel,
} from 'lucide-react';
import './TimelineWorkspaceSwitcher.css';

export const TIMELINE_WORKSPACE_MODES = Object.freeze([
  { id: 'story', label: 'Story Map', note: 'Topography, landmarks, and the 2.5D field', icon: Rotate3d },
  { id: 'compare', label: 'Compare', note: 'Build parallel chronologies', icon: Layers3 },
  { id: 'atlas', label: 'Atlas', note: 'Situation, threads, people, intelligence, research', icon: BrainCircuit },
  { id: 'archive', label: 'Archive', note: 'Search and inspect every record', icon: BookOpen },
  { id: 'space', label: 'Space', note: 'Black Whale spatial intelligence', icon: ShipWheel },
]);

const hasArchiveShapedState = (state) => Boolean(
  state.search
  || state.arrange
  || state.confidence
  || state.location
  || state.day !== undefined
  || state.from !== undefined
  || state.to !== undefined,
);

export function resolveTimelineWorkspaceMode(state = {}) {
  if (state.event) return 'event';
  if (state.view === 'intelligence' && state.intel === 'space') return 'space';
  if (TIMELINE_WORKSPACE_MODES.some((mode) => mode.id === state.mode)) return state.mode;
  if (state.compare) return 'compare';
  if (['threads', 'people', 'intelligence', 'research'].includes(state.view)) return 'atlas';
  if (hasArchiveShapedState(state)) return 'archive';
  return 'story';
}

export default function TimelineWorkspaceSwitcher({ activeMode, requestedState = {}, onNavigate }) {
  const chooseMode = (mode) => {
    const { event: _event, mode: _mode, ...preserved } = requestedState;
    if (mode === 'space') {
      onNavigate?.({ ...preserved, scope: 'events', view: 'intelligence', intel: 'space' });
      return;
    }
    const next = { ...preserved, scope: 'events', mode };
    if (mode !== 'atlas' && next.view === 'intelligence' && next.intel === 'space') {
      next.view = 'overview';
      delete next.intel;
    }
    onNavigate?.(next);
  };

  return <nav className="timeline-workspace-switcher" aria-label="Timeline workspace modes">
    <div className="tws-identity">
      <span>REPRESENTATION</span>
      <strong>One archive. Five ways in.</strong>
      <small>Switch views without discarding your chapter, thread, character, or research state.</small>
    </div>
    <div className="tws-modes">
      {TIMELINE_WORKSPACE_MODES.map(({ id, label, note, icon: Icon }) => <button
        type="button"
        className={activeMode === id ? 'is-active' : ''}
        aria-current={activeMode === id ? 'page' : undefined}
        onClick={() => chooseMode(id)}
        key={id}
      >
        <Icon size={15} aria-hidden="true" />
        <span><strong>{label}</strong><small>{note}</small></span>
      </button>)}
    </div>
  </nav>;
}
