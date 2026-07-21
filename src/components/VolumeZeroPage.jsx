import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Compass,
  ExternalLink,
  Eye,
  HeartHandshake,
  MapPinned,
  Route,
  ShieldCheck,
} from 'lucide-react';
import SafeImage from './SafeImage';
import {
  volumeZeroArtwork,
  volumeZeroChapters,
  volumeZeroConnections,
  volumeZeroExam,
  volumeZeroGallery,
  volumeZeroObjects,
  volumeZeroPeople,
  volumeZeroPromise,
  volumeZeroPublication,
  volumeZeroSources,
  volumeZeroSupportingPeople,
} from '../data/volumeZero';
import './VolumeZeroPage.css';

const localNavigation = [
  ['overview', 'Overview'],
  ['part-one', 'Part One'],
  ['part-two', 'Part Two'],
  ['people', 'People'],
  ['settlement', 'Settlement'],
  ['examination', 'Examination'],
  ['promise', 'The Promise'],
  ['aftermath', 'Aftermath'],
  ['sources', 'Sources'],
];

function SourceArtwork({ artwork, className = '', eager = false, caption = '' }) {
  return <figure className={`v0-artwork${className ? ` ${className}` : ''}`}>
    <SafeImage src={artwork.src} fallbackSrc={artwork.fallback} alt={artwork.alt} eager={eager} priority={eager ? 'high' : 'auto'} />
    {caption && <figcaption><span>{caption}</span><a href={artwork.source} target="_blank" rel="noreferrer noopener">Image source <ExternalLink size={11} /></a></figcaption>}
  </figure>;
}

function SectionHeading({ number, kicker, title, children }) {
  return <header className="v0-section-heading">
    <i>{String(number).padStart(2, '0')}</i>
    <div><span>{kicker}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>
  </header>;
}

function VolumeZeroHero({ onNavigate }) {
  return <header className="v0-hero" id="overview">
    <nav className="v0-route-nav" aria-label="Volume 0 route navigation">
      <button type="button" onClick={() => onNavigate('series')}><ArrowLeft size={15} /> All arcs</button>
      <button type="button" onClick={() => onNavigate('series', 'hunter-exam')}>Hunter Exam <ArrowRight size={15} /></button>
    </nav>
    <div className="v0-hero__book">
      <SourceArtwork artwork={volumeZeroArtwork.cover} eager caption="Theater-exclusive Volume 0 cover" />
      <SourceArtwork artwork={volumeZeroArtwork.forest} className="v0-hero__memory" caption="Lukso Province" />
    </div>
    <div className="v0-hero__copy">
      <span className="v0-eyebrow">Story 00 · Manga-only prologue</span>
      <p className="v0-japanese-title">{volumeZeroPublication.japaneseTitle}</p>
      <h1>Kurapika’s<br />Memories</h1>
      <p className="v0-hero__deck">Before revenge became his purpose, Kurapika had a home, a closest friend, and a promise to return.</p>
      <dl className="v0-hero__facts">
        <div><dt>Format</dt><dd>2 chapters</dd></div>
        <div><dt>Length</dt><dd>63 pages</dd></div>
        <div><dt>Position</dt><dd>Before Ch. 1</dd></div>
        <div><dt>2011 anime</dt><dd>Not adapted</dd></div>
      </dl>
      <div className="v0-hero__actions">
        <a href="#part-one"><BookOpen size={16} /> Begin Part One</a>
        <a href="#part-two">Open Part Two <ArrowRight size={15} /></a>
      </div>
    </div>
  </header>;
}

function PublicationRecord() {
  return <section className="v0-section v0-publication" aria-labelledby="v0-publication-title">
    <SectionHeading number={1} kicker="What Volume 0 is" title="A two-part prequel published outside the numbered manga run.">
      The page treats Volume 0 as its own preserved story, not as a compressed version of a conventional battle arc.
    </SectionHeading>
    <div className="v0-publication__grid">
      <article>
        <span>Publication record</span>
        <h3 id="v0-publication-title">{volumeZeroPublication.title}</h3>
        <dl>
          <div><dt>Format</dt><dd>{volumeZeroPublication.format}</dd></div>
          <div><dt>Total length</dt><dd>{volumeZeroPublication.totalPages} pages</dd></div>
          <div><dt>Chronology</dt><dd>{volumeZeroPublication.storyPosition}</dd></div>
          <div><dt>Adaptation</dt><dd>{volumeZeroPublication.animeStatus}</dd></div>
        </dl>
      </article>
      <ol className="v0-publication__timeline">
        {volumeZeroPublication.releases.map((item, index) => <li key={item.date}><i>{String(index + 1).padStart(2, '0')}</i><div><time>{item.date}</time><strong>{item.label}</strong></div></li>)}
      </ol>
    </div>
  </section>;
}

