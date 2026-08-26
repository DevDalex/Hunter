const freeze = (value) => Object.freeze(value);
const source392 = 'https://hunterxhunter.fandom.com/wiki/Chapter_392';

export const succession392SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 392 synopsis, trivia, and note text',
  chapterUrl: source392,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 392 directly continues the Voyage Day 10 Tier 3 operation from Chapter 391. No exact clock time is supplied or invented.',
  retrospectiveIdentityBoundary: 'The supplied note says Chapter 405 later reveals that the man treated as Hisoka in this chapter was Bonolenov using Metamorphorsen. That is retrospective Chapter 405 knowledge and is excluded from Chapter 392 character, event, ability, and reader-knowledge state. At the Chapter 392 boundary the target is recorded only as an apparent Hisoka / man believed by Lynch and Zakuro to be Hisoka.',
  excluded: freeze([
    'Backfilling Bonolenov or Metamorphorsen into the Chapter 392 encounter as contemporaneous knowledge',
    'Tagging the apparent-Hisoka encounter as an objectively confirmed Hisoka appearance',
    'Treating Padaille as alive because Misha’s post-mortem disposal effect makes his corpse appear to walk away',
    'Inventing an official name, Nen category, range, visibility rule, disposal method, or other unstated mechanics for Misha Hao’s post-mortem ability',
    'Treating Corporal Maizan’s guess that the unplanned wired room belongs to Heil-Ly as confirmed hideout ownership',
    'Inventing a mechanical explanation for why Lynch’s Body and Soul punch seemingly fails against the apparent Hisoka',
    'Treating Ken’i Wang’s strategic assessments, Hisoka personality reading, or Luini marking-condition analysis as objective future outcomes',
    'Importing Luini’s later fate into Chapter 392; he is alive and confronting the Troupe at this chapter boundary',
    'Turning the kiosk woman’s shipment information into a universal logistics guarantee beyond the conditions she describes',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Tier 3', confidence = 'Confirmed in the supplied Hunterpedia Chapter 392 synopsis' }) => freeze({
  id,
  day: 10,
  time: 'Voyage Day 10 · exact clock time unsupplied',
  chronology: 'direct continuation of Chapter 391 on Voyage Day 10; exact clock time unsupplied',
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 392,
  confidence,
  source: source392,
});

