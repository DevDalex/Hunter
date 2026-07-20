const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const source = (label, slug) => ({ label, href: wiki(slug) });

export const referenceBackbonePrototype = {
  batch: 'Batch 8',
  title: 'Reference backbone',
  thesis: 'Nen, World, Organizations, and Fights become linked reference systems instead of loose archive destinations. Chimera Ant is used as the stress test because it exposes vows, post-mortem Nen, Ant biology, NGL, East Gorteau, the Hunter Association operation, and several nonstandard conflicts at once.',
  domains: {
    nen: {
      id: 'nen',
      eyebrow: 'Technical manual',
      title: 'Nen becomes a rules-first field guide',
      accent: '#C29C57',
      deck: 'This section now frames Nen as an operational system: foundations, advanced applications, categories, vows, restrictions, post-mortem persistence, curses, beasts, transfer systems, and named abilities.',
      metrics: [['Core principles', '4'], ['Advanced applications', '7+'], ['Categories', '6'], ['Chimera examples', '12']],
      lanes: [
        ['Foundations', 'Aura, aura nodes, Ten, Zetsu, Ren, Hatsu, Water Divination, initiation, and category literacy.'],
        ['Operations', 'Gyo, In, En, Shu, Ko, Ken, Ryu, range, duration, output, concealment, and distribution.'],
        ['Contracts', 'Conditions, vows, limitations, risk, cost, post-mortem Nen, curses, and exorcism.'],
        ['Ability records', 'User, category, activation, condition, cost, counter, victims, chapter scope, source, and uncertainty boundary.'],
      ],
      records: [
        { name: 'Gon’s final vow', type: 'Vow / self-destruction', arc: 'Chimera Ant', focus: 'Sacrifice, impossible output, body collapse, and later Election arc consequence.' },
        { name: 'Pitou’s Terpsichora', type: 'Post-mortem Nen', arc: 'Chimera Ant', focus: 'Living activation versus death-driven continuation must remain separate.' },
        { name: 'Netero’s Guanyin', type: 'Prayer-led combat system', arc: 'Chimera Ant', focus: 'Speed, rhythm, angle selection, Zero Hand, and Rose fallback are different layers.' },
        { name: 'Knuckle’s Hakoware', type: 'Aura-debt ledger', arc: 'Chimera Ant', focus: 'Damage is not the main variable; debt, interest, range, and bankruptcy are.' },
        { name: 'Meleoron’s Perfect Plan', type: 'Specialist concealment', arc: 'Chimera Ant', focus: 'Breath, contact, partner timing, and invisibility window are the actual constraints.' },
        { name: 'Guardian Spirit Beasts', type: 'Parasitic Nen', arc: 'Succession Contest', focus: 'Host, autonomy, visibility, aura fuel, ritual limits, and personal-beast differences.' },
      ],
      chimeraBridge: ['Gon vow', 'Pitou post-mortem Nen', 'Pouf body split and scales', 'Youpi transformation', 'Netero Zero Hand', 'Knov portals', 'Morel smoke constructs'],
      nextActions: ['Add ability anatomy fields to every named ability.', 'Mark confirmed mechanics versus interpretation.', 'Cross-link ability records to conflicts and character profiles.'],
      sources: [source('Nen', 'Nen'), source('Vows and Limitations', 'Vows_and_Limitations'), source('Post-mortem Nen', 'Nen#Post-mortem_Nen'), source('Gon Freecss', 'Gon_Freecss'), source('Neferpitou', 'Neferpitou'), source('Isaac Netero', 'Isaac_Netero'), source('Hakoware', 'Hakoware')],
    },
    world: {
      id: 'world',
      eyebrow: 'Cartographic archive',
      title: 'World becomes a route-aware atlas',
      accent: '#557286',
      deck: 'The atlas is no longer just a list of places. It distinguishes geography, route order, political control, access rules, arc function, connected conflicts, and current status.',
      metrics: [['Map layers', '5'], ['Route lenses', 'Story + voyage'], ['Chimera places', '8+'], ['Control fields', 'Required']],
      lanes: [
        ['Geography', 'Known World, countries, cities, islands, restricted zones, buildings, ships, and exterior voyage scale.'],
        ['Story route', 'What place matters when: Whale Island, Yorknew, Greed Island, NGL, East Gorteau, Black Whale, and beyond.'],
        ['Control and access', 'Who controls the place, who can enter, what rule blocks access, and how that changes.'],
        ['Connected evidence', 'Each place links to characters, conflicts, factions, objects, chapters, images, and Hunterpedia source records.'],
      ],
      records: [
        { name: 'NGL', type: 'Restricted state / outbreak zone', arc: 'Chimera Ant', focus: 'Anti-technology boundary, hidden criminal layer, Ant nest proximity, and Hunter investigation failure.' },
        { name: 'East Gorteau', type: 'Captured state', arc: 'Chimera Ant', focus: 'Palace control, mass-selection plan, civilian danger, and postwar political aftermath.' },
        { name: 'Royal Palace', type: 'Operation site', arc: 'Chimera Ant', focus: 'Dragon Dive entry, Guard separation, Komugi injury, stair split, and invasion lanes.' },
        { name: 'Meteor City', type: 'External pressure site', arc: 'Chimera Ant / Yorknew', focus: 'Phantom Troupe defense against Zazan shows Ant spread beyond the main mission.' },
        { name: 'Black Whale', type: 'Mobile city / locked voyage space', arc: 'Succession Contest', focus: 'Tier, room, legal, military, mafia, ritual, and population systems must stay spatial.' },
      ],
      chimeraBridge: ['Balsa Islands clue', 'NGL entry', 'Ant nest', 'East Gorteau palace', 'Peijin', 'Rose detonation site', 'Meteor City'],
      nextActions: ['Give every major place parent region, arc range, controlling faction, and current state.', 'Keep map positions approximate when source data is not exact.', 'Cross-link atlas records to fights and organizations.'],
      sources: [source('World', 'World'), source('NGL', 'NGL'), source('East Gorteau', 'East_Gorteau'), source('Royal Palace of East Gorteau', 'Royal_Palace_of_East_Gorteau'), source('Meteor City', 'Meteor_City'), source('Black Whale', 'Black_Whale')],
    },
    organizations: {
      id: 'organizations',
      eyebrow: 'Institutional archive',
      title: 'Organizations become intelligence dossiers',
      accent: '#705978',
      deck: 'Factions are recorded by leadership, ranks, members, territory, objectives, resources, alliances, enemies, operations, losses, and story-state changes.',
      metrics: [['Dossier fields', '10+'], ['Operation links', 'Required'], ['Hierarchy model', 'Required'], ['Source policy', 'Hunterpedia only']],
      lanes: [
        ['Leadership', 'Name the leaders, deputies, command nodes, and temporary field authorities.'],
        ['Membership', 'Separate confirmed members, associates, contractors, controlled bodies, and unknown-status people.'],
        ['Territory', 'Connect every organization to bases, rooms, cities, routes, and contested zones.'],
        ['Operations', 'Record plans, searches, assassinations, exams, invasions, rituals, and mafia conflicts as operations.'],
      ],
      records: [
        { name: 'Hunter Association', type: 'Institution', arc: 'All / Chimera Ant', focus: 'Mission authority, Netero’s leadership, extermination team, and Chairman Election consequence.' },
        { name: 'Chimera Ant colony', type: 'Biological hierarchy', arc: 'Chimera Ant', focus: 'Queen, soldiers, officers, Squadron Leaders, Royal Guards, King, defectors, and post-Queen diaspora.' },
        { name: 'Extermination Team', type: 'Operation cell', arc: 'Chimera Ant', focus: 'Netero, Morel, Knov, Knuckle, Shoot, Palm, Meleoron, Ikalgo, Gon, and Killua as mission lanes.' },
        { name: 'NGL', type: 'State / cover system', arc: 'Chimera Ant', focus: 'Isolationist ideology, restricted access, concealed criminal infrastructure, and collapse.' },
        { name: 'Kakin Mafia Community', type: 'Underworld balance', arc: 'Succession Contest', focus: 'Xi-Yu, Cha-R, Heil-Ly, royal sponsorship, territory, Troupe, Hisoka, and military pressure.' },
      ],
      chimeraBridge: ['Hunter Association', 'Netero command', 'Extermination Team', 'Chimera Ant colony', 'Royal Guards', 'East Gorteau regime'],
      nextActions: ['Standardize faction fields across pre-Succession and Succession records.', 'Add operation records that connect factions to conflicts.', 'Stop mixing political groups, species hierarchies, and temporary teams without type labels.'],
      sources: [source('Hunter Association', 'Hunter_Association'), source('Chimera Ants', 'Chimera_Ants'), source('Chimera Ant Extermination Team', 'Chimera_Ant_Extermination_Team'), source('NGL', 'NGL'), source('Kakin Mafia', 'Kakin_Mafia')],
    },
    conflicts: {
      id: 'conflicts',
      eyebrow: 'Tactical case files',
      title: 'Fights become conflict analysis records',
      accent: '#A12A38',
      deck: 'The conflict archive treats fights, games, assassinations, operations, hostage exchanges, negotiations, and information battles as comparable records with objective, tools, turning point, outcome, and consequence.',
      metrics: [['Conflict forms', '7'], ['Required phases', '5'], ['Chimera cases', '8+'], ['Evidence rule', 'No invented choreography']],
      lanes: [
        ['Objective', 'What each side wants before the conflict begins.'],
        ['Information state', 'What each side knows, misunderstands, hides, or discovers.'],
        ['Tools and abilities', 'Nen, weapons, terrain, hostages, laws, allies, rules, and timing.'],
        ['Turning point', 'The specific condition, reveal, mistake, or sacrifice that changes the outcome.'],
        ['Consequence', 'Status change, death, escape, political shift, next-arc setup, or unresolved state.'],
      ],
      records: [
        { name: 'Kite vs. Neferpitou', type: 'Failed rescue / first Royal Guard shock', arc: 'Chimera Ant', focus: 'The mission’s confidence collapses; Gon and Killua survive but Kite becomes the arc’s emotional wound.' },
        { name: 'Palace Invasion', type: 'Multi-lane operation', arc: 'Chimera Ant', focus: 'Dragon Dive, Komugi injury, Guard separation, invasion clock, and broken assignments.' },
        { name: 'Netero vs. Meruem', type: 'Ideological duel', arc: 'Chimera Ant', focus: 'Martial peak versus changing King; Rose proves humanity’s poisonous fallback.' },
        { name: 'Gon vs. Pitou', type: 'Vow catastrophe', arc: 'Chimera Ant', focus: 'Not a clean revenge win: Kite truth, vow, transformation, Pitou death, and Gon’s collapse.' },
        { name: 'Youpi battlefield', type: 'Group operation', arc: 'Chimera Ant', focus: 'Knuckle, Shoot, Meleoron, Morel, and Youpi’s emotional/combat evolution.' },
        { name: 'Razor dodgeball', type: 'Game conflict', arc: 'Greed Island', focus: 'Rules, teams, positioning, Hisoka, Killua support, and Gon output solve a game gate.' },
        { name: 'Kurapika vs. Uvogin', type: 'Vow duel', arc: 'Yorknew City', focus: 'Chain Jail’s restriction and Kurapika’s revenge mission become explicit tactical structure.' },
      ],
      chimeraBridge: ['Kite vs Pitou', 'Palace Invasion', 'Youpi battle', 'Morel vs Pouf', 'Netero vs Meruem', 'Gon vs Pitou', 'Meruem and Komugi final game'],
      nextActions: ['Add typed conflict forms beyond battles.', 'Connect conflicts to Nen, locations, factions, characters, and objects.', 'Represent Palace Invasion as a clock, not a flat fight list.'],
      sources: [source('Chimera Ant arc', 'Chimera_Ant_arc'), source('Palace Invasion', 'Palace_Invasion'), source('Netero vs. Meruem', 'Isaac_Netero_vs._Meruem'), source('Gon vs. Neferpitou', 'Gon_Freecss_vs._Neferpitou'), source('Razor’s dodgeball game', 'Razor%27s_Dodgeball_Game'), source('Kurapika vs. Uvogin', 'Kurapika_vs._Uvogin')],
    },
  },
};

export const referenceBackboneDomains = Object.values(referenceBackbonePrototype.domains);

export const referenceBackboneStats = {
  domains: referenceBackboneDomains.length,
  lanes: referenceBackboneDomains.reduce((total, domain) => total + domain.lanes.length, 0),
  records: referenceBackboneDomains.reduce((total, domain) => total + domain.records.length, 0),
  sources: referenceBackboneDomains.reduce((total, domain) => total + domain.sources.length, 0),
  chimeraBridgeItems: referenceBackboneDomains.reduce((total, domain) => total + domain.chimeraBridge.length, 0),
};

export const referenceBackboneSourceHosts = referenceBackboneDomains.flatMap((domain) => domain.sources.map((item) => item.href));
