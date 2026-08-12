import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 411 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-411.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession411Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen410Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough410.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen410Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough410.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index409 = numbers.indexOf(409);
  assert(index409 >= 0 && numbers[index409 + 1] === 410 && numbers[index409 + 2] === 411, 'maintained publication chain must preserve 409 → 410 → 411');

  const chapter411 = chapterModule.succession411ChapterResearch?.[0];
  assert(chapter411?.number === 411, 'Chapter 411 maintained research must load');
  assert(chapter411.chronology?.exactClockTime === '8:00 a.m.' && chapter411.chronology?.presentationOrderNonLinear === true, 'Chapter 411 must preserve the 8:00 a.m. non-linear chronology');
  assert(chapterModule.succession411TimelineEvents.length === 26, 'maintained research must preserve the curated 26-event Chapter 411 sequence');

  const events411 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 411 && event.chapterRange?.end === 411);
  const projected411 = events411.filter((event) => event.maintainedResearch === true);
  const dedicated411 = events411.filter((event) => String(event.id || '').startsWith('event:chapter411-') && !event.maintainedResearch);
  assert(projected411.length === 26, 'story intelligence must project all 26 maintained Chapter 411 beats');
  assert(dedicated411.length === 26, 'Chapter 411 must expose 26 dedicated canonical events');

  assert(!frozen410Archive.publicationBoundary411, 'frozen Through410 archive must remain unaware of Chapter 411');
  assert(activeArchive.publicationBoundary411?.chapter === 411 && activeArchive.publicationBoundary411?.nonLinear === true, 'active archive must advance to Through411 with non-linear chronology');
  assert(/8:00 a\.m\./i.test(text(activeArchive.publicationBoundary411)) && /Woble.*ineligible/i.test(text(activeArchive.publicationBoundary411)), 'publication boundary must preserve opening clock and final declaration');

  const call = archive.getEntityById('event:chapter411-halkenburg-in-balsamilco-calls-benjamin-at-eight');
  assert(/Balsamilco/i.test(text(call)) && /8:00 a\.m\./i.test(text(call)) && /Halkenburg/i.test(text(call)), 'opening event must preserve Halkenburg-in-Balsamilco impersonation at 8:00 a.m.');

  const kacho = archive.getCharacterStateAtChapter('character:kacho-hui-guo-rou', 411);
  assert(/post-death|postdeath|construct/i.test(text(kacho)) && /deceased/i.test(text(kacho)), 'Kacho state must preserve deceased-human/post-death-construct distinction');
  const halkenburg = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 411);
  assert(/Balsamilco/i.test(text(halkenburg)) && /transferred|body/i.test(text(halkenburg)), 'Halkenburg state must preserve operation through Balsamilco’s body');
  const sarahell = archive.getCharacterStateAtChapter('character:sarahell', 411);
  assert(/maid|disguis/i.test(text(sarahell)) && /exorc/i.test(text(sarahell)) && /five|5/i.test(text(sarahell)), 'Sarahell state must preserve disguise, exorcist uncertainty and five-day object-assisted estimate');
  const kurapika = archive.getCharacterStateAtChapter('character:kurapika', 411);
  assert(/theory|analysis|propos/i.test(text(kurapika)) && /Woble.*ineligible|ineligible.*Woble/i.test(text(kurapika)), 'Kurapika state must preserve theory attribution and Woble declaration');

  const assassination = archive.getEntityById('event:chapter411-kurapika-suspects-halkenburg-assassination-without-proof');
  assert(/no proof|lack.*proof|without proof/i.test(text(assassination)), 'Kurapika assassination theory must retain explicit lack of proof');
  const ritual = archive.getEntityById('event:chapter411-kurapika-proposes-four-stage-kakin-ritual');
  assert(/four-stage|four.*stage|four proposed stages/i.test(text(ritual)) && /Kurapika/i.test(text(ritual)) && /propos|theory|analysis/i.test(text(ritual)), 'ritual event must remain a Kurapika-proposed four-stage model');
  const failure = archive.getEntityById('event:chapter411-kurapika-says-multiple-survivor-failure-option-must-remain');
  assert(/multiple|more than one/i.test(text(failure)) && /limitation/i.test(text(failure)), 'multiple-survivor failure-option theory must be preserved');
  const endpoint = archive.getEntityById('event:chapter411-kurapika-declares-woble-ineligible-oito-awake');
  assert(/ineligible/i.test(text(endpoint)) && /Oito/i.test(text(endpoint)) && /awake|eyes wide/i.test(text(endpoint)), 'Chapter 411 endpoint must preserve Woble declaration and Oito reaction');

  const eventText = text(chapterModule.succession411TimelineEvents);
  assert(!/Chapter 412(?!\+)|Chapter 413|Chapter 414|Chapter 415|Chapter 416/i.test(eventText), 'Chapter 411 events must not import later-chapter outcomes');
  assert(/Chapter 412\+|412\+/i.test(text(chapterModule.succession411SourcePolicy)) && /quarant|excluded|not.*import/i.test(text(chapterModule.succession411SourcePolicy)), 'source policy must explicitly quarantine Chapter 412+');

  const publicTimeline411 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 411 && event.maintainedResearch);
  assert(publicTimeline411.length === 26, 'public timeline must expose all 26 maintained Chapter 411 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 411/.test(group.group || '')), 'active dossier must include the Chapter 411 modernization group');
  assert(!(frozen410Dossier.guardAssignmentGroups || []).some((group) => /Chapter 411/.test(group.group || '')), 'frozen Through410 dossier must remain unaware of Chapter 411 group');
  assert(dossier.nenChapter411Research?.ritualTheory && /Kurapika/i.test(dossier.nenChapter411Research.ritualTheory), 'active dossier must expose theory-bounded Chapter 411 Nen findings');

  const relationshipIds = new Set(archive.getEntitiesByType('relationship').filter((record) => record.chapterRange?.start === 411).map((record) => record.id));
  assert(relationshipIds.has('relationship:halkenburg-benjamin-ch411-balsamilco-impersonation'), 'relationship graph must expose Halkenburg → Benjamin impersonation');
  assert(relationshipIds.has('relationship:sarahell-woble-ch411-covert-curse-infiltration'), 'relationship graph must expose Sarahell → Woble covert targeting');
  assert(relationshipIds.has('relationship:kurapika-woble-ch411-defense-and-ineligibility-declaration'), 'relationship graph must expose Kurapika → Woble Chapter 411 state');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the supplied synopsis as sole substantive story source');
  assert(/8:00 a\.m\./i.test(sourceNote) && /non-linear/i.test(sourceNote), 'source note must preserve non-linear 8:00 a.m. chronology');
  assert(/post-death Nen construct/i.test(sourceNote) && /not revived/i.test(sourceNote), 'source note must preserve Kacho construct boundary');
  assert(/Kurapika.*theory|Kurapika’s theory/i.test(sourceNote) && /not narrator-certified/i.test(sourceNote), 'source note must preserve Kurapika theory attribution');
  assert(/Woble ineligible/i.test(sourceNote) && /Chapter 412\+/i.test(sourceNote), 'source note must preserve terminal Woble declaration and 412+ firewall');

  console.log(`Chapter 411 boundary audit passed: ${dedicated411.length} dedicated events plus ${projected411.length} maintained projections preserve the 8:00 a.m. non-linear opening, Halkenburg/Balsamilco and Kacho construct identity boundaries, Sarahell infiltration, eighteen-person Nen lesson, Kurapika theory attribution, Woble-ineligible endpoint, and Chapter 412+ spoiler firewall.`);
} finally {
  await vite.close();
}
