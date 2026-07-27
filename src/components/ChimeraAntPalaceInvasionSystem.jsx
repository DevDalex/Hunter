import { ExternalLink } from 'lucide-react';
import { chimeraAntPalaceInvasionSystem } from '../data/chimeraAntPalaceInvasionSystem';
import SafeImage from './SafeImage';
import './ChimeraAntPalaceInvasionSystem.css';
import './ChimeraAntBatch7.css';

const portraitLaneIds = new Set(['gon-pitou', 'killua', 'king-front', 'komugi']);

function SourceLink({ href, children = 'Episode record' }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={11} /></a>;
}

function PalaceSchematic({ palace }) {
  return <section className="chimera-invasion-system__palace" aria-labelledby="chimera-invasion-palace-title">
    <header>
      <div><span>Royal Palace field plan</span><h5 id="chimera-invasion-palace-title">Entry vectors and forced separations</h5></div>
      <p>{palace.note}</p>
    </header>

    <div className="chimera-invasion-system__palace-field" role="group" aria-label="Schematic of the palace invasion entry vectors and confrontation zones">
      <svg className="chimera-invasion-system__vectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="chimera-invasion-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" />
          </marker>
        </defs>
        {palace.vectors.map((vector) => <line
          key={vector.id}
          className={`is-${vector.kind}`}
          x1={vector.x1}
          y1={vector.y1}
          x2={vector.x2}
          y2={vector.y2}
          markerEnd="url(#chimera-invasion-arrow)"
        />)}
      </svg>

      {palace.zones.map((zone) => <article
        className={`chimera-invasion-system__zone chimera-invasion-system__zone--${zone.id}`}
        key={zone.id}
        style={{ '--zone-x': `${zone.x}%`, '--zone-y': `${zone.y}%` }}
      >
        <span>{zone.label}</span>
        <strong>{zone.title}</strong>
        <p>{zone.state}</p>
      </article>)}

      <div className="chimera-invasion-system__vector-key" aria-label="Entry vector evidence">
        {palace.vectors.map((vector) => <article key={vector.id}>
          <i className={`is-${vector.kind}`} />
          <div><span>Episodes {vector.episodes}</span><strong>{vector.label}</strong></div>
          <SourceLink href={vector.sourceHref}>Evidence</SourceLink>
        </article>)}
      </div>
    </div>
  </section>;
}

function InvasionClock({ clock }) {
  return <section className="chimera-invasion-system__clock" aria-labelledby="chimera-invasion-clock-title">
    <header><span>Relative invasion clock</span><h5 id="chimera-invasion-clock-title">One launch, six changes of state</h5><p>Only the launch is fixed at 00:00 here. Later marks are intentionally relative so the page does not invent unsupported second-by-second precision.</p></header>
    <ol>{clock.map((record, index) => <li key={record.mark}>
      <div className="chimera-invasion-system__clock-mark"><i>{String(index + 1).padStart(2, '0')}</i><strong>{record.mark}</strong></div>
      <article>
        <span>{record.label} · Episodes {record.episodes}</span>
        <h6>{record.title}</h6>
        <p>{record.summary}</p>
        <SourceLink href={record.sourceHref} />
      </article>
    </li>)}</ol>
  </section>;
}

