import { ArrowRight, ExternalLink } from 'lucide-react';
import { chimeraAntEndgameSystemById } from '../data/chimeraAntEndgameSystems';
import { chimeraPortraitMediaId } from '../data/chimeraAntMedia';
import SafeImage from './SafeImage';
import './ChimeraAntEndgameSystems.css';

const GUNGI_PIECES = new Map([
  [4, 'royal'],
  [13, 'bone'],
  [20, 'royal'],
  [30, 'bone'],
  [40, 'royal'],
  [50, 'bone'],
  [60, 'royal'],
  [67, 'bone'],
  [76, 'royal'],
]);

function SourceLink({ href, children = 'Episode record' }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={11} /></a>;
}

function PortraitRecords({ portraits, fallbackArtwork, label }) {
  return <div className="chimera-endgame-system__portraits" aria-label={label}>
    {portraits.map((portrait) => <a href={portrait.sourceHref} target="_blank" rel="noreferrer noopener" key={portrait.name}>
      <figure>
        <SafeImage
          mediaId={chimeraPortraitMediaId(portrait.name)}
          mediaVariant="portrait"
          src={portrait.image}
          fallbackSrc={fallbackArtwork}
          fallbackLabel={portrait.name}
          alt={`${portrait.name}, ${portrait.role}`}
        />
        <figcaption><span>{portrait.role}</span><strong>{portrait.name}</strong></figcaption>
      </figure>
    </a>)}
  </div>;
}

function EndgameCard({ endgame, fallbackArtwork }) {
  return <article className={`chimera-endgame-card chimera-endgame-card--${endgame.id}`}>
    <header>
      <div><span>{endgame.label} · Episodes {endgame.episodes}</span><h5>{endgame.title}</h5><strong>{endgame.subtitle}</strong></div>
      <PortraitRecords portraits={endgame.portraits} fallbackArtwork={fallbackArtwork} label={`${endgame.title} visual records`} />
    </header>

    <dl className="chimera-endgame-card__dossier">
      <div><dt>Objective</dt><dd>{endgame.dossier.objective}</dd></div>
      <div><dt>Weapon system</dt><dd>{endgame.dossier.weapon}</dd></div>
      <div><dt>Decision</dt><dd>{endgame.dossier.decision}</dd></div>
      <div><dt>Cost</dt><dd>{endgame.dossier.cost}</dd></div>
      <div><dt>Result</dt><dd>{endgame.dossier.result}</dd></div>
      <div><dt>Aftermath</dt><dd>{endgame.dossier.aftermath}</dd></div>
    </dl>

    <ol className="chimera-endgame-card__sequence">
      {endgame.sequence.map((record) => <li key={`${endgame.id}-${record.index}`}>
        <i>{record.index}</i>
        <div>
          <span>{record.label} · Episodes {record.episodes}</span>
          <h6>{record.title}</h6>
          <p>{record.summary}</p>
          <SourceLink href={record.sourceHref} />
        </div>
      </li>)}
    </ol>
  </article>;
}

function MirroredEndgames({ system, fallbackArtwork }) {
  return <section className="chimera-endgame-system chimera-mirrored-endgames" aria-labelledby="chimera-mirrored-endgames-title">
    <header className="chimera-endgame-system__header">
      <div><span>Finished visual system · Phase VI</span><h4 id="chimera-mirrored-endgames-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>Mirror the costs without declaring the acts equivalent.</strong><p>The shared shape is self-destruction. The motive, scale, weapon, and responsibility remain different.</p></aside>
    </header>

    <div className="chimera-mirrored-endgames__field">
      {system.endgames.map((endgame) => <EndgameCard key={endgame.id} endgame={endgame} fallbackArtwork={fallbackArtwork} />)}
      <div className="chimera-mirrored-endgames__axis" aria-hidden="true"><span>122</span><i /><strong>Self-destruction as force</strong><i /><span>131</span></div>
    </div>

    <div className="chimera-mirrored-endgames__comparison" role="table" aria-label="Comparison of the two Chimera Ant endgames">
      <div className="chimera-mirrored-endgames__comparison-head" role="row">
        <span role="columnheader">Netero / Meruem</span>
        <strong role="columnheader">Comparison axis</strong>
        <span role="columnheader">Gon / Pitou</span>
      </div>
      {system.comparisonRows.map((row) => <article role="row" key={row.label}>
        <p role="cell">{row.left}</p>
        <h6 role="rowheader">{row.label}</h6>
        <p role="cell">{row.right}</p>
      </article>)}
    </div>

    <aside className="chimera-mirrored-endgames__verdict">
      <span>{system.verdict.label}</span>
      <h5>{system.verdict.title}</h5>
      <p>{system.verdict.text}</p>
    </aside>
  </section>;
}

