const freezeGroups = (groups) => Object.freeze(groups.map((group) => Object.freeze(group)));

export const chimeraAntPhaseScaffold = Object.freeze([
  Object.freeze({
    id: 'ngl-expedition',
    deck: 'An expedition framed as biological fieldwork becomes the first proof that the colony is evolving faster than the Hunters can assess it.',
    location: 'Kakin coast and NGL',
    participants: 'Gon · Killua · Kite · Neferpitou',
    media: Object.freeze({
      image: '/media/portraits/kite.webp',
      position: 'center 16%',
      alt: 'Kite during the Chimera Ant investigation that leads Gon and Killua into NGL',
      caption: 'Kite leads the first field investigation. By Episode 85, the route he opened toward the nest has become the escape line he protects alone.',
      creditLabel: 'Kite · Hunterpedia',
      sourceHref: 'https://hunterxhunter.fandom.com/wiki/Kite',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([76, 78]), signal: 'Discovery', title: 'The biological trail', summary: 'Gon and Killua reunite with Kite, investigate the Queen’s remains, and learn how phagogenesis transfers traits into new offspring.' },
      { range: Object.freeze([79, 82]), signal: 'Entry', title: 'Inside NGL', summary: 'The field team enters an isolated state while the Ant hierarchy, human predation, and inherited personality become visible.' },
      { range: Object.freeze([83, 85]), signal: 'Catastrophe', title: 'The threat surpasses the expedition', summary: 'The Royal Guards emerge, Pitou attacks, and Kite stays behind so Gon and Killua can escape.' },
    ]),
  }),
  Object.freeze({
    id: 'defeat-birth-return',
    deck: 'Three fronts advance together: Gon and Killua train under a deadline, the King is born, and the Hunter Association rebuilds the failed mission.',
    location: 'NGL perimeter and Hunter staging areas',
    participants: 'Gon · Killua · Biscuit · Knuckle · Shoot · Meruem · Colt',
    media: Object.freeze({
      image: '/media/portraits/meruem.webp',
      position: 'center 14%',
      alt: 'Meruem, whose birth fractures the Chimera Ant colony while the Hunters rebuild their operation',
      caption: 'Meruem’s birth is the central rupture of Episodes 86–95: the Queen’s purpose is completed, the colony loses its center, and every human plan must be rewritten.',
      creditLabel: 'Meruem · Hunterpedia',
      sourceHref: 'https://hunterxhunter.fandom.com/wiki/Meruem',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([86, 90]), signal: 'Training', title: 'Readiness under a deadline', summary: 'Biscuit, Knuckle, and Shoot force the boys to confront the gap between raw potential and operational readiness.' },
      { range: Object.freeze([91, 92]), signal: 'Birth', title: 'The King and the broken colony', summary: 'Meruem is born, the Queen dies, and the centralized colony fractures into new loyalties and independent threats.' },
      { range: Object.freeze([93, 95]), signal: 'Return', title: 'Resolve becomes personal', summary: 'Killua breaks Illumi’s conditioning, Gon sees Kite’s condition, and the return operation becomes inseparable from grief.' },
    ]),
  }),
  Object.freeze({
    id: 'rogue-ants-east-gorteau',
    deck: 'The crisis leaves the nest. Ant factions spread outward while Meruem converts East Gorteau into the machinery for mass Selection.',
    location: 'Meteor City and East Gorteau',
    participants: 'Phantom Troupe · Meruem · Royal Guards · Ikalgo · Meleoron · Komugi',
    media: Object.freeze({
      image: '/media/portraits/meruem.webp',
      position: 'center 14%',
      alt: 'Meruem during the occupation of East Gorteau as the former colony disperses into separate threats',
      caption: 'Phase III widens the field: the Queen’s former colony disperses, Meruem captures a state, defectors cross species lines, and Komugi enters the palace.',
      creditLabel: 'Meruem · Hunterpedia',
      sourceHref: 'https://hunterxhunter.fandom.com/wiki/Meruem',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([96, 97]), signal: 'Dispersal', title: 'Meteor City interlude', summary: 'The Phantom Troupe destroys Zazan’s independent colony and demonstrates how far the Queen’s offspring have spread.' },
      { range: Object.freeze([98, 100]), signal: 'Occupation', title: 'East Gorteau and the Selection', summary: 'Meruem’s regime weaponizes the state while the Hunters enter the country and divide their operations.' },
      { range: Object.freeze([101, 102]), signal: 'Complication', title: 'Alliances and Komugi', summary: 'Human-aligned Ants emerge, and Komugi enters the palace as the opponent who can challenge Meruem without force.' },
    ]),
  }),
  Object.freeze({
    id: 'komugi-invasion-preparation',
    deck: 'Two preparations run in parallel: the Hunters construct an assault plan while Komugi quietly dismantles Meruem’s assumptions about strength and worth.',
    location: 'East Gorteau Royal Palace',
    participants: 'Meruem · Komugi · Knov · Morel · Palm · invasion team',
    media: Object.freeze({
      image: '/media/portraits/komugi.webp',
      position: 'center 12%',
      alt: 'Komugi, whose Gungi matches alter Meruem while the Hunter team prepares the palace invasion',
      caption: 'Komugi is the variable missing from the extermination plan. Her games with Meruem change the target before the Hunters enter the palace.',
      creditLabel: 'Komugi · Hunterpedia',
      sourceHref: 'https://hunterxhunter.fandom.com/wiki/Komugi',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([103, 105]), signal: 'Gungi', title: 'An opponent Meruem cannot dominate', summary: 'Repeated defeats force Meruem to reconsider mastery, hierarchy, vulnerability, and the value of an individual life.' },
      { range: Object.freeze([106, 108]), signal: 'Infiltration', title: 'The plan begins to decay', summary: 'Knov penetrates the palace, confronts the Royal Guards’ aura, and suffers the psychological cost of understanding the enemy.' },
      { range: Object.freeze([109, 110]), signal: 'Positioning', title: 'Final assignments', summary: 'Targets, portals, routes, and contingencies are set only moments before the invasion begins.' },
    ]),
  }),
  Object.freeze({
    id: 'palace-invasion',
    deck: 'A synchronized assault collapses into simultaneous personal emergencies. The operation must be read as parallel lanes under severe time compression.',
    location: 'Royal Palace and underground levels',
    participants: 'Extermination team · Royal Guards · Meruem · Komugi',
    media: Object.freeze({
      position: '62% center',
      caption: 'Phase image hook: the final system will use a palace plan, entry vectors, and a visible invasion clock rather than a single linear timeline.',
      creditLabel: 'Configured Chimera Ant arc artwork',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([111, 113]), signal: '00:00', title: 'Entry and disruption', summary: 'Dragon Dive, Komugi’s injury, and Meruem’s decision to protect her break the expected target structure immediately.' },
      { range: Object.freeze([114, 117]), signal: 'Separation', title: 'The team divides', summary: 'Each participant is pulled into a distinct front while Netero removes Meruem from the palace.' },
      { range: Object.freeze([118, 121]), signal: 'Divergence', title: 'Objectives change', summary: 'Loyalty, compassion, survival, and revenge override assigned roles as Youpi and the Hunters revise their priorities.' },
    ]),
  }),
  Object.freeze({
    id: 'two-endgames',
    deck: 'The arc resolves through two confrontations that differ in purpose but mirror one another in the price demanded for victory.',
    location: 'Weapons test site and Peijin route',
    participants: 'Netero · Meruem · Gon · Pitou · Killua',
    media: Object.freeze({
      position: '54% center',
      caption: 'Phase image hook: split the visual field between institutional violence and personal revenge without claiming the conflicts are identical.',
      creditLabel: 'Configured Chimera Ant arc artwork',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([122, 126]), signal: 'Endgame A', title: 'Netero versus Meruem', summary: 'The duel moves from technique and ideology to the hidden condition of the Poor Man’s Rose.' },
      { range: Object.freeze([127, 131]), signal: 'Endgame B', title: 'Gon versus Pitou', summary: 'The truth about Kite drives Gon into a Nen vow that purchases revenge by destroying his own future.' },
    ]),
  }),
  Object.freeze({
    id: 'poison-memory-homecoming',
    deck: 'The battle is over before the emotional resolution arrives. Poison, recovered memory, and chosen companionship decide the final movement.',
    location: 'East Gorteau and survivor routes',
    participants: 'Meruem · Komugi · Pouf · Youpi · Welfin · surviving Ants',
    media: Object.freeze({
      position: '70% center',
      caption: 'Phase image hook: reduce spectacle, leave more negative space, and let Gungi notation and survivor destinations carry the ending.',
      creditLabel: 'Configured Chimera Ant arc artwork',
    }),
    episodeGroups: freezeGroups([
      { range: Object.freeze([132, 134]), signal: 'Poison', title: 'The delayed consequence', summary: 'The Rose’s contamination advances while Meruem searches for the memory his Guards concealed from him.' },
      { range: Object.freeze([135, 135]), signal: 'Gungi', title: 'The final game', summary: 'Meruem chooses to spend his remaining life with Komugi rather than pursue conquest or proof of supremacy.' },
      { range: Object.freeze([136, 136]), signal: 'Aftermath', title: 'Homecoming and transition', summary: 'Survivors choose new lives, Gon remains critically injured, and the story turns toward the Election arc.' },
    ]),
  }),
]);

export const chimeraAntPhaseScaffoldById = new Map(chimeraAntPhaseScaffold.map((phase) => [phase.id, phase]));
