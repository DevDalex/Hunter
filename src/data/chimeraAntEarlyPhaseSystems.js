const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

export const chimeraAntEarlyPhaseSystems = deepFreeze({
  'ngl-expedition': {
    title: 'The expedition route becomes a retreat line.',
    deck: 'Read Episodes 76–85 as a geographic escalation. Every movement deeper into NGL removes information, support, and room for error until Kite’s team meets a threat outside its operational scale.',
    routeStops: [
      {
        id: 'coast',
        episodes: '76–77',
        place: 'Kakin coast',
        signal: 'Specimen trail',
        title: 'The Queen’s remains turn a reunion into fieldwork.',
        summary: 'Gon and Killua reunite with Kite, identify the Chimera Ant species, and follow evidence that the surviving Queen has already begun feeding.',
        severity: 1,
        sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_76_(2011)',
      },
      {
        id: 'approach',
        episodes: '78',
        place: 'NGL approach',
        signal: 'Human prey',
        title: 'The colony crosses the line from animal threat to human predator.',
        summary: 'The Ants acquire speech, preference, cruelty, and fragments of identity through the humans consumed by the Queen.',
        severity: 2,
        sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_78_(2011)',
      },
      {
        id: 'border',
        episodes: '79',
        place: 'NGL border',
        signal: 'Isolation',
        title: 'The country strips the expedition of ordinary support.',
        summary: 'NGL’s restrictions remove modern equipment and place the field team inside a closed territory where information travels slowly and extraction is difficult.',
        severity: 3,
        sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_79_(2011)',
      },
      {
        id: 'interior',
        episodes: '80–82',
        place: 'NGL interior',
        signal: 'Organized colony',
        title: 'The Ants become a ranked society rather than a nest of animals.',
        summary: 'Squadron leaders, officers, soldiers, inherited memories, Gyro’s state, and repeated human casualties reveal a threat that is learning socially as well as biologically.',
        severity: 4,
        sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_82_(2011)',
      },
      {
        id: 'perimeter',
        episodes: '83–84',
        place: 'Nest perimeter',
        signal: 'Royal Guard',
        title: 'Nen enters the colony at a level the expedition cannot contain.',
        summary: 'Neferpitou’s birth changes the scale of the mission. The team is no longer assessing a developing species; it is approaching a command structure protected by overwhelming aura.',
        severity: 5,
        sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_84_(2011)',
      },
      {
        id: 'extraction',
        episodes: '85',
        place: 'Extraction line',
        signal: 'Catastrophic retreat',
        title: 'Kite buys the only outcome still available: escape.',
        summary: 'Pitou attacks, Kite stays behind, Killua incapacitates Gon, and the first expedition ends without achieving containment, rescue, or reliable intelligence about the enemy’s ceiling.',
        severity: 6,
        sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_85_(2011)',
      },
    ],
    threatLevels: [
      { level: '01', episodes: '76', label: 'Unknown organism', evidence: 'A severed body and a reproduction pattern begin the investigation.' },
      { level: '02', episodes: '77–78', label: 'Human predation', evidence: 'Human traits and memories appear in the Queen’s offspring.' },
      { level: '03', episodes: '79–82', label: 'Organized hierarchy', evidence: 'Squadrons operate with ranks, ambitions, and independent cruelty.' },
      { level: '04', episodes: '83–84', label: 'Nen command structure', evidence: 'The Royal Guards emerge with aura beyond the field team’s expectations.' },
      { level: '05', episodes: '85', label: 'Expedition failure', evidence: 'Kite is lost and the surviving boys are forced out of NGL.' },
    ],
    portraits: [
      { name: 'Kite', role: 'Field leader', image: '/media/portraits/kite.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Kite' },
      { name: 'Gon Freecss', role: 'Hunter apprentice', image: '/media/portraits/gon-freecss.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Gon_Freecss' },
      { name: 'Killua Zoldyck', role: 'Tactical judgment', image: '/media/portraits/killua-zoldyck.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Killua_Zoldyck' },
      { name: 'Neferpitou', role: 'Threat ceiling', image: '/media/portraits/neferpitou.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Neferpitou' },
    ],
    conclusion: 'The visual direction must show compression: the route narrows, the threat rises, and the available choices collapse from investigate to survive.',
  },
  'defeat-birth-return': {
    title: 'Three fronts move at the same time.',
    deck: 'Episodes 86–95 are not one training block. Personal readiness, colony succession, and institutional response advance in parallel until all three lines converge on a new East Gorteau operation.',
    periods: [
      { id: 'deadline', episodes: '86–90', label: 'Deadline', title: 'Training and attrition' },
      { id: 'birth', episodes: '91–92', label: 'Rupture', title: 'The King is born' },
      { id: 'return', episodes: '93–95', label: 'Re-entry', title: 'The mission becomes personal' },
    ],
    fronts: [
      {
        id: 'boys',
        label: 'Front A',
        title: 'Gon and Killua',
        summary: 'Potential is tested against operational readiness and emotional control.',
        portraits: [
          { name: 'Gon Freecss', image: '/media/portraits/gon-freecss.webp' },
          { name: 'Killua Zoldyck', image: '/media/portraits/killua-zoldyck.webp' },
          { name: 'Biscuit Krueger', image: '/media/portraits/biscuit-krueger.webp' },
        ],
        events: [
          { period: 'deadline', title: 'Earn the right to return', summary: 'Biscuit compresses the boys’ training while Knuckle and Shoot turn participation in the mission into a measurable test.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_86_(2011)' },
          { period: 'birth', title: 'They fail as the enemy escalates', summary: 'The deadline closes without victory over Knuckle and Shoot at the same moment the colony produces the King.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_91_(2011)' },
          { period: 'return', title: 'Fear breaks; grief takes control', summary: 'Killua removes Illumi’s needle, Gon regains his path into the operation, and seeing Kite’s condition converts recovery into a personal promise.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_95_(2011)' },
        ],
        outcome: 'They re-enter stronger, but emotionally less stable.',
      },
      {
        id: 'colony',
        label: 'Front B',
        title: 'The Chimera Ant colony',
        summary: 'The Queen completes her purpose and the centralized nest immediately begins to fracture.',
        portraits: [
          { name: 'Meruem', image: '/media/portraits/meruem.webp' },
          { name: 'Neferpitou', image: '/media/portraits/neferpitou.webp' },
        ],
        events: [
          { period: 'deadline', title: 'Protection gathers around the unborn King', summary: 'The Royal Guards establish a command tier while the Queen forces the colony toward the birth that defines its biological purpose.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_90_(2011)' },
          { period: 'birth', title: 'Birth destroys the system that produced it', summary: 'Meruem tears free prematurely, the Queen is mortally injured, and her death removes the authority holding the colony together.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_92_(2011)' },
          { period: 'return', title: 'One hive becomes many threats', summary: 'Some Ants disperse, some cooperate with humans, and the Royal Guards follow Meruem toward a state-scale project in East Gorteau.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_93_(2011)' },
        ],
        outcome: 'The enemy becomes stronger and less centralized at once.',
      },
      {
        id: 'association',
        label: 'Front C',
        title: 'Hunter Association response',
        summary: 'Exploration is replaced by a selective extermination campaign built around Netero’s team.',
        portraits: [
          { name: 'Isaac Netero', image: '/media/portraits/isaac-netero.webp' },
          { name: 'Kite', image: '/media/portraits/kite.webp' },
        ],
        events: [
          { period: 'deadline', title: 'Thin the colony and build a professional team', summary: 'Netero, Morel, and Knov reduce the outer squadrons while the boys are kept outside the operation until they can prove readiness.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_88_(2011)' },
          { period: 'birth', title: 'The mission acquires a King-level target', summary: 'Colt asks the Hunters to save the Queen, and the extermination team learns that the central threat has already left the nest.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_92_(2011)' },
          { period: 'return', title: 'The operation pivots toward East Gorteau', summary: 'The surviving intelligence, Kite’s condition, and the King’s movement create a new mission focused on infiltration, separation, and assassination.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_95_(2011)' },
        ],
        outcome: 'The response changes from field assessment to targeted war.',
      },
    ],
    convergence: [
      { label: 'Personal condition', value: 'Gon and Killua return with stronger skills and unresolved damage.' },
      { label: 'Enemy condition', value: 'Meruem leaves a dead Queen and a dispersed colony behind him.' },
      { label: 'Operational condition', value: 'The Association follows the King toward East Gorteau with a smaller, specialized team.' },
    ],
    conclusion: 'The phase closes when the three fronts become one operation: rescue Kite, stop the Selection, and isolate the King.',
  },
});

export const chimeraAntEarlyPhaseSystemById = new Map(Object.entries(chimeraAntEarlyPhaseSystems));
