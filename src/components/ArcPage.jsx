import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ExternalLink,
  MapPinned,
  Orbit,
  Shield,
  Swords,
  UsersRound,
} from 'lucide-react';
import { chapters } from '../data/chapters';
import { storyArcPageById } from '../data/storyArcPages';
import SafeImage from './SafeImage';
import './ArcPage.css';

const sectionLinks = [
  ['context', 'Before the arc'],
  ['premise', 'Premise'],
  ['chronology', 'Timeline'],
  ['characters', 'Characters'],
  ['factions', 'Factions'],
  ['locations', 'Locations'],
  ['nen', 'Nen'],
  ['conflicts', 'Conflicts'],
  ['objects', 'Objects'],
  ['themes', 'Themes'],
  ['changes', 'Changes'],
  ['ending', 'Ending'],
  ['transition', 'Next arc'],
  ['adaptation', 'Manga vs anime'],
  ['records', 'Records'],
  ['sources', 'Sources'],
];

const rangeText = (range, prefix) => Array.isArray(range) ? `${prefix} ${range[0]}–${range[1]}` : 'Supplementary manga';
const targetForArc = (id) => id === 'succession-contest' ? ['series', 'succession-contest'] : ['series', id];

function ArcRouteButton({ arcId, onNavigate, children, className = '' }) {
  if (!arcId) return null;
  const [view, target] = targetForArc(arcId);
  return <button type="button" className={className} onClick={() => onNavigate(view, target)}>{children}</button>;
}

function ArcSection({ id, number, kicker, title, children, className = '' }) {
  return <section id={`arc-${id}`} className={`arc-page__section ${className}`.trim()} aria-labelledby={`arc-${id}-title`}>
    <header className="arc-page__section-heading">
      <i>{String(number).padStart(2, '0')}</i>
      <div><span>{kicker}</span><h2 id={`arc-${id}-title`}>{title}</h2></div>
    </header>
    {children}
  </section>;
}

function ArcHero({ arc, onNavigate }) {
  return <header className="arc-page__hero">
    <div className="arc-page__hero-art" aria-hidden="true">
      {arc.visual.hero.map((image, index) => <figure className={`is-${index === 0 ? 'primary' : 'secondary'}`} key={image}><SafeImage src={image} alt="" eager={index === 0} priority={index === 0 ? 'high' : 'auto'} /></figure>)}
    </div>
    <div className="arc-page__hero-shade" />
    <div className="arc-page__hero-content">
      <div className="arc-page__hero-route">
        <ArcRouteButton arcId={arc.previousId} onNavigate={onNavigate}><ArrowLeft size={15} /> Previous arc</ArcRouteButton>
        <button type="button" onClick={() => onNavigate('series')}>All arcs</button>
        <ArcRouteButton arcId={arc.nextId} onNavigate={onNavigate}>Next arc <ArrowRight size={15} /></ArcRouteButton>
      </div>
      <span className="arc-page__eyebrow">Story {String(arc.order).padStart(2, '0')} · {arc.status}</span>
      <h1>{arc.title}</h1>
      <p>{arc.premise}</p>
      <dl className="arc-page__hero-facts">
        <div><dt>Manga</dt><dd>{rangeText(arc.manga?.pageRange, 'Ch.')}</dd></div>
        <div><dt>2011 anime</dt><dd>{arc.anime2011 ? rangeText(arc.anime2011.pageRange, 'Ep.') : 'Not adapted'}</dd></div>
        <div><dt>Structure</dt><dd>{arc.phases.length} phases</dd></div>
        <div><dt>Primary lens</dt><dd>{arc.focus?.[0] || 'Story context'}</dd></div>
      </dl>
    </div>
  </header>;
}

function ArcNavigation() {
  return <nav className="arc-page__nav" aria-label="Arc page sections">
    <div>{sectionLinks.map(([id, label]) => <a href={`#arc-${id}`} key={id}>{label}</a>)}</div>
  </nav>;
}

function CharacterGrid({ characters, onNavigate }) {
  return <div className="arc-character-grid">{characters.map((character) => <article key={character.name}>
    {character.image && <figure><SafeImage src={character.image} alt={`${character.name} portrait from Hunterpedia`} /></figure>}
    <div><span>{character.role}</span><h3>{character.name}</h3><p>{character.goal}</p><dl><div><dt>Affiliation</dt><dd>{character.affiliation}</dd></div><div><dt>Arc status</dt><dd>{character.status}</dd></div></dl><button type="button" onClick={() => onNavigate('reference', 'encyclopedia', { category: 'characters', search: character.name })}>Open dossier <ArrowRight size={14} /></button></div>
  </article>)}</div>;
}

