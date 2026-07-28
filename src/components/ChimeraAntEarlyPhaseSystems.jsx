import { ArrowRight, ExternalLink } from 'lucide-react';
import { chimeraAntEarlyPhaseSystemById } from '../data/chimeraAntEarlyPhaseSystems';
import { chimeraPortraitMediaId } from '../data/chimeraAntMedia';
import SafeImage from './SafeImage';
import './ChimeraAntEarlyPhaseSystems.css';

function SourceLink({ href, children = 'Episode record' }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={11} /></a>;
}

function ExpeditionPortraits({ portraits, fallbackArtwork }) {
  return <div className="chimera-expedition-system__portraits" aria-label="Phase I principal figures">
    {portraits.map((portrait) => <a href={portrait.sourceHref} target="_blank" rel="noreferrer noopener" key={portrait.name}>
      <figure>
        <SafeImage
          mediaId={chimeraPortraitMediaId(portrait.name)}
          mediaVariant="portrait"
          src={portrait.image}
          fallbackSrc={fallbackArtwork}
          alt={`${portrait.name}, ${portrait.role} during the NGL expedition`}
          fallbackLabel={portrait.name}
        />
        <figcaption><span>{portrait.role}</span><strong>{portrait.name}</strong></figcaption>
      </figure>
    </a>)}
  </div>;
}

function ExpeditionRouteSystem({ system, fallbackArtwork }) {
  return <section className="chimera-early-system chimera-expedition-system" aria-labelledby="chimera-expedition-system-title">
    <header className="chimera-early-system__header">
      <div><span>Finished visual system · Phase I</span><h4 id="chimera-expedition-system-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>Distance into NGL equals loss of control.</strong><p>The route is not decorative geography. Each stop records a new capability the expedition failed to predict.</p></aside>
    </header>

    <div className="chimera-expedition-system__route-field">
      <div className="chimera-expedition-system__route-label"><span>Kakin coast</span><i /><span>NGL extraction line</span></div>
      <ol className="chimera-expedition-system__route" aria-label="NGL expedition route and threat escalation">
        {system.routeStops.map((stop, index) => <li key={stop.id} data-severity={stop.severity} style={{ '--route-order': index }}>
          <div className="chimera-expedition-system__node"><i>{String(index + 1).padStart(2, '0')}</i><span>Threat {stop.severity}/6</span></div>
          <article>
            <div><span>{stop.signal}</span><small>Episodes {stop.episodes}</small></div>
            <strong>{stop.place}</strong>
            <h5>{stop.title}</h5>
            <p>{stop.summary}</p>
            <SourceLink href={stop.sourceHref} />
          </article>
        </li>)}
      </ol>
    </div>

    <div className="chimera-expedition-system__evidence">
      <section className="chimera-expedition-system__threat" aria-labelledby="chimera-threat-ladder-title">
        <header><span>Threat escalation</span><h5 id="chimera-threat-ladder-title">What the expedition learns too late</h5></header>
        <ol>{system.threatLevels.map((level, index) => <li key={level.level} style={{ '--threat-width': `${48 + (index * 13)}%` }}>
          <i>{level.level}</i>
          <div><span>Episodes {level.episodes}</span><strong>{level.label}</strong><p>{level.evidence}</p></div>
        </li>)}</ol>
      </section>
      <section className="chimera-expedition-system__cast" aria-labelledby="chimera-expedition-cast-title">
        <header><span>Visual field</span><h5 id="chimera-expedition-cast-title">The team and the new ceiling</h5></header>
        <ExpeditionPortraits portraits={system.portraits} fallbackArtwork={fallbackArtwork} />
        <p>{system.conclusion}</p>
      </section>
    </div>
  </section>;
}

function FrontPortraits({ portraits, fallbackArtwork, title }) {
  return <div className="chimera-three-front-system__portraits" aria-hidden="true">
    {portraits.map((portrait) => <SafeImage
      key={portrait.name}
      mediaId={chimeraPortraitMediaId(portrait.name)}
      mediaVariant="card"
      src={portrait.image}
      fallbackSrc={fallbackArtwork}
      alt=""
      fallbackLabel={portrait.name}
      title={`${portrait.name} · ${title}`}
    />)}
  </div>;
}

function ThreeFrontSystem({ system, fallbackArtwork }) {
  return <section className="chimera-early-system chimera-three-front-system" aria-labelledby="chimera-three-front-title">
    <header className="chimera-early-system__header">
      <div><span>Finished visual system · Phase II</span><h4 id="chimera-three-front-title">{system.title}</h4><p>{system.deck}</p></div>
      <aside><span>Reading rule</span><strong>Do not read these episodes as training alone.</strong><p>The same episode range advances the boys, the colony, and the Association toward one shared operation.</p></aside>
    </header>

    <div className="chimera-three-front-system__matrix" role="table" aria-label="Three-front development across Episodes 86 to 95">
      <div className="chimera-three-front-system__period-row" role="row">
        <div className="chimera-three-front-system__corner" role="columnheader"><span>Parallel fronts</span><strong>Episodes 86–95</strong></div>
        {system.periods.map((period, index) => <div className="chimera-three-front-system__period" role="columnheader" key={period.id}>
          <i>{String(index + 1).padStart(2, '0')}</i><span>Episodes {period.episodes}</span><strong>{period.label}</strong><small>{period.title}</small>
        </div>)}
      </div>

      {system.fronts.map((front) => <article className={`chimera-three-front-system__row chimera-three-front-system__row--${front.id}`} role="row" key={front.id}>
        <header role="rowheader">
          <FrontPortraits portraits={front.portraits} fallbackArtwork={fallbackArtwork} title={front.title} />
          <span>{front.label}</span>
          <h5>{front.title}</h5>
          <p>{front.summary}</p>
          <small>{front.outcome}</small>
        </header>
        {system.periods.map((period) => {
          const event = front.events.find((item) => item.period === period.id);
          return <section role="cell" key={`${front.id}-${period.id}`}>
            <span>{period.label}</span>
            <h6>{event?.title}</h6>
            <p>{event?.summary}</p>
            <SourceLink href={event?.sourceHref}>Evidence</SourceLink>
          </section>;
        })}
      </article>)}
    </div>

    <div className="chimera-three-front-system__convergence">
      <header><span>Phase convergence</span><strong>Three independent developments become one East Gorteau operation.</strong></header>
      <div>{system.convergence.map((record) => <article key={record.label}><span>{record.label}</span><p>{record.value}</p><ArrowRight size={15} /></article>)}</div>
      <p>{system.conclusion}</p>
    </div>
  </section>;
}

export default function ChimeraAntEarlyPhaseSystems({ phaseId, fallbackArtwork }) {
  const system = chimeraAntEarlyPhaseSystemById.get(phaseId);
  if (!system) return null;
  if (phaseId === 'ngl-expedition') return <ExpeditionRouteSystem system={system} fallbackArtwork={fallbackArtwork} />;
  if (phaseId === 'defeat-birth-return') return <ThreeFrontSystem system={system} fallbackArtwork={fallbackArtwork} />;
  return null;
}
