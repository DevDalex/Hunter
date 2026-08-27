import { useMemo, useState } from 'react';
import { maintainedSuccessionChapterResearch } from '../../data/successionMaintainedChapterResearch';
import { timelineCausality } from '../../data/successionTimelineIntelligence';
import './SuccessionTimelineMangaWall.css';

const FILTERS = [
  { id: 'all', label: 'All', terms: [] },
  { id: 'succession', label: 'Succession', terms: ['succession', 'prince', 'princess', 'queen', 'royal', 'kakin', 'guardian spirit beast'] },
  { id: 'kurapika', label: 'Kurapika', terms: ['kurapika'] },
  { id: 'nen', label: 'Nen', terms: ['nen', 'aura', 'ability', 'guardian spirit beast', 'dowsing chain', 'emperor time', 'specialist', 'manipulation', 'conjuration', 'emission', 'enhancement', 'transmutation'] },
  { id: 'mafia', label: 'Mafia', terms: ['mafia', 'xi-yu', 'cha-r', 'heil-ly', 'morena', 'hinrigh', 'onior', 'brocco'] },
  { id: 'heilly', label: 'Heil-Ly', terms: ['heil-ly', 'heilly', 'morena', 'borksen', 'contagion'] },
  { id: 'troupe', label: 'Troupe / Hisoka', terms: ['phantom troupe', 'troupe', 'hisoka', 'chrollo', 'spider'] },
];

const PAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const DEFAULT_PAGE_NUMBERS = [1, 7, 13];
const DENSE_PAGE_NUMBERS = [1, 7, 13, 18];

const normalize = (value) => String(value || '').trim().toLowerCase();
const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const padPage = (page) => String(page).padStart(3, '0');

const eventSearchText = (event) => normalize([
  event.title,
  event.label,
  event.detail,
  event.location,
  ...(event.tracks || []),
  ...(event.people || []),
].filter(Boolean).join(' '));

const eventMatchesFilter = (event, filter) => {
  if (filter.id === 'all') return true;
  const haystack = eventSearchText(event);
  return filter.terms.some((term) => haystack.includes(normalize(term)));
};

const eventIsLandmark = (event) => timelineCausality.some((record) => (
  record.chapter === event.chapter
  && normalize(event.title || event.label).includes(normalize(record.match))
));

const eventsForRecord = (record) => {
  const events = record?.events?.length ? record.events : (record?.timelineEvents || []);
  return events.map((event, index) => ({
    ...event,
    id: event.id || `chapter-${record.number}-event-${index + 1}`,
    title: event.title || event.label || `Chapter ${record.number} event ${index + 1}`,
    detail: event.detail || record.focus || '',
    chapter: Number(event.chapter || record.number),
    tracks: event.tracks || [],
  }));
};

const buildChapterRecords = (spoilerLimit) => {
  const records = new Map();

  for (const record of maintainedSuccessionChapterResearch) {
    const chapter = Number(record.number);
    if (!Number.isFinite(chapter) || chapter > spoilerLimit) continue;

    const current = records.get(chapter) || {
      number: chapter,
      title: null,
      phase: null,
      voyageDay: null,
      focus: null,
      source: null,
      events: [],
    };

    current.title ||= record.title || null;
    current.phase ||= record.phase || null;
    current.voyageDay ||= record.voyageDay || null;
    current.focus ||= record.focus || null;
    current.source ||= record.source || null;
    current.events.push(...eventsForRecord(record));
    records.set(chapter, current);
  }

  return [...records.values()].sort((left, right) => left.number - right.number);
};

function MangaPage({ chapter, page, onOpen }) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [missing, setMissing] = useState(false);

  if (missing) return null;

  const src = `/media/succession-contest/chapters/${chapter}/${padPage(page)}.${PAGE_EXTENSIONS[extensionIndex]}`;

  const handleError = () => {
    if (extensionIndex < PAGE_EXTENSIONS.length - 1) {
      setExtensionIndex((current) => current + 1);
      return;
    }
    setMissing(true);
  };

  return (
    <figure className="timeline-manga-wall__page">
      <button type="button" onClick={() => onOpen(src, chapter, page)} aria-label={`Open Chapter ${chapter} page ${page}`}>
        <img
          src={src}
          alt={`Hunter × Hunter Chapter ${chapter}, page ${page}`}
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
        <span>p.{padPage(page)}</span>
      </button>
    </figure>
  );
}

