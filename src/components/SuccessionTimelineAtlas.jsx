import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  BrainCircuit,
  Check,
  Clock3,
  Copy,
  GitBranch,
  Layers3,
  NotebookPen,
  Search,
  Share2,
  ShipWheel,
  UsersRound,
} from 'lucide-react';
import {
  getActiveCountdowns,
  getAllianceBetrayalLedger,
  getBlackWhaleSnapshotComparison,
  getChapterStateDiff,
  getCharacterCampaignDossier,
  getCharacterDossier,
  getCharactersWithStateProfiles,
  getConsequenceChains,
  getDeceptionLedger,
  getEntityById,
  getFactionResourceBoard,
  getKnowledgeWarfareMatrix,
  getKurapikaMissionLedger,
  getLeverageBoard,
  getLifeStatusLedger,
  getMafiaWarCommandCenter,
  getMartialLawCommandBoard,
  getNenTrainingTracker,
  getOrdersSurveillanceCustodyLedger,
  getPrinceCampaignBoard,
  getReaderVsInUniverseKnowledge,
  getStorySnapshotAtChapter,
  getStoryThreadsAtChapter,
  getTroupeHisokaTracker,
  getUnresolvedLedgers,
} from '../data/succession/successionData';
import { timelineTracks } from '../data/successionTimeline';
import {
  timelineDeadlines,
  timelineNenDevelopments,
} from '../data/successionTimelineIntelligence';
import { timelineQuestionLedger } from '../data/successionTimelineQuestions';
import SafeImage from './SafeImage';

export const TIMELINE_DEPTHS = Object.freeze([
  { id: 'pulse', label: 'Pulse', note: 'The five defining turns and live voyage pressure.' },
  { id: 'recap', label: 'Recap', note: 'Major events only, written for fast re-entry.' },
  { id: 'study', label: 'Study', note: 'Major and supporting events with context.' },
  { id: 'research', label: 'Research', note: 'Every event with evidence and analytical tools.' },
  { id: 'complete', label: 'Complete', note: 'The unabridged archive and full dossiers.' },
]);

const views = Object.freeze([
  ['overview', 'Situation', AlertTriangle],
  ['threads', 'Threads', GitBranch],
  ['people', 'People', UsersRound],
  ['ship', 'Ship', ShipWheel],
  ['intelligence', 'Intelligence', BrainCircuit],
  ['research', 'Research desk', NotebookPen],
]);
const intelligenceViews = Object.freeze([
  ['knowledge', 'Knowledge'],
  ['operations', 'Operations'],
  ['deadlines', 'Deadlines'],
  ['nen', 'Nen'],
  ['mysteries', 'Mysteries'],
  ['decisions', 'Decisions'],
  ['causality', 'Causality'],
  ['evidence', 'Evidence'],
]);
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const entityName = (id) => getEntityById(id)?.name || labelize(String(id || '').split(':').at(-1));
const joinNames = (ids = [], limit = Number.MAX_SAFE_INTEGER) => ids.slice(0, limit).map(entityName).join(' · ') || 'None published';
const recordCount = (value) => Array.isArray(value) ? value.length : value && typeof value === 'object' ? Object.keys(value).length : value ? 1 : 0;
const itemKey = (item) => `${item.route}|${item.entityId || ''}|${JSON.stringify(item.params || {})}`;
const isSameMemoryItem = (left, right) => left?.entityId && right?.entityId
  ? left.entityId === right.entityId
  : itemKey(left) === itemKey(right);
const statusTone = (value) => /dead|deceased|failed|ended/i.test(String(value || ''))
  ? 'dead'
  : /unknown|unresolved|possess|occupied|exception/i.test(String(value || ''))
    ? 'uncertain'
    : 'active';

function AtlasSectionHeader({ eyebrow, title, detail, action }) {
  return <header className="sta-section-head"><div><span>{eyebrow}</span><h3>{title}</h3>{detail && <p>{detail}</p>}</div>{action}</header>;
}

function EntityPortrait({ entity, compact = false }) {
  if (!entity) return null;
  return <SafeImage
    className={compact ? 'sta-portrait is-compact' : 'sta-portrait'}
    src={entity.media?.portrait || entity.image || entity.imageSource || ''}
    fallbackLabel={entity.name}
    alt={`${entity.name} archive portrait`}
  />;
}

function ChapterDensity({ chapters, chapterMaximum, onSelectChapter }) {
  const maximum = Math.max(1, ...chapters.map((chapter) => chapter.count));
  return <section className="sta-density" aria-labelledby="sta-density-title">
    <header><div><span>Chapter density navigator</span><strong id="sta-density-title">Ch. {chapters[0]?.chapter || 340}–{chapterMaximum}</strong></div><p>Height = record density. Marks = death, Nen, emergency, or major turn.</p></header>
    <div className="sta-density__plot">
      {chapters.map((chapter) => <button
        type="button"
        className={`sta-density__bar${chapter.major ? ' has-major' : ''}${chapter.types.has('death') ? ' has-death' : ''}${chapter.types.has('emergency') ? ' has-emergency' : ''}`}
        style={{ '--density-height': `${Math.max(7, Math.round((chapter.count / maximum) * 100))}%` }}
        title={`Chapter ${chapter.chapter}: ${chapter.count} records${chapter.major ? ' · major turn' : ''}`}
        aria-label={`Filter to Chapter ${chapter.chapter}, ${chapter.count} records`}
        onClick={() => onSelectChapter(chapter.chapter)}
        key={chapter.chapter}
      ><i /><span>{chapter.chapter % 5 === 0 || chapter.chapter === chapterMaximum ? chapter.chapter : ''}</span></button>)}
    </div>
    <footer><span><i className="is-major" /> Major</span><span><i className="is-death" /> Fatality</span><span><i className="is-emergency" /> Emergency</span></footer>
  </section>;
}

function DayNavigator({ dayRows, activeDay, onSelectDay }) {
  return <nav className="sta-days" aria-label="Voyage day navigator">
    {dayRows.map((row) => <button
      type="button"
      className={String(activeDay) === String(row.day) ? 'is-active' : ''}
      aria-pressed={String(activeDay) === String(row.day)}
      onClick={() => onSelectDay(row.day)}
      key={row.day ?? 'prelude'}
    ><span>{row.day ? `D${String(row.day).padStart(2, '0')}` : 'PRE'}</span><strong>{row.count}</strong><small>{row.chapterLabel}</small></button>)}
    <button type="button" className={activeDay === 'all' ? 'is-active' : ''} aria-pressed={activeDay === 'all'} onClick={() => onSelectDay('all')}><span>ALL</span><strong>{dayRows.reduce((total, row) => total + row.count, 0)}</strong><small>Full record</small></button>
  </nav>;
}

