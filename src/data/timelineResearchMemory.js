import { readStoredJson, removeStoredValue, writeStoredJson } from '../lib/browserStorage.js';

export const TIMELINE_RESEARCH_MEMORY_KEY = 'hxh-timeline-research-workstation-v1';
export const TIMELINE_RESEARCH_MEMORY_EVENT = 'hxh-timeline-research-workstation';
export const TIMELINE_RESEARCH_SESSION_LIMIT = 24;
export const TIMELINE_RESEARCH_PIN_LIMIT = 80;
export const TIMELINE_RESEARCH_TRAIL_LIMIT = 160;
export const TIMELINE_RESEARCH_INBOX_LIMIT = 100;
export const TIMELINE_RESEARCH_ANNOTATION_LIMIT = 200;
export const TIMELINE_RESEARCH_HYPOTHESIS_LIMIT = 60;
export const TIMELINE_RESEARCH_QUESTION_LIMIT = 100;
export const TIMELINE_RESEARCH_FILTER_LIMIT = 40;

const text = (value, limit = 300) => String(value ?? '').trim().slice(0, limit);
const iso = (value = new Date()) => new Date(value).toISOString();
const idPart = (value) => text(value, 80).toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'research';
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const nowId = (prefix, label, now = new Date()) => `${prefix}:${idPart(label)}:${Date.parse(now)}`;

const normalizeParams = (params = {}) => Object.fromEntries(Object.entries(params || {}).flatMap(([key, value]) => {
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(key)) return [];
  if (!['string', 'number', 'boolean'].includes(typeof value)) return [];
  const safe = text(value, 500);
  return safe ? [[key, safe]] : [];
}));

export const normalizeTimelineResearchItem = (value = {}) => {
  const kind = text(value.kind || 'context', 40);
  const label = text(value.label || value.id || kind, 180);
  if (!label) return null;
  const chapter = Number(value.chapter);
  return Object.freeze({
    id: text(value.id, 220) || `${kind}:${idPart(label)}`,
    kind,
    label,
    chapter: Number.isFinite(chapter) ? chapter : null,
    eventId: text(value.eventId, 220) || null,
    entityId: text(value.entityId, 220) || null,
    location: text(value.location, 220) || null,
    context: text(value.context, 600) || null,
    params: Object.freeze(normalizeParams(value.params)),
    savedAt: text(value.savedAt, 60) || null,
  });
};

const itemKey = (item) => `${item.kind}|${item.id}|${item.eventId || ''}|${item.entityId || ''}|${item.chapter || ''}`;
const dedupeItems = (items = []) => [...new Map(items.map((item) => [itemKey(item), item])).values()];

const normalizeAnnotation = (value = {}) => {
  const note = text(value.note, 6000);
  if (!note) return null;
  return Object.freeze({
    id: text(value.id, 180) || nowId('annotation', note),
    targetId: text(value.targetId, 220) || null,
    targetKind: text(value.targetKind || 'session', 40),
    targetLabel: text(value.targetLabel, 180) || null,
    note,
    tags: Object.freeze(unique((Array.isArray(value.tags) ? value.tags : String(value.tags || '').split(',')).map((tag) => text(tag, 40)).filter(Boolean)).slice(0, 12)),
    createdAt: text(value.createdAt, 60) || null,
    updatedAt: text(value.updatedAt, 60) || null,
  });
};

const normalizeEvidenceRef = (value = {}) => {
  const item = normalizeTimelineResearchItem(value);
  if (!item) return null;
  return Object.freeze({ ...item, bucket: ['support', 'against', 'unknown'].includes(value.bucket) ? value.bucket : 'support' });
};

const normalizeHypothesis = (value = {}) => {
  const title = text(value.title, 300);
  if (!title) return null;
  return Object.freeze({
    id: text(value.id, 180) || nowId('hypothesis', title),
    title,
    status: ['active', 'supported', 'weakened', 'resolved'].includes(value.status) ? value.status : 'active',
    note: text(value.note, 5000),
    evidence: Object.freeze(dedupeItems((Array.isArray(value.evidence) ? value.evidence : []).map(normalizeEvidenceRef).filter(Boolean))),
    createdAt: text(value.createdAt, 60) || null,
    updatedAt: text(value.updatedAt, 60) || null,
  });
};

