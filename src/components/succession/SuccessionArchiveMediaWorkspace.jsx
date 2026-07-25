import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Images, Search } from 'lucide-react';
import SafeImage from '../SafeImage';
import { StatusPill } from '../ArchiveUI';
import {
  getMediaRecord,
  getMediaRecordsAtChapter,
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
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function MediaDossier({ record, records, onNavigate }) {
  const index = records.findIndex((item) => item.id === record.id);
  const previous = records[index - 1] || null;
  const next = records[index + 1] || null;
  return <article className="succession-product-dossier succession-media-dossier" aria-labelledby="media-dossier-title">
    <header>
      <button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate('media', {})}><ArrowLeft size={14} aria-hidden="true" /> Media library</button>
      <div><span>{record.mediaType.replaceAll('-', ' ')}</span><h2 id="media-dossier-title">{record.label}</h2><p>Maintained archive media with an explicit subject, provenance link, alt text, availability state, and verification date.</p></div>
      <div className="succession-product-dossier__badges"><StatusPill tone="neutral">{record.availability}</StatusPill><StatusPill tone="neutral">Verified {record.lastVerifiedAt}</StatusPill></div>
    </header>

    <section className="succession-media-dossier__visual"><SafeImage src={record.src} alt={record.alt} fallbackLabel="Media unavailable" /><dl><div><dt>Alt text</dt><dd>{record.alt}</dd></div><div><dt>Aspect ratio</dt><dd>{record.aspectRatio}</dd></div><div><dt>Media ID</dt><dd><code>{record.id}</code></dd></div></dl></section>

    <section><h3>Canonical subjects</h3><div className="succession-product-links">{record.subjects.map((subject) => <EntityLink entity={subject} onNavigate={onNavigate} key={subject.id} />)}</div></section>

    <section><h3>Provenance</h3>{record.provenanceUrl ? <a className="succession-button succession-button--quiet" href={record.provenanceUrl} target="_blank" rel="noreferrer noopener">Open provenance <ExternalLink size={13} aria-hidden="true" /></a> : <p>No external provenance URL is maintained for this record.</p>}</section>

    {!!record.sources.length && <section className="succession-source-list" aria-labelledby="media-sources-title"><header><span>Evidence</span><h3 id="media-sources-title">Connected source records</h3></header>{record.sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</section>}

    <nav className="succession-product-prev-next" aria-label="Media record navigation">
      {previous ? <button type="button" onClick={() => onNavigate('media', { media: previous.id })}><ArrowLeft size={14} aria-hidden="true" /><span><small>Previous media</small><b>{previous.label}</b></span></button> : <span />}
      {next && <button type="button" onClick={() => onNavigate('media', { media: next.id })}><span><small>Next media</small><b>{next.label}</b></span><ArrowRight size={14} aria-hidden="true" /></button>}
    </nav>
  </article>;
}

export default function SuccessionArchiveMediaWorkspace({ routeParams = {}, spoilerLimit, onNavigate }) {
  const records = useMemo(() => getMediaRecordsAtChapter(spoilerLimit), [spoilerLimit]);
  const selectedBase = routeParams.media ? getMediaRecord(routeParams.media) : null;
  const selected = selectedBase ? records.find((record) => record.id === selectedBase.id) || null : null;
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const types = useMemo(() => [...new Set(records.map((record) => record.mediaType))].sort(), [records]);
  const visible = useMemo(() => records.filter((record) => {
    if (mediaType !== 'all' && record.mediaType !== mediaType) return false;
    if (!query.trim()) return true;
    const text = normalize(`${record.label} ${record.mediaType} ${record.alt} ${record.subjects.map((subject) => subject.name).join(' ')}`);
    return normalize(query).split(' ').filter(Boolean).every((token) => text.includes(token));
  }), [records, mediaType, query]);

  if (routeParams.media && !selected) return <ArchiveState kind="empty" title="This media record is unavailable at the selected chapter" description={`Its subject may not be available through Chapter ${spoilerLimit}, or the deep link is invalid.`} action={<button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate('media', {})}>Open available media</button>} />;
  if (selected) return <MediaDossier record={selected} records={records} onNavigate={onNavigate} />;

  return <div className="succession-product-workspace succession-media-canonical">
    <header className="succession-product-hero"><div><span><Images size={16} aria-hidden="true" /> Maintained media</span><h2>Visuals with canonical subjects and provenance</h2><p>Only available, maintained images are displayed. Missing art remains an explicit fallback in entity dossiers rather than being replaced with unrelated material.</p></div><dl><div><dt>Available records</dt><dd>{records.length}</dd></div><div><dt>Media types</dt><dd>{types.length}</dd></div><div><dt>Visible</dt><dd>{visible.length}</dd></div></dl></header>

    <div className="succession-product-tools"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Search media subjects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Subject, type, alt text…" /></label><div role="group" aria-label="Media type"><button type="button" className={mediaType === 'all' ? 'is-active' : ''} onClick={() => setMediaType('all')}>All media</button>{types.map((type) => <button type="button" className={mediaType === type ? 'is-active' : ''} onClick={() => setMediaType(type)} key={type}>{type.replaceAll('-', ' ')}</button>)}</div></div>

    <p className="succession-product-status" role="status" aria-live="polite">{visible.length} media record{visible.length === 1 ? '' : 's'} available through Chapter {spoilerLimit}.</p>
    {visible.length ? <section className="succession-media-canonical__grid" aria-label="Maintained media records">{visible.map((record) => <article key={record.id}><SafeImage src={record.src} alt={record.alt} fallbackLabel="Media unavailable" /><div><span>{record.mediaType.replaceAll('-', ' ')}</span><h3>{record.label}</h3><p>{record.subjects.map((subject) => subject.name).join(' · ')}</p><footer><StatusPill tone="neutral">{record.availability}</StatusPill><button type="button" onClick={() => onNavigate('media', { media: record.id })}>Open provenance <ArrowRight size={13} aria-hidden="true" /></button></footer></div></article>)}</section> : <ArchiveState kind="empty" title="No media match" description="Clear the filters or search by a character, Guardian Spirit Beast, or media type." />}
  </div>;
}
