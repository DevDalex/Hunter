import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Clock3,
  ExternalLink,
  Filter,
  Flag,
  MapPinned,
  Search,
  ShieldCheck,
  Skull,
  Target,
  Trophy,
  Users,
  Utensils,
} from 'lucide-react';
import { chapters } from '../data/chapters';
import {
  finalInterviews,
  finalMatches,
  finalOutcomes,
  hunterExamAdaptation,
  hunterExamArtwork,
  hunterExamFunnel,
  hunterExamHosts,
  hunterExamJourneys,
  hunterExamObjects,
  hunterExamPhases,
  hunterExamPreliminary,
  hunterExamRoute,
  hunterExamRules,
  hunterExamSources,
  hunterExamSummary,
  phaseFourApplicants,
  trickTowerMatches,
} from '../data/hunterExam';
import SafeImage from './SafeImage';
import './HunterExamPage.css';

const localNavigation = [
  ['overview', 'Overview'],
  ['route', 'Route'],
  ['phase-one', 'Phase One'],
  ['phase-two', 'Phase Two'],
  ['phase-three', 'Phase Three'],
  ['phase-four', 'Phase Four'],
  ['final-phase', 'Final Phase'],
  ['applicants', 'Applicants'],
  ['examiners', 'Examiners'],
  ['outcomes', 'Outcomes'],
  ['adaptation', 'Adaptation'],
  ['sources', 'Sources'],
];

const statusClass = (value = '') => value.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

function SectionHeading({ number, kicker, title, children }) {
  return <header className="he-section-heading">
    <i>{String(number).padStart(2, '0')}</i>
    <div><span>{kicker}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>
  </header>;
}

function HunterExamHero({ onNavigate }) {
  return <header className="he-hero" id="overview">
    <div className="he-hero__art" aria-hidden="true">
      <SafeImage src={hunterExamArtwork.hero.src} fallbackSrc={hunterExamArtwork.hero.fallback} alt="" eager priority="high" />
      <div />
    </div>
    <nav className="he-route-nav" aria-label="Hunter Exam route navigation">
      <button type="button" onClick={() => onNavigate('series', 'volume-0')}><ArrowLeft size={15} /> Volume 0</button>
      <button type="button" onClick={() => onNavigate('series')}>All arcs</button>
      <button type="button" onClick={() => onNavigate('series', 'zoldyck-family')}>Zoldyck Family <ArrowRight size={15} /></button>
    </nav>
    <div className="he-hero__copy">
      <span>Story 01 · 287th Hunter Examination</span>
      <h1>Hunter<br />Exam</h1>
      <p>An examination whose rules change without warning, testing endurance, judgment, desire, adaptability, and the effect each applicant has on others.</p>
      <dl>
        <div><dt>Gathered</dt><dd>{hunterExamSummary.gathered}</dd></div>
        <div><dt>Formal phases</dt><dd>{hunterExamSummary.phases}</dd></div>
        <div><dt>Finalists</dt><dd>{hunterExamSummary.finalists}</dd></div>
        <div><dt>Licensed</dt><dd>{hunterExamSummary.licensed}</dd></div>
        <div><dt>Disqualified</dt><dd>{hunterExamSummary.disqualified}</dd></div>
      </dl>
      <div className="he-hero__actions"><a href="#route"><MapPinned size={16} /> Open course</a><a href="#applicants"><Users size={16} /> Applicant registry</a></div>
    </div>
    <a className="he-hero__source" href={hunterExamArtwork.hero.source} target="_blank" rel="noreferrer noopener">Artwork source <ExternalLink size={12} /></a>
  </header>;
}

function PopulationFunnel() {
  const [activeId, setActiveId] = useState(hunterExamFunnel[0].id);
  const active = hunterExamFunnel.find((item) => item.id === activeId) || hunterExamFunnel[0];
  return <section className="he-section he-funnel" aria-labelledby="he-funnel-title">
    <SectionHeading number={1} kicker="Numbers at a glance" title="405 gather. Seven leave with licenses.">
      Reductions are labelled as phase attrition. They are not automatically formal disqualifications.
    </SectionHeading>
    <div className="he-funnel__layout">
      <ol id="he-funnel-title">{hunterExamFunnel.map((item, index) => <li key={item.id}>
        <button type="button" className={active.id === item.id ? 'is-active' : ''} onClick={() => setActiveId(item.id)} aria-pressed={active.id === item.id}>
          <i>{String(index + 1).padStart(2, '0')}</i><strong>{item.count}</strong><span>{item.label}</span>{item.reduction > 0 && <small>−{item.reduction}</small>}
        </button>
      </li>)}</ol>
      <aside><span>Selected checkpoint</span><strong>{active.count} · {active.label}</strong><p>{active.note}</p></aside>
    </div>
  </section>;
}