const normalizeQuestion = (value = {}) => {
  const question = text(value.question, 500);
  if (!question) return null;
  return Object.freeze({
    id: text(value.id, 180) || nowId('question', question),
    question,
    status: value.status === 'resolved' ? 'resolved' : 'open',
    note: text(value.note, 5000),
    sourceEventIds: Object.freeze(unique((value.sourceEventIds || []).map((id) => text(id, 220)).filter(Boolean)).slice(0, 40)),
    createdAt: text(value.createdAt, 60) || null,
    updatedAt: text(value.updatedAt, 60) || null,
  });
};

const normalizeSavedFilter = (value = {}) => {
  const name = text(value.name, 140);
  if (!name) return null;
  return Object.freeze({
    id: text(value.id, 180) || nowId('filter', name),
    name,
    params: Object.freeze(normalizeParams(value.params)),
    createdAt: text(value.createdAt, 60) || null,
  });
};

const normalizeTrailEntry = (value = {}) => {
  const label = text(value.label, 220);
  if (!label) return null;
  return Object.freeze({
    id: text(value.id, 220) || nowId('trail', label),
    label,
    kind: text(value.kind || 'context', 40),
    chapter: Number.isFinite(Number(value.chapter)) ? Number(value.chapter) : null,
    eventId: text(value.eventId, 220) || null,
    params: Object.freeze(normalizeParams(value.params)),
    visitedAt: text(value.visitedAt, 60) || iso(),
  });
};

const normalizeSession = (value = {}) => {
  const name = text(value.name, 160);
  if (!name) return null;
  return Object.freeze({
    id: text(value.id, 180) || nowId('session', name),
    name,
    status: ['active', 'paused', 'complete'].includes(value.status) ? value.status : 'active',
    note: text(value.note, 12000),
    tags: Object.freeze(unique((Array.isArray(value.tags) ? value.tags : String(value.tags || '').split(',')).map((tag) => text(tag, 40)).filter(Boolean)).slice(0, 16)),
    pins: Object.freeze(dedupeItems((Array.isArray(value.pins) ? value.pins : []).map(normalizeTimelineResearchItem).filter(Boolean)).slice(0, TIMELINE_RESEARCH_PIN_LIMIT)),
    inbox: Object.freeze(dedupeItems((Array.isArray(value.inbox) ? value.inbox : []).map(normalizeTimelineResearchItem).filter(Boolean)).slice(0, TIMELINE_RESEARCH_INBOX_LIMIT)),
    annotations: Object.freeze((Array.isArray(value.annotations) ? value.annotations : []).map(normalizeAnnotation).filter(Boolean).slice(0, TIMELINE_RESEARCH_ANNOTATION_LIMIT)),
    hypotheses: Object.freeze((Array.isArray(value.hypotheses) ? value.hypotheses : []).map(normalizeHypothesis).filter(Boolean).slice(0, TIMELINE_RESEARCH_HYPOTHESIS_LIMIT)),
    questions: Object.freeze((Array.isArray(value.questions) ? value.questions : []).map(normalizeQuestion).filter(Boolean).slice(0, TIMELINE_RESEARCH_QUESTION_LIMIT)),
    savedFilters: Object.freeze((Array.isArray(value.savedFilters) ? value.savedFilters : []).map(normalizeSavedFilter).filter(Boolean).slice(0, TIMELINE_RESEARCH_FILTER_LIMIT)),
    trail: Object.freeze((Array.isArray(value.trail) ? value.trail : []).map(normalizeTrailEntry).filter(Boolean).slice(0, TIMELINE_RESEARCH_TRAIL_LIMIT)),
    createdAt: text(value.createdAt, 60) || null,
    updatedAt: text(value.updatedAt, 60) || null,
  });
};

export const defaultTimelineResearchMemory = Object.freeze({
  version: 1,
  activeSessionId: null,
  sessions: Object.freeze([]),
});

export const normalizeTimelineResearchMemory = (value = {}) => {
  const sessions = (Array.isArray(value.sessions) ? value.sessions : []).map(normalizeSession).filter(Boolean).slice(0, TIMELINE_RESEARCH_SESSION_LIMIT);
  const activeSessionId = sessions.some((session) => session.id === value.activeSessionId) ? value.activeSessionId : sessions[0]?.id || null;
  return Object.freeze({ version: 1, activeSessionId, sessions: Object.freeze(sessions) });
};

