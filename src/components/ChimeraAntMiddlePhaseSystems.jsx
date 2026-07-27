import { ArrowRight, ExternalLink } from 'lucide-react';
import { chimeraAntMiddlePhaseSystemById } from '../data/chimeraAntMiddlePhaseSystems';
import SafeImage from './SafeImage';
import './ChimeraAntMiddlePhaseSystems.css';

function SourceLink({ href, children = 'Episode record' }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={11} /></a>;
}

function VisualRecords({ records, fallbackArtwork, label }) {
  return <div className="chimera-middle-system__visual-records" aria-label={label}>
    {records.map((record) => <a href={record.sourceHref} target="_blank" rel="noreferrer noopener" key={record.name}>
      <figure>
        <SafeImage
          src={record.image}
          fallbackSrc={fallbackArtwork}
          fallbackLabel={record.name}
          alt={`${record.name}, ${record.role}`}
        />
        <figcaption><span>{record.role}</span><strong>{record.name}</strong></figcaption>
      </figure>
    </a>)}
  </div>;
}

function DispersalMap({ system, fallbackArtwork }) {
  return <section className="chimera-middle-system chimera-dispersal-system" aria-labelledby="chimera-dispersal-title">
    <header className="chimera-middle-system__header">
      <div><span>Finished visual system · Phase III</span><h4 id="chimera-dispersal-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>Do not treat the colony as one enemy after the Queen dies.</strong><p>Each branch inherits a different relationship to authority, territory, memory, and humanity.</p></aside>
    </header>

    <div className="chimera-dispersal-system__field">
      <div className="chimera-dispersal-system__map" role="img" aria-label="Map of the Chimera Ant colony dispersing toward Meteor City, East Gorteau, defectors, and Komugi">
        <svg className="chimera-dispersal-system__connections" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          {system.branches.map((branch) => <line key={branch.id} x1="50" y1="50" x2={branch.x} y2={branch.y} />)}
        </svg>

        <article className="chimera-dispersal-system__origin">
          <span>{system.origin.label}</span>
          <h5>{system.origin.title}</h5>
          <p>{system.origin.note}</p>
        </article>

        {system.branches.map((branch, index) => <article
          className={`chimera-dispersal-system__branch chimera-dispersal-system__branch--${branch.id}`}
          key={branch.id}
          style={{ '--branch-x': `${branch.x}%`, '--branch-y': `${branch.y}%`, '--branch-order': index }}
        >
          <header><i>{String(index + 1).padStart(2, '0')}</i><div><span>{branch.signal}</span><small>Episodes {branch.episodes}</small></div></header>
          <h5>{branch.title}</h5>
          <p>{branch.summary}</p>
          <footer><strong>{branch.outcome}</strong><SourceLink href={branch.sourceHref} /></footer>
        </article>)}
      </div>

      <aside className="chimera-dispersal-system__legend">
        <span>Phase logic</span>
        <strong>Geography expands; the central conflict concentrates.</strong>
        <p>Meteor City proves regional dispersal, East Gorteau creates the state-scale threat, defectors complicate species boundaries, and Komugi begins the private story that will reshape the King.</p>
        <VisualRecords records={system.visualRecords} fallbackArtwork={fallbackArtwork} label="Phase III visual records" />
      </aside>
    </div>

    <div className="chimera-dispersal-system__occupation">
      <header><span>East Gorteau occupation stack</span><h5>How a captured state becomes Selection machinery</h5></header>
      <ol>{system.occupationChain.map((step) => <li key={step.index}>
        <i>{step.index}</i>
        <div><span>{step.label}</span><strong>{step.title}</strong><p>{step.detail}</p></div>
        <ArrowRight size={17} aria-hidden="true" />
      </li>)}</ol>
      <p>{system.conclusion}</p>
    </div>
  </section>;
}

function ProgressTrack({ title, label, records }) {
  return <section className="chimera-preparation-system__track">
    <header><span>{label}</span><h5>{title}</h5></header>
    <ol>{records.map((record) => <li key={record.index}>
      <i>{record.index}</i>
      <div><span>{record.label} · Episodes {record.episodes}</span><strong>{record.title}</strong><p>{record.summary}</p><SourceLink href={record.sourceHref}>Evidence</SourceLink></div>
    </li>)}</ol>
  </section>;
}

function PalacePreparation({ system, fallbackArtwork }) {
  return <section className="chimera-middle-system chimera-preparation-system" aria-labelledby="chimera-preparation-title">
    <header className="chimera-middle-system__header">
      <div><span>Finished visual system · Phase IV</span><h4 id="chimera-preparation-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>The assault plan and the King’s transformation advance on separate information systems.</strong><p>The Hunters see targets and routes. Komugi changes motives that cannot be plotted from outside the palace.</p></aside>
    </header>

    <div className="chimera-preparation-system__dual-track">
      <ProgressTrack title="Gungi changes the target" label="Private contest" records={system.gungiTrack} />
      <div className="chimera-preparation-system__portraits">
        <VisualRecords records={system.portraits} fallbackArtwork={fallbackArtwork} label="Meruem and Komugi visual records" />
        <div><span>Unknown variable</span><strong>Komugi is absent from the operation’s target model.</strong><p>Her presence changes what Meruem values, what Pitou must protect, and what Pouf fears the King may become.</p></div>
      </div>
      <ProgressTrack title="The extermination team closes the perimeter" label="Military preparation" records={system.preparationTrack} />
    </div>

    <div className="chimera-preparation-system__blueprint">
      <header>
        <div><span>Palace blueprint</span><h5>Plan versus known reality before launch</h5></div>
        <p>This does not reveal the full invasion outcome. It records the assumptions already under pressure by Episode 110.</p>
      </header>
      <div className="chimera-preparation-system__blueprint-grid" role="table" aria-label="Palace target assignments compared with known weaknesses before the invasion">
        <div className="chimera-preparation-system__blueprint-head" role="row">
          <span role="columnheader">Target and assignment</span>
          <span role="columnheader">Planned function</span>
          <span role="columnheader">Reality already in conflict</span>
        </div>
        {system.blueprint.map((record) => <article role="row" key={record.id}>
          <header role="rowheader"><span>{record.target}</span><strong>{record.assignment}</strong></header>
          <p role="cell">{record.plan}</p>
          <p role="cell">{record.reality}</p>
        </article>)}
      </div>
    </div>

    <div className="chimera-preparation-system__readiness">
      <header><span>Launch condition · Episode 110</span><strong>Precise assignments, incomplete intelligence</strong></header>
      <div>{system.readiness.map((record) => <article key={record.label}>
        <span>{record.label}</span><strong>{record.state}</strong><p>{record.detail}</p>
      </article>)}</div>
      <p>{system.conclusion}</p>
    </div>
  </section>;
}

export default function ChimeraAntMiddlePhaseSystems({ phaseId, fallbackArtwork }) {
  const system = chimeraAntMiddlePhaseSystemById.get(phaseId);
  if (!system) return null;
  if (phaseId === 'rogue-ants-east-gorteau') return <DispersalMap system={system} fallbackArtwork={fallbackArtwork} />;
  if (phaseId === 'komugi-invasion-preparation') return <PalacePreparation system={system} fallbackArtwork={fallbackArtwork} />;
  return null;
}
