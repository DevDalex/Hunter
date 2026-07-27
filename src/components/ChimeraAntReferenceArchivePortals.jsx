import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, BookOpenText, ExternalLink, Film, Library, Link2 } from 'lucide-react';
import { chimeraAntReferenceArchive } from '../data/chimeraAntReferenceArchive';
import './ChimeraAntReferenceArchive.css';

const TARGET_IDS = Object.freeze(['ending', 'adaptation', 'records', 'sources']);

function SourceLink({ href, children = 'Open evidence' }) {
  return <a className="chimera-reference-source" href={href} target="_blank" rel="noreferrer noopener">{children}<ExternalLink size={12} /></a>;
}

function ReferenceIntro({ icon: Icon, label, title, deck, marker }) {
  return <header className="chimera-reference-intro">
    <div className="chimera-reference-intro__icon"><Icon size={25} /></div>
    <div><span>{label}</span><h3>{title}</h3><p>{deck}</p></div>
    <aside><strong>{marker}</strong><span>archive record</span></aside>
  </header>;
}

function EndingArchive() {
  const system = chimeraAntReferenceArchive.ending;
  return <div className="chimera-reference-root chimera-ending-archive" data-reference-archive="ending">
    <ReferenceIntro icon={Link2} label="Ending and aftermath" title={system.title} deck={system.deck} marker="05" />
    <ol className="chimera-ending-chain">
      {system.chain.map((record) => <li key={record.index}>
        <header><i>{record.index}</i><div><span>Phase {record.phase} · Episode{record.episodes.includes('–') ? 's' : ''} {record.episodes} · {record.label}</span><h4>{record.title}</h4></div><SourceLink href={record.sourceHref} /></header>
        <div className="chimera-ending-chain__logic"><article><span>Cause</span><p>{record.cause}</p></article><ArrowRight size={18} /><article><span>Consequence</span><p>{record.consequence}</p></article></div>
      </li>)}
    </ol>
    <div className="chimera-ending-outcomes">
      <header><span>Outcome ledger</span><h4>What is closed, and what is carried forward.</h4></header>
      <div>{system.outcomes.map((record) => <article key={record.id}><span>{record.status}</span><h5>{record.subject}</h5><p>{record.result}</p><dl><dt>Story carried forward</dt><dd>{record.carriedForward}</dd></dl></article>)}</div>
    </div>
  </div>;
}

function AdaptationArchive() {
  const system = chimeraAntReferenceArchive.adaptation;
  return <div className="chimera-reference-root chimera-adaptation-archive" data-reference-archive="adaptation">
    <ReferenceIntro icon={Film} label="Manga versus 2011 anime" title={system.title} deck={system.deck} marker="02" />
    <div className="chimera-adaptation-boundaries">
      {[system.boundaries.manga, system.boundaries.anime].map((record) => <article key={record.medium}><span>{record.medium}</span><strong>{record.count}</strong><h4>{record.range}</h4><p>{record.authority}</p></article>)}
    </div>
    <div className="chimera-adaptation-correspondence" role="table" aria-label="Chimera Ant manga and anime phase correspondence">
      <div className="chimera-adaptation-correspondence__head" role="row"><span role="columnheader">Phase</span><span role="columnheader">Manga</span><span role="columnheader">Anime</span><span role="columnheader">Coverage</span></div>
      {system.correspondence.map((record) => <article role="row" key={record.phase}><header role="rowheader"><i>{record.phase}</i><strong>{record.title}</strong></header><p role="cell">Ch. {record.chapters}</p><p role="cell">Ep. {record.episodes}</p><p role="cell">{record.note}</p></article>)}
    </div>
    <div className="chimera-adaptation-choices">
      <header><span>Adaptation choices</span><h4>Different tools, consistent causal sequence.</h4></header>
      {system.choices.map((record) => <article key={record.id}><h5>{record.label}</h5><div><section><span>Manga</span><p>{record.manga}</p></section><section><span>Anime</span><p>{record.anime}</p></section></div><aside>{record.implication}</aside></article>)}
    </div>
    <SourceLink href={system.sourceHref}>Open arc adaptation record</SourceLink>
  </div>;
}

const fallbackNavigate = (action) => {
  const path = `/${action.route.map((segment) => encodeURIComponent(segment)).join('/')}`;
  const params = new URLSearchParams(action.params || {}).toString();
  window.location.hash = params ? `${path}?${params}` : path;
};

function RecordsArchive({ onNavigate }) {
  const system = chimeraAntReferenceArchive.records;
  return <div className="chimera-reference-root chimera-records-archive" data-reference-archive="records">
    <ReferenceIntro icon={Library} label="Scoped directory" title={system.title} deck={system.deck} marker="07" />
    <div className="chimera-records-totals">{system.totals.map((record) => <article key={record.label}><span>{record.label}</span><strong>{record.value}</strong><small>{record.range}</small></article>)}</div>
    <div className="chimera-records-rules"><header><span>Boundary rules</span><h4>How to read the archive without confusing editorial structure for canon.</h4></header><ol>{system.boundaryRules.map((rule, index) => <li key={rule}><i>{String(index + 1).padStart(2, '0')}</i><p>{rule}</p></li>)}</ol></div>
    <nav className="chimera-records-actions" aria-label="Chimera Ant record directories">
      {system.directoryActions.map((action) => <button type="button" key={action.id} onClick={() => onNavigate ? onNavigate(...action.route, action.params) : fallbackNavigate(action)}><span>{action.label}</span><ArrowRight size={15} /></button>)}
    </nav>
  </div>;
}

function SourcesArchive() {
  const system = chimeraAntReferenceArchive.sources;
  return <div className="chimera-reference-root chimera-sources-archive" data-reference-archive="sources">
    <ReferenceIntro icon={BookOpenText} label="Reference boundary" title={system.title} deck={system.deck} marker="04" />
    <div className="chimera-sources-groups">
      {system.groups.map((group, index) => <section key={group.id}><header><i>{String(index + 1).padStart(2, '0')}</i><div><span>{group.label}</span><p>{group.purpose}</p></div></header><div>{group.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer noopener"><span>{source.type}</span><strong>{source.label}</strong><ExternalLink size={13} /></a>)}</div></section>)}
    </div>
    <div className="chimera-sources-boundaries"><header><span>Evidence classes</span><h4>What each source type is allowed to claim.</h4></header><div>{system.boundaries.map((record) => <article key={record.label}><h5>{record.label}</h5><p>{record.text}</p></article>)}</div></div>
  </div>;
}

const RENDERERS = Object.freeze({ ending: EndingArchive, adaptation: AdaptationArchive, records: RecordsArchive, sources: SourcesArchive });

export default function ChimeraAntReferenceArchivePortals({ onNavigate }) {
  const [targets, setTargets] = useState([]);
  useEffect(() => {
    setTargets(TARGET_IDS.map((id) => ({ id, node: document.getElementById(`chimera-${id}`) })).filter((target) => target.node));
  }, []);
  return targets.map(({ id, node }) => {
    const Archive = RENDERERS[id];
    return createPortal(<Archive onNavigate={onNavigate} />, node, `chimera-reference-${id}`);
  });
}
