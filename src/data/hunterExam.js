const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const hunterExamArtwork = {
  hero: {
    src: 'https://static.wikia.nocookie.net/hunterxhunter/images/0/05/Hunter_Exam_Poster.png/revision/latest',
    fallback: '/media/portraits/gon-freecss.webp',
    alt: 'Hunter Exam arc poster showing applicants and the examination setting',
    source: wiki('Hunter_Exam_arc'),
  },
};

export const hunterExamSummary = {
  title: 'The 287th Hunter Examination',
  manga: 'Chapters 1–38',
  anime: '2011 Episodes 1–21',
  gathered: 405,
  formalStart: 404,
  phases: 5,
  finalists: 9,
  licensed: 7,
  disqualified: 1,
  killedFinal: 1,
};

export const hunterExamFunnel = [
  { id: 'gathering', label: 'Applicants gathered', count: 405, reduction: 0, note: 'Candidate badges are assigned at the Zaban City exam hall.' },
  { id: 'phase-one', label: 'First Phase begins', count: 404, reduction: 1, note: 'One candidate is unable to continue before Satotz starts the formal course.' },
  { id: 'phase-two', label: 'Reach Phase Two', count: 148, reduction: 256, note: 'Tunnel endurance and the Milsy Wetlands remove most of the field.' },
  { id: 'phase-three-qualified', label: 'Pass Phase Two', count: 42, reduction: 106, note: 'The replacement Spider Eagle egg test produces forty-two passes.' },
  { id: 'phase-three', label: 'Enter Trick Tower', count: 40, reduction: 2, note: 'Two candidates die between the Second and Third Phases.' },
  { id: 'phase-four', label: 'Reach Zevil Island', count: 24, reduction: 16, note: 'Twenty-four candidates reach the tower exit within seventy-two hours.' },
  { id: 'final', label: 'Reach Final Phase', count: 9, reduction: 15, note: 'Nine candidates finish the week with at least six badge points.' },
  { id: 'licensed', label: 'Receive Hunter Licenses', count: 7, reduction: 2, note: 'Bodoro is killed and Killua is formally disqualified.' },
];

export const hunterExamRoute = [
  ['Whale Island', 'Gon leaves home and begins the search for Ging.'],
  ['Captain’s ship', 'Storm endurance, motivation, and character are judged before the advertised exam.'],
  ['Dolle Harbor', 'The Captain directs the trio toward the next hidden screening.'],
  ['Quizzing Lady', 'An impossible-choice question tests judgment rather than speed.'],
  ['Kiriko route', 'Observation, pursuit, compassion, and medical judgment determine access.'],
  ['Zaban City', 'Applicant numbers are assigned at the underground exam hall.'],
  ['Underground tunnel', 'Satotz leads the endurance run over more than eighty kilometres.'],
  ['Milsy Wetlands', 'Fog, predators, deception, and Hisoka split the field.'],
  ['Visca Forest Preserve', 'Gourmet Hunters begin the Second Phase.'],
  ['Split Mountain', 'Spider Eagle eggs replace Menchi’s invalidated sushi result.'],
  ['Trick Tower', 'Forty applicants receive seventy-two hours to reach the bottom.'],
  ['Zevil Island', 'Twenty-four applicants enter a one-week badge hunt.'],
  ['Association hotel', 'Nine finalists enter Netero’s inverted tournament.'],
];

export const hunterExamPreliminary = [
  { host: 'The Captain', type: 'Association scout', test: 'Storm endurance and motivation', result: 'Gon, Kurapika, and Leorio receive the correct port and route hint.', source: wiki('Captain') },
  { host: 'Quizzing Lady', type: 'Route gatekeeper', test: 'The impossible-choice question', result: 'Silence demonstrates awareness that some choices cannot be reduced to a simple answer.', source: wiki('Quizzing_Lady') },
  { host: 'Kiriko family', type: 'Magical Beast navigators', test: 'Observation, pursuit, deception, and compassion', result: 'The trio is flown directly to the true exam site and receives the password.', source: wiki('Kiriko') },
];

