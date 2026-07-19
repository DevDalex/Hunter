import {
  ArrowRight, BookOpen, Clock3, MapPinned, Network, Orbit, Scale, ShipWheel, Shield, UsersRound,
} from 'lucide-react';
import { blackWhaleRooms } from '../data/blackWhale';
import {
  contestRules, guardianBeasts, guardAssignmentGroups, princeDossiers, successionAbilities, successionMysteries,
  successionOperations, successionPeriods,
} from '../data/successionDossier';
import { queenHouseholdLedger } from '../data/successionArchive';
import { successionRoster } from '../data/successionRoster';
import { deathLedger } from '../data/successionStatus';

const doors = [
  { target: 'family-tree', label: 'Royal family', detail: 'Connected tree, queens, princes, households and dossiers.', icon: Network },
  { target: 'succession-roster', label: 'Cast & assignments', detail: 'People, rooms, employers, true loyalties and changing roles.', icon: UsersRound },
  { target: 'succession-timeline', label: 'Voyage timeline', detail: 'Events by day, story time, chapter, thread and location.', icon: Clock3 },
  { target: 'black-whale', label: 'Black Whale', detail: 'Clickable cross-section, rooms, access and movement routes.', icon: ShipWheel },
  { target: 'beasts', label: 'Nen & Spirit Beasts', detail: 'Beasts, abilities, Kurapika’s classes and contest rules.', icon: Orbit },
  { target: 'mafia', label: 'Power blocs', detail: 'Mafia, Justice, military authority and active operations.', icon: Shield },
  { target: 'chapters', label: 'Chapter records', detail: 'Current-arc chapters, deaths, objects and open mysteries.', icon: BookOpen },
];

const threads = [
  ['Royal contest', 'Princes · queens · guards · ritual'],
  ['Nen escalation', 'Spirit Beasts · classes · curses · abilities'],
  ['Lower tiers', 'Mafia · Troupe · Hisoka · Heil-Ly'],
  ['Law & expedition', 'Justice · military · Zodiacs · Beyond'],
];

const statusLabel = (status) => status === 'deceased' ? 'Confirmed deceased' : status === 'exceptional' ? 'Exceptional body state' : 'Active contestant';
const firstChapter = (value) => Number(String(value || '').match(/\d{3}/)?.[0] || 0);
const royalDeathChapter = (name) => Number(deathLedger.find((record) => record.name === name)?.chapter || 0);

