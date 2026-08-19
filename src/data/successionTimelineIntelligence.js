import { successionDays, successionPrelude } from './successionTimeline.js';
import { succession385Mysteries, succession385ResolvedQuestions } from './succession385Research.js';
import { succession416Mysteries, succession416ResolvedQuestions } from './succession416Research.js';
import { succession417Mysteries, succession417ResolvedQuestions } from './succession417Research.js';

const freeze = (value) => Object.freeze(value);
const chapterSource = (chapter) => `https://hunterxhunter.fandom.com/wiki/Chapter_${chapter}`;
const normalizeText = (value) => String(value || '').toLowerCase();
const chapterFromPrelude = (period) => Number(String(period.chapters || '').match(/\d{3}/)?.[0] || 0);

export const timelinePrinceProfiles = freeze([
  freeze({ order: 1, name: 'Benjamin Hui Guo Rou', shortName: 'Benjamin', terms: freeze(['benjamin']), status: 'Alive and operational under Special Martial Law, while carrying Moswana’s curse and a self-disclosed TSK-17 infection/deadline.', statusChapter: 417 }),
  freeze({ order: 2, name: 'Camilla Hui Guo Rou', shortName: 'Camilla', terms: freeze(['camilla']), status: 'Alive. Her death-triggered counter remains a deterrent, while Benjamin has infected her with TSK-17.', statusChapter: 417 }),
  freeze({ order: 3, name: 'Zhang Lei Hui Guo Rou', shortName: 'Zhang Lei', terms: freeze(['zhang lei', 'zhang-lei']), status: 'Alive. His Guardian Spirit Beast coins remain an active, incompletely understood system; he moved away from Tier 1 before martial-law consolidation.', statusChapter: 417 }),
  freeze({ order: 4, name: 'Tserriednich Hui Guo Rou', shortName: 'Tserriednich', terms: freeze(['tserriednich']), status: 'Shot by Benjamin. Chapter 417 preserves Salkov’s uncertainty about whether the battered body and surrounding scene are fully real.', statusChapter: 417 }),
  freeze({ order: 5, name: 'Tubeppa Hui Guo Rou', shortName: 'Tubeppa', terms: freeze(['tubeppa']), status: 'Alive at the current boundary and directly exposed to Benjamin’s second TSK-17 operation in Room 1001.', statusChapter: 417 }),
  freeze({ order: 6, name: 'Tyson Hui Guo Rou', shortName: 'Tyson', terms: freeze(['tyson']), status: 'Alive at the current boundary and directly exposed to Benjamin’s second TSK-17 operation in Room 1001.', statusChapter: 417 }),
  freeze({ order: 7, name: 'Luzurus Hui Guo Rou', shortName: 'Luzurus', terms: freeze(['luzurus']), status: 'Alive at the current boundary, navigating pre-declaration military pressure and Benjamin’s operations around Room 1007.', statusChapter: 417 }),
  freeze({ order: 8, name: 'Salé-salé Hui Guo Rou', shortName: 'Salé-salé', terms: freeze(['salé-salé', 'sale-sale', 'sale sale']), status: 'Dead. His elimination removes one prince and transfers his Guardian Spirit Beast from an active contestant to historical record.', statusChapter: 382 }),
  freeze({ order: 9, name: 'Halkenburg Hui Guo Rou', shortName: 'Halkenburg', terms: freeze(['halkenburg']), status: 'Original body dead; the Balsamilco/Halkenburg body-transfer conflict remains central to Benjamin’s investigation and strategy.', statusChapter: 417 }),
  freeze({ order: 10, name: 'Kacho Hui Guo Rou', shortName: 'Kacho', terms: freeze(['kacho']), status: 'Dead after the failed escape. Her Guardian Spirit Beast, Without You, continues in Kacho’s form beside Fugetsu.', statusChapter: 383 }),
  freeze({ order: 11, name: 'Fugetsu Hui Guo Rou', shortName: 'Fugetsu', terms: freeze(['fugetsu']), status: 'Alive under Justice protection, with the failed escape, Nen marks/spirits, and her connection to Kacho’s continuing beast still active.', statusChapter: 417 }),
  freeze({ order: 12, name: 'Momoze Hui Guo Rou', shortName: 'Momoze', terms: freeze(['momoze']), status: 'Dead after her guard detail was weakened and she was murdered on Voyage Day 1.', statusChapter: 368 }),
  freeze({ order: 13, name: 'Marayam Hui Guo Rou', shortName: 'Marayam', terms: freeze(['marayam']), status: 'Alive inside the Guardian Spirit Beast-created isolation affecting Room 1013; the exact spatial mechanics remain unresolved.', statusChapter: 417 }),
  freeze({ order: 14, name: 'Woble Hui Guo Rou', shortName: 'Woble', terms: freeze(['woble']), status: 'Current maintained Chapter 412+ research treats Oito’s daughter Woble’s location as unresolved while Room 1014 continues as a central Kurapika/Oito defensive node.', statusChapter: 417 }),
]);

