const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

export const chimeraAntPalaceInvasionSystem = deepFreeze({
  title: 'The plan survives for seconds; the operation survives by changing.',
  deck: 'Episodes 111–121 unfold as one compressed field of simultaneous decisions. Read the palace as a schematic, the invasion as a relative clock, and every combat lane as an objective that changes once Komugi is injured.',
  palace: {
    note: 'Operational schematic, not a literal architectural reconstruction.',
    zones: [
      { id: 'airspace', x: 50, y: 8, label: 'Airspace', title: 'Dragon Dive and aerial entry', state: 'The assault announces itself before the ground team reaches its targets.' },
      { id: 'royal-chamber', x: 50, y: 29, label: 'Royal chamber', title: 'Meruem and Komugi', state: 'The protected civilian changes the King’s immediate priority.' },
      { id: 'central-stair', x: 50, y: 52, label: 'Central stair', title: 'Ground-team collision point', state: 'Youpi blocks the route and forces the first major redistribution.' },
      { id: 'pouf-front', x: 18, y: 47, label: 'Upper front', title: 'Morel contains Pouf', state: 'Containment becomes a contest over information, loyalty, and escape.' },
      { id: 'pitou-front', x: 82, y: 43, label: 'Komugi treatment', title: 'Gon confronts Pitou', state: 'The extermination objective is suspended by Gon’s personal demand.' },
      { id: 'underground', x: 25, y: 78, label: 'Underground', title: 'Ikalgo searches below', state: 'Identity, disguise, and Welfin’s suspicion create a separate intelligence war.' },
      { id: 'extraction', x: 78, y: 80, label: 'Extraction vector', title: 'Netero removes Meruem', state: 'The King’s duel leaves the palace while every Guard remains behind.' },
    ],
    vectors: [
      { id: 'dragon-dive', label: 'Dragon Dive', kind: 'disruption', x1: 50, y1: 2, x2: 50, y2: 27, episodes: '111', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_111_(2011)' },
      { id: 'royal-contact', label: 'Netero / Zeno', kind: 'separation', x1: 50, y1: 11, x2: 77, y2: 78, episodes: '111–112', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_112_(2011)' },
      { id: 'portal-entry', label: 'Knov portals', kind: 'entry', x1: 5, y1: 58, x2: 47, y2: 53, episodes: '111', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_111_(2011)' },
      { id: 'guard-split', label: 'Guard separation', kind: 'objective', x1: 50, y1: 53, x2: 18, y2: 47, episodes: '112–114', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_114_(2011)' },
      { id: 'pitou-diversion', label: 'Pitou diverted', kind: 'objective', x1: 50, y1: 30, x2: 82, y2: 43, episodes: '112–113', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_113_(2011)' },
      { id: 'underground-route', label: 'Ikalgo descent', kind: 'entry', x1: 48, y1: 57, x2: 25, y2: 78, episodes: '114–118', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_118_(2011)' },
    ],
  },
  clock: [
    { mark: '00:00', label: 'Launch', episodes: '111', title: 'The synchronized assault begins.', summary: 'Dragon Dive fills the airspace while the portal team enters the palace and the planned target structure activates.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_111_(2011)' },
    { mark: 'Opening seconds', label: 'Detection', episodes: '111', title: 'Pitou reacts before the ground plan settles.', summary: 'The Royal Guard reads the aerial threat, Netero meets the response, and the palace is already operating outside the Hunters’ ideal sequence.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_111_(2011)' },
    { mark: 'Immediate rupture', label: 'Civilian casualty', episodes: '112', title: 'Komugi is injured.', summary: 'Meruem entrusts her life to Pitou. A military target becomes a person with an urgent protected priority.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_112_(2011)' },
    { mark: 'First engagements', label: 'Separation', episodes: '113–114', title: 'The operation breaks into parallel fronts.', summary: 'Youpi fixes the staircase team in place, Morel contains Pouf, Gon reaches Pitou, and Netero moves the King away from the palace.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_114_(2011)' },
    { mark: 'Sustained assault', label: 'Divergence', episodes: '115–118', title: 'Assigned roles begin losing authority.', summary: 'Compassion, fear, rescue, revenge, and incomplete information repeatedly override the original extermination logic.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_118_(2011)' },
    { mark: 'Late invasion', label: 'New terms', episodes: '119–121', title: 'Enemies and Hunters revise what victory means.', summary: 'Youpi develops respect, Pouf protects an idea of the King, and several fronts end through bargains or changed priorities rather than clean neutralization.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_121_(2011)' },
  ],
  periods: [
    { id: 'impact', mark: '00:00', episodes: '111', label: 'Impact', title: 'Entry vectors activate' },
    { id: 'rupture', mark: 'Seconds', episodes: '112–113', label: 'Rupture', title: 'Komugi changes the field' },
    { id: 'separation', mark: 'Minutes', episodes: '114–117', label: 'Separation', title: 'Seven fronts emerge' },
    { id: 'divergence', mark: 'Late phase', episodes: '118–121', label: 'Divergence', title: 'Objectives are rewritten' },
  ],
  lanes: [
    {
      id: 'gon-pitou', number: '01', title: 'Gon / Pitou', objective: 'Hold Pitou to the promise of restoring Kite.', accent: 'rose', portrait: '/media/portraits/gon-freecss.webp',
      events: [
        { period: 'impact', state: 'Advance', text: 'Gon and Killua move directly toward the Royal Guard assigned to Kite.' },
        { period: 'rupture', state: 'Suspended', text: 'Pitou cannot fight while treating Komugi; Gon converts that dependency into leverage.' },
        { period: 'separation', state: 'Hostage logic', text: 'The shared mission narrows into Gon’s demand, while Killua watches his emotional control collapse.' },
        { period: 'divergence', state: 'Personal endgame', text: 'Pitou’s duty to Komugi ends, and the confrontation leaves the palace under Gon’s terms.' },
      ],
    },
    {
      id: 'killua', number: '02', title: 'Killua', objective: 'Protect Gon while supporting fronts the plan did not assign to him.', accent: 'royal', portrait: '/media/portraits/killua-zoldyck.webp',
      events: [
        { period: 'impact', state: 'Support', text: 'Killua enters beside Gon and reads the changing field faster than the operation can communicate it.' },
        { period: 'rupture', state: 'Witness', text: 'He recognizes that Gon’s fixation on Pitou is no longer compatible with ordinary team logic.' },
        { period: 'separation', state: 'Rapid response', text: 'Godspeed allows him to intervene across fronts, protect allies, and return to Gon’s position.' },
        { period: 'divergence', state: 'Contain damage', text: 'Killua’s objective becomes saving Gon from the cost of the choice Gon is preparing to make.' },
      ],
    },
    {
      id: 'youpi-front', number: '03', title: 'Knuckle / Shoot / Youpi', objective: 'Use concealment, Hakoware, and attrition to neutralize Youpi.', accent: 'olive', portrait: '/media/portraits/killua-zoldyck.webp',
      events: [
        { period: 'impact', state: 'Blocked', text: 'Youpi occupies the staircase and prevents the ground team from reaching deeper targets.' },
        { period: 'rupture', state: 'Attrition', text: 'Shoot commits at severe personal cost while Knuckle tries to preserve the APR strategy.' },
        { period: 'separation', state: 'Emotional pressure', text: 'Rescue impulses and battlefield respect begin competing with the mathematical win condition.' },
        { period: 'divergence', state: 'Bargain', text: 'Knuckle cancels Hakoware to save Morel, and Youpi spares opponents he has learned to respect.' },
      ],
    },
    {
      id: 'pouf-front', number: '04', title: 'Morel / Pouf', objective: 'Contain Pouf and stop reinforcement of the King or another Guard.', accent: 'royal', portrait: '/media/portraits/isaac-netero.webp',
      events: [
        { period: 'impact', state: 'Contain', text: 'Morel isolates Pouf inside Smoky Jail as the palace fronts split.' },
        { period: 'rupture', state: 'Information war', text: 'Pouf tests the prison while prioritizing knowledge of Meruem and Komugi over a direct duel.' },
        { period: 'separation', state: 'Escape', text: 'Pouf divides himself, leaves a shell behind, and starts acting around the Hunters’ containment plan.' },
        { period: 'divergence', state: 'Identity defense', text: 'His goal becomes preserving the King’s former values and concealing Komugi from him.' },
      ],
    },
    {
      id: 'underground-front', number: '05', title: 'Ikalgo / Welfin', objective: 'Search the underground levels, locate Palm, and protect the infiltration network.', accent: 'moss', portrait: '/media/portraits/neferpitou.webp',
      events: [
        { period: 'impact', state: 'Descend', text: 'Ikalgo enters through the lower route while the main assault draws attention upward.' },
        { period: 'rupture', state: 'Disguise', text: 'Operating in another Ant’s body turns every encounter into a test of memory and behavior.' },
        { period: 'separation', state: 'Suspicion', text: 'Welfin recognizes inconsistencies and transforms the underground search into a psychological standoff.' },
        { period: 'divergence', state: 'Alliance potential', text: 'Fear of the King, loyalty to Gyro, and personal memory weaken automatic Ant solidarity.' },
      ],
    },
    {
      id: 'king-front', number: '06', title: 'Netero / Meruem', objective: 'Separate the King and move the decisive battle away from the gathered population.', accent: 'rose', portrait: '/media/portraits/isaac-netero.webp',
      events: [
        { period: 'impact', state: 'Contact', text: 'Netero and Zeno reach the King through the aerial assault.' },
        { period: 'rupture', state: 'Negotiated movement', text: 'Meruem cooperates long enough to secure Komugi’s treatment and leave the palace.' },
        { period: 'separation', state: 'Extraction complete', text: 'The King and Chairman move beyond the palace, removing the central target from every Guard.' },
        { period: 'divergence', state: 'Ideological duel', text: 'The operation’s institutional objective becomes a confrontation over names, power, and humanity.' },
      ],
    },
    {
      id: 'komugi', number: '07', title: 'Komugi', objective: 'Survive an operation in which no attacker planned for her existence.', accent: 'bone', portrait: '/media/portraits/komugi.webp',
      events: [
        { period: 'impact', state: 'Unmodeled', text: 'Komugi is inside the strike zone but absent from the Hunters’ target map.' },
        { period: 'rupture', state: 'Critical', text: 'Dragon Dive wounds her and forces Meruem to reveal what he values.' },
        { period: 'separation', state: 'Protected', text: 'Pitou’s treatment immobilizes one Royal Guard and shapes Gon’s confrontation.' },
        { period: 'divergence', state: 'Central variable', text: 'Pouf’s fear, Meruem’s attachment, and Pitou’s duty all revolve around her survival.' },
      ],
    },
  ],
  disruptions: [
    { id: 'king', target: 'Separate Meruem', plan: 'Netero and Zeno isolate the King immediately.', actual: 'Meruem first secures Komugi’s treatment, then leaves voluntarily.', consequence: 'The extraction succeeds, but for motives the Hunters did not model.' },
    { id: 'pitou', target: 'Occupy Pitou', plan: 'Gon and Killua prevent Pitou from reinforcing Meruem.', actual: 'Pitou is already committed to healing Komugi.', consequence: 'Gon gains leverage while the mission becomes hostage negotiation.' },
    { id: 'youpi', target: 'Bankrupt Youpi', plan: 'APR turns time and aura expenditure into a delayed neutralization.', actual: 'Shoot’s injuries, Morel’s danger, and Knuckle’s compassion break the calculation.', consequence: 'The technical win condition is sacrificed to save an ally.' },
    { id: 'pouf', target: 'Contain Pouf', plan: 'Smoky Jail prevents movement and reinforcement.', actual: 'Pouf escapes by division and leaves a shell behind.', consequence: 'Containment fails because the enemy’s real objective is informational and ideological.' },
    { id: 'palace', target: 'Maintain synchronized fronts', plan: 'Assignments remain stable long enough for simultaneous isolation.', actual: 'Every lane receives new information at a different speed.', consequence: 'The operation survives through local judgment rather than central control.' },
  ],
  visualRecords: [
    { name: 'Isaac Netero', role: 'Aerial spearhead', image: '/media/portraits/isaac-netero.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Isaac_Netero' },
    { name: 'Meruem', role: 'Separated target', image: '/media/portraits/meruem.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Meruem' },
    { name: 'Gon Freecss', role: 'Personal front', image: '/media/portraits/gon-freecss.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Gon_Freecss' },
    { name: 'Neferpitou', role: 'Diverted Guard', image: '/media/portraits/neferpitou.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Neferpitou' },
    { name: 'Komugi', role: 'Unmodeled center', image: '/media/portraits/komugi.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Komugi' },
  ],
  conclusion: 'Phase V is not one battle and not one timeline. It is a controlled plan decomposing into seven local moral systems while a relative clock keeps every decision simultaneous.',
});
