import fs from 'node:fs';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chapter 400 boundary audit failed: ${message}`);
};
const text = (value) => JSON.stringify(value || null);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const maintained = await vite.ssrLoadModule('/src/data/successionMaintainedChapterResearch.js');
  const chapterModule = await vite.ssrLoadModule('/src/data/succession400Research.js');
  const dossier = await vite.ssrLoadModule('/src/data/successionDossier.js');
  const frozen399 = await vite.ssrLoadModule('/src/data/successionDossierThrough399.js');
  const timeline = await vite.ssrLoadModule('/src/data/successionTimeline.js');

  const numbers = maintained.maintainedSuccessionChapterNumbers;
  const index399 = numbers.indexOf(399);
  assert(index399 >= 0 && numbers[index399 + 1] === 400 && numbers[index399 + 2] === 401 && numbers[index399 + 3] === 402 && numbers[index399 + 4] === 403 && numbers[index399 + 5] === 404 && numbers[index399 + 6] === 406, 'maintained publication chain must place modernized Chapter 400 directly after 399, then Chapters 401–404, before the pre-existing 406 packet');

  const chapter400 = chapterModule.succession400ChapterResearch?.[0];
  assert(chapter400?.number === 400, 'modernized Chapter 400 research must load');
  assert(chapter400.title === 'Secrecy' && chapter400.japaneseTitle === '秘匿', 'retained Chapter 400 title metadata must remain Secrecy / 秘匿');
  assert(/retained/i.test(chapter400.titleStatus), 'title status must disclose that metadata was retained from the pre-existing packet');
  assert(chapter400.voyageDay === 'Voyage Day 10' && chapter400.chronology?.presentDay === true && chapter400.chronology?.flashback === false, 'Chapter 400 must remain present-day Voyage Day 10');
  assert(chapter400.chronology?.exactClockTime === null, 'Chapter 400 must not invent an exact clock time');
  assert(chapterModule.succession400TimelineEvents.length === 17, 'modernized research must preserve all 17 Chapter 400 timeline beats');

  const events400 = archive.getEntitiesByType('event').filter((event) => event.chapterRange?.start === 400 && event.chapterRange?.end === 400);
  const eventIds = new Set(events400.map((event) => event.id));
  const dedicatedEventIds = [
    'event:phinks-feitan-receiver-search-en-limits',
    'event:nobunaga-rejoins-ten-minutes-cha-r-route',
    'event:receiver-confirms-heilly-base-tier2',
    'event:troupe-mafia-custom-franklin-hisoka-priority',
    'event:chapter400-emergency-broadcast-opening',
    'event:tyson-attendants-perform-reborn-personas',
    'event:izunavi-proposes-book-of-tyson-king-plan',
    'event:seiko-preserves-belief-kacho-alive',
    'event:without-you-kacho-form-fugetsu-king-plan',
    'event:five-princes-request-melody-performance',
    'event:kaiser-proposes-prince-poisoning-declares-love',
    'event:kaiser-martial-law-warning-steiner-device',
    'event:fugetsu-magical-worm-multiple-use-solo-return',
    'event:melody-detects-fugetsu-hostile-spirits',
    'event:zhang-lei-coin-vantine-negotiation-probe',
    'event:melody-pauses-plan-asks-kaiser-contact-kurapika',
    'event:kurapika-accepts-longhi-contract-tubeppa-collaboration',
  ];
  for (const id of dedicatedEventIds) assert(eventIds.has(id), `${id} must exist at the Chapter 400 canonical boundary`);
  const projected400 = events400.filter((event) => event.maintainedResearch === true);
  assert(projected400.length === 17, 'story intelligence must project all 17 maintained Chapter 400 beats');
  assert(dedicatedEventIds.every((id) => !archive.getEntityById(id)?.maintainedResearch), 'dedicated Chapter 400 events must remain distinct from maintained-research projections');
  for (const id of dedicatedEventIds) assert(archive.getEntityById(id)?.chronology?.day === 10, `${id} must remain Voyage Day 10`);

  const tier2Event = archive.getEntityById('event:receiver-confirms-heilly-base-tier2');
  const tier2Hideout = archive.getEntityById('location:black-whale:tier-2:heil-ly-hideout');
  assert(tier2Hideout && tier2Hideout.parentId === 'location:black-whale:tier-2', 'Chapter 400 must expose the Tier 2-confirmed Heil-Ly broad location');
  assert((tier2Event?.locationIds || []).includes('location:black-whale:tier-2:heil-ly-hideout'), 'receiver confirmation event must link the Tier 2 hideout location');
  assert(/weak|farther|Tier 2/i.test(text(tier2Event)), 'receiver event must preserve the observed weakening-signal Tier 2 reasoning');
  assert(/exact room|coordinates|topology.*unresolved|full.*route.*unresolved/i.test(text(tier2Event)), 'Tier 2 confirmation must stop before an exact room/full route');

  const morena399 = archive.getCharacterStateAtChapter('character:morena-prudo', 399);
  assert(morena399?.locationId === 'location:black-whale:tier-3:heil-ly-hideout', 'Chapter 400 Tier 2 fix must not rewrite Morena’s Chapter 399 access-side hideout state');
  const heilly400 = archive.getOrganizationStateAtChapter('organization:heil-ly', 400);
  assert((heilly400?.territoryIds || []).includes('location:black-whale:tier-2:heil-ly-hideout'), 'Heil-Ly organization state must advance to the Tier 2-confirmed broad location at 400');
  assert(/does not independently confirm Morena|does not.*Morena.*creator|not.*Morena.*creator/i.test(text(heilly400)), 'Tier 2 state must not make Morena the confirmed creator/operator of the spatial systems');

  const phinksEn = archive.getEntityById('event:phinks-feitan-receiver-search-en-limits');
  assert(/voices/i.test(text(phinksEn)) && /movement/i.test(text(phinksEn)) && /warehouse/i.test(text(phinksEn)), 'Phinks event must preserve his personal En concentration limits');
  assert(/Phinks-specific|not universal/i.test(text(phinksEn)), 'Phinks’s En limitations must not become universal En rules');

  const troupe400 = archive.getOrganizationStateAtChapter('organization:phantom-troupe', 400);
  assert(/Hisoka.*primary|primary.*Hisoka/i.test(text(troupe400)), 'Troupe state must keep Hisoka as the primary objective');
  assert(/Franklin.*not shown joining|proposed.*Franklin|Franklin.*proposed/i.test(text(troupe400)), 'Franklin reinforcement must remain proposed rather than completed');

  const roleplay = archive.getEntityById('event:tyson-attendants-perform-reborn-personas');
  assert(/role|persona/i.test(text(roleplay)) && /not treated as literal|not.*literal/i.test(text(roleplay)), 'Tyson attendants must remain role-play rather than literal biographies');
  const tysonPlan = archive.getEntityById('event:izunavi-proposes-book-of-tyson-king-plan');
  assert(/suspect|hypoth|untested/i.test(text(tysonPlan)), 'Izunavi’s Guardian Spirit Beast/book causal theory must remain unconfirmed');
  assert(/Nasubi/i.test(text(tysonPlan)) && /not.*demonstrated|untested/i.test(text(tysonPlan)), 'Nasubi-reading plan must remain a proposal without demonstrated contest effect');

  const kacho400 = archive.getCharacterStateAtChapter('character:kacho-hui-guo-rou', 400);
  assert(kacho400?.life === 'dead', 'human Kacho must remain dead at Chapter 400');
  assert(/Without You/i.test(text(kacho400)) && /human consciousness.*unconfirmed|consciousness.*unconfirmed/i.test(text(kacho400)), 'Kacho state must distinguish Without You from confirmed human-consciousness survival');

  const melody399 = archive.getAbilityKnowledgeAtChapter('ability:melody-aura-performance', 399);
  const melody400 = archive.getAbilityKnowledgeAtChapter('ability:melody-aura-performance', 400);
  assert(melody399?.known && melody400?.known, 'Melody ability must be known at both 399 and 400 boundaries');
  assert(!/covering the ears|intended to heal|unconsciousness.*side effect/i.test(text({ summary: melody399.summary, mechanics: melody399.mechanics })), 'Chapter 400 Melody explanation must not leak into Chapter 399');
  assert(/covering the ears/i.test(text({ summary: melody400.summary, mechanics: melody400.mechanics })) && /heal/i.test(text({ summary: melody400.summary, mechanics: melody400.mechanics })) && /side effect/i.test(text({ summary: melody400.summary, mechanics: melody400.mechanics })), 'Chapter 400 Melody knowledge must include ear-covering, healing intent, and unconsciousness side effect');

  const worm399 = archive.getAbilityKnowledgeAtChapter('ability:magical-worm', 399);
  const worm400 = archive.getAbilityKnowledgeAtChapter('ability:magical-worm', 400);
  assert(worm399?.known && worm400?.known, 'Magical Worm must be known at both 399 and 400 boundaries');
  assert(!/multiple times|while she is alone|solo return/i.test(text({ summary: worm399.summary, mechanics: worm399.mechanics })), 'Chapter 400 repeated/solo Magical Worm vocabulary must not leak into Chapter 399');
  assert(/multiple/i.test(text({ summary: worm400.summary, mechanics: worm400.mechanics })) && /alone|solo/i.test(text({ summary: worm400.summary, mechanics: worm400.mechanics })), 'Chapter 400 Magical Worm knowledge must include repeated use and solo return');
  assert(/does not prove.*deterioration|does not.*repeated.*caused|relation.*unresolved/i.test(text({ summary: worm400.summary, mechanics: worm400.mechanics })), 'Magical Worm must not be made the proven cause of Fugetsu’s deterioration');

  const without399 = archive.getAbilityKnowledgeAtChapter('ability:without-you', 399);
  const without400 = archive.getAbilityKnowledgeAtChapter('ability:without-you', 400);
  assert(without399?.known && without400?.known, 'Without You must be known at both 399 and 400 boundaries');
  assert(!/bookcase|wall traversal|Fugetsu.*supplying aura/i.test(text({ summary: without399.summary, mechanics: without399.mechanics })), 'Chapter 400 Without You traversal/aura theory must not leak into Chapter 399');
  assert(/bookcase|wall/i.test(text({ summary: without400.summary, mechanics: without400.mechanics })), 'Chapter 400 Without You knowledge must preserve wall/bookcase traversal');
  assert(/not independently confirmed|theory|unconfirmed/i.test(text({ summary: without400.summary, mechanics: without400.mechanics })) && /Fugetsu.*aura|aura.*Fugetsu/i.test(text({ summary: without400.summary, mechanics: without400.mechanics })), 'Fugetsu aura-maintenance idea must remain a Kacho-form theory');

  const affliction399 = archive.getAbilityKnowledgeAtChapter('ability:fugetsu-unidentified-hostile-spirit-affliction', 399);
  const affliction400 = archive.getAbilityKnowledgeAtChapter('ability:fugetsu-unidentified-hostile-spirit-affliction', 400);
  assert(!affliction399?.known && affliction400?.known, 'Fugetsu hostile-spirit affliction must first become known at Chapter 400');
  assert((affliction400.ability?.ownerIds || []).length === 0 && affliction400.ability?.classification?.nenTypes?.includes('unknown'), 'hostile-spirit affliction must retain unknown owner and Nen type');
  assert(/exorcist/i.test(text(affliction400)) && /user.*unknown|responsible user.*unknown/i.test(text(affliction400)), 'affliction knowledge must preserve exorcist need and unknown source');
  assert(/No causal connection to Magical Worm|not.*Magical Worm/i.test(text(affliction400)), 'hostile-spirit condition must not be assigned to Magical Worm');

  const fugetsu400 = archive.getCharacterStateAtChapter('character:fugetsu-hui-guo-rou', 400);
  assert(fugetsu400?.life === 'alive', 'Fugetsu must remain alive at Chapter 400');
  assert(/Zetsu-like|hostile spirits|evil spirits/i.test(text(fugetsu400)), 'Fugetsu state must preserve severe aura/spirit deterioration');
  assert(/exorcist/i.test(text(fugetsu400)), 'Fugetsu state must preserve the urgent exorcist objective');

  const kaiser400 = archive.getCharacterStateAtChapter('character:kaiser', 400);
  assert(kaiser400?.life === 'alive', 'Kaiser must remain alive at Chapter 400');
  assert(/No personal Nen ability|No personal Nen|No.*Nen.*confirmed|No personal.*confirmed/i.test(text(kaiser400)), 'Kaiser must not receive a confirmed Chapter 400 Nen ability/type');
  assert(/Melody.*suspect|Melody suspects|remains her theory/i.test(text(kaiser400)), 'Kaiser manipulation must remain Melody’s theory');

  const justice400 = archive.getOrganizationStateAtChapter('organization:kakin-justice-bureau', 400);
  assert(justice400, 'Justice Bureau must have a Chapter 400 state');
  assert(/Special Martial Law.*not yet active|not.*active|future.*Special Martial Law/i.test(text(justice400)), 'Special Martial Law must remain a future contingency, not active Chapter 400 law');

  const coin = archive.getEntityById('event:zhang-lei-coin-vantine-negotiation-probe');
  assert(/coin.*1|coin marked.*1/i.test(text(coin)), 'Zhang Lei interview must preserve the coin marked 1');
  assert(/inference|remains.*inference/i.test(text(coin)), 'Melody’s suspect elimination after the negotiation probe must remain inference');

  const contract = archive.getEntityById('event:kurapika-accepts-longhi-contract-tubeppa-collaboration');
  assert(/accept/i.test(text(contract)) && /Tubeppa/i.test(text(contract)), 'Chapter 400 endpoint must preserve contract acceptance and Tubeppa collaboration');
  assert(!/Moonlight Act/i.test(String(contract?.summary || '')), 'Moonlight Act must not be imported into the Chapter 400 canonical event');
  assert(/terms.*unsupplied|terms.*not.*reproduce|terms.*unresolved/i.test(text(contract)), 'contract terms must remain unavailable at Chapter 400 boundary');
  const longhi400 = archive.getCharacterStateAtChapter('character:longhi', 400);
  assert(/already.*Nen|Nen.*already/i.test(text(longhi400)), 'Longhi state must preserve that she already uses Nen');
  assert(!/Moonlight Act/i.test(text(longhi400)), 'Longhi Chapter 400 state must not import Moonlight Act');

  const publicTimeline400 = timeline.successionDays.flatMap((day) => day.events).filter((event) => event.chapter === 400);
  assert(publicTimeline400.length === chapterModule.succession400TimelineEvents.length, 'public timeline must expose all 17 maintained Chapter 400 beats');
  assert(publicTimeline400.some((event) => event.id === '400-tier2-hideout-confirmed-mafia-custom-theories'), 'public timeline must contain the Tier 2 confirmation beat');
  assert(publicTimeline400.some((event) => event.id === '400-melody-detects-fugetsu-evil-spirits'), 'public timeline must contain Fugetsu’s hostile-spirit diagnosis');
  assert(publicTimeline400.some((event) => event.id === '400-longhi-contract-kurapika-tubeppa-collaboration'), 'public timeline must contain the Longhi/Kurapika endpoint');

  assert((dossier.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 400')), 'active dossier must include the modern Chapter 400 group');
  assert(!(frozen399.guardAssignmentGroups || []).some((group) => group.group?.includes('Chapter 400')), 'frozen through-399 dossier must remain unaware of modern Chapter 400');
  assert((dossier.successionMysteries || []).some((record) => record.lastChapter === '400' && /Fugetsu.*hostile|hostile.*Fugetsu/i.test(String(record.question || ''))), 'active dossier must preserve Fugetsu hostile-condition mystery');
  assert((dossier.successionResolvedQuestions || []).some((record) => record.chapter === 400 && /broad tier|transmitter/i.test(String(record.question || ''))), 'active dossier must publish the Tier 2 localization resolution');

  const note = fs.readFileSync('docs/source-notes/chapter-400.md', 'utf8').replace(/\s+/g, ' ');
  assert(/Human Kacho remains dead/i.test(note), 'source note must preserve human Kacho’s death');
  assert(/Phinks-specific limitations/i.test(note), 'source note must keep Phinks En limitations personal');
  assert(/does not.*Morena personally created|not as omniscient confirmation.*Morena/i.test(note), 'source note must preserve Morena spatial-ownership uncertainty');
  assert(/Special Martial Law is not declared or active in Chapter 400/i.test(note), 'source note must keep martial law inactive');
  assert(/does not.*repeated Magical Worm use caused|not.*Magical Worm.*caused/i.test(note), 'source note must reject Magical Worm causation overreach');
  assert(/does not reproduce the contract’s terms/i.test(note) && /Moonlight Act/i.test(note), 'source note must quarantine later Longhi contract mechanics');
  assert(/no Chapter 401\+ consequence or mechanic is backfilled/i.test(note), 'source note must explicitly stop before Chapter 401+');

  console.log(`Chapter 400 boundary audit passed: ${dedicatedEventIds.length} dedicated canonical events plus ${projected400.length} maintained-research projections preserve the Tier 2 localization, Phinks-specific En limits, human-Kacho/Without-You separation, Fugetsu ability/affliction firewall, inactive martial-law contingency, and Longhi-contract stopping point.`);
} finally {
  await vite.close();
}