function ChapterDirectory({ arc, onNavigate }) {
  const range = arc.manga?.pageRange;
  const records = Array.isArray(range) ? chapters.filter((chapter) => chapter.number >= range[0] && chapter.number <= range[1]) : [];
  if (!records.length) return <div className="arc-records__supplement"><article><b>Supplementary chapter I</b><span>Kurapika’s childhood, Pairo, Sheila, and the outside world.</span></article><article><b>Supplementary chapter II</b><span>The departure test, promise, and transition into Kurapika’s later mission.</span></article></div>;
  return <>
    <div className="arc-records__summary"><span>{records.length} numbered chapters</span><button type="button" onClick={() => onNavigate('series', 'chapters', { arc: arc.officialArcId || arc.id })}>Open complete chapter catalogue <ArrowRight size={14} /></button></div>
    <div className="arc-records__table" role="region" aria-label={`${arc.shortTitle} chapter directory`} tabIndex="0">
      <table><thead><tr><th>Chapter</th><th>Title and local account</th><th>Depth</th><th>Source</th></tr></thead><tbody>{records.map((chapter) => <tr key={chapter.number}><td><b>{chapter.number}</b>{chapter.volume && <small>Vol. {chapter.volume}</small>}</td><td><strong>{chapter.title}</strong><p>{chapter.summary}</p></td><td>{chapter.researchStatus}</td><td><a href={chapter.sourceUrl} target="_blank" rel="noreferrer noopener">Hunterpedia <ExternalLink size={11} /></a></td></tr>)}</tbody></table>
    </div>
  </>;
}

