import * as base from './successionDossierThrough416.js';
import {
  succession417ChapterFocus,
  succession417ChapterResearch,
  succession417Mysteries,
  succession417NenFindings,
  succession417ResolvedQuestions,
  succession417SourcePolicy,
} from './succession417Research.js';

export * from './successionDossierThrough416.js';

const freeze = (value) => Object.freeze(value);
const source417 = 'https://hunterxhunter.fandom.com/wiki/Chapter_417';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession417ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record)=>record.number!==417),
  ...succession417ChapterResearch,
].sort((a,b)=>a.number-b.number));

const relationshipRecords = freeze([
  freeze({ id:'ch417-benjamin-salkov',from:'Benjamin',to:'Salkov',type:'testimony / custody command',note:'Benjamin orders Salkov to report exactly what he saw and then sends him to Central Justice Bureau detention before the planned reality check.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-danjin',from:'Benjamin',to:'Danjin',type:'custody command',note:'Danjin is ordered detained alongside Salkov.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-tubeppa',from:'Benjamin',to:'Tubeppa',type:'coercive royal control',note:'Benjamin covertly exposes Tubeppa to TSK-17, restricts movement, and requests a formal inspection.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-tyson',from:'Benjamin',to:'Tyson',type:'coercive royal control',note:'Benjamin covertly exposes Tyson to TSK-17 and places her under the same movement and inspection regime.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-balsamilco',from:'Benjamin',to:'Balsamilco',type:'military command',note:'Benjamin returns Balsamilco to armed First Unit duty and assigns the Halkenburg investigation.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-coventoba',from:'Benjamin',to:'Coventoba',type:'military command',note:'Benjamin rejects detention, re-arms Coventoba, and orders him to keep holding Zhang Lei’s coin.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-balsamilco-halkenburg',from:'Balsamilco',to:'Halkenburg',type:'counterintelligence investigation',note:'Balsamilco takes the feather-mark investigation into possible Halkenburg mind-swap participants.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-camilla',from:'Benjamin',to:'Camilla',type:'hostile surveillance / framing',note:'Benjamin uses Secret Window to observe Camilla’s medical contact and plans a cover narrative around her.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
  freeze({ id:'ch417-benjamin-unma',from:'Benjamin',to:'Unma',type:'planned hostile dynastic confrontation',note:'Benjamin decides to confront Unma and force a choice between her own life and Halkenburg’s.',phase:'Voyage Chapter 417',chapters:'417',state:'planned / publication ceiling',source:source417 }),
  freeze({ id:'ch417-benjamin-halkenburg',from:'Benjamin',to:'Halkenburg',type:'hostile royal targeting',note:'Halkenburg remains among Benjamin’s elimination/infection targets and becomes the “Brother” named in the final Unma plan.',phase:'Voyage Chapter 417',chapters:'417',state:'active',source:source417 }),
]);

const relationshipMap = new Map((base.successionRelationships || []).map((record)=>[record.id || `${record.from}:${record.to}:${record.chapters}`,record]));
for (const record of relationshipRecords) relationshipMap.set(record.id,record);
export const successionRelationships = freeze([...relationshipMap.values()]);
export const successionMysteries = freeze([...(base.successionMysteries || []),...succession417Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []),...succession417ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter417:source417, sourcePolicy417:succession417SourcePolicy });
export const guardAssignmentGroups = freeze([
  ...(base.guardAssignmentGroups || []),
  freeze({ group:'Chapter 417 publication ceiling / Justice takeover / Gypsy Life', description:'Strict Chapter 417 integration preserving the 74-beat Room 1004 aftermath, Salkov reality uncertainty, Salkov/Danjin detention, Justice headquarters takeover, Tubeppa/Tyson TSK-17 exposure, Benjamin’s speaker-bounded strategic projections, Balsamilco/Coventoba Gyo and First Unit reactivation, value-10 coin and feather investigations, Gypsy Life alternating-host rule, and the Unma/Halkenburg publication-ceiling endpoint.',records:freeze([]) }),
]);

export const chapter417Research = succession417ChapterResearch;
export const relationshipsChapter417Research = relationshipRecords;
export const nenChapter417Research = succession417NenFindings;
