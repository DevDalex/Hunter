import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition,message) => { if (!condition) throw new Error(`Chapter 417 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-417.md','utf8').replace(/\*\*/g,'');

const vite = await createServer({ appType:'custom',logLevel:'error',server:{ middlewareMode:true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapter = await vite.ssrLoadModule('/src/data/succession417Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen416 = await vite.ssrLoadModule('/src/data/successionArchiveThrough416.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');
  const latest = await vite.ssrLoadModule('/src/data/latestChapterMetadata.js');

  const research = chapter.succession417ChapterResearch?.[0];
  assert(research?.number===417,'strict Chapter 417 record must load');
  assert(research?.titleStatus==='official-title-not-supplied','Chapter 417 must not invent an official title');
  assert(research?.voyageDay==='Voyage Day 12','Chapter 417 must remain on Voyage Day 12');
  assert(chapter.succession417TimelineEvents.length===74,'research must contain 74 curated Chapter 417 beats');
  const timelineText = text(chapter.succession417TimelineEvents);

  assert(/tears through Tserriednich’s abdomen|tears through Tserriednich/i.test(timelineText),'Room 1004 bullet impact must be present');
  assert(/questions whether the body is fake|illusion/i.test(timelineText) && /Theta’s scar|Theta.*scar/i.test(timelineText),'Salkov reality uncertainty and Theta-scar test must be preserved');
  assert(/Central Justice Bureau/i.test(timelineText) && /seventh floor/i.test(timelineText),'Salkov/Danjin detention and Justice headquarters takeover must be present');
  assert(/second dose of TSK-17/i.test(timelineText) && /covertly disperses TSK-17/i.test(timelineText),'second TSK-17 dose and Room 1001 dispersal must be present');
  assert(/Zhang Lei and Luzurus fled/i.test(timelineText),'Zhang Lei and Luzurus flight report must be present');
  assert(/Ridge assaulted Kanjidol|Ridge.*Kanjidol/i.test(timelineText) && /Hunter Association/i.test(timelineText),'Ridge/Kanjidol report and Association leverage must be present');
  assert(/Balsamilco was found unconscious|Balsamilco is recovered/i.test(timelineText) && /identity verified/i.test(timelineText),'Balsamilco recovery and identity verification must be present');
  assert(/Halkenburg somehow transferred out|transferred out of Balsamilco/i.test(timelineText),'Benjamin Halkenburg-transfer inference must be present as an inference');
  assert(/Kurapika’s monarchy-collapse hypothesis|Kurapika.*hypothesis/i.test(timelineText),'Kurapika hypothesis discussion must be present');
  assert(/use Gyo|orders both men to use Gyo/i.test(timelineText) && /half a day to live/i.test(timelineText),'Gyo inspection and Benjamin half-day self-disclosure must be present');
  assert(/feather on the back of the hand|feather-mark/i.test(timelineText),'Balsamilco feather investigation must be present');
  assert(/value reaches 10|value 10/i.test(timelineText),'Coventoba value-10 coin report must be present');
  assert(/Secret Window/i.test(timelineText) && /medical department/i.test(timelineText),'Benjamin Secret Window use must be present');
  assert(/13–19 hours|13-19 hours/i.test(timelineText),'Benjamin Camilla death-window projection must be preserved as his assessment');
  assert(/Gypsy Life: Bohemian Rhapsody/i.test(timelineText) && /fuses with Benjamin Baton/i.test(timelineText) && /alternates/i.test(timelineText),'Gypsy Life fusion and alternating host-selection mechanics must be present');
  assert(/force Unma to choose|choose between her own life and.*Halkenburg/i.test(timelineText),'strict Chapter 417 Unma/Halkenburg endpoint must be present');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index412 = numbers.indexOf(412);
  assert(index412>=0 && numbers.slice(index412,index412+6).join(',')==='412,413,414,415,416,417','maintained 412–417 chain must stay continuous');
  assert(Math.max(...numbers)===417,'maintained research must stop at the current Chapter 417 publication ceiling');
  assert(maintained.maintainedSuccessionChapterResearch.filter((record)=>record.number===417).length===1,'maintained catalogue must expose Chapter 417 exactly once');
  assert(latest.LATEST_PUBLISHED_CHAPTER===417 && latest.LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER===417,'latest chapter metadata must advance to 417');
  assert(latest.getLatestChapterMetadata(417)?.title===null,'official Chapter 417 title must remain unsupplied rather than invented');

  const events = archive.getEntitiesByType('event').filter((event)=>event.chapterRange?.start===417 && event.chapterRange?.end===417);
  const projected = events.filter((event)=>event.maintainedResearch===true);
  const dedicated = events.filter((event)=>String(event.id||'').startsWith('event:chapter417-') && !event.maintainedResearch);
  assert(projected.length===74,'all 74 maintained beats must project into story intelligence');
  assert(dedicated.length===74,'all 74 dedicated Chapter 417 canonical events must exist');

  const gypsy = archive.getEntityById('ability:gypsy-life-bohemian-rhapsody');
  assert(gypsy?.latestChapter===417 && /Benjamin Baton/i.test(text(gypsy)) && /blood relatives/i.test(text(gypsy)),'Gypsy Life canonical ability must load');
  assert(/alternat/i.test(text(gypsy)) && /not yet activated|not actually activated|no actual/i.test(text(gypsy)),'Gypsy Life must preserve alternating selection and no-activation boundary');
  const gypsyKnowledge = archive.getAbilityKnowledgeAtChapter('ability:gypsy-life-bohemian-rhapsody',417);
  assert(/blood relative/i.test(text(gypsyKnowledge)) && /alternat/i.test(text(gypsyKnowledge)),'Gypsy Life Chapter 417 knowledge record must resolve');
  const secretKnowledge = archive.getAbilityKnowledgeAtChapter('ability:secret-window',417);
  assert(/Camilla/i.test(text(secretKnowledge)) && /medical department/i.test(text(secretKnowledge)),'Secret Window inherited use must resolve at Chapter 417');
  const batonKnowledge = archive.getAbilityKnowledgeAtChapter('ability:benjamin-baton',417);
  assert(/Gypsy Life/i.test(text(batonKnowledge)) && /after Benjamin.*death/i.test(text(batonKnowledge)),'Benjamin Baton future fusion interaction must resolve');

  const stateIds = ['benjamin-hui-guo-rou','tserriednich-hui-guo-rou','salkov','danjin','tubeppa-hui-guo-rou','tyson-hui-guo-rou','camilla-hui-guo-rou','coventoba','balsamilco-might','chiyamasi','zhang-lei-hui-guo-rou','luzurus-hui-guo-rou','unma-hui-guo-rou'];
  assert(stateIds.every((slug)=>archive.getCharacterStateAtChapter(`character:${slug}`,417)),'all 13 Chapter 417 state snapshots must resolve');
  const tserriednichState = archive.getCharacterStateAtChapter('character:tserriednich-hui-guo-rou',417);
  assert(tserriednichState?.life==='unknown' && /reality.*unresolved|scene reality/i.test(text(tserriednichState)),'Tserriednich must remain unresolved rather than omnisciently dead');
  assert(archive.getCharacterStateAtChapter('character:tubeppa-hui-guo-rou',417)?.operationalState?.includes('TSK-17'),'Tubeppa TSK-17 state must resolve');
  assert(archive.getCharacterStateAtChapter('character:tyson-hui-guo-rou',417)?.operationalState?.includes('TSK-17'),'Tyson TSK-17 state must resolve');

  const relationshipIds = [
    'relationship:benjamin-salkov-ch417-testimony-custody','relationship:benjamin-danjin-ch417-detention','relationship:benjamin-tubeppa-ch417-tsk17-control','relationship:benjamin-tyson-ch417-tsk17-control','relationship:benjamin-balsamilco-ch417-first-unit-reactivation','relationship:benjamin-coventoba-ch417-first-unit-reactivation','relationship:balsamilco-halkenburg-ch417-feather-investigation','relationship:benjamin-camilla-ch417-surveillance-framing','relationship:benjamin-unma-ch417-planned-confrontation','relationship:benjamin-halkenburg-ch417-elimination-pressure',
  ];
  assert(relationshipIds.every((id)=>archive.getEntityById(id)),'all ten Chapter 417 canonical relationships must resolve');

  assert(!frozen416.publicationBoundary417,'Through416 archive must remain frozen and unaware of Chapter 417');
  assert(activeArchive.publicationBoundary417?.chapter===417,'active archive must advance to Through417');
  assert(/publication ceiling/i.test(text(activeArchive.publicationBoundary417)) && /Unma/i.test(text(activeArchive.publicationBoundary417)) && /Halkenburg/i.test(text(activeArchive.publicationBoundary417)),'active boundary must stop on the Unma/Halkenburg publication-ceiling endpoint');
  assert((dossier.successionChapterResearch || []).filter((record)=>record.number===417).length===1,'active dossier must expose Chapter 417 exactly once');
  assert(dossier.chapter417Research?.[0]?.number===417,'active dossier must expose strict Chapter 417 research');

  const publicTimeline = timeline.successionDays.flatMap((day)=>day.events).filter((event)=>event.chapter===417 && event.maintainedResearch);
  assert(publicTimeline.length===74,'public timeline must expose all 74 maintained Chapter 417 beats');
  assert(/sole substantive story source/i.test(sourceNote) && /74 chapter-bounded events/i.test(sourceNote),'source note must preserve controlling-source policy and event density');
  assert(/current publication ceiling/i.test(sourceNote),'source note must preserve the Chapter 417 publication ceiling');
  assert(/alternates/i.test(sourceNote) && /Viz/i.test(sourceNote),'source note must preserve the Gypsy Life translation discrepancy and alternating selector rule');
  assert(/do not invent/i.test(sourceNote) && /Unma/i.test(sourceNote),'source note must forbid post-endpoint invention');

  console.log(`Chapter 417 boundary audit passed: ${dedicated.length} dedicated events plus ${projected.length} maintained projections preserve the 74-beat publication ceiling, 13 character snapshots, ten relationships, Gypsy Life mechanics, TSK-17 operations, Salkov reality uncertainty, and the Unma/Halkenburg endpoint.`);
} finally {
  await vite.close();
}