const causality = [
  ['Kurapika proposes Nen lessons', 365,
    'Room 1014 has been devastated by hidden Nen threats, Guardian Spirit Beasts, and Benjamin’s pressure. Kurapika needs a way to slow the contest and reduce the information advantage held by experienced Nen users.',
    'Kurapika publicly offers Nen instruction to the prince households.',
    'Representatives converge on Room 1014 and Nen knowledge begins spreading beyond the original specialists.',
    'The class becomes a recurring battlefield for Silent Majority, royal surveillance, curse operations, alliance-building, and Kurapika’s broader delaying strategy.'],
  ['Momoze is murdered', 368,
    'Sevanti moved most of Momoze’s guards to Marayam, leaving the Twelfth Prince dangerously exposed.',
    'Momoze is murdered in her room.',
    'Hanzo’s investigation becomes personal and the royal family has another confirmed fatality.',
    'Hanzo later extracts a confession and kills Tuffdy, while the contest’s vulnerability of under-protected princes becomes impossible to ignore.'],
  ['Camilla attacks Benjamin', 373,
    'Camilla rejects Benjamin’s authority and deliberately confronts him inside the succession conflict.',
    'Camilla shoots Musse and attacks Benjamin, triggering her own death and Cat’s Name counteraction.',
    'Camilla revives while Benjamin gains direct evidence of her counteractive ability and inherits Musse’s surveillance ability.',
    'Benjamin later plans around the danger of killing Camilla directly and turns to disease/indirect-kill logic in Chapter 416.'],
  ['Magical Worm opens', 374,
    'Fugetsu’s Guardian Spirit Beast has begun providing a door/tunnel ability linked to her bond with Kacho.',
    'Fugetsu enters the generated tunnel and reaches Kacho’s room.',
    'The twins obtain a practical escape route that appears to bypass ordinary ship movement.',
    'The ability becomes the foundation of the Sunday-banquet escape attempt, which collides with the Seed Urn contest’s anti-escape rule.'],
  ['Kacho dies outside the ship', 383,
    'Kacho, Fugetsu, Melody, and Keeney exploit the banquet performance to attempt an escape from the Black Whale.',
    'The escape restriction of the succession ritual kills Kacho after the lifeboat leaves the ship.',
    'Fugetsu loses Kacho physically, but the Guardian Spirit Beast Without You manifests in Kacho’s form.',
    'Justice custody, Fugetsu’s deteriorating Nen situation, and the concealed continuation of “Kacho” become a major long-running thread.'],
  ['Halkenburg possesses Balsamilco', 403,
    'Balsamilco approaches Halkenburg’s legal route intending to deploy TSK-17, while Halkenburg has supporters capable of powering his collective ability.',
    'Halkenburg transfers into Balsamilco’s body during the courthouse operation.',
    'Benjamin’s most trusted commander becomes an unreliable identity from Benjamin’s perspective, while Halkenburg gains a route inside Benjamin’s command structure.',
    'The original Halkenburg body dies, the funeral becomes operational cover, and Benjamin’s later investigation focuses on body-transfer markers and Balsamilco’s identity.'],
  ['Beyond’s curse children are revealed', 401,
    'Longhi enters Room 1014 and uses Moonlight Act to formalize truth-testing and contractual terms with Kurapika.',
    'Longhi reveals that Beyond is her father and describes curse children planted among royal guards.',
    'Kurapika’s problem expands from protecting Woble and controlling Nen information to investigating Beyond’s hidden succession operation.',
    'The possibility of Beyond having a royal child becomes a strategic question tied to the Seed Urn contest and later Room 1014 planning.'],
  ['Special martial law is declared', 409,
    'The succession struggle, lower-tier mafia war, funeral movement, and Benjamin’s emergency preparations converge into a security crisis.',
    'Special Martial Law is declared and the Tier 2/3 bulkhead closes.',
    'Movement, legal authority, and access across the Black Whale change immediately under military control.',
    'Benjamin begins using emergency authority as a succession weapon, Justice becomes a contested institution, and prince-by-prince coercive operations accelerate.'],
  ['Dust in the Wind: Hell Fruit activates', 416,
    'Camilla’s faction spent years preparing a Have-Not curse operation aimed at Benjamin, with Moswana positioned as the sacrificial trigger.',
    'Moswana dies in Benjamin’s presence and Dust in the Wind: Hell Fruit activates.',
    'A visible post-mortem curse strikes Benjamin and produces darkened markings while he remains operational.',
    'Benjamin’s already-limited campaign gains another unresolved lethal pressure, which he later discloses alongside TSK-17 and possible Beyond-curse exposure.'],
  ['Benjamin silently infects Camilla with TSK-17', 416,
    'Benjamin knows killing Camilla directly risks activating her counteractive resurrection ability, so he probes whether disease can bypass the killer/aura condition.',
    'Benjamin infects Camilla with TSK-17 without announcing it.',
    'Camilla remains alive, but her survival is now linked to an unresolved disease-versus-counteractive-ability interaction.',
    'Chapter 417 shows Benjamin continuing to weaponize TSK-17 against other princes while treating disease timing as part of his succession endgame.'],
  ['Benjamin shoots Tserriednich', 416,
    'Benjamin moves from Camilla’s residence to Room 1004 under Special Martial Law while Tserriednich is maintaining Zetsu and preparing a staged-death contingency.',
    'Benjamin fires on Tserriednich before the Fourth Prince can finish his proposed spar/conversation.',
    'Tserriednich is thrown across the room and Chapter 416 ends without confirming his immediate condition.',
    'Chapter 417 turns the apparent result into a reality problem: Benjamin acts as though Tserriednich is defeated while Salkov continues testing whether the body and scene are genuine.'],
  ['Borksen selects Yes', 410,
    'Morena’s rule-bound negotiation game constrains Borksen’s possible outcomes while Heil-Ly seeks a valuable new member from the military group.',
    'Borksen ends the game on Yes after the marked-card tactic is detected.',
    'The negotiation reaches the Heil-Ly membership outcome defined by the game rather than a normal voluntary recruitment conversation.',
    'Borksen’s relationship to Morena, Contagion, and the lower-tier conflict becomes part of the continuing Heil-Ly storyline.'],
];

