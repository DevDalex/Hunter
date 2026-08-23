import fs from 'node:fs';
import { succession418ChapterResearch, succession418SourcePolicy, succession418TimelineEvents } from '../src/data/succession418Research.js';

const assert = (condition,message) => { if (!condition) throw new Error(`Chapter 418 strict audit failed: ${message}`); };
const note = fs.readFileSync('docs/source-notes/chapter-418.md','utf8').replace(/\*\*/g,'');
const research = succession418ChapterResearch?.[0];
const text = JSON.stringify(succession418TimelineEvents);

assert(research?.number===418,'Chapter 418 research record must exist');
assert(research?.titleStatus==='official-title-not-supplied','official title must not be invented');
assert(research?.releaseDate==='August 23, 2026','verified publication date must be retained');
assert(succession418TimelineEvents.length===63,'strict packet must contain 63 beats');
assert(/sole substantive Chapter 418 story source/i.test(succession418SourcePolicy.soleSubstantiveSource?.basis || ''),'user-supplied synopsis must remain controlling story source');
assert(/current publication ceiling/i.test(succession418SourcePolicy.publicationCeiling || ''),'418 must be the current publication ceiling');
assert(/2\.92 seconds|2\.92/i.test(text),'Zetsu timecheck must be present');
assert(/water/i.test(text) && /bottle/i.test(text) && /non-existent bottle|only real bottle|predicted bottle/i.test(text),'water-bottle perception experiment must be present');
assert(/remaining in Zetsu|keeps affected observers|original ten-second/i.test(text),'sustained-Zetsu extension must be present');
assert(/alarm/i.test(text) && /does not disrupt|fails to break|does not break/i.test(text),'Special Martial Law alarm Zetsu test must be present');
assert(/storms into Room 1004|shoots the Tserriednich everyone perceives|apparent Tserriednich/i.test(text),'Benjamin apparent execution must be recontextualized');
assert(/one-eleventh|just under four hours|slightly less than four hours/i.test(text),'aura battery estimate must be present and speaker-bounded');
assert(/last will/i.test(text) && /coffin/i.test(text) && /guns|firearms/i.test(text),'staged-death coffin plan must be present');
assert(/6 a\.m\.|6am|6 a.m./i.test(text) && /Voyage Day 13/i.test(text),'next-day coffin schedule must be present');
assert(/Route A/i.test(text) && /Route B/i.test(text) && /Route C/i.test(text),'three-route analysis must be present');
assert(/Theta/i.test(text) && /without confirmed recognition|without reacting/i.test(text),'Theta endpoint ambiguity must be preserved');
assert(/Do not invent/i.test(note) && /Chapter 419/i.test(note),'post-endpoint invention must be explicitly forbidden');
assert(/hypotheses/i.test(note) && /antenna/i.test(note) && /outside observers/i.test(note),'Tserriednich hypotheses must remain separated from confirmed mechanics');

console.log('Chapter 418 strict audit passed: 63 source-bounded events preserve the sustained-Zetsu reveal, staged-death escape plan, hypothesis boundaries, and Route A publication endpoint.');
