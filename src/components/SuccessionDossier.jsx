import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import {
  beastRules, bodyStateLedger, contestRules, dossierSources, exceptionalStatuses, expeditionLayer, guardianBeasts,
  guardAssignmentGroups, justiceMilitaryLedger, mafiaDossiers, mafiaMemberLedger, nenLessonPhases, princeDossiers,
  shipRouteLayers, successionAbilities, successionChapterResearch, successionEvidence, successionFactions,
  successionMysteries, successionNavigation, successionObjects, successionOperations, successionPeriods,
  successionRelationships, troupeHisokaTracker,
} from '../data/successionDossier';
import {
  crossLinkIndex, institutionLedger, legalProcedureLedger, personnelTransitions, queenHouseholdLedger, roomAssignmentLedger,
  voyageOperations, wobleCoreTimeline,
} from '../data/successionArchive';
import { deathLedger } from '../data/successionStatus';
import HorizontalScrollHint from './HorizontalScrollHint';
import SafeImage from './SafeImage';
import { characterMedia, characterPortrait } from '../data/entityRegistry';

const tabs = [
  ['overview', 'Overview', 'Start'], ['core', 'Woble thread', 'Start'], ['chapters', 'Chapter ledger', 'Start'],
  ['royal', 'Princes & queens', 'Royal system'], ['assignments', 'Room assignments', 'Royal system'], ['guards', 'Guards & servants', 'Royal system'], ['beasts', 'Spirit Beasts', 'Royal system'], ['rules', 'Contest rules', 'Royal system'],
  ['abilities', 'Nen abilities', 'Nen & evidence'], ['objects', 'Objects & evidence', 'Nen & evidence'], ['relations', 'Relationships', 'Nen & evidence'],
  ['institutions', 'Institutions', 'Power blocs'], ['factions', 'Factions', 'Power blocs'], ['mafia', 'Mafia', 'Power blocs'], ['troupe', 'Troupe / Hisoka', 'Power blocs'], ['justice', 'Justice / military', 'Power blocs'], ['expedition', 'Expedition', 'Power blocs'],
  ['operations', 'Operations', 'Events & status'], ['status', 'Deaths & states', 'Events & status'], ['routes', 'Ship routes', 'Events & status'],
  ['mysteries', 'Mysteries', 'Research'], ['links', 'Cross-links', 'Research'],
];
const tabGroups = [...new Set(tabs.map(([, , group]) => group))];

const portraitFor = (name) => characterPortrait(name);
const mediaFor = (name) => characterMedia(name);
const focusIdFor = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const firstChapterFor = (value) => Number(String(value || '').match(/\d{3}/)?.[0] || 0);
const relationshipGroupFor = (type) => {
  if (/kinship|parent|twin|blood/i.test(type)) return 'Kinship';
  if (/alliance|cooperation|treaty/i.test(type)) return 'Alliance';
  if (/command|inheritance|collective/i.test(type)) return 'Command';
  if (/hunt|target|authority/i.test(type)) return 'Conflict and authority';
  return 'Duty and contract';
};

const beastForOrder = (order) => guardianBeasts.find((record) => Number(record.order) === Number(order));

function PortraitOrInitial({ name, className = '' }) {
  const portrait = portraitFor(name);
  return <span className={`succession-person-orb${className ? ` ${className}` : ''}`}>{portrait ? <SafeImage src={portrait} media={mediaFor(name)} alt={`${name} Hunterpedia portrait`} /> : <i aria-hidden="true">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('')}</i>}</span>;
}

function PrinceGuardOrbit({ prince }) {
  const people = prince.team.slice(0, 8);
  return <section className="prince-guard-orbit" aria-label={`${prince.short} core guard and ally circle`}>
    <header><span>Household lens</span><h4>Guards, allies, and embedded pressure</h4><p>The circle shows people closest to this prince’s current strategy. It is a reading aid, not a claim that every person has equal loyalty or access.</p></header>
    <div className="prince-guard-orbit__field">
      <div className="prince-guard-orbit__center"><PortraitOrInitial name={prince.name} /><strong>{prince.short}</strong><small>Room {prince.room.split(' / ')[0]}</small></div>
      {people.map((name, index) => {
        const angle = ((360 / people.length) * index - 90) * (Math.PI / 180);
        const x = 50 + Math.cos(angle) * 39;
        const y = 50 + Math.sin(angle) * 39;
        return <a href={`https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`} target="_blank" rel="noreferrer" className="prince-guard-orbit__person" style={{ left: `${x}%`, top: `${y}%` }} key={name}><PortraitOrInitial name={name} /><span>{name}</span></a>;
      })}
    </div>
  </section>;
}

