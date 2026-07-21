import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookX,
  Check,
  Layers3,
  Map,
  RotateCcw,
  ScanLine,
  Search,
  Users,
} from 'lucide-react';
import { readStoredJson, writeStoredJson } from '../../lib/browserStorage';
import {
  enrichedSpecifiedCards as specifiedCards,
  enrichedSpecifiedCardById as specifiedCardById,
} from '../../data/greed-island/specifiedCardsEnriched.js';
import InteractiveCard from './InteractiveCard';
import './GreedIslandBook.css';

const STORAGE_KEY = 'hxh-greed-island-binder-v1';
const PAGE_SIZE = 10;
const SPECIFIED_PAGE_COUNT = specifiedCards.length / PAGE_SIZE;
const FREE_SLOT_COUNT = 45;
const FREE_PAGE_COUNT = Math.ceil(FREE_SLOT_COUNT / PAGE_SIZE);
const BOOK_REFERENCE = Object.freeze({
  page: 'https://hunterxhunter.fandom.com/wiki/Greed_Island',
  coverLabel: 'G.I. Book',
  slotsLabel: 'G.I. Book Slots',
});

function readBinderProgress() {
  const stored = readStoredJson(STORAGE_KEY, []);
  if (!Array.isArray(stored)) return new Set();
  return new Set(stored.filter((id) => specifiedCardById.has(id)));
}

function FreeSlot({ number }) {
  if (!number) return <span className="gi-slot gi-slot--void" aria-hidden="true" />;
  const id = String(number).padStart(2, '0');
  return <span className="gi-slot gi-slot--free" role="img" aria-label={`Free Slot ${id}, empty`}>
    <i>{id}</i>
    <span>Empty free slot</span>
  </span>;
}

