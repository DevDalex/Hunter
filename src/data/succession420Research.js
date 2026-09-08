import { succession420TimelineEvents } from './succession420EventPacket.js';

const freeze = (value) => Object.freeze(value);
const source420 = 'https://hunterxhunter.fandom.com/wiki/Chapter_420';
const viz420 = 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-420/chapter/51204';

export { succession420TimelineEvents };

export const succession420SourcePolicy = freeze({
  reviewedAt:'2026-09-09',
  soleSubstantiveSource:freeze({
    label:'User-supplied Chapter 420 synopsis',
    basis:'The synopsis supplied directly in chat is the sole substantive Chapter 420 story source for this integration. VIZ is used only to verify publication date and official-reader identity.',
    referenceUrl:source420,
  }),
  titleRule:'The supplied synopsis did not provide an official English or Japanese chapter title. Keep generic Chapter 420 labelling until maintained title metadata is verified.',
  publicationCeiling:'Chapter 420 is the current publication ceiling at this integration boundary.',
  chronologyRule:'Chapter 420 continues directly from the Chapter 419 casino endpoint on Voyage Day 12 under Special Martial Law, follows Tserriednich through his encounter with Hisoka, then carries him through the emergency-exit route to the exterior Tier 1 main-deck area.',
  inferenceRule:'Hisoka is directly seen in the casino and repeatedly associated by wound pattern and timing with the corpse trail, but responsibility for every throat-slit soldier is Tserriednich’s strong inference rather than an omnisciently witnessed sequence. Hisoka’s exact perception of the Guardian Spirit Beast and real Tserriednich is unresolved.',
  abilityRule:'Chapter 420 demonstrates tactical reuse of the approximately thirty-six-meter range model, successful divergence from a predicted lethal Hisoka outcome, continued sustained-Zetsu operation, a new sub-one-second Zetsu training goal, and an approaching practical duration/recharge constraint without a numeric exhaustion formula.',
  stoppingPoint:'Outside Tier 1, Tserriednich sees the connecting area filled with Royal Army soldiers and the bridges gone, then considers dropping Zetsu as a third strategic option that would open two unrevealed branches.',
  futureRule:'Do not invent which branch Tserriednich chooses, what the two Zetsu-release options are, whether he reaches Tier 2, whether Hisoka follows him, how the Royal Army responds, or any Chapter 421+ consequence.',
});

const focus = 'Chapter 420 converts the Chapter 419 casino endpoint into a direct Tserriednich–Hisoka collision. Tserriednich finds Royal Army soldiers systematically killed by throat cuts, spots Hisoka gambling in the emptied casino, tries to bring him into the approximately thirty-six-meter operating model, and instead is forced into an immediate future-sight response when Hisoka appears behind him. The predicted future shows Hisoka killing him, but Tserriednich diverges and survives while watching Hisoka react to an unexplained Nen/perception anomaly. The encounter exhilarates Tserriednich and sharpens his training goal to sub-one-second Zetsu. He then follows the corpse trail through the emergency exit, reaches the exterior Tier 1 main-deck area, discovers the connecting bridges gone and the route saturated with Royal Army soldiers, and ends the chapter considering whether dropping Zetsu opens a better strategic branch.';

export const succession420ChapterResearch = freeze([freeze({
  number:420,
  title:'Chapter 420',
  japaneseTitle:null,
  phase:'Current releases',
  voyageDay:'Voyage Day 12',
  lanes:freeze(['Royal contest','Tserriednich ability development','Hisoka encounter','Special Martial Law','Perception / reality mechanics','Tier 1 escape','Royal Army lockdown']),
  focus,
  events:succession420TimelineEvents,
  prelude:freeze([]),
  locations:freeze([
    'Black Whale · Tier 1 · VVIP casino',
    'Black Whale · Tier 1 · casino / emergency-exit route',
    'Black Whale · Tier 1 · emergency exit · spiral staircase',
    'Black Whale · Tier 1 · exterior main deck',
  ]),
  characters:freeze(['Tserriednich Hui Guo Rou','Hisoka Morow','Nasubi Hui Guo Rou']),
  threadLabels:freeze(['Tserriednich','Hisoka','Parallel Future','Laplace terminology','Zetsu','36-meter radius','Guardian Spirit Beast','Nen perception anomaly','Special Martial Law','Royal Army','casino','emergency exit','connecting bridges']),
  confidence:freeze([
    '29 chapter-bounded beats are taken only from the user-supplied Chapter 420 synopsis.',
    'VIZ independently verifies Chapter 420 publication on September 6, 2026 and the official reader URL; no VIZ story content is imported.',
    'Hisoka is directly seen in the casino; responsibility for the entire throat-slit corpse trail remains Tserriednich’s strong inference rather than an omnisciently shown sequence.',
    'The Hisoka throat-slitting of Tserriednich occurs in the predicted/imposed future and must not be represented as Tserriednich’s actual death.',
    'Hisoka appears to detect an anomaly and looks toward the expected Guardian Spirit Beast position and then toward the real Tserriednich, but the exact Nen sensory mechanism is unresolved.',
    'Tserriednich explicitly resolves to reduce his Zetsu activation time below one second.',
    'The exterior endpoint establishes missing bridges and dense Royal Army presence but does not establish a completed Tier 2 route.',
    'Chapter 420 is the current publication ceiling; no Chapter 421+ consequence is invented.',
  ]),
  status:'Strict maintained Chapter 420 packet: casino lockdown, throat-slit Royal Army corpse trail, direct Hisoka encounter, predicted lethal future versus real evasion, unresolved Hisoka anomaly detection, sub-one-second Zetsu growth target, emergency-exit traversal, exterior Tier 1 bridge/military blockade, unrevealed Zetsu-release branches, and Chapter 421+ spoiler firewall',
  coverage:freeze({ identity:true,publication:true,summary:true,sceneSummary:true,chronology:true,appearances:true,locations:true,relationships:true,assignments:true,nen:true,source:true }),
  lastReviewed:'September 9, 2026',
  releaseDate:'September 6, 2026',
  titleStatus:'official-title-not-supplied',
  officialReaderUrl:viz420,
  source:source420,
  crossChecks:freeze([
    succession420SourcePolicy.soleSubstantiveSource,
    freeze({ label:'VIZ Chapter 420 publication metadata', basis:'Official VIZ page verifies chapter number, release date, and reader identity only.', referenceUrl:viz420 }),
  ]),
})]);