function TimelineEvent({ event, filter, open, onToggle, forceDetail }) {
  const matched = eventMatchesFilter(event, filter);
  const landmark = eventIsLandmark(event);

  return (
    <article className={`timeline-manga-wall__event${landmark ? ' is-landmark' : ''}${matched ? '' : ' is-dimmed'}${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="timeline-manga-wall__event-button"
        onClick={() => !forceDetail && onToggle(event.id)}
        aria-expanded={forceDetail || open}
      >
        <strong>{event.title}</strong>
        {!!event.tracks.length && (
          <span className="timeline-manga-wall__event-tags">
            {event.tracks.slice(0, 3).map((track) => <span key={track}>{labelize(track)}</span>)}
          </span>
        )}
      </button>
      <div className="timeline-manga-wall__event-detail" aria-hidden={!forceDetail && !open}>
        <p>{event.detail}</p>
        <dl>
          {event.location && <div><dt>Place</dt><dd>{event.location}</dd></div>}
          {event.time && <div><dt>Time</dt><dd>{event.time}</dd></div>}
          {event.confidence && <div><dt>Evidence</dt><dd>{event.confidence}</dd></div>}
        </dl>
        {event.source && <a href={event.source} target="_blank" rel="noreferrer">Source</a>}
      </div>
    </article>
  );
}

function ChapterSlice({ chapter, filter, zoom, expandedEvents, onToggleEvent, onOpenPage }) {
  const pages = chapter.events.length >= 18 ? DENSE_PAGE_NUMBERS : DEFAULT_PAGE_NUMBERS;
  const forceDetail = zoom === 'detail';
  const matchingEvents = chapter.events.filter((event) => eventMatchesFilter(event, filter)).length;
  const chapterDimmed = filter.id !== 'all' && matchingEvents === 0;
  const items = [];
  const chunks = pages.length;
  const chunkSize = Math.max(1, Math.ceil(chapter.events.length / chunks));

  pages.forEach((page, index) => {
    items.push({ type: 'page', key: `page-${page}`, page });
    const start = index * chunkSize;
    const end = index === pages.length - 1 ? chapter.events.length : Math.min(chapter.events.length, start + chunkSize);
    chapter.events.slice(start, end).forEach((event) => items.push({ type: 'event', key: event.id, event }));
  });

  const subtitle = [chapter.voyageDay, chapter.title, chapter.phase].filter(Boolean).join(' · ');

  return (
    <section
      className={`timeline-manga-wall__chapter${chapterDimmed ? ' is-dimmed' : ''}`}
      id={`timeline-chapter-${chapter.number}`}
      data-chapter={chapter.number}
      aria-label={`Chapter ${chapter.number}`}
    >
      <header className="timeline-manga-wall__chapter-head">
        <span className="timeline-manga-wall__chapter-number">{chapter.number}</span>
        <span className="timeline-manga-wall__chapter-meta">{subtitle || `Chapter ${chapter.number}`}</span>
      </header>

      <div className="timeline-manga-wall__chapter-grid">
        {items.map((item) => item.type === 'page' ? (
          <MangaPage
            key={item.key}
            chapter={chapter.number}
            page={item.page}
            onOpen={onOpenPage}
          />
        ) : (
          <TimelineEvent
            key={item.key}
            event={item.event}
            filter={filter}
            open={expandedEvents.has(item.event.id)}
            onToggle={onToggleEvent}
            forceDetail={forceDetail}
          />
        ))}
      </div>
    </section>
  );
}

export default function SuccessionTimelineMangaWall({ spoilerLimit, onBack }) {
  const chapters = useMemo(() => buildChapterRecords(spoilerLimit), [spoilerLimit]);
  const [filterId, setFilterId] = useState('all');
  const [zoom, setZoom] = useState('chapter');
  const [expandedEvents, setExpandedEvents] = useState(() => new Set());
  const [chapterInput, setChapterInput] = useState(() => String(chapters[0]?.number || ''));
  const [lightbox, setLightbox] = useState(null);
  const filter = FILTERS.find((item) => item.id === filterId) || FILTERS[0];
  const firstChapter = chapters[0]?.number || 340;
  const lastChapter = chapters.at(-1)?.number || spoilerLimit;

  const toggleEvent = (id) => {
    setExpandedEvents((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpToChapter = (event) => {
    event?.preventDefault?.();
    const requested = Math.max(firstChapter, Math.min(lastChapter, Number(chapterInput) || firstChapter));
    setChapterInput(String(requested));
    document.getElementById(`timeline-chapter-${requested}`)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <article className="timeline-manga-wall" data-zoom={zoom}>
      <header className="timeline-manga-wall__bar">
        <div className="timeline-manga-wall__identity">
          <button type="button" onClick={onBack} aria-label="Back to homepage">←</button>
          <strong>Timeline</strong>
        </div>

        <nav className="timeline-manga-wall__filters" aria-label="Timeline filters">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filterId === item.id ? 'is-active' : ''}
              onClick={() => setFilterId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="timeline-manga-wall__tools">
          <form onSubmit={jumpToChapter} className="timeline-manga-wall__jump">
            <input
              type="number"
              min={firstChapter}
              max={lastChapter}
              value={chapterInput}
              onChange={(event) => setChapterInput(event.target.value)}
              aria-label="Chapter number"
            />
            <button type="submit">Go</button>
          </form>
          <div className="timeline-manga-wall__zoom" aria-label="Timeline density">
            {['arc', 'chapter', 'detail'].map((level) => (
              <button
                key={level}
                type="button"
                className={zoom === level ? 'is-active' : ''}
                onClick={() => setZoom(level)}
              >
                {labelize(level)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="timeline-manga-wall__range" aria-hidden="true">
        <span>{firstChapter}</span>
        <i />
        <span>{lastChapter}</span>
      </div>

      <div className="timeline-manga-wall__scroller">
        <main className="timeline-manga-wall__chapters">
          {chapters.map((chapter) => (
            <ChapterSlice
              key={chapter.number}
              chapter={chapter}
              filter={filter}
              zoom={zoom}
              expandedEvents={expandedEvents}
              onToggleEvent={toggleEvent}
              onOpenPage={(src, chapterNumber, page) => setLightbox({ src, chapter: chapterNumber, page })}
            />
          ))}
        </main>
      </div>

      <div className="timeline-manga-wall__hint" aria-hidden="true">scroll sideways · click event · click manga page</div>

      {lightbox && (
        <div className="timeline-manga-wall__lightbox" role="dialog" aria-modal="true" aria-label={`Chapter ${lightbox.chapter} page ${lightbox.page}`} onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)}>Close</button>
          <img src={lightbox.src} alt={`Hunter × Hunter Chapter ${lightbox.chapter}, page ${lightbox.page}`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </article>
  );
}
