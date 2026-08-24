import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  GitBranch,
  MapPin,
  Search,
  UsersRound,
  X,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
  timelineTracks,
} from '../data/successionTimeline';
import {
  peopleForTimelineEvent,
  timelineImportance,
} from '../data/successionTimelineIntelligence';
import {
  getCharactersWithStateProfiles,
  getEntitiesByType,
} from '../data/succession/successionData';
import SafeImage from './SafeImage';
import './TimelineComparisonBuilder.css';

const MAX_LENSES = 6;
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const parseCompare = (value) => String(value || '').split('|').map((item) => item.trim()).filter(Boolean).slice(0, MAX_LENSES);
const lensKey = (kind, id) => `${kind}@${id}`;

const icons = {
  character: UsersRound,
  organization: Building2,
  thread: GitBranch,
  location: MapPin,
};

function lensSubtitle(lens) {
  if (lens.kind === 'character') return (lens.entity.roles || []).slice(0, 2).map(labelize).join(' · ') || 'Character';
  if (lens.kind === 'organization') return 'Faction / organization';
  if (lens.kind === 'thread') return 'Story thread';
  return 'Black Whale / story location';
}

export default function TimelineComparisonBuilder({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState('all');

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
    }).map((event) => {
      const people = peopleForTimelineEvent(event);
      return {
        ...event,
        people,
        importance: timelineImportance(event),
        searchText: normalize([
          event.title,
          event.detail,
          event.location,
          ...people,
          ...(event.tracks || []),
        ].filter(Boolean).join(' ')),
      };
    });
  }, [spoilerLimit]);

  const characters = useMemo(() => getCharactersWithStateProfiles(), []);
  const organizations = useMemo(() => getEntitiesByType('organization'), []);
  const chapterMinimum = events.length ? Math.min(...events.map((event) => event.chapter)) : 340;
  const chapterMaximum = events.length ? Math.max(...events.map((event) => event.chapter)) : chapterMinimum;
  const contextChapter = Math.max(chapterMinimum, Math.min(Number(requestedState.chapter) || chapterMaximum, chapterMaximum));
  const chapters = useMemo(() => Array.from({ length: chapterMaximum - chapterMinimum + 1 }, (_, index) => chapterMinimum + index), [chapterMaximum, chapterMinimum]);

  const characterTerms = useMemo(() => new Map(characters.map((character) => [
    character.id,
    [character.name, ...(character.aliases || [])].map(normalize).filter(Boolean),
  ])), [characters]);

  const organizationMemberTerms = useMemo(() => {
    const map = new Map(organizations.map((organization) => [organization.id, []]));
    for (const character of characters) {
      for (const affiliation of character.affiliations || []) {
        if (!map.has(affiliation.organizationId)) continue;
        map.get(affiliation.organizationId).push(...(characterTerms.get(character.id) || []));
      }
    }
    return map;
  }, [characterTerms, characters, organizations]);

  const locations = useMemo(() => [...new Set(events.map((event) => event.location).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [events]);

  const lenses = useMemo(() => [
    ...characters.map((entity) => ({
      key: lensKey('character', entity.id),
      kind: 'character',
      id: entity.id,
      name: entity.name,
      entity,
      terms: characterTerms.get(entity.id) || [],
    })),
    ...organizations.map((entity) => ({
      key: lensKey('organization', entity.id),
      kind: 'organization',
      id: entity.id,
      name: entity.name,
      entity,
      terms: [normalize(entity.name), ...(entity.aliases || []).map(normalize)].filter(Boolean),
      memberTerms: organizationMemberTerms.get(entity.id) || [],
    })),
    ...timelineTracks.filter((track) => track.id !== 'all').map((track) => ({
      key: lensKey('thread', track.id),
      kind: 'thread',
      id: track.id,
      name: track.label,
      track,
    })),
    ...locations.map((name) => ({
      key: lensKey('location', name),
      kind: 'location',
      id: name,
      name,
    })),
  ], [characterTerms, characters, locations, organizationMemberTerms, organizations]);

  const lensMap = useMemo(() => new Map(lenses.map((lens) => [lens.key, lens])), [lenses]);
  const selectedKeys = parseCompare(requestedState.compare);
  const selected = selectedKeys.map((key) => lensMap.get(key)).filter(Boolean);
  const selectedKeySet = new Set(selected.map((lens) => lens.key));

  const eventMatchesLens = (event, lens) => {
    if (lens.kind === 'thread') return event.tracks?.includes(lens.id);
    if (lens.kind === 'location') return normalize(event.location) === normalize(lens.name);
    if (lens.kind === 'character') {
      return event.people.some((person) => {
        const normalizedPerson = normalize(person);
        return lens.terms.some((term) => normalizedPerson.includes(term) || term.includes(normalizedPerson));
      });
    }
    if (lens.kind === 'organization') {
      if ((event.organizationIds || []).includes(lens.id)) return true;
      if (lens.terms.some((term) => term && event.searchText.includes(term))) return true;
      return event.people.some((person) => {
        const normalizedPerson = normalize(person);
        return lens.memberTerms.some((term) => normalizedPerson.includes(term) || term.includes(normalizedPerson));
      });
    }
    return false;
  };

  const rows = useMemo(() => selected.map((lens) => {
    const matching = events.filter((event) => eventMatchesLens(event, lens));
    const byChapter = new Map();
    for (const event of matching) {
      const current = byChapter.get(event.chapter) || [];
      current.push(event);
      byChapter.set(event.chapter, current);
    }
    return {
      lens,
      events: matching,
      byChapter,
      firstChapter: matching.length ? Math.min(...matching.map((event) => event.chapter)) : null,
      lastChapter: matching.length ? Math.max(...matching.map((event) => event.chapter)) : null,
    };
  }), [events, selected]);

  const normalizedQuery = normalize(query);
  const available = lenses.filter((lens) => !selectedKeySet.has(lens.key)
    && (kindFilter === 'all' || lens.kind === kindFilter)
    && (!normalizedQuery || normalize(`${lens.name} ${lensSubtitle(lens)}`).includes(normalizedQuery)))
    .slice(0, 24);

  const persistSelection = (keys, overrides = {}) => {
    const { event: _event, compare: _compare, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      chapter: contextChapter,
      ...(keys.length ? { compare: keys.join('|') } : {}),
      ...overrides,
    });
  };

  const addLens = (lens) => {
    if (selectedKeys.length >= MAX_LENSES) return;
    persistSelection([...selectedKeys, lens.key]);
    setQuery('');
  };

  const removeLens = (key) => persistSelection(selectedKeys.filter((candidate) => candidate !== key));
  const clearAll = () => persistSelection([]);

  const focusLens = (lens) => {
    const { character: _character, thread: _thread, location: _location, search: _search, event: _event, ...preserved } = requestedState;
    const overrides = lens.kind === 'character'
      ? { character: lens.id }
      : lens.kind === 'thread'
        ? { thread: lens.id }
        : lens.kind === 'location'
          ? { location: lens.name }
          : { search: lens.name };
    onNavigate?.({ ...preserved, scope: 'events', compare: selectedKeys.join('|'), chapter: contextChapter, ...overrides });
  };

  const openChapterEvent = (row, chapter) => {
    const candidates = row.byChapter.get(chapter) || [];
    const event = [...candidates].sort((left, right) => {
      const rank = { major: 0, standard: 1, complete: 2 };
      return (rank[left.importance] ?? 3) - (rank[right.importance] ?? 3);
    })[0];
    if (!event) return;
    const { character: _character, thread: _thread, location: _location, search: _search, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      compare: selectedKeys.join('|'),
      chapter,
      from: chapter,
      to: chapter,
      event: event.id,
      depth: 'complete',
    });
  };

  return (
    <section className={`timeline-comparison${selected.length ? ' has-selection' : ''}`} aria-labelledby="timeline-comparison-title">
      <header className="tlc-head">
        <div>
          <span>COMPARE THE VOYAGE</span>
          <h2 id="timeline-comparison-title">Build your own chronology.</h2>
          <p>Stack people, factions, story threads, and locations on the same chapter axis. Nothing is summarized away: occupied nodes reopen the underlying event record.</p>
        </div>
        <div className="tlc-head__status"><strong>{selected.length}</strong><span>of {MAX_LENSES} lenses</span>{selected.length > 0 && <button type="button" onClick={clearAll}>Clear all</button>}</div>
      </header>

      <section className="tlc-picker" aria-label="Add comparison lens">
        <label className="tlc-search"><Search size={15} aria-hidden="true" /><span className="sr-only">Search comparison lenses</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Add Kurapika, Heil-Ly, Nen, Room 1014…" /></label>
        <nav aria-label="Comparison lens types">
          {[['all', 'All'], ['character', 'People'], ['organization', 'Factions'], ['thread', 'Threads'], ['location', 'Places']].map(([id, label]) => <button type="button" className={kindFilter === id ? 'is-active' : ''} aria-pressed={kindFilter === id} onClick={() => setKindFilter(id)} key={id}>{label}</button>)}
        </nav>
        <div className="tlc-picker__results">
          {available.map((lens) => {
            const Icon = icons[lens.kind];
            return <button type="button" onClick={() => addLens(lens)} disabled={selected.length >= MAX_LENSES} key={lens.key}>
              {lens.entity?.media?.portrait ? <SafeImage src={lens.entity.media.portrait} fallbackLabel={lens.name} alt="" /> : <i><Icon size={14} aria-hidden="true" /></i>}
              <span><strong>{lens.name}</strong><small>{lensSubtitle(lens)}</small></span>
              <b>+</b>
            </button>;
          })}
          {!available.length && <p>No additional lenses match this search.</p>}
        </div>
      </section>

      {!selected.length ? <div className="tlc-empty"><GitBranch size={26} aria-hidden="true" /><div><strong>Start with two things you want to understand together.</strong><p>For example: a character + faction, two princes, a story thread + location, or several competing storylines.</p></div></div> : <section className="tlc-field" aria-label="Comparison timeline field">
        <div className="tlc-field__scroll">
          <div className="tlc-axis" style={{ '--tlc-columns': chapters.length }}>
            <div><span>CHAPTER AXIS</span><small>current context: {contextChapter}</small></div>
            <div>{chapters.map((chapter) => <span className={chapter === contextChapter ? 'is-current' : ''} key={chapter}>{chapter % 5 === 0 || chapter === chapterMinimum || chapter === chapterMaximum ? chapter : '·'}</span>)}</div>
          </div>

          {rows.map((row) => {
            const Icon = icons[row.lens.kind];
            return <article className="tlc-row" key={row.lens.key}>
              <header>
                <div className="tlc-row__identity">{row.lens.entity?.media?.portrait ? <SafeImage src={row.lens.entity.media.portrait} fallbackLabel={row.lens.name} alt="" /> : <i><Icon size={16} aria-hidden="true" /></i>}<span><small>{lensSubtitle(row.lens)}</small><strong>{row.lens.name}</strong><em>{row.events.length} linked records{row.firstChapter ? ` · Ch. ${row.firstChapter}–${row.lastChapter}` : ''}</em></span></div>
                <div className="tlc-row__actions"><button type="button" onClick={() => focusLens(row.lens)}>Focus <ArrowRight size={12} aria-hidden="true" /></button><button type="button" aria-label={`Remove ${row.lens.name} from comparison`} onClick={() => removeLens(row.lens.key)}><X size={13} aria-hidden="true" /></button></div>
              </header>
              <div className="tlc-track" style={{ '--tlc-columns': chapters.length }}>
                {chapters.map((chapter) => {
                  const chapterEvents = row.byChapter.get(chapter) || [];
                  const major = chapterEvents.some((event) => event.importance === 'major');
                  return <button
                    type="button"
                    className={`${chapterEvents.length ? 'has-events' : ''}${major ? ' has-major' : ''}${chapter === contextChapter ? ' is-current' : ''}`}
                    disabled={!chapterEvents.length}
                    title={chapterEvents.length ? `${row.lens.name} · Chapter ${chapter} · ${chapterEvents.length} linked event${chapterEvents.length === 1 ? '' : 's'}` : `${row.lens.name} · Chapter ${chapter} · no linked events`}
                    aria-label={`${row.lens.name}, Chapter ${chapter}, ${chapterEvents.length} linked events`}
                    onClick={() => openChapterEvent(row, chapter)}
                    key={chapter}
                  ><i>{chapterEvents.length > 1 ? chapterEvents.length : ''}</i></button>;
                })}
              </div>
            </article>;
          })}
        </div>
        <footer><span><i className="is-node" /> linked event</span><span><i className="is-major" /> major turn</span><span><i className="is-context" /> active chapter</span><p>Select any occupied node to open the strongest underlying event at that chapter.</p></footer>
      </section>}
    </section>
  );
}
