import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Library, Search } from 'lucide-react';
import { EvidenceBadge, StatusPill } from '../ArchiveUI';
import {
  getGlossaryEntriesAtChapter,
  getGlossaryEntryAtChapter,
} from '../../data/succession/successionData';
import {
  ArchiveState,
  EntityLink,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveProductLibrary.css';

const normalize = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[’‘`´]/g, "'")
  .replace(/\b([a-z0-9]+)'s\b/g, '$1')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const evidenceState = (certainty) => certainty === 'inference' ? 'inferred' : certainty === 'theory' ? 'unclear' : 'confirmed';

function GlossaryDossier({ entry, entries, onNavigate }) {
  const index = entries.findIndex((record) => record.id === entry.id);
  const previous = entries[index - 1] || null;
  const next = entries[index + 1] || null;
  return <article className="succession-product-dossier" aria-labelledby="glossary-dossier-title">
    <header>
      <button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate('glossary', {})}><ArrowLeft size={14} aria-hidden="true" /> All terms</button>
      <div><span>{entry.category}</span><h2 id="glossary-dossier-title">{entry.term}</h2><p>{entry.definition}</p></div>
      <div className="succession-product-dossier__badges"><EvidenceBadge state={evidenceState(entry.certainty)}>{entry.certainty}</EvidenceBadge><StatusPill tone="neutral">Known by Ch. {entry.firstChapter}</StatusPill></div>
    </header>

    {!!entry.synonyms.length && <section><h3>Alternate wording</h3><div className="succession-product-chips">{entry.synonyms.map((synonym) => <span key={synonym}>{synonym}</span>)}</div></section>}

    <section aria-labelledby="glossary-connections-title"><h3 id="glossary-connections-title">Connected canonical records</h3>{entry.relatedRecords?.length ? <div className="succession-product-links">{entry.relatedRecords.map((record) => record.entity
      ? <EntityLink entity={record.entity} onNavigate={onNavigate} key={record.id} />
      : <button type="button" key={record.id} onClick={() => onNavigate(record.route, record.params)}><span><small>{record.kind.replaceAll('-', ' ')}</small><b>{record.label}</b></span><ArrowRight size={13} aria-hidden="true" /></button>)}</div> : <p>No direct graph record is published for this archive vocabulary term.</p>}</section>

    {!!entry.sources.length && <section className="succession-source-list" aria-labelledby="glossary-sources-title"><header><span>Evidence</span><h3 id="glossary-sources-title">Chapter sources available at this boundary</h3></header>{entry.sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</section>}

    <nav className="succession-product-prev-next" aria-label="Glossary record navigation">
      {previous ? <button type="button" onClick={() => onNavigate('glossary', { term: previous.id })}><ArrowLeft size={14} aria-hidden="true" /><span><small>Previous term</small><b>{previous.term}</b></span></button> : <span />}
      {next && <button type="button" onClick={() => onNavigate('glossary', { term: next.id })}><span><small>Next term</small><b>{next.term}</b></span><ArrowRight size={14} aria-hidden="true" /></button>}
    </nav>
  </article>;
}

export default function SuccessionArchiveGlossaryWorkspace({ routeParams = {}, spoilerLimit, onNavigate }) {
  const entries = useMemo(() => getGlossaryEntriesAtChapter(spoilerLimit), [spoilerLimit]);
  const selected = routeParams.term ? getGlossaryEntryAtChapter(routeParams.term, spoilerLimit) : null;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => [...new Set(entries.map((entry) => entry.category))].sort(), [entries]);
  const visible = useMemo(() => entries.filter((entry) => {
    if (category !== 'all' && entry.category !== category) return false;
    if (!query.trim()) return true;
    const text = normalize(`${entry.term} ${entry.definition} ${entry.category} ${entry.synonyms.join(' ')}`);
    return normalize(query).split(' ').filter(Boolean).every((token) => text.includes(token));
  }), [entries, category, query]);

  if (routeParams.term && !selected) return <ArchiveState kind="empty" title="This glossary term is unavailable at the selected chapter" description={`The term may be introduced after Chapter ${spoilerLimit}, or the deep link is invalid.`} action={<button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate('glossary', {})}>Open available terms</button>} />;
  if (selected) return <GlossaryDossier entry={selected} entries={entries} onNavigate={onNavigate} />;

  return <div className="succession-product-workspace succession-glossary-canonical">
    <header className="succession-product-hero">
      <div><span><Library size={16} aria-hidden="true" /> Canonical vocabulary</span><h2>Glossary terms connected to the archive graph</h2><p>Definitions, synonyms, certainty, first-known chapters, related records, and evidence all obey the selected reading boundary.</p></div>
      <dl><div><dt>Available terms</dt><dd>{entries.length}</dd></div><div><dt>Categories</dt><dd>{categories.length}</dd></div><div><dt>Visible</dt><dd>{visible.length}</dd></div></dl>
    </header>

    <div className="succession-product-tools">
      <label><Search size={16} aria-hidden="true" /><span className="sr-only">Search glossary terms and definitions</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Term, synonym, definition…" /></label>
      <div role="group" aria-label="Glossary category"><button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')}>All categories</button>{categories.map((item) => <button type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    </div>

    <p className="succession-product-status" role="status" aria-live="polite">{visible.length} glossary term{visible.length === 1 ? '' : 's'} available through Chapter {spoilerLimit}.</p>
    {visible.length ? <section className="succession-glossary-canonical__grid" aria-label="Glossary records">{visible.map((entry) => <article key={entry.id}><header><BookOpen size={17} aria-hidden="true" /><span>{entry.category}</span></header><h3>{entry.term}</h3><p>{entry.definition}</p><footer><EvidenceBadge state={evidenceState(entry.certainty)}>{entry.certainty}</EvidenceBadge><button type="button" onClick={() => onNavigate('glossary', { term: entry.id })}>Open term <ArrowRight size={13} aria-hidden="true" /></button></footer></article>)}</section> : <ArchiveState kind="empty" title="No glossary match" description="Clear the filters or try a synonym, ability name, location, law, or archive term." />}
  </div>;
}
