import { useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink, Eye, Link2, Map } from 'lucide-react';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

const chapters = [
  {
    id: 'part-one', number: '0A', label: 'Part One', title: 'The world enters the forest',
    premise: 'Kurapika and Pairo discover an injured traveler named Sheila. Her stories—and the book D Hunter—give the outside world a shape the hidden settlement has tried to keep distant.',
    movements: [
      ['01', 'A hidden life', 'The Kurta settlement is protected by isolation, rules, and fear of how outsiders respond to the Scarlet Eyes.'],
      ['02', 'Sheila is found', 'Kurapika and Pairo secretly help an injured traveler recover in the forest.'],
      ['03', 'D Hunter', 'A book of adventures turns distant places into a possible future rather than an abstract danger.'],
      ['04', 'A promise forms', 'Kurapika’s wish to see the world becomes tied to Pairo, whose health prevents the same freedom.'],
    ],
    consequence: 'The outside world changes from forbidden territory into a promise Kurapika intends to keep.',
    source: wiki('Kurapika%27s_Memories%3A_Part_One'),
  },
  {
    id: 'part-two', number: '0B', label: 'Part Two', title: 'The test, departure, and loss',
    premise: 'Kurapika faces the settlement’s test for permission to leave. The chapter turns his fierce self-control, Pairo’s support, and the promise of return into the emotional foundation of everything that follows.',
    movements: [
      ['01', 'The outside-world test', 'Kurapika must navigate provocation without allowing his eyes to turn scarlet.'],
      ['02', 'Pairo’s intervention', 'Pairo’s judgment and loyalty matter as much as Kurapika’s ability to complete the formal trial.'],
      ['03', 'Departure', 'Kurapika leaves with the intention of finding help for Pairo and returning with stories of the world.'],
      ['04', 'Six weeks later', 'The story closes the distance between hopeful departure and the massacre that defines Kurapika’s surviving life.'],
    ],
    consequence: 'The journey becomes both an unfulfilled promise to Pairo and the starting point of Kurapika’s search for the stolen Scarlet Eyes.',
    source: wiki('Kurapika%27s_Memories%3A_Part_Two'),
  },
];

const bridge = [
  ['Before departure', 'Curiosity', 'Kurapika wants to understand a world his clan has learned to fear.'],
  ['Volume 0', 'Promise', 'Leaving is meant to help Pairo and to create a route back home.'],
  ['Hunter Exam', 'Chosen family', 'Gon, Killua, and Leorio become relationships not organized around loss.'],
  ['Yorknew City', 'Judgment', 'The Phantom Troupe and the Scarlet Eyes turn grief into a dangerous system of vows.'],
  ['Succession', 'Protection', 'Guarding Woble forces revenge, responsibility, and lifespan into the same room.'],
];

export default function KurapikaMemories({ onNavigate }) {
  const [selectedId, setSelectedId] = useState(chapters[0].id);
  const selected = chapters.find((chapter) => chapter.id === selectedId) || chapters[0];

  return (
    <section className="memories-archive">
      <header className="memories-hero">
        <div className="memories-hero__copy">
          <span className="section-kicker">Essential supplementary manga · Volume 0</span>
          <h2>Kurapika’s Memories</h2>
          <p>Two chapters change Kurapika’s backstory from a statement of loss into a lived sequence: a protected childhood, Pairo, Sheila, the outside world, a promise, and the absence that follows.</p>
          <dl>
            <div><dt>Format</dt><dd>Two manga chapters</dd></div>
            <div><dt>Story position</dt><dd>Before Chapter 1</dd></div>
            <div><dt>2011 anime</dt><dd>Not adapted</dd></div>
          </dl>
        </div>
        <figure data-image-frame>
          <img src="/media/portraits/kurapika.webp" alt="Kurapika portrait sourced from Hunterpedia" />
          <figcaption><span>Subject 004</span><strong>Kurapika</strong><small>Childhood → survivor → Blacklist Hunter → royal bodyguard</small></figcaption>
        </figure>
      </header>

      <nav className="memories-chapter-switcher" aria-label="Kurapika's Memories chapters">
        {chapters.map((chapter) => <button type="button" className={chapter.id === selected.id ? 'is-active' : ''} aria-pressed={chapter.id === selected.id} onClick={() => setSelectedId(chapter.id)} key={chapter.id}><i>{chapter.number}</i><span><small>{chapter.label}</small><strong>{chapter.title}</strong></span><ArrowRight size={16} /></button>)}
      </nav>

      <article className="memory-study">
        <header><div><span>{selected.number} · {selected.label}</span><h3>{selected.title}</h3><p>{selected.premise}</p></div><a href={selected.source} target="_blank" rel="noreferrer">Hunterpedia chapter source <ExternalLink size={12} /></a></header>
        <ol>{selected.movements.map(([number, title, detail]) => <li key={number}><i>{number}</i><div><strong>{title}</strong><p>{detail}</p></div></li>)}</ol>
        <footer><Eye size={19} /><div><span>What this changes</span><p>{selected.consequence}</p></div></footer>
      </article>

      <section className="memories-people" aria-labelledby="memory-people-title">
        <header><span className="section-kicker">The emotional structure</span><h3 id="memory-people-title">Three people. Three directions.</h3></header>
        <div>
          <article><i>K</i><span>Kurapika</span><h4>The one who leaves</h4><p>His intelligence and anger are visible before vengeance gives them a target.</p><a href={wiki('Kurapika')} target="_blank" rel="noreferrer">Character source <ExternalLink size={11} /></a></article>
          <article><i>P</i><span>Pairo</span><h4>The reason to return</h4><p>Pairo supports the journey even though he cannot take it, making Kurapika’s departure a shared promise.</p><a href={wiki('Pairo')} target="_blank" rel="noreferrer">Character source <ExternalLink size={11} /></a></article>
          <article><i>S</i><span>Sheila</span><h4>The outside world arrives</h4><p>Sheila’s presence and D Hunter connect the secluded children to exploration, uncertainty, and the larger world.</p><a href={wiki('Sheila')} target="_blank" rel="noreferrer">Character source <ExternalLink size={11} /></a></article>
        </div>
      </section>

      <section className="memories-bridge" aria-labelledby="memory-bridge-title">
        <header><div><span className="section-kicker">Cross-era character line</span><h3 id="memory-bridge-title">The promise keeps changing form.</h3></div><p>This is an editorial study path. Each stop links the childhood material to a later role without pretending the motifs are literal in-story categories.</p></header>
        <ol>{bridge.map(([period, title, detail], index) => <li key={period}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{period}</small><strong>{title}</strong><p>{detail}</p></span></li>)}</ol>
        <div className="memories-bridge__actions">
          <button type="button" onClick={() => onNavigate('reference', 'encyclopedia', { category: 'characters', search: 'Kurapika' })}><BookOpen size={16} /> Open Kurapika’s full record</button>
          <button type="button" onClick={() => onNavigate('succession', 'overview')}><Map size={16} /> Continue to Succession</button>
          <a href={wiki('Kurta_Clan')} target="_blank" rel="noreferrer"><Link2 size={16} /> Kurta Clan source</a>
        </div>
      </section>
    </section>
  );
}
