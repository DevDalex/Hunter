import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import {
  enrichedSpecifiedCards,
  enrichedSpecifiedCardById,
} from '../../data/greed-island/specifiedCardsEnriched.js';
import {
  SPECIFIED_CARD_ARCHIVE_SOURCE,
  SPECIFIED_CARD_KINDS,
} from '../../data/greed-island/specifiedCardArchive.js';
import { GREED_ISLAND_CARD_RANKS } from '../../data/greed-island/specifiedCards.js';
import InteractiveCard from './InteractiveCard';
import './SpecifiedCardArchive.css';

const PAGE_SIZE = 10;
const titleCase = (value) => value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusLabel = (status) => status === 'verified' ? 'Verified' : status === 'unknown' ? 'Unknown in source' : 'Not documented';

function StatusBadge({ status }) {
  const verified = status === 'verified';
  return <span className={`gi-archive-status is-${status}`}>
    {verified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
    {statusLabel(status)}
  </span>;
}

function formatNumbers(values, prefix) {
  if (!values?.length) return 'No card-specific mapping documented';
  return values.map((value) => `${prefix}${value}`).join(', ');
}

export default function SpecifiedCardArchive() {
  const [selectedId, setSelectedId] = useState('002');
  const [query, setQuery] = useState('');
  const [rank, setRank] = useState('all');
  const [kind, setKind] = useState('all');
  const [storyOnly, setStoryOnly] = useState(false);
  const [page, setPage] = useState(0);

  const selected = enrichedSpecifiedCardById.get(selectedId) || enrichedSpecifiedCards[2];
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return enrichedSpecifiedCards.filter((card) => {
      if (rank !== 'all' && card.rank !== rank) return false;
      if (kind !== 'all' && card.kind !== kind) return false;
      if (storyOnly && card.story.status !== 'verified') return false;
      if (!normalized) return true;
      return [
        card.id,
        card.name,
        card.kind,
        card.description,
        card.materializedAs,
        card.acquisition.summary,
        card.story.summary,
        ...card.story.owners,
      ].some((value) => String(value || '').toLowerCase().includes(normalized));
    });
  }, [kind, query, rank, storyOnly]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount - 1);
  const visibleResults = results.slice(activePage * PAGE_SIZE, activePage * PAGE_SIZE + PAGE_SIZE);

  const related = useMemo(() => {
    const sameKind = enrichedSpecifiedCards.filter((card) => card.id !== selected.id && card.kind === selected.kind);
    const adjacent = enrichedSpecifiedCards.filter((card) => card.id !== selected.id && Math.abs(card.number - selected.number) <= 2);
    return [...new Map([...sameKind, ...adjacent].map((card) => [card.id, card])).values()].slice(0, 6);
  }, [selected]);

  const verifiedAcquisitions = enrichedSpecifiedCards.filter((card) => card.acquisition.status === 'verified').length;
  const verifiedStory = enrichedSpecifiedCards.filter((card) => card.story.status === 'verified').length;
  const resetPage = () => setPage(0);

  return <section className="gi-card-archive" id="card-archive" aria-labelledby="gi-card-archive-title" data-card-page={activePage + 1}>
    <header className="gi-section-heading">
      <span>Stage 05 · Specified Slot archive</span>
      <h2 id="gi-card-archive-title">Every card has a readable record, ten at a time.</h2>
      <p>Search all 100 cards while rendering only one ten-card result page. The selected detail record remains available without mounting a hundred result rows.</p>
    </header>

    <div className="gi-card-archive__metrics" aria-label="Specified card archive verification summary">
      <div><b>100 / 100</b><span>effects verified</span></div>
      <div><b>{verifiedAcquisitions}</b><span>acquisition routes verified</span></div>
      <div><b>{verifiedStory}</b><span>story mappings verified</span></div>
      <div><b>10</b><span>rows mounted per page</span></div>
    </div>

    <div className="gi-card-archive__filters">
      <label className="gi-card-archive__search">
        <Search size={16} />
        <span className="sr-only">Search Specified Slot archive</span>
        <input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Search number, card, effect, owner…" />
      </label>
      <label><Filter size={15} /><span>Rank</span><select value={rank} onChange={(event) => { setRank(event.target.value); resetPage(); }}>
        <option value="all">All ranks</option>
        {GREED_ISLAND_CARD_RANKS.map((value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
      <label><Filter size={15} /><span>Material</span><select value={kind} onChange={(event) => { setKind(event.target.value); resetPage(); }}>
        <option value="all">All materials</option>
        {SPECIFIED_CARD_KINDS.map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}
      </select></label>
      <label className="gi-card-archive__check"><input type="checkbox" checked={storyOnly} onChange={(event) => { setStoryOnly(event.target.checked); resetPage(); }} /><span>Verified story cards only</span></label>
    </div>

    <div className="gi-card-archive__layout">
      <aside className="gi-card-archive__results" aria-label={`${results.length} matching Specified Slot cards`}>
        <header><b>{results.length}</b><span>matching cards · page {activePage + 1} / {pageCount}</span></header>
        <div>
          {visibleResults.map((card) => <button
            type="button"
            key={card.id}
            className={selected.id === card.id ? 'is-active' : ''}
            onClick={() => setSelectedId(card.id)}
            aria-pressed={selected.id === card.id}
          >
            <i>{card.id}</i>
            <span><strong>{card.name}</strong><small>{titleCase(card.kind)} · Rank {card.rank}</small></span>
            {card.story.status === 'verified' && <CheckCircle2 size={14} aria-label="Story mapping verified" />}
          </button>)}
          {!results.length && <p>No cards match these filters.</p>}
        </div>
        <nav className="gi-card-archive__pagination" aria-label="Specified card result pages">
          <button type="button" onClick={() => setPage(Math.max(0, activePage - 1))} disabled={activePage === 0}><ArrowLeft size={14} /> Previous</button>
          <span>{String(activePage * PAGE_SIZE).padStart(3, '0')}–{String(Math.min(results.length - 1, activePage * PAGE_SIZE + PAGE_SIZE - 1)).padStart(3, '0')}</span>
          <button type="button" onClick={() => setPage(Math.min(pageCount - 1, activePage + 1))} disabled={activePage === pageCount - 1}>Next <ArrowRight size={14} /></button>
        </nav>
      </aside>

      <article className="gi-card-archive__record" aria-live="polite">
        <div className="gi-card-archive__hero">
          <div className="gi-card-archive__card"><InteractiveCard card={selected} displayOnly /></div>
          <div>
            <span>Specified Slot {selected.id}</span>
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
            <dl>
              <div><dt>Rank</dt><dd>{selected.rank}</dd></div>
              <div><dt>Conversion limit</dt><dd>{selected.conversionLimit}</dd></div>
              <div><dt>Material type</dt><dd>{titleCase(selected.kind)}</dd></div>
              <div><dt>Becomes</dt><dd>{selected.materializedAs}</dd></div>
            </dl>
          </div>
        </div>

        <div className="gi-card-archive__evidence">
          <section>
            <header><MapPin size={18} /><div><span>Acquisition record</span><StatusBadge status={selected.acquisition.status} /></div></header>
            <p>{selected.acquisition.summary}</p>
            {selected.acquisition.location && <dl><dt>Location</dt><dd>{selected.acquisition.location}</dd></dl>}
            <a href={selected.acquisition.source} target="_blank" rel="noreferrer noopener">Open acquisition source <ExternalLink size={13} /></a>
          </section>

          <section>
            <header><Users size={18} /><div><span>Story record</span><StatusBadge status={selected.story.status} /></div></header>
            <p>{selected.story.summary}</p>
            <dl>
              <div><dt>Known owners/users</dt><dd>{selected.story.owners.length ? selected.story.owners.join(', ') : 'Not documented'}</dd></div>
              <div><dt>Manga</dt><dd>{formatNumbers(selected.story.chapters, 'Ch. ')}</dd></div>
              <div><dt>2011 anime</dt><dd>{formatNumbers(selected.story.episodes2011, 'Ep. ')}</dd></div>
            </dl>
            <a href={selected.story.source} target="_blank" rel="noreferrer noopener">Open story source <ExternalLink size={13} /></a>
          </section>
        </div>

        <section className="gi-card-archive__related">
          <header><span>Related archive records</span><small>Same material type or neighboring slot</small></header>
          <div>{related.map((card) => <button type="button" key={card.id} onClick={() => setSelectedId(card.id)}><i>{card.id}</i><span>{card.name}</span></button>)}</div>
        </section>

        <p className="gi-card-archive__provenance"><BookOpen size={15} /> Effects are concise archive paraphrases of the Hunterpedia table. Story and acquisition claims link to their card, chapter, episode, or arc source. <a href={SPECIFIED_CARD_ARCHIVE_SOURCE.href} target="_blank" rel="noreferrer noopener">Table source <ExternalLink size={12} /></a></p>
      </article>
    </div>
  </section>;
}
