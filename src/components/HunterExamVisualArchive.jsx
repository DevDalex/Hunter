import { useMemo, useState } from 'react';
import {
  BookMarked,
  Box,
  ExternalLink,
  GitBranch,
  Image as ImageIcon,
  MapPinned,
  Network,
  Route,
  Swords,
  Users,
} from 'lucide-react';
import { finalInterviews, finalMatches, phaseFourApplicants } from '../data/hunterExam';
import {
  earlyApplicantRecords,
  hunterExamAttrition,
  hunterExamChapterMap,
  hunterExamConflicts,
  hunterExamGallery,
  hunterExamHostPortraits,
  hunterExamLocations,
  hunterExamObjectsVisual,
  hunterExamPhaseVisuals,
  hunterExamProgression,
  portraitForBadge,
  trickTowerPrisoners,
} from '../data/hunterExamVisuals';
import SafeImage from './SafeImage';
import './HunterExamVisualArchive.css';

const slug = (value = '') => value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const targetBadgeFrom = (target = '') => Number(target.match(/^\d+/)?.[0] || 0);

function ArchiveHeading({ icon: Icon, kicker, title, children }) {
  return <header className="hev-heading">
    <Icon size={22} />
    <div><span>{kicker}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>
  </header>;
}

function Visual({ record, className = '' }) {
  return <figure className={`hev-visual ${className}`}>
    <SafeImage src={record.image} alt={record.alt || record.name || record.title} fallbackLabel={record.name || record.title || 'Hunter Exam visual'} />
    <figcaption>
      <span>{record.stage || record.group || record.phase}</span>
      <strong>{record.name || record.title}</strong>
      {(record.chapters || record.record) && <small>{record.chapters ? `${record.chapters} · ${record.episodes}` : record.record}</small>}
      <a href={record.source} target="_blank" rel="noreferrer noopener" aria-label={`Open source for ${record.name || record.title}`}><ExternalLink size={12} /></a>
    </figcaption>
  </figure>;
}

function LocationAtlas() {
  const [selectedId, setSelectedId] = useState(hunterExamLocations[0].id);
  const selected = hunterExamLocations.find((item) => item.id === selectedId) || hunterExamLocations[0];
  return <section className="he-section hev-section hev-locations" id="locations" aria-labelledby="hev-locations-title">
    <ArchiveHeading icon={MapPinned} kicker="Illustrated route atlas" title="Every major location now has its own record.">
      Select a stop to inspect its image, purpose, population checkpoint, travel method, events, and source range.
    </ArchiveHeading>
    <div className="hev-location-layout">
      <div className="hev-location-grid" aria-label="Hunter Exam locations">
        {hunterExamLocations.map((item, index) => <button type="button" className={selected.id === item.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)} aria-pressed={selected.id === item.id} key={item.id}>
          <SafeImage src={item.image} alt="" fallbackLabel={item.name} />
          <i>{String(index + 1).padStart(2, '0')}</i><span>{item.stage}</span><strong>{item.name}</strong>
        </button>)}
      </div>
      <article className="hev-location-focus" id="hev-locations-title">
        <Visual record={selected} className="is-featured" />
        <div className="hev-location-focus__copy">
          <span>{selected.phase}</span><h3>{selected.name}</h3><p>{selected.purpose}</p>
          <dl>
            <div><dt>Population</dt><dd>{selected.population}</dd></div>
            <div><dt>Travel</dt><dd>{selected.travel}</dd></div>
            <div><dt>Manga</dt><dd>{selected.chapters}</dd></div>
            <div><dt>2011 anime</dt><dd>{selected.episodes}</dd></div>
          </dl>
          <ol>{selected.events.map((event) => <li key={event}>{event}</li>)}</ol>
        </div>
      </article>
    </div>
  </section>;
}

function PhasePictureBook() {
  return <section className="he-section hev-section" id="phase-visuals" aria-labelledby="hev-phase-title">
    <ArchiveHeading icon={ImageIcon} kicker="Phase-specific visual record" title="The five phases no longer share one generic presentation.">
      Each stage is illustrated by its actual setting, test, or turning point rather than another portrait of the protagonist.
    </ArchiveHeading>
    <div className="hev-phase-book" id="hev-phase-title">
      {hunterExamPhaseVisuals.map((phase) => <article key={phase.id}>
        <header><span>{phase.label}</span><h3>{phase.title}</h3></header>
        <div>{phase.images.map((image) => <Visual record={image} key={image.id} />)}</div>
      </article>)}
    </div>
  </section>;
}

