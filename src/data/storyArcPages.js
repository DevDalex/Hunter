import { storyEntries } from '../../architecture/storyArchitecture.mjs';
import { arcs } from './arcs.js';

const portraitByName = new Map([
  ['Gon Freecss', '/media/portraits/gon-freecss.webp'],
  ['Killua Zoldyck', '/media/portraits/killua-zoldyck.webp'],
  ['Kurapika', '/media/portraits/kurapika.webp'],
  ['Leorio Paradinight', '/media/portraits/leorio-paradinight.webp'],
  ['Hisoka Morow', '/media/portraits/hisoka-morow.webp'],
  ['Illumi Zoldyck', '/media/portraits/illumi-zoldyck.webp'],
  ['Canary', '/media/portraits/canary.webp'],
  ['Gotoh', '/media/portraits/gotoh.webp'],
  ['Silva Zoldyck', '/media/portraits/silva-zoldyck.webp'],
  ['Wing', '/media/portraits/wing.webp'],
  ['Chrollo Lucilfer', '/media/portraits/chrollo-lucilfer.webp'],
  ['Pakunoda', '/media/portraits/pakunoda.webp'],
  ['Uvogin', '/media/portraits/uvogin.webp'],
  ['Neon Nostrade', '/media/portraits/neon-nostrade.webp'],
  ['Biscuit Krueger', '/media/portraits/biscuit-krueger.webp'],
  ['Genthru', '/media/portraits/genthru.webp'],
  ['Razor', '/media/portraits/razor.webp'],
  ['Kite', '/media/portraits/kite.webp'],
  ['Meruem', '/media/portraits/meruem.webp'],
  ['Neferpitou', '/media/portraits/neferpitou.webp'],
  ['Komugi', '/media/portraits/komugi.webp'],
  ['Isaac Netero', '/media/portraits/isaac-netero.webp'],
  ['Alluka Zoldyck', '/media/portraits/alluka-zoldyck.webp'],
  ['Ging Freecss', '/media/portraits/ging-freecss.webp'],
  ['Pariston Hill', '/media/portraits/pariston-hill.webp'],
  ['Cheadle Yorkshire', '/media/portraits/cheadle-yorkshire.webp'],
  ['Oito Hui Guo Rou', '/media/portraits/oito-hui-guo-rou.webp'],
  ['Woble Hui Guo Rou', '/media/portraits/woble-hui-guo-rou.webp'],
  ['Tserriednich Hui Guo Rou', '/media/portraits/tserriednich-hui-guo-rou.webp'],
  ['Benjamin Hui Guo Rou', '/media/portraits/benjamin-hui-guo-rou.webp'],
  ['Beyond Netero', '/media/portraits/beyond-netero.webp'],
]);

const visualIdentities = {
  'volume-0': { className: 'memory', paper: '#f3ede3', ink: '#241d1d', accent: '#8e3b46', secondary: '#53684f', hero: ['/media/portraits/kurapika.webp'] },
  'hunter-exam': { className: 'exam', paper: '#f3ebda', ink: '#201d18', accent: '#9a6330', secondary: '#536d56', hero: ['/media/portraits/gon-freecss.webp', '/media/portraits/hisoka-morow.webp'] },
  'zoldyck-family': { className: 'zoldyck', paper: '#e9e9e5', ink: '#1e2022', accent: '#5e5369', secondary: '#4e5e66', hero: ['/media/portraits/killua-zoldyck.webp', '/media/portraits/illumi-zoldyck.webp'] },
  'heavens-arena': { className: 'arena', paper: '#edf0ef', ink: '#192125', accent: '#416a8a', secondary: '#9a7637', hero: ['/media/portraits/gon-freecss.webp', '/media/portraits/wing.webp'] },
  'yorknew-city': { className: 'yorknew', paper: '#eae3da', ink: '#211b1d', accent: '#8e2635', secondary: '#87693e', hero: ['/media/portraits/kurapika.webp', '/media/portraits/chrollo-lucilfer.webp'] },
  'greed-island': { className: 'greed', paper: '#f1ead9', ink: '#1f241d', accent: '#5d735c', secondary: '#a97835', hero: ['/media/portraits/gon-freecss.webp', '/media/portraits/biscuit-krueger.webp'] },
  'chimera-ant': { className: 'chimera', paper: '#e6e5dd', ink: '#20211c', accent: '#68713e', secondary: '#8b4d46', hero: ['/media/portraits/meruem.webp', '/media/portraits/gon-freecss.webp'] },
  'chairman-election': { className: 'election', paper: '#efeee9', ink: '#1d2025', accent: '#415b79', secondary: '#8c3d49', hero: ['/media/portraits/killua-zoldyck.webp', '/media/portraits/alluka-zoldyck.webp'] },
  'succession-contest': { className: 'succession', paper: '#ece7e2', ink: '#211d23', accent: '#705978', secondary: '#8e2635', hero: ['/media/portraits/kurapika.webp', '/media/portraits/oito-hui-guo-rou.webp'] },
};

const character = (name, role, goal, affiliation, status = 'Active in this arc') => ({
  name,
  image: portraitByName.get(name) || null,
  role,
  goal,
  affiliation,
  status,
});

const faction = (name, objective, leadership, outcome) => ({ name, objective, leadership, outcome });
const place = (name, role, movement) => ({ name, role, movement });
const conflict = (title, participants, objective, result) => ({ title, participants, objective, result });
const objectRecord = (name, owner, functionText, importance) => ({ name, owner, function: functionText, importance });
const theme = (title, reading) => ({ title, reading });
const change = (subject, before, after) => ({ subject, before, after });
const source = (label, href) => ({ label, href });