function ExamRoute() {
  return <section id="route" className="he-section he-route" aria-labelledby="he-route-title">
    <SectionHeading number={2} kicker="Complete examination course" title="The tests begin before the advertised exam site.">
      Preliminary scouts control access; the five formal phases begin only after candidate numbers are assigned.
    </SectionHeading>
    <ol id="he-route-title">{hunterExamRoute.map(([place, note], index) => <li key={place}>
      <i>{String(index + 1).padStart(2, '0')}</i><div><strong>{place}</strong><p>{note}</p></div>
    </li>)}</ol>
    <div className="he-preliminary-grid">{hunterExamPreliminary.map((item) => <article key={item.host}>
      <span>{item.type}</span><h3>{item.host}</h3><dl><div><dt>Test</dt><dd>{item.test}</dd></div><div><dt>Result</dt><dd>{item.result}</dd></div></dl><a href={item.source} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={11} /></a>
    </article>)}</div>
  </section>;
}

function PhaseNumbers({ phase }) {
  return <dl className="he-phase__numbers"><div><dt>Entered</dt><dd>{phase.entered}</dd></div><div><dt>Passed</dt><dd>{phase.passed}</dd></div><div><dt>Removed</dt><dd>{phase.removed}</dd></div><div><dt>Duration</dt><dd>{phase.duration}</dd></div></dl>;
}

function StandardPhase({ phase, sectionNumber }) {
  return <section id={phase.id} className={`he-section he-phase he-phase--${phase.id}`} aria-labelledby={`${phase.id}-title`}>
    <header className="he-phase__header"><i>{phase.number}</i><div><span>{phase.examiner}</span><h2 id={`${phase.id}-title`}>{phase.title}</h2><p>{phase.location}</p></div><a href={phase.source} target="_blank" rel="noreferrer noopener">Phase source <ExternalLink size={11} /></a></header>
    <PhaseNumbers phase={phase} />
    <div className="he-phase__body">
      <div className="he-phase__events">{phase.events.map(([title, note], index) => <article key={title}><i>{String(index + 1).padStart(2, '0')}</i><h3>{title}</h3><p>{note}</p></article>)}</div>
      <aside><span>Announced rules</span><ol>{phase.rules.map((rule) => <li key={rule}>{rule}</li>)}</ol><small>Section {String(sectionNumber).padStart(2, '0')}</small></aside>
    </div>
  </section>;
}

function TrickTower() {
  const phase = hunterExamPhases[2];
  return <section id="phase-three" className="he-section he-phase he-trick" aria-labelledby="phase-three-title">
    <header className="he-phase__header"><i>{phase.number}</i><div><span>{phase.examiner}</span><h2 id="phase-three-title">{phase.title}</h2><p>{phase.location}</p></div><a href={phase.source} target="_blank" rel="noreferrer noopener">Phase source <ExternalLink size={11} /></a></header>
    <PhaseNumbers phase={phase} />
    <div className="he-tower-route"><span>Roof</span><i>One-use trapdoor</i><span>Majority Rules</span><i>Prisoner arena</i><span>Time penalty</span><i>Wall-breaking solution</i><span>Exit</span></div>
    <div className="he-prisoner-board">{trickTowerMatches.map((match, index) => <article key={match.applicant}>
      <i>{String(index + 1).padStart(2, '0')}</i><div><span>{match.test}</span><h3>{match.applicant} vs {match.prisoner}</h3><p><b>Result:</b> {match.result}</p><small>{match.effect}</small></div>
    </article>)}</div>
  </section>;
}

