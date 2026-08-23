import * as base from './successionDossierThrough417.js';
import {
  succession418ChapterFocus,
  succession418ChapterResearch,
  succession418Mysteries,
  succession418NenFindings,
  succession418ResolvedQuestions,
  succession418SourcePolicy,
} from './succession418Research.js';

export * from './successionDossierThrough417.js';

const freeze = (value) => Object.freeze(value);
const source418 = 'https://hunterxhunter.fandom.com/wiki/Chapter_418';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession418ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record)=>record.number!==418),
  ...succession418ChapterResearch,
].sort((a,b)=>a.number-b.number));

const relationshipRecords = freeze([
  freeze({ id:'ch418-tserriednich-salkov-ability-test',from:'Tserriednich',to:'Salkov',type:'concealed Nen experimentation / command trust',note:'Tserriednich uses Salkov as the unwitting timing and perception subject for sustained-Zetsu Parallel Future experiments, then entrusts him with the staged-death testimony role.',phase:'Voyage Chapter 418',chapters:'418',state:'active / asymmetric knowledge',source:source418 }),
  freeze({ id:'ch418-tserriednich-benjamin-staged-death',from:'Tserriednich',to:'Benjamin',type:'hostile deception / apparent execution',note:'Benjamin believes he shoots and crushes Tserriednich while the actual Tserriednich watches from outside the perceived future-state and converts the apparent execution into an escape opportunity.',phase:'Voyage Chapter 418',chapters:'418',state:'active deception / Benjamin misinformed',source:source418 }),
  freeze({ id:'ch418-tserriednich-theta-perception-ambiguity',from:'Tserriednich',to:'Theta',type:'concealed observation / unresolved detection',note:'At the endpoint Tserriednich briefly fears Theta can see him when her gaze appears to land on him, but she walks past without confirmed recognition.',phase:'Voyage Chapter 418',chapters:'418',state:'ambiguous / no confirmed detection',source:source418 }),
  freeze({ id:'ch418-tserriednich-vantine-invisible-fire',from:'Tserriednich',to:'Vantine',type:'hostile experiment under perception effect',note:'Irritated by Vantine’s argument with Salkov, Tserriednich fires three rounds at Vantine; the bullets crumple at his forehead while Vantine continues reacting only to the perceived future.',phase:'Voyage Chapter 418',chapters:'418',state:'demonstrated ability interaction',source:source418 }),
  freeze({ id:'ch418-tserriednich-nasubi-coffin-delay',from:'Tserriednich',to:'Nasubi',type:'information-delay contingency',note:'Tserriednich expects his no-viewing coffin plan to buy time if the coffin reaches Nasubi, reasoning that his father will neither volunteer nor conceal information about the possibility that he survived.',phase:'Voyage Chapter 418',chapters:'418',state:'planned / not yet tested',source:source418 }),
]);

const relationshipMap = new Map((base.successionRelationships || []).map((record)=>[record.id || `${record.from}:${record.to}:${record.chapters}`,record]));
for (const record of relationshipRecords) relationshipMap.set(record.id,record);
export const successionRelationships = freeze([...relationshipMap.values()]);
export const successionMysteries = freeze([...(base.successionMysteries || []),...succession418Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []),...succession418ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter418:source418, sourcePolicy418:succession418SourcePolicy });
export const guardAssignmentGroups = freeze([
  ...(base.guardAssignmentGroups || []),
  freeze({
    group:'Chapter 418 Room 1004 staged-death and escape assignments',
    description:'Chapter 418 converts Tserriednich’s sustained Zetsu into an operational deception plan: household nonresistance, Salkov testimony and coffin transport, no-viewing funeral instructions, weapon-weight substitution, identity avoidance, and Route A escape planning.',
    records:freeze([
      freeze({ subject:'Room 1004 nonresistance', people:'Tserriednich, Vantine, Salkov, household guards', notes:'Ignore Benjamin’s troops until forced entry, then surrender weapons and obey all instructions without resistance.', status:'ordered and implemented', source:source418 }),
      freeze({ subject:'Salkov witness role', people:'Tserriednich, Salkov', notes:'Salkov is told that Tserriednich is going to die and must report exactly what he sees.', status:'ordered / feeds staged-death narrative', source:source418 }),
      freeze({ subject:'No-viewing last will', people:'Tserriednich, Salkov', notes:'No funeral ceremony, no posthumous naming ceremony, no sendoff and no viewing; the stated Benjamin-disfigurement rationale protects the coffin deception.', status:'written and read aloud', source:source418 }),
      freeze({ subject:'Coffin transport', people:'Salkov', notes:'Military arrangement leaves the remains in Room 1004 until 6 a.m. on Voyage Day 13, after which Salkov alone is to transport the coffin.', status:'scheduled / future execution unresolved', source:source418 }),
      freeze({ subject:'Coffin filler', people:'Tserriednich', notes:'Surrendered firearms are loaded into the coffin to avoid the giveaway of an empty casket.', status:'implemented', source:source418 }),
      freeze({ subject:'Escape identity discipline', people:'Tserriednich', notes:'Avoid personal guards and Benjamin personnel who know Tserriednich should be dead and can identify his face.', status:'active self-assignment', source:source418 }),
      freeze({ subject:'Preferred Tier 1 escape route', people:'Tserriednich', notes:'Route A is selected over Route B and Route C after Tserriednich predicts Benjamin will use Route C toward Justice and Route B will be militarily/mafia active.', status:'planned / traversal not shown', source:source418 }),
    ]),
  }),
]);

export const chapter418Research = succession418ChapterResearch;
export const relationshipsChapter418Research = relationshipRecords;
export const nenChapter418Research = succession418NenFindings;
