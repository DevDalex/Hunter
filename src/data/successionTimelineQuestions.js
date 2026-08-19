import {
  successionMysteries,
  successionResolvedQuestions,
} from './successionDossierThrough417.js';

const freeze = (value) => Object.freeze(value);
const chapterSource = (chapter) => `https://hunterxhunter.fandom.com/wiki/Chapter_${chapter}`;
const chapterNumber = (value, fallback = 340) => {
  const matches = String(value ?? '').match(/\d{3}/g)?.map(Number) || [];
  return matches.length ? Math.max(...matches) : fallback;
};

const normalizeOpen = (item) => {
  const chapter = chapterNumber(item.lastChapter ?? item.chapter ?? item.chapters, 340);
  return freeze({
    question: item.question || item.title || item.subject || 'Open Succession question',
    evidence: item.evidence || item.note || item.boundary || item.status || 'Maintained Succession research marks this question as unresolved.',
    status: item.status || 'open',
    chapter,
    lastChapter: String(item.lastChapter || chapter),
    source: item.source || chapterSource(chapter),
  });
};

const normalizeResolved = (item) => {
  const chapter = chapterNumber(item.chapter ?? item.lastChapter ?? item.chapters, 340);
  return freeze({
    question: item.question || item.title || item.subject || 'Resolved Succession question',
    answer: item.answer || item.resolution || item.evidence || item.note || 'Resolved in maintained Succession research.',
    status: 'resolved',
    chapter,
    source: item.source || chapterSource(chapter),
  });
};

const dedupe = (records) => {
  const seen = new Set();
  return records.filter((record) => {
    const key = `${record.chapter}:${record.question}`.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const timelineQuestionLedger = freeze({
  open: freeze(dedupe((successionMysteries || []).map(normalizeOpen))),
  resolved: freeze(dedupe((successionResolvedQuestions || []).map(normalizeResolved))),
});
