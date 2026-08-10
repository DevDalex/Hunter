import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 397 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession397Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen396 = await vite.ssrLoadModule('/src/data/successionDossierThrough396.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index396 = numbers.indexOf(396);
  assert(index396 >= 0 && numbers[index396 + 1] === 397, 'maintained publication chain must place Chapter 397 directly after Chapter 396');
  assert(numbers[numbers.indexOf(397) + 1] === 400, 'Chapter 397 must remain directly before the pre-existing Chapter 400 maintained packet');

  const chapter397 = chapterModule.succession397ChapterResearch?.[0];
  assert(chapter397?.number === 397, 'dedicated Chapter 397 research must load');
  assert(chapter397.title === null && chapter397.titleStatus === 'not-supplied-no-title-invented', 'Chapter 397 title must remain unsupplied');
  assert(chapter397.chronology?.exactClockTime === null, 'Chapter 397 must not invent an exact clock time');
  assert(/historical|flashback|Meteor City/i.test(text(chapter397.chronology)), 'Chapter 397 chronology must remain historical Meteor City origin material');
  assert(/years-later|years later/i.test(text(chapter397.chronology)), 'Chapter 397 chronology must preserve the years-later Spider-birth coda');
  assert(chapterModule.succession397TimelineEvents.length === 12, 'dedicated research must preserve all 12 maintained Chapter 397 timeline beats');

  const events397 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 397 && event.chapterRange?.end === 397);
  const eventIds = new Set(events397.map((event) => event.id));
  const dedicatedEventIds = [
    'event:sarasa-missing-before-second-screening',
    'event:chrollo-cancels-screening-community-search',
    'event:chrollo-finds-sarasa-pouch-tracks-uga-forest-lead',
    'event:sarasa-body-recovered-uga-forest-note-withheld',
    'event:machi-insists-sarasa-return-home',
    'event:renko-embalms-sarasa-farewell',
    'event:machi-perceives-aura-renko-kirimori-invitation',
    'event:chrollo-asks-uvogin-three-years-before-fourteen',
    'event:chrollo-proposes-communication-criminal-haven-trap',
    'event:group-commits-to-preparation-sheila-walks-away',
    'event:chrollo-vows-killing-lifelong-villain-deterrence',
    'event:uvogin-nominates-chrollo-spider-born',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 397 canonical event boundary`);
  const projected397 = events397.filter((event) => event.maintainedResearch === true);
  assert(projected397.length === 12, 'story-intelligence must project all 12 maintained Chapter 397 research beats');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 397 event IDs must remain distinct from maintained-research projections');

  for (const id of dedicatedEventIds) assert(archive.getEntityById(id)?.chronology?.day === null, `${id} must remain historical story-time rather than literal Voyage Day 10 action`);
  const founding = archive.getEntityById('event:uvogin-nominates-chrollo-spider-born');
  assert(/years-later|years later/i.test(text(founding?.chronology)), 'Spider-birth event must preserve the relative years-later coda');

  const sarasa396 = archive.getCharacterStateAtChapter('character:sarasa', 396);
  const sarasa397 = archive.getCharacterStateAtChapter('character:sarasa', 397);
  assert(sarasa396?.life !== 'dead', 'Sarasa’s Chapter 397 death must remain unavailable at Chapter 396');
  assert(sarasa397?.life === 'dead' && sarasa397?.statusKnowledgeFromChapter === 397, 'Sarasa must become confirmed dead exactly at Chapter 397 knowledge boundary');
  assert(!archive.getCharacterStateTimeline('character:sarasa').some((record) => record.chapterRange?.start === 397), 'historical Sarasa death must not manufacture a present-day Chapter 397 state record');
  for (const id of ['character:uvogin', 'character:pakunoda', 'character:shalnark']) {
    assert(archive.getCharacterStateAtChapter(id, 397)?.life === 'dead', `${id} must remain dead at the Chapter 397 publication-state boundary despite flashback appearances`);
    assert(!archive.getCharacterStateTimeline(id).some((record) => record.chapterRange?.start === 397), `${id} must not receive a present-day resurrection state from the flashback`);
  }

  const pouch = archive.getEntityById('event:chrollo-finds-sarasa-pouch-tracks-uga-forest-lead');
  assert(/heart-shaped pouch/i.test(text(pouch)) && /tire tracks/i.test(text(pouch)) && /footprints/i.test(text(pouch)) && /Uga Forest/i.test(text(pouch)), 'search evidence must preserve the pouch, tire tracks, footprints, and Uga Forest lead');
  assert(/inference|plausible|without identifying/i.test(text(pouch)), 'Uga Forest lead must remain an evidence-based inference');

  const body = archive.getEntityById('event:sarasa-body-recovered-uga-forest-note-withheld');
  assert(/dismembered/i.test(text(body)) && /dead|murder/i.test(text(body)), 'Uga Forest recovery must confirm Sarasa’s murder');
  assert(/refuses|withhold/i.test(text(body)) && /note/i.test(text(body)), 'body-recovery event must preserve Chrollo’s refusal to disclose the note');
  assert(/remain unresolved|does not invent|not.*paraphrase/i.test(text(body)), 'body-recovery event must quarantine the note text and killer identities');
  assert(!/(?:note|message)\s+(?:reads|states|says)\s*[:“\"]|written\s+on\s+the\s+note\s+(?:was|is)\s*[:“\"]/i.test(String(body?.summary || '')), 'canonical event summary must not fabricate quoted or declarative note contents');

  const renkoAbility396 = archive.getAbilityKnowledgeAtChapter('ability:renko-embalming', 396);
  const renkoAbility397 = archive.getAbilityKnowledgeAtChapter('ability:renko-embalming', 397);
  const renkoAbility = archive.getEntityById('ability:renko-embalming');
  assert(renkoAbility?.firstChapter === 397 && renkoAbility?.latestChapter === 397, 'Renko embalming ability must enter at Chapter 397');
  assert(!renkoAbility396?.known && renkoAbility397?.known, 'Renko ability knowledge must activate at 397 and not leak to 396');
  assert(renkoAbility.classification?.nenTypes?.includes('unknown'), 'Renko’s Nen category must remain unknown');
  assert(/official ability name.*unsupplied|descriptive archive label/i.test(text(renkoAbility)), 'Renko ability must remain a descriptive label');
  assert(/not resurrection|not.*resurrection|consciousness continuation/i.test(text(renkoAbility)), 'Renko ability must reject resurrection overreach');
  assert(/broader|every deceased body|generalize/i.test(text(renkoAbility)), 'Renko ability must not universalize the single demonstrated Sarasa restoration');

  const auraEvent = archive.getEntityById('event:machi-perceives-aura-renko-kirimori-invitation');
  assert(auraEvent?.abilityIds?.includes('ability:renko-embalming'), 'Machi/Renko aura event must link Renko’s ability');
  assert(/Machi.*aura|aura.*Machi/i.test(text(auraEvent)), 'Machi must be recorded as perceiving aura');
  assert(/not.*Nen category|without inventing.*Nen category|complete Nen profile.*unresolved/i.test(text(auraEvent)), 'Machi aura perception must not become an invented Nen type or complete training profile');

  const cemetery = archive.getEntityById('location:meteor-city:cemetery-near-all-faiths-church');
  const kirimori = archive.getEntityById('location:kirimori-valley');
  assert(cemetery && kirimori, 'Chapter 397 cemetery and Kirimori Valley locations must exist');
  assert(cemetery.parentId === 'location:meteor-city', 'Sarasa’s cemetery must remain under Meteor City');
  assert(/exact distance|formal cemetery name|precise coordinates/i.test(text(cemetery)), 'cemetery record must preserve geographic uncertainty');
  assert(/exact coordinates|distance from Meteor City|political jurisdiction|route geometry/i.test(text(kirimori)), 'Kirimori Valley record must preserve unresolved geography');

  const threeYears = archive.getEntityById('event:chrollo-asks-uvogin-three-years-before-fourteen');
  assert(/three years/i.test(text(threeYears)) && /before.*fourteen|before he turns fourteen/i.test(text(threeYears)), 'Chrollo’s three-year and before-fourteen statements must both be preserved');
  assert(/does not establish.*exact current age|exact current age.*birthday|exact.*birthday/i.test(text(threeYears)), 'three-year plan must not invent Chrollo’s exact age or birthday');

  const network = archive.getEntityById('event:chrollo-proposes-communication-criminal-haven-trap');
  assert(/communication revolution|global information/i.test(text(network)) && /criminal haven|criminal-attraction|draw.*offenders/i.test(text(network)), 'Chrollo strategy must preserve the communication-revolution criminal-attraction concept');
  assert(/cigarette/i.test(text(network)) && /record/i.test(text(network)), 'Chrollo strategy must preserve the cigarette-butt/possible-recording reasoning');
  assert(/inference|deductions|not independently confirmed/i.test(text(network)), 'recording and criminal-behavior theory must remain Chrollo inference');
  assert(/future plan|not.*built|unbuilt/i.test(text(network)), 'criminal haven must remain a plan rather than an already-built system');

  const sheila = archive.getEntityById('event:group-commits-to-preparation-sheila-walks-away');
  assert(/downcast/i.test(text(sheila)) && /walk|leav/i.test(text(sheila)), 'Sheila event must preserve the observable departure');
  assert(/exact motive.*unresolved|no dialogue.*explaining|not.*confirmed/i.test(text(sheila)), 'Sheila’s motive must remain unresolved');

  const villain396 = archive.getEntityById('event:chrollo-graffino-clean-sweep-performance');
  const villain397 = archive.getEntityById('event:chrollo-vows-killing-lifelong-villain-deterrence');
  assert(/acting|stage/i.test(text(villain396)) && /not.*criminal|rather than criminal/i.test(text(villain396)), 'Chapter 396 Graffino boundary must remain theatrical');
  assert(/kill many people|kill.*people|many people/i.test(text(villain397)) && /rest of his life as a villain|lifelong villain/i.test(text(villain397)), 'Chapter 397 must preserve Chrollo’s explicit lethal and lifelong-villain turn');
  assert(/ends the Chapter 396 theater-only|theater-only.*ends|rather than a stage role/i.test(text(villain397)), 'Chapter 397 must explicitly supersede the earlier theater-only boundary');

  assert(founding?.organizationIds?.includes('organization:phantom-troupe'), 'Spider-birth event must link the canonical Phantom Troupe organization');
  assert(/Uvogin.*refuses|refuses.*lead/i.test(text(founding)) && /Chrollo.*head|head.*Chrollo/i.test(text(founding)), 'leadership event must preserve Uvogin refusing leadership and naming Chrollo head');
  assert(/other seven|seven shown/i.test(text(founding)), 'leadership event must preserve the other seven shown members agreeing');
  assert(/Spider.*birth|Spider is born|Spider\/Phantom Troupe/i.test(text(founding)), 'years-later coda must establish the Spider’s historical birth');
  assert(/exact spoken.*full-name|complete group-name.*unsupplied|not.*inventing.*full-name/i.test(text(founding)), 'founding event must not invent the precise full-name coinage');

  const chrolloUvogin = archive.getEntityById('relationship:uvogin-chrollo-ch397-leadership-vow');
  const renkoMachi = archive.getEntityById('relationship:renko-machi-ch397-nen-invitation');
  const chrolloTroupe = archive.getEntityById('relationship:chrollo-phantom-troupe-ch397-leadership-origin');
  assert(chrolloUvogin && renkoMachi && chrolloTroupe, 'Chapter 397 canonical relationship foundation must expose leadership and Renko/Machi links');
  assert(/not the Troupe leader|Chrollo.*head/i.test(text(chrolloUvogin)), 'Uvogin/Chrollo relationship must not invert the leadership nomination');
  assert(/does not show training|training.*not|complete Nen education/i.test(text(renkoMachi)), 'Renko/Machi relationship must keep later training unresolved');
  assert(chrolloTroupe?.targetEntityId === 'organization:phantom-troupe', 'Chrollo founding leadership relationship must target the Phantom Troupe organization');

  const publicTimeline397 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 397);
  assert(publicTimeline397.length === chapterModule.succession397TimelineEvents.length, 'public timeline must expose all maintained Chapter 397 narrative beats');
  assert(publicTimeline397.some((event) => event.id === '397-sarasa-body-recovered-uga-forest-note-withheld'), 'public timeline must include Sarasa’s Uga Forest recovery');
  assert(publicTimeline397.some((event) => event.id === '397-machi-perceives-aura-renko-invitation'), 'public timeline must include the Renko/Machi aura reveal');
  assert(publicTimeline397.some((event) => event.id === '397-uvogin-nominates-chrollo-spider-born'), 'public timeline must include the leadership/Spider coda');

  const activeAbilityNames = new Set((dossier.successionAbilities || []).map((record) => record.ability));
  const frozenAbilityNames = new Set((frozen396.successionAbilities || []).map((record) => record.ability));
  assert(activeAbilityNames.has('Renko’s Embalming Ability') && !frozenAbilityNames.has('Renko’s Embalming Ability'), 'Renko ability must appear only after the frozen Chapter 396 dossier');
  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 397')), 'active dossier must include the Chapter 397 historical origin group');
  assert(!(frozen396.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 397')), 'frozen through-396 dossier must remain unaware of Chapter 397');
  assert((dossier.successionResolvedQuestions || []).some((record) => record.chapter === 397 && /Who is nominated as the Troupe’s head/i.test(String(record.question || ''))), 'active dossier must publish the Chapter 397 leadership resolution');
  assert((dossier.successionMysteries || []).some((record) => record.chapter === 397 && /What exactly is written on the note/i.test(String(record.question || ''))), 'active dossier must preserve the killers’ note as unresolved');
  assert(!(dossier.successionMysteries || []).some((record) => record.chapter === 396 && /Will Sarasa encounter the kidnappers/i.test(String(record.question || ''))), 'resolved Chapter 396 Sarasa cliffhanger must be retired');

  const note = fs.readFileSync('docs/source-notes/chapter-397.md', 'utf8');
  assert(/does not invent, reconstruct, quote, summarize, or infer the note/i.test(note), 'source note must prohibit reconstruction of the killers’ note');
  assert(/Sheila.*exact motive|exact motive.*Sheila|no explanatory dialogue/i.test(note), 'source note must preserve Sheila motive uncertainty');
  assert(/Renko.*Nen category|Nen category.*remain.*unresolved/i.test(note), 'source note must preserve Renko’s unknown Nen category');
  assert(/Machi.*aura perception/i.test(note) && /does not.*Nen category|not.*Nen category/i.test(note), 'source note must confirm Machi aura perception without inventing her type');
  assert(/three years/i.test(note) && /before he turns fourteen/i.test(note), 'source note must preserve Chrollo’s preparation window');
  assert(/future plan|not an already completed network/i.test(note), 'source note must keep Chrollo’s criminal network unbuilt at Chapter 397');
  assert(/Chapter 397 changes that boundary|explicit criminal\/villain program|theater-only/i.test(note), 'source note must mark the transition beyond Chapter 396 theatrical villain language');
  assert(/Uvogin refuses the leadership role|Chrollo is the head/i.test(note) && /Spider is born/i.test(note), 'source note must preserve Chrollo’s leadership nomination and Spider birth');
  assert(/No Chapter 398\+|No Chapter 398\+ consequence/i.test(note), 'source note must quarantine Chapter 398+ knowledge');

  console.log(`Chapter 397 boundary audit passed: ${dedicatedEventIds.length} dedicated canonical events plus ${projected397.length} maintained-research projections preserve Sarasa’s confirmed death, undisclosed note, Renko/Machi aura boundary, Chrollo’s three-year strategy and explicit villain turn, Sheila motive uncertainty, and Chrollo’s Spider leadership origin.`);
} finally {
  await vite.close();
}