export const timelineCausality = freeze(causality.map(([match, chapter, cause, event, consequence, leadsTo]) => freeze({ match, chapter, cause, event, consequence, leadsTo })));

export const timelineDayChanges = freeze([
  freeze({ day: 1, headline: 'The contest stops being theoretical.', developments: freeze(['The Black Whale departs and the Succession Contest begins.', 'Room 1014 loses most of its original defense and Kurapika publicly exposes Nen/Guardian Spirit Beast involvement.', 'Momoze is murdered after her protection is weakened.']), nen: freeze(['Guardian Spirit Beasts become operationally visible to Kurapika.', 'Oito/Kurapika use borrowed Little Eye reconnaissance.']), carry: freeze(['Kurapika’s Nen-class delaying strategy', 'Momoze murder investigation', 'Benjamin surveillance pressure']) }),
  freeze({ day: 2, headline: 'Nen education becomes a contested political space.', developments: freeze(['The first public Nen class begins and Silent Majority kills inside it.', 'Hanzo avenges Momoze.', 'Camilla’s attack demonstrates Cat’s Name and Benjamin’s surveillance inheritance.']), nen: freeze(['Silent Majority remains active.', 'Cat’s Name proves a death-triggered counteractive resurrection mechanic.', 'Marayam’s room is confirmed to be Nen-isolated.']), carry: freeze(['Second Nen class', 'Camilla/Benjamin counter-strategy', 'Marayam isolation']) }),
  freeze({ day: 3, headline: 'Several prince abilities move from rumor to observable systems.', developments: freeze(['Fugetsu’s door route becomes usable.', 'Zhang Lei’s coins begin appearing.', 'Halkenburg’s collective aura becomes a shipwide signal.', 'Tserriednich is confirmed as a Specialist.']), nen: freeze(['Magical Worm', 'Zhang Lei coin production', 'Halkenburg collective aura', 'Tserriednich Specialization']), carry: freeze(['Twin escape planning', 'Halkenburg confrontation with Nasubi', 'Tserriednich accelerated training']) }),
  freeze({ day: 4, headline: 'The lower-tier war joins the royal contest.', developments: freeze(['The Phantom Troupe, Xi-Yu, Cha-R, and Heil-Ly begin colliding over access and targets.', 'The twins continue escape preparations.', 'Royal and criminal conflicts now share the same ship corridors.']), nen: freeze(['Heil-Ly ability infrastructure becomes increasingly relevant.', 'Fugetsu continues testing Magical Worm.']), carry: freeze(['Heil-Ly hunt', 'Hisoka search', 'Sunday escape plan']) }),
  freeze({ day: 5, headline: 'The contest’s information wars deepen.', developments: freeze(['Prince camps refine surveillance and alliance strategies.', 'Nen training, Guardian Spirit Beast analysis, and lower-tier searches continue in parallel.']), nen: freeze(['Ability knowledge spreads beyond initial users.', 'Hidden operators remain dangerous because mechanics are still incomplete.']), carry: freeze(['Nen classes', 'Mafia/Troupe search', 'Prince surveillance']) }),
  freeze({ day: 6, headline: 'Preparation dominates before the Sunday convergence.', developments: freeze(['Major factions reposition for the banquet and lower-tier conflict.', 'Royal guards and Nen users continue testing conditions and counters.']), nen: freeze(['Multiple abilities are being prepared rather than resolved.']), carry: freeze(['Sunday banquet', 'Theta assassination plan', 'Troupe/mafia negotiations']) }),
  freeze({ day: 7, headline: 'Major plans lock into place.', developments: freeze(['Halkenburg’s side studies body-transfer outcomes.', 'Tserriednich’s Zetsu training becomes an assassination setup.', 'The Troupe offers to destroy Heil-Ly in exchange for access.']), nen: freeze(['Body-transfer consequences become an explicit research problem.', 'Tserriednich develops a second personal Nen beast and begins Zetsu training.']), carry: freeze(['Sunday banquet', 'Theta assassination attempt', 'Heil-Ly access deal']) }),
  freeze({ day: 8, headline: 'The Sunday banquet detonates several storylines at once.', developments: freeze(['Theta’s assassination attempt reveals Tserriednich’s temporal anomaly.', 'Melody creates the twins’ escape window.', 'Kacho dies outside the ship and Without You manifests.']), nen: freeze(['Tserriednich’s Zetsu-linked temporal phenomenon is demonstrated but not fully explained.', 'Without You continues Kacho’s form after her death.']), carry: freeze(['Justice custody', 'Tserriednich ability analysis', 'Fugetsu/Kacho continuation']) }),
  freeze({ day: 9, headline: 'Justice becomes both refuge and battlefield.', developments: freeze(['Melody, Fugetsu, and Kacho’s continuing beast remain under Justice protection.', 'Halkenburg’s possession experiments continue against Benjamin’s side.', 'Kurapika advances mass Nen initiation.']), nen: freeze(['Halkenburg body-transfer outcomes are tested.', 'More Nen students are awakened.']), carry: freeze(['Halkenburg/Benjamin conflict', 'Kurapika alliance network', 'Fugetsu protection']) }),
  freeze({ day: 10, headline: 'The royal and lower-tier wars fully converge.', developments: freeze(['Longhi reveals Beyond’s curse-child operation.', 'Kurapika forms a conditional treaty with Tubeppa.', 'The mafia/Troupe/Heil-Ly war escalates through traps, disguises, and killings.', 'Benjamin’s side prepares TSK-17 against Halkenburg.']), nen: freeze(['Moonlight Act is used as a contractual truth mechanism.', 'Beyond’s curse-child system becomes part of the succession problem.', 'Zhang Lei coin progression and Tubeppa’s Guardian Spirit Beast advance.']), carry: freeze(['Beyond royal-child question', 'Halkenburg assassination route', 'Heil-Ly hideout war']) }),
  freeze({ day: 11, headline: 'Halkenburg turns Benjamin’s assassination route inside out.', developments: freeze(['Halkenburg possesses Balsamilco.', 'Kacho’s letters move through Tier 1.', 'Kurapika tests Zhang Lei’s coin behavior.', 'The original Halkenburg body enters a staged fatal decline.']), nen: freeze(['Halkenburg’s possession becomes a command-structure problem.', 'Zhang Lei’s holder-linked coin behavior gains more evidence.']), carry: freeze(['Halkenburg funeral operation', 'Benjamin suspicion', 'Expanded Nen class']) }),
  freeze({ day: 12, headline: 'Special Martial Law becomes the arc’s immediate operating condition.', developments: freeze(['The funeral, Room 1014, Heil-Ly, Chrollo, and royal military operations collide.', 'Special Martial Law closes movement routes and expands Benjamin’s authority.', 'Benjamin is cursed, infects Camilla with TSK-17, attacks Room 1004, and later expands TSK-17 operations.', 'Chapter 417 ends with Benjamin planning to confront Unma over Halkenburg/Beyond/Furykov.']), nen: freeze(['Hell Fruit activates against Benjamin.', 'TSK-17 becomes a prince-targeting succession weapon.', 'Tserriednich’s reality/illusion problem remains unresolved.', 'Gypsy Life: Bohemian Rhapsody mechanics are revealed.']), carry: freeze(['Benjamin’s layered deadlines', 'Tserriednich reality check', 'Unma confrontation', 'Tubeppa/Tyson TSK-17 outcome', 'Halkenburg/Balsamilco identity conflict']) }),
]);

