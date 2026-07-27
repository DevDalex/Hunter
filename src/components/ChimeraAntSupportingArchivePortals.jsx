import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  BookOpenText,
  ExternalLink,
  MapPinned,
  Orbit,
  Shield,
  Swords,
  Users,
} from 'lucide-react';
import { chimeraAntSupportingArchive } from '../data/chimeraAntSupportingArchive';
import SafeImage from './SafeImage';
import './ChimeraAntSupportingArchive.css';

const TARGET_IDS = Object.freeze([
  'characters',
  'factions',
  'locations',
  'nen',
  'conflicts',
  'objects',
]);

function SourceLink({ href, label = 'Open source record' }) {
  return <a className="chimera-supporting-source" href={href} target="_blank" rel="noreferrer noopener">
    <span>{label}</span>
    <ExternalLink size={12} />
  </a>;
}

function PhaseBadges({ phases }) {
  return <div className="chimera-supporting-phases" aria-label={`Appears in phases ${phases.join(', ')}`}>
    {phases.map((phase) => <span key={phase}>Phase {phase}</span>)}
  </div>;
}

function ArchiveIntro({ icon: Icon, label, title, text, count }) {
  return <header className="chimera-supporting-intro">
    <div className="chimera-supporting-intro__icon"><Icon size={24} /></div>
    <div>
      <span>{label}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
    <aside><strong>{String(count).padStart(2, '0')}</strong><span>verified records</span></aside>
  </header>;
}

function CharacterArchive() {
  const records = chimeraAntSupportingArchive.characters;
  return <div className="chimera-supporting-portal-root chimera-character-command" data-supporting-archive="characters">
    <ArchiveIntro
      icon={Users}
      label="Character command board"
      title="Read each person as an objective moving through the seven phases."
      text="The archive links allegiance, tactical function, turning point, and outcome instead of reducing the cast to portrait cards."
      count={records.length}
    />
    <div className="chimera-character-command__grid">
      {records.map((record, index) => <article className={`chimera-character-dossier ${record.image ? 'has-portrait' : 'has-token'}`} key={record.id}>
        <div className="chimera-character-dossier__identity">
          {record.image
            ? <figure><SafeImage src={record.image} alt={`${record.name}, ${record.role}`} fallbackLabel={record.name} /></figure>
            : <div className="chimera-character-dossier__token" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>}
          <div>
            <span>{record.role}</span>
            <h4>{record.name}</h4>
            <small>Episodes {record.episodeRange}</small>
          </div>
        </div>
        <PhaseBadges phases={record.phases} />
        <dl className="chimera-character-dossier__fields">
          <div><dt>Allegiance</dt><dd>{record.allegiance}</dd></div>
          <div><dt>Objective</dt><dd>{record.objective}</dd></div>
          <div><dt>Tactical function</dt><dd>{record.tacticalFunction}</dd></div>
          <div><dt>Arc outcome</dt><dd>{record.outcome}</dd></div>
        </dl>
        <SourceLink href={record.sourceHref} label={`${record.name} record`} />
      </article>)}
    </div>
  </div>;
}

function FactionArchive() {
  const records = chimeraAntSupportingArchive.factions;
  return <div className="chimera-supporting-portal-root chimera-faction-field" data-supporting-archive="factions">
    <ArchiveIntro
      icon={Shield}
      label="Power alignment field"
      title="Five systems contest the same territory for different reasons."
      text="The central split is not simply human versus Ant. Institutions, royal loyalty, dispersed memory, occupied government, and chosen alliance overlap."
      count={records.length}
    />
    <div className="chimera-faction-field__axis" aria-hidden="true"><span>Human command</span><i /><strong>Contested allegiance</strong><i /><span>Royal command</span></div>
    <div className="chimera-faction-field__grid">
      {records.map((record, index) => <article className={`chimera-faction-record chimera-faction-record--${record.alignment}`} key={record.id}>
        <header>
          <i>{String(index + 1).padStart(2, '0')}</i>
          <div><span>{record.alignment} alignment</span><h4>{record.name}</h4></div>
          <PhaseBadges phases={record.phases} />
        </header>
        <dl>
          <div><dt>Objective</dt><dd>{record.objective}</dd></div>
          <div><dt>Leadership</dt><dd>{record.leadership}</dd></div>
          <div><dt>Operating method</dt><dd>{record.method}</dd></div>
          <div><dt>Internal fracture</dt><dd>{record.fracture}</dd></div>
          <div><dt>Outcome</dt><dd>{record.outcome}</dd></div>
        </dl>
        <SourceLink href={record.sourceHref} />
      </article>)}
    </div>
  </div>;
}

function LocationArchive() {
  const records = chimeraAntSupportingArchive.locations;
  return <div className="chimera-supporting-portal-root chimera-location-route" data-supporting-archive="locations">
    <ArchiveIntro
      icon={MapPinned}
      label="Geographic escalation route"
      title="Every relocation changes the scale and rules of the operation."
      text="The route begins with recoverable field evidence, passes through an isolated colony and an occupied state, and ends where military geography gives way to memory."
      count={records.length}
    />
    <div className="chimera-location-route__line" aria-hidden="true" />
    <ol>
      {records.map((record) => <li key={record.id}>
        <div className="chimera-location-route__marker"><i>{record.order}</i><span /></div>
        <article>
          <header><div><span>Episodes {record.episodes}</span><h4>{record.name}</h4></div><PhaseBadges phases={record.phases} /></header>
          <dl>
            <div><dt>Story role</dt><dd>{record.role}</dd></div>
            <div><dt>Movement</dt><dd>{record.movement}</dd></div>
            <div><dt>Tactical impact</dt><dd>{record.tacticalImpact}</dd></div>
            <div><dt>Closing state</dt><dd>{record.outcome}</dd></div>
          </dl>
          <SourceLink href={record.sourceHref} />
        </article>
      </li>)}
    </ol>
  </div>;
}