function VoyageState({ chapter, day, princeBoard, storySnapshot, deadlines, mysteryCount, eventCount, depth, onDepthChange, onShare }) {
  const deceased = princeBoard.filter((row) => statusTone(row.life) === 'dead').length;
  const exceptional = princeBoard.filter((row) => statusTone(row.life) === 'uncertain').length;
  const alive = princeBoard.length - deceased;
  const activeDeadlineCount = deadlines.filter((record) => !/completed|failed|executed/i.test(record.status)).length;
  const emergency = chapter >= 411 ? 'SPECIAL MARTIAL LAW' : chapter >= 383 ? 'MULTI-FRONT CRISIS' : 'CONTEST ACTIVE';
  return <section className="sta-state" aria-labelledby="sta-state-title">
    <header>
      <div><span>STATE OF THE VOYAGE · CHAPTER-BOUNDED</span><h2 id="sta-state-title">{emergency}</h2><p>{storySnapshot?.phasePresentation?.summary || storySnapshot?.phase?.summary || 'Royal, military, and lower-tier conflicts remain synchronized to the selected chapter.'}</p></div>
      <button type="button" onClick={onShare}><Share2 size={15} aria-hidden="true" /> Copy permanent view</button>
    </header>
    <div className="sta-state__clock"><span>{day ? `VOYAGE DAY ${day}` : 'PRE-VOYAGE'}</span><strong>CHAPTER {chapter}</strong><small>{storySnapshot?.phase?.name || storySnapshot?.phasePresentation?.title || 'Succession Contest'}</small></div>
    <dl>
      <div><dt>Princes alive</dt><dd>{alive}<small>{deceased} dead · {exceptional} exceptional</small></dd></div>
      <div><dt>Open threads</dt><dd>{storySnapshot?.openThreads?.length || 0}<small>{storySnapshot?.resolvedThreads?.length || 0} resolved</small></dd></div>
      <div><dt>Live deadlines</dt><dd>{activeDeadlineCount}<small>{deadlines.length} tracked</small></dd></div>
      <div><dt>Open mysteries</dt><dd>{mysteryCount}<small>Evidence-led</small></dd></div>
      <div><dt>Indexed records</dt><dd>{eventCount.toLocaleString()}<small>None discarded</small></dd></div>
    </dl>
    <footer className="sta-depth" aria-label="Semantic reading depth">
      <div><span>Semantic zoom</span><strong>{TIMELINE_DEPTHS.find((item) => item.id === depth)?.note}</strong></div>
      <nav>{TIMELINE_DEPTHS.map((item, index) => <button type="button" className={depth === item.id ? 'is-active' : ''} aria-pressed={depth === item.id} onClick={() => onDepthChange(item.id)} key={item.id}><i>{index + 1}</i><span>{item.label}</span></button>)}</nav>
    </footer>
  </section>;
}

function PreviouslyIn({ events, characters, chapterMinimum, chapterMaximum, onOpenEvent }) {
  const [from, setFrom] = useState(Math.max(chapterMinimum, chapterMaximum - 8));
  const [to, setTo] = useState(chapterMaximum);
  const [characterId, setCharacterId] = useState('all');
  const [length, setLength] = useState(12);
  const selected = characterId === 'all' ? null : characters.find((character) => character.id === characterId);
  const selectedTerms = selected ? [selected.name, ...(selected.aliases || [])].map(normalize) : [];
  const recap = useMemo(() => {
    const start = Math.min(from, to);
    const end = Math.max(from, to);
    const candidates = events.filter((event) => event.chapter >= start && event.chapter <= end
      && (!selectedTerms.length || event.people.some((person) => selectedTerms.some((term) => normalize(person).includes(term) || term.includes(normalize(person))))));
    return [...candidates]
      .sort((left, right) => ({ major: 0, standard: 1, complete: 2 })[left.importance] - ({ major: 0, standard: 1, complete: 2 })[right.importance] || right.archiveIndex - left.archiveIndex)
      .slice(0, length)
      .sort((left, right) => left.archiveIndex - right.archiveIndex);
  }, [events, from, length, selectedTerms, to]);
  return <section className="sta-previously">
    <AtlasSectionHeader eyebrow="Recap builder" title="Previously in the Succession Contest…" detail="Choose the range, a character lens, and how much time you have. Every item opens its complete record." />
    <div className="sta-previously__controls">
      <label><span>From</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={from} onChange={(event) => setFrom(Number(event.target.value) || chapterMinimum)} /></label>
      <label><span>To</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={to} onChange={(event) => setTo(Number(event.target.value) || chapterMaximum)} /></label>
      <label><span>Character lens</span><select value={characterId} onChange={(event) => setCharacterId(event.target.value)}><option value="all">All characters</option>{characters.map((character) => <option value={character.id} key={character.id}>{character.name}</option>)}</select></label>
      <label><span>Length</span><select value={length} onChange={(event) => setLength(Number(event.target.value))}><option value="5">5 turns</option><option value="12">12 turns</option><option value="25">25 turns</option></select></label>
    </div>
    <ol>{recap.map((event, index) => <li key={event.id}><button type="button" onClick={() => onOpenEvent(event)}><i>{String(index + 1).padStart(2, '0')}</i><span>CH. {event.chapter} · {event.day ? `DAY ${event.day}` : 'PRE-VOYAGE'}</span><strong>{event.title}</strong><p>{event.detail}</p><small>{event.people.slice(0, 4).join(' · ') || event.location}</small><ArrowRight size={14} aria-hidden="true" /></button></li>)}</ol>
    {!recap.length && <p className="sta-empty">No events match this recap lens.</p>}
  </section>;
}

function OverviewView({ events, characters, chapterMinimum, chapterMaximum, storySnapshot, onOpenEvent }) {
  const laneRows = storySnapshot?.laneDossiers || storySnapshot?.lanes || [];
  const changed = events.filter((event) => event.chapter === chapterMaximum);
  return <div className="sta-view sta-view--overview">
    <PreviouslyIn events={events} characters={characters} chapterMinimum={chapterMinimum} chapterMaximum={chapterMaximum} onOpenEvent={onOpenEvent} />
    <section className="sta-briefing">
      <AtlasSectionHeader eyebrow={`Chapter ${chapterMaximum} briefing`} title="What is moving right now" detail="A chapter-bounded situation report from the canonical story graph." />
      <div className="sta-briefing__columns">
        <article><span>Active lanes</span><strong>{laneRows.length}</strong><div>{laneRows.map((lane) => <p key={lane.profile?.id || lane.id}><b>{lane.profile?.name || lane.name || labelize(lane.id)}</b><small>{lane.profile?.question || lane.question || lane.summary || 'Active at this boundary.'}</small></p>)}</div></article>
        <article><span>Open threads</span><strong>{storySnapshot?.openThreads?.length || 0}</strong><div>{storySnapshot?.openThreads?.slice(0, 8).map((thread) => <p key={thread.profile?.id || thread.id}><b>{thread.profile?.name || thread.name}</b><small>{thread.profile?.question || thread.question}</small></p>)}</div></article>
        <article><span>Latest chronology</span><strong>{changed.length}</strong><div>{changed.slice(-8).map((event) => <button type="button" onClick={() => onOpenEvent(event)} key={event.id}><b>{event.title}</b><small>{event.time} · {event.location}</small></button>)}</div></article>
      </div>
    </section>
  </div>;
}

