import { ArrowRight, ExternalLink } from 'lucide-react';
import { chimeraAntPhaseScaffoldById } from '../data/chimeraAntPhaseScaffold';
import SafeImage from './SafeImage';
import ChimeraAntEarlyPhaseSystems from './ChimeraAntEarlyPhaseSystems';
import ChimeraAntMiddlePhaseSystems from './ChimeraAntMiddlePhaseSystems';
import ChimeraAntPalaceInvasionSystem from './ChimeraAntPalaceInvasionSystem';
import ChimeraAntEndgameSystems from './ChimeraAntEndgameSystems';
import ChimeraAntSupportingArchivePortals from './ChimeraAntSupportingArchivePortals';
import ChimeraAntReferenceArchivePortals from './ChimeraAntReferenceArchivePortals';
import './ChimeraAntPhaseArchive.css';
import './ChimeraAntBatch5.css';
import './ChimeraAntBatch11.css';
import './ChimeraAntScreenshotFixes.css';

const inclusiveCount = (range) => Array.isArray(range) ? range[1] - range[0] + 1 : 0;
const phaseDomId = (id) => `chimera-phase-${id}`;
const finishedPhaseIds = new Set([
  'ngl-expedition',
  'defeat-birth-return',
  'rogue-ants-east-gorteau',
  'komugi-invasion-preparation',
  'palace-invasion',
  'two-endgames',
  'poison-memory-homecoming',
]);

function SourceLink({ href, children = 'Source record' }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={12} /></a>;
}

function PhaseSpread({ phase, scaffold, fallbackArtwork }) {
  const episodeCount = inclusiveCount(phase.episodes);
  const finished = finishedPhaseIds.has(phase.id);
  return <article
    id={phaseDomId(phase.id)}
    className={`chimera-phase-spread chimera-phase-spread--${phase.composition}`}
    data-phase-id={phase.id}
    data-phase-tone={phase.tone}
    data-phase-finish={finished ? 'complete' : 'scaffold'}
    style={{ '--phase-accent': scaffold.accent }}
  >
    <header className="chimera-phase-spread__header">
      <div className="chimera-phase-spread__ordinal"><span>Phase</span><strong>{String(phase.number).padStart(2, '0')}</strong></div>
      <div>
        <span className="chimera-phase-spread__eyebrow">Episodes {phase.episodes[0]}–{phase.episodes[1]} · {episodeCount} episodes</span>
        <h3>{phase.title}</h3>
        <p>{scaffold.purpose}</p>
      </div>
      <dl className="chimera-phase-spread__field-note">
        <div><dt>Composition</dt><dd>{phase.composition.replaceAll('-', ' ')}</dd></div>
        <div><dt>Tone</dt><dd>{phase.tone.replaceAll('-', ' ')}</dd></div>
      </dl>
    </header>

    <div className="chimera-phase-spread__body">
      <figure className="chimera-phase-spread__media">
        <SafeImage src={scaffold.image} fallbackSrc={fallbackArtwork} fallbackLabel={phase.shortTitle} alt={`${phase.shortTitle} phase artwork`} />
        <figcaption><span>{scaffold.imageRole}</span><SourceLink href={scaffold.sourceHref} /></figcaption>
      </figure>

      <div className="chimera-phase-spread__episode-index">
        <span>Episode groups</span>
        <ol>{scaffold.episodeGroups.map((group, index) => <li key={`${phase.id}-${group.episodes}`}>
          <i>{String(index + 1).padStart(2, '0')}</i>
          <div><small>Episodes {group.episodes}</small><strong>{group.label}</strong></div>
          <p>{group.stateChange}</p>
        </li>)}</ol>
      </div>

      <dl className="chimera-phase-spread__state-ledger">
        <div><dt>Opening condition</dt><dd>{phase.openingCondition}</dd></div>
        <div><dt>Turning point</dt><dd>{phase.turningPoint}</dd></div>
        <div><dt>Closing condition</dt><dd>{phase.closingCondition}</dd></div>
      </dl>
    </div>

    {phase.id === 'ngl-expedition' || phase.id === 'defeat-birth-return'
      ? <ChimeraAntEarlyPhaseSystems phaseId={phase.id} fallbackArtwork={fallbackArtwork} />
      : null}
    {phase.id === 'rogue-ants-east-gorteau' || phase.id === 'komugi-invasion-preparation'
      ? <ChimeraAntMiddlePhaseSystems phaseId={phase.id} fallbackArtwork={fallbackArtwork} />
      : null}
    {phase.id === 'palace-invasion'
      ? <ChimeraAntPalaceInvasionSystem phaseId={phase.id} fallbackArtwork={fallbackArtwork} />
      : null}
    {phase.id === 'two-endgames' || phase.id === 'poison-memory-homecoming'
      ? <ChimeraAntEndgameSystems phaseId={phase.id} fallbackArtwork={fallbackArtwork} />
      : null}

    <footer className="chimera-phase-spread__footer">
      <span>{finished ? 'Finished visual system' : 'Foundation scaffold'}</span>
      <strong>{finished ? scaffold.finishedNote : scaffold.nextVisual}</strong>
      <ArrowRight size={20} aria-hidden="true" />
    </footer>
  </article>;
}

export default function ChimeraAntPhaseArchive({ phases, fallbackArtwork, supportingTargets = {}, referenceTargets = {} }) {
  return <div className="chimera-phase-archive">
    {phases.map((phase) => {
      const scaffold = chimeraAntPhaseScaffoldById.get(phase.id);
      if (!scaffold) return null;
      return <div className="chimera-phase-archive__entry" key={phase.id}>
        <PhaseSpread phase={phase} scaffold={scaffold} fallbackArtwork={fallbackArtwork} />
        {phase.id === 'poison-memory-homecoming'
          ? <>
            <ChimeraAntSupportingArchivePortals targets={supportingTargets} fallbackArtwork={fallbackArtwork} />
            <ChimeraAntReferenceArchivePortals targets={referenceTargets} fallbackArtwork={fallbackArtwork} />
          </>
          : null}
      </div>;
    })}
  </div>;
}
