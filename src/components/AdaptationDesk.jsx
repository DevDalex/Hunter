import { useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Film, Grid3X3, Layers3 } from 'lucide-react';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

const adaptationArcs = [
  { id: 'hunter-exam', short: 'Hunter Exam', title: 'Hunter Exam + Zoldyck Family', chapters: '1–43', episodes: [1, 26], color: '#8b443e', note: 'Formation of the central group, the exam, and the rescue trip to Kukuroo Mountain.' },
  { id: 'heavens-arena', short: 'Heavens Arena', title: 'Heavens Arena', chapters: '44–63', episodes: [27, 36], color: '#8a6828', note: 'Nen is formally introduced through Wing, Zushi, Hisoka, and the 200th Floor.' },
  { id: 'yorknew', short: 'Yorknew', title: 'Yorknew City', chapters: '64–119', episodes: [37, 58], color: '#6d3f59', note: 'Kurapika, the Nostrade group, the underground auction, and the Phantom Troupe converge.' },
  { id: 'greed-island', short: 'Greed Island', title: 'Greed Island', chapters: '120–185', episodes: [59, 75], color: '#477052', note: 'The game, Biscuit’s training, Razor, the Bombers, and the path to Kite.' },
  { id: 'chimera-ant', short: 'Chimera Ant', title: 'Chimera Ant', chapters: '186–318', episodes: [76, 136], color: '#4f6750', note: 'The longest adapted section, from Kite and NGL through the Palace Invasion and Rose aftermath.' },
  { id: 'election', short: 'Election', title: '13th Hunter Chairman Election', chapters: '319–339', episodes: [137, 148], color: '#435f71', note: 'The election, Alluka and Nanika, Gon’s recovery, and the meeting with Ging conclude the series.' },
];

const episodes = Array.from({ length: 148 }, (_, index) => {
  const number = index + 1;
  const arc = adaptationArcs.find((item) => number >= item.episodes[0] && number <= item.episodes[1]);
  return { number, arc };
});

