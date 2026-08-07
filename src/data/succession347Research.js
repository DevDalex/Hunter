const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_347';

export const succession347SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 347',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location,
  tracks,
  confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes',
}) => freeze({
  id,
  time: 'Pre-voyage · one month after the Zodiac meeting',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 347,
  confidence,
  source,
});

export const succession347TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-347-staged-assault-begins',
    title: 'Muherr’s men attack Ging and Pariston with conjured firearms',
    detail: 'Muherr’s henchmen open fire on Ging and Pariston using conjured guns that shoot aura bullets. Ging and Pariston retreat through an underground passage while Ging begins analyzing the attackers’ Nen and tactical intent.',
    location: 'Beyond Netero expedition team base · underground passage',
    tracks: ['ging', 'pariston', 'muherr', 'nen', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-ging-imitates-leorio',
    title: 'Ging reproduces Leorio’s remote-punch technique',
    detail: 'Ging knocks out three attackers by reproducing the remote-punch technique Leorio used on him. Ging explains that he has a talent for imitating physical-type striking abilities after he has personally been hit by them.',
    location: 'Beyond Netero expedition team base · underground passage',
    tracks: ['ging', 'leorio', 'nen', 'expedition'],
    confidence: 'Ging demonstrates a reproduced version of Leorio’s technique and explains his imitation talent; the chapter does not establish that this talent is itself a named Hatsu or that it applies to every Nen ability category',
  }),
  timelineEvent({
    id: 'pre-voyage-347-ging-leorio-medical-theory',
    title: 'Ging reconstructs a possible medical origin for Leorio’s ability',
    detail: 'Knowing Leorio wants to become a doctor, Ging theorizes that Leorio developed the technique through aura experimentation resembling tapping and ultrasound. Ging suggests aura could be spread through a surface to detect internal targets more discreetly than En, then uses the reconstructed principle to locate two enemies beyond a wall.',
    location: 'Beyond Netero expedition team base · underground passage',
    tracks: ['ging', 'leorio', 'nen', 'medical'],
    confidence: 'The ultrasound and medical-development explanation is Ging’s theory about how Leorio’s ability works, not a direct explanation from Leorio',
  }),
  timelineEvent({
    id: 'pre-voyage-347-aura-through-wall',
    title: 'Ging attacks two concealed enemies through a wall',
    detail: 'After locating two remaining attackers with the ultrasound-like aura method, Ging imagines the wall as tissue obstructing a tumor or blood clot and fires aura through it to knock them out. He then scans again and confirms that no further attackers remain.',
    location: 'Beyond Netero expedition team base · underground passage',
    tracks: ['ging', 'nen', 'combat'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-pariston-staging-exposed',
    title: 'Ging reveals that he knew Pariston staged the assault',
    detail: 'Ging says he recognized the attack as Pariston’s test from the beginning. His key clue is that the ultimatum never included the obvious option of both Ging and Pariston leaving. Ging says he played along for the sake of the people forced into the performance and tells Pariston to confront him directly if he wants to see Ging’s true abilities.',
    location: 'Beyond Netero expedition team base · post-assault',
    tracks: ['ging', 'pariston', 'counterplay'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-muherr-unit-role',
    title: 'Muherr clarifies that his soldiers are support specialists rather than front-line finishers',
    detail: 'When Ging criticizes the attackers as too weak for the Dark Continent, Muherr explains that their duties are reconnaissance, artillery support, and sniper covering fire. Direct shooting power is centered on Golem rather than on the individual soldiers alone.',
    location: 'Beyond Netero expedition team base',
    tracks: ['muherr', 'golem', 'stone-wall', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-golem-symbiotic-system',
    title: 'Golem’s symbiotic weapon system is explained',
    detail: 'Ging identifies Golem as a symbiotic-type Nen user, and Muherr confirms it. Golem conjures powerful heavy weapons while an Emitter supplies the aura bullets, allowing the weapon and ammunition to become stronger together than either component would be separately. Golem also supplied the firearms used by the attacking soldiers.',
    location: 'Beyond Netero expedition team base',
    tracks: ['golem', 'muherr', 'nen', 'symbiotic-nen', 'conjuration', 'emission'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-stone-wall-squad',
    title: 'The Stone Wall squad and its war record are identified',
    detail: 'Golem and ten soldiers with assault and reconnaissance duties form the Stone Wall squad. The supplied synopsis describes the unit as legendary for emerging from the Lubo civil war without a single casualty, reflecting a doctrine built around group warfare, real firearms, and Nen-enhanced ammunition.',
    location: 'Beyond Netero expedition team base / Lubo civil-war record',
    tracks: ['golem', 'muherr', 'stone-wall', 'lubo', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-golem-identity-unknown',
    title: 'Golem refuses to disclose a real identity',
    detail: 'When Ging asks for Golem’s real name, a distorted voice says that Golem is only the name used by comrades and refuses further questions. Muherr says that even after more than three years he still does not know who pilots or operates Golem.',
    location: 'Beyond Netero expedition team base',
    tracks: ['golem', 'muherr', 'identity'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-money-dispute-explained',
    title: 'Muherr explains why Ging’s money offer threatened soldier trust',
    detail: 'Muherr tells Ging that soldiers value mutual trust above money and that the appearance of being bought could ostracize members or push them to quit. Ging admits he did not anticipate the damage and apologizes because he cannot simply take back money already accepted.',
    location: 'Beyond Netero expedition team base',
    tracks: ['ging', 'muherr', 'expedition', 'team-cohesion'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-norwell-fund-solution',
    title: 'Ging proposes routing the money through the Norwell Fund',
    detail: 'To settle the dispute, Ging proposes depositing the money through a grandchild account of the Norwell Fund for families of fallen soldiers. The arrangement prevents the payment from functioning as a private purchase of loyalty and binds Ging into the mercenary account structure rather than leaving individual members exposed to rumors.',
    location: 'Beyond Netero expedition team base',
    tracks: ['ging', 'muherr', 'norwell-fund', 'team-cohesion'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-ging-explains-motive',
    title: 'Ging admits the money offer was an awkward attempt to be accepted',
    detail: 'Ging says he was not trying to buy the expedition members. He believed they were exactly the kind of people who could not be bought, so accepting his money felt like a sign that they had accepted him. He also admits frustration that Beyond’s expedition made his own solo Dark Continent plan impossible, while simultaneously respecting that Beyond challenged the continent first.',
    location: 'Beyond Netero expedition team base',
    tracks: ['ging', 'beyond', 'expedition', 'team-cohesion'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-mascher-marione-assessment',
    title: 'Mascher and Marione accept Ging’s usefulness despite his disruptive entrance',
    detail: 'Mascher explains that he originally saw Ging as a provocative troublemaker, but hearing Ging and Pariston discuss Isaac Netero and the Dark Continent changed his assessment. Mascher and Marione had been ready to intervene if disorder escalated, yet they acknowledge that Ging’s leadership has real merits.',
    location: 'Beyond Netero expedition team base',
    tracks: ['ging', 'mascher', 'marione', 'pariston', 'netero'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-command-structure-settled',
    title: 'Ging becomes No. 2 while Muherr retains absolute battlefield command',
    detail: 'Muherr agrees to settle the dispute through the Norwell Fund and accept Ging as No. 2. The operational boundary is explicit: Muherr gives the battlefield orders to the soldiers, and those orders are absolute. Ging accepts the arrangement and treats his No. 2 authority as largely nominal.',
    location: 'Beyond Netero expedition team base',
    tracks: ['ging', 'muherr', 'beyond', 'expedition', 'command'],
  }),
  timelineEvent({
    id: 'pre-voyage-347-pariston-recognizes-ging-no2',
    title: 'Pariston accepts Ging’s position and invites him to lead without holding back',
    detail: 'Pariston confirms that the returning members will accept Ging and sends him the contact list for the remaining payments after the infiltration attempt fails. Ging says Pariston can continue leading despite Ging’s nominal rank, but Pariston declines and wants to see how Ging handles the role. Ging answers that he will not hold back.',
    location: 'Beyond Netero expedition team base',
    tracks: ['ging', 'pariston', 'expedition', 'leadership'],
  }),
]);

export const succession347AbilityRecords = freeze([
  freeze({
    user: 'Ging Freecss',
    ability: 'Physical-strike ability imitation',
    type: 'Nen talent / technique reproduction; not established as a named Hatsu',
    mechanics: 'Ging can reproduce a physical-type striking Nen technique after personally being hit by it. In Chapter 347 he demonstrates this by reproducing Leorio’s remote punch and extending the underlying aura-through-surface principle to detection and attacks through a wall.',
    chapters: '347',
    conditions: 'Ging explicitly ties the talent to physical-type abilities he has been hit by. The complete category range, duration, accuracy limits, and whether every qualifying ability can be reproduced remain unknown.',
    source,
  }),
  freeze({
    user: 'Golem',
    ability: 'Symbiotic conjured weapon system',
    type: 'Symbiotic Nen · Conjuration paired with Emission',
    mechanics: 'Golem conjures heavy weapons while a cooperating Emitter supplies aura bullets. The separation of weapon creation and ammunition emission allows both components to function more powerfully together than if produced by one person alone. Golem can also provide conjured firearms for allied soldiers.',
    chapters: '347',
    conditions: 'Requires cooperation between Golem’s conjured weapon system and an Emitter supplying the aura bullets. Golem’s real identity, pilot, full number of compatible users, and complete weapon limits are not revealed.',
    source,
  }),
]);

export const succession347StoneWallRecord = freeze({
  name: 'Stone Wall',
  composition: 'Golem plus ten soldiers with assault and reconnaissance duties',
  battlefieldRoles: freeze(['Reconnaissance', 'Artillery support', 'Sniper covering fire', 'Nen-enhanced firearms']),
  directFireCenter: 'Golem’s symbiotic weapon system and cooperating Emitters',
  historicalRecord: 'Described in the supplied synopsis as emerging from the Lubo civil war without a single casualty',
  source,
});

export const succession347CommandStructure = freeze({
  expeditionNo2: 'Ging Freecss',
  no2Nature: 'Nominal / strategic position beneath Beyond Netero',
  battlefieldCommander: 'Muherr',
  battlefieldRule: 'Muherr’s orders to the soldiers are absolute',
  financialSettlement: 'Ging’s payment offer is redirected through a Norwell Fund grandchild account rather than treated as private payment for individual loyalty',
  paristonPosition: 'Pariston accepts Ging as No. 2 and declines Ging’s offer to keep leading in his place',
  source,
});

export const succession347RelationshipRecords = freeze([
  freeze({
    from: 'Ging Freecss',
    to: 'Muherr',
    type: 'Strategic rank / battlefield command split',
    note: 'Ging becomes Beyond’s No. 2, but Muherr retains absolute battlefield authority over the soldier divisions. Ging explicitly accepts this operational boundary.',
    phase: 'Pre-voyage expedition preparation',
    chapters: '347–current',
    state: 'cooperative',
    source,
  }),
  freeze({
    from: 'Ging Freecss',
    to: 'Pariston Hill',
    type: 'Competitive expedition leadership',
    note: 'Ging exposes Pariston’s staged test, while Pariston ultimately accepts Ging’s No. 2 position and challenges him to actually lead rather than defer back to Pariston.',
    phase: 'Pre-voyage expedition preparation',
    chapters: '347–current',
    state: 'competitive',
    source,
  }),
  freeze({
    from: 'Golem',
    to: 'Stone Wall squad',
    type: 'Symbiotic combat support',
    note: 'Golem’s conjured weapon platform and cooperating Emitters provide the squad’s core Nen-enhanced firepower while the other soldiers specialize in reconnaissance and supporting fire.',
    phase: 'Pre-voyage expedition preparation',
    chapters: '347–current',
    state: 'active',
    source,
  }),
]);

export const succession347ObjectRecords = freeze([
  freeze({
    name: 'Norwell Fund grandchild account',
    note: 'The Chapter 347 settlement routes Ging’s money through a fund for families of fallen soldiers so the payment is not treated as individual purchase of loyalty. The arrangement also places Ging within the mercenary account hierarchy described by Muherr.',
    source,
  }),
]);

const focus = 'Ging defeats Muherr’s staged attackers by reproducing Leorio’s remote-punch technique, explains his talent for imitating physical striking abilities he has been hit by, and theorizes a medical/ultrasound basis for Leorio’s aura control; Ging exposes Pariston as the architect of the test; Muherr reveals Golem’s symbiotic Conjuration-and-Emission weapon system and the Stone Wall squad; Ging apologizes for the disruption caused by his money offer and resolves it through the Norwell Fund; Ging is accepted as Beyond’s No. 2 while Muherr retains absolute battlefield command, and Pariston challenges Ging to lead without holding back.';

export const succession347ChapterResearch = freeze([
  freeze({
    number: 347,
    title: 'Inauguration',
    japaneseTitle: 'しゅうにん',
    romanizedTitle: 'Shunin',
    suppliedTitleMarker: '#i 1I',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Ging & Pariston',
      'Nen mechanics',
      'Leorio ability reconstruction',
      'Golem / symbiotic Nen',
      'Stone Wall squad',
      'Beyond expedition team',
      'Command structure',
    ]),
    focus,
    events: succession347TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Ging Freecss',
      'Pariston Hill',
      'Muherr',
      'Leorio Paradinight',
      'Golem',
      'Mascher',
      'Marione',
      'Beyond Netero',
      'Isaac Netero',
      'Stone Wall squad',
      'Muherr’s soldiers',
    ]),
    locations: freeze([
      'Beyond Netero expedition team base',
      'Beyond Netero expedition team base · underground passage',
      'Lubo civil-war historical record',
    ]),
    threadLabels: freeze([
      'Ging & Pariston',
      'Nen development',
      'Leorio',
      'Golem',
      'Stone Wall',
      'Beyond expedition team',
      'Expedition command',
    ]),
    abilities: succession347AbilityRecords,
    stoneWall: succession347StoneWallRecord,
    commandStructure: succession347CommandStructure,
    relationships: succession347RelationshipRecords,
    objects: succession347ObjectRecords,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 347 text',
      'Ging demonstrably reproduces Leorio’s remote-punch technique; the broader talent is stored according to Ging’s own explanation that it applies to physical striking abilities he has been hit by',
      'The medical and ultrasound-like explanation for Leorio’s technique is explicitly stored as Ging’s theory rather than direct confirmation from Leorio',
      'Golem is confirmed as a symbiotic-type Nen user with a Conjuration-and-Emission team system, while the true identity or pilot remains unresolved',
      'The Stone Wall unit composition and Lubo civil-war record are preserved as stated in the supplied synopsis',
      'Ging’s No. 2 rank is separated from battlefield authority: Muherr’s orders to the soldiers remain absolute',
      'The supplied chapter text names the Norwell Fund and describes a grandchild-account settlement; no outside financial details are added',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, Ging imitation mechanics, Leorio reconstruction theory, Golem symbiotic system, Stone Wall unit profile, command hierarchy, relationships, objects, mysteries, and source confidence linked',
    coverage: freeze({
      identity: true,
      publication: false,
      summary: true,
      sceneSummary: true,
      chronology: true,
      appearances: true,
      locations: true,
      relationships: true,
      assignments: true,
      nen: true,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession347ChapterFocus = freeze({ 347: focus });

export const succession347Mysteries = freeze([
  freeze({
    question: 'Who or what is actually operating Golem?',
    evidence: 'Chapter 347 says Golem is only the name used by comrades. A distorted voice refuses further questions, and Muherr says that after more than three years he still does not know who pilots or operates it.',
    status: 'open',
    lastChapter: '347',
    source,
  }),
  freeze({
    question: 'What are the full limits of Ging’s ability-imitation talent?',
    evidence: 'Ging says he can imitate physical-type striking abilities after being hit by them and demonstrates this with Leorio’s remote punch, but the chapter does not define the full category range, permanence, fidelity, or number of techniques he can reproduce.',
    status: 'open',
    lastChapter: '347',
    source,
  }),
]);
