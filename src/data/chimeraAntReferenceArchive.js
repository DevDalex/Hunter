const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

export const chimeraAntReferenceArchive = deepFreeze({
  ending: {
    title: 'Victory closes the threat by transferring its cost into the next story.',
    deck: 'The ending is not one event. It is a causal chain that begins with the Rose, passes through poison and memory, and leaves the Hunter Association and Gon in unresolved crisis.',
    chain: [
      { index: '01', phase: 'VI', episodes: '126', label: 'Detonation', title: 'Netero activates the Poor Man’s Rose.', cause: 'Martial technique cannot guarantee Meruem’s death.', consequence: 'The blast destroys the test site and exposes the King to a persistent poison.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_126_(2011)' },
      { index: '02', phase: 'VII', episodes: '132–134', label: 'Delayed weapon', title: 'The royal core survives the blast but not its contamination.', cause: 'Pouf and Youpi restore Meruem by feeding him their bodies.', consequence: 'All three carry a terminal and transmissible poison while Pouf tries to suppress Komugi’s memory.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_134_(2011)' },
      { index: '03', phase: 'VII', episodes: '134', label: 'Recovered name', title: 'Welfin says “Komugi.”', cause: 'Meruem’s missing attachment cannot be erased by royal doctrine.', consequence: 'The King abandons punishment and conquest to find the person who now defines his remaining life.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_134_(2011)' },
      { index: '04', phase: 'VII', episodes: '135', label: 'Chosen ending', title: 'Meruem and Komugi complete their final game.', cause: 'Meruem discloses the poison and Komugi chooses to remain.', consequence: 'Their deaths close the royal relationship through consent and recognition rather than combat.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_135_(2011)' },
      { index: '05', phase: 'VII', episodes: '136', label: 'Transfer forward', title: 'The external crisis becomes two internal crises.', cause: 'Netero is dead and Gon survives in a catastrophic medical state.', consequence: 'The Chairman Election and Killua’s rescue of Gon become the next arc’s governing actions.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_136_(2011)' },
    ],
    outcomes: [
      { id: 'royal-core', subject: 'Meruem, Pouf, and Youpi', status: 'Dead', result: 'The Rose’s poison eliminates the royal core after the battlefield has already dispersed.', carriedForward: 'The Ant state project ends.' },
      { id: 'komugi', subject: 'Komugi', status: 'Dead', result: 'She remains with Meruem after understanding the danger and dies during the final Gungi game.', carriedForward: 'Her relationship with Meruem defines the arc’s emotional closure.' },
      { id: 'gon', subject: 'Gon Freecss', status: 'Critical', result: 'He kills Pitou but loses normal access to the body and future he sacrificed.', carriedForward: 'Killua must seek Alluka and Nanika.' },
      { id: 'association', subject: 'Hunter Association', status: 'Leaderless', result: 'Netero completes the mission and dies without a settled succession.', carriedForward: 'The chairman election begins.' },
      { id: 'survivors', subject: 'Surviving Chimera Ants', status: 'Dispersed', result: 'Some integrate with humans, some search for Gyro, and some retain chosen identities outside royal command.', carriedForward: 'Species identity remains plural rather than politically unified.' },
    ],
  },
  adaptation: {
    title: 'The same arc is structured by chapters and experienced through time.',
    deck: 'The manga supplies the controlling chapter record. The 2011 anime preserves the major sequence while using narration, sound, silence, and repeated temporal framing to intensify the palace invasion and final Gungi movement.',
    boundaries: {
      manga: { range: 'Chapters 186–318', count: 133, medium: 'Manga', authority: 'Primary publication sequence for chapter boundaries and panel order.' },
      anime: { range: 'Episodes 76–136', count: 61, medium: '2011 anime', authority: 'Adaptation sequence used by this page’s seven episode phases.' },
    },
    correspondence: [
      { phase: 'I', title: 'NGL Expedition', chapters: '186–213', episodes: '76–85', note: 'Field investigation, colony rules, Royal Guard emergence, and Kite’s fall.' },
      { phase: 'II', title: 'Defeat, Birth, and Return', chapters: '214–228', episodes: '86–95', note: 'Training deadline, Meruem’s birth, Queen’s death, and the return to Kite.' },
      { phase: 'III', title: 'Rogue Ants and East Gorteau', chapters: '229–242', episodes: '96–102', note: 'Colony dispersal, Meteor City, occupation, alliances, and Komugi’s arrival.' },
      { phase: 'IV', title: 'Komugi and Preparation', chapters: '243–262', episodes: '103–110', note: 'Gungi development, infiltration, palace intelligence, and final positioning.' },
      { phase: 'V', title: 'Palace Invasion', chapters: '263–290', episodes: '111–121', note: 'Synchronized entry, Komugi’s injury, separation, and objective divergence.' },
      { phase: 'VI', title: 'The Two Endgames', chapters: '291–307', episodes: '122–131', note: 'Netero/Meruem and Gon/Pitou resolve through self-destructive force.' },
      { phase: 'VII', title: 'Poison, Memory, and Homecoming', chapters: '308–318', episodes: '132–136', note: 'Poison, recovered memory, final Gungi, survivor routes, and transition.' },
    ],
    choices: [
      { id: 'narration', label: 'Narration', manga: 'Captioning and panel sequence control simultaneity.', anime: 'Voice-over can hold the viewer inside compressed seconds while images continue moving.', implication: 'The palace invasion often feels more explicitly measured in the anime.' },
      { id: 'duration', label: 'Temporal duration', manga: 'Readers determine pace through page turns and rereading.', anime: 'Editing, silence, music, and repeated angles impose duration.', implication: 'Moments such as Komugi’s injury and the final game receive sustained emotional time.' },
      { id: 'violence', label: 'Violence and aftermath', manga: 'Panel composition can isolate impact and consequence in adjacent images.', anime: 'Motion, sound, and performance make bodily cost continuous.', implication: 'The adaptation can intensify shock without changing the causal result.' },
      { id: 'gungi', label: 'Final Gungi', manga: 'Darkness, dialogue, and sparse panels close the relationship.', anime: 'Voice performance, silence, and held darkness extend the farewell.', implication: 'Both versions end through recognition rather than spectacle.' },
    ],
    sourceHref: 'https://hunterxhunter.fandom.com/wiki/Chimera_Ant_arc',
  },
  records: {
    title: 'One arc, two ordered records, seven reading phases.',
    deck: 'The archive keeps publication boundaries separate from the page’s editorial phase system. Phase divisions are navigation tools; they do not replace official chapter or episode numbering.',
    totals: [
      { label: 'Manga chapters', value: '133', range: '186–318' },
      { label: 'Anime episodes', value: '61', range: '76–136' },
      { label: 'Editorial phases', value: '7', range: 'I–VII' },
      { label: 'Phase episode groups', value: '20', range: 'Contiguous coverage' },
    ],
    boundaryRules: [
      'Chapter and episode ranges are inclusive.',
      'The seven phases are archive navigation, not official production labels.',
      'Episode evidence links point to the 2011 adaptation unless explicitly labeled otherwise.',
      'Interpretive diagrams are labeled as schematics or motifs and are not presented as canonical maps, clocks, or board positions.',
      'The page ends at Chapter 318 and Episode 136; Election material appears only as a transition consequence.',
    ],
    directoryActions: [
      { id: 'chapters', label: 'Open Chimera Ant chapter directory', route: ['series', 'chapters'], params: { arc: 'chimera-ant' } },
      { id: 'arcs', label: 'Return to story arc directory', route: ['series'], params: {} },
      { id: 'election', label: 'Continue to Chairman Election', route: ['series', 'chairman-election'], params: {} },
    ],
  },
  sources: {
    title: 'Evidence is grouped by what it is allowed to support.',
    deck: 'Hunterpedia/Fandom pages provide accessible episode, character, location, ability, and arc references. They are secondary references, not substitutes for the manga and anime themselves.',
    groups: [
      {
        id: 'arc-boundary', label: 'Arc and adaptation boundary', purpose: 'Supports overall chapter/episode range and broad arc sequence.',
        sources: [
          { label: 'Chimera Ant arc', href: 'https://hunterxhunter.fandom.com/wiki/Chimera_Ant_arc', type: 'Arc overview' },
          { label: 'Chimera Ants', href: 'https://hunterxhunter.fandom.com/wiki/Chimera_Ants', type: 'Species and colony overview' },
        ],
      },
      {
        id: 'places', label: 'Geography and institutions', purpose: 'Supports NGL, East Gorteau, palace, and Association context.',
        sources: [
          { label: 'NGL', href: 'https://hunterxhunter.fandom.com/wiki/Neo-Green_Life', type: 'Location' },
          { label: 'Republic of East Gorteau', href: 'https://hunterxhunter.fandom.com/wiki/Republic_of_East_Gorteau', type: 'Location and state' },
          { label: 'Hunter Association', href: 'https://hunterxhunter.fandom.com/wiki/Hunter_Association', type: 'Institution' },
        ],
      },
      {
        id: 'people', label: 'Character records', purpose: 'Supports identities, affiliations, abilities, and outcomes used in portraits and dossiers.',
        sources: [
          { label: 'Gon Freecss', href: 'https://hunterxhunter.fandom.com/wiki/Gon_Freecss', type: 'Character' },
          { label: 'Killua Zoldyck', href: 'https://hunterxhunter.fandom.com/wiki/Killua_Zoldyck', type: 'Character' },
          { label: 'Meruem', href: 'https://hunterxhunter.fandom.com/wiki/Meruem', type: 'Character' },
          { label: 'Neferpitou', href: 'https://hunterxhunter.fandom.com/wiki/Neferpitou', type: 'Character' },
          { label: 'Komugi', href: 'https://hunterxhunter.fandom.com/wiki/Komugi', type: 'Character' },
          { label: 'Isaac Netero', href: 'https://hunterxhunter.fandom.com/wiki/Isaac_Netero', type: 'Character' },
        ],
      },
      {
        id: 'episode-evidence', label: 'Episode evidence', purpose: 'Supports event order inside the seven anime phases.',
        sources: [
          { label: 'Episode 85', href: 'https://hunterxhunter.fandom.com/wiki/Episode_85_(2011)', type: 'Phase I endpoint' },
          { label: 'Episode 111', href: 'https://hunterxhunter.fandom.com/wiki/Episode_111_(2011)', type: 'Palace launch' },
          { label: 'Episode 126', href: 'https://hunterxhunter.fandom.com/wiki/Episode_126_(2011)', type: 'Rose detonation' },
          { label: 'Episode 131', href: 'https://hunterxhunter.fandom.com/wiki/Episode_131_(2011)', type: 'Gon/Pitou endpoint' },
          { label: 'Episode 135', href: 'https://hunterxhunter.fandom.com/wiki/Episode_135_(2011)', type: 'Final Gungi' },
          { label: 'Episode 136', href: 'https://hunterxhunter.fandom.com/wiki/Episode_136_(2011)', type: 'Aftermath endpoint' },
        ],
      },
    ],
    boundaries: [
      { label: 'Primary canon', text: 'The manga and 2011 anime remain the controlling works for exact wording, panel composition, performance, and complete scene context.' },
      { label: 'Secondary reference', text: 'Hunterpedia/Fandom is used for accessible indexing and cross-checking, with links placed beside the record they support.' },
      { label: 'Editorial interpretation', text: 'Comparisons, causal chains, diagrams, and phase names are archive analysis and are labeled accordingly.' },
      { label: 'Image provenance', text: 'Displayed character artwork uses repository-local portrait assets whose linked source record identifies the represented subject.' },
    ],
  },
});