export const timelineDeadlines = freeze([
  freeze({ id: 'kurapika-two-week-delay', label: 'Kurapika’s Nen-class delay strategy', chapter: 365, status: 'ongoing strategy', timing: 'Two-week instructional horizon', detail: 'Kurapika proposes a prolonged Nen-training program to slow immediate killings, spread deterrence, and buy time for Woble’s faction.', evidence: 'Kurapika strategy stated during the early voyage.', source: chapterSource(365) }),
  freeze({ id: 'twins-sunday-escape', label: 'Kacho/Fugetsu Sunday escape window', chapter: 383, status: 'failed / completed', timing: 'Sunday banquet · Melody performance window', detail: 'Melody and Keeney create a short opening for the twins to leave the ship. The attempt fails because the succession ritual prevents escape and Kacho dies.', evidence: 'Dated banquet operation and immediate aftermath.', source: chapterSource(383) }),
  freeze({ id: 'theta-zetsu-window', label: 'Theta’s sustained-Zetsu assassination window', chapter: 385, status: 'failed', timing: 'Approx. forty-minute Zetsu setup', detail: 'Theta attempts to keep Tserriednich in sustained Zetsu long enough to create what she believes is a defenseless assassination opportunity.', evidence: 'Theta’s plan and attempt are explicit; the later ability mechanics remain separate.', source: chapterSource(385) }),
  freeze({ id: 'halkenburg-funeral-schedule', label: 'Halkenburg funeral procession schedule', chapter: 411, status: 'executed amid escalation', timing: 'Departure around 13:00; Tier 1 arrival planned around 14:00', detail: 'Halkenburg-as-Balsamilco uses the funeral movement as part of a broader operational plan while security pressure rises.', evidence: 'Schedule stated in Chapter 411 chronology.', source: chapterSource(411) }),
  freeze({ id: 'ritual-festival-deadline', label: 'Succession ritual political deadline', chapter: 412, status: 'active interpretation', timing: 'Before the festival / successor-establishment window', detail: 'Kurapika argues that failure to establish a successor before the festival could break the Hui Guo Rou family’s political power.', evidence: 'Kurapika analysis, not an omniscient confirmed ritual rule.', source: chapterSource(412) }),
  freeze({ id: 'benjamin-ten-hour-limit', label: 'Benjamin’s incapacitation deadline', chapter: 416, status: 'active at Chapter 416', timing: 'Ten hours remaining', detail: 'Benjamin internally states that ten hours remain before he is incapacitated and that he must finish the Succession Contest first.', evidence: 'Benjamin internal timeline; cause/outcome not extended beyond the chapter.', source: chapterSource(416) }),
  freeze({ id: 'benjamin-tsk17-half-day', label: 'Benjamin’s TSK-17 self-prognosis', chapter: 417, status: 'active self-assessment', timing: 'Approximately half a day', detail: 'Benjamin tells Balsamilco and Coventoba that he is infected with TSK-17 and has roughly half a day to live.', evidence: 'Benjamin self-disclosure; exact outcome is beyond the current endpoint.', source: chapterSource(417) }),
  freeze({ id: 'tubeppa-tyson-tsk17-projection', label: 'Tubeppa/Tyson TSK-17 projection', chapter: 417, status: 'projected / unresolved', timing: 'Benjamin’s projected disease window', detail: 'Benjamin treats Tubeppa and Tyson as infected after the Room 1001 operation and projects later deaths, but the publication boundary does not show those outcomes.', evidence: 'Exposure operation confirmed; death timing remains Benjamin’s projection.', source: chapterSource(417) }),
]);