function BadgeMatrix() {
  const [selectedBadge, setSelectedBadge] = useState(405);
  const selected = phaseFourApplicants.find((item) => item.badge === selectedBadge) || phaseFourApplicants[0];
  const phase = hunterExamPhases[3];
  return <section id="phase-four" className="he-section he-phase he-badge-section" aria-labelledby="phase-four-title">
    <header className="he-phase__header"><i>{phase.number}</i><div><span>{phase.examiner}</span><h2 id="phase-four-title">{phase.title}</h2><p>{phase.location}</p></div><a href={phase.source} target="_blank" rel="noreferrer noopener">Phase source <ExternalLink size={11} /></a></header>
    <PhaseNumbers phase={phase} />
    <div className="he-points"><article><b>3</b><span>Own badge</span></article><article><b>3</b><span>Assigned target</span></article><article><b>1</b><span>Any other badge</span></article><article><b>6</b><span>Points required</span></article></div>
    <div className="he-badge-matrix">
      <div className="he-badge-matrix__grid" role="list" aria-label="Twenty-four Zevil Island participants">{phaseFourApplicants.map((item) => <button type="button" className={`${selected.badge === item.badge ? 'is-active' : ''} is-${statusClass(item.result)}`} onClick={() => setSelectedBadge(item.badge)} aria-pressed={selected.badge === item.badge} key={item.badge}><i>#{item.badge}</i><strong>{item.name}</strong><span>{item.result}</span><small>{item.points} pts</small></button>)}</div>
      <aside><span>Applicant #{selected.badge}</span><h3>{selected.name}</h3><dl><div><dt>Assigned target</dt><dd>{selected.target}</dd></div><div><dt>Final points</dt><dd>{selected.points}</dd></div><div><dt>Badges recorded</dt><dd>{selected.badges}</dd></div><div><dt>Outcome</dt><dd>{selected.status}</dd></div></dl></aside>
    </div>
  </section>;
}

function FinalPhase() {
  const phase = hunterExamPhases[4];
  return <section id="final-phase" className="he-section he-phase he-final" aria-labelledby="final-phase-title">
    <header className="he-phase__header"><i>{phase.number}</i><div><span>{phase.examiner}</span><h2 id="final-phase-title">{phase.title}</h2><p>{phase.location}</p></div><a href={phase.source} target="_blank" rel="noreferrer noopener">Phase source <ExternalLink size={11} /></a></header>
    <PhaseNumbers phase={phase} />
    <div className="he-final__explanation"><Trophy size={28} /><div><h3>One victory means passing.</h3><p>Winners leave the bracket. Losers continue downward and receive another chance. Killing causes automatic disqualification.</p></div></div>
    <ol className="he-final__matches">{finalMatches.map((match) => <li key={match.order}><i>{String(match.order).padStart(2, '0')}</i><div><span>{match.outcome}</span><h3>{match.participants}</h3><p>{match.method}</p></div></li>)}</ol>
    <details className="he-interviews"><summary>Netero’s finalist interviews</summary><div>{finalInterviews.map((item) => <article key={item.badge}><i>#{item.badge}</i><h3>{item.name}</h3><p><b>Interested in:</b> {item.interests}</p><p><b>Avoid:</b> {item.avoids}</p></article>)}</div></details>
    <div className="he-final__outcomes">{finalOutcomes.map((item) => <article className={`is-${statusClass(item.status)}`} key={item.status}><span>{item.status}</span><strong>{item.count}</strong><p>{item.people.join(' · ')}</p></article>)}</div>
  </section>;
}

function ApplicantRegistry() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return phaseFourApplicants.filter((item) => (filter === 'all' || statusClass(item.result) === filter) && (!normalized || `${item.badge} ${item.name} ${item.target} ${item.status}`.toLowerCase().includes(normalized)));
  }, [filter, query]);
  return <section id="applicants" className="he-section he-applicants" aria-labelledby="he-applicants-title">
    <SectionHeading number={8} kicker="Complete documented roster" title="Twenty-four applicants reach Zevil Island.">
      The page records every named Phase Four participant. It does not fabricate identities for hundreds of anonymous earlier candidates.
    </SectionHeading>
    <div className="he-applicant-toolbar">
      <label><Search size={16} /><span className="sr-only">Search applicants</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Badge, applicant, target…" /></label>
      <div><Filter size={15} />{[['all','All'],['passed','Passed'],['failed','Failed'],['died','Died']].map(([value, label]) => <button type="button" className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div>
    </div>
    <div className="he-applicant-table" role="region" aria-label="Hunter Exam participant registry" tabIndex="0"><table><thead><tr><th>Badge</th><th>Applicant</th><th>Target</th><th>Points</th><th>Phase Four</th><th>Final status</th></tr></thead><tbody>{visible.map((item) => <tr key={item.badge}><td><b>#{item.badge}</b></td><td><strong>{item.name}</strong></td><td>{item.target}</td><td>{item.points}</td><td><span className={`he-status is-${statusClass(item.result)}`}>{item.result}</span></td><td>{item.status}</td></tr>)}</tbody></table></div>
    <div className="he-journeys">{hunterExamJourneys.map(([name, journey]) => <article key={name}><h3>{name}</h3><p>{journey}</p></article>)}</div>
  </section>;
}

function ExaminerBoard() {
  return <section id="examiners" className="he-section he-examiners" aria-labelledby="he-examiners-title">
    <SectionHeading number={9} kicker="Examiners, hosts, and support" title="Authority changes with every level.">
      Official examiners, preliminary scouts, administrative support, and temporary opponents are labelled separately.
    </SectionHeading>
    <div id="he-examiners-title">{hunterExamHosts.map((item, index) => <article key={item.stage}><i>{String(index + 1).padStart(2, '0')}</i><div><span>{item.stage}</span><h3>{item.people}</h3><p>{item.role}</p></div><a href={item.source} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={11} /></a></article>)}</div>
  </section>;
}

function OutcomesAndRules() {
  return <section id="outcomes" className="he-section he-outcomes" aria-labelledby="he-outcomes-title">
    <SectionHeading number={10} kicker="Outcome terminology" title="Failure is not the same as disqualification.">
      The 287th Exam has one explicit final disqualification: Killua after killing Bodoro.
    </SectionHeading>
    <div className="he-rule-grid" id="he-outcomes-title">{hunterExamRules.map(([label, note]) => <article className={`is-${statusClass(label)}`} key={label}><span>{label}</span><p>{note}</p></article>)}</div>
    <div className="he-object-ledger">{hunterExamObjects.map(([name, note], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><div><h3>{name}</h3><p>{note}</p></div></article>)}</div>
    <aside className="he-nen-note"><ShieldCheck size={23} /><div><span>Power-system foreshadowing</span><h3>Nen is not formally taught during this page.</h3><p>Hisoka’s intimidation, Illumi’s disguise and conditioning, Killua’s assassination methods, Netero’s speed, and examiner-level ability appear extraordinary because their shared system is explained later in Heavens Arena.</p></div></aside>
  </section>;
}

function AdaptationAndRecords({ onNavigate }) {
  const records = chapters.filter((chapter) => chapter.number >= 1 && chapter.number <= 38);
  return <section id="adaptation" className="he-section he-adaptation" aria-labelledby="he-adaptation-title">
    <SectionHeading number={11} kicker="Manga and 2011 anime" title="The examination record ends before the Zoldyck rescue.">
      Official arc boundaries are preserved in the source notes, while this page stays focused on the 287th examination itself.
    </SectionHeading>
    <div className="he-adaptation__grid" id="he-adaptation-title">{hunterExamAdaptation.map(([title, note]) => <article key={title}><span>{title}</span><p>{note}</p></article>)}</div>
    <div className="he-record-summary"><BookOpen size={20} /><div><strong>{records.length} numbered manga chapters</strong><span>Chapters 1–38 · 2011 Episodes 1–21</span></div><button type="button" onClick={() => onNavigate('series', 'chapters', { arc: 'hunter-exam' })}>Open chapter directory <ArrowRight size={14} /></button></div>
  </section>;
}

function Sources() {
  return <section id="sources" className="he-section he-sources" aria-labelledby="he-sources-title">
    <SectionHeading number={12} kicker="Hunterpedia / Fandom" title="Sources attached directly to the examination record." />
    <div id="he-sources-title">{hunterExamSources.map((source) => <a href={source.href} target="_blank" rel="noreferrer noopener" key={source.href}><BookOpen size={17} /><span><strong>{source.label}</strong><small>{source.note}</small></span><ExternalLink size={13} /></a>)}</div>
  </section>;
}

export default function HunterExamPage({ onNavigate }) {
  return <article className="hunter-exam-page">
    <HunterExamHero onNavigate={onNavigate} />
    <nav className="he-local-nav" aria-label="Hunter Exam page sections"><div>{localNavigation.map(([id, label], index) => <a href={`#${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></a>)}</div></nav>
    <main className="he-canvas">
      <PopulationFunnel />
      <ExamRoute />
      <StandardPhase phase={hunterExamPhases[0]} sectionNumber={3} />
      <StandardPhase phase={hunterExamPhases[1]} sectionNumber={4} />
      <TrickTower />
      <BadgeMatrix />
      <FinalPhase />
      <ApplicantRegistry />
      <ExaminerBoard />
      <OutcomesAndRules />
      <AdaptationAndRecords onNavigate={onNavigate} />
      <Sources />
    </main>
    <footer className="he-next-page"><div><Flag size={22} /><span>Story 02</span><h2>Zoldyck Family</h2><p>The licensed applicants turn immediately toward Killua and the family system that pulled him away.</p></div><button type="button" onClick={() => onNavigate('series', 'zoldyck-family')}>Continue <ArrowRight size={18} /></button></footer>
  </article>;
}
