const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const file = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;

export const hunterExamLocations = [
  {
    id: 'whale-island', name: 'Whale Island', stage: 'Departure', phase: 'Before the preliminary screening',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/0/0e/Whale_Island.png/revision/latest',
    source: wiki('Whale_Island'), chapters: 'Chapter 1', episodes: 'Episode 1', population: 'Gon departs alone', travel: 'Fishing boat to the applicant ship',
    purpose: 'Gon’s home and the emotional starting point of the examination journey.',
    events: ['Master of the Swamp', 'Mito signs the application', 'Gon leaves to find Ging'],
    alt: 'Whale Island viewed from the sea under a blue sky',
  },
  {
    id: 'kaijinmaru', name: 'Applicant ship', stage: 'Preliminary screening', phase: 'Captain’s test',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/2/23/Kaijinmaru_2011.png/revision/latest',
    source: wiki('Kaijinmaru'), chapters: 'Chapters 1–3', episodes: 'Episodes 1–2', population: 'Many board; three are selected', travel: 'Sea voyage to Dolle Harbor',
    purpose: 'Storm endurance, motivation, teamwork, and the first hidden applicant screen.',
    events: ['Two storms', 'Captain interviews the trio', 'Katzo rescue'],
    alt: 'The Hunter Exam applicant ship travelling through rough water',
  },
  {
    id: 'dolle-harbor', name: 'Dolle Harbor', stage: 'Preliminary route', phase: 'Route selection',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/a/aa/Dolle_Harbor_2011.png/revision/latest',
    source: wiki('Dolle_Harbor'), chapters: 'Chapter 3', episodes: 'Episode 2', population: 'Prospective applicants disperse', travel: 'On foot toward the lone pine tree',
    purpose: 'The port where successful ship candidates receive the first concealed route hint.',
    events: ['Captain’s farewell', 'Bus trap avoided', 'Lone pine landmark'],
    alt: 'Dolle Harbor crowded with buildings, docks, and Hunter Exam applicants',
  },
  {
    id: 'quizzing-crossroads', name: 'Quizzing Lady’s crossroads', stage: 'Preliminary route', phase: 'Impossible-choice test',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/c/c7/HxH2011_EP2_Quizzing_Lady_Portrait.png/revision/latest',
    source: wiki('Quizzing_Lady'), chapters: 'Chapter 3', episodes: 'Episode 2', population: 'The trio passes; Matthew is misdirected', travel: 'Forest path toward the Kiriko home',
    purpose: 'Tests whether applicants recognize that a moral dilemma cannot always be answered on command.',
    events: ['Five-second question', 'Silence is accepted', 'Correct path revealed'],
    alt: 'The Quizzing Lady who guards a preliminary Hunter Exam route',
  },
  {
    id: 'kiriko-home', name: 'Kiriko home and route', stage: 'Preliminary route', phase: 'Navigator test',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/b/b0/HxH2011_EP2_Kiriko_Family.png/revision/latest',
    source: wiki('Kiriko'), chapters: 'Chapter 4', episodes: 'Episode 2', population: 'Gon, Kurapika, and Leorio pass', travel: 'Kiriko flight directly to Zaban City',
    purpose: 'Tests observation, pursuit, compassion, deception detection, and medical judgment.',
    events: ['Staged kidnapping', 'Identity test', 'Password and transport awarded'],
    alt: 'The Kiriko family in their true magical-beast forms',
  },
  {
    id: 'zaban-city', name: 'Zaban City', stage: 'Registration', phase: 'Formal exam threshold',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/c/cd/HxH2011_EP3_Zaban_City.png/revision/latest',
    source: wiki('Zaban_City'), chapters: 'Chapter 5', episodes: 'Episode 3', population: '405 applicants gather', travel: 'Secret restaurant elevator underground',
    purpose: 'The prosperous city concealing the formal Hunter Exam gathering hall beneath Tsubashi Street.',
    events: ['Password exchange', 'Applicant badges assigned', 'Tonpa meets the rookies'],
    alt: 'Zaban City during the 287th Hunter Exam',
  },
  {
    id: 'underground-tunnel', name: 'Underground tunnel', stage: 'First Phase', phase: 'Endurance run',
    image: file('Tunnel_3.png'), source: wiki('Zaban_City#Underground_Tunnel'), chapters: 'Chapters 5–7', episodes: 'Episodes 3–4',
    population: '404 start; 148 complete Phase One', travel: 'More than 80 kilometres on foot',
    purpose: 'The first formal course measures sustained pace, mental endurance, and willingness to continue without knowing the distance.',
    events: ['Satotz begins running', 'Nicholas collapses', 'Staircase ascent'],
    alt: 'Hundreds of Hunter Exam applicants gathered in the underground tunnel',
  },
  {
    id: 'milsy-wetlands', name: 'Milsy Wetlands', stage: 'First Phase', phase: 'Swindler’s Swamp',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/2/26/HxH2011_EP4_Milsy_Wetlands.png/revision/latest',
    source: wiki('Milsy_Wetlands'), chapters: 'Chapters 7–10', episodes: 'Episodes 4–5', population: 'Remaining Phase One field', travel: 'Follow Satotz through fog and predators',
    purpose: 'A deceptive ecosystem where losing the examiner can be as fatal as confronting its wildlife.',
    events: ['Man-faced Ape deception', 'Hisoka attacks applicants', 'Gon protects Leorio'],
    alt: 'Fog-covered Milsy Wetlands during the First Phase',
  },
  {
    id: 'visca-forest', name: 'Visca Forest Preserve', stage: 'Second Phase', phase: 'Gourmet Hunter test',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/e/e8/Second_phase_site.png/revision/latest',
    source: wiki('Visca_Forest_Preserve'), chapters: 'Chapters 10–12', episodes: 'Episode 6', population: '148 enter; 70 clear Buhara’s portion', travel: 'Forest hunt and riverside preparation',
    purpose: 'The cooking site where adaptability and respect for unfamiliar Hunter professions are tested.',
    events: ['Great Stamp hunt', 'Sushi test', 'Netero intervenes'],
    alt: 'The Second Phase examination site in the Visca Forest Preserve',
  },
  {
    id: 'split-mountain', name: 'Split Mountain', stage: 'Second Phase', phase: 'Replacement test',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/4/45/Mount_mafutatsu.png/revision/latest',
    source: wiki('Split_Mountain'), chapters: 'Chapter 12', episodes: 'Episode 6', population: '42 pass', travel: 'Airship transport from the forest preserve',
    purpose: 'The valid replacement test requires applicants to judge the updraft and retrieve Spider Eagle eggs.',
    events: ['Netero demonstrates the jump', 'Egg retrieval', 'Forty-two passes'],
    alt: 'Split Mountain divided by a deep ravine',
  },
  {
    id: 'trick-tower', name: 'Trick Tower', stage: 'Third Phase', phase: 'Seventy-two-hour descent',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/b/b7/HxH2011_EP8_Trick_Tower.png/revision/latest',
    source: wiki('Trick_Tower'), chapters: 'Chapters 14–22', episodes: 'Episodes 8–11', population: '40 enter; 24 living applicants pass', travel: 'Airship to the tower roof',
    purpose: 'A prison and puzzle complex testing route selection, cooperation, time management, and judgment.',
    events: ['Roof trapdoors', 'Majority Rules', 'Prisoner arena', 'Wall-breaking exit'],
    alt: 'The cylindrical Trick Tower viewed from the air',
  },
  {
    id: 'zevil-island', name: 'Zevil Island', stage: 'Fourth Phase', phase: 'Badge hunt',
    image: 'https://static.wikia.nocookie.net/hunterxhunter/images/1/1f/Zevil_Island.png/revision/latest',
    source: wiki('Zevil_Island'), chapters: 'Chapters 23–31', episodes: 'Episodes 14–16', population: '24 enter; 9 pass', travel: 'Two-hour boat journey; staggered landings',
    purpose: 'A one-week pursuit field where applicants become both hunter and target.',
    events: ['Target draw', 'Gon stalks Hisoka', 'Ponzu’s cave', 'Final badge collection'],
    alt: 'Remote Zevil Island surrounded by water',
  },
  {
    id: 'association-hotel', name: 'Hunter Association hotel', stage: 'Final Phase', phase: 'Inverted tournament',
    image: file('Final_Phase_Bracket.png'), source: wiki('287th_Hunter_Exam#Final_Phase'), chapters: 'Chapters 32–38', episodes: 'Episodes 17–21',
    population: '9 finalists; 7 licenses', travel: 'Association airship from Zevil Island',
    purpose: 'The final venue where one victory earns a license and killing causes automatic disqualification.',
    events: ['Netero interviews finalists', 'Gon versus Hanzo', 'Illumi reveals himself', 'Bodoro is killed'],
    alt: 'The final phase bracket of the 287th Hunter Exam',
  },
];

