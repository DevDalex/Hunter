import { useMemo, useState } from 'react';
import { Activity, Bomb, Dumbbell, ExternalLink, Filter, Search, ShieldCheck, Trophy } from 'lucide-react';
import {
  finalBattleRecords,
  greedIslandTacticalStats,
  resolveGreedIslandTacticalSource,
  tacticalRecordCollections,
  tacticalStatusLabels,
} from '../../data/greed-island/tacticalRecords.js';
import './GreedIslandTacticalRecords.css';

const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const icons = { training: Dumbbell, razor: Activity, bomber: Bomb, battles: Trophy };

function TacticalBadge({ children, tone = 'neutral' }) {
  return <span className={`gi-tactical-badge is-${tone}`}>{children}</span>;
}

function SourceLink({ sourceId, children = 'Open tactical source' }) {
  const source = resolveGreedIslandTacticalSource(sourceId);
  return <a href={source.href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={12} /></a>;
}

function RecordCard({ record }) {
  const source = resolveGreedIslandTacticalSource(record.sourceId);
  return <article className="gi-tactical-record" aria-live="polite">
    <header>
      <span>{tacticalStatusLabels[record.status] || titleCase(record.status)} · {source.label}</span>
      <h3>{record.title}</h3>
      <p>{record.summary}</p>
    </header>
    <dl>
      {record.focus && <div><dt>Focus</dt><dd>{record.focus}</dd></div>}
      {record.location && <div><dt>Location</dt><dd>{record.location}</dd></div>}
      {record.outcome && <div><dt>Outcome</dt><dd>{record.outcome}</dd></div>}
      {record.order && <div><dt>Phase</dt><dd>{record.order}</dd></div>}
    </dl>
    <div className="gi-tactical-tags" aria-label={`${record.title} tactical actors and tags`}>
      {record.actors.map((actor) => <TacticalBadge key={actor} tone="actor">{actor}</TacticalBadge>)}
      {record.tags.map((tag) => <TacticalBadge key={tag}>{titleCase(tag)}</TacticalBadge>)}
    </div>
    {!!record.cards.length && <div className="gi-tactical-cards" aria-label={`${record.title} linked cards`}>
      {record.cards.map((card) => <TacticalBadge key={card} tone="card">{card}</TacticalBadge>)}
    </div>}
    <ol>{record.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    {!!record.counters.length && <section className="gi-tactical-counters"><h4>Counter / pressure notes</h4><p>{record.counters.join(' · ')}</p></section>}
    <SourceLink sourceId={record.sourceId} />
  </article>;
}

function TrainingLab({ records, selectedId, setSelectedId }) {
  const selected = records.find((record) => record.id === selectedId) || records[0];
  return <section className="gi-tactical-training" aria-labelledby="gi-tactical-training-title">
    <header><Dumbbell size={21} /><div><span>Biscuit training lab</span><h3 id="gi-tactical-training-title">Training is tracked as tactical preparation.</h3></div></header>
    <div className="gi-tactical-steps" role="group" aria-label="Biscuit training modules">
      {records.map((record, index) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} onClick={() => setSelectedId(record.id)} data-training-module={record.id}>
        <i>{String(index + 1).padStart(2, '0')}</i><span>{record.title}</span>
      </button>)}
    </div>
    <RecordCard record={selected} />
  </section>;
}

function RazorReplay({ records, selectedId, setSelectedId }) {
  const selected = records.find((record) => record.id === selectedId) || records[0];
  return <section className="gi-tactical-razor" aria-labelledby="gi-tactical-razor-title">
    <header><Activity size={21} /><div><span>Razor dodgeball replay</span><h3 id="gi-tactical-razor-title">The match is reconstructed as a phase ledger.</h3></div></header>
    <div className="gi-dodgeball-court" aria-label="Razor dodgeball phase selector">
      {records.map((record) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} style={{ '--phase': record.order }} onClick={() => setSelectedId(record.id)} data-dodgeball-phase={record.id}>
        <span>{record.order}</span><small>{record.title}</small>
      </button>)}
    </div>
    <RecordCard record={selected} />
  </section>;
}

function BomberConsole({ records, selectedId, setSelectedId }) {
  const [touch, setTouch] = useState(false);
  const [phrase, setPhrase] = useState(false);
  const [trioSplit, setTrioSplit] = useState(true);
  const selected = records.find((record) => record.id === selectedId) || records[0];
  const disarmed = touch && phrase;
  const releaseBlocked = trioSplit;

  return <section className="gi-tactical-bomber" aria-labelledby="gi-tactical-bomber-title">
    <header><Bomb size={21} /><div><span>Bomber system</span><h3 id="gi-tactical-bomber-title">Countdown is a conditions puzzle, not a damage meter.</h3></div></header>
    <div className="gi-tactical-bomber__layout">
      <div className="gi-tactical-list" aria-label="Bomber mechanics">
        {records.map((record) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} onClick={() => setSelectedId(record.id)} data-bomber-mechanic={record.id}>{record.title}</button>)}
      </div>
      <div className="gi-tactical-bomber__sim">
        <h4>Disarm / Release simulation</h4>
        <label><input type="checkbox" checked={touch} onChange={(event) => setTouch(event.target.checked)} /> <span>Victim touches Genthru</span></label>
        <label><input type="checkbox" checked={phrase} onChange={(event) => setPhrase(event.target.checked)} /> <span>Victim says “I caught the Bomber”</span></label>
        <label><input type="checkbox" checked={trioSplit} onChange={(event) => setTrioSplit(event.target.checked)} /> <span>Genthru, Sub, and Bara are split</span></label>
        <p role="status">{disarmed ? 'Countdown disarmed: both touch and exact phrase are present.' : 'Countdown remains dangerous: touch and exact phrase are not both satisfied.'} {releaseBlocked ? 'Release is blocked because the trio is split.' : 'Release risk remains because the trio can coordinate.'}</p>
      </div>
    </div>
    <RecordCard record={selected} />
  </section>;
}