export default function SuccessionDossier({ requestedTab, requestedPrince, requestedFocus, spoilerLimit = Number.MAX_SAFE_INTEGER, onNavigate, onRouteTab, embedded = false }) {
  const [activeTab, setActiveTab] = useState(() => requestedTab && tabs.some(([id]) => id === requestedTab) ? requestedTab : 'overview');
  const tabRefs = useRef([]);
  const [selectedPrince, setSelectedPrince] = useState(() => princeDossiers.some((item) => item.order === Number(requestedPrince)) ? Number(requestedPrince) : 1);
  const [chapterQuery, setChapterQuery] = useState('');
  const [chapterPhase, setChapterPhase] = useState('all');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(() => {
    const requested = Number(requestedFocus);
    return requested >= 340 && requested <= 413 ? requested : 413;
  });
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [relationshipFocus, setRelationshipFocus] = useState('Kurapika');
  const [assignmentHousehold, setAssignmentHousehold] = useState('all');
  const [selectedAssignmentOrder, setSelectedAssignmentOrder] = useState(14);
  const prince = useMemo(() => princeDossiers.find((item) => item.order === selectedPrince), [selectedPrince]);
  const selectedChapterRecord = useMemo(() => successionChapterResearch.find((item) => item.number === selectedChapterNumber), [selectedChapterNumber]);
  const visibleChapterRecords = useMemo(() => {
    const normalized = chapterQuery.trim().toLowerCase();
    return successionChapterResearch.filter((chapter) => (
      chapter.number <= spoilerLimit
      &&
      (chapterPhase === 'all' || chapter.phase === chapterPhase)
      && (!normalized || `${chapter.number} ${chapter.title} ${chapter.phase} ${chapter.voyageDay} ${chapter.focus} ${chapter.lanes.join(' ')}`.toLowerCase().includes(normalized))
    ));
  }, [chapterPhase, chapterQuery, spoilerLimit]);
  const portrait = portraitFor(prince.name);
  const visibleLessons = nenLessonPhases.filter((item) => firstChapterFor(item.chapters) <= spoilerLimit);
  const visibleAbilities = successionAbilities.filter((item) => firstChapterFor(item.chapters) <= spoilerLimit);
  const visibleOperations = successionOperations.filter((item) => firstChapterFor(item.chapters) <= spoilerLimit);
  const visibleDeaths = deathLedger.filter((item) => Number(item.chapter) <= spoilerLimit);
  const visibleMysteries = successionMysteries.filter((item) => Number(item.lastChapter) <= spoilerLimit);
  const visibleCoreTimeline = wobleCoreTimeline.filter((item) => firstChapterFor(item.chapters) <= spoilerLimit);
  const eligibleChapterCount = successionChapterResearch.filter((chapter) => chapter.number <= spoilerLimit).length;
  const relationshipGroups = [...new Set(successionRelationships.map((item) => relationshipGroupFor(item.type)))];
  const visibleRelationships = successionRelationships.filter((item) => relationshipFilter === 'all' || relationshipGroupFor(item.type) === relationshipFilter);
  const relationshipEntities = [...new Set(successionRelationships.flatMap((item) => [item.from, item.to]))].sort((a, b) => a.localeCompare(b));
  const focusRelationships = visibleRelationships.filter((item) => item.from === relationshipFocus || item.to === relationshipFocus);
  const visibleAssignments = roomAssignmentLedger.filter((record) => assignmentHousehold === 'all' || record.mother.includes(assignmentHousehold));
  const selectedAssignment = roomAssignmentLedger.find((record) => record.order === selectedAssignmentOrder) || roomAssignmentLedger.at(-1);
  const visiblePersonnelTransitions = personnelTransitions.filter((record) => firstChapterFor(record.chapters) <= spoilerLimit);
  const selectedBeast = beastForOrder(prince.order);

  useEffect(() => {
    if (requestedTab && tabs.some(([id]) => id === requestedTab)) setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    const nextPrince = Number(requestedPrince);
    if (princeDossiers.some((item) => item.order === nextPrince)) setSelectedPrince(nextPrince);
  }, [requestedPrince]);

  useEffect(() => {
    if (!requestedFocus) return undefined;
    const requestedChapter = Number(requestedFocus);
    if (requestedChapter >= 340 && requestedChapter <= 413) setSelectedChapterNumber(requestedChapter);
    const timer = window.setTimeout(() => document.getElementById(`dossier-record-${requestedFocus}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    return () => window.clearTimeout(timer);
  }, [activeTab, requestedFocus]);

  const selectTab = (tab, nextPrince = selectedPrince) => {
    setActiveTab(tab);
    onRouteTab?.(tab, tab === 'royal' ? nextPrince : undefined);
  };

  const handleTabKeyDown = (event, index) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next][0]);
    window.requestAnimationFrame(() => tabRefs.current[next]?.focus());
  };

  const openTarget = (target) => {
    if (target.startsWith('tab:')) {
      selectTab(target.slice(4));
      setTimeout(() => document.getElementById('deep-dossier')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      return;
    }
    if (onNavigate) onNavigate(target);
    else document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openNavigationItem = (item) => {
    if (item.target) openTarget(item.target);
    else selectTab(item.tab);
  };

  const chooseAssignmentHousehold = (household) => {
    setAssignmentHousehold(household);
    const first = roomAssignmentLedger.find((record) => household === 'all' || record.mother.includes(household));
    if (first) setSelectedAssignmentOrder(first.order);
  };

  return (
    <section className={`deep-dossier${embedded ? ' deep-dossier--embedded' : ''}`} id="deep-dossier">
      {!embedded && <div className="section-heading">
        <div><span className="section-kicker">Deep Succession index</span><h2>People, powers, operations & unknowns</h2></div>
        <p>The current arc organized as linked records instead of one undifferentiated cast wall. This archive is indexed through Chapter 413.</p>
      </div>}

      {!embedded && <div className="dossier-source-strip">
        {Object.entries(dossierSources).map(([name, source]) => <a href={source} target="_blank" rel="noreferrer" key={name}>{name}<ExternalLink size={11} /></a>)}
      </div>}
      {!embedded && <label className="dossier-jump"><span>Open dossier section</span><select value={activeTab} onChange={(event) => selectTab(event.target.value)}>{tabs.map(([id, label, group]) => <option value={id} key={id}>{group} — {label}</option>)}</select></label>}
      {!embedded && <div className="dossier-tabs" role="tablist" aria-label="Succession dossier topics">
        {tabGroups.map((group) => <section key={group}><span>{group}</span><div>{tabs.filter(([, , tabGroup]) => tabGroup === group).map(([id, label]) => { const index = tabs.findIndex(([tabId]) => tabId === id); return <button ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" id={`dossier-tab-${id}`} aria-controls="dossier-panel" aria-selected={activeTab === id} tabIndex={activeTab === id ? 0 : -1} className={activeTab === id ? 'is-active' : ''} onClick={() => selectTab(id)} onKeyDown={(event) => handleTabKeyDown(event, index)} key={id}>{label}</button>; })}</div></section>)}
      </div>}
      {!embedded && <HorizontalScrollHint>Comparison ledgers preserve every column. Swipe sideways on smaller screens, or use the section selector above to move directly to another record set.</HorizontalScrollHint>}

      <div className="dossier-tabpanel" id="dossier-panel" role={embedded ? 'region' : 'tabpanel'} aria-label={embedded ? `${tabs.find(([id]) => id === activeTab)?.[1] || 'Succession'} records` : undefined} aria-labelledby={embedded ? undefined : `dossier-tab-${activeTab}`} tabIndex="0">

      {activeTab === 'overview' && (
        <div className="overview-dossier">
          <div className="subsection-title"><span>Internal order</span><h3>Succession dossier map</h3></div>
          <div className="navigation-ledger">
            {successionNavigation.map((item) => (
              <button key={item.order} onClick={() => openNavigationItem(item)}>
                <span>{String(item.order).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>
          <div className="period-ledger">
            {successionPeriods.map((period) => (
              <a href={period.source} target="_blank" rel="noreferrer" key={period.name}>
                <span>{period.chapters} · {period.status}</span>
                <h3>{period.name}</h3>
                <p>{period.summary}</p>
                <small>{period.focus.join(' · ')}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'royal' && (
        <div className="royal-dossier">
          <div className="prince-selector" aria-label="Choose a prince dossier">
            {princeDossiers.map((item) => {
              const itemBeast = beastForOrder(item.order);
              const itemPortrait = portraitFor(item.name);
              return <button className={`${selectedPrince === item.order ? 'is-active ' : ''}${item.status === 'deceased' ? 'is-deceased' : ''}`} onClick={() => { setSelectedPrince(item.order); onRouteTab?.('royal', item.order); }} key={item.order}>
                <span className="prince-selector__number">{String(item.order).padStart(2, '0')}</span>
                <span className="prince-selector__visual">
                  {itemBeast?.image ? <SafeImage className="prince-selector__beast" src={itemBeast.image} alt="" /> : <i className="prince-selector__unknown">?</i>}
                  {itemPortrait && <SafeImage className="prince-selector__portrait" src={itemPortrait} media={mediaFor(item.name)} alt={`${item.name} Hunterpedia portrait`} />}
                </span>
                <span className="prince-selector__label"><strong>{item.short}</strong><small>{item.status === 'exceptional' ? 'Exceptional state' : item.status}</small></span>
              </button>;
            })}
          </div>
          <article className={`prince-record prince-record--${prince.status}`}>
            <div className="prince-record__portrait prince-beast-composite">
              {selectedBeast?.image ? <SafeImage className="prince-beast-composite__beast" src={selectedBeast.image} alt={`${prince.short} Guardian Spirit Beast from Hunterpedia`} eager /> : <div className="prince-beast-composite__unknown"><i>?</i><span>Guardian Spirit Beast unrevealed</span></div>}
              {portrait && <SafeImage className="prince-beast-composite__host" src={portrait} media={mediaFor(prince.name)} alt={`${prince.name} Hunterpedia portrait`} eager />}
              {portrait && prince.status === 'deceased' && <i className="death-mark" aria-label="Confirmed deceased">×</i>}
              <span>{prince.status === 'active' ? 'Active contestant' : prince.status === 'deceased' ? 'Confirmed deceased' : 'Exceptional body state'}</span>
              {selectedBeast && <a href={selectedBeast.source} target="_blank" rel="noreferrer">Beast image and rules <ExternalLink size={10} /></a>}
            </div>
            <div className="prince-record__body">
              <div><span>{prince.order}{prince.order === 1 ? 'st' : prince.order === 2 ? 'nd' : prince.order === 3 ? 'rd' : 'th'} Prince · Room {prince.room}</span><h3>{prince.name}</h3><p>{prince.statusDetail}</p></div>
              <dl><div><dt>Mother</dt><dd>{prince.mother}</dd></div><div><dt>Age</dt><dd>{prince.age}</dd></div><div><dt>Current location / legal state</dt><dd>{prince.currentLocation} · {prince.statusDetail || prince.status}</dd></div><div><dt>Mafia connection</dt><dd>{prince.mafia}</dd></div><div><dt>Strategy</dt><dd>{prince.strategy}</dd></div><div><dt>Nen</dt><dd>{prince.nen}</dd></div><div><dt>Guardian Spirit Beast</dt><dd>{prince.beast}</dd></div></dl>
              <div className="prince-record__lists"><div><b>Core people</b>{prince.team.map((person) => <span key={person}>{person}</span>)}</div><div><b>Pressure points</b>{prince.pressure.map((item) => <span key={item}>{item}</span>)}</div></div>
              <a href={prince.source} target="_blank" rel="noreferrer">Open prince source <ExternalLink size={12} /></a>
            </div>
          </article>

          <PrinceGuardOrbit prince={prince} />

          <section className="royal-system-layers" aria-label="Three relationship layers for the selected prince">
            <article><span>01 · Blood and household</span><h4>{prince.mother}</h4><p>The maternal branch determines the original household, sibling pressures, queen access, and many guard assignments.</p></article>
            <article><span>02 · Ritual Nen</span><h4>{selectedBeast?.knowledge || 'Unknown'}</h4><p>{selectedBeast?.conditions || 'No revealed appearance, trigger, condition, or ability can be safely visualized yet.'}</p></article>
            <article><span>03 · Political network</span><h4>{prince.mafia}</h4><p>{prince.strategy}</p></article>
          </section>

          <div className="queen-ledger">
            <div className="subsection-title"><span>Eight royal households</span><h3>Queens and maternal branches</h3></div>
            <div>{queenHouseholdLedger.map((queen) => (
              <a href={queen.source} target="_blank" rel="noreferrer" key={queen.name}>
                <span>{queen.rank} Queen · {queen.status}</span><h4>{queen.name}</h4><p>{queen.action}</p><small>{queen.children} · {queen.residence}</small>
              </a>
            ))}</div>
          </div>
          <div className="exception-ledger"><div className="subsection-title"><span>Status language</span><h3>Death is not the only state</h3></div><dl>{exceptionalStatuses.map(([term, note]) => <div key={term}><dt>{term}</dt><dd>{note}</dd></div>)}</dl></div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="assignment-dossier">
          <div className="subsection-title"><span>Fourteen changing households</span><h3>Prince room and personnel matrix</h3></div>
          <section className="assignment-network" aria-labelledby="assignment-network-title">
            <header><div><span>Interactive assignment lens</span><h3 id="assignment-network-title">Household origin → deployment pressure → destination room</h3></div><p>Filter by a queen’s branch, then select a prince room. The lens explains the origin team, embedded or reassigned personnel, and current record without pretending every loyalty is fixed.</p></header>
            <nav aria-label="Filter assignments by royal household">
              <button type="button" className={assignmentHousehold === 'all' ? 'is-active' : ''} onClick={() => chooseAssignmentHousehold('all')}>All households <small>{roomAssignmentLedger.length}</small></button>
              {queenHouseholdLedger.map((queen) => <button type="button" className={assignmentHousehold === queen.name ? 'is-active' : ''} onClick={() => chooseAssignmentHousehold(queen.name)} key={queen.name}>{queen.name} <small>{roomAssignmentLedger.filter((record) => record.mother.includes(queen.name)).length}</small></button>)}
            </nav>
            <div className="assignment-network__workspace">
              <div className="assignment-network__destinations" role="list" aria-label="Prince room destinations">
                {visibleAssignments.map((record) => <button type="button" role="listitem" className={selectedAssignment.order === record.order ? 'is-active' : ''} onClick={() => setSelectedAssignmentOrder(record.order)} key={record.order}><i>{String(record.order).padStart(2, '0')}</i><span><small>{record.mother} → {record.room}</small><strong>{record.prince}</strong></span><em>{record.state}</em></button>)}
              </div>
              <article className="assignment-network__inspector" aria-live="polite">
                <header><span>Prince {selectedAssignment.order} · {selectedAssignment.room}</span><h3>{selectedAssignment.prince}</h3><p>{selectedAssignment.mother} household · {selectedAssignment.state}</p></header>
                <div className="assignment-network__flow">
                  <section><small>01 · Origin team</small><p>{selectedAssignment.original}</p></section><ArrowRight size={18} aria-hidden="true" />
                  <section><small>02 · Deployment / infiltration</small><p>{selectedAssignment.deployed}</p></section><ArrowRight size={18} aria-hidden="true" />
                  <section><small>03 · Current record</small><p>{selectedAssignment.current}</p></section>
                </div>
                <footer><button type="button" onClick={() => onNavigate?.('black-whale', { room: selectedAssignment.room })}>Open room atlas <ArrowRight size={13} /></button><a href={selectedAssignment.source} target="_blank" rel="noreferrer">Assignment source <ExternalLink size={11} /></a></footer>
              </article>
            </div>
          </section>
          <div className="assignment-table-wrap">
            <table className="assignment-table">
              <thead><tr><th>Room</th><th>Prince / state</th><th>Original household</th><th>Deployed, embedded, or reassigned</th><th>Current record</th></tr></thead>
              <tbody>{roomAssignmentLedger.map((record) => (
                <tr key={record.order}>
                  <td><a href={record.source} target="_blank" rel="noreferrer">{record.room}</a><small>{record.mother}</small></td>
                  <td><strong>{record.order}. {record.prince}</strong><span className={`assignment-state assignment-state--${record.state.toLowerCase().includes('deceased') ? 'deceased' : record.state.toLowerCase().includes('exceptional') ? 'exceptional' : 'active'}`}>{record.state}</span></td>
                  <td>{record.original}</td><td>{record.deployed}</td><td>{record.current}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="queen-household-grid">
            {queenHouseholdLedger.map((queen) => (
              <a href={queen.source} target="_blank" rel="noreferrer" key={queen.name}>
                <span>{queen.rank} Queen · {queen.status}</span><h3>{queen.name}</h3><p>{queen.guards}</p><small>{queen.children}</small>
              </a>
            ))}
          </div>
          <div className="subsection-title subsection-title--spaced"><span>Time-sensitive assignments</span><h3>Personnel movement history</h3></div>
          <div className="assignment-table-wrap assignment-table-wrap--compact">
            <table className="assignment-table personnel-transition-table">
              <thead><tr><th>Time</th><th>Person / household</th><th>Movement</th><th>Change</th><th>State</th></tr></thead>
              <tbody>{visiblePersonnelTransitions.map((record) => (
                <tr key={`${record.chapters}-${record.subject}`}><td><a href={record.source} target="_blank" rel="noreferrer">Ch. {record.chapters}</a><small>{record.day}</small></td><td><strong>{record.subject}</strong></td><td>{record.route}</td><td>{record.change}</td><td><span className="assignment-state">{record.state}</span></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'core' && (
        <div className="core-thread">
          <div className="core-thread__intro">
            <span>Room 1014 throughline</span><h3>Woble, Oito, and Kurapika</h3>
            <p>The central survival thread separated from the wider contest: a shrinking bodyguard team becomes a classroom, alliance hub, intelligence exchange, and curse target.</p>
          </div>
          <div className="core-thread__timeline">
            {visibleCoreTimeline.map((event, index) => (
              <a href={event.source} target="_blank" rel="noreferrer" key={`${event.chapters}-${event.title}`}>
                <i>{String(index + 1).padStart(2, '0')}</i><div><span>Ch. {event.chapters} · {event.time}</span><h3>{event.title}</h3><p>{event.detail}</p><small>{event.people}</small></div>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'beasts' && (
        <div className="beast-dossier">
          <div className="beast-rules"><div><span>Shared ritual rules</span><h3>What every beast inherits</h3></div><ul>{beastRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
          <div className="beast-grid">{guardianBeasts.map((beast) => (
            <a id={`dossier-record-${focusIdFor(beast.host)}`} href={beast.source} target="_blank" rel="noreferrer" key={`${beast.order}-${beast.host}`} className={`${!beast.image ? 'no-image ' : ''}${requestedFocus === focusIdFor(beast.host) ? 'is-focused' : ''}`}>
              <figure data-image-frame><SafeImage src={beast.image} fallbackLabel={`${beast.host} Beast`} alt={`${beast.host} Guardian Spirit Beast from Hunterpedia`} /></figure>
              <div><span>{beast.order === 'King' ? 'King' : `Prince ${beast.order}`} · {beast.knowledge}</span><h3>{beast.host}</h3><b>{beast.type}</b><p>{beast.ability}</p><em>{beast.conditions}</em><small>Hunterpedia <ExternalLink size={10} /></small></div>
            </a>
          ))}</div>
          <div className="subsection-title subsection-title--spaced"><span>Comparison ledger</span><h3>Hosts, triggers, known rules, and unknowns</h3></div>
          <div className="assignment-table-wrap assignment-table-wrap--compact">
            <table className="assignment-table beast-comparison-table">
              <thead><tr><th>Host</th><th>Knowledge state</th><th>Known behavior</th><th>Conditions / unknown boundary</th><th>Host state</th></tr></thead>
              <tbody>{guardianBeasts.map((beast) => (
                <tr key={`compare-${beast.host}`}><td><a href={beast.source} target="_blank" rel="noreferrer">{beast.order === 'King' ? 'King' : `Prince ${beast.order}`} · {beast.host}</a></td><td>{beast.knowledge}</td><td>{beast.ability}</td><td>{beast.conditions}</td><td>{beast.host === 'Kacho' ? 'Host deceased; beast active' : beast.host === 'Momoze' || beast.host === 'Salé-salé' ? 'Host deceased' : 'Active or unresolved'}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'guards' && (
        <div className="guard-ledger">
          {guardAssignmentGroups.map((group) => (
            <section key={group.group}>
              <div><span>{group.records.length} records</span><h3>{group.group}</h3><p>{group.description}</p></div>
              <div>{group.records.map((record) => (
                <a href={record.source} target="_blank" rel="noreferrer" key={`${group.group}-${record.subject}`}>
                  <span>{record.status}</span><h4>{record.subject}</h4><p>{record.people}</p><small>{record.notes}</small>
                </a>
              ))}</div>
            </section>
          ))}
        </div>
      )}

      {activeTab === 'abilities' && (
          <div className="ability-dossier">
          <div className="lesson-ledger">{visibleLessons.map((phase) => <article key={phase.phase}><span>{phase.chapters} · {phase.place}</span><h3>{phase.phase}</h3><p>{phase.summary}</p><div><b>People</b>{phase.people.map((item) => <small key={item}>{item}</small>)}</div><ul>{phase.incidents.map((item) => <li key={item}>{item}</li>)}</ul><a href={phase.source} target="_blank" rel="noreferrer">Source <ExternalLink size={11} /></a></article>)}</div>
          <div className="ability-ledger">
            {visibleAbilities.map((ability) => (
              <a id={`dossier-record-${focusIdFor(ability.ability)}`} className={requestedFocus === focusIdFor(ability.ability) ? 'is-focused' : ''} href={ability.source} target="_blank" rel="noreferrer" key={`${ability.user}-${ability.ability}`}>
                <span>Ch. {ability.chapters} · {ability.type}</span>
                <h3>{ability.ability}</h3>
                <b>{ability.user}</b>
                <p>{ability.mechanics}</p>
                <small>{ability.conditions}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="rule-ledger">
          {contestRules.map((rule) => (
            <a href={rule.source} target="_blank" rel="noreferrer" key={rule.name}>
              <span>{rule.status}</span><h3>{rule.name}</h3><p>{rule.note}</p>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'institutions' && (
        <div className="institution-ledger">
          {institutionLedger.map((record) => (
            <a href={record.source} target="_blank" rel="noreferrer" key={record.name}>
              <span>{record.territory}</span><h3>{record.name}</h3><b>{record.people}</b><p>{record.authority}</p>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'factions' && <div className="faction-dossier">{successionFactions.map((faction) => <a id={`dossier-record-${focusIdFor(faction.name)}`} className={requestedFocus === focusIdFor(faction.name) ? 'is-focused' : ''} href={faction.source} target="_blank" rel="noreferrer" key={faction.name}><span>{faction.territory}</span><h3>{faction.name}</h3><p>{faction.objective}</p><small>{faction.people.join(' · ')}</small></a>)}</div>}

      {activeTab === 'mafia' && (
        <div className="mafia-dossier-stack">
          <div className="mafia-ledger">{mafiaDossiers.map((family) => (
            <a id={`dossier-record-${focusIdFor(family.family)}`} className={requestedFocus === focusIdFor(family.family) ? 'is-focused' : ''} href={family.source} target="_blank" rel="noreferrer" key={family.family}>
              <figure className="power-bloc-visual" role="img" aria-label={`${family.family} power bloc visual`}><i /><strong>{family.family}</strong><small>Power bloc</small></figure>
              <span>{family.sponsor}</span><h3>{family.family}</h3><p>{family.base}</p>
              <div><b>Leadership</b>{family.leadership.map((item) => <small key={item}>{item}</small>)}</div>
              <div><b>Indexed membership</b>{family.members.map((item) => <small key={item}>{item}</small>)}</div>
              <div><b>Objectives</b>{family.objectives.map((item) => <small key={item}>{item}</small>)}</div>
              <div><b>Risks</b>{family.risks.map((item) => <small key={item}>{item}</small>)}</div>
            </a>
          ))}</div>
          <div className="subsection-title subsection-title--spaced"><span>{mafiaMemberLedger.length} indexed entries</span><h3>Member-level status ledger</h3></div>
          <div className="assignment-table-wrap">
            <table className="assignment-table mafia-member-table"><thead><tr><th>Family</th><th>Member</th><th>Role</th><th>Nen record</th><th>Last maintained location</th><th>Status</th></tr></thead><tbody>{mafiaMemberLedger.map((record, index) => <tr key={`${record.family}-${record.name}-${index}`}><td>{record.family}</td><td><a href={record.source} target="_blank" rel="noreferrer">{record.name}</a></td><td>{record.role}</td><td>{record.nen}</td><td>{record.location}</td><td>{record.status}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}

      {activeTab === 'troupe' && (
        <div className="tracker-ledger">
          {troupeHisokaTracker.map((record) => (
            <a href={record.source} target="_blank" rel="noreferrer" key={record.name}>
              <span>{record.status} · {record.location}</span><h3>{record.name}</h3><p>{record.objective}</p><b>Last indexed: Ch. {record.lastChapter}</b><small>{record.evidence} · {record.confidence}</small>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'justice' && (
        <div className="justice-dossier-stack">
          <div className="tracker-ledger">{justiceMilitaryLedger.map((record) => (
            <a href={record.source} target="_blank" rel="noreferrer" key={record.area}>
              <span>{record.place}</span><h3>{record.area}</h3><b>{record.people}</b><p>{record.authority}</p>
            </a>
          ))}</div>
          <div className="subsection-title subsection-title--spaced"><span>Procedure matrix</span><h3>Law, custody, and martial authority</h3></div>
          <div className="assignment-table-wrap assignment-table-wrap--compact"><table className="assignment-table legal-procedure-table"><thead><tr><th>Procedure</th><th>Maintained rule</th><th>Authority</th><th>Current state</th></tr></thead><tbody>{legalProcedureLedger.map((record) => <tr key={record.procedure}><td><a href={record.source} target="_blank" rel="noreferrer">{record.procedure}</a></td><td>{record.rule}</td><td>{record.authority}</td><td>{record.state}</td></tr>)}</tbody></table></div>
        </div>
      )}

      {activeTab === 'expedition' && (
        <div className="tracker-ledger">
          {expeditionLayer.map((record) => (
            <a href={record.source} target="_blank" rel="noreferrer" key={record.topic}>
              <span>{record.location}</span><h3>{record.topic}</h3><p>{record.note}</p>
            </a>
          ))}
        </div>
      )}

      {activeTab === 'relations' && <div className="relationship-map">
        <div className="relationship-map__toolbar"><div><span className="section-kicker">Dynamic relationship graph</span><h3>Blood is only one kind of connection</h3><p>Filter political, contractual, operational, adversarial, and emotional links. Each edge carries its active story period so a temporary alliance is never presented as permanent.</p></div><div><button className={relationshipFilter === 'all' ? 'is-active' : ''} onClick={() => setRelationshipFilter('all')}>All</button>{relationshipGroups.map((group) => <button className={relationshipFilter === group ? 'is-active' : ''} onClick={() => setRelationshipFilter(group)} key={group}>{group}</button>)}</div></div>
        <div className="relationship-focus-control"><label><span>Focus the graph</span><select value={relationshipFocus} onChange={(event) => setRelationshipFocus(event.target.value)}>{relationshipEntities.map((entity) => <option value={entity} key={entity}>{entity}</option>)}</select></label><p>{focusRelationships.length} visible connection{focusRelationships.length === 1 ? '' : 's'} for {relationshipFocus}. Change the relationship class above to narrow the network.</p></div>
        <div className="relationship-network" aria-label={`Relationship graph centered on ${relationshipFocus}`}>
          <div className="relationship-network__center"><span>Selected entity</span><strong>{relationshipFocus}</strong></div>
          <div className="relationship-network__spokes">{focusRelationships.map((relation) => { const other = relation.from === relationshipFocus ? relation.to : relation.from; return <a href={relation.source} target="_blank" rel="noreferrer" key={`${relation.from}-${relation.to}`}><i aria-hidden="true" /><span>{relationshipGroupFor(relation.type)} · {relation.state}</span><strong>{other}</strong><small>{relation.type}</small><p>{relation.phase} · Ch. {relation.chapters}</p></a>; })}</div>
          {!focusRelationships.length && <p className="relationship-network__empty">No connection in this filter. Choose another relationship class or focus.</p>}
        </div>
        <div className="relationship-ledger">{visibleRelationships.map((relation) => <a href={relation.source} target="_blank" rel="noreferrer" key={`${relation.from}-${relation.to}`}><div><strong>{relation.from}</strong><i>→</i><strong>{relation.to}</strong></div><span>{relationshipGroupFor(relation.type)} · {relation.type}</span><p>{relation.note}</p><small>{relation.phase} · Ch. {relation.chapters} · {relation.state}</small></a>)}</div>
      </div>}

      {activeTab === 'operations' && <div className="operations-dossier">
        <div className="subsection-title"><span>Conflict and operation records</span><h3>Named operations across the ship</h3></div>
        <div className="operation-ledger">{visibleOperations.map((operation) => <a id={`dossier-record-${focusIdFor(operation.name)}`} className={requestedFocus === focusIdFor(operation.name) ? 'is-focused' : ''} href={operation.source} target="_blank" rel="noreferrer" key={operation.name}><span className={`operation-status operation-status--${operation.status}`}>{operation.status}</span><div><small>Ch. {operation.chapters} · {operation.place}</small><h3>{operation.name}</h3><p>{operation.summary}</p></div><ExternalLink size={13} /></a>)}</div>
        <div className="subsection-title subsection-title--spaced"><span>Operational profile</span><h3>How the Black Whale functions</h3></div>
        <div className="voyage-operation-grid">{voyageOperations.map((record) => <a href={record.source} target="_blank" rel="noreferrer" key={record.name}><span>{record.area}</span><h3>{record.name}</h3><p>{record.detail}</p></a>)}</div>
      </div>}

      {activeTab === 'status' && <><div className="body-state-ledger">{bodyStateLedger.map((record) => <a href={record.source} target="_blank" rel="noreferrer" key={record.state} className={`body-state-ledger__item body-state-ledger__item--${record.className}`}><span>{record.className}</span><h3>{record.state}</h3><p>{record.examples}</p><small>{record.rule}</small></a>)}</div><div className="death-ledger">{visibleDeaths.map((record) => { const recordPortrait = portraitFor(record.name); return <a href={record.source} target="_blank" rel="noreferrer" key={`${record.name}-${record.chapter}`}>{recordPortrait && <figure data-image-frame><SafeImage src={recordPortrait} media={mediaFor(record.name)} alt={`${record.name} Hunterpedia portrait`} /><i className="death-mark">×</i></figure>}<div><span>{record.day} · Chapter {record.chapter} · {record.place}</span><h3>{record.name}</h3><p>{record.cause}</p></div></a>; })}</div></>}

      {activeTab === 'objects' && <><div className="object-dossier">{successionObjects.map((item) => <a id={`dossier-record-${focusIdFor(item.name)}`} className={requestedFocus === focusIdFor(item.name) ? 'is-focused' : ''} href={item.source} target="_blank" rel="noreferrer" key={item.name}><h3>{item.name}</h3><p>{item.note}</p><span>Source <ExternalLink size={10} /></span></a>)}</div><div className="evidence-ledger">{successionEvidence.map((item) => <a href={item.source} target="_blank" rel="noreferrer" key={item.name}><span>{item.kind}</span><h3>{item.name}</h3><p>{item.note}</p></a>)}</div></>}

      {activeTab === 'routes' && <div className="route-dossier"><div className="route-dossier__key"><span>Official movement</span><span>Restricted movement</span><span>Nen / hidden movement</span></div>{shipRouteLayers.map((route, index) => <a href={route.source} target="_blank" rel="noreferrer" key={route.name}><i>{String(index + 1).padStart(2, '0')}</i><div><span>{route.access}</span><h3>{route.name}</h3><p>{route.path}</p></div></a>)}</div>}

      {activeTab === 'chapters' && (
        <div className="chapter-dossier">
          <div className="record-visual-strip" aria-label="Records section visual guide">
            {['Chapter ledger', 'Status ledger', 'Evidence index'].map((label, index) => <figure className={`record-visual is-${index + 1}`} role="img" aria-label={`${label} visual`} key={label}><i /><figcaption>{label}</figcaption></figure>)}
          </div>
          <div className="chapter-dossier__toolbar">
            <label><Search size={15} /><input value={chapterQuery} onChange={(event) => setChapterQuery(event.target.value)} placeholder="Number, title, event, thread..." /></label>
            <select value={chapterPhase} onChange={(event) => setChapterPhase(event.target.value)} aria-label="Filter Succession chapters by phase">
              <option value="all">All phases</option>
              {[...new Set(successionChapterResearch.map((chapter) => chapter.phase))].map((phase) => <option value={phase} key={phase}>{phase}</option>)}
            </select>
            <span role="status" aria-live="polite">{visibleChapterRecords.length} of {eligibleChapterCount} visible records</span>
          </div>
          {selectedChapterRecord && <article className="chapter-record-inspector" aria-live="polite">
            <header><div><span>Chapter {selectedChapterRecord.number} · {selectedChapterRecord.voyageDay}</span><h3>{selectedChapterRecord.title}</h3><p>{selectedChapterRecord.focus}</p></div><a href={selectedChapterRecord.source} target="_blank" rel="noreferrer">Open Hunterpedia source <ExternalLink size={12} /></a></header>
            <div className="chapter-record-inspector__meta"><span>{selectedChapterRecord.phase}</span>{selectedChapterRecord.lanes.map((lane) => <span key={lane}>{lane}</span>)}<span>Reviewed {selectedChapterRecord.lastReviewed}</span></div>
            {selectedChapterRecord.prelude.length > 0 && <div className="chapter-record-inspector__events"><h4>Pre-voyage chronology</h4>{selectedChapterRecord.prelude.map((event) => <a href={event.source} target="_blank" rel="noreferrer" key={event.id}><span>{event.date} · {event.confidence}</span><strong>{event.title}</strong><p>{event.detail}</p></a>)}</div>}
            {selectedChapterRecord.events.length > 0 ? <div className="chapter-record-inspector__events"><h4>Indexed scenes</h4>{selectedChapterRecord.events.map((event) => <a href={event.source} target="_blank" rel="noreferrer" key={event.id}><span>{event.time} · {event.location} · {event.confidence}</span><strong>{event.title}</strong><p>{event.detail}</p></a>)}</div> : <p className="chapter-record-inspector__empty">This record has a maintained local summary and direct source; no clock-scoped voyage scene applies.</p>}
            {selectedChapterRecord.threadLabels.length > 0 && <footer><b>Connected threads</b>{selectedChapterRecord.threadLabels.map((thread) => <span key={thread}>{thread}</span>)}</footer>}
          </article>}
          <div className="chapter-research-ledger">
            {visibleChapterRecords.map((chapter) => (
              <button type="button" id={`dossier-record-${chapter.number}`} aria-pressed={selectedChapterNumber === chapter.number} className={`${requestedFocus === String(chapter.number) ? 'is-focused ' : ''}${selectedChapterNumber === chapter.number ? 'is-selected' : ''}`} onClick={() => setSelectedChapterNumber(chapter.number)} key={chapter.number}>
                <span>Chapter {chapter.number} · {chapter.voyageDay}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.focus}</p>
                <div>{chapter.lanes.map((lane) => <small key={lane}>{lane}</small>)}</div>
                <b>{chapter.phase} · {chapter.events.length} indexed scene{chapter.events.length === 1 ? '' : 's'}</b>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mysteries' && <div className="mystery-ledger">{visibleMysteries.map((item) => <a id={`dossier-record-${focusIdFor(item.question)}`} className={requestedFocus === focusIdFor(item.question) ? 'is-focused' : ''} href={item.source} target="_blank" rel="noreferrer" key={item.question}><span>{item.status} · last relevant Ch. {item.lastChapter}</span><h3>{item.question}</h3><p>{item.evidence}</p></a>)}</div>}

      {activeTab === 'links' && (
        <div className="cross-link-ledger">
          {crossLinkIndex.map((record) => (
            <button onClick={() => openTarget(record.target)} key={record.name}>
              <span>Connected record</span><h3>{record.name}</h3><p>{record.connects}</p><b>Open linked view</b>
            </button>
          ))}
        </div>
      )}

      </div>
    </section>
  );
}
