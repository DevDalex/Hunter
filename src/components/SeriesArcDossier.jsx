import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getSeriesArcDossier, seriesArcDossiers } from '../data/seriesArcDossiers';

const views = [
  ['map', 'Study map'],
  ['characters', 'Character journeys'],
  ['conflicts', 'Conflicts'],
  ['chronology', 'Chronology'],
];

export default function SeriesArcDossier({ activeArc, chapters, onSelectArc, onOpenChapter, onOpenSuccession }) {
  const initialArc = getSeriesArcDossier(activeArc) ? activeArc : seriesArcDossiers[0].id;
  const [selectedArcId, setSelectedArcId] = useState(initialArc);
  const [selectedPhaseId, setSelectedPhaseId] = useState(() => getSeriesArcDossier(initialArc).phases[0].id);
  const [view, setView] = useState('map');
  const dossier = getSeriesArcDossier(selectedArcId) || seriesArcDossiers[0];
  const selectedPhase = dossier.phases.find((item) => item.id === selectedPhaseId) || dossier.phases[0];
  const phaseChapters = useMemo(() => chapters.filter((chapter) => chapter.number >= selectedPhase.range[0] && chapter.number <= selectedPhase.range[1]), [chapters, selectedPhase]);

  useEffect(() => {
    if (!getSeriesArcDossier(activeArc)) return;
    setSelectedArcId(activeArc);
  }, [activeArc]);

  useEffect(() => {
    setSelectedPhaseId(dossier.phases[0].id);
  }, [dossier.id]);

  const chooseArc = (arcId) => {
    setSelectedArcId(arcId);
    setView('map');
    onSelectArc?.(arcId);
  };

  return (
    <section className="series-arc-dossier" id="arc-study">
      <div className="section-heading">
        <div><span className="section-kicker">Arc dossiers</span><h2>Read each arc as a sequence of movements.</h2></div>
        <p>Choose one arc to follow its internal sequence, character movement, conflicts, Nen development, consequences, and chapters. These movements organize the reading; they are not additional official arcs.</p>
      </div>

      <nav className="series-arc-dossier__nav" aria-label="Select a completed arc dossier">
        {seriesArcDossiers.map((arc) => <button className={arc.id === dossier.id ? 'is-active' : ''} aria-current={arc.id === dossier.id ? 'page' : undefined} onClick={() => chooseArc(arc.id)} key={arc.id}><span>{arc.order}</span><strong>{arc.title}</strong><small>Ch. {arc.range[0]}–{arc.range[1]}</small></button>)}
        <button className="is-succession-link" onClick={onOpenSuccession}><span>07</span><strong>Succession Contest</strong><small>Open dedicated dossier <ArrowRight size={11} /></small></button>
      </nav>

      <article className="series-arc-dossier__hero without-image">
        <div className="series-arc-dossier__intro">
          <span>{dossier.status} · Chapters {dossier.range[0]}–{dossier.range[1]} · {dossier.volumes}</span>
          <h3>{dossier.title}</h3>
          <p>{dossier.premise}</p>
          <blockquote><b>Central study question</b>{dossier.centralQuestion}</blockquote>
          <div>{dossier.themes.map((theme) => <small key={theme}>{theme}<i>site analysis</i></small>)}</div>
          <a href={dossier.source} target="_blank" rel="noreferrer">Open Hunterpedia arc source <ExternalLink size={12} /></a>
        </div>
      </article>

      <nav className="series-arc-dossier__views" aria-label="Arc dossier views">
        {views.map(([id, label]) => <button className={view === id ? 'is-active' : ''} aria-pressed={view === id} onClick={() => setView(id)} key={id}>{label}</button>)}
      </nav>

      {view === 'map' && <div className="series-phase-workspace">
        <div className="series-phase-track" aria-label={`${dossier.title} study phases`}>
          {dossier.phases.map((item, index) => <button className={item.id === selectedPhase.id ? 'is-active' : ''} aria-pressed={item.id === selectedPhase.id} onClick={() => setSelectedPhaseId(item.id)} key={item.id}><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{item.title}</strong><small>Ch. {item.range[0]}–{item.range[1]}</small></span></button>)}
        </div>
        <article className="series-phase-detail">
          <header><div><span>Movement {dossier.phases.indexOf(selectedPhase) + 1} of {dossier.phases.length} · Chapters {selectedPhase.range[0]}–{selectedPhase.range[1]}</span><h3>{selectedPhase.title}</h3><p>{selectedPhase.summary}</p></div><a href={selectedPhase.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a></header>
          <blockquote><b>Structural shift</b>{selectedPhase.shift}</blockquote>
          <div className="series-phase-detail__fields">
            <section><span>People in focus</span>{selectedPhase.people.map((item) => <small key={item}>{item}</small>)}</section>
            <section><span>Factions</span>{selectedPhase.factions.map((item) => <small key={item}>{item}</small>)}</section>
            <section><span>Locations</span>{selectedPhase.places.map((item) => <small key={item}>{item}</small>)}</section>
            <section><span>Nen / mechanics</span>{selectedPhase.nen.map((item) => <small key={item}>{item}</small>)}</section>
            <section><span>Conflicts / operations</span>{selectedPhase.conflicts.map((item) => <small key={item}>{item}</small>)}</section>
          </div>
          <footer><span>What this changes</span><p>{selectedPhase.consequence}</p></footer>
        </article>
        <section className="series-phase-chapters">
          <header><div><span>{phaseChapters.length} chapters</span><h3>Reading sequence</h3></div><p>Open a chapter record without losing the arc-level context.</p></header>
          <div>{phaseChapters.map((chapter) => <button onClick={() => onOpenChapter(chapter)} key={chapter.number}><i>{String(chapter.number).padStart(3, '0')}</i><span><strong>{chapter.title}</strong><small>{chapter.researchStatus}</small></span><ArrowRight size={13} /></button>)}</div>
        </section>
      </div>}

      {view === 'characters' && <div className="series-journey-grid">
        {dossier.characterJourneys.map((record, index) => <article key={record.name}><header><i>{String(index + 1).padStart(2, '0')}</i><div><span>{record.role}</span><h3>{record.name}</h3></div></header><dl><div><dt>Opening position</dt><dd>{record.opening}</dd></div><div><dt>Arc movement</dt><dd>{record.development}</dd></div><div><dt>Closing position</dt><dd>{record.closing}</dd></div></dl><a href={record.source} target="_blank" rel="noreferrer">Character source <ExternalLink size={11} /></a></article>)}
      </div>}

      {view === 'conflicts' && <div className="series-conflict-grid">
        {dossier.conflicts.map((record) => <article key={record.name}><header><span>{record.type} · Chapters {record.chapters}</span><h3>{record.name}</h3><p>{record.participants}</p></header><dl><div><dt>Objective</dt><dd>{record.objective}</dd></div><div><dt>Abilities / tools</dt><dd>{record.abilities}</dd></div><div><dt>Turning point</dt><dd>{record.turningPoint}</dd></div><div><dt>Outcome</dt><dd>{record.outcome}</dd></div><div><dt>Consequence</dt><dd>{record.consequence}</dd></div></dl><a href={record.source} target="_blank" rel="noreferrer">Conflict source <ExternalLink size={11} /></a></article>)}
      </div>}

      {view === 'chronology' && <div className="series-chronology">
        <header><div><span>{dossier.chronology.precision}</span><h3>{dossier.chronology.anchor}</h3><p>{dossier.chronology.route}</p></div><a href={dossier.source} target="_blank" rel="noreferrer">Arc chronology source <ExternalLink size={11} /></a></header>
        <ol>{dossier.phases.map((item, index) => <li key={item.id}><i>{String(index + 1).padStart(2, '0')}</i><div><span>Chapters {item.range[0]}–{item.range[1]}</span><h3>{item.title}</h3><p>{item.summary}</p><b>{item.consequence}</b></div><button onClick={() => { setSelectedPhaseId(item.id); setView('map'); }}>Open phase</button></li>)}</ol>
        <section className="series-arc-dossier__closing"><div><span>Carry-forward questions</span><ul>{dossier.openThreads.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>Adaptation boundary</span><p>{dossier.adaptation}</p></div></section>
      </div>}
    </section>
  );
}
