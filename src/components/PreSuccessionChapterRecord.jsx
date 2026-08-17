import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import PageIntro from './PageIntro';
import { chapters } from '../data/chapters';
import { getPreSuccessionResearch } from '../data/seriesResearch';

const clampChapter = (value) => Math.min(339, Math.max(1, Number(value) || 339));

export default function PreSuccessionChapterRecord({ routeParams = {}, onNavigate }) {
  const chapterNumber = clampChapter(routeParams.chapter);
  const chapter = chapters.find((record) => record.number === chapterNumber);
  const research = getPreSuccessionResearch(chapterNumber);

  if (!chapter) {
    return <section className="index-section">
      <div className="index-heading"><div><span className="section-kicker">Series record</span><h2>Chapter {chapterNumber} is not indexed.</h2></div></div>
    </section>;
  }

  const goPrevious = () => chapterNumber > 1 && onNavigate('series', 'chapters', { chapter: chapterNumber - 1 });
  const goNext = () => {
    if (chapterNumber < 339) onNavigate('series', 'chapters', { chapter: chapterNumber + 1 });
    else onNavigate('succession', 'chapters', { chapter: 340 });
  };

  return <>
    <PageIntro
      kicker={`${chapter.arcTitle} · ${chapter.label}`}
      title={chapter.title}
      description={chapter.summary}
    />

    <section className="index-section pre-succession-chapter-record" data-series-chapter={chapterNumber}>
      <div className="index-heading">
        <div>
          <span className="section-kicker">Pre-Succession chapter record</span>
          <h2>Chapter {chapterNumber} remains reachable outside the Succession Contest graph.</h2>
          <p>Chapters 1–339 retain their series-era research context here. Chapter 340 and later continue in the dedicated Succession Contest application.</p>
        </div>
      </div>

      <div className="story-grid">
        <article>
          <span>Series context</span>
          <h3>{chapter.arcTitle}</h3>
          <p>{research?.phaseSummary || chapter.phaseContext || chapter.summary}</p>
          <dl>
            <div><dt>Chapter</dt><dd>{chapterNumber}</dd></div>
            <div><dt>Volume</dt><dd>{chapter.volume ? `Volume ${chapter.volume}` : 'Uncollected / not indexed'}</dd></div>
            <div><dt>Research</dt><dd>{chapter.researchStatus || 'Catalogue record'}</dd></div>
          </dl>
        </article>

        <article>
          <span>Study lens</span>
          <h3>{research?.phaseTitle || chapter.studyPhase || 'Series research'}</h3>
          <p>{chapter.studyPrompt}</p>
          {research?.shift && <p><b>Phase shift:</b> {research.shift}</p>}
          {research?.beat && <p><b>Beat:</b> {research.beat}</p>}
        </article>

        <article>
          <span>Maintained metadata</span>
          <h3>Sources and notes</h3>
          {(chapter.notes || []).length ? <ul>{chapter.notes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>No additional maintained notes are attached to this chapter.</p>}
          <a href={chapter.sourceUrl} target="_blank" rel="noreferrer">Hunterpedia chapter record <ExternalLink size={12} /></a>
        </article>
      </div>

      <nav className="pre-overview__footer" aria-label="Chapter navigation">
        <button type="button" onClick={goPrevious} disabled={chapterNumber <= 1}>
          <ArrowLeft size={15} /><span>Previous</span><b>{chapterNumber > 1 ? `Chapter ${chapterNumber - 1}` : 'Series start'}</b>
        </button>
        <button type="button" onClick={goNext}>
          <span>{chapterNumber === 339 ? 'Continue into Succession' : 'Next'}</span>
          <b>Chapter {chapterNumber + 1}</b><ArrowRight size={15} />
        </button>
      </nav>
    </section>
  </>;
}
