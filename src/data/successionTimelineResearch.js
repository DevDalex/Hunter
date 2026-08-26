import { readStoredJson, writeStoredJson } from '../lib/browserStorage.js';

export const SUCCESSION_TIMELINE_NOTES_KEY = 'hxh-succession-timeline-notes-v1';
export const SUCCESSION_TIMELINE_NOTES_EVENT = 'hxh-succession-timeline-notes';
export const SUCCESSION_TIMELINE_NOTE_LIMIT = 4000;
export const SUCCESSION_TIMELINE_NOTE_COUNT_LIMIT = 200;

const text = (value, maximum = SUCCESSION_TIMELINE_NOTE_LIMIT) => String(value ?? '').trim().slice(0, maximum);

export const classifyTimelineEvent = (event) => {
  const value = `${event.title || ''} ${event.detail || ''} ${(event.tracks || []).join(' ')}`.toLocaleLowerCase();
  if (/martial law|emergency|lockdown|evacuat|alarm/.test(value)) return 'emergency';
  if (/\b(dies?|dead|death|killed|murder|fatal|corpse|assassin)/.test(value)) return 'death';
  if (/\b(nen|aura|zetsu|guardian spirit beast|ability|curse|specialist|emission|conjuration)/.test(value)) return 'nen';
  if (/\b(decid|orders?|commands?|plans?|chooses?|accepts?|refuses?|announces?|proposes?|declares?|votes?|selects?)/.test(value)) return 'decision';
  if (/\b(moves?|movement|enters?|leaves?|returns?|arrives?|departs?|relocat|escapes?|boards?|corridor|room|tier)/.test(value)) return 'movement';
  if (/\b(investigat|search|evidence|deduc|suspect|question|discover|learns?|reveals?)/.test(value)) return 'investigation';
  if (/\b(alliance|treaty|deal|negotiat|cooperat|betray|truce|contract)/.test(value)) return 'alliance';
  if (/\b(attacks?|fight|combat|shoots?|strikes?|clash|battle|ambush)/.test(value)) return 'combat';
  if (/\b(prince|queen|succession|ritual|royal|politic|banquet|ceremony)/.test(value)) return 'politics';
  return 'other';
};

export const archiveItemForTimelineEvent = (event) => ({
  route: 'timeline',
  params: { event: event.id, chapter: event.chapter, view: 'overview' },
  entityId: event.id,
  label: event.title,
  context: `${event.day ? `Voyage Day ${event.day}` : 'Pre-voyage'} · Chapter ${event.chapter} · ${event.location || 'Location unresolved'}`,
});

export const readSuccessionTimelineNotes = () => {
  const stored = readStoredJson(SUCCESSION_TIMELINE_NOTES_KEY, {});
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return Object.fromEntries(Object.entries(stored)
    .filter(([id]) => typeof id === 'string' && id.length <= 180)
    .map(([id, note]) => [id, text(note)])
    .filter(([, note]) => note)
    .slice(-SUCCESSION_TIMELINE_NOTE_COUNT_LIMIT));
};

export function writeSuccessionTimelineNote(eventId, note) {
  const safeId = String(eventId || '').trim().slice(0, 180);
  if (!safeId) return readSuccessionTimelineNotes();
  const current = readSuccessionTimelineNotes();
  const next = { ...current };
  const safeNote = text(note);
  if (safeNote) next[safeId] = safeNote;
  else delete next[safeId];
  const limited = Object.fromEntries(Object.entries(next).slice(-SUCCESSION_TIMELINE_NOTE_COUNT_LIMIT));
  if (writeStoredJson(SUCCESSION_TIMELINE_NOTES_KEY, limited) && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SUCCESSION_TIMELINE_NOTES_EVENT));
  }
  return limited;
}
