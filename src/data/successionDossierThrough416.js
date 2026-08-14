import * as base from './successionDossierThrough415.js';
import {
  succession416ChapterFocus,
  succession416ChapterResearch,
  succession416Mysteries,
  succession416NenFindings,
  succession416ResolvedQuestions,
  succession416SourcePolicy,
} from './succession416Research.js';

export * from './successionDossierThrough415.js';

const freeze = (value) => Object.freeze(value);
const source416 = 'https://hunterxhunter.fandom.com/wiki/Chapter_416';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession416ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record)=>record.number!==416),
  ...succession416ChapterResearch,
].sort((a,b)=>a.number-b.number));

const relationshipRecords = freeze([
  freeze({ id:'ch416-benjamin-camilla',from:'Benjamin',to:'Camilla',type:'hostile royal confrontation',note:'Camilla shoots Benjamin; Benjamin kills her servants, avoids killing Camilla directly, and infects her with TSK-17.',phase:'Voyage Chapter 416',chapters:'416',state:'active / unresolved',source:source416 }),
  freeze({ id:'ch416-moswana-benjamin',from:'Moswana',to:'Benjamin',type:'post-mortem curse',note:'Moswana dies and Dust in the Wind: Hell Fruit visibly strikes Benjamin; final effect unresolved.',phase:'Voyage Chapter 416',chapters:'416',state:'activated',source:source416 }),
  freeze({ id:'ch416-camilla-moswana',from:'Camilla',to:'Moswana',type:'curse-operation cooperation',note:'Camilla states their ten-year plan has come to fruition after Moswana’s activation.',phase:'Voyage Chapter 416',chapters:'416',state:'completed activation / later curse outcome unresolved',source:source416 }),
  freeze({ id:'ch416-benjamin-furykov',from:'Benjamin',to:'Furykov',type:'military command',note:'Furykov accompanies Benjamin armed through the Camilla and Room 1004 operations.',phase:'Voyage Chapter 416',chapters:'416',state:'active',source:source416 }),
  freeze({ id:'ch416-benjamin-butch',from:'Benjamin',to:'Butch',type:'military command',note:'Butch accompanies Benjamin, reports Room 1004 conditions, and receives the Danjin escort order.',phase:'Voyage Chapter 416',chapters:'416',state:'active',source:source416 }),
  freeze({ id:'ch416-tserriednich-salkov',from:'Tserriednich',to:'Salkov',type:'secret staged-death contingency',note:'Tserriednich orders Salkov to secure his body unseen, report exactly what he sees, and keep the ability secret.',phase:'Voyage Chapter 416',chapters:'416',state:'unresolved',source:source416 }),
  freeze({ id:'ch416-benjamin-danjin',from:'Benjamin',to:'Danjin',type:'custody / questioning order',note:'Benjamin identifies Danjin as a Room 1014 student and orders him taken to the central Ministry of Justice.',phase:'Voyage Chapter 416',chapters:'416',state:'active',source:source416 }),
  freeze({ id:'ch416-benjamin-tserriednich',from:'Benjamin',to:'Tserriednich',type:'hostile royal confrontation',note:'Benjamin reserves Tserriednich for himself and shoots him in the master bedroom; immediate result unresolved.',phase:'Voyage Chapter 416',chapters:'416',state:'unresolved',source:source416 }),
]);

const relationshipMap = new Map((base.successionRelationships || []).map((record)=>[record.id || `${record.from}:${record.to}:${record.chapters}`,record]));
for (const record of relationshipRecords) relationshipMap.set(record.id,record);
export const successionRelationships = freeze([...relationshipMap.values()]);
export const successionMysteries = freeze([...(base.successionMysteries || []),...succession416Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []),...succession416ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter416:source416, sourcePolicy416:succession416SourcePolicy });
export const guardAssignmentGroups = freeze([
  ...(base.guardAssignmentGroups || []),
  freeze({ group:'Chapter 416 martial-law assault / Hell Fruit / Room 1004', description:'Strict Chapter 416 integration preserving Benjamin’s ten-hour self-stated deadline, the Camilla confrontation, Hell Fruit activation without later curse outcome, TSK-17 infection without later disease outcome, Salkov’s speaker-bounded Zetsu inference, Room 1004 breach, Danjin questioning order, Tserriednich shooting cliff-edge, and the Chapter 417+ firewall.',records:freeze([]) }),
]);

export const chapter416Research = succession416ChapterResearch;
export const relationshipsChapter416Research = relationshipRecords;
export const nenChapter416Research = succession416NenFindings;
