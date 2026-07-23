import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Grid2X2, List, Search } from 'lucide-react';
import PageIntro from './PageIntro';
import WorkspaceNav from './WorkspaceNav';
import SpoilerControl from './SpoilerControl';
import ArcNav from './ArcNav';
import ChapterIndex from './ChapterIndex';
import ChapterDrawer from './ChapterDrawer';
import SeriesResearchDesk from './SeriesResearchDesk';
import AdaptationDesk from './AdaptationDesk';
import { arcs } from '../data/arcs';
import { chapters, LATEST_CHAPTER } from '../data/chapters';
import { storyArcIds } from '../data/storyArcPages';
import { readStoredJson, writeStoredJson } from '../lib/browserStorage';
import './StoryUtilities.css';

const ArcPage = lazy(() => import('./ArcPage'));
const StoryHub = lazy(() => import('./StoryHub'));
const VolumeZeroPage = lazy(() => import('./VolumeZeroPage'));
const HunterExamPage = lazy(() => import('./HunterExamPage'));
const SuccessionChapterReader = lazy(() => import('./SuccessionChapterReader'));
const GreedIslandPage = lazy(() => import('./GreedIslandPage'));

const utilityPages = [
  { id: 'chronology', label: 'Chronology' },
  { id: 'chapters', label: 'Chapter directory' },
  { id: 'adaptation', label: '2011 anime guide' },
];

const PRE_SUCCESSION_END = 339;
const preSuccessionArcs = arcs.filter((arc) => arc.chapters[1] <= PRE_SUCCESSION_END);
const adaptationArcMap = { 'hunter-exam': 'hunter-exam', 'heavens-arena': 'heavens-arena', yorknew: 'yorknew-city', 'greed-island': 'greed-island', 'chimera-ant': 'chimera-ant', election: 'chairman-election' };
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
const StoryLoading = ({ label }) => <section className="route-loading" role="status" aria-live="polite" aria-busy="true"><span /><strong>Opening {label}…</strong></section>;

function readProgress() {
  const stored = readStoredJson('hxh-studied', []);
  return new Set(Array.isArray(stored) ? stored : []);
}

