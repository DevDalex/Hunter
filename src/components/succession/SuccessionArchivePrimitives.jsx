import { ArrowRight, BookOpen, ExternalLink, Link2 } from 'lucide-react';
import { EvidenceBadge, StatusPill } from '../ArchiveUI';
import {
  getEntityById,
  getRelatedEntities,
  getSourcesForEntity,
} from '../../data/succession/successionData';

const cx = (...parts) => parts.filter(Boolean).join(' ');

const evidenceState = (level) => {
  if (level === 'inference') return 'inferred';
  if (level === 'theory') return 'unclear';
  return 'confirmed';
};

export const entityWorkspaceTarget = (entity) => {
  if (!entity) return 'archive';
  if (entity.entityType === 'character') {
    const roles = entity.roles || [];
    if (roles.some((role) => role.includes('prince'))) return 'princes';
    if (roles.some((role) => role.includes('queen') || role === 'royal-parent')) return 'queens';
    if (roles.includes('bodyguard')) return 'bodyguards';
    if (roles.includes('hunter') || roles.includes('zodiac')) return 'hunters';
    return 'characters';
  }
  if (entity.entityType === 'organization') {
    if (entity.organizationType === 'mafia-family') return 'mafia';
    if (entity.organizationType === 'military') return 'military';
    return 'organizations';
  }
  if (entity.entityType === 'ability') return 'nen';
  if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts';
  if (entity.entityType === 'location' || entity.entityType === 'location-history') return 'locations';
  if (entity.entityType === 'event') return 'events';
  if (entity.entityType === 'chapter') return 'chapters';
  if (entity.entityType === 'relationship') return 'relationships';
  if (entity.entityType === 'source') return 'research';
  return 'archive';
};

export function ArchivePageHeader({ kicker, title, description, meta = [], actions }) {
  return <header className="succession-page-header">
    <div className="succession-page-header__copy">
      {kicker && <span>{kicker}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="succession-page-header__actions">{actions}</div>}
    {!!meta.length && <dl className="succession-page-header__meta">
      {meta.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
    </dl>}
  </header>;
}

export function EntityBadge({ entity: suppliedEntity, entityId, compact = false }) {
  const entity = suppliedEntity || getEntityById(entityId);
  if (!entity) return null;
  return <span className={cx('succession-entity-badge', compact && 'is-compact')}>
    <span>{entity.entityType.replaceAll('-', ' ')}</span>
    <b>{entity.name || entity.id}</b>
  </span>;
}

export function EntityLink({ entity: suppliedEntity, entityId, onNavigate, children, className = '' }) {
  const entity = suppliedEntity || getEntityById(entityId);
  if (!entity) return null;
  const target = entityWorkspaceTarget(entity);
  return <button
    type="button"
    className={cx('succession-entity-link', className)}
    onClick={() => onNavigate?.(target, { entity: entity.id })}
  >
    <span>{children || entity.name || entity.id}</span>
    <ArrowRight size={14} aria-hidden="true" />
  </button>;
}

export function EntityHeader({ entity, onNavigate }) {
  if (!entity) return null;
  const sources = getSourcesForEntity(entity.id);
  const chapterBoundary = entity.status?.asOfChapter || entity.chapterRange?.end || entity.chapter || null;
  return <header className="succession-entity-header">
    <div>
      <span>{entity.entityType.replaceAll('-', ' ')}</span>
      <h2>{entity.name || entity.id}</h2>
      {entity.summary && <p>{entity.summary}</p>}
    </div>
    <div className="succession-entity-header__badges">
      <EvidenceBadge state={evidenceState(entity.canonLevel)}>{entity.canonLevel || 'canon'}</EvidenceBadge>
      {chapterBoundary && <StatusPill tone="neutral">As of Ch. {chapterBoundary}</StatusPill>}
      <StatusPill tone="neutral">{sources.length} source{sources.length === 1 ? '' : 's'}</StatusPill>
    </div>
    {!!(entity.aliases || []).length && <div className="succession-entity-header__aliases"><b>Aliases</b><span>{entity.aliases.join(' · ')}</span></div>}
    {onNavigate && <button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate(entityWorkspaceTarget(entity), {})}>Back to workspace</button>}
  </header>;
}

export function SourceReference({ source: suppliedSource, sourceId, onNavigate }) {
  const source = suppliedSource || getEntityById(sourceId);
  if (!source) return null;
  const chapter = source.chapter || null;
  return <article className="succession-source-reference">
    <BookOpen size={17} aria-hidden="true" />
    <div>
      <span>{source.sourceType || 'source'}</span>
      <strong>{chapter ? `Chapter ${chapter}` : source.name || source.id}</strong>
      {source.note && <p>{source.note}</p>}
    </div>
    {chapter && <button type="button" onClick={() => onNavigate?.('reader', { chapter })}>Open reader <ExternalLink size={12} aria-hidden="true" /></button>}
  </article>;
}

export function RelatedEntities({ entityId, onNavigate, limit = 8 }) {
  const related = getRelatedEntities(entityId).slice(0, limit);
  if (!related.length) return null;
  return <section className="succession-related" aria-labelledby="succession-related-title">
    <header><Link2 size={17} aria-hidden="true" /><div><span>Canonical graph</span><h3 id="succession-related-title">Related entities</h3></div></header>
    <div>{related.map((entity) => <EntityLink key={entity.id} entity={entity} onNavigate={onNavigate} />)}</div>
  </section>;
}

export function ArchiveTabs({ items, activeId, onSelect, label }) {
  return <div className="succession-tabs" role="tablist" aria-label={label}>
    {items.map((item) => <button
      type="button"
      role="tab"
      aria-selected={item.id === activeId}
      className={item.id === activeId ? 'is-active' : ''}
      onClick={() => onSelect(item.id)}
      key={item.id}
    >{item.label}</button>)}
  </div>;
}

export function ArchiveState({ kind = 'empty', title, description, action }) {
  return <section className={cx('succession-state', `is-${kind}`)} role={kind === 'error' ? 'alert' : 'status'} aria-live="polite">
    <span>{kind}</span>
    <h2>{title}</h2>
    <p>{description}</p>
    {action}
  </section>;
}