const pages = {
  'volume-0': {
    status: 'Manga-only prologue',
    focus: ['Memory and identity', 'Isolation and freedom', 'Promise'],
    premise: 'Kurapika’s childhood inside the Kurta settlement establishes the friendship, curiosity, and loss that shape his later mission.',
    context: 'Before the Hunter Exam, Kurapika grows up inside an isolated community with Pairo. Sheila’s arrival turns the outside world from a forbidden abstraction into a reachable destination.',
    objective: 'Kurapika wants to earn permission to leave, find help for Pairo, and return with knowledge of the outside world.',
    stakes: 'His departure tests the settlement’s rules, his control over the Scarlet Eyes, and the promise binding him to Pairo.',
    structure: 'Two supplementary chapters move from childhood curiosity to a departure whose later tragedy is already known to the reader.',
    question: 'How does a hopeful child become the survivor whose identity is organized around recovery and revenge?',
    phases: [
      { title: 'Life inside the settlement', range: 'Part 1', summary: 'Kurapika and Pairo study the outside world while the elders enforce the Kurta’s separation.' },
      { title: 'Sheila and the book', range: 'Part 1', summary: 'An injured traveler gives the boys a concrete image of exploration and possibility.' },
      { title: 'The departure test', range: 'Part 2', summary: 'Kurapika faces the village trial and the danger of exposing the Scarlet Eyes.' },
      { title: 'Promise and absence', range: 'Part 2', summary: 'Kurapika leaves intending to return, giving every later memory of home tragic weight.' },
    ],
    characters: [
      character('Kurapika', 'Protagonist', 'Earn permission to leave and help Pairo', 'Kurta Clan'),
      character('Pairo', 'Closest friend', 'Support Kurapika while hiding his own condition', 'Kurta Clan'),
      character('Sheila', 'Outside-world catalyst', 'Recover and continue her journey', 'Independent traveler'),
      character('Kurta Elder', 'Community authority', 'Protect the settlement through isolation', 'Kurta Clan'),
    ],
    factions: [faction('Kurta Clan', 'Preserve the community and prevent dangerous exposure', 'Village elder and family households', 'The settlement remains isolated until the later massacre')],
    locations: [
      place('Kurta settlement', 'Protected childhood home', 'Kurapika moves from the enclosed settlement toward the outside-world test'),
      place('Forest test route', 'Departure examination', 'The route becomes the threshold between communal protection and individual freedom'),
    ],
    nen: ['The Scarlet Eyes are presented as an inherited physiological and emotional state rather than a formally explained Nen system.', 'Kurapika’s later Nen restrictions gain emotional context from the loss established here.'],
    conflicts: [conflict('Departure test', 'Kurapika, village examiners, outsiders', 'Demonstrate judgment and emotional control', 'Kurapika earns the right to leave')],
    objects: [
      objectRecord('Sheila’s book', 'Kurapika and Pairo', 'Describes an adventurous outside world', 'Turns curiosity into a concrete goal'),
      objectRecord('Pairo’s promise', 'Kurapika and Pairo', 'Binds departure to an intended return', 'Becomes a moral reference after the massacre'),
    ],
    themes: [
      theme('Memory and identity', 'The prologue frames revenge as the survival of a lost childhood rather than a simple desire to punish.'),
      theme('Isolation and freedom', 'Protection preserves the clan while making the outside world irresistible.'),
      theme('Promise', 'Kurapika’s future choices remain measured against obligations made before the main story begins.'),
    ],
    changes: [
      change('Kurapika', 'Curious child inside a protected community', 'Traveler carrying a promise to return'),
      change('The outside world', 'Forbidden and abstract', 'Reachable and personally meaningful'),
    ],
    ending: 'Kurapika leaves the settlement. The home he expects to revisit will be destroyed, converting departure into the foundation of his later mission.',
    transition: 'The Hunter Exam offers the mobility, authority, and resources Kurapika needs to pursue the stolen Scarlet Eyes.',
    adaptation: ['The two supplementary manga chapters were not adapted into the 2011 television series.', 'They function as a manga-only prologue and a direct emotional prerequisite for Yorknew City.'],
    sources: [
      source('Kurapika’s Memories', 'https://hunterxhunter.fandom.com/wiki/Kurapika%27s_Memories'),
      source('Kurapika', 'https://hunterxhunter.fandom.com/wiki/Kurapika'),
    ],
  },

  'hunter-exam': {
    context: 'Gon leaves Whale Island to learn why becoming a Hunter mattered more to Ging than raising him. The exam gathers Kurapika, Leorio, Killua, Hisoka, and hundreds of applicants into tests whose rules are often deliberately incomplete.',
    objective: 'Earn a Hunter License while deciding what kind of Hunter—and what kind of person—each applicant will become.',
    stakes: 'Failure can mean injury or death; success opens access to information, travel, money, and institutional authority.',
    structure: 'A multi-stage examination that changes genre through endurance, food, navigation, survival, and tournament judgment.',
    question: 'Is a Hunter defined by strength, desire, judgment, loyalty, or the ability to continue after failure?',
    phases: [
      { title: 'Departure and hidden screening', range: 'Ch. 1–5 · Ep. 1–4', summary: 'Gon leaves Whale Island, meets Kurapika and Leorio, and passes tests that begin before the advertised site.' },
      { title: 'Endurance and wetlands', range: 'Ch. 6–11 · Ep. 5–7', summary: 'Satotz leads the applicants through the tunnel and Milsy Wetlands while Hisoka becomes the central danger.' },
      { title: 'Cooking and Trick Tower', range: 'Ch. 12–21 · Ep. 8–11', summary: 'The exam tests adaptability, teamwork, negotiation, and acceptance of unconventional rules.' },
      { title: 'Zevil Island', range: 'Ch. 22–31 · Ep. 12–16', summary: 'Applicants hunt badges and private objectives replace the earlier group momentum.' },
      { title: 'Final Phase', range: 'Ch. 32–38 · Ep. 17–21', summary: 'Netero’s bracket rewards resolve rather than simple victory; Killua’s encounter with Illumi ends in disqualification.' },
    ],
    characters: [
      character('Gon Freecss', 'Central applicant', 'Become a Hunter and find Ging', 'Independent applicant'),
      character('Killua Zoldyck', 'Prodigy and friend', 'Test life outside his family’s control', 'Zoldyck Family'),
      character('Kurapika', 'Applicant and survivor', 'Gain access needed to recover the Scarlet Eyes', 'Kurta survivor'),
      character('Leorio Paradinight', 'Applicant and future doctor', 'Gain resources for medical education', 'Independent applicant'),
      character('Hisoka Morow', 'Predatory examiner of potential', 'Find strong future opponents', 'Independent applicant'),
    ],
    factions: [
      faction('Hunter Association', 'Select candidates judged worthy of licenses', 'Netero, examiners, and proctors', 'Seven applicants pass the final phase'),
      faction('Exam applicants', 'Survive every phase and secure a license', 'No unified leadership', 'The field narrows through attrition and disqualification'),
    ],
    locations: [
      place('Whale Island', 'Gon’s starting point', 'Departure establishes the search for Ging'),
      place('Milsy Wetlands', 'First openly lethal environment', 'The group learns to distinguish guidance from deception'),
      place('Trick Tower', 'Team-based prison challenge', 'The quartet negotiates time, rules, and trust'),
      place('Zevil Island', 'Badge-hunting survival test', 'Alliances loosen and private objectives dominate'),
    ],
    nen: ['Nen is foreshadowed through unexplained pressure, killing intent, and extraordinary ability.', 'The absence of formal explanation makes Hisoka and Illumi appear almost supernatural.'],
    conflicts: [
      conflict('Gon’s badge hunt', 'Gon, Hisoka, Geretta', 'Take Hisoka’s badge without direct victory', 'Gon succeeds tactically but is reminded of the power gap'),
      conflict('Final Phase confrontation', 'Killua and Illumi', 'Force Killua to confront family conditioning', 'Killua kills Bodoro and is disqualified'),
    ],
    objects: [
      objectRecord('Hunter License', 'Successful applicants', 'Grants exceptional access and privileges', 'Becomes the key to later investigations'),
      objectRecord('Zevil Island badges', 'Applicants', 'Determine target points and survival incentives', 'Turn the fourth phase into a pursuit system'),
    ],
    themes: [
      theme('Desire as qualification', 'The exam rewards goals that survive fear, humiliation, and uncertainty.'),
      theme('Friendship under pressure', 'The central quartet forms through choices rather than formal assignment.'),
      theme('Institutional ambiguity', 'The Association tests judgment through dangerous rules it often refuses to explain.'),
    ],
    changes: [
      change('Gon', 'Island child with a private question about Ging', 'Licensed Hunter with three defining companions'),
      change('Killua', 'Detached prodigy treating the exam as entertainment', 'Friend whose family conditioning has become visible'),
      change('The quartet', 'Strangers with separate goals', 'A durable network willing to cross the world for one another'),
    ],
    ending: 'Gon, Kurapika, Leorio, and the successful applicants receive licenses, but Killua returns home after Illumi’s intervention.',
    transition: 'Gon, Kurapika, and Leorio travel to Kukuroo Mountain to retrieve Killua.',
    adaptation: ['The 2011 anime covers the exam-focused page primarily in Episodes 1–21.', 'The official Hunter Exam boundary continues through the Zoldyck Family material, which this archive gives its own editorial page.'],
    sources: [
      source('Hunter Exam arc', 'https://hunterxhunter.fandom.com/wiki/Hunter_Exam_arc'),
      source('Hunter Exam', 'https://hunterxhunter.fandom.com/wiki/Hunter_Exam'),
    ],
  },

  'zoldyck-family': {
    status: 'Completed editorial story page',
    focus: ['Family authority', 'Chosen relationships', 'Thresholds'],
    premise: 'Gon, Kurapika, and Leorio travel to Kukuroo Mountain to retrieve Killua from the assassin family that expects to control his future.',
    context: 'Killua has been taken home after the exam. Gon refuses to accept that Illumi’s control represents Killua’s true decision.',
    objective: 'Reach Killua, confirm what he wants, and leave the estate together.',
    stakes: 'The group faces a family whose wealth, assassination culture, servants, and training make ordinary rescue impossible.',
    structure: 'A short rescue mission organized around thresholds: Testing Gate, servants’ quarters, family permission, and Killua’s choice.',
    question: 'Can friendship give Killua a life outside the role his family designed for him?',
    phases: [
      { title: 'Testing Gate', range: 'Ch. 39–40 · Ep. 22–23', summary: 'The group learns that entering the estate requires physical commitment rather than deception.' },
      { title: 'Canary and the servants', range: 'Ch. 40–42 · Ep. 23–24', summary: 'Canary’s loyalty reveals that the household is not emotionally uniform.' },
      { title: 'Killua’s release', range: 'Ch. 42–43 · Ep. 24–25', summary: 'Silva permits Killua to leave after extracting a promise about friendship and return.' },
    ],
    characters: [
      character('Killua Zoldyck', 'Rescued friend', 'Leave the estate and choose his own path', 'Zoldyck Family'),
      character('Gon Freecss', 'Rescue leader', 'Speak to Killua directly', 'Killua’s friends'),
      character('Canary', 'Estate guard', 'Fulfil duty while protecting Killua’s humanity', 'Zoldyck servants'),
      character('Silva Zoldyck', 'Family head', 'Manage Killua’s independence without surrendering authority', 'Zoldyck Family'),
      character('Gotoh', 'Senior butler', 'Test the visitors and safeguard Killua', 'Zoldyck servants'),
    ],
    factions: [
      faction('Zoldyck Family', 'Preserve its assassination lineage and control over Killua', 'Silva and senior family members', 'Killua is permitted to leave but remains tied to family expectations'),
      faction('Zoldyck servants', 'Protect the estate and execute family orders', 'Senior butlers', 'Several reveal personal loyalty to Killua'),
    ],
    locations: [
      place('Kukuroo Mountain', 'Zoldyck territory', 'The mountain turns social hierarchy into physical distance'),
      place('Testing Gate', 'Estate threshold', 'Gon’s group chooses training over trespass'),
      place('Butler quarters', 'Final testing ground', 'Gotoh confirms the visitors’ resolve before departure'),
    ],
    nen: ['Nen remains unexplained, but the family’s strength continues the power-system foreshadowing.', 'The Testing Gate emphasizes trained physical capability before formal aura instruction begins.'],
    conflicts: [
      conflict('Testing Gate training', 'Gon, Kurapika, Leorio, Zebro', 'Open the gate legitimately', 'The group develops the strength required to enter'),
      conflict('Canary’s blockade', 'Gon and Canary', 'Convince the guard without treating her as an enemy', 'Canary allows the truth of Killua’s friendships to surface'),
    ],
    objects: [
      objectRecord('Testing Gate', 'Zoldyck estate', 'Measures the physical force of entrants', 'Makes the family’s world materially inaccessible'),
      objectRecord('Gotoh’s coin', 'Gotoh', 'Tests perception and trust', 'Ends the rescue with a controlled demonstration'),
    ],
    themes: [
      theme('Family authority', 'The Zoldycks treat identity as an inherited profession rather than a personal choice.'),
      theme('Chosen relationships', 'Killua’s friends challenge the idea that blood and training are the only legitimate bonds.'),
      theme('Thresholds', 'Every stage asks whether outsiders may enter and whether Killua may leave.'),
    ],
    changes: [
      change('Killua', 'Confined heir under family discipline', 'Traveler who openly chooses Gon’s company'),
      change('Gon and Killua', 'New friends separated by family control', 'Companions leaving together for Heavens Arena'),
    ],
    ending: 'Killua reunites with the group and leaves Kukuroo Mountain. Kurapika and Leorio depart toward their own goals.',
    transition: 'Needing money and practical strength, Gon and Killua travel to Heavens Arena, where Nen is finally explained.',
    adaptation: ['The 2011 anime presents this material in Episodes 22–25, with Episode 26 functioning as a recap.', 'It remains part of the official Hunter Exam arc even though the archive gives it a dedicated route.'],
    sources: [
      source('Hunter Exam arc', 'https://hunterxhunter.fandom.com/wiki/Hunter_Exam_arc'),
      source('Zoldyck Family', 'https://hunterxhunter.fandom.com/wiki/Zoldyck_Family'),
    ],
  },

  'heavens-arena': {
    context: 'Gon and Killua need money and experience after leaving Kukuroo Mountain. The tower appears to be a combat ladder until the 200th floor reveals a hidden aura system.',
    objective: 'Climb the tower, earn money, learn Nen safely, and let Gon settle his unfinished exchange with Hisoka.',
    stakes: 'Without Nen, the boys cannot survive the 200th floor; reckless training risks permanent injury.',
    structure: 'A tournament-and-training arc that moves from visible rankings to an invisible technical curriculum.',
    question: 'How does knowledge transform strength from instinct into a disciplined system?',
    phases: [
      { title: 'Floor climb', range: 'Ch. 44–47 · Ep. 27–28', summary: 'Gon and Killua rise through the lower floors and meet Zushi and Wing.' },
      { title: 'The 200th-floor barrier', range: 'Ch. 48–51 · Ep. 29–31', summary: 'Hisoka’s aura blocks entry and forces Wing to explain the danger of Nen.' },
      { title: 'Nen curriculum', range: 'Ch. 52–57 · Ep. 32–35', summary: 'The boys learn Ten, Zetsu, Ren, Gyo, categories, and controlled combat application.' },
      { title: 'Gon versus Hisoka', range: 'Ch. 58–63 · Ep. 36–38', summary: 'Gon returns the badge and proves growth without yet surpassing Hisoka.' },
    ],
    characters: [
      character('Gon Freecss', 'Student and fighter', 'Learn Nen and strike Hisoka once', 'Wing’s students'),
      character('Killua Zoldyck', 'Student and analyst', 'Understand the force his family concealed', 'Wing’s students'),
      character('Wing', 'Nen teacher', 'Initiate the boys without destroying their potential', 'Shingen-ryu'),
      character('Hisoka Morow', 'Benchmark opponent', 'Test Gon’s growth and preserve future potential', 'Floor 200 fighter'),
    ],
    factions: [
      faction('Heavens Arena fighters', 'Advance through wins and earn status', 'Tournament administration and Floor Masters', 'The boys learn ranking does not reveal the true hierarchy'),
      faction('Wing’s students', 'Develop safe Nen fundamentals', 'Wing', 'Gon and Killua leave with a working foundation'),
    ],
    locations: [
      place('Heavens Arena', 'Combat tower and training environment', 'The vertical climb mirrors the move from ordinary fighting to Nen'),
      place('200th floor', 'Nen-user threshold', 'Entry becomes impossible without aura defence'),
    ],
    nen: ['Aura nodes and initiation', 'Ten, Zetsu, Ren, and Hatsu', 'Gyo and practical aura focus', 'Six Nen categories and Water Divination', 'Bungee Gum as applied Transmutation'],
    conflicts: [
      conflict('Gon versus Gido', 'Gon and Gido', 'Apply Nen under controlled risk', 'Gon learns that resolve without restraint creates avoidable injury'),
      conflict('Gon versus Hisoka', 'Gon and Hisoka', 'Return the badge and measure progress', 'Gon lands the promised hit; Hisoka wins the match'),
    ],
    objects: [
      objectRecord('Water Divination glass', 'Wing’s students', 'Reveals Nen affinity through aura response', 'Turns category theory into a visible diagnostic'),
      objectRecord('Hisoka’s badge', 'Gon', 'Represents the debt from Zevil Island', 'Returning it closes Gon’s immediate humiliation'),
    ],
    themes: [
      theme('Instruction and restraint', 'Responsible teaching separates growth from exploitation.'),
      theme('Visible and invisible systems', 'The public tournament hides a second hierarchy known only to Nen users.'),
      theme('Measured progress', 'Gon’s success is defined by a specific promise rather than total victory.'),
    ],
    changes: [
      change('Gon and Killua', 'Exceptional children without a vocabulary for aura', 'Initiated Nen users with category awareness'),
      change('Hisoka rivalry', 'One-sided fascination and debt', 'Recognized future contest with demonstrated growth'),
    ],
    ending: 'Gon achieves his limited goal against Hisoka, while both boys complete the first stage of Nen education.',
    transition: 'Ging’s box and the game Greed Island direct Gon and Killua toward Yorknew City.',
    adaptation: ['The 2011 anime adapts Chapters 44–63 in Episodes 27–38.', 'The adaptation keeps the arc’s instructional function while compressing some technical pacing around matches.'],
    sources: [
      source('Heavens Arena arc', 'https://hunterxhunter.fandom.com/wiki/Heavens_Arena_arc'),
      source('Nen', 'https://hunterxhunter.fandom.com/wiki/Nen'),
    ],
  },

  'yorknew-city': {
    context: 'The quartet converges on Yorknew for different reasons: Gon and Killua seek Greed Island, Leorio helps raise money, and Kurapika works for the Nostrade Family to approach the underground auction and the Scarlet Eyes.',
    objective: 'Kurapika intends to recover the eyes and neutralize the Phantom Troupe while Gon and Killua pursue Greed Island.',
    stakes: 'Personal revenge intersects with mafia power, civilian casualties, hostages, and Kurapika’s life-binding restrictions.',
    structure: 'A crime thriller built from simultaneous investigations, auction schedules, prophecies, assassinations, pursuit, and exchange.',
    question: 'Can Kurapika recover what was stolen without allowing revenge to consume every remaining relationship?',
    phases: [
      { title: 'Arrival and auction preparation', range: 'Ch. 64–73 · Ep. 39–42', summary: 'The group establishes goals, Kurapika joins the Nostrades, and the Troupe enters the city.' },
      { title: 'Auction massacre', range: 'Ch. 74–83 · Ep. 43–47', summary: 'The Phantom Troupe attacks the underground auction and destroys the mafia’s first counterattack.' },
      { title: 'Uvogin hunt', range: 'Ch. 84–93 · Ep. 48–51', summary: 'Kurapika captures and kills Uvogin, confirming the power and cost of his restrictions.' },
      { title: 'Fortunes and pursuit', range: 'Ch. 94–105 · Ep. 52–54', summary: 'Neon’s prophecies reshape the Troupe’s choices while Gon and Killua are repeatedly captured.' },
      { title: 'Chrollo capture and exchange', range: 'Ch. 106–119 · Ep. 55–58', summary: 'Kurapika captures Chrollo and forces a hostage exchange centered on Pakunoda’s decision.' },
    ],
    characters: [
      character('Kurapika', 'Protagonist and bodyguard', 'Recover Scarlet Eyes and disable the Troupe', 'Nostrade Family'),
      character('Chrollo Lucilfer', 'Troupe leader', 'Protect the Spider and pursue the auction', 'Phantom Troupe'),
      character('Pakunoda', 'Troupe loyalist', 'Save Chrollo while preserving the Spider', 'Phantom Troupe'),
      character('Neon Nostrade', 'Fortune teller and client', 'Attend the auction and expand her collection', 'Nostrade Family'),
      character('Uvogin', 'Troupe combatant', 'Fight freely and protect the Spider', 'Phantom Troupe'),
    ],
    factions: [
      faction('Phantom Troupe', 'Rob the auction and defend the Spider', 'Chrollo Lucilfer', 'Survives but loses Uvogin, Pakunoda, and Chrollo’s usable Nen'),
      faction('Nostrade Family', 'Use Neon’s ability to rise within the mafia', 'Light Nostrade and Dalzollene', 'Its position is destabilized'),
      faction('Mafia Community', 'Protect the auction and punish the Troupe', 'Ten Dons', 'Its elite forces fail and its leadership is assassinated'),
    ],
    locations: [
      place('Yorknew City', 'Commercial and criminal center', 'Auctions, hotels, streets, and cemeteries become a pursuit network'),
      place('Underground auction', 'Mafia marketplace', 'The Troupe’s assault turns the event into a citywide war'),
      place('Beitacle Hotel', 'Hostage-exchange location', 'Kurapika transforms a public building into a controlled negotiation site'),
    ],
    nen: ['Emperor Time and category access', 'Chain Jail and the Troupe-only restriction', 'Judgment Chain', 'Skill Hunter', 'Lovely Ghostwriter and fortune poems', 'Memory Bomb'],
    conflicts: [
      conflict('Uvogin versus the Shadow Beasts', 'Uvogin and the Shadow Beasts', 'Break the mafia counterattack', 'Uvogin survives and the Shadow Beasts are destroyed'),
      conflict('Kurapika versus Uvogin', 'Kurapika and Uvogin', 'Test Chain Jail and avenge the Kurta', 'Kurapika kills Uvogin'),
      conflict('Hostage exchange', 'Kurapika’s group, Phantom Troupe, Chrollo, Gon, Killua', 'Trade hostages while controlling information', 'Chrollo is released under restrictions; Pakunoda shares memories and dies'),
    ],
    objects: [
      objectRecord('Scarlet Eyes', 'Collectors and Kurapika', 'Kurta remains sold as trophies', 'Give the auction a direct connection to Kurapika’s mission'),
      objectRecord('Fortune poems', 'Neon and the Phantom Troupe', 'Predict monthly danger in cryptic verse', 'Shape the Troupe’s strategy'),
      objectRecord('Kurapika’s chains', 'Kurapika', 'Capture, judge, heal, and impose conditions', 'Make revenge inseparable from self-sacrifice'),
    ],
    themes: [
      theme('Revenge and self-erasure', 'Kurapika gains power by narrowing the conditions under which he is willing to live.'),
      theme('Loyalty inside criminality', 'The Troupe’s atrocities coexist with genuine internal attachment.'),
      theme('Memory', 'Eyes, fortunes, and Pakunoda’s bullets turn private memory into transferable evidence.'),
    ],
    changes: [
      change('Kurapika', 'Hunter seeking access to the criminal world', 'Scarlet-Eyes collector with proven lethal restrictions'),
      change('Phantom Troupe', 'Untouchable citywide threat', 'Surviving group deprived of Uvogin, Pakunoda, and Chrollo’s ability'),
      change('Gon’s search', 'Need to acquire Greed Island through the auction', 'Secures a route through Battera'),
    ],
    ending: 'Kurapika saves Gon and Killua and restricts Chrollo, but does not destroy the Spider. Pakunoda chooses the Troupe’s survival over her own life.',
    transition: 'Battera’s operation gives Gon and Killua a route into Greed Island and a new path toward Ging.',
    adaptation: ['The 2011 anime adapts Chapters 64–119 in Episodes 39–58.', 'The adaptation preserves the crime-thriller structure while intensifying the city-night atmosphere through sound and colour.'],
    sources: [
      source('Yorknew City arc', 'https://hunterxhunter.fandom.com/wiki/Yorknew_City_arc'),
      source('Phantom Troupe', 'https://hunterxhunter.fandom.com/wiki/Phantom_Troupe'),
      source('Kurapika', 'https://hunterxhunter.fandom.com/wiki/Kurapika'),
    ],
  },

  'greed-island': {
    context: 'Battera recruits Hunters to complete Greed Island, a physical place governed by a game-like Nen system created by Ging and collaborators.',
    objective: 'Complete the Restricted Slot collection, survive player conflict, and use the reward to continue the search for Ging.',
    stakes: 'Cards can be stolen, players are murdered, and misunderstanding rules can be as dangerous as losing a fight.',
    structure: 'A game-system arc organized around rule literacy, card acquisition, training, alliances, and a final multi-opponent plan.',
    question: 'Can Gon and Killua turn competitive rules into cooperation without losing their willingness to take extreme risks?',
    phases: [
      { title: 'Entry and rule discovery', range: 'Ch. 120–132 · Ep. 59–63', summary: 'The boys enter, learn card conversion and slots, and discover the lethal player economy.' },
      { title: 'Biscuit’s training', range: 'Ch. 133–154 · Ep. 64–69', summary: 'Biscuit rebuilds their fundamentals through advanced aura control and practical combat.' },
      { title: 'Razor and Plot of Beach', range: 'Ch. 155–169 · Ep. 70–72', summary: 'An alliance forms to win the multiplayer dodgeball challenge.' },
      { title: 'Bomber plan', range: 'Ch. 170–183 · Ep. 73–74', summary: 'The group separates Genthru, Sub, and Bara and prepares individualized battles.' },
      { title: 'Completion and Accompany', range: 'Ch. 184–185 · Ep. 75', summary: 'Gon completes the game and selects cards intended to lead him to Ging.' },
    ],
    characters: [
      character('Gon Freecss', 'Player and seeker', 'Complete the game and reach Ging', 'Biscuit’s team'),
      character('Killua Zoldyck', 'Strategist and player', 'Support completion while improving Nen control', 'Biscuit’s team'),
      character('Biscuit Krueger', 'Teacher and veteran Hunter', 'Train the boys and pursue rare treasure', 'Biscuit’s team'),
      character('Genthru', 'Primary antagonist', 'Control players and monopolize cards', 'Bomber group'),
      character('Razor', 'Game Master', 'Guard Plot of Beach and test players under Ging’s rules', 'Game Masters'),
    ],
    factions: [
      faction('Game Masters', 'Maintain the island and enforce its systems', 'Ging’s collaborators', 'The game is completed without suspending its rules'),
      faction('Bomber group', 'Acquire cards through coercion and mass killing', 'Genthru', 'Defeated by Gon, Killua, and Biscuit'),
      faction('Tsezguerra alliance', 'Complete the collection through experienced cooperation', 'Tsezguerra', 'Helps create the final strategy'),
    ],
    locations: [
      place('Greed Island', 'Physical island governed by card rules', 'Travel is controlled by spells, cities, and designated systems'),
      place('Masadora', 'Spell-card market and training hub', 'Repeated travel makes it the practical center of progression'),
      place('Razor’s arena', 'Plot of Beach challenge', 'Multiple teams converge for the largest cooperative contest'),
    ],
    nen: ['Ko, Ken, Ryu, and advanced aura allocation', 'Card conversion and game-wide Nen systems', 'Countdown and Little Flower', 'Razor’s emitted devils', 'Biscuit’s training methods'],
    conflicts: [
      conflict('Dodgeball match', 'Gon’s alliance, Razor, and devils', 'Win Plot of Beach under game rules', 'The alliance wins through combined strength and substitution'),
      conflict('Gon versus Genthru', 'Gon and Genthru', 'Defeat the Bomber while preserving the plan', 'Gon wins after severe injury and a prepared trap'),
      conflict('Killua versus Sub', 'Killua and Sub', 'Isolate and defeat one Bomber', 'Killua controls the fight through speed and yo-yo tactics'),
    ],
    objects: [
      objectRecord('Binder and card slots', 'Players', 'Store Restricted and Free Slot cards', 'Make possession and theft mechanically visible'),
      objectRecord('Breath of Archangel', 'Winning players', 'Restores severe injuries', 'Connects tactical sacrifice with recovery'),
      objectRecord('Accompany', 'Gon', 'Transports a group to a named player', 'Determines who Gon meets after the game'),
    ],
    themes: [
      theme('Rules as a language', 'Success belongs to players who understand interactions rather than merely possess strength.'),
      theme('Training through play', 'Biscuit makes experimentation and repetition the basis of improvement.'),
      theme('Calculated sacrifice', 'Gon’s willingness to be injured is effective but increasingly alarming.'),
    ],
    changes: [
      change('Gon and Killua', 'New Nen users with basic control', 'Advanced fighters capable of Ryu, Ko, and coordinated planning'),
      change('Search for Ging', 'Dependent on acquiring an inaccessible game', 'Converted into a direct post-game destination'),
      change('Biscuit relationship', 'Unexpected rival player', 'Permanent teacher and ally'),
    ],
    ending: 'Gon defeats Genthru, the team completes the card collection, and the game distributes its reward without abandoning its rules.',
    transition: 'Gon uses Accompany believing it will take him to Ging; Ging’s condition redirects the group to Kite.',
    adaptation: ['The 2011 anime adapts Chapters 120–185 in Episodes 59–75.', 'Game explanations are often compressed visually while the training and battle structure remains intact.'],
    sources: [
      source('Greed Island arc', 'https://hunterxhunter.fandom.com/wiki/Greed_Island_arc'),
      source('Greed Island', 'https://hunterxhunter.fandom.com/wiki/Greed_Island'),
      source('Greed Island Card Lists', 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists'),
    ],
  },

  'chimera-ant': {
    context: 'Gon and Killua meet Kite, whose biological survey leads to the Chimera Ant Queen. The colony reproduces through consumption and increasingly inherits human memory, ambition, cruelty, and attachment.',
    objective: 'Contain the colony, prevent mass human consumption, separate the King from the Royal Guards, and survive the palace invasion.',
    stakes: 'The conflict threatens nations and pushes Hunters toward weapons and choices that compromise moral certainty.',
    structure: 'A war narrative expanding from ecological horror to military preparation, synchronized invasion, and intimate tragedy.',
    question: 'Which characters become more human, and which become more monstrous, when power removes ordinary limits?',
    phases: [
      { title: 'NGL outbreak', range: 'Ch. 186–213 · Ep. 76–85', summary: 'Kite’s team investigates; Neferpitou’s birth changes the scale of danger and Kite is defeated.' },
      { title: 'King and Royal Guards', range: 'Ch. 214–238 · Ep. 86–96', summary: 'Meruem is born, the colony fractures, and the King’s search for superiority leads to Komugi.' },
      { title: 'Selection preparation', range: 'Ch. 239–262 · Ep. 97–110', summary: 'Gon and Killua train while Palm infiltrates and the Hunters prepare the assault.' },
      { title: 'Palace invasion', range: 'Ch. 263–300 · Ep. 111–128', summary: 'The invasion unfolds across seconds and minutes as objectives diverge.' },
      { title: 'Rose and aftermath', range: 'Ch. 301–318 · Ep. 129–136', summary: 'Netero’s final weapon poisons the royal core while Gon’s transformation leaves him critically damaged.' },
    ],
    characters: [
      character('Gon Freecss', 'Hunter driven by Kite’s fate', 'Force Pitou to restore Kite and punish the truth', 'Extermination Team'),
      character('Killua Zoldyck', 'Protector and tactical support', 'Keep Gon alive and overcome conditioned retreat', 'Extermination Team'),
      character('Meruem', 'Chimera Ant King', 'Establish supreme rule, then understand value through Komugi', 'Chimera Ant colony'),
      character('Neferpitou', 'Royal Guard', 'Protect the King above every other life', 'Royal Guard'),
      character('Komugi', 'Gungi champion', 'Play Gungi with complete devotion', 'East Gorteau civilian'),
      character('Isaac Netero', 'Extermination leader', 'Kill the King regardless of survival', 'Hunter Association'),
    ],
    factions: [
      faction('Chimera Ant colony', 'Reproduce, feed, and establish a new hierarchy', 'Queen, then Meruem and the Royal Guards', 'The royal core dies; survivors disperse or integrate'),
      faction('Extermination Team', 'Separate and eliminate the King and Guards', 'Netero, Morel, Knov, and assigned Hunters', 'Succeeds through sacrifice, poison, and fragmented battles'),
      faction('East Gorteau government', 'Maintain the façade of state power', 'Diego regime and manipulated doubles', 'Used by the Ants to stage the Selection'),
    ],
    locations: [
      place('NGL', 'Initial colony territory', 'The investigation becomes a disaster after Pitou’s birth'),
      place('East Gorteau palace', 'Royal base and invasion target', 'Stairways, chambers, and separation determine the operation'),
      place('Underground test site', 'Netero–Meruem battlefield', 'Isolation permits the final use of the Miniature Rose'),
    ],
    nen: ['Royal Guard aura and En', 'Hakoware and APR', 'Godspeed', 'Deep Purple', 'Hide and Seek', '100-Type Guanyin Bodhisattva', 'Gon’s imposed transformation'],
    conflicts: [
      conflict('Kite encounters Pitou', 'Kite, Gon, Killua, Neferpitou', 'Protect the boys and assess the threat', 'Kite is defeated; Killua escapes with Gon'),
      conflict('Netero versus Meruem', 'Isaac Netero and Meruem', 'Kill the King', 'Netero detonates the Rose after failing physically'),
      conflict('Gon versus Pitou', 'Gon and Neferpitou', 'Avenge Kite', 'Gon transforms, kills Pitou, and destroys his own body'),
      conflict('Meruem and Komugi’s final game', 'Meruem and Komugi', 'Spend their remaining time together', 'Both die while completing their relationship through play'),
    ],
    objects: [
      objectRecord('Miniature Rose', 'Human military technology', 'Compact bomb with persistent poison', 'Reframes humanity’s greatest power as mass-produced cruelty'),
      objectRecord('Gungi board', 'Komugi and Meruem', 'Structures their repeated games', 'Becomes the site of Meruem’s transformation'),
      objectRecord('Kite’s body', 'Chimera Ant colony and Gon', 'Pitou manipulates the corpse as training material', 'Turns Gon’s hope into denial and collapse'),
    ],
    themes: [
      theme('Humanity and monstrosity', 'Species identity becomes less reliable than choices and attachments.'),
      theme('Power and vulnerability', 'Meruem’s supremacy cannot solve the value revealed by losing to Komugi.'),
      theme('Revenge and moral collapse', 'Gon’s grief narrows empathy until self-destruction appears acceptable.'),
    ],
    changes: [
      change('Gon', 'Optimistic Hunter following Kite', 'Critically injured survivor whose rage exposed a destructive extreme'),
      change('Killua', 'Friend limited by Illumi’s needle', 'Protector acting independently after removing it'),
      change('Meruem', 'King defining worth through domination', 'Dying individual choosing Komugi and a private name'),
    ],
    ending: 'The Rose’s poison kills Meruem, Pouf, Youpi, and Komugi. Surviving Ants disperse, while Gon cannot be healed by ordinary means.',
    transition: 'Netero’s death triggers the Chairman Election, and Gon’s condition drives Killua to retrieve Alluka.',
    adaptation: ['The 2011 anime adapts Chapters 186–318 in Episodes 76–136.', 'The adaptation expands atmosphere through narration, sound, and temporal repetition during the palace invasion.'],
    sources: [
      source('Chimera Ant arc', 'https://hunterxhunter.fandom.com/wiki/Chimera_Ant_arc'),
      source('Chimera Ants', 'https://hunterxhunter.fandom.com/wiki/Chimera_Ants'),
      source('East Gorteau', 'https://hunterxhunter.fandom.com/wiki/Republic_of_East_Gorteau'),
    ],
  },

  'chairman-election': {
    context: 'Netero’s death leaves the Association without a chairman while Gon remains hospitalized. The Zodiacs run an election as Killua returns home for the one person who may heal Gon.',
    objective: 'Choose a chairman, save Gon, and protect Alluka from relatives who treat Nanika as a resource or threat.',
    stakes: 'Association leadership, Gon’s life, Alluka’s freedom, and Killua’s final relationship with his family are decided together.',
    structure: 'Two synchronized races: repeated election rounds driven by turnout, and a moving rescue pursued by Illumi.',
    question: 'Can institutions and families recognize people as ends rather than tools?',
    phases: [
      { title: 'Election rules', range: 'Ch. 319–325 · Ep. 137–139', summary: 'The Zodiacs define the voting system while Pariston turns procedure into strategy.' },
      { title: 'Alluka retrieved', range: 'Ch. 326–331 · Ep. 140–143', summary: 'Killua removes Alluka from confinement and begins the trip to Gon.' },
      { title: 'Pursuit and voting rounds', range: 'Ch. 332–336 · Ep. 143–145', summary: 'Illumi attacks through Needle People while Leorio’s confrontation with Ging reshapes the election.' },
      { title: 'Healing and final ballot', range: 'Ch. 337–339 · Ep. 146–148', summary: 'Nanika heals Gon, Pariston wins and resigns, and Gon finally meets Ging.' },
    ],
    characters: [
      character('Killua Zoldyck', 'Rescue protagonist', 'Save Gon and free Alluka', 'Zoldyck Family'),
      character('Alluka Zoldyck', 'Sibling and healer', 'Live with Killua rather than remain confined', 'Zoldyck Family'),
      character('Pariston Hill', 'Election strategist', 'Control the contest and frustrate the Zodiacs', 'Hunter Association'),
      character('Ging Freecss', 'Candidate and Gon’s father', 'Navigate Netero’s final game on his own terms', 'Zodiacs'),
      character('Leorio Paradinight', 'Unexpected public candidate', 'Demand that Ging face Gon’s condition', 'Hunter Association'),
    ],
    factions: [
      faction('Zodiacs', 'Administer the election and preserve stability', 'Cheadle, Mizaistom, Botobai, and peers', 'Cheadle becomes chairwoman after Pariston resigns'),
      faction('Pariston bloc', 'Use turnout and procedure to dominate the vote', 'Pariston Hill', 'Wins formally before surrendering the office'),
      faction('Zoldyck Family', 'Control Alluka and manage the danger attributed to Nanika', 'Silva, Kikyo, Illumi, and household authority', 'Killua leaves with Alluka'),
    ],
    locations: [
      place('Hunter Association headquarters', 'Election venue', 'Repeated rounds concentrate political conflict into one institution'),
      place('Zoldyck estate', 'Alluka’s confinement site', 'Killua turns a family prison into the start of a rescue'),
      place('Hospital', 'Gon’s recovery site', 'Public election rhetoric repeatedly returns to Gon’s condition'),
    ],
    nen: ['Nanika’s request-and-command system', 'Illumi’s Needle People', 'Godspeed as transport and protection', 'Information control as the election’s functional power system'],
    conflicts: [
      conflict('Killua’s escape with Alluka', 'Killua, the Zoldycks, butlers, and Illumi', 'Reach Gon without surrendering Alluka', 'Killua reaches the hospital and establishes his commands to Nanika'),
      conflict('Leorio confronts Ging', 'Leorio, Ging, and the Association audience', 'Force recognition of Gon’s condition', 'Leorio strikes Ging and becomes a leading candidate'),
      conflict('Final election round', 'Pariston, Leorio, Cheadle, voters', 'Reach turnout and select a chair', 'Pariston wins, appoints Cheadle, and resigns'),
    ],
    objects: [
      objectRecord('Election ballots', 'Hunter Association members', 'Record repeated rounds under changing strategy', 'Make legitimacy depend on participation'),
      objectRecord('Illumi’s needles', 'Illumi', 'Control civilians as Needle People', 'Turn the rescue route into a mass-hostage threat'),
    ],
    themes: [
      theme('Procedure and legitimacy', 'Rules can stabilize an institution while giving manipulators room to dominate it.'),
      theme('Personhood and control', 'Alluka’s treatment exposes the difference between fear of power and recognition of a child.'),
      theme('Public and private obligation', 'Leorio converts concern for Gon into a political force the Association cannot ignore.'),
    ],
    changes: [
      change('Killua', 'Family member negotiating within Zoldyck rules', 'Independent guardian travelling with Alluka'),
      change('Hunter Association', 'Leaderless institution', 'Cheadle-led organization facing the Dark Continent agenda'),
      change('Gon', 'Critically damaged and unconscious', 'Healed and able to meet Ging'),
    ],
    ending: 'Gon is healed, Pariston resigns immediately after winning, Cheadle becomes chairwoman, and Gon speaks with Ging at the World Tree.',
    transition: 'Ging and the Association’s political realignment open the Dark Continent expedition, Beyond Netero’s challenge, and Kakin’s voyage.',
    adaptation: ['The 2011 anime adapts Chapters 319–339 in Episodes 137–148.', 'Episode 148 concludes the television adaptation while the manga continues into the expedition and Succession Contest.'],
    sources: [
      source('13th Hunter Chairman Election arc', 'https://hunterxhunter.fandom.com/wiki/13th_Hunter_Chairman_Election_arc'),
      source('Alluka Zoldyck', 'https://hunterxhunter.fandom.com/wiki/Alluka_Zoldyck'),
      source('Hunter Association', 'https://hunterxhunter.fandom.com/wiki/Hunter_Association'),
    ],
  },

  'succession-contest': {
    context: 'Beyond Netero’s plan, Kakin’s expedition, the Association’s mission, and King Nasubi’s succession ritual converge aboard Black Whale 1. Kurapika protects Queen Oito and Prince Woble while every household develops its own security and Nen strategy.',
    objective: 'Keep Woble and Oito alive, understand the ritual, manage Nen education and alliances, and survive overlapping royal, military, mafia, and Troupe conflicts.',
    stakes: 'Fourteen princes are trapped in a lethal structure while hundreds of thousands travel inside a ship whose tiers encode political class and access.',
    structure: 'A multi-thread political archive organized by voyage day, room, household, information state, body state, and factional operation.',
    question: 'Can any participant resist a political system designed to convert family, law, and inherited power into sacrifice?',
    phases: [
      { title: 'Expedition announcement', range: 'Ch. 340–348', summary: 'Beyond, Kakin, the Association, and the Zodiacs establish competing public and private missions.' },
      { title: 'Succession preparation', range: 'Ch. 349–358', summary: 'Kurapika joins Oito, the princes assemble guards, and the Seed Urn ceremony activates the ritual.' },
      { title: 'Departure and first deaths', range: 'Ch. 359–370', summary: 'The Black Whale sails, Guardian Spirit Beasts manifest, and assassinations begin around Room 1014.' },
      { title: 'Nen lessons and royal escalation', range: 'Ch. 371–388', summary: 'Kurapika uses classes to alter the information balance while princes reveal abilities and plans.' },
      { title: 'Mafia and Troupe collision', range: 'Ch. 389–410', summary: 'Heil-Ly, Xi-Yu, Cha-R, and the Phantom Troupe expand the conflict across lower tiers.' },
      { title: 'Funeral and martial-law countdown', range: 'Ch. 411–413', summary: 'Halkenburg’s procession, Kurapika’s second lesson, and the approach of special martial law compress the remaining time.' },
    ],
    characters: [
      character('Kurapika', 'Lead bodyguard and Nen instructor', 'Protect Woble and recover the remaining Scarlet Eyes', 'Oito and Woble household'),
      character('Oito Hui Guo Rou', 'Eighth queen and client', 'Keep Woble alive and escape the contest', 'Fourteenth Prince household'),
      character('Woble Hui Guo Rou', 'Fourteenth prince', 'Survive a ritual imposed at birth', 'Fourteenth Prince household'),
      character('Tserriednich Hui Guo Rou', 'Fourth prince and collector', 'Master Nen and dominate the succession', 'Fourth Prince household'),
      character('Benjamin Hui Guo Rou', 'First prince and military power', 'Secure succession through command and inherited ability', 'First Prince household'),
      character('Beyond Netero', 'Expedition architect and detainee', 'Reach the Dark Continent', 'Beyond expedition team'),
    ],
    factions: [
      faction('Fourteen royal households', 'Protect or advance each prince', 'Queens, princes, senior guards, and royal military', 'Ongoing; several princes and guards are dead or transformed'),
      faction('Hunter Association expedition team', 'Control Beyond and complete the sanctioned expedition', 'Zodiacs and contracted Hunters', 'Ongoing aboard the Black Whale'),
      faction('Kakin mafia families', 'Control lower-tier territory and succession-linked patronage', 'Xi-Yu, Cha-R, and Heil-Ly leadership', 'Open conflict expands after Heil-Ly breaks the balance'),
      faction('Phantom Troupe', 'Find Hisoka and respond to mafia interference', 'Chrollo and surviving members', 'Operating across lower tiers'),
    ],
    locations: [
      place('Black Whale 1', 'Voyage ship and total political environment', 'Tier access, rooms, checkpoints, and closures determine every operation'),
      place('Tier 1 royal quarters', 'Succession battlefield', 'Households gather information through guards, servants, classes, and assassinations'),
      place('Lower tiers', 'Passenger city and mafia territory', 'Heil-Ly and Troupe operations transform public space into factional conflict'),
    ],
    nen: ['Guardian Spirit Beasts and the Seed Urn ritual', 'Emperor Time and Stealth Dolphin', 'Kurapika’s Nen classes', 'Parallel Future', 'Benjamin Baton', 'Contagion', 'Possession and soul-transfer abilities'],
    conflicts: [
      conflict('Room 1014 defence', 'Kurapika, Oito, Bill, hostile guards, and abilities', 'Keep Woble alive while identifying threats', 'The room becomes an information hub through Nen education'),
      conflict('Kacho and Fugetsu escape attempt', 'Kacho, Fugetsu, Melody, Kaiser, and ship systems', 'Escape the succession area', 'Kacho dies and her Guardian Spirit Beast preserves her image'),
      conflict('Heil-Ly conflict', 'Heil-Ly, Xi-Yu, Cha-R, Phantom Troupe, Justice Bureau', 'Control territory and eliminate Morena’s network', 'Ongoing across lower tiers'),
      conflict('Halkenburg operation', 'Halkenburg, Balsamilco, and Benjamin’s guards', 'Strike at the hierarchy through body-transfer mechanics', 'Halkenburg’s original body dies while the operation continues'),
    ],
    objects: [
      objectRecord('Seed Urn', 'Kakin royal institution', 'Initiates the ritual and Guardian Spirit Beasts', 'Makes legitimacy inseparable from inherited Nen'),
      objectRecord('Stealth Dolphin', 'Kurapika', 'Analyzes, stores, and loans abilities', 'Gives flexibility at severe lifespan cost'),
      objectRecord('Scarlet Eyes collection', 'Tserriednich and Kurapika’s targets', 'Contains stolen Kurta remains', 'Connects Kurapika’s original mission to the fourth prince'),
    ],
    themes: [
      theme('Legitimacy and sacrifice', 'The ritual presents mass death as the concealed foundation of royal continuity.'),
      theme('Information warfare', 'Knowing an ability, room, allegiance, or timetable is often more decisive than raw power.'),
      theme('Inherited systems', 'Princes, guards, mafia heirs, and curse children act inside structures created before consent.'),
    ],
    changes: [
      change('Kurapika', 'Specialist investigator entering a bodyguard contract', 'Central information broker paying an accelerating Emperor Time cost'),
      change('Royal contest', 'Secret ritual framed as succession tradition', 'Open field of deaths, abilities, alliances, and martial-law pressure'),
      change('Black Whale', 'Expedition vessel with formal tier order', 'Closed environment whose spaces are increasingly militarized'),
    ],
    ending: 'The arc is ongoing. Chapter 413 ends inside the funeral and martial-law countdown rather than resolving the succession, voyage, mafia war, or Kurapika’s mission.',
    transition: 'No next arc is yet available. Seven deep pages continue the royal family, cast, timeline, ship, Nen, power-bloc, and record systems.',
    adaptation: ['The Succession Contest has no 2011 anime adaptation.', 'The archive treats manga chapter records and the Chapter 413 evidence boundary as controlling.'],
    sources: [
      source('Succession Contest arc', 'https://hunterxhunter.fandom.com/wiki/Succession_Contest_arc'),
      source('Black Whale', 'https://hunterxhunter.fandom.com/wiki/Black_Whale'),
      source('Kakin Empire', 'https://hunterxhunter.fandom.com/wiki/Kakin_Empire'),
    ],
  },
};

const arcById = new Map(arcs.map((arc) => [arc.id, arc]));

const normaliseOfficialArc = (entry, detail) => {
  const arc = arcById.get(entry.officialArcId || entry.id);
  if (!arc) return detail;
  return {
    status: detail.status || (entry.id === 'succession-contest' ? 'Ongoing through Chapter 413' : 'Completed official arc'),
    focus: detail.focus || arc.focus,
    premise: detail.premise || arc.premise,
    ...detail,
  };
};

export const storyArcPages = storyEntries.map((entry) => Object.freeze({
  ...entry,
  ...normaliseOfficialArc(entry, pages[entry.id]),
  visual: visualIdentities[entry.id],
}));

export const storyArcPageById = new Map(storyArcPages.map((arc) => [arc.id, arc]));
export const storyArcIds = new Set(storyArcPages.map((arc) => arc.id));