function ThreadBraid({ events, chapters, onSelectTrackChapter }) {
  const { cells, trackRows } = useMemo(() => {
    const map = new Map();
    const stats = new Map();
    for (const event of events) for (const track of event.tracks || []) {
      map.set(`${track}:${event.chapter}`, (map.get(`${track}:${event.chapter}`) || 0) + 1);
      const current = stats.get(track) || { count: 0, firstChapter: event.chapter };
      current.count += 1;
      current.firstChapter = Math.min(current.firstChapter, event.chapter);
      stats.set(track, current);
    }
    const rows = timelineTracks.filter((track) => track.id !== 'all').map((track) => {
      const linked = stats.get(track.id);
      return { ...track, count: linked?.count || 0, firstChapter: linked?.firstChapter || chapters[0] };
    }).filter((track) => track.count).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
    return { cells: map, trackRows: rows };
  }, [chapters, events]);
  const coreIds = new Set(['ritual', 'benjamin', 'kurapika', 'tserriednich', 'twins', 'halkenburg', 'nen', 'mafia', 'troupe', 'justice', 'expedition', 'ship', 'beyond']);
  const tracks = [...trackRows.filter((track) => coreIds.has(track.id)), ...trackRows.filter((track) => !coreIds.has(track.id))].slice(0, 28);
  const maximum = Math.max(1, ...cells.values());
  return <section className="sta-braid" aria-labelledby="sta-braid-title">
    <AtlasSectionHeader eyebrow="Thread braid" title="Every storyline across every chapter" detail="This is a DOM/CSS analytical field, not a decorative SVG. Select any occupied cell to isolate that thread at that chapter." />
    <div className="sta-braid__scroll">
      <div className="sta-braid__header"><strong id="sta-braid-title">Thread</strong><div>{chapters.map((chapter) => <span key={chapter}>{chapter % 5 === 0 ? chapter : '·'}</span>)}</div></div>
      {tracks.map((track) => <div className="sta-braid__row" key={track.id}><strong>{track.label}</strong><div>{chapters.map((chapter) => {
        const count = cells.get(`${track.id}:${chapter}`) || 0;
        return <button type="button" className={count ? 'has-events' : ''} style={{ '--cell-strength': count ? 0.26 + (count / maximum) * 0.74 : 0 }} disabled={!count} title={`${track.label} · Chapter ${chapter} · ${count} records`} aria-label={`${track.label}, Chapter ${chapter}, ${count} records`} onClick={() => onSelectTrackChapter(track.id, chapter)} key={chapter}><span>{count || ''}</span></button>;
      })}</div></div>)}
    </div>
    <details className="sta-track-index"><summary>Inspect the complete thread-label index ({trackRows.length})</summary><div>{trackRows.map((track) => <button type="button" onClick={() => onSelectTrackChapter(track.id, track.firstChapter)} key={track.id}><span>{track.label}</span><strong>{track.count}</strong><small>first linked Ch. {track.firstChapter}</small></button>)}</div></details>
  </section>;
}

function ThreadsView({ events, chapterMinimum, chapterMaximum, contextChapter, onSelectTrackChapter }) {
  const chapters = Array.from({ length: chapterMaximum - chapterMinimum + 1 }, (_, index) => chapterMinimum + index);
  const canonicalThreads = useMemo(() => getStoryThreadsAtChapter(contextChapter), [contextChapter]);
  return <div className="sta-view sta-view--threads">
    <ThreadBraid events={events} chapters={chapters} onSelectTrackChapter={onSelectTrackChapter} />
    <section className="sta-thread-ledger">
      <AtlasSectionHeader eyebrow="Canonical thread ledger" title={`${canonicalThreads.length} bounded questions and operations`} detail="Status, chapter range, evidence, people, events, abilities, locations, and sources remain linked." />
      <div>{canonicalThreads.map((thread) => <details key={thread.profile.id}><summary><span>{labelize(thread.status)}</span><strong>{thread.profile.name}</strong><small>{thread.profile.chapterRange?.start || chapterMinimum}–{thread.profile.chapterRange?.end || 'open'}</small></summary><div><p>{thread.profile.question}</p><dl><div><dt>Evidence</dt><dd>{labelize(thread.evidenceState)}</dd></div><div><dt>Entities</dt><dd>{thread.entities.length}</dd></div><div><dt>Events</dt><dd>{thread.events.length}</dd></div><div><dt>Abilities</dt><dd>{thread.abilities.length}</dd></div><div><dt>Locations</dt><dd>{thread.locations.length}</dd></div><div><dt>Sources</dt><dd>{thread.sources.length}</dd></div></dl></div></details>)}</div>
    </section>
  </div>;
}

function PrinceComparison({ princes, leftId, rightId, onLeft, onRight }) {
  const left = princes.find((row) => row.character.id === leftId) || princes[0];
  const right = princes.find((row) => row.character.id === rightId) || princes[1];
  const dimensions = [
    ['Life', labelize(left?.life), labelize(right?.life)],
    ['Body', labelize(left?.body), labelize(right?.body)],
    ['Identity', labelize(left?.identity), labelize(right?.identity)],
    ['Location', left?.locationId ? entityName(left.locationId) : 'Unresolved', right?.locationId ? entityName(right.locationId) : 'Unresolved'],
    ['Known Nen', left?.abilityIds.length, right?.abilityIds.length],
    ['Operations', left?.assignmentIds.length, right?.assignmentIds.length],
    ['Threat signals', left?.threatIds.length, right?.threatIds.length],
    ['Knowledge records', left?.knowledgeIds.length, right?.knowledgeIds.length],
    ['Story threads', left?.storyThreadIds.length, right?.storyThreadIds.length],
  ];
  return <section className="sta-politics">
    <AtlasSectionHeader eyebrow="Political comparison" title="Prince versus prince, without flattening state" detail="Compare body, identity, location, information, threats, resources, and operational reach at the selected chapter." />
    <div className="sta-politics__selectors"><select value={left?.character.id} onChange={(event) => onLeft(event.target.value)}>{princes.map((row) => <option value={row.character.id} key={row.character.id}>{row.order}. {row.character.name}</option>)}</select><span>VERSUS</span><select value={right?.character.id} onChange={(event) => onRight(event.target.value)}>{princes.map((row) => <option value={row.character.id} key={row.character.id}>{row.order}. {row.character.name}</option>)}</select></div>
    <table><thead><tr><th>Dimension</th><th>{left?.character.name}</th><th>{right?.character.name}</th></tr></thead><tbody>{dimensions.map(([label, leftValue, rightValue]) => <tr key={label}><th>{label}</th><td>{leftValue}</td><td>{rightValue}</td></tr>)}</tbody></table>
  </section>;
}