export const timelineNenDevelopments = freeze([
  freeze({ chapter: 360, title: 'Guardian Spirit Beasts become an explicit operational fact', kind: 'system reveal', status: 'confirmed', detail: 'Kurapika recognizes invisible entities around the princes and publicly warns the royal households that Nen is involved.', source: chapterSource(360) }),
  freeze({ chapter: 373, title: 'Cat’s Name demonstrates counteractive resurrection', kind: 'ability reveal', status: 'confirmed', detail: 'Camilla revives after death by using a counteractive ability that kills the responsible attacker and restores her.', source: chapterSource(373) }),
  freeze({ chapter: 374, title: 'Magical Worm establishes Fugetsu’s door route', kind: 'Guardian Spirit Beast', status: 'confirmed use', detail: 'Fugetsu’s Guardian Spirit Beast opens a tunnel/door route that becomes central to the twins’ escape plan.', source: chapterSource(374) }),
  freeze({ chapter: 375, title: 'Zhang Lei’s Guardian Spirit Beast begins producing coins', kind: 'Guardian Spirit Beast', status: 'mechanics incomplete', detail: 'Numbered coins appear and later change with time/holder conditions, but the complete ability remains unresolved.', source: chapterSource(375) }),
  freeze({ chapter: 375, title: 'Halkenburg’s collective aura becomes detectable shipwide', kind: 'ability system', status: 'confirmed phenomenon', detail: 'A synchronized follower state produces a massive aura wave that later accompanies body-transfer attacks.', source: chapterSource(375) }),
  freeze({ chapter: 385, title: 'Tserriednich’s Zetsu-linked temporal anomaly appears', kind: 'ability discovery', status: 'observed / mechanics unresolved', detail: 'Theta perceives a lethal headshot, the outcome disappears, and witnesses describe a skipped interval while Tserriednich remains alive.', source: chapterSource(385) }),
  freeze({ chapter: 383, title: 'Without You manifests after Kacho’s death', kind: 'Guardian Spirit Beast', status: 'confirmed', detail: 'Kacho’s Guardian Spirit Beast continues in Kacho’s form beside Fugetsu after the failed escape kills Kacho.', source: chapterSource(383) }),
  freeze({ chapter: 401, title: 'Moonlight Act formalizes truth and contract conditions', kind: 'contract ability', status: 'confirmed use', detail: 'Longhi uses Moonlight Act to establish contractual terms and rule herself out as the Silent Majority user.', source: chapterSource(401) }),
  freeze({ chapter: 401, title: 'Beyond’s curse-child system enters the Succession Contest', kind: 'curse system', status: 'reported by Longhi', detail: 'Longhi describes children planted among royal guards as sacrificial curse vectors tied to Beyond’s hidden operation.', source: chapterSource(401) }),
  freeze({ chapter: 416, title: 'Dust in the Wind: Hell Fruit activates', kind: 'post-mortem curse', status: 'activation confirmed / final effect unresolved', detail: 'Moswana’s death releases a visible curse that strikes Benjamin and produces physical markings while he stays operational.', source: chapterSource(416) }),
  freeze({ chapter: 416, title: 'TSK-17 is used against Camilla', kind: 'disease weapon / Nen-linked succession tactic', status: 'infection confirmed', detail: 'Benjamin infects Camilla after explicitly probing how disease might interact with her death-triggered counter.', source: chapterSource(416) }),
  freeze({ chapter: 417, title: 'Gypsy Life: Bohemian Rhapsody mechanics are revealed', kind: 'Guardian Spirit Beast / inheritance mechanic', status: 'mechanics revealed / future use unresolved', detail: 'Benjamin explains a post-death fusion/inheritance process involving his Guardian Spirit Beast and Benjamin Baton, while no future transfer has yet occurred.', source: chapterSource(417) }),
]);

