import {
  BrainCircuit,
  Check,
  CircleHelp,
  GitCompareArrows,
  Languages,
  PencilLine,
  Sparkles,
} from 'lucide-react';
import {
  normalizeSuccessionSemanticState,
  successionSemanticStateMap,
} from '../../data/succession/comprehensionDesignSystem';
import './SuccessionSemanticStateBadge.css';

const icons = Object.freeze({
  canon: Check,
  inference: BrainCircuit,
  theory: Sparkles,
  editorial: PencilLine,
  translation: Languages,
  changed: GitCompareArrows,
  unresolved: CircleHelp,
});

export default function SuccessionSemanticStateBadge({ state = 'canon', children, compact = false }) {
  const normalized = normalizeSuccessionSemanticState(state);
  const semantic = successionSemanticStateMap[normalized];
  const Icon = icons[normalized] || Check;
  return <span className={`succession-semantic-state ${semantic.cssClass}${compact ? ' is-compact' : ''}`} title={semantic.role} data-semantic-state={normalized}>
    <Icon size={compact ? 11 : 12} aria-hidden="true" />
    <span>{children || semantic.label}</span>
  </span>;
}
