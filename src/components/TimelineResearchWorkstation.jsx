import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookmarkPlus,
  Boxes,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Command,
  FileDiff,
  FileDown,
  Filter,
  GitCompareArrows,
  History,
  Inbox,
  Keyboard,
  Layers3,
  Link2,
  MapPin,
  MessageSquareText,
  PanelTopOpen,
  Pin,
  Plus,
  Radar,
  Save,
  Search,
  ShieldQuestion,
  Sparkles,
  Tags,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  successionDays,
  successionPreludeEvents,
  timelineTracks,
} from '../data/successionTimeline';
import {
  evidenceConfidenceForEvent,
  peopleForTimelineEvent,
  timelineCausalityForEvent,
  timelineImportance,
  timingConfidenceForEvent,
} from '../data/successionTimelineIntelligence';
import {
  mediaForTimelinePhase,
  timelinePhaseForChapter,
} from '../data/successionTimelinePresentation';
import { timelineQuestionLedger } from '../data/successionTimelineQuestions';
import {
  getChapterWhatChanged,
  getCharactersWithStateProfiles,
  getEntitiesByType,
} from '../data/succession/successionData';
import {
  TIMELINE_RESEARCH_MEMORY_EVENT,
  addTimelineResearchAnnotation,
  addTimelineResearchHypothesis,
  addTimelineResearchHypothesisEvidence,
  addTimelineResearchInboxItem,
  addTimelineResearchQuestion,
  clearTimelineResearchTrail,
  createTimelineResearchSession,
  deleteTimelineResearchAnnotation,
  deleteTimelineResearchFilter,
  deleteTimelineResearchSession,
  readTimelineResearchMemory,
  recordTimelineResearchTrail,
  removeTimelineResearchInboxItem,
  saveTimelineResearchFilter,
  setActiveTimelineResearchSession,
  toggleTimelineResearchPin,
  updateTimelineResearchHypothesis,
  updateTimelineResearchQuestion,
  updateTimelineResearchSession,
} from '../data/timelineResearchMemory';
import SafeImage from './SafeImage';
import './TimelineResearchWorkstation.css';