function LaneMatrix({ periods, lanes, fallbackArtwork }) {
  return <section className="chimera-invasion-system__lanes" aria-labelledby="chimera-invasion-lanes-title">
    <header><span>Parallel event lanes</span><h5 id="chimera-invasion-lanes-title">Seven objectives under the same clock</h5><p>Read horizontally to follow one front. Read vertically to compare what every front knows during the same narrative period.</p></header>

    <div className="chimera-invasion-system__lane-matrix" role="table" aria-label="Parallel palace invasion event lanes">
      <div className="chimera-invasion-system__lane-head" role="row">
        <div role="columnheader"><span>Operational lane</span><strong>Objective at launch</strong></div>
        {periods.map((period) => <div role="columnheader" key={period.id}>
          <i>{period.mark}</i><span>{period.label} · Episodes {period.episodes}</span><strong>{period.title}</strong>
        </div>)}
      </div>

      {lanes.map((lane) => <article className={`chimera-invasion-system__lane is-${lane.accent}`} role="row" key={lane.id}>
        <header role="rowheader">
          <figure>{portraitLaneIds.has(lane.id)
            ? <SafeImage src={lane.portrait} fallbackSrc={fallbackArtwork} fallbackLabel={lane.title} alt="" />
            : <span className="chimera-invasion-system__lane-token" aria-hidden="true">{lane.number}</span>}
          </figure>
          <div><span>Lane {lane.number}</span><h6>{lane.title}</h6><p>{lane.objective}</p></div>
        </header>
        {periods.map((period) => {
          const event = lane.events.find((item) => item.period === period.id);
          return <section role="cell" key={`${lane.id}-${period.id}`}>
            <span>{event?.state || period.label}</span>
            <p>{event?.text}</p>
          </section>;
        })}
      </article>)}
    </div>
  </section>;
}

function DisruptionLedger({ records }) {
  return <section className="chimera-invasion-system__disruptions" aria-labelledby="chimera-invasion-disruptions-title">
    <header><span>Plan versus actual</span><h5 id="chimera-invasion-disruptions-title">The mission survives by abandoning its original shape</h5></header>
    <div role="table" aria-label="Palace invasion plan compared with actual disruptions">
      <div className="chimera-invasion-system__disruption-head" role="row">
        <span role="columnheader">Target</span><span role="columnheader">Planned condition</span><span role="columnheader">Actual condition</span><span role="columnheader">Consequence</span>
      </div>
      {records.map((record) => <article role="row" key={record.id}>
        <strong role="rowheader">{record.target}</strong>
        <p role="cell">{record.plan}</p>
        <p role="cell">{record.actual}</p>
        <p role="cell">{record.consequence}</p>
      </article>)}
    </div>
  </section>;
}

function VisualRecords({ records, fallbackArtwork }) {
  return <section className="chimera-invasion-system__visuals" aria-labelledby="chimera-invasion-visuals-title">
    <header><span>Visual field</span><h5 id="chimera-invasion-visuals-title">Five figures who redefine the operation</h5></header>
    <div>{records.map((record) => <a href={record.sourceHref} target="_blank" rel="noreferrer noopener" key={record.name}>
      <figure>
        <SafeImage src={record.image} fallbackSrc={fallbackArtwork} fallbackLabel={record.name} alt={`${record.name}, ${record.role} during the palace invasion`} />
        <figcaption><span>{record.role}</span><strong>{record.name}</strong></figcaption>
      </figure>
    </a>)}</div>
  </section>;
}

export default function ChimeraAntPalaceInvasionSystem({ phaseId, fallbackArtwork }) {
  if (phaseId !== 'palace-invasion') return null;
  const system = chimeraAntPalaceInvasionSystem;

  return <section className="chimera-invasion-system" aria-labelledby="chimera-invasion-system-title">
    <header className="chimera-invasion-system__header">
      <div><span>Finished visual system · Phase V</span><h4 id="chimera-invasion-system-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>Nothing important happens in isolation.</strong><p>The palace plan, clock, and lane matrix must be read together; each view explains a different kind of simultaneity.</p></aside>
    </header>

    <PalaceSchematic palace={system.palace} />
    <InvasionClock clock={system.clock} />
    <LaneMatrix periods={system.periods} lanes={system.lanes} fallbackArtwork={fallbackArtwork} />
    <DisruptionLedger records={system.disruptions} />
    <VisualRecords records={system.visualRecords} fallbackArtwork={fallbackArtwork} />

    <footer className="chimera-invasion-system__conclusion">
      <span>Phase conclusion</span><strong>{system.conclusion}</strong>
    </footer>
  </section>;
}