export default function SuccessionOverview({ spoilerLimit, onNavigate, onOpenPrince, onOpenDossier, onOpenWorldMap }) {
  const visibleAbilities = successionAbilities.filter((item) => firstChapter(item.chapters) <= spoilerLimit);
  const visibleOperations = successionOperations.filter((item) => firstChapter(item.chapters) <= spoilerLimit);
  const visibleMysteries = successionMysteries.filter((item) => Number(item.lastChapter) <= spoilerLimit);

  return (
    <section className="succession-overview" id="succession-overview">
      <div className="succession-system-map">
        <header><span className="section-kicker">How the story is structured</span><h2>One voyage, three periods, four simultaneous pressures.</h2><p>The royal contest is only one layer of the current story. Read left to right for sequence, then follow a horizontal lane to isolate one system across the voyage.</p></header>
        <div className="succession-system-map__periods">
          {successionPeriods.map((period, index) => <a href={period.source} target="_blank" rel="noreferrer" key={period.name}><i>{String(index + 1).padStart(2, '0')}</i><span>{period.chapters}</span><h3>{period.name}</h3><p>{period.summary}</p></a>)}
        </div>
        <div className="succession-system-map__threads" aria-label="Concurrent story systems">
          {threads.map(([name, detail], index) => <div key={name}><i style={{ '--lane': index }} /><b>{name}</b><span>{detail}</span></div>)}
        </div>
      </div>

      <section className="succession-start-path" aria-labelledby="succession-start-path-title">
        <header><span className="section-kicker">Start here</span><h2 id="succession-start-path-title">Four questions orient the current story.</h2><p>Each answer opens a different visual system. The sequence moves from world scale to political rules, changing people, and finally ship space.</p></header>
        <ol>
          <li><button type="button" onClick={onOpenWorldMap}><i>01</i><MapPinned size={20} /><span><small>Where is this happening?</small><strong>Kakin and the voyage</strong><em>Known World → departure → Black Whale</em></span><ArrowRight size={15} /></button></li>
          <li><button type="button" onClick={() => onOpenDossier('rules')}><i>02</i><Scale size={20} /><span><small>What forces the conflict?</small><strong>Contest and ritual rules</strong><em>Confirmed rules, ambiguities, and law</em></span><ArrowRight size={15} /></button></li>
          <li><button type="button" onClick={() => onNavigate('succession-roster', { panel: 'assignments' })}><i>03</i><UsersRound size={20} /><span><small>Who serves whom?</small><strong>Households and assignments</strong><em>Queens, guards, spies, Hunters, rooms</em></span><ArrowRight size={15} /></button></li>
          <li><button type="button" onClick={() => onNavigate('succession-timeline')}><i>04</i><Clock3 size={20} /><span><small>What changes when?</small><strong>Voyage event clock</strong><em>Day, time, chapter, thread, location</em></span><ArrowRight size={15} /></button></li>
        </ol>
      </section>

      <div className="succession-orientation-grid">
        <section className="contest-rule-preview" aria-labelledby="contest-rule-preview-title">
          <header><span>Ritual law ≠ ordinary law</span><h2 id="contest-rule-preview-title">The contest’s first rule set</h2><p>These are orientation statements, not a claim that every general rule is fully known from one shown contest.</p></header>
          <ol>{contestRules.slice(0, 6).map((rule, index) => <li key={rule.name}><i>{String(index + 1).padStart(2, '0')}</i><div><strong>{rule.name}</strong><p>{rule.note}</p><span>{rule.status}</span></div></li>)}</ol>
          <button type="button" onClick={() => onOpenDossier('rules')}>Open all rules and evidence <ArrowRight size={14} /></button>
        </section>
        <aside className="succession-world-handoff">
          <MapPinned size={30} />
          <span className="section-kicker">World → voyage → interior</span>
          <h2>See the scale change.</h2>
          <p>The Known World map places Kakin and its port. The voyage handoff explains the outward route. The Black Whale atlas then takes over at the five-tier interior scale.</p>
          <div><button type="button" onClick={onOpenWorldMap}>Open Succession map <ArrowRight size={14} /></button><button type="button" onClick={() => onNavigate('black-whale')}>Open ship interior <ShipWheel size={14} /></button></div>
        </aside>
      </div>

      <section className="household-pressure-preview" aria-labelledby="household-pressure-title">
        <header><div><span className="section-kicker">Eight maternal households</span><h2 id="household-pressure-title">The family tree is only the beginning.</h2></div><p>Every queen branch also carries guards, surveillance, resources, and changing protection. Select the full royal or assignment workspace for person-level detail.</p></header>
        <div>{queenHouseholdLedger.map((queen) => <article key={queen.rank}><i>{queen.rank}</i><div><h3>{queen.name}</h3><p>{queen.children}</p><span>{queen.status}</span></div></article>)}</div>
        <footer><button type="button" onClick={() => onNavigate('family-tree')}>Open dual-view family tree <Network size={14} /></button><button type="button" onClick={() => onNavigate('succession-roster', { panel: 'assignments' })}>Trace {guardAssignmentGroups.length} assignment systems <UsersRound size={14} /></button></footer>
      </section>

      <div className="succession-door-grid">
        {doors.map(({ target, label, detail, icon: Icon }, index) => (
          <button onClick={() => onNavigate(target)} key={target}>
            <i>{String(index + 1).padStart(2, '0')}</i><Icon size={20} />
            <span><strong>{label}</strong><small>{detail}</small></span><ArrowRight size={17} />
          </button>
        ))}
      </div>

      <section className="succession-overview__scale" aria-label="Current dossier coverage">
        <div><strong>{princeDossiers.length}</strong><span>prince dossiers</span></div>
        <div><strong>{successionRoster.length}</strong><span>cast records</span></div>
        <div><strong>{blackWhaleRooms.length}</strong><span>ship spaces</span></div>
        <div><strong>{guardianBeasts.length}</strong><span>Spirit Beasts</span></div>
      </section>

      <div className="prince-status-board">
        <div className="subsection-title"><span>Royal status board</span><h2>The fourteen contestants at a glance</h2><p>Open any name for a comparable dossier. The red death treatment appears only when death is confirmed within your selected reading boundary.</p></div>
        <div className="prince-status-board__table-wrap" tabIndex="0" role="region" aria-label="Fourteen prince status table">
          <table>
            <thead><tr><th>Order</th><th>Prince</th><th>Mother</th><th>Room / legal location</th><th>Status</th><th>Central pressure</th></tr></thead>
            <tbody>{princeDossiers.map((prince) => {
              const deathChapter = royalDeathChapter(prince.name);
              const statusIsHidden = (deathChapter && deathChapter > spoilerLimit) || (prince.status === 'exceptional' && spoilerLimit < 405);
              const visibleStatus = statusIsHidden ? 'hidden' : prince.status;
              return <tr key={prince.order}>
                <td>{String(prince.order).padStart(2, '0')}</td>
                <th><button onClick={() => onOpenPrince(prince.order)}>{prince.name}</button></th>
                <td>{prince.mother}</td><td>{prince.room}</td>
                <td><span className={`status-chip status-chip--${visibleStatus}`}>{statusIsHidden ? `Hidden after Ch. ${spoilerLimit}` : statusLabel(prince.status)}</span></td>
                <td>{prince.pressure[0]}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>

      <section className="succession-overview__lenses">
        <header><span className="section-kicker">Focused reading lenses</span><h2>Open only the record set you need.</h2></header>
        <div>
          <button onClick={() => onOpenDossier('beasts')}><Orbit size={18} /><span><b>{guardianBeasts.length} Spirit Beasts</b><small>Hosts, behavior, abilities and unknowns</small></span><ArrowRight size={14} /></button>
          <button onClick={() => onOpenDossier('abilities')}><Scale size={18} /><span><b>{visibleAbilities.length} revealed abilities</b><small>Mechanics, costs, conditions and counters</small></span><ArrowRight size={14} /></button>
          <button onClick={() => onOpenDossier('operations')}><Shield size={18} /><span><b>{visibleOperations.length} operations</b><small>Assassinations, searches, escapes and investigations</small></span><ArrowRight size={14} /></button>
          <button onClick={() => onOpenDossier('mysteries')}><BookOpen size={18} /><span><b>{visibleMysteries.length} open questions</b><small>Evidence and last-relevant chapter</small></span><ArrowRight size={14} /></button>
        </div>
      </section>
    </section>
  );
}