function PeopleView({ events, characters, princeBoard, contextChapter, activeCharacterId, onCharacterChange }) {
  const [query, setQuery] = useState('');
  const [leftPrince, setLeftPrince] = useState(princeBoard[0]?.character.id || '');
  const [rightPrince, setRightPrince] = useState(princeBoard[1]?.character.id || '');
  const selected = characters.find((character) => character.id === activeCharacterId) || null;
  const dossier = useMemo(() => selected ? getCharacterDossier(selected.id, contextChapter) : null, [contextChapter, selected]);
  const campaign = useMemo(() => selected ? getCharacterCampaignDossier(selected.id, contextChapter) : null, [contextChapter, selected]);
  const counts = useMemo(() => new Map(characters.map((character) => {
    const terms = [character.name, ...(character.aliases || [])].map(normalize);
    return [character.id, events.filter((event) => event.people.some((person) => terms.some((term) => normalize(person).includes(term) || term.includes(normalize(person))))).length];
  })), [characters, events]);
  const visible = characters.filter((character) => normalize(`${character.name} ${(character.aliases || []).join(' ')} ${(character.roles || []).join(' ')} ${character.summary || ''}`).includes(normalize(query)));
  return <div className="sta-view sta-view--people">
    <section className="sta-people">
      <AtlasSectionHeader eyebrow="Character lenses" title={`${characters.length} people, one chronology`} detail="Selecting a person filters the event archive while the wider voyage remains available in every other lens." action={activeCharacterId && <button type="button" onClick={() => onCharacterChange('')}>Clear character lens</button>} />
      <label className="sta-people__search"><Search size={15} aria-hidden="true" /><span className="sr-only">Search timeline characters</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, alias, role, affiliation…" /></label>
      <div className="sta-people__layout">
        <div className="sta-people__index">{visible.map((character) => <button type="button" className={activeCharacterId === character.id ? 'is-active' : ''} onClick={() => onCharacterChange(character.id)} key={character.id}><EntityPortrait entity={character} compact /><span><strong>{character.name}</strong><small>{(character.roles || []).slice(0, 2).map(labelize).join(' · ') || 'Character'} · {counts.get(character.id)} timeline records</small></span></button>)}</div>
        <aside className="sta-person-dossier">
          {selected ? <><header><EntityPortrait entity={selected} /><div><span>CHAPTER {contextChapter} DOSSIER</span><h3>{selected.name}</h3><p>{dossier?.state?.operationalState || selected.summary}</p></div></header><dl><div><dt>Life</dt><dd>{labelize(dossier?.state?.life || selected.status?.life)}</dd></div><div><dt>Body</dt><dd>{labelize(dossier?.state?.body)}</dd></div><div><dt>Identity</dt><dd>{labelize(dossier?.state?.identity)}</dd></div><div><dt>Consciousness</dt><dd>{labelize(dossier?.state?.consciousness)}</dd></div><div><dt>Location</dt><dd>{dossier?.location?.name || 'Unresolved'}</dd></div><div><dt>Abilities</dt><dd>{dossier?.abilities?.length || 0}</dd></div><div><dt>Operations</dt><dd>{campaign?.assignmentIds?.length || 0}</dd></div><div><dt>Threats</dt><dd>{campaign?.hostileRelationshipIds?.length || 0}</dd></div></dl><section><span>Current objectives</span>{campaign?.currentObjectives?.map((objective) => <p key={objective}>{objective}</p>) || <p>No bounded objective published.</p>}</section></> : <div className="sta-person-dossier__empty"><UsersRound size={28} aria-hidden="true" /><h3>Select a character.</h3><p>Their portrait, state, location, objectives, Nen, operations, threats, and matching chronology will appear here.</p></div>}
        </aside>
      </div>
    </section>
    <section className="sta-princes">
      <AtlasSectionHeader eyebrow="Royal status board" title="All fourteen princes, at once" detail="Life, body, identity, location, Guardian Spirit Beast, Nen, threats, and active story reach." />
      <div>{princeBoard.map((row) => {
        const entity = getEntityById(row.character.id);
        return <button type="button" className={`sta-prince is-${statusTone(row.life)}`} onClick={() => onCharacterChange(row.character.id)} key={row.character.id}><i>{row.order}</i><EntityPortrait entity={entity} compact /><span><strong>{row.character.name}</strong><small>{labelize(row.life)} · {row.locationId ? entityName(row.locationId) : 'Location unresolved'}</small></span><dl><div><dt>Nen</dt><dd>{row.abilityIds.length}</dd></div><div><dt>Ops</dt><dd>{row.assignmentIds.length}</dd></div><div><dt>Threat</dt><dd>{row.threatIds.length}</dd></div><div><dt>Threads</dt><dd>{row.storyThreadIds.length}</dd></div></dl></button>;
      })}</div>
    </section>
    <PrinceComparison princes={princeBoard} leftId={leftPrince} rightId={rightPrince} onLeft={setLeftPrince} onRight={setRightPrince} />
  </div>;
}

