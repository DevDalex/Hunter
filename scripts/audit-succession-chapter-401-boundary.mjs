import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 401 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);
const sourceNote = fs.readFileSync('docs/source-notes/chapter-401.md', 'utf8').replace(/\*\*/g, '');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession401Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen400 = await vite.ssrLoadModule('/src/data/successionDossierThrough400.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index400 = numbers.indexOf(400);
  assert(index400 >= 0 && numbers[index400 + 1] === 401 && numbers[index400 + 2] === 402 && numbers[index400 + 3] === 403 && numbers[index400 + 4] === 404 && numbers[index400 + 5] === 405 && numbers[index400 + 6] === 406, 'maintained publication chain must place Chapter 401 directly after 400, then Chapters 402–405, before the pre-existing 406 packet');

  const chapter401 = chapterModule.succession401ChapterResearch?.[0];
  assert(chapter401?.number === 401, 'Chapter 401 research must load');
  assert(chapter401.title === 'Moonlight' && /retained/i.test(chapter401.titleStatus), 'Chapter 401 must retain the pre-existing Moonlight title metadata without inventing a Japanese title');
  assert(chapter401.voyageDay === 'Voyage Day 10' && chapter401.chronology?.presentDay === true, 'Chapter 401 must remain present-day Voyage Day 10');
  assert(/11:45/.test(String(chapter401.chronology?.exactClockTime)) && /2:00/.test(String(chapter401.chronology?.exactClockTime)), 'Chapter 401 must preserve the exact 11:45 a.m. and 2:00 p.m. anchors');
  assert(chapterModule.succession401TimelineEvents.length === 18, 'maintained research must preserve all 18 Chapter 401 beats');

  const events401 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 401 && event.chapterRange?.end === 401);
  const eventIds = new Set(events401.map((event) => event.id));
  const dedicatedEventIds = [
    'event:chapter401-1145-longhi-private-awakening-furykov-watch',
    'event:longhi-denies-silent-majority-reveals-moonlight-act',
    'event:moonlight-act-voluntary-signature-truthful-disclosure',
    'event:longhi-reveals-beyond-biological-daughter',
    'event:longhi-discloses-beyond-fake-marriage-academy-program',
    'event:makaha-failed-camilla-placement-leads-curse-investigation',
    'event:longhi-shows-seal-ten-strong-curse-sacrifices',
    'event:beyond-curse-target-and-activation-theories-remain-unresolved',
    'event:longhi-beyond-child-prince-hypothesis-oito-legal-wife-rule',
    'event:sakata-knocks-kurapika-uses-treaty-dispute-cover',
    'event:tubeppa-woble-peace-treaty-scope-weekly-renewal',
    'event:moonlight-act-breach-one-week-zetsu-harm-standard',
    'event:moonlight-act-beyond-child-search-reward-conditions',
    'event:moonlight-one-use-reward-dowsing-chain-no-lie-reading',
    'event:longhi-vows-kill-beyond-child-if-prince',
    'event:longhi-exits-crying-furykov-reevaluates-kurapika-conceals-deal',
    'event:tenftory-enters-next-furykov-reassignment-babimyna-hesitates',
    'event:chapter401-1400-beyond-kanzai-unnamed-meeting-request',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 401 canonical boundary`);
  const projected401 = events401.filter((event) => event.maintainedResearch === true);
  assert(projected401.length === 18, 'story intelligence must project all 18 maintained Chapter 401 beats');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 401 events must remain distinct from maintained-research projections');
  for (const id of dedicatedEventIds) assert(archive.getEntityById(id)?.chronology?.day === 10, `${id} must remain Voyage Day 10`);
  assert(archive.getEntityById('event:chapter401-1145-longhi-private-awakening-furykov-watch')?.chronology?.timeOfDay === '11:45 a.m.', 'opening dedicated event must preserve 11:45 a.m.');
  assert(archive.getEntityById('event:chapter401-1400-beyond-kanzai-unnamed-meeting-request')?.chronology?.timeOfDay === '2:00 p.m.', 'Beyond coda must preserve 2:00 p.m.');

  const bedroom = archive.getEntityById('location:black-whale:tier-1:room-1014:master-bedroom');
  const beyondCell = archive.getEntityById('location:black-whale:tier-1:beyond-detention-cell');
  assert(bedroom?.parentId === 'location:black-whale:tier-1:room-1014', 'Room 1014 master bedroom must be a canonical child location');
  assert(beyondCell?.locationType === 'facility' && beyondCell?.parentId === 'location:black-whale:tier-1', 'Beyond detention cell must be modeled as a Tier 1 detention facility using the registered location vocabulary');

  const moonlight400 = archive.getAbilityKnowledgeAtChapter('ability:moonlight-act', 400);
  const moonlight401 = archive.getAbilityKnowledgeAtChapter('ability:moonlight-act', 401);
  assert(!moonlight400?.known, 'Moonlight Act mechanics must remain unavailable at the Chapter 400 boundary');
  assert(moonlight401?.known, 'Moonlight Act must become known at Chapter 401');
  assert(moonlight401.ability?.ownerIds?.includes('character:longhi'), 'Longhi must own Moonlight Act');
  assert(moonlight401.ability?.classification?.nenTypes?.includes('manipulation'), 'Moonlight Act must be classified as Manipulation');
  assert(!moonlight401.ability?.classification?.nenTypes?.includes('conjuration'), 'aura pen/paper must not invent a Conjuration classification');
  assert(/voluntary/i.test(text(moonlight401)) && /without deceit|truthful/i.test(text(moonlight401)), 'Moonlight Act knowledge must preserve voluntary signature and truthful disclosure');
  assert(/one week.*Zetsu|Zetsu.*one week/i.test(text(moonlight401)), 'Moonlight Act knowledge must preserve the one-week enforced-Zetsu treaty penalty');
  assert(/9:00/i.test(text(moonlight401)) && /messenger/i.test(text(moonlight401)), 'Moonlight Act knowledge must preserve the Sunday messenger renewal condition');
  assert(/one use/i.test(text(moonlight401)), 'Moonlight Act knowledge must preserve the prospective one-use reward');

  const silent401 = archive.getAbilityKnowledgeAtChapter('ability:silent-majority', 401);
  assert(silent401?.known, 'Silent Majority must remain a known unresolved ability at 401');
  assert(/Longhi.*not.*user|Longhi.*does not belong|Longhi.*not.*hers/i.test(text(silent401)), 'Longhi must be excluded as Silent Majority user at Chapter 401');
  assert(/actual user.*unidentified|actual user.*unresolved|user.*unknown/i.test(text(silent401)), 'actual Silent Majority user must remain unresolved');

  const curse401 = archive.getAbilityKnowledgeAtChapter('ability:beyond-curse-child-network', 401);
  assert(curse401?.known, 'Beyond curse-child network must become Chapter 401 ability knowledge');
  assert(/ten.*strong curse sacrifices|two of ten/i.test(text(curse401)), 'curse knowledge must preserve ten strong sacrifices');
  assert(/Longhi/i.test(text(curse401)) && /Makaha/i.test(text(curse401)), 'curse knowledge must identify Longhi and Makaha as two strong sacrifices');
  assert(/targets.*unknown|target.*unresolved/i.test(text(curse401)), 'individual curse targets must remain unknown');
  assert(/princes.*speculation|theor/i.test(text(curse401)), 'prince-target attribution must remain Longhi speculation');
  assert(/burning|cutting/i.test(text(curse401)) && /exorc/i.test(text(curse401)), 'seal knowledge must preserve physical-removal resistance without closing broader exorcism');

  const dowsing401 = archive.getAbilityKnowledgeAtChapter('ability:dowsing-chain', 401);
  assert(dowsing401?.known && /not moving|motionless|no lie/i.test(text(dowsing401)), 'Dowsing Chain must preserve Kurapika’s no-lie reading');
  assert(/sincere false belief|hypoth|not.*omniscient|not.*objective/i.test(text(dowsing401)), 'Dowsing Chain knowledge must not promote Longhi’s hypotheses into objective truth');

  const longhi401 = archive.getCharacterStateAtChapter('character:longhi', 401);
  assert(longhi401?.life === 'alive', 'Longhi must be alive at Chapter 401');
  assert(/biological daughter|Beyond.*father/i.test(text(longhi401)), 'Longhi state must preserve confirmed Beyond parentage');
  assert(/kill.*Beyond.*child|Beyond.*child.*kill/i.test(text(longhi401)), 'Longhi state must preserve her conditional anti-Beyond-child assassination intent');
  assert(/hypothesis|if.*proves/i.test(text(longhi401)), 'Longhi state must not identify a confirmed Beyond-child prince');

  const kurapika401 = archive.getCharacterStateAtChapter('character:kurapika', 401);
  assert(/Dowsing|Moonlight/i.test(text(kurapika401)) && /conceal|cover/i.test(text(kurapika401)), 'Kurapika state must preserve the private Moonlight negotiation and public concealment');
  const tubeppa401 = archive.getCharacterStateAtChapter('character:tubeppa-hui-guo-rou', 401);
  assert(/unaware.*Longhi.*Nen|does not know.*Longhi/i.test(text(tubeppa401)), 'Tubeppa state must preserve Longhi’s claim that Tubeppa does not know her Nen-user/ability status');

  const beyond401 = archive.getCharacterStateAtChapter('character:beyond-netero', 401);
  assert(beyond401?.locationId === 'location:black-whale:tier-1:beyond-detention-cell', 'Beyond Chapter 401 state must place him in the Tier 1 detention cell');
  assert(/meeting.*unnamed|unnamed.*meeting/i.test(text(beyond401)), 'Beyond state must keep the requested meeting partner unnamed');

  const princeHypothesis = archive.getEntityById('event:longhi-beyond-child-prince-hypothesis-oito-legal-wife-rule');
  assert(/legal wives/i.test(text(princeHypothesis)), 'Oito’s legal-wife eligibility wording must be preserved');
  assert(/does not establish|unconfirmed|hypothesis/i.test(text(princeHypothesis)), 'legal-wife wording must not confirm a Beyond-child prince');
  assert(/Special Martial Law.*not active|not active.*Special Martial Law/i.test(text(princeHypothesis)), 'Kurapika’s Benjamin scenario must not declare Special Martial Law active');

  const treaty = archive.getEntityById('event:tubeppa-woble-peace-treaty-scope-weekly-renewal');
  assert(/Woble/i.test(text(treaty)) && /Tubeppa/i.test(text(treaty)) && /9:00/i.test(text(treaty)), 'treaty event must preserve parties and expiry time');
  const breach = archive.getEntityById('event:moonlight-act-breach-one-week-zetsu-harm-standard');
  assert(/one week.*Zetsu|Zetsu.*one week/i.test(text(breach)), 'breach event must preserve one-week Zetsu punishment');
  assert(/not universal|demonstrated agreement|this.*agreement/i.test(text(breach)), 'breach terms must not become universal Moonlight Act defaults');

  const cover = archive.getEntityById('event:longhi-exits-crying-furykov-reevaluates-kurapika-conceals-deal');
  assert(/cover|conceal|public/i.test(text(cover)) && /compromise/i.test(text(cover)), 'Kurapika’s unresolved-negotiation statement must be preserved as concealment after a real compromise');
  assert(/doubt|cannot determine|fails to resolve/i.test(text(cover)), 'Furykov must remain unable to resolve the closed-door event');

  const beyondCoda = archive.getEntityById('event:chapter401-1400-beyond-kanzai-unnamed-meeting-request');
  assert(/not named|unnamed/i.test(text(beyondCoda)), 'Beyond meeting target must remain unnamed');
  assert(/not shown.*arranged|whether.*arrange.*unresolved|outcome.*unresolved/i.test(text(beyondCoda)), 'Chapter 401 must not claim the meeting is already arranged');

  const longhiBeyondRel = archive.getEntityById('relationship:longhi-beyond-biological-daughter-opposition');
  assert(longhiBeyondRel?.relationshipType === 'family' && /biological/i.test(text(longhiBeyondRel)), 'Longhi–Beyond relationship must preserve biological family status and opposition');
  const sistersRel = archive.getEntityById('relationship:longhi-makaha-paternal-half-sisters-curse-investigation');
  assert(sistersRel?.relationshipType === 'family' && /paternal.*half/i.test(text(sistersRel)), 'Longhi and Makaha must be paternal half-sisters without invented shared maternity');
  const treatyRel = archive.getEntityById('relationship:longhi-kurapika-moonlight-act-treaty');
  assert(/Moonlight/i.test(text(treatyRel)) && /conditional/i.test(text(treatyRel)), 'Longhi–Kurapika relationship must expose the Chapter 401 conditional treaty');

  const fugetsu401 = archive.getCharacterStateAtChapter('character:fugetsu-hui-guo-rou', 401);
  assert(/Chapter 401 does not depict|carries forward/i.test(text(fugetsu401)), 'Chapter 401 must not invent a new Fugetsu scene or resolution');
  assert(/hostile-spirit|hostile.*spirit/i.test(text(fugetsu401)), 'Fugetsu’s unresolved Chapter 400 hostile-spirit state must carry forward without a fabricated cure');

  const publicTimeline401 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 401);
  assert(publicTimeline401.length === 18, 'public timeline must expose all 18 maintained Chapter 401 beats');
  assert(publicTimeline401.some((event) => event.id === '401-longhi-denies-silent-majority-reveals-moonlight-act'), 'public timeline must contain the Moonlight Act reveal');
  assert(publicTimeline401.some((event) => event.id === '401-1400-beyond-kanzai-meeting-request'), 'public timeline must contain the 2:00 p.m. Beyond coda');

  const oldContractQuestion = 'What are the exact terms of Longhi’s contract with Kurapika?';
  assert((frozen400.successionMysteries || []).some((record) => record.question === oldContractQuestion), 'frozen through-400 dossier must preserve the unresolved Longhi contract-terms mystery');
  assert(!(dossier.successionMysteries || []).some((record) => record.question === oldContractQuestion), 'active through-401 dossier must retire the now-resolved contract-terms mystery');
  assert((dossier.guardAssignmentGroups || []).some((group) => /Chapter 401/.test(group.group || '')), 'active dossier must include the Chapter 401 modernization group');
  assert(!(frozen400.guardAssignmentGroups || []).some((group) => /Chapter 401/.test(group.group || '')), 'frozen through-400 dossier must remain unaware of Chapter 401');

  assert(/sole substantive story source/i.test(sourceNote) && /user-supplied/i.test(sourceNote), 'source note must preserve the current user synopsis as sole substantive story source');
  assert(/Moonlight/i.test(sourceNote) && /pre-existing chapter-title catalog/i.test(sourceNote), 'source note must explain retained Moonlight title metadata');
  assert(/11:45 a\.m\./i.test(sourceNote) && /2:00 p\.m\./i.test(sourceNote), 'source note must preserve both exact chapter time anchors');
  assert(/does not identify the actual user/i.test(sourceNote), 'source note must preserve Silent Majority user uncertainty');
  assert(/does not infer an additional Conjuration/i.test(sourceNote), 'source note must block Conjuration inference from Moonlight Act’s interface');
  assert(/not promoted into an omniscient truth certificate/i.test(sourceNote), 'source note must preserve the Dowsing Chain epistemic boundary');
  assert(/two of ten.*strong curse sacrifices/i.test(sourceNote), 'source note must preserve Longhi and Makaha as two of ten strong sacrifices');
  assert(/does not.*prove.*every Nen exorcist|does not.*every possible exorcism/i.test(sourceNote), 'source note must keep broader curse exorcism unresolved');
  assert(/prince.*likely curse targets.*speculation|princes are likely curse targets.*speculation/i.test(sourceNote), 'source note must keep prince-target attribution speculative');
  assert(/Special Martial Law.*does not show.*declared|Special Martial Law.*not.*active/i.test(sourceNote), 'source note must keep Special Martial Law inactive at 401');
  assert(/does not prove.*Beyond.*child|does not.*prove.*participating prince.*Beyond/i.test(sourceNote), 'source note must keep the Beyond-child prince theory unresolved');
  assert(/requested person is not named|requested person.*not named/i.test(sourceNote), 'source note must keep Beyond’s requested meeting partner unnamed');
  assert(/No Chapter 402\+|no Chapter 402\+/i.test(sourceNote), 'source note must forbid Chapter 402+ backfill');

  console.log(`Chapter 401 boundary audit passed: ${dedicatedEventIds.length} dedicated canonical events plus ${projected401.length} maintained-research projections preserve Moonlight Act’s voluntary contract, Longhi’s confirmed Beyond parentage, the unresolved curse/prince target map, Dowsing Chain’s non-omniscient no-lie reading, the Tubeppa–Woble treaty, and Beyond’s unnamed 2:00 p.m. meeting request.`);
} finally {
  await vite.close();
}
