import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 415 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-415.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapter = await vite.ssrLoadModule('/src/data/succession415Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen414 = await vite.ssrLoadModule('/src/data/successionArchiveThrough414.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const research = chapter.succession415ChapterResearch?.[0];
  assert(research?.number === 415 && research?.title === 'Truth and Falsehood', 'strict Chapter 415 record and retained title must load');
  assert(research?.voyageDay === 'Voyage Day 12', 'the supplied day-number correction must preserve Voyage Day 12');
  assert(research?.chronology?.presentationOrderNonLinear === true, 'Chapter 415 must preserve its flashback / current-voyage non-linear presentation');
  assert(research?.chronology?.exactClockTime === null, 'the record must not invent one chapter-wide exact clock time');
  assert(chapter.succession415TimelineEvents.length === 60, 'research must contain 60 curated Chapter 415 beats');

  const timelineText = text(chapter.succession415TimelineEvents);
  assert(/Two months before departure/i.test(timelineText), 'Furykov pre-voyage flashback must remain present');
  assert(/13:50/i.test(timelineText), 'Room 1014 must preserve the explicit 13:50 time');
  assert(/15 minutes before declaration/i.test(timelineText), 'Room 1013 must preserve the explicit fifteen-minutes-before relation');
  assert(/20 minutes after declaration/i.test(timelineText), 'final Room 1014 scene must preserve the explicit twenty-minutes-after relation');
  assert(!/14:15/i.test(timelineText), 'the strict packet must not derive an exact declaration minute absent from the supplied synopsis');
  assert(/eleventh day|eleventh-day|day eleven/i.test(text(research.chronology)) && /Voyage Day 12/i.test(text(research)), 'the source-note day-number error must be documented while Day 12 remains canonical');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index410 = numbers.indexOf(410);
  assert(index410 >= 0 && numbers.slice(index410, index410 + 7).join(',') === '410,411,412,413,414,415,416', 'maintained 410–416 chain must stay continuous');
  assert(maintained.maintainedSuccessionChapterResearch.filter((record) => record.number === 415).length === 1, 'maintained catalogue must expose Chapter 415 exactly once');

  const events = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 415 && event.chapterRange?.end === 415);
  const projected = events.filter((event) => event.maintainedResearch === true);
  const dedicated = events.filter((event) => String(event.id || '').startsWith('event:chapter415-') && !event.maintainedResearch);
  assert(projected.length === 60, 'all 60 maintained beats must project into story intelligence');
  assert(dedicated.length === 60, 'all 60 dedicated Chapter 415 canonical events must exist');

  const combo = archive.getEntityById('ability:combo-master');
  assert(combo?.latestChapter === 415 && /laptop|interface/i.test(text(combo)) && /365/i.test(text(combo)) && /700/i.test(text(combo)), 'Combo Master must carry the demonstrated Chapter 415 interface and curse-specific timing knowledge');
  assert(/this curse|detected curse|curse-specific/i.test(text(combo)) && !/universal 365|always 365/i.test(text(combo)), '365/700 estimates must remain scoped to the detected curse');
  const comboKnowledge = archive.getAbilityKnowledgeAtChapter('ability:combo-master', 415);
  assert(/silhouette/i.test(text(comboKnowledge)) && /365/i.test(text(comboKnowledge)) && /700/i.test(text(comboKnowledge)), 'Chapter 415 Combo Master knowledge history must resolve');

  assert(/daughter Woble|real Woble/i.test(timelineText) && /stand-in child/i.test(timelineText) && /unnamed nephew/i.test(timelineText), 'real daughter Woble and aboard stand-in nephew must remain separate identities');
  assert(/eight postcards/i.test(timelineText) && /deliveryman/i.test(timelineText), 'the eight-postcard dispatch into the dealer network must be present');
  assert(/Special Martial Law is declared/i.test(timelineText), 'formal Special Martial Law declaration must be present');
  assert(/killed Luzurus’s guards|killed the break-room guards/i.test(timelineText) && /bound and bruised/i.test(timelineText), 'Room 1007 must preserve the guards’ deaths and Kanjidol’s bound status');
  assert(/Luzurus and Rice are missing|Luzurus and Rice cannot be found/i.test(timelineText), 'Luzurus and Rice missing status must be present');
  assert(/cannot risk leaving the Nen space|remain inside/i.test(timelineText) && /reset|dormancy|disappearance/i.test(timelineText), 'Room 1013 hold-space decision and hypothetical consequences must be preserved');
  assert(/indictment is deferred/i.test(timelineText) && /fleeing custody/i.test(timelineText), 'Oito deferred indictment and bedroom confinement must be preserved');
  assert(/another reason for Special Martial Law|another unidentified motive/i.test(timelineText), 'Kurapika’s strict Chapter 415 endpoint inference must be present');

  const stateIds = ['furykov','tubeppa-hui-guo-rou','rihan','luzurus-hui-guo-rou','rice','kanjidol','oito-hui-guo-rou','kurapika','biscuit-krueger','marayam-hui-guo-rou','seiko-hui-guo-rou','fugetsu-hui-guo-rou'];
  assert(stateIds.every((slug) => archive.getCharacterStateAtChapter(`character:${slug}`, 415)), 'all 12 Chapter 415 state snapshots must resolve');

  const relationshipIds = [
    'relationship:furykov-beyond-ch415-curse-interrogation',
    'relationship:oito-kurapika-ch415-coded-contact',
    'relationship:kurapika-babimyna-ch415-postcard-handoff',
    'relationship:rihan-tubeppa-ch415-relocation-order',
    'relationship:ridge-kanjidol-ch415-custody-state',
    'relationship:seiko-fugetsu-ch415-protective-order',
    'relationship:biscuit-vergei-ch415-hold-space',
    'relationship:babimyna-oito-ch415-confinement',
  ];
  assert(relationshipIds.every((id) => archive.getEntityById(id)), 'all eight Chapter 415 canonical relationships must resolve');

  assert(!frozen414.publicationBoundary415, 'Through414 archive must remain frozen and unaware of Chapter 415');
  assert(activeArchive.publicationBoundary415?.chapter === 415, 'active archive must advance to Through415');
  assert(/another unidentified motive/i.test(text(activeArchive.publicationBoundary415)), 'active boundary must stop at Kurapika’s additional-motive inference');
  assert((dossier.successionChapterResearch || []).filter((record) => record.number === 415).length === 1, 'active dossier must expose Chapter 415 exactly once');
  assert(dossier.chapter415Research?.[0]?.number === 415, 'active dossier must expose strict Chapter 415 research');

  const publicTimeline = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 415 && event.maintainedResearch);
  assert(publicTimeline.length === 60, 'public timeline must expose all 60 maintained Chapter 415 beats');
  assert(/sole substantive story source/i.test(sourceNote) && /60 chapter-bounded events/i.test(sourceNote), 'source note must preserve controlling-source policy and event density');
  assert(/Voyage Day 12/i.test(sourceNote) && /eleventh day/i.test(sourceNote), 'source note must preserve the day-number correction');
  assert(/do not derive an exact clock minute/i.test(sourceNote), 'source note must forbid inventing a declaration clock minute');

  const laterOnly = /Moswana|TSK-17|shoots Tserriednich|shooting Tserriednich|breaches Room 1004|Benjamin enters Camilla|Dust in the Wind/i;
  assert(!laterOnly.test(timelineText), 'Chapter 416+ outcomes must stay outside the strict 415 event packet');

  console.log(`Chapter 415 boundary audit passed: ${dedicated.length} dedicated events plus ${projected.length} maintained projections preserve Combo Master, Day-12 chronology, Woble identity, postcard dispatch, martial-law state transitions, 12 character snapshots, eight relationships, and the Chapter 416+ firewall.`);
} finally {
  await vite.close();
}