function ShipView({ events, contextChapter, chapterMinimum, chapterMaximum, onSelectLocation, onOpenLocation, onOpenEvent }) {
  const [selected, setSelected] = useState('');
  const [from, setFrom] = useState(Math.max(chapterMinimum, contextChapter - 10));
  const [to, setTo] = useState(contextChapter);
  const locations = useMemo(() => {
    const map = new Map();
    for (const event of events) if (event.location) {
      const current = map.get(event.location) || [];
      current.push(event);
      map.set(event.location, current);
    }
    return [...map.entries()].map(([name, records]) => ({ name, records })).sort((left, right) => right.records.length - left.records.length || left.name.localeCompare(right.name));
  }, [events]);
  const active = locations.find((row) => row.name === selected) || locations[0];
  const comparison = useMemo(() => getBlackWhaleSnapshotComparison(Math.min(from, to), Math.max(from, to)), [from, to]);
  const infrastructure = Object.entries(comparison.infrastructure?.systems || {});
  const choose = (name) => { setSelected(name); onSelectLocation(name); };
  return <div className="sta-view sta-view--ship">
    <section className="sta-ship-index">
      <AtlasSectionHeader eyebrow="Black Whale location sync" title={`${locations.length} event locations`} detail="Location chronology and the complete ship atlas share the same selection." action={<button type="button" onClick={() => onOpenLocation?.(active?.name || '')}><ShipWheel size={14} aria-hidden="true" /> Open Black Whale atlas</button>} />
      <div className="sta-ship-index__layout"><nav aria-label="Timeline locations">{locations.map((row) => <button type="button" className={active?.name === row.name ? 'is-active' : ''} onClick={() => choose(row.name)} key={row.name}><span>{row.name}</span><strong>{row.records.length}</strong></button>)}</nav><section><header><span>SELECTED LOCATION</span><h3>{active?.name}</h3><p>{active?.records.length || 0} records across {new Set(active?.records.map((event) => event.chapter)).size || 0} chapters.</p></header><ol>{active?.records.map((event) => <li key={event.id}><button type="button" onClick={() => onOpenEvent(event)}><span>CH. {event.chapter}</span><strong>{event.title}</strong><small>{event.time}</small><ArrowRight size={13} aria-hidden="true" /></button></li>)}</ol></section></div>
    </section>
    <section className="sta-ship-compare">
      <AtlasSectionHeader eyebrow="Ship-state comparison" title={`What changed: Chapter ${Math.min(from, to)} → ${Math.max(from, to)}`} detail="Location and infrastructure state are compared through the canonical Black Whale graph." />
      <div className="sta-ship-compare__controls"><label><span>From</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={from} onChange={(event) => setFrom(Number(event.target.value) || chapterMinimum)} /></label><label><span>To</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={to} onChange={(event) => setTo(Number(event.target.value) || chapterMaximum)} /></label></div>
      <dl><div><dt>Changed locations</dt><dd>{comparison.summary.changedLocations}</dd></div><div><dt>Movements</dt><dd>{comparison.summary.movements}</dd></div><div><dt>Active locations</dt><dd>{comparison.summary.activeLocations}</dd></div><div><dt>Infrastructure systems</dt><dd>{comparison.summary.systems}</dd></div></dl>
      <div className="sta-ship-systems">{infrastructure.map(([name, records]) => <article key={name}><span>{labelize(name)}</span><strong>{recordCount(records?.records || records)}</strong><small>linked records</small></article>)}</div>
      <details><summary>Inspect all {comparison.locationChanges.length} location changes</summary><div>{comparison.locationChanges.map((change, index) => <p key={`${change.locationId || change.entity?.id || index}`}><strong>{change.entity?.name || entityName(change.locationId)}</strong><span>{labelize(change.status || change.changeType || 'changed')}</span></p>)}</div></details>
    </section>
  </div>;
}

function KnowledgePanel({ chapter }) {
  const knowledge = useMemo(() => getKnowledgeWarfareMatrix(chapter), [chapter]);
  const perspective = useMemo(() => getReaderVsInUniverseKnowledge(chapter), [chapter]);
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Knowledge warfare" title="Truth is not evenly distributed" detail="Reader knowledge, in-universe belief, secrecy, misinformation, acquisition, and public state remain separate." /><div className="sta-knowledge-grid">{knowledge.map((row) => <details key={row.id}><summary><span>{labelize(row.secrecy)}</span><strong>{row.name}</strong><small>{labelize(row.state)}</small></summary><dl><div><dt>Subjects</dt><dd>{row.subjectLabels.join(' · ') || 'Not assigned'}</dd></div><div><dt>Known by</dt><dd>{row.knowerLabels.join(' · ') || 'Nobody published'}</dd></div><div><dt>Hidden / misinformed</dt><dd>{row.misinformedLabels.join(' · ') || 'None published'}</dd></div><div><dt>Acquisition</dt><dd>{row.acquisition || 'Not specified'}</dd></div></dl></details>)}</div><h4 className="sta-subhead">Reader versus in-universe knowledge</h4><table><thead><tr><th>Claim</th><th>Reader state</th><th>In-universe state</th><th>Known by</th><th>Hidden / wrong</th></tr></thead><tbody>{perspective.map((row) => <tr key={row.id}><th>{row.name}</th><td>{labelize(row.readerState)}</td><td>{labelize(row.inUniverseState)}</td><td>{joinNames(row.knownBy)}</td><td>{joinNames(row.hiddenFromOrMisinformed)}</td></tr>)}</tbody></table></section>;
}

function OperationsPanel({ chapter }) {
  const kurapika = useMemo(() => getKurapikaMissionLedger(chapter), [chapter]);
  const mafia = useMemo(() => getMafiaWarCommandCenter(chapter), [chapter]);
  const troupe = useMemo(() => getTroupeHisokaTracker(chapter), [chapter]);
  const martial = useMemo(() => getMartialLawCommandBoard(chapter), [chapter]);
  const orders = useMemo(() => getOrdersSurveillanceCustodyLedger(chapter), [chapter]);
  const deception = useMemo(() => getDeceptionLedger(chapter), [chapter]);
  const factions = useMemo(() => getFactionResourceBoard(chapter), [chapter]);
  const alliances = useMemo(() => getAllianceBetrayalLedger(chapter), [chapter]);
  const leverage = useMemo(() => [...getLeverageBoard(chapter)].sort((left, right) => (right.nen + right.operational + right.information + right.relational) - (left.nen + left.operational + left.information + left.relational)), [chapter]);
  const life = useMemo(() => getLifeStatusLedger(chapter), [chapter]);
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Operations tracker" title="Missions, command, surveillance, custody, factions" detail="Operational state is derived from assignments, relationships, events, institutions, and chapter-bounded personnel." /><div className="sta-operation-grid"><article><span>KURAPIKA MISSION LEDGER</span><strong>{kurapika.missions.filter((mission) => mission.active).length} active</strong>{kurapika.missions.map((mission) => <p className={mission.active ? 'is-active' : ''} key={mission.id}><Check size={12} aria-hidden="true" /> {labelize(mission.id.replace('kurapika-mission:', ''))}</p>)}</article>{mafia.map((row) => <article key={row.organization.id}><span>MAFIA COMMAND</span><strong>{row.organization.name}</strong><p>{row.memberIds.length} members</p><p>{row.abilityIds.length} known abilities</p><p>{row.eventIds.length} bounded events</p></article>)}<article><span>TROUPE / HISOKA</span><strong>{troupe.troupe?.memberIds.length || 0} Troupe records</strong><p>Hisoka: {troupe.hisokaLocationId ? entityName(troupe.hisokaLocationId) : 'location unresolved'}</p><p>{troupe.threadIds.length} active threads</p></article><article><span>MARTIAL LAW COMMAND</span><strong>{martial.institutions.map((item) => item.name).join(' · ')}</strong><p>{martial.protocolIds.length} protocols</p><p>{martial.assignmentIds.length} assignments</p><p>{martial.relationshipIds.length} command relationships</p></article><article><span>ORDERS / SURVEILLANCE / CUSTODY</span><strong>{orders.assignmentIds.length + orders.relationshipIds.length} active edges</strong><p>{orders.assignmentIds.length} assignments</p><p>{orders.relationshipIds.length} relationships</p></article><article><span>DECEPTION LEDGER</span><strong>{deception.length} active edges</strong>{deception.slice(0, 6).map((row) => <p key={row.id}>{row.source?.name || entityName(row.source)} → {row.target?.name || entityName(row.target)}</p>)}</article></div><h4 className="sta-subhead">Faction resources</h4><table><thead><tr><th>Faction</th><th>Leaders</th><th>Members</th><th>Nen</th><th>Events</th></tr></thead><tbody>{factions.map((row) => <tr key={row.organization.id}><th>{row.organization.name}</th><td>{joinNames(row.leaderIds)}</td><td>{row.memberIds.length}</td><td>{row.abilityIds.length}</td><td>{row.eventIds.length}</td></tr>)}</tbody></table><h4 className="sta-subhead">Leverage board</h4><table><thead><tr><th>Character</th><th>Nen</th><th>Operations</th><th>Relationships</th><th>Information</th><th>Authority</th></tr></thead><tbody>{leverage.map((row) => <tr key={row.character.id}><th>{row.character.name}</th><td>{row.nen}</td><td>{row.operational}</td><td>{row.relational}</td><td>{row.information}</td><td>{labelize(row.authority)}</td></tr>)}</tbody></table><details className="sta-register"><summary>Inspect alliance / betrayal ledger ({alliances.length})</summary><table><thead><tr><th>Source</th><th>Target</th><th>Sentiment</th><th>Subtype</th><th>Status</th></tr></thead><tbody>{alliances.map((row) => <tr key={row.id}><th>{row.source?.name || entityName(row.source)}</th><td>{row.target?.name || entityName(row.target)}</td><td>{labelize(row.sentiment)}</td><td>{labelize(row.subtype)}</td><td>{labelize(row.status)}</td></tr>)}</tbody></table></details><details className="sta-register"><summary>Inspect complete life / body / identity registry ({life.length})</summary><table><thead><tr><th>Character</th><th>Life</th><th>Body</th><th>Identity</th><th>Consciousness</th><th>Latest</th></tr></thead><tbody>{life.map((row) => <tr key={row.character.id}><th>{row.character.name}</th><td>{labelize(row.life)}</td><td>{labelize(row.body)}</td><td>{labelize(row.identity)}</td><td>{labelize(row.consciousness)}</td><td>{row.latestAppearance ? `Ch. ${row.latestAppearance}` : '—'}</td></tr>)}</tbody></table></details></section>;
}