const curatedOpenQuestions = [
  freeze({ question: 'Who is the user of Silent Majority?', evidence: 'The ability repeatedly kills inside Kurapika’s Nen classes while apparent hosts and suspects do not resolve the operator’s identity.', status: 'open', lastChapter: '417', chapter: 369, source: chapterSource(369) }),
  freeze({ question: 'What are the complete rules and final purpose of Zhang Lei’s coins?', evidence: 'Coins are generated, change value, and appear holder-linked, but the full activation and end-state remain incomplete.', status: 'open', lastChapter: '417', chapter: 375, source: chapterSource(375) }),
  freeze({ question: 'What exactly is the isolated Room 1013 space around Marayam?', evidence: 'The room is inaccessible from the ordinary corridor while occupants remain reachable, indicating a Guardian Spirit Beast-created separation with incomplete rules.', status: 'open', lastChapter: '417', chapter: 372, source: chapterSource(372) }),
  freeze({ question: 'Which royal child, if any, is Beyond Netero’s child?', evidence: 'Longhi describes Beyond’s hidden succession operation and Kurapika accepts an obligation to investigate a possible royal child.', status: 'open', lastChapter: '417', chapter: 401, source: chapterSource(401) }),
  freeze({ question: 'What is the exact nature and origin of Fugetsu’s worsening Nen pressure?', evidence: 'Fugetsu remains under Justice protection while marks/spirits and the aftermath of the failed escape continue to create unresolved danger.', status: 'open', lastChapter: '417', chapter: 402, source: chapterSource(402) }),
  freeze({ question: 'How will the Heil-Ly, Phantom Troupe, mafia, and Hisoka conflict resolve?', evidence: 'The lower-tier war continues through hidden rooms, searches, killings, and competing objectives without a resolved endpoint.', status: 'open', lastChapter: '417', chapter: 405, source: chapterSource(405) }),
];