const DESK_TABS = Object.freeze([
  ['session', 'Session'],
  ['evidence', 'Evidence'],
  ['diff', 'What changed'],
  ['theory', 'Theory'],
  ['coverage', 'Coverage'],
  ['trail', 'Trail'],
]);
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const chapterClamp = (value, spoilerLimit) => Math.max(340, Math.min(spoilerLimit, Number(value) || spoilerLimit));
const formatCount = (value) => Number(value || 0).toLocaleString();
const confidenceWeak = (value) => /low|weak|uncertain|inferred|partial|unknown/i.test(String(value || ''));
const quoteValue = (value) => String(value || '').replace(/^['"]|['"]$/g, '');
const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function prepareEvents(spoilerLimit) {
  const prelude = successionPreludeEvents.filter((event) => event.chapter <= spoilerLimit).map((event) => ({ ...event, day: null, dayHeadline: event.periodTitle || 'Pre-voyage' }));
  const voyage = successionDays.flatMap((day) => day.events.filter((event) => event.chapter <= spoilerLimit).map((event) => ({ ...event, day: day.day, date: day.date, dayHeadline: day.headline })));
  const seen = new Set();
  return [...prelude, ...voyage].filter((event) => {
    if (!event?.id || seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  }).map((event, index) => {
    const phase = timelinePhaseForChapter(event.chapter);
    const people = peopleForTimelineEvent(event);
    const causality = timelineCausalityForEvent(event);
    const prepared = {
      ...event,
      archiveIndex: index,
      phase,
      people,
      causality,
      importance: timelineImportance(event),
      timing: timingConfidenceForEvent(event),
      evidence: evidenceConfidenceForEvent(event),
    };
    return {
      ...prepared,
      searchText: normalize([
        event.id,
        event.title,
        event.detail,
        event.location,
        event.chapter,
        event.time,
        event.dayHeadline,
        phase?.title,
        ...people,
        ...(event.tracks || []),
        ...(event.tracks || []).map((id) => timelineTracks.find((track) => track.id === id)?.label || id),
        causality?.cause,
        causality?.consequence,
        causality?.leadsTo,
      ].filter(Boolean).join(' ')),
    };
  });
}

const eventItem = (event) => event ? ({
  id: event.id,
  eventId: event.id,
  kind: 'event',
  label: event.title,
  chapter: event.chapter,
  location: event.location || null,
  context: `${event.phase?.shortTitle || 'Timeline'} · ${event.day ? `Day ${event.day}` : 'Prelude'}`,
  params: { event: event.id, chapter: event.chapter },
}) : null;
const personItem = (person, event, characterMap) => {
  const entity = characterMap.get(normalize(person));
  return {
    id: entity?.id || `person:${normalize(person)}`,
    entityId: entity?.id || null,
    kind: 'character',
    label: person,
    chapter: event?.chapter || null,
    eventId: event?.id || null,
    context: event ? `Seen in ${event.title}` : null,
    params: entity ? { compareKey: `character@${entity.id}` } : {},
  };
};
const locationItem = (location, event) => ({
  id: `location:${normalize(location)}`,
  kind: 'location',
  label: location,
  location,
  chapter: event?.chapter || null,
  eventId: event?.id || null,
  context: event ? `Location for ${event.title}` : null,
  params: { compareKey: `location@${location}` },
});
const threadItem = (trackId, event) => {
  const track = timelineTracks.find((candidate) => candidate.id === trackId);
  return {
    id: trackId,
    kind: 'thread',
    label: track?.label || labelize(trackId),
    chapter: event?.chapter || null,
    eventId: event?.id || null,
    context: event ? `Thread active in ${event.title}` : null,
    params: { compareKey: `thread@${trackId}` },
  };
};

function structuredTimelineQuery(input, spoilerLimit) {
  const raw = String(input || '').trim();
  const tokens = {};
  const tokenPattern = /\b(person|character|location|thread|chapter|importance|evidence|event|mode):(?:"([^"]+)"|'([^']+)'|([^\s]+))/gi;
  let match;
  while ((match = tokenPattern.exec(raw))) tokens[match[1].toLowerCase()] = quoteValue(match[2] || match[3] || match[4]);
  const rangeMatch = String(tokens.chapter || '').match(/(\d{3})\s*[-–]\s*(\d{3})/) || raw.match(/\b(?:ch(?:apter)?\.?\s*)?(\d{3})\s*[-–]\s*(\d{3})\b/i);
  const singleChapter = String(tokens.chapter || '').match(/^\d{3}$/)?.[0] || raw.match(/\b(?:chapter|ch\.?)\s*(\d{3})\b/i)?.[1];
  const stripped = raw.replace(tokenPattern, ' ').replace(/\s+/g, ' ').trim();
  const from = rangeMatch ? chapterClamp(rangeMatch[1], spoilerLimit) : null;
  const to = rangeMatch ? chapterClamp(rangeMatch[2], spoilerLimit) : null;
  return {
    raw,
    tokens,
    search: [tokens.person || tokens.character, tokens.location, tokens.event, stripped].filter(Boolean).join(' ').trim(),
    from: from === null ? null : Math.min(from, to),
    to: to === null ? null : Math.max(from, to),
    chapter: singleChapter ? chapterClamp(singleChapter, spoilerLimit) : null,
    thread: tokens.thread || null,
    importance: tokens.importance || null,
    evidence: tokens.evidence || null,
    mode: tokens.mode || null,
  };
}

function commandIntent(input, spoilerLimit) {
  const raw = String(input || '').trim();
  const lower = normalize(raw);
  const diff = raw.match(/(?:what changed|diff(?:erence)?)\D*(\d{3})\D+(\d{3})/i);
  if (diff) return { kind: 'diff', from: chapterClamp(diff[1], spoilerLimit), to: chapterClamp(diff[2], spoilerLimit) };
  if (/unresolved|open questions/.test(lower)) return { kind: 'questions' };
  const trace = raw.match(/^trace\s+(.+)/i);
  if (trace) return { kind: 'trace', query: trace[1].trim() };
  const compare = raw.match(/^compare\s+(.+?)\s+(?:and|vs\.?|versus)\s+(.+)$/i);
  if (compare) return { kind: 'compare', terms: [compare[1].trim(), compare[2].trim()] };
  const go = raw.match(/^(?:go to|open location)\s+(.+)/i);
  if (go) return { kind: 'location', query: go[1].trim() };
  if (/^(?:open )?(?:research desk|workstation)$/.test(lower)) return { kind: 'desk' };
  return { kind: 'query', query: structuredTimelineQuery(raw, spoilerLimit) };
}

function potentialConflicts(event, events) {
  if (!event) return [];
  const people = new Set((event.people || []).map(normalize));
  return events.filter((candidate) => candidate.id !== event.id && Math.abs(candidate.chapter - event.chapter) <= 1)
    .map((candidate) => {
      const shared = (candidate.people || []).filter((person) => people.has(normalize(person)));
      if (!shared.length) return null;
      const differentLocation = Boolean(event.location && candidate.location && normalize(event.location) !== normalize(candidate.location));
      const sameTime = Boolean(event.time && candidate.time && normalize(event.time) === normalize(candidate.time));
      const uncertainty = confidenceWeak(event.timing) || confidenceWeak(candidate.timing) || confidenceWeak(event.evidence) || confidenceWeak(candidate.evidence);
      const score = (sameTime && differentLocation ? 5 : 0) + (differentLocation ? 2 : 0) + shared.length + (uncertainty ? 1 : 0);
      if (score < 3) return null;
      return {
        event: candidate,
        shared,
        score,
        severity: sameTime && differentLocation ? 'high' : score >= 5 ? 'medium' : 'review',
        reason: sameTime && differentLocation
          ? 'Same named time and shared participant, but different recorded locations.'
          : differentLocation
            ? 'Nearby chronology shares participants across different recorded locations; movement or scene ordering may explain it.'
            : 'Nearby records share participants and contain timing/evidence uncertainty worth checking together.',
      };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8);
}

function coverageRows(events, spoilerLimit) {
  return Array.from({ length: spoilerLimit - 339 }, (_, index) => 340 + index).map((chapter) => {
    const rows = events.filter((event) => event.chapter === chapter);
    const sourced = rows.filter((event) => event.source).length;
    const strong = rows.filter((event) => !confidenceWeak(event.evidence)).length;
    const contextual = rows.filter((event) => event.location || event.people?.length).length;
    let score = 0;
    if (rows.length) score += 1;
    if (sourced) score += 1;
    if (rows.length && strong / rows.length >= 0.7) score += 1;
    if (rows.length && contextual / rows.length >= 0.7) score += 1;
    return { chapter, count: rows.length, sourced, strong, contextual, score };
  });
}

function rangeChanges(from, to) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  const chapters = [];
  for (let chapter = Math.max(341, start + 1); chapter <= end; chapter += 1) {
    try {
      const diff = getChapterWhatChanged(chapter);
      chapters.push(diff);
    } catch {
      chapters.push({ chapter, previousChapter: chapter - 1, summary: {}, records: [], eventIds: [], locationIds: [], abilityIds: [], organizationIds: [], storyThreadIds: [], openedMysteryCaseIds: [] });
    }
  }
  return chapters;
}

const markdownForSession = (session) => [
  `# ${session.name}`,
  '',
  `Status: **${session.status}**`,
  session.tags.length ? `Tags: ${session.tags.map((tag) => `\`${tag}\``).join(' ')}` : 'Tags: _none_',
  '',
  '## Working notes',
  '',
  session.note || '_No session note._',
  '',
  '## Pinned research',
  '',
  ...(session.pins.length ? session.pins.map((item, index) => `${index + 1}. **${item.label}** · ${item.kind}${item.chapter ? ` · Ch. ${item.chapter}` : ''}${item.context ? ` — ${item.context}` : ''}`) : ['_No pins._']),
  '',
  '## Hypotheses',
  '',
  ...(session.hypotheses.length ? session.hypotheses.flatMap((hypothesis) => [
    `### ${hypothesis.title}`,
    `Status: ${hypothesis.status}`,
    hypothesis.note || '_No note._',
    ...['support', 'against', 'unknown'].map((bucket) => `${bucket}: ${hypothesis.evidence.filter((item) => item.bucket === bucket).map((item) => item.label).join('; ') || 'none'}`),
  ]) : ['_No hypotheses._']),
  '',
  '## Custom questions',
  '',
  ...(session.questions.length ? session.questions.map((question) => `- [${question.status === 'resolved' ? 'x' : ' '}] ${question.question}${question.note ? ` — ${question.note}` : ''}`) : ['_No custom questions._']),
  '',
  '## Annotations',
  '',
  ...(session.annotations.length ? session.annotations.map((annotation) => `- **${annotation.targetLabel || annotation.targetKind}**: ${annotation.note}${annotation.tags.length ? ` (${annotation.tags.join(', ')})` : ''}`) : ['_No annotations._']),
  '',
  '## Research trail',
  '',
  ...(session.trail.length ? [...session.trail].reverse().map((entry) => `- ${entry.visitedAt} · ${entry.label}${entry.chapter ? ` · Ch. ${entry.chapter}` : ''}`) : ['_No trail entries._']),
  '',
  '_Local research material. Canonical archive records remain separate from personal notes and hypotheses._',
].join('\n');