function AbstractGungiBoard() {
  return <div className="chimera-aftermath-system__gungi-board" role="img" aria-label="Abstract Gungi board motif; not a canonical reconstructed game position">
    {Array.from({ length: 81 }, (_, index) => {
      const piece = GUNGI_PIECES.get(index);
      return <i key={index} className={piece ? `has-piece has-piece--${piece}` : ''}><span /></i>;
    })}
  </div>;
}

function QuietAftermath({ system, fallbackArtwork }) {
  return <section className="chimera-endgame-system chimera-aftermath-system" aria-labelledby="chimera-aftermath-title">
    <header className="chimera-endgame-system__header">
      <div><span>Finished visual system · Phase VII</span><h4 id="chimera-aftermath-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>Lower the visual volume after the battles end.</strong><p>The poison, a remembered name, consent to remain, and survivor destinations carry the resolution.</p></aside>
    </header>

    <div className="chimera-aftermath-system__progression">
      <header><span>Poison and memory progression</span><h5>The delayed weapon moves forward while the missing memory moves backward into place.</h5></header>
      <ol>{system.progression.map((record) => <li key={record.index}>
        <i>{record.index}</i>
        <div><span>{record.label} · Episode {record.episodes}</span><h6>{record.title}</h6><p>{record.summary}</p><SourceLink href={record.sourceHref} /></div>
      </li>)}</ol>
    </div>

    <div className="chimera-aftermath-system__final-game">
      <div className="chimera-aftermath-system__game-visual">
        <AbstractGungiBoard />
        <PortraitRecords portraits={system.finalGame.portraits} fallbackArtwork={fallbackArtwork} label="Meruem and Komugi final Gungi records" />
      </div>
      <article>
        <span>{system.finalGame.label}</span>
        <h5>{system.finalGame.title}</h5>
        <p>{system.finalGame.note}</p>
        <ol>{system.finalGame.beats.map((beat) => <li key={beat.index}><i>{beat.index}</i><div><strong>{beat.label}</strong><p>{beat.text}</p></div></li>)}</ol>
        <SourceLink href={system.finalGame.sourceHref}>Episode 135 record</SourceLink>
      </article>
    </div>

    <div className="chimera-aftermath-system__routes">
      <header><span>Survivor destinations</span><h5>The colony does not receive one ending.</h5><p>Each route records a different answer to what survives after the King and the extermination mission are gone.</p></header>
      <div className="chimera-aftermath-system__route-field">
        <article className="chimera-aftermath-system__route-origin"><span>Episode 136</span><strong>Palace conflict closed</strong><small>Four routes carry the aftermath forward.</small></article>
        <div className="chimera-aftermath-system__route-line" aria-hidden="true" />
        {system.survivorRoutes.map((route, index) => <article className={`chimera-aftermath-system__route chimera-aftermath-system__route--${route.id}`} key={route.id}>
          <i>{String(index + 1).padStart(2, '0')}</i>
          <span>{route.label}</span>
          <h6>{route.destination}</h6>
          <p>{route.result}</p>
          <SourceLink href={route.sourceHref} />
        </article>)}
      </div>
    </div>

    <aside className="chimera-aftermath-system__transition">
      <div><span>{system.transition.label}</span><h5>{system.transition.title}</h5><p>{system.transition.text}</p></div>
      <ArrowRight size={30} aria-hidden="true" />
    </aside>
  </section>;
}

export default function ChimeraAntEndgameSystems({ phaseId, fallbackArtwork }) {
  const system = chimeraAntEndgameSystemById.get(phaseId);
  if (!system) return null;
  if (phaseId === 'two-endgames') return <MirroredEndgames system={system} fallbackArtwork={fallbackArtwork} />;
  if (phaseId === 'poison-memory-homecoming') return <QuietAftermath system={system} fallbackArtwork={fallbackArtwork} />;
  return null;
}
