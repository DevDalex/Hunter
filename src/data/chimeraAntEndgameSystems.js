const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

export const chimeraAntEndgameSystems = deepFreeze({
  'two-endgames': {
    title: 'Two victories are purchased by destroying the victor.',
    deck: 'Episodes 122–131 resolve the operation through two confrontations that should be read beside one another, not collapsed into one moral equation. Netero acts as the final instrument of an institution; Gon turns his own future into a private weapon.',
    endgames: [
      {
        id: 'netero-meruem',
        label: 'Endgame A',
        episodes: '122–126',
        title: 'Netero versus Meruem',
        subtitle: 'Institutional extermination',
        accent: 'rose',
        portraits: [
          { name: 'Isaac Netero', role: 'Human weapon', image: '/media/portraits/isaac-netero.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Isaac_Netero' },
          { name: 'Meruem', role: 'King-level target', image: '/media/portraits/meruem.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Meruem' },
        ],
        dossier: {
          objective: 'Prevent Meruem from surviving as the center of a new species and political order.',
          weapon: 'Netero’s lifetime of martial practice, the Bodhisattva, Zero Hand, and the concealed Poor Man’s Rose.',
          decision: 'When technique cannot guarantee extermination, Netero activates the weapon built into his body.',
          cost: 'Netero dies by choice; the Rose contaminates the battlefield beyond the initial blast.',
          result: 'Meruem survives the explosion temporarily, but the Rose’s poison makes his death unavoidable.',
          aftermath: 'The chairman’s death creates the institutional crisis that becomes the Election arc.',
        },
        sequence: [
          { index: '01', episodes: '122–123', label: 'Terms', title: 'Dialogue and combat remain inseparable.', summary: 'Meruem seeks his name and a political settlement while Netero remains committed to a mission whose success is defined by the King’s death.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_122_(2011)' },
          { index: '02', episodes: '124–125', label: 'Pattern', title: 'Meruem solves the rhythm of the Bodhisattva.', summary: 'The King treats Netero’s attacks as a pattern to read, narrowing the exchange until he can reach the body behind the technique.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_125_(2011)' },
          { index: '03', episodes: '126', label: 'Exhaustion', title: 'Zero Hand spends what technique has left.', summary: 'Netero releases his remaining aura in one final attack, but Meruem survives the martial endpoint.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_126_(2011)' },
          { index: '04', episodes: '126', label: 'Hidden condition', title: 'The duel ends as a weapons test.', summary: 'Netero detonates the Poor Man’s Rose. The decisive human advantage is not individual strength but a mass-produced weapon and its lingering poison.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_126_(2011)' },
        ],
      },
      {
        id: 'gon-pitou',
        label: 'Endgame B',
        episodes: '127–131',
        title: 'Gon versus Neferpitou',
        subtitle: 'Personal revenge',
        accent: 'moss',
        portraits: [
          { name: 'Gon Freecss', role: 'Self-consuming vow', image: '/media/portraits/gon-freecss.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Gon_Freecss' },
          { name: 'Neferpitou', role: 'Royal duty', image: '/media/portraits/neferpitou.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Neferpitou' },
        ],
        dossier: {
          objective: 'Force Pitou to restore Kite, then punish the Royal Guard when restoration proves impossible.',
          weapon: 'A Nen condition that exchanges Gon’s future growth and bodily integrity for power available in one moment.',
          decision: 'After learning Kite cannot be healed, Gon abandons recovery, proportion, and his own future.',
          cost: 'His body and Nen potential are catastrophically damaged; survival does not mean recovery.',
          result: 'Pitou is killed, including the postmortem attack, while Gon is left in critical condition.',
          aftermath: 'Killua’s next objective becomes saving Gon, creating the personal crisis inside the Election arc.',
        },
        sequence: [
          { index: '01', episodes: '127–129', label: 'Escort', title: 'Gon keeps Pitou under coercive terms.', summary: 'Komugi’s treatment ends and Pitou is forced toward Kite while Killua watches Gon’s demand replace the team’s wider operation.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_127_(2011)' },
          { index: '02', episodes: '130', label: 'Truth', title: 'The possibility of restoration is removed.', summary: 'Pitou states that Kite is already dead and cannot be restored. The final restraint supporting Gon’s bargain disappears.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_130_(2011)' },
          { index: '03', episodes: '131', label: 'Vow', title: 'Gon exchanges the future for the present.', summary: 'The transformation is not a normal power-up. It is the visible result of a condition severe enough to destroy the life that could have produced that strength naturally.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_131_(2011)' },
          { index: '04', episodes: '131', label: 'Afterimage', title: 'Victory leaves no usable victor.', summary: 'Pitou’s postmortem Nen attacks, Gon completes the killing, and Killua reaches a body that has survived only in the narrowest sense.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_131_(2011)' },
        ],
      },
    ],
    comparisonRows: [
      { label: 'Starting demand', left: 'Eliminate a species-level political and biological threat.', right: 'Restore Kite and force personal accountability from Pitou.' },
      { label: 'Power system', left: 'Accumulated technique backed by an institutional weapon hidden inside the combatant.', right: 'A private Nen condition that liquidates future potential for immediate force.' },
      { label: 'Decision point', left: 'Martial superiority fails to guarantee the mission.', right: 'The belief that Kite can be saved is destroyed.' },
      { label: 'Price accepted', left: 'Certain death and indiscriminate contamination around the target.', right: 'Loss of bodily integrity, future growth, and almost all possibility of an ordinary life.' },
      { label: 'Immediate result', left: 'Meruem survives the blast but receives a terminal poison.', right: 'Pitou dies and Gon remains alive in a catastrophic medical state.' },
      { label: 'Story carried forward', left: 'Netero’s death destabilizes the Hunter Association.', right: 'Gon’s condition forces Killua to seek a rescue outside normal Hunter medicine.' },
    ],
    verdict: {
      label: 'Mirror without equivalence',
      title: 'Both endgames turn self-destruction into force, but the forces are not the same.',
      text: 'Netero’s body conceals a mass-produced weapon authorized by an institution. Gon’s body becomes the weapon through a personal vow. The mirrored layout clarifies the shared cost while preserving the difference in scale, motive, and responsibility.',
    },
  },
  'poison-memory-homecoming': {
    title: 'The final movement is decided by memory, not combat.',
    deck: 'Episodes 132–136 lower the volume after the two endgames. The Rose continues working inside the survivors, Meruem reconstructs the missing center of his identity, and the arc closes through a final Gungi game and several routes away from the palace.',
    progression: [
      { index: '01', episodes: '132', label: 'Return', title: 'Meruem rises without the memory that matters.', summary: 'Pouf and Youpi restore the King after the Rose, but the restored body is already carrying the weapon’s delayed consequence and Komugi is missing from his conscious priorities.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_132_(2011)' },
      { index: '02', episodes: '133', label: 'Concealment', title: 'The Guards defend an image of the King.', summary: 'Pouf tries to prevent Meruem from recovering the attachment that transformed him, treating memory itself as a threat to royal purpose.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_133_(2011)' },
      { index: '03', episodes: '134', label: 'Name', title: 'Welfin says “Komugi.”', summary: 'The name reconnects the missing sequence. Meruem’s recovered memory immediately outranks conquest, punishment, and the Guards’ attempt to preserve his former identity.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_134_(2011)' },
      { index: '04', episodes: '135', label: 'Choice', title: 'The King returns to the one contest he values.', summary: 'Knowing the Rose’s poison is terminal and contagious, Meruem asks Komugi to remain. She chooses the final game and the two die together.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_135_(2011)' },
    ],
    finalGame: {
      label: 'Final Gungi record',
      title: 'No throne, audience, or victory condition remains.',
      note: 'The board below is an abstract Gungi motif, not a reconstruction of a canonical piece position.',
      portraits: [
        { name: 'Meruem', role: 'The King who asks', image: '/media/portraits/meruem.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Meruem' },
        { name: 'Komugi', role: 'The champion who stays', image: '/media/portraits/komugi.webp', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Komugi' },
      ],
      beats: [
        { index: '01', label: 'Disclosure', text: 'Meruem explains that the poison will kill him and can spread through prolonged contact.' },
        { index: '02', label: 'Consent', text: 'Komugi understands the consequence and chooses to remain rather than be removed from him.' },
        { index: '03', label: 'Recognition', text: 'They address each other by name and complete the relationship outside rank and species hierarchy.' },
        { index: '04', label: 'End', text: 'The arc’s final decisive scene is a quiet game in darkness rather than another display of force.' },
      ],
      sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_135_(2011)',
    },
    survivorRoutes: [
      { id: 'final-room', label: 'Meruem and Komugi', destination: 'Final Gungi room', result: 'They die together after choosing companionship over conquest and escape.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_135_(2011)' },
      { id: 'reina-home', label: 'Reina and Bloster', destination: 'NGL village', result: 'Reina returns to her human mother, with Bloster helping carry a surviving Ant life back into a human home.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_136_(2011)' },
      { id: 'gyro-search', label: 'Welfin, Hina, and Bizeff', destination: 'Meteor City', result: 'Their route turns toward the search for Gyro rather than service to a dead King.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_136_(2011)' },
      { id: 'election-transition', label: 'Gon and the Association', destination: 'Hospital and chairman election', result: 'Gon’s critical condition and Netero’s death become the two immediate crises carried into the next arc.', sourceHref: 'https://hunterxhunter.fandom.com/wiki/Episode_136_(2011)' },
    ],
    transition: {
      label: 'Connection forward',
      title: 'The Ant crisis ends, but its costs reorganize the next story.',
      text: 'The external enemy is gone. The remaining plot is now institutional succession, medical rescue, Killua’s decision to seek Alluka, and the consequences of the choices made during extermination.',
    },
  },
});

export const chimeraAntEndgameSystemById = new Map(Object.entries(chimeraAntEndgameSystems));