function DeadlinesPanel({ chapter }) {
  const activeGraph = useMemo(() => getActiveCountdowns(chapter), [chapter]);
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Deadline and countdown ledger" title={`${timelineDeadlines.length} explicit clocks`} detail="Completed windows remain visible beside active, projected, and interpretive deadlines; none are silently dropped." /><div className="sta-deadlines">{timelineDeadlines.map((row) => <article className={`is-${statusTone(row.status)}`} key={row.id}><header><span>CH. {row.chapter}</span><strong>{row.timing}</strong></header><h4>{row.label}</h4><p>{row.detail}</p><footer><span>{labelize(row.status)}</span><small>{row.evidence}</small></footer></article>)}</div><aside className="sta-ledger-callout"><Clock3 size={18} aria-hidden="true" /><div><strong>Canonical graph countdown signals</strong><p>{activeGraph.threadIds.length} active story-thread clocks · {activeGraph.mysteryCaseIds.length} mystery-linked clocks</p></div></aside></section>;
}

function NenPanel({ chapter }) {
  const training = useMemo(() => getNenTrainingTracker(chapter), [chapter]);
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Nen development history" title="Reveals, training, systems, curses, transfer" detail="Discovery status and unresolved mechanics stay attached to the chronology instead of becoming trivia cards." /><dl className="sta-intel-stats"><div><dt>Developments</dt><dd>{timelineNenDevelopments.length}</dd></div><div><dt>Training events</dt><dd>{training.eventIds.length}</dd></div><div><dt>Tracked participants</dt><dd>{training.participants.length}</dd></div></dl><ol className="sta-nen-history">{timelineNenDevelopments.map((row) => <li key={`${row.chapter}-${row.title}`}><i>{row.chapter}</i><div><span>{row.kind} · {row.status}</span><h4>{row.title}</h4><p>{row.detail}</p></div></li>)}</ol><h4 className="sta-subhead">Training participants</h4><div className="sta-entity-ribbon">{training.participants.map((entity) => <span key={entity.id}>{entity.name}</span>)}</div></section>;
}

function MysteriesPanel({ chapter }) {
  const unresolved = useMemo(() => getUnresolvedLedgers(chapter), [chapter]);
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Mystery ledger" title="Open questions and resolved findings" detail="Each question keeps its evidence, status, chapter boundary, and source." /><dl className="sta-intel-stats"><div><dt>Open questions</dt><dd>{timelineQuestionLedger.open.length}</dd></div><div><dt>Resolved</dt><dd>{timelineQuestionLedger.resolved.length}</dd></div><div><dt>Identity cases</dt><dd>{unresolved.identities.length}</dd></div><div><dt>Ability cases</dt><dd>{unresolved.abilities.length}</dd></div><div><dt>Location cases</dt><dd>{unresolved.locations.length}</dd></div></dl><div className="sta-mystery-ledger"><section><h4>OPEN</h4>{timelineQuestionLedger.open.map((row, index) => <details key={`${row.chapter}-${row.question}-${index}`}><summary><span>CH. {row.chapter}</span><strong>{row.question}</strong></summary><p>{row.evidence}</p><a href={row.source} target="_blank" rel="noreferrer">Source note</a></details>)}</section><section><h4>RESOLVED</h4>{timelineQuestionLedger.resolved.map((row, index) => <details key={`${row.chapter}-${row.question}-${index}`}><summary><span>CH. {row.chapter}</span><strong>{row.question}</strong></summary><p>{row.answer}</p><a href={row.source} target="_blank" rel="noreferrer">Source note</a></details>)}</section></div></section>;
}

function DecisionsPanel({ events, onOpenEvent }) {
  const decisions = events.filter((event) => event.eventType === 'decision');
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Decision tracker" title={`${decisions.length} choices, orders, plans, refusals, and declarations`} detail="The tracker is derived from the full chronology. Select any decision to read its complete evidence and consequence record." /><ol className="sta-decision-ledger">{decisions.map((event) => <li key={event.id}><button type="button" onClick={() => onOpenEvent(event)}><span>CH. {event.chapter} · {event.time}</span><strong>{event.title}</strong><p>{event.detail}</p><small>{event.people.join(' · ') || event.location}</small><ArrowRight size={13} aria-hidden="true" /></button></li>)}</ol></section>;
}

