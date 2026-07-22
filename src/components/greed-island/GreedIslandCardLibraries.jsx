import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  documentedFreeSlotCards,
  gameMasterCards,
  greedIslandCardLibraryCollections,
  GREED_ISLAND_LIBRARY_SOURCE,
  SPELL_CLASS_LABELS,
  spellCards,
  spellCardsById,
} from '../../data/greed-island/cardLibraries.js';
import './GreedIslandCardLibraries.css';

const PAGE_SIZE = 9;
const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const classLabel = (code) => SPELL_CLASS_LABELS[code] || code;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

const collectionSummaries = Object.freeze({
  spell: 'Forty blue-bordered Spell Cards with range class, spell class, target behavior, rank, limit, and Masadora acquisition.',
  free: 'The documented yellow-bordered Free Slot cards currently listed by Hunterpedia, not every possible Free Slot card on the island.',
  gm: 'Black-bordered Game Master-only Special Spells with negative numbers and restricted access.',
});

const collectionNouns = Object.freeze({
  spell: 'Spell Card',
  free: 'Documented Free Slot Card',
  gm: 'Game Master-only Card',
});

function LibraryBadge({ children, tone = 'neutral' }) {
  return <span className={`gi-library-badge is-${tone}`}>{children}</span>;
}

function CardClassBadges({ card }) {
  if (!card.range && !card.classes?.length) return null;
  return <div className="gi-card-libraries__classes" aria-label={`${card.name} class badges`}>
    {card.range && <LibraryBadge tone="range">{card.range} · {classLabel(card.range)}</LibraryBadge>}
    {card.classes?.map((code) => <LibraryBadge key={code} tone={code === 'AS' ? 'attack' : code === 'DS' || code === 'AA' || code === 'VS' ? 'defense' : code === '*S' ? 'gm' : 'spell'}>{code} · {classLabel(code)}</LibraryBadge>)}
  </div>;
}

function LibraryCardFace({ card }) {
  const number = card.displayNumber || card.id;
  const code = card.category === 'spell' ? card.range : card.category === 'free' ? card.rank : '*S';
  const secondary = card.category === 'spell'
    ? card.classes.join('/')
    : card.category === 'free'
      ? `${titleCase(card.kind)} · ${card.rank}-${card.limitLabel}`
      : 'LR · Game Master';

  return <span className={`gi-library-card-face is-${card.category}`} aria-hidden="true">
    <span className="gi-library-card-face__top"><b>{number}</b><i>{code}</i></span>
    <span className="gi-library-card-face__sigil"><i>{card.category === 'spell' ? 'S' : card.category === 'free' ? 'F' : 'GM'}</i></span>
    <strong>{card.name}</strong>
    <small>{secondary}</small>
  </span>;
}

function LibraryRecord({ card, expanded }) {
  return <article className={`gi-card-libraries__record is-${card.category}`} aria-live="polite">
    <header>
      <span>{collectionNouns[card.category === 'game-master' ? 'gm' : card.category]}</span>
      <h3>{card.name}</h3>
      <p>{card.effect}</p>
    </header>
    <CardClassBadges card={card} />
    <dl>
      <div><dt>Number</dt><dd>{card.displayNumber || card.id}</dd></div>
      <div><dt>Border</dt><dd>{titleCase(card.border)}</dd></div>
      {card.rank && <div><dt>Rank / limit</dt><dd>{card.rank}-{card.limitLabel || card.conversionLimit}</dd></div>}
      {card.target && <div><dt>Target</dt><dd>{card.target}</dd></div>}
      {card.kind && <div><dt>Material type</dt><dd>{titleCase(card.kind)}</dd></div>}
      {card.access && <div><dt>Access</dt><dd>{card.access}</dd></div>}
    </dl>
    <div className={`gi-card-libraries__extended${expanded ? ' is-open' : ''}`} aria-hidden={!expanded}>
      {card.acquisition ? <section>
        <h4><MapPin size={16} /> Acquisition</h4>
        <p>{card.acquisition.summary}</p>
        <small>{card.acquisition.location}</small>
      </section> : <section>
        <h4><ShieldCheck size={16} /> Access boundary</h4>
        <p>{card.access || 'This record has no player-facing acquisition route documented in the shared table.'}</p>
        <small>Verified library classification</small>
      </section>}
      <section>
        <h4><BookOpen size={16} /> Archive note</h4>
        <p>{collectionSummaries[card.category === 'game-master' ? 'gm' : card.category]}</p>
        <small>Verified {card.verifiedAt}</small>
      </section>
    </div>
    <a href={card.source || GREED_ISLAND_LIBRARY_SOURCE.href} target="_blank" rel="noreferrer noopener">Open table source <ExternalLink size={13} /></a>
  </article>;
}

