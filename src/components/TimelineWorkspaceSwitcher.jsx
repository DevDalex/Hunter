import {
  BookOpen,
  BrainCircuit,
  Layers3,
  Rotate3d,
  ShipWheel,
} from 'lucide-react';
import './TimelineWorkspaceSwitcher.css';

export const TIMELINE_WORKSPACE_MODES = Object.freeze([
  { id: 'archive', label: 'Archive', note: 'Search and inspect every record', icon: BookOpen },
  { id: 'story', label: 'Map', note: 'Semantic zoom and parallel story lanes', icon: Rotate3d },
  { id: 'compare', label: 'Compare', note: 'Stack people, factions, threads and places', icon: Layers3 },
  { id: 'atlas', label: 'Research', note: 'Questions, deadlines, princes and causal intelligence', icon: BrainCircuit },
  { id: 'space', label: 'Space', note: 'Black Whale location and movement state', icon: ShipWheel },
]);

const hasArchiveShapedState = (state) => Boolean(
  state.search
  || state.density
  || state.phase
  || state.major
  || state.arrange
  || state.confidence
  || state.location
  || state.day !== undefined
  || state.from !== undefined
  || state.to !== undefined,
);

export function resolveTimelineWorkspaceMode(state = {}) {
  if (state.view === 'intelligence' && state.intel === 'space') return 'space';
  if (state.compare) return 'compare';
  if (['threads', 'people', 'intelligence', 'research'].includes(state.view)) return 'atlas';
  if (TIMELINE_WORKSPACE_MODES.some((mode) => mode.id === state.mode)) return state.mode;
  if (hasArchiveShapedState(state)) return 'archive';
  return 'archive';
}

export default function TimelineWorkspaceSwitcher({ activeMode, requestedState = {}, onNavigate }) {
  const chooseMode = (mode) => {
    const {
      event: _event,
      focus: _focus,
      mode: _mode,
      view: _view,
      intel: _intel,
      compare: _compare,
      ...preserved
    } = requestedState;
    if (mode === 'space') {
      onNavigate?.({ ...preserved, scope: 'events', mode: 'space', view: 'intelligence', intel: 'space' });
      return;
    }
    onNavigate?.({ ...preserved, scope: 'events', mode });
  };

  return <nav className="timeline-workspace-switcher" aria-label="Timeline workspace modes">
    <div className="tws-identity">
      <span>ONE CHRONOLOGY · FIVE LENSES</span>
      <strong>Change representation, not the evidence.</strong>
      <small>Archive, map, comparisons, research intelligence, and ship state all read the same maintained event system.</small>
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
