import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  BookX,
  ExternalLink,
  Search,
} from 'lucide-react';
import {
  enrichedSpecifiedCards as specifiedCards,
} from '../../data/greed-island/specifiedCardsEnriched.js';
import InteractiveCard from './InteractiveCard';
import './GreedIslandBook.css';

const PAGE_SIZE = 9;
const PAGE_COUNT = Math.ceil(specifiedCards.length / PAGE_SIZE);
const DEFAULT_SELECTED_INDEX = 4;
const BOOK_REFERENCE = Object.freeze({
  page: 'https://hunterxhunter.fandom.com/wiki/Greed_Island',
  label: 'G.I. Book and slot reference images',
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const titleCase = (value = '') => String(value).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function pageRange(page) {
  const start = page * PAGE_SIZE;
  const end = Math.min(specifiedCards.length - 1, start + PAGE_SIZE - 1);
  return `${String(start).padStart(3, '0')}–${String(end).padStart(3, '0')}`;
}

function emptyPocketKey(page, index) {
  return `empty-${page}-${index}`;
}

export default function GreedIslandBinder() {
  const [bookOpen, setBookOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SELECTED_INDEX);
  const [query, setQuery] = useState('');
  const [deepRecordOpen, setDeepRecordOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('Binder opened to page 1. Card 004, Skin Care Hot Springs, is highlighted.');

  const currentPageCards = useMemo(
    () => specifiedCards.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page],
  );
  const selectedCard = specifiedCards[selectedIndex] || specifiedCards[DEFAULT_SELECTED_INDEX];
  const selectedLocalIndex = selectedIndex - page * PAGE_SIZE;
  const pockets = useMemo(
    () => Array.from({ length: PAGE_SIZE }, (_, index) => currentPageCards[index] || null),
    [currentPageCards],
  );

  const selectIndex = (nextIndex, messagePrefix = 'Highlighted') => {
    const bounded = clamp(nextIndex, 0, specifiedCards.length - 1);
    const nextCard = specifiedCards[bounded];
    const nextPage = Math.floor(bounded / PAGE_SIZE);
    setPage(nextPage);
    setSelectedIndex(bounded);
    setDeepRecordOpen(false);
    setAnnouncement(`${messagePrefix} card ${nextCard.id}, ${nextCard.name}, on page ${nextPage + 1}.`);
  };

  const openPage = (nextPage, preferredSlot = 4) => {
    const boundedPage = clamp(nextPage, 0, PAGE_COUNT - 1);
    const start = boundedPage * PAGE_SIZE;
    const pageLength = Math.min(PAGE_SIZE, specifiedCards.length - start);
    const localIndex = clamp(preferredSlot, 0, Math.max(0, pageLength - 1));
    const card = specifiedCards[start + localIndex];
    setPage(boundedPage);
    setSelectedIndex(start + localIndex);
    setDeepRecordOpen(false);
    setAnnouncement(`Opened page ${boundedPage + 1} of ${PAGE_COUNT}. Card ${card.id}, ${card.name}, is highlighted.`);
  };

  const moveSelection = (direction) => {
    const pageStart = page * PAGE_SIZE;
    const local = selectedIndex - pageStart;
    const currentLength = currentPageCards.length;
    let nextIndex = selectedIndex;

    if (direction === 'left') {
      if (local > 0) nextIndex -= 1;
      else if (page > 0) nextIndex = pageStart - 1;
    }

    if (direction === 'right') {
      if (local < currentLength - 1) nextIndex += 1;
      else if (page < PAGE_COUNT - 1) nextIndex = pageStart + PAGE_SIZE;
    }

    if (direction === 'up') {
      if (local >= 3) nextIndex -= 3;
      else if (page > 0) {
        const previousStart = pageStart - PAGE_SIZE;
        const previousLength = Math.min(PAGE_SIZE, specifiedCards.length - previousStart);
        nextIndex = previousStart + Math.min(local + 6, previousLength - 1);
      }
    }

    if (direction === 'down') {
      if (local + 3 < currentLength) nextIndex += 3;
      else if (page < PAGE_COUNT - 1) {
        const nextStart = pageStart + PAGE_SIZE;
        const nextLength = Math.min(PAGE_SIZE, specifiedCards.length - nextStart);
        nextIndex = nextStart + Math.min(local % 3, nextLength - 1);
      }
    }

    if (nextIndex === selectedIndex) {
      setAnnouncement(`The ${direction} edge of the Binder has been reached.`);
      return;
    }
    selectIndex(nextIndex, `${titleCase(direction)} control moved to`);
  };

  const toggleDeepRecord = () => {
    setDeepRecordOpen((open) => {
      const next = !open;
      setAnnouncement(`${next ? 'Opened' : 'Closed'} the extended record for card ${selectedCard.id}, ${selectedCard.name}.`);
      return next;
    });
  };

  const jumpToCard = () => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;
    const matchIndex = specifiedCards.findIndex((card) => (
      card.id === normalized.padStart(3, '0')
      || card.name.toLowerCase().includes(normalized)
    ));
    if (matchIndex < 0) {
      setAnnouncement(`No Specified Slot card matches “${query.trim()}”.`);
      return;
    }
    selectIndex(matchIndex, 'Search highlighted');
  };

  const handleBookKeys = (event) => {
    if (event.target !== event.currentTarget) return;
    const keyActions = {
      ArrowLeft: () => moveSelection('left'),
      ArrowRight: () => moveSelection('right'),
      ArrowUp: () => moveSelection('up'),
      ArrowDown: () => moveSelection('down'),
      PageUp: () => openPage(page - 1),
      PageDown: () => openPage(page + 1),
      Home: () => selectIndex(0),
      End: () => selectIndex(specifiedCards.length - 1),
      Enter: toggleDeepRecord,
      ' ': toggleDeepRecord,
    };
    const action = keyActions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  return <section className="gi-binder-section" id="binder" aria-labelledby="gi-binder-title">
    <header className="gi-section-heading gi-binder-heading">
      <span>Greed Island archive · interactive Binder</span>
      <h2 id="gi-binder-title">The cards live inside the Book.</h2>
      <p>All 100 Specified Slot cards are already seated in physical pockets. Use the red controls, keyboard arrows, page controls, or the cards themselves to move through the Binder; the selected record appears on the right-hand display.</p>
    </header>

    <p className="gi-binder-status" role="status" aria-live="polite">{announcement}</p>

    {!bookOpen ? <button
      type="button"
      className="gi-binder-closed"
      onClick={() => {
        setBookOpen(true);
        setAnnouncement(`Binder opened to page ${page + 1}. Card ${selectedCard.id}, ${selectedCard.name}, is highlighted.`);
      }}
      aria-label="Open Greed Island Binder"
    >
      <span className="gi-binder-closed__spine" aria-hidden="true" />
      <span className="gi-binder-closed__frame" aria-hidden="true" />
      <strong>G.I. BOOK</strong>
      <small>Open Binder</small>
    </button> : <>
      <div
        className="gi-binder-device"
        data-book-state="open"
        data-binder-page={page + 1}
        data-binder-selected-card={selectedCard.id}
        tabIndex="0"
        aria-label={`Greed Island Binder, page ${page + 1} of ${PAGE_COUNT}, selected card ${selectedCard.id}, ${selectedCard.name}`}
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown PageUp PageDown Home End Enter Space"
        onKeyDown={handleBookKeys}
      >
        <div className="gi-binder-left-shell">
          <div className="gi-binder-page-stack" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <section className="gi-binder-leaf" aria-label={`Specified Slot page ${page + 1}, cards ${pageRange(page)}`}>
            <header className="gi-binder-leaf__header">
              <div><span>Specified Slots</span><strong>{pageRange(page)}</strong></div>
              <div><b>Page {String(page + 1).padStart(2, '0')}</b><small>100 / 100 loaded</small></div>
            </header>

            <div className="gi-binder-pocket-grid" role="grid" aria-label={`Cards on Binder page ${page + 1}`}>
              {pockets.map((card, index) => card ? <button
                type="button"
                key={card.id}
                className={`gi-binder-card${selectedIndex === page * PAGE_SIZE + index ? ' is-selected' : ''}`}
                onClick={() => selectIndex(page * PAGE_SIZE + index)}
                aria-pressed={selectedIndex === page * PAGE_SIZE + index}
                aria-label={`Card ${card.id}, ${card.name}${selectedIndex === page * PAGE_SIZE + index ? ', highlighted' : ''}`}
                data-binder-card-id={card.id}
                role="gridcell"
              >
                <InteractiveCard card={card} inserted displayOnly />
                <span className="gi-binder-card__number">{card.id}</span>
              </button> : <span
                key={emptyPocketKey(page, index)}
                className="gi-binder-card gi-binder-card--empty"
                aria-label="Unused Binder pocket"
                role="gridcell"
              ><i /></span>)}
            </div>

            <nav className="gi-binder-page-rail" aria-label="Binder pages">
              {Array.from({ length: PAGE_COUNT }, (_, index) => <button
                type="button"
                key={index}
                className={page === index ? 'is-active' : ''}
                aria-current={page === index ? 'page' : undefined}
                aria-label={`Open Binder page ${index + 1}`}
                onClick={() => openPage(index)}
              >{String(index + 1).padStart(2, '0')}</button>)}
            </nav>
          </section>
        </div>

        <div className="gi-binder-hinge" aria-hidden="true"><i /><i /></div>

        <section className="gi-binder-console" aria-label="Selected card information and Binder controls">
          <div className="gi-binder-screen">
            <header className="gi-binder-screen__header">
              <div><span>Card analysis</span><b>{selectedCard.id}</b></div>
              <button
                type="button"
                onClick={() => {
                  setBookOpen(false);
                  setAnnouncement('Binder closed. The selected card and page remain remembered.');
                }}
                aria-label="Close Greed Island Binder"
              ><BookX size={15} /> Close</button>
            </header>

            <form className="gi-binder-search" onSubmit={(event) => { event.preventDefault(); jumpToCard(); }}>
              <label><Search size={15} /><span className="sr-only">Find a Specified Slot card</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find card number or name" /></label>
              <button type="submit">Find</button>
            </form>

            <div className="gi-binder-screen__record">
              <div className="gi-binder-screen__card"><InteractiveCard card={selectedCard} inserted displayOnly /></div>
              <div className="gi-binder-screen__copy">
                <span>Page {page + 1} · pocket {selectedLocalIndex + 1}</span>
                <h3>{selectedCard.name}</h3>
                <dl>
                  <div><dt>Rank</dt><dd>{selectedCard.rank}</dd></div>
                  <div><dt>Limit</dt><dd>{selectedCard.conversionLimit}</dd></div>
                  <div><dt>Type</dt><dd>{titleCase(selectedCard.kind)}</dd></div>
                  <div><dt>Evidence</dt><dd>Verified</dd></div>
                </dl>
                <p>{selectedCard.description}</p>
                <p><strong>Materialized form:</strong> {selectedCard.materializedAs}.</p>
              </div>
            </div>

            <div className={`gi-binder-screen__deep${deepRecordOpen ? ' is-open' : ''}`} aria-hidden={!deepRecordOpen}>
              <section>
                <span>Acquisition</span>
                <strong>{titleCase(selectedCard.acquisition.status)}</strong>
                <p>{selectedCard.acquisition.summary}</p>
                <small>{selectedCard.acquisition.location || 'No specific acquisition location documented.'}</small>
              </section>
              <section>
                <span>Story record</span>
                <strong>{titleCase(selectedCard.story.status)}</strong>
                <p>{selectedCard.story.summary}</p>
                <small>{selectedCard.story.owners.length ? `Owners/users: ${selectedCard.story.owners.join(', ')}` : 'No card-specific owner documented.'}</small>
              </section>
            </div>

            <footer className="gi-binder-screen__footer">
              <span>{deepRecordOpen ? 'Extended record open' : 'Press the center red button for the extended record'}</span>
              <a href={selectedCard.acquisition.source} target="_blank" rel="noreferrer noopener">Hunterpedia source <ExternalLink size={12} /></a>
            </footer>
          </div>

          <div className="gi-binder-console__lower">
            <div className="gi-binder-dock" aria-label={`Active-card dock: ${selectedCard.id}, ${selectedCard.name}`}>
              <span>Active card</span>
              <div><InteractiveCard card={selectedCard} inserted displayOnly /></div>
            </div>

            <div className="gi-binder-dpad" aria-label="Red Binder directional controls">
              <button type="button" className="is-up" onClick={() => moveSelection('up')} aria-label="Move highlight up"><ArrowUp aria-hidden="true" /></button>
              <button type="button" className="is-left" onClick={() => moveSelection('left')} aria-label="Move highlight left"><ArrowLeft aria-hidden="true" /></button>
              <button type="button" className="is-center" onClick={toggleDeepRecord} aria-label={`${deepRecordOpen ? 'Close' : 'Open'} extended selected-card record`} aria-pressed={deepRecordOpen}><BookOpen aria-hidden="true" /></button>
              <button type="button" className="is-right" onClick={() => moveSelection('right')} aria-label="Move highlight right"><ArrowRight aria-hidden="true" /></button>
              <button type="button" className="is-down" onClick={() => moveSelection('down')} aria-label="Move highlight down"><ArrowDown aria-hidden="true" /></button>
            </div>
          </div>
        </section>
      </div>

      <nav className="gi-binder-accessible-nav" aria-label="Binder page controls">
        <button type="button" onClick={() => openPage(page - 1)} disabled={page === 0}><ArrowLeft size={16} /> Previous page</button>
        <span>Page {page + 1} / {PAGE_COUNT} · Card {selectedCard.id}</span>
        <button type="button" onClick={() => openPage(page + 1)} disabled={page === PAGE_COUNT - 1}>Next page <ArrowRight size={16} /></button>
      </nav>
    </>}

    <p className="gi-binder-reference">Original interactive reconstruction based on Hunterpedia’s <a href={BOOK_REFERENCE.page} target="_blank" rel="noreferrer noopener">{BOOK_REFERENCE.label}</a>. Card images and records use the verified local Greed Island card archive.</p>
  </section>;
}