export default function GreedIslandBinder() {
  const [bookOpen, setBookOpen] = useState(true);
  const [section, setSection] = useState('specified');
  const [page, setPage] = useState(0);
  const [freePage, setFreePage] = useState(0);
  const [inserted, setInserted] = useState(readBinderProgress);
  const [heldCardId, setHeldCardId] = useState('002');
  const [selectedCardId, setSelectedCardId] = useState('002');
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState('Eta: Hold a card, then place it in the slot with the same number.');

  const pageCards = specifiedCards.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const freeSlots = Array.from({ length: PAGE_SIZE }, (_, index) => {
    const number = freePage * PAGE_SIZE + index + 1;
    return number <= FREE_SLOT_COUNT ? number : null;
  });
  const visibleSlots = section === 'specified' ? pageCards : freeSlots;
  const activePage = section === 'specified' ? page : freePage;
  const activePageCount = section === 'specified' ? SPECIFIED_PAGE_COUNT : FREE_PAGE_COUNT;
  const heldCard = heldCardId ? specifiedCardById.get(heldCardId) : null;
  const selectedCard = specifiedCardById.get(selectedCardId) || specifiedCards[2];
  const rulerUnlocked = useMemo(() => specifiedCards.slice(1).every((card) => inserted.has(card.id)), [inserted]);
  const completion = inserted.size;

  const persist = (next) => {
    setInserted(next);
    writeStoredJson(STORAGE_KEY, [...next]);
  };

  const holdCard = (id) => {
    const card = specifiedCardById.get(id);
    if (!card) return;
    if (id === '000' && !rulerUnlocked) {
      setAnnouncement('Eta: Slot 000 remains locked until cards 001 through 099 are inserted.');
      setSelectedCardId(id);
      return;
    }
    setHeldCardId(id);
    setSelectedCardId(id);
    setAnnouncement(`Eta: ${card.name} is held. Insert it into Specified Slot ${card.id}.`);
  };

  const insertCard = (cardId, slotId) => {
    const card = specifiedCardById.get(cardId);
    if (!card) return;
    setSelectedCardId(card.id);
    if (slotId === '000' && !rulerUnlocked) {
      setAnnouncement('Eta: Specified Slot 000 is awarded only after cards 001 through 099 are complete.');
      return;
    }
    if (cardId !== slotId) {
      setAnnouncement(`Eta: ${card.name} belongs in Specified Slot ${card.id}, not ${slotId}.`);
      return;
    }
    const next = new Set(inserted);
    next.add(cardId);
    persist(next);
    setHeldCardId('');
    setAnnouncement(`Eta: ${card.name} accepted in Specified Slot ${slotId}.`);
  };

  const activateSlot = (slotId) => {
    if (inserted.has(slotId)) {
      const next = new Set(inserted);
      next.delete(slotId);
      persist(next);
      setHeldCardId(slotId);
      setSelectedCardId(slotId);
      setAnnouncement(`Eta: Card ${slotId} has been lifted from the Binder and is now held.`);
      return;
    }
    if (!heldCardId) {
      setAnnouncement(`Eta: Hold card ${slotId} before inserting it into this slot.`);
      return;
    }
    insertCard(heldCardId, slotId);
  };

  const openSpecified = () => {
    setBookOpen(true);
    setSection('specified');
    setAnnouncement('Eta: Specified Slot pages opened. Each numbered card belongs in the matching pocket.');
  };

  const openFreeSlots = () => {
    setBookOpen(true);
    setSection('free');
    setAnnouncement('Eta: Free Slots opened. This reconstruction shows all 45 pockets; Free Slot card records arrive in a later stage.');
  };

  const jumpToCard = () => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;
    const match = specifiedCards.find((card) => card.id === normalized.padStart(3, '0') || card.name.toLowerCase().includes(normalized));
    if (!match) {
      setAnnouncement(`Eta: No Specified Slot card matches “${query.trim()}”.`);
      return;
    }
    setBookOpen(true);
    setSection('specified');
    setPage(Math.floor(match.number / PAGE_SIZE));
    setSelectedCardId(match.id);
    setAnnouncement(`Eta: Opened the Binder page containing ${match.id}, ${match.name}.`);
  };

  const reset = () => {
    persist(new Set());
    setBookOpen(true);
    setSection('specified');
    setHeldCardId('002');
    setSelectedCardId('002');
    setPage(0);
    setFreePage(0);
    setAnnouncement('Eta: Binder simulation reset. Plot of Beach is held for the tutorial.');
  };

  const setActivePage = (next) => {
    if (section === 'specified') setPage(next);
    else setFreePage(next);
  };

  const turnPage = (direction) => {
    const next = Math.min(activePageCount - 1, Math.max(0, activePage + direction));
    if (next === activePage) return;
    setActivePage(next);
    setAnnouncement(`Eta: ${section === 'specified' ? 'Specified Slot' : 'Free Slot'} page ${next + 1} of ${activePageCount}.`);
  };

  const renderSpecifiedSlot = (card) => {
    const filled = inserted.has(card.id);
    const locked = card.id === '000' && !rulerUnlocked;
    return <button
      type="button"
      className={`gi-slot${filled ? ' is-filled' : ''}${locked ? ' is-locked' : ''}`}
      key={card.id}
      onClick={() => activateSlot(card.id)}
      onDragOver={(event) => { if (!filled && !locked) event.preventDefault(); }}
      onDrop={(event) => {
        event.preventDefault();
        insertCard(event.dataTransfer.getData('text/plain') || heldCardId, card.id);
      }}
      aria-label={filled ? `Lift ${card.id}, ${card.name}, from Binder` : locked ? 'Specified Slot 000 locked until cards 001 through 099 are complete' : `Insert held card into Specified Slot ${card.id}`}
    >
      {filled ? <InteractiveCard card={card} inserted displayOnly /> : <><i>{card.id}</i><span>{locked ? 'Completion reward' : 'Empty specified slot'}</span></>}
    </button>;
  };

  const renderLeaf = (side, slots) => <section className={`gi-book__leaf gi-book__leaf--${side}`} aria-label={`${side} Binder page`}>
    <span className="gi-book__leaf-number" aria-hidden="true">{String(activePage * 2 + (side === 'left' ? 1 : 2)).padStart(2, '0')}</span>
    <div className="gi-book__pocket-grid">
      {section === 'specified'
        ? slots.map(renderSpecifiedSlot)
        : slots.map((number, index) => <FreeSlot key={number || `void-${index}`} number={number} />)}
    </div>
  </section>;

  const rangeStart = section === 'specified' ? activePage * PAGE_SIZE : activePage * PAGE_SIZE + 1;
  const rangeEnd = section === 'specified'
    ? activePage * PAGE_SIZE + PAGE_SIZE - 1
    : Math.min(FREE_SLOT_COUNT, activePage * PAGE_SIZE + PAGE_SIZE);
  const rangeLabel = section === 'specified'
    ? `${String(rangeStart).padStart(3, '0')}–${String(rangeEnd).padStart(3, '0')}`
    : `${String(rangeStart).padStart(2, '0')}–${String(rangeEnd).padStart(2, '0')}`;

  return <section className="gi-binder-section" id="binder" aria-labelledby="gi-binder-title">
    <header className="gi-section-heading">
      <span>Foundation system 01 · reconstructed</span>
      <h2 id="gi-binder-title">The Greed Island Book</h2>
      <p>A canon-closer cover, rigid page spread, dark card pockets, 100 Specified Slots, 45 Free Slots, and equal drag, tap, and keyboard paths.</p>
    </header>

    <div className="gi-binder-toolbar">
      <div className="gi-progress" aria-label={`${completion} of 100 Specified Slots filled`}>
        <span><b>{String(completion).padStart(3, '0')}</b> / 100</span>
        <i><span style={{ width: `${completion}%` }} /></i>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); jumpToCard(); }}>
        <label><Search size={15} /><span className="sr-only">Find a Specified Slot card</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Number or card name" /></label>
        <button type="submit">Find</button>
      </form>
      <button type="button" className="gi-reset" onClick={reset}><RotateCcw size={15} /> Reset simulation</button>
    </div>

    <p className="gi-eta-status" role="status" aria-live="polite">{announcement}</p>

    <div className="gi-binder-layout">
      <div className="gi-book-stage">
        <div
          className={`gi-book${bookOpen ? ' is-open' : ' is-closed'}`}
          data-book-state={bookOpen ? 'open' : 'closed'}
          aria-label={bookOpen ? `Greed Island Book, ${section} page ${activePage + 1} of ${activePageCount}` : 'Greed Island Book, closed'}
          tabIndex={bookOpen ? 0 : undefined}
          aria-keyshortcuts={bookOpen ? 'ArrowLeft ArrowRight' : undefined}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'ArrowLeft') { event.preventDefault(); turnPage(-1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); turnPage(1); }
          }}
        >
          {!bookOpen ? <button type="button" className="gi-book__closed-cover" onClick={() => { setBookOpen(true); setAnnouncement('Eta: Book opened.'); }} aria-label="Open Greed Island Book">
            <span className="gi-book__corner gi-book__corner--tl" aria-hidden="true" />
            <span className="gi-book__corner gi-book__corner--tr" aria-hidden="true" />
            <span className="gi-book__corner gi-book__corner--bl" aria-hidden="true" />
            <span className="gi-book__corner gi-book__corner--br" aria-hidden="true" />
            <span className="gi-book__cover-lines" aria-hidden="true" />
            <span className="gi-book__cover-disc" aria-hidden="true"><i /><i /><i /></span>
            <span className="gi-book__cover-spine" aria-hidden="true"><i /><i /><i /></span>
            <span className="sr-only">Open Book</span>
          </button> : <>
            <div className="gi-book__open-frame">
              <span className="gi-book__metal gi-book__metal--tl" aria-hidden="true" />
              <span className="gi-book__metal gi-book__metal--tr" aria-hidden="true" />
              <span className="gi-book__metal gi-book__metal--bl" aria-hidden="true" />
              <span className="gi-book__metal gi-book__metal--br" aria-hidden="true" />
              <div className="gi-book__spine" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="gi-book__pages">
                <header className="gi-book__terminal">
                  <div><span>{section === 'specified' ? 'SPECIFIED SLOT' : 'FREE SLOT'}</span><b>{rangeLabel}</b></div>
                  <div><small>{section === 'specified' ? `${completion}/100 registered` : '45 storage pockets'}</small><button type="button" onClick={() => { setBookOpen(false); setAnnouncement('Eta: Book closed. Your stored progress remains saved.'); }} aria-label="Close Greed Island Book"><BookX size={16} /> Close</button></div>
                </header>
                <div className={`gi-book__spread gi-book__spread--${section}`}>
                  {renderLeaf('left', visibleSlots.slice(0, 5))}
                  {renderLeaf('right', visibleSlots.slice(5, 10))}
                </div>
                <nav className="gi-book__terminal-tabs" aria-label="Greed Island Book sections">
                  <button type="button" className={section === 'specified' ? 'is-active' : ''} aria-pressed={section === 'specified'} onClick={openSpecified}><Layers3 size={15} /> Specified</button>
                  <button type="button" className={section === 'free' ? 'is-active' : ''} aria-pressed={section === 'free'} onClick={openFreeSlots}><BookOpen size={15} /> Free Slots</button>
                  <button type="button" disabled aria-label="Player List, planned for a later stage"><Users size={15} /> Players</button>
                  <button type="button" disabled aria-label="Island Map, planned for a later stage"><Map size={15} /> Map</button>
                  <button type="button" onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><ScanLine size={15} /> Analysis</button>
                </nav>
              </div>
            </div>
            <nav className="gi-book__pagination" aria-label={`${section === 'specified' ? 'Specified Slot' : 'Free Slot'} Binder pages`}>
              <button type="button" onClick={() => turnPage(-1)} disabled={activePage === 0}><ArrowLeft size={16} /> Previous</button>
              <span>Page {activePage + 1} / {activePageCount}</span>
              <button type="button" onClick={() => turnPage(1)} disabled={activePage === activePageCount - 1}>Next <ArrowRight size={16} /></button>
            </nav>
          </>}
        </div>
        <p className="gi-book__reference">Visual reconstruction based on Hunterpedia’s <a href={BOOK_REFERENCE.page} target="_blank" rel="noreferrer noopener">{BOOK_REFERENCE.coverLabel} and {BOOK_REFERENCE.slotsLabel}</a> reference images. Controls and page contents remain an accessible archive interface.</p>
      </div>

      <aside className="gi-card-tray" aria-labelledby="gi-tray-title">
        <header><span>Card records</span><h3 id="gi-tray-title">Hold a card</h3><p>Drag a card into its slot, or select it and then activate the matching slot.</p></header>
        <div>{pageCards.map((card) => <InteractiveCard
          key={card.id}
          card={card}
          held={heldCardId === card.id}
          inserted={inserted.has(card.id)}
          disabled={inserted.has(card.id) || (card.id === '000' && !rulerUnlocked)}
          onHold={holdCard}
          onDragStart={holdCard}
        />)}</div>
      </aside>
    </div>

    <div className="gi-analysis" id="analysis" aria-live="polite">
      <div className="gi-analysis__device" aria-hidden="true"><i /><span>{selectedCard.id}</span><i /></div>
      <div>
        <span>Eta’s analysis console · archive reconstruction</span>
        <h3>{selectedCard.name}</h3>
        <dl><div><dt>Specified Slot</dt><dd>{selectedCard.id}</dd></div><div><dt>Rank</dt><dd>{selectedCard.rank}</dd></div><div><dt>Conversion limit</dt><dd>{selectedCard.conversionLimit}</dd></div><div><dt>Effect data</dt><dd><Check size={13} /> Verified</dd></div></dl>
        <p>{selectedCard.description}</p>
        <p><strong>Materialized form:</strong> {selectedCard.materializedAs}. <a href="#card-archive">Open the full acquisition and story record.</a></p>
      </div>
    </div>
  </section>;
}