export default function ArcPage({ arcId, onNavigate }) {
  const arc = storyArcPageById.get(arcId);
  if (!arc) return null;
  const style = {
    '--arc-paper': arc.visual.paper,
    '--arc-ink': arc.visual.ink,
    '--arc-accent': arc.visual.accent,
    '--arc-secondary': arc.visual.secondary,
  };

  return <article className={`arc-page arc-page--${arc.visual.className}`} style={style}>
    <ArcHero arc={arc} onNavigate={onNavigate} />
    <ArcNavigation />
    <div className="arc-page__canvas">
      <ArcSection id="context" number={1} kicker="Before the arc" title="Why the story arrives here."><div className="arc-reading-block"><p>{arc.context}</p><aside><span>Transition in</span><p>{arc.previousId ? `This page follows ${storyArcPageById.get(arc.previousId)?.title}.` : 'This is the chronological beginning of the Story archive.'}</p></aside></div></ArcSection>

      <ArcSection id="premise" number={2} kicker="Central conflict" title="What the arc is asking."><div className="arc-premise-grid"><article><span>Objective</span><p>{arc.objective}</p></article><article><span>Stakes</span><p>{arc.stakes}</p></article><article><span>Narrative structure</span><p>{arc.structure}</p></article><article><span>Central question</span><p>{arc.question}</p></article></div></ArcSection>

      <ArcSection id="chronology" number={3} kicker="Arc timeline" title={`${arc.phases.length} phases from opening to aftermath.`}><ol className="arc-timeline">{arc.phases.map((phase, index) => <li key={phase.title}><i>{String(index + 1).padStart(2, '0')}</i><div><span>{phase.range}</span><h3>{phase.title}</h3><p>{phase.summary}</p></div></li>)}</ol></ArcSection>

      <ArcSection id="characters" number={4} kicker="People in this story" title="Arc-specific character roles."><CharacterGrid characters={arc.characters} onNavigate={onNavigate} /></ArcSection>

      <ArcSection id="factions" number={5} kicker="Power groups" title="Organizations active in this arc."><div className="arc-faction-grid">{arc.factions.map((item) => <article key={item.name}><Shield size={18} /><h3>{item.name}</h3><dl><div><dt>Objective</dt><dd>{item.objective}</dd></div><div><dt>Leadership</dt><dd>{item.leadership}</dd></div><div><dt>Arc outcome</dt><dd>{item.outcome}</dd></div></dl></article>)}</div></ArcSection>

      <ArcSection id="locations" number={6} kicker="Story geography" title="Where movement changes the conflict."><div className="arc-location-grid">{arc.locations.map((item) => <article key={item.name}><MapPinned size={18} /><h3>{item.name}</h3><p>{item.role}</p><small>{item.movement}</small><button type="button" onClick={() => onNavigate('reference', 'atlas', { search: item.name })}>Open in atlas <ArrowRight size={13} /></button></article>)}</div></ArcSection>

      <ArcSection id="nen" number={7} kicker="Power development" title="Nen concepts and abilities that matter here."><div className="arc-nen-list">{arc.nen.map((item, index) => <article key={item}><i>{String(index + 1).padStart(2, '0')}</i><Orbit size={18} /><span>{item}</span></article>)}</div><button className="arc-inline-action" type="button" onClick={() => onNavigate('reference', 'nen')}>Open the complete Nen encyclopedia <ArrowRight size={14} /></button></ArcSection>

      <ArcSection id="conflicts" number={8} kicker="Battles and operations" title="Objectives, turning points, and results."><div className="arc-conflict-ledger">{arc.conflicts.map((item) => <article key={item.title}><Swords size={18} /><div><h3>{item.title}</h3><p><b>Participants:</b> {item.participants}</p><p><b>Objective:</b> {item.objective}</p><p><b>Result:</b> {item.result}</p></div></article>)}</div><button className="arc-inline-action" type="button" onClick={() => onNavigate('reference', 'conflicts', { search: arc.shortTitle })}>Open conflict archive <ArrowRight size={14} /></button></ArcSection>

      <ArcSection id="objects" number={9} kicker="Objects and evidence" title="Items carrying rules, ownership, and consequence."><div className="arc-object-grid">{arc.objects.map((item) => <article key={item.name}><BookOpenText size={17} /><span>{item.owner}</span><h3>{item.name}</h3><p>{item.function}</p><small>{item.importance}</small></article>)}</div></ArcSection>

      <ArcSection id="themes" number={10} kicker="Interpretation · not a canon fact list" title="The arc’s central ideas."><div className="arc-theme-grid">{arc.themes.map((item) => <article key={item.title}><span>Interpretive lens</span><h3>{item.title}</h3><p>{item.reading}</p></article>)}</div></ArcSection>

      <ArcSection id="changes" number={11} kicker="Before and after" title="What changes during the arc."><div className="arc-change-list">{arc.changes.map((item) => <article key={item.subject}><h3>{item.subject}</h3><div><span>Before</span><p>{item.before}</p></div><ArrowRight size={18} /><div><span>After</span><p>{item.after}</p></div></article>)}</div></ArcSection>

      <ArcSection id="ending" number={12} kicker="Arc ending" title="How the central conflict closes."><div className="arc-ending"><p>{arc.ending}</p></div></ArcSection>

      <ArcSection id="transition" number={13} kicker="Connection forward" title={arc.nextId ? `From ${arc.shortTitle} to ${storyArcPageById.get(arc.nextId)?.shortTitle}.` : 'Where the story currently stops.'}><div className="arc-transition"><p>{arc.transition}</p>{arc.nextId ? <ArcRouteButton arcId={arc.nextId} onNavigate={onNavigate}>Continue to {storyArcPageById.get(arc.nextId)?.shortTitle} <ArrowRight size={15} /></ArcRouteButton> : <button type="button" onClick={() => onNavigate('succession', 'succession-timeline')}>Open the current voyage timeline <ArrowRight size={15} /></button>}</div></ArcSection>

      <ArcSection id="adaptation" number={14} kicker="Manga and 2011 anime" title="What medium carries this page."><div className="arc-adaptation"><dl><div><dt>Manga</dt><dd>{rangeText(arc.manga?.pageRange, 'Ch.')}</dd></div><div><dt>2011 anime</dt><dd>{arc.anime2011 ? rangeText(arc.anime2011.pageRange, 'Ep.') : 'Manga-only'}</dd></div></dl><ul>{arc.adaptation.map((item) => <li key={item}>{item}</li>)}</ul></div></ArcSection>

      <ArcSection id="records" number={15} kicker="Scoped directory" title="Chapters belonging to this page."><ChapterDirectory arc={arc} onNavigate={onNavigate} /></ArcSection>

      <ArcSection id="sources" number={16} kicker="Hunterpedia / Fandom boundary" title="Sources attached to this arc."><div className="arc-source-list">{arc.sources.map((item) => <a href={item.href} target="_blank" rel="noreferrer noopener" key={item.href}><span>{item.label}</span><ExternalLink size={14} /></a>)}</div></ArcSection>
    </div>
  </article>;
}
