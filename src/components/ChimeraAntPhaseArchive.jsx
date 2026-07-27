import { ArrowRight, ExternalLink } from 'lucide-react';
import { chimeraAntPhaseScaffoldById } from '../data/chimeraAntPhaseScaffold';
import SafeImage from './SafeImage';
import ChimeraAntEarlyPhaseSystems from './ChimeraAntEarlyPhaseSystems';
import './ChimeraAntPhaseArchive.css';
import './ChimeraAntBatch5.css';

const inclusiveCount = (range) => Array.isArray(range) ? range[1] - range[0] + 1 : 0;
const phaseDomId = (id) => `chimera-phase-${id}`;
const finishedEarlyPhaseIds = new Set(['ngl-expedition', 'defeat-birth-return']);

function PhaseStateLedger({ phase }) {
  return <dl className="chimera-phase-spread__states">
    <div><dt>Opening state</dt><dd>{phase.openingCondition}</dd></div>
    <div><dt>Turning point</dt><dd>{phase.turningPoint}</dd></div>
    <div><dt>Closing state</dt><dd>{phase.closingCondition}</dd></div>
  </dl>;
}

function PhaseMedia({ phase, detail, artwork, fallbackArtwork }) {
  const image = detail?.media?.image || artwork?.image || fallbackArtwork;
  const fallback = artwork?.fallback || fallbackArtwork;
  if (!image) return null;

  return <figure className="chimera-phase-spread__media">
    <SafeImage
      src={image}
      fallbackSrc={fallback}
      alt={detail?.media?.alt || `Chimera Ant arc artwork accompanying Phase ${phase.number}: ${phase.title}`}
      style={{ '--chimera-phase-image-position': detail?.media?.position || artwork?.position || 'center' }}
    />
    <figcaption>
      <span>Visual record · Phase {String(phase.number).padStart(2, '0')}</span>
      <p>{detail?.media?.caption || `Illustrated record for ${phase.title}.`}</p>
      {detail?.media?.sourceHref
        ? <a href={detail.media.sourceHref} target="_blank" rel="noreferrer noopener">{detail.media.creditLabel || 'Image source'} <ExternalLink size={12} /></a>
        : <small>{detail?.media?.creditLabel || 'Image source hook reserved for verified phase artwork'}</small>}
    </figcaption>
  </figure>;
}

function EpisodeGroups({ groups = [] }) {
  return <ol className="chimera-phase-spread__episode-groups" aria-label="Episode groups in this phase">
    {groups.map((group, index) => <li key={`${group.range[0]}-${group.range[1]}`}>
      <div className="chimera-phase-spread__episode-index">
        <i>{String(index + 1).padStart(2, '0')}</i>
        <span>{group.signal}</span>
      </div>
      <div>
        <small>Episodes {group.range[0]}{group.range[1] !== group.range[0] ? `–${group.range[1]}` : ''}</small>
        <h4>{group.title}</h4>
        <p>{group.summary}</p>
      </div>
    </li>)}
  </ol>;
}

export default function ChimeraAntPhaseArchive({
  phases,
  activePhase,
  onSelectPhase,
  artwork,
  fallbackArtwork,
}) {
  return <div className="chimera-phase-archive">
    {phases.map((phase, index) => {
      const detail = chimeraAntPhaseScaffoldById.get(phase.id);
      const episodeCount = inclusiveCount(phase.episodes);
      const nextPhase = phases[index + 1];
      const active = activePhase === phase.id;
      const finishedEarlyPhase = finishedEarlyPhaseIds.has(phase.id);

      return <article
        id={phaseDomId(phase.id)}
        key={phase.id}
        className={`chimera-phase-spread chimera-phase-spread--${phase.composition} ${active ? 'is-active' : ''}`}
        data-phase-id={phase.id}
        data-phase-section="true"
        data-composition={phase.composition}
        data-phase-finish={finishedEarlyPhase ? 'complete' : 'scaffold'}
        aria-labelledby={`${phaseDomId(phase.id)}-title`}
      >
        <header className="chimera-phase-spread__header">
          <div className="chimera-phase-spread__ordinal">
            <span>Phase</span>
            <strong>{String(phase.number).padStart(2, '0')}</strong>
          </div>
          <div>
            <span className="chimera-phase-spread__eyebrow">Episodes {phase.episodes[0]}–{phase.episodes[1]} · {episodeCount} episodes · {phase.tone.replaceAll('-', ' ')}</span>
            <h3 id={`${phaseDomId(phase.id)}-title`}>{phase.title}</h3>
            <p>{detail?.deck || phase.openingCondition}</p>
          </div>
          <dl className="chimera-phase-spread__field-note">
            <div><dt>Primary field</dt><dd>{detail?.location || 'Chimera Ant operation'}</dd></div>
            <div><dt>Key participants</dt><dd>{detail?.participants || 'Human and Chimera Ant forces'}</dd></div>
            <div><dt>Composition contract</dt><dd>{phase.composition.replaceAll('-', ' ')}</dd></div>
          </dl>
        </header>

        <div className="chimera-phase-spread__stage">
          <PhaseMedia phase={phase} detail={detail} artwork={artwork} fallbackArtwork={fallbackArtwork} />
          <div className="chimera-phase-spread__body">
            <PhaseStateLedger phase={phase} />
            <EpisodeGroups groups={detail?.episodeGroups} />
          </div>
        </div>

        <ChimeraAntEarlyPhaseSystems phaseId={phase.id} fallbackArtwork={fallbackArtwork} />

        <footer className="chimera-phase-spread__footer">
          <div>
            <span>{finishedEarlyPhase ? 'Finished phase presentation' : 'Shared phase architecture'}</span>
            <p>{finishedEarlyPhase
              ? phase.id === 'ngl-expedition'
                ? 'The finished Phase I spread combines verified portraits, an episode-linked expedition route, a five-step threat ladder, and the catastrophic extraction endpoint.'
                : 'The finished Phase II spread aligns the boys, the colony, and the Hunter Association across the same three episode periods before converging them on East Gorteau.'
              : 'This spread exposes stable hooks for phase artwork, captions, sources, state changes, episode groups, and a composition-specific visual system.'}</p>
          </div>
          {nextPhase
            ? <button type="button" onClick={() => onSelectPhase(nextPhase.id)}>Continue to Phase {String(nextPhase.number).padStart(2, '0')} <ArrowRight size={14} /></button>
            : <button type="button" onClick={() => document.getElementById('chimera-characters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Continue to character records <ArrowRight size={14} /></button>}
        </footer>
      </article>;
    })}
  </div>;
}