const normalizeMystery = (item, chapterFallback) => freeze({
  question: item.question,
  evidence: item.evidence || item.boundary || item.status || 'Maintained chapter research.',
  status: item.status || 'open',
  lastChapter: String(item.lastChapter || chapterFallback),
  chapter: Number(item.lastChapter || chapterFallback),
  source: item.source || chapterSource(chapterFallback),
});
const normalizeResolved = (item, chapterFallback) => freeze({
  question: item.question,
  answer: item.answer || item.resolution || item.evidence || 'Resolved in maintained chapter research.',
  chapter: Number(item.chapter || chapterFallback),
  status: 'resolved',
  source: item.source || chapterSource(chapterFallback),
});

export const timelineQuestions = freeze({
  open: freeze([
    ...curatedOpenQuestions,
    ...succession385Mysteries.map((item) => normalizeMystery(item, 385)),
    ...succession416Mysteries.map((item) => normalizeMystery(item, 416)),
    ...succession417Mysteries.map((item) => normalizeMystery(item, 417)),
  ]),
  resolved: freeze([
    ...succession385ResolvedQuestions.map((item) => normalizeResolved(item, 385)),
    ...succession416ResolvedQuestions.map((item) => normalizeResolved(item, 416)),
    ...succession417ResolvedQuestions.map((item) => normalizeResolved(item, 417)),
  ]),
});

const majorMatchers = freeze([
  'departure and official start',
  'kurapika proposes nen lessons',
  'momoze is murdered',
  'camilla attacks benjamin',
  'magical worm opens',
  'halkenburg petitions nasubi',
  'kacho dies outside the ship',
  'without you manifests',
  'halkenburg possesses balsamilco',
  'beyond’s curse children are revealed',
  "beyond's curse children are revealed",
  'special martial law is declared',
  'borksen selects yes',
  'dust in the wind: hell fruit activates',
  'benjamin silently infects camilla with tsk-17',
  'benjamin shoots tserriednich',
  'gypsy life',
]);

export const timelineImportance = (event) => {
  const text = normalizeText(`${event.title} ${event.detail} ${(event.tracks || []).join(' ')}`);
  if (majorMatchers.some((matcher) => text.includes(matcher))) return 'major';
  let score = 0;
  if (/\b(dies?|dead|killed|murder|assassin|possess|infect|curse|martial law|guardian spirit beast|nen|ability|escape|treaty|arrest|funeral)\b/i.test(text)) score += 2;
  if ((event.tracks || []).some((track) => ['ritual', 'kurapika', 'benjamin', 'tserriednich', 'halkenburg', 'twins', 'mafia', 'troupe', 'justice', 'expedition'].includes(track))) score += 1;
  if (/exact|\d{1,2}:\d{2}/i.test(`${event.time} ${event.confidence}`)) score += 1;
  return score >= 2 ? 'standard' : 'complete';
};