export const hunterExamPhaseVisuals = [
  { id: 'preliminary', label: 'Preliminary screening', title: 'The exam begins before registration.', images: [hunterExamLocations[1], hunterExamLocations[3], hunterExamLocations[4]] },
  { id: 'phase-one', label: 'Phase One', title: 'Endurance becomes survival.', images: [hunterExamLocations[6], hunterExamLocations[7]] },
  { id: 'phase-two', label: 'Phase Two', title: 'Adaptability and examiner judgment.', images: [hunterExamLocations[8], hunterExamLocations[9]] },
  { id: 'phase-three', label: 'Phase Three', title: 'Time, rules, and imprisonment.', images: [hunterExamLocations[10], { id: 'prisoner-arena', name: 'Prisoner arena', image: file('8_-_arena.png'), source: wiki('Trick_Tower'), alt: 'Applicants and prisoners facing each other inside Trick Tower', chapters: 'Chapters 16–21', episodes: 'Episodes 9–11' }] },
  { id: 'phase-four', label: 'Phase Four', title: 'Every applicant becomes prey.', images: [hunterExamLocations[11], { id: 'fisher-bird', name: 'Gon’s training', image: file('Gon_catches_the_bird.PNG'), source: wiki('Zevil_Island'), alt: 'Gon catches a Fisher Bird while training on Zevil Island', chapters: 'Chapter 24', episodes: 'Episode 14' }] },
  { id: 'final-phase', label: 'Final Phase', title: 'Resolve matters more than a clean victory.', images: [{ id: 'gon-hanzo', name: 'Gon versus Hanzo', image: file('Gon_vs_Hanzo.png'), source: wiki('Chapter_34'), alt: 'Gon and Hanzo during the Final Phase', chapters: 'Chapters 33–34', episodes: 'Episodes 19–20' }, { id: 'illumi-reveal', name: 'Illumi reveals himself', image: file('Illumi_reveals_himself.png'), source: wiki('Chapter_36'), alt: 'Illumi revealing his identity to Killua', chapters: 'Chapters 35–37', episodes: 'Episodes 20–21' }] },
];

