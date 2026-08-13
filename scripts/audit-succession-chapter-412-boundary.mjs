import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 412 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-412.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession412Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen411Dossier = await vite.ssrLoadModule('/src/data/successionDossierThrough411.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen411Archive = await vite.ssrLoadModule('/src/data/successionArchiveThrough411.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index410 = numbers.indexOf(410);
  assert(index410 >= 0 && numbers[index410 + 1] === 411 && numbers[index410 + 2] === 412, 'maintained publication chain must preserve 410 → 411 → 412');

  const chapter412 = chapterModule.succession412ChapterResearch?.[0];
  assert(chapter412?.number === 412, 'Chapter 412 maintained research must load');
  assert(chapter412.chronology?.presentationOrderNonLinear === true && /10:00 a\.m\./i.test(chapter412.chronology?.exactClockTime || ''), 'Chapter 412 must preserve non-linear chronology and 10:00 a.m. class return');
  assert(chapterModule.succession412TimelineEvents.length === 36, 'maintained research must preserve the curated 36-event Chapter 412 sequence');
  assert(chapter412.coverage?.identity === true && chapter412.coverage?.relationships === true && chapter412.coverage?.nen === true, 'Chapter 412 maintained research must advertise full integration coverage');

  const events412 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 412 && event.chapterRange?.end === 412);
  const projected412 = events412.filter((event) => event.maintainedResearch === true);
  const dedicated412 = events412.filter((event) => String(event.id || '').startsWith('event:chapter412-') && !event.maintainedResearch);
  assert(projected412.length === 36, 'story intelligence must project all 36 maintained Chapter 412 beats');
  assert(dedicated412.length === 36, 'Chapter 412 must expose 36 dedicated canonical events');

  assert(!frozen411Archive.publicationBoundary412, 'frozen Through411 archive must remain unaware of Chapter 412');
  assert(activeArchive.publicationBoundary412?.chapter === 412 && activeArchive.publicationBoundary412?.nonLinear === true, 'active archive must advance to Through412 with non-linear chronology');
  assert(/younger sister.*son|nephew/i.test(text(activeArchive.publicationBoundary412)) && /daughter Woble/i.test(text(activeArchive.publicationBoundary412)), 'publication boundary must preserve the nephew/daughter identity correction');
  assert(/1,047/i.test(text(activeArchive.publicationBoundary412)) && /dismiss|thrown out/i.test(text(activeArchive.publicationBoundary412)), 'publication boundary must preserve Beyond lawsuit count and dismissal state');

  const reveal = archive.getEntityById('event:chapter412-oito-reveals-nephew-and-daughter-swap');
  assert(/younger sister.*son|nephew/i.test(text(reveal)) && /daughter Woble/i.test(text(reveal)) && /does not know|unknown/i.test(text(reveal)), 'identity reveal must preserve unnamed nephew, daughter Woble and unknown location');
  const ceremony = archive.getEntityById('event:chapter412-oito-explains-seed-urn-departure-split');
  assert(/Seed Urn/i.test(text(ceremony)) && /departure/i.test(text(ceremony)), 'ceremony split event must preserve Seed Urn versus departure roles');
  const eligibility = archive.getEntityById('event:chapter412-oito-says-neither-child-is-eligible');
  assert(/neither/i.test(text(eligibility)) && /eligible/i.test(text(eligibility)), 'eligibility event must preserve Oito’s neither-child conclusion');
  const calibration = archive.getEntityById('event:chapter412-chain-baseline-and-forced-yes-calibration');
  assert(/baseline/i.test(text(calibration)) && /answer.*yes|instruct.*yes/i.test(text(calibration)), 'Dowsing Chain event must preserve calibrated baseline and instructed-yes procedure');
  const slakka = archive.getEntityById('event:chapter412-slakka-only-participant-not-returning');
  assert(/only/i.test(text(slakka)) && /does not return|not return/i.test(text(slakka)), 'Slakka event must preserve that he alone does not return');
  const beyondPlan = archive.getEntityById('event:chapter412-kurapika-considers-speaking-with-beyond');
  assert(/considers|wonders/i.test(text(beyondPlan)) && /no.*meeting|does not.*meet/i.test(text(beyondPlan)), 'Kurapika–Beyond route must remain consideration only');
  const lawsuits = archive.getEntityById('event:chapter412-beyond-lawsuit-count-1047-all-dismissed');
  assert(/1,047/i.test(text(lawsuits)) && /dismiss|thrown out/i.test(text(lawsuits)), 'Beyond legal event must preserve 1,047 dismissed lawsuits');
  const endpoint = archive.getEntityById('event:chapter412-saiyu-randomizes-documents-as-cleapatro-beyond-bicker');
  assert(/random/i.test(text(endpoint)) && /Cleapatro/i.test(text(endpoint)) && /Beyond/i.test(text(endpoint)), 'Chapter 412 endpoint must preserve random document handoff and continuing Cleapatro/Beyond exchange');

  const oito = archive.getCharacterStateAtChapter('character:oito-hui-guo-rou', 412);
  assert(/younger sister.*son|nephew/i.test(text(oito)) && /daughter Woble/i.test(text(oito)) && /unknown/i.test(text(oito)), 'Oito state must preserve verified child-swap disclosure and unknown daughter location');
  const woble = archive.getCharacterStateAtChapter('character:woble-hui-guo-rou', 412);
  assert(/not the infant|not.*aboard|different child/i.test(text(woble)) && /unknown/i.test(text(woble)), 'Woble state must distinguish Oito’s daughter from the cradle infant and retain unknown location');
  const kurapika = archive.getCharacterStateAtChapter('character:kurapika', 412);
  assert(/calibrat|Dowsing/i.test(text(kurapika)) && /Beyond/i.test(text(kurapika)) && /10:00/i.test(text(kurapika)), 'Kurapika state must preserve chain procedure, Beyond consideration and 10:00 class return');
  const beyond = archive.getCharacterStateAtChapter('character:beyond-netero', 412);
  assert(/1,047/i.test(text(beyond)) && /dismiss/i.test(text(beyond)) && /detain/i.test(text(beyond)), 'Beyond state must preserve detention and dismissed-lawsuit visit');

  const dowsingHistory = archive.getAbilityKnowledgeAtChapter('ability:dowsing-chain', 412);
  assert(/calibrat|baseline/i.test(text(dowsingHistory)) && /omnisc/i.test(text(dowsingHistory)) && /limitation|not.*omnisc/i.test(text(dowsingHistory)), 'Dowsing Chain knowledge must preserve calibration while explicitly rejecting omniscience');

  const eventText = text(chapterModule.succession412TimelineEvents);
  assert(!/Chapter 413(?!\+)|Chapter 414|Chapter 415|Chapter 416/i.test(eventText), 'Chapter 412 events must not import later-chapter outcomes');
  assert(/Chapter 413\+|413\+/i.test(text(chapterModule.succession412SourcePolicy)) && /quarant|excluded|not.*import/i.test(text(chapterModule.succession412SourcePolicy)), 'source policy must explicitly quarantine Chapter 413+');
  assert(!/proper name.*(?:is|=)|named nephew/i.test(eventText), 'events must not invent a proper name for Oito’s nephew');

  const publicTimeline412 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 412 && event.maintainedResearch);
  assert(publicTimeline412.length === 36, 'public timeline must expose all 36 maintained Chapter 412 beats');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 412/.test(group.group || '')), 'active dossier must include the Chapter 412 modernization group');
  assert(!(frozen411Dossier.guardAssignmentGroups || []).some((group) => /Chapter 412/.test(group.group || '')), 'frozen Through411 dossier must remain unaware of Chapter 412 group');
  assert(dossier.nenChapter412Research?.dowsingChainProcedure && /baseline|yes\/no/i.test(dossier.nenChapter412Research.dowsingChainProcedure), 'active dossier must expose Chapter 412 Dowsing Chain findings');

  const relationshipIds = new Set(archive.getEntitiesByType('relationship').filter((record) => record.chapterRange?.start === 412).map((record) => record.id));
  assert(relationshipIds.has('relationship:kurapika-oito-ch412-verified-child-swap-trust'), 'relationship graph must expose Kurapika → Oito verified trust');
  assert(relationshipIds.has('relationship:oito-woble-ch412-maternal-separation-concealment'), 'relationship graph must expose Oito → Woble separation/concealment');
  assert(relationshipIds.has('relationship:bill-kurapika-ch412-pronunciation-investigation'), 'relationship graph must expose Bill → Kurapika investigative support');
  assert(relationshipIds.has('relationship:cleapatro-beyond-ch412-dismissed-lawsuits-document-review'), 'relationship graph must expose Cleapatro → Beyond legal-document confrontation');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the supplied synopsis as sole substantive story source');
  assert(/forty-eight hours|48 hours/i.test(sourceNote) && /five hours/i.test(sourceNote), 'source note must preserve both chronology anchors');
  assert(/younger sister’s son|younger sister's son/i.test(sourceNote) && /daughter Woble/i.test(sourceNote) && /unnamed/i.test(sourceNote), 'source note must preserve unnamed-nephew identity boundary');
  assert(/omniscient/i.test(sourceNote) && /1,047/i.test(sourceNote) && /thrown out/i.test(sourceNote), 'source note must preserve Dowsing limitation and Beyond lawsuit result');
  assert(/Chapter 413\+/i.test(sourceNote), 'source note must preserve Chapter 413+ firewall');

  console.log(`Chapter 412 boundary audit passed: ${dedicated412.length} dedicated events plus ${projected412.length} maintained projections preserve the non-linear five-hour/forty-eight-hour chronology, Woble-nephew identity correction, calibrated Dowsing Chain verification, Slakka-only dropout, Kurapika strategic reset, 1,047 dismissed Beyond lawsuits, and Chapter 413+ spoiler firewall.`);
} finally {
  await vite.close();
}
