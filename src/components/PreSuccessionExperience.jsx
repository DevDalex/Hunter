import { useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, Building2, CalendarDays, CheckCircle2, ExternalLink, Filter, Gamepad2,
  Network, Search, Shield, Swords, Timer, Users, XCircle,
} from 'lucide-react';
import SafeImage from './SafeImage';
import SourcePortrait from './SourcePortrait';
import { priorityPortraitByName } from '../data/priorityMedia.generated';
import { preSuccessionExperienceById, preSuccessionExperiences } from '../data/preSuccessionExperiences';
import { arcVisualArchives } from '../data/arcVisualArchives';

const wiki = (name) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`;

function portraitRecord(name) {
  const media = priorityPortraitByName.get(name);
  if (!media) return { id: name, name, source: wiki(name) };
  return {
    id: name,
    name,
    source: media.articleSource,
    image: media.src,
    media,
  };
}

function Portrait({ name, eager = false, className = '' }) {
  const item = portraitRecord(name);
  return <SourcePortrait item={item} eager={eager} className={className} alt={`${name} portrait from Hunterpedia`} />;
}

function SourceLinks({ sources }) {
  return <div className="arc-source-links" aria-label="Hunterpedia sources">{sources.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>{item.label}<ExternalLink size={12} /></a>)}</div>;
}

function ArcHero({ arc, medium, setMedium, onOpenCharacters, onOpenWorld }) {
  const lead = portraitRecord(arc.heroPeople[0]);
  return <header className="arc-experience-hero" style={{ '--arc': arc.color, '--arc-accent': arc.accent }}>
    <div className="arc-experience-hero__copy">
      <div className="arc-experience-hero__meta"><span>{arc.order}</span><b>{arc.eyebrow}</b><small>{arc.range}</small></div>
      <h1>{arc.title}</h1>
      <p>{arc.deck}</p>
      <div className="arc-medium-switch" role="group" aria-label="Story medium">
        <button className={medium === 'manga' ? 'is-active' : ''} onClick={() => setMedium('manga')} aria-pressed={medium === 'manga'}>Manga record</button>
        <button className={medium === 'anime' ? 'is-active' : ''} onClick={() => setMedium('anime')} aria-pressed={medium === 'anime'}>2011 anime layer</button>
      </div>
      <p className="arc-medium-note">{medium === 'manga' ? 'Canonical event order and mechanics use the manga as the factual spine.' : 'Episode ranges and adaptation notes are displayed without replacing the manga record.'}</p>
      <div className="arc-experience-hero__actions">
        <button onClick={onOpenCharacters}><Users size={15} /> Open complete character index</button>
        <button onClick={onOpenWorld}><Network size={15} /> Locate this arc in the world</button>
      </div>
    </div>
    <figure className="arc-experience-hero__image">
      {lead.image ? <a href={lead.source} target="_blank" rel="noreferrer"><SafeImage src={lead.image} media={lead.media} eager alt={`${lead.name} portrait from Hunterpedia`} /></a> : <Portrait name={arc.heroPeople[0]} eager />}
      <figcaption><span>Visual lead</span><strong>{arc.heroPeople[0]}</strong><small>Verified Hunterpedia portrait</small></figcaption>
    </figure>
    <div className="arc-experience-hero__cast" aria-label="Principal cast">
      {arc.heroPeople.slice(1).map((name) => <a href={portraitRecord(name).source} target="_blank" rel="noreferrer" key={name}><Portrait name={name} /><span>{name}</span></a>)}
    </div>
    <dl className="arc-experience-metrics">{arc.stats.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </header>;
}

function IndexTabs({ items, active, onChange, label }) {
  return <nav className="arc-index-tabs" aria-label={label}>{items.map(([id, text, Icon], index) => <button className={active === id ? 'is-active' : ''} aria-pressed={active === id} onClick={() => onChange(id)} key={id}><i>{String(index + 1).padStart(2, '0')}</i>{Icon && <Icon size={16} />}<span>{text}</span></button>)}</nav>;
}

function PersonGrid({ people, compact = false }) {
  return <div className={`arc-person-grid${compact ? ' is-compact' : ''}`}>{people.map((item, index) => <article key={`${item.name}-${item.role}-${index}`}>
    <Portrait name={item.name} />
    <div><span>{item.role}</span><h3>{item.name}</h3><p>{item.detail}</p>{item.record && <small>{item.record}</small>}</div>
  </article>)}</div>;
}

function ArcVisualArchive({ arcId }) {
  const archive = arcVisualArchives[arcId];
  const [selectedIndex, setSelectedIndex] = useState(0);
  if (!archive) return null;
  const selected = archive.plates[selectedIndex] || archive.plates[0];
  return <section className="arc-visual-archive" aria-labelledby={`${arcId}-visual-archive-title`}>
    <header><div><span className="section-kicker">Visual explanation archive</span><h2 id={`${arcId}-visual-archive-title`}>{archive.title}</h2></div><p>{archive.note}</p></header>
    <div className="arc-essential-grid">{archive.essentials.map(([title, detail], index) => <article key={title}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
    <div className="arc-visual-workbench">
      <article className="arc-visual-stage" aria-live="polite">
        <figure><div className="arc-visual-stage__fallback" aria-hidden="true"><span>{String(selectedIndex + 1).padStart(2, '0')}</span><strong>{selected.title}</strong></div><SafeImage src={selected.image} fallbackLabel={selected.title} alt={`${selected.title} from Hunterpedia`} /></figure>
        <div><span>{selected.moment} · visual {selectedIndex + 1} of {archive.plates.length}</span><h3>{selected.title}</h3><p>{selected.meaning}</p><a href={selected.source} target="_blank" rel="noreferrer">Open Hunterpedia source <ExternalLink size={11} /></a></div>
      </article>
      <div className="arc-visual-rail" role="listbox" aria-label="Choose a visual explanation">{archive.plates.map((item, index) => <button type="button" role="option" aria-selected={selectedIndex === index} className={selectedIndex === index ? 'is-active' : ''} onClick={() => setSelectedIndex(index)} key={`${item.title}-${index}`}><figure><div aria-hidden="true">{String(index + 1).padStart(2, '0')}</div><SafeImage src={item.image} fallbackLabel={item.title} alt="" /></figure><span><small>{item.moment}</small><strong>{item.title}</strong></span></button>)}</div>
    </div>
  </section>;
}

function HunterExam({ arc }) {
  const [view, setView] = useState('phases');
  const [phaseId, setPhaseId] = useState('first');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const phase = arc.phases.find((item) => item.id === phaseId) || arc.phases[0];
  const applicants = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return arc.applicants.filter((item) => (status === 'all' || item.status === status) && (!needle || `${item.name} ${item.badge} ${item.status} ${item.phase} ${item.method}`.toLowerCase().includes(needle)));
  }, [arc.applicants, query, status]);
  const tabs = [['phases', 'Exam phases', Timer], ['applicants', 'Applicants & badges', Users], ['examiners', 'Examiners', Shield], ['tower', 'Trick Tower', Building2], ['final', 'Final bracket', Swords]];
  return <>
    <IndexTabs items={tabs} active={view} onChange={setView} label="Hunter Exam index" />
    {view === 'phases' && <section className="exam-phase-board">
      <div className="exam-phase-rail">{arc.phases.map((item) => <button className={phase.id === item.id ? 'is-active' : ''} onClick={() => setPhaseId(item.id)} key={item.id}><i>{item.number}</i><span><strong>{item.title}</strong><small>{item.examiner}</small></span></button>)}</div>
      <article className="exam-phase-detail">
        <figure className="exam-phase-detail__visual" data-image-frame><SafeImage src={phase.visual} fallbackLabel={phase.title} alt={`${phase.title} visual record`} /><Portrait name={phase.image} className="exam-phase-detail__lead" /></figure>
        <div><span>Phase {phase.number} · {phase.place}</span><h2>{phase.title}</h2><p>{phase.rule}</p><dl><div><dt>Examiner / master</dt><dd>{phase.examiner}</dd></div><div><dt>Field count</dt><dd>{phase.count}</dd></div><div><dt>Outcome</dt><dd>{phase.result}</dd></div></dl></div>
      </article>
      <aside className="arc-fact-callout"><b>How to read the exam</b><p>The phase number, rule, examiner, participant field, and outcome are stored separately. That keeps a retest, intervention, forfeiture, death, and formal elimination from being mislabeled as the same result.</p></aside>
    </section>}
    {view === 'applicants' && <section className="applicant-ledger">
      <header><div><span className="section-kicker">Badge ledger</span><h2>Named applicants, phase reached, and result</h2></div><p>The full 644-character encyclopedia remains separate; this view is scoped to the exam and prioritizes known badge numbers and outcomes.</p></header>
      <div className="applicant-ledger__toolbar"><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, badge, phase, result…" /></label><div><Filter size={14} />{['all', 'Licensed', 'Eliminated', 'Disqualified', 'Deceased'].map((item) => <button className={status === item ? 'is-active' : ''} onClick={() => setStatus(item)} key={item}>{item}</button>)}</div><span>{applicants.length} records shown</span></div>
      <div className="applicant-ledger__table" role="region" aria-label="Hunter Exam applicant results" tabIndex="0"><table><thead><tr><th>Badge</th><th>Applicant</th><th>Reached</th><th>Status</th><th>How the result occurs</th></tr></thead><tbody>{applicants.map((item, index) => <tr key={`${item.name}-${index}`}><td><b className="exam-badge">#{item.badge}</b></td><td><span className="table-person"><Portrait name={item.name} /><strong>{item.name}</strong></span></td><td>{item.phase}</td><td><span className={`status-pill is-${item.status.toLowerCase()}`}>{item.status}</span></td><td>{item.method}</td></tr>)}</tbody></table></div>
    </section>}
    {view === 'examiners' && <section className="arc-panel-section"><header><span className="section-kicker">Masters of each test</span><h2>Examiners and administrators</h2><p>Portrait, responsibility, intended skill, intervention, and outcome belong together.</p></header><PersonGrid people={arc.examiners} /></section>}
    {view === 'tower' && <section className="tower-case"><header><div><span>72 hours · 40 applicants enter · 24 finish</span><h2>The Path of Majority Rules</h2></div><p>Five applicants share one route, one clock, and collective decisions. Winning fights is only part of the test; time and cooperation are the real shared resource.</p></header><div className="tower-match-ledger">{arc.towerMatches.map(([applicant, prisoner, type, result], index) => <article key={applicant}><i>{String(index + 1).padStart(2, '0')}</i><div className="tower-match-ledger__portraits"><Portrait name={applicant} /><b>VS</b><Portrait name={prisoner} /></div><div><span>{type}</span><h3>{applicant} <small>vs.</small> {prisoner}</h3><p>{result}</p></div></article>)}</div><div className="tower-decision"><strong>Final fork</strong><span>Everyone / 45 hours</span><ArrowRight size={18} /><span>Three people / 3 minutes</span><p>Gon rejects the forced sacrifice and creates a third practical outcome by breaking through the wall between paths.</p></div></section>}
    {view === 'final' && <section className="final-bracket"><header><div><span className="section-kicker">Pass-oriented tournament</span><h2>One intended failure—not one winner</h2></div><p>Every concession moves that applicant out of danger. The bracket ends early when Killua kills Bodoro and is disqualified.</p></header><ol>{arc.finalMatches.map(([left, right, result], index) => <li key={`${left}-${right}`}><i>{String(index + 1).padStart(2, '0')}</i><div className="final-bracket__match"><span><Portrait name={left.replace('Gittarackur / ', '')} /><strong>{left}</strong></span><b>vs.</b><span><Portrait name={right.replace('Gittarackur / ', '')} /><strong>{right}</strong></span></div><p>{result}</p>{/interrupted|disqualification/i.test(result) ? <XCircle size={18} /> : <CheckCircle2 size={18} />}</li>)}</ol></section>}
  </>;
}

function HeavensArena({ arc, onOpenNen }) {
  const [view, setView] = useState('tower');
  const [floor, setFloor] = useState(arc.floorBands[4][0]);
  const floorRecord = arc.floorBands.find((item) => item[0] === floor) || arc.floorBands[0];
  const tabs = [['tower', 'Tower explorer', Building2], ['rules', 'Rulebook', BookOpen], ['fighters', 'Fighters', Users], ['matches', 'Match ledger', Swords], ['nen', 'Nen curriculum', Network]];
  return <>
    <IndexTabs items={tabs} active={view} onChange={setView} label="Heavens Arena index" />
    {view === 'tower' && <section className="arena-tower">
      <div className="arena-tower__shaft"><span className="arena-tower__cap">251</span>{[...arc.floorBands].reverse().map(([number, title]) => <button className={floor === number ? 'is-active' : ''} onClick={() => setFloor(number)} key={number}><b>{number}</b><small>{title}</small></button>)}<span className="arena-tower__base">GROUND</span></div>
      <article><span>Selected building band</span><h2>Floor {floorRecord[0]}</h2><h3>{floorRecord[1]}</h3><p>{floorRecord[2]}</p><dl><div><dt>Building count</dt><dd>One main tower</dd></div><div><dt>Total floors</dt><dd>251</dd></div><div><dt>Highest competitive band</dt><dd>Floor Masters · 230–250</dd></div></dl></article>
    </section>}
    {view === 'rules' && <section className="arena-rulebook"><header><span className="section-kicker">Competitor manual</span><h2>Rules change as the elevator rises</h2></header><ol>{arc.rules.map(([name, detail], index) => <li key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>}
    {view === 'fighters' && <section className="arc-panel-section"><header><span className="section-kicker">People in the tower</span><h2>Fighters, students, and teachers</h2></header><PersonGrid people={arc.fighters} /></section>}
    {view === 'matches' && <section className="match-report-list"><header><span className="section-kicker">Fight ledger</span><h2>Rules, turning points, and result</h2></header>{arc.matches.map(([name, type, result], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><span>{type}</span><h3>{name}</h3><p>{result}</p></div><Swords size={19} /></article>)}</section>}
    {view === 'nen' && <section className="arena-nen-curriculum"><header><div><span className="section-kicker">Nen concept diagrams</span><h2>Wing’s visual learning sequence</h2></div><button onClick={onOpenNen}>Open the complete Nen image desk <ArrowRight size={14} /></button></header><div>{arc.lessons.map(([number, name, description]) => <article key={name}><figure className="nen-concept-visual" data-concept={name} role="img" aria-label={`${name} Nen concept diagram`}><i /><b>{name}</b><small>Aura principle</small></figure><span>{number}</span><h3>{name}</h3><p>{description}</p></article>)}</div><aside>These local diagrams represent the Nen rule itself rather than substituting a character portrait. The complete Nen desk keeps the sourced Hunterpedia examples beside the explanation.</aside></section>}
  </>;
}

function Yorknew({ arc }) {
  const [view, setView] = useState('calendar');
  const tabs = [['calendar', 'September calendar', CalendarDays], ['factions', 'Faction board', Network], ['auctions', 'Auction catalogue', BookOpen], ['events', 'Crime & fight files', Swords]];
  return <>
    <IndexTabs items={tabs} active={view} onChange={setView} label="Yorknew City index" />
    {view === 'calendar' && <section className="yorknew-calendar"><header><div><span className="section-kicker">September 1–10</span><h2>Ten days, one changing information war</h2></div><p>Exact dates are used where the source supports them; intervening blocks preserve sequence without inventing timestamps.</p></header><div className="arc-phase-visual-strip">{arcVisualArchives['yorknew-city'].plates.map((plate, index) => <figure key={plate.title}><SafeImage src={plate.image} fallbackLabel={plate.title} alt={`${plate.title} visual`} /><figcaption><small>{plate.moment}</small><strong>{plate.title}</strong></figcaption></figure>)}</div><ol>{arc.calendar.map(([day, event], index) => <li key={day}><i>{String(index + 1).padStart(2, '0')}</i><time>{day}</time><p>{event}</p></li>)}</ol></section>}
    {view === 'factions' && <section className="yorknew-factions"><header><span className="section-kicker">Authority and underworld</span><h2>Who wants what—and what they know</h2></header><div>{arc.factions.map(([name, role, detail], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><span>{role}</span><h3>{name}</h3><p>{detail}</p></article>)}</div><aside><b>Mafia continuity</b><p>Yorknew’s Mafia Community and Ten Dons are indexed separately from Kakin’s Xi-Yu, Cha-R, and Heil-Ly families. The organizations archive connects them historically without flattening them into one group.</p></aside></section>}
    {view === 'auctions' && <section className="auction-catalogue"><header><span className="section-kicker">Lots, markets, and deception</span><h2>Two auction systems</h2></header>{arc.auctions.map(([name, kind, detail], index) => <article key={name}><i>LOT {String(index + 1).padStart(2, '0')}</i><span>{kind}</span><h3>{name}</h3><p>{detail}</p></article>)}</section>}
    {view === 'events' && <section className="case-file-grid"><header><span className="section-kicker">Operational record</span><h2>Massacre, contracts, captures, and exchange</h2></header><div>{arc.events.map(([name, type, detail], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><span>{type}</span><h3>{name}</h3><p>{detail}</p></article>)}</div></section>}
  </>;
}

function GreedIsland({ arc }) {
  const [view, setView] = useState('manual');
  const tabs = [['manual', 'Game manual', Gamepad2], ['cards', 'Card binder', BookOpen], ['players', 'Players', Users], ['quests', 'Quest log', Network], ['matches', 'Dodgeball & Bombers', Swords]];
  return <>
    <IndexTabs items={tabs} active={view} onChange={setView} label="Greed Island index" />
    {view === 'manual' && <section className="greed-manual"><header><div><span>G · R · E · E · D · I · S · L · A · N · D</span><h2>Player field manual</h2></div><Gamepad2 size={42} /></header><ol>{arc.rules.map(([name, detail], index) => <li key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>}
    {view === 'cards' && <section className="greed-card-binder"><header><div><span className="section-kicker">Specified slots and spell layer</span><h2>Card-system index</h2></div><p>The complete source directory remains linked below. This curated binder prioritizes the cards that change the arc’s routes, healing, completion, and final destination.</p></header><div>{arc.cardHighlights.map(([number, name, kind, detail]) => <article key={`${number}-${name}`}><i>{number}</i><span>{kind}</span><h3>{name}</h3><p>{detail}</p></article>)}</div></section>}
    {view === 'players' && <section className="arc-panel-section"><header><span className="section-kicker">Parties and roles</span><h2>Players, Bombers, and Game Masters</h2></header><PersonGrid people={arc.players} /></section>}
    {view === 'quests' && <section className="greed-quest-log"><header><span className="section-kicker">Progression route</span><h2>From entry to the final quiz</h2></header><ol>{arc.quests.map(([name, detail], index) => <li key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>}
    {view === 'matches' && <section className="match-report-list"><header><span className="section-kicker">Tactical records</span><h2>Dodgeball and the three-part Bomber plan</h2></header>{arc.matches.map(([name, type, result], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><span>{type}</span><h3>{name}</h3><p>{result}</p></div><Swords size={19} /></article>)}</section>}
  </>;
}

function ChimeraAnt({ arc }) {
  const [view, setView] = useState('stages');
  const tabs = [['stages', 'Crisis stages', Timer], ['hierarchy', 'Species hierarchy', Network], ['operation', 'Palace operation', Shield], ['forces', 'People & forces', Users], ['conflicts', 'Conflict files', Swords]];
  return <>
    <IndexTabs items={tabs} active={view} onChange={setView} label="Chimera Ant index" />
    {view === 'stages' && <section className="chimera-stages"><header><div><span className="section-kicker">Nine operational movements</span><h2>The arc is a sequence of changing systems</h2></div><p>Colony growth, political capture, training, invasion, and poison need different visual scales.</p></header><ol>{arc.stages.map(([number, name, detail, personName], index) => <li key={number}><figure data-image-frame><SafeImage src={arcVisualArchives['chimera-ant'].plates[index]?.image} fallbackLabel={name} alt={`${name} visual record`} /><Portrait name={personName} /></figure><i>{number}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>}
    {view === 'hierarchy' && <section className="chimera-hierarchy"><header><span className="section-kicker">Biology and command</span><h2>Queen → King → Guards → squadrons</h2></header><div>{arc.hierarchy.map(([rank, examples, detail], index) => <article key={rank}><i>{String(index + 1).padStart(2, '0')}</i><span>{examples}</span><h3>{rank}</h3><p>{detail}</p></article>)}</div></section>}
    {view === 'operation' && <section className="palace-operation"><header><div><span className="section-kicker">Concurrent event lanes</span><h2>The palace invasion clock</h2></div><p>Only the opening is given a zero point here. Later blocks preserve verified sequence rather than inventing second counts.</p></header><ol>{arc.operations.map(([time, event], index) => <li key={time}><time>{time}</time><i /><div><span>Operation block {String(index + 1).padStart(2, '0')}</span><p>{event}</p></div></li>)}</ol></section>}
    {view === 'forces' && <section className="arc-panel-section"><header><span className="section-kicker">Command, loyalty, and change</span><h2>People on every front</h2></header><PersonGrid people={arc.forces} /></section>}
    {view === 'conflicts' && <section className="case-file-grid"><header><span className="section-kicker">Combat and nonviolent contests</span><h2>What every confrontation changes</h2></header><div>{arc.conflicts.map(([name, detail], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><span>Conflict record</span><h3>{name}</h3><p>{detail}</p></article>)}</div></section>}
  </>;
}

function Election({ arc }) {
  const [view, setView] = useState('parallel');
  const tabs = [['parallel', 'Parallel timeline', Timer], ['rules', 'Ballot rules', BookOpen], ['candidates', 'Candidates', Users], ['rounds', 'Round ledger', CheckCircle2], ['rescue', 'Alluka rescue', Network]];
  return <>
    <IndexTabs items={tabs} active={view} onChange={setView} label="Chairman Election index" />
    {view === 'parallel' && <section className="chimera-stages election-stages"><header><div><span className="section-kicker">2011 anime conclusion</span><h2>Ballots outside, rescue inside</h2></div><p>The public Association contest and Killua’s private family mission run as parallel timelines.</p></header><ol>{arc.stages.map(([number, name, detail, personName], index) => <li key={number}><figure data-image-frame><SafeImage src={arcVisualArchives['chairman-election'].plates[index]?.image} fallbackLabel={name} alt={`${name} visual record`} /><Portrait name={personName} /></figure><i>{number}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>}
    {view === 'rules' && <section className="arena-rulebook election-rulebook"><header><span className="section-kicker">Election procedure</span><h2>Why one lead cannot end the vote</h2></header><ol>{arc.ballotRules.map(([name, detail], index) => <li key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{name}</h3><p>{detail}</p></div></li>)}</ol></section>}
    {view === 'candidates' && <section className="arc-panel-section"><header><span className="section-kicker">Power, reform, sincerity, and play</span><h2>Five candidate profiles that explain the field</h2></header><PersonGrid people={arc.candidates} /></section>}
    {view === 'rounds' && <section className="election-round-ledger"><header><span className="section-kicker">Compressed round logic</span><h2>From the first count to Pariston’s resignation</h2><p>This is a procedural overview rather than a replacement for the full vote tables in Hunterpedia.</p></header><ol>{arc.ballotRounds.map(([round, detail], index) => <li key={round}><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{round}</strong><p>{detail}</p></span></li>)}</ol></section>}
    {view === 'rescue' && <section className="election-rescue-route"><header><span className="section-kicker">Family-control route</span><h2>Alluka and Nanika are not a shortcut to healing</h2><p>The rescue is a contest over personhood, rules, surveillance, and who gets to define Nanika.</p></header><div>{arc.rescueRoute.map(([place, detail], index) => <article key={place}><i>{String(index + 1).padStart(2, '0')}</i><h3>{place}</h3><p>{detail}</p></article>)}</div></section>}
  </>;
}

export default function PreSuccessionExperience({ arcId, onNavigate }) {
  const arc = preSuccessionExperienceById.get(arcId) || preSuccessionExperiences[0];
  const [medium, setMedium] = useState('manga');
  return <section className="pre-arc-experience" data-arc={arc.id} style={{ '--arc': arc.color, '--arc-accent': arc.accent }}>
    <nav className="pre-arc-shelf" aria-label="Pre-Succession arcs">{preSuccessionExperiences.map((item) => <button className={item.id === arc.id ? 'is-active' : ''} onClick={() => onNavigate('series', item.id)} key={item.id}><i>{item.order}</i><span>{item.title}</span></button>)}</nav>
    <ArcHero arc={arc} medium={medium} setMedium={setMedium} onOpenCharacters={() => onNavigate('reference', 'encyclopedia', { category: 'characters', search: arc.title })} onOpenWorld={() => onNavigate('reference', 'atlas', { mode: 'journey', route: 'pre-journey' })} />
    <div className="pre-arc-experience__body">
      {arc.id === 'hunter-exam' && <HunterExam arc={arc} />}
      {arc.id === 'heavens-arena' && <HeavensArena arc={arc} onOpenNen={() => onNavigate('reference', 'nen', { search: 'Ten' })} />}
      {arc.id === 'yorknew-city' && <Yorknew arc={arc} />}
      {arc.id === 'greed-island' && <GreedIsland arc={arc} />}
      {arc.id === 'chimera-ant' && <ChimeraAnt arc={arc} />}
      {arc.id === 'chairman-election' && <Election arc={arc} />}
      <ArcVisualArchive arcId={arc.id} />
      <footer className="arc-experience-footer"><div><span className="section-kicker">Source boundary</span><h2>Hunterpedia is the factual and image source.</h2><p>The manga record remains primary. The 2011 anime layer is identified as an adaptation, and uncertain timing or geography stays explicitly uncertain.</p></div><SourceLinks sources={arc.sources} /></footer>
    </div>
  </section>;
}