export default function SeriesWorkspace({ routeTarget, routeParams, spoilerLimit, onSpoilerChange, onNavigate, onPrefetch }) {
  const chronologyPage = routeTarget === 'chronology';
  const chaptersPage = routeTarget === 'chapters';
  const adaptationPage = routeTarget === 'adaptation';
  const successionChaptersPage = routeTarget === 'succession-contest' && routeParams.section === 'chapters';
  const [activeArc, setActiveArc] = useState('all');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [volume, setVolume] = useState('all');
  const [density, setDensity] = useState('comfortable');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [studied, setStudied] = useState(readProgress);
  const currentArc = activeArc === 'all' ? null : preSuccessionArcs.find((arc) => arc.id === activeArc);

  const visibleChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return chapters.filter((chapter) => {
      const searchable = `${chapter.number} ${chapter.title} ${chapter.arcTitle} ${chapter.volume || ''} ${chapter.summary}`.toLowerCase();
      const inArc = activeArc === 'all' || chapter.arcId === activeArc;
      const inVolume = volume === 'all' || (volume === 'uncollected' ? !chapter.volume : chapter.volume === Number(volume));
      const inStatus = filter === 'all' || (filter === 'studied' ? studied.has(chapter.number) : !studied.has(chapter.number));
      return chapter.number <= Math.min(spoilerLimit, PRE_SUCCESSION_END) && inArc && inVolume && inStatus && (!normalized || searchable.includes(normalized));
    });
  }, [activeArc, query, filter, volume, studied, spoilerLimit]);

  useEffect(() => {
    const chapterNumber = Number(routeParams.chapter);
    setSelectedChapter(chapterNumber ? chapters.find((item) => item.number === chapterNumber && item.number <= PRE_SUCCESSION_END) || null : null);
  }, [routeParams.chapter]);

  useEffect(() => {
    if (routeParams.arc && preSuccessionArcs.some((arc) => arc.id === routeParams.arc)) setActiveArc(routeParams.arc);
  }, [routeParams.arc]);

  const updateChapterRoute = (chapter) => {
    setSelectedChapter(chapter);
    onNavigate('series', 'chapters', { ...routeParams, chapter: chapter?.number || undefined });
  };

  const toggleStudied = (number) => setStudied((current) => {
    const next = new Set(current);
    next.has(number) ? next.delete(number) : next.add(number);
    writeStoredJson('hxh-studied', [...next]);
    return next;
  });

  const chooseArc = (id) => {
    setActiveArc(id);
    window.setTimeout(() => scrollToSection('chapter-index'), 0);
  };

  const moveChapter = (amount) => {
    if (!selectedChapter) return;
    const next = chapters.find((chapter) => chapter.number === selectedChapter.number + amount && chapter.number <= PRE_SUCCESSION_END);
    if (next) updateChapterRoute(next);
  };

  if (!routeTarget) return <Suspense fallback={<StoryLoading label="Story directory" />}><StoryHub onNavigate={onNavigate} onPrefetch={onPrefetch} /></Suspense>;
  if (routeTarget === 'volume-0') return <Suspense fallback={<StoryLoading label="Kurapika’s Memories" />}><VolumeZeroPage onNavigate={onNavigate} /></Suspense>;
  if (routeTarget === 'hunter-exam') return <Suspense fallback={<StoryLoading label="287th Hunter Examination" />}><HunterExamPage onNavigate={onNavigate} /></Suspense>;
  if (routeTarget === 'greed-island') return <Suspense fallback={<StoryLoading label="Greed Island" />}><GreedIslandPage onNavigate={onNavigate} routeParams={routeParams} /></Suspense>;
  if (successionChaptersPage) return <section className="story-utility-shell story-utility-shell--succession-reader">
    <nav className="story-utility-shell__back" aria-label="Succession reader navigation"><button type="button" onClick={() => onNavigate('succession', 'archive')}>← Succession Archive</button></nav>
    <h1 className="sr-only">Succession Contest chapter reader</h1>
    <Suspense fallback={<StoryLoading label="Succession chapter reader" />}>
      <SuccessionChapterReader
        requestedChapter={routeParams.chapter}
        requestedPage={routeParams.page}
        requestedMode={routeParams.mode}
        onNavigate={(chapter, page, mode) => onNavigate('series', 'succession-contest', { section: 'chapters', chapter, page, mode })}
      />
    </Suspense>
  </section>;
  if (storyArcIds.has(routeTarget)) return <Suspense fallback={<StoryLoading label="dedicated arc page" />}><ArcPage arcId={routeTarget} onNavigate={onNavigate} /></Suspense>;

  const pageIntro = adaptationPage
    ? { kicker: '2011 television anime', title: 'The adaptation guide', description: 'Map all 148 episodes to the completed manga arcs and their source ranges without mixing the adaptation reference into any individual arc page.' }
    : chronologyPage
      ? { kicker: 'Cross-arc reference', title: 'The complete chronology', description: 'Follow selected events, flashbacks, dated periods, and movements across the Story archive. Every arc keeps its own internal timeline on its dedicated page.' }
      : { kicker: 'Complete manga reference', title: 'The chapter directory', description: 'Search Chapters 1–339 here. Every dedicated arc page also contains its own scoped chapter directory, while the Succession archive maintains Chapters 340–413.' };

  return <section className="story-utility-shell">
    <nav className="story-utility-shell__back" aria-label="Story utility navigation"><button type="button" onClick={() => onNavigate('series')}>← All arcs</button></nav>
    <PageIntro kicker={pageIntro.kicker} title={pageIntro.title} description={pageIntro.description} compact>
      <dl className="page-intro__facts"><div><dt>Story arcs</dt><dd>9 pages</dd></div><div><dt>Numbered chapters</dt><dd>413</dd></div><div><dt>2011 anime</dt><dd>148 episodes</dd></div></dl>
    </PageIntro>
    <WorkspaceNav items={utilityPages} activeId={routeTarget} onSelect={(id) => onNavigate('series', id)} label="Story reference tools" />
    <details className="spoiler-settings"><summary>Reading boundary <b>Chapter {spoilerLimit}</b></summary><SpoilerControl value={spoilerLimit} latestChapter={LATEST_CHAPTER} onChange={onSpoilerChange} /></details>

    {adaptationPage && <AdaptationDesk onOpenChapters={(arc) => onNavigate('series', 'chapters', { arc: adaptationArcMap[arc] || arc })} />}
    {chronologyPage && <SeriesResearchDesk chapters={chapters} spoilerLimit={Math.min(spoilerLimit, PRE_SUCCESSION_END)} maxChapter={PRE_SUCCESSION_END} onOpenSuccessionTimeline={() => onNavigate('succession', 'succession-timeline')} />}
    {chaptersPage && <section className="index-section" id="chapter-index">
      <div className="index-heading"><div><span className="section-kicker">{currentArc ? `Reference range · Chapters ${currentArc.chapters[0]}–${currentArc.chapters[1]}` : 'Complete Pre-Succession catalogue'}</span><h2>{currentArc ? currentArc.title : 'Chapters 1–339'}</h2><p>{currentArc ? currentArc.premise : 'Use this directory when you need to search across arc boundaries. For focused reading, open the chapter directory embedded at the end of the relevant dedicated arc page.'}</p></div><span className="review-boundary">Pre-Succession boundary · Ch. 339</span></div>
      <ArcNav activeArc={activeArc} setActiveArc={chooseArc} completedCount={studied.size} />
      {currentArc && <div className="arc-context arc-context--expanded"><div><b>Study lenses</b>{currentArc.focus.map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div><div><b>Internal movements</b><span>{currentArc.phases.join(' · ')}</span></div><div><b>Key people</b><span>{currentArc.people.join(' · ')}</span></div><div><b>Places</b><span>{currentArc.places.join(' · ')}</span></div><div><b>Nen developments</b><span>{currentArc.nen.join(' · ')}</span></div><div><b>Turning points</b><span>{currentArc.turningPoints.join(' · ')}</span></div><div><b>Aftermath / status</b><span>{currentArc.aftermath}</span><a href={currentArc.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a></div></div>}
      <div className="index-toolbar"><div className="filter-group">{[['all','All'],['studied','Studied'],['unread','To study']].map(([value,label]) => <button key={value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="index-search"><span className="sr-only">Search chapters</span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, number, arc…" />{query && <button onClick={() => setQuery('')}>Clear</button>}</label><select value={volume} onChange={(event) => setVolume(event.target.value)} aria-label="Filter by volume"><option value="all">All volumes</option>{Array.from({length:39},(_,index) => <option key={index + 1} value={index + 1}>Volume {index + 1}</option>)}<option value="uncollected">Uncollected</option></select><div className="density-toggle" aria-label="Chapter layout"><button className={density === 'comfortable' ? 'is-active' : ''} onClick={() => setDensity('comfortable')} aria-label="List view" aria-pressed={density === 'comfortable'}><List size={17} /></button><button className={density === 'compact' ? 'is-active' : ''} onClick={() => setDensity('compact')} aria-label="Grid view" aria-pressed={density === 'compact'}><Grid2X2 size={16} /></button></div></div>
      <div className="result-count" role="status" aria-live="polite">Showing {visibleChapters.length} chapter{visibleChapters.length === 1 ? '' : 's'}</div>
      <ChapterIndex chapters={visibleChapters} studied={studied} openChapter={updateChapterRoute} density={density} />
    </section>}

    <ChapterDrawer chapter={selectedChapter} onClose={() => updateChapterRoute(null)} onMove={moveChapter} studied={selectedChapter ? studied.has(selectedChapter.number) : false} toggleStudied={toggleStudied} onOpenEntity={(category, search) => { setSelectedChapter(null); onNavigate('reference', 'encyclopedia', { category, search }); }} />
  </section>;
}
