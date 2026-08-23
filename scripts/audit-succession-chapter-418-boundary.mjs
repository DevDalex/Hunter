import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition,message) => { if (!condition) throw new Error(`Chapter 418 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-418.md','utf8').replace(/\*\*/g,'');

const vite = await createServer({ appType:'custom',logLevel:'error',server:{ middlewareMode:true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapter = await vite.ssrLoadModule('/src/data/succession418Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen417 = await vite.ssrLoadModule('/src/data/successionArchiveThrough417.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');
  const latest = await vite.ssrLoadModule('/src/data/latestChapterMetadata.js');

  const research = chapter.succession418ChapterResearch?.[0];
  assert(research?.number===418,'strict Chapter 418 research record must load');
  assert(research?.titleStatus==='official-title-not-supplied','unverified title must remain generic');
  assert(research?.voyageDay==='Voyage Day 12','non-linear Chapter 418 material must remain anchored to Voyage Day 12');
  assert(chapter.succession418TimelineEvents.length===63,'research must contain 63 curated Chapter 418 beats');
  const chapterText = text(chapter.succession418TimelineEvents);
  assert(/2\.92/i.test(chapterText) && /water/i.test(chapterText) && /bottle/i.test(chapterText),'Zetsu timing and water-bottle experiment must load');
  assert(/remaining in Zetsu|keeps affected observers/i.test(chapterText),'sustained-Zetsu extension must load');
  assert(/three bullets|three rounds|crumple/i.test(chapterText),'Vantine gunfire interaction must load');
  assert(/Route A/i.test(chapterText) && /Route B/i.test(chapterText) && /Route C/i.test(chapterText),'Tier 1 route analysis must load');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index413 = numbers.indexOf(413);
  assert(index413>=0 && numbers.slice(index413,index413+6).join(',')==='413,414,415,416,417,418','maintained 413–418 chain must stay continuous');
  assert(Math.max(...numbers)===418,'maintained research must end at Chapter 418');
  assert(maintained.maintainedSuccessionChapterResearch.filter((record)=>record.number===418).length===1,'maintained catalogue must expose Chapter 418 exactly once');
  assert(latest.LATEST_PUBLISHED_CHAPTER===418 && latest.LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER===418,'latest chapter metadata must advance publication and detailed research to 418');
  assert(latest.getLatestChapterMetadata(418)?.releaseDate==='August 23, 2026','Chapter 418 release date must be retained');
  assert(latest.getLatestChapterMetadata(418)?.title===null,'official Chapter 418 title must remain unsupplied rather than invented');

  const events = archive.getEntitiesByType('event').filter((event)=>event.chapterRange?.start===418 && event.chapterRange?.end===418);
  const projected = events.filter((event)=>event.maintainedResearch===true);
  const dedicated = events.filter((event)=>String(event.id||'').startsWith('event:chapter418-') && !event.maintainedResearch);
  assert(projected.length===63,'all 63 maintained Chapter 418 beats must project into story intelligence');
  assert(dedicated.length===63,'all 63 dedicated Chapter 418 canonical event entities must exist');

  const tserriednich417 = archive.getCharacterStateAtChapter('character:tserriednich-hui-guo-rou',417);
  const tserriednich418 = archive.getCharacterStateAtChapter('character:tserriednich-hui-guo-rou',418);
  assert(tserriednich417?.life==='unknown','Chapter 417 snapshot must preserve the historical unresolved state');
  assert(tserriednich418?.life==='alive' && /concealed|escape/i.test(text(tserriednich418)),'Chapter 418 snapshot must resolve Tserriednich as alive and escaping');
  assert(archive.getCharacterStateAtChapter('character:salkov',418),'Salkov Chapter 418 state must resolve');
  assert(archive.getCharacterStateAtChapter('character:theta',418),'Theta Chapter 418 state must resolve');
  assert(archive.getCharacterStateAtChapter('character:vantine',418),'Vantine Chapter 418 state must resolve');
  assert(/misinformed|believes.*dead|execution/i.test(text(archive.getCharacterStateAtChapter('character:benjamin-hui-guo-rou',418))),'Benjamin state must preserve his false belief about Tserriednich');

  const parallel = archive.getAbilityKnowledgeAtChapter('ability:parallel-future',418);
  assert(parallel?.known && /sustained|remaining in Zetsu|post-ten-second/i.test(text(parallel)),'Parallel Future Chapter 418 sustained-Zetsu knowledge must resolve');
  assert(/unknown|hypoth|unverified/i.test(text(parallel)) && /range|radius|outside/i.test(text(parallel)),'Parallel Future range hypotheses must remain bounded');

  const relationshipIds = [
    'relationship:tserriednich-salkov-ch418-ability-test',
    'relationship:tserriednich-benjamin-ch418-staged-death',
    'relationship:tserriednich-theta-ch418-perception-ambiguity',
    'relationship:tserriednich-vantine-ch418-invisible-fire',
    'relationship:tserriednich-nasubi-ch418-coffin-delay',
  ];
  assert(relationshipIds.every((id)=>archive.getEntityById(id)),'all five Chapter 418 canonical relationships must resolve');

  const assignmentIds = [
    'assignment:salkov-ch418-exact-witness',
    'assignment:salkov-ch418-coffin-transport',
    'assignment:vantine-ch418-nonresistance',
    'assignment:tserriednich-ch418-route-a-escape',
  ];
  assert(assignmentIds.every((id)=>archive.getEntityById(id)),'all four Chapter 418 canonical assignments must resolve');

  const realityThread = archive.successionStoryIntelligence?.getStoryThreadDossier?.('story-thread:tserriednich-room1004-reality',418)
    || archive.getStoryThreadDossier?.('story-thread:tserriednich-room1004-reality',418);
  assert(realityThread && /resolved/i.test(text(realityThread)) && /418/.test(text(realityThread)),'Room 1004 reality story thread must resolve in Chapter 418');
  const escapeThread = archive.getStoryThreadDossier?.('story-thread:tserriednich-route-a-escape',418);
  assert(escapeThread && /Route A/i.test(text(escapeThread)),'Route A escape story thread must be live');

  assert(!frozen417.publicationBoundary418,'Through417 archive must remain frozen and unaware of Chapter 418');
  assert(activeArchive.publicationBoundary418?.chapter===418,'active archive must advance to Through418');
  assert(activeArchive.publicationBoundary418?.nonLinear===true,'active Chapter 418 boundary must preserve non-linear chronology');
  assert(/Theta/i.test(text(activeArchive.publicationBoundary418)) && /Route A/i.test(text(activeArchive.publicationBoundary418)),'active boundary must stop on the Theta/Route A escape endpoint');
  assert((dossier.successionChapterResearch || []).filter((record)=>record.number===418).length===1,'active dossier must expose Chapter 418 exactly once');
  assert(dossier.chapter418Research?.[0]?.number===418,'active dossier must expose strict Chapter 418 research');

  const publicTimeline = timeline.successionDays.flatMap((day)=>day.events).filter((event)=>event.chapter===418 && event.maintainedResearch);
  assert(publicTimeline.length===63,'public timeline must expose all 63 maintained Chapter 418 beats');
  assert(/sole substantive story source/i.test(sourceNote) && /63 chapter-bounded beats/i.test(sourceNote),'source note must preserve source policy and event density');
  assert(/current publication ceiling/i.test(sourceNote) && /Chapter 419/i.test(sourceNote),'source note must preserve the Chapter 418 publication ceiling');
  assert(/hypotheses/i.test(sourceNote) && /Theta.*ambiguous/i.test(sourceNote),'source note must preserve inference and Theta boundaries');

  console.log(`Chapter 418 boundary audit passed: ${dedicated.length} dedicated events plus ${projected.length} maintained projections preserve the 63-beat non-linear reveal, alive Tserriednich state, Parallel Future expansion, five relationships, four assignments, and Route A publication endpoint.`);
} finally {
  await vite.close();
}
