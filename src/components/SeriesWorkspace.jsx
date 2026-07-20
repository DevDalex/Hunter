import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Grid2X2, List, Search } from 'lucide-react';
import PageIntro from './PageIntro';
import WorkspaceNav from './WorkspaceNav';
import SpoilerControl from './SpoilerControl';
import ArcNav from './ArcNav';
import ChapterIndex from './ChapterIndex';
import ChapterDrawer from './ChapterDrawer';
import SeriesResearchDesk from './SeriesResearchDesk';
import KurapikaMemories from './KurapikaMemories';
import AdaptationDesk from './AdaptationDesk';
import PreSuccessionExperience from './PreSuccessionExperience';
import PreSuccessionOverview from './PreSuccessionOverview';
import StoryFoundationLayout, { StoryArcFoundation, StoryHubFoundation } from './StoryFoundation';
import YorknewPrototypePage from './YorknewPrototypePage';
import EarlyArcPrototypePage from './EarlyArcPrototypePage';
import { arcs } from '../data/arcs';
import { chapters, LATEST_CHAPTER } from '../data/chapters';
import { preSuccessionExperienceById, preSuccessionExperienceIds } from '../data/preSuccessionExperiences';
import { hasEarlyArcPrototype } from '../data/earlyArcPrototypes';
import { readStoredJson, writeStoredJson } from '../lib/browserStorage';

const GreedIslandPrototypePage = lazy(() => import('./GreedIslandPrototypePage'));

const seriesPages = [
  { id: 'arcs', label: 'Overview' },
  { id: 'hunter-exam', label: 'Hunter Exam' },
  { id: 'zoldyck-family', label: 'Zoldyck Family' },
  { id: 'heavens-arena', label: 'Heavens Arena' },
  { id: 'yorknew-city', label: 'Yorknew' },
  { id: 'greed-island', label: 'Greed Island' },
  { id: 'chimera-ant', label: 'Chimera Ant' },
  { id: 'chairman-election', label: 'Election' },
  { id: 'volume-0', label: 'Volume 0' },
  { id: 'adaptation', label: '2011 anime' },
  { id: 'chronology', label: 'Chronology' },
  { id: 'chapters', label: 'Chapter references' },
];

const PRE_SUCCESSION_END = 339;
const preSuccessionArcs = arcs.filter((arc) => arc.chapters[1] <= PRE_SUCCESSION_END);
const adaptationArcMap = { 'hunter-exam': 'hunter-exam', 'heavens-arena': 'heavens-arena', yorknew: 'yorknew-city', 'greed-island': 'greed-island', 'chimera-ant': 'chimera-ant', election: 'chairman-election' };

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });

function readProgress() {
  const stored = readStoredJson('hxh-studied', []);
  return new Set(Array.isArray(stored) ? stored : []);
}