function CausalityPanel({ chapter }) {
  const chains = useMemo(() => getConsequenceChains(chapter), [chapter]);
  const nodes = new Map(chains.nodes.map((node) => [node.id, node]));
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Causal trails" title={`${chains.nodes.length} events · ${chains.links.length} consequence links`} detail="Cause, transition, consequence, certainty, state changes, and open questions remain explicit." /><div className="sta-causal-links">{chains.links.map((link, index) => {
    const source = nodes.get(link.sourceEventId);
    const target = nodes.get(link.targetEventId);
    return <article key={`${link.sourceEventId}-${link.targetEventId}-${index}`}><div><span>CAUSE</span><strong>{source?.name || entityName(link.sourceEventId)}</strong><small>{source?.summary}</small></div><ArrowRight size={18} aria-hidden="true" /><div><span>{labelize(link.relation)} · {labelize(link.certainty)}</span><strong>{target?.name || entityName(link.targetEventId)}</strong><small>{link.summary || target?.summary}</small></div></article>;
  })}</div><details className="sta-causal-nodes"><summary>Inspect all {chains.nodes.length} causal event nodes</summary><div>{chains.nodes.map((node) => <article key={node.id}><span>CH. {node.chapterRange?.start || '?'}–{node.chapterRange?.end || node.chapterRange?.start || '?'}</span><h4>{node.name}</h4><p>{node.summary}</p><small>{node.stateChanges?.join(' · ') || 'No separate state change published.'}</small></article>)}</div></details></section>;
}

function EvidencePanel({ events }) {
  const groups = Object.entries(events.reduce((map, event) => ({ ...map, [event.evidence]: (map[event.evidence] || 0) + 1 }), {})).sort((left, right) => right[1] - left[1]);
  const unresolved = events.filter((event) => /unresolved|inference|hypothesis|statement|question|plan/i.test(event.evidence));
  return <section className="sta-intel-panel"><AtlasSectionHeader eyebrow="Evidence and uncertainty" title="What happened is separate from what it means" detail="Timing confidence and claim confidence remain visible at event level; uncertainty is treated as information, not a formatting defect." /><dl className="sta-evidence-totals">{groups.map(([name, count]) => <div key={name}><dt>{name}</dt><dd>{count}</dd></div>)}</dl><div className="sta-evidence-ledger">{unresolved.map((event) => <article key={event.id}><span>CH. {event.chapter} · {event.timing}</span><strong>{event.title}</strong><p>{event.detail}</p><small>{event.evidence}</small></article>)}</div></section>;
}

function IntelligenceView({ events, contextChapter, onOpenEvent, panel, onPanelChange }) {
  return <div className="sta-view sta-view--intelligence"><nav className="sta-intel-nav" aria-label="Timeline intelligence lenses">{intelligenceViews.map(([id, label]) => <button type="button" className={panel === id ? 'is-active' : ''} aria-pressed={panel === id} onClick={() => onPanelChange(id)} key={id}>{label}</button>)}</nav>{panel === 'knowledge' && <KnowledgePanel chapter={contextChapter} />}{panel === 'operations' && <OperationsPanel chapter={contextChapter} />}{panel === 'deadlines' && <DeadlinesPanel chapter={contextChapter} />}{panel === 'nen' && <NenPanel chapter={contextChapter} />}{panel === 'mysteries' && <MysteriesPanel chapter={contextChapter} />}{panel === 'decisions' && <DecisionsPanel events={events} onOpenEvent={onOpenEvent} />}{panel === 'causality' && <CausalityPanel chapter={contextChapter} />}{panel === 'evidence' && <EvidencePanel events={events} />}</div>;
}

function MemoryItem({ item, onOpen }) {
  return <button type="button" onClick={() => onOpen(item)}><span>{item.context || item.route}</span><strong>{item.label}</strong><small>{item.entityId}</small><ArrowRight size={12} aria-hidden="true" /></button>;
}

function ResearchView({ chapterMinimum, chapterMaximum, memory, researchActions, notes, onOpenMemoryItem, onShare }) {
  const [from, setFrom] = useState(Math.max(chapterMinimum, chapterMaximum - 1));
  const [to, setTo] = useState(chapterMaximum);
  const [diffLimit, setDiffLimit] = useState(80);
  const [collectionName, setCollectionName] = useState('');
  const diff = useMemo(() => getChapterStateDiff(Math.min(from, to), Math.max(from, to)), [from, to]);
  const changed = diff.records.filter((row) => row.status !== 'unchanged');
  return <div className="sta-view sta-view--research">
    <section className="sta-diff">
      <AtlasSectionHeader eyebrow="Chapter state diff" title={`Chapter ${Math.min(from, to)} → ${Math.max(from, to)}`} detail="Added, removed, and changed canonical records stay inspectable; unchanged records remain counted in the exact summary." action={<button type="button" onClick={onShare}><Copy size={14} aria-hidden="true" /> Copy this research view</button>} />
      <div className="sta-diff__controls"><label><span>From</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={from} onChange={(event) => { setFrom(Number(event.target.value) || chapterMinimum); setDiffLimit(80); }} /></label><label><span>To</span><input type="number" min={chapterMinimum} max={chapterMaximum} value={to} onChange={(event) => { setTo(Number(event.target.value) || chapterMaximum); setDiffLimit(80); }} /></label></div>
      <dl><div><dt>Total compared</dt><dd>{diff.summary.total}</dd></div><div><dt>Added</dt><dd>{diff.summary.added}</dd></div><div><dt>Changed</dt><dd>{diff.summary.changed}</dd></div><div><dt>Removed</dt><dd>{diff.summary.removed}</dd></div><div><dt>Unchanged</dt><dd>{diff.summary.unchanged}</dd></div></dl>
      <div className="sta-diff__records">{changed.slice(0, diffLimit).map((row, index) => <details key={`${row.entity?.id || index}-${row.status}`}><summary><span>{labelize(row.entity?.entityType)} · {labelize(row.status)}</span><strong>{row.entity?.name || row.entity?.id || 'Canonical record'}</strong><small>{recordCount(row.deltas)} field deltas</small></summary><pre>{JSON.stringify(row.deltas || { before: row.before, after: row.after }, null, 2)}</pre></details>)}</div>
      {diffLimit < changed.length && <button type="button" className="sta-more" onClick={() => setDiffLimit((current) => Math.min(changed.length, current + 160))}>Show 160 more of {changed.length}</button>}
    </section>
    <section className="sta-memory">
      <AtlasSectionHeader eyebrow="Research memory" title="Bookmarks, comparisons, collections, and notes" detail="These are stored in this browser and reopen the exact timeline state." />
      <div className="sta-memory__columns"><article><header><Bookmark size={15} aria-hidden="true" /><span>BOOKMARKS</span><strong>{memory.bookmarks.length}</strong></header><div>{memory.bookmarks.map((item) => <MemoryItem item={item} onOpen={onOpenMemoryItem} key={itemKey(item)} />)}</div>{!memory.bookmarks.length && <p>Bookmark an event from its complete record.</p>}</article><article><header><Layers3 size={15} aria-hidden="true" /><span>COMPARE TRAY</span><strong>{memory.compare.length} / 4</strong></header><div>{memory.compare.map((item) => <MemoryItem item={item} onOpen={onOpenMemoryItem} key={itemKey(item)} />)}</div>{!!memory.compare.length && <button type="button" className="sta-memory__clear" onClick={researchActions.clearCompare}>Clear compare tray</button>}</article><article><header><NotebookPen size={15} aria-hidden="true" /><span>EVENT NOTES</span><strong>{Object.keys(notes).length}</strong></header><div>{Object.entries(notes).map(([eventId, note]) => <button type="button" onClick={() => onOpenMemoryItem({ entityId: eventId, params: { event: eventId } })} key={eventId}><strong>{eventId}</strong><small>{note}</small></button>)}</div>{!Object.keys(notes).length && <p>Open an event and write a private research note.</p>}</article></div>
      <section className="sta-collections"><header><div><span>COLLECTIONS / WATCHLISTS</span><strong>{memory.watchlists.length} / 12</strong></div><form onSubmit={(event) => { event.preventDefault(); if (collectionName.trim()) { researchActions.createCollection(collectionName); setCollectionName(''); } }}><input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="New collection name" maxLength="120" /><button type="submit">Create</button></form></header><div>{memory.watchlists.map((list) => <article key={list.id}><header><span>{labelize(list.status)}</span><strong>{list.name}</strong><small>{list.items.length} items</small></header><textarea value={list.note} onChange={(event) => researchActions.updateCollectionNote(list.id, event.target.value)} maxLength="4000" placeholder="Collection note, working theory, or next question…" /><div>{list.items.map((item) => <MemoryItem item={item} onOpen={onOpenMemoryItem} key={itemKey(item)} />)}</div></article>)}</div></section>
    </section>
  </div>;
}

