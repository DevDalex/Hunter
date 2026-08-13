import * as base from './successionDossierThrough412.js';
import { succession413ChapterFocus, succession413ChapterResearch, succession413SourcePolicy } from './succession413Research.js';

export * from './successionDossierThrough412.js';

const freeze = (value) => Object.freeze(value);

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession413ChapterFocus });
export const successionChapterResearch = freeze([...(base.successionChapterResearch || []), ...succession413ChapterResearch].sort((a, b) => a.number - b.number));
export const dossierSources = freeze({ ...base.dossierSources, chapter413: 'https://hunterxhunter.fandom.com/wiki/Chapter_413', sourcePolicy413: succession413SourcePolicy });
export const guardAssignmentGroups = freeze([...(base.guardAssignmentGroups || []), freeze({ group: 'Chapter 413 maintained integration', description: 'Strict Chapter 413 research and chronology boundary integrated.', records: freeze([]) })]);
export const chapter413Research = succession413ChapterResearch;
