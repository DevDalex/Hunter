import { ArrowRight, BookOpen, Clock3, HelpCircle, Sparkles } from 'lucide-react';
import {
  getChapterStateDiff,
  getEntityById,
  getEntityStateAtChapter,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionEntityQuickBriefing.css';

const labelize = (value) => String(value ?? 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const unresolvedPattern = /^(unknown|unresolved|not specified|none published|unclassified)$/i;
const asCount = (value) => Array.isArray(value) ? value.length : value && typeof value === 'object' ? Object.keys(value).length : null;

const unresolvedFields = (state = {}) => Object.entries(state || {}).filter(([, value]) => {
  if (Array.isArray(value)) return false;
  if (value === null || value === undefined || value === '') return true;
  return unresolvedPattern.test(String(value));
});

const stateSentence = (entity, state, chapter) => {
  if (!state) return `${entity.name || entity.id} has no published chapter-bounded state at Chapter ${chapter}.`;
  if (entity.entityType === 'character') {
    const location = state.locationId ? getEntityById(state.locationId)?.name || state.locationId : 'an unresolved location';
    return `${entity.name} is ${labelize(state.life).toLowerCase()}, at ${location}, with ${state.assignmentIds?.length || 0} active assignments and ${state.relationshipIds?.length || 0} maintained relationship edges at Chapter ${chapter}.`;
  }
  if (entity.entityType === 'organization') return `${entity.name} is ${labelize(state.status).toLowerCase()} with ${state.personnelIds?.length || 0} active personnel; its maintained objective is ${String(state.objective || 'unresolved')}.`;
  if (entity.entityType === 'ability') return `${entity.name} is ${labelize(state.knowledgeState).toLowerCase()} at Chapter ${chapter}, with ${state.conditions?.length || 0} published conditions, ${state.limitations?.length || 0} limitations, and ${state.costs?.length || 0} costs.`;
  if (entity.entityType === 'guardian-beast') return `${entity.name} is ${labelize(state.state).toLowerCase()} at Chapter ${chapter}; ${state.knownAbilityIds?.length || 0} abilities are maintained as known and ${state.suspectedAbilityIds?.length || 0} as suspected.`;
  if (entity.entityType === 'location') return `${entity.name} is a ${labelize(state.zoneRole).toLowerCase()} space with ${labelize(state.accessLevel).toLowerCase()} access, ${state.occupantIds?.length || 0} occupants, ${state.activeEventIds?.length || 0} active events, and ${state.activeAssignmentIds?.length || 0} assignments at Chapter ${chapter}.`;
  if (entity.entityType === 'event') return `${entity.name} is ${labelize(state.status).toLowerCase()} at Chapter ${chapter}, with ${state.participantIds?.length || 0} participants, ${state.organizationIds?.length || 0} organizations, and ${state.outcomeCount || 0} maintained outcomes.`;
  if (entity.entityType === 'knowledge-record') return `${entity.name} is ${labelize(state.knowledgeState).toLowerCase()} and ${labelize(state.secrecy).toLowerCase()} at Chapter ${chapter}, with ${state.knowerEntityIds?.length || 0} maintained knowers.`;
  if (entity.entityType === 'protocol') return `${entity.name} is a ${labelize(state.domain).toLowerCase()} protocol with ${labelize(state.protocolStatus).toLowerCase()} status at Chapter ${chapter}.`;
  return `${entity.name || entity.id} is available at Chapter ${chapter} with ${labelize(state.status || entity.publicationStatus || 'published').toLowerCase()} archive status.`;
};

export default function SuccessionEntityQuickBriefing({ entity, chapter = 417, onNavigate }) {
  if (!entity) return null;
  const boundary = Number(chapter) || 417;
  const previous = Math.max(340, boundary - 1);
  const state = getEntityStateAtChapter(entity, boundary);
  const sources = getSourcesForEntity(entity.id) || [];
  const diff = getChapterStateDiff(previous, boundary, { types: [entity.entityType], changedOnly: false });
  const delta = diff.records.find((record) => record.entity.id === entity.id) || null;
  const unresolved = unresolvedFields(state);
  const arrays = Object.entries(state || {}).filter(([, value]) => Array.isArray(value));
  const linkedCount = arrays.reduce((total, [, value]) => total + value.length, 0);
  const destination = entityWorkspaceTarget(entity);

  return <section className="succession-entity-quick" aria-labelledby={`succession-entity-quick-${entity.id.replace(/[^a-z0-9_-]/gi, '-')}`}>
    <header>
      <span><Sparkles size={14} aria-hidden="true" /> Five-second briefing · Chapter {boundary}</span>
      <h2 id={`succession-entity-quick-${entity.id.replace(/[^a-z0-9_-]/gi, '-')}`}>{entity.name || entity.id}</h2>
      <p>{stateSentence(entity, state, boundary)}</p>
    </header>
    <dl>
      <div><dt><Clock3 size={12} aria-hidden="true" /> Recent change</dt><dd>{delta ? labelize(delta.status) : 'Unavailable'}<small>{previous} → {boundary}{delta?.deltas?.length ? ` · ${delta.deltas.length} changed fields` : ''}</small></dd></div>
      <div><dt><BookOpen size={12} aria-hidden="true" /> Evidence</dt><dd>{sources.length}<small>linked source record{sources.length === 1 ? '' : 's'}</small></dd></div>
      <div><dt><HelpCircle size={12} aria-hidden="true" /> Unknown / unresolved</dt><dd>{unresolved.length}<small>{unresolved.slice(0, 3).map(([key]) => labelize(key)).join(' · ') || 'No generic unresolved state field'}</small></dd></div>
      <div><dt><ArrowRight size={12} aria-hidden="true" /> Connected state</dt><dd>{linkedCount}<small>{arrays.length} maintained list field{arrays.length === 1 ? '' : 's'}</small></dd></div>
    </dl>
    <footer><button type="button" onClick={() => onNavigate(destination, { entity: entity.id, chapter: boundary })}>Open canonical dossier <ArrowRight size={12} aria-hidden="true" /></button><button type="button" onClick={() => onNavigate('research', { mode: 'overview' })}>Research context <ArrowRight size={12} aria-hidden="true" /></button></footer>
  </section>;
}