export default function AdaptationDesk({ onOpenChapters }) {
  const [selectedArcId, setSelectedArcId] = useState('hunter-exam');
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState(1);
  const selectedArc = adaptationArcs.find((item) => item.id === selectedArcId) || adaptationArcs[0];
  const selectedEpisodes = useMemo(() => episodes.filter((episode) => episode.arc.id === selectedArc.id), [selectedArc.id]);
  const selectedEpisode = episodes.find((episode) => episode.number === selectedEpisodeNumber) || episodes[0];
  const arcPosition = selectedEpisode.number - selectedEpisode.arc.episodes[0] + 1;
  const arcEpisodeCount = selectedEpisode.arc.episodes[1] - selectedEpisode.arc.episodes[0] + 1;

  const chooseArc = (arc) => {
    setSelectedArcId(arc.id);
    setSelectedEpisodeNumber(arc.episodes[0]);
  };
  const chooseEpisode = (number) => {
    const episode = episodes[number - 1];
    if (!episode) return;
    setSelectedEpisodeNumber(number);
    setSelectedArcId(episode.arc.id);
  };

  return (
    <section className="adaptation-desk">
      <header className="adaptation-hero">
        <div><span className="section-kicker">2011 television adaptation</span><h2>148 episodes, mapped to six completed arcs.</h2><p>The adaptation desk keeps episode order and manga source ranges visible together. Select an arc to isolate its television run without requiring 339 separate deep chapter dossiers.</p></div>
        <dl><div><dt>Episodes</dt><dd>148</dd></div><div><dt>Manga covered</dt><dd>Ch. 1–339</dd></div><div><dt>Volume 0</dt><dd>Not adapted</dd></div><div><dt>Succession</dt><dd>Manga-only</dd></div></dl>
      </header>

      <div className="adaptation-strip" aria-label="2011 adaptation by arc">
        {adaptationArcs.map((arc) => {
          const count = arc.episodes[1] - arc.episodes[0] + 1;
          return <button type="button" className={arc.id === selectedArc.id ? 'is-active' : ''} style={{ '--arc-color': arc.color, '--arc-span': count }} onClick={() => chooseArc(arc)} key={arc.id}><span>{arc.episodes[0]}–{arc.episodes[1]}</span><strong>{arc.short}</strong><small>{count} episodes</small></button>;
        })}
      </div>

      <div className="adaptation-workbench">
        <article>
          <header><span><Film size={15} /> Episodes {selectedArc.episodes[0]}–{selectedArc.episodes[1]}</span><h3>{selectedArc.title}</h3><p>{selectedArc.note}</p></header>
          <dl><div><dt>Manga chapters</dt><dd>{selectedArc.chapters}</dd></div><div><dt>Episode count</dt><dd>{selectedEpisodes.length}</dd></div><div><dt>Continuity</dt><dd>2011 television series</dd></div></dl>
          <footer><button type="button" onClick={() => onOpenChapters(selectedArc.id)}><Layers3 size={15} /> Open lightweight chapter references <ArrowRight size={13} /></button><a href={wiki('List_of_Episodes_(2011_series)')} target="_blank" rel="noreferrer">Hunterpedia episode list <ExternalLink size={11} /></a></footer>
        </article>
        <section aria-labelledby="episode-grid-title">
          <header><Grid3X3 size={17} /><div><span>Episode index</span><h3 id="episode-grid-title">{selectedArc.short}</h3></div></header>
          <div className="episode-grid">{selectedEpisodes.map(({ number, arc }) => <button type="button" className={number === selectedEpisodeNumber ? 'is-active' : ''} onClick={() => chooseEpisode(number)} style={{ '--episode-color': arc.color }} aria-label={`Inspect episode ${number}`} key={number}>{number}</button>)}</div>
          <aside className="episode-inspector" aria-live="polite">
            <header><div><span>Selected television record</span><strong>Episode {selectedEpisode.number}</strong><small>{selectedEpisode.arc.title}</small></div><nav aria-label="Previous or next episode"><button type="button" disabled={selectedEpisode.number === 1} onClick={() => chooseEpisode(selectedEpisode.number - 1)} aria-label="Previous episode"><ChevronLeft size={16} /></button><button type="button" disabled={selectedEpisode.number === 148} onClick={() => chooseEpisode(selectedEpisode.number + 1)} aria-label="Next episode"><ChevronRight size={16} /></button></nav></header>
            <div className="episode-inspector__progress"><i style={{ width: `${(arcPosition / arcEpisodeCount) * 100}%`, background: selectedEpisode.arc.color }} /><span>{arcPosition} of {arcEpisodeCount} in this arc</span></div>
            <dl><div><dt>Series position</dt><dd>{selectedEpisode.number} / 148</dd></div><div><dt>Manga source window</dt><dd>Ch. {selectedEpisode.arc.chapters}</dd></div><div><dt>Local depth</dt><dd>Episode-level source index</dd></div></dl>
            <p>The exact title, original air date, credits, synopsis, and adaptation notes remain attached to Hunterpedia’s individual episode record. This archive keeps the complete 148-episode order and its arc-level manga boundary visible without inventing a finer chapter match.</p>
            <footer><a href={wiki(`Episode_${selectedEpisode.number}_(2011)`)} target="_blank" rel="noreferrer">Open Episode {selectedEpisode.number} on Hunterpedia <ExternalLink size={11} /></a><a href={wiki('List_of_Episodes_(2011_series)')} target="_blank" rel="noreferrer">Open the full episode table <ExternalLink size={11} /></a></footer>
          </aside>
        </section>
      </div>

      <aside className="adaptation-boundary"><strong>Boundary</strong><p>The 2011 anime concludes with the Chairman Election material. Volume 0 and chapters 340 onward remain separate manga reading paths in this archive.</p><a href={wiki('Hunter_%C3%97_Hunter_(2011_TV_series)')} target="_blank" rel="noreferrer">2011 series source <ExternalLink size={11} /></a></aside>
    </section>
  );
}