const emit = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(TIMELINE_RESEARCH_MEMORY_EVENT));
};

export const readTimelineResearchMemory = () => normalizeTimelineResearchMemory(readStoredJson(TIMELINE_RESEARCH_MEMORY_KEY, defaultTimelineResearchMemory));

export function writeTimelineResearchMemory(value) {
  const normalized = normalizeTimelineResearchMemory(value);
  if (writeStoredJson(TIMELINE_RESEARCH_MEMORY_KEY, normalized)) emit();
  return normalized;
}

export function clearTimelineResearchMemory() {
  const removed = removeStoredValue(TIMELINE_RESEARCH_MEMORY_KEY);
  if (removed) emit();
  return removed;
}

const mutate = (factory) => writeTimelineResearchMemory(factory(readTimelineResearchMemory()));
const patchSession = (state, sessionId, patcher) => ({
  ...state,
  sessions: state.sessions.map((session) => session.id === sessionId ? patcher(session) : session),
});

export function createTimelineResearchSession(name, now = new Date()) {
  const safeName = text(name, 160);
  if (!safeName) return readTimelineResearchMemory();
  return mutate((state) => {
    if (state.sessions.length >= TIMELINE_RESEARCH_SESSION_LIMIT) return state;
    const stamp = iso(now);
    const session = normalizeSession({ id: nowId('session', safeName, now), name: safeName, createdAt: stamp, updatedAt: stamp });
    return { ...state, activeSessionId: session.id, sessions: [session, ...state.sessions] };
  });
}

export const setActiveTimelineResearchSession = (sessionId) => mutate((state) => state.sessions.some((session) => session.id === sessionId) ? { ...state, activeSessionId: sessionId } : state);
export const deleteTimelineResearchSession = (sessionId) => mutate((state) => {
  const sessions = state.sessions.filter((session) => session.id !== sessionId);
  return { ...state, sessions, activeSessionId: state.activeSessionId === sessionId ? sessions[0]?.id || null : state.activeSessionId };
});

export const updateTimelineResearchSession = (sessionId, patch = {}, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => ({
  ...session,
  ...(patch.name !== undefined ? { name: text(patch.name, 160) || session.name } : {}),
  ...(patch.note !== undefined ? { note: text(patch.note, 12000) } : {}),
  ...(patch.status !== undefined ? { status: ['active', 'paused', 'complete'].includes(patch.status) ? patch.status : session.status } : {}),
  ...(patch.tags !== undefined ? { tags: unique((Array.isArray(patch.tags) ? patch.tags : String(patch.tags).split(',')).map((tag) => text(tag, 40)).filter(Boolean)).slice(0, 16) } : {}),
  updatedAt: iso(now),
})));

export const toggleTimelineResearchPin = (sessionId, item, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeTimelineResearchItem({ ...item, savedAt: iso(now) });
  if (!normalized) return session;
  const exists = session.pins.some((candidate) => itemKey(candidate) === itemKey(normalized));
  return { ...session, pins: exists ? session.pins.filter((candidate) => itemKey(candidate) !== itemKey(normalized)) : [normalized, ...session.pins].slice(0, TIMELINE_RESEARCH_PIN_LIMIT), updatedAt: iso(now) };
}));

export const addTimelineResearchInboxItem = (sessionId, item, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeTimelineResearchItem({ ...item, savedAt: iso(now) });
  if (!normalized) return session;
  return { ...session, inbox: [normalized, ...session.inbox.filter((candidate) => itemKey(candidate) !== itemKey(normalized))].slice(0, TIMELINE_RESEARCH_INBOX_LIMIT), updatedAt: iso(now) };
}));
export const removeTimelineResearchInboxItem = (sessionId, item) => mutate((state) => patchSession(state, sessionId, (session) => ({ ...session, inbox: session.inbox.filter((candidate) => itemKey(candidate) !== itemKey(item)), updatedAt: iso() })));