export const hunterExamPhases = [
  {
    id: 'phase-one', number: '01', title: 'Endurance and Wetlands', examiner: 'Satotz', entered: 404, passed: 148, removed: 256,
    duration: 'Continuous route', location: 'Zaban tunnel → Milsy Wetlands',
    rules: ['Keep pace with Satotz.', 'Do not become separated or deceived in the wetlands.', 'Reach the Second Phase site.'],
    events: [
      ['Underground marathon', 'The course exceeds eighty kilometres and ends with a severe staircase climb.'],
      ['Motives revealed', 'Kurapika and Leorio explain the goals beneath their applications.'],
      ['Gon meets Killua', 'The two youngest candidates recognize one another’s unusual stamina.'],
      ['Swindlers Swamp', 'Man-faced Apes and other predators imitate, lure, and attack applicants.'],
      ['Hisoka’s examination', 'Hisoka treats separated applicants as targets and tests those who interest him.'],
    ],
    source: wiki('287th_Hunter_Exam#First_Phase'),
  },
  {
    id: 'phase-two', number: '02', title: 'Gourmet Hunters', examiner: 'Buhara · Menchi · Netero intervention', entered: 148, passed: 42, removed: 106,
    duration: 'Three linked food tests', location: 'Visca Forest Preserve → Split Mountain',
    rules: ['Acquire and prepare the requested food.', 'Satisfy the relevant Gourmet Hunter.', 'Complete the replacement test after Netero invalidates the all-fail result.'],
    events: [
      ['Great Stamp roast', 'Buhara asks for whole roast pig; seventy candidates clear his portion.'],
      ['Sushi test', 'Menchi gives little guidance and fails every remaining candidate.'],
      ['Examiner accountability', 'Netero intervenes because Menchi’s judgment no longer produces a fair examination.'],
      ['Spider Eagle eggs', 'Candidates leap into Split Mountain and time the updraft to retrieve eggs.'],
      ['Forty-two passes', 'The replacement test establishes the field that boards the airship.'],
    ],
    source: wiki('287th_Hunter_Exam#Second_Phase'),
  },
  {
    id: 'phase-three', number: '03', title: 'Trick Tower', examiner: 'Lippo · Togari · unnamed examiner', entered: 40, passed: 24, removed: 16,
    duration: '72 hours', location: 'Trick Tower',
    rules: ['Reach the bottom before the deadline.', 'Routes and traps may require cooperation.', 'Prisoners earn sentence reductions by delaying candidates.'],
    events: [
      ['One-use entrances', 'Each roof trapdoor admits one candidate, separating the group into routes.'],
      ['Majority Rules', 'Gon, Killua, Kurapika, Leorio, and Tonpa must vote through every decision.'],
      ['Prisoner arena', 'Five contests test surrender, deception, gambling, judgment, and lethal skill.'],
      ['Time as currency', 'The group loses hours through wagers and must choose between a short and long route.'],
      ['Wall-breaking solution', 'The five reject the forced choice and create a new route through the wall.'],
    ],
    source: wiki('287th_Hunter_Exam#Third_Phase'),
  },
  {
    id: 'phase-four', number: '04', title: 'Zevil Island Badge Hunt', examiner: 'Lippo briefing · Khara support · hidden observers', entered: 24, passed: 9, removed: 15,
    duration: '7 days', location: 'Zevil Island',
    rules: ['Keep your own badge for three points.', 'Take your assigned target’s badge for three points.', 'Every other badge is worth one point.', 'Finish the full week with at least six points.'],
    events: [
      ['Target draw', 'Each candidate secretly receives another surviving applicant’s badge number.'],
      ['Private strategies', 'The shared exam becomes a network of hunts, alliances, ambushes, and avoidance.'],
      ['Gon targets Hisoka', 'Gon studies Hisoka’s movements and succeeds without defeating him directly.'],
      ['Kurapika and Leorio cooperate', 'Their goals overlap without becoming identical.'],
      ['Nine finalists', 'Six rookies and three repeat applicants survive the point economy.'],
    ],
    source: wiki('287th_Hunter_Exam#Fourth_Phase'),
  },
  {
    id: 'final-phase', number: '05', title: 'Inverted Tournament', examiner: 'Isaac Netero · Beans · Masta', entered: 9, passed: 7, removed: 2,
    duration: 'Until one candidate remains without a pass', location: 'Hunter Association hotel',
    rules: ['A candidate passes after one victory.', 'The loser continues and receives another chance.', 'Victory requires the opponent to concede.', 'Killing another candidate causes automatic disqualification.'],
    events: [
      ['Netero interviews finalists', 'Interest and avoidance answers influence the deliberately uneven bracket.'],
      ['Gon refuses surrender', 'Hanzo wins physically but concedes because Gon will not accept defeat.'],
      ['Illumi reveals himself', 'Gittarackur removes his disguise and confronts Killua as his brother.'],
      ['Killua kills Bodoro', 'The killing rule is violated before Leorio and Bodoro can complete their match.'],
      ['Seven licenses', 'Killua is disqualified; the surviving non-disqualified finalists pass.'],
    ],
    source: wiki('287th_Hunter_Exam#Final_Phase'),
  },
];