function BattleSplit({ records, selectedId, setSelectedId }) {
  const selected = records.find((record) => record.id === selectedId) || records[0];
  return <section className="gi-tactical-battles" aria-labelledby="gi-tactical-battles-title">
    <header><Trophy size={21} /><div><span>Three final battles</span><h3 id="gi-tactical-battles-title">The Bomber trio is solved by splitting the field.</h3></div></header>
    <div className="gi-battle-grid" aria-label="Final battle selector">
      {records.map((record) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} onClick={() => setSelectedId(record.id)} data-final-battle={record.id}>
        <strong>{record.title}</strong><span>{record.outcome}</span>
      </button>)}
    </div>
    <RecordCard record={selected} />
  </section>;
}

export default function GreedIslandTacticalRecords() {
  const [collectionId, setCollectionId] = useState('training');
  const [query, setQuery] = useState('');
  const [selectedByCollection, setSelectedByCollection] = useState({
    training: 'gyo-feint-read',
    razor: 'gon-killua-hisoka-receive',
    bomber: 'countdown-conditions',
    battles: 'gon-vs-genthru',
  });
  const collections = tacticalRecordCollections;
  const collection = collections[collectionId];
  const Icon = icons[collectionId] || ShieldCheck;

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return collection.records;
    return collection.records.filter((record) => [
      record.title,
      record.summary,
      record.focus,
      record.location,
      record.outcome,
      ...record.actors,
      ...record.tags,
      ...record.counters,
    ].some((value) => String(value || '').toLowerCase().includes(normalized)));
  }, [collection, query]);

  const selectedId = selectedByCollection[collectionId];
  const setSelectedId = (id) => setSelectedByCollection((state) => ({ ...state, [collectionId]: id }));
  const activeRecords = matches.length ? matches : collection.records;
  const selectedRecord = activeRecords.find((record) => record.id === selectedId) || activeRecords[0];

  return <section className="gi-tactical" id="tactical-records" aria-labelledby="gi-tactical-title">
    <header className="gi-section-heading">
      <span>Stage 08 · Tactical records</span>
      <h2 id="gi-tactical-title">Training, Razor, Bomber mechanics, and final fights now read as connected tactics.</h2>
      <p>These tools analyze source-grounded combat systems without turning injuries or violence into a live game. Every tactical record stays tied to Hunterpedia/Fandom source pages.</p>
    </header>

    <div className="gi-tactical__metrics" aria-label="Greed Island tactical verification summary">
      <div><b>{greedIslandTacticalStats.trainingModules}</b><span>Biscuit training modules</span></div>
      <div><b>{greedIslandTacticalStats.dodgeballPhases}</b><span>Razor dodgeball phases</span></div>
      <div><b>{greedIslandTacticalStats.bomberMechanics}</b><span>Bomber mechanics</span></div>
      <div><b>{greedIslandTacticalStats.finalBattles}</b><span>final battle records</span></div>
    </div>

    <nav className="gi-tactical__tabs" aria-label="Tactical record collections">
      {Object.values(collections).map((item) => {
        const TabIcon = icons[item.id] || ShieldCheck;
        return <button type="button" key={item.id} className={collectionId === item.id ? 'is-active' : ''} aria-pressed={collectionId === item.id} onClick={() => { setCollectionId(item.id); setQuery(''); }}>
          <TabIcon size={17} /><span>{item.label}</span><small>{item.records.length}</small>
        </button>;
      })}
    </nav>

    <div className="gi-tactical__filters">
      <label className="gi-tactical__search"><Search size={16} /><span className="sr-only">Search tactical records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tactics, actors, counters…" /></label>
      <p><Filter size={15} /> {matches.length} matching {collection.label.toLowerCase()} records</p>
    </div>

    <div className="gi-tactical__active" data-tactical-collection={collectionId}>
      <div className="gi-tactical__collection-header"><Icon size={22} /><div><span>{collection.label}</span><h3>{selectedRecord?.title || collection.label}</h3></div></div>
      {collectionId === 'training' && <TrainingLab records={activeRecords} selectedId={selectedRecord.id} setSelectedId={setSelectedId} />}
      {collectionId === 'razor' && <RazorReplay records={activeRecords} selectedId={selectedRecord.id} setSelectedId={setSelectedId} />}
      {collectionId === 'bomber' && <BomberConsole records={activeRecords} selectedId={selectedRecord.id} setSelectedId={setSelectedId} />}
      {collectionId === 'battles' && <BattleSplit records={activeRecords.length ? activeRecords : finalBattleRecords} selectedId={selectedRecord.id} setSelectedId={setSelectedId} />}
    </div>

    <p className="gi-tactical__boundary"><ShieldCheck size={15} /> Archive simulations only: the page explains tactical conditions, counters, and outcomes from source records. It does not claim to recreate a live Greed Island combat engine.</p>
  </section>;
}
