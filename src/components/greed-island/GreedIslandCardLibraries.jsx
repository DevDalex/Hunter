import { useMemo, useState } from 'react';
import {
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

const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const classLabel = (code) => SPELL_CLASS_LABELS[code] || code;

const collectionSummaries = Object.freeze({
  spell: 'Forty blue-bordered Spell Cards with range class, spell class, target behavior, rank, limit, and Masadora acquisition.',
  free: 'The documented yellow-bordered Free Slot cards currently listed by Hunterpedia, not every possible Free Slot card on the island.',
  gm: 'Black-bordered Game Master-only Special Spells with negative numbers and restricted access.',
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

function LibraryRecord({ card }) {
  return <article className={`gi-card-libraries__record is-${card.category}`} aria-live="polite">
    <header>
      <span>{card.category === 'spell' ? 'Spell Card' : card.category === 'free' ? 'Documented Free Slot Card' : 'Game Master-only Card'}</span>
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
    {card.acquisition && <section>
      <h4><MapPin size={16} /> Acquisition</h4>
      <p>{card.acquisition.summary}</p>
      <small>{card.acquisition.location}</small>
    </section>}
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

export default function GreedIslandCardLibraries() {
  const [collection, setCollection] = useState('spell');
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedByCollection, setSelectedByCollection] = useState({ spell: '1006', free: '100', gm: '-000' });
  const collections = greedIslandCardLibraryCollections;
  const active = collections[collection];
  const cards = active.cards;
  const selectedId = selectedByCollection[collection];

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

  const selected = cards.find((card) => card.id === selectedId) || filtered[0] || cards[0];
  const attackCount = spellCards.filter((card) => card.classes.includes('AS')).length;
  const defenseCount = spellCards.filter((card) => card.classes.some((code) => ['DS', 'AA', 'VS'].includes(code))).length;

  return <section className="gi-card-libraries" id="card-libraries" aria-labelledby="gi-card-libraries-title">
    <header className="gi-section-heading">
      <span>Stage 06 · Card libraries</span>
      <h2 id="gi-card-libraries-title">Spell, Free Slot, and Game Master cards are separated and searchable.</h2>
      <p>These records cover the non-Specified card systems that drive targeting, protection, travel, Free Slot storage, and Game Master control without mixing their rules together.</p>
    </header>

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
        onClick={() => { setCollection(item.id); setClassFilter('all'); }}
        aria-pressed={collection === item.id}
      >
        <i aria-hidden="true" className={`is-${item.border}`} />
        <span>{item.label}</span>
        <small>{item.cards.length}</small>
      </button>)}
    </nav>

    <div className="gi-card-libraries__filters">
      <label className="gi-card-libraries__search"><Search size={16} /><span className="sr-only">Search Greed Island card libraries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search spell, class, target, card…" /></label>
      <label><Filter size={15} /><span>Class</span><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} disabled={collection === 'free'}>
        <option value="all">All classes</option>
        {Object.entries(SPELL_CLASS_LABELS).map(([code, label]) => <option key={code} value={code}>{code} · {label}</option>)}
      </select></label>
    </div>

    <p className="gi-card-libraries__summary"><BookOpen size={15} /> {collectionSummaries[collection]}</p>

    <div className="gi-card-libraries__layout">
      <aside className="gi-card-libraries__results" aria-label={`${filtered.length} matching card library records`}>
        <header><b>{filtered.length}</b><span>matching records</span></header>
        <div>
          {filtered.map((card) => <button
            type="button"
            key={card.id}
            className={selected?.id === card.id ? 'is-active' : ''}
            aria-pressed={selected?.id === card.id}
            onClick={() => setSelectedByCollection((state) => ({ ...state, [collection]: card.id }))}
            data-library-card={card.id}
          >
            <i>{card.displayNumber || card.id}</i>
            <span><strong>{card.name}</strong><small>{card.category === 'spell' ? `${card.range} · ${card.classes.join('/')}` : card.category === 'free' ? `${titleCase(card.kind)} · ${card.rank}-${card.limitLabel}` : 'LR · *S'}</small></span>
          </button>)}
          {!filtered.length && <p>No library records match these filters.</p>}
        </div>
      </aside>
      {selected && <LibraryRecord card={selected} />}
    </div>

    <SpellLab />

    <p className="gi-card-libraries__provenance"><Users size={15} /> Library effects are concise archive paraphrases of the Hunterpedia table. Free Slot coverage means the table’s documented Free Slot examples, not every possible Greed Island object. <a href={GREED_ISLAND_LIBRARY_SOURCE.href} target="_blank" rel="noreferrer noopener">Open shared source <ExternalLink size={12} /></a></p>
  </section>;
}