export const trickTowerMatches = [
  { applicant: 'Tonpa', prisoner: 'Bendot', test: 'Combat', result: 'Tonpa immediately surrenders', effect: 'The team loses the first point but avoids a prolonged beating.' },
  { applicant: 'Gon Freecss', prisoner: 'Sedokan', test: 'Candle challenge', result: 'Gon extinguishes both candles with one breath', effect: 'Gon defeats the rigged candle setup by changing the apparent choice.' },
  { applicant: 'Kurapika', prisoner: 'Majtani', test: 'Death match and deception', result: 'Kurapika exposes the false Spider and knocks him unconscious', effect: 'The team must still resolve whether Majtani is truly unable to continue.' },
  { applicant: 'Leorio Paradinight', prisoner: 'Leroute', test: 'Gambling and psychology', result: 'Leroute wins the wager sequence', effect: 'The group loses fifty hours.' },
  { applicant: 'Killua Zoldyck', prisoner: 'Johness', test: 'Combat', result: 'Killua kills Johness immediately', effect: 'The final prisoner contest ends before Johness can delay the group.' },
];

export const phaseFourApplicants = [
  { badge: 405, name: 'Gon Freecss', target: '44 Hisoka', points: 6, result: 'Passed', status: 'Licensed', badges: '405, 44' },
  { badge: 404, name: 'Kurapika', target: '16 Tonpa', points: 6, result: 'Passed', status: 'Licensed', badges: '404, 16' },
  { badge: 403, name: 'Leorio Paradinight', target: '246 Ponzu', points: 6, result: 'Passed', status: 'Licensed', badges: '403, 246' },
  { badge: 384, name: 'Geretta', target: '405 Gon', points: 0, result: 'Died', status: 'Killed by Hisoka', badges: 'None at finish' },
  { badge: 371, name: 'Goz', target: 'Unresolved target pool', points: 0, result: 'Died', status: 'Killed on Zevil Island', badges: 'None at finish' },
  { badge: 362, name: 'Kenmi', target: 'Unresolved target pool', points: 0, result: 'Failed', status: 'Alive', badges: 'None at finish' },
  { badge: 301, name: 'Gittarackur / Illumi', target: '371 Goz', points: 6, result: 'Passed', status: 'Licensed', badges: '301, 371' },
  { badge: 294, name: 'Hanzo', target: '197 Amori', points: 6, result: 'Passed', status: 'Licensed', badges: '294 plus three others' },
  { badge: 281, name: 'Agon', target: 'Unresolved target pool', points: 0, result: 'Died', status: 'Killed by Hisoka', badges: 'None at finish' },
  { badge: 246, name: 'Ponzu', target: '103 Bourbon', points: 3, result: 'Failed', status: 'Alive', badges: '103' },
  { badge: 199, name: 'Umori', target: '362 Kenmi or 89 Shishito', points: 0, result: 'Failed', status: 'Alive', badges: 'None at finish' },
  { badge: 198, name: 'Imori', target: '99 Killua', points: 0, result: 'Failed', status: 'Alive', badges: 'None at finish' },
  { badge: 197, name: 'Amori', target: '362 Kenmi or 89 Shishito', points: 0, result: 'Failed', status: 'Alive; badge lost', badges: 'None at finish' },
  { badge: 191, name: 'Bodoro', target: '34 Ryu', points: 6, result: 'Passed', status: 'Killed in Final Phase', badges: '191, 34' },
  { badge: 118, name: 'Sommy', target: '191 Bodoro', points: 0, result: 'Failed', status: 'Alive', badges: 'None at finish' },
  { badge: 105, name: 'Kyu', target: 'Unresolved target pool', points: 0, result: 'Failed', status: 'Alive', badges: 'None at finish' },
  { badge: 103, name: 'Bourbon', target: 'Unresolved target pool', points: 0, result: 'Died', status: 'Killed by snake trap', badges: 'None at finish' },
  { badge: 99, name: 'Killua Zoldyck', target: '199 Umori', points: 6, result: 'Passed', status: 'Disqualified in Final Phase', badges: '99, 199' },
  { badge: 89, name: 'Shishito', target: 'Unresolved target pool', points: 0, result: 'Failed', status: 'Outcome not fully documented', badges: 'None at finish' },
  { badge: 80, name: 'Siper', target: '301 Gittarackur', points: 0, result: 'Died', status: 'Killed on Zevil Island', badges: 'None at finish' },
  { badge: 53, name: 'Pokkle', target: '105 Kyu', points: 6, result: 'Passed', status: 'Licensed', badges: '53, 105' },
  { badge: 44, name: 'Hisoka Morow', target: '384 Geretta', points: 6, result: 'Passed', status: 'Licensed', badges: '384, 80, 118, 281' },
  { badge: 34, name: 'Ryu', target: 'Unresolved target pool', points: 0, result: 'Failed', status: 'Outcome not fully documented', badges: 'None at finish' },
  { badge: 16, name: 'Tonpa', target: '403 Leorio', points: 0, result: 'Failed', status: 'Alive', badges: 'None at finish' },
];