function ReadingPath() {
  const steps = [
    ['One year earlier', 'Kurapika and Pairo discover Sheila in the forest.'],
    ['Chapter 0A', 'The outside world becomes a shared dream.'],
    ['Chapter 0B', 'Kurapika undertakes the exit examination.'],
    ['Departure', 'He leaves intending to find help and return.'],
    ['Six weeks later', 'The promised return becomes impossible.'],
  ];
  return <section className="v0-reading-path" aria-labelledby="v0-reading-path-title">
    <header><span>Reading path</span><h2 id="v0-reading-path-title">Hope is established before the reader is asked to confront loss.</h2></header>
    <ol>{steps.map(([label, detail], index) => <li key={label} className={index === steps.length - 1 ? 'is-aftermath' : ''}><i>{String(index + 1).padStart(2, '0')}</i><div><strong>{label}</strong><p>{detail}</p></div></li>)}</ol>
  </section>;
}

function MemoryChapter({ chapter, sectionNumber }) {
  return <section id={chapter.id} className={`v0-section v0-memory-chapter v0-memory-chapter--${chapter.accent}`} aria-labelledby={`${chapter.id}-title`}>
    <header className="v0-memory-chapter__hero">
      <SourceArtwork artwork={chapter.cover} caption={`${chapter.code} chapter cover`} />
      <div>
        <span>{chapter.code} · {chapter.pages} pages</span>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <p>{chapter.deck}</p>
        <a href={chapter.source} target="_blank" rel="noreferrer noopener">Hunterpedia chapter record <ExternalLink size={12} /></a>
      </div>
      <i>{String(sectionNumber).padStart(2, '0')}</i>
    </header>
    <ol className="v0-scene-ledger">
      {chapter.scenes.map((scene, index) => <li key={`${chapter.code}-${scene.number}`} className={index % 2 ? 'is-reversed' : ''}>
        <SourceArtwork artwork={scene.artwork} caption={`${chapter.code} · Scene ${scene.number}`} />
        <div>
          <span>{chapter.code}.{scene.number}</span>
          <h3>{scene.title}</h3>
          <p>{scene.detail}</p>
          <aside><strong>What changes</strong><p>{scene.change}</p></aside>
        </div>
      </li>)}
    </ol>
  </section>;
}

function PeopleSection() {
  return <section id="people" className="v0-section v0-people" aria-labelledby="v0-people-title">
    <SectionHeading number={4} kicker="The emotional structure" title="Three people. Three directions.">
      The page gives Kurapika, Pairo, and Sheila more visual weight than every secondary record combined.
    </SectionHeading>
    <div className="v0-people__triangle" id="v0-people-title">
      {volumeZeroPeople.map((person) => <article key={person.name}>
        <SourceArtwork artwork={person.artwork} />
        <span>{person.role}</span><h3>{person.name}</h3><p>{person.note}</p>
        <a href={person.source} target="_blank" rel="noreferrer noopener">Character source <ExternalLink size={11} /></a>
      </article>)}
    </div>
    <div className="v0-supporting-people">
      {volumeZeroSupportingPeople.map(([name, note]) => <article key={name}><h3>{name}</h3><p>{note}</p></article>)}
    </div>
  </section>;
}

function SettlementSection({ onNavigate }) {
  return <section id="settlement" className="v0-section v0-settlement" aria-labelledby="v0-settlement-title">
    <SectionHeading number={5} kicker="The protected world" title="The Kurta settlement is both home and boundary.">
      This is an editorial spatial reconstruction based on locations and movements described in Volume 0, not a claim of exact geography.
    </SectionHeading>
    <div className="v0-settlement__layout">
      <SourceArtwork artwork={volumeZeroArtwork.forest} caption="Lukso Province and the settlement forest" />
      <div className="v0-settlement__map" id="v0-settlement-title">
        <article><i>01</i><span>Forest boundary</span><p>The natural barrier that separates the settlement from the wider world.</p></article>
        <article><i>02</i><span>Homes and gathering spaces</span><p>The social world Kurapika knows before Sheila arrives.</p></article>
        <article><i>03</i><span>Elder’s hut</span><p>The place where protection, law, examination, and permission are negotiated.</p></article>
        <article><i>04</i><span>Hidden reading place</span><p>Where Kurapika and Pairo study Dino Hunter and the outside language.</p></article>
        <article><i>05</i><span>Route toward Nancha City</span><p>The path that converts a forbidden idea into a measurable journey.</p></article>
      </div>
    </div>
    <button type="button" className="v0-inline-action" onClick={() => onNavigate('reference', 'atlas', { search: 'Kurta' })}><MapPinned size={15} /> Open the world atlas</button>
  </section>;
}

