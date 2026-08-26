import { useMemo } from 'react';
import {
  Activity,
  Crosshair,
  Flame,
  Mountain,
  Sparkles,
  Skull,
  TriangleAlert,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
} from '../data/successionTimeline';
import { timelineImportance } from '../data/successionTimelineIntelligence';
import { classifyTimelineEvent } from '../data/successionTimelineResearch';
import { strictTimelineNenForEvent } from '../data/successionTimelineIntelligenceView';
import './TimelineStoryTopography.css';

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(value, maximum));

const weights = Object.freeze({
  record: 1,
  standard: 1.35,
  major: 4,
  thread: .55,
  emergency: 4.5,
  death: 3.5,
  nen: 3.25,
});

const labelForPressure = (value) => value >= 82
  ? 'Crest'
  : value >= 62
    ? 'High pressure'
    : value >= 40
      ? 'Rising pressure'
      : value >= 20
        ? 'Active'
        : 'Low pressure';

function Signal({ icon: Icon, value, label }) {
  return <span className={value ? 'has-signal' : ''}><Icon size={10} aria-hidden="true" /><b>{value}</b><small>{label}</small></span>;
}

export default function TimelineStoryTopography({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const events = useMemo(() => {
    const prelude = successionPreludeEvents
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: null }));
    const voyage = successionDays.flatMap((day) => day.events
      .filter((event) => event.chapter <= spoilerLimit)
      .map((event) => ({ ...event, day: day.day, date: day.date })));
    const seen = new Set();
    return [...prelude, ...voyage].filter((event) => {
      if (!event?.id || seen.has(event.id)) return false;
      seen.add(event.id);
      return true;
    }).map((event) => ({ ...event, importance: timelineImportance(event) }));
  }, [spoilerLimit]);

  const chapterMinimum = events.length ? Math.min(...events.map((event) => event.chapter)) : 340;
  const chapterMaximum = events.length ? Math.max(...events.map((event) => event.chapter)) : chapterMinimum;
  const chapterSpan = Math.max(1, chapterMaximum - chapterMinimum + 1);
  const contextChapter = clamp(Number(requestedState.chapter) || chapterMaximum, chapterMinimum, chapterMaximum);
  const activeTrack = requestedState.thread || '';
  const focusedEvents = useMemo(
    () => activeTrack ? events.filter((event) => event.tracks?.includes(activeTrack)) : events,
    [activeTrack, events],
  );

  const topography = useMemo(() => {
    const rows = Array.from({ length: chapterSpan }, (_, index) => {
      const chapter = chapterMinimum + index;
      const chapterEvents = focusedEvents.filter((event) => Number(event.chapter) === chapter);
      const types = chapterEvents.map((event) => classifyTimelineEvent(event));
      const major = chapterEvents.filter((event) => event.importance === 'major').length;
      const standard = chapterEvents.filter((event) => event.importance === 'standard').length;
      const emergencies = types.filter((type) => type === 'emergency').length;
      const deaths = types.filter((type) => type === 'death').length;
      const nen = chapterEvents.reduce((total, event) => total + strictTimelineNenForEvent(event).length, 0);
      const threadCount = new Set(chapterEvents.flatMap((event) => event.tracks || [])).size;
      const raw = chapterEvents.length * weights.record
        + standard * weights.standard
        + major * weights.major
        + threadCount * weights.thread
        + emergencies * weights.emergency
        + deaths * weights.death
        + nen * weights.nen;
      return {
        chapter,
        count: chapterEvents.length,
        major,
        standard,
        emergencies,
        deaths,
        nen,
        threadCount,
        raw,
      };
    });

    const maximumRaw = Math.max(1, ...rows.map((row) => row.raw));
    return rows.map((row, index) => {
      const previous = rows[index - 1]?.raw || 0;
      const next = rows[index + 1]?.raw || 0;
      const outerPrevious = rows[index - 2]?.raw || 0;
      const outerNext = rows[index + 2]?.raw || 0;
      const smoothed = row.raw * .52 + previous * .17 + next * .17 + outerPrevious * .07 + outerNext * .07;
      return {
        ...row,
        pressure: Math.round((row.raw / maximumRaw) * 100),
        ridge: Math.round((smoothed / maximumRaw) * 100),
      };
    });
  }, [chapterMinimum, chapterSpan, focusedEvents]);

  const peaks = useMemo(() => [...topography]
    .filter((row) => row.count)
    .sort((left, right) => right.ridge - left.ridge
      || right.pressure - left.pressure
      || right.major - left.major
      || left.chapter - right.chapter)
    .slice(0, 5), [topography]);

  const current = topography.find((row) => row.chapter === contextChapter) || topography.at(-1);
  const maximumCount = Math.max(1, ...topography.map((row) => row.count));
  const totalSignals = topography.reduce((summary, row) => ({
    major: summary.major + row.major,
    emergencies: summary.emergencies + row.emergencies,
    deaths: summary.deaths + row.deaths,
    nen: summary.nen + row.nen,
  }), { major: 0, emergencies: 0, deaths: 0, nen: 0 });

  const selectChapter = (chapter) => {
    const nextChapter = clamp(chapter, chapterMinimum, chapterMaximum);
    const { event: _event, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', chapter: nextChapter });
  };

  return <section className="timeline-story-topography" aria-labelledby="tst-title">
    <header className="tst-head">
      <div>
        <span><Mountain size={13} aria-hidden="true" /> STORY TOPOGRAPHY</span>
        <h3 id="tst-title">Pressure has a shape.</h3>
        <p>The ridge is a derived presentation index, not an in-universe danger score. It combines maintained chronology density, major turns, active threads, emergencies, fatalities, and strict Nen signals.</p>
      </div>
      <div className="tst-current" aria-live="polite">
        <Crosshair size={14} aria-hidden="true" />
        <span>CHAPTER {current?.chapter || contextChapter}</span>
        <strong>{current?.ridge || 0}</strong>
        <small>{labelForPressure(current?.ridge || 0)}</small>
      </div>
    </header>

    <div className="tst-landscape" style={{ '--tst-columns': topography.length }}>
      <div className="tst-landscape__grid" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="tst-landscape__baseline" aria-hidden="true" />
      <div className="tst-columns" role="group" aria-label="Chapter story pressure. Select a chapter to move the shared timeline context.">
        {topography.map((row) => {
          const currentChapter = row.chapter === contextChapter;
          return <button
            type="button"
            className={`tst-column${currentChapter ? ' is-current' : ''}${row.ridge >= 70 ? ' is-peak' : ''}`}
            style={{
              '--ridge-height': `${Math.max(2, row.ridge)}%`,
              '--spike-height': `${Math.max(row.count ? 5 : 1, row.pressure)}%`,
              '--density-opacity': Math.max(.1, row.count / maximumCount),
            }}
            title={`Chapter ${row.chapter}: pressure ${row.ridge}/100 · ${row.count} records · ${row.major} major · ${row.threadCount} threads · ${row.emergencies} emergencies · ${row.deaths} fatalities · ${row.nen} Nen signals`}
            aria-label={`Chapter ${row.chapter}. Story pressure ${row.ridge} of 100. ${row.count} records, ${row.major} major turns, ${row.threadCount} active threads, ${row.emergencies} emergency signals, ${row.deaths} fatality signals, ${row.nen} Nen signals.`}
            aria-current={currentChapter ? 'step' : undefined}
            onClick={() => selectChapter(row.chapter)}
            key={row.chapter}
          >
            <i className="tst-column__ridge" aria-hidden="true" />
            <i className="tst-column__spike" aria-hidden="true" />
            <span className="tst-column__signals" aria-hidden="true">
              {!!row.major && <b className="is-major" />}
              {!!row.emergencies && <b className="is-emergency" />}
              {!!row.deaths && <b className="is-death" />}
              {!!row.nen && <b className="is-nen" />}
            </span>
            <span className="tst-column__chapter">{row.chapter % 5 === 0 || row.chapter === chapterMinimum || row.chapter === chapterMaximum ? row.chapter : ''}</span>
          </button>;
        })}
      </div>
      <div className="tst-current-line" style={{ '--current-left': `${((contextChapter - chapterMinimum + .5) / chapterSpan) * 100}%` }} aria-hidden="true"><span>CH. {contextChapter}</span></div>
    </div>

    <div className="tst-analysis">
      <section className="tst-peaks" aria-labelledby="tst-peaks-title">
        <header><span>PRESSURE CRESTS</span><strong id="tst-peaks-title">Five densest story zones</strong></header>
        <ol>{peaks.map((peak, index) => <li key={peak.chapter}>
          <button type="button" onClick={() => selectChapter(peak.chapter)}>
            <i>{String(index + 1).padStart(2, '0')}</i>
            <span><strong>Chapter {peak.chapter}</strong><small>{peak.count} records · {peak.threadCount} threads</small></span>
            <b>{peak.ridge}</b>
          </button>
        </li>)}</ol>
      </section>

      <section className="tst-signals" aria-labelledby="tst-signals-title">
        <header><span>SIGNAL INVENTORY</span><strong id="tst-signals-title">What raises the terrain?</strong></header>
        <div>
          <Signal icon={Flame} value={totalSignals.major} label="major turns" />
          <Signal icon={TriangleAlert} value={totalSignals.emergencies} label="emergency signals" />
          <Signal icon={Skull} value={totalSignals.deaths} label="fatality signals" />
          <Signal icon={Sparkles} value={totalSignals.nen} label="strict Nen signals" />
        </div>
        <footer><Activity size={12} aria-hidden="true" /><span>{focusedEvents.length.toLocaleString()} records shape this terrain{activeTrack ? ` in ${activeTrack}` : ' across the full arc'}.</span></footer>
      </section>
    </div>
  </section>;
}