export const finalInterviews = [
  { badge: 44, name: 'Hisoka', interests: 'Killua; Gon second', avoids: 'Gon first; Killua second' },
  { badge: 53, name: 'Pokkle', interests: 'Kurapika', avoids: 'Hisoka' },
  { badge: 99, name: 'Killua', interests: 'Gon', avoids: 'Pokkle' },
  { badge: 191, name: 'Bodoro', interests: 'Hisoka', avoids: 'Gon and Killua' },
  { badge: 301, name: 'Gittarackur', interests: 'Killua', avoids: 'Hisoka' },
  { badge: 405, name: 'Gon', interests: 'Hisoka', avoids: 'Killua, Leorio, Kurapika' },
  { badge: 294, name: 'Hanzo', interests: 'Hisoka', avoids: 'Hisoka' },
  { badge: 404, name: 'Kurapika', interests: 'Gon and Hisoka', avoids: 'Not recorded' },
  { badge: 403, name: 'Leorio', interests: 'Gon', avoids: 'Gon' },
];

export const finalMatches = [
  { order: 1, participants: 'Hanzo vs Gon', outcome: 'Gon passes', method: 'Hanzo concedes after Gon refuses to surrender.' },
  { order: 2, participants: 'Kurapika vs Hisoka', outcome: 'Kurapika passes', method: 'Hisoka privately concedes.' },
  { order: 3, participants: 'Hanzo vs Pokkle', outcome: 'Hanzo passes', method: 'Pokkle concedes.' },
  { order: 4, participants: 'Hisoka vs Bodoro', outcome: 'Hisoka passes', method: 'Bodoro concedes.' },
  { order: 5, participants: 'Killua vs Pokkle', outcome: 'Pokkle passes', method: 'Killua concedes.' },
  { order: 6, participants: 'Leorio vs Bodoro', outcome: 'Postponed', method: 'Bodoro is allowed time to recover.' },
  { order: 7, participants: 'Killua vs Gittarackur', outcome: 'Gittarackur passes', method: 'Illumi reveals himself and Killua concedes.' },
  { order: 8, participants: 'Leorio vs Bodoro', outcome: 'Leorio passes by default', method: 'Killua kills Bodoro before the match concludes.' },
];

export const finalOutcomes = [
  { status: 'Licensed', people: ['Gon Freecss', 'Kurapika', 'Hanzo', 'Hisoka Morow', 'Pokkle', 'Illumi Zoldyck', 'Leorio Paradinight'], count: 7 },
  { status: 'Disqualified', people: ['Killua Zoldyck'], count: 1 },
  { status: 'Killed', people: ['Bodoro'], count: 1 },
];

export const hunterExamHosts = [
  { stage: 'Preliminary', people: 'Captain · Quizzing Lady · Kiriko family', role: 'Association scouts and route gatekeepers', source: wiki('287th_Hunter_Exam#Pre-Exam') },
  { stage: 'Phase One', people: 'Satotz', role: 'Official First Phase examiner', source: wiki('Satotz') },
  { stage: 'Phase Two', people: 'Buhara · Menchi · Isaac Netero', role: 'Gourmet Hunter examiners; Chairman intervention', source: wiki('287th_Hunter_Exam#Second_Phase') },
  { stage: 'Phase Three', people: 'Lippo · Togari · unnamed third examiner', role: 'Tower control, special confrontation, and route oversight', source: wiki('287th_Hunter_Exam#Third_Phase') },
  { stage: 'Phase Four', people: 'Lippo · Khara · hidden observers', role: 'Rules briefing, transport support, and covert monitoring', source: wiki('287th_Hunter_Exam#Fourth_Phase') },
  { stage: 'Final Phase', people: 'Isaac Netero · Beans · Masta', role: 'Bracket design, administration, and match support', source: wiki('287th_Hunter_Exam#Final_Phase') },
];