function ApplicantPortraitArchive() {
  const [filter, setFilter] = useState('all');
  const visible = useMemo(() => phaseFourApplicants.filter((item) => filter === 'all' || slug(item.result) === filter), [filter]);
  return <section className="he-section hev-section hev-people" id="portraits" aria-labelledby="hev-portraits-title">
    <ArchiveHeading icon={Users} kicker="Visual applicant registry" title="The twenty-four Zevil participants are people, not rows.">
      Portraits are tied to badge numbers, targets, points, and outcomes. Earlier named applicants receive a separate record below.
    </ArchiveHeading>
    <div className="hev-filter" aria-label="Filter participant portraits">{[['all','All 24'],['passed','Passed'],['failed','Failed'],['died','Died']].map(([value, label]) => <button type="button" className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)} aria-pressed={filter === value} key={value}>{label}</button>)}</div>
    <div className="hev-portrait-grid" id="hev-portraits-title">
      {visible.map((item) => <article className={`is-${slug(item.result)}`} key={item.badge}>
        <div className="hev-portrait"><SafeImage src={portraitForBadge(item.badge)} alt={`${item.name}, applicant number ${item.badge}`} fallbackLabel={item.name} /></div>
        <header><i>#{item.badge}</i><span>{item.result}</span><h3>{item.name}</h3></header>
        <dl><div><dt>Target</dt><dd>{item.target}</dd></div><div><dt>Points</dt><dd>{item.points}</dd></div><div><dt>Final record</dt><dd>{item.status}</dd></div></dl>
      </article>)}
    </div>
    <div className="hev-early-applicants">
      <header><span>Before Zevil Island</span><h3>Named applicants eliminated earlier</h3><p>Anonymous candidates remain numerical records; identities are never invented to fill the 405-person field.</p></header>
      <div>{earlyApplicantRecords.map((item) => <article key={item.name}>
        <SafeImage src={item.image} alt={item.name} fallbackLabel={item.name} />
        <div><i>{typeof item.badge === 'number' ? `#${item.badge}` : item.badge}</i><span>{item.phase}</span><h4>{item.name}</h4><strong>{item.result}</strong><p>{item.condition}</p><a href={item.source} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={11} /></a></div>
      </article>)}</div>
    </div>
  </section>;
}

function ProgressionAndAttrition() {
  return <section className="he-section hev-section" id="progression" aria-labelledby="hev-progression-title">
    <ArchiveHeading icon={GitBranch} kicker="Individual progression and population loss" title="The totals are now connected to actual journeys.">
      Exact breakdowns are shown only where the source establishes them. Unknown causes remain unknown rather than being converted into invented death or disqualification counts.
    </ArchiveHeading>
    <div className="hev-table" role="region" tabIndex="0" aria-label="Notable applicant phase progression">
      <table id="hev-progression-title"><thead><tr><th>Applicant</th><th>Preliminary</th><th>Phase 1</th><th>Phase 2</th><th>Phase 3</th><th>Phase 4</th><th>Final</th></tr></thead><tbody>
        {hunterExamProgression.map((row) => <tr key={row.name}><th>{row.name}</th>{['preliminary','one','two','three','four','final'].map((key) => <td key={key}><span className={`is-${slug(row[key])}`}>{row[key]}</span></td>)}</tr>)}
      </tbody></table>
    </div>
    <div className="hev-attrition">
      {hunterExamAttrition.map((item) => <article key={item.stage}>
        <header><span>{item.stage}</span><strong>{item.entered} → {item.passed}</strong><i>−{item.removed}</i></header>
        <dl><div><dt>Known deaths</dt><dd>{item.knownDeaths}</dd></div><div><dt>Classification limit</dt><dd>{item.classification}</dd></div></dl>
      </article>)}
    </div>
  </section>;
}

function ExaminerPortraits() {
  return <section className="he-section hev-section" id="examiner-portraits" aria-labelledby="hev-examiners-title">
    <ArchiveHeading icon={Users} kicker="Exam authority" title="Examiners, gatekeepers, and support staff now have faces.">
      Their roles remain separated: preliminary scout, formal examiner, chairman, administrator, transport support, or referee.
    </ArchiveHeading>
    <div className="hev-host-grid" id="hev-examiners-title">{hunterExamHostPortraits.map((item) => <article key={item.name}>
      <SafeImage src={item.image} alt={item.name} fallbackLabel={item.name} />
      <div><span>{item.stage}</span><h3>{item.name}</h3><p>{item.role}</p><a href={item.source} target="_blank" rel="noreferrer noopener">Hunterpedia <ExternalLink size={11} /></a></div>
    </article>)}</div>
  </section>;
}