function ExaminationSection() {
  return <section id="examination" className="v0-section v0-examination" aria-labelledby="v0-examination-title">
    <SectionHeading number={6} kicker="Purpose-built story system" title="The exit examination tests knowledge, judgment, and emotional control." />
    <div className="v0-exam-layers" id="v0-examination-title">
      {volumeZeroExam.layers.map(([title, note], index) => <article key={title}><i>{String(index + 1).padStart(2, '0')}</i><h3>{title}</h3><p>{note}</p></article>)}
    </div>
    <div className="v0-exam-card">
      <header><Route size={20} /><div><span>Final examination</span><h3>Kurta settlement → Nancha City → return</h3></div></header>
      <dl>{volumeZeroExam.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </div>
    <div className="v0-route-map" aria-label="Editorial route from the Kurta settlement to Nancha City">
      <span>Kurta settlement</span><i>6-hour outward journey</i><span>Nancha City</span><i>shopping and confrontation</i><span>Return route</span>
    </div>
  </section>;
}

function ScarletEyesSection() {
  return <section className="v0-section v0-scarlet" aria-labelledby="v0-scarlet-title">
    <SectionHeading number={7} kicker="Inheritance, emotion, and danger" title="The Scarlet Eyes are not presented here as a Nen ability.">
      Volume 0 treats them as an inherited Kurta characteristic activated by intense emotion. The examination is about concealment and control, not formal Nen instruction.
    </SectionHeading>
    <div className="v0-scarlet__layout">
      <SourceArtwork artwork={volumeZeroArtwork.scarlet} caption="Chapter 0B · emotional activation" />
      <ol id="v0-scarlet-title">
        <li><i>01</i><div><strong>Calm</strong><p>Natural eye state and ordinary judgment.</p></div></li>
        <li><i>02</i><div><strong>Escalation</strong><p>Anger and fear make concealment increasingly difficult.</p></div></li>
        <li><i>03</i><div><strong>Scarlet state</strong><p>Emotion becomes visible, physical danger increases, and Kurapika’s control narrows.</p></div></li>
      </ol>
    </div>
  </section>;
}

function ObjectShelf() {
  return <section className="v0-section v0-objects" aria-labelledby="v0-objects-title">
    <SectionHeading number={8} kicker="Objects and symbols" title="Ordinary items carry the page’s rules, knowledge, and promises." />
    <div className="v0-object-shelf" id="v0-objects-title">
      {volumeZeroObjects.map(([name, ownership, note], index) => <article key={name}><i>{String(index + 1).padStart(2, '0')}</i><span>{ownership}</span><h3>{name}</h3><p>{note}</p></article>)}
    </div>
  </section>;
}

function PromiseSection() {
  return <section id="promise" className="v0-section v0-promise" aria-labelledby="v0-promise-title">
    <SectionHeading number={9} kicker="The emotional center" title="Kurapika leaves to help Pairo and return home—not to seek revenge." />
    <ol id="v0-promise-title">{volumeZeroPromise.map(([number, title, note]) => <li key={number}><i>{number}</i><div><h3>{title}</h3><p>{note}</p></div></li>)}</ol>
    <blockquote><HeartHandshake size={24} /><p>The tragedy of Volume 0 is not simply that Kurapika loses his clan. It is that the future he and Pairo planned still exists in his promises after the people and home required to fulfill them are gone.</p></blockquote>
  </section>;
}

function StateChanges() {
  const changes = [
    ['Kurapika', 'Protected child arguing for freedom', 'Traveler responsible for fulfilling a promise'],
    ['The outside world', 'Forbidden abstraction', 'A real place containing help, fear, commerce, and prejudice'],
    ['The Elder', 'Restrictive authority', 'Reluctant protector who permits departure'],
    ['Pairo', 'Partner in a shared dream', 'The person waiting for Kurapika’s return'],
  ];
  return <section className="v0-section v0-state-changes" aria-labelledby="v0-state-title">
    <SectionHeading number={10} kicker="Before and after" title="Every major relationship changes before the massacre is even reported." />
    <div id="v0-state-title">{changes.map(([subject, before, after]) => <article key={subject}><h3>{subject}</h3><div><span>Before</span><p>{before}</p></div><ArrowRight size={18} /><div><span>After</span><p>{after}</p></div></article>)}</div>
  </section>;
}

function AftermathSection({ onNavigate }) {
  return <section id="aftermath" className="v0-section v0-aftermath" aria-labelledby="v0-aftermath-title">
    <SectionHeading number={11} kicker="Absence" title="The promised return becomes impossible." />
    <div className="v0-aftermath__summary" id="v0-aftermath-title">
      <Clock3 size={22} /><p>Six weeks after Kurapika’s departure, the massacre of the Kurta Clan was reported to the world.</p>
    </div>
    <details className="v0-aftermath__details">
      <summary>Open source-context note</summary>
      <div><ShieldCheck size={19} /><p>The Hunterpedia summary describes 128 victims and contains graphic detail about the attack and the removal of the Scarlet Eyes. This page keeps that description collapsed and focuses on its narrative consequence rather than reproducing it as spectacle.</p><a href="https://hunterxhunter.fandom.com/wiki/Kurapika%27s_Memories%3A_Part_Two" target="_blank" rel="noreferrer noopener">Open Part Two source <ExternalLink size={12} /></a></div>
    </details>
    <div className="v0-connections">
      <header><span>Editorial connections · interpretation</span><h3>Why Volume 0 matters later</h3></header>
      {volumeZeroConnections.map(([title, note]) => <article key={title}><h4>{title}</h4><p>{note}</p></article>)}
      <div className="v0-connections__actions">
        <button type="button" onClick={() => onNavigate('series', 'hunter-exam')}>Continue to Hunter Exam <ArrowRight size={15} /></button>
        <button type="button" onClick={() => onNavigate('series', 'yorknew-city')}>Open Yorknew City</button>
        <button type="button" onClick={() => onNavigate('series', 'succession-contest')}>Open Succession Contest</button>
      </div>
    </div>
  </section>;
}

function GallerySection() {
  return <section className="v0-section v0-gallery" aria-labelledby="v0-gallery-title">
    <SectionHeading number={12} kicker="Visual archive" title="A curated sequence of Volume 0 scenes." />
    <div id="v0-gallery-title">{volumeZeroGallery.map((item) => <article key={`${item.group}-${item.title}`}>
      <SourceArtwork artwork={item.artwork} />
      <div><span>{item.group}</span><h3>{item.title}</h3><p>{item.note}</p><a href={item.artwork.source} target="_blank" rel="noreferrer noopener">Scene source <ExternalLink size={11} /></a></div>
    </article>)}</div>
  </section>;
}

function SourcesSection() {
  return <section id="sources" className="v0-section v0-sources" aria-labelledby="v0-sources-title">
    <SectionHeading number={13} kicker="Hunterpedia / Fandom" title="Sources attached directly to the memory record." />
    <div id="v0-sources-title">{volumeZeroSources.map((source) => <a href={source.href} target="_blank" rel="noreferrer noopener" key={source.href}><BookOpen size={17} /><span><strong>{source.label}</strong><small>{source.note}</small></span><ExternalLink size={13} /></a>)}</div>
  </section>;
}

export default function VolumeZeroPage({ onNavigate }) {
  return <article className="volume-zero-page">
    <VolumeZeroHero onNavigate={onNavigate} />
    <nav className="v0-local-nav" aria-label="Volume 0 page sections"><div>{localNavigation.map(([id, label], index) => <a href={`#${id}`} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></a>)}</div></nav>
    <main className="v0-canvas">
      <PublicationRecord />
      <ReadingPath />
      <MemoryChapter chapter={volumeZeroChapters[0]} sectionNumber={2} />
      <MemoryChapter chapter={volumeZeroChapters[1]} sectionNumber={3} />
      <PeopleSection />
      <SettlementSection onNavigate={onNavigate} />
      <ExaminationSection />
      <ScarletEyesSection />
      <ObjectShelf />
      <PromiseSection />
      <StateChanges />
      <AftermathSection onNavigate={onNavigate} />
      <GallerySection />
      <SourcesSection />
    </main>
    <footer className="v0-next-page">
      <div><Compass size={22} /><span>Story 01</span><h2>Hunter Exam</h2><p>Kurapika enters the wider world and seeks the status, access, and relationships required for everything that follows.</p></div>
      <button type="button" onClick={() => onNavigate('series', 'hunter-exam')}>Continue <ArrowRight size={18} /></button>
    </footer>
  </article>;
}