export const hunterExamRules = [
  ['Failed', 'Did not satisfy a phase requirement or did not accumulate the required score.'],
  ['Eliminated', 'Editorial umbrella term for removal from progression; not itself a formal in-universe ruling.'],
  ['Died', 'Killed by another candidate, a prisoner, wildlife, or the environment.'],
  ['Disqualified', 'Formally removed for violating an exam rule. Killua is the explicit 287th Exam case.'],
  ['Passed', 'Completed the announced phase or received a Hunter License after the Final Phase.'],
  ['Unknown', 'The source does not establish the exact method or final condition.'],
];

export const hunterExamJourneys = [
  ['Gon Freecss', 'Instinct → endurance → strategy → humiliation → refusal to surrender'],
  ['Killua Zoldyck', 'Amusement → friendship → overwhelming ability → family conditioning → disqualification'],
  ['Kurapika', 'Discipline → partnership → judgment → Scarlet Eyes pressure → license'],
  ['Leorio Paradinight', 'Pride → medical motive → teamwork → gambling failure → loyalty'],
  ['Hisoka Morow', 'Threat → unofficial predator → object of Gon’s growth → successful applicant'],
  ['Hanzo', 'Professional preparation → overwhelming skill → inability to break Gon’s will'],
  ['Illumi Zoldyck', 'Hidden identity → surveillance → control over Killua → license'],
  ['Pokkle', 'Experienced applicant → cautious survivor → unexpected pass'],
  ['Bodoro', 'Veteran finalist → delayed match → killed before completion'],
];

export const hunterExamObjects = [
  ['Candidate badges', 'Identity, tracking, and later the core currency of the Fourth Phase.'],
  ['Tonpa’s laxative drink', 'A sabotage tool aimed at rookies before the formal tests begin.'],
  ['Great Stamp', 'The prey used in Buhara’s roast-pig test.'],
  ['Spider Eagle egg', 'The object retrieved during the valid replacement test.'],
  ['Trick Tower timer', 'Makes time a resource that can be won, lost, or deliberately consumed.'],
  ['Prison sentence reductions', 'One year removed for every hour a prisoner delays candidates.'],
  ['Target cards', 'Secretly assign hunter and hunted relationships on Zevil Island.'],
  ['Fishing rod', 'Allows Gon to take Hisoka’s badge without defeating him directly.'],
  ['Final bracket', 'An intentionally uneven system designed from Netero’s interviews.'],
  ['Hunter License', 'The institutional reward granting access, status, and exceptional privileges.'],
];

export const hunterExamAdaptation = [
  ['Arc boundary', 'The official Hunter Exam arc runs through Chapter 43 and Episode 26, while this dedicated examination page ends with Chapter 38 and Episode 21; the Zoldyck rescue has its own route.'],
  ['First Phase', 'The 2011 anime adds a tunnel race between Gon and Killua.'],
  ['Second Phase', 'The manga uses roast pig, sushi, and then the replacement egg test; the 2011 anime changes and simplifies the food sequence.'],
  ['Exam intervention', 'The 2011 anime shows Satotz contacting Netero, while the manga presents Menchi on the phone before Netero arrives.'],
  ['Manga-led record', 'Applicant totals, phase outcomes, and the participant ledger follow the manga/Hunterpedia event record.'],
];

export const hunterExamSources = [
  { label: '287th Hunter Exam', href: wiki('287th_Hunter_Exam'), note: 'Applicant table, phases, counts, badge results, and final matches.' },
  { label: 'Hunter Exam', href: wiki('Hunter_Exam'), note: 'Institutional rules, annual structure, and qualification context.' },
  { label: 'Hunter Exam arc', href: wiki('Hunter_Exam_arc'), note: 'Official manga and anime arc boundaries.' },
  { label: 'Trick Tower', href: wiki('Trick_Tower'), note: 'Third Phase setting, routes, prisoners, and time system.' },
  { label: 'Zevil Island', href: wiki('Zevil_Island'), note: 'Fourth Phase setting and badge-hunt events.' },
  { label: 'Hunter License', href: wiki('Hunter_License'), note: 'License privileges and post-exam significance.' },
];