function TrickTowerBlueprint() {
  const route = ['Roof', 'One-use trapdoors', 'Majority Rules', 'Prisoner arena', '50-hour chamber', 'Quiz and mine routes', 'Short / long choice', 'Wall breach', 'Exit'];
  return <section className="he-section hev-section hev-tower" id="tower-blueprint" aria-labelledby="hev-tower-title">
    <ArchiveHeading icon={Route} kicker="Trick Tower schematic" title="The Third Phase is now a place, not a sentence.">
      The diagram follows the central Majority Rules route. It does not claim to map every undocumented path inside the prison.
    </ArchiveHeading>
    <div className="hev-tower-layout">
      <div className="hev-tower-cutaway" id="hev-tower-title"><i>72:00:00</i>{route.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}</div>
      <Visual record={{ ...hunterExamLocations.find((item) => item.id === 'trick-tower'), name: 'Trick Tower exterior' }} className="is-featured" />
    </div>
    <div className="hev-prisoners">{trickTowerPrisoners.map((item, index) => <article key={item.name}>
      <SafeImage src={item.image} alt={item.name} fallbackLabel={item.name} />
      <div><i>{String(index + 1).padStart(2, '0')}</i><span>{item.test}</span><h3>{item.name}</h3><p><b>Opponent:</b> {item.opponent}</p><small>{item.effect}</small><a href={item.source} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={11} /></a></div>
    </article>)}</div>
  </section>;
}

function PersonNode({ item, label }) {
  if (!item) return <article className="hev-network-node is-unresolved"><span>{label}</span><strong>Unresolved</strong><p>The source does not establish this relationship.</p></article>;
  return <article className={`hev-network-node is-${slug(item.result)}`}>
    <SafeImage src={portraitForBadge(item.badge)} alt="" fallbackLabel={item.name} />
    <div><span>{label}</span><i>#{item.badge}</i><strong>{item.name}</strong><p>{item.result} · {item.points} points</p></div>
  </article>;
}

