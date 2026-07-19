import { Check, ChevronRight } from 'lucide-react';

export default function ChapterIndex({ chapters, studied, openChapter, density }) {
  if (!chapters.length) return <div className="empty-state"><h3>No chapters found</h3><p>Try another title, number, arc, or volume.</p></div>;

  return (
    <div className={`chapter-index chapter-index--${density}`}>
      {chapters.map((chapter) => (
        <button className={`chapter-row ${studied.has(chapter.number) ? 'is-studied' : ''}`} key={chapter.number} onClick={() => openChapter(chapter)}>
          <span className="chapter-row__number">{String(chapter.number).padStart(3, '0')}</span>
          <span className="chapter-row__main"><strong>{chapter.title}</strong><small>{chapter.arcTitle} · {chapter.researchStatus}</small></span>
          <span className="chapter-row__meta">{chapter.volume ? `Vol. ${chapter.volume}` : 'Uncollected'}</span>
          <span className="chapter-row__status" aria-label={studied.has(chapter.number) ? 'Studied' : 'Not studied'}>
            {studied.has(chapter.number) ? <Check size={15} /> : null}
          </span>
          <ChevronRight size={17} />
        </button>
      ))}
    </div>
  );
}
