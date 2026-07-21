import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Search } from 'lucide-react';
import { readStoredJson, writeStoredJson } from '../../lib/browserStorage';
import { specifiedCards, specifiedCardById } from '../../data/greed-island/specifiedCards';
import InteractiveCard from './InteractiveCard';

const STORAGE_KEY = 'hxh-greed-island-binder-v1';
const PAGE_SIZE = 10;

function readBinderProgress() {
  const stored = readStoredJson(STORAGE_KEY, []);
  if (!Array.isArray(stored)) return new Set();
  return new Set(stored.filter((id) => specifiedCardById.has(id)));
}

export default function GreedIslandBinder() {
  const [page, setPage] = useState(0);
  const [inserted, setInserted] = useState(readBinderProgress);
  const [heldCardId, setHeldCardId] = useState('002');
  const [selectedCardId, setSelectedCardId] = useState('002');
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState('Eta: Hold a card, then place it in the slot with the same number.');

  const pageCards = specifiedCards.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
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

  const jumpToCard = () => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;
    const match = specifiedCards.find((card) => card.id === normalized.padStart(3, '0') || card.name.toLowerCase().includes(normalized));
    if (!match) {
      setAnnouncement(`Eta: No Specified Slot card matches “${query.trim()}”.`);
      return;
    }
    setPage(Math.floor(match.number / PAGE_SIZE));
    setSelectedCardId(match.id);
    setAnnouncement(`Eta: Opened the Binder page containing ${match.id}, ${match.name}.`);
  };

  const reset = () => {
    persist(new Set());
    setHeldCardId('002');
    setSelectedCardId('002');
    setPage(0);
    setAnnouncement('Eta: Binder simulation reset. Plot of Beach is held for the tutorial.');
  };

  return <section className="gi-binder-section" id="binder" aria-labelledby="gi-binder-title">
    <header className="gi-section-heading">
      <span>Foundation system 01</span>
      <h2 id="gi-binder-title">The Specified Slot Binder</h2>
      <p>One hundred canonical slots, local progress, matching-number validation, and equal drag, tap, and keyboard paths.</p>
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
      <div className="gi-book" aria-label={`Binder page ${page + 1} of 10`}>
        <div className="gi-book__cover" aria-hidden="true"><span>G</span><b>GREED ISLAND</b><span>I</span></div>
        <div className="gi-book__pages">
          <header><span>SPECIFIED SLOT</span><b>{String(page * PAGE_SIZE).padStart(3, '0')}–{String(page * PAGE_SIZE + 9).padStart(3, '0')}</b></header>
          <div className="gi-slot-grid">
            {pageCards.map((card) => {
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
            })}
          </div>
          <footer><span>FREE SLOT 01–45</span><span>PLAYER LIST</span><span>MAP</span><span>ANALYSIS</span></footer>
        </div>
        <nav className="gi-book__pagination" aria-label="Binder pages">
          <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}><ArrowLeft size={16} /> Previous</button>
          <span>Page {page + 1} / 10</span>
          <button type="button" onClick={() => setPage((value) => Math.min(9, value + 1))} disabled={page === 9}>Next <ArrowRight size={16} /></button>
        </nav>
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

    <div className="gi-analysis" aria-live="polite">
      <div className="gi-analysis__device" aria-hidden="true"><i /><span>{selectedCard.id}</span><i /></div>
      <div>
        <span>Eta’s analysis console · archive reconstruction</span>
        <h3>{selectedCard.name}</h3>
        <dl><div><dt>Specified Slot</dt><dd>{selectedCard.id}</dd></div><div><dt>Rank</dt><dd>{selectedCard.rank}</dd></div><div><dt>Conversion limit</dt><dd>{selectedCard.conversionLimit}</dd></div><div><dt>Core data</dt><dd><Check size={13} /> Verified</dd></div></dl>
        <p>Descriptions, acquisition quests, story uses, chapter mapping, episode mapping, and visual files remain visibly pending rather than being guessed.</p>
      </div>
    </div>
  </section>;
}