export default function SuccessionTimelineAtlas({
  events,
  chapterMinimum,
  chapterMaximum,
  contextChapter,
  onContextChapterChange,
  activeDay,
  onSelectDay,
  depth,
  onDepthChange,
  activeView,
  onViewChange,
  activeIntelligenceView,
  onIntelligenceViewChange,
  activeCharacterId,
  onCharacterChange,
  onSelectTrackChapter,
  onSelectLocation,
  onOpenLocation,
  onOpenEvent,
  onShare,
  memory,
  notes,
  researchActions,
  onOpenMemoryItem,
}) {
  const chapter = Math.max(chapterMinimum, Math.min(contextChapter, chapterMaximum));
  const characters = useMemo(() => getCharactersWithStateProfiles(), []);
  const princeBoard = useMemo(() => getPrinceCampaignBoard(chapter), [chapter]);
  const storySnapshot = useMemo(() => getStorySnapshotAtChapter(chapter), [chapter]);
  const visibleDeadlines = timelineDeadlines.filter((record) => record.chapter <= chapter);
  const chapters = useMemo(() => Array.from({ length: chapterMaximum - chapterMinimum + 1 }, (_, index) => {
    const chapterNumber = chapterMinimum + index;
    const records = events.filter((event) => event.chapter === chapterNumber);
    return { chapter: chapterNumber, count: records.length, major: records.some((event) => event.importance === 'major'), types: new Set(records.map((event) => event.eventType)) };
  }), [chapterMaximum, chapterMinimum, events]);
  const dayRows = useMemo(() => {
    const grouped = new Map();
    for (const event of events) {
      const key = event.day || null;
      const current = grouped.get(key) || [];
      current.push(event);
      grouped.set(key, current);
    }
    return [...grouped.entries()].map(([day, records]) => ({ day, count: records.length, chapterLabel: day ? `Ch. ${Math.min(...records.map((event) => event.chapter))}–${Math.max(...records.map((event) => event.chapter))}` : 'Ch. 340–358' })).sort((left, right) => (left.day || 0) - (right.day || 0));
  }, [events]);
  const currentDay = [...events].reverse().find((event) => event.chapter <= chapter)?.day || null;
  return <section className="sta-atlas" aria-label="Succession Timeline Atlas">
    <VoyageState chapter={chapter} day={currentDay} princeBoard={princeBoard} storySnapshot={storySnapshot} deadlines={visibleDeadlines} mysteryCount={timelineQuestionLedger.open.filter((item) => item.chapter <= chapter).length} eventCount={events.length} depth={depth} onDepthChange={onDepthChange} onShare={onShare} />
    <ChapterDensity chapters={chapters} chapterMaximum={chapterMaximum} onSelectChapter={(next) => { onContextChapterChange(next); onSelectDay('all'); }} />
    <DayNavigator dayRows={dayRows} activeDay={activeDay} onSelectDay={onSelectDay} />
    <nav className="sta-view-nav" aria-label="Timeline atlas views">{views.map(([id, label, Icon]) => <button type="button" className={activeView === id ? 'is-active' : ''} aria-current={activeView === id ? 'page' : undefined} onClick={() => onViewChange(id)} key={id}><Icon size={15} aria-hidden="true" /><span>{label}</span></button>)}</nav>
    <div className="sta-view-stage">
      {activeView === 'overview' && <OverviewView events={events} characters={characters} chapterMinimum={chapterMinimum} chapterMaximum={chapter} storySnapshot={storySnapshot} onOpenEvent={onOpenEvent} />}
      {activeView === 'threads' && <ThreadsView events={events} chapterMinimum={chapterMinimum} chapterMaximum={chapterMaximum} contextChapter={chapter} onSelectTrackChapter={onSelectTrackChapter} />}
      {activeView === 'people' && <PeopleView events={events} characters={characters} princeBoard={princeBoard} contextChapter={chapter} activeCharacterId={activeCharacterId} onCharacterChange={onCharacterChange} />}
      {activeView === 'ship' && <ShipView events={events} contextChapter={chapter} chapterMinimum={chapterMinimum} chapterMaximum={chapterMaximum} onSelectLocation={onSelectLocation} onOpenLocation={onOpenLocation} onOpenEvent={onOpenEvent} />}
      {activeView === 'intelligence' && <IntelligenceView events={events} contextChapter={chapter} onOpenEvent={onOpenEvent} panel={activeIntelligenceView} onPanelChange={onIntelligenceViewChange} />}
      {activeView === 'research' && <ResearchView chapterMinimum={chapterMinimum} chapterMaximum={chapterMaximum} memory={memory} researchActions={researchActions} notes={notes} onOpenMemoryItem={onOpenMemoryItem} onShare={onShare} />}
    </div>
  </section>;
}