export const earlyApplicantRecords = [
  { badge: 'Unassigned', name: 'Matthew', phase: 'Preliminary route', result: 'Failed preliminary screening', condition: 'Misdirected after answering the Quizzing Lady', image: file('Matthew_HE_Portrait.png'), source: wiki('Matthew') },
  { badge: 187, name: 'Nicholas', phase: 'Phase One', result: 'Failed endurance run', condition: 'Collapsed in the underground tunnel', image: file('Nicholas_HE_Portrait.png'), source: wiki('Nicholas') },
  { badge: 76, name: 'Cherry', phase: 'Phase One', result: 'Died', condition: 'Killed by Hisoka in the Milsy Wetlands', image: file('Cherry_HE_Portrait.png'), source: wiki('Cherry') },
  { badge: 255, name: 'Todo', phase: 'Phase Two', result: 'Failed', condition: 'Rejected by Menchi; knocked out by Buhara during his protest', image: file('Todo_HE_Portrait.png'), source: wiki('Todo') },
  { badge: 86, name: 'Rock climber', phase: 'Phase Three', result: 'Died', condition: 'Killed by flying beasts while descending the tower exterior', image: file('Examinee_86.png'), source: wiki('Trick_Tower') },
];

export const phaseFourPortraitFiles = {
  405: 'Gon_Freecss_HE_Portrait.png', 404: 'Kurapika_HE_Portrait.png', 403: 'Leorio_Paradinight_HE_Portrait.png',
  384: 'Geretta_HE_Portrait.png', 371: 'Goz_HE_Portrait.png', 362: 'Kenmi_HE_Portrait.png', 301: 'Gittarackur_HE_Portrait.png',
  294: 'Hanzo_HE_Portrait.png', 281: 'Agon_HE_Portrait.png', 246: 'Ponzu_HE_Portrait.png', 199: 'Umori_HE_Portrait.png',
  198: 'Imori_HE_Portrait.png', 197: 'Amori_HE_Portrait.png', 191: 'Bodoro_HE_Portrait.png', 118: 'Sommy_HE_Portrait.png',
  105: 'Kyu_HE_Portrait.png', 103: 'Bourbon_HE_Portrait.png', 99: 'Killua_Zoldyck_HE_Portrait.png', 89: 'Shishito_HE_Portrait.png',
  80: 'Siper_HE_Portrait.png', 53: 'Pokkle_HE_Portrait.png', 44: 'Hisoka_Morow_HE_Portrait.png', 34: 'Ryu_HE_Portrait.png', 16: 'Tonpa_HE_Portrait.png',
};