export const succession392TimelineEvents = freeze([
  timelineEvent({
    id: '392-padaille-corpse-public-cover',
    label: 'Padaille’s corpse appears to leave the plaza under a civilian cover story',
    detail: 'As soldiers calm the crowd, Padaille’s corpse rises with aura around it and stands beside Hinrigh. Padaille appears to answer the soldiers, while Hinrigh confirms his Xi-Yu identity and presents Padaille as a civilian after a resolved fight. The later Misha reveal explains the apparent movement; Padaille remains dead from Chapter 391.',
    people: ['Hinrigh Biganduffno', 'Padaille', 'Maizan', 'Misha Hao'],
    tracks: ['xi-yu', 'padaille', 'misha', 'post-mortem-nen', 'tier-3'],
    location: 'Tier 3 · Area E plaza aftermath',
  }),
  timelineEvent({
    id: '392-maizan-secret-room-lead',
    label: 'Corporal Maizan offers Hinrigh a lead on an unplanned wired room',
    detail: 'Maizan privately offers information on Morena’s possible location. Hinrigh offers 50 million if the information is reliable; Maizan demands at least 30 million upfront. Maizan says workers wired a room absent from the ship plans and were told to stay quiet, then guesses that it must be Heil-Ly if Xi-Yu has no secret hideout. Hinrigh requires Maizan to lead him there personally before treating the lead as confirmed.',
    people: ['Hinrigh Biganduffno', 'Maizan', 'Morena Prudo'],
    tracks: ['xi-yu', 'heil-ly', 'maizan', 'intelligence', 'secret-room'],
    confidence: 'The wiring lead and price negotiation are confirmed; Heil-Ly ownership is Maizan’s inference and remains unverified.',
  }),
  timelineEvent({
    id: '392-misha-postmortem-disposal-reveal',
    label: 'Misha Hao’s post-mortem Nen disposal role is revealed',
    detail: 'A deceased Xi-Yu member with a bullet hole in her head is shown riding on Padaille’s corpse. Misha Hao, formerly the Xi-Yu undertaker, has a post-mortem Nen ability that causes her to appear and inconspicuously dispose of people killed by Xi-Yu members, then vanish after the corpse is dealt with. No official ability name is supplied.',
    people: ['Misha Hao', 'Padaille', 'Hinrigh Biganduffno'],
    tracks: ['xi-yu', 'misha', 'post-mortem-nen', 'padaille'],
  }),
  timelineEvent({
    id: '392-hanal-body-and-soul-check',
    label: 'Lynch uses Body and Soul to rule Hanal out as Hisoka',
    detail: 'A Bloody Mary drop identifies Hanal as another candidate. Lynch asks whether he is Hisoka and punches him with Body and Soul. Hanal’s inner soul answers that he is not. Lynch tells his friends that Xi-Yu is conducting a manhunt and offers compensation through the Tier 4 hideout.',
    people: ['Lynch Fullbokko', 'Zakuro Custard', 'Hanal'],
    tracks: ['xi-yu', 'hisoka-search', 'bloody-mary', 'body-and-soul', 'nen'],
    location: 'Tier 3 · public search area',
  }),
  timelineEvent({
    id: '392-apparent-hisoka-found',
    label: 'Zakuro and Lynch locate a man they believe is Hisoka',
    detail: 'Zakuro’s search identifies another candidate in a crowded area. Lynch and Zakuro follow the tall man, whose hair is down and who wears no makeup, into an empty corridor. At the Chapter 392 knowledge boundary they identify him as Hisoka, but the archive does not convert that belief into an objective identity tag because the supplied retrospective note belongs to Chapter 405.',
    people: ['Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'hisoka-search', 'identity-uncertain', 'tier-3'],
    location: 'Tier 3 · crowded area to empty corridor',
    confidence: 'Confirmed encounter with a man believed to be Hisoka; objective identity deliberately unresolved at Chapter 392 boundary.',
  }),
  timelineEvent({
    id: '392-apparent-hisoka-counters-lynch',
    label: 'The apparent Hisoka reflexively counters Lynch and intimidates Zakuro',
    detail: 'Lynch punches the apparent Hisoka to activate Body and Soul, but the punch seemingly does not work and Lynch suddenly falls. The man calls his counter a reflex. Lynch later groans, establishing that she is alive. Zakuro is overwhelmed by the man’s aura, concludes he must be Hisoka, and nervously invites him to accompany Xi-Yu to learn why the Mafia is searching for him.',
    people: ['Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'hisoka-search', 'body-and-soul', 'nen', 'identity-uncertain'],
    location: 'Tier 3 · empty corridor',
    confidence: 'Observed sequence confirmed; the counter/resistance mechanism and objective identity are unresolved at this boundary.',
  }),
  timelineEvent({
    id: '392-tsudonke-kiosk-intelligence',
    label: 'Tsudonke buys lower-tier gossip about the Area E disturbance',
    detail: 'At a kiosk, an old woman tells Tsudonke that gunshots were heard in Area E’s plaza, that soldiers, Xi-Yu, and civilians were involved, and that a military gag order is likely. She says lower-tier grunts may talk for money but probably lack worthwhile information.',
    people: ['Tsudonke'],
    tracks: ['cha-r', 'tier-3', 'information-market'],
    location: 'Lower-tier kiosk',
  }),
  timelineEvent({
    id: '392-autograph-paper-shipment-logistics',
    label: 'Tsudonke learns upper-tier ordering and final-shipment deadlines',
    detail: 'The kiosk woman says a Tier 1 general store can arrange requested goods for upper-class customers. She gives the last air-shipment order deadline as Voyage Day 14 and says the high-speed-boat deadline is three days earlier. Small items might be drone-delivered, with extensions depending on connections and cash. Tsudonke decides he has four days to find Hisoka so he can request autograph paper as his reward.',
    people: ['Tsudonke'],
    tracks: ['cha-r', 'logistics', 'phantom-troupe', 'hisoka-search'],
    location: 'Lower-tier kiosk',
  }),
  timelineEvent({
    id: '392-keni-expands-search',
    label: 'Ken’i Wang expands the Cha-R Hisoka search after the Area E clash',
    detail: 'A Cha-R member reports that someone clashed with Xi-Yu in Area E and that Hinrigh was apparently involved. Ken’i sends Tsudonke and his men to gather information as far as Area C if necessary and report back to the Troupe at the Cha-R office.',
    people: ["Ken'i Wang", 'Tsudonke', 'Hinrigh Biganduffno'],
    tracks: ['cha-r', 'xi-yu', 'hisoka-search', 'tier-3'],
  }),
  timelineEvent({
    id: '392-keni-balance-strategy',
    label: 'Ken’i prioritizes using Hisoka to balance Heil-Ly and the Phantom Troupe',
    detail: 'Ken’i reasons that the Troupe is waiting for a Heil-Ly hitman whose marking condition has already been fulfilled, recalls Ittoku’s warning about the Troupe eventually looting Tier 1, and orders Cha-R members not to approach Hisoka before he arrives. His strategy is to negotiate with Hisoka and, if possible, let Hisoka, Heil-Ly, and the Troupe damage one another while Cha-R preserves balance. His reading that Hisoka likes stacking the deck against himself comes from fight footage and remains Ken’i’s assessment.',
    people: ["Ken'i Wang", 'Ittoku', 'Tsudonke'],
    tracks: ['cha-r', 'hisoka-search', 'heil-ly', 'phantom-troupe', 'strategy'],
    confidence: 'Ken’i’s orders are confirmed; his hitman-condition model, Hisoka personality reading, and projected balance outcome remain character assessments.',
  }),
  timelineEvent({
    id: '392-troupe-office-search-plan',
    label: 'Nobunaga proposes two-person search shifts from the Cha-R office',
    detail: 'At the Cha-R office on Tier 5, Nobunaga suggests bringing Franklin and splitting into two-person search teams. Phinks doubts Franklin will accept because he dislikes cramped places. Feitan cautions that the enemy is reluctant to attack all three together and that they should not lose patience.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Franklin Bordeau'],
    tracks: ['phantom-troupe', 'cha-r', 'heil-ly', 'tier-5'],
    location: 'Tier 5 · Cha-R office',
  }),
  timelineEvent({
    id: '392-luini-probes-office',
    label: 'Luini probes the Cha-R office through an opening',
    detail: 'An arm appears through an opening and knocks despite the attacker having an apparent surprise advantage. When a returning search team reaches the front room, nobody is found outside and Phinks infers that they were taken. Nobunaga orders the non-Nen Cha-R personnel into the other room while the monitors are watched.',
    people: ['Luini', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Vic'],
    tracks: ['heil-ly', 'phantom-troupe', 'cha-r', 'spatial-nen', 'tier-5'],
    location: 'Tier 5 · Cha-R office',
    confidence: 'The opening and disappearance sequence is observed; no complete ability rule set is invented from it.',
  }),
  timelineEvent({
    id: '392-luini-confronts-troupe',
    label: 'Luini directly confronts Nobunaga, Phinks, and Feitan',
    detail: 'Luini reveals his face through an opening in the front door and berates the Troupe for cooperating with Cha-R instead of using the upper-tier route to attack the rich. Phinks and Feitan react with disgust; Feitan questions how much Luini knows about the Troupe. Nobunaga draws his katana and threatens him. Luini is alive at the end of the supplied Chapter 392 material.',
    people: ['Luini', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['heil-ly', 'phantom-troupe', 'cha-r', 'confrontation', 'tier-5'],
    location: 'Tier 5 · Cha-R office',
  }),
]);

export const succession392MishaResearch = freeze({
  status: 'Misha Hao is already deceased; Chapter 392 reveals a post-mortem Nen manifestation tied to her former Xi-Yu undertaker role.',
  triggerBoundary: 'The supplied synopsis says her ability causes her to appear and inconspicuously dispose of any person killed by a Xi-Yu member.',
  observedUse: 'Padaille was killed by Hinrigh in Chapter 391. In Chapter 392 Misha appears on/with his corpse, the corpse is publicly carried away under cover, and Misha vanishes after the corpse is dealt with.',
  namingBoundary: 'No formal ability name is supplied. Any archive-facing label is descriptive only.',
  mechanicsBoundary: 'Nen category, exact manifestation trigger timing, visibility rules, range, corpse-control mechanism, disposal destination/method, exceptions, duration, and limits are not supplied.',
  source: source392,
});

export const succession392MaizanIntelResearch = freeze({
  seller: 'Corporal Maizan',
  buyer: 'Hinrigh Biganduffno',
  offer: 'Hinrigh offers 50 million if the information is reliable; Maizan demands at least 30 million upfront.',
  evidence: 'Maizan says the man in charge of Black Whale wiring told him to stay quiet after Maizan asked about workers who had been silenced. Those workers had wired a room absent from the ship plans.',
  inference: 'Maizan guesses that the room belongs to Heil-Ly if Xi-Yu has no secret hideout. This is an unverified attribution, not confirmed Morena location evidence.',
  verificationProtocol: 'Hinrigh refuses to pay the full amount on assertion alone and requires Maizan to personally lead him to the location.',
  source: source392,
});

export const succession392ApparentHisokaResearch = freeze({
  contemporaneousIdentity: 'At the Chapter 392 boundary Lynch and Zakuro believe the man they locate is Hisoka. Zakuro reaches that conclusion from the man’s aura and effortless counter against Lynch.',
  retrospectiveBoundary: 'The user-supplied note states that Chapter 405 later reveals the man to be Bonolenov disguised as Hisoka with Metamorphorsen. That later reveal is recorded only as retrospective metadata and must not be injected into Chapter 392 event participants, ability mechanics, or character knowledge.',
  bodyAndSoulHanalUse: 'Lynch punches Hanal with Body and Soul and his inner soul answers that he is not Hisoka.',
  bodyAndSoulCounterUse: 'Lynch tries Body and Soul on the apparent Hisoka; her punch seemingly fails and she abruptly falls. The man describes his counter as reflexive. No resistance or counter mechanic is inferred beyond the observed sequence.',
  lynchState: 'Lynch groans afterward and is therefore alive at this boundary.',
  zakuroState: 'Zakuro becomes visibly frightened and invites the apparent Hisoka to accompany Xi-Yu to learn why the Mafia is searching for him.',
  source: source392,
});

export const succession392ChaRStrategyResearch = freeze({
  tsudonkeGoal: 'Tsudonke wants proper autograph paper for the Phantom Troupe and gives himself four days to find Hisoka so he can request it as a reward.',
  logistics: 'The kiosk woman gives Voyage Day 14 as the last air-shipment order deadline, with the high-speed-boat deadline three days earlier; she says tiny items may be drone-delivered and connections/cash can affect flexibility.',
  searchOrder: 'Ken’i sends Tsudonke and his men to gather information as far as Area C if necessary and report findings back to the Troupe at the office.',
  luiniAssessment: 'Ken’i believes the Troupe is waiting for the Heil-Ly hitman because a marking condition has already been fulfilled. The synopsis presents this as Ken’i’s assessment, not a fully demonstrated system specification.',
  balancePlan: 'Ken’i prioritizes finding and negotiating with Hisoka so Cha-R can potentially let Hisoka, Heil-Ly, and the Troupe attack one another while preserving mafia balance.',
  hisokaAssessment: 'Ken’i cites Hisoka’s Heavens Arena Floor Master status and interprets fight footage as suggesting Hisoka likes stacking the deck against himself. This remains Ken’i’s reading of Hisoka, not a mechanical rule.',
  source: source392,
});

export const succession392LuiniTroupeResearch = freeze({
  troupeState: 'Nobunaga, Phinks, and Feitan remain together at the Cha-R Tier 5 office and discuss eventually splitting into two-person search shifts, potentially involving Franklin.',
  intrusion: 'Luini interacts with the office through Nen-created openings, first presenting an arm/knock and later his face through the front door.',
  searchTeamBoundary: 'The returning Cha-R search team disappears from the immediate doorway sequence. The supplied synopsis does not provide a full mechanical explanation beyond the spatial-opening attack context.',
  confrontation: 'Luini berates the Troupe for not attacking upper-tier elites. Phinks and Feitan reject his interpretation; Nobunaga draws his katana and threatens him.',
  fateBoundary: 'Luini is alive at the end of the supplied Chapter 392 material. No later outcome is imported.',
  abilityBoundary: 'The chapter shows spatial openings and contains Ken’i’s marking-condition assessment, but the archive does not invent a formal ability name or exhaustive spatial mechanics from this synopsis alone.',
  source: source392,
});

export const succession392ResolvedQuestions = freeze([
  freeze({ question: 'What was Hinrigh relying on Misha to do after killing Padaille?', chapter: 392, resolution: 'Misha Hao is the deceased Xi-Yu undertaker whose post-mortem Nen appears to inconspicuously dispose of people killed by Xi-Yu members. Padaille is the demonstrated Chapter 392 cleanup target.', source: source392 }),
  freeze({ question: 'Can Body and Soul distinguish a false Hisoka candidate?', chapter: 392, resolution: 'Hanal is punched and his inner soul answers that he is not Hisoka. The later apparent-Hisoka encounter does not reveal why Lynch’s activation seemingly fails.', source: source392 }),
]);

export const succession392Mysteries = freeze([
  freeze({ question: 'Where exactly is the unplanned wired room Maizan discovered, and does it actually belong to Heil-Ly?', chapter: 392, status: 'open; Maizan has a wiring/ship-plan lead but Heil-Ly ownership is only his guess', source: source392 }),
  freeze({ question: 'What are the complete mechanics and official name of Misha Hao’s post-mortem disposal ability?', chapter: 392, status: 'open; trigger purpose is disclosed but category, formal name, range, visibility, disposal method, and limits remain unsupplied', source: source392 }),
  freeze({ question: 'Why did Body and Soul seemingly fail against the man Lynch and Zakuro believed was Hisoka?', chapter: 392, status: 'open at Chapter 392; only the reflex-counter sequence is observed', source: source392 }),
  freeze({ question: 'Who objectively is the man Lynch and Zakuro identify as Hisoka?', chapter: 392, status: 'unresolved within Chapter 392; the supplied Chapter 405 retrospective reveal is not backfilled into this chapter boundary', source: source392 }),
  freeze({ question: 'Will Ken’i or Hinrigh successfully negotiate with the apparent Hisoka, and will the planned three-way balance work?', chapter: 392, status: 'open; this is Ken’i’s strategy, not a completed outcome', source: source392 }),
  freeze({ question: 'What are the complete rules of Luini’s spatial ability and marking condition?', chapter: 392, status: 'open; openings are demonstrated and Ken’i discusses a fulfilled marking condition, but complete rules are not supplied here', source: source392 }),
]);

export const succession392RelationshipRecords = freeze([
  freeze({
    id: 'relationship:hinrigh-maizan-ch392-intelligence-deal',
    from: 'Hinrigh Biganduffno',
    to: 'Maizan',
    type: 'professional',
    chapter: 392,
    state: 'Maizan offers Hinrigh a dangerous lead about an unplanned wired room; Hinrigh offers 50 million for reliable information while Maizan demands 30 million upfront and must personally guide Hinrigh to the location.',
    boundary: 'Transactional intelligence deal; Maizan’s attribution of the room to Heil-Ly remains an unverified guess.',
    source: source392,
  }),
  freeze({
    id: 'relationship:luini-troupe-ch392-hostile-contact',
    from: 'Luini',
    to: 'Nobunaga / Phinks / Feitan',
    type: 'hostile',
    chapter: 392,
    state: 'Luini directly confronts and taunts the three Troupe members through a spatial opening; Nobunaga responds by drawing his katana and threatening him.',
    boundary: 'Direct hostile contact is confirmed; no later combat outcome or Luini death is imported.',
    source: source392,
  }),
]);

export const succession392ChapterResearch = freeze([
  freeze({
    number: 392,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 10',
    source: source392,
    sourcePolicy: succession392SourcePolicy,
    chronology: freeze({
      voyageDay: 'Voyage Day 10 continuation inherited from the immediate Chapter 391 Tier 3 aftermath',
      exactClockTime: null,
      opening: 'Direct continuation of Padaille’s Chapter 391 death and the public crowd gathering around Hinrigh on Tier 3.',
      boundary: 'No exact Chapter 392 clock time is supplied; none is invented.',
    }),
    focus: 'Misha Hao’s post-mortem cleanup ability resolves Hinrigh’s Chapter 391 Misha reference, Maizan sells Hinrigh an unverified secret-room lead, Lynch and Zakuro use Bloody Mary and Body and Soul while encountering a man they believe is Hisoka, Cha-R develops a Hisoka-centered balance strategy, and Luini directly confronts Nobunaga, Phinks, and Feitan at the Tier 5 office.',
    lanes: freeze(['Xi-Yu / Hisoka search', 'Xi-Yu / Heil-Ly intelligence', 'Cha-R balancing strategy', 'Phantom Troupe / Luini confrontation']),
    timelineEvents: succession392TimelineEvents,
    resolvedQuestions: succession392ResolvedQuestions,
    mysteries: succession392Mysteries,
  }),
]);

export const succession392ChapterFocus = succession392ChapterResearch[0].focus;