function SpellLab() {
  const attackSpells = spellCards.filter((card) => card.classes.includes('AS'));
  const defenses = spellCards.filter((card) => card.classes.some((code) => ['DS', 'AA', 'VS'].includes(code)));
  const [attackId, setAttackId] = useState('1006');
  const [defenseId, setDefenseId] = useState('1003');
  const [binderOpen, setBinderOpen] = useState(true);
  const attack = spellCardsById.get(attackId) || attackSpells[0];
  const defense = spellCardsById.get(defenseId) || defenses[0];
  const defenseKinds = defense.classes.filter((code) => ['DS', 'AA', 'VS'].includes(code));
  const outcome = binderOpen
    ? `${attack.name} creates the documented 15-second response window because the Binder is open. ${defense.name} can answer as ${defenseKinds.map(classLabel).join(' / ')}.`
    : `${attack.name} resolves with no defensive-response pause because this simulation has the Binder closed.`;

  return <section className="gi-card-libraries__lab" aria-labelledby="gi-spell-lab-title">
    <header><ShieldCheck size={20} /><div><span>Spell targeting lab</span><h3 id="gi-spell-lab-title">Attack, defense, and response timing</h3></div></header>
    <div className="gi-card-libraries__lab-grid">
      <label><span>Attack Spell</span><select value={attackId} onChange={(event) => setAttackId(event.target.value)}>
        {attackSpells.map((card) => <option key={card.id} value={card.id}>{card.id} · {card.name}</option>)}
      </select></label>
      <label><span>Defensive answer</span><select value={defenseId} onChange={(event) => setDefenseId(event.target.value)}>
        {defenses.map((card) => <option key={card.id} value={card.id}>{card.id} · {card.name}</option>)}
      </select></label>
      <label className="gi-card-libraries__toggle"><input type="checkbox" checked={binderOpen} onChange={(event) => setBinderOpen(event.target.checked)} /><span>Target has Binder open</span></label>
    </div>
    <p className="gi-card-libraries__outcome" role="status">{outcome}</p>
    <small>Archive simulation only: it explains the verified timing and counter classes without changing a live game state.</small>
  </section>;
}

