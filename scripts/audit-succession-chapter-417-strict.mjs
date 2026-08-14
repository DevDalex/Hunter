import fs from 'node:fs';
import { succession417ChapterResearch, succession417SourcePolicy, succession417TimelineEvents } from '../src/data/succession417Research.js';

const assert = (condition,message) => { if (!condition) throw new Error(`Chapter 417 strict audit failed: ${message}`); };
const note = fs.readFileSync('docs/source-notes/chapter-417.md','utf8').replace(/\*\*/g,'');
const research = succession417ChapterResearch?.[0];
const text = JSON.stringify(succession417TimelineEvents);

assert(research?.number===417,'Chapter 417 research record must exist');
assert(research?.titleStatus==='official-title-not-supplied','official title must not be invented');
assert(succession417TimelineEvents.length===74,'strict packet must contain 74 beats');
assert(/sole substantive Chapter 417 story source/i.test(succession417SourcePolicy.soleSubstantiveSource?.basis || ''),'user-supplied synopsis must remain controlling source');
assert(/current publication ceiling/i.test(succession417SourcePolicy.publicationCeiling || ''),'417 must remain the current publication ceiling');
assert(/Tserriednich/i.test(text) && /Theta/i.test(text) && /illusion/i.test(text),'Room 1004 reality-analysis boundary must be present');
assert(/covertly disperses TSK-17/i.test(text),'Room 1001 TSK-17 operation must be present');
assert(/Gypsy Life: Bohemian Rhapsody/i.test(text) && /alternates/i.test(text),'Gypsy Life alternating-host rule must be present');
assert(/Unma/i.test(text) && /Halkenburg/i.test(text),'publication-ceiling endpoint must be present');
assert(/Viz/i.test(note) && /alternates/i.test(note),'translation discrepancy must be documented');
assert(/Do not invent/i.test(note),'post-endpoint invention must be explicitly forbidden');

console.log('Chapter 417 strict audit passed: 74 source-bounded events preserve the current publication ceiling and Gypsy Life translation boundary.');