export const portraitForBadge = (badge) => file(phaseFourPortraitFiles[badge]);

export const hunterExamProgression = [
  { name: 'Gon', preliminary: 'Pass', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Killua', preliminary: 'Pass', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Disqualified' },
  { name: 'Kurapika', preliminary: 'Pass', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Leorio', preliminary: 'Pass', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Hisoka', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Hanzo', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Illumi', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Pokkle', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Licensed' },
  { name: 'Bodoro', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Pass', final: 'Killed' },
  { name: 'Tonpa', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Failed', final: '—' },
  { name: 'Todo', preliminary: 'Registered', one: 'Pass', two: 'Failed', three: '—', four: '—', final: '—' },
  { name: 'Nicholas', preliminary: 'Registered', one: 'Failed', two: '—', three: '—', four: '—', final: '—' },
  { name: 'Cherry', preliminary: 'Registered', one: 'Died', two: '—', three: '—', four: '—', final: '—' },
  { name: 'Geretta', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Died', final: '—' },
  { name: 'Ponzu', preliminary: 'Registered', one: 'Pass', two: 'Pass', three: 'Pass', four: 'Failed', final: '—' },
];

export const hunterExamAttrition = [
  { stage: 'Before Phase One', entered: 405, passed: 404, removed: 1, knownDeaths: '0 documented', classification: 'One applicant cannot continue before Satotz begins; the exact reason is not individually documented.' },
  { stage: 'Phase One', entered: 404, passed: 148, removed: 256, knownDeaths: 'Cherry and unnamed victims', classification: 'The source does not divide all removals into exhaustion, separation, deception, injury, or death.' },
  { stage: 'Phase Two', entered: 148, passed: 42, removed: 106, knownDeaths: '0 documented', classification: 'Seventy clear Buhara’s test; forty-two pass the replacement test. The remainder fail the food evaluations.' },
  { stage: 'Between Phases Two and Three', entered: 42, passed: 40, removed: 2, knownDeaths: '2', classification: 'Two candidates die before the Trick Tower examination begins; individual identities are not recorded here.' },
  { stage: 'Phase Three', entered: 40, passed: 24, removed: 16, knownDeaths: 'At least 2 documented at the tower', classification: 'One climber is killed outside; one candidate reaches the bottom and dies. Other routes are not individually classified.' },
  { stage: 'Phase Four', entered: 24, passed: 9, removed: 15, knownDeaths: '5 named deaths', classification: 'Geretta, Goz, Agon, Bourbon, and Siper die; ten other applicants fail the point requirement.' },
  { stage: 'Final Phase', entered: 9, passed: 7, removed: 2, knownDeaths: 'Bodoro', classification: 'Bodoro is killed. Killua is formally disqualified for killing him.' },
];

export const hunterExamHostPortraits = [
  { name: 'Captain', stage: 'Preliminary', role: 'Storm, motive, and teamwork screening', image: 'https://static.wikia.nocookie.net/hunterxhunter/images/0/08/Captain_2011.PNG/revision/latest', source: wiki('Captain') },
  { name: 'Quizzing Lady', stage: 'Preliminary', role: 'Impossible-choice gatekeeper', image: 'https://static.wikia.nocookie.net/hunterxhunter/images/c/c7/HxH2011_EP2_Quizzing_Lady_Portrait.png/revision/latest', source: wiki('Quizzing_Lady') },
  { name: 'Kiriko family', stage: 'Preliminary', role: 'Observation and compassion screening', image: 'https://static.wikia.nocookie.net/hunterxhunter/images/b/b0/HxH2011_EP2_Kiriko_Family.png/revision/latest', source: wiki('Kiriko') },
  { name: 'Satotz', stage: 'Phase One', role: 'Endurance and wetlands examiner', image: file('Satotz_HE_Portrait.png'), source: wiki('Satotz') },
  { name: 'Buhara', stage: 'Phase Two', role: 'Gourmet Hunter examiner', image: file('Buhara_HE_Portrait.png'), source: wiki('Buhara') },
  { name: 'Menchi', stage: 'Phase Two', role: 'Gourmet Hunter examiner', image: file('Menchi_HE_Portrait.png'), source: wiki('Menchi') },
  { name: 'Isaac Netero', stage: 'Phases Two and Five', role: 'Chairman intervention and final bracket design', image: file('Isaac_Netero_HE_Portrait.png'), source: wiki('Isaac_Netero') },
  { name: 'Lippo', stage: 'Phases Three and Four', role: 'Tower control and badge-hunt briefing', image: file('Lippo_HE_Portrait.png'), source: wiki('Lippo') },
  { name: 'Togari', stage: 'Phase Three', role: 'Examiner who confronts Hisoka', image: file('Togari_HE_Portrait.png'), source: wiki('Togari') },
  { name: 'Khara', stage: 'Phase Four', role: 'Transport and landing instructions', image: file('Khara_HE_Portrait.png'), source: wiki('Khara') },
  { name: 'Beans', stage: 'Final Phase', role: 'Hunter Association administration', image: file('Beans_HE_Portrait.png'), source: wiki('Beans') },
  { name: 'Masta', stage: 'Final Phase', role: 'Tournament referee and support', image: file('Masta_HE_Portrait.png'), source: wiki('Masta') },
];

export const trickTowerPrisoners = [
  { name: 'Bendot', opponent: 'Tonpa', test: 'Combat', effect: 'Immediate surrender; no extended delay', image: file('Bendot_HE_Portrait.png'), source: wiki('Bendot') },
  { name: 'Sedokan', opponent: 'Gon', test: 'Candle challenge', effect: 'Gon defeats the rigged setup', image: file('Sedokan_HE_Portrait.png'), source: wiki('Sedokan') },
  { name: 'Majtani', opponent: 'Kurapika', test: 'Death match and deception', effect: 'Defeated; creates a dispute over whether the match ended', image: file('Majtani_HE_Portrait.png'), source: wiki('Majtani') },
  { name: 'Leroute', opponent: 'Leorio', test: 'Gambling and psychology', effect: 'Costs the team fifty hours', image: file('Leroute_HE_Portrait.png'), source: wiki('Leroute') },
  { name: 'Johness', opponent: 'Killua', test: 'Combat', effect: 'Killed immediately by Killua', image: file('Johness_HE_Portrait.png'), source: wiki('Johness') },
];

export const hunterExamObjectsVisual = [
  { name: 'Candidate badge', phase: 'Registration and Phase Four', function: 'Identity marker and later point currency', image: file('Hunter_Exam_Badges.png'), source: wiki('287th_Hunter_Exam') },
  { name: 'Tonpa’s laxative drink', phase: 'Registration', function: 'Sabotage aimed at rookie applicants', image: file('Tonpa_Juice.png'), source: wiki('Tonpa') },
  { name: 'Great Stamp', phase: 'Phase Two', function: 'Prey for Buhara’s roast-pig test', image: file('Great_Stamp.png'), source: wiki('Great_Stamp') },
  { name: 'Spider Eagle egg', phase: 'Phase Two', function: 'Object retrieved during the replacement test', image: file('Spider_Eagle_Egg.png'), source: wiki('Spider_Eagle') },
  { name: 'Trick Tower timer', phase: 'Phase Three', function: 'Tracks time and majority-rule decisions', image: file('Trick_Tower_Timer.png'), source: wiki('Trick_Tower') },
  { name: 'Target card', phase: 'Phase Four', function: 'Secretly assigns a three-point target', image: file('Target_Cards.png'), source: wiki('287th_Hunter_Exam#Fourth_Phase') },
  { name: 'Gon’s fishing rod', phase: 'Phases One and Four', function: 'Rescue tool and badge-theft weapon', image: file('Gon_Fishing_Rod.png'), source: wiki('Fishing_Rod') },
  { name: 'Geretta’s blowpipe', phase: 'Phase Four', function: 'Paralytic ambush weapon used against Gon', image: file('Geretta_Blowpipe.png'), source: wiki('Geretta') },
  { name: 'Final tournament bracket', phase: 'Final Phase', function: 'Uneven inverted bracket based on Netero’s interviews', image: file('Final_Phase_Bracket.png'), source: wiki('287th_Hunter_Exam#Final_Phase') },
  { name: 'Hunter License', phase: 'Exam reward', function: 'Grants access, authority, information, and financial privileges', image: file('Hunter_License.png'), source: wiki('Hunter_License') },
];

export const hunterExamConflicts = [
  { title: 'Hisoka’s wetlands attack', participants: 'Hisoka · separated applicants · Kurapika · Leorio · Gon', location: 'Milsy Wetlands', objective: 'Hisoka tests and removes applicants who do not interest him.', result: 'Multiple applicants die; Gon and Leorio survive Hisoka’s appraisal.', image: file('Hisoka_wetlands_attack.png'), source: wiki('Milsy_Wetlands') },
  { title: 'Hisoka versus Togari', participants: 'Hisoka · Togari', location: 'Trick Tower', objective: 'Togari seeks revenge for the previous exam.', result: 'Hisoka kills Togari and reaches the bottom first.', image: file('Hisoka_vs_Togari.png'), source: wiki('Togari') },
  { title: 'Gon’s badge theft', participants: 'Gon · Hisoka · Geretta', location: 'Zevil Island', objective: 'Take badge #44 without defeating Hisoka directly.', result: 'Gon succeeds, then Geretta ambushes him; Hisoka kills Geretta and returns the badges.', image: file('Gon_takes_Hisoka_badge.png'), source: wiki('Chapter_27') },
  { title: 'Kurapika and Leorio’s alliance', participants: 'Kurapika · Leorio · Tonpa · Ponzu', location: 'Zevil Island', objective: 'Secure enough badge points while preserving their partnership.', result: 'Kurapika and Leorio reach six points; Tonpa and Ponzu fail.', image: file('Kurapika_Leorio_Zevil.png'), source: wiki('Chapter_31') },
  { title: 'Killua versus the Amori brothers', participants: 'Killua · Amori · Imori · Umori', location: 'Zevil Island', objective: 'End the brothers’ stalking and obtain the required target badge.', result: 'Killua defeats the group and takes Umori’s badge.', image: file('Killua_vs_Amori_Brothers.png'), source: wiki('Chapter_29') },
  { title: 'Gon versus Hanzo', participants: 'Gon · Hanzo', location: 'Final Phase hotel', objective: 'Force the opponent to concede.', result: 'Hanzo dominates physically but concedes because Gon refuses to surrender.', image: file('Gon_vs_Hanzo.png'), source: wiki('Chapter_34') },
  { title: 'Killua versus Illumi', participants: 'Killua · Illumi', location: 'Final Phase hotel', objective: 'Illumi reasserts family control and forces Killua to concede.', result: 'Illumi passes; Killua’s conditioning becomes visible.', image: file('Killua_vs_Illumi.png'), source: wiki('Chapter_36') },
  { title: 'Bodoro’s death', participants: 'Killua · Bodoro · Leorio', location: 'Final Phase hotel', objective: 'The scheduled match never properly begins.', result: 'Killua kills Bodoro and is automatically disqualified.', image: file('Killua_kills_Bodoro.png'), source: wiki('Chapter_38') },
];

export const hunterExamChapterMap = [
  { stage: 'Departure and preliminary', manga: 'Chapters 1–5', anime: 'Episodes 1–4', events: 'Whale Island, applicant ship, Dolle Harbor, Quizzing Lady, Kiriko, registration' },
  { stage: 'Phase One', manga: 'Chapters 6–10', anime: 'Episodes 4–5', events: 'Tunnel endurance, stairs, Milsy Wetlands, Hisoka’s attack' },
  { stage: 'Phase Two', manga: 'Chapters 10–12', anime: 'Episode 6', events: 'Great Stamp, sushi, Netero’s intervention, Spider Eagle eggs' },
  { stage: 'Airship interval', manga: 'Chapters 12–14', anime: 'Episodes 7–8', events: 'Netero’s ball game and arrival at Trick Tower' },
  { stage: 'Phase Three', manga: 'Chapters 14–22', anime: 'Episodes 8–11', events: 'Majority Rules, prisoner matches, tower escape' },
  { stage: 'Phase Four', manga: 'Chapters 23–31', anime: 'Episodes 14–16', events: 'Target draw, badge hunt, Gon and Hisoka, cave trap' },
  { stage: 'Final Phase', manga: 'Chapters 32–38', anime: 'Episodes 17–21', events: 'Interviews, inverted bracket, Illumi reveal, disqualification, licenses' },
];

export const hunterExamGallery = [
  ...hunterExamLocations.slice(0, 12).map((item) => ({ title: item.name, group: item.stage, image: item.image, alt: item.alt, source: item.source, record: `${item.chapters} · ${item.episodes}` })),
  { title: 'Prisoner arena', group: 'Phase Three', image: file('8_-_arena.png'), alt: 'The prisoner arena inside Trick Tower', source: wiki('Trick_Tower'), record: 'Chapters 16–21 · Episodes 9–11' },
  { title: 'Fisher Bird training', group: 'Phase Four', image: file('Gon_catches_the_bird.PNG'), alt: 'Gon training his fishing-rod timing on Zevil Island', source: wiki('Zevil_Island'), record: 'Chapter 24 · Episode 14' },
  { title: 'Final Phase', group: 'Final Phase', image: file('Gon_vs_Hanzo.png'), alt: 'Gon facing Hanzo in the Final Phase', source: wiki('Chapter_34'), record: 'Chapters 33–34 · Episodes 19–20' },
];