export const succession420ChapterFocus = freeze({ 420:focus });

export const succession420NenFindings = freeze([
  freeze({ subject:'Parallel Future · lethal-future divergence against Hisoka', finding:'The future shows Hisoka slitting Tserriednich’s throat, but Tserriednich immediately diverges from that sequence and survives while the imposed future continues playing out around Hisoka.', status:'demonstrated', source:source420 }),
  freeze({ subject:'Parallel Future · continued range model use', finding:'Tserriednich tactically approaches Hisoka using the approximately thirty-six-meter operational estimate established in Chapter 419.', status:'demonstrated operational use', source:source420 }),
  freeze({ subject:'Hisoka · perception anomaly', finding:'Hisoka appears to notice that something is wrong, checks the expected Guardian Spirit Beast position, and then looks toward the real Tserriednich; the exact sensory information and Nen method remain unresolved.', status:'demonstrated anomaly / mechanism unresolved', source:source420 }),
  freeze({ subject:'Tserriednich · Zetsu training target', finding:'After the encounter, Tserriednich resolves to reduce his Zetsu activation time to under one second.', status:'explicit training goal', source:source420 }),
  freeze({ subject:'Parallel Future · practical duration pressure', finding:'By the exterior Tier 1 endpoint, Tserriednich uses a harsher estimate and judges his remaining operating time close to depletion, considering hiding until the ability recharges or dropping Zetsu.', status:'demonstrated strategic constraint / exact duration unresolved', source:source420 }),
]);

export const succession420Mysteries = freeze([
  freeze({ question:'What exactly can Hisoka perceive during the imposed future?', evidence:'Hisoka reacts to an anomaly, looks toward the expected Guardian Spirit Beast position, and then looks toward the real Tserriednich, but Chapter 420 does not identify the exact Nen sense or information available to him.', status:'open', lastChapter:'420', source:source420 }),
  freeze({ question:'Did Hisoka kill every Royal Army soldier in the casino and emergency-exit corpse trail?', evidence:'The bodies share the same throat-slitting pattern and Tserriednich becomes confident Hisoka caused the trail, but the chapter does not directly depict every killing.', status:'strong inference / not omnisciently witnessed', lastChapter:'420', source:source420 }),
  freeze({ question:'What are the two options that become available if Tserriednich drops Zetsu?', evidence:'The chapter states that releasing Zetsu opens two additional choices but ends before identifying them.', status:'open at publication ceiling', lastChapter:'420', source:source420 }),
  freeze({ question:'Can Tserriednich reach Tier 2 after finding the bridges gone and the exterior route saturated with soldiers?', evidence:'Chapter 420 materially updates the obstacle but ends before a route is selected or completed.', status:'open at publication ceiling', lastChapter:'420', source:source420 }),
  freeze({ question:'What is the exact remaining-duration and recharge model for the sustained ability?', evidence:'Tserriednich judges his remaining time conservatively and considers waiting for recharge, but no numeric reserve or recharge rate is supplied.', status:'open', lastChapter:'420', source:source420 }),
]);

export const succession420ResolvedQuestions = freeze([
  freeze({ question:'What happens when Tserriednich reaches the Chapter 419 casino endpoint?', answer:'He discovers a trail of throat-slit Royal Army corpses and directly encounters Hisoka Morow gambling inside the Tier 1 casino.', chapter:420, source:source420 }),
  freeze({ question:'Does Hisoka’s predicted throat-slitting kill the real Tserriednich?', answer:'No. The death occurs in the displayed/imposed future; Tserriednich jumps away and survives.', chapter:420, source:source420 }),
  freeze({ question:'Does the casino encounter change Tserriednich’s Nen-development goal?', answer:'Yes. The encounter motivates him to push his Zetsu activation time below one second.', chapter:420, source:source420 }),
  freeze({ question:'Does Tserriednich complete the Tier 2 escape route in Chapter 420?', answer:'No. He reaches the exterior Tier 1 main-deck area, finds the bridges gone and soldiers massed in the connecting area, then ends the chapter weighing options.', chapter:420, source:source420 }),
  freeze({ question:'What is the strict Chapter 420 endpoint?', answer:'Tserriednich considers dropping Zetsu as a third option that would open two additional unrevealed choices.', chapter:420, source:source420 }),
]);
