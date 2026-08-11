import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => { if (!condition) throw new Error(`Chapter 405 boundary audit failed: ${message}`); };
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-405.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession405Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen404 = await vite.ssrLoadModule('/src/data/successionDossierThrough404.js');
  const activeArchive = await vite.ssrLoadModule('/src/data/successionArchive.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index400 = numbers.indexOf(400);
  assert(index400 >= 0 && numbers[index400 + 1] === 401 && numbers[index400 + 2] === 402 && numbers[index400 + 3] === 403 && numbers[index400 + 4] === 404 && numbers[index400 + 5] === 405 && numbers[index400 + 6] === 406, 'maintained publication chain must be 400 → 401 → 402 → 403 → 404 → 405 → 406');

  const chapter405 = chapterModule.succession405ChapterResearch?.[0];
  assert(chapter405?.number === 405, 'Chapter 405 maintained research must load');
  assert(chapter405.title === null && /not-supplied/i.test(chapter405.titleStatus), 'Chapter 405 must not invent or backfill a title');
  assert(chapter405.chronology?.presentDay === true && chapter405.chronology?.flashback === true && chapter405.chronology?.presentationOrderNonLinear === true, 'Chapter 405 must preserve non-linear present/retrospective chronology');
  assert(JSON.stringify(chapter405.chronology?.spansDays) === JSON.stringify([10, 12]), 'Chapter 405 chronology must separate Day 10 retrospective material from Day 12 present material');
  assert(chapterModule.succession405TimelineEvents.length === 34, 'maintained research must preserve all 34 Chapter 405 beats');

  const events405 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 405 && event.chapterRange?.end === 405);
  const projected405 = events405.filter((event) => event.maintainedResearch === true);
  const dedicated405 = events405.filter((event) => String(event.id || '').startsWith('event:chapter405-') && !event.maintainedResearch);
  assert(projected405.length === 34, 'story intelligence must project all 34 maintained Chapter 405 beats');
  assert(dedicated405.length === 34, 'Chapter 405 must expose 34 dedicated canonical events');
  assert(dedicated405.some((event) => event.chronology?.day === 10) && dedicated405.some((event) => event.chronology?.day === 12), 'dedicated events must preserve both retrospective Day 10 and present Day 12 layers');

  const hisoka405 = archive.getCharacterStateAtChapter('character:hisoka-morow', 405);
  const bonolenov405 = archive.getCharacterStateAtChapter('character:bonolenov-ndongo', 405);
  const lynch393 = archive.getCharacterStateAtChapter('character:lynch-fullbokko', 393);
  const lynch405 = archive.getCharacterStateAtChapter('character:lynch-fullbokko', 405);
  const zakuro405 = archive.getCharacterStateAtChapter('character:zakuro-custard', 405);
  assert(hisoka405?.life === 'alive' && hisoka405?.locationId === 'location:black-whale:tier-1:casino', 'the real Hisoka must be alive and confirmed in the Tier 1 casino at Chapter 405');
  assert(/false-Hisoka decoy|decoy plan/i.test(text(bonolenov405)) && bonolenov405?.locationId === 'location:black-whale:tier-1:casino:restroom', 'Bonolenov must own the false-Hisoka decoy reveal and switch to the casino restroom');
  assert(lynch393?.life === 'alive', 'Chapter 393 must remain frozen with Lynch alive after the apparent-Hisoka encounter');
  assert(lynch405?.life === 'dead' && /Bonolenov/i.test(text(lynch405)), 'Lynch’s death must first resolve at the Chapter 405 state boundary');
  assert(zakuro405?.life === 'alive' && /deceiv/i.test(text(zakuro405)), 'Zakuro must remain alive while the Bonolenov disguise deception is revealed');

  const metamorph377 = archive.getAbilityKnowledgeAtChapter('ability:battle-cantabile-metamorphorsen', 377);
  const metamorph405 = archive.getAbilityKnowledgeAtChapter('ability:battle-cantabile-metamorphorsen', 405);
  const metamorph377BoundaryText = text({ summary: metamorph377?.summary, knowledgeState: metamorph377?.knowledgeState, mechanics: metamorph377?.mechanics });
  const metamorph405BoundaryText = text({ summary: metamorph405?.summary, knowledgeState: metamorph405?.knowledgeState, mechanics: metamorph405?.mechanics });
  assert(!/conversation.*time|time spent talking/i.test(metamorph377BoundaryText), 'Chapter 377 must not backfill the Chapter 405 conversation-duration rule');
  assert(/talked.*in person|spoken.*in person/i.test(metamorph405BoundaryText) && /conversation.*time|time spent talking/i.test(metamorph405BoundaryText), 'Chapter 405 must preserve Metamorphorsen’s contact and duration rules');
  assert(/belief/i.test(metamorph405BoundaryText) && /smaller/i.test(metamorph405BoundaryText), 'the smaller-body duration effect must remain Bonolenov’s belief rather than a hard formula');

  const body392 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 392);
  const body405 = archive.getAbilityKnowledgeAtChapter('ability:body-and-soul', 405);
  const body392BoundaryText = text({ summary: body392?.summary, knowledgeState: body392?.knowledgeState, mechanics: body392?.mechanics });
  const body405BoundaryText = text({ summary: body405?.summary, knowledgeState: body405?.knowledgeState, mechanics: body405?.mechanics });
  assert(!/Bonolenov/i.test(body392BoundaryText), 'Chapter 392 Body and Soul knowledge must not know the apparent Hisoka was Bonolenov');
  assert(/Bonolenov/i.test(body405BoundaryText) && /pretend|false|disguise/i.test(body405BoundaryText), 'Chapter 405 must resolve Body and Soul as exposing Bonolenov’s false identity');
  assert(/Zakuro.*did not hear|did not hear.*Zakuro/i.test(body405BoundaryText), 'Chapter 405 must preserve the demonstrated Zakuro audience boundary');

  const dogman405 = archive.getCharacterStateAtChapter('character:dogman', 405);
  const dogAbility = archive.getAbilityKnowledgeAtChapter('ability:dogman-nen-scent-identification', 405);
  assert(/level 62/i.test(text(dogman405)), 'Dogman must be level 62 at the Chapter 405 boundary');
  assert(/5 m|five meters/i.test(text(dogAbility)) && /2 m|two meters/i.test(text(dogAbility)) && /100%/i.test(text(dogAbility)), 'Dogman’s three supplied scent thresholds must be preserved');
  assert(/official.*name.*unsupplied|official name.*unresolved/i.test(text(dogAbility)), 'Dogman must not receive an invented official ability name');

  const sodom405 = archive.getAbilityKnowledgeAtChapter('ability:sodom-non-nen-kidnapping', 405);
  assert(/does not know Nen|not know Nen/i.test(text(sodom405)), 'Sodom’s kidnapping target must be restricted to someone who does not know Nen');
  assert(/no successful kidnapping|no completed use|not.*completed/i.test(text(sodom405)), 'Chapter 405 must stop before a completed kidnapping');

  const keni405 = archive.getCharacterStateAtChapter('character:ken-i-wang', 405);
  assert(/Morena/i.test(text(keni405)) && /joker/i.test(text(keni405)), 'Ken’i’s concealed Morena/joker thoughts must be retained');
  assert(!/Heil-Ly member|member of Heil-Ly|Heil-Ly allegiance confirmed/i.test(text(keni405)), 'Ken’i must not be promoted to a confirmed Heil-Ly member');

  const heilly405 = archive.getOrganizationStateAtChapter('organization:heil-ly', 405);
  const troupe405 = archive.getOrganizationStateAtChapter('organization:phantom-troupe', 405);
  assert(/Dogman/i.test(text(heilly405)) && /Sodom/i.test(text(heilly405)) && /funeral/i.test(text(heilly405)), 'Heil-Ly state must preserve the funeral-search preparation');
  assert(/Hisoka/i.test(text(troupe405)) && /Heil-Ly/i.test(text(troupe405)), 'Phantom Troupe state must preserve the two-front Hisoka/Heil-Ly operation');

  const processingArea = archive.getEntityById('location:black-whale:tier-2:heil-ly-hideout:processing-area');
  const finalRoute = archive.getEntityById('location:black-whale:tier-5:cha-r-route');
  assert(processingArea?.parentId === 'location:black-whale:tier-2:heil-ly-hideout', 'Heil-Ly processing area must remain inside the confirmed Tier 2 hidden base');
  assert(/destination.*unresolved|unrevealed/i.test(text(finalRoute)), 'Cha-R route must not invent the destination beyond Tajao’s final door');

  const quorolle405 = archive.getCharacterStateAtChapter('character:quorolle', 405);
  const tevelares405 = archive.getCharacterStateAtChapter('character:tevelares', 405);
  const daemon405 = archive.getCharacterStateAtChapter('character:daemon', 405);
  assert(/level 51/i.test(text(quorolle405)), 'Quorolle must be level 51');
  assert(/no new exact level|no.*exact level/i.test(text(tevelares405)) && /no new exact level|no.*exact level/i.test(text(daemon405)), 'Tevelares and Daemon must not receive invented Chapter 405 levels');

  const funeralPrep = archive.getEntityById('event:chapter405-morena-targets-upcoming-funeral-crowd');
  assert(/upcoming|will happen soon|preparation/i.test(text(funeralPrep)) && !/procession began|procession started/i.test(text(funeralPrep)), 'the funeral must remain upcoming rather than already underway');

  const publicTimeline405 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 405 && event.maintainedResearch);
  assert(publicTimeline405.length === 34, 'public timeline must expose all 34 maintained Chapter 405 beats');
  assert(new Set(publicTimeline405.map((event) => event.day)).has(10) && new Set(publicTimeline405.map((event) => event.day)).has(12), 'public timeline must retain both retrospective and present-day layers');

  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 405/.test(group.group || '')), 'active dossier must include the Chapter 405 modernization group');
  assert(!(frozen404.guardAssignmentGroups || []).some((group) => /Chapter 405/.test(group.group || '')), 'frozen Through404 dossier must remain unaware of Chapter 405');
  const frozenMysteryIds = new Set((frozen404.successionMysteries || []).map((record) => record.id).filter(Boolean));
  const activeMysteryIds = new Set((dossier.successionMysteries || []).map((record) => record.id).filter(Boolean));
  assert(chapterModule.succession405Mysteries.every((record) => !frozenMysteryIds.has(record.id)), 'frozen Through404 dossier must not contain Chapter 405 mysteries');
  assert(chapterModule.succession405Mysteries.every((record) => activeMysteryIds.has(record.id)), 'active dossier must expose every Chapter 405 mystery');
  assert(activeArchive.publicationBoundary405?.chapter === 405, 'active archive must advance to Through405');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must identify the supplied synopsis as the sole substantive story source');
  assert(/no Chapter 405 title|No Chapter 405 title/i.test(sourceNote), 'source note must explain the unsupplied-title boundary');
  assert(/non-linear/i.test(sourceNote) && /Day 12/i.test(sourceNote), 'source note must preserve the non-linear chronology boundary');
  assert(/Pakunoda.*speculat|speculative.*Pakunoda/i.test(sourceNote), 'source note must keep the #9/Pakunoda theory speculative');
  assert(/No Chapter 406\+|Chapter 406\+.*quarantined|no Chapter 406\+/i.test(sourceNote), 'source note must forbid Chapter 406+ backfill');

  console.log(`Chapter 405 boundary audit passed: ${dedicated405.length} dedicated events plus ${projected405.length} maintained projections preserve real/fake Hisoka identity, non-linear Day 10/12 chronology, Metamorphorsen and Body and Soul resolution, Lynch’s death boundary, Ken’i uncertainty, Dogman/Sodom preparation, and the Chapter 406+ spoiler firewall.`);
} finally {
  await vite.close();
}
