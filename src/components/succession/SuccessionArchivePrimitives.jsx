import { useRef } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, Clock3, ExternalLink, Link2 } from 'lucide-react';
import { EvidenceBadge, StatusPill } from '../ArchiveUI';
import SafeImage from '../SafeImage';
import {
  getEntityById,
  getRecordCurrency,
  getRelatedEntities,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import './SuccessionArchiveCurrency.css';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const initials = (name = '') => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || '?';
const safeId = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const evidenceState = (level) => {
  if (level === 'inference') return 'inferred';
  if (level === 'theory') return 'unclear';
  return 'confirmed';
};

export const entityWorkspaceTarget = (entity) => {
  if (!entity) return 'archive';
  if (entity.entityType === 'character') return 'characters';
  if (entity.entityType === 'organization') return 'organizations';
  if (entity.entityType === 'ability') return 'nen';
  if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts';
  if (entity.entityType === 'location' || entity.entityType === 'location-history') return 'locations';
  if (entity.entityType === 'event') return 'events';
  if (entity.entityType === 'assignment') return 'bodyguards';
  if (entity.entityType === 'chapter') return 'chapters';
  if (entity.entityType === 'relationship') return 'relationships';
  if (entity.entityType === 'source') return 'research';
  return 'archive';
};

export function ArchivePageHeader({ kicker, title, description, meta = [], actions, headingLevel = 'h2' }) {
  const visibleMeta = meta.filter((item) => item && item.label && item.value != null);
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';
  return <header className="succession-page-header">
    <div className="succession-page-header__main">
      <div className="succession-page-header__classification" aria-hidden="true">
        <span>Archive brief</span>
        <span className="succession-page-header__classification-rule" />
        <span>Workspace record</span>
      </div>
      <div className="succession-page-header__body">
        <div className="succession-page-header__copy">
          {kicker && <span className="succession-page-header__kicker">{kicker}</span>}
          <Heading>{title}</Heading>
          {description && <p className="succession-page-header__description">{description}</p>}
        </div>
        {actions && <div className="succession-page-header__actions" aria-label="Page actions">{actions}</div>}
      </div>
    </div>
    {!!visibleMeta.length && <dl className="succession-page-header__meta" aria-label="Workspace metadata">
      {visibleMeta.map((item, index) => <div className="succession-page-header__meta-item" key={`${item.label}-${index}`}>
        <dt>
          <span className="succession-page-header__meta-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <b>{item.label}</b>
        </dt>
        <dd>{item.value}</dd>
      </div>)}
    </dl>}
  </header>;
}

export function EntityVisual({ entity: suppliedEntity, entityId, compact = false, eager = false }) {
  const entity = suppliedEntity || getEntityById(entityId);
  if (!entity) return null;
  const label = entity.name || entity.id;
  const portrait = entity.media?.portrait || null;
  return <span className={cx('succession-entity-visual', compact && 'is-compact')} data-has-visual={portrait ? 'true' : 'false'}>
    <SafeImage
      src={portrait}
      media={entity.media}
      fallbackLabel={initials(label)}
      alt={`${label} archive visual`}
      eager={eager}
    />
  </span>;
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

export function RecordCurrencyPanel({ entity: suppliedEntity, entityId, readingBoundary }) {
  const entity = suppliedEntity || getEntityById(entityId);
  const currency = entity ? getRecordCurrency(entity, readingBoundary) : null;
  if (!currency) return null;
  const gapLabel = currency.coverageGap?.from
    ? `Ch. ${currency.coverageGap.from}–${currency.coverageGap.to}`
    : currency.coverageGap
      ? `Through Ch. ${currency.coverageGap.to}`
      : 'None';
  return <section className={cx('succession-record-currency', `is-${currency.state}`)} aria-label={`${entity.name || entity.id} research currency`}>
    <dl className="succession-record-currency__metrics">
      <div><dt>Reading boundary</dt><dd>Chapter {currency.readingBoundary}</dd></div>
      <div><dt>Record verified through</dt><dd>{currency.verifiedLabel}</dd></div>
      <div><dt>Coverage gap</dt><dd>{gapLabel}</dd></div>
    </dl>
    {currency.coverageGap && <div className="succession-record-currency__warning" role="status">
      <AlertTriangle size={17} aria-hidden="true" />
      <div><strong>This record is behind the selected boundary.</strong><span>Published material after {currency.verifiedLabel} is not represented as maintained evidence for this active record.</span></div>
    </div>}
    {!!(currency.recentChanges.length || currency.openQuestions.length) && <div className="succession-record-currency__details">
      {!!currency.recentChanges.length && <section className="succession-record-currency__section">
        <header><Clock3 size={14} aria-hidden="true" /><span>Recent changes</span></header>
        <ul>{currency.recentChanges.map((change) => <li key={change}>{change}</li>)}</ul>
      </section>}
      {!!currency.openQuestions.length && <section className="succession-record-currency__section">
        <header><AlertTriangle size={14} aria-hidden="true" /><span>Open questions</span></header>
        <ul>{currency.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
      </section>}
    </div>}
  </section>;
}

export function EntityHeader({ entity, onNavigate }) {
  if (!entity) return null;
  const sources = getSourcesForEntity(entity.id);
  const chapterBoundary = entity.status?.asOfChapter || entity.chapterRange?.end || entity.chapter || null;
  return <>
    <header className="succession-entity-header">
      <EntityVisual entity={entity} eager />
      <div className="succession-entity-header__copy">
        <span>{entity.entityType.replaceAll('-', ' ')}</span>
        <h2>{entity.name || entity.id}</h2>
        {entity.summary && <p>{entity.summary}</p>}
        <div className="succession-entity-header__badges">
          <EvidenceBadge state={evidenceState(entity.canonLevel)}>{entity.canonLevel || 'canon'}</EvidenceBadge>
          {entity.status?.life && <StatusPill tone="neutral">{entity.status.life}</StatusPill>}
          {chapterBoundary && <StatusPill tone="neutral">As of Ch. {chapterBoundary}</StatusPill>}
          <StatusPill tone="neutral">{sources.length} source{sources.length === 1 ? '' : 's'}</StatusPill>
        </div>
        {!!(entity.aliases || []).length && <div className="succession-entity-header__aliases"><b>Aliases</b><span>{entity.aliases.join(' · ')}</span></div>}
        <div className="succession-entity-header__actions">
          {entity.referenceUrl && <a className="succession-button succession-button--quiet" href={entity.referenceUrl} target="_blank" rel="noreferrer noopener">Hunterpedia <ExternalLink size={13} aria-hidden="true" /></a>}
          {onNavigate && <button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate(entityWorkspaceTarget(entity), {})}>Back to workspace</button>}
        </div>
      </div>
    </header>
    <RecordCurrencyPanel entity={entity} />
  </>;
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
    <div className="succession-source-reference__actions">
      {chapter && <button type="button" onClick={() => onNavigate?.('reader', { chapter })}>Open reader <BookOpen size={12} aria-hidden="true" /></button>}
      {source.url && <a href={source.url} target="_blank" rel="noreferrer noopener">Open source <ExternalLink size={12} aria-hidden="true" /></a>}
    </div>
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

export function ArchiveTabs({ items, activeId, onSelect, label, id = 'succession-tabs', panelId }) {
  const tabRefs = useRef(new Map());
  const focusAndSelect = (item) => {
    if (!item) return;
    onSelect(item.id);
    requestAnimationFrame(() => tabRefs.current.get(item.id)?.focus());
  };
  const handleKeyDown = (event, currentIndex) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : event.key === 'ArrowRight'
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length;
    focusAndSelect(items[nextIndex]);
  };
  return <div className="succession-tabs" role="tablist" aria-label={label} id={id}>
    {items.map((item, index) => {
      const selected = item.id === activeId;
      const tabId = `${id}-${safeId(item.id)}`;
      return <button
        type="button"
        id={tabId}
        role="tab"
        aria-selected={selected}
        aria-controls={item.panelId || panelId || undefined}
        tabIndex={selected ? 0 : -1}
        className={selected ? 'is-active' : ''}
        onClick={() => onSelect(item.id)}
        onKeyDown={(event) => handleKeyDown(event, index)}
        ref={(node) => {
          if (node) tabRefs.current.set(item.id, node);
          else tabRefs.current.delete(item.id);
        }}
        key={item.id}
      >{item.label}</button>;
    })}
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
