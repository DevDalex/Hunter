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
  const isDetailedHandoff = chapterNumber === 339 && research?.chapterSpecific;

  return <>
    <PageIntro
      kicker={`${chapter.arcTitle} · ${chapter.label}`}
      title={chapter.title}
      description={research?.focus || chapter.summary}
    />

    <section className="index-section pre-succession-chapter-record" data-series-chapter={chapterNumber}>
      <div className="index-heading">
        <div>
          <span className="section-kicker">{isDetailedHandoff ? 'Chapter-specific handoff record' : 'Pre-Succession chapter record'}</span>
          <h2>Chapter {chapterNumber} remains reachable outside the Succession Contest graph.</h2>
          <p>{isDetailedHandoff ? 'Chapter 339 now carries a chapter-specific forensic handoff into the Dark Continent expedition, including its explicit Nen delta and evidence boundary.' : 'Chapters 1–339 retain their series-era research context here. Chapter 340 and later continue in the dedicated Succession Contest application.'}</p>
        </div>
      </div>

      <div className="story-grid">
        <article>
          <span>Series context</span>
          <h3>{chapter.arcTitle}</h3>
          <p>{research?.phaseSummary || chapter.phaseContext || chapter.summary}</p>
          <dl>
            <div><dt>Chapter</dt><dd>{chapterNumber}</dd></div>
            <div><dt>Volume</dt><dd>{research?.volume ? `Volume ${research.volume}` : chapter.volume ? `Volume ${chapter.volume}` : 'Uncollected / not indexed'}</dd></div>
            <div><dt>Research</dt><dd>{research?.researchLevel || chapter.researchStatus || 'Catalogue record'}</dd></div>
            {research?.japaneseTitle && <div><dt>Japanese title</dt><dd>{research.japaneseTitle} {research.japaneseReading ? `(${research.japaneseReading})` : ''}</dd></div>}
            {research?.releaseDate && <div><dt>Release</dt><dd>{research.releaseDate}</dd></div>}
          </dl>
        </article>

        <article>
          <span>Study lens</span>
          <h3>{research?.phaseTitle || chapter.studyPhase || 'Series research'}</h3>
          <p>{research?.focus || chapter.studyPrompt}</p>
          {research?.structuralShift && <p><b>Phase shift:</b> {research.structuralShift}</p>}
          {research?.beat && <p><b>Beat:</b> {research.beat}</p>}
        </article>

        <article>
          <span>Maintained metadata</span>
          <h3>Sources and notes</h3>
          {(chapter.notes || []).length ? <ul>{chapter.notes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>No additional maintained notes are attached to this chapter.</p>}
          <a href={research?.source || chapter.sourceUrl} target="_blank" rel="noreferrer">Hunterpedia chapter record <ExternalLink size={12} /></a>
          {research?.officialReaderUrl && <a href={research.officialReaderUrl} target="_blank" rel="noreferrer">Official Japanese chapter listing <ExternalLink size={12} /></a>}
        </article>
      </div>

      {isDetailedHandoff && <>
        <section className="index-section">
          <div className="index-heading"><div><span className="section-kicker">Chapter forensics</span><h2>What Chapter 339 actually changes</h2><p>The handoff is maintained as chapter-specific content rather than a generic arc-phase placeholder.</p></div></div>
          <div className="story-grid">
            <article><span>Opening → closing</span><h3>{research.openingLocation} → {research.closingLocation}</h3><ul>{research.keyEvents.map((event) => <li key={event}>{event}</li>)}</ul></article>
            <article><span>Outside-world framework</span><h3>Four requirements Ging names</h3><ol>{research.expeditionFramework.map((item) => <li key={item}>{item}</li>)}</ol><p>{research.darkContinentDevelopments.join(' ')}</p></article>
            <article><span>Nen delta</span><h3>{research.nenDelta.status === 'none-known' ? 'No new Nen mechanic this chapter' : 'Nen mechanics updated'}</h3><p>{research.nenDelta.note}</p><dl><div><dt>New abilities</dt><dd>{research.nenDelta.newAbilities.length}</dd></div><div><dt>Refined abilities</dt><dd>{research.nenDelta.refinedAbilities.length}</dd></div><div><dt>Guardian Beasts</dt><dd>{research.nenDelta.guardianSpiritBeasts.length}</dd></div><div><dt>New rules</dt><dd>{research.nenDelta.newRules.length}</dd></div></dl></article>
            <article><span>Communications</span><h3>Calls, postcards, and shared updates</h3><ul>{research.communications.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span>Deception boundary</span><h3>Gotoh / Kiriko aftermath</h3><ul>{research.deception.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span>Open → resolved</span><h3>Handoff questions</h3><ul>{research.questions.map((item) => <li key={item}>{item}</li>)}</ul><h4>Resolved in this chapter</h4><ul>{research.resolvedQuestions.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </section>
      </>}

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