const downloadText = (filename, content, type = 'text/plain;charset=utf-8') => {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
const fileStem = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'timeline-research';

export default function TimelineResearchWorkstation({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const [memory, setMemory] = useState(readTimelineResearchMemory);
  const [sessionName, setSessionName] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [annotationDraft, setAnnotationDraft] = useState('');
  const [annotationTags, setAnnotationTags] = useState('');
  const [hypothesisDraft, setHypothesisDraft] = useState('');
  const [questionDraft, setQuestionDraft] = useState('');
  const [filterName, setFilterName] = useState('');
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [traceQuery, setTraceQuery] = useState('');
  const [traceMode, setTraceMode] = useState('direct');
  const [diffFrom, setDiffFrom] = useState(Math.max(340, (Number(requestedState.chapter) || spoilerLimit) - 5));
  const [diffTo, setDiffTo] = useState(Number(requestedState.chapter) || spoilerLimit);
  const commandRef = useRef(null);

  const safeSpoilerLimit = Math.max(340, Math.min(999, Number(spoilerLimit) || 418));
  const events = useMemo(() => prepareEvents(safeSpoilerLimit), [safeSpoilerLimit]);
  const eventMap = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);
  const selectedEvent = eventMap.get(requestedState.event) || null;
  const selectedIndex = selectedEvent ? selectedEvent.archiveIndex : -1;
  const characters = useMemo(() => getCharactersWithStateProfiles(), []);
  const characterMap = useMemo(() => {
    const map = new Map();
    characters.forEach((character) => [character.name, ...(character.aliases || [])].forEach((name) => map.set(normalize(name), character)));
    return map;
  }, [characters]);
  const organizations = useMemo(() => getEntitiesByType('organization'), []);
  const orgMap = useMemo(() => new Map(organizations.flatMap((organization) => [organization.name, ...(organization.aliases || [])].map((name) => [normalize(name), organization]))), [organizations]);
  const activeSession = memory.sessions.find((session) => session.id === memory.activeSessionId) || null;
  const deskOpen = requestedState.desk === '1' || requestedState.desk === 'open';
  const activeTab = DESK_TABS.some(([id]) => id === requestedState.deskTab) ? requestedState.deskTab : 'session';

  useEffect(() => {
    const refresh = () => setMemory(readTimelineResearchMemory());
    window.addEventListener(TIMELINE_RESEARCH_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(TIMELINE_RESEARCH_MEMORY_EVENT, refresh);
  }, []);

  useEffect(() => setNoteDraft(activeSession?.note || ''), [activeSession?.id, activeSession?.note]);

  const navigatePatch = (patch = {}) => onNavigate?.({ ...requestedState, ...patch });
  const openDesk = (tab = activeTab) => navigatePatch({ desk: '1', deskTab: tab });
  const closeDesk = () => {
    const { desk: _desk, deskTab: _deskTab, ...preserved } = requestedState;
    onNavigate?.(preserved);
  };
  const ensureSession = () => {
    if (activeSession) return activeSession;
    const next = createTimelineResearchSession('Timeline research');
    return next.sessions.find((session) => session.id === next.activeSessionId) || null;
  };
  const pinItem = (item) => {
    const session = ensureSession();
    if (session && item) toggleTimelineResearchPin(session.id, item);
  };
  const inboxItem = (item) => {
    const session = ensureSession();
    if (session && item) addTimelineResearchInboxItem(session.id, item);
  };

  useEffect(() => {
    if (!activeSession) return;
    const event = selectedEvent;
    const label = event
      ? event.title
      : requestedState.search
        ? `Search: ${requestedState.search}`
        : `${labelize(requestedState.mode || 'archive')} timeline${requestedState.chapter ? ` · Ch. ${requestedState.chapter}` : ''}`;
    recordTimelineResearchTrail(activeSession.id, {
      label,
      kind: event ? 'event' : requestedState.search ? 'search' : 'context',
      eventId: event?.id || null,
      chapter: event?.chapter || Number(requestedState.chapter) || null,
      params: {
        mode: requestedState.mode || 'archive',
        ...(event ? { event: event.id, chapter: event.chapter } : {}),
        ...(requestedState.search ? { search: requestedState.search } : {}),
        ...(requestedState.from ? { from: requestedState.from } : {}),
        ...(requestedState.to ? { to: requestedState.to } : {}),
      },
    });
  }, [activeSession?.id, requestedState.chapter, requestedState.event, requestedState.from, requestedState.mode, requestedState.search, requestedState.to, selectedEvent?.id]);

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
        window.setTimeout(() => commandRef.current?.focus(), 0);
        return;
      }
      if (typing) return;
      if (event.key === 'Escape') {
        if (commandOpen) setCommandOpen(false);
        else if (deskOpen) closeDesk();
        return;
      }
      if (event.key.toLowerCase() === 'j' && selectedIndex >= 0 && events[selectedIndex + 1]) navigatePatch({ event: events[selectedIndex + 1].id, chapter: events[selectedIndex + 1].chapter });
      if (event.key.toLowerCase() === 'k' && selectedIndex > 0) navigatePatch({ event: events[selectedIndex - 1].id, chapter: events[selectedIndex - 1].chapter });
      if (event.key.toLowerCase() === 'e') openDesk('evidence');
      if (event.key.toLowerCase() === 'd' && selectedEvent) navigatePatch({ focus: 'dossier', event: selectedEvent.id, chapter: selectedEvent.chapter });
      if (event.key.toLowerCase() === 'p' && selectedEvent) pinItem(eventItem(selectedEvent));
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setCommandOpen(true);
        window.setTimeout(() => commandRef.current?.focus(), 0);
      }
      if (event.key.toLowerCase() === 't') {
        setTraceQuery(selectedEvent?.people?.[0] || requestedState.search || '');
        openDesk('evidence');
      }
      if (event.key === '[') navigatePatch({ chapter: chapterClamp((Number(requestedState.chapter) || safeSpoilerLimit) - 1, safeSpoilerLimit) });
      if (event.key === ']') navigatePatch({ chapter: chapterClamp((Number(requestedState.chapter) || safeSpoilerLimit) + 1, safeSpoilerLimit) });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commandOpen, deskOpen, events, requestedState, safeSpoilerLimit, selectedEvent, selectedIndex]);

  const conflicts = useMemo(() => potentialConflicts(selectedEvent, events), [events, selectedEvent]);
  const coverage = useMemo(() => coverageRows(events, safeSpoilerLimit), [events, safeSpoilerLimit]);
  const changes = useMemo(() => rangeChanges(chapterClamp(diffFrom, safeSpoilerLimit), chapterClamp(diffTo, safeSpoilerLimit)), [diffFrom, diffTo, safeSpoilerLimit]);
  const changeTotals = useMemo(() => changes.reduce((totals, change) => ({
    records: totals.records + (change.records?.length || 0),
    events: totals.events + (change.eventIds?.length || 0),
    locations: totals.locations + (change.locationIds?.length || 0),
    abilities: totals.abilities + (change.abilityIds?.length || 0),
    organizations: totals.organizations + (change.organizationIds?.length || 0),
    threads: totals.threads + (change.storyThreadIds?.length || 0),
    mysteries: totals.mysteries + (change.openedMysteryCaseIds?.length || 0),
  }), { records: 0, events: 0, locations: 0, abilities: 0, organizations: 0, threads: 0, mysteries: 0 }), [changes]);

  const traceEvents = useMemo(() => {
    const needle = normalize(traceQuery);
    if (!needle) return [];
    return events.filter((event) => {
      if (traceMode === 'location') return normalize(event.location).includes(needle);
      if (traceMode === 'consequence') return normalize(`${event.causality?.cause || ''} ${event.causality?.consequence || ''} ${event.causality?.leadsTo || ''}`).includes(needle);
      if (traceMode === 'direct') return normalize(`${event.title} ${event.detail} ${(event.people || []).join(' ')}`).includes(needle);
      return event.searchText.includes(needle);
    }).slice(0, 80);
  }, [events, traceMode, traceQuery]);

  const commandPreview = useMemo(() => commandIntent(commandText, safeSpoilerLimit), [commandText, safeSpoilerLimit]);

  const compareKeysForTerms = (terms) => terms.flatMap((term) => {
    const normalized = normalize(term);
    const character = characterMap.get(normalized) || characters.find((candidate) => normalize(candidate.name).includes(normalized));
    if (character) return [`character@${character.id}`];
    const organization = orgMap.get(normalized) || organizations.find((candidate) => normalize(candidate.name).includes(normalized));
    if (organization) return [`organization@${organization.id}`];
    const track = timelineTracks.find((candidate) => normalize(candidate.label).includes(normalized) || normalize(candidate.id) === normalized);
    if (track) return [`thread@${track.id}`];
    const location = events.find((candidate) => normalize(candidate.location).includes(normalized))?.location;
    return location ? [`location@${location}`] : [];
  }).slice(0, 6);

  const executeCommand = () => {
    const intent = commandIntent(commandText, safeSpoilerLimit);
    if (intent.kind === 'diff') {
      setDiffFrom(intent.from);
      setDiffTo(intent.to);
      openDesk('diff');
    } else if (intent.kind === 'questions') {
      navigatePatch({ desk: '1', deskTab: 'theory', questionState: 'open' });
    } else if (intent.kind === 'trace') {
      setTraceQuery(intent.query);
      openDesk('evidence');
    } else if (intent.kind === 'compare') {
      const keys = compareKeysForTerms(intent.terms);
      if (keys.length) navigatePatch({ mode: 'compare', compare: keys.join('|'), desk: '1', deskTab: 'session' });
    } else if (intent.kind === 'location') {
      navigatePatch({ mode: 'space', spaceLocation: intent.query, search: intent.query });
    } else if (intent.kind === 'desk') {
      openDesk('session');
    } else {
      const parsed = intent.query;
      const patch = {
        ...(parsed.search ? { search: parsed.search } : {}),
        ...(parsed.from !== null ? { from: parsed.from } : {}),
        ...(parsed.to !== null ? { to: parsed.to } : {}),
        ...(parsed.chapter !== null ? { chapter: parsed.chapter } : {}),
        ...(parsed.thread ? { thread: timelineTracks.find((track) => normalize(track.id) === normalize(parsed.thread) || normalize(track.label) === normalize(parsed.thread))?.id || parsed.thread } : {}),
        ...(parsed.mode ? { mode: parsed.mode } : {}),
        ...(normalize(parsed.importance) === 'major' ? { major: '1' } : {}),
        ...(parsed.evidence ? { evidence: parsed.evidence } : {}),
      };
      navigatePatch(patch);
    }
    setCommandOpen(false);
    setCommandText('');
  };

  const latestTrail = activeSession?.trail.slice(0, 6) || [];
  const selectedVisual = selectedEvent ? mediaForTimelinePhase(selectedEvent.phase, selectedEvent.chapter) : null;
  const previousEvent = selectedIndex > 0 ? events[selectedIndex - 1] : null;
  const nextEvent = selectedIndex >= 0 ? events[selectedIndex + 1] || null : null;
  const currentItem = eventItem(selectedEvent);
  const selectedPinned = Boolean(currentItem && activeSession?.pins.some((item) => item.eventId === selectedEvent.id));

  const saveCurrentFilter = () => {
    const session = ensureSession();
    const name = filterName.trim() || `Timeline view ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (!session) return;
    const keys = ['mode', 'density', 'search', 'phase', 'thread', 'from', 'to', 'chapter', 'major', 'character', 'location', 'compare'];
    saveTimelineResearchFilter(session.id, name, Object.fromEntries(keys.flatMap((key) => requestedState[key] ? [[key, requestedState[key]]] : [])));
    setFilterName('');
  };

  const addAnnotation = () => {
    const session = ensureSession();
    if (!session || !annotationDraft.trim()) return;
    addTimelineResearchAnnotation(session.id, {
      targetId: selectedEvent?.id || null,
      targetKind: selectedEvent ? 'event' : 'session',
      targetLabel: selectedEvent?.title || session.name,
      note: annotationDraft,
      tags: annotationTags,
    });
    setAnnotationDraft('');
    setAnnotationTags('');
  };

  const createSession = (event) => {
    event.preventDefault();
    if (!sessionName.trim()) return;
    createTimelineResearchSession(sessionName);
    setSessionName('');
  };

  const openTrailEntry = (entry) => navigatePatch({ ...entry.params, ...(entry.eventId ? { event: entry.eventId } : {}), desk: '1', deskTab: 'trail' });

  const pinComparisonKeys = (activeSession?.pins || []).map((item) => item.params?.compareKey).filter(Boolean).slice(0, 6);

  return (
    <>
      <section className="timeline-research-dock" aria-label="Timeline research workstation controls">
        <div className="timeline-research-dock__identity">
          <BrainCircuit size={15} aria-hidden="true" />
          <span>RESEARCH WORKSTATION</span>
          {activeSession ? <select value={activeSession.id} aria-label="Active research session" onChange={(event) => setActiveTimelineResearchSession(event.target.value)}>{memory.sessions.map((session) => <option value={session.id} key={session.id}>{session.name}</option>)}</select> : <strong>No session</strong>}
        </div>
        <div className="timeline-research-dock__trail" aria-label="Recent research breadcrumbs">
          {latestTrail.slice(0, 4).map((entry) => <button type="button" onClick={() => openTrailEntry(entry)} key={entry.id} title={entry.label}><span>{entry.kind}</span><strong>{entry.label}</strong></button>)}
        </div>
        <div className="timeline-research-dock__actions">
          <button type="button" onClick={() => openDesk('session')} aria-pressed={deskOpen}><PanelTopOpen size={14} /> Research desk {activeSession ? <small>{activeSession.pins.length} pins · {activeSession.inbox.length} inbox</small> : null}</button>
          <button type="button" onClick={() => { setCommandOpen(true); window.setTimeout(() => commandRef.current?.focus(), 0); }}><Command size={14} /> Command <kbd>⌘K</kbd></button>
        </div>
      </section>

      {deskOpen && <section className="timeline-research-workstation" aria-labelledby="timeline-research-workstation-title">
        <header className="trw-head">
          <div><span>LOCAL RESEARCH LAYER</span><h2 id="timeline-research-workstation-title">Investigate without losing the chronology.</h2><p>Sessions, evidence, hypotheses, annotations, trails, saved views and inbox items are personal research state. Canonical event data stays untouched underneath.</p></div>
          <button type="button" onClick={closeDesk} aria-label="Close research workstation"><X size={18} /></button>
        </header>

        <nav className="trw-tabs" aria-label="Research workstation sections">
          {DESK_TABS.map(([id, label]) => <button type="button" key={id} className={activeTab === id ? 'is-active' : ''} aria-pressed={activeTab === id} onClick={() => navigatePatch({ desk: '1', deskTab: id })}>{label}</button>)}
        </nav>

        {!activeSession && <section className="trw-empty-session">
          <BrainCircuit size={26} />
          <h3>Start a research session</h3>
          <p>A session keeps your pins, notes, questions, hypotheses, filters, inbox and investigation trail together.</p>
          <form onSubmit={createSession}><input value={sessionName} onChange={(event) => setSessionName(event.target.value)} placeholder="e.g. Halkenburg possession investigation" /><button type="submit"><Plus size={14} /> Create session</button></form>
        </section>}

        {activeSession && activeTab === 'session' && <div className="trw-multipane trw-session-grid">
          <section className="trw-pane">
            <header><Pin size={14} /><div><span>PINNED RESEARCH</span><h3>Hold context while you roam</h3></div></header>
            {selectedEvent && <div className="trw-current-actions"><button type="button" className={selectedPinned ? 'is-active' : ''} onClick={() => pinItem(currentItem)}><Pin size={12} /> {selectedPinned ? 'Unpin current event' : 'Pin current event'}</button><button type="button" onClick={() => inboxItem(currentItem)}><Inbox size={12} /> Send to inbox</button></div>}
            <div className="trw-pin-table" role="table" aria-label="Pinned research table">
              <div role="row" className="trw-pin-table__head"><span>Type</span><span>Record</span><span>Context</span><span /></div>
              {activeSession.pins.map((item) => <div role="row" key={`${item.kind}:${item.id}`}><span>{labelize(item.kind)}</span><button type="button" onClick={() => item.eventId ? navigatePatch({ event: item.eventId, chapter: item.chapter }) : item.kind === 'location' ? navigatePatch({ mode: 'space', spaceLocation: item.label }) : navigatePatch({ search: item.label })}><strong>{item.label}</strong>{item.chapter && <small>Ch. {item.chapter}</small>}</button><span>{item.context || item.location || 'Pinned context'}</span><button type="button" aria-label={`Remove ${item.label} pin`} onClick={() => pinItem(item)}><X size={12} /></button></div>)}
            </div>
            {!activeSession.pins.length && <p className="trw-empty">Select an event, then pin the event, people, location or story thread from the Evidence tab.</p>}
            {!!pinComparisonKeys.length && <button type="button" className="trw-primary-action" onClick={() => navigatePatch({ mode: 'compare', compare: pinComparisonKeys.join('|') })}><GitCompareArrows size={13} /> Compare compatible pins</button>}
          </section>

          <section className="trw-pane">
            <header><MessageSquareText size={14} /><div><span>WORKING NOTEBOOK</span><h3>{activeSession.name}</h3></div></header>
            <label className="trw-field"><span>Session status</span><select value={activeSession.status} onChange={(event) => updateTimelineResearchSession(activeSession.id, { status: event.target.value })}><option value="active">Active</option><option value="paused">Paused</option><option value="complete">Complete</option></select></label>
            <label className="trw-field"><span>Tags</span><input value={activeSession.tags.join(', ')} onChange={(event) => updateTimelineResearchSession(activeSession.id, { tags: event.target.value })} placeholder="nen, theory, revisit" /></label>
            <label className="trw-field trw-note-field"><span>Working thesis / notes</span><textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Keep the question, interpretation, and things to verify here…" /></label>
            <button type="button" onClick={() => updateTimelineResearchSession(activeSession.id, { note: noteDraft })}><Save size={13} /> Save session note</button>
            <div className="trw-session-admin"><form onSubmit={createSession}><input value={sessionName} onChange={(event) => setSessionName(event.target.value)} placeholder="New session name" /><button type="submit"><Plus size={12} /> New</button></form>{memory.sessions.length > 1 && <button type="button" className="is-danger" onClick={() => deleteTimelineResearchSession(activeSession.id)}><Trash2 size={12} /> Delete this session</button>}</div>
          </section>

          <section className="trw-pane">
            <header><Inbox size={14} /><div><span>RESEARCH INBOX</span><h3>Capture now, process later</h3></div></header>
            <ol className="trw-list">{activeSession.inbox.map((item) => <li key={`${item.kind}:${item.id}`}><button type="button" onClick={() => item.eventId ? navigatePatch({ event: item.eventId, chapter: item.chapter }) : navigatePatch({ search: item.label })}><small>{labelize(item.kind)}{item.chapter ? ` · Ch. ${item.chapter}` : ''}</small><strong>{item.label}</strong></button><div><button type="button" title="Pin and remove from inbox" onClick={() => { pinItem(item); removeTimelineResearchInboxItem(activeSession.id, item); }}><Pin size={12} /></button><button type="button" title="Remove from inbox" onClick={() => removeTimelineResearchInboxItem(activeSession.id, item)}><X size={12} /></button></div></li>)}</ol>
            {!activeSession.inbox.length && <p className="trw-empty">The inbox is empty. Send discoveries here without breaking your current line of investigation.</p>}
            <header className="trw-subhead"><History size={13} /><div><span>BREADCRUMBS</span><h3>How you got here</h3></div></header>
            <ol className="trw-breadcrumbs">{latestTrail.map((entry) => <li key={entry.id}><button type="button" onClick={() => openTrailEntry(entry)}><small>{entry.kind}{entry.chapter ? ` · Ch. ${entry.chapter}` : ''}</small><strong>{entry.label}</strong></button></li>)}</ol>
          </section>
        </div>}

        {activeSession && activeTab === 'evidence' && <div className="trw-multipane trw-evidence-grid">
          <section className="trw-pane">
            <header><BookOpen size={14} /><div><span>EVIDENCE-FIRST INSPECTOR</span><h3>{selectedEvent?.title || 'Select a timeline event'}</h3></div></header>
            {selectedEvent ? <>
              <dl className="trw-facts"><div><dt>Chapter</dt><dd>{selectedEvent.chapter}</dd></div><div><dt>Evidence</dt><dd>{selectedEvent.evidence}</dd></div><div><dt>Timing</dt><dd>{selectedEvent.timing}</dd></div><div><dt>Importance</dt><dd>{labelize(selectedEvent.importance)}</dd></div></dl>
              <p className="trw-event-detail">{selectedEvent.detail}</p>
              <div className="trw-current-actions"><button type="button" onClick={() => pinItem(currentItem)}><Pin size={12} /> Pin event</button><button type="button" onClick={() => inboxItem(currentItem)}><Inbox size={12} /> Inbox</button><button type="button" onClick={() => navigatePatch({ focus: 'dossier', event: selectedEvent.id, chapter: selectedEvent.chapter })}><Archive size={12} /> Full dossier</button></div>
              {!!selectedEvent.people.length && <div className="trw-chip-group"><span>People</span>{selectedEvent.people.map((person) => <button type="button" onClick={() => pinItem(personItem(person, selectedEvent, characterMap))} key={person}><Users size={10} /> {person} <Plus size={9} /></button>)}</div>}
              {selectedEvent.location && <div className="trw-chip-group"><span>Location</span><button type="button" onClick={() => pinItem(locationItem(selectedEvent.location, selectedEvent))}><MapPin size={10} /> {selectedEvent.location} <Plus size={9} /></button></div>}
              {!!selectedEvent.tracks?.length && <div className="trw-chip-group"><span>Threads</span>{selectedEvent.tracks.map((track) => <button type="button" onClick={() => pinItem(threadItem(track, selectedEvent))} key={track}><Layers3 size={10} /> {timelineTracks.find((item) => item.id === track)?.label || track} <Plus size={9} /></button>)}</div>}
              <nav className="trw-adjacency" aria-label="Event adjacency shortcuts"><button type="button" disabled={!previousEvent} onClick={() => previousEvent && navigatePatch({ event: previousEvent.id, chapter: previousEvent.chapter })}><ArrowLeft size={12} /> Previous</button><button type="button" disabled={!nextEvent} onClick={() => nextEvent && navigatePatch({ event: nextEvent.id, chapter: nextEvent.chapter })}>Next <ArrowRight size={12} /></button></nav>
              {selectedEvent.causality && <div className="trw-causality"><div><span>↑ Cause / setup</span><p>{selectedEvent.causality.cause}</p></div><div><span>↓ Immediate consequence</span><p>{selectedEvent.causality.consequence}</p></div><div><span>→ Carried forward</span><p>{selectedEvent.causality.leadsTo}</p></div></div>}
            </> : <p className="trw-empty">Pick any chronology record. The research desk will stay open while the selected event changes underneath it.</p>}
          </section>

          <section className="trw-pane">
            <header><CircleAlert size={14} /><div><span>DISCREPANCY CHECK</span><h3>Records worth comparing</h3></div></header>
            <p className="trw-caption">This is a review detector, not an error oracle. It flags nearby records with shared participants, location tension, or uncertainty so you can inspect the source chronology yourself.</p>
            <ol className="trw-conflicts">{conflicts.map((conflict) => <li className={`is-${conflict.severity}`} key={conflict.event.id}><button type="button" onClick={() => navigatePatch({ event: conflict.event.id, chapter: conflict.event.chapter })}><small>{conflict.severity} review · Ch. {conflict.event.chapter}</small><strong>{conflict.event.title}</strong><span>{conflict.reason}</span><em>Shared: {conflict.shared.join(', ')}</em></button></li>)}</ol>
            {!conflicts.length && selectedEvent && <p className="trw-empty">No nearby participant/location tension crossed the review threshold for this event.</p>}
            <header className="trw-subhead"><Radar size={13} /><div><span>TRACE MODE</span><h3>Follow one thread through the record</h3></div></header>
            <div className="trw-trace-controls"><input value={traceQuery} onChange={(event) => setTraceQuery(event.target.value)} placeholder="Fugetsu, Silent Majority, Room 1014…" /><select value={traceMode} onChange={(event) => setTraceMode(event.target.value)}><option value="direct">Direct involvement</option><option value="indirect">All connected text</option><option value="location">Location trail</option><option value="consequence">Cause / consequence</option></select><button type="button" onClick={() => traceQuery.trim() && navigatePatch({ mode: 'archive', search: traceQuery.trim(), desk: '1', deskTab: 'evidence' })}>Apply to timeline</button></div>
            <ol className="trw-trace-results">{traceEvents.slice(0, 14).map((event) => <li key={event.id}><button type="button" onClick={() => navigatePatch({ event: event.id, chapter: event.chapter })}><small>Ch. {event.chapter}{event.location ? ` · ${event.location}` : ''}</small><strong>{event.title}</strong></button></li>)}</ol>
            {traceQuery && <small className="trw-result-count">{traceEvents.length} trace matches in the working cap</small>}
          </section>

          <section className="trw-pane">
            <header><Link2 size={14} /><div><span>SYNCHRONIZED SOURCE</span><h3>Keep evidence beside the event</h3></div></header>
            {selectedEvent ? <>
              {selectedVisual && <figure className="trw-source-visual"><SafeImage src={selectedVisual.src} alt={`Chapter ${selectedVisual.chapter} visual context for ${selectedEvent.title}`} style={{ objectPosition: selectedVisual.position }} /><figcaption>Curated phase landmark · Ch. {selectedVisual.chapter}</figcaption></figure>}
              <div className="trw-source-card"><span>Primary chronology anchor</span><strong>Chapter {selectedEvent.chapter}</strong><p>{selectedEvent.source ? 'A maintained source note is linked to this event.' : 'No external source URL is attached to this event record; use the chapter anchor and evidence state.'}</p>{selectedEvent.source && <a href={selectedEvent.source} target="_blank" rel="noreferrer"><BookOpen size={12} /> Open source note</a>}</div>
              <label className="trw-field trw-note-field"><span>Annotation for this event</span><textarea value={annotationDraft} onChange={(event) => setAnnotationDraft(event.target.value)} placeholder="What do you notice? What needs checking?" /></label><label className="trw-field"><span>Tags</span><input value={annotationTags} onChange={(event) => setAnnotationTags(event.target.value)} placeholder="conflict, recheck, theory" /></label><button type="button" disabled={!annotationDraft.trim()} onClick={addAnnotation}><MessageSquareText size={12} /> Save annotation</button>
            </> : <p className="trw-empty">Select an event to synchronize chapter, source state, visual context and annotations.</p>}
          </section>
        </div>}

        {activeSession && activeTab === 'diff' && <section className="trw-diff">
          <header className="trw-section-head"><FileDiff size={16} /><div><span>CHAPTER RANGE DIFF</span><h3>What changed between any two chapters?</h3><p>Aggregate the archive's maintained chapter-state deltas instead of manually rereading hundreds of chronology rows.</p></div></header>
          <div className="trw-range-controls"><label><span>From</span><input type="number" min="340" max={safeSpoilerLimit} value={diffFrom} onChange={(event) => setDiffFrom(chapterClamp(event.target.value, safeSpoilerLimit))} /></label><span>→</span><label><span>To</span><input type="number" min="340" max={safeSpoilerLimit} value={diffTo} onChange={(event) => setDiffTo(chapterClamp(event.target.value, safeSpoilerLimit))} /></label><button type="button" onClick={() => navigatePatch({ from: Math.min(diffFrom, diffTo), to: Math.max(diffFrom, diffTo), chapter: Math.max(diffFrom, diffTo) })}>Show this range on timeline</button></div>
          <div className="trw-diff-summary">{Object.entries(changeTotals).map(([key, value]) => <div key={key}><span>{labelize(key)}</span><strong>{formatCount(value)}</strong></div>)}</div>
          <div className="trw-diff-chapters">{changes.map((change) => <article key={change.chapter}><header><span>Ch. {change.previousChapter} → {change.chapter}</span><strong>{change.summary?.changed ?? change.records?.length ?? 0} state changes</strong></header><dl><div><dt>Events</dt><dd>{change.eventIds?.length || 0}</dd></div><div><dt>Locations</dt><dd>{change.locationIds?.length || 0}</dd></div><div><dt>Nen</dt><dd>{change.abilityIds?.length || 0}</dd></div><div><dt>Factions</dt><dd>{change.organizationIds?.length || 0}</dd></div><div><dt>Threads</dt><dd>{change.storyThreadIds?.length || 0}</dd></div><div><dt>Questions opened</dt><dd>{change.openedMysteryCaseIds?.length || 0}</dd></div></dl><button type="button" onClick={() => navigatePatch({ mode: 'archive', from: change.chapter, to: change.chapter, chapter: change.chapter })}>Inspect chapter <ChevronRight size={11} /></button></article>)}</div>
        </section>}

        {activeSession && activeTab === 'theory' && <div className="trw-theory-grid">
          <section className="trw-pane">
            <header><Sparkles size={14} /><div><span>HYPOTHESIS TRACKER</span><h3>Separate interpretation from canon</h3></div></header>
            <form className="trw-inline-form" onSubmit={(event) => { event.preventDefault(); if (!hypothesisDraft.trim()) return; addTimelineResearchHypothesis(activeSession.id, hypothesisDraft); setHypothesisDraft(''); }}><input value={hypothesisDraft} onChange={(event) => setHypothesisDraft(event.target.value)} placeholder="Hypothesis: …" /><button type="submit"><Plus size={12} /> Add</button></form>
            <div className="trw-hypotheses">{activeSession.hypotheses.map((hypothesis) => <article key={hypothesis.id}><header><div><small>{hypothesis.status}</small><strong>{hypothesis.title}</strong></div><select value={hypothesis.status} onChange={(event) => updateTimelineResearchHypothesis(activeSession.id, hypothesis.id, { status: event.target.value })}><option value="active">Active</option><option value="supported">Supported</option><option value="weakened">Weakened</option><option value="resolved">Resolved</option></select></header><textarea value={hypothesis.note} onChange={(event) => updateTimelineResearchHypothesis(activeSession.id, hypothesis.id, { note: event.target.value })} placeholder="Reasoning / boundaries…" />{selectedEvent && <div className="trw-evidence-buckets">{['support', 'against', 'unknown'].map((bucket) => <button type="button" key={bucket} onClick={() => addTimelineResearchHypothesisEvidence(activeSession.id, hypothesis.id, currentItem, bucket)}><Plus size={10} /> {labelize(bucket)} current event</button>)}</div>}<dl>{['support', 'against', 'unknown'].map((bucket) => <div key={bucket}><dt>{labelize(bucket)}</dt><dd>{hypothesis.evidence.filter((item) => item.bucket === bucket).length}</dd></div>)}</dl></article>)}</div>
          </section>

          <section className="trw-pane">
            <header><ShieldQuestion size={14} /><div><span>QUESTION LEDGER</span><h3>Canon questions + your own</h3></div></header>
            <form className="trw-inline-form" onSubmit={(event) => { event.preventDefault(); if (!questionDraft.trim()) return; addTimelineResearchQuestion(activeSession.id, questionDraft); setQuestionDraft(''); }}><input value={questionDraft} onChange={(event) => setQuestionDraft(event.target.value)} placeholder="Question to investigate…" /><button type="submit"><Plus size={12} /> Add</button></form>
            <div className="trw-question-columns"><section><h4>Canonical open · {timelineQuestionLedger.open.length}</h4>{timelineQuestionLedger.open.slice(0, 18).map((question, index) => <article key={`${question.chapter}:${index}`}><small>Ch. {question.chapter}</small><strong>{question.question}</strong><p>{question.evidence}</p>{question.source && <a href={question.source} target="_blank" rel="noreferrer">Source</a>}</article>)}</section><section><h4>Canonical resolved · {timelineQuestionLedger.resolved.length}</h4>{timelineQuestionLedger.resolved.slice(0, 12).map((question, index) => <article key={`${question.chapter}:${index}`}><small>Ch. {question.chapter}</small><strong>{question.question}</strong><p>{question.answer}</p></article>)}</section></div>
            <header className="trw-subhead"><ClipboardList size={13} /><div><span>YOUR QUESTIONS</span><h3>{activeSession.questions.length} tracked</h3></div></header>
            <ol className="trw-custom-questions">{activeSession.questions.map((question) => <li key={question.id}><button type="button" className={question.status === 'resolved' ? 'is-resolved' : ''} onClick={() => updateTimelineResearchQuestion(activeSession.id, question.id, { status: question.status === 'resolved' ? 'open' : 'resolved' })}>{question.status === 'resolved' ? <Check size={12} /> : <ShieldQuestion size={12} />}<span><small>{question.status}</small><strong>{question.question}</strong></span></button></li>)}</ol>
          </section>
        </div>}

        {activeSession && activeTab === 'coverage' && <div className="trw-coverage-grid">
          <section className="trw-pane trw-coverage-pane">
            <header><Boxes size={14} /><div><span>SOURCE COVERAGE HEATMAP</span><h3>Where the chronology is strong, sparse, or uncertain</h3></div></header>
            <div className="trw-coverage-legend"><span>0 no events</span><span>1 event only</span><span>2 source coverage</span><span>3 evidence strength</span><span>4 contextual coverage</span></div>
            <div className="trw-coverage-map">{coverage.map((row) => <button type="button" className={`coverage-${row.score}`} title={`Ch. ${row.chapter}: ${row.count} events · ${row.sourced} sourced · ${row.strong} stronger-evidence · ${row.contextual} contextualized`} aria-label={`Chapter ${row.chapter}, coverage score ${row.score} of 4`} key={row.chapter} onClick={() => navigatePatch({ mode: 'archive', chapter: row.chapter, from: row.chapter, to: row.chapter })}><span>{row.chapter}</span><strong>{row.count}</strong></button>)}</div>
          </section>
          <section className="trw-pane">
            <header><Filter size={14} /><div><span>SAVED FILTERS</span><h3>Return to exact research views</h3></div></header>
            <div className="trw-save-filter"><input value={filterName} onChange={(event) => setFilterName(event.target.value)} placeholder="Name this view…" /><button type="button" onClick={saveCurrentFilter}><Save size={12} /> Save current state</button></div>
            <ol className="trw-list">{activeSession.savedFilters.map((filter) => <li key={filter.id}><button type="button" onClick={() => navigatePatch({ ...filter.params, desk: '1', deskTab: 'coverage' })}><small>Saved view</small><strong>{filter.name}</strong></button><button type="button" onClick={() => deleteTimelineResearchFilter(activeSession.id, filter.id)} aria-label={`Delete ${filter.name}`}><Trash2 size={12} /></button></li>)}</ol>
            <header className="trw-subhead"><Keyboard size={13} /><div><span>KEYBOARD RESEARCH</span><h3>Move without touching the mouse</h3></div></header>
            <dl className="trw-shortcuts"><div><dt>⌘/Ctrl K</dt><dd>Command palette</dd></div><div><dt>J / K</dt><dd>Next / previous event</dd></div><div><dt>E</dt><dd>Evidence desk</dd></div><div><dt>D</dt><dd>Full dossier</dd></div><div><dt>P</dt><dd>Pin event</dd></div><div><dt>F</dt><dd>Find / command</dd></div><div><dt>T</dt><dd>Trace current subject</dd></div><div><dt>[ / ]</dt><dd>Previous / next chapter</dd></div><div><dt>Esc</dt><dd>Close current research layer</dd></div></dl>
          </section>
        </div>}

        {activeSession && activeTab === 'trail' && <div className="trw-trail-grid">
          <section className="trw-pane">
            <header><History size={14} /><div><span>RESEARCH TRAIL</span><h3>Reconstruct how you reached a conclusion</h3></div></header>
            <div className="trw-current-actions"><button type="button" onClick={() => clearTimelineResearchTrail(activeSession.id)}><Trash2 size={12} /> Clear trail</button></div>
            <ol className="trw-full-trail">{activeSession.trail.map((entry) => <li key={entry.id}><time>{new Date(entry.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time><button type="button" onClick={() => openTrailEntry(entry)}><small>{entry.kind}{entry.chapter ? ` · Ch. ${entry.chapter}` : ''}</small><strong>{entry.label}</strong></button></li>)}</ol>
          </section>
          <section className="trw-pane">
            <header><MessageSquareText size={14} /><div><span>ANNOTATIONS</span><h3>Your notes remain visibly non-canonical</h3></div></header>
            <ol className="trw-annotations">{activeSession.annotations.map((annotation) => <li key={annotation.id}><div><small>{annotation.targetKind}</small><strong>{annotation.targetLabel || annotation.targetId || 'Session'}</strong><p>{annotation.note}</p>{annotation.tags.length > 0 && <span>{annotation.tags.map((tag) => <i key={tag}>#{tag}</i>)}</span>}</div><button type="button" aria-label="Delete annotation" onClick={() => deleteTimelineResearchAnnotation(activeSession.id, annotation.id)}><Trash2 size={12} /></button></li>)}</ol>
            {!activeSession.annotations.length && <p className="trw-empty">Annotations you save from Evidence appear here.</p>}
          </section>
          <section className="trw-pane">
            <header><FileDown size={14} /><div><span>EXPORT RESEARCH BUNDLE</span><h3>Take the session with you</h3></div></header>
            <p>Export personal research state separately from canonical archive data. Markdown is readable; JSON preserves the structured session for later tooling.</p>
            <div className="trw-export-actions"><button type="button" onClick={() => downloadText(`${fileStem(activeSession.name)}.md`, markdownForSession(activeSession), 'text/markdown;charset=utf-8')}><ArrowDownToLine size={13} /> Markdown</button><button type="button" onClick={() => downloadText(`${fileStem(activeSession.name)}.json`, JSON.stringify(activeSession, null, 2), 'application/json;charset=utf-8')}><ArrowDownToLine size={13} /> JSON</button></div>
            <dl className="trw-export-stats"><div><dt>Pins</dt><dd>{activeSession.pins.length}</dd></div><div><dt>Inbox</dt><dd>{activeSession.inbox.length}</dd></div><div><dt>Hypotheses</dt><dd>{activeSession.hypotheses.length}</dd></div><div><dt>Questions</dt><dd>{activeSession.questions.length}</dd></div><div><dt>Annotations</dt><dd>{activeSession.annotations.length}</dd></div><div><dt>Trail</dt><dd>{activeSession.trail.length}</dd></div></dl>
          </section>
        </div>}
      </section>}

      {commandOpen && <div className="timeline-command-palette" role="dialog" aria-modal="true" aria-label="Timeline research command palette" onMouseDown={(event) => { if (event.target === event.currentTarget) setCommandOpen(false); }}>
        <section>
          <header><Command size={17} /><div><span>COMMAND / STRUCTURED SEARCH</span><strong>Jump, filter, compare, trace, or open research tools.</strong></div><button type="button" onClick={() => setCommandOpen(false)} aria-label="Close command palette"><X size={16} /></button></header>
          <label><Search size={16} /><input ref={commandRef} value={commandText} onChange={(event) => setCommandText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') executeCommand(); }} placeholder='Try: person:Kurapika chapter:370-390 · compare Kurapika and Benjamin · what changed 390 405' /></label>
          <div className="timeline-command-palette__preview"><small>Interpreted as</small><strong>{commandPreview.kind === 'query' ? 'Structured timeline query' : labelize(commandPreview.kind)}</strong>{commandPreview.kind === 'query' && <span>{Object.entries(commandPreview.query.tokens).map(([key, value]) => `${key}:${value}`).join(' · ') || commandPreview.query.search || 'Search all timeline fields'}</span>}</div>
          <div className="timeline-command-palette__examples"><button type="button" onClick={() => setCommandText('person:Kurapika chapter:370-390')}>person:Kurapika chapter:370-390</button><button type="button" onClick={() => setCommandText('compare Kurapika and Benjamin')}>compare Kurapika and Benjamin</button><button type="button" onClick={() => setCommandText('what changed 390 405')}>what changed 390 405</button><button type="button" onClick={() => setCommandText('trace Silent Majority')}>trace Silent Majority</button><button type="button" onClick={() => setCommandText('unresolved questions')}>unresolved questions</button></div>
          <footer><span><kbd>Enter</kbd> run</span><span><kbd>Esc</kbd> close</span><button type="button" disabled={!commandText.trim()} onClick={executeCommand}>Run command <ArrowRight size={12} /></button></footer>
        </section>
      </div>}
    </>
  );
}