export const addTimelineResearchAnnotation = (sessionId, annotation, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeAnnotation({ ...annotation, id: annotation.id || nowId('annotation', annotation.note, now), createdAt: annotation.createdAt || iso(now), updatedAt: iso(now) });
  if (!normalized) return session;
  return { ...session, annotations: [normalized, ...session.annotations.filter((item) => item.id !== normalized.id)].slice(0, TIMELINE_RESEARCH_ANNOTATION_LIMIT), updatedAt: iso(now) };
}));
export const deleteTimelineResearchAnnotation = (sessionId, annotationId) => mutate((state) => patchSession(state, sessionId, (session) => ({ ...session, annotations: session.annotations.filter((item) => item.id !== annotationId), updatedAt: iso() })));

export const addTimelineResearchHypothesis = (sessionId, title, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeHypothesis({ id: nowId('hypothesis', title, now), title, createdAt: iso(now), updatedAt: iso(now) });
  if (!normalized) return session;
  return { ...session, hypotheses: [normalized, ...session.hypotheses].slice(0, TIMELINE_RESEARCH_HYPOTHESIS_LIMIT), updatedAt: iso(now) };
}));
export const updateTimelineResearchHypothesis = (sessionId, hypothesisId, patch = {}, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => ({
  ...session,
  hypotheses: session.hypotheses.map((hypothesis) => hypothesis.id === hypothesisId ? normalizeHypothesis({ ...hypothesis, ...patch, updatedAt: iso(now) }) : hypothesis),
  updatedAt: iso(now),
})));
export const addTimelineResearchHypothesisEvidence = (sessionId, hypothesisId, item, bucket = 'support', now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => ({
  ...session,
  hypotheses: session.hypotheses.map((hypothesis) => {
    if (hypothesis.id !== hypothesisId) return hypothesis;
    const normalized = normalizeEvidenceRef({ ...item, bucket, savedAt: iso(now) });
    if (!normalized) return hypothesis;
    return normalizeHypothesis({ ...hypothesis, evidence: [normalized, ...hypothesis.evidence.filter((candidate) => itemKey(candidate) !== itemKey(normalized))], updatedAt: iso(now) });
  }),
  updatedAt: iso(now),
})));

export const addTimelineResearchQuestion = (sessionId, question, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeQuestion({ id: nowId('question', question, now), question, createdAt: iso(now), updatedAt: iso(now) });
  if (!normalized) return session;
  return { ...session, questions: [normalized, ...session.questions].slice(0, TIMELINE_RESEARCH_QUESTION_LIMIT), updatedAt: iso(now) };
}));
export const updateTimelineResearchQuestion = (sessionId, questionId, patch = {}, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => ({
  ...session,
  questions: session.questions.map((question) => question.id === questionId ? normalizeQuestion({ ...question, ...patch, updatedAt: iso(now) }) : question),
  updatedAt: iso(now),
})));

export const saveTimelineResearchFilter = (sessionId, name, params, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeSavedFilter({ id: nowId('filter', name, now), name, params, createdAt: iso(now) });
  if (!normalized) return session;
  return { ...session, savedFilters: [normalized, ...session.savedFilters].slice(0, TIMELINE_RESEARCH_FILTER_LIMIT), updatedAt: iso(now) };
}));
export const deleteTimelineResearchFilter = (sessionId, filterId) => mutate((state) => patchSession(state, sessionId, (session) => ({ ...session, savedFilters: session.savedFilters.filter((filter) => filter.id !== filterId), updatedAt: iso() })));

export const recordTimelineResearchTrail = (sessionId, entry, now = new Date()) => mutate((state) => patchSession(state, sessionId, (session) => {
  const normalized = normalizeTrailEntry({ ...entry, visitedAt: iso(now) });
  if (!normalized) return session;
  const previous = session.trail[0];
  const same = previous && previous.kind === normalized.kind && previous.eventId === normalized.eventId && previous.chapter === normalized.chapter && JSON.stringify(previous.params) === JSON.stringify(normalized.params);
  if (same) return session;
  return { ...session, trail: [normalized, ...session.trail].slice(0, TIMELINE_RESEARCH_TRAIL_LIMIT), updatedAt: iso(now) };
}));
export const clearTimelineResearchTrail = (sessionId) => mutate((state) => patchSession(state, sessionId, (session) => ({ ...session, trail: [], updatedAt: iso() })));
