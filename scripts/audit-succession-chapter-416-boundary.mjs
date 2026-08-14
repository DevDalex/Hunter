import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition,message) => { if (!condition) throw new Error(`Chapter 416 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-416.md','utf8').replace(/\*\*/g,'');

const vite = await createServer({ appType:'custom',logLevel:'error',server:{ middlewareMode:true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapter = await vite.ssrLoadModule('/src/data/succession416Research.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const frozen415 = await vite.ssrLoadModule('/src/data/successionArchiveThrough415.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const research = chapter.succession416ChapterResearch?.[0];
  assert(research?.number===416 && research?.title==='Proclamation','strict Chapter 416 record and retained title must load');
  assert(research?.voyageDay==='Voyage Day 12','Chapter 416 must remain on Voyage Day 12');
  assert(chapter.succession416TimelineEvents.length===60,'research must contain 60 curated Chapter 416 beats');
  const timelineText = text(chapter.succession416TimelineEvents);
  assert(/ten hours/i.test(timelineText) && /incapacitated/i.test(timelineText),'Benjamin ten-hour internal deadline must be present');
  assert(/Ken stops|bounce off Benjamin’s Ken|bullets bounce/i.test(timelineText),'Benjamin Ken defense must be present');
  assert(/Fukataki/i.test(timelineText) && /unnamed attendant|second servant/i.test(timelineText),'both servant deaths must be preserved without fabricating the unnamed servant');
  assert(/Dust in the Wind: Hell Fruit/i.test(timelineText) && /ghostly hand/i.test(timelineText) && /pupils/i.test(timelineText),'Hell Fruit activation and visible curse manifestation must be present');
  assert(/ten-year plan/i.test(timelineText),'Camilla ten-year-plan statement must be preserved');
  assert(/infects Camilla with TSK-17/i.test(timelineText),'Camilla TSK-17 infection must be present');
  assert(/disease would count as the killer|disease would have enough aura|killer.*aura/i.test(timelineText),'Benjamin disease/counter hypothetical must be preserved');
  assert(/fake his own death|feign his death/i.test(timelineText) && /secure his body/i.test(timelineText) && /keep his ability secret/i.test(timelineText),'Tserriednich staged-death contingency must be preserved');
  assert(/Salkov infers Zetsu|Zetsu activates Tserriednich/i.test(timelineText),'Salkov Zetsu-trigger inference must be present');
  assert(/Room 1014 student/i.test(timelineText) && /Ministry of Justice/i.test(timelineText),'Danjin student identification and questioning order must be present');
  assert(/recruiting Kurapika|Kurapika to teach his army/i.test(timelineText),'Benjamin Kurapika-instructor thought must be preserved as a thought');
  assert(/shoots Tserriednich|fires his blaster/i.test(timelineText) && /flying across the master bedroom|blasted across/i.test(timelineText),'Tserriednich shooting cliff-edge must be present');
  assert(/condition.*unresolved|immediate condition.*unresolved/i.test(timelineText),'Tserriednich immediate condition must remain unresolved');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index411 = numbers.indexOf(411);
  assert(index411>=0 && numbers.slice(index411,index411+6).join(',')==='411,412,413,414,415,416','maintained 411–416 chain must stay continuous');
  assert(maintained.maintainedSuccessionChapterResearch.filter((record)=>record.number===416).length===1,'maintained catalogue must expose Chapter 416 exactly once');

  const events = archive.getEntitiesByType('event').filter((event)=>event.chapterRange?.start===416 && event.chapterRange?.end===416);
  const projected = events.filter((event)=>event.maintainedResearch===true);
  const dedicated = events.filter((event)=>String(event.id||'').startsWith('event:chapter416-') && !event.maintainedResearch);
  assert(projected.length===60,'all 60 maintained beats must project into story intelligence');
  assert(dedicated.length===60,'all 60 dedicated Chapter 416 canonical events must exist');

  const hellFruit = archive.getEntityById('ability:dust-in-the-wind-hell-fruit');
  assert(hellFruit?.firstChapter===416 && hellFruit?.latestChapter>=416 && /Moswana/i.test(text(hellFruit)) && /ghostly hand/i.test(text(hellFruit)),'Hell Fruit canonical ability must retain its Chapter 416 manifestation while allowing later knowledge');
  const hellKnowledge = archive.getAbilityKnowledgeAtChapter('ability:dust-in-the-wind-hell-fruit',416);
  assert(/post-mortem curse activation/i.test(text(hellKnowledge)) && /final.*unresolved/i.test(text(hellKnowledge)),'Hell Fruit Chapter 416 knowledge record must preserve the unresolved final effect');
  const catsKnowledge = archive.getAbilityKnowledgeAtChapter('ability:cats-name',416);
  assert(/disease/i.test(text(catsKnowledge)) && /does not resolve/i.test(text(catsKnowledge)),'Cat’s Name disease edge case must remain unresolved at Chapter 416');
  const futureKnowledge = archive.getAbilityKnowledgeAtChapter('ability:parallel-future',416);
  assert(/Salkov/i.test(text(futureKnowledge)) && /infer/i.test(text(futureKnowledge)),'Parallel Future record must preserve Salkov inference rather than omniscient mechanics');

  assert(archive.getEntityById('character:mozbe')?.name==='Mozbe','Mozbe canonical character node must resolve');
  const stateIds = ['benjamin-hui-guo-rou','camilla-hui-guo-rou','moswana','fukataki','furykov','butch','tserriednich-hui-guo-rou','salkov','danjin'];
  assert(stateIds.every((slug)=>archive.getCharacterStateAtChapter(`character:${slug}`,416)),'all nine Chapter 416 state snapshots must resolve');
  assert(archive.getCharacterStateAtChapter('character:moswana',416)?.life==='dead','Moswana must be dead after terminal activation');
  assert(archive.getCharacterStateAtChapter('character:fukataki',416)?.life==='dead','Fukataki must be dead after Benjamin’s gunfire');

  const relationshipIds = [
    'relationship:benjamin-camilla-ch416-armed-confrontation','relationship:moswana-benjamin-ch416-hell-fruit','relationship:camilla-moswana-ch416-ten-year-plan','relationship:benjamin-furykov-ch416-assault-command','relationship:benjamin-butch-ch416-assault-command','relationship:tserriednich-salkov-ch416-staged-death','relationship:benjamin-danjin-ch416-questioning-order','relationship:benjamin-tserriednich-ch416-shooting',
  ];
  assert(relationshipIds.every((id)=>archive.getEntityById(id)),'all eight Chapter 416 canonical relationships must resolve');

  assert(!frozen415.publicationBoundary416,'Through415 archive must remain frozen and unaware of Chapter 416');
  assert(activeArchive.publicationBoundary416?.chapter===416,'active archive must retain the Through416 publication boundary inside the later active layer');
  assert(/blasted across the room|shot/i.test(text(activeArchive.publicationBoundary416)) && /unresolved/i.test(text(activeArchive.publicationBoundary416)),'Chapter 416 boundary must stop on the unresolved Tserriednich gunshot cliff-edge');
  assert((dossier.successionChapterResearch || []).filter((record)=>record.number===416).length===1,'active dossier must expose Chapter 416 exactly once');
  assert(dossier.chapter416Research?.[0]?.number===416,'active dossier must expose strict Chapter 416 research');

  const publicTimeline = timeline.successionDays.flatMap((day)=>day.events).filter((event)=>event.chapter===416 && event.maintainedResearch);
  assert(publicTimeline.length===60,'public timeline must expose all 60 maintained Chapter 416 beats');
  assert(/sole substantive story source/i.test(sourceNote) && /60 chapter-bounded events/i.test(sourceNote),'source note must preserve controlling-source policy and event density');
  assert(/Chapter 417\+ firewall/i.test(sourceNote),'source note must preserve Chapter 417+ firewall');
  assert(/immediate condition.*unresolved|staged-death result.*unresolved/i.test(sourceNote),'source note must keep the shooting endpoint unresolved');

  const laterOnly = /Chapter 417.*confirms|after the Chapter 416 shot.*survives|TSK-17.*kills Camilla|Hell Fruit.*kills Benjamin/i;
  assert(!laterOnly.test(timelineText),'Chapter 417+ outcomes must stay outside the strict 416 event packet');

  console.log(`Chapter 416 boundary audit passed: ${dedicated.length} dedicated events plus ${projected.length} maintained projections preserve historical Hell Fruit knowledge, TSK-17 uncertainty, Room 1004, nine character snapshots, eight relationships, and the Chapter 417+ firewall.`);
} finally {
  await vite.close();
}
