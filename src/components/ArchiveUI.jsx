import { ExternalLink } from 'lucide-react';
import { toneForEvidenceState } from '../data/archiveDesignSystem.js';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const safeRel = 'noreferrer noopener';

export function ArchiveSection({ id, kicker, title, description, actions, compact = false, className = '', children }) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={cx('archive-section', compact && 'archive-section--compact', className)} aria-labelledby={headingId}>
      <header className="archive-section__header">
        <div>
          {kicker && <span className="section-kicker">{kicker}</span>}
          <h2 id={headingId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="archive-section__actions">{actions}</div>}
      </header>
      <div className="archive-section__body">{children}</div>
    </section>
  );
}

export function ArchiveCard({ as: Element = 'article', tone = 'paper', eyebrow, title, meta, href, onClick, children, className = '' }) {
  const interactive = href || onClick;
  const Component = href ? 'a' : onClick ? 'button' : Element;
  const props = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? safeRel : undefined }
    : onClick
      ? { type: 'button', onClick }
      : {};
  return (
    <Component className={cx('archive-card', `archive-card--${tone}`, interactive && 'archive-card--interactive', className)} {...props}>
      {eyebrow && <span className="archive-card__eyebrow">{eyebrow}</span>}
      <h3>{title}</h3>
      {meta && <p className="archive-card__meta">{meta}</p>}
      <div className="archive-card__content">{children}</div>
    </Component>
  );
}

export function EvidenceBadge({ state = 'confirmed', children }) {
  const tone = toneForEvidenceState(state);
  return <span className={cx('evidence-badge', tone.cssClass)} title={tone.role}>{children || tone.label}</span>;
}

export function StatusPill({ tone = 'neutral', children }) {
  return <span className={cx('status-pill', `status-pill--${tone}`)}>{children}</span>;
}

export function SourceStack({ title = 'Sources', sources = [] }) {
  if (!sources.length) return null;
  return (
    <aside className="source-stack" aria-label={title}>
      <strong>{title}</strong>
      <ul>
        {sources.map((source) => (
          <li key={`${source.label}-${source.href}`}>
            <a href={source.href} target="_blank" rel={safeRel}>{source.label}<ExternalLink size={12} aria-hidden="true" /></a>
            {source.note && <span>{source.note}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function ArchiveLedger({ items = [], label = 'Archive ledger' }) {
  if (!items.length) return null;
  return (
    <dl className="archive-ledger" aria-label={label}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const archiveUiPrimitiveNames = ['ArchiveSection', 'ArchiveCard', 'EvidenceBadge', 'StatusPill', 'SourceStack', 'ArchiveLedger'];