function NenArchive() {
  const records = chimeraAntSupportingArchive.nen;
  return <div className="chimera-supporting-portal-root chimera-nen-matrix" data-supporting-archive="nen">
    <ArchiveIntro
      icon={Orbit}
      label="Tactical Nen matrix"
      title="Power matters through function, dependency, and cost."
      text="The matrix separates what an ability does from the condition that makes it fail, distort the plan, or carry consequences beyond combat."
      count={records.length}
    />
    <div className="chimera-nen-matrix__table" role="table" aria-label="Chimera Ant tactical Nen matrix">
      <div className="chimera-nen-matrix__head" role="row">
        <span role="columnheader">Ability and user</span>
        <span role="columnheader">Tactical function</span>
        <span role="columnheader">Constraint</span>
        <span role="columnheader">Consequence</span>
      </div>
      {records.map((record, index) => <article role="row" key={record.id}>
        <header role="rowheader">
          <i>{String(index + 1).padStart(2, '0')}</i>
          <div><span>{record.category}</span><h4>{record.ability}</h4><p>{record.users}</p><PhaseBadges phases={record.phases} /></div>
        </header>
        <p role="cell">{record.tacticalFunction}</p>
        <p role="cell">{record.constraint}</p>
        <div role="cell"><p>{record.consequence}</p><SourceLink href={record.sourceHref} /></div>
      </article>)}
    </div>
  </div>;
}

function ConflictArchive() {
  const records = chimeraAntSupportingArchive.conflicts;
  return <div className="chimera-supporting-portal-root chimera-conflict-operations" data-supporting-archive="conflicts">
    <ArchiveIntro
      icon={Swords}
      label="Conflict and operation ledger"
      title="A fight is recorded by the objective it fails, changes, or fulfills."
      text="Each row follows the same operational sequence: assigned purpose, disruption, accepted cost, and the state left behind."
      count={records.length}
    />
    <div className="chimera-conflict-operations__legend"><span>Assigned objective</span><ArrowRight size={15} /><span>Disruption</span><ArrowRight size={15} /><span>Cost</span><ArrowRight size={15} /><span>Outcome</span></div>
    <ol>
      {records.map((record, index) => <li key={record.id}>
        <header>
          <i>{String(index + 1).padStart(2, '0')}</i>
          <div><span>Phase {record.phase} · Episodes {record.episodes}</span><h4>{record.title}</h4><p>{record.participants}</p></div>
          <SourceLink href={record.sourceHref} label="Episode evidence" />
        </header>
        <div className="chimera-conflict-operations__sequence">
          <article><span>Objective</span><p>{record.objective}</p></article>
          <article><span>Disruption</span><p>{record.disruption}</p></article>
          <article><span>Cost</span><p>{record.cost}</p></article>
          <article><span>Outcome</span><p>{record.outcome}</p></article>
        </div>
      </li>)}
    </ol>
  </div>;
}

function ObjectArchive() {
  const records = chimeraAntSupportingArchive.objects;
  return <div className="chimera-supporting-portal-root chimera-object-cabinet" data-supporting-archive="objects">
    <ArchiveIntro
      icon={BookOpenText}
      label="Object and evidence cabinet"
      title="Six material records carry the arc’s rules and consequences."
      text="The cabinet distinguishes practical function from interpretive weight so symbolism remains attached to evidence rather than floating as a separate theme section."
      count={records.length}
    />
    <div className="chimera-object-cabinet__grid">
      {records.map((record) => <article key={record.id}>
        <header><i>{record.number}</i><div><span>{record.custodian}</span><h4>{record.name}</h4></div><PhaseBadges phases={record.phases} /></header>
        <div className="chimera-object-cabinet__body">
          <section><span>Operational function</span><p>{record.function}</p></section>
          <section><span>Interpretive reading</span><p>{record.symbolicReading}</p></section>
          <section><span>Consequence</span><p>{record.consequence}</p></section>
        </div>
        <SourceLink href={record.sourceHref} />
      </article>)}
    </div>
  </div>;
}

const ARCHIVE_RENDERERS = Object.freeze({
  characters: CharacterArchive,
  factions: FactionArchive,
  locations: LocationArchive,
  nen: NenArchive,
  conflicts: ConflictArchive,
  objects: ObjectArchive,
});

export default function ChimeraAntSupportingArchivePortals() {
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    setTargets(TARGET_IDS.map((id) => ({
      id,
      node: document.getElementById(`chimera-${id}`),
    })).filter((target) => target.node));
  }, []);

  return targets.map(({ id, node }) => {
    const Archive = ARCHIVE_RENDERERS[id];
    return createPortal(<Archive />, node, `chimera-supporting-${id}`);
  });
}
