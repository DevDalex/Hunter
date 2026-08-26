import {
  succession414ChapterFocus,
  succession414ChapterResearch,
  succession414Mysteries,
  succession414NenFindings,
  succession414RelationshipRecords,
  succession414ResolvedQuestions,
  succession414SourcePolicy,
  succession414TimelineEvents,
} from './succession414Research.js';
import {
  succession415ChapterFocus,
  succession415ChapterResearch,
  succession415Mysteries,
  succession415NenFindings,
  succession415RelationshipRecords,
  succession415ResolvedQuestions,
  succession415SourcePolicy,
  succession415TimelineEvents,
} from './succession415Research.js';

export * from './succession414415ResearchBase.js';
export {
  succession414ChapterFocus,
  succession414ChapterResearch,
  succession414Mysteries,
  succession414NenFindings,
  succession414RelationshipRecords,
  succession414ResolvedQuestions,
  succession414SourcePolicy,
  succession414TimelineEvents,
} from './succession414Research.js';
export {
  succession415ChapterFocus,
  succession415ChapterResearch,
  succession415Mysteries,
  succession415NenFindings,
  succession415RelationshipRecords,
  succession415ResolvedQuestions,
  succession415SourcePolicy,
  succession415TimelineEvents,
} from './succession415Research.js';

const freeze = (value) => Object.freeze(value);

export const succession414415SourcePolicy = freeze({
  reviewedAt: '2026-08-14',
  chapter414: succession414SourcePolicy,
  chapter415: succession415SourcePolicy,
});

export const succession414415ChapterResearch = freeze([
  ...succession414ChapterResearch,
  ...succession415ChapterResearch,
].sort((left, right) => left.number - right.number));

export const succession414415ChapterFocus = freeze({
  ...succession414ChapterFocus,
  ...succession415ChapterFocus,
});
