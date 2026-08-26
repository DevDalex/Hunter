import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 413 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-413.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession413Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen412Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough412.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index410 = numbers.indexOf(410);
  assert(index410 >= 0 && numbers.slice(index410, index410 + 7).join(',') === '410,411,412,413,414,415,416', 'maintained chain must be continuous from 410 through 416');

  const chapter413 = chapterModule.succession413ChapterResearch?.[0];
  assert(chapter413?.number === 413, 'Chapter 413 maintained research must load');
  assert(chapterModule.succession413TimelineEvents.length === 58, 'maintained research must preserve 58 curated Chapter 413 beats');
  assert(/1:45 p\.m\./i.test(text(chapter413.chronology)) && /2:00 p\.m\./i.test(text(chapter413.chronology)) && /2:15 p\.m\./i.test(text(chapter413.chronology)), 'chronology must preserve 1:45, 2:00 and scheduled 2:15 anchors');

  const events413 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 413 && event.chapterRange?.end === 413);
  const projected413 = events413.filter((event) => event.maintainedResearch === true);
  const dedicated413 = events413.filter((event) => String(event.id || '').startsWith('event:chapter413-') && !event.maintainedResearch);
  assert(projected413.length === 58, 'story intelligence must project all 58 maintained beats');
  assert(dedicated413.length === 58, 'canonical graph must expose all 58 dedicated events');

  assert(!frozen412Archive.publicationBoundary413, 'frozen Through412 archive must remain unaware of Chapter 413');
  assert(activeArchive.publicationBoundary413?.chapter === 413, 'active archive must retain the Through413 boundary inside later publication layers');
  assert(/2:00 p\.m\./i.test(text(activeArchive.publicationBoundary413)) && /2:15 p\.m\./i.test(text(activeArchive.publicationBoundary413)), 'active boundary must distinguish preparation from scheduled declaration');

  const halkenburg = archive.getCharacterStateAtChapter('character:halkenburg-hui-guo-rou', 413);
  assert(/original body deceased|original body no longer active/i.test(text(halkenburg)) && /Balsamilco/i.test(text(halkenburg)), 'Halkenburg state must preserve original-body and transferred-consciousness separation');
  const benjamin = archive.getCharacterStateAtChapter('character:benjamin-hui-guo-rou', 413);
  assert(/2:15 p\.m\./i.test(text(benjamin)) && /2:00 p\.m\./i.test(text(benjamin)) && /Secret Window/i.test(text(benjamin)), 'Benjamin state must preserve the command schedule and Secret Window update');
  const furykov = archive.getCharacterStateAtChapter('character:furykov', 413);
  assert(/Beyond/i.test(text(furykov)) && /forty-eight-hour|48/i.test(text(furykov)) && /Combo Master/i.test(text(furykov)), 'Furykov state must preserve lineage, ultimatum and Combo Master boundary');

  const combo = archive.getEntityById('ability:combo-master');
  assert(combo?.name === 'Combo Master' && /Furykov/i.test(text(combo.ownerIds)), 'Combo Master must exist with Furykov ownership');
  const combo413 = archive.getAbilityKnowledgeAtChapter('ability:combo-master', 413);
  assert(/mechanics unavailable|does not infer|unknown/i.test(text(combo413)) && !/guaranteed|automatic victory/i.test(text(combo413)), 'Combo Master Chapter 413 knowledge must remain name/owner only even though later chapters expand the live ability entity');
  const secretWindow = archive.getEntityById('ability:secret-window');
  const secretWindow413 = archive.getAbilityKnowledgeAtChapter('ability:secret-window', 413);
  assert(secretWindow?.latestChapter >= 413 && /pre-death visual|before death|prior visual|what Musse had seen/i.test(text(secretWindow413)), 'Secret Window must preserve the Chapter 413 inherited knowledge expansion while allowing later chapter knowledge');

  const nasubiEdge = archive.getEntityById('relationship:nasubi-halkenburg-ch413-soul-eligibility');
  const furykovEdge = archive.getEntityById('relationship:furykov-benjamin-ch413-coercion-restored-trust');
  assert(nasubiEdge && furykovEdge, 'Chapter 413 canonical relationships must be present');

  const researchText = text(chapterModule.succession413TimelineEvents);
  assert(/Flame of Life/i.test(researchText) && /soul resides|soul.*body/i.test(researchText), 'royal burial evidence must preserve Flame and soul-in-body statements');
  assert(/arrow has already|already been fired/i.test(researchText) && /result.*not|impact.*not|unresolved/i.test(researchText), 'new Halkenburg experiment must stop before its result');
  assert(/1,047/.test(text(dossier)) || dossier.chapter413Research?.[0]?.number === 413, 'active dossier must expose Chapter 413 research while retaining prior dossier data');

  const publicTimeline413 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 413 && event.maintainedResearch);
  assert(publicTimeline413.length === 58, 'public timeline must expose all 58 maintained Chapter 413 beats');

  assert(/sole substantive story source/i.test(sourceNote) && /58 chapter-bounded events/i.test(sourceNote), 'source note must preserve source policy and event density');
  assert(/2:15 p\.m\./i.test(sourceNote) && /does not.*formal|does not contain.*formal/i.test(sourceNote), 'source note must quarantine the later formal declaration');
  assert(/Combo Master/i.test(sourceNote) && /name and owner only|name.*owner only/i.test(sourceNote), 'source note must preserve Combo Master name-only boundary');

  const laterOnly = /Luzurus.*countermeasure|postcard|Tubeppa.*relocat|Oito.*confinement/i;
  assert(!laterOnly.test(researchText), 'Chapter 413 maintained events must not import later-only outcomes');

  console.log(`Chapter 413 boundary audit passed: ${dedicated413.length} dedicated events plus ${projected413.length} maintained projections preserve the burial-status evidence, transferred-consciousness boundary, Furykov disclosures, historical Combo Master and Secret Window knowledge, timed pre-declaration operation, and Chapter 414+ firewall.`);
} finally {
  await vite.close();
}