export const timingConfidenceForEvent = (event) => {
  const text = normalizeText(`${event.time} ${event.confidence}`);
  if (text.includes('exact')) return 'Exact time';
  if (text.includes('range') || /\d{1,2}:\d{2}.*[–-].*\d{1,2}:\d{2}/.test(String(event.time || ''))) return 'Explicit range';
  if (text.includes('approx')) return 'Approximate';
  if (text.includes('relative') || text.includes('shortly') || text.includes('later') || text.includes('before') || text.includes('after')) return 'Relative';
  if (text.includes('story-order') || text.includes('story order') || text.includes('presentation order')) return 'Story order';
  if (/\d{1,2}:\d{2}/.test(String(event.time || ''))) return 'Clock time stated';
  return 'Sequence only';
};

export const evidenceConfidenceForEvent = (event) => {
  const text = normalizeText(event.confidence);
  if (text.includes('hypothesis') || text.includes('speculation')) return 'Character hypothesis';
  if (text.includes('inference') || text.includes('assessment') || text.includes('interpretation')) return 'Character inference';
  if (text.includes('unresolved') || text.includes('not confirmed') || text.includes('not supplied')) return 'Confirmed event · unresolved meaning';
  if (text.includes('plan') || text.includes('question posed')) return 'Stated plan / question';
  if (text.includes('reported') || text.includes('statement')) return 'Character statement';
  return 'Confirmed event';
};

export const timelineCausalityForEvent = (event) => {
  const text = normalizeText(event.title);
  return timelineCausality.find((item) => Number(item.chapter) === Number(event.chapter) && text.includes(normalizeText(item.match)))
    || timelineCausality.find((item) => text.includes(normalizeText(item.match)))
    || null;
};

export const timelineNenForEvent = (event) => {
  const eventText = normalizeText(`${event.title} ${event.detail}`);
  return timelineNenDevelopments.filter((item) => Number(item.chapter) === Number(event.chapter)
    && (eventText.includes(normalizeText(item.title.split(' ').slice(0, 3).join(' ')))
      || normalizeText(item.detail).split(' ').some((word) => word.length > 7 && eventText.includes(word))));
};

const personTerms = freeze([
  ['Kurapika', ['kurapika']], ['Oito Hui Guo Rou', ['oito']], ['Bill', ['bill']], ['Longhi', ['longhi']], ['Theta', ['theta']], ['Salkov', ['salkov']], ['Melody', ['melody']], ['Kaiser', ['kaiser']], ['Balsamilco Might', ['balsamilco']], ['Furykov', ['furykov']], ['Chrollo Lucilfer', ['chrollo']], ['Hisoka Morow', ['hisoka']], ['Morena Prudo', ['morena']], ['Hinrigh Biganduffno', ['hinrigh']], ['Nobunaga Hazama', ['nobunaga']], ['Phinks Magcub', ['phinks']], ['Feitan Portor', ['feitan']], ['Bonolenov Ndongo', ['bonolenov']], ['Borksen', ['borksen']], ['Mizaistom Nana', ['mizaistom']], ['Botobai Gigante', ['botobai']], ['Cheadle Yorkshire', ['cheadle']], ['Leorio Paradinight', ['leorio']], ['Hanzo', ['hanzo']], ['Biscuit Krueger', ['biscuit']], ['Basho', ['basho']], ['Izunavi', ['izunavi']], ['Beyond Netero', ['beyond']], ['Nasubi Hui Guo Rou', ['nasubi']], ['Moswana', ['moswana']], ['Kanjidol', ['kanjidol']], ['Ridge', ['ridge']], ['Coventoba', ['coventoba']],
]);

export const peopleForTimelineEvent = (event) => {
  const text = normalizeText(`${event.title} ${event.detail} ${(event.people || []).join(' ')}`);
  const explicit = [...(event.people || [])];
  for (const prince of timelinePrinceProfiles) if (prince.terms.some((term) => text.includes(term))) explicit.push(prince.name);
  for (const [name, terms] of personTerms) if (terms.some((term) => text.includes(term))) explicit.push(name);
  return [...new Set(explicit)];
};

export const timelinePreludeRecords = freeze(successionPrelude.map((period) => freeze({
  ...period,
  chapter: chapterFromPrelude(period),
  importance: ['prelude-2000-08-10', 'prelude-ceremony', 'prelude-boarding'].includes(period.id) ? 'major' : 'standard',
})));

export const timelineVoyageDays = successionDays;