function ZevilTargetNetwork() {
  const [badge, setBadge] = useState(405);
  const selected = phaseFourApplicants.find((item) => item.badge === badge) || phaseFourApplicants[0];
  const targetBadge = targetBadgeFrom(selected.target);
  const target = phaseFourApplicants.find((item) => item.badge === targetBadge);
  const hunter = phaseFourApplicants.find((item) => targetBadgeFrom(item.target) === selected.badge);
  return <section className="he-section hev-section hev-zevil" id="zevil-network" aria-labelledby="hev-zevil-title">
    <ArchiveHeading icon={Network} kicker="Zevil Island target network" title="Every documented applicant is both hunter and prey.">
      Select a badge to display the applicant’s assigned target and the documented applicant targeting them. Unresolved target-pool relationships remain visibly unresolved.
    </ArchiveHeading>
    <div className="hev-network" id="hev-zevil-title">
      <PersonNode item={hunter} label="Hunting this applicant" /><i aria-hidden="true">→</i><PersonNode item={selected} label="Selected applicant" /><i aria-hidden="true">→</i><PersonNode item={target} label="Assigned target" />
    </div>
    <div className="hev-network-picker" aria-label="Select Zevil Island applicant">{phaseFourApplicants.map((item) => <button type="button" className={selected.badge === item.badge ? 'is-active' : ''} onClick={() => setBadge(item.badge)} aria-pressed={selected.badge === item.badge} key={item.badge}>#{item.badge} <span>{item.name}</span></button>)}</div>
    <div className="hev-zevil-map">
      <Visual record={hunterExamLocations.find((item) => item.id === 'zevil-island')} className="is-featured" />
      <div><span>Editorial spatial reconstruction</span><h3>Known environmental zones</h3><p>The manga establishes an isthmus, dense forest, tall grass, cave systems, water, and a landing point, but not an exact surveyed map.</p><ol><li>Landing shore and return point</li><li>Dense forest stalking routes</li><li>Tall-grass hunting field</li><li>Gon’s Fisher Bird training area</li><li>Ponzu and Bourbon’s cave</li><li>Open confrontation zones</li></ol></div>
    </div>
  </section>;
}

function FinalBracketArchive() {
  return <section className="he-section hev-section hev-bracket" id="final-bracket" aria-labelledby="hev-bracket-title">
    <ArchiveHeading icon={GitBranch} kicker="Inverted Final Phase bracket" title="Winning removes you from danger; losing grants another chance.">
      The bracket is shown as a downward sequence because candidates continue only while they have not yet earned a victory.
    </ArchiveHeading>
    <div className="hev-finalists" id="hev-bracket-title">{finalInterviews.map((item) => <article key={item.badge}>
      <SafeImage src={portraitForBadge(item.badge)} alt={item.name} fallbackLabel={item.name} />
      <div><i>#{item.badge}</i><h3>{item.name}</h3><p><b>Wanted:</b> {item.interests}</p><p><b>Avoided:</b> {item.avoids}</p></div>
    </article>)}</div>
    <div className="hev-bracket-flow">{finalMatches.map((match, index) => <article key={match.order}>
      <i>{String(match.order).padStart(2, '0')}</i><div><span>{match.outcome}</span><h3>{match.participants}</h3><p>{match.method}</p></div>{index < finalMatches.length - 1 && <b aria-hidden="true">↓</b>}
    </article>)}</div>
  </section>;
}

function ObjectMuseum() {
  return <section className="he-section hev-section" id="objects" aria-labelledby="hev-objects-title">
    <ArchiveHeading icon={Box} kicker="Object museum" title="Rules become tangible through badges, timers, cards, weapons, and licenses.">
      Each object is attached to the phase where it changes the examination.
    </ArchiveHeading>
    <div className="hev-object-grid" id="hev-objects-title">{hunterExamObjectsVisual.map((item) => <article key={item.name}>
      <SafeImage src={item.image} alt={item.name} fallbackLabel={item.name} />
      <div><span>{item.phase}</span><h3>{item.name}</h3><p>{item.function}</p><a href={item.source} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={11} /></a></div>
    </article>)}</div>
  </section>;
}

function ConflictLedger() {
  return <section className="he-section hev-section" id="conflicts" aria-labelledby="hev-conflicts-title">
    <ArchiveHeading icon={Swords} kicker="Conflict ledger" title="The examination’s major confrontations now have complete records.">
      These include hunts, ambushes, prisoner tests, revenge attempts, and Final Phase confrontations—not only conventional fights.
    </ArchiveHeading>
    <div className="hev-conflict-grid" id="hev-conflicts-title">{hunterExamConflicts.map((item, index) => <article key={item.title}>
      <SafeImage src={item.image} alt={item.title} fallbackLabel={item.title} />
      <div><i>{String(index + 1).padStart(2, '0')}</i><span>{item.location}</span><h3>{item.title}</h3><dl><div><dt>Participants</dt><dd>{item.participants}</dd></div><div><dt>Objective</dt><dd>{item.objective}</dd></div><div><dt>Result</dt><dd>{item.result}</dd></div></dl><a href={item.source} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={11} /></a></div>
    </article>)}</div>
  </section>;
}

function ChapterEpisodeMap() {
  return <section className="he-section hev-section" id="records" aria-labelledby="hev-records-title">
    <ArchiveHeading icon={BookMarked} kicker="Phase-by-phase reading record" title="Manga chapters and anime episodes are embedded where the tests occur.">
      This map keeps the dedicated examination boundary at Chapter 38 and Episode 21 while preserving the official broader arc boundary in the adaptation notes.
    </ArchiveHeading>
    <div className="hev-record-map" id="hev-records-title">{hunterExamChapterMap.map((item, index) => <article key={item.stage}>
      <i>{String(index + 1).padStart(2, '0')}</i><div><span>{item.stage}</span><h3>{item.manga}</h3><strong>{item.anime}</strong><p>{item.events}</p></div>
    </article>)}</div>
  </section>;
}

function VisualGallery() {
  return <section className="he-section hev-section" id="visuals" aria-labelledby="hev-gallery-title">
    <ArchiveHeading icon={ImageIcon} kicker="Curated visual archive" title="The full journey can now be scanned as scenes.">
      Every image carries a scene label, phase group, chapter or episode record, accessible description, and direct Hunterpedia source.
    </ArchiveHeading>
    <div className="hev-gallery" id="hev-gallery-title">{hunterExamGallery.map((item, index) => <Visual record={item} className={index % 5 === 0 ? 'is-wide' : ''} key={`${item.title}-${index}`} />)}</div>
  </section>;
}

export default function HunterExamVisualArchive() {
  return <>
    <LocationAtlas />
    <PhasePictureBook />
    <ApplicantPortraitArchive />
    <ProgressionAndAttrition />
    <ExaminerPortraits />
    <TrickTowerBlueprint />
    <ZevilTargetNetwork />
    <FinalBracketArchive />
    <ObjectMuseum />
    <ConflictLedger />
    <ChapterEpisodeMap />
    <VisualGallery />
  </>;
}