export default function GreedIslandCardLibraries({ requestedCollection, onCollectionChange }) {
  const collections = greedIslandCardLibraryCollections;
  const [localCollection, setLocalCollection] = useState('spell');
  const collection = collections[requestedCollection] ? requestedCollection : localCollection;
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedByCollection, setSelectedByCollection] = useState({ spell: '1006', free: '100', gm: '-000' });
  const [pageByCollection, setPageByCollection] = useState({ spell: 0, free: 0, gm: 0 });
  const [expanded, setExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState('Spell Card Binder opened. Pickpocket is highlighted.');
  const active = collections[collection];
  const cards = active.cards;

  useEffect(() => {
    const remembered = collections[collection].cards.find((card) => card.id === selectedByCollection[collection]) || collections[collection].cards[0];
    setQuery('');
    setClassFilter('all');
    setExpanded(false);
    setPageByCollection((state) => ({ ...state, [collection]: 0 }));
    setAnnouncement(`${collections[collection].label} Binder opened. ${remembered.name} is highlighted.`);
  }, [collection]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cards.filter((card) => {
      if (classFilter !== 'all' && card.category !== 'free') {
        if (![card.range, ...(card.classes || [])].includes(classFilter)) return false;
      }
      if (!normalized) return true;
      return [
        card.id,
        card.displayNumber,
        card.name,
        card.rank,
        card.kind,
        card.target,
        card.effect,
        ...(card.behavior || []),
        ...(card.classes || []),
      ].some((value) => String(value || '').toLowerCase().includes(normalized));
    });
  }, [cards, classFilter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = clamp(pageByCollection[collection] || 0, 0, pageCount - 1);
  const pageStart = page * PAGE_SIZE;
  const pageCards = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const preferred = pageCards.find((card) => card.id === selectedByCollection[collection]);
  const selected = preferred || pageCards[0] || filtered[0] || null;
  const selectedGlobalIndex = selected ? filtered.findIndex((card) => card.id === selected.id) : -1;
  const pockets = Array.from({ length: PAGE_SIZE }, (_, index) => pageCards[index] || null);
  const attackCount = spellCards.filter((card) => card.classes.includes('AS')).length;
  const defenseCount = spellCards.filter((card) => card.classes.some((code) => ['DS', 'AA', 'VS'].includes(code))).length;

  const setCollectionPage = (nextPage) => setPageByCollection((state) => ({ ...state, [collection]: nextPage }));

  const chooseCollection = (id) => {
    setLocalCollection(id);
    setClassFilter('all');
    setQuery('');
    setExpanded(false);
    const first = collections[id].cards.find((card) => card.id === selectedByCollection[id]) || collections[id].cards[0];
    setAnnouncement(`${collections[id].label} Binder opened. ${first.name} is highlighted.`);
    onCollectionChange?.(id);
  };

  const selectCard = (card, index, prefix = 'Highlighted') => {
    setSelectedByCollection((state) => ({ ...state, [collection]: card.id }));
    setCollectionPage(Math.floor(index / PAGE_SIZE));
    setExpanded(false);
    setAnnouncement(`${prefix} ${collectionNouns[collection]} ${card.displayNumber || card.id}, ${card.name}.`);
  };

  const openPage = (nextPage) => {
    const bounded = clamp(nextPage, 0, pageCount - 1);
    const start = bounded * PAGE_SIZE;
    const length = Math.min(PAGE_SIZE, filtered.length - start);
    const local = Math.min(4, Math.max(0, length - 1));
    const card = filtered[start + local];
    setCollectionPage(bounded);
    setExpanded(false);
    if (card) {
      setSelectedByCollection((state) => ({ ...state, [collection]: card.id }));
      setAnnouncement(`Opened ${active.label} page ${bounded + 1} of ${pageCount}. ${card.name} is highlighted.`);
    } else {
      setAnnouncement(`No ${active.label.toLowerCase()} match the current filters.`);
    }
  };

  const moveSelection = (direction) => {
    if (!selected || selectedGlobalIndex < 0) return;
    const delta = direction === 'left' ? -1 : direction === 'right' ? 1 : direction === 'up' ? -3 : 3;
    const nextIndex = clamp(selectedGlobalIndex + delta, 0, filtered.length - 1);
    if (nextIndex === selectedGlobalIndex) {
      setAnnouncement(`The ${direction} edge of this card library has been reached.`);
      return;
    }
    selectCard(filtered[nextIndex], nextIndex, `${titleCase(direction)} control moved to`);
  };

  const handleBookKeys = (event) => {
    if (event.target !== event.currentTarget) return;
    const actions = {
      ArrowLeft: () => moveSelection('left'),
      ArrowRight: () => moveSelection('right'),
      ArrowUp: () => moveSelection('up'),
      ArrowDown: () => moveSelection('down'),
      PageUp: () => openPage(page - 1),
      PageDown: () => openPage(page + 1),
      Home: () => filtered[0] && selectCard(filtered[0], 0),
      End: () => filtered.length && selectCard(filtered.at(-1), filtered.length - 1),
      Enter: () => setExpanded((value) => !value),
      ' ': () => setExpanded((value) => !value),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const updateQuery = (value) => {
    setQuery(value);
    setCollectionPage(0);
    setExpanded(false);
  };

  const updateClassFilter = (value) => {
    setClassFilter(value);
    setCollectionPage(0);
    setExpanded(false);
  };

  return <section
    className="gi-card-libraries"
    id="card-libraries"
    aria-labelledby="gi-card-libraries-title"
    data-card-library={collection}
    data-library-total={filtered.length}
    data-library-page={page + 1}
    data-library-page-count={pageCount}
    data-library-selected-card={selected?.id || ''}
  >
    <header className="gi-section-heading">
      <span>Stage 06 · Card library Binders</span>
      <h2 id="gi-card-libraries-title">Spell, Free Slot, and Game Master cards now live inside their own Books.</h2>
      <p>Each collection uses physical card pockets, page controls, red directional buttons, keyboard navigation, search, and a right-hand explanation display.</p>
    </header>

    <p className="gi-card-libraries__status" role="status" aria-live="polite">{announcement}</p>

    <div className="gi-card-libraries__metrics" aria-label="Greed Island card library verification summary">
      <div><b>{spellCards.length}</b><span>Spell Cards</span></div>
      <div><b>{documentedFreeSlotCards.length}</b><span>documented Free Slot cards</span></div>
      <div><b>{gameMasterCards.length}</b><span>Game Master-only cards</span></div>
      <div><b>{attackCount}/{defenseCount}</b><span>attack / defensive spells</span></div>
    </div>

    <nav className="gi-card-libraries__tabs" aria-label="Card library collections">
      {Object.values(collections).map((item) => <button
        type="button"
        key={item.id}
        className={collection === item.id ? 'is-active' : ''}
        onClick={() => chooseCollection(item.id)}
        aria-pressed={collection === item.id}
      >
        <i aria-hidden="true" className={`is-${item.border}`} />
        <span>{item.label}</span>
        <small>{item.cards.length}</small>
      </button>)}
    </nav>

    <div
      className={`gi-library-book is-${active.border}`}
      tabIndex={0}
      aria-label={`${active.label} Binder, page ${page + 1} of ${pageCount}${selected ? `, selected ${selected.displayNumber || selected.id}, ${selected.name}` : ''}`}
      aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown PageUp PageDown Home End Enter Space"
      onKeyDown={handleBookKeys}
    >
      <section className="gi-library-book__leaf" aria-label={`${active.label} page ${page + 1}`}>
        <header className="gi-library-book__leaf-header">
          <div><span>{active.label}</span><strong>{filtered.length} matching cards</strong></div>
          <div><b>Page {String(page + 1).padStart(2, '0')}</b><small>{pageCount} total</small></div>
        </header>

        <div className="gi-library-book__pockets" aria-label={`${pageCards.length} cards on this page`}>
          {pockets.map((card, index) => card ? <button
            type="button"
            key={card.id}
            className={`gi-library-book__card${selected?.id === card.id ? ' is-selected' : ''}`}
            onClick={() => selectCard(card, pageStart + index)}
            aria-pressed={selected?.id === card.id}
            aria-label={`${collectionNouns[collection]} ${card.displayNumber || card.id}, ${card.name}${selected?.id === card.id ? ', highlighted' : ''}`}
            data-library-card={card.id}
          ><LibraryCardFace card={card} /></button> : <span key={`empty-${collection}-${page}-${index}`} className="gi-library-book__card is-empty" role="img" aria-label="Unused card pocket"><i /></span>)}
        </div>

        <nav className="gi-library-book__pages" aria-label={`${active.label} pages`}>
          {Array.from({ length: pageCount }, (_, index) => <button
            type="button"
            key={index}
            className={index === page ? 'is-active' : ''}
            aria-current={index === page ? 'page' : undefined}
            aria-label={`Open ${active.label} page ${index + 1}`}
            onClick={() => openPage(index)}
          >{String(index + 1).padStart(2, '0')}</button>)}
        </nav>
      </section>

      <div className="gi-library-book__hinge" aria-hidden="true"><i /><i /></div>

      <section className="gi-library-book__console" aria-label="Selected library card details and controls">
        <div className="gi-library-book__screen">
          <header><div><span>Card analysis</span><b>{selected?.displayNumber || selected?.id || '—'}</b></div><small>{active.label}</small></header>

          <div className="gi-card-libraries__filters">
            <label className="gi-card-libraries__search"><Search size={16} /><span className="sr-only">Search Greed Island card libraries</span><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search name, class, target, effect…" /></label>
            <label><Filter size={15} /><span>Class</span><select value={classFilter} onChange={(event) => updateClassFilter(event.target.value)} disabled={collection === 'free'}>
              <option value="all">All classes</option>
              {Object.entries(SPELL_CLASS_LABELS).map(([code, label]) => <option key={code} value={code}>{code} · {label}</option>)}
            </select></label>
          </div>

          {selected ? <LibraryRecord card={selected} expanded={expanded} /> : <p className="gi-card-libraries__empty">No cards match the current search and class filters.</p>}

          <footer><span><BookOpen size={14} /> {collectionSummaries[collection]}</span></footer>
        </div>

        <div className="gi-library-book__controls">
          <div className="gi-library-book__active-card" aria-label={selected ? `Active card: ${selected.name}` : 'No active card'}>
            <span>Active card</span>
            {selected ? <LibraryCardFace card={selected} /> : <i />}
          </div>
          <div className="gi-library-book__dpad" aria-label="Red card-library directional controls">
            <button type="button" className="is-up" onClick={() => moveSelection('up')} aria-label="Move library highlight up"><ArrowUp aria-hidden="true" /></button>
            <button type="button" className="is-left" onClick={() => moveSelection('left')} aria-label="Move library highlight left"><ArrowLeft aria-hidden="true" /></button>
            <button type="button" className="is-center" onClick={() => setExpanded((value) => !value)} aria-label={`${expanded ? 'Close' : 'Open'} extended library record`} aria-pressed={expanded}><BookOpen aria-hidden="true" /></button>
            <button type="button" className="is-right" onClick={() => moveSelection('right')} aria-label="Move library highlight right"><ArrowRight aria-hidden="true" /></button>
            <button type="button" className="is-down" onClick={() => moveSelection('down')} aria-label="Move library highlight down"><ArrowDown aria-hidden="true" /></button>
          </div>
        </div>
      </section>
    </div>

    <nav className="gi-card-libraries__accessible-nav" aria-label={`${active.label} page controls`}>
      <button type="button" onClick={() => openPage(page - 1)} disabled={page === 0}><ArrowLeft size={16} /> Previous page</button>
      <span>Page {page + 1} / {pageCount} · {filtered.length} records</span>
      <button type="button" onClick={() => openPage(page + 1)} disabled={page === pageCount - 1}>Next page <ArrowRight size={16} /></button>
    </nav>

    {collection === 'spell' && <SpellLab />}

    <p className="gi-card-libraries__provenance"><Users size={15} /> Library effects are concise archive paraphrases of the Hunterpedia table. Free Slot coverage means the table’s documented Free Slot examples, not every possible Greed Island object. <a href={GREED_ISLAND_LIBRARY_SOURCE.href} target="_blank" rel="noreferrer noopener">Open shared source <ExternalLink size={12} /></a></p>
  </section>;
}
