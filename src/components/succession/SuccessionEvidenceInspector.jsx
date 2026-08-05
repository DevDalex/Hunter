import { BookOpenCheck, Languages, ShieldQuestion } from 'lucide-react';
import { certaintyLevels, claimKinds } from '../../data/succession/researchSemantics';
import { getTranslationVariants } from '../../data/succession/translationVariants';

const asArray = (value) => value ? (Array.isArray(value) ? value : [value]) : [];
const labelOf = (value) => {
  if (typeof value === 'string') return value;
  return value?.label || value?.title || value?.name || value?.text || value?.id || 'Evidence record';
};
const normalizeEvidence = (entity) => {
  const records = [
    ...asArray(entity?.claims),
    ...asArray(entity?.evidence),
    ...asArray(entity?.sources),
    ...asArray(entity?.provenance),
  ];
  return records.map((record, index) => {
    if (typeof record === 'string') return {
      id: `evidence-${index}`,
      text: record,
      kind: 'canon',
      certainty: 'confirmed',
      chapter: null,
      page: null,
      source: record,
      note: '',
    };
    const kind = claimKinds[record.kind] ? record.kind : (record.type === 'translation' ? 'translation' : 'canon');
    const certainty = certaintyLevels[record.certainty] ? record.certainty : (kind === 'canon' ? 'confirmed' : 'unknown');
    return {
      id: record.id || `evidence-${index}`,
      text: record.text || record.claim || record.summary || labelOf(record),
      kind,
      certainty,
      chapter: record.chapter || record.chapterNumber || record.validFromChapter || null,
      page: record.page || record.panel || null,
      source: record.source || record.url || record.citation || labelOf(record),
      note: record.note || record.notes || record.translationNote || record.description || '',
      contradiction: record.contradiction || record.contradictoryEvidence || '',
      reviewedAt: record.reviewedAt || entity?.reviewedAt || '',
    };
  });
};

export default function SuccessionEvidenceInspector({ entity, spoilerLimit }) {
  if (!entity) return null;
  const evidence = normalizeEvidence(entity).filter((record) => !record.chapter || record.chapter <= spoilerLimit);
  const variants = getTranslationVariants(entity);
  return <section className="succession-evidence-inspector" aria-label="Evidence and translation details">
    <article>
      <header><BookOpenCheck size={18} aria-hidden="true" /><div><span>Claim-level evidence</span><h3>{entity.name || entity.title || entity.label || entity.id}</h3></div><b>{evidence.length}</b></header>
      {evidence.length ? <div className="succession-evidence-inspector__records">{evidence.map((record) => <details key={record.id}>
        <summary><span className={`claim-kind is-${record.kind}`}>{claimKinds[record.kind].label}</span><strong>{record.text}</strong><small>{certaintyLevels[record.certainty].label}</small></summary>
        <dl>
          <div><dt>Source</dt><dd>{String(record.source)}</dd></div>
          {record.chapter && <div><dt>Chapter</dt><dd>{record.chapter}{record.page ? ` · ${record.page}` : ''}</dd></div>}
          {record.note && <div><dt>Editorial note</dt><dd>{record.note}</dd></div>}
          {record.contradiction && <div><dt>Contradictory evidence</dt><dd>{String(record.contradiction)}</dd></div>}
          {record.reviewedAt && <div><dt>Last reviewed</dt><dd>{record.reviewedAt}</dd></div>}
        </dl>
      </details>)}</div> : <p><ShieldQuestion size={16} aria-hidden="true" /> No claim-level evidence records are attached to this entity yet.</p>}
    </article>
    <article>
      <header><Languages size={18} aria-hidden="true" /><div><span>Translation variants</span><h3>Preferred and alternate terminology</h3></div><b>{variants.length}</b></header>
      <ul>{variants.map((variant) => <li key={variant.id || variant.term}><strong>{variant.term}</strong><span>{variant.source}{variant.preferred ? ' · Preferred' : ''}</span>{variant.note && <p>{variant.note}</p>}</li>)}</ul>
    </article>
  </section>;
}