export default function SeriesWorkspace({ routeTarget, routeParams, spoilerLimit, onSpoilerChange, onNavigate, onPrefetch }) {
  const arcPage = preSuccessionExperienceIds.has(routeTarget);
  const arcExperience = arcPage ? preSuccessionExperienceById.get(routeTarget) : null;
  const earlyArcPrototypePage = hasEarlyArcPrototype(routeTarget);
  const yorknewPrototypePage = routeTarget === 'yorknew-city';
  const greedIslandPrototypePage = routeTarget === 'greed-island';
  const chronologyPage = routeTarget === 'chronology';
  const chaptersPage = routeTarget === 'chapters';
  const memoriesPage = routeTarget === 'volume-0';
  const adaptationPage = routeTarget === 'adaptation';
  const activePage = arcPage ? routeTarget : earlyArcPrototypePage ? routeTarget : greedIslandPrototypePage ? 'greed-island' : chronologyPage ? 'chronology' : chaptersPage ? 'chapters' : memoriesPage ? 'volume-0' : adaptationPage ? 'adaptation' : 'arcs';
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
    if (routeParams.arc && preSuccessionArcs.some((arc) => arc.id === routeParams.arc)) {
      setActiveArc(routeParams.arc);
    }
  }, [routeParams.arc]);

  const updateChapterRoute = (chapter) => {
    setSelectedChapter(chapter);
    onNavigate('series', activePage === 'arcs' ? '' : activePage, { ...routeParams, chapter: chapter?.number || undefined });
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

  const selectWorkspace = (id) => {
    onNavigate('series', id === 'arcs' ? '' : id);
  };

  const pageIntro = memoriesPage
    ? { kicker: 'Volume 0 · Kurapika backstory', title: 'Kurapika’s Memories', description: 'Read the two supplementary manga chapters as a connected visual study of the Kurta settlement, Pairo, Sheila, departure, loss, and the promise carried into Kurapika’s later story.' }
    : adaptationPage
      ? { kicker: '2011 television anime', title: 'The adaptation desk', description: 'Map all 148 episodes to six completed manga arcs and their source ranges without turning Chapters 1–339 into a second detailed-content backlog.' }
      : chronologyPage
        ? { kicker: 'Selected story anchors before Chapter 340', title: 'Pre-Succession chronology', description: 'Follow curated events, flashbacks, dated periods, and arc movements from Volume 0 through the Chairman Election without pretending every early chapter needs its own timeline event.' }
        : chaptersPage
          ? { kicker: 'Optional manga reference · Chapters 1–339', title: 'Lightweight chapter references', description: 'Find an early chapter by number, title, arc, or volume when needed. These entries support orientation and adaptation lookup; they are not planned as 339 deep dossiers.' }
          : arcPage
            ? { kicker: arcExperience.eyebrow, title: arcExperience.title, description: arcExperience.deck }
            : { kicker: 'Volume 0 + six completed arcs', title: 'The Story Archive', description: 'A route-level foundation for Kurapika’s childhood, the completed adapted journey, and the ongoing Succession Contest archive.' };

  return (
    <StoryFoundationLayout activeId={activePage} spoilerLimit={spoilerLimit} onNavigate={onNavigate} onPrefetch={onPrefetch}>
      {!arcPage && !earlyArcPrototypePage && !greedIslandPrototypePage && <PageIntro kicker={pageIntro.kicker} title={pageIntro.title} description={pageIntro.description}>
        <dl className="page-intro__facts"><div><dt>Deep exception</dt><dd>Volume 0</dd></div><div><dt>Completed arcs</dt><dd>{preSuccessionArcs.length}</dd></div><div><dt>2011 anime</dt><dd>148 episodes</dd></div></dl>
      </PageIntro>}
      <WorkspaceNav items={seriesPages} activeId={activePage} onSelect={selectWorkspace} label="Series library sections" />
      <details className="spoiler-settings"><summary>Reading boundary <b>Chapter {spoilerLimit}</b></summary><SpoilerControl value={spoilerLimit} latestChapter={LATEST_CHAPTER} onChange={onSpoilerChange} /></details>

      {arcPage && !yorknewPrototypePage && !earlyArcPrototypePage && !greedIslandPrototypePage && <StoryArcFoundation activeId={routeTarget} onNavigate={onNavigate} />}

      {earlyArcPrototypePage ? (
        <EarlyArcPrototypePage arcId={routeTarget} onNavigate={onNavigate} />
      ) : yorknewPrototypePage ? (
        <YorknewPrototypePage onNavigate={onNavigate} />
      ) : greedIslandPrototypePage ? (
        <Suspense fallback={<aside className="pre-scope-notice"><b>Loading Greed Island archive</b><p>The card binder and game-system modules are loading as a separate Story detail chunk.</p></aside>}>
          <GreedIslandPrototypePage onNavigate={onNavigate} />
        </Suspense>
      ) : arcPage ? (
        <PreSuccessionExperience arcId={routeTarget} onNavigate={onNavigate} />
      ) : memoriesPage ? (
        <KurapikaMemories onNavigate={onNavigate} />
      ) : adaptationPage ? (
        <AdaptationDesk onOpenChapters={(arc) => onNavigate('series', 'chapters', { arc: adaptationArcMap[arc] || arc })} />
      ) : chronologyPage ? (
        <SeriesResearchDesk chapters={chapters} spoilerLimit={Math.min(spoilerLimit, PRE_SUCCESSION_END)} maxChapter={PRE_SUCCESSION_END} onOpenSuccessionTimeline={() => onNavigate('succession', 'succession-timeline')} />
      ) : chaptersPage ? (
        <section className="index-section" id="chapter-index">
          <div className="index-heading"><div><span className="section-kicker">{currentArc ? `Reference range · Chapters ${currentArc.chapters[0]}–${currentArc.chapters[1]}` : 'Lightweight Pre-Succession catalogue'}</span><h2>{currentArc ? currentArc.title : 'Chapters 1–339 · reference only'}</h2><p>{currentArc ? currentArc.premise : 'Use this ledger when a chapter number, title, volume, or adaptation range is useful. The six arc studies, Volume 0, the 2011 desk, and the world map are the primary Pre-Succession experiences.'}</p></div><span className="review-boundary">Coverage boundary · Ch. 339</span></div>
          <aside className="pre-scope-notice"><b>Deliberate depth boundary</b><p>No additional chapter-by-chapter expansion is planned for Chapters 1–339. Existing records remain searchable, while deep manga event/state research begins in the Succession Archive at Chapter 340.</p></aside>
          <ArcNav activeArc={activeArc} setActiveArc={chooseArc} completedCount={studied.size} />
          {currentArc && <div className="arc-context arc-context--expanded"><div><b>Study lenses</b>{currentArc.focus.map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div><div><b>Internal movements</b><span>{currentArc.phases.join(' · ')}</span></div><div><b>Key people</b><span>{currentArc.people.join(' · ')}</span></div><div><b>Places</b><span>{currentArc.places.join(' · ')}</span></div><div><b>Nen developments</b><span>{currentArc.nen.join(' · ')}</span></div><div><b>Turning points</b><span>{currentArc.turningPoints.join(' · ')}</span></div><div><b>Aftermath / status</b><span>{currentArc.aftermath}</span><a href={currentArc.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a></div></div>}
          <div className="index-toolbar"><div className="filter-group">{[['all','All'],['studied','Studied'],['unread','To study']].map(([value,label]) => <button key={value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="index-search"><span className="sr-only">Search chapters</span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, number, arc…" />{query && <button onClick={() => setQuery('')}>Clear</button>}</label><select value={volume} onChange={(event) => setVolume(event.target.value)} aria-label="Filter by volume"><option value="all">All volumes</option>{Array.from({length:39},(_,index) => <option key={index + 1} value={index + 1}>Volume {index + 1}</option>)}<option value="uncollected">Uncollected</option></select><div className="density-toggle" aria-label="Chapter layout"><button className={density === 'comfortable' ? 'is-active' : ''} onClick={() => setDensity('comfortable')} aria-label="List view" aria-pressed={density === 'comfortable'}><List size={17} /></button><button className={density === 'compact' ? 'is-active' : ''} onClick={() => setDensity('compact')} aria-label="Grid view" aria-pressed={density === 'compact'}><Grid2X2 size={16} /></button></div></div>
          <div className="result-count" role="status" aria-live="polite">Showing {visibleChapters.length} chapter{visibleChapters.length === 1 ? '' : 's'}</div>
          <ChapterIndex chapters={visibleChapters} studied={studied} openChapter={updateChapterRoute} density={density} />
        </section>
      ) : <>
        <StoryHubFoundation spoilerLimit={spoilerLimit} onNavigate={onNavigate} />
        <PreSuccessionOverview onNavigate={onNavigate} />
      </>}

      <ChapterDrawer chapter={selectedChapter} onClose={() => updateChapterRoute(null)} onMove={moveChapter} studied={selectedChapter ? studied.has(selectedChapter.number) : false} toggleStudied={toggleStudied} onOpenEntity={(category, search) => { setSelectedChapter(null); onNavigate('reference', 'encyclopedia', { category, search }); }} />
    </StoryFoundationLayout>
  );
}
